// ==UserScript==
// @name         SOOP: show stream delay in 채팅창
// @version      2025-12-27
// @description  "x.x초 딜레이 중" 표시 + 자동 보정(뒤로가기 없음, PI 제어)
// @namespace    melderland-chat-delay
// @match        https://play.sooplive.co.kr/*
// @grant        none
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/550785/SOOP%3A%20show%20stream%20delay%20in%20%EC%B1%84%ED%8C%85%EC%B0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/550785/SOOP%3A%20show%20stream%20delay%20in%20%EC%B1%84%ED%8C%85%EC%B0%BD.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ===== 설정 =====
  const C = {
    // 표시/샘플
    avgWindowMs: 1500,
    decimals: 1,
    noDataText: '딜레이 계산 중…',

    // 루프 주기
    tickMs: 200,
    tickHiddenMs: 1000,

    // 목표
    defaultTargetMs: 1000,

    // 속도 제한 (뒤로가기/일시정지 없이 부드럽게)
    minRate: 0.97,   // ← 살짝만 느리게 허용(버퍼 회복용)
    maxRate: 1.05,   // ← 살짝만 빠르게 허용(지연 줄이기용)
    rateQuantum: 0.01,
    rateChangeMinMs: 250,

    // PI 제어기
    Kp_per_s: 0.20,      // 비례 게인
    Ki_per_s2: 0.10,     // 적분 게인 (초당 적분)
    I_limit: 0.05,       // 적분 항 한계(±5%p)
  };

  const STORE = { enabled: 'soop_chat_delay_enabled', target: 'soop_chat_delay_target_ms' };

  // ===== 상태 =====
  let enabled = loadEnabled();
  let targetMs = loadTarget();
  let video = null;
  let currentRate = 1.0;
  let lastRateSetAt = 0;
  let lastTickAt = performance.now();
  let I = 0; // 적분 항

  const samples = []; // {t, v(sec)}
  const now = () => performance.now();

  // ----- 유틸 -----
  const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
  function quantizeRate(r) { const q = C.rateQuantum; return Math.round(r / q) * q; }

  function findVideo() { return document.querySelector('video'); }

  function bufferAheadSec(v) {
    if (!v) return null;
    try {
      const b = v.buffered;
      if (!b || b.length === 0) return null;
      const end = b.end(b.length - 1);
      const cur = v.currentTime;
      const d = end - cur;
      return isFinite(d) ? Math.max(0, d) : null;
    } catch { return null; }
  }

  function pushSample(sec) {
    const t = now();
    samples.push({ t, v: sec });
    const cutoff = t - C.avgWindowMs;
    while (samples.length && samples[0].t < cutoff) samples.shift();
  }
  function avgSec() {
    if (!samples.length) return null;
    let s = 0; for (let i = 0; i < samples.length; i++) s += samples[i].v;
    return s / samples.length;
  }

  // ----- 채팅창 표시 -----
  let lastText = '';
  function findPlaceholder() {
    return document.querySelector('span#empty_chat.empty_chat')
        || document.querySelector('#empty_chat')
        || document.querySelector('span.empty_chat');
  }
  function setPlaceholder(txt, tip) {
    const node = findPlaceholder();
    if (!node) return;
    if (txt !== lastText) { node.textContent = txt; lastText = txt; }
    if (tip) node.title = tip;
  }
  const fmt = (s) => `${s.toFixed(C.decimals)}초 딜레이 중`;
  const tip = () => [
    `자동 보정: ${enabled ? '켜짐' : '꺼짐'}`,
    `목표: ${targetMs}ms`,
    '모드: 뒤로가기 없음 / 미세 속도 조절(0.98×–1.03×)'
  ].join('\n');

  // 클릭 제스처(Alt=토글, Shift=목표 변경)
  document.addEventListener('click', (e) => {
    const node = findPlaceholder();
    if (!node || !node.contains(e.target)) return;
    if (e.altKey) {
      enabled = !enabled; saveEnabled(enabled);
      if (!enabled) setRate(1.0, true), I = 0;
      setPlaceholder(lastText || '', tip());
    } else if (e.shiftKey) {
      const v = prompt('목표 딜레이(ms)를 입력하세요 (200–8000):', String(targetMs));
      if (v == null) return;
      const n = parseInt(v.replace(/[^\d]/g,''), 10);
      if (isFinite(n) && n >= 200 && n <= 8000) {
        targetMs = n; saveTarget(n); I = 0;
        setPlaceholder(lastText || '', tip());
      } else alert('200–8000 사이 숫자를 입력해주세요.');
    }
  }, true);

  // ----- 속도 제어(PI) -----
  function setRate(r, force=false) {
    if (!video) return;
    const t = now();
    if (!force && t - lastRateSetAt < C.rateChangeMinMs) return;
    r = clamp(quantizeRate(r), C.minRate, C.maxRate);
    if (Math.abs((video.playbackRate||1)-r) < 1e-6) return;
    try { video.playbackRate = r; } catch {}
    currentRate = r; lastRateSetAt = t;
  }

  function controller(avgMs, dtMs) {
    const err_s = (avgMs - targetMs) / 1000;     // 양수=버퍼 많음 → 조금 빠르게
    // PI: r = 1 + Kp*e + I
    const Kp = C.Kp_per_s;
    const Ki = C.Ki_per_s2;
    const dt = Math.max(0.001, dtMs / 1000);

    // 적분(안티 윈드업)
    I += clamp(err_s, -1, 1) * Ki * dt;
    I = clamp(I, -C.I_limit, C.I_limit);

    const r = 1 + Kp * err_s + I;
    return clamp(quantizeRate(r), C.minRate, C.maxRate);
  }

  // ----- 루프 -----
  function tick() {
    if (!video) video = findVideo();

    const buf = bufferAheadSec(video);
    if (buf != null) pushSample(buf);
    const avg = avgSec();

    // 표시
    if (avg != null) setPlaceholder(fmt(avg), tip());
    else setPlaceholder(C.noDataText, tip());

    // 제어
    const nowT = now();
    const dt = nowT - lastTickAt; lastTickAt = nowT;

    if (enabled && avg != null) {
      const nextRate = controller(avg * 1000, dt);
      setRate(nextRate);
    } else {
      setRate(1.0);
    }

    setTimeout(tick, document.visibilityState === 'hidden' ? C.tickHiddenMs : C.tickMs);
  }

  function init() {
    lastTickAt = now();
    tick();
    // SPA 라우팅 시 재시작
    const onUrl = () => { video = null; I = 0; setRate(1.0, true); };
    const p = history.pushState, r = history.replaceState;
    history.pushState = function(...a){ const ret = p.apply(this, a); onUrl(); return ret; };
    history.replaceState = function(...a){ const ret = r.apply(this, a); onUrl(); return ret; };
    addEventListener('popstate', onUrl);
    addEventListener('beforeunload', () => setRate(1.0, true));
  }

  // 저장/로드
  function loadEnabled(){ try { return (localStorage.getItem(STORE.enabled) ?? '1') === '1'; } catch { return true; } }
  function saveEnabled(v){ try { localStorage.setItem(STORE.enabled, v ? '1' : '0'); } catch {} }
  function loadTarget(){
    try { const v = parseInt(localStorage.getItem(STORE.target)||'',10); if (isFinite(v) && v>=200 && v<=8000) return v; } catch {}
    return C.defaultTargetMs;
  }
  function saveTarget(v){ try { localStorage.setItem(STORE.target, String(v)); } catch {} }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
