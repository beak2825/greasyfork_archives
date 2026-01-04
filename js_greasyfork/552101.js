// ==UserScript==
// @name         NEBULA | Modern Glass Design Black Russia Forum
// @namespace    https://forum.blackrussia.online
// @version      2.1.0
// @description  Современный дизайн с glassmorphism эффектом и синей цветовой схемой
// @author       Dany_Forbs
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552101/NEBULA%20%7C%20Modern%20Glass%20Design%20Black%20Russia%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/552101/NEBULA%20%7C%20Modern%20Glass%20Design%20Black%20Russia%20Forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавляем основные стили
    const css = `
        /* Основная цветовая схема */
        :root {
            --primary-blue: #2563eb;
            --dark-blue: #1d4ed8;
            --light-blue: #3b82f6;
            --accent-cyan: #06b6d4;
            --dark-bg: #0f172a;
            --darker-bg: #020617;
            --glass-bg: rgba(30, 41, 59, 0.8);
            --glass-border: rgba(255, 255, 255, 0.1);
            --text-primary: #f1f5f9;
            --text-secondary: #cbd5e1;
            --glow-effect: rgba(37, 99, 235, 0.4);
        }

        /* Глобальные стили */
        body {
            background: linear-gradient(135deg, var(--darker-bg) 0%, var(--dark-bg) 50%, #1e293b 100%) fixed !important;
            color: var(--text-primary) !important;
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif !important;
            line-height: 1.6 !important;
        }

        /* Glassmorphism эффекты */
        .p-header {
            background: rgba(15, 23, 42, 0.9) !important;
            backdrop-filter: blur(20px) !important;
            border-bottom: 1px solid var(--glass-border) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        }

        /* Навигация с glass эффектом */
        .p-nav {
            background: rgba(30, 41, 59, 0.9) !important;
            backdrop-filter: blur(15px) !important;
            border: 1px solid var(--glass-border) !important;
        }

        .p-navEl.is-selected {
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-cyan) 100%) !important;
            color: white !important;
            border-radius: 10px !important;
            box-shadow: 0 4px 15px var(--glow-effect) !important;
        }

        /* Карточки с glass эффектом */
        .block-container,
        .block--category,
        .structItem,
        .structItemContainer {
            background: var(--glass-bg) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid var(--glass-border) !important;
            border-radius: 16px !important;
            margin-bottom: 20px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative !important;
            overflow: hidden !important;
        }

        /* Эффект блика на карточках */
        .structItem::before,
        .block-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.6s ease;
        }

        .structItem:hover::before,
        .block-container:hover::before {
            left: 100%;
        }

        .structItem:hover,
        .block--category:hover {
            transform: translateY(-5px) scale(1.02) !important;
            box-shadow: 0 12px 40px var(--glow-effect) !important;
            border-color: var(--primary-blue) !important;
        }

        /* Заголовки блоков */
        .block-header {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%) !important;
            backdrop-filter: blur(10px) !important;
            border-bottom: 1px solid var(--glass-border) !important;
            padding: 20px !important;
            border-radius: 16px 16px 0 0 !important;
            font-weight: 700 !important;
            font-size: 1.1em !important;
        }

        /* Кнопки с неоморфным дизайном */
        .button,
        .button--cta,
        .button--primary {
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%) !important;
            border: none !important;
            border-radius: 12px !important;
            color: white !important;
            font-weight: 600 !important;
            padding: 12px 24px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4) !important;
            position: relative !important;
            overflow: hidden !important;
        }

        .button::before,
        .button--cta::before,
        .button--primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }

        .button:hover::before,
        .button--cta:hover::before,
        .button--primary:hover::before {
            left: 100%;
        }

        .button:hover,
        .button--cta:hover,
        .button--primary:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px var(--glow-effect) !important;
            background: linear-gradient(135deg, var(--light-blue) 0%, var(--primary-blue) 100%) !important;
        }

        /* Ссылки с градиентным текстом */
        a,
        .link {
            color: var(--light-blue) !important;
            transition: all 0.3s ease !important;
            text-decoration: none !important;
            background: linear-gradient(90deg, var(--light-blue), var(--accent-cyan)) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
        }

        a:hover,
        .link:hover {
            background: linear-gradient(90deg, var(--accent-cyan), var(--light-blue)) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
        }

        /* Формы и инпуты */
        input[type="text"],
        input[type="password"],
        input[type="email"],
        textarea,
        .input {
            background: rgba(15, 23, 42, 0.8) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid var(--glass-border) !important;
            border-radius: 12px !important;
            color: var(--text-primary) !important;
            padding: 12px 16px !important;
            transition: all 0.3s ease !important;
            font-size: 14px !important;
        }

        input:focus,
        textarea:focus,
        .input:focus {
            border-color: var(--primary-blue) !important;
            box-shadow: 0 0 0 3px var(--glow-effect) !important;
            outline: none !important;
            background: rgba(15, 23, 42, 0.9) !important;
        }

        /* Боковая панель */
        .p-body-sidebar .block {
            background: var(--glass-bg) !important;
            backdrop-filter: blur(15px) !important;
            border: 1px solid var(--glass-border) !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
        }

        /* Футер */
        .p-footer {
            background: rgba(15, 23, 42, 0.9) !important;
            backdrop-filter: blur(20px) !important;
            border-top: 1px solid var(--glass-border) !important;
            color: var(--text-secondary) !important;
            margin-top: 40px !important;
        }

        /* Аватарки */
        .avatar {
            border-radius: 12px !important;
            border: 2px solid var(--glass-border) !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
        }

        .avatar:hover {
            border-color: var(--primary-blue) !important;
            transform: scale(1.1) rotate(5deg) !important;
            box-shadow: 0 6px 20px var(--glow-effect) !important;
        }

        /* Посты и сообщения */
        .message,
        .message-cell {
            background: var(--glass-bg) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid var(--glass-border) !important;
            border-radius: 16px !important;
            margin-bottom: 20px !important;
            transition: all 0.3s ease !important;
        }

        .message:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
        }

        .message-user {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%) !important;
            border-radius: 16px 0 0 16px !important;
        }

        /* Анимации */
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .block-container,
        .structItem {
            animation: slideInUp 0.6s ease-out !important;
        }

        .button {
            animation: fadeInScale 0.4s ease-out !important;
        }

        /* Кастомный скроллбар */
        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: var(--dark-bg);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-cyan) 100%);
            border-radius: 5px;
            border: 2px solid var(--dark-bg);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, var(--light-blue) 0%, var(--primary-blue) 100%);
        }

        /* Уведомления */
        .alert,
        .notice {
            background: var(--glass-bg) !important;
            backdrop-filter: blur(15px) !important;
            border: 1px solid var(--glass-border) !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        }

        /* Таблицы */
        table {
            background: var(--glass-bg) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            border: 1px solid var(--glass-border) !important;
        }

        th {
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-cyan) 100%) !important;
            color: white !important;
            font-weight: 600 !important;
            padding: 15px !important;
        }

        td {
            border-color: var(--glass-border) !important;
            background: transparent !important;
            padding: 12px 15px !important;
        }

        /* Иконки */
        .fa,
        .fas,
        .far {
            color: var(--light-blue) !important;
            transition: color 0.3s ease !important;
        }

        .fa:hover,
        .fas:hover,
        .far:hover {
            color: var(--accent-cyan) !important;
        }

        /* Хлебные крошки */
        .p-breadcrumbs {
            background: var(--glass-bg) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 12px !important;
            padding: 12px 20px !important;
            margin-bottom: 25px !important;
            border: 1px solid var(--glass-border) !important;
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
            .structItem,
            .block-container {
                margin: 10px !important;
                border-radius: 12px !important;
            }

            .p-header {
                padding: 10px !important;
            }

            .button {
                padding: 10px 20px !important;
            }
        }

        /* Специальные эффекты */
        .premium-card {
            position: relative;
        }

        .premium-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, transparent 0%, var(--glow-effect) 100%);
            border-radius: 16px;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .premium-card:hover::after {
            opacity: 1;
        }
    `;

    // Добавляем стили на страницу
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Добавляем Google Fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Дополнительные улучшения после загрузки страницы
    function enhancePage() {
        // Добавляем премиум класс к основным элементам
        const mainBlocks = document.querySelectorAll('.block-container, .structItemContainer');
        mainBlocks.forEach(block => {
            block.classList.add('premium-card');
        });

        // Улучшаем заголовки
        const mainTitles = document.querySelectorAll('.block-header, .p-title-value');
        mainTitles.forEach(title => {
            title.style.background = 'linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-cyan) 100%)';
            title.style.webkitBackgroundClip = 'text';
            title.style.webkitTextFillColor = 'transparent';
            title.style.fontWeight = '700';
        });

        // Добавляем сложный градиентный фон
        document.body.style.backgroundImage = `
            radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(37, 99, 235, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(6, 182, 212, 0.05) 0%, transparent 50%),
            linear-gradient(135deg, var(--darker-bg) 0%, var(--dark-bg) 50%, #1e293b 100%)
        `;
    }

    // Запускаем улучшения после загрузки
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhancePage);
    } else {
        enhancePage();
    }

    // Обновляем стили при изменении контента
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                setTimeout(enhancePage, 100);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('🌌 NEBULA Glass Theme activated!');
})();