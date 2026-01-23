// ==UserScript==
// @name         가구야 아니라고!!!!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  넷플릭스 자막에서 '가구야'를 '카구야'로 변경합니다.
// @author       백붕스
// @match        https://www.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563607/%EA%B0%80%EA%B5%AC%EC%95%BC%20%EC%95%84%EB%8B%88%EB%9D%BC%EA%B3%A0%21%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/563607/%EA%B0%80%EA%B5%AC%EC%95%BC%20%EC%95%84%EB%8B%88%EB%9D%BC%EA%B3%A0%21%21%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetWord = '가구야';
    const replacementWord = '카구야';

    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.includes(targetWord)) {
                node.textContent = node.textContent.replace(new RegExp(targetWord, 'g'), replacementWord);
            }
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                replaceText(node.childNodes[i]);
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    replaceText(node);
                });
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

})();