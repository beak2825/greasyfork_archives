// ==UserScript==
// @name         ClaimCrypto Auto PTC & Faucet Claim Crypto (Priority PTC Fix)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Forces PTC as absolute priority before Faucet
// @author       Rubystance
// @license      MIT
// @match        https://claimcrypto.in/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/563944/ClaimCrypto%20Auto%20PTC%20%20Faucet%20Claim%20Crypto%20%28Priority%20PTC%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563944/ClaimCrypto%20Auto%20PTC%20%20Faucet%20Claim%20Crypto%20%28Priority%20PTC%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const refLink = "https://claimcrypto.in/?r=5622";

    const hasPTCAds = () => {
        const ptcBadge = document.querySelector('a[href="/ptc"] .badge-info');
        if (ptcBadge) {
            const count = parseInt(ptcBadge.textContent.replace(/\D/g, ''));
            return count > 0;
        }
        return false;
    };

    if (url === "https://claimcrypto.in/" || url.includes("/dashboard")) {
        if (!sessionStorage.getItem('refSet')) {
            sessionStorage.setItem('refSet', 'true');
            window.location.href = refLink;
            return;
        }
        window.location.href = "https://claimcrypto.in/ptc";
    }

    if (url.includes("claimcrypto.in/faucet")) {
        if (hasPTCAds()) {
            window.location.href = "https://claimcrypto.in/ptc";
            return;
        }

        let manualClickCount = 0;
        const captchaImages = document.querySelectorAll('a[rel][href="#"]');
        captchaImages.forEach(imgLink => {
            imgLink.addEventListener('click', function() {
                manualClickCount++;
                if (manualClickCount === 3) {
                    setTimeout(() => {
                        const collectBtn = document.querySelector('.claim-button');
                        if (collectBtn) collectBtn.click();
                    }, 1000);
                }
            });
        });
    }

    if (url.includes("claimcrypto.in/ptc") && !url.includes("/window/") && !url.includes("/iframe/")) {
        if (!hasPTCAds()) {
            window.location.href = "https://claimcrypto.in/faucet";
            return;
        }

        const windowBadge = document.querySelector('#tabs-window .badge-pill');
        const iframeTab = document.querySelector('#tabs-iframe');

        if (windowBadge && windowBadge.textContent.trim() === "0" && iframeTab) {
            iframeTab.click();
            setTimeout(() => {
                const iframeViewButton = document.querySelector('button[onclick*="ptc/iframe/"]');
                if (iframeViewButton) iframeViewButton.click();
            }, 1000);
        } else {
            const viewButton = document.querySelector('button[onclick*="ptc/window/"]');
            if (viewButton) {
                setTimeout(() => { viewButton.click(); }, 1000);
            }
        }
    }

    if (url.includes("claimcrypto.in/ptc/window/")) {
        const watchButton = document.querySelector('#watchNowButton');
        if (watchButton) setTimeout(() => { watchButton.click(); }, 1000);

        const checkCaptchaWindow = setInterval(() => {
            const captchaDone = document.querySelector('.iconcaptcha-modal__body-title');
            const verifyBtn = document.getElementById('verify');
            if (captchaDone && captchaDone.textContent.includes("Verification complete.")) {
                if (verifyBtn) {
                    clearInterval(checkCaptchaWindow);
                    verifyBtn.removeAttribute('disabled');
                    verifyBtn.click();
                }
            }
        }, 1000);
    }

    if (url.includes("claimcrypto.in/ptc/iframe/")) {
        const checkCaptchaIframe = setInterval(() => {
            const captchaDone = document.querySelector('.iconcaptcha-modal__body-title');
            const verifyBtn = document.getElementById('verify');
            if (captchaDone && captchaDone.textContent.includes("Verification complete.")) {
                if (verifyBtn) {
                    clearInterval(checkCaptchaIframe);
                    verifyBtn.removeAttribute('disabled');
                    verifyBtn.click();
                }
            }
        }, 1000);
    }

    if (!url.includes("claimcrypto.in") && window.name !== "main") {
        setTimeout(() => { window.close(); }, 1000);
    }
})();