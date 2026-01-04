// ==UserScript==
// @name         YouTube Chapter Navigation (Shift + Arrows)
// @namespace    -
// @version      1.0
// @description  Hold Shift and use ← / → to jump between chapters. Works with both manual and auto-generated chapters.
// @author       MrGoatsy
// @match        https://www.youtube.com/watch*
// @grant        none
// @license      CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/553319/YouTube%20Chapter%20Navigation%20%28Shift%20%2B%20Arrows%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553319/YouTube%20Chapter%20Navigation%20%28Shift%20%2B%20Arrows%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // --- Configuration ---
    const DEBUG = false;
    // If you are more than this many seconds into a chapter, the first press of ArrowLeft will rewind to its start.
    // A second press (or a press within this threshold) will go to the previous chapter.
    const REWIND_THRESHOLD = 2.0;

    // --- Script State (resets on new video) ---
    let state = {
        player: null,
        chapters: null, // This will be our cache
        isReady: false
    };

    const log = (...args) => DEBUG && console.log('[YT-ChapterNav]', ...args);

    /**
     * Fetches chapter timestamps, trying the official API first and falling back to visual scraping.
     * @param {HTMLDivElement} player - The #movie_player element.
     * @returns {number[]|null} Sorted array of chapter start times in seconds.
     */
    const fetchChapters = (player) => {
        try { // API method
            const chapters = player.getVideoData()?.chapters;
            if (Array.isArray(chapters) && chapters.length > 1) {
                log('Chapters found via API.');
                return chapters.map(c => (c.chapterRenderer?.timeRangeStartMillis ?? 0) / 1000).sort((a, b) => a - b);
            }
        } catch {}

        try { // Scrape method
            const progressBar = document.querySelector('.ytp-progress-bar');
            const markers = document.querySelectorAll('.ytp-chapter-hover-container');
            const duration = player.getDuration();
            if (!progressBar || markers.length < 2 || !duration) return null;
            const totalWidth = progressBar.clientWidth;
            if (!totalWidth) return null;

            log('Chapters found via progress bar scraping.');
            const times = [0];
            let accumulatedWidth = 0;
            for (let i = 0; i < markers.length - 1; i++) {
                accumulatedWidth += markers[i].clientWidth;
                times.push((accumulatedWidth / totalWidth) * duration);
            }
            return [...new Set(times)].sort((a, b) => a - b);
        } catch {
            return null;
        }
    };

    /**
     * Handles the keydown event for chapter navigation.
     * @param {KeyboardEvent} e
     */
    const onKeydown = (e) => {
        // --- Navigation Logic ---
        // Check if Shift is held, the player is ready, and an arrow key is pressed.
        if (!state.isReady || !e.shiftKey || !['ArrowRight', 'ArrowLeft'].includes(e.key)) {
            return;
        }

        const activeElement = document.activeElement;
        const isTyping = activeElement?.isContentEditable || ['INPUT', 'TEXTAREA'].includes(activeElement?.tagName);
        if (isTyping) return;

        // Prevent default browser actions for Shift+Arrow (e.g., text selection)
        e.preventDefault();
        e.stopPropagation();

        // Fetch and cache chapters on the first use
        if (state.chapters === null) {
            state.chapters = fetchChapters(state.player) || [];
        }
        if (state.chapters.length === 0) return log('No chapters to navigate.');

        const currentTime = state.player.getCurrentTime();
        const currentIndex = state.chapters.findLastIndex(t => t <= currentTime);
        if (currentIndex === -1) return;

        if (e.key === 'ArrowRight') {
            if (currentIndex < state.chapters.length - 1) {
                state.player.seekTo(state.chapters[currentIndex + 1], true);
            }
        } else { // ArrowLeft
            const currentChapterStartTime = state.chapters[currentIndex];
            if (currentTime > currentChapterStartTime + REWIND_THRESHOLD && currentIndex > 0) {
                state.player.seekTo(currentChapterStartTime, true);
            } else {
                const prevChapterTime = (currentIndex > 0) ? state.chapters[currentIndex - 1] : 0;
                state.player.seekTo(prevChapterTime, true);
            }
        }
    };

    /**
     * Resets state and waits for the player to be ready on a new page/video.
     */
    const initializeForPage = () => {
        log('Initializing for new video...');
        state = { player: null, chapters: null, isReady: false };

        const interval = setInterval(() => {
            const player = document.getElementById('movie_player');
            if (player && typeof player.getDuration === 'function' && player.getDuration() > 0) {
                clearInterval(interval);
                state.player = player;
                state.isReady = true;
                log('Player is ready.');
            }
        }, 300);
    };

    // --- Entry Point ---
    document.addEventListener('keydown', onKeydown, true);
    document.addEventListener('yt-navigate-finish', initializeForPage);
    initializeForPage();
})();