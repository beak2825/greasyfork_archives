// ==UserScript==
// @name         LoL Beans menu showing upcoming maps before they are displayed
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Detects maps before they appear.
// @match        https://lolbeans.io/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557456/LoL%20Beans%20menu%20showing%20upcoming%20maps%20before%20they%20are%20displayed.user.js
// @updateURL https://update.greasyfork.org/scripts/557456/LoL%20Beans%20menu%20showing%20upcoming%20maps%20before%20they%20are%20displayed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let maps = [];
    let overlay;

    // Mapping manuel (optionnel pour jolies corrections)
    const mapNames = {
        "UFOAttack": "UFO Attack",
        "RedLight123": "1‑2‑3 Red Light",
        "DevilsTrick": "Devil’s Trick"
        // tu peux ajouter d’autres cas spéciaux si tu veux
    };

    function initOverlay() {
        overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(50,50,50,0.9);
            padding: 10px 14px;
            border-radius: 12px;
            border: 2px solid #ffdc00;
            color: #fff;
            font-family: "Comic Sans MS", Arial, sans-serif;
            font-size: 13px;
            z-index: 99999999;
            max-width: 280px;
            box-shadow: 0 0 15px #ffdc00;
            cursor: grab;
            user-select: none;
        `;
        overlay.innerHTML = "<em>En attente de maps...</em>";
        document.body.appendChild(overlay);

        makeDraggable(overlay);
    }

    function updateOverlay() {
        if (!overlay) return;

        if (maps.length === 0) {
            overlay.innerHTML = "<em>En attente de maps...</em>";
            return;
        }

        overlay.innerHTML =
            `<strong>🗺 Maps détectées :</strong><br>` +
            maps.map(m => `• ${m}`).join("<br>");
    }

    function extractMap(text) {
        const match = text.match(/Switching to next map\s+([A-Za-z0-9_/.-]+)/i);
        if (!match) return null;
        let raw = match[1].split('/').pop().split('.')[0]; // FloorIsLava-v32

        // mapping manuel si présent
        if(mapNames[raw]) return mapNames[raw];

        // nettoyage automatique pour toutes les maps
        raw = raw.replace(/-v\d+$/i, ""); // supprime suffixe version
        raw = raw.replace(/([a-z])([A-Z])/g, "$1 $2"); // ajoute espaces entre majuscules
        raw = raw.replace(/_/g, " "); // remplace underscores par espace
        return raw;
    }

    function makeDraggable(el) {
        let isDown = false, offsetX, offsetY;

        el.addEventListener('mousedown', e => {
            isDown = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            el.style.opacity = '0.8';
            el.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', e => {
            if (!isDown) return;
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDown = false;
            el.style.opacity = '1';
            el.style.cursor = 'grab';
        });

        el.addEventListener('dblclick', () => {
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        });
    }

    const originalLog = console.log;
    console.log = function(...args) {
        originalLog.apply(console, args);

        const text = args.map(a =>
            typeof a === "object" ? JSON.stringify(a) : String(a)
        ).join(" ");

        if (/switching to next map/i.test(text)) {
            const mapName = extractMap(text);
            if (mapName && !maps.includes(mapName)) {
                maps.push(mapName);
                updateOverlay();
            }
        }
    };

    if (document.body) initOverlay();
    else window.addEventListener("DOMContentLoaded", initOverlay);

})();
