// ==UserScript==
// @name         HKU Enrolment Loud Alarm + Live Countdown
// @namespace    https://msc.engg.hku.hk/
// @version      4.4
// @author       Tian Jialin
// @license      All Rights Reserved
// @description  后台随机“刷新”检查 + 页面内检测 + 真实随机刷新页面；触发强力警报；测试警报可多次；实时倒计时显示
// @match        *://msc.engg.hku.hk/online/enrolment/enrolmentrecord_add.asp*
// @run-at       document-end
// @grant        GM_notification
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559385/HKU%20Enrolment%20Loud%20Alarm%20%2B%20Live%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/559385/HKU%20Enrolment%20Loud%20Alarm%20%2B%20Live%20Countdown.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ====== 配置 ======
  const CLOSED_RE = /Online enrolment for this course is now closed\.?/i;

  // 后台“刷新检查”（fetch）随机间隔
  const REMOTE_MIN_MS = 8000;
  const REMOTE_MAX_MS = 20000;

  // 页面内检测固定间隔（扫 DOM 文本）
  const DOM_CHECK_MS = 800;

  // ✅ 改法2：真实刷新页面（location.reload）兜底
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
      background:rgba(0,0,0,.80); color:#fff;
      padding:10px 12px; border-radius:14px;
      font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial;
      box-shadow:0 10px 26px rgba(0,0,0,.25);
      user-select:none;
      min-width: 320px;
      max-width: 380px;
    }
    #tm-panel .row{ display:flex; justify-content:space-between; gap:10px; }
    #tm-panel .muted{ opacity:.9; }
    #tm-panel button{
      margin-top:8px;
      padding:6px 10px; border-radius:12px;
      border:0; cursor:pointer; font-weight:800;
    }
    #tm-panel button + button { margin-left:6px; }

    #tm-help{
      margin-top:8px;
      border-top:1px solid rgba(255,255,255,.14);
      padding-top:8px;
    }
    #tm-help summary{
      cursor:pointer;
      font-weight:900;
      opacity:.95;
      list-style:none;
      outline:none;
    }
    #tm-help summary::-webkit-details-marker{ display:none; }
    #tm-help .help-body{
      margin-top:6px;
      font-size:12px;
      line-height:1.55;
      opacity:.92;
    }
    #tm-help ul{
      margin:6px 0 0 18px;
      padding:0;
    }
    #tm-help li{ margin:4px 0; }
    #tm-footer{
      margin-top:8px;
      font-size:11px;
      opacity:.75;
      display:flex;
      justify-content:space-between;
      gap:10px;
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
      border-radius:18px;
      padding:22px 20px;
      box-shadow:0 18px 60px rgba(0,0,0,.55);
      text-align:center;
    }
    #tm-alarm-title{ font-size:28px; font-weight:900; margin:0 0 10px; }
    #tm-alarm-desc{ font-size:16px; line-height:1.6; opacity:.92; margin:0 0 18px; }
    #tm-alarm-stop{
      font-size:18px; font-weight:900;
      padding:12px 18px; border-radius:14px;
      border:0; cursor:pointer;
    }
  `);

  function ensurePanel() {
    if (document.getElementById('tm-panel')) return;

    const p = document.createElement('div');
    p.id = 'tm-panel';
    p.innerHTML = `
      <div class="row"><div>TM监控中</div><div id="tm-run" class="muted">加载中…</div></div>
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
        <summary>📌 使用说明（点我收起/展开）</summary>
        <div class="help-body">
          <div><b>用途：</b>脚本会持续寻找页面提示：</div>
          <div style="margin-top:4px;"><code>Online enrolment for this course is now closed.</code></div>
          <div style="margin-top:6px;">
            <b>当“找不到这句提示”时</b>，判定“可能已开放/页面异常”，触发：全屏遮罩 + 通知 +（可选）警报声。
          </div>

          <ul>
            <li><b>页面内检测</b>（每 ${DOM_CHECK_MS}ms）：扫描当前页面文字。</li>
            <li><b>后台刷新检查</b>（每 ${REMOTE_MIN_MS/1000}–${REMOTE_MAX_MS/1000}s 随机）：用 <code>fetch</code> 拉取最新 HTML（附带时间戳参数绕缓存）。</li>
            <li><b>真实刷新页面</b>（每 ${RELOAD_MIN_MS/1000}–${RELOAD_MAX_MS/1000}s 随机）：调用 <code>location.reload()</code> 做兜底刷新。</li>
          </ul>

          <div style="margin-top:6px;"><b>按钮说明：</b></div>
          <ul>
            <li><b>启用声音(一次)</b>：点一次“滴”声解锁音频（浏览器限制）。若你的浏览器/站点已允许自动播放，脚本也会尝试自动启用。</li>
            <li><b>测试警报</b>：随时可点，验证遮罩/通知/声音；<b>不会暂停监控</b>。</li>
            <li><b>恢复监控</b>：真正警报触发后会暂停监控（避免刷屏），点它继续。</li>
          </ul>
        </div>
      </details>

      <div id="tm-footer">
        <span>Author: Tian Jialin</span>
        <span id="tm-ver">v4.4</span>
      </div>
    `;
    document.body.appendChild(p);

    p.querySelector('#tm-unlock').addEventListener('click', unlockAudioOnce);
    p.querySelector('#tm-test').addEventListener('click', () => triggerAlarm({ note: '（手动测试）', isTest: true }));
    p.querySelector('#tm-resume').addEventListener('click', resumeMonitoring);

    setText('#tm-run', '运行中');
    setText('#tm-note', '提示：测试警报不影响监控；真正触发后会暂停监控，点“恢复监控”继续。');
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
      setText('#tm-run', monitoringEnabled ? (realAlarmTriggered ? '已触发（暂停）' : '运行中') : '已暂停');
    }, UI_TICK_MS);
  }

  // ---------- Audio ----------
  let audioUnlocked = false;
  let audioCtx = null, osc = null, gain = null, sirenTimer = null;

  // ✅ 改法2：页面加载时自动尝试启用音频（仅在站点允许自动播放时会成功）
  async function tryAutoUnlockAudioOnLoad() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      await audioCtx.resume();
      if (audioCtx.state === 'running') {
        audioUnlocked = true;
        setText('#tm-note', '🔊 已自动启用声音（站点允许自动播放）。');
      }
    } catch (e) {
      // 被浏览器拦截是正常情况，不提示弹窗，避免烦
    }
  }

  async function unlockAudioOnce() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      await audioCtx.resume();

      // “滴”一声确认
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      g.gain.value = 0.08;
      o.type = 'sine'; o.frequency.value = 880;
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); setTimeout(() => { try { o.stop(); } catch(e){} }, 120);

      audioUnlocked = true;
      setText('#tm-note', '✅ 声音已启用：刷新页面后可能需要重新启用（取决于浏览器设置）。');
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
    } catch (e) {}
  }

  // ---------- Overlay ----------
  function showOverlay({ note, isTest }) {
    document.getElementById('tm-alarm-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'tm-alarm-overlay';
    overlay.innerHTML = `
      <div id="tm-alarm-box">
        <p id="tm-alarm-title">🚨 警报触发 ${note || ''}</p>
        <p id="tm-alarm-desc">
          ${isTest ? '这是测试警报，不会暂停监控。' : '未检测到关闭提示，已暂停监控避免错过。'}<br>
          ${audioUnlocked ? '正在持续鸣叫。' : '声音可能被浏览器拦截（可点“启用声音(一次)”或在站点设置允许自动播放）。'}
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

  // ---------- 检测逻辑 ----------
  function hasClosedInDom() {
    const text = document.body?.innerText || document.body?.textContent || '';
    return CLOSED_RE.test(text);
  }

  // ✅ fetch 加时间戳参数，尽量绕缓存，拿到更新内容
  async function fetchClosedFound() {
    const u = new URL(location.href);
    u.searchParams.set('__tm', Date.now().toString());
    const resp = await fetch(u.toString(), { cache: 'no-store', credentials: 'include' });
    const html = await resp.text();
    return CLOSED_RE.test(html);
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

  // ✅ 改法2：随机真实刷新页面
  function scheduleNextPageReload() {
    if (!ENABLE_PAGE_RELOAD) { nextReloadAt = 0; return; }
    if (reloadTimer) clearTimeout(reloadTimer);

    const ms = randInt(RELOAD_MIN_MS, RELOAD_MAX_MS);
    const now = Date.now();
    nextReloadAt = now + ms;

    reloadTimer = setTimeout(() => {
      // 只有监控启用、且没触发真实警报时才刷新
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

    scheduleNextDomCheck();
    scheduleNextRemoteCheck();
    scheduleNextPageReload();

    // 提示文案
    setText('#tm-note', audioUnlocked
      ? '✅ 已恢复监控（声音可用）。'
      : '已恢复监控。想要警报声请点一次“启用声音(一次)”，或在站点设置允许自动播放。');
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
        text: isTest ? '测试警报' : '未检测到关闭提示（可能已开放）！',
        timeout: 0
      });
    } catch (e) {}

    showOverlay({ note, isTest });

    // 警报声（如果可用）
    startSiren();
  }

  async function remoteTick() {
    if (!monitoringEnabled) return;
    try {
      const closedFound = await fetchClosedFound();
      if (!closedFound) triggerAlarm({ note: '（后台刷新检查）', isTest: false });
      else scheduleNextRemoteCheck();
    } catch (e) {
      triggerAlarm({ note: '（后台抓取失败）', isTest: false });
    }
  }

  function domTick() {
    if (!monitoringEnabled) return;
    if (!hasClosedInDom()) triggerAlarm({ note: '（页面内检测）', isTest: false });
    else scheduleNextDomCheck();
  }

  // ---------- start ----------
  console.log('[TM] script loaded:', location.href);

  ensurePanel();
  startUiCountdown();

  // ✅ 改法2：每次加载尝试自动启用声音（仅在浏览器允许自动播放时会成功）
  tryAutoUnlockAudioOnLoad();

  // 先立即跑一次
  if (!hasClosedInDom()) {
    triggerAlarm({ note: '（启动即检测）', isTest: false });
  } else {
    resumeMonitoring();
  }
})();
