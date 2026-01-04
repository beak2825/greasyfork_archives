// ==UserScript==
// @license MIT 
// @name         AWS Complete Auto Login (Email + Password + MFA)
// @namespace    http://tampermonkey.net/
// @version      9
// @description  Complete AWS login automation with email, password, and MFA TOTP
// @author       fire
// @match        https://signin.aws.amazon.com/*
// @match        https://*.signin.aws.amazon.com/*
// @match        https://*.amazonaws.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551072/AWS%20Complete%20Auto%20Login%20%28Email%20%2B%20Password%20%2B%20MFA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551072/AWS%20Complete%20Auto%20Login%20%28Email%20%2B%20Password%20%2B%20MFA%29.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const META = {
        lastUpdate: "2025-06-06 18:18:19 UTC",
        version: "3.1.0"
    };

    const config = {
        get email() {
            return localStorage.getItem('aws_auto_login_email') || 'hello@gmail.com';
        },
        set email(val) {
            localStorage.setItem('aws_auto_login_email', val);
        },

        get password() {
            return localStorage.getItem('aws_auto_login_password') || 'Q82jdjdop=';
        },
        set password(val) {
            localStorage.setItem('aws_auto_login_password', val);
        },

        get autoSubmit() {
            return localStorage.getItem('aws_auto_login_submit') !== 'false';
        },
        set autoSubmit(val) {
            localStorage.setItem('aws_auto_login_submit', val.toString());
        },

        get mfaSecret() {
            const saved = localStorage.getItem('aws_auto_login_mfa_secret');
            console.log('Retrieved MFA secret from localStorage:', saved || '(none)');
            return saved || 'OKNK53QMDRCMZ54';
        },
        set mfaSecret(val) {
            console.log('Saving MFA secret to localStorage:', val);
            localStorage.setItem('aws_auto_login_mfa_secret', val);
        }
    };

    function addConfigUI() {
        const configDiv = document.createElement('div');
        configDiv.style.position = 'fixed';
        configDiv.style.bottom = '10px';
        configDiv.style.right = '10px';
        configDiv.style.zIndex = '9999';
        configDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        configDiv.style.color = 'white';
        configDiv.style.padding = '10px';
        configDiv.style.borderRadius = '5px';
        configDiv.style.fontSize = '12px';
        configDiv.style.fontFamily = 'Arial, sans-serif';
        configDiv.style.cursor = 'pointer';
        configDiv.innerText = '@ AWS Login';
        configDiv.title = 'AWS Auto Login Settings';

        configDiv.addEventListener('click', function() {
            const action = prompt(
                'AWS Auto Login Menu:\n' +
                '1: Change Email\n' +
                '2: Change Password\n' +
                '3: Change MFA Secret\n' +
                '4: Toggle Auto-Submit\n' +
                '5: Show Info\n' +
                '6: Clear All Settings\n' +
                'Enter option (1-6):'
            );

            switch(action) {
                case '1':
                    const newEmail = prompt("Enter your AWS email:", config.email);
                    if (newEmail !== null) {
                        config.email = newEmail;
                        alert(`Email updated to: ${newEmail}`);
                    }
                    break;
                case '2':
                    const newPass = prompt("Enter your AWS password (will be encoded):");
                    if (newPass !== null) {
                        config.password = btoa(newPass);
                        alert("Password updated successfully");
                    }
                    break;
                case '3':
                    const newSecret = prompt(`Enter your MFA secret key:\nCurrent value: ${config.mfaSecret}`, config.mfaSecret);
                    if (newSecret !== null) {
                        localStorage.removeItem('aws_auto_login_mfa_secret');
                        config.mfaSecret = newSecret;
                        setTimeout(() => {
                            const actualSaved = localStorage.getItem('aws_auto_login_mfa_secret');
                            alert(`MFA secret updated!\n\nOld: ${config.mfaSecret}\nNew: ${actualSaved}\n\nCheck the console logs for verification.`);
                            console.log('Verification - MFA secret in localStorage:', actualSaved);
                        }, 100);
                    }
                    break;
                case '4':
                    config.autoSubmit = !config.autoSubmit;
                    alert(`Auto-submit is now ${config.autoSubmit ? 'enabled' : 'disabled'}`);
                    break;
                case '5':
                    alert(`AWS Complete Auto Login - Current Settings
Version: ${META.version}
Last Update: ${META.lastUpdate}
Email: ${config.email}
MFA Secret: ${config.mfaSecret}
Auto Submit: ${config.autoSubmit ? 'Enabled' : 'Disabled'}

localStorage Values:
${Object.keys(localStorage)
  .filter(key => key.startsWith('aws_auto_login'))
  .map(key => `${key}: ${localStorage.getItem(key)}`)
  .join('\n')}`);
                    break;
                case '6':
                    if (confirm("Are you sure you want to clear all saved AWS login settings?")) {
                        Object.keys(localStorage)
                            .filter(key => key.startsWith('aws_auto_login'))
                            .forEach(key => localStorage.removeItem(key));
                        alert("All AWS login settings have been cleared");
                    }
                    break;
            }
        });

        document.body.appendChild(configDiv);
        
        console.log('Current MFA Secret:', config.mfaSecret);
        console.log('All localStorage settings:', 
            Object.keys(localStorage)
                .filter(key => key.startsWith('aws_auto_login'))
                .reduce((obj, key) => {
                    obj[key] = localStorage.getItem(key);
                    return obj;
                }, {})
        );
    }

    function delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    const waitForSelector = (selector, timeout = 15000) => new Promise((resolve, reject) => {
        const existingElement = document.querySelector(selector);
        if (existingElement) {
            return resolve(existingElement);
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                observer.disconnect();
                resolve(element);
            }
        }, 250);

        setTimeout(() => {
            clearInterval(interval);
            observer.disconnect();
            reject(new Error(`Timeout waiting for ${selector}`));
        }, timeout);
    });

    function decodeBase64(b64) {
        try {
            return atob(b64);
        } catch (e) {
            console.error("Error decoding base64:", e);
            return "";
        }
    }

    function base32ToBytes(base32) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = '';
        base32 = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');

        for (let i = 0; i < base32.length; i++) {
            const val = alphabet.indexOf(base32[i]);
            if (val === -1) continue;
            bits += val.toString(2).padStart(5, '0');
        }

        const bytes = [];
        for (let i = 0; i + 8 <= bits.length; i += 8) {
            bytes.push(parseInt(bits.slice(i, i + 8), 2));
        }
        return new Uint8Array(bytes);
    }

    async function generateHMAC(key, counter) {
        const counterBytes = new Uint8Array(8);
        for (let i = 7; i >= 0; i--) {
            counterBytes[i] = counter & 0xff;
            counter >>= 8;
        }

        try {
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                key,
                { name: 'HMAC', hash: 'SHA-1' },
                false,
                ['sign']
            );

            return new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, counterBytes));
        } catch (e) {
            console.error("HMAC generation error:", e);
            throw e;
        }
    }

    async function generateTOTP() {
        try {
            const currentSecret = config.mfaSecret;
            console.log(`Generating TOTP with secret: ${currentSecret}`);
            const key = base32ToBytes(currentSecret);
            const timeStep = Math.floor(Date.now() / 1000 / 30);
            console.log(`Current time step: ${timeStep}`);
            const hmac = await generateHMAC(key, timeStep);
            const offset = hmac[hmac.length - 1] & 0x0f;
            const code = (
                ((hmac[offset] & 0x7f) << 24) |
                ((hmac[offset + 1] & 0xff) << 16) |
                ((hmac[offset + 2] & 0xff) << 8) |
                (hmac[offset + 3] & 0xff)
            ) % 1000000;

            const totpCode = code.toString().padStart(6, '0');
            console.log(`Generated TOTP code: ${totpCode}`);
            return totpCode;
        } catch (error) {
            console.error("Error generating TOTP:", error);
            return null;
        }
    }

    function setInputValue(input, value) {
        const originalValue = input.value;
        input.value = value;
        if (input._valueTracker) {
            input._valueTracker.setValue(originalValue);
        }
        try {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(input, value);
            }
        } catch (e) {
            console.error("Error setting input value:", e);
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    async function fillEmail() {
        try {
            console.log("AWS Auto Login: Looking for email field...");
            const emailInput = await waitForSelector('input[name="resolvingInput"], input[type="email"], #resolving_input');
            console.log("AWS Auto Login: Email field found, filling...");
            setInputValue(emailInput, config.email);
            if (config.autoSubmit) {
                const nextButton = await waitForSelector('button[data-testid="next-button"]');
                nextButton.click();
                console.log("AWS Auto Login: Email submitted");
            }
            return true;
        } catch (error) {
            console.error("AWS Auto Login - Email error:", error.message);
            return false;
        }
    }

    async function fillPassword() {
        try {
            console.log("AWS Auto Login: Looking for password field...");
            const passwordInput = await waitForSelector('input[type="password"], #password');
            console.log("AWS Auto Login: Password field found, filling...");
            const plainPassword = decodeBase64(config.password);
            setInputValue(passwordInput, plainPassword);
            if (config.autoSubmit) {
                const signinButton = await waitForSelector('button[data-testid="signin-button"]');
                signinButton.click();
                console.log("AWS Auto Login: Password submitted");
            }
            return true;
        } catch (error) {
            console.error("AWS Auto Login - Password error:", error.message);
            return false;
        }
    }

    async function fillMFA() {
        try {
            console.log("AWS Auto Login: Looking for MFA field...");
            const mfaInput = await waitForSelector('#mfaCode, input[name="mfaCode"], input[aria-labelledby*="mfa"], input[placeholder*="MFA"]');
            console.log("AWS Auto Login: MFA field found, filling...");
            const code = await generateTOTP();
            if (!code) {
                console.error("Failed to generate TOTP code");
                return false;
            }
            console.log(`AWS Auto Login: Generated TOTP code: ${code}`);
            setInputValue(mfaInput, code);
            if (config.autoSubmit) {
                const submitButton = await waitForSelector('button[data-testid="mfa-submit-button"]');
                await delay(500);
                submitButton.click();
                console.log("AWS Auto Login: MFA submitted");
            }
            return true;
        } catch (error) {
            console.error("AWS Auto Login - MFA error:", error.message);
            return false;
        }
    }

    async function detectAndLogin() {
        console.log("AWS Auto Login: Script started");
        try {
            const isEmailPage = Boolean(document.querySelector('input[name="resolvingInput"], input[type="email"]'));
            const isPasswordPage = Boolean(document.querySelector('input[type="password"]') && !document.querySelector('#mfaCode, input[name="mfaCode"], input[aria-labelledby*="mfa"], input[placeholder*="MFA"]'));
            const isMFAPage = Boolean(document.querySelector('#mfaCode, input[name="mfaCode"], input[aria-labelledby*="mfa"], input[placeholder*="MFA"]'));

            if (isEmailPage) {
                console.log("AWS Auto Login: Detected email page");
                if (await fillEmail()) {
                    await delay(2000);
                    if (await fillPassword().catch(() => false)) {
                        await delay(2000);
                        await fillMFA().catch(() => {
                            console.log("AWS Auto Login: No MFA field found yet or MFA not required");
                        });
                    }
                }
            } else if (isPasswordPage) {
                console.log("AWS Auto Login: Detected password page");
                if (await fillPassword()) {
                    await delay(2000);
                    await fillMFA().catch(() => {
                        console.log("AWS Auto Login: No MFA field found yet or MFA not required");
                    });
                }
            } else if (isMFAPage) {
                console.log("AWS Auto Login: Detected MFA page");
                await fillMFA();
            } else {
                console.log("AWS Auto Login: No recognized login fields found, waiting for form to appear");
                const loginField = await Promise.race([
                    waitForSelector('input[name="resolvingInput"], input[type="email"]').catch(() => null),
                    waitForSelector('input[type="password"]').catch(() => null),
                    waitForSelector('#mfaCode, input[name="mfaCode"], input[aria-labelledby*="mfa"], input[placeholder*="MFA"]').catch(() => null)
                ]);
                if (loginField) {
                    console.log("AWS Auto Login: Login form detected, retrying");
                    setTimeout(detectAndLogin, 300);
                }
            }
        } catch (error) {
            console.error("AWS Auto Login - Unexpected error:", error.message);
        }
    }

    function setupMFAObserver() {
        const observer = new MutationObserver((mutations) => {
            const mfaInput = document.querySelector('#mfaCode, input[name="mfaCode"], input[aria-labelledby*="mfa"], input[placeholder*="MFA"]');
            if (mfaInput) {
                fillMFA();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        [2000, 3500, 5000].forEach(ms => {
            setTimeout(() => {
                const mfaInput = document.querySelector('#mfaCode, input[name="mfaCode"], input[aria-labelledby*="mfa"], input[placeholder*="MFA"]');
                if (mfaInput) fillMFA();
            }, ms);
        });
    }

    if (window.location.href.includes('signin.aws.amazon.com') ||
        window.location.href.includes('amazonaws.com')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addConfigUI);
        } else {
            addConfigUI();
        }
    }

    async function initialSetup() {
        if (!localStorage.getItem('aws_auto_login_email')) {
            alert("Welcome to AWS Auto Login! Let's set up your credentials.");
            const email = prompt("Please enter your AWS email:");
            if (email) {
                config.email = email;
            }
            const password = prompt("Please enter your AWS password:");
            if (password) {
                config.password = btoa(password);
            }
            const mfaSecret = prompt("Please enter your MFA secret key:");
            if (mfaSecret) {
                config.mfaSecret = mfaSecret;
            }
            alert("Setup complete! The script will now attempt to log you in.");
        }
    }

    async function main() {
        await initialSetup();
        setTimeout(detectAndLogin, 500);
        setupMFAObserver();
    }

    main();
})();
