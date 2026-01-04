// ==UserScript==
// @name          Work.ink bypass(by kxBypass)
// @description   Work.ink bypass
// @namespace     https://discord.gg/pqEBSTqdxV
// @version       14.88
// @match         https://*.work.ink/*
// @grant         none
// @run-at        document-end
// @icon          https://i.pinimg.com/736x/aa/2a/e5/aa2ae567da2c40ac6834a44abbb9e9ff.jpg
// @downloadURL https://update.greasyfork.org/scripts/554796/Workink%20bypass%28by%20kxBypass%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554796/Workink%20bypass%28by%20kxBypass%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.title === 'Just a moment...') return;

    function displayCustomMessage() {
        if (document.getElementById('bypass-message')) return;
        if (!window.location.href.includes("work.ink")) return;

        const messageBox = document.createElement('div');
        messageBox.id = 'bypass-message';
        messageBox.innerHTML = `
            <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px; color: #fff;">NOTICE:</p>
            <p style="font-size: 24px; font-weight: 900; color: #fff; letter-spacing: 1px; text-shadow: 1px 1px 2px #000;">
                If it moves you up go down to the button go to destination and press again
            </p>
        `;
        messageBox.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #008080;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 999999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
            border: 2px solid #fff;
            transition: opacity 0.5s ease-in-out;
        `;

        document.body.appendChild(messageBox);

        setTimeout(() => {
            messageBox.style.opacity = '0';
            setTimeout(() => messageBox.remove(), 500);
        }, 100000);
    }

    if (window.location.href.includes("work.ink")) {
        displayCustomMessage();

        const repeatSelectors = [
            '.button-box .accessBtn',
            'button.closelabel'
        ];

        let skipClickCount = 0;
        let accessIsolated = false;

        const interval = setInterval(() => {
            document.querySelector('div.fixed.top-16.left-0.right-0.bottom-0.bg-white.z-40.overflow-y-auto')?.remove();
            document.querySelector('.main-modal')?.remove();

            const goToDestinationBtn = document.querySelector('button:not(.skipBtn)');
            if (goToDestinationBtn && goToDestinationBtn.textContent.trim() === 'Go To Destination') {
                goToDestinationBtn.click();
                clearInterval(interval);
                return;
            }

            repeatSelectors.forEach(sel => {
                document.querySelector(sel)?.click();
            });

            const skipBtn = document.querySelector('button.skipBtn');
            if (skipBtn && skipClickCount < 4) {
                skipBtn.click();
                skipClickCount++;
            }

            if (skipClickCount >= 4 && !accessIsolated) {
                const accessBtn = document.querySelector('#access-offers.accessBtn');
                if (accessBtn) {
                    document.body.innerHTML = '';
                    document.body.style.cssText = `
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background: white;
                    `;
                    document.body.appendChild(accessBtn);
                    accessBtn.style.cssText = `
                        font-size: 1.25rem;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        background-color: #10b981;
                        color: white;
                        border: none;
                        cursor: pointer;
                    `;
                    accessIsolated = true;
                    clearInterval(interval);
                }
            }
        }, 200);

        const ytContainer = document.createElement('div');
        ytContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            background-color: #008080;
            padding: 12px;
            border-radius: 12px;
            z-index: 999999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 2px solid white;
        `;

        const label = document.createElement('div');
        label.textContent = 'YOU →';
        label.style.cssText = `
            color: white;
            font-weight: bold;
            font-size: 20px;
            margin-right: 12px;
            font-family: Arial, sans-serif;
        `;

        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/TEjNPzf67n8?autoplay=1&mute=0&controls=1';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.allowFullscreen = false;
        iframe.style.cssText = `
            width: 480px;
            height: 270px;
            border: 2px solid white;
            border-radius: 8px;
        `;

        ytContainer.appendChild(label);
        ytContainer.appendChild(iframe);
        document.body.appendChild(ytContainer);

        window.adsbygoogle = window.adsbygoogle || [{}];
        window.googletag = window.googletag || { cmd: [] };
        window.googletag.cmd.push = function (fn) {
            try { fn(); } catch (e) {}
        };

        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('ads')) {
                return Promise.resolve(new Response('', { status: 200 }));
            }
            return originalFetch.apply(this, args);
        };

        const fakeAd = document.createElement('div');
        fakeAd.className = 'adsbygoogle';
        fakeAd.id = 'fake-ad';
        fakeAd.style.cssText = `
            display: block !important;
            width: 1px;
            height: 1px;
            position: absolute;
            top: -9999px;
            left: -9999px;
            background: transparent;
        `;
        document.body.appendChild(fakeAd);

        const adblockSelectors = [
            '[class*="adblock"]',
            '[id*="adblock"]',
            '.adblock-popup',
            '.adblock-message',
            '.adblock-overlay',
            '.blocker-message',
            '.popup-adblock',
            'div:has(> h1:contains("Adblocker Was Detected"))',
            'div:has(> button:contains("Refresh Page"))'
        ];

        function removeAdblockElements() {
            adblockSelectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.remove();
                    console.log('Removed AdBlock element:', sel);
                });
            });
        }

        const observer = new MutationObserver(() => removeAdblockElements());
        observer.observe(document.body, { childList: true, subtree: true });

        removeAdblockElements();
    }
})();
