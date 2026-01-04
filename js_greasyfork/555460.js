// ==UserScript==
// @name         Autofill Captcha Siamik UPN "Veteran" Jawa Timur
// @version      1.0
// @description  Mengisi otomatis captcha website siamik UPN GEMING
// @author       @mrhuwaidi
// @match        https://siamik.upnjatim.ac.id/html/siamik/login2023.asp
// @match        https://siamik3.upnjatim.ac.id/siamik2022/html/siamik/login2023.asp
// @grant        none
// @icon         https://upnjatim.ac.id/favicon.ico
// @icon64       https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://upnjatim.ac.id/&size=64
// @namespace https://greasyfork.org/users/1536475
// @downloadURL https://update.greasyfork.org/scripts/555460/Autofill%20Captcha%20Siamik%20UPN%20%22Veteran%22%20Jawa%20Timur.user.js
// @updateURL https://update.greasyfork.org/scripts/555460/Autofill%20Captcha%20Siamik%20UPN%20%22Veteran%22%20Jawa%20Timur.meta.js
// ==/UserScript==

(function () {
    'use strict';
      //Isi otomatis captcha
    window.addEventListener('load', function () {
        const CaptchaAseli = document.querySelector('#sizing > div > div > div > div.card-body.collapse.in > div > form > h2');
        const TargetInput = document.querySelector('#cap');
        if (CaptchaAseli && TargetInput) {
            const value = CaptchaAseli.textContent.trim();
            TargetInput.value = value;
            console.log('Mengganti #cap dengan ', value);
        } else {
            console.warn('Captcha tidak bisa ditemukan');
        }
    });
})();