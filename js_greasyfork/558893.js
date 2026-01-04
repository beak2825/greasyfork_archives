// ==UserScript==
// @name         X Cleaner
// @description  Hide Annoying left sidebar links and remove right sidebar clutter on X.com.
// @namespace    https://loongphy.com
// @author       Loongphy
// @license      PolyForm-Noncommercial-1.0.0; https://polyformproject.org/licenses/noncommercial/1.0.0/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @version      1.1.0
// @match        https://x.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/558893/X%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/558893/X%20Cleaner.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.__xCleanerInstalled) return;
  window.__xCleanerInstalled = true;

  const CONFIG = {
    demoMode: false,
    demoBlurPx: 12,
  };

  const DEMO_STYLE_ID = 'x-cleaner-demo-style';

  const STORE_KEY_DEMO_MODE = 'x-cleaner-demo-mode';

  function gmGetValue(key, defaultValue) {
    try {
      if (typeof GM_getValue === 'function') return GM_getValue(key, defaultValue);
    } catch (e) { }
    try {
      if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') return GM.getValue(key, defaultValue);
    } catch (e) { }
    return defaultValue;
  }

  function gmSetValue(key, value) {
    try {
      if (typeof GM_setValue === 'function') return GM_setValue(key, value);
    } catch (e) { }
    try {
      if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') return GM.setValue(key, value);
    } catch (e) { }
  }

  function gmRegisterMenuCommand(label, handler) {
    try {
      if (typeof GM_registerMenuCommand === 'function') return GM_registerMenuCommand(label, handler);
    } catch (e) { }
    try {
      if (typeof GM !== 'undefined' && typeof GM.registerMenuCommand === 'function') return GM.registerMenuCommand(label, handler);
    } catch (e) { }
  }

  function initDemoModeOption() {
    const v = gmGetValue(STORE_KEY_DEMO_MODE, CONFIG.demoMode);
    if (v && typeof v.then === 'function') {
      v.then((val) => {
        CONFIG.demoMode = !!val;
        scheduleCleanup();
      });
    } else {
      CONFIG.demoMode = !!v;
    }

    gmRegisterMenuCommand('DEMO 模式', () => {
      CONFIG.demoMode = !CONFIG.demoMode;
      gmSetValue(STORE_KEY_DEMO_MODE, CONFIG.demoMode);
      scheduleCleanup();
    });
  }

  function ensureDemoStyle() {
    if (document.getElementById(DEMO_STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = DEMO_STYLE_ID;
    s.textContent = `
/* 侧边栏头像模糊 */
header[role="banner"] button[data-testid="SideNav_AccountSwitcher_Button"] [data-testid^="UserAvatar-Container-"] {
  filter: blur(var(--x-cleaner-demo-blur, 12px)) !important;
}

/* 侧边栏用户名（显示名）模糊 */
header[role="banner"] button[data-testid="SideNav_AccountSwitcher_Button"] > div:nth-child(2) div[dir="ltr"] > span {
  filter: blur(var(--x-cleaner-demo-blur, 12px)) !important;
}

/* 侧边栏 @用户名模糊 */
header[role="banner"] button[data-testid="SideNav_AccountSwitcher_Button"] > div:nth-child(2) div[dir="ltr"] > span[class*="r-poiln3"] {
  filter: blur(var(--x-cleaner-demo-blur, 12px)) !important;
}

/* 发推输入框旁的头像模糊 */
div:has([data-testid^="tweetTextarea"]):has([role="progressbar"]):not(:has(article)) [data-testid^="UserAvatar-Container-"] {
  filter: blur(var(--x-cleaner-demo-blur, 12px)) !important;
}
`;
    (document.head || document.documentElement).appendChild(s);
  }

  function applyDemoMode() {
    ensureDemoStyle();
    const root = document.documentElement;
    const blurValue = CONFIG.demoMode ? `${CONFIG.demoBlurPx}px` : '0px';
    root.style.setProperty('--x-cleaner-demo-blur', blurValue);
  }

  const rxLists = /^\/[A-Za-z0-9_]{1,20}\/lists\/?$/;
  const rxCommunities = /^\/[A-Za-z0-9_]{1,20}\/communities\/?$/;

  const RETRIEVAL_MENU_ID = 'x-cleaner-retrieval-menu';

  function isHandle(s) {
    return typeof s === 'string' && /^[A-Za-z0-9_]{1,20}$/.test(s);
  }

  function getMyUsername() {
    const btn = document.querySelector('header[role="banner"] button[data-testid="SideNav_AccountSwitcher_Button"]');
    if (btn) {
      const spans = btn.querySelectorAll('span');
      for (const sp of spans) {
        const t = (sp.textContent || '').trim();
        if (t && t.startsWith('@')) {
          const u = t.slice(1).trim();
          if (isHandle(u)) return u;
        }
      }
    }

    const banner = document.querySelector('header[role="banner"]');
    if (banner) {
      const links = banner.querySelectorAll('a[href]');
      for (const a of links) {
        const href = a.getAttribute('href');
        if (!href) continue;

        let path = null;
        if (href.startsWith('/')) {
          path = href;
        } else if (href.startsWith('https://') || href.startsWith('http://')) {
          try {
            const u = new URL(href);
            if (u.origin === location.origin) path = u.pathname;
          } catch (e) { }
        }
        if (!path) continue;

        const segs = path.split('/').filter(Boolean);
        if (segs.length !== 1) continue;
        const u = segs[0];
        if (!isHandle(u)) continue;
        if (u === 'home' || u === 'explore' || u === 'notifications' || u === 'messages' || u === 'i' || u === 'settings') continue;
        if (rxLists.test(path) || rxCommunities.test(path)) continue;
        return u;
      }
    }

    return null;
  }

  function getTargetUsernameFromPathname() {
    const path = (location && location.pathname) ? location.pathname : '';
    const segs = path.split('/').filter(Boolean);
    if (segs.length < 1) return null;
    const s = segs[0];
    if (!isHandle(s)) return null;
    const reserved = new Set([
      'home',
      'explore',
      'notifications',
      'messages',
      'bookmarks',
      'lists',
      'communities',
      'search',
      'compose',
      'i',
      'settings',
      'jobs',
      'logout',
      'login',
      'signup',
    ]);
    if (reserved.has(s)) return null;
    if (rxLists.test(path) || rxCommunities.test(path)) return null;

    if (segs.length === 1) return s;
    if (segs.length >= 2 && segs[1] === 'status') return s;
    return s;
  }

  function buildSearchUrl(query, options = {}) {
    const { latest = true } = options;
    const url = new URL('https://x.com/search');
    url.searchParams.set('q', query);
    url.searchParams.set('src', 'typed_query');
    if (latest) url.searchParams.set('f', 'live');
    return url.toString();
  }

  function ensureRetrievalMenu(sidebar) {
    if (!sidebar) return null;

    const baseMenuStyle = [
      'margin: 53px 0 12px',
      'padding: 12px',
      'border: 1px solid rgb(43, 46, 49)',
      'border-radius: 16px',
    ].join(';');

    const ensureRetrievalMenuStyle = () => {
      const STYLE_ID = 'x-cleaner-retrieval-menu-style';
      if (document.getElementById(STYLE_ID)) return;
      const st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent = [
        '#x-cleaner-retrieval-menu{border-color:rgb(43, 46, 49) !important;}',
        '@media (prefers-color-scheme: light){#x-cleaner-retrieval-menu{border-color:rgb(228, 234, 236) !important;}}',
        '@media (prefers-color-scheme: dark){#x-cleaner-retrieval-menu{border-color:rgb(43, 46, 49) !important;}}',
        'html[data-theme="light"] #x-cleaner-retrieval-menu{border-color:rgb(228, 234, 236) !important;}',
        'html[data-theme="dark"] #x-cleaner-retrieval-menu, html[data-theme="dim"] #x-cleaner-retrieval-menu{border-color:rgb(43, 46, 49) !important;}',
        '.x-cleaner-retrieval-btn{display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border-radius:10px;border:1px solid rgb(43, 46, 49);background:transparent;color:inherit;text-decoration:none;cursor:pointer;font:inherit;line-height:1;user-select:none;transition:transform 80ms ease;}',
        '@media (prefers-color-scheme: light){.x-cleaner-retrieval-btn{border-color:rgb(228, 234, 236);}}',
        '@media (prefers-color-scheme: dark){.x-cleaner-retrieval-btn{border-color:rgb(43, 46, 49);}}',
        'html[data-theme="light"] .x-cleaner-retrieval-btn{border-color:rgb(228, 234, 236);}',
        'html[data-theme="dark"] .x-cleaner-retrieval-btn, html[data-theme="dim"] .x-cleaner-retrieval-btn{border-color:rgb(43, 46, 49);}',
        '.x-cleaner-retrieval-btn:active{transform:scale(0.98);}',
        '.x-cleaner-retrieval-btn:focus-visible{outline:2px solid rgba(29,155,240,0.9);outline-offset:2px;}',
      ].join('\n');
      document.head.appendChild(st);
    };

    const findSidebarDirectChild = (node) => {
      if (!node) return null;
      let cur = node;
      while (cur && cur.parentElement && cur.parentElement !== sidebar) cur = cur.parentElement;
      return (cur && cur.parentElement === sidebar) ? cur : null;
    };

    const findUpsellMount = () => {
      const upsell = sidebar.querySelector('[data-testid="super-upsell-UpsellCardRenderProperties"]');
      if (!upsell) return null;
      const parent = upsell.parentElement;
      const grandparent = parent ? parent.parentElement : null;
      const anchor = grandparent ? grandparent.parentElement : null;
      if (!anchor) return null;
      return { anchor, beforeEl: grandparent };
    };

    const findFooterMount = () => {
      const tosLink = sidebar.querySelector('a[href="/tos"], a[href^="https://x.com/tos"], a[href^="http://x.com/tos"]');
      const footerBlock = findSidebarDirectChild(tosLink);
      if (!footerBlock) return null;
      return { anchor: sidebar, beforeEl: footerBlock };
    };

    const findSearchMount = () => {
      const form = sidebar.querySelector('form[role="search"]');
      if (!form) return null;
      let lvl = form;
      for (let i = 0; i < 4; i += 1) {
        if (!lvl || !lvl.parentElement) return null;
        lvl = lvl.parentElement;
      }
      if (!lvl) return null;
      const anchor = lvl.parentElement || sidebar;
      return { anchor, afterEl: lvl };
    };

    const moveToMount = (root) => {
      const searchMount = findSearchMount();
      if (searchMount && searchMount.anchor) {
        const desiredParent = searchMount.anchor;
        const afterEl = searchMount.afterEl;
        if (root.parentElement !== desiredParent) {
          if (afterEl) {
            afterEl.insertAdjacentElement('afterend', root);
          } else {
            desiredParent.prepend(root);
          }
          return;
        }
        if (afterEl && root.previousElementSibling !== afterEl) {
          afterEl.insertAdjacentElement('afterend', root);
        }
        return;
      }

      const upsellMount = findUpsellMount();
      if (upsellMount && upsellMount.anchor) {
        const desiredParent = upsellMount.anchor;
        const beforeEl = upsellMount.beforeEl;
        if (root.parentElement !== desiredParent) {
          desiredParent.insertBefore(root, beforeEl || desiredParent.firstChild);
          return;
        }
        if (beforeEl && root.nextElementSibling !== beforeEl) {
          desiredParent.insertBefore(root, beforeEl);
        } else if (!beforeEl && root !== desiredParent.firstElementChild) {
          desiredParent.insertBefore(root, desiredParent.firstChild);
        }
        return;
      }

      const footerMount = findFooterMount();
      if (footerMount && footerMount.anchor) {
        const desiredParent = footerMount.anchor;
        const beforeEl = footerMount.beforeEl;
        if (root.parentElement !== desiredParent) {
          desiredParent.insertBefore(root, beforeEl || desiredParent.firstChild);
          return;
        }
        if (beforeEl && root.nextElementSibling !== beforeEl) {
          desiredParent.insertBefore(root, beforeEl);
        } else if (!beforeEl && root !== desiredParent.firstElementChild) {
          desiredParent.insertBefore(root, desiredParent.firstChild);
        }
        return;
      }

      const mount = findSearchMount();
      if (!mount || !mount.anchor) return;

      const desiredParent = mount.anchor;
      const afterEl = mount.afterEl;

      // Ensure parent
      if (root.parentElement !== desiredParent) {
        if (afterEl) {
          afterEl.insertAdjacentElement('afterend', root);
        } else {
          desiredParent.prepend(root);
        }
        return;
      }

      // Ensure order (right after afterEl)
      if (afterEl && root.previousElementSibling !== afterEl) {
        afterEl.insertAdjacentElement('afterend', root);
      }
    };

    let root = document.getElementById(RETRIEVAL_MENU_ID);
    if (!root) {
      root = document.createElement('div');
      root.id = RETRIEVAL_MENU_ID;
      root.className = 'shortcuts-menu';
      root.style.cssText = baseMenuStyle;

      const ul = document.createElement('ul');
      ul.className = 'shortcuts-menu-list';
      ul.style.cssText = ['list-style:none', 'margin:0', 'padding:0', 'display:block'].join(';');
      root.appendChild(ul);

      const li = document.createElement('li');
      li.className = 'shortcuts-menu-row';
      ul.appendChild(li);

      sidebar.prepend(root);
      moveToMount(root);
    } else {
      // Overwrite any previous inline styles from older versions.
      root.style.cssText = baseMenuStyle;
      // If the menu exists but is mounted in a wrong place, move it back to the desired position.
      moveToMount(root);
    }

    ensureRetrievalMenuStyle();

    const ul = root.querySelector('ul.shortcuts-menu-list');
    const li = ul ? ul.querySelector('li.shortcuts-menu-row') : null;
    if (!ul || !li) return root;

    li.style.cssText = ['display:flex', 'flex-wrap:wrap', 'gap:8px', 'align-items:center'].join(';');

    const addAction = (label, query, options) => {
      const a = document.createElement('a');
      a.className = 'x-cleaner-retrieval-btn';
      a.setAttribute('role', 'button');
      a.textContent = label;
      a.href = buildSearchUrl(query, options);
      a.target = '_self';
      li.appendChild(a);
    };

    const my = getMyUsername();
    const target = getTargetUsernameFromPathname();

    const isHome = (location && location.pathname === '/home');
    const isMyProfile = !!(my && target && my === target);
    const scenario = (() => {
      if (my && (isHome || isMyProfile)) return { type: 'home', my };
      if (target) return { type: 'target', my: my || null, target };
      return { type: 'none', my: my || null, target: target || null };
    })();
    const renderKey = JSON.stringify(scenario);
    const prevKey = root.getAttribute('data-render-key');
    if (prevKey === renderKey) return root;
    root.setAttribute('data-render-key', renderKey);
    li.textContent = '';

    const addMyRetrievalAction = () => {
      if (scenario.my) {
        addAction('我的有回推', `from:${scenario.my} min_replies:1`);
        return true;
      }
      addAction('我的有回推', 'min_replies:1');
      return false;
    };

    if (scenario.type === 'home') {
      addMyRetrievalAction();
    } else if (scenario.type === 'target') {
      addAction('TA的推文', `from:${scenario.target} -filter:replies -filter:retweets`);
      if (scenario.my) {
        addAction('我回TA', `from:${scenario.my} to:${scenario.target} filter:replies`);
      }
    } else {
      addMyRetrievalAction();
    }

    addAction('仅限中文', 'lang:zh', { latest: false });
    addAction('仅限英文', 'lang:en', { latest: false });

    return root;
  }

  function hide(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.getAttribute('data-x-cleaner-hidden') === '1') return;
    el.setAttribute('data-x-cleaner-hidden', '1');
    el.style.setProperty('display', 'none', 'important');
  }

  function cleanLeftSidebar(banner) {
    const links = banner.querySelectorAll('a[href]');
    for (const a of links) {
      const href = a.getAttribute('href');
      if (!href) continue;
      if (href === '/explore' || href === '/i/premium_sign_up' || href === '/i/premium-business' || rxLists.test(href) || rxCommunities.test(href)) {
        hide(a);
      }
    }
  }

  function cleanRightSidebar() {
    const sidebar = document.querySelector('div[data-testid="sidebarColumn"]');
    if (!sidebar) return;

    ensureRetrievalMenu(sidebar);

    const hideAncestor = (el, levels = 2) => {
      if (!el || levels <= 0) return;
      let target = el;
      for (let i = 0; i < levels; i += 1) {
        if (!target || !target.parentElement) return;
        target = target.parentElement;
      }
      hide(target);
    };

    for (const h1 of sidebar.querySelectorAll('h1[id^="accessible-list-"]')) {
      if (!/^accessible-list-\d+$/.test(h1.id)) continue;
      hideAncestor(h1);
    }
    hideAncestor(sidebar.querySelector('[data-testid="super-upsell-UpsellCardRenderProperties"]'));
    for (const aside of sidebar.querySelectorAll('aside[role="complementary"]')) {
      hideAncestor(aside, 2);
    }
  }

  function cleanup() {
    applyDemoMode();
    const banner = document.querySelector('header[role="banner"]');
    if (banner) cleanLeftSidebar(banner);
    cleanRightSidebar();
  }

  let scheduled = false;
  function scheduleCleanup() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      cleanup();
    });
  }

  initDemoModeOption();

  const mo = new MutationObserver(() => scheduleCleanup());
  mo.observe(document.documentElement, { childList: true, subtree: true });

  const originalPushState = history.pushState;
  history.pushState = function () {
    const ret = originalPushState.apply(this, arguments);
    scheduleCleanup();
    return ret;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function () {
    const ret = originalReplaceState.apply(this, arguments);
    scheduleCleanup();
    return ret;
  };

  window.addEventListener('popstate', () => scheduleCleanup());
  scheduleCleanup();
})();
