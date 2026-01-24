// ==UserScript==
// @name         Olevod Video Auto Next + Skip Intro/Outro + Smart Play/FS + Panel
// @namespace    https://github.com/yourname
// @version      1.9.1
// @description  Auto next episode + skip intro/outro + play after skip + fullscreen (once per video) + control panel
// @author       Lainux
// @match        https://www.olevod.tv/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563920/Olevod%20Video%20Auto%20Next%20%2B%20Skip%20IntroOutro%20%2B%20Smart%20PlayFS%20%2B%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/563920/Olevod%20Video%20Auto%20Next%20%2B%20Skip%20IntroOutro%20%2B%20Smart%20PlayFS%20%2B%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Olevod Auto v1.9.1 – FS once per video + manual button");

    // ─── Paste your ad-removal observer here ────────────────────────────────
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            const swipers = document.querySelector("div.swiper-wrapper");
            if (swipers) {
                for (let swiper of swipers.children) {
                    if (swiper.hasAttribute("data-swiper-autoplay")) {
                        const img = swiper.querySelector("img");
                        if (img) img.remove();
                    }
                }
            }
            const pc_ads = document.querySelectorAll("div.pc-ads");
            if (pc_ads) {
                for (let pc_ad of pc_ads) pc_ad.remove()
            }
            const pause_ad = document.getElementById("adsMaskBox");
            if (pause_ad) {
                pause_ad.remove();
            }
            const right_side_ads = document.querySelectorAll("#pane-first .img_bg");
            if (right_side_ads) {
                for(let right_side_ad of right_side_ads) {
                    right_side_ad.remove();
                }
            }
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // ────────────────────────────────────────────────
    //  CONFIG & STATE
    // ────────────────────────────────────────────────
    let SKIP_START = GM_getValue('skip_start', 0);
    let SKIP_END   = GM_getValue('skip_end',   0);

    const PLAY_COOLDOWN_MS   = 15000;
    const FS_COOLDOWN_MS     = 8000;
    const SKIP_DEBOUNCE_MS   = 30000;

    let lastPlayTime          = 0;
    let lastFSTime            = 0;
    let lastIntroSkipTime     = 0;
    let hasTriggeredPlayThisVideo = false;
    let hasEnteredFSThisVideo = false;   // ← key flag: FS success once per video

    // ────────────────────────────────────────────────
    //  Floating panel
    // ────────────────────────────────────────────────
    GM_addStyle(`
        #olevod-control {
            position: fixed; bottom: 18px; right: 18px;
            background: rgba(0,0,0,0.82); color: #fff;
            padding: 12px 16px; border-radius: 10px;
            font-family: Arial, sans-serif; font-size: 13px;
            z-index: 999999; box-shadow: 0 4px 14px rgba(0,0,0,0.6);
            user-select: none; display: flex; align-items: center; gap: 10px;
        }
        #olevod-control label { display: flex; align-items: center; gap: 4px; }
        #olevod-control input {
            width: 54px; padding: 4px 6px; border: none; border-radius: 4px;
            background: #333; color: white; text-align: center;
        }
        #olevod-control button {
            background: #b22222; border: none; color: white;
            padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 12px;
        }
        #olevod-control button:hover { background: #8b1a1a; }
        #btn-fullscreen {
            background: #1e88e5;
        }
        #btn-fullscreen:hover { background: #1565c0; }
    `);

    const panel = document.createElement('div');
    panel.id = 'olevod-control';
    panel.innerHTML = `
        <label>Intro <input type="number" id="inp-start" min="0" value="${SKIP_START}"></label>
        <label>Outro <input type="number" id="inp-end"   min="0" value="${SKIP_END}"></label>
        <button id="btn-reset">Reset</button>
        <button id="btn-fullscreen">Enter FS</button>
    `;
    document.body.appendChild(panel);

    // Save skip values
    const saveValues = () => {
        SKIP_START = parseInt(document.getElementById('inp-start').value) || 0;
        SKIP_END   = parseInt(document.getElementById('inp-end').value)   || 0;
        GM_setValue('skip_start', SKIP_START);
        GM_setValue('skip_end',   SKIP_END);
    };

    document.querySelectorAll('#inp-start, #inp-end').forEach(inp => {
        inp.addEventListener('change', saveValues);
        inp.addEventListener('blur', saveValues);
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') { saveValues(); inp.blur(); } });
    });

    document.getElementById('btn-reset').onclick = () => {
        if (!confirm("Reset skip times to 0?")) return;
        SKIP_START = SKIP_END = 0;
        GM_setValue('skip_start', 0);
        GM_setValue('skip_end', 0);
        document.getElementById('inp-start').value = 0;
        document.getElementById('inp-end').value   = 0;
    };

    // ────────────────────────────────────────────────
    //  Fullscreen logic
    // ────────────────────────────────────────────────
    const isCurrentlyFullscreen = () => {
        return !!document.fullscreenElement ||
               !!document.webkitFullscreenElement ||
               !!document.mozFullScreenElement ||
               !!document.msFullscreenElement;
    };

    const tryPlyrFullscreen = (isManual = false) => {
        // Manual button always allowed
        if (!isManual) {
            // Auto only if we haven't succeeded yet this video
            if (hasEnteredFSThisVideo || isCurrentlyFullscreen()) {
                return;
            }
        }

        const now = Date.now();
        if (!isManual && now - lastFSTime < FS_COOLDOWN_MS) return;

        const fsButton = document.querySelector(
            'button[data-plyr="fullscreen"], .plyr__control[data-plyr="fullscreen"]'
        );

        if (fsButton) {
            const isPressed = fsButton.getAttribute('aria-pressed') === 'true';
            if (isPressed && !isManual) return;

            console.log(isManual ? "→ Manual FS button pressed" : "→ Auto FS attempt");
            fsButton.click();
            lastFSTime = now;

            // Check success after a short delay
            if (!isManual) {
                setTimeout(() => {
                    if (isCurrentlyFullscreen()) {
                        hasEnteredFSThisVideo = true;
                        console.log("Fullscreen entered → auto FS disabled for this episode");
                    }
                }, 800);
            }
        } else {
            console.log("Plyr fullscreen button not found");
        }
    };

    // Manual FS button
    document.getElementById('btn-fullscreen').onclick = () => {
        tryPlyrFullscreen(true);
    };

    // Detect FS changes (for logging & confirmation)
    document.addEventListener('fullscreenchange', () => {
        if (isCurrentlyFullscreen()) {
            hasEnteredFSThisVideo = true;
            console.log("FS active → no more auto attempts this video");
        } else {
            console.log("FS exited (no auto re-entry)");
        }
    });

    // ────────────────────────────────────────────────
    //  Other helpers
    // ────────────────────────────────────────────────
    const getVideo = () => document.querySelector('video');

    const canPlayNow = () => Date.now() - lastPlayTime > PLAY_COOLDOWN_MS;
    const recentlySkippedIntro = () => Date.now() - lastIntroSkipTime < SKIP_DEBOUNCE_MS;

    const updatePlayTime = () => { lastPlayTime = Date.now(); hasTriggeredPlayThisVideo = true; };

    const tryPlay = (vid) => {
        if (!vid || !canPlayNow() || hasTriggeredPlayThisVideo) return;
        if (vid.paused || vid.ended) {
            const promise = vid.play();
            if (promise !== undefined) {
                promise.then(() => {
                    console.log("→ play triggered (once)");
                    updatePlayTime();
                }).catch(e => console.log("Play blocked:", e.message));
            }
        }
    };

    const skipAndActivate = (vid, toTime, isIntro = false) => {
        if (!vid) return;
        console.log(`Seek → ${toTime.toFixed(1)}s  ${isIntro ? '(intro)' : '(outro)'}`);
        vid.currentTime = toTime;

        if (isIntro) lastIntroSkipTime = Date.now();

        setTimeout(() => {
            tryPlay(vid);
            tryPlyrFullscreen(false); // auto mode
        }, 300);
    };

    const findNextBtn = () => {
        const candidates = document.querySelectorAll('button, div[role="button"], div, span, a, li');
        for (const el of candidates) {
            const text = (el.textContent || el.innerHTML || '').toLowerCase();
            if (text.includes('下一集') || text.includes('next') || text.includes('下一话') || el.className.toLowerCase().includes('next')) {
                console.log("Found potential next btn:", el.outerHTML.substring(0, 150));
                return el;
            }
        }
        return document.querySelector('.next-t, .next-ep, .next-btn, [title*="下一集"], [aria-label*="下一集"], .btn-next');
    };

    // Reset flags on new video/episode
    let lastVideoSrc = '';
    setInterval(() => {
        const vid = getVideo();
        if (vid?.currentSrc && vid.currentSrc !== lastVideoSrc) {
            lastVideoSrc = vid.currentSrc;
            hasTriggeredPlayThisVideo = false;
            hasEnteredFSThisVideo = false;
            console.log("New video src detected → reset play & FS flags");
        }
    }, 2500);

    // Outro next-button retry
    let nextRetryTimer = null;
    let nextAttempts = 0;

    // ────────────────────────────────────────────────
    //  Main loop
    // ────────────────────────────────────────────────
    setInterval(() => {
        const vid = getVideo();
        if (!vid || isNaN(vid.duration) || vid.duration < 60) return;

        const ct  = vid.currentTime;
        const dur = vid.duration;

        // Skip intro
        if (SKIP_START > 0 && ct > 0.5 && ct < SKIP_START + 10 && ct < dur / 3 && !recentlySkippedIntro()) {
            skipAndActivate(vid, SKIP_START, true);
        }

        // Skip outro + next
        if (SKIP_END > 0 && ct >= dur - (SKIP_END + 70) && ct < dur - 0.1) {
            skipAndActivate(vid, dur - 0.1, false);

            if (!nextRetryTimer) {
                nextAttempts = 0;
                nextRetryTimer = setInterval(() => {
                    if (nextAttempts >= 6) {
                        clearInterval(nextRetryTimer);
                        nextRetryTimer = null;
                        return;
                    }
                    const btn = findNextBtn();
                    if (btn) {
                        console.log("→ clicking next episode");
                        btn.click();
                        clearInterval(nextRetryTimer);
                        nextRetryTimer = null;
                    }
                    nextAttempts++;
                }, 700);
            }
        }

        // Early auto actions
        if (ct < 35) {
            tryPlay(vid);
            tryPlyrFullscreen(false); // auto FS attempt (only if not yet succeeded)
        }

    }, 1000);

})();