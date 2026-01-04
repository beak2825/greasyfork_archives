// ==UserScript==
// @name         Logs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Темная зимняя тема.
// @author       Dont_Sorry
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557136/Logs.user.js
// @updateURL https://update.greasyfork.org/scripts/557136/Logs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        storageKey: 'blacklog_winter_v4',
        snowCount: 70,
    };

    const winterStyles = `
        /* ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ */
        :root {
            --bs-body-bg: #0f172a !important;
            --bs-body-color: #cbd5e1 !important;
            --bs-card-bg: #1e293b !important;
            --bs-border-color: #334155 !important;
        }

        /* ОСНОВНОЙ ФОН */
        body, html, .main-content {
            background-color: var(--bs-body-bg) !important;
            color: var(--bs-body-color) !important;
        }

        /* НАВИГАЦИЯ */
        #site-navbar {
            background-color: #020617 !important;
            border-bottom: 1px solid #1e293b;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .navbar-brand { color: #38bdf8 !important; text-shadow: 0 0 10px rgba(56, 189, 248, 0.5); }

        /* ЗАГРУЗОЧНЫЙ ЭКРАН */
        #loading-overlay, #loading-overlay[data-v-173ec149] {
            background-color: #0f172a !important;
            opacity: 1 !important;
        }
        #loading-overlay-heading, .loading-text {
            color: #38bdf8 !important;
            text-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
        }
        #loading-overlay .spinner, .spinner-border {
            border-color: #38bdf8 !important;
            border-right-color: transparent !important;
        }

        /* ТАБЛИЦА ЛОГОВ */
        #log-table { color: #e2e8f0 !important; }
        #log-table thead { background: #1e293b !important; color: #fff !important; }
        #log-table th { border-bottom: 2px solid #38bdf8 !important; }
        #log-table .first-row { background-color: #0f172a !important; border-color: #334155 !important; }
        #log-table .second-row { background-color: #162032 !important; border-color: #334155 !important; }
        #log-table td { border-color: #334155 !important; }

        /* Описание транзакции и ссылки */
        .td-transaction-desc { color: #94a3b8 !important; font-style: italic; }
        a, .td-player-name a, .td-category a {
            color: #38bdf8 !important;
            text-decoration: none !important;
            transition: text-shadow 0.3s;
        }
        a:hover { text-shadow: 0 0 8px #38bdf8; color: #fff !important; }
        .td-index { background-color: #334155 !important; color: #fff !important; }

        /* САЙДБАР (Фильтры) */
        #log-filter-section {
            background: #1e293b !important;
            border-left: 1px solid #334155 !important;
        }
        #log-filter-heading { color: #fff !important; }
        .form-label { color: #94a3b8 !important; }

        /* ОБЫЧНЫЕ ИНПУТЫ */
        input, select, textarea, .form-control, .form-select, .dp__input {
            background-color: #020617 !important;
            border: 1px solid #475569 !important;
            color: #fff !important;
        }
        input::placeholder { color: #64748b !important; }

        /* ФИКС ДЛЯ MULTISELECT */
        .multiselect {
            background: #020617 !important;
            border: 1px solid #475569 !important;
            color: #fff !important;
        }
        .multiselect-dropdown {
            background: #1e293b !important;
            border: 1px solid #334155 !important;
            color: #fff !important;
        }
        .multiselect-option {
            background: transparent !important;
            color: #cbd5e1 !important;
        }
        .multiselect-option.is-pointed {
            background: #334155 !important;
            color: #fff !important;
        }
        .multiselect-option.is-selected {
            background: #38bdf8 !important;
            color: #000 !important;
        }
        .multiselect-single-label {
            color: #fff !important;
            background: transparent !important;
        }
        .multiselect-tag {
            background: #334155 !important;
            color: #fff !important;
        }

        /* АВТОКОМПЛИТ */
        .autoComplete_wrapper > ul {
            background-color: #1e293b !important;
            border: 1px solid #334155 !important;
            color: #fff !important;
        }
        .autoComplete_wrapper > ul > li {
            background-color: #1e293b !important;
            color: #cbd5e1 !important;
        }
        .autoComplete_wrapper > ul > li:hover {
            background-color: #334155 !important;
            color: #fff !important;
        }
        .autoComplete_wrapper > ul > li mark {
            color: #38bdf8 !important;
        }

        /* МОДАЛЬНЫЕ ОКНА */
        .modal-content {
            background-color: #1e293b !important;
            border: 1px solid #475569 !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.7) !important;
        }
        .modal-header, .modal-footer { border-color: #334155 !important; }
        .btn-close { filter: invert(1) grayscale(100%) brightness(200%); }
        
        .btn-primary, .submit-btn {
            background-color: #38bdf8 !important;
            border-color: #38bdf8 !important;
            color: #000 !important;
            font-weight: bold;
        }
        .btn-primary:hover, .submit-btn:hover {
            background-color: #0ea5e9 !important;
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
        }

        /* СНЕГ */
        #winter-snow-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999999;
        }

        /* КНОПКА В МЕНЮ (АДАПТИРОВАННАЯ) */
        #winter-toggle-btn {
            cursor: pointer;
            display: flex;
            align-items: center;
            font-weight: bold;
            color: #94a3b8;
            text-decoration: none;
            margin-left: auto; 
            margin-right: 15px;
            padding: 5px 10px;
            border: 1px solid transparent;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        #winter-toggle-btn:hover {
            background: rgba(255,255,255,0.1);
            color: #fff;
        }
        #winter-toggle-btn.winter-mode-active {
            color: #38bdf8 !important;
            text-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
            border-color: rgba(56, 189, 248, 0.3);
        }
        @media (min-width: 992px) {
            #winter-toggle-btn {
                margin-left: 20px;
                margin-right: 0;
                order: 5;
            }
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.id = 'winter-theme-styles';
    styleElement.innerText = winterStyles;

    let snowCanvas, ctx, animationFrame;
    let snowflakes = [];

    function initSnow() {
        snowCanvas = document.createElement('canvas');
        snowCanvas.id = 'winter-snow-canvas';
        document.body.appendChild(snowCanvas);
        ctx = snowCanvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        snowflakes = [];
        for (let i = 0; i < CONFIG.snowCount; i++) snowflakes.push(createFlake());
        animateSnow();
    }

    function resizeCanvas() {
        snowCanvas.width = window.innerWidth;
        snowCanvas.height = window.innerHeight;
    }

    function createFlake() {
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            wind: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.3
        };
    }

    function animateSnow() {
        ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
        snowflakes.forEach(flake => {
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            ctx.shadowBlur = 5;
            ctx.shadowColor = "white";
            ctx.fill();
            flake.y += flake.speed;
            flake.x += flake.wind;
            if (flake.y > window.innerHeight) {
                flake.y = -5;
                flake.x = Math.random() * window.innerWidth;
            }
            if (flake.x > window.innerWidth) flake.x = 0;
            if (flake.x < 0) flake.x = window.innerWidth;
        });
        animationFrame = requestAnimationFrame(animateSnow);
    }

    function destroySnow() {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        if (snowCanvas) snowCanvas.remove();
        window.removeEventListener('resize', resizeCanvas);
    }

    function enableWinter() {
        if (!document.getElementById('winter-theme-styles')) {
            document.head.appendChild(styleElement);
        }
        initSnow();
        updateBtnState(true);
        localStorage.setItem(CONFIG.storageKey, 'true');
    }

    function disableWinter() {
        if (document.getElementById('winter-theme-styles')) {
            styleElement.remove();
        }
        destroySnow();
        updateBtnState(false);
        localStorage.setItem(CONFIG.storageKey, 'false');
    }

    function toggleWinter() {
        const isEnabled = localStorage.getItem(CONFIG.storageKey) === 'true';
        if (isEnabled) disableWinter();
        else enableWinter();
    }

    function updateBtnState(isActive) {
        const btn = document.getElementById('winter-toggle-btn');
        if (btn) {
            if (isActive) {
                btn.classList.add('winter-mode-active');
                btn.innerHTML = '<i class="bi bi-snow2"></i>';
            } else {
                btn.classList.remove('winter-mode-active');
                btn.innerHTML = '<i class="bi bi-snow2"></i>';
            }
        }
    }

    function injectUI() {
        const navContainer = document.querySelector('#site-navbar .container-fluid');
        if (!navContainer) { setTimeout(injectUI, 500); return; }
        if (document.getElementById('winter-toggle-btn')) return;

        const btn = document.createElement('a');
        btn.id = 'winter-toggle-btn';
        btn.href = '#';
        btn.innerHTML = '<i class="bi bi-snow2"></i>';
        btn.addEventListener('click', (e) => { e.preventDefault(); toggleWinter(); });

        const toggler = navContainer.querySelector('.navbar-toggler');
        const collapse = navContainer.querySelector('.navbar-collapse');

        if (toggler && getComputedStyle(toggler).display !== 'none') {
            navContainer.insertBefore(btn, toggler);
        } else if (collapse) {
            navContainer.insertBefore(btn, collapse);
        } else {
            navContainer.appendChild(btn);
        }

        if (localStorage.getItem(CONFIG.storageKey) === 'true') enableWinter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectUI);
    } else {
        injectUI();
    }
})();