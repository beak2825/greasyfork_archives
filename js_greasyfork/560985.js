// ==UserScript==
// @name        Relations Online Checker
// @namespace   https://popmundo.com/
// @version     1.1.1
// @description Shows online status for characters on the Relations page
// @author      anon
// @match       https://*.popmundo.com/World/Popmundo.aspx/Character/Relations/*
// @grant       GM_xmlhttpRequest
// @connect     *
// @downloadURL https://update.greasyfork.org/scripts/560985/Relations%20Online%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/560985/Relations%20Online%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ONLINE_CHECK_DELAY = 150;
    let characterCache = {};
    let isChecking = false;

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Check if a character is online
    function checkCharacterOnline(id) {
        return new Promise((resolve) => {
            if (characterCache[id] !== undefined) {
                return resolve(characterCache[id]);
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: `/World/Popmundo.aspx/Character/${id}`,
                onload: function (response) {
                    let isOnline = false;
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const onlineRow = doc.querySelector("#ctl00_cphLeftColumn_ctl00_trOnlineStatus");

                        if (onlineRow) {
                            const text = onlineRow.textContent.trim();
                            if (text.includes("Online Status:") && !text.includes("Last Login:")) {
                                isOnline = true;
                            }
                            else if (text.includes("Currently Online") || text.includes("Online now")) {
                                isOnline = true;
                            }
                            else if (!text.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
                                isOnline = true;
                            }
                        }

                        const onlineIcon = doc.querySelector('img[src*="online"], img[alt*="online"]');
                        if (onlineIcon) isOnline = true;
                    }

                    characterCache[id] = isOnline;
                    resolve(isOnline);
                },
                onerror: function () {
                    resolve(false);
                }
            });
        });
    }

    // Create a compact progress bar
    function createProgressBar() {
        const container = document.createElement('div');
        container.style.cssText = `
            margin: 6px 0;
            padding: 4px 8px;
            background: #f8f9fa;
            border-radius: 13px;
            border: 1px solid #e1e4e8;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 10px;
            color: #586069;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        const text = document.createElement('span');
        text.id = 'progressText';
        text.textContent = 'Starting...';
        text.style.cssText = 'flex: 0 0 auto; white-space: nowrap;';

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            flex: 1;
            height: 4px;
            background: #e1e4e8;
            border-radius: 2px;
            overflow: hidden;
            min-width: 80px;
        `;

        const progressFill = document.createElement('div');
        progressFill.id = 'progressFill';
        progressFill.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #28a745, #34d058);
            border-radius: 2px;
            transition: width 0.2s ease;
        `;

        progressBar.appendChild(progressFill);
        container.appendChild(text);
        container.appendChild(progressBar);

        return { container, text, progressFill };
    }

    // Update progress
    function updateProgress(element, text, percent) {
        if (element.text) element.text.textContent = text;
        if (element.progressFill) element.progressFill.style.width = `${percent}%`;
    }

    // Add online status indicators
    async function addOnlineIndicators() {
        if (isChecking) return;
        isChecking = true;

        const button = document.querySelector('#checkOnlineBtn');
        if (button) {
            button.disabled = true;
            button.innerHTML = '⏳';
            button.style.opacity = '0.7';
        }

        const table = document.querySelector('table.data tbody');
        if (!table) {
            isChecking = false;
            if (button) {
                button.disabled = false;
                button.innerHTML = '●';
                button.style.opacity = '0.4';
            }
            return;
        }

        // Remove existing indicators and progress bars
        table.querySelectorAll('.online-indicator').forEach(el => el.remove());
        document.querySelectorAll('#onlineCheckProgress').forEach(el => el.remove());

        // Add progress bar between h1 and table
        const progress = createProgressBar();
        progress.container.id = 'onlineCheckProgress';

        const tableElement = document.querySelector('table.data');
        const h1 = document.querySelector('h1');
        if (tableElement && h1) {
            // Insert after the h1's parent element (or the pager div if it exists)
            const pagerDiv = document.querySelector('#ctl00_cphLeftColumn_ctl00_pnlPager');
            if (pagerDiv) {
                pagerDiv.parentNode.insertBefore(progress.container, pagerDiv.nextSibling);
            } else {
                tableElement.parentNode.insertBefore(progress.container, tableElement);
            }
        }

        const rows = table.querySelectorAll('tr');
        let onlineCount = 0;
        let checkedCount = 0;
        const totalToCheck = rows.length;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const link = row.querySelector('a[href*="/Character/"]');

            if (link) {
                const name = link.textContent.trim();
                if (name.includes('💀')) continue;

                const id = link.href.match(/Character\/(\d+)/)?.[1];
                if (id) {
                    const isOnline = await checkCharacterOnline(id);
                    checkedCount++;

                    if (isOnline) {
                        onlineCount++;

                        const indicator = document.createElement('span');
                        indicator.className = 'online-indicator';
                        indicator.style.cssText = `
                            margin-left: 4px;
                            display: inline-block;
                            width: 6px;
                            height: 6px;
                            background: #28a745;
                            border-radius: 50%;
                            vertical-align: middle;
                            box-shadow: 0 0 0 1px rgba(40, 167, 69, 0.2);
                            cursor: help;
                        `;
                        indicator.title = 'Online now';

                        link.parentElement.appendChild(indicator);
                    }

                    const percent = Math.round((checkedCount / totalToCheck) * 100);
                    updateProgress(progress,
                        `${checkedCount}/${totalToCheck} checked • ${onlineCount} online`,
                        percent
                    );

                    await wait(ONLINE_CHECK_DELAY);
                }
            }
        }

        // Final update
        updateProgress(progress,
            `✓ ${onlineCount} of ${checkedCount} friends online`,
            100
        );
        progress.container.style.background = onlineCount > 0 ? '#f0fff4' : '#f8f9fa';
        progress.progressFill.style.background = '#28a745';

        // Remove progress bar after 4 seconds
        setTimeout(() => {
            if (progress.container.parentElement) {
                progress.container.remove();
            }
        }, 4000);

        // Re-enable button
        isChecking = false;
        if (button) {
            button.disabled = false;
            button.innerHTML = '●';
            button.style.opacity = '0.4';
        }

        console.log(`Online check: ${onlineCount}/${checkedCount} online`);
    }

    // Create a very subtle button attached to h1
    function addCheckOnlineButton() {
        if (document.querySelector('#checkOnlineBtn')) return;

        const button = document.createElement('button');
        button.id = 'checkOnlineBtn';
        button.innerHTML = '●';
        button.type = 'button';
        button.title = 'Check who\'s online';
        button.style.cssText = `
            display: inline-block;
            margin-left: 8px;
            padding: 0;
            background: transparent;
            color: #6a737d;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: 400;
            transition: all 0.15s ease;
            outline: none;
            line-height: 1;
            vertical-align: middle;
            opacity: 0.4;
            position: relative;
            top: -1px;
        `;

        button.onmouseover = () => {
            if (!button.disabled) {
                button.style.opacity = '0.8';
                button.style.color = '#24292e';
            }
        };
        button.onmouseout = () => {
            if (!button.disabled) {
                button.style.opacity = '0.4';
                button.style.color = '#6a737d';
            }
        };
        button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            addOnlineIndicators();
        };

        // Find h1 and attach button to it
        const h1 = document.querySelector('h1');
        if (h1 && h1.textContent.includes('Relationships')) {
            h1.appendChild(button);
        }
    }

    // Initialize
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addCheckOnlineButton);
        } else {
            addCheckOnlineButton();
        }

        const observer = new MutationObserver(() => {
            if (!document.querySelector('#checkOnlineBtn')) {
                addCheckOnlineButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();