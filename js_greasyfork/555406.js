// ==UserScript==
// @name         Auto Landscape for Fullscreen Video
// @namespace    full screen video
// @version      1.1
// @description  Forces landscape orientation when a <video> goes fullscreen in Safari on iOS (Tampermonkey)
// @author       You / GPT & Grok mod for Sarafi
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555406/Auto%20Landscape%20for%20Fullscreen%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/555406/Auto%20Landscape%20for%20Fullscreen%20Video.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --------------------------------------------------------------------
    // 1. Helper: detect iOS Safari
    // --------------------------------------------------------------------
    const isIosSafari = (() => {
        const ua = navigator.userAgent;
        const ios = /iPad|iPhone|iPod/.test(ua);
        const webkit = /WebKit/.test(ua);
        const safari = webkit && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
        return ios && safari;
    })();

    // --------------------------------------------------------------------
    // 2. Orientation lock/unlock (standard API – works on Chrome/FF)
    // --------------------------------------------------------------------
    function lockStd(orientation) {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.unlock();
            screen.orientation.lock(orientation).catch(err => {
                console.warn('Standard orientation lock failed:', err);
            });
        }
    }
    function unlockStd() {
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }

    // --------------------------------------------------------------------
    // 3. iOS Safari specific lock (the *real* fix)
    // --------------------------------------------------------------------
    function lockIosSafari() {
        if (!isIosSafari) return;

        // iOS Safari only respects lock *if* it is called **before** fullscreen.
        // We therefore lock as soon as we know a video exists on the page.
        if (screen.orientation && typeof screen.orientation.lock === 'function') {
            // Some iOS versions expose the API – use it if present
            screen.orientation.lock('landscape').catch(() => {});
        } else {
            // Fallback: create a hidden <video> that requests fullscreen
            // (this triggers the native “rotate to landscape” dialog)
            const dummy = document.createElement('video');
            dummy.style.position = 'fixed';
            dummy.style.left = '-9999px';
            dummy.style.opacity = '0';
            dummy.muted = true;
            dummy.playsInline = false;   // crucial – forces native controls
            document.body.appendChild(dummy);

            // Ask for fullscreen *immediately* – Safari will rotate the device
            if (dummy.requestFullscreen) {
                dummy.requestFullscreen();
                // Exit fullscreen right away – we only needed the rotation prompt
                setTimeout(() => {
                    if (document.exitFullscreen) document.exitFullscreen();
                    dummy.remove();
                }, 300);
            } else if (dummy.webkitRequestFullscreen) {
                dummy.webkitRequestFullscreen();
                setTimeout(() => {
                    if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                    dummy.remove();
                }, 300);
            }
        }
    }

    function unlockIosSafari() {
        if (!isIosSafari) return;
        // iOS automatically unlocks when the last fullscreen element exits.
        // No explicit API needed.
    }

    // --------------------------------------------------------------------
    // 4. Fullscreen change listeners
    // --------------------------------------------------------------------
    function onFullscreenEnter(video) {
        if (video && video.tagName === 'VIDEO') {
            if (isIosSafari) {
                lockIosSafari();
            } else {
                lockStd('landscape');
            }
        }
    }

    function onFullscreenExit() {
        if (isIosSafari) {
            unlockIosSafari();
        } else {
            unlockStd();
        }
    }

    // Standard
    document.addEventListener('fullscreenchange', () => {
        const el = document.fullscreenElement;
        if (el) onFullscreenEnter(el);
        else onFullscreenExit();
    });

    // WebKit (Safari desktop + older iOS)
    document.addEventListener('webkitfullscreenchange', () => {
        const el = document.webkitFullscreenElement;
        if (el) onFullscreenEnter(el);
        else onFullscreenExit();
    });

    // --------------------------------------------------------------------
    // 5. Pro-active lock for pages that already have a <video> on load
    // --------------------------------------------------------------------
    function tryLockOnLoad() {
        // If a video is already present when the script runs, lock early.
        const videos = document.querySelectorAll('video');
        if (videos.length && isIosSafari) {
            lockIosSafari();
        }
    }

    // Run once now
    tryLockOnLoad();

    // Also run when new videos are inserted (common on SPAs)
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.addedNodes) {
                for (const node of m.addedNodes) {
                    if (node.nodeName === 'VIDEO' && isIosSafari) {
                        lockIosSafari();
                        return;
                    }
                    if (node.querySelector && node.querySelector('video') && isIosSafari) {
                        lockIosSafari();
                        return;
                    }
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();