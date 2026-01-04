// ==UserScript==
// @name         Roblox Mass Appeal
// @namespace    github.com/annaroblox
// @version      1.6
// @description  Adds a button to appeal all appealable items on the Roblox violations page with a custom message.
// @author       AnnaRoblox
// @license MIT
// @match        *://*.roblox.com/report-appeals*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      apis.roblox.com
// @connect      auth.roblox.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554845/Roblox%20Mass%20Appeal.user.js
// @updateURL https://update.greasyfork.org/scripts/554845/Roblox%20Mass%20Appeal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Roblox Mass Appeal [v1.6]: Script active. Waiting for page content...");

    // --- Configuration ---
    const APPEAL_MESSAGE_PLACEHOLDER = "I believe this moderation action was applied in error. I have reviewed the Roblox Community Standards and I do not think my content/behavior violated them. I would appreciate it if you would review this case again. Thank you.";

    // --- UI and Styling ---
    function addAppealUI(injectionPoint) {
        if (document.getElementById('mass-appeal-container')) return;

        console.log(`Roblox Mass Appeal: Found a valid injection point. Adding UI now.`);
        const container = document.createElement('div');
        container.id = 'mass-appeal-container';
        container.innerHTML = `
            <h2>Mass Appeal Tool</h2>
            <p>Enter your appeal message below and click "Appeal All Found Items".</p>
            <textarea id="mass-appeal-message" placeholder="Enter your appeal message here...">${APPEAL_MESSAGE_PLACEHOLDER}</textarea>
            <button id="mass-appeal-button">Appeal All Found Items</button>
            <div id="mass-appeal-status"></div>
        `;
        injectionPoint.prepend(container);
        GM_addStyle(`
            #mass-appeal-container { background-color: #2c2f33; color: #fff; padding: 20px; margin-bottom: 20px; border: 1px solid #444; border-radius: 8px; z-index: 9999; }
            #mass-appeal-container h2 { margin-top: 0; color: #7289da; }
            #mass-appeal-message { width: 98%; height: 100px; padding: 10px; margin: 10px 0; background-color: #23272a; color: #fff; border: 1px solid #555; border-radius: 4px; font-family: inherit; font-size: 14px; }
            #mass-appeal-button { background-color: #7289da; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; transition: background-color 0.3s; }
            #mass-appeal-button:hover { background-color: #677bc4; }
            #mass-appeal-button:disabled { background-color: #555; cursor: not-allowed; }
            #mass-appeal-status { margin-top: 15px; padding: 10px; background-color: #23272a; border-radius: 4px; max-height: 200px; overflow-y: auto; font-family: monospace; }
        `);
        document.getElementById('mass-appeal-button').addEventListener('click', handleAppealAll);
    }

    // --- Helper Functions ---
    const getCsrfToken = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('data-token');
    function getUserId() {
        const profileLink = document.querySelector('a[href*="/users/"][href*="/profile"]');
        if (profileLink) {
            const match = profileLink.href.match(/\/users\/(\d+)\/profile/);
            if (match && match[1]) { return match[1]; }
        }
        const metaTag = document.querySelector('meta[name="user-id"]');
        if (metaTag && metaTag.content) { return metaTag.content; }
        console.error("Roblox Mass Appeal: Could not determine User ID.");
        return null;
    }

    // --- Core Logic ---
    async function handleAppealAll() {
        const button = document.getElementById('mass-appeal-button'), statusDiv = document.getElementById('mass-appeal-status'), message = document.getElementById('mass-appeal-message').value.trim();
        button.disabled = true; button.innerText = 'Processing...'; statusDiv.innerHTML = '';
        const logStatus = (text, isError = false) => { const p = document.createElement('p'); p.textContent = text; p.style.color = isError ? '#f04747' : '#43b581'; statusDiv.appendChild(p); statusDiv.scrollTop = statusDiv.scrollHeight; };
        if (!message) { logStatus('Appeal message cannot be empty.', true); button.disabled = false; button.innerText = 'Appeal All Found Items'; return; }

        const userId = getUserId();
        if (!userId) { logStatus('Could not find User ID. Are you logged in?', true); button.disabled = false; button.innerText = 'Appeal All Found Items'; return; }

        let csrfToken = getCsrfToken();
        if (!csrfToken) {
            logStatus('CSRF token not found, attempting to fetch it...');
            try {
                await new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: "POST", url: "https://auth.roblox.com/v2/logout", headers: { "Content-Type": "application/json" }, onload: r => { csrfToken = r.responseHeaders.match(/x-csrf-token: (.*)/i)?.[1]; csrfToken ? resolve() : reject('Response did not contain CSRF token.'); }, onerror: reject }); });
                logStatus('Successfully fetched new CSRF token.');
            } catch (error) { logStatus(`Fatal: Could not get CSRF token. ${error}`, true); button.disabled = false; button.innerText = 'Appeal All Found Items'; return; }
        }

        logStatus(`User ID: ${userId}`);
        logStatus('Finding violation links...');

        // We now look for 'a' tags where the href attribute STARTS WITH '#/v/'
        const violationLinks = Array.from(document.querySelectorAll('a[href^="#/v/"]'));

        // The extraction logic //
        const violationIds = [...new Set(violationLinks.map(link => link.href.split('#/v/')[1]).filter(id => id))];

        if (violationIds.length === 0) { logStatus('No appealable violation links found on the page.', true); button.disabled = false; button.innerText = 'Appeal All Found Items'; return; }

        logStatus(`Found ${violationIds.length} unique violations to appeal.`);
        for (const [index, violationId] of violationIds.entries()) {
            logStatus(`[${index + 1}/${violationIds.length}] Appealing: ${violationId}`);
            try {
                await sendAppealRequest(userId, violationId, message, csrfToken);
                logStatus(`[${index + 1}/${violationIds.length}] SUCCESS: ${violationId}`, false);
            } catch (error) { logStatus(`[${index + 1}/${violationIds.length}] FAILED: ${violationId}: ${error}`, true); }
        }
        logStatus('All appeals processed. Reloading page in 5 seconds...');
        button.innerText = 'Finished!'; setTimeout(() => location.reload(), 5000);
    }

    function sendAppealRequest(userId, violationId, message, csrfToken) {
        return new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: "POST", url: `https://apis.roblox.com/moderation-appeal-service/v2/users/${userId}/appeals`, headers: { "Content-Type": "application/json;charset=UTF-8", "Accept": "application/json, text/plain, */*", "x-csrf-token": csrfToken, "Referer": "https://www.roblox.com/", }, data: JSON.stringify({ appeal: { violation: `users/${userId}/violations/${violationId}`, message: message }}), withCredentials: true, onload: r => { if (r.status >= 200 && r.status < 300) { resolve(JSON.parse(r.responseText)); } else { let e = `Status ${r.status}`; try { e += `: ${JSON.parse(r.responseText).message || 'Unknown'}`; } catch { e += ` - ${r.statusText}`; } reject(e); } }, onerror: r => reject(`Network error: ${r.statusText}`) }); });
    }

    // --- ROBUST UI INJECTION LOGIC ---
    function findAndInjectUI() {
        const selectors = ['#report-appeals-app', '.report-appeals-content', 'div[role="main"]', '#container-main .content', '#content', '#app', '#root'];
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) { console.log(`Roblox Mass Appeal: Found injection point with selector: "${selector}"`); addAppealUI(element); return true; }
        }
        return false;
    }

    let attempts = 0;
    const maxAttempts = 40;
    const interval = setInterval(() => {
        attempts++;
        if (findAndInjectUI()) { clearInterval(interval); }
        else if (attempts > maxAttempts) {
            clearInterval(interval);
            console.error("Roblox Mass Appeal: Timed out. Trying last-resort injection into <body>.");
            if (!document.getElementById('mass-appeal-container')) { addAppealUI(document.body); }
        }
    }, 500);

})();
