$(function () {
  var $c = $('#content'), $nav = $('#nav'), $btn = $('#menuBtn'), home = $c.html();

  function aktif(key) {
    $nav.find('a').removeClass('active').removeAttr('aria-current');
    $nav.find('a[data-key="' + key + '"]').addClass('active').attr('aria-current', 'page');
  }
  function tutupMenu() { $nav.removeClass('open'); $btn.attr('aria-expanded', 'false'); }

  function buka($a) {
    var key = $a.data('key');
    tutupMenu();
    if (key === 'home') {
      $c.html(home); aktif(key); location.hash = key; return;
    }
    $c.html('<p role="status">Memuat halaman...</p>');
    // Teknik Ajax: isi halaman diambil dengan jQuery .load(), layout utama tidak dimuat ulang
    $c.load($a.attr('href'), function (res, status) {
      if (status === 'error') {
        $c.html('<div class="panel"><h2>Halaman tidak bisa dimuat</h2><p>Buka situs lewat server (Live Server atau GitHub Pages), bukan langsung dari file di folder.</p></div>');
        return;
      }
      var s = $a.data('script');
      if (s) { $.getScript(s); }
      aktif(key); location.hash = key;
      window.scrollTo(0, 0); $c.trigger('focus');
    });
  }

  $nav.on('click', 'a', function (e) { e.preventDefault(); buka($(this)); });
  $('.brand').on('click', function (e) { e.preventDefault(); buka($nav.find('a[data-key="home"]')); });
  $(document).on('click', '[data-go]', function (e) {
    e.preventDefault(); buka($nav.find('a[data-key="' + $(this).data('go') + '"]'));
  });
  $btn.on('click', function () {
    var open = $nav.toggleClass('open').hasClass('open');
    $btn.attr('aria-expanded', open);
  });

  var k = location.hash.slice(1), $t = $nav.find('a[data-key="' + k + '"]');
  if ($t.length && k !== 'home') { buka($t); }
});
