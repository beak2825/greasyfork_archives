// ==UserScript==
// @name         AI Navigation Bar
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Automatically clicks annoyance of M365 and adds navigation buttons to AI chat services
// @author       Jerry
// @match        https://m365.cloud.microsoft/*
// @match        https://claude.ai/*
// @match        https://chatgpt.com/*
// @match        https://chat.deepseek.com/*
// @match        https://gemini.google.com/*
// @match        https://www.perplexity.ai/*
// @grant        GM_xmlhttpRequest
// @connect      favicon.yandex.net
// @homepage     https://greasyfork.org/en/scripts/550204-ai-navigation-bar
// @downloadURL https://update.greasyfork.org/scripts/550204/AI%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/550204/AI%20Navigation%20Bar.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Navigation buttons configuration
    const navButtons = [
        { name: 'M365', url: 'https://m365.cloud.microsoft' },
        { name: 'Gemini', url: 'https://gemini.google.com' },
        { name: 'Anthropic', url: 'https://claude.ai' },
        { name: 'ChatGPT', url: 'https://chatgpt.com' },
        { name: 'DeepSeek', url: 'https://chat.deepseek.com' },
        { name: 'Perplexity', url: 'https://www.perplexity.ai' }
    ];

    // Cache for favicon data URLs
    const faviconCache = {};

    // Extract domain from URL
    function getDomain(url) {
        try {
            const hostname = new URL(url).hostname;
            return hostname;
        } catch (e) {
            console.error('Invalid URL:', url);
            return '';
        }
    }

    // Check if URL matches current domain
    function isSameDomain(url) {
        try {
            const targetDomain = new URL(url).hostname;
            const currentDomain = window.location.hostname;
            return targetDomain === currentDomain;
        } catch (e) {
            return false;
        }
    }

    // Fetch favicon using GM_xmlhttpRequest and convert to data URL
    function getFaviconDataUrl(domain) {
        return new Promise((resolve) => {
            if (faviconCache[domain]) {
                resolve(faviconCache[domain]);
                return;
            }

            const faviconUrl = `https://favicon.yandex.net/favicon/v2/${domain}?size=32`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: faviconUrl,
                responseType: 'blob',
                onload: function(response) {
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        faviconCache[domain] = reader.result;
                        console.log(`✓ Favicon loaded for ${domain}`);
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(response.response);
                },
                onerror: function(error) {
                    console.error(`✗ Favicon failed for ${domain}:`, error);
                    resolve(null);
                }
            });
        });
    }

    // Create navigation bar
    async function createNavigationBar() {
        // Check if nav bar already exists
        if (document.getElementById('ai-nav-bar')) return;

        const navBar = document.createElement('div');
        navBar.id = 'ai-nav-bar';
        navBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: transparent;
            padding: 6px;
            display: flex;
            gap: 6px;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            pointer-events: none;
        `;

        for (const btn of navButtons) {
            const button = document.createElement('button');
            const isCurrentSite = isSameDomain(btn.url);

            button.style.cssText = `
                background: rgba(45, 45, 45, 0.9);
                color: #e0e0e0;
                border: 1px solid #404040;
                padding: 5px 12px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: 600;
                font-size: 12px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                backdrop-filter: blur(10px);
                pointer-events: auto;
                display: flex;
                align-items: center;
                gap: 6px;
                ${isCurrentSite ? 'opacity: 0.3; border-color: #606060;' : ''}
            `;

            // Extract domain and fetch favicon as data URL
            const domain = getDomain(btn.url);
            if (domain) {
                const faviconDataUrl = await getFaviconDataUrl(domain);

                if (faviconDataUrl) {
                    const favicon = document.createElement('img');
                    favicon.src = faviconDataUrl;
                    favicon.alt = btn.name;
                    favicon.style.cssText = `
                        width: 16px;
                        height: 16px;
                        object-fit: contain;
                        flex-shrink: 0;
                    `;

                    button.appendChild(favicon);
                }
            }

            // Add text
            const text = document.createElement('span');
            text.textContent = btn.name;
            button.appendChild(text);

            // Hover effects
            button.onmouseenter = () => {
                button.style.background = 'rgba(61, 61, 61, 0.95)';
                button.style.borderColor = '#505050';
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 3px 6px rgba(0,0,0,0.4)';
            };
            button.onmouseleave = () => {
                button.style.background = 'rgba(45, 45, 45, 0.9)';
                button.style.borderColor = isCurrentSite ? '#606060' : '#404040';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            };

            button.onclick = () => {
                if (isSameDomain(btn.url)) {
                    // Same domain: reload in current tab
                    window.location.href = btn.url;
                } else {
                    // Different domain: open in new tab
                    window.open(btn.url, '_blank');
                }
            };

            navBar.appendChild(button);
        }

        // Add to page
        document.body.insertBefore(navBar, document.body.firstChild);

        console.log('Navigation bar created successfully!');
    }

    // Focus the M365 chat input textbox
    function focusChatInput() {
        console.log("Attempting to focus chat input...");

        // Try multiple selectors to find the input
        const selectors = [
            '#m365-chat-editor-target-element',
            '[role="combobox"][contenteditable="true"]',
            '.fai-EditorInput__input[contenteditable="true"]',
            '[aria-label="Message Copilot"]'
        ];

        for (const selector of selectors) {
            const input = document.querySelector(selector);
            if (input) {
                console.log(`Found chat input with selector: ${selector}`);

                // Try multiple focus methods for better compatibility
                setTimeout(() => {
                    input.focus();
                    input.click();

                    // Trigger a click on parent if needed
                    const parent = input.closest('.fai-EditorInput');
                    if (parent) {
                        parent.click();
                    }

                    console.log("Chat input focused successfully!");
                }, 100);

                return true;
            }
        }

        console.log("Chat input not found yet");
        return false;
    }

    // Original auto-click functionality
    let attempts = 0;
    const maxAttempts = 20;
    const delay = 500;
    const editorDelay = 1000;
    let buttonClicked = false;
    let editorClicked = false;
    let mobileAppPopupDismissed = false;

    function findAndClickButton() {
        if (buttonClicked) return;
        attempts++;
        console.log(`Attempt ${attempts}: Looking for GPT-5 button...`);
        const buttons = document.querySelectorAll('button[aria-pressed="false"]');
        let found = false;
        buttons.forEach(button => {
            if (button.textContent.includes("Try GPT-5") && !buttonClicked) {
                console.log("Found GPT-5 button, clicking...");
                button.click();
                found = true;
                buttonClicked = true;
                setTimeout(() => {
                    findAndClickEditor();
                }, editorDelay);
            }
        });
        if (found) {
            console.log("GPT-5 button clicked successfully!");
            // Focus input after clicking button
            setTimeout(focusChatInput, 500);
            observer.disconnect();
            return;
        }
        if (attempts < maxAttempts && !buttonClicked) {
            setTimeout(findAndClickButton, delay);
        } else if (!buttonClicked) {
            console.log("Max attempts reached, GPT-5 button not found");
        }
    }

    function findAndClickEditor() {
        if (editorClicked) return;
        console.log("Looking for chat editor element...");
        const editorElement = document.getElementById('m365-chat-editor-target-element');
        if (editorElement) {
            console.log("Found chat editor element, clicking...");
            editorElement.click();
            editorClicked = true;
            console.log("Chat editor element clicked successfully!");
            // Focus input after clicking editor
            setTimeout(focusChatInput, 300);
        } else {
            console.log("Chat editor element not found yet");
        }
    }

    function dismissMobileAppPopup() {
        if (mobileAppPopupDismissed) return;

        // Try multiple selectors to find the dismiss button
        const selectors = [
            'button[aria-label="Dismiss"]',
            'button[aria-label="Got it"]',
            'div[role="dialog"][aria-label="Tips"] button:has(div[aria-label="Got it"])',
            '.fui-TeachingPopoverSurface button'
        ];

        let dismissed = false;
        for (const selector of selectors) {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(button => {
                if ((button.getAttribute('aria-label') === 'Dismiss' ||
                     button.textContent.includes('Got it')) &&
                    !mobileAppPopupDismissed) {
                    console.log("Found mobile app popup button, dismissing...");
                    button.click();
                    mobileAppPopupDismissed = true;
                    dismissed = true;
                    console.log("Mobile app popup dismissed successfully!");
                }
            });
        }

        // Also try to hide the popup directly if dismiss doesn't work
        const popup = document.querySelector('div[role="dialog"][aria-label="Tips"]');
        if (popup && !mobileAppPopupDismissed) {
            console.log("Hiding mobile app popup directly...");
            popup.style.display = 'none';
            mobileAppPopupDismissed = true;
            dismissed = true;
        }

        // Focus input after dismissing popup
        if (dismissed) {
            setTimeout(focusChatInput, 300);
        }
    }

    // Initialize navigation bar with delay
    function initNavigationBar() {
        // Wait for page to fully load and settle
        setTimeout(() => {
            createNavigationBar();

            // Re-check periodically in case it gets hidden or removed
            // Run checks every 2 seconds for the first 1 minute
            let checkCount = 0;
            const maxChecks = 30; // 30 checks × 2 seconds = 1 minute

            const intervalId = setInterval(() => {
                checkCount++;

                if (!document.getElementById('ai-nav-bar')) {
                    console.log('Navigation bar was removed, recreating...');
                    createNavigationBar();
                }

                // Stop checking after 2 minutes
                if (checkCount >= maxChecks) {
                    clearInterval(intervalId);
                    console.log('Navigation bar monitoring stopped after 1 minute');
                }
            }, 2000);
        }, 300); // Wait 0.3 seconds after page load
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigationBar);
    } else if (document.readyState === 'interactive') {
        initNavigationBar();
    } else {
        // Page already fully loaded
        initNavigationBar();
    }

    // Original auto-click initialization (M365 ONLY)
    const isM365 = window.location.hostname.includes('m365.cloud.microsoft');

    if (isM365) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(findAndClickButton, 1000);
            });
        } else {
            setTimeout(findAndClickButton, 1000);
        }

        window.addEventListener('load', () => {
            setTimeout(findAndClickButton, 2000);
            // Also try to focus input on initial load
            setTimeout(focusChatInput, 2500);
        });

        const observer = new MutationObserver((mutations) => {
            if (buttonClicked) return;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (node.tagName === 'BUTTON' || node.querySelector('button'))) {
                            setTimeout(findAndClickButton, 500);
                        }
                        // Check for mobile app popup
                        if (node.nodeType === 1 && node.querySelector &&
                            (node.querySelector('div[role="dialog"][aria-label="Tips"]') ||
                             node.getAttribute('role') === 'dialog')) {
                            setTimeout(dismissMobileAppPopup, 300);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial check for mobile app popup
        setTimeout(dismissMobileAppPopup, 1500);
        setTimeout(dismissMobileAppPopup, 3000);
        setTimeout(dismissMobileAppPopup, 5000);

        setTimeout(() => {
            observer.disconnect();
            console.log("MutationObserver disconnected");
        }, 30000);
    }
})();