// ==UserScript==
// @name         ATStatus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pressione Ctrl + Alt + R para clicar em um botão específico
// @author       Guilherme
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552169/ATStatus.user.js
// @updateURL https://update.greasyfork.org/scripts/552169/ATStatus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para buscar o botão via XPath
    function getElementByXpath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Escuta o evento de teclas pressionadas
    document.addEventListener('keydown', function(event) {
        // Verifica se as teclas Ctrl + Alt + R foram pressionadas
        if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'z') {
            event.preventDefault(); // Evita interferência com outros atalhos
            const botao = getElementByXpath('//*[@id="rc-tabs-1-panel-details"]/main/div/article/section[1]/button[1]');

            if (botao) {
                botao.click();
                console.log('✅ Botão clicado com sucesso!');
            } else {
                console.warn('⚠️ Botão não encontrado na página.');
            }
        }
    });
})();
