// ==UserScript==
// @name         Gelbooru sort by hotkeys
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This script allows you to automatically fill a search input with predefined keywords and trigger the search button using keyboard shortcuts.
// @author       Peepo
// @match        *://gelbooru.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548458/Gelbooru%20sort%20by%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/548458/Gelbooru%20sort%20by%20hotkeys.meta.js
// ==/UserScript==

(function() {
    const keyToTextMap = {
        'r': 'sort:random',
        's': 'sort:score'
    };

    const input = document.getElementById('tags-search');
    const searchButton = document.querySelector('input.searchList[type="submit"]');

    if (!input || !searchButton) return;

    function updateInputValue(newKey) {
        const newText = keyToTextMap[newKey];
        if (!newText) return;

        let foundKey = null;
        for (const k in keyToTextMap) {
            if (input.value.includes(keyToTextMap[k])) {
                foundKey = k;
                break;
            }
        }

        if (foundKey === newKey) {
            return;
        } else if (foundKey) {
            input.value = input.value.replace(keyToTextMap[foundKey], newText);
        } else {
            if (input.value.length > 0) {
                input.value += " " + newText;
            } else {
                input.value = newText;
            }
        }

        searchButton.click();
    }

    document.addEventListener('keydown', function(event) {
        const activeTag = document.activeElement.tagName.toUpperCase();
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

        if (keyToTextMap[event.key]) {
            event.preventDefault();
            updateInputValue(event.key);
        }
    });
})();