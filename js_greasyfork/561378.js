// ==UserScript==
// @name        Genocide Proton Newsletters
// @namespace   Violentmonkey Scripts
// @match       https://mail.proton.me/u/0/views/newsletters*
// @grant       none
// @version     1.1
// @author      -
// @run-at      document-idle
// @description Unsubscribe from all Newsletters in Proton.me
// @downloadURL https://update.greasyfork.org/scripts/561378/Genocide%20Proton%20Newsletters.user.js
// @updateURL https://update.greasyfork.org/scripts/561378/Genocide%20Proton%20Newsletters.meta.js
// ==/UserScript==

async function genocideNewsletters() {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
    while (true) {
        // 1. Find the first unsubscribe button with exact text match
        const unsubButton = Array.from(document.querySelectorAll('button'))
            .find(btn => btn.textContent.trim() === 'Unsubscribe' && btn.offsetParent !== null);

        if (!unsubButton) {
            console.log("Finished: No more 'Unsubscribe' buttons found.");
            break;
        }

        unsubButton.click();
        console.log("Unsubscribe clicked, waiting for popup...");
        await delay(1000);

        // 2. Select 'Trash existing' option
        const trashOption = Array.from(document.querySelectorAll('label, span'))
            .find(el => el.textContent.includes('Trash existing') || el.textContent.includes('Move to Trash'));

        if (trashOption) {
            trashOption.click();
            console.log("Selected 'Trash existing'.");
        }

        // 3. Find confirmation button with retry logic
        let finalConfirmBtn = document.querySelector('button[data-testid="unsubscribe-button"]');

        if (!finalConfirmBtn) {
            console.log("Button not found. Waiting an extra second...");
            await delay(1000);
            finalConfirmBtn = document.querySelector('button[data-testid="unsubscribe-button"]');
        }

        // 4. Final Click and Cooldown
        if (finalConfirmBtn) {
            finalConfirmBtn.click();
            console.log("Final confirmation clicked.");
            await delay(1000); // Wait for the UI to clear the newsletter from the list
        } else {
            console.log("Could not find the confirm button after waiting. Refreshing list...");
            // If it gets stuck, we click elsewhere or just wait to avoid a loop
            await delay(2000);
        }
    }
}

setTimeout(genocideNewsletters, 3000);
