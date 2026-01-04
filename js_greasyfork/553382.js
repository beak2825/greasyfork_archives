// ==UserScript==
// @name         Terminal - Packs - Bulk Open RU/IMF/KZ
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  On /packs adds buttons to open all visible packs in admin with #allru/#allimf/#allkz. On pack page: RU/KZ toggles all cities in the respective country group; IMF enables whitelist countries; presses Update and closes.
// @match        https://dodopizza.design-terminal.io/*
// @match        https://dodopizza.design-terminal.ru/*
// @icon         https://dodopizza.design-terminal.io/favicon.ico
// @run-at       document-idle
// @grant        GM_openInTab
// @grant        GM.openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553382/Terminal%20-%20Packs%20-%20Bulk%20Open%20RUIMFKZ.user.js
// @updateURL https://update.greasyfork.org/scripts/553382/Terminal%20-%20Packs%20-%20Bulk%20Open%20RUIMFKZ.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- общие настройки ----
  const HASH_IMF = '#allimf';
  const HASH_RU  = '#allru';
  const HASH_KZ  = '#allkz';
  const MAX_WAIT_MS = 120_000;
  const POLL_MS = 200;
  const CLICK_DELAY_MS = 8;
  const CYCLE_MS = 900;
  const STABLE_CYCLES_TO_STOP = 2;

  // Батчи открытия вкладок
  const BATCH_SIZE = 20;
  const OPEN_GAP_MS = 160;
  const BATCH_PAUSE_MS = 20_000;

  // Исключения по ID не используются — поведение как в RU-скрипте

  // IMF whitelist стран
  const WHITELIST_IMF = [
    'Armenia','Azerbaijan','Bulgaria','Croatia','Cyprus','Estonia','Georgia','Germany','Indonesia',
    'Kyrgyzstan','Lithuania','Mongolia','Montenegro','Moldova','Nigeria','Poland','Romania','Serbia',
    'Slovenia','Spain','Tajikistan','Uzbekistan','Vietnam','zzz Demo Country IMF'
  ];

  // ---- утилиты ----
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const norm = (t) => (t||'').replace(/\s+/g,' ').trim();

  const log = (() => {
    const w = (...a)=>{ console.log('[BULK]',...a); };
    return { info:w, ok:w, err:w };
  })();

  function waitFor(predicate, timeout=MAX_WAIT_MS, poll=POLL_MS) {
    return new Promise((resolve, reject) => {
      const start = Date.now(); let rafId = 0, timerId = 0;
      const tick = () => {
        try {
          const v = predicate();
          if (v) { cancel(); return resolve(v); }
          if (Date.now() - start >= timeout) { cancel(); return reject(new Error('timeout')); }
          timerId = setTimeout(()=>{ rafId = requestAnimationFrame(tick); }, poll);
        } catch (e) { cancel(); reject(e); }
      };
      const cancel = () => { clearTimeout(timerId); cancelAnimationFrame(rafId); };
      tick();
    });
  }

  function waitForWithObserver(getter, {timeout=MAX_WAIT_MS} = {}) {
    return new Promise((resolve, reject) => {
      const found = getter();
      if (found) return resolve(found);
      const obs = new MutationObserver(() => {
        const el = getter();
        if (el) { clearTimeout(to); obs.disconnect(); resolve(el); }
      });
      obs.observe(document, { childList:true, subtree:true });
      const to = setTimeout(() => { obs.disconnect(); reject(new Error('timeout')); }, timeout);
      const stop = () => { clearTimeout(to); obs.disconnect(); };
      window.addEventListener('beforeunload', stop, { once:true });
    });
  }

  // ---- тип страницы ----
  const isAdminList = /\/admin\/packs(?:$|\?)/.test(location.pathname);
  const isAdminPack = /\/admin\/packs\/\d+/.test(location.pathname);
  const isPublicList = location.pathname === '/packs';

  // ---- helper: видимость строки таблицы ----
  function isVisibleRow(tr) {
    if (!tr) return false;
    if (tr.hidden) return false;
    try {
      if (tr.classList && tr.classList.contains('tm-country-hidden')) return false;
      const cs = getComputedStyle(tr);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    } catch {}
    if (tr.offsetParent === null) return false;
    return true;
  }

  // ---- сбор ссылок ----
  function extractPackId(href) {
    const m = (href || '').match(/\/admin\/packs\/(\d+)/);
    return m ? Number(m[1]) : null;
  }

  function collectAdminListUrls() {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    const urls = new Set();
    const pushIf = (a) => {
      const href = a.getAttribute('href') || '';
      urls.add(new URL(href, location.origin).toString());
    };
    if (rows.length) {
      for (const tr of rows) {
        if (!isVisibleRow(tr)) continue;
        const links = Array.from(tr.querySelectorAll('a[href^="/admin/packs/"]'));
        if (!links.length) continue;
        const aName = links.sort((a,b)=>norm(b.textContent).length - norm(a.textContent).length)[0];
        if (aName) pushIf(aName);
      }
    } else {
      for (const a of Array.from(document.querySelectorAll('a[href^="/admin/packs/"]'))) {
        const tr = a.closest('tr');
        if (tr) {
          if (!isVisibleRow(tr)) continue;
          const links = Array.from(tr.querySelectorAll('a[href^="/admin/packs/"]'));
          if (!links.length) continue;
          const aName = links.sort((a,b)=>norm(b.textContent).length - norm(a.textContent).length)[0];
          if (aName) pushIf(aName);
        } else {
          const txt = norm(a.textContent);
          pushIf(a);
        }
      }
    }
    return Array.from(urls);
  }

  function collectFromPublicList() {
    const table = document.querySelector('.packs-view__table');
    if (!table) return [];
    const links = table.querySelectorAll('a.link');
    const uniqueIds = new Set();
    const res = [];
    for (const link of links) {
      const title = norm(link.textContent);
      try {
        const url = new URL(link.href);
        if (!/\/admin\//.test(url.pathname)) url.pathname = `/admin${url.pathname}`;
        const m = url.pathname.match(/\/admin\/packs\/(\d+)$/);
        if (m) {
          const id = m[1];
          if (!uniqueIds.has(id)) { uniqueIds.add(id); res.push(url.toString()); }
        }
      } catch {}
    }
    return res;
  }

  async function openBatched(urls, hash) {
    const list = urls.slice().reverse().map(u => u + hash);
    log.info('Будет открыто:', list.length);
    for (let i = 0; i < list.length; i += BATCH_SIZE) {
      const batch = list.slice(i, i + BATCH_SIZE);
      log.info(`Открываю батч ${i/BATCH_SIZE+1}: ${batch.length}`);
      for (const url of batch) {
        try {
          if (typeof GM !== 'undefined' && GM.openInTab) GM.openInTab(url, {active:false, insert:true, setParent:true});
          else if (typeof GM_openInTab === 'function') GM_openInTab(url, {active:false, insert:true, setParent:true});
          else window.open(url,'_blank','noopener');
        } catch { window.open(url,'_blank','noopener'); }
        await sleep(OPEN_GAP_MS);
      }
      if (i + BATCH_SIZE < list.length) { log.info(`Пауза ${Math.round(BATCH_PAUSE_MS/1000)}с`); await sleep(BATCH_PAUSE_MS); }
    }
    log.ok('Готово: все батчи открыты');
  }

  // ---- UI на списке ----
  // На admin/packs кнопки не добавляем, только на /packs

  async function ensurePublicButtons() {
    // Удаляем дубликаты контейнеров, если вдруг остались после перерисовок
    const allExisting = Array.from(document.querySelectorAll('#bulk-open-public-container'));
    if (allExisting.length > 1) {
      for (let i=1;i<allExisting.length;i++) allExisting[i].remove();
    }
    let container = allExisting[0] || document.getElementById('bulk-open-public-container');

    const title = await waitForWithObserver(() => document.querySelector('.main-layout__title-content'), { timeout: MAX_WAIT_MS }).catch(()=>null)
               || document.querySelector('.main-layout__title-content')
               || document.querySelector('.main-layout__title-text');
    if (!title) { log.err('Header not found on /packs'); return null; }

    if (!container) {
      container = document.createElement('span');
      container.id = 'bulk-open-public-container';
      const btnImf = document.createElement('button'); btnImf.id = 'bulk-open-imf-public'; btnImf.textContent = 'Open IMF';
      const btnRu  = document.createElement('button'); btnRu.id  = 'bulk-open-ru-public';  btnRu.textContent  = 'Open RU';
      const btnKz  = document.createElement('button'); btnKz.id  = 'bulk-open-kz-public';  btnKz.textContent  = 'Open KZ';
      container.appendChild(document.createTextNode(' '));
      container.appendChild(btnImf);
      container.appendChild(document.createTextNode(' '));
      container.appendChild(btnRu);
      container.appendChild(document.createTextNode(' '));
      container.appendChild(btnKz);
      title.insertAdjacentElement('afterend', container);
      const handler = (hash) => async (e) => { e.preventDefault(); const urls = collectFromPublicList(); if (!urls.length) { log.err('No matching packs'); return; } log.info('Open from /packs', hash); await openBatched(urls, hash); };
      btnImf.addEventListener('click', handler(HASH_IMF));
      btnRu.addEventListener('click',  handler(HASH_RU));
      btnKz.addEventListener('click',  handler(HASH_KZ));
      log.ok('Buttons ensured on /packs');
    } else {
      // Перемещаем контейнер к актуальному заголовку, если он не рядом
      if (container.previousElementSibling !== title) {
        title.insertAdjacentElement('afterend', container);
      }
      // Проверим, что обе кнопки существуют (могли исчезнуть при перерисовке)
      if (!document.getElementById('bulk-open-imf-public')) {
        const b = document.createElement('button'); b.id = 'bulk-open-imf-public'; b.textContent = 'Open IMF';
        container.appendChild(document.createTextNode(' ')); container.appendChild(b);
        b.addEventListener('click', async (e)=>{ e.preventDefault(); const urls = collectFromPublicList(); if (!urls.length) { log.err('No matching packs'); return; } await openBatched(urls, HASH_IMF); });
      }
      if (!document.getElementById('bulk-open-ru-public')) {
        const b = document.createElement('button'); b.id = 'bulk-open-ru-public'; b.textContent = 'Open RU';
        container.appendChild(document.createTextNode(' ')); container.appendChild(b);
        b.addEventListener('click', async (e)=>{ e.preventDefault(); const urls = collectFromPublicList(); if (!urls.length) { log.err('No matching packs'); return; } await openBatched(urls, HASH_RU); });
      }
      if (!document.getElementById('bulk-open-kz-public')) {
        const b = document.createElement('button'); b.id = 'bulk-open-kz-public'; b.textContent = 'Open KZ';
        container.appendChild(document.createTextNode(' ')); container.appendChild(b);
        b.addEventListener('click', async (e)=>{ e.preventDefault(); const urls = collectFromPublicList(); if (!urls.length) { log.err('No matching packs'); return; } await openBatched(urls, HASH_KZ); });
      }
    }
    return container;
  }

  function updatePublicButtonsVisibility() {
    const containers = Array.from(document.querySelectorAll('#bulk-open-public-container'));
    if (!containers.length) return;
    const authLi = document.querySelector('.main-layout__nav-item_view_auth-as');
    const authText = norm(authLi?.textContent || '');
    const isImfUser = /\.IMF\s+Demo\s+User/i.test(authText);
    const isRuUser  = /\.RU\s+Demo\s+User/i.test(authText);
    const isKzUser  = /\.KZ\s+Demo\s+User/i.test(authText);
    for (const c of containers) {
      const btnImf = c.querySelector('#bulk-open-imf-public');
      const btnRu  = c.querySelector('#bulk-open-ru-public');
      const btnKz  = c.querySelector('#bulk-open-kz-public');
      if (!btnImf || !btnRu) continue;
      if (isImfUser && !isRuUser && !isKzUser) {
        btnImf.style.display = '';
        btnRu.style.display = 'none';
        if (btnKz) btnKz.style.display = 'none';
      } else if (isRuUser && !isImfUser && !isKzUser) {
        btnImf.style.display = 'none';
        btnRu.style.display = '';
        if (btnKz) btnKz.style.display = 'none';
      } else if (isKzUser && !isImfUser && !isRuUser) {
        btnImf.style.display = 'none';
        btnRu.style.display = 'none';
        if (btnKz) btnKz.style.display = '';
      } else {
        // Ни IMF, ни RU — скрываем обе
        btnImf.style.display = 'none';
        btnRu.style.display = 'none';
        if (btnKz) btnKz.style.display = 'none';
      }
    }
  }

  function removeButtons() {
    // Удаляем любые наши кнопки, если страница уже не целевая
    const pub = document.getElementById('bulk-open-public-container');
    if (pub && location.pathname !== '/packs') pub.remove();
    const admImf = document.getElementById('bulk-open-imf');
    const admRu  = document.getElementById('bulk-open-ru');
    if (admImf) admImf.parentElement?.remove();
    if (admRu)  admRu.parentElement?.remove();
  }

  // ---- общие помощники для страницы пака ----
  function labelFor(cb) {
    if (cb.id) {
      const l = document.querySelector(`label[for="${cb.id}"]`);
      if (l) return l;
    }
    return cb.closest('label') || cb.closest('div, p, li, section, article') || cb;
  }

  function countryName(cb) {
    const row = labelFor(cb).closest('div, p, li, section, article') || cb.parentElement;
    return norm(row?.textContent || '');
  }

  function isWhitelistedIMF(name) {
    const low = (name || '').toLowerCase();
    return WHITELIST_IMF.some(t => low.includes(t.toLowerCase()));
  }

  function clickSeq(el) {
    const o = { bubbles:true, cancelable:true, view:window };
    try {
      el.dispatchEvent(new PointerEvent('pointerdown', o));
      el.dispatchEvent(new MouseEvent('mousedown', o));
      el.dispatchEvent(new MouseEvent('mouseup', o));
      el.dispatchEvent(new PointerEvent('pointerup', o));
    } catch {}
    el.click();
  }

  async function setChecked(cb, desired) {
    if (cb.disabled) return false;
    for (let i=0;i<4;i++){
      if (cb.checked === desired) return true;
      const target = labelFor(cb);
      try { cb.scrollIntoView({block:'center'}); } catch {}
      clickSeq(target);
      await sleep(CLICK_DELAY_MS);
      if (cb.checked === desired) break;
      clickSeq(cb);
      await sleep(CLICK_DELAY_MS);
      if (cb.checked === desired) break;
    }
    if (cb.checked !== desired) {
      cb.checked = desired;
      cb.dispatchEvent(new Event('click', { bubbles:true }));
      cb.dispatchEvent(new Event('input', { bubbles:true }));
      cb.dispatchEvent(new Event('change',{bubbles:true}));
    }
    return cb.checked === desired;
  }

  function findBranchesContainer() {
    const main = document.querySelector('main') || document.body;
    let best=null, max=0;
    for (const el of main.querySelectorAll('*')) {
      if (!/\bBranches\b/i.test(el.textContent||'')) continue;
      const c = el.querySelectorAll('input[type="checkbox"]').length;
      if (c>max) { max=c; best=el; }
    }
    return max>0 ? best : null;
  }

  async function waitBranches() {
    try {
      return await waitForWithObserver(findBranchesContainer, { timeout: MAX_WAIT_MS });
    } catch {
      return await waitFor(() => findBranchesContainer(), MAX_WAIT_MS, POLL_MS).catch(() => null);
    }
  }

  function findUpdateButton() {
    const buttons = Array.from(document.querySelectorAll('button, input[type="submit"]'));
    return buttons.find(b => {
      const t = norm(b.textContent || b.value || '');
      return t === 'Update' || t.startsWith('Update') || t === 'Сохранить';
    });
  }

  // ---- лёгкая плашка-отчёт на странице пака ----
  function showReportBanner(text, tone='ok') {
    try {
      let bar = document.getElementById('bulk-report-banner');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'bulk-report-banner';
        Object.assign(bar.style, {
          position:'fixed', right:'16px', bottom:'16px', zIndex:2147483647,
          maxWidth:'460px', padding:'10px 12px', borderRadius:'8px',
          color:'#fff', font:'12px/1.4 ui-monospace, SFMono-Regular, Consolas, monospace',
          boxShadow:'0 6px 18px rgba(0,0,0,.25)'
        });
        document.body.appendChild(bar);
      }
      bar.textContent = text;
      bar.style.background = tone==='err' ? 'rgba(176,0,32,.92)' : 'rgba(0,128,0,.92)';
      bar.style.display = 'block';
      setTimeout(()=>{ if(bar) bar.style.display='none'; }, 1600);
    } catch {}
  }

  async function applyIMFAndSaveClose() {
    log.info('IMF: жду Branches и применяю whitelist…');
    const start = Date.now(); let stable = 0;
    let total=0, eligible=0, changed=0, already=0, failed=0;
    while (Date.now() - start < MAX_WAIT_MS) {
      const container = findBranchesContainer() || await waitBranches().catch(()=>null);
      if (!container) { await sleep(CYCLE_MS); continue; }
      const boxes = Array.from(container.querySelectorAll('input[type="checkbox"]'));
      if (!boxes.length) { await sleep(CYCLE_MS); continue; }
      let changedThisCycle = 0;
      total = boxes.length;
      for (const cb of boxes) {
        const name = countryName(cb); if (!name) continue;
        if (!isWhitelistedIMF(name)) continue; eligible++;
        const was = cb.checked;
        if (!was) { const ok = await setChecked(cb, true); if (ok) { changedThisCycle++; changed++; } else { failed++; } }
        else { already++; }
      }
      if (changedThisCycle === 0) { stable += 1; if (stable >= STABLE_CYCLES_TO_STOP) break; } else { stable = 0; }
      await sleep(CYCLE_MS);
    }
    const upd = await waitFor(() => findUpdateButton(), MAX_WAIT_MS, POLL_MS).catch(()=>null);
    if (upd) { try { upd.scrollIntoView({block:'center'}); } catch {} clickSeq(upd); log.ok('IMF: Update'); }
    showReportBanner(`IMF: eligible ${eligible}, changed ${changed}, already ${already}, failed ${failed}`);
    setTimeout(() => { try { window.close(); } catch {} }, 1600);
  }

  function findCountryGroupRoot(countryLabelRegex) {
    // Ищем блок, содержащий подпись нужной страны
    const groups = Array.from(document.querySelectorAll('details, .branch-checkbox-groups__group'));
    for (const g of groups) {
      const txt = norm(g.textContent);
      if (countryLabelRegex.test(txt)) return g;
    }
    return null;
  }

  async function applyRUAndSaveClose() {
    log.info('RU: включаю все Russia…');
    await waitBranches();
    const root = findCountryGroupRoot(/\bDodo\s+Pizza\s+Russia\b/i);
    if (!root) { log.err('RU: группа не найдена'); return; }
    const cbs = Array.from(root.querySelectorAll('input[type="checkbox"]'));
    let changed=0, already=0, failed=0;
    for (const cb of cbs) { const was = cb.checked; const ok = await setChecked(cb, true); if (ok) { if (!was && cb.checked) changed++; else already++; } else { failed++; } }
    const upd = await waitFor(() => findUpdateButton(), MAX_WAIT_MS, POLL_MS).catch(()=>null);
    if (upd) { try { upd.scrollIntoView({block:'center'}); } catch {} clickSeq(upd); log.ok('RU: Update'); }
    showReportBanner(`RU: changed ${changed}, already ${already}, failed ${failed}`);
    setTimeout(() => { try { window.close(); } catch {} }, 1600);
  }

  async function applyKZAndSaveClose() {
    log.info('KZ: включаю все Kazakhstan…');
    await waitBranches();
    const root = findCountryGroupRoot(/\bDodo\s+Pizza\s+Kazakhstan\b/i);
    if (!root) { log.err('KZ: группа не найдена'); return; }
    const cbs = Array.from(root.querySelectorAll('input[type="checkbox"]'));
    let changed=0, already=0, failed=0;
    for (const cb of cbs) { const was = cb.checked; const ok = await setChecked(cb, true); if (ok) { if (!was && cb.checked) changed++; else already++; } else { failed++; } }
    const upd = await waitFor(() => findUpdateButton(), MAX_WAIT_MS, POLL_MS).catch(()=>null);
    if (upd) { try { upd.scrollIntoView({block:'center'}); } catch {} clickSeq(upd); log.ok('KZ: Update'); }
    showReportBanner(`KZ: changed ${changed}, already ${already}, failed ${failed}`);
    setTimeout(() => { try { window.close(); } catch {} }, 1600);
  }

  // ---- router ----
  (async function run(){
    // Первичный запуск
    if (isPublicList) { await ensurePublicButtons(); updatePublicButtonsVisibility(); } else { removeButtons(); }
    if (isAdminPack) {
      await waitFor(() => ['interactive','complete'].includes(document.readyState), MAX_WAIT_MS, POLL_MS).catch(()=>{});
      await sleep(250);
      if (location.hash === HASH_IMF) await applyIMFAndSaveClose();
      if (location.hash === HASH_RU) await applyRUAndSaveClose();
      if (location.hash === HASH_KZ) await applyKZAndSaveClose();
    }

    // SPA-навигация: отслеживаем смену маршрута/домена без перезагрузки
    let lastRouteKey = location.host + '|' + location.pathname + '|' + location.hash;
    const onRouteMaybeChanged = async () => {
      const key = location.host + '|' + location.pathname + '|' + location.hash;
      if (key !== lastRouteKey) {
        lastRouteKey = key;
        log.info('Route changed →', key);
        // Переинициализация кнопок на соответствующих страницах
        if (/^\/packs$/.test(location.pathname)) { await ensurePublicButtons(); updatePublicButtonsVisibility(); } else { removeButtons(); }
        if (/^\/admin\/packs\/.+/.test(location.pathname)) {
          if (location.hash === HASH_IMF) await applyIMFAndSaveClose();
          if (location.hash === HASH_RU) await applyRUAndSaveClose();
          if (location.hash === HASH_KZ) await applyKZAndSaveClose();
        }
      } else {
        // Перерисовки без смены URL: убедимся, что кнопки присутствуют
        if (/^\/packs$/.test(location.pathname)) { await ensurePublicButtons(); updatePublicButtonsVisibility(); } else { removeButtons(); }
      }
    };

    // Патчим History API
    const ps = history.pushState; const rs = history.replaceState;
    if (!history.__bulkPatched) {
      history.pushState = function(){ const r = ps.apply(this, arguments); try{ onRouteMaybeChanged(); }catch{} return r; };
      history.replaceState = function(){ const r = rs.apply(this, arguments); try{ onRouteMaybeChanged(); }catch{} return r; };
      window.addEventListener('popstate', onRouteMaybeChanged);
      window.addEventListener('hashchange', onRouteMaybeChanged);
      history.__bulkPatched = true;
    }

    // Небольшой интервал как страховка
    setInterval(onRouteMaybeChanged, 1500);
    // И наблюдатель DOM на случай полной перерисовки
    const mo = new MutationObserver(() => { onRouteMaybeChanged(); });
    mo.observe(document, { childList:true, subtree:true });
  })();

  window.addEventListener('hashchange', () => {
    if (!isAdminPack) return;
    if (location.hash === HASH_IMF) applyIMFAndSaveClose();
    if (location.hash === HASH_RU) applyRUAndSaveClose();
  });
})();


