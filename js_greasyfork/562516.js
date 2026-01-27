// ==UserScript==
// @name         Audio-Equalizer-1.5.26
// @namespace    http://tampermonkey.net/
// @version      1.5.26
// @description  Equalizer with UI, for the video player.// @author       Tapeavion-gullampis810
// @match        https://www.youtube.com/*
// @match        https://www.kick.com/*
// @match        https://www.twitch.tv/*
// @license      MIT
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/xp4m73v6kixyvkv6tawfe54eiu9x
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562516/Audio-Equalizer-1526.user.js
// @updateURL https://update.greasyfork.org/scripts/562516/Audio-Equalizer-1526.meta.js
// ==/UserScript==


// matches  ://*/*
// @match        https://www.youtube.com/*
// @match        https://www.kick.com/*
// etc и.тд

(function () {
    'use strict';

    if (window.eqHasRun) return;
    window.eqHasRun = true;

    const STORAGE_KEY = 'customAudioEqualizerSettings';

    // Функции сохранения/загрузки
    function saveSettings() {
        const settings = {
            bass: document.getElementById('bass').value,
            mid: document.getElementById('mid').value,
            treble: document.getElementById('treble').value,
            volume: document.getElementById('volume').value,
            pitch: document.getElementById('pitch').value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function loadSettings() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return false;

        try {
            const settings = JSON.parse(saved);

            document.getElementById('bass').value = settings.bass || 0;
            document.getElementById('mid').value = settings.mid || 0;
            document.getElementById('treble').value = settings.treble || 0;
            document.getElementById('volume').value = settings.volume || 100;
            document.getElementById('pitch').value = settings.pitch || 100;

            // Обновляем отображаемые значения
            document.getElementById('bass-val').textContent = settings.bass + ' dB';
            document.getElementById('mid-val').textContent = settings.mid + ' dB';
            document.getElementById('treble-val').textContent = settings.treble + ' dB';
            document.getElementById('volume-val').textContent = settings.volume + '%';
            document.getElementById('pitch-val').textContent = (settings.pitch / 100).toFixed(2) + '×';

            return true;
        } catch (e) {
            console.error('Ошибка загрузки настроек EQ');
            return false;
        }
    }

    // CSS
    const style = document.createElement('style');
    style.textContent = `
        #eq-toggle-btn {
            position: fixed;
            top: 12px;
            right: 290px;
            width: 40px;
            height: 40px;
            background: #00ff00;
            color: #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6);
            user-select: none;
        }
        #eq-panel {
            position: fixed;
            top: 80px;
            right: 80px;
            width: 320px;
            background: rgb(13 28 21);
            color: #fff;
            border-radius: 12px;
            padding: 12px;
            z-index: 9999;
            box-shadow: 0 8px 30px rgba(0,0,0,0.8);
            display: none;
            font-family: Arial, sans-serif;
            user-select: none;
            border: 2px solid #479847;
        }
        #eq-header {
            background: #479847;
            padding: 8px;
            border-radius: 8px;
            text-align: center;
            cursor: move;
            margin-bottom: 12px;
            position: relative;
            color: #14141e;
            font-family: revert;
            font-weight: 700;
        }
        #eq-close-btn {
            position: absolute;
            right: 8px;
            top: 4px;
            cursor: pointer;
            font-size: 20px;
        }
        #eq-header:hover {
            background: #8bbf8b;
            padding: 12px;
            border-radius: 15px;
            text-align: center;
            cursor: move;
            margin-bottom: 12px;
            color: #14141e;
            font-weight: 700;
}

        #eq-toggle-btn:hover {
            background: #b9a2cb;
            color: #14141e;
            font-weight: 700;
}
        .slider-container {
            margin: 12px 0;
        }
        .slider-container label {
            display: block;
            margin-bottom: 4px;
            font-size: 14px;
        }
        .slider-container input[type="range"] {
            width: 100%;
            appearance: none;
            background: #47984769;
            border-radius: 8px;
        }
        .value {
            float: right;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);

   // Кнопка и панель (без изменений)
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'eq-toggle-btn';
    toggleBtn.textContent = 'EQ';
    document.body.appendChild(toggleBtn);

    const panel = document.createElement('div');
    panel.id = 'eq-panel';
    panel.innerHTML = `
        <div id="eq-header">
             Audio Equalizer
            <span id="eq-close-btn"> X </span>
        </div>
        <div class="slider-container">
            <label>Bass</label>
            <input type="range" id="bass" min="-20" max="20" value="0" step="0.5">
            <span class="value" id="bass-val">0 dB</span>
        </div>
        <div class="slider-container">
            <label>Mid</label>
            <input type="range" id="mid" min="-20" max="20" value="0" step="0.5">
            <span class="value" id="mid-val">0 dB</span>
        </div>
        <div class="slider-container">
            <label>Treble</label>
            <input type="range" id="treble" min="-20" max="20" value="0" step="0.5">
            <span class="value" id="treble-val">0 dB</span>
        </div>
        <div class="slider-container">
            <label>Volume</label>
            <input type="range" id="volume" min="0" max="200" value="100" step="5">
            <span class="value" id="volume-val">100%</span>
        </div>
        <div class="slider-container">
            <label>Tone / Speed</label>
            <input type="range" id="pitch" min="50" max="200" value="100" step="1">
            <span class="value" id="pitch-val">1.00×</span>
        </div>
    `;
    document.body.appendChild(panel);

        // Наблюдатель за появлением <video> (важно для YouTube/Twitch/Kick)
    const videoObserver = new MutationObserver(() => {
        initializeAudioIfNeeded();
    });

    videoObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Пытаемся инициализировать сразу
    initializeAudioIfNeeded();

    // Загружаем сохранённые настройки сразу после создания панели
    loadSettings();

    const closeBtn = panel.querySelector('#eq-close-btn');
    const header = panel.querySelector('#eq-header');

    // Drag (без изменений)
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        if (e.target === closeBtn) return;
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    closeBtn.onclick = () => {
        panel.style.display = 'none';
    };

    // Аудио-часть
    let audioContext = null;

        function resumeAudioOnInteraction() {
        if (audioContext && audioContext.state !== 'running') {
            audioContext.resume().then(() => {
                console.log('AudioContext разблокирован');
                applyCurrentSettings();  // Применяем настройки сразу после разблокировки
            });
        }
    }

// Разблокируем при первом клике, таче или нажатии клавиши
document.addEventListener('click', resumeAudioOnInteraction, { once: true });
document.addEventListener('touchstart', resumeAudioOnInteraction, { once: true });
document.addEventListener('keydown', resumeAudioOnInteraction, { once: true });
    

    let source = null;
    let lowFilter, midFilter, highFilter, gainNode;
    let video = null;

    let audioInitialized = false;

    async function initializeAudioIfNeeded() {
        if (audioInitialized) return;

        video = document.querySelector('video');
        if (!video) return;  // Видео ещё не появилось — подождём observer

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Подключаем цепочку (это можно делать без resume)
        if (!source) {
            source = audioContext.createMediaElementSource(video);
            lowFilter = audioContext.createBiquadFilter();
            lowFilter.type = 'lowshelf';
            lowFilter.frequency.value = 200;

            midFilter = audioContext.createBiquadFilter();
            midFilter.type = 'peaking';
            midFilter.frequency.value = 1000;
            midFilter.Q.value = 1;

            highFilter = audioContext.createBiquadFilter();
            highFilter.type = 'highshelf';
            highFilter.frequency.value = 5000;

            gainNode = audioContext.createGain();

            source.connect(lowFilter);
            lowFilter.connect(midFilter);
            midFilter.connect(highFilter);
            highFilter.connect(gainNode);
            gainNode.connect(audioContext.destination);

            video.volume = 0;  // Отключаем оригинальный звук
        }

        audioInitialized = true;

        // Применяем сохранённые настройки к фильтрам (если контекст уже разблокирован)
        if (audioContext.state === 'running') {
            applyCurrentSettings();
        }
    }

    function applyCurrentSettings() {
        if (!audioContext || !video) return;

        const bassVal = parseFloat(document.getElementById('bass').value);
        const midVal = parseFloat(document.getElementById('mid').value);
        const trebleVal = parseFloat(document.getElementById('treble').value);
        const volumeVal = parseFloat(document.getElementById('volume').value) / 100;
        const pitchVal = parseFloat(document.getElementById('pitch').value) / 100;

        lowFilter.gain.value = bassVal;
        midFilter.gain.value = midVal;
        highFilter.gain.value = trebleVal;
        gainNode.gain.value = volumeVal;
        video.playbackRate = pitchVal;
    }

    toggleBtn.onclick = async () => {
        await initializeAudioIfNeeded();  // На всякий случай пытаемся инициализировать
        if (audioContext && audioContext.state !== 'running') {
            await audioContext.resume();  // Если пользователь кликнул кнопку — точно разблокируем
        }
        applyCurrentSettings();
        panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    };

    // Слайдеры — обновление + сохранение
    const sliders = ['bass', 'mid', 'treble', 'volume', 'pitch'];
    sliders.forEach(id => {
        panel.querySelector('#' + id).oninput = (e) => {
            const val = e.target.value;

            if (id === 'bass' && lowFilter) lowFilter.gain.value = parseFloat(val);
            if (id === 'mid' && midFilter) midFilter.gain.value = parseFloat(val);
            if (id === 'treble' && highFilter) highFilter.gain.value = parseFloat(val);
            if (id === 'volume' && gainNode) gainNode.gain.value = val / 100;
            if (id === 'pitch' && video) video.playbackRate = val / 100;

            // Обновляем текст
            if (id === 'pitch') {
                panel.querySelector('#' + id + '-val').textContent = (val / 100).toFixed(1) + '×';
            } else if (id === 'volume') {
                panel.querySelector('#' + id + '-val').textContent = val + '%';
            } else {
                panel.querySelector('#' + id + '-val').textContent = val + ' dB';
            }

            // Сохраняем все настройки
            saveSettings();
        };
    });
})();


