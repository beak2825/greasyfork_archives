// ==UserScript==
// @name         Musixmatch - Total USD + BRL (V94 - Fix Drag & Opacity)
// @namespace    http://tampermonkey.net/
// @version      94.0
// @description  Widget flutuante com total em USD/BRL. Arrastável, sem lag e com opacidade dinâmica.
// @author       Nero Legendary
// @match        https://curators.musixmatch.com/*
// @match        https://curators-beta.musixmatch.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553707/Musixmatch%20-%20Total%20USD%20%2B%20BRL%20%28V94%20-%20Fix%20Drag%20%20Opacity%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553707/Musixmatch%20-%20Total%20USD%20%2B%20BRL%20%28V94%20-%20Fix%20Drag%20%20Opacity%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[MXM Enhancements] Script V94.0 iniciado.');

    const TOTAL_WIDGET_ID = 'mxm-draggable-total-widget';
    const FALLBACK_REWARD_RATE = 0.50;
    const USD_TO_BRL_ESTIMATE = 5.20;

    const FLAGS = {
        USD: 'https://flagcdn.com/us.svg',
        BRL: 'https://flagcdn.com/br.svg'
    };

    // CORES
    const WIDGET_BG_COLOR = 'rgba(52, 52, 52)';
    const WIDGET_TEXT_COLOR = 'rgba(233, 233, 233)';
    const BORDER_COLOR_SUCCESS = '#28a745'; // Verde
    const BORDER_COLOR_PENDING = '#dc3545';    // Vermelho

    // OPACIDADE CONFIG
    const OPACITY_IDLE = '0.2';
    const OPACITY_HOVER = '1.0';

    // --- FUNÇÃO DE ARRASTAR CORRIGIDA ---
    function makeDraggable(element) {
        let offsetX = 0, offsetY = 0, isDragging = false;

        const onMouseMove = (e) => {
            if (!isDragging) return;
            // Atualiza posição baseada no topo/esquerda da janela
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        };

        const onMouseUp = () => {
            isDragging = false;
            element.style.cursor = 'grab';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        element.addEventListener('mousedown', (e) => {
            if (e.target.closest('.mxm-close-btn')) return;
            isDragging = true;

            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // CRÍTICO: Converte a posição atual para pixels fixos e remove a ancoragem bottom/right
            // Isso impede que o widget fique preso no fundo
            element.style.left = rect.left + 'px';
            element.style.top = rect.top + 'px';
            element.style.bottom = 'auto';
            element.style.right = 'auto';

            element.style.cursor = 'grabbing';
            // e.preventDefault(); // Removido para testar fluidez, se selecionar texto descomente

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // --- FUNÇÕES AUXILIARES (Sem alterações lógicas) ---
    function getMissionRewardRate() {
        try {
            const xpath = "//*[contains(text(), 'USD') and (contains(text(), 'Reward:') or contains(text(), 'Recompensa:'))]";
            const results = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = results.snapshotLength - 1; i >= 0; i--) {
                const node = results.snapshotItem(i);
                if (node && node.textContent) {
                    const match = node.textContent.match(/(?:Reward|Recompensa):\s*([\d\.]+)\s*USD/i);
                    if (match && match[1]) return parseFloat(match[1]);
                }
            }
        } catch (e) { console.error(e); }
        return FALLBACK_REWARD_RATE;
    }

    function calculateGlobalTotal() {
        let currentRewardRate = getMissionRewardRate() || FALLBACK_REWARD_RATE;
        let totalTasksFound = 0;
        try {
            const divs = document.querySelectorAll('div');
            // Filtro simplificado para performance
            const validDivs = Array.from(divs).filter(div =>
                div.textContent && (div.textContent.includes('Concluído') || div.textContent.includes('Completed')) &&
                div.textContent.match(/·\s*\d+/)
            );

            if (validDivs.length > 0) {
                const last = validDivs[validDivs.length - 1];
                const match = last.textContent.match(/(?:Concluído|Completed)\s*·\s*(\d+)/i);
                if (match) totalTasksFound = parseInt(match[1]);
            }
        } catch (e) { totalTasksFound = 0; }

        const totalUSD = (currentRewardRate * totalTasksFound).toFixed(2);
        const totalBRL = (totalUSD * USD_TO_BRL_ESTIMATE).toFixed(2);
        return { totalUSD, totalBRL, count: totalTasksFound, rate: currentRewardRate };
    }

    // --- ATUALIZAÇÃO DO WIDGET ---
    function updateWidget() {
        try {
            if (!window.location.href.includes('/tasks')) {
                const existing = document.getElementById(TOTAL_WIDGET_ID);
                if (existing) existing.remove();
                return;
            }

            const { totalUSD, totalBRL, count, rate } = calculateGlobalTotal();
            let widget = document.getElementById(TOTAL_WIDGET_ID);
            const isGoalAchieved = parseFloat(totalUSD) >= 50.00;
            const borderStyle = isGoalAchieved ? `3px solid ${BORDER_COLOR_SUCCESS}` : `3px solid ${BORDER_COLOR_PENDING}`;

            if (!widget || !document.body.contains(widget)) {
                if (widget) widget.remove();
                widget = document.createElement('div');
                widget.id = TOTAL_WIDGET_ID;

                // Estilo inicial corrigido com position: fixed
                widget.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 2147483647; /* Z-index alto para garantir que flutue */
                    padding: 15px 25px 20px 25px;
                    color: ${WIDGET_TEXT_COLOR};
                    border-radius: 15px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
                    font-family: sans-serif;
                    text-align: center;
                    cursor: grab;
                    line-height: 1.5;
                    min-width: 250px;
                    transition: opacity 0.3s ease-in-out;
                    user-select: none;
                    backdrop-filter: blur(6px);
                    background-color: ${WIDGET_BG_COLOR};
                    opacity: ${OPACITY_IDLE};
                    ${borderStyle};
                `;

                // Eventos de Opacidade
                widget.addEventListener('mouseenter', () => { widget.style.opacity = OPACITY_HOVER; });
                widget.addEventListener('mouseleave', () => { widget.style.opacity = OPACITY_IDLE; });

                // Botão fechar
                const closeBtn = document.createElement('div');
                closeBtn.innerHTML = '×';
                closeBtn.className = 'mxm-close-btn';
                closeBtn.style.cssText = `position: absolute; top: 5px; right: 10px; font-size: 18px; font-weight: bold; cursor: pointer;`;
                closeBtn.onclick = () => widget.remove();
                widget.appendChild(closeBtn);

                // Conteúdo
                const container = document.createElement('div');
                container.innerHTML = `
                    <div class="mxm-widget-title" style="font-size: 14px; font-weight: bold;"></div>
                    <div class="mxm-value-display" style="font-size: 28px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <img src="${FLAGS.USD}" style="width:22px; height:15px; border-radius:2px;">
                        <span class="mxm-usd-value"></span>
                    </div>
                    <div class="mxm-estimate-brl" style="font-size: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px;">
                        <img src="${FLAGS.BRL}" style="width:22px; height:15px; border-radius:2px;">
                        <span class="mxm-brl-value"></span>
                    </div>
                    <div class="mxm-count-display" style="font-size: 11px; margin-top: 6px;"></div>
                `;
                widget.appendChild(container);
                document.body.appendChild(widget);
                makeDraggable(widget);
            }

            // Atualiza valores
            widget.querySelector('.mxm-widget-title').textContent = `SOMA TOTAL (Taxa: $${rate.toFixed(2)} USD)`;
            widget.querySelector('.mxm-usd-value').textContent = `$${totalUSD} USD`;
            widget.querySelector('.mxm-brl-value').textContent = `≈ R$${totalBRL}`;
            widget.querySelector('.mxm-count-display').textContent = `${count} tarefas somadas`;
            widget.style.border = borderStyle;

        } catch (e) { console.error(e); }
    }

    try {
        setTimeout(() => {
            updateWidget();
            setInterval(updateWidget, 2000);
        }, 1000);
    } catch (e) {}

})();