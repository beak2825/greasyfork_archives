// ==UserScript==
// @name         AInformações - Sequência de cliques Alt+Q
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Ao pressionar Alt+ Q, clicar na aba de informações na página
// @author       Guilherme
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552572/AInforma%C3%A7%C3%B5es%20-%20Sequ%C3%AAncia%20de%20cliques%20Alt%2BQ.user.js
// @updateURL https://update.greasyfork.org/scripts/552572/AInforma%C3%A7%C3%B5es%20-%20Sequ%C3%AAncia%20de%20cliques%20Alt%2BQ.meta.js
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

    /** ⏳ Aguarda até que o elemento exista */
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
        ['mousedown', 'mouseup', 'click'].forEach(evt =>
            el.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }))
        );
        console.log('✅ Clique simulado com sucesso:', el);
    }

    /** 🚀 Ação principal */
    async function executarSequencia() {
        try {
            console.log('🔍 Procurando a aba de informações...');
            const aba = await waitForElement('//*[@id="rc-tabs-1-tab-information"]', 6000);

            if (!aba) {
                console.warn('⚠️ Aba de informações não encontrada.');
                return;
            }

            simulateClick(aba);
            console.log('🎯 Aba de informações clicada com sucesso.');
        } catch (error) {
            console.error('❌ Erro na execução da sequência:', error);
        }
    }

    /** ⌨️ Atalho: Ctrl + . */
    window.addEventListener('keydown', (event) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return; // evita digitação
        if (event.altKey && !event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'q') {
            event.preventDefault();
            console.log('⌨️ Atalho Ctrl+. detectado.');
            executarSequencia();
        }
    }, true); // captura antes de outros listeners
})();
