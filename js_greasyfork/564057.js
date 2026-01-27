// ==UserScript==
// @name         Torn BHG Payment Auto-Fill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-fill send money form from URL params (?m=325000&r=BHG)
// @author       Rosti
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564057/Torn%20BHG%20Payment%20Auto-Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/564057/Torn%20BHG%20Payment%20Auto-Fill.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const params = new URLSearchParams(window.location.search);

    const money  = params.get('m') || params.get('money');
    const reason = params.get('r') || params.get('reason');

    console.log('[Torn AutoFill] Params:', { money, reason });

    if (!money && !reason) return;

    function setReactValue(el, value) {
        const setter = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(el),
            'value'
        )?.set;

        setter ? setter.call(el, value) : el.value = value;

        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function fillForm() {
        const moneyInput = [...document.querySelectorAll('.input-money')]
            .find(el => el.offsetParent !== null);

        const reasonInput = document.querySelector('.send-cash-message-input');

        if (!moneyInput || !reasonInput) return false;

        if (money) {
            setReactValue(moneyInput, money);
            console.log('[Torn AutoFill] Money set:', money);
        }

        if (reason) {
            setReactValue(reasonInput, reason);
            console.log('[Torn AutoFill] Reason set:', reason);
        }

        return true;
    }

    function openSendMoney() {
        const btn =
            document.querySelector('.profile-button-sendMoney') ||
            document.querySelector('a[aria-label="Send cash"]');

        if (!btn) return false;

        btn.click();
        console.log('[Torn AutoFill] Send Money clicked');
        return true;
    }

    // Open dialog immediately if params exist
    openSendMoney();

    // Poll until dialog exists
    let tries = 0;
    const poll = setInterval(() => {
        tries++;
        if (fillForm() || tries > 60) {
            clearInterval(poll);
            if (tries > 60) {
                console.log('[Torn AutoFill] Gave up waiting for dialog');
            }
        }
    }, 100);
})();
