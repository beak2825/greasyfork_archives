// ==UserScript==
// @name         Random Anime button
// @author       Carson Parker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds buttons to get a random anime or manga with genre filters on AniList.
// @match        https://anilist.co/*
// @grant        GM_xmlhttpRequest
// @connect      graphql.anilist.co
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556594/Random%20Anime%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/556594/Random%20Anime%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GENRES = [
        "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo",
        "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life",
        "Sports", "Supernatural", "Thriller"
    ];

    const panel = document.createElement("div");
    panel.style = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #151f2e;
        color: White;
        padding: 14px;
        border-radius: 10px;
        z-index: 99999;
        width: 220px;
        font-size: 13px;
    `;

    panel.innerHTML = `
        <div style="font-weight:bold; margin-bottom:6px;">Random AniList</div>

        <div style="margin-bottom:6px;">Genres:</div>
        <div id="genre-box" style="max-height:120px; overflow-y:auto; border:1px solid #333; padding:6px; border-radius:6px;"></div>

        <button id="randomAnimeBtn" style="margin-top:10px; width:100%;">Random Anime</button>
        <button id="randomMangaBtn" style="margin-top:6px; width:100%;">Random Manga</button>
    `;

    document.body.appendChild(panel);

    // Insert genre checkboxes
    const genreBox = panel.querySelector("#genre-box");
    GENRES.forEach(g => {
        const row = document.createElement("label");
        row.style = "display:flex; align-items:center; margin-bottom:3px;";
        row.innerHTML = `<input type="checkbox" value="${g}" style="margin-right:6px;"> ${g}`;
        genreBox.appendChild(row);
    });

    function fetchRandom(type, genres) {
        const query = `
            query($page: Int, $genres: [String]) {
                Page(page: $page, perPage: 50) {
                    media(type: ${type}, genre_in: $genres, sort: POPULARITY_DESC) {
                        id
                    }
                }
            }
        `;

        const vars = {
            page: Math.floor(Math.random() * 10) + 1,
            genres: genres.length ? genres : null
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://graphql.anilist.co",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ query, variables: vars }),
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);
                    const items = data.data.Page.media;

                    if (!items || items.length === 0) {
                        alert("No results found with these filters.");
                        return;
                    }

                    const pick = items[Math.floor(Math.random() * items.length)];
                    window.location.href = `https://anilist.co/${type.toLowerCase()}/${pick.id}/`;
                } catch (e) {
                    alert("Error parsing response.");
                }
            },
            onerror: () => alert("Network error.")
        });
    }

    document.getElementById("randomAnimeBtn").onclick = () => {
        const genres = [...genreBox.querySelectorAll("input:checked")].map(i => i.value);
        fetchRandom("ANIME", genres);
    };

    document.getElementById("randomMangaBtn").onclick = () => {
        const genres = [...genreBox.querySelectorAll("input:checked")].map(i => i.value);
        fetchRandom("MANGA", genres);
    };

})();
