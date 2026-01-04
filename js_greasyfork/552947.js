// ==UserScript==
// @name         Ultimate Universal Credit Timeout Preventer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Advanced prevention of automatic disconnection on Universal Credit by simulating activity, auto-extending sessions via keep-alive, and handling modals
// @author       Boranga
// @match        https://www.universal-credit.service.gov.uk/*
// @match        https://www.gov.uk/sign-in-universal-credit/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/552947/Ultimate%20Universal%20Credit%20Timeout%20Preventer.user.js
// @updateURL https://update.greasyfork.org/scripts/552947/Ultimate%20Universal%20Credit%20Timeout%20Preventer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration defaults
    const DEFAULT_CHECK_INTERVAL = 10000; // 10 seconds
    const DEFAULT_ACTIVITY_INTERVAL = 60000; // 1 minute
    const DEFAULT_COUNTDOWN_THRESHOLD = 30; // seconds
    const LOG_PREFIX = '[UC Timeout Preventer] ';

    // State
    let isActive = GM_getValue('isActive', true);
    let lastActivity = Date.now();
    let timeoutConfig = null;

    // Log function
    function log(message) {
        GM_log(`${LOG_PREFIX}${message}`);
        console.log(`${LOG_PREFIX}${message}`);
    }

    // Load timeout config from meta tag
    function loadTimeoutConfig() {
        const meta = document.querySelector('meta[name="hmrc-timeout-dialog"]');
        if (meta) {
            timeoutConfig = {
                timeout: parseInt(meta.getAttribute('data-timeout')) || 900,
                countdown: parseInt(meta.getAttribute('data-countdown')) || 120,
                keepAliveUrl: meta.getAttribute('data-keep-alive-url'),
                signOutUrl: meta.getAttribute('data-sign-out-url'),
                synchroniseTabs: meta.getAttribute('data-synchronise-tabs') === 'true'
            };
            log(`Timeout config loaded: ${JSON.stringify(timeoutConfig)}`);
        } else {
            log('No timeout meta tag found. Using defaults.');
        }
    }

    // Send keep-alive request
    function sendKeepAlive() {
        if (timeoutConfig && timeoutConfig.keepAliveUrl) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: timeoutConfig.keepAliveUrl,
                onload: () => log('Keep-alive sent successfully'),
                onerror: (err) => log(`Keep-alive error: ${err}`)
            });
        } else {
            log('No keep-alive URL available');
        }
    }

    // Simulate user activity
    function simulateActivity() {
        const events = ['mousemove', 'keydown', 'scroll'];
        events.forEach(type => {
            document.dispatchEvent(new Event(type, { bubbles: true }));
        });
        lastActivity = Date.now();
        log('Simulated user activity');
    }

    // Detect and handle timeout modal
    function handleTimeoutModal(mutations) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                const dialog = document.querySelector('.hmrc-timeout-dialog, [role="dialog"]');
                if (dialog) {
                    log('Timeout modal detected');
                    const continueBtn = dialog.querySelector('button.govuk-button, button[data-keep-alive-button-text], button');
                    if (continueBtn) {
                        continueBtn.click();
                        log('Automatically continued session');
                    }
                }
            }
        }
    }

    // Get countdown value
    function getCountdownValue() {
        const countdownElem = document.querySelector('#hmrc-timeout-countdown, [id*="countdown"], [id*="timeout"]');
        if (countdownElem) {
            const text = countdownElem.textContent.match(/\d+/);
            return text ? parseInt(text[0]) : null;
        }
        return null;
    }

    // Monitor function
    function monitor() {
        if (!isActive) return;

        const now = Date.now();
        const idleTime = (now - lastActivity) / 1000;

        if (timeoutConfig) {
            if (idleTime > timeoutConfig.timeout - 60) {
                sendKeepAlive();
                simulateActivity();
            }
        } else {
            const countdown = getCountdownValue();
            if (countdown && countdown < DEFAULT_COUNTDOWN_THRESHOLD) {
                window.location.reload();
                log('Low countdown detected, reloading');
            }
        }
    }

    // Toggle script
    function toggle() {
        isActive = !isActive;
        GM_setValue('isActive', isActive);
        log(`Script ${isActive ? 'enabled' : 'disabled'}`);
        toggleButton.textContent = `Timeout Preventer: ${isActive ? 'ON' : 'OFF'}`;
    }

    // Add toggle button
    let toggleButton;
    function addToggleButton() {
        toggleButton = document.createElement('button');
        toggleButton.textContent = `Timeout Preventer: ${isActive ? 'ON' : 'OFF'}`;
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = '9999';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.backgroundColor = isActive ? '#28a745' : '#dc3545';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.addEventListener('click', toggle);
        document.body.appendChild(toggleButton);
    }

    // Setup observers and intervals
    function init() {
        loadTimeoutConfig();
        addToggleButton();

        // MutationObserver for modal
        const observer = new MutationObserver(handleTimeoutModal);
        observer.observe(document.body, { childList: true, subtree: true });

        // Intervals
        setInterval(monitor, DEFAULT_CHECK_INTERVAL);
        setInterval(() => {
            if (isActive) {
                simulateActivity();
                if (timeoutConfig) sendKeepAlive();
            }
        }, DEFAULT_ACTIVITY_INTERVAL * Math.random() + DEFAULT_ACTIVITY_INTERVAL / 2); // Jitter for realism

        log('Script initialized');
    }

    // Run init after DOM loaded
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();