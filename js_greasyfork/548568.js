// ==UserScript==
// @name         AMC → Rotten Tomatoes + IMDb + Letterboxd Links
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Add Rotten Tomatoes, IMDb, and Letterboxd links/icons next to  movie titles on amctheatres site
// @author       Chatgpt and me
// @match        *://www.amctheatres.com/movie-theatres/*
// @match        *://www.amctheatres.com/movies/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548568/AMC%20%E2%86%92%20Rotten%20Tomatoes%20%2B%20IMDb%20%2B%20Letterboxd%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/548568/AMC%20%E2%86%92%20Rotten%20Tomatoes%20%2B%20IMDb%20%2B%20Letterboxd%20Links.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function cleanTitle(title) {
        let clean = title.trim();
        // General removals
        clean = clean.replace(/\bQ&A.*$/i, "");
        clean = clean.split("/")[0];
        clean = clean.replace(/[-–]\s*studio ghibli fest\s*\d{4}/gi, "");
        clean = clean.replace(/\bstudio ghibli fest\s*\d{4}/gi, "");
        clean = clean.replace(/\bstudio ghibli fest\b/gi, "");
        clean = clean.replace(/[-–]\s*\d+(st|nd|rd|th)?\s+anniversary\b/gi, "");
        clean = clean.replace(/\b\d+(st|nd|rd|th)?\s+anniversary\b/gi, "");
        clean = clean.replace(/\bunrated\b/gi, "");
        clean = clean.replace(/\b4k\b/gi, "");
        clean = clean.replace(/\b3d\b/gi, "");
        clean = clean.replace(/\bfathom\s*\d{4}\b/gi, "");
        clean = clean.replace(/\bfathom\b/gi, "");
        clean = clean.replace(/\bopening night fan event\b/gi, "");
        clean = clean.replace(/\bopening night\b/gi, "");
        clean = clean.replace(/\bfan event\b/gi, "");
        clean = clean.replace(/\bspecial screening\b/gi, "");
        clean = clean.replace(/\bdouble feature\b/gi, "");
        clean = clean.replace(/\([^)]*\)/g, "");
        // Targeted cleanups
        const cutPhrases = [
            " - Opening Weekend Event",
            "Private Theatre",
            "Early Access",
            "Sneak Peak",
            "IMAX",
            "Sensory Friendly Screening"
        ];
        for (let phrase of cutPhrases) {
            const regex = new RegExp(`[:\\-]?\\s*${phrase}.*$`, "i");
            clean = clean.replace(regex, "");
        }
        return clean.trim();
    }

    // Rotten Tomatoes slug
    function makeRtSlug(title) {
        let clean = cleanTitle(title).toLowerCase();
        clean = clean.replace(/&/g, " and ");
        clean = clean.replace(/[':;!?,.\-–]/g, "");
        clean = clean.replace(/\s+/g, "_");
        clean = clean.replace(/^_+|_+$/g, "");
        return clean.trim();
    }

    // Letterboxd slug
    function makeLbSlug(title) {
        let clean = cleanTitle(title)
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents
        clean = clean.replace(/&/g, " ");               // drop ampersands (treat as space)
        clean = clean.replace(/['":;!?,.]/g, "");       // remove punctuation
        clean = clean.replace(/[-–]/g, " ");            // treat dashes as spaces
        clean = clean.replace(/\s+/g, "-");             // spaces -> hyphens
        clean = clean.replace(/-+/g, "-");              // collapse multiple hyphens
        clean = clean.replace(/^-+|-+$/g, "");          // trim leading/trailing hyphens
        return clean.trim();
    }

    function addLinks() {
        const movieTitleEls = document.querySelectorAll("h2.font-bold, h3.font-bold, .md\\:text-2xl.font-bold");

        movieTitleEls.forEach(movieTitleEl => {
            const rawTitle = movieTitleEl.textContent.trim();
            if (!rawTitle || /amc/i.test(rawTitle)) return;
            if (movieTitleEl.querySelector(".rt-btn, .imdb-btn, .lb-btn")) return;

            // Rotten Tomatoes
            const rtSlug = makeRtSlug(rawTitle);
            const rtUrl = `https://www.rottentomatoes.com/m/${rtSlug}`;
            const rtLink = document.createElement("a");
            rtLink.href = rtUrl;
            rtLink.target = "_blank";
            rtLink.title = "View on Rotten Tomatoes";
            rtLink.className = "rt-btn";
            rtLink.style.cssText = `
                display:inline-flex;align-items:center;justify-content:center;
                background-color:#d92323;color:white;font-size:15px;font-weight:bold;
                text-decoration:none;border-radius:50%;width:24.5px;height:24.5px;
                margin-left:4px;vertical-align:middle;box-shadow:0 1px 3px rgba(0,0,0,0.2);
                cursor:pointer;
            `;
            rtLink.textContent = "🍅";

            // IMDb
            const imdbQuery = encodeURIComponent(cleanTitle(rawTitle));
            const imdbUrl = `https://www.imdb.com/find/?q=${imdbQuery}`;
            const imdbLink = document.createElement("a");
            imdbLink.href = imdbUrl;
            imdbLink.target = "_blank";
            imdbLink.title = "Search on IMDb";
            imdbLink.className = "imdb-btn";
            imdbLink.style.cssText = `
                display:inline-flex;align-items:center;justify-content:center;
                background-color:#f5c518;color:black;font-size:12px;font-weight:bold;
                text-decoration:none;border-radius:3px;width:32px;height:24.5px;
                margin-left:4px;vertical-align:middle;box-shadow:0 1px 3px rgba(0,0,0,0.2);
                cursor:pointer;font-family:Arial, sans-serif;
            `;
            imdbLink.textContent = "IMDb";

            // Letterboxd
            const lbSlug = makeLbSlug(rawTitle);
            const lbUrl = `https://letterboxd.com/film/${lbSlug}/`;
            const lbLink = document.createElement("a");
            lbLink.href = lbUrl;
            lbLink.target = "_blank";
            lbLink.title = "View on Letterboxd";
            lbLink.className = "lb-btn";
            lbLink.style.cssText = `
                display:inline-flex;align-items:center;justify-content:center;
                text-decoration:none;margin-left:4px;vertical-align:middle;cursor:pointer;
            `;
            lbLink.innerHTML = `
                <div style="display:flex;">
                    <div style="
                        width:24.5px;height:24.5px;border-radius:50%;background:#ff8000;
                        display:flex;align-items:center;justify-content:center;
                        font-size:12px;font-weight:bold;color:white;font-family:Arial, sans-serif;
                        box-shadow:0 1px 3px rgba(0,0,0,0.2);margin-right:-5px;">
                        L
                    </div>
                    <div style="
                        width:24.5px;height:24.5px;border-radius:50%;background:#00e054;
                        display:flex;align-items:center;justify-content:center;
                        font-size:12px;font-weight:bold;color:black;font-family:Arial, sans-serif;
                        box-shadow:0 1px 3px rgba(0,0,0,0.2);margin-right:-5px;">
                        T
                    </div>
                    <div style="
                        width:24.5px;height:24.5px;border-radius:50%;background:#00bfff;
                        display:flex;align-items:center;justify-content:center;
                        font-size:12px;font-weight:bold;color:black;font-family:Arial, sans-serif;
                        box-shadow:0 1px 3px rgba(0,0,0,0.2);">
                        B
                    </div>
                </div>
            `;

            movieTitleEl.appendChild(rtLink);
            movieTitleEl.appendChild(imdbLink);
            movieTitleEl.appendChild(lbLink);
        });
    }

    addLinks();
    const observer = new MutationObserver(addLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
