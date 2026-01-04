// ==UserScript==
// @name         SOOP 광고 스킵, 스크린모드
// @version      2025-09-30
// @description  SOOP (화면모드/광고스킵)
// @match        https://play.sooplive.co.kr/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @namespace https://haein.dev/soop-userscripts/soop-skip
// @downloadURL https://update.greasyfork.org/scripts/550598/SOOP%20%EA%B4%91%EA%B3%A0%20%EC%8A%A4%ED%82%B5%2C%20%EC%8A%A4%ED%81%AC%EB%A6%B0%EB%AA%A8%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/550598/SOOP%20%EA%B4%91%EA%B3%A0%20%EC%8A%A4%ED%82%B5%2C%20%EC%8A%A4%ED%81%AC%EB%A6%B0%EB%AA%A8%EB%93%9C.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*****************************************************************************
   * 설정
   *****************************************************************************/
  const LOG_PREFIX = '[SOOP-HELPER]';
  const POLL_MS = 800;          // 광고 스킵 폴링 간격
  const REHOOK_MS = 400;        // URL 변경 시 재시도 간격
  const REHOOK_WINDOW_MS = 15000; // URL 변경 시 재시도 총시간

  /*****************************************************************************
   * 내부 상태
   *****************************************************************************/
  let skipTimer = null;       // 광고 스킵 타이머(중복 방지)
  let lastHref = location.href;

  const mark = (el, key) => {
    const k = `__sg_${key}`;
    if (el[k]) return true;
    el[k] = true;
    return false;
  };

  const log = (...args) => console.debug(LOG_PREFIX, ...args);

  /*****************************************************************************
   * SPA 라우팅 감지 (pushState/replaceState/popstate)
   *****************************************************************************/
  (function patchHistoryForSpa() {
    const poke = () => {
      if (lastHref === location.href) return;
      lastHref = location.href;
      log('URL changed → rehook signal');
      window.dispatchEvent(new Event('soop-urlchange'));
    };
    ['pushState', 'replaceState'].forEach((k) => {
      const orig = history[k];
      history[k] = function (...args) {
        const ret = orig.apply(this, args);
        // 미세 지연 후 URL 비교
        setTimeout(poke, 0);
        return ret;
      };
    });
    addEventListener('popstate', poke);
  })();

  /*****************************************************************************
   * 기능 1) 화면 모드/플레이 훅 (예시)
   * - 비디오가 붙으면 "화면모드" 버튼을 찾아 한 번만 훅을 건다.
   * - 정책/사이트 변화에 맞춰 버튼 셀렉터를 추가해가면 됨.
   *****************************************************************************/
  function armScreenModeOnPlay() {
    const video = document.querySelector('video');
    if (!video) return false;

    // 화면 모드 토글로 추정되는 버튼들 후보
    const btn =
      document.querySelector('.btn_screen_mode') ||
      document.querySelector('button[aria-label*="화면"]') ||
      document.querySelector('button[aria-label*="screen"]') ||
      document.querySelector('[data-btn="screen-mode"]');

    if (!btn) return false;

    // 비디오/버튼에 중복 훅 방지 마킹
    if (mark(video, 'screen_play_hook')) return true;
    log('armScreenModeOnPlay: hook attached');

    // 재생 시작 시점에 1회 토글 (원치 않으면 아래 클릭 로직은 지워도 됨)
    const onPlay = () => {
      try {
        // 버튼 상태가 이미 원하는 모드면 클릭 불필요.
        // 사이트에 따라 aria-pressed 등 상태값을 확인해도 됨.
        // 여기서는 "1회만" 토글 예시
        if (!mark(btn, 'screen_toggled_once')) {
          btn.click();
          log('screen-mode toggled once on play');
        }
      } catch (e) {
        console.warn(LOG_PREFIX, 'screen-mode toggle error', e);
      }
    };
    video.addEventListener('play', onPlay, { once: true });
    return true;
  }

  /*****************************************************************************
   * 기능 2) 광고 스킵 (예시)
   * - 사이트의 스킵 버튼 셀렉터를 상황에 맞게 보강
   *****************************************************************************/
  function tickSkip() {
    try {
      const skipBtn =
        document.querySelector('#da_btn_skip') ||
        document.querySelector('.btn-skip-ad') ||
        document.querySelector('[data-role="ad-skip"]') ||
        document.querySelector('button[aria-label*="건너뛰기"]');

      if (skipBtn && isClickable(skipBtn)) {
        skipBtn.click();
        log('ad skipped');
      }
    } catch (e) {
      console.warn(LOG_PREFIX, 'tickSkip error', e);
    }
  }

  function isClickable(el) {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.pointerEvents !== 'none' &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  /*****************************************************************************
   * 기능 3) 클립보드 허용 (예시)
   * - write_area 등에서 cut/copy/paste를 막는 경우 대비
   *****************************************************************************/
  function enableClipboard() {
    const targets = [
      document.querySelector('#write_area'),
      document.querySelector('[contenteditable="true"]'),
      document.querySelector('textarea'),
      document.querySelector('input[type="text"]'),
    ].filter(Boolean);

    if (!targets.length) return false;

    for (const el of targets) {
      if (mark(el, 'clipboard_unlocked')) continue;
      ['cut', 'copy', 'paste'].forEach((type) =>
        el.addEventListener(
          type,
          (e) => {
            e.stopPropagation();
          },
          true
        )
      );
    }
    log('clipboard enabled on', targets.length, 'elements');
    return true;
  }

  /*****************************************************************************
   * 재장착(훅) 런처
   * - URL이 바뀔 때마다 짧게만 재시도하고 종료 (상시 감시 X → 가벼움)
   *****************************************************************************/
  function rehookShortBurst() {
    // 화면모드/플레이 훅: 400ms 간격 재시도, 최대 15초
    let t1 = setInterval(() => {
      if (armScreenModeOnPlay()) clearInterval(t1);
    }, REHOOK_MS);
    setTimeout(() => clearInterval(t1), REHOOK_WINDOW_MS);

    // 클립보드 허용도 같은 윈도우로 재시도
    let t2 = setInterval(() => {
      if (enableClipboard()) clearInterval(t2);
    }, REHOOK_MS);
    setTimeout(() => clearInterval(t2), REHOOK_WINDOW_MS);

    // 광고 스킵 폴링(이미 돌고 있으면 재개하지 않음)
    if (!skipTimer) {
      skipTimer = setInterval(tickSkip, POLL_MS);
      tickSkip();
      log('ad-skip polling started');
    }
  }

  /*****************************************************************************
   * 부트스트랩
   *****************************************************************************/
  function bootstrap() {
    // 초기 장착(첫 로드)
    rehookShortBurst();
  }

  // 문서 상태에 따라 즉시 or DOMContentLoaded 후 부트스트랩
  if (document.readyState === 'loading') {
    addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  // SPA 라우팅 신호 → 재장착
  addEventListener('soop-urlchange', rehookShortBurst);

  // 탭 포커스 복귀 시도(선택): 백그라운드 전환 후 요소가 늦게 붙는 경우 보조
  addEventListener('visibilitychange', () => {
    if (!document.hidden) rehookShortBurst();
  });
})();
