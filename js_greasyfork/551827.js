// ==UserScript==
// @name         enhanced alpha.pl
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.0.7
// @description  Fügt bei Textfeldern Maskieren- und Löschen-Buttons hinzu und bietet ein Zwischeneingabefeld für schnelle DB-Feld-Suchen mit konfigurierbaren Shortcuts.
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/pv-edit/alpha.pl*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/551827/enhanced%20alphapl.user.js
// @updateURL https://update.greasyfork.org/scripts/551827/enhanced%20alphapl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS für Dropdown und Icons hinzufügen
    const style = document.createElement('style');
    style.textContent = `
        .gh-dropdown {
            display: none;
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 200px;
            max-height: 300px;
            overflow-y: auto;
        }
        .gh-dropdown.active {
            display: block;
        }
        .gh-dropdown__item {
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gh-dropdown__item:hover {
            background-color: #f0f0f0;
        }
        .gh-dropdown__item:last-child {
            border-bottom: none;
        }
        .gh-dropdown__item.selected {
            background-color: #e3f2fd;
        }
        .gh-dropdown__item-text {
            flex: 1;
        }
        .gh-dropdown__item-actions {
            display: flex;
            gap: 4px;
        }
        .gh-dropdown__action-btn {
            width: 20px;
            height: 20px;
            border: 1px solid #ccc;
            background: white;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            line-height: 18px;
            text-align: center;
            padding: 0;
            transition: all 0.2s;
        }
        .gh-dropdown__action-btn:hover:not(.disabled) {
            background: #f0f0f0;
        }
        .gh-dropdown__action-btn.plus {
            color: #28a745;
        }
        .gh-dropdown__action-btn.minus {
            color: #dc3545;
        }
        .gh-dropdown__action-btn.disabled {
            color: #ccc;
            cursor: not-allowed;
            opacity: 0.5;
        }
        .gh-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 2px;
            text-align: center;
            user-select: none;
            transition: all 0.2s;
        }
        .gh-icon:hover:not(.disabled) {
            background: #e8e8e8;
            border-color: #bbb;
            transform: scale(1.1);
        }
        .gh-icon:active:not(.disabled) {
            background: #d8d8d8;
            transform: scale(0.95);
        }
        .gh-icon.disabled {
            opacity: 0.3;
            cursor: not-allowed;
            background: #f5f5f5;
        }
        .gh-icons-container {
            display: flex;
            flex-direction: column;
            gap: 0;
            margin-left: 5px;
        }
        .gh-icon-pair {
            display: flex !important;
            flex-direction: column !important;
            align-items: center;
            gap: 0;
        }
        .gh-textarea-wrapper {
            display: inline-block;
            width: 97%;
            vertical-align: top;
        }
        .gh-textarea-container {
            display: flex;
            align-items: flex-start;
        }
        .gh-temp-textarea {
            width: 97%;
            overflow: hidden;
            overflow-wrap: break-word;
            resize: vertical;
            background-color: #fafafa;
            border: 2px solid #007bff;
        }
        .gh-shortcut-btn {
            display: inline-block;
            margin-left: 5px;
            padding: 5px 10px;
            background: #007bff;
            color: white;
            border: 1px solid #0056b3;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }
        .gh-shortcut-btn:hover {
            background: #0056b3;
        }
        .gh-shortcut-btn:active {
            background: #004085;
        }
        .gh-shortcuts-container {
            display: inline-block;
            margin-left: 10px;
        }
        .gh-separator {
            border: 0;
            border-top: 3px solid #007bff;
            margin: 10px 0;
            width: 97%;
        }
        .gh-db-button {
            border: 2px solid #007bff !important;
        }

        /* Heute Button Styles */
        .gh-heute-btn {
            background-color: #007bff;
            color: white;
            border: 1px solid #0056b3;
            border-radius: 2px;
            padding: 2px 5px;
            cursor: pointer;
            font-size: 6px;
            font-weight: 600;
            transition: all 0.2s;
            margin-left: 4px;
            white-space: nowrap;
            display: inline;
            vertical-align: middle;
            text-transform: uppercase;
            line-height: 1.2;
            letter-spacing: 0.3px;
        }

        .gh-heute-btn:hover {
            background-color: #0056b3;
        }

        .gh-heute-btn:active {
            background-color: #004085;
            transform: scale(0.98);
        }

        /* Prevent line break in date fields TD */
        td.gh-date-container {
            white-space: nowrap !important;
        }

        /* Reduce spacing between label text and date inputs */
        label.datelbl input {
            margin-left: -2px;
        }

        /* AGR Shortcuts Styles */
        .agr-shortcuts-container {
            display: inline-flex;
            gap: 5px;
            align-items: center;
            flex-wrap: wrap;
            margin-top: 5px;
        }

        .agr-add-btn {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            width: 28px;
            height: 28px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
            padding: 0;
            line-height: 1;
        }

        .agr-add-btn:hover:not(:disabled) {
            background-color: #0056b3;
        }

        .agr-add-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            opacity: 0.6;
        }

        .agr-shortcut-btn {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 5px 12px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            min-width: 30px;
            text-align: center;
        }

        .agr-shortcut-btn:hover {
            background-color: #e9ecef;
            border-color: #adb5bd;
        }

        .agr-shortcut-btn.active {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
        }

        .agr-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            align-items: center;
            justify-content: center;
        }

        .agr-overlay.active {
            display: flex;
        }

        .agr-overlay-content {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            width: 400px;
            max-width: 90%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .agr-overlay-content h3 {
            margin-top: 0;
            margin-bottom: 20px;
            color: #333;
        }

        .agr-form-group {
            margin-bottom: 15px;
        }

        .agr-form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }

        .agr-form-group input,
        .agr-form-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }

        .agr-overlay-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
        }

        .agr-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        }

        .agr-btn-primary {
            background-color: #007bff;
            color: white;
        }

        .agr-btn-primary:hover {
            background-color: #0056b3;
        }

        .agr-btn-danger {
            background-color: #dc3545;
            color: white;
        }

        .agr-btn-danger:hover {
            background-color: #c82333;
        }
    `;
    document.head.appendChild(style);

    // Schnellbutton-Konfiguration laden/speichern
    function loadQuickButtons() {
        try {
            const saved = GM_getValue('gh_quickButtons', '[]');
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }

    function saveQuickButtons(buttons) {
        try {
            const compacted = buttons.filter(item => item !== null);
            GM_setValue('gh_quickButtons', JSON.stringify(compacted));
        } catch (e) {
            // Fehler beim Speichern
        }
    }

    // Shortcut-Button erstellen
    function createShortcutButton(field, container) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gh-shortcut-btn';
        btn.textContent = field;
        btn.title = `Feld: ${field} (Rechtsklick zum Entfernen)`;

        // Linksklick: Feld verwenden
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            processField(field);
        });

        // Rechtsklick: Button entfernen
        btn.addEventListener('contextmenu', function(e) {
            e.preventDefault();

            // Button aus Array entfernen
            let buttons = loadQuickButtons();
            const index = buttons.indexOf(field);
            if (index > -1) {
                buttons.splice(index, 1);
                saveQuickButtons(buttons);
            }

            // Button aus DOM entfernen
            btn.remove();

            // Dropdown-Buttons aktualisieren
            updateDropdownButtonStates();
        });

        container.appendChild(btn);
    }

    // Alle Shortcut-Buttons rendern
    function renderShortcutButtons(container) {
        // Container leeren
        container.innerHTML = '';

        // Buttons laden und erstellen
        const buttons = loadQuickButtons();
        buttons.forEach(field => {
            createShortcutButton(field, container);
        });
    }

    // Dropdown-Button-States aktualisieren
    function updateDropdownButtonStates() {
        const savedButtons = loadQuickButtons();

        document.querySelectorAll('.gh-dropdown__item').forEach(item => {
            const field = item.querySelector('.gh-dropdown__item-text').textContent;
            const plusBtn = item.querySelector('.gh-dropdown__action-btn.plus');
            const minusBtn = item.querySelector('.gh-dropdown__action-btn.minus');

            const isShortcut = savedButtons.includes(field);

            if (isShortcut) {
                // Plus deaktivieren, Minus aktivieren
                plusBtn.classList.add('disabled');
                minusBtn.classList.remove('disabled');
            } else {
                // Plus aktivieren, Minus deaktivieren
                plusBtn.classList.remove('disabled');
                minusBtn.classList.add('disabled');
            }
        });
    }

    // Funktion zum Verarbeiten eines DB-Feldes
    function processField(field) {
        const tempInput = document.getElementById('gh-temp-input');
        const syntaxTextarea = document.getElementById('syntax');

        if (!tempInput || !syntaxTextarea) return;

        const tempValue = tempInput.value.trim();
        if (!tempValue) return;

        const maskedValue = maskText(tempValue, false); // OHNE Tilde
        const result = `${field}~'${maskedValue}'`;

        // Füge den maskierten Text ins Syntax-Feld ein
        const currentSyntax = syntaxTextarea.value.trim();
        const newValue = currentSyntax
            ? currentSyntax + ' ' + result
            : result;

        setTextareaValue(syntaxTextarea, newValue);

        // Leere das Eingabefeld
        tempInput.value = '';
        const inputEvent = new Event('input', { bubbles: true });
        tempInput.dispatchEvent(inputEvent);
    }

    // Toggle Dropdown
    function toggleDropdown(button, dropdown) {
        const isActive = dropdown.classList.contains('active');

        // Schließe alle anderen Dropdowns
        document.querySelectorAll('.gh-dropdown').forEach(dd => {
            dd.classList.remove('active');
        });

        if (!isActive) {
            // Positioniere das Dropdown
            const rect = button.getBoundingClientRect();
            dropdown.style.position = 'absolute';
            dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
            dropdown.style.left = rect.left + 'px';
            dropdown.classList.add('active');

            // Button-States aktualisieren
            updateDropdownButtonStates();
        }
    }

    // Schließe Dropdown beim Klick außerhalb
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.top_button') && !e.target.closest('.gh-dropdown')) {
            document.querySelectorAll('.gh-dropdown').forEach(dd => {
                dd.classList.remove('active');
            });
        }
    });

    // Funktion zum Setzen des Textarea-Werts mit Undo-Unterstützung
    function setTextareaValue(textarea, newValue) {
        // Fokussiere das Textarea-Element
        textarea.focus();

        // Selektiere den gesamten Inhalt
        textarea.select();

        // Verwende execCommand für Undo-Unterstützung
        // Falls das nicht funktioniert, verwende insertText als Fallback
        if (document.execCommand) {
            document.execCommand('insertText', false, newValue);
        } else {
            // Fallback für neuere Browser
            textarea.setRangeText(newValue, 0, textarea.value.length, 'end');
        }

        // Trigger input event für Kompatibilität
        const event = new Event('input', { bubbles: true, cancelable: true });
        textarea.dispatchEvent(event);
    }

    // Funktion zum Maskieren des Texts
    function maskText(text, addTilde = true) {
        if (!text) return text;

        let masked = text;

        masked = masked.replace(/[ \t\n\r]/g, '\\s');
        masked = masked.replace(/\+/g, '\\+');
        masked = masked.replace(/\(/g, '\\(');
        masked = masked.replace(/\)/g, '\\)');
        masked = masked.replace(/\[/g, '\\[');
        masked = masked.replace(/\]/g, '\\]');
        masked = masked.replace(/\./g, '\\.');
        masked = masked.replace(/\//g, '\\/');

        if (addTilde) {
            masked = '~' + masked;
        }

        return masked;
    }

    // Funktion zum Aktualisieren des Löschen-Icon-Status
    function updateDeleteIconState(textarea, deleteIcon) {
        if (textarea.value.trim() === '') {
            deleteIcon.classList.add('disabled');
        } else {
            deleteIcon.classList.remove('disabled');
        }
    }

    // Funktion zum Hinzufügen von Icons neben einer Textarea
    function addIconsToTextarea(textarea) {
        const container = document.createElement('div');
        container.className = 'gh-textarea-container';

        const wrapper = document.createElement('div');
        wrapper.className = 'gh-textarea-wrapper';

        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'gh-icons-container';

        // Berechne die Höhe des Eingabefelds
        const textareaHeight = textarea.offsetHeight || 60;
        const iconHeight = textareaHeight / 2;
        const iconWidth = iconHeight * 0.8; // Etwas schmaler als hoch

        // Icon-Paar 1: Maskieren
        const maskPair = document.createElement('div');
        maskPair.className = 'gh-icon-pair';

        const maskIcon = document.createElement('span');
        maskIcon.className = 'gh-icon';
        maskIcon.textContent = '🔤';
        maskIcon.title = 'Text maskieren';
        maskIcon.style.width = iconWidth + 'px';
        maskIcon.style.height = iconHeight + 'px';
        maskIcon.style.fontSize = (iconHeight * 0.6) + 'px';

        const deleteMaskIcon = document.createElement('span');
        deleteMaskIcon.className = 'gh-icon';
        deleteMaskIcon.textContent = '🗑️';
        deleteMaskIcon.title = 'Eingabefeld leeren';
        deleteMaskIcon.style.width = iconWidth + 'px';
        deleteMaskIcon.style.height = iconHeight + 'px';
        deleteMaskIcon.style.fontSize = (iconHeight * 0.6) + 'px';

        // Initial State für Löschen-Icon
        updateDeleteIconState(textarea, deleteMaskIcon);

        // Event-Listener für Maskieren
        maskIcon.addEventListener('click', function(e) {
            e.preventDefault();
            if (textarea.value.trim()) {
                setTextareaValue(textarea, maskText(textarea.value));
            }
        });

        // Event-Listener für Löschen
        deleteMaskIcon.addEventListener('click', function(e) {
            e.preventDefault();
            if (!deleteMaskIcon.classList.contains('disabled')) {
                setTextareaValue(textarea, '');
                updateDeleteIconState(textarea, deleteMaskIcon);
            }
        });

        // Event-Listener für Textarea-Änderungen
        textarea.addEventListener('input', function() {
            updateDeleteIconState(textarea, deleteMaskIcon);
        });

        maskPair.appendChild(maskIcon);
        maskPair.appendChild(deleteMaskIcon);
        iconsContainer.appendChild(maskPair);

        textarea.parentNode.insertBefore(container, textarea);
        wrapper.appendChild(textarea);
        container.appendChild(wrapper);
        container.appendChild(iconsContainer);
    }

    // Funktion zum Hinzufügen eines Löschen-Icons für das syntax textarea (Datenbank Suche)
    function addDeleteIconToSyntaxTextarea(syntaxTextarea) {
        const container = document.createElement('div');
        container.className = 'gh-textarea-container';

        const wrapper = document.createElement('div');
        wrapper.className = 'gh-textarea-wrapper';

        const deleteIcon = document.createElement('span');
        deleteIcon.className = 'gh-icon';
        deleteIcon.textContent = '🗑️';
        deleteIcon.title = 'Eingabefeld leeren';

        // Icon-Größe wie bei den anderen Textareas: halbe Höhe des Eingabefelds
        const textareaHeight = syntaxTextarea.offsetHeight || 40;
        const iconHeight = textareaHeight / 2;
        const iconWidth = iconHeight * 0.8;
        deleteIcon.style.width = iconWidth + 'px';
        deleteIcon.style.height = iconHeight + 'px';
        deleteIcon.style.fontSize = (iconHeight * 0.6) + 'px';

        // Initial State
        updateDeleteIconState(syntaxTextarea, deleteIcon);

        // Event-Listener für Löschen
        deleteIcon.addEventListener('click', function(e) {
            e.preventDefault();
            if (!deleteIcon.classList.contains('disabled')) {
                setTextareaValue(syntaxTextarea, '');
                updateDeleteIconState(syntaxTextarea, deleteIcon);
            }
        });

        // Event-Listener für Textarea-Änderungen
        syntaxTextarea.addEventListener('input', function() {
            updateDeleteIconState(syntaxTextarea, deleteIcon);
        });

        // DOM-Struktur aufbauen
        syntaxTextarea.parentNode.insertBefore(container, syntaxTextarea);
        wrapper.appendChild(syntaxTextarea);
        container.appendChild(wrapper);
        container.appendChild(deleteIcon);
    }

    // ========================================
    // AGR SHORTCUT MANAGER
    // ========================================

    class AGRShortcutManager {
        constructor() {
            this.shortcuts = [];
            this.currentEditingIndex = null;
            this.nextDefaultNumber = 1;
            this.storageKey = 'agr_shortcuts_data';
        }

        init() {
            this.loadShortcuts();
            this.createUI();
            this.createOverlay();
        }

        createUI() {
            // Finde das AGR Filter Dropdown
            const agrFilter = document.getElementById('agr_filter');
            if (!agrFilter) return;

            // Finde die Parent-Table-Row
            const tr = agrFilter.closest('tr');
            if (!tr) return;

            // Erstelle eine neue Zeile für die Shortcuts
            const newRow = document.createElement('tr');
            const td = document.createElement('td');

            // Container für Shortcuts
            const container = document.createElement('div');
            container.className = 'agr-shortcuts-container';
            container.id = 'agr-shortcuts-container';

            // Plus Button
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'agr-add-btn';
            addBtn.id = 'agr-add-btn';
            addBtn.textContent = '+';
            addBtn.title = 'Shortcut hinzufügen';

            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addNewShortcut();
            });

            container.appendChild(addBtn);
            td.appendChild(container);
            newRow.appendChild(td);

            // Füge die neue Zeile nach dem AGR Filter ein
            tr.parentNode.insertBefore(newRow, tr.nextSibling);

            this.container = container;
            this.addButton = addBtn;

            this.renderShortcuts();
            this.updateAddButtonState();
        }

        createOverlay() {
            const overlay = document.createElement('div');
            overlay.className = 'agr-overlay';
            overlay.id = 'agr-shortcut-overlay';

            overlay.innerHTML = `
                <div class="agr-overlay-content">
                    <h3>Shortcut Konfiguration</h3>

                    <div class="agr-form-group">
                        <label for="agr-shortcut-name">Shortcut Bezeichnung:</label>
                        <input type="text" id="agr-shortcut-name" placeholder="z.B. 1, 2, 3...">
                    </div>

                    <div class="agr-form-group">
                        <label for="agr-shortcut-search">Suchtext:</label>
                        <input type="text" id="agr-shortcut-search" placeholder="Suchtext für kat_filter">
                    </div>

                    <div class="agr-form-group">
                        <label for="agr-shortcut-agr">AGR:</label>
                        <select id="agr-shortcut-agr">
                            <option value="">Alle</option>
                            <option value="AGR-CE">AGR-CE</option>
                            <option value="AGR-HH">AGR-HH</option>
                            <option value="AGR-HW">AGR-HW</option>
                            <option value="AGR-SP/SWG">AGR-SP/SWG</option>
                        </select>
                    </div>

                    <div class="agr-overlay-buttons">
                        <button type="button" class="agr-btn agr-btn-danger" id="agr-delete-btn">Shortcut löschen</button>
                        <button type="button" class="agr-btn agr-btn-primary" id="agr-save-btn">OK</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            this.overlay = overlay;

            // Event Listeners
            document.getElementById('agr-save-btn').addEventListener('click', () => this.saveShortcut());
            document.getElementById('agr-delete-btn').addEventListener('click', () => this.deleteShortcut());

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeOverlay();
                }
            });

            // Escape-Taste zum Schließen des Overlays
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                    this.closeOverlay();
                }
            });
        }

        addNewShortcut() {
            const emptyShortcut = {
                name: '•',
                searchText: '',
                agr: ''
            };

            this.shortcuts.push(emptyShortcut);
            this.updateAddButtonState();
            this.renderShortcuts();
            this.saveShortcuts();
        }

        renderShortcuts() {
            if (!this.container) return;

            // Entferne alle existierenden Shortcut-Buttons (aber nicht den + Button)
            const existingButtons = this.container.querySelectorAll('.agr-shortcut-btn');
            existingButtons.forEach(btn => btn.remove());

            // Erstelle neue Buttons
            this.shortcuts.forEach((shortcut, index) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'agr-shortcut-btn';
                btn.textContent = shortcut.name;
                btn.dataset.index = index;
                btn.title = shortcut.searchText ?
                    `${shortcut.name}: ${shortcut.searchText}${shortcut.agr ? ' (' + shortcut.agr + ')' : ''}` :
                    'Leer - Rechtsklick zum Konfigurieren';

                // Linksklick: Shortcut aktivieren
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.activateShortcut(index);
                });

                // Rechtsklick: Konfiguration öffnen
                btn.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.openOverlay(index);
                });

                // Füge Button VOR dem + Button ein
                this.container.insertBefore(btn, this.addButton);
            });
        }

        activateShortcut(index) {
            const shortcut = this.shortcuts[index];

            // Nur aktivieren wenn Suchtext vorhanden
            if (!shortcut.searchText) {
                return;
            }

            const katFilter = document.getElementById('kat_filter');
            const agrFilter = document.getElementById('agr_filter');

            if (katFilter) {
                katFilter.value = shortcut.searchText;
            }

            if (agrFilter) {
                agrFilter.value = shortcut.agr;
            }

            // Trigger die bestehenden Events manuell
            if (katFilter) {
                // Trigger onkeyup Event
                const keyupEvent = new KeyboardEvent('keyup', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    keyCode: 13
                });
                katFilter.dispatchEvent(keyupEvent);

                // Fallback: Rufe kat_filter_chg direkt auf falls definiert
                if (typeof window.kat_filter_chg === 'function') {
                    const nozzz = document.SearchForm ? document.SearchForm['nozzz'].checked : false;
                    window.kat_filter_chg(katFilter, agrFilter, nozzz);
                }
            }

            if (agrFilter) {
                // Trigger onchange Event
                const changeEvent = new Event('change', {
                    bubbles: true,
                    cancelable: true
                });
                agrFilter.dispatchEvent(changeEvent);

                // Fallback: Rufe template_filter_chg direkt auf falls definiert
                if (typeof window.template_filter_chg === 'function') {
                    const templateFilter = document.getElementById('template_filter');
                    if (templateFilter) {
                        window.template_filter_chg(templateFilter, agrFilter);
                    }
                }
            }
        }

        openOverlay(index) {
            this.currentEditingIndex = index;
            const shortcut = this.shortcuts[index];

            document.getElementById('agr-shortcut-name').value = shortcut.name;
            document.getElementById('agr-shortcut-search').value = shortcut.searchText;
            document.getElementById('agr-shortcut-agr').value = shortcut.agr;

            this.overlay.classList.add('active');
        }

        closeOverlay() {
            this.overlay.classList.remove('active');
            this.currentEditingIndex = null;
        }

        saveShortcut() {
            if (this.currentEditingIndex === null) return;

            const name = document.getElementById('agr-shortcut-name').value.trim();
            const searchText = document.getElementById('agr-shortcut-search').value.trim();
            const agr = document.getElementById('agr-shortcut-agr').value;

            const wasEmpty = !this.shortcuts[this.currentEditingIndex].searchText;

            this.shortcuts[this.currentEditingIndex] = {
                name: name || this.shortcuts[this.currentEditingIndex].name,
                searchText: searchText,
                agr: agr
            };

            if (wasEmpty && searchText) {
                this.updateAddButtonState();
            }

            this.renderShortcuts();
            this.saveShortcuts();
            this.closeOverlay();
        }

        deleteShortcut() {
            if (this.currentEditingIndex === null) return;

            this.shortcuts.splice(this.currentEditingIndex, 1);

            // Wenn alle Shortcuts gelöscht wurden, setze nextDefaultNumber zurück auf 1
            if (this.shortcuts.length === 0) {
                this.nextDefaultNumber = 1;
            }

            this.updateAddButtonState();
            this.renderShortcuts();
            this.saveShortcuts();
            this.closeOverlay();
        }

        hasEmptyShortcut() {
            return this.shortcuts.some(shortcut => !shortcut.searchText);
        }

        updateAddButtonState() {
            if (!this.addButton) return;

            // Button immer aktiviert lassen - mehrere leere Shortcuts erlauben
            this.addButton.disabled = false;
        }

        saveShortcuts() {
            try {
                const data = {
                    shortcuts: this.shortcuts,
                    nextDefaultNumber: this.nextDefaultNumber
                };
                GM_setValue(this.storageKey, JSON.stringify(data));
            } catch (e) {
                // Fehler beim Speichern
            }
        }

        loadShortcuts() {
            try {
                const saved = GM_getValue(this.storageKey, null);

                if (saved) {
                    const data = JSON.parse(saved);
                    this.shortcuts = data.shortcuts || [];
                    this.nextDefaultNumber = data.nextDefaultNumber || 1;
                }
            } catch (e) {
                this.shortcuts = [];
                this.nextDefaultNumber = 1;
            }
        }
    }

    // Warte bis die Seite geladen ist
    window.addEventListener('load', function() {
        const nameTextarea = document.getElementById('name');
        const descTextarea = document.getElementById('desc');
        const syntaxTextarea = document.getElementById('syntax');

        if (nameTextarea) {
            addIconsToTextarea(nameTextarea);
        }

        if (descTextarea) {
            addIconsToTextarea(descTextarea);
        }

        if (syntaxTextarea) {
            // Trennlinie VOR dem DB-Bereich
            const topSeparator = document.createElement('hr');
            topSeparator.className = 'gh-separator';

            // Erstelle das temporäre Eingabefeld
            const tempTextarea = document.createElement('textarea');
            tempTextarea.className = 'animated gh-temp-textarea';
            tempTextarea.id = 'gh-temp-input';
            tempTextarea.rows = 2;
            tempTextarea.placeholder = 'Zwischeneingabe für DB-Suche';
            tempTextarea.style.marginTop = '3px';

            // Container für Button und Shortcuts
            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '5px';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.alignItems = 'center';

            // Erstelle den DB-Felder Button
            const dbButton = document.createElement('button');
            dbButton.type = 'button';
            dbButton.className = 'top_button btn-labels gh-db-button';
            dbButton.textContent = 'DB-Felder';

            // Container für Shortcut-Buttons
            const shortcutsContainer = document.createElement('div');
            shortcutsContainer.className = 'gh-shortcuts-container';

            // Trennlinie NACH dem DB-Bereich
            const bottomSeparator = document.createElement('hr');
            bottomSeparator.className = 'gh-separator';

            // Erstelle das Dropdown mit + und - Icons
            const dbDropdown = document.createElement('div');
            dbDropdown.className = 'gh-dropdown';

            const fields = ['name', 'desc', 'hinweis', 'hersteller', 'matchrule'];
            fields.forEach(field => {
                const item = document.createElement('div');
                item.className = 'gh-dropdown__item';

                const textSpan = document.createElement('span');
                textSpan.className = 'gh-dropdown__item-text';
                textSpan.textContent = field;

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'gh-dropdown__item-actions';

                // Plus-Button
                const plusBtn = document.createElement('button');
                plusBtn.className = 'gh-dropdown__action-btn plus';
                plusBtn.textContent = '+';
                plusBtn.title = 'Als Shortcut hinzufügen';
                plusBtn.onclick = (e) => {
                    e.stopPropagation();

                    // Prüfen ob bereits disabled
                    if (plusBtn.classList.contains('disabled')) {
                        return;
                    }

                    let buttons = loadQuickButtons();
                    if (!buttons.includes(field)) {
                        buttons.push(field);
                        saveQuickButtons(buttons);
                        renderShortcutButtons(shortcutsContainer);
                        updateDropdownButtonStates();
                    }
                };

                // Minus-Button
                const minusBtn = document.createElement('button');
                minusBtn.className = 'gh-dropdown__action-btn minus';
                minusBtn.textContent = '−';
                minusBtn.title = 'Shortcut entfernen';
                minusBtn.onclick = (e) => {
                    e.stopPropagation();

                    // Prüfen ob bereits disabled
                    if (minusBtn.classList.contains('disabled')) {
                        return;
                    }

                    let buttons = loadQuickButtons();
                    const index = buttons.indexOf(field);
                    if (index > -1) {
                        buttons.splice(index, 1);
                        saveQuickButtons(buttons);
                        renderShortcutButtons(shortcutsContainer);
                        updateDropdownButtonStates();
                    }
                };

                actionsDiv.appendChild(plusBtn);
                actionsDiv.appendChild(minusBtn);

                item.appendChild(textSpan);
                item.appendChild(actionsDiv);

                // Klick auf Text: Feld verwenden
                textSpan.onclick = (e) => {
                    e.stopPropagation();
                    processField(field);
                    dbDropdown.classList.remove('active');
                };

                dbDropdown.appendChild(item);
            });

            document.body.appendChild(dbDropdown);

            // Event-Listener für den DB-Felder Button
            dbButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown(dbButton, dbDropdown);
            });

            // Baue die Struktur zusammen
            buttonContainer.appendChild(dbButton);
            buttonContainer.appendChild(shortcutsContainer);

            // Füge alle Elemente in der richtigen Reihenfolge ein
            // 1. Obere Trennlinie
            syntaxTextarea.parentNode.insertBefore(topSeparator, syntaxTextarea.nextSibling);

            // 2. Temporäres Eingabefeld
            topSeparator.parentNode.insertBefore(tempTextarea, topSeparator.nextSibling);

            // 3. Button-Container
            tempTextarea.parentNode.insertBefore(buttonContainer, tempTextarea.nextSibling);

            // 4. Untere Trennlinie
            buttonContainer.parentNode.insertBefore(bottomSeparator, buttonContainer.nextSibling);

            // 5. Löschen-Icon zum syntax textarea (Datenbank Suche) hinzufügen
            addDeleteIconToSyntaxTextarea(syntaxTextarea);

            // Initial Shortcut-Buttons rendern
            renderShortcutButtons(shortcutsContainer);
        }

        // AGR Shortcuts initialisieren
        const agrShortcutManager = new AGRShortcutManager();
        agrShortcutManager.init();

        // Heute-Button für Datumsfelder hinzufügen
        const dateFromInput = document.getElementById('datefrom');
        const dateToInput = document.getElementById('dateto');

        if (dateFromInput && dateToInput) {
            // Finde das übergeordnete TD-Element
            const tdElement = dateFromInput.closest('td');

            if (tdElement) {
                // Verhindere Zeilenumbrüche im TD
                tdElement.classList.add('gh-date-container');

                // Erstelle den "Heute"-Button
                const heuteButton = document.createElement('button');
                heuteButton.type = 'button';
                heuteButton.className = 'gh-heute-btn';
                heuteButton.textContent = 'Heute';

                // Click-Handler für den Button
                heuteButton.addEventListener('click', function(e) {
                    e.preventDefault();

                    // Heutiges Datum im Format YYYY-MM-DD (für HTML5 date input)
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const dateString = `${year}-${month}-${day}`;

                    // Setze das heutige Datum in beiden Feldern
                    dateFromInput.value = dateString;
                    dateToInput.value = dateString;
                });

                // Füge den Button direkt nach dem letzten Label ein
                const lastLabel = dateToInput.closest('label');
                if (lastLabel && lastLabel.parentNode === tdElement) {
                    lastLabel.after(heuteButton);
                } else {
                    tdElement.appendChild(heuteButton);
                }
            }
        }
    });
})();