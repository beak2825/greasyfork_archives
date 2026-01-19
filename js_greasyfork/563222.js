// ==UserScript==
// @name         Beast Downloader
// @namespace    http://tampermonkey.net/
// @version      2026-01-16
// @description  Koji Tadokoro a.k.a Yaju Senpai
// @author       uqtfa
// @match        https://animemusicquiz.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      cdn.animenewsnetwork.com
// @connect      myanimelist.net
// @connect      anidb.net
// @require      https://cdn.jsdelivr.net/npm/string-similarity@4.0.4/umd/string-similarity.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563222/Beast%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/563222/Beast%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Consts
    const css = `
    .anime-dl-btn {
        color: #4497ea;
    }
    .anime-dl-window {
        display: none!important;
    }
    #animeJapaneseBtn {
        padding-left: 20px;
        width: fit-content;
        text-align: left;
        font-size: 25px;
        padding-right: 15px;
        top: 165px;
    }
    .text-link-btn {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;

        color: #4497ea;
    }
    .text-link-btn:hover {
        color: #337ab7;
    }
    #elExpandButtonContainer {
        height: 300px!important;
    }

    #beastModeBtn {
        padding-left: 20px;
        width: fit-content;
        text-align: left;
        font-size: 25px;
        padding-right: 15px;
        top: 220px;
    }`;

    // State
    let isBeastMode = false;

    // Utils
    const sleep = (time) => new Promise((r) => setTimeout(r, time));
    const parser = new DOMParser();
    const regex = /"(?:([^"(]+)\s*\((?![\x20-\x7E]+(?:\)|;))([^);]+)(?:;[^)]*)?\)|([^"]+)"\s*\((?![\x20-\x7E]+(?:\)|;))([^);]+)(?:;[^)]*)?\))/;
    const cleanString = (str) => str ? str.toLowerCase().normalize('NFKC').replace(/[^a-z0-9]/g, '') : "";
    const chunkArray = (arr, size) => arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr];

    // Helpers
    function observeSrc(target, timeout = 5000) {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, obs) => {
                for (const m of mutations) {
                    if (m.type === 'attributes' && m.attributeName === 'src') {
                        obs.disconnect();
                        resolve(target.getAttribute('src'));
                        return;
                    }
                }
            });

            observer.observe(target, {attributes: true, attributeFilter: ['src']});
            setTimeout(() => {
                observer.disconnect();
                resolve(target.getAttribute('src'));
            }, timeout);
        });
    }

    function observeHref(target, timeout = 2000) {
        if (target.getAttribute('href') && target.getAttribute('href') !== '#') {
            return Promise.resolve(target.getAttribute('href'));
        }
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, obs) => {
                for (const m of mutations) {
                    if (m.type === 'attributes' && m.attributeName === 'href') {
                        obs.disconnect();
                        resolve(target.getAttribute('href'));
                        return;
                    }
                }
            });

            observer.observe(target, {attributes: true, attributeFilter: ['href']});
            setTimeout(() => {
                observer.disconnect();
                resolve("#");
            }, timeout);
        });
    }

    async function getAniDBUrl(entry) {
        const malLink = entry.querySelector(".elMALLink");
        if (!malLink) throw new Error("MAL Link not found");

        const malResp = await GM.xmlHttpRequest({method: "GET", url: malLink.href});
        const malDoc = parser.parseFromString(malResp.responseText, "text/html");
        const anidbLink = malDoc.querySelector('a[data-ga-click-type="external-links-anime-pc-anidb"]');

        if (!anidbLink) throw new Error("AniDB Link not found on MAL");
        return anidbLink.href;
    }

    // Handlers
    async function handleAnisonClick(btn) {
        btn.disabled = true;
        const animeEntry = btn.closest('.elAnimeEntry');
        try {
            const anidbUrl = await getAniDBUrl(animeEntry);

            const anidbResp = await GM.xmlHttpRequest({method: "GET", url: anidbUrl});
            const anidbDoc = parser.parseFromString(anidbResp.responseText, "text/html");
            let anisonUrl = anidbDoc.querySelector('a[data-anidb-rel="anidb::extern"][title="Anison"]').href;
            window.open(anisonUrl, '_blank');
            btn.disabled = false;
        } catch (e) {
            console.error(e);
            btn.textContent = "AG Not found";
            btn.disabled = true;
        }
    }

    async function handleDownloadClick(btn) {
        if (document.querySelector("#elExpandFaqButton").classList.contains("hide")) {
            alert("You have to enable expand library!");
            return;
        }

        btn.innerText = isBeastMode ? "Running BEAST..." : "Fetching Info...";
        btn.disabled = true;

        const animeEntry = btn.closest('.elAnimeEntry');
        let animeName = animeEntry.querySelector(".elAnimeEntryNameInner").innerText;
        const songEntry = animeEntry.querySelectorAll(".elSongEntry");
        const videoWindow = document.querySelector("#elVideoPlayerWindow");
        const videoPlayer = document.querySelector("#elVideoPreviewPlayer");

        try {
            const annId = animeEntry.querySelector(".elANNLink").getAttribute("href").split("=")[1];
            const result = await GM.xmlHttpRequest({method: "GET", url: "https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=" + annId});
            const annXML = result.responseXML;

            const annTitles = annXML.querySelectorAll('info[type="Alternative title"]:is([lang="EN"],[lang="JA"])');
            if (annTitles.length > 0) animeName = annTitles[annTitles.length - 1].textContent;

            const annSonglist = [];
            const annSongs = annXML.querySelectorAll('info:is([type="Opening Theme"],[type="Ending Theme"],[type="Insert song"])');
            annSongs.forEach(song => {
                const match = song.textContent.match(regex);
                if (match) {
                    annSonglist.push({
                        original: match[1] || match[3],
                        japanese: match[2] || match[4]
                    });
                }
            });

            // Beast Mode
            let anidbSonglist = null;
            if (isBeastMode) {
                const anidbUrl = await getAniDBUrl(animeEntry);
                const anidbResp = await GM.xmlHttpRequest({method: "GET", url: anidbUrl});
                const anidbXML = parser.parseFromString(anidbResp.responseText, "text/html");
                const anidbName = anidbXML.querySelector('tr.official:has(span[title="language: japanese"]) label[itemprop="alternateName"]');
                if (anidbName) animeName = anidbName.textContent;
                anidbSonglist = Array.from(anidbXML.querySelectorAll("#songlist td.name.song a"));
            }

            btn.innerText = "Opening entries...";
            for (const song of songEntry) {
                if (!song.querySelector(".elSongInfoContainer.open")) song.querySelector(".elSongEntryHeader").click();
                await sleep(500);
            }

            videoWindow.classList.add('anime-dl-window');
            await sleep(500);

            for (let i = 0; i < songEntry.length; i++) {
                btn.innerText = `Downloading (${i + 1}/${songEntry.length})...`;

                let songName = songEntry[i].querySelector(".elSongEntryName").innerText;
                const songType = songEntry[i].querySelector(".elSongEntryTypeText").innerText;

                const changePromise = observeSrc(videoPlayer, 1000);
                const dlLink720 = songEntry[i].querySelector(".elSongExpandLink.elSongExpandLink720.uploaded.clickAble");
                const dlLink480 = songEntry[i].querySelector(".elSongExpandLink.elSongExpandLink480.uploaded.clickAble");
                if (dlLink720) dlLink720.click();
                else if (dlLink480) dlLink480.click();
                else continue;

                const dlLink = await changePromise;
                if (!dlLink) {
                    console.warn(`Failed to get source for ${songName}`);
                    continue;
                }

                // Beast Mode
                if (isBeastMode && anidbSonglist.length > 0) {
                    btn.innerText = `BEAST... (${i + 1}/${songEntry.length})`;
                    const matches = stringSimilarity.findBestMatch(cleanString(songName), anidbSonglist.map(m => cleanString(m.textContent)));

                    if (matches.bestMatch.rating >= 0.8) {
                        await sleep(1800);
                        const dbsongResp = await GM.xmlHttpRequest({method: "GET", url: "https://anidb.net" + anidbSonglist[matches.bestMatchIndex].getAttribute("href")});
                        let dbsongDoc = parser.parseFromString(dbsongResp.responseText, "text/html");
                        let dbsongName = dbsongDoc.querySelector('tr.official:has(span[title="language: japanese"]) label[itemprop="alternateName"]');
                        if (dbsongName) songName = dbsongName.textContent;
                    }
                } else if (!isBeastMode && annSonglist.length > 0) {
                    const matches = stringSimilarity.findBestMatch(cleanString(songName), annSonglist.map(m => cleanString(m.original)));
                    if (matches.bestMatch.rating >= 0.8) {
                        songName = annSonglist[matches.bestMatchIndex].japanese;
                    }
                }

                // Download
                GM_download({
                    url: dlLink,
                    name: `${animeName},${songType}_${songName}.webm`,
                    saveAs: false,
                    onerror: (e) => console.error("Download failed:", e)
                });
                await sleep(200);
            }

            videoWindow.querySelector(".close").click();
            videoWindow.classList.remove('anime-dl-window');
            for (const song of songEntry) {
                if (song.querySelector(".elSongInfoContainer.open")) song.querySelector(".elSongEntryHeader").click();
                await sleep(500);
            }
        } catch(e) {
            console.error("Error in download process:", e);
            alert("Error occurred.");
        } finally {
            btn.innerText = "Download";
            btn.disabled = false;
        }

    }

    async function handleTitleSearch(btn, label) {
        label.innerText = "Searching...";
        const animes = document.querySelectorAll('.elAnimeEntry');
        const annIds = [];

        for (let i = 0; i < animes.length; i++) {
            label.innerText = `Searching... (${i + 1}/${animes.length})`;
            const anime = animes[i];
            const annLink = anime.querySelector(".elANNLink");

            const changePromise = observeHref(annLink);
            anime.querySelector(".elAnimeEntryHeader").click();
            const newHref = await changePromise;
            if (newHref !== "#") {
                annIds.push(newHref.split("=")[1]);
            }
            await sleep(800);
        }

        const titleMap = {};
        for (const ids of chunkArray(annIds, 49)) {
            try {
                const result = await GM.xmlHttpRequest({method: "GET", url: "https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=" + ids.join("/")});
                const annXML = result.responseXML.querySelectorAll("anime");
                for (const node of annXML) {
                    const annId = node.getAttribute("id");
                    const titles = node.querySelectorAll('info[type="Alternative title"]:is([lang="EN"],[lang="JA"])');
                    if (titles.length > 0) {
                        titleMap[annId] = titles[titles.length - 1].textContent;
                    }
                }
            } catch (e) {
                console.error("fetch failed:", e);
            }
            await sleep(1000);
        }

        for (const anime of animes) {
            const link = anime.querySelector(".elANNLink");
            if (link.href === "#") continue;

            const id = link.href.split("=")[1];
            if (titleMap[id]) anime.querySelector(".elAnimeEntryNameInner").innerText = titleMap[id];
        }

        label.innerText = "Search JP Titles...";

    }

    // Observers
    function setupObservers() {
        const injectButtons = () => {
            const animeEntry = document.querySelectorAll(".elAnimeEntry");
            for (const anime of animeEntry) {
                const vintage = anime.querySelector(".elAnimeVintage");
                if (vintage && !vintage.nextElementSibling?.classList.contains('anime-downloader')) {
                    const div = document.createElement('div');
                    div.className = 'anime-downloader';
                    div.innerHTML = `<button type="button" class="anime-dl-btn">Download</button>`;
                    vintage.after(div);
                }

                const links = anime.querySelectorAll(".elEntryLink");
                const lastLink = links[links.length -1];
                if (lastLink.innerText === "ANN") {
                    const div = document.createElement('div');
                    div.className = 'elEntryLink';
                    div.innerHTML = `<button type="button" class="text-link-btn">Anison</button>`;
                    lastLink.after(div);
                }

            }
        };

        const targetNode = document.querySelector(".elEntryContainerInner");
        if (targetNode) {
            const observer = new MutationObserver((mutations) => injectButtons());
            observer.observe(targetNode, { childList: true, subtree: true });
            injectButtons();
        }

        const expandElement = document.querySelector("#elExpandButtonContainer");
        if (expandElement) {
            if (!expandElement.querySelector("#animeJapaneseBtn")) {
                const btnDiv = document.createElement("div");
                btnDiv.id = "animeJapaneseBtn";
                btnDiv.className = "topRightBackButton leftRightButtonTop clickAble";
                btnDiv.innerHTML = `<p>Search JP Titles...</p>`;
                btnDiv.onclick = () => handleTitleSearch(btnDiv, btnDiv.querySelector("p"));
                expandElement.appendChild(btnDiv);
            }
            if (!expandElement.querySelector("#beastModeBtn")) {
                const btnDiv = document.createElement("div");
                btnDiv.id = "beastModeBtn";
                btnDiv.className = "topRightBackButton leftRightButtonTop clickAble";
                btnDiv.innerHTML = `<p>Beast Mode: OFF</p>`;
                btnDiv.onclick = () => {
                    isBeastMode = !isBeastMode;
                    btnDiv.querySelector("p").innerHTML = isBeastMode ? 'Beast Mode: <span style="color: red;">ON</span>' : "Beast Mode: OFF";
                };
                expandElement.appendChild(btnDiv);
            }
        }
    }

    // Main
    GM_addStyle(css);
    document.addEventListener('click', (e) => {
        if (e.target.closest('.text-link-btn')) {
            e.preventDefault(); e.stopPropagation();
            handleAnisonClick(e.target.closest('.text-link-btn'));
        } else if (e.target.closest('.anime-dl-btn')) {
            e.preventDefault(); e.stopPropagation();
            handleDownloadClick(e.target.closest('.anime-dl-btn'));
        }
    });
    setupObservers();

})();