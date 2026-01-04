// ==UserScript==
// @name         YouTube Shorts Optimizer 1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Combinação: Adiciona botão de tela cheia, barra de progresso no rodapé, contador de tempo do video, seta para esquerda e para direita avançam ou retrocedem o video em 5 segundos
// @description (EN) Add Fullscreen button, waveform progress bar, time counter, and keyboard shortcuts (Left/Right Arrows) to YouTube Shorts.
// @description (PT) Adiciona botão de tela cheia, barra de progresso, contador de tempo e atalhos de teclado (Setas Esquerda/Direita) aos YouTube Shorts.
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/en/users/1550373
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559638/YouTube%20Shorts%20Optimizer%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/559638/YouTube%20Shorts%20Optimizer%2010.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hideBarTimeout;

    // --- FUNÇÃO AUXILIAR: FORMATAR TEMPO (MM:SS) ---
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    // --- 1. SELETOR DE VÍDEO INTELIGENTE ---
    function getActiveVideo() {
        const activeRenderer = document.querySelector('ytd-reel-video-renderer[is-active]');
        if (activeRenderer) {
            const video = activeRenderer.querySelector('video');
            if (video) return video;
        }
        const allVideos = Array.from(document.querySelectorAll('video'));
        return allVideos.find(v => !!(v.currentTime > 0 && !v.paused && v.offsetHeight > 0));
    }

    // --- 2. GERENCIADOR DE TECLADO (NÍVEL DE SISTEMA) ---
    window.addEventListener('keydown', (e) => {
        if (!location.pathname.startsWith('/shorts/')) return;
        const tag = document.activeElement ? document.activeElement.tagName.toUpperCase() : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;

        const video = getActiveVideo();
        if (!video) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') showBarTemporarily();

        if (e.key === 'ArrowRight') {
            e.stopImmediatePropagation(); e.preventDefault();
            video.currentTime = Math.min(video.duration, video.currentTime + 5);
            showFeedback('Avançar 5s', '▶▶');
        }
        if (e.key === 'ArrowLeft') {
            e.stopImmediatePropagation(); e.preventDefault();
            video.currentTime = Math.max(0, video.currentTime - 5);
            showFeedback('Voltar 5s', '◀◀');
        }
    }, true);

    function showFeedback(text, icon) {
        let box = document.getElementById('kb-feedback-box');
        if (!box) {
            box = document.createElement('div');
            box.id = 'kb-feedback-box';
            box.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.7); color: white; padding: 15px 25px;
                border-radius: 10px; font-size: 20px; font-weight: bold;
                pointer-events: none; z-index: 2147483647; transition: opacity 0.2s;
            `;
            document.body.appendChild(box);
        }
        box.innerHTML = `${icon} ${text}`;
        box.style.opacity = '1';
        clearTimeout(box.timer);
        box.timer = setTimeout(() => box.style.opacity = '0', 600);
    }

    // --- FUNÇÕES VISUAIS DA BARRA ---
    function showBar() { const b = document.getElementById('fixed-progress-bar'); if(b) b.style.opacity='1'; }
    function hideBar() { const b = document.getElementById('fixed-progress-bar'); if(b && !b.matches(':hover')) b.style.opacity='0'; }
    function showBarTemporarily() { showBar(); clearTimeout(hideBarTimeout); hideBarTimeout = setTimeout(hideBar, 2500); }
    document.addEventListener('mousemove', showBarTemporarily);
    document.addEventListener('mouseleave', hideBar);


    // --- 3. LÓGICA DO BOTÃO TELA CHEIA (ORIGINAL) ---
    function triggerKeyF() {
        const ev = new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', keyCode: 70, which: 70, bubbles: true, cancelable: true });
        document.dispatchEvent(ev);
    }

    function fixFullscreenButton() {
        const rightControls = document.querySelector('ytd-shorts-player-controls #right-controls');
        if (!rightControls) return;

        const menuBtn = rightControls.querySelector('#menu-button');
        if (!menuBtn) return;

        let fsBtn = rightControls.querySelector('#fullscreen-button-shape');

        if (fsBtn) {
            fsBtn.style.display = 'flex';
            fsBtn.style.visibility = 'visible';
            fsBtn.style.opacity = '1';
            if (menuBtn.previousElementSibling !== fsBtn) {
                rightControls.insertBefore(fsBtn, menuBtn);
            }
        } else {
            if (document.getElementById('custom-fs-btn')) return;
            const newBtn = document.createElement('div');
            newBtn.id = 'custom-fs-btn';
            newBtn.style.cssText = 'display:flex; align-items:center; justify-content:center; margin-right:8px; cursor:pointer;';
            newBtn.innerHTML = `
                <button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--overlay-dark yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button"
                        style="background: transparent; border: none; cursor: pointer;">
                    <div class="yt-spec-button-shape-next__icon">
                        <span style="width: 24px; height: 24px; display: block;">
                             <svg viewBox="0 0 24 24" style="width:100%; height:100%; fill:white; filter: drop-shadow(0px 1px 4px rgba(0,0,0,0.3));">
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
                            </svg>
                        </span>
                    </div>
                </button>
            `;
            newBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); triggerKeyF(); };
            rightControls.insertBefore(newBtn, menuBtn);
        }
    }

    // --- 4. LÓGICA DA BARRA AZUL (RODAPÉ) + TIMER ---
    function fixProgressBar() {
        const video = getActiveVideo();
        if (video) {
            const rect = video.getBoundingClientRect();
            if (rect.width > 0) {
                let bar = document.getElementById('fixed-progress-bar');

                // CRIAÇÃO DA BARRA (Se não existir)
                if (!bar) {
                    bar = document.createElement('div');
                    bar.id = 'fixed-progress-bar';
                    bar.style.cssText = `
                        position: fixed; z-index: 2147483646;
                        display: flex; align-items: center; padding: 0 10px; box-sizing: border-box;
                        opacity: 0; transition: opacity 0.2s ease;
                        background: transparent; pointer-events: auto;
                    `;

                    // Input Range (Slider)
                    const range = document.createElement('input');
                    range.id = 'fpb-range';
                    range.type = 'range'; range.min = 0; range.max = 100; range.step = 0.1;
                    range.style.cssText = `
                        flex: 1; height: 5px; cursor: pointer; outline: none; margin: 0;
                        -webkit-appearance: none; background: rgba(255,255,255,0.2);
                        margin-right: 10px; /* Espaço para o tempo */
                    `;

                    // Texto do Tempo
                    const timeLabel = document.createElement('span');
                    timeLabel.id = 'fpb-time';
                    timeLabel.style.cssText = `
                        color: white; font-family: Roboto, Arial, sans-serif;
                        font-size: 11px; font-weight: 500; text-shadow: 1px 1px 2px black;
                        min-width: 60px; text-align: right;
                    `;
                    timeLabel.innerText = "0:00 / 0:00";

                    // Eventos do Slider
                    range.oninput = (e) => {
                        if (video) video.currentTime = (video.duration * e.target.value) / 100;
                        clearTimeout(hideBarTimeout);
                        // Atualiza o texto imediatamente ao arrastar
                        timeLabel.innerText = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
                    };
                    range.onchange = () => hideBarTimeout = setTimeout(hideBar, 2000);

                    bar.addEventListener('mousedown', e => e.stopPropagation());
                    bar.addEventListener('click', e => e.stopPropagation());

                    bar.appendChild(range);
                    bar.appendChild(timeLabel); // Adiciona o label na barra
                    document.body.appendChild(bar);
                }

                // ATUALIZAÇÃO CONTÍNUA (Posição e Valores)

                // 1. Posicionamento: Colado na borda inferior
                bar.style.left = rect.left + 'px';
                bar.style.width = rect.width + 'px';
                bar.style.top = (rect.bottom - 20) + 'px'; // Subi para 20px para caber o texto melhor
                bar.style.height = '20px';

                const range = bar.querySelector('#fpb-range');
                const timeLabel = bar.querySelector('#fpb-time');

                // 2. Atualiza Slider e Texto
                if (!range.matches(':active')) {
                    const pct = (video.currentTime / video.duration) * 100 || 0;
                    range.value = pct;
                    range.style.background = `linear-gradient(to right, #3ea6ff ${pct}%, rgba(255,255,255,0.2) ${pct}%)`;

                    // Atualiza o tempo: Atual / Total
                    timeLabel.innerText = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
                }
            }
        }
    }


    // --- LOOP UNIFICADO ---
    const observer = new MutationObserver(() => {
        fixFullscreenButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        fixFullscreenButton();
        fixProgressBar();
    }, 100);

})();
