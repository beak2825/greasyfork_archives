// ==UserScript==
// @name         Torn – Faction Armory Quick Items (Standalone)
// @namespace    https://torn.com/
// @version      1.2.0
// @description  Quick-access bar for commonly used faction armory items and points refills.
// @match        https://www.torn.com/factions.php*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563713/Torn%20%E2%80%93%20Faction%20Armory%20Quick%20Items%20%28Standalone%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563713/Torn%20%E2%80%93%20Faction%20Armory%20Quick%20Items%20%28Standalone%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- tiny utils ----------
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const cleanName = (n) => (n || '').replace(/\s+x[\d,.,,]+$/i, '').trim(); // strip trailing " x1234" (with commas/dots)
const debounce = (fn, ms = 150) => {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};
function escapeHtml(s=''){return s.replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m]));}
// Pull “You …” style lines (and points refills) out of the HTML blob Torn returns
function extractUseMessages(payload='') {
  const unescapeJsonish = s => String(s).replace(/\\\//g,'/');
  const pad = n => String(n).padStart(2,'0');
  const fmtHMS = sec => {
    sec = Math.max(0, Number(sec)||0);
    return `${pad(Math.floor(sec/3600))}:${pad(Math.floor((sec%3600)/60))}:${pad(Math.floor(sec%60))}`;
  };

  // NEW: handle <span class="t-time"> and <span class="counter-wrap"> with any of these attributes
  const renderTimeSpans = html => html.replace(
    /<span\b[^>]*class="[^"]*\b(?:t-time|counter-wrap)\b[^"]*"[^>]*?\bdata-(?:seconds|time|left|timer|countdown)="(\d+)"[^>]*>.*?<\/span>/gi,
    (_,secs)=>fmtHMS(secs)
  );

  const flattenStrings = (obj,out=[])=>{
    if (obj==null) return out;
    if (typeof obj==='string') { out.push(obj); return out; }
    if (Array.isArray(obj)) { for (const v of obj) flattenStrings(v,out); return out; }
    if (typeof obj==='object') { for (const k in obj) flattenStrings(obj[k],out); }
    return out;
  };

  let raw = unescapeJsonish(String(payload));
  let corpus = '';

  if (/^\s*\{/.test(raw)) {
    try { corpus = renderTimeSpans(flattenStrings(JSON.parse(raw)).join(' ')); } catch {}
  }
  if (!corpus) {
    corpus = renderTimeSpans(raw)
      .replace(/<script[\s\S]*?<\/script>/gi,' ')
      .replace(/<style[\s\S]*?<\/style>/gi,' ')
      .replace(/<[^>]+>/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }

  const hits = [];
  corpus.replace(/\b(You [^.?!]+[.?!])/g,(_,m)=>{hits.push(m.trim());return _;});
  corpus.replace(/\b((?:Energy|Nerve)\s+refilled[^.?!]*[.?!])/gi,(_,m)=>{hits.push(m.trim());return _;});
  corpus.replace(/\b(You now have [^.?!]+[.?!])/g,(_,m)=>{hits.push(m.trim());return _;});

  const seen = new Set();
  return hits.filter(s=>s.length>6 && !seen.has(s) && seen.add(s));
}



    // 1) de-escape common JSON escapes
function unescapeJsonish(s=''){ return s.replace(/\\\//g,'/'); }

// 2) format seconds → HH:MM:SS
function fmtHMS(sec){
  sec = Math.max(0, Number(sec)||0);
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = Math.floor(sec%60);
  const pad = n => String(n).padStart(2,'0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// 3) before stripping tags, replace <span class="t-time" ...> with a concrete HH:MM:SS
function renderTimeSpans(html){
  // Handle several attribute names Torn has used
  const attrs = ['data-seconds','data-time','data-left','data-timer','data-countdown'];
  // e.g. <span class="t-time" data-seconds="586">…</span>
  const rx = new RegExp(
    `<span\\b[^>]*class="[^"]*\\bt-time\\b[^"]*"[^>]*(${attrs.join('|')})="(\\d+)"[^>]*>[^<]*<\\/span>`,
    'gi'
  );
  return html.replace(rx, (_,attr,secs)=>fmtHMS(secs));
}


  function addStyle(css) {
    if (typeof GM_addStyle === 'function') GM_addStyle(css);
    else { const el = document.createElement('style'); el.textContent = css; document.head.appendChild(el); }
  }

  addStyle(`
#factionQuickItems { position: relative; margin-top:10px; }
#factionQuickItems .qi-header{ display:flex; align-items:center; gap:8px; margin-bottom:6px; }
#factionQuickItems .qi-header h3{ font-size:14px; margin:0; }
#factionQuickItems .inner-content{ width:100%; padding:0 5px 5px 5px; box-sizing:border-box; display:flex; flex-wrap:wrap; gap:6px; }
#factionQuickItems > main.drag-progress *{ pointer-events:none; }

/* Quick item chip */
#factionQuickItems .item{ display:inline-block; padding:5px; border-radius:6px; cursor:pointer; position:relative; margin:3px 3px 0 0; border:1px solid lightgray; background:#fff; }
body.dark-mode #factionQuickItems .item{ border:1px solid #444; background:#333; }
#factionQuickItems .temp.item{ opacity:0.3; border:1px dashed gray; }
#factionQuickItems .pic{ width:60px; height:30px; background-size:cover; background-position:center; margin:auto; }
#factionQuickItems .icon-refill{ display:flex; align-items:center; justify-content:center; }
.item[data-id^="points-"] .icon-refill i{ position:absolute; }
.item[data-id^="points-"] .icon-refill i::after{ position:absolute; right:0; bottom:0; font-size:11px; font-weight:bold; }
.item[data-id="points-energy"] .icon-refill i::after{ content:"E"; color:#6cad2b; }
.item[data-id="points-nerve"]  .icon-refill i::after{ content:"N"; color:#cc7032; }

/* Close icon (always visible in edit mode, hover in normal) */
#factionQuickItems .item .tt-close-icon{ opacity:0; position:absolute; top:3px; right:3px; color:#a7a7a7; }
#factionQuickItems .item:hover .tt-close-icon, .tt-mobile #factionQuickItems .item .tt-close-icon{ opacity:1; }
body.tt-qi-editing #factionQuickItems .item .tt-close-icon{ opacity:1; }

/* Edit mode visuals */
body.tt-qi-editing #factionQuickItems .item{ background:#ffd5d5 !important; border-color:#d99 !important; }
body.dark-mode.tt-qi-editing #factionQuickItems .item{ background:#9d2f2f !important; border-color:#a66 !important; }

/* Edit button base */
#factionQuickItems .option{
  cursor:pointer; padding:4px 10px; border:1px solid #888; border-radius:6px;
  background:#2d2d2d; color:#f1f1f1; font-size:12px; font-weight:600;
  display:inline-flex; align-items:center; gap:4px; transition:background .2s, border-color .2s, color .2s;
}
body:not(.dark-mode) #factionQuickItems .option{ background:#f8f8f8; color:#333; border-color:#bbb; }
#factionQuickItems .option:hover{ background:#3b5a9b; border-color:#2a4880; color:#fff; }

/* Edit button when editing */
#factionQuickItems .option.editing{
  background:#7a2b2b !important; border-color:#b45a5a !important; color:#fff !important;
}

/* Response panel sticks under tab header */
#factionQuickItems .response-wrap{
  display:none; position:sticky; top:0; z-index:5; padding:10px;
  background:var(--items-cont-bg-color, #f6f6f6);
  border-top:1px solid var(--items-cont-description-border-top-color,#ddd);
  border-bottom:1px solid var(--items-cont-description-border-top-color,#ddd);
  text-align:center;
}
.ui-tooltip.ui-widget{ z-index: 99999 !important; }
`);

function waitFor(selector, { root = document, timeout = 15000, invert = false } = {}) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const check = () => {
      const found = root.querySelector(selector);
      if ((invert && !found) || (!invert && found)) { obs.disconnect(); resolve(found || root); }
      else if (performance.now() - start > timeout) { obs.disconnect(); reject(new Error('waitFor timeout: ' + selector)); }
    };
    const obs = new MutationObserver(check);
    obs.observe(root, { childList: true, subtree: true });
    check();
  });
}


  // ---------- container ----------
function ensureContainer() {
  let wrap = document.querySelector('#factionQuickItems');

  // Find a stable anchor that survives tab swaps:
  // - If the tabs strip exists, insert AFTER it
  // - Otherwise, anchor to the parent container; if that’s missing, fall back to body
  const tabsStrip = document.querySelector('#faction-armoury-tabs > ul.torn-tabs');
  const armoryRoot = document.querySelector('#faction-armoury-tabs');
  const stableAnchor = tabsStrip ? tabsStrip.parentElement : armoryRoot;

  if (!wrap) {
    wrap = document.createElement('section');
    wrap.id = 'factionQuickItems';
    wrap.className = 'tt-qi mt10';

    // header
    const header = document.createElement('header');
    header.className = 'qi-header';

    const title = document.createElement('h3');
    title.textContent = 'Faction Quick Items';
    header.appendChild(title);

    const editBtn = document.createElement('button');
    editBtn.id = 'edit-items-button';
    editBtn.className = 'option';
    const editIcon = document.createElement('i');
    editIcon.className = 'fa-solid fa-plus';
    editBtn.appendChild(editIcon);
    editBtn.appendChild(document.createTextNode('Edit'));
    header.appendChild(editBtn);

    const main = document.createElement('main');
    main.className = 'inner-content';

    const resp = document.createElement('div');
    resp.className = 'response-wrap';

    wrap.appendChild(header);
    wrap.appendChild(main);
    wrap.appendChild(resp);
  }

  // Re-anchor every time this runs (so after SPA rerenders we snap back under the new tabs)
  if (stableAnchor) {
    const desiredParent = stableAnchor;
    if (wrap.parentNode !== desiredParent) {
      if (tabsStrip && tabsStrip.nextSibling) {
        desiredParent.insertBefore(wrap, tabsStrip.nextSibling);
      } else {
        desiredParent.insertBefore(wrap, desiredParent.firstChild);
      }
    }
  } else if (!wrap.parentNode) {
    // temporary parking; we’ll move it when armory DOM appears
    document.body.appendChild(wrap);
  }

  return wrap;
}

  const STORAGE_KEY = 'tt_quick_faction_items_v1';
  const loadQuickItems = () => { try { return GM_getValue(STORAGE_KEY) || []; } catch { return []; } };
  const saveQuickItems = (list) => { try { GM_setValue(STORAGE_KEY, list); } catch {} };

  // ---------- feature core ----------
  let editing = false;
  let draggingEl;

  function activeArmorySection() {
    const tab = $('#faction-armoury-tabs > ul.torn-tabs > li[aria-selected="true"]');
    if (!tab) return null;
    const controlsId = tab.getAttribute('aria-controls');
    return controlsId?.replace('armoury-', '') || null;
  }
  const isQuickableCategoryName = (n) => ['medical','drugs','boosters','points','caches','cesium','donate'].includes(n);

    function showQuickBarIfNeeded() {
  const wrap = ensureContainer();

  // Keep visible; avoid rewriting the same style value
  if (wrap.style.display !== '') wrap.style.display = '';

  if (!wrap.dataset.rendered) {
    wrap.dataset.rendered = '1';
    for (const it of loadQuickItems()) addQuickItem(it, { persist: false });
    attachEditButton();     // once
    setEditMode(editing);   // reflect current state; also binds pick listeners
  }

  // This is safe to call repeatedly; it guards via data-* flags
  setupDragFromList();
}


  function attachEditButton() {
    const btn = $('#edit-items-button');
    if (!btn || btn.dataset.qiInit === '1') return;
    btn.dataset.qiInit = '1';
    btn.classList.toggle('editing', editing);
    btn.innerHTML = editing ? '<i class="fa-solid fa-pen"></i>Edit Enabled' : '<i class="fa-solid fa-plus"></i>Edit';
    btn.onclick = (e) => { e.stopPropagation(); setEditMode(!editing); };
  }

  function setEditMode(state) {
    editing = state;
    document.body.classList.toggle('tt-qi-editing', editing);
    const btn = $('#edit-items-button');
    if (btn) {
      btn.classList.toggle('editing', editing);
      btn.innerHTML = editing ? '<i class="fa-solid fa-pen"></i>Edit Enabled' : '<i class="fa-solid fa-plus"></i>Edit';
    }
    // mark items removable
    $$('#factionQuickItems .item').forEach(n => n.classList.toggle('removable', editing));
    killUITooltips();
    attachPickListeners(editing); // bind/unbind only on toggle
  }

  function setupDragFromList() {
    const enableDrag = !/Mobi|Android/i.test(navigator.userAgent);
    const tabRoot = $('#faction-armoury-tabs .armoury-tabs[aria-expanded="true"]');
    if (!tabRoot) return;

    if (tabRoot.id === 'armoury-points') {
      $$(`#armoury-points .give[data-role]`, tabRoot).forEach(el => {
        const typeText = el.textContent.trim().toLowerCase();
        const type = typeText.includes('energy') ? 'energy' : 'nerve';
        el.dataset.type = 'tt-points';

        if (!el.querySelector('.img-wrap')) {
          const w = document.createElement('div');
          w.className = 'img-wrap';
          w.dataset.itemid = `points-${type}`;
          w.style.display = 'none';
          el.appendChild(w);
        }

        if (enableDrag && el.dataset.qiDragBound !== '1') {
          el.dataset.qiDragBound = '1';
          el.draggable = true;
          el.addEventListener('dragstart', onListDragStart);
          el.addEventListener('dragend', onListDragEnd);
        }
      });
    } else {
      $$(`.item-list > li`, tabRoot).forEach(li => {
        const id = $('.img-wrap', li)?.dataset.itemid;
        if (!id) return;
        if (enableDrag && li.dataset.qiDragBound !== '1') {
          li.dataset.qiDragBound = '1';
          li.draggable = true;
          li.addEventListener('dragstart', onListDragStart);
          li.addEventListener('dragend', onListDragEnd);
        }
      });
    }

function onListDragStart(ev) {
  if (!editing) return;               // <-- hard gate
  ev.dataTransfer.setData('text/plain', 'qi');
  setTimeout(() => {
    document.querySelector('#factionQuickItems > main')?.classList.add('drag-progress');
    if (!document.querySelector('#factionQuickItems .temp.item')) {
      const row = ev.currentTarget.closest('li') || ev.currentTarget;
      const id  = row.querySelector('.img-wrap')?.dataset.itemid;
      const nameEl   = row.querySelector('.name, .item-name, .name-wrap, [class*="name"]');
      const niceName = cleanName(nameEl?.textContent?.trim());
      if (id) addQuickItem({ id, name: niceName }, { temporary: true, persist: false });
    }
  }, 0);
}

    async function onListDragEnd() {
      $('#factionQuickItems .temp.item')?.remove();
      $('#factionQuickItems > main')?.classList.remove('drag-progress');
      await persistFromDOM();
    }
  }

  function addQuickItem(data, { temporary = false, persist = true } = {}) {
    const wrap = ensureContainer();
    const main = $('main.inner-content', wrap);
    const id = String(data.id);

    const existing = $(`.item[data-id="${id}"]`, main);
    if (existing) return existing;

    const item = document.createElement('div');
    item.className = `${temporary ? 'temp ' : ''}item`;
    item.dataset.id = id;
    if (data.name) item.dataset.name = data.name; // persist readable name
    item.draggable = true;

    if (id === 'points-energy' || id === 'points-nerve') {
      const pic = document.createElement('div');
      pic.className = 'pic icon-refill';
      const i = document.createElement('i'); i.className = 'currency-points'; pic.appendChild(i);
      item.title = (id === 'points-energy') ? 'Energy Refill' : 'Nerve Refill';
      item.append(pic);
    } else {
      const pic = document.createElement('div');
      pic.className = 'pic';
      pic.style.backgroundImage = `url(/images/items/${id}/medium.png)`;

      let label = data.name || `Item ${id}`;
      try {
        const numId = Number.isNaN(Number(id)) ? id : Number(id);
        if (!data.name && typeof torndata !== 'undefined' && torndata.items?.[numId]?.name) {
          label = torndata.items[numId].name;
        } else if (!data.name && typeof TORN_ITEMS !== 'undefined' && TORN_ITEMS[numId]?.name) {
          label = TORN_ITEMS[numId].name;
        }
      } catch {}
      item.title = label;
      item.append(pic);
    }

    // remove icon (no native title to avoid sticky tooltip)
    const close = document.createElement('i');
    close.className = 'fa-solid fa-xmark tt-close-icon';
    close.setAttribute('aria-label', 'Remove quick access.');
    close.addEventListener('click', async (e) => {
      if (!editing) return;
      e.stopPropagation();
      killUITooltips();
      item.remove();
      await persistFromDOM();
    });
    item.appendChild(close);

    // use / reorder
    item.addEventListener('click', () => {
      if (item.classList.contains('removable')) return; // edit mode
      useQuickItem(id);
    });
    item.addEventListener('dragstart', (ev) => {
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setDragImage(item, 0, 0);
      draggingEl = item;
    });
    item.addEventListener('dragend', async () => {
      draggingEl?.classList.remove('temp');
      draggingEl = null;
      await persistFromDOM();
    });
    item.addEventListener('dragover', (ev) => ev.preventDefault());
    item.addEventListener('dragenter', () => {
      if (!draggingEl || draggingEl === item) return;
      const children = Array.from(main.children);
      const a = children.indexOf(draggingEl);
      const b = children.indexOf(item);
      if (a > b) main.insertBefore(draggingEl, item);
      else main.insertBefore(draggingEl, item.nextSibling);
      draggingEl.classList.add('temp');
    });

    if (editing) item.classList.add('removable');

    main.appendChild(item);
    if (persist) persistFromDOM();
    return item;
  }

  async function persistFromDOM() {
    const main = $('#factionQuickItems main.inner-content');
    if (!main) return;
    const list = $$('.item', main).map(x => ({ id: x.dataset.id, name: x.dataset.name || undefined }));
    saveQuickItems(list);
  }

  async function useQuickItem(id) {
    const wrap = ensureContainer();
    const resp = $('.response-wrap', wrap);
    resp.style.display = 'block';
    resp.textContent = 'Working...';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    };

    let url, body = new URLSearchParams();
    try {
      if (id === 'points-energy' || id === 'points-nerve') {
        url = '/factions.php';
        body.set('step', id === 'points-energy' ? 'armouryRefillEnergy' : 'armouryRefillNerve');
        body.set('ajax', '1');
      } else {
        url = '/item.php';
        body.set('step', 'useItem');
        body.set('fac', '1');
        body.set('itemID', String(id));
        body.set('ajax', '1');
      }

      const res = await fetch(url, { method: 'POST', headers, body, credentials: 'same-origin', redirect: 'follow' });
      const text = await res.text();

      const okText =
        /\b(You used|has been used|Energy refilled|Nerve refilled|success|done|completed)\b/i.test(text) ||
        (res.ok && (id === 'points-energy' || id === 'points-nerve'));

if (okText) {
  const msgs = extractUseMessages(text);
  if (msgs.length) {
    resp.innerHTML =
      msgs.map(m => `<div class="t-green">${escapeHtml(m)}</div>`).join('') +
      `<div><a href="#" class="t-blue h close-act">Close</a></div>`;
  } else {
    // fallback if Torn didn’t send the usual copy
    resp.innerHTML = `<div class="t-green">Success — check your HUD.</div>
                      <div><a href="#" class="t-blue h close-act">Close</a></div>`;
  }
  return;
}


      // Fallback to native UI
      const tabRoot = $('#faction-armoury-tabs .armoury-tabs[aria-expanded="true"]');
      if (id === 'points-energy' || id === 'points-nerve') {
        const roleSel = id === 'points-energy' ? "[data-role='refill']" : "[data-role='give']";
        const btn = tabRoot?.querySelector(`#armoury-points .give${roleSel}`) ||
                    tabRoot?.querySelector(`#armoury-points .give`);
        if (btn) {
          btn.click();
          resp.innerHTML = `<div class="t-green">Triggered native Points refill UI. Complete it there.</div>
                            <div><a href="#" class="t-blue h close-act">Close</a></div>`;
          return;
        }
      } else {
        const li = tabRoot?.querySelector(`.item-list > li .img-wrap[data-itemid="${id}"]`)?.closest('li');
        if (li) {
          li.click();
          await new Promise(r => setTimeout(r, 150));
          const useBtn = li.querySelector('form[data-action="useItem"] input[type="submit"], .use-wrap form input[type="submit"], button.use');
          if (useBtn) {
            useBtn.click();
            resp.innerHTML = `<div class="t-green">Triggered native Use action. Watch your HUD.</div>
                              <div><a href="#" class="t-blue h close-act">Close</a></div>`;
            return;
          }
        }
      }

      resp.innerHTML = `<div class="t-red">Request didn’t succeed.</div>
                        <div><a href="#" class="t-blue h close-act">Close</a></div>`;
    } catch (e) {
      resp.innerHTML = `<div class="t-red">Error: ${e.message}</div>
                        <div><a href="#" class="t-blue h close-act">Close</a></div>`;
    }
  }

  function attachPickListeners(enabled) {
    const tabRoot = $('#faction-armoury-tabs .armoury-tabs[aria-expanded="true"]');
    if (!tabRoot) return;

    const off = () => {
      tabRoot.querySelectorAll('.item-list > li[data-qi-pick-bound="1"]').forEach(li => {
        li.removeEventListener('click', onPick);
        li.dataset.qiPickBound = '0';
      });
      document.querySelectorAll('#armoury-points .give[data-role][data-qi-pick-bound="1"]').forEach(el => {
        el.removeEventListener('click', onPick);
        el.dataset.qiPickBound = '0';
      });
      $$('#factionQuickItems .item').forEach(n => n.classList.remove('removable'));
    };

    const on = () => {
      tabRoot.querySelectorAll('.item-list > li').forEach(li => {
        const id = li.querySelector('.img-wrap')?.dataset.itemid;
        if (!id || li.dataset.qiPickBound === '1') return;
        li.dataset.qiPickBound = '1';
        li.addEventListener('click', onPick);
      });
      document.querySelectorAll('#armoury-points .give[data-role]').forEach(el => {
        if (el.dataset.qiPickBound === '1') return;
        el.dataset.qiPickBound = '1';
        el.addEventListener('click', onPick);
      });
      $$('#factionQuickItems .item').forEach(n => n.classList.add('removable'));
    };

function onPick(ev) {
  if (!editing) return;               // <-- hard gate
  ev.preventDefault();
  ev.stopPropagation();

  const row = ev.currentTarget.closest('li') || ev.currentTarget;
  const id  = row.querySelector('.img-wrap')?.dataset.itemid;
  if (!id) return;

  const nameEl   = row.querySelector('.name, .item-name, .name-wrap, [class*="name"]');
  const niceName = cleanName(nameEl?.textContent?.trim());

  const node = addQuickItem({ id, name: niceName }, { persist: true });
  node.classList.add('removable');
}


    if (enabled) on(); else off();
  }

  function killUITooltips() {
    document.querySelectorAll('.ui-tooltip, [role="tooltip"]').forEach(el => el.remove());
  }

  // ---------- boot ----------
let armoryObs = null;
const refresh = debounce(() => {
  if (!location.hash.includes('tab=armoury')) return;
  showQuickBarIfNeeded();
}, 150);

async function boot() {
  try { await waitFor('#faction-armoury-tabs'); } catch {}  // safe no-op if not found

  const root = document.querySelector('#faction-armoury-tabs') || document.body;

  const startObserver = () => {
    stopObserver();
    if (!root) return;
    armoryObs = new MutationObserver(refresh);
    armoryObs.observe(root, { childList: true, subtree: true });
  };
  const stopObserver = () => {
    if (armoryObs) { armoryObs.disconnect(); armoryObs = null; }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopObserver();
    else { startObserver(); refresh(); }
  });

  window.addEventListener('hashchange', refresh);
  window.addEventListener('popstate', refresh);

  startObserver();
  refresh(); // draw once immediately
}



  boot();
})();
