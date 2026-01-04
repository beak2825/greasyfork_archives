// ==UserScript==
// @name         Seneca Destroyer Lite
// @namespace    http://tampermonkey.net/
// @version      11.4
// @description  Simplified Version
// @author       Octavkian
// @match        https://app.senecalearning.com/classroom/course/*/section/*/session*
// @match        https://app.senecalearning.com/dashboard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=senecalearning.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      text.pollinations.ai
// @connect      api.ocr.space
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557682/Seneca%20Destroyer%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/557682/Seneca%20Destroyer%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 Seneca Destroyer Lite v11.3 initializing...');

    // Configuration
    const CONFIG = {
        speed: GM_getValue('speed', 'normal'),
        showLogs: GM_getValue('show_logs', true),
        ocrFallback: GM_getValue('ocr_fallback', true),
        autoRetry: GM_getValue('auto_retry', true),
        ocrApiKey: 'K87899142988957'
    };

    const SPEEDS = {
        slow: { read: 2000, type: 100, click: 1500, wait: 2000, submit: 3000, afterSubmit: 5000 },
        normal: { read: 1000, type: 50, click: 800, wait: 1500, submit: 2000, afterSubmit: 3500 },
        fast: { read: 500, type: 20, click: 400, wait: 800, submit: 1000, afterSubmit: 2000 }
    };

    // ===== ENHANCED BLACKLIST FOR NAVIGATION BUTTONS =====
    const NAVIGATION_BLACKLIST = [
        'submit', 'check', 'check answer', 'check answers', 'done',
        'next', 'continue', 'proceed', 'skip', 'back', 'previous', 'return',
        'go back', 'go forward',
        'reveal answer', 'show answer', 'hint', 'menu', 'close', 'cancel',
        'ok', 'got it', 'start', 'begin', 'home', 'dashboard', 'profile',
        'settings', 'help', 'logout', 'sign out',
        'overview', 'explain for 1', 'explain for 2', 'explain for 3',
        'explain for 4', 'explain for 5', 'summary', 'review',
        'learn', 'practice', 'test', 'exam', 'quiz',
        'ask amelia', 'ask amelia...', 'amelia', 'ask ai', 'ai tutor',
        'get help', 'need help', 'help me', 'explain this', 'show me',
        'choose an answer', 'select an answer', 'pick an answer',
        'select option', 'choose option', 'click here', 'tap here',
        'select', 'choose', 'loading', 'please wait', 'fetching',
        '...', '—', 'n/a', 'none', 'undefined', 'null',
        'section', 'module', 'chapter', 'unit', 'lesson', 'topic',
        'part 1', 'part 2', 'part 3', 'part 4', 'part 5',
        'progress', 'score', 'points', 'xp', 'streak',
        'save', 'exit', 'finish', 'complete', 'end',
        'assignments', '1assignments', '2assignments', '3assignments',
        '4assignments', '5assignments', '6assignments', '7assignments',
        '8assignments', '9assignments', '0assignments',
        'todo', 'to do', 'to-do', 'completed', 'overdue',
        'courses', 'class', 'classes', 'classroom',
        'due', 'due date', 'assigned'
    ];

    const NAVIGATION_PATTERNS = [
        /^explain\s+for\s+\d+$/i,
        /^part\s+\d+$/i,
        /^section\s+\d+$/i,
        /^module\s+\d+$/i,
        /^chapter\s+\d+$/i,
        /^lesson\s+\d+$/i,
        /^\d+\s*\/\s*\d+$/,
        /^step\s+\d+$/i,
        /^\d+\s*%$/,
        /^view\s+/i,
        /^go\s+to\s+/i,
        /^\d+\s*assignments?$/i,
        /^assignments?\s*\d+$/i,
        /^\d+\s*courses?$/i,
        /^\d+\s*classes?$/i,
        /^ask\s+amelia/i,
        /^amelia/i,
        /^ask\s+\w+\.\.\.$/i,
        /^get\s+help/i,
        /^need\s+help/i,
    ];

    let isRunning = false;
    let currentQuestionType = null;
    let logs = [];
    let previousQuestionHash = null;

    // Statistics
    let stats = {
        totalQuestions: GM_getValue('stats_total', 0),
        successCount: GM_getValue('stats_success', 0),
        errorCount: GM_getValue('stats_errors', 0),
        ocrUsed: GM_getValue('stats_ocr', 0),
        sessionStart: Date.now()
    };

    // ===== DASHBOARD DETECTION =====
    function isOnDashboard() {
        const url = window.location.href.toLowerCase();
        const dashboardUrls = [
            'dashboard/assignments',
            'dashboard/todo',
            'dashboard/courses',
            'dashboard/class',
            '/dashboard'
        ];

        for (const dashUrl of dashboardUrls) {
            if (url.includes(dashUrl)) {
                return true;
            }
        }
        return false;
    }

    function checkAndStopIfOnDashboard() {
        if (isOnDashboard()) {
            addLog('🏠 Dashboard detected - stopping solver!', 'warning');
            if (isRunning) {
                stopAutoSolving();
            }
            updateStatus('📋 On dashboard - solver paused', 'info');
            return true;
        }
        return false;
    }

    // ===== UTILITY FUNCTIONS =====
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function calculateSimilarity(str1, str2) {
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        const s1 = normalize(str1);
        const s2 = normalize(str2);

        if (s1 === s2) return 1.0;
        if (s1.includes(s2) || s2.includes(s1)) return 0.9;

        const words1 = s1.split(/\s+/).filter(w => w.length > 2);
        const words2 = s2.split(/\s+/).filter(w => w.length > 2);
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length / Math.max(words1.length, words2.length, 1);
    }

    function createQuestionHash(questionData) {
        const questionText = questionData.question.toLowerCase().replace(/\s+/g, '').substring(0, 100);
        const optionsText = questionData.options.map(o => o.text.toLowerCase().replace(/\s+/g, '').substring(0, 20)).join('|');
        return `${questionText}_${optionsText}_${questionData.options.length}`;
    }

    // ===== ENHANCED NAVIGATION BUTTON CHECK =====
    function isNavigationButton(text) {
        const textLower = text.toLowerCase().trim();

        if (NAVIGATION_BLACKLIST.includes(textLower)) {
            return true;
        }

        for (const blacklisted of NAVIGATION_BLACKLIST) {
            if (textLower === blacklisted || textLower.startsWith(blacklisted + ' ')) {
                return true;
            }
        }

        for (const pattern of NAVIGATION_PATTERNS) {
            if (pattern.test(textLower)) {
                return true;
            }
        }

        if (textLower.length < 3) return true;
        if (/^\d+$/.test(textLower)) return true;

        if (textLower.includes('→') || textLower.includes('←') ||
            textLower.includes('▶') || textLower.includes('◀')) {
            return true;
        }

        return false;
    }

    // Logging
    function addLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        logs.push({ time: timestamp, message, type });
        console.log(`[Seneca ${type.toUpperCase()}]`, message);
        if (logs.length > 100) logs.shift();
        updateLogsDisplay();
    }

    function updateLogsDisplay() {
        const logsContainer = document.getElementById('logs-container');
        if (!logsContainer || !CONFIG.showLogs) return;

        const colors = {
            info: '#4CAF50',
            error: '#f44336',
            warning: '#FF9800',
            success: '#8BC34A',
            ai: '#9C27B0',
            ocr: '#00BCD4'
        };

        const logsHtml = logs.slice(-15).reverse().map(log =>
            `<div style="color: ${colors[log.type] || '#fff'}; font-size: 11px; margin: 2px 0; padding: 2px 5px; border-left: 3px solid ${colors[log.type]}; background: rgba(0,0,0,0.2);">[${log.time}] ${log.message}</div>`
        ).join('');

        logsContainer.innerHTML = logsHtml || '<div style="font-size: 11px; opacity: 0.7;">No logs yet...</div>';
    }

    function updateStats() {
        GM_setValue('stats_total', stats.totalQuestions);
        GM_setValue('stats_success', stats.successCount);
        GM_setValue('stats_errors', stats.errorCount);
        GM_setValue('stats_ocr', stats.ocrUsed);

        const statsContainer = document.getElementById('stats-display');
        if (statsContainer) {
            const successRate = stats.totalQuestions > 0 ? ((stats.successCount / stats.totalQuestions) * 100).toFixed(1) : 0;
            const sessionTime = Math.floor((Date.now() - stats.sessionStart) / 1000 / 60);

            statsContainer.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; font-size: 11px;">
                    <div style="background: rgba(76,175,80,0.3); padding: 6px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 18px; font-weight: bold;">${stats.totalQuestions}</div>
                        <div style="opacity: 0.8; font-size: 10px;">Questions</div>
                    </div>
                    <div style="background: rgba(33,150,243,0.3); padding: 6px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 18px; font-weight: bold;">${successRate}%</div>
                        <div style="opacity: 0.8; font-size: 10px;">Success</div>
                    </div>
                    <div style="background: rgba(156,39,176,0.3); padding: 6px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 18px; font-weight: bold;">${stats.successCount}</div>
                        <div style="opacity: 0.8; font-size: 10px;">Solved</div>
                    </div>
                    <div style="background: rgba(103,58,183,0.3); padding: 6px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 18px; font-weight: bold;">${sessionTime}m</div>
                        <div style="opacity: 0.8; font-size: 10px;">Session</div>
                    </div>
                </div>
            `;
        }
    }

    function updateStatus(message, type = 'info') {
        const colors = {
            error: 'rgba(255,0,0,0.3)',
            success: 'rgba(0,255,0,0.3)',
            info: 'rgba(255,255,255,0.2)',
            warning: 'rgba(255,152,0,0.3)'
        };
        const statusContainer = document.getElementById('status-container');
        if (statusContainer) {
            statusContainer.innerHTML = `
                <div class="status-box" style="background: ${colors[type]};">${message}</div>
            `;
        }
    }

    function updateProgress(percent) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = percent + '%';
        }
    }

    // ===== OCR FUNCTIONS =====

    async function captureScreenshot() {
        addLog('📸 Capturing screenshot...', 'ocr');
        try {
            const mainContent = document.querySelector('main') || document.body;

            const panel = document.getElementById('seneca-auto-panel');
            if (panel) panel.style.display = 'none';

            const canvas = await html2canvas(mainContent, {
                scale: 0.8,
                logging: false,
                useCORS: false,
                allowTaint: true,
                foreignObjectRendering: false,
                imageTimeout: 0,
                removeContainer: true
            });

            if (panel) panel.style.display = 'block';

            try {
                const dataUrl = canvas.toDataURL('image/png', 0.7);
                addLog('✅ Screenshot captured', 'success');
                return dataUrl;
            } catch (e) {
                addLog('⚠️ Canvas export failed, using text extraction', 'warning');
                return null;
            }
        } catch (error) {
            addLog(`❌ Screenshot failed: ${error.message}`, 'error');
            return null;
        }
    }

    async function performOCR(imageDataUrl) {
        if (!imageDataUrl) {
            throw new Error('No image data provided');
        }

        addLog('🔍 Running OCR...', 'ocr');

        return new Promise((resolve, reject) => {
            const base64Data = imageDataUrl.split(',')[1];

            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://api.ocr.space/parse/image`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `apikey=${CONFIG.ocrApiKey}&base64Image=data:image/png;base64,${encodeURIComponent(base64Data)}&language=eng&isOverlayRequired=false&OCREngine=2`,
                timeout: 30000,
                onload: (response) => {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.ParsedResults && result.ParsedResults[0]) {
                            const text = result.ParsedResults[0].ParsedText;
                            addLog(`✅ OCR extracted ${text.length} characters`, 'ocr');
                            stats.ocrUsed++;
                            updateStats();
                            resolve(text);
                        } else {
                            reject(new Error('No OCR results'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: () => reject(new Error('OCR request failed')),
                ontimeout: () => reject(new Error('OCR timeout'))
            });
        });
    }

    async function extractQuestionWithOCR() {
        addLog('📸 Using OCR fallback...', 'ocr');

        try {
            const screenshot = await captureScreenshot();

            if (!screenshot) {
                addLog('⚠️ Screenshot failed, using text extraction fallback', 'warning');
                return extractQuestionFromVisibleText();
            }

            const ocrText = await performOCR(screenshot);

            const lines = ocrText.split('\n').filter(line => line.trim().length > 5);

            let question = '';
            let options = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (isNavigationButton(line)) continue;

                if (!question && (line.includes('?') || line.length > 30)) {
                    question = line;
                    continue;
                }

                if (question && /^[A-F][\)\.:]?\s*/i.test(line)) {
                    const optionText = line.replace(/^[A-F][\)\.:]?\s*/i, '').trim();
                    if (optionText.length > 3 && !isNavigationButton(optionText)) {
                        options.push(optionText);
                    }
                }
            }

            addLog(`📝 OCR found: "${question.substring(0, 50)}..." with ${options.length} options`, 'ocr');

            return {
                question: question,
                options: options,
                source: 'ocr'
            };

        } catch (error) {
            addLog(`❌ OCR failed: ${error.message}`, 'error');
            return extractQuestionFromVisibleText();
        }
    }

    function extractQuestionFromVisibleText() {
        addLog('📝 Using visible text extraction', 'info');

        const mainContent = document.querySelector('main') || document.body;
        const allText = mainContent.textContent;

        const lines = allText.split('\n').map(l => l.trim()).filter(l => l.length > 10 && !isNavigationButton(l));

        let question = '';
        let options = [];

        for (const line of lines) {
            if (!question && line.includes('?')) {
                question = line;
            } else if (question && line.length > 5 && line.length < 200 && !isNavigationButton(line)) {
                options.push(line);
            }

            if (options.length >= 6) break;
        }

        return {
            question: question || lines[0] || '',
            options: options,
            source: 'text'
        };
    }

    // ===== QUESTION DETECTION =====

    function isElementVisible(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);

        return (
            rect.width > 0 &&
            rect.height > 0 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
    }

    async function waitForPageChange(prevHash, maxWait = 8000) {
        addLog('⏳ Waiting for page change...', 'info');
        const startTime = Date.now();

        while (Date.now() - startTime < maxWait) {
            if (checkAndStopIfOnDashboard()) {
                return false;
            }

            await wait(500);

            const feedback = document.querySelector('[class*="correct"], [class*="incorrect"], [class*="feedback"], [class*="result"]');
            if (feedback && isElementVisible(feedback)) {
                addLog('✅ Feedback detected', 'success');
                await wait(2000);
            }

            const currentData = extractQuestionFromDOM();
            const currentHash = createQuestionHash(currentData);

            if (currentHash !== prevHash && currentData.question.length > 20) {
                addLog('✅ New question detected!', 'success');
                return true;
            }

            const loading = document.querySelector('[class*="loading"], [class*="spinner"], [class*="loader"]');
            if (loading && isElementVisible(loading)) {
                addLog('⏳ Loading...', 'info');
                await wait(1000);
                continue;
            }
        }

        addLog('⚠️ No page change detected', 'warning');
        return false;
    }

    function detectQuestionType() {
        const pageText = document.body.textContent.toLowerCase();

        if (pageText.includes('find the mistake') || pageText.includes('spot the error')) {
            return 'find-mistakes';
        }

        const slider = document.querySelector('input[type="range"]:not(#seneca-auto-panel *)');
        if (slider && isElementVisible(slider)) {
            return 'slider';
        }

        const textInputs = Array.from(document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]'))
            .filter(el => {
                if (el.closest('#seneca-auto-panel')) return false;
                return isElementVisible(el);
            });

        if (textInputs.length > 1) return 'fill-gaps';
        if (textInputs.length === 1) return 'text-input';

        const mainContent = document.querySelector('main') || document.body;
        const clickableOptions = mainContent.querySelectorAll('button, div[role="button"], [role="radio"], li:not(nav li), input[type="checkbox"], label');
        const validOptions = Array.from(clickableOptions).filter(el => {
            if (el.closest('#seneca-auto-panel')) return false;
            if (!isElementVisible(el)) return false;
            const text = el.textContent.trim();

            if (isNavigationButton(text)) return false;

            return text.length >= 5 && text.length < 500;
        });

        if (validOptions.length >= 2) return 'multiple-choice';

        return 'text-input';
    }

    function detectMultiAnswerCount(questionText) {
        const textLower = questionText.toLowerCase();

        const twoPatterns = [
            /which\s+two/i, /select\s+two/i, /choose\s+two/i, /pick\s+two/i,
            /tick\s+two/i, /mark\s+two/i, /identify\s+two/i, /name\s+two/i, /give\s+two/i,
            /two\s+(things|items|options|choices|answers|of\s+the\s+following|properties|reasons|examples|ways|factors|features|characteristics)/i
        ];

        for (const pattern of twoPatterns) {
            if (pattern.test(textLower)) {
                addLog(`🔍 Detected "TWO answers" from question text`, 'info');
                return 2;
            }
        }

        const threePatterns = [
            /which\s+three/i, /select\s+three/i, /choose\s+three/i, /pick\s+three/i,
            /tick\s+three/i, /mark\s+three/i, /identify\s+three/i, /name\s+three/i, /give\s+three/i,
            /three\s+(things|items|options|choices|answers|of\s+the\s+following|properties|reasons|examples|ways|factors|features|characteristics)/i
        ];

        for (const pattern of threePatterns) {
            if (pattern.test(textLower)) {
                addLog(`🔍 Detected "THREE answers" from question text`, 'info');
                return 3;
            }
        }

        const fourPatterns = [
            /which\s+four/i, /select\s+four/i, /choose\s+four/i,
            /four\s+(things|items|options|choices|answers|properties)/i
        ];

        for (const pattern of fourPatterns) {
            if (pattern.test(textLower)) {
                addLog(`🔍 Detected "FOUR answers" from question text`, 'info');
                return 4;
            }
        }

        const numberMatch = questionText.match(/select\s+(\d+)|choose\s+(\d+)|tick\s+(\d+)|mark\s+(\d+)|pick\s+(\d+)/i);
        if (numberMatch) {
            const num = parseInt(numberMatch[1] || numberMatch[2] || numberMatch[3] || numberMatch[4] || numberMatch[5]);
            if (num >= 2 && num <= 6) {
                addLog(`🔍 Detected ${num} answers from number pattern`, 'info');
                return num;
            }
        }

        return 1;
    }

    function detectAnswerCountFromVisualIndicators() {
        const pageText = document.body.textContent.toLowerCase();

        const selectPatterns = [
            /select\s+(\d+)\s*(answers?|options?|items?|choices?)?/i,
            /choose\s+(\d+)\s*(answers?|options?|items?|choices?)?/i,
            /pick\s+(\d+)\s*(answers?|options?|items?|choices?)?/i,
            /tick\s+(\d+)\s*(answers?|options?|items?|choices?)?/i,
            /(\d+)\s+answers?\s+(required|needed)/i
        ];

        for (const pattern of selectPatterns) {
            const match = pageText.match(pattern);
            if (match && match[1]) {
                const num = parseInt(match[1]);
                if (num >= 2 && num <= 6) {
                    addLog(`🔍 Found "${num} answers" instruction on page`, 'info');
                    return num;
                }
            }
        }

        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:not(#seneca-auto-panel *)'))
            .filter(cb => isElementVisible(cb));

        if (checkboxes.length >= 2) {
            const checkboxContainer = checkboxes[0]?.closest('[class*="options"], [class*="answers"], [class*="choices"], div, section');
            if (checkboxContainer) {
                const containerText = checkboxContainer.textContent.toLowerCase();
                const nearbyMatch = containerText.match(/select\s+(\d+)|choose\s+(\d+)|(\d+)\s+answers/i);
                if (nearbyMatch) {
                    const num = parseInt(nearbyMatch[1] || nearbyMatch[2] || nearbyMatch[3]);
                    if (num >= 2 && num <= 6) {
                        addLog(`🔍 Found ${num} answers needed from checkbox context`, 'info');
                        return num;
                    }
                }
            }
        }

        return 0;
    }

    function extractQuestionFromDOM() {
        const mainContent = document.querySelector('main, [role="main"], .question-container, .content') || document.body;

        const allTextElements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, p, div[class*="question"], span[class*="question"]');
        const candidates = [];

        Array.from(allTextElements).forEach(elem => {
            if (elem.closest('#seneca-auto-panel')) return;
            if (!isElementVisible(elem)) return;

            let text = elem.textContent.trim();

            if (text.includes('function(') || text.includes('const ') || text.includes('var ') ||
                text.includes('profitwell') || text.includes('javascript') ||
                text.length < 15 || text.length > 2000) {
                return;
            }

            if (isNavigationButton(text)) return;

            let score = 0;
            if (text.includes('?')) score += 15;
            if (/^(what|how|why|when|where|which|who|describe|explain|name|identify|calculate)/i.test(text)) score += 10;
            if (text.length > 40 && text.length < 500) score += 5;
            if (elem.tagName.match(/H[1-4]/)) score += 8;
            if (elem.className.includes('question')) score += 10;

            if (score > 0) {
                candidates.push({ text, score, element: elem });
            }
        });

        candidates.sort((a, b) => b.score - a.score);
        const questionText = candidates[0]?.text || '';

        let multiAnswerCount = detectMultiAnswerCount(questionText);

        if (multiAnswerCount === 1) {
            const visualCount = detectAnswerCountFromVisualIndicators();
            if (visualCount >= 2) {
                multiAnswerCount = visualCount;
                addLog(`📊 Visual indicators suggest ${multiAnswerCount} answers needed`, 'info');
            }
        }

        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:not(#seneca-auto-panel *)'))
            .filter(cb => isElementVisible(cb));

        if (checkboxes.length >= 2 && multiAnswerCount === 1) {
            multiAnswerCount = 2;
            addLog(`📋 Found ${checkboxes.length} checkboxes, assuming at least ${multiAnswerCount} answers`, 'info');
        }

        if (multiAnswerCount === 1) {
            const fullPageText = document.body.textContent.toLowerCase();

            const multiPatterns = [
                { pattern: /select\s+three|choose\s+three|pick\s+three|three\s+correct/i, count: 3 },
                { pattern: /select\s+two|choose\s+two|pick\s+two|two\s+correct/i, count: 2 },
                { pattern: /select\s+four|choose\s+four|pick\s+four|four\s+correct/i, count: 4 },
                { pattern: /select\s+all\s+that\s+apply/i, count: 2 },
                { pattern: /multiple\s+answers|more\s+than\s+one/i, count: 2 },
            ];

            for (const { pattern, count } of multiPatterns) {
                if (pattern.test(fullPageText)) {
                    multiAnswerCount = count;
                    addLog(`🔍 Found multi-answer instruction on page: ${count} answers`, 'info');
                    break;
                }
            }
        }

        const inputs = Array.from(document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]'))
            .filter(el => {
                if (el.closest('#seneca-auto-panel')) return false;
                return isElementVisible(el);
            });

        let options = [];
        const selectors = [
            'button:not([type="submit"])',
            'div[role="button"]',
            '[role="radio"]',
            'li:not(nav li):not(ul[class*="menu"] li)',
            'label[class*="option"]',
            'input[type="checkbox"] + label',
            'div[class*="choice"]',
            'div[class*="option"]'
        ];

        for (const selector of selectors) {
            Array.from(mainContent.querySelectorAll(selector)).forEach(elem => {
                if (elem.closest('#seneca-auto-panel')) return;
                if (!isElementVisible(elem)) return;

                const text = elem.textContent.trim();

                if (isNavigationButton(text)) {
                    return;
                }

                if (text.length < 5 || text.length > 500) return;
                if (options.some(opt => opt.text === text)) return;
                if (text.includes('()') || text.includes('function') || text.includes('const ')) return;

                options.push({ element: elem, text: text });
            });

            if (options.length >= 2) break;
        }

        addLog(`✅ Extracted: "${questionText.substring(0, 60)}..."`, 'success');
        addLog(`📋 Found: ${options.length} options, ${inputs.length} inputs, ${multiAnswerCount} answers needed`, 'info');

        return {
            question: questionText,
            options: options,
            inputs: inputs,
            multiAnswerCount: multiAnswerCount
        };
    }

    function formatQuestionForAI(questionData, questionType) {
        let formatted = questionData.question;

        if (questionType === 'multiple-choice' && questionData.options?.length > 0) {
            formatted += '\n\n📋 CHOOSE FROM THESE OPTIONS ONLY:\n';
            questionData.options.forEach((opt, i) => {
                formatted += `${String.fromCharCode(65 + i)}) ${opt.text}\n`;
            });

            if (questionData.multiAnswerCount > 1) {
                formatted += `\n\n🚨 CRITICAL - MULTIPLE ANSWERS REQUIRED! 🚨`;
                formatted += `\n⚠️ You MUST select EXACTLY ${questionData.multiAnswerCount} correct answers.`;
                formatted += `\n⚠️ Respond with ${questionData.multiAnswerCount} letters separated by commas.`;
                formatted += `\n⚠️ Example format: "A, C, E" or "B, D, F"`;
                formatted += `\n⚠️ Do NOT select more or fewer than ${questionData.multiAnswerCount} answers!`;
            } else {
                formatted += `\n\n⚠️ IMPORTANT: Check if the question asks for multiple answers.`;
                formatted += `\nIf it says "select two", "choose three", etc., respond with multiple letters.`;
                formatted += `\nOtherwise, select ONLY ONE answer and respond with just one letter: A, B, C, D, E, or F`;
            }

            formatted += `\n\n💡 TIP: Read the question VERY carefully. Look for words like "which TWO", "select THREE", etc.`;
        }

        return formatted;
    }

    // ===== AI FUNCTIONS =====

    function findBestMatch(aiAnswer, options) {
        if (!options || options.length === 0) {
            addLog('❌ No options provided to match', 'error');
            return null;
        }

        const letterMatch = aiAnswer.match(/\b([A-F])\b/i);
        if (letterMatch) {
            const letter = letterMatch[1].toUpperCase();
            const letterIndex = letter.charCodeAt(0) - 65;

            if (options[letterIndex]) {
                addLog(`✅ Matched letter ${letter}: "${options[letterIndex].text.substring(0, 40)}..."`, 'success');
                return {
                    ...options[letterIndex],
                    index: letterIndex,
                    letter: letter
                };
            }
        }

        addLog('🔍 Using similarity matching', 'info');
        const scores = options.map((option, index) => ({
            ...option,
            index: index,
            letter: String.fromCharCode(65 + index),
            score: calculateSimilarity(aiAnswer, option.text)
        }));

        scores.sort((a, b) => b.score - a.score);

        if (scores[0]) {
            addLog(`Best match: ${scores[0].letter} "${scores[0].text.substring(0, 40)}..." (${(scores[0].score * 100).toFixed(1)}%)`, 'ai');
            return scores[0];
        }

        return null;
    }

    function findMultipleMatches(aiAnswer, options, requiredCount) {
        if (!options || options.length === 0) {
            addLog('❌ No options provided', 'error');
            return [];
        }

        addLog(`🔍 Finding ${requiredCount} matches in "${aiAnswer}"`, 'ai');

        const letterMatches = aiAnswer.match(/\b([A-F])\b/gi);

        if (letterMatches && letterMatches.length >= requiredCount) {
            const matches = [];
            const uniqueLetters = [...new Set(letterMatches.map(l => l.toUpperCase()))];

            uniqueLetters.forEach(letter => {
                const letterIndex = letter.charCodeAt(0) - 65;
                if (options[letterIndex]) {
                    matches.push({
                        ...options[letterIndex],
                        index: letterIndex,
                        letter: letter
                    });
                }
            });

            if (matches.length >= requiredCount) {
                addLog(`✅ Found ${matches.length} letter matches: ${matches.map(m => m.letter).join(', ')}`, 'success');
                return matches.slice(0, requiredCount);
            }
        }

        addLog('⚠️ Using similarity for multiple', 'warning');
        const scores = options.map((option, index) => ({
            ...option,
            index: index,
            letter: String.fromCharCode(65 + index),
            score: calculateSimilarity(aiAnswer, option.text)
        }));

        scores.sort((a, b) => b.score - a.score);
        return scores.slice(0, requiredCount);
    }

    async function getAIAnswer(question, questionType, scrapedOptions = []) {
        const instructions = {
            'multiple-choice': `You are an expert exam assistant. Your ONLY job is to select the correct answer(s) from the provided options.

CRITICAL RULES - FOLLOW EXACTLY:
1. Read the question AND all options carefully
2. ONLY respond with letter(s): A, B, C, D, E, or F
3. If the question says "select 2 answers" → respond with TWO letters: "A, C"
4. If the question says "select 3 answers" → respond with THREE letters: "A, B, E"
5. If single answer → respond with ONE letter: "B"
6. NEVER make up answers - ONLY choose from the given options
7. NO explanations, NO extra words, ONLY the letter(s)

Think step by step:
- Read the question
- Look at each option
- Identify the correct one(s)
- Respond ONLY with the letter(s)`,

            'text-input': `Provide a SHORT, ACCURATE answer.

RULES:
1. Answer in 1-10 words maximum
2. Be precise and factually correct
3. NO full sentences unless specifically asked
4. Use context if provided, but keep answer brief

Think carefully about what the question is asking.`,

            'fill-gaps': `Fill in the missing words. Format: word1; word2; word3`,
            'slider': `Respond with ONLY the number, nothing else.`
        };

        let enhancedPrompt = instructions[questionType] || instructions['text-input'];

        if (questionType === 'text-input' && scrapedOptions.length > 0) {
            enhancedPrompt += `\n\n💡 CONTEXT (for reference, not necessarily the answer):\n`;
            scrapedOptions.slice(0, 3).forEach(opt => {
                enhancedPrompt += `- ${opt.text.substring(0, 50)}\n`;
            });
        }

        enhancedPrompt += `\n\n${question}\n\n✍️ YOUR ANSWER:`;

        return await getPollinationsAnswer(enhancedPrompt, questionType);
    }

    function cleanAIResponse(answer, questionType) {
        if (!answer) return '';

        answer = answer.replace(/^(Answer:|Response:|Solution:|The answer is:?|I think:?|Based on:?|Here's|Let me)/i, '').trim();

        if (questionType === 'text-input') {
            answer = answer.split(/[.!?\n]/)[0].trim();
            answer = answer.replace(/^[A-F]\)\s*/i, '').trim();
            const words = answer.split(' ');
            if (words.length > 15) {
                answer = words.slice(0, 15).join(' ');
            }
        } else if (questionType === 'multiple-choice') {
            const letters = answer.match(/[A-F]/gi);
            if (letters && letters.length > 0) {
                const unique = [...new Set(letters.map(l => l.toUpperCase()))];
                answer = unique.join(', ');
            }
        } else if (questionType === 'fill-gaps') {
            if (!answer.includes(';') && answer.includes(',')) {
                answer = answer.replace(/,/g, ';');
            }
        }

        return answer;
    }

    function getPollinationsAnswer(prompt, questionType) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://text.pollinations.ai/',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    messages: [
                        { role: "system", content: "Be precise. Think step-by-step. Follow format rules exactly." },
                        { role: "user", content: prompt }
                    ],
                    model: "openai"
                }),
                timeout: 15000,
                onload: (res) => {
                    let answer = res.responseText?.trim() || '';
                    answer = cleanAIResponse(answer, questionType);
                    addLog(`🤖 Pollinations response: "${answer}"`, 'ai');
                    resolve(answer);
                },
                onerror: () => reject(new Error('Pollinations request failed')),
                ontimeout: () => reject(new Error('Pollinations timeout'))
            });
        });
    }

    async function getAIAnswerWithRetry(question, questionType, scrapedOptions) {
        const maxRetries = CONFIG.autoRetry ? 3 : 1;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                addLog(`🔄 AI Attempt ${attempt}/${maxRetries}`, 'ai');
                const answer = await getAIAnswer(question, questionType, scrapedOptions);

                if (!answer || answer.trim().length === 0) {
                    throw new Error('Empty answer received');
                }

                return answer;
            } catch (error) {
                addLog(`Attempt ${attempt} failed: ${error.message}`, 'error');

                if (attempt < maxRetries) {
                    await wait(1500);
                }

                if (attempt === maxRetries) {
                    throw error;
                }
            }
        }
    }

    // ===== ANSWER APPLICATION FUNCTIONS =====

    async function applyAnswer(answer, questionType, questionData, multiAnswer, matchedOptions) {
        try {
            if (questionType === 'multiple-choice') {
                await answerMultipleChoice(answer, questionData, multiAnswer, matchedOptions);
            } else if (questionType === 'fill-gaps') {
                await answerFillGaps(answer, questionData);
            } else if (questionType === 'text-input') {
                await answerTextInput(answer, questionData);
            } else if (questionType === 'slider') {
                await answerSlider(answer);
            }
        } catch (error) {
            addLog(`Apply answer error: ${error.message}`, 'error');
            throw error;
        }
    }

    async function answerMultipleChoice(answer, questionData, multiAnswer, matchedOptions) {
        let matchesToClick = [];

        if (Array.isArray(matchedOptions)) {
            matchesToClick = matchedOptions;
        } else if (matchedOptions) {
            matchesToClick = [matchedOptions];
        }

        if (matchesToClick.length === 0) {
            addLog('❌ No valid matches found!', 'error');
            throw new Error('No matches to click');
        }

        addLog(`>>> Clicking ${matchesToClick.length} option(s): ${matchesToClick.map(m => m.letter).join(', ')}`, 'success');

        for (const match of matchesToClick) {
            const element = match.element;

            if (!isElementVisible(element)) {
                addLog(`⚠️ Element ${match.letter} not visible, skipping`, 'warning');
                continue;
            }

            if (isNavigationButton(match.text)) {
                addLog(`🚫 Skipping navigation element: "${match.text.substring(0, 30)}..."`, 'warning');
                continue;
            }

            addLog(`🖱️ Clicking ${match.letter}: "${match.text.substring(0, 50)}..."`);

            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await wait(SPEEDS[CONFIG.speed].click);

            element.style.border = '4px solid #4CAF50';
            await wait(200);

            try {
                element.click();
                element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
                element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

                if (element.parentElement) {
                    element.parentElement.click();
                }

                const clickableChild = element.querySelector('input, button, span, div');
                if (clickableChild) {
                    clickableChild.click();
                }
            } catch (e) {
                addLog(`Click error: ${e.message}`, 'warning');
            }

            await wait(300);
            element.style.border = '';

            addLog(`✅ CLICKED ${match.letter}!`, 'success');

            if (matchesToClick.length > 1) {
                await wait(600);
            }
        }
    }

    async function answerFillGaps(answer, questionData) {
        let gaps = answer.includes(';') ? answer.split(';').map(a => a.trim()) : [answer];

        for (let i = 0; i < Math.min(gaps.length, questionData.inputs.length); i++) {
            const input = questionData.inputs[i];

            if (!isElementVisible(input)) {
                addLog(`⚠️ Input ${i+1} not visible`, 'warning');
                continue;
            }

            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await wait(300);

            input.focus();
            await wait(100);

            input.value = '';
            input.value = gaps[i];

            if (input.contentEditable === 'true') {
                input.textContent = gaps[i];
            }

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            await wait(200);
            input.blur();

            addLog(`✍️ Filled gap ${i+1}: "${gaps[i]}"`, 'success');
            await wait(400);
        }
    }

    async function answerTextInput(answer, questionData) {
        const input = questionData.inputs?.[0];
        if (!input) {
            throw new Error('No text input found');
        }

        if (!isElementVisible(input)) {
            throw new Error('Input not visible');
        }

        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(500);

        input.focus();
        await wait(200);

        input.value = '';
        await wait(100);
        input.value = answer;

        if (input.contentEditable === 'true') {
            input.textContent = answer;
        }

        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

        await wait(300);
        input.blur();

        addLog(`✅ Typed "${answer}"!`, 'success');
    }

    async function answerSlider(answer) {
        const slider = document.querySelector('input[type="range"]:not(#seneca-auto-panel *)');
        if (!slider || !isElementVisible(slider)) {
            throw new Error('Slider not found');
        }

        const num = parseFloat(answer.match(/\d+\.?\d*/)?.[0] || 0);
        slider.value = num;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));

        addLog(`🎚️ Set slider to ${num}`, 'success');
    }

    // ===== SMART CONTINUE BUTTON FINDER =====
    async function findAndClickContinue() {
        addLog('🔄 Looking for continue/next button...', 'info');

        window.scrollBy({ top: 200, behavior: 'smooth' });
        await wait(500);

        const continueKeywords = [
            'continue', 'next', 'proceed', 'next question',
            'start', 'begin', 'ok', 'got it', "let's go",
            'try again', 'retry', 'skip'
        ];

        const buttons = Array.from(document.querySelectorAll('button, a, [role="button"], div[class*="button"]'))
            .filter(btn => !btn.closest('#seneca-auto-panel'));

        for (const keyword of continueKeywords) {
            for (const btn of buttons) {
                if (!isElementVisible(btn)) continue;

                const text = btn.textContent.toLowerCase().trim();
                if (text === keyword || text.includes(keyword)) {
                    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await wait(400);
                    btn.click();
                    addLog(`✅ Clicked continue: "${text}"`, 'success');
                    await wait(2000);
                    return true;
                }
            }
        }

        addLog('⚠️ No continue button found', 'warning');
        return false;
    }

    async function handlePostAnswer() {
        addLog('🔍 Looking for continue after answer...', 'info');

        await wait(SPEEDS[CONFIG.speed].afterSubmit);

        const found = await findAndClickContinue();

        if (!found) {
            addLog('ℹ️ No continue button - answer may have auto-submitted', 'info');
        }

        return found;
    }

    // ===== MAIN SOLVING LOGIC =====

    async function solveCurrentQuestion(autoContinue) {
        if (checkAndStopIfOnDashboard()) {
            throw new Error('On dashboard page - solver stopped');
        }

        try {
            updateStatus('📝 Analyzing question...', 'info');
            updateProgress(10);

            await wait(SPEEDS[CONFIG.speed].read);

            let questionData = extractQuestionFromDOM();
            currentQuestionType = detectQuestionType();

            if (!questionData?.question || questionData.question.length < 15) {
                addLog('⚠️ No valid question detected, checking for continue button...', 'warning');

                const foundContinue = await findAndClickContinue();

                if (foundContinue) {
                    addLog('✅ Found continue button, advancing...', 'success');
                    await wait(2000);

                    if (checkAndStopIfOnDashboard()) {
                        throw new Error('Navigated to dashboard - solver stopped');
                    }

                    questionData = extractQuestionFromDOM();
                    currentQuestionType = detectQuestionType();
                }

                if (!questionData?.question || questionData.question.length < 15) {
                    addLog('🔴 Still no question - triggering OCR fallback!', 'ocr');

                    if (CONFIG.ocrFallback) {
                        try {
                            const ocrData = await extractQuestionWithOCR();

                            if (ocrData.question && ocrData.question.length > 15) {
                                const domData = extractQuestionFromDOM();

                                questionData = {
                                    question: ocrData.question,
                                    options: ocrData.options.map((text, i) => ({
                                        text: text,
                                        element: domData.options[i]?.element
                                    })).filter(opt => opt.element),
                                    inputs: domData.inputs,
                                    multiAnswerCount: detectMultiAnswerCount(ocrData.question)
                                };

                                addLog('✅ OCR successfully extracted question!', 'ocr');
                            } else {
                                throw new Error('OCR did not find valid question');
                            }
                        } catch (ocrError) {
                            addLog(`❌ OCR fallback failed: ${ocrError.message}`, 'error');
                            throw new Error('No valid question detected (OCR failed)');
                        }
                    } else {
                        throw new Error('No valid question detected');
                    }
                }
            }

            addLog(`📋 Type: ${currentQuestionType}`, 'info');
            addLog(`❓ Q: "${questionData.question.substring(0, 80)}..."`, 'info');

            stats.totalQuestions++;
            updateStats();

            updateProgress(40);

            const fullQuestion = formatQuestionForAI(questionData, currentQuestionType);
            const aiAnswer = await getAIAnswerWithRetry(fullQuestion, currentQuestionType, questionData.options);

            if (!aiAnswer || aiAnswer.length === 0) {
                throw new Error('AI returned empty answer');
            }

            addLog(`🤖 AI: "${aiAnswer}"`, 'ai');

            updateProgress(60);

            let matchedOption = null;
            let multiAnswer = false;

            if (currentQuestionType === 'multiple-choice') {
                if (questionData.options.length === 0) {
                    throw new Error('No options found for multiple choice');
                }

                const letterMatches = aiAnswer.match(/\b([A-F])\b/gi);
                const hasMultipleLetters = letterMatches && letterMatches.length > 1;

                if (hasMultipleLetters || questionData.multiAnswerCount > 1) {
                    multiAnswer = true;
                    const requiredCount = Math.max(
                        hasMultipleLetters ? letterMatches.length : 0,
                        questionData.multiAnswerCount
                    );
                    addLog(`📋 Need ${requiredCount} answers`, 'info');
                    matchedOption = findMultipleMatches(aiAnswer, questionData.options, requiredCount);
                } else {
                    matchedOption = findBestMatch(aiAnswer, questionData.options);
                }

                if (!matchedOption || (Array.isArray(matchedOption) && matchedOption.length === 0)) {
                    throw new Error('Failed to match answer to options');
                }
            }

            updateProgress(75);
            await applyAnswer(aiAnswer, currentQuestionType, questionData, multiAnswer, matchedOption);

            updateProgress(90);

            await handlePostAnswer();

            updateProgress(100);
            stats.successCount++;
            updateStats();
            updateStatus('✅ Solved successfully!', 'success');

        } catch (error) {
            addLog(`❌ ERROR: ${error.message}`, 'error');
            stats.errorCount++;
            updateStats();
            updateStatus(`❌ Error: ${error.message}`, 'error');

            if (error.message.includes('No valid question') && CONFIG.ocrFallback) {
                addLog('🔄 Attempting OCR recovery...', 'ocr');
                try {
                    const ocrData = await extractQuestionWithOCR();
                    if (ocrData.question && ocrData.question.length > 15) {
                        addLog('✅ OCR found question, retrying solve...', 'ocr');
                    }
                } catch (ocrError) {
                    addLog(`OCR recovery failed: ${ocrError.message}`, 'error');
                }
            }

            throw error;
        }
    }

    async function startAutoSolving() {
        if (isRunning) return;

        if (checkAndStopIfOnDashboard()) {
            alert('⚠️ You are on the dashboard page!\n\nPlease navigate to a course/session to use the solver.');
            return;
        }

        isRunning = true;
        document.getElementById('start-auto-btn').style.display = 'none';
        document.getElementById('stop-auto-btn').style.display = 'block';

        addLog('🚀 Auto-solve started!', 'success');

        await findAndClickContinue();
        await wait(2000);

        let questionCount = 0;
        let consecutiveErrors = 0;

        while (isRunning) {
            if (checkAndStopIfOnDashboard()) {
                addLog('🏠 Navigated to dashboard - stopping!', 'warning');
                break;
            }

            try {
                questionCount++;
                addLog(`\n═══ Question #${questionCount} ═══`, 'success');

                const beforeData = extractQuestionFromDOM();
                const beforeHash = createQuestionHash(beforeData);

                await solveCurrentQuestion(true);

                const changed = await waitForPageChange(beforeHash, 8000);

                if (!changed) {
                    addLog('⚠️ No change, clicking continue...', 'warning');
                    await findAndClickContinue();
                    await wait(2000);

                    if (checkAndStopIfOnDashboard()) {
                        break;
                    }

                    const afterChanged = await waitForPageChange(beforeHash, 6000);

                    if (!afterChanged) {
                        addLog('🔴 No change detected - trying OCR...', 'ocr');
                        if (CONFIG.ocrFallback) {
                            try {
                                await extractQuestionWithOCR();
                            } catch (e) {
                                addLog('❌ OCR also failed, stopping', 'error');
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }

                consecutiveErrors = 0;
                await wait(1000);
                updateProgress(0);

            } catch (error) {
                addLog(`❌ Question error: ${error.message}`, 'error');
                consecutiveErrors++;

                if (error.message.includes('dashboard')) {
                    break;
                }

                if (consecutiveErrors >= 3) {
                    addLog('🛑 Too many errors, stopping', 'error');
                    break;
                }

                await wait(2000);
                await findAndClickContinue();
                await wait(2000);
            }
        }

        stopAutoSolving();
    }

    function stopAutoSolving() {
        isRunning = false;
        const startBtn = document.getElementById('start-auto-btn');
        const stopBtn = document.getElementById('stop-auto-btn');
        if (startBtn) startBtn.style.display = 'block';
        if (stopBtn) stopBtn.style.display = 'none';
        updateProgress(0);
        addLog('🛑 Auto-solve stopped', 'warning');
    }

    // ===== PANEL CREATION =====

    function createPanel() {
        const onDashboard = isOnDashboard();

        addLog('Creating panel...');

        const panel = document.createElement('div');
        panel.id = 'seneca-auto-panel';
        panel.style.cssText = `
            position: fixed; top: 10px; right: 10px; width: 420px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px;
            padding: 0; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            font-family: 'Segoe UI', system-ui, sans-serif; color: white;
        `;

        panel.innerHTML = `
            <style>
                #seneca-auto-panel * { box-sizing: border-box; }
                #seneca-auto-panel button {
                    width: 100%; padding: 12px; margin: 8px 0; border: none; border-radius: 6px;
                    cursor: pointer; font-weight: bold; transition: all 0.3s; font-size: 14px;
                }
                #seneca-auto-panel button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
                #seneca-auto-panel button:disabled { opacity: 0.5; cursor: not-allowed; }
                .panel-header {
                    background: rgba(0,0,0,0.2); padding: 15px 20px; border-radius: 12px 12px 0 0;
                    cursor: move; user-select: none; display: flex; justify-content: space-between; align-items: center;
                }
                .panel-body { padding: 20px; max-height: 70vh; overflow-y: auto; }
                .status-box { background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 13px; }
                .toggle-switch { position: relative; display: inline-block; width: 50px; height: 24px; float: right; }
                .toggle-switch input { opacity: 0; width: 0; height: 0; }
                .slider {
                    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #ccc; transition: .4s; border-radius: 24px;
                }
                .slider:before {
                    position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
                    background-color: white; transition: .4s; border-radius: 50%;
                }
                input:checked + .slider { background-color: #4CAF50; }
                input:checked + .slider:before { transform: translateX(26px); }
                .progress-bar { width: 100%; height: 6px; background: rgba(255,255,255,0.3); border-radius: 3px; overflow: hidden; margin: 10px 0; }
                .progress-fill { height: 100%; background: #4CAF50; width: 0%; transition: width 0.3s; }
                .logs-box {
                    background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; max-height: 160px;
                    overflow-y: auto; font-family: 'Consolas', monospace; margin-top: 10px; font-size: 10px;
                }
                .feature-box { background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px; }
                .info-badge {
                    display: inline-block; background: rgba(33,150,243,0.3); padding: 3px 8px;
                    border-radius: 4px; font-size: 10px; margin-left: 5px;
                }
                .dashboard-warning {
                    background: rgba(255,152,0,0.4); padding: 15px; border-radius: 8px;
                    text-align: center; margin-bottom: 15px;
                }
            </style>

            <div class="panel-header" id="panel-header">
                <h3 style="margin: 0; font-size: 16px;">🤖 Seneca Destroyer Lite</h3>
                <button id="minimize-btn" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; margin: 0; width: auto;">−</button>
            </div>

            <div class="panel-body" id="panel-body">
                ${onDashboard ? `
                    <div class="dashboard-warning">
                        <div style="font-size: 24px; margin-bottom: 10px;">🏠</div>
                        <strong>You're on the Dashboard</strong><br>
                        <div style="font-size: 12px; margin-top: 8px; opacity: 0.9;">
                            Navigate to a course/session to use the solver.<br>
                            The solver will auto-pause on dashboard pages.
                        </div>
                    </div>
                ` : ''}

                <div id="stats-display" style="margin-bottom: 15px;"></div>

                <div class="feature-box">
                    <div style="text-align: center; padding: 8px; background: rgba(76,175,80,0.3); border-radius: 6px; margin-bottom: 10px;">
                        <span style="font-size: 16px;">🆓</span> <strong>Pollinations AI</strong>
                        <div style="font-size: 10px; opacity: 0.8; margin-top: 4px;">No API Key Required</div>
                    </div>
                </div>

                <div class="feature-box">
                    <label style="display: block; margin-bottom: 8px; font-size: 12px;"><strong>Features</strong></label>
                    <label style="display: block; margin-bottom: 8px; font-size: 12px;">
                        OCR Fallback <span class="info-badge">Auto on Error</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="ocr-toggle" ${CONFIG.ocrFallback ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </label>
                    <label style="display: block; margin-bottom: 8px; font-size: 12px;">
                        Auto-Retry <span class="info-badge">3x</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="auto-retry-toggle" ${CONFIG.autoRetry ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </label>
                    <label style="display: block; font-size: 12px;">
                        Show Logs
                        <label class="toggle-switch">
                            <input type="checkbox" id="logs-toggle" ${CONFIG.showLogs ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </label>
                </div>

                <div class="feature-box">
                    <label style="font-size: 12px;">⚡ Speed:</label>
                    <select id="speed-select" style="width: 100%; padding: 8px; margin-top: 5px; border-radius: 4px; color: #333; border: none;">
                        <option value="slow" ${CONFIG.speed === 'slow' ? 'selected' : ''}>🐌 Slow</option>
                        <option value="normal" ${CONFIG.speed === 'normal' ? 'selected' : ''}>⚡ Normal</option>
                        <option value="fast" ${CONFIG.speed === 'fast' ? 'selected' : ''}>🚀 Fast</option>
                    </select>
                </div>

                <button id="start-auto-btn" style="background: #4CAF50; color: white; font-size: 15px;" ${onDashboard ? 'disabled' : ''}>
                    ▶️ Start Auto-Solving
                </button>
                <button id="stop-auto-btn" style="background: #f44336; color: white; display: none; font-size: 15px;">
                    ⏹️ Stop
                </button>
                <button id="solve-current-btn" style="background: #2196F3; color: white;" ${onDashboard ? 'disabled' : ''}>
                    🎯 Solve Current
                </button>
                <button id="next-btn" style="background: #FF9800; color: white;">
                    ⏭️ Next/Continue/Skip
                </button>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
                    <button id="test-ocr-btn" style="background: #00BCD4; color: white; margin: 0; font-size: 12px;">📸 Test OCR</button>
                    <button id="reset-stats-btn" style="background: #9C27B0; color: white; margin: 0; font-size: 12px;">📊 Reset Stats</button>
                </div>

                <div id="status-container"></div>

                <div class="progress-bar">
                    <div class="progress-fill" id="progress-bar"></div>
                </div>

                <div class="logs-box" id="logs-container" style="${CONFIG.showLogs ? '' : 'display: none;'}">
                    <div style="font-size: 11px; opacity: 0.7;">No logs yet...</div>
                </div>

                <div style="margin-top: 10px; font-size: 9px; opacity: 0.8; background: rgba(255,255,255,0.1); padding: 6px; border-radius: 4px;">
                    <strong>✅ Lite v11.3:</strong> Pollinations AI only • No API keys needed • Simplified UI 🧠
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        setupEventListeners();
        makePanelDraggable();
        updateStats();

        if (onDashboard) {
            updateStatus('🏠 On dashboard - navigate to a course to solve', 'info');
        }
    }

    function setupEventListeners() {
        // Toggle switches
        document.getElementById('ocr-toggle')?.addEventListener('change', (e) => {
            CONFIG.ocrFallback = e.target.checked;
            GM_setValue('ocr_fallback', e.target.checked);
            addLog(`OCR Fallback: ${e.target.checked ? 'ON' : 'OFF'}`, 'info');
        });

        document.getElementById('auto-retry-toggle')?.addEventListener('change', (e) => {
            CONFIG.autoRetry = e.target.checked;
            GM_setValue('auto_retry', e.target.checked);
        });

        document.getElementById('logs-toggle')?.addEventListener('change', (e) => {
            CONFIG.showLogs = e.target.checked;
            GM_setValue('show_logs', e.target.checked);
            const logsContainer = document.getElementById('logs-container');
            if (logsContainer) {
                logsContainer.style.display = e.target.checked ? 'block' : 'none';
            }
        });

        document.getElementById('speed-select')?.addEventListener('change', (e) => {
            CONFIG.speed = e.target.value;
            GM_setValue('speed', e.target.value);
            addLog(`⚡ Speed changed to: ${e.target.value}`, 'info');
        });

        // Test OCR
        document.getElementById('test-ocr-btn')?.addEventListener('click', async () => {
            addLog('🧪 Testing OCR...', 'ocr');
            updateStatus('Testing OCR...', 'info');
            try {
                const result = await extractQuestionWithOCR();
                const msg = `✅ OCR/Text Extraction Works!\n\nQuestion: ${result.question.substring(0, 100)}...\n\nSource: ${result.source}\nOptions: ${result.options.length} found`;
                addLog('✅ OCR test successful!', 'success');
                updateStatus('OCR test passed!', 'success');
                alert(msg);
            } catch (error) {
                addLog(`❌ OCR test failed: ${error.message}`, 'error');
                updateStatus('OCR test failed!', 'error');
                alert(`❌ OCR Failed!\n\n${error.message}`);
            }
        });

        // Reset stats
        document.getElementById('reset-stats-btn')?.addEventListener('click', () => {
            if (confirm('Reset all statistics?')) {
                stats = {
                    totalQuestions: 0,
                    successCount: 0,
                    errorCount: 0,
                    ocrUsed: 0,
                    sessionStart: Date.now()
                };
                GM_setValue('stats_total', 0);
                GM_setValue('stats_success', 0);
                GM_setValue('stats_errors', 0);
                GM_setValue('stats_ocr', 0);
                updateStats();
                addLog('📊 Stats reset!', 'success');
            }
        });

        // Main action buttons
        document.getElementById('start-auto-btn')?.addEventListener('click', startAutoSolving);
        document.getElementById('stop-auto-btn')?.addEventListener('click', stopAutoSolving);

        document.getElementById('solve-current-btn')?.addEventListener('click', async () => {
            if (checkAndStopIfOnDashboard()) {
                alert('⚠️ Cannot solve on dashboard page!\nNavigate to a course/session first.');
                return;
            }
            try {
                await solveCurrentQuestion(false);
            } catch (error) {
                addLog(`Solve failed: ${error.message}`, 'error');
            }
        });

        document.getElementById('next-btn')?.addEventListener('click', async () => {
            addLog('🔄 Manually clicking next/continue/skip...', 'info');
            await findAndClickContinue();
        });

        // Minimize button
        document.getElementById('minimize-btn')?.addEventListener('click', () => {
            const body = document.getElementById('panel-body');
            const btn = document.getElementById('minimize-btn');
            if (body && btn) {
                if (body.style.display === 'none') {
                    body.style.display = 'block';
                    btn.textContent = '−';
                } else {
                    body.style.display = 'none';
                    btn.textContent = '+';
                }
            }
        });
    }

    function makePanelDraggable() {
        const panel = document.getElementById('seneca-auto-panel');
        const header = document.getElementById('panel-header');
        if (!panel || !header) return;

        let isDragging = false;
        let currentX = 0;
        let currentY = 0;
        let initialX = 0;
        let initialY = 0;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // ===== INITIALIZATION =====
    function init() {
        addLog('🚀 Seneca Destroyer Lite v11.3 initializing...', 'success');
        addLog('✅ Using Pollinations AI (Free, No Key)', 'info');
        addLog('✅ OCR fallback enabled', 'info');
        addLog('✅ Dashboard detection active', 'info');

        if (isOnDashboard()) {
            addLog('🏠 On dashboard - solver will not auto-start', 'warning');
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createPanel);
        } else {
            createPanel();
        }

                        // Monitor URL changes for dashboard detection
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                addLog('🔄 URL changed, checking location...', 'info');

                if (checkAndStopIfOnDashboard()) {
                    const panelBody = document.getElementById('panel-body');
                    if (panelBody && !panelBody.querySelector('.dashboard-warning')) {
                        const warning = document.createElement('div');
                        warning.className = 'dashboard-warning';
                        warning.innerHTML = `
                            <div style="font-size: 24px; margin-bottom: 10px;">🏠</div>
                            <strong>You're on the Dashboard</strong><br>
                            <div style="font-size: 12px; margin-top: 8px; opacity: 0.9;">
                                Navigate to a course/session to use the solver.
                            </div>
                        `;
                        panelBody.insertBefore(warning, panelBody.firstChild);
                    }

                    const startBtn = document.getElementById('start-auto-btn');
                    const solveBtn = document.getElementById('solve-current-btn');
                    if (startBtn) startBtn.disabled = true;
                    if (solveBtn) solveBtn.disabled = true;
                } else {
                    const warning = document.querySelector('.dashboard-warning');
                    if (warning) warning.remove();

                    const startBtn = document.getElementById('start-auto-btn');
                    const solveBtn = document.getElementById('solve-current-btn');
                    if (startBtn) startBtn.disabled = false;
                    if (solveBtn) solveBtn.disabled = false;

                    addLog('✅ On course page - solver ready', 'success');
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

    init();
})();