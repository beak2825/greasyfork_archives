// ==UserScript==
// @name         ChainWise Ticket Overzicht
// @namespace    http://tampermonkey.net/
// @version      2025.1.1
// @description  Toont 'live', klikbare samenvatting met dynamische kolom-indexering.
// @author       Gemini
// @match        https://heldertelecom.chainwisehosted.nl/modules/helpdesk/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555109/ChainWise%20Ticket%20Overzicht.user.js
// @updateURL https://update.greasyfork.org/scripts/555109/ChainWise%20Ticket%20Overzicht.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    /**
     * Hulpfunctie om te wachten tot een element op de pagina bestaat.
     * @param {string} selector - De CSS selector om op te wachten.
     * @param {function} callback - De functie die uitgevoerd moet worden zodra het element is gevonden.
     */
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element); // Geef het gevonden element mee aan de callback
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect(); // Stop met observeren
                callback(element); // Geef het gevonden element mee aan de callback
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Berekent de luminantie van een achtergrondkleur om te bepalen of tekst wit of zwart moet zijn.
     */
    function getLuminance(color) {
        let r, g, b;
        try {
            if (color.startsWith('rgb')) {
                [r, g, b] = color.match(/\d+/g).map(Number);
            } else if (color.startsWith('#')) {
                let hex = color.substring(1);
                if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            } else {
                return 0.6; // Veilige gok (resulteert in zwarte tekst)
            }
            return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        } catch (e) {
            console.warn(`ChainWise Script: Kon kleur niet parsen: ${color}`, e);
            return 0.6; // Veilige gok
        }
    }

    /**
     * Zoekt de index (het kolomnummer) van een cel in een header-rij op basis van de tekst.
     * @param {HTMLElement} headerRow - De <tr> met de <th> elementen.
     * @param {string} columnName - De tekst om te zoeken (bv. "Prioriteit").
     * @returns {number} De index van de kolom, of -1 als niet gevonden.
     */
    function findColumnIndex(headerRow, columnName) {
        if (!headerRow) return -1;

        const cells = headerRow.cells;
        const columnNameToFind = columnName.toLowerCase();

        for (let i = 0; i < cells.length; i++) {
            // .innerText pakt de tekst, zelfs als er <a> tags in zitten
            const cellText = cells[i].innerText.toLowerCase().trim();
            // We gebruiken .includes() omdat er sorteer-pijltjes e.d. in kunnen staan
            if (cellText.includes(columnNameToFind)) {
                return i;
            }
        }
        return -1; // Niet gevonden
    }

    /**
     * Hulpfunctie om een gestijlde 'bucket span' (label) te maken.
     * @param {string} name - De naam voor het label.
     * @param {string|number} count - Het aantal.
     * @param {string} bgColor - De HTML-kleurcode.
     * @param {HTMLElement} [targetElement] - Optioneel. Het element waarnaartoe gescrold moet worden bij een klik.
     * @returns {HTMLElement} Het gemaakte span-element.
     */
    function createBucketSpan(name, count, bgColor, targetElement) {
        const bucketSpan = document.createElement('span');
        bucketSpan.style.display = 'inline-block';
        bucketSpan.style.padding = '.3em .6em .4em';
        bucketSpan.style.fontSize = '90%';
        bucketSpan.style.fontWeight = 'bold';
        bucketSpan.style.lineHeight = '1';
        bucketSpan.style.textAlign = 'center';
        bucketSpan.style.whiteSpace = 'nowrap';
        bucketSpan.style.verticalAlign = 'baseline';
        bucketSpan.style.borderRadius = '.25em';
        bucketSpan.style.backgroundColor = bgColor;

        const luminance = getLuminance(bgColor);
        const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';
        bucketSpan.style.color = textColor;

        const innerBadge = `<span style="background-color: rgba(0,0,0,0.15); padding: 2px 5px; border-radius: 3px; color: #FFFFFF;">${count}</span>`;
        bucketSpan.innerHTML = `${name}: ${innerBadge}`;

        if (textColor === '#000000') {
             bucketSpan.innerHTML = `${name}: <span style="background-color: rgba(0,0,0,0.1); padding: 2px 5px; border-radius: 3px; color: #000000;">${count}</span>`;
        }

        // Klik-logica
        if (targetElement) {
            bucketSpan.style.cursor = 'pointer';
            bucketSpan.title = `Klik om naar sectie '${name}' te scrollen`;
            bucketSpan.addEventListener('click', (e) => {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            bucketSpan.addEventListener('mouseenter', () => {
                bucketSpan.style.boxShadow = '0 0 5px rgba(0,0,0,0.4)';
                bucketSpan.style.transform = 'translateY(-1px)';
            });
            bucketSpan.addEventListener('mouseleave', () => {
                bucketSpan.style.boxShadow = 'none';
                bucketSpan.style.transform = 'none';
            });
        }

        return bucketSpan;
    }

    /**
     * Hoofdfunctie: scant de pagina en bouwt de samenvattingsbalk.
     */
    function createSummaryBar() {
        const insertionPoint = document.getElementById('frmCalls');
        if (!insertionPoint) {
            console.log('ChainWise Ticket Overzicht (V10): Kan invoegpunt (frmCalls) niet vinden.');
            return;
        }

        const bucketHeaders = document.querySelectorAll('table.ListBody thead h3');
        if (bucketHeaders.length === 0) {
            console.log('ChainWise Ticket Overzicht (V10): Geen ticket buckets (h3) gevonden.');
        }

        const oldBar = document.getElementById('ticket-summary-bar');
        if (oldBar) {
            oldBar.remove();
        }

        const summaryContainer = document.createElement('div');
        summaryContainer.id = 'ticket-summary-bar';
        summaryContainer.style.padding = '10px 15px';
        summaryContainer.style.margin = '0 0 15px 0';
        summaryContainer.style.backgroundColor = '#f7f7f7';
        summaryContainer.style.border = '1px solid #ddd';
        summaryContainer.style.borderRadius = '4px';
        summaryContainer.style.display = 'flex';
        summaryContainer.style.flexWrap = 'wrap';
        summaryContainer.style.gap = '10px';
        summaryContainer.style.alignItems = 'center';

        const title = document.createElement('strong');
        title.innerText = 'Overzicht:';
        title.style.marginRight = '5px';
        title.style.fontSize = '14px';
        summaryContainer.appendChild(title);

        let totalActief = 0;
        let totalWachtend = 0;

        // --- NIEUW: Vind de 'Prioriteit' kolom-index ---
        // We hoeven dit maar één keer te doen. We gaan ervan uit dat alle bucket-tabellen
        // op de pagina dezelfde kolomstructuur hebben.
        let prioColumnIndex = -1;
        if (bucketHeaders.length > 0) {
            const firstThead = bucketHeaders[0].closest('thead');
            const headerRow = firstThead.querySelector('tr:last-child'); // De rij met titels
            prioColumnIndex = findColumnIndex(headerRow, 'Prioriteit');

            if (prioColumnIndex === -1) {
                 console.warn('ChainWise Script (V10): Kon de "Prioriteit" kolom-index niet vinden. Kleur-onderverdeling voor "Wacht op" wordt overgeslagen.');
            }
        }
        // --- EINDE NIEUW ---

        // Verwerk elke gevonden bucket
        bucketHeaders.forEach(header => {
            const bucketElement = header.querySelector('b');
            const bucketText = bucketElement ? bucketElement.innerText : null;
            if (!bucketText) return;

            const match = bucketText.match(/^(.*?)\s*\((\d+)\)$/);
            if (!match) return;

            const bucketName = match[1].trim();
            const totalCount = parseInt(match[2], 10);

            // LOGICA VOOR 'WACHT OP'
            if (bucketName.toLowerCase().includes('wacht op')) {
                totalWachtend += totalCount;

                // Als we de 'Prioriteit'-kolom niet konden vinden,
                // slaan we de onderverdeling over en tonen we gewoon één oranje badge.
                if (prioColumnIndex === -1) {
                    const span = createBucketSpan(bucketName, totalCount, '#f0ad4e', header);
                    summaryContainer.appendChild(span);
                    return; // Ga naar de volgende bucket header
                }

                // We hebben wel een index, dus maak de onderverdeling
                const wachtOpStats = {};
                const tbody = header.closest('thead').nextElementSibling;
                if (!tbody || tbody.tagName !== 'TBODY') return;

                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    // GEBRUIK DE DYNAMISCHE INDEX
                    if (row.cells && row.cells.length > prioColumnIndex) {
                        const prioCell = row.cells[prioColumnIndex]; // <-- Nu robuust
                        const prioText = prioCell.innerText.trim();
                        const rowColor = row.style.backgroundColor || '#f0ad4e';

                        if (prioText) {
                            if (!wachtOpStats[prioText]) {
                                wachtOpStats[prioText] = { count: 1, color: rowColor };
                            } else {
                                wachtOpStats[prioText].count++;
                            }
                        }
                    }
                });

                for (const name in wachtOpStats) {
                    const stats = wachtOpStats[name];
                    const span = createBucketSpan(name, stats.count, stats.color, header);
                    summaryContainer.appendChild(span);
                }

            } else {
                // OUDE LOGICA VOOR ANDERE BUCKETS
                totalActief += totalCount;

                let bgColor = '#777'; // Default
                if (bucketName.toLowerCase().includes('nieuw')) {
                    bgColor = '#d9534f'; // Rood
                } else if (bucketName.toLowerCase().includes('behandeling')) {
                    bgColor = '#5cb85c'; // Groen
                } else if (bucketName.toLowerCase().includes('ingepland')) {
                    bgColor = '#337ab7'; // Blauw
                }

                const span = createBucketSpan(bucketName, totalCount, bgColor, header);
                summaryContainer.appendChild(span);
            }
        });

        // Voeg de Totaal-labels toe
        const spacer = document.createElement('span');
        spacer.style.flexGrow = '1';
        summaryContainer.appendChild(spacer);

        const actiefSpan = createBucketSpan('Totaal Actief', totalActief, '#444', insertionPoint);
        actiefSpan.style.fontWeight = 'bolder';
        summaryContainer.appendChild(actiefSpan);

        const wachtendSpan = createBucketSpan('Totaal Wachtend', totalWachtend, '#444', insertionPoint);
        wachtendSpan.style.fontWeight = 'bolder';
        summaryContainer.appendChild(wachtendSpan);

        const grandTotal = totalActief + totalWachtend;
        const grandTotalSpan = createBucketSpan('Totaal', grandTotal, '#025a8d', insertionPoint);
        grandTotalSpan.style.fontWeight = 'bolder';
        summaryContainer.appendChild(grandTotalSpan);

        // Voeg de (nieuwe) balk in de pagina
        insertionPoint.parentNode.insertBefore(summaryContainer, insertionPoint);
    }

    /**
     * Start het script.
     * @param {HTMLElement} targetElement - Het 'frmCalls' element dat we hebben gevonden.
     */
    function initializeScript(targetElement) {
        console.log('ChainWise Ticket Overzicht (V10): Script gestart, #frmCalls gevonden.');

        // 1. Bouw de balk de eerste keer
        createSummaryBar();

        // 2. Maak een observer die "luistert" naar wijzigingen in de tabel
        const observer = new MutationObserver((mutations) => {
            createSummaryBar();
        });

        // 3. Start de observer
        observer.observe(targetElement, {
            childList: true,
            subtree: true
        });
    }

    // Wacht tot het 'frmCalls' element bestaat, en roep dan initializeScript aan.
    waitForElement('#frmCalls', initializeScript);

})();
