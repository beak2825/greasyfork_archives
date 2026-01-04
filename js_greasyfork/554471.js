// ==UserScript==
// @name         TypeAssist v0.1.1 BETA | A typing script for typeracer
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  A sleek, lightweight typing assistant for TypeRacer.
// @author       syntax.uk 
// @match        *://typeracer.com/*
// @match        *://*.typeracer.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554471/TypeAssist%20v011%20BETA%20%7C%20A%20typing%20script%20for%20typeracer.user.js
// @updateURL https://update.greasyfork.org/scripts/554471/TypeAssist%20v011%20BETA%20%7C%20A%20typing%20script%20for%20typeracer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const state = {
        isTyping: false,
        isMinimized: false,
        currentTab: 'main',
        error: '',
        typingInterval: null,
        observer: null,
        position: { x: 25, y: 25 },
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        initialPos: { x: 0, y: 0 },
        settings: {
            wpm: 95,
        }
    };

    function saveSettings() {
        try {
            localStorage.setItem('typeAssistSettings', JSON.stringify(state.settings));
        } catch (e) {
            console.error('Failed to save settings.', e);
        }
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem('typeAssistSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                state.settings.wpm = parsed.wpm || 95;
            }
        } catch (e) {
            console.error('Failed to load settings.', e);
        }
    }

    function getSelectors() {
        const inputField = document.querySelector('input.txtInput');
        const textContainer = document.querySelector('table[class*="inputPanel"]');
        return { inputField, textContainer };
    }

    function getRaceText() {
        const { textContainer } = getSelectors();
        if (!textContainer) return { fullText: "", completedText: "" };

        const allSpans = textContainer.querySelectorAll('span[unselectable="on"]');
        if (allSpans.length === 0) return { fullText: "", completedText: "" };

        let fullText = "";
        let completedText = "";

        allSpans.forEach(span => {
            const text = span.textContent;
            fullText += text;
            if (span.getAttribute('class') === 'tx_l') {
                completedText += text;
            }
        });

        return { fullText, completedText };
    }

    function startTyping() {
        if (state.isTyping) return;

        const { inputField } = getSelectors();
        if (!inputField) {
            setError("Could not find TypeRacer input field.");
            return;
        }

        const { fullText, completedText } = getRaceText();
        if (fullText === "") {
             setError("Text spans not found.");
             return;
        }

        state.isTyping = true;
        console.log(`Typing started at ${state.settings.wpm} WPM.`);
        updateUI();
        setError("");

        const avgWordLength = 5;
        const charsPerSecond = (state.settings.wpm * avgWordLength) / 60;
        const keyDelay = 1000 / charsPerSecond;

        const currentInput = inputField.value;
        let remainingText = '';

        const fullTypedText = completedText + currentInput;

        if (fullText.startsWith(fullTypedText)) {
            remainingText = fullText.substring(fullTypedText.length);
        } else {
            setError("Typo detected. Please fix it or clear input.");
            console.error('Typo detected.');
            state.isTyping = false;
            updateUI();
            return;
        }

        let charIndex = 0;
        let nextTypeTime = Date.now();
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

        state.typingInterval = setInterval(() => {
            if (!state.isTyping || charIndex >= remainingText.length) {
                if (charIndex >= remainingText.length) {
                    console.log('Typing complete!');
                } else {
                    console.log('Typing stopped by user.');
                }
                stopTyping();
                return;
            }

            const now = Date.now();

            if (now >= nextTypeTime) {
                const char = remainingText[charIndex];

                const newValue = inputField.value + char;
                nativeInputValueSetter.call(inputField, newValue);
                const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                inputField.dispatchEvent(inputEvent);

                charIndex++;

                nextTypeTime += keyDelay;

                if (nextTypeTime < now) {
                    nextTypeTime = now + keyDelay;
                }
            }
        }, 16);
    }

    function stopTyping() {
        clearInterval(state.typingInterval);
        state.typingInterval = null;
        if (state.isTyping) {
             console.log('Typing stopped.');
        }
        state.isTyping = false;
        updateUI();
    }

    function setError(message) {
        state.error = message;
        const errorEl = document.getElementById('typeassist-error');
        if (errorEl) {
            errorEl.textContent = message;
        }
        if (message) {
            console.error(message);
        }
    }

    function updateUI() {
        const startBtn = document.getElementById('typeassist-start-btn');
        if (startBtn) {
            startBtn.innerHTML = state.isTyping ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> Stop' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Start';
            state.isTyping ? startBtn.classList.add('active') : startBtn.classList.remove('active');
        }

        const captchaWarning = document.getElementById('typeassist-captcha-warning');
        if (captchaWarning) {
            captchaWarning.style.display = state.settings.wpm > 100 ? 'block' : 'none';
        }

        const wpmSlider = document.getElementById('typeassist-wpm-slider');
        const wpmNumber = document.getElementById('typeassist-wpm-number');
        if (wpmSlider) wpmSlider.value = state.settings.wpm > 300 ? 300 : state.settings.wpm;
        if (wpmNumber) wpmNumber.value = state.settings.wpm;

        document.documentElement.style.setProperty('--ta-primary', '#0a84ff');
        document.documentElement.style.setProperty('--ta-primary-hover', `#0a84ffBF`);

        const container = document.getElementById('typeassist-container');
        const contentWrapper = document.getElementById('typeassist-content-wrapper');
        const toggleBtn = document.getElementById('typeassist-toggle');
        if (container && contentWrapper && toggleBtn) {
            if (state.isMinimized) {
                container.classList.add('minimized');
                contentWrapper.style.maxHeight = '0px';
                toggleBtn.style.transform = 'rotate(180deg)';
            } else {
                container.classList.remove('minimized');
                contentWrapper.style.maxHeight = '500px';
                toggleBtn.style.transform = 'rotate(0deg)';
            }
        }

        const tabs = document.querySelectorAll('.typeassist-tab');
        const contents = document.querySelectorAll('.typeassist-tab-content');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === state.currentTab);
        });
        contents.forEach(content => {
            content.style.display = content.id === `tab-${state.currentTab}` ? 'grid' : 'none';
        });
    }

    function toggleMinimize() {
        state.isMinimized = !state.isMinimized;
        updateUI();
    }

    function switchTab(e) {
        let target = e.target;
        while (target && !target.dataset.tab) {
            target = target.parentElement;
        }
        if (target) {
            state.currentTab = target.dataset.tab;
            updateUI();
        }
    }

    function makeDraggable() {
        const container = document.getElementById('typeassist-container');
        const header = document.getElementById('typeassist-header');

        function onMouseDown(e) {
            if (e.target.closest('button, input, label, select, a')) return;
            state.isDragging = true;
            state.dragStart.x = e.clientX;
            state.dragStart.y = e.clientY;
            state.initialPos.x = container.offsetLeft;
            state.initialPos.y = container.offsetTop;
            header.style.cursor = 'grabbing';
            document.body.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function onMouseUp() {
            if (!state.isDragging) return;
            state.isDragging = false;
            header.style.cursor = 'grab';
            document.body.style.cursor = 'default';
        }

        function onMouseMove(e) {
            if (!state.isDragging) return;
            const dx = e.clientX - state.dragStart.x;
            const dy = e.clientY - state.dragStart.y;
            let newX = state.initialPos.x + dx;
            let newY = state.initialPos.y + dy;

            newX = Math.max(0, Math.min(newX, window.innerWidth - container.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight));

            container.style.left = `${newX}px`;
            container.style.top = `${newY}px`;
        }

        header.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
    }

    function injectUI() {
        const css = `
            :root {
                --ta-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;
                --ta-bg: rgba(28, 28, 30, 0.85);
                --ta-bg-header: rgba(45, 45, 48, 0.9);
                --ta-bg-content: rgba(25, 25, 28, 0.7);
                --ta-bg-tab: rgba(60, 60, 62, 0.8);
                --ta-text-primary: #f2f2f7;
                --ta-text-secondary: #a0a0a5;
                --ta-text-header: #ffffff;
                --ta-primary: #0a84ff;
                --ta-primary-hover: #339aff;
                --ta-danger: #ff3b30;
                --ta-danger-hover: #ff5c52;
                --ta-warning: #ffc400;
                --ta-border: rgba(80, 80, 85, 0.7);
                --ta-slider-track: #4a4a4f;
                --ta-slider-thumb: #fff;
                --ta-input-bg: rgba(70, 70, 73, 0.8);
                --ta-toggle-bg: #5a5a5f;
            }
            #typeassist-container {
                position: fixed; top: 25px; left: 25px;
                background-color: var(--ta-bg);
                color: var(--ta-text-primary);
                border: 1px solid var(--ta-border);
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                font-family: var(--ta-font);
                width: 320px; z-index: 99999;
                user-select: none;
                backdrop-filter: blur(12px) saturate(180%);
                -webkit-backdrop-filter: blur(12px) saturate(180%);
                transition: box-shadow 0.3s ease;
                display: flex;
                flex-direction: column;
                max-height: 90vh;
                overflow: hidden;
            }
            #typeassist-container * { box-sizing: border-box; }

            #typeassist-header {
                padding: 12px 16px;
                background-color: var(--ta-bg-header);
                cursor: grab; display: flex;
                justify-content: space-between; align-items: center;
                border-bottom: 1px solid var(--ta-border);
                flex-shrink: 0;
            }
            #typeassist-header-controls {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            #typeassist-title-group h3 {
                margin: 0; font-size: 17px; font-weight: 600;
                color: var(--ta-text-header); display: flex; align-items: baseline; gap: 8px;
            }
            #typeassist-version {
                font-size: 11px; font-weight: 500;
                color: var(--ta-text-secondary);
                background: var(--ta-slider-track);
                padding: 2px 5px; border-radius: 4px;
            }
            #typeassist-toggle {
                background: transparent; border: none;
                color: var(--ta-text-secondary); cursor: pointer;
                font-size: 18px; padding: 4px; line-height: 1;
                border-radius: 6px;
                transition: all 0.2s ease-out;
            }
            #typeassist-toggle:hover {
                color: var(--ta-text-primary);
                background: var(--ta-input-bg);
            }
            #typeassist-content-wrapper {
                overflow-y: auto;
                overflow-x: hidden;
                transition: max-height 0.3s ease-out;
                flex-grow: 1;
                min-height: 0;
                max-height: 500px;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            #typeassist-content-wrapper::-webkit-scrollbar {
                display: none;
            }
            #typeassist-container.minimized #typeassist-content-wrapper {
                max-height: 0;
                overflow: hidden;
            }
            #typeassist-content {
                padding: 24px; display: grid; gap: 24px;
            }
            #typeassist-tabs {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
                background: var(--ta-bg-tab);
                padding: 4px; border-radius: 10px;
            }
            .typeassist-tab {
                flex: 1; background: transparent; border: none;
                color: var(--ta-text-secondary);
                padding: 6px 10px; border-radius: 8px;
                font-size: 13px; font-weight: 500;
                font-family: var(--ta-font); cursor: pointer;
                display: flex; align-items: center;
                justify-content: center; gap: 6px;
                transition: color 0.2s ease, background-color 0.2s ease;
                position: relative;
                white-space: nowrap;
            }
            .typeassist-tab:hover { color: var(--ta-text-primary); }
            .typeassist-tab.active {
                color: var(--ta-text-primary);
                background: var(--ta-bg);
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            .typeassist-tab-content {
                display: grid; 
                gap: 24px;
            }
            #tab-misc {
                gap: 12px;
            }

            #typeassist-captcha-warning {
                display: none;
                color: var(--ta-warning);
                font-size: 12px; text-align: center;
                padding: 10px; background: rgba(255, 196, 0, 0.1);
                border-radius: 8px;
                border: 1px solid rgba(255, 196, 0, 0.2);
            }
            .typeassist-control { display: grid; gap: 10px; }
            .typeassist-control label, .typeassist-toggle-label {
                display: block; font-size: 14px; font-weight: 500;
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 4px;
            }
            .typeassist-control .value {
                color: var(--ta-text-secondary); font-weight: 400;
                font-size: 13px;
            }
            .typeassist-wpm-input {
                display: flex; align-items: center; gap: 8px;
            }
            .typeassist-wpm-input input[type="number"] {
                width: 65px; background: var(--ta-input-bg);
                border: 1px solid var(--ta-border);
                color: var(--ta-text-primary);
                border-radius: 8px; padding: 8px;
                font-size: 14px; font-family: var(--ta-font);
                -moz-appearance: textfield;
            }
            .typeassist-wpm-input input[type="number"]::-webkit-outer-spin-button,
            .typeassist-wpm-input input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none; margin: 0;
            }
            #typeassist-error {
                color: var(--ta-danger); font-size: 13px;
                text-align: center; min-height: 1.2em;
            }
            input[type="range"].typeassist-slider {
                -webkit-appearance: none; width: 100%; height: 8px;
                background: var(--ta-slider-track);
                border-radius: 4px; outline: none;
                opacity: 0.9; transition: opacity .2s;
                cursor: pointer;
            }
            input[type="range"].typeassist-slider:hover { opacity: 1; }
            input[type="range"].typeassist-slider::-webkit-slider-thumb {
                -webkit-appearance: none; appearance: none;
                width: 20px; height: 20px;
                background: var(--ta-slider-thumb);
                border-radius: 50%;
                border: 3px solid var(--ta-primary);
                box-shadow: 0 1px 5px rgba(0,0,0,0.3);
                transition: transform 0.1s ease;
            }
            input[type="range"].typeassist-slider::-webkit-slider-thumb:active { transform: scale(1.15); }
            input[type="range"].typeassist-slider::-moz-range-thumb {
                width: 16px; height: 16px;
                background: var(--ta-slider-thumb);
                border-radius: 50%;
                border: 3px solid var(--ta-primary);
                box-shadow:  0 1px 5px rgba(0,0,0,0.3);
            }
            #typeassist-start-btn {
                width: 100%; padding: 12px;
                font-size: 16px; font-weight: 600;
                background-color: var(--ta-primary);
                color: white; border: none; border-radius: 10px;
                cursor: pointer; display: flex;
                align-items: center; justify-content: center;
                gap: 8px;
                transition: background-color 0.2s ease, transform 0.1s ease;
            }
            #typeassist-start-btn:hover { background-color: var(--ta-primary-hover); }
            #typeassist-start-btn:active { transform: scale(0.98); }
            #typeassist-start-btn.active { background-color: var(--ta-danger); }
            #typeassist-start-btn.active:hover { background-color: var(--ta-danger-hover); }

            .typeassist-link-btn {
                width: 100%; padding: 10px;
                font-size: 14px; font-weight: 500;
                background-color: var(--ta-primary);
                color: white; border: none; border-radius: 10px;
                cursor: pointer; display: flex;
                align-items: center; justify-content: center;
                gap: 8px;
                text-decoration: none;
                transition: background-color 0.2s ease, transform 0.1s ease;
            }
            .typeassist-link-btn:hover {
                background-color: var(--ta-primary-hover);
                color: white;
                text-decoration: none;
            }
            .typeassist-link-btn.github {
                background-color: var(--ta-slider-track);
            }
            .typeassist-link-btn.github:hover {
                background-color: var(--ta-border);
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);

        const icons = {
            chevron: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            zap: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
            misc: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };

        const html = `
            <div id="typeassist-container">
                <div id="typeassist-header">
                    <div id="typeassist-title-group">
                        <h3>TypeAssist <span id="typeassist-version">v0.1.1 BETA</span></h3>
                    </div>
                    <div id="typeassist-header-controls">
                         <button id="typeassist-toggle" title="Toggle UI">${icons.chevron}</button>
                    </div>
                </div>
                <div id="typeassist-content-wrapper">
                    <div id="typeassist-content">

                        <div id="typeassist-tabs">
                            <button class="typeassist-tab active" data-tab="main">${icons.zap} Main</button>
                            <button class="typeassist-tab" data-tab="misc">${icons.misc} Misc</button>
                        </div>
                        
                        <div id="tab-main" class="typeassist-tab-content">
                            <div id="typeassist-captcha-warning">Warning! WPM &gt; 100. Typeracer requires a captcha for scores above 100wpm.</div>
                            <div class="typeassist-control">
                                <label for="typeassist-wpm-slider">
                                    <span>Target WPM (May be off by 5-10WPM)</span>
                                    <div class="typeassist-wpm-input">
                                        <input type="number" id="typeassist-wpm-number" value="95" min="20" max="999" />
                                        <span class="value">WPM</span>
                                    </div>
                                </label>
                                <input type="range" id="typeassist-wpm-slider" class="typeassist-slider" min="20" max="300" value="95" />
                            </div>

                            <button id="typeassist-start-btn">Start</button>
                            <div id="typeassist-error"></div>
                        </div>

                        <div id="tab-misc" class="typeassist-tab-content" style="display: none; gap: 12px;">
                            <a href="https://discord.gg/GbBDxCT9cP" target="_blank" class="typeassist-link-btn">Discord</a>
                            <a href="https://github.com/syntaxuk/typeassist" target="_blank" class="typeassist-link-btn github">GitHub</a>
                        </div>

                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    function setupEventListeners() {
        document.getElementById('typeassist-start-btn').addEventListener('click', () => {
            state.isTyping ? stopTyping() : startTyping();
        });

        document.getElementById('typeassist-toggle').addEventListener('click', toggleMinimize);

        document.querySelectorAll('.typeassist-tab').forEach(tab => {
            tab.addEventListener('click', switchTab);
        });

        const wpmSlider = document.getElementById('typeassist-wpm-slider');
        const wpmNumber = document.getElementById('typeassist-wpm-number');

        wpmSlider.addEventListener('input', (e) => {
            state.settings.wpm = parseInt(e.target.value, 10);
            updateUI();
        });
        wpmSlider.addEventListener('change', saveSettings);

        wpmNumber.addEventListener('input', (e) => {
            let val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
                if (val < 20) val = 20;
                if (val > 999) val = 999;
                state.settings.wpm = val;
                const wpmSlider = document.getElementById('typeassist-wpm-slider');
                if (wpmSlider) wpmSlider.value = val > 300 ? 300 : val;
            }
        });
        wpmNumber.addEventListener('change', (e) => {
            let val = parseInt(e.target.value, 10);
            if (isNaN(val) || val < 20) {
                val = 20;
            }
            if (val > 999) val = 999;
            state.settings.wpm = val;
            e.target.value = val;
            saveSettings();
            updateUI();
        });

        makeDraggable();
    }

    function observeGameContainer() {
        const targetNode = document.getElementById('dUI');
        if (!targetNode) {
            console.error('Could not find GWT container #dUI to observe.');
            return;
        }

        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            if (state.isTyping) {
                const { inputField } = getSelectors();
                if (!inputField || inputField.offsetParent === null) {
                    setError('Input field not found, stopping.');
                    stopTyping();
                }
            }
        };

        state.observer = new MutationObserver(callback);
        state.observer.observe(targetNode, config);
        console.log('MutationObserver started.');
    }


    function init() {
        if (document.getElementById('typeassist-container')) return;

        loadSettings();
        injectUI();
        setupEventListeners();
        updateUI();
        observeGameContainer();
    }

    const initPoller = setInterval(() => {
        const gwtApp = document.getElementById('dUI');
        if (gwtApp && gwtApp.querySelector('table')) {
            clearInterval(initPoller);
            init();
        }
    }, 500);

})();

