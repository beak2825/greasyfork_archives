// ==UserScript==
// @name         ff-text-select
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.0.2
// @description  Firefox-Markierungsstil für Chrome: Unterstriche als Wortgrenzen, kein trailing Whitespace, \y-Pattern-Grenzen ignoriert.
// @author       Martin Kaiser
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/554671/ff-text-select.user.js
// @updateURL https://update.greasyfork.org/scripts/554671/ff-text-select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // BLOCKIERE BESTIMMTE URLs KOMPLETT
    // ============================================
    const blockedUrls = [
        'https://opus.geizhals.at/kalif/artikel/template',
        'https://opus.geizhals.at/kalif/artikel/filter',
        'https://opus.geizhals.at/kalif/artikel/property',
        'https://talk.geizhals.at/'
    ];

    for (const blockedUrl of blockedUrls) {
        if (window.location.href.startsWith(blockedUrl)) {
            return;  // Script wird nicht ausgeführt
        }
    }

    // ============================================
    // HAUPTSCRIPT
    // ============================================

    // Zeichen, die als Wortgrenzen gelten sollen (mit Unterstrichen)
    const WORD_BOUNDARY_RE = /[\s_\-.,;:!?()\[\]{}<>\/\\|"'`~@#$%^&*+=\u00A0]/;
    const TRAILING_WS_RE = /(\s|\u00A0)+$/;

    // Speichert die letzte Klickposition
    let lastClickPosition = null;
    let lastClickTarget = null;

    // Prüfe ob Element zu ACE Editor oder ähnlichen Code-Editoren gehört
    function isCodeEditor(element) {
        if (!element) return false;

        let el = element;
        for (let i = 0; i < 5 && el; i++) {
            const classList = el.classList || [];
            // Handle SVG elements where className is an SVGAnimatedString object
            const className = (typeof el.className === 'string') ? el.className : (el.className?.baseVal || '');

            // ACE Editor
            if (classList.contains('ace_editor') ||
                classList.contains('ace_content') ||
                classList.contains('ace_text-layer') ||
                className.includes('ace_')) {
                return true;
            }

            // CodeMirror
            if (classList.contains('CodeMirror') ||
                classList.contains('cm-editor')) {
                return true;
            }

            // Monaco Editor
            if (classList.contains('monaco-editor')) {
                return true;
            }

            el = el.parentElement;
        }

        return false;
    }

    // Hilfsfunktion: Finde Wortgrenzen in einem String
    function getWordBoundaries(text, position) {
        let start = position;

        // Nach links bis zur Wortgrenze
        while (start > 0 && !WORD_BOUNDARY_RE.test(text[start - 1])) {
            // Spezialfall: \y - das 'y' nach Backslash soll nicht mitmarkiert werden
            if (start >= 2 && text[start - 1] === 'y' && text[start - 2] === '\\') {
                break;
            }
            start--;
        }

        // Spezialfall: Wenn wir auf einem 'y' nach '\' gelandet sind, überspringe es
        if (start < text.length && text[start] === 'y' && start > 0 && text[start - 1] === '\\') {
            start++;
        }

        // Nach rechts bis zur Wortgrenze
        let end = start;
        while (end < text.length && !WORD_BOUNDARY_RE.test(text[end])) {
            end++;
        }

        return { start, end };
    }

    // Für Input/Textarea: Selektion auf Wortgrenzen anpassen
    function adjustSelectionInEditable(el) {
        try {
            const text = el.value;

            let clickPos = lastClickPosition;
            if (clickPos === null || lastClickTarget !== el) {
                clickPos = el.selectionStart;
            }

            const bounds = getWordBoundaries(text, clickPos);
            el.setSelectionRange(bounds.start, bounds.end);
        } catch (_) {}
    }

    // Trimme trailing Whitespace in Eingabefeldern
    function trimTrailingWhitespaceInEditable(el) {
        try {
            const start = el.selectionStart;
            const end = el.selectionEnd;
            if (start == null || end == null || end <= start) return;

            const selected = el.value.slice(start, end);
            const m = selected.match(TRAILING_WS_RE);
            if (!m) return;

            const trimLen = m[0].length;
            const newEnd = end - trimLen;
            if (newEnd >= start) {
                el.setSelectionRange(start, newEnd);
            }
        } catch (_) {}
    }

    // Für normalen Text: Selektion auf Wortgrenzen anpassen
    function adjustSelectionInDocument() {
        const sel = window.getSelection && window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        let textNode, offset;

        if (lastClickPosition && lastClickPosition.node && lastClickPosition.offset !== null) {
            textNode = lastClickPosition.node;
            offset = lastClickPosition.offset;
        } else {
            const range = sel.getRangeAt(0);
            textNode = range.startContainer;
            offset = range.startOffset;
        }

        // Falls wir in einem Element-Node sind, finde den Text-Node
        if (textNode.nodeType !== Node.TEXT_NODE) {
            const walker = document.createTreeWalker(
                textNode,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            textNode = walker.nextNode();
            if (!textNode) return;
            offset = 0;
        }

        const text = textNode.textContent;
        const bounds = getWordBoundaries(text, offset);

        const newRange = document.createRange();
        try {
            newRange.setStart(textNode, bounds.start);
            newRange.setEnd(textNode, bounds.end);

            sel.removeAllRanges();
            sel.addRange(newRange);
        } catch (_) {}
    }

    // Trimme trailing Whitespace im normalen Text
    function trimTrailingWhitespaceInDocument() {
        const sel = window.getSelection && window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        let text = sel.toString();
        if (!TRAILING_WS_RE.test(text)) return;

        let safety = 200;

        if (typeof sel.modify === "function") {
            while (TRAILING_WS_RE.test(text) && safety-- > 0) {
                sel.modify("extend", "backward", "character");
                text = sel.toString();
            }
            return;
        }

        // Fallback: Range-Ende zeichenweise zurücksetzen
        const range = sel.getRangeAt(0).cloneRange();

        function previousTextPos(node, offset) {
            function getLastTextNode(n) {
                let cur = n;
                while (cur && cur.lastChild) cur = cur.lastChild;
                return (cur && cur.nodeType === Node.TEXT_NODE) ? cur : null;
            }

            let n = node, o = offset;

            if (n.nodeType === Node.TEXT_NODE && o > 0) {
                return { node: n, offset: o - 1 };
            }

            let cur = n;
            if (cur.nodeType === Node.ELEMENT_NODE && o > 0) {
                cur = cur.childNodes[o - 1];
                const lastTxt = getLastTextNode(cur) || (cur.nodeType === Node.TEXT_NODE ? cur : null);
                if (lastTxt) return { node: lastTxt, offset: lastTxt.data.length - 1 };
            }

            while (cur && !cur.previousSibling) cur = cur.parentNode;
            if (!cur || !cur.previousSibling) return null;

            cur = cur.previousSibling;
            const lastTxt = getLastTextNode(cur) || (cur.nodeType === Node.TEXT_NODE ? cur : null);
            if (lastTxt) return { node: lastTxt, offset: lastTxt.data.length - 1 };
            return null;
        }

        function charBefore(range) {
            const pos = previousTextPos(range.endContainer, range.endOffset);
            if (!pos) return null;
            const ch = pos.node.data.charAt(pos.offset);
            return { ch, pos };
        }

        while (safety-- > 0) {
            const info = charBefore(range);
            if (!info) break;
            if (!/(\s|\u00A0)/.test(info.ch)) break;
            range.setEnd(info.pos.node, info.pos.offset);
        }

        sel.removeAllRanges();
        sel.addRange(range);
    }

    // Speichere Klickposition beim mousedown
    window.addEventListener("mousedown", (ev) => {
        const target = ev.target;

        // BLOCKIERE CODE-EDITOREN KOMPLETT
        if (isCodeEditor(target)) {
            return;
        }

        // Für Input/Textarea
        if (target && (target.nodeName === "INPUT" || target.nodeName === "TEXTAREA")) {
            try {
                lastClickPosition = target.selectionStart;
                lastClickTarget = target;
            } catch (_) {
                lastClickPosition = null;
                lastClickTarget = null;
            }
        } else {
            // Für normalen Text
            try {
                let range;
                if (document.caretRangeFromPoint) {
                    range = document.caretRangeFromPoint(ev.clientX, ev.clientY);
                } else if (document.caretPositionFromPoint) {
                    const pos = document.caretPositionFromPoint(ev.clientX, ev.clientY);
                    if (pos) {
                        range = document.createRange();
                        range.setStart(pos.offsetNode, pos.offset);
                    }
                }

                if (range) {
                    lastClickPosition = {
                        node: range.startContainer,
                        offset: range.startOffset
                    };
                } else {
                    lastClickPosition = null;
                }
                lastClickTarget = target;
            } catch (_) {
                lastClickPosition = null;
                lastClickTarget = null;
            }
        }
    }, true);

    // Haupt-Handler für Doppelklicks
    window.addEventListener("dblclick", (ev) => {
        const target = ev.target;

        // BLOCKIERE CODE-EDITOREN KOMPLETT
        if (isCodeEditor(target)) {
            return;
        }

        setTimeout(() => {
            // Schritt 1: Wortgrenzen anpassen
            if (target && (target.nodeName === "INPUT" || target.nodeName === "TEXTAREA")) {
                adjustSelectionInEditable(target);
                trimTrailingWhitespaceInEditable(target);
            } else if (target && target.isContentEditable) {
                adjustSelectionInDocument();
                trimTrailingWhitespaceInDocument();
            } else {
                adjustSelectionInDocument();
                trimTrailingWhitespaceInDocument();
            }

            // Cleanup
            lastClickPosition = null;
            lastClickTarget = null;
        }, 0);
    }, true);
})();