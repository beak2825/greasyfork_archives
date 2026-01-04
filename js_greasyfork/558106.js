// ==UserScript==
// @name         Cookie clicker hacks.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  loads o fun
// @author       You
// @match        https://orteil.dashnet.org/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558106/Cookie%20clicker%20hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/558106/Cookie%20clicker%20hacks.meta.js
// ==/UserScript==

(function() {
    let y = 0;

    function SpawnGC() {
        if (y >= 10) { // spawn golden cookie every 10 ticks
            if (Game.goldenCookie) Game.goldenCookie.spawn();
            y = 0;
        }
    }

    function Crazy() {
        SpawnGC();
        const z = Math.floor(Math.random() * Game.ObjectsById.length);
        Game.Earn(Game.ObjectsById[z].price);
        Game.ObjectsById[z].buy();
        console.log("Bought object ID:", z);
    }

    // Save game every 1 second
    setInterval(() => { Game.WriteSave(); }, 1000);

    // Ask user for mode
    const mode = prompt("What mode?\nSpeed=1\nNormal=2\nHardcore=3\nCrazy=4");

    // Main loop every 100ms for fast automation
    setInterval(() => {
        y++;

        if (mode == "1") Game.priceIncrease = 1;
        else if (mode == "2") Game.priceIncrease = 1.15;
        else if (mode == "3") Game.priceIncrease = 1.45;

        if (mode == "4") Crazy();
    }, 10); // 100ms is much faster than 9999999ms
})();
