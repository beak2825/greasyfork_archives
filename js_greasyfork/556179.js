// ==UserScript==
// @name         Firebase Batch User Deleter
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Automates the UI to batch delete users from the Firebase Authentication page, with an option to exclude specific emails.
// @author       MasuRii
// @match        https://console.firebase.google.com/u/*/project/*/authentication/users*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=firebase.google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556179/Firebase%20Batch%20User%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/556179/Firebase%20Batch%20User%20Deleter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants ---
    const PROCESS_DELAY_MS = 1500; // Wait time after a deletion for the UI to update.

    // --- Helper Functions ---

    /**
     * Pauses execution for a specified duration.
     * @param {number} ms - The number of milliseconds to wait.
     */
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Waits for a specific element to appear in the DOM.
     * @param {string} selector - The CSS selector of the element to wait for.
     * @param {number} timeout - The maximum time to wait in milliseconds.
     * @returns {Promise<Element>} A promise that resolves with the element.
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            let observer = null;
            let timer = null;

            const findElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    if (observer) observer.disconnect();
                    if (timer) clearTimeout(timer);
                    resolve(element);
                    return true;
                }
                return false;
            };

            if (findElement()) return;

            observer = new MutationObserver(findElement);
            observer.observe(document.body, { childList: true, subtree: true });

            timer = setTimeout(() => {
                if (observer) observer.disconnect();
                reject(new Error(`Element not found after ${timeout}ms: ${selector}`));
            }, timeout);
        });
    }

    /**
     * Finds an element by its selector and specific text content.
     * @param {string} selector - The CSS selector to query.
     * @param {string} text - The exact text content to match.
     * @returns {Element|null} The found element or null.
     */
    function findElementByText(selector, text) {
        return Array.from(document.querySelectorAll(selector)).find(el => el.textContent.trim() === text);
    }

    /**
     * Creates and returns the UI elements for the script.
     * @returns {HTMLElement} The container element for the UI.
     */
    function createUI() {
        const container = document.createElement('div');
        container.id = 'batch-deleter-ui';
        container.style.padding = '16px';
        container.style.border = '1px solid #dadce0';
        container.style.borderRadius = '8px';
        container.style.marginBottom = '16px';
        container.style.backgroundColor = '#f8f9fa';

        const title = document.createElement('h3');
        title.textContent = 'Batch User Deleter';
        title.style.marginTop = '0';
        title.style.color = '#202124';
        container.appendChild(title);

        const description = document.createElement('p');
        description.innerHTML = 'Enter comma-separated emails to <b>EXCLUDE</b> from deletion. <br><b>Warning:</b> This process is slow. Do not interact with the page while it is running.';
        description.style.fontSize = '14px';
        description.style.color = '#5f6368';
        container.appendChild(description);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'exclude-emails-input';
        input.placeholder = 'user1@example.com, user2@example.com';
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.marginBottom = '12px';
        input.style.boxSizing = 'border-box';
        container.appendChild(input);

        const button = document.createElement('button');
        button.textContent = 'Start Batch Deletion';
        button.id = 'batch-delete-btn-ui';
        button.style.backgroundColor = '#d93025';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px 16px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '500';
        container.appendChild(button);

        const statusDiv = document.createElement('div');
        statusDiv.id = 'batch-delete-status';
        statusDiv.style.marginTop = '12px';
        statusDiv.style.fontFamily = 'monospace';
        statusDiv.style.color = '#3c4043';
        statusDiv.textContent = 'Ready to start.';
        container.appendChild(statusDiv);

        button.addEventListener('click', () => handleBatchDelete(input, statusDiv));

        return container;
    }

    /**
     * Handles the entire batch deletion process.
     */
    async function handleBatchDelete(inputElement, statusElement) {
        const excludedEmails = inputElement.value.split(',')
            .map(email => email.trim().toLowerCase())
            .filter(email => email.length > 0);

        const userRows = Array.from(document.querySelectorAll('tr.mat-mdc-row.mdc-data-table__row'));
        if (userRows.length === 0) {
            statusElement.textContent = 'No user rows found on the page.';
            return;
        }

        const usersToDelete = userRows.filter(row => {
            const emailCell = row.querySelector('td.cdk-column-identifier .identifier-text');
            if (!emailCell) return true;
            const email = emailCell.textContent.trim().toLowerCase();
            return !excludedEmails.includes(email);
        });

        if (usersToDelete.length === 0) {
            statusElement.textContent = 'No users to delete after applying exclusion list.';
            return;
        }

        const confirmationMessage = `You are about to delete ${usersToDelete.length} user(s) by automating UI clicks.\n\n` +
            'This will be slow and you should not use this browser tab until it is finished.\n\n' +
            'Are you sure you want to proceed?';

        if (!window.confirm(confirmationMessage)) {
            statusElement.textContent = 'Operation cancelled by user.';
            return;
        }

        for (let i = 0; i < usersToDelete.length; i++) {
            const row = usersToDelete[i];
            const email = row.querySelector('td.cdk-column-identifier .identifier-text')?.textContent.trim() || `User #${i + 1}`;
            statusElement.textContent = `[${i + 1}/${usersToDelete.length}] Processing: ${email}`;

            try {
                const menuButton = row.querySelector('button[data-test-id="edit-account-button"]');
                if (!menuButton) throw new Error('Could not find menu button for user.');
                menuButton.click();

                await waitForElement('button[role="menuitem"]');
                const deleteButtonInMenu = findElementByText('button[role="menuitem"]', 'Delete account');
                if (!deleteButtonInMenu) throw new Error('"Delete account" option not found in menu.');
                deleteButtonInMenu.click();

                const confirmButton = await waitForElement('fire-dialog-actions .confirm-button');
                if (confirmButton.textContent.trim() !== 'Delete') throw new Error('Confirmation button text is not "Delete".');
                confirmButton.click();

                await delay(PROCESS_DELAY_MS);

            } catch (error) {
                console.error('Error during deletion process:', error);
                statusElement.textContent = `❌ Error on user ${email}: ${error.message}. Process halted.`;
                return;
            }
        }

        statusElement.textContent = `✅ Success! Processed ${usersToDelete.length} users. Please reload the page if necessary.`;
    }

    /**
     * Injects the UI onto the page when ready.
     */
    function initialize() {
        const observer = new MutationObserver((mutations, obs) => {
            const header = document.querySelector('.user-card-header');
            if (header && !document.getElementById('batch-deleter-ui')) {
                const ui = createUI();
                header.prepend(ui);
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();