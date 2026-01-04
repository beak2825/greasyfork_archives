// ==UserScript==
// @name         P.ecker Auto-Bumper (Visual Logger)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automates posting on p.ecker.tech with a reliable on-screen visual logger to show its status.
// @author       AI Assistant
// @match        https://p.ecker.tech/chan/browse/pol/thread/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556210/Pecker%20Auto-Bumper%20%28Visual%20Logger%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556210/Pecker%20Auto-Bumper%20%28Visual%20Logger%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const TARGET_PAGE = 9; // The page number that triggers a post.
    const POST_MESSAGES = [
""
    ];
    // --- End of Configuration ---


    let postIndex = 0;
    let isCurrentlyPosting = false;
    let hasPostedAndIsWaitingForDrop = false;

    // --- Visual On-Screen Logger ---
    // This creates a box on the screen to show status messages, bypassing the website's console.
    function setupVisualLogger() {
        const loggerContainerId = 'auto-bumper-logger';
        if (document.getElementById(loggerContainerId)) return; // Already created

        GM_addStyle(`
            #${loggerContainerId} {
                position: fixed;
                top: 50px;
                right: 10px;
                width: 300px;
                max-height: 250px;
                overflow-y: auto;
                background-color: rgba(20, 20, 20, 0.9);
                border: 1px solid #555;
                color: white;
                font-family: monospace;
                font-size: 12px;
                padding: 10px;
                z-index: 99999;
                border-radius: 5px;
            }
            #${loggerContainerId} div {
                padding: 3px 0;
                border-bottom: 1px solid #444;
            }
            #${loggerContainerId} div:last-child {
                border-bottom: none;
            }
        `);

        const loggerContainer = document.createElement('div');
        loggerContainer.id = loggerContainerId;
        document.body.appendChild(loggerContainer);
    }

    // Function to print a message to our visual logger
    function logStatus(message, color = 'white') {
        const loggerContainer = document.getElementById('auto-bumper-logger');
        if (!loggerContainer) return;

        const timestamp = new Date().toLocaleTimeString();
        const newMessage = document.createElement('div');
        newMessage.innerHTML = `[${timestamp}] ${message}`;
        newMessage.style.color = color;

        // Add the new message to the top
        loggerContainer.insertBefore(newMessage, loggerContainer.firstChild);

        // Keep the log from getting too long
        if (loggerContainer.children.length > 20) {
            loggerContainer.removeChild(loggerContainer.lastChild);
        }
    }
    // --- End of Visual Logger ---


    const getCurrentPage = () => {
        const statsContainer = document.querySelector('div.stats');
        if (!statsContainer) return -1;
        const titleSpan = statsContainer.querySelector('span[title]');
        if (titleSpan) {
            const titleText = titleSpan.getAttribute('title');
            if (titleText && typeof titleText === 'string') {
                const pageMatch = titleText.match(/page\s*(\d+)$/);
                if (pageMatch && pageMatch[1]) return parseInt(pageMatch[1], 10);
            }
        }
        const innerText = statsContainer.innerText;
        if (innerText && typeof innerText === 'string') {
            const parts = innerText.split('/');
            if (parts.length === 5) {
                const pageNum = parseInt(parts[4].trim(), 10);
                if (!isNaN(pageNum)) return pageNum;
            }
        }
        return -1;
    };

    const performPost = () => {
        if (postIndex >= POST_MESSAGES.length) {
            logStatus('All messages posted. Stopping.', 'cyan');
            return;
        }
        isCurrentlyPosting = true;
        logStatus(`Target page ${TARGET_PAGE} hit. Posting message ${postIndex + 1}.`, 'lightblue');
        const quickReplyBtn = document.querySelector('a.icon.iconQR');
        if (!quickReplyBtn) {
            logStatus('ERROR: Quick Reply button not found.', 'red');
            isCurrentlyPosting = false;
            return;
        }
        quickReplyBtn.click();
        setTimeout(() => {
            const commentBox = document.querySelector('textarea[data-field="postComment"]');
            if (!commentBox) {
                logStatus('ERROR: Comment textarea not found.', 'red');
                isCurrentlyPosting = false;
                return;
            }
            commentBox.value = POST_MESSAGES[postIndex];
            const submitBtn = document.querySelector('span.field:nth-child(4) > input[value="Submit"]');
            if (!submitBtn) {
                logStatus('ERROR: Submit button not found.', 'red');
                isCurrentlyPosting = false;
                return;
            }
            submitBtn.click();
            logStatus(`Message #${postIndex + 1} submitted. Waiting for page drop.`, 'lightgreen');
            postIndex++;
            hasPostedAndIsWaitingForDrop = true;
            isCurrentlyPosting = false;
        }, 1500);
    };

    const checkAndTriggerPost = () => {
        const currentPage = getCurrentPage();
        if (currentPage === -1) return;
        if (hasPostedAndIsWaitingForDrop) {
            if (currentPage < TARGET_PAGE) {
                logStatus(`Page dropped to ${currentPage}. Resuming watch.`, 'yellow');
                hasPostedAndIsWaitingForDrop = false;
            }
            return;
        }
        if (currentPage >= TARGET_PAGE && !isCurrentlyPosting && postIndex < POST_MESSAGES.length) {
            performPost();
        }
    };

    const initializeObserver = () => {
        const statsContainer = document.querySelector('div.stats');
        if (!statsContainer) {
            logStatus('Waiting for stats element to appear...', 'gray');
            setTimeout(initializeObserver, 2000);
            return;
        }
        const observer = new MutationObserver(checkAndTriggerPost);
        observer.observe(statsContainer, { childList: true, subtree: true, characterData: true });
        logStatus('Observer Active!', 'lightgreen');
        checkAndTriggerPost();
    };

    // --- Main Execution ---
    // Wait for the window to be fully loaded before starting
    window.addEventListener('load', () => {
        setupVisualLogger();
        logStatus('Script Loaded. Initializing observer.', 'cyan');
        initializeObserver();
    });

})();