// ==UserScript==
// @name         AContinuar - Sequência de cliques Ctrl+Alt+A (versão aprimorada)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Simula hover, clica em botões e confirma no modal ao pressionar Ctrl+Alt+A.
// @author       Guilherme
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552479/AContinuar%20-%20Sequ%C3%AAncia%20de%20cliques%20Ctrl%2BAlt%2BA%20%28vers%C3%A3o%20aprimorada%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552479/AContinuar%20-%20Sequ%C3%AAncia%20de%20cliques%20Ctrl%2BAlt%2BA%20%28vers%C3%A3o%20aprimorada%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** 🔍 Busca elemento via XPath */
    function getElementByXpath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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

    /** 🖱️ Simula um evento real de mouse */
    function simulateMouseEvent(element, eventType = 'click') {
        const event = new MouseEvent(eventType, {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }

    /** 🧠 Aguarda um pequeno delay */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /** 🏁 Sequência principal */
    async function executarSequencia() {
        try {
            console.log('🚀 Iniciando sequência de cliques...');

            // 🔹 1. Simula hover no botão de ações
            const botaoAcoesXPath = '//*[@id="infinite-scroller"]/section/main/section/div[1]/header/aside/button[2]';
            const botaoAcoes = await waitForElement(botaoAcoesXPath, 5000);
            if (!botaoAcoes) {
                console.warn('⚠️ Botão de ações não encontrado.');
                return;
            }

            simulateMouseEvent(botaoAcoes, 'mouseover');
            console.log('🖱️ Hover simulado no botão de ações.');

            // Aguarda menu abrir
            await sleep(800);

            // 🔹 2. Clica no botão "Continuar"
            const continuarXPath = '/html/body/div[3]/div/div/button[2]';
            const continuar = await waitForElement(continuarXPath, 5000);
            if (!continuar) {
                console.warn('⚠️ Botão "Continuar" não encontrado.');
                return;
            }

            simulateMouseEvent(continuar, 'mousedown');
            simulateMouseEvent(continuar, 'mouseup');
            simulateMouseEvent(continuar, 'click');
            console.log('✅ Botão "Continuar" clicado.');

            // Aguarda modal aparecer
            await sleep(1000);

            // 🔹 3. Clica no botão dentro do modal
            const modalBotaoXPath = '/html/body/div[4]/div/div[2]/div/div[1]/div/div[2]/button[2]';
            const modalBotao = await waitForElement(modalBotaoXPath, 5000);
            if (!modalBotao) {
                console.warn('⚠️ Botão dentro do modal não encontrado.');
                return;
            }

            simulateMouseEvent(modalBotao, 'mousedown');
            simulateMouseEvent(modalBotao, 'mouseup');
            simulateMouseEvent(modalBotao, 'click');
            console.log('🎯 Botão dentro do modal clicado com sucesso.');

        } catch (error) {
            console.error('❌ Erro na execução da sequência:', error);
        }
    }

    /** ⌨️ Atalho global Ctrl + Alt + A */
    window.addEventListener('keydown', function (event) {
        // ignora se estiver digitando num input
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') {
            event.preventDefault();
            console.log('⌨️ Atalho Ctrl+Alt+A detectado.');
            executarSequencia();
        }
    }, true); // <- “true” captura o evento antes que o site o consuma
})();
