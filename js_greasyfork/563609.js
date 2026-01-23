// ==UserScript==
// @name           Last.fm: External Links Popup
// @namespace      https://github.com/deathrashed/userscripts
// @description    Quick-access popup ⁖ for external links on Last.fm artist pages. Creates a small ⁖ in front of each artist link on www.last.fm. Clicking it opens a popup menu with external services, updated based on the clicked artist.
// @icon           https://cdn.icon-icons.com/icons2/808/PNG/512/lastfm_icon-icons.com_66107.png
// @match          https://www.last.fm/*
// @match          https://www.lastfm.*/*
// @match          https://cn.last.fm/*
// @version        1
// @license        MIT
// @grant          GM_addStyle
// @author         deathrashed
// @downloadGIT    https://raw.githubusercontent.com/deathrashed/lastfm-userscript/main/lastfm-external-links-popup.user.js
// @updateGIT      https://raw.githubusercontent.com/deathrashed/lastfm-userscript/main/lastfm-external-links-popup.user.js
// @downloadURL https://update.greasyfork.org/scripts/563609/Lastfm%3A%20External%20Links%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/563609/Lastfm%3A%20External%20Links%20Popup.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // Include popup styling and logic from the expanded script
    GM_addStyle(`
        .LMAa {
            font-size: 70% !important;
            display: inline-block;
            padding-right: 2px;
            cursor: pointer;
            position: relative;
            z-index: 10;
            user-select: none;
        }
        .grid-items-item-aux-text .LMAa, .featured-item-details .LMAa {
            float: left;
            margin-right: 0.5em;
        }
        #external-music-button {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 40px;
            height: 40px;
            background: #282828;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            z-index: 9999;
            display: none; /* Hide the button since dots trigger the menu */
        }
        #external-music-button:hover {
            background: #3a3a3a;
        }
        #external-music-menu {
            position: fixed;
            bottom: 70px;
            left: 20px;
            background: #282828;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            padding: 10px 0;
            display: none;
            z-index: 9999;
            min-width: 200px;
            max-height: 600px; /* Increased for more links */
            overflow-y: auto;
            direction: rtl; /* Puts scrollbar on the left */
        }
        #external-music-menu::-webkit-scrollbar {
            width: 6px; /* Thinner scrollbar */
        }
        #external-music-menu::-webkit-scrollbar-track {
            background: #282828; /* Dark track */
        }
        #external-music-menu::-webkit-scrollbar-thumb {
            background: #666; /* Dark thumb */
        }
        #external-music-menu::-webkit-scrollbar-thumb:hover {
            background: #999; /* Lighter on hover */
        }
        #external-music-menu.visible {
            display: block;
        }
        #external-music-menu p {
            margin: 0;
            padding: 5px 15px;
            color: #999;
            font-size: 12px;
            direction: ltr; /* Keep text left-to-right */
        }
        #external-music-menu .menu-section {
            color: #DA2323 !important; /* Last.fm red for subheadings */
        }
        #current-context {
            color: #FF1B20 !important; /* Red for the selection, with !important to override */
            font-size: 16px; /* Increased for better visibility */
            font-weight: bold;
            direction: ltr; /* Keep text left-to-right */
        }
        #external-music-menu a {
            display: block;
            padding: 8px 15px;
            color: white !important;
            text-decoration: none !important;
            font-size: 13px; /* Slightly smaller font for options */
            direction: ltr; /* Keep text left-to-right */
        }
        #external-music-menu a:hover {
            background: #3a3a3a;
            color: #DA2323 !important; /* Last.fm red */
        }
        #external-music-menu hr {
            margin: 8px 0;
            border: none;
            height: 1px;
            background: #444;
            direction: ltr; /* Keep horizontal rule normal */
        }
        #external-music-menu a.disabled {
            color: #666 !important;
            pointer-events: none;
        }
    `);
 
    // Variables for current context (from popup script)
    let currentArtist = '';
    let currentAlbum = '';
 
    // Setup popup UI (adapted from expanded script)
    function setupUI() {
        // Create button (hidden, as dots will trigger)
        const button = document.createElement('div');
        button.id = 'external-music-button';
        button.innerHTML = '⌘';
        button.title = 'External Music Services';
        document.body.appendChild(button);
 
        // Create menu with expanded and categorized links (added Fanart.tv and Musixmatch, separator before Databases)
        const menu = document.createElement('div');
        menu.id = 'external-music-menu';
        menu.innerHTML = `
            <p id="current-context"></p>
            <hr>
            <p class="menu-section">Databases</p>
            <a href="#" id="google-band-link" target="_blank" title="Search Google for Band">Google</a>
            <a href="#" id="metal-archives-link" target="_blank" title="Search on Metal Archives">Metal Archives</a>
            <a href="#" id="rym-link" target="_blank" title="Search on Rate Your Music">Rate Your Music</a>
            <a href="#" id="discogs-link" target="_blank" title="Search on Discogs">Discogs</a>
            <a href="#" id="musicbrainz-link" target="_blank" title="Search on MusicBrainz">MusicBrainz</a>
            <hr>
            <p class="menu-section">Streaming</p>
            <a href="#" id="spotify-link" target="_blank" title="Search on Spotify">Spotify</a>
            <a href="#" id="youtube-link" target="_blank" title="Search on YouTube">YouTube</a>
            <a href="#" id="apple-music-link" target="_blank" title="Search on Apple Music">Apple</a>
            <a href="#" id="bandcamp-link" target="_blank" title="Search on Bandcamp">Bandcamp</a>
            <a href="#" id="soundcloud-link" target="_blank" title="Search on SoundCloud">SoundCloud</a>
            <a href="#" id="deezer-link" target="_blank" title="Search on Deezer">Deezer</a>
            <hr>
            <p class="menu-section">Lyrics</p>
            <a href="#" id="genius-link" target="_blank" title="Search on Genius">Genius</a>
            <a href="#" id="darklyrics-link" target="_blank" title="Search on DarkLyrics">Dark Lyrics</a>
            <a href="#" id="google-lyrics-link" target="_blank" title="Search Google for Lyrics">Google</a>
            <a href="#" id="musixmatch-link" target="_blank" title="Search on Musixmatch">Musixmatch</a>
            <hr>
            <p class="menu-section">Covers & Images</p>
            <a href="#" id="cov-musichoarderz-link" target="_blank" title="Search Covers on MusicHoarderz">COV - MusicHoarders</a>
            <a href="#" id="google-images-link" target="_blank" title="Search Large Images on Google">Google</a>
            <hr>
            <p class="menu-section">Social Media</p>
            <a href="#" id="instagram-link" target="_blank" title="Explore Tag on Instagram">Instagram</a>
            <a href="#" id="facebook-link" target="_blank" title="Search on Facebook">Facebook</a>
            <a href="#" id="reddit-link" target="_blank" title="Search on Reddit">Reddit</a>
            <hr>
            <p class="menu-section">Additional</p>
            <a href="#" id="wikipedia-link" target="_blank" title="Search on Wikipedia">Wikipedia</a>
            <a href="#" id="allmusic-link" target="_blank" title="Search on AllMusic">AllMusic</a>
            <a href="#" id="chosic-link" target="_blank" title="Search on Chosic">Chosic</a>
            <a href="#" id="spirit-of-metal-link" target="_blank" title="Search on Spirit of Metal">Spirit of Metal</a>
            <a href="#" id="metalstorm-link" target="_blank" title="Search on MetalStorm">Metal Storm</a>
            <a href="#" id="fanart-tv-link" target="_blank" title="Search on Fanart.tv">Fanart.tv</a>
            <hr>
            <p class="menu-section">AI</p>
            <a href="#" id="perplexity-link" target="_blank" title="Search on Perplexity">Perplexity</a>
            <a href="#" id="chatgpt-link" target="_blank" title="Search on ChatGPT">ChatGPT</a>
            <a href="#" id="you-link" target="_blank" title="Search on You">You</a>
            <a href="#" id="phind-link" target="_blank" title="Search on Phind">Phind</a>
        `;
        document.body.appendChild(menu);
 
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            const menu = document.getElementById('external-music-menu');
            const button = document.getElementById('external-music-button');
            if (e.target !== button && !menu.contains(e.target) && !e.target.classList.contains('LMAa')) {
                menu.classList.remove('visible');
            }
        });
 
        // Close menu on link click for better UX
        menu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                menu.classList.remove('visible');
            }
        });
    }
 
    // Update menu links (from popup script, adapted)
    function updateMenuLinks(artist, album) {
        const encodedArtist = encodeURIComponent(artist || '');
        const encodedAlbum = encodeURIComponent(album || '');
        const query = album ? `${encodedAlbum} ${encodedArtist}` : encodedArtist;
 
        // Update menu header with just the selection in red
        const contextEl = document.getElementById('current-context');
        if (artist && album) {
            contextEl.textContent = `${album} by ${artist}`;
        } else if (artist) {
            contextEl.textContent = artist;
        } else {
            contextEl.textContent = 'No artist/album detected';
        }
 
        // Disable links if no artist
        const links = document.querySelectorAll('#external-music-menu a');
        links.forEach(link => {
            if (!artist) {
                link.classList.add('disabled');
                link.href = '#';
            } else {
                link.classList.remove('disabled');
            }
        });
 
        if (!artist) return;
 
        // Update each link (prioritize album + artist where supported)
        if (album) {
            document.getElementById('metal-archives-link').href =
                `https://www.metal-archives.com/search?type=album_title&searchString=${encodeURIComponent(album + ' ' + artist)}`;
        } else {
            document.getElementById('metal-archives-link').href =
                `https://www.metal-archives.com/search?type=band_name&searchString=${encodedArtist}`;
        }
        document.getElementById('rym-link').href =
            `https://rateyourmusic.com/search?searchtype=${album ? 'l' : 'a'}&searchterm=${query}`;
        document.getElementById('discogs-link').href =
            `https://www.discogs.com/search/?q=${query}&type=${album ? 'release' : 'artist'}`;
        document.getElementById('musicbrainz-link').href =
            `https://musicbrainz.org/search?query=${query}&type=${album ? 'release' : 'artist'}`;
        document.getElementById('spotify-link').href =
            `https://open.spotify.com/search/${query}`;
        document.getElementById('youtube-link').href =
            `https://www.youtube.com/results?search_query=${query}`;
        document.getElementById('apple-music-link').href =
            `https://music.apple.com/us/search?term=${query}`;
        document.getElementById('bandcamp-link').href =
            `https://bandcamp.com/search?q=${query}`;
        document.getElementById('soundcloud-link').href =
            `https://soundcloud.com/search?q=${query}`;
        document.getElementById('deezer-link').href =
            `https://www.deezer.com/search/${query}`;
        // Lyrics section
        document.getElementById('genius-link').href =
            `https://genius.com/search?q=${query}`;
        document.getElementById('darklyrics-link').href =
            `http://www.darklyrics.com/search?q=${query}`;
        document.getElementById('google-lyrics-link').href =
            `https://www.google.com/search?q=${query}+lyrics`;
        document.getElementById('musixmatch-link').href =
            `https://www.musixmatch.com/search?query=${query}`;
        // COV - MusicHoarderz: Artist-focused
        document.getElementById('cov-musichoarderz-link').href =
            `https://covers.musichoarders.xyz?artist=${encodedArtist}`;
        // Social and general: Use query (album + artist or artist)
        document.getElementById('instagram-link').href =
            `https://www.instagram.com/explore/search/keyword/?q=${encodedArtist}+band`;
        document.getElementById('facebook-link').href =
            `https://www.facebook.com/search/top?q=${query}`;
        document.getElementById('reddit-link').href =
            `https://www.reddit.com/search/?q=${query}`;
        document.getElementById('google-band-link').href =
            `https://www.google.com/search?q=${query}+band`;
        document.getElementById('google-images-link').href =
            `https://www.google.com/search?tbm=isch&q=${query}+band&tbs=isz:l`;
        // Additional section
        document.getElementById('wikipedia-link').href =
            `https://en.wikipedia.org/wiki/${encodedArtist}`;
        document.getElementById('allmusic-link').href =
            `https://www.allmusic.com/search/all/${query}`;
        document.getElementById('chosic-link').href =
            `https://www.chosic.com/search-results/?q=${query}`;
        document.getElementById('spirit-of-metal-link').href =
            `https://www.spirit-of-metal.com/liste_groupe.php?recherche_groupe=${encodedArtist}&lettre=&id_pays_recherche=0&id_style_recherge=0&dateCrea=0&nb_etoile=0`;
        if (album) {
            document.getElementById('metalstorm-link').href =
                `https://metalstorm.net/bands/albums.php?a_where=a.albumname&a_what=${encodedAlbum}`;
        } else {
            document.getElementById('metalstorm-link').href =
                `https://metalstorm.net/bands/index.php?b_where=b.bandname&b_what=${encodedArtist}`;
        }
        document.getElementById('fanart-tv-link').href =
            `https://fanart.tv/add-entry/?tab=music&search=${encodedArtist}#music`;
        // AI section
        const aiPrompt = encodeURIComponent(`give me a comprehensive overview of the band ${artist}`);
        document.getElementById('perplexity-link').href =
            `https://www.perplexity.ai/search/new?q=${aiPrompt}`;
        document.getElementById('chatgpt-link').href =
            `https://chatgpt.com/?prompt=${aiPrompt}`;
        document.getElementById('you-link').href =
            `https://you.com/search?q=${aiPrompt}`;
        document.getElementById('phind-link').href =
            `https://www.phind.com/search?q=${aiPrompt}`;
    }
 
    // Function to show popup with artist context
    function showPopupForArtist(artistName) {
        currentArtist = artistName.replace(/\+/g, ' '); // Removed .toLowerCase() to preserve case
        currentAlbum = ''; // Dots are for artists, so no album
        updateMenuLinks(currentArtist, currentAlbum);
        const menu = document.getElementById('external-music-menu');
        menu.classList.add('visible');
    }
 
    const selector = 'a:not(.auth-dropdown-menu-item):not([aria-hidden="true"])[href^="/music"]';
    const headerSelector = 'h1.header-new-title[itemprop="name"]';
 
    function addDotLink(artistLink) {
        const artistPath = new URL(artistLink.href).pathname;
        const match = artistPath.match(/\/music\/([^/#]+)$/i);
        if (!match) return;
 
        const artistName = decodeURIComponent(match[1]);
        if (!artistName) return;
 
        const dotLink = createDotLink(artistName, artistLink);
        artistLink.parentNode.insertBefore(dotLink, artistLink);
    }
 
    function createDotLink(artistName, anchorEl) {
        const dotLink = document.createElement("span");
        dotLink.className = 'LMAa';
        dotLink.title = `Open external music services for ${artistName}`;
        dotLink.innerText = '⁖ '; // Changed to ⁖
        dotLink.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            showPopupForArtist(artistName);
        };
 
        const computedStyle = getComputedStyle(anchorEl);
        dotLink.style.color = computedStyle.color;
        dotLink.style.fontSize = computedStyle.fontSize;
 
        return dotLink;
    }
 
    function addDotLinks(node) {
        const nodeListA = node.querySelectorAll(selector);
        for (const artistLink of nodeListA) {
            addDotLink(artistLink);
        }
 
        const nodeListH1 = node.querySelectorAll(headerSelector);
        for (const headerElement of nodeListH1) {
            const headerText = headerElement.innerText;
            const dotLink = createDotLink(headerText, headerElement);
            headerElement.parentNode.insertBefore(dotLink, headerElement);
        }
    }
 
    // Initialize popup and dots (matching original exactly)
    setupUI();
    addDotLinks(document);
 
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    addDotLinks(node);
                }
            }
        }
    });
 
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();