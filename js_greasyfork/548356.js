// ==UserScript==
// @name         Atalhos no Cabeçalho com Ícones Maiores (v1.2)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adiciona botões de atalho com ícones maiores para as 5 visualizações de imagem diretamente no cabeçalho.
// @author       Pejota e IA Gemini
// @match        http://10.72.200.50/sede/paginas/index.php*
// @match        http://192.168.2.147/sede/paginas/index.php?pagina=edificacao
// @match        http://mapear.esteio.com.br/fortal-v3/paginas/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548356/Atalhos%20no%20Cabe%C3%A7alho%20com%20%C3%8Dcones%20Maiores%20%28v12%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548356/Atalhos%20no%20Cabe%C3%A7alho%20com%20%C3%8Dcones%20Maiores%20%28v12%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- 1. CONFIGURAÇÕES (Ícones aumentados) ---
    const VIEW_CONFIG = {
        'loadNadirBtn':   { name: 'NADIR',   index: 0, headerSelector: '.nadir-header' },
        'loadObliqueBtn': { name: 'BACK',    index: 1, headerSelector: '.back-header' },
        'loadRightBtn':   { name: 'RIGHT',   index: 2, headerSelector: '.obliqua-header' },
        'loadForwardBtn': { name: 'FORWARD', index: 3, headerSelector: '.obliqua-header' },
        'loadLeftBtn':    { name: 'LEFT',    index: 4, headerSelector: '.obliqua-header' }
    };
    const VIEW_SEQUENCE = ['NADIR', 'BACK', 'RIGHT', 'FORWARD', 'LEFT'];

    // Objeto com os SVGs para cada ícone
    // ALTERAÇÃO: Ícones aumentados de 20x20 para 24x24
    const ICONS = {
        NADIR:   `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14"></rect></svg>`,
        LEFT:    `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="14"></rect><circle cx="12" cy="21" r="1.5" fill="currentColor"></circle></svg>`,
        FORWARD: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="5" width="14" height="14"></rect><circle cx="3" cy="12" r="1.5" fill="currentColor"></circle></svg>`,
        RIGHT:   `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="7" width="14" height="14"></rect><circle cx="12" cy="3" r="1.5" fill="currentColor"></circle></svg>`,
        BACK:    `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="14"></rect><circle cx="21" cy="12" r="1.5" fill="currentColor"></circle></svg>`
    };


    // --- 2. FUNÇÕES AUXILIARES (Inalteradas) ---
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    async function findElementInFrames(selector) { const e=document.querySelector(selector);if(e)return e;const t=document.querySelectorAll("iframe");for(const o of t)try{const r=o.contentDocument||o.contentWindow.document,n=r.querySelector(selector);if(n)return n}catch(e){}return null}
    async function findElementsInFrames(selector) { let e=Array.from(document.querySelectorAll(selector));const t=document.querySelectorAll("iframe");for(const o of t)try{const r=o.contentDocument||o.contentWindow.document;e=e.concat(Array.from(r.querySelectorAll(selector)))}catch(e){}return e}
    async function waitForElement(selector, timeout = 7000) { return new Promise(async(e,t)=>{const o=Date.now();let r=await findElementInFrames(selector);if(r)return e(r);const n=setInterval(async()=>{r=await findElementInFrames(selector);if(r){clearInterval(n);e(r)}else if(Date.now()-o>timeout){clearInterval(n);t(new Error(`Elemento "${selector}" não encontrado`))}},200)})}
    async function getCurrentView() {
        for (const config of Object.values(VIEW_CONFIG)) {
            const potentialHeaders = await findElementsInFrames(config.headerSelector);
            for (const header of potentialHeaders) {
                if (header.textContent.trim().toUpperCase() === config.name && header.offsetParent !== null) {
                    return config.name;
                }
            }
        }
        return null;
    }

    // --- 3. LÓGICA DE UI (CSS dos botões aumentado) ---
    let statusDisplay;
    function showStatus(message) { if(statusDisplay) { statusDisplay.textContent = message; statusDisplay.style.display = 'inline'; } }
    function hideStatus() { if(statusDisplay) { statusDisplay.style.display = 'none'; } }

    async function injectButtons() {
        try {
            const nextButton = await waitForElement('button[onclick="carregarProximo()"]');
            const toolbar = nextButton.parentElement;
            if (!toolbar) { return null; }

            const style = document.createElement('style');
            style.innerHTML = `
                #atalhos-container { display: inline-flex; align-items: center; gap: 6px; padding: 0 15px; border-left: 1px solid #ccc; margin-left: 15px; }
                #atalhos-container button {
                    cursor: pointer;
                    width: 38px; height: 38px; /* ALTERAÇÃO: Tamanho do botão aumentado */
                    display: inline-flex; align-items: center; justify-content: center;
                    border-radius: 4px; border: 1px solid #aaa; background-color: #f0f0f0;
                    color: #333;
                }
                #atalhos-container button:hover { background-color: #e0e0e0; border-color: #888; }
                #atalhos-status { margin-left: 10px; font-weight: bold; font-family: sans-serif; font-size: 0.9em; color: #333; background-color: #fffbe6; padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc; }
            `;
            (toolbar.ownerDocument.head || toolbar.ownerDocument.documentElement).appendChild(style);

            const atalhosContainer = document.createElement('div');
            atalhosContainer.id = 'atalhos-container';

            Object.keys(VIEW_CONFIG).forEach(targetId => {
                const view = VIEW_CONFIG[targetId];
                const button = document.createElement('button');
                button.innerHTML = ICONS[view.name] || '?';
                button.title = view.name;
                button.setAttribute('data-target-id', targetId);
                atalhosContainer.appendChild(button);
            });

            statusDisplay = document.createElement('span');
            statusDisplay.id = 'atalhos-status';
            statusDisplay.style.display = 'none';
            atalhosContainer.appendChild(statusDisplay);

            toolbar.prepend(atalhosContainer);
            return atalhosContainer;
        } catch (error) {
            console.error("Falha ao injetar os botões de atalho:", error);
            return null;
        }
    }


    // --- 4. LÓGICA PRINCIPAL (STATE MACHINE - Inalterada) ---
    const atalhosContainer = await injectButtons();
    if (!atalhosContainer) return;

    let isActionRunning = false;
    atalhosContainer.addEventListener('click', async (event) => {
        const button = event.target.closest('button');
        if (!button || isActionRunning) return;

        isActionRunning = true;
        hideStatus();
        const targetId = button.getAttribute('data-target-id');
        const targetView = VIEW_CONFIG[targetId];

        try {
            showStatus('Detectando...');
            const currentViewName = await getCurrentView();
            if (!currentViewName) {
                throw new Error("Não foi possível identificar a aba atual.");
            }
            const currentIndex = VIEW_SEQUENCE.indexOf(currentViewName);
            const targetIndex = targetView.index;
            const diff = targetIndex - currentIndex;

            if (diff !== 0) {
                const clicksNeeded = Math.abs(diff);
                const buttonSelector = diff > 0 ? 'button[onclick="carregarProximo()"]' : 'button[onclick="carregarAnterior()"]';
                for (let i = 0; i < clicksNeeded; i++) {
                    showStatus(`Navegando (${i + 1}/${clicksNeeded})...`);
                    const navButton = await waitForElement(buttonSelector);
                    navButton.click();
                    
                }
            }

            showStatus(`Carregando ${targetView.name}...`);
            const finalButton = await waitForElement(`#${targetId}`);
            finalButton.click();
            await sleep(50);
            hideStatus();

        } catch (error) {
            console.error(error);
            alert(`Ocorreu um erro: ${error.message}`);
            hideStatus();
        } finally {
            isActionRunning = false;
        }
    });

})();