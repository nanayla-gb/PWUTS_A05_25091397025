(function ($) {
  function fmt(t) {
    return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
  }
  function iso(o) { var t = new Date(); t.setDate(t.getDate() + o); return fmt(t); }

  // Data contoh transaksi aktif; pinjam/kembali = hari relatif terhadap hari ini
  var pinjaman = [
    { id: 'PJM-001', barang: 'Proyektor', peminjam: 'Rina Aulia', pinjam: -6, kembali: -1 },
    { id: 'PJM-002', barang: 'Kamera DSLR', peminjam: 'Panitia Wisuda', pinjam: -3, kembali: 2 },
    { id: 'PJM-003', barang: 'Laptop', peminjam: 'Bima Saputra', pinjam: -2, kembali: 0 }
  ];
  var F = ['id_peminjaman', 'tgl_dikembalikan', 'kondisi_kembali', 'catatan'], touched = {}, $f = $('#formKembali');

  pinjaman.forEach(function (p) { $('#id_peminjaman').append($('<option>').val(p.id).text(p.id + ' - ' + p.barang)); });
  $('#tgl_dikembalikan').attr('max', iso(0));

  function cur() { return pinjaman.filter(function (p) { return p.id === $('#id_peminjaman').val(); })[0]; }
  function kondisi() { return $f.find('[name=kondisi_kembali]:checked').val(); }

  function info() {
    var p = cur(), tgl = $('#tgl_dikembalikan').val(), $i = $('#infoPinjam');
    if (!p) { $i.empty(); return; }
    var telat = tgl ? Math.round((new Date(tgl) - new Date(iso(p.kembali))) / 864e5) : 0;
    var st = telat > 0 ? '<span class="badge bad">Terlambat ' + telat + ' hari</span>' : '<span class="badge ok">Tepat waktu</span>';
    $i.html('<dl><dt>Peminjam</dt><dd>' + p.peminjam + '</dd><dt>Barang</dt><dd>' + p.barang +
      '</dd><dt>Tanggal pinjam</dt><dd>' + iso(p.pinjam) + '</dd><dt>Batas kembali</dt><dd>' + iso(p.kembali) + ' ' + (tgl ? st : '') + '</dd></dl>');
  }

  // Aturan validasi sebelum data dikirim ke server
  function cek() {
    var e = {}, p = cur(), tgl = $('#tgl_dikembalikan').val(), k = kondisi(), c = $.trim($('#catatan').val());
    if (!p) e.id_peminjaman = 'Pilih transaksi yang dikembalikan.';
    if (!tgl) e.tgl_dikembalikan = 'Isi tanggal pengembalian.';
    else if (tgl > iso(0)) e.tgl_dikembalikan = 'Tanggal tidak boleh melewati hari ini.';
    else if (p && tgl < iso(p.pinjam)) e.tgl_dikembalikan = 'Tanggal tidak boleh sebelum tanggal pinjam (' + iso(p.pinjam) + ').';
    if (!k) e.kondisi_kembali = 'Pilih kondisi barang saat kembali.';
    if (k && k !== 'Baik' && c.length < 10) e.catatan = 'Jelaskan kondisinya minimal 10 karakter.';
    return e;
  }

  function tampil() {
    var e = cek();
    F.forEach(function (n) {
      var m = touched[n] ? (e[n] || '') : '';
      $('#err_' + n).text(m);
      $f.find('[name=' + n + ']').attr('aria-invalid', m ? 'true' : 'false').toggleClass('invalid', !!m);
    });
    var k = kondisi();
    $('#hintCatatan').text(k && k !== 'Baik' ? '(wajib diisi, minimal 10 karakter)' : '(boleh kosong bila kondisi baik)');
    return e;
  }

  $f.on('input change focusout', 'input,select,textarea', function () { touched[this.name] = true; info(); tampil(); });

  $f.on('submit', function (ev) {
    ev.preventDefault();
    F.forEach(function (n) { touched[n] = true; });
    var e = tampil(), first = F.filter(function (n) { return e[n]; })[0];
    if (first) { $f.find('[name=' + first + ']').first().trigger('focus'); return; }

    var $b = $('#btnKirim').prop('disabled', true).text('Menyimpan...'), $s = $('#sukses');
    $.ajax({ url: this.action, method: 'POST', data: $f.serialize() })
      .done(function (res) {
        var $l = $('<dl class="kv">');
        $.each(res.form || {}, function (k, v) { $l.append($('<dt>').text(k), $('<dd>').text(v)); });
        $s.prop('hidden', false).empty().append($('<h2>').text('Pengembalian tersimpan'),
          $('<p>').text('Server menerima data berikut.'), $l);
        $f[0].reset(); touched = {}; $('#tgl_dikembalikan').val(iso(0)); info(); tampil();
      })
      .fail(function () {
        $s.prop('hidden', false).empty().append($('<h2>').text('Data belum terkirim'),
          $('<p class="err">').text('Server tidak dapat dihubungi. Periksa koneksi internet, lalu simpan ulang.'));
      })
      .always(function () { $b.prop('disabled', false).text('Simpan pengembalian'); });
  });

  $('#tgl_dikembalikan').val(iso(0));
})(jQuery);
