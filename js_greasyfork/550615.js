// ==UserScript==
// @name         Google Docs Type Simulator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Simulate typing in Google Docs
// @author       You
// @match        https://docs.google.com/document/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/550615/Google%20Docs%20Type%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/550615/Google%20Docs%20Type%20Simulator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles
    GM_addStyle(`
        .help-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: #4285f4;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 16px;
            font-size: 12px;
            margin-left: 8px;
            cursor: help;
        }
        
        .advanced-section {
            margin-top: 16px;
            border-top: 1px solid #ddd;
            padding-top: 16px;
            display: none;
        }
        
        .parameter-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .parameter-input {
            width: 80px;
            margin-left: 8px;
            padding: 4px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .advanced-section.visible {
            display: block;
        }
        
        .basic-section.hidden {
            display: none;
        }
        #typing-blocker {
            position: absolute;
            background: transparent;
            z-index: 9999;
            display: none;
            cursor: not-allowed;
            pointer-events: none;
        }
        .typing-blocker-active {
            pointer-events: auto !important;
            background: rgba(255, 255, 255, 0.1) !important;
        }


        .typing-simulator-button-active {
            background: #ff4444 !important;
            color: white !important;
            opacity: 1 !important;
        }
        #typing-simulator-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            width: 400px;
            font-family: Arial, sans-serif;
            display: none;
        }
        .typing-simulator-input {
            width: 100%;
            margin: 8px 0;
            padding: 8px;
            box-sizing: border-box;
        }
        .typing-simulator-label {
            display: block;
            margin-top: 12px;
        }
        .typing-simulator-button {
            background: #4285f4;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 12px;
        }
        .typing-simulator-close {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            font-size: 20px;
        }
    `);

    const typingProfiles = {
        average: {
            baseIKI: 238.66,
            ikiSD: 111.60,
            rolloverRatio: 0.25,
            errorRate: 0.0117,
            errorCorrectionRange: 3,  // Max chars to go back
            errorCorrectionChance: 0.8 // Chance that we'll correct an error
        },
        fast: {
            baseIKI: 180,
            ikiSD: 90,
            rolloverRatio: 0.3,
            errorRate: 0.02,
            errorCorrectionRange: 12,
            errorCorrectionChance: 0.55
        },
        slow: {
            baseIKI: 400,
            ikiSD: 150,
            rolloverRatio: 0.2,
            errorRate: 0.015,
            errorCorrectionRange: 20,
            errorCorrectionChance: 0.7
        }
    };

    // Debug function
    function debug(msg) {
        console.log('[Type Simulator Debug]:', msg);
    }

    // Create blocker overlay
    function createBlocker() {
        const blocker = document.createElement('div');
        blocker.id = 'typing-blocker';

        function positionBlocker() {
            const editor = document.querySelector('.kix-appview-editor');
            if (editor) {
                const rect = editor.getBoundingClientRect();
                blocker.style.top = `${rect.top}px`;
                blocker.style.left = `${rect.left}px`;
                blocker.style.width = `${rect.width}px`;
                blocker.style.height = `${rect.height}px`;
            }
        }

        // Initial positioning
        positionBlocker();

        // Update position when window is resized or scrolled
        window.addEventListener('resize', positionBlocker);
        document.addEventListener('scroll', positionBlocker);

        // Prevent default on all mouse and keyboard events
        blocker.addEventListener('mousedown', e => e.preventDefault(), true);
        blocker.addEventListener('keydown', e => e.preventDefault(), true);
        blocker.addEventListener('click', e => e.preventDefault(), true);

        document.body.appendChild(blocker);
    }

    // Update time estimate
    function updateTimeEstimate() {
        debug('Updating time estimate');
        const text = document.querySelector('#text-input').value;
        let baseIKI;
        
        const isAdvanced = document.querySelector('#advanced-mode').checked;
        if (isAdvanced) {
            baseIKI = parseFloat(document.querySelector('#baseIKI').value);
        } else {
            const profile = document.querySelector('#profile-select').value;
            baseIKI = typingProfiles[profile].baseIKI;
        }

        const estimatedTimeMs = text.length * baseIKI;
        const estimatedTimeSec = Math.round(estimatedTimeMs / 1000);
        const minutes = Math.floor(estimatedTimeSec / 60);
        const seconds = estimatedTimeSec % 60;

        document.querySelector('#time-estimate').textContent =
            `Estimated time: ${minutes}m ${seconds}s`;
    }

    class TypeSimulator {
        constructor(config = {}) {
            this.baseIKI = config.baseIKI || 238.66;
            this.ikiSD = config.ikiSD || 111.60;
            this.keypressDuration = config.keypressDuration || 116.25;
            this.keypressDurationSD = config.keypressDurationSD || 23.88;
            this.rolloverRatio = config.rolloverRatio || 0.25;
            this.errorRate = config.errorRate || 0.0117;
            this.errorCorrectionChance = config.errorCorrectionChance || 0.8;
            this.errorCorrectionRange = config.errorCorrectionRange || 3;

            this.leftHandKeys = new Set('qwertasdfgzxcvb'.split(''));
            this.rightHandKeys = new Set('yuiophjklnm'.split(''));

            this.lastKeyTime = 0;
            this.lastKey = null;
            this.timings = [];
            this.errorStats = {
                totalErrors: 0
            };
        }

        gaussianRandom(mean, standardDeviation) {
            let u = 0, v = 0;
            while(u === 0) u = Math.random();
            while(v === 0) v = Math.random();
            const normal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            return mean + standardDeviation * normal;
        }

        getTypingHand(key) {
            if (this.leftHandKeys.has(key.toLowerCase())) return 'left';
            if (this.rightHandKeys.has(key.toLowerCase())) return 'right';
            return 'either';
        }

        calculateIKIAdjustment(currentKey) {
            if (!this.lastKey) return 0;

            if (currentKey.toLowerCase() === this.lastKey.toLowerCase()) {
                return this.baseIKI < 200 ? 30 : -150;
            }

            const lastHand = this.getTypingHand(this.lastKey);
            const currentHand = this.getTypingHand(currentKey);

            if (lastHand !== currentHand && lastHand !== 'either' && currentHand !== 'either') {
                return -15;
            }

            if (currentHand === 'left') {
                return 10;
            }

            return 0;
        }

        typeChar(char, isCorrection = false) {
            const now = this.lastKeyTime ? this.lastKeyTime : Date.now();
            let iki = this.gaussianRandom(this.baseIKI, this.ikiSD);
            iki += this.calculateIKIAdjustment(char);
            iki = Math.max(60, iki);

            const duration = this.gaussianRandom(this.keypressDuration, this.keypressDurationSD);
            const useRollover = Math.random() < this.rolloverRatio;

            let timing = {
                key: char,
                keydownTime: useRollover && this.lastKeyTime ? this.lastKeyTime - 30 : now + iki,
                keyupTime: null,
                isTypo: false,
                isCorrection: isCorrection
            };

            // Only check for typos if this isn't already a correction
            if (!isCorrection && Math.random() < this.errorRate) {
                const adjacentKeys = this.getAdjacentKeys(char);
                if (adjacentKeys.length > 0) {
                    timing.key = adjacentKeys[Math.floor(Math.random() * adjacentKeys.length)];
                    timing.isTypo = true;
                    timing.intendedKey = char; // Store the intended key
                    this.errorStats.totalErrors++;
                }
            }

            timing.keyupTime = timing.keydownTime + duration;
            this.lastKeyTime = timing.keydownTime;
            this.lastKey = char;

            return timing;
        }

        getAdjacentKeys(key) {
            const keyboard = {
                'q': ['w','a'],
                'w': ['q','e','s'],
                'e': ['w','r','d'],
                'r': ['e','t','f'],
                't': ['r','y','g'],
                'y': ['t','u','h'],
                'u': ['y','i','j'],
                'i': ['u','o','k'],
                'o': ['i','p','l'],
                'p': ['o','['],
                'a': ['q','s','z'],
                's': ['w','a','d','x'],
                'd': ['e','s','f','c'],
                'f': ['r','d','g','v'],
                'g': ['t','f','h','b'],
                'h': ['y','g','j','n'],
                'j': ['u','h','k','m'],
                'k': ['i','j','l'],
                'l': ['o','k',';'],
                'z': ['a','x'],
                'x': ['s','z','c'],
                'c': ['d','x','v'],
                'v': ['f','c','b'],
                'b': ['g','v','n'],
                'n': ['h','b','m'],
                'm': ['j','n',',']
            };
            return keyboard[key.toLowerCase()] || [];
        }

        typeText(text) {
            // Remove the pre-computation of typos - we'll handle them in real-time
            this.lastKeyTime = Date.now();
            this.timings = [];
            this.errorStats.totalErrors = 0;

            for (let i = 0; i < text.length; i++) {
                const timing = this.typeChar(text[i]);
                this.timings.push(timing);
            }

            return this.timings;
        }
    }


    class EnhancedTypingSimulator {
    constructor(targetFrame, options = {}) {
        this.targetFrame = targetFrame;
        this.isTyping = false;

        this.typeSimulator = new TypeSimulator({
            baseIKI: options.baseIKI || 120,
            ikiSD: options.ikiSD || 11,
            keypressDuration: 116.25,
            keypressDurationSD: 23.88,
            rolloverRatio: options.rolloverRatio || 0.50,
            errorRate: options.errorRate || 0.008,
            errorCorrectionRange: options.errorCorrectionRange || 15,
            errorCorrectionChance: options.errorCorrectionChance || 0.8
        });

        this.startTime = null;
        this.errorStats = {
            totalErrors: 0
        };

        // Add state tracking for error correction
        this.currentText = '';
        this.isInErrorCorrection = false;
        this.lastTypoPosition = -1;

    }


        stopTyping() {
            this.isTyping = false;
        }

        async simulateBackspace(frameWindow, frameDoc) {
            const backspaceEvent = {
                key: 'Backspace',
                code: 'Backspace',
                keyCode: 8,
                which: 8,
                location: 0,
                timeStamp: Date.now(),
            };

            await this.dispatchKeyEvent(frameWindow, frameDoc, 'keydown', backspaceEvent);
            await this.delay(30);
            await this.dispatchKeyEvent(frameWindow, frameDoc, 'keyup', backspaceEvent);
            await this.delay(this.typeSimulator.gaussianRandom(this.typeSimulator.baseIKI, this.typeSimulator.ikiSD));
        }

        async simulateKeySequence(frameWindow, frameDoc, timing) {
            const char = timing.key;
            
            // Special handling for newline
            if (char === '\n') {
                const enterEvent = {
                    bubbles: true,
                    cancelable: true,
                    view: frameWindow,
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    location: 0,
                    timeStamp: Date.now(),
                };
        
                await this.dispatchKeyEvent(frameWindow, frameDoc, 'keydown', enterEvent);
                await this.delay(Math.min(30, timing.keyupTime - timing.keydownTime));
                await this.dispatchKeyEvent(frameWindow, frameDoc, 'keypress', enterEvent);
                await this.delay(Math.max(0, timing.keyupTime - timing.keydownTime - 30));
                await this.dispatchKeyEvent(frameWindow, frameDoc, 'keyup', enterEvent);
                return;
            }
            
            const isUpperCase = char !== char.toLowerCase();
            const keyCode = char.charCodeAt(0);
            const code = `Key${char.toUpperCase()}`;
        
            const baseEvent = {
                bubbles: true,
                cancelable: true,
                view: frameWindow,
                key: char,
                code: code,
                keyCode: keyCode,
                which: keyCode,
                location: 0,
                timeStamp: Date.now(),
                shiftKey: isUpperCase
            };
        
            if (isUpperCase) {
                await this.dispatchKeyEvent(frameWindow, frameDoc, 'keydown', {
                    ...baseEvent,
                    key: 'Shift',
                    code: 'ShiftLeft',
                    keyCode: 16,
                    which: 16
                });
            }
        
            await this.dispatchKeyEvent(frameWindow, frameDoc, 'keydown', baseEvent);
            await this.delay(Math.min(30, timing.keyupTime - timing.keydownTime));
            await this.dispatchKeyEvent(frameWindow, frameDoc, 'keypress', baseEvent);
            await this.delay(Math.max(0, timing.keyupTime - timing.keydownTime - 30));
            await this.dispatchKeyEvent(frameWindow, frameDoc, 'keyup', baseEvent);
        
            if (isUpperCase) {
                await this.dispatchKeyEvent(frameWindow, frameDoc, 'keyup', {
                    ...baseEvent,
                    key: 'Shift',
                    code: 'ShiftLeft',
                    keyCode: 16,
                    which: 16
                });
            }
        }

        async dispatchKeyEvent(frameWindow, frameDoc, eventType, eventInit) {
            try {
                const event = new frameWindow.KeyboardEvent(eventType, {
                    ...eventInit,
                    bubbles: true,
                    cancelable: true,
                    composed: true
                });

                Object.defineProperties(event, {
                    keyCode: { value: eventInit.keyCode },
                    which: { value: eventInit.which },
                    key: { value: eventInit.key },
                    code: { value: eventInit.code }
                });

                const dispatched = frameDoc.dispatchEvent(event);
                if (!dispatched) {
                    //console.warn(`Event ${eventType} was cancelled`);
                }
            } catch (error) {
                console.error(`Error dispatching ${eventType}:`, error);
            }
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async typeText(text) {
            if (!this.targetFrame) {
                throw new Error('Target frame not found');
            }

            const frameWindow = this.targetFrame.contentWindow;
            const frameDoc = frameWindow.document;
            this.startTime = Date.now();
            this.isTyping = true;

            for (let i = 0; i < text.length; i++) {
                if (!this.isTyping) break;

                const timing = this.typeSimulator.typeChar(text[i], false);
                const currentTime = Date.now();
                const targetTime = this.startTime + (timing.keydownTime - this.typeSimulator.lastKeyTime);

                const waitTime = Math.max(0, targetTime - currentTime);
                if (waitTime > 0) {
                    await this.delay(waitTime);
                }

                // Handle typo and potential correction
                if (timing.isTypo) {
                    this.currentText += timing.key; // Add the typo
                    this.lastTypoPosition = this.currentText.length - 1;

                    // Simulate typing the typo
                    await this.simulateKeySequence(frameWindow, frameDoc, timing);

                    // Check if we should enter error correction mode
                    if (Math.random() < this.typeSimulator.errorCorrectionChance) {
                        // Determine how many characters to delete
                        const charsToDelete = Math.floor(Math.random() * this.typeSimulator.errorCorrectionRange) + 1;
                        const actualCharsToDelete = Math.min(charsToDelete, this.currentText.length);

                        // Delete characters
                        for (let j = 0; j < actualCharsToDelete; j++) {
                            this.currentText = this.currentText.slice(0, -1);
                            await this.simulateBackspace(frameWindow, frameDoc);
                        }

                        // Retype the correct sequence
                        const startPos = i - actualCharsToDelete + 1;
                        for (let j = startPos; j <= i; j++) {
                            const correctionTiming = this.typeSimulator.typeChar(text[j], true);
                            this.currentText += text[j];
                            await this.simulateKeySequence(frameWindow, frameDoc, correctionTiming);
                        }
                    }
                } else {
                    this.currentText += timing.key;
                    await this.simulateKeySequence(frameWindow, frameDoc, timing);
                }
            }

            this.isTyping = false;
        }
    }

    let currentSimulator = null;


    async function simulateTyping(text, options = {}) {
        const textFrame = document.querySelector('.docs-texteventtarget-iframe');
        if (!textFrame) {
            throw new Error('Text frame not found');
        }

        // Process text to handle special characters and line breaks
        const processedText = text
            .replace(/\\n/g, '\n')  // Convert \n to actual line breaks
            .replace(/\\t/g, '\t')  // Convert \t to actual tabs
            .replace(/\\r/g, '\r'); // Convert \r to carriage returns

        const simulator = new EnhancedTypingSimulator(textFrame, {
            baseIKI: options.baseIKI || 120,
            ikiSD: options.ikiSD || 11,
            rolloverRatio: options.rolloverRatio || 0.25,
            errorRate: options.errorRate || 0.0117,
            errorCorrectionRange: options.errorCorrectionRange || 15,
            errorCorrectionChance: options.errorCorrectionChance || 0.8
        });

        currentSimulator = simulator;

        try {
            await simulator.typeText(processedText);
            console.log('Typing complete');
            return simulator;
        } catch (error) {
            console.error('Typing failed:', error);
            throw error;
        }
    }



    async function startTyping() {
        debug('Starting typing simulation');
        const text = document.querySelector('#text-input').value;
        if (!text) {
            alert('Please enter some text to type');
            return;
        }
    
        document.querySelector('#typing-simulator-panel').style.display = 'none';
    
        const blocker = document.querySelector('#typing-blocker');
        const button = document.querySelector('#type-simulator-button');
    
        const editor = document.querySelector('.docs-editor-container');
        if (editor) {
            const rect = editor.getBoundingClientRect();
            blocker.style.top = `${rect.top}px`;
            blocker.style.left = `${rect.left}px`;
            blocker.style.width = `${rect.width}px`;
            blocker.style.height = `${rect.height}px`;
        }
    
        blocker.style.display = 'block';
        blocker.classList.add('typing-blocker-active');
        button.classList.add('typing-simulator-button-active');
        button.textContent = 'Stop Typing';
    
        // Replace these two lines:
        // const profile = document.querySelector('#profile-select').value;
        // const options = typingProfiles[profile];
        
        // With this new code:
        const isAdvanced = document.querySelector('#advanced-mode').checked;
        let options;
        
        if (isAdvanced) {
            options = {
                baseIKI: parseFloat(document.querySelector('#baseIKI').value),
                ikiSD: parseFloat(document.querySelector('#ikiSD').value),
                rolloverRatio: parseFloat(document.querySelector('#rolloverRatio').value),
                errorRate: parseFloat(document.querySelector('#errorRate').value),
                errorCorrectionRange: parseInt(document.querySelector('#errorCorrectionRange').value),
                errorCorrectionChance: parseFloat(document.querySelector('#errorCorrectionChance').value)
            };
        } else {
            const profile = document.querySelector('#profile-select').value;
            options = typingProfiles[profile];
        }
    
        try {
            await simulateTyping(text, options);
        } catch (error) {
            console.error('Typing failed:', error);
            alert('An error occurred while typing. Check the console for details.');
        } finally {
            blocker.style.display = 'none';
            blocker.classList.remove('typing-blocker-active');
            button.classList.remove('typing-simulator-button-active');
            button.textContent = 'Type Simulator';
            currentSimulator = null;
        }
    }

    function createUI() {
        debug('Creating UI elements');
    
        // Create blocker first
        createBlocker();
    
        // Create button
        const button = document.createElement('div');
        button.setAttribute('role', 'button');
        button.className = 'goog-inline-block jfk-button jfk-button-standard docs-titlebar-button type-simulator-main-button';
        button.id = 'type-simulator-button';
        button.textContent = 'Type Simulator';
    
        // Create panel
        const panel = document.createElement('div');
        panel.id = 'typing-simulator-panel';
        panel.style.display = 'none';
    
        // Close button
        const closeBtn = document.createElement('span');
        closeBtn.className = 'typing-simulator-close';
        closeBtn.textContent = '×';
        panel.appendChild(closeBtn);
    
        // Title
        const title = document.createElement('h3');
        title.textContent = 'Typing Simulator';
        panel.appendChild(title);
    
        // Advanced mode checkbox
        const advancedRow = document.createElement('div');
        advancedRow.className = 'parameter-row';
        const advancedCheck = document.createElement('input');
        advancedCheck.type = 'checkbox';
        advancedCheck.id = 'advanced-mode';
        const advancedLabel = document.createElement('label');
        advancedLabel.htmlFor = 'advanced-mode';
        advancedLabel.textContent = 'Advanced Mode';
        advancedRow.appendChild(advancedCheck);
        advancedRow.appendChild(advancedLabel);
        panel.appendChild(advancedRow);
    
        // Create basic section
        const basicSection = document.createElement('div');
        basicSection.className = 'basic-section';
    
        // Create profile selector
        const profileLabel = document.createElement('label');
        profileLabel.className = 'typing-simulator-label';
        profileLabel.textContent = 'Profile:';
    
        const profileSelect = document.createElement('select');
        profileSelect.id = 'profile-select';
        profileSelect.className = 'typing-simulator-input';
    
        const profiles = [
            { value: 'average', text: 'Average (~52 WPM)' },
            { value: 'fast', text: 'Fast (~75 WPM)' },
            { value: 'slow', text: 'Slow (~25 WPM)' }
        ];
    
        profiles.forEach(profile => {
            const option = document.createElement('option');
            option.value = profile.value;
            option.textContent = profile.text;
            profileSelect.appendChild(option);
        });
    
        // Add profile selector to basic section
        basicSection.appendChild(profileLabel);
        basicSection.appendChild(profileSelect);
        panel.appendChild(basicSection);
    
        // Create advanced section
        const advancedSection = document.createElement('div');
        advancedSection.className = 'advanced-section';
    
        // Add parameter inputs
        const parameters = [
            { id: 'baseIKI', label: 'Base Inter-key Interval (ms)', value: 238.66, help: 'Average time between keystrokes in milliseconds' },
            { id: 'ikiSD', label: 'Timing Variation', value: 111.60, help: 'Standard deviation in typing speed' },
            { id: 'rolloverRatio', label: 'Key Overlap Chance', value: 0.25, help: 'Probability of overlapping keystrokes (0-1)' },
            { id: 'errorRate', label: 'Error Rate', value: 0.0117, help: 'Probability of making a typo (0-1)' },
            { id: 'errorCorrectionRange', label: 'Max Correction Distance', value: 3, help: 'Maximum characters to backspace when fixing a typo' },
            { id: 'errorCorrectionChance', label: 'Correction Chance', value: 0.8, help: 'Probability of correcting a typo (0-1)' }
        ];
    
        parameters.forEach(param => {
            const row = document.createElement('div');
            row.className = 'parameter-row';
    
            const label = document.createElement('label');
            label.textContent = param.label;
            label.htmlFor = param.id;
    
            const input = document.createElement('input');
            input.type = 'number';
            input.id = param.id;
            input.className = 'parameter-input';
            input.value = param.value;
            input.step = 'any';
            if (param.id === 'errorCorrectionRange') {
                input.step = '1';
            }
    
            const help = document.createElement('span');
            help.className = 'help-icon';
            help.textContent = '?';
            help.title = param.help;
    
            row.appendChild(label);
            row.appendChild(input);
            row.appendChild(help);
            advancedSection.appendChild(row);
        });
    
        panel.appendChild(advancedSection);
    
        // Text input
        const textLabel = document.createElement('label');
        textLabel.className = 'typing-simulator-label';
        textLabel.textContent = 'Text to type:';
        panel.appendChild(textLabel);
    
        const textInput = document.createElement('textarea');
        textInput.id = 'text-input';
        textInput.className = 'typing-simulator-input';
        textInput.rows = 6;
        panel.appendChild(textInput);
    
        // Time estimate
        const timeEstimate = document.createElement('div');
        timeEstimate.id = 'time-estimate';
        panel.appendChild(timeEstimate);
    
        // Start button
        const startButton = document.createElement('button');
        startButton.id = 'start-typing';
        startButton.className = 'typing-simulator-button';
        startButton.textContent = 'Start Typing';
        panel.appendChild(startButton);
    
        // Add panel to document
        document.body.appendChild(panel);
    
        // Find toolbar and add button
        const toolbar = document.querySelector('.docs-titlebar-buttons');
        if (toolbar) {
            debug('Found toolbar, inserting button');
            toolbar.insertBefore(button, toolbar.firstChild);
        } else {
            debug('Toolbar not found');
        }
    
        // Event listeners
        button.addEventListener('click', () => {
            if (currentSimulator?.isTyping) {
                currentSimulator.stopTyping();
                const blocker = document.querySelector('#typing-blocker');
                blocker.style.display = 'none';
                blocker.classList.remove('typing-blocker-active');
                button.classList.remove('typing-simulator-button-active');
                button.textContent = 'Type Simulator';
                currentSimulator = null;
            } else {
                panel.style.display = 'block';
            }
        });
    
        advancedCheck.addEventListener('change', (e) => {
            const basicSection = document.querySelector('.basic-section');
            const advancedSection = document.querySelector('.advanced-section');
            
            if (e.target.checked) {
                basicSection.classList.add('hidden');
                advancedSection.classList.add('visible');
            } else {
                basicSection.classList.remove('hidden');
                advancedSection.classList.remove('visible');
            }
            updateTimeEstimate();
        });
    
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
        });
    
        textInput.addEventListener('input', updateTimeEstimate);
        profileSelect.addEventListener('change', updateTimeEstimate);
        startButton.addEventListener('click', startTyping);
    }

    function init() {
        debug('Script started');
        if (document.readyState === 'complete') {
            createUI();
        } else {
            window.addEventListener('load', createUI);
        }
    }

    init();
})();