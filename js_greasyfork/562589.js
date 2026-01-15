// ==UserScript==
// @name         instagram.com - Decluttering Instagram
// @namespace    ig-clean
// @version      1.0
// @description  Strips back web functionality of Instagram by removing stories/posts from home, removes Explore/Reels from sidebar and redirects all reels links to post links.
// @match        https://www.instagram.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562589/instagramcom%20-%20Decluttering%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/562589/instagramcom%20-%20Decluttering%20Instagram.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const STATE = {
    observer: null,
    lastPath: "",
  };

  const CSS = `
    /* Generic hides that are safe-ish, reinforcement happens via JS too */
    .igclean__homeLogoWrap{
      min-height: calc(100vh - 56px);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    .igclean__homeLogoWrap svg{
      width: min(520px, 70vw);
      height: auto;
    }
  `;

  function addStyle(cssText) {
    const s = document.createElement("style");
    s.textContent = cssText;
    document.documentElement.appendChild(s);
  }

  function isHome() {
    return location.pathname === "/" && !location.search;
  }

  function isPostPage() {
    return /^\/p\/[^/]+\/?$/.test(location.pathname);
  }

  function isReelsLikePage() {
    return (
      /^\/reels\/[^/]+\/?$/.test(location.pathname) ||
      /^\/reel\/[^/]+\/?$/.test(location.pathname)
    );
  }

  function redirectReelsToPostIfNeeded() {
    if (!isReelsLikePage()) return;

    const parts = location.pathname.split("/").filter(Boolean); // ["reels"|"reel", "<id>"]
    const id = parts[1];
    if (!id) return;

    const target = `/p/${id}/`;
    if (location.pathname !== target) {
      history.replaceState(history.state, "", target + location.search + location.hash);
      onRouteChange();
    }
  }

  function findMain() {
    return document.querySelector('main[role="main"], main') || null;
  }

  function cloneTopNavInstagramLogoSvg() {
    const svg =
      document.querySelector('nav svg[aria-label="Instagram"]') ||
      document.querySelector('header svg[aria-label="Instagram"]') ||
      document.querySelector('svg[aria-label="Instagram"]');

    if (!svg) return null;
    return svg.cloneNode(true);
  }

  function removeByText(root, regexList) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    const toRemove = [];

    while (walker.nextNode()) {
      const el = walker.currentNode;
      if (!el || !el.textContent) continue;

      const txt = el.textContent.trim();
      if (!txt) continue;

      if (regexList.some((rx) => rx.test(txt))) {
        const container = el.closest("section, div") || el;
        if (
          container !== root &&
          container !== document.body &&
          container !== document.documentElement
        ) {
          toRemove.push(container);
        }
      }
    }

    const uniq = Array.from(new Set(toRemove));
    uniq.forEach((n) => n.remove());
  }

  function ensureHomeLogoPlaceholder() {
    const main = findMain();
    if (!main) return;

    const existing = main.querySelector(":scope > .igclean__homeLogoWrap");
    if (!existing) {
      const wrap = document.createElement("div");
      wrap.className = "igclean__homeLogoWrap";

      const logoSvg = cloneTopNavInstagramLogoSvg();
      if (logoSvg) {
        wrap.appendChild(logoSvg);
      } else {
        const t = document.createElement("div");
        t.textContent = "Instagram";
        t.style.fontSize = "48px";
        t.style.fontWeight = "700";
        wrap.appendChild(t);
      }

      main.insertBefore(wrap, main.firstChild);
    }

    // Remove posts + stories
    main.querySelectorAll("article").forEach((el) => el.remove());

    main.querySelectorAll('a[href^="/stories/"]').forEach((a) => {
      const tray = a.closest("section, div");
      if (tray) tray.remove();
    });

    removeByText(main, [/suggested for you/i, /suggested posts/i, /recommended/i]);

    Array.from(main.children).forEach((child) => {
      if (!child.classList.contains("igclean__homeLogoWrap")) {
        if (
          child.querySelector?.("article") ||
          child.querySelector?.('a[href^="/stories/"]') ||
          child.querySelector?.('a[href^="/reel/"], a[href^="/reels/"]')
        ) {
          child.remove();
        }
      }
    });
  }

  function removeExploreAndReelsFromSidebar() {
    const targets = [
      'a[href="/explore/"]',
      'a[href^="/explore/"]',
      'a[href="/reels/"]',
      'a[href^="/reels/"]',
      'a[href="/reel/"]',
      'a[href^="/reel/"]',
    ];

    document.querySelectorAll(targets.join(",")).forEach((a) => {
      const row = a.closest("li, div, a");
      if (row) row.remove();
    });
  }

  // ---- FIXED: remove the "More posts from" block on post pages ----
  function removeMoreContentFromOnPostPage(root = document) {
    if (!isPostPage()) return;

    const PHRASE = "More posts from";

    const isMatch = (el) => {
      const t = el?.textContent ? el.textContent.trim() : "";
      return t.startsWith(PHRASE);
    };

    const findRemovableContainer = (startEl) => {
      let el = startEl;
      for (let i = 0; i < 12 && el; i++) {
        if (el.nodeType === 1 && el.tagName === "DIV") {
          const links =
            el.querySelectorAll?.('a[href*="/p/"], a[href*="/reel/"], a[href*="/reels/"]')
              .length || 0;
          const imgs = el.querySelectorAll?.("img").length || 0;
          if (links >= 2 || imgs >= 2) return el;
        }
        el = el.parentElement;
      }
      return startEl.parentElement || startEl;
    };

    // Narrower candidate scan than "div, span, div, span" (which is huge).
    const candidates = root.querySelectorAll('div[dir="auto"], span[dir="auto"], h2, h3, span, div');
    for (const el of candidates) {
      if (!isMatch(el)) continue;
      const container = findRemovableContainer(el);
      if (container?.isConnected) container.remove();
    }
  }

  function onRouteChange() {
    STATE.lastPath = location.pathname;

    redirectReelsToPostIfNeeded();
    removeExploreAndReelsFromSidebar();

    if (isHome()) {
      ensureHomeLogoPlaceholder();
    } else if (isPostPage()) {
      removeMoreContentFromOnPostPage();
    }
  }

  function hookHistory() {
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;

    history.pushState = function (...args) {
      const ret = _pushState.apply(this, args);
      queueMicrotask(onRouteChange);
      return ret;
    };

    history.replaceState = function (...args) {
      const ret = _replaceState.apply(this, args);
      queueMicrotask(onRouteChange);
      return ret;
    };

    window.addEventListener("popstate", () => queueMicrotask(onRouteChange));
  }

  function startObserver() {
    if (STATE.observer) return;

    STATE.observer = new MutationObserver((mutations) => {
      try {
        removeExploreAndReelsFromSidebar();

        if (isHome()) ensureHomeLogoPlaceholder();

        if (isPostPage()) {
          // Re-run only for added nodes to reduce cost
          for (const m of mutations) {
            for (const n of m.addedNodes || []) {
              if (n?.nodeType === 1) removeMoreContentFromOnPostPage(n);
            }
          }
          // Also do a light full pass occasionally (IG moves nodes around)
          removeMoreContentFromOnPostPage(document);
        }
      } catch (_) {}
    });

    STATE.observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  // Boot
  addStyle(CSS);
  hookHistory();

  const boot = () => {
    startObserver();
    onRouteChange();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
