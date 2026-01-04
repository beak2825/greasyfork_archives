// ==UserScript==
// @name         runnan
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  SBC Autofill with player swapping
// @license      MIT
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.easports.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.ea.com/*/ea-sports-fc/ultimate-team/web-app/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560376/runnan.user.js
// @updateURL https://update.greasyfork.org/scripts/560376/runnan.meta.js
// ==/UserScript==

/*
 * Script Usage Disclaimer
 *
 * This script is provided "as is," without warranty of any kind, express or implied.
 * The author shall not be liable for any damages arising out of the use of this script.
 * Use at your own risk and in compliance with the target site's terms of service and applicable laws.
 */
(function () {
    'use strict';
    let page = unsafeWindow;

    // Utility: sleep function
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    // Utility: simulate click on element
    function simulateClick(el) {
        if (!el) {
            console.log('[SBC Autofill] Element not found for click');
            return false;
        }
        const r = el.getBoundingClientRect();
        ['mousedown', 'mouseup', 'click'].forEach(t =>
            el.dispatchEvent(new MouseEvent(t, {
                bubbles: true, cancelable: true,
                clientX: r.left + r.width / 2,
                clientY: r.top + r.height / 2,
                button: 0
            }))
        );
        return true;
    }

    // Utility: wait for element to appear
    function waitForElement(selector, timeout = 5000) {
        return new Promise(resolve => {
            const start = Date.now();
            (function poll() {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                if (Date.now() - start > timeout) return resolve(null);
                setTimeout(poll, 200);
            })();
        });
    }

    // Main SBC autofill function
    async function sbcAutofill() {
        console.log('[SBC Autofill] Starting...');

        // Step 1: Click SBC squad autofill button
        const autofillBtn = Array.from(document.querySelectorAll('button.btn-standard.call-to-action')).find(btn => btn.textContent === 'SBC squad autofill');
        if (!autofillBtn) {
            console.log('[SBC Autofill] Autofill button not found');
            return;
        }
        console.log('[SBC Autofill] Clicking autofill button');
        simulateClick(autofillBtn);
        await sleep(1000);

        // Step 2: Click modal confirmation button (OK button)
        const confirmBtn = await waitForElement('body > div.view-modal-container.form-modal > section > div > div > button:nth-child(1)', 3000);
        if (confirmBtn) {
            console.log('[SBC Autofill] Clicking OK button');
            simulateClick(confirmBtn);
            await sleep(5000); // Wait 5 seconds for squad to load
        }

        // Step 3: Loop through 11 players (div:nth-child(2) through div:nth-child(12))
        for (let i = 2; i <= 12; i++) {
            console.log(`[SBC Autofill] Processing player slot ${i - 1}/11`);

            // Click player slot (use partial class match to handle different formations)
            const playerSelector = `body > main > section > section > div.ut-navigation-container-view--content > div > div > div > div.ut-draggable > div.ut-squad-pitch-view.concept.sbc > div:nth-child(${i})`;
            const playerSlot = document.querySelector(playerSelector);
            if (!playerSlot) {
                console.log(`[SBC Autofill] Player slot ${i} not found, skipping`);
                continue;
            }
            simulateClick(playerSlot);
            await sleep(1000);

            // Step 4.1: Check for "Swap Meets Requirements Players" button
            const swapBtnSpan = Array.from(document.querySelectorAll('span.btn-text')).find(span => span.textContent === 'Swap Meets Requirements Players');

            if (swapBtnSpan) {
                console.log('[SBC Autofill] Found Swap button, clicking');
                const swapBtn = swapBtnSpan.closest('button');
                if (swapBtn) {
                    simulateClick(swapBtn);
                    await sleep(1000);

                    // Step 4.2: Try up to 5 items in list, skip FSU locked, academy graduate, or rating >= 84
                    const listBase = 'body > main > section > section > div.ut-navigation-container-view--content > div > div > section > div.ut-navigation-container-view--content > div > div.paginated-item-list.ut-pinned-list > ul > li';

                    for (let j = 1; j <= 5; j++) {
                        const itemBtn = document.querySelector(`${listBase}:nth-child(${j}) > button`);
                        const ratingEl = document.querySelector(`${listBase}:nth-child(${j}) > div > div.entityContainer > div.small.player.item > div.ut-item-view--main.ut-item-view > div > div.rating`);
                        const fsuLocked = document.querySelector(`${listBase}:nth-child(${j}) > div > div.entityContainer > div.name.fsulocked`);
                        const academyGraduate = document.querySelector(`${listBase}:nth-child(${j}) > div > div.entityContainer > div.small.player.item > div.ut-item-player-state-indicator-view.academy-graduate`);

                        if (!itemBtn) {
                            console.log(`[SBC Autofill] Item ${j} not found, stopping search`);
                            break;
                        }

                        if (fsuLocked) {
                            console.log(`[SBC Autofill] Item ${j} - FSU locked, trying next`);
                            continue;
                        }
                        if (academyGraduate) {
                            console.log(`[SBC Autofill] Item ${j} - Academy graduate, trying next`);
                            continue;
                        }
                        if (ratingEl) {
                            const rating = parseInt(ratingEl.textContent, 10);
                            if (rating >= 84) {
                                console.log(`[SBC Autofill] Item ${j} - rating ${rating} >= 84, trying next`);
                                continue;
                            }
                            console.log(`[SBC Autofill] Clicking item ${j} (rating: ${rating})`);
                            simulateClick(itemBtn);
                            await sleep(1000);
                            break; // Found valid player, exit loop
                        }
                    }
                }
            } else {
                console.log('[SBC Autofill] No Swap button found for this slot');
            }
        }

        console.log('[SBC Autofill] Complete!');
    }

    // Initialize single button
    function initButton() {
        const btn = document.createElement('button');
        btn.textContent = 'SBC Autofill';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            padding: '10px 20px',
            background: '#ffd700',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 9999
        });
        btn.addEventListener('click', sbcAutofill);
        document.body.appendChild(btn);
        console.log('[SBC Autofill] Button initialized');
    }

    page.addEventListener('load', initButton);
})();
