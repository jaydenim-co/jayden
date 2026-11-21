(function () {
  var C = window.JAYDEN;
  var FA = '۰۱۲۳۴۵۶۷۸۹';
  var fa = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '٬').replace(/\d/g, function (d) { return FA[d]; }); };
  var fn = function (n) { return String(n).replace(/\d/g, function (d) { return FA[d]; }); };
  var $ = function (id) { return document.getElementById(id); };
  var slug = new URLSearchParams(location.search).get('b') || 'jwpei';
  var DATA, cat = null, query = '', shown = 0, pool = [], byCode = {}, byGroup = {};
  var PAGE = 40, io;

  var ICON_WA = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/></svg>';
  var ICON_IG = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>';

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  var group = '', sortBy = '', BR = (C.brands || []).filter(function (b) { return b.slug === slug; })[0] || {};

  fetch('data/' + slug + '.json').then(function (r) { return r.json(); }).then(function (d) {
    DATA = d;
    document.title = 'JAYDEN · ' + d.brand;
    $('bname').textContent = BR.name || d.brand;
    if (BR.font) $('bname').classList.add(BR.font);
    d.cats.forEach(function (c) { c.items.forEach(function (p) { p._c = c; byCode[p.k] = p; (byGroup[p.b] = byGroup[p.b] || []).push(p); }); });
    var tabs = $('tabs');
    (d.groups || []).forEach(function (g) {
      var n = d.cats.filter(function (c) { return c.g === g.id; }).reduce(function (s, c) { return s + c.items.length; }, 0);
      var b = el('button', null, g.fa + ' · ' + fn(n)); b.setAttribute('role', 'tab');
      b.onclick = function () { setGroup(g.id); };
      g.btn = b; tabs.appendChild(b);
    });
    var m = location.hash.match(/p=([^&]+)/), hp = m && byCode[decodeURIComponent(m[1])];
    setGroup(hp && hp._c.g ? hp._c.g : (d.groups ? d.groups[0].id : ''));
    if (hp) openP(hp, true);
  }).catch(function () { $('list').innerHTML = '<div class="empty">کاتالوگ بارگذاری نشد. دوباره امتحان کنید.</div>'; });

  function cats() { return DATA.cats.filter(function (c) { return !group || c.g === group; }); }
  function setGroup(g) {
    group = g; cat = null;
    (DATA.groups || []).forEach(function (x) { x.btn.setAttribute('aria-selected', x.id === g ? 'true' : 'false'); });
    var chips = $('chips'); chips.innerHTML = '';
    var cs = cats();
    if (cs.length > 1) {
      var total = cs.reduce(function (s, c) { return s + c.items.length; }, 0);
      var all = el('button', 'on'); all.innerHTML = 'همه <small></small>'; all.querySelector('small').textContent = fn(total);
      all.onclick = function () { pickCat(null, all); }; chips.appendChild(all);
      cs.forEach(function (c) {
        var b = el('button'); b.innerHTML = '<span></span> <small></small>';
        b.firstChild.textContent = c.fa; b.querySelector('small').textContent = fn(c.items.length);
        b.onclick = function () { pickCat(c, b); }; chips.appendChild(b);
      });
    }
    render();
  }
  function pickCat(c, btn) {
    cat = c;
    [].forEach.call($('chips').children, function (b) { b.classList.toggle('on', b === btn); });
    render(); window.scrollTo({ top: 0 });
  }
  $('q').addEventListener('input', function () { query = this.value.trim().toLowerCase(); render(); });
  $('sort').addEventListener('change', function () { sortBy = this.value; render(); });

  function render() {
    var src = [];
    (cat ? [cat] : cats()).forEach(function (c) { src = src.concat(c.items); });
    pool = src.filter(function (p) { return !query || (p.b + ' ' + p.c + ' ' + p.k).toLowerCase().indexOf(query) >= 0; });
    if (sortBy) pool = pool.slice().sort(function (a, b) { return sortBy === 'asc' ? a.f - b.f : b.f - a.f; });
    $('count').textContent = fn(pool.length) + ' محصول';
    $('list').innerHTML = ''; shown = 0; grid = null;
    if (!pool.length) { $('list').innerHTML = '<div class="empty">محصولی پیدا نشد.</div>'; return; }
    grid = el('div', 'grid'); $('list').appendChild(grid);
    more();
  }
  var grid;
  function more() {
    var list = $('list'), end = Math.min(shown + PAGE, pool.length);
    var old = $('morebtn'); if (old) old.remove();
    for (var i = shown; i < end; i++) grid.appendChild(card(pool[i]));
    shown = end;
    if (shown < pool.length) {
      var b = el('button', 'more', 'نمایش محصولات بیشتر'); b.id = 'morebtn'; b.onclick = more; list.appendChild(b);
      if ('IntersectionObserver' in window) { if (io) io.disconnect(); io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) more(); }, { rootMargin: '600px' }); io.observe(b); }
    }
  }
  function orderMsg(p) { return 'سلام، برای سفارش این محصول: ' + p.k + ' | ' + (BR.name || DATA.brand) + ' ' + p.b + ' - ' + p.c; }
  function orderLink(cls, label, href, icon, p) {
    var a = el('a', cls); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.innerHTML = icon + '<span></span>'; a.querySelector('span').textContent = label;
    a.onclick = function () { try { navigator.clipboard.writeText(orderMsg(p)); toast('کد محصول کپی شد؛ در پیام paste کنید'); } catch (e) {} };
    return a;
  }
  function card(p) {
    var a = el('div', 'card');
    a.innerHTML = '<button type="button" class="tap"><div class="ph"><img loading="lazy" decoding="async" alt=""><span class="off"></span></div><div class="info"><div class="n"></div><div class="c"></div><s></s><b></b></div></button><div class="cact"></div>';
    a.querySelector('.tap').setAttribute('aria-label', p.b + ' ' + p.c);
    a.querySelector('img').src = p.i[0];
    if (p.d > 0) a.querySelector('.off').textContent = '-' + fn(p.d) + '٪'; else a.querySelector('.off').remove();
    a.querySelector('.n').textContent = p.b;
    a.querySelector('.c').textContent = p.c + (p.z && p.z.length ? ' · Size ' + p.z.join(' · ') : '');
    a.querySelector('s').textContent = p.o ? fa(p.o) : '';
    a.querySelector('b').innerHTML = fa(p.f) + ' <small>تومان</small>';
    a.querySelector('.tap').onclick = function () { openP(p); };
    var act = a.querySelector('.cact'); act.appendChild(el('div', 'olbl', 'ثبت سفارش'));
    act.appendChild(orderLink('ig', 'دایرکت', C.instagram, ICON_IG, p));
    act.appendChild(orderLink('wa', 'واتساپ', C.whatsapp, ICON_WA, p));
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
    $('pmeta').textContent = (BR.name || DATA.brand) + ' · ' + p.c;
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
    var msg = orderMsg(p);
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
