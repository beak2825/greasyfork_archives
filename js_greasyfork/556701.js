// ==UserScript==
// @name         grid optimizer
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.1.4
// @description  Passt die Breite von Artikel-Edit-Eingabefeldern basierend auf Layout-Struktur an (nur Gruppen)
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel?id=*
// @match        https://opus.geizhals.at/kalif/artikel?clone_id=*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/556701/grid%20optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/556701/grid%20optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Nicht in iframes ausführen - verhindert mehrfache Skript-Instanzen
    try {
        if (window.self !== window.top) return;
    } catch (e) {
        // Cross-origin iframe - auch nicht ausführen
        return;
    }

    // Zusätzliche Prüfung: Nur auf der erwarteten Seite ausführen
    if (!window.location.pathname.startsWith('/kalif/artikel')) return;

    // Verhindere mehrfache Initialisierung im selben Fenster
    if (window.__geizhalsPropertyGridOptimizerInitialized) return;
    window.__geizhalsPropertyGridOptimizerInitialized = true;

    const GLOBAL_CONFIG = {
        debugMode: false
    };

    const LAYOUTS = {
        layout1: {
            structure: ["Anzahl", "Typ", "Kommentar"],
            fields: [
                { label: "Anzahl", labelWidth: "85px", inputWidth: "50px", propertyWidth: "150px" },
                { label: "Typ", labelWidth: "60px", inputWidth: "auto", propertyWidth: "1fr", forceBreakAfter: true },
                { label: "Kommentar", labelWidth: "115px", inputWidth: "auto", propertyWidth: "1fr" }
            ],
            useFlexbox: true
        },
        layout2: {
            structure: ["Anzahl", "Typ", "Belegt", "Kommentar"],
            fields: [
                { label: "Anzahl", labelWidth: "85px", inputWidth: "50px", propertyWidth: "150px" },
                { label: "Typ", labelWidth: "60px", inputWidth: "auto", propertyWidth: "1fr", forceBreakAfter: true },
                { label: "Belegt", labelWidth: "85px", inputWidth: "50px", propertyWidth: "150px" },
                { label: "Kommentar", labelWidth: "115px", inputWidth: "auto", propertyWidth: "1fr" }
            ],
            useFlexbox: true
        },
        layout3: {
            structure: ["Anzahl", "Typ", "Übertragung", "Kommentar", "Frequenz", "OC-Frequenz"],
            fields: [
                { label: "Anzahl", labelWidth: "85px", inputWidth: "38px", propertyWidth: "135px" },
                { label: "Typ", labelWidth: "60px", inputWidth: "auto", propertyWidth: "1fr", forceBreakAfter: true },
                { label: "Übertragung", labelWidth: "130px", inputWidth: "140px", propertyWidth: "280px" },
                { label: "Kommentar", labelWidth: "115px", inputWidth: "auto", propertyWidth: "1fr", forceBreakAfter: true },
                { label: "Frequenz", labelWidth: "90px", inputWidth: "150px", propertyWidth: "1fr" },
                { label: "OC-Frequenz", labelWidth: "115px", inputWidth: "150px", propertyWidth: "1fr" }
            ],
            useFlexbox: true
        },
		layout4: {
			structure: ["Anzahl", "Typ", "Netzwerktyp", "Gruppenzugehörigkeit", "Kommentar"],
			fields: [
				// Row 1: Anzahl wenig, Typ viel
				{ label: "Anzahl", labelWidth: "85px", inputWidth: "50px", propertyWidth: "150px" },
				{ label: "Typ", labelWidth: "60px", inputWidth: "auto", propertyWidth: "1fr", forceBreakAfter: true },

				// Row 2: Netzwerktyp wenig, Gruppenzugehörigkeit wenig, Kommentar viel
				{ label: "Netzwerktyp", labelWidth: "130px", inputWidth: "100px", propertyWidth: "240px" },
				{ label: "Gruppenzugehörigkeit", labelWidth: "180px", inputWidth: "100px", propertyWidth: "290px" },
				{ label: "Kommentar", labelWidth: "115px", inputWidth: "auto", propertyWidth: "1fr" }
			],
			useFlexbox: true
		}
    };

    function log(...args) {
        if (GLOBAL_CONFIG.debugMode) {
            try { console.log('[GHZ-GridOptimizer]', ...args); } catch (e) {}
        }
    }

    function injectStyles() {
        const css = `
            .properties-grid[data-ghz-adjusted] .d-flex.p-1.row-background {
                min-width: 0;
            }
            .properties-grid[data-ghz-adjusted] .input-group {
                flex-wrap: nowrap;
            }
            .properties-grid[data-ghz-adjusted] input.input-numeric {
                text-align: center;
            }
            .properties-grid[data-ghz-adjusted] label.form-label {
                white-space: nowrap;
            }
            .properties-grid[data-ghz-flexbox] {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 0 !important;
                border-left: 2px solid #dee2e6 !important;
                border-top: 2px solid #dee2e6 !important;
            }
            .properties-grid[data-ghz-flexbox] .d-flex.p-1.row-background {
                box-sizing: border-box !important;
                border-right: 2px solid #dee2e6 !important;
                border-bottom: 2px solid #dee2e6 !important;
                padding: 0.25rem !important;
            }
            .properties-grid[data-ghz-flexbox] .d-flex.p-1.row-background > div {
                min-width: 0 !important;
            }
            .ghz-flex-break {
                flex-basis: 100% !important;
                width: 0 !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                overflow: hidden !important;
            }
        `;
        GM_addStyle(css);
    }

    function extractLabelStructure(grid) {
        // NEU: Extrahiere alle Labels in Reihenfolge (flaches Array)
        const properties = grid.querySelectorAll(':scope > .d-flex.p-1.row-background:not(.fw-bold)');
        const labels = [];

        properties.forEach((prop) => {
            const label = prop.querySelector('label.form-label');
            const labelText = label ? label.textContent.trim() : null;

            if (labelText) {
                labels.push(labelText);
            }
        });

        return labels;
    }

    function findMatchingLayout(grid) {
        const structure = extractLabelStructure(grid);

        for (const [layoutName, layout] of Object.entries(LAYOUTS)) {
            // NEU: Vergleiche flache Arrays
            if (JSON.stringify(structure) === JSON.stringify(layout.structure)) {
                log(`✓ Layout "${layoutName}" gefunden für Struktur:`, structure);
                return layout;
            }
        }

        return null;
    }

    function removeBootstrapColClasses(element) {
        const classesToRemove = [];
        element.classList.forEach(cls => {
            if (/^col(-sm|-md|-lg|-xl|-xxl)?(-\d+)?$/.test(cls)) {
                classesToRemove.push(cls);
            }
        });
        classesToRemove.forEach(cls => element.classList.remove(cls));
    }

    function adjustGrid(grid) {
        const layout = findMatchingLayout(grid);
        if (!layout) {
            return;
        }

        if (layout.useFlexbox) {
            grid.setAttribute('data-ghz-flexbox', 'true');
            grid.style.setProperty('display', 'flex', 'important');
            grid.style.setProperty('flex-wrap', 'wrap', 'important');
        } else {
            grid.style.setProperty('grid-template-columns', layout.gridTemplate, 'important');
        }

        let allSuccess = true;

        layout.fields.forEach(fieldConfig => {
            const allLabels = grid.querySelectorAll('label.form-label');
            let targetLabel = null;

            allLabels.forEach(label => {
                if (label.textContent.trim() === fieldConfig.label) {
                    targetLabel = label;
                }
            });

            if (!targetLabel) {
                log(`  WARNUNG: Label "${fieldConfig.label}" nicht gefunden`);
                allSuccess = false;
                return;
            }

            const propertyEl = targetLabel.closest('.d-flex.p-1.row-background');
            if (!propertyEl) {
                log(`  WARNUNG: Kein .row-background für "${fieldConfig.label}" gefunden`);
                allSuccess = false;
                return;
            }

            if (propertyEl.children.length < 2) {
                log(`  ⏳ Warte auf vollständiges Rendering für "${fieldConfig.label}" (hat nur ${propertyEl.children.length} Kind)`);
                allSuccess = false;
                return;
            }

            const labelContainer = propertyEl.children[0];
            const inputContainer = propertyEl.children[1];

            if (fieldConfig.tooltip) {
                targetLabel.setAttribute('title', fieldConfig.tooltip);
                targetLabel.style.cursor = 'help';
            }

            if (layout.useFlexbox && fieldConfig.propertyWidth) {
                propertyEl.style.setProperty('box-sizing', 'border-box', 'important');

                if (fieldConfig.propertyWidth === '1fr') {
                    propertyEl.style.setProperty('flex', '1 1 0', 'important');
                    propertyEl.style.setProperty('min-width', '0', 'important');
                    propertyEl.style.setProperty('max-width', 'none', 'important');
                } else {
                    propertyEl.style.setProperty('flex', `0 0 ${fieldConfig.propertyWidth}`, 'important');
                    propertyEl.style.setProperty('min-width', fieldConfig.propertyWidth, 'important');
                    propertyEl.style.setProperty('max-width', fieldConfig.propertyWidth, 'important');
                }
            }

            if (fieldConfig.labelWidth) {
                removeBootstrapColClasses(labelContainer);
                labelContainer.style.setProperty('flex', `0 0 ${fieldConfig.labelWidth}`, 'important');
                labelContainer.style.setProperty('width', fieldConfig.labelWidth, 'important');
                labelContainer.style.setProperty('min-width', fieldConfig.labelWidth, 'important');
                labelContainer.style.setProperty('max-width', fieldConfig.labelWidth, 'important');
            }

            if (fieldConfig.inputWidth) {
                removeBootstrapColClasses(inputContainer);
                inputContainer.style.setProperty('min-width', '0', 'important');

                if (fieldConfig.inputWidth === 'auto') {
                    inputContainer.style.setProperty('flex', '1 1 0', 'important');
                    inputContainer.style.setProperty('max-width', 'none', 'important');
                } else {
                    inputContainer.style.setProperty('flex', `0 0 ${fieldConfig.inputWidth}`, 'important');
                    inputContainer.style.setProperty('max-width', fieldConfig.inputWidth, 'important');
                }
            }

            if (fieldConfig.forceBreakAfter && layout.useFlexbox) {
                const existingBreak = propertyEl.nextElementSibling;
                if (!existingBreak || !existingBreak.classList.contains('ghz-flex-break')) {
                    const breakElement = document.createElement('div');
                    breakElement.className = 'ghz-flex-break';
                    breakElement.setAttribute('data-ghz-break', 'true');
                    propertyEl.parentNode.insertBefore(breakElement, propertyEl.nextSibling);
                }
            }
        });

        if (allSuccess) {
            grid.setAttribute('data-ghz-adjusted', 'true');
            log(`✓ Grid vollständig angepasst\n`);
        } else {
            log(`⚠ Grid unvollständig - wird später erneut versucht\n`);
        }
    }

    function adjustAllGrids() {
        const grids = document.querySelectorAll('.properties-grid:not([data-ghz-adjusted])');
        log(`\n=== Starte Anpassung für ${grids.length} Grids ===\n`);

        grids.forEach((grid, index) => {
            log(`--- Grid ${index + 1} ---`);
            adjustGrid(grid);
        });
    }

    function init() {
        log('v11.0 gestartet - Vereinfachte Struktur-Erkennung (nur Reihenfolge)');
        injectStyles();

        setTimeout(() => adjustAllGrids(), 500);
        setTimeout(() => adjustAllGrids(), 1000);
        setTimeout(() => adjustAllGrids(), 2000);
        setTimeout(() => adjustAllGrids(), 3000);
        setTimeout(() => adjustAllGrids(), 5000);

        const observer = new MutationObserver(() => {
            adjustAllGrids();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();