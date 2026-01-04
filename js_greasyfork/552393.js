// ==UserScript==
// @name         Spotify: Полный Комбайн v9.0 (Финальная версия)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Панель управления + Автопропуск лайков (из v4.0) + РАБОЧАЯ кнопка "Исключить" и хоткей 'D' (из v8.1).
// @author       torch
// @match        https://open.spotify.com/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552393/Spotify%3A%20%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D0%9A%D0%BE%D0%BC%D0%B1%D0%B0%D0%B9%D0%BD%20v90%20%28%D0%A4%D0%B8%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552393/Spotify%3A%20%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D0%9A%D0%BE%D0%BC%D0%B1%D0%B0%D0%B9%D0%BD%20v90%20%28%D0%A4%D0%B8%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Spotify Комбайн v9.0] Финальный скрипт запущен.");

    // ===================================================================
    // ЧАСТЬ 0: ПАНЕЛЬ УПРАВЛЕНИЯ И СОСТОЯНИЕ (Из v4.0)
    // ===================================================================

    let isScriptPaused = false;
    let isAutoSkipEnabled = true;
    let lastCheckedSongId = null;

    function createControlsPanel() {
        if (document.getElementById('userscript-controls-spotify')) return;
        const controlsHtml = `
            <div id="userscript-controls-spotify">
                <div class="control-row">
                    <span id="script-status-spotify">Статус: Активен</span>
                    <button id="toggle-script-btn-spotify">Пауза</button>
                </div>
                <div class="control-row" style="margin-top: 8px;">
                     <label for="autoskip-toggle" class="autoskip-label">Автопропуск лайков:</label>
                     <label class="switch">
                       <input type="checkbox" id="autoskip-toggle" checked>
                       <span class="slider round"></span>
                     </label>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', controlsHtml);

        document.getElementById('toggle-script-btn-spotify').addEventListener('click', function() {
            isScriptPaused = !isScriptPaused;
            this.textContent = isScriptPaused ? 'Возобновить' : 'Пауза';
            document.getElementById('script-status-spotify').textContent = `Статус: ${isScriptPaused ? 'Пауза' : 'Активен'}`;
            console.log(`[Spotify Комбайн] Скрипт ${isScriptPaused ? 'приостановлен' : 'возобновлен'}.`);
        });

        document.getElementById('autoskip-toggle').addEventListener('change', function() {
            isAutoSkipEnabled = this.checked;
            console.log(`[Spotify Комбайн] Автопропуск лайков ${isAutoSkipEnabled ? 'ВКЛЮЧЕН' : 'ОТКЛЮЧЕН'}.`);
        });
    }

    GM_addStyle(`
        #userscript-controls-spotify{position:fixed;bottom:15px;right:15px;z-index:9999;background-color:rgba(28,28,28,0.9);border:1px solid #444;border-radius:8px;padding:12px;font-family:'Helvetica','Arial',sans-serif;color:white;box-shadow:0 2px 10px rgba(0,0,0,0.5);}
        .control-row{display:flex;align-items:center;justify-content:space-between;}
        #script-status-spotify{margin-right:12px;font-size:14px;}
        #toggle-script-btn-spotify{background-color:#777;color:white;font-weight:bold;border:none;padding:8px 12px;text-align:center;font-size:14px;border-radius:5px;cursor:pointer;transition:background-color 0.3s;}
        #toggle-script-btn-spotify:hover{background-color:#999;}
        .autoskip-label{font-size:14px; margin-right:10px;}
        .switch{position:relative;display:inline-block;width:44px;height:24px;}.switch input{opacity:0;width:0;height:0;}
        .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:24px;}
        .slider:before{position:absolute;content:"";height:16px;width:16px;left:4px;bottom:4px;background-color:white;transition:.4s;border-radius:50%;}
        input:checked+.slider{background-color:#1DB954;}
        input:checked+.slider:before{transform:translateX(20px);}
    `);

    // ===================================================================
    // ЧАСТЬ 1: АВТОПРОПУСК ЛАЙКОВ (Из v4.0)
    // ===================================================================

    const LIKED_SONG_BUTTON_SELECTOR = 'button[aria-checked="true"]';
    const CURRENT_SONG_LINK_SELECTOR = 'a[data-testid="context-item-link"]';
    const NOW_PLAYING_WIDGET_SELECTOR = 'div[data-testid="now-playing-widget"]';

    function checkAndSkipLikedSong() {
        if (isScriptPaused || !isAutoSkipEnabled) return;

        const nowPlayingWidget = document.querySelector(NOW_PLAYING_WIDGET_SELECTOR);
        if (!nowPlayingWidget) return;

        const currentSongLink = nowPlayingWidget.querySelector(CURRENT_SONG_LINK_SELECTOR);
        const songId = currentSongLink ? currentSongLink.href : null;

        if (!songId || songId === lastCheckedSongId) return;

        lastCheckedSongId = songId;

        setTimeout(() => {
            const likedButton = nowPlayingWidget.querySelector(LIKED_SONG_BUTTON_SELECTOR);
            if (likedButton) {
                const songTitle = currentSongLink.textContent;
                console.log(`[Spotify Комбайн] Лайкнутый трек "${songTitle}" обнаружен. Пропускаем.`);
                const nextButton = document.querySelector('button[data-testid="control-button-skip-forward"]');
                if (nextButton) nextButton.click();
            }
        }, 500);
    }

    // ===================================================================
    // ЧАСТЬ 2: РУЧНОЕ ИСКЛЮЧЕНИЕ - КНОПКА И ЛОГИКА (Из v8.1)
    // ===================================================================

    const SCRIPT_BUTTON_ID = 'gemini-dislike-button-v8-1-combined'; // Уникальный ID

    // Селекторы, подтвержденные вашей версией v8.1
    const LIKE_BUTTON_SELECTOR = 'button[aria-label="Добавить в любимые треки"]';
    const MORE_OPTIONS_BUTTON_SELECTOR = 'button[data-testid="more-button"]';
    const NEXT_BUTTON_SELECTOR = 'button[data-testid="control-button-skip-forward"]';

    const DISLIKE_ICON_SVG = `<svg data-encore-id="icon" role="img" aria-hidden="true" class="e-91000-icon e-91000-baseline" style="--encore-icon-height: var(--encore-graphic-size-decorative-smaller); --encore-icon-width: var(--encore-graphic-size-decorative-smaller);" viewBox="0 0 16 16"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0 -13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path><path d="M11.005 4.995a.75.75 0 0 1 0 1.06L9.061 8l1.944 1.945a.75.75 0 1 1-1.06 1.06L8 9.061l-1.945 1.944a.75.75 0 1 1-1.06-1.06L6.939 8 4.995 6.055a.75.75 0 1 1 1.06-1.06L8 6.939l1.945-1.944a.75.75 0 0 1 1.06 0"></path></svg>`;

    function performDislikeAndSkipAction() {
        if (isScriptPaused) return;
        console.log('[Spotify Комбайн, логика v8.1] Активирована функция "Исключить и Далее".');
        const moreOptionsButton = document.querySelector(MORE_OPTIONS_BUTTON_SELECTOR);
        if (!moreOptionsButton) {
            console.error('[Spotify Комбайн, логика v8.1] КРИТИЧЕСКАЯ ОШИБКА: Не удалось найти кнопку "Больше опций" (...).');
            return;
        }

        moreOptionsButton.click();

        setTimeout(() => {
            const allMenuItems = document.querySelectorAll('div[id="context-menu"] button[role="menuitem"]');
            let foundButton = null;

            for (const button of allMenuItems) {
                const span = button.querySelector('span');
                if (span && span.textContent.trim() === 'Исключить из музыкальных предпочтений') {
                    foundButton = button;
                    break;
                }
            }

            if (foundButton) {
                foundButton.click();
                setTimeout(() => {
                    const nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
                    if (nextButton) {
                        nextButton.click();
                    }
                }, 150);
            } else {
                console.error('[Spotify Комбайн, логика v8.1] Ошибка: Меню открылось, но пункт "Исключить..." НЕ найден.');
                document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            }
        }, 300);
    }

    function addDislikeButton() {
        if (document.getElementById(SCRIPT_BUTTON_ID)) return;

        const likeButton = document.querySelector(LIKE_BUTTON_SELECTOR);
        if (likeButton) {
            const dislikeButton = document.createElement('button');
            dislikeButton.id = SCRIPT_BUTTON_ID;
            dislikeButton.className = likeButton.className;
            dislikeButton.setAttribute('aria-label', 'Исключить и переключить (D/В)');
            dislikeButton.style.marginLeft = '4px';
            dislikeButton.innerHTML = DISLIKE_ICON_SVG; // Упрощено, т.к. классы для иконки могут меняться
            dislikeButton.onclick = performDislikeAndSkipAction;
            likeButton.insertAdjacentElement('afterend', dislikeButton);
        }
    }


    // ===================================================================
    // ЧАСТЬ 3: ЗАПУСК И ОБРАБОТЧИКИ
    // ===================================================================

    document.addEventListener('keydown', function(event) {
        if (isScriptPaused) return;
        const target = event.target;
        const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        if (event.code === 'KeyD' && !isTyping) {
            console.log('[Spotify Комбайн] Нажата горячая клавиша D/В.');
            event.preventDefault();
            performDislikeAndSkipAction();
        }
    });

    // Главный цикл для всех периодических задач
    function mainLoop() {
        if (isScriptPaused) return;
        addDislikeButton(); // Функция из v8.1 для добавления кнопки
        checkAndSkipLikedSong(); // Функция из v4.0 для автопропуска
    }

    // Инициализация
    createControlsPanel();
    setInterval(mainLoop, 1000);

})();