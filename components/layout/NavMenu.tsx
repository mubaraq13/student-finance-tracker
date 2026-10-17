"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ArrowLeftRight,
  Wallet,
  Tags,
  BarChart3,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { href: "/accounts", label: "Akun Kas", icon: Wallet },
  { href: "/categories", label: "Kategori", icon: Tags },
  { href: "/reports", label: "Laporan", icon: BarChart3 },
];

export function DesktopNavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu Utama Desktop" className="flex-1 px-3 py-4 space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#123C32] text-white font-semibold"
                : "text-[#252B28] hover:bg-[#EEF1EC]"
            }`}
          >
            <Icon
              size={18}
              className={isActive ? "text-[#B8D978]" : "text-[#4A5450]"}
            />
            <span>{item.label}</span>
            {isActive && (
              <span
                aria-hidden="true"
                className="ml-auto w-2 h-2 rounded-sm bg-[#B8D978]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Menu Utama Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DCE1DC] px-1 py-1"
    >
      <div className="grid grid-cols-5 gap-0.5 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[52px] px-1 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#123C32] text-white font-semibold"
                  : "text-[#4A5450] hover:bg-[#EEF1EC] hover:text-[#252B28]"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-[#B8D978]" : "text-[#4A5450]"}
              />
              <span className="text-[11px] leading-tight mt-1 truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}