// ==UserScript==
// @name         YouTube Lyrics Overlay
// @namespace    ext.columbo.ytlrc
// @version      0.12
// @description  Display song lyrics overlay on YouTube videos
// @author       columbo
// @match        https://www.youtube.com/watch?v=*
// @match        https://www.youtube.com/watch*
// @grant        GM_xmlhttpRequest
// @connect      api.lyrics.ovh
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/561375/YouTube%20Lyrics%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/561375/YouTube%20Lyrics%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lyricsOverlay = null;
    let lyricsButton = null;
    let isOverlayVisible = false;
    let currentVideoId = null;

    // Cache to avoid repeated API calls for same video
    const lyricsCache = {};

    // Create the lyrics button in the control bar
    function createLyricsButton() {
        if (lyricsButton) return;

        const rightControls = document.querySelector('.ytp-right-controls');
        if (!rightControls) {
            setTimeout(createLyricsButton, 500);
            return;
        }

        lyricsButton = document.createElement('button');
        lyricsButton.className = 'ytp-button';
        lyricsButton.title = 'Lyrics';
        lyricsButton.innerHTML = `
            <svg height="24" version="1.1" viewBox="0 0 24 24" width="24" style="display: block;">
                <path fill="white" d="M4,6h16v2H4V6z M4,10h16v2H4V10z M4,14h16v2H4V14z M4,18h10v2H4V18z"></path>
            </svg>
        `;
        lyricsButton.style.cssText = 'width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;';

        lyricsButton.addEventListener('click', toggleLyricsOverlay);
        rightControls.insertBefore(lyricsButton, rightControls.firstChild);
    }

    // Create the lyrics overlay
    function createLyricsOverlay() {
        if (lyricsOverlay) return;

        lyricsOverlay = document.createElement('div');
        lyricsOverlay.id = 'lyrics-overlay';
        lyricsOverlay.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 320px;
            height: calc(100% - 100px);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 0;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            overflow: hidden;
            z-index: 9999;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            pointer-events: auto;
        `;

        // Prevent scroll propagation to page when scrolling lyrics
        lyricsOverlay.addEventListener('wheel', function(e) {
            e.stopPropagation();
        }, { passive: true });

        lyricsOverlay.innerHTML = `
            <div style="padding: 15px 20px; font-weight: bold; font-size: 16px; border-bottom: 1px solid rgba(255,255,255,0.3); display: flex; justify-content: space-between; align-items: center; height: 56px; box-sizing: border-box;">
                <div id="lyrics-header" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Lyrics</div>
                <button id="lyrics-close-btn" style="background: none; border: none; color: white; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; opacity: 0.8; margin-left: 10px; flex-shrink: 0;" title="Close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div id="lyrics-content" style="white-space: pre-wrap; padding: 20px; overflow-y: auto; height: calc(100% - 56px); scrollbar-width: none; -ms-overflow-style: none;">
                Loading lyrics...
            </div>
            <style>
                #lyrics-content::-webkit-scrollbar {
                    display: none;
                }
            </style>
        `;

        // Add close button handler
        const closeBtn = lyricsOverlay.querySelector('#lyrics-close-btn');
        closeBtn.addEventListener('click', toggleLyricsOverlay);
        closeBtn.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
        });
        closeBtn.addEventListener('mouseleave', function() {
            this.style.opacity = '0.8';
        });

        const playerContainer = document.querySelector('#movie_player');
        if (playerContainer) {
            playerContainer.appendChild(lyricsOverlay);
        }
    }

    // Toggle overlay visibility
    function toggleLyricsOverlay() {
        if (!lyricsOverlay) {
            createLyricsOverlay();
        }

        isOverlayVisible = !isOverlayVisible;
        lyricsOverlay.style.display = isOverlayVisible ? 'block' : 'none';

        if (isOverlayVisible) {
            const videoId = getVideoId();
            if (videoId !== currentVideoId) {
                currentVideoId = videoId;
                fetchAndDisplayLyrics();
            }
        }
    }

    // Extract video ID from URL
    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    // Parse video title to extract artist and song
    function parseVideoTitle() {
        const titleElement = document.querySelector('h1.ytd-watch-metadata yt-formatted-string');
        if (!titleElement) return null;

        const title = titleElement.textContent.trim();

        // Try to get channel name (artist)
        const channelElement = document.querySelector('ytd-channel-name a');
        let channelName = channelElement ? channelElement.textContent.trim() : null;

        // Remove " - Topic" suffix from channel name if present
        if (channelName && channelName.endsWith(' - Topic')) {
            channelName = channelName.replace(/\s*-\s*Topic\s*$/i, '').trim();
        }

        // Common patterns:

        // Remove common suffixes
        let cleanTitle = title
            .replace(/\(.*?\)/g, '')  // Remove (Official Video), (Lyrics), etc.
            .replace(/\[.*?\]/g, '')  // Remove [Official Video], etc.
            .replace(/official\s*(video|audio|music\s*video)/gi, '')
            .replace(/lyrics?/gi, '')
            .trim();

        // Check if title has dash separator (Pattern 1)
        const parts = cleanTitle.split(/\s*[-–|]\s*/);

        if (parts.length >= 2) {
            let artist = parts[0].trim();
            let song = parts[1].trim();

            // Remove featuring artists from song title (ft., feat., featuring)
            song = song.replace(/\s+(ft\.?|feat\.?|featuring)\s+.+$/i, '').trim();

            return {
                artist: artist,
                song: song
            };
        }

        // Pattern 2 & 3: Use channel name as artist, title as song
        if (channelName) {
            // Also remove featuring artists when using channel name pattern
            let song = cleanTitle.replace(/\s+(ft\.?|feat\.?|featuring)\s+.+$/i, '').trim();

            return {
                artist: channelName,
                song: song
            };
        }

        return null;
    }

    // Fetch lyrics from API
    function fetchAndDisplayLyrics() {
        const lyricsContent = document.getElementById('lyrics-content');
        const lyricsHeader = document.getElementById('lyrics-header');
        if (!lyricsContent || !lyricsHeader) return;

        const videoId = getVideoId();

        // Check cache first
        if (lyricsCache[videoId]) {
            lyricsContent.innerHTML = lyricsCache[videoId].content;
            lyricsHeader.textContent = lyricsCache[videoId].header;
            return;
        }

        const trackInfo = parseVideoTitle();

        if (!trackInfo) {
            lyricsContent.innerHTML = 'Could not parse artist and song from video title.<br><br>Expected format: "Artist - Song Title"';
            lyricsHeader.textContent = 'Lyrics';
            return;
        }

        const displayTitle = trackInfo.song.length > 24 ? trackInfo.song.substring(0, 24) + '...' : trackInfo.song;
        lyricsHeader.textContent = displayTitle;
        lyricsContent.innerHTML = `Fetching lyrics for:<br><strong>${trackInfo.artist}</strong> - <strong>${trackInfo.song}</strong>...`;

        const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(trackInfo.artist)}/${encodeURIComponent(trackInfo.song)}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);

                    if (data.lyrics) {
                        // Clean up excessive newlines
                        let formattedLyrics = data.lyrics.trim();
                        formattedLyrics = formattedLyrics.replace(/\n\n\n/g, '\n\n');
                        formattedLyrics = formattedLyrics.replace(/\n\n/g, '\n');

                        const content = `${formattedLyrics}`;
                        lyricsContent.innerHTML = content;
                        lyricsCache[videoId] = {
                            content: content,
                            header: displayTitle
                        };
                    } else {
                        lyricsContent.innerHTML = 'Lyrics not found.';
                    }
                } catch (e) {
                    lyricsContent.innerHTML = 'Error parsing lyrics response.';
                }
            },
            onerror: function(response) {
                if (response.status === 404) {
                    lyricsContent.innerHTML = `Lyrics not found for:<br><strong>${trackInfo.artist}</strong> - <strong>${trackInfo.song}</strong>`;
                } else {
                    lyricsContent.innerHTML = 'Error fetching lyrics. Please try again.';
                }
            }
        });
    }

    // Initialize on page load
    function init() {
        createLyricsButton();

        // Watch for navigation changes
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                currentVideoId = null;

                // Reset UI for new video
                if (lyricsOverlay) {
                    lyricsOverlay.remove();
                    lyricsOverlay = null;
                }
                if (lyricsButton) {
                    lyricsButton.remove();
                    lyricsButton = null;
                }
                isOverlayVisible = false;

                // Recreate button for new page
                setTimeout(createLyricsButton, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();