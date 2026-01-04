// ==UserScript==
// @name         소미소프트 통합 자동화 스크립트
// @version      2.1
// @description  kone.gg에서 base64암호화 URL 더블클릭하면 열기 + kio.ac에서 광고 제거 및 비밀번호 자동 입력
// @author       Copilot
// @icon         https://api.kone.gg/v0/sub/somisoft/icon
// @match        https://kone.gg/s/somisoft*
// @match        https://kio.ac/*
// @grant        none
// @namespace https://greasyfork.org/users/1480633
// @downloadURL https://update.greasyfork.org/scripts/548677/%EC%86%8C%EB%AF%B8%EC%86%8C%ED%94%84%ED%8A%B8%20%ED%86%B5%ED%95%A9%20%EC%9E%90%EB%8F%99%ED%99%94%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/548677/%EC%86%8C%EB%AF%B8%EC%86%8C%ED%94%84%ED%8A%B8%20%ED%86%B5%ED%95%A9%20%EC%9E%90%EB%8F%99%ED%99%94%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔹 kone.gg 기능: base64 URL 디코딩 후 새탭 열기
    if (location.hostname === 'kone.gg') {
        document.addEventListener('dblclick', () => {
            const selection = window.getSelection().toString().trim();
            if (!selection) return;

            try {
                const decoded = atob(selection);
                if (/^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(decoded)) {
                    window.open(decoded, '_blank');
                }
            } catch (e) {
                console.log('선택된 텍스트가 base64가 아닙니다.');
            }
        });
    }

    // 🔹 kio.ac 기능: 광고 제거 + 비밀번호 자동 입력
    if (location.hostname === 'kio.ac') {
        const PASSWORDS = ['somisoft', '2025somisoft', 'somisoft2025', '2026somisoft', 'somisoft2026'];

        const removeAdElements = () => {
            ['bits-88', 'bits-87'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.remove();
            });
        };

        const injectAdBlockCSS = () => {
            const style = document.createElement('style');
            style.textContent = `
                #bits-88, #bits-87 {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    height: 0 !important;
                }
            `;
            document.head.appendChild(style);
        };

        const tryAutoFillPassword = () => {
            const dialog = document.querySelector('[role="dialog"][data-state="open"]');
            if (!dialog) return;

            const title = dialog.querySelector('[data-dialog-title]');
            if (!title || !title.textContent.includes('비밀번호로 보호됨')) return;

            const input = dialog.querySelector('input[type="text"][placeholder*="비밀번호"]');
            const button = dialog.querySelector('button[data-submit="true"]');

            if (input && button) {
                let index = 0;

                const tryNextPassword = () => {
                    if (index >= PASSWORDS.length) {
                        console.warn('모든 비밀번호 시도 완료');
                        observer.disconnect();
                        return;
                    }

                    input.value = PASSWORDS[index];
                    ['input', 'change'].forEach(evt =>
                        input.dispatchEvent(new Event(evt, { bubbles: true }))
                    );

                    const interval = setInterval(() => {
                        if (!button.disabled) {
                            button.click();
                            clearInterval(interval);
                            observer.disconnect();
                        } else {
                            index++;
                            clearInterval(interval);
                            setTimeout(tryNextPassword, 500);
                        }
                    }, 800);
                };

                tryNextPassword();
            }
        };

        window.addEventListener('load', () => {
            removeAdElements();
            injectAdBlockCSS();
        });

        const observer = new MutationObserver(tryAutoFillPassword);
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
