/* BOHEMIA — residence page, rendered from data.js */
(function () {
  if (window.__blocked) return;
  const B = window.BOHEMIA, App = window.App;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // garden.html / penthouse.html carry data-residence; residence.html?r=… still works
  const id = new URLSearchParams(location.search).get('r') || document.body.dataset.residence;
  const u = B.units.find(x => x.id === id) || B.units[0];
  let planIndex = 0;

  /* hero */
  const heroImg = $('#rpHeroImg');
  heroImg.src = App.img(u.hero);
  const heroIn = () => $('#rpHero').classList.add('is-in');
  if (heroImg.complete) setTimeout(heroIn, 60); else heroImg.addEventListener('load', heroIn);
  setTimeout(heroIn, 1800);

  if (window.gsap && window.ScrollTrigger && !App.reduced) {
    gsap.to('#rpHeroImg', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '#rpHero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* the plan — drawn, then annotated */
  function renderPlan() {
    const plan = u.plans[planIndex];
    $('#rpPlanTitle').textContent = App.tx(plan.label);
    $('#planTabs').innerHTML = u.plans.length > 1 ? u.plans.map((p, i) =>
      `<button class="${i === planIndex ? 'is-active' : ''}" data-i="${i}">${App.tx(p.label)}</button>`).join('') : '';
    const wrap = $('#planImg');
    wrap.classList.remove('is-drawn');
    wrap.innerHTML = `<img src="${App.asset('assets/plans/' + plan.key + '.webp')}" alt="${App.tx(u.name)} — ${App.tx(plan.label)}">` +
      // room names written on the drawing, in the current language
      plan.rooms.map((r, i) => `<span class="plabel${/terrace|garden|pool|balcony/.test(r.n) ? ' is-out' : ''}" data-i="${i}" style="left:${r.x}%;top:${r.y}%">${App.t('plan.' + r.n)}</span>`).join('');
    $('#planRooms').innerHTML = plan.rooms.map((r, i) =>
      `<li data-i="${i}"><span>${App.t('room.' + r.n)}</span><span>${r.a ? r.a.toFixed(1) + ' m²' : ''}</span></li>`).join('');
    const img = $('img', wrap);
    const draw = () => requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('is-drawn')));
    const go = () => {
      const io = new IntersectionObserver((en, ob) => { if (en[0].isIntersecting) { draw(); ob.disconnect(); } }, { threshold: .25 });
      io.observe(wrap);
    };
    if (img.complete) go(); else img.addEventListener('load', go);
    // no hover effects: a click in the list marks the room on the plan and shows its picture
    $$('#planRooms li').forEach(el => el.addEventListener('click', () => focusRoom(+el.dataset.i)));
    focusRoom(-1);
  }
  /* phones and tablets: tap the plan to open it full-screen, larger, movable with a finger */
  const fs = $('#planFs'), fsScroll = $('#planFsScroll');
  const small = () => matchMedia('(max-width: 1100px), (pointer: coarse)').matches;
  function openPlan() {
    const clone = $('#planImg').cloneNode(true);
    clone.removeAttribute('id'); clone.classList.add('is-drawn');
    fsScroll.innerHTML = ''; fsScroll.appendChild(clone);
    $('#planFsTitle').textContent = $('#rpPlanTitle').textContent;
    fs.classList.add('is-open'); fs.setAttribute('aria-hidden', 'false'); fs.classList.remove('is-moved');
    document.body.classList.add('menu-open'); if (App.lenis) App.lenis.stop();
    requestAnimationFrame(() => {
      fsScroll.scrollLeft = (fsScroll.scrollWidth - fsScroll.clientWidth) / 2;
      fsScroll.scrollTop = (fsScroll.scrollHeight - fsScroll.clientHeight) / 2;
    });
  }
  function closePlan() {
    fs.classList.remove('is-open'); fs.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open'); if (App.lenis) App.lenis.start();
  }
  $('.plan__canvas').addEventListener('click', () => { if (small()) openPlan(); });
  $('#planFsClose').addEventListener('click', closePlan);
  // the "Drag to move" hint fades once the visitor moves the plan (not on our own centring scroll)
  ['pointerdown', 'touchstart', 'wheel'].forEach(t =>
    fsScroll.addEventListener(t, () => fs.classList.add('is-moved'), { passive: true }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && fs.classList.contains('is-open')) closePlan(); });

  function focusRoom(i) {
    const plan = u.plans[planIndex];
    $$('.plabel').forEach(h => h.classList.toggle('is-on', +h.dataset.i === i));
    $$('#planRooms li').forEach(h => h.classList.toggle('is-on', +h.dataset.i === i));
    const pv = $('#planPreview');
    const r = plan.rooms[i];
    const src = r && r.img ? App.img(r.img, true) : null;
    const cur = $('img.is-on', pv);
    if (cur && src && cur.getAttribute('src') === src) return;
    if (cur) { cur.classList.remove('is-on'); setTimeout(() => cur.remove(), 900); }
    if (src) {
      const im = new Image(); im.src = src; im.alt = App.t('room.' + r.n);
      pv.appendChild(im);
      const show = () => requestAnimationFrame(() => im.classList.add('is-on'));
      if (im.complete) show(); else im.onload = show;
    }
  }
  $('#planTabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    planIndex = +b.dataset.i; renderPlan();
  });

  /* gallery — focus carousel: the active picture in the centre, neighbours peeking at the sides */
  const galStage = $('#galStage'), two = n => String(n).padStart(2, '0');
  let gIndex = 0, gW = 0;
  const gImgs = () => u.gallery;
  const gCap = key => App.tx((B.captions || {})[key]) || '';
  function galLayout() {
    const sw = galStage.clientWidth, narrow = window.innerWidth <= 800;
    gW = Math.min(sw * (narrow ? .8 : .62), 1080);
    const gap = narrow ? 12 : 24, n = gImgs().length;
    galStage.style.height = Math.round(gW * 2 / 3) + 'px';
    $$('.gal__slide', galStage).forEach((sl, i) => {
      let d = ((i - gIndex) % n + n) % n; if (d > n / 2) d -= n;   // shortest way round (it loops)
      const a = Math.abs(d), sign = Math.sign(d);
      const dx = a === 0 ? 0 : a === 1 ? sign * (gW * .9 + gap) : sign * (gW * (.9 + .8 * (a - 1)) + gap * a);
      sl.style.width = gW + 'px'; sl.style.height = Math.round(gW * 2 / 3) + 'px';
      sl.style.transform = `translateX(calc(-50% + ${dx}px)) scale(${a === 0 ? 1 : .8})`;
      sl.style.opacity = a === 0 ? 1 : a === 1 ? .45 : 0;
      sl.style.zIndex = 10 - a;
      sl.classList.toggle('is-on', a === 0); sl.classList.toggle('is-side', a === 1);
      sl.setAttribute('aria-hidden', a === 0 ? 'false' : 'true');
    });
    $('#galCount').textContent = two(gIndex + 1) + ' / ' + two(n);
    $('#galCap').textContent = gCap(gImgs()[gIndex]);
    $('#galBar').style.transform = `scaleX(${(gIndex + 1) / n})`;
  }
  function galGo(i) { const n = gImgs().length; gIndex = (i + n) % n; galLayout(); }
  function renderGallery() {
    galStage.innerHTML = gImgs().map((g, i) =>
      `<figure class="gal__slide" data-i="${i}"><img src="${App.img(g)}" alt="${gCap(g)}" draggable="false" ${Math.abs(i - gIndex) > 1 ? 'loading="lazy"' : ''}></figure>`).join('');
    $('#galPrev').setAttribute('aria-label', App.t('int.prev')); $('#galNext').setAttribute('aria-label', App.t('int.next'));
    galStage.setAttribute('aria-label', App.t('rp.gallery'));
    galLayout();
  }
  $('#galPrev').addEventListener('click', () => galGo(gIndex - 1));
  $('#galNext').addEventListener('click', () => galGo(gIndex + 1));
  galStage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') galGo(gIndex - 1); if (e.key === 'ArrowRight') galGo(gIndex + 1);
    if (e.key === 'Enter') lbOpen(gIndex);
  });
  // swipe / drag moves; a quick tap on a side picture brings it to the centre, on the centre opens it full screen
  App.swipeTap(galStage, {
    step: dir => galGo(gIndex + dir),
    tap: e => { const sl = e.target.closest('.gal__slide'); if (!sl) return; const i = +sl.dataset.i; if (i === gIndex) lbOpen(i); else galGo(i); }
  });
  App.onSwipe(galStage, dir => galGo(gIndex + dir));
  window.addEventListener('resize', galLayout);

  /* full-screen viewer */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let lbIndex = 0;
  function lbShow(i) { const n = gImgs().length; lbIndex = (i + n) % n; const g = gImgs()[lbIndex]; lbImg.src = App.img(g); lbImg.alt = gCap(g); lbCap.textContent = gCap(g); }
  function lbOpen(i) { lbShow(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); if (App.lenis) App.lenis.stop(); }
  function lbClose() { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); if (App.lenis) App.lenis.start(); galGo(lbIndex); }
  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', () => lbShow(lbIndex - 1));
  $('#lbNext').addEventListener('click', () => lbShow(lbIndex + 1));
  lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowLeft') lbShow(lbIndex - 1); if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  });

  // Specification: the residence's own outdoor spaces first, then the shared specification
  const both = key => ({ en: I18N.en[key], pt: I18N.pt[key] });
  const outdoorGroup = () => ({
    title: both('rp.spec.outdoor'),
    tag: u.exterior + ' m²', big: '≈ ' + u.exterior + ' m²', label: both(u.outdoorLabel || 'fact.exterior'),
    items: u.outdoor.map(o => ({ en: I18N.en['room.' + o.k] + ' ≈ ' + o.v + ' m²', pt: I18N.pt['room.' + o.k] + ' ≈ ' + o.v + ' m²' }))
      .concat([{ en: I18N.en['ov.parking'] + ': ' + I18N.en['ov.spaces'].replace('{n}', u.parking) + ' · ' + I18N.en['rp.storage'],
                 pt: I18N.pt['ov.parking'] + ': ' + I18N.pt['ov.spaces'].replace('{n}', u.parking) + ' · ' + I18N.pt['rp.storage'] }])
  });
  const resSpec = App.specShow($('#specShowRes'), () => [outdoorGroup()].concat(B.spec));

  function render() {
    App.context = App.tx(u.name);
    document.title = App.tx(u.name) + ' — Bohemia, Estoril';
    $('#rpName').textContent = App.tx(u.name);
    heroImg.alt = App.tx(u.name);
    $('#rpLevel').textContent = App.t('res.label') + ' ' + u.numeral + ' · ' + App.levelLine(u);
    $('#rpEyebrow').textContent = App.tx(u.name);
    $('#rpHighlight').innerHTML = App.tx(u.highlight).replace(/\. (?=\S)/, '.<br>');
    $('#rpTagline').textContent = App.tx(u.tagline);
    $('#rpIntro').textContent = App.tx(u.intro);
    // inside vs outside, drawn to scale: equal heights, widths proportional to area
    const pool = u.outdoor.some(o => o.k === 'pool');
    $('#rpScale').innerHTML =
      `<div class="scale__b scale__in" style="--a:${u.interior}"><b>${u.interior} m<sup>2</sup></b><small>${App.t('ov.inside')}</small></div>` +
      `<div class="scale__b scale__out" style="--a:${u.exterior}"><b>${u.exterior} m<sup>2</sup></b><small>${App.t(u.outdoorLabel || 'fact.exterior')}</small></div>`;
    $('#rpScaleNote').textContent = u.exterior > u.interior
      ? App.t('ov.note.more', { d: u.exterior - u.interior })
      : App.t('ov.note.less', { p: Math.round(u.exterior / u.interior * 100) });
    $('#rpList').innerHTML = [
      [App.t('ov.suites'), u.bedrooms],
      pool ? [App.t('ov.pool'), App.t('ov.private')] : null,
      [App.t('ov.parking'), App.t('ov.spaces', { n: u.parking })],
      [App.t('fact.price'), App.priceLine(u, true)]
    ].filter(Boolean).map(r => `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('');
    resSpec.render();

    renderGallery();

    const others = B.units.filter(x => x.id !== u.id);
    // one other residence: a full-width card, picture left and text right
    $('#also').classList.toggle('also--one', others.length === 1);
    $('#also').innerHTML = others.map(o => `
      <a href="${App.resUrl(o.id)}" data-reveal>
        <div class="curtain" data-curtain><img src="${App.img(o.cover)}" alt="" loading="lazy"></div>
        <div>
          <h3>${App.tx(o.name)}</h3>
          <p>${o.bedrooms} ${App.t('u.bedrooms')} · ${o.interior} m² ${App.t('u.interior')}</p>
          ${others.length === 1 ? `<span class="link also__go">${App.t('res.explore')} <span class="arr">→</span></span>` : ''}
        </div>
      </a>`).join('');
    $('#also').parentElement.style.display = others.length ? '' : 'none';

    $('#rpCtaTitle').textContent = App.tx(u.name);
    $('#rpCta').href = 'index.html?r=' + u.id + '#enquiry';
    $('#navEnquiry').href = 'index.html?r=' + u.id + '#enquiry';
    const pdf = $('#planPdf');
    if (u.planPdf) {
      pdf.hidden = false; pdf.href = App.asset(u.planPdf.file);
      $('#planPdfMeta').textContent = App.t('rp.pdf.dl') + ' · ' + u.planPdf.size;
    } else pdf.hidden = true;
    renderPlan();
    App.observe();
  }
  App.onLang(render);
})();
