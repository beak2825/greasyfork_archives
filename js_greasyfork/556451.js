// ==UserScript==
// @name         Azure AI Foundry
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes the AI chat menu bigger
// @match        https://ai.azure.com/nextgen/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556451/Azure%20AI%20Foundry.user.js
// @updateURL https://update.greasyfork.org/scripts/556451/Azure%20AI%20Foundry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Azure AI Foundry Userscript: Starting...');

    // Add CSS to expand the ASK AI chat sidebar to 1800px
    const style = document.createElement('style');
    style.id = 'azure-ai-sidebar-expander';
    style.textContent = `
        /* Target the ASK AI sidebar specifically with high specificity */
        div.fui-InlineDrawer.fui-Drawer._rightPanel_1envo_1._rightPanel_1mu44_89,
        div.fui-InlineDrawer.fui-Drawer._rightPanel_1envo_1,
        div.fui-Drawer._rightPanel_1envo_1,
        div._rightPanel_1envo_1,
        [class*="_rightPanel_1envo"] {
            max-width: 1800px !important;
            width: 1800px !important;
            min-width: 1800px !important;
        }
    `;

    // Add the style to the page immediately
    if (!document.getElementById('azure-ai-sidebar-expander')) {
        (document.head || document.documentElement).appendChild(style);
        console.log('Azure AI Foundry: Chat sidebar CSS applied');
    }

    // Function to directly set the width on the element
    function expandSidebar() {
        const sidebar = document.querySelector('.fui-InlineDrawer.fui-Drawer._rightPanel_1envo_1');
        if (sidebar) {
            sidebar.style.setProperty('width', '1800px', 'important');
            sidebar.style.setProperty('max-width', '1800px', 'important');
            sidebar.style.setProperty('min-width', '1800px', 'important');
            console.log('Azure AI Foundry: ✓ Sidebar width set directly to 1800px!');
            return true;
        }
        return false;
    }

    // Function to toggle the Agent Helper sidebar on
    function toggleAgentHelper() {
        const button = document.querySelector('button[aria-label="Agent Helper"][aria-pressed="false"]');

        if (button) {
            console.log('Azure AI Foundry: Found Agent Helper button, clicking...');

            // Simulate a real user click with all events
            button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            button.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            }));

            console.log('Azure AI Foundry: ✓ Agent Helper button clicked!');
            return true;
        }

        return false;
    }

    // Check if sidebar is open
    function isSidebarOpen() {
        return document.querySelector('.fui-InlineDrawer.fui-Drawer[class*="_rightPanel"]') !== null;
    }

    // Try to open the sidebar with retries
    function init() {
        console.log('Azure AI Foundry: Waiting for page to load...');

        let attempts = 0;
        const maxAttempts = 5;

        function tryOpen() {
            attempts++;

            if (isSidebarOpen()) {
                console.log('Azure AI Foundry: ✓ Sidebar already open!');
                expandSidebar();
                return;
            }

            if (toggleAgentHelper()) {
                // Check if it opened after clicking
                setTimeout(() => {
                    if (isSidebarOpen()) {
                        console.log('Azure AI Foundry: ✓ Sidebar opened!');
                        // Directly set the width
                        setTimeout(() => {
                            expandSidebar();
                        }, 100);
                    } else if (attempts < maxAttempts) {
                        console.log(`Azure AI Foundry: Sidebar didn't open, retrying... (attempt ${attempts}/${maxAttempts})`);
                        setTimeout(tryOpen, 2000);
                    } else {
                        console.log('Azure AI Foundry: ⚠ Max attempts reached. CSS will still work when you manually open it.');
                    }
                }, 500);
            } else if (attempts < maxAttempts) {
                console.log(`Azure AI Foundry: Button not found, retrying... (attempt ${attempts}/${maxAttempts})`);
                setTimeout(tryOpen, 2000);
            } else {
                console.log('Azure AI Foundry: ⚠ Button not found after max attempts. CSS will work when you manually open the sidebar.');
            }
        }

        // Start trying after initial delay
        setTimeout(tryOpen, 2000);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
