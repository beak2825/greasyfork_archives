// ==UserScript==
// @name         ACrédito
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pressione Ctrl + Alt + C para clicar em um botão específico
// @author       Guilherme
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552168/ACr%C3%A9dito.user.js
// @updateURL https://update.greasyfork.org/scripts/552168/ACr%C3%A9dito.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para buscar o botão via XPath
    function getElementByXpath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Escuta o evento de teclas pressionadas
    document.addEventListener('keydown', function(event) {
        // Verifica se as teclas Ctrl + Alt + C foram pressionadas
        if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'x') {
            event.preventDefault(); // Evita interferência com outros atalhos
            const botao = getElementByXpath('/html/body/div[1]/div/div/div/section/main/section/main/section/div[2]/div/div[2]/div/div/main/div/article/section[1]/button[2]');

            if (botao) {
                botao.click();
                console.log('✅ Botão clicado com sucesso!');
            } else {
                console.warn('⚠️ Botão não encontrado na página.');
            }
        }
    });
})();
