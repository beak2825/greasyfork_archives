// ==UserScript==
// @name         ALocalização - Sequência de cliques Ctrl+/
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Ao pressionar Ctrl+/, clicar na aba de Localização na página
// @author       Guilherme
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552571/ALocaliza%C3%A7%C3%A3o%20-%20Sequ%C3%AAncia%20de%20cliques%20Ctrl%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/552571/ALocaliza%C3%A7%C3%A3o%20-%20Sequ%C3%AAncia%20de%20cliques%20Ctrl%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** 🔍 Busca elemento via XPath */
    function getElementByXpath(xpath) {
        try {
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } catch (e) {
            console.error('❌ XPath inválido:', xpath, e);
            return null;
        }
    }

    /** ⏳ Aguarda até que o elemento exista (timeout padrão: 6s) */
    async function waitForElement(xpath, timeout = 6000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = getElementByXpath(xpath);
            if (el) return el;
            await new Promise(r => setTimeout(r, 200));
        }
        return null;
    }

    /** 🖱️ Simula clique realista */
    function simulateClick(el) {
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ['mousedown', 'mouseup', 'click'].forEach(evt =>
            el.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }))
        );
        console.log('✅ Clique simulado com sucesso:', el);
    }

    /** 🚀 Sequência principal */
    async function executarSequencia() {
        try {
            console.log('🔍 Procurando aba de Localização...');
            const aba = await waitForElement('//*[@id="rc-tabs-1-tab-locations"]', 6000);

            if (!aba) {
                console.warn('⚠️ Aba de Localização não encontrada.');
                return;
            }

            simulateClick(aba);
            console.log('🎯 Aba de Localização clicada com sucesso.');
        } catch (error) {
            console.error('❌ Erro ao executar sequência:', error);
        }
    }

    /** ⌨️ Atalho Ctrl + / */
    window.addEventListener('keydown', (event) => {
        // Ignora se estiver digitando em campos de texto
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        // Detecta Ctrl + /
        if (event.ctrlKey && !event.altKey && !event.shiftKey && event.key === '/') {
            event.preventDefault();
            console.log('⌨️ Atalho Ctrl+/ detectado.');
            executarSequencia();
        }
    }, true); // Captura antes de outros event listeners
})();
