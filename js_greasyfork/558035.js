// ==UserScript==
// @name         SoundCloud Media Feed Tracker
// @version      1.0.2
// @author       LucasTavaresA
// @license      GPL-3.0-or-later
// @namespace    https://gist.github.com/LucasTavaresA/51b9a4b36dd7070f96abddf7948dae94
// @description  Track titles and artists of songs played on your soundcloud feed, and shows links as played, with exportSongs() feature.
// @grant        unsafeWindow
// @match        https://soundcloud.com/feed
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558035/SoundCloud%20Media%20Feed%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/558035/SoundCloud%20Media%20Feed%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'soundcloud_track_history';
    const MARK_CLASS = 'sc-played-track';
    const DEBOUNCE_DELAY = 200;

    let lastTrackUrl = null;
    let trackHistory = [];
    let playedUrlsSet = new Set();
    let markTimeout = null;

    function normalizeUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.origin + urlObj.pathname;
        } catch (e) {
            console.error('Error normalizing URL:', e);
            return url;
        }
    }

    function exportSongs() {
        const tracks = JSON.stringify(trackHistory, null, 2);
        const blob = new Blob([tracks], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sc-tracks.json';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    function loadHistory() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                trackHistory = JSON.parse(saved);
                playedUrlsSet = new Set(trackHistory.map(t => normalizeUrl(t.url)));
                console.log(`📚 Loaded ${trackHistory.length} tracks from history`);
            }
        } catch (e) {
            console.error('Error loading history:', e);
            trackHistory = [];
            playedUrlsSet = new Set();
        }
    }

    function saveHistory() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trackHistory));
        } catch (e) {
            console.error('Error saving history:', e);
        }
    }

    function markPlayedTracks() {
        const feedContainer = document.querySelector('.lazyLoadingList__list');
        if (!feedContainer) return;

        const links = feedContainer.querySelectorAll('a[href*="/"]');

        links.forEach(link => {
            const normalizedUrl = normalizeUrl(link.href);

            if (playedUrlsSet.has(normalizedUrl)) {
                link.classList.add(MARK_CLASS);
            }
        });
    }

    function scheduleMarkPlayedTracks() {
        if (markTimeout) {
            clearTimeout(markTimeout);
        }
        markTimeout = setTimeout(markPlayedTracks, DEBOUNCE_DELAY);
    }

    function getTrackInfo() {
        const titleLink = document.querySelector('.playbackSoundBadge__titleLink');
        const artistLink = document.querySelector('.playbackSoundBadge__lightLink');

        if (!titleLink) return null;

        return {
            title: titleLink.getAttribute('title') || titleLink.textContent.trim(),
            artist: artistLink ? artistLink.textContent.trim() : 'Unknown',
            url: normalizeUrl(titleLink.href),
            timestamp: new Date().toISOString()
        };
    }

    function trackChanged() {
        const info = getTrackInfo();

        if (!info) return;

        if (info.url !== lastTrackUrl) {
            lastTrackUrl = info.url;

            if (!playedUrlsSet.has(info.url)) {
                trackHistory.push(info);
                playedUrlsSet.add(info.url);
                saveHistory();
                scheduleMarkPlayedTracks();
            }
        }
    }

    function setupTracker() {
        const playbackBar = document.querySelector('.playControls__soundBadge');

        if (!playbackBar) {
            setTimeout(setupTracker, 1000);
            return;
        }

        loadHistory();
        markPlayedTracks();

        const observer = new MutationObserver(() => {
            trackChanged();
            scheduleMarkPlayedTracks();
        });

        observer.observe(playbackBar, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href', 'title']
        });

        const feedObserver = new MutationObserver(scheduleMarkPlayedTracks);
        const feed = document.querySelector('.lazyLoadingList__list') || document.body;

        feedObserver.observe(feed, {
            childList: true,
            subtree: true
        });
    }

    if (window.location.href === "https://soundcloud.com/feed") {
        const style = document.createElement('style');
        style.textContent = `
            a.${MARK_CLASS} {
                color: #f70 !important;
                text-decoration: underline !important;
            }
        `;
        document.head.appendChild(style);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupTracker);
        } else {
            setupTracker();
        }

        unsafeWindow.exportSongs = exportSongs;
    }
})();