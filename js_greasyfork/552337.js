// ==UserScript==
// @name         McDonald's Monopoly Form Auto-Filler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fills McDonald's Monopoly game code request form
// @author       You
// @match        https://amoe.playatmcd.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552337/McDonald%27s%20Monopoly%20Form%20Auto-Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/552337/McDonald%27s%20Monopoly%20Form%20Auto-Filler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - Change these values
    const CONFIG = {
        emailDomain: '273803761.xyz', // Domain for random emails
        delay: 50, // Ultra-fast input delay in milliseconds
        maxSubmissionsPerEmail: 5, // Maximum submissions per email per day
        submissionDelay: 1500 // Faster delay between submissions in milliseconds
    };

    // Utility function to wait for a specified time
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Generate random email address
    function generateRandomEmail() {
        const prefixes = [
            'user', 'player', 'gamer', 'winner', 'lucky', 'happy', 'cool', 'awesome',
            'super', 'mega', 'ultra', 'pro', 'master', 'champion', 'hero', 'star',
            'king', 'queen', 'boss', 'legend', 'ninja', 'warrior', 'fighter', 'hunter'
        ];

        const suffixes = [
            '123', '456', '789', '2024', '2025', 'game', 'play', 'win', 'fun',
            'lucky', 'cool', 'hot', 'fire', 'ice', 'storm', 'light', 'dark',
            'red', 'blue', 'green', 'gold', 'silver', 'diamond', 'crystal'
        ];

        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const randomNumber = Math.floor(Math.random() * 9999) + 1;

        return `${randomPrefix}${randomSuffix}${randomNumber}@${CONFIG.emailDomain}`;
    }

    // Get today's date key for localStorage
    function getTodayKey() {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    // Get submission count for an email today
    function getSubmissionCount(email) {
        const todayKey = getTodayKey();
        const storageKey = `monopoly_submissions_${todayKey}`;
        const submissions = JSON.parse(localStorage.getItem(storageKey) || '{}');
        return submissions[email] || 0;
    }

    // Increment submission count for an email today
    function incrementSubmissionCount(email) {
        const todayKey = getTodayKey();
        const storageKey = `monopoly_submissions_${todayKey}`;
        const submissions = JSON.parse(localStorage.getItem(storageKey) || '{}');
        submissions[email] = (submissions[email] || 0) + 1;
        localStorage.setItem(storageKey, JSON.stringify(submissions));
        return submissions[email];
    }

    // Store session status in browser storage
    function storeSessionStatus(email, submissionCount, status, timestamp) {
        const sessionData = {
            email: email,
            submissionCount: submissionCount,
            status: status, // 'active', 'completed', 'paused'
            timestamp: timestamp || new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };

        localStorage.setItem('monopoly_current_session', JSON.stringify(sessionData));
        console.log(`💾 Stored session status: ${email} (${submissionCount}/5) - ${status}`);
    }

    // Get current session status
    function getSessionStatus() {
        const sessionData = localStorage.getItem('monopoly_current_session');
        return sessionData ? JSON.parse(sessionData) : null;
    }

    // Clear session status
    function clearSessionStatus() {
        localStorage.removeItem('monopoly_current_session');
        console.log('🗑️ Cleared session status');
    }

    // Check if we're on confirmation page and navigate back
    function checkAndNavigateFromConfirmation() {
        const url = window.location.href;

        if (url.includes('/confirm_email') || url.includes('confirm_emai')) {
            console.log('📧 Detected confirmation page - navigating back to main form');
            clearSessionStatus(); // Clear session when navigating from confirmation
            window.location.href = 'https://amoe.playatmcd.com/';
            return true;
        }

        return false;
    }

    // Check if email has reached daily limit
    function hasReachedDailyLimit(email) {
        return getSubmissionCount(email) >= CONFIG.maxSubmissionsPerEmail;
    }

    // Generate a new email that hasn't reached daily limit
    function generateAvailableEmail() {
        let attempts = 0;
        const maxAttempts = 100; // Prevent infinite loop

        while (attempts < maxAttempts) {
            const email = generateRandomEmail();
            if (!hasReachedDailyLimit(email)) {
                return email;
            }
            attempts++;
        }

        // If we can't find an available email, generate a new one anyway
        console.log('⚠️ All generated emails have reached daily limit, using new email');
        return generateRandomEmail();
    }

    // Quick input function (no typing simulation)
    function quickInput(element, text) {
        element.focus();
        element.value = text;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Scroll reCAPTCHA into view for better visibility (ultra-fast)
    async function scrollRecaptchaIntoView() {
        console.log('📜 Scrolling reCAPTCHA into view...');

        // Find reCAPTCHA elements
        const recaptchaSelectors = [
            '.g-recaptcha',
            '[data-sitekey]',
            '.recaptcha-checkbox',
            'iframe[src*="recaptcha"]'
        ];

        let recaptchaElement = null;
        for (const selector of recaptchaSelectors) {
            recaptchaElement = document.querySelector(selector);
            if (recaptchaElement) break;
        }

        if (recaptchaElement) {
            // Instant scroll (no smooth animation for speed)
            recaptchaElement.scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'center'
            });

            // Add visual highlight to make it more visible
            recaptchaElement.style.border = '3px solid #ff6b6b';
            recaptchaElement.style.borderRadius = '5px';
            recaptchaElement.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.5)';

            console.log('✅ reCAPTCHA scrolled into view and highlighted');

            // Remove highlight after 3 seconds (faster)
            setTimeout(() => {
                recaptchaElement.style.border = '';
                recaptchaElement.style.borderRadius = '';
                recaptchaElement.style.boxShadow = '';
            }, 3000);

        } else {
            console.log('⚠️ reCAPTCHA element not found for scrolling');
        }

        // Minimal delay for instant scrolling
        await wait(100);
    }

    // Utility function to click element with visual feedback
    function clickElement(element, description) {
        if (element) {
            // Add visual feedback
            element.style.backgroundColor = '#4CAF50';
            element.style.transition = 'background-color 0.3s';

            setTimeout(() => {
                element.style.backgroundColor = '';
                element.click();
                console.log(`✅ ${description}`);
            }, 200);

            return true;
        }
        return false;
    }

    // Main automation function
    async function automateForm() {
        console.log('🚀 Starting McDonald\'s Monopoly form automation...');

        try {
            // Check for existing session and resume if possible
            const sessionStatus = getSessionStatus();
            if (sessionStatus && sessionStatus.status === 'active') {
                console.log(`🔄 Resuming automation for ${sessionStatus.email} (${sessionStatus.submissionCount}/5)`);
            }

            // Pre-scroll to reCAPTCHA area for faster access
            const recaptchaArea = document.querySelector('.g-recaptcha, [data-sitekey], .recaptcha-checkbox, iframe[src*="recaptcha"]');
            if (recaptchaArea) {
                recaptchaArea.scrollIntoView({ behavior: 'instant', block: 'center' });
                console.log('📜 Pre-scrolled to reCAPTCHA area');
            }

            // Step 1: Fill email field
            console.log('📧 Filling email field...');
            const emailSelectors = [
                'input[type="email"]',
                'input[name*="email"]',
                'input[id*="email"]',
                'input[placeholder*="email" i]'
            ];

            let emailField = null;
            for (const selector of emailSelectors) {
                emailField = document.querySelector(selector);
                if (emailField) break;
            }

            if (emailField) {
                const currentEmail = emailField.value;
                let emailToUse;

                // Check if current email has reached daily limit
                if (currentEmail && hasReachedDailyLimit(currentEmail)) {
                    console.log(`⚠️ Current email ${currentEmail} has reached daily limit (${CONFIG.maxSubmissionsPerEmail} submissions)`);
                    emailToUse = generateAvailableEmail();
                    console.log(`🔄 Generating new email: ${emailToUse}`);
                } else if (currentEmail) {
                    emailToUse = currentEmail;
                    console.log(`📧 Using existing email: ${emailToUse}`);
                } else {
                    emailToUse = generateAvailableEmail();
                    console.log(`🆕 Generated new email: ${emailToUse}`);
                }

                quickInput(emailField, emailToUse);
                console.log(`✅ Email field filled with: ${emailToUse}`);
                console.log(`📊 Current submissions today: ${getSubmissionCount(emailToUse)}/${CONFIG.maxSubmissionsPerEmail}`);

                // Store session status
                storeSessionStatus(emailToUse, getSubmissionCount(emailToUse), 'active');
            } else {
                console.log('⚠️ Email field not found');
            }

            await wait(CONFIG.delay);

            // Step 2: Check age confirmation
            console.log('✅ Checking age confirmation...');
            const ageSelectors = [
                'input[type="checkbox"][name*="age"]',
                'input[type="checkbox"][id*="age"]',
                'input[type="checkbox"]:not([name*="terms"]):not([name*="rules"]):not([name*="recaptcha"])'
            ];

            let ageCheckbox = null;
            for (const selector of ageSelectors) {
                ageCheckbox = document.querySelector(selector);
                if (ageCheckbox && !ageCheckbox.checked) break;
            }

            if (ageCheckbox && !ageCheckbox.checked) {
                clickElement(ageCheckbox, 'Age confirmation checked');
            } else {
                console.log('⚠️ Age confirmation checkbox not found or already checked');
            }

            await wait(CONFIG.delay);

            // Step 3: Check terms and conditions
            console.log('📋 Checking terms and conditions...');
            const termsSelectors = [
                'input[type="checkbox"][name*="terms"]',
                'input[type="checkbox"][name*="rules"]',
                'input[type="checkbox"][id*="terms"]',
                'input[type="checkbox"][id*="rules"]'
            ];

            let termsCheckbox = null;
            for (const selector of termsSelectors) {
                termsCheckbox = document.querySelector(selector);
                if (termsCheckbox && !termsCheckbox.checked) break;
            }

            if (termsCheckbox && !termsCheckbox.checked) {
                clickElement(termsCheckbox, 'Terms and conditions checked');
            } else {
                console.log('⚠️ Terms and conditions checkbox not found or already checked');
            }

            await wait(CONFIG.delay);

            // Step 4: Handle reCAPTCHA (DO NOT TOUCH - let user handle manually)
            console.log('🤖 reCAPTCHA detected - please complete manually');
            console.log('👤 Complete the reCAPTCHA challenge in the browser');
            console.log('⏳ Waiting for reCAPTCHA completion...');

            // Scroll reCAPTCHA into view immediately (ultra-fast)
            scrollRecaptchaIntoView(); // Don't await - run in parallel

            // Monitor for reCAPTCHA completion and auto-click continue button
            const recaptchaCheckInterval = setInterval(() => {
                const recaptchaSuccess = document.querySelector('.recaptcha-checkbox-checked, [aria-checked="true"], .recaptcha-checkbox-success');
                const recaptchaResponse = document.querySelector('.g-recaptcha-response');

                if (recaptchaSuccess || (recaptchaResponse && recaptchaResponse.value)) {
                    clearInterval(recaptchaCheckInterval);
                    console.log('✅ reCAPTCHA completed!');
                    console.log('🚀 Auto-clicking "Continue to Verification" button...');

                    // Auto-click the continue button after reCAPTCHA is completed
                    setTimeout(() => {
                        submitForm();
                    }, 500); // Even faster wait time after reCAPTCHA completion
                }
            }, 300); // Check even more frequently for faster response

            // Timeout after 10 minutes if reCAPTCHA is never completed
            setTimeout(() => {
                clearInterval(recaptchaCheckInterval);
                console.log('⏰ reCAPTCHA timeout - please complete manually and click continue');
            }, 600000); // 10 minutes

        } catch (error) {
            console.error('❌ Automation failed:', error);
        }
    }

    // Function to submit the form
    function submitForm() {
        console.log('🔄 Looking for "Continue to Verification" button...');

        const submitSelectors = [
            'input[type="submit"]',
            'button[type="submit"]',
            'button[class*="submit"]',
            'button[class*="continue"]',
            'button[class*="btn"]',
            'button'
        ];

        let submitButton = null;
        for (const selector of submitSelectors) {
            const buttons = document.querySelectorAll(selector);
            for (const button of buttons) {
                const text = button.textContent?.toLowerCase();
                if (text && (text.includes('continue') || text.includes('verification') || text.includes('submit'))) {
                    submitButton = button;
                    break;
                }
            }
            if (submitButton) break;
        }

        if (submitButton) {
            console.log(`✅ Found button: "${submitButton.textContent}"`);

            // Get current email and increment submission count
            const emailField = document.querySelector('input[type="email"], input[name*="email"], input[id*="email"]');
            const currentEmail = emailField ? emailField.value : 'unknown';
            const submissionCount = incrementSubmissionCount(currentEmail);

            console.log(`📊 Submission ${submissionCount}/${CONFIG.maxSubmissionsPerEmail} for ${currentEmail}`);

            // Update session status before submission
            storeSessionStatus(currentEmail, submissionCount, 'submitting');

            clickElement(submitButton, 'Continue to Verification button clicked');

            // Set up retry mechanism for multiple submissions
            setTimeout(() => {
                setupRetryMechanism(currentEmail, submissionCount);
            }, CONFIG.submissionDelay);

        } else {
            console.log('⚠️ "Continue to Verification" button not found');
            console.log('🔍 Available buttons on page:');
            const allButtons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
            allButtons.forEach((btn, index) => {
                console.log(`  ${index + 1}. "${btn.textContent || btn.value || 'No text'}"`);
            });
        }
    }

    // Check if we're on a success/confirmation page
    function isOnSuccessPage() {
        const url = window.location.href;
        const pageText = document.body.textContent.toLowerCase();

        // Check URL patterns
        if (url.includes('confirm') || url.includes('success') || url.includes('thank')) {
            return true;
        }

        // Check page content for success indicators
        const successIndicators = [
            'thank you',
            'confirmation',
            'success',
            'email sent',
            'verification sent',
            'check your email',
            'otp sent'
        ];

        return successIndicators.some(indicator => pageText.includes(indicator));
    }

    // Set up retry mechanism for multiple submissions
    function setupRetryMechanism(email, currentSubmissionCount) {
        console.log(`🔄 Setting up retry mechanism for ${email} (${currentSubmissionCount}/${CONFIG.maxSubmissionsPerEmail})`);

        // Check if we're on a success page
        if (isOnSuccessPage()) {
            console.log('✅ Detected success page - submission was successful');
        } else {
            console.log('⚠️ Not on success page - may need to retry');
        }

        if (currentSubmissionCount < CONFIG.maxSubmissionsPerEmail) {
            console.log(`⏳ Waiting ${CONFIG.submissionDelay/1000} seconds before next submission...`);

            // Update session status to active for next submission
            storeSessionStatus(email, currentSubmissionCount, 'active');

            setTimeout(() => {
                console.log(`🔄 Starting submission ${currentSubmissionCount + 1}/${CONFIG.maxSubmissionsPerEmail} for ${email}`);

                // Navigate back to the original form page
                window.location.href = 'https://amoe.playatmcd.com/';
            }, CONFIG.submissionDelay);
        } else {
            console.log(`🎯 Completed all ${CONFIG.maxSubmissionsPerEmail} submissions for ${email}`);
            console.log(`🆕 Generating new email for next round...`);

            // Clear session status when email is completed
            clearSessionStatus();

            setTimeout(() => {
                // Navigate back to the original form page with a new email
                window.location.href = 'https://amoe.playatmcd.com/';
            }, CONFIG.submissionDelay);
        }
    }

    // Add visual indicator that script is running
    function addVisualIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'monopoly-automation-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        indicator.textContent = '⚡ Ultra-Fast Auto-Filler Active';
        document.body.appendChild(indicator);

        // Remove indicator after 3 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 3000);
    }

    // Initialize the automation
    function init() {
        console.log('⚡ McDonald\'s Monopoly Ultra-Fast Auto-Filler loaded');

        // Check if we're on confirmation page first
        if (checkAndNavigateFromConfirmation()) {
            return; // Navigation will trigger a new page load
        }

        // Add visual indicator
        addVisualIndicator();

        // Check for existing session
        const sessionStatus = getSessionStatus();
        if (sessionStatus) {
            console.log(`🔄 Resuming session: ${sessionStatus.email} (${sessionStatus.submissionCount}/5) - ${sessionStatus.status}`);
            console.log(`⏰ Last activity: ${new Date(sessionStatus.lastActivity).toLocaleString()}`);
        }

        // Check if we're on the main form page
        if (window.location.href === 'https://amoe.playatmcd.com/' || window.location.href === 'https://amoe.playatmcd.com') {
            console.log('📄 On main form page - starting automation');
            // Start automation immediately (ultra-fast mode)
            setTimeout(automateForm, 200);
        } else {
            console.log('📄 On different page - waiting for navigation to form page');
            // Wait a bit longer if we're not on the main page
            setTimeout(() => {
                if (window.location.href === 'https://amoe.playatmcd.com/' || window.location.href === 'https://amoe.playatmcd.com') {
                    console.log('📄 Now on main form page - starting automation');
                    automateForm();
                }
            }, 1000);
        }
    }

    // Run when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also listen for page navigation events
    window.addEventListener('popstate', () => {
        console.log('🔄 Page navigation detected - reinitializing...');
        setTimeout(init, 500);
    });

    // Listen for hash changes (some sites use these)
    window.addEventListener('hashchange', () => {
        console.log('🔄 Hash change detected - reinitializing...');
        setTimeout(init, 500);
    });

    // Add keyboard shortcut to manually trigger automation (Ctrl+Shift+M)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
            e.preventDefault();
            console.log('🔄 Manual trigger activated');
            automateForm();
        }
    });

    console.log('💡 Press Ctrl+Shift+M to manually trigger the automation');
    console.log('📧 Random emails will be generated with @273803761.xyz domain');
    console.log('🚀 Auto-clicks "Continue to Verification" when reCAPTCHA is completed');
    console.log(`🔄 Each email can submit ${CONFIG.maxSubmissionsPerEmail} times per day`);
    console.log('📊 Submission counts are tracked in localStorage');
    console.log('⚡ Ultra-fast mode: 50ms delays, 1.5s between submissions');
    console.log('📜 reCAPTCHA automatically scrolled into view with highlight');
    console.log('💾 Session status stored in browser storage for persistence');
    console.log('🔄 Auto-navigates from confirmation pages back to main form');

})();
