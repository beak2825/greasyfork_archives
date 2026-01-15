// ==UserScript==
// @name         Movix & Cinepulse ads block
// @namespace    http://violentmonkey.github.io/
// @version      2.3
// @description  Ad bypass, voice enhancement, and popup blocking for Cinepulse and Movix
// @icon         https://cdn-icons-png.flaticon.com/512/15239/15239638.png
// @author       moony
// @match        https://cinepulse.cc/*
// @match        *://*.movix.club/*
// @match        *://*.movix.blog/*
// @run-at       document-start
// @allFrames    true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562536/Movix%20%20Cinepulse%20ads%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/562536/Movix%20%20Cinepulse%20ads%20block.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ALLOWED = ['movix.club', 'movix.blog', 'cinepulse.cc'];
    const isAllowed = url => !url || ALLOWED.some(d => url.includes(d));

    console.log('%c[SUITE] v2.3 loaded', 'color: cyan; font-weight: bold');

    // === BLOCK POPUPS ===
    const originalOpen = window.open;
    window.open = function (url) {
        if (isAllowed(url)) return originalOpen.apply(window, arguments);
        console.log('%c[SUITE] Popup blocked: ' + url, 'color: orange');
        return null;
    };

    // === VIP SPOOF ===
    function spoofVIP() {
        const vipKeys = [
            'is_vip', 'isVip', 'vip', 'VIP', 'isPremium', 'is_premium',
            'premium', 'hasWatchedAd', 'has_watched_ad', 'adWatched',
            'ad_watched', 'canWatch', 'can_watch', 'adFree', 'ad_free'
        ];
        vipKeys.forEach(key => {
            try {
                localStorage.setItem(key, 'true');
                sessionStorage.setItem(key, 'true');
            } catch (e) {}
        });
        window.adPopupBypass = true;
        window.adPopupTriggered = true;
        window.isVip = true;
        window.adFree = true;
    }

    spoofVIP();
    setInterval(spoofVIP, 200);

    // === REMOVE EXTERNAL IFRAMES ===
    const iframeObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.tagName === "IFRAME" && node.src && !isAllowed(node.src)) {
                    console.log('%c[SUITE] Iframe removed: ' + node.src, 'color: orange');
                    node.remove();
                }
            }
        }
    });

    // === AUTO-CLICK AD DIALOGS ONLY ===
    let clickCount = 0;

    function autoClickAdDialog() {
        const dialog = document.querySelector('[role="dialog"]');
        if (!dialog) return;

        const buttons = Array.from(dialog.querySelectorAll('button'));

        // Priority 1: "Lecture" button (final step)
        const lectureBtn = buttons.find(btn => {
            const text = btn.textContent?.trim().toLowerCase() || '';
            const hasPlayIcon = btn.querySelector('svg.lucide-play');
            return (text === 'lecture' || (text.includes('lecture') && hasPlayIcon)) &&
                   !text.includes('publicité');
        });

        if (lectureBtn && !lectureBtn._suiteClicked) {
            lectureBtn._suiteClicked = true;
            clickCount++;
            console.log('%c[SUITE] Auto-click #' + clickCount + ': Lecture ✓', 'color: lime; font-weight: bold');
            lectureBtn.click();
            return true;
        }

        // Priority 2: "Voir une publicité" button
        const adBtn = buttons.find(btn => {
            const text = btn.textContent?.toLowerCase() || '';
            const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
            return text.includes('voir une publicité') || ariaLabel.includes('publicité');
        });

        if (adBtn && !adBtn._suiteClicked) {
            adBtn._suiteClicked = true;
            clickCount++;
            console.log('%c[SUITE] Auto-click #' + clickCount + ': Voir une publicité (popup will be blocked)', 'color: yellow');
            adBtn.click();

            // Check for Lecture button after click
            for (let delay of [100, 200, 400, 600, 800, 1000, 1500]) {
                setTimeout(autoClickAdDialog, delay);
            }
            return true;
        }

        return false;
    }

    // === VOICE ENHANCER MODULE ===
    let audioContext, highPassFilter, peakingFilter1, peakingFilter2, compressor;
    let isEnhancementActive = false;
    const sourceNodeMap = new WeakMap();
    let boostButton, hideTimeout;

    function setupAudioGraph(videoElement) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        let sourceNode = sourceNodeMap.get(videoElement);
        if (!sourceNode) {
            try {
                sourceNode = audioContext.createMediaElementSource(videoElement);
                sourceNodeMap.set(videoElement, sourceNode);
            } catch (e) { return; }
        }
        if (!highPassFilter) {
            highPassFilter = audioContext.createBiquadFilter();
            highPassFilter.type = 'highpass';
            highPassFilter.frequency.value = 100;

            peakingFilter1 = audioContext.createBiquadFilter();
            peakingFilter1.type = 'peaking';
            peakingFilter1.frequency.value = 1500;
            peakingFilter1.Q.value = 1.5;
            peakingFilter1.gain.value = 6;

            peakingFilter2 = audioContext.createBiquadFilter();
            peakingFilter2.type = 'peaking';
            peakingFilter2.frequency.value = 3000;
            peakingFilter2.Q.value = 1.5;
            peakingFilter2.gain.value = 4;

            compressor = audioContext.createDynamicsCompressor();
            compressor.threshold.value = -20;
            compressor.knee.value = 20;
            compressor.ratio.value = 4;
            compressor.attack.value = 0.05;
            compressor.release.value = 0.25;
        }
        sourceNode.disconnect();
        sourceNode.connect(highPassFilter);
        highPassFilter.connect(peakingFilter1);
        peakingFilter1.connect(peakingFilter2);
        peakingFilter2.connect(compressor);
        compressor.connect(audioContext.destination);
        isEnhancementActive = true;
        updateButtonState();
        console.log('%c[SUITE] Voice boost ON', 'color: lime');
    }

    function disableAudioGraph(videoElement) {
        const sourceNode = sourceNodeMap.get(videoElement);
        if (sourceNode && audioContext) {
            sourceNode.disconnect();
            sourceNode.connect(audioContext.destination);
            isEnhancementActive = false;
            updateButtonState();
            console.log('%c[SUITE] Voice boost OFF', 'color: orange');
        }
    }

    function updateButtonState() {
        if (!boostButton) return;
        const color = isEnhancementActive ? '#4CAF50' : 'white';
        boostButton.style.borderColor = color;
        boostButton.style.color = color;
        if (boostButton._voiceSpan) boostButton._voiceSpan.style.color = color;
        if (boostButton._boostSpan) boostButton._boostSpan.style.color = color;
    }

    function createToggleButton() {
        const video = document.querySelector('video');
        if (!video || document.getElementById('voice-boost-button')) return;

        boostButton = document.createElement('button');
        boostButton.id = 'voice-boost-button';
        Object.assign(boostButton.style, {
            border: '2px solid white', borderRadius: '5px', padding: '2px 4px',
            width: '48px', height: '38px', fontFamily: 'sans-serif', fontSize: '11px',
            fontWeight: 'bold', color: 'white', backgroundColor: 'transparent',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.4s',
            marginLeft: '4px', zIndex: '9999'
        });

        const voiceSpan = document.createElement('span');
        voiceSpan.textContent = 'VOICE';
        const boostSpan = document.createElement('span');
        boostSpan.textContent = 'BOOST';
        boostButton._voiceSpan = voiceSpan;
        boostButton._boostSpan = boostSpan;
        boostButton.append(voiceSpan, boostSpan);

        boostButton.addEventListener('click', e => {
            e.stopPropagation();
            const vid = document.querySelector('video');
            if (vid) isEnhancementActive ? disableAudioGraph(vid) : setupAudioGraph(vid);
        });

        const controlBar = document.querySelector('.flex.items-center.gap-1.md\\:gap-2');
        if (controlBar) {
            controlBar.appendChild(boostButton);
        } else {
            Object.assign(boostButton.style, { position: 'fixed', top: '70px', right: '20px' });
            document.body.appendChild(boostButton);
        }
        updateButtonState();
    }

    function showBoostButton() {
        if (!boostButton) return;
        boostButton.style.opacity = '1';
        boostButton.style.visibility = 'visible';
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (boostButton) {
                boostButton.style.opacity = '0';
                boostButton.style.visibility = 'hidden';
            }
        }, 3000);
    }

    // === INIT ===
    function init() {
        console.log('%c[SUITE] Initializing...', 'color: cyan');

        if (!document.body) {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        iframeObserver.observe(document.documentElement, { childList: true, subtree: true });

        // Watch for ad dialogs only
        const observer = new MutationObserver(autoClickAdDialog);
        observer.observe(document.body, { childList: true, subtree: true });

        autoClickAdDialog();
        setInterval(autoClickAdDialog, 300);

        // Voice enhancer
        setInterval(() => {
            if (document.querySelector('video')) createToggleButton();
        }, 500);

        document.addEventListener('mousemove', showBoostButton);
        setTimeout(showBoostButton, 100);

        console.log('%c[SUITE] Ready! VIP spoof active, ad dialog auto-click enabled', 'color: lime; font-weight: bold');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();