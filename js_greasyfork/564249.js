// ==UserScript==
// @name         SNCF Filtre Gares
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       comaX
// @description  Amélioration des résultats SNCF par filtrage de gares
// @match        https://www.sncf-connect.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564249/SNCF%20Filtre%20Gares.user.js
// @updateURL https://update.greasyfork.org/scripts/564249/SNCF%20Filtre%20Gares.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let stationsFound = [];
    let stationState = {};
    let dropdown = null;

    function loadState() {
        try {
            const saved = GM_getValue('stationVisibility', null);
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return {};
    }

    stationState = loadState();

    function saveState() {
        try {
            GM_setValue('stationVisibility', JSON.stringify(stationState));
        } catch (e) {}
    }

    function extractStations() {
        const placeElements = document.querySelectorAll('[data-test="place"]');
        const stationsSet = new Set();

        placeElements.forEach(el => {
            const text = el.textContent.trim();
            if (text.length > 0) {
                stationsSet.add(text);
            }
        });

        const stations = Array.from(stationsSet).sort();
        return stations;
    }

    function updateStationsList() {
        const currentStations = extractStations();
        const previousCount = stationsFound.length;

        currentStations.forEach(stationName => {
            const exists = stationsFound.find(s => s.label === stationName);
            if (!exists) {
                const id = stationName.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');

                if (!(id in stationState)) {
                    stationState[id] = true;
                }

                stationsFound.push({
                    id: id,
                    label: stationName,
                    keyword: stationName.toLowerCase()
                });
            }
        });

        stationsFound.sort((a, b) => a.label.localeCompare(b.label));

        if (stationsFound.length > previousCount) {
            console.log(`🆕 ${stationsFound.length - previousCount} nouvelle(s) gare(s)`);
            rebuildDropdown();
            saveState();
        }
    }

    function applyFilter() {
        const cards = document.querySelectorAll('li[data-test="proposal-card"]');
        let hiddenCount = 0;

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            let shouldHide = false;

            stationsFound.forEach(station => {
                if (!stationState[station.id] && text.includes(station.keyword)) {
                    shouldHide = true;
                }
            });

            if (shouldHide) {
                card.style.display = 'none';
                hiddenCount++;
            } else {
                card.style.display = '';
            }
        });

        if (cards.length > 0) {
            console.log(`🔍 ${hiddenCount}/${cards.length} masqués`);
        }
    }

    function rebuildDropdown() {
        if (!dropdown) return;

        dropdown.innerHTML = '';

        if (stationsFound.length === 0) {
            dropdown.innerHTML = '<div style="padding:8px;color:#999;">Aucune gare</div>';
            return;
        }

        stationsFound.forEach(station => {
            const label = document.createElement('label');
            label.style.cssText = 'display:flex;align-items:center;padding:8px;cursor:pointer;border-radius:4px;transition:background 0.2s;';

            label.onmouseenter = () => label.style.background = '#f5f5f5';
            label.onmouseleave = () => label.style.background = 'transparent';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = stationState[station.id];
            checkbox.style.cssText = 'margin-right:10px;width:16px;height:16px;cursor:pointer;';

            checkbox.onchange = () => {
                stationState[station.id] = checkbox.checked;
                saveState();
                applyFilter();
            };

            const text = document.createElement('span');
            text.textContent = station.label;
            text.style.cssText = 'user-select:none;font-size:13px;';

            label.appendChild(checkbox);
            label.appendChild(text);
            dropdown.appendChild(label);
        });
    }

    function createButton() {
        const button = document.createElement('span');
        button.id = 'my-filter-btn';
        button.textContent = 'Gares';
        button.style.cssText = 'display:inline-flex;align-items:center;gap:8px;background:#f5f5f5;color:#333;padding:8px 16px;margin:0 4px;border-radius:20px;font-size:14px;font-family:Arial,sans-serif;cursor:pointer;border:1px solid #ddd;transition:all 0.2s;';

        button.onmouseenter = () => {
            button.style.background = '#e8e8e8';
            button.style.borderColor = '#ccc';
        };
        button.onmouseleave = () => {
            button.style.background = '#f5f5f5';
            button.style.borderColor = '#ddd';
        };

        button.onclick = function(e) {
            e.stopPropagation();
            if (!dropdown) return;

            if (dropdown.style.display === 'none') {
                const rect = button.getBoundingClientRect();
                dropdown.style.top = (rect.bottom + 5) + 'px';
                dropdown.style.left = rect.left + 'px';
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        };

        return button;
    }

    function ensureButtonExists() {
        // Vérifier si le bouton existe déjà
        if (document.getElementById('my-filter-btn')) {
            return true;
        }

        // Chercher le conteneur
        const allSpans = document.querySelectorAll('span.MuiTypography-root');
        let filterContainer = null;

        for (let span of allSpans) {
            if (span.textContent.trim() === 'Filtrer par :') {
                filterContainer = span.parentElement;
                break;
            }
        }

        if (!filterContainer) {
            return false;
        }

        // Créer et ajouter le bouton
        const button = createButton();
        filterContainer.appendChild(button);
        console.log('🔄 Bouton ré-injecté');
        return true;
    }

    function init() {
        console.log('=== DÉBUT DU SCRIPT ===');

        try {
            updateStationsList();
            console.log(`✅ ${stationsFound.length} gare(s) initiale(s)`);

            // Créer le dropdown (une seule fois)
            if (!dropdown) {
                dropdown = document.createElement('div');
                dropdown.id = 'my-dropdown';
                dropdown.style.cssText = 'position:fixed;background:white;padding:12px;display:none;z-index:999999;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #e0e0e0;min-width:280px;max-height:400px;overflow-y:auto;font-family:Arial,sans-serif;font-size:14px;color:#333;';
                dropdown.onclick = (e) => e.stopPropagation();
                document.body.appendChild(dropdown);
                rebuildDropdown();
            }

            // Fermer le dropdown si clic ailleurs
            document.addEventListener('click', () => {
                if (dropdown) dropdown.style.display = 'none';
            });

            // Injecter le bouton
            ensureButtonExists();

            applyFilter();

            // Observer pour détecter les changements
            const observer = new MutationObserver((mutations) => {
                let hasNewCards = false;

                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.matches && node.matches('li[data-test="proposal-card"]')) {
                                hasNewCards = true;
                            }
                            if (node.querySelectorAll) {
                                const cards = node.querySelectorAll('li[data-test="proposal-card"]');
                                if (cards.length > 0) hasNewCards = true;
                            }
                        }
                    });
                });

                if (hasNewCards) {
                    updateStationsList();
                }

                // Vérifier que le bouton est toujours là
                ensureButtonExists();

                applyFilter();
            });

            observer.observe(document.body, { childList: true, subtree: true });

            console.log('✅✅✅ Filtre activé avec auto-réinjection');

        } catch (error) {
            console.error('❌ ERREUR:', error);
        }
    }

    setTimeout(init, 3000);

})();