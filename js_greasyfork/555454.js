// ==UserScript==
// @name         diverses: claude.ai reload alert
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.0.0
// @description  Bestätigung vor dem Reload auf claude.ai
// @author       Martin Kaiser
// @match        https://claude.ai/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/555454/diverses%3A%20claudeai%20reload%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/555454/diverses%3A%20claudeai%20reload%20alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Reload-Icon Path (exakt aus deiner Spezifikation)
    const reloadIconPath = 'M10.3857 2.50977C14.3486 2.71054 17.5 5.98724 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 7.54619 3.67878 5.3677 5.49902 4H3C2.72386 4 2.5 3.77614 2.5 3.5C2.5 3.22386 2.72386 3 3 3H6.5C6.63261 3 6.75975 3.05272 6.85352 3.14648C6.92392 3.21689 6.97106 3.30611 6.99023 3.40234L7 3.5V7C7 7.27614 6.77614 7.5 6.5 7.5C6.22386 7.5 6 7.27614 6 7V4.87891C4.4782 6.06926 3.5 7.91979 3.5 10C3.5 13.5899 6.41015 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.5225 13.7691 3.68312 10.335 3.50879L10 3.5L9.89941 3.49023C9.67145 3.44371 9.5 3.24171 9.5 3C9.5 2.72386 9.72386 2.5 10 2.5L10.3857 2.50977Z';

    // Prüfe ob ein Element das Reload-Icon ist
    function isReloadIcon(element) {
        const svg = element.closest('svg');
        if (!svg) return false;

        const path = svg.querySelector('path');
        if (!path) return false;

        const d = path.getAttribute('d');
        return d === reloadIconPath;
    }

    // Erstelle Modal Dialog
    function createConfirmDialog(callback) {
        // Overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
        `;

        // Dialog Box
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            z-index: 1000000;
            font-family: system-ui, -apple-system, sans-serif;
        `;

        // Text
        const text = document.createElement('p');
        text.textContent = 'Reload wirklich ausführen?';
        text.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 16px;
            color: #333;
        `;

        // Button Container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        `;

        // Abbrechen Button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Abbrechen';
        cancelBtn.style.cssText = `
            padding: 8px 16px;
            border: 1px solid #ccc;
            background: #f5f5f5;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        `;
        cancelBtn.onmouseover = () => cancelBtn.style.background = '#e8e8e8';
        cancelBtn.onmouseout = () => cancelBtn.style.background = '#f5f5f5';
        cancelBtn.onclick = () => {
            overlay.remove();
            callback(false);
        };

        // OK Button
        const okBtn = document.createElement('button');
        okBtn.textContent = 'Reload';
        okBtn.style.cssText = `
            padding: 8px 16px;
            border: none;
            background: #0066ff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        `;
        okBtn.onmouseover = () => okBtn.style.background = '#0052cc';
        okBtn.onmouseout = () => okBtn.style.background = '#0066ff';
        okBtn.onclick = () => {
            overlay.remove();
            callback(true);
        };

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(okBtn);

        dialog.appendChild(text);
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);

        // Focus auf OK Button
        okBtn.focus();

        // ESC zum Abbrechen
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
                callback(false);
            }
        };
        document.addEventListener('keydown', escHandler);

        document.body.appendChild(overlay);
    }

    // Click-Event Listener mit Capture-Phase
    document.addEventListener('click', (e) => {
        if (!isReloadIcon(e.target)) return;

        const button = e.target.closest('button');
        if (!button) return;

        // Event stoppen um den Reload zu verhindern
        e.preventDefault();
        e.stopImmediatePropagation();

        // Bestätigung anfordern
        createConfirmDialog((confirmed) => {
            if (!confirmed) return;

            // Nach Bestätigung: Click auf den Button mit Timeout
            // um die Event-Verarbeitung zu unterbrechen
            setTimeout(() => {
                const clickEvent = new MouseEvent('click', { bubbles: true });
                button.dispatchEvent(clickEvent);
            }, 0);
        });
    }, true);

})();