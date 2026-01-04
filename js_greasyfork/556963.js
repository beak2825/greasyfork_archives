// ==UserScript==
// @name         Yandex Tracker – кастомные цвета статусов
// @namespace    https://tampermonkey.net/
// @version      3.5
// @description  Кастомные цвета статусов по классам status-label_key_*
// @match        *://tracker.yandex.ru/*
// @match        *://*.tracker.yandex.ru/*
// @icon         https://tracker.yandex.ru/favicon.ico
// @run-at       document-end
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/556963/Yandex%20Tracker%20%E2%80%93%20%D0%BA%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D1%8B%D0%B5%20%D1%86%D0%B2%D0%B5%D1%82%D0%B0%20%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/556963/Yandex%20Tracker%20%E2%80%93%20%D0%BA%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D1%8B%D0%B5%20%D1%86%D0%B2%D0%B5%D1%82%D0%B0%20%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---- Определяем тему только один раз ----
    function detectThemeOnce() {
        // 1. Пробуем прочитать класс с #preload-body (как в их скрипте)
        try {
            var preloadBody = document.getElementById('preload-body');
            if (preloadBody && preloadBody.className) {
                var cls = preloadBody.className;
                if (cls.indexOf('yc-preload-body_theme_dark') !== -1) {
                    return 'dark';
                }
                if (cls.indexOf('yc-preload-body_theme_light') !== -1) {
                    return 'light';
                }
            }
        } catch (e) { /* ignore */ }

        // 2. Фоллбек — системная тема
        try {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                return 'light';
            }
        } catch (e2) { /* ignore */ }

        // 3. По умолчанию считаем светлую
        return 'light';
    }

    var currentTheme = detectThemeOnce();

    // ---- Палитры для статусов ----
    var STATUS_STYLES = {
        // Новый
        "status-label_key_new": {
            light: { bg: '#F9FBE7', color: '#827717', border: '#DCE775' },
            dark:  { bg: '#33691E', color: '#F1F8E9', border: '#8BC34A' }
        },

        // Беклог
        "status-label_key_backlog": {
            light: { bg: '#ECEFF1', color: '#37474F', border: '#B0BEC5' },
            dark:  { bg: '#263238', color: '#CFD8DC', border: '#607D8B' }
        },

        // В работе
        "status-label_key_inProgress": {
            light: { bg: '#FFF8E1', color: '#EF6C00', border: '#FFE082' },
            dark:  { bg: '#E65100', color: '#FFF3E0', border: '#FFB74D' }
        },

        // Разработка
        "status-label_key_development": {
            light: { bg: '#E8EAF6', color: '#283593', border: '#9FA8DA' },
            dark:  { bg: '#1A237E', color: '#E8EAF6', border: '#5C6BC0' }
        },

        // Завершено
        "status-label_key_done": {
            light: { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
            dark:  { bg: '#1B5E20', color: '#E8F5E9', border: '#66BB6A' }
        },

        // Удалено
        "status-label_key_deleted": {
            light: { bg: '#FCE4EC', color: '#C2185B', border: '#F48FB1' },
            dark:  { bg: '#880E4F', color: '#FCE4EC', border: '#F06292' }
        },

        // Отменено
        "status-label_key_cancelled": {
            light: { bg: '#FFEBEE', color: '#B71C1C', border: '#EF9A9A' },
            dark:  { bg: '#B71C1C', color: '#FFEBEE', border: '#EF5350' }
        },

        // Будем делать
        "status-label_key_selectedForDev": {
            light: { bg: '#E0F2F1', color: '#00695C', border: '#80CBC4' },
            dark:  { bg: '#004D40', color: '#E0F2F1', border: '#26A69A' }
        },

        // Selected for Development
        "status-label_key_selectedfordevelopment": {
            light: { bg: '#E0F2F1', color: '#00695C', border: '#80CBC4' },
            dark:  { bg: '#004D40', color: '#E0F2F1', border: '#26A69A' }
        },

        // Можно тестировать
        "status-label_key_readyForTest": {
            light: { bg: '#EDE7F6', color: '#5E35B1', border: '#B39DDB' },
            dark:  { bg: '#4527A0', color: '#EDE7F6', border: '#9575CD' }
        },

        // Готово к релизу
        "status-label_key_rc": {
            light: { bg: '#FFF3E0', color: '#BF360C', border: '#FFB74D' },
            dark:  { bg: '#BF360C', color: '#FFF3E0', border: '#FF9800' }
        },

        // Ревью кода
        "status-label_key_codereview": {
            light: { bg: '#F3E5F5', color: '#6A1B9A', border: '#CE93D8' },
            dark:  { bg: '#4A148C', color: '#F3E5F5', border: '#AB47BC' }
        },

        // Оценка задачи
        "status-label_key_needEstimate": {
            light: { bg: '#E1F5FE', color: '#0277BD', border: '#81D4FA' },
            dark:  { bg: '#01579B', color: '#E1F5FE', border: '#29B6F6' }
        },

        // Нужно сделать
        "status-label_key_todo": {
            light: { bg: '#E0F7FA', color: '#006064', border: '#80DEEA' },
            dark:  { bg: '#004D40', color: '#E0F7FA', border: '#26C6DA' }
        },

        // Приостановлено
        "status-label_key_onHold": {
            light: { bg: '#F5F5F5', color: '#424242', border: '#BDBDBD' },
            dark:  { bg: '#424242', color: '#F5F5F5', border: '#9E9E9E' }
        }
    };

    function getStyleForLabel(labelEl) {
        var classes = labelEl.classList;
        for (var i = 0; i < classes.length; i++) {
            var cls = classes[i];
            if (STATUS_STYLES[cls]) {
                var cfg = STATUS_STYLES[cls];
                return cfg[currentTheme] || cfg.light;
            }
        }
        return null;
    }

    function styleLabel(labelEl) {
        try {
            // Чтобы не красить по 100 раз одно и то же
            if (labelEl.getAttribute('data-yt-custom-status') === 'applied') return;

            var style = getStyleForLabel(labelEl);
            if (!style) return;

            labelEl.setAttribute('data-yt-custom-status', 'applied');

            labelEl.style.backgroundColor = style.bg;
            labelEl.style.color = style.color;
            labelEl.style.borderRadius = '12px';
            labelEl.style.padding = '0px 0px';
            labelEl.style.fontWeight = '300';
            labelEl.style.border = '1px solid ' + (style.border || style.bg);
            labelEl.style.display = 'inline-flex';
            labelEl.style.alignItems = 'center';
            labelEl.style.gap = '4px';

            var textNode = labelEl.querySelector('.g-label__content');
            if (textNode) {
                textNode.style.color = style.color;
            }
        } catch (e) {
            // не ломаем страницу, если что-то пошло не так
        }
    }

    function applyToContainer(root) {
        if (!root || !root.querySelectorAll) return;
        var labels = root.querySelectorAll('.status-label');
        labels.forEach(styleLabel);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            applyToContainer(document);
        });
    } else {
        applyToContainer(document);
    }

    // Следим за динамически появляющимися элементами (таблицы, сайдбар, панелька слева и т.д.)
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
            if (!m.addedNodes || m.addedNodes.length === 0) return;
            m.addedNodes.forEach(function (node) {
                if (node.nodeType !== 1) return;
                applyToContainer(node);
            });
        });
    });

    function startObserver() {
        if (!document.body) return;
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.body) {
        startObserver();
    } else {
        var intervalId = setInterval(function () {
            if (document.body) {
                clearInterval(intervalId);
                startObserver();
                applyToContainer(document);
            }
        }, 200);
    }
})();