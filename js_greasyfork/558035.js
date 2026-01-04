// ==UserScript==
// @name         SoundCloud Media Feed Tracker
// @version      1.0.0
// @author       LucasTavaresA
// @namespace    https://gist.github.com/LucasTavaresA/51b9a4b36dd7070f96abddf7948dae94
// @license      GPL-3.0-or-later
// @description  Track titles and artists of songs played on your soundcloud feed, and shows links as played, with exportSongs() feature.
// @grant        unsafeWindow
// @match        https://soundcloud.com/feed
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558035/SoundCloud%20Media%20Feed%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/558035/SoundCloud%20Media%20Feed%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function exportSongs() {
        const tracks = localStorage.getItem(STORAGE_KEY) || JSON.stringify([], null, 2);
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
                console.log(`📚 Loaded ${trackHistory.length} tracks from history`);
            }
        } catch (e) {
            console.error('Error loading history:', e);
            trackHistory = [];
        }
    }

    function saveHistory() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trackHistory, null, 2));
        } catch (e) {
            console.error('Error saving history:', e);
        }
    }

    function markPlayedTracks() {
        const playedUrls = new Set(trackHistory.map(t => t.url));

        document.querySelectorAll('a[href*="/"]').forEach(link => {
            const fullUrl = link.href;
            if (playedUrls.has(fullUrl)) {
                link.classList.add('sc-played-track');
            }
        });
    }

    function getTrackInfo() {
        const titleLink = document.querySelector('.playbackSoundBadge__titleLink');
        const artistLink = document.querySelector('.playbackSoundBadge__lightLink');

        if (!titleLink) return null;

        return {
            title: titleLink.getAttribute('title') || titleLink.textContent.trim(),
            artist: artistLink ? artistLink.textContent.trim() : 'Unknown',
            url: titleLink.href,
            timestamp: new Date().toISOString()
        };
    }

    function trackChanged() {
        const info = getTrackInfo();

        if (!info) return;

        if (info.url !== lastTrackUrl) {
            lastTrackUrl = info.url;

            const existingIndex = trackHistory.findIndex(t => t.url === info.url);

            if (existingIndex === -1) {
                trackHistory.push(info);
                saveHistory();
                setTimeout(markPlayedTracks, 200);
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

        let markTimeout;
        const observer = new MutationObserver(() => {
            trackChanged();
            clearTimeout(markTimeout);
            markTimeout = setTimeout(markPlayedTracks, 100);
        });

        observer.observe(playbackBar, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href', 'title']
        });

        let feedMarkTimeout;
        const feedObserver = new MutationObserver(() => {
            clearTimeout(feedMarkTimeout);
            feedMarkTimeout = setTimeout(markPlayedTracks, 100);
        });

        const feed = document.querySelector('.lazyLoadingList__list') || document.body;

        feedObserver.observe(feed, {
            childList: true,
            subtree: true
        });
    }

    const STORAGE_KEY = 'soundcloud_track_history';
    let lastTrackUrl = null;
    let trackHistory = [];

    if (window.location.href === "https://soundcloud.com/feed") {
        const style = document.createElement('style');
        style.textContent = `
        a:visited {
            color: grey !important;
            text-decoration: underline !important;
        }
        a.sc-played-track {
            color: grey !important;
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