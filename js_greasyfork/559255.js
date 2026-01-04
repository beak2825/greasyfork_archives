// ==UserScript==
// @name         TMDb Ultimate Watch Extension
// @namespace    http://tampermonkey.net/
// @version      3.1
// @author       22KARKINOS
// @description  Watch Movie + TV with episode selection, servers, embedded player and download links right inside TMDb.
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/559255/TMDb%20Ultimate%20Watch%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/559255/TMDb%20Ultimate%20Watch%20Extension.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Insert your TMDb API Key here
    const TMDB_API_KEY = "b3556f3b206e16f82df4d1f6fd4545e6";

    // Streaming servers (Movie + TV)
    const SERVERS = {
        vixsrc: {
            movie: id => `https://vixsrc.to/movie/${id}`,
            tv: (id, s, e) => `https://vixsrc.to/tv/${id}/${s}/${e}`
        },
        vidsrc: {
            movie: id => `https://vidsrc-embed.ru/embed/movie?tmdb=${id}`,
            tv: (id, s, e) => `https://vidsrc-embed.ru/embed/tv?tmdb=${id}&season=${s}&episode=${e}`
        },
        godrive: {
            movie: id => `https://godriveplayer.com/player.php?type=movie&tmdb=${id}`,
            tv: (id, s, e) => `https://godriveplayer.com/player.php?type=series&tmdb=${id}&season=${s}&episode=${e}`
        },
        vidrock: {
            movie: id => `https://vidrock.net/movie/${id}`,
            tv: (id, s, e) => `https://vidrock.net/tv/${id}/${s}/${e}`
        },
        moviesapi: {
            movie: id => `https://moviesapi.club/movie/${id}`,
            tv: (id, s, e) => `https://moviesapi.club/tv/${id}-${s}-${e}`
        }
    };

    // Track URL changes (SPA-style navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            init();
        }
    }).observe(document, { childList: true, subtree: true });

    async function init() {
        const { type, id } = parseTmdbUrl(location.href);
        if (!type || !id) return;

        // Avoid duplicating the header
        if (document.querySelector("#tmdbWatchHeader")) return;

        createHeader(type, id);

        if (type === "tvSeries") {
            await loadSeasons(id);
            await loadEpisodes(id);
        }
    }

    function parseTmdbUrl(url) {
        const movieMatch = url.match(/themoviedb\.org\/movie\/(\d+)/);
        if (movieMatch) return { type: "movie", id: movieMatch[1] };

        const tvMatch = url.match(/themoviedb\.org\/tv\/(\d+)/);
        if (tvMatch) return { type: "tvSeries", id: tvMatch[1] };

        return { type: null, id: null };
    }

    function createHeader(type, id) {
        const header = document.createElement("div");
        header.id = "tmdbWatchHeader";
        header.style.cssText = `
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99999;
            background: #091f36;
            color: white;
            padding: 12px 20px;
            display: flex;
            gap: 20px;
            align-items: center;
            border-bottom: 2px solid #144166;
            font-size: 14px;
        `;

        header.innerHTML = `
            <strong style="font-size:16px;">🎬 Watch</strong>

            ${
                type === "tvSeries"
                    ? `
                <label>Season:</label>
                <select id="seasonSelect" style="padding:6px; border-radius:5px; background: #144166;"></select>

                <label>Episode:</label>
                <select id="episodeSelect" style="padding:6px; border-radius:5px;background: #144166;"></select>
                `
                    : ``
            }

            <label>Server:</label>
            <select id="serverSelect" style="padding:6px; border-radius:5px;background: #144166;">
                ${Object.keys(SERVERS).map(s => `<option value="${s}">${s}</option>`).join("")}
            </select>

            <button id="playBtnTMDB" style="
                padding: 8px 14px;
                background: #144166;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;">
                ▶️ Play
            </button>
            <button id="downloadBtnTMDB" style="
                padding: 8px 14px;
                background: #144166;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;">
                ⬇️ Download
            </button>

            <button id="toggleHeaderTMDB" style="
                margin-left:auto;
                padding:5px 10px;
                background:#0d253f;
                border:1px solid #144166;
                color:white;
                border-radius:5px;
                cursor:pointer;">
                Hide ▲
            </button>
        `;

        // Push site down so it doesn't overlap
        //document.body.style.marginTop = "70px";
        const style = document.createElement("style");
        style.innerHTML = `
    body > div.page_wrap.movie_wrap > header,
    body > div.page_wrap.tv_wrap > header{
        top: 60px !important;
    }
    #main {
        margin-top: 124px !important;
    }
`;
document.head.appendChild(style);
        document.body.prepend(header);

        // Player container
        const player = document.createElement("div");
        player.id = "playerAreaTMDB";
        player.style.cssText = `
            width: 100%;
            height: calc(100vh - 60px);
            background: black;
            margin-top: 60px;
            display: none;
        `;
        document.body.prepend(player);

        setupPlayer(type, id);
        downloadContent(type,id);
        setupToggle();
    }

    function setupToggle() {
        const button = document.querySelector("#toggleHeaderTMDB");
        const header = document.querySelector("#tmdbWatchHeader");

        button.onclick = () => {
            if (header.style.top === "-60px") {
                header.style.top = "0";
                button.innerText = "Hide ▲";
            } else {
                header.style.top = "-60px";
                button.innerText = "Show ▼";
            }
        };
    }

    async function loadSeasons(id) {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`);
        const show = await res.json();

        const seasonSelect = document.querySelector("#seasonSelect");
        seasonSelect.innerHTML = "";

        show.seasons.forEach(s => {
            if (s.season_number === 0) return;
            seasonSelect.innerHTML += `<option value="${s.season_number}">${s.name}</option>`;
        });

        seasonSelect.onchange = () => loadEpisodes(id);
    }

    async function loadEpisodes(id) {
        const season = document.querySelector("#seasonSelect").value;
        const res = await fetch(
            `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();

        const episodeSelect = document.querySelector("#episodeSelect");
        episodeSelect.innerHTML = "";

        data.episodes.forEach(ep => {
            episodeSelect.innerHTML += `<option value="${ep.episode_number}">
                ${ep.episode_number}. ${ep.name}
            </option>`;
        });
    }
    function downloadContent(type, id) {
        const btn = document.querySelector("#downloadBtnTMDB");

        btn.onclick = () => {
            console.log("hello");
            let url;

            if (type === "movie") {
                url = `https://dl.vidsrc.vip/movie/${id}`;
            } else {
                const season = document.querySelector("#seasonSelect").value;
                const episode = document.querySelector("#episodeSelect").value;
                url = `https://dl.vidsrc.vip/tv/${id}/${season}/${episode}`;
            }
            const style = document.createElement("style");
            style.innerHTML = `
            body > div.page_wrap.movie_wrap > header,body > div.page_wrap.tv_wrap > header {
                display: none !important;
            }
            `;
            document.head.appendChild(style);
            const area = document.querySelector("#playerAreaTMDB");
            area.style.display = "block";
            area.innerHTML = `<iframe src="${url}" style="width:100%; height:100%; border:0;" allowfullscreen></iframe>`;

            //window.open(url, "_blank", "noopener,noreferrer");
        };
    }

    function setupPlayer(type, id) {
        const btn = document.querySelector("#playBtnTMDB");

        btn.onclick = () => {
            const server = document.querySelector("#serverSelect").value;

            let url;

            if (type === "movie") {
                url = SERVERS[server].movie(id);
            } else {
                const season = document.querySelector("#seasonSelect").value;
                const episode = document.querySelector("#episodeSelect").value;
                url = SERVERS[server].tv(id, season, episode);
            }
            const style = document.createElement("style");
            style.innerHTML = `
    body > div.page_wrap.movie_wrap > header,body > div.page_wrap.tv_wrap > header {
        display: none !important;
    }
`;
            document.head.appendChild(style);

            const area = document.querySelector("#playerAreaTMDB");
            area.style.display = "block";
            area.innerHTML = `
                <iframe src="${url}" style="width:100%; height:100%; border:0;" allowfullscreen></iframe>
            `;
        };
    }

    init();
})();
