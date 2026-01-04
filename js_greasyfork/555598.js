// ==UserScript==
// @name         Search Engine Quick Switcher (Mobile-friendly)
// @namespace    https://github.com/quantavil
// @version      4.1
// @description  Floating Search Engine Quick Switcher with mobile/touch support
// @author       quantavil
// @license      MIT
// @match        *://search.brave.com/search?*
// @match        *://yandex.*/search*
// @match        *://*.yandex.*/search*
// @match        *://ya.ru/search*
// @match        *://*.ya.ru/search*
// @match        *://bing.com/search?*
// @match        *://*.bing.com/search?*
// @match        *://duckduckgo.com/?*
// @match        *://*.duckduckgo.com/?*
// @match        *://google.*/search?*
// @match        *://*.google.*/search?*
// @match        *://youtube.com/results?*
// @match        *://*.youtube.com/results?*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555598/Search%20Engine%20Quick%20Switcher%20%28Mobile-friendly%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555598/Search%20Engine%20Quick%20Switcher%20%28Mobile-friendly%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PREF_KEY = 'seqs_prefs_v2';

  const ENGINES = [
    {
      key: 'brave',
      host: ['search.brave.com'],
      param: 'q',
      url: 'https://search.brave.com/search?q=',
      label: 'Brave',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><defs><linearGradient id="A" x1="-.031" y1="44.365" x2="26.596" y2="44.365" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f1562b"/><stop offset=".3" stop-color="#f1542b"/><stop offset=".41" stop-color="#f04d2a"/><stop offset=".49" stop-color="#ef4229"/><stop offset=".5" stop-color="#ef4029"/><stop offset=".56" stop-color="#e83e28"/><stop offset=".67" stop-color="#e13c26"/><stop offset="1" stop-color="#df3c26"/></linearGradient></defs><path d="M26.605 38.85l-.964-2.617.67-1.502c.086-.194.044-.42-.105-.572l-1.822-1.842a2.94 2.94 0 0 0-3.066-.712l-.5.177-2.783-3.016-4.752-.026-4.752.037-2.78 3.04-.495-.175a2.95 2.95 0 0 0-3.086.718L.304 34.237a.41.41 0 0 0-.083.456l.7 1.56-.96 2.615 3.447 13.107c.326 1.238 1.075 2.323 2.118 3.066l6.817 4.62a1.51 1.51 0 0 0 1.886 0l6.813-4.627c1.042-.743 1.8-1.828 2.115-3.066l2.812-10.752z" fill="url(#A)" transform="matrix(2.048177 0 0 2.048177 4.795481 -58.865395)"/><path d="M33.595 39.673a8.26 8.26 0 0 0-1.139-.413h-.686a8.26 8.26 0 0 0-1.139.413l-1.727.718-1.95.897-3.176 1.655c-.235.076-.4.288-.417.535s.118.48.34.586L26.458 46a21.86 21.86 0 0 1 1.695 1.346l.776.668 1.624 1.422.736.65a1.27 1.27 0 0 0 1.62 0l3.174-2.773 1.7-1.346 2.758-1.974a.6.6 0 0 0-.085-1.117l-3.17-1.6-1.96-.897zm19.555-17.77l.1-.287a7.73 7.73 0 0 0-.072-1.148c-.267-.68-.6-1.326-1.023-1.93l-1.794-2.633-1.278-1.736-2.404-3c-.22-.293-.458-.572-.713-.834h-.05l-1.068.197-5.284 1.018c-.535.025-1.07-.053-1.574-.23l-2.902-.937-2.077-.574a8.68 8.68 0 0 0-1.834 0l-2.077.58-2.902.942a4.21 4.21 0 0 1-1.574.23l-5.278-1-1.068-.197h-.05c-.256.262-.494.54-.713.834l-2.4 3a29.33 29.33 0 0 0-1.278 1.736l-1.794 2.633-.848 1.413c-.154.543-.235 1.104-.242 1.67l.1.287c.043.184.1.366.166.543l1.417 1.628 6.28 6.674a1.79 1.79 0 0 1 .318 1.794L18.178 35a3.16 3.16 0 0 0-.049 2.005l.206.565a5.45 5.45 0 0 0 1.673 2.346l.987.803c.52.376 1.2.457 1.794.215l3.508-1.673a8.79 8.79 0 0 0 1.794-1.19l2.808-2.534a1.12 1.12 0 0 0 .37-.795 1.13 1.13 0 0 0-.312-.82l-6.338-4.27a1.23 1.23 0 0 1-.386-1.556l2.458-4.62a2.4 2.4 0 0 0 .121-1.834 2.8 2.8 0 0 0-1.395-1.265l-7.706-2.9c-.556-.2-.525-.45.063-.484l4.526-.45a7.02 7.02 0 0 1 2.113.188l3.938 1.1c.578.174.94.75.843 1.346l-1.547 8.45a4.37 4.37 0 0 0-.076 1.426c.63.202.592.45 1.17.592l2.4.5a5.83 5.83 0 0 0 2.108 0l2.157-.5c.58-.13 1.103-.404 1.17-.606a4.38 4.38 0 0 0-.08-1.426l-1.556-8.45a1.21 1.21 0 0 1 .843-1.346l3.938-1.103a6.98 6.98 0 0 1 2.113-.188l4.526.422c.592.054.62.274.067.484l-7.7 2.92a2.76 2.76 0 0 0-1.395 1.265 2.41 2.41 0 0 0 .12 1.834l2.462 4.62a1.23 1.23 0 0 1-.386 1.556l-6.333 4.28a1.13 1.13 0 0 0 .058 1.615l2.812 2.534a8.89 8.89 0 0 0 1.794 1.184l3.508 1.67c.596.24 1.274.158 1.794-.22l.987-.807a5.44 5.44 0 0 0 1.673-2.35l.206-.565a3.16 3.16 0 0 0-.049-2.005l-1.032-2.436a1.8 1.8 0 0 1 .318-1.794l6.28-6.683 1.413-1.628a4.36 4.36 0 0 0 .193-.53z" fill="#fff"/></svg>'
    },
    {
      key: 'yandex',
      host: ['yandex.', 'ya.ru'],
      param: 'text',
      url: 'https://yandex.com/search?text=',
      label: 'Yandex',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" viewBox="0 0 26 26"><path fill="#F8604A" d="M26 13c0-7.18-5.82-13-13-13S0 5.82 0 13s5.82 13 13 13 13-5.82 13-13Z"></path><path fill="#fff" d="M13.353 14.343c.76 1.664 1.013 2.243 1.013 4.241v2.65h-2.714v-4.467L6.534 5.634h2.83l3.989 8.71Zm3.346-8.709-3.32 7.542h2.759l3.328-7.542h-2.767Z"></path></svg>'
    },
    {
      key: 'bing',
      host: ['bing.com'],
      param: 'q',
      url: 'https://www.bing.com/search?q=',
      label: 'Bing',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32"><path d="M6.1 0l6.392 2.25v22.5l9.004-5.198-4.414-2.07-2.785-6.932 14.186 4.984v7.246L12.497 32 6.1 28.442z" fill="#008373"/></svg>'
    },
    {
      key: 'ddg',
      host: ['duckduckgo.com'],
      param: 'q',
      url: 'https://duckduckgo.com/?q=',
      label: 'DuckDuckGo',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32"><g transform="matrix(.266667 0 0 .266667 -17.954934 -5.057333)"><circle cx="127.332" cy="78.966" r="51.15" fill="#de5833"/><defs><path id="A" d="M178.684 78.824c0 28.316-23.035 51.354-51.354 51.354-28.313 0-51.348-23.04-51.348-51.354s23.036-51.35 51.348-51.35c28.318 0 51.354 23.036 51.354 51.35z"/></defs><clipPath id="B"><use xlink:href="#A"/></clipPath><g clip-path="url(#B)"><path d="M148.293 155.158c-1.8-8.285-12.262-27.04-16.23-34.97s-7.938-19.1-6.13-26.322c.328-1.312-3.436-11.308-2.354-12.015 8.416-5.5 10.632.6 14.002-1.862 1.734-1.273 4.1 1.047 4.7-1.06 2.158-7.567-3.006-20.76-8.77-26.526-1.885-1.88-4.77-3.06-8.03-3.687-1.254-1.713-3.275-3.36-6.138-4.88-3.188-1.697-10.12-3.938-13.717-4.535-2.492-.4-3.055.287-4.12.46.992.088 5.7 2.414 6.615 2.55-.916.62-3.607-.028-5.324.742-.865.392-1.512 1.877-1.506 2.58 4.9-.496 12.574-.016 17.1 2-3.602.4-9.08.867-11.436 2.105-6.848 3.608-9.873 12.035-8.07 22.133 1.804 10.075 9.738 46.85 12.262 59.13 2.525 12.264-5.408 20.2-10.455 22.354l5.408.363-1.8 3.967c6.484.72 13.695-1.44 13.695-1.44-1.438 3.965-11.176 5.412-11.176 5.412s4.7 1.438 12.258-1.447l12.263-4.688 3.604 9.373 6.854-6.847 2.885 7.2c.014-.001 5.424-1.808 3.62-10.103z" fill="#d5d7d8"/><path d="M150.47 153.477c-1.795-8.3-12.256-27.043-16.228-34.98s-7.935-19.112-6.13-26.32c.335-1.3.34-6.668 1.43-7.38 8.4-5.494 7.812-.184 11.187-2.645 1.74-1.27 3.133-2.806 3.738-4.912 2.164-7.572-3.006-20.76-8.773-26.53-1.88-1.88-4.768-3.062-8.023-3.686-1.252-1.718-3.27-3.36-6.13-4.882-5.4-2.862-12.074-4.006-18.266-2.883 1 .1 3.256 2.138 4.168 2.273-1.38.936-5.053.815-5.03 2.896 4.916-.492 10.303.285 14.834 2.297-3.602.4-6.955 1.3-9.3 2.543-6.854 3.603-8.656 10.812-6.854 20.914 1.807 10.097 9.742 46.873 12.256 59.126 2.527 12.26-5.402 20.188-10.45 22.354l5.408.36-1.8 3.973c6.484.72 13.695-1.44 13.695-1.44-1.438 3.974-11.176 5.406-11.176 5.406s4.686 1.44 12.258-1.445l12.27-4.688 3.604 9.373 6.852-6.85 2.9 7.215c-.016.007 5.388-1.797 3.58-10.088z" fill="#fff"/><path d="M109.02 70.69c0-2.093 1.693-3.787 3.79-3.787 2.1 0 3.785 1.694 3.785 3.787s-1.695 3.786-3.785 3.786c-2.096.001-3.79-1.692-3.79-3.786z" fill="#2d4f8e"/><path d="M113.507 69.43a.98.98 0 0 1 .98-.983c.543 0 .984.438.984.983s-.44.984-.984.984c-.538.001-.98-.44-.98-.984z" fill="#fff"/><path d="M134.867 68.445c0-1.793 1.46-3.25 3.252-3.25 1.8 0 3.256 1.457 3.256 3.25 0 1.8-1.455 3.258-3.256 3.258a3.26 3.26 0 0 1-3.252-3.258z" fill="#2d4f8e"/><path d="M138.725 67.363c0-.463.38-.843.838-.843a.84.84 0 0 1 .846.843c0 .47-.367.842-.846.842a.84.84 0 0 1-.838-.842z" fill="#fff"/></g><path d="M124.4 85.295c.38-2.3 6.3-6.625 10.5-6.887 4.2-.265 5.5-.205 9-1.043s12.535-3.088 15.033-4.242c2.504-1.156 13.104.572 5.63 4.738-3.232 1.8-11.943 5.13-18.172 6.987-6.22 1.86-10-1.776-12.06 1.28-1.646 2.432-.334 5.762 7.1 6.453 10.037.93 19.66-4.52 20.72-1.625s-8.625 6.508-14.525 6.623c-5.893.1-17.77-3.896-19.555-5.137s-4.165-4.13-3.67-7.148z" fill="#fdd20a"/><path d="M128.943 115.592s-14.102-7.52-14.332-4.47c-.238 3.056 0 15.5 1.643 16.45s13.396-6.108 13.396-6.108zm5.403-.474s9.635-7.285 11.754-6.815c2.1.48 2.582 15.5.7 16.23-1.88.7-12.908-3.813-12.908-3.813z" fill="#65bc46"/><path d="M125.53 116.4c0 4.932-.7 7.05 1.4 7.52s6.104 0 7.518-.938.232-7.28-.232-8.465c-.477-1.174-8.696-.232-8.696 1.884z" fill="#43a244"/><path d="M126.426 115.292c0 4.933-.707 7.05 1.4 7.52 2.106.48 6.104 0 7.52-.938 1.4-.94.23-7.28-.236-8.466-.473-1.173-8.692-.227-8.692 1.885z" fill="#65bc46"/><circle cx="127.331" cy="78.965" r="57.5" fill="none" stroke="#de5833" stroke-width="5"/></g></svg>'
    },
    {
      key: 'youtube',
      host: ['youtube.com', 'm.youtube.com'],
      param: 'search_query',
      url: 'https://www.youtube.com/results?search_query=',
      label: 'YouTube',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M62.603 16.596a8.06 8.06 0 0 0-5.669-5.669C51.964 9.57 31.96 9.57 31.96 9.57s-20.005.04-24.976 1.397a8.06 8.06 0 0 0-5.669 5.669C0 21.607 0 32 0 32s0 10.393 1.356 15.404a8.06 8.06 0 0 0 5.669 5.669C11.995 54.43 32 54.43 32 54.43s20.005 0 24.976-1.356a8.06 8.06 0 0 0 5.669-5.669C64 42.434 64 32 64 32s-.04-10.393-1.397-15.404z" fill="red"/><path d="M25.592 41.612L42.187 32l-16.596-9.612z" fill="#fff"/></svg>'
    },
    {
      key: 'google',
      host: ['google.', 'www.google.com', 'google.com', 'm.google.com'],
      param: 'q',
      url: 'https://www.google.com/search?q=',
      label: 'Google',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262"><path fill="#4285F4" d="M255.68 133.49c0-10.87-.98-18.84-3.1-27.1H130.55v49.15h71.81c-1.45 12.3-9.29 30.84-26.67 43.27l-.24 1.6 38.72 30 .27.03c25.21-23.27 39.24-57.54 39.24-96.86"/><path fill="#34A853" d="M130.55 261.1c35.64 0 65.5-11.72 87.33-31.8l-41.62-32.24c-11.17 7.8-26.17 13.3-45.7 13.3-34.92 0-64.57-23.27-75.13-55.56l-1.55.13-40.72 31.5-.53.13C34.73 231.56 79.7 261.1 130.55 261.1"/><path fill="#FBBC05" d="M55.42 154.8c-2.8-8.26-4.41-17.1-4.41-26.31s1.61-18.05 4.41-26.3l-.07-1.76-41.25-31.9-.54.26C5.09 84.27 0 106.36 0 128.5s5.1 44.23 13.56 63.7l41.86-32.69"/><path fill="#EA4335" d="M130.55 50.5c24.82 0 41.57 10.75 51.14 19.74l37.36-36.2C196 12.81 166.19 0 130.55 0 79.7 0 34.73 29.54 13.56 64.8l41.86 32.69c10.56-32.28 40.2-56.99 75.13-56.99"/></svg>'
    }
  ];

  const ENGINE_MAP = new Map(ENGINES.map(e => [e.key, e]));

  const getDefaultPrefs = () => ({
    order: ENGINES.map(e => e.key),
    disabled: []
  });

  const loadPrefs = () => {
    try {
      const raw = typeof GM_getValue === 'function'
        ? GM_getValue(PREF_KEY, null)
        : localStorage.getItem(PREF_KEY);
      if (!raw) return getDefaultPrefs();
      const parsed = typeof raw === 'string' ? (JSON.parse(raw) || {}) : (raw || {});
      const known = new Set(ENGINES.map(e => e.key));
      let order = Array.isArray(parsed.order) ? parsed.order.filter(k => known.has(k)) : [];
      for (const k of ENGINES.map(e => e.key)) if (!order.includes(k)) order.push(k);
      const disabled = Array.isArray(parsed.disabled) ? parsed.disabled.filter(k => known.has(k)) : [];
      return { order, disabled };
    } catch {
      return getDefaultPrefs();
    }
  };

  const savePrefs = (prefs) => {
    const payload = JSON.stringify(prefs);
    if (typeof GM_setValue === 'function') {
      GM_setValue(PREF_KEY, payload);
    } else {
      localStorage.setItem(PREF_KEY, payload);
    }
  };

  const getOrderedEngines = (prefs) => prefs.order.map(k => ENGINE_MAP.get(k)).filter(Boolean);
  const getEnabledEngines = (prefs) => getOrderedEngines(prefs).filter(e => !prefs.disabled.includes(e.key));

  // Host match helper with strict boundary checks (string or array of strings)
  // Supports patterns:
  //  - exact hosts like 'www.google.com'
  //  - subdomains via '*.example.com'
  //  - TLD wildcard via 'google.' (matches google.<tld> and subdomains)
  const hostMatches = (hostname, hostField) => {
    const patterns = Array.isArray(hostField) ? hostField : [hostField];
    return patterns.some((p) => {
      if (!p) return false;
      // Wildcard subdomain pattern: '*.example.com'
      if (p.startsWith('*.')) {
        const base = p.slice(2);
        return hostname === base || hostname.endsWith(`.${base}`);
      }
      // TLD wildcard pattern: 'google.' (matches google.com, google.co.uk, etc.)
      if (p.endsWith('.')) {
        const escaped = p.replace(/\./g, '\\.');
        const re = new RegExp(`(^|\\.)${escaped}[A-Za-z0-9.-]+$`);
        return re.test(hostname);
      }
      // Exact or subdomain match
      return hostname === p || hostname.endsWith(`.${p}`);
    });
  };

  const getCurrentEngine = () => {
    const url = new URL(location.href);
    const { hostname, searchParams } = url;
    for (const engine of ENGINES) {
      if (hostMatches(hostname, engine.host)) {
        const query = searchParams.get(engine.param)?.trim();
        return query ? { engine, query } : null;
      }
    }
    return null;
  };

  const current = getCurrentEngine();
  if (!current) return;

  const switchTo = (engine) => {
    if (engine.key !== current.engine.key) {
      location.href = engine.url + encodeURIComponent(current.query);
    }
  };

  const isTouchLike = () =>
    (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || matchMedia('(pointer: coarse)').matches);

  const style = document.createElement('style');
  style.textContent = `
    :root {
      --seqs-width: 60px;
      --seqs-bg-start: #1a1a1a;
      --seqs-bg-end: #0d0d0d;
      --seqs-border: rgba(255,255,255,.08);
      --seqs-border-hover: rgba(255,255,255,.2);
      --seqs-btn-bg: rgba(255,255,255,.04);
      --seqs-btn-hover: rgba(255,255,255,.08);
      --seqs-shadow: rgba(0,0,0,.6);
      --seqs-accent: #4285f4;
      --seqs-ease: cubic-bezier(.4,0,.2,1);
    }

    .seqs-wrap {
      position: fixed;
      top: 50%;
      left: 0;
      transform: translate(calc(-1 * var(--seqs-width)), -50%);
      z-index: 2147483646;
      transition: transform .25s var(--seqs-ease);
    }
    .seqs-wrap.open { transform: translate(0, -50%); }

    /* Keep hover behavior for desktop only */
    @media (hover: hover) and (pointer: fine) {
      .seqs-wrap:not(.open):hover { transform: translate(0, -50%); }
    }

    .seqs-panel {
      width: var(--seqs-width);
      background: linear-gradient(135deg, var(--seqs-bg-start), var(--seqs-bg-end));
      border-radius: 0 12px 12px 0;
      box-shadow: 4px 0 24px var(--seqs-shadow);
      padding: 8px 0;
      border: 1px solid var(--seqs-border);
      border-left: none;
    }

    .seqs-btn {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      margin: 6px auto;
      background: var(--seqs-btn-bg);
      border: 1px solid var(--seqs-border);
      border-radius: 10px;
      cursor: pointer;
      transition: all .2s var(--seqs-ease);
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    .seqs-btn:hover {
      background: var(--seqs-btn-hover);
      border-color: var(--seqs-border-hover);
      transform: scale(1.08);
    }
    .seqs-btn.current {
      background: rgba(66,133,244,.15);
      border-color: var(--seqs-accent);
      box-shadow: 0 0 12px rgba(66,133,244,.3);
    }
    .seqs-btn.settings {
      background: rgba(255,255,255,.02);
    }
    .seqs-btn.settings:hover {
      background: rgba(255,255,255,.08);
    }

    .seqs-icon-host {
      width: 24px;
      height: 24px;
      display: block;
      pointer-events: none;
    }

    .seqs-handle {
      position: absolute;
      top: 50%;
      right: -28px;
      transform: translateY(-50%);
      width: 28px;
      height: 56px;
      background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
      border-radius: 0 8px 8px 0;
      box-shadow: 2px 0 16px var(--seqs-shadow);
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: all .2s var(--seqs-ease);
      border: 1px solid var(--seqs-border);
      border-left: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation; /* avoids ghost clicks/double-tap zoom */
    }
    .seqs-handle:hover {
      width: 32px;
      background: linear-gradient(135deg, #333, #222);
      border-color: var(--seqs-border-hover);
    }
    .seqs-handle svg {
      width: 16px;
      height: 16px;
      fill: rgba(255,255,255,.7);
      transition: fill .2s var(--seqs-ease);
      pointer-events: none;
    }
    .seqs-handle:hover svg { fill: rgba(255,255,255,.9); }

    /* Settings modal */
    .seqs-settings-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.5);
      z-index: 2147483647;
      display: grid;
      place-items: center;
    }
    .seqs-settings {
      width: min(520px, calc(100vw - 32px));
      background: #121212;
      color: #fff;
      border: 1px solid var(--seqs-border);
      border-radius: 12px;
      box-shadow: 0 12px 40px rgba(0,0,0,.6);
      overflow: hidden;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }
    .seqs-settings-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: linear-gradient(135deg, #1b1b1b, #151515);
      border-bottom: 1px solid var(--seqs-border);
    }
    .seqs-settings-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: .2px;
    }
    .seqs-settings-close {
      background: transparent;
      border: 1px solid var(--seqs-border);
      color: #ddd;
      width: 28px; height: 28px;
      border-radius: 8px;
      cursor: pointer;
      touch-action: manipulation;
    }
    .seqs-settings-body {
      padding: 12px 16px;
      max-height: min(70vh, 560px);
      overflow: auto;
    }
    .seqs-hint {
      font-size: 12px;
      color: #bbb;
      margin: 0 0 10px 0;
    }
    .seqs-engine-list { margin: 0; padding: 0; list-style: none; }
    .seqs-engine-row {
      position: relative;
      display: grid;
      grid-template-columns: 1fr auto auto; /* info | toggle | drag */
      gap: 10px;
      align-items: center;
      padding: 10px;
      border: 1px solid var(--seqs-border);
      border-radius: 10px;
      background: rgba(255,255,255,.02);
      margin-bottom: 8px;
    }
    .seqs-engine-row.drop-before::before,
    .seqs-engine-row.drop-after::after {
      content: '';
      position: absolute;
      left: 8px; right: 8px;
      height: 2px;
      background: var(--seqs-accent);
    }
    .seqs-engine-row.drop-before::before { top: -1px; }
    .seqs-engine-row.drop-after::after { bottom: -1px; }

    .seqs-engine-info {
      display: flex; align-items: center; gap: 10px;
      min-width: 0;
    }
    .seqs-engine-name { font-size: 14px; font-weight: 600; }
    .seqs-engine-badge {
      font-size: 12px; color: #bbb;
      padding: 2px 6px; border: 1px solid var(--seqs-border);
      border-radius: 999px; margin-left: 6px;
    }
    .seqs-toggle {
      display: inline-flex; align-items: center; gap: 6px; color: #ddd; font-size: 13px;
    }
    .seqs-toggle input { accent-color: var(--seqs-accent); }

    .seqs-drag {
      display: inline-grid; place-items: center;
      width: 28px; height: 28px;
      border: 1px solid var(--seqs-border);
      border-radius: 6px;
      background: var(--seqs-btn-bg);
      cursor: grab;
      user-select: none;
      touch-action: none;
    }
    .seqs-drag:hover { border-color: var(--seqs-border-hover); background: var(--seqs-btn-hover); }
    .seqs-drag:active { cursor: grabbing; }

    .seqs-settings-actions {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; border-top: 1px solid var(--seqs-border);
      background: #101010;
    }
    .seqs-settings-actions .spacer { flex: 1; }
    .seqs-settings-actions button {
      background: var(--seqs-btn-bg);
      color: #eee; border: 1px solid var(--seqs-border);
      border-radius: 8px; padding: 8px 12px; cursor: pointer;
      transition: all .2s var(--seqs-ease);
      touch-action: manipulation;
    }
    .seqs-settings-actions button:hover { background: var(--seqs-btn-hover); border-color: var(--seqs-border-hover); }
    .seqs-primary { border-color: var(--seqs-accent); }
  `;
  document.head.appendChild(style);

  const createIcon = (svgMarkup) => {
    const host = document.createElement('span');
    host.className = 'seqs-icon-host';
    const shadow = host.attachShadow({ mode: 'open' });

    const css = document.createElement('style');
    css.textContent = `svg{width:100%;height:100%;display:block;overflow:hidden;}`;
    shadow.appendChild(css);

    const tpl = document.createElement('template');
    tpl.innerHTML = svgMarkup.trim();
    const svg = tpl.content.firstElementChild;

    if (svg?.tagName.toLowerCase() === 'svg') {
      const w = parseFloat(svg.getAttribute('width')) || 64;
      const h = parseFloat(svg.getAttribute('height')) || 64;
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      if (!svg.hasAttribute('viewBox')) {
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      }
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      shadow.appendChild(svg);
    } else {
      shadow.appendChild(document.createTextNode('⚠️'));
    }
    return host;
  };

  const wrap = document.createElement('div');
  wrap.className = 'seqs-wrap';
  wrap.setAttribute('role', 'navigation');
  wrap.setAttribute('aria-label', 'Search engine switcher');

  const panel = document.createElement('div');
  panel.className = 'seqs-panel';

  const handle = document.createElement('div');
  handle.className = 'seqs-handle';
  handle.title = 'Open switcher (tap). Long-press to switch';
  handle.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`;

  const buildPanel = () => {
    const prefs = loadPrefs();
    const enabled = getEnabledEngines(prefs);
    panel.innerHTML = '';

    const display = enabled.slice();
    if (!display.some(e => e.key === current.engine.key)) {
      display.unshift(current.engine);
    }

    for (const engine of display) {
      const btn = document.createElement('button');
      btn.className = 'seqs-btn' + (engine.key === current.engine.key ? ' current' : '');
      btn.type = 'button';
      btn.title = engine.label;
      btn.appendChild(createIcon(engine.icon));
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchTo(engine);
      }, { passive: false });
      panel.appendChild(btn);
    }

    // Settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'seqs-btn settings';
    settingsBtn.type = 'button';
    settingsBtn.title = 'Settings';
    settingsBtn.innerHTML = `<span class="seqs-icon-host"></span>`;
    const sIconHost = settingsBtn.querySelector('.seqs-icon-host');
    const sShadow = sIconHost.attachShadow({ mode: 'open' });
    sShadow.innerHTML = `<style>svg{width:100%;height:100%;display:block}</style>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="rgba(255,255,255,.9)" d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.61l-1.92-3.32a.5.5 0 0 0-.57-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.5.5 0 0 0-.48-.42h-3.4a.5.5 0 0 0-.48.42l-.36 2.54c-.59.24-1.12.56-1.62.94l-2.39-.96a.5.5 0 0 0-.57.22L2.46 7.98a.5.5 0 0 0 .12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.61l1.92 3.32c.11.2.36.28.57.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.03.24.24.42.48.42h3.4c.24 0 .45-.18.48-.42l.36-2.54c.59-.24 1.12-.56 1.62-.94l2.39.96c.21.06.46-.02.57-.22l1.92-3.32a.5.5 0 0 0-.12-.61l-2.03-1.58zM11.5 15.5A3.5 3.5 0 1 1 15 12a3.5 3.5 0 0 1-3.5 3.5z"/>
      </svg>`;
    settingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSettings();
    }, { passive: false });
    panel.appendChild(settingsBtn);
  };

  // Toggle open/close on touch; keep hover for desktop
  const toggleOpen = (force) => {
    const next = force === undefined ? !wrap.classList.contains('open') : !!force;
    wrap.classList.toggle('open', next);
  };

  // tap vs long-press behavior for handle on touch devices
  let longPressTimer = null;
  let longPressFired = false;
  const MOVE_CANCEL_PX = 8;
  let pressStartXY = null;
  let movedDuringPress = false;

  const clearLongPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  const cycleNext = () => {
    const prefs = loadPrefs();
    const enabled = getEnabledEngines(prefs);
    if (enabled.length === 0) return;
    const idx = enabled.findIndex(e => e.key === current.engine.key);
    const next = idx === -1 ? enabled[0] : enabled[(idx + 1) % enabled.length];
    switchTo(next);
  };

  // Handle interactions:
  // - Touch: short tap toggles panel; long-press (500ms) cycles to next engine
  // - Mouse (desktop): click cycles (old behavior), hover opens (via CSS)
  const onPointerDown = (ev) => {
    if (isTouchLike()) {
      ev.preventDefault();
      longPressFired = false;
      movedDuringPress = false;
      pressStartXY = { x: ev.clientX, y: ev.clientY };
      clearLongPress();
      longPressTimer = setTimeout(() => {
        longPressFired = true;
        cycleNext();
      }, 500);
    }
  };

  const onPointerMove = (ev) => {
    if (!isTouchLike() || !pressStartXY) return;
    const dx = ev.clientX - pressStartXY.x;
    const dy = ev.clientY - pressStartXY.y;
    if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) {
      movedDuringPress = true;
      clearLongPress();
    }
  };

  const onPointerUp = (ev) => {
    if (isTouchLike()) {
      ev.preventDefault();
      clearLongPress();
      const shouldToggle = !longPressFired && !movedDuringPress;
      pressStartXY = null;
      if (shouldToggle) toggleOpen();
    } else {
      // Desktop click cycles, hover opens panel
      cycleNext();
    }
  };
  const onPointerCancel = () => {
    clearLongPress();
    pressStartXY = null;
    movedDuringPress = false;
  };

  handle.addEventListener('pointerdown', onPointerDown, { passive: false });
  handle.addEventListener('pointermove', onPointerMove, { passive: false });
  handle.addEventListener('pointerup', onPointerUp, { passive: false });
  handle.addEventListener('pointercancel', onPointerCancel, { passive: true });
  handle.addEventListener('pointerleave', onPointerCancel, { passive: true });

  // Close panel when tapping outside on touch devices
  document.addEventListener('click', (e) => {
    if (!isTouchLike()) return;
    if (!wrap.contains(e.target)) toggleOpen(false);
  }, { passive: true });

  wrap.appendChild(panel);
  wrap.appendChild(handle);
  document.body.appendChild(wrap);
  buildPanel();

  function openSettings() {
    const prefs = loadPrefs();
    let order = [...prefs.order];
    const disabled = new Set(prefs.disabled);

    const overlay = document.createElement('div');
    overlay.className = 'seqs-settings-overlay';
    overlay.innerHTML = `
      <div class="seqs-settings" role="dialog" aria-modal="true" aria-label="Switcher settings">
        <div class="seqs-settings-header">
          <h3>Switcher Settings</h3>
          <button class="seqs-settings-close" title="Close">✕</button>
        </div>
        <div class="seqs-settings-body">
          <p class="seqs-hint">Drag the grip on the right to reorder. Uncheck to hide an engine from the panel. The current engine is always visible.</p>
          <ul class="seqs-engine-list"></ul>
        </div>
        <div class="seqs-settings-actions">
          <button class="seqs-reset" title="Restore defaults">Reset</button>
          <div class="spacer"></div>
          <button class="seqs-cancel">Cancel</button>
          <button class="seqs-save seqs-primary">Save</button>
        </div>
      </div>
    `;

    const listEl = overlay.querySelector('.seqs-engine-list');
    const isTouch = isTouchLike();
    let tDrag = { active: false, dropTarget: null, before: true, pointerId: null };

    const clearDropIndicators = () => {
      listEl.querySelectorAll('.drop-before, .drop-after').forEach(el => {
        el.classList.remove('drop-before', 'drop-after');
      });
    };

    let dragKey = null;

    const render = () => {
      listEl.innerHTML = '';
      for (let i = 0; i < order.length; i++) {
        const key = order[i];
        const engine = ENGINE_MAP.get(key);
        if (!engine) continue;

        const li = document.createElement('li');
        li.className = 'seqs-engine-row';
        li.dataset.key = engine.key;

        const info = document.createElement('div');
        info.className = 'seqs-engine-info';
        info.appendChild(createIcon(engine.icon));

        const name = document.createElement('div');
        name.className = 'seqs-engine-name';
        name.textContent = engine.label;

        if (current.engine.key === engine.key) {
          const badge = document.createElement('span');
          badge.className = 'seqs-engine-badge';
          badge.textContent = 'current page';
          name.appendChild(badge);
        }

        info.appendChild(name);

        const toggle = document.createElement('label');
        toggle.className = 'seqs-toggle';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !disabled.has(engine.key);
        cb.onchange = () => {
          if (cb.checked) disabled.delete(engine.key);
          else disabled.add(engine.key);
        };
        toggle.appendChild(cb);
        toggle.appendChild(document.createTextNode('Enabled'));

        // Drag handle
        const drag = document.createElement('button');
        drag.type = 'button';
        drag.className = 'seqs-drag';
        drag.title = 'Drag to reorder';
        drag.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="rgba(255,255,255,.85)" d="M7 10h2V8H7v2zm0 6h2v-2H7v2zM11 10h2V8h-2v2zm0 6h2v-2h-2v2zM15 10h2V8h-2v2zm0 6h2v-2h-2v2z"/>
          </svg>
        `;

        if (!isTouch) {
          li.draggable = false;
          drag.addEventListener('mousedown', () => { li.draggable = true; });
          drag.addEventListener('mouseup',   () => { li.draggable = false; });
          drag.addEventListener('mouseleave',() => { li.draggable = false; });

          li.addEventListener('dragstart', (e) => {
            dragKey = engine.key;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', engine.key);
          });

          li.addEventListener('dragover', (e) => {
            if (!dragKey) return;
            e.preventDefault();
            const target = e.currentTarget;
            if (!target || !(target instanceof HTMLElement)) return;
            clearDropIndicators();

            const rect = target.getBoundingClientRect();
            const before = e.clientY < rect.top + rect.height / 2;
            target.classList.add(before ? 'drop-before' : 'drop-after');
          });

          li.addEventListener('drop', (e) => {
            if (!dragKey) return;
            e.preventDefault();
            const targetKey = li.dataset.key;
            if (!targetKey || targetKey === dragKey) {
              clearDropIndicators();
              return;
            }

            const before = li.classList.contains('drop-before');
            const after  = li.classList.contains('drop-after');

            let from = order.indexOf(dragKey);
            let to = order.indexOf(targetKey);
            if (after) to += 1;

            if (from < to) to -= 1;

            order.splice(to, 0, order.splice(from, 1)[0]);
            clearDropIndicators();
            render();
          });

          li.addEventListener('dragend', () => {
            li.draggable = false;
            dragKey = null;
            clearDropIndicators();
          });
        } else {
          // Pointer-based touch reorder
          drag.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragKey = engine.key;
            tDrag.active = true;
            tDrag.pointerId = e.pointerId;
            tDrag.dropTarget = null;
            tDrag.before = true;
            drag.setPointerCapture(e.pointerId);
          });
          drag.addEventListener('pointermove', (e) => {
            if (!tDrag.active) return;
            e.preventDefault();
            const y = e.clientY;
            let best = null;
            const rows = Array.from(listEl.children);
            clearDropIndicators();
            for (const row of rows) {
              const rect = row.getBoundingClientRect();
              if (y >= rect.top && y <= rect.bottom) {
                const before = y < rect.top + rect.height / 2;
                row.classList.add(before ? 'drop-before' : 'drop-after');
                best = { row, before };
                break;
              }
            }
            if (!best && rows.length) {
              const first = rows[0];
              const last = rows[rows.length - 1];
              const r1 = first.getBoundingClientRect();
              const r2 = last.getBoundingClientRect();
              if (y < r1.top) {
                first.classList.add('drop-before');
                best = { row: first, before: true };
              } else if (y > r2.bottom) {
                last.classList.add('drop-after');
                best = { row: last, before: false };
              }
            }
            tDrag.dropTarget = best?.row || null;
            tDrag.before = best?.before ?? true;
          });
          drag.addEventListener('pointerup', (e) => {
            if (!tDrag.active) return;
            e.preventDefault();
            drag.releasePointerCapture(tDrag.pointerId);
            tDrag.active = false;
            const targetEl = tDrag.dropTarget;
            clearDropIndicators();
            if (!targetEl || !dragKey) return;
            const targetKey = targetEl.dataset.key;
            if (!targetKey || targetKey === dragKey) return;
            let from = order.indexOf(dragKey);
            let to = order.indexOf(targetKey);
            if (!tDrag.before) to += 1;
            if (from < to) to -= 1;
            order.splice(to, 0, order.splice(from, 1)[0]);
            dragKey = null;
            render();
          });
          drag.addEventListener('pointercancel', () => {
            tDrag.active = false;
            dragKey = null;
            clearDropIndicators();
          });
        }

        li.appendChild(info);
        li.appendChild(toggle);
        li.appendChild(drag);
        listEl.appendChild(li);
      }
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    const closeBtn = overlay.querySelector('.seqs-settings-close');
    const cancelBtn = overlay.querySelector('.seqs-cancel');
    const saveBtn = overlay.querySelector('.seqs-save');
    const resetBtn = overlay.querySelector('.seqs-reset');

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };

    const close = () => {
      document.removeEventListener('keydown', onKeyDown);
      overlay.remove();
    };

    document.addEventListener('keydown', onKeyDown);

    closeBtn.onclick = cancelBtn.onclick = close;

    saveBtn.onclick = () => {
      const nextPrefs = { order, disabled: Array.from(disabled) };
      savePrefs(nextPrefs);
      buildPanel();
      close();
    };

    resetBtn.onclick = () => {
      const def = getDefaultPrefs();
      order = [...def.order];
      disabled.clear();
      render();
    };

    document.body.appendChild(overlay);
    render();
  }
})();