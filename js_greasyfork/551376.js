// ==UserScript==
// @name         ArmA Reforger Workshop - Preset Maker
// @namespace    reforger_preset_maker
// @version      1.2
// @description  Create mod presets to use with Reforger server configs.
// @author       JJayRex
// @match        https://reforger.armaplatform.com/workshop*
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/551376/ArmA%20Reforger%20Workshop%20-%20Preset%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/551376/ArmA%20Reforger%20Workshop%20-%20Preset%20Maker.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const STORAGE_KEY = 'reforgerPreset';

  // Storage helpers
  function loadMods() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function saveMods(mods) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mods));
    refreshPanel();
  }
  function upsertMod(mod) {
    const mods = loadMods();
    const idx = mods.findIndex(m => m.modId === mod.modId);
    if (idx >= 0) mods[idx] = mod; else mods.push(mod);
    saveMods(mods);
  }
  function removeMod(modId) {
    const mods = loadMods().filter(m => m.modId !== modId);
    saveMods(mods);
  }

  // UI
  function ensureUI() {
    if (document.getElementById('presetToggle')) return;

    const btn = document.createElement('button');
    btn.id = 'presetToggle';
    btn.textContent = 'Preset';
    Object.assign(btn.style, {
      position: 'fixed', bottom: '10px', right: '20px', zIndex: '999999',
      background: '#0d6efd', color: '#fff', border: 'none',
      padding: '6px 10px', borderRadius: '6px', cursor: 'pointer',
      fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,.3)'
    });
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    panel.id = 'presetPanel';
    Object.assign(panel.style, {
      display: 'none', position: 'fixed', bottom: '60px', right: '20px',
      zIndex: '999999', background: 'rgba(20,20,20,.95)', color: '#eee',
      padding: '12px', border: '1px solid #444', borderRadius: '8px',
      maxHeight: '75vh', overflowY: 'auto', width: '460px',
      boxShadow: '0 8px 24px rgba(0,0,0,.4)', backdropFilter: 'blur(2px)'
    });

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.gap = '8px';
    header.style.alignItems = 'center';
    header.style.marginBottom = '8px';

    const title = document.createElement('strong');
    title.textContent = 'Mod Preset';
    title.style.flex = '1';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear all';
    Object.assign(clearBtn.style, smallBtnStyle('#6c757d'));

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    Object.assign(closeBtn.style, smallBtnStyle('#dc3545'));

    header.appendChild(title);
    header.appendChild(clearBtn);
    header.appendChild(closeBtn);

    const listWrap = document.createElement('div');
    listWrap.id = 'modListWrap';
    listWrap.style.marginBottom = '10px';
    listWrap.style.border = '1px solid #333';
    listWrap.style.borderRadius = '6px';
    listWrap.style.padding = '8px';
    listWrap.style.background = '#1d1f20';

    const jsonTitle = h3('JSON');
    const jsonArea = ta('modJsonView', 140);

    const strTitle = h3('STRING');
    const strArea = ta('modStringView', 60);
    strArea.setAttribute('wrap', 'off');
    strArea.style.overflowX = 'auto';

    panel.append(header, listWrap, jsonTitle, jsonArea, strTitle, strArea);
    document.body.appendChild(panel);

    btn.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      if (panel.style.display === 'block') refreshPanel();
    });
    closeBtn.addEventListener('click', () => panel.style.display = 'none');
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear entire mod preset?')) saveMods([]);
    });
  }

  function smallBtnStyle(bg) {
    return {
      background: bg, color: '#fff', border: 'none', padding: '4px 8px',
      borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
    };
  }
  function h3(text) {
    const el = document.createElement('h3');
    el.textContent = text;
    el.style.margin = '8px 0 4px 0';
    el.style.fontSize = '14px';
    return el;
  }
  function ta(id, heightPx) {
    const el = document.createElement('textarea');
    el.id = id; el.readOnly = true;
    Object.assign(el.style, {
      width: '100%', height: `${heightPx}px`, fontFamily: 'monospace',
      fontSize: '12px', background: '#111', color: '#eee',
      border: '1px solid #333', borderRadius: '6px', padding: '6px'
    });
    return el;
  }

  function refreshPanel() {
    const panel = document.getElementById('presetPanel');
    if (!panel) return;

    const mods = loadMods();

    // List
    const listWrap = document.getElementById('modListWrap');
    listWrap.innerHTML = '';
    if (mods.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'No mods added yet.';
      empty.style.opacity = '0.8';
      listWrap.appendChild(empty);
    } else {
      for (const m of mods) {
        const row = document.createElement('div');
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '1fr auto';
        row.style.alignItems = 'center';
        row.style.gap = '6px';
        row.style.padding = '4px 0';
        const info = document.createElement('div');
        info.innerHTML = `<div><b>${escapeHtml(m.name || '')}</b></div>
                              <div style="opacity:.8">ID: ${escapeHtml(m.modId)}</div>`;
        const rm = document.createElement('button');
        rm.textContent = 'Remove';
        Object.assign(rm.style, smallBtnStyle('#dc3545'));
        rm.addEventListener('click', () => removeMod(m.modId));
        row.append(info, rm);
        listWrap.appendChild(row);
        const hr = document.createElement('hr');
        hr.style.border = 'none'; hr.style.borderTop = '1px solid #2b2b2b';
        listWrap.appendChild(hr);
      }
      if (listWrap.lastChild && listWrap.lastChild.tagName === 'HR') listWrap.removeChild(listWrap.lastChild);
    }

    // JSON view
    const jsonArea = document.getElementById('modJsonView');
    jsonArea.value = JSON.stringify(mods, null, 2);

    // STRING view
    const ids = mods.map(m => m.modId).filter(Boolean);
    document.getElementById('modStringView').value = `-addon ${ids.join(', ')}`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  // Add button
  function isModPage() {
    return /\/workshop\/[0-9A-Fa-f]{16}(?:-|$)/.test(location.pathname);
  }

  function getIdFromUrl() {
    const m = location.pathname.match(/\/workshop\/([0-9A-Fa-f]{16})/);
    return m ? m[1].toUpperCase() : '';
  }

  async function ensureAddButton() {
    if (!isModPage()) return;

    // Avoid duplicates
    if (document.getElementById('addToPresetBtn')) return;

    // Wait for H1
    const h1 = await waitForElm('main h1, main section h1', 8000).catch(() => null);

    // Create button
    const addBtn = document.createElement('button');
    addBtn.id = 'addToPresetBtn';
    addBtn.textContent = 'Add to Preset';
    Object.assign(addBtn.style, smallBtnStyle('#28a745'));
    addBtn.style.fontSize = '13px';
    addBtn.style.margin = '6px 0';

    // Place near top
    const anchor = h1 || document.querySelector('main section, main');
    if (h1 && h1.parentNode) {
      h1.parentNode.insertBefore(addBtn, h1.nextSibling);
    } else if (anchor) {
      anchor.insertBefore(addBtn, anchor.firstChild);
    } else {
      document.body.insertBefore(addBtn, document.body.firstChild);
    }

    addBtn.addEventListener('click', async () => {
      addBtn.disabled = true;
      const orig = addBtn.textContent;
      try {
        const data = await scrapeModData();
        if (!data.modId) throw new Error('Mod ID not found');
        upsertMod(data);

        const deps = collectDependencies();
        let msg = 'Added!';
        if (deps.length > 0) {
          deps.forEach(d => upsertMod(d));
          msg = `Added (+${deps.length} deps)`;
        }

        addBtn.textContent = 'Added!';
        setTimeout(() => addBtn.textContent = orig, 1500);
      } catch (e) {
        console.warn(e);
        addBtn.textContent = 'Failed (see console)';
        setTimeout(() => addBtn.textContent = orig, 2000);
      } finally {
        addBtn.disabled = false;
      }
    });
  }

  async function scrapeModData() {
    const h1 = document.querySelector('main h1, main section h1');
    const name = (h1?.textContent || '').trim();

    let modId = '';
    // Try semantic pass
    document.querySelectorAll('dl, div').forEach(dl => {
      // Only inspect blocks that look like info rows
      const rows = dl.querySelectorAll(':scope > div');
      rows.forEach(div => {
        const dt = div.querySelector('dt');
        const dd = div.querySelector('dd');
        if (!dt || !dd) return;
        const label = dt.textContent.trim().toLowerCase();
        if (label === 'id') {
          const span = dd.querySelector('span');
          modId = (span ? span.textContent : dd.textContent).trim();
        }
      });
    });

    // Fallbacks
    if (!modId) modId = getIdFromUrl();
    // Normalize
    modId = (modId || '').toUpperCase();

    return { modId, name };
  }

  // Dependencies
  function xpevalFirst(xpath) {
    try {
      return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    } catch { return null; }
  }

  // Try the user-given container first
  function findDependenciesContainer() {
    const exact = xpevalFirst('/html/body/div[1]/div/main/div/section/div[2]/div[2]/section/div');
    return exact;
  }

  function collectDependencies() {
    const container = findDependenciesContainer();
    if (!container) return [];

    const anchors = Array.from(container.querySelectorAll('a[href^="/workshop/"][href*="-"]'));
    const currentId = getIdFromUrl();
    const results = [];

    for (const a of anchors) {
      const href = a.getAttribute('href') || '';
      const m = href.match(/\/workshop\/([0-9A-Fa-f]{16})-([^/?#]+)/);
      if (!m) continue;
      const modId = m[1].toUpperCase();
      if (modId === currentId) continue; // skip self
      const slug = decodeURIComponent(m[2]);
      const name = deriveNameFromAnchor(a, slug);
      results.push({ modId, name });
    }
    return uniqBy(results, x => x.modId);
  }

  function deriveNameFromAnchor(a, slug) {
    // Prefer visible text on the dependency card/link
    let txt = (a.innerText || a.textContent || '').trim();
    if (txt) {
      // Take first non-empty line (cards often have multiple lines)
      const firstLine = txt.split('\n').map(s => s.trim()).filter(Boolean)[0];
      if (firstLine) return firstLine;
    }
    // Fallback: guess from slug: underscores -> spaces, keep hyphens (e.g., UH-60)
    let s = (slug || '').replace(/_/g, ' ');
    // Insert spaces for CamelCase boundaries: ProjectRedline -> Project Redline
    s = s.replace(/([a-z])([A-Z])/g, '$1 $2');
    return s.trim();
  }

  function uniqBy(arr, keyFn) {
    const seen = new Set();
    const out = [];
    for (const it of arr) {
      const k = keyFn(it);
      if (!seen.has(k)) { seen.add(k); out.push(it); }
    }
    return out;
  }

  // Utils
  function waitForElm(selector, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      const found = document.querySelector(selector);
      if (found) return resolve(found);

      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });

      if (timeoutMs > 0) {
        setTimeout(() => {
          obs.disconnect();
          reject(new Error(`Timeout waiting for ${selector}`));
        }, timeoutMs);
      }
    });
  }

  // Hook SPA navigation
  function hookRouting() {
    const fire = () => window.dispatchEvent(new Event('locationchange'));
    const _ps = history.pushState;
    history.pushState = function () {
      const r = _ps.apply(this, arguments);
      fire(); return r;
    };
    const _rs = history.replaceState;
    history.replaceState = function () {
      const r = _rs.apply(this, arguments);
      fire(); return r;
    };
    window.addEventListener('popstate', fire);
    window.addEventListener('locationchange', () => {
      // Attempt to add button on route change
      setTimeout(ensureAddButton, 0);
    });
  }

  // Boot
  function boot() {
    ensureUI();
    hookRouting();
    ensureAddButton();

    // Just in case
    const mo = new MutationObserver(() => {
      if (isModPage() && !document.getElementById('addToPresetBtn')) {
        clearTimeout(mo._t);
        mo._t = setTimeout(ensureAddButton, 150);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // Delay boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();