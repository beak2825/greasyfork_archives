// ==UserScript==
// @name         AgarBR - Linha Vertical com tecla S
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Ao pressionar 'S' alterna um modo que simula cliques ao longo de uma linha vertical no canvas de agariobr.com.br
// @author       Você
// @match        https://www.agariobr.com.br/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/550815/AgarBR%20-%20Linha%20Vertical%20com%20tecla%20S.user.js
// @updateURL https://update.greasyfork.org/scripts/550815/AgarBR%20-%20Linha%20Vertical%20com%20tecla%20S.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- CONFIGURAÇÃO ---------- */
    const INTERVAL_MS = 60;      // intervalo entre cliques em ms
    const STEPS = 18;            // número de pontos na linha vertical
    const LENGTH_PX = 360;       // comprimento total da linha (em pixels, relativa ao canvas)
    const BUTTON_CLICK = 0;      // 0 = botão esquerdo do mouse
    /* ---------------------------------- */

    let running = false;
    let timer = null;

    // util: encontra o canvas do jogo
    function findGameCanvas() {
        // tentamos encontrar <canvas> visível dentro do document
        const canvases = Array.from(document.querySelectorAll('canvas'));
        if (!canvases.length) return null;
        // retorna o canvas com maior área visível
        canvases.sort((a,b) => (b.width*b.height) - (a.width*a.height));
        return canvases[0];
    }

    // util: cria e despacha MouseEvent com client coords
    function dispatchMouseEvent(type, x, y, button = BUTTON_CLICK) {
        const event = new MouseEvent(type, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: Math.round(x),
            clientY: Math.round(y),
            button: button,
            buttons: 1
        });
        return event;
    }

    // simula um clique completo (mousedown + mouseup + click) no elemento alvo
    function simulateClickAt(element, clientX, clientY) {
        const target = element || document.elementFromPoint(clientX, clientY);
        if (!target) return;
        target.dispatchEvent(dispatchMouseEvent('mousemove', clientX, clientY));
        target.dispatchEvent(dispatchMouseEvent('mousedown', clientX, clientY));
        // breve delay entre down/up — aqui usamos setTimeout 0 para mesmo tick
        target.dispatchEvent(dispatchMouseEvent('mouseup', clientX, clientY));
        target.dispatchEvent(dispatchMouseEvent('click', clientX, clientY));
    }

    // Gera a lista de pontos (client coords) ao longo de uma linha vertical central no canvas
    function computeVerticalPoints(canvas) {
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2; // linha vertical no centro horizontal do canvas
        const centerY = rect.top + rect.height / 2;
        const half = LENGTH_PX / 2;
        const startY = centerY - half;
        const step = LENGTH_PX / Math.max(1, STEPS - 1);

        const points = [];
        for (let i = 0; i < STEPS; i++) {
            const y = startY + i * step;
            // clamp no rect para não sair fora do canvas
            const clampedY = Math.max(rect.top + 1, Math.min(rect.bottom - 1, y));
            points.push({x: centerX, y: clampedY});
        }
        return points;
    }

    // mostra um pequeno overlay indicando status
    const overlay = (function createOverlay(){
        const o = document.createElement('div');
        Object.assign(o.style, {
            position: 'fixed',
            right: '12px',
            top: '12px',
            zIndex: 999999,
            padding: '6px 10px',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            fontSize: '13px',
            borderRadius: '6px',
            fontFamily: 'Arial, sans-serif',
            pointerEvents: 'none'
        });
        o.textContent = "Linha Vertical: OFF (tecla S)";
        document.body.appendChild(o);
        return o;
    })();

    function updateOverlay() {
        overlay.textContent = `Linha Vertical: ${running ? 'ON' : 'OFF'} (tecla S)`;
        overlay.style.background = running ? 'rgba(0,128,0,0.65)' : 'rgba(0,0,0,0.6)';
    }

    // função principal que inicia a execução contínua
    function startLineMode() {
        const canvas = findGameCanvas();
        if (!canvas) {
            console.warn('AgarBR linha: não encontrou canvas.');
            return;
        }
        const points = computeVerticalPoints(canvas);
        let idx = 0;

        timer = setInterval(() => {
            if (!running) return;
            const p = points[idx];
            simulateClickAt(canvas, p.x, p.y);
            idx++;
            if (idx >= points.length) idx = 0; // repete a linha
        }, INTERVAL_MS);
    }

    function stopLineMode() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    // atalho de teclado: tecla S para alternar
    window.addEventListener('keydown', (e) => {
        // ignora se modifier (ctrl/alt/meta) estiver pressionado para evitar conflito
        if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            running = !running;
            updateOverlay();
            if (running) {
                // começar
                if (!timer) startLineMode();
            } else {
                // parar
                stopLineMode();
            }
            // previne que a página veja o 's' como input (quando for o caso)
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // tenta iniciar timer prontamente (mas só irá rodar quando running=true)
    startLineMode();

    // limpa ao sair da página
    window.addEventListener('beforeunload', () => stopLineMode());

    // log curto para debug
    console.info('AgarBR - Linha Vertical (tecla S) script carregado.');
})();