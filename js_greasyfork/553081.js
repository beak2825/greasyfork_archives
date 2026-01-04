// ==UserScript==
// @name         Universal Control Video Player - RafPlayer (Fixed with Ad Visibility Attempt)
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Advanced video controller for any website — brightness, playback speed, volume, on-screen shortcut help (H), and fullscreen (F). Enter key now toggles between 1.75x and 30x speed.
// @author       Rafin Saleh
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553081/Universal%20Control%20Video%20Player%20-%20RafPlayer%20%28Fixed%20with%20Ad%20Visibility%20Attempt%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553081/Universal%20Control%20Video%20Player%20-%20RafPlayer%20%28Fixed%20with%20Ad%20Visibility%20Attempt%29.meta.js
// ==/UserScript==

/*
Modified for universal use across all websites,
and fullscreen (F) functionality has been re-enabled.
v4.4: Updated 'Enter' key to toggle speed between 1.75x and 30x.
Includes attempt to override aggressive ad-blocker CSS that may hide the YouTube 'Skip Ad' button.
*/

(function () {
    'use strict';

    // --- Display Box ---
    const display = document.createElement('div');
    Object.assign(display.style, {
        position: 'fixed',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 14px',
        borderRadius: '6px',
        zIndex: '999999',
        fontSize: '17px',
        fontFamily: 'sans-serif',
        display: 'none',
        transition: 'opacity 0.3s ease'
    });
    document.body.appendChild(display);

    function showDisplay(msg, duration = 1500) {
        display.textContent = msg;
        display.style.display = 'block';
        display.style.opacity = '1';
        clearTimeout(display.hideTimer);
        display.hideTimer = setTimeout(() => {
            display.style.opacity = '0';
            setTimeout(() => (display.style.display = 'none'), 300);
        }, duration);
    }

    // --- Help Overlay ---
    const helpOverlay = document.createElement('div');
    Object.assign(helpOverlay.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        zIndex: '1000000',
        fontSize: '15px',
        fontFamily: 'monospace',
        display: 'none',
        whiteSpace: 'pre-line',
        maxWidth: '90%',
        lineHeight: '1.5em'
    });
    helpOverlay.textContent =
`🎥 UDV Universal Controller — Shortcuts (v2.0)

Brightness:
  9 = Increase, 8 = Decrease

Playback Speed:
  Enter = Toggle 1.75x / 30x (UPDATED)
  . / , = Fine Adjust (±0.25x), lowest speed is now 1x
  / = Toggle 2.25x / 10x
  A = 3x Speed
  Z = Show Current Speed

Volume:
  I = Increase, K = Decrease (±10%)
  ; = Mute / Unmute

Seek & Frames:
  ← / → = Seek ±5s (DISABLED to allow native player controls)
  [ / ] = Seek ±60s
  - / = = Frame Back / Forward (when paused)

Misc:
  F = Toggle Fullscreen
  H = Show / Hide This Help
`;
    document.body.appendChild(helpOverlay);

    let helpVisible = false;
    function toggleHelp() {
        helpVisible = !helpVisible;
        helpOverlay.style.display = helpVisible ? 'block' : 'none';
    }

    // --- Skip Button Visibility Fix ---
    function forceSkipButtonVisibility() {
        // Targets known YouTube skip button/ad container elements
        const skipButton = document.querySelector('.ytp-skip-ad-button, .ytp-ad-skip-button-container, .ytp-ad-skip-button, .ytp-ad-text');
        
        if (skipButton) {
            // Force the element's display and visibility to ensure it shows up,
            // overriding common ad-blocker CSS that uses `!important`.
            skipButton.style.setProperty('display', 'block', 'important');
            skipButton.style.setProperty('visibility', 'visible', 'important');
        }
    }


    // --- States ---
    let brightness = 1;
    let speed = 1.75; // Initial speed set to 1.75x
    let volume = 1;
    let muted = false;

    // --- Universal Video Selection ---
    // Selects ALL video elements on the page.
    const videos = () => document.querySelectorAll('video');

    // Selects the video that is likely the main one being controlled
    function getActiveVideo() {
        // Return the last video found, which is often the main or most recently loaded one.
        const vids = videos();
        return vids[vids.length - 1];
    }


    // --- Core Functions ---
    function setSpeed(newSpeed) {
        videos().forEach(v => (v.playbackRate = newSpeed));
    }

    function setVolume(newVolume) {
        newVolume = Math.min(1, Math.max(0, newVolume));
        videos().forEach(v => (v.volume = newVolume));
        volume = newVolume;
        showDisplay(`Volume: ${(volume * 100).toFixed(0)}%`);
    }

    function toggleMute() {
        muted = !muted;
        videos().forEach(v => (v.muted = muted));
        showDisplay(muted ? 'Muted' : 'Unmuted');
    }

    function adjustBrightness(change) {
        brightness = Math.min(2, Math.max(0.2, brightness + change));
        // Apply filter to document.documentElement for universal effect
        document.documentElement.style.filter = `brightness(${brightness})`;
        showDisplay(`Brightness: ${(brightness * 100).toFixed(0)}%`);
    }

    function seek(seconds) {
        const v = getActiveVideo();
        if (v) v.currentTime = Math.min(v.duration, Math.max(0, v.currentTime + seconds));
    }

    function frameStep(forward = true) {
        const v = getActiveVideo();
        if (v && v.paused) {
            // Standard frame rate approximation (e.g., 30 FPS)
            v.currentTime += forward ? 1 / 30 : -1 / 30;
            showDisplay(`Frame ${forward ? '→' : '←'}`);
        }
    }

    // --- Fullscreen (Re-enabled) ---
    function toggleFullscreen() {
        const v = getActiveVideo();
        if (!v) return;

        // Check if the document is currently in fullscreen mode
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
            showDisplay('Exited Fullscreen');
        } else {
            // Attempt to enter fullscreen on the video element's container (e.g., the YouTube player) or the video itself
            const element = v.closest('#player-container') || v.parentElement || v; 
            
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { // Firefox
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { // IE/Edge
                element.msRequestFullscreen();
            }
            showDisplay('Entered Fullscreen');
        }
    }

    // --- Key Controls ---
    window.addEventListener('keydown', e => {
        const tagName = document.activeElement.tagName;
        
        // Only run controls if we are NOT typing in an input field
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName) || document.activeElement.isContentEditable) return;
        
        // Ensure a video is present and active
        if (!getActiveVideo() && e.key.toLowerCase() !== 'h') return;
        
        // Prevent browser default actions for keys we'll use.
        if ([' ', 'ArrowUp', 'ArrowDown', 'f', 'h', 'Enter', '[', ']', '-', '='].includes(e.key)) {
            e.preventDefault();
        }
        
        // Convert to lowercase for case-insensitive check
        const key = e.key.toLowerCase();

        switch (key) {
            case ';': toggleMute(); break;
            case '9': adjustBrightness(0.1); break;
            case '8': adjustBrightness(-0.1); break;
            case 'a': speed = 3; setSpeed(speed); showDisplay(`Speed: 3x`); break;
            case 'z': showDisplay(`Speed: ${speed.toFixed(2)}x`); break;
            case 'enter': 
                // ✨ MODIFIED: Toggle speed between 1.75x and 30x
                speed = speed === 30 ? 1.75 : 30; 
                setSpeed(speed); 
                showDisplay(`Speed: ${speed.toFixed(2)}x`); 
                break;
            case '/': speed = speed === 10 ? 2.25 : 10; setSpeed(speed); showDisplay(`Speed: ${speed.toFixed(2)}x`); break;
            case '[': seek(-60); break;
            case ']': seek(60); break;
            case '-': frameStep(false); break;
            case '=': frameStep(true); break;
            case ',': 
                // Set the minimum speed to 1x
                speed = Math.max(1, speed - 0.25); 
                setSpeed(speed); 
                showDisplay(`Speed: ${speed.toFixed(2)}x`); 
                break;
            case '.': speed += 0.25; setSpeed(speed); showDisplay(`Speed: ${speed.toFixed(2)}x`); break;
            case 'i': setVolume(volume + 0.1); break;
            case 'k': setVolume(volume - 0.1); break;
            // case 'f': toggleFullscreen(); break; // RE-ENABLED
            case 'h': toggleHelp(); break;
            // 'ArrowRight' and 'ArrowLeft' handlers for seeking are REMOVED to allow YouTube's native controls to work.
        }
    });

    // --- Initialization ---
    // Apply initial settings to any video elements that appear
    const initializeVideo = (v) => {
        if (!v.dataset.udvInit) {
            v.dataset.udvInit = '1';
            v.playbackRate = speed;
            v.volume = volume;
            showDisplay('Universal Controller Ready ✅');
        }
    };

    // Initialize all existing videos
    videos().forEach(initializeVideo);

    // Observer to handle videos loaded dynamically (like on YouTube or other single-page apps)
    const observer = new MutationObserver((mutationsList, observer) => {
        videos().forEach(initializeVideo);
    });
    // Monitor the entire document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // --- Periodic Check for Skip Button Visibility ---
    // This runs the fix every 500ms to continuously ensure the button is visible.
    setInterval(forceSkipButtonVisibility, 500);

})();
