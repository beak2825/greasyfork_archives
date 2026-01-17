// ==UserScript==
// @name         Coursera Transcript to Right Side
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Move the Coursera video transcript panel to the right side of the player and
//               automatically scroll the transcript to follow the currently playing sentence.
// @author       memoverflow
// @match        https://www.coursera.org/*
// @grant        GM_addStyle
// @license      MIT
// @homepage     https://github.com/memoverflow/memoverflow-coursera-transcript-right
// @supportURL   https://github.com/memoverflow/memoverflow-coursera-transcript-right/issues
// @downloadURL https://update.greasyfork.org/scripts/562862/Coursera%20Transcript%20to%20Right%20Side.user.js
// @updateURL https://update.greasyfork.org/scripts/562862/Coursera%20Transcript%20to%20Right%20Side.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS to reposition the transcript panel; avoids heavy DOM mutation.
    // Keeps the change lightweight and resilient to small DOM updates on the site.
    GM_addStyle(`
        /* Shrink the main video/player container to make room for the transcript */
        [data-testid="inner-container"] {
            width: calc(100% - 450px) !important;
            max-width: calc(100% - 500px) !important;
        }

        /* Transcript / Notes / Downloads area - keep fixed on the right side */
        [class*="TabPanel"],
        [class*="ItemPageContent"],
        .rc-Transcript,
        [class*="transcript"] {
            position: fixed !important;
            right: 10px !important;
            top: 70px !important;
            width: 480px !important;
            max-height: calc(100vh - 90px) !important;
            overflow-y: auto !important;
            background: #fff !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            padding: 15px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
            z-index: 1000 !important;
        }

        /* Hide duplicate transcript containers that may be injected by the site */
        .video-transcript-container {
            display: none !important;
        }

        /* Each transcript cue (data-cue) on its own line with dashed border */
        .rc-Phrase,
        [class*="rc-Phrase"],
        [data-cue] {
            display: block !important;
            margin-bottom: 8px !important;
            padding-bottom: 8px !important;
            border-bottom: 1px dashed #ccc !important;
            font-size: 1em !important;
            font-weight: 400 !important;
            transition: font-size 0.3s ease, font-weight 0.3s ease, transform 0.3s ease !important;
        }
    `);

    console.log('Coursera Transcript to Right Side - CSS loaded');

    // Return true if the primary <video> element is currently playing
    function isVideoPlaying() {
        const video = document.querySelector('video');
        if (video) {
            return !video.paused && !video.ended;
        }
        return false;
    }

    // Auto-scroll the transcript panel to the currently highlighted sentence
    function scrollToActiveTranscript() {
        // Only auto-scroll while the video is playing
        if (!isVideoPlaying()) {
            return;
        }

        // Find the currently highlighted sentence
        const activePhrase = document.querySelector(
            '[class*="transcript"] [class*="active"],' +
            '[class*="transcript"] [class*="highlight"],' +
            '[class*="transcript"] [class*="current"],' +
            '[class*="Transcript"] [class*="active"],' +
            '[class*="Transcript"] [class*="highlight"],' +
            '[class*="Transcript"] [class*="current"],' +
            '.rc-Transcript [class*="active"],' +
            '.rc-Transcript [class*="highlight"],' +
            '[class*="phrase"][class*="active"],' +
            '[class*="cue"][class*="active"],' +
            // Find highlighted element by background color
            '[style*="background"]'
        );

        if (activePhrase) {
            // Smoothly center the highlighted sentence in the transcript container
            activePhrase.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // Observe the transcript container for attribute and subtree changes
    // that indicate the active/highlighted sentence changed, then scroll it.
    function setupTranscriptObserver() {
        const transcriptContainer = document.querySelector(
            '[class*="transcript"],' +
            '[class*="Transcript"],' +
            '.rc-Transcript'
        );

        if (!transcriptContainer) {
            // If the transcript element isn't available yet, try again shortly.
            setTimeout(setupTranscriptObserver, 1000);
            return;
        }

        // Watch for attribute and subtree modifications indicating highlight changes
        const observer = new MutationObserver(() => {
            scrollToActiveTranscript();
        });

        observer.observe(transcriptContainer, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class', 'style']
        });

        console.log('Transcript auto-scroll observer setup complete');
    }

    // Apply active styles via JavaScript as a fallback
    function applyActiveStyles() {
        // Reset all phrases to normal style
        document.querySelectorAll('.rc-Phrase, [data-cue]').forEach(el => {
            el.style.fontSize = '';
            el.style.fontWeight = '';
            el.style.color = '';
            el.style.borderBottomColor = '';
        });

        // Find and style the active phrase
        const activeEl = document.querySelector('.rc-Phrase.active, [data-cue].active');
        if (activeEl) {
            activeEl.style.fontSize = '1.3em';
            activeEl.style.fontWeight = '700';
            activeEl.style.color = '#1a73e8';
            activeEl.style.borderBottomColor = '#1a73e8';
        }
    }

    // Also check periodically to ensure nothing is missed
    setInterval(() => {
        scrollToActiveTranscript();
        applyActiveStyles();
    }, 500);

    // Start observer after page loads
    setTimeout(setupTranscriptObserver, 2000);
})();
