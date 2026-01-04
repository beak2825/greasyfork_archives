// ==UserScript==
// @name         RYM Search Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces RateYourMusic media links with YouTube Music search queries
// @author       garden
// @match        https://rateyourmusic.com/release/*
// @match        https://rateyourmusic.com/song/*
// @icon         https://e.snmc.io/2.5/img/sonemic.png
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/552308/RYM%20Search%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/552308/RYM%20Search%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const DEBUG_MODE = true;
    const YOUTUBE_MUSIC_SEARCH_URL = 'https://music.youtube.com/search?q=';
    const TIDAL_SEARCH_URL = 'https://listen.tidal.com/search?q=';
    const SPOTIFY_SEARCH_URL = 'https://open.spotify.com/search/';

    // Logging function for debug messages
    const log = (message) => {
        if (DEBUG_MODE) {
            console.log('[RYM YouTube Music Search]', message);
        }
    };

    // Function to encode search query for URL
    function encodeSearchQuery(artist, albumOrSong) {
        const query = `${artist} ${albumOrSong}`;
        return encodeURIComponent(query);
    }

    // Function to determine if we're on a song page or release page
    function isSongPage() {
        return window.location.pathname.includes('/song/');
    }

    // Function to create YouTube Music search button
    function createYouTubeMusicButton(artist, albumOrSong) {
        const searchQuery = encodeSearchQuery(artist, albumOrSong);
        const searchUrl = YOUTUBE_MUSIC_SEARCH_URL + searchQuery;

        const button = document.createElement('a');
        button.href = searchUrl;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.className = 'ui_media_link_btn ui_media_link_btn_ytmusic';

        // Create YouTube Music icon as SVG data URL (official YouTube Music logo)
        const ytMusicIcon = `data:image/svg+xml;base64,${btoa(`
            <svg role="img" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                <rect width="32" height="32" fill="#ff0000"/>
                <g transform="translate(16,16) scale(0.9) translate(-12,-12)">
                    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" fill="white"/>
                </g>
            </svg>
        `)}`;

        button.style.cssText = `
            background-image: url(${ytMusicIcon});
            background-position: center center;
            background-repeat: no-repeat;
            border: none;
            background-size: 100% 100%;
            background-color: transparent;
            width: 32px;
            height: 32px;
            display: inline-block;
            margin: 2px;
            cursor: pointer;
            text-decoration: none;
        `;

        const contentType = isSongPage() ? 'song' : 'album';
        button.title = `Search "${artist} - ${albumOrSong}" on YouTube Music (${contentType})`;

        return button;
    }

    // Function to create Tidal search button
    function createTidalButton(artist, albumOrSong) {
        const searchQuery = encodeSearchQuery(artist, albumOrSong);
        const searchUrl = TIDAL_SEARCH_URL + searchQuery;

        const button = document.createElement('a');
        button.href = searchUrl;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.className = 'ui_media_link_btn ui_media_link_btn_tidal';

        // Create Tidal icon as SVG data URL (official Tidal logo, centered)
        const tidalIcon = `data:image/svg+xml;base64,${btoa(`
            <svg role="img" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                <rect width="32" height="32" fill="#000000"/>
                <g transform="translate(16,16) scale(0.9) translate(-12,-12)">
                    <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l-4.004 4.004 4.004 4.004 4.004-4.004L12.012 12l4.004-4.004-4.004-4.004zM16.042 7.996l3.979-3.979L24 7.996l-3.979 3.979z" fill="white"/>
                </g>
            </svg>
        `)}`;

        button.style.cssText = `
            background-image: url(${tidalIcon});
            background-position: center center;
            background-repeat: no-repeat;
            border: none;
            background-size: 100% 100%;
            background-color: transparent;
            width: 32px;
            height: 32px;
            display: inline-block;
            margin: 2px;
            cursor: pointer;
            text-decoration: none;
        `;

        const contentType = isSongPage() ? 'song' : 'album';
        button.title = `Search "${artist} - ${albumOrSong}" on Tidal (${contentType})`;

        return button;
    }

    // Function to create Spotify search button
    function createSpotifyButton(artist, albumOrSong) {
        const searchQuery = encodeSearchQuery(artist, albumOrSong);
        const searchUrl = SPOTIFY_SEARCH_URL + searchQuery;

        const button = document.createElement('a');
        button.href = searchUrl;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.className = 'ui_media_link_btn ui_media_link_btn_spotify';

        // Create Spotify icon as SVG data URL (official Spotify logo)
        const spotifyIcon = `data:image/svg+xml;base64,${btoa(`
            <svg role="img" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                <rect width="32" height="32" fill="#1DB954"/>
                <g transform="translate(16,16) scale(0.9) translate(-12,-12)">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="white"/>
                </g>
            </svg>
        `)}`;

        button.style.cssText = `
            background-image: url(${spotifyIcon});
            background-position: center center;
            background-repeat: no-repeat;
            border: none;
            background-size: 100% 100%;
            background-color: transparent;
            width: 32px;
            height: 32px;
            display: inline-block;
            margin: 2px;
            cursor: pointer;
            text-decoration: none;
        `;

        const contentType = isSongPage() ? 'song' : 'album';
        button.title = `Search "${artist} - ${albumOrSong}" on Spotify (${contentType})`;

        return button;
    }



    // Function to hide all existing media buttons on the page
    function hideAllExistingMediaButtons() {
        // Hide all ui_media_links_container elements on the page
        const allMediaContainers = document.querySelectorAll('.ui_media_links_container');
        allMediaContainers.forEach((container, index) => {
            container.style.display = 'none';
            log(`Hidden ui_media_links_container ${index + 1}`);
        });

        // Also hide ui_media_links as backup
        const allMediaLinks = document.querySelectorAll('.ui_media_links');
        allMediaLinks.forEach((container, index) => {
            container.style.display = 'none';
            log(`Hidden ui_media_links ${index + 1}`);
        });
    }

    // Function to process media link containers
    function processMediaLinkContainers() {
        const mediaContainers = document.querySelectorAll('[data-medialink="true"]');
        log(`Found ${mediaContainers.length} media link containers`);

        // First, hide all existing media buttons on the page
        hideAllExistingMediaButtons();

        mediaContainers.forEach((container, index) => {
            const artist = container.getAttribute('data-artists');
            const albumOrSong = container.getAttribute('data-albums'); // This is actually song title on song pages

            if (!artist || !albumOrSong) {
                log(`Container ${index + 1}: Missing artist or content data`);
                return;
            }

            const contentType = isSongPage() ? 'song' : 'album';
            log(`Container ${index + 1}: Artist="${artist}", ${contentType}="${albumOrSong}"`);

            // Check if we already added our buttons
            if (container.querySelector('.ytmusic-search-button')) {
                log(`Container ${index + 1}: Search buttons already exist`);
                return;
            }

            // Create search buttons
            const ytMusicButton = createYouTubeMusicButton(artist, albumOrSong);
            ytMusicButton.classList.add('ytmusic-search-button');

            const tidalButton = createTidalButton(artist, albumOrSong);
            tidalButton.classList.add('tidal-search-button');

            const spotifyButton = createSpotifyButton(artist, albumOrSong);
            spotifyButton.classList.add('spotify-search-button');

            // Create a wrapper for our custom buttons
            let customButtonsWrapper = container.querySelector('.custom-search-buttons');
            if (!customButtonsWrapper) {
                customButtonsWrapper = document.createElement('div');
                customButtonsWrapper.className = 'custom-search-buttons';
                customButtonsWrapper.style.cssText = `
                    margin-top: 5px;
                    margin-bottom: 5px;
                `;

                container.appendChild(customButtonsWrapper);
            }

            customButtonsWrapper.appendChild(ytMusicButton);
            customButtonsWrapper.appendChild(tidalButton);
            customButtonsWrapper.appendChild(spotifyButton);
            log(`Container ${index + 1}: Added YouTube Music, Tidal, and Spotify search buttons for ${contentType}`);
        });
    }

    // Function to observe DOM changes for dynamically loaded content
    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            let shouldHideButtons = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check for media link containers
                            if (node.matches('[data-medialink="true"]') ||
                                node.querySelector('[data-medialink="true"]')) {
                                shouldProcess = true;
                            }

                            // Check for media button containers being added
                            if (node.matches('.ui_media_links_container') ||
                                node.querySelector('.ui_media_links_container') ||
                                node.matches('.ui_media_links') ||
                                node.querySelector('.ui_media_links')) {
                                shouldHideButtons = true;
                            }
                        }
                    });
                }
            });

            // Hide buttons immediately when they appear
            if (shouldHideButtons) {
                log('Media buttons detected, hiding immediately');
                hideAllExistingMediaButtons();
            }

            if (shouldProcess) {
                log('DOM changes detected, reprocessing media containers');
                setTimeout(processMediaLinkContainers, 50);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        log('DOM observer started');
    }

    // Initialize the script
    function init() {
        log('Script starting...');
        log('Current URL:', window.location.href);

        // Immediately hide any existing media buttons
        hideAllExistingMediaButtons();

        // Process existing containers
        processMediaLinkContainers();

        // Set up observer for dynamic content
        observeChanges();

        // Run multiple quick checks to catch dynamic content faster
        setTimeout(processMediaLinkContainers, 100);
        setTimeout(processMediaLinkContainers, 500);
        setTimeout(processMediaLinkContainers, 1000);

        log('Script initialization complete');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
