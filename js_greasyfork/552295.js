// ==UserScript==
// @name         ADetalhes - Sequência de cliques Ctrl+Alt+D
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Ao pressionar Ctrl+Alt+S, clicar na aba na página
// @author       Guilherme
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552295/ADetalhes%20-%20Sequ%C3%AAncia%20de%20cliques%20Ctrl%2BAlt%2BD.user.js
// @updateURL https://update.greasyfork.org/scripts/552295/ADetalhes%20-%20Sequ%C3%AAncia%20de%20cliques%20Ctrl%2BAlt%2BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Função utilitária: buscar elemento via XPath
    function getElementByXpath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Sequência principal de ações
    async function executarSequencia() {
        try {
            const aba = getElementByXpath('//*[@id="rc-tabs-1-tab-details"]');

            if (!aba){
                return console.warn('⚠️ Botão 1 não encontrado.');
            } else {
                aba.click();};

        } catch (error) {
            console.error('❌ Erro na execução da sequência:', error);
        }
    }

    // Detecta o atalho Ctrl + Alt + C
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            console.log('⌨️ Atalho Ctrl+Alt+S detectado.');
            executarSequencia();
        }
    });
})();
