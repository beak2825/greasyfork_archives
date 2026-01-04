// ==UserScript==
// @name         Новый фон форума | Black Russia
// @namespace    https://forum.blackrussia.online
// @version      2.4
// @description  Новый стиль и фон форума
// @author       Dany_Forbs
// @match        https://forum.blackrussia.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560490/%D0%9D%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%84%D0%BE%D0%BD%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Black%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/560490/%D0%9D%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%84%D0%BE%D0%BD%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Black%20Russia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ========== НАСТРОЙКИ ДЛЯ МОБИЛЬНЫХ ========== */
    const BACKGROUND_URL = "https://i.postimg.cc/jj4pRxbh/9dac9c2b94dbfb534c2a51a6c4e799ee.jpg";
    const BACKGROUND_BLUR = "1px";
    const BACKGROUND_DARKEN = "0.6";
    const BLOCK_RADIUS = "16px";
    const ACCENT_COLOR = "#ff4757";
    const SECONDARY_COLOR = "#3742fa";

    /* === ОПРЕДЕЛЯЕМ ТИП УСТРОЙСТВА === */
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window;

    /* === СОЗДАЁМ ФОНОВЫЙ СЛОЙ === */
    const bg = document.createElement("div");
    bg.id = "br-mobile-bg";
    document.body.prepend(bg);

    /* === ДОБАВЛЯЕМ МЕТАТЕГ ДЛЯ МОБИЛЬНОЙ ОПТИМИЗАЦИИ === */
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(viewportMeta);

    const css = `

    /* ------------------------------
             БАЗОВЫЕ СТИЛИ
    ------------------------------ */

    * {
        -webkit-tap-highlight-color: transparent;
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
    }

    body {
        margin: 0;
        padding: 10px;
        overflow-x: hidden;
        touch-action: manipulation;
        color: #f0f0f0 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        font-size: 16px !important;
        line-height: 1.5 !important;
    }

    /* ------------------------------
           ФОН ДЛЯ МОБИЛЬНЫХ
    ------------------------------ */

    #br-mobile-bg {
        position: fixed;
        inset: 0;
        z-index: -1;
        background: url(${BACKGROUND_URL}) center/cover no-repeat fixed;
        filter: blur(${BACKGROUND_BLUR}) brightness(0.8);
    }

    #br-mobile-bg::after {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,${BACKGROUND_DARKEN});
    }

    /* ------------------------------
        ОБЩИЕ БЛОКИ (ОПТИМИЗИРОВАНЫ)
    ------------------------------ */

    .block-container,
    .message,
    .overlay,
    .menu-content,
    .p-nav,
    .p-header,
    .p-footer,
    .fr-box.fr-basic,
    .structItem,
    .block,
    .node-body,
    .bbWrapper,
    .tabs,
    .formRow,
    .memberHeader-main,
    .message-cell.message-cell--main,
    .pageNav-page,
    .pageNav-jump {
        background: rgba(25,25,35,0.85) !important;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.1) !important;
        border-radius: ${BLOCK_RADIUS} !important;
        box-shadow: 
            0 4px 12px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.05);
        margin: 8px 0 !important;
        padding: 12px !important;
        transition: all 0.2s ease;
    }

    /* Убираем лишние эффекты на тач-устройствах */
    ${!isTouchDevice ? `
    .block-container:hover,
    .structItem:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.3);
    }
    ` : ''}

    /* ------------------------------
           ШАПКА (MOBILE OPTIMIZED)
    ------------------------------ */

    .p-header {
        background: rgba(15,15,25,0.95) !important;
        padding: 10px !important;
        margin: 0 0 10px 0 !important;
        border-bottom: 3px solid ${ACCENT_COLOR} !important;
        position: sticky !important;
        top: 0;
        z-index: 1000;
    }

    .p-header-inner {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-wrap: wrap !important;
    }

    .p-header-logo {
        max-height: 40px !important;
        width: auto !important;
    }

    .p-nav {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        margin-top: 10px !important;
    }

    .p-navEl {
        flex: 1 1 auto !important;
        min-width: 45% !important;
        text-align: center !important;
        padding: 8px 12px !important;
        font-size: 14px !important;
    }

    /* Мобильное меню */
    .menu-tabHeader {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        background: rgba(20,20,30,0.95) !important;
        backdrop-filter: blur(20px) !important;
        border-top: 2px solid ${ACCENT_COLOR} !important;
        z-index: 1000 !important;
        padding: 10px !important;
    }

    /* ------------------------------
           КОНТЕНТ И СООБЩЕНИЯ
    ------------------------------ */

    .message {
        margin: 10px 0 !important;
        padding: 15px 12px !important;
    }

    .message-userDetails {
        flex-direction: column !important;
        align-items: flex-start !important;
        margin-bottom: 12px !important;
    }

    .message-avatar {
        width: 60px !important;
        height: 60px !important;
        margin-right: 12px !important;
    }

    .message-avatar .avatar img {
        width: 100% !important;
        height: 100% !important;
        border-radius: 50% !important;
        border: 2px solid ${ACCENT_COLOR} !important;
        box-shadow: 0 0 15px rgba(255,71,87,0.3) !important;
    }

    .message-userDetails .username {
        font-size: 18px !important;
        color: ${ACCENT_COLOR} !important;
        font-weight: 700 !important;
        margin: 5px 0 !important;
    }

    .message-content {
        font-size: 16px !important;
        line-height: 1.6 !important;
        color: #e0e0e0 !important;
        padding: 0 !important;
    }

    .message-footer {
        margin-top: 15px !important;
        padding-top: 10px !important;
        border-top: 1px solid rgba(255,255,255,0.1) !important;
    }

    /* ------------------------------
           ПРОФИЛИ (MOBILE FRIENDLY)
    ------------------------------ */

    .memberHeader {
        flex-direction: column !important;
        text-align: center !important;
    }

    .memberHeader-avatar {
        margin: 0 auto 15px auto !important;
    }

    .memberHeader-avatar .avatar img {
        width: 100px !important;
        height: 100px !important;
        border-radius: 50% !important;
        border: 3px solid ${ACCENT_COLOR} !important;
        box-shadow: 0 0 25px rgba(255,71,87,0.4) !important;
    }

    .memberHeader-name span {
        font-size: 24px !important;
        color: #fff !important;
        font-weight: 800 !important;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        word-break: break-word !important;
    }

    .memberHeader-blurb {
        font-size: 14px !important;
        color: #bbb !important;
        margin: 10px 0 !important;
        line-height: 1.4 !important;
    }

    .memberStats {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px !important;
        margin: 15px 0 !important;
    }

    .memberStats .pairs {
        margin: 5px !important;
        padding: 8px !important;
        background: rgba(40,40,50,0.6) !important;
        border-radius: 10px !important;
    }

    /* ------------------------------
           КНОПКИ (TOUCH FRIENDLY)
    ------------------------------ */

    .button,
    .button--link,
    [type="button"],
    [type="submit"] {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 44px !important;
        min-width: 44px !important;
        padding: 12px 20px !important;
        margin: 5px !important;
        background: linear-gradient(135deg, ${ACCENT_COLOR}, ${SECONDARY_COLOR}) !important;
        border: none !important;
        border-radius: 12px !important;
        color: white !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        text-decoration: none !important;
        cursor: pointer !important;
        touch-action: manipulation !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 4px 12px rgba(255,71,87,0.3) !important;
    }

    .button:active,
    .button--link:active {
        transform: scale(0.97) !important;
        opacity: 0.9 !important;
    }

    /* Большие кнопки для пальцев */
    .button--primary {
        min-height: 50px !important;
        font-size: 18px !important;
        padding: 15px 25px !important;
    }

    /* Кнопки навигации */
    .pageNav-page {
        min-width: 44px !important;
        min-height: 44px !important;
        margin: 2px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    /* ------------------------------
           ФОРУМ И КАТЕГОРИИ
    ------------------------------ */

    .structItem {
        display: flex !important;
        flex-direction: column !important;
        margin: 8px 0 !important;
    }

    .structItem-title {
        font-size: 18px !important;
        color: #fff !important;
        margin-bottom: 5px !important;
        line-height: 1.3 !important;
        word-break: break-word !important;
    }

    .structItem-minor {
        font-size: 14px !important;
        color: #aaa !important;
    }

    .node-icon {
        font-size: 24px !important;
        color: ${ACCENT_COLOR} !important;
    }

    /* ------------------------------
           ФОРМЫ И ИНПУТЫ
    ------------------------------ */

    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="search"],
    textarea,
    select {
        width: 100% !important;
        min-height: 44px !important;
        padding: 12px 15px !important;
        margin: 8px 0 !important;
        background: rgba(40,40,50,0.8) !important;
        border: 1px solid rgba(255,255,255,0.15) !important;
        border-radius: 10px !important;
        color: #fff !important;
        font-size: 16px !important;
        line-height: 1.4 !important;
        box-sizing: border-box !important;
        -webkit-appearance: none !important;
        appearance: none !important;
    }

    textarea {
        min-height: 100px !important;
        resize: vertical !important;
    }

    /* ------------------------------
           ПАНЕЛЬ ИНСТРУМЕНТОВ
    ------------------------------ */

    .fr-toolbar {
        position: sticky !important;
        bottom: 60px !important;
        background: rgba(30,30,40,0.95) !important;
        backdrop-filter: blur(15px) !important;
        border-radius: ${BLOCK_RADIUS} !important;
        padding: 10px !important;
        margin: 10px !important;
        z-index: 500 !important;
        max-width: calc(100% - 20px) !important;
        overflow-x: auto !important;
    }

    .fr-command {
        min-width: 44px !important;
        min-height: 44px !important;
        margin: 2px !important;
    }

    /* ------------------------------
           SCROLLBAR (TOUCH FRIENDLY)
    ------------------------------ */

    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(20,20,30,0.3);
        border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb {
        background: ${ACCENT_COLOR};
        border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #ff6b81;
    }

    /* ------------------------------
           СПЕЦИАЛЬНЫЕ КЛАССЫ ДЛЯ МОБИЛЬНЫХ
    ------------------------------ */

    .mobile-only {
        display: block !important;
    }

    .desktop-only {
        display: none !important;
    }

    .touch-target {
        min-height: 44px !important;
        min-width: 44px !important;
        padding: 12px !important;
    }

    /* Скрываем ненужные элементы на мобильных */
    .uix_extendedFooter,
    .p-footer-custom,
    .sidebar,
    .block[data-widget-key="forum_overview_forum_statistics"] {
        display: none !important;
    }

    /* ------------------------------
           МЕДИА-ЗАПРОСЫ
    ------------------------------ */

    /* Маленькие телефоны */
    @media (max-width: 360px) {
        body {
            padding: 5px !important;
            font-size: 15px !important;
        }
        
        .p-navEl {
            min-width: 100% !important;
            font-size: 13px !important;
        }
        
        .memberHeader-avatar .avatar img {
            width: 80px !important;
            height: 80px !important;
        }
        
        .message-avatar {
            width: 50px !important;
            height: 50px !important;
        }
    }

    /* Планшеты и большие телефоны */
    @media (min-width: 768px) and (max-width: 1024px) {
        body {
            padding: 20px !important;
            max-width: 100% !important;
            margin: 0 auto !important;
        }
        
        .block-container,
        .message {
            margin: 15px auto !important;
            max-width: 95% !important;
        }
        
        .p-nav {
            justify-content: center !important;
        }
        
        .p-navEl {
            min-width: 30% !important;
        }
    }

    /* Горизонтальная ориентация */
    @media (orientation: landscape) and (max-height: 500px) {
        .p-header {
            position: relative !important;
            top: auto !important;
        }
        
        .menu-tabHeader {
            position: fixed !important;
            width: 100% !important;
        }
        
        .message-avatar {
            width: 40px !important;
            height: 40px !important;
        }
    }

    /* Высокие экраны */
    @media (min-height: 800px) {
        .block-container {
            margin: 12px 0 !important;
        }
    }

    /* Темная тема системная */
    @media (prefers-color-scheme: dark) {
        #br-mobile-bg::after {
            background: rgba(0,0,0,0.7) !important;
        }
        
        .block-container,
        .message {
            background: rgba(30,30,40,0.9) !important;
        }
    }

    /* Режим экономии энергии */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }

    /* ------------------------------
           УТИЛИТЫ
    ------------------------------ */

    .text-center {
        text-align: center !important;
    }

    .mb-10 {
        margin-bottom: 10px !important;
    }

    .mt-10 {
        margin-top: 10px !important;
    }

    .w-100 {
        width: 100% !important;
    }

    .d-flex {
        display: flex !important;
    }

    .flex-column {
        flex-direction: column !important;
    }

    .justify-center {
        justify-content: center !important;
    }

    .align-center {
        align-items: center !important;
    }

    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    /* === ОПТИМИЗАЦИЯ ДЛЯ МОБИЛЬНЫХ === */
    
    // Убираем параллакс на мобильных для производительности
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            bg.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }

    // Добавляем классы для мобильных элементов
    document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-desktop');
    document.documentElement.classList.add(isTouchDevice ? 'is-touch' : 'is-mouse');

    // Оптимизация для iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.style.webkitOverflowScrolling = 'touch';
    }

    // Предотвращаем масштабирование при двойном тапе
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    /* === УВЕДОМЛЕНИЕ О ЗАГРУЗКЕ === */
    console.log(`📱 Black Russia Mobile Premium v4.1 loaded! Device: ${isMobile ? 'Mobile' : 'Desktop'}`);

})();