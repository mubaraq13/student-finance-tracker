"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addAccount(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Sesi habis. Silakan login kembali." };
    }

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    
    // FIX: Ambil nilai dengan benar dan pastikan menjadi angka murni
    const initial_balance_str = formData.get("initial_balance");
    const initial_balance = initial_balance_str ? Number(initial_balance_str) : 0;

    const { error } = await supabase.from("accounts").insert({
      user_id: user.id,
      name,
      type,
      initial_balance, // Kirim sebagai angka
    });

    if (error) throw error;

    revalidatePath("/accounts");
    revalidatePath("/dashboard");
    revalidatePath("/transactions");

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateAccount(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    
    // FIX: Ambil nilai dengan benar dan pastikan menjadi angka murni
    const initial_balance_str = formData.get("initial_balance");
    const initial_balance = initial_balance_str ? Number(initial_balance_str) : 0;

    const { error } = await supabase
      .from("accounts")
      .update({
        name,
        type,
        initial_balance, // Update sebagai angka
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/accounts");
    revalidatePath("/dashboard");
    revalidatePath("/transactions");

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteAccount(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("accounts").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/accounts");
    revalidatePath("/dashboard");
    revalidatePath("/transactions");

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}