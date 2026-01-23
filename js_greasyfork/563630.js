// ==UserScript==
// @name         ChatGPT Auto-open + auto-dismiss "Open link" popup
// @namespace    https://mekineer.com
// @author       marcos and Nova (ChatGPt 5.2 Thinking)
// @version      1.1
// @license      GPL-3.0-or-later
// @description  Opens the URL in a background tab, then closes the popup by clicking (no navigation) or Escape
// @match        https://chatgpt.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/563630/ChatGPT%20Auto-open%20%2B%20auto-dismiss%20%22Open%20link%22%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/563630/ChatGPT%20Auto-open%20%2B%20auto-dismiss%20%22Open%20link%22%20popup.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BTN_SELECTOR = 'a.btn.btn-primary[href][target="_blank"]';
  const BUTTON_TEXT = "open link";

  const handled = new WeakSet();

  function looksLikeOpenLinkButton(a) {
    const txt = (a.textContent || "").trim().toLowerCase();
    return txt === BUTTON_TEXT;
  }

  function openInBackground(url) {
    if (typeof GM_openInTab === "function") {
      try {
        GM_openInTab(url, { active: false, insert: true });
        return true;
      } catch (_) {
        try {
          // Greasemonkey legacy signature
          GM_openInTab(url, true);
          return true;
        } catch (_) {}
      }
    }
    return false;
  }

  // Click the button but prevent navigation so it only dismisses the popup UI
  function clickToDismissWithoutNavigating(a) {
    let removed = false;

    const preventDefaultOnly = (e) => {
      // Important: prevent default navigation, but DO NOT stop propagation
      // so the site's own click handlers still run and close the popup.
      e.preventDefault();
    };

    a.addEventListener("click", preventDefaultOnly, true); // capture phase

    // Click (and also fire mouse events for picky UIs)
    a.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, button: 0 }));
    a.dispatchEvent(new MouseEvent("mouseup",   { bubbles: true, cancelable: true, button: 0 }));
    a.click();

    // Cleanup
    a.removeEventListener("click", preventDefaultOnly, true);
    removed = true;

    return removed;
  }

  function pressEscapeFallback() {
    const ev = new KeyboardEvent("keydown", {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true,
    });

    // Try multiple targets; different apps attach the listener differently
    window.dispatchEvent(ev);
    document.dispatchEvent(ev);
    document.body && document.body.dispatchEvent(ev);
  }

  function handleButton(a) {
    if (!a || handled.has(a)) return;
    if (!looksLikeOpenLinkButton(a)) return;

    const url = a.href;
    if (!url || url === "https://..." || url.startsWith("javascript:")) return;

    handled.add(a);

    // 1) Open the URL in background
    openInBackground(url);

    // 2) Dismiss popup UI (click button, but no navigation)
    // small delay helps if UI uses react state / transitions
    setTimeout(() => {
      clickToDismissWithoutNavigating(a);

      // 3) If popup still sticks, Esc usually closes it
      setTimeout(() => {
        pressEscapeFallback();
      }, 50);
    }, 30);
  }

  function scan() {
    document.querySelectorAll(BTN_SELECTOR).forEach(handleButton);
  }

  scan();
  const mo = new MutationObserver(scan);
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
