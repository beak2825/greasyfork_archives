// ==UserScript==
// @name         Bilibili 直播页随机刷新
// @namespace    https://greasyfork.org
// @version      1.1.0
// @license MIT
// @description  在 https://live.bilibili.com/ 每隔 300~3000 秒随机刷新。仅当页面在前台且打开了 DevTools 时打印倒计时到 console，避免后台刷屏。
// @match        https://live.bilibili.com/*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/552567/Bilibili%20%E7%9B%B4%E6%92%AD%E9%A1%B5%E9%9A%8F%E6%9C%BA%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552567/Bilibili%20%E7%9B%B4%E6%92%AD%E9%A1%B5%E9%9A%8F%E6%9C%BA%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** 配置 ***/
  const DEFAULT_MIN_SECONDS = 300;   // 最小刷新间隔（秒）
  const DEFAULT_MAX_SECONDS = 3000;  // 最大刷新间隔（秒）
  const PRINT_EVERY_SEC = 1;         // 倒计时检查频率（秒）；仅在 shouldLog() 为真时才实际打印
  const TAG = '[BiliAutoRefresh]';

  /*** 状态 ***/
  let minSec = Number(GM_getValue('minSec', DEFAULT_MIN_SECONDS));
  let maxSec = Number(GM_getValue('maxSec', DEFAULT_MAX_SECONDS));
  let paused = Boolean(GM_getValue('paused', false));

  let remaining = 0;
  let tickTimer = null;
  let refreshTimer = null;

  // DevTools 检测（基于窗口内外尺寸差）：对“停靠在窗口内”的 DevTools 有效；
  // “独立窗口的 DevTools”可能无法检测到（见文末说明）。
  let devtoolsOpen = false;
  const DEVTOOLS_THRESHOLD = 160;

  function detectDevtoolsDocked() {
    try {
      const wGap = Math.abs((window.outerWidth || 0) - (window.innerWidth || 0));
      const hGap = Math.abs((window.outerHeight || 0) - (window.innerHeight || 0));
      devtoolsOpen = (wGap > DEVTOOLS_THRESHOLD) || (hGap > DEVTOOLS_THRESHOLD);
    } catch (_) {
      // 某些环境可能拿不到 outerXXX，不影响功能
      devtoolsOpen = false;
    }
  }

  function isDevtoolsOpen() {
    return devtoolsOpen;
  }

  function shouldLog() {
    // 仅当前台 + DevTools 开启时打印
    return !document.hidden && isDevtoolsOpen();
  }

  /*** 工具 ***/
  function log(...args) {
    if (shouldLog()) {
      console.log(TAG, ...args);
    }
  }

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

  function clearTimers() {
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    if (refreshTimer) { clearTimeout(refreshTimer); refreshTimer = null; }
  }

  function formatHMS(totalSec) {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = (x) => String(x).padStart(2, '0');
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }

  /*** 主流程 ***/
  function scheduleNextRefresh() {
    clearTimers();

    minSec = Math.max(1, Math.floor(minSec));
    maxSec = Math.max(minSec, Math.floor(maxSec));
    remaining = randInt(minSec, maxSec);

    // 初始计划仅在“允许打印”时输出
    log(`已计划 ${remaining} 秒后刷新（范围 ${minSec}~${maxSec}s，随机值=${remaining}s）。`);

    // 倒计时：每秒递减，但只有在 shouldLog() 为真时才打印
    tickTimer = setInterval(() => {
      remaining = Math.max(0, remaining - PRINT_EVERY_SEC);

      if (shouldLog()) {
        console.log(TAG, `距离刷新剩余：${formatHMS(remaining)}（${remaining}s）`);
      }

      if (remaining <= 0) {
        clearInterval(tickTimer);
      }
    }, PRINT_EVERY_SEC * 1000);

    // 真正刷新
    refreshTimer = setTimeout(() => {
      if (shouldLog()) console.log(TAG, '到点刷新页面...');
      location.reload();
    }, remaining * 1000);
  }

  function start() {
    if (paused) {
      if (shouldLog()) console.log(TAG, '当前状态：已暂停。通过菜单选择“继续自动刷新”。');
      return;
    }
    scheduleNextRefresh();
  }

  /*** 菜单 ***/
  function registerMenu() {
    GM_registerMenuCommand(paused ? '▶️ 继续自动刷新' : '⏸ 暂停自动刷新', () => {
      paused = !paused;
      GM_setValue('paused', paused);
      if (paused) {
        clearTimers();
        if (shouldLog()) console.log(TAG, '已暂停自动刷新与倒计时。');
      } else {
        if (shouldLog()) console.log(TAG, '已恢复自动刷新。');
        start();
      }
    });

    GM_registerMenuCommand('🛠 设置最小/最大秒数', () => {
      const minInput = prompt('设置最小秒数（>=1）', String(minSec));
      if (minInput === null) return;
      const newMin = clamp(parseInt(minInput, 10) || DEFAULT_MIN_SECONDS, 1, 7 * 24 * 3600);

      const maxInput = prompt(`设置最大秒数（>= 最小秒数 ${newMin}）`, String(maxSec));
      if (maxInput === null) return;
      const newMax = clamp(parseInt(maxInput, 10) || newMin, newMin, 7 * 24 * 3600);

      minSec = newMin;
      maxSec = newMax;
      GM_setValue('minSec', minSec);
      GM_setValue('maxSec', maxSec);

      if (shouldLog()) console.log(TAG, `已更新区间为 ${minSec}~${maxSec} 秒。`);
      if (!paused) {
        if (shouldLog()) console.log(TAG, '根据新配置重新排程下一次刷新。');
        scheduleNextRefresh();
      }
    });

    GM_registerMenuCommand('↻ 立刻刷新', () => {
      if (shouldLog()) console.log(TAG, '手动触发刷新...');
      location.reload();
    });

    GM_registerMenuCommand('🔎 查看当前状态', () => {
      const msg = `状态：${paused ? '暂停' : '运行中'}；区间：${minSec}~${maxSec}s；下一次刷新剩余：${remaining > 0 ? remaining + 's' : '未排程/即将刷新'}；可见性：${document.hidden ? '后台' : '前台'}；DevTools：${isDevtoolsOpen() ? '已打开(检测到)' : '未检测到'}`;
      if (shouldLog()) console.log(TAG, msg);
      else alert(msg); // 在不打印时用 alert 告知
    });
  }

  /*** 事件：可见性/尺寸变化用于动态切换打印条件 ***/
  document.addEventListener('visibilitychange', () => {
    // 切回前台且 DevTools 开启时，同步一次剩余时间
    if (shouldLog() && remaining > 0) {
      console.log(TAG, `（前台+DevTools）距离下一次刷新剩余：${formatHMS(remaining)}（${remaining}s）`);
    }
  });

  window.addEventListener('resize', () => {
    const before = devtoolsOpen;
    detectDevtoolsDocked();
    // DevTools 状态从“未开”->“已开”时，同步一条
    if (!before && devtoolsOpen && !document.hidden && remaining > 0) {
      console.log(TAG, `（检测到DevTools开启）距离刷新剩余：${formatHMS(remaining)}（${remaining}s）`);
    }
  });

  window.addEventListener('load', detectDevtoolsDocked);

  /*** 启动 ***/
  registerMenu();
  detectDevtoolsDocked();
  start();
})();
