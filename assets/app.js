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

  var qs = (location.search.match(/[?&]s=([a-z]+)/) || [])[1]; if (qs) { var bk = document.querySelector('.top .back, a.back'); if (bk) bk.href = 'index.html#' + qs; var SC = (C.sections || []).filter(function (x) { return x.id === qs; })[0], sm = document.querySelector('.bar2 small'); if (SC && sm) sm.innerHTML = '<a class="crumb" href="index.html#' + qs + '">بخش ' + SC.fa + '</a> | حراج <span class="en">BLACK FRIDAY</span>'; }
  var group = '', sortBy = '', BR = (C.brands || []).filter(function (b) { return b.slug === slug; })[0] || {};

  fetch('data/' + slug + '.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
    DATA = d;
    document.title = 'JAYDEN · ' + d.brand;
    $('bname').textContent = BR.name || d.brand;
    if (BR.font) $('bname').classList.add(BR.font);
    if (BR.badge) { $('bname').insertAdjacentHTML('beforeend', ' <i class="prem">' + BR.badge + '</i>'); }
    if (BR.note) { $('bnote').textContent = BR.note; $('bnote').hidden = false; }
    d.cats.forEach(function (c) { c.items.forEach(function (p) { p._c = c; byCode[p.k] = p; var gk = (p.br || '') + '|' + p.b; (byGroup[gk] = byGroup[gk] || []).push(p); }); });
    var tabs = $('tabs');
    (d.groups || []).forEach(function (g) {
      var n = d.cats.filter(function (c) { return c.g === g.id; }).reduce(function (s, c) { return s + c.items.length; }, 0);
      var b = el('button', null, g.fa + ' (' + fn(n) + ')'); b.setAttribute('role', 'tab');
      b.onclick = function () { setGroup(g.id); };
      g.btn = b; tabs.appendChild(b);
    });
    var m = location.hash.match(/p=([^&]+)/), hp = m && byCode[decodeURIComponent(m[1])];
    var qg = (location.search.match(/[?&]g=([a-z]+)/) || [])[1], okg = d.groups && d.groups.some(function (x) { return x.id === qg; });
    setGroup(hp && hp._c.g ? hp._c.g : (d.groups ? (okg ? qg : d.groups[0].id) : ''));
    if (hp) openP(hp, true);
  }).catch(function () { $('list').innerHTML = '<div class="empty">کاتالوگ بارگذاری نشد. دوباره امتحان کنید.</div>'; });

  function cats() { return DATA.cats.filter(function (c) { return !group || c.g === group; }); }
  function setGroup(g) {
    group = g; cat = null; typ = null;
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
    cat = c; typ = null;
    [].forEach.call($('chips').children, function (b) { b.classList.toggle('on', b === btn); });
    render(); window.scrollTo({ top: 0 });
  }
  $('q').addEventListener('input', function () { query = this.value.trim().toLowerCase(); render(); });
  $('sort').addEventListener('change', function () { sortBy = this.value; render(); });

  function render() {
    var src = [];
    (cat ? [cat] : cats()).forEach(function (c) { src = src.concat(c.items); });
    types(src);
    if (typ) src = src.filter(function (p) { return p.t === typ; });
    pool = src.filter(function (p) { return !query || (p.b + ' ' + p.c + ' ' + p.k + ' ' + (p.br || '') + ' ' + (p.x || '')).toLowerCase().indexOf(query) >= 0; });
    if (sortBy) pool = pool.slice().sort(function (a, b) { return sortBy === 'asc' ? a.f - b.f : b.f - a.f; });
    pool = pool.filter(function (p) { return !p.oos; }).concat(pool.filter(function (p) { return p.oos; }));
    $('count').textContent = fn(pool.length) + ' محصول';
    $('list').innerHTML = ''; shown = 0; grid = null;
    if (!pool.length) { $('list').innerHTML = '<div class="empty">محصولی پیدا نشد.</div>'; return; }
    if (DATA.sets && !query && !cat && !typ) setsRow();
    grid = el('div', 'grid'); $('list').appendChild(grid);
    more();
  }
  var grid, typ = null;
  var ROLE = function (p) { if (p.t === 'shoes') return 'کفش'; if (p.t === 'cloth') return /Vest/i.test(p.b) ? 'جلیقه' : /Coat/i.test(p.b) ? 'پالتو' : 'کاپشن'; if (/Wallet|Wristlet|Card Case|Billfold/i.test(p.b)) return 'کیف پول'; return 'کیف'; };
  function setsRow() {
    var ss = DATA.sets.filter(function (s) { return (!group || s.g === group) && s.k.every(function (k) { return byCode[k] && !byCode[k].oos; }); });
    if (!ss.length) return;
    var sec = el('section', 'sets'), h = el('div', 'sets-h');
    h.innerHTML = '<div><b>پیشنهاد ست</b><small>کیف و کفش هماهنگ · برای دیدن ست‌های بیشتر بکشید</small></div>';
    var nav = el('div', 'sets-nav'); nav.innerHTML = '<button type="button" aria-label="قبلی">›</button><button type="button" aria-label="بعدی">‹</button>';
    var row = el('div', 'sets-row');
    var nb = nav.querySelectorAll('button');
    nb[0].onclick = function () { row.scrollBy({ left: row.clientWidth * .8, behavior: 'smooth' }); };
    nb[1].onclick = function () { row.scrollBy({ left: -row.clientWidth * .8, behavior: 'smooth' }); };
    ss.forEach(function (s, n) {
      var ps = s.k.map(function (k) { return byCode[k]; }), tf = 0, to = 0;
      ps.forEach(function (p) { tf += p.f; to += p.o || p.f; });
      var c = el('div', 'set');
      var t = el('div', 'set-t'); t.innerHTML = '<b></b><small></small>'; t.firstChild.textContent = s.n; t.lastChild.textContent = ps.map(ROLE).join(' + ');
      c.appendChild(t);
      var ims = el('div', 'set-ims set-' + ps.length);
      ps.forEach(function (p) {
        var b = el('button', 'set-it'); b.type = 'button'; b.setAttribute('aria-label', p.b + ' ' + p.c);
        b.innerHTML = '<span class="set-ph"><img loading="lazy" decoding="async" alt=""></span><span class="set-r"></span><span class="set-n"></span><span class="set-p"></span>';
        b.querySelector('img').src = p.i[0];
        b.querySelector('.set-r').textContent = ROLE(p);
        b.querySelector('.set-n').textContent = p.b;
        b.querySelector('.set-p').textContent = fa(p.f);
        b.onclick = function () { openP(p); };
        ims.appendChild(b);
      });
      c.appendChild(ims);
      var tot = el('div', 'set-tot'); tot.innerHTML = '<span>جمع ست</span><s></s><b></b>';
      tot.querySelector('s').textContent = to > tf ? fa(to) : '';
      tot.querySelector('b').innerHTML = fa(tf) + ' <small>تومان</small>';
      c.appendChild(tot);
      var act = el('div', 'set-act');
      act.appendChild(setLink('ig', 'سفارش ست · دایرکت', igFor(ps[0]), ICON_IG, s, ps, tf));
      act.appendChild(setLink('wa', 'واتساپ', C.whatsapp, ICON_WA, s, ps, tf));
      c.appendChild(act);
      row.appendChild(c);
    });
    sec.appendChild(h); sec.appendChild(row); sec.appendChild(nav); $('list').appendChild(sec);
  }
  function setMsg(s, ps, tf) {
    var L = ['سلام، وقتتون بخیر 🌸', 'می‌خواستم این ست رو سفارش بدم:', '', 'برند: ' + (BR.name || DATA.brand), s.n, ''];
    ps.forEach(function (p, i) {
      L.push(fn(i + 1) + ') ' + ROLE(p) + ': ' + p.b + (p.c ? ' — ' + p.c : ''));
      if (p.z && p.z.length) L.push('   سایزهای موجود: ' + p.z.join('، ') + ' — سایز من: ');
      L.push('   قیمت: ' + fa(p.f) + ' تومان · کد: ' + p.k);
    });
    L.push(''); L.push('جمع ست: ' + fa(tf) + ' تومان');
    return L.join('\n');
  }
  function setLink(cls, label, href, icon, s, ps, tf) {
    var a = el('a', cls); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.innerHTML = icon + '<span></span>'; a.querySelector('span').textContent = label;
    a.onclick = function () { try { navigator.clipboard.writeText(setMsg(s, ps, tf)); toast('متن سفارش ست کپی شد؛ در پیام paste کنید'); } catch (e) {} try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'order-set/' + cls + '/' + (BR.slug || DATA.brand) + '/' + s.k.join('+'), title: 'سفارش ست · ' + s.n, event: true }); } catch (e) {} };
    return a;
  }
  function types(src) {
    var box = $('chips2'); if (!box) return; box.innerHTML = '';
    if (!DATA.types) { box.style.display = 'none'; return; }
    var cnt = {}; src.forEach(function (p) { cnt[p.t] = (cnt[p.t] || 0) + 1; });
    var all = el('button', typ ? null : 'on'); all.innerHTML = 'همه <small></small>'; all.querySelector('small').textContent = fn(src.length);
    all.onclick = function () { typ = null; render(); }; box.appendChild(all);
    DATA.types.forEach(function (t) {
      if (!cnt[t.id]) return;
      var b = el('button', typ === t.id ? 'on' : null); b.innerHTML = '<span></span> <small></small>';
      b.firstChild.textContent = t.fa; b.querySelector('small').textContent = fn(cnt[t.id]);
      b.onclick = function () { typ = t.id; render(); window.scrollTo({ top: 0 }); }; box.appendChild(b);
    });
  }
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
  function orderMsg(p) {
    var bn = BR.name || DATA.brand, L = ['سلام، وقتتون بخیر 🌸', 'می‌خواستم این محصول رو سفارش بدم:', ''];
    L.push('برند: ' + (p.br ? p.br + ' (' + bn + ')' : bn));
    L.push('محصول: ' + p.b);
    if (p.c && /[۰-۹]+ رنگ/.test(p.c)) L.push('مشخصات: ' + p.c + ' موجود — رنگ دلخواهم: ');
    else if (p.c) L.push('رنگ / مدل: ' + p.c);
    var zs = p.zp && p._s != null ? p.zp[p._s] : null;
    if (zs) L.push('سایز: ' + zs[0]);
    else if (p.z && p.z.length) L.push('سایزهای موجود: ' + p.z.join('، '));
    if (p.x) L.push('توضیح: ' + p.x);
    if (zs) L.push('قیمت: ' + fa(zs[1]) + ' تومان' + (zs[2] ? ' (قیمت قبل: ' + fa(zs[2]) + ' تومان)' : ''));
    else L.push('قیمت: ' + (p.zp ? 'از ' : '') + fa(p.f) + ' تومان' + (p.o && !p.zp ? ' (قیمت قبل: ' + fa(p.o) + ' تومان)' : ''));
    L.push('کد محصول: ' + p.k);
    return L.join('\n');
  }
  function igFor(p) { var g = p && p._c && p._c.g; if (BR.dmMen && C.instagramMen) return C.instagramMen; return (g === 'm' || (!g && qs === 'men')) && C.instagramMen ? C.instagramMen : C.instagram; }
  function orderLink(cls, label, href, icon, p) {
    var a = el('a', cls); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.innerHTML = icon + '<span></span>'; a.querySelector('span').textContent = label;
    a.onclick = function (e) { if (needSize(p, e)) return; try { navigator.clipboard.writeText(orderMsg(p)); toast('متن سفارش کپی شد؛ در پیام paste کنید'); } catch (e) {} try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'order/' + cls + '/' + (BR.slug || DATA.brand) + '/' + p.k, title: 'سفارش ' + (cls === 'wa' ? 'واتساپ' : 'دایرکت') + ' · ' + p.b, event: true }); } catch (e) {} };
    return a;
  }
  function needSize(p, e) {
    if (!p.zp || p._s != null) return false;
    e.preventDefault(); toast('اول سایز خود را انتخاب کنید تا قیمت نمایش داده شود');
    (p._ui || []).forEach(function (u) { u.flash(); }); return true;
  }
  function sizePicker(p, onPick) {
    var box = el('div', 'szp');
    (p.zp || []).forEach(function (z, i) {
      var b = el('button', p._s === i ? 'on' : null, z[0]); b.type = 'button';
      b.onclick = function (e) { e.stopPropagation(); p._s = i; (p._ui || []).forEach(function (u) { u.sync(); }); };
      box.appendChild(b);
    });
    var ui = { sync: function () { [].forEach.call(box.children, function (b, i) { b.classList.toggle('on', p._s === i); }); onPick(); },
      flash: function () { box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash'); } };
    (p._ui = p._ui || []).push(ui); return box;
  }
  function card(p) {
    var a = el('div', 'card');
    a.innerHTML = '<button type="button" class="tap"><div class="ph"><img loading="lazy" decoding="async" alt=""><span class="off"></span></div><div class="info"><div class="n"></div><div class="c"></div><s></s><b></b></div></button><div class="cact"></div>';
    a.querySelector('.tap').setAttribute('aria-label', p.b + ' ' + p.c);
    a.querySelector('img').src = p.i[0];
    if (p.d > 0) a.querySelector('.off').textContent = '-' + fn(p.d) + '٪'; else a.querySelector('.off').remove();
    a.querySelector('.n').textContent = p.b;
    if (p.br) a.querySelector('.n').insertAdjacentElement('beforebegin', el('div', 'br', p.br));
    if (p.inc) a.querySelector('.n').insertAdjacentElement('afterend', el('div', 'inc', p.inc));
    if (DATA.boldBr) a.classList.add('brb');
    if (p.x) a.querySelector('.c').insertAdjacentElement('beforebegin', el('div', 'x', p.x));
    if (p.oos) { a.classList.add('oos'); a.querySelector('.ph').appendChild(el('span', 'oosb', 'ناموجود')); }
    a.querySelector('.c').textContent = [p.c, p.z && p.z.length && !p.zp ? 'Size ' + p.z.join(' · ') : ''].filter(Boolean).join(' · ');
    a.querySelector('s').textContent = p.o ? fa(p.o) : '';
    a.querySelector('b').innerHTML = fa(p.f) + ' <small>تومان</small>';
    if (p.zp) {
      p._ui = (p._ui || []).filter(function (u) { return document.body.contains(u.el); });
      var hint = el('div', 'szh'), info = a.querySelector('.info');
      var upd = function () {
        var z = p._s != null ? p.zp[p._s] : null;
        a.querySelector('s').textContent = z && z[2] ? fa(z[2]) : '';
        a.querySelector('b').innerHTML = z ? fa(z[1]) + ' <small>تومان</small>' : '<small>از</small> ' + fa(p.f) + ' <small>تومان</small>';
        hint.textContent = z ? 'قیمت سایز ' + z[0] : 'برای دیدن قیمت، سایز خود را انتخاب کنید';
        var off = a.querySelector('.off'); if (off) off.textContent = z && z[2] ? '-' + fn(Math.round((1 - z[1] / z[2]) * 100)) + '٪' : off.textContent;
      };
      var pk = sizePicker(p, upd); pk.ui = p._ui[p._ui.length - 1]; pk.ui.el = pk;
      info.appendChild(hint); a.insertBefore(pk, a.querySelector('.cact')); upd();
    }
    a.querySelector('.tap').onclick = function () { openP(p); };
    var act = a.querySelector('.cact'); act.appendChild(el('div', 'olbl', 'ثبت سفارش'));
    if (p.oos) { act.innerHTML = ''; act.appendChild(el('div', 'olbl', 'فعلاً ناموجود')); return a; }
    act.appendChild(orderLink('ig', 'دایرکت', igFor(p), ICON_IG, p));
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
    $('pname').textContent = p.b; if ($('pbr')) $('pbr').textContent = DATA.boldBr ? (p.br || '') : '';
    $('pmeta').textContent = (DATA.boldBr ? '' : (p.br || BR.name || DATA.brand)) + (p.c ? (DATA.boldBr ? 'رنگ: ' : ' · ') + p.c : '') + (p.x ? ' — ' + p.x : '') + (p.oos ? ' — ناموجود' : '');
    $('pfin').innerHTML = fa(p.f) + ' <small style="font-size:13px">تومان</small>';
    var pf = $('pfeat');
    if (pf) {
      pf.innerHTML = '';
      if (p.inc) { pf.appendChild(el('div', 'lbl', 'داخل بسته')); pf.appendChild(el('div', 'finc', p.inc)); }
      if (p.ft && p.ft.length) {
        pf.appendChild(el('div', 'lbl', 'اطلاعات تکمیلی و امکانات'));
        var ul = el('ul', 'flist'); p.ft.forEach(function (t) { ul.appendChild(el('li', null, t)); }); pf.appendChild(ul);
      }
    }
    $('porg').textContent = p.o ? fa(p.o) : '';
    $('szwrap').style.display = p.z && p.z.length ? '' : 'none';
    var sz = $('psizes'); sz.innerHTML = ''; var sh = $('szhint'); $('szlbl').textContent = p.zp ? 'انتخاب سایز (EU)' : 'سایزهای موجود (US)';
    if (p.zp) {
      var supd = function () {
        var z = p._s != null ? p.zp[p._s] : null;
        $('pfin').innerHTML = (z ? '' : '<small style="font-size:13px">از</small> ') + fa(z ? z[1] : p.f) + ' <small style="font-size:13px">تومان</small>';
        $('porg').textContent = z && z[2] ? fa(z[2]) : '';
        if (sh) sh.textContent = z ? 'سایز انتخاب‌شده: ' + z[0] : 'قیمت هر سایز فرق دارد؛ سایز خود را انتخاب کنید';
      };
      p._ui = (p._ui || []).filter(function (u) { return u.el && document.body.contains(u.el); });
      var pk = sizePicker(p, supd); pk.ui = p._ui[p._ui.length - 1]; pk.ui.el = pk; pk.classList.add('big');
      sz.appendChild(pk); supd();
    } else {
      if (sh) sh.textContent = '';
      (p.z || []).forEach(function (s) { sz.appendChild(el('span', null, s)); });
    }
    var cl = $('pcolors'); cl.innerHTML = ''; var grp = byGroup[(p.br || '') + '|' + p.b] || [p];
    cl.style.display = cl.previousElementSibling.style.display = grp.length > 1 ? '' : 'none';
    grp.forEach(function (q) {
      var b = el('button', q === p ? 'on' : ''); b.type = 'button'; b.setAttribute('aria-pressed', q === p ? 'true' : 'false');
      var im = el('img'); im.src = q.i[0]; im.alt = ''; im.loading = 'lazy'; b.appendChild(im); b.appendChild(el('span', null, q.c));
      b.onclick = function () { openP(q, true); history.replaceState(null, '', '#p=' + encodeURIComponent(q.k)); };
      cl.appendChild(b);
    });
    $('pcode').textContent = p.k + ' · ' + (p.br ? p.br + ' ' : '') + p.b + (p.c ? ' - ' + p.c : '');
    var msg = orderMsg(p);
    var o = $('porder'); o.innerHTML = '';
    if (p.oos) o.appendChild(el('div', 'olbl', 'این محصول فعلاً ناموجود است'));
    else
    [['ig', 'سفارش در دایرکت', igFor(p), ICON_IG], ['wa', 'سفارش در واتساپ', C.whatsapp, ICON_WA]].forEach(function (x) {
      var a = el('a', x[0]); a.href = x[2]; a.target = '_blank'; a.rel = 'noopener'; a.innerHTML = x[3] + '<span></span>'; a.querySelector('span').textContent = x[1];
      a.onclick = function (e) { if (needSize(p, e)) return; msg = orderMsg(p); try { navigator.clipboard.writeText(msg); toast('متن سفارش کپی شد؛ در پیام paste کنید'); } catch (e) {} };
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
