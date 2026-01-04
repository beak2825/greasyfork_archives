// ==UserScript==
// @name         WTR-Lab Auto Scroller
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Adds dual-mode auto-scrolling (Constant Speed or Dynamic WPM) to the WTR-Lab reader for a hands-free reading experience.
// @author       MasuRii
// @match        https://wtr-lab.com/en/novel/*/*/chapter-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/552121/WTR-Lab%20Auto%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/552121/WTR-Lab%20Auto%20Scroller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---
    const STORAGE_KEY = 'wtrLabAutoScrollSettings_v3.8';
    const LOGGING_STORAGE_KEY = 'wtrLabAutoScrollSettings_loggingEnabled_v3.8';
    const HIGHLIGHT_CLASS = 'wtr-lab-as-highlight';
    const CHAPTER_BODY_SELECTOR = '.chapter-tracker.active .chapter-body';
    const MIN_READING_TIME_MS = 750;
    const USER_SCROLL_PAUSE_DURATION = 2500; // Time in ms to wait after user scroll before resuming

    const DEFAULT_SETTINGS = {
        speed: 1.00,
        wpm: 230,
        mode: 'constant',
        isAutoScrollEnabled: false,
        highlightingEnabled: true
    };

    // --- State Variables ---
    let settings;
    let playButton = null;
    let currentlyHighlightedParagraph = null;
    let loggingEnabled = GM_getValue(LOGGING_STORAGE_KEY, false);
    const constantScrollState = {
        intervalId: null,
        isPausedByUser: false,
        userScrollPauseTimeout: null
    };
    const dynamicScrollState = {
        isRunning: false,
        isPausedByUser: false,
        userScrollPauseTimeout: null,
        currentParagraphIndex: 0,
        startIndex: 0,
        animationFrameId: null,
        stopRequested: false,
        allParagraphs: [],
        animation: {
            startTime: null,
            startPosition: 0,
            targetPosition: 0,
            duration: 0,
            onComplete: null,
            timeElapsedBeforePause: 0
        }
    };
    let wakeLockSentinel = null;
    let lastUrl = window.location.href;

    // --- Tampermonkey Menu Commands ---
    function toggleLogging() {
        loggingEnabled = !loggingEnabled;
        GM_setValue(LOGGING_STORAGE_KEY, loggingEnabled);
        alert(`Debug logging is now ${loggingEnabled ? 'ENABLED' : 'DISABLED'}.`);
    }
    GM_registerMenuCommand('Toggle Debug Logging', toggleLogging);

    // --- Initialization & Settings ---
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        settings = { ...DEFAULT_SETTINGS, ...saved };
    } catch (e) {
        settings = { ...DEFAULT_SETTINGS };
    }

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function log(message, ...args) {
        if (loggingEnabled) {
            console.log(`[AutoScroller] ${message}`, ...args);
        }
    }

    // --- UI Management ---
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
        /* --- Highlight Style --- */
        .${HIGHLIGHT_CLASS} {
            background-color: rgba(255, 255, 0, 0.15);
            border-left: 3px solid var(--bs-primary, #fd7e14);
            border-radius: 4px;
            padding-left: 10px !important;
            margin-left: -13px !important;
            transition: background-color 0.3s, border-left 0.3s;
        }
        body.dark-mode .${HIGHLIGHT_CLASS} {
            background-color: rgba(255, 255, 255, 0.1) !important;
        }

        /* --- UI Control Styles --- */
        #auto-scroll-speed-group, #auto-scroll-wpm-group {
            flex-wrap: nowrap !important; /* Prevents wrapping inside the input groups */
            width: auto !important;      /* CRITICAL FIX: Overrides the site's 100% width rule */
        }
        .wtr-as-switch {
            font-size: 0.8rem;
            color: var(--bs-secondary-color);
            white-space: nowrap;
        }
        .wtr-as-switch .form-check-label {
            line-height: 1.1;
            text-align: center;
        }
        .wtr-as-switch.disabled-custom {
            opacity: 0.5;
            pointer-events: none;
        }
        .wtr-as-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        .wtr-as-input-wrapper .form-control {
            padding-right: 48px !important;
        }
        .wtr-as-input-label {
            position: absolute;
            right: 10px;
            pointer-events: none;
            color: var(--bs-secondary-color);
            font-size: 0.9em;
        }
    `;
        document.head.appendChild(style);
    }

    function updatePlayButtonUI(isPlaying) {
        if (!playButton) return;
        if (isPlaying) {
            playButton.textContent = 'Stop';
            playButton.classList.remove('btn-outline-secondary');
            playButton.classList.add('btn-danger');
        } else {
            playButton.textContent = 'Play';
            playButton.classList.remove('btn-danger');
            playButton.classList.add('btn-outline-secondary');
        }
    }

    // --- Wake Lock ---
    async function requestWakeLock() {
        if ('wakeLock' in navigator && wakeLockSentinel === null) {
            try {
                wakeLockSentinel = await navigator.wakeLock.request('screen');
                wakeLockSentinel.addEventListener('release', () => { wakeLockSentinel = null; });
            } catch (err) { console.error(`Wake Lock Error: ${err.name}, ${err.message}`); }
        }
    }

    async function releaseWakeLock() {
        if (wakeLockSentinel !== null) {
            await wakeLockSentinel.release();
            wakeLockSentinel = null;
        }
    }

    // --- CORE SCROLLING LOGIC (ROUTERS) ---
    function startScrolling() {
        if (!playButton || !document.body.contains(playButton)) {
            playButton = document.getElementById('wtr-as-play-stop-btn');
        }
        if (!playButton) {
            log('Play button not yet initialized. Retrying in 500ms.');
            setTimeout(startScrolling, 500);
            return;
        }
        if (!document.querySelector(CHAPTER_BODY_SELECTOR)) {
            log('Chapter body not yet loaded. Retrying in 500ms.');
            setTimeout(startScrolling, 500);
            return;
        }
        if (settings.mode === 'dynamic') {
            startDynamicScrolling();
        } else {
            startConstantScrolling();
        }
    }

    function stopScrolling(userInitiated = false) {
        // Hard stop for constant scroll
        constantScrollState.isPausedByUser = false;
        if (constantScrollState.userScrollPauseTimeout) {
            clearTimeout(constantScrollState.userScrollPauseTimeout);
            constantScrollState.userScrollPauseTimeout = null;
        }
        stopConstantScrolling();

        // Hard stop for dynamic scroll
        stopDynamicScrolling();

        releaseWakeLock();
        updatePlayButtonUI(false);
        if (userInitiated && settings.isAutoScrollEnabled) {
            settings.isAutoScrollEnabled = false;
            saveSettings();
        }
        log('Auto-Scroll Stopped.');
    }

    // --- DYNAMIC (WPM) SCROLLING ENGINE ---

    function findCurrentParagraphIndex() {
        if (!dynamicScrollState.allParagraphs || dynamicScrollState.allParagraphs.length === 0) {
            return 0;
        }
        for (let i = 0; i < dynamicScrollState.allParagraphs.length; i++) {
            const rect = dynamicScrollState.allParagraphs[i].getBoundingClientRect();
            if (rect.bottom > 0) {
                return i;
            }
        }
        return dynamicScrollState.allParagraphs.length - 1;
    }

    function resumeDynamicScrolling() {
        if (!dynamicScrollState.isRunning || dynamicScrollState.stopRequested) {
            log('Resume dynamic scroll aborted, scrolling was stopped by other means.');
            return;
        }
        log('Resuming dynamic scroll after user interaction.');
        dynamicScrollState.isPausedByUser = false;
        dynamicScrollState.userScrollPauseTimeout = null;
        dynamicScrollState.currentParagraphIndex = findCurrentParagraphIndex();
        log(`Resuming from new paragraph index: ${dynamicScrollState.currentParagraphIndex}`);
        processNextParagraph();
    }

    function runAnimationLoop(currentTime) {
        if (dynamicScrollState.stopRequested || dynamicScrollState.isPausedByUser) return;

        const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5;
        if (atBottom) {
            log('Dynamic WPM: Reached end of scrollable area. Stopping.');
            stopScrolling(false);
            return;
        }

        const anim = dynamicScrollState.animation;
        if (anim.startTime === null) {
            anim.startTime = currentTime - anim.timeElapsedBeforePause;
        }

        const timeElapsed = currentTime - anim.startTime;
        const t = Math.min(timeElapsed / anim.duration, 1);
        const easedT = t;
        const distance = anim.targetPosition - anim.startPosition;

        window.scrollTo(0, anim.startPosition + distance * easedT);

        if (timeElapsed < anim.duration) {
            dynamicScrollState.animationFrameId = requestAnimationFrame(runAnimationLoop);
        } else {
            anim.startTime = null;
            anim.timeElapsedBeforePause = 0;
            if (anim.onComplete) {
                anim.onComplete();
            }
        }
    }

    function smoothScrollTo(targetPosition, duration, onComplete) {
        Object.assign(dynamicScrollState.animation, {
            startTime: null,
            startPosition: window.scrollY,
            targetPosition: targetPosition,
            duration: duration,
            onComplete: onComplete,
            timeElapsedBeforePause: 0
        });
        dynamicScrollState.animationFrameId = requestAnimationFrame(runAnimationLoop);
    }

    function processNextParagraph() {
        if (dynamicScrollState.stopRequested || dynamicScrollState.isPausedByUser) {
            return;
        }
        if (dynamicScrollState.currentParagraphIndex >= dynamicScrollState.allParagraphs.length) {
            stopDynamicScrolling();
            if (dynamicScrollState.currentParagraphIndex >= dynamicScrollState.allParagraphs.length) {
                releaseWakeLock();
                updatePlayButtonUI(false);
            }
            return;
        }
        if (settings.highlightingEnabled && currentlyHighlightedParagraph) {
            currentlyHighlightedParagraph.classList.remove(HIGHLIGHT_CLASS);
        }
        const p = dynamicScrollState.allParagraphs[dynamicScrollState.currentParagraphIndex];
        const text = p.textContent.trim();
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        if (settings.highlightingEnabled) {
            p.classList.add(HIGHLIGHT_CLASS);
            currentlyHighlightedParagraph = p;
        }
        if (wordCount === 0) {
            dynamicScrollState.currentParagraphIndex++;
            setTimeout(processNextParagraph, 0);
            return;
        }

        let readingTimeMs = Math.max(MIN_READING_TIME_MS, (wordCount / settings.wpm) * 60 * 1000);
        const viewportTopOffset = window.innerHeight * 0.2;
        const rect = p.getBoundingClientRect();
        const absBottom = rect.bottom + window.scrollY;
        const targetY = absBottom - viewportTopOffset;

        if (targetY <= window.scrollY + 5) {
            log(`Skipping paragraph ${dynamicScrollState.currentParagraphIndex} (already passed).`);
            dynamicScrollState.currentParagraphIndex++;
            setTimeout(processNextParagraph, 0);
            return;
        }

        const isPartial = dynamicScrollState.currentParagraphIndex === dynamicScrollState.startIndex && window.scrollY > (rect.top + window.scrollY - viewportTopOffset);
        if (isPartial) {
            const fullHeight = rect.height;
            const remainingDistance = targetY - window.scrollY;
            const fractionRemaining = remainingDistance / fullHeight;
            readingTimeMs = Math.max(MIN_READING_TIME_MS, readingTimeMs * fractionRemaining);
            log(`Partial paragraph: fraction remaining ${fractionRemaining.toFixed(2)}, adjusted time ${readingTimeMs.toFixed(0)}ms.`);
        }

        log(`Scrolling through paragraph ${dynamicScrollState.currentParagraphIndex} (${wordCount} words) over ${readingTimeMs.toFixed(0)}ms.`);
        smoothScrollTo(targetY, readingTimeMs, () => {
            dynamicScrollState.currentParagraphIndex++;
            processNextParagraph();
        });
    }

    function startDynamicScrolling() {
        if (dynamicScrollState.isRunning) return;
        log('Starting Dynamic (WPM) Scroll at', settings.wpm, 'WPM.');
        const chapterBody = document.querySelector(CHAPTER_BODY_SELECTOR);
        if (!chapterBody) { log('Dynamic Scroll: Chapter body not found.'); return; }
        dynamicScrollState.isRunning = true;
        dynamicScrollState.stopRequested = false;
        dynamicScrollState.isPausedByUser = false;
        dynamicScrollState.allParagraphs = Array.from(chapterBody.querySelectorAll('p'));
        if (dynamicScrollState.allParagraphs.length === 0) {
            log('Dynamic Scroll: No paragraphs found.');
            stopDynamicScrolling();
            return;
        }
        const startIndex = findCurrentParagraphIndex();
        dynamicScrollState.startIndex = startIndex;
        dynamicScrollState.currentParagraphIndex = startIndex;
        log(`Starting from paragraph index: ${startIndex}`);
        updatePlayButtonUI(true);
        requestWakeLock();
        processNextParagraph();
    }

    function stopDynamicScrolling() {
        if (!dynamicScrollState.isRunning) return;
        dynamicScrollState.stopRequested = true;
        dynamicScrollState.isPausedByUser = false;
        if (dynamicScrollState.userScrollPauseTimeout) {
            clearTimeout(dynamicScrollState.userScrollPauseTimeout);
            dynamicScrollState.userScrollPauseTimeout = null;
        }
        if (dynamicScrollState.animationFrameId) {
            cancelAnimationFrame(dynamicScrollState.animationFrameId);
        }
        if (settings.highlightingEnabled && currentlyHighlightedParagraph) {
            currentlyHighlightedParagraph.classList.remove(HIGHLIGHT_CLASS);
            currentlyHighlightedParagraph = null;
        }
        dynamicScrollState.isRunning = false;
        dynamicScrollState.animationFrameId = null;
    }

    // --- CONSTANT (PIXEL) SCROLLING ENGINE ---
    function resumeConstantScrolling() {
        if (!settings.isAutoScrollEnabled) {
            log('Resume constant scroll aborted, scrolling was stopped by user.');
            return;
        }
        log('Resuming constant scroll after user interaction.');
        constantScrollState.isPausedByUser = false;
        constantScrollState.userScrollPauseTimeout = null;
        startConstantScrolling();
    }

    function startConstantScrolling() {
        if (constantScrollState.intervalId !== null) return;
        log('Starting Constant Scroll at speed multiplier:', settings.speed);
        updatePlayButtonUI(true);
        requestWakeLock();
        constantScrollState.isPausedByUser = false;
        const basePixelsPerSecond = 50;
        const pixelsPerSecond = basePixelsPerSecond * settings.speed;
        const scrollDelay = Math.floor(1000 / pixelsPerSecond);
        constantScrollState.intervalId = setInterval(() => {
            const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5;
            if (atBottom) {
                stopConstantScrolling();
                releaseWakeLock();
                updatePlayButtonUI(false);
                return;
            }
            window.scrollBy(0, 1);
        }, scrollDelay);
    }

    function stopConstantScrolling() {
        if (constantScrollState.intervalId === null) return;
        clearInterval(constantScrollState.intervalId);
        constantScrollState.intervalId = null;
    }

    // --- Event Handlers ---
    function handleUserInteraction() {
        // Handle dynamic scrolling interruption (pause and resume logic)
        if (dynamicScrollState.isRunning && !dynamicScrollState.isPausedByUser) {
            log('User interaction detected during dynamic scroll. Pausing.');
            dynamicScrollState.isPausedByUser = true;

            if (dynamicScrollState.animationFrameId) {
                cancelAnimationFrame(dynamicScrollState.animationFrameId);
                dynamicScrollState.animationFrameId = null;
            }

            if (dynamicScrollState.userScrollPauseTimeout) {
                clearTimeout(dynamicScrollState.userScrollPauseTimeout);
            }
            dynamicScrollState.userScrollPauseTimeout = setTimeout(resumeDynamicScrolling, USER_SCROLL_PAUSE_DURATION);
            return;
        }

        // Handle constant scrolling interruption (pause and resume logic)
        if (constantScrollState.intervalId !== null && !constantScrollState.isPausedByUser) {
            log('User interaction detected during constant scroll. Pausing.');
            constantScrollState.isPausedByUser = true;
            stopConstantScrolling(); // Pauses the interval

            if (constantScrollState.userScrollPauseTimeout) {
                clearTimeout(constantScrollState.userScrollPauseTimeout);
            }
            constantScrollState.userScrollPauseTimeout = setTimeout(resumeConstantScrolling, USER_SCROLL_PAUSE_DURATION);
        }
    }

    function handlePageNavigation() {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            log('New page detected by URL change.');
            stopScrolling();
            playButton = null;
            if (settings.isAutoScrollEnabled) {
                setTimeout(startScrolling, 20000);
            }
        }
    }

    async function handleVisibilityChange() {
        const isDynamicScrolling = dynamicScrollState.isRunning;

        if (document.visibilityState === 'hidden') {
            window.removeEventListener('wheel', handleUserInteraction, { passive: true });
            window.removeEventListener('touchstart', handleUserInteraction, { passive: true });
            log('User interaction listeners temporarily removed.');

            if (isDynamicScrolling && dynamicScrollState.animationFrameId) {
                cancelAnimationFrame(dynamicScrollState.animationFrameId);
                dynamicScrollState.animationFrameId = null;
                if (dynamicScrollState.animation.startTime) {
                    dynamicScrollState.animation.timeElapsedBeforePause = performance.now() - dynamicScrollState.animation.startTime;
                }
                log('Dynamic scroll animation paused.');
            }
        } else if (document.visibilityState === 'visible') {
            window.addEventListener('wheel', handleUserInteraction, { passive: true });
            window.addEventListener('touchstart', handleUserInteraction, { passive: true });
            log('User interaction listeners re-attached.');

            const isScrolling = constantScrollState.intervalId !== null || dynamicScrollState.isRunning;
            if (isScrolling) {
                await requestWakeLock();
            }

            if (isDynamicScrolling && dynamicScrollState.animation.timeElapsedBeforePause > 0) {
                log(`Dynamic scroll resuming from ${Math.round(dynamicScrollState.animation.timeElapsedBeforePause)}ms pause.`);
                dynamicScrollState.animationFrameId = requestAnimationFrame(runAnimationLoop);
            }
        }
    }

    // --- UI CREATION ---
    function setupAutoReadControls() {
        if (document.getElementById('auto-read-controls-wrapper')) return;
        let readerTypeButtonGroup = null;
        const allSpans = document.querySelectorAll('.display-config span.config');
        for (const span of allSpans) {
            if (span.textContent.trim() === 'Reader Type') {
                readerTypeButtonGroup = span.nextElementSibling;
                break;
            }
        }
        if (!readerTypeButtonGroup) return;

        const mainLabel = document.createElement('span');
        mainLabel.className = 'config';
        mainLabel.textContent = 'Auto-Scroll Controls';

        const wrapper = document.createElement('div');
        wrapper.id = 'auto-read-controls-wrapper';
        wrapper.className = 'd-flex align-items-center gap-3 mb-1';

        // --- Element 1: Play/Stop Button ---
        playButton = document.createElement('button');
        playButton.id = 'wtr-as-play-stop-btn';
        playButton.type = 'button';
        playButton.className = 'btn btn-sm';
        playButton.title = 'Play/Stop Auto-Scroll';

        // --- Element 2: Speed/WPM Controls ---
        const speedGroup = document.createElement('div');
        speedGroup.id = 'auto-scroll-speed-group';
        speedGroup.className = 'input-group input-group-sm';
        const speedMinus = document.createElement('button');
        speedMinus.type = 'button';
        speedMinus.className = 'btn btn-outline-secondary';
        speedMinus.textContent = '-';
        const speedInputWrapper = document.createElement('div');
        speedInputWrapper.className = 'wtr-as-input-wrapper';
        const speedInput = document.createElement('input');
        speedInput.type = 'number';
        speedInput.className = 'form-control text-center';
        speedInput.step = '0.05';
        speedInput.min = '0.1';
        speedInput.title = 'Speed Multiplier';
        speedInput.style.cssText = 'background-color: transparent; color: inherit; min-width: 90px;';
        speedInput.value = parseFloat(settings.speed).toFixed(2);
        const speedLabel = document.createElement('span');
        speedLabel.className = 'wtr-as-input-label';
        speedLabel.textContent = 'SPD';
        speedInputWrapper.append(speedInput, speedLabel);
        const speedPlus = document.createElement('button');
        speedPlus.type = 'button';
        speedPlus.className = 'btn btn-outline-secondary';
        speedPlus.textContent = '+';
        speedGroup.append(speedMinus, speedInputWrapper, speedPlus);

        const wpmGroup = document.createElement('div');
        wpmGroup.id = 'auto-scroll-wpm-group';
        wpmGroup.className = 'input-group input-group-sm';
        const wpmMinus = document.createElement('button');
        wpmMinus.type = 'button';
        wpmMinus.className = 'btn btn-outline-secondary';
        wpmMinus.textContent = '-';
        const wpmInputWrapper = document.createElement('div');
        wpmInputWrapper.className = 'wtr-as-input-wrapper';
        const wpmInput = document.createElement('input');
        wpmInput.type = 'number';
        wpmInput.className = 'form-control text-center';
        wpmInput.step = '5';
        wpmInput.min = '50';
        wpmInput.title = 'Words Per Minute (WPM)';
        wpmInput.style.cssText = 'background-color: transparent; color: inherit; min-width: 90px;';
        wpmInput.value = settings.wpm;
        const wpmLabel = document.createElement('span');
        wpmLabel.className = 'wtr-as-input-label';
        wpmLabel.textContent = 'WPM';
        wpmInputWrapper.append(wpmInput, wpmLabel);
        const wpmPlus = document.createElement('button');
        wpmPlus.type = 'button';
        wpmPlus.className = 'btn btn-outline-secondary';
        wpmPlus.textContent = '+';
        wpmGroup.append(wpmMinus, wpmInputWrapper, wpmPlus);

        // --- Element 3: Paragraph Highlighting Switch ---
        const highlightSwitchWrapper = document.createElement('div');
        highlightSwitchWrapper.className = 'form-check form-switch d-flex align-items-center wtr-as-switch';
        highlightSwitchWrapper.title = 'Toggle paragraph highlighting';
        const highlightSwitchInput = document.createElement('input');
        highlightSwitchInput.type = 'checkbox';
        highlightSwitchInput.className = 'form-check-input';
        highlightSwitchInput.id = 'highlight-toggle-switch';
        highlightSwitchInput.role = 'switch';
        highlightSwitchInput.checked = settings.highlightingEnabled;
        const highlightSwitchLabel = document.createElement('label');
        highlightSwitchLabel.className = 'form-check-label ms-1';
        highlightSwitchLabel.htmlFor = 'highlight-toggle-switch';
        highlightSwitchLabel.innerHTML = 'Highlight<br>Para.';
        highlightSwitchWrapper.append(highlightSwitchInput, highlightSwitchLabel);

        // --- Element 4: Constant/Dynamic Mode Selector ---
        const modeGroup = document.createElement('div');
        modeGroup.className = 'btn-group btn-group-sm';
        modeGroup.role = 'group';
        const constantModeBtn = document.createElement('button');
        constantModeBtn.type = 'button';
        constantModeBtn.className = 'btn';
        constantModeBtn.textContent = 'Constant';
        const dynamicModeBtn = document.createElement('button');
        dynamicModeBtn.type = 'button';
        dynamicModeBtn.className = 'btn';
        dynamicModeBtn.textContent = 'Dynamic';
        modeGroup.append(constantModeBtn, dynamicModeBtn);

        // --- Logic for showing/hiding elements ---
        function updateControlsVisibility() {
            const isConstant = settings.mode === 'constant';
            speedGroup.style.display = isConstant ? 'flex' : 'none';
            wpmGroup.style.display = isConstant ? 'none' : 'flex';
            highlightSwitchWrapper.style.display = isConstant ? 'none' : 'flex';
            highlightSwitchInput.disabled = isConstant;
            highlightSwitchWrapper.classList.toggle('disabled-custom', isConstant);
            constantModeBtn.classList.toggle('btn-primary', isConstant);
            constantModeBtn.classList.toggle('btn-outline-secondary', !isConstant);
            dynamicModeBtn.classList.toggle('btn-primary', !isConstant);
            dynamicModeBtn.classList.toggle('btn-outline-secondary', isConstant);
        }

        // --- Event Listeners ---
        function switchMode(newMode) {
            if (settings.mode === newMode) return;
            const wasPlaying = constantScrollState.intervalId !== null || dynamicScrollState.isRunning;
            if (wasPlaying) stopScrolling();
            settings.mode = newMode;
            saveSettings();
            updateControlsVisibility();
            if (wasPlaying) startScrolling();
        }
        constantModeBtn.addEventListener('click', () => switchMode('constant'));
        dynamicModeBtn.addEventListener('click', () => switchMode('dynamic'));
        playButton.addEventListener('click', () => {
            settings.isAutoScrollEnabled = !settings.isAutoScrollEnabled;
            saveSettings();
            if (settings.isAutoScrollEnabled) {
                startScrolling();
            } else {
                stopScrolling(true);
            }
        });
        highlightSwitchInput.addEventListener('change', () => {
            settings.highlightingEnabled = highlightSwitchInput.checked;
            saveSettings();
            if (!settings.highlightingEnabled && currentlyHighlightedParagraph) {
                currentlyHighlightedParagraph.classList.remove(HIGHLIGHT_CLASS);
                currentlyHighlightedParagraph = null;
            }
        });
        speedPlus.addEventListener('click', () => {
            speedInput.value = (parseFloat(speedInput.value) + 0.05).toFixed(2);
            settings.speed = parseFloat(speedInput.value);
            saveSettings();
            if (constantScrollState.intervalId) { stopConstantScrolling(); startConstantScrolling(); }
        });
        speedMinus.addEventListener('click', () => {
            speedInput.value = Math.max(0.1, parseFloat(speedInput.value) - 0.05).toFixed(2);
            settings.speed = parseFloat(speedInput.value);
            saveSettings();
            if (constantScrollState.intervalId) { stopConstantScrolling(); startConstantScrolling(); }
        });
        wpmPlus.addEventListener('click', () => {
            wpmInput.value = parseInt(wpmInput.value, 10) + 5;
            settings.wpm = parseInt(wpmInput.value, 10);
            saveSettings();
        });
        wpmMinus.addEventListener('click', () => {
            wpmInput.value = Math.max(50, parseInt(wpmInput.value, 10) - 5);
            settings.wpm = parseInt(wpmInput.value, 10);
            saveSettings();
        });

        // --- Assemble and Inject UI ---
        wrapper.append(playButton, speedGroup, wpmGroup, highlightSwitchWrapper, modeGroup);
        readerTypeButtonGroup.after(mainLabel, wrapper);
        updatePlayButtonUI(false);
        updateControlsVisibility();
        if (settings.isAutoScrollEnabled) {
            startScrolling();
        }
        log('Auto-Scroll controls added successfully.');
    }

    // --- Observers and Initializers ---
    injectStyles();
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    setInterval(handlePageNavigation, 500);
    const observer = new MutationObserver(() => {
        if (!document.getElementById('auto-read-controls-wrapper') && document.querySelector('.display-config')) {
            setupAutoReadControls();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();