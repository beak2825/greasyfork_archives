// ==UserScript==
// @name         Timestamp Formatter with Hover Tip (Top-Layer, 1s Delay, Precise Format - Refined)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Detects 10-digit or 13-digit timestamps on a webpage and displays a YYYY-MM-DD HH:mm:ss.SSS formatted date on hover. Tooltip appears on top layer with 3s processing delay.
// @author       weijia.yan
// @license       MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552036/Timestamp%20Formatter%20with%20Hover%20Tip%20%28Top-Layer%2C%201s%20Delay%2C%20Precise%20Format%20-%20Refined%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552036/Timestamp%20Formatter%20with%20Hover%20Tip%20%28Top-Layer%2C%201s%20Delay%2C%20Precise%20Format%20-%20Refined%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const MIN_TIMESTAMP_LENGTH = 10;
    const MAX_TIMESTAMP_LENGTH = 13;
    const TIP_BACKGROUND_COLOR = '#333';
    const TIP_TEXT_COLOR = '#fff';
    const TIP_PADDING = '4px 8px';
    const TIP_FONT_SIZE = '0.9em';
    const TIP_BORDER_RADIUS = '4px';
    const TIP_TRANSITION_TIME = '0.2s';
    const PROCESS_DELAY_TIME = 1000; // ms - 3 seconds delay after DOM changes

    // --- Global Tip Element ---
    let globalTipElement = null;

    // --- Helper Functions ---

    function formatTimestamp(timestampStr) {
        let timestamp = Number(timestampStr);
        if (isNaN(timestamp)) {
            return 'Invalid Date';
        }
        if (timestampStr.length === MIN_TIMESTAMP_LENGTH) {
            timestamp *= 1000;
        } else if (timestampStr.length !== MAX_TIMESTAMP_LENGTH) {
            return 'Invalid Date';
        }
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    /**
     * Initializes the global tip element and appends it to body.
     */
    function initGlobalTipElement() {
        if (!globalTipElement && document.body) { // Crucial: Check if document.body exists
            globalTipElement = document.createElement('div');
            globalTipElement.id = 'timestamp-formatter-global-tip';
            Object.assign(globalTipElement.style, {
                position: 'fixed',
                backgroundColor: TIP_BACKGROUND_COLOR,
                color: TIP_TEXT_COLOR,
                padding: TIP_PADDING,
                borderRadius: TIP_BORDER_RADIUS,
                fontSize: TIP_FONT_SIZE,
                whiteSpace: 'nowrap',
                opacity: '0',
                visibility: 'hidden',
                transition: `opacity ${TIP_TRANSITION_TIME}, visibility ${TIP_TRANSITION_TIME}`,
                zIndex: '2147483647',
                pointerEvents: 'none',
                userSelect: 'none',
                left: '0',
                top: '0'
            });
            document.body.appendChild(globalTipElement);
        }
    }

    function showTip(content, targetElement) {
        // Ensure globalTipElement is initialized before trying to show it
        if (!globalTipElement) {
            initGlobalTipElement();
            if (!globalTipElement) return; // If still null, then body not ready, or some other issue
        }

        if (!targetElement) return;

        globalTipElement.textContent = content;
        globalTipElement.style.visibility = 'hidden';
        globalTipElement.style.opacity = '0';
        globalTipElement.style.display = 'block';

        const targetRect = targetElement.getBoundingClientRect();
        const tipRect = globalTipElement.getBoundingClientRect();

        let top = targetRect.top - tipRect.height - 10;
        let left = targetRect.left;

        if (top < 10) {
            if (targetRect.bottom + tipRect.height + 10 < window.innerHeight) {
                top = targetRect.bottom + 10;
            } else {
                top = 10;
            }
        }

        if (left < 10) {
            left = 10;
        }
        if (left + tipRect.width + 10 > window.innerWidth) {
            left = window.innerWidth - tipRect.width - 10;
            if (left < 10) left = 10;
        }

        globalTipElement.style.left = `${left}px`;
        globalTipElement.style.top = `${top}px`;

        globalTipElement.style.visibility = 'visible';
        globalTipElement.style.opacity = '1';
    }

    function hideTip() {
        if (globalTipElement) {
            globalTipElement.style.opacity = '0';
            globalTipElement.style.visibility = 'hidden';
        }
    }

    function processTextNode(textNode) {
        if (!textNode || !textNode.parentNode) return;

        let currentNode = textNode.parentNode;
        while (currentNode && currentNode !== document.body) {
            if (currentNode.dataset.timestampProcessed === 'true') {
                return;
            }
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'PRE', 'CODE'].includes(currentNode.tagName)) {
                return;
            }
            currentNode = currentNode.parentNode;
        }

        const text = textNode.nodeValue;
        const timestampRegex = new RegExp(`\\b\\d{${MIN_TIMESTAMP_LENGTH},${MAX_TIMESTAMP_LENGTH}}\\b`, 'g');
        let match;
        let lastIndex = 0;
        const fragments = [];
        let hasChanges = false;

        while ((match = timestampRegex.exec(text)) !== null) {
            const fullMatch = match[0];
            const startTime = match.index;

            if (startTime > lastIndex) {
                fragments.push(document.createTextNode(text.substring(lastIndex, startTime)));
            }

            const formattedDate = formatTimestamp(fullMatch);
            if (formattedDate !== 'Invalid Date') {
                hasChanges = true;
                const wrapper = document.createElement('span');
                wrapper.className = 'timestamp-formatter-wrapper';
                Object.assign(wrapper.style, {
                    position: 'relative',
                    display: 'inline-block',
                    cursor: 'help',
                    // --- DEBUG MARKER: Highlight processed timestamps ---
                    outline: '1px dotted blue' // Keep this to verify processing
                    // --- END DEBUG MARKER ---
                });

                wrapper.appendChild(document.createTextNode(fullMatch));

                wrapper.addEventListener('mouseenter', (e) => showTip(formattedDate, e.currentTarget));
                wrapper.addEventListener('mouseleave', hideTip);

                fragments.push(wrapper);
            } else {
                fragments.push(document.createTextNode(fullMatch));
            }

            lastIndex = timestampRegex.lastIndex;
        }

        if (lastIndex < text.length) {
            fragments.push(document.createTextNode(text.substring(lastIndex)));
        }

        if (hasChanges) {
            const parent = textNode.parentNode;
            if (parent) {
                parent.dataset.timestampProcessed = 'true';
                fragments.forEach(frag => parent.insertBefore(frag, textNode));
                parent.removeChild(textNode);
            }
        }
    }

    function traverseAndProcess(node) {
        if (node.nodeType === Node.ELEMENT_NODE &&
            ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'PRE', 'CODE'].includes(node.tagName)) {
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.dataset.timestampProcessed === 'true') {
            return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
            return;
        }

        const iterator = document.createNodeIterator(
            node,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'PRE', 'CODE'].includes(node.tagName)) {
                            return NodeFilter.FILTER_SKIP;
                        }
                        if (node.dataset.timestampProcessed === 'true' || (node.parentNode && node.parentNode.dataset.timestampProcessed === 'true')) {
                            return NodeFilter.FILTER_SKIP;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        if (!node.nodeValue.trim()) {
                            return NodeFilter.FILTER_SKIP;
                        }
                        if (node.parentNode && node.parentNode.dataset.timestampProcessed === 'true') {
                            return NodeFilter.FILTER_SKIP;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            },
            false
        );

        let currentNode;
        const nodesToProcess = [];
        while ((currentNode = iterator.nextNode())) {
            if (currentNode.nodeType === Node.TEXT_NODE) {
                nodesToProcess.push(currentNode);
            }
        }

        for (let i = nodesToProcess.length - 1; i >= 0; i--) {
            processTextNode(nodesToProcess[i]);
        }
    }

    // --- Delayed Processing Mechanism ---
    let processTimer = null;
    let hasPendingMutations = false;

    function triggerDelayedProcessing() {
        if (processTimer) {
            clearTimeout(processTimer);
        }
        processTimer = setTimeout(() => {
            if (hasPendingMutations || !document.body.dataset.initialScanDone) {
                traverseAndProcess(document.body);
                hasPendingMutations = false;
                document.body.dataset.initialScanDone = 'true';
            }
            processTimer = null;
        }, PROCESS_DELAY_TIME);
    }

    // --- Main Execution ---

    // Option 1: Try initializing on DOMContentLoaded, but with a robust body check
    document.addEventListener('DOMContentLoaded', () => {
        // We might need to wait a tiny bit longer for body to be truly ready in some complex SPA.
        // A small setTimeout ensures body is definitely available.
        setTimeout(() => {
            initGlobalTipElement(); // Now called after a very short delay
            traverseAndProcess(document.body);
            document.body.dataset.initialScanDone = 'true';
            hasPendingMutations = false;
        }, 50); // Small delay to ensure body is fully available
    });


    const observer = new MutationObserver(() => {
        hasPendingMutations = true;
        triggerDelayedProcessing();
    });

    // Observe when document.body itself is added, in case it's not present at script load.
    // This is a failsafe for very early script injection or unusual page loads.
    const bodyObserver = new MutationObserver((mutations, obs) => {
        if (document.body) {
            initGlobalTipElement(); // Try to initialize once body is certainly present
            obs.disconnect(); // Disconnect this observer once body is found
        }
    });

    if (!document.body) { // If body is not immediately available
        bodyObserver.observe(document.documentElement, { childList: true, subtree: true });
    } else { // If body is already available at script injection time
        initGlobalTipElement(); // Initialize immediately
    }


    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    document.addEventListener('mouseleave', hideTip);


})();
