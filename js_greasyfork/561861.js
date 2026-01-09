// ==UserScript==
// @name         Cookidoo Filter 
// @namespace    https://cookidoo.de/
// @version      1.0
// @description  Filtert Rezepte nach Anzahl der Bewertungen + färbt Rezepte nach Bewertungen
// @author       Uli König
// @match        https://cookidoo.de/*
// @run-at       document-idle
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/561861/Cookidoo%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/561861/Cookidoo%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let MIN_RATINGS = 100;

    function parseCount(text) {
        if (!text || typeof text !== 'string') return 0;
        let t = text.trim();

        const kMatch = t.match(/(\d+(?:[.,]\d+)?)\s*k/i);
        if (kMatch) {
            let numPart = kMatch[1].replace(',', '.');
            let val = parseFloat(numPart);
            if (!isNaN(val)) return Math.round(val * 1000);
        }

        if (/[.,]/.test(t)) {
            let val = parseFloat(t.replace(',', '.'));
            if (!isNaN(val) && val <= 5.0) return 0;
        }

        let cleanInt = t.replace(/[^\d]/g, '');
        let valInt = parseInt(cleanInt, 10);
        return isNaN(valInt) ? 0 : valInt;
    }

    function parseAverage(text) {
        if (!text) return 0;
        // Erweiterte Regex für Noten (4.6, 4,6, 4.0 etc.)
        const avgMatch = text.match(/(\d[.,]?\d?)/);
        if (avgMatch) {
            let val = parseFloat(avgMatch[1].replace(',', '.'));
            if (val >= 1.0 && val <= 5.0) return val;
        }
        return 0;
    }

    function getColorForRating(rating) {
        if (rating === 0) return '';
        const r1 = 255, g1 = 182, b1 = 193;
        const r2 = 255, g2 = 242, b2 = 204;
        const r3 = 200, g3 = 230, b3 = 201;

        let t;
        if (rating <= 3.0) {
            t = (rating - 1.0) / 2.0;
            return `rgb(${Math.round(r1)}, ${Math.round(g1 + t * (g2 - g1))}, ${Math.round(b1 + t * (b2 - b1))})`;
        } else {
            t = (rating - 3.0) / 2.0;
            return `rgb(${Math.round(r2 - t * (r2 - r3))}, ${Math.round(g2 + t * (g3 - g2))}, ${Math.round(b2 + t * (b3 - b2))})`;
        }
    }

    function processTiles(root) {
        if (!root || root.nodeType !== 1) return;

        // **ERWEITERTE Tile-Suche für alle Seiten**
        const selectors = [
            'core-tile.core-tile--expanded',
            'core-tile',
            '[class*="recipe-tile"]',
            '[class*="tile"]',
            '[class*="card"]',           // Sammlungen
            '[data-testid*="recipe"]',   // Test-IDs
            '.recipe-item',              // Fallback
            '.item'                      // Generisch
        ];

        let tiles = [];
        selectors.forEach(selector => {
            const found = root.querySelectorAll(selector);
            tiles = tiles.concat(Array.from(found));
        });

        // Entferne Duplikate
        tiles = [...new Set(tiles)];

        if (tiles.length === 0) {
            console.log('[Filter] Keine Tiles gefunden');
            return;
        }

        console.log(`[Filter] Prüfe ${tiles.length} Tiles...`);

        tiles.forEach((tile, index) => {
            let maxCount = 0;
            let avgRating = 0;

            // Alle Text-Elemente im Tile durchsuchen
            const allElements = tile.querySelectorAll('*');
            allElements.forEach(el => {
                if (el.children.length === 0 && el.textContent && el.textContent.trim().length > 0) {
                    const txt = el.textContent.trim();
                    if (/\d/.test(txt)) {
                        const count = parseCount(txt);
                        if (count > maxCount) maxCount = count;

                        const avg = parseAverage(txt);
                        if (avg > avgRating) avgRating = avg;
                    }
                }
            });

            // Filter
            if (maxCount > 0 && maxCount < MIN_RATINGS) {
                tile.setAttribute('hidden', 'true');
            } else {
                tile.removeAttribute('hidden');
                // **FARBUNG (verbessert)**
                if (avgRating > 0) {
                    const color = getColorForRating(avgRating);
                    if (color) {
                        // Verschiedene Styling für verschiedene Kacheln
                        tile.style.backgroundColor = color;
                        tile.style.borderRadius = '8px';
                        tile.style.transition = 'background-color 0.3s ease';

                        // Sanfter Rand
                        tile.style.border = '1px solid rgba(255,255,255,0.3)';

                        // Hover-Effekt
                        tile.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }
                }
            }
        });
    }

    function addFilterInput() {
        const oldInput = document.getElementById('tm-filter-input-group');
        if (oldInput) oldInput.remove();

        // 1. filterButton (Suche)
        const filterButton = document.getElementById('filterButton');
        if (filterButton) {
            const inputGroup = createInputGroup();
            filterButton.parentNode.insertBefore(inputGroup, filterButton.nextSibling);
            return;
        }

        // 2. Header (Sammlungen)
        const headerArea = document.querySelector('header, .header, [class*="header"]');
        if (headerArea) {
            const inputGroup = createInputGroup();
            headerArea.appendChild(inputGroup);
            return;
        }

        // 3. Fixed oben rechts
        const inputGroup = createInputGroup(true);
        document.body.appendChild(inputGroup);
    }

    function createInputGroup(isFixed = false) {
        const inputGroup = document.createElement('div');
        inputGroup.id = 'tm-filter-input-group';

        inputGroup.style.cssText = isFixed ?
            `position: fixed; top: 20px; right: 20px; z-index: 9999; display: inline-flex; gap: 4px; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.95); border-radius: 20px; border: 1px solid #ddd; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-size: 13px;` :
            `display: inline-flex; gap: 4px; align-items: center; margin-left: 12px; padding: 6px 10px; background: rgba(255,255,255,0.9); border-radius: 16px; border: 1px solid #ddd; font-size: 13px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);`;

        const label = document.createElement('span');
        label.textContent = 'Min: ';
        label.style.cssText = 'color: #666; font-weight: 500; font-size: 12px;';

        const input = document.createElement('input');
        input.type = 'number';
        input.value = MIN_RATINGS;
        input.min = '0';
        input.max = '10000';
        input.style.cssText = `width: 55px; padding: 2px 4px; border: none; background: transparent; text-align: center; font-size: 13px; outline: none;`;

        input.addEventListener('input', (e) => {
            MIN_RATINGS = parseInt(e.target.value) || 0;
            processTiles(document.body);
        });

        inputGroup.append(label, input);
        return inputGroup;
    }

    // Initialisierung
    const init = () => {
        addFilterInput();
        processTiles(document.body);
    };

    setTimeout(init, 1500);

    const observer = new MutationObserver(() => processTiles(document.body));
    observer.observe(document.body, { childList: true, subtree: true });

})();
