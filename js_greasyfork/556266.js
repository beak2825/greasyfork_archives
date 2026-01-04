// ==UserScript==
// @name         enhanced template editor
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      0.3.0
// @description  Gruppen-Spalten
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel/template*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/556266/enhanced%20template%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/556266/enhanced%20template%20editor.meta.js
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
    if (!window.location.pathname.startsWith('/kalif/artikel/template')) return;

    // Verhindere mehrfache Initialisierung im selben Fenster
    if (window.__enhancedTemplateEditorInitialized) return;
    window.__enhancedTemplateEditorInitialized = true;

    GM_addStyle(`
        .columns-override-btn {
            margin-left: auto;
            padding: 4px 10px;
            font-size: 13px;
            border: 1px solid #0065FD !important;
            border-radius: 4px;
            background: #0065FD !important;
            color: #fff !important;
            cursor: pointer;
            vertical-align: middle;
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        .columns-override-btn:hover:not(:disabled) {
            background: #0052cc !important;
            border-color: #0052cc !important;
        }
        .columns-override-btn:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed;
        }
        .columns-override-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .columns-override-dialog {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            min-width: 300px;
        }
        .columns-override-dialog h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
        }
        .columns-override-dialog input {
            width: 100%;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .columns-override-dialog input:invalid {
            border-color: #dc3545;
        }
        .columns-override-dialog .buttons {
            margin-top: 15px;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        .columns-override-dialog button {
            padding: 6px 16px;
            border-radius: 4px;
            border: 1px solid #ccc;
            cursor: pointer;
        }
        .columns-override-dialog .btn-confirm {
            background: #0d6efd;
            color: #fff;
            border-color: #0d6efd;
        }
        .columns-override-dialog .btn-confirm:hover {
            background: #0b5ed7;
        }
        .columns-override-dialog .btn-cancel:hover {
            background: #e9ecef;
        }
    `);

    function getColumnInputs() {
        return document.querySelectorAll('input[name="columns"][placeholder="2"]');
    }

    function updateButtonState(button) {
        const inputs = getColumnInputs();
        const count = inputs.length;
        const hasVisibleInputs = Array.from(inputs).some(input => {
            return input.offsetParent !== null;
        });

        // Prüfen ob die Seite gesperrt ist (im Modal-Header)
        const modalHeader = document.querySelector('.modal-dialog .modal-header');
        const isLocked = modalHeader && !!modalHeader.querySelector('button.btn-danger.btn-sm');

        button.textContent = `Spalten für ${count} Gruppen überschreiben`;
        button.disabled = !hasVisibleInputs || isLocked;
    }

    function showModal(groupCount, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'columns-override-modal';
        modal.innerHTML = `
            <div class="columns-override-dialog">
                <h3>Spaltenanzahl für ${groupCount} Gruppen überschreiben</h3>
                <input type="number" min="1" max="10" step="1" value="2" placeholder="Wert (1-10)">
                <div class="buttons">
                    <button class="btn-cancel">Abbrechen</button>
                    <button class="btn-confirm">Übernehmen</button>
                </div>
            </div>
        `;

        const input = modal.querySelector('input');
        const btnCancel = modal.querySelector('.btn-cancel');
        const btnConfirm = modal.querySelector('.btn-confirm');

        function close() {
            modal.remove();
        }

        function confirm() {
            const value = parseInt(input.value, 10);
            if (isNaN(value) || value < 1 || value > 10) {
                input.focus();
                input.select();
                return;
            }
            onConfirm(value);
            close();
        }

        btnCancel.addEventListener('click', close);
        btnConfirm.addEventListener('click', confirm);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') confirm();
            if (e.key === 'Escape') close();
        });

        document.body.appendChild(modal);
        input.focus();
        input.select();
    }

    function applyColumnValue(value) {
        const inputs = getColumnInputs();
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        
        inputs.forEach(input => {
            nativeInputValueSetter.call(input, value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    let buttonInserted = false;
    let insertObserver = null;

    function tryInsertButton() {
        // Prüfen ob der Button noch im DOM ist, sonst zurücksetzen
        if (buttonInserted) {
            const existingButton = document.querySelector('.columns-override-btn');
            if (!existingButton || !document.contains(existingButton)) {
                buttonInserted = false;
            } else {
                return;
            }
        }

        // Zuerst das Modal finden
        const modal = document.querySelector('.modal-dialog');
        if (!modal) {
            return;
        }

        // Prüfen ob es das richtige Modal ist (Templatezeile bearbeiten)
        const modalTitle = modal.querySelector('.modal-title.h4');
        if (!modalTitle || !modalTitle.textContent.includes('Templatezeile bearbeiten')) {
            return;
        }

        // Keys-Link NUR im Modal suchen
        const keysLink = modal.querySelector('a[href="/kalif/artikel/property"]');

        if (!keysLink) {
            return;
        }

        buttonInserted = true;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'columns-override-btn';

        keysLink.parentNode.insertBefore(button, keysLink.nextSibling);

        // Label auf Flexbox umstellen für rechtsbündigen Button
        const label = keysLink.closest('label');
        if (label) {
            label.style.display = 'flex';
            label.style.justifyContent = 'space-between';
            label.style.alignItems = 'center';
            label.style.width = '100%';
        }

        updateButtonState(button);

        // Observer für den Gesperrt-Button Status (mit Debounce)
        let lockCheckTimeout = null;
        const lockObserver = new MutationObserver(() => {
            if (lockCheckTimeout) clearTimeout(lockCheckTimeout);
            lockCheckTimeout = setTimeout(() => {
                updateButtonState(button);
            }, 100);
        });
        
        // Nur den Modal-Header beobachten, wo der Gesperrt-Button ist
        const modalHeader = modal.querySelector('.modal-header');
        if (modalHeader) {
            lockObserver.observe(modalHeader, { childList: true, subtree: true });
        }

        button.addEventListener('click', () => {
            const inputs = getColumnInputs();
            showModal(inputs.length, applyColumnValue);
        });
    }

    // Observer um auf das Overlay zu warten
    insertObserver = new MutationObserver(() => {
        tryInsertButton();
    });
    insertObserver.observe(document.body, { childList: true, subtree: true });

    // Auch sofort versuchen, falls Element schon da ist
    tryInsertButton();
})();