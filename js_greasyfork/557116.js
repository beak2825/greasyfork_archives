// ==UserScript==
// @name         Wykop – mobilny pasek: pojedynczy toggle (fix podwójnej strzałki)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Bezpieczna wersja: tylko 1 przycisk po lewej, ukrywa drobne ikony w pasku, zapamiętuje stan, animacja.
// @match        *://wykop.pl/*
// @match        *://*.wykop.pl/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557116/Wykop%20%E2%80%93%20mobilny%20pasek%3A%20pojedynczy%20toggle%20%28fix%20podw%C3%B3jnej%20strza%C5%82ki%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557116/Wykop%20%E2%80%93%20mobilny%20pasek%3A%20pojedynczy%20toggle%20%28fix%20podw%C3%B3jnej%20strza%C5%82ki%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "kraw_mobile_nav_hidden_v1";
  const HIDDEN_CLASS = "kraw-nav-hidden";

  GM_addStyle(`
    .mobile-navbar {
      transition: transform 360ms cubic-bezier(.2,.9,.2,1), opacity 260ms ease;
      will-change: transform, opacity;
    }
    .mobile-navbar.${HIDDEN_CLASS} {
      transform: translateY(110%);
      opacity: 0;
      pointer-events: none;
    }

    /* external single toggle button (left, simple box) */
    #kraw-nav-toggle {
      position: fixed;
      left: 5px;
      z-index: 2147483646; /* very high but under browser chrome */
      bottom: 0px;
      width: 33px;
      height: 33px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: rgba(18,18,18,0.92); /* more opaque to avoid reflection artifacts */
      color: #fff;
      font-size: 20px;
      line-height: 1;
      box-shadow: 0 6px 18px rgba(0,0,0,0.35);
      cursor: pointer;
      user-select: none;
      transition: transform 180ms ease, opacity 220ms ease, bottom 240ms ease;
      opacity: 0.84;
      -webkit-tap-highlight-color: transparent;
    }
    #kraw-nav-toggle:hover { transform: scale(1.06); opacity: 1; }
    #kraw-nav-toggle .kraw-triangle { display:inline-block; transform: translateY(-0.5px); line-height:1; }

    /* hide tiny icons inside mobile navbar that look like arrows (best-effort) */
    .mobile-navbar .kraw-hide-small-icon {
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }
  `);

  // create external toggle if missing
  function createExternalToggle() {
    let t = document.getElementById("kraw-nav-toggle");
    if (t) return t;
    t = document.createElement("button");
    t.id = "kraw-nav-toggle";
    t.type = "button";
    const span = document.createElement("span");
    span.className = "kraw-triangle";
    span.textContent = "▿";
    t.appendChild(span);
    document.body.appendChild(t);
    return t;
  }

  // best-effort: hide tiny icons (i/svg) inside nav that might be duplicate arrows
  function hideSmallIconsInNav(nav) {
    if (!nav) return;
    // find icons (i, svg, .icon, span) that are very small (<=26px)
    const candidates = nav.querySelectorAll("i, svg, span, .icon");
    candidates.forEach(el => {
      try {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.width <= 26 && r.height > 0 && r.height <= 26) {
          // mark it so CSS rule hides it
          el.classList.add("kraw-hide-small-icon");
        }
      } catch (e) { /* ignore */ }
    });
  }

  // set nav hidden/shown
  function setNavHidden(nav, hidden, toggle) {
    if (!nav || !toggle) return;
    if (hidden) {
      nav.classList.add(HIDDEN_CLASS);
      toggle.querySelector(".kraw-triangle").textContent = "▵";
      toggle.style.bottom = "12px";
    } else {
      nav.classList.remove(HIDDEN_CLASS);
      // position above nav so it doesn't overlap
      const h = nav.getBoundingClientRect().height || 56;
      toggle.style.bottom = (h + 12) + "px";
      toggle.querySelector(".kraw-triangle").textContent = "▿";
    }
    try { localStorage.setItem(STORAGE_KEY, hidden ? "1" : "0"); } catch (e) {}
  }

  // single init function
  function init() {
    const nav = document.querySelector(".mobile-navbar");
    if (!nav) return false;

    const toggle = createExternalToggle();

    // hide tiny possible arrow icons inside nav (best-effort)
    hideSmallIconsInNav(nav);

    // restore state
    const stored = localStorage.getItem(STORAGE_KEY) === "1";
    setNavHidden(nav, stored, toggle);

    // click toggle
    if (!toggle._kraw_handler) {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const nowHidden = nav.classList.contains(HIDDEN_CLASS);
        setNavHidden(nav, !nowHidden, toggle);
      });
      toggle._kraw_handler = true;
    }

    // update position on resize
    if (!window._kraw_resize_bound) {
      window.addEventListener("resize", () => {
        if (!nav.classList.contains(HIDDEN_CLASS)) {
          const h = nav.getBoundingClientRect().height || 56;
          document.getElementById("kraw-nav-toggle").style.bottom = (h + 12) + "px";
        } else {
          document.getElementById("kraw-nav-toggle").style.bottom = "12px";
        }
      });
      window._kraw_resize_bound = true;
    }

    return true;
  }

  // wait for DOM + observe briefly until nav appears
  function start() {
    if (init()) return;
    const mo = new MutationObserver((muts, obs) => {
      if (init()) obs.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    // fallback attempts
    setTimeout(() => init(), 700);
    setTimeout(() => init(), 1600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else start();

})();
