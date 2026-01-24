// ==UserScript==
// @name         Auto PTC & Faucet Claim Crypto
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automates PTC and monitors manual faucet clicks to auto-submit
// @author       Rubystance
// @license      MIT
// @match        https://claimcrypto.in/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/563944/Auto%20PTC%20%20Faucet%20Claim%20Crypto.user.js
// @updateURL https://update.greasyfork.org/scripts/563944/Auto%20PTC%20%20Faucet%20Claim%20Crypto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const refLink = "https://claimcrypto.in/?r=5622";

    if (url === "https://claimcrypto.in/" || url.includes("/dashboard")) {
        if (!sessionStorage.getItem('refSet')) {
            sessionStorage.setItem('refSet', 'true');
            window.location.href = refLink;
            return;
        }
        const ptcSidebar = document.querySelector('a[href="/ptc"]');
        if (ptcSidebar) {
            ptcSidebar.click();
        }
    }

    if (url.includes("claimcrypto.in/ptc") && !url.includes("/window/") && !url.includes("/iframe/")) {
        const ptcBadge = document.querySelector('a[href="/ptc"] .badge-info');

        if (ptcBadge && ptcBadge.textContent.includes("0 ads")) {
            const faucetLink = document.querySelector('a[href="/faucet"]');
            if (faucetLink) faucetLink.click();
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

    if (url.includes("claimcrypto.in/faucet")) {
        let manualClickCount = 0;

        const captchaImages = document.querySelectorAll('a[rel][href="#"]');

        captchaImages.forEach(imgLink => {
            imgLink.addEventListener('click', function() {
                manualClickCount++;

                if (manualClickCount === 3) {
                    setTimeout(() => {
                        const collectBtn = document.querySelector('.claim-button');
                        if (collectBtn) {
                            collectBtn.click();
                        }
                    }, 1000);
                }
            });
        });
    }

    if (url.includes("claimcrypto.in/ptc/window/")) {
        const watchButton = document.querySelector('#watchNowButton');
        if (watchButton) {
            setTimeout(() => { watchButton.click(); }, 1000);
        }

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