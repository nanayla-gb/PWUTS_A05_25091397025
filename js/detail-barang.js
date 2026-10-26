(function ($) {
  function fmt(t) {
    return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
  }
  function iso(o) { var t = new Date(); t.setDate(t.getDate() + o); return fmt(t); }

  var barang = [
    { id: 1, ico: '\uD83D\uDCFD\uFE0F', nama: 'Proyektor', kategori: 'Presentasi', stok: 5, kondisi: 'Baik', lokasi: 'Gudang lantai 1' },
    { id: 2, ico: '\uD83D\uDCF7', nama: 'Kamera DSLR', kategori: 'Multimedia', stok: 3, kondisi: 'Baik', lokasi: 'Gudang lantai 1' },
    { id: 3, ico: '\uD83C\uDF99\uFE0F', nama: 'Mikrofon nirkabel', kategori: 'Audio', stok: 4, kondisi: 'Baik', lokasi: 'Ruang multimedia' },
    { id: 4, ico: '\uD83D\uDCBB', nama: 'Laptop', kategori: 'Komputer', stok: 6, kondisi: 'Cukup baik', lokasi: 'Lab komputer' },
    { id: 5, ico: '\uD83D\uDD0C', nama: 'Terminal listrik', kategori: 'Perlengkapan', stok: 8, kondisi: 'Baik', lokasi: 'Gudang lantai 1' }
  ];
  // Peminjaman yang sudah disetujui (hari relatif terhadap hari ini): b = id barang, s = mulai, e = selesai, q = jumlah
  var booking = [
    { b: 1, s: 0, e: 2, q: 2 }, { b: 1, s: 1, e: 4, q: 2 }, { b: 1, s: 2, e: 3, q: 1 },
    { b: 2, s: 0, e: 6, q: 3 }, { b: 3, s: 3, e: 5, q: 2 }, { b: 4, s: -1, e: 1, q: 3 },
    { b: 4, s: 2, e: 2, q: 3 }, { b: 5, s: 5, e: 7, q: 4 }
  ];
  var cur = barang[0];

  function sisa(b, tgl) {
    var pakai = booking.reduce(function (a, x) {
      return a + (x.b === b.id && iso(x.s) <= tgl && iso(x.e) >= tgl ? x.q : 0);
    }, 0);
    return b.stok - pakai;
  }

  function daftar() {
    var $w = $('#items').empty();
    barang.forEach(function (b) {
      $('<button type="button" class="item">').attr('aria-pressed', b === cur)
        .append($('<span aria-hidden="true">').text(b.ico), $('<strong>').text(b.nama))
        .on('click', function () { cur = b; daftar(); detail(); hitung(); })
        .appendTo($w);
    });
  }

  function detail() {
    var s = sisa(cur, iso(0)), st = s > 0 ? '<span class="badge ok">Tersedia hari ini</span>' : '<span class="badge bad">Habis hari ini</span>';
    $('#detail').html('<h2>' + cur.ico + ' ' + cur.nama + ' ' + st + '</h2>' +
      '<dl class="kv"><dt>Kategori</dt><dd>' + cur.kategori + '</dd><dt>Lokasi</dt><dd>' + cur.lokasi +
      '</dd><dt>Kondisi</dt><dd>' + cur.kondisi + '</dd><dt>Stok</dt><dd>' + s + ' dari ' + cur.stok + ' unit tersedia hari ini</dd></dl>');
  }

  function hitung() {
    var s = $('#tglPinjam').val(), e = $('#tglKembali').val(), q = parseInt($('#jumlah').val(), 10), $h = $('#hasil');
    function pesan(t) { $h.html('<p class="err">' + t + '</p>'); }
    if (!s || !e || !(q >= 1)) { $h.html('<p class="muted">Isi tanggal pinjam, tanggal kembali, dan jumlah untuk melihat hasil.</p>'); return; }
    if (s < iso(0)) { pesan('Tanggal pinjam tidak boleh sebelum hari ini.'); return; }
    if (e < s) { pesan('Tanggal kembali tidak boleh sebelum tanggal pinjam.'); return; }
    var d = new Date(s + 'T00:00:00'), hari = Math.round((new Date(e + 'T00:00:00') - d) / 864e5) + 1;
    if (hari > 14) { pesan('Simulasi maksimal 14 hari.'); return; }
    var min = cur.stok, cells = '';
    for (var i = 0; i < hari; i++) {
      var t = new Date(d); t.setDate(d.getDate() + i);
      var r = sisa(cur, fmt(t)); min = Math.min(min, r);
      cells += '<li class="day ' + (r >= q ? 'ok' : 'bad') + '"><b>' + t.getDate() + '/' + (t.getMonth() + 1) + '</b><span>sisa ' + r + '</span></li>';
    }
    var v = min >= q ? '<span class="badge ok">Bisa dipinjam</span> ' + q + ' unit tersedia sepanjang ' + hari + ' hari.'
      : min > 0 ? '<span class="badge warn">Stok kurang</span> Hanya ' + min + ' unit yang tersedia di seluruh rentang ini. Kurangi jumlah atau ubah tanggal.'
      : '<span class="badge bad">Tidak tersedia</span> Ada tanggal dengan stok habis. Coba tanggal lain atau barang lain.';
    $h.html('<p>' + v + '</p><p class="muted">Sisa stok per tanggal (durasi ' + hari + ' hari):</p><ul class="days">' + cells + '</ul>');
  }

  $('#tglPinjam').attr('min', iso(0)).val(iso(1)).on('input change', hitung);
  $('#tglKembali').attr('min', iso(0)).val(iso(3)).on('input change', hitung);
  $('#jumlah').on('input change', hitung);
  daftar(); detail(); hitung();
})(jQuery);
