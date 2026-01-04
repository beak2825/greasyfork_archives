// ==UserScript==
// @name         Infinite favorited places on WplaceLive.
// @namespace    http://tampermonkey.net/
// @version      999999999999
// @description  Get infinite favoritable places on wplace with local saving
// @author       [F-22/A-76/B-2] Eclipsia discord@jave0977 reddit@Ok-Wing4243
// @match        *://wplace.live/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @downloadURL https://update.greasyfork.org/scripts/550882/Infinite%20favorited%20places%20on%20WplaceLive.user.js
// @updateURL https://update.greasyfork.org/scripts/550882/Infinite%20favorited%20places%20on%20WplaceLive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = "wplaceInfiniteFavorites_"

    function getLocal(key) {
        return localStorage.getItem(storageKey + key)
    }

    function setLocal(key, value) {
        return localStorage.setItem(storageKey + key, value)
    }

    function updateLocal() {
        setLocal("favorites", JSON.stringify(Object.fromEntries(FAVORITES.entries())));
        setLocal("index", nextAvailableIndex)
    }

    function createFake(jsonData) {
        const fake = {
            json: async () => jsonData,
            clone: () => fake,
            status: 200,
            headers: new Headers()
        };
        return fake;
    }

    let nextAvailableIndex = parseInt(getLocal("index") || 0);
    console.log("nextAvailableIndex " + nextAvailableIndex);
    
    let FAVORITES;
    try {
        FAVORITES = new Map(Object.entries(JSON.parse(getLocal("favorites"))).map(([k, v]) => [parseInt(k), v]));
    } catch (err) {
        FAVORITES = new Map();
        updateLocal();

        console.error("[Tampermonkey] Failed to parse favorites, resetting:", err);
        console.log(getLocal("favorites"))
    }

    let maximumFavorites = 15;
    let serverSideFavorites = [];

    const windowFetch = window.fetch;
    const toString = Function.prototype.toString;


    window.fetch = async (req, options) => {
        let target = "";
        if (typeof req == "string") target = req;
        else if (req instanceof Request) target = req.url;
        else if (req instanceof URL) target = req.href;

        if (target.endsWith("favorite-location/delete")) {
            const body = JSON.parse(options.body);

            if (FAVORITES.has(body.id)) {
                FAVORITES.delete(body.id);
                updateLocal()

                console.log(`Deleted local favorite with id '${body.id}', success: ${!FAVORITES.has(body.id)}`)
                return createFake({ success: true })

            } else if (serverSideFavorites.find(f => f.id == body.id))  {
                serverSideFavorites =
                serverSideFavorites?.filter(
                    f => f.id !== body.id
                )
                console.log(
                    `Server side favorite deleted with id '${body.id}',`
                    +` success: ${!serverSideFavorites.find(f => f.id == body.id)}`
                )

            } else {
                throw Error(`Found unknown favorite with id '${body.id}'.`)
            };
        }

        if (target.endsWith("favorite-location")) {
            if (
                (FAVORITES.size 
                + (serverSideFavorites?.length ?? 0)) >= maximumFavorites
            ) {
                const body = JSON.parse(options.body);
                const fav = {
                    id: nextAvailableIndex,
                    longitude: body.longitude,
                    latitude: body.latitude,
                    name: body.name || ""
                };

                nextAvailableIndex--;
                FAVORITES.set(fav.id, fav);
                updateLocal()

                console.log(`New local favorite allocated with id '${fav.id}', current favorites:`)
                console.log(FAVORITES)

                return createFake({ id: fav.id, success: true })
            }
        }

        const origRes = await windowFetch(req, options);
        const res = origRes.clone();
        
        if (res.url.endsWith("/me")) {
            const json = await res.json();

            maximumFavorites = json.maxFavoriteLocations;
            serverSideFavorites = json.favoriteLocations;

            // careful with mutability
            json.favoriteLocations = [...serverSideFavorites, ...FAVORITES.values()];
            json.maxFavoriteLocations = Infinity;
            
            console.log(`Reinjected ${FAVORITES.size} local saves.`)
            origRes.json = async () => json;
        }
        
        return origRes;
    };

    window.savesInfo = () => {
        console.log(`Currently managing ${FAVORITES.size} local saves`)
        FAVORITES.size && console.log(FAVORITES)

        const spaceLeft = maximumFavorites - (serverSideFavorites.length + FAVORITES.size);
        console.log(`Maximum ${maximumFavorites} server side favorites. ${spaceLeft} more server side favorite storage left.`)
        console.log(`Next available index (always negative): ${nextAvailableIndex}`)
        console.log("serverSideFavorites")
        console.log(serverSideFavorites)
    }

    window.fetch.toString = toString;
})();
