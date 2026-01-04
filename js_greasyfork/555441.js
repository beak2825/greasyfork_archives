// ==UserScript==
// @name         owo.vg Automated Post Queue Bot (Page Trigger) (WORKING BACKUP)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Automates posting a queue of messages to owo.vg/pol/ only when the thread page count reaches 9.
// @author       You
// @match        https://owo.vg/pol/thread/a*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555441/owovg%20Automated%20Post%20Queue%20Bot%20%28Page%20Trigger%29%20%28WORKING%20BACKUP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555441/owovg%20Automated%20Post%20Queue%20Bot%20%28Page%20Trigger%29%20%28WORKING%20BACKUP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = "[owo.vg-AutoBot]";
    const SUCCESS_MESSAGE = "Post successful";
    const TARGET_PAGE_COUNT = '9';

    // --- Configuration ---
    const POST_QUEUE = [
"",
""
    ];

    // --- State Variables ---
    let postAttemptCount = 0;
    const MAX_POST_ATTEMPTS = 5;
    const MAX_CAPTCHA_WAIT_MS = 86400000; // 24 hours

    let statusPoller = null;
    let currentPostText = "";
    let successObserver = null;
    let isMonitoring = false;
    let hasPostedOnCurrentPage = false;

    console.log(`${LOG_PREFIX} Script started. ${POST_QUEUE.length} posts queued. Waiting for page count to reach ${TARGET_PAGE_COUNT}.`);

    // ========================================================================
    // --- Utility Functions (Must be defined before they are called) ---
    // ========================================================================

    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function waitForElm(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const immediateElm = document.querySelector(selector);
            if (immediateElm) {
                return resolve(immediateElm);
            }
            const observer = new MutationObserver(mutations => {
                const foundElm = document.querySelector(selector);
                if (foundElm) {
                    observer.disconnect();
                    resolve(foundElm);
                }
                if (Date.now() - startTime > timeout) {
                    observer.disconnect();
                    reject(new Error(`${LOG_PREFIX} Timeout waiting for element: ${selector}`));
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                 if (!document.querySelector(selector)) {
                    observer.disconnect();
                    reject(new Error(`${LOG_PREFIX} Timeout (primary) waiting for element: ${selector}`));
                }
            }, timeout + 50);
        });
    }

    // ========================================================================
    // --- Forward Declarations (To resolve circular dependency issues) ---
    // ========================================================================
    // Declaring these functions here allows them to call each other regardless of order
    // as long as the definitions appear later.
    function setupSuccessObserver() { /* ... */ }
    function endCycle(reason) { /* ... */ }
    function checkPageCountAndPost() { /* ... */ }
    function setupThreadStatsObserver() { /* ... */ }
    function openQuickReply() { /* ... */ }
    function fillAndSubmit() { /* ... */ }
    function checkPostStatus() { /* ... */ }
    function startPostCycle() { /* ... */ }

    // ========================================================================
    // --- Function Definitions ---
    // ========================================================================

    function setupSuccessObserver() {
        if (successObserver) return;

        successObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!mutation.addedNodes) return;

                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if ((node.nodeType === 3 && node.nodeValue.includes(SUCCESS_MESSAGE)) ||
                        (node.nodeType === 1 && node.textContent.includes(SUCCESS_MESSAGE))) {

                        if (isMonitoring) {
                            endCycle(`Detected success message: "${SUCCESS_MESSAGE}"`);
                        }
                        return;
                    }
                }
            });
        });
        successObserver.observe(document.body, { childList: true, subtree: true });
        console.log(`${LOG_PREFIX} Attached success observer to document body.`);
    }

    function endCycle(reason) {
        if (statusPoller) {
            clearInterval(statusPoller);
            statusPoller = null;
        }

        isMonitoring = false;
        postAttemptCount = 0;
        hasPostedOnCurrentPage = true;

        console.log(`${LOG_PREFIX} POST CYCLE ENDED: ${reason} (Posted: "${currentPostText.substring(0, 30)}...")`);

        if (POST_QUEUE.length === 0) {
            console.log(`${LOG_PREFIX} ALL POSTS COMPLETE. Script finished.`);
            if (successObserver) successObserver.disconnect();
            const threadStatsObserver = window.__threadStatsObserver;
            if (threadStatsObserver) threadStatsObserver.disconnect();
            return;
        }

        console.log(`${LOG_PREFIX} Waiting for thread page count to drop below ${TARGET_PAGE_COUNT} and return.`);
    }

    // --- Thread Stats Monitoring ---

    function checkPageCountAndPost() {
        if (isMonitoring || POST_QUEUE.length === 0) {
            return;
        }

        const pageCountEl = document.getElementById('page-count');
        if (!pageCountEl) {
            return;
        }

        const currentPageCount = pageCountEl.textContent.trim();

        if (currentPageCount === TARGET_PAGE_COUNT) {
            if (!hasPostedOnCurrentPage) {
                console.log(`\n${LOG_PREFIX} --- THREAD CONDITION MET: Page count is ${TARGET_PAGE_COUNT}. Starting post cycle... ---`);
                startPostCycle();
            }
        } else {
             if (hasPostedOnCurrentPage) {
                 hasPostedOnCurrentPage = false;
                 console.log(`${LOG_PREFIX} Page count reset to ${currentPageCount}. Next post is ready for page ${TARGET_PAGE_COUNT}.`);
             }
        }
    }

    function setupThreadStatsObserver() {
        const threadStatsEl = document.getElementById('thread-stats');
        if (!threadStatsEl) {
            setTimeout(setupThreadStatsObserver, 1000);
            return;
        }

        const observer = new MutationObserver(checkPageCountAndPost);
        observer.observe(threadStatsEl, { childList: true, subtree: true, characterData: true });
        window.__threadStatsObserver = observer;
        console.log(`${LOG_PREFIX} Attached observer to #thread-stats. Starting initial check.`);

        checkPageCountAndPost();
    }


    // --- Post Automation Logic ---

    async function openQuickReply() {
        console.log(`${LOG_PREFIX} Step 1: Attempting to open Quick Reply via direct 4chan X call...`);
        const QR_WAIT_MS = 7000;
        const startTime = Date.now();

        const qrPoller = setInterval(() => {
            if (window.QR && typeof window.QR === 'object' && typeof window.QR.open === 'function') {
                clearInterval(qrPoller);

                try {
                    window.QR.open();
                    console.log(`${LOG_PREFIX} Step 1: QR.open() successfully executed.`);

                    if (window.QR.nodes && window.QR.nodes.com && typeof window.QR.nodes.com.focus === 'function') {
                        window.QR.nodes.com.focus();
                        console.log(`${LOG_PREFIX} Text area focused via QR.nodes.com.focus().`);
                    }

                    setTimeout(fillAndSubmit, 100);

                } catch (error) {
                    console.error(`${LOG_PREFIX} Step 1 Error: QR.open() call failed.`, error);
                    endCycle("QR.open() call failed.");
                }
            } else if (Date.now() - startTime > QR_WAIT_MS) {
                clearInterval(qrPoller);
                console.error(`${LOG_PREFIX} Step 1 Error: Timeout waiting for global 4chan X 'QR' object (max wait: ${QR_WAIT_MS/1000}s).`);

                console.warn(`${LOG_PREFIX} Fallback: Attempting click simulation...`);
                const selector = '#shortcut-qr > a:nth-child(1)';
                const qrShortcut = document.querySelector(selector);
                if (qrShortcut) {
                    const options = {bubbles: true, cancelable: true, view: window};
                    qrShortcut.dispatchEvent(new MouseEvent('mousedown', options));
                    qrShortcut.dispatchEvent(new MouseEvent('mouseup', options));
                    qrShortcut.dispatchEvent(new MouseEvent('click', options));
                    console.log(`${LOG_PREFIX} Fallback: Quick Reply shortcut simulated click dispatched. Proceeding to fill/submit.`);
                    setTimeout(fillAndSubmit, 1000);
                } else {
                     console.error(`${LOG_PREFIX} Fallback failed: QR shortcut button not found.`);
                     endCycle("QR shortcut button not found in fallback.");
                }
            } else {
                 console.log(`${LOG_PREFIX} Step 1: Waiting for 4chan X 'QR' object to load...`);
            }
        }, 500);
    }

    async function fillAndSubmit() {
        const postText = currentPostText;
        const TEXTAREA_WAIT_MS = 10000;

        const textareaSelector = 'div.textarea > textarea[data-name="com"].field';
        console.log(`${LOG_PREFIX} Step 2: Attempting to find and fill text area...`);
        try {
            const textArea = await waitForElm(textareaSelector, TEXTAREA_WAIT_MS);
            textArea.value = postText;
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            console.log(`${LOG_PREFIX} Step 2: Text area filled with: "${postText}"`);

            const submitButtonSelector = 'input.qr-button:nth-child(2)';
            const submitButton = document.querySelector(submitButtonSelector);
            if (submitButton) {
                console.log(`${LOG_PREFIX} Step 3: Initial submit button found. Clicking...`);
                submitButton.click();

                console.log(`${LOG_PREFIX} Step 3: Initial submit clicked. Starting long-poll check.`);
                postAttemptCount = 0;
                checkPostStatus();

            } else {
                console.error(`${LOG_PREFIX} Step 3 Error: Initial submit button not found.`);
                endCycle("Initial submit button not found.");
            }

        } catch (error) {
            console.error(`${LOG_PREFIX} Step 2/3 Error: Could not find text area or submit button.`, error);
            endCycle("Could not find text area or submit button.");
        }
    }


    function checkPostStatus() {
        if (postAttemptCount >= MAX_POST_ATTEMPTS) {
            console.error(`${LOG_PREFIX} Exceeded max post attempts (${MAX_POST_ATTEMPTS}). Stopping current cycle.`);
            endCycle("Exceeded max post attempts.");
            return;
        }

        const pollInterval = 1000;
        const maxPollDuration = MAX_CAPTCHA_WAIT_MS;
        const startTime = Date.now();
        let captchaSubmitClicked = false;

        statusPoller = setInterval(async () => {

            if (Date.now() - startTime > maxPollDuration) {
                console.warn(`${LOG_PREFIX} Polling timeout reached (${maxPollDuration/60000} minutes). QR still visible. Stopping polling.`);
                endCycle("Polling timeout reached.");
                return;
            }

            const captchaSubmitSelector = '#captcha-root > div:nth-child(1) > div:nth-child(2) > input:nth-child(2)';
            const captchaSubmitButton = document.querySelector(captchaSubmitSelector);

            if (captchaSubmitButton && !captchaSubmitButton.disabled) {
                if (!captchaSubmitClicked) {
                    captchaSubmitClicked = true;
                    const delay = getRandomDelay(1000, 3000);

                    console.log(`${LOG_PREFIX} Step 5: Captcha submit button found and is enabled. Waiting ${delay / 1000}s before clicking...`);

                    setTimeout(() => {
                        if (!isMonitoring) { return; }

                        if (captchaSubmitButton && !captchaSubmitButton.disabled) {
                             captchaSubmitButton.click();
                             postAttemptCount++;
                             console.log(`${LOG_PREFIX} Step 5: Click dispatched after ${delay / 1000}s delay. (Attempt: ${postAttemptCount})`);

                             setTimeout(() => {
                                 captchaSubmitClicked = false;
                                 if (isMonitoring) {
                                     console.log(`${LOG_PREFIX} Step 5: Post did not submit immediately. Resuming poll...`);
                                 }
                             }, 2000);
                        } else {
                            captchaSubmitClicked = false;
                        }
                    }, delay);
                } else {
                    console.log(`${LOG_PREFIX} Step 5: Captcha button is ready but waiting for click or cooldown...`);
                }
            } else if (captchaSubmitButton) {
                console.log(`${LOG_PREFIX} Step 4/6: Captcha element visible, waiting for auto-solve and button to become enabled... (Elapsed: ${(Date.now() - startTime)/1000}s)`);
            } else {
                const qrElement = document.getElementById('qr');
                if (qrElement && qrElement.style.display !== 'none') {
                    console.log(`${LOG_PREFIX} Status Check: QR visible, no captcha button found. Waiting... (Elapsed: ${(Date.now() - startTime)/1000}s)`);
                }
            }
        }, pollInterval);
    }

    function startPostCycle() {
        if (isMonitoring) {
            console.warn(`${LOG_PREFIX} Post cycle already running. Aborting new cycle start.`);
            return;
        }

        if (POST_QUEUE.length === 0) {
            console.log(`${LOG_PREFIX} POST QUEUE IS EMPTY. No more posts to make.`);
            return;
        }

        currentPostText = POST_QUEUE.shift();
        isMonitoring = true;
        console.log(`\n${LOG_PREFIX} --- NEW POST CYCLE STARTED (Remaining: ${POST_QUEUE.length}) ---`);
        openQuickReply();
    }

    // --- Execution Start ---

    if (window.location.href.startsWith('https://owo.vg/pol/thread/')) {
        setupSuccessObserver();
        setupThreadStatsObserver();
    } else {
        console.log(`${LOG_PREFIX} Not on a thread page (https://owo.vg/pol/thread/*). Script inactive.`);
    }
})();