// ==UserScript==
// @name         Recaptcha Audio AutoPlay + Retry Widget
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Автоматический аудиоплеер reCAPTCHA: автоплей с повтором, кнопка Play всегда видна, панель draggable
// @match        https://www.google.com/recaptcha/api2/*
// @match        https://www.recaptcha.net/recaptcha/api2/*
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549734/Recaptcha%20Audio%20AutoPlay%20%2B%20Retry%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/549734/Recaptcha%20Audio%20AutoPlay%20%2B%20Retry%20Widget.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoPlayEnabled = JSON.parse(localStorage.getItem('rcpAutoPlayEnabled'));
    if (autoPlayEnabled === null) autoPlayEnabled = true;

    // --- Панель ---
    const playerBox = document.createElement('div');
    playerBox.style.cssText = `
        position:fixed;
        bottom:10px;
        right:10px;
        z-index:999999;
        background:#000;
        color:#0f0;
        padding:8px;
        font:12px monospace;
        border:1px solid #0f0;
        border-radius:6px;
        width:300px;
        cursor:move;
    `;
    const savedPos = JSON.parse(localStorage.getItem('rcpBoxPos') || '{}');
    if (savedPos.left && savedPos.top) {
        playerBox.style.left = savedPos.left + 'px';
        playerBox.style.top = savedPos.top + 'px';
        playerBox.style.right = 'auto';
        playerBox.style.bottom = 'auto';
    }

    playerBox.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>🔊 Audio CAPTCHA</span>
            <div>
                <button id="rcp-toggle" style="background:#0f0;color:#000;font-weight:bold;margin-right:4px;">–</button>
                <button id="rcp-autoplay-toggle" style="background:#0f0;color:#000;font-weight:bold;">${autoPlayEnabled?'ON':'OFF'}</button>
            </div>
        </div>
        <div id="rcp-body" style="margin-top:4px;">
            <audio id="rcp-audio" controls style="width:280px;"></audio>
            <button id="rcp-play" style="width:280px;margin-top:5px;background:#000;color:#0f0;font-weight:bold;">▶ Play</button>
        </div>
    `;
    document.body.appendChild(playerBox);

    const bodyDiv = document.getElementById('rcp-body');
    const toggleBtn = document.getElementById('rcp-toggle');
    const autoPlayBtn = document.getElementById('rcp-autoplay-toggle');
    const audioTag = document.getElementById('rcp-audio');
    const playBtn = document.getElementById('rcp-play');

    // Сворачивание
    toggleBtn.addEventListener('click', () => {
        if (bodyDiv.style.display !== 'none') {
            bodyDiv.style.display = 'none';
            toggleBtn.textContent = '+';
        } else {
            bodyDiv.style.display = 'block';
            toggleBtn.textContent = '–';
        }
    });

    // Автоплей ON/OFF
    autoPlayBtn.addEventListener('click', () => {
        autoPlayEnabled = !autoPlayEnabled;
        localStorage.setItem('rcpAutoPlayEnabled', JSON.stringify(autoPlayEnabled));
        autoPlayBtn.textContent = autoPlayEnabled ? 'ON' : 'OFF';
    });

    // Кнопка Play
    playBtn.addEventListener('click', () => {
        audioTag.play().catch(()=>console.log('Автоплей разблокирован.'));
        playBtn.style.background = '#000';
    });

    function highlightPlayButton() {
        playBtn.style.background = '#0f0';
    }

    // MutationObserver для новых аудио
    let lastSrc = null;
    const observer = new MutationObserver(() => {
        const aud = document.querySelector('audio[src]');
        if (aud && aud.src && aud.src !== lastSrc) {
            lastSrc = aud.src;
            audioTag.src = lastSrc;
            audioTag.load();
            highlightPlayButton();

            // Повторная попытка автоплей
            if (autoPlayEnabled) {
                const tryPlay = setInterval(() => {
                    audioTag.play().then(() => {
                        playBtn.style.background = '#000';
                        clearInterval(tryPlay);
                    }).catch(()=>{
                        highlightPlayButton(); // мигаем пока не удалось воспроизвести
                    });
                }, 500); // повторяем каждые 500мс до успеха
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Перетаскивание панели
    let isDragging = false, offsetX, offsetY;
    playerBox.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'AUDIO') return;
        isDragging = true;
        offsetX = e.clientX - playerBox.getBoundingClientRect().left;
        offsetY = e.clientY - playerBox.getBoundingClientRect().top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        playerBox.style.left = (e.clientX - offsetX) + 'px';
        playerBox.style.top = (e.clientY - offsetY) + 'px';
        playerBox.style.right = 'auto';
        playerBox.style.bottom = 'auto';
    }

    function onMouseUp() {
        if (isDragging) {
            isDragging = false;
            localStorage.setItem('rcpBoxPos', JSON.stringify({
                left: parseInt(playerBox.style.left),
                top: parseInt(playerBox.style.top)
            }));
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

})();
