// ==UserScript==
// @name            YouTube Remove Important Notifications
// @namespace       https://github.com/crazyrabbit0
// @version         1.0
// @description     Sorts all notifications chronologically and hides section titles & borders.
// @author          CrazyRabbit
// @match           http://*.youtube.com/*
// @match           https://*.youtube.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant           none
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright       2023+, CrazyRabbit (https://github.com/crazyrabbit0)
// @homepageURL     https://github.com/crazyrabbit0/UserScripts
// @supportURL      https://github.com/crazyrabbit0/UserScripts/issues/new?assignees=crazyrabbit0&labels=help+wanted&template=&title=YouTube%20Remove%20Important%20Notifications%20-%20Issue
// @run-at          document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550796/YouTube%20Remove%20Important%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/550796/YouTube%20Remove%20Important%20Notifications.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // YouTube DOM structure selectors
    const NOTIFICATION_SELECTORS = {
        button: 'ytd-notification-topbar-button-renderer',
        panel: 'ytd-multi-page-menu-renderer #sections',
        section: 'yt-multi-page-menu-section-renderer',
        title: '#section-title',
        items: '#items',
        item: 'ytd-notification-renderer',
        time: 'div.metadata yt-formatted-string:last-of-type'
    };

    // Constants for timing
    const BUTTON_POLL_INTERVAL = 200;    // ms - interval for checking if the button is available
    const OBSERVER_RETRY_DELAY = 200;    // ms - delay before retrying to setup observer
    const MERGE_DEBOUNCE_DELAY = 200;    // ms - delay for debouncing merge operations

    // Global variables to manage the MutationObserver and debounce timer
    let notificationObserver = null;
    let debounceTimer = null;

    /**
     * Parses YouTube's time element (e.g., "5 hours ago", "2 days ago") into minutes for chronological sorting
     * Handles common time units: seconds, minutes, hours, days, weeks, months, years
     * Returns Infinity for invalid time strings to ensure they appear at the end of sorted results
     * @param {string} timeElement - The time element to parse (e.g., "5 hours ago")
     * @returns {number} Notification time in minutes or Infinity if parsing fails
     */
    const parseTimeToMinutes = (timeElement) => {
        if (!timeElement) return Infinity;

        // Clean and split the string into parts
        const string = timeElement?.textContent.toLowerCase();
        const parts = string.split(' ');

        // Parse the numeric value
        const value = parseInt(parts[0], 10);
        if (isNaN(value)) return Infinity;

        // Normalize the unit by removing 's' if it's plural
        const unit = parts[1].endsWith('s') ? parts[1].slice(0, -1) : parts[1];

        // Lookup map for converting various time units to minutes
        const timeMultipliers = new Map([
            ['second', 1 / 60],    // Convert seconds to fractional minutes
            ['minute', 1],       // Minutes stay as-is
            ['hour', 60],        // Hours to minutes
            ['day', 1440],       // Days to minutes (24 * 60)
            ['week', 10080],     // Weeks to minutes (7 * 24 * 60)
            ['month', 43200],    // Months to minutes (30 * 24 * 60)
            ['year', 525600]     // Years to minutes (365 * 24 * 60)
        ]);

        // Direct lookup for the normalized unit
        const multiplier = timeMultipliers.get(unit);
        return multiplier !== undefined ? value * multiplier : Infinity;
    };

    /**
     * Sorts all notifications chronologically across the 'Important' and 'Main' sections
     * Also hides the section titles.
     * @param {HTMLElement} panel - The container element holding notification sections
     */
    const sortNotifications = (panel) => {
        notificationObserver.disconnect(); // Disconnect to prevent recursive triggers

        const sections = panel.querySelectorAll(NOTIFICATION_SELECTORS.section);
        if (sections.length < 2) return; // Need both 'Important' and 'Main' sections to proceed

        // Collect all notifications and their parsed times, while hiding section titles and borders
        const notificationsToSort = [];
        sections.forEach(section => {
            // Hide section titles and border
            section.querySelector(NOTIFICATION_SELECTORS.title).style.display = 'none';
            section.style.border = 'none';

            const items = section.querySelector(NOTIFICATION_SELECTORS.items);
            const notifications = items.querySelectorAll(NOTIFICATION_SELECTORS.item);
            if (!notifications.length) return; // No notifications found

            // Gather all notifications
            for (const notification of notifications) {
                const timeElement = notification.querySelector(NOTIFICATION_SELECTORS.time);

                // Create an object with the DOM element and its parsed time
                notificationsToSort.push({
                    element: notification,
                    time: parseTimeToMinutes(timeElement)
                });
            }
        });

        // Sort notifications by time (newest first)
        notificationsToSort.sort((a, b) => a.time - b.time);

        // Extract only the DOM elements from the sorted notifications
        const sortedNotifications = notificationsToSort.map(notification => notification.element);

        // Add notifications back into sections
        sections.forEach((section, index) => {
            const items = section.querySelector(NOTIFICATION_SELECTORS.items);

            // For the 'Important' section (index 0), add only the first two notifications
            // For the 'Main' section (index 1), add the remaining notifications
            const notificationsToAdd = (index === 0) ? sortedNotifications.slice(0, 2) : sortedNotifications.slice(2);
            items.prepend(...notificationsToAdd);
        });
    };

    /**
     * Creates and attaches a MutationObserver to monitor changes in the notification container
     * Uses debouncing to prevent excessive merge operations when multiple notifications are added rapidly
     * The observer watches for childList changes (new notifications being added) and triggers merge with a delay
     */
    const setupNotificationObserver = () => {
        const panel = document.querySelector(NOTIFICATION_SELECTORS.panel);
        // Retry after configured delay, if the notification panel isn't rendered yet
        if (!panel) {
            setTimeout(setupNotificationObserver, OBSERVER_RETRY_DELAY);
            return;
        }

        // Check if any mutation added nodes, then trigger merge with debounce
        notificationObserver = new MutationObserver((mutations) => {
            if (!mutations.some(mutation => mutation.addedNodes.length > 0)) return; // No relevant changes

            // Debounce ensures merge only runs once after a batch of changes complete
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => sortNotifications(panel), MERGE_DEBOUNCE_DELAY);
        });

        // Observe section childList changes (element additions/removals)
        notificationObserver.observe(panel, {
            childList: true,
            subtree: false
        });
    };

    /**
     * Polls the DOM to find the notification button and attaches a click listener.
     */
    const initialize = () => {
        const buttonInterval = setInterval(() => {
            const button = document.querySelector(NOTIFICATION_SELECTORS.button);
            if (!button) return; // No button found

            clearInterval(buttonInterval);

            // Attach the click listener to initialize the notification observer
            button.addEventListener('click', () => {
                if (notificationObserver) notificationObserver.disconnect(); // Disconnect any existing observer
                setupNotificationObserver();
            });
        }, BUTTON_POLL_INTERVAL);
    };

    // Start polling for the notification button
    initialize();

})();
