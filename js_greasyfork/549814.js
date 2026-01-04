// ==UserScript==
// @name PASS Auto Fill
// @version 1.0
// @description PASS 본인 인증 창의 이름과 전화번호를 자동으로 입력합니다.
// @match https://safe.ok-name.co.kr/MCommonSvl
// @match https://safe.ok-name.co.kr/CommonSvl
// @match https://wauth.teledit.com/Danal/*
// @match https://www.kmcert.com/kmcis/*
// @match https://nice.checkplus.co.kr/cert/*
// @run-at document-end
// @namespace https://greasyfork.org/users/1473440
// @downloadURL https://update.greasyfork.org/scripts/549814/PASS%20Auto%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/549814/PASS%20Auto%20Fill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const myName = "신상우";
    const myPhone = "01047130999";

    const selectors = [
        { name: "input[name='nm'], #nm", phone: "input[name='mbphn_no'], #mbphn_no" },
        { name: "input[name='push_username'], #push_username", phone: "input[name='push_mobileno'], #push_mobileno" },
        { name: "#userName, input[name='userName']", phone: "#mobileNo, input[name='mobileNo']" }
    ];

    function simulateRealTyping(element, value) {
        if (element.dataset.filled) return;
        element.focus();
        element.dataset.filled = 'true';

        let currentValue = '';
        for (const char of value) {
            currentValue += char;
            element.value = currentValue;
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }

        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
    }

    const observer = new MutationObserver((mutations, obs) => {
        for (const { name: nameSel, phone: phoneSel } of selectors) {
            const nameInput = document.querySelector(nameSel);
            if (!nameInput) continue;

            const phoneInput = document.querySelector(phoneSel);

            if (!nameInput.dataset.filled) {
                simulateRealTyping(nameInput, myName);
            }

            if (phoneInput && !phoneInput.dataset.filled) {
                simulateRealTyping(phoneInput, myPhone);
            }

            if (nameInput.value === myName && phoneInput?.value === myPhone) {
                obs.disconnect();
                return;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();