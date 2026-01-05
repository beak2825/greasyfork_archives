// ==UserScript==
// @name         热辣漫画阅读器
// @namespace    manga-tools
// @version      0.1.0
// @description  模拟现实看漫画的逻辑，适用于热辣漫画（`relamanhua.org` / `www.relamanhua.org`）章节页的 **PC 端双页阅读器**：横屏双页并排、右到左翻页、第 1 页单独显示。
// @author       paoMian(https://github.com/panda8246)
// @license      MIT
// @homepageURL  https://github.com/panda8246/RelamanhuaReader
// @supportURL   https://github.com/panda8246/RelamanhuaReader/issues
// @match        https://www.relamanhua.org/comic/*/chapter/*
// @match        https://relamanhua.org/comic/*/chapter/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561462/%E7%83%AD%E8%BE%A3%E6%BC%AB%E7%94%BB%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561462/%E7%83%AD%E8%BE%A3%E6%BC%AB%E7%94%BB%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /** @type {{debug: boolean; lockUnderlyingScroll: boolean; syncUnderlyingScroll: boolean; useUnderlyingLazyloadTrigger: boolean; syncThrottleMs: number; autoDriveUnderlyingScroll: boolean; autoDriveStepPx: number; autoDriveIntervalMs: number; autoDriveStallRounds: number; autoDriveMaxMs: number; autoDriveJitterPx: number}} */
  const CONFIG = {
    debug: false,
    // Lock underlying page scroll while reading in overlay (recommended when underlying has bugs)
    lockUnderlyingScroll: true,
    // Keep underlying list scroll/progress in sync with overlay position
    // so original lazyload/list progress follows the overlay.
    syncUnderlyingScroll: false,
    // Whether to force original site lazyload by setting underlying img.src = img.dataset.src
    // If the original site has issues, keep this OFF and let overlay load images by itself.
    useUnderlyingLazyloadTrigger: false,
    // Throttle to avoid excessive scroll/observer feedback loops.
    syncThrottleMs: 200,

    // Auto-drive underlying page scroll to force original site to create more <li>/<img>
    // Useful when the site only creates a few items initially and relies on scroll to append more.
    autoDriveUnderlyingScroll: true,
    // Scroll step in px for each tick. Keep moderate to avoid skipping triggers.
    autoDriveStepPx: 900,
    // Interval between drive ticks.
    autoDriveIntervalMs: 220,
    // Consider stalled if no new imgs/pages are discovered for N consecutive ticks.
    autoDriveStallRounds: 12,
    // Stop auto drive after max duration (ms).
    autoDriveMaxMs: 30_000,
    // Jitter amount in px when stalled (scroll up then down).
    autoDriveJitterPx: 260,
  };

  /** @param {...any} args */
  function log(...args) {
    if (CONFIG.debug) console.log("[A1Reader]", ...args);
  }

  /** @param {string} msg */
  function warn(msg) {
    console.warn("[A1Reader]", msg);
  }

  function isChapterPage() {
    return /\/comic\/[^/]+\/chapter\/[^/?#]+/.test(location.pathname);
  }

  function main() {
    if (!isChapterPage()) return;
    log("init", location.href);
    const reader = createReader();
    reader.install();
  }

  try {
    main();
  } catch (e) {
    warn("init failed");
    console.error(e);
  }

  function createReader() {
    const STATE = {
      isOpen: false,
      overlayEl: /** @type {HTMLDivElement | null} */ (null),
      topTitleEl: /** @type {HTMLDivElement | null} */ (null),
      spreadEl: /** @type {HTMLDivElement | null} */ (null),
      leftImg: /** @type {HTMLImageElement | null} */ (null),
      rightImg: /** @type {HTMLImageElement | null} */ (null),
      hintEl: /** @type {HTMLDivElement | null} */ (null),
      viewMode: /** @type {"double" | "single"} */ ("double"),
      // Reading direction: rtl = Japanese manga (right->left, LeftArrow next)
      // ltr = modern (left->right, RightArrow next)
      readingDir: /** @type {"rtl" | "ltr"} */ ("rtl"),
      restoreOverflow: /** @type {string | null} */ (null),
      restoreBodyOverflow: /** @type {string | null} */ (null),
      cleanupInputBlockers: /** @type {null | (() => void)} */ (null),

      listEl: /** @type {HTMLUListElement | null} */ (null),
      observer: /** @type {MutationObserver | null} */ (null),
      refreshQueued: false,

      pages: /** @type {string[]} */ ([]),
      imgByUrl: /** @type {Map<string, HTMLImageElement>} */ (new Map()),
      loadedUrls: /** @type {Set<string>} */ (new Set()),
      lastRenderedRight: /** @type {string | null} */ (null),
      lastRenderedLeft: /** @type {string | null} */ (null),
      // 0 = default: page1 single, then (2-3)(4-5)...
      // 1 = alt: pair from start: (1-2)(3-4)...
      pairingMode: 0,

      spreads:
        /** @type {Array<{right?: string; left?: string; rightNo?: number; leftNo?: number}>} */ ([]),
      index: 0,

      lastSyncUrl: /** @type {string | null} */ (null),
      lastSyncTs: 0,

      autoDriveTimer: /** @type {number | null} */ (null),
      autoDriveStartTs: 0,
      autoDriveLastProgressTs: 0,
      autoDriveLastImgCount: 0,
      autoDriveStall: 0,
      autoDriveStartScrollY: 0,
      autoDriveStopReason: /** @type {string | null} */ (null),
    };

    function install() {
      injectStyles();
      buildOverlay();
      attachGlobalHotkeys();
    }

    function injectStyles() {
      if (document.getElementById("tmReaderStyles")) return;
      const style = document.createElement("style");
      style.id = "tmReaderStyles";
      style.textContent = `
        #tmReaderOverlay{
          position:fixed; inset:0; z-index:2147483647;
          background:#000;
          /* Reserve space for bottom hint (updated dynamically in JS) */
          --tmHintH: 44px;
          --tmHintBottom: 18px;
          --tmHintGap: 10px;
          --tmSafeBottom: env(safe-area-inset-bottom, 0px);
          display:none;
          user-select:none;
          -webkit-user-select:none;
          touch-action:manipulation;
        }
        #tmReaderOverlay[data-open="1"]{ display:block; }
        #tmReaderTopBar{
          position:absolute; top:0; left:0; right:0;
          height:44px;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 12px;
          color:#fff;
          font: 14px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,"Noto Sans","PingFang SC","Microsoft YaHei",sans-serif;
          background:linear-gradient(to bottom, rgba(0,0,0,.72), rgba(0,0,0,0));
          pointer-events:none;
        }
        #tmReaderTopBar .tmReaderTitle{ opacity:.9; }
        #tmReaderTopBar .tmReaderHelp{ opacity:.75; }
        #tmReaderSpread{
          position:absolute; inset:0;
          /* Scheme B: treat two pages as ONE group, center the group horizontally */
          display:flex;
          flex-direction:row;
          justify-content:center;
          /* make children take full available height (after padding) */
          align-items:stretch;
          gap:0;
          /* no horizontal padding: keep two pages touching seamlessly */
          padding: 52px 0 calc(
            12px + var(--tmHintH) + var(--tmHintBottom) + var(--tmHintGap) + var(--tmSafeBottom)
          );
          box-sizing:border-box;
        }
        .tmReaderPane{
          /* shrink-wrap width to its image so the whole two-page spread can be centered */
          flex:0 0 auto;
          min-width:0;
          height:100%;
          display:flex;
          align-items:center;
          /* default center, but we override per side to make pages meet at center */
          justify-content:center;
          overflow:hidden;
        }
        /* Left page (left column) sticks to center (right edge). */
        #tmReaderSpread .tmReaderPane:first-child{
          justify-content:flex-end;
        }
        /* Right page (right column) sticks to center (left edge). */
        #tmReaderSpread .tmReaderPane:last-child{
          justify-content:flex-start;
        }
        .tmReaderPane img{
          /* cap each page to half viewport width, but allow a tiny overlap to kill the seam */
          max-width:calc(50vw + 1px);
          max-height:100%;
          object-fit:contain;
          display:block;
          margin:0;
          image-rendering:auto;
        }
        /* Eliminate 1px seam caused by subpixel rounding at center line */
        #tmReaderSpread .tmReaderPane:first-child img{ margin-right:-1px; }
        #tmReaderSpread .tmReaderPane:last-child img{ margin-left:-1px; }

        /* View mode toggle: single page (big image centered) */
        #tmReaderOverlay[data-view="single"][data-dir="rtl"] #tmReaderSpread .tmReaderPane:first-child{
          display:none;
        }
        #tmReaderOverlay[data-view="single"][data-dir="rtl"] #tmReaderSpread .tmReaderPane:last-child{
          justify-content:center;
        }
        #tmReaderOverlay[data-view="single"][data-dir="rtl"] #tmReaderSpread .tmReaderPane img{
          max-width:100vw;
          margin:0 !important;
        }
        #tmReaderOverlay[data-view="single"][data-dir="ltr"] #tmReaderSpread .tmReaderPane:last-child{
          display:none;
        }
        #tmReaderOverlay[data-view="single"][data-dir="ltr"] #tmReaderSpread .tmReaderPane:first-child{
          justify-content:center;
        }
        #tmReaderOverlay[data-view="single"][data-dir="ltr"] #tmReaderSpread .tmReaderPane img{
          max-width:100vw;
          margin:0 !important;
        }
        #tmReaderHint{
          position:absolute;
          left:50%;
          bottom:calc(var(--tmHintBottom) + var(--tmSafeBottom));
          transform:translateX(-50%);
          color:#fff;
          font: 13px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,"Noto Sans","PingFang SC","Microsoft YaHei",sans-serif;
          opacity:.85;
          background:rgba(0,0,0,.45);
          padding:8px 10px;
          border-radius:10px;
          pointer-events:none;
          white-space:nowrap;
          max-width:min(92vw, 980px);
          overflow:hidden;
          text-overflow:ellipsis;
        }
      `;
      document.head.appendChild(style);
    }

    function syncHintReserve() {
      if (!STATE.isOpen) return;
      if (!STATE.overlayEl || !STATE.hintEl) return;
      // overlay is display:none when closed; only measure when open
      const r = STATE.hintEl.getBoundingClientRect();
      const h = Math.max(0, Math.ceil(r.height || 0));
      if (h > 0) STATE.overlayEl.style.setProperty("--tmHintH", `${h}px`);
    }

    function getViewModeText() {
      return STATE.viewMode === "single" ? "单页" : "双页";
    }

    function getReadingDirText() {
      return STATE.readingDir === "rtl" ? "日式(右→左)" : "现代(左→右)";
    }

    function toggleViewMode() {
      STATE.viewMode = STATE.viewMode === "double" ? "single" : "double";
      if (STATE.overlayEl)
        STATE.overlayEl.setAttribute("data-view", STATE.viewMode);
      // Update UI immediately
      updateTopBar(computeLoadedCount());
      updateHint(computeLoadedCount());
      if (STATE.isOpen) renderCurrent();
    }

    function toggleReadingDir() {
      STATE.readingDir = STATE.readingDir === "rtl" ? "ltr" : "rtl";
      if (STATE.overlayEl)
        STATE.overlayEl.setAttribute("data-dir", STATE.readingDir);
      // Update UI immediately
      updateTopBar(computeLoadedCount());
      updateHint(computeLoadedCount());
      if (STATE.isOpen) renderCurrent();
    }

    function buildOverlay() {
      if (STATE.overlayEl) return;

      const overlay = document.createElement("div");
      overlay.id = "tmReaderOverlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.setAttribute("data-dir", STATE.readingDir);

      const topBar = document.createElement("div");
      topBar.id = "tmReaderTopBar";
      topBar.innerHTML = `
        <div class="tmReaderTitle">A1 阅读器（双页）</div>
        <div class="tmReaderHelp">R:进入/退出  F:单/双页  G:配对  C:方向  Esc:退出</div>
      `;
      const titleEl = /** @type {HTMLDivElement | null} */ (
        topBar.querySelector(".tmReaderTitle")
      );

      const spread = document.createElement("div");
      spread.id = "tmReaderSpread";

      const leftPane = document.createElement("div");
      leftPane.className = "tmReaderPane";
      const rightPane = document.createElement("div");
      rightPane.className = "tmReaderPane";

      const leftImg = document.createElement("img");
      leftImg.alt = "left";
      const rightImg = document.createElement("img");
      rightImg.alt = "right";
      leftPane.appendChild(leftImg);
      rightPane.appendChild(rightImg);

      spread.appendChild(leftPane);
      spread.appendChild(rightPane);

      const hint = document.createElement("div");
      hint.id = "tmReaderHint";
      hint.textContent = "点击左半屏：下一页组；右半屏：上一页组";

      overlay.appendChild(topBar);
      overlay.appendChild(spread);
      overlay.appendChild(hint);

      overlay.addEventListener(
        "click",
        (e) => {
          // prevent click-through
          e.stopPropagation();
          e.preventDefault();
        },
        true
      );

      overlay.addEventListener("pointerup", (e) => {
        // click half screen navigation depends on readingDir
        if (!STATE.isOpen) return;
        const w = overlay.clientWidth || window.innerWidth;
        const x = e.clientX;
        const isLeft = x < w / 2;
        if (STATE.readingDir === "rtl") {
          // left half => next, right half => prev
          if (isLeft) gotoNext();
          else gotoPrev();
        } else {
          // right half => next, left half => prev
          if (isLeft) gotoPrev();
          else gotoNext();
        }
      });

      document.documentElement.appendChild(overlay);

      STATE.overlayEl = overlay;
      STATE.topTitleEl = titleEl;
      STATE.spreadEl = spread;
      STATE.leftImg = leftImg;
      STATE.rightImg = rightImg;
      STATE.hintEl = hint;

      // Track successful loads in overlay itself (independent of underlying lazyload state)
      leftImg.addEventListener("load", () => {
        const url =
          leftImg.currentSrc ||
          leftImg.getAttribute("src") ||
          leftImg.src ||
          "";
        if (isValidPageUrl(url)) STATE.loadedUrls.add(url);
      });
      rightImg.addEventListener("load", () => {
        const url =
          rightImg.currentSrc ||
          rightImg.getAttribute("src") ||
          rightImg.src ||
          "";
        if (isValidPageUrl(url)) STATE.loadedUrls.add(url);
      });
    }

    function attachGlobalHotkeys() {
      window.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "r" || e.key === "R") {
            e.preventDefault();
            toggle();
            return;
          }
          if (e.key === "f" || e.key === "F") {
            // Allow toggling even when overlay is closed.
            e.preventDefault();
            toggleViewMode();
            return;
          }
          if (e.key === "g" || e.key === "G") {
            // Allow toggling even when overlay is closed, but it's most useful when open.
            e.preventDefault();
            togglePairingMode();
            return;
          }
          if (e.key === "c" || e.key === "C") {
            // Allow toggling even when overlay is closed.
            e.preventDefault();
            toggleReadingDir();
            return;
          }
          if (!STATE.isOpen) return;
          if (e.key === "Escape") {
            e.preventDefault();
            close();
            return;
          }
          // Paging direction depends on readingDir:
          // rtl: LeftArrow => next, RightArrow => prev
          // ltr: RightArrow => next, LeftArrow => prev
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            if (STATE.readingDir === "rtl") gotoNext();
            else gotoPrev();
            return;
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            if (STATE.readingDir === "rtl") gotoPrev();
            else gotoNext();
            return;
          }
        },
        { capture: true }
      );

      // Keep layout reserve in sync with viewport changes (zoom/orientation/resize).
      window.addEventListener(
        "resize",
        () => {
          if (!STATE.isOpen) return;
          syncHintReserve();
        },
        { passive: true }
      );
    }

    function open() {
      if (STATE.isOpen) return;
      if (!STATE.overlayEl) buildOverlay();
      STATE.isOpen = true;

      if (CONFIG.lockUnderlyingScroll) {
        // If we enable auto-drive, we must allow script scrolling; block user inputs instead.
        if (CONFIG.autoDriveUnderlyingScroll) {
          if (!STATE.cleanupInputBlockers) {
            STATE.cleanupInputBlockers = installInputBlockers();
          }
        } else {
          STATE.restoreOverflow = document.documentElement.style.overflow;
          STATE.restoreBodyOverflow = document.body.style.overflow;
          document.documentElement.style.overflow = "hidden";
          document.body.style.overflow = "hidden";
        }
      }

      STATE.overlayEl.setAttribute("data-open", "1");
      STATE.overlayEl.setAttribute("data-view", STATE.viewMode);
      STATE.overlayEl.setAttribute("data-dir", STATE.readingDir);
      STATE.overlayEl.setAttribute("aria-hidden", "false");

      ensureList();
      startObserver();
      refreshPagesNow();
      renderCurrent();
      startAutoDrive();
      // Reserve space for bottom hint based on its actual rendered height.
      requestAnimationFrame(() => syncHintReserve());
    }

    function close() {
      if (!STATE.isOpen) return;
      STATE.isOpen = false;
      if (STATE.overlayEl) {
        STATE.overlayEl.removeAttribute("data-open");
        STATE.overlayEl.setAttribute("aria-hidden", "true");
      }

      stopAutoDrive();
      if (STATE.cleanupInputBlockers) {
        try {
          STATE.cleanupInputBlockers();
        } catch {}
        STATE.cleanupInputBlockers = null;
      }

      if (CONFIG.lockUnderlyingScroll) {
        if (
          STATE.restoreOverflow !== null ||
          STATE.restoreBodyOverflow !== null
        ) {
          document.documentElement.style.overflow = STATE.restoreOverflow ?? "";
          document.body.style.overflow = STATE.restoreBodyOverflow ?? "";
          STATE.restoreOverflow = null;
          STATE.restoreBodyOverflow = null;
        }
      }

      stopObserver();
    }

    function installInputBlockers() {
      /** @param {Event} e */
      function prevent(e) {
        if (!STATE.isOpen) return;
        e.preventDefault();
      }

      /** @param {KeyboardEvent} e */
      function onKeydown(e) {
        if (!STATE.isOpen) return;
        // Allow our own global hotkeys handler to run first; avoid blocking it here.
        // Block common scroll keys to keep underlying page stable for auto-drive.
        const k = e.key;
        if (
          k === " " ||
          k === "PageDown" ||
          k === "PageUp" ||
          k === "Home" ||
          k === "End" ||
          k === "ArrowUp" ||
          k === "ArrowDown"
        ) {
          e.preventDefault();
        }
      }

      // Use capture + non-passive so preventDefault actually works.
      window.addEventListener("wheel", prevent, {
        capture: true,
        passive: false,
      });
      window.addEventListener("touchmove", prevent, {
        capture: true,
        passive: false,
      });
      window.addEventListener("keydown", onKeydown, { capture: true });

      return () => {
        window.removeEventListener("wheel", prevent, { capture: true });
        window.removeEventListener("touchmove", prevent, { capture: true });
        window.removeEventListener("keydown", onKeydown, { capture: true });
      };
    }

    function startAutoDrive() {
      if (!CONFIG.autoDriveUnderlyingScroll) return;
      if (!STATE.isOpen) return;
      if (STATE.autoDriveTimer) return;

      STATE.autoDriveStartTs = Date.now();
      STATE.autoDriveLastProgressTs = STATE.autoDriveStartTs;
      STATE.autoDriveStall = 0;
      STATE.autoDriveStartScrollY = window.scrollY || 0;
      STATE.autoDriveLastImgCount = getUnderlyingImgCount();
      STATE.autoDriveStopReason = null;

      // Tick: scroll to trigger original site to append more items.
      STATE.autoDriveTimer = window.setInterval(() => {
        try {
          autoDriveTick();
        } catch (e) {
          log("autoDriveTick error", e);
        }
      }, CONFIG.autoDriveIntervalMs);
    }

    /** @param {string=} reason */
    function stopAutoDrive(reason) {
      if (!STATE.autoDriveTimer) return;
      window.clearInterval(STATE.autoDriveTimer);
      STATE.autoDriveTimer = null;
      STATE.autoDriveStopReason =
        reason || STATE.autoDriveStopReason || "stopped";
    }

    function getUnderlyingImgCount() {
      ensureList();
      if (!STATE.listEl) return 0;
      return STATE.listEl.querySelectorAll("img").length;
    }

    function isNearBottom() {
      const doc = document.documentElement;
      const maxY = (doc?.scrollHeight || 0) - (window.innerHeight || 0);
      const y = window.scrollY || 0;
      return y >= Math.max(0, maxY - 2);
    }

    function dispatchScrollEvent() {
      try {
        window.dispatchEvent(new Event("scroll"));
      } catch {}
    }

    function autoDriveJitter() {
      const j = CONFIG.autoDriveJitterPx;
      window.scrollBy(0, -j);
      dispatchScrollEvent();
      // Let layout / observers catch up.
      setTimeout(() => {
        if (!STATE.isOpen) return;
        window.scrollBy(0, j * 2);
        dispatchScrollEvent();
      }, 60);
    }

    function autoDriveTick() {
      if (!STATE.isOpen) {
        stopAutoDrive("closed");
        return;
      }

      const now = Date.now();
      if (now - STATE.autoDriveStartTs > CONFIG.autoDriveMaxMs) {
        stopAutoDrive("timeout");
        return;
      }

      const count = getUnderlyingImgCount();
      if (count > STATE.autoDriveLastImgCount) {
        STATE.autoDriveLastImgCount = count;
        STATE.autoDriveLastProgressTs = now;
        STATE.autoDriveStall = 0;
      } else {
        STATE.autoDriveStall += 1;
      }

      // If we are stuck and already near bottom, stop to avoid busy looping.
      if (
        STATE.autoDriveStall >= CONFIG.autoDriveStallRounds &&
        isNearBottom()
      ) {
        stopAutoDrive("bottom");
        return;
      }

      // Drive scroll: normal step, or jitter when stalled.
      if (STATE.autoDriveStall >= CONFIG.autoDriveStallRounds) {
        autoDriveJitter();
        STATE.autoDriveStall = 0; // reset after jitter attempt
      } else {
        window.scrollBy(0, CONFIG.autoDriveStepPx);
        dispatchScrollEvent();
      }

      // Keep A1's internal page list fresh even if MutationObserver misses.
      refreshPagesNow();
    }

    function getAutoDriveStatusText() {
      if (!CONFIG.autoDriveUnderlyingScroll) return "";
      const total = STATE.pages.length || 0;
      const imgCount = getUnderlyingImgCount();
      const stalledForMs = Math.max(
        0,
        Date.now() - (STATE.autoDriveLastProgressTs || 0)
      );
      const stalledForS = Math.floor(stalledForMs / 1000);

      if (STATE.autoDriveTimer) {
        // Example: 后台驱动中（DOM图 12，已发现 10，停滞 3s）
        return `后台驱动中（DOM图 ${imgCount}，已发现 ${total}，停滞 ${stalledForS}s）`;
      }
      if (STATE.autoDriveStopReason) {
        const reason =
          STATE.autoDriveStopReason === "timeout"
            ? "超时停止"
            : STATE.autoDriveStopReason === "bottom"
            ? "到底停止"
            : STATE.autoDriveStopReason === "closed"
            ? "已关闭"
            : "已停止";
        return `后台驱动：${reason}（DOM图 ${imgCount}，已发现 ${total}）`;
      }
      return `后台驱动：未启动（DOM图 ${imgCount}，已发现 ${total}）`;
    }

    function toggle() {
      if (STATE.isOpen) close();
      else open();
    }

    function ensureList() {
      if (STATE.listEl && document.contains(STATE.listEl)) return;
      const el = /** @type {HTMLUListElement | null} */ (
        document.querySelector(".comicContent-list")
      );
      STATE.listEl = el;
    }

    function startObserver() {
      if (STATE.observer) return;
      if (!STATE.listEl) return;
      const observer = new MutationObserver(() => {
        scheduleRefresh();
      });
      observer.observe(STATE.listEl, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-src", "src", "class"],
      });
      STATE.observer = observer;
    }

    function stopObserver() {
      if (!STATE.observer) return;
      STATE.observer.disconnect();
      STATE.observer = null;
      STATE.refreshQueued = false;
    }

    function scheduleRefresh() {
      if (STATE.refreshQueued) return;
      STATE.refreshQueued = true;
      requestAnimationFrame(() => {
        STATE.refreshQueued = false;
        refreshPagesNow();
      });
    }

    /** @param {string | null | undefined} url */
    function isLoadingUrl(url) {
      if (!url) return true;
      return (
        /\/loading(\.|_).*(png|webp|jpg|jpeg)$/.test(url) ||
        url.includes("loading.png")
      );
    }

    /** @param {string} url */
    function isValidPageUrl(url) {
      // loosened rules: accept common cdn domains; exclude obvious placeholders
      if (!/^https?:\/\//.test(url)) return false;
      if (isLoadingUrl(url)) return false;
      return (
        url.includes("sl.mangafunb.fun/") ||
        url.includes("hi77-overseas.mangafunb.fun/") ||
        url.includes("mangafunb.fun/")
      );
    }

    /** @param {HTMLImageElement} img */
    function extractUrl(img) {
      const ds = img.getAttribute("data-src") || img.dataset?.src;
      const src = img.currentSrc || img.getAttribute("src") || img.src;
      const url = ds || src || "";
      return url;
    }

    function refreshPagesNow() {
      ensureList();
      if (!STATE.listEl) {
        if (STATE.hintEl)
          STATE.hintEl.textContent = "未找到漫画列表（.comicContent-list）";
        return;
      }
      const imgs = Array.from(STATE.listEl.querySelectorAll("img"));
      const pages = [];
      const seen = new Set();
      const map = new Map();
      for (const img of imgs) {
        const url = extractUrl(img);
        if (!url || !isValidPageUrl(url)) continue;
        if (seen.has(url)) continue;
        seen.add(url);
        pages.push(url);
        map.set(url, img);
      }

      const changed =
        pages.length !== STATE.pages.length ||
        pages.some((u, i) => STATE.pages[i] !== u);
      STATE.pages = pages;
      STATE.imgByUrl = map;

      const prevIndex = STATE.index;
      const loadedCount = computeLoadedCount();
      buildSpreads();
      clampIndex();
      updateTopBar(loadedCount);
      updateHint(loadedCount);
      // Do NOT re-render current spread just because new pages are appended.
      // Only re-render when navigation changes index or current spread becomes invalid.
      if (
        STATE.isOpen &&
        (prevIndex !== STATE.index || !STATE.spreads[STATE.index])
      ) {
        renderCurrent();
      }
      if (changed) log("pages updated", pages.length);
    }

    /** @param {string} url */
    function isUnderlyingLoaded(url) {
      const img = STATE.imgByUrl.get(url);
      if (!img) return false;
      if (img.classList.contains("lazyloaded")) return true;
      const src = img.currentSrc || img.getAttribute("src") || img.src || "";
      if (isValidPageUrl(src) && !isLoadingUrl(src)) return true;
      if (img.complete && img.naturalWidth > 0 && isValidPageUrl(url))
        return true;
      return false;
    }

    function computeLoadedCount() {
      // Count unique loaded pages among discovered URLs (STATE.pages)
      let n = 0;
      for (const url of STATE.pages) {
        if (STATE.loadedUrls.has(url) || isUnderlyingLoaded(url)) n += 1;
      }
      return n;
    }

    function buildSpreads() {
      const pages = STATE.pages;
      /** @type {Array<{right?: string; left?: string; rightNo?: number; leftNo?: number}>} */
      const spreads = [];
      if (STATE.pairingMode === 0) {
        // default: first page single (on the right), then pair from page2
        if (pages.length >= 1) {
          spreads.push({ right: pages[0], rightNo: 1 });
        }
        for (let i = 1; i < pages.length; i += 2) {
          const right = pages[i];
          const left = pages[i + 1];
          const rightNo = i + 1;
          const leftNo = i + 2;
          spreads.push({
            right,
            left,
            rightNo,
            leftNo: left ? leftNo : undefined,
          });
        }
      } else {
        // alt: pair from start (1-2)(3-4)...
        for (let i = 0; i < pages.length; i += 2) {
          const right = pages[i];
          const left = pages[i + 1];
          const rightNo = i + 1;
          const leftNo = i + 2;
          spreads.push({
            right,
            left,
            rightNo,
            leftNo: left ? leftNo : undefined,
          });
        }
      }
      STATE.spreads = spreads;
    }

    function getPairingModeText() {
      return STATE.pairingMode === 0 ? "首单" : "双起";
    }

    function togglePairingMode() {
      // Anchor to current right page so toggling feels like BC <-> AB.
      const cur = STATE.spreads[STATE.index];
      const oldRight = cur?.right;
      STATE.pairingMode = STATE.pairingMode === 0 ? 1 : 0;

      buildSpreads();
      clampIndex();

      if (oldRight) {
        // Prefer spread where oldRight becomes the left page (shift-back),
        // otherwise fall back to spread where oldRight is on the right.
        let idx = STATE.spreads.findIndex((s) => s.left === oldRight);
        if (idx < 0) idx = STATE.spreads.findIndex((s) => s.right === oldRight);
        if (idx >= 0) STATE.index = idx;
      }

      // Update UI immediately
      updateTopBar(computeLoadedCount());
      updateHint(computeLoadedCount());
      if (STATE.isOpen) renderCurrent();
      log("pairingMode", STATE.pairingMode);
    }

    function clampIndex() {
      const max = Math.max(0, STATE.spreads.length - 1);
      if (STATE.index > max) STATE.index = max;
      if (STATE.index < 0) STATE.index = 0;
    }

    /** @param {number} loadedCount */
    function updateTopBar(loadedCount) {
      if (!STATE.topTitleEl) return;
      const total = STATE.pages.length;
      const spread = STATE.spreads[STATE.index];
      if (!spread) {
        STATE.topTitleEl.textContent = `A1 阅读器（等待加载…）`;
        return;
      }
      const pageLabel = spread.leftNo
        ? `${spread.rightNo}-${spread.leftNo}`
        : `${spread.rightNo}`;
      const driveTag = STATE.autoDriveTimer ? "｜后台驱动中" : "";
      STATE.topTitleEl.textContent = `A1 阅读器（第 ${pageLabel} / ${total} 页，已加载 ${loadedCount}）｜配对:${getPairingModeText()}｜模式:${getViewModeText()}｜方向:${getReadingDirText()}${driveTag}`;
    }

    /** @param {number} loadedCount */
    function updateHint(loadedCount) {
      if (!STATE.hintEl) return;
      // Keep bottom hint minimal (operations only). Status stays in top bar.
      void loadedCount;
      const arrowTip =
        STATE.readingDir === "rtl" ? "← 下一｜→ 上一" : "→ 下一｜← 上一";
      const clickTip =
        STATE.readingDir === "rtl"
          ? "左半屏 下一｜右半屏 上一"
          : "右半屏 下一｜左半屏 上一";
      STATE.hintEl.textContent = `操作：${arrowTip}｜${clickTip}｜F 单/双页｜G 配对(首单/双起)｜C 方向(日式/现代)｜R 进入/退出｜Esc 退出`;
      syncHintReserve();
    }

    function setImg(el, url) {
      if (!el) return;
      if (!url) {
        el.removeAttribute("src");
        el.style.visibility = "hidden";
        return;
      }
      el.style.visibility = "visible";
      if (el.getAttribute("src") !== url) el.setAttribute("src", url);
    }

    /** @param {string | undefined} url */
    function triggerUnderlyingLazyload(url) {
      if (!CONFIG.useUnderlyingLazyloadTrigger) return;
      if (!url) return;
      const img = STATE.imgByUrl.get(url);
      if (!img) return;
      const ds = img.getAttribute("data-src") || img.dataset?.src;
      if (!ds) return;
      if (img.classList.contains("lazyload")) {
        img.setAttribute("src", ds);
      }
    }

    function preload(url) {
      if (!url) return;
      const i = new Image();
      i.decoding = "async";
      i.onload = () => {
        if (isValidPageUrl(url)) STATE.loadedUrls.add(url);
      };
      i.src = url;
    }

    function showLoadingPlaceholder() {
      if (!STATE.rightImg || !STATE.leftImg) return;
      // Keep current images but make it obvious when next page is still loading
      STATE.rightImg.style.opacity = "0.92";
      STATE.leftImg.style.opacity = "0.92";
    }

    function clearLoadingPlaceholder() {
      if (!STATE.rightImg || !STATE.leftImg) return;
      STATE.rightImg.style.opacity = "1";
      STATE.leftImg.style.opacity = "1";
    }

    function renderCurrent() {
      if (!STATE.isOpen) return;
      const spread = STATE.spreads[STATE.index];
      if (!spread) return;
      // Pane assignment depends on reading direction:
      // rtl: spread.right -> right pane, spread.left -> left pane
      // ltr: spread.right -> left pane, spread.left -> right pane
      const paneRight =
        (STATE.readingDir === "rtl" ? spread.right : spread.left) || null;
      const paneLeft =
        (STATE.readingDir === "rtl" ? spread.left : spread.right) || null;
      const isSameSpread =
        paneRight === STATE.lastRenderedRight &&
        paneLeft === STATE.lastRenderedLeft;

      // Only show placeholder/fade when switching to a new spread.
      if (!isSameSpread) showLoadingPlaceholder();
      syncUnderlyingProgress(spread);
      // ensure underlying loads (best-effort)
      triggerUnderlyingLazyload(spread.right);
      triggerUnderlyingLazyload(spread.left);
      setImg(STATE.rightImg, paneRight);
      setImg(STATE.leftImg, paneLeft);

      const next = STATE.spreads[STATE.index + 1];
      if (next) {
        preload(next.right);
        preload(next.left);
      }
      // Clear placeholder once current spread loads (best effort),
      // but only when switching spread to avoid repeated "refresh" flicker.
      if (!isSameSpread) {
        const urls = [spread.right, spread.left].filter(Boolean);
        let pending = urls.length;
        if (pending === 0) {
          clearLoadingPlaceholder();
        } else {
          for (const url of urls) {
            const img = new Image();
            img.decoding = "async";
            img.onload = () => {
              if (isValidPageUrl(url)) STATE.loadedUrls.add(url);
              pending -= 1;
              if (pending <= 0) clearLoadingPlaceholder();
            };
            img.onerror = () => {
              pending -= 1;
              if (pending <= 0) clearLoadingPlaceholder();
            };
            img.src = url;
          }
        }
      }

      STATE.lastRenderedRight = paneRight;
      STATE.lastRenderedLeft = paneLeft;

      // Update labels with latest loaded count estimate (cheap recompute)
      updateTopBar(computeLoadedCount());
      updateHint(computeLoadedCount());
    }

    /** @param {{right?: string; left?: string; rightNo?: number; leftNo?: number}} spread */
    function syncUnderlyingProgress(spread) {
      if (!CONFIG.syncUnderlyingScroll) return;
      if (!STATE.listEl) return;
      if (!spread?.right) return;

      const now = Date.now();
      if (now - STATE.lastSyncTs < CONFIG.syncThrottleMs) return;
      if (STATE.lastSyncUrl === spread.right) return;
      STATE.lastSyncTs = now;
      STATE.lastSyncUrl = spread.right;

      // Sync original site UI counter (if present)
      const idxEl = /** @type {HTMLElement | null} */ (
        document.querySelector(".comicIndex")
      );
      const countEl = /** @type {HTMLElement | null} */ (
        document.querySelector(".comicCount")
      );
      if (idxEl && spread.rightNo) idxEl.textContent = String(spread.rightNo);
      if (countEl) countEl.textContent = String(STATE.pages.length || 0);

      // Sync original list scroll position (best-effort)
      const img = STATE.imgByUrl.get(spread.right);
      if (!img) return;

      try {
        img.scrollIntoView({ block: "center", inline: "nearest" });
      } catch {
        img.scrollIntoView(true);
      }
    }

    function gotoNext() {
      if (STATE.spreads.length === 0) return;
      const next = Math.min(STATE.spreads.length - 1, STATE.index + 1);
      if (next === STATE.index) return;
      STATE.index = next;
      renderCurrent();
    }

    function gotoPrev() {
      if (STATE.spreads.length === 0) return;
      const prev = Math.max(0, STATE.index - 1);
      if (prev === STATE.index) return;
      STATE.index = prev;
      renderCurrent();
    }

    return { install, open, close, toggle };
  }
})();
