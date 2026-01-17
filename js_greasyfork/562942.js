// ==UserScript==
// @name         JavDB Fast Watch (Tag-Proximity Edition)
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Uses proximity to status tags to find the correct Delete button.
// @author       Gemini
// @match        https://javdb.com/v/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562942/JavDB%20Fast%20Watch%20%28Tag-Proximity%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562942/JavDB%20Fast%20Watch%20%28Tag-Proximity%20Edition%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BTN_ID = 'fast-watch-trigger';
    let isProcessing = false;

    const log = (msg) => console.log(`%c[FastWatch] ${msg}`, 'color: #00d1b2; font-weight: bold;');

    const init = () => {
        const container = document.querySelector('.review-buttons');
        if (!container || document.getElementById(BTN_ID)) return;

        const fastBtn = document.createElement('a');
        fastBtn.id = BTN_ID;
        fastBtn.className = 'button is-primary is-small';
        fastBtn.style.marginLeft = '10px';
        fastBtn.innerHTML = `<span class="icon is-small"><i class="fas fa-bolt"></i></span><span>Fast Watch</span>`;

        fastBtn.onclick = async (e) => {
            e.preventDefault();
            if (isProcessing) return;

            isProcessing = true;
            fastBtn.classList.add('is-loading');

            try {
                await executeLogic();
            } catch (err) {
                log(`Error: ${err.message}`);
            } finally {
                isProcessing = false;
                fastBtn.classList.remove('is-loading');
            }
        };

        container.appendChild(fastBtn);
    };

    async function executeLogic() {
        // 1. Force-bypass all confirmation popups
        window.confirm = () => true;

        // 2. Identify the Status Tags by their text content (more reliable)
        const allTags = Array.from(document.querySelectorAll('.review-title .tag'));
        const watchedTag = allTags.find(el => el.textContent.includes('watched this movie'));
        const wantTag = allTags.find(el => el.textContent.includes('want to watch'));

        // 3. Helper to find the Delete button associated with a tag
        const getDeleteBtnForTag = (tag) => {
            if (!tag) return null;
            // Look in the same column/parent area for a button with "Delete" text
            const parentSection = tag.closest('.column') || tag.closest('.review-buttons');
            return Array.from(parentSection.querySelectorAll('a.is-danger, button.is-danger'))
                        .find(btn => btn.textContent.includes('Delete'));
        };

        // --- CASE A: CURRENTLY WATCHED -> REMOVE ---
        if (watchedTag) {
            log("Detected: WATCHED state.");
            const deleteBtn = getDeleteBtnForTag(watchedTag);
            if (deleteBtn) {
                log("Clicking Watched Delete button...");
                deleteBtn.click();
            } else {
                log("Watched tag found, but couldn't find the Delete button near it.");
            }
            return; // EXIT immediately
        }

        // --- CASE B: CURRENTLY WANTED -> UPGRADE TO WATCHED ---
        if (wantTag) {
            log("Detected: WANT state.");
            const deleteBtn = getDeleteBtnForTag(wantTag);
            if (deleteBtn) {
                log("Removing from Wanted list first...");
                deleteBtn.click();

                // Wait for the list to clear so the "Watched" trigger appears
                log("Waiting for Watched trigger...");
                await new Promise(r => setTimeout(r, 1200));
            }
            // Continue to Case C...
        }

        // --- CASE C: MARK AS WATCHED ---
        // Find the button that opens the review modal
        // It's usually the one that ISN'T a delete button and is in the "Watched" area
        const watchedArea = document.querySelectorAll('.review-buttons .column')[1] || document.querySelector('.review-buttons');
        const watchTrigger = Array.from(watchedArea.querySelectorAll('a.button, button.button'))
                                  .find(btn => !btn.classList.contains('is-danger') && btn.id !== BTN_ID);

        if (watchTrigger) {
            log("Opening watch modal...");
            watchTrigger.click();
            await handleModalSubmit();
        } else {
            log("Could not find the 'Mark Watched' button.");
        }
    }

    async function handleModalSubmit() {
        for (let i = 0; i < 30; i++) {
            const submitBtn = document.querySelector('#new_review input[type="submit"], #review-save, .review-submit-btn input');
            if (submitBtn) {
                log("Modal found. Saving...");
                submitBtn.click();
                return;
            }
            await new Promise(r => setTimeout(r, 150));
        }
        log("Modal timeout.");
    }

    // Handle AJAX/Dynamic page updates
    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
    init();

})();