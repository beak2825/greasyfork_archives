// ==UserScript==
// @name         US Market Clock 美股时钟小窗
// @namespace    https://tampermonkey.net/
// @version      1.1.1
// @description  在任意网页角落悬浮显示美股交易时段（盘前/盘中/盘后/休市）与倒计时，内置常见 NYSE 假日算法（不含半日市/临时休市），支持可拖拽移动、点击标题栏折叠/展开、记忆位置与一键切换显示时区（NY/本地）。
// @icon         https://youke2.picui.cn/s1/2025/12/21/694744b22531b.png
// @author       BFD_qt
// @license      MIT
// @match        *://*/*
// @run-at       document-end
// @noframes
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/561549/US%20Market%20Clock%20%E7%BE%8E%E8%82%A1%E6%97%B6%E9%92%9F%E5%B0%8F%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/561549/US%20Market%20Clock%20%E7%BE%8E%E8%82%A1%E6%97%B6%E9%92%9F%E5%B0%8F%E7%AA%97.meta.js
// ==/UserScript==

/**
 * US Market Clock 美股时钟小窗
 * ============================
 * Maintainer Notes
 * - Time: All session state & countdown are computed in NY timezone (America/New_York) via Intl APIs (DST-aware).
 * - UI: DOM + CSS via GM_addStyle, no external deps. Small draggable window, click header to collapse/expand.
 * - Storage: Position + collapsed + display TZ mode stored via GM_* (fallback to localStorage).
 * - Holiday: Common NYSE holiday algorithm (best-effort). Does NOT include half-days, special closures, or emergency halts.
 *
 * Compliance / Risk Notice
 * ------------------------
 * 本脚本仅用于展示公开已知的交易时段信息与倒计时提示，不提供交易、撮合、下单、资金划转、充值/提现等任何功能，
 * 不构成投资建议，也不对任何证券/平台/服务作推荐。
 *
 * 市场交易时间可能因半日市、临时休市、突发事件、交易所规则变更等原因而改变；
 * 本脚本采用“best-effort”方式推算，用户应以交易所/券商官方公告与实际行情为准。
 */


(() => {
  "use strict";

  // --------- Config ----------
  const NY_TZ = "America/New_York";
  const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const Z_INDEX = 2147483647;
  const DEFAULT_POS = { right: 14, top: 86 }; // corner-like
  const SESSION = {
    PRE_START: 4 * 60,          // 04:00 NY
    REG_START: 9 * 60 + 30,     // 09:30 NY
    REG_END: 16 * 60,           // 16:00 NY
    AFT_END: 20 * 60,           // 20:00 NY
  };

  // --------- Storage ----------
  function sGet(key, defVal) {
    try {
      if (typeof GM_getValue === "function") return GM_getValue(key, defVal);
    } catch (_) {}
    try {
      const v = localStorage.getItem("usmc:" + key);
      return v == null ? defVal : JSON.parse(v);
    } catch (_) {
      return defVal;
    }
  }
  function sSet(key, val) {
    try {
      if (typeof GM_setValue === "function") return GM_setValue(key, val);
    } catch (_) {}
    try {
      localStorage.setItem("usmc:" + key, JSON.stringify(val));
    } catch (_) {}
  }

  // --------- Time helpers (Intl) ----------
  const dtfPartsCache = new Map();
  function getDTF(timeZone) {
    if (!dtfPartsCache.has(timeZone)) {
      dtfPartsCache.set(
        timeZone,
        new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          weekday: "short",
        })
      );
    }
    return dtfPartsCache.get(timeZone);
  }

  function partsToMap(parts) {
    const m = {};
    for (const p of parts) {
      if (p.type !== "literal") m[p.type] = p.value;
    }
    return m;
  }

  function getTZParts(date, timeZone) {
    const parts = getDTF(timeZone).formatToParts(date);
    const m = partsToMap(parts);
    return {
      year: +m.year,
      month: +m.month,
      day: +m.day,
      hour: +m.hour,
      minute: +m.minute,
      second: +m.second,
      weekday: m.weekday, // Sun Mon...
    };
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function dateKey(y, mo, d) {
    return `${y}-${pad2(mo)}-${pad2(d)}`;
  }

  function fmtHMS(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  }

  function fmtTimeInTZ(date, timeZone, withSeconds = true) {
    const p = getTZParts(date, timeZone);
    return withSeconds
      ? `${pad2(p.hour)}:${pad2(p.minute)}:${pad2(p.second)}`
      : `${pad2(p.hour)}:${pad2(p.minute)}`;
  }

  function weekdayIndex(weekdayShort) {
    const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return map[weekdayShort] ?? 0;
  }

  // Compute timezone offset (ms) for a given absolute instant
  function tzOffsetMs(timeZone, date) {
    const p = getTZParts(date, timeZone);
    const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    return asUTC - date.getTime();
  }

  // Convert "local time in TZ" to UTC timestamp (ms)
  function zonedTimeToUtcTs(timeZone, y, mo, d, hh, mm, ss) {
    const utcGuess = Date.UTC(y, mo - 1, d, hh, mm, ss);
    let guessDate = new Date(utcGuess);
    let off1 = tzOffsetMs(timeZone, guessDate);
    let ts = utcGuess - off1;

    // refine (DST edge)
    const refined = new Date(ts);
    const off2 = tzOffsetMs(timeZone, refined);
    if (off2 !== off1) ts = utcGuess - off2;

    return ts;
  }

  function addNYDays(ymd, days) {
    const tsNoon = zonedTimeToUtcTs(NY_TZ, ymd.year, ymd.month, ymd.day, 12, 0, 0);
    const ts2 = tsNoon + days * 86400000;
    const p = getTZParts(new Date(ts2), NY_TZ);
    return { year: p.year, month: p.month, day: p.day, weekday: p.weekday };
  }

  // --------- Holiday calendar (common NYSE holidays; no half-days / special closures) ----------
  const holidayCache = new Map(); // year -> Set(dateKey)

  function nthWeekdayOfMonth(year, month1to12, weekday0Sun, n) {
    const first = new Date(Date.UTC(year, month1to12 - 1, 1, 12, 0, 0));
    const firstDow = first.getUTCDay();
    const delta = (weekday0Sun - firstDow + 7) % 7;
    return 1 + delta + (n - 1) * 7;
  }

  function lastWeekdayOfMonth(year, month1to12, weekday0Sun) {
    const last = new Date(Date.UTC(year, month1to12, 0, 12, 0, 0));
    const lastDow = last.getUTCDay();
    const delta = (lastDow - weekday0Sun + 7) % 7;
    return last.getUTCDate() - delta;
  }

  function easterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return { year, month, day };
  }

  function observedDateUTC(y, mo, d) {
    const dt = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
    const dow = dt.getUTCDay();
    if (dow === 6) return new Date(Date.UTC(y, mo - 1, d - 1, 12, 0, 0)); // Sat -> Fri
    if (dow === 0) return new Date(Date.UTC(y, mo - 1, d + 1, 12, 0, 0)); // Sun -> Mon
    return dt;
  }

  function dateKeyFromUTCDate(dt) {
    return dateKey(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
  }

  function ensureHolidayYear(year) {
    if (holidayCache.has(year)) return holidayCache.get(year);
    const set = new Set();

    set.add(dateKeyFromUTCDate(observedDateUTC(year, 1, 1))); // New Year
    set.add(dateKey(year, 1, nthWeekdayOfMonth(year, 1, 1, 3))); // MLK 3rd Mon Jan
    set.add(dateKey(year, 2, nthWeekdayOfMonth(year, 2, 1, 3))); // Presidents 3rd Mon Feb

    const easter = easterSunday(year);
    const easterUTC = new Date(Date.UTC(easter.year, easter.month - 1, easter.day, 12, 0, 0));
    const goodFridayUTC = new Date(easterUTC.getTime() - 2 * 86400000);
    set.add(dateKeyFromUTCDate(goodFridayUTC)); // Good Friday

    set.add(dateKey(year, 5, lastWeekdayOfMonth(year, 5, 1))); // Memorial last Mon May
    set.add(dateKeyFromUTCDate(observedDateUTC(year, 6, 19))); // Juneteenth
    set.add(dateKeyFromUTCDate(observedDateUTC(year, 7, 4))); // Independence
    set.add(dateKey(year, 9, nthWeekdayOfMonth(year, 9, 1, 1))); // Labor 1st Mon Sep
    set.add(dateKey(year, 11, nthWeekdayOfMonth(year, 11, 4, 4))); // Thanksgiving 4th Thu Nov
    set.add(dateKeyFromUTCDate(observedDateUTC(year, 12, 25))); // Christmas

    holidayCache.set(year, set);
    return set;
  }

  function isHolidayNY(ymd) {
    const key = dateKey(ymd.year, ymd.month, ymd.day);
    const s0 = ensureHolidayYear(ymd.year);
    const sM = ensureHolidayYear(ymd.year - 1);
    const sP = ensureHolidayYear(ymd.year + 1);
    return s0.has(key) || sM.has(key) || sP.has(key);
  }

  function isTradingDayNY(ymd) {
    const dow = weekdayIndex(ymd.weekday);
    if (dow === 0 || dow === 6) return false;
    if (isHolidayNY(ymd)) return false;
    return true;
  }

  function nextTradingDayNY(fromYmd) {
    let cur = { ...fromYmd };
    for (let i = 0; i < 10; i++) {
      cur = addNYDays(cur, 1);
      if (isTradingDayNY(cur)) return cur;
    }
    let j = 10;
    while (j < 400) {
      cur = addNYDays(cur, 1);
      if (isTradingDayNY(cur)) return cur;
      j++;
    }
    return cur;
  }

  // --------- Session calculation (always based on NY) ----------
  function calcMarketState(now = new Date()) {
    const ny = getTZParts(now, NY_TZ);
    const minutes = ny.hour * 60 + ny.minute + ny.second / 60;
    const today = { year: ny.year, month: ny.month, day: ny.day, weekday: ny.weekday };

    const tradingDay = isTradingDayNY(today);

    let state = "CLOSED";
    let stateCN = "休市";
    let stateSub = "市场未在交易";
    let nextLabel = "";
    let nextTs = 0;

    function tsAtYMD(ymd, hh, mm, ss = 0) {
      return zonedTimeToUtcTs(NY_TZ, ymd.year, ymd.month, ymd.day, hh, mm, ss);
    }

    // which trading day to show in the table:
    let scheduleDay = today;
    if (!tradingDay || minutes >= SESSION.AFT_END) scheduleDay = nextTradingDayNY(today);

    if (!tradingDay) {
      state = "CLOSED";
      stateCN = "休市";
      stateSub = "周末/假日（按常见假日算法判断）";
      nextLabel = "盘前";
      nextTs = tsAtYMD(nextTradingDayNY(today), 4, 0, 0);
    } else {
      if (minutes < SESSION.PRE_START) {
        state = "CLOSED";
        stateCN = "休市";
        stateSub = "等待盘前";
        nextLabel = "盘前";
        nextTs = tsAtYMD(today, 4, 0, 0);
      } else if (minutes < SESSION.REG_START) {
        state = "PRE";
        stateCN = "盘前";
        stateSub = "盘前交易时段";
        nextLabel = "盘中";
        nextTs = tsAtYMD(today, 9, 30, 0);
      } else if (minutes < SESSION.REG_END) {
        state = "REG";
        stateCN = "盘中";
        stateSub = "市场正在交易";
        nextLabel = "盘后";
        nextTs = tsAtYMD(today, 16, 0, 0);
      } else if (minutes < SESSION.AFT_END) {
        state = "AFT";
        stateCN = "盘后";
        stateSub = "盘后交易时段";
        nextLabel = "休市";
        nextTs = tsAtYMD(today, 20, 0, 0);
      } else {
        state = "CLOSED";
        stateCN = "休市";
        stateSub = "今日盘后结束";
        nextLabel = "盘前";
        nextTs = tsAtYMD(nextTradingDayNY(today), 4, 0, 0);
      }
    }

    return {
      ny,
      todayNY: today,
      tradingDay,
      scheduleDayNY: scheduleDay,
      state,
      stateCN,
      stateSub,
      nextLabel,
      nextTs,
      nowTs: now.getTime(),
    };
  }

  // --------- UI ----------
  const root = document.createElement("div");
  root.id = "usmc-root";
  root.innerHTML = `
    <div class="usmc-header" title="拖拽移动；单击折叠/展开">
      <div class="usmc-title">
        <span class="usmc-dot"></span>
        <span>美股时钟</span>
        <button class="usmc-badge usmc-badge-btn" id="usmc-tz" type="button" title="切换显示时区（美东 ⇄ 本地）">NY</button>
      </div>
      <div class="usmc-actions">
        <button class="usmc-btn" id="usmc-close" title="关闭">✕</button>
      </div>
    </div>

    <div class="usmc-body" id="usmc-body">
      <div class="usmc-main">
        <div class="usmc-state" id="usmc-state">—</div>
        <div class="usmc-sub" id="usmc-sub">—</div>
      </div>

      <div class="usmc-next">
        <div class="usmc-next-label" id="usmc-next-label">下一时段：—</div>
        <div class="usmc-count" id="usmc-count">--:--:--</div>
      </div>

      <div class="usmc-table">
        <div class="usmc-row"><span>盘前</span><span id="usmc-pre">--</span></div>
        <div class="usmc-row"><span>盘中</span><span id="usmc-reg">--</span></div>
        <div class="usmc-row"><span>盘后</span><span id="usmc-aft">--</span></div>
      </div>

      <div class="usmc-foot">
        <div>美东时间：<span id="usmc-ny">--:--:--</span></div>
        <div>本地时间：<span id="usmc-local">--:--:--</span></div>
        <div class="usmc-note">注：不含半日市/临时休市；仅供参考</div>
      </div>
    </div>
  `;
  document.documentElement.appendChild(root);

  GM_addStyle(`
    #usmc-root{
      position: fixed;
      z-index: ${Z_INDEX};
      top: ${DEFAULT_POS.top}px;
      right: ${DEFAULT_POS.right}px;
      width: 240px;
      user-select: none;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "PingFang SC","Microsoft YaHei", Arial;
      color: #eaf6ff;
    }
    #usmc-root *{ box-sizing: border-box; }
    #usmc-root .usmc-header{
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding: 8px 10px;
      border-radius: 12px 12px 10px 10px;
      background: rgba(12, 18, 28, 0.82);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 26px rgba(0,0,0,.35);
      cursor: grab;
    }
    #usmc-root .usmc-title{
      display:flex; align-items:center; gap:8px;
      font-size: 13px; font-weight: 650;
      letter-spacing: .2px;
    }
    #usmc-root .usmc-dot{
      width:10px; height:10px; border-radius: 50%;
      background: #2dd4bf;
      box-shadow: 0 0 0 3px rgba(45,212,191,.18);
    }
    #usmc-root .usmc-badge{
      margin-left: 2px;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
      opacity: .92;
      line-height: 1.2;
    }
    #usmc-root .usmc-badge-btn{
      cursor: pointer;
    }
    #usmc-root .usmc-badge-btn:hover{
      background: rgba(255,255,255,.10);
    }
    #usmc-root .usmc-actions{ display:flex; gap:6px; }
    #usmc-root .usmc-btn{
      width: 30px; height: 22px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.06);
      color:#eaf6ff;
      border-radius: 8px;
      cursor:pointer;
      line-height: 20px;
      font-size: 12px;
    }
    #usmc-root .usmc-btn:hover{ background: rgba(255,255,255,.10); }

    #usmc-root .usmc-body{
      margin-top: 8px;
      padding: 10px;
      border-radius: 12px;
      background: rgba(10, 14, 24, 0.78);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,.10);
      box-shadow: 0 10px 26px rgba(0,0,0,.30);
    }
    #usmc-root .usmc-main{
      padding: 10px;
      border-radius: 12px;
      background: rgba(16, 64, 72, 0.38);
      border: 1px solid rgba(45,212,191,.20);
    }
    #usmc-root .usmc-state{
      font-size: 30px;
      font-weight: 800;
      letter-spacing: 1px;
      text-align:center;
    }
    #usmc-root .usmc-sub{
      margin-top: 4px;
      font-size: 12px;
      opacity: .88;
      text-align:center;
    }

    #usmc-root .usmc-next{
      margin-top: 10px;
      padding: 10px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.05);
      display:flex;
      align-items:center;
      justify-content: space-between;
      gap:10px;
    }
    #usmc-root .usmc-next-label{
      font-size: 12px;
      opacity: .9;
      white-space: nowrap;
    }
    #usmc-root .usmc-count{
      font-variant-numeric: tabular-nums;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: .5px;
    }

    #usmc-root .usmc-table{
      margin-top: 10px;
      padding: 8px 10px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.03);
      font-size: 12px;
      opacity: .95;
    }
    #usmc-root .usmc-row{
      display:flex; justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,.08);
      gap: 12px;
    }
    #usmc-root .usmc-row:last-child{ border-bottom: none; }
    #usmc-root .usmc-row span:last-child{ opacity: .85; text-align:right; }

    #usmc-root .usmc-foot{
      margin-top: 10px;
      font-size: 11px;
      opacity: .86;
      line-height: 1.45;
    }
    #usmc-root .usmc-note{
      margin-top: 6px;
      opacity: .75;
    }

    #usmc-root.usmc-collapsed .usmc-body{ display:none; }
  `);

  // restore position
  const saved = sGet("pos", null);
  if (saved && typeof saved.x === "number" && typeof saved.y === "number") {
    root.style.left = `${saved.x}px`;
    root.style.top = `${saved.y}px`;
    root.style.right = "auto";
  } else {
    root.style.top = `${DEFAULT_POS.top}px`;
    root.style.right = `${DEFAULT_POS.right}px`;
  }

  // collapsed state
  const collapsed = !!sGet("collapsed", false);
  if (collapsed) root.classList.add("usmc-collapsed");

  // display TZ mode: "NY" or "LOCAL"
  let displayMode = sGet("displayMode", "NY");
  function getDisplayTZ() {
    return displayMode === "LOCAL" ? LOCAL_TZ : NY_TZ;
  }

  // close
  const closeBtn = root.querySelector("#usmc-close");
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    root.remove();
  });

  // header collapse toggle
  const header = root.querySelector(".usmc-header");
  header.addEventListener("click", () => {
    if (header.dataset.justDragged === "1") {
      header.dataset.justDragged = "0";
      return;
    }
    root.classList.toggle("usmc-collapsed");
    sSet("collapsed", root.classList.contains("usmc-collapsed"));
  });

  // TZ badge toggle (as the only toggle)
  const tzBadgeBtn = root.querySelector("#usmc-tz");
  function refreshTZUI() {
    const isLocal = displayMode === "LOCAL";
    tzBadgeBtn.textContent = isLocal ? "LOC" : "NY";
    tzBadgeBtn.title = isLocal
      ? `当前显示：本地时区（${LOCAL_TZ}）。点击切回美东`
      : `当前显示：美东（${NY_TZ}）。点击切到本地（${LOCAL_TZ}）`;
  }
  tzBadgeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    displayMode = displayMode === "LOCAL" ? "NY" : "LOCAL";
    sSet("displayMode", displayMode);
    refreshTZUI();
  });
  refreshTZUI();

  // prevent header click from action buttons area (close)
  root.querySelector(".usmc-actions").addEventListener("click", (e) => e.stopPropagation());

  // drag
  let dragging = false;
  let startX = 0, startY = 0;
  let origLeft = 0, origTop = 0;
  let moved = false;

  function getRectLeftTop(el) {
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top };
  }

  function getPoint(ev) {
    if (ev.touches && ev.touches[0]) return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    return { x: ev.clientX, y: ev.clientY };
  }

  function onDown(ev) {
    if (ev.target && ev.target.closest && (ev.target.closest(".usmc-actions") || ev.target.closest("#usmc-tz"))) return;
    dragging = true;
    moved = false;
    header.style.cursor = "grabbing";
    const pt = getPoint(ev);
    startX = pt.x; startY = pt.y;
    const pos = getRectLeftTop(root);
    origLeft = pos.left;
    origTop = pos.top;
    root.style.left = `${origLeft}px`;
    root.style.top = `${origTop}px`;
    root.style.right = "auto";
    ev.preventDefault?.();
  }

  function onMove(ev) {
    if (!dragging) return;
    const pt = getPoint(ev);
    const dx = pt.x - startX;
    const dy = pt.y - startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;

    const newLeft = Math.max(6, Math.min(window.innerWidth - 60, origLeft + dx));
    const newTop = Math.max(6, Math.min(window.innerHeight - 40, origTop + dy));
    root.style.left = `${newLeft}px`;
    root.style.top = `${newTop}px`;
  }

  function onUp() {
    if (!dragging) return;
    dragging = false;
    header.style.cursor = "grab";
    const pos = getRectLeftTop(root);
    sSet("pos", { x: Math.round(pos.left), y: Math.round(pos.top) });
    if (moved) header.dataset.justDragged = "1";
  }

  header.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseup", onUp, { passive: true });

  header.addEventListener("touchstart", onDown, { passive: false });
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onUp, { passive: true });

  // --------- Rendering loop ----------
  const elState = root.querySelector("#usmc-state");
  const elSub = root.querySelector("#usmc-sub");
  const elNextLabel = root.querySelector("#usmc-next-label");
  const elCount = root.querySelector("#usmc-count");

  const elPre = root.querySelector("#usmc-pre");
  const elReg = root.querySelector("#usmc-reg");
  const elAft = root.querySelector("#usmc-aft");

  const elNY = root.querySelector("#usmc-ny");
  const elLocal = root.querySelector("#usmc-local");
  const dot = root.querySelector(".usmc-dot");

  function setDotByState(state) {
    if (state === "REG") {
      dot.style.background = "#34d399";
      dot.style.boxShadow = "0 0 0 3px rgba(52,211,153,.18)";
    } else if (state === "PRE" || state === "AFT") {
      dot.style.background = "#60a5fa";
      dot.style.boxShadow = "0 0 0 3px rgba(96,165,250,.18)";
    } else {
      dot.style.background = "#fbbf24";
      dot.style.boxShadow = "0 0 0 3px rgba(251,191,36,.18)";
    }
  }

  function tsAtNYDay(ymdNY, hh, mm, ss = 0) {
    return zonedTimeToUtcTs(NY_TZ, ymdNY.year, ymdNY.month, ymdNY.day, hh, mm, ss);
  }

  function fmtHHMM(ts, tz) {
    const p = getTZParts(new Date(ts), tz);
    return `${pad2(p.hour)}:${pad2(p.minute)}`;
  }

  function formatRange(tsStart, tsEnd, displayTZ, suffix) {
    // ✅ 不显示 (+1)/(-1)
    return `${fmtHHMM(tsStart, displayTZ)} – ${fmtHHMM(tsEnd, displayTZ)}${suffix}`;
  }

  function updateSchedule(ymdNY) {
    const displayTZ = getDisplayTZ();
    const suffix = displayMode === "LOCAL" ? "（本地）" : "（美东）";

    const preS = tsAtNYDay(ymdNY, 4, 0, 0);
    const regS = tsAtNYDay(ymdNY, 9, 30, 0);
    const regE = tsAtNYDay(ymdNY, 16, 0, 0);
    const aftE = tsAtNYDay(ymdNY, 20, 0, 0);

    elPre.textContent = formatRange(preS, regS, displayTZ, suffix);
    elReg.textContent = formatRange(regS, regE, displayTZ, suffix);
    elAft.textContent = formatRange(regE, aftE, displayTZ, suffix);
  }

  function tick() {
    const now = new Date();
    const st = calcMarketState(now);

    elState.textContent = st.stateCN;
    elSub.textContent = st.stateSub;
    elNextLabel.textContent = `下一时段：${st.nextLabel}`;
    elCount.textContent = fmtHMS((st.nextTs - st.nowTs) / 1000);

    setDotByState(st.state);

    updateSchedule(st.scheduleDayNY);

    elNY.textContent = fmtTimeInTZ(now, NY_TZ, true);
    elLocal.textContent = fmtTimeInTZ(now, LOCAL_TZ, true);

    const delay = Math.max(120, 1000 - now.getMilliseconds());
    setTimeout(tick, delay);
  }

  tick();
})();
