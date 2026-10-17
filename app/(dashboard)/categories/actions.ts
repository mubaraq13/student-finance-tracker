"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { TransactionType } from "@/types";

export async function addCategory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as TransactionType;

  if (!name || !type) return { error: "Nama dan jenis kategori wajib diisi." };

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name,
    type,
    is_default: false,
  });

  if (error) {
    console.error("Error adding category:", error.message);
    return { error: error.message };
  }

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCategory(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!id || !name) return { error: "Data tidak lengkap." };

  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .eq("is_default", false);

  if (error) {
    console.error("Error updating category:", error.message);
    return { error: error.message };
  }

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("is_default", false);

  if (error) {
    console.error("Error deleting category:", error.message);
    return { error: error.message };
  }

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { success: true };
}