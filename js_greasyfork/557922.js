// ==UserScript==
// @name         Hide Individual Thumbnails (Persistent)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Dodaje przycisk przy każdej miniaturce, żeby ją ukryć i zapamiętuje stan między odświeżeniami
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557922/Hide%20Individual%20Thumbnails%20%28Persistent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557922/Hide%20Individual%20Thumbnails%20%28Persistent%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'hiddenThumbs';

    // Pobranie listy ukrytych miniatur z localStorage
    let hiddenThumbs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    // Funkcja dodająca przycisk do miniaturki
    const addHideButton = (thumb) => {
        // Pobranie unikalnego ID dla miniaturki (jeśli nie ma, dodajemy)
        if (!thumb.dataset.thumbId) {
            thumb.dataset.thumbId = 'thumb-' + Math.random().toString(36).substr(2, 9);
        }
        const thumbId = thumb.dataset.thumbId;

        // Tworzymy przycisk
        const button = document.createElement('button');
        button.textContent = hiddenThumbs[thumbId] ? 'Pokaż' : 'Ukryj';
        button.style.position = 'absolute';
        button.style.top = '0';
        button.style.right = '0';
        button.style.zIndex = 1000;
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#000';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '13px';

        // Dodajemy przycisk do miniaturki
        thumb.style.position = 'relative';
        thumb.appendChild(button);

        // Ustaw stan ukrycia
        if (hiddenThumbs[thumbId]) {
            thumb.style.display = 'none';
        }

        // Obsługa kliknięcia
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            if (thumb.style.display === 'none') {
                thumb.style.display = '';
                button.textContent = 'Ukryj';
                delete hiddenThumbs[thumbId];
            } else {
                thumb.style.display = 'none';
                button.textContent = 'Pokaż';
                hiddenThumbs[thumbId] = true;
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenThumbs));
        });
    };

    // Dodaj przyciski do wszystkich istniejących miniatur
    document.querySelectorAll('.mozaique .thumb-block').forEach(addHideButton);

    // Obsługa dynamicznie dodawanych miniatur (np. lazy load)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.matches('.mozaique .thumb-block')) {
                    addHideButton(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
