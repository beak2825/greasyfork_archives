// ==UserScript==
// @name         Walki Gangów Timer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Jeden licznik walk gangów w rogu ekranu, działa na wszystkich stronach i nie resetuje się przy przejściu. Czas zapisany w pamięci przeglądarki (localStorage).
// @author       mleko95
// @match        https://g2.gangsters.pl/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/549123/Walki%20Gang%C3%B3w%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/549123/Walki%20Gang%C3%B3w%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "gangFightTimerEnd";

    // Parsowanie czasu hh:mm:ss
    function parseTime(str) {
        const parts = str.split(':').map(Number);
        return (parts[0] * 3600 + parts[1] * 60 + parts[2]);
    }

    // Formatowanie sekund do hh:mm:ss
    function formatTime(sec) {
        const h = String(Math.floor(sec / 3600)).padStart(2, '0');
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    // Tworzymy pływające okienko
    const timerBox = document.createElement("div");
    timerBox.style.position = "fixed";
    timerBox.style.top = "10px";
    timerBox.style.right = "10px";
    timerBox.style.minWidth = "90px";
    timerBox.style.padding = "8px";
    timerBox.style.backgroundColor = "rgba(0,0,0,0.75)";
    timerBox.style.color = "lime";
    timerBox.style.fontWeight = "bold";
    timerBox.style.textAlign = "center";
    timerBox.style.borderRadius = "8px";
    timerBox.style.zIndex = 9999;
    timerBox.style.fontSize = "16px";
    timerBox.textContent = "--:--:--";
    document.body.appendChild(timerBox);

    // Funkcja odliczania
    function startCountdown(endTime) {
        function update() {
            const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            if (remaining > 0) {
                timerBox.textContent = formatTime(remaining);
            } else {
                timerBox.textContent = "";
                if (!timerBox.querySelector("div")) {
                    const dot = document.createElement("div");
                    dot.style.width = "20px";
                    dot.style.height = "20px";
                    dot.style.backgroundColor = "green";
                    dot.style.borderRadius = "50%";
                    dot.style.margin = "0 auto";
                    dot.title = "Czas minął!";
                    timerBox.appendChild(dot);
                }
            }
        }
        update();
        setInterval(update, 1000);
    }

    // Jeśli jesteśmy na stronie walk gangów → pobieramy czas
    if (location.href.includes("module=gang/fights")) {
        const timerEl = document.querySelector("#fightTimer");
        if (timerEl) {
            const fightTime = parseTime(timerEl.textContent.trim()) + 1; // +5 sek.
            const endTimestamp = Date.now() + fightTime * 1000;
            localStorage.setItem(STORAGE_KEY, endTimestamp);
            startCountdown(endTimestamp);
            return;
        }
    }

    // Na innych stronach → odczytujemy zapisany czas
    const storedEnd = localStorage.getItem(STORAGE_KEY);
    if (storedEnd) {
        startCountdown(parseInt(storedEnd, 10));
    }
})();
