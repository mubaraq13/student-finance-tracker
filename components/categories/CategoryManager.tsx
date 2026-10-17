"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { Category, TransactionType } from "@/types";
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/app/(dashboard)/categories/actions";

interface CategoryManagerProps {
  categories: Category[];
}

export default function CategoryManager({ categories }: CategoryManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formType, setFormType] = useState<TransactionType>("expense");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsModalOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  function openAdd(defaultType: TransactionType = "expense") {
    setEditingCategory(null);
    setFormType(defaultType);
    setErrorMsg(null);
    setIsModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditingCategory(cat);
    setFormType(cat.type);
    setErrorMsg(null);
    setIsModalOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = editingCategory
      ? await updateCategory(formData)
      : await addCategory(formData);
    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setIsModalOpen(false);
      setEditingCategory(null);
    }
  }

  async function handleDelete(cat: Category) {
    if (confirm(`Hapus kategori "${cat.name}"?`)) {
      await deleteCategory(cat.id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DCE1DC] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4A5450]">
            Klasifikasi Pos Anggaran
          </p>
          <h1 className="text-2xl font-bold text-[#252B28] mt-0.5">
            Kategori Transaksi
          </h1>
        </div>
        <button
          type="button"
          onClick={() => openAdd("expense")}
          className="min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 bg-[#123C32] hover:bg-[#0D2B24] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          + Tambah Kategori Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pos Pengeluaran */}
        <section className="bg-white rounded-xl border border-[#DCE1DC] p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCE1DC]">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#FCE8E8] text-[#991B1B] text-xs font-bold mb-1">
                Pos Keluar
              </span>
              <h2 className="text-base font-bold text-[#252B28]">
                Kategori Pengeluaran ({expenseCategories.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => openAdd("expense")}
              className="min-h-[44px] px-3 text-xs font-bold text-[#123C32] hover:underline cursor-pointer"
            >
              + Tambah
            </button>
          </div>

          {expenseCategories.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#4A5450]">
              Belum ada kategori pengeluaran.
            </p>
          ) : (
            <div className="divide-y divide-[#DCE1DC]">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="py-2.5 flex items-center justify-between gap-2"
                >
                  <span className="text-sm font-semibold text-[#252B28]">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Ubah kategori ${cat.name}`}
                      onClick={() => openEdit(cat)}
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#4A5450] hover:text-[#123C32] hover:bg-[#EEF1EC] rounded-lg cursor-pointer"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Hapus kategori ${cat.name}`}
                      onClick={() => handleDelete(cat)}
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#991B1B] hover:bg-[#FCE8E8] rounded-lg cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pos Pemasukan */}
        <section className="bg-white rounded-xl border border-[#DCE1DC] p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCE1DC]">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#E3EDE9] text-[#123C32] text-xs font-bold mb-1">
                Pos Masuk
              </span>
              <h2 className="text-base font-bold text-[#252B28]">
                Kategori Pemasukan ({incomeCategories.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => openAdd("income")}
              className="min-h-[44px] px-3 text-xs font-bold text-[#123C32] hover:underline cursor-pointer"
            >
              + Tambah
            </button>
          </div>

          {incomeCategories.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#4A5450]">
              Belum ada kategori pemasukan.
            </p>
          ) : (
            <div className="divide-y divide-[#DCE1DC]">
              {incomeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="py-2.5 flex items-center justify-between gap-2"
                >
                  <span className="text-sm font-semibold text-[#252B28]">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Ubah kategori ${cat.name}`}
                      onClick={() => openEdit(cat)}
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#4A5450] hover:text-[#123C32] hover:bg-[#EEF1EC] rounded-lg cursor-pointer"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Hapus kategori ${cat.name}`}
                      onClick={() => handleDelete(cat)}
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#991B1B] hover:bg-[#FCE8E8] rounded-lg cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cat-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#DCE1DC]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCE1DC]">
              <h3
                id="cat-modal-title"
                className="text-lg font-bold text-[#252B28]"
              >
                {editingCategory ? "Ubah Kategori" : "Tambah Kategori Baru"}
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
              {editingCategory && (
                <input type="hidden" name="id" value={editingCategory.id} />
              )}

              <div>
                <label className="block text-xs font-bold text-[#252B28] uppercase mb-1.5">
                  Kelompok Kategori
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
                  htmlFor="cat-name"
                  className="block text-xs font-bold text-[#252B28] uppercase mb-1"
                >
                  Nama Kategori
                </label>
                <input
                  id="cat-name"
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCategory?.name || ""}
                  placeholder="Contoh: Makan & Minum, Kos, Beasiswa"
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
                  {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}