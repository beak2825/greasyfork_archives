// ==UserScript==
// @name         Testbook Mod Clean
// @namespace    tb-clean
// @version      1.0.4
// @description  Blocks trackers/bloat, removes promos, cleans UI on testbook.com
// @author       quantavil
// @match        https://testbook.com/*
// @match        https://*.testbook.com/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551914/Testbook%20Mod%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/551914/Testbook%20Mod%20Clean.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ------------- Utilities -------------
  const dbg = false;
  const log = (...a) => dbg && console.log('[TB Clean]', ...a);

  const injectPageScript = (fn, ...args) => {
    const s = document.createElement('script');
    s.textContent = `(${fn})(...${JSON.stringify(args)})`;
    (document.documentElement || document.head || document.body).appendChild(s);
    s.remove();
  };

  // ------------- Network Blocker (document-start, page context) -------------
  const BLOCK_PATTERNS = [
    // Analytics / Tags / Pixels
    /googletagmanager\.com/i,
    /google-analytics\.com/i,
    /g\.(?:doubleclick|google)\.net/i,
    /doubleclick\.net/i,
    /google\.com\/ccm\/collect/i,
    /unpkg\.com\/web-vitals/i,
    // Facebook
    /connect\.facebook\.net/i,
    /facebook\.com\/tr/i,
    // Microsoft
    /bat\.bing\.com/i,
    /clarity\.ms/i,
    /c\.bing\.com\/c\.gif/i,
    // Twitter
    /static\.ads-twitter\.com/i,
    /analytics\.twitter\.com/i,
    /t\.co\/1\/i\/adsct/i,
    // Quora
    /a\.quora\.com/i,
    /q\.quora\.com/i,
    // Criteo and ad sync chains
    /criteo\.com|static\.criteo\.net|sslwidget\.criteo\.com|gum\.criteo\.com|gumi\.criteo\.com/i,
    /cm\.g\.doubleclick\.net/i,
    /x\.bidswitch\.net|contextual\.media\.net|r\.casalemedia\.com|ad\.360yield\.com|idsync\.rlcdn\.com|rubiconproject\.com|smartadserver\.com|taboola\.com|outbrain\.com|3lift\.com|agkn\.com|adnxs\.com|dmxleo\.com/i,

    // Vendor SDKs / Beacons
    /cloudflareinsights\.com/i,
    /amplitude\.com/i,
    /openfpcdn\.io/i,
    /webengage\.com|webengage\.co|wsdk-files\.webengage\.com|c\.webengage\.com|ssl\.widgets\.webengage\.com|survey\.webengage\.com|z\d+.*\.webengage\.co/i,
    /intercom\.io|intercomcdn\.com|widget\.intercom\.io|api-iam\.intercom\.io|nexus-websocket-a\.intercom\.io/i,
    /onesignal\.com/i,
    /hotjar\.com/i,
    /sentry\.io/i,

    // Payment (blocked on request)
    /checkout\.razorpay\.com|checkout-static-next\.razorpay\.com|api\.razorpay\.com/i,

    // TB internal bloat
    /\/wcapi\/live-panel\.js/i,
    /\/js\/live-panel\.js/i,
    /live-panel\.template\.html/i,
    /live-panel\.styles\.css/i,
    /\/cdn-cgi\/rum/i,
    /coldboot\/dist\/coldboot\.min\.js/i,
    /sourcebuster\/dist\/sourcebuster\.min\.js/i,

    // Service workers from site/vendor
    /\/service-worker\.js$/i,
  ];

  // Patch fetch/XHR/WS/ES/beacon/src/href setters at document-start inside page context
  injectPageScript((patternSources) => {
    const BLOCK_PATTERNS = patternSources.map(s => new RegExp(s, 'i'));

    const shouldBlock = (rawUrl) => {
      try {
        const url = typeof rawUrl === 'string' ? new URL(rawUrl, location.href) : rawUrl;
        const str = url.toString();
        return BLOCK_PATTERNS.some(re => re.test(str));
      } catch {
        return false;
      }
    };

    // fetch
    const origFetch = window.fetch;
    if (origFetch) {
      window.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : (input && input.url);
        if (url && shouldBlock(url)) {
          return Promise.reject(new Error('Blocked by userscript: ' + url));
        }
        return origFetch.apply(this, arguments);
      };
    }

    // XHR
    const XHR = XMLHttpRequest;
    if (XHR && XHR.prototype) {
      const origOpen = XHR.prototype.open;
      const origSend = XHR.prototype.send;
      XHR.prototype.open = function (method, url, async, user, password) {
        this.__tbBlocked = url && shouldBlock(url);
        if (!this.__tbBlocked) return origOpen.apply(this, arguments);
        // Open dummy data URL so site code doesn't crash, then abort on send.
        return origOpen.call(this, method, 'data:application/json,{}', true);
      };
      XHR.prototype.send = function (body) {
        if (this.__tbBlocked) {
          try { this.abort(); } catch { }
          return;
        }
        return origSend.apply(this, arguments);
      };
    }

    // sendBeacon
    if (navigator && 'sendBeacon' in navigator) {
      const origBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function (url, data) {
        if (shouldBlock(url)) return false;
        return origBeacon(url, data);
      };
    }

    // WebSocket
    if ('WebSocket' in window) {
      const OrigWS = window.WebSocket;
      window.WebSocket = function (url, protocols) {
        if (shouldBlock(url)) throw new Error('WebSocket blocked: ' + url);
        return new OrigWS(url, protocols);
      };
      window.WebSocket.prototype = OrigWS.prototype;
      window.WebSocket.CLOSING = OrigWS.CLOSING;
      window.WebSocket.CLOSED = OrigWS.CLOSED;
      window.WebSocket.CONNECTING = OrigWS.CONNECTING;
      window.WebSocket.OPEN = OrigWS.OPEN;
    }

    // EventSource
    if ('EventSource' in window) {
      const OrigES = window.EventSource;
      window.EventSource = function (url, conf) {
        if (shouldBlock(url)) throw new Error('EventSource blocked: ' + url);
        return new OrigES(url, conf);
      };
      window.EventSource.prototype = OrigES.prototype;
      window.EventSource.CLOSED = OrigES.CLOSED;
      window.EventSource.CONNECTING = OrigES.CONNECTING;
      window.EventSource.OPEN = OrigES.OPEN;
    }

    // Patch src/href setters and setAttribute for script/link/img/iframe
    const patchSrcHref = (proto, prop) => {
      const desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (!desc || !desc.set) return;
      Object.defineProperty(proto, prop, {
        configurable: true,
        enumerable: desc.enumerable,
        get: desc.get ? function () { return desc.get.call(this); } : undefined,
        set: function (v) {
          if (typeof v === 'string' && shouldBlock(v)) {
            this.setAttribute('data-blocked-' + prop, v);
            return;
          }
          return desc.set.call(this, v);
        }
      });
    };

    const patchSetAttribute = (proto) => {
      const orig = proto.setAttribute;
      proto.setAttribute = function (name, value) {
        if ((name === 'src' || name === 'href') && typeof value === 'string' && shouldBlock(value)) {
          this.setAttribute('data-blocked-' + name, value);
          return;
        }
        return orig.call(this, name, value);
      };
    };

    [HTMLScriptElement.prototype, HTMLLinkElement.prototype, HTMLImageElement.prototype, HTMLIFrameElement.prototype]
      .forEach(p => p && patchSetAttribute(p));

    patchSrcHref(HTMLScriptElement.prototype, 'src');
    patchSrcHref(HTMLLinkElement.prototype, 'href');
    patchSrcHref(HTMLImageElement.prototype, 'src');
    patchSrcHref(HTMLIFrameElement.prototype, 'src');

    // Kill document.write (GTM/pixels sometimes use it)
    document.write = () => { };
    document.writeln = () => { };

    // Stub common trackers to avoid ReferenceErrors
    window.dataLayer = window.dataLayer || [];
    try { Object.defineProperty(window.dataLayer, 'push', { value: function () { }, writable: false }); } catch { }
    window.gtag = function () { };
    window.ga = function () { };
    window.fbq = function () { };
    window.clarity = function () { };
    window.Intercom = function () { };
    window.amplitude = {
      getInstance: () => ({
        init() { }, logEvent() { }, setUserId() { }, setUserProperties() { }, identify() { },
      })
    };
    window.OneSignal = { push() { }, init() { }, on() { }, off() { } };

    // Block service workers + unregister existing
    if ('serviceWorker' in navigator) {
      const origRegister = navigator.serviceWorker.register?.bind(navigator.serviceWorker);
      navigator.serviceWorker.register = function () {
        return Promise.reject(new Error('ServiceWorker registration blocked by userscript'));
      };
      navigator.serviceWorker.getRegistrations?.().then(list => {
        list.forEach(reg => reg.unregister().catch(() => { }));
      }).catch(() => { });
    }

    // Deny Notifications / Push permission
    try {
      if (window.Notification) {
        const origReq = window.Notification.requestPermission?.bind(window.Notification);
        window.Notification.requestPermission = function () {
          return Promise.resolve('denied');
        };
        Object.defineProperty(window.Notification, 'permission', { get: () => 'denied' });
      }
      const origPerms = navigator.permissions?.query?.bind(navigator.permissions);
      if (origPerms) {
        navigator.permissions.query = function (q) {
          if (q && (q.name === 'notifications' || q.name === 'push')) {
            return Promise.resolve({ state: 'denied', status: 'denied' });
          }
          return origPerms(q);
        };
      }
    } catch { }
  }, BLOCK_PATTERNS.map(re => re.source));

  // ------------- UI Cleaner (DOM removal + CSS, mutation-safe) -------------
  const css = `
    /* System font and minimal look */
    :root { --tb-fm-maxw: 1180px; --tb-fg: #0b0d10; --tb-bg: #ffffff; }
    html, body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important; }
    body { background: var(--tb-bg) !important; color: var(--tb-fg) !important; }
    /* Disable most animations/transitions */
    *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }

    /* Keep content centered/wider */
    main, [role="main"], .main, .content, .container, .wrapper, .dashboard, .page-wrapper, #content, #site-content {
      max-width: var(--tb-fm-maxw);
      margin-left: auto; margin-right: auto;
    }

    /* Hide live panel and promo components */
    promotion-homepage-banner, refer-earn, goal-pitch-wrapper, goal-features-pitch, goal-combo-cards,
    master-class-cards, why-testbook-ts, testimonials-ts, faqs { display: none !important; }
    .promotional-banner,
    [class*="live-panel"], #livePanel, .lp-tabs, .lp-badge-live, .lp-icon,
    [onclick*="livePanel"], [src*="/live-panel/"], link[href*="live-panel"],
    .tab-area.pav-class-livePanelTabShrunk { display: none !important; }

    /* Hide common cookie bars/popups/newsletters/chats */
    [id*="cookie"], [class*="cookie"], [aria-label*="cookie"],
    [class*="newsletter"], [id*="newsletter"],
    [id^="intercom-"], [class*="intercom"], iframe[src*="intercom"],
    .we-popup, .we-survey, .we-banner, [class*="webengage"] { display: none !important; }

    /* Copy-to-Markdown button in toolbar */
    #tb-copy-md-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 12px;
      margin-left: 8px;
      border: none;
      background: transparent;
      color: #86A1AE;
      cursor: pointer;
      font-size: 13px;
      outline: none;
      position: relative;
      vertical-align: middle;
    }
    #tb-copy-md-btn:hover {
      color: #0AD0F4;
    }
    #tb-copy-md-btn svg {
      width: 15px;
      height: 15px;
      fill: currentColor;
    }
    #tb-copy-md-toast {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      background: #1a7f37;
      color: white;
      border-radius: 4px;
      font-size: 11px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }
    #tb-copy-md-toast.show {
      opacity: 1;
    }
    #tb-copy-md-toast::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #1a7f37;
    }
  `;
  const style = document.createElement('style');
  style.id = 'tb-clean-style';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  // Remove targeted DOM and prune nav
  const removeSelectors = [
    'promotion-homepage-banner', 'refer-earn', 'goal-pitch-wrapper', 'goal-features-pitch', 'goal-combo-cards',
    'master-class-cards', 'why-testbook-ts', 'testimonials-ts', 'faqs',
    '.promotional-banner', '#masterClassCards',
    '.tab-area.pav-class-livePanelTabShrunk',
    '[class*="live-panel"]', '#livePanel', '.lp-tabs', '.lp-badge-live', '.lp-icon',
    '[onclick*="livePanel"]', '[src*="/live-panel/"]', 'link[href*="live-panel"]',

    // Common popups/cookie/chat
    '[id*="cookie"]', '[class*="cookie"]', '[aria-label*="cookie"]',
    '[class*="newsletter"]', '[id*="newsletter"]',
    '[id^="intercom-"]', '[class*="intercom"]', 'iframe[src*="intercom"]',
    '.we-popup', '.we-survey', '.we-banner', '[class*="webengage"]',
  ];

  const navPathRegexes = [
    /^\/super-coaching/i,
    /^\/free-live-classes/i,
    /^\/skill-academy/i,
    /^\/pass$/i, /^\/pass-pro$/i, /^\/pass-elite$/i,
    /^\/reported-questions$/i, /^\/doubts$/i,
    /^\/current-affairs\/current-affairs-quiz$/i,
    /^\/e-cards$/i,
    /^\/teachers-training-program$/i,
    /^\/referrals$/i,
    /^\/success-stories$/i,
  ];

  function pruneNav() {
    const nav = document.querySelectorAll('ul.header__sidebar__nav a[href]');
    nav.forEach(a => {
      try {
        const href = a.getAttribute('href') || '';
        const u = new URL(href, location.origin);
        if (navPathRegexes.some(re => re.test(u.pathname))) {
          const li = a.closest('li') || a;
          li.remove();
        }
      } catch { }
    });

    // Remove "Learn" and "More" dividers
    document.querySelectorAll('ul.header__sidebar__nav .header__divider').forEach(div => {
      const t = (div.textContent || '').trim().toLowerCase();
      if (t === 'learn' || t === 'more') div.remove();
    });
  }

  function removeJunk() {
    removeSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(n => n.remove());
    });

    // Live classes blocks with "Classes" title fallback
    document.querySelectorAll('.lp-title').forEach(n => {
      if ((n.textContent || '').trim().toLowerCase() === 'classes') {
        const card = n.closest('.tab-area, .lp-tabs, .live, .pav-class') || n;
        card.remove();
      }
    });

    pruneNav();
  }

  // Disable most autoplay for HTML5 videos
  const blockAutoPlay = () => {
    try {
      const proto = HTMLMediaElement.prototype;
      const origPlay = proto.play;
      proto.play = function () {
        const hasAuto = this.autoplay || this.getAttribute('autoplay') !== null;
        if (hasAuto) {
          return Promise.reject(new DOMException('Autoplay blocked by userscript', 'NotAllowedError'));
        }
        return origPlay.apply(this, arguments);
      };
    } catch { }
  };

  // ------------- Copy-to-Markdown injector and extractor -------------
  function absUrl(u) {
    try {
      if (!u) return '';
      if (u.startsWith('//')) return location.protocol + u;
      return new URL(u, location.href).toString();
    } catch { return u || ''; }
  }

  function isHidden(el) {
    if (!el) return true;
    if (el.closest('.ng-hide')) return true;
    const cs = getComputedStyle(el);
    return cs.display === 'none' || cs.visibility === 'hidden';
  }

  // Minimal HTML -> Markdown converter (supports p/div/br, strong/b, em/i, a, img, ul/ol/li, h1-h6)
  function htmlToMarkdown(root) {
    function textify(str) {
      return (str || '').replace(/\s+/g, ' ').replace(/\u00A0/g, ' ').trim();
    }
    function walk(node, ctx = {}) {
      if (!node) return '';
      const T = Node;
      switch (node.nodeType) {
        case T.TEXT_NODE:
          return textify(node.nodeValue);
        case T.ELEMENT_NODE: {
          const tag = node.tagName.toLowerCase();
          // Collect children first
          const childMD = Array.from(node.childNodes).map(n => walk(n, ctx)).join('');

          if (tag === 'br') return '  \n';
          if (tag === 'strong' || tag === 'b') return childMD ? `**${childMD}**` : '';
          if (tag === 'em' || tag === 'i') return childMD ? `*${childMD}*` : '';
          if (tag === 'u') return childMD; // no underline in MD
          if (tag === 'a') {
            const href = absUrl(node.getAttribute('href') || '');
            const txt = childMD || href || '';
            return href ? `[${txt}](${href})` : txt;
          }
          if (tag === 'img') {
            const src = absUrl(node.getAttribute('src') || node.src || '');
            const alt = node.getAttribute('alt') || '';
            return src ? `![${alt}](${src})` : '';
          }
          if (tag === 'ul' || tag === 'ol') {
            const ordered = tag === 'ol';
            const items = Array.from(node.children).filter(li => li.tagName && li.tagName.toLowerCase() === 'li');
            return items.map((li, idx) => {
              const prefix = ordered ? `${idx + 1}. ` : `- `;
              const liMD = Array.from(li.childNodes).map(n => walk(n, ctx)).join('');
              return `${prefix}${liMD}\n`;
            }).join('') + '\n';
          }
          if (/^h[1-6]$/.test(tag)) {
            const level = Number(tag[1]);
            return `${'#'.repeat(level)} ${childMD}\n\n`;
          }
          if (tag === 'p' || tag === 'div' || tag === 'section' || tag === 'article') {
            const content = childMD.trim();
            return content ? `${content}\n\n` : '';
          }
          return childMD;
        }
        default: return '';
      }
    }
    const md = walk(root).replace(/\n{3,}/g, '\n\n').trim();
    return md;
  }

  function getQuestionBox() {
    const boxes = Array.from(document.querySelectorAll('.que-ans-box'));
    if (!boxes.length) return null;
    const visible = boxes.find(b => !isHidden(b));
    return visible || boxes[0];
  }

  function getComprehensionEl() {
    return document.querySelector('.aei-comprehension [ng-bind-html]') || null;
  }

  function getQuestionEl(qaBox) {
    if (!qaBox) return null;
    const all = qaBox.querySelectorAll('.qns-view-box');
    for (const el of all) {
      if (el.closest('li.option')) continue;
      if (el.closest('[ng-bind-html*="getSolutionDesc"]')) continue;
      return el; // first non-option, non-solution qns-view-box inside question box
    }
    return null;
  }

  function getOptions(qaBox) {
    if (!qaBox) return [];
    // First list that actually contains option nodes
    const lists = Array.from(qaBox.querySelectorAll('ul'));
    let list = lists.find(u => u.querySelector('li.option'));
    if (!list) return [];
    const items = Array.from(list.querySelectorAll('li.option')).filter(li => li.querySelector('.qns-view-box'));
    return items.map((li, idx) => {
      const box = li.querySelector('.qns-view-box');
      const md = htmlToMarkdown(box);
      return { index: idx, textMD: md, el: li };
    });
  }

  function getCorrectOptionIndex(qaBox) {
    if (!qaBox) return -1;
    // Try to find correct option by class markers (works when solution visibility marks it)
    const correctLI = qaBox.querySelector('li.option.correct-option, li.option.reattempt-correct-option');
    if (!correctLI) return -1;
    const all = Array.from(qaBox.querySelectorAll('ul li.option'));
    const idx = all.indexOf(correctLI);
    return idx >= 0 ? idx : -1;
  }

  function getSolutionEl(qaBox) {
    if (!qaBox) return null;
    // Present in DOM even when hidden by ng-hide
    return qaBox.querySelector('[ng-bind-html*="getSolutionDesc"]') || null;
  }

  function buildMarkdownForCurrentQuestion() {
    const qaBox = getQuestionBox();
    const parts = [];

    const comp = getComprehensionEl();
    if (comp) {
      parts.push('## Comprehension', htmlToMarkdown(comp));
    }

    const qEl = getQuestionEl(qaBox);
    if (qEl) {
      parts.push('## Question', htmlToMarkdown(qEl));
    }

    const opts = getOptions(qaBox);
    if (opts.length) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      parts.push('## Options');
      const lines = opts.map(o => `${letters[o.index]}. ${o.textMD}`);
      parts.push(lines.join('\n'));
    }

    // Try to add Answer if we can detect the correct option
    const correctIdx = getCorrectOptionIndex(qaBox);
    if (correctIdx >= 0 && opts[correctIdx]) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      parts.push('## Answer', `${letters[correctIdx]}. ${opts[correctIdx].textMD}`);
    }

    const solEl = getSolutionEl(qaBox);
    if (solEl) {
      parts.push('## Solution', htmlToMarkdown(solEl));
    }

    const md = parts.filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
    return md || 'No content found.';
  }

  async function copyTextToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch { }
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { }
    ta.remove();
    return ok;
  }

  function ensureCopyButton() {
    // Find the toolbar area
    const toolbar = document.querySelector('.tp-pos-neg-marks');
    if (!toolbar) return;

    // Avoid duplicates
    if (toolbar.querySelector('#tb-copy-md-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'tb-copy-md-btn';
    btn.type = 'button';
    btn.title = 'Copy question, options, and solution as Markdown';
    btn.innerHTML = `
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25ZM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/>
      </svg>
    `;

    const toast = document.createElement('span');
    toast.id = 'tb-copy-md-toast';
    toast.textContent = 'Copied!';
    btn.appendChild(toast);

    // Insert before the first child (or append if no children)
    if (toolbar.firstChild) {
      toolbar.insertBefore(btn, toolbar.firstChild);
    } else {
      toolbar.appendChild(btn);
    }

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const md = buildMarkdownForCurrentQuestion();
        const ok = await copyTextToClipboard(md);
        toast.textContent = ok ? 'Copied!' : 'Failed';
      } catch {
        toast.textContent = 'Failed';
      }
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1500);
    });
  }

  // ------------- Bootstrapping -------------
  const onReady = (fn) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  };

  onReady(() => {
    // Initial clean + inject button
    removeJunk();
    blockAutoPlay();
    ensureCopyButton();

    // Observe SPA changes
    const obs = new MutationObserver(() => {
      removeJunk();
      ensureCopyButton();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // Also re-run on history changes (Angular/SPA)
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    history.pushState = function () {
      const r = pushState.apply(this, arguments);
      setTimeout(() => { removeJunk(); ensureCopyButton(); }, 50);
      return r;
    };
    history.replaceState = function () {
      const r = replaceState.apply(this, arguments);
      setTimeout(() => { removeJunk(); ensureCopyButton(); }, 50);
      return r;
    };
    window.addEventListener('popstate', () => setTimeout(() => { removeJunk(); ensureCopyButton(); }, 50));
  });
})();