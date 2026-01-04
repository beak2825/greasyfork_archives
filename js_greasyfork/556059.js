// ==UserScript==
// @name         DC 스팸 링크 포함 댓글 전체 제거
// @match        https://gall.dcinside.com/*
// @namespace mm
// @version 0.1
// @description 차단
// @locale ko
// @match        https://m.dcinside.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556059/DC%20%EC%8A%A4%ED%8C%B8%20%EB%A7%81%ED%81%AC%20%ED%8F%AC%ED%95%A8%20%EB%8C%93%EA%B8%80%20%EC%A0%84%EC%B2%B4%20%EC%A0%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/556059/DC%20%EC%8A%A4%ED%8C%B8%20%EB%A7%81%ED%81%AC%20%ED%8F%AC%ED%95%A8%20%EB%8C%93%EA%B8%80%20%EC%A0%84%EC%B2%B4%20%EC%A0%9C%EA%B1%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 차단 대상 키워드(도메인/식별자)
    const blockCandidates = [
        "aliexpress",
        "aliexpress.com",
        "aclk",
        "google.com/aclk",
        "adurl",
        "gclid"
    ];

    // 텍스트에서 URL 패턴(예: "http://...", "https://...", "www.", "aliexpress.com/..." 등)을 잡아내기 위한 정규식
    const urlLikeRegex = /\b(?:(?:https?:\/\/|www\.)[^\s<>]+|[^\s<>]+\.(?:com|net|kr|jp|cn|io|me)(?:\/[^\s<>]*)?)/i;

    const isBlockedHref = (href) => {
        if (!href) return false;
        try { href = decodeURIComponent(href); } catch(e){}
        href = href.toLowerCase();
        return blockCandidates.some(k => href.includes(k));
    };

    const nodeContainsBlocked = (li) => {
        if (!li) return false;

        // 1) <a href> 검사 (정규 href, data-href 등)
        const anchors = li.querySelectorAll("a, [data-href], [onclick]");
        for (const a of anchors) {
            // href 속성
            if (a.hasAttribute && a.hasAttribute("href") && isBlockedHref(a.getAttribute("href"))) return true;
            // data-href 같은 커스텀 속성
            if (a.dataset) {
                for (const key of Object.keys(a.dataset)) {
                    if (isBlockedHref(a.dataset[key])) return true;
                }
            }
            // onclick 안의 URL/도메인
            if (a.getAttribute && a.getAttribute("onclick")) {
                if (isBlockedHref(a.getAttribute("onclick"))) return true;
            }
        }

        // 2) 댓글 텍스트 내부에 도메인/URL이 텍스트 형태로 있는지 검사
        const txt = (li.innerText || "").toLowerCase();
        // 도메인 키워드가 포함되어 있고, 텍스트에 URL/도메인 형태가 보이면 차단
        if (blockCandidates.some(k => txt.includes(k))) {
            if (urlLikeRegex.test(txt) || blockCandidates.some(k => txt.includes(k + ".com") || txt.includes(k + "/"))) {
                return true;
            }
            // 예외: 도메인 키워드만 흔하게 언급되는 경우(희박) → 그래도 차단 원하면 true
        }

        return false;
    };

    const removeCommentIfBad = (node) => {
        // node가 li.comment이 아니라면 해당 노드에서 가장 가까운 li.comment 찾기
        const li = node.closest ? node.closest("li.comment") : null;
        if (!li) return;
        if (nodeContainsBlocked(li)) li.remove();
    };

    // 초기 검사: 이미 로드된 댓글 전부 검사
    document.querySelectorAll("li.comment").forEach(li => {
        if (nodeContainsBlocked(li)) li.remove();
    });

    // 동적 로드되는 댓글 감지
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            // 추가된 노드들 검사
            if (m.addedNodes && m.addedNodes.length) {
                m.addedNodes.forEach(n => {
                    // 노드 자체가 li.comment이면 바로 검사/삭제
                    if (n.nodeType === 1 && n.matches && n.matches("li.comment")) {
                        if (nodeContainsBlocked(n)) n.remove();
                        return;
                    }
                    // 아니면 해당 서브트리에서 li.comment 찾기
                    if (n.querySelectorAll) {
                        n.querySelectorAll("li.comment").forEach(li => {
                            if (nodeContainsBlocked(li)) li.remove();
                        });
                    }
                    // 또한 추가된 노드에 링크/속성이 바로 있는 경우 그 노드 기준으로 가장 가까운 li 제거
                    if (n.nodeType === 1) removeCommentIfBad(n);
                });
            }
            // 변경된 타겟(속성변경 등)도 체크
            if (m.target && m.target.nodeType === 1) removeCommentIfBad(m.target);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
})();