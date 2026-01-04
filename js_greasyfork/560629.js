// ==UserScript==
// @name         Change bell on all channels
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Batch disable or set to personalized notifications for all subscribed channels on YouTube
// @author       D3SOX
// @license      GPL-3.0
// @match        *://youtube.com/feed/channels*
// @match        *://www.youtube.com/feed/channels*
// @grant        GM_registerMenuCommand
// @icon         https://icons.duckduckgo.com/ip3/youtube.com.ico
// @homepageURL  https://github.com/D3SOX/userscripts
// @supportURL   https://github.com/D3SOX/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/560629/Change%20bell%20on%20all%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/560629/Change%20bell%20on%20all%20channels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to wait for an element to appear
    function waitForElement(selector, timeout = 5000, parent = document) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            // Check if element already exists
            const existingElement = parent.querySelector(selector);
            if (existingElement) {
                resolve(existingElement);
                return;
            }

            // Use MutationObserver for efficient watching
            const observer = new MutationObserver((mutations, obs) => {
                const element = parent.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    obs.disconnect();
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                }
            });

            observer.observe(parent, {
                childList: true,
                subtree: true
            });

            // Fallback timeout
            setTimeout(() => {
                observer.disconnect();
                const element = parent.querySelector(selector);
                if (element) {
                    resolve(element);
                } else {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                }
            }, timeout);
        });
    }

    // Helper function to wait for an element to be removed
    function waitForElementRemoval(selector, timeout = 5000, parent = document) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            // Check if element doesn't exist
            if (!parent.querySelector(selector)) {
                resolve();
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                if (!parent.querySelector(selector)) {
                    obs.disconnect();
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    obs.disconnect();
                    reject(new Error(`Element ${selector} still exists after ${timeout}ms`));
                }
            });

            observer.observe(parent, {
                childList: true,
                subtree: true
            });

            // Fallback timeout
            setTimeout(() => {
                observer.disconnect();
                if (!parent.querySelector(selector)) {
                    resolve();
                } else {
                    reject(new Error(`Element ${selector} still exists after ${timeout}ms`));
                }
            }, timeout);
        });
    }

    // Helper function to sleep/delay
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Check if spinner is visible
    function isSpinnerVisible() {
        const spinner = document.querySelector('#spinnerContainer');
        if (!spinner) return false;
        const display = spinner.style.display;
        return display === '' || display === 'block' || display === 'flex';
    }

    // Wait for spinner to become visible
    async function waitForSpinnerVisible(timeout = 3000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (isSpinnerVisible()) {
                return true;
            }
            await sleep(100);
        }
        return false;
    }

    // Wait for spinner to become hidden
    async function waitForSpinnerHidden(timeout = 10000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (!isSpinnerVisible()) {
                return true;
            }
            await sleep(100);
        }
        return false;
    }

    // Load all subscriptions by scrolling and waiting for spinner
    async function loadAllSubscriptions() {
        console.log('Starting to load all subscriptions...');
        let previousChannelCount = 0;
        let noNewChannelsCount = 0;
        const maxNoNewChannels = 2; // Stop after 2 consecutive scrolls with no new channels

        while (noNewChannelsCount < maxNoNewChannels) {
            // Scroll to bottom
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'auto'
            });

            await sleep(800); // Wait for scroll to complete

            // Check if spinner appears
            const spinnerAppeared = await waitForSpinnerVisible(2000);
            
            if (spinnerAppeared) {
                console.log('Spinner appeared, waiting for it to disappear...');
                await waitForSpinnerHidden(10000);
                console.log('Spinner disappeared, new content loaded');
            } else {
                console.log('No spinner appeared, might be at the end');
            }

            // Count current channels
            const currentChannelCount = document.querySelectorAll('ytd-channel-renderer').length;
            console.log(`Current channel count: ${currentChannelCount}`);

            if (currentChannelCount === previousChannelCount) {
                noNewChannelsCount++;
                console.log(`No new channels (${noNewChannelsCount}/${maxNoNewChannels})`);
            } else {
                noNewChannelsCount = 0; // Reset counter
            }

            previousChannelCount = currentChannelCount;
            await sleep(500); // Small delay before next scroll
        }

        console.log('Finished loading all subscriptions');
    }

    // Find all channels with bell on (all notifications enabled)
    function findChannelsWithBellOn() {
        const channels = [];
        const channelRenderers = document.querySelectorAll('ytd-channel-renderer');

        channelRenderers.forEach((renderer, index) => {
            try {
                // Find the notification button
                const notificationButton = renderer.querySelector('#notification-preference-button button');
                
                if (notificationButton) {
                    const ariaLabel = notificationButton.getAttribute('aria-label') || '';
                    
                    // Check if bell is on (all notifications)
                    if (ariaLabel.toLowerCase().includes('all notifications')) {
                        // Extract channel name
                        const channelNameElement = renderer.querySelector('ytd-channel-name yt-formatted-string#text');
                        const channelName = channelNameElement ? channelNameElement.textContent.trim() : `Channel ${index + 1}`;
                        
                        channels.push({
                            element: renderer,
                            name: channelName,
                            button: notificationButton
                        });
                    }
                }
            } catch (e) {
                console.error(`Error processing channel ${index}:`, e);
            }
        });

        return channels;
    }

    // Show alert dialog (replacement for alert())
    function showAlert(message) {
        return new Promise((resolve) => {
            const dialog = document.createElement('dialog');
            dialog.style.cssText = 'max-width: 400px;';

            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = 'margin-bottom: 20px; white-space: pre-wrap;';
            messageDiv.textContent = message;
            dialog.appendChild(messageDiv);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; justify-content: flex-end;';

            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.onclick = () => {
                dialog.close();
            };

            buttonContainer.appendChild(okButton);
            dialog.appendChild(buttonContainer);

            dialog.addEventListener('close', () => {
                resolve();
                document.body.removeChild(dialog);
            });

            document.body.appendChild(dialog);
            dialog.showModal();
        });
    }

    // Show user confirmation dialog
    function showConfirmationDialog(channelNames) {
        const message = `Found ${channelNames.length} channel(s) with notifications enabled:\n\n${channelNames.slice(0, 20).join('\n')}${channelNames.length > 20 ? `\n... and ${channelNames.length - 20} more` : ''}\n\nWhat would you like to do?`;
        
        return new Promise((resolve) => {
            const dialog = document.createElement('dialog');
            dialog.style.cssText = 'max-width: 500px; max-height: 80vh; overflow-y: auto;';

            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = 'margin-bottom: 20px; white-space: pre-wrap;';
            messageDiv.textContent = message;
            dialog.appendChild(messageDiv);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

            const turnOffButton = document.createElement('button');
            turnOffButton.textContent = 'Turn off for all';
            turnOffButton.onclick = () => {
                dialog.close('none');
            };

            const personalizedButton = document.createElement('button');
            personalizedButton.textContent = 'Set to personalized';
            personalizedButton.onclick = () => {
                dialog.close('personalized');
            };

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.onclick = () => {
                dialog.close('cancel');
            };

            buttonContainer.appendChild(turnOffButton);
            buttonContainer.appendChild(personalizedButton);
            buttonContainer.appendChild(cancelButton);
            dialog.appendChild(buttonContainer);

            dialog.addEventListener('close', () => {
                resolve(dialog.returnValue || 'cancel');
                document.body.removeChild(dialog);
            });

            document.body.appendChild(dialog);
            dialog.showModal();
        });
    }

    // Process a single channel
    async function processChannel(channel, action) {
        try {
            console.log(`Processing channel: ${channel.name}`);

            // Scroll button into view
            channel.button.scrollIntoView({
                behavior: 'auto',
                block: 'center'
            });
            await sleep(300);

            // Click the notification button
            channel.button.click();
            await sleep(200);

            // Wait for popup to appear
            const popup = await waitForElement('ytd-menu-popup-renderer', 3000);
            if (!popup) {
                throw new Error('Popup did not appear');
            }

            await sleep(200); // Small delay for popup to fully render

            // Find the appropriate menu item based on action
            let menuItem = null;
            const menuItems = popup.querySelectorAll('ytd-menu-service-item-renderer');

            for (const item of menuItems) {
                const textElement = item.querySelector('yt-formatted-string');
                if (textElement) {
                    const text = textElement.textContent.trim();
                    
                    if (action === 'none' && text === 'None') {
                        menuItem = item;
                        break;
                    } else if (action === 'personalized' && text === 'Personalized') {
                        menuItem = item;
                        break;
                    }
                }
            }

            if (!menuItem) {
                throw new Error(`Menu item for action "${action}" not found`);
            }

            // Click the menu item
            const clickableItem = menuItem.querySelector('tp-yt-paper-item') || menuItem;
            clickableItem.click();
            await sleep(800); // Wait for action to complete

            console.log(`Successfully processed: ${channel.name}`);
            return true;
        } catch (e) {
            console.error(`Error processing channel ${channel.name}:`, e);
            return false;
        }
    }

    // Show informational notification
    function showInfoNotification(message) {
        return new Promise((resolve) => {
            const dialog = document.createElement('dialog');
            dialog.style.cssText = 'max-width: 400px;';

            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = 'margin-bottom: 20px; white-space: pre-wrap;';
            messageDiv.textContent = message;
            dialog.appendChild(messageDiv);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; justify-content: flex-end;';

            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.onclick = () => {
                dialog.close();
            };

            buttonContainer.appendChild(okButton);
            dialog.appendChild(buttonContainer);

            dialog.addEventListener('close', () => {
                resolve();
                document.body.removeChild(dialog);
            });

            document.body.appendChild(dialog);
            dialog.showModal();
        });
    }

    // Main function to process all channels
    async function processAllChannels() {
        try {
            console.log('Starting process...');

            // Inform user about scrolling
            await showInfoNotification('The script will now scroll to the end of the page to load all your subscriptions.\n\nThis may take a while depending on how many channels you have.\n\nPlease do not interact with the page while this is happening.');

            // Step 1: Load all subscriptions
            await loadAllSubscriptions();

            // Step 2: Find channels with bell on
            const channels = findChannelsWithBellOn();
            console.log(`Found ${channels.length} channels with bell on`);

            if (channels.length === 0) {
                await showAlert('No channels with notifications enabled were found.');
                return;
            }

            // Step 3: Show confirmation dialog
            const channelNames = channels.map(c => c.name);
            const action = await showConfirmationDialog(channelNames);

            if (action === 'cancel') {
                console.log('User cancelled');
                return;
            }

            // Step 4: Process each channel
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < channels.length; i++) {
                const channel = channels[i];
                console.log(`Processing ${i + 1}/${channels.length}: ${channel.name}`);
                
                const success = await processChannel(channel, action);
                if (success) {
                    successCount++;
                } else {
                    failCount++;
                }

                // Delay between channels to avoid rate limiting
                if (i < channels.length - 1) {
                    await sleep(400);
                }
            }

            // Step 5: Show completion message
            const message = `Processing complete!\n\nSuccessfully processed: ${successCount}\nFailed: ${failCount}`;
            await showAlert(message);
            console.log(message);

        } catch (e) {
            console.error('Error in main process:', e);
            await showAlert(`An error occurred: ${e.message}`);
        }
    }

    // Register menu command
    GM_registerMenuCommand('Run script', processAllChannels);

    console.log('Userscript loaded. Use the Violentmonkey menu to trigger the script.');
})();
