/* BOHEMIA — homepage experience. */
(function () {
  if (window.__blocked) return;
  const B = window.BOHEMIA, App = window.App;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const mobile = () => window.innerWidth <= 800;

  /* =======================================================================
     Opening — engraved travertine; the louvres open onto the house by day
     ======================================================================= */
  const loader = $('#loader'), video = $('#heroVideo'), opening = $('#top');
  const heroCopy = $('#heroCopy'), heroCue = $('#heroCue');

  const slatsWrap = $('#slats');
  const N = window.innerWidth < 700 ? 6 : 10;
  for (let i = 0; i < N; i++) {
    const s = document.createElement('span'); s.className = 'slat';
    const inner = document.createElement('i'); inner.style.left = (-i * 100 / N) + 'vw';
    s.appendChild(inner); slatsWrap.appendChild(s);
  }
  const word = $('#loaderWord');
  word.innerHTML = word.textContent.split('').map(c => '<span>' + c + '</span>').join('');

  let opened = false;
  function openLouvres() {
    if (opened) return; opened = true;
    loader.classList.add('is-opening');
    const done = () => {
      loader.classList.add('is-done'); loader.style.display = 'none';
      document.body.classList.remove('is-loading');
      if (App.lenis) App.lenis.start();
    };
    setTimeout(() => opening.classList.add('is-in'), 900);
    if (hasGsap && !App.reduced) {
      gsap.to('.slat', {
        rotateY: 90, duration: 1.7, ease: 'power3.inOut', delay: .55,
        stagger: { each: .07, from: 'center' }, onComplete: done
      });
    } else {
      loader.style.transition = 'opacity 1.2s'; loader.style.opacity = 0; setTimeout(done, 1200);
    }
  }

  /* =======================================================================
     Day into night — the first scroll plays the film's dusk shot
     ======================================================================= */
  const canvas = $('#duskCanvas'), ctx = canvas.getContext('2d');
  // HERO_WORD: draw the big BOHEMIA lettering behind the house (needs the sky masks).
  // Off since 2026-10-07 — the brand lives in a larger header logo instead.
  const HERO_WORD = false;
  const FRAMES = 54, frames = new Array(FRAMES), masks = new Array(FRAMES);
  let current = -1, wanted = 0; // day first: the scroll brings the evening
  const pad3 = i => String(i).padStart(3, '0');
  // phones: the 1280 px frame set (3.2 MB instead of 5.4 MB)
  const duskDir = mobile() && (!window.__ASSETS || window.__ASSETS['assets/dusk-sm/f000.webp']) ? 'assets/dusk-sm/f' : 'assets/dusk/f';
  const frameSrc = i => App.asset(duskDir + pad3(i) + '.webp');
  const maskSrc = i => App.asset('assets/dusk-mask/f' + pad3(i) + '.webp');
  const ready = im => im && im.complete && im.naturalWidth;
  function loadFrame(i) {
    const im = new Image(); im.decoding = 'async'; im.src = frameSrc(i);
    const redraw = () => { if (i === wanted || current === -1) draw(wanted, true); };
    // decode each frame in the background as soon as it arrives, so drawing it while scrolling is cheap
    im.onload = () => { if (im.decode) im.decode().catch(() => {}); redraw(); };
    if (HERO_WORD) { const mk = new Image(); mk.decoding = 'async'; mk.src = maskSrc(i); mk.onload = redraw; masks[i] = mk; }
    frames[i] = im; return im;
  }
  // the daylight frame opens the site; the rest follow quietly behind it, nearest first
  const firstFrame = new Promise(r => { const im = loadFrame(0); im.addEventListener('load', r); im.addEventListener('error', r); });
  firstFrame.then(() => { for (let i = 1; i < FRAMES; i++) loadFrame(i); });

  // The house cut-out sits in front of the BOHEMIA lettering:
  // sky band (extended from the frame's own sky) → frame → lettering → house & trees (frame through its mask)
  const fore = document.createElement('canvas'), fctx = fore.getContext('2d');
  const SKY = window.SKY_COLS || [];
  const mix = (a, b, t) => a.map((v, k) => Math.round(v + (b[k] - v) * t));
  function sizeCanvas() {
    // never draw above the frames' own resolution (1920px) — sharper is impossible, it only costs time
    const dpr = Math.min(window.devicePixelRatio || 1, 2, 1920 / Math.max(1, canvas.clientWidth));
    canvas.width = fore.width = canvas.clientWidth * dpr;
    canvas.height = fore.height = canvas.clientHeight * dpr;
    current = -1; draw(wanted, true);
  }
  function draw(i, force) {
    wanted = i;
    let j = i;
    if (!ready(frames[j])) { // nearest loaded frame
      for (let d = 1; d < FRAMES; d++) { if (ready(frames[i - d])) { j = i - d; break; } if (ready(frames[i + d])) { j = i + d; break; } }
      if (!ready(frames[j])) return;
    }
    if (i === current && !force) return;
    current = i;
    const im = frames[j], mk = masks[j];
    const cw = canvas.width, ch = canvas.height, iw = im.naturalWidth, ih = im.naturalHeight;
    const narrow = cw < ch;                       // portrait screens
    const dpr = canvas.width / Math.max(1, canvas.clientWidth);
    const navClear = (narrow ? 74 : 86) * dpr;    // keep the top of the letters clear of the menu
    let fs, capH, off, align, tx, base;
    if (!HERO_WORD) {
      // the full picture, centred — no lettering over it
      fs = capH = off = 0; align = 'center'; tx = base = 0;
    } else if (narrow) {
      // phones: the picture already shows its full height; a small band of sky above the roof holds the word
      fs = Math.min(cw * .19, ch * .27); capH = fs * .63;
      const K = 1.5;                              // letters sit deep enough to meet the roof
      off = Math.round(Math.max(ch * .1, navClear + (1 - K) * capH));
      align = 'center'; tx = cw / 2; base = off + capH * K;
    } else {
      // desktop: the full picture, as filmed. The open sky is on the right, so the word sits there,
      // right-aligned under the menu, and the roof edge cuts into its first letter.
      fs = Math.min(cw * .098, ch * .155); capH = fs * .63; off = 0;
      const gutter = Math.min(72, Math.max(20, canvas.clientWidth * .045)) * dpr;
      align = 'right'; tx = cw - gutter; base = navClear + 10 * dpr + capH;
    }
    const s = Math.max(cw / iw, (ch - off) / ih), w = iw * s, h = ih * s;
    const x = (cw - w) * (narrow ? .4 : .5), y = narrow ? off : (ch - h) / 2;

    // 1. sky above the frame, continuing each column's colour
    const cols = SKY[j];
    if (!off) { /* full picture: no band */ }
    else if (cols) {
      const g = ctx.createLinearGradient(x, 0, x + w, 0);
      cols.forEach((c, k) => g.addColorStop((k + .5) / cols.length, `rgb(${c[0]},${c[1]},${c[2]})`));
      ctx.fillStyle = g; ctx.fillRect(0, 0, cw, off + 2);
      const v = ctx.createLinearGradient(0, 0, 0, off);
      v.addColorStop(0, 'rgba(0,0,0,.08)'); v.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = v; ctx.fillRect(0, 0, cw, off + 2);
    } else { ctx.fillStyle = '#12110E'; ctx.fillRect(0, 0, cw, off + 2); }
    // 2. the frame
    ctx.drawImage(im, x, y, w, h);
    if (!HERO_WORD || !ready(mk)) return;
    // 3. the lettering — ivory at night, ink by day
    const night = j / (FRAMES - 1);
    ctx.save();
    ctx.font = `300 ${fs}px "Cormorant Garamond", Georgia, serif`;
    const ls = fs * .06;
    if ('letterSpacing' in ctx) ctx.letterSpacing = ls + 'px';
    ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
    const col = mix([42, 38, 32], [243, 238, 230], night), a = .82 + .14 * night;
    ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`;
    // canvas letter-spacing also trails the last letter; compensate so the word sits on its true edge
    const trail = 'letterSpacing' in ctx ? ls : 0;
    ctx.fillText('BOHEMIA', align === 'right' ? tx + trail : tx + trail / 2, base);
    ctx.restore();
    // 4. the house and trees in front
    fctx.globalCompositeOperation = 'source-over';
    fctx.clearRect(0, 0, cw, ch);
    fctx.drawImage(mk, x, y, w, h);
    fctx.globalCompositeOperation = 'source-in';
    fctx.drawImage(im, x, y, w, h);
    ctx.drawImage(fore, 0, 0);
  }
  window.addEventListener('resize', sizeCanvas);
  sizeCanvas();
  if (HERO_WORD && document.fonts) document.fonts.load('300 100px "Cormorant Garamond"').then(() => draw(wanted, true));

  // The light changes slowly, so ~30 redraws a second is plenty: fast scrolling stays smooth
  // because the canvas never redraws on every screen refresh.
  let lastDraw = 0, drawTimer = null;
  function drawSoon(i) {
    wanted = i;
    const wait = 32 - (performance.now() - lastDraw);
    if (wait <= 0) { clearTimeout(drawTimer); drawTimer = null; lastDraw = performance.now(); draw(i); }
    else if (!drawTimer) drawTimer = setTimeout(() => { drawTimer = null; lastDraw = performance.now(); draw(wanted); }, wait);
  }
  const lines = $$('.dusk__line'), bar = $('#duskBar');
  const band = (p, a, b, f = .07) => clamp(Math.min((p - a) / f, (b - p) / f), 0, 1);
  function duskUpdate(p) {
    // the title leaves first, then the light falls, then the two lines
    const t = 1 - clamp(p / .08, 0, 1);
    heroCopy.style.opacity = t; heroCopy.style.transform = `translateY(${(1 - t) * -30}px)`;
    heroCue.style.opacity = t;
    drawSoon(Math.round(clamp((p - .14) / .72, 0, 1) * (FRAMES - 1))); // day → night
    const o1 = band(p, .14, .44), o2 = band(p, .64, 1.2);
    lines[0].style.opacity = o1; lines[0].style.transform = `translateY(${(1 - o1) * 24}px)`;
    lines[1].style.opacity = o2; lines[1].style.transform = `translateY(${(1 - o2) * 24}px)`;
    bar.style.transform = `scaleX(${p})`;
  }
  if (hasGsap) {
    ScrollTrigger.create({ trigger: opening, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => duskUpdate(s.progress) });
  } else {
    window.addEventListener('scroll', () => {
      const r = opening.getBoundingClientRect();
      duskUpdate(clamp(-r.top / (r.height - window.innerHeight), 0, 1));
    }, { passive: true });
  }

  /* opening sequence timing */
  let seen = false;
  try { seen = sessionStorage.getItem('bohemia.intro') === '1'; sessionStorage.setItem('bohemia.intro', '1'); } catch (e) {}
  const deep = location.hash.length > 1 && $(location.hash);
  if (deep) { // arriving at a chapter: no ceremony
    loader.style.display = 'none'; document.body.classList.remove('is-loading');
    opening.classList.add('is-in'); opened = true;
    window.addEventListener('load', () => setTimeout(() => App.scrollTo(deep), 300));
    // forget the #section once used, so a later refresh opens at the beginning
    history.replaceState(null, '', location.pathname + location.search);
  } else {
    if (App.lenis) App.lenis.stop();
    window.scrollTo(0, 0);
    window.addEventListener('load', () => { if (!opened) window.scrollTo(0, 0); });
  }
  const letters = $$('span', word);
  const t0 = seen || App.reduced ? 0 : 350, step = seen || App.reduced ? 0 : 130;
  letters.forEach((l, i) => setTimeout(() => l.classList.add('on'), t0 + i * step));
  setTimeout(() => $('#loaderTag').classList.add('on'), seen ? 0 : 1500);
  const hold = seen || App.reduced ? 900 : 3600;
  const minWait = new Promise(r => setTimeout(r, hold));
  const frameReady = Promise.race([firstFrame, new Promise(r => setTimeout(r, hold + 2200))]);
  Promise.all([minWait, frameReady]).then(openLouvres);
  $('#loaderSkip').addEventListener('click', openLouvres);

  /* =======================================================================
     Introduction + the film card — a muted loop; the full film opens on request
     ======================================================================= */
  const film = $('#film');
  const loopSrc = () => App.asset('assets/film/' + (mobile() ? 'hero-720.mp4' : 'hero-1080.mp4'));
  const LOOP_RATE = 1.6; // speed of the muted loop
  const filmSrc = () => {
    if (video.getAttribute('src')) return;
    video.preload = 'auto'; video.src = loopSrc();
  };
  video.addEventListener('loadedmetadata', () => { video.playbackRate = LOOP_RATE; });
  // start fetching a screen before it arrives; play only while it is seen
  new IntersectionObserver(en => { if (en[0].isIntersecting) filmSrc(); }, { rootMargin: '100% 0px' }).observe(film);
  new IntersectionObserver(en => {
    if (!en[0].isIntersecting) video.pause();
    else { filmSrc(); video.play().catch(() => {}); }
  }, { threshold: .2 }).observe(film);


  function renderIntroMeta() {
    const beds = B.units.map(u => u.bedrooms), lo = Math.min(...beds), hi = Math.max(...beds);
    const pools = B.units.filter(u => u.outdoor.some(o => o.k === 'pool')).length;
    const types = B.units.map(u => 'T' + u.bedrooms).sort().join(App.lang === 'pt' ? ' e ' : ' & ');
    $('#introMeta').textContent = App.t('intro.meta', { n: B.units.length, beds: lo === hi ? lo : lo + '–' + hi, pools, types });
  }

  /* =======================================================================
     The collection — the building itself is the availability table
     ======================================================================= */
  const building = $('#building'), svg = $('#buildingSvg');
  const NS = 'http://www.w3.org/2000/svg';
  let active = null;
  function setActive(id) {
    active = id;
    building.classList.toggle('has-active', !!id);
    $$('.building__layer').forEach(l => l.classList.toggle('is-on', l.dataset.id === id));
    $$('.outline', svg).forEach(l => l.classList.toggle('is-on', l.dataset.id === id));
    $$('.building__tag').forEach(l => l.classList.toggle('is-on', l.dataset.id === id));
    $$('.unit').forEach(l => l.classList.toggle('is-active', l.dataset.id === id));
  }
  // the list reads like the building: top floors first
  const byFloor = () => [...B.units].sort((a, b) => Math.max(...b.levels) - Math.max(...a.levels));
  const defaultId = () => byFloor()[0].id;
  const floorTag = u => {
    const lv = u.levels;
    if (lv.length === 1 && lv[0] === 0) return App.t('tag.ground');
    return lv.length === 1 ? App.t('tag.floor', { n: lv[0] }) : App.t('tag.floors', { a: Math.min(...lv), b: Math.max(...lv) });
  };
  function renderCollection() {
    // "Two exceptional residences.<br>One remarkable address."
    $('#collectionLine').innerHTML = App.collectionLine().replace(/\. (?=\S)/, '.<br>');
    const layers = $('#buildingLayers'), tags = $('#buildingTags');
    layers.innerHTML = ''; tags.innerHTML = ''; svg.innerHTML = '';
    B.units.forEach(u => {
      const pts = u.band.map(p => p[0] + '% ' + p[1] + '%').join(',');
      const layer = document.createElement('div');
      layer.className = 'building__layer'; layer.dataset.id = u.id;
      layer.innerHTML = '<img src="' + App.img('ext-front') + '" alt="">';
      layer.style.clipPath = 'polygon(' + pts + ')';
      layers.appendChild(layer);

      const ptsSvg = u.band.map(p => p.join(',')).join(' ');
      const hit = document.createElementNS(NS, 'polygon');
      hit.setAttribute('points', ptsSvg); hit.dataset.id = u.id;
      const out = document.createElementNS(NS, 'polygon');
      out.setAttribute('points', ptsSvg); out.setAttribute('pathLength', '1');
      out.setAttribute('class', 'outline'); out.dataset.id = u.id;
      svg.appendChild(out); svg.appendChild(hit);
      hit.addEventListener('mouseenter', () => setActive(u.id));
      hit.addEventListener('click', () => {
        if (active === u.id || !matchMedia('(hover: none)').matches) location.href = App.resUrl(u.id);
        else setActive(u.id);
      });

      // small pill at the top-right corner of the residence's floors
      const xs = u.band.map(p => p[0]), ys = u.band.map(p => p[1]);
      const tag = document.createElement('span');
      tag.className = 'building__tag'; tag.dataset.id = u.id;
      tag.style.left = (Math.max(...xs) - 1.2) + '%';
      tag.style.top = (Math.min(...ys) + 2.5) + '%';
      tag.textContent = floorTag(u);
      tags.appendChild(tag);
    });

    $('#unitList').innerHTML = byFloor().map(u => {
      const pool = u.outdoor.some(o => o.k === 'pool');
      return `<li class="unit" data-id="${u.id}">
        <a href="${App.resUrl(u.id)}">
          <span class="unit__top">
            <span class="unit__level">${App.levelLine(u)}</span>
          </span>
          <span class="unit__name">${App.tx(u.name)}</span>
          <span class="unit__facts">
            <span><b>${u.bedrooms}</b><small>${App.t('fact.bedrooms')}</small></span>
            <span><b>${u.interior} m<sup>2</sup></b><small>${App.t('fact.interior')}</small></span>
            ${pool ? `<span><b>${App.t('u.private')}</b><small>${App.t('u.poolword')}</small></span>` : ''}
            <span class="unit__go" aria-hidden="true">→</span>
          </span>
        </a></li>`;
    }).join('');
    $$('.unit').forEach(li => li.addEventListener('mouseenter', () => setActive(li.dataset.id)));
    setActive(active || defaultId());
  }
  // one residence is always shown as selected; leaving returns to the first
  $('.collection__stage').addEventListener('mouseleave', () => setActive(defaultId()));

  /* =======================================================================
     Everything included — every feature from the specification, all visible at once
     ======================================================================= */
  function renderFeatures() {
    const t = App.t, us = B.units;
    const outdoor = us.map(u => App.tx(u.name) + ' — ' + u.outdoor.map(o => t('room.' + o.k).toLowerCase() + ' ≈ ' + o.v + ' m²').join(', '));
    const parking = us.every(u => u.parking === us[0].parking) ? [t('feat.parking').replace('{n}', us[0].parking)] : [];
    const groups = [{ title: t('feat.out'), items: [t('feat.two')].concat(outdoor, parking) }]
      .concat(B.spec.map(g => ({ title: App.tx(g.title), items: g.items.map(App.specItem) })));
    $('#featGrid').innerHTML = groups.map(g => `<div class="feat__g" data-reveal><h3>${g.title}</h3><ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`).join('');
    App.observe($('#features'));
  }

  /* =======================================================================
     Residences — side by side: picture and name on top, then one row per fact
     ======================================================================= */
  function renderResidences() {
    const t = App.t, us = B.units;
    const area = (u, k) => (u.outdoor.find(o => o.k === k) || {}).v;
    const outBits = u => u.outdoor.filter(o => o.k !== 'pool').map(o => t('room.' + o.k).toLowerCase() + ' ' + o.v).join(' · ');
    const rows = [
      [t('fact.bedrooms'), u => `<b>${u.bedrooms}</b>${t('ov.suites').toLowerCase()}`],
      [t('fact.interior'), u => `<b>≈ ${u.interior} m²</b>`],
      [t('fact.exterior'), u => `<b>≈ ${u.exterior} m²</b><small>${outBits(u)} m²</small>`],
      [t('ov.pool'), u => area(u, 'pool') ? `<b>≈ ${area(u, 'pool')} m²</b>${t('ov.private').toLowerCase()}` : '—'],
      [t('ov.parking'), u => `<b>${u.parking}</b>${t('fact.spaces')}<small>+ ${t('rp.storage')}</small>`],
      [t('fact.price'), u => App.priceLine(u, true)]
    ];
    const cells = f => us.map(u => `<div class="cmp__v">${f(u)}</div>`).join('');
    $('#residences').innerHTML = `<div class="cmp" style="--n:${us.length}" data-reveal>
      <div class="cmp__k cmp__k--head"></div>
      ${us.map(u => `<div class="cmp__head">
        <a class="cmp__media curtain" data-curtain href="${App.resUrl(u.id)}"><img src="${App.img(u.cover)}" alt="${App.tx(u.name)}" loading="lazy"></a>
        <span class="cmp__num">${t('res.label')} ${u.numeral}<span class="cmp__dot"> · </span><span class="cmp__lv">${App.levelLine(u)}</span></span>
        <h3 class="cmp__name">${App.tx(u.name)}</h3>
      </div>`).join('')}
      ${rows.map(([k, f]) => `<div class="cmp__k">${k}</div>${cells(f)}`).join('')}
      <div class="cmp__k cmp__k--head"></div>
      ${us.map(u => `<div class="cmp__go"><a class="link" href="${App.resUrl(u.id)}"><span class="cmp__l">${t('res.explore')}</span><span class="cmp__s">${t('res.explore.short')}</span> <span class="arr">→</span></a></div>`).join('')}
    </div>`;
  }

  /* =======================================================================
     Materials — horizontal travel on desktop
     ======================================================================= */
  function renderMaterials() {
    $('#matRow').innerHTML = B.materials.map((m, i) => `
      <figure class="mat">
        <div class="mat__img"><img src="${App.asset('assets/mat/' + m.img + '.webp')}" alt="${App.tx(m.name)}" loading="lazy"></div>
        <figcaption class="mat__cap" style="text-transform:none;letter-spacing:0;color:inherit">
          <span class="mat__n">${String(i + 1).padStart(2, '0')}</span>
          <span><span class="mat__name">${App.tx(m.name)}</span><span class="mat__where">${App.tx(m.where)}</span></span>
        </figcaption>
      </figure>`).join('');
  }
  const matSection = $('#materials'), matTrack = $('#matTrack');
  let matST = null;
  function setupMaterials() {
    if (matST) { matST.kill(); matST = null; }
    matSection.style.height = ''; matTrack.style.transform = '';
    if (!hasGsap || mobile()) return;
    const dist = () => Math.max(0, matTrack.scrollWidth - window.innerWidth);
    matSection.style.height = (dist() + window.innerHeight) + 'px';
    matST = ScrollTrigger.create({
      trigger: matSection, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: s => { matTrack.style.transform = `translate3d(${-s.progress * dist()}px,0,0)`; }
    });
  }

  /* =======================================================================
     Interiors — slideshow on a drawing sheet; the text follows the image
     ======================================================================= */
  const IN = B.interiors.length, pad2 = n => String(n).padStart(2, '0');
  const INT_MS = 3200; // time per slide
  const stage = $('#intStage'), sheet = $('.int__sheet'), copy = $('#intCopy');
  let intIndex = 0, intTimer = null, intVisible = false;
  const makers = g => typeof g.makers === 'string' ? g.makers : App.tx(g.makers);

  function renderInteriors() {
    // each slide carries its own feature stars, placed on the item they describe
    stage.innerHTML = B.interiors.map((g, i) =>
      `<div class="int__slide ${i === intIndex ? 'is-on' : ''}">
        <img src="${App.img(g.img)}" alt="${App.tx(g.room)}" ${i ? 'loading="lazy"' : ''} draggable="false">
        ${(g.spots || []).map(p => {
          const m = typeof p.m === 'string' ? p.m : App.tx(p.m);
          const pos = (p.y < 26 ? 'below' : 'above') + (p.x > 72 ? ' right' : p.x < 22 ? ' left' : '');
          return `<button type="button" class="spot ${pos}" style="left:${p.x}%;top:${p.y}%" aria-label="${App.tx(p.t)} — ${m}">
            <span class="spot__star" aria-hidden="true">✦</span>
            <span class="spot__tip"><b>${App.tx(p.t)}</b><small>${m}</small></span></button>`;
        }).join('')}
      </div>`).join('');
    $$('.spot', stage).forEach(b => {
      b.addEventListener('click', e => { e.stopPropagation(); b.classList.toggle('is-open'); clearInterval(intTimer); });
      b.addEventListener('touchend', e => e.stopPropagation());
      b.addEventListener('blur', () => b.classList.remove('is-open'));
    });
    $('#intProg').innerHTML = B.interiors.map((g, i) => `<button type="button" aria-label="${App.tx(g.room)}" data-i="${i}"><i></i></button>`).join('');
    $$('#intProg button').forEach(b => b.addEventListener('click', () => intGo(+b.dataset.i, true)));
    $$('[data-i18n-aria]').forEach(b => b.setAttribute('aria-label', App.t(b.dataset.i18nAria)));
    intFill(true);
  }
  function intFill(instant) {
    const g = B.interiors[intIndex];
    const write = () => {
      $('#intRoom').textContent = App.tx(g.room);
      $('#intTitle').textContent = App.tx(g.title);
      $('#intSub').textContent = App.tx(g.sub);
      $('#intBody').textContent = App.tx(g.body);
      $('#intCount').textContent = pad2(intIndex + 1) + ' / ' + pad2(IN);
      $('#intBlock').innerHTML =
        `<div><dt>${App.t('int.room')}</dt><dd>${App.tx(g.room)}</dd></div>` +
        `<div class="wide"><dt>${App.t('int.makers')}</dt><dd>${makers(g)}</dd></div>` +
        `<div><dt>${App.t('int.view')}</dt><dd class="mono">${pad2(intIndex + 1)} / ${pad2(IN)}</dd></div>` +
        `<div><dt>${App.t('int.render')}</dt><dd class="mono">${App.t('int.cgi')}</dd></div>`;
      copy.classList.remove('is-out');
    };
    $$('.int__slide', stage).forEach((sl, i) => sl.classList.toggle('is-on', i === intIndex));
    $$('.spot.is-open', stage).forEach(b => b.classList.remove('is-open'));
    $$('#intProg button').forEach((b, i) => { b.classList.toggle('is-on', i === intIndex); b.classList.toggle('is-done', i < intIndex); });
    if (instant) write(); else { copy.classList.add('is-out'); setTimeout(write, 300); }
  }
  function intGo(i, manual) {
    intIndex = (i + IN) % IN; intFill(false);
    if (manual) intPlay(); // restart the clock after a manual change
  }
  function intPlay() {
    clearInterval(intTimer); intTimer = null;
    if (!intVisible || App.reduced) return;
    sheet.style.setProperty('--dur', INT_MS / 1000 + 's');
    intTimer = setInterval(() => intGo(intIndex + 1), INT_MS);
  }
  $('#intPrev').addEventListener('click', () => intGo(intIndex - 1, true));
  $('#intNext').addEventListener('click', () => intGo(intIndex + 1, true));
  sheet.addEventListener('mouseenter', () => { clearInterval(intTimer); sheet.classList.add('is-paused'); });
  sheet.addEventListener('mouseleave', () => { sheet.classList.remove('is-paused'); intPlay(); });
  new IntersectionObserver(en => { intVisible = en[0].isIntersecting; intPlay(); }, { threshold: .35 }).observe(sheet);
  App.swipeTap(stage, { step: dir => intGo(intIndex + dir, true), tap: () => lbOpen(intIndex), ignore: '.spot' });
  App.onSwipe(stage, dir => intGo(intIndex + dir, true));
  stage.addEventListener('keydown', e => {
    if (e.key === 'Enter') lbOpen(intIndex);
    if (e.key === 'ArrowRight') intGo(intIndex + 1, true);
    if (e.key === 'ArrowLeft') intGo(intIndex - 1, true);
  });

  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let lbIndex = 0;
  function lbShow(i) {
    lbIndex = (i + IN) % IN;
    const g = B.interiors[lbIndex];
    lbImg.src = App.img(g.img); lbImg.alt = App.tx(g.room); lbCap.textContent = App.tx(g.room) + ' — ' + makers(g);
  }
  function lbOpen(i) { clearInterval(intTimer); lbShow(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); if (App.lenis) App.lenis.stop(); }
  function lbClose() { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); if (App.lenis) App.lenis.start(); intGo(lbIndex, true); }
  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', () => lbShow(lbIndex - 1));
  $('#lbNext').addEventListener('click', () => lbShow(lbIndex + 1));
  lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowLeft') lbShow(lbIndex - 1); if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  });

  /* =======================================================================
     Specification — shared list + card component (App.specShow in main.js)
     ======================================================================= */
  const homeSpec = App.specShow($('#specShow'), () => B.spec);

  /* =======================================================================
     The address — drive-time rings + linked list (design 1a "Linen")
     Each place sits on a compass bearing at a distance ~ sqrt(minutes), so
     the 5/10/20/30-minute rings read as travel time. Hovering a place on
     either side traces a line from the residence and highlights its row.
     ======================================================================= */
  const ringR = min => Math.sqrt(min / 30) * 46; // % of the plot
  const CATS = ['all', 'leisure', 'coast', 'essentials', 'city'];
  let ringFilter = 'all', mapHover = false, mapCycle = 0, mapTimer = null, mapActive = null;
  const plot = $('#ringPlot');
  function renderMap() {
    let s = '';
    [5, 10, 20, 30].forEach(m => {
      const r = ringR(m);
      s += `<i class="ring" style="width:${r * 2}%;height:${r * 2}%"></i><span class="ring-l" style="top:${50 - r}%">${m} ${App.t('est.min').toUpperCase()}</span>`;
    });
    s += `<span class="rings__n">N<i></i></span><span class="rings__sea">${App.t('est.ocean')}</span><i class="rings__trace"></i>`;
    B.place.destinations.forEach(d => {
      const r = ringR(d.min), rad = d.a * Math.PI / 180, x = 50 + r * Math.cos(rad), y = 50 - r * Math.sin(rad);
      s += `<button type="button" class="pt side-${d.side} in-${x < 50 ? 'l' : 'r'}" data-id="${d.id}" data-cat="${d.cat}" style="left:${x}%;top:${y}%">
          <i></i><span>${App.tx(d.name)} · ${d.min}′</span></button>`;
    });
    s += `<span class="rings__home"><i></i><em>Bohemia</em></span>`;
    plot.innerHTML = s;
    $('#ringFilters').innerHTML = CATS.map(c => `<button type="button" data-cat="${c}" class="${c === ringFilter ? 'is-on' : ''}">${App.t('est.cat.' + c)}</button>`).join('');
    $('#mapList').innerHTML = B.place.destinations.slice().sort((p, q) => p.min - q.min).map(d =>
      `<li data-id="${d.id}" data-cat="${d.cat}"><span class="nm">${App.tx(d.name)}<small>${App.t('est.cat.' + d.cat)}</small></span><span class="mn"><b>${d.min}</b>${App.t('est.min')}</span></li>`).join('');
    $$('#ringPlot .pt, #mapList li').forEach(el => {
      el.addEventListener('mouseenter', () => { mapHover = true; mapOn(el.dataset.id); });
      el.addEventListener('mouseleave', () => { mapHover = false; });
      el.addEventListener('click', () => mapOn(el.dataset.id));
    });
    $$('#ringFilters button').forEach(b => b.addEventListener('click', () => { ringFilter = b.dataset.cat; applyFilter(); }));
    applyFilter();
  }
  function applyFilter() {
    $$('#ringFilters button').forEach(b => b.classList.toggle('is-on', b.dataset.cat === ringFilter));
    $$('#ringPlot .pt, #mapList li').forEach(el => el.classList.toggle('is-dim', ringFilter !== 'all' && el.dataset.cat !== ringFilter));
    const act = B.place.destinations.find(d => d.id === mapActive);
    if (act && ringFilter !== 'all' && act.cat !== ringFilter) mapOn(null);
  }
  function mapOn(id) {
    mapActive = id;
    $$('#ringPlot .pt, #mapList li').forEach(el => el.classList.toggle('is-on', el.dataset.id === id));
    const d = B.place.destinations.find(p => p.id === id), tr = $('#ringPlot .rings__trace');
    if (!tr) return;
    tr.style.width = d ? ringR(d.min) + '%' : '0';
    if (d) tr.style.transform = `rotate(${-d.a}deg)`;
  }
  new IntersectionObserver(en => {
    if (en[0].isIntersecting && !mapTimer) {
      const tick = () => {
        if (mapHover) return;
        const pool = B.place.destinations.filter(d => ringFilter === 'all' || d.cat === ringFilter);
        mapOn(pool[mapCycle++ % pool.length].id);
      };
      tick(); if (!App.reduced) mapTimer = setInterval(tick, 2600);
    } else if (!en[0].isIntersecting && mapTimer) { clearInterval(mapTimer); mapTimer = null; }
  }, { threshold: .3 }).observe($('#rings'));

  /* =======================================================================
     Enquiry form
     ======================================================================= */
  const form = $('#form');
  const pre = new URLSearchParams(location.search).get('r');
  function renderSelect() {
    const sel = $('#f-unit'), val = sel.value || pre || 'any';
    sel.innerHTML = B.units.map(u => `<option value="${u.id}">${App.tx(u.name)}</option>`).join('') +
      `<option value="any">${App.t('enq.any')}</option>`;
    sel.value = [...sel.options].some(o => o.value === val) ? val : 'any';
  }
  // three steps: About you → Your interest → Message. One submit button: "Continue", then "Send enquiry".
  let fstep = 1;
  const steps = $$('.salon__step', form), dots = $$('#formSteps li'), back = $('#formBack');
  const needPhone = () => form.contact.value !== 'email';
  function placeholders() {
    form.elements['name'].placeholder = App.t('enq.ph.name');
    form.email.placeholder = 'name@example.com';
    form.phone.placeholder = App.t('enq.ph.phone');
    form.message.placeholder = App.t('enq.ph.msg');
    $('#phoneOpt').hidden = needPhone();
  }
  function goStep(n, focus = true) {
    fstep = n;
    steps.forEach(s => { const on = +s.dataset.step === n; s.hidden = !on; s.classList.toggle('is-on', on); });
    dots.forEach((d, i) => { d.classList.toggle('is-on', i < n); d.classList.toggle('is-now', i === n - 1); });
    back.disabled = n === 1;
    btnLabel.textContent = App.t(n === 3 ? 'enq.send' : 'enq.continue');
    err.hidden = true;
    // keep the progress bar in view, below the fixed header (phones: the previous step may have been long)
    const navH = ($('.nav') || { offsetHeight: 80 }).offsetHeight, top = $('#formSteps').getBoundingClientRect().top;
    if ((top < navH + 8 || top > innerHeight * .6) && App.lenis) App.lenis.scrollTo($('#formSteps'), { offset: -(navH + 20) });
    if (focus) { const f = $('.salon__step.is-on input:not([type=radio]), .salon__step.is-on select, .salon__step.is-on textarea', form); if (f) f.focus({ preventScroll: true }); }
  }
  back.addEventListener('click', () => goStep(Math.max(1, fstep - 1)));
  form.addEventListener('change', e => { if (e.target.name === 'contact') placeholders(); });
  form.addEventListener('input', e => { const f = e.target.closest('.field'); if (f) f.classList.remove('is-invalid'); });
  form.addEventListener('change', e => { const f = e.target.closest('.field'); if (f) f.classList.remove('is-invalid'); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('.field', form).forEach(f => f.classList.remove('is-invalid')); err.hidden = true;
    const need = (el, test) => { if (!test) { el.closest('.field').classList.add('is-invalid'); ok = false; } };
    const stepOne = () => {
      need(form.elements['name'], form.elements['name'].value.trim().length > 1);
      need(form.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim()));
    };
    const fail = (key, n) => {
      if (n && n !== fstep) goStep(n, false);
      err.textContent = App.t(key); err.hidden = false;
      const first = $('.field.is-invalid input, .field.is-invalid select', form);
      if (first) first.focus({ preventScroll: true });
    };
    if (fstep === 1) { stepOne(); return ok ? goStep(2) : fail('enq.missing1'); }
    if (fstep === 2) {
      // telephone chosen: the number becomes required (it lives on step 1)
      if (needPhone()) need(form.phone, form.phone.value.replace(/\D/g, '').length >= 7);
      return ok ? goStep(3) : fail('enq.missingPhone', 1);
    }
    stepOne(); if (!ok) return fail('enq.missing1', 1);
    need(form.consent, form.consent.checked);
    if (!ok) return fail('enq.missing3');
    sendEnquiry();
  });

  // Web3Forms: the access key is designed to live in front-end code.
  const btn = $('#formBtn'), btnLabel = $('#formBtnLabel'), err = $('#formError');
  const choice = name => { const r = form.querySelector(`input[name="${name}"]:checked`); return r ? r.nextElementSibling.textContent : ''; };
  async function sendEnquiry() {
    const cfg = B.enquiry || {};
    err.hidden = true; err.textContent = App.t('enq.error');
    if (!cfg.web3formsKey) { // not connected yet: behave as a demo
      console.warn('[Bohemia] Web3Forms key missing in js/data.js — enquiry not sent.');
      form.classList.add('is-sent'); return;
    }
    if (form.botcheck.checked) { form.classList.add('is-sent'); return; } // a bot filled the trap
    const sel = form.residence;
    const payload = {
      access_key: cfg.web3formsKey,
      subject: cfg.subject + ' · ' + sel.options[sel.selectedIndex].text,
      from_name: 'Bohemia website',
      replyto: form.email.value.trim(),
      'Name': form.elements['name'].value.trim(),
      'Email': form.email.value.trim(),
      'Telephone': form.phone.value.trim() || '—',
      'Country': form.country.value.trim() || '—',
      'Residence of interest': sel.options[sel.selectedIndex].text,
      'Enquiring as': choice('role'),
      'Preferred contact': choice('contact'),
      'Message': form.message.value.trim() || '—',
      'Site language': App.lang.toUpperCase(),
      'Consent': 'Yes'
    };
    btn.disabled = true; btnLabel.textContent = App.t('enq.sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Web3Forms error');
      form.classList.add('is-sent');
      if (window.gtag) gtag('event', 'generate_lead', { residence: sel.value }); // analytics hook, if added later
    } catch (e2) {
      console.error('[Bohemia] Enquiry failed:', e2);
      err.hidden = false;
    } finally {
      btn.disabled = false; btnLabel.textContent = App.t(fstep === 3 ? 'enq.send' : 'enq.continue');
    }
  }

  /* =======================================================================
     Architecture parallax
     ======================================================================= */
  if (hasGsap && !App.reduced) {
    gsap.fromTo('#archImg', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.arch__full', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* =======================================================================
     Render everything, and again on language change
     ======================================================================= */
  App.onLang(() => {
    renderIntroMeta(); renderCollection(); renderResidences(); homeSpec.render(); renderFeatures();
    renderMaterials(); renderInteriors(); renderMap(); renderSelect(); placeholders(); btnLabel.textContent = App.t(fstep === 3 ? 'enq.send' : 'enq.continue');
    App.observe();
    requestAnimationFrame(setupMaterials);
  });
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { setupMaterials(); if (hasGsap) ScrollTrigger.refresh(); }, 250); });
  window.addEventListener('load', () => { setupMaterials(); if (hasGsap) ScrollTrigger.refresh(); });
})();
