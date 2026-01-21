// ==UserScript==
// @name         숲 채팅창 자동 링크 변환
// @namespace    soop-live-chat-url-change
// @version      2026-01-20
// @description  숲 채팅창에 있는 링크를 클릭가능한 링크로 변환해줌.
// @author       explainpark101
// @match        https://play.sooplive.co.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sooplive.co.kr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563366/%EC%88%B2%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%EC%9E%90%EB%8F%99%20%EB%A7%81%ED%81%AC%20%EB%B3%80%ED%99%98.user.js
// @updateURL https://update.greasyfork.org/scripts/563366/%EC%88%B2%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%EC%9E%90%EB%8F%99%20%EB%A7%81%ED%81%AC%20%EB%B3%80%ED%99%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{
        const msgs = Array.from(document.querySelectorAll(".message-text .msg"));

        // URL 정규식 (간이 버전)
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        msgs.forEach(msg => {
            // TreeWalker를 사용하여 텍스트 노드만 순회
            const walker = document.createTreeWalker(msg, NodeFilter.SHOW_TEXT, {
                acceptNode: (node) => {
                    // 부모 중 button이나 a 태그가 있으면 제외
                    if (node.parentElement.closest('button, a')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            });

            const nodesToReplace = [];
            let currentNode;
            while (currentNode = walker.nextNode()) {
                if (urlRegex.test(currentNode.nodeValue)) {
                    nodesToReplace.push(currentNode);
                }
            }

            // 찾은 텍스트 노드들을 <a> 태그로 치환
            nodesToReplace.forEach(node => {
                const parent = node.parentNode;
                const content = node.nodeValue;
                const parts = content.split(urlRegex);

                const fragment = document.createDocumentFragment();
                parts.forEach(part => {
                    if (part.match(urlRegex)) {
                        const link = document.createElement('a');
                        link.href = `https://unsafelink.com/`+part;
                        link.textContent = part;
                        link.target = "_blank"; // 새창 열기 옵션
                        fragment.appendChild(link);
                    } else if (part.length > 0) {
                        fragment.appendChild(document.createTextNode(part));
                    }
                });

                parent.replaceChild(fragment, node);
            });
        });

    }, 4);

    // Your code here...
})();