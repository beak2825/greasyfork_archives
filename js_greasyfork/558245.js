// ==UserScript==
// @name         Lexia PowerUp Solver Pro +
// @namespace    http://tampermonkey.net/
// @version      15.6
// @description  Advanced solver for Lexia PowerUp literacy exercises with enhanced learned prompt
// @author       Jwheet
// @match        https://www.lexiapowerup.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      openrouter.ai
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/558245/Lexia%20PowerUp%20Solver%20Pro%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/558245/Lexia%20PowerUp%20Solver%20Pro%20%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        API_KEY: 'PUT-YOUR-API-HERE-AND-ONLY-DELEATE-The-TEXT-TELLING-YOU-THIS!!!!',
        MODEL: 'amazon/nova-2-lite-v1:free',
        MAX_TOKENS: 2000
    };

    let isAnalyzing = false;
    let lastClickedButton = null;
    let wrongAnswers = new Set();
    let isDragging = false;
    let lastPrompt = '';

    function createUI() {
        if (document.getElementById('lexia-solver-ui')) return;

        const styles = `
            #lexia-solver-ui {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 450px;
                background: #1a1a1a;
                color: white;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                z-index: 10000;
                font-family: system-ui, sans-serif;
                border: 2px solid #2a2a2a;
                cursor: move;
                user-select: none;
            }
            #lexia-solver-ui:not(.dragging) {
                transition: transform 0.2s ease;
            }
            #lexia-solver-ui.dragging {
                cursor: grabbing;
                opacity: 0.9;
            }
            .solver-header {
                padding: 15px;
                background: #2a2a2a;
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #444;
                cursor: grab;
            }
            #lexia-solver-ui.dragging .solver-header {
                cursor: grabbing;
            }
            .solver-title {
                font-weight: 600;
                color: #00ff88;
                font-size: 16px;
            }
            .solver-controls {
                display: flex;
                gap: 8px;
            }
            .control-btn {
                background: #444;
                border: none;
                color: white;
                padding: 6px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
            }
            .solver-content {
                padding: 20px;
            }
            .button-group {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            .btn-primary {
                flex: 1;
                padding: 12px;
                background: #00ff88;
                color: black;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
            }
            .btn-secondary {
                flex: 1;
                padding: 12px;
                background: #0088ff;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
            }
            .btn-primary:disabled, .btn-secondary:disabled {
                background: #666;
                cursor: not-allowed;
            }
            #solver-response {
                min-height: 100px;
                padding: 15px;
                background: #2a2a2a;
                border-radius: 6px;
                white-space: pre-wrap;
                line-height: 1.5;
                font-size: 14px;
            }
            .response-correct { color: #00ff88; }
            .response-error { color: #ff4444; }
            .response-info { color: #888; }
            .monitoring-status {
                background: #223;
                padding: 8px;
                border-radius: 4px;
                margin: 10px 0;
                font-size: 12px;
            }
            .status-monitoring { border-left: 3px solid #ffa500; }
            .status-correct { border-left: 3px solid #00ff88; }
            .status-error { border-left: 3px solid #ff4444; }
            .prompt-section {
                background: #225;
                padding: 10px;
                border-radius: 6px;
                margin: 10px 0;
                border-left: 3px solid #0088ff;
            }
            .prompt-header {
                font-size: 11px;
                color: #88ccff;
                margin-bottom: 5px;
                font-weight: 600;
            }
            .prompt-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }
            .prompt-btn {
                flex: 1;
                padding: 6px;
                background: #444;
                border: none;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            }
            .prompt-btn.copy {
                background: #0088ff;
            }
            .prompt-btn.view {
                background: #00aa44;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        const container = document.createElement('div');
        container.id = 'lexia-solver-ui';
        container.innerHTML = `
            <div class="solver-header">
                <div class="solver-title">🧠 Lexia Solver Pro</div>
                <div class="solver-controls">
                    <button class="control-btn" id="solver-clear">Clear</button>
                    <button class="control-btn" id="solver-close">×</button>
                </div>
            </div>
            <div class="solver-content">
                <div class="button-group">
                    <button class="btn-primary" id="solver-analyze">Solve Exercise</button>
                    <button class="btn-secondary" id="solver-copy-prompt">Copy Prompt</button>
                </div>
                <div id="prompt-section" class="prompt-section" style="display: none;">
                    <div class="prompt-header">AI Prompt Generated</div>
                    <div class="prompt-actions">
                        <button class="prompt-btn copy" id="copy-prompt-btn">Copy Prompt</button>
                        <button class="prompt-btn view" id="view-prompt-btn">View Prompt</button>
                    </div>
                </div>
                <div id="solver-response" class="response-info">
                    <div class="monitoring-status">Status: Ready</div>
                    Click to solve the current exercise.
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Add drag functionality
        setupDragFunctionality(container);

        // Add event listeners
        document.getElementById('solver-analyze').addEventListener('click', solveExercise);
        document.getElementById('solver-copy-prompt').addEventListener('click', generateAndCopyPrompt);
        document.getElementById('copy-prompt-btn').addEventListener('click', copyLastPrompt);
        document.getElementById('view-prompt-btn').addEventListener('click', viewLastPrompt);
        document.getElementById('solver-clear').addEventListener('click', () => {
            wrongAnswers.clear();
            updateStatus('History cleared', 'info');
        });
        document.getElementById('solver-close').addEventListener('click', () => {
            container.style.display = 'none';
        });

        // Load saved position
        loadSavedPosition(container);
    }

    function setupDragFunctionality(container) {
        const header = container.querySelector('.solver-header');
        let startX, startY, initialX, initialY;

        header.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            if (e.target.closest('.control-btn')) return;

            isDragging = true;
            container.classList.add('dragging');

            startX = e.clientX;
            startY = e.clientY;

            const rect = container.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);

            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const newX = initialX + dx;
            const newY = initialY + dy;

            const maxX = window.innerWidth - container.offsetWidth;
            const maxY = window.innerHeight - container.offsetHeight;

            container.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            container.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
            container.style.right = 'auto';
        }

        function stopDrag() {
            if (!isDragging) return;

            isDragging = false;
            container.classList.remove('dragging');

            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);

            savePosition(container);
        }
    }

    function savePosition(container) {
        const rect = container.getBoundingClientRect();
        const position = {
            left: rect.left,
            top: rect.top
        };
        try {
            localStorage.setItem('lexia-solver-position', JSON.stringify(position));
        } catch (e) {
            console.log('Could not save position:', e);
        }
    }

    function loadSavedPosition(container) {
        try {
            const saved = localStorage.getItem('lexia-solver-position');
            if (saved) {
                const position = JSON.parse(saved);
                container.style.left = position.left + 'px';
                container.style.top = position.top + 'px';
                container.style.right = 'auto';
            }
        } catch (e) {
            console.log('Could not load saved position:', e);
        }
    }

    function updateStatus(message, type = 'info') {
        const statusElement = document.querySelector('.monitoring-status');
        if (statusElement) {
            statusElement.textContent = `Status: ${message}`;
            statusElement.className = 'monitoring-status';
            if (type === 'monitoring') statusElement.classList.add('status-monitoring');
            else if (type === 'correct') statusElement.classList.add('status-correct');
            else if (type === 'error') statusElement.classList.add('status-error');
        }
    }

    function showPromptSection() {
        const promptSection = document.getElementById('prompt-section');
        if (promptSection) {
            promptSection.style.display = 'block';
        }
    }

    function hidePromptSection() {
        const promptSection = document.getElementById('prompt-section');
        if (promptSection) {
            promptSection.style.display = 'none';
        }
    }

    function generateAndCopyPrompt() {
        if (isAnalyzing) return;

        try {
            const exerciseData = extractExerciseData();
            lastPrompt = createAdvancedPrompt(exerciseData);

            copyToClipboard(lastPrompt).then(() => {
                updateStatus('Prompt copied to clipboard!', 'correct');
                showPromptSection();

                // Show feedback
                showFeedback('📋 Prompt copied to clipboard!');
            }).catch(error => {
                updateStatus('Failed to copy prompt', 'error');
            });

        } catch (error) {
            updateStatus('Error generating prompt: ' + error.message, 'error');
        }
    }

    function copyLastPrompt() {
        if (!lastPrompt) {
            updateStatus('No prompt available to copy', 'error');
            return;
        }

        copyToClipboard(lastPrompt).then(() => {
            updateStatus('Prompt copied to clipboard!', 'correct');
            showFeedback('📋 Prompt copied!');
        }).catch(error => {
            updateStatus('Failed to copy prompt', 'error');
        });
    }

    function viewLastPrompt() {
        if (!lastPrompt) {
            updateStatus('No prompt available to view', 'error');
            return;
        }

        // Create a modal to display the prompt
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 70%;
            background: #1a1a1a;
            border: 2px solid #0088ff;
            border-radius: 10px;
            z-index: 100000;
            padding: 20px;
            color: white;
            font-family: system-ui, sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
        `;

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <div style="font-weight: bold; color: #0088ff; font-size: 16px;">📝 Generated Prompt</div>
                <button id="close-prompt-modal" style="background: #ff4444; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
            <div style="flex: 1; overflow-y: auto; background: #2a2a2a; padding: 15px; border-radius: 6px; font-size: 12px; line-height: 1.4; white-space: pre-wrap; font-family: monospace;">
                ${lastPrompt}
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button id="copy-from-modal" style="flex: 1; background: #0088ff; border: none; color: white; padding: 8px; border-radius: 4px; cursor: pointer;">Copy Prompt</button>
                <button id="close-modal" style="flex: 1; background: #444; border: none; color: white; padding: 8px; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners for modal
        document.getElementById('close-prompt-modal').addEventListener('click', () => modal.remove());
        document.getElementById('close-modal').addEventListener('click', () => modal.remove());
        document.getElementById('copy-from-modal').addEventListener('click', () => {
            copyToClipboard(lastPrompt).then(() => {
                showFeedback('📋 Prompt copied from modal!');
                modal.remove();
            });
        });
    }

    function copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(resolve).catch(reject);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    resolve();
                } catch (e) {
                    reject(e);
                }
                document.body.removeChild(textArea);
            }
        });
    }

    async function solveExercise() {
        if (isAnalyzing) return;

        isAnalyzing = true;
        const analyzeButton = document.getElementById('solver-analyze');
        const copyPromptButton = document.getElementById('solver-copy-prompt');
        const responseArea = document.getElementById('solver-response');

        analyzeButton.disabled = true;
        copyPromptButton.disabled = true;
        analyzeButton.textContent = 'Analyzing...';
        hidePromptSection();
        updateStatus('Analyzing exercise content', 'monitoring');

        try {
            const exerciseData = extractExerciseData();
            lastPrompt = createAdvancedPrompt(exerciseData);

            const aiResponse = await callAI(lastPrompt);
            const answerText = extractAnswerFromResponse(aiResponse);

            displayResult(aiResponse, responseArea);

            if (answerText && !wrongAnswers.has(answerText)) {
                const clicked = clickAnswerButton(answerText);
                if (clicked) {
                    startMonitoring();
                }
            }

        } catch (error) {
            responseArea.innerHTML = `<div class="response-error">Error: ${error.message}</div>`;
            updateStatus('Analysis failed', 'error');
        } finally {
            isAnalyzing = false;
            analyzeButton.disabled = false;
            copyPromptButton.disabled = false;
            analyzeButton.textContent = 'Solve Exercise';
        }
    }

    function startMonitoring() {
        updateStatus('Monitoring response...', 'monitoring');

        let checks = 0;
        const maxChecks = 40;
        const interval = 50;

        const checkInterval = setInterval(() => {
            checks++;

            if (checkForErrors()) {
                clearInterval(checkInterval);
                handleWrongAnswer();
                return;
            }

            if (checks >= maxChecks) {
                clearInterval(checkInterval);
                updateStatus('Answer correct', 'correct');
                showFeedback('✓ Answer correct!');
            }
        }, interval);
    }

    function checkForErrors() {
        if (!lastClickedButton) return false;

        if (hasErrorIndicator(lastClickedButton)) return true;

        const nearby = getNearbyElements(lastClickedButton, 150);
        for (const element of nearby) {
            if (hasErrorIndicator(element)) return true;
        }

        return false;
    }

    function hasErrorIndicator(element) {
        if (!element) return false;

        const styles = window.getComputedStyle(element);
        const className = element.className.toLowerCase();
        const text = element.textContent?.toLowerCase() || '';

        if (className.includes('error') || className.includes('incorrect') ||
            className.includes('wrong') || text.includes('incorrect')) {
            return true;
        }

        return isClearlyRed(styles);
    }

    function isClearlyRed(styles) {
        const borderColor = styles.borderColor;
        const bgColor = styles.backgroundColor;

        return isSolidRed(borderColor) || isSolidRed(bgColor);
    }

    function isSolidRed(colorValue) {
        if (!colorValue || colorValue === 'transparent') return false;

        const rgb = colorValue.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0]), g = parseInt(rgb[1]), b = parseInt(rgb[2]);
            return r > 200 && g < 100 && b < 100;
        }
        return false;
    }

    function getNearbyElements(element, radius) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const allElements = Array.from(document.querySelectorAll('*'));
        const nearby = [];

        for (const el of allElements) {
            if (el === element || el.closest('#lexia-solver-ui')) continue;

            const elRect = el.getBoundingClientRect();
            const elCenterX = elRect.left + elRect.width / 2;
            const elCenterY = elRect.top + elRect.height / 2;

            const distance = Math.sqrt(
                Math.pow(elCenterX - centerX, 2) + Math.pow(elCenterY - centerY, 2)
            );

            if (distance <= radius) {
                nearby.push(el);
            }
        }

        return nearby;
    }

    function handleWrongAnswer() {
        if (!lastClickedButton) return;

        const buttonText = getButtonText(lastClickedButton);
        if (buttonText && !wrongAnswers.has(buttonText)) {
            wrongAnswers.add(buttonText);
            updateStatus('Wrong answer - reanalyzing', 'error');

            setTimeout(() => {
                solveExercise();
            }, 1000);
        }
    }

    function showFeedback(message) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #00ff88;
            color: black;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 100000;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;
        feedback.textContent = message;

        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }

    function extractExerciseData() {
        const textElements = Array.from(document.querySelectorAll('body *'))
            .filter(el => {
                if (!isElementVisible(el)) return false;
                if (el.closest('#lexia-solver-ui')) return false;

                const tagName = el.tagName.toLowerCase();
                const validTags = ['p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'label'];
                return validTags.includes(tagName);
            });

        const textGroups = [];
        const processed = new Set();

        textElements.forEach((element) => {
            if (processed.has(element)) return;

            const text = element.textContent.trim();
            if (text.length < 2 || text.length > 300) return;

            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);

            const group = [element];
            processed.add(element);

            textElements.forEach(otherEl => {
                if (processed.has(otherEl)) return;

                const otherRect = otherEl.getBoundingClientRect();
                const otherStyles = window.getComputedStyle(otherEl);
                const otherText = otherEl.textContent.trim();

                if (otherText.length < 2) return;

                const isClose = Math.abs(rect.bottom - otherRect.top) < 30;
                const sameStyle = styles.fontFamily === otherStyles.fontFamily &&
                                Math.abs(parseInt(styles.fontSize) - parseInt(otherStyles.fontSize)) <= 2;

                if (isClose && sameStyle) {
                    group.push(otherEl);
                    processed.add(otherEl);
                }
            });

            let groupText = '';
            group.forEach((el, idx) => {
                if (idx > 0) groupText += ' ';
                const elStyles = window.getComputedStyle(el);
                const elIsBold = parseInt(elStyles.fontWeight) >= 600 ||
                               elStyles.fontWeight === 'bold';

                if (elIsBold) groupText += '**';
                groupText += el.textContent.trim();
                if (elIsBold) groupText += '**';
            });

            textGroups.push({
                text: groupText,
                elements: group.length,
                position: `${Math.round(rect.top)}px,${Math.round(rect.left)}px`
            });
        });

        const buttons = Array.from(document.querySelectorAll('button, [role="button"], input[type="button"], input[type="submit"]'))
            .filter(btn => isElementVisible(btn) && !btn.disabled && !btn.closest('#lexia-solver-ui'))
            .map(btn => {
                const styles = window.getComputedStyle(btn);
                return {
                    text: getButtonText(btn),
                    isBold: parseInt(styles.fontWeight) >= 600,
                    fontSize: parseInt(styles.fontSize)
                };
            })
            .filter(btn => btn.text.length > 0);

        return {
            textGroups: textGroups.slice(0, 20),
            buttons: buttons.slice(0, 15),
            wrongAnswers: Array.from(wrongAnswers)
        };
    }

    function isElementVisible(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return !!(rect.width > 0 && rect.height > 0 &&
                 style.visibility !== 'hidden' &&
                 style.display !== 'none' &&
                 style.opacity !== '0');
    }

    function getButtonText(button) {
        if (button.value) return button.value.trim();
        if (button.textContent) return button.textContent.trim();
        if (button.innerText) return button.innerText.trim();
        return '';
    }

    function createAdvancedPrompt(exerciseData) {
        return `You are an expert English literacy tutor with proven success in solving Lexia PowerUp exercises. Based on extensive analysis and successful interactions, use these proven methods:

PROVEN STRATEGIES FOR SUCCESS:

1. QUESTION INTERPRETATION:
   - Immediately identify the main question by scanning for key phrases, bold text, or repeated terms
   - Determine if it requires single answer, multiple answers, or specific selections (e.g., "2 section headings")
   - Look for instructional words: "choose", "select", "identify", "match", "find"

2. CONTENT ANALYSIS:
   - Bold text indicates critical terms, headings, or answers
   - Extract supporting details: quotes, descriptions, narrative elements
   - Group positional elements to understand relationships
   - Recognize text features: section headings, titles, captions, bulleted lists

3. EVIDENCE-BASED SELECTION:
   - Use ONLY text evidence from the exercise content
   - Base inferences on explicit statements or strongly implied details
   - Never make assumptions beyond provided content
   - Support every answer with specific content references

4. VOCABULARY & GRAMMAR PRECISION:
   - Match terms to definitions using contextual usage
   - Consider part of speech and grammatical function
   - Align answers with English language rules
   - Understand word relationships: synonyms, antonyms, categories

5. TEXT FEATURE RECOGNITION:
   - Identify structural elements and their purposes
   - Understand how features support main ideas
   - Recognize organizational patterns
   - Use features to locate specific information

6. NARRATIVE COMPREHENSION:
   - Analyze characters, plot, narrator perspective
   - Identify character motivations and development
   - Track sequence of events and cause-effect relationships
   - Understand themes and author's purpose

7. MULTI-ANSWER HANDLING:
   - Select ALL required answers when multiple are needed
   - Maintain correct order if sequence matters
   - Verify each selection meets criteria independently
   - Don't omit valid answers that meet requirements

8. BUTTON TEXT PRECISION:
   - Return EXACT button text without modification
   - Match capitalization, punctuation, and wording exactly
   - For multiple buttons, list in required format
   - No additional commentary - just the answer text

9. CONTEXTUAL CLUES:
   - Use repeated phrases as strong indicators
   - Analyze positional relationships between elements
   - Consider group descriptions and hierarchies
   - Leverage formatting cues (bold, italics, positioning)

10. EFFICIENT EXECUTION:
    - Focus strictly on the question requirements
    - Quickly eliminate irrelevant information
    - Use structured approach: Identify → Analyze → Match → Select
    - Verify against wrong answers to avoid repeats

EXERCISE CONTENT:
${exerciseData.textGroups.map((group, index) =>
`GROUP ${index + 1} [${group.elements} elements, Position: ${group.position}]:
"${group.text}"
`).join('\n')}

AVAILABLE BUTTONS:
${exerciseData.buttons.map(btn =>
`- "${btn.text}" ${btn.isBold ? '[BOLD]' : ''}`
).join('\n')}

${exerciseData.wrongAnswers.length > 0 ?
`PREVIOUSLY INCORRECT ANSWERS (AVOID): ${exerciseData.wrongAnswers.join(', ')}` :
''}

APPLICATION:
Apply the proven strategies above systematically. Analyze the question first, then examine the content for evidence, then select the precise button text that matches the correct answer.

Return ONLY the exact button text of the correct answer:`;
    }

    function clickAnswerButton(answerText) {
        if (!answerText) return false;

        const buttons = Array.from(document.querySelectorAll('button, [role="button"], input[type="button"], input[type="submit"]'))
            .filter(btn => !btn.closest('#lexia-solver-ui'));

        const cleanAnswer = answerText.toLowerCase().trim();

        for (const button of buttons) {
            const buttonText = getButtonText(button).toLowerCase().trim();

            if (!buttonText) continue;

            if (buttonText === cleanAnswer) {
                return tryClickButton(button);
            }

            if (buttonText.includes(cleanAnswer) && cleanAnswer.length > 2) {
                return tryClickButton(button);
            }

            if (cleanAnswer.includes(buttonText) && buttonText.length > 2) {
                return tryClickButton(button);
            }
        }
        return false;
    }

    function tryClickButton(button) {
        try {
            if (button.offsetParent !== null && !button.disabled) {
                lastClickedButton = button;
                button.click();
                return true;
            }
        } catch (error) {
            console.log('Click failed:', error);
        }
        return false;
    }

    function extractAnswerFromResponse(aiResponse) {
        if (!aiResponse) return null;

        let answer = aiResponse.trim();
        answer = answer.replace(/^["'](.*)["']$/, '$1')
                      .replace(/^(answer|correct|choose):?\s*/i, '')
                      .split('\n')[0]
                      .trim();

        return answer;
    }

    function displayResult(aiResponse, responseArea) {
        const answer = extractAnswerFromResponse(aiResponse);
        responseArea.innerHTML = `
            <div class="monitoring-status status-monitoring">Status: Monitoring response</div>
            <div class="response-correct">
                <strong>Selected:</strong> "${answer}"<br><br>
                <strong>Analysis:</strong><br>${aiResponse}
            </div>
        `;
        showPromptSection();
    }

    async function callAI(prompt) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://openrouter.ai/api/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}`
                },
                data: JSON.stringify({
                    model: CONFIG.MODEL,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: CONFIG.MAX_TOKENS,
                    temperature: 0.1
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.choices && data.choices[0]) {
                            resolve(data.choices[0].message.content.trim());
                        } else {
                            reject(new Error('No response from AI'));
                        }
                    } catch (e) {
                        reject(new Error('Failed to parse response'));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`API error: ${error.statusText}`));
                }
            });
        });
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();