// ==UserScript==
// @name         TikTok Link Collector
// @namespace    https://www.tiktok.com/
// @version      0.4.0
// @description  Collects original TikTok urls and also converts to TikWM HD links. Edge-hover UI with auto-scroll and idle-stop.
// @author       Gemini 3 Pro (previously ChatGPT 5.2 Thinking)
// @icon         https://www.tiktok.com/favicon.ico
// @match        https://www.tiktok.com/@*
// @match        https://tiktok.com/@*
// @match        https://www.tiktok.com/music/*
// @match        https://www.tiktok.com/tag/*
// @match        https://www.tiktok.com/search/*
// @exclude      https://www.tiktok.com/
// @exclude      https://www.tiktok.com/foryou*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559487/TikTok%20Link%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/559487/TikTok%20Link%20Collector.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Config ----------
  const DEFAULT_IDLE_SECONDS = 33;
  const SCROLL_INTERVAL_MS = 2000; // How often to scroll

  // ---------- State ----------
  const seenIds = new Set();
  const originalLinks = new Set();
  const tikwmLinks = new Set();

  let scrollTimer = null;
  let countdownTimer = null;
  let hideTimer = null;

  let idleCounter = 0;
  let lastHeight = 0;

  let pinnedUntil = 0;
  let isShown = false;

  // ---------- Utils ----------
  function nowMs() { return Date.now(); }

  function pinBriefly(ms) {
    pinnedUntil = nowMs() + (ms || 2000);
    showPanel(true);
  }

  function shouldBlockHide() {
    // Prevent hiding if pinned OR if currently scrolling/counting down
    return nowMs() <= pinnedUntil || scrollTimer !== null || countdownTimer !== null;
  }

  function extractId(href) {
    const m = href && href.match(/\/video\/(\d{6,})/);
    return m ? m[1] : null;
  }

  function normalize(href) {
    try {
      const u = new URL(href, location.origin);
      return location.origin + u.pathname.replace(/\/$/, '');
    } catch {
      return href;
    }
  }

  function tikwm(id) {
    return 'https://www.tikwm.com/video/media/hdplay/' + id + '.mp4';
  }

  function getUsername() {
    const m = location.pathname.match(/^\/@([^/]+)/);
    return m ? m[1] : 'tiktok_user';
  }

  function getFormattedDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ---------- Logic ----------

  // Returns true if new links were found
  function scanLinks() {
    let newFound = false;
    document.querySelectorAll('a[href*="/video/"]').forEach(a => {
      const id = extractId(a.href);
      if (!id || seenIds.has(id)) return;

      seenIds.add(id);
      originalLinks.add(normalize(a.href));
      tikwmLinks.add(tikwm(id));
      newFound = true;
    });

    if (newFound) {
        updateUI();
    }
    return newFound;
  }

  function autoSave() {
    // Auto-save (defaults to original TikTok links)
    if (originalLinks.size === 0) return;

    const filename = `${getUsername()}_tiktok-urls_${getFormattedDate()}.txt`;
    download([...originalLinks].join('\n'), filename);
  }

  function stopScroll(reason) {
    if (scrollTimer) {
      clearInterval(scrollTimer);
      scrollTimer = null;
    }
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }

    const statusEl = document.getElementById('tt_status');
    if (statusEl) statusEl.textContent = reason || "Stopped";

    updateUI();
  }

  function scrollTick() {
    const currentHeight = document.body.scrollHeight;
    window.scrollBy(0, window.innerHeight); // Scroll by viewport height

    const newLinksFound = scanLinks();

    // Read user-defined idle limit (seconds)
    const idleInput = document.getElementById('tt_idle');
    const idleSeconds = parseInt(idleInput.value, 10) || DEFAULT_IDLE_SECONDS;
    // Calculate threshold ticks based on interval
    const idleThresholdTicks = Math.max(1, Math.floor(idleSeconds / (SCROLL_INTERVAL_MS / 1000)));

    // Reset counter if: new links found OR page height increased
    if (newLinksFound || currentHeight > lastHeight) {
        idleCounter = 0;
        lastHeight = currentHeight;
    } else {
        idleCounter++;
    }

    if (idleCounter >= idleThresholdTicks) {
        stopScroll("Auto-stopped (idle)");
        autoSave();
    }
  }

  function startScroll() {
    if (scrollTimer || countdownTimer) return;

    let countdown = 3;
    const statusEl = document.getElementById('tt_status');
    statusEl.textContent = "Starting in " + countdown + "...";
    pinBriefly(3500);

    countdownTimer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            statusEl.textContent = "Starting in " + countdown + "...";
        } else {
            clearInterval(countdownTimer);
            countdownTimer = null;

            // Start actual scrolling
            lastHeight = document.body.scrollHeight;
            idleCounter = 0;
            statusEl.textContent = "Scrolling...";
            scanLinks(); // Scan once before start
            scrollTimer = setInterval(scrollTick, SCROLL_INTERVAL_MS);
        }
    }, 1000);
  }

  // ---------- UI Construction ----------
  const PANEL_W = 340;

  GM_addStyle(
    '#tt_tab{' +
    'position:fixed;left:0;top:50%;width:18px;height:44px;margin-top:-22px;' +
    'background:#bdc5c8;border:1px solid #abb0b3;border-left:none;' +
    'border-radius:0 6px 6px 0;cursor:pointer;z-index:2147483646;' +
    'display:flex;align-items:center;justify-content:center;opacity:0.7;' +
    '}' +
    '#tt_tab:hover{opacity:1;}' +
    '#tt_panel{' +
    'position:fixed;left:0;top:50%;' +
    'transform:translate(-100%, -50%);' +
    'width:' + PANEL_W + 'px;' +
    'background:rgba(0,0,0,0.78);color:#fff;' +
    'padding:10px 10px 10px 28px;' +
    'border-radius:0 8px 8px 0;' +
    'box-shadow:0 2px 10px rgba(0,0,0,0.4);' +
    'transition:transform 140ms linear,opacity 140ms linear;' +
    'opacity:0.92;z-index:2147483645;' +
    'font-family:system-ui,Segoe UI,Arial;font-size:12px;' +
    '}' +
    '#tt_panel.show{transform:translate(0, -50%);opacity:1;}' +
    '#tt_header{margin-bottom:8px;}' +
    '#tt_title{font-weight:700;font-size:13px;margin-bottom:2px;}' +
    '#tt_info_row{display:flex;justify-content:space-between;opacity:0.9;font-size:11px;}' +
    '.tt_row{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;align-items:center;}' +
    '.tt_btn{' +
    'border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.08);' +
    'color:#fff;padding:4px 10px;border-radius:999px;cursor:pointer;font-size:12px;line-height:1.2;' +
    '}' +
    '.tt_btn:hover{background:rgba(255,255,255,0.18);}' +
    '#tt_start{border-color:rgba(100,220,120,0.6);}' +
    '#tt_stop{border-color:rgba(220,100,100,0.6);}' +
    '#tt_clear{border-color:rgba(220,200,100,0.6);}' +
    '#tt_output{width:100%;height:140px;margin-top:8px;background:rgba(255,255,255,0.1);border:none;color:#fff;font-size:11px;resize:vertical;}' +
    '#tt_idle_wrap{display:flex;align-items:center;gap:6px;margin-left:auto;}' +
    '#tt_idle_wrap span{font-size:11px;opacity:0.9;}' +
    // CHANGE: width set to 50px to fit double digits comfortably
    '#tt_idle{width:50px;font-size:12px;padding:2px 4px;border-radius:4px;border:1px solid rgba(255,255,255,0.25);background:rgba(0,0,0,0.35);color:#fff;text-align:center;}'
  );

  const tab = document.createElement('div');
  tab.id = 'tt_tab';
  tab.innerHTML = '<svg width="12" height="12"><path id="tt_arrow" d="M4 2 L8 6 L4 10 Z" fill="#2b2f33"/></svg>';
  document.body.appendChild(tab);

  const panel = document.createElement('div');
  panel.id = 'tt_panel';
  panel.innerHTML =
    '<div id="tt_header">' +
        '<div id="tt_title">TikTok Link Collector</div>' +
        '<div id="tt_info_row">' +
            '<span id="tt_count">0 links</span>' +
            '<span id="tt_status">Idle</span>' +
        '</div>' +
    '</div>' +
    '<div class="tt_row">' +
        '<button class="tt_btn" id="tt_start">Start</button>' +
        '<button class="tt_btn" id="tt_stop">Stop</button>' +
        '<button class="tt_btn" id="tt_copy">Copy</button>' +
        '<button class="tt_btn" id="tt_clear">Clear</button>' +
    '</div>' +
    '<div class="tt_row">' +
        '<button class="tt_btn" id="tt_dl_orig">DL Orig .txt</button>' +
        '<button class="tt_btn" id="tt_dl_tikwm">DL TikWM .txt</button>' +
        '<div id="tt_idle_wrap">' +
            '<span>Idle (s)</span>' +
            '<input id="tt_idle" type="number" min="2" value="' + DEFAULT_IDLE_SECONDS + '">' +
        '</div>' +
    '</div>' +
    '<textarea id="tt_output" readonly></textarea>';
  document.body.appendChild(panel);

  const arrow = panel.previousSibling.querySelector('#tt_arrow');

  function setArrow(open) {
    arrow.setAttribute('d', open ? 'M8 2 L4 6 L8 10 Z' : 'M4 2 L8 6 L4 10 Z');
  }

  function showPanel(force) {
    if (hideTimer) clearTimeout(hideTimer);
    if (isShown && !force) return;
    isShown = true;
    panel.classList.add('show');
    setArrow(true);
  }

  function scheduleHide() {
    if (shouldBlockHide()) return;
    hideTimer = setTimeout(() => {
      if (shouldBlockHide()) return;
      isShown = false;
      panel.classList.remove('show');
      setArrow(false);
    }, 140);
  }

  tab.addEventListener('mouseenter', () => showPanel(false));
  tab.addEventListener('mouseleave', scheduleHide);
  panel.addEventListener('mouseenter', () => showPanel(true));
  panel.addEventListener('mouseleave', scheduleHide);

  // ---------- Actions ----------
  function updateUI() {
    const countEl = document.getElementById('tt_count');
    const outputEl = document.getElementById('tt_output');

    if (countEl) countEl.textContent = originalLinks.size + ' links';
    if (outputEl) {
        outputEl.value = [...originalLinks].join('\n');
    }
  }

  function download(text, name) {
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  document.getElementById('tt_start').onclick = e => {
    e.preventDefault();
    startScroll();
  };

  document.getElementById('tt_stop').onclick = e => {
    e.preventDefault();
    pinBriefly(3000);
    stopScroll("Stopped");
  };

  document.getElementById('tt_copy').onclick = async e => {
    e.preventDefault();
    pinBriefly(2000);
    GM_setClipboard(
      [...originalLinks].join('\n'),
      { type: 'text' }
    );
    const s = document.getElementById('tt_status');
    const old = s.textContent;
    s.textContent = "Copied!";
    setTimeout(() => s.textContent = old, 1000);
  };

  document.getElementById('tt_clear').onclick = e => {
      e.preventDefault();
      seenIds.clear();
      originalLinks.clear();
      tikwmLinks.clear();
      updateUI();
      const s = document.getElementById('tt_status');
      s.textContent = "Cleared";
  };

  document.getElementById('tt_dl_orig').onclick = e => {
    e.preventDefault();
    pinBriefly(2000);
    const filename = `${getUsername()}_tiktok-urls_${getFormattedDate()}.txt`;
    download([...originalLinks].join('\n'), filename);
  };

  document.getElementById('tt_dl_tikwm').onclick = e => {
    e.preventDefault();
    pinBriefly(2000);
    const filename = `${getUsername()}_tikwm-urls_${getFormattedDate()}.txt`;
    download([...tikwmLinks].join('\n'), filename);
  };

  // Init scan
  scanLinks();
})();