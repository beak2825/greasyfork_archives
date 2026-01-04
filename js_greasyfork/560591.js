// ==UserScript==
// @name         나무위키 파워링크 광고 차단
// @description  나무위키의 파워링크를 차단합니다.
// @match        https://namu.wiki/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://namu.wiki
// @grant        none
// @version      1.0.8
// @namespace    https://greasyfork.org/users/1553645
// @downloadURL https://update.greasyfork.org/scripts/560591/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%ED%8C%8C%EC%9B%8C%EB%A7%81%ED%81%AC%20%EA%B4%91%EA%B3%A0%20%EC%B0%A8%EB%8B%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560591/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%ED%8C%8C%EC%9B%8C%EB%A7%81%ED%81%AC%20%EA%B4%91%EA%B3%A0%20%EC%B0%A8%EB%8B%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* style 속성에 color 가 있는 부모 요소 탐색 */
    function findColorStyledParent(el) {
        let current = el.parentElement;
        while (current) {
            if (current.nodeType === 1 && current.hasAttribute('style')) {
                if (/color\s*:/i.test(current.getAttribute('style'))) {
                    return current;
                }
            }
            current = current.parentElement;
        }
        return null;
    }

    /* color 요소의 형제 요소들의 자식에서 <span id="fn-..."> 탐지 */
    function siblingChildrenHasFnSpan(colorParent) {
        const parent = colorParent.parentElement;
        if (!parent) return false;

        for (const sibling of parent.children) {
            if (sibling === colorParent) continue;
            if (sibling.querySelector('span[id^="fn-"]')) {
                return true;
            }
        }
        return false;
    }

    /* 안전 제거: 먼저 display:none 하고 2프레임 뒤 remove */
    function removeClean(target) {
        if (!target || !target.remove) return;
        target.style.display = 'none';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (target.isConnected) target.remove();
            });
        });
    }

    /* 디바운스 */
    let timer = null;
    function queueProcess() {
        clearTimeout(timer);
        timer = setTimeout(runProcess, 50); // DOM 안정되면 실행
    }

    function runProcess() {
        document.querySelectorAll('a[href^="#s-"]').forEach(link => {
            const colorParent = findColorStyledParent(link);
            if (!colorParent) return;

            // 이미 제거한 영역 무시
            if (colorParent.closest('[data-blocked-by-script]')) return;

            const hasFn = siblingChildrenHasFnSpan(colorParent);

            let target = colorParent;

            // fn- span 없으면 2부모위까지 제거
            if (!hasFn) {
                const p1 = colorParent.parentElement;
                const p2 = p1 && p1.parentElement;
                if (p2) target = p2;
            }

            target.setAttribute('data-blocked-by-script', 'true');
            removeClean(target);
        });
    }

    // 초기 실행 (렌더링 끝난 뒤 동작 보장 위해 딜레이)
    setTimeout(queueProcess, 100);

    // 동적 페이지 갱신 대응
    new MutationObserver(queueProcess).observe(document.body, {
        childList: true,
        subtree: true
    });

})();