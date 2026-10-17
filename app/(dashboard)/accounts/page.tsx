import { createClient } from "@/lib/supabase/server";
import AccountManager from "@/components/accounts/AccountManager";

// Force dinamis agar data selalu baru ketika dimuat
export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const supabase = await createClient();

  // 1. Ambil semua akun kas milik pengguna ini (RLS akan mengamankannya)
  const { data: accountsData, error: accountsError } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: true });

  // 2. Jika ada error pengambilan data akun, tampilkan pesan darurat
  if (accountsError) {
    return (
      <div className="p-4 bg-[#FCE8E8] border border-[#991B1B]/30 rounded-xl text-[#991B1B] text-sm">
        <p className="font-bold">Gagal memuat daftar akun kas.</p>
        <p className="mt-1">{accountsError.message}</p>
      </div>
    );
  }

  // 3. Ambil data total transaksi (untuk menghitung saldo saat ini per akun)
  const { data: txData } = await supabase
    .from("transactions")
    .select("account_id, amount, type");

  // 4. Hitung Saldo Riil (*Current Balance*) untuk setiap akun
  const accountsWithBalance = (accountsData || []).map((acc) => {
    // FIX NaN: Paksa menjadi Number, jika falsy/null jadikan 0
    const initialBalance = Number(acc.initial_balance) || 0;
    let currentBal = initialBalance;

    if (txData) {
      txData.forEach((tx) => {
        if (tx.account_id === acc.id) {
          if (tx.type === "income") {
            currentBal += Number(tx.amount);
          } else {
            currentBal -= Number(tx.amount);
          }
        }
      });
    }

    return {
      ...acc,
      // Pastikan property ini tersimpan kembali sebagai angka murni
      initial_balance: initialBalance,
      current_balance: currentBal,
    };
  });

  return (
    <div>
      {/* Panggil komponen Manager UI Fintech Modern */}
      <AccountManager accounts={accountsWithBalance} />
    </div>
  );
}