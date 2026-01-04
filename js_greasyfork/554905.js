// ==UserScript==
// @name         reCAPTCHA Auto Reset on Fail
// @namespace    recaptcha-auto-reset
// @version      1.1
// @description  Авто-перезагрузка рекапчи при неправильном решении
// @author       GPT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554905/reCAPTCHA%20Auto%20Reset%20on%20Fail.user.js
// @updateURL https://update.greasyfork.org/scripts/554905/reCAPTCHA%20Auto%20Reset%20on%20Fail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const errorText = document.querySelector('.rc-anchor-error-msg') ||
                          document.querySelector('#recaptcha-error');

        // Если сайт показывает ошибку
        if (errorText && errorText.innerText.trim().length > 0) {
            console.log('[AutoCaptchaReset] Ошибка reCAPTCHA. Перезапуск...');

            // Кнопка перезагрузки
            const resetBtn = document.querySelector('.rc-button-reload');

            if (resetBtn) {
                resetBtn.click();
                console.log('[AutoCaptchaReset] Нажата кнопка перезагрузки');
            } else {
                // fallback: на всякий случай перезагрузим фрейм
                const iframe = document.querySelector('iframe[src*="google.com/recaptcha"]');
                if (iframe) iframe.src = iframe.src;
                console.log('[AutoCaptchaReset] Перезагружен iframe');
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
