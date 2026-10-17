"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addAccount(formData: FormData) {
  const supabase = await createClient();
  const name = (formData.get("name") as string)?.trim();

  if (!name) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("accounts").insert({
    user_id: user.id,
    name,
  });

  if (error) {
    console.error("Error adding account:", error.message);
    return;
  }

  revalidatePath("/accounts");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}

export async function updateAccount(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!id || !name) return;

  const { error } = await supabase
    .from("accounts")
    .update({ name })
    .eq("id", id);

  if (error) {
    console.error("Error updating account:", error.message);
    return;
  }

  revalidatePath("/accounts");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}

export async function deleteAccount(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("accounts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting account:", error.message);
    return;
  }

  revalidatePath("/accounts");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}