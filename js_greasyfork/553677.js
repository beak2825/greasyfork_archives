// ==UserScript==
// @name         MyAnimeList Actor and Character Name Reverse
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Reverse "Lastname, Firstname" on MyAnimeList
// @author       Ruben Van den Broeck
// @license      MIT
// @match        https://myanimelist.net/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553677/MyAnimeList%20Actor%20and%20Character%20Name%20Reverse.user.js
// @updateURL https://update.greasyfork.org/scripts/553677/MyAnimeList%20Actor%20and%20Character%20Name%20Reverse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) fixNames(node);
            }
        }
    });

    function reverseName(str) {
        if (!str.includes(',')) return str;
        const parts = str.split(',').map(s => s.trim());
        if (parts.length === 2) return parts[1] + ' ' + parts[0];
        return str;
    }

    function fixNames(root) {
        root.querySelectorAll('h1.title-name, h1.title-name strong')
            .forEach(el => el.textContent = reverseName(el.textContent.trim()));

        root.querySelectorAll('td.va-t.ar.pl4.pr4 a')
            .forEach(a => a.textContent = reverseName(a.textContent.trim()));

        root.querySelectorAll('.js-anime-character-va .spaceit_pad a')
            .forEach(a => a.textContent = reverseName(a.textContent.trim()));

        root.querySelectorAll('h3.h3_characters_voice_actors a')
            .forEach(a => a.textContent = reverseName(a.textContent.trim()));

        root.querySelectorAll('td.borderClass[align="right"] .spaceit_pad a')
            .forEach(a => a.textContent = reverseName(a.textContent.trim()));

        root.querySelectorAll('td.borderClass[valign="top"] > a')
            .forEach(a => a.textContent = reverseName(a.textContent.trim()));

        // NEW: Character names in extended character list
        root.querySelectorAll('h3.h3_character_name')
            .forEach(el => el.textContent = reverseName(el.textContent.trim()));
    }

    observer.observe(document, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', () => fixNames(document));
})();
