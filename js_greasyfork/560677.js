// ==UserScript==
// @name         Roblox Uncopylocked Filter
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Removes games from Uncopylocked searches that aren't actually uncopylocked
// @author       GooglyBlox
// @match        https://www.roblox.com/discover*
// @grant        GM_xmlhttpRequest
// @connect      games.roblox.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560677/Roblox%20Uncopylocked%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/560677/Roblox%20Uncopylocked%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isUncopylockSearch() {
        const url = new URL(window.location.href);
        const keyword = url.searchParams.get('Keyword') || '';
        return keyword.toLowerCase().includes('uncopylocked');
    }

    function getGameTiles() {
        return document.querySelectorAll('.game-card-container[data-testid="game-tile"]');
    }

    function getUniverseId(tile) {
        const link = tile.querySelector('.game-card-link');
        return link ? link.id : null;
    }

    function checkGames(universeIds) {
        return new Promise((resolve) => {
            if (universeIds.length === 0) {
                resolve({});
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://games.roblox.com/v1/games?universeIds=${universeIds.join(',')}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const results = {};
                        for (const game of data.data) {
                            results[game.id] = game.copyingAllowed;
                        }
                        resolve(results);
                    } catch (e) {
                        resolve({});
                    }
                },
                onerror: function() {
                    resolve({});
                }
            });
        });
    }

    async function filterTiles(tiles) {
        const tileMap = new Map();

        for (const tile of tiles) {
            const universeId = getUniverseId(tile);
            if (universeId && !tile.dataset.uncopylockedChecked) {
                tileMap.set(universeId, tile);
                tile.dataset.uncopylockedChecked = 'true';
            }
        }

        if (tileMap.size === 0) return;

        const universeIds = Array.from(tileMap.keys());
        const results = await checkGames(universeIds);

        for (const [universeId, tile] of tileMap) {
            const isUncopylocked = results[universeId];
            if (isUncopylocked === false) {
                tile.remove();
            }
        }
    }

    async function processPage() {
        if (!isUncopylockSearch()) return;

        const tiles = getGameTiles();
        await filterTiles(tiles);
    }

    function init() {
        processPage();

        const observer = new MutationObserver((mutations) => {
            let hasNewTiles = false;
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches?.('.game-card-container[data-testid="game-tile"]') ||
                            node.querySelector?.('.game-card-container[data-testid="game-tile"]')) {
                            hasNewTiles = true;
                            break;
                        }
                    }
                }
                if (hasNewTiles) break;
            }

            if (hasNewTiles) {
                processPage();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(processPage, 500);
            }
        });

        urlObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();