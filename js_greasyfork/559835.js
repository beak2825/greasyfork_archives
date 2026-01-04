// ==UserScript==
// @name         Twitch Trending Ticker
// @namespace    https://github.com/gallantSirKnight
// @version      1.0
// @description  Adds a scrolling news ticker of trending streams to the top of Twitch.
// @author       gallantSirKnight
// @match        https://www.twitch.tv/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-body
// @connect      gql.twitch.tv
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559835/Twitch%20Trending%20Ticker.user.js
// @updateURL https://update.greasyfork.org/scripts/559835/Twitch%20Trending%20Ticker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const TICKER_HEIGHT = '32px';
    const REFRESH_RATE = 300000; // 5 minutes
    const CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko'; // Mobile Client ID
    const SCROLL_SPEED = '120s'; // Speed of the text

    // --- CSS STYLES ---
    // We use a specific class 'tm-ticker-active' to toggle layout shifts
    const cssStyles = `
        /* Default: Ticker is hidden to prevent flashes */
        #tm-ticker { display: none; }

        /* When Active: Show Ticker */
        body.tm-ticker-active #tm-ticker {
            display: flex;
            position: fixed; top: 0; left: 0; width: 100%; height: ${TICKER_HEIGHT};
            background: #0e0e10; color: #efeff1; z-index: 999999;
            align-items: center; border-bottom: 1px solid #333;
            font-family: sans-serif; font-size: 13px; white-space: nowrap;
        }

        /* When Active: Push Twitch UI down */
        body.tm-ticker-active .top-nav__container,
        body.tm-ticker-active nav.top-nav {
            top: ${TICKER_HEIGHT} !important;
            position: fixed !important;
        }
        body.tm-ticker-active {
            margin-top: ${TICKER_HEIGHT} !important;
            position: relative;
        }

        /* Ticker Components */
        #tm-label {
            background: #e91916; color: #fff; padding: 0 15px; height: 100%;
            display: flex; align-items: center; font-weight: 800; text-transform: uppercase;
            z-index: 10;
        }
        .tm-wrap { flex-grow: 1; overflow: hidden; position: relative; }
        .tm-move {
            display: inline-block; white-space: nowrap; padding-left: 100%;
            animation: tm-scroll ${SCROLL_SPEED} linear infinite;
        }
        .tm-move:hover { animation-play-state: paused; }

        @keyframes tm-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }

        .tm-item { display: inline-block; padding: 0 20px; border-right: 1px solid #333; color: #ccc; }
        .tm-item a { text-decoration: none; color: inherit; }
        .tm-item strong { color: #bf94ff; }
        .tm-viewers { color: #ff5555; font-weight: bold; }
    `;

    GM_addStyle(cssStyles);

    // --- UI SETUP ---
    function createUI() {
        if (document.getElementById('tm-ticker')) return;
        const div = document.createElement('div');
        div.id = 'tm-ticker';
        div.innerHTML = `
            <div id="tm-label">Live</div>
            <div class="tm-wrap">
                <div class="tm-move" id="tm-content">Loading streams...</div>
            </div>
        `;
        document.body.prepend(div);
    }

    // --- VISIBILITY LOGIC (The Smart Check) ---
    function checkVisibility() {
        // We only want to show the ticker on "Discovery" pages.
        // Paths where we WANT the ticker:
        // "/" (Homepage), "/directory" (Browse), "/search", "/friends"

        const path = window.location.pathname;
        const isStream = path !== '/' &&
                         !path.startsWith('/directory') &&
                         !path.startsWith('/search') &&
                         !path.startsWith('/downloads') &&
                         !path.startsWith('/settings');

        // Toggle the class on the body
        if (isStream) {
            // We are watching a stream -> Hide Ticker
            document.body.classList.remove('tm-ticker-active');
        } else {
            // We are browsing -> Show Ticker
            document.body.classList.add('tm-ticker-active');
        }
    }

    // --- API LOGIC ---
    function fetchStreams() {
        // Only fetch if ticker is actually visible to save resources
        if (!document.body.classList.contains('tm-ticker-active')) return;

        const query = `
        query GetTop {
            streams(first: 20, options: {sort: VIEWER_COUNT}) {
                edges {
                    node {
                        title
                        viewersCount
                        broadcaster { login displayName }
                        game { displayName }
                    }
                }
            }
        }`;

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://gql.twitch.tv/gql",
            headers: { "Client-ID": CLIENT_ID, "Content-Type": "application/json" },
            data: JSON.stringify({ query: query }),
            onload: function(res) {
                try {
                    const json = JSON.parse(res.responseText);
                    if (json.data && json.data.streams) {
                        render(json.data.streams.edges);
                    }
                } catch(e) {}
            }
        });
    }

    function render(edges) {
        let html = '';
        edges.forEach(edge => {
            const n = edge.node;
            if(!n) return;
            const v = n.viewersCount > 999 ? (n.viewersCount/1000).toFixed(1)+'k' : n.viewersCount;
            const game = n.game ? n.game.displayName : 'Variety';
            html += `
                <div class="tm-item">
                    <a href="/${n.broadcaster.login}">
                        <span class="tm-viewers">● ${v}</span>
                        <strong>${n.broadcaster.displayName}</strong>
                        [${game}]
                        ${n.title}
                    </a>
                </div>
            `;
        });
        document.getElementById('tm-content').innerHTML = html;
    }

    // --- STARTUP ---
    createUI();
    checkVisibility(); // Check immediately
    fetchStreams(); // Fetch immediately

    // Check visibility frequently (for SPA navigation)
    // This is cheap and ensures the bar disappears instantly when you click a stream
    setInterval(checkVisibility, 500);

    // Refresh data every 5 mins
    setInterval(fetchStreams, REFRESH_RATE);

})();
