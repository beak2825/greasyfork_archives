// ==UserScript==
// @name         Map-Making.app - Selektywne Usuwanie Tagów
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Pozwala zaznaczyć i masowo usunąć wybrane tagi
// @author       Ades
// @match        https://map-making.app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560620/Map-Makingapp%20-%20Selektywne%20Usuwanie%20Tag%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/560620/Map-Makingapp%20-%20Selektywne%20Usuwanie%20Tag%C3%B3w.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isSelectionMode = false;

    // Funkcja przełączająca tryb wyboru
    const toggleSelectionMode = () => {
        isSelectionMode = !isSelectionMode;
        const btn = document.getElementById('tag-selector-mode');
        const tags = document.querySelectorAll('.tag, [class*="Tag"]'); // Szuka elementów tagów

        if (isSelectionMode) {
            btn.innerText = '✅ Usuń zaznaczone';
            btn.style.backgroundColor = '#4CAF50';
            // Dodaj styl dla tagów, żeby było wiadomo, że można je klikać
            tags.forEach(tag => {
                tag.style.cursor = 'pointer';
                tag.style.border = '2px dashed yellow';
                tag.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.style.opacity = (this.style.opacity === '0.3') ? '1' : '0.3';
                    this.classList.toggle('to-be-deleted');
                };
            });
        } else {
            // Proces usuwania
            const toDelete = document.querySelectorAll('.to-be-deleted');
            if (toDelete.length > 0) {
                if (confirm(`Usunąć ${toDelete.length} zaznaczonych tagów?`)) {
                    toDelete.forEach(tag => {
                        const deleteIcon = tag.querySelector('.delete, .remove, [class*="close"], [class*="remove"]');
                        if (deleteIcon) deleteIcon.click();
                        else tag.click(); // fallback jeśli tag sam w sobie jest przyciskiem
                    });
                }
            }
            resetUI();
        }
    };

    const resetUI = () => {
        isSelectionMode = false;
        const btn = document.getElementById('tag-selector-mode');
        btn.innerText = '🖱️ Wybierz tagi do usunięcia';
        btn.style.backgroundColor = '#2196F3';
        const tags = document.querySelectorAll('.tag, [class*="Tag"]');
        tags.forEach(tag => {
            tag.style.border = 'none';
            tag.style.opacity = '1';
            tag.onclick = null;
            tag.classList.remove('to-be-deleted');
        });
    };

    const addUI = () => {
        if (document.getElementById('tag-selector-mode')) return;

        const btn = document.createElement('button');
        btn.id = 'tag-selector-mode';
        btn.innerText = '🖱️ Wybierz tagi do usunięcia';
        btn.style.position = 'fixed';
        btn.style.bottom = '70px'; // Nad poprzednim przyciskiem
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#2196F3';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';

        btn.addEventListener('click', toggleSelectionMode);
        document.body.appendChild(btn);
    };

    setInterval(addUI, 2000);
})();