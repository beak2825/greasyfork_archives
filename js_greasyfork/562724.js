// ==UserScript==
// @name         Comick Alternative Reading Sites+
// @namespace    https://greasyfork.org/users/1470715
// @version      1.6.7
// @description  Add button to show alternative reading sites for manga/manhwa
// @author       cattishly6060
// @author       ak,shh
// @match        https://comick.dev/*
// @match        https://mangafire.to/
// @match        https://mangaball.net/search-advanced/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=comick.dev
// @license      MIT
// @grant        none
// @run-at       document-end
// @compatible   android
// @downloadURL https://update.greasyfork.org/scripts/562724/Comick%20Alternative%20Reading%20Sites%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/562724/Comick%20Alternative%20Reading%20Sites%2B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // for mangafire auto search handler
  if (location.host.startsWith('mangafire')) {
    if (!location.hash.startsWith('#search:')) {
      return;
    }
    const input = document.querySelector("input[name='keyword']");
    if (input) {
      // Create spinner overlay
      createSpinnerOverlay();

      // do query search
      const query = location.hash.replace(/^#search:/, "");
      input.value = decodeURIComponent(query);
      input.dispatchEvent(new Event("change", {bubbles: true}));
      input.parentElement?.requestSubmit();
    }
    return;
  }

  // for mangaball auto search handler
  if (location.host.startsWith('mangaball')) {
    if (!location.hash.startsWith('#search:')) {
      return;
    }
    const input = document.querySelector("input#mainSearch");
    if (input) {
      // do query search
      const query = location.hash.replace(/^#search:/, "");
      input.value = decodeURIComponent(query);
      input.dispatchEvent(new Event("change", {bubbles: true}));
      input.parentElement?.requestSubmit();
    }
    return;
  }

  /**********************************************************
   * Config
   **********************************************************/
  const DEBUG = false;
  const BTN_ID = 'alt-sites-btn';
  const INIT_DELAY = 300;
  const MAX_RETRIES = 3;

  let lastUrl = location.href;
  let initScheduled = false;

  const log = (...a) => DEBUG && console.log('[ALT]', ...a);

  /**********************************************************
   * Utils
   **********************************************************/
  function getMangaName() {

    let title;
    const pathCount = location.pathname.split('/')?.filter(Boolean)?.length || 0;

    if (pathCount >= 3) {
      const script = document.getElementById("__MALSYNC__");
      const data = JSON.parse(script?.textContent || "{}");
      const title = data?.md_comic?.title?.trim();
      if (title) return title;
    }

    if (pathCount >= 3) {
      title = document.querySelector("#__next > main > div.pl-safe > div.flex.flex-col.xl\\:flex-row-reverse.justify-between.\\35 xl\\:justify-center.relative > div.info-reader-container.relative.flex-none > div > div > div:nth-child(1) > div > div > a")?.textContent;
      if (title) return title;
    }

    if (pathCount >= 3) {
      const searchText = document.querySelector("#images-reader-container button div")?.textContent?.trim() || "";
      const match = searchText.match(/^Search\s+Ch\.\s*[^ ]+\s+(.+?)(?:\s*\(.*\))?$/);
      const title = match?.[1];
      if (title) return title;
    }

    if (pathCount < 3) {
      title = document.querySelector('meta[property="og:title"]')?.content?.trim()
        || document.querySelector('main h1')?.textContent?.trim();
      if (title) return title;
    }

    const match = location.pathname.match(/\/comic\/([^\/]+)/);
    if (!match) return null;

    return match[1]
      .replace(/00/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function formatMangaName(name) {
    return name
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function getFavicon(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  }

  function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (!btn) return;
      const old = btn.textContent;
      btn.textContent = '✅ Copied';
      setTimeout(() => (btn.textContent = old), 1200);
    }).catch(() => {
      // Fallback for older Android WebView
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  }

  function injectScrollbarStyle() {
    if (document.getElementById('alt-scrollbar-style')) return;

    const style = document.createElement('style');
    style.id = 'alt-scrollbar-style';
    style.textContent = `
    /* Chromium / Android */
    .alt-popup::-webkit-scrollbar {
      width: 8px;
    }

    .alt-popup::-webkit-scrollbar-track {
      background: transparent;
    }

    .alt-popup::-webkit-scrollbar-thumb {
      background-color: rgba(120,120,120,0.4);
      border-radius: 8px;
      border: 2px solid transparent;
      background-clip: content-box;
    }

    .alt-popup:hover::-webkit-scrollbar-thumb {
      background-color: rgba(120,120,120,0.65);
    }

    /* Firefox */
    .alt-popup {
      scrollbar-width: thin;
      scrollbar-color: rgba(120,120,120,0.6) transparent;
    }

    /* Dark mode tweak */
    .dark .alt-popup::-webkit-scrollbar-thumb {
      background-color: rgba(180,180,180,0.4);
    }

    .dark .alt-popup:hover::-webkit-scrollbar-thumb {
      background-color: rgba(180,180,180,0.65);
    }
  `;
    document.head.appendChild(style);
  }

  /**********************************************************
   * Popup
   **********************************************************/
  function createPopup(rawName) {
    const displayName = formatMangaName(rawName);
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const isDark =
      document.documentElement.classList.contains('dark') ||
      document.body.classList.contains('dark');

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,.7);
      z-index:10000; display:flex;
      align-items:${isMobile ? 'flex-end' : 'center'};
      justify-content:center;
    `;

    const popup = document.createElement('div');
    popup.style.cssText = `
      background:${isDark ? '#1F2937' : '#fff'};
      color:${isDark ? '#D1D5DB' : '#333'};
      width:${isMobile ? '100%' : '90%'};
      max-width:600px;
      max-height:90vh;
      overflow:auto;
      border-radius:${isMobile ? '20px 20px 0 0' : '12px'};
      padding:24px;
      position:relative;
    `;

    const close = document.createElement('button');
    close.textContent = '×';
    close.style.cssText = `
      position:absolute; top:10px; right:14px;
      font-size:30px; background:none; border:none;
      color:${isDark ? '#9CA3AF' : '#666'};
      cursor:pointer;
    `;

    close.onclick = () => {
      document.body.style.overflow = '';
      overlay.remove();
    };

    popup.innerHTML += `
      <h2>Alternative Reading Sites</h2>
      <div style="opacity:.7;font-style:italic;margin-bottom:16px">
        "${displayName}"
      </div>
    `;

    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy Manga Name';
    copyBtn.style.cssText = `
      padding: 10px 14px;
      margin-bottom: 16px;
      border-radius: 8px;
      border: 1px solid ${isDark ? '#4B5563' : '#D1D5DB'};
      background: ${isDark ? '#374151' : '#FFFFFF'};
      color: ${isDark ? '#E5E7EB' : '#374151'};
      cursor: pointer;
      font-size: 14px;
    `;

    copyBtn.onclick = e => {
      e.stopPropagation();
      copyText(displayName, copyBtn);
    };

    // TODO: removed
    // popup.appendChild(copyBtn);

    // url encoder
    const e = (name, removeHyphen = true) => {
      if (removeHyphen) {
        name = name.replace(/-/g, ' ');
      }
      return encodeURIComponent(name);
    }

    // query
    const q = rawName;

    const sites = [
      ['Comix', `https://comix.to/browser?keyword=${e(q)}&order=relevance:desc`, 'https://static.everythingmoe.com/icons/comix.png'],
      ['MangaFire', `https://mangafire.to/#search:${e(q)}`],
      ['WeebCentral', `https://weebcentral.com/search?text=${e(q)}`],
      ['MangaKatana', `https://mangakatana.com/?search=${e(q)}&search_by=book_name`],
      ['MangaTaro', `https://mangataro.org/?s=${e(q, false)}`],
      ['MangaDex', `https://mangadex.org/search?q=${e(q)}`],
      ['Atsu', `https://atsu.moe/search?query=${e(q)}`],
      ['Mangaball', `https://mangaball.net/search-advanced/#search:${e(q, false)}`],
      ['MangaBuddy', `https://mangabuddy.com/search?q=${e(q)}`],
      ['Mangago', `https://www.mangago.me/r/l_search/?name=${e(q)}`],
      ['VyManga', `https://vymanga.com/search?q=${e(q)}`],
    ];

    sites.forEach(([name, url, optIcon]) => {
      const icon = document.createElement('img');
      icon.src = optIcon || getFavicon(url);
      icon.alt = '';
      icon.loading = 'lazy';
      icon.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 4px;
        flex-shrink: 0;
      `;

      const label = document.createElement('span');
      label.textContent = name;

      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        margin-bottom: 10px;
        border-radius: 8px;
        background: ${isDark ? '#374151' : '#f5f5f5'};
        color: ${isDark ? '#E5E7EB' : '#333'};
        text-decoration: none;
      `;
      a.append(icon, label);
      a.addEventListener('click', e => {
        e.stopPropagation();
      });

      popup.appendChild(a);
    });

    popup.appendChild(close);

    const bottomCloseBtn = document.createElement('button');
    bottomCloseBtn.textContent = 'Close';
    bottomCloseBtn.style.cssText = `
      margin-top: 10px;
      margin-bottom: 10px;
      width: 100%;
      padding: 16px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      border: none;
      cursor: pointer;

      background: ${isDark ? '#3B82F6' : '#2563EB'};
      color: #FFFFFF;

      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
    `;

    bottomCloseBtn.onclick = e => {
      close.click();
    };

    popup.appendChild(bottomCloseBtn);

    injectScrollbarStyle();
    popup.classList.add('alt-popup');

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.onclick = e => e.target === overlay && close.onclick();
  }

  /**********************************************************
   * Button
   **********************************************************/
  function createButton(isMobile = false, addMarginLeft = true) {
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.textContent = isMobile ? '🔍' : '🔍 Find Alternative Sites';
    btn.style.cssText = `
      padding: ${isMobile ? '10px' : '12px 20px'};
      border-radius:8px;
      border:1px solid #ccc;
      cursor:pointer;
      margin-left:${addMarginLeft ? '8' : '0'}px;
    `;

    btn.onclick = () => {
      const name = getMangaName();
      if (name) createPopup(name);
    };

    return btn;
  }

  function tryInsertButton() {
    if (document.getElementById(BTN_ID)) return true;

    const candidates = document.querySelectorAll('a[class*="btn-primary"], button[class*="btn-primary"], #images-reader-container button');

    for (let el of candidates) {
      const t = el.textContent || '';
      if (
        t.startsWith('Start Reading') ||
        t.startsWith('Start Tracking') ||
        t.startsWith('Continue') ||
        t.startsWith('Read')
      ) {
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        el.parentElement?.classList.remove('md:max-w-md', 'xl:max-w-xl');
        el.parentElement?.appendChild(createButton(isMobile));
        log('Button inserted');
        return true;

      } else if (t.startsWith('Search')) {
        el = el?.parentElement || el;
        el.parentElement?.appendChild(createButton(false, false));
        log('Button inserted (2)');
        return true;
      }
    }
    return false;
  }

  /**********************************************************
   * SPA handling (efficient)
   **********************************************************/
  function scheduleInit() {
    if (initScheduled) return;
    initScheduled = true;
    setTimeout(() => {
      initScheduled = false;
      init();
    }, INIT_DELAY);
  }

  function init() {
    if (!location.pathname.startsWith('/comic/')) return;

    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (tryInsertButton() || attempts >= MAX_RETRIES) {
        clearInterval(timer);
      }
    }, 200);
  }

  // History hook
  (() => {
    const push = history.pushState;
    const replace = history.replaceState;

    const onChange = () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        scheduleInit();
      }
    };

    history.pushState = function () {
      push.apply(this, arguments);
      onChange();
    };
    history.replaceState = function () {
      replace.apply(this, arguments);
      onChange();
    };
    window.addEventListener('popstate', onChange);
  })();

  // Lightweight observer (only main content)
  const mainObserver = new MutationObserver(scheduleInit);
  mainObserver.observe(document.body, {childList: true, subtree: false});

  // Initial run
  scheduleInit();

  /**
   * **********************
   * elements
   * **********************
   */
  function createSpinnerOverlay() {
    // Create spinner overlay
    const spinnerOverlay = document.createElement('div');
    spinnerOverlay.style.position = 'fixed';
    spinnerOverlay.style.top = 0;
    spinnerOverlay.style.left = 0;
    spinnerOverlay.style.width = '100%';
    spinnerOverlay.style.height = '100%';
    spinnerOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    spinnerOverlay.style.display = 'flex';
    spinnerOverlay.style.alignItems = 'center';
    spinnerOverlay.style.justifyContent = 'center';
    spinnerOverlay.style.zIndex = 9999;

    const spinner = document.createElement('div');
    spinner.style.border = '8px solid #f3f3f3';
    spinner.style.borderTop = '8px solid #3498db';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '60px';
    spinner.style.height = '60px';
    spinner.style.animation = 'spin 1s linear infinite';

    spinnerOverlay.appendChild(spinner);
    document.body.appendChild(spinnerOverlay);

    // Add keyframes for spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
      `;
    document.head.appendChild(style);
  }
})();
