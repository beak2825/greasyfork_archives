// ==UserScript==
// @name               Auto Fill Text Captcha (Human-like with Mistakes)
// @namespace          Violentmonkey Scripts
// @version            0.1
// @author             Ojo Ngono
// @description        Ketik captcha dengan delay acak + salah ketik sesekali lalu backspace, submit otomatis
// @match              https://captchacoin.site/*
// @icon               https://i.ibb.co.com/XJSPdz0/large.png
// @license            Copyright OjoNgono
// @grant              none
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/549223/Auto%20Fill%20Text%20Captcha%20%28Human-like%20with%20Mistakes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549223/Auto%20Fill%20Text%20Captcha%20%28Human-like%20with%20Mistakes%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function randomDelay(min = 150, max = 400) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function typeText(input, text, callback) {
        input.value = "";
        let i = 0;

        function typeNext() {
            if (i < text.length) {
                if (Math.random() < 0.2) {
                    const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                    input.value += wrongChar;

                    setTimeout(() => {
                        input.value = input.value.slice(0, -1);
                        input.value += text[i];
                        i++;
                        setTimeout(typeNext, randomDelay());
                    }, randomDelay(200, 500));

                } else {
                    input.value += text[i];
                    i++;
                    setTimeout(typeNext, randomDelay());
                }
            } else if (callback) {
                callback();
            }
        }

        typeNext();
    }

    function solveCaptcha() {
        const captchaBox = document.querySelector('#cte-captcha-box form div');
        const inputField = document.querySelector('#cte-captcha-form input[name="cte_input"]');
        const submitBtn = document.querySelector('#cte-captcha-form input[type="submit"]');

        if (captchaBox && inputField && submitBtn) {
            const captchaText = captchaBox.innerText.trim();

            if (captchaText.length > 0 && inputField.value !== captchaText) {

                typeText(inputField, captchaText, () => {
                    setTimeout(() => {
                        submitBtn.click();
                    }, 800 + randomDelay(200, 600));
                });
            }
        }
    }

    window.addEventListener('load', () => {
        setTimeout(solveCaptcha, 1500);
    });

    setInterval(solveCaptcha, 5000);
})();
