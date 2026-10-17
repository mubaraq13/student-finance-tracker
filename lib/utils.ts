import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

// Menggabungkan class Tailwind secara dinamis
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mengubah angka menjadi format Rupiah: Rp1.500.000
export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  // Menghapus spasi bawaan Intl setelah simbol Rp agar menjadi Rp1.500.000
  return formatted.replace(/\s/g, "");
}

// Mengubah string tanggal YYYY-MM-DD menjadi format Indonesia (contoh: 16 Okt 2026)
export function formatDateID(dateString: string, formatStr: string = "dd MMM yyyy"): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr, { locale: id });
  } catch {
    return dateString;
  }
}