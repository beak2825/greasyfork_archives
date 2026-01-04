// ==UserScript==
// @name         Claude Reopen Artifacts Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to reopen the artifacts panel in Claude
// @author       Rob Vandenberg
// @match        https://claude.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553600/Claude%20Reopen%20Artifacts%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/553600/Claude%20Reopen%20Artifacts%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to find and click the most recent artifact link
    function reopenArtifacts() {
        // Look for artifact cards with the specific structure
        // They have role="button" and aria-label="Preview contents"
        const artifactCards = document.querySelectorAll('div[role="button"][aria-label="Preview contents"]');

        if (artifactCards.length > 0) {
            // Click the last (most recent) artifact
            artifactCards[artifactCards.length - 1].click();
            console.log('Clicked artifact card to reopen panel');
            return true;
        }

        // Fallback: Look for any artifact-related clickable elements
        const artifactBlocks = document.querySelectorAll('.artifact-block-cell, [class*="artifact-block"]');
        if (artifactBlocks.length > 0) {
            const parent = artifactBlocks[artifactBlocks.length - 1].closest('[role="button"]');
            if (parent) {
                parent.click();
                console.log('Clicked artifact block to reopen panel');
                return true;
            }
        }

        alert('Could not find any artifacts to reopen. Try scrolling to an artifact in the chat first.');
        return false;
    }

    // Create the reopen button
    function createReopenButton() {
        const button = document.createElement('button');
        button.innerHTML = '📄 Reopen Artifacts';
        button.style.cssText = `
            position: fixed;
            top: 60px;
            right: 12px;
            z-index: 9999;
            padding: 12px 20px;
            background: #6366f1;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.2s;
            display: none;
        `;

        button.onmouseover = () => {
            button.style.background = '#4f46e5';
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
        };

        button.onmouseout = () => {
            button.style.background = '#6366f1';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        };

        button.onclick = reopenArtifacts;

        document.body.appendChild(button);
        return button;
    }

    // Monitor if artifacts panel is visible or hidden
    function monitorArtifactsPanel() {
        const button = createReopenButton();

        const observer = new MutationObserver(() => {
            // Look for the artifacts panel - it has style with "flex: 50 1 0%"
            const allDivs = document.querySelectorAll('div');
            let artifactsPanelVisible = false;

            for (const div of allDivs) {
                const style = div.getAttribute('style');
                if (style && style.includes('flex: 50 1 0%')) {
                    artifactsPanelVisible = true;
                    break;
                }
            }

            // Show button only when artifacts panel is hidden
            if (!artifactsPanelVisible) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // Also run the check immediately
        observer.takeRecords();
    }

    // Wait for page to load, then initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', monitorArtifactsPanel);
    } else {
        monitorArtifactsPanel();
    }
})();