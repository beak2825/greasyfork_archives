// ==UserScript==
// @name         Digg Post Page Streamlining
// @namespace    Z4CK-tools
// @description  Move the "..." menu to a post's header, prevent title overlap, 
//               and tighten spacing above comments on Digg post pages
// @version      13
// @match        https://*.digg.com/*
// @run-at       document-end
// @license GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/549889/Digg%20Post%20Page%20Streamlining.user.js
// @updateURL https://update.greasyfork.org/scripts/549889/Digg%20Post%20Page%20Streamlining.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const SEL = {
    postRoot: 'main.relative.m-auto.flex',
    postTitle: 'h1',
    postEllipsis: 'button[aria-haspopup="dialog"]',
    sourceFooterExact: 'footer.isolate.mb-6.flex.items-center.justify-between',
    hrRule: 'div[data-orientation="horizontal"]',
    hrWrapExact: 'div.relative.h-8.overflow-y-hidden'
  };

  const MARK_MOVED = "data-moved";
  const MARK_PAD = "data-pad";

  // no leaks
  let ro = null;

  function resetRO() {
    if (ro) {
      ro.disconnect();
      ro = null;
    }
  }

  function reserveRightSpace(btn, dest) {
    const width = Math.ceil(btn.getBoundingClientRect().width) || 40;
    const pad = width + 16;
    if (dest.getAttribute(MARK_PAD) !== String(pad)) {
      dest.style.paddingRight = `${pad}px`;
      dest.setAttribute(MARK_PAD, String(pad));
    }
  }

  function attachResizeSync(btn, h1, dest) {
    resetRO();
    ro = new ResizeObserver(() => reserveRightSpace(btn, dest));
    ro.observe(btn);
    ro.observe(h1);
    reserveRightSpace(btn, dest);
  }

  function moveEllipsisAndReserveSpace(root) {
    const h1 = root.querySelector(SEL.postTitle);
    const footer = root.querySelector(SEL.sourceFooterExact);
    const btn = footer ? footer.querySelector(SEL.postEllipsis) : null;

    if (!h1 || !btn) return false;
    if (btn.getAttribute(MARK_MOVED) === "true") return true;

    const dest = h1.parentElement;
    if (!dest) return false;

    // failsafe check
    if (dest.querySelector(`[${MARK_MOVED}]`)) return true;

    if (getComputedStyle(dest).position === "static") dest.style.position = "relative";

    const shareSave = footer ? footer.querySelector("section") : null;

    btn.style.position = "absolute";
    btn.style.top = `${h1.offsetTop}px`;
    btn.style.right = "0";
    btn.style.zIndex = "10";
    btn.style.margin = "0";
    dest.appendChild(btn);
    btn.setAttribute(MARK_MOVED, "true");
    if (shareSave) shareSave.style.display = "none";

    attachResizeSync(btn, h1, dest);
    return true;
  }
  // trim margins
  function tightenPostSpacing(root) {
    const sourceFooter =
      root.querySelector(SEL.sourceFooterExact) ||
      root.querySelector("footer");
    if (sourceFooter) {
      sourceFooter.style.marginBottom = "8px";
      sourceFooter.style.paddingBottom = "0";
    }

    // kill decorative gradient
    let hrRule = root.querySelector(SEL.hrRule);
    let hrWrap = hrRule ? hrRule.parentElement : root.querySelector(SEL.hrWrapExact);

    if (hrWrap && hrRule) {
      hrWrap.style.height = "auto";
      hrRule.style.display = "block";
      hrRule.style.height = "1px";
      hrRule.style.marginTop = "8px";
      hrRule.style.marginBottom = "8px";

      const gradient = [...hrWrap.children].find(el => el !== hrRule);
      if (gradient) gradient.style.display = "none";

      const prev = hrWrap.previousElementSibling;
      const next = hrWrap.nextElementSibling;
      if (prev) prev.style.marginBottom = "8px";
      if (next) next.style.marginTop = "8px";
    }
  }

  function runOnceForCurrentRoute() {
    const root = document.querySelector(SEL.postRoot);
    if (!root) {
      resetRO();
      return;
    }

    if (moveEllipsisAndReserveSpace(root)) {
      tightenPostSpacing(root);
      return;
    }

    // stay hydrated
    const once = new MutationObserver(() => {
      if (moveEllipsisAndReserveSpace(root)) {
        tightenPostSpacing(root);
        once.disconnect();
      }
    });
    once.observe(root, {
      childList: true,
      subtree: true
    });
    setTimeout(() => once.disconnect(), 1000);
  }

  function hookHistoryOnce() {
    const wrap = fn => {
      const orig = history[fn];
      if (typeof orig !== "function") return;
      history[fn] = function () {
        const ret = orig.apply(this, arguments);
        resetRO();
        setTimeout(runOnceForCurrentRoute, 100);
        return ret;
      };
    };
    wrap("pushState");
    wrap("replaceState");
    window.addEventListener("popstate", () => {
      resetRO();
      setTimeout(runOnceForCurrentRoute, 100);
    });
  }

  // initialize
  setTimeout(runOnceForCurrentRoute, 150);
  hookHistoryOnce();

  // cleanup
  window.addEventListener("beforeunload", resetRO, {
    once: true
  });
})();
