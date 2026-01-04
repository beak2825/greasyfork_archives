// ==UserScript==
// @name         Torn Trade • Floating Accept/Cancel (PDA/Mobile)
// @namespace    https://greasyfork.org/en/scripts/553137-torn-trade-floating-accept-cancel-buttons
// @version      1.1.0
// @description  Compact floating Accept/Cancel for Torn trade page with touch dragging (made for Torn PDA/mobile). Buttons stay side-by-side and mirror the native ones.
// @author       KillerCleat [2842410]
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/553137-torn-trade-floating-accept-cancel-buttons
// @source       https://greasyfork.org/en/scripts/553137-torn-trade-floating-accept-cancel-buttons
// @supportURL   https://greasyfork.org/en/scripts/553137-torn-trade-floating-accept-cancel-buttons/feedback
// @match        https://www.torn.com/trade.php*
// @match        https://www.torn.com/page.php?sid=Trade*
// @include      https://www.torn.com/trade.php*
// @include      https://www.torn.com/page.php?sid=Trade*
// @icon         https://www.torn.com/favicon.ico
// @run-at       document-idle
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553142/Torn%20Trade%20%E2%80%A2%20Floating%20AcceptCancel%20%28PDAMobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553142/Torn%20Trade%20%E2%80%A2%20Floating%20AcceptCancel%20%28PDAMobile%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /***** SETTINGS *****/
  // Default mobile-friendly position (sit above PDA bottom bar; adjust if you like)
  const DEFAULT_POSITION = { bottom: "84px", right: "12px" };
  const START_LOCKED = false;   // start unlocked so you can drag immediately on PDA
  const COMPACT = true;         // smaller paddings/fonts for PDA
  /********************/

  const $  = (s, r=document) => r.querySelector(s);

  const SELECTORS = {
    cancelBtn: "div.cancel-btn-wrap button.torn-btn.orange",
    acceptBtn: "div.cancel-btn-wrap a.torn-btn.green.accept",
    container: "div.cancel-btn-wrap"
  };

  function createBar() {
    const bar = document.createElement("div");
    bar.id = "kc-pda-trade-bar";
    bar.innerHTML = `
      <div class="kc-row" role="toolbar" aria-label="Trade actions">
        <button class="torn-btn orange kc-cancel" type="button">CANCEL</button>
        <a class="torn-btn green kc-accept" role="button">ACCEPT</a>
        <button class="kc-pin" title="Pin/Unpin" aria-label="Pin/Unpin">📌</button>
      </div>
    `;

    // container styling
    Object.assign(bar.style, {
      position: "fixed",
      zIndex: "2147483647", // above PDA chrome
      left: "auto",
      top: "auto",
      background: "rgba(20,20,20,0.92)",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,.35)",
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      padding: COMPACT ? "6px" : "8px",
      ...DEFAULT_POSITION,
    });

    // inner CSS
    const style = document.createElement("style");
    style.textContent = `
      #kc-pda-trade-bar { touch-action: none; }
      #kc-pda-trade-bar .kc-row {
        display:flex; align-items:center; gap:${COMPACT ? "8px" : "10px"};
      }
      #kc-pda-trade-bar .torn-btn{
        text-decoration:none; text-transform:uppercase; font-weight:800;
        border-radius:10px; display:inline-flex; align-items:center; justify-content:center;
        padding:${COMPACT ? "8px 12px" : "10px 14px"};
        min-width:${COMPACT ? "96px" : "110px"};
        font-size:${COMPACT ? "14px" : "15px"};
      }
      #kc-pda-trade-bar .kc-pin{
        border:0; background:transparent; color:#fff; opacity:.8;
        font-size:${COMPACT ? "18px" : "20px"}; padding:${COMPACT ? "2px 6px" : "2px 8px"};
        border-radius:10px; margin-left:${COMPACT ? "2px" : "4px"};
      }
      #kc-pda-trade-bar .kc-pin:hover{ opacity:1; background:rgba(255,255,255,.08) }
      #kc-pda-trade-bar.kc-disabled a.kc-accept{ pointer-events:none; opacity:.5 }
      #kc-pda-trade-bar.kc-disabled button.kc-cancel{ opacity:.5 }
    `;
    document.head.appendChild(style);
    document.body.appendChild(bar);
    return bar;
  }

  function linkButtons(bar) {
    const liveCancel = $(SELECTORS.cancelBtn);
    const liveAccept = $(SELECTORS.acceptBtn);
    const cloneCancel = $(".kc-cancel", bar);
    const cloneAccept = $(".kc-accept", bar);

    if (!liveCancel || !liveAccept) {
      bar.classList.add("kc-disabled");
      cloneCancel.disabled = true;
      cloneAccept.removeAttribute("href");
      return;
    }

    const sync = () => {
      // mirror href
      const href = liveAccept.getAttribute("href");
      if (href) {
        cloneAccept.setAttribute("href", href);
        bar.classList.remove("kc-disabled");
        cloneCancel.disabled = !!(liveCancel.disabled || liveCancel.classList.contains("disabled"));
      } else {
        cloneAccept.removeAttribute("href");
        bar.classList.add("kc-disabled");
      }
      if (liveAccept.classList.contains("disabled")) {
        cloneAccept.removeAttribute("href");
        bar.classList.add("kc-disabled");
      }
    };

    cloneCancel.onclick = (e) => { e.preventDefault(); liveCancel.click(); };
    cloneAccept.onclick = (e) => {
      // if no href, click native
      if (!cloneAccept.getAttribute("href")) { e.preventDefault(); liveAccept.click(); }
    };

    sync();
    const opts = { attributes:true, attributeFilter:["class","href","disabled"] };
    const mo1 = new MutationObserver(sync); mo1.observe(liveAccept, opts);
    const mo2 = new MutationObserver(sync); mo2.observe(liveCancel, opts);
    bar._mo = [mo1, mo2];
  }

  // touch & mouse dragging (works in PDA webview)
  function enableDrag(bar) {
    let locked = START_LOCKED;
    let dragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    const pinBtn = $(".kc-pin", bar);
    const setPinIcon = () => pinBtn.textContent = locked ? "📌" : "📍";
    setPinIcon();

    pinBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      locked = !locked;
      setPinIcon();
    });

    const start = (clientX, clientY) => {
      if (locked) return;
      dragging = true;
      const rect = bar.getBoundingClientRect();
      startX = clientX;
      startY = clientY;
      startLeft = rect.left + window.scrollX;
      startTop  = rect.top  + window.scrollY;
      // switch to top/left while dragging
      bar.style.left = startLeft + "px";
      bar.style.top  = startTop  + "px";
      bar.style.right = "";
      bar.style.bottom = "";
    };
    const move = (clientX, clientY) => {
      if (!dragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      bar.style.left = (startLeft + dx) + "px";
      bar.style.top  = (startTop  + dy) + "px";
    };
    const end = () => { dragging = false; };

    // Mouse
    bar.addEventListener("mousedown", (e) => {
      // ignore direct clicks on links/buttons that aren’t the pin
      if (e.target.closest("a, button:not(.kc-pin)")) return;
      start(e.clientX, e.clientY);
      e.preventDefault();
    }, { passive:false });
    window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
    window.addEventListener("mouseup", end);

    // Touch
    bar.addEventListener("touchstart", (e) => {
      if (e.target.closest("a, button:not(.kc-pin)")) return;
      const t = e.changedTouches[0];
      start(t.clientX, t.clientY);
      e.preventDefault();
    }, { passive:false });
    window.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      const t = e.changedTouches[0];
      move(t.clientX, t.clientY);
    }, { passive:false });
    window.addEventListener("touchend", end, { passive:true });
    window.addEventListener("touchcancel", end, { passive:true });
  }

  function observeForButtons(bar) {
    const relink = () => linkButtons(bar);
    relink();
    const mo = new MutationObserver(() => {
      if ($(SELECTORS.container)) relink();
    });
    mo.observe(document.body, { childList:true, subtree:true });
    bar._rootObserver = mo;
  }

  function init() {
    const bar = createBar();
    enableDrag(bar);
    observeForButtons(bar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
