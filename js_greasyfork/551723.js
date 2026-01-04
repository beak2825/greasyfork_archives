// ==UserScript==
// @name         키오스크 광고차단팝업 제거
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  광고차단 감지 팝업만 정확히 제거합니다
// @match        https://kio.ac/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kio.ac
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551723/%ED%82%A4%EC%98%A4%EC%8A%A4%ED%81%AC%20%EA%B4%91%EA%B3%A0%EC%B0%A8%EB%8B%A8%ED%8C%9D%EC%97%85%20%EC%A0%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/551723/%ED%82%A4%EC%98%A4%EC%8A%A4%ED%81%AC%20%EA%B4%91%EA%B3%A0%EC%B0%A8%EB%8B%A8%ED%8C%9D%EC%97%85%20%EC%A0%9C%EA%B1%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function handleDialog(dialog) {
    if (!dialog) return;
    if (dialog._handled) return;

    const title = dialog.querySelector('[data-slot="dialog-title"]');
    if (!title || !title.innerText.includes('애드블록 감지됨')) return;

    // 버튼 강제 활성화 후 클릭
    const okBtn = [...dialog.querySelectorAll('button')]
      .find(b => (b.innerText || '').includes('확인'));
    if (okBtn) {
      okBtn.disabled = false;
      okBtn.removeAttribute('disabled');
      okBtn.click();
      console.log('애드블록 팝업 우회 처리');
    }

    // 팝업만 제거
    dialog.remove();

    // 오버레이는 그대로 두되 클릭 막힘 해제
    const overlay = dialog.previousElementSibling;
    if (overlay && overlay.style) {
      overlay.style.pointerEvents = 'none';
      overlay.style.opacity = '0';
    }

    dialog._handled = true;
  }

  function scan() {
    document.querySelectorAll('[role="dialog"][aria-modal="true"]').forEach(handleDialog);
  }

  // 최초 실행 + DOM 변화를 감시
  scan();
  const mo = new MutationObserver(scan);
  mo.observe(document.body, { childList: true, subtree: true });
})();
