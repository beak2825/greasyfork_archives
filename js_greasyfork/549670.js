// ==UserScript==
// @name         SkinRave Rain Notify with Worker
// @namespace    http://tampermonkey.net/
// @version      2025-09-15
// @description  Toca beep quando o botão "Join" aparece na página, mesmo minimizado
// @author       SkinRave: 9726
// @match        https://skinrave.gg/*
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/549670/SkinRave%20Rain%20Notify%20with%20Worker.user.js
// @updateURL https://update.greasyfork.org/scripts/549670/SkinRave%20Rain%20Notify%20with%20Worker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastState = false;

    // Cria AudioContext
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function beep(frequency = 440, duration = 200) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'square';
        oscillator.frequency.value = frequency;
        oscillator.start();
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration / 1000);
        oscillator.stop(audioCtx.currentTime + duration / 1000);
    }

    function beepRepeat(frequency = 440, duration = 200, times = 5, interval = 300) {
        for (let i = 0; i < times; i++) {
            setTimeout(() => beep(frequency, duration), i * interval);
        }
    }

    // Função para limpar o texto e converter em número
    function parseValor(texto) {
        let limpo = texto.replace(/,/g, '').replace(/[^\d.]/g, '');
        return parseFloat(limpo) || 0;
    }

    // Worker inline para rodar interval sem throttling
    const workerCode = `
        self.onmessage = function(e) {
            const interval = e.data.interval || 2000;
            setInterval(() => {
                self.postMessage("tick");
            }, interval);
        };
    `;
    const worker = new Worker(URL.createObjectURL(new Blob([workerCode], {type: 'application/javascript'})));
    worker.postMessage({ interval: 2000 });

    // Recebe "tick" do worker
    worker.onmessage = () => {
        let span = document.querySelectorAll("span")[92];
        if(!span) return;
        var tokens = parseValor(span.textContent.trim());

        const button = document.querySelector('button[aria-label="join-rain-button"] span.inline-flex');
        const exists = button && button.textContent.trim() === "Join";

        if (exists && !lastState) {
            if(tokens <= 500.00)
                beepRepeat();
            else if(tokens > 500.00 && tokens < 1000.00)
                beepRepeat(660, 100, 5, 200);
            else
                beepRepeat(880, 100, 3, 200);
        }
        lastState = exists;
    };

})();
