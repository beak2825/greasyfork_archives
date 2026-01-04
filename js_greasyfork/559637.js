// ==UserScript==
// @name         TikNot Video Optimizer for Tiktok Videos 1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds progress bar, volume control, fullscreen button, and keyboard shortcuts to TikNot.
// @author       Eliton
// @match        https://tiknot.netlify.app/*
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/en/users/1550373
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559637/TikNot%20Video%20Optimizer%20for%20Tiktok%20Videos%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/559637/TikNot%20Video%20Optimizer%20for%20Tiktok%20Videos%2010.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hideBarTimeout;

    // --- FUNÇÕES AUXILIARES ---
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function getActiveVideo() {
        return document.getElementById('video');
    }

    // --- GERENCIADOR DE TECLADO ---
    window.addEventListener('keydown', (e) => {
        const video = getActiveVideo();
        if (!video) return;

        const tag = document.activeElement ? document.activeElement.tagName.toUpperCase() : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;

        // Atalhos de Navegação (Esquerda/Direita)
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            showBarTemporarily();
            e.preventDefault();
            if (e.key === 'ArrowRight') {
                video.currentTime = Math.min(video.duration, video.currentTime + 5);
                showFeedback('Avançar 5s', '▶▶');
            } else {
                video.currentTime = Math.max(0, video.currentTime - 5);
                showFeedback('Voltar 5s', '◀◀');
            }
        }

        // Atalhos de Volume (Cima/Baixo)
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            showBarTemporarily();
            e.preventDefault();
            if (e.key === 'ArrowUp') {
                video.volume = Math.min(1, video.volume + 0.1);
                showFeedback(`Volume: ${Math.round(video.volume * 100)}%`, '🔊');
            } else {
                video.volume = Math.max(0, video.volume - 0.1);
                showFeedback(`Volume: ${Math.round(video.volume * 100)}%`, '🔉');
            }
        }

        // Atalho Tela Cheia (F)
        if (e.key.toLowerCase() === 'f') {
            toggleFullscreen();
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

    function toggleFullscreen() {
        const video = getActiveVideo();
        if (!video) return;
        if (!document.fullscreenElement) {
            if (video.parentElement.requestFullscreen) {
                video.parentElement.requestFullscreen();
            } else if (video.requestFullscreen) {
                video.requestFullscreen();
            }
        } else {
            document.exitFullscreen();
        }
    }

    // --- LÓGICA VISUAL ---
    function showBar() { const b = document.getElementById('custom-progress-bar'); if(b) b.style.opacity='1'; }
    function hideBar() { const b = document.getElementById('custom-progress-bar'); if(b && !b.matches(':hover')) b.style.opacity='0'; }
    function showBarTemporarily() { showBar(); clearTimeout(hideBarTimeout); hideBarTimeout = setTimeout(hideBar, 2500); }

    document.addEventListener('mousemove', showBarTemporarily);
    document.addEventListener('mouseleave', hideBar);

    // --- CONSTRUÇÃO DA INTERFACE ---
    function updateProgressBar() {
        const video = getActiveVideo();
        if (!video || !video.src || video.src.includes('#')) {
            const bar = document.getElementById('custom-progress-bar');
            if (bar) bar.style.display = 'none';
            return;
        }

        const rect = video.getBoundingClientRect();
        if (rect.width > 0) {
            let bar = document.getElementById('custom-progress-bar');

            if (!bar) {
                bar = document.createElement('div');
                bar.id = 'custom-progress-bar';
                bar.style.cssText = `
                    position: fixed; z-index: 2147483646;
                    display: flex; align-items: center; padding: 0 15px; box-sizing: border-box;
                    opacity: 0; transition: opacity 0.3s ease;
                    background: linear-gradient(transparent, rgba(0,0,0,0.8)); pointer-events: auto;
                    gap: 15px;
                `;

                // 1. Slider de Progresso
                const range = document.createElement('input');
                range.id = 'cpb-range';
                range.type = 'range'; range.min = 0; range.max = 100; range.step = 0.1;
                range.style.cssText = `flex: 4; height: 5px; cursor: pointer; -webkit-appearance: none; background: rgba(255,255,255,0.2); border-radius: 5px;`;
                range.oninput = (e) => {
                    video.currentTime = (video.duration * e.target.value) / 100;
                    clearTimeout(hideBarTimeout);
                };

                // 2. Controle de Volume
                const volContainer = document.createElement('div');
                volContainer.style.cssText = `display: flex; align-items: center; gap: 5px; flex: 1; min-width: 80px;`;
                volContainer.innerHTML = `<span style="color:white; font-size:14px;">🔊</span>`;

                const volRange = document.createElement('input');
                volRange.id = 'cpb-volume';
                volRange.type = 'range'; volRange.min = 0; volRange.max = 1; volRange.step = 0.05;
                volRange.value = video.volume;
                volRange.style.cssText = `width: 100%; height: 4px; cursor: pointer; -webkit-appearance: none; background: rgba(255,255,255,0.3); border-radius: 2px;`;
                volRange.oninput = (e) => {
                    video.volume = e.target.value;
                    clearTimeout(hideBarTimeout);
                };
                volContainer.appendChild(volRange);

                // 3. Label de Tempo
                const timeLabel = document.createElement('span');
                timeLabel.id = 'cpb-time';
                timeLabel.style.cssText = `color: white; font-family: sans-serif; font-size: 12px; font-weight: bold; min-width: 85px; text-align: center;`;

                // 4. Botão Fullscreen
                const fsBtn = document.createElement('button');
                fsBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
                    </svg>
                `;
                fsBtn.style.cssText = `background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 5px;`;
                fsBtn.onclick = (e) => { e.stopPropagation(); toggleFullscreen(); };

                bar.appendChild(range);
                bar.appendChild(volContainer);
                bar.appendChild(timeLabel);
                bar.appendChild(fsBtn);
                document.body.appendChild(bar);

                bar.addEventListener('mousedown', e => e.stopPropagation());
                bar.addEventListener('click', e => e.stopPropagation());
            }

            bar.style.display = 'flex';
            bar.style.left = rect.left + 'px';
            bar.style.width = rect.width + 'px';
            bar.style.top = (rect.bottom - 45) + 'px';
            bar.style.height = '45px';

            const range = bar.querySelector('#cpb-range');
            const volRange = bar.querySelector('#cpb-volume');
            const timeLabel = bar.querySelector('#cpb-time');

            // Atualiza Progresso
            if (!range.matches(':active')) {
                const pct = (video.currentTime / video.duration) * 100 || 0;
                range.value = pct;
                range.style.background = `linear-gradient(to right, #ff0050 ${pct}%, rgba(255,255,255,0.2) ${pct}%)`;
                timeLabel.innerText = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
            }

            // Atualiza Volume no Slider se mudar por atalho
            if (!volRange.matches(':active')) {
                volRange.value = video.volume;
                const vPct = video.volume * 100;
                volRange.style.background = `linear-gradient(to right, #fff ${vPct}%, rgba(255,255,255,0.3) ${vPct}%)`;
            }
        }
    }

    setInterval(updateProgressBar, 100);

})();