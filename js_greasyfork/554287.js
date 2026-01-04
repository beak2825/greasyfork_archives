// ==UserScript==
// @name         Amazon Delivery Status Monitor
// @version      1.9
// @description  Monitor delivery status changes on Amazon tracking pages and send notifications
// @author       incognico
// @namespace    https://greasyfork.org/users/931787
// @license      MIT
// @match        https://www.amazon.*/gp/your-account/ship-track*
// @match        https://amazon.*/gp/your-account/ship-track*
// @match        https://www.amazon.*/progress-tracker/*
// @match        https://amazon.*/progress-tracker/*
// @icon         https://i.imgur.com/LGHKHEs.png
// @grant        GM_notification
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554287/Amazon%20Delivery%20Status%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/554287/Amazon%20Delivery%20Status%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Amazon Delivery Status Monitor loaded');

    const STORAGE_KEY_PREFIX = 'amazon_delivery_status_monitor_';
    let observer = null;
    let refreshTimer = null;
    let isInitialized = false;

    function getItemId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('itemId');
    }

    function getStorageKey() {
        const itemId = getItemId();
        if (!itemId) {
            console.warn('No itemId found in URL');
            return null;
        }
        return STORAGE_KEY_PREFIX + itemId;
    }

    function getStoredStatus() {
        try {
            const storageKey = getStorageKey();
            if (!storageKey) return {};

            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.warn('Failed to read from localStorage:', e);
            return {};
        }
    }

    function setStoredStatus(statusObj) {
        try {
            const storageKey = getStorageKey();
            if (!storageKey) {
                console.warn('Cannot store status: no itemId found');
                return;
            }

            localStorage.setItem(storageKey, JSON.stringify(statusObj));
        } catch (e) {
            console.warn('Failed to write to localStorage:', e);
        }
    }

    function checkDeliveryStatus() {
        const itemId = getItemId();
        if (!itemId) {
            console.log('No itemId in URL, skipping status check');
            return;
        }

        const elements = {
            outForDelivery: document.querySelector('.H_ib_content'),
            promiseDate: document.querySelector('.pt-promise-main-slot'),
            promiseDetails: document.querySelector('.pt-promise-details-slot'),
            primaryStatus: document.querySelector('#primaryStatus'),
            exceptionMessage: document.querySelector('#lexicalExceptionMessage-container h3') || document.querySelector('.lexicalExceptionMessage-container h3'),
            mainStatus: document.querySelector('.pt-status-main-status'),
            secondaryStatus: document.querySelector('.pt-status-secondary-status')
        };

        const currentStatus = {};
        let hasAnyContent = false;

        // Collect current status from all elements
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element) {
                const content = element.textContent.trim();
                if (content) {
                    currentStatus[key] = content;
                    hasAnyContent = true;
                }
            }
        });

        if (!hasAnyContent) {
            console.log(`No delivery status elements found for item ${itemId}`);
            return;
        }

        const lastStatus = getStoredStatus();
        console.log(`Current delivery status for item ${itemId}:`, currentStatus);

        // Initialize on first run
        if (Object.keys(lastStatus).length === 0) {
            setStoredStatus(currentStatus);
            console.log(`Initial delivery status stored for item ${itemId}:`, currentStatus);
            isInitialized = true;
            setupAutoRefresh(currentStatus);
            return;
        }

        // On page reload, wait a bit before comparing to avoid false "none" notifications
        if (!isInitialized) {
            setStoredStatus(currentStatus);
            console.log(`Status reloaded for item ${itemId}:`, currentStatus);
            isInitialized = true;
            setupAutoRefresh(currentStatus);
            return;
        }

        // Check for changes in any status element
        const changes = [];
        Object.keys(currentStatus).forEach(key => {
            if (currentStatus[key] !== lastStatus[key]) {
                changes.push({
                    field: key,
                    from: lastStatus[key] || 'none',
                    to: currentStatus[key]
                });
            }
        });

        // Check for removed status elements
        Object.keys(lastStatus).forEach(key => {
            if (!currentStatus[key] && lastStatus[key]) {
                changes.push({
                    field: key,
                    from: lastStatus[key],
                    to: 'none'
                });
            }
        });

        if (changes.length > 0) {
            console.log(`Delivery status changes detected for item ${itemId}:`, changes);

            // Check for delivery completion (next stop -> none)
            const deliveryCompletionChange = changes.find(change =>
                change.field === 'outForDelivery' &&
                change.from &&
                change.from.toLowerCase().includes('next stop') &&
                change.to === 'none'
            );

            // Send notification for each change
            changes.forEach(change => {
                const fieldNames = {
                    outForDelivery: 'Out for Delivery',
                    promiseDate: 'Promise Date',
                    promiseDetails: 'Promise Details',
                    primaryStatus: 'Primary Status',
                    exceptionMessage: 'Exception Message',
                    mainStatus: 'Main Status',
                    secondaryStatus: 'Secondary Status'
                };

                const shortItemId = itemId.substring(0, 8) + '...';
                GM_notification({
                    title: `Amazon ${fieldNames[change.field]} Update`,
                    text: `[${shortItemId}] ${fieldNames[change.field]}: ${change.to}`,
                    image: 'https://www.amazon.de/favicon.ico',
                    timeout: 5000,
                    onclick: function() {
                        window.focus();
                    }
                });
            });

            // Store the new status
            setStoredStatus(currentStatus);

            // If delivery was completed (next stop -> none), refresh page after a short delay
            if (deliveryCompletionChange) {
                console.log(`Delivery completed for item ${itemId}, refreshing page in 5 seconds to update tracking info...`);
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            } else {
                // Update auto-refresh based on new status (only if not doing delivery completion refresh)
                setupAutoRefresh(currentStatus);
            }
        }
    }

    function setupAutoRefresh(currentStatus) {
        // Clear existing timer
        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
        }

        // Check if currently out for delivery
        const isOutForDelivery = currentStatus.outForDelivery &&
                                currentStatus.outForDelivery.toLowerCase().includes('stop');

        if (!isOutForDelivery) {
            console.log(`Setting up auto-refresh every 10 minutes for item ${getItemId()}`);
            refreshTimer = setInterval(() => {
                console.log(`Auto-refreshing page for item ${getItemId()}`);
                window.location.reload();
            }, 10 * 60 * 1000); // 10 minutes
        } else {
            console.log(`Package is out for delivery, no auto-refresh needed for item ${getItemId()}`);
        }
    }

    function startMonitoring() {
        // Wait a bit for the page to fully load before initial check
        setTimeout(() => {
            checkDeliveryStatus();
        }, 2000);

        // Set up MutationObserver to watch for changes
        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if the delivery status element was affected
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Only check after initialization to avoid false notifications
                    if (isInitialized) {
                        checkDeliveryStatus();
                    }
                }
            });
        });

        // Start observing the document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        console.log('Started monitoring delivery status changes');
    }

    function stopMonitoring() {
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log('Stopped monitoring delivery status changes');
        }

        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
            console.log('Stopped auto-refresh timer');
        }
    }

    // Start monitoring when the page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startMonitoring);
    } else {
        startMonitoring();
    }

    // Clean up when leaving the page
    window.addEventListener('beforeunload', stopMonitoring);

    // Also check periodically in case MutationObserver misses something
    setInterval(checkDeliveryStatus, 10000); // Check every 10 seconds

})();