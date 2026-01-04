// ==UserScript==
// @name         Torn: Zip Tie Quick Buy
// @namespace    wintervalor.mexico_header_quick_buy
// @version      0.3.0
// @description  Adds a Buy button next to the "Mexico" title. Amount is user-editable and saved for future uses.
// @author       WinterValor
// @match        https://www.torn.com/index.php*
// @match        https://www.torn.com/*#*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550989/Torn%3A%20Zip%20Tie%20Quick%20Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/550989/Torn%3A%20Zip%20Tie%20Quick%20Buy.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ---------- CONFIG ----------
  const CONFIG = {
    ITEM_ID: 340, // Zip Ties
    AMOUNT: 58, // default if nothing saved yet
    BUTTON_TEXT: "Buy Zip Ties",
    BUTTON_STYLE: `
      margin-left: 8px;
      color: var(--default-blue-color);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid var(--default-blue-color);
      background: transparent;
      font-weight: 600;
      line-height: 1;
    `,
    INPUT_STYLE: `
      margin-left: 8px;
      width: 70px;
      padding: 3px 6px;
      border-radius: 6px;
      border: 1px solid var(--default-blue-color);
      background: transparent;
      color: inherit;
      font-weight: 600;
      line-height: 1.2;
      text-align: right;
    `,
    RESULT_STYLE:
      "font-size:12px;font-weight:400;margin-left:8px;vertical-align:middle;",
  };
  // ----------------------------

  const BTN_ID = "mxHeaderQuickBuyBtn";
  const INPUT_ID = "mxHeaderQuickBuyAmount";
  const RES_ID = "mxHeaderQuickBuyResult";
  const STORAGE_KEY = `mxqb.amount.${CONFIG.ITEM_ID}`; // per item ID

  // ------------- helpers -------------
  function isInMexico() {
    // info banner with "You are in Mexico"
    const banners = Array.from(
      document.querySelectorAll(".info-msg-cont.user-info .msg")
    );
    return banners.some((b) =>
      /you\s+are\s+in\s+mexico/.test((b.textContent || "").toLowerCase())
    );
  }

  function findMexicoHeaderH4() {
    const allH4 = Array.from(
      document.querySelectorAll(
        ".content-title h4.left, .content-title > h4, h4.left"
      )
    );
    return (
      allH4.find(
        (h) => (h.textContent || "").trim().toLowerCase() === "mexico"
      ) || null
    );
  }

  function getAvailableCap() {
    // hidden input present on travel shop pages; safe to ignore if absent
    const el = document.querySelector("input.availableItemsAmount");
    const raw = el?.value || "";
    const num = parseInt(String(raw).replace(/[^\d]/g, ""), 10);
    return Number.isFinite(num) && num > 0 ? num : null;
  }

  function getStoredAmount() {
    const v = localStorage.getItem(STORAGE_KEY);
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n > 0 ? n : CONFIG.AMOUNT;
  }

  function setStoredAmount(n) {
    if (Number.isFinite(n) && n > 0)
      localStorage.setItem(STORAGE_KEY, String(n));
  }

  function getCurrentAmount() {
    const inp = document.getElementById(INPUT_ID);
    if (inp) {
      const n = parseInt(inp.value, 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
    return getStoredAmount();
  }

  function clampToMax(n) {
    const max = getAvailableCap();
    if (max && n > max) return max;
    return n;
  }

  // ------------- inject UI -------------
  function injectButton() {
    // avoid duplicates
    if (document.getElementById(BTN_ID) && document.getElementById(INPUT_ID))
      return;

    const h4 = findMexicoHeaderH4();
    if (!h4) return;
    if (!isInMexico()) return; // only show if banner confirms you're in Mexico

    // Button
    if (!document.getElementById(BTN_ID)) {
      const btn = document.createElement("button");
      btn.id = BTN_ID;
      btn.textContent = CONFIG.BUTTON_TEXT;
      btn.setAttribute("style", CONFIG.BUTTON_STYLE);
      btn.addEventListener("click", doBuy);
      h4.appendChild(btn);
    }

    // Amount input (persistent)
    if (!document.getElementById(INPUT_ID)) {
      const inp = document.createElement("input");
      inp.id = INPUT_ID;
      inp.type = "number";
      inp.min = "1";
      const cap = getAvailableCap();
      if (cap) inp.max = String(cap);
      // load stored or default
      inp.value = clampToMax(getStoredAmount());
      inp.setAttribute("aria-label", "Amount to buy");
      inp.setAttribute("style", CONFIG.INPUT_STYLE);

      // save on input/blur; Enter triggers buy
      const persist = () => {
        let n = parseInt(inp.value, 10);
        if (!Number.isFinite(n) || n <= 0) n = 1;
        n = clampToMax(n);
        inp.value = String(n);
        setStoredAmount(n);
      };
      inp.addEventListener("input", persist);
      inp.addEventListener("change", persist);
      inp.addEventListener("blur", persist);
      inp.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          persist();
          doBuy();
        }
      });

      h4.appendChild(inp);
    }

    // Result span
    if (!document.getElementById(RES_ID)) {
      const res = document.createElement("span");
      res.id = RES_ID;
      res.setAttribute("style", CONFIG.RESULT_STYLE);
      h4.appendChild(res);
    }
  }

  // ------------- action -------------
  function doBuy() {
    const out = document.getElementById(RES_ID);
    if (out) {
      out.textContent = "...";
      out.style.color = "";
    }

    const amount = getCurrentAmount(); // use persisted/current value
    setStoredAmount(amount); // make sure latest is saved

    const payload = {
      step: "buyShopItem",
      ID: CONFIG.ITEM_ID,
      amount: amount,
      travelShop: 1,
    };

    // Prefer Torn’s helper if available
    if (typeof window.getAction === "function") {
      window.getAction({
        type: "post",
        action: "shops.php",
        data: payload,
        success: (str) => handleResponse(out, str),
        error: () => handleError(out, "Request failed."),
      });
      return;
    }

    // Fallbacks
    if (window.jQuery) {
      window.jQuery.ajax({
        type: "POST",
        url: "/shops.php",
        data: payload,
        success: (str) => handleResponse(out, str),
        error: () => handleError(out, "Request failed."),
      });
      return;
    }

    fetch("/shops.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: new URLSearchParams(payload),
    })
      .then((r) => r.text())
      .then((str) => handleResponse(out, str))
      .catch(() => handleError(out, "Request failed."));
  }

  function handleResponse(out, str) {
    try {
      const msg = JSON.parse(str);
      if (out) {
        out.innerHTML = msg.text || "";
        out.style.color = msg.success ? "green" : "red";
      }
    } catch (e) {
      console.log(e);
      handleError(out, "Unexpected response.");
    }
  }

  function handleError(out, text) {
    if (out) {
      out.textContent = text;
      out.style.color = "red";
    }
  }

  // ------------- boot / SPA resilience -------------
  function boot() {
    injectButton();

    const obs = new MutationObserver(() => {
      // re-inject if header re-renders
      if (
        !document.getElementById(BTN_ID) ||
        !document.getElementById(INPUT_ID)
      ) {
        injectButton();
      } else {
        // update input max if cap changed
        const inp = document.getElementById(INPUT_ID);
        const cap = getAvailableCap();
        if (inp && cap && inp.max !== String(cap)) {
          inp.max = String(cap);
          // clamp current value to new cap
          const n = clampToMax(parseInt(inp.value, 10) || 1);
          if (String(n) !== inp.value) {
            inp.value = String(n);
            setStoredAmount(n);
          }
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("popstate", injectButton);
    window.addEventListener("hashchange", injectButton);
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(boot, 0);
  } else {
    document.addEventListener("DOMContentLoaded", boot);
  }
})();
