// ==UserScript==
// @name         YouTube Video Fade In/Out
// @namespace    http://tampermonkey.net/
// @version      1.001
// @description  Fade in/out audio when playing/pausing YouTube videos (optionally music videos only)
// @author       You
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://music.youtube.com/*
// @grant        none
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/549993/YouTube%20Video%20Fade%20InOut.user.js
// @updateURL https://update.greasyfork.org/scripts/549993/YouTube%20Video%20Fade%20InOut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const MUSIC_VIDEOS_ONLY = false; // Set to true to only apply to music videos
    const FADE_DURATION_MS = 1000;   // Total fade duration in milliseconds
    const FADE_STEPS = 10;           // Number of fade steps

    console.log("[YT-FADER] Tampermonkey script loading...");

    function isMusicVideo() {
        // Always true for YouTube Music
        if (window.location.hostname === 'music.youtube.com') {
            return true;
        }

        // For regular YouTube, check multiple indicators
        const musicIndicators = [
            // Title patterns (common in music videos)
            () => {
                const title = document.title.toLowerCase();
                return title.includes('official music video') ||
                       title.includes('official video') ||
                       title.includes('official audio') ||
                       title.includes('lyric video') ||
                       title.includes('music video') ||
                       title.match(/\b(ft\.?|feat\.?|featuring)\b/) ||
                       title.match(/\b(remix|cover|acoustic|live)\b/) ||
                       title.match(/\([^)]*(?:official|audio|video|lyrics?)[^)]*\)/);
            },

            // Check for music category in YouTube's data
            () => {
                const categoryElements = document.querySelectorAll('[data-content-category]');
                return Array.from(categoryElements).some(el =>
                    el.dataset.contentCategory === '10' // YouTube music category ID
                );
            },

            // Channel indicators (record labels, VEVO, etc.)
            () => {
                const channelName = document.querySelector('#text.ytd-channel-name, .ytd-channel-name #text')?.textContent?.toLowerCase() || '';
                return channelName.includes('records') ||
                       channelName.includes('music') ||
                       channelName.includes('vevo') ||
                       channelName.includes('official') ||
                       channelName.endsWith('topic'); // YouTube auto-generated artist channels
            },

            // Video description patterns
            () => {
                const description = document.querySelector('#description-text, .content')?.textContent?.toLowerCase() || '';
                return description.includes('stream') ||
                       description.includes('spotify') ||
                       description.includes('apple music') ||
                       description.includes('itunes') ||
                       description.includes('follow me') ||
                       description.match(/(?:lyrics?|directed by|produced by)/);
            },

            // Check for music-related hashtags
            () => {
                const hashtags = Array.from(document.querySelectorAll('a[href*="/hashtag/"]'))
                    .map(el => el.textContent.toLowerCase());
                return hashtags.some(tag =>
                    tag.includes('music') ||
                    tag.includes('song') ||
                    tag.includes('artist') ||
                    tag.includes('newmusic') ||
                    tag.includes('musicvideo')
                );
            },

            // Duration check (most music videos are 2-8 minutes)
            () => {
                const durationText = document.querySelector('.ytp-time-duration')?.textContent;
                if (durationText) {
                    const parts = durationText.split(':').map(Number);
                    const totalSeconds = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + parts[2];
                    return totalSeconds >= 120 && totalSeconds <= 480; // 2-8 minutes
                }
                return false;
            }
        ];

        // Consider it a music video if at least 2 indicators match
        const matches = musicIndicators.filter(check => {
            try {
                return check();
            } catch (e) {
                return false;
            }
        }).length;

        return matches >= 2;
    }

    function injectFadeScript() {
        const code = `
            (function() {
                const sleep = ms => new Promise(r => setTimeout(r, ms));
                const FADE_DURATION = ${FADE_DURATION_MS};
                const FADE_STEPS = ${FADE_STEPS};
                const MUSIC_ONLY = ${MUSIC_VIDEOS_ONLY};

                // Check if we should apply fading
                function shouldApplyFade() {
                    if (!MUSIC_ONLY) return true;

                    // Re-check music status when play/pause is triggered
                    return ${isMusicVideo.toString()}();
                }

                const realPause = HTMLMediaElement.prototype.pause;
                const realPlay  = HTMLMediaElement.prototype.play;

                HTMLMediaElement.prototype.play = async function() {
                    console.log("[YT-FADER] play() called, paused:", this.paused, "tagName:", this.tagName, "current volume:", this.volume);

                    if (this.tagName !== "VIDEO" || (MUSIC_ONLY && !shouldApplyFade())) {
                        console.log("[YT-FADER] play() - skipping fade, calling realPlay()");
                        return realPlay.apply(this, arguments);
                    }

                    // Prevent multiple fade operations
                    if (this.dataset.fadingIn === 'true') {
                        console.log("[YT-FADER] play() - already fading in, calling realPlay() directly");
                        return realPlay.apply(this, arguments);
                    }

                    // Only store preferred volume if we haven't stored one yet AND the current volume isn't 0
                    let pref;
                    if (this.dataset.maxVolume) {
                        pref = parseFloat(this.dataset.maxVolume);
                        console.log("[YT-FADER] Using stored preferred volume:", pref);
                    } else if (this.volume > 0) {
                        // Use current volume as preferred if it's not 0 (from previous fade)
                        pref = this.volume;
                        this.dataset.maxVolume = pref.toString();
                        console.log("[YT-FADER] Storing current volume as preferred:", pref);
                    } else {
                        // Fallback to a reasonable default if volume is 0
                        pref = 0.5;
                        this.dataset.maxVolume = pref.toString();
                        console.log("[YT-FADER] Using fallback volume:", pref);
                    }

                    this.dataset.fadingIn = 'true';

                    console.log("[YT-FADER] Starting fade-in to preferred volume:", pref.toFixed(2));

                    // Start at 0 volume and play
                    this.volume = 0;
                    const playPromise = realPlay.apply(this, arguments);

                    // Fade in to preferred volume
                    const stepDelay = FADE_DURATION / FADE_STEPS;
                    for (let step = 1; step <= FADE_STEPS; step++) {
                        const v = (pref * step) / FADE_STEPS;
                        this.volume = Math.min(v, 1);
                        console.log("[YT-FADER] fade-in step", step, "volume:", v.toFixed(2));
                        await sleep(stepDelay);
                    }

                    this.dataset.fadingIn = 'false';
                    console.log("[YT-FADER] Fade-in complete");
                    return playPromise;
                };

                HTMLMediaElement.prototype.pause = async function() {
                    console.log("[YT-FADER] pause() called, paused:", this.paused, "tagName:", this.tagName, "current volume:", this.volume);

                    if (this.tagName !== "VIDEO" || this.paused || (MUSIC_ONLY && !shouldApplyFade())) {
                        console.log("[YT-FADER] pause() - skipping fade, calling realPause()");
                        return realPause.apply(this, arguments);
                    }

                    // Prevent multiple fade operations
                    if (this.dataset.fadingOut === 'true') {
                        console.log("[YT-FADER] pause() - already fading out, calling realPause() directly");
                        return realPause.apply(this, arguments);
                    }

                    // Only store current volume as preferred if we don't have one stored yet
                    // and the current volume is reasonable (not 0 from a previous fade)
                    if (!this.dataset.maxVolume && this.volume > 0.1) {
                        this.dataset.maxVolume = this.volume.toString();
                        console.log("[YT-FADER] Storing current volume as preferred:", this.volume.toFixed(2));
                    }

                    this.dataset.fadingOut = 'true';
                    const currentVol = this.volume;

                    console.log("[YT-FADER] Starting fade-out from volume:", currentVol.toFixed(2));

                    // Fade out from current volume to 0
                    const stepDelay = FADE_DURATION / FADE_STEPS;
                    for (let step = FADE_STEPS - 1; step >= 0; step--) {
                        const v = (currentVol * step) / FADE_STEPS;
                        this.volume = Math.max(v, 0);
                        console.log("[YT-FADER] fade-out step", (FADE_STEPS - step), "volume:", v.toFixed(2));
                        await sleep(stepDelay);
                    }

                    this.dataset.fadingOut = 'false';
                    console.log("[YT-FADER] Fade-out complete, calling realPause()");
                    return realPause.apply(this, arguments);
                };

                console.log("[YT-FADER] Fade overrides installed", MUSIC_ONLY ? "(music videos only)" : "(all videos)");
            })();
        `;

        const script = document.createElement("script");
        script.textContent = code;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    // Inject immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectFadeScript);
    } else {
        injectFadeScript();
    }

    // Also inject on navigation changes (YouTube is a SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            // Small delay to let YouTube load
            setTimeout(injectFadeScript, 500);
        }
    }).observe(document, { subtree: true, childList: true });

})();