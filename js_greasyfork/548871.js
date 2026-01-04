// ==UserScript==
// @name         Valley Town DDabong Button Clicker
// @description  3추 버튼 단축키 Ctrl+Shift+Z. 이미 추천한 버튼은 클릭하지 않습니다.
// @namespace    https://blog.valley.town/@zeronox
// @version      0.5
// @author       zeronox
// @license      MIT
// @match        https://blog.valley.town/*
// @match        https://www.valley.town/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=valley.town
// @downloadURL https://update.greasyfork.org/scripts/548871/Valley%20Town%20DDabong%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/548871/Valley%20Town%20DDabong%20Button%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyZ') {
            clickButton("유익해요");
            clickButton("공감해요");
            clickButton("재밌어요");
        }
    });

    function clickButton(text) {
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            const span = button.querySelector('span');
            if (span && span.textContent.trim() === text && !button.classList.contains('bg-primary-default-20')) {
                button.click();
                break;
            }
        }
    }
})();