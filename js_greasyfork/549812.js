// ==UserScript==
// @name         到点刷新（极简版）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在设定的 HH:mm:ss.SSS 时刻刷新当前页（每天一次）
// @match        *://*/*
// @license MIT
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/549812/%E5%88%B0%E7%82%B9%E5%88%B7%E6%96%B0%EF%BC%88%E6%9E%81%E7%AE%80%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549812/%E5%88%B0%E7%82%B9%E5%88%B7%E6%96%B0%EF%BC%88%E6%9E%81%E7%AE%80%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ======= 只改这一行：目标时间（24小时制，支持毫秒）=======
  const TARGET_TIME = "18:59:59.800"; // 例：上午 09:00:00.300 刷新
  // ==========================================================

  // 解析 "HH:mm:ss.SSS" → 当天毫秒
  function parseMs(t) {
    const [h, m, s] = t.replace(/：/g, ":").split(":");
    let ss = "00", ms = "000";
    if (s && s.includes(".")) { [ss, ms] = s.split("."); }
    else if (s) { ss = s; }
    return (+h)*3600000 + (+m)*60000 + (+ss)*1000 + (+ms.padEnd(3,"0"));
  }

  function nextEpoch(tStr) {
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    let target = base + parseMs(tStr);
    if (target <= Date.now()) target += 24*3600*1000; // 今天过了就明天
    return target;
  }

  const aim = nextEpoch(TARGET_TIME);
  const delay = Math.max(0, aim - Date.now());

  setTimeout(() => {
    try {
      const u = new URL(location.href);
      u.searchParams.set("_ts", Date.now().toString());
      location.replace(u.toString());
    } catch {
      location.reload();
    }
  }, delay);
})();
