// ==UserScript==
// @name         HKU Enrolment Loud Alarm + Live Countdown (Count-based)
// @namespace    https://msc.engg.hku.hk/
// @version      4.5
// @author       Tian Jialin
// @license      All Rights Reserved
// @description  随机后台检查 + 页面计数检测 + 随机真刷新；当“closed 提示”数量低于阈值时强力警报；实时倒计时显示
// @match        *://msc.engg.hku.hk/online/enrolment/enrolmentrecord_add.asp*
// @run-at       document-end
// @grant        GM_notification
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559385/HKU%20Enrolment%20Loud%20Alarm%20%2B%20Live%20Countdown%20%28Count-based%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559385/HKU%20Enrolment%20Loud%20Alarm%20%2B%20Live%20Countdown%20%28Count-based%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ====== 配置 ======
  // 同时兼容两种文案：
  // 1) Online enrolment for this course is now closed.
  // 2) system is now closed
  // 你也可以按实际页面再补充其它变体
  const CLOSED_RE = /(Online\s+enrolment\s+for\s+this\s+course\s+is\s+now\s+closed\.?)|(system\s+is\s+now\s+closed\.?)/ig;

  // ✅ 阈值：页面中“closed 提示”数量 < 5 就认为可能开放（或页面异常）=> 报警
  const MIN_CLOSED_COUNT = 5;

  // ✅ DOM 检测防抖：连续 N 次都 < 阈值才报警（避免刷新后渲染未完成的误报）
  const DOM_FAIL_STREAK_REQUIRED = 2;

  // 后台“刷新检查”（fetch）随机间隔
  const REMOTE_MIN_MS = 8000;
  const REMOTE_MAX_MS = 20000;

  // 页面内检测固定间隔（扫 DOM 文本）
  const DOM_CHECK_MS = 800;

  // 真实刷新页面（location.reload）兜底
  const ENABLE_PAGE_RELOAD = true;
  const RELOAD_MIN_MS = 15000;
  const RELOAD_MAX_MS = 30000;

  // 倒计时刷新频率
  const UI_TICK_MS = 200;

  // 警报音量（0~1）
  const ALARM_VOLUME = 0.25;

  // ==================

  // 监控状态
  let monitoringEnabled = true;
  let realAlarmTriggered = false;

  // streak（防抖计数）
  let domFailStreak = 0;

  // 最新计数（用于 UI 展示）
  let lastDomCount = null;
  let lastRemoteCount = null;

  // 下次时间点
  let nextRemoteAt = 0;
  let nextDomAt = 0;
  let nextReloadAt = 0;

  // 定时器
  let remoteTimer = null;
  let domTimer = null;
  let reloadTimer = null;
  let uiTimer = null;

  // ---------- UI ----------
  GM_addStyle(`
    #tm-panel{
      position:fixed; top:12px; right:12px; z-index:999999;
      background:rgba(0,0,0,.80); color:#fff; padding:10px 12px;
      border-radius:14px; font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial;
      box-shadow:0 10px 26px rgba(0,0,0,.25); user-select:none;
      min-width: 340px; max-width: 420px;
    }
    #tm-panel .row{ display:flex; justify-content:space-between; gap:10px; }
    #tm-panel .muted{ opacity:.9; }
    #tm-panel code{ opacity:.95; }
    #tm-panel button{
      margin-top:8px; padding:6px 10px; border-radius:12px; border:0;
      cursor:pointer; font-weight:800;
    }
    #tm-panel button + button { margin-left:6px; }
    #tm-help{ margin-top:8px; border-top:1px solid rgba(255,255,255,.14); padding-top:8px; }
    #tm-help summary{ cursor:pointer; font-weight:900; opacity:.95; list-style:none; outline:none; }
    #tm-help summary::-webkit-details-marker{ display:none; }
    #tm-help .help-body{ margin-top:6px; font-size:12px; line-height:1.55; opacity:.92; }
    #tm-help ul{ margin:6px 0 0 18px; padding:0; }
    #tm-help li{ margin:4px 0; }
    #tm-footer{
      margin-top:8px; font-size:11px; opacity:.75;
      display:flex; justify-content:space-between; gap:10px;
    }
    #tm-alarm-overlay{
      position:fixed; inset:0; z-index:999998;
      background:rgba(0,0,0,.90); color:#fff;
      display:flex; align-items:center; justify-content:center;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }
    #tm-alarm-box{
      width:min(720px, 92vw);
      border:2px solid rgba(255,255,255,.25);
      border-radius:18px; padding:22px 20px;
      box-shadow:0 18px 60px rgba(0,0,0,.55);
      text-align:center;
    }
    #tm-alarm-title{ font-size:28px; font-weight:900; margin:0 0 10px; }
    #tm-alarm-desc{ font-size:16px; line-height:1.6; opacity:.92; margin:0 0 18px; }
    #tm-alarm-stop{ font-size:18px; font-weight:900; padding:12px 18px; border-radius:14px; border:0; cursor:pointer; }
  `);

  function ensurePanel() {
    if (document.getElementById('tm-panel')) return;

    const p = document.createElement('div');
    p.id = 'tm-panel';
    p.innerHTML = `
      <div class="row"><div>TM监控中</div><div id="tm-run" class="muted">加载中…</div></div>

      <div class="row"><div class="muted">DOM closed 计数</div><div id="tm-domcount" class="muted">--</div></div>
      <div class="row"><div class="muted">REMOTE closed 计数</div><div id="tm-remotecount" class="muted">--</div></div>

      <div class="row"><div class="muted">下次后台刷新检查</div><div id="tm-remote" class="muted">--</div></div>
      <div class="row"><div class="muted">下次页面内检测</div><div id="tm-dom" class="muted">--</div></div>
      <div class="row"><div class="muted">下次真实刷新页面</div><div id="tm-reload" class="muted">--</div></div>

      <div style="margin-top:6px" class="muted" id="tm-note"></div>

      <div>
        <button id="tm-unlock">启用声音(一次)</button>
        <button id="tm-test">测试警报</button>
        <button id="tm-resume">恢复监控</button>
      </div>

      <details id="tm-help" open>
        <summary>使用说明（点我收起/展开）</summary>
        <div class="help-body">
          <div><b>判定逻辑：</b>统计页面中类似以下提示出现的次数：</div>
          <div style="margin-top:4px;"><code>Online enrolment for this course is now closed.</code></div>
          <div style="margin-top:4px;"><code>system is now closed</code></div>

          <div style="margin-top:6px;">
            当 <b>closed 提示计数 &lt; ${MIN_CLOSED_COUNT}</b> 时，判定“可能已开放/页面异常”，触发：
            全屏遮罩 + 通知 +（可选）警报声。
          </div>

          <ul>
            <li><b>页面内检测</b>（每 ${DOM_CHECK_MS}ms）：扫描当前页面文本并计数（DOM 连续 ${DOM_FAIL_STREAK_REQUIRED} 次低于阈值才报警，避免误报）。</li>
            <li><b>后台刷新检查</b>（每 ${REMOTE_MIN_MS/1000}–${REMOTE_MAX_MS/1000}s 随机）：fetch 拉取最新 HTML 并计数。</li>
            <li><b>真实刷新页面</b>（每 ${RELOAD_MIN_MS/1000}–${RELOAD_MAX_MS/1000}s 随机）：location.reload() 兜底。</li>
          </ul>

          <div style="margin-top:6px;"><b>按钮说明：</b></div>
          <ul>
            <li><b>启用声音(一次)</b>：点一下“滴”声解锁音频（浏览器限制）。</li>
            <li><b>测试警报</b>：验证遮罩/通知/声音；不会暂停监控。</li>
            <li><b>恢复监控</b>：真正报警后会暂停监控，点它继续。</li>
          </ul>
        </div>
      </details>

      <div id="tm-footer">
        <span>Author: Tian Jialin</span>
        <span id="tm-ver">v4.5</span>
      </div>
    `;

    document.body.appendChild(p);

    p.querySelector('#tm-unlock').addEventListener('click', unlockAudioOnce);
    p.querySelector('#tm-test').addEventListener('click', () => triggerAlarm({ note: '（手动测试）', isTest: true }));
    p.querySelector('#tm-resume').addEventListener('click', resumeMonitoring);

    setText('#tm-run', '运行中');
    setText('#tm-note', `阈值：closed 计数 < ${MIN_CLOSED_COUNT} 则报警。`);
  }

  function setText(sel, text) {
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
  }

  function fmtMs(ms) {
    if (ms <= 0) return '0.0s';
    const s = ms / 1000;
    if (s < 10) return `${s.toFixed(1)}s`;
    if (s < 60) return `${s.toFixed(0)}s`;
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, '0')}`;
  }

  function startUiCountdown() {
    if (uiTimer) clearInterval(uiTimer);
    uiTimer = setInterval(() => {
      const now = Date.now();
      setText('#tm-remote', nextRemoteAt ? fmtMs(nextRemoteAt - now) : '--');
      setText('#tm-dom', nextDomAt ? fmtMs(nextDomAt - now) : '--');
      setText('#tm-reload', nextReloadAt ? fmtMs(nextReloadAt - now) : (ENABLE_PAGE_RELOAD ? '--' : '关闭'));

      setText('#tm-domcount', lastDomCount === null ? '--' : String(lastDomCount));
      setText('#tm-remotecount', lastRemoteCount === null ? '--' : String(lastRemoteCount));

      setText('#tm-run', monitoringEnabled ? (realAlarmTriggered ? '已触发（暂停）' : '运行中') : '已暂停');
    }, UI_TICK_MS);
  }

  // ---------- Audio ----------
  let audioUnlocked = false;
  let audioCtx = null, osc = null, gain = null, sirenTimer = null;

  async function tryAutoUnlockAudioOnLoad() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      await audioCtx.resume();
      if (audioCtx.state === 'running') {
        audioUnlocked = true;
        setText('#tm-note', '已自动启用声音（若站点允许自动播放）。');
      }
    } catch (_) {}
  }

  async function unlockAudioOnce() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      await audioCtx.resume();

      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      g.gain.value = 0.08;
      o.type = 'sine';
      o.frequency.value = 880;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      setTimeout(() => { try { o.stop(); } catch(_){} }, 120);

      audioUnlocked = true;
      setText('#tm-note', '声音已启用：如果你刷新页面后又没声，通常需要再次点一下解锁。');
    } catch (e) {
      alert('启用声音失败：请检查浏览器是否允许此网站播放声音。');
    }
  }

  function startSiren() {
    if (!audioUnlocked || osc) return;
    gain = audioCtx.createGain();
    gain.gain.value = ALARM_VOLUME;
    osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    let high = true;
    osc.frequency.value = 880;
    osc.start();

    sirenTimer = setInterval(() => {
      if (!osc) return;
      osc.frequency.setValueAtTime(high ? 1040 : 620, audioCtx.currentTime);
      high = !high;
    }, 220);
  }

  function stopSiren() {
    try {
      if (sirenTimer) clearInterval(sirenTimer);
      sirenTimer = null;
      if (osc) { osc.stop(); osc.disconnect(); }
      osc = null;
      if (gain) gain.disconnect();
      gain = null;
    } catch (_) {}
  }

  // ---------- Overlay ----------
  function showOverlay({ note, isTest }) {
    document.getElementById('tm-alarm-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'tm-alarm-overlay';
    overlay.innerHTML = `
      <div id="tm-alarm-box">
        <p id="tm-alarm-title">警报触发 ${note || ''}</p>
        <p id="tm-alarm-desc">
          ${isTest ? '这是测试警报，不会暂停监控。' : `closed 计数低于阈值（< ${MIN_CLOSED_COUNT}），可能已开放或页面异常。已暂停监控避免错过。`}
          <br>
          ${audioUnlocked ? '正在持续鸣叫。' : '声音可能被浏览器拦截（可点“启用声音(一次)”）。'}
        </p>
        <button id="tm-alarm-stop">停止警报</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#tm-alarm-stop').addEventListener('click', () => {
      stopSiren();
      overlay.remove();
    });
  }

  // ---------- 计数检测核心 ----------
  function countClosedInText(text) {
    if (!text) return 0;
    // 注意：带 /g 的正则每次 match 会推进 lastIndex，所以这里每次都新建一个等价 RegExp
    const re = new RegExp(CLOSED_RE.source, 'ig');
    const m = text.match(re);
    return m ? m.length : 0;
  }

  function countClosedInDom() {
    const text = document.body?.innerText || document.body?.textContent || '';
    return countClosedInText(text);
  }

  async function fetchClosedCount() {
    const u = new URL(location.href);
    u.searchParams.set('__tm', Date.now().toString());
    const resp = await fetch(u.toString(), { cache: 'no-store', credentials: 'include' });
    const html = await resp.text();
    return countClosedInText(html);
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function scheduleNextDomCheck() {
    if (domTimer) clearTimeout(domTimer);
    const now = Date.now();
    nextDomAt = now + DOM_CHECK_MS;
    domTimer = setTimeout(domTick, DOM_CHECK_MS);
  }

  function scheduleNextRemoteCheck() {
    if (remoteTimer) clearTimeout(remoteTimer);
    const ms = randInt(REMOTE_MIN_MS, REMOTE_MAX_MS);
    const now = Date.now();
    nextRemoteAt = now + ms;
    remoteTimer = setTimeout(remoteTick, ms);
  }

  function scheduleNextPageReload() {
    if (!ENABLE_PAGE_RELOAD) { nextReloadAt = 0; return; }
    if (reloadTimer) clearTimeout(reloadTimer);

    const ms = randInt(RELOAD_MIN_MS, RELOAD_MAX_MS);
    const now = Date.now();
    nextReloadAt = now + ms;

    reloadTimer = setTimeout(() => {
      if (!monitoringEnabled || realAlarmTriggered) return;
      location.reload();
    }, ms);
  }

  function pauseMonitoring() {
    monitoringEnabled = false;
    if (domTimer) clearTimeout(domTimer);
    if (remoteTimer) clearTimeout(remoteTimer);
    if (reloadTimer) clearTimeout(reloadTimer);

    domTimer = remoteTimer = reloadTimer = null;
    nextDomAt = nextRemoteAt = nextReloadAt = 0;
  }

  function resumeMonitoring() {
    realAlarmTriggered = false;
    monitoringEnabled = true;
    domFailStreak = 0;

    scheduleNextDomCheck();
    scheduleNextRemoteCheck();
    scheduleNextPageReload();

    setText('#tm-note', audioUnlocked
      ? `已恢复监控（阈值：${MIN_CLOSED_COUNT}）。`
      : `已恢复监控（阈值：${MIN_CLOSED_COUNT}）。想要警报声可点一次“启用声音(一次)”。`
    );
  }

  function triggerAlarm({ note, isTest }) {
    if (!isTest) {
      if (realAlarmTriggered) return;
      realAlarmTriggered = true;
      pauseMonitoring();
    }

    try {
      GM_notification({
        title: 'HKU Enrolment 警报',
        text: isTest ? '测试警报' : `closed 计数 < ${MIN_CLOSED_COUNT}（可能已开放/页面异常）`,
        timeout: 0
      });
    } catch (_) {}

    showOverlay({ note, isTest });
    startSiren();
  }

  async function remoteTick() {
    if (!monitoringEnabled) return;

    try {
      const cnt = await fetchClosedCount();
      lastRemoteCount = cnt;

      if (cnt < MIN_CLOSED_COUNT) {
        triggerAlarm({ note: `（后台刷新检查：count=${cnt}）`, isTest: false });
      } else {
        scheduleNextRemoteCheck();
      }
    } catch (_) {
      triggerAlarm({ note: '（后台抓取失败）', isTest: false });
    }
  }

  function domTick() {
    if (!monitoringEnabled) return;

    const cnt = countClosedInDom();
    lastDomCount = cnt;

    if (cnt < MIN_CLOSED_COUNT) {
      domFailStreak += 1;

      // 防抖：连续 N 次都低于阈值才报警
      if (domFailStreak >= DOM_FAIL_STREAK_REQUIRED) {
        triggerAlarm({ note: `（页面内检测：count=${cnt}，连续${domFailStreak}次）`, isTest: false });
        return;
      }
    } else {
      domFailStreak = 0;
    }

    scheduleNextDomCheck();
  }

  // ---------- start ----------
  console.log('[TM] script loaded:', location.href);

  ensurePanel();
  startUiCountdown();
  tryAutoUnlockAudioOnLoad();

  // 启动即检测（同样按计数阈值）
  const startCnt = countClosedInDom();
  lastDomCount = startCnt;

  if (startCnt < MIN_CLOSED_COUNT) {
    triggerAlarm({ note: `（启动即检测：count=${startCnt}）`, isTest: false });
  } else {
    resumeMonitoring();
  }
})();
