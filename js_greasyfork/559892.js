// ==UserScript==
// @name         RDS3 Auto CAPTCHA Solver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-solve CAPTCHA using backend API and auto-fill login form on RDS
// @author       TANVIR & NIHAL (https://github.com/nihalxx3 , https://github.com/Tanvir-Chowdhury )
// @match        https://rds3.northsouth.edu/common/login/preLogin
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @license     MIT 
// @downloadURL https://update.greasyfork.org/scripts/559892/RDS3%20Auto%20CAPTCHA%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/559892/RDS3%20Auto%20CAPTCHA%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        password: '',           // Your password
        apiUrl: 'https://captchade.northsouth.app',   // Backend API URL
        maxRetries: 3,                     // Maximum CAPTCHA solving attempts
        retryDelay: 1000,                  // Delay between retries (ms)
        checkInterval: 1000,               // Check for elements interval (ms)
        debug: true                        // Enable debug logging
    };

    // Debug logging function
    function log(message, type = 'info') {
        if (CONFIG.debug) {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = `[RDS AutoCAPTCHA ${timestamp}]`;

            switch(type) {
                case 'error':
                    console.error(`${prefix} ❌`, message);
                    break;
                case 'success':
                    console.log(`${prefix} ✅`, message);
                    break;
                case 'warn':
                    console.warn(`${prefix} ⚠️`, message);
                    break;
                default:
                    console.log(`${prefix} 🔧`, message);
            }
        }
    }


    // Function to solve CAPTCHA using backend API with base64 image data
    function solveCaptchaFromBase64(imageData) {
        return new Promise((resolve, reject) => {
            log(`Sending CAPTCHA image data to API (${Math.round(imageData.length/1024)}KB)`);

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CONFIG.apiUrl}/solve-captcha-base64`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    image: imageData
                }),
                timeout: 30000,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            log(`CAPTCHA solved: ${data.captcha_code} (avg confidence: ${data.average_confidence.toFixed(3)})`, 'success');
                            resolve(data);
                        } else {
                            reject(new Error(`API error: ${data.error || 'Unknown error'}`));
                        }
                    } catch (e) {
                        reject(new Error(`Response parse error: ${e.message}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`API request failed: ${error.statusText || 'Network error'}`));
                },
                ontimeout: function() {
                    reject(new Error('CAPTCHA API request timeout'));
                }
            });
        });
    }

    // Function to capture CAPTCHA image as base64 from the DOM
    function getCaptchaImageAsBase64() {
        return new Promise((resolve, reject) => {
            const captchaImg = document.querySelector('img[src*="captcha"]');
            if (!captchaImg) {
                reject(new Error('CAPTCHA image not found in DOM'));
                return;
            }

            log(`Found CAPTCHA image: ${captchaImg.src}`);

            // Create a canvas to capture the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Wait for image to load if not already loaded
            const processImage = () => {
                try {
                    // Set canvas size to match image
                    canvas.width = captchaImg.naturalWidth || captchaImg.width;
                    canvas.height = captchaImg.naturalHeight || captchaImg.height;

                    log(`CAPTCHA image dimensions: ${canvas.width} x ${canvas.height}`);

                    // Draw the image onto canvas
                    ctx.drawImage(captchaImg, 0, 0);

                    // Get base64 data (PNG format)
                    const base64Data = canvas.toDataURL('image/png');

                    // Remove the data URL prefix to get just the base64 data
                    const base64Image = base64Data.split(',')[1];

                    log(`CAPTCHA image captured as base64 (${Math.round(base64Image.length/1024)}KB)`, 'success');
                    resolve(base64Image);

                } catch (error) {
                    reject(new Error(`Failed to capture image: ${error.message}`));
                }
            };

            // Check if image is already loaded
            if (captchaImg.complete && captchaImg.naturalWidth > 0) {
                processImage();
            } else {
                // Wait for image to load
                log('Waiting for CAPTCHA image to load...');
                captchaImg.onload = processImage;
                captchaImg.onerror = () => {
                    reject(new Error('CAPTCHA image failed to load'));
                };

                // Timeout after 10 seconds
                setTimeout(() => {
                    reject(new Error('CAPTCHA image load timeout'));
                }, 10000);
            }
        });
    }

    // Function to auto-fill password
    function autoFillPassword() {
        const passField = document.querySelector('input[type="password"][name="password"]');

        if (passField && !passField.value) {
            passField.value = CONFIG.password;
            log('Password auto-filled', 'success');

            // Trigger input events to ensure form validation
            passField.dispatchEvent(new Event('input', { bubbles: true }));
            passField.dispatchEvent(new Event('change', { bubbles: true }));

            return true;
        }

        return false;
    }

    // Function to fill CAPTCHA field
    function fillCaptchaField(captchaCode) {
        const captchaField = document.querySelector('input[name="captcha"]');

        if (captchaField) {
            captchaField.value = captchaCode;
            log(`CAPTCHA field filled with: ${captchaCode}`, 'success');

            // Trigger input events
            captchaField.dispatchEvent(new Event('input', { bubbles: true }));
            captchaField.dispatchEvent(new Event('change', { bubbles: true }));

            return true;
        } else {
            log('CAPTCHA field not found', 'error');
            return false;
        }
    }

    // Function to submit the login form
    function submitLoginForm() {
        // Try multiple methods to submit the form
        const captchaField = document.querySelector('input[name="captcha"]');

        // Method 1: Click the specific login button
        const loginButton = document.querySelector('input[type="submit"][name="commit"][value="Login"]');
        if (loginButton) {
            loginButton.click();
            log('Login form submitted via Login button click', 'success');
            return true;
        }

        // Method 2: Try any submit button with "Login" value
        const submitButtonByValue = document.querySelector('input[type="submit"][value="Login"]');
        if (submitButtonByValue) {
            submitButtonByValue.click();
            log('Login form submitted via submit button (value=Login)', 'success');
            return true;
        }

        // Method 3: Try any submit button
        const anySubmitButton = document.querySelector('input[type="submit"], button[type="submit"]');
        if (anySubmitButton) {
            anySubmitButton.click();
            log('Login form submitted via generic submit button', 'success');
            return true;
        }

        // Method 4: Submit using Enter key on CAPTCHA field (fallback)
        if (captchaField) {
            captchaField.focus();
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            captchaField.dispatchEvent(enterEvent);
            log('Login form submitted via Enter key on CAPTCHA field', 'success');
            return true;
        }

        // Method 5: Try to find and submit the form directly
        const form = document.querySelector('form');
        if (form) {
            form.submit();
            log('Login form submitted via form.submit()', 'success');
            return true;
        }

        log('Could not find any submit method', 'error');
        return false;
    }

    // Main CAPTCHA solving process
    async function processCaptcha(attempt = 1) {
        try {
            log(`🔍 CAPTCHA solving attempt ${attempt}/${CONFIG.maxRetries}`);

            // Capture CAPTCHA image as base64 from DOM
            const base64ImageData = await getCaptchaImageAsBase64();

            // Solve CAPTCHA using base64 data
            const result = await solveCaptchaFromBase64(base64ImageData);
            const captchaCode = result.captcha_code;

            // Fill CAPTCHA field
            if (!fillCaptchaField(captchaCode)) {
                throw new Error('Failed to fill CAPTCHA field');
            }

            // Small delay before submission
            setTimeout(() => {
                if (submitLoginForm()) {
                    log('🚀 Login process completed successfully!', 'success');
                } else {
                    log('Failed to submit form automatically', 'warn');
                }
            }, 500);

            return true;

        } catch (error) {
            log(`Attempt ${attempt} failed: ${error.message}`, 'error');

            if (attempt < CONFIG.maxRetries) {
                log(`Retrying in ${CONFIG.retryDelay/1000} seconds...`);
                setTimeout(() => {
                    processCaptcha(attempt + 1);
                }, CONFIG.retryDelay);
            } else {
                log('❌ All CAPTCHA solving attempts failed!', 'error');

                // Show user notification
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #ff4444;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                `;
                notification.innerHTML = `
                    <strong>CAPTCHA Auto-Solver Failed</strong><br>
                    Please solve manually or check API server
                `;
                document.body.appendChild(notification);

                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 10000);
            }

            return false;
        }
    }

    // Function to monitor for login form
    function monitorLoginForm() {
        const passwordField = document.querySelector('input[type="password"][name="password"]');
        const captchaField = document.querySelector('input[name="captcha"]');
        const captchaImage = document.querySelector('img[src*="captcha"]');

        // Check if we're on the login page with all required elements
        if (passwordField && captchaField && captchaImage) {
            log('🔐 Login form detected with CAPTCHA');

            // Auto-fill password first
            autoFillPassword();

            // Check if CAPTCHA field is empty and needs solving
            if (!captchaField.value || captchaField.value.trim() === '') {
                log('🖼️ CAPTCHA field is empty, starting auto-solve process...');

                // Add visual indicator
                const indicator = document.createElement('div');
                indicator.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: #4CAF50;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                `;
                indicator.innerHTML = '🤖 Auto-solving CAPTCHA by TANVIR & NIHAL ...';
                document.body.appendChild(indicator);

                // Start CAPTCHA solving process
                processCaptcha().then(success => {
                    if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                    }
                });

                return true; // Stop monitoring
            } else {
                log('CAPTCHA field already has value, skipping auto-solve');
            }
        }

        return false; // Continue monitoring
    }

    // Initialize the script
    function init() {
        log('🚀 RDS Auto CAPTCHA Solver initialized');
        log(`API URL: ${CONFIG.apiUrl}`);

        // Check if we're on a login-related page
        if (window.location.href === 'https://rds3.northsouth.edu/common/login/preLogin') {

            log('📍 Login page detected, starting monitor...');

            // Start monitoring for login form
            const monitorInterval = setInterval(() => {
                if (monitorLoginForm()) {
                    clearInterval(monitorInterval);
                    log('Monitor stopped - login form processed');
                }
            }, CONFIG.checkInterval);

            // Stop monitoring after 30 seconds
            setTimeout(() => {
                clearInterval(monitorInterval);
                log('Monitor timeout - stopped automatic checking');
            }, 30000);

        } else {
            log('Not on login page, script will remain idle');
        }
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also monitor for navigation changes (SPA behavior)
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            log(`🔄 URL changed to: ${currentUrl}`);

            // Re-initialize if navigated to login page
            if (currentUrl.includes('login') ||
                currentUrl === 'https://rds3.northsouth.edu' ||
                currentUrl === 'https://rds3.northsouth.edu/') {
                setTimeout(init, 300); // Small delay for page to load
            }
        }
    }, 2000);

})();
