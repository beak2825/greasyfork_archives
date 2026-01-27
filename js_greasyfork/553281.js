// ==UserScript==
// @name         enhanced ersetzer
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.5.4
// @description  Fügt Schnellbuttons für häufige Ersetzungen hinzu + Klickbare Fehler-Icons mit Clipboard-Funktion + Maskierungs-Tool + History-Panel
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel/ersetzer*
// @noframes
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/553281/enhanced%20ersetzer.user.js
// @updateURL https://update.greasyfork.org/scripts/553281/enhanced%20ersetzer.meta.js
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
    if (!window.location.pathname.startsWith('/kalif/artikel/ersetzer')) return;

    // Verhindere mehrfache Initialisierung im selben Fenster
    if (window.__enhancedErsetzerInitialized) return;
    window.__enhancedErsetzerInitialized = true;

    // ========================================================================
    // HISTORY-PANEL KONSTANTEN UND VARIABLEN
    // ========================================================================
    const MAX_ENTRIES = 1000;
    const MAX_CONTENT_LENGTH = 50000;
    const HISTORY_STORAGE_KEY = 'aesave_history';

    let historyPanel = null;
    let historyFilter = 'Alle';
    let historyDateFrom = null;
    let historyDateTo = null;
    let historySearchTerm = ''; // Suchbegriff für History-Inhalte

    // Key-Panel Variablen
    let keyPanel = null;
    let keyPanelOpen = false;
    let gutterIcon = null;
    let historyIcon = null;
    let configIcon = null;
    let warningsIcon = null;
    let variablesIcon = null;
    let snippetsIcon = null;
    let keyPanelRenderFn = null;
    let keyPanelSearchInput = null;
    let activePanel = 'history'; // 'key', 'variables', 'snippets', 'history' oder 'warnings'
    let sharedPanelWidth = 400; // Gemeinsame Breite für beide Panels
    let sharedHeight = null; // Gemeinsame Höhe für Editor und Panels
    let isManualResizing = false; // Flag für manuelle Größenänderung
    let aceAutoResizeDisabled = false; // Flag: ACE Auto-Resize wurde deaktiviert
    let variablesPanel = null;
    let snippetsPanel = null;
    let warningsPanel = null;
    let collectedWarnings = new Map(); // Map für konsolidierte Warnungen/Fehler: message -> { type, count }
    let panelAutoOpened = false; // Flag um zu tracken ob Panel bereits automatisch geöffnet wurde
    let warningsEnabled = false; // Warnings-Panel deaktiviert per Default (Sammeln verlangsamt die Seite)
    let snippetEditorContainer = null;
    let activeSnippetItem = null;
    let editingSnippetId = null;
    let snippetsSortMode = 'az'; // 'az' oder 'date'
    let snippetsRenderFn = null;
    let lastSessionId = null; // Letzte Session-ID aus fetch-Request
    let pendingSessionEntryTimestamp = null; // Timestamp des History-Eintrags, der auf Session-ID wartet
    let snippetButtonsContainer = null; // Container für Snippet-Buttons oberhalb des Editors
    const SNIPPET_BUTTONS_STORAGE_KEY = 'ersetzer_snippet_buttons'; // Storage für aktive Snippet-Buttons
    let activeActionVariables = []; // Aktive Variablen für Action-Panel
    const ACTION_VARIABLES_STORAGE_KEY = 'ersetzer_action_variables'; // Storage für aktive Action-Variablen
    let actionPanelContainer = null; // Container für Action-Panel

    // Funktion zum Aktualisieren eines History-Eintrags mit Session-ID
    function updateHistoryEntryWithSessionId(timestamp, sessionId) {
        if (!timestamp || !sessionId) return;

        let entries = loadHistory();
        const entryIndex = entries.findIndex(e => e.timestamp === timestamp);

        if (entryIndex !== -1 && !entries[entryIndex].sessionId) {
            entries[entryIndex].sessionId = sessionId;
            saveHistory(entries);

            // History-Liste neu rendern
            renderHistoryEntries();

            // Preview aktualisieren falls dieser Eintrag gerade angezeigt wird
            if (previewContainer) {
                const headerTitle = previewContainer.querySelector('.history-preview-title');
                if (headerTitle) {
                    const entry = entries[entryIndex];
                    const typeLabel = entry.type === 'T' ? 'Testen' : '<b>Speichern</b>';
                    const typeLabelPlain = entry.type === 'T' ? 'Testen' : 'Speichern';
                    const sessionLink = `<a href="https://opus.geizhals.at/kalif/artikel/ersetzer?id=${sessionId}" target="_blank" style="color:inherit;">${sessionId}</a>`;
                    const suchPlLink = entry.articleIds ? `, <a href="https://opus.geizhals.at/pv-edit/such.pl?&syntax=a.id=${entry.articleIds}" target="_blank" style="color:inherit;">such.pl</a>` : '';
                    headerTitle.innerHTML = `${formatTimestamp(entry.timestamp)} - ${typeLabel} (${sessionLink}${suchPlLink})`;
                    headerTitle.title = `${formatTimestamp(entry.timestamp)} - ${typeLabelPlain} (${sessionId}${entry.articleIds ? ', such.pl' : ''})`;
                }
            }
        }

        pendingSessionEntryTimestamp = null;
    }

    // Fetch-Interceptor für Session-ID Extraktion
    (function() {
        const win = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
        const originalFetch = win.fetch;
        win.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && url.includes('/kalif/api/artikel/ersetzer/session/')) {
                // Session-ID aus URL extrahieren
                const match = url.match(/\/session\/([A-F0-9-]+)\?/i);
                if (match) {
                    lastSessionId = match[1];

                    // Falls ein History-Eintrag auf die Session-ID wartet, aktualisieren
                    if (pendingSessionEntryTimestamp) {
                        updateHistoryEntryWithSessionId(pendingSessionEntryTimestamp, match[1]);
                    }
                }
            }
            return originalFetch.apply(this, args);
        };
    })();

    // Verfügbare Variablen für das Variablen-Panel
    // Format: { name: 'variablenname', readOnly: true/false }
    const availableVariables = [
        { name: '$bezeichnung', readOnly: false },
        { name: '$bezeichnung_en', readOnly: false },
        { name: '$bezeichnung_pl', readOnly: false },
        { name: '@bulk_artikel_id', readOnly: true },
        { name: '$cat', readOnly: true },
        { name: '$desc', readOnly: false },
        { name: '$desc_alt', readOnly: true },
        { name: '$hersteller', readOnly: true },
        { name: '$hersteller_id', readOnly: false },
        { name: '$hinweis', readOnly: false },
        { name: '$hlink_de', readOnly: false },
        { name: '$hlink_en', readOnly: false },
        { name: '$hlink_mlt', readOnly: false },
        { name: '$hlink_pl', readOnly: false },
        { name: '$id', readOnly: true },
        { name: '@ikw', readOnly: false },
        { name: '$kw', readOnly: false },
        { name: '$matchrule', readOnly: false },
        { name: '$matchrule_comment', readOnly: false },
        { name: '$matchrule_untested', readOnly: false },
        { name: '$modell', readOnly: true },
        { name: '$mpn', readOnly: false },
        { name: '$name', readOnly: false },
        { name: '$name_kurz', readOnly: true },
        { name: '$no_kv', readOnly: false },
        { name: '@related', readOnly: false },
        { name: '$retired', readOnly: false },
        { name: '$serie', readOnly: true },
        { name: '$sizechart', readOnly: false },
        { name: '$template_id', readOnly: false },
        { name: '$value{KEY}', readOnly: false },
        { name: '$varianten_id', readOnly: false },
        { name: '$varianten_name', readOnly: true }
    ];

    // Spezielle Tooltips für bestimmte Variablen (mit HTML für Kursiv)
    const variableTooltips = {
        '$matchrule_untested': 'Löschen mit <i>$matchrule_untested = \'\'</i>',
        '$no_kv': '<i>0</i> oder <i>1</i>',
        '$varianten_id': '&lt;integer&gt; oder <i>undef</i>',
        '$template_id': '&lt;integer&gt; oder <i>undef</i>',
        '$retired': '<i>0</i> oder <i>1</i>'
    };

    // ========================================================================
    // HISTORY-PANEL FUNKTIONEN
    // ========================================================================

    function getJobId() {
        const match = window.location.search.match(/job_id=(\d+)/);
        return match ? match[1] : 'global';
    }

    function getHistoryStorageKey() {
        return `${HISTORY_STORAGE_KEY}_${getJobId()}`;
    }

    function loadHistory() {
        try {
            const data = localStorage.getItem(getHistoryStorageKey());
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveHistory(entries) {
        try {
            localStorage.setItem(getHistoryStorageKey(), JSON.stringify(entries));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                const trimmed = entries.slice(0, Math.floor(entries.length / 2));
                try {
                    localStorage.setItem(getHistoryStorageKey(), JSON.stringify(trimmed));
                } catch (e2) {
                    // Aufgeben
                }
            }
        }
    }

    function addHistoryEntry(type, content) {
        // Trailing Whitespace normalisieren
        content = content.replace(/\n+$/, '');

        // Leere Einträge oder nur Whitespace nicht speichern
        if (!content.trim()) {
            return;
        }

        if (content.length > MAX_CONTENT_LENGTH) {
            content = content.substring(0, MAX_CONTENT_LENGTH);
        }

        // Artikel-IDs aus dem URL-Hash extrahieren
        const articleIds = window.location.hash ? window.location.hash.substring(1) : '';

        const timestamp = Date.now();
        const entry = {
            timestamp: timestamp,
            type: type,
            content: content,
            sessionId: null, // Session-ID wird nachträglich ergänzt
            articleIds: articleIds // Artikel-IDs für such.pl Link
        };

        // Timestamp merken für nachträgliche Session-ID-Ergänzung
        pendingSessionEntryTimestamp = timestamp;

        let entries = loadHistory();
        entries.unshift(entry);

        if (entries.length > MAX_ENTRIES) {
            entries = entries.slice(0, MAX_ENTRIES);
        }

        saveHistory(entries);
        renderHistoryEntries();
    }

    function formatTimestamp(ts) {
        const d = new Date(ts);
        const pad = n => String(n).padStart(2, '0');
        const day = pad(d.getDate());
        const month = pad(d.getMonth() + 1);
        const year = String(d.getFullYear()).slice(-2);
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        const seconds = pad(d.getSeconds());
        return `${day}-${month}-${year} - ${hours}:${minutes}:${seconds}`;
    }

    function getFilteredEntries() {
        let entries = loadHistory();

        if (historyFilter !== 'Alle') {
            const typeChar = historyFilter === 'Testen' ? 'T' : 'S';
            entries = entries.filter(e => e.type === typeChar);
        }

        if (historyDateFrom) {
            const from = new Date(historyDateFrom);
            from.setHours(0, 0, 0, 0);
            entries = entries.filter(e => e.timestamp >= from.getTime());
        }

        if (historyDateTo) {
            const to = new Date(historyDateTo);
            to.setHours(23, 59, 59, 999);
            entries = entries.filter(e => e.timestamp <= to.getTime());
        }

        // Content-Suche
        if (historySearchTerm.trim()) {
            const terms = historySearchTerm.trim().split(/\s+/).filter(t => t);
            const includeTerms = terms.filter(t => !t.startsWith('-')).map(t => t.toLowerCase());
            const excludeTerms = terms.filter(t => t.startsWith('-')).map(t => t.substring(1).toLowerCase()).filter(t => t);

            entries = entries.filter(entry => {
                const contentLower = (entry.content || '').toLowerCase();

                // Prüfen ob ausgeschlossen
                for (const excl of excludeTerms) {
                    if (contentLower.includes(excl)) {
                        return false;
                    }
                }

                // Wenn keine Include-Terms, alle anzeigen (außer ausgeschlossene)
                if (includeTerms.length === 0) {
                    return true;
                }

                // Prüfen ob alle Include-Terms vorhanden sind
                for (const incl of includeTerms) {
                    if (!contentLower.includes(incl)) {
                        return false;
                    }
                }

                return true;
            });
        }

        return entries;
    }

    function getAceEditor() {
        const aceEditor = document.querySelector('.ace_editor');
        if (aceEditor && aceEditor.env && aceEditor.env.editor) {
            return aceEditor.env.editor;
        }
        return null;
    }

    // Fügt Inhalt in den ACE-Editor ein (ersetzt gesamten Inhalt)
    function insertIntoAceEditor(content) {
        const editor = getAceEditor();
        if (editor && content) {
            editor.setValue(content, -1); // -1 = Cursor an den Anfang setzen
            editor.focus();
        }
    }

    let activeHistoryItem = null;
    let previewContainer = null;

    function closeHistoryPreview() {
        if (previewContainer) {
            previewContainer.remove();
            previewContainer = null;
        }
        if (activeHistoryItem) {
            activeHistoryItem.style.backgroundColor = '';
            activeHistoryItem = null;
        }
    }

    function showHistoryPreview(entry, itemElement) {
        // Toggle-Verhalten: Wenn dasselbe Item erneut angeklickt wird, Preview schließen
        if (activeHistoryItem === itemElement) {
            closeHistoryPreview();
            return;
        }

        // Vorherige Markierung entfernen
        if (activeHistoryItem && activeHistoryItem !== itemElement) {
            activeHistoryItem.style.backgroundColor = '';
        }

        // Neues Item markieren
        activeHistoryItem = itemElement;
        itemElement.style.backgroundColor = '#cce5ff';

        const aceEditorContainer = document.querySelector('#ace-editor');
        if (!aceEditorContainer) return;

        // Preview-Container erstellen oder aktualisieren
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.className = 'history-preview-container';
            previewContainer.style.position = 'relative';
            previewContainer.style.width = (sharedPanelWidth * 2) + 'px';
            previewContainer.style.minWidth = '200px';
            previewContainer.style.marginTop = '24px';
            previewContainer.style.flexShrink = '0';
            previewContainer.style.display = 'flex';
            previewContainer.style.flexDirection = 'column';
            previewContainer.style.border = '1px solid #ccc';
            previewContainer.style.borderRadius = '4px';
            previewContainer.style.backgroundColor = '#fff';

            // Resize-Handle links
            const previewResizeHandle = document.createElement('div');
            previewResizeHandle.className = 'preview-resize-handle';
            previewResizeHandle.style.position = 'absolute';
            previewResizeHandle.style.top = '0';
            previewResizeHandle.style.left = '0';
            previewResizeHandle.style.width = '5px';
            previewResizeHandle.style.height = '100%';
            previewResizeHandle.style.cursor = 'ew-resize';
            previewResizeHandle.style.backgroundColor = 'transparent';
            previewResizeHandle.style.zIndex = '10';

            previewResizeHandle.addEventListener('mouseenter', () => {
                previewResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
            });
            previewResizeHandle.addEventListener('mouseleave', () => {
                if (!previewResizeHandle.dataset.dragging) {
                    previewResizeHandle.style.backgroundColor = 'transparent';
                }
            });

            let previewStartX, previewStartWidth;

            previewResizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                previewStartX = e.clientX;
                previewStartWidth = previewContainer.offsetWidth;
                previewResizeHandle.dataset.dragging = 'true';
                previewResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
                isManualResizing = true;

                const onMouseMove = (e) => {
                    // Bei linkem Handle: negative Bewegung = größer
                    const diff = previewStartX - e.clientX;
                    const newWidth = Math.max(200, previewStartWidth + diff);
                    previewContainer.style.width = newWidth + 'px';
                    if (snippetEditorContainer) {
                        snippetEditorContainer.style.width = newWidth + 'px';
                    }
                };

                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    delete previewResizeHandle.dataset.dragging;
                    previewResizeHandle.style.backgroundColor = 'transparent';
                    isManualResizing = false;
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            previewContainer.appendChild(previewResizeHandle);

            // Header mit Titel und Schließen-Button
            const header = document.createElement('div');
            header.className = 'history-preview-header';
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.padding = '8px';
            header.style.paddingLeft = '12px'; // Platz für Resize-Handle
            header.style.borderBottom = '1px solid #ccc';
            header.style.backgroundColor = '#f8f9fa';
            header.style.flexShrink = '0';

            const headerTitle = document.createElement('span');
            headerTitle.className = 'history-preview-title';
            headerTitle.style.fontWeight = 'bold';
            headerTitle.style.fontSize = '12px';
            headerTitle.style.fontFamily = 'monospace';
            headerTitle.style.whiteSpace = 'nowrap';
            headerTitle.style.overflow = 'hidden';
            headerTitle.style.textOverflow = 'ellipsis';
            headerTitle.style.flex = '1';
            headerTitle.textContent = '';

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.border = 'none';
            closeBtn.style.background = 'none';
            closeBtn.style.fontSize = '18px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.padding = '0 4px';
            closeBtn.style.lineHeight = '1';
            closeBtn.title = 'Schließen';
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeHistoryPreview();
            });

            // Copy-Button
            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Code kopieren';
            copyBtn.className = 'btn btn-sm btn-outline-secondary history-preview-copy-btn';
            copyBtn.style.fontSize = '11px';
            copyBtn.style.padding = '2px 8px';
            copyBtn.style.marginRight = '8px';
            copyBtn.title = 'Code in Zwischenablage kopieren';

            // Buttons-Container für rechte Seite
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.display = 'flex';
            buttonsContainer.style.alignItems = 'center';
            buttonsContainer.style.gap = '4px';
            buttonsContainer.appendChild(copyBtn);
            buttonsContainer.appendChild(closeBtn);

            header.appendChild(headerTitle);
            header.appendChild(buttonsContainer);

            // Content-Bereich (pre statt textarea für Highlighting-Support)
            const contentArea = document.createElement('pre');
            contentArea.className = 'history-preview-content';
            contentArea.style.width = '100%';
            contentArea.style.flex = '1';
            contentArea.style.padding = '8px';
            contentArea.style.paddingLeft = '12px'; // Platz für Resize-Handle
            contentArea.style.border = 'none';
            contentArea.style.fontFamily = 'monospace';
            contentArea.style.fontSize = '12px';
            contentArea.style.backgroundColor = '#fff';
            contentArea.style.boxSizing = 'border-box';
            contentArea.style.margin = '0';
            contentArea.style.overflowY = 'auto';
            contentArea.style.overflowX = 'auto';
            contentArea.style.whiteSpace = 'pre-wrap';
            contentArea.style.wordWrap = 'break-word';
            contentArea.style.userSelect = 'text';

            previewContainer.appendChild(header);
            previewContainer.appendChild(contentArea);

            // Nach dem Ace-Editor einfügen
            aceEditorContainer.parentNode.insertBefore(previewContainer, aceEditorContainer.nextSibling);
        }

        // Header-Titel aktualisieren
        const headerTitle = previewContainer.querySelector('.history-preview-title');
        if (headerTitle) {
            const typeLabel = entry.type === 'T' ? 'Testen' : '<b>Speichern</b>';
            const typeLabelPlain = entry.type === 'T' ? 'Testen' : 'Speichern';
            if (entry.sessionId) {
                const sessionLink = `<a href="https://opus.geizhals.at/kalif/artikel/ersetzer?id=${entry.sessionId}" target="_blank" style="color:inherit;">${entry.sessionId}</a>`;
                const suchPlLink = entry.articleIds ? `, <a href="https://opus.geizhals.at/pv-edit/such.pl?&syntax=a.id=${entry.articleIds}" target="_blank" style="color:inherit;">such.pl</a>` : '';
                headerTitle.innerHTML = `${formatTimestamp(entry.timestamp)} - ${typeLabel} (${sessionLink}${suchPlLink})`;
                headerTitle.title = `${formatTimestamp(entry.timestamp)} - ${typeLabelPlain} (${entry.sessionId}${entry.articleIds ? ', such.pl' : ''})`;
            } else {
                const suchPlLink = entry.articleIds ? ` (<a href="https://opus.geizhals.at/pv-edit/such.pl?&syntax=a.id=${entry.articleIds}" target="_blank" style="color:inherit;">such.pl</a>)` : '';
                headerTitle.innerHTML = `${formatTimestamp(entry.timestamp)} - ${typeLabel}${suchPlLink}`;
                headerTitle.title = `${formatTimestamp(entry.timestamp)} - ${typeLabelPlain}${entry.articleIds ? ' (such.pl)' : ''}`;
            }
        }

        // Container-Höhe setzen
        previewContainer.style.height = (sharedHeight || aceEditorContainer.offsetHeight) + 'px';

        // Copy-Button Handler aktualisieren
        const copyBtn = previewContainer.querySelector('.history-preview-copy-btn');
        if (copyBtn) {
            // Alten Handler entfernen und neuen setzen
            const newCopyBtn = copyBtn.cloneNode(true);
            copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);

            newCopyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(entry.content || '').then(() => {
                    // Grün aufleuchten
                    newCopyBtn.style.backgroundColor = '#28a745';
                    newCopyBtn.style.borderColor = '#28a745';
                    newCopyBtn.style.color = '#fff';

                    setTimeout(() => {
                        newCopyBtn.style.backgroundColor = '';
                        newCopyBtn.style.borderColor = '';
                        newCopyBtn.style.color = '';
                    }, 500);
                }).catch(err => {
                    // Fehler ignorieren
                });
            });
        }

        // Content-Bereich aktualisieren mit Highlighting
        const contentArea = previewContainer.querySelector('.history-preview-content');
        if (contentArea) {
            let displayContent = entry.content || '';

            // HTML-Entities escapen
            displayContent = displayContent
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            // Suchbegriffe hervorheben
            if (historySearchTerm.trim()) {
                const terms = historySearchTerm.trim().split(/\s+/).filter(t => t);
                const includeTerms = terms.filter(t => !t.startsWith('-'));

                includeTerms.forEach(term => {
                    if (term) {
                        // Case-insensitive Ersetzung mit Highlight
                        const regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
                        displayContent = displayContent.replace(regex, '<span style="background-color: #EF0FFF; color: #fff;">$1</span>');
                    }
                });
            }

            contentArea.innerHTML = displayContent;
        }
    }

    function renderHistoryEntries() {
        if (!historyPanel) return;

        const listContainer = historyPanel.querySelector('.history-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        const entries = getFilteredEntries();

        entries.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.style.padding = '6px 8px';
            item.style.borderBottom = '1px solid #e0e0e0';
            item.style.cursor = 'pointer';
            item.style.fontSize = '12px';
            item.style.fontFamily = 'monospace';
            item.style.whiteSpace = 'nowrap';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.gap = '8px';

            const typeLabel = entry.type === 'T' ? 'Testen' : '<b>Speichern</b>';
            const typeColor = entry.type === 'T' ? '#6c757d' : '#0d6efd';

            // Text-Container
            const textContainer = document.createElement('span');
            textContainer.style.overflow = 'hidden';
            textContainer.style.textOverflow = 'ellipsis';
            textContainer.innerHTML = `${formatTimestamp(entry.timestamp)} - <span style="color:${typeColor};">${typeLabel}</span>`;
            item.appendChild(textContainer);

            // Einfügen-Button
            const insertBtn = document.createElement('button');
            insertBtn.textContent = 'Einfügen';
            insertBtn.style.color = '#0d6efd';
            insertBtn.style.backgroundColor = '#fff';
            insertBtn.style.border = '1px solid #0d6efd';
            insertBtn.style.borderRadius = '3px';
            insertBtn.style.fontSize = '10px';
            insertBtn.style.padding = '1px 6px';
            insertBtn.style.cursor = 'pointer';
            insertBtn.style.fontWeight = 'normal';
            insertBtn.style.lineHeight = '1.2';
            insertBtn.style.flexShrink = '0';
            insertBtn.title = 'Inhalt in Editor einfügen';
            insertBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Verhindere dass item.click auch ausgelöst wird
                insertIntoAceEditor(entry.content);
            });
            insertBtn.addEventListener('mouseenter', () => {
                insertBtn.style.backgroundColor = '#0d6efd';
                insertBtn.style.color = '#fff';
            });
            insertBtn.addEventListener('mouseleave', () => {
                insertBtn.style.backgroundColor = '#fff';
                insertBtn.style.color = '#0d6efd';
            });
            item.appendChild(insertBtn);

            item.addEventListener('mouseenter', () => {
                if (item !== activeHistoryItem) {
                    item.style.backgroundColor = '#f0f0f0';
                }
            });
            item.addEventListener('mouseleave', () => {
                if (item !== activeHistoryItem) {
                    item.style.backgroundColor = '';
                }
            });

            item.addEventListener('click', () => {
                showHistoryPreview(entry, item);
            });

            listContainer.appendChild(item);
        });

        if (entries.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.padding = '12px';
            emptyMsg.style.color = '#999';
            emptyMsg.style.fontSize = '12px';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.textContent = 'Keine Einträge';
            listContainer.appendChild(emptyMsg);
        }
    }

    function createHistoryPanel() {
        // Strikte Prüfungen für mehrfache Initialisierung
        if (historyPanel) return;
        if (document.querySelector('.history-panel')) return;

        const aceEditorContainer = document.querySelector('#ace-editor');
        if (!aceEditorContainer) return;

        // Prüfen ob Wrapper bereits existiert
        let wrapper = document.querySelector('.ace-editor-wrapper');

        if (!wrapper) {
            // Wrapper muss erstellt werden
            const editorParent = aceEditorContainer.parentElement;
            if (!editorParent) return;

            wrapper = document.createElement('div');
            wrapper.className = 'ace-editor-wrapper';
            wrapper.style.display = 'flex';
            wrapper.style.gap = '8px';
            wrapper.style.alignItems = 'stretch';

            editorParent.insertBefore(wrapper, aceEditorContainer);
            wrapper.appendChild(aceEditorContainer);
        }

        // Snippet-Buttons Container initialisieren
        initSnippetButtonsContainer();

        historyPanel = document.createElement('div');
        historyPanel.className = 'history-panel';
        historyPanel.style.display = 'flex'; // History-Panel ist Standard
        historyPanel.style.flexDirection = 'column';
        historyPanel.style.border = '1px solid #ccc';
        historyPanel.style.borderRadius = '4px';
        historyPanel.style.backgroundColor = '#fff';
        historyPanel.style.minWidth = '120px';
        historyPanel.style.width = sharedPanelWidth + 'px';
        historyPanel.style.height = (sharedHeight || aceEditorContainer.offsetHeight) + 'px';
        historyPanel.style.marginTop = '24px';
        historyPanel.style.order = '-1'; // Links vom Editor
        historyPanel.style.flexShrink = '0';
        historyPanel.style.position = 'relative';

        // Resize-Handle rechts für History-Panel
        const historyResizeHandle = document.createElement('div');
        historyResizeHandle.className = 'panel-resize-handle';
        historyResizeHandle.style.position = 'absolute';
        historyResizeHandle.style.top = '0';
        historyResizeHandle.style.right = '0';
        historyResizeHandle.style.width = '5px';
        historyResizeHandle.style.height = '100%';
        historyResizeHandle.style.cursor = 'ew-resize';
        historyResizeHandle.style.backgroundColor = 'transparent';
        historyResizeHandle.style.zIndex = '10';

        historyResizeHandle.addEventListener('mouseenter', () => {
            historyResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        historyResizeHandle.addEventListener('mouseleave', () => {
            if (!historyResizeHandle.dataset.dragging) {
                historyResizeHandle.style.backgroundColor = 'transparent';
            }
        });

        let historyStartX, historyStartWidth;

        historyResizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            historyStartX = e.clientX;
            historyStartWidth = historyPanel.offsetWidth;
            historyResizeHandle.dataset.dragging = 'true';
            historyResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
            isManualResizing = true;

            const onMouseMove = (e) => {
                const diff = e.clientX - historyStartX;
                const newWidth = Math.max(120, historyStartWidth + diff);
                sharedPanelWidth = newWidth;
                historyPanel.style.width = newWidth + 'px';
                if (keyPanel) {
                    keyPanel.style.width = newWidth + 'px';
                }
                if (variablesPanel) {
                    variablesPanel.style.width = newWidth + 'px';
                }
                if (snippetsPanel) {
                    snippetsPanel.style.width = newWidth + 'px';
                }
                if (warningsPanel) {
                    warningsPanel.style.width = newWidth + 'px';
                }
                if (previewContainer) {
                    previewContainer.style.width = (newWidth * 2) + 'px';
                }
                if (snippetEditorContainer) {
                    snippetEditorContainer.style.width = (newWidth * 2) + 'px';
                }
                // Snippet-Buttons Container Position aktualisieren
                updateSnippetButtonsContainerPosition();
                // Höhe beibehalten
                if (sharedHeight) {
                    historyPanel.style.height = sharedHeight + 'px';
                    if (keyPanel) {
                        keyPanel.style.height = sharedHeight + 'px';
                    }
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                delete historyResizeHandle.dataset.dragging;
                historyResizeHandle.style.backgroundColor = 'transparent';
                isManualResizing = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        historyPanel.appendChild(historyResizeHandle);

        // Vertikaler Resize-Handle unten für History-Panel
        const historyVerticalResizeHandle = document.createElement('div');
        historyVerticalResizeHandle.className = 'panel-vertical-resize-handle';
        historyVerticalResizeHandle.style.position = 'absolute';
        historyVerticalResizeHandle.style.bottom = '0';
        historyVerticalResizeHandle.style.left = '0';
        historyVerticalResizeHandle.style.width = '100%';
        historyVerticalResizeHandle.style.height = '5px';
        historyVerticalResizeHandle.style.cursor = 'ns-resize';
        historyVerticalResizeHandle.style.backgroundColor = 'transparent';
        historyVerticalResizeHandle.style.zIndex = '10';

        historyVerticalResizeHandle.addEventListener('mouseenter', () => {
            historyVerticalResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        historyVerticalResizeHandle.addEventListener('mouseleave', () => {
            if (!historyVerticalResizeHandle.dataset.dragging) {
                historyVerticalResizeHandle.style.backgroundColor = 'transparent';
            }
        });

        let historyVStartY, historyVStartHeight;

        historyVerticalResizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            historyVStartY = e.clientY;
            historyVStartHeight = historyPanel.offsetHeight;
            historyVerticalResizeHandle.dataset.dragging = 'true';
            historyVerticalResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
            isManualResizing = true;

            const onMouseMove = (e) => {
                const diff = e.clientY - historyVStartY;
                const newHeight = Math.max(100, historyVStartHeight + diff);
                syncHeight(newHeight);
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                delete historyVerticalResizeHandle.dataset.dragging;
                historyVerticalResizeHandle.style.backgroundColor = 'transparent';
                isManualResizing = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        historyPanel.appendChild(historyVerticalResizeHandle);

        const header = document.createElement('div');
        header.className = 'history-header';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.padding = '6px';
        header.style.borderBottom = '1px solid #ccc';
        header.style.gap = '4px';
        header.style.flexWrap = 'nowrap';

        // Info-Icon mit Tooltip
        const infoIcon = document.createElement('span');
        infoIcon.textContent = 'ℹ️';
        infoIcon.style.fontSize = '12px';
        infoIcon.style.cursor = 'help';
        infoIcon.style.flexShrink = '0';
        infoIcon.title = 'Limit: 1000 Einträge. Älteste Einträge werden automatisch überschrieben.';
        header.appendChild(infoIcon);

        const filters = ['Alle', 'Testen', 'Speichern'];

        // Radio-Button-Container
        const radioContainer = document.createElement('div');
        radioContainer.style.display = 'flex';
        radioContainer.style.gap = '6px';
        radioContainer.style.alignItems = 'center';

        filters.forEach(filter => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '2px';
            label.style.cursor = 'pointer';
            label.style.fontSize = '11px';
            label.style.whiteSpace = 'nowrap';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'historyFilter';
            radio.value = filter;
            radio.checked = filter === historyFilter;
            radio.style.margin = '0';
            radio.style.cursor = 'pointer';

            radio.addEventListener('change', () => {
                historyFilter = filter;
                closeHistoryPreview();
                renderHistoryEntries();
            });

            label.appendChild(radio);
            label.appendChild(document.createTextNode(filter));
            radioContainer.appendChild(label);
        });

        header.appendChild(radioContainer);

        // Suchfeld für History-Inhalte
        const historySearchInput = document.createElement('input');
        historySearchInput.type = 'text';
        historySearchInput.placeholder = 'History durchsuchen…';
        historySearchInput.style.flex = '1';
        historySearchInput.style.minWidth = '80px';
        historySearchInput.style.padding = '2px 6px';
        historySearchInput.style.fontSize = '11px';
        historySearchInput.style.border = '1px solid #ccc';
        historySearchInput.style.borderRadius = '3px';
        historySearchInput.style.marginLeft = '4px';

        historySearchInput.addEventListener('input', (e) => {
            historySearchTerm = e.target.value;
            closeHistoryPreview();
            renderHistoryEntries();
        });

        historySearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });

        header.appendChild(historySearchInput);

        const calendarBtn = document.createElement('button');
        calendarBtn.className = 'btn btn-sm';
        calendarBtn.innerHTML = '📅';
        calendarBtn.style.padding = '2px 6px';
        calendarBtn.style.fontSize = '12px';
        calendarBtn.style.border = '1px solid #ccc';
        calendarBtn.style.borderRadius = '3px';
        calendarBtn.style.cursor = 'pointer';
        calendarBtn.style.backgroundColor = '#fff';
        calendarBtn.style.marginLeft = '4px';
        calendarBtn.style.flexShrink = '0';
        calendarBtn.title = 'Datumsfilter';

        calendarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDateFilterPopover(calendarBtn);
        });

        header.appendChild(calendarBtn);

        historyPanel.appendChild(header);

        const listContainer = document.createElement('div');
        listContainer.className = 'history-list';
        listContainer.style.flex = '1';
        listContainer.style.overflowY = 'auto';
        listContainer.style.overflowX = 'hidden';

        historyPanel.appendChild(listContainer);

        wrapper.appendChild(historyPanel);

        // Initial sharedHeight setzen (mindestens 300px)
        const DEFAULT_MIN_HEIGHT = 300;
        if (!sharedHeight) {
            const currentHeight = aceEditorContainer.offsetHeight;
            if (currentHeight < DEFAULT_MIN_HEIGHT) {
                // ACE-Editor auf Mindesthöhe setzen
                aceEditorContainer.style.height = DEFAULT_MIN_HEIGHT + 'px';
                sharedHeight = DEFAULT_MIN_HEIGHT;
                // Panels ebenfalls anpassen
                if (historyPanel) {
                    historyPanel.style.height = DEFAULT_MIN_HEIGHT + 'px';
                }
                // ACE resize triggern
                syncHeight(DEFAULT_MIN_HEIGHT);
            } else {
                sharedHeight = currentHeight;
            }
        }

        // ResizeObserver nur für initiale Synchronisierung, nicht für manuelle Änderungen
        let lastObservedHeight = aceEditorContainer.offsetHeight;
        const resizeObserver = new ResizeObserver(() => {
            // Nicht eingreifen wenn gerade manuell resized wird oder Auto-Resize deaktiviert wurde
            if (isManualResizing || aceAutoResizeDisabled) return;

            const newHeight = aceEditorContainer.offsetHeight;

            // Nur reagieren wenn die Höhe sich durch Content-Änderung vergrößert hat
            // und wir noch keine manuelle Höhe gesetzt haben
            if (newHeight > lastObservedHeight && newHeight > sharedHeight) {
                sharedHeight = newHeight;
                if (historyPanel) {
                    historyPanel.style.height = newHeight + 'px';
                }
                if (keyPanel) {
                    keyPanel.style.height = newHeight + 'px';
                }
                if (variablesPanel) {
                    variablesPanel.style.height = newHeight + 'px';
                }
                if (snippetsPanel) {
                    snippetsPanel.style.height = newHeight + 'px';
                }
                if (previewContainer) {
                    const textarea = previewContainer.querySelector('.history-preview-textarea');
                    if (textarea) {
                        textarea.style.height = newHeight + 'px';
                    }
                }
                if (snippetEditorContainer) {
                    snippetEditorContainer.style.height = newHeight + 'px';
                }
            }
            lastObservedHeight = newHeight;
        });
        resizeObserver.observe(aceEditorContainer);

        // Vertikalen Resize-Handle für den gesamten Wrapper hinzufügen
        addWrapperVerticalResizeHandle(wrapper, aceEditorContainer);

        renderHistoryEntries();
    }

    function addWrapperVerticalResizeHandle(wrapper, aceEditorContainer) {
        // Prüfen ob bereits vorhanden
        if (document.querySelector('.wrapper-vertical-resize-handle')) return;

        // Container für den Resize-Handle (unterhalb des Wrappers)
        const resizeHandleContainer = document.createElement('div');
        resizeHandleContainer.className = 'wrapper-vertical-resize-handle';
        resizeHandleContainer.style.width = '100%';
        resizeHandleContainer.style.height = '8px';
        resizeHandleContainer.style.cursor = 'ns-resize';
        resizeHandleContainer.style.backgroundColor = 'transparent';
        resizeHandleContainer.style.marginTop = '-4px';
        resizeHandleContainer.style.position = 'relative';
        resizeHandleContainer.style.zIndex = '50';

        // Visueller Indikator über die gesamte Breite
        const indicator = document.createElement('div');
        indicator.style.position = 'absolute';
        indicator.style.left = '0';
        indicator.style.top = '50%';
        indicator.style.transform = 'translateY(-50%)';
        indicator.style.width = '100%';
        indicator.style.height = '4px';
        indicator.style.backgroundColor = '#ccc';
        indicator.style.borderRadius = '2px';
        indicator.style.transition = 'background-color 0.2s';
        resizeHandleContainer.appendChild(indicator);

        resizeHandleContainer.addEventListener('mouseenter', () => {
            indicator.style.backgroundColor = '#999';
        });
        resizeHandleContainer.addEventListener('mouseleave', () => {
            if (!resizeHandleContainer.dataset.dragging) {
                indicator.style.backgroundColor = '#ccc';
            }
        });

        let startY, startHeight;

        resizeHandleContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startY = e.clientY;
            startHeight = sharedHeight || aceEditorContainer.offsetHeight;
            resizeHandleContainer.dataset.dragging = 'true';
            indicator.style.backgroundColor = '#0d6efd';
            isManualResizing = true;

            const onMouseMove = (e) => {
                const diff = e.clientY - startY;
                const newHeight = Math.max(100, startHeight + diff);
                syncHeight(newHeight);
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                delete resizeHandleContainer.dataset.dragging;
                indicator.style.backgroundColor = '#ccc';
                isManualResizing = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Nach dem Wrapper einfügen
        wrapper.parentNode.insertBefore(resizeHandleContainer, wrapper.nextSibling);
    }

    function showDateFilterPopover(anchorBtn) {
        let existingPopover = document.querySelector('.history-date-popover');
        if (existingPopover) {
            existingPopover.remove();
            return;
        }

        const popover = document.createElement('div');
        popover.className = 'history-date-popover';
        popover.style.position = 'absolute';
        popover.style.zIndex = '10000';
        popover.style.backgroundColor = '#fff';
        popover.style.border = '1px solid #ccc';
        popover.style.borderRadius = '4px';
        popover.style.padding = '12px';
        popover.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        popover.style.minWidth = '200px';

        const fromLabel = document.createElement('label');
        fromLabel.textContent = 'Von:';
        fromLabel.style.display = 'block';
        fromLabel.style.fontSize = '12px';
        fromLabel.style.marginBottom = '4px';

        const fromInput = document.createElement('input');
        fromInput.type = 'date';
        fromInput.className = 'form-control form-control-sm';
        fromInput.style.marginBottom = '8px';
        fromInput.value = historyDateFrom || '';

        const toLabel = document.createElement('label');
        toLabel.textContent = 'Bis:';
        toLabel.style.display = 'block';
        toLabel.style.fontSize = '12px';
        toLabel.style.marginBottom = '4px';

        const toInput = document.createElement('input');
        toInput.type = 'date';
        toInput.className = 'form-control form-control-sm';
        toInput.style.marginBottom = '12px';
        toInput.value = historyDateTo || '';

        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.gap = '8px';
        buttonRow.style.justifyContent = 'flex-end';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn btn-sm btn-secondary';
        clearBtn.textContent = 'Zurücksetzen';
        clearBtn.style.fontSize = '11px';
        clearBtn.addEventListener('click', () => {
            historyDateFrom = null;
            historyDateTo = null;
            anchorBtn.style.backgroundColor = '#fff';
            anchorBtn.style.borderColor = '#ccc';
            popover.remove();
            closeHistoryPreview();
            renderHistoryEntries();
        });

        const applyBtn = document.createElement('button');
        applyBtn.className = 'btn btn-sm btn-primary';
        applyBtn.textContent = 'Anwenden';
        applyBtn.style.fontSize = '11px';
        applyBtn.addEventListener('click', () => {
            historyDateFrom = fromInput.value || null;
            historyDateTo = toInput.value || null;

            if (historyDateFrom || historyDateTo) {
                anchorBtn.style.backgroundColor = '#e3f2fd';
                anchorBtn.style.borderColor = '#0d6efd';
            } else {
                anchorBtn.style.backgroundColor = '#fff';
                anchorBtn.style.borderColor = '#ccc';
            }

            popover.remove();
            closeHistoryPreview();
            renderHistoryEntries();
        });

        buttonRow.appendChild(clearBtn);
        buttonRow.appendChild(applyBtn);

        popover.appendChild(fromLabel);
        popover.appendChild(fromInput);
        popover.appendChild(toLabel);
        popover.appendChild(toInput);
        popover.appendChild(buttonRow);

        document.body.appendChild(popover);

        const rect = anchorBtn.getBoundingClientRect();
        popover.style.top = (rect.bottom + window.scrollY + 4) + 'px';
        popover.style.left = (rect.right + window.scrollX - popover.offsetWidth) + 'px';

        const closeOnClickOutside = (e) => {
            if (!popover.contains(e.target) && e.target !== anchorBtn) {
                popover.remove();
                document.removeEventListener('click', closeOnClickOutside);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeOnClickOutside);
        }, 0);
    }

    function classifyButton(el) {
        if (!el || el.tagName !== 'BUTTON') return null;

        // History-Panel-Buttons, Preview-Buttons und Key-Panel-Buttons ausschließen
        if (el.closest('.history-panel') || el.closest('.history-preview-container') || el.closest('.key-panel') || el.closest('.variables-panel') || el.closest('.snippets-panel') || el.closest('.snippet-editor-container')) return null;

        const txt = el.textContent.trim().toLowerCase();
        if (txt === 'testen') return 'Testen';
        if (txt === 'speichern') return 'Speichern';

        const cls = el.className || '';
        if (/\bbtn\b/.test(cls) && /\bbtn-dark\b/.test(cls)) return 'Testen';
        if (/\bbtn\b/.test(cls) && /\bbtn-primary\b/.test(cls)) return 'Speichern';

        return null;
    }

    function initButtonClickCapture() {
        document.addEventListener('click', (ev) => {
            let btn = null;

            if (ev.composedPath) {
                for (const el of ev.composedPath()) {
                    if (el.tagName === 'BUTTON') {
                        btn = el;
                        break;
                    }
                }
            }

            if (!btn) {
                btn = ev.target.closest('button');
            }

            if (!btn) return;

            const btnType = classifyButton(btn);
            if (!btnType) return;

            // Preview schließen wenn nativer Button geklickt wird
            closeHistoryPreview();

            const editor = getAceEditor();
            if (!editor) return;

            const content = editor.getValue();
            const typeChar = btnType === 'Testen' ? 'T' : 'S';

            // History-Eintrag sofort erstellen (Session-ID wird nachträglich ergänzt)
            addHistoryEntry(typeChar, content);
        }, true);
    }

    let historyPanelInitialized = false;

    function initHistoryPanel() {
        if (historyPanelInitialized) return;

        const checkInterval = setInterval(() => {
            if (historyPanelInitialized) {
                clearInterval(checkInterval);
                return;
            }

            const aceEditor = document.querySelector('#ace-editor');
            if (aceEditor && aceEditor.classList.contains('ace_editor')) {
                const aceInstance = aceEditor.env && aceEditor.env.editor;
                if (aceInstance) {
                    historyPanelInitialized = true;
                    clearInterval(checkInterval);
                    createHistoryPanel();
                    initButtonClickCapture();
                    initKeyPanel();
                }
            }
        }, 500);
    }

    // ========================================================================
    // KEY-PANEL FUNKTIONEN
    // ========================================================================

    function getAllKeys() {
        const keyLinks = document.querySelectorAll('.key-value-table__row .key-value-table__cell a[href*="/kalif/artikel/property"]');
        const keys = new Set();
        keyLinks.forEach(link => {
            const keyName = link.textContent.trim();
            if (keyName) {
                keys.add(keyName);
            }
        });
        return Array.from(keys).sort((a, b) => a.localeCompare(b, 'de'));
    }

    function closeKeyPanel() {
        // Key-Panel bleibt immer geöffnet - Funktion deaktiviert
    }

    function openKeyPanel() {
        // Prüfen ob Key-Panel bereits existiert
        if (keyPanel || document.querySelector('.key-panel')) return;

        const aceEditorContainer = document.querySelector('#ace-editor');
        if (!aceEditorContainer) return;

        const wrapper = document.querySelector('.ace-editor-wrapper');
        if (!wrapper) return;

        // sharedHeight initialisieren falls noch nicht gesetzt (mindestens 300px)
        const DEFAULT_MIN_HEIGHT = 300;
        if (!sharedHeight) {
            const currentHeight = aceEditorContainer.offsetHeight;
            sharedHeight = Math.max(currentHeight, DEFAULT_MIN_HEIGHT);
            if (currentHeight < DEFAULT_MIN_HEIGHT) {
                aceEditorContainer.style.height = DEFAULT_MIN_HEIGHT + 'px';
            }
        }

        keyPanel = document.createElement('div');
        keyPanel.className = 'key-panel';
        keyPanel.style.display = 'none'; // History-Panel ist Standard
        keyPanel.style.flexDirection = 'column';
        keyPanel.style.border = '1px solid #ccc';
        keyPanel.style.borderRadius = '4px';
        keyPanel.style.backgroundColor = '#fff';
        keyPanel.style.minWidth = '120px';
        keyPanel.style.width = sharedPanelWidth + 'px';
        keyPanel.style.height = (sharedHeight || aceEditorContainer.offsetHeight) + 'px';
        keyPanel.style.marginTop = '24px';
        keyPanel.style.order = '-1'; // Links vom Editor
        keyPanel.style.position = 'relative';
        keyPanel.style.flexShrink = '0';

        // Resize-Handle rechts
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'panel-resize-handle';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.top = '0';
        resizeHandle.style.right = '0';
        resizeHandle.style.width = '5px';
        resizeHandle.style.height = '100%';
        resizeHandle.style.cursor = 'ew-resize';
        resizeHandle.style.backgroundColor = 'transparent';
        resizeHandle.style.zIndex = '10';

        resizeHandle.addEventListener('mouseenter', () => {
            resizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        resizeHandle.addEventListener('mouseleave', () => {
            if (!resizeHandle.dataset.dragging) {
                resizeHandle.style.backgroundColor = 'transparent';
            }
        });

        let startX, startWidth;

        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX;
            startWidth = keyPanel.offsetWidth;
            resizeHandle.dataset.dragging = 'true';
            resizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
            isManualResizing = true;

            const onMouseMove = (e) => {
                const diff = e.clientX - startX;
                const newWidth = Math.max(120, startWidth + diff);
                sharedPanelWidth = newWidth;
                keyPanel.style.width = newWidth + 'px';
                if (historyPanel) {
                    historyPanel.style.width = newWidth + 'px';
                }
                if (variablesPanel) {
                    variablesPanel.style.width = newWidth + 'px';
                }
                if (snippetsPanel) {
                    snippetsPanel.style.width = newWidth + 'px';
                }
                if (warningsPanel) {
                    warningsPanel.style.width = newWidth + 'px';
                }
                if (previewContainer) {
                    previewContainer.style.width = (newWidth * 2) + 'px';
                }
                if (snippetEditorContainer) {
                    snippetEditorContainer.style.width = (newWidth * 2) + 'px';
                }
                // Snippet-Buttons Container Position aktualisieren
                updateSnippetButtonsContainerPosition();
                // Höhe beibehalten
                if (sharedHeight) {
                    keyPanel.style.height = sharedHeight + 'px';
                    if (historyPanel) {
                        historyPanel.style.height = sharedHeight + 'px';
                    }
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                delete resizeHandle.dataset.dragging;
                resizeHandle.style.backgroundColor = 'transparent';
                isManualResizing = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        keyPanel.appendChild(resizeHandle);

        // Vertikaler Resize-Handle unten für Key-Panel
        const keyVerticalResizeHandle = document.createElement('div');
        keyVerticalResizeHandle.className = 'panel-vertical-resize-handle';
        keyVerticalResizeHandle.style.position = 'absolute';
        keyVerticalResizeHandle.style.bottom = '0';
        keyVerticalResizeHandle.style.left = '0';
        keyVerticalResizeHandle.style.width = '100%';
        keyVerticalResizeHandle.style.height = '5px';
        keyVerticalResizeHandle.style.cursor = 'ns-resize';
        keyVerticalResizeHandle.style.backgroundColor = 'transparent';
        keyVerticalResizeHandle.style.zIndex = '10';

        keyVerticalResizeHandle.addEventListener('mouseenter', () => {
            keyVerticalResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        keyVerticalResizeHandle.addEventListener('mouseleave', () => {
            if (!keyVerticalResizeHandle.dataset.dragging) {
                keyVerticalResizeHandle.style.backgroundColor = 'transparent';
            }
        });

        let keyVStartY, keyVStartHeight;

        keyVerticalResizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            keyVStartY = e.clientY;
            keyVStartHeight = keyPanel.offsetHeight;
            keyVerticalResizeHandle.dataset.dragging = 'true';
            keyVerticalResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
            isManualResizing = true;

            const onMouseMove = (e) => {
                const diff = e.clientY - keyVStartY;
                const newHeight = Math.max(100, keyVStartHeight + diff);
                syncHeight(newHeight);
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                delete keyVerticalResizeHandle.dataset.dragging;
                keyVerticalResizeHandle.style.backgroundColor = 'transparent';
                isManualResizing = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        keyPanel.appendChild(keyVerticalResizeHandle);

        // Suchfeld statt Header
        const searchContainer = document.createElement('div');
        searchContainer.className = 'key-panel-search';
        searchContainer.style.padding = '6px';
        searchContainer.style.borderBottom = '1px solid #ccc';
        searchContainer.style.backgroundColor = '#f8f9fa';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Keys suchen...';
        searchInput.className = 'form-control form-control-sm';
        searchInput.style.width = '100%';
        searchInput.style.fontSize = '11px';

        searchContainer.appendChild(searchInput);
        keyPanel.appendChild(searchContainer);

        // Liste
        const listContainer = document.createElement('div');
        listContainer.className = 'key-list';
        listContainer.style.flex = '1';
        listContainer.style.overflowY = 'auto';
        listContainer.style.overflowX = 'hidden';

        // Funktion zum Highlighten von Text
        function highlightText(text, searchTerms) {
            if (!searchTerms || searchTerms.length === 0) return text;

            let result = text;
            searchTerms.forEach(term => {
                if (term && !term.startsWith('-')) {
                    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                    result = result.replace(regex, '<span style="background-color:#EF0FFF;color:#fff;">$1</span>');
                }
            });
            return result;
        }

        // Funktion zum Filtern und Rendern der Keys
        function renderKeys(searchValue) {
            listContainer.innerHTML = '';

            // Keys jedes Mal frisch holen
            const currentKeys = getAllKeys();

            // Suchbegriffe parsen
            const terms = searchValue.trim().split(/\s+/).filter(t => t);
            const includeTerms = terms.filter(t => !t.startsWith('-')).map(t => t.toLowerCase());
            const excludeTerms = terms.filter(t => t.startsWith('-')).map(t => t.substring(1).toLowerCase()).filter(t => t);

            const filteredKeys = currentKeys.filter(keyName => {
                const keyLower = keyName.toLowerCase();

                // Prüfen ob ausgeschlossen
                for (const excl of excludeTerms) {
                    if (keyLower.includes(excl)) {
                        return false;
                    }
                }

                // Wenn keine Include-Terms, alle anzeigen (außer ausgeschlossene)
                if (includeTerms.length === 0) {
                    return true;
                }

                // Prüfen ob mindestens ein Include-Term passt
                for (const incl of includeTerms) {
                    if (keyLower.includes(incl)) {
                        return true;
                    }
                }

                return false;
            });

            filteredKeys.forEach(keyName => {
                const item = document.createElement('div');
                item.className = 'key-item';
                item.dataset.keyName = keyName;
                item.style.padding = '6px 8px';
                item.style.borderBottom = '1px solid #e0e0e0';
                item.style.cursor = 'pointer';
                item.style.fontSize = '12px';
                item.style.fontFamily = 'monospace';
                item.style.whiteSpace = 'nowrap';
                item.style.overflow = 'hidden';
                item.style.textOverflow = 'ellipsis';
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.alignItems = 'center';
                item.title = keyName;

                // Key-Name mit Highlighting
                const nameSpan = document.createElement('span');
                nameSpan.style.overflow = 'hidden';
                nameSpan.style.textOverflow = 'ellipsis';
                nameSpan.innerHTML = highlightText(keyName, includeTerms);
                item.appendChild(nameSpan);

                // Buttons Container
                const buttonsContainer = document.createElement('div');
                buttonsContainer.style.display = 'flex';
                buttonsContainer.style.gap = '4px';
                buttonsContainer.style.flexShrink = '0';

                // Button "s///"
                const substBtn = document.createElement('button');
                substBtn.textContent = 's///';
                substBtn.style.color = '#0d6efd';
                substBtn.style.backgroundColor = '#fff';
                substBtn.style.border = '1px solid #0d6efd';
                substBtn.style.borderRadius = '3px';
                substBtn.style.fontSize = '10px';
                substBtn.style.padding = '1px 6px';
                substBtn.style.cursor = 'pointer';
                substBtn.style.fontWeight = 'normal';
                substBtn.style.lineHeight = '1.2';
                substBtn.style.fontFamily = 'monospace';
                substBtn.title = `$value{${keyName}} =~ s///; einfügen`;
                substBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    insertTextWithNewlineLogic(`$value{${keyName}} =~ s///;`);
                });
                substBtn.addEventListener('mouseenter', () => {
                    substBtn.style.backgroundColor = '#0d6efd';
                    substBtn.style.color = '#fff';
                });
                substBtn.addEventListener('mouseleave', () => {
                    substBtn.style.backgroundColor = '#fff';
                    substBtn.style.color = '#0d6efd';
                });

                // Button "''"
                const assignBtn = document.createElement('button');
                assignBtn.textContent = "''";
                assignBtn.style.color = '#198754';
                assignBtn.style.backgroundColor = '#fff';
                assignBtn.style.border = '1px solid #198754';
                assignBtn.style.borderRadius = '3px';
                assignBtn.style.fontSize = '10px';
                assignBtn.style.padding = '1px 6px';
                assignBtn.style.cursor = 'pointer';
                assignBtn.style.fontWeight = 'normal';
                assignBtn.style.lineHeight = '1.2';
                assignBtn.style.fontFamily = 'monospace';
                assignBtn.title = `$value{${keyName}} = ''; einfügen`;
                assignBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    insertTextWithNewlineLogic(`$value{${keyName}} = '';`);
                });
                assignBtn.addEventListener('mouseenter', () => {
                    assignBtn.style.backgroundColor = '#198754';
                    assignBtn.style.color = '#fff';
                });
                assignBtn.addEventListener('mouseleave', () => {
                    assignBtn.style.backgroundColor = '#fff';
                    assignBtn.style.color = '#198754';
                });

                // delete Button
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'delete';
                deleteBtn.style.color = '#dc3545';
                deleteBtn.style.backgroundColor = '#fff';
                deleteBtn.style.border = '1px solid #dc3545';
                deleteBtn.style.borderRadius = '3px';
                deleteBtn.style.fontSize = '10px';
                deleteBtn.style.padding = '1px 6px';
                deleteBtn.style.cursor = 'pointer';
                deleteBtn.style.fontWeight = 'normal';
                deleteBtn.style.lineHeight = '1.2';
                deleteBtn.title = `delete $value{${keyName}}; einfügen`;
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    insertTextWithNewlineLogic(`delete $value{${keyName}};`);
                });
                deleteBtn.addEventListener('mouseenter', () => {
                    deleteBtn.style.backgroundColor = '#dc3545';
                    deleteBtn.style.color = '#fff';
                });
                deleteBtn.addEventListener('mouseleave', () => {
                    deleteBtn.style.backgroundColor = '#fff';
                    deleteBtn.style.color = '#dc3545';
                });

                buttonsContainer.appendChild(substBtn);
                buttonsContainer.appendChild(assignBtn);
                buttonsContainer.appendChild(deleteBtn);
                item.appendChild(buttonsContainer);

                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#f0f0f0';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = '';
                });

                item.addEventListener('click', () => {
                    // Key an Cursor-Position einfügen (wie Variablen-Panel)
                    insertVariableIntoAce(`$value{${keyName}}`);
                });

                listContainer.appendChild(item);
            });

            if (filteredKeys.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.style.padding = '12px';
                emptyMsg.style.color = '#999';
                emptyMsg.style.fontSize = '12px';
                emptyMsg.style.textAlign = 'center';
                emptyMsg.textContent = searchValue ? 'Keine Treffer' : 'Keine Keys gefunden';
                listContainer.appendChild(emptyMsg);
            }
        }

        // Initial rendern
        renderKeys('');

        // Globale Referenzen speichern für MutationObserver
        keyPanelRenderFn = renderKeys;
        keyPanelSearchInput = searchInput;

        // Event Listener für Suche
        searchInput.addEventListener('input', (e) => {
            renderKeys(e.target.value);
        });

        // Enter verhindert Formular-Submit
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });

        keyPanel.appendChild(listContainer);

        // Panel am Anfang des Wrappers einfügen (links)
        wrapper.insertBefore(keyPanel, wrapper.firstChild);

        keyPanelOpen = true;
    }

    function toggleKeyPanel() {
        // Key-Panel bleibt immer geöffnet - Toggle deaktiviert
        if (!keyPanelOpen) {
            openKeyPanel();
        }
    }

    function addGutterIcon() {
        const aceEditorEl = document.querySelector('#ace-editor');
        if (!aceEditorEl) return;

        // Prüfen ob Icons bereits existieren
        if (document.querySelector('.gutter-panel-icons')) return;

        // Style für breitere Gutter hinzufügen (Platz für Icons + 15px Abstand)
        // Nur für Haupt-Editor, nicht für Autocomplete-Popup oder andere Overlays
        if (!document.getElementById('gutter-width-style')) {
            const gutterStyle = document.createElement('style');
            gutterStyle.id = 'gutter-width-style';
            gutterStyle.textContent = `
                #ace-editor.ace_editor > .ace_gutter {
                    width: 65px !important;
                }
                #ace-editor.ace_editor > .ace_gutter > .ace_gutter-layer {
                    width: 65px !important;
                }
                #ace-editor.ace_editor > .ace_gutter .ace_gutter-cell {
                    padding-left: 38px !important;
                }
                #ace-editor.ace_editor > .ace_scroller {
                    left: 65px !important;
                }
            `;
            document.head.appendChild(gutterStyle);
        }

        // Container für alle Icons
        const iconContainer = document.createElement('div');
        iconContainer.className = 'gutter-panel-icons';
        iconContainer.style.position = 'absolute';
        iconContainer.style.top = '2px';
        iconContainer.style.left = '2px';
        iconContainer.style.zIndex = '100';
        iconContainer.style.display = 'flex';
        iconContainer.style.flexDirection = 'column';
        iconContainer.style.gap = '2px';

        // K-Icon für Key-Panel
        gutterIcon = document.createElement('div');
        gutterIcon.className = 'gutter-key-icon';
        gutterIcon.textContent = 'Ⓚ';
        gutterIcon.style.fontSize = '14px';
        gutterIcon.style.lineHeight = '1';
        gutterIcon.style.cursor = 'pointer';
        gutterIcon.style.pointerEvents = 'auto';
        gutterIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
        gutterIcon.style.color = '#333';
        gutterIcon.style.borderRadius = '2px';
        gutterIcon.style.padding = '2px';
        gutterIcon.style.textAlign = 'center';
        gutterIcon.style.minWidth = '18px';
        gutterIcon.title = 'Keys';

        gutterIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            switchToPanel('key');
        });

        // V-Icon für Variablen-Panel (zwischen K und H)
        variablesIcon = document.createElement('div');
        variablesIcon.className = 'gutter-variables-icon';
        variablesIcon.textContent = 'Ⓥ';
        variablesIcon.style.fontSize = '14px';
        variablesIcon.style.lineHeight = '1';
        variablesIcon.style.cursor = 'pointer';
        variablesIcon.style.pointerEvents = 'auto';
        variablesIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
        variablesIcon.style.color = '#333';
        variablesIcon.style.borderRadius = '2px';
        variablesIcon.style.padding = '2px';
        variablesIcon.style.textAlign = 'center';
        variablesIcon.style.minWidth = '18px';
        variablesIcon.title = 'Variablen';

        variablesIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            switchToPanel('variables');
        });

        // S-Icon für Snippets-Panel (zwischen V und H)
        snippetsIcon = document.createElement('div');
        snippetsIcon.className = 'gutter-snippets-icon';
        snippetsIcon.textContent = 'Ⓢ';
        snippetsIcon.style.fontSize = '14px';
        snippetsIcon.style.lineHeight = '1';
        snippetsIcon.style.cursor = 'pointer';
        snippetsIcon.style.pointerEvents = 'auto';
        snippetsIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
        snippetsIcon.style.color = '#333';
        snippetsIcon.style.borderRadius = '2px';
        snippetsIcon.style.padding = '2px';
        snippetsIcon.style.textAlign = 'center';
        snippetsIcon.style.minWidth = '18px';
        snippetsIcon.title = 'Snippets';

        snippetsIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            switchToPanel('snippets');
        });

        // H-Icon für History-Panel
        historyIcon = document.createElement('div');
        historyIcon.className = 'gutter-history-icon';
        historyIcon.textContent = 'Ⓗ';
        historyIcon.style.fontSize = '14px';
        historyIcon.style.lineHeight = '1';
        historyIcon.style.cursor = 'pointer';
        historyIcon.style.pointerEvents = 'auto';
        historyIcon.style.backgroundColor = '#0d6efd';
        historyIcon.style.color = '#fff';
        historyIcon.style.borderRadius = '2px';
        historyIcon.style.padding = '2px';
        historyIcon.style.textAlign = 'center';
        historyIcon.style.minWidth = '18px';
        historyIcon.title = 'History';

        historyIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            switchToPanel('history');
        });

        // Warnings-Icon für Warnungen/Fehler-Panel
        warningsIcon = document.createElement('div');
        warningsIcon.className = 'gutter-warnings-icon';
        warningsIcon.textContent = '⚠️';
        warningsIcon.style.fontSize = '12px';
        warningsIcon.style.lineHeight = '1';
        warningsIcon.style.cursor = 'pointer';
        warningsIcon.style.pointerEvents = 'auto';
        warningsIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
        warningsIcon.style.color = '#333';
        warningsIcon.style.borderRadius = '2px';
        warningsIcon.style.padding = '2px';
        warningsIcon.style.textAlign = 'center';
        warningsIcon.style.minWidth = '18px';
        warningsIcon.style.opacity = '0.4'; // Ausgegraut per default (deaktiviert)
        warningsIcon.title = 'Warnungen/Fehler (deaktiviert)';

        warningsIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Immer zum Panel wechseln können
            switchToPanel('warnings');
        });

        // Config-Icon für Einstellungen
        configIcon = document.createElement('div');
        configIcon.className = 'gutter-config-icon';
        configIcon.textContent = '⚙️';
        configIcon.style.fontSize = '12px';
        configIcon.style.lineHeight = '1';
        configIcon.style.cursor = 'pointer';
        configIcon.style.pointerEvents = 'auto';
        configIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
        configIcon.style.color = '#333';
        configIcon.style.borderRadius = '2px';
        configIcon.style.padding = '2px';
        configIcon.style.textAlign = 'center';
        configIcon.style.minWidth = '18px';
        configIcon.title = 'Konfiguration';

        configIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openConfigPanel();
        });

        iconContainer.appendChild(historyIcon);
        iconContainer.appendChild(gutterIcon);
        iconContainer.appendChild(variablesIcon);
        iconContainer.appendChild(snippetsIcon);
        iconContainer.appendChild(warningsIcon);
        iconContainer.appendChild(configIcon);

        // Icons direkt im ace-editor platzieren
        aceEditorEl.style.position = 'relative';
        aceEditorEl.appendChild(iconContainer);
    }

    function switchToPanel(panelType) {
        if (activePanel === panelType) return;

        // Prüfen ob ungespeicherte Snippet-Änderungen vorhanden sind
        if (!checkSnippetEditorUnsavedChanges()) {
            return; // Abbruch wenn Benutzer abbricht
        }

        activePanel = panelType;

        // History-Preview schließen beim Panel-Wechsel
        closeHistoryPreview();

        // Snippet-Editor schließen beim Panel-Wechsel
        closeSnippetEditor();

        // Icon-Styles aktualisieren
        if (gutterIcon && historyIcon && variablesIcon && snippetsIcon && warningsIcon) {
            // Alle Icons erstmal auf inaktiv setzen
            gutterIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
            gutterIcon.style.color = '#333';
            variablesIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
            variablesIcon.style.color = '#333';
            snippetsIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
            snippetsIcon.style.color = '#333';
            historyIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
            historyIcon.style.color = '#333';

            // Aktives Icon hervorheben
            if (panelType === 'key') {
                gutterIcon.style.backgroundColor = '#0d6efd';
                gutterIcon.style.color = '#fff';
            } else if (panelType === 'variables') {
                variablesIcon.style.backgroundColor = '#0d6efd';
                variablesIcon.style.color = '#fff';
            } else if (panelType === 'snippets') {
                snippetsIcon.style.backgroundColor = '#0d6efd';
                snippetsIcon.style.color = '#fff';
            } else if (panelType === 'history') {
                historyIcon.style.backgroundColor = '#0d6efd';
                historyIcon.style.color = '#fff';
            } else if (panelType === 'warnings') {
                warningsIcon.style.backgroundColor = '#0d6efd';
                warningsIcon.style.color = '#fff';
            }

            // Warnings-Icon auf normalen Zustand zurücksetzen wenn nicht aktiv
            if (panelType !== 'warnings') {
                updateWarningsIcon();
            }
        }

        // Variablen-Panel erstellen falls noch nicht vorhanden
        if (panelType === 'variables' && !variablesPanel) {
            openVariablesPanel();
        }

        // Snippets-Panel erstellen falls noch nicht vorhanden
        if (panelType === 'snippets' && !snippetsPanel) {
            openSnippetsPanel();
        }

        // Warnings-Panel erstellen falls noch nicht vorhanden
        if (panelType === 'warnings' && !warningsPanel) {
            openWarningsPanel();
        }

        // Breite synchronisieren
        if (keyPanel) {
            keyPanel.style.width = sharedPanelWidth + 'px';
        }
        if (variablesPanel) {
            variablesPanel.style.width = sharedPanelWidth + 'px';
        }
        if (snippetsPanel) {
            snippetsPanel.style.width = sharedPanelWidth + 'px';
        }
        if (historyPanel) {
            historyPanel.style.width = sharedPanelWidth + 'px';
        }
        if (warningsPanel) {
            warningsPanel.style.width = sharedPanelWidth + 'px';
        }

        // Höhe synchronisieren
        if (sharedHeight) {
            if (keyPanel) {
                keyPanel.style.height = sharedHeight + 'px';
            }
            if (variablesPanel) {
                variablesPanel.style.height = sharedHeight + 'px';
            }
            if (snippetsPanel) {
                snippetsPanel.style.height = sharedHeight + 'px';
            }
            if (historyPanel) {
                historyPanel.style.height = sharedHeight + 'px';
            }
            if (warningsPanel) {
                warningsPanel.style.height = sharedHeight + 'px';
            }
        }

        // Panels ein-/ausblenden
        if (keyPanel) {
            keyPanel.style.display = panelType === 'key' ? 'flex' : 'none';
        }
        if (variablesPanel) {
            variablesPanel.style.display = panelType === 'variables' ? 'flex' : 'none';
        }
        if (snippetsPanel) {
            snippetsPanel.style.display = panelType === 'snippets' ? 'flex' : 'none';
        }
        if (historyPanel) {
            historyPanel.style.display = panelType === 'history' ? 'flex' : 'none';
        }
        if (warningsPanel) {
            warningsPanel.style.display = panelType === 'warnings' ? 'flex' : 'none';
        }
    }

    // ========================================================================
    // CONFIG-PANEL FÜR EINSTELLUNGEN
    // ========================================================================

    function openConfigPanel() {
        // Prüfen ob bereits ein Overlay existiert
        let existingOverlay = document.getElementById('config-panel-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
            return;
        }

        // Backdrop erstellen
        const backdrop = document.createElement('div');
        backdrop.id = 'config-panel-overlay';
        backdrop.style.position = 'fixed';
        backdrop.style.top = '0';
        backdrop.style.left = '0';
        backdrop.style.width = '100%';
        backdrop.style.height = '100%';
        backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        backdrop.style.display = 'flex';
        backdrop.style.justifyContent = 'center';
        backdrop.style.alignItems = 'center';
        backdrop.style.zIndex = '10000';

        // Panel erstellen
        const panel = document.createElement('div');
        panel.style.backgroundColor = '#fff';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        panel.style.width = '400px';
        panel.style.maxHeight = '80vh';
        panel.style.overflow = 'auto';

        // Header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '16px';
        header.style.borderBottom = '1px solid #e0e0e0';
        header.style.backgroundColor = '#f8f9fa';
        header.style.borderRadius = '8px 8px 0 0';

        const title = document.createElement('h5');
        title.textContent = 'Konfiguration';
        title.style.margin = '0';
        title.style.fontSize = '16px';
        title.style.fontWeight = 'bold';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'none';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '0';
        closeBtn.style.lineHeight = '1';
        closeBtn.addEventListener('click', () => backdrop.remove());

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Content
        const content = document.createElement('div');
        content.style.padding = '16px';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '16px';

        // Sektion: History
        const historySection = document.createElement('div');
        historySection.style.borderBottom = '1px solid #e0e0e0';
        historySection.style.paddingBottom = '16px';

        const historySectionTitle = document.createElement('h6');
        historySectionTitle.textContent = 'History';
        historySectionTitle.style.margin = '0 0 12px 0';
        historySectionTitle.style.fontSize = '14px';
        historySectionTitle.style.color = '#666';

        const deleteHistoryBtn = document.createElement('button');
        deleteHistoryBtn.className = 'btn btn-danger btn-sm';
        deleteHistoryBtn.textContent = 'History löschen';
        deleteHistoryBtn.style.width = '100%';
        deleteHistoryBtn.addEventListener('click', () => {
            if (confirm('Alle History-Einträge unwiderruflich löschen?')) {
                localStorage.removeItem(getHistoryStorageKey());
                renderHistoryEntries();
                closeHistoryPreview();
                alert('History wurde gelöscht.');
            }
        });

        historySection.appendChild(historySectionTitle);
        historySection.appendChild(deleteHistoryBtn);

        // Sektion: Export/Import
        const exportSection = document.createElement('div');

        const exportSectionTitle = document.createElement('h6');
        exportSectionTitle.textContent = 'Daten exportieren / importieren';
        exportSectionTitle.style.margin = '0 0 12px 0';
        exportSectionTitle.style.fontSize = '14px';
        exportSectionTitle.style.color = '#666';

        const buttonsRow = document.createElement('div');
        buttonsRow.style.display = 'flex';
        buttonsRow.style.gap = '8px';

        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn btn-primary btn-sm';
        exportBtn.textContent = 'Exportieren';
        exportBtn.style.flex = '1';
        exportBtn.addEventListener('click', () => {
            exportAllData();
        });

        const importBtn = document.createElement('button');
        importBtn.className = 'btn btn-secondary btn-sm';
        importBtn.textContent = 'Importieren';
        importBtn.style.flex = '1';
        importBtn.addEventListener('click', () => {
            importAllData();
        });

        buttonsRow.appendChild(exportBtn);
        buttonsRow.appendChild(importBtn);

        exportSection.appendChild(exportSectionTitle);
        exportSection.appendChild(buttonsRow);

        // Info-Text
        const infoText = document.createElement('p');
        infoText.textContent = 'Export enthält: History, Snippets, Panel-Einstellungen, Action-Variablen und alle weiteren Script-Einstellungen.';
        infoText.style.fontSize = '11px';
        infoText.style.color = '#888';
        infoText.style.margin = '8px 0 0 0';
        exportSection.appendChild(infoText);

        content.appendChild(historySection);
        content.appendChild(exportSection);

        panel.appendChild(header);
        panel.appendChild(content);
        backdrop.appendChild(panel);

        // Schließen bei Klick auf Backdrop
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.remove();
            }
        });

        document.body.appendChild(backdrop);
    }

    function exportAllData() {
        try {
            const exportData = {
                version: 1,
                exportDate: new Date().toISOString(),
                jobId: getJobId(),
                data: {}
            };

            // History (mit Job-ID-spezifischem Key)
            const history = localStorage.getItem(getHistoryStorageKey());
            if (history) exportData.data.history = JSON.parse(history);

            // Snippets
            const snippets = localStorage.getItem(SNIPPETS_STORAGE_KEY);
            if (snippets) exportData.data.snippets = JSON.parse(snippets);

            // Snippet-Buttons
            const snippetButtons = localStorage.getItem(SNIPPET_BUTTONS_STORAGE_KEY);
            if (snippetButtons) exportData.data.snippetButtons = JSON.parse(snippetButtons);

            // Action-Variablen
            const actionVars = localStorage.getItem(ACTION_VARIABLES_STORAGE_KEY);
            if (actionVars) exportData.data.actionVariables = JSON.parse(actionVars);

            // Action-Panel-Breite
            const actionPanelWidth = localStorage.getItem('ersetzer_action_panel_width');
            if (actionPanelWidth) exportData.data.actionPanelWidth = parseInt(actionPanelWidth, 10);

            // GM-Values (falls verfügbar)
            try {
                const quickButtons = GM_getValue('quickButtons', null);
                if (quickButtons) exportData.data.quickButtons = JSON.parse(quickButtons);

                const defaultRenderValue = GM_getValue('defaultRenderValue', null);
                if (defaultRenderValue !== null) exportData.data.defaultRenderValue = defaultRenderValue;
            } catch (e) {}

            // Als JSON-Datei herunterladen
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ersetzer-config-${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert('Export erfolgreich!');
        } catch (e) {
            console.error('Export-Fehler:', e);
            alert('Fehler beim Exportieren: ' + e.message);
        }
    }

    function importAllData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importData = JSON.parse(event.target.result);

                    if (!importData.data) {
                        alert('Ungültiges Dateiformat.');
                        return;
                    }

                    if (!confirm('Aktuelle Konfiguration überschreiben?')) {
                        return;
                    }

                    // History (mit Job-ID-spezifischem Key)
                    if (importData.data.history) {
                        localStorage.setItem(getHistoryStorageKey(), JSON.stringify(importData.data.history));
                    }

                    // Snippets
                    if (importData.data.snippets) {
                        localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(importData.data.snippets));
                    }

                    // Snippet-Buttons
                    if (importData.data.snippetButtons) {
                        localStorage.setItem(SNIPPET_BUTTONS_STORAGE_KEY, JSON.stringify(importData.data.snippetButtons));
                    }

                    // Action-Variablen
                    if (importData.data.actionVariables) {
                        localStorage.setItem(ACTION_VARIABLES_STORAGE_KEY, JSON.stringify(importData.data.actionVariables));
                        activeActionVariables = importData.data.actionVariables;
                    }

                    // Action-Panel-Breite
                    if (importData.data.actionPanelWidth) {
                        localStorage.setItem('ersetzer_action_panel_width', importData.data.actionPanelWidth);
                    }

                    // GM-Values
                    try {
                        if (importData.data.quickButtons) {
                            GM_setValue('quickButtons', JSON.stringify(importData.data.quickButtons));
                        }
                        if (importData.data.defaultRenderValue !== undefined) {
                            GM_setValue('defaultRenderValue', importData.data.defaultRenderValue);
                        }
                    } catch (e) {}

                    alert('Import erfolgreich! Die Seite wird neu geladen.');
                    location.reload();

                } catch (e) {
                    console.error('Import-Fehler:', e);
                    alert('Fehler beim Importieren: ' + e.message);
                }
            };

            reader.readAsText(file);
        });

        input.click();
    }

    // ========================================================================
    // WARNINGS/FEHLER-PANEL
    // ========================================================================

    function updateWarningsIcon() {
        if (!warningsIcon) return;

        const collectedCount = collectedWarnings.size;

        // Zähle auch Icons die noch nicht gesammelt wurden
        const allIcons = document.querySelectorAll('svg.bi-exclamation-triangle-fill');
        const totalIconCount = allIcons.length;
        const collectedIconCount = Array.from(allIcons).filter(icon => icon.dataset.warningCollected).length;

        // Icon ist aktiv wenn es entweder gesammelte Warnungen ODER vorhandene Icons gibt
        const hasWarnings = collectedCount > 0 || totalIconCount > 0;

        // Wenn Warnings-Panel aktiv ist, Icon blau lassen
        if (activePanel === 'warnings') {
            warningsIcon.style.opacity = '1';
            warningsIcon.style.cursor = 'pointer';
            warningsIcon.style.backgroundColor = '#0d6efd';
            warningsIcon.style.color = '#fff';

            if (!warningsEnabled) {
                warningsIcon.title = 'Warnungen/Fehler (deaktiviert)';
            } else if (collectedIconCount < totalIconCount) {
                warningsIcon.title = `Warnungen/Fehler (${collectedIconCount}/${totalIconCount} wird gesammelt...)`;
            } else if (collectedCount > 0) {
                warningsIcon.title = `Warnungen/Fehler (${collectedCount})`;
            } else if (totalIconCount > 0) {
                warningsIcon.title = `Warnungen/Fehler (${totalIconCount})`;
            } else {
                warningsIcon.title = 'Warnungen/Fehler (keine)';
            }
        } else if (warningsEnabled && hasWarnings) {
            // Nur rot aufleuchten wenn warningsEnabled UND Warnungen vorhanden
            warningsIcon.style.opacity = '1';
            warningsIcon.style.cursor = 'pointer';
            warningsIcon.style.backgroundColor = '#dc3545';
            warningsIcon.style.color = '#fff';

            if (collectedIconCount < totalIconCount) {
                warningsIcon.title = `Warnungen/Fehler (${collectedIconCount}/${totalIconCount} wird gesammelt...)`;
            } else if (collectedCount > 0) {
                warningsIcon.title = `Warnungen/Fehler (${collectedCount})`;
            } else {
                warningsIcon.title = `Warnungen/Fehler (${totalIconCount})`;
            }
        } else {
            // Inaktiv/ausgegraut
            warningsIcon.style.opacity = '0.4';
            warningsIcon.style.cursor = 'pointer';
            warningsIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
            warningsIcon.style.color = '#333';
            warningsIcon.title = warningsEnabled ? 'Warnungen/Fehler (keine)' : 'Warnungen/Fehler (deaktiviert)';
        }
    }

    function collectWarningOrError(message, type) {
        // Nicht sammeln wenn deaktiviert
        if (!warningsEnabled) return;

        // type: 'error' oder 'warning'
        if (!message) return;

        const key = message.trim();

        // Debounce: Verhindere Mehrfach-Sammlung innerhalb von 500ms für gleiche Nachricht
        const now = Date.now();
        const lastCollectTime = collectWarningOrError._lastCollect || {};
        if (lastCollectTime[key] && (now - lastCollectTime[key]) < 500) {
            return; // Ignoriere wenn kürzlich gesammelt
        }
        lastCollectTime[key] = now;
        collectWarningOrError._lastCollect = lastCollectTime;

        if (collectedWarnings.has(key)) {
            const entry = collectedWarnings.get(key);
            entry.count++;
        } else {
            collectedWarnings.set(key, { type: type, count: 1 });
        }

        updateWarningsIcon();
        renderWarningsPanel();
    }

    function renderWarningsPanel() {
        if (!warningsPanel) return;

        const listContainer = warningsPanel.querySelector('.warnings-list');
        if (!listContainer) return;

        // Panel-Zustand aktualisieren
        updateWarningsPanelState();

        listContainer.innerHTML = '';

        // Wenn deaktiviert, zeige Hinweis
        if (!warningsEnabled) {
            const disabledMsg = document.createElement('div');
            disabledMsg.style.padding = '12px';
            disabledMsg.style.color = '#999';
            disabledMsg.style.fontSize = '12px';
            disabledMsg.style.textAlign = 'center';
            disabledMsg.innerHTML = 'Warnungs-Sammlung deaktiviert.<br><em style="font-size:10px;">Toggle aktivieren um Warnungen zu sammeln.</em>';
            listContainer.appendChild(disabledMsg);
            return;
        }

        // Zähle vorhandene Icons
        const allIcons = document.querySelectorAll('svg.bi-exclamation-triangle-fill');
        const totalCount = allIcons.length;
        const collectedCount = Array.from(allIcons).filter(icon => icon.dataset.warningCollected).length;
        const uncollectedCount = totalCount - collectedCount;

        if (collectedWarnings.size === 0 && totalCount === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.padding = '12px';
            emptyMsg.style.color = '#666';
            emptyMsg.style.fontSize = '12px';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.textContent = 'Keine Warnungen oder Fehler';
            listContainer.appendChild(emptyMsg);
            return;
        }

        // Zeige Fortschrittsbalken wenn noch Icons gesammelt werden
        if (uncollectedCount > 0 && totalCount > 0) {
            const progressContainer = document.createElement('div');
            progressContainer.style.padding = '8px 10px';
            progressContainer.style.backgroundColor = '#f8f9fa';
            progressContainer.style.borderBottom = '1px solid #dee2e6';

            // Fortschrittsbalken
            const progressBar = document.createElement('div');
            progressBar.style.width = '100%';
            progressBar.style.height = '6px';
            progressBar.style.backgroundColor = '#e9ecef';
            progressBar.style.borderRadius = '3px';
            progressBar.style.overflow = 'hidden';

            const progressFill = document.createElement('div');
            const percent = totalCount > 0 ? Math.round((collectedCount / totalCount) * 100) : 0;
            progressFill.style.width = percent + '%';
            progressFill.style.height = '100%';
            progressFill.style.backgroundColor = '#0d6efd';
            progressFill.style.transition = 'width 0.2s ease';
            progressBar.appendChild(progressFill);

            // Status-Text
            const statusText = document.createElement('div');
            statusText.style.fontSize = '10px';
            statusText.style.color = '#666';
            statusText.style.marginTop = '4px';
            statusText.style.textAlign = 'center';
            statusText.textContent = `Sammle: ${collectedCount}/${totalCount}`;

            progressContainer.appendChild(progressBar);
            progressContainer.appendChild(statusText);
            listContainer.appendChild(progressContainer);
        }

        collectedWarnings.forEach((data, message) => {
            const item = document.createElement('div');
            item.style.padding = '8px 10px';
            item.style.borderBottom = '1px solid #eee';
            item.style.display = 'flex';
            item.style.alignItems = 'flex-start';
            item.style.gap = '8px';
            item.style.cursor = 'pointer';

            // Icon
            const icon = document.createElement('span');
            icon.style.flexShrink = '0';
            icon.style.fontSize = '14px';
            if (data.type === 'error') {
                icon.textContent = '🔴';
                icon.title = 'Fehler';
            } else {
                icon.textContent = '🟡';
                icon.title = 'Warnung';
            }

            // Message container
            const msgContainer = document.createElement('div');
            msgContainer.style.flex = '1';
            msgContainer.style.minWidth = '0';

            // Message text
            const msgText = document.createElement('div');
            msgText.style.fontSize = '11px';
            msgText.style.fontFamily = 'monospace';
            msgText.style.wordBreak = 'break-word';
            msgText.style.whiteSpace = 'pre-wrap';
            msgText.textContent = message;

            // Count badge
            if (data.count > 1) {
                const countBadge = document.createElement('span');
                countBadge.style.fontSize = '10px';
                countBadge.style.color = '#666';
                countBadge.style.marginLeft = '6px';
                countBadge.textContent = `(${data.count}×)`;
                msgText.appendChild(countBadge);
            }

            msgContainer.appendChild(msgText);

            item.appendChild(icon);
            item.appendChild(msgContainer);

            // Hover effect
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f5f5f5';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = '';
            });

            // Click to copy
            item.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(message);
                    item.style.backgroundColor = '#d4edda';
                    setTimeout(() => {
                        item.style.backgroundColor = '';
                    }, 500);
                } catch (e) {
                    // Ignore
                }
            });

            item.title = 'Klicken zum Kopieren';

            listContainer.appendChild(item);
        });
    }

    function openWarningsPanel() {
        // Prüfen ob Warnings-Panel bereits existiert
        if (warningsPanel || document.querySelector('.warnings-panel')) return;

        const aceEditorContainer = document.querySelector('#ace-editor');
        if (!aceEditorContainer) return;

        const wrapper = document.querySelector('.ace-editor-wrapper');
        if (!wrapper) return;

        // sharedHeight initialisieren falls noch nicht gesetzt
        const DEFAULT_MIN_HEIGHT = 300;
        if (!sharedHeight) {
            const currentHeight = aceEditorContainer.offsetHeight;
            sharedHeight = Math.max(currentHeight, DEFAULT_MIN_HEIGHT);
            if (currentHeight < DEFAULT_MIN_HEIGHT) {
                aceEditorContainer.style.height = DEFAULT_MIN_HEIGHT + 'px';
            }
        }

        warningsPanel = document.createElement('div');
        warningsPanel.className = 'warnings-panel';
        warningsPanel.style.display = 'flex';
        warningsPanel.style.flexDirection = 'column';
        warningsPanel.style.border = '1px solid #ccc';
        warningsPanel.style.borderRadius = '4px';
        warningsPanel.style.backgroundColor = '#fff';
        warningsPanel.style.minWidth = '120px';
        warningsPanel.style.width = sharedPanelWidth + 'px';
        warningsPanel.style.height = (sharedHeight || aceEditorContainer.offsetHeight) + 'px';
        warningsPanel.style.marginTop = '24px';
        warningsPanel.style.order = '-1';
        warningsPanel.style.position = 'relative';
        warningsPanel.style.flexShrink = '0';

        // Resize-Handle rechts für Warnings-Panel
        const warningsResizeHandle = document.createElement('div');
        warningsResizeHandle.className = 'panel-resize-handle';
        warningsResizeHandle.style.position = 'absolute';
        warningsResizeHandle.style.top = '0';
        warningsResizeHandle.style.right = '0';
        warningsResizeHandle.style.width = '5px';
        warningsResizeHandle.style.height = '100%';
        warningsResizeHandle.style.cursor = 'ew-resize';
        warningsResizeHandle.style.backgroundColor = 'transparent';
        warningsResizeHandle.style.zIndex = '10';

        warningsResizeHandle.addEventListener('mouseenter', () => {
            warningsResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        warningsResizeHandle.addEventListener('mouseleave', () => {
            if (!warningsResizeHandle.dataset.resizing) {
                warningsResizeHandle.style.backgroundColor = 'transparent';
            }
        });

        warningsResizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            warningsResizeHandle.dataset.resizing = 'true';
            const startX = e.clientX;
            const startWidth = warningsPanel.offsetWidth;

            const onMouseMove = (e) => {
                const delta = e.clientX - startX;
                const newWidth = Math.max(120, startWidth + delta);
                sharedPanelWidth = newWidth;
                warningsPanel.style.width = newWidth + 'px';
                if (keyPanel) {
                    keyPanel.style.width = newWidth + 'px';
                }
                if (historyPanel) {
                    historyPanel.style.width = newWidth + 'px';
                }
                if (variablesPanel) {
                    variablesPanel.style.width = newWidth + 'px';
                }
                if (snippetsPanel) {
                    snippetsPanel.style.width = newWidth + 'px';
                }
                if (previewContainer) {
                    previewContainer.style.width = (newWidth * 2) + 'px';
                }
                if (snippetEditorContainer) {
                    snippetEditorContainer.style.width = (newWidth * 2) + 'px';
                }
            };

            const onMouseUp = () => {
                delete warningsResizeHandle.dataset.resizing;
                warningsResizeHandle.style.backgroundColor = 'transparent';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        warningsPanel.appendChild(warningsResizeHandle);

        // Header
        const header = document.createElement('div');
        header.className = 'warnings-header';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '6px 10px';
        header.style.borderBottom = '1px solid #ccc';
        header.style.backgroundColor = '#f8f9fa';
        header.style.flexShrink = '0';

        // Container für Toggle und Titel
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.alignItems = 'center';
        titleContainer.style.gap = '8px';

        // Toggle-Slider
        const toggleLabel = document.createElement('label');
        toggleLabel.style.position = 'relative';
        toggleLabel.style.display = 'inline-block';
        toggleLabel.style.width = '32px';
        toggleLabel.style.height = '18px';
        toggleLabel.style.cursor = 'pointer';
        toggleLabel.style.flexShrink = '0';

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = warningsEnabled;
        toggleInput.style.opacity = '0';
        toggleInput.style.width = '0';
        toggleInput.style.height = '0';

        const toggleSlider = document.createElement('span');
        toggleSlider.style.position = 'absolute';
        toggleSlider.style.cursor = 'pointer';
        toggleSlider.style.top = '0';
        toggleSlider.style.left = '0';
        toggleSlider.style.right = '0';
        toggleSlider.style.bottom = '0';
        toggleSlider.style.backgroundColor = warningsEnabled ? '#0d6efd' : '#ccc';
        toggleSlider.style.transition = '0.2s';
        toggleSlider.style.borderRadius = '18px';

        const toggleKnob = document.createElement('span');
        toggleKnob.style.position = 'absolute';
        toggleKnob.style.content = '""';
        toggleKnob.style.height = '14px';
        toggleKnob.style.width = '14px';
        toggleKnob.style.left = warningsEnabled ? '16px' : '2px';
        toggleKnob.style.bottom = '2px';
        toggleKnob.style.backgroundColor = 'white';
        toggleKnob.style.transition = '0.2s';
        toggleKnob.style.borderRadius = '50%';
        toggleSlider.appendChild(toggleKnob);

        toggleLabel.appendChild(toggleInput);
        toggleLabel.appendChild(toggleSlider);

        // Toggle-Event
        toggleInput.addEventListener('change', () => {
            warningsEnabled = toggleInput.checked;
            toggleSlider.style.backgroundColor = warningsEnabled ? '#0d6efd' : '#ccc';
            toggleKnob.style.left = warningsEnabled ? '16px' : '2px';

            // Panel-Darstellung aktualisieren
            updateWarningsPanelState();
            updateWarningsIcon();

            // Wenn aktiviert, starte Sammlung
            if (warningsEnabled) {
                silentCollectAllWarnings(false);
            }
        });

        titleContainer.appendChild(toggleLabel);

        const headerTitle = document.createElement('span');
        headerTitle.textContent = 'Warnungen/Fehler';
        headerTitle.style.fontWeight = 'bold';
        headerTitle.style.fontSize = '12px';
        titleContainer.appendChild(headerTitle);

        // Button-Container für Kopieren und Leeren
        const btnContainer = document.createElement('div');
        btnContainer.className = 'warnings-btn-container';
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '4px';

        // Kopieren-Button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Kopieren';
        copyBtn.className = 'btn btn-sm btn-outline-primary warnings-copy-btn';
        copyBtn.style.fontSize = '10px';
        copyBtn.style.padding = '2px 6px';
        copyBtn.addEventListener('click', async () => {
            if (collectedWarnings.size === 0 || !warningsEnabled) return;

            // Alle Meldungen sammeln
            const messages = [];
            collectedWarnings.forEach((data, message) => {
                const prefix = data.type === 'error' ? '[FEHLER]' : '[WARNUNG]';
                // Newlines durch Leerzeichen ersetzen
                const cleanMessage = message.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
                messages.push(`${prefix} ${cleanMessage}`);
            });

            const text = messages.join('\n');
            const success = await copyToClipboard(text);

            if (success) {
                // Kurze visuelle Bestätigung
                const origText = copyBtn.textContent;
                copyBtn.textContent = '✓ Kopiert';
                setTimeout(() => {
                    copyBtn.textContent = origText;
                }, 1500);
            }
        });
        btnContainer.appendChild(copyBtn);

        // Leeren-Button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Leeren';
        clearBtn.className = 'btn btn-sm btn-outline-secondary warnings-clear-btn';
        clearBtn.style.fontSize = '10px';
        clearBtn.style.padding = '2px 6px';
        clearBtn.addEventListener('click', () => {
            if (!warningsEnabled) return;
            collectedWarnings.clear();
            updateWarningsIcon();
            renderWarningsPanel();
        });
        btnContainer.appendChild(clearBtn);

        header.appendChild(titleContainer);
        header.appendChild(btnContainer);
        warningsPanel.appendChild(header);

        // Liste
        const listContainer = document.createElement('div');
        listContainer.className = 'warnings-list';
        listContainer.style.flex = '1';
        listContainer.style.overflowY = 'auto';
        listContainer.style.overflowX = 'hidden';
        warningsPanel.appendChild(listContainer);

        // Panel am Anfang des Wrappers einfügen
        wrapper.insertBefore(warningsPanel, wrapper.firstChild);

        // Initial Panel-Zustand setzen
        updateWarningsPanelState();

        // Initial rendern
        renderWarningsPanel();
    }

    // Aktualisiert den visuellen Zustand des Warnings-Panels basierend auf warningsEnabled
    function updateWarningsPanelState() {
        if (!warningsPanel) return;

        const listContainer = warningsPanel.querySelector('.warnings-list');
        const copyBtn = warningsPanel.querySelector('.warnings-copy-btn');
        const clearBtn = warningsPanel.querySelector('.warnings-clear-btn');

        if (warningsEnabled) {
            // Aktiviert
            if (listContainer) {
                listContainer.style.opacity = '1';
            }
            if (copyBtn) {
                copyBtn.disabled = collectedWarnings.size === 0;
                copyBtn.style.opacity = collectedWarnings.size === 0 ? '0.5' : '1';
                copyBtn.style.cursor = collectedWarnings.size === 0 ? 'default' : 'pointer';
            }
            if (clearBtn) {
                clearBtn.disabled = false;
                clearBtn.style.opacity = '1';
                clearBtn.style.cursor = 'pointer';
            }
        } else {
            // Deaktiviert - Panel ausgegraut
            if (listContainer) {
                listContainer.style.opacity = '0.5';
            }
            if (copyBtn) {
                copyBtn.disabled = true;
                copyBtn.style.opacity = '0.5';
                copyBtn.style.cursor = 'default';
            }
            if (clearBtn) {
                clearBtn.disabled = true;
                clearBtn.style.opacity = '0.5';
                clearBtn.style.cursor = 'default';
            }
        }
    }

    function openVariablesPanel() {
        // Prüfen ob Variablen-Panel bereits existiert
        if (variablesPanel || document.querySelector('.variables-panel')) return;

        const aceEditorContainer = document.querySelector('#ace-editor');
        if (!aceEditorContainer) return;

        const wrapper = document.querySelector('.ace-editor-wrapper');
        if (!wrapper) return;

        // sharedHeight initialisieren falls noch nicht gesetzt (mindestens 300px)
        const DEFAULT_MIN_HEIGHT = 300;
        if (!sharedHeight) {
            const currentHeight = aceEditorContainer.offsetHeight;
            sharedHeight = Math.max(currentHeight, DEFAULT_MIN_HEIGHT);
            if (currentHeight < DEFAULT_MIN_HEIGHT) {
                aceEditorContainer.style.height = DEFAULT_MIN_HEIGHT + 'px';
            }
        }

        variablesPanel = document.createElement('div');
        variablesPanel.className = 'variables-panel';
        variablesPanel.style.display = 'flex';
        variablesPanel.style.flexDirection = 'column';
        variablesPanel.style.border = '1px solid #ccc';
        variablesPanel.style.borderRadius = '4px';
        variablesPanel.style.backgroundColor = '#fff';
        variablesPanel.style.minWidth = '120px';
        variablesPanel.style.width = sharedPanelWidth + 'px';
        variablesPanel.style.height = (sharedHeight || aceEditorContainer.offsetHeight) + 'px';
        variablesPanel.style.marginTop = '24px';
        variablesPanel.style.order = '-1'; // Links vom Editor
        variablesPanel.style.position = 'relative';
        variablesPanel.style.flexShrink = '0';

        // Resize-Handle rechts
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'panel-resize-handle';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.top = '0';
        resizeHandle.style.right = '0';
        resizeHandle.style.width = '5px';
        resizeHandle.style.height = '100%';
        resizeHandle.style.cursor = 'ew-resize';
        resizeHandle.style.backgroundColor = 'transparent';
        resizeHandle.style.zIndex = '10';

        resizeHandle.addEventListener('mouseenter', () => {
            resizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        resizeHandle.addEventListener('mouseleave', () => {
            if (!resizeHandle.dataset.dragging) {
                resizeHandle.style.backgroundColor = 'transparent';
            }
        });

        let startX, startWidth;

        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX;
            startWidth = variablesPanel.offsetWidth;
            resizeHandle.dataset.dragging = 'true';
            resizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
            isManualResizing = true;

            const onMouseMove = (e) => {
                const diff = e.clientX - startX;
                const newWidth = Math.max(120, startWidth + diff);
                sharedPanelWidth = newWidth;
                variablesPanel.style.width = newWidth + 'px';
                if (keyPanel) {
                    keyPanel.style.width = newWidth + 'px';
                }
                if (historyPanel) {
                    historyPanel.style.width = newWidth + 'px';
                }
                if (snippetsPanel) {
                    snippetsPanel.style.width = newWidth + 'px';
                }
                if (warningsPanel) {
                    warningsPanel.style.width = newWidth + 'px';
                }
                if (previewContainer) {
                    previewContainer.style.width = (newWidth * 2) + 'px';
                }
                if (snippetEditorContainer) {
                    snippetEditorContainer.style.width = (newWidth * 2) + 'px';
                }
                // Snippet-Buttons Container Position aktualisieren
                updateSnippetButtonsContainerPosition();
                // Höhe beibehalten
                if (sharedHeight) {
                    variablesPanel.style.height = sharedHeight + 'px';
                    if (keyPanel) {
                        keyPanel.style.height = sharedHeight + 'px';
                    }
                    if (historyPanel) {
                        historyPanel.style.height = sharedHeight + 'px';
                    }
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                delete resizeHandle.dataset.dragging;
                resizeHandle.style.backgroundColor = 'transparent';
                isManualResizing = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        variablesPanel.appendChild(resizeHandle);

        // Vertikaler Resize-Handle unten
        const verticalResizeHandle = document.createElement('div');
        verticalResizeHandle.className = 'panel-vertical-resize-handle';
        verticalResizeHandle.style.position = 'absolute';
        verticalResizeHandle.style.bottom = '0';
        verticalResizeHandle.style.left = '0';
        verticalResizeHandle.style.width = '100%';
        verticalResizeHandle.style.height = '5px';
        verticalResizeHandle.style.cursor = 'ns-resize';
        verticalResizeHandle.style.backgroundColor = 'transparent';
        verticalResizeHandle.style.zIndex = '10';

        verticalResizeHandle.addEventListener('mouseenter', () => {
            verticalResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        verticalResizeHandle.addEventListener('mouseleave', () => {
            if (!verticalResizeHandle.dataset.dragging) {
                verticalResizeHandle.style.backgroundColor = 'transparent';
            }
        });

        let vStartY, vStartHeight;

        verticalResizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            vStartY = e.clientY;
            vStartHeight = variablesPanel.offsetHeight;
            verticalResizeHandle.dataset.dragging = 'true';
            verticalResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
            isManualResizing = true;

            const onMouseMove = (e) => {
                const diff = e.clientY - vStartY;
                const newHeight = Math.max(100, vStartHeight + diff);
                syncHeight(newHeight);
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                delete verticalResizeHandle.dataset.dragging;
                verticalResizeHandle.style.backgroundColor = 'transparent';
                isManualResizing = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        variablesPanel.appendChild(verticalResizeHandle);

        // Suchfeld statt Header
        const searchContainer = document.createElement('div');
        searchContainer.className = 'variables-search';
        searchContainer.style.padding = '6px';
        searchContainer.style.borderBottom = '1px solid #ccc';
        searchContainer.style.backgroundColor = '#f8f9fa';
        searchContainer.style.display = 'flex';
        searchContainer.style.gap = '8px';
        searchContainer.style.alignItems = 'center';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Variablen suchen...';
        searchInput.className = 'form-control form-control-sm';
        searchInput.style.flex = '1';
        searchInput.style.fontSize = '11px';

        // Checkbox für read-only Filter
        const readOnlyFilterLabel = document.createElement('label');
        readOnlyFilterLabel.style.display = 'flex';
        readOnlyFilterLabel.style.alignItems = 'center';
        readOnlyFilterLabel.style.gap = '3px';
        readOnlyFilterLabel.style.fontSize = '10px';
        readOnlyFilterLabel.style.whiteSpace = 'nowrap';
        readOnlyFilterLabel.style.cursor = 'pointer';
        readOnlyFilterLabel.style.userSelect = 'none';

        const readOnlyFilterCheckbox = document.createElement('input');
        readOnlyFilterCheckbox.type = 'checkbox';
        readOnlyFilterCheckbox.checked = true; // Default aktiv
        readOnlyFilterCheckbox.style.margin = '0';
        readOnlyFilterCheckbox.style.cursor = 'pointer';

        readOnlyFilterLabel.appendChild(readOnlyFilterCheckbox);
        readOnlyFilterLabel.appendChild(document.createTextNode('ohne read-only'));

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(readOnlyFilterLabel);
        variablesPanel.appendChild(searchContainer);

        // Liste
        const listContainer = document.createElement('div');
        listContainer.className = 'variables-list';
        listContainer.style.flex = '1';
        listContainer.style.overflowY = 'auto';
        listContainer.style.overflowX = 'hidden';

        // Funktion zum Highlighten von Text
        function highlightText(text, searchTerms) {
            if (!searchTerms || searchTerms.length === 0) return text;

            let result = text;
            searchTerms.forEach(term => {
                if (term && !term.startsWith('-')) {
                    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                    result = result.replace(regex, '<span style="background-color:#EF0FFF;color:#fff;">$1</span>');
                }
            });
            return result;
        }

        // Funktion zum Filtern und Rendern der Variablen
        function renderVariables(searchValue) {
            // Cleanup: Entferne alle offenen Custom-Tooltips
            document.querySelectorAll('.variable-custom-tooltip').forEach(t => t.remove());

            listContainer.innerHTML = '';

            // Read-only Filter Status
            const hideReadOnly = readOnlyFilterCheckbox.checked;

            // Suchbegriffe parsen
            const terms = searchValue.trim().split(/\s+/).filter(t => t);
            const includeTerms = terms.filter(t => !t.startsWith('-')).map(t => t.toLowerCase());
            const excludeTerms = terms.filter(t => t.startsWith('-')).map(t => t.substring(1).toLowerCase()).filter(t => t);

            const filteredVariables = availableVariables.filter(varObj => {
                const varLower = varObj.name.toLowerCase();

                // Read-only Filter
                if (hideReadOnly && varObj.readOnly) {
                    return false;
                }

                // Prüfen ob ausgeschlossen
                for (const excl of excludeTerms) {
                    if (varLower.includes(excl)) {
                        return false;
                    }
                }

                // Wenn keine Include-Terms, alle anzeigen (außer ausgeschlossene)
                if (includeTerms.length === 0) {
                    return true;
                }

                // Prüfen ob mindestens ein Include-Term passt
                for (const incl of includeTerms) {
                    if (varLower.includes(incl)) {
                        return true;
                    }
                }

                return false;
            });

            if (filteredVariables.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.style.padding = '12px';
                emptyMsg.style.color = '#666';
                emptyMsg.style.fontSize = '12px';
                emptyMsg.style.textAlign = 'center';
                emptyMsg.textContent = searchValue ? 'Keine Treffer' : 'Keine Variablen gefunden';
                listContainer.appendChild(emptyMsg);
                return;
            }

            filteredVariables.forEach(varObj => {
                const varName = varObj.name;
                const isReadOnly = varObj.readOnly;
                const customTooltip = variableTooltips[varName];

                const item = document.createElement('div');
                item.className = 'variable-item';
                item.dataset.variableName = varName;
                item.title = varName + (isReadOnly ? ' (read-only)' : '');
                item.style.padding = '6px 8px';
                item.style.borderBottom = '1px solid #e0e0e0';
                item.style.cursor = 'pointer';
                item.style.fontSize = '12px';
                item.style.fontFamily = 'monospace';
                item.style.whiteSpace = 'nowrap';
                item.style.overflow = 'hidden';
                item.style.textOverflow = 'ellipsis';
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.alignItems = 'center';
                item.style.gap = '4px';

                // Linker Bereich: Variablenname + Info-Icon
                const leftContainer = document.createElement('div');
                leftContainer.style.display = 'flex';
                leftContainer.style.alignItems = 'center';
                leftContainer.style.gap = '4px';
                leftContainer.style.overflow = 'hidden';
                leftContainer.style.flex = '1';

                // Variablenname mit Highlighting
                const nameSpan = document.createElement('span');
                nameSpan.style.overflow = 'hidden';
                nameSpan.style.textOverflow = 'ellipsis';
                nameSpan.innerHTML = highlightText(varName, includeTerms);

                leftContainer.appendChild(nameSpan);

                // Info-Icon (ⓘ) nur bei Variablen mit speziellem Tooltip
                if (customTooltip) {
                    const infoIcon = document.createElement('span');
                    infoIcon.textContent = 'ⓘ';
                    infoIcon.style.cursor = 'pointer';
                    infoIcon.style.fontSize = '11px';
                    infoIcon.style.color = '#6c757d';
                    infoIcon.style.flexShrink = '0';
                    infoIcon.title = 'Info anzeigen';

                    // Tooltip bei Klick auf Info-Icon
                    infoIcon.addEventListener('click', (e) => {
                        e.stopPropagation(); // Verhindert das Einfügen der Variable

                        // Schließe alle anderen offenen Tooltips
                        document.querySelectorAll('.variable-custom-tooltip').forEach(t => t.remove());

                        // Tooltip erstellen
                        const tooltipEl = document.createElement('div');
                        tooltipEl.className = 'variable-custom-tooltip';
                        tooltipEl.innerHTML = customTooltip;
                        tooltipEl.style.position = 'fixed';
                        tooltipEl.style.padding = '6px 10px';
                        tooltipEl.style.backgroundColor = '#333';
                        tooltipEl.style.color = '#fff';
                        tooltipEl.style.fontSize = '11px';
                        tooltipEl.style.borderRadius = '4px';
                        tooltipEl.style.whiteSpace = 'nowrap';
                        tooltipEl.style.zIndex = '10000';
                        tooltipEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                        tooltipEl.style.opacity = '0';
                        document.body.appendChild(tooltipEl);

                        // Position berechnen nach dem Rendern
                        requestAnimationFrame(() => {
                            if (tooltipEl && tooltipEl.parentNode) {
                                const iconRect = infoIcon.getBoundingClientRect();
                                const tooltipRect = tooltipEl.getBoundingClientRect();

                                // Rechts vom Icon positionieren
                                let left = iconRect.right + 8;
                                let top = iconRect.top + iconRect.height / 2 - tooltipRect.height / 2;

                                // Prüfen ob Tooltip rechts aus dem Viewport ragt
                                if (left + tooltipRect.width > window.innerWidth - 10) {
                                    // Links vom Icon positionieren
                                    left = iconRect.left - tooltipRect.width - 8;
                                }

                                // Prüfen ob Tooltip oben/unten aus dem Viewport ragt
                                if (top < 10) top = 10;
                                if (top + tooltipRect.height > window.innerHeight - 10) {
                                    top = window.innerHeight - tooltipRect.height - 10;
                                }

                                tooltipEl.style.left = left + 'px';
                                tooltipEl.style.top = top + 'px';
                                tooltipEl.style.opacity = '1';
                            }
                        });

                        // Schließen bei Klick außerhalb
                        const closeHandler = (evt) => {
                            if (!tooltipEl.contains(evt.target) && evt.target !== infoIcon) {
                                if (tooltipEl.parentNode) {
                                    tooltipEl.parentNode.removeChild(tooltipEl);
                                }
                                document.removeEventListener('click', closeHandler);
                            }
                        };
                        // Verzögert hinzufügen, damit der aktuelle Klick nicht sofort schließt
                        setTimeout(() => {
                            document.addEventListener('click', closeHandler);
                        }, 0);
                    });

                    leftContainer.appendChild(infoIcon);
                }

                item.appendChild(leftContainer);

                // Buttons für nicht-read-only Variablen (rechts)
                if (!isReadOnly) {
                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.style.display = 'flex';
                    buttonsContainer.style.gap = '4px';
                    buttonsContainer.style.flexShrink = '0';

                    // Button "s///"
                    const substBtn = document.createElement('button');
                    substBtn.textContent = 's///';
                    substBtn.style.color = '#0d6efd';
                    substBtn.style.backgroundColor = '#fff';
                    substBtn.style.border = '1px solid #0d6efd';
                    substBtn.style.borderRadius = '3px';
                    substBtn.style.fontSize = '10px';
                    substBtn.style.padding = '1px 6px';
                    substBtn.style.cursor = 'pointer';
                    substBtn.style.fontWeight = 'normal';
                    substBtn.style.lineHeight = '1.2';
                    substBtn.style.fontFamily = 'monospace';
                    substBtn.title = `${varName} =~ s///; einfügen`;
                    substBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        insertTextWithNewlineLogic(`${varName} =~ s///;`);
                    });
                    substBtn.addEventListener('mouseenter', () => {
                        substBtn.style.backgroundColor = '#0d6efd';
                        substBtn.style.color = '#fff';
                    });
                    substBtn.addEventListener('mouseleave', () => {
                        substBtn.style.backgroundColor = '#fff';
                        substBtn.style.color = '#0d6efd';
                    });

                    // Button "''"
                    const assignBtn = document.createElement('button');
                    assignBtn.textContent = "''";
                    assignBtn.style.color = '#198754';
                    assignBtn.style.backgroundColor = '#fff';
                    assignBtn.style.border = '1px solid #198754';
                    assignBtn.style.borderRadius = '3px';
                    assignBtn.style.fontSize = '10px';
                    assignBtn.style.padding = '1px 6px';
                    assignBtn.style.cursor = 'pointer';
                    assignBtn.style.fontWeight = 'normal';
                    assignBtn.style.lineHeight = '1.2';
                    assignBtn.style.fontFamily = 'monospace';
                    assignBtn.title = `${varName} = ''; einfügen`;
                    assignBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        insertTextWithNewlineLogic(`${varName} = '';`);
                    });
                    assignBtn.addEventListener('mouseenter', () => {
                        assignBtn.style.backgroundColor = '#198754';
                        assignBtn.style.color = '#fff';
                    });
                    assignBtn.addEventListener('mouseleave', () => {
                        assignBtn.style.backgroundColor = '#fff';
                        assignBtn.style.color = '#198754';
                    });

                    buttonsContainer.appendChild(substBtn);
                    buttonsContainer.appendChild(assignBtn);

                    // Toggle-Button für Action-Panel (+/-)
                    const isActive = isActionVariableActive(varName);
                    const toggleBtn = document.createElement('button');
                    toggleBtn.textContent = isActive ? '−' : '+';
                    toggleBtn.style.color = isActive ? '#dc3545' : '#198754';
                    toggleBtn.style.backgroundColor = '#fff';
                    toggleBtn.style.border = `1px solid ${isActive ? '#dc3545' : '#198754'}`;
                    toggleBtn.style.borderRadius = '3px';
                    toggleBtn.style.fontSize = '12px';
                    toggleBtn.style.fontWeight = 'bold';
                    toggleBtn.style.padding = '1px 6px';
                    toggleBtn.style.cursor = 'pointer';
                    toggleBtn.style.lineHeight = '1.2';
                    toggleBtn.style.minWidth = '20px';
                    toggleBtn.title = isActive ? 'Aus Action-Panel entfernen' : 'Zum Action-Panel hinzufügen';
                    toggleBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleActionVariable(varName);
                        // Button-Zustand aktualisieren
                        const nowActive = isActionVariableActive(varName);
                        toggleBtn.textContent = nowActive ? '−' : '+';
                        toggleBtn.style.color = nowActive ? '#dc3545' : '#198754';
                        toggleBtn.style.border = `1px solid ${nowActive ? '#dc3545' : '#198754'}`;
                        toggleBtn.title = nowActive ? 'Aus Action-Panel entfernen' : 'Zum Action-Panel hinzufügen';
                    });
                    toggleBtn.addEventListener('mouseenter', () => {
                        const currentActive = isActionVariableActive(varName);
                        toggleBtn.style.backgroundColor = currentActive ? '#dc3545' : '#198754';
                        toggleBtn.style.color = '#fff';
                    });
                    toggleBtn.addEventListener('mouseleave', () => {
                        const currentActive = isActionVariableActive(varName);
                        toggleBtn.style.backgroundColor = '#fff';
                        toggleBtn.style.color = currentActive ? '#dc3545' : '#198754';
                    });

                    buttonsContainer.appendChild(toggleBtn);
                    item.appendChild(buttonsContainer);
                }

                // Read-only Label (rechts)
                if (isReadOnly) {
                    const readOnlyLabel = document.createElement('span');
                    readOnlyLabel.textContent = 'read-only';
                    readOnlyLabel.style.color = '#dc3545';
                    readOnlyLabel.style.fontSize = '10px';
                    readOnlyLabel.style.flexShrink = '0';
                    readOnlyLabel.style.width = '50px';
                    readOnlyLabel.style.textAlign = 'center';
                    item.appendChild(readOnlyLabel);
                }

                // Hover-Effekt für Item
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#f0f0f0';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = '';
                });

                // Klick auf Item fügt Variable ein
                item.addEventListener('click', () => {
                    insertVariableIntoAce(varName);
                });

                listContainer.appendChild(item);
            });
        }

        // Initial rendern
        renderVariables('');

        // Event Listener für Suche
        searchInput.addEventListener('input', (e) => {
            renderVariables(e.target.value);
        });

        // Enter verhindert Formular-Submit
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });

        // Event Listener für read-only Checkbox
        readOnlyFilterCheckbox.addEventListener('change', () => {
            renderVariables(searchInput.value);
        });

        variablesPanel.appendChild(listContainer);

        // Panel am Anfang des Wrappers einfügen (links)
        wrapper.insertBefore(variablesPanel, wrapper.firstChild);
    }

    function insertVariableIntoAce(variable) {
        try {
            // ACE global finden (auch für Userscript-Kontext)
            const aceGlobal = (typeof unsafeWindow !== 'undefined' && unsafeWindow.ace)
                ? unsafeWindow.ace
                : (typeof ace !== 'undefined' ? ace : null);

            if (aceGlobal && aceGlobal.edit) {
                const aceInstance = aceGlobal.edit('ace-editor');
                if (aceInstance) {
                    // Variable an Cursor-Position einfügen
                    aceInstance.insert(variable);
                    // Fokus auf Editor setzen
                    aceInstance.focus();
                }
            }
        } catch (e) {
            console.error('Fehler beim Einfügen der Variable:', e);
        }
    }

    // Text mit Zeilenumbruch-Logik einfügen (wie bei Felder-Dropdown)
    function insertTextWithNewlineLogic(text) {
        try {
            const aceGlobal = (typeof unsafeWindow !== 'undefined' && unsafeWindow.ace)
                ? unsafeWindow.ace
                : (typeof ace !== 'undefined' ? ace : null);

            if (aceGlobal && aceGlobal.edit) {
                const editor = aceGlobal.edit('ace-editor');
                if (editor) {
                    const cursorPos = editor.getCursorPosition();
                    const currentRow = cursorPos.row;
                    const currentLine = editor.session.getLine(currentRow);
                    const lineLength = currentLine.length;

                    if (lineLength === 0) {
                        // Wenn die aktuelle Zeile leer ist, direkt einfügen
                        editor.insert(text + '\n');
                    } else {
                        // Selektion aufheben und Cursor ans Ende der aktuellen Zeile setzen
                        editor.clearSelection();
                        editor.selection.moveTo(currentRow, lineLength);
                        // Neue Zeile einfügen und dann Text
                        editor.insert('\n' + text + '\n');
                    }
                    // Cursor in die neue leere Zeile bewegen (für schnelle Mehrfachklicks)
                    const newPos = editor.getCursorPosition();
                    editor.selection.moveTo(newPos.row, 0);
                    editor.focus();
                }
            }
        } catch (e) {
            console.error('Fehler beim Einfügen des Textes:', e);
        }
    }

    // ========================================================================
    // SNIPPETS-PANEL FUNKTIONEN
    // ========================================================================

    const SNIPPETS_STORAGE_KEY = 'ersetzer_snippets';

    // Standard-Snippets (nicht löschbar/bearbeitbar)
    const DEFAULT_SNIPPETS = [
        {
            id: 'default_ikw',
            title: 'ikw',
            content: `@ikw = ();                                  # Keywords entfernen
@ikw = ('foo','bar');                       # Keywords ersetzen
push @ikw, 'qux';                            # Keyword ergänzen
@ikw = grep { $_ ne 'qux' } @ikw;           # Keyword entfernen
@ikw = map { $_ eq 'qux' ? 'fux' : $_ } @ikw;  # Keyword ändern`,
            isDefault: true
        },
        {
            id: 'default_related',
            title: 'related',
            content: `@related = ();                                           # IDs entfernen
@related = ('12345','12346');                            # IDs ersetzen
push @related, '12347';                                  # ID ergänzen
@related = grep { $_ ne '12345' } @related;              # ID löschen
@related = map { $_ eq '12345' ? '12346' : $_ } @related;  # ID ändern`,
            isDefault: true
        },
        {
            id: 'default_value_array',
            title: 'value Array',
            content: `# Element ergänzen
push $value{KEY}->@*, 'blau';

# Element austauschen
$value{KEY}->@* = map { $_ eq 'rot' ? 'blau' : $_ } $value{KEY}->@*;

# Element entfernen
$value{KEY}->@* = grep { $_ ne 'rot' } $value{KEY}->@*;
delete $value{KEY} unless $value{KEY}->@*;

# Gesamten Inhalt ersetzen (alle bisherigen Elemente verwerfen)
$value{KEY} = [ 'blau', 'dunkel gelb' ];
$value{KEY} = [ qw( blau gelb ) ];`,
            isDefault: true
        },
        {
            id: 'default_mr_ausschluss',
            title: 'MR-Ausschluss',
            content: `my $exclusion_keyword = 'AUSSCHLUSS';

if ($matchrule =~ / \\-/) {
    $matchrule .= "|$exclusion_keyword";
} elsif ($matchrule =~ /./) {
    $matchrule .= " -$exclusion_keyword";
}

# danach ein neuer Run:
$matchrule_untested =~ s/.*//;`,
            isDefault: true
        }
    ];

    function getSnippets() {
        try {
            const stored = localStorage.getItem(SNIPPETS_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Fehler beim Laden der Snippets:', e);
            return [];
        }
    }

    function saveSnippetsToStorage(snippets) {
        try {
            localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(snippets));
        } catch (e) {
            console.error('Fehler beim Speichern der Snippets:', e);
        }
    }

    function generateSnippetId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // ========================================================================
    // SNIPPET-BUTTONS OBERHALB DES EDITORS
    // ========================================================================

    function getActiveSnippetButtons() {
        try {
            const stored = localStorage.getItem(SNIPPET_BUTTONS_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Fehler beim Laden der Snippet-Buttons:', e);
            return [];
        }
    }

    function saveActiveSnippetButtons(buttons) {
        try {
            localStorage.setItem(SNIPPET_BUTTONS_STORAGE_KEY, JSON.stringify(buttons));
        } catch (e) {
            console.error('Fehler beim Speichern der Snippet-Buttons:', e);
        }
    }

    function isSnippetButtonActive(snippetId) {
        const activeButtons = getActiveSnippetButtons();
        return activeButtons.some(b => b.id === snippetId);
    }

    function addSnippetButton(snippetId, snippetTitle, snippetContent) {
        let activeButtons = getActiveSnippetButtons();
        if (!activeButtons.some(b => b.id === snippetId)) {
            activeButtons.push({ id: snippetId, title: snippetTitle, content: snippetContent });
            saveActiveSnippetButtons(activeButtons);
            renderSnippetButtons();
        }
    }

    function removeSnippetButton(snippetId) {
        let activeButtons = getActiveSnippetButtons();
        activeButtons = activeButtons.filter(b => b.id !== snippetId);
        saveActiveSnippetButtons(activeButtons);
        renderSnippetButtons();
    }

    function updateSnippetButtonsContainerPosition() {
        if (!snippetButtonsContainer) return;
        // left = Panel-Breite + gap (8px) + 70px Verschiebung
        snippetButtonsContainer.style.left = (sharedPanelWidth + 8 + 70) + 'px';
    }

    function initSnippetButtonsContainer() {
        if (snippetButtonsContainer) return;

        const aceEditorContainer = document.querySelector('#ace-editor');
        if (!aceEditorContainer) return;

        const wrapper = document.querySelector('.ace-editor-wrapper');
        if (!wrapper) return;

        // Container als Overlay über dem Editor positionieren
        snippetButtonsContainer = document.createElement('div');
        snippetButtonsContainer.className = 'snippet-buttons-container';
        snippetButtonsContainer.style.position = 'absolute';
        snippetButtonsContainer.style.display = 'flex';
        snippetButtonsContainer.style.flexWrap = 'wrap';
        snippetButtonsContainer.style.gap = '6px';
        snippetButtonsContainer.style.minHeight = '0';
        snippetButtonsContainer.style.alignItems = 'center';
        snippetButtonsContainer.style.zIndex = '100';
        // Position: 70px rechts vom Panel-Ende, -6px vom oberen Rand
        snippetButtonsContainer.style.left = (sharedPanelWidth + 8 + 70) + 'px';
        snippetButtonsContainer.style.top = '-6px';

        // Wrapper braucht position: relative und overflow: visible für negative top-Position
        wrapper.style.position = 'relative';
        wrapper.style.overflow = 'visible';
        wrapper.appendChild(snippetButtonsContainer);

        renderSnippetButtons();
    }

    function renderSnippetButtons() {
        if (!snippetButtonsContainer) return;

        snippetButtonsContainer.innerHTML = '';

        const activeButtons = getActiveSnippetButtons();

        if (activeButtons.length === 0) {
            snippetButtonsContainer.style.display = 'none';
            return;
        }

        snippetButtonsContainer.style.display = 'flex';

        // Drag & Drop State
        let draggedElement = null;

        activeButtons.forEach((btnData, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline-primary snippet-quick-btn';
            btn.textContent = btnData.title;
            btn.style.fontSize = '11px';
            btn.style.padding = '2px 8px';
            btn.style.cursor = 'pointer';
            btn.draggable = true;
            btn.dataset.snippetId = btnData.id;
            btn.dataset.index = index;
            btn.title = `${btnData.title} einfügen`;

            // Klick fügt Snippet ein
            btn.addEventListener('click', () => {
                insertVariableIntoAce(btnData.content);
            });

            // Drag & Drop Events
            btn.addEventListener('dragstart', (e) => {
                draggedElement = btn;
                btn.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', index.toString());
            });

            btn.addEventListener('dragend', () => {
                btn.style.opacity = '1';
                draggedElement = null;
            });

            btn.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            btn.addEventListener('dragenter', (e) => {
                e.preventDefault();
                if (draggedElement && draggedElement !== btn) {
                    btn.style.borderColor = '#0d6efd';
                    btn.style.borderWidth = '2px';
                }
            });

            btn.addEventListener('dragleave', () => {
                btn.style.borderColor = '';
                btn.style.borderWidth = '';
            });

            btn.addEventListener('drop', (e) => {
                e.preventDefault();
                btn.style.borderColor = '';
                btn.style.borderWidth = '';

                if (draggedElement && draggedElement !== btn) {
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                    const toIndex = parseInt(btn.dataset.index, 10);

                    // Reihenfolge ändern
                    let buttons = getActiveSnippetButtons();
                    const [moved] = buttons.splice(fromIndex, 1);
                    buttons.splice(toIndex, 0, moved);
                    saveActiveSnippetButtons(buttons);
                    renderSnippetButtons();

                    // Snippets-Panel neu rendern um +/- Icons zu aktualisieren
                    if (snippetsRenderFn) snippetsRenderFn();
                }
            });

            snippetButtonsContainer.appendChild(btn);
        });
    }

    // ========================================================================
    // ACTION-PANEL FÜR VARIABLEN-SUBSTITUTION
    // ========================================================================

    function loadActiveActionVariables() {
        try {
            const stored = localStorage.getItem(ACTION_VARIABLES_STORAGE_KEY);
            activeActionVariables = stored ? JSON.parse(stored) : [];
        } catch (e) {
            activeActionVariables = [];
        }
    }

    function saveActiveActionVariables() {
        try {
            localStorage.setItem(ACTION_VARIABLES_STORAGE_KEY, JSON.stringify(activeActionVariables));
        } catch (e) {
            console.error('Fehler beim Speichern der Action-Variablen:', e);
        }
    }

    function isActionVariableActive(varName) {
        return activeActionVariables.includes(varName);
    }

    function toggleActionVariable(varName) {
        const index = activeActionVariables.indexOf(varName);
        if (index === -1) {
            activeActionVariables.push(varName);
        } else {
            activeActionVariables.splice(index, 1);
        }
        saveActiveActionVariables();
        updateActionPanel();
    }

    function insertActionCode(varName, globalFlag) {
        const editor = getAceEditor();
        if (!editor) return;

        // Texte aus den Action-Panel-Inputs holen
        const searchInput = actionPanelContainer ? actionPanelContainer.querySelector('.action-search-input') : null;
        const replaceInput = actionPanelContainer ? actionPanelContainer.querySelector('.action-replace-input') : null;

        const searchText = searchInput ? searchInput.value : '';
        const replaceText = replaceInput ? replaceInput.value : '';

        let textsToInsert = [];

        if (searchText.trim()) {
            // Text in Zeilen aufteilen
            const lines = searchText.split('\n').filter(line => line.trim() !== '');

            if (lines.length > 0) {
                const escapedReplace = replaceText ? escapeRegexSpecialChars(replaceText) : '';

                lines.forEach(line => {
                    const escapedSearch = escapeRegexSpecialChars(line);
                    let code = `${varName} =~ s/${escapedSearch}/${escapedReplace}/`;
                    if (globalFlag) {
                        code += 'g';
                    }
                    code += ';';
                    textsToInsert.push(code);
                });
            }
        } else {
            // Leerer Suchtext - nur Template einfügen
            let code = `${varName} =~ s///`;
            if (globalFlag) {
                code += 'g';
            }
            code += ';';
            textsToInsert.push(code);
        }

        // Einfügen mit Zeilenumbruch-Logik
        const cursorPos = editor.getCursorPosition();
        const currentRow = cursorPos.row;
        const currentLine = editor.session.getLine(currentRow);
        const lineLength = currentLine.length;

        if (lineLength === 0) {
            editor.insert(textsToInsert.join('\n'));
        } else {
            editor.clearSelection();
            editor.selection.moveTo(currentRow, lineLength);
            editor.insert('\n' + textsToInsert.join('\n'));
        }
        editor.focus();

        // Input-Felder leeren nach erfolgreicher Einfügung
        if (searchText.trim() && searchInput) {
            searchInput.value = '';
            searchInput.style.height = 'auto';
        }
        if (replaceInput) {
            replaceInput.value = '';
        }
    }

    function updateActionPanel() {
        const codeEditorAnnotations = document.querySelector('.codeeditor-annotations');
        if (!codeEditorAnnotations) return;

        // Entfernen falls keine aktiven Variablen
        if (activeActionVariables.length === 0) {
            if (actionPanelContainer) {
                actionPanelContainer.remove();
                actionPanelContainer = null;
            }
            return;
        }

        // Container erstellen falls noch nicht vorhanden
        if (!actionPanelContainer) {
            actionPanelContainer = document.createElement('div');
            actionPanelContainer.className = 'action-panel-container';
            actionPanelContainer.style.display = 'flex';
            actionPanelContainer.style.flexDirection = 'column';
            actionPanelContainer.style.gap = '8px';
            actionPanelContainer.style.marginBottom = '8px';
            actionPanelContainer.style.padding = '8px';
            actionPanelContainer.style.paddingRight = '12px'; // Platz für Resize-Handle
            actionPanelContainer.style.border = '1px solid #ccc';
            actionPanelContainer.style.borderRadius = '4px';
            actionPanelContainer.style.backgroundColor = '#f8f9fa';
            actionPanelContainer.style.position = 'relative';
            actionPanelContainer.style.boxSizing = 'border-box';

            // Gespeicherte Breite laden oder Standard verwenden (20% größer)
            let savedWidth = 740;
            try {
                const stored = localStorage.getItem('ersetzer_action_panel_width');
                if (stored) savedWidth = parseInt(stored, 10);
            } catch (e) {}
            actionPanelContainer.style.width = savedWidth + 'px';
            actionPanelContainer.style.minWidth = '360px';
            actionPanelContainer.style.maxWidth = '1440px';

            // Resize-Handle erstellen
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'action-panel-resize-handle';
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.top = '0';
            resizeHandle.style.right = '0';
            resizeHandle.style.width = '5px';
            resizeHandle.style.height = '100%';
            resizeHandle.style.cursor = 'ew-resize';
            resizeHandle.style.backgroundColor = 'transparent';
            resizeHandle.style.zIndex = '10';

            resizeHandle.addEventListener('mouseenter', () => {
                resizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
            });
            resizeHandle.addEventListener('mouseleave', () => {
                if (!resizeHandle.dataset.dragging) {
                    resizeHandle.style.backgroundColor = 'transparent';
                }
            });

            let startX, startWidth;
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                startX = e.clientX;
                startWidth = actionPanelContainer.offsetWidth;
                resizeHandle.dataset.dragging = 'true';
                resizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';

                const onMouseMove = (e) => {
                    const diff = e.clientX - startX;
                    const newWidth = Math.max(360, Math.min(1440, startWidth + diff));
                    actionPanelContainer.style.width = newWidth + 'px';
                };

                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    delete resizeHandle.dataset.dragging;
                    resizeHandle.style.backgroundColor = 'transparent';
                    // Breite speichern
                    try {
                        localStorage.setItem('ersetzer_action_panel_width', actionPanelContainer.offsetWidth);
                    } catch (e) {}
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            actionPanelContainer.appendChild(resizeHandle);

            codeEditorAnnotations.parentNode.insertBefore(actionPanelContainer, codeEditorAnnotations.nextSibling);
        }

        // Container leeren (außer Resize-Handle) und neu aufbauen
        Array.from(actionPanelContainer.children).forEach(child => {
            if (!child.classList.contains('action-panel-resize-handle')) {
                child.remove();
            }
        });

        // Input-Bereich (Search + Replace)
        const inputRow = document.createElement('div');
        inputRow.style.display = 'flex';
        inputRow.style.gap = '8px';
        inputRow.style.alignItems = 'flex-start';

        // Suchfeld
        const searchInput = document.createElement('textarea');
        searchInput.className = 'form-control form-control-sm action-search-input';
        searchInput.placeholder = 'Text eingeben (mehrzeilig möglich, wird automatisch regex-escaped)';
        searchInput.style.flex = '1';
        searchInput.style.minWidth = '0';
        searchInput.style.fontSize = '12px';
        searchInput.style.padding = '4px 8px';
        searchInput.style.resize = 'vertical';
        searchInput.style.minHeight = '28px';
        searchInput.style.maxHeight = '200px';
        searchInput.style.backgroundColor = '#e3f2fd';
        searchInput.rows = 1;

        // Auto-resize
        searchInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });

        // Ersetzungsfeld
        const replaceInput = document.createElement('input');
        replaceInput.type = 'text';
        replaceInput.className = 'form-control form-control-sm action-replace-input';
        replaceInput.placeholder = 'Ersetzen durch (optional, wird automatisch regex-escaped)';
        replaceInput.style.flex = '1';
        replaceInput.style.minWidth = '0';
        replaceInput.style.fontSize = '12px';
        replaceInput.style.padding = '4px 8px';

        inputRow.appendChild(searchInput);
        inputRow.appendChild(replaceInput);
        actionPanelContainer.appendChild(inputRow);

        // Action-Buttons für jede aktive Variable
        const buttonsRow = document.createElement('div');
        buttonsRow.style.display = 'flex';
        buttonsRow.style.flexWrap = 'wrap';
        buttonsRow.style.gap = '6px';

        activeActionVariables.forEach(varName => {
            const btnWrapper = document.createElement('div');
            btnWrapper.style.display = 'flex';
            btnWrapper.style.border = '1px solid #0d6efd';
            btnWrapper.style.borderRadius = '4px';
            btnWrapper.style.overflow = 'hidden';

            // Hauptbereich
            const mainBtn = document.createElement('button');
            mainBtn.className = 'btn btn-sm btn-outline-primary';
            mainBtn.textContent = varName;
            mainBtn.style.border = 'none';
            mainBtn.style.borderRadius = '0';
            mainBtn.style.fontSize = '11px';
            mainBtn.style.padding = '4px 10px';
            mainBtn.title = `${varName} =~ s///; einfügen`;
            mainBtn.addEventListener('click', () => {
                insertActionCode(varName, false);
            });

            // g-Bereich
            const globalBtn = document.createElement('button');
            globalBtn.className = 'btn btn-sm btn-outline-primary';
            globalBtn.innerHTML = '<strong>g</strong>';
            globalBtn.style.border = 'none';
            globalBtn.style.borderLeft = '1px solid #0d6efd';
            globalBtn.style.borderRadius = '0';
            globalBtn.style.fontSize = '11px';
            globalBtn.style.padding = '4px 8px';
            globalBtn.title = `${varName} =~ s///g; einfügen (global)`;
            globalBtn.addEventListener('click', () => {
                insertActionCode(varName, true);
            });

            btnWrapper.appendChild(mainBtn);
            btnWrapper.appendChild(globalBtn);
            buttonsRow.appendChild(btnWrapper);
        });

        actionPanelContainer.appendChild(buttonsRow);
    }

    function closeSnippetEditor() {
        if (snippetEditorContainer) {
            snippetEditorContainer.remove();
            snippetEditorContainer = null;
        }
        if (activeSnippetItem) {
            activeSnippetItem.style.backgroundColor = '';
            activeSnippetItem = null;
        }
        editingSnippetId = null;
    }

    function checkSnippetEditorUnsavedChanges() {
        if (!snippetEditorContainer) return true;

        const titleInput = snippetEditorContainer.querySelector('.snippet-title-input');
        const contentInput = snippetEditorContainer.querySelector('.snippet-content-input');

        if (!titleInput || !contentInput) return true;

        const hasTitle = titleInput.value.trim().length > 0;
        const hasContent = contentInput.value.trim().length > 0;

        // Wenn wir editieren, prüfen ob sich etwas geändert hat
        if (editingSnippetId) {
            const snippets = getSnippets();
            const originalSnippet = snippets.find(s => s.id === editingSnippetId);
            if (originalSnippet) {
                const titleChanged = titleInput.value !== originalSnippet.title;
                const contentChanged = contentInput.value !== originalSnippet.content;
                if (titleChanged || contentChanged) {
                    return confirm('Änderungen verwerfen?');
                }
                return true;
            }
        }

        // Für neue Snippets: Prüfen ob Felder ausgefüllt sind
        if (hasTitle || hasContent) {
            return confirm('Änderungen verwerfen?');
        }

        return true;
    }

    function openSnippetEditor(snippetToEdit = null) {
        // Prüfen ob ungespeicherte Änderungen vorhanden sind
        if (snippetEditorContainer && !checkSnippetEditorUnsavedChanges()) {
            return;
        }

        // Vorherigen Editor schließen
        closeSnippetEditor();

        const aceEditorContainer = document.querySelector('#ace-editor');
        if (!aceEditorContainer) return;

        const wrapper = document.querySelector('.ace-editor-wrapper');
        if (!wrapper) return;

        editingSnippetId = snippetToEdit ? snippetToEdit.id : null;

        // Item markieren wenn editiert wird
        if (snippetToEdit && snippetsPanel) {
            const items = snippetsPanel.querySelectorAll('.snippet-item');
            items.forEach(item => {
                if (item.dataset.snippetId === snippetToEdit.id) {
                    activeSnippetItem = item;
                    item.style.backgroundColor = '#cce5ff';
                }
            });
        }

        snippetEditorContainer = document.createElement('div');
        snippetEditorContainer.className = 'snippet-editor-container';
        snippetEditorContainer.style.position = 'relative';
        snippetEditorContainer.style.width = (sharedPanelWidth * 2) + 'px';
        snippetEditorContainer.style.minWidth = '200px';
        snippetEditorContainer.style.marginTop = '24px';
        snippetEditorContainer.style.display = 'flex';
        snippetEditorContainer.style.flexDirection = 'column';
        snippetEditorContainer.style.border = '1px solid #ccc';
        snippetEditorContainer.style.borderRadius = '4px';
        snippetEditorContainer.style.backgroundColor = '#fff';
        snippetEditorContainer.style.height = (sharedHeight || aceEditorContainer.offsetHeight) + 'px';
        snippetEditorContainer.style.flexShrink = '0';

        // Resize-Handle links
        const editorResizeHandle = document.createElement('div');
        editorResizeHandle.className = 'snippet-editor-resize-handle';
        editorResizeHandle.style.position = 'absolute';
        editorResizeHandle.style.top = '0';
        editorResizeHandle.style.left = '0';
        editorResizeHandle.style.width = '5px';
        editorResizeHandle.style.height = '100%';
        editorResizeHandle.style.cursor = 'ew-resize';
        editorResizeHandle.style.backgroundColor = 'transparent';
        editorResizeHandle.style.zIndex = '10';

        editorResizeHandle.addEventListener('mouseenter', () => {
            editorResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        editorResizeHandle.addEventListener('mouseleave', () => {
            if (!editorResizeHandle.dataset.dragging) {
                editorResizeHandle.style.backgroundColor = 'transparent';
            }
        });

        let editorStartX, editorStartWidth;

        editorResizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            editorStartX = e.clientX;
            editorStartWidth = snippetEditorContainer.offsetWidth;
            editorResizeHandle.dataset.dragging = 'true';
            editorResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
            isManualResizing = true;

            const onMouseMove = (e) => {
                // Bei linkem Handle: negative Bewegung = größer
                const diff = editorStartX - e.clientX;
                const newWidth = Math.max(200, editorStartWidth + diff);
                snippetEditorContainer.style.width = newWidth + 'px';
                if (previewContainer) {
                    previewContainer.style.width = newWidth + 'px';
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                delete editorResizeHandle.dataset.dragging;
                editorResizeHandle.style.backgroundColor = 'transparent';
                isManualResizing = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        snippetEditorContainer.appendChild(editorResizeHandle);

        // Header mit Schließen-Button
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '8px';
        header.style.paddingLeft = '12px'; // Platz für Resize-Handle
        header.style.borderBottom = '1px solid #ccc';
        header.style.backgroundColor = '#f8f9fa';

        const headerTitle = document.createElement('span');
        headerTitle.style.fontWeight = 'bold';
        headerTitle.style.fontSize = '12px';
        headerTitle.textContent = snippetToEdit ? 'Snippet bearbeiten' : 'Neues Snippet';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'none';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '0 4px';
        closeBtn.style.lineHeight = '1';
        closeBtn.title = 'Schließen';
        closeBtn.addEventListener('click', () => {
            if (checkSnippetEditorUnsavedChanges()) {
                closeSnippetEditor();
            }
        });

        header.appendChild(headerTitle);
        header.appendChild(closeBtn);
        snippetEditorContainer.appendChild(header);

        // Titel-Eingabefeld
        const titleContainer = document.createElement('div');
        titleContainer.style.padding = '8px';
        titleContainer.style.paddingLeft = '12px'; // Platz für Resize-Handle
        titleContainer.style.borderBottom = '1px solid #eee';

        const titleLabel = document.createElement('label');
        titleLabel.style.display = 'block';
        titleLabel.style.fontSize = '11px';
        titleLabel.style.color = '#666';
        titleLabel.style.marginBottom = '4px';
        titleLabel.textContent = 'Titel';

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'snippet-title-input form-control form-control-sm';
        titleInput.style.width = '100%';
        titleInput.style.fontSize = '12px';
        titleInput.value = snippetToEdit ? snippetToEdit.title : '';
        titleInput.placeholder = 'Snippet-Titel eingeben...';

        titleContainer.appendChild(titleLabel);
        titleContainer.appendChild(titleInput);
        snippetEditorContainer.appendChild(titleContainer);

        // Snippet-Inhalt-Eingabefeld
        const contentContainer = document.createElement('div');
        contentContainer.style.padding = '8px';
        contentContainer.style.paddingLeft = '12px'; // Platz für Resize-Handle
        contentContainer.style.flex = '1';
        contentContainer.style.display = 'flex';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.minHeight = '0';

        const contentLabel = document.createElement('label');
        contentLabel.style.display = 'block';
        contentLabel.style.fontSize = '11px';
        contentLabel.style.color = '#666';
        contentLabel.style.marginBottom = '4px';
        contentLabel.textContent = 'Snippet';

        const contentInput = document.createElement('textarea');
        contentInput.className = 'snippet-content-input form-control';
        contentInput.style.width = '100%';
        contentInput.style.flex = '1';
        contentInput.style.fontSize = '12px';
        contentInput.style.fontFamily = 'monospace';
        contentInput.style.resize = 'none';
        contentInput.value = snippetToEdit ? snippetToEdit.content : '';
        contentInput.placeholder = 'Snippet-Inhalt eingeben...';

        contentContainer.appendChild(contentLabel);
        contentContainer.appendChild(contentInput);
        snippetEditorContainer.appendChild(contentContainer);

        // Button-Container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.padding = '8px';
        buttonContainer.style.paddingLeft = '12px'; // Platz für Resize-Handle
        buttonContainer.style.borderTop = '1px solid #ccc';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = snippetToEdit ? 'space-between' : 'flex-end';
        buttonContainer.style.gap = '8px';

        // Löschen-Button (nur beim Editieren)
        if (snippetToEdit) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-danger';
            deleteBtn.textContent = 'Snippet löschen';
            deleteBtn.style.fontSize = '11px';
            deleteBtn.addEventListener('click', () => {
                if (confirm('Snippet wirklich löschen?')) {
                    const snippets = getSnippets();
                    const filtered = snippets.filter(s => s.id !== snippetToEdit.id);
                    saveSnippetsToStorage(filtered);
                    // Auch den Snippet-Button entfernen falls vorhanden
                    removeSnippetButton(snippetToEdit.id);
                    closeSnippetEditor();
                    if (snippetsRenderFn) {
                        snippetsRenderFn();
                    }
                }
            });
            buttonContainer.appendChild(deleteBtn);
        }

        // Ursprüngliche Werte speichern für Änderungserkennung
        const originalTitle = snippetToEdit ? snippetToEdit.title : '';
        const originalContent = snippetToEdit ? snippetToEdit.content : '';

        // Speichern-Button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-sm btn-primary';
        saveBtn.textContent = 'Speichern';
        saveBtn.style.fontSize = '11px';
        saveBtn.disabled = true;

        const updateSaveButtonState = () => {
            const hasValidTitle = titleInput.value.trim().length > 0;
            const hasValidContent = contentInput.value.trim().length > 0;
            const titleChanged = titleInput.value !== originalTitle;
            const contentChanged = contentInput.value !== originalContent;
            const hasChanges = titleChanged || contentChanged;
            saveBtn.disabled = !(hasValidTitle && hasValidContent && hasChanges);
        };

        titleInput.addEventListener('input', updateSaveButtonState);
        contentInput.addEventListener('input', updateSaveButtonState);

        // Initial prüfen
        updateSaveButtonState();

        saveBtn.addEventListener('click', () => {
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();

            if (!title || !content) return;

            const snippets = getSnippets();

            if (editingSnippetId) {
                // Bestehendes Snippet aktualisieren
                const index = snippets.findIndex(s => s.id === editingSnippetId);
                if (index !== -1) {
                    snippets[index].title = title;
                    snippets[index].content = content;
                    snippets[index].updatedAt = Date.now();

                    // Snippet-Button aktualisieren falls vorhanden
                    let activeButtons = getActiveSnippetButtons();
                    const btnIndex = activeButtons.findIndex(b => b.id === editingSnippetId);
                    if (btnIndex !== -1) {
                        activeButtons[btnIndex].title = title;
                        activeButtons[btnIndex].content = content;
                        saveActiveSnippetButtons(activeButtons);
                        renderSnippetButtons();
                    }
                }
            } else {
                // Neues Snippet anlegen
                snippets.push({
                    id: generateSnippetId(),
                    title: title,
                    content: content,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    hotkey: null
                });
            }

            saveSnippetsToStorage(snippets);
            closeSnippetEditor();

            if (snippetsRenderFn) {
                snippetsRenderFn();
            }
        });

        buttonContainer.appendChild(saveBtn);
        snippetEditorContainer.appendChild(buttonContainer);

        // Editor-Container am Ende des Wrappers einfügen (rechts)
        wrapper.appendChild(snippetEditorContainer);

        // Fokus auf Titel-Feld
        titleInput.focus();
    }

    function openSnippetsPanel() {
        // Prüfen ob Snippets-Panel bereits existiert
        if (snippetsPanel || document.querySelector('.snippets-panel')) return;

        const aceEditorContainer = document.querySelector('#ace-editor');
        if (!aceEditorContainer) return;

        const wrapper = document.querySelector('.ace-editor-wrapper');
        if (!wrapper) return;

        // sharedHeight initialisieren falls noch nicht gesetzt (mindestens 300px)
        const DEFAULT_MIN_HEIGHT = 300;
        if (!sharedHeight) {
            const currentHeight = aceEditorContainer.offsetHeight;
            sharedHeight = Math.max(currentHeight, DEFAULT_MIN_HEIGHT);
            if (currentHeight < DEFAULT_MIN_HEIGHT) {
                aceEditorContainer.style.height = DEFAULT_MIN_HEIGHT + 'px';
            }
        }

        snippetsPanel = document.createElement('div');
        snippetsPanel.className = 'snippets-panel';
        snippetsPanel.style.display = 'flex';
        snippetsPanel.style.flexDirection = 'column';
        snippetsPanel.style.border = '1px solid #ccc';
        snippetsPanel.style.borderRadius = '4px';
        snippetsPanel.style.backgroundColor = '#fff';
        snippetsPanel.style.minWidth = '120px';
        snippetsPanel.style.width = sharedPanelWidth + 'px';
        snippetsPanel.style.height = (sharedHeight || aceEditorContainer.offsetHeight) + 'px';
        snippetsPanel.style.marginTop = '24px';
        snippetsPanel.style.order = '-1'; // Links vom Editor
        snippetsPanel.style.position = 'relative';
        snippetsPanel.style.flexShrink = '0';

        // Resize-Handle rechts
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'panel-resize-handle';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.top = '0';
        resizeHandle.style.right = '0';
        resizeHandle.style.width = '5px';
        resizeHandle.style.height = '100%';
        resizeHandle.style.cursor = 'ew-resize';
        resizeHandle.style.backgroundColor = 'transparent';
        resizeHandle.style.zIndex = '10';

        resizeHandle.addEventListener('mouseenter', () => {
            resizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        resizeHandle.addEventListener('mouseleave', () => {
            if (!resizeHandle.dataset.dragging) {
                resizeHandle.style.backgroundColor = 'transparent';
            }
        });

        let startX, startWidth;

        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX;
            startWidth = snippetsPanel.offsetWidth;
            resizeHandle.dataset.dragging = 'true';
            resizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
            isManualResizing = true;

            const onMouseMove = (e) => {
                const diff = e.clientX - startX;
                const newWidth = Math.max(120, startWidth + diff);
                sharedPanelWidth = newWidth;
                snippetsPanel.style.width = newWidth + 'px';
                if (keyPanel) {
                    keyPanel.style.width = newWidth + 'px';
                }
                if (variablesPanel) {
                    variablesPanel.style.width = newWidth + 'px';
                }
                if (historyPanel) {
                    historyPanel.style.width = newWidth + 'px';
                }
                if (warningsPanel) {
                    warningsPanel.style.width = newWidth + 'px';
                }
                if (previewContainer) {
                    previewContainer.style.width = (newWidth * 2) + 'px';
                }
                if (snippetEditorContainer) {
                    snippetEditorContainer.style.width = (newWidth * 2) + 'px';
                }
                // Snippet-Buttons Container Position aktualisieren
                updateSnippetButtonsContainerPosition();
                // Höhe beibehalten
                if (sharedHeight) {
                    snippetsPanel.style.height = sharedHeight + 'px';
                    if (keyPanel) {
                        keyPanel.style.height = sharedHeight + 'px';
                    }
                    if (variablesPanel) {
                        variablesPanel.style.height = sharedHeight + 'px';
                    }
                    if (historyPanel) {
                        historyPanel.style.height = sharedHeight + 'px';
                    }
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                delete resizeHandle.dataset.dragging;
                resizeHandle.style.backgroundColor = 'transparent';
                isManualResizing = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        snippetsPanel.appendChild(resizeHandle);

        // Vertikaler Resize-Handle unten
        const verticalResizeHandle = document.createElement('div');
        verticalResizeHandle.className = 'panel-vertical-resize-handle';
        verticalResizeHandle.style.position = 'absolute';
        verticalResizeHandle.style.bottom = '0';
        verticalResizeHandle.style.left = '0';
        verticalResizeHandle.style.width = '100%';
        verticalResizeHandle.style.height = '5px';
        verticalResizeHandle.style.cursor = 'ns-resize';
        verticalResizeHandle.style.backgroundColor = 'transparent';
        verticalResizeHandle.style.zIndex = '10';

        verticalResizeHandle.addEventListener('mouseenter', () => {
            verticalResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        verticalResizeHandle.addEventListener('mouseleave', () => {
            if (!verticalResizeHandle.dataset.dragging) {
                verticalResizeHandle.style.backgroundColor = 'transparent';
            }
        });

        let vStartY, vStartHeight;

        verticalResizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            vStartY = e.clientY;
            vStartHeight = snippetsPanel.offsetHeight;
            verticalResizeHandle.dataset.dragging = 'true';
            verticalResizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
            isManualResizing = true;

            const onMouseMove = (e) => {
                const diff = e.clientY - vStartY;
                const newHeight = Math.max(100, vStartHeight + diff);
                syncHeight(newHeight);
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                delete verticalResizeHandle.dataset.dragging;
                verticalResizeHandle.style.backgroundColor = 'transparent';
                isManualResizing = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        snippetsPanel.appendChild(verticalResizeHandle);

        // Header mit Suchfeld, Sortier-Button und Neu-Button
        const headerContainer = document.createElement('div');
        headerContainer.className = 'snippets-header';
        headerContainer.style.padding = '6px';
        headerContainer.style.borderBottom = '1px solid #ccc';
        headerContainer.style.backgroundColor = '#f8f9fa';
        headerContainer.style.display = 'flex';
        headerContainer.style.gap = '4px';
        headerContainer.style.alignItems = 'center';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Snippets suchen...';
        searchInput.className = 'form-control form-control-sm';
        searchInput.style.flex = '1';
        searchInput.style.fontSize = '11px';
        searchInput.style.minWidth = '0';

        const sortBtn = document.createElement('button');
        sortBtn.className = 'btn btn-sm btn-outline-secondary';
        sortBtn.style.fontSize = '10px';
        sortBtn.style.padding = '2px 6px';
        sortBtn.style.whiteSpace = 'nowrap';
        sortBtn.textContent = 'A–Z';
        sortBtn.title = 'Sortierung umschalten';

        sortBtn.addEventListener('click', () => {
            snippetsSortMode = snippetsSortMode === 'az' ? 'date' : 'az';
            sortBtn.textContent = snippetsSortMode === 'az' ? 'A–Z' : 'Datum';
            renderSnippets(searchInput.value);
        });

        const newBtn = document.createElement('button');
        newBtn.className = 'btn btn-sm btn-primary';
        newBtn.style.fontSize = '10px';
        newBtn.style.padding = '2px 6px';
        newBtn.textContent = 'Neu';
        newBtn.title = 'Neues Snippet anlegen';

        newBtn.addEventListener('click', () => {
            openSnippetEditor();
        });

        headerContainer.appendChild(searchInput);
        headerContainer.appendChild(sortBtn);
        headerContainer.appendChild(newBtn);
        snippetsPanel.appendChild(headerContainer);

        // Liste
        const listContainer = document.createElement('div');
        listContainer.className = 'snippets-list';
        listContainer.style.flex = '1';
        listContainer.style.overflowY = 'auto';
        listContainer.style.overflowX = 'hidden';

        // Funktion zum Highlighten von Text
        function highlightText(text, searchTerms) {
            if (!searchTerms || searchTerms.length === 0) return text;

            let result = text;
            searchTerms.forEach(term => {
                if (term && !term.startsWith('-')) {
                    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                    result = result.replace(regex, '<span style="background-color:#EF0FFF;color:#fff;">$1</span>');
                }
            });
            return result;
        }

        // Funktion zum Filtern und Rendern der Snippets
        function renderSnippets(searchValue = '') {
            listContainer.innerHTML = '';

            // User-Snippets und Default-Snippets zusammenführen
            let userSnippets = getSnippets();
            let allSnippets = [...userSnippets, ...DEFAULT_SNIPPETS];

            // Suchbegriffe parsen
            const terms = searchValue.trim().split(/\s+/).filter(t => t);
            const includeTerms = terms.filter(t => !t.startsWith('-')).map(t => t.toLowerCase());
            const excludeTerms = terms.filter(t => t.startsWith('-')).map(t => t.substring(1).toLowerCase()).filter(t => t);

            // Filtern
            const filteredSnippets = allSnippets.filter(snippet => {
                const titleLower = snippet.title.toLowerCase();
                const contentLower = snippet.content.toLowerCase();

                // Prüfen ob ausgeschlossen
                for (const excl of excludeTerms) {
                    if (titleLower.includes(excl) || contentLower.includes(excl)) {
                        return false;
                    }
                }

                // Wenn keine Include-Terms, alle anzeigen (außer ausgeschlossene)
                if (includeTerms.length === 0) {
                    return true;
                }

                // Prüfen ob mindestens ein Include-Term passt
                for (const incl of includeTerms) {
                    if (titleLower.includes(incl) || contentLower.includes(incl)) {
                        return true;
                    }
                }

                return false;
            });

            // Sortieren
            if (snippetsSortMode === 'az') {
                // A-Z: Alles alphabetisch, Default-Snippets werden normal einsortiert
                filteredSnippets.sort((a, b) => a.title.localeCompare(b.title, 'de'));
            } else {
                // Datum: User-Snippets nach Datum, Default-Snippets am Ende
                filteredSnippets.sort((a, b) => {
                    // Beide sind Default-Snippets: alphabetisch sortieren
                    if (a.isDefault && b.isDefault) {
                        return a.title.localeCompare(b.title, 'de');
                    }
                    // a ist Default, b nicht: a nach hinten
                    if (a.isDefault) return 1;
                    // b ist Default, a nicht: b nach hinten
                    if (b.isDefault) return -1;
                    // Beide sind User-Snippets: nach Datum (neueste zuerst)
                    return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
                });
            }

            if (filteredSnippets.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.style.padding = '12px';
                emptyMsg.style.color = '#666';
                emptyMsg.style.fontSize = '12px';
                emptyMsg.style.textAlign = 'center';
                emptyMsg.textContent = searchValue ? 'Keine Treffer' : 'Keine Snippets vorhanden';
                listContainer.appendChild(emptyMsg);
                return;
            }

            filteredSnippets.forEach(snippet => {
                const isDefault = snippet.isDefault === true;

                const item = document.createElement('div');
                item.className = 'snippet-item';
                item.dataset.snippetId = snippet.id;
                item.style.padding = '6px 8px';
                item.style.borderBottom = '1px solid #e0e0e0';
                item.style.cursor = 'pointer';
                item.style.fontSize = '12px';
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.alignItems = 'center';
                item.style.gap = '4px';

                // Grauer Hintergrund für Default-Snippets
                if (isDefault) {
                    item.style.backgroundColor = '#f5f5f5';
                }

                // Titel-Bereich (klickbar für Einfügen)
                const titleSpan = document.createElement('span');
                titleSpan.style.flex = '1';
                titleSpan.style.overflow = 'hidden';
                titleSpan.style.textOverflow = 'ellipsis';
                titleSpan.style.whiteSpace = 'nowrap';
                titleSpan.title = snippet.title + '\n\n' + snippet.content.substring(0, 200) + (snippet.content.length > 200 ? '...' : '');
                titleSpan.innerHTML = highlightText(snippet.title, includeTerms);

                // Icons-Container
                const iconsContainer = document.createElement('div');
                iconsContainer.style.display = 'flex';
                iconsContainer.style.gap = '4px';
                iconsContainer.style.flexShrink = '0';

                // Editieren-Icon
                const editIcon = document.createElement('span');
                editIcon.textContent = '✏️';
                editIcon.style.fontSize = '12px';

                if (isDefault) {
                    // Ausgegraut für Default-Snippets
                    editIcon.style.cursor = 'not-allowed';
                    editIcon.style.opacity = '0.3';
                    editIcon.title = 'Standard-Snippet (nicht bearbeitbar)';
                } else {
                    editIcon.style.cursor = 'pointer';
                    editIcon.title = 'Editieren';
                    editIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openSnippetEditor(snippet);
                    });
                }

                // Hotkey-Icon → +/- Toggle für Snippet-Button
                const toggleIcon = document.createElement('span');
                const isActive = isSnippetButtonActive(snippet.id);
                toggleIcon.textContent = isActive ? '−' : '+';
                toggleIcon.style.cursor = 'pointer';
                toggleIcon.style.fontSize = '14px';
                toggleIcon.style.fontWeight = 'bold';
                toggleIcon.style.color = isActive ? '#dc3545' : '#198754';
                toggleIcon.style.width = '16px';
                toggleIcon.style.textAlign = 'center';
                toggleIcon.title = isActive ? 'Button entfernen' : 'Button hinzufügen';
                toggleIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Container initialisieren falls noch nicht vorhanden
                    initSnippetButtonsContainer();

                    if (isSnippetButtonActive(snippet.id)) {
                        // Button entfernen
                        removeSnippetButton(snippet.id);
                        toggleIcon.textContent = '+';
                        toggleIcon.style.color = '#198754';
                        toggleIcon.title = 'Button hinzufügen';
                    } else {
                        // Button hinzufügen
                        addSnippetButton(snippet.id, snippet.title, snippet.content);
                        toggleIcon.textContent = '−';
                        toggleIcon.style.color = '#dc3545';
                        toggleIcon.title = 'Button entfernen';
                    }
                });

                iconsContainer.appendChild(editIcon);
                iconsContainer.appendChild(toggleIcon);

                item.appendChild(titleSpan);
                item.appendChild(iconsContainer);

                // Hover-Effekt
                item.addEventListener('mouseenter', () => {
                    if (item !== activeSnippetItem) {
                        item.style.backgroundColor = isDefault ? '#ebebeb' : '#f0f0f0';
                    }
                });
                item.addEventListener('mouseleave', () => {
                    if (item !== activeSnippetItem) {
                        item.style.backgroundColor = isDefault ? '#f5f5f5' : '';
                    }
                });

                // Klick auf Item fügt Snippet ein
                item.addEventListener('click', () => {
                    insertVariableIntoAce(snippet.content);
                });

                listContainer.appendChild(item);
            });
        }

        // Render-Funktion global verfügbar machen
        snippetsRenderFn = () => renderSnippets(searchInput.value);

        // Initial rendern
        renderSnippets('');

        // Event Listener für Suche
        searchInput.addEventListener('input', (e) => {
            renderSnippets(e.target.value);
        });

        // Enter verhindert Formular-Submit
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });

        snippetsPanel.appendChild(listContainer);

        // Panel am Anfang des Wrappers einfügen (links)
        wrapper.insertBefore(snippetsPanel, wrapper.firstChild);
    }

    function syncHeight(newHeight) {
        sharedHeight = newHeight;
        const aceEditorContainer = document.querySelector('#ace-editor');

        if (aceEditorContainer) {
            // Höhe setzen mit !important-Effekt
            aceEditorContainer.style.setProperty('height', newHeight + 'px', 'important');

            // ACE Editor resize - mit verschiedenen Methoden und verzögert
            const resizeAce = () => {
                try {
                    let aceInstance = null;

                    // ACE global finden (auch für Userscript-Kontext)
                    const aceGlobal = (typeof unsafeWindow !== 'undefined' && unsafeWindow.ace)
                        ? unsafeWindow.ace
                        : (typeof ace !== 'undefined' ? ace : null);

                    // Methode 1: über ace.edit()
                    if (aceGlobal && aceGlobal.edit) {
                        aceInstance = aceGlobal.edit('ace-editor');
                    }
                    // Methode 2: über env property
                    if (!aceInstance && aceEditorContainer.env && aceEditorContainer.env.editor) {
                        aceInstance = aceEditorContainer.env.editor;
                    }
                    // Methode 3: über __ace_instance__ (manche Versionen)
                    if (!aceInstance && aceEditorContainer.__ace_instance__) {
                        aceInstance = aceEditorContainer.__ace_instance__;
                    }

                    if (aceInstance) {
                        // Auto-Resize DAUERHAFT und AGGRESSIV deaktivieren
                        if (aceInstance.setOptions) {
                            aceInstance.setOptions({
                                maxLines: null,
                                minLines: null,
                                autoScrollEditorIntoView: false
                            });
                        }

                        // Renderer-Optionen direkt setzen (sehr wichtig!)
                        if (aceInstance.renderer) {
                            aceInstance.renderer.$maxLines = null;
                            aceInstance.renderer.$minLines = null;
                            aceInstance.renderer.$autosize = false;

                            // $updateSizeAsync überschreiben um Auto-Height zu verhindern
                            if (!aceInstance.renderer._originalUpdateSizeAsync) {
                                aceInstance.renderer._originalUpdateSizeAsync = aceInstance.renderer.$updateSizeAsync;
                                aceInstance.renderer.$updateSizeAsync = function() {
                                    // Nur aufrufen wenn nicht manuell gesetzt
                                    if (!sharedHeight) {
                                        this._originalUpdateSizeAsync && this._originalUpdateSizeAsync();
                                    }
                                };
                            }
                        }

                        aceInstance.resize(true); // force resize
                        aceAutoResizeDisabled = true;
                    }
                } catch (e) {
                    // Fallback: Resize-Event dispatchen
                    window.dispatchEvent(new Event('resize'));
                }
            };

            // Sofort und verzögert ausführen für bessere Kompatibilität
            resizeAce();
            requestAnimationFrame(resizeAce);
            // Nochmal nach kurzer Verzögerung (für langsame Seiten)
            setTimeout(resizeAce, 100);

            // MutationObserver für Höhen-Enforcement (nur einmal einrichten)
            if (!aceEditorContainer._heightEnforcer) {
                aceEditorContainer._heightEnforcer = new MutationObserver((mutations) => {
                    if (sharedHeight && !isManualResizing) {
                        const currentHeight = parseInt(aceEditorContainer.style.height);
                        if (currentHeight !== sharedHeight) {
                            aceEditorContainer.style.setProperty('height', sharedHeight + 'px', 'important');
                            // ACE nochmal resizen
                            try {
                                const aceGlobal = (typeof unsafeWindow !== 'undefined' && unsafeWindow.ace)
                                    ? unsafeWindow.ace
                                    : (typeof ace !== 'undefined' ? ace : null);
                                if (aceGlobal && aceGlobal.edit) {
                                    const aceInstance = aceGlobal.edit('ace-editor');
                                    if (aceInstance) {
                                        aceInstance.resize(true);
                                    }
                                }
                            } catch (e) {}
                        }
                    }
                });
                aceEditorContainer._heightEnforcer.observe(aceEditorContainer, {
                    attributes: true,
                    attributeFilter: ['style']
                });
            }
        }
        if (keyPanel) {
            keyPanel.style.height = newHeight + 'px';
        }
        if (variablesPanel) {
            variablesPanel.style.height = newHeight + 'px';
        }
        if (snippetsPanel) {
            snippetsPanel.style.height = newHeight + 'px';
        }
        if (historyPanel) {
            historyPanel.style.height = newHeight + 'px';
        }
        if (warningsPanel) {
            warningsPanel.style.height = newHeight + 'px';
        }
        if (previewContainer) {
            previewContainer.style.height = newHeight + 'px';
        }
        if (snippetEditorContainer) {
            snippetEditorContainer.style.height = newHeight + 'px';
        }
    }

    function initKeyPanel() {
        addGutterIcon();

        // Panel automatisch beim Start öffnen
        openKeyPanel();

        // Observer für Gutter-Änderungen (falls Icons neu gerendert werden müssen)
        const aceEditor = document.querySelector('#ace-editor');
        if (aceEditor) {
            const gutterObserver = new MutationObserver(() => {
                if (!document.querySelector('.gutter-panel-icons')) {
                    addGutterIcon();
                }
            });
            gutterObserver.observe(aceEditor, {
                childList: true,
                subtree: true
            });
        }

        // Observer für Key-Value-Tabelle (Keys werden dynamisch geladen)
        let lastKeyCount = 0;
        const keyTableObserver = new MutationObserver(() => {
            const currentKeyCount = document.querySelectorAll('.key-value-table__row .key-value-table__cell a[href*="/kalif/artikel/property"]').length;
            if (currentKeyCount !== lastKeyCount) {
                lastKeyCount = currentKeyCount;
                if (keyPanelRenderFn && keyPanelSearchInput) {
                    keyPanelRenderFn(keyPanelSearchInput.value || '');
                }
            }
        });
        keyTableObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setTimeout(initHistoryPanel, 1000);

    // ========================================================================
    // ORIGINAL ERSETZER FUNKTIONALITÄT
    // ========================================================================

    // Feld-Definitionen mit ihren Code-Templates
    const fields = {
        'bezeichnung': { code: '$bezeichnung =~ s///;' },
        'bezeichnung_en': { code: '$bezeichnung_en =~ s///;' },
        'bezeichnung_pl': { code: '$bezeichnung_pl =~ s///;' },
        'desc': { code: '$desc =~ s///;' },
        'hersteller_id': { code: '$hersteller_id =~ s///;' },
        'hinweis': { code: '$hinweis =~ s///;' },
        'hlink_de': { code: '$hlink_de =~ s///;' },
        'hlink_en': { code: '$hlink_en =~ s///;' },
        'hlink_mlt': { code: '$hlink_mlt =~ s///;' },
        'hlink_pl': { code: '$hlink_pl =~ s///;' },
        'ikw': { code: `@ikw = ();                                \t\t# Keywords entfernen
@ikw = ('foo','bar');               \t\t\t# Keywords ersetzen
push @ikw, 'qux';\t\t\t\t\t\t\t\t# Keyword ergänzen
@ikw = grep { $_ ne 'qux' } @ikw;         \t\t# Keyword entfernen
@ikw = map  { $_ eq 'qux' ? 'fux' : $_ } @ikw;  # Keyword ändern` },
        'kw': { code: '$kw =~ s///;' },
        'matchrule': { code: '$matchrule =~ s///;' },
        'matchrule_comment': { code: '$matchrule_comment =~ s///;' },
        'matchrule_untested': { code: '$matchrule_untested =~ s/.*//;' },
        'modell': { code: '$modell =~ s///;' },
        'mpn': { code: '$mpn =~ s///;' },
        'no_kv': { code: `$no_kv = 0;
$no_kv = 1;` },
        'related': { code: `@related = ();                                \t\t\t\t# IDs entfernen
@related = ('12345','12346');               \t\t\t\t# IDs ersetzen
push @related, '12347';\t\t\t\t\t\t\t\t\t# ID ergänzen
@related = grep { $_ ne '12345' } @related;         \t\t# ID löschen
@related = map  { $_ eq '12345' ? '12346' : $_ } @related;  # ID ändern` },
        'retired': { code: `$retired = 0;
$retired = 1;` },
        'serie': { code: '$serie =~ s///;' },
        'template_id': { code: `$template_id = undef;
$template_id = 123;` },
        'value': { code: `$value{KEY} = '';` },
        'value ARRAY': { code: `# Element ergänzen
push $value{KEY}->@*, 'blau';
# Element tauschen
$value{KEY}->@* = map { $_ eq 'rot' ? 'blau' : $_ } $value{KEY}->@*;
# Element entfernen
$value{KEY}->@* = grep { $_ ne 'rot' } $value{KEY}->@*;
delete $value{KEY} unless $value{KEY}->@*;
# Alle Elemente überschreiben
$value{KEY} = [qw/grün gelb/];` },
        'varianten_id': { code: `$varianten_id = undef;
$varianten_id = 123;` },
        'custom: hlink_en (mit $mpn)': { code: `$hlink_en = "https://www.example.com/category/familiy/\${mpn}";` },
        'custom: matchrule (mit MR-Ausschluss)': { code: `my $exclusion_keyword = 'AUSSCHLUSS';

if ($matchrule =~ / \\-/) {
\t$matchrule .= "|$exclusion_keyword";
} elsif ($matchrule =~ /./) {
\t$matchrule .= " -$exclusion_keyword";
}

# danach ein neuer Run:
$matchrule_untested =~ s/.*//;` },
        'custom: matchrule_untested entfernen': { code: '$matchrule_untested =~ s/.*//;' }
    };

    // Globale Variable für offene Dropdowns
    let openDropdown = null;

    // Funktion zum Schließen aller Dropdowns
    function closeAllDropdowns() {
        if (openDropdown) {
            openDropdown.style.display = 'none';
            openDropdown = null;
        }
    }

    // Funktion um zu prüfen ob ein Code die s///-Struktur hat
    function hasSubstituteStructure(code) {
        return /=~\s*s\/\/\/;/.test(code);
    }

    // Zentrale Funktion zum Maskieren von Regex-Sonderzeichen
    function escapeRegexSpecialChars(text) {
        let result = '';
        const specialChars = ['+', '(', ')', '[', ']', '.', '/', '|', '\\'];

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (specialChars.includes(char)) {
                result += '\\' + char;
            } else {
                result += char;
            }
        }

        return result;
    }

    // Funktion um maskierten Text in s///-Struktur einzufügen
    function insertMaskedTextIntoSubstitute(code, maskedText, replaceText) {
        // Wenn kein Ersetzungstext angegeben, verwende maskedText für beide Seiten
        const replacement = replaceText !== undefined && replaceText !== '' ? replaceText : maskedText;
        // Finde das s///; Pattern und füge den maskierten Text ein
        return code.replace(/(=~\s*s\/)(\/)(\/)/, `$1${maskedText}$2${replacement}$3`);
    }

    // DEPRECATED: Alte Helper-Funktionen - ersetzt durch Action-Panel
    function getMaskedInputText() {
        return '';
    }

    function getReplaceInputText() {
        return '';
    }

    function clearMaskedInput() {
        // Nicht mehr benötigt
    }

    function clearReplaceInput() {
        // Nicht mehr benötigt
    }

    // Schnellbutton-Konfiguration laden/speichern
    function loadQuickButtons() {
        try {
            const saved = GM_getValue('quickButtons', '[]');
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }

    function saveQuickButtons(buttons) {
        try {
            // Nur nicht-null Werte speichern
            const compacted = buttons.filter(item => item !== null);
            GM_setValue('quickButtons', JSON.stringify(compacted));
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // Standard Render-Wert speichern/laden
    function getDefaultRenderValue() {
        try {
            return GM_getValue('defaultRenderValue', null);
        } catch (e) {
            return null;
        }
    }

    function saveDefaultRenderValue(value) {
        try {
            GM_setValue('defaultRenderValue', value);
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // Settings Overlay erstellen und öffnen
    function openSettingsOverlay() {
        // Prüfen ob bereits ein Overlay existiert
        let existingOverlay = document.getElementById('render-settings-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Backdrop erstellen
        const backdrop = document.createElement('div');
        backdrop.id = 'render-settings-overlay';
        backdrop.style.position = 'fixed';
        backdrop.style.top = '0';
        backdrop.style.left = '0';
        backdrop.style.width = '100%';
        backdrop.style.height = '100%';
        backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        backdrop.style.display = 'flex';
        backdrop.style.justifyContent = 'center';
        backdrop.style.alignItems = 'center';
        backdrop.style.zIndex = '9999';

        // Modal erstellen
        const modal = document.createElement('div');
        modal.style.backgroundColor = 'white';
        modal.style.borderRadius = '8px';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        modal.style.minWidth = '400px';

        // Titel
        const title = document.createElement('h5');
        title.textContent = 'Render-Einstellungen';
        title.style.marginBottom = '15px';
        title.style.marginTop = '0';
        modal.appendChild(title);

        // Label
        const label = document.createElement('label');
        label.textContent = 'Standard-Wert beim Laden der Seite:';
        label.style.display = 'block';
        label.style.marginBottom = '8px';
        label.style.fontWeight = '500';
        modal.appendChild(label);

        // Dropdown erstellen
        const dropdown = document.createElement('select');
        dropdown.className = 'form-select form-select-sm';
        dropdown.style.marginBottom = '15px';
        dropdown.style.width = '100%';

        const options = [
            { value: 'auto', label: 'Beim Speichern rendern (default)' },
            { value: 'never', label: 'Nicht rendern' },
            { value: 'always', label: 'Bei Testen/Speichern rendern' },
            { value: 'preview', label: 'Vorschau rendern (auch inaktiv)' }
        ];

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            dropdown.appendChild(option);
        });

        // Aktuelle Einstellung laden oder auf "auto" setzen
        const currentDefault = getDefaultRenderValue() || 'auto';
        dropdown.value = currentDefault;

        modal.appendChild(dropdown);

        // Button Container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'flex-end';

        // Abbrechen Button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Abbrechen';
        cancelBtn.className = 'btn btn-sm btn-secondary';
        cancelBtn.onclick = () => backdrop.remove();
        buttonContainer.appendChild(cancelBtn);

        // Speichern Button
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Speichern';
        saveBtn.className = 'btn btn-sm btn-primary';
        saveBtn.onclick = () => {
            const value = dropdown.value;
            saveDefaultRenderValue(value);
            applyDefaultRenderValue(value);
            observeRenderDropdown(); // Observer neu starten
            backdrop.remove();
        };
        buttonContainer.appendChild(saveBtn);

        modal.appendChild(buttonContainer);

        // Backdrop schließen bei Click außerhalb
        backdrop.onclick = (e) => {
            if (e.target === backdrop) {
                backdrop.remove();
            }
        };

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
    }

    // Default Render-Wert anwenden
    function applyDefaultRenderValue(value) {
        if (!value) return;

        const renderDropdown = document.getElementById('render');
        if (renderDropdown) {
            renderDropdown.value = value;
            // Change Event triggern falls nötig
            renderDropdown.dispatchEvent(new Event('change'));
        }
    }

    // Observer für Render-Dropdown um Default-Wert nur beim Laden zu setzen
    function observeRenderDropdown() {
        const renderDropdown = document.getElementById('render');
        if (!renderDropdown) {
            setTimeout(observeRenderDropdown, 500);
            return;
        }

        const defaultValue = getDefaultRenderValue();
        if (!defaultValue) {
            return; // Kein Default gespeichert
        }

        // Setze den Wert nur einmal beim Laden
        renderDropdown.value = defaultValue;
        renderDropdown.dispatchEvent(new Event('change', { bubbles: true }));

        // Keine aggressiven Schutzmehanismen - lasse manuelle Änderungen zu
    }

    // Zahnrad-Icon klickbar machen
    function initSettingsIcon() {
        const gearIcon = document.querySelector('span.input-group-text svg.bi-gear-fill');
        if (!gearIcon) {
            setTimeout(initSettingsIcon, 500);
            return;
        }

        const gearSpan = gearIcon.closest('span.input-group-text');
        if (gearSpan) {
            gearSpan.style.cursor = 'pointer';
            gearSpan.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openSettingsOverlay();
            };
        }
    }

    // ACE Editor finden und Text einfügen
    function insertIntoEditor(text, globalFlag = false) {
        const aceEditor = document.querySelector('.ace_editor');
        if (!aceEditor) return;

        const ace = aceEditor.env;
        if (ace && ace.editor) {
            const editor = ace.editor;

            // Prüfen ob maskierter Text vorhanden ist und ob Code s///-Struktur hat
            const maskedText = getMaskedInputText();
            const replaceText = getReplaceInputText();
            let textsToInsert = [];
            let shouldClearInput = false;

            if (maskedText && hasSubstituteStructure(text)) {
                // Text in Zeilen aufteilen und leere Zeilen entfernen
                const lines = maskedText.split('\n').filter(line => line.trim() !== '');

                if (lines.length > 0) {
                    // Ersetzungstext maskieren falls vorhanden
                    const escapedReplace = replaceText ? escapeRegexSpecialChars(replaceText) : '';

                    // Für jede Zeile eine separate Ersetzungsregel erstellen
                    lines.forEach(line => {
                        const escaped = escapeRegexSpecialChars(line);
                        let processedText = insertMaskedTextIntoSubstitute(text, escaped, escapedReplace);
                        // Füge /g hinzu wenn globalFlag true ist
                        if (globalFlag) {
                            processedText = processedText.replace(/;$/, 'g;');
                        }
                        textsToInsert.push(processedText);
                    });

                    shouldClearInput = true;
                } else {
                    // Kein Text oder nur leere Zeilen
                    let processedText = text;
                    if (globalFlag) {
                        processedText = processedText.replace(/;$/, 'g;');
                    }
                    textsToInsert.push(processedText);
                }
            } else {
                // Kein maskierter Text oder keine s///-Struktur
                let processedText = text;
                if (globalFlag) {
                    processedText = processedText.replace(/;$/, 'g;');
                }
                textsToInsert.push(processedText);
            }

            const cursorPos = editor.getCursorPosition();
            const currentRow = cursorPos.row;
            const currentLine = editor.session.getLine(currentRow);
            const lineLength = currentLine.length;

            // Alle Texte einfügen
            if (lineLength === 0) {
                // Wenn die aktuelle Zeile leer ist, direkt einfügen ohne neue Zeile
                editor.insert(textsToInsert.join('\n'));
            } else {
                // Selektion aufheben und Cursor ans Ende der aktuellen Zeile setzen
                editor.clearSelection();
                editor.selection.moveTo(currentRow, lineLength);
                // Neue Zeile einfügen und dann Text
                editor.insert('\n' + textsToInsert.join('\n'));
            }
            editor.focus();

            // Input-Felder leeren wenn erfolgreich
            if (shouldClearInput) {
                clearMaskedInput();
                clearReplaceInput();
            }
        }
    }

    // DEPRECATED: Alte UI-Funktion - ersetzt durch Action-Panel
    function updateBadgeUI() {
        // Nicht mehr benötigt - Action-Panel wird durch toggleActionVariable aktualisiert
    }

    // DEPRECATED: Alte Quick-Buttons-Funktion - ersetzt durch Action-Panel
    function createQuickButtons(container, quickButtonsConfig) {
        // Nicht mehr benötigt
        return [];
    }

    // DEPRECATED: Alte Dropdown-Button-Funktion - ersetzt durch Action-Panel
    function createDropdownButton(container, quickButtonsConfig) {
        // Nicht mehr benötigt
    }

    // Hauptinitialisierung (deaktiviert - Buttons werden in Badge Container eingefügt)
    function init() {
        // Nicht verwendet - Buttons werden in addInputFieldAboveTestButton erstellt
        return;
    }

    // Key-Value Buttons hinzufügen
    function addKeyValueButtons() {
        // Alle Key-Links in der Key-Value Tabelle finden
        const keyLinks = document.querySelectorAll('.key-value-table__row .key-value-table__cell a[href*="/kalif/artikel/property"]');

        keyLinks.forEach(link => {
            // Prüfen ob bereits Copy-Icon existiert
            if (link.nextElementSibling && link.nextElementSibling.classList.contains('kv-copy-icon')) {
                return;
            }

            const keyName = link.textContent.trim();

            // Copy-Icon als SVG erstellen
            const copyIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            copyIcon.setAttribute('viewBox', '0 0 24 24');
            copyIcon.setAttribute('width', '14');
            copyIcon.setAttribute('height', '14');
            copyIcon.setAttribute('fill', 'none');
            copyIcon.setAttribute('stroke', 'currentColor');
            copyIcon.setAttribute('stroke-width', '2');
            copyIcon.setAttribute('stroke-linecap', 'round');
            copyIcon.setAttribute('stroke-linejoin', 'round');
            copyIcon.classList.add('kv-copy-icon');
            copyIcon.style.marginLeft = '6px';
            copyIcon.style.cursor = 'pointer';
            copyIcon.style.verticalAlign = 'middle';
            copyIcon.style.color = '#666';
            copyIcon.style.transition = 'color 0.2s';
            copyIcon.title = 'Key-Namen kopieren';

            // SVG-Inhalt
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', '9');
            rect.setAttribute('y', '9');
            rect.setAttribute('width', '13');
            rect.setAttribute('height', '13');
            rect.setAttribute('rx', '2');
            rect.setAttribute('ry', '2');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1');

            copyIcon.appendChild(rect);
            copyIcon.appendChild(path);

            // Hover-Effekt
            copyIcon.addEventListener('mouseenter', () => {
                copyIcon.style.color = '#0d6efd';
            });
            copyIcon.addEventListener('mouseleave', () => {
                if (!copyIcon.dataset.copied) {
                    copyIcon.style.color = '#666';
                }
            });

            // Klick-Handler
            copyIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // In Zwischenablage kopieren
                navigator.clipboard.writeText(keyName).then(() => {
                    // Grün aufleuchten
                    copyIcon.style.color = '#28a745';
                    copyIcon.dataset.copied = 'true';

                    setTimeout(() => {
                        copyIcon.style.color = '#666';
                        delete copyIcon.dataset.copied;
                    }, 500);
                }).catch(err => {
                    // Fehler beim Kopieren ignorieren
                });
            });

            // Icon direkt nach dem Link einfügen
            link.parentNode.insertBefore(copyIcon, link.nextSibling);
        });
    }

    // Key-Value Buttons bei Bedarf hinzufügen
    function observeKeyValueTables() {
        // Initial ausführen
        addKeyValueButtons();

        // MutationObserver für dynamische Änderungen
        const observer = new MutationObserver(() => {
            addKeyValueButtons();
        });

        const kvTableParent = document.querySelector('.key-value-table')?.parentNode || document.body;
    observer.observe(kvTableParent, {
            childList: true,
            subtree: true
        });
    }

    // Key-Value Observer starten
    setTimeout(observeKeyValueTables, 1000);

    // DEPRECATED: Alte Eingabefeld-Funktion - ersetzt durch Action-Panel im Variablen-Panel
    function addInputFieldAboveTestButton() {
        // Diese Funktion wurde durch das neue Action-Panel-System ersetzt
        // Aktive Action-Variablen werden jetzt im Variablen-Panel mit +/- Buttons gesteuert
    }

    // Action Panel Observer
    function observeActionPanel() {
        // Aktive Action-Variablen laden
        loadActiveActionVariables();

        // Initial Action-Panel erstellen falls Variablen aktiv sind
        updateActionPanel();

        // MutationObserver nur für code-editor Bereich
        const codeEditorAnnotations = document.querySelector('div.codeeditor-annotations');
        if (codeEditorAnnotations && codeEditorAnnotations.parentNode) {
            const observer = new MutationObserver(() => {
                // Prüfe ob der Action-Panel-Container noch da ist, sonst erstelle ihn neu
                if (activeActionVariables.length > 0 && !document.querySelector('.action-panel-container')) {
                    updateActionPanel();
                }
            });

            observer.observe(codeEditorAnnotations.parentNode, {
                childList: true,
                subtree: false
            });
        }
    }

    // Action Panel Observer starten
    setTimeout(observeActionPanel, 1000);

    // Settings Icon initialisieren
    setTimeout(() => {
        initSettingsIcon();
        // Default Render-Wert anwenden wenn gespeichert
        const defaultValue = getDefaultRenderValue();
        if (defaultValue) {
            applyDefaultRenderValue(defaultValue);
            observeRenderDropdown(); // Schütze den Wert vor Überschreiben
        }
    }, 1000);

    // ========================================================================
    // FEHLER-ICON CLICK-TO-CLIPBOARD FUNKTIONALITÄT
    // ========================================================================

    // Funktion zum Finden des Tooltip-Texts
    function getTooltipText(element) {
        // Bootstrap Library holen (über unsafeWindow oder window)
        const bsLib = (typeof unsafeWindow !== 'undefined' && unsafeWindow.bootstrap) ||
                      (typeof window !== 'undefined' && window.bootstrap);

        // 1. Bootstrap 5 Tooltip-Instanz abfragen (JavaScript-basiert)
        if (bsLib && bsLib.Tooltip) {
            // Prüfe Element selbst
            let tooltipInstance = bsLib.Tooltip.getInstance(element);
            if (tooltipInstance) {
                const title = tooltipInstance._config?.title || tooltipInstance._element?.getAttribute('data-bs-original-title');
                if (title) return title;
            }
            // Prüfe Parent-Element
            if (element.parentElement) {
                tooltipInstance = bsLib.Tooltip.getInstance(element.parentElement);
                if (tooltipInstance) {
                    const title = tooltipInstance._config?.title || tooltipInstance._element?.getAttribute('data-bs-original-title');
                    if (title) return title;
                }
            }
            // Prüfe auch das TD (Tabellenzelle) als möglichen Container
            const td = element.closest('td');
            if (td) {
                tooltipInstance = bsLib.Tooltip.getInstance(td);
                if (tooltipInstance) {
                    const title = tooltipInstance._config?.title || tooltipInstance._element?.getAttribute('data-bs-original-title');
                    if (title) return title;
                }
            }
        }

        // 2. ARIA-describedby (Bootstrap setzt dies wenn Tooltip sichtbar ist)
        if (element.hasAttribute('aria-describedby')) {
            const describedById = element.getAttribute('aria-describedby');
            const describedByElement = document.getElementById(describedById);
            if (describedByElement) {
                const inner = describedByElement.querySelector('.tooltip-inner') || describedByElement;
                return inner.textContent || inner.innerText;
            }
        }

        // 3. Suche nach sichtbarem Bootstrap Tooltip im DOM
        const visibleTooltip = document.querySelector('.tooltip.show .tooltip-inner, .tooltip.bs-tooltip-auto .tooltip-inner');
        if (visibleTooltip) {
            return visibleTooltip.textContent || visibleTooltip.innerText;
        }

        // 4. title Attribut am SVG selbst
        if (element.hasAttribute('title')) {
            return element.getAttribute('title');
        }

        // 5. title Attribut am Parent-Element
        if (element.parentElement && element.parentElement.hasAttribute('title')) {
            return element.parentElement.getAttribute('title');
        }

        // 6. Bootstrap Tooltip Attribute am SVG
        const bsAttributes = [
            'data-original-title',
            'data-bs-original-title',
            'data-title',
            'data-bs-title'
        ];

        for (const attr of bsAttributes) {
            if (element.hasAttribute(attr)) {
                return element.getAttribute(attr);
            }
        }

        // 7. Bootstrap Tooltip Attribute am Parent
        if (element.parentElement) {
            for (const attr of bsAttributes) {
                if (element.parentElement.hasAttribute(attr)) {
                    return element.parentElement.getAttribute(attr);
                }
            }
        }

        // 8. Suche in TD nach Tooltip-Attributen
        const td = element.closest('td');
        if (td) {
            for (const attr of bsAttributes) {
                if (td.hasAttribute(attr)) {
                    return td.getAttribute(attr);
                }
            }
            if (td.hasAttribute('title')) {
                return td.getAttribute('title');
            }
        }

        return null;
    }

    // Funktion zum Zurücksetzen aller Warnungen (bei Testen/Speichern)
    function resetWarnings() {
        collectedWarnings.clear();
        // Reset debounce tracker
        collectWarningOrError._lastCollect = {};
        // Reset auto-open flag damit Panel wieder automatisch geöffnet wird
        panelAutoOpened = false;
        // Alle warning-collected Marker und click-handler Marker entfernen
        document.querySelectorAll('svg.bi-exclamation-triangle-fill').forEach(icon => {
            delete icon.dataset.warningCollected;
            delete icon.dataset.clickHandlerAdded;
            // Stelle sicher dass pointer-events aktiv sind
            icon.style.pointerEvents = '';
        });
        updateWarningsIcon();
        renderWarningsPanel();

        // Nach kurzer Verzögerung neu sammeln (warten bis React die Icons aktualisiert hat)
        setTimeout(() => {
            addClickHandlers();
            const icons = document.querySelectorAll('svg.bi-exclamation-triangle-fill');
            if (icons.length > 0 && !panelAutoOpened) {
                panelAutoOpened = true;
                silentCollectAllWarnings(true);
            } else {
                silentCollectAllWarnings(false);
            }
        }, 1000);
    }

    // Click-Handler für Testen/Speichern Buttons
    function setupResetOnTestSave() {
        // Suche Buttons anhand des Textes
        const allButtons = document.querySelectorAll('button.btn');

        allButtons.forEach(btn => {
            const btnText = btn.textContent.trim();
            if ((btnText === 'Testen' || btnText === 'Speichern') && !btn.dataset.warningResetAdded) {
                btn.dataset.warningResetAdded = 'true';
                btn.addEventListener('click', () => {
                    // Warnungen zurücksetzen
                    resetWarnings();
                });
            }
        });
    }

    // Funktion zum Kopieren in die Zwischenablage
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback für ältere Browser
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            } catch (e) {
                document.body.removeChild(textarea);
                return false;
            }
        }
    }

    // Funktion zum Anzeigen einer visuellen Bestätigung
    function showCopyConfirmation(element) {
        const originalColor = element.style.color;
        element.style.color = 'green';
        element.style.transition = 'color 0.3s';

        setTimeout(() => {
            element.style.color = originalColor;
        }, 500);
    }

    // Funktion zum Hinzufügen von Click-Handlern
    function addClickHandlers() {
        const errorIcons = document.querySelectorAll('svg.bi-exclamation-triangle-fill');

        for (const icon of errorIcons) {
            // IMMER pointer-events zurücksetzen (auch bei bereits verarbeiteten Icons)
            if (icon.style.pointerEvents === 'none') {
                icon.style.pointerEvents = '';
            }

            // Überspringe wenn bereits verarbeitet
            if (icon.dataset.clickHandlerAdded) {
                continue;
            }

            // Typ bestimmen (error = rot, warning = orange)
            const iconColor = icon.style.color || '';
            const isError = iconColor.toLowerCase() === 'red';
            const type = isError ? 'error' : 'warning';

            // Mache Icon klickbar
            icon.style.cursor = 'pointer';
            icon.dataset.clickHandlerAdded = 'true';

            // Mouseenter-Handler als Fallback für manuelle Hover-Sammlung
            icon.addEventListener('mouseenter', () => {
                if (icon.dataset.warningCollected) return;

                // Warte kurz bis Bootstrap den Tooltip anzeigt
                setTimeout(() => {
                    if (icon.dataset.warningCollected) return;

                    const tooltipText = getTooltipText(icon);
                    if (tooltipText) {
                        collectWarningOrError(tooltipText, type);
                        icon.dataset.warningCollected = 'true';
                    }
                }, 200);
            });

            // Click-Handler: Kopiere Tooltip-Text
            icon.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const tooltipText = getTooltipText(icon);

                if (tooltipText) {
                    // Falls noch nicht gesammelt, jetzt sammeln
                    if (!icon.dataset.warningCollected) {
                        collectWarningOrError(tooltipText, type);
                        icon.dataset.warningCollected = 'true';
                    }

                    const success = await copyToClipboard(tooltipText);
                    if (success) {
                        showCopyConfirmation(icon);
                    } else {
                        alert('Fehler beim Kopieren in die Zwischenablage');
                    }
                } else {
                    alert('Keine Fehlermeldung gefunden');
                }
            });
        }

        // Setup für Testen/Speichern Reset
        setupResetOnTestSave();
    }

    // Stile für unsichtbare Tooltips (einmalig hinzufügen)
    function addSilentTooltipStyles() {
        if (document.getElementById('silent-tooltip-styles')) return;

        const style = document.createElement('style');
        style.id = 'silent-tooltip-styles';
        style.textContent = `
            /* Einzelne Tooltips unsichtbar machen */
            .tooltip.silent-collect {
                opacity: 0 !important;
                pointer-events: none !important;
                visibility: hidden !important;
                position: absolute !important;
                left: -9999px !important;
            }
            /* Während der Sammlung ALLE Tooltips verstecken */
            body.silent-collecting .tooltip {
                opacity: 0 !important;
                pointer-events: none !important;
                visibility: hidden !important;
                position: absolute !important;
                left: -9999px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Unsichtbares Auto-Hover um alle Warnungen zu sammeln
    // autoOpenPanel: wenn true, wird das Panel automatisch geöffnet wenn Warnungen gefunden werden
    async function silentCollectAllWarnings(autoOpenPanel = false) {
        // Nicht sammeln wenn deaktiviert
        if (!warningsEnabled) {
            updateWarningsIcon();
            renderWarningsPanel();
            return;
        }

        const icons = document.querySelectorAll('svg.bi-exclamation-triangle-fill');

        if (icons.length === 0) {
            updateWarningsIcon();
            renderWarningsPanel();
            return;
        }

        // Panel sofort öffnen wenn Icons vorhanden und autoOpenPanel aktiviert
        if (autoOpenPanel && icons.length > 0) {
            // Warte bis historyPanel existiert (Panels sind initialisiert)
            const waitForPanelsAndSwitch = () => {
                if (historyPanel) {
                    // switchToPanel statt openWarningsPanel um Icon-Status korrekt zu setzen
                    switchToPanel('warnings');
                    // Nochmals verzögert das Icon blau setzen (falls Icons noch nicht existierten)
                    const setWarningsIconActive = () => {
                        if (activePanel === 'warnings') {
                            // Alle anderen Icons auf inaktiv setzen
                            if (gutterIcon) {
                                gutterIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
                                gutterIcon.style.color = '#333';
                            }
                            if (variablesIcon) {
                                variablesIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
                                variablesIcon.style.color = '#333';
                            }
                            if (snippetsIcon) {
                                snippetsIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
                                snippetsIcon.style.color = '#333';
                            }
                            if (historyIcon) {
                                historyIcon.style.backgroundColor = 'rgba(255,255,255,0.8)';
                                historyIcon.style.color = '#333';
                            }
                            // Warnings-Icon auf aktiv setzen
                            if (warningsIcon) {
                                warningsIcon.style.backgroundColor = '#0d6efd';
                                warningsIcon.style.color = '#fff';
                            }
                        }
                    };
                    setTimeout(setWarningsIconActive, 100);
                    setTimeout(setWarningsIconActive, 500);
                } else {
                    // Panels noch nicht bereit, warte und versuche erneut
                    setTimeout(waitForPanelsAndSwitch, 200);
                }
            };
            waitForPanelsAndSwitch();
        }

        // Aktiviere "silent collecting" Modus - versteckt Tooltips
        document.body.classList.add('silent-collecting');

        for (const icon of icons) {
            // Überspringe wenn bereits gesammelt
            if (icon.dataset.warningCollected) continue;

            // Typ bestimmen
            const iconColor = icon.style.color || '';
            const isError = iconColor.toLowerCase() === 'red';
            const type = isError ? 'error' : 'warning';

            // Simuliere echten Hover
            await simulateHover(icon);

            // Warte kurz bis Tooltip erscheint
            await new Promise(r => setTimeout(r, 150));

            // Versuche Tooltip-Text zu bekommen
            const tooltipText = getTooltipText(icon);

            if (tooltipText) {
                collectWarningOrError(tooltipText, type);
                icon.dataset.warningCollected = 'true';
            }

            // Simuliere Mouse-Leave
            simulateMouseLeave(icon);

            // Kurze Pause zwischen Icons
            await new Promise(r => setTimeout(r, 50));
        }

        // Deaktiviere "silent collecting" Modus
        document.body.classList.remove('silent-collecting');

        updateWarningsIcon();
        renderWarningsPanel();
    }

    // Simuliert einen echten Hover über ein Element
    function simulateHover(element) {
        return new Promise(resolve => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Verschiedene Events die einen Hover auslösen könnten
            const eventOptions = {
                bubbles: true,
                cancelable: true,
                view: unsafeWindow,  // Verwende unsafeWindow statt window
                clientX: centerX,
                clientY: centerY,
                screenX: centerX,
                screenY: centerY
            };

            // Reihenfolge wie bei echtem Mouse-Hover
            element.dispatchEvent(new MouseEvent('mouseover', eventOptions));
            element.dispatchEvent(new MouseEvent('mouseenter', { ...eventOptions, bubbles: false }));
            element.dispatchEvent(new MouseEvent('mousemove', eventOptions));

            // Auch auf Parent-Elementen (TD, etc.)
            const td = element.closest('td');
            if (td) {
                td.dispatchEvent(new MouseEvent('mouseover', eventOptions));
                td.dispatchEvent(new MouseEvent('mouseenter', { ...eventOptions, bubbles: false }));
            }

            // Fokus setzen (manche Tooltips reagieren darauf)
            try {
                element.focus({ preventScroll: true });
            } catch (e) {}

            resolve();
        });
    }

    // Simuliert Mouse-Leave
    function simulateMouseLeave(element) {
        const rect = element.getBoundingClientRect();
        const eventOptions = {
            bubbles: true,
            cancelable: true,
            view: unsafeWindow,  // Verwende unsafeWindow statt window
            clientX: rect.left - 10,
            clientY: rect.top - 10
        };

        element.dispatchEvent(new MouseEvent('mouseout', eventOptions));
        element.dispatchEvent(new MouseEvent('mouseleave', { ...eventOptions, bubbles: false }));

        const td = element.closest('td');
        if (td) {
            td.dispatchEvent(new MouseEvent('mouseout', eventOptions));
            td.dispatchEvent(new MouseEvent('mouseleave', { ...eventOptions, bubbles: false }));
        }

        try {
            element.blur();
        } catch (e) {}
    }

    // Funktion um pointer-events bei allen Icons zu fixen (läuft regelmäßig)
    function fixPointerEvents() {
        document.querySelectorAll('svg.bi-exclamation-triangle-fill').forEach(icon => {
            if (icon.style.pointerEvents === 'none') {
                icon.style.pointerEvents = '';
            }
        });
    }

    // Korrigiert den Badge-Text beim initialen Laden der Seite
    // "Test abgeschlossen" ist irreführend wenn noch kein Test durchgeführt wurde
    let badgeFixApplied = false;
    function fixInitialBadgeText() {
        if (badgeFixApplied) return false;
        const badge = document.querySelector('span.badge.bg-success');
        if (badge && badge.textContent.trim() === 'Test abgeschlossen') {
            badge.textContent = 'Fertig geladen';
            badgeFixApplied = true;
            return true;
        }
        return false;
    }

    // Initial ausführen
    addClickHandlers();
    fixPointerEvents();
    fixInitialBadgeText(); // Badge-Text korrigieren beim Laden

    // Fokus auf ACE-Editor setzen und behalten während die Seite lädt
    function focusAceEditor() {
        const editor = getAceEditor();
        if (editor) {
            editor.focus();
            return true;
        }
        return false;
    }

    // Content-Protection: Bewahre getippten Inhalt während die Seite lädt
    let initialEditorContent = null;
    let userHasTyped = false;
    let lastKnownContent = null;

    function setupContentProtection() {
        const editor = getAceEditor();
        if (!editor || editor._contentProtectionSetup) return;

        editor._contentProtectionSetup = true;

        // Initialen Inhalt speichern
        initialEditorContent = editor.getValue();
        lastKnownContent = initialEditorContent;

        // Listener für Änderungen durch den User
        editor.on('change', (delta) => {
            const currentContent = editor.getValue();

            // Prüfe ob der User getippt hat (Inhalt unterscheidet sich vom initialen)
            if (currentContent !== initialEditorContent) {
                userHasTyped = true;
                lastKnownContent = currentContent;
            }

            // Wenn der User getippt hat und der Inhalt plötzlich auf den initialen zurückgesetzt wurde,
            // dann hat die Seite den Editor überschrieben - stelle den User-Inhalt wieder her
            if (userHasTyped && currentContent === initialEditorContent && lastKnownContent !== initialEditorContent) {
                // Verzögert wiederherstellen um Race-Conditions zu vermeiden
                setTimeout(() => {
                    const editorNow = getAceEditor();
                    if (editorNow && editorNow.getValue() === initialEditorContent && lastKnownContent !== initialEditorContent) {
                        editorNow.setValue(lastKnownContent, -1);
                        editorNow.focus();
                        // Cursor ans Ende setzen
                        editorNow.navigateFileEnd();
                    }
                }, 50);
            }
        });
    }

    // Content-Protection mit Verzögerung einrichten (warten bis Editor bereit ist)
    setTimeout(setupContentProtection, 100);
    setTimeout(setupContentProtection, 500);
    setTimeout(setupContentProtection, 1000);

    // Fokus-Keeper: Halte den Fokus auf dem Editor bis die Seite fertig geladen ist
    let focusKeeperActive = true;
    const focusKeeperInterval = setInterval(() => {
        if (focusKeeperActive) {
            focusAceEditor();
        }
    }, 500);

    // Nach dem Badge-Fix (Seite geladen) den Focus-Keeper stoppen
    // aber den Fokus ein letztes Mal setzen
    const stopFocusKeeper = () => {
        focusKeeperActive = false;
        clearInterval(focusKeeperInterval);
        document.removeEventListener('click', onUserInteraction);
        document.removeEventListener('focusin', onUserInteraction);

        // Content-Protection deaktivieren nach dem Laden
        userHasTyped = false;
        initialEditorContent = null;
    };

    // Stoppe Focus-Keeper wenn User mit anderen Elementen interagiert
    const onUserInteraction = (e) => {
        if (!focusKeeperActive) return;

        const target = e.target;
        const aceEditor = document.querySelector('#ace-editor');

        // Ignoriere Klicks im ACE-Editor
        if (aceEditor && aceEditor.contains(target)) return;

        // Ignoriere Klicks auf die Panel-Icons (diese sollen funktionieren)
        if (target.closest('.gutter-panel-icons')) return;

        // Bei Interaktion mit Buttons, Selects, Inputs etc. Focus-Keeper stoppen
        const interactiveElements = ['BUTTON', 'SELECT', 'INPUT', 'TEXTAREA', 'A', 'LABEL'];
        const isInteractive = interactiveElements.includes(target.tagName) ||
                             target.closest('button, select, input, textarea, a, .dropdown, .form-select, .btn');

        if (isInteractive) {
            stopFocusKeeper();
        }
    };

    document.addEventListener('click', onUserInteraction);
    document.addEventListener('focusin', onUserInteraction);

    // Speziell: Abbrechen-Button beobachten
    const watchCancelButton = () => {
        const cancelBtn = document.querySelector('button.btn-danger');
        if (cancelBtn && !cancelBtn.dataset.focusKeeperWatched) {
            cancelBtn.dataset.focusKeeperWatched = 'true';
            cancelBtn.addEventListener('click', () => {
                stopFocusKeeper();
            });
        }
    };
    watchCancelButton();
    setTimeout(watchCancelButton, 500);
    setTimeout(watchCancelButton, 1000);

    // MutationObserver um auf Badge zu warten (Seite kann bis zu 1 Minute laden)
    if (!badgeFixApplied) {
        const badgeObserver = new MutationObserver(() => {
            if (fixInitialBadgeText()) {
                badgeObserver.disconnect();
                // Seite ist geladen, Focus-Keeper kann stoppen
                setTimeout(stopFocusKeeper, 1000);
            }
        });
        badgeObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        // Timeout nach 2 Minuten um Observer und Focus-Keeper zu stoppen
        setTimeout(() => {
            badgeObserver.disconnect();
            stopFocusKeeper();
        }, 120000);
    } else {
        // Badge bereits gefixed, stoppe Focus-Keeper nach kurzer Zeit
        setTimeout(stopFocusKeeper, 2000);
    }

    // Initialer Fokus
    setTimeout(focusAceEditor, 100);

    // Styles für unsichtbare Tooltips hinzufügen
    addSilentTooltipStyles();

    // Listener für Filter-Radiobuttons hinzufügen
    setupFilterListener();

    // Nach kurzer Verzögerung automatisch alle Warnungen sammeln
    // autoOpenPanel = true: Panel automatisch öffnen wenn Warnungen gefunden
    setTimeout(() => {
        const icons = document.querySelectorAll('svg.bi-exclamation-triangle-fill');
        if (icons.length > 0 && !panelAutoOpened) {
            panelAutoOpened = true;
            silentCollectAllWarnings(true);
        } else {
            silentCollectAllWarnings(false);
        }
    }, 800);

    // Funktion zum Einrichten des Filter-Listeners
    function setupFilterListener() {
        // Suche nach Filter-Radiobuttons
        const filterRadios = document.querySelectorAll('input[type="radio"][name="filter"]');

        filterRadios.forEach(radio => {
            if (radio.dataset.warningFilterAdded) return;
            radio.dataset.warningFilterAdded = 'true';

            radio.addEventListener('change', () => {
                // Warnungen zurücksetzen und neu sammeln
                resetWarnings();
            });
        });

        // Observer für dynamisch hinzugefügte Filter-Radiobuttons
        const filterObserver = new MutationObserver(() => {
            const newRadios = document.querySelectorAll('input[type="radio"][name="filter"]:not([data-warning-filter-added])');
            newRadios.forEach(radio => {
                radio.dataset.warningFilterAdded = 'true';
                radio.addEventListener('change', () => {
                    resetWarnings();
                });
            });
        });

        // Beobachte das Dokument für neue Filter-Radiobuttons
        filterObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Observer für dynamisch hinzugefügte Icons
    const errorIconObserver = new MutationObserver((mutations) => {
        // Debounce um mehrfache Aufrufe zu vermeiden
        if (errorIconObserver._timeout) {
            clearTimeout(errorIconObserver._timeout);
        }
        errorIconObserver._timeout = setTimeout(() => {
            fixPointerEvents();
            addClickHandlers();
            // Neue Icons automatisch sammeln
            const uncollected = document.querySelectorAll('svg.bi-exclamation-triangle-fill:not([data-warning-collected])');
            if (uncollected.length > 0) {
                // Bei erstem Erscheinen von Icons auch Panel öffnen
                if (!panelAutoOpened) {
                    panelAutoOpened = true;
                    silentCollectAllWarnings(true);
                } else {
                    silentCollectAllWarnings(false);
                }
            }
        }, 300);
    });

    // Beobachte Änderungen im DOM
    errorIconObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Spezieller Observer für Style-Änderungen an Icons
    // Reagiert sofort wenn React pointer-events ändert
    const styleObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.matches && target.matches('svg.bi-exclamation-triangle-fill')) {
                    if (target.style.pointerEvents === 'none') {
                        target.style.pointerEvents = '';
                    }
                }
            }
        }
    });

    // Beobachte Style-Änderungen im gesamten Dokument
    styleObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['style'],
        subtree: true
    });

    // Periodischer Check für dynamisch hinzugefügte Icons (nach AJAX-Requests)
    setInterval(() => {
        fixPointerEvents();
        addClickHandlers();
        // Neue Icons automatisch sammeln
        const uncollected = document.querySelectorAll('svg.bi-exclamation-triangle-fill:not([data-warning-collected])');
        if (uncollected.length > 0) {
            silentCollectAllWarnings();
        }
    }, 2000);

    // ========================================================================
    // MASKIERUNGS-TOOL (Eingabefeld + 🔤-Icon)
    // ========================================================================

    // Funktion zum Hinzufügen des Maskierungs-Tools
    function addMaskingTool() {
        // Finde den "Spalten" Button
        const columnsButton = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.includes('Spalten') && btn.querySelector('svg.bi-layout-three-columns')
        );

        if (!columnsButton) {
            return;
        }

        // Prüfe ob Tool bereits existiert (als nextSibling des Buttons)
        if (columnsButton.nextElementSibling && columnsButton.nextElementSibling.classList.contains('masking-tool-container')) {
            return;
        }

        // Container für das Tool
        const toolContainer = document.createElement('div');
        toolContainer.className = 'masking-tool-container';
        toolContainer.style.display = 'flex';
        toolContainer.style.gap = '4px';
        toolContainer.style.alignItems = 'center';

        // Eingabefeld
        const maskInput = document.createElement('input');
        maskInput.type = 'text';
        maskInput.className = 'form-control form-control-sm masking-input';
        maskInput.placeholder = 'Text maskieren...';
        maskInput.style.width = '150px';
        maskInput.style.fontSize = '12px';
        maskInput.style.padding = '2px 6px';

        // Maskierungs-Icon (🔤)
        const maskIcon = document.createElement('button');
        maskIcon.type = 'button';
        maskIcon.innerHTML = '🔤';
        maskIcon.className = 'btn btn-sm btn-outline-secondary masking-icon-btn';
        maskIcon.style.padding = '2px 6px';
        maskIcon.style.fontSize = '14px';
        maskIcon.style.lineHeight = '1';
        maskIcon.style.minWidth = '32px';
        maskIcon.style.cursor = 'pointer';
        maskIcon.title = 'Text maskieren und kopieren';

        maskIcon.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const inputText = maskInput.value.trim();
            if (!inputText) {
                maskIcon.style.color = 'orange';
                setTimeout(() => {
                    maskIcon.style.color = '';
                }, 300);
                return;
            }

            const maskedText = escapeRegexSpecialChars(inputText);
            const success = await copyToClipboard(maskedText);

            if (success) {
                // Bestätigung anzeigen
                maskIcon.innerHTML = '✓';
                maskIcon.style.color = 'green';
                maskInput.value = '';

                setTimeout(() => {
                    maskIcon.innerHTML = '🔤';
                    maskIcon.style.color = '';
                }, 500);
            } else {
                maskIcon.style.color = 'red';
                setTimeout(() => {
                    maskIcon.style.color = '';
                }, 500);
            }
        });

        // Enter-Taste im Eingabefeld
        maskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                maskIcon.click();
            }
        });

        toolContainer.appendChild(maskInput);
        toolContainer.appendChild(maskIcon);

        // Tool direkt nach dem Button als nächster Sibling einfügen
        columnsButton.parentNode.insertBefore(toolContainer, columnsButton.nextSibling);
    }

    // Tool initialisieren
    setTimeout(() => {
        addMaskingTool();
    }, 1500);

    // Observer um Tool bei DOM-Änderungen erneut zu prüfen
    const maskingToolObserver = new MutationObserver(() => {
        addMaskingTool();
    });

    maskingToolObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();