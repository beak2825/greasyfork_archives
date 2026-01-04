// ==UserScript==
// @name         Roblox Friends Banned Account Name Revealer
// @namespace    https://github.com/GooglyBlox
// @version      1.2
// @description  Shows real display name and username for banned accounts on friends page
// @author       GooglyBlox
// @match        https://www.roblox.com/users/*/friends*
// @match        https://www.roblox.com/users/friends*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548885/Roblox%20Friends%20Banned%20Account%20Name%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/548885/Roblox%20Friends%20Banned%20Account%20Name%20Revealer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetchUserInfo(userId) {
        try {
            const response = await fetch(`https://users.roblox.com/v1/users/${userId}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error(`Failed to fetch user info for ${userId}:`, error);
        }
        return null;
    }

    async function processDeletedAccounts() {
        const deletedAccounts = document.querySelectorAll('.avatar-card-container.disabled');

        for (const container of deletedAccounts) {
            const listItem = container.closest('.list-item');
            if (!listItem || listItem.dataset.processed) continue;

            const userId = listItem.id;
            if (!userId) continue;

            listItem.dataset.processed = 'true';

            const userInfo = await fetchUserInfo(userId);
            if (userInfo && userInfo.isBanned) {
                const nameElement = container.querySelector('.avatar-name');
                const labelElements = container.querySelectorAll('.avatar-card-label');

                if (nameElement && nameElement.textContent === 'Account Deleted') {
                    nameElement.textContent = userInfo.displayName;
                }

                labelElements.forEach(label => {
                    if (label.textContent.trim() === '@Account Deleted') {
                        label.textContent = ` @${userInfo.name}`;
                    }
                });
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const hasRelevantNodes = Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === 1 &&
                    (node.classList?.contains('avatar-card') || node.querySelector?.('.avatar-card'))
                );
                if (hasRelevantNodes) {
                    shouldProcess = true;
                }
            }
        });

        if (shouldProcess) {
            setTimeout(processDeletedAccounts, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processDeletedAccounts);
    } else {
        processDeletedAccounts();
    }
})();