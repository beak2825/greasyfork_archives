// ==UserScript==
// @name         퀘스트 보상 수락
// @namespace    퀘스트 보상 수락용
// @version      1.0.0
// @description  '보상받기'를 4→3→2→1 역순으로 누르고, 모달의 '확인'(span 상위 button)까지 자동 클릭합니다.
// @author       You
// @match        https://profile.onstove.com/ko/*?quest=open*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onstove.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/551311/%ED%80%98%EC%8A%A4%ED%8A%B8%20%EB%B3%B4%EC%83%81%20%EC%88%98%EB%9D%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/551311/%ED%80%98%EC%8A%A4%ED%8A%B8%20%EB%B3%B4%EC%83%81%20%EC%88%98%EB%9D%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const $ = jQuery;
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // span 텍스트를 가진 가장 가까운 상위 button 하나 반환
  function findButtonBySpanTextOnce(text) {
    const span = Array.from(document.querySelectorAll('span'))
      .find(el => el.textContent.trim() === text);
    return span ? span.closest('button') : null;
  }

  // 해당 텍스트(span 상위 button)가 나타날 때까지 기다렸다가 반환
  async function waitForButtonBySpanText(text, timeoutMs = 7000, pollMs = 120) {
    const t0 = Date.now();
    let btn = findButtonBySpanTextOnce(text);
    if (btn) return btn;

    let resolveFn;
    const p = new Promise(res => (resolveFn = res));
    const observer = new MutationObserver(() => {
      const b = findButtonBySpanTextOnce(text);
      if (b) {
        observer.disconnect();
        resolveFn(b);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    while (!btn && Date.now() - t0 < timeoutMs) {
      await sleep(pollMs);
      btn = findButtonBySpanTextOnce(text);
      if (btn) {
        observer.disconnect();
        return btn;
      }
    }
    observer.disconnect();
    return null;
  }

  // 버튼 비활성 여부 추정(속성/클래스 모두 체크)
  function isDisabledButton(btn) {
    if (!btn) return true;
    if (btn.disabled) return true;
    if (btn.getAttribute('disabled') !== null) return true;
    const cls = btn.className || '';
    return /\bdisabled\b|stds-button-disabled|is-disabled/i.test(cls);
  }

  // '보상받기' span을 가진 상위 button들을 모두 수집하고,
  // 화면의 세로 위치(top) 기준으로 내림차순(=아래→위, 4→3→2→1) 정렬
  function collectRewardButtonsBottomToTop(limit = Infinity) {
    const spans = Array.from(document.querySelectorAll('span'))
      .filter(el => el.textContent.trim() === '보상받기');

    const btns = [];
    for (const s of spans) {
      const b = s.closest('button');
      if (b && !btns.includes(b)) btns.push(b);
    }
    // 아래쪽(큰 top) → 위쪽(작은 top)
    btns.sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top);

    if (Number.isFinite(limit)) return btns.slice(0, limit);
    return btns;
  }

  // 순차 처리: (아래→위) 보상받기 → '확인' → 다음 …
  async function runSequentialReverse() {
    await sleep(1500); // 초기 안정화

    // 처음에 보이는 보상 버튼들을 수집(아래부터)
    let rewardButtons = collectRewardButtonsBottomToTop(); // 전부 대상
    console.log('[퀘스트 보상 수락] 수집된 보상받기 버튼 개수(아래→위):', rewardButtons.length);

    for (let i = 0; i < rewardButtons.length; i++) {
      // DOM이 바뀌었을 수 있으니, 매 회전마다 다시 가장 아래→위로 재수집해도 좋음
      // (아래 한 줄의 주석을 해제하면 매 루프마다 재수집)
      // rewardButtons = collectRewardButtonsBottomToTop();

      const btn = rewardButtons[i];
      if (!btn?.isConnected) {
        console.warn(`[퀘스트 보상 수락] 버튼 ${i + 1}가 DOM에 없음, 건너뜀`);
        continue;
      }

      // 혹시 비활성이라면 잠시 대기 후 재확인(최대 3회)
      let tries = 3;
      while (isDisabledButton(btn) && tries-- > 0) {
        console.log(`[퀘스트 보상 수락] 버튼 ${i + 1} 비활성 → 대기 후 재확인`);
        await sleep(500);
      }
      if (isDisabledButton(btn)) {
        console.warn(`[퀘스트 보상 수락] 버튼 ${i + 1} 여전히 비활성 → 건너뜀`);
        continue;
      }

      console.log(`[퀘스트 보상 수락] (아래→위) 보상받기 ${i + 1} 클릭`);
      btn.click();

      // 모달 애니메이션 대기
      await sleep(1000);

      // '확인' span 상위 button 기다렸다가 클릭
      const okBtn = await waitForButtonBySpanText('확인', 7000, 120);
      if (okBtn) {
        console.log(`[퀘스트 보상 수락] '확인' 버튼 클릭 (보상 ${i + 1})`);
        okBtn.click();
      } else {
        console.warn('[퀘스트 보상 수락] 확인 버튼을 찾지 못했습니다(타임아웃).');
      }

      // 다음 항목 처리 전 짧은 텀
      await sleep(500);
    }

    console.log('[퀘스트 보상 수락] 역순 처리 완료');
  }

  window.addEventListener('load', () => {
    setTimeout(runSequentialReverse, 3500);
  });
})();