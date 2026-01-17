// ==UserScript==
// @name         artikel-edit: Beschreibungszeilen aus Vorschau ausblenden
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      0.0.4
// @description  Blendet Beschreibungszeilen aus Vorschau basierend auf [INTERN]-Marker aus
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel?id=*
// @exclude      https://opus.geizhals.at/kalif/artikel?id=*&mode=image*
// @exclude      https://opus.geizhals.at/kalif/artikel?id=*&mode=log*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/562866/artikel-edit%3A%20Beschreibungszeilen%20aus%20Vorschau%20ausblenden.user.js
// @updateURL https://update.greasyfork.org/scripts/562866/artikel-edit%3A%20Beschreibungszeilen%20aus%20Vorschau%20ausblenden.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const DEBUG = true;
    const log = (...args) => DEBUG && console.log('[OPUS Hide Rows]', ...args);

    const INTERN_MARKER = '[INTERN]';
    const DROPDOWN_ID = 'opus-hide-rows-dropdown';

    // Anzeigemodi
    const MODE = {
        HIDE_INTERN: 'hide_intern',      // [INTERN] ausblenden
        SHOW_INTERN: 'show_intern',      // [INTERN] einblenden (Rest ausblenden)
        SHOW_ALL: 'show_all'             // alles einblenden
    };

    let currentMode = MODE.SHOW_ALL;

    // ============================================================
    // URL-PRÜFUNG
    // ============================================================
    function isValidPage() {
        const url = new URL(window.location.href);
        const mode = url.searchParams.get('mode');
        return !mode || (mode !== 'image' && mode !== 'log');
    }

    // ============================================================
    // HEADER-CONTAINER FINDEN (für Artikelvorschau Section)
    // ============================================================
    function findHeaderContainer() {
        // Suche nach dem Header mit "Artikelvorschau" Text
        const headers = document.querySelectorAll('h5');
        for (const h5 of headers) {
            if (h5.textContent.trim() === 'Artikelvorschau') {
                // Parent ist der d-flex Container
                const container = h5.closest('.d-flex.justify-content-between.position-sticky');
                if (container) {
                    log('Header-Container gefunden via h5');
                    return container;
                }
            }
        }

        // Fallback: Direkter Selektor
        const fallback = document.querySelector('.d-flex.justify-content-between.position-sticky');
        if (fallback) {
            log('Header-Container gefunden via Fallback-Selektor');
        }
        return fallback;
    }

    // ============================================================
    // PREVIEW-TABELLE FINDEN
    // ============================================================
    function findPreviewTable() {
        // Suche die Tabelle im Artikelvorschau-Bereich
        const preview = document.querySelector('.preview');
        if (preview) {
            const table = preview.querySelector('table');
            if (table) {
                log('Preview-Tabelle gefunden');
                return table;
            }
        }
        return null;
    }

    // ============================================================
    // PRÜFEN OB [INTERN] ZEILEN VORHANDEN SIND
    // ============================================================
    function hasInternRows() {
        const table = findPreviewTable();
        if (!table) {
            log('Keine Tabelle gefunden für [INTERN] Check');
            return false;
        }

        const rows = table.querySelectorAll('tbody tr');
        for (const row of rows) {
            if (rowContainsIntern(row)) {
                log('[INTERN] Zeile gefunden');
                return true;
            }
        }
        log('Keine [INTERN] Zeilen gefunden');
        return false;
    }

    // ============================================================
    // PRÜFEN OB ZEILE [INTERN] ENTHÄLT
    // ============================================================
    function rowContainsIntern(row) {
        const textContent = row.textContent || '';
        return textContent.includes(INTERN_MARKER);
    }

    // ============================================================
    // ZEILEN EIN-/AUSBLENDEN BASIEREND AUF MODUS
    // ============================================================
    function applyVisibility() {
        const table = findPreviewTable();
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        log(`Wende Modus "${currentMode}" auf ${rows.length} Zeilen an`);

        rows.forEach(row => {
            // Spezialzeilen (Legende, "Alles auswählen") immer anzeigen
            if (isSpecialRow(row)) {
                row.style.display = '';
                return;
            }

            const containsIntern = rowContainsIntern(row);

            switch (currentMode) {
                case MODE.HIDE_INTERN:
                    // [INTERN] Zeilen ausblenden
                    row.style.display = containsIntern ? 'none' : '';
                    break;

                case MODE.SHOW_INTERN:
                    // Nur [INTERN] Zeilen einblenden (Rest ausblenden)
                    row.style.display = containsIntern ? '' : 'none';
                    break;

                case MODE.SHOW_ALL:
                    // Alles einblenden
                    row.style.display = '';
                    break;
            }
        });
    }

    // ============================================================
    // SPEZIALZEILEN ERKENNEN (Legende, Alles auswählen)
    // ============================================================
    function isSpecialRow(row) {
        // Legende-Zeile (hat colspan=4 und "Legende:" Text)
        if (row.classList.contains('bg-dark')) return true;

        // "Alles auswählen" Zeile
        const label = row.querySelector('label');
        if (label && label.textContent.includes('Alles auswählen')) return true;

        return false;
    }

    // ============================================================
    // DROPDOWN ERSTELLEN
    // ============================================================
    function createDropdown() {
        // Prüfen ob Dropdown bereits existiert
        if (document.getElementById(DROPDOWN_ID)) {
            log('Dropdown existiert bereits');
            return;
        }

        // Header-Bereich finden
        const headerContainer = findHeaderContainer();
        if (!headerContainer) {
            log('Header-Container nicht gefunden!');
            return;
        }

        // Button-Gruppe finden
        const btnGroup = headerContainer.querySelector('.btn-group');
        if (!btnGroup) {
            log('Button-Gruppe nicht gefunden!');
            return;
        }

        log('Erstelle Dropdown...');

        // Dropdown-Container erstellen
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'dropdown me-2';
        dropdownContainer.id = DROPDOWN_ID;
        dropdownContainer.style.display = 'inline-block';

        // Dropdown-Button
        const dropdownBtn = document.createElement('button');
        dropdownBtn.className = 'btn btn-outline-dark btn-sm dropdown-toggle';
        dropdownBtn.type = 'button';
        dropdownBtn.setAttribute('data-bs-toggle', 'dropdown');
        dropdownBtn.setAttribute('aria-expanded', 'false');
        dropdownBtn.textContent = 'Zeilen ausblenden';

        // Dropdown-Menü
        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.style.zIndex = '1000';

        const options = [
            { value: MODE.SHOW_ALL, label: 'alles einblenden', default: true },
            { value: MODE.HIDE_INTERN, label: '[INTERN] ausblenden' },
            { value: MODE.SHOW_INTERN, label: '[INTERN] einblenden' }
        ];

        options.forEach(opt => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'dropdown-item' + (opt.default ? ' active' : '');
            a.href = '#';
            a.textContent = opt.label;
            a.dataset.mode = opt.value;

            a.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentMode = opt.value;
                log(`Modus gewechselt zu: ${opt.value}`);

                // Active-Klasse aktualisieren
                dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
                    item.classList.remove('active');
                });
                a.classList.add('active');

                // Dropdown schließen
                dropdownMenu.classList.remove('show');
                dropdownBtn.setAttribute('aria-expanded', 'false');

                // Sichtbarkeit anwenden
                applyVisibility();
            });

            li.appendChild(a);
            dropdownMenu.appendChild(li);
        });

        dropdownContainer.appendChild(dropdownBtn);
        dropdownContainer.appendChild(dropdownMenu);

        // Vor der Button-Gruppe einfügen
        btnGroup.parentNode.insertBefore(dropdownContainer, btnGroup);

        // Bootstrap Dropdown initialisieren
        initBootstrapDropdown(dropdownBtn, dropdownMenu);

        log('Dropdown erstellt!');
    }

    // ============================================================
    // BOOTSTRAP DROPDOWN INITIALISIEREN
    // ============================================================
    function initBootstrapDropdown(button, menu) {
        // Prüfen ob Bootstrap verfügbar ist
        if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
            log('Verwende Bootstrap Dropdown');
            new bootstrap.Dropdown(button);
        } else {
            log('Verwende manuelles Dropdown');
            // Fallback: Manuelles Toggle
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = menu.classList.contains('show');

                // Alle anderen Dropdowns schließen
                document.querySelectorAll('.dropdown-menu.show').forEach(m => {
                    m.classList.remove('show');
                });

                if (!isOpen) {
                    menu.classList.add('show');
                    button.setAttribute('aria-expanded', 'true');
                } else {
                    button.setAttribute('aria-expanded', 'false');
                }
            });

            // Klick außerhalb schließt Dropdown
            document.addEventListener('click', (e) => {
                if (!button.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('show');
                    button.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // ============================================================
    // DROPDOWN ENTFERNEN (wenn kein [INTERN] vorhanden)
    // ============================================================
    function removeDropdown() {
        const dropdown = document.getElementById(DROPDOWN_ID);
        if (dropdown) {
            log('Entferne Dropdown');
            dropdown.remove();
        }
    }

    // ============================================================
    // HAUPTLOGIK
    // ============================================================
    function update() {
        log('Update wird ausgeführt...');

        const hasIntern = hasInternRows();

        if (hasIntern) {
            createDropdown();
            applyVisibility();
        } else {
            removeDropdown();
            // Alle Zeilen einblenden wenn kein [INTERN] vorhanden
            const table = findPreviewTable();
            if (table) {
                table.querySelectorAll('tbody tr').forEach(row => {
                    row.style.display = '';
                });
            }
        }
    }

    // ============================================================
    // OBSERVER FÜR DYNAMISCHE ÄNDERUNGEN
    // ============================================================
    function setupObserver() {
        log('Richte MutationObserver ein');

        const observer = new MutationObserver((mutations) => {
            // Prüfe ob relevante Änderungen stattfanden
            const relevant = mutations.some(m => {
                // Ignoriere Änderungen am Dropdown selbst
                if (m.target.id === DROPDOWN_ID || m.target.closest?.('#' + DROPDOWN_ID)) {
                    return false;
                }
                return true;
            });

            if (relevant) {
                clearTimeout(window._opusHideRowsTimeout);
                window._opusHideRowsTimeout = setTimeout(update, 300);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ============================================================
    // INITIALISIERUNG
    // ============================================================
    function init() {
        if (!isValidPage()) {
            log('Seite wird übersprungen (mode=image oder mode=log)');
            return;
        }

        log('Script initialisiert, warte auf React...');

        // Warte bis Tabelle UND Header geladen sind
        let attempts = 0;
        const maxAttempts = 60; // 30 Sekunden

        const checkReady = setInterval(() => {
            attempts++;
            const table = findPreviewTable();
            const header = findHeaderContainer();

            log(`Versuch ${attempts}: Tabelle=${!!table}, Header=${!!header}`);

            if (table && header) {
                // Zusätzlich prüfen ob Tabelle Inhalt hat (nicht nur Skeleton)
                const rows = table.querySelectorAll('tbody tr');
                if (rows.length > 2) { // Mindestens Kopfzeile + Legende + Daten
                    clearInterval(checkReady);
                    log('Seite bereit, starte...');
                    // Kleine Verzögerung für React
                    setTimeout(() => {
                        update();
                        setupObserver();
                    }, 500);
                }
            }

            if (attempts >= maxAttempts) {
                clearInterval(checkReady);
                log('Timeout - Seite nicht vollständig geladen');
            }
        }, 500);
    }

    // Starten
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();