"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Tags,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/login/actions";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transaksi", href: "/transactions", icon: ArrowLeftRight },
  { name: "Akun Kas", href: "/accounts", icon: Wallet },
  { name: "Kategori", href: "/categories", icon: Tags },
  { name: "Laporan", href: "/reports", icon: BarChart3 },
];

export default function Sidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Topbar khusus layar HP (Mobile) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <Wallet size={20} />
          </div>
          <span>FinanceTracker</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay gelap saat menu mobile dibuka */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Utama */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div>
          {/* Logo Brand */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Wallet size={22} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 leading-none">Student Finance</h2>
              <span className="text-xs text-gray-400">Personal Tracker</span>
            </div>
          </div>

          {/* Menu Navigasi */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bagian Bawah: Info User & Tombol Logout */}
        <div className="p-4 border-t border-gray-100">
          {userEmail && (
            <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-400">Login sebagai:</p>
              <p className="text-xs font-medium text-gray-700 truncate">{userEmail}</p>
            </div>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Keluar (Logout)
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}