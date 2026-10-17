# DESIGN.md: Student Finance

## 1. Identitas & Karakter
- **Nama Produk**: Student Finance
- **Target Pengguna**: Mahasiswa yang mengelola arus kas harian, anggaran kos/kuliah, dan evaluasi pengeluaran bulanan.
- **Karakter Visual**: Modern fintech, hangat, bersih, presisi, berorientasi pada keterbacaan angka (*data-first ledger*).
- **Dials**: `Dial: ENERGY 2 / RHYTHM 2 / MOTION 1`
- **Tema**: Light Mode tetap (latar kertas hangat `#F7F8F5` untuk kenyamanan baca tabel finansial jangka panjang).

## 2. Palet Warna & Kontras (WCAG AA/AAA)
- **Canvas Background**: `#F7F8F5` (Off-White hangat)
- **Surface / Container**: `#FFFFFF` (Putih bersih) & `#EEF1EC` (Abu-abu kehijauan lembut untuk header tabel/input)
- **Border Structural**: `#DCE1DC` (Garis pemisah tegas 1px, tanpa efek bayangan mengambang)
- **Primary Brand**: `#123C32` (Deep Emerald, rasio kontras terhadap putih: 12.4:1)
- **Primary Text**: `#252B28` (Charcoal, rasio kontras terhadap `#F7F8F5`: 13.2:1)
- **Secondary Text**: `#4A5450` (Deep Slate, rasio kontras terhadap `#F7F8F5`: 7.1:1)
- **Deliberate Accent**: `#B8D978` (Muted Lime, HANYA digunakan untuk indikator aktif, highlight kartu utama, dan penanda fokus; wajib dipasangkan dengan teks `#123C32`, rasio kontras: 7.6:1)
- **Semantic Financial Colors**:
  - Pemasukan (Income): Teks `#123C32`, Latar Label `#E3EDE9`
  - Pengeluaran (Expense): Teks `#991B1B`, Latar Label `#FCE8E8`

## 3. Tipografi & Motif Identitas
- **Motif Utama**: Seluruh angka nominal dan persentase wajib menggunakan `tabular-nums` (`font-variant-numeric: tabular-nums`) agar sejajar presisi.
- **Radius Sudut**: Hirarki terukur: `rounded-xl` (12px) untuk kontainer utama, `rounded-lg` (8px) untuk tombol dan input, `rounded-md` (6px) untuk label kategori. Dilarang membuat seluruh elemen berbentuk kapsul penuh (*pill-shaped*).

## 4. Aturan Mobile & Aksesibilitas
- Responsif mulai dari lebar layar `360px` tanpa *horizontal overflow*.
- Ukuran target sentuh (*tap target*) minimal `44px x 44px` pada seluruh tombol, input, dan item navigasi.
- Setiap elemen interaktif wajib memiliki indikator `:focus-visible` yang jelas (`2px solid #123C32`) dan modal dapat ditutup dengan tombol `Escape`.