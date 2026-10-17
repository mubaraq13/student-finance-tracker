"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";
import { Transaction } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { generateFinancialAdvice } from "@/app/(dashboard)/reports/actions";

interface ReportDashboardProps {
  transactions: Transaction[];
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function parseYearMonth(dateStr: string): { year: number; monthIndex: number } {
  const parts = dateStr.split("-");
  return {
    year: Number(parts[0]),
    monthIndex: Number(parts[1]) - 1,
  };
}

export default function ReportDashboard({
  transactions,
}: ReportDashboardProps) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(now.getMonth())
  );

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const availableYears = useMemo(() => {
    const years = new Set<number>([now.getFullYear()]);
    transactions.forEach((tx) => {
      if (tx.transaction_date) {
        const { year } = parseYearMonth(tx.transaction_date);
        if (!isNaN(year)) years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions, now]);

  const monthlyChartData = useMemo(() => {
    const data = SHORT_MONTHS.map((name) => ({
      name,
      Pemasukan: 0,
      Pengeluaran: 0,
    }));

    transactions.forEach((tx) => {
      if (!tx.transaction_date) return;
      const { year, monthIndex } = parseYearMonth(tx.transaction_date);

      if (year === selectedYear && monthIndex >= 0 && monthIndex <= 11) {
        const amount = Number(tx.amount);
        if (tx.type === "income") {
          data[monthIndex].Pemasukan += amount;
        } else if (tx.type === "expense") {
          data[monthIndex].Pengeluaran += amount;
        }
      }
    });

    return data;
  }, [transactions, selectedYear]);

  const periodTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (!tx.transaction_date) return false;
      const { year, monthIndex } = parseYearMonth(tx.transaction_date);
      const matchYear = year === selectedYear;
      const matchMonth =
        selectedMonth === "all" || monthIndex === Number(selectedMonth);
      return matchYear && matchMonth;
    });
  }, [transactions, selectedYear, selectedMonth]);

  const { totalIncome, totalExpense, netCashFlow, categoryBreakdown } =
    useMemo(() => {
      let income = 0;
      let expense = 0;
      const catMap: Record<string, number> = {};

      periodTransactions.forEach((tx) => {
        const amount = Number(tx.amount);
        if (tx.type === "income") {
          income += amount;
        } else if (tx.type === "expense") {
          expense += amount;
          const catName = tx.categories?.name || "Lainnya";
          catMap[catName] = (catMap[catName] || 0) + amount;
        }
      });

      const breakdown = Object.entries(catMap)
        .map(([name, amount]) => ({
          name,
          amount,
          percentage: expense > 0 ? Math.round((amount / expense) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

      return {
        totalIncome: income,
        totalExpense: expense,
        netCashFlow: income - expense,
        categoryBreakdown: breakdown,
      };
    }, [periodTransactions]);

  const periodLabel =
    selectedMonth === "all"
      ? `Tahun ${selectedYear}`
      : `${MONTH_NAMES[Number(selectedMonth)]} ${selectedYear}`;

  const handleDownloadCSV = () => {
    if (periodTransactions.length === 0) {
      alert("Tidak ada data transaksi pada periode ini untuk diunduh.");
      return;
    }

    let csvContent = "Tanggal,Tipe,Kategori,Akun Kas,Deskripsi,Nominal (Rp)\n";

    periodTransactions.forEach((tx) => {
      const date = tx.transaction_date;
      const type = tx.type === "income" ? "Pemasukan" : "Pengeluaran";
      const category = tx.categories?.name || "-";
      const account = tx.accounts?.name || "-";
      const description = tx.description
        ? `"${tx.description.replace(/"/g, '""').replace(/\n/g, " ")}"`
        : `"-"`;
      const amount = tx.amount;

      csvContent += `${date},${type},${category},${account},${description},${amount}\n`;
    });

    csvContent += `\n`;
    csvContent += `RINGKASAN PERIODE,${periodLabel}\n`;
    csvContent += `Total Pemasukan,,,,,${totalIncome}\n`;
    csvContent += `Total Pengeluaran,,,,,${totalExpense}\n`;
    csvContent += `Net Cash Flow,,,,,${netCashFlow}\n`;

    const finalCsvContent = "\uFEFF" + csvContent;
    const blob = new Blob([finalCsvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = `Laporan_Keuangan_${periodLabel.replace(/\s+/g, "_")}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAnalyzeAI = async () => {
    if (periodTransactions.length === 0) {
      alert("Tidak ada data transaksi untuk dianalisis pada periode ini.");
      return;
    }

    setIsAiLoading(true);
    setAiAdvice(null);

    const topCategories = categoryBreakdown
      .slice(0, 3)
      .map((c) => `${c.name} (${c.percentage}% - ${formatRupiah(c.amount)})`)
      .join(", ");

    const summaryText = `
      - Periode: ${periodLabel}
      - Total Pemasukan: ${formatRupiah(totalIncome)}
      - Total Pengeluaran: ${formatRupiah(totalExpense)}
      - Net Cash Flow: ${formatRupiah(netCashFlow)} (${
      netCashFlow >= 0 ? "Surplus" : "Defisit"
    })
      - 3 Pengeluaran Terbesar: ${topCategories || "Belum ada rincian"}
    `;

    const res = await generateFinancialAdvice(summaryText);

    if (res?.error) {
      setAiAdvice(`**Kendala Sistem:** ${res.error}`);
    } else if (res?.advice) {
      setAiAdvice(res.advice);
    }

    setIsAiLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Periode */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#DCE1DC] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4A5450]">
            Evaluasi Arus Kas
          </p>
          <h1 className="text-2xl font-bold text-[#252B28] mt-0.5">
            Laporan Keuangan ({periodLabel})
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-white rounded-lg border border-[#DCE1DC] p-1">
            <select
              aria-label="Pilih Bulan Laporan"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setAiAdvice(null);
              }}
              className="min-h-[40px] px-3 text-sm font-semibold text-[#252B28] bg-transparent cursor-pointer"
            >
              <option value="all">Semua Bulan (1 Tahun)</option>
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={String(idx)}>
                  {m}
                </option>
              ))}
            </select>

            <span className="text-[#DCE1DC] px-1">|</span>

            <select
              aria-label="Pilih Tahun Laporan"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value));
                setAiAdvice(null);
              }}
              className="min-h-[40px] px-3 text-sm font-semibold text-[#252B28] bg-transparent cursor-pointer font-num"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleDownloadCSV}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 bg-[#123C32] hover:bg-[#0D2B24] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Download size={16} />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* FOCAL POINT: Ringkasan Arus Kas Bersih & Proporsi */}
      <section
        aria-label="Ringkasan Arus Kas Periode"
        className="grid grid-cols-1 md:grid-cols-12 gap-4"
      >
        <div className="md:col-span-5 bg-[#123C32] text-white p-6 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B8D978]">
              Arus Kas Bersih (Net Cash Flow)
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#B8D978] text-[#123C32] text-xs font-bold">
              {netCashFlow >= 0 ? "Surplus" : "Defisit"}
            </span>
          </div>
          <p className="text-3xl font-bold font-num my-4">
            {netCashFlow < 0
              ? `-${formatRupiah(Math.abs(netCashFlow))}`
              : `+${formatRupiah(netCashFlow)}`}
          </p>
          <p className="text-xs text-[#E3EDE9]">
            Selisih antara total pemasukan dan pengeluaran pada {periodLabel}.
          </p>
        </div>

        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#DCE1DC] flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-[#4A5450]">
              Total Pemasukan
            </span>
            <p className="text-2xl font-bold text-[#123C32] font-num my-3">
              {formatRupiah(totalIncome)}
            </p>
            <span className="text-xs text-[#4A5450]">Periode {periodLabel}</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#DCE1DC] flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-[#4A5450]">
              Total Pengeluaran
            </span>
            <p className="text-2xl font-bold text-[#991B1B] font-num my-3">
              {formatRupiah(totalExpense)}
            </p>
            <span className="text-xs text-[#4A5450]">Periode {periodLabel}</span>
          </div>
        </div>
      </section>

      {/* Panel Evaluasi & Rekomendasi Anggaran */}
      <section
        aria-label="Evaluasi Anggaran Otomatis"
        className="bg-white p-5 sm:p-6 rounded-xl border border-[#DCE1DC]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE1DC]">
          <div>
            <h2 className="text-base font-bold text-[#252B28]">
              Evaluasi & Saran Pengelolaan Kas
            </h2>
            <p className="text-xs text-[#4A5450]">
              Analisis proporsi pengeluaran dan rekomendasi penghematan untuk{" "}
              {periodLabel}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAnalyzeAI}
            disabled={isAiLoading || periodTransactions.length === 0}
            className="min-h-[44px] px-4 py-2 bg-[#B8D978] hover:bg-[#a8cc64] disabled:opacity-50 text-[#123C32] text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isAiLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#123C32] border-t-transparent rounded-full animate-spin" />
                <span>Menyusun Evaluasi...</span>
              </>
            ) : (
              <span>Susun Evaluasi Periode Ini</span>
            )}
          </button>
        </div>

        {aiAdvice ? (
          <div className="mt-4 p-4 bg-[#F7F8F5] rounded-lg border border-[#DCE1DC] text-[#252B28] text-sm leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: aiAdvice
                  .replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="text-[#123C32] font-bold">$1</strong>'
                  )
                  .replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        ) : (
          <p className="mt-4 text-xs text-[#4A5450]">
            {periodTransactions.length === 0
              ? "Belum ada transaksi pada periode ini untuk dievaluasi."
              : "Tekan tombol di kanan atas untuk menyusun ringkasan evaluasi dari data mutasi periode ini."}
          </p>
        )}
      </section>

      {/* Grafik & Tabel Proporsi Kategori */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grafik Tren Bulanan */}
        <section className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#DCE1DC] min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-[#252B28]">
                Tren Bulanan ({selectedYear})
              </h2>
              <p className="text-xs text-[#4A5450]">
                Perbandingan pemasukan dan pengeluaran Januari s.d. Desember
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-[#252B28]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#123C32] inline-block" />
                Pemasukan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#B8D978] border border-[#123C32]/30 inline-block" />
                Pengeluaran
              </span>
            </div>
          </div>

          <div className="w-full h-[260px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyChartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#EEF1EC"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#4A5450" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#4A5450" }}
                  tickFormatter={(val) =>
                    val === 0
                      ? "0"
                      : `${(val / 1000).toLocaleString("id-ID")}k`
                  }
                />
                <Tooltip
                  formatter={(value: unknown) => formatRupiah(Number(value))}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#DCE1DC",
                    borderRadius: "8px",
                    color: "#252B28",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="Pemasukan" fill="#123C32" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="Pengeluaran"
                  fill="#B8D978"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Rincian Pengeluaran per Kategori */}
        <section className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#DCE1DC]">
          <div className="mb-4 pb-3 border-b border-[#DCE1DC]">
            <h2 className="text-base font-bold text-[#252B28]">
              Proporsi Pengeluaran ({periodLabel})
            </h2>
            <p className="text-xs text-[#4A5450]">
              Urutan kategori dari pengeluaran terbesar
            </p>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#4A5450]">
              Belum ada pengeluaran tercatat pada periode {periodLabel}.
            </div>
          ) : (
            <div className="space-y-4">
              {categoryBreakdown.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#252B28]">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 font-num">
                      <span className="text-xs font-semibold text-[#4A5450]">
                        {item.percentage}%
                      </span>
                      <span className="font-bold text-[#252B28]">
                        {formatRupiah(item.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#EEF1EC] rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-[#123C32] rounded-sm transition-all duration-300"
                      style={{ width: `${Math.max(item.percentage, 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}