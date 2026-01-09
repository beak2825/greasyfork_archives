// ==UserScript==
// @name         Social Pomodoro Reminder (15min, gentle) + Segment Timer (Cookie)
// @namespace    local.maxxie.social.pomodoro
// @version      1.3.0
// @description  Gentle pomodoro reminder every 15 min of active browsing time + visible segment timer; state stored in cookies
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.facebook.com/*
// @match        *://*.instagram.com/*
// @match        *://*.youtube.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561724/Social%20Pomodoro%20Reminder%20%2815min%2C%20gentle%29%20%2B%20Segment%20Timer%20%28Cookie%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561724/Social%20Pomodoro%20Reminder%20%2815min%2C%20gentle%29%20%2B%20Segment%20Timer%20%28Cookie%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ===== Config =====
  const SEGMENT_MIN = 15;
  const TICK_MS = 1000;
  const REQUIRE_ACTIVE_TAB = true;
  const SHOW_BADGE = true;
  const SHOW_SEGMENT_TIMER = true;

  // 用 cookie 存（每個網域各存一份）
  const COOKIE_NAME = "social_pomodoro_state_v1";
  const COOKIE_DAYS = 365; // cookie 保存多久（天）

  // ===== Cookie helpers =====
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    // SameSite=Lax 對一般瀏覽最安全、也常見；path=/ 確保整站可讀
    document.cookie =
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ` +
      `expires=${expires}; path=/; SameSite=Lax`;
  }

  function getCookie(name) {
    const key = encodeURIComponent(name) + "=";
    const parts = document.cookie.split("; ");
    for (const p of parts) {
      if (p.startsWith(key)) return decodeURIComponent(p.slice(key.length));
    }
    return null;
  }

  // ===== Helpers =====
  const now = () => Date.now();
  const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  function loadState() {
    try {
      const raw = getCookie(COOKIE_NAME);
      if (!raw) return { day: todayKey(), activeMs: 0, lastSegmentNotified: 0 };
      const s = JSON.parse(raw);
      if (s.day !== todayKey()) return { day: todayKey(), activeMs: 0, lastSegmentNotified: 0 };
      return {
        day: s.day,
        activeMs: Number(s.activeMs) || 0,
        lastSegmentNotified: Number(s.lastSegmentNotified) || 0,
      };
    } catch {
      return { day: todayKey(), activeMs: 0, lastSegmentNotified: 0 };
    }
  }

  function saveState(s) {
    // 只存最小必要欄位，避免 cookie 過大
    const payload = JSON.stringify({
      day: s.day,
      activeMs: Math.floor(s.activeMs),
      lastSegmentNotified: Math.floor(s.lastSegmentNotified),
    });
    setCookie(COOKIE_NAME, payload, COOKIE_DAYS);
  }

  function isActive() {
    if (!REQUIRE_ACTIVE_TAB) return true;
    return document.visibilityState === "visible" && document.hasFocus();
  }

  function formatMs(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${String(s).padStart(2, "0")}s`;
  }

  function formatMMSS(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  async function ensureNotificationPermission() {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    try {
      const p = await Notification.requestPermission();
      return p === "granted";
    } catch {
      return false;
    }
  }

  function notify(title, body) {
    ensureNotificationPermission().then((ok) => {
      if (ok) new Notification(title, { body });
      else alert(`${title}\n\n${body}`);
    });
  }

  // ===== UI: Badge (small) =====
  let badgeEl = null;

  function mountBadge() {
    if (!SHOW_BADGE) return;
    badgeEl = document.createElement("div");
    badgeEl.style.cssText = `
      position: fixed; right: 12px; bottom: 12px; z-index: 999999;
      font: 12px/1.25 -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
      background: rgba(0,0,0,0.72); color: #fff; padding: 8px 10px; border-radius: 10px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.25);
      user-select: none; white-space: pre;
    `;
    badgeEl.title = "Counts only when tab is visible & focused";
    document.documentElement.appendChild(badgeEl);
  }

  function updateBadge(activeMs) {
    if (!badgeEl) return;
    const segmentMs = SEGMENT_MIN * 60 * 1000;
    const segDone = Math.floor(activeMs / segmentMs);
    const within = activeMs % segmentMs;
    const left = segmentMs - within;

    badgeEl.textContent =
      `🍅 Social Pomodoro\n` +
      `Today: ${segDone} segments + ${formatMMSS(within)}\n` +
      `Next remind in: ${formatMMSS(left)}`;
  }

  // ===== UI: Segment Timer (big, draggable) =====
  let timerEl = null;

  function mountSegmentTimer() {
    if (!SHOW_SEGMENT_TIMER) return;

    timerEl = document.createElement("div");
    timerEl.style.cssText = `
      position: fixed; right: 12px; top: 12px; z-index: 999999;
      font: 14px/1.2 -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
      background: rgba(20,20,20,0.78); color: #fff;
      padding: 10px 12px; border-radius: 12px;
      box-shadow: 0 10px 24px rgba(0,0,0,0.30);
      user-select: none;
      min-width: 180px;
      cursor: grab;
    `;

    timerEl.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <div style="font-weight:700;">🍅 Segment Timer</div>
        <div id="st-active" style="font-size:12px; opacity:.85;">ACTIVE</div>
      </div>
      <div style="margin-top:8px; display:flex; align-items:baseline; justify-content:space-between;">
        <div>
          <div style="font-size:12px; opacity:.85;">This segment</div>
          <div id="st-elapsed" style="font-size:26px; font-weight:800; letter-spacing:.5px;">00:00</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:12px; opacity:.85;">Remaining</div>
          <div id="st-left" style="font-size:18px; font-weight:700;">15:00</div>
        </div>
      </div>
      <div style="margin-top:8px; display:flex; justify-content:space-between; font-size:12px; opacity:.9;">
        <div>Done today: <span id="st-done">0</span></div>
        <div>Target: ${SEGMENT_MIN}:00</div>
      </div>
    `;

    document.documentElement.appendChild(timerEl);

    // draggable
    let dragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    timerEl.addEventListener("mousedown", (e) => {
      dragging = true;
      timerEl.style.cursor = "grabbing";
      const rect = timerEl.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;

      timerEl.style.right = "auto";
      timerEl.style.left = `${rect.left}px`;
      timerEl.style.top = `${rect.top}px`;
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      timerEl.style.left = `${Math.max(8, startLeft + dx)}px`;
      timerEl.style.top = `${Math.max(8, startTop + dy)}px`;
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      timerEl.style.cursor = "grab";
    });
  }

  function updateSegmentTimer(activeMs) {
    if (!timerEl) return;

    const segmentMs = SEGMENT_MIN * 60 * 1000;
    const segDone = Math.floor(activeMs / segmentMs);
    const within = activeMs % segmentMs;
    const left = segmentMs - within;

    const elElapsed = timerEl.querySelector("#st-elapsed");
    const elLeft = timerEl.querySelector("#st-left");
    const elDone = timerEl.querySelector("#st-done");
    const elActive = timerEl.querySelector("#st-active");

    if (elElapsed) elElapsed.textContent = formatMMSS(within);
    if (elLeft) elLeft.textContent = formatMMSS(left);
    if (elDone) elDone.textContent = String(segDone);

    const active = isActive();
    if (elActive) {
      elActive.textContent = active ? "ACTIVE" : "PAUSED";
      elActive.style.opacity = active ? "0.95" : "0.65";
    }
  }

  // ===== Main =====
  const state = loadState();
  const segmentMs = SEGMENT_MIN * 60 * 1000;

  mountBadge();
  mountSegmentTimer();
  updateBadge(state.activeMs);
  updateSegmentTimer(state.activeMs);

  let lastTick = now();

  setInterval(() => {
    const t = now();
    const delta = t - lastTick;
    lastTick = t;

    // 跨日：直接重置（即使你一直開著分頁）
    const tk = todayKey();
    if (state.day !== tk) {
      state.day = tk;
      state.activeMs = 0;
      state.lastSegmentNotified = 0;
    }

    if (!isActive()) {
      updateSegmentTimer(state.activeMs);
      saveState(state);
      return;
    }

    state.activeMs += delta;

    const segIndex = Math.floor(state.activeMs / segmentMs);
    if (segIndex > 0 && segIndex > state.lastSegmentNotified) {
      state.lastSegmentNotified = segIndex;

      notify(
        `🍅 第 ${segIndex} 段（${SEGMENT_MIN} 分鐘）結束`,
        `你今天在 ${location.hostname} 已累積：${segIndex} 段（有效瀏覽 ${formatMs(state.activeMs)}）。\n` +
        `建議：休息 2–5 分鐘（喝水 / 走動 / 看遠處）。`
      );
    }

    saveState(state);
    updateBadge(state.activeMs);
    updateSegmentTimer(state.activeMs);
  }, TICK_MS);

  document.addEventListener("visibilitychange", () => {
    updateBadge(state.activeMs);
    updateSegmentTimer(state.activeMs);
  });
  window.addEventListener("focus", () => {
    updateBadge(state.activeMs);
    updateSegmentTimer(state.activeMs);
  });
  window.addEventListener("blur", () => {
    updateBadge(state.activeMs);
    updateSegmentTimer(state.activeMs);
  });
})();
