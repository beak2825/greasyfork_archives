// ==UserScript==
// @name         MZ • Destaque Atributos Maximizados
// @namespace    MZTools
// @version      0.4
// @description  Destaca atributos maximizados (classe .maxed) nas páginas de jogadores, plantel e transferências do ManagerZone. Visual refinado e leve em execução. Compatível com mobile.
// @author       Emanuel
// @match        https://www.managerzone.com/*
// @icon         https://www.managerzone.com/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552300/MZ%20%E2%80%A2%20Destaque%20Atributos%20Maximizados.user.js
// @updateURL https://update.greasyfork.org/scripts/552300/MZ%20%E2%80%A2%20Destaque%20Atributos%20Maximizados.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // === CONFIGURAÇÕES ===
    const HIGHLIGHT_COLOR = '#ffcccc'; // 🔧 vermelho suave (visual refinado)
    const STYLE_ID = 'mz-maxed-highlight-style';

    // === INSERE CSS PERSONALIZADO ===
    function injectStyle(doc = document) {
        if (doc.getElementById(STYLE_ID)) return;
        const style = doc.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            span.maxed {
                background-color: ${HIGHLIGHT_COLOR} !important;
                color: #000 !important;
                border-radius: 4px;
                padding: 0 3px;
            }
            td.mz-maxed-prev {
                background-color: ${HIGHLIGHT_COLOR} !important;
                border-radius: 3px;
            }
        `;
        doc.head.appendChild(style);
    }

    // === DESTACA ATRIBUTOS MAXIMIZADOS ===
    function highlightMaxedAttributes(root = document) {
        const maxedElements = root.querySelectorAll('span.maxed');
        maxedElements.forEach(el => {
            const td = el.closest('td');
            if (td && td.previousElementSibling) {
                td.previousElementSibling.classList.add('mz-maxed-prev');
            }
        });
    }

    // === MONITORA MUDANÇAS NA PÁGINA ===
    function observePageChanges(root = document) {
        const observer = new MutationObserver(() => highlightMaxedAttributes(root));
        observer.observe(root.body, { childList: true, subtree: true });
    }

    // === EXECUTA EM DOCUMENTOS E IFRAMES ===
    function applyToDocument(doc) {
        try {
            injectStyle(doc);
            highlightMaxedAttributes(doc);
            observePageChanges(doc);
        } catch (e) {
            console.warn('[MZ%] Erro ao aplicar destaque:', e);
        }
    }

    // === EXECUÇÃO INICIAL ===
    function init() {
        const url = window.location.href;
        const validPages = ['p=players', 'p=player', 'p=transfer', 'p=transfers'];
        if (!validPages.some(page => url.includes(page))) return;

        applyToDocument(document);

        // percorre iframes (usado na tela de transferências)
        document.querySelectorAll('iframe').forEach(frame => {
            try {
                if (frame.contentDocument) {
                    applyToDocument(frame.contentDocument);
                }
            } catch { /* ignora iframes cross-domain */ }
        });

        console.log('[MZ%] Destaque Atributos Maximizados v0.4 ativo (visual refinado).');
    }

    // === ESPERA DOM ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
