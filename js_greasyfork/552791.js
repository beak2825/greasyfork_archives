// ==UserScript==
// @name         Spotify Lyrics Translator
// @namespace    https://greasyfork.org/users/yourprofile
// @version      1.3
// @description  Translate Spotify lyrics using Google Translate
// @author       Julia Pagani
// @license      CC-BY-ND-4.0; https://creativecommons.org/licenses/by-nd/4.0/
// @match        https://open.spotify.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/552791/Spotify%20Lyrics%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/552791/Spotify%20Lyrics%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultLang = GM_getValue("defaultLang", "en"); // Default language is English
    let currentLang = defaultLang;

    // Menu to set default language
    GM_registerMenuCommand("Set default language", () => {
        const lang = prompt("Enter the default translation language code (example: en, es, pt, fr, de):", currentLang);
        if (lang) {
            GM_setValue("defaultLang", lang);
            currentLang = lang;
            alert("Default language set to: " + lang);
        }
    });

    // Keyboard shortcut (Ctrl+Shift+T) to toggle translation
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === "KeyT") {
            translateLyrics();
        }
    });

    async function translateLyrics() {
        const lyricsContainer = document.querySelector('[data-testid="lyrics-container"]');
        if (!lyricsContainer) {
            alert("No lyrics found.");
            return;
        }

        const lines = [...lyricsContainer.querySelectorAll("span")].map(el => el.innerText).filter(Boolean);
        const text = lines.join("\n");

        try {
            const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + currentLang + "&dt=t&q=" + encodeURIComponent(text);
            const response = await fetch(url);
            const data = await response.json();
            const translated = data[0].map(item => item[0]).join("\n");

            lyricsContainer.innerHTML = "";
            translated.split("\n").forEach(line => {
                const span = document.createElement("span");
                span.textContent = line;
                span.style.display = "block";
                lyricsContainer.appendChild(span);
            });
        } catch (err) {
            console.error("Translation error:", err);
            alert("Error while translating lyrics.");
        }
    }

    // Insert small copyright notice
    const style = document.createElement("style");
    style.innerHTML = `
        #translator-footer {
            position: fixed;
            bottom: 5px;
            right: 10px;
            font-size: 10px;
            color: #aaa;
            font-family: Arial, sans-serif;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    const footer = document.createElement("div");
    footer.id = "translator-footer";
    footer.innerText = "© Julia Pagani 2025";
    document.body.appendChild(footer);

})();
