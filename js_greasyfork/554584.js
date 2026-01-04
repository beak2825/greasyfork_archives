// ==UserScript==
// @name         Stylish Search Popup + Sites Manager
// @namespace    http://tampermonkey.net/
// @version      2025.11.02
// @author       TesterTV
// @homepageURL  https://github.com/testertv/StylishSearchPopup
// @license      GPL v.3 or any later version.
// @namespace    https://greasyfork.org/ru/scripts/554584-stylish-search-popup-sites-manager
// @description  Popup under cursor (if fits), hide on click any button, preload enabled icons on page load, 5-per-row, /favicon.ico with fallback; add/remove sites in Settings. Now with "reuse existing tab", "toggle copy button", "auto-copy on select" and import/export features!
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_setClipboard
// @grant        GM.addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/554584/Stylish%20Search%20Popup%20%2B%20Sites%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/554584/Stylish%20Search%20Popup%20%2B%20Sites%20Manager.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const POPUP_ID = 'stylish-search-popup-container';
  const SETTINGS_OVERLAY_ID = 'ssp-settings-overlay';
  const SETTINGS_MODAL_ID = 'ssp-settings-modal';
  const STORAGE_KEYS = {
    enabledEngineKeys: 'ssp_enabledEngineKeys',
    engines: 'ssp_engines',
    reuseTab: 'ssp_reuseTab',
    showCopyButton: 'ssp_showCopyButton',
    autoCopyOnSelect: 'ssp_autoCopyOnSelect', // New storage key
    searchRequest: 'ssp_searchRequest',
  };

  const DEFAULT_ENGINES = [
    { key: 'google',     name: 'Google',     iconHost: 'google.com',     url: 'https://www.google.com/search?q={query}' },
    { key: 'duckduckgo', name: 'DuckDuckGo', iconHost: 'duckduckgo.com',      url: 'https://duckduckgo.com/?q={query}' },
    { key: 'startpage',  name: 'Startpage',  iconHost: 'startpage.com',   url: 'https://www.startpage.com/search?q={query}' },
	{ key: 'bing',       name: 'Bing',       iconHost: 'bing.com',        url: 'https://www.bing.com/search?q={query}' },
	{ key: 'yahoo',      name: 'Yahoo',      iconHost: 'yahoo.com',       url: 'https://search.yahoo.com/search?p={query}' },
	{ key: 'brave',     name: 'Brave',     iconHost: 'brave.com',           url: 'https://search.brave.com/search?q={query}&source=web' },
	{ key: 'yandex',     name: 'Yandex',     iconHost: 'yandex.com',           url: 'https://yandex.com/search/?text={query}' },
    { key: 'youtube',    name: 'YouTube',    iconHost: 'youtube.com',     url: 'https://www.youtube.com/results?search_query={query}' },
	{ key: 'tiktok',     name: 'TikTok',     iconHost: 'tiktok.com',      url: 'https://www.tiktok.com/search?q={query}' },
    { key: 'twitch',     name: 'Twitch',     iconHost: 'twitch.tv',       url: 'https://www.twitch.tv/search?term={query}' },
    { key: 'deepl',    name: 'Deepl (De->Ru)',    iconHost: 'deepl.com',     url: 'https://www.deepl.com/en/translator#de/ru/{query}' },
    { key: 'gtranslate',    name: 'Google Translate (Auto->Ru)',    iconHost: 'translate.google.com',     url: 'https://translate.google.com/?sl=auto&tl=ru&text={query}&op=translate' },
    { key: 'facebook',   name: 'Facebook',   iconHost: 'facebook.com',    url: 'https://www.facebook.com/search/top/?q={query}' },
    { key: 'instagram',  name: 'Instagram',  iconHost: 'instagram.com',   url: 'https://www.instagram.com/explore/search/keyword/?q={query}' },
    { key: 'x',  name: 'X',  iconHost: 'x.com',   url: 'https://x.com/search?q={query}' },
    { key: 'wikipedia',  name: 'Wikipedia',  iconHost: 'wikipedia.org',   url: 'https://www.wikipedia.org/search-redirect.php?search={query}' },
    { key: 'reddit',     name: 'Reddit',     iconHost: 'reddit.com',      url: 'https://www.reddit.com/search/?q={query}' },
    { key: 'amazon',     name: 'Amazon',     iconHost: 'amazon.com',      url: 'https://www.amazon.com/s?k={query}' },
    { key: 'temu',       name: 'Temu',       iconHost: 'temu.com',        url: 'https://www.temu.com/search_result.html?search_key={query}' },
    { key: 'ebay',       name: 'eBay',       iconHost: 'ebay.com',        url: 'https://www.ebay.com/sch/i.html?_nkw={query}' },
    { key: 'walmart',       name: 'Walmart',       iconHost: 'walmart.com',        url: 'https://www.walmart.com/search/?query={query}' },
    { key: 'aliexpress',       name: 'AliExpress',       iconHost: 'aliexpress.com',        url: 'https://www.aliexpress.com/wholesale?SearchText={query}' },
    { key: 'netflix',    name: 'Netflix',    iconHost: 'netflix.com',     url: 'https://www.netflix.com/search?q={query}' },
    { key: 'imdb',    name: 'IMDb',    iconHost: 'imdb.com',     url: 'https://www.imdb.com/find/?q={query}' },
    { key: 'kinopoisk',    name: 'Кинопоиск',    iconHost: 'kinopoisk.ru',     url: 'https://www.kinopoisk.ru/index.php?kp_query={query}' },
	{ key: 'fandom',     name: 'Fandom',     iconHost: 'fandom.com',      url: 'https://www.fandom.com/?s={query}' },
    { key: 'pinterest',  name: 'Pinterest',  iconHost: 'pinterest.com',   url: 'https://www.pinterest.com/search/pins/?q={query}' },
    { key: 'github',     name: 'GitHub',     iconHost: 'github.com',          url: 'https://github.com/search?q={query}' },
    { key: 'stackoverflow',     name: 'Stack Overflow',     iconHost: 'stackoverflow.com',          url: 'https://stackoverflow.com/search?q={query}' },
    { key: 'steam',     name: 'Steam',     iconHost: 'store.steampowered.com/',          url: 'https://store.steampowered.com/search/?term={query}' },
	{ key: 'linkedin',   name: 'LinkedIn',   iconHost: 'linkedin.com',    url: 'https://www.linkedin.com/search/results/all/?keywords={query}' },
	{ key: 'webarchives',   name: 'Web Archives',   iconHost: 'archive.org',    url: 'https://web.archive.org/web/*/{query}' },
    { key: 'rutracker',     name: 'RuTracker',     iconHost: 'rutracker.org',          url: 'https://rutracker.org/forum/tracker.php?nm={query}' },
	{ key: 'kinozal',     name: 'Кинозал.ТВ',     iconHost: 'kinozal.tv',          url: 'https://kinozal.tv/browse.php?s={query}' },
	{ key: 'rutor',     name: 'rutor',     iconHost: 'rutor.info',          url: 'https://rutor.info/search/{query}' },
  ];

  // Helpers for icons
  const buildIconUrl = (host) => `https://${host}/favicon.ico`;
  const buildFallbackIconUrl = (host) => {
    const clean = host.replace(/^www\./, '');
    return `https://icons.duckduckgo.com/ip3/${clean}.ico`;
  };

  // Load engines + enabled keys
  function validateEngines(list) {
    const seen = new Set();
    const valid = [];
    for (const e of Array.isArray(list) ? list : []) {
      if (!e || !e.key || !e.name || !e.iconHost || !e.url) continue;
      if (seen.has(e.key)) continue;
      seen.add(e.key);
      valid.push({ key: String(e.key), name: String(e.name), iconHost: String(e.iconHost), url: String(e.url) });
    }
    return valid.length ? valid : DEFAULT_ENGINES.slice();
  }

  let allEngines = validateEngines(await GM.getValue(STORAGE_KEYS.engines, DEFAULT_ENGINES));
  let enabledEngineKeys = await GM.getValue(
    STORAGE_KEYS.enabledEngineKeys,
    allEngines.map(e => e.key)
  );
  enabledEngineKeys = enabledEngineKeys.filter(k => allEngines.some(e => e.key === k));
  let reuseTabEnabled = await GM.getValue(STORAGE_KEYS.reuseTab, false);
  let showCopyButtonEnabled = await GM.getValue(STORAGE_KEYS.showCopyButton, true);
  let autoCopyOnSelectEnabled = await GM.getValue(STORAGE_KEYS.autoCopyOnSelect, false); // New setting variable

  const getEnabledEngines = () =>
    allEngines.filter(e => enabledEngineKeys.includes(e.key));

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {}
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(text);
        return true;
      }
    } catch {}
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {}
    return false;
  }

  // Icon preload
  let iconSrcMap = new Map();
  function waitForImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.onload = () => resolve(url);
      img.onerror = () => reject(url);
      img.src = url;
    });
  }
  async function preloadIconForHost(host) {
    const primary = buildIconUrl(host);
    try {
      return await waitForImage(primary);
    } catch {
      const fallback = buildFallbackIconUrl(host);
      try {
        return await waitForImage(fallback);
      } catch {
        return fallback;
      }
    }
  }
  async function preloadIcons(enginesList) {
    await Promise.all(
      enginesList.map(async (engine) => {
        const src = await preloadIconForHost(engine.iconHost);
        iconSrcMap.set(engine.key, src);
      })
    );
  }

  preloadIcons(getEnabledEngines()).catch(() => {});

  // UI helpers
  function createIconImgForEngine(engine) {
    const img = document.createElement('img');
    img.alt = engine.name;
    img.referrerPolicy = 'no-referrer';
    img.decoding = 'async';
    const preloaded = iconSrcMap.get(engine.key);
    img.src = preloaded || buildIconUrl(engine.iconHost);
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = '1';
      img.src = buildFallbackIconUrl(engine.iconHost);
    });
    return img;
  }

  function slugify(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'site';
  }
  function generateUniqueKey(base, existingKeys) {
    let key = slugify(base);
    if (!key) key = 'site';
    let out = key;
    let i = 2;
    const set = new Set(existingKeys);
    while (set.has(out)) {
      out = `${key}-${i++}`;
    }
    return out;
  }
  function normalizeHost(input) {
    const s = String(input || '').trim();
    if (!s) return '';
    try {
      const u = /^https?:\/\//i.test(s) ? new URL(s) : new URL(`https://${s}`);
      return u.hostname;
    } catch {
      return s.replace(/^https?:\/\//i, '').split('/')[0];
    }
  }

  async function saveAll(engines, enabledKeys, reuseTab, showCopy, autoCopy) {
    allEngines = engines.slice();
    enabledEngineKeys = enabledKeys.filter(k => allEngines.some(e => e.key === k));
    reuseTabEnabled = !!reuseTab;
    showCopyButtonEnabled = !!showCopy;
    autoCopyOnSelectEnabled = !!autoCopy; // Save new setting state

    await GM.setValue(STORAGE_KEYS.engines, allEngines);
    await GM.setValue(STORAGE_KEYS.enabledEngineKeys, enabledEngineKeys);
    await GM.setValue(STORAGE_KEYS.reuseTab, reuseTabEnabled);
    await GM.setValue(STORAGE_KEYS.showCopyButton, showCopyButtonEnabled);
    await GM.setValue(STORAGE_KEYS.autoCopyOnSelect, autoCopyOnSelectEnabled); // Persist new setting

    iconSrcMap.clear();
    await preloadIcons(allEngines.filter(e => enabledEngineKeys.includes(e.key)));
  }

  GM_addStyle(`
    #${POPUP_ID} {
      --tile: 34px;
      --gap: 6px;
      --maxCols: 5;

      position: absolute;
      z-index: 999999999;
      background-color: rgba(40, 42, 54, 0.95);
      border-radius: 8px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 6px;
      gap: var(--gap);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.1);

      width: max-content;
      max-width: calc(var(--tile) * var(--maxCols) + var(--gap) * (var(--maxCols) - 1));
    }
    #${POPUP_ID}.visible { opacity: 1; transform: translateY(0); }

    #${POPUP_ID} a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--tile);
      height: var(--tile);
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      transition: all 0.2s ease;
      cursor: pointer;
      user-select: none;
      flex: 0 0 var(--tile);
    }
    #${POPUP_ID} a:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    #${POPUP_ID} img {
      width: 18px;
      height: 18px;
      object-fit: contain;
      border-radius: 2px;
    }
    #${POPUP_ID} .ssp-settings-btn,
    #${POPUP_ID} .ssp-copy-btn {
      font-size: 18px;
      line-height: 1;
      color: #fff;
      font-family: system-ui, sans-serif;
    }

    /* Settings modal */
    #${SETTINGS_OVERLAY_ID} {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #${SETTINGS_MODAL_ID} {
      width: min(780px, 95vw);
      max-height: 85vh;
      overflow: auto;
      background: #1e1f25;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      padding: 16px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    }
    #${SETTINGS_MODAL_ID} h2 { margin: 0 0 10px; font-size: 18px; }
    #${SETTINGS_MODAL_ID} .ssp-top {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
    }
    #${SETTINGS_MODAL_ID} .ssp-muted { opacity: 0.75; }
    #${SETTINGS_MODAL_ID} .ssp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 10px; margin: 12px 0;
    }
    #${SETTINGS_MODAL_ID} .ssp-item {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      padding: 8px; background: rgba(255,255,255,0.07); border-radius: 8px;
    }
    #${SETTINGS_MODAL_ID} .ssp-item label {
      display: flex; align-items: center; gap: 8px; cursor: pointer; width: 100%;
      flex: 1;
    }
    #${SETTINGS_MODAL_ID} .ssp-item img { width: 18px; height: 18px; border-radius: 3px; }
    #${SETTINGS_MODAL_ID} .ssp-row-actions { display: flex; gap: 6px; }
    #${SETTINGS_MODAL_ID} .ssp-icon-btn {
      border: 0; padding: 6px; border-radius: 6px; font-weight: 600; cursor: pointer;
      background: #2e303b; color: #fff; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
    }
    #${SETTINGS_MODAL_ID} .ssp-icon-btn:hover { background: #3a3d4a; }

    #${SETTINGS_MODAL_ID} .ssp-actions { display: flex; gap: 8px; justify-content: space-between; margin-top: 12px; align-items: flex-end; }
    #${SETTINGS_MODAL_ID} .ssp-actions-right { display: flex; gap: 8px; }
    #${SETTINGS_MODAL_ID} button { border: 0; padding: 8px 12px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    #${SETTINGS_MODAL_ID} .ssp-btn { background: #2e303b; color: #fff; }
    #${SETTINGS_MODAL_ID} .ssp-btn:hover { background: #3a3d4a; }
    #${SETTINGS_MODAL_ID} .ssp-primary { background: #4c7cf3; color: #fff; }
    #${SETTINGS_MODAL_ID} .ssp-primary:hover { background: #3f6be0; }
    #${SETTINGS_MODAL_ID} .ssp-options-label {
        display: flex; align-items: center; gap: 8px; cursor: pointer;
    }
    #${SETTINGS_MODAL_ID} .ssp-btn-group { display: flex; gap: 8px; }
    #${SETTINGS_MODAL_ID} .ssp-actions-left { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }

    /* Editor overlay inside settings */
    #${SETTINGS_MODAL_ID} .ssp-editor {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      display: none; align-items: center; justify-content: center;
    }
    #${SETTINGS_MODAL_ID} .ssp-editor.visible { display: flex; }
    #${SETTINGS_MODAL_ID} .ssp-editor-card {
      background: #1f212a; color: #fff; border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px; padding: 14px; width: min(520px, 95vw);
    }
    #${SETTINGS_MODAL_ID} .ssp-form { display: flex; flex-direction: column; gap: 10px; }
    #${SETTINGS_MODAL_ID} .ssp-form label span { display: block; margin-bottom: 4px; opacity: 0.8; font-size: 12px; }
    #${SETTINGS_MODAL_ID} .ssp-form input {
      width: 100%; padding: 8px; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.15); background: #2b2d38; color: #fff;
    }
    #${SETTINGS_MODAL_ID} .ssp-form .hint { font-size: 12px; opacity: 0.7; }
    #${SETTINGS_MODAL_ID} .ssp-form .editor-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 6px; }
  `);

  let popup = null;
  let searchRequestPending = null;

  function positionPopupAtCursor(popupEl, pageX, pageY) {
    const margin = 10;
    const offsetBelow = 12;
    const offsetAbove = 8;

    const popupW = popupEl.offsetWidth;
    const popupH = popupEl.offsetHeight;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;

    const clientX = pageX - scrollX;
    const clientY = pageY - scrollY;

    // Horizontal: center, keep inside viewport
    let left = pageX - popupW / 2;
    left = Math.max(scrollX + margin, Math.min(left, scrollX + viewportW - popupW - margin));

    // Vertical: prefer below, else above, else clamp
    const belowTop = pageY + offsetBelow;
    const belowBottomClient = clientY + offsetBelow + popupH;

    let top;
    if (belowBottomClient <= viewportH - margin) {
      top = belowTop;
    } else {
      const aboveTop = pageY - popupH - offsetAbove;
      const aboveTopClient = clientY - popupH - offsetAbove;
      if (aboveTopClient >= margin) {
        top = aboveTop;
      } else {
        top = Math.max(scrollY + margin, Math.min(pageY - popupH / 2, scrollY + viewportH - popupH - margin));
      }
    }

    popupEl.style.left = `${left}px`;
    popupEl.style.top = `${top}px`;
  }

  function createPopup(x, y, selectedText) {
    hidePopup();
    popup = document.createElement('div');
    popup.id = POPUP_ID;

    // Copy
    if (showCopyButtonEnabled) {
      const copyBtn = document.createElement('a');
      copyBtn.className = 'ssp-copy-btn';
      copyBtn.title = 'Copy to clipboard';
      copyBtn.textContent = '📋';
      copyBtn.addEventListener('mousedown', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await copyToClipboard(selectedText);
        hidePopup();
      });
      popup.appendChild(copyBtn);
    }

    // Engines
    const enginesToShow = getEnabledEngines();
    enginesToShow.forEach(engine => {
      const button = document.createElement('a');
      button.title = `Open in ${engine.name}`;
      const img = createIconImgForEngine(engine);
      button.appendChild(img);

      button.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const query = encodeURIComponent(selectedText);
        const searchUrl = engine.url.replace('{query}', query);

        if (reuseTabEnabled) {
          const requestId = Date.now();
          searchRequestPending = requestId;

          GM.setValue(STORAGE_KEYS.searchRequest, {
            url: searchUrl,
            host: engine.iconHost,
            id: requestId,
          });

          setTimeout(() => {
            if (searchRequestPending === requestId) {
              GM_openInTab(searchUrl, { active: true });
              searchRequestPending = null;
            }
          }, 300);

        } else {
          GM_openInTab(searchUrl, { active: true });
        }

        hidePopup();
      });
      popup.appendChild(button);
    });

    // Settings
    const settingsBtn = document.createElement('a');
    settingsBtn.className = 'ssp-settings-btn';
    settingsBtn.title = 'Settings';
    settingsBtn.textContent = '⚙️';
    settingsBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hidePopup();
      openSettingsModal();
    });
    popup.appendChild(settingsBtn);

    document.body.appendChild(popup);
    positionPopupAtCursor(popup, x, y);
    setTimeout(() => popup.classList.add('visible'), 10);
  }

  function hidePopup() {
    const existingPopup = document.getElementById(POPUP_ID);
    if (existingPopup) {
      existingPopup.classList.remove('visible');
      setTimeout(() => existingPopup?.remove(), 200);
    }
    popup = null;
  }

  function openSettingsModal() {
    closeSettingsModal();

    const overlay = document.createElement('div');
    overlay.id = SETTINGS_OVERLAY_ID;

    const modal = document.createElement('div');
    modal.id = SETTINGS_MODAL_ID;

    const top = document.createElement('div');
    top.className = 'ssp-top';
    top.innerHTML = `
      <h2>Stylish Search — Settings</h2>
      <div class="ssp-muted">Enable/disable, add or remove sites</div>
    `;

    const actionsHeader = document.createElement('div');
    actionsHeader.className = 'ssp-actions';
    const leftSide = document.createElement('div');
    const rightSide = document.createElement('div');
    rightSide.className = 'ssp-actions-right';

    const btnAddSite = document.createElement('button');
    btnAddSite.className = 'ssp-primary';
    btnAddSite.textContent = 'Add site';

    const btnSelectAll = document.createElement('button');
    btnSelectAll.className = 'ssp-btn';
    btnSelectAll.textContent = 'Select all';

    const btnSelectNone = document.createElement('button');
    btnSelectNone.className = 'ssp-btn';
    btnSelectNone.textContent = 'Clear all';

    rightSide.append(btnAddSite, btnSelectAll, btnSelectNone);
    actionsHeader.append(leftSide, rightSide);

    const grid = document.createElement('div');
    grid.className = 'ssp-grid';

    // Editor overlay (in-modal)
    const editorOverlay = document.createElement('div');
    editorOverlay.className = 'ssp-editor';
    const editorCard = document.createElement('div');
    editorCard.className = 'ssp-editor-card';
    editorOverlay.appendChild(editorCard);

    // Work on copies until Save is clicked
    let workingEngines = allEngines.map(e => ({ ...e }));
    let workingEnabledSet = new Set(enabledEngineKeys);

    function renderGrid() {
      grid.innerHTML = '';
      const currentlyEnabled = workingEnabledSet;

      workingEngines.forEach(engine => {
        const item = document.createElement('div');
        item.className = 'ssp-item';

        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = currentlyEnabled.has(engine.key);
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) currentlyEnabled.add(engine.key);
          else currentlyEnabled.delete(engine.key);
        });

        const img = createIconImgForEngine(engine);
        const span = document.createElement('span');
        span.textContent = engine.name;

        label.append(checkbox, img, span);

        const rowActions = document.createElement('div');
        rowActions.className = 'ssp-row-actions';
        const editBtn = document.createElement('button');
        editBtn.className = 'ssp-icon-btn';
        editBtn.title = 'Edit';
        editBtn.textContent = '✏️';
        editBtn.addEventListener('click', () => openEngineEditor(engine));

        const delBtn = document.createElement('button');
        delBtn.className = 'ssp-icon-btn';
        delBtn.title = 'Delete';
        delBtn.textContent = '🗑️';
        delBtn.addEventListener('click', () => {
          if (!confirm(`Delete "${engine.name}"?`)) return;
          workingEngines = workingEngines.filter(e => e.key !== engine.key);
          currentlyEnabled.delete(engine.key);
          renderGrid();
        });

        rowActions.append(editBtn, delBtn);
        item.append(label, rowActions);
        grid.appendChild(item);
      });
    }

    function openEngineEditor(engine) {
      editorCard.innerHTML = '';
      const isEdit = !!engine;
      const title = document.createElement('h3');
      title.textContent = isEdit ? 'Edit site' : 'Add site';
      title.style.margin = '0 0 8px';

      const form = document.createElement('div');
      form.className = 'ssp-form';

      const nameWrap = document.createElement('label');
      nameWrap.innerHTML = `<span>Name</span>`;
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'e.g., Stack Overflow';
      nameInput.value = isEdit ? engine.name : '';
      nameWrap.appendChild(nameInput);

      const hostWrap = document.createElement('label');
      hostWrap.innerHTML = `<span>Icon host (used for /favicon.ico)</span>`;
      const hostInput = document.createElement('input');
      hostInput.type = 'text';
      hostInput.placeholder = 'e.g., stackoverflow.com';
      hostInput.value = isEdit ? engine.iconHost : '';
      hostWrap.appendChild(hostInput);

      const urlWrap = document.createElement('label');
      urlWrap.innerHTML = `<span>Search URL (use {query})</span>`;
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.placeholder = 'e.g., https://stackoverflow.com/search?q={query}';
      urlInput.value = isEdit ? engine.url : '';
      urlWrap.appendChild(urlInput);

      const hint = document.createElement('div');
      hint.className = 'hint';
      hint.textContent = 'Example: https://example.com/search?q={query}';

      const editorActions = document.createElement('div');
      editorActions.className = 'editor-actions';

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'ssp-btn';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => {
        editorOverlay.classList.remove('visible');
      });

      const saveBtn = document.createElement('button');
      saveBtn.className = 'ssp-primary';
      saveBtn.textContent = 'Save';
      saveBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const iconHostRaw = hostInput.value.trim();
        const iconHost = normalizeHost(iconHostRaw);
        const url = urlInput.value.trim();

        if (!name) return alert('Name is required');
        if (!iconHost) return alert('Icon host is required');
        if (!url || !url.includes('{query}')) return alert('URL must contain {query} placeholder');

        if (isEdit) {
          const idx = workingEngines.findIndex(e => e.key === engine.key);
          if (idx !== -1) {
            workingEngines[idx] = { ...workingEngines[idx], name, iconHost, url };
          }
          preloadIcons([{ key: engine.key, iconHost }]).catch(() => {});
        } else {
          const key = generateUniqueKey(iconHost || name, workingEngines.map(e => e.key));
          const newEngine = { key, name, iconHost, url };
          workingEngines.push(newEngine);
          workingEnabledSet.add(key);
          preloadIcons([newEngine]).catch(() => {});
        }

        renderGrid();
        editorOverlay.classList.remove('visible');
      });

      editorActions.append(cancelBtn, saveBtn);
      form.append(nameWrap, hostWrap, urlWrap, hint, editorActions);
      editorCard.append(title, form);
      editorOverlay.classList.add('visible');
    }

    // Controls
    btnAddSite.addEventListener('click', () => openEngineEditor(null));
    btnSelectAll.addEventListener('click', () => {
      workingEngines.forEach(e => workingEnabledSet.add(e.key));
      renderGrid();
    });
    btnSelectNone.addEventListener('click', () => {
      workingEnabledSet.clear();
      renderGrid();
    });

    const actionsFooter = document.createElement('div');
    actionsFooter.className = 'ssp-actions';

    const footerLeft = document.createElement('div');
    footerLeft.className = 'ssp-actions-left';

    const optionsWrapper = document.createElement('div');
    optionsWrapper.style.display = 'flex';
    optionsWrapper.style.flexDirection = 'column';
    optionsWrapper.style.gap = '8px';

    const reuseTabLabel = document.createElement('label');
    reuseTabLabel.className = 'ssp-options-label';
    const reuseTabCheckbox = document.createElement('input');
    reuseTabCheckbox.type = 'checkbox';
    reuseTabCheckbox.checked = reuseTabEnabled;
    reuseTabLabel.append(reuseTabCheckbox, 'Open in existing tab (if open)');

    const showCopyLabel = document.createElement('label');
    showCopyLabel.className = 'ssp-options-label';
    const showCopyCheckbox = document.createElement('input');
    showCopyCheckbox.type = 'checkbox';
    showCopyCheckbox.checked = showCopyButtonEnabled;
    showCopyLabel.append(showCopyCheckbox, "Show 'Copy' button");

    const autoCopyOnSelectLabel = document.createElement('label');
    autoCopyOnSelectLabel.className = 'ssp-options-label';
    const autoCopyOnSelectCheckbox = document.createElement('input');
    autoCopyOnSelectCheckbox.type = 'checkbox';
    autoCopyOnSelectCheckbox.checked = autoCopyOnSelectEnabled;
    autoCopyOnSelectLabel.append(autoCopyOnSelectCheckbox, "Auto-copy selected text");

    optionsWrapper.append(reuseTabLabel, showCopyLabel, autoCopyOnSelectLabel);

    const importExportGroup = document.createElement('div');
    importExportGroup.className = 'ssp-btn-group';
    importExportGroup.style.marginTop = '10px';

    const btnImport = document.createElement('button');
    btnImport.className = 'ssp-btn';
    btnImport.textContent = 'Import';
    btnImport.addEventListener('click', handleImport);

    const btnExport = document.createElement('button');
    btnExport.className = 'ssp-btn';
    btnExport.textContent = 'Export';
    btnExport.addEventListener('click', handleExport);

    importExportGroup.append(btnImport, btnExport);
    footerLeft.append(optionsWrapper, importExportGroup);

    function handleExport() {
      const settingsToExport = {
        version: 1,
        engines: allEngines,
        enabledEngineKeys: enabledEngineKeys,
        reuseTab: reuseTabEnabled,
        showCopyButton: showCopyButtonEnabled,
        autoCopyOnSelect: autoCopyOnSelectEnabled,
      };
      const dataStr = JSON.stringify(settingsToExport, null, 2);
      const blob = new Blob([dataStr], {type: "application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stylish-search-settings.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function handleImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    if (!imported || !Array.isArray(imported.engines) || !Array.isArray(imported.enabledEngineKeys)) {
                        throw new Error('Invalid file structure.');
                    }

                    workingEngines = validateEngines(imported.engines);
                    workingEnabledSet = new Set(imported.enabledEngineKeys);
                    reuseTabCheckbox.checked = !!imported.reuseTab;
                    showCopyCheckbox.checked = typeof imported.showCopyButton === 'boolean' ? imported.showCopyButton : true;
                    autoCopyOnSelectCheckbox.checked = typeof imported.autoCopyOnSelect === 'boolean' ? imported.autoCopyOnSelect : false;

                    renderGrid();
                    alert('Settings loaded. Click "Save" to apply the changes.');
                } catch (err) {
                    alert(`Error importing settings: ${err.message}`);
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }


    const footerRight = document.createElement('div');
    footerRight.className = 'ssp-actions-right';

    const btnCancel = document.createElement('button');
    btnCancel.className = 'ssp-btn';
    btnCancel.textContent = 'Cancel';
    btnCancel.addEventListener('click', closeSettingsModal);

    const btnSave = document.createElement('button');
    btnSave.className = 'ssp-primary';
    btnSave.textContent = 'Save';
    btnSave.addEventListener('click', async () => {
      const reuseTab = reuseTabCheckbox.checked;
      const showCopy = showCopyCheckbox.checked;
      const autoCopy = autoCopyOnSelectCheckbox.checked;
      await saveAll(workingEngines, Array.from(workingEnabledSet), reuseTab, showCopy, autoCopy);
      closeSettingsModal();
    });

    footerRight.append(btnCancel, btnSave);
    actionsFooter.append(footerLeft, footerRight);

    modal.append(top, actionsHeader, grid, actionsFooter, editorOverlay);
    overlay.appendChild(modal);

    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay) closeSettingsModal();
    });

    document.body.appendChild(overlay);
    renderGrid();
  }

  function closeSettingsModal() {
    const existing = document.getElementById(SETTINGS_OVERLAY_ID);
    if (existing) existing.remove();
  }

  document.addEventListener('mouseup', function (e) {
    if (e.target.closest(`#${POPUP_ID}`)) return;

    setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (autoCopyOnSelectEnabled && selectedText.length > 0) {
        copyToClipboard(selectedText);
      }

      if (selectedText.length > 2) {
        createPopup(e.pageX, e.pageY, selectedText);
      } else {
        hidePopup();
      }
    }, 50);
  });

  document.addEventListener('mousedown', function (e) {
    if (!e.target.closest(`#${POPUP_ID}`)) hidePopup();
  });

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Stylish Search: Settings', openSettingsModal);
  }

  // Inter-tab communication
  let lastProcessedRequestId = null;
  GM.addValueChangeListener(STORAGE_KEYS.searchRequest, (key, oldValue, newValue, remote) => {
      if (!newValue || !remote || newValue.id === lastProcessedRequestId) {
          return;
      }

      const targetHost = newValue.host;
      const currentHost = location.hostname;

      if (currentHost === targetHost || `www.${currentHost}` === targetHost || currentHost === `www.${targetHost}`) {
          lastProcessedRequestId = newValue.id;
          GM.setValue(STORAGE_KEYS.searchRequest, { ...newValue, handled: true });
          window.location.href = newValue.url;
      }
  });

  GM.addValueChangeListener(STORAGE_KEYS.searchRequest, (key, oldValue, newValue, remote) => {
      if (newValue && newValue.id === searchRequestPending && newValue.handled) {
          searchRequestPending = null;
      }
  });

})();