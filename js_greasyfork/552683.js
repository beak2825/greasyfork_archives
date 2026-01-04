// ==UserScript==
// @name         enhanced logsum.pl
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.4.4
// @description  Fügt Buttons, ID-Spalte, Filterfunktion, Zeitraum-Filter, sortierbare Startseiten-Tabelle und Diagramm hinzu
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/pv-edit/logsum.pl*
// @noframes
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/552683/enhanced%20logsumpl.user.js
// @updateURL https://update.greasyfork.org/scripts/552683/enhanced%20logsumpl.meta.js
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
    if (!window.location.pathname.startsWith('/pv-edit/logsum.pl')) return;

    // Verhindere mehrfache Initialisierung im selben Fenster
    if (window.__enhancedLogsumInitialized) return;
    window.__enhancedLogsumInitialized = true;

    // -------------------- ZENTRALE EVENT-DEFINITION --------------------
    const EVENT_ORDER = [
        "AGR-EDIT","AUTO-FILL","BEWKEY-EDIT","BULK-CREATE","BULK-EDIT","CLONE",
        "COMMENT-CREATE","COMMENT-DELETE","COMMENT-UPDATE","CREATE","DF-CLONE",
        "DF-CREATE","DF-DELETE","DF-EDIT","EDIT","FILTER-MIGRATE","GHGEWINNSPIEL-EDIT",
        "HERSTELLER-EDIT","KEYVAL-EDIT","LINK","LINK-ADD","LINK-ADD-FROM-CSV",
        "LINK-ADD-MASS","LINK-DELETE","LINK-EDIT","LINK-VARIANT","MANUFACTURER-VARIANT",
        "MASS-EDIT","MASS-VALUE-EDIT","MATCH-ADD","MATCH-ADD-MR","MATCH-DELETE",
        "MIGRATE","MOVE","PICTURE","PREISLIMIT","RULE-BROKEN","RULMAC-ADD",
        "RULMAC-DELETE","RULMAC-EDIT","SIZE-PIN","STATUS","SYNONYM-EDIT",
        "SYNONYM_EDIT","TEMPLATE-EDIT","TODO","TODO COMMENT","TODO DEL",
        "TODO-DELETE","TODO-EDIT","TODO-EDIT Prio 1:","TODO-EDIT Prio 2:",
        "TODO-EDIT Prio 3:","TR-ADD","TR-DEL","TR-EDIT","UNLINK-VARIANT","VALUE-EDIT",
    ];

    const EVENT_COLORS = [
        '#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384',
        '#C9CBCF','#4BC0C0','#FF9F40','#FFCD56','#36A2EB','#9966FF','#FF6384',
        '#4BC0C0','#FF9F40','#FFCE56','#36A2EB','#9966FF','#C9CBCF'
    ];

    let table, diffState = true, viewMode = 'text', selectedEvents = new Set(), managedTables = new Set();
    let highlightEnabled = true, rowHoverEnabled = false, hasActionColumn = false, hasArtikelColumn = false;
    let chartInstance = null, chartVisible = false, headerElement = null;
    let originalChartData = null;
    let hiddenDataPoints = new Map();
    let sortState = { column: -1, ascending: true };

    const MAIN_FIELDS = ["BEZEICHNUNG","DESC","HINWEIS","KW","MATCHRULE","MPN"];

    function closeAllDropdowns() {
        document.querySelectorAll('.email-dd, .gh-link-dd, .compare-dd').forEach(dd => {
            dd.classList.remove('open');
        });
    }

    // Button Verwaltung
    const DEFAULT_BUTTONS = [
        { id: 'cmp-btn', label: '🔄 Vergleichen', visible: true, type: 'artikel' },
        { id: 'exp-btn', label: '📋 ID(s) kopieren', visible: true, type: 'artikel' },
        { id: 'gh-link-btn', label: '📋 GH-Link(s) kopieren', visible: true, type: 'artikel' },
        { id: 'email-btn', label: '📧 E-Mail-Text vorbereiten', visible: true, type: 'artikel' },
        { id: 'ers-btn', label: '🔗 Artikel-Ersetzer', visible: true, type: 'artikel' },
        { id: 'massimg-btn', label: '🖼️ mass-image', visible: true, type: 'artikel' },
        { id: 'such-btn', label: '🔎 such.pl', visible: true, type: 'artikel' },
        { id: 'chart-btn', label: '📊 Diagramm', visible: true, type: 'chart' },
        { id: 'evt-ms', label: 'Action', visible: true, type: 'action' },
        { id: 'view-sw', label: 'Text/Tabelle', visible: true, type: 'action' },
        { id: 'diff-check-wrap', label: 'Diff', visible: true, type: 'action' }
    ];

    let buttonConfig = [];

    function loadButtonConfig() {
        try {
            const saved = localStorage.getItem('logsum_button_config');
            if (saved) {
                buttonConfig = JSON.parse(saved);
            } else {
                buttonConfig = JSON.parse(JSON.stringify(DEFAULT_BUTTONS));
            }
        } catch (e) {
            buttonConfig = JSON.parse(JSON.stringify(DEFAULT_BUTTONS));
        }
    }

    function saveButtonConfig() {
        try {
            localStorage.setItem('logsum_button_config', JSON.stringify(buttonConfig));
        } catch (e) {
            // Silent fail
        }
    }

    function isStartpage() { return window.location.search === ''; }

    function detectColumns() {
        const headerRow = table.rows[0];
        if (!headerRow) return;
        const headers = Array.from(headerRow.cells).map(cell => cell.textContent.trim());
        hasActionColumn = headers.includes('Action');
        hasArtikelColumn = headers.includes('Artikel');
    }

    function findAndStoreHeader() {
        const h3Elements = document.querySelectorAll('h3');
        for (const h3 of h3Elements) {
            if (h3.textContent.includes('Einträge für die letzten')) {
                headerElement = h3;
                break;
            }
        }
    }

    function updateHeaderCount() {
        if (!headerElement) return;
        const visibleCount = getVisibleRowCount();
        const originalText = headerElement.textContent;
        const match = originalText.match(/(Einträge für die letzten .+)$/);
        if (match) headerElement.textContent = `${visibleCount} ${match[1]}`;
    }

    function getVisibleRowCount() {
        if (!table) return 0;
        let count = 0;
        Array.from(table.rows).slice(2).forEach(row => {
            if (row.style.display !== 'none' && !row.classList.contains('act-hide')) count++;
        });
        return count;
    }

    function shouldShowChart() {
        if (isStartpage()) return false;
        const urlParams = new URLSearchParams(window.location.search);
        const daysParam = urlParams.get('days');
        if (!daysParam) return false;
        const headerRow = table?.rows[0];
        if (!headerRow) return false;
        const headers = Array.from(headerRow.cells).map(cell => cell.textContent.trim());
        return headers.includes('Zeit (Wer)');
    }

    function init() {
        loadButtonConfig();
        if (isStartpage()) {
            createStartpageTable();
            return;
        }
        table = document.querySelector('table[border="1"]');
        if (!table) return;
        detectColumns();
        findAndStoreHeader();
        if (hasArtikelColumn) addCheckboxColumn();
        addIdColumn();
        storeOriginalNr();
        addFilterRow();
        addColumnSorting();
        addTimeRangeDropdown();
        addToolbar();
        if (hasActionColumn) processActions();
        processLinks();
        addStyles();
        if (hasArtikelColumn) {
            updateButtons();
            setTimeout(addImagesColumn, 50);
        }
        if (hasActionColumn) {
            initEvents();
            updateViewMode();
        }
        updateRowHoverState();
        updateHeaderCount();
        window.addEventListener('resize', adjustStickyPositions);
    }

    function createStartpageTable() {
        const whoLinks = Array.from(document.querySelectorAll('a[href*="?who="]'));
        if (!whoLinks.length) return;
        const entries = [];
        whoLinks.forEach(whoLink => {
            const href = whoLink.getAttribute('href');
            const match = href.match(/\?who=(.+)$/);
            if (!match) return;
            const displayName = whoLink.textContent.trim();
            let historyLink = null, nextNode = whoLink.nextSibling, countText = '';
            while (nextNode) {
                if (nextNode.nodeType === Node.TEXT_NODE) {
                    countText += nextNode.textContent;
                } else if (nextNode.nodeType === Node.ELEMENT_NODE && nextNode.tagName === 'A') {
                    if (nextNode.getAttribute('href')?.includes('?history=')) {
                        historyLink = nextNode;
                        break;
                    }
                }
                nextNode = nextNode.nextSibling;
                if (nextNode?.tagName === 'BR' || countText.length > 50) break;
            }
            const countMatch = countText.match(/\((\d+)\)/);
            const count = countMatch ? parseInt(countMatch[1]) : 0;
            entries.push({
                name: displayName,
                count: count,
                whoLink: href,
                historyLink: historyLink ? historyLink.getAttribute('href') : null
            });
        });
        if (!entries.length) return;
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'startpage-button-container';
        const toggleButton = document.createElement('button');
        toggleButton.className = 'btn startpage-toggle-btn';
        toggleButton.textContent = 'User Logs';
        toggleButton.style.cssText = 'margin: 20px 0 10px;';
        const tableContainer = document.createElement('div');
        tableContainer.className = 'startpage-table-container';
        tableContainer.style.display = 'none';
        const newTable = document.createElement('table');
        newTable.className = 'startpage-table';
        newTable.border = '1';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = [
            { text: 'Name', sortKey: 'name' },
            { text: 'Anzahl', sortKey: 'count' },
            { text: 'History', sortKey: null }
        ];
        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h.text;
            if (h.sortKey) {
                th.style.cursor = 'pointer';
                th.dataset.sortKey = h.sortKey;
                th.onclick = () => sortStartpageTable(newTable, h.sortKey);
                th.title = 'Klicken zum Sortieren';
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        newTable.appendChild(thead);
        const tbody = document.createElement('tbody');
        entries.forEach(entry => {
            const tr = document.createElement('tr');
            tr.dataset.count = entry.count;
            tr.dataset.name = entry.name.toLowerCase();
            const tdName = document.createElement('td');
            const nameLink = document.createElement('a');
            nameLink.href = entry.whoLink;
            nameLink.textContent = entry.name;
            tdName.appendChild(nameLink);
            tr.appendChild(tdName);
            const tdCount = document.createElement('td');
            tdCount.textContent = entry.count;
            tdCount.style.textAlign = 'right';
            tr.appendChild(tdCount);
            const tdHistory = document.createElement('td');
            tdHistory.style.textAlign = 'center';
            if (entry.historyLink) {
                const histLink = document.createElement('a');
                histLink.href = entry.historyLink;
                histLink.textContent = '*';
                tdHistory.appendChild(histLink);
            }
            tr.appendChild(tdHistory);
            tbody.appendChild(tr);
        });
        newTable.appendChild(tbody);
        tableContainer.appendChild(newTable);
        toggleButton.onclick = () => {
            if (tableContainer.style.display === 'none') {
                tableContainer.style.display = 'block';
                toggleButton.classList.add('active');
            } else {
                tableContainer.style.display = 'none';
                toggleButton.classList.remove('active');
            }
        };
        buttonContainer.appendChild(toggleButton);
        buttonContainer.appendChild(tableContainer);
        const actionTable = document.querySelector('table[border="1"]');
        if (actionTable && actionTable.parentNode) {
            actionTable.parentNode.insertBefore(buttonContainer, actionTable);
        } else {
            if (document.body.firstChild) {
                document.body.insertBefore(buttonContainer, document.body.firstChild);
            } else {
                document.body.appendChild(buttonContainer);
            }
        }
        const nodesToRemove = [];
        let currentNode = document.body.firstChild;
        while (currentNode && currentNode !== buttonContainer) {
            nodesToRemove.push(currentNode);
            currentNode = currentNode.nextSibling;
        }
        nodesToRemove.forEach(node => {
            if (node && node.parentNode) node.parentNode.removeChild(node);
        });
        sortStartpageTable(newTable, 'name', 'asc');
        addStartpageStyles();
    }

    function sortStartpageTable(table, sortKey, forceOrder = null) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const currentSort = table.dataset.sortKey;
        const currentOrder = table.dataset.sortOrder || 'asc';
        let newOrder = forceOrder || 'asc';
        if (!forceOrder && currentSort === sortKey && currentOrder === 'asc') newOrder = 'desc';
        rows.sort((a, b) => {
            let valA, valB;
            if (sortKey === 'count') {
                valA = parseInt(a.dataset.count);
                valB = parseInt(b.dataset.count);
            } else {
                valA = a.dataset.name;
                valB = b.dataset.name;
            }
            if (valA < valB) return newOrder === 'asc' ? -1 : 1;
            if (valA > valB) return newOrder === 'asc' ? 1 : -1;
            return 0;
        });
        table.querySelectorAll('th').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.dataset.sortKey === sortKey) th.classList.add(`sort-${newOrder}`);
        });
        table.dataset.sortKey = sortKey;
        table.dataset.sortOrder = newOrder;
        rows.forEach(row => tbody.appendChild(row));
    }

    function addStartpageStyles() {
        const s = document.createElement('style');
        s.textContent = `
.startpage-button-container{margin:20px 0}
.startpage-toggle-btn{transition:background .3s,transform .2s}.startpage-toggle-btn.active{background:#2196F3!important;transform:scale(1.05)}
.startpage-table-container{margin:10px 0}
.startpage-table{border-collapse:collapse;width:auto;min-width:400px;margin:10px 0}
.startpage-table th,.startpage-table td{border:1px solid #ddd;padding:8px 12px;text-align:left}
.startpage-table th{background:#f0f0f0;font-weight:700;position:relative;user-select:none}
.startpage-table th[data-sort-key]:hover{background:#e0e0e0}
.startpage-table th.sort-asc::after{content:" ▲";font-size:10px;color:#4CAF50}
.startpage-table th.sort-desc::after{content:" ▼";font-size:10px;color:#4CAF50}
.startpage-table tbody tr:hover{background:#f5f5f5}
.startpage-table a{color:#2196F3;text-decoration:none}
.startpage-table a:hover{text-decoration:underline}
        `;
        document.head.appendChild(s);
    }

    function addTimeRangeDropdown() {
        if (isStartpage()) return;
        const submitBtn = document.querySelector('input[type="submit"][name="submit"][value="Aktualisieren"]');
        if (!submitBtn) return;
        const urlParams = new URLSearchParams(window.location.search);
        const whatParam = urlParams.get('what');
        const hideExtendedOptions = !whatParam || whatParam === 'EDIT' || whatParam === 'MASS-EDIT' || whatParam === 'MASS-VALUE-EDIT';
        const select = document.createElement('select');
        select.className = 'time-range-select';
        select.style.cssText = 'margin-left: 8px; padding: 4px 8px; font-size: 13px; border: 1px solid #ccc; border-radius: 3px; cursor: pointer;';
        const options = [
            { value: '', label: 'Zeitraum wählen...' },
            { value: '0.1', label: '0.1 Tag' },
            { value: '0.5', label: '0.5 Tag' },
            { value: '1', label: '1 Tag' },
            { value: '2', label: '2 Tage' },
            { value: '3', label: '3 Tage' },
            { value: '7', label: '7 Tage', extended: true },
            { value: 'week', label: 'Diese Woche', extended: true },
            { value: 'month', label: 'Dieser Monat', extended: true },
            { value: 'year', label: 'Dieses Jahr', extended: true }
        ];
        options.forEach(opt => {
            if (opt.extended && hideExtendedOptions) return;
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });
        select.addEventListener('change', function() {
            if (!this.value) return;
            let days = this.value;
            if (days === 'week') days = calculateDaysSinceMonday();
            else if (days === 'month') days = calculateDaysSinceMonthStart();
            else if (days === 'year') days = calculateDaysSinceYearStart();
            const newUrl = updateUrlWithDays(window.location.href, days);
            window.location.href = newUrl;
        });
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'date-picker-input';
        dateInput.style.cssText = 'margin-left: 8px;';
        const today = new Date();
        const maxDate = today.toISOString().split('T')[0];
        dateInput.max = maxDate;
        dateInput.title = 'Startdatum wählen';
        dateInput.onchange = function() {
            const selectedDate = this.value;
            if (!selectedDate) return;
            const startDate = new Date(selectedDate + 'T00:00:00');
            const now = new Date();
            const diffMs = now - startDate;
            const diffDays = diffMs / (1000 * 60 * 60 * 24);
            if (diffDays < 0) {
                alert('Das gewählte Datum liegt in der Zukunft!');
                this.value = '';
                return;
            }
            const days = diffDays.toFixed(2);
            const newUrl = updateUrlWithDays(window.location.href, days);
            window.location.href = newUrl;
        };
        submitBtn.parentNode.insertBefore(select, submitBtn.nextSibling);
        submitBtn.parentNode.insertBefore(dateInput, select.nextSibling);
    }

    function calculateDaysSinceMonday() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const monday = new Date(now);
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        monday.setDate(now.getDate() - daysToSubtract);
        monday.setHours(0, 0, 0, 0);
        const diffMs = now - monday;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays.toFixed(2);
    }

    function calculateDaysSinceMonthStart() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const diffMs = now - monthStart;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays.toFixed(2);
    }

    function calculateDaysSinceYearStart() {
        const now = new Date();
        const yearStart = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        const diffMs = now - yearStart;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays.toFixed(2);
    }

    function updateUrlWithDays(url, days) {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        params.set('days', days);
        params.delete('random');
        params.delete('submit');
        return urlObj.toString();
    }

    function addCheckboxColumn() {
        Array.from(table.rows).forEach((row, i) => {
            if (i === 0) {
                const th = document.createElement('th');
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'master-cb';
                cb.onchange = () => {
                    document.querySelectorAll('.row-cb').forEach(c => {
                        if (c.closest('tr').style.display !== 'none' && !c.closest('tr').classList.contains('act-hide')) c.checked = cb.checked;
                    });
                    updateButtons();
                };
                th.appendChild(cb);
                row.insertBefore(th, row.firstChild);
            } else {
                const td = document.createElement('td');
                td.style.textAlign = 'center';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'row-cb';
                cb.onchange = updateButtons;
                td.appendChild(cb);
                row.insertBefore(td, row.firstChild);
            }
        });
    }

    function addIdColumn() {
        if (!hasArtikelColumn) return;
        Array.from(table.rows).forEach((row, i) => {
            if (i === 0) {
                const th = document.createElement('th');
                th.textContent = 'ID';
                row.insertBefore(th, row.children[1]);
            } else {
                const td = document.createElement('td');
                const link = row.querySelector('a[href*="kalif/artikel?id="]');
                if (link) {
                    const m = link.href.match(/id=(\d+)/);
                    if (m) {
                        td.textContent = m[1];
                        td.style.textAlign = 'center';
                    }
                }
                row.insertBefore(td, row.children[1]);
            }
        });
    }

    function addImagesColumn() {
        if (!hasArtikelColumn) return;

        // Find ID column index by looking for the header
        let idColIndex = -1;
        const headerRow = table.rows[0];
        if (headerRow) {
            Array.from(headerRow.cells).forEach((cell, idx) => {
                if (cell.textContent.trim() === 'ID') {
                    idColIndex = idx;
                }
            });
        }

        // Add header
        if (headerRow) {
            const th = document.createElement('th');
            th.textContent = 'Bilder';
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        }

        // Filter row
        const filterRow = table.rows[1];
        if (filterRow && filterRow.classList.contains('f-row')) {
            const th = document.createElement('th');
            th.style.background = '#f0f0f0';
            filterRow.appendChild(th);
        }

        // Add image links
        Array.from(table.rows).slice(2).forEach(row => {
            let id = null;

            if (idColIndex >= 0) {
                id = row.children[idColIndex]?.textContent.trim();
            }

            if (!id) {
                const link = row.querySelector('a[href*="kalif/artikel?id="]');
                if (link) {
                    const m = link.href.match(/id=(\d+)/);
                    if (m) id = m[1];
                }
            }

            const td = document.createElement('td');
            td.style.textAlign = 'center';

            if (id) {
                const link = document.createElement('a');
                link.href = `https://opus.geizhals.at/kalif/artikel?id=${id}&mode=image`;
                link.textContent = 'Link';
                link.target = '_blank';
                link.style.color = '#2196F3';
                link.style.textDecoration = 'none';
                link.title = 'Bilder anzeigen';
                td.appendChild(link);
            }

            row.appendChild(td);
        });
    }

    function storeOriginalNr() {
        const nrIndex = findColumnIndex('Nr');
        if (nrIndex === -1) return;
        Array.from(table.rows).slice(1).forEach(row => {
            row.dataset.origNr = row.children[nrIndex]?.textContent.trim() || '';
        });
    }

    function addFilterRow() {
        const hRow = table.rows[0];
        const fRow = document.createElement('tr');
        fRow.className = 'f-row';
        const cols = table.rows[1] ? table.rows[1].children.length : hRow.children.length;
        hRow.classList.add('sticky-header');
        for (let i = 0; i < cols; i++) {
            const th = document.createElement('th');
            const headerText = hRow.children[i]?.textContent.trim() || '';
            if ((hasArtikelColumn && i === 0) || i >= (hasActionColumn ? 6 : 5)) {
                th.style.background = '#f0f0f0';
            } else {
                const inp = document.createElement('input');
                inp.className = 'col-flt';
                inp.placeholder = headerText === 'Nr' ? '🔍 2-5 -3' : '🔍 Filter...';
                if (i <= (hasArtikelColumn ? 2 : 1)) inp.classList.add('wide');
                if (headerText === 'Action') inp.classList.add('action-flt');
                if (headerText === 'Nr') inp.dataset.isNrFilter = 'true';
                inp.dataset.idx = i;
                inp.oninput = filterTable;
                th.appendChild(inp);
            }
            fRow.appendChild(th);
        }
        hRow.parentNode.insertBefore(fRow, hRow.nextSibling);
        setTimeout(adjustStickyPositions, 0);
    }

    function addColumnSorting() {
        const headerRow = table.rows[0];
        if (!headerRow) return;

        const sortableColumns = [];
        Array.from(headerRow.cells).forEach((cell, index) => {
            const text = cell.textContent.trim();
            if (['Nr', 'ID', 'Zeit (Wer)', 'Artikel', 'Action'].includes(text)) {
                sortableColumns.push({ index, name: text });
            }
        });

        sortableColumns.forEach(({ index, name }) => {
            const headerCell = headerRow.cells[index];
            headerCell.style.cursor = 'pointer';
            headerCell.title = 'Klicken zum Sortieren';
            headerCell.dataset.originalText = name;
            headerCell.dataset.sortableIndex = index;

            headerCell.addEventListener('click', (e) => {
                e.preventDefault();
                if (sortState.column === index) {
                    sortState.ascending = !sortState.ascending;
                } else {
                    sortState.column = index;
                    sortState.ascending = true;
                }
                sortTable(index, sortState.ascending);
                updateSortIndicators(sortableColumns);
            });
        });
    }

    function sortTable(columnIndex, ascending) {
        const rows = Array.from(table.rows).slice(2);

        rows.sort((rowA, rowB) => {
            const cellA = rowA.children[columnIndex];
            const cellB = rowB.children[columnIndex];

            if (!cellA || !cellB) return 0;

            let valueA = cellA.textContent.trim();
            let valueB = cellB.textContent.trim();

            // Spezialbehandlung für Zeit-Spalte
            const headerCell = table.rows[0].cells[columnIndex];
            if (headerCell && headerCell.textContent.includes('Zeit')) {
                const timeA = parseTimestamp(valueA);
                const timeB = parseTimestamp(valueB);
                if (timeA && timeB) {
                    return ascending ? timeA - timeB : timeB - timeA;
                }
            }

            // Numerisch wenn beide Zahlen sind
            const numA = parseFloat(valueA);
            const numB = parseFloat(valueB);

            if (!isNaN(numA) && !isNaN(numB)) {
                return ascending ? numA - numB : numB - numA;
            }

            // Alphanumerisch
            return ascending
                ? valueA.localeCompare(valueB, 'de', { numeric: true })
                : valueB.localeCompare(valueA, 'de', { numeric: true });
        });

        // Re-append sorted rows
        rows.forEach(row => table.appendChild(row));
    }

    function updateSortIndicators(sortableColumns) {
        sortableColumns.forEach(({ index, name }) => {
            const headerCell = table.rows[0].cells[index];
            if (!headerCell) return;

            if (sortState.column === index) {
                headerCell.textContent = name + ' ' + (sortState.ascending ? '↑' : '↓');
            } else {
                headerCell.textContent = name;
            }
        });
    }

    function adjustStickyPositions() {
        const toolbar = document.querySelector('.toolbar');
        const headerRow = table.querySelector('.sticky-header');
        const filterRow = table.querySelector('.f-row');
        if (!toolbar || !headerRow || !filterRow) return;
        const toolbarHeight = toolbar.offsetHeight;
        const headerHeight = headerRow.offsetHeight;
        headerRow.style.top = toolbarHeight + 'px';
        filterRow.style.top = (toolbarHeight + headerHeight) + 'px';
    }

    function buildButtonManagementOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'button-mgmt-overlay';
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };

        const modal = document.createElement('div');
        modal.className = 'button-mgmt-modal';

        const header = document.createElement('div');
        header.className = 'button-mgmt-header';
        header.innerHTML = '<h3>Button-Verwaltung</h3>';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'button-mgmt-close';
        closeBtn.textContent = '×';
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.className = 'button-mgmt-content';

        // Button-Liste
        const buttonsList = document.createElement('div');
        buttonsList.className = 'buttons-list';

        // Nur echte Buttons filtern - keine Controls/Toggles
        const visibleButtons = buttonConfig.filter(btn => {
            // Ausschließen: Komplexe Controls, nicht echte Buttons
            const excludedIds = ['evt-ms', 'view-sw', 'diff-check-wrap'];
            if (excludedIds.includes(btn.id)) return false;

            // Chart-Button ist IMMER sortierbar, egal ob Daten vorhanden
            // (wird nur in Toolbar versteckt wenn keine Daten)
            return true;
        });

        let draggedElement = null;

        visibleButtons.forEach((btn, index) => {
            const item = document.createElement('div');
            item.className = 'button-mgmt-item';
            item.dataset.btnId = btn.id;

            const label = document.createElement('span');
            label.className = 'button-mgmt-label';
            label.textContent = btn.label;

            const controls = document.createElement('div');
            controls.className = 'button-mgmt-controls';

            // Visibility Toggle
            const visBtn = document.createElement('button');
            visBtn.className = 'btn-mgmt-ctrl';
            visBtn.textContent = '-';
            visBtn.title = btn.visible ? 'Button verstecken' : 'Button anzeigen';
            visBtn.disabled = !btn.visible;
            visBtn.onclick = (e) => {
                e.stopPropagation();
                btn.visible = false;
                saveButtonConfig();
                applyButtonVisibility();

                // Entferne das alte Overlay sauber
                const oldOverlay = document.querySelector('.button-mgmt-overlay');
                if (oldOverlay) oldOverlay.remove();

                // Zeige das neue Overlay
                const newOverlay = buildButtonManagementOverlay();
                document.body.appendChild(newOverlay);
            };

            const hidBtn = document.createElement('button');
            hidBtn.className = 'btn-mgmt-ctrl';
            hidBtn.textContent = '+';
            hidBtn.title = 'Button anzeigen';
            hidBtn.disabled = btn.visible;
            hidBtn.onclick = (e) => {
                e.stopPropagation();
                btn.visible = true;
                saveButtonConfig();
                applyButtonVisibility();

                // Entferne das alte Overlay sauber
                const oldOverlay = document.querySelector('.button-mgmt-overlay');
                if (oldOverlay) oldOverlay.remove();

                // Zeige das neue Overlay
                const newOverlay = buildButtonManagementOverlay();
                document.body.appendChild(newOverlay);
            };

            // Order buttons (up/down)
            const upBtn = document.createElement('button');
            upBtn.className = 'btn-mgmt-ctrl order-btn';
            upBtn.textContent = '↑';
            upBtn.title = 'Nach oben';
            upBtn.disabled = index === 0;
            upBtn.onclick = (e) => {
                e.stopPropagation();
                if (index > 0) {
                    const buttonToSwapWith = visibleButtons[index - 1];
                    const currentBtnIndexInConfig = buttonConfig.findIndex(b => b.id === btn.id);
                    const swapBtnIndexInConfig = buttonConfig.findIndex(b => b.id === buttonToSwapWith.id);

                    [buttonConfig[currentBtnIndexInConfig], buttonConfig[swapBtnIndexInConfig]] =
                    [buttonConfig[swapBtnIndexInConfig], buttonConfig[currentBtnIndexInConfig]];

                    saveButtonConfig();

                    const oldToolbar = document.querySelector('.toolbar');
                    if (oldToolbar) oldToolbar.remove();
                    addToolbar();

                    const oldOverlay = document.querySelector('.button-mgmt-overlay');
                    if (oldOverlay) oldOverlay.remove();

                    const newOverlay = buildButtonManagementOverlay();
                    document.body.appendChild(newOverlay);
                }
            };

            const downBtn = document.createElement('button');
            downBtn.className = 'btn-mgmt-ctrl order-btn';
            downBtn.textContent = '↓';
            downBtn.title = 'Nach unten';
            downBtn.disabled = index === visibleButtons.length - 1;
            downBtn.onclick = (e) => {
                e.stopPropagation();
                if (index < visibleButtons.length - 1) {
                    const buttonToSwapWith = visibleButtons[index + 1];
                    const currentBtnIndexInConfig = buttonConfig.findIndex(b => b.id === btn.id);
                    const swapBtnIndexInConfig = buttonConfig.findIndex(b => b.id === buttonToSwapWith.id);

                    [buttonConfig[currentBtnIndexInConfig], buttonConfig[swapBtnIndexInConfig]] =
                    [buttonConfig[swapBtnIndexInConfig], buttonConfig[currentBtnIndexInConfig]];

                    saveButtonConfig();

                    const oldToolbar = document.querySelector('.toolbar');
                    if (oldToolbar) oldToolbar.remove();
                    addToolbar();

                    const oldOverlay = document.querySelector('.button-mgmt-overlay');
                    if (oldOverlay) oldOverlay.remove();

                    const newOverlay = buildButtonManagementOverlay();
                    document.body.appendChild(newOverlay);
                }
            };

            controls.appendChild(hidBtn);
            controls.appendChild(visBtn);
            controls.appendChild(upBtn);
            controls.appendChild(downBtn);

            item.appendChild(label);
            item.appendChild(controls);
            buttonsList.appendChild(item);
        });

        // Checkboxes aus Toolbar
        const settingsDiv = document.createElement('div');
        settingsDiv.className = 'button-mgmt-settings';

        const settingsTitle = document.createElement('div');
        settingsTitle.className = 'button-mgmt-settings-title';
        settingsTitle.textContent = 'Einstellungen';

        const highlightLabel = document.createElement('label');
        highlightLabel.className = 'mgmt-checkbox-label';
        const highlightCheck = document.createElement('input');
        highlightCheck.type = 'checkbox';
        highlightCheck.checked = highlightEnabled;
        highlightCheck.onchange = (e) => {
            highlightEnabled = e.target.checked;
            filterTable();
        };
        highlightLabel.appendChild(highlightCheck);
        highlightLabel.appendChild(document.createTextNode('Suchergebnisse hervorheben'));

        const hoverLabel = document.createElement('label');
        hoverLabel.className = 'mgmt-checkbox-label';
        const hoverCheck = document.createElement('input');
        hoverCheck.type = 'checkbox';
        hoverCheck.checked = rowHoverEnabled;
        hoverCheck.onchange = (e) => {
            rowHoverEnabled = e.target.checked;
            updateRowHoverState();
        };
        hoverLabel.appendChild(hoverCheck);
        hoverLabel.appendChild(document.createTextNode('Tabellenzeilen hervorheben (Mouseover)'));

        settingsDiv.appendChild(settingsTitle);
        settingsDiv.appendChild(highlightLabel);
        settingsDiv.appendChild(hoverLabel);

        content.appendChild(buttonsList);
        content.appendChild(settingsDiv);

        modal.appendChild(header);
        modal.appendChild(content);
        overlay.appendChild(modal);

        return overlay;
    }

    function applyButtonVisibility() {
        buttonConfig.forEach(btn => {
            const element = document.getElementById(btn.id);
            if (element) {
                if (!btn.visible) {
                    element.style.display = 'none';
                } else {
                    element.style.display = '';
                }
            }
        });
    }

    function addToolbar() {
        try {
            const bar = document.createElement('div');
            bar.className = 'toolbar';

            const tbarL = document.createElement('div');
            tbarL.className = 'tbar-l';

            const urlParams = new URLSearchParams(window.location.search);
            const whatParam = urlParams.get('what');
            const hideDropdown = !!whatParam;

            // Gear Icon (immer am Anfang) - ohne Button-Styling
            const gearBtn = document.createElement('span');
            gearBtn.id = 'settings-gear';
            gearBtn.className = 'gear-icon';
            gearBtn.title = 'Button-Verwaltung';
            gearBtn.textContent = '⚙️';
            gearBtn.style.cursor = 'pointer';
            gearBtn.style.fontSize = '18px';
            gearBtn.style.userSelect = 'none';
            gearBtn.onclick = () => {
                const overlay = buildButtonManagementOverlay();
                document.body.appendChild(overlay);
            };
            tbarL.appendChild(gearBtn);

            // IDs der sortierbar Buttons
            const sortableButtonIds = ['exp-btn', 'gh-link-btn', 'email-btn', 'ers-btn', 'massimg-btn', 'such-btn', 'cmp-btn', 'chart-btn'];

            // ERSTE REIHE: Alle sortierbar Buttons in buttonConfig Reihenfolge
            buttonConfig.forEach(btn => {
                if (!sortableButtonIds.includes(btn.id)) return;
                if (!btn.visible) return;

                // Überspringe Buttons die nicht sichtbar sein sollen
                if (btn.type === 'artikel' && !hasArtikelColumn) return;
                if (btn.type === 'chart' && !shouldShowChart()) return;

                // Button basierend auf ID erstellen
                switch(btn.id) {
                    case 'ers-btn':
                        if (!hasArtikelColumn) return;
                        const ersBtn = document.createElement('button');
                        ersBtn.id = 'ers-btn';
                        ersBtn.className = 'btn';
                        ersBtn.textContent = '🔗 Artikel-Ersetzer';
                        ersBtn.onclick = openErsetzer;
                        tbarL.appendChild(ersBtn);
                        break;

                    case 'massimg-btn':
                        if (!hasArtikelColumn) return;
                        const massimgBtn = document.createElement('button');
                        massimgBtn.id = 'massimg-btn';
                        massimgBtn.className = 'btn';
                        massimgBtn.textContent = '🖼️ mass-image';
                        massimgBtn.onclick = openMassimg;
                        tbarL.appendChild(massimgBtn);
                        break;

                    case 'such-btn':
                        if (!hasArtikelColumn) return;
                        const suchBtn = document.createElement('button');
                        suchBtn.id = 'such-btn';
                        suchBtn.className = 'btn';
                        suchBtn.textContent = '🔎 such.pl';
                        suchBtn.onclick = openSuch;
                        tbarL.appendChild(suchBtn);
                        break;

                    case 'gh-link-btn':
                        if (!hasArtikelColumn) return;
                        const ghLinkContainer = document.createElement('div');
                        ghLinkContainer.className = 'gh-link-container';
                        ghLinkContainer.appendChild(buildGhLinkDropdown());
                        tbarL.appendChild(ghLinkContainer);
                        break;

                    case 'email-btn':
                        if (!hasArtikelColumn) return;
                        const emailContainer = document.createElement('div');
                        emailContainer.className = 'email-container';
                        emailContainer.appendChild(buildEmailDropdown());
                        tbarL.appendChild(emailContainer);
                        break;

                    case 'cmp-btn':
                        if (!hasArtikelColumn) return;
                        const cmpContainer = document.createElement('div');
                        cmpContainer.className = 'compare-container';
                        cmpContainer.appendChild(buildCompareDropdown());
                        tbarL.appendChild(cmpContainer);
                        break;

                    case 'exp-btn':
                        if (!hasArtikelColumn) return;
                        const expBtn = document.createElement('button');
                        expBtn.id = 'exp-btn';
                        expBtn.className = 'btn';
                        expBtn.textContent = '📋 ID(s) kopieren';
                        expBtn.onclick = exportIds;
                        tbarL.appendChild(expBtn);
                        break;

                    case 'chart-btn':
                        if (!shouldShowChart()) return;
                        const chartBtn = document.createElement('button');
                        chartBtn.id = 'chart-btn';
                        chartBtn.className = 'btn';
                        chartBtn.textContent = '📊 Diagramm';
                        chartBtn.onclick = toggleChart;
                        tbarL.appendChild(chartBtn);
                        break;
                }
            });

            // ZWEITE REIHE: Andere Elemente (Action, Text/Tabelle, Diff)
            if (hasActionColumn && !hideDropdown) {
                const evtMsDiv = document.createElement('div');
                evtMsDiv.id = 'evt-ms';
                evtMsDiv.className = 'evt-ms';
                evtMsDiv.appendChild(buildEvtMS());
                tbarL.appendChild(evtMsDiv);

                const controlsGroup = document.createElement('div');
                controlsGroup.className = 'controls-group';
                const viewSwLabel = document.createElement('label');
                viewSwLabel.className = 'sw view-sw';
                viewSwLabel.id = 'view-sw';
                viewSwLabel.innerHTML = `
                    <input type="checkbox" class="view-toggle">
                    <span class="sl"></span>
                    <span class="sw-label">
                        <span class="mode-text">Text (Original)</span>
                        <span class="mode-table">Tabelle</span>
                    </span>
                `;
                const viewToggle = viewSwLabel.querySelector('.view-toggle');
                viewToggle.onchange = (e) => {
                    viewMode = e.target.checked ? 'table' : 'text';
                    updateViewMode();
                };
                controlsGroup.appendChild(viewSwLabel);

                const diffLabel = document.createElement('label');
                diffLabel.className = 'sw diff-check-wrap';
                diffLabel.id = 'diff-check-wrap';
                diffLabel.innerHTML = `
                    <input type="checkbox" checked class="diff-check">
                    <span class="sl-check"></span>
                    <span>Diff</span>
                `;
                const diffCheck = diffLabel.querySelector('.diff-check');
                diffCheck.onchange = (e) => {
                    diffState = e.target.checked;
                    managedTables.forEach(t => applyDiff(t, diffState));
                };
                controlsGroup.appendChild(diffLabel);
                tbarL.appendChild(controlsGroup);
            }

            // DRITTE REIHE: Chart-Hint (wenn Chart sichtbar)
            if (shouldShowChart()) {
                const chartHint = document.createElement('span');
                chartHint.className = 'chart-hint';
                chartHint.style.display = 'none';
                chartHint.textContent = '💡 Datenpunkte klicken zum Aus-/Einblenden';
                tbarL.appendChild(chartHint);
            }

            bar.appendChild(tbarL);

            // Chart Container (wenn Diagramm sichtbar sein kann)
            if (shouldShowChart()) {
                const chartContainer = document.createElement('div');
                chartContainer.id = 'chart-container';
                chartContainer.style.display = 'none';
                chartContainer.innerHTML = `
                    <div id="chart-legend"></div>
                    <canvas id="event-chart"></canvas>
                `;
                bar.appendChild(chartContainer);
            }

            table.parentNode.insertBefore(bar, table);
            applyButtonVisibility();
        } catch (error) {
            // Silent fail
        }
    }

    function buildGhLinkDropdown() {
        const cont = document.createElement('div');
        cont.className = 'gh-link-ms';

        const trig = document.createElement('button');
        trig.className = 'btn gh-link-btn';
        trig.id = 'gh-link-btn';
        trig.innerHTML = '📋 GH-Link(s) kopieren';

        const dd = document.createElement('div');
        dd.className = 'gh-link-dd';

        const options = [
            { value: 'at', label: 'AT' },
            { value: 'de', label: 'DE' },
            { value: 'eu', label: 'EU' }
        ];

        options.forEach(opt => {
            const optDiv = document.createElement('div');
            optDiv.className = 'gh-link-o';
            optDiv.textContent = opt.label;
            optDiv.dataset.value = opt.value;
            optDiv.onclick = (e) => {
                e.stopPropagation();
                copyGhLinks(opt.value);
                dd.classList.remove('open');
            };
            dd.appendChild(optDiv);
        });

        trig.onclick = (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            dd.classList.add('open');
        };

        document.addEventListener('click', (e) => {
            if (!cont.contains(e.target)) dd.classList.remove('open');
        });

        cont.appendChild(trig);
        cont.appendChild(dd);
        return cont;
    }

    function getVisibleRowsData() {
        if (!hasArtikelColumn) return [];
        const data = [];

        Array.from(table.rows).slice(2).forEach(row => {
            if (row.style.display !== 'none' && !row.classList.contains('act-hide')) {
                const cb = row.querySelector('.row-cb');
                const isChecked = cb && cb.checked;

                const link = row.querySelector('a[href*="kalif/artikel?id="]');
                if (!link) return;

                const idMatch = link.href.match(/id=(\d+)/);
                const id = idMatch ? idMatch[1] : null;
                if (!id) return;

                let artikel = link.textContent.trim();
                artikel = artikel.replace(/\s+/g, ' ');

                data.push({ id, artikel, isChecked });
            }
        });

        return data;
    }

    function generateGhLinkContent(type) {
        const allData = getVisibleRowsData();
        const checkedData = allData.filter(d => d.isChecked);
        const data = checkedData.length > 0 ? checkedData : allData;

        if (!data.length) return null;

        const [domain, withBezeichnung] = type.includes('bezeichnung')
            ? [type.split('-')[0], true]
            : [type, false];

        const baseUrl = `https://geizhals.${domain}/`;
        let output = '';

        data.forEach((item, index) => {
            if (withBezeichnung) {
                output += item.artikel + '\n';
                output += baseUrl + item.id;
                if (index < data.length - 1) {
                    output += '\n\n';
                }
            } else {
                output += baseUrl + item.id;
                if (index < data.length - 1) {
                    output += '\n';
                }
            }
        });

        return { output, count: data.length };
    }

    function copyGhLinks(type) {
        const result = generateGhLinkContent(type);
        if (!result) {
            alert('Keine Einträge vorhanden!');
            return;
        }

        navigator.clipboard.writeText(result.output).then(() => {
            const btn = document.getElementById('gh-link-btn');
            const originalText = btn.textContent;
            btn.textContent = `✓ ${result.count} Link(s) kopiert!`;
            btn.classList.add('suc');
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('suc');
            }, 2000);
        }).catch(err => {
            alert('Fehler beim Kopieren: ' + err);
        });
    }

    // E-Mail Template Funktionen
    const DEFAULT_EMAIL_TEMPLATE_SINGULAR = `Hallo,
Guten Tag,
Sehr geehrter Herr xxx,
Sehr geehrte Frau xxx,

vielen Dank für Ihren Hinweis.
Das Produkt wurde soeben kategorisiert und wird in Kürze von unseren Produktfiltern erfasst:

{{content}}`;

    const DEFAULT_EMAIL_TEMPLATE_PLURAL = `Hallo,
Guten Tag,
Sehr geehrter Herr xxx,
Sehr geehrte Frau xxx,

vielen Dank für Ihren Hinweis.
Die Produkte wurden soeben kategorisiert und werden in Kürze von unseren Produktfiltern erfasst:

{{content}}`;

    function loadEmailTemplates() {
        try {
            const singular = localStorage.getItem('logsum_email_template_singular');
            const plural = localStorage.getItem('logsum_email_template_plural');
            return {
                singular: singular || DEFAULT_EMAIL_TEMPLATE_SINGULAR,
                plural: plural || DEFAULT_EMAIL_TEMPLATE_PLURAL
            };
        } catch (e) {
            return {
                singular: DEFAULT_EMAIL_TEMPLATE_SINGULAR,
                plural: DEFAULT_EMAIL_TEMPLATE_PLURAL
            };
        }
    }

    function saveEmailTemplates(singular, plural) {
        try {
            localStorage.setItem('logsum_email_template_singular', singular);
            localStorage.setItem('logsum_email_template_plural', plural);
            return true;
        } catch (e) {
            alert('Fehler beim Speichern der Vorlagen: ' + e);
            return false;
        }
    }

    function buildEmailDropdown() {
        const cont = document.createElement('div');
        cont.className = 'email-ms';

        const trig = document.createElement('button');
        trig.className = 'btn email-btn';
        trig.id = 'email-btn';
        trig.innerHTML = '📧 E-Mail-Text vorbereiten';

        const dd = document.createElement('div');
        dd.className = 'email-dd';

        const options = [
            { value: 'at', label: 'AT' },
            { value: 'at-bezeichnung', label: 'AT mit Bezeichnung' },
            { value: 'de', label: 'DE' },
            { value: 'de-bezeichnung', label: 'DE mit Bezeichnung' },
            { value: 'eu', label: 'EU' },
            { value: 'eu-bezeichnung', label: 'EU mit Bezeichnung' },
            { value: 'templates', label: 'Vorlagen', separator: true }
        ];

        options.forEach(opt => {
            if (opt.separator) {
                const sep = document.createElement('div');
                sep.className = 'email-separator';
                dd.appendChild(sep);
            }

            const optDiv = document.createElement('div');
            optDiv.className = opt.separator ? 'email-o email-o-special' : 'email-o';
            optDiv.textContent = opt.label;
            optDiv.dataset.value = opt.value;
            optDiv.onclick = (e) => {
                e.stopPropagation();
                if (opt.value === 'templates') {
                    showEmailTemplateOverlay();
                } else {
                    copyEmailText(opt.value);
                }
                dd.classList.remove('open');
            };
            dd.appendChild(optDiv);
        });

        trig.onclick = (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            dd.classList.add('open');
        };

        document.addEventListener('click', (e) => {
            if (!cont.contains(e.target)) dd.classList.remove('open');
        });

        cont.appendChild(trig);
        cont.appendChild(dd);
        return cont;
    }

    function copyEmailText(type) {
        const result = generateGhLinkContent(type);
        if (!result) {
            alert('Keine Einträge vorhanden!');
            return;
        }

        const templates = loadEmailTemplates();
        const template = result.count === 1 ? templates.singular : templates.plural;
        const emailText = template.replace('{{content}}', result.output);

        navigator.clipboard.writeText(emailText).then(() => {
            const btn = document.getElementById('email-btn');
            const originalText = btn.textContent;
            btn.textContent = `✓ E-Mail-Text kopiert!`;
            btn.classList.add('suc');
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('suc');
            }, 2000);
        }).catch(err => {
            alert('Fehler beim Kopieren: ' + err);
        });
    }

    function showEmailTemplateOverlay() {
        const templates = loadEmailTemplates();

        const overlay = document.createElement('div');
        overlay.className = 'email-overlay';
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };

        const modal = document.createElement('div');
        modal.className = 'email-modal';

        const header = document.createElement('div');
        header.className = 'email-modal-header';
        header.innerHTML = '<h3>E-Mail-Vorlagen bearbeiten</h3>';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'email-modal-close';
        closeBtn.textContent = '×';
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.className = 'email-modal-content';

        const singularLabel = document.createElement('label');
        singularLabel.className = 'email-label';
        singularLabel.innerHTML = '<strong>Vorlage für Einzahl (1 Artikel):</strong><br><small>Verwende {{content}} als Platzhalter für die Artikel-Links</small>';

        const singularTextarea = document.createElement('textarea');
        singularTextarea.className = 'email-textarea';
        singularTextarea.value = templates.singular;
        singularTextarea.rows = 8;

        const pluralLabel = document.createElement('label');
        pluralLabel.className = 'email-label';
        pluralLabel.innerHTML = '<strong>Vorlage für Mehrzahl (2+ Artikel):</strong><br><small>Verwende {{content}} als Platzhalter für die Artikel-Links</small>';

        const pluralTextarea = document.createElement('textarea');
        pluralTextarea.className = 'email-textarea';
        pluralTextarea.value = templates.plural;
        pluralTextarea.rows = 8;

        const buttonRow = document.createElement('div');
        buttonRow.className = 'email-modal-buttons';

        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn';
        resetBtn.textContent = 'Auf Standard zurücksetzen';
        resetBtn.onclick = () => {
            singularTextarea.value = DEFAULT_EMAIL_TEMPLATE_SINGULAR;
            pluralTextarea.value = DEFAULT_EMAIL_TEMPLATE_PLURAL;
        };

        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn';
        saveBtn.style.background = '#4CAF50';
        saveBtn.textContent = 'Speichern';
        saveBtn.onclick = () => {
            if (saveEmailTemplates(singularTextarea.value, pluralTextarea.value)) {
                saveBtn.textContent = '✓ Gespeichert!';
                setTimeout(() => overlay.remove(), 1000);
            }
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn';
        cancelBtn.textContent = 'Abbrechen';
        cancelBtn.onclick = () => overlay.remove();

        buttonRow.appendChild(resetBtn);
        buttonRow.appendChild(cancelBtn);
        buttonRow.appendChild(saveBtn);

        content.appendChild(singularLabel);
        content.appendChild(singularTextarea);
        content.appendChild(document.createElement('br'));
        content.appendChild(pluralLabel);
        content.appendChild(pluralTextarea);

        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(buttonRow);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    function toggleChart() {
        const chartContainer = document.getElementById('chart-container');
        const chartBtn = document.getElementById('chart-btn');
        const chartHint = document.querySelector('.chart-hint');
        if (!chartContainer || !chartBtn) return;
        chartVisible = !chartVisible;
        if (chartVisible) {
            chartContainer.style.display = 'block';
            chartBtn.classList.add('act');
            if (chartHint) chartHint.style.display = 'inline';
            if (!chartInstance) renderChart();
            setTimeout(adjustStickyPositions, 100);
        } else {
            chartContainer.style.display = 'none';
            chartBtn.classList.remove('act');
            if (chartHint) chartHint.style.display = 'none';
            setTimeout(adjustStickyPositions, 100);
        }
    }

    function parseTimestamp(timeStr) {
        const match = timeStr.match(/(\d{2})\.(\d{2})\.(\d{4}),\s+(\d{2}):(\d{2})/);
        if (!match) return null;
        const [, day, month, year, hour, minute] = match;
        return new Date(year, month - 1, day, hour, minute);
    }

    function getEventData() {
        const zeitColIndex = findColumnIndex('Zeit (Wer)');
        const actionColIndex = findColumnIndex('Action');
        if (zeitColIndex === -1 || actionColIndex === -1) return null;
        const urlParams = new URLSearchParams(window.location.search);
        const daysParam = parseFloat(urlParams.get('days'));
        if (!daysParam) return null;
        const now = new Date();
        const startTime = new Date(now - daysParam * 24 * 60 * 60 * 1000);
        const events = [];
        const eventCounts = new Map();
        Array.from(table.rows).slice(2).forEach(row => {
            if (row.style.display === 'none' || row.classList.contains('act-hide')) return;
            const zeitCell = row.children[zeitColIndex];
            const actionCell = row.children[actionColIndex];
            if (!zeitCell || !actionCell) return;
            const timestamp = parseTimestamp(zeitCell.textContent.trim());
            if (!timestamp) return;
            const eventType = categorizeAction(actionCell.dataset.origText || actionCell.textContent.trim());
            if (!eventType) return;
            events.push({ timestamp, eventType });
            eventCounts.set(eventType, (eventCounts.get(eventType) || 0) + 1);
        });
        events.sort((a, b) => a.timestamp - b.timestamp);
        return { events, eventCounts, startTime, endTime: now };
    }

    function renderChart() {
        const data = getEventData();
        if (!data) return;
        const { events, eventCounts, startTime, endTime } = data;
        const urlParams = new URLSearchParams(window.location.search);
        const hasWhatParam = urlParams.has('what');
        const daysParam = parseFloat(urlParams.get('days'));
        const intervalMs = daysParam <= 1 ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const labels = [];
        const timePoints = [];
        let currentTime = new Date(startTime);
        const weekdayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

        while (currentTime <= endTime) {
            timePoints.push(new Date(currentTime));
            if (daysParam <= 1) {
                const dateStr = currentTime.toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                labels.push(dateStr);
            } else {
                const dateStr = currentTime.toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit'
                });
                const weekday = weekdayNames[currentTime.getDay()];
                labels.push([dateStr, weekday]);
            }
            currentTime = new Date(currentTime.getTime() + intervalMs);
        }

        const totalCounts = new Array(timePoints.length).fill(0);
        const eventTypeCounts = new Map();

        if (!hasWhatParam) {
            eventCounts.forEach((count, eventType) => {
                eventTypeCounts.set(eventType, new Array(timePoints.length).fill(0));
            });
        }

        events.forEach(({ timestamp, eventType }) => {
            const index = timePoints.findIndex((t, i) => {
                const nextTime = timePoints[i + 1] || endTime;
                return timestamp >= t && timestamp < nextTime;
            });
            if (index !== -1) {
                totalCounts[index]++;
                if (!hasWhatParam && eventTypeCounts.has(eventType)) {
                    eventTypeCounts.get(eventType)[index]++;
                }
            }
        });

        const datasets = [{
            label: 'Gesamt',
            data: totalCounts.slice(),
            borderColor: '#333',
            backgroundColor: 'rgba(51, 51, 51, 0.1)',
            borderWidth: 3,
            tension: 0.1,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#333',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        }];

        if (!hasWhatParam) {
            let colorIndex = 0;
            eventTypeCounts.forEach((counts, eventType) => {
                const color = EVENT_COLORS[colorIndex % EVENT_COLORS.length];
                datasets.push({
                    label: eventType,
                    data: counts.slice(),
                    borderColor: color,
                    backgroundColor: color + '20',
                    borderWidth: 2,
                    tension: 0.1,
                    hidden: false,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: color,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                });
                colorIndex++;
            });
        }

        originalChartData = {
            labels: labels.slice(),
            datasets: datasets.map(ds => ({
                label: ds.label,
                data: ds.data.slice()
            }))
        };

        const chartDatasets = datasets.map((ds, dsIndex) => {
            const newDataset = { ...ds };

            if (hiddenDataPoints.has(dsIndex)) {
                const hiddenSet = hiddenDataPoints.get(dsIndex);
                newDataset.data = ds.data.map((value, idx) =>
                    hiddenSet.has(idx) ? null : value
                );
            } else {
                newDataset.data = ds.data.slice();
            }

            return newDataset;
        });

        const canvas = document.getElementById('event-chart');
        const ctx = canvas.getContext('2d');
        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: chartDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 3,
                spanGaps: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'point',
                        intersect: true,
                        filter: function(tooltipItem) {
                            return tooltipItem.raw !== null;
                        },
                        callbacks: {
                            afterLabel: function(context) {
                                const dsIndex = context.datasetIndex;
                                const labelIndex = context.dataIndex;
                                if (hiddenDataPoints.has(dsIndex) && hiddenDataPoints.get(dsIndex).has(labelIndex)) {
                                    return '(Ausgeblendet - Klick zum Einblenden)';
                                }
                                return '(Klick zum Ausblenden)';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                },
                onClick: handleChartClick
            }
        });

        if (chartDatasets.length > 1) renderChartLegend(chartDatasets);
    }

    function rebuildChart() {
        if (!originalChartData || !chartInstance) return;

        chartInstance.data.labels = [...originalChartData.labels];

        chartInstance.data.datasets.forEach((dataset, dsIndex) => {
            const originalData = originalChartData.datasets[dsIndex].data;
            const hiddenSet = hiddenDataPoints.get(dsIndex) || new Set();

            dataset.data = originalData.map((value, labelIndex) => {
                return hiddenSet.has(labelIndex) ? null : value;
            });
        });

        chartInstance.update('none');
    }

    function handleChartClick(event, elements) {
        if (!chartInstance || !originalChartData) return;

        if (elements && elements.length > 0) {
            const element = elements[0];
            const datasetIndex = element.datasetIndex;
            const labelIndex = element.index;
            toggleDataPoint(datasetIndex, labelIndex);
        }
    }

    function toggleDataPoint(datasetIndex, labelIndex) {
        if (!originalChartData) return;

        if (!hiddenDataPoints.has(datasetIndex)) {
            hiddenDataPoints.set(datasetIndex, new Set());
        }

        const hiddenSet = hiddenDataPoints.get(datasetIndex);

        if (hiddenSet.has(labelIndex)) {
            hiddenSet.delete(labelIndex);
        } else {
            hiddenSet.add(labelIndex);
        }

        rebuildChart();
    }

    function renderChartLegend(datasets) {
        const legendContainer = document.getElementById('chart-legend');
        if (!legendContainer) return;
        legendContainer.innerHTML = '<div class="chart-legend-title">Graphen:</div>';
        datasets.forEach((dataset, index) => {
            const label = document.createElement('label');
            label.className = 'chart-legend-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = !dataset.hidden;
            checkbox.onchange = () => {
                const meta = chartInstance.getDatasetMeta(index);
                meta.hidden = !checkbox.checked;
                chartInstance.update();
            };
            const colorBox = document.createElement('span');
            colorBox.className = 'chart-legend-color';
            colorBox.style.backgroundColor = dataset.borderColor;
            const text = document.createElement('span');
            text.textContent = dataset.label;
            label.appendChild(checkbox);
            label.appendChild(colorBox);
            label.appendChild(text);
            legendContainer.appendChild(label);
        });
    }

    function updateViewMode() {
        const actionFlt = document.querySelector('.action-flt');
        const diffWrap = document.querySelector('.diff-check-wrap');
        if (viewMode === 'text') {
            document.body.classList.add('show-text');
            document.body.classList.remove('show-table');
            if (actionFlt) actionFlt.disabled = false;
            if (diffWrap) diffWrap.classList.add('disabled');
        } else {
            document.body.classList.add('show-table');
            document.body.classList.remove('show-text');
            if (actionFlt) {
                actionFlt.disabled = true;
                actionFlt.value = '';
                filterTable();
            }
            if (diffWrap) diffWrap.classList.remove('disabled');
            managedTables.forEach(t => applyDiff(t, diffState));
        }
    }

    function categorizeAction(txt) {
        if (txt.startsWith('VALUE-EDIT Changes:')) return 'VALUE-EDIT';
        if (txt.startsWith('MASS-VALUE-EDIT Changes:')) return 'MASS-VALUE-EDIT';
        if (txt.startsWith('PREISLIMIT ')) return 'PREISLIMIT';
        if (txt.startsWith('Changes:')) return 'EDIT';
        for (const eventType of EVENT_ORDER) {
            if (txt.startsWith(eventType)) return eventType;
        }
        const match = txt.match(/^([A-Z][A-Z0-9\-_\s:]*)/);
        if (match) {
            const unknownEvent = match[1].trim();
            if (!EVENT_ORDER.includes(unknownEvent)) {
                alert(`Logsum-Userscript: Event "${unknownEvent}" nicht definiert, bitte martink bescheid geben.`);
            }
        }
        return null;
    }

    function buildEvtMS() {
        const evts = new Map();
        const actionColIndex = findColumnIndex('Action');
        if (actionColIndex === -1) return document.createElement('div');
        Array.from(table.rows).slice(2).forEach(row => {
            const act = row.children[actionColIndex];
            if (!act) return;
            const cat = categorizeAction(act.textContent.trim());
            if (cat) evts.set(cat, (evts.get(cat)||0)+1);
        });
        const cont = document.createElement('div');
        cont.className = 'evt-ms';
        const trig = document.createElement('div');
        trig.className = 'evt-t';
        const dd = document.createElement('div');
        dd.className = 'evt-dd';
        const hdr = document.createElement('div');
        hdr.className = 'evt-h';
        const tog = document.createElement('button');
        tog.className = 'evt-tog';
        const upd = () => {
            trig.innerHTML = `<span>Action (${selectedEvents.size}/${evts.size})</span><span>▼</span>`;
            tog.textContent = selectedEvents.size ? 'Alle abwählen' : 'Alle anwählen';
            tog.className = selectedEvents.size ? 'evt-tog' : 'evt-tog all';
        };
        tog.onclick = (e) => {
            e.stopPropagation();
            if (selectedEvents.size) {
                selectedEvents.clear();
                dd.querySelectorAll('input').forEach(cb => cb.checked = false);
            } else {
                evts.forEach((_, k) => selectedEvents.add(k));
                dd.querySelectorAll('input').forEach(cb => cb.checked = evts.has(cb.value));
            }
            upd();
            applyActFilter();
        };
        hdr.appendChild(tog);
        dd.appendChild(hdr);
        EVENT_ORDER.forEach(e => {
            const cnt = evts.get(e);
            if (!cnt) return;
            const opt = document.createElement('label');
            opt.className = 'evt-o';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = e;
            cb.checked = true;
            selectedEvents.add(e);
            cb.onchange = () => {
                cb.checked ? selectedEvents.add(e) : selectedEvents.delete(e);
                upd();
                applyActFilter();
            };
            opt.appendChild(cb);
            opt.appendChild(document.createTextNode(`${e} (${cnt})`));
            dd.appendChild(opt);
        });
        trig.onclick = () => dd.classList.toggle('open');
        document.addEventListener('click', (e) => {
            if (!cont.contains(e.target)) dd.classList.remove('open');
        });
        cont.appendChild(trig);
        cont.appendChild(dd);
        upd();
        return cont;
    }

    function findColumnIndex(columnName) {
        const headerRow = table.rows[0];
        if (!headerRow) return -1;
        for (let i = 0; i < headerRow.cells.length; i++) {
            if (headerRow.cells[i].textContent.trim() === columnName) return i;
        }
        return -1;
    }

    function initEvents() {
        const evts = new Set();
        const actionColIndex = findColumnIndex('Action');
        if (actionColIndex === -1) return;
        Array.from(table.rows).slice(2).forEach(row => {
            const act = row.children[actionColIndex];
            if (!act) return;
            const cat = categorizeAction(act.textContent.trim());
            if (cat) evts.add(cat);
        });
        evts.forEach(e => selectedEvents.add(e));
    }

    function applyActFilter() {
        const actionColIndex = findColumnIndex('Action');
        if (actionColIndex === -1) return;
        Array.from(table.rows).slice(2).forEach(row => {
            const act = row.children[actionColIndex];
            if (!act) return;
            const cat = categorizeAction(act.textContent.trim());
            const match = selectedEvents.size > 0 && cat && selectedEvents.has(cat);
            row.classList.toggle('act-hide', !match);
        });
        if (hasArtikelColumn) updateButtons();
        updateHeaderCount();
    }

    function getVisibleIds() {
        if (!hasArtikelColumn) return [];
        const chk = [], all = [];

        Array.from(table.rows).slice(2).forEach(row => {
            if (row.style.display !== 'none' && !row.classList.contains('act-hide')) {
                const link = row.querySelector('a[href*="kalif/artikel?id="]');
                if (link) {
                    const idMatch = link.href.match(/id=(\d+)/);
                    if (idMatch) {
                        const id = idMatch[1];
                        all.push(id);
                        const cb = row.querySelector('.row-cb');
                        if (cb?.checked) chk.push(id);
                    }
                }
            }
        });
        return chk.length ? chk : all;
    }

    function updateButtons() {
        const checkedCount = document.querySelectorAll('.row-cb:checked').length;
        const hasChecked = checkedCount > 0;

        const exp = document.getElementById('exp-btn');
        const ers = document.getElementById('ers-btn');
        const massimg = document.getElementById('massimg-btn');
        const such = document.getElementById('such-btn');
        const ghLink = document.getElementById('gh-link-btn');
        const cmp = document.getElementById('cmp-btn');
        const email = document.getElementById('email-btn');

        const displayCount = hasChecked ? ` (${checkedCount})` : '';

        if (exp) {
            exp.textContent = `📋 ID(s) kopieren${displayCount}`;
            exp.classList.toggle('act', hasChecked);
        }
        if (ers) {
            ers.textContent = `🔗 Artikel-Ersetzer${displayCount}`;
            ers.classList.toggle('act', hasChecked);
        }
        if (massimg) {
            massimg.textContent = `🖼️ mass-image${displayCount}`;
            massimg.classList.toggle('act', hasChecked);
        }
        if (such) {
            such.textContent = `🔎 such.pl${displayCount}`;
            such.classList.toggle('act', hasChecked);
        }
        if (ghLink) {
            ghLink.textContent = `📋 GH-Link(s) kopieren${displayCount}`;
            ghLink.classList.toggle('act', hasChecked);
        }
        if (cmp) {
            cmp.textContent = `🔄 Vergleichen${displayCount}`;
            cmp.classList.toggle('act', hasChecked);
        }
        if (email) {
            email.textContent = `📧 E-Mail-Text vorbereiten${displayCount}`;
            email.classList.toggle('act', hasChecked);
        }
    }

    function exportIds() {
        const ids = getVisibleIds();
        if (!ids.length) return alert('Keine IDs!');
        navigator.clipboard.writeText(ids.join('\r\n')).then(() => {
            const b = document.getElementById('exp-btn');
            const t = b.textContent;
            b.textContent = `✓ ${ids.length} IDs kopiert!`;
            b.classList.add('suc');
            setTimeout(() => { b.textContent = t; b.classList.remove('suc'); }, 2000);
        });
    }

    function openErsetzer() {
        const ids = getVisibleIds();
        if (!ids.length) return alert('Keine IDs!');
        window.open('https://opus.geizhals.at/kalif/artikel/ersetzer#' + ids.join(','), '_blank');
    }

    function openMassimg() {
        const ids = getVisibleIds();
        if (!ids.length) return alert('Keine IDs!');
        const params = ids.map(id => `artikel=${id}`).join('&');
        window.open(`https://opus.geizhals.at/kalif/artikel/mass-image?${params}`, '_blank');
    }

    function openSuch() {
        const ids = getVisibleIds();
        if (!ids.length) return alert('Keine IDs!');
        const idsParam = ids.join(',');
        window.open(`https://opus.geizhals.at/pv-edit/such.pl?&syntax=a.id=${idsParam}`, '_blank');
    }

    const MAX_ITEMS_COMPARE = 12;

    function buildCompareDropdown() {
        const cont = document.createElement('div');
        cont.className = 'compare-ms';

        const trig = document.createElement('button');
        trig.className = 'btn cmp-btn';
        trig.id = 'cmp-btn';
        trig.innerHTML = '🔄 Vergleichen';

        const dd = document.createElement('div');
        dd.className = 'compare-dd';

        const options = [
            { value: 'pv', label: 'Vergleichen PV' },
            { value: 'kalif', label: 'Vergleichen Kalif' }
        ];

        options.forEach(opt => {
            const optDiv = document.createElement('div');
            optDiv.className = 'compare-o';
            optDiv.textContent = opt.label;
            optDiv.dataset.value = opt.value;
            optDiv.onclick = (e) => {
                e.stopPropagation();
                runCompare(opt.value);
                dd.classList.remove('open');
            };
            dd.appendChild(optDiv);
        });

        trig.onclick = (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            dd.classList.add('open');
        };

        document.addEventListener('click', (e) => {
            if (!cont.contains(e.target)) dd.classList.remove('open');
        });

        cont.appendChild(trig);
        cont.appendChild(dd);
        return cont;
    }

    function runCompare(mode) {
        const ids = getVisibleIds();
        if (!ids.length) {
            alert('Keine IDs!');
            return;
        }
        if (ids.length < 2) {
            alert('Mindestens 2 Artikel erforderlich');
            return;
        }
        if (ids.length > MAX_ITEMS_COMPARE) {
            alert(`Es können maximal ${MAX_ITEMS_COMPARE} Artikel verglichen werden.`);
            return;
        }

        if (mode === 'pv') {
            window.open(createCompareUrl(ids), '_blank');
        } else if (mode === 'kalif') {
            window.open(createKalifUrl(ids), '_blank');
        }

        flashSuccessCompare();
    }

    function createCompareUrl(ids) {
        const base = 'https://geizhals.de/?';
        const params = ids.map(id => `cmp=${id}`).join('&');
        return `${base}${params}&active=1`;
    }

    function createKalifUrl(ids) {
        const base = 'https://opus.geizhals.at/kalif/artikel/diff#';
        const params = ids.map(id => `id=${id}`).join('&');
        const primary = ids[0];
        return `${base}${params}&primary=${primary}`;
    }

    function flashSuccessCompare() {
        const btn = document.getElementById('cmp-btn');
        if (!btn) return;
        const oldText = btn.textContent;
        btn.textContent = '✓ Vergleichen geöffnet!';
        btn.classList.add('suc');
        setTimeout(() => {
            btn.textContent = oldText;
            btn.classList.remove('suc');
        }, 2000);
    }

    function parseNr(v) {
        const tok = v.trim().split(/\s+/), inc = new Set(), exc = new Set();
        tok.forEach(t => {
            if (t.startsWith('-') && t.length > 1) {
                const n = parseInt(t.slice(1));
                if (!isNaN(n)) exc.add(n);
            } else if (t.includes('-')) {
                const [a,b] = t.split('-').map(x => parseInt(x));
                if (!isNaN(a) && !isNaN(b)) for (let i = a; i <= b; i++) inc.add(i);
            } else {
                const n = parseInt(t);
                if (!isNaN(n)) inc.add(n);
            }
        });
        return {inc, exc};
    }

    function highlightText(element, searchText) {
        if (!searchText || !highlightEnabled) return;
        const lowerSearch = searchText.toLowerCase();
        function highlightTextNode(textNode) {
            const text = textNode.textContent;
            const lowerText = text.toLowerCase();
            if (!lowerText.includes(lowerSearch)) return;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let index = lowerText.indexOf(lowerSearch);
            while (index !== -1) {
                if (index > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
                }
                const mark = document.createElement('mark');
                mark.className = 'search-highlight';
                mark.textContent = text.substring(index, index + searchText.length);
                fragment.appendChild(mark);
                lastIndex = index + searchText.length;
                index = lowerText.indexOf(lowerSearch, lastIndex);
            }
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
            }
            textNode.parentNode.replaceChild(fragment, textNode);
        }
        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                highlightTextNode(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'MARK') return;
                const children = Array.from(node.childNodes);
                children.forEach(child => processNode(child));
            }
        }
        processNode(element);
    }

    function removeHighlights(element) {
        const marks = element.querySelectorAll('mark.search-highlight');
        marks.forEach(mark => {
            const parent = mark.parentNode;
            if (parent) {
                const text = document.createTextNode(mark.textContent);
                parent.replaceChild(text, mark);
                parent.normalize();
            }
        });
    }

    function filterTable() {
        const flts = Array.from(document.querySelectorAll('.col-flt')).map(i => ({
            idx: parseInt(i.dataset.idx),
            val: i.value.trim(),
            isNrFilter: i.dataset.isNrFilter === 'true'
        }));
        const nrColIndex = findColumnIndex('Nr');
        const actionColIndex = findColumnIndex('Action');
        Array.from(table.rows).slice(2).forEach(row => {
            let show = true;
            Array.from(row.children).forEach((cell, idx) => {
                if (idx > 0 && idx < (hasActionColumn ? 6 : 5)) {
                    removeHighlights(cell);
                }
            });
            flts.forEach(f => {
                if (!f.val) return;
                const cell = row.children[f.idx];
                if (!cell) return;
                if (f.isNrFilter) {
                    const {inc, exc} = parseNr(f.val);
                    const n = parseInt(row.dataset.origNr);
                    if (isNaN(n)) { show = false; return; }
                    const inInc = inc.size === 0 || inc.has(n);
                    const inExc = exc.has(n);
                    if (!inInc || inExc) show = false;
                } else if (f.idx === actionColIndex) {
                    const origText = cell.dataset.origText || cell.textContent;
                    if (!origText.toLowerCase().includes(f.val.toLowerCase())) {
                        show = false;
                    } else if (highlightEnabled) {
                        highlightText(cell, f.val);
                    }
                } else {
                    if (!cell.textContent.toLowerCase().includes(f.val.toLowerCase())) {
                        show = false;
                    } else if (highlightEnabled) {
                        highlightText(cell, f.val);
                    }
                }
            });
            row.style.display = show ? '' : 'none';
            if (!show && hasArtikelColumn) {
                const cb = row.querySelector('.row-cb');
                if (cb) cb.checked = false;
            }
        });
        if (nrColIndex !== -1) {
            Array.from(table.rows).slice(2).forEach(row => {
                const nr = row.children[nrColIndex];
                if (nr && row.dataset.origNr) nr.textContent = row.dataset.origNr;
            });
        }
        if (hasArtikelColumn) updateButtons();
        updateHeaderCount();
    }

    function makeLinkClickable(text, pattern, urlTemplate) {
        const regex = new RegExp(pattern, 'g');
        return text.replace(regex, (match, id) => {
            const url = urlTemplate.replace('{id}', id);
            return match.replace(id, `<a href="${url}" target="_blank">${id}</a>`);
        });
    }

    function processActions() {
        const actionColIndex = findColumnIndex('Action');
        if (actionColIndex === -1) return;
        Array.from(table.rows).slice(2).forEach(row => {
            const cell = row.children[actionColIndex];
            if (!cell || cell.dataset.p) return;
            let txt = cell.textContent.trim();
            cell.dataset.origText = txt;
            txt = makeLinkClickable(txt, /LINK-VARIANT id:\s*(\d+)/, 'https://opus.geizhals.at/kalif/variantdb#variant_id/{id}');
            txt = makeLinkClickable(txt, /LINK Linked\s*=>\s*(\d+)/, 'https://opus.geizhals.at/kalif/artikel/link#id={id}');
            if (/^\s*EDIT\s+\[/.test(txt) && !/^Changes:/i.test(txt)) {
                if (processEdit(cell, txt)) return;
            }
            if (txt.includes('Changes:')) {
                processChg(cell, txt);
            } else if (txt.startsWith('PREISLIMIT ')) {
                processPreis(cell, txt);
            } else {
                cell.innerHTML = txt;
            }
        });
    }

    function extractSegs(s) {
        const r = []; let i = 0, d = 0, st = -1;
        while (i < s.length) {
            if (s[i] === '[') { if (!d) st = i+1; d++; }
            else if (s[i] === ']') { d--; if (!d && st >= 0) { r.push(s.slice(st, i)); st = -1; } }
            i++;
        }
        return r;
    }

    function parseSeg(s) {
        const ar = '==>', idx = s.indexOf(ar);
        if (idx === -1) return {f: s.replace(/:$/,'').trim()||'?', o: 'NIX', n: ''};
        const l = s.slice(0, idx).trimEnd(), r = s.slice(idx + ar.length).trim();
        let f = '', o = '';
        for (const m of MAIN_FIELDS) {
            if (new RegExp(`^${m}(?:\\s+|:|$)`, 'i').test(l)) {
                f = m;
                o = l.slice(m.length).replace(/^[\s:]+/, '').trim();
                break;
            }
        }
        if (!f) {
            const km = /^([a-z0-9_]+)\s*(.*)$/i.exec(l);
            f = km ? km[1].replace(/:$/,'').trim() : l.replace(/:$/,'').trim()||'?';
            o = km ? km[2].replace(/^:\s*/,'').trim() : '';
        }
        return {f, o: o||'NIX', n: r};
    }

    function buildTbl(ch) {
        const t = document.createElement('table');
        t.className = 'ch-t';
        const tb = document.createElement('tbody');
        ch.forEach(({f, o, n}) => {
            const tr = document.createElement('tr');
            [f, o, n].forEach((v, i) => {
                const td = document.createElement('td');
                td.innerHTML = v;
                if (i > 0) td.dataset.o = v;
                tr.appendChild(td);
            });
            tb.appendChild(tr);
        });
        t.appendChild(tb);
        return t;
    }

    function processEdit(c, txtWithLinks) {
        const t = txtWithLinks || c.textContent.trim();
        const eventMatch = t.match(/^([A-Z\-]+)\s+\[/);
        if (!eventMatch) return false;
        const eventName = eventMatch[1];
        const content = t.slice(eventName.length).trim();
        const segs = extractSegs(content);
        if (!segs.length) return false;
        const tbl = buildTbl(segs.map(parseSeg));
        const w = document.createElement('div');
        w.className = 'ch-w';
        const p = document.createElement('pre');
        p.className = 'orig';
        p.innerHTML = t;
        w.append(p, tbl);
        c.innerHTML = '';
        c.appendChild(w);
        managedTables.add(tbl);
        if (diffState) applyDiff(tbl, true);
        c.dataset.p = '1';
        return true;
    }

    function processChg(c, txtWithLinks) {
        const t = txtWithLinks || c.textContent.trim();
        const ci = t.indexOf('Changes:');
        if (ci === -1) return false;
        const segs = extractSegs(t.slice(ci + 8));
        if (!segs.length) return false;
        const tbl = buildTbl(segs.map(parseSeg));
        const w = document.createElement('div');
        w.className = 'ch-w';
        const p = document.createElement('pre');
        p.className = 'orig';
        p.innerHTML = t;
        w.append(p, tbl);
        c.innerHTML = '';
        c.appendChild(w);
        managedTables.add(tbl);
        if (diffState) applyDiff(tbl, true);
        c.dataset.p = '1';
        return true;
    }

    function processPreis(c, txtWithLinks) {
        const t = txtWithLinks || c.textContent.trim();
        if (!t.startsWith('PREISLIMIT ')) return false;
        const content = t.replace('PREISLIMIT', '').trim();
        if (!/==>/.test(content)) return false;
        const pts = content.split('==>');
        if (pts.length !== 2) return false;
        const tbl = buildTbl([{f: 'PREISLIMIT', o: pts[0].trim(), n: pts[1].trim()}]);
        const w = document.createElement('div');
        w.className = 'ch-w';
        const p = document.createElement('pre');
        p.className = 'orig';
        p.innerHTML = t;
        w.append(p, tbl);
        c.innerHTML = '';
        c.appendChild(w);
        managedTables.add(tbl);
        if (diffState) applyDiff(tbl, true);
        c.dataset.p = '1';
        return true;
    }

    function chooseSep(a, b) {
        const c = (s, ch) => s ? (s.match(new RegExp(`\\${ch}`, 'g'))||[]).length : 0;
        const ap = c(a,'|'), ac = c(a,','), bp = c(b,'|'), bc = c(b,',');
        if (ap + bp >= ac + bc && ap + bp > 0) return '|';
        if (ac + bc > 0) return ',';
        return null;
    }

    function tok(s, sep) {
        if (!s) return [];
        if (sep === '|' || sep === ',') return s.split(sep).map(t => t.trim()).filter(Boolean);
        return s.trim().split(/\s+/).filter(Boolean);
    }

    function renderTok(toks, j, cls) {
        const f = document.createDocumentFragment();
        toks.forEach((t, i) => {
            const sp = document.createElement('span');
            const c = cls(t);
            if (c) sp.className = c;
            sp.textContent = t;
            f.appendChild(sp);
            if (i < toks.length - 1) f.appendChild(document.createTextNode(j));
        });
        return f;
    }

    function applyDiff(t, on) {
        const tb = t.tBodies?.[0];
        if (!tb) return;
        Array.from(tb.rows).forEach(tr => {
            const [_, o, n] = Array.from(tr.children);
            if (!o || !n) return;
            const ot = o.dataset.o ?? o.textContent ?? '';
            const nt = n.dataset.o ?? n.textContent ?? '';
            if (!on) { o.innerHTML = ot; n.innerHTML = nt; return; }
            const sep = chooseSep(ot, nt);
            const j = sep === '|' ? ' | ' : sep === ',' ? ', ' : ' ';
            if (ot.trim() !== 'NIX') {
                const otok = tok(ot, sep), ntok = tok(nt, sep), nset = new Set(ntok);
                o.innerHTML = '';
                o.appendChild(renderTok(otok, j, t => !nset.has(t) ? 'rm' : ''));
            } else { o.innerHTML = ot; }
            if (nt.trim() !== 'NIX') {
                const otok = tok(ot, sep), ntok = tok(nt, sep), oset = new Set(otok);
                n.innerHTML = '';
                n.appendChild(renderTok(ntok, j, t => !oset.has(t) ? 'ad' : ''));
            } else { n.innerHTML = nt; }
        });
    }

    function updateRowHoverState() {
        if (rowHoverEnabled) {
            document.body.classList.add('row-hover-enabled');
        } else {
            document.body.classList.remove('row-hover-enabled');
        }
    }

    function processLinks() {
        if (!hasArtikelColumn) return;
        Array.from(table.rows).slice(2).forEach(row => {
            const link = row.querySelector('a[href*="kalif/artikel?id="]');
            if (!link) return;

            const idMatch = link.href.match(/id=(\d+)/);
            const id = idMatch ? idMatch[1] : null;
            if (!id) return;

            const cells = Array.from(row.children);
            const startIndex = hasActionColumn ? 6 : 5;
            const linkCells = cells.slice(startIndex);
            linkCells.forEach(cell => {
                const text = cell.textContent.trim();
                if (text === 'GH' || text === 'SF' || text === 'CF' || text === 'CE') {
                    cell.remove();
                }
            });
            const remainingCells = Array.from(row.children).slice(startIndex);
            const mrCell = remainingCells.find(cell => {
                const linkEl = cell.querySelector('a');
                return linkEl && linkEl.textContent.trim() === 'MR';
            });
            if (mrCell) {
                const atCell = document.createElement('td');
                const atLink = document.createElement('a');
                atLink.href = `https://geizhals.at/${id}`;
                atLink.textContent = 'AT';
                atLink.target = '_blank';
                atCell.appendChild(atLink);
                const deCell = document.createElement('td');
                const deLink = document.createElement('a');
                deLink.href = `https://geizhals.de/${id}`;
                deLink.textContent = 'DE';
                deLink.target = '_blank';
                deCell.appendChild(deLink);
                const euCell = document.createElement('td');
                const euLink = document.createElement('a');
                euLink.href = `https://geizhals.eu/${id}`;
                euLink.textContent = 'EU';
                euLink.target = '_blank';
                euCell.appendChild(euLink);
                mrCell.after(atCell);
                atCell.after(deCell);
                deCell.after(euCell);
            }
        });
    }

    function addStyles() {
        const s = document.createElement('style');
        s.textContent = `
table[border="1"] tr.sticky-header{position:sticky;top:0;z-index:52;background:#fff}
table[border="1"] tr.sticky-header th{background:#fff;border-bottom:2px solid #ddd;cursor:pointer;user-select:none;transition:background .2s}
table[border="1"] tr.sticky-header th:hover{background:#f5f5f5}
.f-row{background:#f0f0f0;position:sticky;z-index:51}.f-row th{background:#f0f0f0}
.col-flt{width:90%;padding:4px 8px;border:1px solid #ccc;border-radius:3px;font-size:12px;background:#fff}.col-flt.wide{width:90%;min-width:80px}.col-flt:focus{outline:0;border-color:#4CAF50;box-shadow:0 0 3px rgba(76,175,80,.5)}.col-flt:disabled{background:#e9ecef;cursor:not-allowed;opacity:.6}body.row-hover-enabled table tr:hover:not(.f-row){background:#f5f5f5}
.toolbar{display:flex;align-items:center;gap:12px;margin:8px 0 6px;position:sticky;top:0;z-index:100;background:#fff;padding:8px 0;border-bottom:1px solid #ddd;flex-wrap:wrap}.tbar-l{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.btn{padding:8px 16px;background:#757575;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:14px;font-weight:700;transition:background .3s}.btn:hover{background:#616161}.btn.act{background:#2196F3}.btn.act:hover{background:#1976D2}.btn.suc{background:#4CAF50!important}
.gear-btn{padding:8px 12px;font-size:16px;background:#616161}.gear-btn:hover{background:#4a4a4a}
.master-cb,.row-cb{cursor:pointer;width:16px;height:16px}
.time-range-select{margin-left:8px;padding:4px 8px;font-size:13px;border:1px solid #ccc;border-radius:3px;cursor:pointer;background:#fff}.time-range-select:hover{border-color:#4CAF50}.time-range-select:focus{outline:0;border-color:#4CAF50;box-shadow:0 0 3px rgba(76,175,80,.5)}
.date-picker-input{padding:4px 8px;font-size:13px;border:1px solid #ccc;border-radius:3px;cursor:pointer;background:#fff;font-family:inherit}.date-picker-input:hover{border-color:#4CAF50}.date-picker-input:focus{outline:0;border-color:#4CAF50;box-shadow:0 0 3px rgba(76,175,80,.5)}
.evt-ms{position:relative;display:inline-block}.evt-t{padding:4px 8px;font:13px/1.35 system-ui;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;min-width:180px;display:flex;justify-content:space-between;align-items:center;gap:8px}.evt-t:hover{background:#f5f5f5}.evt-dd{position:absolute;top:100%;left:0;margin-top:2px;background:#fff;border:1px solid #ccc;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.15);min-width:220px;display:none;z-index:1000}.evt-dd.open{display:block}.evt-h{padding:8px 10px;border-bottom:1px solid #e0e0e0;display:flex;justify-content:flex-end}.evt-tog{padding:2px 8px;font-size:11px;background:#f44336;color:#fff;border:0;border-radius:3px;cursor:pointer}.evt-tog:hover{background:#d32f2f}.evt-tog.all{background:#4caf50}.evt-tog.all:hover{background:#45a049}.evt-o{padding:6px 10px;display:flex;align-items:center;gap:8px;cursor:pointer;font:13px/1.35 system-ui}.evt-o:hover{background:#f5f5f5}.evt-o input{margin:0;cursor:pointer}
.gh-link-ms{position:relative;display:inline-block}.gh-link-dd{position:absolute;top:100%;left:0;margin-top:2px;background:#fff;border:1px solid #ccc;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.15);min-width:200px;display:none;z-index:1000}.gh-link-dd.open{display:block}.gh-link-o{padding:8px 12px;cursor:pointer;font:13px/1.35 system-ui;transition:background .2s}.gh-link-o:hover{background:#f5f5f5}.gh-link-o:active{background:#e0e0e0}
.email-ms{position:relative;display:inline-block}.email-dd{position:absolute;top:100%;left:0;margin-top:2px;background:#fff;border:1px solid #ccc;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.15);min-width:200px;display:none;z-index:1000}.email-dd.open{display:block}.email-o{padding:8px 12px;cursor:pointer;font:13px/1.35 system-ui;transition:background .2s}.email-o:hover{background:#f5f5f5}.email-o:active{background:#e0e0e0}.email-o-special{font-weight:700;color:#2196F3}.email-separator{height:1px;background:#e0e0e0;margin:4px 0}
.compare-ms{position:relative;display:inline-block}.compare-dd{position:absolute;top:100%;left:0;margin-top:2px;background:#fff;border:1px solid #ccc;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.15);min-width:200px;display:none;z-index:1000}.compare-dd.open{display:block}.compare-o{padding:8px 12px;cursor:pointer;font:13px/1.35 system-ui;transition:background .2s}.compare-o:hover{background:#f5f5f5}.compare-o:active{background:#e0e0e0}
.email-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:10000}
.email-modal{background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.3);width:90%;max-width:700px;max-height:90vh;overflow:auto}
.email-modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #e0e0e0}.email-modal-header h3{margin:0;font-size:18px}
.email-modal-close{background:none;border:none;font-size:28px;cursor:pointer;color:#666;padding:0;width:30px;height:30px;line-height:1;transition:color .2s}.email-modal-close:hover{color:#333}
.email-modal-content{padding:20px}
.email-label{display:block;margin-bottom:8px;color:#333}.email-label small{color:#666;font-weight:400}
.email-textarea{width:100%;padding:10px;border:1px solid #ccc;border-radius:4px;font-family:monospace;font-size:13px;resize:vertical;margin-bottom:20px;box-sizing:border-box}.email-textarea:focus{outline:0;border-color:#4CAF50;box-shadow:0 0 3px rgba(76,175,80,.5)}
.email-modal-buttons{display:flex;gap:10px;justify-content:flex-end;padding:20px;border-top:1px solid #e0e0e0}
.sw{display:inline-flex;align-items:center;gap:8px;font-size:12px;cursor:pointer;user-select:none}.sw input{display:none}.sw .sl{position:relative;width:40px;height:20px;border-radius:999px;background:#ccc;transition:background .2s}.sw .sl::before{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}.sw input:checked+.sl{background:#4caf50}.sw input:checked+.sl::before{transform:translateX(20px)}
.controls-group{display:flex;align-items:center;gap:10px;padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#f9f9f9}
.view-sw .sw-label{display:flex;gap:4px}.view-sw .mode-table{display:none}.view-sw input:checked~.sw-label .mode-text{display:none}.view-sw input:checked~.sw-label .mode-table{display:inline}
.diff-check-wrap.disabled{opacity:.5;pointer-events:none}.sl-check{width:18px;height:18px;border:2px solid #ccc;border-radius:3px;position:relative;background:#fff;transition:all .2s}.diff-check:checked+.sl-check,.highlight-check:checked+.sl-check,.hover-check:checked+.sl-check{background:#4caf50;border-color:#4caf50}.diff-check:checked+.sl-check::after,.highlight-check:checked+.sl-check::after,.hover-check:checked+.sl-check::after{content:"✓";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:12px;font-weight:700}
#chart-container{width:100%;background:#fff;padding:20px;margin-bottom:20px;border:1px solid #ddd;border-radius:4px}#event-chart{max-height:400px;cursor:pointer}
#chart-legend{display:flex;flex-wrap:wrap;gap:15px;margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #e0e0e0}
.chart-legend-title{width:100%;font-weight:700;margin-bottom:5px;font-size:14px}
.chart-legend-item{display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px}
.chart-legend-item input[type="checkbox"]{cursor:pointer;margin:0}
.chart-legend-color{display:inline-block;width:20px;height:12px;border-radius:2px}
.chart-hint{font-style:italic}
.ch-w{margin:6px 0;width:100%!important;max-width:100%!important;overflow:hidden!important;display:block!important}.ch-t{border-collapse:collapse;width:100%;max-width:100%;table-layout:fixed!important;font:inherit}.ch-t th,.ch-t td{border:1px solid #ddd;vertical-align:top;white-space:normal!important;word-wrap:break-word!important;overflow-wrap:anywhere!important;min-width:0!important;max-width:100%!important;box-sizing:border-box;word-break:normal!important;padding:4px 6px!important}.ch-t thead{display:none}.ch-t tbody td:nth-child(1){width:20%!important;max-width:20%!important;font-family:ui-monospace,monospace}.ch-t tbody td:nth-child(2),.ch-t tbody td:nth-child(3){word-break:break-all!important}.ch-t tbody td:nth-child(2){width:40%!important;max-width:40%!important}.ch-t tbody td:nth-child(3){width:40%!important;max-width:40%!important}
.ch-t a{color:#2196F3;text-decoration:none}.ch-t a:hover{text-decoration:underline}
.orig{white-space:pre-wrap;color:#333;font:13px/1.35 system-ui!important;margin:0}
.orig a{color:#2196F3;text-decoration:none}.orig a:hover{text-decoration:underline}
body.show-text .ch-t{display:none!important}body.show-text .orig{display:block}body.show-table .ch-t{display:table!important}body.show-table .orig{display:none}
body.show-text .ch-w{font:inherit!important}body.show-text .orig{font:inherit!important}
.ch-t td .ad{background:#e6ffe6;border-radius:3px;padding:0 3px}.ch-t td .rm{background:#ffecec;border-radius:3px;padding:0 3px;text-decoration:line-through}
.act-hide{display:none!important}
mark.search-highlight{background:#EF0FFF;color:#fff;padding:1px 2px;border-radius:2px;font-weight:500}
.button-mgmt-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:10001}
.button-mgmt-modal{background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.3);width:90%;max-width:600px;max-height:80vh;overflow:auto}
.button-mgmt-header{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #e0e0e0}.button-mgmt-header h3{margin:0;font-size:18px}
.button-mgmt-close{background:none;border:none;font-size:28px;cursor:pointer;color:#666;padding:0;width:30px;height:30px;line-height:1;transition:color .2s}.button-mgmt-close:hover{color:#333}
.button-mgmt-content{padding:20px}
.buttons-list{display:flex;flex-direction:column;gap:12px;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #e0e0e0}
.button-mgmt-item{display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f5f5f5;border-radius:6px;border-left:4px solid #2196F3;transition:all .2s ease}.button-mgmt-item:hover{background:#eff7ff;box-shadow:0 2px 8px rgba(33,150,243,.2)}
.button-mgmt-label{flex:1;font-weight:500;font-size:14px;color:#333}
.button-mgmt-controls{display:flex;gap:6px}
.btn-mgmt-ctrl{padding:6px 12px;background:#757575;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:13px;font-weight:700;transition:background .2s,opacity .2s}.btn-mgmt-ctrl:hover:not(:disabled){background:#616161}.btn-mgmt-ctrl:disabled{opacity:.5;cursor:not-allowed;background:#999}.btn-mgmt-ctrl.order-btn{padding:6px 8px}
.button-mgmt-settings{padding-top:15px}
.button-mgmt-settings-title{font-weight:700;font-size:14px;margin-bottom:12px;color:#333;padding-bottom:8px;border-bottom:1px solid #ddd}
.mgmt-checkbox-label{display:flex;align-items:center;gap:10px;padding:10px;cursor:pointer;font-size:14px;color:#333;user-select:none}.mgmt-checkbox-label input[type="checkbox"]{cursor:pointer;width:18px;height:18px}.mgmt-checkbox-label:hover{background:#f9f9f9;border-radius:4px}
        `;
        document.head.appendChild(s);
        if (shouldShowChart() && typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();