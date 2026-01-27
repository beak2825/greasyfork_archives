// ==UserScript==
// @name         港大工学院选课结果更新脚本（手机app推送）HKU Enrolment Alert: view.asp missing keyword + auto reload (ntfy)
// @namespace    https://msc.engg.hku.hk/
// @version      2.2
// @author       Tian Jialin
// @license      MIT
// @description  定期抓取 enrolmentrecord_view.asp；若“不包含”关键词则报警 + ntfy；并随机真实刷新页面兜底
// @match        https://msc.engg.hku.hk/online/enrolment/enrolmentrecord_view.asp*
// @run-at       document-end
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      ntfy.sh
// @connect      msc.engg.hku.hk
// @downloadURL https://update.greasyfork.org/scripts/564129/%E6%B8%AF%E5%A4%A7%E5%B7%A5%E5%AD%A6%E9%99%A2%E9%80%89%E8%AF%BE%E7%BB%93%E6%9E%9C%E6%9B%B4%E6%96%B0%E8%84%9A%E6%9C%AC%EF%BC%88%E6%89%8B%E6%9C%BAapp%E6%8E%A8%E9%80%81%EF%BC%89HKU%20Enrolment%20Alert%3A%20viewasp%20missing%20keyword%20%2B%20auto%20reload%20%28ntfy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564129/%E6%B8%AF%E5%A4%A7%E5%B7%A5%E5%AD%A6%E9%99%A2%E9%80%89%E8%AF%BE%E7%BB%93%E6%9E%9C%E6%9B%B4%E6%96%B0%E8%84%9A%E6%9C%AC%EF%BC%88%E6%89%8B%E6%9C%BAapp%E6%8E%A8%E9%80%81%EF%BC%89HKU%20Enrolment%20Alert%3A%20viewasp%20missing%20keyword%20%2B%20auto%20reload%20%28ntfy%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ===== 配置 =====
  const CHECK_URL = 'https://msc.engg.hku.hk/online/enrolment/enrolmentrecord_view.asp';
  const KEYWORD = 'Enrolment request is being';

  // 远程抓取检测频率（毫秒）
  const REMOTE_CHECK_MS = 1500;

  // ✅ 缺失防抖：连续 N 次都“缺失关键词”才报警
  const MISSING_STREAK_REQUIRED = 2;

  // ✅ 自动真实刷新页面（location.reload）兜底
  const ENABLE_PAGE_RELOAD = true;
  const RELOAD_MIN_MS = 30000;
  const RELOAD_MAX_MS = 60000;

  // 报警触发后是否停止继续检测/刷新
  const STOP_AFTER_ALARM = true;

  // 声音：蜂鸣（可能需要先与页面交互才允许播放）
  const ENABLE_BEEP = true;
  const BEEP_VOLUME = 0.50;     // 0~1
  const BEEP_MS = 120000;       // 120 秒

  // ntfy
  const NTFY_ENABLE = true;
  const NTFY_TOPIC = 'wokao';
  // =================

  let alarmed = false;
  let checkTimer = null;
  let reloadTimer = null;
  let missingStreak = 0;

  // ---- 工具函数 ----
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ---- 声音 ----
  let audioCtx = null;
  function beepOnce() {
    if (!ENABLE_BEEP) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      gain.gain.value = BEEP_VOLUME;
      osc.type = 'sine';
      osc.frequency.value = 880;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      setTimeout(() => { try { osc.stop(); } catch (_) {} }, BEEP_MS);
    } catch (_) {}
  }

  function notify(msg) {
    try {
      GM_notification({ title: 'HKU Enrolment Alert', text: msg, timeout: 0 });
    } catch (_) {}
  }

  // ---- ntfy 推送（URL 参数方式，避免 header 编码坑）----
  function pushToNtfy(msg) {
    if (!NTFY_ENABLE) return;

    const safeTitle = 'HKU Enrolment Alert';
    const url =
      `https://ntfy.sh/${encodeURIComponent(NTFY_TOPIC)}/publish` +
      `?title=${encodeURIComponent(safeTitle)}` +
      `&priority=5` +
      `&message=${encodeURIComponent(msg)}`;

    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: (r) => {
        if (r.status < 200 || r.status >= 300) {
          console.warn('[ntfy] push failed:', r.status, r.responseText);
        } else {
          console.log('[ntfy] pushed ok');
        }
      },
      onerror: (e) => {
        console.warn('[ntfy] push error:', e);
      }
    });
  }

  function cleanup() {
    if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
    if (reloadTimer) { clearTimeout(reloadTimer); reloadTimer = null; }
  }

  function scheduleReload() {
    if (!ENABLE_PAGE_RELOAD || alarmed) return;
    if (reloadTimer) clearTimeout(reloadTimer);

    const ms = randInt(RELOAD_MIN_MS, RELOAD_MAX_MS);
    reloadTimer = setTimeout(() => {
      if (alarmed) return;
      location.reload();
    }, ms);
  }

  function triggerAlarm(reason) {
    if (alarmed) return;
    alarmed = true;

    const msg =
      `未检测到关键词：${KEYWORD}\n` +
      `原因：${reason}\n` +
      `检测页面：${CHECK_URL}\n` +
      `触发页面：${location.href}\n` +
      `时间：${new Date().toLocaleString()}`;

    // 推送到手机
    pushToNtfy(msg);

    // 本地提示
    notify(`缺失关键词：${KEYWORD}`);
    beepOnce();
    alert(`🚨 HKU Enrolment Alert\n\n页面未检测到关键词：\n${KEYWORD}\n\n已推送 ntfy topic：${NTFY_TOPIC}`);

    if (STOP_AFTER_ALARM) cleanup();
  }

  // ---- 抓取 view.asp 并检测 “缺失” ----
  function fetchAndCheck() {
    if (alarmed) return;

    const url = `${CHECK_URL}?__tm=${Date.now()}`; // 绕缓存

    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: (r) => {
        if (alarmed) return;

        if (r.status < 200 || r.status >= 300) {
          console.warn('[check] http not ok:', r.status);
          // 这里默认“不把 HTTP 异常当缺失”，避免误报。
          // 如果你想更激进：把下面两行取消注释即可
          // missingStreak += 1;
          // if (missingStreak >= MISSING_STREAK_REQUIRED) triggerAlarm(`HTTP异常连续${missingStreak}次（状态码${r.status}）`);
          scheduleReload(); // 失败时也尽快安排一次刷新兜底
          return;
        }

        const html = r.responseText || '';
        const hasKeyword = html.includes(KEYWORD);

        if (!hasKeyword) {
          missingStreak += 1;
          console.warn(`[check] keyword missing streak=${missingStreak}`);

          if (missingStreak >= MISSING_STREAK_REQUIRED) {
            triggerAlarm(`连续 ${missingStreak} 次未出现关键词`);
            return;
          }
        } else {
          missingStreak = 0;
          console.log('[check] keyword present');
        }

        // 每轮检测后都重新安排一次随机刷新（保持长期运行更稳）
        scheduleReload();
      },
      onerror: (e) => {
        console.warn('[check] request error:', e);
        // 网络错误不直接算“缺失”，但可以安排一次刷新兜底
        scheduleReload();
      }
    });
  }

  function start() {
    console.log('[view-missing-check-ntfy+reload] loaded:', location.href);

    // 立即检查一次
    fetchAndCheck();

    // 周期检查
    checkTimer = setInterval(fetchAndCheck, REMOTE_CHECK_MS);

    // 同时启动刷新兜底
    scheduleReload();
  }

  start();
})();
