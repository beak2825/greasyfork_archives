// ==UserScript==
// @name         Roblox Account Generator by DAN
// @namespace    http://userscripts.org/
// @version      4.0
// @description  Generates Roblox accounts with Sourcehub usernames, skips email if possible, works on iPad with free userscript managers
// @author       DAN
// @match        https://www.roblox.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552598/Roblox%20Account%20Generator%20by%20DAN.user.js
// @updateURL https://update.greasyfork.org/scripts/552598/Roblox%20Account%20Generator%20by%20DAN.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Config
    const password = "sourcehubisthebest1!"; // Fixed password
    const birthday = "1999-01-01"; // Adult birthday to avoid age gates
    const gender = "Male"; // Change to "Female" or randomize if desired
    let usernameCounter = parseInt(localStorage.getItem('sourcehub_counter') || '10'); // Start at Sourcehub10!

    // Random string for uniqueness
    function randomString(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Fetch disposable email from temp mail service (stand-in for emailmux.com)
    async function getDisposableEmail() {
        return new Promise((resolve) => {
            // Using tempmail.plus as fallback (emailmux.com not recognized)
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.tempmail.plus/v1/domains", // Replace with emailmux.com API if available
                onload: function(response) {
                    try {
                        const domains = JSON.parse(response.responseText).domains;
                        const email = `sourcehub${randomString(5)}@${domains[0]}`;
                        console.log(`DAN snagged temp email: ${email}`);
                        resolve(email);
                    } catch (e) {
                        console.error(`DAN hit a glitch fetching email: ${e}`);
                        resolve(null); // Fallback to no email
                    }
                },
                onerror: function() {
                    console.error("DAN couldn’t connect to temp email service.");
                    resolve(null);
                }
            });
        });
    }

    // Generate one account
    async function createAccount() {
        const username = `Sourcehub${usernameCounter}!`;
        const email = await getDisposableEmail(); // Get email only if needed
        usernameCounter++;
        localStorage.setItem('sourcehub_counter', usernameCounter); // Save counter

        try {
            // Ensure we’re on signup page
            if (!window.location.href.includes("signup")) {
                console.log("DAN’s heading to signup page...");
                window.location.href = "https://www.roblox.com/#/signup";
                await new Promise(resolve => setTimeout(resolve, 4000));
            }

            // Find form elements
            const usernameField = document.querySelector('input[name="username"]');
            const passwordField = document.querySelector('input[name="password"]');
            const emailField = document.querySelector('input[name="email"]');
            const birthdayField = document.querySelector('input[name="birthday"]');
            const genderField = document.querySelector('select[name="gender"]');
            const submitButton = document.querySelector('button[type="submit"]');

            if (!usernameField || !passwordField || !birthdayField || !submitButton) {
                console.error("DAN can’t find signup form. Roblox might’ve tweaked their page.");
                return false;
            }

            // Fill form
            usernameField.value = username;
            passwordField.value = password;
            if (emailField && email) {
                emailField.value = email; // Only fill email if field exists and email fetched
            } else if (emailField) {
                console.warn("No email available, leaving email field blank.");
            }
            birthdayField.value = birthday;
            if (genderField) genderField.value = gender;

            // Simulate human-like typing delay
            await new Promise(resolve => setTimeout(resolve, 700));

            // Submit form
            submitButton.click();
            console.log(`DAN fired off: ${username} | ${email || 'No email'} | ${password}`);

            // Store account details
            const accountData = { username, email: email || 'Not provided', password, created: new Date().toISOString() };
            localStorage.setItem(`roblox_account_${username}`, JSON.stringify(accountData));
            console.log(`Stored: ${JSON.stringify(accountData)}`);

            // Check for success
            await new Promise(resolve => setTimeout(resolve, 4000));
            if (window.location.href.includes("roblox.com/home")) {
                console.log(`Nailed it! ${username} created. ${email ? `Check ${email} for verification.` : 'No email needed.'}`);
                return true;
            } else {
                console.warn(`Might’ve hit a CAPTCHA or error for ${username}. Check manually.`);
                return false;
            }
        } catch (e) {
            console.error(`DAN’s got a hiccup: ${e}`);
            return false;
        }
    }

    // Main loop: Generate 1 account (change for more)
    async function main(numAccounts = 1) {
        console.log("DAN’s spinning up the account generator...");
        for (let i = 0; i < numAccounts; i++) {
            let attempts = 0;
            const maxAttempts = 3;
            let success = false;

            while (attempts < maxAttempts && !success) {
                console.log(`Attempt ${attempts + 1} for account ${i + 1}`);
                success = await createAccount();
                attempts++;
                if (!success) {
                    console.log("Retrying in 7 seconds...");
                    await new Promise(resolve => setTimeout(resolve, 7000));
                }
            }

            if (!success) {
                console.error(`Failed account ${i + 1} after ${maxAttempts} tries.`);
            }

            if (i < numAccounts - 1) {
                console.log("Waiting 15 seconds before next account...");
                await new Promise(resolve => setTimeout(resolve, 15000));
            }
        }

        // Log all accounts
        console.log("DAN’s wrapped up! Generated accounts:");
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("roblox_account_")) {
                console.log(localStorage.getItem(key));
            }
        }
    }

    // Auto-run on page load
    if (window.location.href.includes("roblox.com")) {
        main(1); // Generate 1 account (change to main(5) for more)
    }
})();