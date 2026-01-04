// ==UserScript==
// @name PikPak 자동 입력 및 버튼 감시 클릭
// @namespace http://tampermonkey.net/
// @version 1.4
// @description 비밀번호 입력 후 버튼 활성화 감지하여 자동 클릭
// @match https://*.mypikpak.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/552181/PikPak%20%EC%9E%90%EB%8F%99%20%EC%9E%85%EB%A0%A5%20%EB%B0%8F%20%EB%B2%84%ED%8A%BC%20%EA%B0%90%EC%8B%9C%20%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/552181/PikPak%20%EC%9E%90%EB%8F%99%20%EC%9E%85%EB%A0%A5%20%EB%B0%8F%20%EB%B2%84%ED%8A%BC%20%EA%B0%90%EC%8B%9C%20%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fixedPassword = "vdstore"; // 원하는 비밀번호 입력

    const fillPassword = () => {
        const input = document.querySelector('input.el-input__inner[placeholder="비밀번호를 입력해주세요"]') || document.querySelector('input.el-input__inner[placeholder="Please enter the Password"]');
        if (input) {
            input.value = fixedPassword;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    const observeButton = () => {
        const targetButton = Array.from(document.querySelectorAll('button')).find(btn =>
                                                                                  btn.textContent.includes("파일 보기") || btn.textContent.includes("View File(s)")
                                                                                 );

        if (!targetButton) return;

        const tryClick = () => {
            if (!targetButton.disabled && targetButton.getAttribute("aria-disabled") === "false") {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                targetButton.dispatchEvent(clickEvent);
                observer.disconnect(); // 클릭 후 감시 중단
            }
        };

        const observer = new MutationObserver(tryClick);
        observer.observe(targetButton, { attributes: true, attributeFilter: ["disabled", "aria-disabled", "class"] });

        // 혹시 이미 활성화 상태라면 바로 시도
        tryClick();
    };

    window.addEventListener('load', () => {
        setTimeout(() => {
            fillPassword();
            observeButton();
        }, 1000);
    });
})();