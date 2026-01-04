// ==UserScript==
// @name         Youtube Mass Unsubscribe Tool | UNSUBSCRIBE ALL
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds checkboxes (auto-checked), per-channel Unsubscribe buttons, and a neon-green "Unsubscribe Selected" bulk button on /feed/channels. After each bulk unsub, its checkbox is unchecked automatically.
// @author       You
// @match        https://www.youtube.com/feed/channels*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554790/Youtube%20Mass%20Unsubscribe%20Tool%20%7C%20UNSUBSCRIBE%20ALL.user.js
// @updateURL https://update.greasyfork.org/scripts/554790/Youtube%20Mass%20Unsubscribe%20Tool%20%7C%20UNSUBSCRIBE%20ALL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("[YMUT] Script loaded");

    // ---- Helpers ----
    function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

    function simulateClick(element) {
        if (element) {
            const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            });
            element.dispatchEvent(event);
        }
    }

    // ---- Core Unsubscribe for a single channel card ----
    async function unsubscribeChannel(channel) {
        try {
            const dropdownButton =
                channel.querySelector("#notification-preference-button button") ||
                channel.querySelector("#notification-button button") ||
                channel.querySelector("#menu-button button") ||
                channel.querySelector('button[aria-label*="Options"]');

            if (!dropdownButton) {
                console.warn("[YMUT] No dropdown/menu button found in channel card — skipping.");
                return false;
            }

            simulateClick(dropdownButton);
            await sleep(300);

            // Find "Unsubscribe" menu item (YT moves this around a lot, so be generous)
            const unsubscribeMenuItem = [...document.querySelectorAll("tp-yt-paper-item, ytd-menu-navigation-item-renderer, ytd-menu-service-item-renderer, yt-formatted-string")]
                .find(el => (el.textContent || "").trim().toLowerCase() === "unsubscribe");

            if (!unsubscribeMenuItem) {
                console.warn("[YMUT] 'Unsubscribe' item not found — skipping.");
                // try to close any open menu
                document.body.click();
                return false;
            }

            simulateClick(unsubscribeMenuItem);
            await sleep(300);

            // Confirm popup
            const confirmButton =
                document.querySelector("#confirm-button button") ||
                document.querySelector("ytd-dialog #confirm-button button") ||
                document.querySelector("tp-yt-paper-button[dialog-confirm]");

            if (confirmButton) {
                simulateClick(confirmButton);
                await sleep(250);
                console.log("[YMUT] Unsubscribed successfully!");
                return true;
            } else {
                console.warn("[YMUT] Confirm button not found — skipping.");
                return false;
            }
        } catch (e) {
            console.error("[YMUT] Error in unsubscribeChannel:", e);
            return false;
        }
    }

    // ---- Bulk unsubscribe for all checked boxes ----
    async function unsubscribeSelectedChannels() {
        console.log("[YMUT] Bulk unsub: starting…");

        // capture the current set of checked boxes (static NodeList snapshot)
        const selectedCheckboxes = document.querySelectorAll('.custom-unsubscribe-checkbox:checked');

        let processed = 0;
        for (const checkbox of selectedCheckboxes) {
            const channel = checkbox.closest('ytd-channel-renderer');
            if (!channel) continue;

            const titleEl = channel.querySelector('#channel-info #text, a#main-link, a.yt-simple-endpoint');
            const name = titleEl ? (titleEl.textContent || '').trim() : 'Unknown Channel';
            console.log(`[YMUT] Unsubscribing: ${name}`);

            const ok = await unsubscribeChannel(channel);
            // Uncheck this box afterward so it won't be processed again
            checkbox.checked = false;

            processed++;
            console.log(`[YMUT] ${ok ? "✔" : "✖"} (${processed}/${selectedCheckboxes.length})`);
            // pacing delay to be gentle with YT
            await sleep(500);
        }

        console.log("[YMUT] Bulk unsub: done.");
    }

    // ---- Ensure the floating bulk button exists (neon green) ----
    function ensureUnsubscribeSelectedButton() {
        let unsubscribeButton = document.querySelector('#custom-unsubscribe-button');

        if (!unsubscribeButton) {
            unsubscribeButton = document.createElement('button');
            unsubscribeButton.id = 'custom-unsubscribe-button';
            unsubscribeButton.textContent = "Unsubscribe Selected";

            // Neon green + hover slightly darker for contrast
            unsubscribeButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #00FF00;
                color: #000000;
                border: none;
                padding: 12px 20px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 6px;
                box-shadow: 0px 2px 8px rgba(0,0,0,0.3);
                z-index: 999999;
                transition: background-color .2s ease, transform .05s ease;
            `;
            unsubscribeButton.addEventListener('mouseenter', () => {
                unsubscribeButton.style.backgroundColor = '#00CC00';
            });
            unsubscribeButton.addEventListener('mouseleave', () => {
                unsubscribeButton.style.backgroundColor = '#00FF00';
            });
            unsubscribeButton.addEventListener('mousedown', () => {
                unsubscribeButton.style.transform = 'scale(0.98)';
            });
            unsubscribeButton.addEventListener('mouseup', () => {
                unsubscribeButton.style.transform = 'scale(1)';
            });

            unsubscribeButton.addEventListener('click', unsubscribeSelectedChannels);
            document.body.appendChild(unsubscribeButton);
            console.log("[YMUT] Floating bulk button added.");
        }
    }

    // ---- Inject per-channel UI (button + checkbox) ----
    function addUnsubscribeUI() {
        // Process all visible channel renderers
        document.querySelectorAll('ytd-channel-renderer').forEach(channel => {
            // Per-channel red "Unsubscribe" button (kept as-is)
            if (!channel.querySelector('.custom-unsubscribe-button')) {
                const unsubscribeButton = document.createElement('button');
                unsubscribeButton.className = 'custom-unsubscribe-button';
                unsubscribeButton.textContent = "Unsubscribe";

                unsubscribeButton.style.cssText = `
                    margin-left: 12px;
                    padding: 8px 12px;
                    background-color: #FF0000;
                    color: #FFFFFF;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.2s ease, transform .05s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                `;

                unsubscribeButton.addEventListener('mouseover', () => {
                    unsubscribeButton.style.backgroundColor = '#CC0000';
                });
                unsubscribeButton.addEventListener('mouseout', () => {
                    unsubscribeButton.style.backgroundColor = '#FF0000';
                });
                unsubscribeButton.addEventListener('mousedown', () => {
                    unsubscribeButton.style.transform = 'scale(0.98)';
                });
                unsubscribeButton.addEventListener('mouseup', () => {
                    unsubscribeButton.style.transform = 'scale(1)';
                });

                unsubscribeButton.addEventListener('click', () => unsubscribeChannel(channel));

                const actionButtons = channel.querySelector('#buttons');
                if (actionButtons) {
                    actionButtons.appendChild(unsubscribeButton);
                }
            }

            // Per-channel checkbox (auto-checked)
            if (!channel.querySelector('.custom-unsubscribe-checkbox')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'custom-unsubscribe-checkbox';
                checkbox.checked = true; // auto-check by default

                // slightly larger + pointer
                checkbox.style.cssText = `
                    margin-left: 10px;
                    transform: scale(1.5);
                    cursor: pointer;
                    vertical-align: middle;
                `;

                const actionButtons = channel.querySelector('#buttons');
                if (actionButtons) {
                    actionButtons.appendChild(checkbox);
                }
            }
        });

        // Ensure floating bulk button is present
        ensureUnsubscribeSelectedButton();
    }

    // Initial pass
    addUnsubscribeUI();

    // Keep watching for newly-loaded channels (infinite scroll)
    const observer = new MutationObserver(() => addUnsubscribeUI());
    const pageManager = document.querySelector('ytd-page-manager') || document.body;

    if (pageManager) {
        observer.observe(pageManager, { childList: true, subtree: true });
        console.log("[YMUT] MutationObserver attached.");
    } else {
        console.warn("[YMUT] Could not find page manager to observe.");
    }
})();