// ==UserScript==
// @name         Exact-Time-Viewer-For-Instagram (Local Timezone)
// @description  Converts Instagram time elements to your local time zone.
// @name:en      Exact-Time-Viewer-For-Instagram (Local Timezone)
// @description:en Converts Instagram time elements to your local time zone.
// @namespace    http://tampermonkey.net/
// @version      1.1.4.0
// @match        *://*.instagram.com/*
// @icon         https://static.cdninstagram.com/rsrc.php/v4/yI/r/VsNE-OHk_8a.png
// @author       aspen138 (Fixed Auto-Local)
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_info
// @grant        window.onurlchange
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561135/Exact-Time-Viewer-For-Instagram%20%28Local%20Timezone%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561135/Exact-Time-Viewer-For-Instagram%20%28Local%20Timezone%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---
    const CONFIG = {
        isDirectMode: GM_getValue('menu_isEnableDirectlyShowExactTime', true),
        dateFormat: GM_getValue('menu_dateFormatOption', 'default')
    };

    const processedElements = new WeakSet();
    let menuIds = [];

    // Get user's local timezone (e.g., "America/New_York", "Asia/Seoul")
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // --- Helper: URL Change Detection ---
    if (window.onurlchange === undefined) {
        history.pushState = (f => function pushState() {
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.pushState);

        history.replaceState = (f => function replaceState() {
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('urlchange'));
        });
    }

    // --- Menu Logic ---
    function registerMenus() {
        // Clean up old menus
        menuIds.forEach(id => GM_unregisterMenuCommand(id));
        menuIds = [];

        // 1. Toggle Direct Show
        const directTitle = `${CONFIG.isDirectMode ? '✅' : '❌'} Directly Show Exact Time`;
        menuIds.push(GM_registerMenuCommand(directTitle, () => {
            GM_setValue('menu_isEnableDirectlyShowExactTime', !CONFIG.isDirectMode);
            showReloadNotification(`Direct Show turned ${!CONFIG.isDirectMode ? 'ON' : 'OFF'}`);
        }));

        // 2. Date Format
        const formatTitle = `🗓️ Format: ${getDateFormatDisplay(CONFIG.dateFormat)}`;
        menuIds.push(GM_registerMenuCommand(formatTitle, () => {
            cycleDateFormat();
        }));
    }

    function showReloadNotification(text) {
        GM_notification({
            text: `${text}\n(Click here to refresh page and apply)`,
            timeout: 3500,
            onclick: () => location.reload()
        });
    }

    function getDateFormatDisplay(format) {
        const formats = {
            'default': 'Default (2:30 PM, Mon 10/23/2025)',
            'chinese': 'Chinese (2024-10-23 12:30)',
            'iso': 'ISO (2025-10-23T14:30:45-05:00)',
            'short': 'Short (12:30 PM, Oct 23)',
            'european': 'European (14:30, Mon 23/10/2025)',
            'compact': 'Compact (10/23 12:30 PM)'
        };
        return formats[format] || formats['default'];
    }

    function cycleDateFormat() {
        const formats = ['default', 'chinese', 'iso', 'short', 'european', 'compact'];
        const currentIndex = formats.indexOf(CONFIG.dateFormat);
        const nextFormat = formats[(currentIndex + 1) % formats.length];

        GM_setValue('menu_dateFormatOption', nextFormat);
        CONFIG.dateFormat = nextFormat; // Update local state
        
        showReloadNotification(`Switched to [${getDateFormatDisplay(nextFormat)}]`);
        registerMenus();
    }

    // --- Core Formatting Logic (Auto Local Time) ---
    function formatDate(datetime) {
        if (!datetime) return null;
        
        // Create date object (Automatically uses system local time)
        const d = new Date(datetime);
        
        // Helper to pad numbers (e.g. 9 -> '09')
        const pad = (n) => String(n).padStart(2, '0');
        
        // Extract LOCAL components
        const YYYY = d.getFullYear();
        const MM = pad(d.getMonth() + 1);
        const DD = pad(d.getDate());
        const HH = pad(d.getHours());
        const mm = pad(d.getMinutes());
        const ss = pad(d.getSeconds());
        
        // Helper for Day of Week
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[d.getDay()];
        
        // Helper for Month Name
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = months[d.getMonth()];

        // Helper for 12-hour format
        const hourNum = d.getHours();
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12; // convert 0 to 12
        const HH12 = pad(hour12);

        // Current Year check (Local)
        const currentYear = new Date().getFullYear();

        switch (CONFIG.dateFormat) {
            case 'chinese': {
                // Format: YYYY-MM-DD HH:mm (hide year if current year)
                return (YYYY === currentYear) 
                    ? `${MM}-${DD} ${HH}:${mm}` 
                    : `${YYYY}-${MM}-${DD} ${HH}:${mm}`;
            }
            case 'iso':
                // Standard ISO string (Note: built-in toISOString is always UTC, so we manually build local ISO)
                // Getting timezone offset for ISO string (e.g., -05:00)
                const offset = -d.getTimezoneOffset();
                const diff = offset >= 0 ? '+' : '-';
                const padOffset = (n) => String(Math.floor(Math.abs(n))).padStart(2, '0');
                const isoOffset = `${diff}${padOffset(offset / 60)}:${padOffset(offset % 60)}`;
                return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}${isoOffset}`;
                
            case 'short':
                // Format: 12:30 PM, Oct 23
                return `${HH12}:${mm} ${ampm}, ${monthName} ${d.getDate()}`;
                
            case 'european':
                // Format: 14:30, Monday 23/10/2025 (Timezone)
                return `${HH}:${mm}, ${dayName} ${DD}/${MM}/${YYYY} (${userTimeZone})`;
                
            case 'compact':
                // Format: 10/23 12:30 PM
                return `${parseInt(MM)}/${parseInt(DD)} ${HH12}:${mm} ${ampm}`;
                
            case 'default':
            default: {
                // Format: 2:30:45 PM, Monday 10/23/2025 (Timezone)
                const dateStr = `${parseInt(MM)}/${parseInt(DD)}/${YYYY}`;
                return `${HH12}:${mm}:${ss} ${ampm}, ${dayName} ${dateStr} (${userTimeZone})`;
            }
        }
    }

    // --- DOM Processing ---
    function processTimeElement(element) {
        if (processedElements.has(element)) return;

        const datetime = element.getAttribute('datetime');
        if (!datetime) return;

        const formattedDate = formatDate(datetime);
        if (!formattedDate) return;

        // Save original content if not already saved
        if (!element.getAttribute('data-original-content')) {
            element.setAttribute('data-original-content', element.textContent);
        }
        
        const originalContent = element.getAttribute('data-original-content');

        if (CONFIG.isDirectMode) {
            // Mode A: Always show converted time
            if (element.textContent !== formattedDate) {
                element.textContent = formattedDate;
            }
        } else {
            // Mode B: Hover to show converted time
            element.addEventListener('mouseenter', () => {
                element.textContent = formattedDate;
            });
            element.addEventListener('mouseleave', () => {
                element.textContent = originalContent;
            });
            // Also add title for accessibility
            element.title = formattedDate;
        }

        processedElements.add(element);
    }

    function scanDocument(root) {
        const timeElements = root.querySelectorAll('time[datetime]');
        timeElements.forEach(processTimeElement);
    }

    // --- Initialization ---
    registerMenus();
    scanDocument(document);

    // Watch for dynamic changes (Instagram is a Single Page App)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'TIME') {
                        processTimeElement(node);
                    } else {
                        scanDocument(node);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();