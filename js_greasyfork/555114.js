// ==UserScript==
// @name         CAPTCHA Auto Solver - Multi-Type with Random Delay
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  CAPTCHA solver for both capstart.php and captcha.php with random delays
// @author       You
// @match        *://rads.com/*
// @match        *://*/ptc.php*
// @match        *://*.rads.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      huijio-zeracap2.hf.space
// @connect      zerads.com
// @downloadURL https://update.greasyfork.org/scripts/555114/CAPTCHA%20Auto%20Solver%20-%20Multi-Type%20with%20Random%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/555114/CAPTCHA%20Auto%20Solver%20-%20Multi-Type%20with%20Random%20Delay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = 'https://huijio-zeracap2.hf.space/api/predict';
    let isSolverEnabled = GM_getValue('solverEnabled', true);

    // ==================== RANDOM DELAY FUNCTION ====================
    function getRandomDelay() {
        // Random delay between 1 to 3 minutes (60,000ms to 180,000ms)
        return Math.floor(Math.random() * 120000) + 60000;
    }

    // ==================== TOGGLE UI ====================
    function createToggleUI() {
        const existingToggle = document.getElementById('captcha-solver-toggle');
        if (existingToggle) existingToggle.remove();

        const toggle = document.createElement('div');
        toggle.id = 'captcha-solver-toggle';
        toggle.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;

        const button = document.createElement('button');
        button.innerHTML = isSolverEnabled ? '🔴 STOP Solver' : '🟢 START Solver';
        button.style.cssText = `
            background: ${isSolverEnabled ? '#ff4444' : '#4CAF50'};
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

        button.onclick = function() {
            isSolverEnabled = !isSolverEnabled;
            GM_setValue('solverEnabled', isSolverEnabled);
            button.innerHTML = isSolverEnabled ? '🔴 STOP Solver' : '🟢 START Solver';
            button.style.background = isSolverEnabled ? '#ff4444' : '#4CAF50';

            const status = document.getElementById('solver-status');
            if (status) {
                status.textContent = isSolverEnabled ? 'Status: ACTIVE' : 'Status: STOPPED';
                status.style.color = isSolverEnabled ? '#4CAF50' : '#ff4444';
            }

            console.log(`CAPTCHA Solver ${isSolverEnabled ? 'ENABLED' : 'DISABLED'}`);

            if (isSolverEnabled) {
                if (isCaptchaPage()) {
                    setTimeout(solveCaptcha, 2000);
                }
            }
        };

        const status = document.createElement('div');
        status.id = 'solver-status';
        status.textContent = `Status: ${isSolverEnabled ? 'ACTIVE' : 'STOPPED'}`;
        status.style.cssText = `
            color: ${isSolverEnabled ? '#4CAF50' : '#ff4444'};
            font-size: 12px;
            text-align: center;
            margin-top: 5px;
            font-weight: bold;
        `;

        toggle.appendChild(button);
        toggle.appendChild(status);
        document.body.appendChild(toggle);

        return toggle;
    }

    // ==================== PAGE DETECTION ====================
    function isCaptchaPage() {
        return (document.querySelector('img[src*="captcha.php"]') ||
                document.querySelector('img[src*="capstart.php"]')) &&
               document.querySelector('a[href*="ptc.php"]');
    }

    function getCaptchaType() {
        if (document.querySelector('img[src*="capstart.php"]')) {
            return 'capstart';
        } else if (document.querySelector('img[src*="captcha.php"]')) {
            return 'normal';
        }
        return null;
    }

    function hasMostRelativeText() {
        const bodyText = document.body.innerText;
        return bodyText.includes('Please Click Most Relative');
    }

    // ==================== SMART REFRESH CHECK ====================
    function shouldRefreshPage() {
        const questionImg = document.querySelector('img[src*="captcha.php"], img[src*="capstart.php"]');
        const answersLoaded = document.querySelectorAll('a[href*="ptc.php"]').length > 0;

        if (answersLoaded && questionImg) {
            return questionImg.naturalWidth === 0 || !questionImg.complete;
        }

        return false;
    }

    // ==================== IMAGE PROCESSING ====================
    function imageToBase64(img) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);

            try {
                const base64 = canvas.toDataURL('image/jpeg', 0.9);
                resolve(base64);
            } catch (e) {
                const base64 = canvas.toDataURL('image/png');
                resolve(base64);
            }
        });
    }

    function extractCaptchaIdFromUrl(url) {
        // Extract cid or scid parameter from URL
        const cidMatch = url.match(/cid=(\d+)/);
        const scidMatch = url.match(/scid=(\d+)/);
        return cidMatch ? cidMatch[1] : (scidMatch ? scidMatch[1] : null);
    }

    function extractImageData() {
        console.log('🔍 Extracting CAPTCHA data...');

        const questionImg = document.querySelector('img[src*="captcha.php"], img[src*="capstart.php"]');
        if (!questionImg) {
            console.log('❌ No question image found');
            return null;
        }

        const answerLinks = Array.from(document.querySelectorAll('a[href*="ptc.php"]'));
        const answerData = [];

        for (const link of answerLinks) {
            const captchaId = extractCaptchaIdFromUrl(link.href);
            const img = link.querySelector('img');

            if (captchaId && img) {
                answerData.push({
                    captcha_id: captchaId,
                    element: link,
                    image: img
                });
            }
        }

        if (answerData.length === 0) {
            console.log('❌ No answer images found');
            return null;
        }

        const captchaType = getCaptchaType();
        console.log(`✅ Found ${answerData.length} answers for ${captchaType} CAPTCHA with IDs:`, answerData.map(a => a.captcha_id));

        return {
            question: questionImg,
            answers: answerData,
            type: captchaType
        };
    }

    async function extractImagesAsBase64() {
        const captchaData = extractImageData();
        if (!captchaData) return null;

        // Wait for images to load
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check if question image failed to load but answers are loaded
        if (shouldRefreshPage()) {
            console.log('🔄 Question image failed but answers loaded - refreshing...');
            location.reload();
            return null;
        }

        // Convert question to base64
        const questionBase64 = await imageToBase64(captchaData.question);

        // Convert answers to base64
        const answersWithData = [];
        for (const answer of captchaData.answers) {
            if (!answer.image.complete) {
                await new Promise(resolve => {
                    answer.image.onload = resolve;
                    answer.image.onerror = resolve;
                    setTimeout(resolve, 2000);
                });
            }

            const imageBase64 = await imageToBase64(answer.image);
            answersWithData.push({
                captcha_id: answer.captcha_id,
                image_base64: imageBase64,
                element: answer.element
            });
        }

        console.log(`✅ All images converted to base64 for ${captchaData.type} CAPTCHA`);
        return {
            question: questionBase64,
            answers: answersWithData,
            elements: captchaData.answers.map(a => a.element),
            type: captchaData.type
        };
    }

    // ==================== PROGRESS BAR WAIT ====================
    function waitForProgressBar() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 69;

            const checkProgress = () => {
                if (!isSolverEnabled) {
                    console.log('⏸️ Solver disabled during progress wait');
                    return;
                }

                attempts++;
                const progressBar = document.getElementById('myProgress');
                const captchaDiv = document.getElementById('captcha');

                // For capstart pages, there's no progress bar, just wait a bit
                if (getCaptchaType() === 'capstart') {
                    console.log('⏳ Capstart page - waiting 3 seconds...');
                    setTimeout(() => resolve(true), 3000);
                    return;
                }

                if ((!progressBar || progressBar.style.display === 'none') &&
                    captchaDiv && captchaDiv.style.display !== 'none') {
                    console.log('✅ Progress bar complete');
                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    console.log('❌ Progress bar timeout');
                    resolve(false);
                } else {
                    setTimeout(checkProgress, 1000);
                }
            };
            checkProgress();
        });
    }

    // ==================== API CALL ====================
    function callAPI(questionBase64, answersWithData) {
        return new Promise((resolve, reject) => {
            if (!isSolverEnabled) {
                reject('Solver disabled by user');
                return;
            }

            console.log('📡 Calling API...');

            const requestData = {
                question_base64: questionBase64,
                answers: answersWithData.map(a => ({
                    captcha_id: a.captcha_id,
                    image_base64: a.image_base64
                }))
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(requestData),
                timeout: 60000,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (response.status === 200 && data.success) {
                            resolve(data);
                        } else {
                            reject(data.error || 'API error');
                        }
                    } catch (e) {
                        reject('Failed to parse API response');
                    }
                },
                onerror: () => reject('API request failed'),
                ontimeout: () => reject('API timeout')
            });
        });
    }

    async function callAPIWithRetry(questionBase64, answersWithData, maxRetries = 20) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            if (!isSolverEnabled) break;

            try {
                console.log(`🔄 API Attempt ${attempt}/${maxRetries}`);
                return await callAPI(questionBase64, answersWithData);
            } catch (error) {
                console.log(`❌ Attempt ${attempt} failed:`, error);
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }
        throw new Error('All API attempts failed');
    }

    // ==================== CLICK LOGIC ====================
    function findElementByCaptchaId(captchaId, elements) {
        for (const element of elements) {
            const elementCaptchaId = extractCaptchaIdFromUrl(element.href);
            if (elementCaptchaId === captchaId) {
                return element;
            }
        }
        return null;
    }

    function showVisualFeedback(element, confidence, captchaType) {
        element.style.border = '3px solid #00ff00';
        element.style.boxShadow = '0 0 15px #00ff00';

        const overlay = document.createElement('div');
        overlay.textContent = `${confidence.toFixed(1)}%`;
        overlay.style.cssText = `
            position: absolute;
            background: rgba(0,255,0,0.8);
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            z-index: 1000;
        `;
        element.style.position = 'relative';
        element.appendChild(overlay);

        console.log(`🎯 ${captchaType.toUpperCase()} CAPTCHA - Best match: ${confidence.toFixed(1)}%`);
    }

    // ==================== MAIN SOLVER ====================
    async function solveCaptcha() {
        // Check if solver is disabled
        if (!isSolverEnabled) {
            console.log('⏸️ Solver disabled - skipping');
            return;
        }

        // Check for "Most Relative" text and stop if found
        if (hasMostRelativeText()) {
            console.log('🛑 "Please solve captcha to surf PTC Ads" or similar text detected - stopping solver');
            isSolverEnabled = false;
            GM_setValue('solverEnabled', false);

            // Update UI
            const button = document.querySelector('#captcha-solver-toggle button');
            const status = document.getElementById('solver-status');
            if (button) {
                button.innerHTML = '🟢 START Solver';
                button.style.background = '#4CAF50';
            }
            if (status) {
                status.textContent = 'Status: STOPPED (Manual CAPTCHA)';
                status.style.color = '#ff4444';
            }
            return;
        }

        try {
            console.log('🔍 Starting CAPTCHA solving...');

            const captchaType = getCaptchaType();
            console.log(`📝 Detected CAPTCHA type: ${captchaType}`);

            // Apply random delay only for capstart pages
            if (captchaType === 'capstart') {
                const delay = getRandomDelay();
                console.log(`⏰ Capstart page - applying random delay: ${Math.round(delay/1000)} seconds`);
                await new Promise(resolve => setTimeout(resolve, delay));
                if (!isSolverEnabled) return;
            }

            // Wait for progress bar (only for normal captcha)
            const progressComplete = await waitForProgressBar();
            if (!progressComplete || !isSolverEnabled) {
                console.log('⏸️ Solver stopped during progress wait');
                return;
            }

            // Wait a bit more for images
            await new Promise(resolve => setTimeout(resolve, 2000));
            if (!isSolverEnabled) return;

            // Extract images
            const imagesData = await extractImagesAsBase64();
            if (!imagesData || !isSolverEnabled) return;

            console.log(`📸 Processing ${imagesData.answers.length} answers for ${imagesData.type} CAPTCHA`);

            // Call API
            const response = await callAPIWithRetry(imagesData.question, imagesData.answers);
            if (!response || !isSolverEnabled) return;

            // Find and click best match
            const bestElement = findElementByCaptchaId(response.best_match, imagesData.elements);
            if (bestElement && isSolverEnabled) {
                console.log(`🎯 Clicking ${imagesData.type} CAPTCHA - ID: ${response.best_match} (${response.best_confidence.toFixed(1)}%)`);

                showVisualFeedback(bestElement, response.best_confidence, imagesData.type);

                setTimeout(() => {
                    if (isSolverEnabled) {
                        bestElement.click();
                    }
                }, 1500);
            }

        } catch (error) {
            console.log('❌ Solver error:', error);
        }
    }

    // ==================== INITIALIZATION ====================
    function init() {
        console.log('🚀 CAPTCHA Solver initialized - Multi-Type with Random Delay');

        // Create toggle UI
        createToggleUI();

        // Only auto-start if enabled and on CAPTCHA page
        if (isSolverEnabled && isCaptchaPage()) {
            const captchaType = getCaptchaType();
            console.log(`🎯 ${captchaType.toUpperCase()} CAPTCHA page detected - starting solver`);

            // Start immediately for normal captcha, delayed for capstart
            if (captchaType === 'capstart') {
                const initialDelay = getRandomDelay();
                console.log(`⏰ Initial random delay for capstart: ${Math.round(initialDelay/1000)} seconds`);
                setTimeout(solveCaptcha, initialDelay);
            } else {
                setTimeout(solveCaptcha, 3000);
            }
        }
    }

    // ==================== START SCRIPT ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();