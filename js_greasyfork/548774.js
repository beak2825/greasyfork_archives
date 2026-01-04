// ==UserScript==
// @name         Nixpkgs PR Branch Tracker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a floating widget to Nixpkgs PR pages to track which branches the PR has been merged into.
// @license      WTFPL
// @author       shouya
// @match        https://github.com/NixOS/nixpkgs/pull/*
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.github.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548774/Nixpkgs%20PR%20Branch%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/548774/Nixpkgs%20PR%20Branch%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REPO = 'NixOS/nixpkgs';
    const BRANCHES_TO_CHECK = [
        "master",
        "nixpkgs-unstable",
        "nixos-unstable",
    ];

    // --- UTILITY FUNCTIONS ---
    async function saveToken(token) {
        await GM_setValue('github_token', token);
    }

    async function getToken() {
        return await GM_getValue('github_token', '');
    }

    async function getAuthHeaders() {
        const token = await getToken();
        if (token) {
            return {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
            };
        }
        return { 'Accept': 'application/vnd.github.v3+json' };
    }

    async function fetchPRData(prId) {
        const url = `https://api.github.com/repos/${REPO}/pulls/${prId}`;
        const headers = await getAuthHeaders();
        const response = await fetch(url, { headers });

        if (response.status === 404) {
            return { error: 'PR not found.' };
        }
        if (response.status === 403) {
            return { error: 'API rate limit exceeded. Please set a token.' };
        }
        if (response.status === 401) {
            return { error: 'Invalid token. Please correct it.' };
        }

        const data = await response.json();

        if (!data.merged) {
            return { error: 'PR is not merged.' };
        }

        return {
            mergeCommitSha: data.merge_commit_sha,
            baseBranch: data.base?.ref,
        };
    }

    async function isCommitInBranch(branch, commitSha) {
        const url = `https://api.github.com/repos/${REPO}/compare/${branch}...${commitSha}`;
        const headers = await getAuthHeaders();
        const response = await fetch(url, { headers });

        if (response.status === 404) {
            // This happens if the commit is too old or the branch is brand new
            return false;
        }

        const data = await response.json();
        // "behind" means the branch is ahead of the commit, i.e., the commit is an ancestor.
        // "identical" means the branch HEAD is exactly at this commit.
        return data.status === 'identical' || data.status === 'behind';
    }


    // --- UI CREATION ---
    function createWidget() {
        const widget = document.createElement('div');
        widget.id = 'nixpkgs-tracker-widget';
        widget.innerHTML = `
            <div class="header">
                <strong>Nixpkgs Branch Status</strong>
            </div>
            <div id="tracker-status-list"></div>
            <details>
                <summary>Configure Token</summary>
                <div class="token-area">
                    <input type="password" id="tracker-token-input" placeholder="Set GitHub PAT"/>
                    <button id="tracker-token-save">Save</button>
                </div>
            </details>
            <div id="tracker-main-status" class="status-message">Loading PR data...</div>
        `;
        document.body.appendChild(widget);

        // Add styles
        const style = document.createElement('style');
        style.innerHTML = `
            #nixpkgs-tracker-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 250px;
                background-color: #f6f8fa;
                border: 1px solid #d1d5da;
                border-radius: 6px;
                padding: 12px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                font-size: 13px;
                z-index: 9999;
                box-shadow: 0 1px 15px rgba(27,31,35,.15);
                color: #24292e;
            }
            #nixpkgs-tracker-widget .header {
                font-size: 14px;
                border-bottom: 1px solid #e1e4e8;
                padding-bottom: 8px;
                margin-bottom: 8px;
            }
            #nixpkgs-tracker-widget .branch-status {
                display: flex;
                justify-content: space-between;
                padding: 4px 0;
            }
            #nixpkgs-tracker-widget .status-message {
                margin-top: 8px;
                font-style: italic;
                color: #586069;
            }
            #nixpkgs-tracker-widget .token-area {
                margin-top: 10px;
                display: flex;
            }
            #nixpkgs-tracker-widget #tracker-token-input {
                flex-grow: 1;
                min-width: 0;
                padding: 3px 6px;
                border: 1px solid #d1d5da;
                border-radius: 4px 0 0 4px;
            }
            #nixpkgs-tracker-widget #tracker-token-save {
                padding: 3px 8px;
                border: 1px solid #1b1f2326;
                border-left: 0;
                background-color: #fafbfc;
                cursor: pointer;
                border-radius: 0 4px 4px 0;
            }
            #nixpkgs-tracker-widget #tracker-token-save:hover {
                background-color: #f3f4f6;
            }
        `;
        document.head.appendChild(style);

        // Add event listener for the save button
        document.getElementById('tracker-token-save').addEventListener('click', async () => {
            const tokenInput = document.getElementById('tracker-token-input');
            const token = tokenInput.value;
            await saveToken(token);
            tokenInput.value = '';
            tokenInput.placeholder = 'Token saved!';
            setTimeout(() => {
                tokenInput.placeholder = 'Set GitHub PAT';
                // Reload checks with the new token
                runChecks();
            }, 2000);
        });
    }

    function updateStatus(branchName, status, message = '') {
        const element = document.getElementById(`status-${branchName}`);
        if (element) {
            let symbol = '⏳'; // Loading
            if (status === 'merged') symbol = '✅';
            if (status === 'unmerged') symbol = '❌';

            element.innerHTML = `<span>${branchName}</span><span>${symbol} ${message}</span>`;
        }
    }

    function setMainStatus(message) {
        document.getElementById('tracker-main-status').textContent = message;
    }


    // --- MAIN LOGIC ---
    async function runChecks() {
        const pathParts = window.location.pathname.split('/');
        const prId = pathParts[4];

        if (!prId || !/^\d+$/.test(prId)) {
            setMainStatus('Not a valid PR page.');
            return;
        }

        // Initialize UI for branches
        const statusList = document.getElementById('tracker-status-list');
        statusList.innerHTML = ''; // Clear previous results on re-run
        setMainStatus('Loading PR data...');

        BRANCHES_TO_CHECK.forEach(branch => {
            const el = document.createElement('div');
            el.className = 'branch-status';
            el.id = `status-${branch}`;
            el.innerHTML = `<span>${branch}</span><span>⏳ Loading...</span>`;
            statusList.appendChild(el);
        });

        const prData = await fetchPRData(prId);

        if (prData.error) {
            setMainStatus(prData.error);
            // Clear the loading state for branches
            BRANCHES_TO_CHECK.forEach(branch => {
                 document.getElementById(`status-${branch}`).innerHTML = `<span>${branch}</span><span>-</span>`;
            });
            return;
        }

        setMainStatus(`Checking commit ${prData.mergeCommitSha.slice(0, 7)}...`);

        // Check all branches concurrently
        const checks = BRANCHES_TO_CHECK.map(async (branch) => {
            try {
                const isMerged = await isCommitInBranch(branch, prData.mergeCommitSha);
                updateStatus(branch, isMerged ? 'merged' : 'unmerged', isMerged ? 'Merged' : 'Not Merged');
            } catch (e) {
                updateStatus(branch, 'error', 'Error');
                console.error(`Error checking branch ${branch}:`, e);
            }
        });

        await Promise.all(checks);
        setMainStatus('Checks complete.');
    }

    // --- SCRIPT EXECUTION ---
    createWidget();
    runChecks();

})();