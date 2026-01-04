// ==UserScript==
// @name         Taobao Auto Buyer (v2.1 - Refresh Window)
// @name:zh-CN   淘宝自动抢购脚本 (v2.1 - 刷新窗口版)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Automated Taobao flash buying script with scheduled purchasing, price range targeting, aggressive refresh window, automated checkout and order submission. Features dry run mode for safe testing.
// @description:zh-CN  淘宝自动抢购脚本，支持定时购买、价格区间筛选、激进刷新窗口、自动结算和订单提交。包含安全测试模式，专为秒杀活动优化。
// @author       dexhunter
// @license      MIT
// @match        *://cart.taobao.com/cart.htm*
// @match        *://buy.taobao.com/auction/order/confirm_order.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549141/Taobao%20Auto%20Buyer%20%28v21%20-%20Refresh%20Window%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549141/Taobao%20Auto%20Buyer%20%28v21%20-%20Refresh%20Window%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  (() => {
    // ===================== CONFIG =====================
    const MIN = 2000;
    const MAX = 6000;
    const TARGET_TIME = "20:00:00"; // HH:MM:SS local time to start the buying window
    const BUYING_WINDOW_SECONDS = 5; // NEW: How long to aggressively refresh and check.
    const START_IN_MS = null; // Overrides TARGET_TIME for quick testing (e.g., 5000 for 5s)
    const START_EARLY_MS = 10_000; // How early to "wake up" before the target time
    const DRY_RUN = false; // Set to true for testing. Never clicks checkout/submit.
    const AUTO_CHECKOUT = true;
    const AUTO_SUBMIT = true;

    // ===================== SELECTORS =====================
    const ROW_SELECTOR = "[class*='cartItemInfoContainer']";
    const PRICE_INT = "span.trade-price-integer";
    const ANT_WRAP = "label.ant-checkbox-wrapper";
    const ANT_INPUT = "input.ant-checkbox-input";
    const CHECKOUT_CANDIDATES = ["[class*='btn--']", "button", "div", "a"];
    const ORDER_SUBMIT_MATCH_TEXT = /提交订单/;
    const ORDER_SUBMIT_CANDIDATES = ["[class*='btn--']", "div", "button", "a"];

    // ===================== UTILS =====================
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const num = (t) => {
      if (!t) return NaN;
      const x = (t + "").replace(/[,，\s￥¥]/g, "").replace(/[^0-9.]/g, "");
      return Number.isFinite(Number(x)) ? Number(x) : NaN;
    };
    const isClickable = (el) => {
      if (!el) return false;
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0" || s.pointerEvents === 'none') return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };
    const findByText = (candidates, re) => {
      for (const sel of candidates) {
        for (const el of document.querySelectorAll(sel)) {
          if (re.test((el.textContent || "").trim())) return el;
        }
      }
      return null;
    };
    const forceClick = (element) => {
      if (!element) return;
      const dispatchMouseEvent = (type) => {
        element.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true }));
      };
      console.log("[auto-buyer] Executing force click on:", element);
      dispatchMouseEvent('mousedown');
      dispatchMouseEvent('mouseup');
      dispatchMouseEvent('click');
    };

    // ===================== LOGIC FOR CART PAGE =====================

    async function attemptFromCart() {
      console.log(`[auto-buyer] Checking for items in price range...`);
      const rows = Array.from(document.querySelectorAll(ROW_SELECTOR));
      if (!rows.length) return { progressed: false };

      // First, deselect all items to ensure a clean slate.
      for (const row of rows) {
        const input = row.querySelector(ANT_INPUT);
        if (input && input.checked) {
          const wrapper = row.querySelector(ANT_WRAP);
          if (wrapper && !DRY_RUN) wrapper.click();
          await sleep(50); // Small pause between clicks
        }
      }

      // Now, find and select the target item.
      let itemFound = false;
      for (const row of rows) {
        const p = num(row.querySelector(PRICE_INT)?.textContent);
        if (Number.isFinite(p) && p > MIN && p < MAX) {
          console.log(`[auto-buyer] SUCCESS: Found item in price range (Price: ${p})`);
          itemFound = true;
          row.style.outline = "3px solid limegreen";
          const wrapper = row.querySelector(ANT_WRAP);
          if (wrapper && !DRY_RUN) {
            wrapper.click();
            await sleep(150); // Wait for price to recalculate
          }
          break; // Stop after finding the first one
        }
      }

      if (!itemFound) {
        console.log(`[auto-buyer] No item found in price range.`);
        return { progressed: false };
      }

      if (DRY_RUN || !AUTO_CHECKOUT) {
        console.log("[auto-buyer] DRY RUN: Would have clicked checkout.");
        return { progressed: false }; // Don't proceed, but don't refresh either.
      }

      const checkoutBtn = findByText(CHECKOUT_CANDIDATES, /结算/);
      if (!isClickable(checkoutBtn)) {
        console.warn("[auto-buyer] Checkout button not ready, will retry/refresh.");
        return { progressed: false };
      }

      console.log("[auto-buyer] Item selected. Clicking checkout button!");
      checkoutBtn.click();
      return { progressed: true };
    }

    async function aggressiveRefreshLoop(deadline) {
      console.log(`[auto-buyer] Entering refresh loop. Window ends at ${new Date(deadline).toLocaleString()}`);
      
      const result = await attemptFromCart();

      if (result.progressed) {
        console.log("[auto-buyer] Checkout initiated. Exiting loop.");
        sessionStorage.removeItem('buyWindowEndTime');
        return;
      }

      if (Date.now() < deadline) {
        console.log("[auto-buyer] Item not ready. Refreshing page to try again...");
        // Wait a very short, slightly random time before reloading
        await sleep(300 + Math.random() * 200);
        location.reload();
      } else {
        console.log(`[auto-buyer] ${BUYING_WINDOW_SECONDS}-second window has expired. Forfeiting attempt.`);
        sessionStorage.removeItem('buyWindowEndTime');
      }
    }

    async function scheduleCartChecker() {
      let target;
      if (START_IN_MS != null) {
        target = new Date(Date.now() + START_IN_MS);
        console.log(`[auto-buyer] Test run scheduled in ${START_IN_MS / 1000}s`);
      } else {
        const [hh, mm, ss] = TARGET_TIME.split(":").map(Number);
        target = new Date();
        target.setHours(hh, mm, ss || 0, 0);
        if (target <= new Date()) target.setDate(target.getDate() + 1);
        console.log(`[auto-buyer] Scheduled for ${target.toLocaleString()}`);
      }
      
      const msUntilTarget = target - new Date();
      if (msUntilTarget > START_EARLY_MS) {
        console.log("[auto-buyer] Sleeping until the ramp-up window.");
        await sleep(msUntilTarget - START_EARLY_MS);
      }

      console.log("[auto-buyer] Ramping up...");
      while (new Date() < target) await sleep(50);

      console.log("[auto-buyer] TARGET REACHED — starting aggressive refresh loop.");
      const deadline = Date.now() + (BUYING_WINDOW_SECONDS * 1000);
      sessionStorage.setItem('buyWindowEndTime', deadline);
      aggressiveRefreshLoop(deadline);
    }

    // ===================== LOGIC FOR CONFIRMATION PAGE =====================

    function handleConfirmPage() {
      console.log("[auto-buyer] Confirmation page logic activated. Waiting for submit button...");
      if (DRY_RUN || !AUTO_SUBMIT) {
        console.log("[auto-buyer] DRY RUN: Would have clicked submit order.");
        return;
      }
      
      let clickAttempted = false;
      const TIMEOUT_MS = 15000;
      const findAndClick = () => {
        if (clickAttempted) return;
        const submitBtn = findByText(ORDER_SUBMIT_CANDIDATES, ORDER_SUBMIT_MATCH_TEXT);
        if (isClickable(submitBtn)) {
          clickAttempted = true;
          console.log("[auto-buyer] Submit button is ready! Forcing click now.");
          forceClick(submitBtn);
          if (observer) observer.disconnect();
          if (timeoutId) clearTimeout(timeoutId);
        }
      };

      const observer = new MutationObserver(findAndClick);
      observer.observe(document.body, { childList: true, subtree: true });
      const timeoutId = setTimeout(() => {
        observer.disconnect();
        if (!clickAttempted) console.error(`[auto-buyer] FAILED: Submit button not found within ${TIMEOUT_MS / 1000}s.`);
      }, TIMEOUT_MS);
      
      findAndClick(); // Initial check
    }

    // ===================== BOOTSTRAPPER =====================
    
    function main() {
      console.log("[auto-buyer] Script loaded on:", location.href);
      if (location.pathname.includes("cart.htm")) {
        const windowEnd = sessionStorage.getItem('buyWindowEndTime');
        if (windowEnd && Date.now() < parseInt(windowEnd)) {
          // A refresh happened, we are inside the buying window.
          aggressiveRefreshLoop(parseInt(windowEnd));
        } else {
          // We are outside the window, schedule for the next time.
          sessionStorage.removeItem('buyWindowEndTime');
          scheduleCartChecker();
        }
      } else if (location.pathname.includes("confirm_order.htm")) {
        handleConfirmPage();
      }
    }

    main();
  })();
})();