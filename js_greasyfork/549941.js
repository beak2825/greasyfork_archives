// ==UserScript==
// @name         enhanced property
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.4.1
// @description  Alle öffnen | Alle schließen | Alle speichern | value-editor mit cat-parameter-Links (schnellere Suche) | Bestehende Werte ansehen | Artikelbezeichnungen laden
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel/property*
// @noframes
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/549941/enhanced%20property.user.js
// @updateURL https://update.greasyfork.org/scripts/549941/enhanced%20property.meta.js
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
    if (!window.location.pathname.startsWith('/kalif/artikel/property')) return;

    // Verhindere mehrfache Initialisierung im selben Fenster
    if (window.__enhancedPropertyInitialized) return;
    window.__enhancedPropertyInitialized = true;

    // Prüfe ob wir auf der /property/value Seite sind
    const isPropertyValuePage = window.location.pathname.includes('/kalif/artikel/property/value');

    let updateTimeout = null;
    let isInitialized = false;
    let isOperationRunning = false;

    function getCatParameterFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('cat');
    }

    function modifyArtikelLinks() {
        const catValue = getCatParameterFromUrl();

        if (!catValue) {
            return;
        }

        const links = document.querySelectorAll('a[href^="/pv-edit/such.pl?ids="]');

        links.forEach(link => {
            const href = link.getAttribute('href');
            const newHref = href.replace('/pv-edit/such.pl?ids=', `/pv-edit/such.pl?kat=${catValue}&ids=`);
            link.setAttribute('href', newHref);
        });
    }

    function getEnabledSaveButtons() {
        return Array.from(document.querySelectorAll('button.btn-success')).filter(btn =>
            btn.textContent.includes('Speichern') && !btn.disabled
        );
    }

    function getCollapsedEditButtons() {
        return Array.from(document.querySelectorAll('button.btn.btn-primary.btn-sm')).filter(btn => {
            const svg = btn.querySelector('svg.bi-pencil-fill');
            return svg !== null && !btn.classList.contains('btn-outline-primary');
        });
    }

    function getOpenedEditButtons() {
        return Array.from(document.querySelectorAll('button.btn.btn-outline-primary.btn-sm')).filter(btn => {
            const svg = btn.querySelector('svg.bi-x');
            return svg !== null;
        });
    }

    function getButtonContainer() {
        const allStrong = document.querySelectorAll('strong.me-2');

        const targetElements = Array.from(allStrong).filter(el =>
            el.textContent.trim() === 'Datensätze:'
        );

        if (targetElements.length === 0) {
            return null;
        }

        const targetElement = targetElements[0];
        return targetElement.parentElement;
    }

    function createAllOpenButton() {
        const container = getButtonContainer();
        if (!container) {
            return false;
        }

        let allOpenBtn = document.getElementById('all-open-btn');
        if (!allOpenBtn) {
            allOpenBtn = document.createElement('button');
            allOpenBtn.id = 'all-open-btn';
            allOpenBtn.className = 'btn btn-secondary btn-sm me-2';
            allOpenBtn.style.fontWeight = 'bold';
            allOpenBtn.style.fontSize = '0.85rem';
            container.insertBefore(allOpenBtn, container.firstChild);
            allOpenBtn.addEventListener('click', executeAllOpen);
        }

        const collapsedCount = getCollapsedEditButtons().length;
        allOpenBtn.textContent = `Alle öffnen (${collapsedCount})`;
        allOpenBtn.disabled = collapsedCount === 0;
        return true;
    }

    function createAllCloseButton() {
        const container = getButtonContainer();
        if (!container) {
            return false;
        }

        let allCloseBtn = document.getElementById('all-close-btn');
        if (!allCloseBtn) {
            allCloseBtn = document.createElement('button');
            allCloseBtn.id = 'all-close-btn';
            allCloseBtn.className = 'btn btn-secondary btn-sm me-2';
            allCloseBtn.style.fontWeight = 'bold';
            allCloseBtn.style.fontSize = '0.85rem';

            const allOpenBtn = document.getElementById('all-open-btn');
            if (allOpenBtn && allOpenBtn.nextSibling) {
                container.insertBefore(allCloseBtn, allOpenBtn.nextSibling);
            } else {
                container.insertBefore(allCloseBtn, container.firstChild);
            }

            allCloseBtn.addEventListener('click', executeAllClose);
        }

        const openedCount = getOpenedEditButtons().length;
        allCloseBtn.textContent = `Alle schließen (${openedCount})`;
        allCloseBtn.disabled = openedCount === 0;
        return true;
    }

    function createAllSaveButton() {
        const container = getButtonContainer();
        if (!container) {
            return false;
        }

        let allSaveBtn = document.getElementById('all-save-btn');
        if (!allSaveBtn) {
            allSaveBtn = document.createElement('button');
            allSaveBtn.id = 'all-save-btn';
            allSaveBtn.className = 'btn btn-primary btn-sm me-2';
            allSaveBtn.style.fontWeight = 'bold';
            allSaveBtn.style.fontSize = '0.85rem';

            const allCloseBtn = document.getElementById('all-close-btn');
            if (allCloseBtn && allCloseBtn.nextSibling) {
                container.insertBefore(allSaveBtn, allCloseBtn.nextSibling);
            } else {
                container.insertBefore(allSaveBtn, container.firstChild);
            }

            allSaveBtn.addEventListener('click', executeAllSave);
        }

        const enabledCount = getEnabledSaveButtons().length;
        allSaveBtn.textContent = `Alle speichern (${enabledCount})`;
        allSaveBtn.disabled = enabledCount === 0;
        return true;
    }

    // === NEU: Bestehende Werte ansehen Buttons ===

    // Globale Queue für sequentielle Verarbeitung
    let viewValuesQueue = [];
    let isProcessingViewValues = false;

    function findShareButtonInForm(form) {
        // Finde den Share-Button (mit bi-share-fill Icon) in der Form
        const shareButtons = form.querySelectorAll('button.btn-outline-primary');
        for (const btn of shareButtons) {
            if (btn.querySelector('svg.bi-share-fill')) {
                return btn;
            }
        }
        return null;
    }

    function createViewValuesButton(id) {
        const link = document.createElement('a');
        link.href = `https://opus.geizhals.at/kalif/artikel/property/value?id=${id}`;
        link.className = 'btn btn-outline-info btn-sm ms-2';
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        link.textContent = 'Bestehende Werte ansehen';
        link.setAttribute('data-view-values-btn', 'true');
        link.target = '_blank';
        return link;
    }

    async function extractIdFromShareButtonSequential(shareButton) {
        // Warte bis Tab fokussiert ist
        if (!document.hasFocus()) {
            await waitForTabFocus();
        }

        return new Promise((resolve) => {
            // Klicke den Share-Button
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            shareButton.dispatchEvent(clickEvent);

            // Warte und lese die Zwischenablage
            setTimeout(() => {
                navigator.clipboard.readText().then(clipboardText => {
                    const match = clipboardText.match(/[?&]id=(\d+)/);
                    resolve(match ? match[1] : null);
                }).catch(() => resolve(null));
            }, 150);
        });
    }

    function waitForTabFocus() {
        return new Promise((resolve) => {
            if (document.hasFocus()) {
                resolve();
                return;
            }

            const focusHandler = () => {
                window.removeEventListener('focus', focusHandler);
                resolve();
            };
            window.addEventListener('focus', focusHandler);
        });
    }

    async function processViewValuesQueue() {
        if (isProcessingViewValues) return;
        if (viewValuesQueue.length === 0) return;

        // Warte bis Tab fokussiert ist bevor Verarbeitung startet
        if (!document.hasFocus()) {
            await waitForTabFocus();
        }

        isProcessingViewValues = true;

        while (viewValuesQueue.length > 0) {
            const { buttonRow, form } = viewValuesQueue.shift();

            // Prüfe ob Button bereits existiert
            if (buttonRow.querySelector('[data-view-values-btn]')) continue;

            const shareButton = findShareButtonInForm(form);
            if (!shareButton) continue;

            const id = await extractIdFromShareButtonSequential(shareButton);

            if (id && !buttonRow.querySelector('[data-view-values-btn]')) {
                const viewValuesBtn = createViewValuesButton(id);
                buttonRow.appendChild(viewValuesBtn);
            }

            // Kurze Pause zwischen den Verarbeitungen
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        isProcessingViewValues = false;
    }

    function addViewValuesButtons() {
        // Finde alle ausgeklappten Zeilen (expanded rows)
        const expandedRows = document.querySelectorAll('tr.ft__body__expanded__row');

        for (const row of expandedRows) {
            const form = row.querySelector('form.editor');
            if (!form) continue;

            // Finde die Buttonreihe (d-flex Container mit Templates und Artikel)
            const toolbar = form.querySelector('.btn-toolbar');
            if (!toolbar) continue;

            // Finde den mittleren d-flex Container (mit Templates und Artikel Buttons)
            const buttonContainers = toolbar.querySelectorAll(':scope > div.d-flex');
            let buttonRow = null;

            for (const container of buttonContainers) {
                const templatesBtn = container.querySelector('button');
                if (templatesBtn && templatesBtn.textContent.includes('Templates')) {
                    buttonRow = container;
                    break;
                }
            }

            if (!buttonRow) continue;

            // Prüfe ob Button bereits existiert oder in Queue
            if (buttonRow.querySelector('[data-view-values-btn]')) continue;
            if (buttonRow.hasAttribute('data-view-values-queued')) continue;

            // Markiere als in Queue
            buttonRow.setAttribute('data-view-values-queued', 'true');

            // Füge zur Queue hinzu
            viewValuesQueue.push({ buttonRow, form });
        }

        // Starte Verarbeitung
        processViewValuesQueue();
    }

    // === Ende NEU ===

    function showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'multi-loading-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
        overlay.style.zIndex = '9998';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const spinner = document.createElement('div');
        spinner.style.width = '60px';
        spinner.style.height = '60px';
        spinner.style.border = '6px solid #f3f3f3';
        spinner.style.borderTop = '6px solid #3498db';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 1s linear infinite';
        spinner.style.zIndex = '9999';

        if (!document.getElementById('multi-spin-style')) {
            const style = document.createElement('style');
            style.id = 'multi-spin-style';
            style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }

        overlay.appendChild(spinner);
        document.body.appendChild(overlay);
        return overlay;
    }

    function hideLoadingOverlay() {
        const overlay = document.getElementById('multi-loading-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }

    function updateSaveButtonProgress(current, total) {
        const allSaveBtn = document.getElementById('all-save-btn');
        if (allSaveBtn) {
            allSaveBtn.textContent = `Speichern... (${current}/${total})`;
        }
    }

    function updateOpenButtonProgress(current, total) {
        const allOpenBtn = document.getElementById('all-open-btn');
        if (allOpenBtn) {
            allOpenBtn.textContent = `Öffnen... (${current}/${total})`;
        }
    }

    function updateCloseButtonProgress(current, total) {
        const allCloseBtn = document.getElementById('all-close-btn');
        if (allCloseBtn) {
            allCloseBtn.textContent = `Schließen... (${current}/${total})`;
        }
    }

    async function executeAllSave() {
        const buttons = getEnabledSaveButtons();
        if (buttons.length === 0) {
            return;
        }

        if (!confirm(`${buttons.length} Keys speichern?`)) {
            return;
        }

        isOperationRunning = true;
        const totalCount = buttons.length;

        showLoadingOverlay();

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];

            updateSaveButtonProgress(i + 1, totalCount);

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(clickEvent);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        hideLoadingOverlay();
        isOperationRunning = false;
        scheduleUpdate();
    }

    async function executeAllOpen() {
        const buttons = getCollapsedEditButtons();
        if (buttons.length === 0) {
            return;
        }

        isOperationRunning = true;
        const totalCount = buttons.length;

        showLoadingOverlay();

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];

            updateOpenButtonProgress(i + 1, totalCount);

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(clickEvent);

            await waitForButtonToOpen(button, 5000);

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        hideLoadingOverlay();
        isOperationRunning = false;
        scheduleUpdate();
    }

    async function executeAllClose() {
        const buttons = getOpenedEditButtons();
        if (buttons.length === 0) {
            return;
        }

        isOperationRunning = true;
        const totalCount = buttons.length;

        showLoadingOverlay();

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];

            updateCloseButtonProgress(i + 1, totalCount);

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(clickEvent);

            await waitForButtonToClose(button, 5000);

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        hideLoadingOverlay();
        isOperationRunning = false;
        scheduleUpdate();
    }

    function waitForButtonToOpen(button, timeout = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            const checkButton = () => {
                if (button.classList.contains('btn-outline-primary') ||
                    !button.classList.contains('btn-primary') ||
                    !button.querySelector('svg.bi-pencil-fill')) {
                    resolve(true);
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    resolve(false);
                    return;
                }

                setTimeout(checkButton, 50);
            };

            checkButton();
        });
    }

    function waitForButtonToClose(button, timeout = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            const checkButton = () => {
                if (button.classList.contains('btn-primary') &&
                    !button.classList.contains('btn-outline-primary') &&
                    button.querySelector('svg.bi-pencil-fill')) {
                    resolve(true);
                    return;
                }

                if (!document.contains(button)) {
                    resolve(true);
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    resolve(false);
                    return;
                }

                setTimeout(checkButton, 50);
            };

            checkButton();
        });
    }

    function scheduleUpdate() {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        updateTimeout = setTimeout(() => {
            if (isOperationRunning) {
                return;
            }

            modifyArtikelLinks();

            const allOpenBtn = document.getElementById('all-open-btn');
            if (allOpenBtn) {
                const collapsedCount = getCollapsedEditButtons().length;
                allOpenBtn.textContent = `Alle öffnen (${collapsedCount})`;
                allOpenBtn.disabled = collapsedCount === 0;
            } else {
                createAllOpenButton();
            }

            const allCloseBtn = document.getElementById('all-close-btn');
            if (allCloseBtn) {
                const openedCount = getOpenedEditButtons().length;
                allCloseBtn.textContent = `Alle schließen (${openedCount})`;
                allCloseBtn.disabled = openedCount === 0;
            } else {
                createAllCloseButton();
            }

            const allSaveBtn = document.getElementById('all-save-btn');
            if (allSaveBtn) {
                const enabledCount = getEnabledSaveButtons().length;
                allSaveBtn.textContent = `Alle speichern (${enabledCount})`;
                allSaveBtn.disabled = enabledCount === 0;
            } else {
                createAllSaveButton();
            }

            // NEU: Bestehende Werte ansehen Buttons hinzufügen
            addViewValuesButtons();
        }, 100);
    }

    function observeDomChanges() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' &&
                    mutation.target.classList.contains('btn-success') &&
                    mutation.attributeName === 'disabled') {
                    scheduleUpdate();
                    return;
                }

                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    mutation.target.tagName === 'BUTTON') {
                    scheduleUpdate();
                    return;
                }

                if (mutation.type === 'childList' &&
                    mutation.target !== document.getElementById('all-open-btn') &&
                    mutation.target !== document.getElementById('all-close-btn') &&
                    mutation.target !== document.getElementById('all-save-btn')) {
                    scheduleUpdate();
                    return;
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'class']
        });
    }

    function tryCreateButtons() {
        const openCreated = createAllOpenButton();
        const closeCreated = createAllCloseButton();
        const saveCreated = createAllSaveButton();
        if (!openCreated || !closeCreated || !saveCreated) {
            setTimeout(tryCreateButtons, 500);
        }
    }

    function onHashChange() {
        setTimeout(() => {
            modifyArtikelLinks();
            tryCreateButtons();
            addViewValuesButtons();
        }, 500);
    }

    // === Artikelbezeichnungen laden (für /property/value Seite) ===

    function getValueTableRows() {
        const table = document.querySelector('table.table tbody');
        if (!table) return [];
        return Array.from(table.querySelectorAll('tr'));
    }

    function getPropertyIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async function checkIfDataTypeIsArtikelReferenz() {
        const propertyId = getPropertyIdFromUrl();
        if (!propertyId) return false;

        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            document.body.appendChild(iframe);

            const timeoutId = setTimeout(() => {
                iframe.remove();
                resolve(false);
            }, 10000);

            iframe.onload = () => {
                setTimeout(() => {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                        // Finde das select Element für data_type
                        const dataTypeSelect = iframeDoc.querySelector('select[name="data_type"]');

                        if (dataTypeSelect) {
                            // Prüfe ob "Artikel Referenz (ohne Einheit)" (value="43") ausgewählt ist
                            const selectedValue = dataTypeSelect.value;
                            clearTimeout(timeoutId);
                            iframe.remove();
                            resolve(selectedValue === '43');
                            return;
                        }

                        clearTimeout(timeoutId);
                        iframe.remove();
                        resolve(false);
                    } catch (error) {
                        clearTimeout(timeoutId);
                        iframe.remove();
                        resolve(false);
                    }
                }, 2000);
            };

            iframe.onerror = () => {
                clearTimeout(timeoutId);
                iframe.remove();
                resolve(false);
            };

            iframe.src = `https://opus.geizhals.at/kalif/artikel/property?id=${propertyId}`;
        });
    }

    function findWertHeaderCell() {
        const headerCells = document.querySelectorAll('table.table thead th');
        for (const th of headerCells) {
            const span = th.querySelector('span');
            if (span && span.textContent.trim() === 'Wert') {
                return th;
            }
        }
        return null;
    }

    function createLoadArticleNamesButton() {
        const btn = document.createElement('button');
        btn.id = 'load-article-names-btn';
        btn.className = 'btn btn-outline-info btn-sm ms-2';
        btn.textContent = 'Artikelbezeichnungen laden';
        btn.style.whiteSpace = 'nowrap';
        return btn;
    }

    async function fetchArticleName(articleId) {
        return new Promise((resolve) => {
            // Erstelle versteckten iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            document.body.appendChild(iframe);

            const timeoutId = setTimeout(() => {
                iframe.remove();
                resolve(null);
            }, 10000); // 10 Sekunden Timeout

            iframe.onload = () => {
                // Warte kurz bis React gerendert hat
                setTimeout(() => {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                        // Spezifischer Selektor
                        const inputField = iframeDoc.querySelector('.w-100 .input-group input.form-control[disabled]');

                        if (inputField) {
                            const value = inputField.getAttribute('value');
                            if (value && value.length > 0) {
                                clearTimeout(timeoutId);
                                iframe.remove();
                                resolve(value);
                                return;
                            }
                        }

                        // Fallback: Alle disabled form-control Inputs
                        const inputFields = iframeDoc.querySelectorAll('input.form-control[disabled]');
                        for (const input of inputFields) {
                            const value = input.getAttribute('value');
                            if (value && value.length > 0 && !value.match(/^\d+$/)) {
                                clearTimeout(timeoutId);
                                iframe.remove();
                                resolve(value);
                                return;
                            }
                        }

                        clearTimeout(timeoutId);
                        iframe.remove();
                        resolve(null);
                    } catch (error) {
                        clearTimeout(timeoutId);
                        iframe.remove();
                        resolve(null);
                    }
                }, 2000); // 2 Sekunden warten bis React gerendert hat
            };

            iframe.onerror = () => {
                clearTimeout(timeoutId);
                iframe.remove();
                resolve(null);
            };

            iframe.src = `https://opus.geizhals.at/kalif/artikel?id=${articleId}`;
        });
    }

    async function loadArticleNames() {
        const btn = document.getElementById('load-article-names-btn');
        if (!btn) return;

        // Speichere die Daten VOR dem Laden
        const rows = getValueTableRows();
        const itemsToProcess = [];

        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length < 2) continue;

            const valueCell = cells[1];
            const valueText = valueCell.textContent.trim();

            // Überspringe leere Werte
            if (!valueText) continue;

            itemsToProcess.push({
                valueCell,
                articleId: valueText
            });
        }

        if (itemsToProcess.length === 0) {
            btn.textContent = 'Keine Artikel gefunden';
            btn.className = 'btn btn-warning btn-sm ms-2';
            return;
        }

        // Button deaktivieren und Status anzeigen
        btn.disabled = true;
        const total = itemsToProcess.length;
        let successCount = 0;
        let processedCount = 0;

        const BATCH_SIZE = 5;

        // Verarbeite in Batches
        for (let i = 0; i < itemsToProcess.length; i += BATCH_SIZE) {
            const batch = itemsToProcess.slice(i, i + BATCH_SIZE);
            btn.textContent = `Lade... (${Math.min(i + BATCH_SIZE, total)}/${total})`;

            // Lade alle Items im Batch parallel
            const results = await Promise.all(
                batch.map(async (item) => {
                    const articleName = await fetchArticleName(item.articleId);
                    return { item, articleName };
                })
            );

            // Verarbeite Ergebnisse
            for (const { item, articleName } of results) {
                if (articleName) {
                    // Ersetze den Inhalt der Zelle
                    item.valueCell.innerHTML = '';

                    const link = document.createElement('a');
                    link.href = `https://opus.geizhals.at/kalif/artikel?id=${item.articleId}`;
                    link.target = '_blank';
                    link.textContent = articleName;
                    link.title = `Artikel-ID: ${item.articleId}`;

                    item.valueCell.appendChild(link);
                    successCount++;
                }
                processedCount++;
            }

            // Kurze Pause zwischen Batches
            if (i + BATCH_SIZE < itemsToProcess.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        if (successCount === total) {
            btn.textContent = `Fertig ✓ (${successCount})`;
            btn.className = 'btn btn-success btn-sm ms-2';

            // Aktiviere eigene Sortierung für die Wert-Spalte
            setupCustomSorting();
        } else if (successCount > 0) {
            btn.textContent = `Teilweise geladen (${successCount}/${total})`;
            btn.className = 'btn btn-warning btn-sm ms-2';

            // Aktiviere eigene Sortierung auch bei teilweisem Erfolg
            setupCustomSorting();
        } else {
            btn.textContent = 'Fehler - keine Bezeichnungen gefunden';
            btn.className = 'btn btn-danger btn-sm ms-2';
        }

        // Nach 5 Sekunden Button wieder aktivieren falls nicht alle erfolgreich
        if (successCount < total) {
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = 'Artikelbezeichnungen laden';
                btn.className = 'btn btn-outline-info btn-sm ms-2';
            }, 5000);
        } else {
            // Nach 3 Sekunden Button entfernen wenn alle erfolgreich
            setTimeout(() => {
                btn.remove();
            }, 3000);
        }
    }

    let customSortOrder = 'none'; // 'none', 'asc', 'desc'

    function setupCustomSorting() {
        const wertHeader = findWertHeaderCell();
        if (!wertHeader) return;

        // Finde den Sortier-Button (span mit rotate--90)
        const sortButton = wertHeader.querySelector('span.rotate--90');
        if (!sortButton) return;

        // Entferne existierende Event-Listener durch Klonen
        const newSortButton = sortButton.cloneNode(true);
        sortButton.parentNode.replaceChild(newSortButton, sortButton);

        // Füge eigenen Click-Handler hinzu
        newSortButton.style.cursor = 'pointer';
        newSortButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            sortTableByWertColumn();
        });

        // Markiere als custom sorting aktiv
        wertHeader.setAttribute('data-custom-sort', 'true');
    }

    function sortTableByWertColumn() {
        const tbody = document.querySelector('table.table tbody');
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr'));
        if (rows.length === 0) return;

        // Toggle Sortierreihenfolge
        if (customSortOrder === 'none' || customSortOrder === 'desc') {
            customSortOrder = 'asc';
        } else {
            customSortOrder = 'desc';
        }

        // Sortiere Zeilen nach dem Textinhalt der Wert-Spalte (2. Spalte)
        rows.sort((a, b) => {
            const cellA = a.querySelectorAll('td')[1];
            const cellB = b.querySelectorAll('td')[1];

            if (!cellA || !cellB) return 0;

            const textA = cellA.textContent.trim().toLowerCase();
            const textB = cellB.textContent.trim().toLowerCase();

            let result = textA.localeCompare(textB, 'de');

            return customSortOrder === 'desc' ? -result : result;
        });

        // Füge sortierte Zeilen wieder ein
        rows.forEach(row => tbody.appendChild(row));

        // Update Sortier-Icon
        updateSortIcon();
    }

    function updateSortIcon() {
        const wertHeader = findWertHeaderCell();
        if (!wertHeader) return;

        const sortButton = wertHeader.querySelector('span.rotate--90');
        if (!sortButton) return;

        const svg = sortButton.querySelector('svg');
        if (!svg) return;

        // Ändere die Rotation basierend auf Sortierreihenfolge
        if (customSortOrder === 'asc') {
            sortButton.style.transform = 'rotate(-90deg)';
            sortButton.title = 'Aufsteigend sortiert - Klicken für absteigend';
        } else if (customSortOrder === 'desc') {
            sortButton.style.transform = 'rotate(90deg)';
            sortButton.title = 'Absteigend sortiert - Klicken für aufsteigend';
        }
    }

    async function initPropertyValuePage() {
        if (!isPropertyValuePage) return;

        // Prüfe ob Button oder Status bereits existiert
        if (document.getElementById('load-article-names-btn')) return;
        if (document.getElementById('load-article-names-status')) return;

        // Finde den "Wert" Header
        const wertHeader = findWertHeaderCell();
        if (!wertHeader) return;

        // Finde den div-Container im Header
        const headerDiv = wertHeader.querySelector('div.d-flex');
        if (!headerDiv) return;

        // Erstelle Status-Element
        const statusEl = document.createElement('span');
        statusEl.id = 'load-article-names-status';
        statusEl.className = 'badge bg-secondary ms-2';
        statusEl.textContent = 'Prüfe Datentyp...';
        headerDiv.appendChild(statusEl);

        // Prüfe ob data_type "Artikel Referenz" ist (async)
        const isArtikelReferenz = await checkIfDataTypeIsArtikelReferenz();

        // Entferne Status-Element
        statusEl.remove();

        if (!isArtikelReferenz) return;

        // Erstelle und füge Button hinzu
        const btn = createLoadArticleNamesButton();
        headerDiv.appendChild(btn);

        btn.addEventListener('click', loadArticleNames);
    }

    // === Ende Artikelbezeichnungen laden ===

    function init() {
        if (isInitialized) {
            return;
        }
        isInitialized = true;

        // Für /property/value Seite
        if (isPropertyValuePage) {
            setTimeout(() => {
                initPropertyValuePage();
            }, 1000);
            return;
        }

        // Für /property Hauptseite
        setTimeout(() => {
            modifyArtikelLinks();
            createAllOpenButton();
            createAllCloseButton();
            createAllSaveButton();
            addViewValuesButtons();
            observeDomChanges();
        }, 1000);

        window.addEventListener('hashchange', onHashChange);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();