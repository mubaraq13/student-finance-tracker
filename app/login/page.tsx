import { Wallet } from "lucide-react";
import { login, signup } from "./actions";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  // Cek jika user sudah login
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  // Menunggu params URL (jika ada error login)
  const params = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-sm w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Wallet size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Masuk ke Akun
        </h1>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="mahasiswa@kampus.ac.id"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {params?.message && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              {params.message}
            </div>
          )}

          <div className="flex flex-col gap-2 mt-4">
            <button
              formAction={login}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
            <button
              formAction={signup}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Daftar Baru
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}