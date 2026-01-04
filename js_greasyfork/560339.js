// ==UserScript==
// @name         Seadex links on MyAnimeList
// @version      1.0
// @description  Adds Seadex links to MAL anime pages
// @match        https://myanimelist.net/anime/*
// @grant        GM_xmlhttpRequest
// @connect      graphql.anilist.co
// @connect      releases.moe
// @namespace https://greasyfork.org/users/1552842
// @downloadURL https://update.greasyfork.org/scripts/560339/Seadex%20links%20on%20MyAnimeList.user.js
// @updateURL https://update.greasyfork.org/scripts/560339/Seadex%20links%20on%20MyAnimeList.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* -------------------------
       GLOBAL INSERTION LOCK
    ------------------------- */
    let iconInserted = false;

    /* -------------------------
       Extract MAL ID
    ------------------------- */
    const malMatch = location.pathname.match(/\/anime\/(\d+)/);
    if (!malMatch) return;
    const malId = Number(malMatch[1]);

    /* -------------------------
       Icons
    ------------------------- */
    const ICON_GOOD =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAJCAYAAADHP4f4AAAAY0lEQVQoz2NgoAdQTRObBsT/sWAixcXnaWeJ8iCJT0MzdxqI87//VisGJlYcZhFMHNkhMD4DmiQKJkYcl0XIFjKQ5mI0F0KCBac8LOiwxgkW19DHJ5TGCUWpSyVJlHDqogcAAN7bTcDS2ZC5AAAAAElFTkSuQmCC';

    const ICON_ERROR =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAJCAYAAADHP4f4AAAAYElEQVQoz2NgoAdIZGCYBsT/sWCixOMZGOZlMTDwIIlPQzN3Gojz/yYWTKw4zKJEJD7MAhifAU0SBRMjjssiZAsZSHExhgshwYJTHhZ0WOPk5kD5hNI4oSh1xRGTuugBAE7U9sxO0JwGAAAAAElFTkSuQmCC';

    /* -------------------------
       MAL → AniList
    ------------------------- */
    function fetchAniListId() {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://graphql.anilist.co',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query ($idMal: Int) {
                          Media(idMal: $idMal, type: ANIME) {
                            id
                          }
                        }
                    `,
                    variables: { idMal: malId }
                }),
                onload(resp) {
                    try {
                        resolve(JSON.parse(resp.responseText)?.data?.Media?.id ?? null);
                    } catch {
                        resolve(null);
                    }
                },
                onerror() {
                    resolve(null);
                }
            });
        });
    }

    /* -------------------------
       Seadex API check
    ------------------------- */
    function hasReleasesEntry(aniId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://releases.moe/api/collections/entries/records?filter=alID=${aniId}&perPage=1&skipTotal=false`,
                onload(resp) {
                    try {
                        resolve(JSON.parse(resp.responseText).totalItems > 0);
                    } catch {
                        resolve(false);
                    }
                },
                onerror() {
                    resolve(false);
                }
            });
        });
    }

    /* -------------------------
       Insert once (polling)
    ------------------------- */
    async function tryInsertIcon(aniId) {
        if (iconInserted) return;

        const episodeDiv = document.querySelector('.di-ib.form-user-episode.ml8');
        if (!episodeDiv) return;

        iconInserted = true; // LOCK immediately

        let exists = false;
        if (aniId !== null) {
            exists = await hasReleasesEntry(aniId);
        }

        const img = document.createElement('img');
        img.className = 'releasesmoe-icon';
        img.src = exists ? ICON_GOOD : ICON_ERROR;
        img.title = exists
            ? 'View on Seadex'
            : aniId === null
                ? 'No AniList entry available'
                : 'No Seadex entry available';

        img.style.cssText = `
            height: 14px;
            margin-left: 6px;
            vertical-align: middle;
            cursor: ${exists ? 'pointer' : 'default'};
        `;

        if (exists) {
            img.onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://releases.moe/${aniId}/`, '_blank');
            };
        }

        episodeDiv.insertAdjacentElement('afterend', img);
    }

    /* -------------------------
       Main
    ------------------------- */
    (async () => {
        const aniId = await fetchAniListId();

        const interval = setInterval(() => {
            tryInsertIcon(aniId);
            if (iconInserted) clearInterval(interval);
        }, 300);
    })();
})();
