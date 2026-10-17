"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import {
  addAccount,
  updateAccount,
  deleteAccount,
} from "@/app/(dashboard)/accounts/actions";

// 1. KITA DEFINISIKAN TIPE DATA SECARA LENGKAP DI SINI
export type AccountType = "cash" | "bank" | "ewallet";

export interface AccountWithBalance {
  id: string;
  name: string;
  type: AccountType;
  initial_balance: number | string;
  current_balance: number;
}

interface AccountManagerProps {
  accounts: AccountWithBalance[];
}

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: "Uang Tunai",
  bank: "Rekening Bank",
  ewallet: "Dompet Digital (E-Wallet)",
};

export default function AccountManager({ accounts }: AccountManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountWithBalance | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsModalOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.current_balance || 0),
    0
  );

  function openAdd() {
    setEditingAccount(null);
    setErrorMsg(null);
    setIsModalOpen(true);
  }

  function openEdit(acc: AccountWithBalance) {
    setEditingAccount(acc);
    setErrorMsg(null);
    setIsModalOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMsg(null);
    
    // 2. KITA TAMBAHKAN ": any" AGAR TYPESCRIPT TIDAK CEREWET SOAL "never"
    const res: any = editingAccount
      ? await updateAccount(formData)
      : await addAccount(formData);
      
    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setIsModalOpen(false);
      setEditingAccount(null);
    }
  }

  async function handleDelete(acc: AccountWithBalance) {
    if (
      confirm(
        `Hapus akun kas "${acc.name}"? Semua transaksi yang terhubung ke akun ini juga akan terhapus.`
      )
    ) {
      await deleteAccount(acc.id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DCE1DC] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4A5450]">
            Sumber Dana
          </p>
          <h1 className="text-2xl font-bold text-[#252B28] mt-0.5">
            Daftar Akun Kas
          </h1>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 bg-[#123C32] hover:bg-[#0D2B24] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          + Tambah Akun Kas
        </button>
      </div>

      {/* Focal Point: Total Akumulasi Seluruh Akun */}
      <div className="bg-[#123C32] text-white p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B8D978]">
            Total Likuiditas ({accounts.length} Akun)
          </span>
          <p className="text-2xl sm:text-3xl font-bold font-num mt-1">
            {formatRupiah(totalBalance)}
          </p>
        </div>
        <span className="self-start sm:self-center px-3 py-1 rounded-md bg-[#B8D978] text-[#123C32] text-xs font-bold">
          Saldo Riil Terintegrasi
        </span>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border border-[#DCE1DC] text-center">
          <p className="text-sm font-medium text-[#4A5450] mb-4">
            Belum ada akun kas. Buat akun pertamamu (seperti Dompet Tunai, BCA,
            atau GoPay).
          </p>
          <button
            type="button"
            onClick={openAdd}
            className="min-h-[44px] px-4 py-2 bg-[#123C32] text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            + Buat Akun Kas Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white p-5 rounded-xl border border-[#DCE1DC] flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#EEF1EC] text-[#252B28] text-xs font-semibold mb-1.5">
                    {ACCOUNT_TYPE_LABELS[acc.type] || acc.type}
                  </span>
                  <h2 className="text-lg font-bold text-[#252B28] truncate">
                    {acc.name}
                  </h2>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    aria-label={`Ubah ${acc.name}`}
                    onClick={() => openEdit(acc)}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#4A5450] hover:text-[#123C32] hover:bg-[#EEF1EC] rounded-lg cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus ${acc.name}`}
                    onClick={() => handleDelete(acc)}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#991B1B] hover:bg-[#FCE8E8] rounded-lg cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#DCE1DC] flex items-baseline justify-between gap-2">
                <span className="text-xs text-[#4A5450]">
                  Saldo Awal: {formatRupiah(Number(acc.initial_balance))}
                </span>
                <span
                  className={`text-xl font-bold font-num ${
                    acc.current_balance < 0
                      ? "text-[#991B1B]"
                      : "text-[#123C32]"
                  }`}
                >
                  {formatRupiah(acc.current_balance)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="account-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#DCE1DC]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCE1DC]">
              <h3
                id="account-modal-title"
                className="text-lg font-bold text-[#252B28]"
              >
                {editingAccount ? "Ubah Akun Kas" : "Tambah Akun Kas Baru"}
              </h3>
              <button
                type="button"
                aria-label="Tutup Dialog"
                onClick={() => setIsModalOpen(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#4A5450] hover:text-[#252B28] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
              {editingAccount && (
                <input type="hidden" name="id" value={editingAccount.id} />
              )}

              <div>
                <label
                  htmlFor="acc-name"
                  className="block text-xs font-bold text-[#252B28] uppercase mb-1"
                >
                  Nama Akun Kas
                </label>
                <input
                  id="acc-name"
                  type="text"
                  name="name"
                  required
                  defaultValue={editingAccount?.name || ""}
                  placeholder="Contoh: BCA, GoPay, Dompet Kos"
                  className="w-full min-h-[44px] px-3 py-2 text-sm border border-[#DCE1DC] rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="acc-type"
                  className="block text-xs font-bold text-[#252B28] uppercase mb-1"
                >
                  Jenis Penyimpanan
                </label>
                <select
                  id="acc-type"
                  name="type"
                  defaultValue={editingAccount?.type || "bank"}
                  className="w-full min-h-[44px] px-3 py-2 text-sm border border-[#DCE1DC] rounded-lg bg-white"
                >
                  <option value="cash">Uang Tunai (Cash)</option>
                  <option value="bank">Rekening Bank</option>
                  <option value="ewallet">Dompet Digital (E-Wallet)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="acc-balance"
                  className="block text-xs font-bold text-[#252B28] uppercase mb-1"
                >
                  Saldo Awal (Rp)
                </label>
                <input
                  id="acc-balance"
                  type="number"
                  name="initial_balance"
                  required
                  defaultValue={
                    editingAccount ? Number(editingAccount.initial_balance) : 0
                  }
                  className="w-full min-h-[44px] px-3 py-2 text-sm border border-[#DCE1DC] rounded-lg font-num"
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
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 text-sm font-semibold text-[#252B28] bg-[#EEF1EC] rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] px-5 py-2 text-sm font-semibold bg-[#123C32] text-white rounded-lg hover:bg-[#0D2B24] cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}