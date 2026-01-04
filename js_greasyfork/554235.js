// ==UserScript==
// @name         Chzzk Live Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  치지직 방송 목록에서 차단한 유저 숨기기
// @author       You
// @match        https://chzzk.naver.com/lives*
// @match        https://chzzk.naver.com/watchparty/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554235/Chzzk%20Live%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/554235/Chzzk%20Live%20Cleaner.meta.js
// ==/UserScript==

(function () {
  function filterBlocked(el) {
  	console.log("FILTER BLOCKED")
    el.querySelectorAll('[class]').forEach((node) => {
      node.classList.forEach((cls) => {
        if (cls.startsWith('video_card_is_block__')) {
        	console.log(node)
          node.remove();
          console.log("차단 요소 제거:", cls);
        }
      });
    });
  }

  function initObserver(target) {
    // 초기 필터링
    filterBlocked(target);

    // 옵저버 등록
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((added) => {
            if (added.nodeType === 1) {
              filterBlocked(added);
            }
          });
        }
      }
    });

    observer.observe(target, { childList: true, subtree: true });
    console.log('치지직 방송 목록 클리너: 옵저버 연결 완료', target);
  }

  function f() {
  	console.log("치지직 방송 목록 클리너")

    // navigation_component_list__ 로 시작하는 엘리먼트 찾기
    const list = document.querySelector('[class^="navigation_component_list__"]');
    if (list) {
      initObserver(list);
    } else {
      console.log("navigation_component_list__ 요소를 아직 못 찾음");
      setTimeout(f, 500); // 못 찾았으면 재시도
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", f);
  } else {
    f();
  }
})();