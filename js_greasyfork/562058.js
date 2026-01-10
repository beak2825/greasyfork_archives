// ==UserScript==
// @name         MortalAutoRatingCheck
// @namespace    http://tampermonkey.net/
// @version      2024-05-13
// @description  MortalAutoRatingCheck + Auto Korean Language
// @author       1
// @match        https://mjai.ekyu.moe/*
// @icon         https://i.postimg.cc/FHNJV77d/60px-Naga-AI.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562058/MortalAutoRatingCheck.user.js
// @updateURL https://update.greasyfork.org/scripts/562058/MortalAutoRatingCheck.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", () => {
        // 평점 표시 체크박스 활성화
        const ratingCheckbox = document.getElementsByName("show-rating")[0];
        if (ratingCheckbox) {
            ratingCheckbox.checked = true;
            ratingCheckbox.dispatchEvent(new Event("change"));
        }

        // 언어를 한국어로 강제 설정
        const langSelect = document.querySelector("select[name='lang'], select#lang, select.language");
        if (langSelect) {
            langSelect.value = "ko";
            langSelect.dispatchEvent(new Event("change")); // 변경 이벤트 발동
        }
    });
})();
