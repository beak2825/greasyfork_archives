// ==UserScript==
// @name         Chzzk Chat Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  채팅창에 랭킹 등 불필요한 영역 제거
// @author       Nezit
// @match        https://chzzk.naver.com/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554233/Chzzk%20Chat%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/554233/Chzzk%20Chat%20Cleaner.meta.js
// ==/UserScript==
(function () {
  console.log('치지직 채팅 클리너');

  // 제거 기준에 맞으면 해당 노드를 즉시 삭제
  function removeIfUnwanted(el) {
    if (!el || el.nodeType !== 1 || !el.classList) return false;

    for (const cls of el.classList) {
      if (
        cls.startsWith('live_chatting_ranking_container__')
      ) {
        el.remove();
        return true;
      }
    }
    return false;
  }

  // 루트부터 하위까지 한번에 정리
  function sweep(root) {
    if (!root || root.nodeType !== 1) return;

    // 루트 자체가 대상일 수 있으니 먼저 검사
    if (root.hasAttribute && root.hasAttribute('class')) {
      if (removeIfUnwanted(root)) return; // 지워졌으면 하위 탐색 불필요
    }

    // 하위 클래스 가진 요소들 검사
    root.querySelectorAll('[class]').forEach(removeIfUnwanted);
  }

  function attachObserver() {
    // 채팅 컨테이너 (폴딩 여부 클래스는 바뀔 수 있어 id로 고정 선택)
    const container = document.querySelector('#aside-chatting');
    if (!container) {
      // 아직 로드 전이면 재시도
      setTimeout(attachObserver, 300);
      return;
    }

    // 초기 한 번 정리
    sweep(container);

    // 이후 추가/변경 감시
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length) {
          m.addedNodes.forEach((n) => sweep(n));
        }
        // 클래스가 바뀌며 대상이 되는 경우도 처리
        if (m.type === 'attributes' && m.attributeName === 'class') {
          sweep(m.target);
        }
      }
    });

    obs.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachObserver);
  } else {
    attachObserver();
  }
})();