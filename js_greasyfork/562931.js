// ==UserScript==
// @name         Instagram Reels RAM Saver
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Usuwa z pamięci obejrzane Reelsy, aby odciążyć RAM. Działa tylko na podstronie /reels/.
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562931/Instagram%20Reels%20RAM%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/562931/Instagram%20Reels%20RAM%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // KONFIGURACJA
    const CHECK_INTERVAL = 1500; // Sprawdzaj co 1.5 sekundy
    // Jak wysoko w górę musi być film, żeby go usunąć (w pikselach).
    // Wartość 1000 oznacza mniej więcej "jeden lub dwa filmy temu".
    const DISTANCE_THRESHOLD = 1000;

    function cleanUpReels() {
        // 1. Sprawdź, czy użytkownik jest w sekcji Reels
        if (!window.location.href.includes('/reels/')) {
            return; // Jeśli nie jesteś w Reelsach, nic nie rób
        }

        // 2. Znajdź wszystkie elementy wideo
        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            const rect = video.getBoundingClientRect();

            // 3. Sprawdź, czy wideo jest "nad" ekranem (użytkownik przewinął w dół)
            // rect.bottom < -DISTANCE_THRESHOLD oznacza, że wideo jest głęboko u góry
            if (rect.bottom < -DISTANCE_THRESHOLD) {

                // Sprawdzamy, czy wideo ma jeszcze źródło (src), żeby nie czyścić już wyczyszczonych
                if (video.src || video.querySelector('source')) {

                    console.log('Reels RAM Saver: Usuwanie starego Reelsa z pamięci...');

                    // Zatrzymujemy odtwarzanie
                    video.pause();

                    // Usuwamy atrybuty źródłowe
                    video.removeAttribute('src');
                    video.querySelectorAll('source').forEach(source => source.remove());

                    // Ważne: to wymusza na przeglądarce zrzucenie bufora wideo z RAMu
                    video.load();

                    // Opcjonalnie: Ukrywamy element, żeby nie było widać czarnego pola (lub zostawiamy czarne)
                    // video.style.display = 'none';
                }
            }
        });
    }

    // Uruchom pętlę sprawdzającą
    setInterval(cleanUpReels, CHECK_INTERVAL);

})();