// ==UserScript==
// @name         Amazon Vine Review Status Updater
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Updates review status from "Not yet reviewed" to "Review pending" based on URL changes
// @author       Prismaris
// @match        https://www.amazon.ca/vine/vine-reviews*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550404/Amazon%20Vine%20Review%20Status%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/550404/Amazon%20Vine%20Review%20Status%20Updater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const PENDING_COLOR = '#c44';

    // Add CSS for multi-line status and bold styling
    document.head.appendChild(Object.assign(document.createElement('style'), {
        textContent: `.review-pending { line-height: 1.2; white-space: pre-line; font-weight: bold; color: ${PENDING_COLOR}; }`
    }));

    // Function to monitor URL changes with aggressive iframe cleanup
    function monitorUrlChange(originalUrl) {
        return new Promise((resolve, reject) => {
            const iframe = Object.assign(document.createElement('iframe'), {
                style: 'display:none;visibility:hidden;position:absolute;left:-9999px;width:1px;height:1px'
            });

            let resolved = false, checkCount = 0;
            const cleanup = () => {
                if (iframe.parentNode) {
                    iframe.src = 'about:blank';
                    iframe.parentNode.removeChild(iframe);
                }
            };
            
            const maxTimeout = setTimeout(() => !resolved && (resolved = true, cleanup(), resolve(false)), 8000);
            const getDelay = () => checkCount < 5 ? 50 : checkCount < 15 ? 150 : 300;

            const checkUrl = () => {
                if (resolved) return;
                checkCount++;
                
                try {
                    const currentUrl = iframe.contentWindow.location.href;
                    if (currentUrl.includes('edit?') && !originalUrl.includes('edit?')) {
                        console.log(`⚡ URL changed after ${checkCount} checks: ${currentUrl}`);
                        resolved = true;
                        clearTimeout(maxTimeout);
                        cleanup();
                        resolve(true);
                        return;
                    }
                } catch (e) {
                    resolved = true;
                    clearTimeout(maxTimeout);
                    cleanup();
                    checkContentForDraft(originalUrl).then(resolve).catch(reject);
                    return;
                }
                setTimeout(checkUrl, getDelay());
            };

            iframe.onload = () => setTimeout(checkUrl, 100);
            iframe.onerror = () => !resolved && (resolved = true, clearTimeout(maxTimeout), cleanup(), reject(new Error('Failed to load iframe')));

            document.body.appendChild(iframe);
            iframe.src = originalUrl;
        });
    }

    // Fallback method using content analysis
    function checkContentForDraft(originalUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: originalUrl,
                timeout: 10000,
                onload: response => resolve((response.responseText || '').match(/edit\?|draft|continue writing|resume review/)),
                onerror: () => reject(new Error('Request failed')),
                ontimeout: () => reject(new Error('Request timed out'))
            });
        });
    }

    // Function to process a single row
    async function processRow(row) {
        const statusCell = row.querySelector('td.vvp-reviews-table--text-col:nth-child(4)');
        const reviewButton = row.querySelector('a[name="vvp-reviews-table--review-item-btn"]');
        
        if (!statusCell || !reviewButton || statusCell.textContent.trim() !== 'Not yet reviewed') return;

        const reviewUrl = reviewButton.href;
        if (!reviewUrl?.includes('create-review')) return;

        try {
            console.log(`Monitoring ${reviewUrl}...`);
            const hasChanged = await monitorUrlChange(reviewUrl);
            
            if (hasChanged) {
                statusCell.textContent = 'Review\npending';
                statusCell.classList.add('review-pending');
                console.log(`✓ Status updated to "Review pending" for ${reviewUrl}`);
            } else {
                console.log(`✗ No change detected for ${reviewUrl}`);
            }
        } catch (error) {
            console.error(`Error processing ${reviewUrl}:`, error);
        }
    }

    // Main function with staggered processing
    function processAllRows() {
        const rows = document.querySelectorAll('tr.vvp-reviews-table--row');
        if (!rows.length) return console.log('No review rows found');

        console.log(`Processing ${rows.length} review rows with human-like timing...`);
        rows.forEach((row, i) => setTimeout(() => processRow(row), (Math.random() * 200 + 100) * i));
    }

    // Setup mutation observer for dynamic content
    new MutationObserver(mutations => {
        if (mutations.some(m => Array.from(m.addedNodes).some(n => 
            n.nodeType === 1 && (n.matches?.('tr.vvp-reviews-table--row') || n.querySelector?.('tr.vvp-reviews-table--row'))
        ))) processAllRows();
    }).observe(document.body, { childList: true, subtree: true });

    // Initialize script
    (document.readyState === 'loading' ? 
        document.addEventListener('DOMContentLoaded', processAllRows) : 
        processAllRows()
    );
    
    console.log('🤖 Amazon Vine Review Status Updater loaded - human-like timing mode');
})();