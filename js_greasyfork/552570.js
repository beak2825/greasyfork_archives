// ==UserScript==
// @name         ARastreamento - Sequência de cliques Ctrl+.
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Ao pressionar Ctrl+., clicar na aba de rastreamento na página
// @author       Guilherme
// @match        *://*/*
// @noframes
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552570/ARastreamento%20-%20Sequ%C3%AAncia%20de%20cliques%20Ctrl%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/552570/ARastreamento%20-%20Sequ%C3%AAncia%20de%20cliques%20Ctrl%2B.meta.js
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

    /** ⏳ Espera o elemento aparecer (até o tempo limite) */
    async function waitForElement(xpath, timeout = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = getElementByXpath(xpath);
            if (el) return el;
            await new Promise(r => setTimeout(r, 200));
        }
        return null;
    }

    /** 🖱️ Simula um clique real */
    function simulateClick(el) {
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const evts = ['mousedown', 'mouseup', 'click'];
        for (const type of evts) {
            el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
        }
        console.log('✅ Clique simulado com sucesso:', el);
    }

    /** 🚀 Ação principal */
    async function executarSequencia() {
        try {
            console.log('🔍 Procurando a aba de rastreamento...');
            const xpathAba = '//*[@id="rc-tabs-1-tab-clientTracking"]';
            const aba = await waitForElement(xpathAba, 6000);

            if (!aba) {
                console.warn('⚠️ Aba de rastreamento não encontrada.');
                return;
            }

            simulateClick(aba);
            console.log('🎯 Aba de rastreamento clicada com sucesso.');

        } catch (error) {
            console.error('❌ Erro na execução da sequência:', error);
        }
    }

    /** ⌨️ Atalho global (Alt + Q) */
    window.addEventListener('keydown', (event) => {
        // Ignora se estiver digitando em um input ou textarea
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        // Alt + Q (pode alterar abaixo se preferir outro)
        if (event.ctrlKey && !event.altKey && !event.shiftKey && event.key === '.') {
            event.preventDefault();
            console.log('⌨️ Atalho Alt+Q detectado.');
            executarSequencia();
        }
    }, true); // “true” captura antes de o site consumir o evento
})();
