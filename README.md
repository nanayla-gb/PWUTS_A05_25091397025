# PWUTS_A05_25091397025 - Vokasi Loan

UTS Pemrograman Web (D4 MI 2025), Program Vokasi UNESA.
Nama: Nayla Nur Syifa | NIM: 25091397025 | Kelas 2025A | Kelompok 5
Topik proposal: **Sistem Peminjaman Barang di Fakultas Vokasi UNESA**

## Bagian yang saya kerjakan

| Item | Isi | File |
|---|---|---|
| 2.a | Layout utama responsif, menu dengan Ajax | `index.html`, `css/style.css`, `js/app.js` |
| 2.b | Detail barang + simulasi cek ketersediaan stok per tanggal | `pages/detail-barang.html`, `js/detail-barang.js` |
| 2.c | Form pencatatan pengembalian (tabel `pengembalian`) + validasi | `pages/form-pengembalian.html`, `js/form-pengembalian.js` |

## Cara menjalankan

Menu memakai Ajax, jadi situs harus dibuka lewat server HTTP, bukan dengan klik dua kali `index.html`.
- VS Code: ekstensi Live Server, klik kanan `index.html` > Open with Live Server, atau
- Terminal: `python -m http.server 8000` di folder ini, lalu buka `http://localhost:8000`.
- Versi online: GitHub Pages dari repository ini.

## Penjelasan singkat

**2.a Layout.** HTML, CSS, dan jQuery. Di layar lebar menu tampil sebagai sidebar, di layar kecil menjadi tombol menu. Link menu memuat halaman 2.b dan 2.c ke area konten dengan `$.load()` (Ajax), lalu menjalankan script halamannya dengan `$.getScript()`. Alamat `#detail` atau `#kembali` bisa dibuka langsung.

**2.b Simulasi stok.** Pilih barang, lalu isi tanggal pinjam, tanggal kembali, dan jumlah. Script menghitung sisa stok untuk setiap tanggal (stok dikurangi peminjaman yang sudah disetujui) dan memberi hasil: bisa dipinjam, stok kurang, atau tidak tersedia. Data barang dan peminjaman adalah data contoh.

**2.c Form pengembalian.** Field mengikuti tabel `pengembalian` di proposal: `id_peminjaman`, `tgl_dikembalikan`, `kondisi_kembali`, `catatan`. Validasi jQuery sebelum submit:
- transaksi wajib dipilih;
- tanggal wajib diisi, tidak boleh setelah hari ini dan tidak boleh sebelum tanggal pinjam;
- kondisi wajib dipilih;
- catatan wajib minimal 10 karakter bila kondisi bukan "Baik".

Info peminjam dan status keterlambatan muncul otomatis. Bila valid, data dikirim lewat `$.ajax` POST ke `https://httpbin.org/post` (server uji HTTP) dan isi yang diterima server ditampilkan. Ganti `action` pada form bila sudah ada backend sendiri.

## Struktur folder

```
index.html
css/style.css
js/app.js  js/detail-barang.js  js/form-pengembalian.js
pages/detail-barang.html  pages/form-pengembalian.html
img/logo.svg  img/hero.svg
README.md
```
