// ==UserScript==
// @name		Green Man Gaming Bundle Keys Copier
// @description		Copies all game names and keys to clipboard
// @version		1.0.1
// @license             MIT
// @match		https://*.greenmangamingbundles.com/*
// @icon		https://www.greenmangamingbundles.com/static/images/favicons/black/favicon-32x32.png
// @namespace https://greasyfork.org/users/46469
// @downloadURL https://update.greasyfork.org/scripts/553300/Green%20Man%20Gaming%20Bundle%20Keys%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/553300/Green%20Man%20Gaming%20Bundle%20Keys%20Copier.meta.js
// ==/UserScript==
(function() {
    'use strict';

    async function init() {
        console.log('Green Man Gaming Bundle Keys Copier initialized');
        
        // Wait for the keys section to be available
        const keysSection = await waitForElement('#keys-section');
        if (!keysSection) {
            console.error('Keys section not found');
            return;
        }

        // Create and add the copy button
        createCopyButton();
    }

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    function createCopyButton() {
        // Find the header section where we'll add the button
        const headerSection = document.querySelector('#keys-section .row.pb-1 .d-flex');
        if (!headerSection) {
            console.error('Header section not found');
            return;
        }

        // Create the copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'btn btn-primary btn-sm';
        copyButton.textContent = 'Copy All Games & Keys';
        copyButton.style.cssText = 'white-space: nowrap;';
        
        copyButton.addEventListener('click', async () => {
            await copyAllGamesAndKeys(copyButton);
        });

        // Add the button to the header
        headerSection.appendChild(copyButton);
        console.log('Copy button added successfully');
    }

    async function copyAllGamesAndKeys(button) {
        try {
            // Find all game items
            const gameItems = document.querySelectorAll('.item-list');
            
            if (gameItems.length === 0) {
                console.error('No game items found');
                button.textContent = 'No games found!';
                setTimeout(() => {
                    button.textContent = 'Copy All Games & Keys';
                }, 2000);
                return;
            }

            let textToCopy = '';

            // Extract game name and key from each item
            gameItems.forEach((item, index) => {
                const gameName = item.querySelector('.title h3')?.textContent.trim();
                const gameKey = item.querySelector('.key-data span')?.textContent.trim();

                if (gameName && gameKey) {
                    textToCopy += `${gameName}: ${gameKey}\n`;
                    console.log(`Found game ${index + 1}: ${gameName} - ${gameKey}`);
                }
            });

            if (textToCopy) {
                // Copy to clipboard using GM API
                await GM.setClipboard(textToCopy.trim());
                console.log('Copied to clipboard:', textToCopy);
                
                // Update button text to show success
                const originalText = button.textContent;
                button.textContent = `✓ Copied ${gameItems.length} games!`;
                button.style.backgroundColor = '#28a745';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                }, 2000);
            } else {
                console.error('No game data found');
                button.textContent = 'No data found!';
                setTimeout(() => {
                    button.textContent = 'Copy All Games & Keys';
                }, 2000);
            }

        } catch (error) {
            console.error('Error copying games and keys:', error);
            button.textContent = 'Error!';
            setTimeout(() => {
                button.textContent = 'Copy All Games & Keys';
            }, 2000);
        }
    }

    // Start the extension
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();