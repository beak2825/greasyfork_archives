// ==UserScript==
// @name         Claude.ai Screen Reader Support (NVDA/JAWS)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Screen reader accessibility fix for Claude.ai - announces new responses, adds heading navigation for blind users
// @author       Anouk
// @match        https://claude.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560229/Claudeai%20Screen%20Reader%20Support%20%28NVDAJAWS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560229/Claudeai%20Screen%20Reader%20Support%20%28NVDAJAWS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === ARIA-LIVE REGION FOR NEW RESPONSES ===

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);

    const announcedMessages = new Set();

    function announce(text) {
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = text;
        }, 100);
    }

    // === HEADING NAVIGATION ===

    const processedUserMessages = new Set();
    const processedAssistantMessages = new Set();

    function addHeadings() {
        // Add headings to user messages
        const userMessages = document.querySelectorAll('[data-testid="user-message"]');
        let questionCount = 0;

        userMessages.forEach((message) => {
            questionCount++;

            if (processedUserMessages.has(message)) return;
            processedUserMessages.add(message);

            const text = message.innerText?.trim() || '';
            const headingText = text.substring(0, 50) + (text.length > 50 ? '...' : '');

            const heading = document.createElement('h2');
            heading.textContent = `Question ${questionCount}: ${headingText}`;
            heading.className = 'claude-a11y-heading';
            heading.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;

            message.parentElement.insertBefore(heading, message);
        });

        // Add headings to Claude responses
        const responses = document.querySelectorAll('[data-is-streaming="false"]');
        let answerCount = 0;

        responses.forEach((response) => {
            answerCount++;

            if (processedAssistantMessages.has(response)) return;
            processedAssistantMessages.add(response);

            const text = response.innerText?.trim() || '';
            const headingText = text.substring(0, 50) + (text.length > 50 ? '...' : '');

            const heading = document.createElement('h3');
            heading.textContent = `Answer ${answerCount}: ${headingText}`;
            heading.className = 'claude-a11y-heading';
            heading.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;

            response.parentElement.insertBefore(heading, response);
        });
    }

    // === RESPONSE ANNOUNCEMENTS ===

    function checkForNewResponses() {
        const responses = document.querySelectorAll('[data-is-streaming="false"]');

        responses.forEach(response => {
            const responseText = response.innerText?.trim();
            if (!responseText) return;

            const messageId = responseText.substring(0, 100);

            if (!announcedMessages.has(messageId)) {
                announcedMessages.add(messageId);
                announce(responseText);
            }
        });
    }

    // === SINGLE OBSERVER FOR EVERYTHING ===

    const observer = new MutationObserver((mutations) => {
        let shouldCheckResponses = false;
        let shouldAddHeadings = false;

        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-is-streaming') {
                if (mutation.target.getAttribute('data-is-streaming') === 'false') {
                    shouldCheckResponses = true;
                    shouldAddHeadings = true;
                }
            }

            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldAddHeadings = true;
                shouldCheckResponses = true;
            }
        });

        if (shouldCheckResponses) {
            setTimeout(checkForNewResponses, 200);
        }
        if (shouldAddHeadings) {
            setTimeout(addHeadings, 300);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-is-streaming']
    });

    // Initial run
    setTimeout(() => {
        addHeadings();
        checkForNewResponses();
    }, 1000);

    console.log('Claude Screen Reader Support loaded');
})();