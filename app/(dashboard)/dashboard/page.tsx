import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah, formatDateID } from "@/lib/utils";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [accountsRes, transactionsRes] = await Promise.all([
    supabase.from("accounts").select("*").order("created_at", { ascending: true }),
    supabase
      .from("transactions")
      .select("*, accounts(name), categories(name)")
      .order("transaction_date", { ascending: false }),
  ]);

  const accounts = accountsRes.data || [];
  const transactions = transactionsRes.data || [];
  const fetchError = accountsRes.error || transactionsRes.error;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let totalIncomeThisMonth = 0;
  let totalExpenseThisMonth = 0;
  let totalAllIncome = 0;
  let totalAllExpense = 0;

  // Hitung saldo per akun
  const accountBalances: Record<string, number> = {};
  accounts.forEach((acc) => {
    accountBalances[acc.id] = Number(acc.initial_balance || 0);
  });

  transactions.forEach((tx) => {
    const amount = Number(tx.amount);
    if (tx.type === "income") {
      totalAllIncome += amount;
      if (accountBalances[tx.account_id] !== undefined) {
        accountBalances[tx.account_id] += amount;
      }
    } else {
      totalAllExpense += amount;
      if (accountBalances[tx.account_id] !== undefined) {
        accountBalances[tx.account_id] -= amount;
      }
    }

    if (tx.transaction_date) {
      const parts = tx.transaction_date.split("-");
      const txYear = Number(parts[0]);
      const txMonth = Number(parts[1]) - 1;
      if (txYear === currentYear && txMonth === currentMonth) {
        if (tx.type === "income") totalIncomeThisMonth += amount;
        if (tx.type === "expense") totalExpenseThisMonth += amount;
      }
    }
  });

  const totalInitialBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.initial_balance || 0),
    0
  );
  const totalNetBalance = totalInitialBalance + totalAllIncome - totalAllExpense;
  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#DCE1DC] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4A5450]">
            Ringkasan Posisi Kas
          </p>
          <h1 className="text-2xl font-bold text-[#252B28] mt-0.5">
            Dashboard Keuangan
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/transactions"
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#123C32] hover:bg-[#0D2B24] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            + Catat Transaksi Baru
          </Link>
        </div>
      </div>

      {/* Error State (R-27) */}
      {fetchError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-[#FCE8E8] border border-[#991B1B]/30 text-[#991B1B] text-sm font-medium"
        >
          Gagal memuat sebagian data buku kas: {fetchError.message}
        </div>
      )}

      {/* FOCAL POINT: Panel Utama Saldo Bersih + Ringkasan Bulan Ini */}
      <section
        aria-label="Metrik Utama Keuangan"
        className="grid grid-cols-1 lg:grid-cols-12 gap-4"
      >
        {/* Kartu Utama Deep Emerald (Focal Point) */}
        <div className="lg:col-span-6 bg-[#123C32] text-white p-6 rounded-xl border border-[#123C32] flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B8D978]">
              Total Saldo Kas Aktif
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#B8D978] text-[#123C32] text-xs font-bold">
              {accounts.length} Akun Kas
            </span>
          </div>

          <div className="my-5">
            <p className="text-3xl sm:text-4xl font-bold tracking-tight font-num">
              {formatRupiah(totalNetBalance)}
            </p>
            <p className="text-xs text-[#E3EDE9] mt-1.5">
              Akumulasi saldo awal beserta seluruh mutasi masuk dan keluar.
            </p>
          </div>

          <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs">
            <span className="text-[#E3EDE9]">Selisih Kas Bulan Ini:</span>
            <span className="font-bold font-num text-[#B8D978]">
              {totalIncomeThisMonth - totalExpenseThisMonth >= 0 ? "+" : "-"}
              {formatRupiah(
                Math.abs(totalIncomeThisMonth - totalExpenseThisMonth)
              )}
            </span>
          </div>
        </div>

        {/* Dua Panel Pendukung: Pemasukan & Pengeluaran Bulan Ini */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#DCE1DC] flex flex-col justify-between">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#E3EDE9] text-[#123C32] text-xs font-semibold">
                Pemasukan Bulan Ini
              </span>
              <p className="text-2xl font-bold text-[#123C32] font-num mt-4">
                +{formatRupiah(totalIncomeThisMonth)}
              </p>
            </div>
            <p className="text-xs text-[#4A5450] mt-4 pt-3 border-t border-[#DCE1DC]">
              Periode berjalan ({now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })})
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#DCE1DC] flex flex-col justify-between">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#FCE8E8] text-[#991B1B] text-xs font-semibold">
                Pengeluaran Bulan Ini
              </span>
              <p className="text-2xl font-bold text-[#991B1B] font-num mt-4">
                -{formatRupiah(totalExpenseThisMonth)}
              </p>
            </div>
            <p className="text-xs text-[#4A5450] mt-4 pt-3 border-t border-[#DCE1DC]">
              Periode berjalan ({now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })})
            </p>
          </div>
        </div>
      </section>

      {/* Grafik Visualisasi */}
      <DashboardCharts transactions={transactions} />

      {/* Komposisi Bawah: Rincian Saldo per Akun Kas & Mutasi Terakhir */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daftar Saldo per Akun Kas (4 Kolom) */}
        <section className="lg:col-span-5 bg-white rounded-xl border border-[#DCE1DC] p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCE1DC]">
            <div>
              <h2 className="text-base font-bold text-[#252B28]">
                Posisi Saldo Akun Kas
              </h2>
              <p className="text-xs text-[#4A5450]">
                Saldo riil per dompet/rekening
              </p>
            </div>
            <Link
              href="/accounts"
              className="min-h-[44px] inline-flex items-center px-2.5 text-xs font-semibold text-[#123C32] hover:underline"
            >
              Kelola Akun
            </Link>
          </div>

          {accounts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[#4A5450] mb-3">
                Belum ada akun kas yang terdaftar.
              </p>
              <Link
                href="/accounts"
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#123C32] text-white text-xs font-semibold rounded-lg"
              >
                Buat Akun Kas Pertama
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#DCE1DC]">
              {accounts.map((acc) => {
                const bal = accountBalances[acc.id] ?? 0;
                return (
                  <div
                    key={acc.id}
                    className="py-3 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#252B28] truncate">
                        {acc.name}
                      </p>
                      <p className="text-xs text-[#4A5450] capitalize">
                        {acc.type === "bank"
                          ? "Rekening Bank"
                          : acc.type === "ewallet"
                          ? "E-Wallet"
                          : "Uang Tunai"}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-bold font-num shrink-0 ${
                        bal < 0 ? "text-[#991B1B]" : "text-[#252B28]"
                      }`}
                    >
                      {formatRupiah(bal)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Mutasi Transaksi Terakhir (7 Kolom) */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-[#DCE1DC] p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCE1DC]">
            <div>
              <h2 className="text-base font-bold text-[#252B28]">
                Mutasi Transaksi Terbaru
              </h2>
              <p className="text-xs text-[#4A5450]">
                6 aktivitas pencatatan terakhir
              </p>
            </div>
            <Link
              href="/transactions"
              className="min-h-[44px] inline-flex items-center px-2.5 text-xs font-semibold text-[#123C32] hover:underline"
            >
              Lihat Buku Transaksi
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[#4A5450] mb-3">
                Belum ada catatan transaksi di buku kasmu.
              </p>
              <Link
                href="/transactions"
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#123C32] text-white text-xs font-semibold rounded-lg"
              >
                Catat Transaksi Sekarang
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#DCE1DC]">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#252B28] truncate">
                      {tx.description || tx.categories?.name || "Transaksi"}
                    </p>
                    <p className="text-xs text-[#4A5450] truncate">
                      {formatDateID(tx.transaction_date)} ·{" "}
                      {tx.categories?.name || "Umum"} ·{" "}
                      {tx.accounts?.name || "Kas"}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold font-num shrink-0 ${
                      tx.type === "income"
                        ? "text-[#123C32]"
                        : "text-[#991B1B]"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatRupiah(Number(tx.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}