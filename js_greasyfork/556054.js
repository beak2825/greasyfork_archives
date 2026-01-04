// ==UserScript==
// @name         Archive.org Auto-Resume Upload
// @namespace    https://greasyfork.org/en/scripts/556054-archive-org-auto-resume-upload
// @license      MIT
// @version      1.0
// @description  Automatically clicks the Resume Upload button on the archive.org upload page when an upload fails
// @author       Adam Jensen
// @match        https://archive.org/upload/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556054/Archiveorg%20Auto-Resume%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/556054/Archiveorg%20Auto-Resume%20Upload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_BUTTON_TEXT = 'Resume Uploading';
    const BUTTON_SELECTOR = 'button.js-uploader-resume_upload';
    const MINUTE_IN_MS = 60000;

    // --- Configuration ---
    const CHECK_INTERVAL_MINUTES = 1; // How often to look for the button (in minutes)
    const CLICK_COOLDOWN_MINUTES = 5; // How long to wait before clicking the button again (in minutes)
    // ---------------------

    const CLICK_COOLDOWN_MS = MINUTE_IN_MS * CLICK_COOLDOWN_MINUTES;
    const CHECK_INTERVAL_MS = MINUTE_IN_MS * CHECK_INTERVAL_MINUTES;

    let lastClickTime = 0;

    async function isOnline() {
        try {
            await fetch('https://archive.org/', { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
            return true;
        } catch (error) {
            console.warn("❌ Internet connection check failed.");
            return false;
        }
    }

    async function findAndClickButton() {
        const resumeButton = document.querySelector(BUTTON_SELECTOR);
        const currentTime = Date.now();

        if (resumeButton && resumeButton.textContent.trim() === TARGET_BUTTON_TEXT) {
            if (currentTime - lastClickTime >= CLICK_COOLDOWN_MS) {
                if (await isOnline()) {
                    console.log(`✅ Button found and connection is online. Clicking "${TARGET_BUTTON_TEXT}".`);
                    resumeButton.click();
                    lastClickTime = currentTime;
                } else {
                    console.log(`⚪ Button found, but no internet connection. Skipping click.`);
                }
            } else {
                const timeLeftMS = CLICK_COOLDOWN_MS - (currentTime - lastClickTime);
                const timeLeftMinutes = timeLeftMS / MINUTE_IN_MS;
                console.warn(`⚠️ Button found, but on cooldown. Click skipped. Time remaining: ${timeLeftMinutes.toFixed(2)} minutes.`);
            }
        } else {
            console.log(`⚪ Button not found. Next check in ${CHECK_INTERVAL_MINUTES} minute(s).`);
        }
    }

    setInterval(findAndClickButton, CHECK_INTERVAL_MS);

    console.log(`UserScript started. Checking for button every ${CHECK_INTERVAL_MINUTES} minute(s) with a ${CLICK_COOLDOWN_MINUTES} minute(s) cooldown.`);

})();