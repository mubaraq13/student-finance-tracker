import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogOut } from "lucide-react";
import { DesktopNavLinks, MobileBottomNav } from "@/components/layout/NavMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Inisialisasi Supabase Server (Kita tahu ini berfungsi normal)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika tidak ada user, tendang ke halaman login
  if (!user) {
    redirect("/login");
  }

  const email = user.email || "Mahasiswa";
  const initials = email.substring(0, 2).toUpperCase();

  // 2. INLINE SERVER ACTION: Fungsi Keluar Sesi ditanam langsung di sini!
  // Tidak perlu import file actions.ts dari luar.
  async function handleSignOut() {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#252B28] flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-[#DCE1DC] z-30">
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#DCE1DC]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[#123C32] text-[#B8D978] font-bold text-sm tracking-tight">
              SF
            </span>
            <div>
              <span className="font-bold text-base tracking-tight text-[#123C32] block leading-none">
                Student Finance
              </span>
              <span className="text-[11px] text-[#4A5450] font-medium">
                Buku Kas Mahasiswa
              </span>
            </div>
          </div>
        </div>

        <DesktopNavLinks />

        {/* Profil & Keluar di Bawah Sidebar */}
        <div className="p-4 border-t border-[#DCE1DC] bg-[#F7F8F5]/60">
          <div className="flex items-center gap-3 mb-3">
            <div
              aria-hidden="true"
              className="w-9 h-9 rounded-lg bg-[#123C32] text-[#B8D978] font-bold text-xs flex items-center justify-center shrink-0"
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[#4A5450]">Akun Aktif</p>
              <p className="text-xs font-semibold text-[#252B28] truncate">
                {email}
              </p>
            </div>
          </div>
          {/* Panggil fungsi di dalam form */}
          <form action={handleSignOut}>
            <button
              type="submit"
              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-[#DCE1DC] bg-white hover:bg-[#FCE8E8] hover:border-[#991B1B]/30 text-[#991B1B] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              <span>Keluar Sesi</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Header Mobile (360px+) */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-[#DCE1DC] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#123C32] text-[#B8D978] font-bold text-xs shrink-0">
            SF
          </span>
          <span className="font-bold text-sm tracking-tight text-[#123C32] truncate">
            Student Finance
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            title={email}
            className="w-8 h-8 rounded-md bg-[#EEF1EC] text-[#123C32] font-bold text-xs flex items-center justify-center border border-[#DCE1DC]"
          >
            {initials}
          </div>
          {/* Panggil fungsi di dalam form */}
          <form action={handleSignOut}>
            <button
              type="submit"
              aria-label="Keluar Sesi"
              className="min-h-[44px] min-w-[44px] px-2.5 rounded-lg border border-[#DCE1DC] text-[#991B1B] hover:bg-[#FCE8E8] flex items-center justify-center gap-1 text-xs font-semibold"
            >
              <LogOut size={15} />
              <span className="sr-only sm:not-sr-only">Keluar</span>
            </button>
          </form>
        </div>
      </header>

      {/* Area Konten Utama */}
      <main className="flex-1 md:pl-64 pb-24 md:pb-10 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation Bar untuk Mobile */}
      <MobileBottomNav />
    </div>
  );
}