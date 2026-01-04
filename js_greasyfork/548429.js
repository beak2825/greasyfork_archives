// ==UserScript==
// @name         자동 업 (10–15s once)
// @namespace    https://umu1ne.scripts/soop-auto-up
// @version      0.1.0
// @description  Soop 라이브 입장 후 10~15초 뒤에 'UP' 버튼을 한 번만 눌러줍니다. (방송별 1회, SPA 전환 대응)
// @author       you
// @match        https://play.sooplive.co.kr/*/*
// @match        https://play.sooplive.co.kr/*/*/*
// @run-at       document-idle
// @license      All Rights Reserved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548429/%EC%9E%90%EB%8F%99%20%EC%97%85%20%2810%E2%80%9315s%20once%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548429/%EC%9E%90%EB%8F%99%20%EC%97%85%20%2810%E2%80%9315s%20once%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- 설정 (원하면 여기 숫자만 바꿔도 됨) ----
  const MIN_DELAY_MS = 10_000; // 최소 10초
  const MAX_DELAY_MS = 15_000; // 최대 15초
  const STORAGE_KEY_PREFIX = 'soop-auto-up:clicked:';
  const DEBUG = false; // true로 바꾸면 콘솔 로그가 조금 나옵니다.

  // ---- 유틸 ----
  const log = (...args) => DEBUG && console.log('[SoopAutoUP]', ...args);

  // Soop 플레이 페이지의 방송 ID를 URL에서 추출 (마지막 숫자 세그먼트 기준)
  function getBroadcastId(url = location.href) {
    try {
      const path = new URL(url).pathname.split('/').filter(Boolean);
      // 보통 username / 287253000 형태라 마지막 숫자 세그먼트를 사용
      for (let i = path.length - 1; i >= 0; i--) {
        if (/^\d+$/.test(path[i])) return path[i];
      }
    } catch (e) {}
    return null;
  }

  function isPlayHost(url = location.href) {
    try {
      const u = new URL(url);
      return u.host === 'play.sooplive.co.kr';
    } catch (e) { return false; }
  }

  // 방송별 1회 클릭 여부 저장/확인 (세션 단위)
  function isAlreadyClicked(broadcastId) {
    if (!broadcastId) return false;
    return sessionStorage.getItem(STORAGE_KEY_PREFIX + broadcastId) === '1';
  }
  function markClicked(broadcastId) {
    if (!broadcastId) return;
    sessionStorage.setItem(STORAGE_KEY_PREFIX + broadcastId, '1');
  }

  // 버튼 탐색: 동적 렌더링 대비해서 MutationObserver + 즉시 탐색 병행
  function waitForUpButton({ timeoutMs = 60_000 } = {}) {
    return new Promise((resolve, reject) => {
      const selectorList = [
        'button#like.like[tip="UP"]',
        'button.like[tip="UP"]#like',
        'button.like[tip="UP"]',
        '#like.like[tip="UP"]'
      ];

      function find() {
        for (const sel of selectorList) {
          const el = document.querySelector(sel);
          if (el) return el;
        }
        return null;
      }

      const immediate = find();
      if (immediate) {
        log('UP button found immediately');
        resolve(immediate);
        return;
      }

      const obs = new MutationObserver(() => {
        const btn = find();
        if (btn) {
          log('UP button found via observer');
          obs.disconnect();
          resolve(btn);
        }
      });

      obs.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
      });

      if (timeoutMs > 0) {
        setTimeout(() => {
          try { obs.disconnect(); } catch {}
          const btn = find();
          if (btn) {
            resolve(btn);
          } else {
            reject(new Error('UP button not found within timeout'));
          }
        }, timeoutMs);
      }
    });
  }

  // 이미 눌린 상태인지 대략 판별 (사이트별 클래스/속성 변화에 대비해 넉넉히 체크)
  function isButtonAlreadyActive(btn) {
    if (!btn) return false;
    const pressed = btn.getAttribute('aria-pressed');
    if (pressed === 'true') return true;
    const cls = btn.className || '';
    if (/\b(on|active|selected)\b/i.test(cls)) return true;
    // span 숫자가 0보다 큰지는 큰 의미가 없으므로 생략
    return false;
  }

  function randomDelay(minMs, maxMs) {
    const span = Math.max(0, maxMs - minMs);
    return minMs + Math.floor(Math.random() * (span + 1));
  }

  // 실제 클릭 수행
  async function scheduleOneClickForCurrentPage() {
    if (!isPlayHost()) return; // 다른 호스트에서는 동작 안 함

    const broadcastId = getBroadcastId();
    if (!broadcastId) {
      log('No broadcastId; skip.');
      return;
    }

    if (isAlreadyClicked(broadcastId)) {
      log('Already clicked for this broadcast:', broadcastId);
      return;
    }

    let btn;
    try {
      btn = await waitForUpButton({ timeoutMs: 60_000 });
    } catch (e) {
      log('UP button not found in time:', e?.message || e);
      return;
    }

    if (!btn || !(btn instanceof HTMLElement)) {
      log('Button ref invalid; abort.');
      return;
    }

    // 버튼이 이미 활성화되어 있으면 클릭 생략하고 완료 처리
    if (isButtonAlreadyActive(btn)) {
      log('Button already active; mark clicked without action.');
      markClicked(broadcastId);
      return;
    }

    const delay = randomDelay(MIN_DELAY_MS, MAX_DELAY_MS);
    log(`Scheduled click in ${Math.round(delay / 1000)}s for broadcast ${broadcastId}`);
    setTimeout(() => {
      try {
        // 클릭 직전 다시 한 번 확인
        if (isAlreadyClicked(broadcastId)) {
          log('Skip click (already flagged just before click).');
          return;
        }
        // 버튼이 다시 렌더링됐을 수 있으니 최신 엘리먼트로 재확인
        const latestBtn =
          document.querySelector('button#like.like[tip="UP"]') ||
          document.querySelector('button.like[tip="UP"]#like') ||
          document.querySelector('button.like[tip="UP"]') ||
          document.querySelector('#like.like[tip="UP"]') ||
          btn;

        if (!latestBtn) {
          log('Button missing at click time; abort.');
          return;
        }

        if (isButtonAlreadyActive(latestBtn)) {
          log('At click time: already active. Mark and stop.');
          markClicked(broadcastId);
          return;
        }

        latestBtn.click();
        log('Clicked UP button once!');
        markClicked(broadcastId);
      } catch (err) {
        log('Click error:', err);
      }
    }, delay);
  }

  // SPA 라우팅 대응: pushState/replaceState/뒤로가기에서 재실행
  function hookRouteChangesOnce() {
    if (window.__SOOP_AUTO_UP_ROUTED__) return;
    window.__SOOP_AUTO_UP_ROUTED__ = true;

    const fire = () => {
      log('Route change detected:', location.href);
      scheduleOneClickForCurrentPage();
    };

    const wrap = (type) => {
      const orig = history[type];
      if (typeof orig !== 'function') return;
      history[type] = function () {
        const ret = orig.apply(this, arguments);
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      };
    };

    wrap('pushState');
    wrap('replaceState');

    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('locationchange'));
    });
    window.addEventListener('locationchange', fire);

    // 최초 진입 시 한 번
    fire();
  }

  // 중복 초기화 방지
  if (!window.__SOOP_AUTO_UP_INIT__) {
    window.__SOOP_AUTO_UP_INIT__ = true;
    hookRouteChangesOnce();
  }
})();
