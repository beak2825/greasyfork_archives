// ==UserScript==
// @name         Apex Learning Quiz Cheat
// @namespace    https://github.com/paysonism/Apex-Learning-UserScript
// @version      8.4
// @description  2026!!! Full AI Based cheat for Apex Learning. Includes Image Support, Answer Highlighting, Auto-Complete, and Keybind Controls
// @author       paysonism
// @match        https://course.apexlearning.com/public/activity/*
// @match        https://*.apexvs.com/public/activity/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      generativelanguage.googleapis.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555878/Apex%20Learning%20Quiz%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/555878/Apex%20Learning%20Quiz%20Cheat.meta.js
// ==/UserScript==
//
//
//        Thanks for using! Please support me by giving
//                  the GitHub repo a star!
//
//
//      ====================================================
//     |  Keybinds - MENU WILL SHOW FOR 1S ON CHANGE        |
//     |  Ctrl+Shift+E - Toggle Enable/Disable Script       |
//     |  Ctrl+Shift+A - Toggle Auto-Complete Mode          |
//     |  Ctrl+Shift+R - Manual Reprocess Current Question  |
//      ====================================================

(function() {
    'use strict';

    // CONFIGURATION - MUST ADD API KEY!
    // ============================================
    const GEMINI_API_KEY = YOUR_API_KEY_HERE// Get a free key from: https://aistudio.google.com/app/apikey
    const DEBUG_MODE = false; // Set to true for error logging

    // Optimal size <= 384x384 pixels (258 Tokens Per Img)
    // Larger images are tiled into 768x768 sections, each = 258 tokens
    const MAX_IMAGE_WIDTH = 384;
    const MAX_IMAGE_HEIGHT = 384;
    const IMAGE_QUALITY = 0.85;

    const AUTO_SELECT_DELAY = 500;
    const AUTO_SUBMIT_DELAY = 1000;
    const NEXT_QUESTION_DELAY = 1000;
    const VIEW_SUMMARY_DELAY = 500;

    let lastQuestionText = '';
    let isProcessing = false;
    let progressInterval = null;
    let isEnabled = GM_getValue('scriptEnabled', true);
    let autoCompleteEnabled = GM_getValue('autoCompleteEnabled', false);
    let notificationTimeout = null;

    function log(...args) {
        if (DEBUG_MODE) {
            console.log(...args);
        }
    }

    function logError(...args) {
        if (DEBUG_MODE) {
            console.error(...args);
        }
    }

    let courseTitle = null;

    function getCourseTitle() {
        if (courseTitle) return courseTitle;
        const el = document.querySelector('.course-title');
        if (el) {
            const text = el.textContent.trim();
            if (text) {
                courseTitle = text;
            }
        }
        return courseTitle;
    }

    function showApiLimitWarning() {
        const darkMode = isDarkMode();
        const styles = darkMode ? {
            background: 'rgba(220, 38, 38, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            boxShadow: '0 8px 32px rgba(220, 38, 38, 0.5)'
        } : {
            background: 'rgba(239, 68, 68, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            color: '#ffffff',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)'
        };

        const existing = document.getElementById('apex-api-limit-warning');
        if (existing) {
            existing.remove();
        }

        const warning = document.createElement('div');
        warning.id = 'apex-api-limit-warning';
        warning.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${styles.background};
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: ${styles.border};
            color: ${styles.color};
            padding: 30px 40px;
            border-radius: 16px;
            z-index: 9999999;
            font-family: 'Bahnschrift', 'Segoe UI', Tahoma, sans-serif;
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0.5px;
            box-shadow: ${styles.boxShadow};
            animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            min-width: 300px;
            max-width: 500px;
            text-align: center;
        `;

        warning.innerHTML = `
            <div style="text-shadow: ${styles.textShadow}; margin-bottom: 15px;">
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 10px;">⚠️ API Rate Limit Reached</div>
                <div style="font-size: 14px; opacity: 0.95; line-height: 1.6;">
                    You've hit the <b>15 requests per second</b> limit. Please wait <b>1 minute</b> for the rate limit to reset before trying again.
                </div>
                <div style="font-size: 12px; opacity: 0.85; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                    The script will automatically retry when the cooldown expires.
                </div>
            </div>
        `;

        document.body.appendChild(warning);

        setTimeout(() => {
            if (warning.parentNode) {
                warning.style.animation = 'slideOut 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                setTimeout(() => {
                    if (warning.parentNode) {
                        warning.remove();
                    }
                }, 300);
            }
        }, 10000);
    }

    function isDarkMode() {
        try {
            const body = document.body;
            if (!body) return false;

            const computedStyle = window.getComputedStyle(body);
            const bgColor = computedStyle.backgroundColor;

            if (bgColor) {
                const rgbMatch = bgColor.match(/\d+/g);
                if (rgbMatch && rgbMatch.length >= 3) {
                    const r = parseInt(rgbMatch[0], 10);
                    const g = parseInt(rgbMatch[1], 10);
                    const b = parseInt(rgbMatch[2], 10);
                    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    return luminance < 0.5; // Dark if luminance < 0.5
                }
            }

            const html = document.documentElement;
            if (html) {
                if (html.classList.contains('dark') ||
                    html.classList.contains('dark-mode') ||
                    html.getAttribute('data-theme') === 'dark' ||
                    html.style.colorScheme === 'dark') {
                    return true;
                }
            }


            if (window.matchMedia) {
                try {
                    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    if (darkModeQuery && darkModeQuery.matches) {
                        // But also check if site actually respects it
                        const testBg = computedStyle.backgroundColor;
                        if (testBg && testBg !== 'rgba(0, 0, 0, 0)' && testBg !== 'transparent') {
                            const testRgb = testBg.match(/\d+/g);
                            if (testRgb && testRgb.length >= 3) {
                                const testLum = (0.299 * parseInt(testRgb[0], 10) + 0.587 * parseInt(testRgb[1], 10) + 0.114 * parseInt(testRgb[2], 10)) / 255;
                                return testLum < 0.5;
                            }
                        }
                    }
                } catch (e) {
                    // Ignore
                }
            }
        } catch (e) {
            logError('Error detecting dark mode:', e);
        }

        return false;
    }

    function showNotification(message, duration = 2000) {
        const existing = document.getElementById('apex-notification');
        if (existing) {
            existing.remove();
        }

        const darkMode = isDarkMode();

        const darkModeStyles = {
            background: 'rgba(30, 30, 30, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        };

        const lightModeStyles = {
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            color: '#1a1a1a',
            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        };

        const styles = darkMode ? darkModeStyles : lightModeStyles;

        const notification = document.createElement('div');
        notification.id = 'apex-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${styles.background};
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: ${styles.border};
            color: ${styles.color};
            padding: 20px 25px;
            border-radius: 16px;
            z-index: 999999;
            font-family: 'Bahnschrift', 'Segoe UI', Tahoma, sans-serif;
            font-size: 15px;
            font-weight: 300;
            letter-spacing: 0.5px;
            box-shadow: ${styles.boxShadow};
            animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            min-width: 200px;
        `;

        notification.innerHTML = `
            <style>
                @keyframes slideIn {
                    from {
                        transform: translateX(400px) scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px) scale(0.8);
                        opacity: 0;
                    }
                }
            </style>
            <div style="text-shadow: ${styles.textShadow};">${message}</div>
        `;

        document.body.appendChild(notification);

        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        notificationTimeout = setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }

    function hasQuizContent() {
        const hasStem = document.querySelector('.sia-question-stem') !== null;
        const hasQuestion = document.querySelector('kp-sia-question') !== null;
        const hasDistractors = document.querySelectorAll('.sia-distractor').length > 0;
        return hasStem || hasQuestion || hasDistractors;
    }

    function extractQuestion() {
        const siaQuestion = document.querySelector('kp-sia-question');
        if (siaQuestion) {
            const kpContent = siaQuestion.querySelector('kp-content');
            if (kpContent) {
                const generated = kpContent.querySelector('[class*="kp-generated"]');
                if (generated) {
                    return generated.textContent.trim();
                }
                const text = kpContent.textContent.trim();
                if (text) return text;
            }
        }

        const questionStem = document.querySelector('.sia-question-stem');
        if (questionStem) {
            const allElements = questionStem.querySelectorAll('*');
            for (let el of allElements) {
                if (el.className && el.className.includes('kp-generated')) {
                    const text = el.textContent.trim();
                    if (text) return text;
                }
            }
            const text = questionStem.textContent.trim();
            if (text) return text;
        }

        return null;
    }

    function resizeAndCompressImage(img) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.naturalWidth || img.width;
                let height = img.naturalHeight || img.height;

                log(`Original image size: ${width}x${height}`);

                if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
                    const ratio = Math.min(MAX_IMAGE_WIDTH / width, MAX_IMAGE_HEIGHT / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                log(`Resized to: ${width}x${height}`);

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create blob'));
                        return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = function () {
                        const base64data = reader.result.split(',')[1];
                        const originalSize = (base64data.length * 0.75 / 1024).toFixed(2);
                        log(`Compressed image size: ${originalSize} KB`);

                        resolve({
                            data: base64data,
                            mimeType: 'image/jpeg'
                        });
                    };
                    reader.onerror = () => reject(new Error('Failed to read blob'));
                    reader.readAsDataURL(blob);
                }, 'image/jpeg', IMAGE_QUALITY);

            } catch (e) {
                reject(e);
            }
        });
    }

    async function extractImages() {
        const images = [];
        const questionContainers = [];
        const answerContainers = [];

        const questionArea = document.querySelector('kp-sia-question');
        if (questionArea) questionContainers.push(questionArea);

        const stemArea = document.querySelector('.sia-question-stem');
        if (stemArea && stemArea !== questionArea) questionContainers.push(stemArea);

        document.querySelectorAll('.sia-distractor').forEach(d => {
            answerContainers.push(d);
        });

        const questionImgSet = new Set();
        questionContainers.forEach(c => {
            c.querySelectorAll('img').forEach(img => questionImgSet.add(img));
        });

        const answerImgSet = new Set();
        answerContainers.forEach(c => {
            c.querySelectorAll('img').forEach(img => answerImgSet.add(img));
        });

        // Limit total to 2 images max to avoid blocking (prioritize question images)
        // Gemini seems to block requests with 3+ images in some cases
        const MAX_IMAGES = 2;
        const questionImages = Array.from(questionImgSet);
        const answerImages = Array.from(answerImgSet);

        let imgElements;
        if (questionImages.length + answerImages.length <= MAX_IMAGES) {
            imgElements = [...questionImages, ...answerImages];
        } else {
            const remainingSlots = MAX_IMAGES - questionImages.length;
            if (remainingSlots > 0) {
                imgElements = [...questionImages, ...answerImages.slice(0, remainingSlots)];
            } else {
                imgElements = questionImages.slice(0, MAX_IMAGES);
            }
        }

        log(`Found ${questionImages.length} question image(s) and ${answerImages.length} answer image(s), processing ${imgElements.length} total`);

        const processedImages = new Map(); // key: image source, value: processed image data

        for (let imgEl of imgElements) {
            try {
                let imageSrc = imgEl.src || imgEl.dataset.src || imgEl.getAttribute('data-src') || imgEl.currentSrc;

                if (!imageSrc) {
                    logError('No image source found for element');
                    continue;
                }

                const normalizedSrc = imageSrc.split('?')[0].split('#')[0];

                if (processedImages.has(normalizedSrc)) {
                    log(`Skipping duplicate image: ${normalizedSrc}`);
                    continue;
                }

                if (imageSrc.startsWith('data:')) {
                    const base64Data = imageSrc.split(',')[1];
                    const mimeType = imageSrc.split(';')[0].split(':')[1];
                    const imageData = {
                        data: base64Data,
                        mimeType: mimeType || 'image/png'
                    };
                    images.push(imageData);
                    processedImages.set(normalizedSrc, imageData);
                    log('Used existing base64 image');
                    continue;
                }

                if (imgEl.complete && imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0) {
                    log('Image already loaded, using existing image element');
                    const compressedImage = await resizeAndCompressImage(imgEl);
                    images.push(compressedImage);
                    processedImages.set(normalizedSrc, compressedImage);
                    log('Image processed and compressed');
                    continue;
                }

                const img = new Image();
                img.crossOrigin = 'anonymous';

                const imageLoadPromise = new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Image load timeout'));
                    }, 10000); // 10 seconds

                    img.onload = () => {
                        clearTimeout(timeout);
                        resolve(img);
                    };
                    img.onerror = () => {
                        clearTimeout(timeout);
                        reject(new Error('Failed to load image'));
                    };

                    img.src = imageSrc;
                });

                await imageLoadPromise;
                const compressedImage = await resizeAndCompressImage(img);
                images.push(compressedImage);
                processedImages.set(normalizedSrc, compressedImage);
                log('Image processed and compressed');

            } catch (error) {
                logError('Error processing image:', error);

                try {
                    const imageSrc = imgEl.src || imgEl.dataset.src || imgEl.getAttribute('data-src') || imgEl.currentSrc;
                    if (!imageSrc) {
                        continue;
                    }

                    const normalizedSrc = imageSrc.split('?')[0].split('#')[0];

                    if (processedImages.has(normalizedSrc)) {
                        log(`Skipping duplicate image in fallback: ${normalizedSrc}`);
                        continue;
                    }

                    if (imgEl.complete && imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0) {
                        log('Fallback: Using original image element');
                        const compressedImage = await resizeAndCompressImage(imgEl);
                        images.push(compressedImage);
                        processedImages.set(normalizedSrc, compressedImage);
                        log('Fallback image processed');
                    } else if (imgEl.src && imgEl.src.startsWith('data:')) {
                        const base64Data = imgEl.src.split(',')[1];
                        const mimeType = imgEl.src.split(';')[0].split(':')[1];
                        const imageData = {
                            data: base64Data,
                            mimeType: mimeType || 'image/png'
                        };
                        images.push(imageData);
                        processedImages.set(normalizedSrc, imageData);
                        log('Used original base64 image (compression failed)');
                    }
                } catch (fallbackError) {
                    logError('Fallback also failed:', fallbackError);
                }
            }
        }

        log(`Processed ${images.length} unique image(s) (${imgElements.length} total found, ${imgElements.length - images.length} duplicates skipped)`);

        return images;
    }

    function extractAnswers() {
        const answers = [];
        const distractors = document.querySelectorAll('.sia-distractor');

        distractors.forEach((distractor, index) => {
            const choiceLetter = distractor.querySelector('.sia-choice-letter')?.textContent.trim();
            let answerText = null;

            const kpContent = distractor.querySelector('kp-content');
            if (kpContent) {
                const generated = kpContent.querySelector('[class*="kp-generated"]');
                if (generated) {
                    answerText = generated.textContent.trim();
                } else {
                    answerText = kpContent.textContent.trim();
                }
            }

            if (!answerText) {
                const labelDiv = distractor.querySelector('.label');
                if (labelDiv) {
                    answerText = labelDiv.textContent.replace(choiceLetter || '', '').trim();
                }
            }

            if (!answerText) {
                const imageInOption = distractor.querySelector('kp-content img, .label img');
                if (imageInOption) {
                    const letterClean = (choiceLetter || String.fromCharCode(65 + index) + '.').replace(/[^A-Z]/gi, '').toUpperCase();
                    answerText = `Image answer option ${letterClean}`;
                }
            }

            if (answerText) {
                answers.push({
                    letter: choiceLetter || String.fromCharCode(65 + index) + '.',
                    text: answerText,
                    element: distractor
                });
            }
        });

        return answers;
    }

    function createProgressBar() {
        let progressBar = document.getElementById('gemini-progress-bar');

        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'gemini-progress-bar';
            progressBar.style.cssText = `
                position: fixed;
                bottom: 25px;
                right: 25px;
                width: 200px;
                height: 6px;
                background: #e0e0e0;
                border-radius: 2px;
                overflow: hidden;
                z-index: 999999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

            const progressFill = document.createElement('div');
            progressFill.id = 'gemini-progress-fill';
            progressFill.style.cssText = `
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #4285f4, #34a853);
                border-radius: 2px;
                transition: width 0.1s linear;
            `;

            progressBar.appendChild(progressFill);
            document.body.appendChild(progressBar);
        }

        return progressBar;
    }

    function showProgress() {
        const progressBar = createProgressBar();
        const progressFill = document.getElementById('gemini-progress-fill');

        progressBar.style.opacity = '0.75';
        progressFill.style.width = '0%';

        let progress = 0;
        const duration = 3000;
        const interval = 50;
        const increment = (interval / duration) * 100;

        if (progressInterval) {
            clearInterval(progressInterval);
        }

        progressInterval = setInterval(() => {
            progress += increment;
            if (progress >= 95) {
                progress = 95;
            }
            progressFill.style.width = progress + '%';
        }, interval);
    }

    function hideProgress(success = true) {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }

        const progressBar = document.getElementById('gemini-progress-bar');
        const progressFill = document.getElementById('gemini-progress-fill');

        if (progressBar && progressFill) {
            if (success) {
                progressFill.style.width = '100%';
                setTimeout(() => {
                    progressBar.style.opacity = '0';
                    setTimeout(() => {
                        progressFill.style.width = '0%';
                    }, 300);
                }, 300);
            } else {
                progressFill.style.background = '#ea4335';
                setTimeout(() => {
                    progressBar.style.opacity = '0';
                    setTimeout(() => {
                        progressFill.style.width = '0%';
                        progressFill.style.background = 'linear-gradient(90deg, #4285f4, #34a853)';
                    }, 300);
                }, 500);
            }
        }
    }

    function queryGemini(question, answers, images, allowMultiple) {
        return new Promise((resolve, reject) => {
            if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
                reject(new Error('No API key configured'));
                return;
            }

            const answerList = answers.map(a => `${a.letter} ${a.text}`).join('\n');
            const availableLetters = Array.from(new Set(answers.map(a => a.letter.replace(/[^A-Z]/gi, '').trim().toUpperCase()).filter(Boolean)));

            const currentCourseTitle = getCourseTitle();

            let prompt = `You are solving problems from a standard US high school course. Use your full reasoning ability to understand the problem, but your final answer must match what a careful high school teacher and official answer key would mark correct for this course. Base your reasoning on the facts, methods, and conventions that a strong high school student is expected to use. Avoid exotic or nonstandard interpretations that would not appear in a normal high school solution. Always think through the problem step by step, and then double-check your final choice against all of the given information before you answer. `;

            if (currentCourseTitle) {
                prompt += `The question is from the course "${currentCourseTitle}". Use reasoning and examples that match this specific high school subject and its usual curriculum. `;
            }

            if (images.length > 0) {
                prompt += `IMPORTANT: ${images.length} image(s) will be provided BEFORE the question text. These images are part of the QUESTION and contain diagrams, charts, geometric figures, graphs, or other visual information needed to answer. Analyze these images carefully as they are essential to understanding the problem. `;
            }

            if (allowMultiple) {
                prompt += `You are answering a "select all that apply" multiple-choice question.

CRITICAL: Your response must contain ONLY the letter(s) of the correct answer(s) from this list: ${availableLetters.join(', ')}. Do NOT include any explanations, reasoning, calculations, or other text. Output ONLY the letter(s) separated by commas or spaces.

Question: ${question}

Answer Options:
${answerList}

Your response (letters only, no other text):`;
            } else {
                prompt += `You are answering a single-choice multiple-choice question.

CRITICAL: Your response must contain ONLY the single letter of the correct answer from this list: ${availableLetters.join(', ')}. Do NOT include any explanations, reasoning, calculations, or other text. Output ONLY the single letter.

Question: ${question}

Answer Options:
${answerList}

Your response (single letter only, no other text):`;
            }

            const parts = [];

            // Add images FIRST, then text prompt
            if (images.length > 0) {
                log(`Including ${images.length} optimized image(s) in request`);
                images.forEach((img) => {
                    parts.push({
                        inline_data: {
                            mime_type: img.mimeType,
                            data: img.data
                        }
                    });
                });
            }

            parts.push({ text: prompt });

            const requestData = {
                contents: [{
                    parts: parts
                }],
                generationConfig: {
                    temperature: 0.1,
                    topP: 0.2,
                    topK: 1
                }
            };

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`; // this is the free model. if you pay for gemini you can upgrade this.

            log('Querying Gemini' + (images.length > 0 ? ' with vision' : ''));

            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(requestData),
                onload: function (response) {
                    try {
                        log(`API Response Status: ${response.status}`);
                        if (response.status !== 200) {
                            logError('Non-200 response status:', response.status);
                            logError('Response text:', response.responseText);
                        }
                        const data = JSON.parse(response.responseText);

                        if (data.error) {
                            logError('API Error:', data.error);
                            reject(new Error(data.error.message));
                            return;
                        }

                        if (data.candidates && data.candidates.length > 0) {
                            const candidate = data.candidates[0];
                            let answer = null;

                            if (candidate.content && candidate.content.parts) {
                                if (Array.isArray(candidate.content.parts) && candidate.content.parts.length > 0) {
                                    const part = candidate.content.parts[0];
                                    if (part && part.text) {
                                        answer = part.text;
                                    }
                                }
                            }

                            if (answer) {
                                log('Full response text:', answer);

                                const upper = answer.toUpperCase().trim();

                                const lastPart = upper.slice(-100);

                                const explicitPatterns = [
                                    /(?:THE\s+)?(?:CORRECT\s+)?(?:ANSWER\s+)?(?:IS\s+)?([A-Z])(?:\s*)$/i,
                                    /(?:ANSWER\s*:?\s*)([A-Z])(?:\s*)$/i,
                                    /(?:CHOICE\s*:?\s*)([A-Z])(?:\s*)$/i,
                                    /(?:OPTION\s*:?\s*)([A-Z])(?:\s*)$/i,
                                    /(?:CORRECT\s+)?(?:ANSWER|CHOICE|OPTION)\s+([A-Z])(?:\s*)$/i
                                ];

                                let extractedLetter = null;

                                for (const pattern of explicitPatterns) {
                                    const match = lastPart.match(pattern);
                                    if (match && match[1] && availableLetters.includes(match[1])) {
                                        extractedLetter = match[1];
                                        log('Extracted answer from explicit pattern at end:', extractedLetter);
                                        break;
                                    }
                                }

                                if (!extractedLetter) {
                                    for (const pattern of explicitPatterns) {
                                        const match = upper.match(pattern);
                                        if (match && match[1] && availableLetters.includes(match[1])) {
                                            extractedLetter = match[1];
                                            log('Extracted answer from explicit pattern:', extractedLetter);
                                            break;
                                        }
                                    }
                                }

                                if (!extractedLetter) {
                                    const endLetterMatch = upper.match(/([A-Z])\s*$/);
                                    if (endLetterMatch && endLetterMatch[1] && availableLetters.includes(endLetterMatch[1])) {
                                        extractedLetter = endLetterMatch[1];
                                        log('Extracted answer from last character:', extractedLetter);
                                    }
                                }

                                if (!extractedLetter && upper.length < 50) {
                                    const startMatch = upper.match(/^([A-Z])(?:\s|$|[\.\,])/);
                                    if (startMatch && startMatch[1] && availableLetters.includes(startMatch[1])) {
                                        extractedLetter = startMatch[1];
                                        log('Extracted answer from start (short response):', extractedLetter);
                                    }
                                }

                                if (!extractedLetter) {
                                    const allLetters = upper.match(/[A-Z]/g) || [];
                                    for (let i = allLetters.length - 1; i >= 0; i--) {
                                        if (availableLetters.includes(allLetters[i])) {
                                            extractedLetter = allLetters[i];
                                            log('Extracted answer from last valid letter (fallback):', extractedLetter);
                                            break;
                                        }
                                    }
                                }

                                if (allowMultiple) {
                                    const matches = upper.match(/[A-Z]/g) || [];
                                    const unique = Array.from(new Set(matches));
                                    const selected = unique.filter(l => availableLetters.includes(l));
                                    if (selected.length > 0) {
                                        log('Extracted multiple answers:', selected.join(', '));
                                        resolve(selected);
                                    } else {
                                        reject(new Error('No valid answer letters in response'));
                                    }
                                } else {
                                    if (extractedLetter) {
                                        log('Extracted answer:', extractedLetter);
                                        resolve(extractedLetter);
                                    } else {
                                        reject(new Error('No valid answer letter in response'));
                                    }
                                }
                            } else {
                                logError('No text in response');

                                if (candidate.finishReason === 'SAFETY') {
                                    reject(new Error('Response blocked by safety filter'));
                                } else if (candidate.finishReason === 'MAX_TOKENS') {
                                    reject(new Error('MAX_TOKENS issue'));
                                } else {
                                    reject(new Error(`No text (finish: ${candidate.finishReason})`));
                                }
                            }
                        } else {
                            let errorMessage = 'No candidates';
                            if (data.promptFeedback) {
                                logError('Prompt feedback:', data.promptFeedback);
                                if (data.promptFeedback.blockReason) {
                                    const blockReason = data.promptFeedback.blockReason;
                                    logError('Block reason:', blockReason);
                                        errorMessage = `Content blocked: ${blockReason}`;

                                        if (data.promptFeedback.safetyRatings) {
                                        logError('Safety ratings:', data.promptFeedback.safetyRatings);
                                    }
                                }
                            }
                            if (data.error) {
                                logError('API error in response:', data.error);
                            }
                            reject(new Error(errorMessage));
                        }
                    } catch (e) {
                        logError('Parse error:', e);
                        reject(e);
                    }
                },
                onerror: function (error) {
                    logError('Request error:', error);
                        reject(error);
                }
            });
        });
    }

    function removeHighlights() {
        document.querySelectorAll('.sia-distractor').forEach(el => {
            const labelDiv = el.querySelector('.label');
            if (labelDiv) {
                labelDiv.style.color = '';
                labelDiv.style.fontWeight = '';
                labelDiv.style.opacity = '';
            }
        });
    }

    function highlightAnswer(answers, correctLetters) {
        const lettersArray = Array.isArray(correctLetters) ? correctLetters : [correctLetters];
        const normalizedSet = new Set(lettersArray.map(l => l.replace(/[^A-Z]/gi, '').trim().toUpperCase()).filter(Boolean));
        if (normalizedSet.size === 0) return;
        log('Highlighting answers:', Array.from(normalizedSet).join(', '));

        answers.forEach(answer => {
            const normalizedAnswerLetter = answer.letter.replace(/[^A-Z]/gi, '').trim().toUpperCase();

            if (normalizedSet.has(normalizedAnswerLetter)) {
                const labelDiv = answer.element.querySelector('.label');
                if (labelDiv) {
                    labelDiv.style.color = '#059900ff';
                    labelDiv.style.fontWeight = '600';
                    labelDiv.style.opacity = '0.65';
                }

                log(`Highlighted answer ${answer.letter}`);
            }
        });
    }

    function selectAnswer(answers, correctLetters) {
        const lettersArray = Array.isArray(correctLetters) ? correctLetters : [correctLetters];
        const normalizedSet = new Set(lettersArray.map(l => l.replace(/[^A-Z]/gi, '').trim().toUpperCase()).filter(Boolean));
        if (normalizedSet.size === 0) return false;

        let selectedAny = false;

        answers.forEach(answer => {
            const normalizedAnswerLetter = answer.letter.replace(/[^A-Z]/gi, '').trim().toUpperCase();

            if (normalizedSet.has(normalizedAnswerLetter)) {
                log('Auto-selecting answer:', normalizedAnswerLetter);

                const checkbox = answer.element.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    if (!checkbox.checked) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                    }
                    selectedAny = true;
                    return;
                }

                const radioButton = answer.element.querySelector('input[type="radio"]');
                if (radioButton) {
                    if (!radioButton.checked) {
                    radioButton.checked = true;
                    radioButton.dispatchEvent(new Event('change', { bubbles: true }));
                    radioButton.dispatchEvent(new Event('click', { bubbles: true }));
                    }
                    selectedAny = true;
                    return;
                }

                answer.element.click();
                selectedAny = true;
            }
        });

        return selectedAny;
    }

    function submitAnswer() {
        log('Attempting to submit answer');
        const submitSelectors = [
            'button[type="submit"]',
            'button.submit',
            'button.submit-button',
            'input[type="submit"]',
            '.submit-button',
            '[class*="submit"]'
        ];

        for (let selector of submitSelectors) {
            const buttons = document.querySelectorAll(selector);
            for (let button of buttons) {
                if (button.offsetParent !== null) {
                    const buttonText = button.textContent.trim().toUpperCase();
                    if (buttonText.includes('SUBMIT') || buttonText.includes('CHECK') ||
                        (buttonText.includes('ANSWER') && !buttonText.includes('NEXT'))) {
                        log('Found submit button:', buttonText);
                        button.click();
                        return true;
                    }
                }
            }
        }

        log('Submit button not found');
        return false;
    }

    function clickNextQuestion() {
    log('Attempting to click next question button');

    const nextSelectors = [
        'button.submit-button',
        'button.next',
        '[class*="next"]',
        '[class*="continue"]'
    ];

    for (let selector of nextSelectors) {
        const buttons = document.querySelectorAll(selector);
        for (let button of buttons) {
            if (button.offsetParent !== null) {
                const buttonText = button.textContent.trim().toUpperCase();
                log('Found button with text:', buttonText);

                if (buttonText.includes('VIEW SUMMARY')) {
                    log('Found VIEW SUMMARY button - clicking and disabling auto-complete');
                    button.click();

                    autoCompleteEnabled = false;
                    GM_setValue('autoCompleteEnabled', false);

                    const message = `
                        <div style="font-size: 15px; font-weight: 400;"><b>Quiz Complete!<b></div>
                        <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">Auto-Complete: <span style="color: #f87171"><b>Disabled<b></span></div>
                    `;
                    showNotification(message, 3000);

                    return true;
                }

                if (buttonText.includes('NEXT') || buttonText.includes('CONTINUE')) {
                    log('Clicking next question button');
                    button.click();

                    setTimeout(() => {
                        lastQuestionText = '';
                    }, 500);

                    return true;
                }
            }
        }
    }

    log('Next question button not found');
    return false;
}


    async function processQuiz() {
        if (!isEnabled || isProcessing) return;

        if (!hasQuizContent()) {
            return;
        }

        const question = extractQuestion();
        if (!question) {
            return;
        }

        if (question === lastQuestionText) {
            return;
        }

        log('New question detected');
        lastQuestionText = question;
        isProcessing = true;

        removeHighlights();
        showProgress();

        let images = [];

        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            const answers = extractAnswers();
            if (answers.length === 0) {
                log('No answers found');
                hideProgress(false);
                isProcessing = false;
                return;
            }

            images = await extractImages();
            if (images.length > 0) {
                log(`Processed ${images.length} optimized image(s)`);
            }

            const isMultiple = !!document.querySelector('kp-sia-question-multiple-response, kp-sia-question-multiple, .sia-distractor input[type="checkbox"]');
            const correctAnswer = await queryGemini(question, answers, images, isMultiple);
            const correctLetters = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
            highlightAnswer(answers, correctLetters);
            hideProgress(true);

            if (autoCompleteEnabled) {
                setTimeout(() => {
                    const selected = selectAnswer(answers, correctLetters);
                    if (selected) {
                        log('Answer selected, waiting before submit');

                        setTimeout(() => {
                            const submitted = submitAnswer();

                            if (submitted) {
                                log('Answer submitted, waiting before clicking next');

                                setTimeout(() => {
                                    clickNextQuestion();
                                }, NEXT_QUESTION_DELAY);
                            }
                        }, AUTO_SUBMIT_DELAY);
                    }
                }, AUTO_SELECT_DELAY);
            }

        } catch (error) {
            logError('Error:', error.message);
            hideProgress(false);

            const isBlockedWithImages = error.message && error.message.includes('Content blocked') && images && images.length > 1;

            if (isBlockedWithImages) {
                log('Content blocked with multiple images, retrying with single largest question image...');

                // Extract just the largest question image
                const questionArea = document.querySelector('kp-sia-question');
                const stemArea = document.querySelector('.sia-question-stem');
                const questionContainers = [];
                if (questionArea) questionContainers.push(questionArea);
                if (stemArea && stemArea !== questionArea) questionContainers.push(stemArea);

                const questionImgs = [];
                questionContainers.forEach(c => {
                    c.querySelectorAll('img').forEach(img => {
                        if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                            const size = img.naturalWidth * img.naturalHeight;
                            questionImgs.push({ img, size });
                        }
                    });
                });

                if (questionImgs.length > 0) {
                    questionImgs.sort((a, b) => b.size - a.size);
                    const largestImg = questionImgs[0].img;

                    try {
                        const singleImage = await resizeAndCompressImage(largestImg);
                        log('Retrying with single largest question image');

                        const retryAnswers = extractAnswers();
                        const retryIsMultiple = !!document.querySelector('kp-sia-question-multiple-response, kp-sia-question-multiple, .sia-distractor input[type="checkbox"]');
                        const correctAnswer = await queryGemini(question, retryAnswers, [singleImage], retryIsMultiple);
                        const correctLetters = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
                        highlightAnswer(retryAnswers, correctLetters);
                        hideProgress(true);

                        if (autoCompleteEnabled) {
                setTimeout(() => {
                                const selected = selectAnswer(retryAnswers, correctLetters);
                                if (selected) {
                setTimeout(() => {
                                        const submitted = submitAnswer();
                                        if (submitted) {
                                            setTimeout(() => {
                                                clickNextQuestion();
                                            }, NEXT_QUESTION_DELAY);
                                        }
                                    }, AUTO_SUBMIT_DELAY);
                                }
                            }, AUTO_SELECT_DELAY);
                        }
                        return
                    } catch (retryError) {
                        logError('Retry with single image also failed:', retryError.message);
                    }
                }
            }
        } finally {
            isProcessing = false;
        }
    }

    function waitForAngular(callback, maxAttempts = 100, attempt = 0) {
        const isAngularReady = () => {
            try {
                if (window.Zone && window.Zone.current) {
                    return true;
                }
                const body = document.body;
                if (body && body.getAttribute('ng-version')) {
                    return true;
                }
                const appRoot = document.querySelector('[ng-version], [ng-app], [data-ng-app], kp-main');
                return appRoot !== null;
            } catch (e) {
                return false;
            }
        };

        if (isAngularReady() || attempt >= maxAttempts) {
            setTimeout(callback, 2000);
            return;
        }

        setTimeout(() => waitForAngular(callback, maxAttempts, attempt + 1), 100);
    }

    function startMonitoring() {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
            console.error('Apex Quiz Auto-Answer: No API key configured. Get one from https://aistudio.google.com/app/apikey');
            return;
        }

        waitForAngular(() => {
            log('Apex Quiz Auto-Answer Active');
            log('Images will be resized to max 384x384 (optimal token usage)');

            setTimeout(processQuiz, 2000);

            const observer = new MutationObserver((mutations) => {
                const relevantChange = mutations.some(mutation => {
                    return Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType === 1) {
                            return node.classList?.contains('sia-distractor') ||
                                   node.classList?.contains('sia-question-stem') ||
                                   node.querySelector?.('.sia-distractor') ||
                                   node.querySelector?.('.sia-question-stem');
                        }
                        return false;
                    });
                });

                if (relevantChange) {
                    setTimeout(processQuiz, 500);
                }
            });

            const mainContent = document.querySelector('kp-main, main, .sia-content');
            if (mainContent) {
                observer.observe(mainContent, {
                    childList: true,
                    subtree: true
                });
            }

            setInterval(processQuiz, 3000);
        });
    }

    let scriptInitialized = false;

    function init() {
        if (scriptInitialized) return;
        scriptInitialized = true;

        startMonitoring();

        const statusMessage = `
            <div style="font-size: 16px; margin-bottom: 8px; font-weight: 400;">Apex Quiz Helper</div>
            <div style="font-size: 13px; opacity: 0.9;">Script: <span style="color: ${isEnabled ? '#4ade80' : '#f87171'}"><b>${isEnabled ? 'Enabled' : 'Disabled'}</b></span></div>
            <div style="font-size: 13px; opacity: 0.9;">Auto-Complete: <span style="color: ${autoCompleteEnabled ? '#4ade80' : '#f87171'}"><b>${autoCompleteEnabled ? 'ON' : 'OFF'}</b></span></div>
        `;
        showNotification(statusMessage, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.readyState === 'complete') {
                setTimeout(init, 1500);
            } else {
                window.addEventListener('load', () => setTimeout(init, 1500), { once: true });
            }
        });
    } else {
        if (document.readyState === 'complete') {
            setTimeout(init, 1500);
        } else {
            window.addEventListener('load', () => setTimeout(init, 1500), { once: true });
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            isEnabled = !isEnabled;
            GM_setValue('scriptEnabled', isEnabled);
            const message = `
                <div style="font-size: 15px; font-weight: 400;">Script <b>${isEnabled ? 'Enabled' : 'Disabled'}</b></div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">Status: <span style="color: ${isEnabled ? '#4ade80' : '#f87171'}"><b>${isEnabled ? 'Active' : 'Inactive'}</b></span></div>
            `;
            showNotification(message);
            if (isEnabled) {
                processQuiz();
            } else {
                removeHighlights();
            }
        }

        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            autoCompleteEnabled = !autoCompleteEnabled;
            GM_setValue('autoCompleteEnabled', autoCompleteEnabled);
            const message = `
                <div style="font-size: 15px; font-weight: 400;">Auto-Complete <b>${autoCompleteEnabled ? 'Enabled' : 'Disabled'}</b></div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">Mode: <span style="color: ${autoCompleteEnabled ? '#4ade80' : '#f87171'}"><b>${autoCompleteEnabled ? 'Full Auto' : 'Highlight Only'}</b></span></div>
            `;
            showNotification(message);
        }

        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            lastQuestionText = '';
            isProcessing = false;
            removeHighlights();
            const message = `
                <div style="font-size: 15px; font-weight: 400;">Reprocessing Question</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">Analyzing with Gemini...</div>
            `;
            showNotification(message, 1500);
            processQuiz();
        }
    });

})();

// https://github.com/paysonism/Apex-Learning-UserScript