// ==UserScript==
// @name         AMQ cover image + adjust UI (Fixed v6)
// @namespace    Racoonsaki
// @author       Racoonsaki + xTsuSaKu + nekomeiji
// @version      0.7.6
// @description  Display cover image, Adjust UI, and Show BR Map Coordinates
// @match        https://animemusicquiz.com/*
// @connect      graphql.anilist.co
// @connect      cdn.animenewsnetwork.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @license      MIT license
// @downloadURL https://update.greasyfork.org/scripts/559585/AMQ%20cover%20image%20%2B%20adjust%20UI%20%28Fixed%20v6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559585/AMQ%20cover%20image%20%2B%20adjust%20UI%20%28Fixed%20v6%29.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const URL_PREFIXES = {
        A: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/extraLarge/",
        B: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/",
        C: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/",
        N: "https://www.animenewsnetwork.com/images/encyc/"
    };

    const quizPage = document.getElementById("quizPage");
    const hider = document.getElementById('qpInfoHider');
    const GM_CACHE_KEY = "amqGmCoverCache";
    const LOCALSTORAGE_CACHE_KEY = "amqCoverCache";

    const oldCache = localStorage.getItem(LOCALSTORAGE_CACHE_KEY);
    if (oldCache) {
        try {
            JSON.parse(oldCache);
            await GM_setValue(GM_CACHE_KEY, oldCache);
            localStorage.removeItem(LOCALSTORAGE_CACHE_KEY);
            console.log("AMQ Cover Script: Cache migrated.");
        } catch (e) {
            localStorage.removeItem(LOCALSTORAGE_CACHE_KEY);
        }
    }

    let coverCache;
    try {
        const cachedString = await GM_getValue(GM_CACHE_KEY, "{}");
        coverCache = JSON.parse(cachedString);
    } catch (e) {
        coverCache = {};
        await GM_setValue(GM_CACHE_KEY, "{}");
    }

    function resolveCoverUrl([prefix, path]) {
        return URL_PREFIXES[prefix] + path;
    }

    function saveToCoverCache(annId, url) {
        if (!annId || !url) return;
        let prefix = null, path = null;
        if (url.includes("/extraLarge/")) { prefix = "A"; path = url.split("/extraLarge/")[1]; }
        else if (url.includes("/large/")) { prefix = "B"; path = url.split("/large/")[1]; }
        else if (url.includes("/medium/")) { prefix = "C"; path = url.split("/medium/")[1]; }
        else if (url.includes("/encyc/")) { prefix = "N"; path = url.split("/encyc/")[1]; }

        if (prefix && path) {
            coverCache[annId] = [prefix, path];
            GM_setValue(GM_CACHE_KEY, JSON.stringify(coverCache));
        }
    }

    async function fetchCoverImage(malId, annId, season, year, applyImageCallback) {
        const today = new Date();
        const isAprilFools = today.getMonth() === 3 && today.getDate() === 1;

        if (isAprilFools) {
            const [anilistImage, annImage] = await Promise.all([
                fetchFromAnilist(malId, season, year),
                fetchFromANN(annId)
            ]);
            const selected = anilistImage || annImage;
            if (selected && typeof applyImageCallback === "function") applyImageCallback(selected);
            return;
        }

        let cached = annId && coverCache[annId];
        const hasCache = !!cached;

        if (hasCache && typeof applyImageCallback === "function") {
            applyImageCallback(resolveCoverUrl(cached));
        }

        const [anilistImage, annImage] = await Promise.all([
            fetchFromAnilist(malId, season, year),
            fetchFromANN(annId)
        ]);

        const selected = anilistImage || annImage;

        if (selected) {
            const resolvedCachedUrl = cached ? resolveCoverUrl(cached) : null;
            if (selected !== resolvedCachedUrl) {
                saveToCoverCache(annId, selected);
                if (!hasCache && typeof applyImageCallback === "function") {
                    applyImageCallback(selected);
                }
            }
        }
    }

    function fetchFromAnilist(malId, season, year) {
        if (!malId || !year) return Promise.resolve(null);
        const isValidSeason = season && /^(winter|spring|summer|fall)$/i.test(season);
        const query = `
            query ($malId: Int, ${isValidSeason ? '$season: MediaSeason,' : ''} $seasonYear: Int) {
                Media(idMal: $malId, type: ANIME, ${isValidSeason ? 'season: $season,' : ''} seasonYear: $seasonYear) {
                    coverImage { extraLarge, large, medium }
                }
            }`;
        const variables = { malId, seasonYear: year };
        if (isValidSeason) variables.season = season.toUpperCase();

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://graphql.anilist.co/",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                data: JSON.stringify({ query, variables }),
                onload: (response) => {
                    try {
                        const { data, errors } = JSON.parse(response.responseText);
                        if (errors) {
                            if (isValidSeason) return resolve(fetchFromAnilist(malId, null, year));
                            return resolve(null);
                        }
                        const coverImage = data?.Media?.coverImage;
                        resolve(coverImage?.extraLarge || coverImage?.large || coverImage?.medium || null);
                    } catch (e) { resolve(null); }
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null)
            });
        });
    }

    function fetchFromANN(annId) {
        return new Promise((resolve) => {
            if (!annId) return resolve(null);
            const annUrl = `https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=${annId}`;
            GM_xmlhttpRequest({
                method: "GET",
                url: annUrl,
                onload: (response) => {
                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                        const imgNode = [...xmlDoc.querySelectorAll("anime > info[type='Picture']")].pop();
                        let imgUrl = imgNode?.getAttribute("src") || null;
                        if (imgUrl && imgUrl.includes("/encyc/")) {
                            const path = imgUrl.substring(imgUrl.indexOf("/encyc/"));
                            imgUrl = "https://www.animenewsnetwork.com/images" + path;
                        }
                        resolve(imgUrl);
                    } catch { resolve(null); }
                },
                onerror: () => resolve(null)
            });
        });
    }

    function createStyledElement(tag, attributes, styles) {
        const element = document.createElement(tag);
        Object.assign(element, attributes);
        Object.assign(element.style, styles);
        return element;
    }

    function handleVisibility(isVisible, element) {
        if (isVisible) {
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
            });
        } else {
            element.style.opacity = '0';
            setTimeout(() => {
                if (element.style.opacity === '0') element.style.visibility = 'hidden';
            }, 500);
        }
    }

    async function addCoverImage(imageUrl) {
        document.querySelector('.anime-cover-image-fixed-wrapper')?.remove();
        if (!imageUrl) return;

        const animeCoverContainer = document.querySelector('.anime-cover-image-container');
        if (!animeCoverContainer) return;

        const wrapper = createStyledElement('div', { className: 'anime-cover-image-fixed-wrapper' }, {
            maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%',
            zIndex: 9999, overflow: 'hidden', opacity: '0', transition: 'opacity 0.5s ease-in-out',
            visibility: 'hidden'
        });

        const coverImage = createStyledElement('img', {
            src: imageUrl, alt: "Anime Cover", className: 'anime-cover-image-fixed', loading: 'lazy'
        }, {
            width: '100%', height: '100%', objectFit: 'contain', transition: 'opacity 0.5s', opacity: '0'
        });

        wrapper.appendChild(coverImage);
        animeCoverContainer.appendChild(wrapper);

        coverImage.onload = async () => {
            try { await coverImage.decode(); } catch {}
            requestAnimationFrame(() => {
                wrapper.style.visibility = 'visible';
                wrapper.style.opacity = '1';
                coverImage.style.opacity = '1';
            });
        };
        coverImage.onerror = () => wrapper.remove();

        if (hider) {
            if (window._hiderObserver) window._hiderObserver.disconnect();
            handleVisibility(hider.classList.contains('hide'), wrapper);
            const observer = new MutationObserver(() => handleVisibility(hider.classList.contains('hide'), wrapper));
            observer.observe(hider, { attributes: true, attributeFilter: ['class'] });
            window._hiderObserver = observer;
        } else {
            wrapper.style.visibility = 'visible';
            wrapper.style.opacity = '1';
            coverImage.style.opacity = '1';
        }
    }

    function updateBrHud(tileId) {
        let hud = document.getElementById('amq-br-hud');
        if (!hud) {
            hud = createStyledElement('div', { id: 'amq-br-hud' }, {
                position: 'fixed',
                top: '60px',
                left: '20px',
                zIndex: '10000',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: '"Open Sans", sans-serif',
                border: '1px solid #2ecc71',
                pointerEvents: 'none',
                display: 'none'
            });
            document.body.appendChild(hud);
        }

        if (tileId) {
            hud.textContent = `📍 Tile: ${tileId.x} - ${tileId.y}`;
            hud.style.display = 'block';
        }
    }

    function hideBrHud() {
        const hud = document.getElementById('amq-br-hud');
        if (hud) hud.style.display = 'none';
    }

    const awaitFor = (predicate, timeout) => new Promise((resolve, reject) => {
        const check = () => predicate() && resolve(true);
        if (check()) return;
        const observer = new MutationObserver(() => { if (check()) observer.disconnect(); });
        observer.observe(document.body, { childList: true, subtree: true });
        if (timeout) setTimeout(() => { observer.disconnect(); reject(new Error('timeout')); }, timeout);
    });

    const onReady = (callback) => {
        awaitFor(() => document.getElementById('loadingScreen')?.classList.contains('hidden'), 15000)
            .then(callback).catch(console.error);
    };

    onReady(() => {
        if (typeof Listener !== 'undefined') {
            new Listener("answer results", (payload) => {
                if (!payload.songInfo) return;
                const { malId, annId } = payload.songInfo.siteIds;
                const vintage = payload.songInfo.vintage;
                const seasonInfo = payload.songInfo.seasonInfo;

                let season = null;
                let year = null;

                if (vintage) {
                    if (typeof vintage === 'string') {
                        const parts = vintage.trim().split(' ');
                        if (parts.length === 2) {
                            season = parts[0];
                            year = parseInt(parts[1], 10);
                        } else if (parts.length === 1) {
                            year = parseInt(parts[0], 10);
                        }
                    } else if (typeof vintage === 'object') {
                        if (vintage.data && vintage.data.year) year = parseInt(vintage.data.year, 10);
                        if (vintage.key) {
                            const keyParts = vintage.key.split('.');
                            const lastPart = keyParts[keyParts.length - 1];
                            if (/^(winter|spring|summer|fall)$/i.test(lastPart)) season = lastPart;
                        }
                    }
                }
                if (!year && seasonInfo && seasonInfo.number) year = parseInt(seasonInfo.number, 10);
                if (year && !isNaN(year)) fetchCoverImage(malId, annId, season, year, addCoverImage);
            }).bindListener();
        }

        const gameBR = window.battleRoyal || (typeof unsafeWindow !== 'undefined' && unsafeWindow.battleRoyal);

        if (gameBR && gameBR.map) {
            console.log("AMQ Cover Script: Hooking Battle Royale Map for coordinates.");

            const originalSetupTile = gameBR.map.setupTile;
            const originalClear = gameBR.map.clear;

            gameBR.map.setupTile = function (tileState, isSpectator, inventoryFull) {
                originalSetupTile.call(this, tileState, isSpectator, inventoryFull);
                updateBrHud(tileState.tileId);
            };

            gameBR.map.clear = function () {
                originalClear.call(this);
                hideBrHud();
            };
        }

        if (quizPage) {
            let styleElement = null;
            const observer = new MutationObserver(() => {
                const isQuizActive = quizPage.classList.contains('text-center') && !quizPage.classList.contains('hidden');
                const brPage = document.getElementById('battleRoyalPage');
                const isBrLootingPhase = brPage && !brPage.classList.contains('hidden');

                if (isQuizActive && !isBrLootingPhase) {
                    const chatContent = document.getElementById('gcChatContent');
                    if (chatContent && !chatContent.querySelector('.anime-cover-image-container')) {
                        const container = createStyledElement('div', { className: 'anime-cover-image-container' }, {
                            backgroundColor: 'transparent', display: 'flex', padding: '10px 15px',
                            alignItems: 'center', justifyContent: 'center', aspectRatio: '2 / 5', overflow: 'hidden', width: '100%'
                        });
                        chatContent.insertBefore(container, chatContent.firstChild);
                    }

                    if (!styleElement) {
                        styleElement = document.createElement('style');
                        styleElement.innerHTML = `
                            #gameChatContainer { position: absolute; bottom: 0; right: 0; width: 20%; height: 100%; }
                            #lobbyCountContainer { display: none; }
                            #qpExtraSongInfo + .popover { position: fixed !important; z-index: 9999; }
                            #gcMessageContainer { padding-top: 10px; padding-bottom: 5px; flex-grow: 1; border-top: 3px solid #5f5f5f70; overflow-y: auto; position: relative; }
                            #gcInputContainer { position: absolute; bottom: 0; width: 100%; height: 50px; }
                            .col-xs-9 { width: 80%; }
                            .qpRateOuterContainer, #qpSongInfoContainer, #qpStandingContainer {
                                width: 100% !important; height: 100% !important;
                                max-height: clamp(300px, 25vw, 450px); overflow-y: auto; position: relative;
                            }
                            #gcChatContent { display: flex; padding-bottom: 75px; flex-direction: column; overflow: hidden; height: 100%; }
                            #qpSongInfoContainer::-webkit-scrollbar, #gcMessageContainer::-webkit-scrollbar { width: 10px; background: #fff0; }
                            #qpSongInfoContainer::-webkit-scrollbar-thumb, #gcMessageContainer::-webkit-scrollbar-thumb { background: #ffffff26; border-radius: 10px; }
                            #qpSongInfoContainer::-webkit-scrollbar-thumb:hover, #gcMessageContainer::-webkit-scrollbar-thumb:hover { background: #5550; }
                            #qpInfoHider.custom-hider { width: 100%; min-height: 250%; position: absolute; top: 0; left: 0; }
                        `;
                        document.head.appendChild(styleElement);
                    }
                    const gcMessageContainer = document.getElementById("gcMessageContainer");
                    if (gcMessageContainer) setTimeout(() => { gcMessageContainer.scrollTop = gcMessageContainer.scrollHeight; }, 150);
                } else {
                    if (styleElement) {
                        styleElement.remove();
                        styleElement = null;
                        document.querySelector('#gcChatContent > .anime-cover-image-container')?.remove();
                        document.querySelector('.anime-cover-image-fixed-wrapper')?.remove();
                    }
                }
            });
            observer.observe(quizPage, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
        }
    });
})();