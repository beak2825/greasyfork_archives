// ==UserScript==
// @name         [EOL] enhanced linkverzeichnis
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.0.6
// @description  Artikel-IDs werden links neben jedem Artikel in einem markierbaren Label angezeigt. Sortierbuttons können nach ID und Bezeichnung sortieren.
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel/link*
// @run-at       document-end
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/553394/%5BEOL%5D%20enhanced%20linkverzeichnis.user.js
// @updateURL https://update.greasyfork.org/scripts/553394/%5BEOL%5D%20enhanced%20linkverzeichnis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set um zu tracken, welche Elemente bereits ein ID-Label haben
    const processedElements = new WeakSet();
    let sortButtonsAdded = false;

    // Sortier-Status speichern
    const sortState = {
        id: 'asc',      // 'asc', 'desc', oder null
        name: 'asc'     // 'asc', 'desc', oder null
    };

    // Funktion zum Hinzufügen der Artikel-ID als separates Label
    function addArticleIdLabels() {
        // Finde alle Input-Felder mit Produktnamen
        const inputs = document.querySelectorAll('input[id^="react-select-"][type="text"]');

        inputs.forEach(input => {
            // Finde das übergeordnete div mit der Feldstruktur
            const parentDiv = input.closest('.d-flex.justify-content-between');
            if (!parentDiv) return;

            // Prüfe ob bereits verarbeitet
            if (processedElements.has(parentDiv)) return;

            // Suche nach dem Edit-Link mit der ID
            const editLink = parentDiv.querySelector('a[href*="kalif/artikel?id="]');
            if (!editLink) return;

            // Extrahiere die ID aus dem Link
            const match = editLink.href.match(/id=(\d+)/);
            if (!match) return;

            const articleId = match[1];

            // Finde den span-Container mit dem Input
            const spanContainer = parentDiv.querySelector('span.d-flex');
            if (!spanContainer) return;

            // Erstelle ein Label für die Artikel-ID
            const idLabel = document.createElement('span');
            idLabel.className = 'article-id-label';
            idLabel.textContent = articleId;
            idLabel.style.cssText = `
                font-weight: bold;
                color: #0066cc;
                margin-left: 6px;
                margin-right: 8px;
                font-size: 0.9em;
                white-space: nowrap;
                align-self: center;
                user-select: text;
                cursor: text;
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
            `;

            // Tooltip beim Hover
            idLabel.title = 'Doppelklick zum Markieren/Kopieren der ID';

            // Doppelklick zum Markieren und Kopieren
            idLabel.addEventListener('dblclick', function(e) {
                e.stopPropagation();
                e.preventDefault();

                // Selektiere die ID
                const range = document.createRange();
                range.selectNodeContents(idLabel);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // Kopiere in Zwischenablage
                navigator.clipboard.writeText(articleId).then(() => {
                    // Visuelles Feedback
                    const originalColor = idLabel.style.color;
                    idLabel.style.color = '#00cc00';
                    setTimeout(() => {
                        idLabel.style.color = originalColor;
                    }, 300);
                }).catch(err => {
                    console.error('Kopieren fehlgeschlagen:', err);
                });
            });

            // Füge das Label vor dem Input-Container ein
            spanContainer.insertBefore(idLabel, spanContainer.firstChild);

            // Markiere als verarbeitet
            processedElements.add(parentDiv);
        });
    }

    // Funktion zum Expandieren aller versteckten Artikel
    function expandAllArticles() {
        return new Promise((resolve) => {
            // Suche nach "Alle X anzeigen" Buttons
            const expandButtons = document.querySelectorAll('button.btn.btn-outline-dark.btn-sm');

            let foundExpandButton = false;
            expandButtons.forEach(button => {
                if (button.textContent.includes('Alle') && button.textContent.includes('anzeigen')) {
                    console.log('Expandiere Artikel-Liste:', button.textContent);
                    foundExpandButton = true;
                    button.click();
                }
            });

            if (foundExpandButton) {
                // Warte kurz, bis die Artikel geladen sind
                setTimeout(() => {
                    // Warte nochmal, um sicherzustellen dass alles geladen ist
                    setTimeout(() => {
                        console.log('Artikel-Liste expandiert');
                        resolve();
                    }, 500);
                }, 300);
            } else {
                console.log('Kein Expand-Button gefunden, alle Artikel bereits sichtbar');
                resolve();
            }
        });
    }

    // Funktion zum Extrahieren aller Artikel-Daten
    function extractArticleData() {
        const articles = [];

        // Finde das Grid das die Artikel enthält
        const allGrids = document.querySelectorAll('.d-grid.align-items-start');

        allGrids.forEach(grid => {
            const children = Array.from(grid.children);

            // Durchsuche die Kinder nach Artikel-Containern
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const input = child.querySelector('input[id^="react-select-"][type="text"]');

                if (!input || !input.value) continue;

                const editLink = child.querySelector('a[href*="kalif/artikel?id="]');
                if (!editLink) continue;

                const match = editLink.href.match(/id=(\d+)/);
                if (!match) continue;

                const articleId = parseInt(match[1], 10);
                const name = input.value;

                // Der nächste Sibling sollte der Delete-Button sein
                const deleteButton = children[i + 1];
                const isDeleteButton = deleteButton?.classList.contains('btn-outline-danger');

                if (isDeleteButton) {
                    articles.push({
                        id: articleId,
                        name: name,
                        selectContainer: child,
                        deleteButton: deleteButton,
                        grid: grid
                    });
                }
            }
        });

        return articles;
    }

    // Funktion zum Sortieren der Artikel
    async function sortArticles(sortBy, direction) {
        console.log('Sortierung gestartet für:', sortBy, direction);

        // Expandiere zuerst alle Artikel
        await expandAllArticles();

        // Warte kurz, dann füge IDs zu neu geladenen Artikeln hinzu
        await new Promise(resolve => setTimeout(resolve, 200));
        addArticleIdLabels();

        const articles = extractArticleData();

        console.log('Sortiere', articles.length, 'Artikel nach', sortBy, direction);

        if (articles.length === 0) {
            console.log('Keine Artikel zum Sortieren gefunden');
            return;
        }

        // Sortiere das Array
        articles.sort((a, b) => {
            let comparison = 0;

            if (sortBy === 'id') {
                comparison = a.id - b.id;
            } else if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name, 'de', { sensitivity: 'base' });
            }

            return direction === 'asc' ? comparison : -comparison;
        });

        // Alle Artikel sollten im selben Grid sein
        const grid = articles[0].grid;

        console.log('Verschiebe Elemente in Grid:', grid);

        // Füge die Artikel in der neuen Reihenfolge ein
        // Finde die Position des ersten Artikels im Grid
        const gridChildren = Array.from(grid.children);
        let firstArticleIndex = -1;

        for (let i = 0; i < gridChildren.length; i++) {
            if (gridChildren[i] === articles[0].selectContainer) {
                firstArticleIndex = i;
                break;
            }
        }

        console.log('Erste Artikel-Position im Grid:', firstArticleIndex);

        // Entferne alle Artikel-Elemente aus dem DOM
        articles.forEach(article => {
            article.selectContainer.remove();
            article.deleteButton.remove();
        });

        // Füge sie in der neuen Reihenfolge wieder ein
        if (firstArticleIndex >= 0 && firstArticleIndex < grid.children.length) {
            const referenceElement = grid.children[firstArticleIndex];
            articles.forEach((article, index) => {
                console.log(`Füge Artikel ${index} ein:`, article.name.substring(0, 50), '(ID:', article.id + ')');
                grid.insertBefore(article.selectContainer, referenceElement);
                grid.insertBefore(article.deleteButton, referenceElement);
            });
        } else {
            // Falls keine Referenz, hänge am Ende an
            articles.forEach((article, index) => {
                console.log(`Füge Artikel ${index} ein:`, article.name.substring(0, 50), '(ID:', article.id + ')');
                grid.appendChild(article.selectContainer);
                grid.appendChild(article.deleteButton);
            });
        }

        console.log('Sortierung abgeschlossen');
    }

    // Funktion zum Aktualisieren der Button-Anzeige
    function updateButtonDisplay(button, sortBy) {
        const direction = sortState[sortBy];
        const arrow = direction === 'asc' ? '↑' : '↓';
        const label = sortBy === 'id' ? 'ID' : 'Bezeichnung';
        button.textContent = `${label} ${arrow}`;
    }

    // Funktion zum Hinzufügen der Sortierbuttons
    function addSortButtons() {
        if (sortButtonsAdded) return;

        // Finde das Suchfeld-Container (das erste mit dem Placeholder)
        const searchInputs = document.querySelectorAll('input[id^="react-select-"][type="text"]');
        let searchControl = null;

        for (let input of searchInputs) {
            const placeholder = input.closest('.css-1cfhtl4-control')?.querySelector('.css-1jqq78o-placeholder');
            if (placeholder && placeholder.textContent.includes('Einen Artikel')) {
                searchControl = input.closest('.css-1cfhtl4-control');
                break;
            }
        }

        if (!searchControl) return;

        // Erstelle Button-Container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'sort-buttons-container';
        buttonContainer.style.cssText = `
            margin-top: 10px;
            margin-bottom: 10px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        `;

        // Button-Styles
        const buttonStyle = `
            padding: 6px 12px;
            font-size: 0.85em;
            border: 1px solid #ccc;
            background-color: #f8f9fa;
            color: #333;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 500;
        `;

        // Erstelle Toggle-Sortierbuttons
        const buttons = [
            { sortBy: 'id', label: 'ID', title: 'Nach Artikel-ID sortieren (Klicken zum Umschalten)' },
            { sortBy: 'name', label: 'Bezeichnung', title: 'Nach Bezeichnung sortieren (Klicken zum Umschalten)' }
        ];

        buttons.forEach(btnConfig => {
            const button = document.createElement('button');
            button.title = btnConfig.title;
            button.type = 'button';
            button.style.cssText = buttonStyle;
            button.dataset.sortBy = btnConfig.sortBy;

            // Setze initialen Text
            updateButtonDisplay(button, btnConfig.sortBy);

            button.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#e9ecef';
                this.style.borderColor = '#adb5bd';
            });

            button.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#f8f9fa';
                this.style.borderColor = '#ccc';
            });

            button.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();

                const sortBy = this.dataset.sortBy;

                // Toggle Richtung
                sortState[sortBy] = sortState[sortBy] === 'asc' ? 'desc' : 'asc';

                console.log('Button geklickt:', sortBy, sortState[sortBy]);

                // Aktualisiere Button-Anzeige
                updateButtonDisplay(this, sortBy);

                // Deaktiviere Button während der Sortierung
                this.disabled = true;
                this.style.opacity = '0.6';
                this.style.cursor = 'wait';

                // Sortiere (mit automatischem Expand)
                await sortArticles(sortBy, sortState[sortBy]);

                // Aktiviere Button wieder
                this.disabled = false;
                this.style.opacity = '1';
                this.style.cursor = 'pointer';
            });

            buttonContainer.appendChild(button);
        });

        // Füge Button-Container nach dem Suchfeld ein
        searchControl.parentElement.insertBefore(buttonContainer, searchControl.nextSibling);
        sortButtonsAdded = true;
        console.log('Sortierbuttons hinzugefügt');
    }

    // Initialer Aufruf
    setTimeout(() => {
        addArticleIdLabels();
        addSortButtons();
    }, 100);

    setTimeout(() => {
        addArticleIdLabels();
        addSortButtons();
    }, 500);

    // Observer für dynamisch geladene Inhalte
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                shouldUpdate = true;
            }
        });

        if (shouldUpdate) {
            setTimeout(() => {
                addArticleIdLabels();
                addSortButtons();
            }, 50);
        }
    });

    // Beobachte das gesamte Dokument
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Event-Listener für den "Alle anzeigen" Button
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn.btn-outline-dark.btn-sm') ||
            e.target.closest('.btn.btn-outline-dark.btn-sm')) {
            setTimeout(addArticleIdLabels, 100);
            setTimeout(addArticleIdLabels, 300);
            setTimeout(addArticleIdLabels, 600);
        }
    });

})();