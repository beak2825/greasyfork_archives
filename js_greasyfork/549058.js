// ==UserScript==
// @name            ChatGPT Read Aloud - Auto Speaker
// @version         1.1
// @description     Automatically triggers ChatGPT built-in text-to-speech for new responses. Includes a movable UI panel.
// @author          https://winagentgpt.com
// @namespace       https://winagentgpt.com
// @match           https://chat.openai.com/*
// @match           https://chatgpt.com/*
// @grant           none
// @run-at          document-idle
// @license         CC0-1.0
// @compatible      chrome version >=71 (older versions untested)
// @downloadURL https://update.greasyfork.org/scripts/549058/ChatGPT%20Read%20Aloud%20-%20Auto%20Speaker.user.js
// @updateURL https://update.greasyfork.org/scripts/549058/ChatGPT%20Read%20Aloud%20-%20Auto%20Speaker.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // --- AUTO SPEAK PROJECT ---
    // Automatically triggers ChatGPT's built-in TTS when new responses are detected

    // --- CONFIGURATION ---
    const AI_NAME = "ChatGPT";
    const RESPONSE_CONTAINER_SELECTOR = "div[data-message-id]";
    const COLLAPSED_WIDTH = "40px";
    const COLLAPSED_HEIGHT = "35px";
    const COLLAPSED_TEXT = "≡";

    // --- STATE ---
    let lastDetectedButtonState = null;
    let isCollapsed = false;
    let autoSpeakEnabled = false;
    let stopIconIntervalId = null;

    // --- HELPER: Logging ---
    function logToConsole(message, type = "info") {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[AUTO SPEAK] [${timestamp}]`;
        if (type === "error") console.error(`${prefix} ${message}`);
        else if (type === "warn") console.warn(`${prefix} ${message}`);
        else console.log(`${prefix} ${message}`);
    }

    // --- ONE-TIME SETUP: Audio Control ---
    (function setupAudioHijack() {
        if (HTMLMediaElement.prototype._isHookedByAutoSpeak) return;

        let _isPauseAllowedByScript = false;
        const originalPause = HTMLMediaElement.prototype.pause;

        HTMLMediaElement.prototype.pause = function() {
            if (_isPauseAllowedByScript) {
                originalPause.apply(this, arguments);
            } else {
                logToConsole("Pause blocked - audio continues playing");
            }
        };

        HTMLMediaElement.prototype._isHookedByAutoSpeak = true;

        window.forceStopAllTtsAudio = function() {
            _isPauseAllowedByScript = true;
            document.querySelectorAll('audio, video').forEach(media => {
                if (!media.paused) media.pause();
            });
            _isPauseAllowedByScript = false;
            hideStopButton();
        };

        logToConsole("Audio control setup complete");
    })();

    // --- UI: Stop Button Management ---
    function showStopButton() {
        const stopBtn = document.getElementById('autoSpeakStopBtn');
        if (stopBtn) {
            stopBtn.style.display = 'block';
            logToConsole("Stop button shown");
        }
    }

    function hideStopButton() {
        const stopBtn = document.getElementById('autoSpeakStopBtn');
        if (stopBtn) {
            stopBtn.style.display = 'none';
            logToConsole("Stop button hidden");
        }
        if (stopIconIntervalId) {
            clearInterval(stopIconIntervalId);
            stopIconIntervalId = null;
        }
    }

    // --- Audio State Monitor ---
    function monitorAudioState() {
        const previouslyMonitoredAudio = document.querySelector("audio[data-auto-speak-monitored='true']");
        if (previouslyMonitoredAudio) {
            delete previouslyMonitoredAudio.dataset.autoSpeakMonitored;
        }

        const interval = setInterval(() => {
            const audioEl = document.querySelector("audio");
            if (audioEl && !audioEl.dataset.autoSpeakMonitored) {
                audioEl.dataset.autoSpeakMonitored = "true";

                const onAudioPause = () => {
                    logToConsole("Audio paused - hiding stop button");
                    hideStopButton();
                };
                const onAudioEnded = () => {
                    logToConsole("Audio ended - cleaning up");
                    hideStopButton();
                    audioEl.removeEventListener("ended", onAudioEnded);
                    audioEl.removeEventListener("pause", onAudioPause);
                };

                audioEl.addEventListener("ended", onAudioEnded);
                audioEl.addEventListener("pause", onAudioPause);
                clearInterval(interval);
            }
        }, 250);
        setTimeout(() => clearInterval(interval), 5000);
    }

    // --- TTS Trigger Function ---
    function triggerAutoSpeak() {
        if (!autoSpeakEnabled) return;

        function forceClick(element) {
            element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true }));
            element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
            element.click();
            element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
            element.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, cancelable: true }));
            return true;
        }

        function hideTheMenu() {
            const menuPanel = document.querySelector('[role="menu"]');
            if (menuPanel) {
                logToConsole("Menu panel found. Hiding it now.");
                menuPanel.style.visibility = 'hidden';
                menuPanel.style.opacity = '0';
            } else {
                logToConsole("Could not find menu panel to hide, but will proceed.");
            }
        }

        function clickTheAudioOption() {
            logToConsole("Phase 2: Looking for the 'Audio' or 'Listen' button...");
            let attempts = 0;
            const maxAttempts = 15;
            const audioInterval = setInterval(() => {
                attempts++;
                let audioButton = null;
                const possibleTexts = ['audio', 'listen', 'read aloud'];
                const potentialButtons = document.querySelectorAll('[role="menuitem"], [role="button"], button');

                for (const button of potentialButtons) {
                    const buttonText = button.textContent.trim().toLowerCase();
                    if (possibleTexts.some(text => buttonText.includes(text))) {
                        audioButton = button;
                        break;
                    }
                }

                if (audioButton) {
                    clearInterval(audioInterval);
                    logToConsole("Audio button found inside the menu. Clicking it...");
                    forceClick(audioButton);
                    hideTheMenu();
                    logToConsole("SUCCESS: TTS should be playing. Starting stop button display.");
                    showStopButton();
                    monitorAudioState();
                } else if (attempts >= maxAttempts) {
                    clearInterval(audioInterval);
                    logToConsole("FAILED in Phase 2: Could not find the audio button.", "error");
                    hideTheMenu();
                }
            }, 500);
        }

        function openTheMenu() {
            logToConsole("Phase 1: Looking for the menu button on the last response...");
            let attempts = 0;
            const maxAttempts = 20;
            const menuInterval = setInterval(() => {
                attempts++;
                const selectors = [
                    'button[aria-label="More actions"]',
                    'button[aria-haspopup="menu"]',
                    'button[id^="radix-"]',
                    'div[role="button"][aria-haspopup="menu"]'
                ];
                let menuButton = null;

                for (const selector of selectors) {
                    const buttons = document.querySelectorAll(selector);
                    if (buttons.length > 0) {
                        menuButton = buttons[buttons.length - 1];
                        break;
                    }
                }

                if (menuButton) {
                    clearInterval(menuInterval);
                    logToConsole("Menu button found. Clicking it to open the menu...");
                    if (forceClick(menuButton)) {
                        setTimeout(clickTheAudioOption, 500);
                    } else {
                        logToConsole("FAILED in Phase 1: Could not click the menu button.", "error");
                    }
                } else if (attempts >= maxAttempts) {
                    clearInterval(menuInterval);
                    logToConsole("FAILED in Phase 1: The 'More actions' menu button could not be found.", "error");
                }
            }, 500);
        }
        logToConsole("Starting the text-to-speech sequence...");
        openTheMenu();
    }


    // --- HELPER: Make Element Draggable ---
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let originalProps = {
            initialWidth: "",
            initialHeight: "",
            initialPadding: "",
            preDragTop: "",
            preDragLeft: "",
            collapsedSide: null
        };

        const computedStyle = getComputedStyle(element);
        originalProps.initialWidth = computedStyle.width;
        originalProps.initialHeight = computedStyle.height;
        originalProps.initialPadding = computedStyle.padding;

        element._dragMouseDownHandler = dragMouseDown;
        element.onmousedown = element._dragMouseDownHandler;

        function dragMouseDown(e) {
            if (e.target.closest("input, button, label")) return;
            e = e || window.event;
            e.preventDefault();
            originalProps.preDragTop = element.offsetTop + "px";
            originalProps.preDragLeft = element.offsetLeft + "px";
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.bottom = "auto";
            element.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            if (!isCollapsed) checkAndCollapse(element);
        }

        function checkAndCollapse(element) {
            const rect = element.getBoundingClientRect();
            const elWidth = parseFloat(originalProps.initialWidth);
            const elHeight = parseFloat(originalProps.initialHeight);
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            const offScreenLeft = rect.left < 0 ? -rect.left : 0;
            const offScreenRight = rect.left + elWidth > winWidth ? (rect.left + elWidth) - winWidth : 0;
            const offScreenTop = rect.top < 0 ? -rect.top : 0;
            const offScreenBottom = rect.top + elHeight > winHeight ? (rect.top + elHeight) - winHeight : 0;

            const halfWidth = elWidth / 2;
            const halfHeight = elHeight / 2;
            let collapseSide = null;

            if (offScreenLeft > halfWidth) collapseSide = "left";
            else if (offScreenRight > halfWidth) collapseSide = "right";
            else if (offScreenTop > halfHeight) collapseSide = "top";
            else if (offScreenBottom > halfHeight) collapseSide = "bottom";

            if (collapseSide) collapseSelector(element, collapseSide, rect);
        }

        function collapseSelector(element, side, currentRect) {
            if (isCollapsed) return;
            isCollapsed = true;
            logToConsole(`Collapsing to ${side}`);
            originalProps.collapsedSide = side;
            document.getElementById("autoSpeakContent").style.display = "none";
            document.getElementById("autoSpeakTab").style.display = "flex";
            element.style.width = COLLAPSED_WIDTH;
            element.style.height = COLLAPSED_HEIGHT;
            element.style.padding = "0";
            element.style.cursor = "pointer";

            let tabTop = Math.max(0, Math.min(currentRect.top, window.innerHeight - parseInt(COLLAPSED_HEIGHT)));
            let tabLeft = Math.max(0, Math.min(currentRect.left, window.innerWidth - parseInt(COLLAPSED_WIDTH)));

            switch (side) {
                case "left":
                    element.style.left = "0px";
                    element.style.top = tabTop + "px";
                    break;
                case "right":
                    element.style.left = (window.innerWidth - parseInt(COLLAPSED_WIDTH)) + "px";
                    element.style.top = tabTop + "px";
                    break;
                case "top":
                    element.style.top = "0px";
                    element.style.left = tabLeft + "px";
                    break;
                case "bottom":
                    element.style.top = (window.innerHeight - parseInt(COLLAPSED_HEIGHT)) + "px";
                    element.style.left = tabLeft + "px";
                    break;
            }
            element.style.bottom = "auto";
            element.style.right = "auto";
            element.onmousedown = null;
            document.getElementById("autoSpeakTab").onclick = () => expandSelector(element);
        }

        function expandSelector(element) {
            if (!isCollapsed) return;
            isCollapsed = false;
            logToConsole(`Expanding from ${originalProps.collapsedSide}`);
            document.getElementById("autoSpeakContent").style.display = "block";
            document.getElementById("autoSpeakTab").style.display = "none";
            element.style.width = originalProps.initialWidth;
            element.style.height = originalProps.initialHeight;
            element.style.padding = originalProps.initialPadding || "10px";
            element.style.cursor = "move";

            let newTop = parseFloat(originalProps.preDragTop) || 0;
            let newLeft = parseFloat(originalProps.preDragLeft) || 0;
            const restoredWidth = parseFloat(originalProps.initialWidth);
            const restoredHeight = parseFloat(originalProps.initialHeight);
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - restoredHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - restoredWidth));
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.bottom = "auto";
            element.style.right = "auto";

            document.getElementById("autoSpeakTab").onclick = null;
            element.onmousedown = element._dragMouseDownHandler;
        }
    }


    // --- UI: Create Auto Speak Panel ---
    function createAutoSpeakPanel() {
        if (document.getElementById('autoSpeakPanel')) return;

        const panelDiv = document.createElement('div');
        panelDiv.id = 'autoSpeakPanel';
        Object.assign(panelDiv.style, {
            position: 'fixed',
            bottom: '100px',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #4CAF50',
            padding: '12px',
            zIndex: '9999',
            fontFamily: 'sans-serif',
            fontSize: '13px',
            borderRadius: '8px',
            cursor: 'move',
            boxSizing: 'border-box',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });

        const styleEl = document.createElement('style');
        styleEl.textContent = `
            #autoSpeakPanel label { display: flex; align-items: center; margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; font-weight: 500; }
            #autoSpeakPanel label:hover { background-color: #f0f8f0; }
            #autoSpeakPanel label.enabled { background-color: #e8f5e8; border: 1px solid #4CAF50; padding: 3px; }
            #autoSpeakPanel input { margin-right: 8px; transform: scale(1.2); }
            #autoSpeakTab { width: 100%; height: 100%; font-weight: bold; cursor: pointer; align-items: center; justify-content: center; display: none; background-color: #4CAF50; color: white; border-radius: 4px; }
            #autoSpeakStopBtn { width: 100%; padding: 8px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; display: none; margin-top: 8px; }
            #autoSpeakStopBtn:hover { background-color: #d32f2f; }
        `;
        document.head.appendChild(styleEl);

        const contentDiv = document.createElement('div');
        contentDiv.id = 'autoSpeakContent';

        const titleStrong = document.createElement('strong');
        titleStrong.style.display = 'block';
        titleStrong.style.marginBottom = '8px';
        titleStrong.style.color = '#4CAF50';
        titleStrong.textContent = 'AUTO SPEAK';
        contentDiv.appendChild(titleStrong);

        const autoSpeakLabel = document.createElement('label');
        autoSpeakLabel.id = 'autoSpeakLabel';
        const autoSpeakCheckbox = document.createElement('input');
        autoSpeakCheckbox.type = 'checkbox';
        autoSpeakCheckbox.id = 'autoSpeakCheckbox';
        autoSpeakLabel.append(autoSpeakCheckbox, ' Automatically Read Aloud');
        contentDiv.appendChild(autoSpeakLabel);

        const stopButton = document.createElement('button');
        stopButton.id = 'autoSpeakStopBtn';
        stopButton.textContent = 'Stop Speech';
        contentDiv.appendChild(stopButton);

        panelDiv.appendChild(contentDiv);

        const tabDiv = document.createElement('div');
        tabDiv.id = 'autoSpeakTab';
        tabDiv.innerText = COLLAPSED_TEXT;
        panelDiv.appendChild(tabDiv);

        document.body.appendChild(panelDiv);

        // Event listeners
        autoSpeakCheckbox.addEventListener('change', (event) => {
            autoSpeakEnabled = event.target.checked;
            autoSpeakLabel.classList.toggle('enabled', autoSpeakEnabled);
            logToConsole(`Auto Speak ${autoSpeakEnabled ? 'enabled' : 'disabled'}`);
            if (!autoSpeakEnabled) {
                hideStopButton();
            }
        });

        stopButton.addEventListener('click', () => {
            logToConsole("Stop button clicked");
            if (typeof window.forceStopAllTtsAudio === 'function') {
                window.forceStopAllTtsAudio();
            }
        });

        makeDraggable(panelDiv);
        logToConsole("Auto Speak panel created");
    }

    // --- CORE LOGIC: Check Button States ---
    function checkButtonStates() {
        const sendButton = document.querySelector("[aria-label='Send message'], [data-testid='send-button']");
        const stopButton = document.querySelector("[aria-label='Stop generating'], [aria-label='Stop streaming']");
        let currentButtonState = null;

        // Determine current state
        if (stopButton && getComputedStyle(stopButton).display !== 'none') {
            currentButtonState = "Stop Generating";
        } else if (sendButton && !sendButton.disabled) {
            currentButtonState = "Send Prompt";
        } else {
            currentButtonState = "Idle/Input Disabled";
        }

        // Check for transition from busy to ready to trigger auto-speak
        if (lastDetectedButtonState === "Stop Generating" && currentButtonState !== "Stop Generating") {
            logToConsole("Response complete - triggering auto-speak");
            setTimeout(() => {
                triggerAutoSpeak();
            }, 1000); // Delay to allow final DOM updates
        }

        // Log state changes
        if (currentButtonState && currentButtonState !== lastDetectedButtonState) {
            logToConsole(`Button state: "${lastDetectedButtonState || '(initial)'}" -> "${currentButtonState}"`);
        }

        // Update the last detected state
        lastDetectedButtonState = currentButtonState;
    }

    // --- INITIALIZATION ---
    logToConsole("Initializing AUTO SPEAK...");
    createAutoSpeakPanel();
    setInterval(checkButtonStates, 500);
    setTimeout(checkButtonStates, 200); // Initial check
    logToConsole("AUTO SPEAK active. Waiting for responses...");

})();