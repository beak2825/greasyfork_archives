// ==UserScript==
// @name         DevUploads Complete Auto Bypass
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Auto bypass devuploads 
// @author       Shiva
// @match        *://devuploads.com/*
// @match        *://*.devuploads.com/*
// @match        *://djxmaza.in/*
// @match        *://*.djxmaza.in/*
// @grant        GM_xmlhttpRequest
// @connect      devuploads.com
// @run-at       document-end
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/553576/DevUploads%20Complete%20Auto%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/553576/DevUploads%20Complete%20Auto%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[DevUploads Complete] Script loaded');

    // ============ UTILITY FUNCTIONS ============

    function randomString(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function showStatus(message, color) {
        let status = document.getElementById('devuploads-bypass-status');
        if (!status) {
            status = document.createElement('div');
            status.id = 'devuploads-bypass-status';
            status.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${color};
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                font-weight: bold;
                z-index: 999999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(status);
        }
        status.style.background = color;
        status.textContent = message;
    }

    // ============ TOKEN BYPASS ============

    function buildTokenData() {
        const randValue = randomString(10);
        const currentTime = Date.now();
        const timezoneOffset = -new Date().getTimezoneOffset();
        const referer = window.location.href;

        let tokenData = "[download]";
        tokenData += `[referer=${referer}]`;
        tokenData += `[rand=${randValue}]`;
        tokenData += "[altk=]";
        tokenData += `[emti=${currentTime}]`;
        tokenData += "[gifnun=0][gifhei=0][gifpos=0][gifvis=0]";
        tokenData += "[wc=doubleclick adsby onerror]";
        tokenData += `[setoff=${timezoneOffset}]`;
        tokenData += '[castyl={"pointerEvents":"auto","display":"block","visibility":"visible"}]';
        tokenData += '[caeven=auto][cadisp=block][cavis=visible]';
        tokenData += '[pc=0][pn=][gsm=]';

        return {
            rand: randValue,
            msg: tokenData
        };
    }

    function sendToken() {
        const tokenData = buildTokenData();

        console.log('[DevUploads Complete] Sending token:', tokenData);
        showStatus('🔄 Sending bypass token...', '#2196F3');

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://devuploads.com/token/token.php',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://djxmaza.in',
                'Referer': window.location.href,
                'User-Agent': navigator.userAgent
            },
            data: `rand=${tokenData.rand}&msg=${encodeURIComponent(tokenData.msg)}`,
            onload: function(response) {
                console.log('[DevUploads Complete] Token response:', response.responseText);
                showStatus('✅ Token accepted!', '#4CAF50');

                // After token, click the buttons
                setTimeout(clickDownloadButtons, 2000);
            },
            onerror: function(error) {
                console.error('[DevUploads Complete] Token error:', error);
                showStatus('⚠️ Token failed, trying buttons...', '#FF9800');
                setTimeout(clickDownloadButtons, 2000);
            }
        });
    }

    // ============ BUTTON CLICKING ============

    function clickDownloadButtons() {
        console.log('[DevUploads Complete] Looking for download buttons...');

        // Step 1: Click "Generate Download Link" button (#gdl)
        const generateBtn = document.querySelector('#gdl');

        if (generateBtn) {
            console.log('[DevUploads Complete] Found "Generate Download Link" button');
            showStatus('🔘 Clicking Generate Link...', '#9C27B0');

            generateBtn.click();

            // Step 2: Wait for "Go to Generated Link" button (#gdlf) to appear
            setTimeout(() => {
                clickGoToLink();
            }, 3000); // Wait 3 seconds for link generation

        } else {
            console.log('[DevUploads Complete] Generate button not found, trying next step...');
            clickGoToLink();
        }
    }

    function clickGoToLink() {
        console.log('[DevUploads Complete] Looking for "Go to Link" button...');

        const goToLinkBtn = document.querySelector('#gdlf');

        if (goToLinkBtn) {
            console.log('[DevUploads Complete] Found "Go to Generated Link" button');
            showStatus('🔘 Clicking Go to Link...', '#9C27B0');

            goToLinkBtn.click();

            showStatus('✅ Download started!', '#4CAF50');

            // Hide status after 3 seconds
            setTimeout(() => {
                const status = document.getElementById('devuploads-bypass-status');
                if (status) status.remove();
            }, 3000);

        } else {
            console.log('[DevUploads Complete] Go to Link button not found yet, retrying...');
            showStatus('⏳ Waiting for download link...', '#FF9800');

            // Retry after 2 seconds
            setTimeout(clickGoToLink, 2000);
        }
    }

    // ============ FALLBACK METHODS ============

    function findAndClickDownload() {
        // Try to find any download-related elements
        const selectors = [
            '#gdl',                    // Generate download link
            '#gdlf',                   // Go to generated link
            'img[src*="generate_download"]',
            'img[src*="go_to_generated"]',
            'a[href*="download"]',
            'button:contains("Download")',
            '.download-btn',
            '#downloadButton'
        ];

        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
                console.log('[DevUploads Complete] Found element:', selector);
                el.click();
                return true;
            }
        }

        return false;
    }

    // ============ MONITOR FOR BUTTONS ============

    function monitorForButtons() {
        // Use MutationObserver to detect when buttons appear
        const observer = new MutationObserver((mutations) => {
            const gdl = document.querySelector('#gdl');
            const gdlf = document.querySelector('#gdlf');

            if (gdl && !gdl.dataset.clicked) {
                console.log('[DevUploads Complete] Generate button appeared!');
                gdl.dataset.clicked = 'true';
                showStatus('🔘 Auto-clicking Generate Link...', '#9C27B0');
                setTimeout(() => gdl.click(), 500);
            }

            if (gdlf && !gdlf.dataset.clicked) {
                console.log('[DevUploads Complete] Go to Link button appeared!');
                gdlf.dataset.clicked = 'true';
                showStatus('🔘 Auto-clicking Go to Link...', '#4CAF50');
                setTimeout(() => gdlf.click(), 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        console.log('[DevUploads Complete] Monitoring for buttons...');
    }

    // ============ MAIN EXECUTION ============

    function init() {
        showStatus('🚀 DevUploads Bypass Active', '#673AB7');

        // Start monitoring for buttons immediately
        monitorForButtons();

        // Send token after 1 second
        setTimeout(() => {
            sendToken();
        }, 1000);

        // Try clicking buttons after 3 seconds (in case they're already there)
        setTimeout(() => {
            clickDownloadButtons();
        }, 3000);

        // Fallback: try to find any download after 8 seconds
        setTimeout(() => {
            if (!document.querySelector('#gdlf[data-clicked="true"]')) {
                console.log('[DevUploads Complete] Using fallback...');
                findAndClickDownload();
            }
        }, 8000);
    }

    // Start when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
