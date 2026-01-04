// ==UserScript==
// @name         치지직 타임라인 복사
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  W 키로 왼쪽 상단 "스트리밍 중" 라벨의 HH:MM:SS를 복사
// @match        https://chzzk.naver.com/live/*
// @icon         https://i.imgur.com/vDb6wAm.png
// @grant        GM_setClipboard
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551784/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%83%80%EC%9E%84%EB%9D%BC%EC%9D%B8%20%EB%B3%B5%EC%82%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/551784/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%83%80%EC%9E%84%EB%9D%BC%EC%9D%B8%20%EB%B3%B5%EC%82%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const HOUR_TIME = /\b(\d{1,2}:\d{2}:\d{2})\b/;   // H:MM:SS 또는 HH:MM:SS
  const LABEL_HINT = /(스트리밍\s*중|LIVE|라이브|생방송|방송\s*중)/i;

  const pad2 = n => String(n).padStart(2, '0');
  const secToHMS = (sec) => {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  };

  function toast(msg) {
    let el = document.getElementById('chzzk-elapsed-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'chzzk-elapsed-toast';
      el.style.cssText = `
        position: fixed; left: 50%; bottom: 64px; transform: translateX(-50%);
        background: rgba(0,0,0,0.78); color: #fff; padding: 10px 14px;
        border-radius: 8px; font-size: 14px; z-index: 999999; pointer-events: none;
      `;
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    setTimeout(() => {
      el.style.transition = 'opacity .35s';
      el.style.opacity = '0';
      setTimeout(() => { el.style.transition = ''; }, 400);
    }, 900);
  }

  // 왼쪽 상단 라벨을 탐색해서 H:MM:SS 추출
  function getElapsedFromTopLeftLabel() {
    const candidates = [];
    const all = document.querySelectorAll('body *');
    const vw = window.innerWidth, vh = window.innerHeight;

    for (const el of all) {
      // 표시중인 엘리먼트만
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;

      const txt = (el.innerText || '').replace(/\s+/g, ' ').trim();
      if (!txt) continue;
      if (!LABEL_HINT.test(txt)) continue;     // "스트리밍 중" 등 힌트 단어 필요
      const m = txt.match(HOUR_TIME);
      if (!m) continue;                         // 반드시 H:MM:SS 포함

      // 화면 왼쪽·상단 쪽에 있는 후보에 가중치
      const r = el.getBoundingClientRect();
      const score =
        (r.top / vh) * 0.7 +          // 위쪽일수록 유리
        (r.left / vw) * 0.3 +         // 왼쪽일수록 유리
        (el.childElementCount ? 0.02 : 0); // 복잡한 노드에 아주 소량 페널티

      candidates.push({ el, text: txt, time: m[1], score });
    }

    if (!candidates.length) return null;

    candidates.sort((a, b) => a.score - b.score); // 가장 왼쪽-상단에 가까운 것
    const chosen = candidates[0].time;            // "6:03:37" 같은 문자열

    // 문자열을 초로
    const [h, m, s] = chosen.split(':').map(v => parseInt(v, 10));
    return h * 3600 + m * 60 + s;
  }

  // 최후 폴백 (내 시청시간)
  function getFallbackFromCurrentTime() {
    const v = document.querySelector('video');
    if (v && isFinite(v.currentTime)) return Math.floor(v.currentTime);
    return null;
  }

  async function copyElapsed() {
    let sec = getElapsedFromTopLeftLabel();
    if (sec == null) sec = getFallbackFromCurrentTime();

    if (sec == null) {
      toast('⛔ 방송 시간을 찾지 못했어요.');
      return;
    }

    const formatted = secToHMS(sec);
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(formatted);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(formatted);
      } else {
        const input = document.createElement('input');
        input.value = formatted;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      toast(`✅ 복사됨: ${formatted}`);
      console.log('[Chzzk] Copied:', formatted);
    } catch (e) {
      console.error(e);
      toast('⚠️ 클립보드 복사 실패');
    }
  }

  // 입력창 포커스 시에는 미작동
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'w') {
      const ae = document.activeElement;
      const typing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
      if (!typing) copyElapsed();
    }
  });

  // SPA 라우팅/레이아웃 변화 대비 (별도 캐시 없음, 매번 스캔)
})();
