// ==UserScript==
// @name         CPH Submit with Submission History
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Codeforces Submit add-on for CPH. Now with persistent submission history.
// @author       Sam5440
// @match        *://codeforces.com/*
// @match        *://codeforces.ml/*
// @connect      localhost
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555407/CPH%20Submit%20with%20Submission%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/555407/CPH%20Submit%20with%20Submission%20History.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Config and storage keys ---
    const CPH_SERVER_ENDPOINT = 'http://localhost:27121/getSubmit';
    const GM_STORAGE_KEY_SUBMISSION = 'cph_submission_data';
    const GM_STORAGE_KEY_SETTINGS = 'cph_settings_data';
    const GM_STORAGE_KEY_HISTORY = 'cph_submission_history'; // Dedicated key for submission history
    const MAX_HISTORY_ENTRIES = 30; // Maximum 30 submissions saved

    // --- State variables ---
    let settings = {
        pollingEnabled: true,
        loopTimeout: 3000,
        debug: false // Debug logs off by default
    };
    let pollingIntervalId = null;

    // --- Internal debug log function ---
    const debugLog = (...args) => {
        if (settings.debug) {
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
            console.log('[cph-submit]', message);
        }
    };

    // --- Log submission history ---
    const logSubmission = async (submissionData) => {
        const historyEntry = {
            timestamp: new Date().toISOString(),
            problemName: submissionData.problemName,
            url: submissionData.url,
            languageId: submissionData.languageId,
            sourceCode: submissionData.sourceCode
        };

        try {
            const historyString = await GM_getValue(GM_STORAGE_KEY_HISTORY, '[]');
            let history = JSON.parse(historyString);
            history.unshift(historyEntry); // Add to front, latest first

            if (history.length > MAX_HISTORY_ENTRIES) {
                history = history.slice(0, MAX_HISTORY_ENTRIES);
            }
            await GM_setValue(GM_STORAGE_KEY_HISTORY, JSON.stringify(history));
            debugLog('Submission logged to history.');
        } catch (e) {
            console.error('[cph-submit] Failed to write to submission history:', e);
        }
    };

    // --- Helper functions ---
    const isContestProblem = (problemUrl) => problemUrl.includes('/contest/');
    const getSubmitUrl = (problemUrl) => {
        if (!isContestProblem(problemUrl)) return 'https://codeforces.com/problemset/submit';
        try {
            const url = new URL(problemUrl);
            const contestNumber = url.pathname.split('/')[2];
            return `https://codeforces.com/contest/${contestNumber}/submit`;
        } catch (e) {
            debugLog('Error parsing problem URL:', e);
            return 'https://codeforces.com/problemset/submit';
        }
    };

    // --- Form filling logic ---
    const fillAndSubmitForm = async () => {
        const dataString = await GM_getValue(GM_STORAGE_KEY_SUBMISSION, null);
        if (!dataString) return;

        await GM_setValue(GM_STORAGE_KEY_SUBMISSION, null);

        try {
            const data = JSON.parse(dataString);
            debugLog('Handling submit data', data);

            const langEl = document.querySelector('select[name="programTypeId"]');
            const sourceEl = document.querySelector('textarea[name="source"]');
            if (!langEl || !sourceEl) {
                console.error('[cph-submit] Could not find form elements.');
                return;
            }

            sourceEl.value = data.sourceCode;
            sourceEl.dispatchEvent(new Event('input', { bubbles: true }));
            langEl.value = data.languageId.toString();
            langEl.dispatchEvent(new Event('change', { bubbles: true }));

            if (!isContestProblem(data.url)) {
                const problemEl = document.querySelector('input[name="submittedProblemCode"]');
                if (problemEl) {
                    problemEl.value = data.problemName;
                    problemEl.dispatchEvent(new Event('input', { bubbles: true }));
                }
            } else {
                const problemIndexEl = document.querySelector('select[name="submittedProblemIndex"]');
                if (problemIndexEl) {
                    problemIndexEl.value = data.url.split('/problem/')[1];
                    problemIndexEl.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            debugLog('Form filled. Submitting...');
            const submitBtn = document.querySelector('input.submit');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.click();
            } else {
                console.error('[cph-submit] Could not find submit button.');
            }
        } catch (e) {
            console.error('[cph-submit] Error while processing submission:', e);
        }
    };

    // --- Polling logic ---
    const pollCphServer = () => {
        debugLog('Polling CPH server...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: CPH_SERVER_ENDPOINT,
            headers: { 'cph-submit': 'true' },
            timeout: settings.loopTimeout - 500,
            onload: async (response) => {
                if (response.status !== 200) {
                    debugLog('Error response from CPH server:', response.status, response.statusText);
                    return;
                }
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.empty) {
                        debugLog('Got empty response from CPH.');
                        return;
                    }
                    if (data.problemName && data.languageId && data.sourceCode && data.url) {
                        debugLog('Got valid response from CPH:', data.problemName);
                        // Log submission here
                        await logSubmission(data);
                        await GM_setValue(GM_STORAGE_KEY_SUBMISSION, JSON.stringify(data));
                        GM_openInTab(getSubmitUrl(data.url), { active: true });
                    } else {
                        debugLog('Received invalid data from CPH:', data);
                    }
                } catch (e) {
                    debugLog('Error parsing JSON from CPH server:', e.toString());
                }
            },
            onerror: () => debugLog('Could not connect to CPH server. Is cph (VS Code) running?'),
            ontimeout: () => debugLog('Request to CPH server timed out.')
        });
    };

    // --- Settings UI & logic ---
    const createSettingsUI = () => {
        GM_addStyle(`
            #cph-settings-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; max-height: 80vh; background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 8px rgba(0,0,0,0.2); display: none; font-family: sans-serif; flex-direction: column; }
            #cph-settings-panel .header { padding: 10px 15px; background-color: #ececec; font-weight: bold; border-bottom: 1px solid #ccc; cursor: move; border-top-left-radius: 8px; border-top-right-radius: 8px; }
            #cph-settings-panel .header .close-btn { float: right; cursor: pointer; font-weight: bold; }
            #cph-settings-panel .content { padding: 15px; overflow-y: auto; }
            #cph-settings-panel .setting { margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
            #cph-settings-panel .setting label { margin-right: 10px; }
            #cph-settings-panel .setting input[type="number"] { width: 80px; }
            #cph-submission-history { margin-top: 10px; }
            .submission-entry { background-color: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 10px; margin-bottom: 10px; }
            .submission-entry .meta { font-size: 13px; color: #555; margin-bottom: 8px; }
            .submission-entry .meta a { color: #007bff; text-decoration: none; }
            .submission-entry .meta a:hover { text-decoration: underline; }
            .submission-entry pre { max-height: 200px; overflow-y: auto; background-color: #fdfdfd; border: 1px solid #eee; padding: 8px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
            .submission-entry code { font-family: "Courier New", Courier, monospace; font-size: 12px; color: #333; }
            #cph-settings-panel .footer { padding: 10px; text-align: right; border-top: 1px solid #ccc; background-color: #ececec; }
        `);

        const panel = document.createElement('div');
        panel.id = 'cph-settings-panel';
        panel.innerHTML = `
            <div class="header">CPH Submit Settings<span class="close-btn">&times;</span></div>
            <div class="content">
                <div class="setting"><label for="cph-polling-enabled">Enable Polling</label><input type="checkbox" id="cph-polling-enabled"></div>
                <div class="setting"><label for="cph-debug-mode">Enable Console Logs (Debug)</label><input type="checkbox" id="cph-debug-mode"></div>
                <div class="setting"><label for="cph-loop-timeout">Polling Interval (ms)</label><input type="number" id="cph-loop-timeout" min="1000" step="500"></div>
                <hr>
                <strong>Submission History:</strong>
                <div id="cph-submission-history"><p>Loading history...</p></div>
            </div>
            <div class="footer">
                 <button id="cph-clear-history">Clear History</button>
                 <button id="cph-refresh-history">Refresh History</button>
            </div>
        `;
        document.body.appendChild(panel);

        // Event listeners
        panel.querySelector('.close-btn').addEventListener('click', () => panel.style.display = 'none');
        panel.querySelector('#cph-polling-enabled').addEventListener('change', (e) => saveAndUpdateSettings({ pollingEnabled: e.target.checked }));
        panel.querySelector('#cph-debug-mode').addEventListener('change', (e) => saveAndUpdateSettings({ debug: e.target.checked }));
        panel.querySelector('#cph-loop-timeout').addEventListener('change', (e) => saveAndUpdateSettings({ loopTimeout: parseInt(e.target.value, 10) }));
        panel.querySelector('#cph-refresh-history').addEventListener('click', updateSubmissionHistoryDisplay);
        panel.querySelector('#cph-clear-history').addEventListener('click', async () => {
            if (confirm('Are you sure you want to clear all submission history?')) {
                await GM_setValue(GM_STORAGE_KEY_HISTORY, '[]');
                updateSubmissionHistoryDisplay();
            }
        });

        // Drag functionality
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = panel.querySelector('.header');
        header.onmousedown = (e) => {
            e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = (e) => {
                e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
                pos3 = e.clientX; pos4 = e.clientY;
                panel.style.top = `${panel.offsetTop - pos2}px`;
                panel.style.left = `${panel.offsetLeft - pos1}px`;
            };
        };
    };

    const updateSubmissionHistoryDisplay = async () => {
        const historyContainer = document.getElementById('cph-submission-history');
        if (!historyContainer) return;

        const historyString = await GM_getValue(GM_STORAGE_KEY_HISTORY, '[]');
        const history = JSON.parse(historyString);

        if (history.length === 0) {
            historyContainer.innerHTML = '<p>No submissions recorded yet.</p>';
            return;
        }

        historyContainer.innerHTML = history.map(entry => `
            <div class="submission-entry">
                <div class="meta">
                    <strong>Time:</strong> ${new Date(entry.timestamp).toLocaleString()}<br>
                    <strong>Problem:</strong> <a href="${entry.url}" target="_blank">${entry.problemName}</a>
                </div>
                <pre><code>${entry.sourceCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
            </div>
        `).join('');
    };

    const updateSettingsUI = () => {
        document.getElementById('cph-polling-enabled').checked = settings.pollingEnabled;
        document.getElementById('cph-debug-mode').checked = settings.debug;
        document.getElementById('cph-loop-timeout').value = settings.loopTimeout;
    };

    const loadSettings = async () => {
        const savedSettings = await GM_getValue(GM_STORAGE_KEY_SETTINGS, null);
        if (savedSettings) {
            settings = { ...settings, ...JSON.parse(savedSettings) };
        }
    };

    const saveAndUpdateSettings = async (newSettings) => {
        settings = { ...settings, ...newSettings };
        await GM_setValue(GM_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        debugLog('Settings saved:', settings);
        updateSettingsUI();
        startOrStopPolling();
    };

    const startOrStopPolling = () => {
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
            pollingIntervalId = null;
        }
        if (settings.pollingEnabled) {
            pollingIntervalId = setInterval(pollCphServer, settings.loopTimeout);
            debugLog(`Polling started with interval ${settings.loopTimeout}ms.`);
        } else {
            debugLog('Polling stopped.');
        }
    };

    const injectMenuButton = () => {
        const ratingLink = document.querySelector('.menu-list a[href="/ratings"]');
        if (ratingLink) {
            const parentLi = ratingLink.parentElement;
            const settingsLi = document.createElement('li');
            settingsLi.innerHTML = '<a href="#" id="cph-settings-btn" style="color: #00aaff;">CPH Settings</a>';
            parentLi.insertAdjacentElement('afterend', settingsLi);

            document.getElementById('cph-settings-btn').addEventListener('click', (e) => {
                e.preventDefault();
                const panel = document.getElementById('cph-settings-panel');
                if (panel.style.display === 'flex') {
                    panel.style.display = 'none';
                } else {
                    updateSettingsUI();
                    updateSubmissionHistoryDisplay();
                    panel.style.display = 'flex';
                }
            });
        }
    };

    // --- Main execution ---
    async function main() {
        await loadSettings();
        createSettingsUI();
        injectMenuButton();

        if (window.location.href.includes('/submit')) {
            debugLog('On a submit page, attempting to fill form.');
            setTimeout(fillAndSubmitForm, 500);
        }

        startOrStopPolling();
        debugLog('Script loaded and initialized.');
    }

    main();
})();
