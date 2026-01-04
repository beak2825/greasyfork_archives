// ==UserScript==
// @name         Canva - Empty All Page Titles (Grid + Lazy-load Safe)
// @namespace    https://www.canva.com/
// @version      1.0.0
// @description  Adds a red "Empty All Titles" button that switches to Grid view, then slowly scrolls and clears every page title input as it appears (lazy-loading safe).
// @match        https://www.canva.com/design/*
// @run-at       document-idle
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561170/Canva%20-%20Empty%20All%20Page%20Titles%20%28Grid%20%2B%20Lazy-load%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561170/Canva%20-%20Empty%20All%20Page%20Titles%20%28Grid%20%2B%20Lazy-load%20Safe%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (window.top !== window.self) return;

  /*************************
   * CONFIG
   *************************/
  const CFG = {
    toolbarSelector: 'div._2WzgFw._8drCYA', // user-provided toolbar container
    buttonAriaLabelGrid: 'Grid view',
    pageTitleInputSelector: 'input[aria-label="Page title"]',
    scrollStepMin: 300,
    scrollStepMax: 500,
    postScrollWaitMs: 500,
    initialGridWaitMs: 1200,
    initialTopWaitMs: 700,
    bottomNoNewPassesToStop: 4,     // how many "bottom passes" with no new titles before stopping
    bottomExtraJigglePx: 60,        // small jiggle to encourage lazy load
    maxIterations: 5000,            // safety cutoff
    logPrefix: "[Canva Empty Titles]"
  };

  let running = false;

  /*************************
   * STYLES
   *************************/
  if (typeof GM_addStyle === "function") {
    GM_addStyle(`
      .tm-empty-titles-btn {
        background: #e60023 !important;
        color: #fff !important;
        border: 1px solid rgba(0,0,0,0.15) !important;
        border-radius: 8px !important;
        padding: 8px 12px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        margin-left: 8px !important;
        line-height: 1 !important;
      }
      .tm-empty-titles-btn:hover { filter: brightness(0.95) !important; }
      .tm-empty-titles-btn:active { transform: translateY(1px) !important; }
      .tm-empty-titles-btn[disabled] {
        opacity: 0.6 !important;
        cursor: not-allowed !important;
      }
    `);
  }

  /*************************
   * LOG HELPERS
   *************************/
  const log = (...args) => console.log(CFG.logPrefix, ...args);
  const warn = (...args) => console.warn(CFG.logPrefix, ...args);
  const err = (...args) => console.error(CFG.logPrefix, ...args);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const randInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

  /*************************
   * DOM / TOOLBAR BUTTON INJECTION
   *************************/
  function waitForToolbarAndInject() {
    const tryInject = () => {
      const toolbar = document.querySelector(CFG.toolbarSelector);
      if (!toolbar) return false;

      // Prevent duplicates
      if (toolbar.querySelector(".tm-empty-titles-btn")) return true;

      const btn = document.createElement("button");
      btn.className = "tm-empty-titles-btn";
      btn.type = "button";
      btn.textContent = "Empty All Titles";
      btn.addEventListener("click", async () => {
        if (running) {
          warn("Already running; ignoring click.");
          return;
        }
        running = true;
        btn.disabled = true;

        try {
          await emptyAllTitlesWorkflow();
        } catch (e) {
          err("Workflow crashed:", e);
        } finally {
          running = false;
          btn.disabled = false;
        }
      });

      // Add beside existing toolbar buttons
      toolbar.appendChild(btn);
      log("Injected button into toolbar:", toolbar);
      return true;
    };

    if (tryInject()) return;

    const mo = new MutationObserver(() => {
      if (tryInject()) mo.disconnect();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // Also fallback polling (Canva can replace DOM nodes rapidly)
    const iv = setInterval(() => {
      if (tryInject()) clearInterval(iv);
    }, 1000);

    log("Waiting for toolbar:", CFG.toolbarSelector);
  }

  /*************************
   * GRID VIEW
   *************************/
  async function clickGridViewButton() {
    const gridBtn = document.querySelector(`button[aria-label="${CSS.escape(CFG.buttonAriaLabelGrid)}"]`);
    if (!gridBtn) {
      warn('Grid view button not found: button[aria-label="Grid view"]');
      return false;
    }

    const pressed = gridBtn.getAttribute("aria-pressed");
    if (pressed === "true") {
      log("Grid view appears already enabled (aria-pressed=true). Not clicking.");
      return true;
    }

    log("Clicking Grid view button...");
    gridBtn.click();
    await sleep(CFG.initialGridWaitMs);

    log("Grid view click done. (Waited", CFG.initialGridWaitMs, "ms)");
    return true;
  }

  /*************************
   * FIND A GOOD SCROLL CONTAINER
   * Canva often uses an internal scrollable div rather than window scrolling.
   *************************/
  function getScrollableAncestors(el) {
    const out = [];
    let cur = el;
    while (cur && cur !== document.documentElement) {
      const cs = window.getComputedStyle(cur);
      const oy = cs.overflowY;
      const canScroll = (oy === "auto" || oy === "scroll") && cur.scrollHeight > cur.clientHeight + 10;
      if (canScroll) out.push(cur);
      cur = cur.parentElement;
    }
    return out;
  }

  function pickScrollElement() {
    // 1) If any page title input exists, pick its nearest scrollable ancestor
    const firstTitle = document.querySelector(CFG.pageTitleInputSelector);
    if (firstTitle) {
      const anc = getScrollableAncestors(firstTitle);
      if (anc.length) {
        log("Using scroll container from page title ancestor:", anc[0]);
        return anc[0];
      }
    }

    // 2) Try some likely containers (best-effort)
    const candidates = [
      document.querySelector('main'),
      document.querySelector('[role="main"]'),
      document.querySelector('[aria-label*="Pages" i]'),
      document.querySelector('[data-testid*="page" i]'),
      document.querySelector('#root')
    ].filter(Boolean);

    for (const c of candidates) {
      const cs = window.getComputedStyle(c);
      const oy = cs.overflowY;
      if ((oy === "auto" || oy === "scroll") && c.scrollHeight > c.clientHeight + 10) {
        log("Using candidate scroll container:", c);
        return c;
      }
      // search inside candidate for a scrollable element
      const inner = c.querySelectorAll("*");
      for (const node of inner) {
        const css = window.getComputedStyle(node);
        const oyy = css.overflowY;
        if ((oyy === "auto" || oyy === "scroll") && node.scrollHeight > node.clientHeight + 10) {
          log("Using inner scroll container:", node);
          return node;
        }
      }
    }

    // 3) Fallback to document scrolling element
    log("Falling back to document.scrollingElement for scrolling.");
    return document.scrollingElement || document.documentElement;
  }

  /*************************
   * CLEAR INPUT VALUE (React-friendly)
   *************************/
  function setNativeValue(input, value) {
    const proto = Object.getPrototypeOf(input);
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    const setter = desc && desc.set;
    if (setter) setter.call(input, value);
    else input.value = value;
  }

  function dispatchInputEvents(input) {
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function dispatchEnterKey(input) {
    const down = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13
    });
    const up = new KeyboardEvent("keyup", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13
    });
    input.dispatchEvent(down);
    input.dispatchEvent(up);
  }

  function emptyTitleInputNow(input) {
    try {
      const before = (input.value ?? "").trim();
      if (!before) return { changed: false, before };

      // IMPORTANT: only "processed" when we actually empty a non-empty value
      input.focus();
      setNativeValue(input, "");
      dispatchInputEvents(input);
      dispatchEnterKey(input);
      input.blur();

      const after = (input.value ?? "").trim();
      log("Emptied title:", { before, after });
      return { changed: true, before, after };
    } catch (e) {
      err("Failed to empty an input:", e, input);
      return { changed: false, error: e };
    }
  }

  /*************************
   * SCAN & EMPTY ALL VISIBLE TITLES
   *************************/
  function scanAndEmptyVisibleTitles() {
    const inputs = Array.from(document.querySelectorAll(CFG.pageTitleInputSelector));
    let emptied = 0;
    let nonEmptySeen = 0;

    for (const input of inputs) {
      const val = (input.value ?? "").trim();

      // DO NOT "process" empties; if Canva lazy-loads a value later, we must catch it later.
      if (val.length > 0) {
        nonEmptySeen++;
        const r = emptyTitleInputNow(input);
        if (r.changed) emptied++;
      }
    }

    log(`Scan complete. Found ${inputs.length} title inputs in DOM. Non-empty seen: ${nonEmptySeen}. Emptied: ${emptied}.`);
    return { inputsInDom: inputs.length, nonEmptySeen, emptied };
  }

  /*************************
   * SCROLL LOOP (lazy-load safe)
   *************************/
  async function scrollAndEmptyLoop() {
    const scrollEl = pickScrollElement();

    // Jump to top and start from there
    scrollEl.scrollTop = 0;
    log("Scrolled to top. scrollTop=", scrollEl.scrollTop);
    await sleep(CFG.initialTopWaitMs);

    let bottomPassesNoNew = 0;
    let iterations = 0;

    // Track bottom stability to avoid stopping too early while Canva loads more
    let lastScrollHeight = scrollEl.scrollHeight;

    while (iterations < CFG.maxIterations) {
      iterations++;

      const scan = scanAndEmptyVisibleTitles();
      await sleep(CFG.postScrollWaitMs);

      const atBottom = scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 2;

      // If we are at bottom, do "bottom pass" logic.
      if (atBottom) {
        const scrollHeightNow = scrollEl.scrollHeight;
        const grew = scrollHeightNow > lastScrollHeight + 5;

        if (grew) {
          log("Scroll height increased at bottom (more lazy-loaded content). Continuing.", {
            lastScrollHeight,
            scrollHeightNow
          });
          lastScrollHeight = scrollHeightNow;
          bottomPassesNoNew = 0;
        } else {
          // Jiggle a bit to encourage any last lazy-load events
          scrollEl.scrollTop = Math.max(0, scrollEl.scrollTop - CFG.bottomExtraJigglePx);
          await sleep(CFG.postScrollWaitMs);
          scrollEl.scrollTop = scrollEl.scrollHeight;
          await sleep(CFG.postScrollWaitMs);

          // Re-scan after jiggle
          const scan2 = scanAndEmptyVisibleTitles();
          await sleep(CFG.postScrollWaitMs);

          const anyNewNonEmpty = (scan.nonEmptySeen + scan2.nonEmptySeen) > 0;
          const anyEmptied = (scan.emptied + scan2.emptied) > 0;

          if (!anyNewNonEmpty && !anyEmptied) {
            bottomPassesNoNew++;
            log(`At bottom; no new non-empty titles. bottomPassesNoNew=${bottomPassesNoNew}/${CFG.bottomNoNewPassesToStop}`);
          } else {
            bottomPassesNoNew = 0;
            log("At bottom; still finding titles to clear. Reset bottomPassesNoNew=0");
          }

          if (bottomPassesNoNew >= CFG.bottomNoNewPassesToStop) {
            log("STOP condition met: reached bottom multiple times with no new non-empty titles.");
            break;
          }
        }
      } else {
        // Not at bottom: continue incremental scrolling
        const step = randInt(CFG.scrollStepMin, CFG.scrollStepMax);
        const next = Math.min(scrollEl.scrollTop + step, scrollEl.scrollHeight);
        scrollEl.scrollTop = next;

        log("Scrolled down step:", step, "=> scrollTop:", scrollEl.scrollTop, " / scrollHeight:", scrollEl.scrollHeight);
      }
    }

    if (iterations >= CFG.maxIterations) {
      warn("Safety stop: maxIterations reached. You may want to increase CFG.maxIterations if you have a huge design.");
    }
  }

  /*************************
   * MAIN WORKFLOW
   *************************/
  async function emptyAllTitlesWorkflow() {
    log("=== START Empty All Titles workflow ===");

    // 1) Switch to Grid view first
    await clickGridViewButton();

    // 2) Slow continuous scroll from top to bottom; delete immediately as encountered
    await scrollAndEmptyLoop();

    // 3) Final scan (just in case)
    const finalScan = scanAndEmptyVisibleTitles();
    log("Final scan result:", finalScan);

    log("=== DONE Empty All Titles workflow ===");
  }

  // Inject button
  waitForToolbarAndInject();
})();
