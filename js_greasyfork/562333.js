// ==UserScript==
// @name         Hytale Caramelldansen Party
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Site Dance Caramelldansen (165 BPM)
// @author       Frank
// @match        https://hytale.com/*
// @match        https://*.hytale.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562333/Hytale%20Caramelldansen%20Party.user.js
// @updateURL https://update.greasyfork.org/scripts/562333/Hytale%20Caramelldansen%20Party.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Caramelldansen Speed verzió kb. 165 BPM
    const BPM = 165;
    const INTERVAL = 60000 / BPM; // kb. 363ms - még gyorsabb váltás!
    let hue = 0;
    let started = false;

    // Zene linkje (Caramelldansen - Swedish Original)
    const musicUrl = "https://www.youtube.com/watch?v=A67ZkAd1wmI&t=15s";

    function updateDisco() {
        // Minden címsor és link kiválasztása
        const elements = document.querySelectorAll('h1, h2, h3, h4');

        // Caramelldansen színek: rózsaszín, kék, sárga (gyorsabb hue ugrás)
        hue = (hue + 60) % 360;

        const color1 = `hsl(${hue}, 100%, 65%)`;
        const color2 = `hsl(${hue + 40}, 100%, 75%)`;

        elements.forEach(el => {
            if (el.innerText.trim().length > 0) {
                el.style.setProperty('background-image', `linear-gradient(135deg, ${color1}, ${color2})`, 'important');
                el.style.setProperty('-webkit-background-clip', 'text', 'important');
                el.style.setProperty('background-clip', 'text', 'important');
                el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
                el.style.setProperty('color', 'transparent', 'important');

                // Caramelldansen rázkódás effekt (opcionális, de illik hozzá)
                el.style.setProperty('display', 'inline-block', 'important');
                el.style.setProperty('transform', hue % 120 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)', 'important');

                el.style.setProperty('transition', `all ${INTERVAL/3}ms linear`, 'important');
            }
        });
    }

    function startEverything() {
        if (started) return;
        started = true;

        // 1. Zene megnyitása új fülön
        window.open(musicUrl, '_blank');

        // 2. Villogás indítása
        setInterval(updateDisco, INTERVAL);

        console.log("🍭 Caramelldansen Mode: ON! BPM: " + BPM);
    }

    // Első kattintásra indul
    window.addEventListener('click', startEverything, { once: true });

    console.log("🚀 Kattints a Hytale oldalon a Caramelldansen indításához!");
})();