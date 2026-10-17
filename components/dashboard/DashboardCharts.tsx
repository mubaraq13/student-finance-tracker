"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface DashboardChartsProps {
  transactions: Transaction[];
}

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export default function DashboardCharts({ transactions }: DashboardChartsProps) {
  const currentYear = new Date().getFullYear();

  const { monthlyData, topCategories } = useMemo(() => {
    const mData = SHORT_MONTHS.map((name) => ({
      name,
      Pemasukan: 0,
      Pengeluaran: 0,
    }));

    const catTotals: Record<string, number> = {};
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (!tx.transaction_date) return;
      const parts = tx.transaction_date.split("-");
      const year = Number(parts[0]);
      const monthIdx = Number(parts[1]) - 1;
      const amount = Number(tx.amount);

      if (year === currentYear && monthIdx >= 0 && monthIdx <= 11) {
        if (tx.type === "income") {
          mData[monthIdx].Pemasukan += amount;
        } else {
          mData[monthIdx].Pengeluaran += amount;
          const catName = tx.categories?.name || "Lainnya";
          catTotals[catName] = (catTotals[catName] || 0) + amount;
          totalExpense += amount;
        }
      }
    });

    const sortedCats = Object.entries(catTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        pct: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return { monthlyData: mData, topCategories: sortedCats };
  }, [transactions, currentYear]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Grafik Arus Kas Bulanan */}
      <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#DCE1DC] min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#252B28]">
              Arus Kas Bulanan ({currentYear})
            </h2>
            <p className="text-xs text-[#4A5450]">
              Perbandingan kas masuk dan keluar sepanjang tahun
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

        <div className="w-full h-[240px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
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
                  val === 0 ? "0" : `${(val / 1000).toLocaleString("id-ID")}k`
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
              <Bar dataKey="Pengeluaran" fill="#B8D978" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pos Pengeluaran Terbesar */}
      <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#DCE1DC] flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <h2 className="text-base font-bold text-[#252B28]">
              5 Pos Pengeluaran Terbesar ({currentYear})
            </h2>
            <p className="text-xs text-[#4A5450]">
              Distribusi pengeluaran berdasarkan kategori
            </p>
          </div>

          {topCategories.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#4A5450]">
              Belum ada data pengeluaran tahun ini.
            </div>
          ) : (
            <div className="space-y-3.5">
              {topCategories.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#252B28]">
                      {cat.name}
                    </span>
                    <span className="font-bold font-num text-[#252B28]">
                      {formatRupiah(cat.amount)}{" "}
                      <span className="text-[#4A5450] font-normal">
                        ({cat.pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#EEF1EC] rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-[#123C32] rounded-sm"
                      style={{ width: `${Math.max(cat.pct, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}