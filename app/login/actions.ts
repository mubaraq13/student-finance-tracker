"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  // Log untuk mengecek URL Supabase yang terbaca oleh server Next.js
  console.log("Mencoba Login ke URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error Login Supabase:", error);
    return redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  console.log("Mencoba Signup ke URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error Signup Supabase:", error);
    return redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}