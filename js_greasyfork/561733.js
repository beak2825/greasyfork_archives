// ==UserScript==
// @name         TRX Faucet Auto Select The Right Emoji + Auto Collect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Rubystance
// @license      MIT
// @description  Auto selects emojis & collects rewards
// @match        https://faucet.adbeast.xyz/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561733/TRX%20Faucet%20Auto%20Select%20The%20Right%20Emoji%20%2B%20Auto%20Collect.user.js
// @updateURL https://update.greasyfork.org/scripts/561733/TRX%20Faucet%20Auto%20Select%20The%20Right%20Emoji%20%2B%20Auto%20Collect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EMOJI_MAP = {
        fire: '🔥',
        star: '⭐',
        heart: '❤️',
        moon: '🌙',

        apple: '🍎',
        banana: '🍌',
        pizza: '🍕',
        burger: '🍔',

        cat: '🐱',
        dog: '🐶',

        car: '🚗',
        rocket: '🚀'
    };

    const REFERRAL_URL = 'https://faucet.adbeast.xyz/?r=izeonix19@gmail.com';
    const REFERRAL_KEY = 'adbeast_referral_applied';

    let emojiClicked = false;
    let rewardClicked = false;

    if (!localStorage.getItem(REFERRAL_KEY)) {
        localStorage.setItem(REFERRAL_KEY, 'true');
        console.log('🔗 Applying referral link one time...');
        window.location.href = REFERRAL_URL;
        return;
    }

    const observer = new MutationObserver(() => {

        if (!emojiClicked) {
            const textEl = Array.from(document.querySelectorAll('*'))
                .find(el => /^select the\s+/i.test(el.textContent.trim()));

            if (textEl) {
                const match = textEl.textContent.trim().match(/^select the\s+(.+)$/i);
                if (match) {
                    const name = match[1].toLowerCase();
                    const emoji = EMOJI_MAP[name];

                    if (emoji) {
                        const button = Array.from(document.querySelectorAll('button'))
                            .find(btn => btn.textContent.trim() === emoji);

                        if (button) {
                            console.log(`✅ Auto selecting: ${name} ${emoji}`);
                            button.click();
                            emojiClicked = true;
                        }
                    }
                }
            }
        }

        if (
            !rewardClicked &&
            window.location.href.includes('faucet.adbeast.xyz/dashboard')
        ) {
            const collectBtn = Array.from(document.querySelectorAll('button'))
                .find(btn =>
                    btn.textContent.includes('Collect Reward') &&
                    btn.textContent.includes('TRX')
                );

            if (collectBtn) {
                console.log('💰 Collect Reward button found. Clicking...');
                collectBtn.click();
                rewardClicked = true;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
