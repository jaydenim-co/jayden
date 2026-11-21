(function () {
  var C = window.JAYDEN;
  var FA = '۰۱۲۳۴۵۶۷۸۹';
  var fa = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '٬').replace(/\d/g, function (d) { return FA[d]; }); };
  var fn = function (n) { return String(n).replace(/\d/g, function (d) { return FA[d]; }); };
  var $ = function (id) { return document.getElementById(id); };
  var slug = new URLSearchParams(location.search).get('b') || 'jwpei';
  var DATA, cat, model = '', query = '', shown = 0, pool = [], byCode = {}, byGroup = {};
  var PAGE = 40, io;

  var ICON_WA = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/></svg>';
  var ICON_IG = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>';

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  fetch('data/' + slug + '.json').then(function (r) { return r.json(); }).then(function (d) {
    DATA = d;
    document.title = 'JAYDEN · ' + d.brand;
    $('bname').textContent = d.brand;
    d.cats.forEach(function (c) { c.items.forEach(function (p) { byCode[p.k] = p; (byGroup[p.b] = byGroup[p.b] || []).push(p); }); });
    var tabs = $('tabs');
    d.cats.forEach(function (c, i) {
      var b = el('button', null, c.fa + ' · ' + fn(c.items.length));
      b.setAttribute('role', 'tab');
      b.onclick = function () { setCat(c); };
      c.btn = b; tabs.appendChild(b);
    });
    setCat(d.cats[0]);
    var m = location.hash.match(/p=([^&]+)/);
    if (m && byCode[decodeURIComponent(m[1])]) openP(byCode[decodeURIComponent(m[1])], true);
  }).catch(function () { $('list').innerHTML = '<div class="empty">کاتالوگ بارگذاری نشد. دوباره امتحان کنید.</div>'; });

  function setCat(c) {
    cat = c; model = ''; $('q').value = ''; query = '';
    DATA.cats.forEach(function (x) { x.btn.setAttribute('aria-selected', x === c ? 'true' : 'false'); });
    var chips = $('chips'); chips.innerHTML = '';
    var seen = {}, models = [];
    c.items.forEach(function (p) { if (!seen[p.m]) { seen[p.m] = 1; models.push(p.m); } });
    var all = el('button', 'on', 'All'); all.onclick = function () { pickModel('', all); }; chips.appendChild(all);
    models.forEach(function (m) { var b = el('button', null, m); b.onclick = function () { pickModel(m, b); }; chips.appendChild(b); });
    render();
  }
  function pickModel(m, btn) {
    model = m;
    [].forEach.call($('chips').children, function (b) { b.classList.toggle('on', b === btn); });
    render(); window.scrollTo({ top: 0 });
  }
  $('q').addEventListener('input', function () { query = this.value.trim().toLowerCase(); render(); });

  function render() {
    pool = cat.items.filter(function (p) {
      if (model && p.m !== model) return false;
      if (query && (p.b + ' ' + p.c).toLowerCase().indexOf(query) < 0) return false;
      return true;
    });
    $('list').innerHTML = ''; shown = 0; lastGroup = null; lastGrid = null;
    if (!pool.length) { $('list').innerHTML = '<div class="empty">محصولی پیدا نشد.</div>'; return; }
    more();
  }
  var lastGroup, lastGrid;
  function more() {
    var list = $('list'), end = Math.min(shown + PAGE, pool.length);
    var old = $('morebtn'); if (old) old.remove();
    for (var i = shown; i < end; i++) {
      var p = pool[i];
      if (p.b !== lastGroup) {
        var sec = el('section', 'sec'), h = el('h2');
        h.appendChild(el('span', 'en', p.b)); h.firstChild.style.cssText = 'font-family:Playfair,serif;color:#f4efe4;font-size:15px';
        h.appendChild(el('span', null, fn((byGroup[p.b] || []).length) + ' رنگ'));
        sec.appendChild(h); lastGrid = el('div', 'grid'); sec.appendChild(lastGrid); list.appendChild(sec); lastGroup = p.b;
      }
      lastGrid.appendChild(card(p));
    }
    shown = end;
    if (shown < pool.length) {
      var b = el('button', 'more', 'نمایش محصولات بیشتر'); b.id = 'morebtn'; b.onclick = more; list.appendChild(b);
      if ('IntersectionObserver' in window) { if (io) io.disconnect(); io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) more(); }, { rootMargin: '600px' }); io.observe(b); }
    }
  }
  function card(p) {
    var a = el('button', 'card'); a.type = 'button'; a.setAttribute('aria-label', p.b + ' ' + p.c);
    a.innerHTML = '<div class="ph"><img loading="lazy" decoding="async" alt=""><span class="off"></span></div><div class="info"><div class="n"></div><div class="c"></div><s></s><b></b></div>';
    a.querySelector('img').src = p.i[0];
    a.querySelector('.off').textContent = '-' + fn(p.d) + '٪';
    a.querySelector('.n').textContent = p.b;
    a.querySelector('.c').textContent = p.c + (p.z && p.z.length ? ' · Size ' + p.z.join(' · ') : '');
    a.querySelector('s').textContent = p.o ? fa(p.o) : '';
    a.querySelector('b').innerHTML = fa(p.f) + ' <small>تومان</small>';
    a.onclick = function () { openP(p); };
    return a;
  }

  var cur;
  function openP(p, fromHash) {
    cur = p;
    var g = $('gal'), dots = $('dots'); g.innerHTML = ''; dots.innerHTML = '';
    p.i.forEach(function (src, n) {
      var d = el('div'); var im = el('img'); im.src = src; im.alt = p.b + ' ' + p.c + ' ' + (n + 1);
      if (n) im.loading = 'lazy';
      d.appendChild(im); g.appendChild(d);
      dots.appendChild(el('i', n ? '' : 'on'));
    });
    g.scrollLeft = 0;
    g.onscroll = function () { var k = Math.round(Math.abs(g.scrollLeft) / g.clientWidth); [].forEach.call(dots.children, function (x, j) { x.className = j === k ? 'on' : ''; }); };
    $('pname').textContent = p.b;
    $('pmeta').textContent = DATA.brand + ' · ' + p.c;
    $('pfin').innerHTML = fa(p.f) + ' <small style="font-size:13px">تومان</small>';
    $('porg').textContent = p.o ? fa(p.o) : '';
    $('szwrap').style.display = p.z && p.z.length ? '' : 'none';
    var sz = $('psizes'); sz.innerHTML = ''; (p.z || []).forEach(function (s) { sz.appendChild(el('span', null, s)); });
    var cl = $('pcolors'); cl.innerHTML = '';
    (byGroup[p.b] || [p]).forEach(function (q) {
      var b = el('button', q === p ? 'on' : ''); b.type = 'button'; b.setAttribute('aria-pressed', q === p ? 'true' : 'false');
      var im = el('img'); im.src = q.i[0]; im.alt = ''; im.loading = 'lazy'; b.appendChild(im); b.appendChild(el('span', null, q.c));
      b.onclick = function () { openP(q, true); history.replaceState(null, '', '#p=' + encodeURIComponent(q.k)); };
      cl.appendChild(b);
    });
    $('pcode').textContent = p.k + ' · ' + p.b + ' - ' + p.c;
    var msg = 'سلام، برای سفارش این محصول: ' + p.k + ' | ' + DATA.brand + ' ' + p.b + ' - ' + p.c;
    var o = $('porder'); o.innerHTML = '';
    [['ig', 'سفارش در دایرکت', C.instagram, ICON_IG], ['wa', 'سفارش در واتساپ', C.whatsapp, ICON_WA]].forEach(function (x) {
      var a = el('a', x[0]); a.href = x[2]; a.target = '_blank'; a.rel = 'noopener'; a.innerHTML = x[3] + '<span></span>'; a.querySelector('span').textContent = x[1];
      a.onclick = function () { try { navigator.clipboard.writeText(msg); toast('کد محصول کپی شد؛ در پیام paste کنید'); } catch (e) {} };
      o.appendChild(a);
    });
    $('sheet').classList.add('open'); $('sheet').scrollTop = 0; document.body.style.overflow = 'hidden';
    if (!fromHash) history.pushState({ p: p.k }, '', '#p=' + encodeURIComponent(p.k));
  }
  function closeP() { $('sheet').classList.remove('open'); document.body.style.overflow = ''; }
  $('close').onclick = function () { if (history.state && history.state.p) history.back(); else { closeP(); history.replaceState(null, '', location.pathname + location.search); } };
  window.addEventListener('popstate', function () { var m = location.hash.match(/p=([^&]+)/); if (m && byCode[decodeURIComponent(m[1])]) openP(byCode[decodeURIComponent(m[1])], true); else closeP(); });

  function toast(t) {
    var x = el('div', null, t);
    x.style.cssText = 'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);background:#15130f;color:#f1d27a;padding:10px 16px;border-radius:10px;font-size:13px;z-index:99';
    document.body.appendChild(x); setTimeout(function () { x.remove(); }, 2500);
  }
})();
