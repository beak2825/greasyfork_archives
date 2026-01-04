// ==UserScript==
// @name         YouTube Transcript Copier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to copy the video transcript next to the like/share buttons. Safely handles Trusted Types and SPA navigation.
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557661/YouTube%20Transcript%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/557661/YouTube%20Transcript%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = {
        BAR: '#top-level-buttons-computed',
        TRANSCRIPT_RENDERER: 'ytd-transcript-renderer',
        SEGMENT: 'ytd-transcript-segment-renderer',
        TIMESTAMP: '.segment-timestamp',
        TEXT: '.segment-text',
        SHOW_TRANSCRIPT_BTN: 'button[aria-label="Show transcript"]',
        EXPAND_DESC_BTN: '#expand',
        DESCRIPTION_CONTAINER: 'ytd-text-inline-expander'
    };

    const BUTTON_ID = 'yt-custom-transcript-copy-btn';

    // SVG Icon Data for the Clipboard (Safe creation)
    function createCopyIcon() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("height", "24");
        svg.setAttribute("width", "24");
        svg.setAttribute("focusable", "false");
        svg.style.display = "block";
        svg.style.fill = "currentColor";

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z");

        svg.appendChild(path);
        return svg;
    }

    // Helper to wait for elements (needed because transcript loads lazily)
    function waitForElement(selector, timeout = 2000) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver((mutations) => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    // The Main Copy Logic
    async function handleCopyClick(btnElement) {
        const originalText = btnElement.innerText;
        btnElement.innerText = "Loading...";

        try {
            // 1. Check if transcript is visible
            let segments = document.querySelectorAll(SELECTORS.SEGMENT);

            // 2. If not, try to open it automatically
            if (segments.length === 0) {
                // Check for "Show Transcript" button immediately
                let showBtn = Array.from(document.querySelectorAll('button')).find(b =>
                    b.ariaLabel === 'Show transcript' || (b.textContent && b.textContent.includes('Show transcript'))
                );

                // If not found, try expanding the description
                if (!showBtn) {
                    const expandBtn = document.querySelector(SELECTORS.EXPAND_DESC_BTN);
                    if (expandBtn && expandBtn.offsetParent !== null) { // Check visibility
                        expandBtn.click();
                        // Short wait for description expansion
                        await new Promise(r => setTimeout(r, 500));

                        // Look again for show transcript button
                        showBtn = Array.from(document.querySelectorAll('button')).find(b =>
                             b.ariaLabel === 'Show transcript' || (b.textContent && b.textContent.includes('Show transcript'))
                        );
                    }
                }

                if (showBtn) {
                    showBtn.click();
                    // Wait for the transcript panel to render
                    await waitForElement(SELECTORS.SEGMENT, 3000);
                    segments = document.querySelectorAll(SELECTORS.SEGMENT);
                }
            }

            // 3. Scrape Data
            if (segments.length > 0) {
                let transcriptText = "";
                segments.forEach(seg => {
                    const time = seg.querySelector(SELECTORS.TIMESTAMP)?.textContent?.trim().replace(/\s+/g, ' ') || "";
                    const text = seg.querySelector(SELECTORS.TEXT)?.textContent?.trim().replace(/\s+/g, ' ') || "";
                    if (text) {
                        transcriptText += `[${time}] ${text}\n`;
                    }
                });

                if (transcriptText) {
                    await navigator.clipboard.writeText(transcriptText);
                    btnElement.innerText = "Copied!";
                } else {
                    btnElement.innerText = "Empty!";
                }
            } else {
                alert("Could not find transcript. Please open the transcript panel manually.");
                btnElement.innerText = "Failed";
            }

        } catch (err) {
            console.error("Transcript copy error:", err);
            btnElement.innerText = "Error";
        }

        // Reset button text after 2 seconds
        setTimeout(() => {
            // Re-build the inner structure of the button safely
            btnElement.innerText = "";
            const iconDiv = document.createElement("div");
            iconDiv.className = "yt-spec-button-shape-next__icon";
            iconDiv.setAttribute("aria-hidden", "true");

            const iconWrapper = document.createElement("span");
            iconWrapper.style.width = "24px";
            iconWrapper.style.height = "24px";
            iconWrapper.style.display = "inline-block";

            iconWrapper.appendChild(createCopyIcon());
            iconDiv.appendChild(iconWrapper);

            const textDiv = document.createElement("div");
            textDiv.className = "yt-spec-button-shape-next__button-text-content";
            textDiv.innerText = "Transcript";
            textDiv.style.marginLeft = "6px";

            btnElement.appendChild(iconDiv);
            btnElement.appendChild(textDiv);
        }, 2000);
    }

    // Function to inject the button
    function injectButton() {
        // Prevent duplicate injection
        if (document.getElementById(BUTTON_ID)) return;

        const container = document.querySelector(SELECTORS.BAR);
        if (!container) return;

        // Create the Button Wrapper (ViewModel mimic)
        const wrapper = document.createElement('div');
        wrapper.className = 'yt-button-view-model style-scope ytd-menu-renderer';
        wrapper.id = BUTTON_ID;
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginLeft = '8px'; // Spacing from other buttons

        // Create the Button (mimicking Share button classes)
        const button = document.createElement('button');
        button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment';
        button.setAttribute('aria-label', 'Copy Transcript');
        button.style.cursor = 'pointer';

        // 1. Icon Container
        const iconDiv = document.createElement("div");
        iconDiv.className = "yt-spec-button-shape-next__icon";
        iconDiv.setAttribute("aria-hidden", "true");

        // 2. Icon Content
        const iconWrapper = document.createElement("span");
        iconWrapper.style.width = "24px";
        iconWrapper.style.height = "24px";
        iconWrapper.style.display = "inline-block";
        iconWrapper.appendChild(createCopyIcon()); // Safe DOM node append
        iconDiv.appendChild(iconWrapper);

        // 3. Text Content
        const textDiv = document.createElement("div");
        textDiv.className = "yt-spec-button-shape-next__button-text-content";
        textDiv.innerText = "Transcript";

        // Append parts to button
        button.appendChild(iconDiv);
        button.appendChild(textDiv);

        // Add Click Listener
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopyClick(button);
        });

        wrapper.appendChild(button);

        // Insert as the first item in the menu container, or append
        // Appending usually puts it next to "Share" or "Download"
        container.appendChild(wrapper);
    }

    // Observer to handle SPA navigation and dynamic loading
    const observer = new MutationObserver((mutations) => {
        // Check if our target container exists but our button doesn't
        const container = document.querySelector(SELECTORS.BAR);
        if (container && !document.getElementById(BUTTON_ID)) {
            injectButton();
        }
    });

    // Start Observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check
    injectButton();

})();