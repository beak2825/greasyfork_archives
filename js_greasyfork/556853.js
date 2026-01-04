// ==UserScript==
// @name         SA – Notatki i komentarz na liście zamówień
// @namespace    SA – Notatki i komentarz na liście zamówień
// @version      1.0
// @description  Przenosi notatki/komentarze z podglądu zamówienia na listę zamówień (do kolumny Produkty)
// @author       Dawid Wróbel
// @match        https://*/admin/orders*
// @run-at       document-end
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/556853/SA%20%E2%80%93%20Notatki%20i%20komentarz%20na%20li%C5%9Bcie%20zam%C3%B3wie%C5%84.user.js
// @updateURL https://update.greasyfork.org/scripts/556853/SA%20%E2%80%93%20Notatki%20i%20komentarz%20na%20li%C5%9Bcie%20zam%C3%B3wie%C5%84.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const FLAG_ATTR = 'data-vm-notes-injected';
    function log(msg) {
        console.log('[VM-NOTES]', msg);
    }
    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    function renderNoteText(text) {
        const lines = text.split('\n');
        return lines.map(escapeHtml).join('<br>');
    }
    function extractNotesFromActionsCell(actionsCell) {
        if (!actionsCell) return [];
        const icons = actionsCell.querySelectorAll(
            'img[src*="comment"][title], img[src*="pin_green"][title]'
        );
        const notes = [];
        icons.forEach(img => {
            const title = (img.getAttribute('title') || '').trim();
            if (!title) return;
            if (title === 'Brak komentarza') return;
            const src = img.getAttribute('src') || '';
            let type = 'other';
            if (src.includes('pin_green')) {
                type = 'internal';
            } else if (src.includes('comment')) {
                type = 'client';
            }
            notes.push({ type, text: title });
        });
        return notes;
    }
    function injectNotesIntoRow(tr) {
        if (!tr || tr.getAttribute(FLAG_ATTR) === '1') return;
        const productsCell = tr.querySelector('td[title="Produkty"]');
        const actionsCell  = tr.querySelector('td.tedit');
        if (!productsCell || !actionsCell) return;
        const notes = extractNotesFromActionsCell(actionsCell);
        if (!notes.length) return;
        tr.setAttribute(FLAG_ATTR, '1');
        const wrapper =
            productsCell.querySelector('.u-flex') ||
            productsCell;
        const internalNotes = notes.filter(n => n.type === 'internal');
        const clientNotes   = notes.filter(n => n.type === 'client');
        if (!internalNotes.length && !clientNotes.length) return;
        const box = document.createElement('div');
        box.className = 'vm-order-notes';
        box.style.marginTop = '4px';
        box.style.padding = '3px 6px';
        box.style.borderLeft = '3px solid #ffa000';
        box.style.fontSize = '11px';
        box.style.lineHeight = '1.3';
        box.style.background = '#fff8e1';
        box.style.maxWidth = '100%';
        box.style.boxSizing = 'border-box';
        const htmlParts = [];
        if (internalNotes.length) {
            const label = internalNotes.length > 1
                ? 'Nasze notatki:'
                : 'Nasza notatka:';
            htmlParts.push('<strong>' + label + '</strong>');
            internalNotes.forEach(n => {
                htmlParts.push(renderNoteText(n.text));
            });
        }
        if (clientNotes.length) {
            if (htmlParts.length) {
                htmlParts.push('<span>---</span>');
            }
            const label = clientNotes.length > 1
                ? 'Komentarze klienta:'
                : 'Komentarz klienta:';
            htmlParts.push('<strong>' + label + '</strong>');
            clientNotes.forEach(n => {
                htmlParts.push(renderNoteText(n.text));
            });
        }
        box.innerHTML = htmlParts.join('<br>');
        wrapper.appendChild(box);
    }
    function processAllRows() {
        const rows = document.querySelectorAll('tr.order_tr');
        rows.forEach(injectNotesIntoRow);
    }
    function init() {
        log('startuję na ' + location.pathname);
        processAllRows();
        if (window.MutationObserver) {
            const observer = new MutationObserver(() => {
                processAllRows();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();