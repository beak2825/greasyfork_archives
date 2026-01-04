// ==UserScript==
// @name         Stonage Lucky-Dragon Discord DM Keyword Notifier
// @namespace    https://blog.naver.com/zellay
// @version      0.1 beta
// @description  Discord DM에서 특정 단어가 포함된 새 메시지가 올라오면 브라우저 알림 띄우기
// @author       zellay
// @license      MIT
// @match        https://discord.com/channels/@me/*
// @grant        GM_notification
// @run-at       document-idle
// @noframes
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKTZ_aLF1FPzEWGUVWYXc8sNGomr2wmrdibw&s
// @downloadURL https://update.greasyfork.org/scripts/558605/Stonage%20Lucky-Dragon%20Discord%20DM%20Keyword%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/558605/Stonage%20Lucky-Dragon%20Discord%20DM%20Keyword%20Notifier.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEYWORDS = ["100Lv"];

    const notifiedTexts = new Set();

    function textHasKeyword(text) {
        return KEYWORDS.some(k => text.includes(k));
    }

    function handleNode(node) {
        if (!(node instanceof HTMLElement)) return;

        const text = (node.textContent || "").trim();
        if (!text) return;
        if (!textHasKeyword(text)) return;

        if (notifiedTexts.has(text)) return;
        notifiedTexts.add(text);

        console.log("[Keyword hit]", text);

        GM_notification({
            title: "디스코드 키워드 감지",
            text: text.slice(0, 180),
            timeout: 0,
            onclick: function () {
                window.focus();
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                handleNode(node);
            });
        }
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

    console.log("[Tampermonkey] Discord keyword notifier started.");

    GM_notification({
        title: "푸룡 레벨 업 알림",
        text: "레벨 업 알림 정상 작동 중",
        timeout: 5000
    });
})();
