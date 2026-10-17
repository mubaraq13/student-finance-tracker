"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// FUNGSI PEMBANTU: Mengecek apakah saldo cukup untuk pengeluaran ini
async function checkSufficientBalance(
  supabase: any,
  accountId: string,
  expenseAmount: number,
  excludeTransactionId?: string // Abaikan nominal transaksi lama saat proses Edit
) {
  // 1. Ambil data saldo awal akun
  const { data: acc } = await supabase
    .from("accounts")
    .select("initial_balance")
    .eq("id", accountId)
    .single();

  if (!acc) return false;

  let currentBalance = Number(acc.initial_balance) || 0;

  // 2. Ambil semua transaksi untuk akun ini
  let query = supabase.from("transactions").select("amount, type").eq("account_id", accountId);
  
  if (excludeTransactionId) {
    query = query.neq("id", excludeTransactionId);
  }

  const { data: txs } = await query;

  if (txs) {
    txs.forEach((tx: any) => {
      if (tx.type === "income") currentBalance += Number(tx.amount);
      else currentBalance -= Number(tx.amount);
    });
  }

  // 3. Bandingkan sisa saldo dengan nominal pengeluaran baru
  return currentBalance >= expenseAmount;
}

export async function addTransaction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Silakan login kembali." };
    }

    const type = formData.get("type") as string;
    const amount = Number(formData.get("amount"));
    const account_id = formData.get("account_id") as string;
    const category_id = formData.get("category_id") as string;
    const transaction_date = formData.get("transaction_date") as string;
    const description = formData.get("description") as string;

    // VALIDASI SALDO MINUS!
    if (type === "expense") {
      const isSufficient = await checkSufficientBalance(supabase, account_id, amount);
      if (!isSufficient) {
        return { error: `Gagal: Saldo kas pada akun ini tidak mencukupi untuk pengeluaran sebesar Rp ${amount.toLocaleString("id-ID")}` };
      }
    }

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type,
      amount,
      account_id,
      category_id,
      transaction_date,
      description,
    });

    if (error) throw error;

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    revalidatePath("/reports");

    return { success: true };
  } catch (error: any) {
    console.error("Error adding transaction:", error.message);
    return { error: error.message };
  }
}

export async function updateTransaction(formData: FormData) {
  try {
    const supabase = await createClient();
    const id = formData.get("id") as string;
    const type = formData.get("type") as string;
    const amount = Number(formData.get("amount"));
    const account_id = formData.get("account_id") as string;
    const category_id = formData.get("category_id") as string;
    const transaction_date = formData.get("transaction_date") as string;
    const description = formData.get("description") as string;

    // VALIDASI SALDO MINUS SAAT EDIT
    if (type === "expense") {
      const isSufficient = await checkSufficientBalance(supabase, account_id, amount, id);
      if (!isSufficient) {
        return { error: `Gagal Mengubah: Saldo tidak mencukupi untuk pengeluaran baru sebesar Rp ${amount.toLocaleString("id-ID")}` };
      }
    }

    const { error } = await supabase
      .from("transactions")
      .update({
        type,
        amount,
        account_id,
        category_id,
        transaction_date,
        description,
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    revalidatePath("/reports");

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    revalidatePath("/reports");

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}