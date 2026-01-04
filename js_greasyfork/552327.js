// ==UserScript==
// @name         Wplace ColorPicker to Paint
// @namespace    http://tampermonkey.net/
// @version      1.14
// @description  I 키를 누르면 현재 마우스 위치에 클릭 2번 실행
// @author       You
// @match        https://wplace.live/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552327/Wplace%20ColorPicker%20to%20Paint.user.js
// @updateURL https://update.greasyfork.org/scripts/552327/Wplace%20ColorPicker%20to%20Paint.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    function simulateClick(x, y) {
        const element = document.elementFromPoint(x, y);
        if (!element) return;
        const eventOptions = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y,
            button: 0
        };
        element.dispatchEvent(new MouseEvent('mousedown', eventOptions));
        element.dispatchEvent(new MouseEvent('mouseup', eventOptions));
        element.dispatchEvent(new MouseEvent('click', eventOptions));
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'i' || e.key === 'I') {
            const fixedX = mouseX;
            const fixedY = mouseY;

            setTimeout(() => {
                simulateClick(fixedX, fixedY);
            }, 100);
            setTimeout(() => {
                simulateClick(fixedX, fixedY);
            }, 165);
        }
    });
})();