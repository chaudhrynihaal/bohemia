/* BOHEMIA — shared behaviour: language, smooth scroll, navigation, reveals. */
(function () {
  const B = window.BOHEMIA;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---- temporary phone block (B.access in data.js): phones get a "please ask" screen */
  (() => {
    const a = B.access || {};
    if (!a.mobileBlocked) return;
    const q = new URLSearchParams(location.search).get('mobile');
    if (q && q === a.unlock) store.set('bohemia.mobile', 'open');
    if (store.get('bohemia.mobile') === 'open') return;
    // a phone: narrow window, or a touch screen whose short side is phone-sized (also in landscape)
    const phone = window.innerWidth < 800 ||
      (matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 600);
    if (!phone) return;
    window.__blocked = true;
    const pt = /^pt\b/i.test((navigator.languages && navigator.languages[0]) || navigator.language || '');
    const st = document.createElement('style');
    st.textContent = 'body>*:not(.mblock){display:none!important}body{overflow:hidden!important}';
    document.head.appendChild(st);
    const show = () => {
      const d = document.createElement('div'); d.className = 'mblock'; d.setAttribute('role', 'alert');
      d.innerHTML = '<b>BOHEMIA</b><small>' + (pt ? 'por' : 'by') + ' Bohemian Group</small><i></i>' +
        '<p>' + I18N[pt ? 'pt' : 'en']['block.msg'] + '</p><span>' + I18N[pt ? 'en' : 'pt']['block.msg'] + '</span>';
      document.body.appendChild(d); document.body.classList.remove('is-loading');
    };
    if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
  })();
  if (window.__blocked) return;

  /* ---- every visit starts at the beginning: no restored scroll position on refresh */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---- i18n */
  const listeners = [];
  const App = window.App = {
    lang: (() => {
      const q = new URLSearchParams(location.search).get('lang');
      if (q === 'pt' || q === 'en') return q;
      const saved = store.get('bohemia.lang');
      if (saved === 'pt' || saved === 'en') return saved;
      const pref = (navigator.languages && navigator.languages[0]) || navigator.language || '';
      return /^pt\b/i.test(pref) ? 'pt' : 'en';
    })(),
    store,
    t(key, vars) {
      let s = (I18N[App.lang] && I18N[App.lang][key]) ?? I18N.en[key] ?? key;
      if (vars) Object.keys(vars).forEach(k => { s = s.replace('{' + k + '}', vars[k]); });
      return s;
    },
    tx(obj) { return obj ? (obj[App.lang] ?? obj.en) : ''; },
    onLang(fn) { listeners.push(fn); },
    setLang(l) {
      App.lang = l; store.set('bohemia.lang', l);
      document.documentElement.lang = l;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.dataset.i18n;
        if (k.endsWith('_html')) el.innerHTML = App.t(k); else el.textContent = App.t(k);
      });
      document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = App.t(el.dataset.i18nAlt); });
      document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('is-active', b.dataset.lang === l));
      listeners.forEach(fn => fn(l));
      App.renderContact();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    },
    // direct contact links: any element with data-contact="whatsapp" | "email"
    context: null, // set by a residence page so WhatsApp mentions that residence
    renderContact() {
      const c = window.BOHEMIA.contact || {};
      const msg = App.context ? App.t('wa.msg.r', { name: App.context }) : App.t('wa.msg');
      document.querySelectorAll('[data-contact="whatsapp"]').forEach(a => {
        if (!c.whatsapp) { a.hidden = true; return; }
        a.href = 'https://wa.me/' + c.whatsapp + '?text=' + encodeURIComponent(msg);
        a.target = '_blank'; a.rel = 'noopener';
        const v = a.querySelector('.v'); if (v) v.textContent = c.whatsappDisplay || ('+' + c.whatsapp);
      });
      document.querySelectorAll('[data-contact="email"]').forEach(a => {
        if (!c.email) { a.hidden = true; return; }
        a.href = 'mailto:' + c.email + '?subject=' + encodeURIComponent('Bohemia' + (App.context ? ' — ' + App.context : ''));
        const v = a.querySelector('.v'); if (v) v.textContent = c.email;
      });
    },
    // Specification: numbered groups on the left, the active group's card on the right.
    // Advances every 3.5 s and loops; pauses on hover; hovering/clicking a group shows it.
    // Used on the homepage and on both residence pages (which add their Outdoor group first).
    specShow(root, getGroups, ms = 3500) {
      const list = root.querySelector('.specshow__list'), card = root.querySelector('.specshow__card');
      const two = n => String(n).padStart(2, '0'), txs = v => typeof v === 'string' ? v : App.tx(v);
      let idx = 0, timer = null, visible = false, hover = false, n = 0;
      function play() {
        clearInterval(timer); timer = null;
        // restart the progress line under the active group so it matches the clock
        const bar = list.querySelector('.is-on .bar'); if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
        if (!visible || hover || App.reduced) return;
        timer = setInterval(() => go(idx + 1), ms);
      }
      function go(i) {
        idx = (i + n) % n;
        list.querySelectorAll('button').forEach((b, k) => b.classList.toggle('is-on', k === idx));
        card.querySelectorAll('.specshow__panel').forEach((p, k) => p.classList.toggle('is-on', k === idx));
        play();
      }
      function render() {
        const groups = getGroups(); n = groups.length; if (idx >= n) idx = 0;
        list.innerHTML = groups.map((g, i) => `<li><button type="button" data-i="${i}" class="${i === idx ? 'is-on' : ''}">
            <span class="n">${two(i + 1)}</span><span class="t">${App.tx(g.title)}</span><span class="g">${txs(g.tag)}</span><i class="bar"></i></button></li>`).join('');
        card.innerHTML = groups.map((g, i) => `<div class="specshow__panel ${i === idx ? 'is-on' : ''}">
            <div class="specshow__top"><span>${two(i + 1)} / ${two(n)}</span><span>${App.tx(g.title)}</span></div>
            <p class="specshow__big">${txs(g.big)}</p><p class="specshow__label">${App.tx(g.label)}</p>
            <ul>${g.items.map(it => `<li>${App.specItem(it)}</li>`).join('')}</ul></div>`).join('');
        list.querySelectorAll('button').forEach(b => {
          b.addEventListener('click', () => go(+b.dataset.i));
          b.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) go(+b.dataset.i); });
        });
        root.style.setProperty('--spec-dur', ms / 1000 + 's');
        play();
      }
      root.addEventListener('mouseenter', () => { hover = true; root.classList.add('is-paused'); clearInterval(timer); });
      root.addEventListener('mouseleave', () => { hover = false; root.classList.remove('is-paused'); play(); });
      new IntersectionObserver(en => { visible = en[0].isIntersecting; root.classList.toggle('is-paused', !visible); play(); }, { threshold: .35 }).observe(root);
      return { render };
    },
    // Touchpad / Magic Mouse sideways swipe → one step per gesture. Vertical scrolling is left
    // alone; the browser's "swipe back" gesture is suppressed while over the slideshow.
    // Touchpads keep sending a fading "momentum" stream after the fingers lift, often until the
    // next swipe begins — so a new gesture is recognised when the signal rises again after it has
    // started to fade (or reverses direction), not only after silence.
    onSwipe(el, step) {
      let acc = 0, locked = false, dir = 0, peak = 0, low = Infinity, fading = false, prevA = 0, waitRise = false, quiet;
      const unlock = afterPause => { locked = false; acc = 0; peak = 0; low = Infinity; fading = false; waitRise = afterPause; };
      el.addEventListener('wheel', e => {
        const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
        const dx = e.deltaX * k, dy = e.deltaY * k, a = Math.abs(dx);
        if (a <= Math.abs(dy) || a < 0.5) return;            // vertical scroll: let the page have it
        e.preventDefault(); e.stopPropagation();
        clearTimeout(quiet); quiet = setTimeout(() => unlock(true), 400);
        const reversed = dir !== 0 && Math.sign(dx) !== dir && a > 3;
        if (locked) {
          if (a > peak) peak = a;
          if (a < peak * 0.7) fading = true;                   // the momentum tail has begun
          if (fading && a < low) low = a;                      // the quietest point of the tail
          const rising = fading && a > low * 1.6 + 4;          // well above the tail: a new swipe
          if (!reversed && !rising) { prevA = a; return; }
          unlock(false);
        } else if (waitRise && !reversed) {
          // after a pause a momentum tail can only keep fading; a real new swipe starts with a rise
          if (a < prevA + 1) { prevA = a; return; }
          waitRise = false;
        }
        prevA = a;
        acc += dx;
        if (Math.abs(acc) > 40) { dir = Math.sign(acc); step(dir); locked = true; acc = 0; peak = a; low = Infinity; fading = false; }
      }, { passive: false });
    },
    // Drag / finger swipe → step; a quick click without movement → tap. A drag or a long press
    // is never treated as a click, so swiping can't open anything by accident.
    swipeTap(el, o) {
      let x0 = null, y0 = 0, t0 = 0, moved = false;
      const end = (e, noTap) => {
        if (x0 === null) return;
        const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { o.step(dx < 0 ? 1 : -1); return; }
        if (noTap || moved || performance.now() - t0 > 350) return;
        if (o.ignore && e.target.closest(o.ignore)) return;
        if (o.tap) o.tap(e);
      };
      el.addEventListener('pointerdown', e => { if (e.button > 0) return; x0 = e.clientX; y0 = e.clientY; t0 = performance.now(); moved = false; });
      el.addEventListener('pointermove', e => { if (x0 !== null && Math.hypot(e.clientX - x0, e.clientY - y0) > 6) moved = true; });
      el.addEventListener('pointerup', e => end(e));
      el.addEventListener('pointerleave', e => end(e, true));
      el.addEventListener('pointercancel', () => { x0 = null; });
    },
    // the price set in data.js, or "Price on request" (short: "On request")
    priceLine(u, short) { return u.price ? App.tx(u.price) : App.t(short ? 'price.onrequest' : 'price.request'); },
    resUrl(id) { return id + '.html'; },
    // "T3 · Rés-do-chão": the typology is shown only where a language defines one (PT)
    levelLine(u) { const ty = u.typology && u.typology[App.lang]; return (ty ? ty + ' · ' : '') + App.tx(u.level); },
    // a spec line: the maker in bold, where {b} sits in the text or else in front of it
    specItem(it) {
      const s = App.tx(it), b = it.b ? '<b>' + it.b + '</b>' : '';
      return s.includes('{b}') ? s.replace('{b}', b) : (b ? b + ' ' : '') + s;
    },
    collectionLine() { return App.t('line.all.2'); },
    // every asset path goes through here, so a bundled single-file build can embed them
    asset(path) { return (window.__ASSETS && window.__ASSETS[path]) || path; },
    // phones and tablets (≤900 px) get the 1000 px versions; desktop the large ones
    img(name, small) {
      if (small === undefined) small = window.innerWidth <= 900 && !/^travertine/.test(name);
      const sm = 'assets/img/' + name + '-sm.webp';
      if (small && (!window.__ASSETS || window.__ASSETS[sm])) return App.asset(sm);
      return App.asset('assets/img/' + name + '.webp');
    },
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => App.setLang(b.dataset.lang)));

  /* ---- smooth scroll */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    // ScrollTrigger remembers the browser's original scroll-restoration mode ("auto") and puts it
    // back after every refresh — which made a reload jump to the old scroll position.
    // Pin it to "manual" through ScrollTrigger itself so every visit starts at the hero.
    ScrollTrigger.clearScrollMemory('manual');
  }
  if (window.Lenis && !App.reduced) {
    const lenis = App.lenis = new Lenis({ duration: .95, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    if (window.gsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    }
  }
  App.scrollTo = (target) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (App.lenis) App.lenis.scrollTo(el, { offset: 0, duration: 1.2 }); else el.scrollIntoView({ behavior: 'smooth' });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    App.scrollTo(el);
  });

  /* ---- navigation: transparent over dark media, solid after, hides on scroll down */
  const nav = document.getElementById('nav');
  let lastY = 0;
  const darkTop = document.querySelector('[data-nav-dark]') ? false : true;
  function onScroll() {
    const y = window.scrollY;
    const first = document.querySelector('main > section'); // opening chapter (may be several screens tall)
    const heroH = (first ? first.offsetHeight : window.innerHeight) - window.innerHeight * .15;
    nav.classList.toggle('is-solid', y > heroH);
    nav.classList.toggle('is-hidden', y > heroH && y > lastY + 2 && !document.body.classList.contains('menu-open'));
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
  }
  if (darkTop) window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu */
  const menu = document.getElementById('menu');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open'); if (App.lenis) App.lenis.start();
  }
  const mOpen = document.getElementById('menuOpen'), mClose = document.getElementById('menuClose');
  if (mOpen) mOpen.addEventListener('click', () => {
    menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open'); if (App.lenis) App.lenis.stop();
  });
  if (mClose) mClose.addEventListener('click', closeMenu);

  /* ---- reveals */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px 6% 0px', threshold: 0 });
  // decode large images just before they scroll into view, so they never freeze a scroll frame
  const decodeIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return; const im = en.target; decodeIO.unobserve(im);
    im.loading = 'eager'; if (im.decode) im.decode().catch(() => {});
  }), { rootMargin: '120% 0px' });
  App.observe = (root) => {
    (root || document).querySelectorAll('[data-reveal]:not(.is-in), [data-curtain]:not(.is-in)').forEach(el => io.observe(el));
    (root || document).querySelectorAll('main img:not([data-dec])').forEach(im => { im.dataset.dec = '1'; im.decoding = 'async'; decodeIO.observe(im); });
  };

  App.ready = (fn) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  };
  function structuredData() {
    const base = location.origin + location.pathname.replace(/[^/]*$/, '');
    const en = o => (o && o.en) || '';
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': base + '#developer', name: 'Bohemian Group',
          email: B.contact && B.contact.email, telephone: B.contact && B.contact.whatsappDisplay },
        { '@type': 'Residence', '@id': base + '#bohemia', name: 'Bohemia', url: base,
          description: I18N.en['line.all.2'],
          address: { '@type': 'PostalAddress', streetAddress: 'Avenida da Dinamarca', addressLocality: 'Estoril', addressCountry: 'PT' },
          containsPlace: B.units.map(u => ({
            '@type': 'Accommodation', name: en(u.name), url: base + u.id,
            numberOfBedrooms: u.bedrooms, floorLevel: en(u.level),
            floorSize: { '@type': 'QuantitativeValue', value: u.interior, unitCode: 'MTK' },
            amenityFeature: u.outdoor.map(o => ({ '@type': 'LocationFeatureSpecification', name: I18N.en['room.' + o.k], value: o.v + ' m²' }))
          })) }
      ]
    };
    const s = document.createElement('script'); s.type = 'application/ld+json';
    s.textContent = JSON.stringify(data); document.head.appendChild(s);
  }

  App.ready(() => {
    App.setLang(App.lang);
    structuredData();
    App.observe();
  });
})();
