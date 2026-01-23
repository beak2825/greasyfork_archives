// ==UserScript==
// @name         Cyberpunk Neon Style for YouTube
// @namespace    https://greasyfork.org/en/scripts/your-script-id
// @version      1.0
// @description  Применяет киберпанковский неоновый стиль к YouTube
// @author       Ваше имя
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563615/Cyberpunk%20Neon%20Style%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/563615/Cyberpunk%20Neon%20Style%20for%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
    /* --- CYBERPUNK NEON STYLE 2026 --- */

    :root {
        --neon-pink: #ff00ff;
        --neon-blue: #00f2ff;
        --glass-dark: rgba(15, 2, 20, 0.85);
        --neon-glow: 0 0 10px rgba(255, 0, 255, 0.5);
    }

    /* 1. Стеклянный интерфейс с неоновой границей */
    #masthead-container, 
    #guide-content.ytd-app {
        background: var(--glass-dark) !important;
        backdrop-filter: blur(15px) !important;
        border-bottom: 1px solid var(--neon-pink) !important;
    }

    /* УЛУЧШЕННЫЙ КОД ДЛЯ ГОЛУБЫХ ЗАГОЛОВКОВ */
    a#video-title:hover,
    #video-title.ytd-video-primary-info-renderer:hover,
    ytd-rich-grid-media:hover #video-title,
    ytd-compact-video-renderer:hover #video-title {
        color: #00f2ff !important;
    }

    /* 2. Основной обработчик (для главной, поиска и боковой панели) */
    #video-title, 
    #video-title-link, 
    .yt-core-attributed-string, 
    #video-title > yt-formatted-string {
        transition: color 0.2s ease-in-out !important;
    }

    /* Эффект при наведении на саму карточку видео */
    ytd-rich-item-renderer:hover #video-title,
    ytd-rich-grid-media:hover #video-title,
    ytd-compact-video-renderer:hover #video-title,
    ytd-video-renderer:hover #video-title,
    ytd-grid-video-renderer:hover #video-title {
        color: #00f2ff !important; /* Тот самый ярко-голубой */
        text-shadow: 0 0 10px rgba(0, 242, 255, 0.7) !important;
    }

    /* 3. Фикс для новых "ссылок-заголовков" */
    #video-title-link:hover #video-title {
        color: #00f2ff !important;
    }

    /* 4. Принудительное изменение для текста внутри span (новый формат YT) */
    ytd-rich-item-renderer:hover span.yt-core-attributed-string {
        color: #00f2ff !important;
    }

    /* ... (все остальные стили) ... */

    /* 8. Ответы на комментарии (Thread lines) */
    #replies ytd-comment-replies-renderer {
        border-left: 1px solid var(--neon-blue) !important;
        margin-left: 20px !important;
    }
    `;

    // Добавляем стили на страницу
    GM_addStyle(css);
})();