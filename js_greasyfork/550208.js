// ==UserScript==
// @name         Poe Signup Automation with Guerrilla Mail
// @namespace    https://poe.com/
// @version      1.0
// @description  Automate Poe signup using Guerrilla Mail (no API keys needed). Modular, with debug logs. Firefox Mobile & Tampermonkey compatible.
// @author       AI
// @match        https://poe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550208/Poe%20Signup%20Automation%20with%20Guerrilla%20Mail.user.js
// @updateURL https://update.greasyfork.org/scripts/550208/Poe%20Signup%20Automation%20with%20Guerrilla%20Mail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // API helpers
    const API = 'https://api.guerrillamail.com/ajax.php';

    let sidToken, emailUser, emailAddr, seq = 0;

    // Log helper
    const log = (...args) => console.log('[PoeSignupGM]', ...args);

    // Helper: wait for element
    function waitForElement(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                }
            }, 400);
            setTimeout(() => {
                clearInterval(interval);
                reject(`Timeout waiting for element: ${selector}`);
            }, timeout);
        });
    }

    // Get a new temporary email address
    async function getEmailAddress() {
        log('Requesting new Guerrilla Mail address');
        const url = `${API}?f=get_email_address&lang=en`;
        const data = await fetch(url).then(r => r.json());
        sidToken = data.sid_token;
        emailUser = data.email_user;
        emailAddr = data.email_addr;
        seq = data.email_list && data.email_list.length > 0 ? data.email_list[0].mail_id : 0;
        log('Using email:', emailAddr, 'Session:', sidToken);
        return emailAddr;
    }

    // Poll inbox for new messages
    async function pollInboxForVerification(retries = 30, delay = 3500) {
        for (let i = 0; i < retries; ++i) {
            log('Checking mailbox for POE verification email (attempt', i+1, ')');
            // GuerrillaMail API: f=check_email&sid_token
            const url = `${API}?f=check_email&sid_token=${sidToken}&seq=${seq}`;
            const data = await fetch(url).then(r => r.json());
            if (data.list && data.list.length > 0) {
                // Look for the email from Poe and extract code
                for (const mail of data.list) {
                    if ((mail.mail_from && mail.mail_from.toLowerCase().includes('poe')) ||
                        (mail.mail_subject && mail.mail_subject.toLowerCase().includes('poe'))) {

                        log('Found candidate verification email:', mail.mail_subject);
                        // Fetch the full email by ID
                        const fetchUrl = `${API}?f=fetch_email&sid_token=${sidToken}&email_id=${mail.mail_id}`;
                        const mailData = await fetch(fetchUrl).then(r => r.json());
                        const body = mailData.mail_body;
                        const m = body && body.match(/(d{6})/);
                        if (m) {
                            log('Extracted verification code:', m[1]);
                            return m[1];
                        }
                    }
                }
            }
            await new Promise(res => setTimeout(res, delay));
        }
        throw new Error('Verification email was not received in time.');
    }

    // Autofill Poe signup form with email and submit
    async function autofillEmail(email) {
        const emailInputSelector = 'input[type="email"][placeholder*="Email"]';
        const goButtonSelector = 'button.Button_primary__6UIn0';

        const input = await waitForElement(emailInputSelector);
        input.value = email;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        log('Filled Poe email input:', email);

        const btns = Array.from(document.querySelectorAll(goButtonSelector));
        const goBtn = btns.find(b => b.innerText.trim().toLowerCase() === 'go') || btns[0];
        if (goBtn) {
            goBtn.click();
            log('Clicked Go button');
        } else {
            throw new Error('Go button not found.');
        }
    }

    // Autofill Poe verification code and submit
    async function autofillCode(code) {
        const codeInputSelector = 'input[placeholder*="Code"]';
        const verifyButtonSelector = 'button.Button_primary__6UIn0';

        const input = await waitForElement(codeInputSelector);
        input.value = code;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        log('Filled verification code:', code);

        const btns = Array.from(document.querySelectorAll(verifyButtonSelector));
        const verifyBtn = btns.find(b => b.innerText.trim().toLowerCase() === 'verify') || btns[0];
        if (verifyBtn) {
            verifyBtn.click();
            log('Clicked Verify button.');
        } else {
            throw new Error('Verify button not found.');
        }
    }

    // Main automation sequence
    async function run() {
        try {
            log('Starting Guerrilla Mail + Poe signup automation');
            const email = await getEmailAddress();
            await autofillEmail(email);

            await waitForElement('input[placeholder*="Code"]');
            log('Waiting for verification code email...');
            const code = await pollInboxForVerification();
            await autofillCode(code);

            log('Poe signup successfully automated!');
        } catch (e) {
            log('ERROR:', e);
        }
    }

    // Add floating button UI to trigger automation
    function makeUI() {
        const btn = document.createElement('button');
        btn.innerText = 'Automate Poe Signup';
        btn.style = 'position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px;background:#1976d2;color:#fff;border:none;border-radius:6px;cursor:pointer;';
        btn.onclick = run;
        document.body.appendChild(btn);
    }

    makeUI();
})();