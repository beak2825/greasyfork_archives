// ==UserScript==
// @name Musixmatch - Contador Lateral
// @namespace http://tampermonkey.net/
// @version 2.2
// @description Contador de caracteres por linha para o Musixmatch Studio, com inicialização robusta em qualquer cenário de carregamento.
// @author Nero Legendary
// @match https://curators.musixmatch.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553705/Musixmatch%20-%20Contador%20Lateral.user.js
// @updateURL https://update.greasyfork.org/scripts/553705/Musixmatch%20-%20Contador%20Lateral.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ALERT_LIMIT = 55;
    const STRUCTURE_TAGS = ['#VERSE','#CHORUS','#PRE-CHORUS','#HOOK','#BRIDGE','#OUTRO'];

    function shouldRunScript() {
        const url = window.location.href;
        return url.includes('mode=edit') && !url.includes('mode=sync');
    }

    function removeExistingCounters() {
        document.querySelectorAll('.mxm-counter-wrapper').forEach(wrapper => {
            const editor = wrapper.querySelector('textarea, [contenteditable="true"]');
            if (editor && wrapper.parentNode) {
                wrapper.parentNode.insertBefore(editor, wrapper);
                editor.removeAttribute('data-counter-initialized');
                editor.style.flexGrow = '';
                editor.style.minWidth = '';
            }
            wrapper.remove();
        });

        document.querySelectorAll('div[data-counter="true"]').forEach(c => c.remove());
    }

    function createSideCounter(editor) {
        if (!editor || editor.hasAttribute('data-counter-initialized')) return;

        editor.setAttribute('data-counter-initialized', 'true');

        editor.style.flexGrow = '1';
        editor.style.minWidth = '0';

        const wrapper = document.createElement('div');
        wrapper.className = 'mxm-counter-wrapper';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'flex-start';
        wrapper.style.gap = '8px';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '90ch';

        if (editor.parentNode) {
            editor.parentNode.insertBefore(wrapper, editor);
            wrapper.appendChild(editor);
        }

        const counterCol = document.createElement('div');
        counterCol.setAttribute('data-counter', 'true');
        counterCol.style.cssText = `
            display: block;
            font-family: monospace;
            font-size: 12px;
            color: #555;
            user-select: none;
            min-width: 30px;
            padding-top: 2px;
        `;

        wrapper.appendChild(counterCol);

        function updateCounters() {
            let text = '';

            if (editor.tagName === 'TEXTAREA') {
                text = editor.value;
            } else if (editor.hasAttribute('contenteditable')) {
                text = editor.innerText || editor.textContent;
            } else {
                return;
            }

            const lines = text.split('\n');
            const computedStyle = getComputedStyle(editor);
            const lineHeight = parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.5 || 20;
            const fontSize = parseFloat(computedStyle.fontSize) || 14;

            let html = '';
            let hasVisibleCounters = false;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const trimmed = line.trim().toUpperCase();

                if (!trimmed || STRUCTURE_TAGS.includes(trimmed)) {
                    html += `<div style="display: block; height: ${lineHeight}px; line-height: ${lineHeight}px; visibility: hidden;">0</div>`;
                    continue;
                }

                const len = line.length;
                const color = len >= ALERT_LIMIT ? '#ff4444' : '#666666';
                html += `<div style="display: block; height: ${lineHeight}px; line-height: ${lineHeight}px; color: ${color}; font-size: ${fontSize - 2}px;">${len}</div>`;
                hasVisibleCounters = true;
            }

            counterCol.innerHTML = html;

            counterCol.style.display = hasVisibleCounters ? 'block' : 'none';
        }

        function syncScroll() {
            counterCol.scrollTop = editor.scrollTop;
        }

        editor.addEventListener('input', updateCounters);
        editor.addEventListener('keyup', updateCounters);
        editor.addEventListener('scroll', syncScroll);
        editor.addEventListener('paste', () => setTimeout(updateCounters, 10));
        editor.addEventListener('cut', () => setTimeout(updateCounters, 10));

        const observer = new MutationObserver(updateCounters);
        if (editor.hasAttribute('contenteditable')) {
            observer.observe(editor, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        const resizeObserver = new ResizeObserver(() => {
            setTimeout(updateCounters, 50);
        });
        resizeObserver.observe(editor);

        setTimeout(updateCounters, 100);
    }

    function checkAndCreateEditorCounter() {
        if (!shouldRunScript()) {
            removeExistingCounters();
            return;
        }

        const editors = document.querySelectorAll('textarea, [contenteditable="true"]');

        editors.forEach(editor => {
            const rect = editor.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                createSideCounter(editor);
            }
        });
    }

    // Intervalo de segurança (Heartbeat): Garante que o script rode a cada 500ms
    setInterval(checkAndCreateEditorCounter, 500);

    // Observador de mutações: Captura mudanças no DOM, essencial para SPAs
    const mo = new MutationObserver(checkAndCreateEditorCounter);
    mo.observe(document.body, { childList: true, subtree: true });

    // Chamada imediata para garantir a injeção o mais cedo possível
    checkAndCreateEditorCounter();
})();