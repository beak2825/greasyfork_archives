// ==UserScript==
// @name         [코네] 추천 컷 & 추천순 정렬
// @namespace    http://tampermonkey.net/
// @version      2.20
// @description  kone.gg에 추천 컷 & 추천순/추천율 정렬 기능을 추가합니다.
// @author       ducktail
// @match        https://kone.gg/*
// @match        https://kone.gg/s/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/553209/%5B%EC%BD%94%EB%84%A4%5D%20%EC%B6%94%EC%B2%9C%20%EC%BB%B7%20%20%EC%B6%94%EC%B2%9C%EC%88%9C%20%EC%A0%95%EB%A0%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553209/%5B%EC%BD%94%EB%84%A4%5D%20%EC%B6%94%EC%B2%9C%20%EC%BB%B7%20%20%EC%B6%94%EC%B2%9C%EC%88%9C%20%EC%A0%95%EB%A0%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- selectors / constants ----------
  const SELECTORS = {
    POST: 'div.relative.group\\/post-wrapper, div.relative.group\\/post, div.group\\/post-wrapper',
    RECO: 'div[class*="text-red-"][class*="font-bold"], span[class*="text-red-"][class*="font-bold"]',
    VIEWS_HOT: 'div.col-span-2.text-xs.text-center[class*="text-zinc-"]',
    LIST_CONTAINER_CANDIDATE:
      'main, div[class*="container"], div[class*="mx-auto"], div[class*="px-"], div[class*="py-"]',
    PAGINATION: 'nav[aria-label*="Pagination"], div.flex.justify-center.mt-4, div.mt-6:has(a[href*="p="])',
    AVATAR: 'img.rounded-full',
    WRITE_BUTTON_TEXT: 'a,button',
  };

  const DATE_PATTERNS = [/^\d{2}:\d{2}$/, /^\d{2}\.\d{2}$/, /^\d{4}\.\d{2}\.\d{2}$/];
  const PRESETS = [30, 50, 100, 150, 300];
  const PERIODS = {
    today: '오늘', '3days': '3 일', '7days': '7 일', '1month': '1 개월',
    '3months': '3 개월', '6months': '6 개월', all: '전체',
  };
  const SORT_MODES = { reco: '추천 수', ratio: '추천율' };

  // ---------- persistent state ----------
  let threshold = GM_getValue('recoThreshold', 30);
  let selectedPeriod = GM_getValue('sortPeriod', '7days');
  let sortMode = GM_getValue('sortMode', 'reco');
  let isFilterEnabled = JSON.parse(sessionStorage.getItem('isFilterEnabled') ?? 'false');
  let topN = parseInt(GM_getValue('topN', 300), 10) || 300;

  // ---------- small utils ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const span = (s) => h('span', { html: s });
  const once = (fn) => { let done=false; return (...a)=>{ if(done) return; done=true; return fn(...a); }; };
  function debounce(fn, wait = 120){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }
  function text(el){ return (el?.textContent || '').replace(/\s+/g, ' ').trim(); }
  function isHotModeByURL(){ return new URL(location.href).searchParams.get('mode') === 'hot'; }
  function isHotModeByDOM(){
    const active = $$( 'a,button,span' ).filter(el => {
      const cls = (el.className || '') + ' ' + (el.getAttribute('data-state') || '');
      const activeish = /active|selected|current|aria-current/i.test(cls) || el.getAttribute('aria-current') === 'page';
      const t = text(el);
      return activeish && /개념글|HOT|Hot|hot/i.test(t);
    });
    return active.length > 0;
  }
  function isHotContext(){ return isHotModeByURL() || isHotModeByDOM(); }
  const parseNum = (s) => parseInt(String(s||'').replace(/[^\d]/g,''),10)||0;

  function h(tag, { className = '', attrs = {}, html = '', children = [] } = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (html) el.innerHTML = html;
    for (const c of children) el.appendChild(c);
    return el;
  }
  function svg(paths) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.8');
    s.setAttribute('aria-hidden', 'true'); s.innerHTML = paths; return s;
  }
  const Icons = {
    thumb: () => svg(`<path stroke-linecap="round" stroke-linejoin="round" d="M14 9V5a3 3 0 00-3-3l-1 5-4 6v7h7a3 3 0 003-3v-7h-2zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>`),
    play:  () => svg(`<path stroke-linecap="round" stroke-linejoin="round" d="M6 4l16 8-16 8V4z"/>`),
    stop:  () => svg(`<rect x="6" y="6" width="12" height="12" rx="2"/>`),
    info:  () => svg(`<circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 8h.01M11 12h2v4h-2z"/>`),
  };

  // ---------- style (unified palette + layout/UX fixes) ----------
  injectCSS(`
    :root{
      --kp-base:#27272A;
      --kp-surface:#1C1D20; --kp-surface-2:#202226; --kp-border:#2A2B2F;
      --kp-fg:#F1F1F3; --kp-dim:#B7B9C0;
      --kp-chip-bg:var(--kp-base); --kp-chip-hover:#303136;
      --kp-field-bg:#202124; --kp-field-border:#2E3036; --kp-field-hover:#26282D;
      /* darker premium purple */
      --kp-accent:#3a2ea8; --kp-accent-strong:#2f2592;
      --kp-okay:#2B7B6B; --kp-okay-strong:#236456; --kp-red:#8A1B1B;
      --kp-track:#2A2B31; --kp-focus:0 0 0 2px rgba(58,46,168,.38);
      --kp-h:34px;
    }
    @media (prefers-color-scheme: light){
      :root{
        --kp-surface:#FAFAFB; --kp-surface-2:#F4F5F7; --kp-border:#E6E7EB;
        --kp-fg:#111827; --kp-dim:#6B7280;
        --kp-chip-bg:var(--kp-base); --kp-chip-hover:#34343A;
        --kp-field-bg:#FFFFFF; --kp-field-border:#E5E7EB; --kp-field-hover:#F3F4F6;
        --kp-accent:#3a2ea8; --kp-accent-strong:#2f2592;
        --kp-track:#E7E7EE; --kp-focus:0 0 0 2px rgba(58,46,168,.28);
      }
    }

    .kp-hidden{ display:none !important; }

    /* Panel: slimmer width to avoid empty space on the right */
    .kp-panel{
      position:fixed; z-index:9999;
      width:auto; max-width:min(380px, calc(100vw - 24px)); min-width:320px;
      display:none; flex-direction:column; gap:12px; padding:14px;
      background:var(--kp-surface); color:var(--kp-fg); border:1px solid var(--kp-border);
      border-radius:.75rem; box-shadow:0 10px 40px rgba(0,0,0,.40);
    }
    .kp-panel[data-open="true"]{ display:flex; }

    .kp-section{ display:flex; flex-direction:column; gap:8px; }
    .kp-row{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
    .kp-row.center{ justify-content:center; }

    .kp-label{ font-size:.84rem; color:var(--kp-dim); }
    .kp-status{ font-size:1.08rem; font-weight:650; margin-top:10px; text-align:center; }

    .kp-chip{
      visibility:hidden; display:inline-flex; align-items:center; gap:.35rem;
      padding:.375rem .6rem; border-radius:9999px; height:var(--kp-h);
      background:var(--kp-chip-bg); color:#fff; border:none;
      box-shadow:0 1px 0 rgba(0,0,0,.15); cursor:pointer;
      transition: background-color .15s ease, transform .06s ease;
    }
    .kp-chip.kp-visible{ visibility:visible; }
    .kp-chip:hover{ background:var(--kp-chip-hover); }
    .kp-chip svg{ width:18px; height:18px; }

    .kp-badge{ font-size:.75rem; line-height:1; padding:.25rem .5rem; border-radius:.5rem; background:#232428; color:#B7B9C0; border:1px solid #363841; }
    .kp-badge[data-on="true"]{ background:var(--kp-okay); color:#fff; border-color:transparent; }

    .kp-select, .kp-input, .kp-btn{
      height:var(--kp-h);
      border-radius:.5rem; border:1px solid var(--kp-field-border);
      background:var(--kp-field-bg); color:var(--kp-fg); padding:0 .75rem; font-size:.92rem;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      transition: background .15s, border-color .15s, box-shadow .15s, transform .06s, filter .15s;
    }
    .kp-select:hover, .kp-input:hover{
      background:var(--kp-field-hover); border-color:var(--kp-accent); box-shadow:var(--kp-focus);
    }
    .kp-select:focus, .kp-select:focus-visible,
    .kp-input:focus, .kp-input:focus-visible,
    .kp-select[data-open="true"], .kp-input:focus-within{
      background:var(--kp-field-hover); border-color:var(--kp-accent); box-shadow:var(--kp-focus); outline:0;
    }
    .kp-input[type="number"]{ width:100px; }

    .kp-btn{
      display:inline-flex; align-items:center; justify-content:center; gap:.5rem; cursor:pointer;
      line-height:1; padding:0 .9rem;
    }
    .kp-btn svg{ width:16px; height:16px; }
    .kp-btn.primary{ background:var(--kp-accent); color:#fff; border-color:transparent; }
    .kp-btn.primary:hover{ filter:brightness(1.08); }
    .kp-btn.danger{ background:var(--kp-red); color:#fff; border-color:transparent; }
    .kp-btn:active{ transform: translateY(1px); }

    .kp-toggle{ position:relative; width:46px; height:26px; border-radius:9999px; background:#3C3D42; border:1px solid var(--kp-border); cursor:pointer; }
    .kp-toggle[data-on="true"]{ background:var(--kp-okay); }
    .kp-toggle:before{ content:""; position:absolute; top:2px; left:2px; width:20px; height:20px; border-radius:9999px; background:#fff; transform:translateX(0); transition: transform .15s; }
    .kp-toggle[data-on="true"]:before{ transform:translateX(20px); }

    .kp-note{ display:flex; flex-direction:column; align-items:center; gap:.6rem; font-size:.98rem; color:var(--kp-dim); background:var(--kp-surface-2); padding:.8rem; border-radius:.5rem; border:1px solid var(--kp-border); text-align:center; border-left:2px solid var(--kp-accent); }

    .kp-progress{ height:8px; border-radius:9999px; background:var(--kp-track); overflow:hidden; }
    .kp-progress > i{ display:block; height:100%; width:0%; background:var(--kp-accent); }
    .kp-progress.indeterminate > i{ animation: kp-indet 2.1s ease-in-out infinite; }
    @keyframes kp-indet{ 0%{width:0%} 80%{width:100%} 81%{width:0%} 100%{width:0%} }

    .kp-launcher{ position:fixed; right:16px; bottom:16px; z-index:9998; }
  `);
  function injectCSS(css){ const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); }

  // ---------- date / reco / views parsing ----------
  function parseDateText(t){
    const now = new Date(); t=(t||'').trim();
    if (/^\d{2}:\d{2}$/.test(t)){ const [h,m]=t.split(':').map(Number); return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m); }
    if (/^\d{2}\.\d{2}$/.test(t)){ const [mm,dd]=t.split('.').map(Number); const d=new Date(now.getFullYear(), mm-1, dd); if (d>now) d.setFullYear(d.getFullYear()-1); return d; }
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(t)){ const [y,mm,dd]=t.split('.').map(Number); return new Date(y, mm-1, dd); }
    return new Date(0);
  }
  function findDateElem(post){
    const nodes = post.querySelectorAll('time, div, span');
    for (const el of nodes){ const tx=text(el); if (DATE_PATTERNS.some((re)=>re.test(tx))) return el; }
    return null;
  }
  function extractReco(post){
    if (post?.dataset?.kpReco) return parseInt(post.dataset.kpReco,10)||0;
    const red = post.querySelector(SELECTORS.RECO);
    if (red){ const m=text(red).match(/[\d,]+/); if (m){ const v=parseNum(m[0]); post.dataset.kpReco=String(v); return v; } }
    const d = findDateElem(post); const rowText = text(post);
    if (d){
      const dt = text(d); const idx = rowText.indexOf(dt);
      const tail = idx>=0 ? rowText.slice(idx+dt.length) : rowText;
      const nums = (tail.match(/[\d,]+/g)||[]).map(parseNum);
      if (nums.length){ const v=nums[nums.length-1]; post.dataset.kpReco=String(v); return v; }
    }
    const nums = (rowText.match(/[\d,]+/g)||[]).map(parseNum);
    const v = nums.length ? nums[nums.length-1] : 0; post.dataset.kpReco=String(v); return v;
  }
  function extractViews(post){
    if (post?.dataset?.kpViews) return parseInt(post.dataset.kpViews,10)||0;
    const hotCells = $$(SELECTORS.VIEWS_HOT, post);
    if (hotCells.length){
      const nums = hotCells.map(el => parseNum(text(el))).filter(n => Number.isFinite(n) && n >= 0);
      if (nums.length){ const v = Math.max(...nums); if (v > 0){ post.dataset.kpViews=String(v); return v; } }
    }
    const nodes = post.querySelectorAll('span,div,em,i');
    for (const el of nodes){
      const tx = text(el);
      const m = tx.match(/조회\s*[: ]\s*([\d,]+)/i) || tx.match(/views?\s*[: ]\s*([\d,]+)/i);
      if (m){ const v=parseNum(m[1]); post.dataset.kpViews=String(v); return v; }
    }
    const dEl = findDateElem(post);
    const row = text(post);
    if (dEl){
      const dt = text(dEl);
      const idx = row.indexOf(dt);
      const tail = idx>=0 ? row.slice(idx+dt.length) : row;
      const nums2 = (tail.match(/[\d,]+/g)||[]).map(parseNum);
      if (nums2.length >= 2){
        const beforeLast = nums2.slice(0, -1);
        const v2 = Math.max(...beforeLast);
        if (isFinite(v2)){ post.dataset.kpViews=String(v2); return v2; }
      }
    }
    const all = (row.match(/[\d,]+/g)||[]).map(parseNum);
    const v = all.length >= 2 ? all[all.length-2] : 0; post.dataset.kpViews=String(v); return v;
  }

  // ---------- list container ----------
  let _cachedContainer = null;
  function findListContainer(){
    if (_cachedContainer && document.contains(_cachedContainer)) return _cachedContainer;
    const posts = $$(SELECTORS.POST);
    if (!posts.length) return null;
    let cand = posts[0].parentElement;
    for (let depth=0; cand && depth<6; depth++){
      const cnt = $$(SELECTORS.POST, cand).length;
      if (cnt >= posts.length*0.8){ _cachedContainer=cand; return cand; }
      cand = cand.parentElement;
    }
    for (const c of $$(SELECTORS.LIST_CONTAINER_CANDIDATE)){
      const cnt = $$(SELECTORS.POST, c).length;
      if (cnt >= posts.length*0.8){ _cachedContainer=c; return c; }
    }
    _cachedContainer = posts[0].parentElement || document.body;
    return _cachedContainer;
  }

  // ---------- filter ----------
  function applyFilter(){
    const posts = $$(SELECTORS.POST);
    if (!isFilterEnabled){
      for (const p of posts) p.classList.remove('kp-hidden');
      return;
    }
    for (const post of posts){
      const reco = extractReco(post);
      if (reco < threshold) post.classList.add('kp-hidden'); else post.classList.remove('kp-hidden');
    }
  }

  // ---------- period ----------
  function getCutoff(period){
    const now = new Date(); const d = new Date(now);
    switch(period){
      case 'today':   return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case '3days':   d.setDate(d.getDate()-3); return d;
      case '7days':   d.setDate(d.getDate()-7); return d;
      case '1month':  d.setMonth(d.getMonth()-1); return d;
      case '3months': d.setMonth(d.getMonth()-3); return d;
      case '6months': d.setMonth(d.getMonth()-6); return d;
      default:        return null;
    }
  }

  // ---------- fetch/sort performance (caches die on refresh) ----------
  let currentAbort = null;
  let containerObserver = null;
  let dockObserver = null;
  let lastURL = location.href;
  let urlPollTimer = null;

  const PAGE_CACHE = new Map();
  const SORT_CACHE = new Map();

  function ctxKey(period){
    const u = new URL(location.href);
    const cat = u.searchParams.get('category') || '';
    const hot = isHotContext() ? 'hot' : 'all';
    return `${u.pathname}|${cat}|${hot}|${period}`;
  }

  function nodeFromHTML(html){
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  async function collectPosts(period, signal, onProgress){
    const key = ctxKey(period);
    if (SORT_CACHE.has(key)) return SORT_CACHE.get(key);

    const cutoff = getCutoff(period);
    const cutoffMs = cutoff ? cutoff.getTime() : 0;
    const baseUrl = new URL(location.href);
    const parser = new DOMParser();

    let page = 1;
    const BATCH = 4;
    const MAX_PAGES = 3000;
    const records = [];
    let stop = false;
    let fetchedTotal = 0;

    async function fetchPage(p){
      const u = new URL(baseUrl);
      u.searchParams.set('p', String(p));
      const urlStr = u.toString();

      let html;
      if (PAGE_CACHE.has(urlStr)) html = PAGE_CACHE.get(urlStr);
      else {
        const res = await fetch(urlStr, { signal });
        if (!res.ok) return { page: p, items: [], none: true, olderHit: false };
        html = await res.text();
        PAGE_CACHE.set(urlStr, html);
      }

      const doc = parser.parseFromString(html, 'text/html');
      const pagePosts = $$(SELECTORS.POST, doc);
      if (!pagePosts.length) return { page: p, items: [], none: true, olderHit: false };

      const items = [];
      let olderHit = false;

      for (const pp of pagePosts){
        const dEl = findDateElem(pp);
        if (!dEl) continue;
        const pDate = parseDateText(text(dEl));
        const pMs = +pDate;
        if (cutoff && pMs < cutoffMs){ olderHit = true; break; }
        const reco = extractReco(pp);
        const views = extractViews(pp);
        const ratio = views > 0 ? (reco / views) : 0;
        items.push({ html: pp.outerHTML, reco, views, ratio, pDateMs: pMs });
      }
      return { page: p, items, none: false, olderHit };
    }

    while (!stop && page <= MAX_PAGES){
      const tasks = [];
      for (let i=0;i<BATCH && page <= MAX_PAGES;i++, page++) tasks.push(fetchPage(page));
      const batch = await Promise.all(tasks);
      batch.sort((a,b)=>a.page-b.page);

      for (const r of batch){
        if (r.none){ stop = true; break; }
        records.push(...r.items);
        fetchedTotal += r.items.length;
        onProgress?.({ page: r.page, total: fetchedTotal });
        if (r.olderHit){ stop = true; break; }
      }
      await sleep(16);
    }

    SORT_CACHE.set(key, records);
    return records;
  }

  // ---------- (NEW) open posts in background tab after sorting ----------
  // Minimal English comments as requested:

  // Flag toggled only after sort; disabled on navigation.
  let bgOpenEnabled = false;

  // Enable/disable background-open behavior.
  function setBackgroundOpenEnabled(on){
    bgOpenEnabled = !!on;
  }

  // Find the primary post link within a post element.
  function findPostLink(post, clickedAnchor){
    // Prefer an anchor to a single post page (/s/)
    const prefer = clickedAnchor?.closest('a[href*="/s/"]');
    if (prefer) return prefer;

    const bySelector =
      post.querySelector('a[href*="/s/"], a[href^="/s/"], a[href^="https://kone.gg/s/"]');
    if (bySelector) return bySelector;

    // Fallback: first anchor inside the post
    return clickedAnchor || post.querySelector('a[href]');
  }

  // Global click capture: when enabled, left-click on a post opens in a background tab.
  function setupBackgroundOpenListener(){
    document.addEventListener('click', function(e){
      if (!bgOpenEnabled) return;
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;           // left click only
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // respect user modifiers

      // Ignore clicks inside our own UI
      if (e.target.closest('#kp-panel, .kp-launcher')) return;

      const post = e.target.closest(SELECTORS.POST);
      if (!post) return;

      const a = findPostLink(post, e.target.closest('a[href]'));
      if (!a || !a.href) return;

      // Prevent site SPA navigation
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Normalize URL (handle relative)
      let url = a.getAttribute('href') || a.href;
      if (url.startsWith('/')) url = location.origin + url;

      post.style.transition = 'opacity 0.15s ease';
      post.style.opacity = '0.5'; 

      // Open in background tab (do not activate)
      try {
        GM_openInTab(url, { active: false, insert: true, setParent: true });
      } catch (err) {
        // Fallback: still try to open, some engines may focus; best effort.
        window.open(url, '_blank', 'noopener');
      }
    }, true); // capture
  }

  setupBackgroundOpenListener();

  async function loadAndSort(period, topLimit, mode){
    const container = findListContainer();
    if (!container){ toast('게시물 목록 컨테이너를 찾을 수 없습니다.'); return; }

    const status = h('div', { className:'kp-section' });
    const progress = h('div', { className:'kp-progress indeterminate' });
    const bar = h('i'); progress.appendChild(bar);
    status.append(
      h('div', { className:'kp-status', html:`게시물 로딩 및 정렬 중… <span class="kp-label" style="display:block;margin-top:4px;">기준: ${SORT_MODES[mode]||'추천 수'}</span>` }),
      progress
    );

    $$(SELECTORS.PAGINATION).forEach((el)=>el.remove());

    const holder = h('div', { className:'kp-section', children:[status] });
    const original = document.createDocumentFragment();
    while (container.firstChild) original.appendChild(container.firstChild);
    container.appendChild(holder);

    if (currentAbort) currentAbort.abort();
    currentAbort = new AbortController();

    try{
      let lastPageShown = 0;
      const results = await collectPosts(period, currentAbort.signal, ({page,total})=>{
        lastPageShown = Math.max(lastPageShown, page);
        status.querySelector('.kp-status').innerHTML =
          `페이지 ${lastPageShown} 로딩 중… <span class="kp-label" style="color:var(--kp-dim)">(누적 ${total}개)</span>`;
      });

      progress.classList.remove('indeterminate');

      const sorted = (mode === 'ratio')
        ? results.slice().sort((a,b)=> (b.ratio - a.ratio) || (b.reco - a.reco) || (b.views - a.views))
        : results.slice().sort((a,b)=> (b.reco - a.reco) || (b.views - a.views));

      const frag = document.createDocumentFragment();
      const limit = topLimit || 300;
      const n = Math.min(limit, sorted.length);
      for (let i=0;i<n;i++){
        if (i % 25 === 0) bar.style.width = `${Math.round((i / n) * 100)}%`;
        frag.appendChild(nodeFromHTML(sorted[i].html));
      }
      bar.style.width = '100%';

      container.replaceChildren(frag);

      // (NEW) Enable background-open only after a sort has been applied.
      setBackgroundOpenEnabled(true);
    } catch (err){
      if (err?.name === 'AbortError') toast('정렬이 취소되었습니다.');
      else { console.error(err); toast('게시물 로딩 중 오류가 발생했습니다.'); }
      container.replaceChildren(original);
    } finally {
      currentAbort = null;
      applyFilter();
    }
  }

  // ---------- UI ----------
  function createToolbarAndPanel(){
    const badge = h('span', { className:'kp-badge', html: isFilterEnabled ? `≥${threshold}` : 'OFF', attrs:{ 'data-on': String(isFilterEnabled) } });
    const launcher = h('button', { className:'kp-chip', attrs:{ id:'kp-launcher', type:'button', title:'' }, children:[ Icons.thumb(), badge ] });

    const panel = h('section', { className:'kp-panel', attrs:{ id:'kp-panel', role:'dialog', 'aria-modal':'true', 'aria-label':'추천 도구' } });

    // Filter section
    const filterSec = h('div', { className:'kp-section' });
    filterSec.appendChild(h('div', { className:'kp-label', html:'추천 컷' }));

    const presetSelect = h('select', { className:'kp-select', attrs:{ 'aria-label':'추천 컷 프리셋' } });
    for (const p of PRESETS){
      const opt = h('option', { html:String(p), attrs:{ value:String(p) } });
      if (p===threshold) opt.selected = true;
      presetSelect.appendChild(opt);
    }
    const optCustom = h('option', { html:'커스텀', attrs:{ value:'custom' } });
    if (!PRESETS.includes(threshold)) optCustom.selected = true;
    presetSelect.appendChild(optCustom);

    const customInput = h('input', { className:'kp-input', attrs:{ type:'number', min:'0', step:'1', placeholder:'예: 42', value: !PRESETS.includes(threshold) ? String(threshold) : '', 'aria-label':'사용자 지정 추천 컷' } });
    customInput.style.display = !PRESETS.includes(threshold) ? 'inline-block' : 'none';

    const toggle = h('button', { className:'kp-toggle', attrs:{ 'data-on': String(isFilterEnabled), role:'switch', 'aria-checked': String(isFilterEnabled) } });

    const filterRow = h('div', { className:'kp-row', children:[
      presetSelect, customInput,
      h('span', { className:'kp-label', html:'필터' }), toggle
    ]});

    const noteSlot = h('div', { className: 'kp-note-slot' });

    filterSec.appendChild(filterRow);
    filterSec.appendChild(noteSlot);

    // Sorter section
    const sorterSec = h('div', { className:'kp-section' });
    sorterSec.appendChild(h('div', { className:'kp-label', html:'정렬' }));

    const periodSelect = h('select', { className:'kp-select', attrs:{ 'aria-label':'기간 선택' } });
    Object.entries(PERIODS).forEach(([k,v])=>{
      const o = h('option', { html:v, attrs:{ value:k } });
      if (k===selectedPeriod) o.selected = true; periodSelect.appendChild(o);
    });

    const modeSelect = h('select', { className:'kp-select', attrs:{ 'aria-label':'정렬 기준' } });
    Object.entries(SORT_MODES).forEach(([k,v])=>{
      const o = h('option', { html:v, attrs:{ value:k } });
      if (k===sortMode) o.selected = true; modeSelect.appendChild(o);
    });

    const topSelect = h('select', { className:'kp-select', attrs:{ 'aria-label':'상위 개수' } });
    [100,200,300,500].forEach((n)=>{
      const o = h('option', { html:`상위 ${n}`, attrs:{ value:String(n) } });
      if (n===topN) o.selected = true; topSelect.appendChild(o);
    });

    // Centered action button row
    const runBtn = h('button', { className:'kp-btn primary', attrs:{ type:'button', id:'kp-run' }, children:[ Icons.play(), span('정렬 실행') ] });
    let isRunning = false;
    function setRunState(running){
      isRunning = running;
      runBtn.className = `kp-btn ${running ? 'danger' : 'primary'}`;
      runBtn.innerHTML = '';
      runBtn.appendChild(running ? Icons.stop() : Icons.play());
      runBtn.appendChild(span(running ? '취소' : '정렬 실행'));
    }
    const selectsRow = h('div', { className:'kp-row', children:[ periodSelect, modeSelect, topSelect ] });
    const actionsRow = h('div', { className:'kp-row center', children:[ runBtn ] });

    sorterSec.appendChild(selectsRow);
    sorterSec.appendChild(actionsRow);

    panel.append(filterSec, sorterSec);
    document.body.append(panel);

    // (safe initial dock)
    const fb = h('div', { className:'kp-launcher' });
    fb.appendChild(launcher);
    document.body.appendChild(fb);
    ensureDock(launcher);

    // anchored panel
    const reposition = () => positionPanelUnder(launcher, panel);
    launcher.addEventListener('click', (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      const open = panel.getAttribute('data-open') === 'true';
      const next = !open;
      panel.setAttribute('data-open', String(next));
      if (next){
        reposition();
        window.addEventListener('scroll', reposition, { passive:true });
        window.addEventListener('resize', reposition, { passive:true });
      } else {
        window.removeEventListener('scroll', reposition);
        window.removeEventListener('resize', reposition);
      }
    });

    // select active visual state
    const wireSelectActive = (sel) => {
      const setOpen = (on)=> sel.setAttribute('data-open', on ? 'true' : 'false');
      sel.addEventListener('focus', ()=>setOpen(true));
      sel.addEventListener('blur', ()=>setOpen(false));
      sel.addEventListener('mousedown', ()=>setOpen(true));
      sel.addEventListener('keyup', (e)=>{ if (e.key === 'Escape') setOpen(false); });
      sel.addEventListener('change', ()=>setOpen(false));
    };
    [presetSelect, periodSelect, modeSelect, topSelect].forEach(wireSelectActive);

    // handlers
    presetSelect.addEventListener('change', () => {
      if (presetSelect.value === 'custom'){ customInput.style.display = 'inline-block'; customInput.focus(); }
      else {
        customInput.style.display = 'none';
        threshold = parseInt(presetSelect.value, 10); GM_setValue('recoThreshold', threshold);
        updateBadge(); if (isFilterEnabled) applyFilter();
      }
    });
    customInput.addEventListener('input', debounce(()=>{
      const val = parseInt(customInput.value, 10);
      if (!isNaN(val)){ threshold = val; GM_setValue('recoThreshold', threshold); updateBadge(); if (isFilterEnabled) applyFilter(); }
    }, 200));

    toggle.addEventListener('click', () => {
      isFilterEnabled = !isFilterEnabled;
      sessionStorage.setItem('isFilterEnabled', JSON.stringify(isFilterEnabled));
      toggle.setAttribute('data-on', String(isFilterEnabled));
      toggle.setAttribute('aria-checked', String(isFilterEnabled));
      updateBadge(); applyFilter();
    });

    periodSelect.addEventListener('change', () => { selectedPeriod = periodSelect.value; GM_setValue('sortPeriod', selectedPeriod); });
    modeSelect.addEventListener('change', () => { sortMode = modeSelect.value; GM_setValue('sortMode', sortMode); });
    topSelect.addEventListener('change', () => { topN = parseInt(topSelect.value, 10); GM_setValue('topN', topN); });
    runBtn.addEventListener('click', async () => {
      if (!isRunning){ setRunState(true); try { await loadAndSort(selectedPeriod, topN, sortMode); } finally { setRunState(false); } }
      else { currentAbort?.abort(); }
    });

    function updateBadge(){
      badge.textContent = isFilterEnabled ? `≥${threshold}` : 'OFF';
      badge.setAttribute('data-on', String(isFilterEnabled));
    }

    // hot-mode hint
    updateHotNoteSlot();
    function updateHotNoteSlot(){
      const slot = noteSlot; if (!slot) return;
      slot.innerHTML = '';
      if (!isHotContext()){
        const note = h('div', { className:'kp-note' });
        note.appendChild(h('div', { className:'kp-note-text', html:'해당 스크립트는 개념글에서만<br>정상적으로 작동합니다.' }));
        const actions = h('div', { className:'kp-note-actions' });
        const btn = h('button', { className:'kp-btn', attrs:{ type:'button' }, children:[ span('개념글로 이동') ] });
        btn.addEventListener('click', goToHotPreserveCategory);
        actions.appendChild(btn);
        note.appendChild(actions);
        slot.appendChild(note);
      }
    }
    panel._updateHotNoteSlot = updateHotNoteSlot;
  }

  // ---------- positioning ----------
  function positionPanelUnder(anchor, panel){
    const r = anchor.getBoundingClientRect();
    const top = Math.round(r.bottom + 8);
    const left = Math.round(Math.max(8, Math.min(r.left, window.innerWidth - panel.offsetWidth - 8)));
    panel.style.top = `${top}px`; panel.style.left = `${left}px`; panel.style.right = ''; panel.style.bottom = '';
  }

  // ---------- hot navigation ----------
  function goToHotPreserveCategory(){
    const u = new URL(location.href);
    const cur = new URL(location.href);
    const cat = cur.searchParams.get('category');
    if (cat) u.searchParams.set('category', cat);
    u.searchParams.set('mode','hot');
    history.pushState({}, '', u.toString());
    onPotentialURLChange();
  }

  // ---------- docking (no flicker, persistent) ----------
  function ensureDock(launcher){
    let paused = false;
    let pauseTimer = null;

    const pauseDock = (ms=600) => { paused = true; clearTimeout(pauseTimer); pauseTimer = setTimeout(()=>{ paused = false; }, ms); };
    ['mouseenter','pointerdown','click','touchstart'].forEach(evt=>{
      launcher.addEventListener(evt, ()=>pauseDock(), { passive:true });
    });

    const attachFallback = () => {
      if (!launcher.parentElement || !launcher.parentElement.classList || !launcher.parentElement.classList.contains('kp-launcher')){
        const fb2 = h('div', { className:'kp-launcher' });
        fb2.appendChild(launcher);
        document.body.appendChild(fb2);
      }
      launcher.classList.add('kp-visible');
    };

    const isAlreadyBefore = (node, ref) =>
      node && ref && node.parentElement === ref.parentElement && node.nextSibling === ref;

    const tryDock = () => {
      if (!document.contains(launcher)) attachFallback();
      if (paused) return false;

      const write = $$(`${SELECTORS.WRITE_BUTTON_TEXT}`).find((el)=>/글쓰기/.test(el.textContent||''));
      if (write && write.parentElement){
        if (isAlreadyBefore(launcher, write)) {
          launcher.classList.add('kp-visible');
          launcher.dataset.docked = 'left';
          return true;
        }
        const oldParent = launcher.parentElement;
        write.parentElement.insertBefore(launcher, write);
        launcher.style.marginRight = '8px';
        if (oldParent && oldParent.classList && oldParent.classList.contains('kp-launcher')) oldParent.remove();
        launcher.classList.add('kp-visible');
        launcher.dataset.docked = 'left';
        return true;
      }

      attachFallback();
      launcher.dataset.docked = '';
      return false;
    };

    if (dockObserver) dockObserver.disconnect();
    const debTry = debounce(tryDock, 80);
    dockObserver = new MutationObserver(debTry);
    dockObserver.observe(document.body, { childList:true, subtree:true });

    let attempts = 0;
    const tick = setInterval(() => { tryDock(); if (++attempts > 200) clearInterval(tick); }, 180);
    tryDock();
  }

  // ---------- toast ----------
  let toastTimer = null;
  function toast(message, ms = 2000){
    const el = h('div', { className:'kp-chip kp-visible', attrs:{ style:'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:10000;background:var(--kp-surface-2);' }, children:[ Icons.info(), span(message) ] });
    document.body.appendChild(el);
    clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.remove(), ms);
  }

  // ---------- SPA / navigation detection ----------
  function attachObserver(){
    if (containerObserver) containerObserver.disconnect();
    const container = findListContainer();
    if (container){
      const reapply = debounce(applyFilter, 100);
      containerObserver = new MutationObserver(reapply);
      containerObserver.observe(container, { childList:true, subtree:true });
    }
  }

  function onLocationChange(){
    currentAbort?.abort();
    attachObserver();
    applyFilter();

    // Disable BG open after navigation; it will be re-enabled after the next sort.
    setBackgroundOpenEnabled(false);

    const panel = $('#kp-panel');
    if (panel && typeof panel._updateHotNoteSlot === 'function') panel._updateHotNoteSlot();

    const launcher = $('#kp-launcher');
    if (launcher) ensureDock(launcher);
  }

  function onPotentialURLChange(){
    if (location.href !== lastURL){
      lastURL = location.href;
      window.dispatchEvent(new Event('locationchange'));
    } else {
      onLocationChange();
    }
  }

  function enableSPAHooks(){
    const fire = () => onPotentialURLChange();
    const push = history.pushState; const replace = history.replaceState;
    history.pushState = function(){ push.apply(this, arguments); fire(); };
    history.replaceState = function(){ replace.apply(this, arguments); fire(); };
    window.addEventListener('popstate', fire);

    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const u = new URL(a.href, location.href);
      if (u.origin === location.origin){ setTimeout(onPotentialURLChange, 180); }
    }, true);

    if (urlPollTimer) clearInterval(urlPollTimer);
    urlPollTimer = setInterval(() => { if (location.href !== lastURL) onPotentialURLChange(); }, 1200);

    window.addEventListener('locationchange', onLocationChange);
  }

  // ---------- bootstrap ----------
  const boot = once(() => {
    const segs = location.pathname.split('/').filter(Boolean);
    if (segs.length > 2) return;

    if (!document.getElementById('kp-panel')) createToolbarAndPanel();
    applyFilter(); attachObserver(); enableSPAHooks();
  });

  window.addEventListener('load', boot, { once:true });
  setTimeout(()=>{ if (!document.getElementById('kp-panel')) boot(); }, 1200);
})();