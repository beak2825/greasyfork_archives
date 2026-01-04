// ==UserScript==
// @name         Adurite Name Changer
// @namespace    https://example.com/userscripts
// @version      1.0.0
// @description  Altera visualmente "pwrgatory" para "nxnce" na página específica (somente leitura visual)
// @author       SeuNome
// @match        https://adurite.com/shop/pwrgatory*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553721/Adurite%20Name%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/553721/Adurite%20Name%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ORIGINAL = 'pwrgatory';
    const NEW_NAME = 'nxnce';

    function replaceName(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.nodeValue.includes(ORIGINAL)) {
                node.nodeValue = node.nodeValue.replace(ORIGINAL, NEW_NAME);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // evita inputs, textareas e conteúdo editável
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.isContentEditable) return;
            node.childNodes.forEach(replaceName);
        }
    }

    // aplica imediatamente
    replaceName(document.body);

    // observa mudanças futuras (para SPA ou elementos carregados dinamicamente)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(replaceName);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
