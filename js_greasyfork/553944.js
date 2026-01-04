// ==UserScript==
// @name         BloodWars Interia Fix (ZdrasTools - z automatycznym nasłuchem)
// @namespace    https://zdrastools.neocities.org/
// @version      1.1
// @description  Naprawia linki do obrazków z bloodwars.interia.pl na bloodwars.pl, także dla obrazów ładowanych dynamicznie
// @match        *://zdrastools.neocities.org/moby/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553944/BloodWars%20Interia%20Fix%20%28ZdrasTools%20-%20z%20automatycznym%20nas%C5%82uchem%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553944/BloodWars%20Interia%20Fix%20%28ZdrasTools%20-%20z%20automatycznym%20nas%C5%82uchem%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // funkcja poprawiająca linki
    function fixImages() {
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes('bloodwars.interia.pl')) {
                img.src = img.src.replace('bloodwars.interia.pl', 'bloodwars.pl');
            }
        });
    }

    // popraw obrazki po załadowaniu
    fixImages();

    // obserwuj zmiany w DOM i popraw nowe obrazki
    const observer = new MutationObserver(() => {
        fixImages();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();