// ==UserScript==
// @name        Qwen Chat: chime when generation finishes
// @name:ru     Qwen Chat: звуковой сигнал по завершении генерации
// @version     1.1
// @description Beep when Qwen finishes, even if you're on another tab.
// @description:ru Издает звуковой сигнал, когда Qwen заканчивает генерацию, даже если вы находитесь на другой вкладке.
// @author      a114_you
// @match       https://chat.qwen.ai/*
// @grant       none
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/1475624
// @downloadURL https://update.greasyfork.org/scripts/556410/Qwen%20Chat%3A%20chime%20when%20generation%20finishes.user.js
// @updateURL https://update.greasyfork.org/scripts/556410/Qwen%20Chat%3A%20chime%20when%20generation%20finishes.meta.js
// ==/UserScript==

(() => {
    let generating = false;
    let ctx = null;

    const initAudio = () => {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
    };

    // Слушаем действия пользователя для разблокировки звука
    ['click', 'keydown', 'mousedown'].forEach(ev =>
        document.addEventListener(ev, initAudio, { once: false })
    );

    const playSound = () => {
        if (!ctx) return;
        initAudio();

        const g = ctx.createGain();
        g.gain.value = 0.2;
        g.connect(ctx.destination);

        const t = ctx.currentTime;
        [660, 880].forEach((f, i) => {
            const o = ctx.createOscillator();
            o.type = 'sine';
            o.frequency.value = f;
            o.connect(g);
            o.start(t + i * 0.15);
            o.stop(t + i * 0.15 + 0.3);
        });
    };

    const isGenerating = () => {
        // Проверка иконки Stop
        return !!document.querySelector('use[*|href*="stop"], use[*|href*="Stop"]');
    };

    const checkStatus = () => {
        const now = isGenerating();

        if (now && !generating) {
            generating = true;
        }
        else if (!now && generating) {
            generating = false;
            playSound();
        }
    };

    // Следим за изменениями на странице
    const observer = new MutationObserver(checkStatus);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // Первичная установка статуса
    generating = isGenerating();
})();