// ==UserScript==
// @name         CryptoCollect Auto Faucet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dashboard + Firewall solver + Faucet collect after 25s
// @author       Rubystance
// @license      MIT
// @match        https://cryptocollect.in/dashboard
// @match        https://cryptocollect.in/firewall
// @match        https://cryptocollect.in/faucet
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559861/CryptoCollect%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/559861/CryptoCollect%20Auto%20Faucet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (msg) => console.log('[CryptoCollect]', msg);

    function humanClick(el) {
        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    if (location.pathname === '/dashboard') {
        const t = setInterval(() => {
            const btn = [...document.querySelectorAll('span')]
                .find(el => el.textContent.trim() === 'Faucet Claim');

            if (btn) {
                log('Faucet Claim found. Clicking...');
                humanClick(btn);
                clearInterval(t);
            }
        }, 1500);
    }

    if (location.pathname === '/firewall') {
        const t = setInterval(() => {
            const equationEl = document.querySelector('h2.text-primary');
            const input = document.querySelector('input[name="captcha_answer"]');
            const submit = document.querySelector('button[type="submit"]');

            if (!equationEl || !input || !submit) return;

            const match = equationEl.textContent.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
            if (!match) return;

            const a = Number(match[1]);
            const op = match[2];
            const b = Number(match[3]);

            let result;
            switch (op) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = a / b; break;
            }

            input.value = result;
            input.dispatchEvent(new Event('input', { bubbles: true }));

            log(`Firewall solved: ${a} ${op} ${b} = ${result}`);
            humanClick(submit);

            clearInterval(t);
        }, 1000);
    }

    if (location.pathname === '/faucet') {
        log('Entered faucet page. Waiting 25 seconds before collecting...');

        setTimeout(() => {
            const button = document.querySelector(
                'button.btn.btn-primary.btn-lg.claim-button'
            );

            if (!button) {
                log('Collect button not found after 25 seconds.');
                return;
            }

            log('25 seconds passed. Clicking Collect your reward.');
            humanClick(button);

        }, 25000);
    }

})();
