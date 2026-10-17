"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Pencil, Trash2, Eye, X } from "lucide-react";
import Link from "next/link";
import { Account, Category, Transaction, TransactionType } from "@/types";
import { formatRupiah, formatDateID } from "@/lib/utils";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/app/(dashboard)/transactions/actions";
import { addTransactionWithAI } from "@/app/(dashboard)/transactions/ai-actions";

interface TransactionManagerProps {
  initialTransactions: Transaction[];
  accounts: Account[];
  categories: Category[];
}

export default function TransactionManager({
  initialTransactions,
  accounts,
  categories,
}: TransactionManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];
  const [formType, setFormType] = useState<TransactionType>("expense");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [aiInput, setAiInput] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsFormOpen(false);
        setDetailTx(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const availableCategories = useMemo(() => {
    return categories.filter((c) => c.type === formType);
  }, [categories, formType]);

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((tx) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        (tx.description && tx.description.toLowerCase().includes(q)) ||
        (tx.categories?.name &&
          tx.categories.name.toLowerCase().includes(q)) ||
        (tx.accounts?.name && tx.accounts.name.toLowerCase().includes(q));

      const matchType = filterType === "all" || tx.type === filterType;
      const matchCategory =
        filterCategory === "all" || tx.category_id === filterCategory;
      const matchStart = !startDate || tx.transaction_date >= startDate;
      const matchEnd = !endDate || tx.transaction_date <= endDate;

      return (
        matchSearch && matchType && matchCategory && matchStart && matchEnd
      );
    });
  }, [
    initialTransactions,
    searchQuery,
    filterType,
    filterCategory,
    startDate,
    endDate,
  ]);

  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!aiInput.trim()) return;

    setIsAiProcessing(true);
    setAiFeedback(null);

    // FIX: Menggunakan (a: any) agar TypeScript tidak protes soal initial_balance
    const mappedAccounts = accounts.map((a: any) => ({
      id: a.id,
      name: a.name,
      initial_balance: Number(a.initial_balance) || 0,
    }));

    const mappedCategories = categories.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
    }));

    const res = await addTransactionWithAI(aiInput, mappedAccounts, mappedCategories);
    
    if (res?.error) {
      setAiFeedback({ type: "error", text: res.error });
    } else if (res?.success) {
      setAiFeedback({ type: "success", text: res.message || "Tercatat." });
      setAiInput("");

      if (res.isQuery === false) {
        setTimeout(() => setAiFeedback(null), 6000);
      }
    }
    setIsAiProcessing(false);
  }

  function openAddModal() {
    setEditingTx(null);
    setFormType("expense");
    setErrorMsg(null);
    setIsFormOpen(true);
  }

  function openEditModal(tx: Transaction) {
    setEditingTx(tx);
    setFormType(tx.type);
    setErrorMsg(null);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = editingTx
      ? await updateTransaction(formData)
      : await addTransaction(formData);
    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setIsFormOpen(false);
      setEditingTx(null);
    }
  }

  async function handleDelete(tx: Transaction) {
    if (
      confirm(
        `Hapus transaksi "${
          tx.description || tx.categories?.name || "ini"
        }" sebesar ${formatRupiah(Number(tx.amount))}?`
      )
    ) {
      await deleteTransaction(tx.id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DCE1DC] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4A5450]">
            Buku Besar Mutasi
          </p>
          <h1 className="text-2xl font-bold text-[#252B28] mt-0.5">
            Riwayat Transaksi
          </h1>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center min-h-[44px] bg-[#123C32] hover:bg-[#0D2B24] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          + Catat Transaksi Manual
        </button>
      </div>

      {accounts.length === 0 && (
        <div
          role="alert"
          className="p-4 bg-[#EEF1EC] border border-[#123C32] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <p className="text-[#252B28] text-sm">
            Kamu belum memiliki <strong>Akun Kas</strong>. Tambahkan minimal satu
            rekening atau dompet sebelum mencatat mutasi.
          </p>
          <Link
            href="/accounts"
            className="inline-flex items-center justify-center min-h-[44px] bg-[#123C32] text-white text-xs font-semibold px-4 py-2 rounded-lg shrink-0"
          >
            Buka Menu Akun Kas
          </Link>
        </div>
      )}

      <section
        aria-label="Input Cepat Bahasa Alami"
        className="bg-[#123C32] text-white rounded-xl p-5 border border-[#123C32]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="font-bold text-base text-white">
              Input Cepat & Tanya Buku Kas
            </h2>
            <p className="text-xs text-[#E3EDE9]">
              Ketik transaksi langsung (contoh: &quot;Beli makan siang 22rb pakai
              BCA&quot;) atau tanyakan rekap pengeluaranmu.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-md bg-[#B8D978] text-[#123C32] text-[11px] font-bold">
            Otomatisasi Kas
          </span>
        </div>

        <form
          onSubmit={handleAiSubmit}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <label htmlFor="quick-command-input" className="sr-only">
            Ketik perintah transaksi atau pertanyaan laporan
          </label>
          <input
            id="quick-command-input"
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            disabled={isAiProcessing || accounts.length === 0}
            placeholder="Ketik mutasi atau pertanyaan kas di sini..."
            className="flex-1 min-h-[44px] px-4 py-2.5 text-sm rounded-lg bg-white text-[#252B28] placeholder:text-[#4A5450] border border-transparent focus:outline-none"
          />
          <button
            type="submit"
            disabled={
              isAiProcessing || !aiInput.trim() || accounts.length === 0
            }
            className="min-h-[44px] px-5 py-2.5 bg-[#B8D978] hover:bg-[#a8cc64] disabled:opacity-50 text-[#123C32] text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            {isAiProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-[#123C32] border-t-transparent rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Proses Perintah</span>
            )}
          </button>
        </form>

        {aiFeedback && (
          <div
            role="status"
            className={`mt-3 p-4 rounded-lg text-sm leading-relaxed border ${
              aiFeedback.type === "error"
                ? "bg-[#FCE8E8] text-[#991B1B] border-[#991B1B]/30 font-medium"
                : "bg-white text-[#252B28] border-[#DCE1DC]"
            }`}
          >
            {aiFeedback.type === "error" ? (
              aiFeedback.text
            ) : (
              <div dangerouslySetInnerHTML={{ __html: aiFeedback.text }} />
            )}
          </div>
        )}
      </section>

      <section
        aria-label="Filter Transaksi"
        className="bg-white p-4 rounded-xl border border-[#DCE1DC]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A5450]"
            />
            <input
              type="text"
              aria-label="Cari deskripsi, kategori, atau akun"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari deskripsi, kategori, atau akun..."
              className="w-full min-h-[44px] pl-10 pr-3 py-2 text-sm border border-[#DCE1DC] rounded-lg bg-[#F7F8F5] text-[#252B28] placeholder:text-[#4A5450]"
            />
          </div>

          <div>
            <select
              aria-label="Filter berdasarkan jenis transaksi"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 text-sm border border-[#DCE1DC] rounded-lg bg-white text-[#252B28]"
            >
              <option value="all">Semua Jenis Mutasi</option>
              <option value="income">Pemasukan (+)</option>
              <option value="expense">Pengeluaran (-)</option>
            </select>
          </div>

          <div>
            <select
              aria-label="Filter berdasarkan kategori"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 text-sm border border-[#DCE1DC] rounded-lg bg-white text-[#252B28]"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type === "income" ? "Masuk" : "Keluar"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setFilterCategory("all");
                setStartDate("");
                setEndDate("");
              }}
              className="w-full min-h-[44px] px-3 py-2 text-xs font-semibold text-[#252B28] bg-[#EEF1EC] hover:bg-[#DCE1DC] rounded-lg transition-colors cursor-pointer"
            >
              Atur Ulang Filter
            </button>
          </div>
        </div>
      </section>

      <section
        aria-label="Daftar Riwayat Transaksi"
        className="bg-white rounded-xl border border-[#DCE1DC] overflow-hidden"
      >
        {filteredTransactions.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-[#4A5450]">
              Tidak ada catatan transaksi yang sesuai dengan filter saat ini.
            </p>
          </div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-[#DCE1DC]">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#252B28] break-words">
                        {tx.description || "Tanpa Deskripsi"}
                      </p>
                      <p className="text-xs text-[#4A5450] mt-0.5">
                        {formatDateID(tx.transaction_date)}
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

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-[#EEF1EC] text-[#252B28] font-medium">
                        {tx.categories?.name || "Lainnya"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md border border-[#DCE1DC] text-[#4A5450]">
                        {tx.accounts?.name || "-"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Lihat Detail Transaksi"
                        onClick={() => setDetailTx(tx)}
                        className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#4A5450] hover:text-[#123C32] hover:bg-[#EEF1EC] rounded-lg"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label="Ubah Transaksi"
                        onClick={() => openEditModal(tx)}
                        className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#4A5450] hover:text-[#123C32] hover:bg-[#EEF1EC] rounded-lg"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label="Hapus Transaksi"
                        onClick={() => handleDelete(tx)}
                        className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#991B1B] hover:bg-[#FCE8E8] rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#DCE1DC] bg-[#EEF1EC] text-xs font-bold text-[#252B28] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Tanggal</th>
                    <th className="py-3.5 px-4">Rincian & Kategori</th>
                    <th className="py-3.5 px-4">Akun Kas</th>
                    <th className="py-3.5 px-4 text-right">Nominal (Rp)</th>
                    <th className="py-3.5 px-4 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE1DC] text-sm">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-[#F7F8F5] transition-colors"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap text-[#4A5450] font-num">
                        {formatDateID(tx.transaction_date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#252B28]">
                          {tx.description || "Tanpa Deskripsi"}
                        </p>
                        <span className="inline-block text-xs text-[#4A5450]">
                          {tx.categories?.name || "Lainnya"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-[#EEF1EC] text-[#252B28] rounded-md text-xs font-semibold">
                          {tx.accounts?.name || "-"}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 whitespace-nowrap text-right font-bold font-num ${
                          tx.type === "income"
                            ? "text-[#123C32]"
                            : "text-[#991B1B]"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatRupiah(Number(tx.amount))}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            aria-label="Lihat Detail Transaksi"
                            onClick={() => setDetailTx(tx)}
                            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#4A5450] hover:text-[#123C32] hover:bg-[#EEF1EC] rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label="Ubah Transaksi"
                            onClick={() => openEditModal(tx)}
                            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#4A5450] hover:text-[#123C32] hover:bg-[#EEF1EC] rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label="Hapus Transaksi"
                            onClick={() => handleDelete(tx)}
                            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#991B1B] hover:bg-[#FCE8E8] rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {isFormOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-form-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#DCE1DC]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCE1DC]">
              <h3
                id="modal-form-title"
                className="text-lg font-bold text-[#252B28]"
              >
                {editingTx ? "Ubah Catatan Transaksi" : "Catat Transaksi Baru"}
              </h3>
              <button
                type="button"
                aria-label="Tutup Dialog"
                onClick={() => setIsFormOpen(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#4A5450] hover:text-[#252B28] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form action={handleFormSubmit} className="space-y-4">
              {editingTx && (
                <input type="hidden" name="id" value={editingTx.id} />
              )}
              <div>
                <label className="block text-xs font-bold text-[#252B28] uppercase mb-1.5">
                  Jenis Mutasi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType("expense")}
                    className={`min-h-[44px] py-2 px-3 rounded-lg text-sm font-semibold border cursor-pointer ${
                      formType === "expense"
                        ? "bg-[#FCE8E8] border-[#991B1B] text-[#991B1B]"
                        : "border-[#DCE1DC] text-[#4A5450]"
                    }`}
                  >
                    Pengeluaran (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("income")}
                    className={`min-h-[44px] py-2 px-3 rounded-lg text-sm font-semibold border cursor-pointer ${
                      formType === "income"
                        ? "bg-[#E3EDE9] border-[#123C32] text-[#123C32]"
                        : "border-[#DCE1DC] text-[#4A5450]"
                    }`}
                  >
                    Pemasukan (+)
                  </button>
                </div>
                <input type="hidden" name="type" value={formType} />
              </div>

              <div>
                <label
                  htmlFor="tx-amount"
                  className="block text-xs font-bold text-[#252B28] uppercase mb-1"
                >
                  Nominal (Rp)
                </label>
                <input
                  id="tx-amount"
                  type="number"
                  name="amount"
                  min={1}
                  required
                  defaultValue={editingTx ? Number(editingTx.amount) : ""}
                  placeholder="Contoh: 25000"
                  className="w-full min-h-[44px] px-3 py-2 text-sm border border-[#DCE1DC] rounded-lg font-num"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="tx-account"
                    className="block text-xs font-bold text-[#252B28] uppercase mb-1"
                  >
                    Akun Kas
                  </label>
                  <select
                    id="tx-account"
                    name="account_id"
                    required
                    defaultValue={
                      editingTx?.account_id || accounts[0]?.id || ""
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-sm border border-[#DCE1DC] rounded-lg bg-white"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="tx-category"
                    className="block text-xs font-bold text-[#252B28] uppercase mb-1"
                  >
                    Kategori
                  </label>
                  <select
                    id="tx-category"
                    name="category_id"
                    required
                    defaultValue={
                      editingTx?.category_id || availableCategories[0]?.id || ""
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-sm border border-[#DCE1DC] rounded-lg bg-white"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="tx-date"
                  className="block text-xs font-bold text-[#252B28] uppercase mb-1"
                >
                  Tanggal Transaksi
                </label>
                <input
                  id="tx-date"
                  type="date"
                  name="transaction_date"
                  required
                  defaultValue={editingTx?.transaction_date || todayStr}
                  className="w-full min-h-[44px] px-3 py-2 text-sm border border-[#DCE1DC] rounded-lg font-num"
                />
              </div>

              <div>
                <label
                  htmlFor="tx-desc"
                  className="block text-xs font-bold text-[#252B28] uppercase mb-1"
                >
                  Keterangan / Catatan
                </label>
                <input
                  id="tx-desc"
                  type="text"
                  name="description"
                  defaultValue={editingTx?.description || ""}
                  placeholder="Contoh: Makan siang kantin kampus"
                  className="w-full min-h-[44px] px-3 py-2 text-sm border border-[#DCE1DC] rounded-lg"
                />
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="p-3 bg-[#FCE8E8] text-[#991B1B] text-xs font-semibold rounded-lg"
                >
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE1DC]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="min-h-[44px] px-4 py-2 text-sm font-semibold text-[#252B28] bg-[#EEF1EC] hover:bg-[#DCE1DC] rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] px-5 py-2 text-sm font-semibold bg-[#123C32] text-white rounded-lg hover:bg-[#0D2B24] cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailTx && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-[#DCE1DC]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCE1DC]">
              <h3
                id="modal-detail-title"
                className="text-base font-bold text-[#252B28]"
              >
                Rincian Bukti Pencatatan
              </h3>
              <button
                type="button"
                aria-label="Tutup Rincian"
                onClick={() => setDetailTx(null)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#4A5450] hover:text-[#252B28] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-4 rounded-lg bg-[#EEF1EC] text-center mb-4">
                <span className="text-xs uppercase font-bold text-[#4A5450] block mb-1">
                  {detailTx.type === "income" ? "Mutasi Masuk" : "Mutasi Keluar"}
                </span>
                <span
                  className={`text-2xl font-bold font-num ${
                    detailTx.type === "income"
                      ? "text-[#123C32]"
                      : "text-[#991B1B]"
                  }`}
                >
                  {detailTx.type === "income" ? "+" : "-"}
                  {formatRupiah(Number(detailTx.amount))}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DCE1DC]">
                <span className="text-[#4A5450]">Tanggal</span>
                <span className="font-semibold text-[#252B28] font-num">
                  {formatDateID(detailTx.transaction_date, "dd MMMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DCE1DC]">
                <span className="text-[#4A5450]">Akun Kas</span>
                <span className="font-semibold text-[#252B28]">
                  {detailTx.accounts?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DCE1DC]">
                <span className="text-[#4A5450]">Kategori</span>
                <span className="font-semibold text-[#252B28]">
                  {detailTx.categories?.name || "-"}
                </span>
              </div>
              <div className="py-2">
                <span className="text-[#4A5450] block mb-1">Catatan</span>
                <p className="font-medium text-[#252B28] bg-[#F7F8F5] p-3 rounded-lg border border-[#DCE1DC]">
                  {detailTx.description || "Tidak ada catatan deskripsi."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDetailTx(null)}
              className="mt-5 w-full min-h-[44px] py-2 bg-[#123C32] text-white text-sm font-semibold rounded-lg cursor-pointer"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}