"use server";

import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

// Kita minta Client Component (TransactionManager) mengirimkan data akun & kategorinya
export async function addTransactionWithAI(
  userText: string,
  accounts: { id: string; name: string; initial_balance: number | string }[],
  categories: { id: string; name: string; type: string }[]
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: "Sesi habis. Silakan refresh halaman atau login kembali." };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { error: "API Key Gemini belum diatur di server." };

    // Pengecekan data (Sekarang data pasti ada karena dilempar dari Client)
    if (!accounts || accounts.length === 0) {
      return { error: "Buat minimal 1 Akun Kas terlebih dahulu di menu Akun Kas." };
    }
    if (!categories || categories.length === 0) {
      return { error: "Data kategori tidak ditemukan. Silakan tambahkan kategori." };
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    
    // Ambil riwayat transaksi
    const { data: recentTransactions } = await supabase
      .from("transactions")
      .select(`
        type, amount, transaction_date, description, account_id,
        categories (name)
      `)
      .gte("transaction_date", firstDayOfMonth)
      .order("transaction_date", { ascending: false })
      .limit(100);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
    const today = now.toISOString().split("T")[0];

    const prompt = `
      Kamu adalah Asisten Keuangan Pribadi yang jenius, ramah, dan multi-fungsi.
      
      DATA SISTEM SAAT INI:
      - Tanggal Hari Ini: ${today}
      - Daftar Akun Kas: ${JSON.stringify(accounts.map(a => ({ id: a.id, name: a.name })))}
      - Daftar Kategori: ${JSON.stringify(categories)}
      - Riwayat Transaksi Bulan Ini: ${JSON.stringify(recentTransactions || [])}

      PERINTAH USER: "${userText}"

      TUGASMU:
      Analisis perintah user. Apakah dia ingin MENCATAT transaksi baru (insert), atau BERTANYA tentang laporannya (query)?

      KEMBALIKAN HANYA OBJEK JSON MURNI (tanpa markdown \`\`\`json), dengan format wajib ini:
      {
        "intent": "insert" | "query",
        "message": "Jika insert: 'Berhasil mencatat...'. Jika query: Jawab pertanyaan user berdasarkan data Riwayat Transaksi di atas dengan gaya bahasa santai (kamu) dan informatif. Gunakan tag HTML <br/> untuk baris baru atau <b> untuk huruf tebal agar rapi.",
        "transaction_data": { 
          "type": "expense" | "income",
          "amount": 25000,
          "account_id": "uuid-akun-paling-cocok",
          "category_id": "uuid-kategori-paling-cocok",
          "description": "Beli nasi goreng",
          "transaction_date": "YYYY-MM-DD"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    let aiText = result.response.text().trim();

    if (aiText.startsWith("```json")) {
      aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
    } else if (aiText.startsWith("```")) {
      aiText = aiText.replace(/```/g, "").trim();
    }

    const parsedData = JSON.parse(aiText);

    if (parsedData.intent === "insert" && parsedData.transaction_data) {
      const tx = parsedData.transaction_data;
      
      // ==========================================
      // PELINDUNG SALDO (Validasi sebelum Insert via AI)
      // ==========================================
      if (tx.type === "expense") {
        const accTarget = accounts.find((a) => a.id === tx.account_id);
        let currentBalance = Number(accTarget?.initial_balance) || 0;
        
        const { data: allTxs } = await supabase.from("transactions").select("amount, type").eq("account_id", tx.account_id);
        if (allTxs) {
          allTxs.forEach((t: any) => {
            if (t.type === "income") currentBalance += Number(t.amount);
            else currentBalance -= Number(t.amount);
          });
        }

        if (currentBalance < tx.amount) {
           return { 
             error: `⚠️ Transaksi ditolak sistem: Saldo Kas kamu tidak cukup! Sisa saldo di akun tersebut hanya Rp ${currentBalance.toLocaleString("id-ID")}, sementara kamu mencoba mengeluarkan Rp ${tx.amount.toLocaleString("id-ID")}.` 
           };
        }
      }
      
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: tx.type,
        amount: tx.amount,
        account_id: tx.account_id,
        category_id: tx.category_id,
        description: tx.description,
        transaction_date: tx.transaction_date || today
      });

      if (error) throw error;

      revalidatePath("/transactions");
      revalidatePath("/dashboard");
      revalidatePath("/accounts");
      revalidatePath("/reports");

      return { success: true, message: parsedData.message, isQuery: false };
    
    } else if (parsedData.intent === "query") {
      return { success: true, message: parsedData.message, isQuery: true };
    }

    return { error: "AI tidak memahami perintahmu." };

  } catch (err: any) {
    console.error("AI Error:", err.message);
    
    if (err.message?.includes("503") || err.message?.includes("high demand")) {
      return { error: "⚠️ Server AI sedang penuh karena tingginya antrean. Mohon tunggu 10 detik dan coba lagi ya!" };
    }
    if (err.message?.includes("429") || err.message?.includes("quota")) {
      return { error: "⚠️ Kuota AI harianmu sudah habis, silakan coba lagi besok." };
    }

    return { error: "Gagal memproses permintaanmu. Pastikan format bahasanya jelas." };
  }
}