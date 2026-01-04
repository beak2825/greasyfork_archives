// ==UserScript==
// @name         Кастомный форум Mihail_Galandets
// @namespace    https://forum.blackrussia.online
// @version      0.1.2.7
// @description  Красивый форум
// @author       Netplix
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://icons.iconarchive.com/icons/arturo-wibawa/akar/256/bluetooth-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556516/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20Mihail_Galandets.user.js
// @updateURL https://update.greasyfork.org/scripts/556516/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20Mihail_Galandets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    scriptInit();

    function applyBodyStyle() {
        const bodyStyle = document.createElement('style');
        bodyStyle.id = 'main-body-theme';
        bodyStyle.textContent = `
        /* ФОН С КАРТИНОЙ ПЕЩЕРЫ */
        html, body {
            background: url('https://images.wallpaperscraft.ru/image/single/peshchera_siluet_temnota_137696_3840x2400.jpg') !important;
            background-repeat: no-repeat !important;
            background-position: center center !important;
            background-attachment: fixed !important;
            background-size: cover !important;
        }

        /* ВСЕ СЕРЫЕ ЭЛЕМЕНТЫ - ПРОЗРАЧНЫ */
        * {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            border: none !important;
            box-shadow: none !important;
        }

        /* ИСКЛЮЧЕНИЯ ДЛЯ ТЕКСТА И АВАТАРОК */
        .username,
        .message-text,
        .bbWrapper,
        .block-minorHeader,
        .node-title,
        .structItem-title,
        .block-row--header,
        .p-description,
        .p-navEl-link,
        body,
        div,
        span,
        p,
        a,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            background: transparent !important;
            color: #ffffff !important;
        }

        /* АВАТАРКИ */
        .avatar img,
        .avatar.avatar--default.avatar--default--image,
        .memberHeader-avatar .avatar,
        .message-avatar .avatar,
        .contentRow-figure .avatar {
            border-radius: 12px !important;
            background: transparent !important;
        }

        /* КРАСНЫЙ ОТТЕНОК ПРИ НАВЕДЕНИИ СКРУГЛЕННЫЙ */
        .button:hover,
        button:hover,
        .button--primary:hover,
        .button--cta:hover,
        .button--link:hover,
        .p-navEl-link:hover,
        .menu-tabHeader .tabs-tab:hover,
        .block-tabHeader .tabs-tab:hover,
        .fauxBlockLink:hover,
        .menu-row:hover,
        .contentRow:hover,
        .structItem:hover,
        .structItem-container:hover,
        .block-row:hover,
        .alert:hover,
        .menu-row--alt:hover,
        .menu-footer:hover,
        .menu-footer--split:hover,
        .menu.menu--structural:hover,
        .menu-content:hover,
        a:hover,
        .p-navEl:hover,
        .tabs-tab:hover,
        .block-link:hover,
        .node:hover,
        .node-body:hover {
            background: rgba(255, 0, 0, 0.2) !important;
            border-radius: 12px !important;
            transition: all 0.3s ease !important;
        }

        /* КРАСНЫЙ ОТТЕНОК ДЛЯ АКТИВНЫХ КНОПОК */
        .button.is-active,
        .p-navEl.is-selected,
        .tabs-tab.is-active,
        .menu-row.is-active,
        .structItem.is-selected {
            background: rgba(255, 0, 0, 0.3) !important;
            border-radius: 8px !important;
        }

        /* СВЕТЯЩИЕСЯ НИКИ */
        .username {
            text-shadow: 0px 0px 10px #ffffff, 0px 0px 20px #ffffff !important;
            color: #ffffff !important;
            font-weight: bold;
        }

        .username--style3, .username--style6 {
            text-shadow: 0px 0px 10px #ffca00, 0px 0px 20px #ffca00 !important;
            color: #ffca00 !important;
        }

        .username--style8, .username--style29 {
            text-shadow: 0px 0px 10px #FF0000, 0px 0px 20px #FF0000 !important;
            color: #FF0000 !important;
        }

        .username--style11, .username--style12 {
            text-shadow: 0px 0px 10px #4169e2, 0px 0px 20px #4169e2 !important;
            color: #4169e2 !important;
        }

        .username--style13, .username--style17, .username--style24 {
            text-shadow: 0px 0px 10px #00FF00, 0px 0px 20px #00FF00 !important;
            color: #00FF00 !important;
        }

        .username--style15 {
            text-shadow: 0px 0px 10px #00FFFF, 0px 0px 20px #00FFFF !important;
            color: #00FFFF !important;
        }

        .username--style16, .username--style51 {
            text-shadow: 0px 0px 10px #FF0000, 0px 0px 20px #FF0000 !important;
            color: #FF0000 !important;
        }

        .username--style18 {
            text-shadow: 0px 0px 10px #FF4500, 0px 0px 20px #FF4500 !important;
            color: #FF4500 !important;
        }

        .username--style38 {
            text-shadow: 0px 0px 10px #FF00FF, 0px 0px 20px #FF00FF !important;
            color: #FF00FF !important;
        }

        .username--style39, .username--style40, .username--style41, .username--style42, .username--style43, .username--style44 {
            text-shadow: 0px 0px 10px #00FFFF, 0px 0px 20px #00FFFF !important;
            color: #00FFFF !important;
        }

        .username--style52, .username--style53 {
            text-shadow: 0px 0px 10px #0087ff, 0px 0px 20px #0087ff !important;
            color: #0087ff !important;
        }

        .username--style96 {
            text-shadow: 0px 0px 10px #FD4806, 0px 0px 20px #FD4806 !important;
            color: #FD4806 !important;
        }

        /* УВЕЛИЧЕННЫЕ И СКРУГЛЕННЫЕ БЕЙДЖИ БЕЗ РАМКИ */
        .label, .badge,
        span[class*="label"], span[class*="badge"],
        div[class*="label"], div[class*="badge"],
        a[class*="label"], a[class*="badge"] {
            padding: 6px 12px !important;
            border-radius: 12px !important;
            font-size: 0.9em !important;
            font-weight: bold !important;
            margin-right: 8px !important;
            min-height: 24px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            border: none !important;
        }

        /* Ожидание - белый */
        .label-silver, .badge-silver,
        [class*="label-silver"], [class*="badge-silver"],
        .label--waiting, .badge--waiting {
            background-color: white !important;
            color: #333 !important;
        }

        /* На рассмотрении - оранжевый */
        .label-orange, .badge-orange,
        [class*="label-orange"], [class*="badge-orange"],
        .label--review, .badge--review {
            background-color: #f39c12 !important;
            color: white !important;
        }

        /* Важно - красный */
        .label-red, .badge-red,
        [class*="label-red"], [class*="badge-red"],
        .label--important, .badge--important {
            background-color: #e74c3c !important;
            color: white !important;
        }

        /* Главному администратору - красный */
        .label-darkRed, .badge-darkRed,
        [class*="label-darkRed"], [class*="badge-darkRed"],
        .label--main-admin, .badge--main-admin {
            background-color: #e74c3c !important;
            color: white !important;
        }

        /* Специальному администратору - красный */
        .label-maroon, .badge-maroon,
        [class*="label-maroon"], [class*="badge-maroon"],
        .label--special-admin, .badge--special-admin {
            background-color: #e74c3c !important;
            color: white !important;
        }

        /* Отказано - красный */
        .label-crimson, .badge-crimson,
        [class*="label-crimson"], [class*="badge-crimson"],
        .label--denied, .badge--denied {
            background-color: #e74c3c !important;
            color: white !important;
        }

        /* Одобрено - зеленый */
        .label-green, .badge-green,
        [class*="label-green"], [class*="badge-green"],
        .label--approved, .badge--approved {
            background-color: #2ecc71 !important;
            color: white !important;
        }

        /* Рассмотрено - зеленый */
        .label-darkGreen, .badge-darkGreen,
        [class*="label-darkGreen"], [class*="badge-darkGreen"],
        .label--reviewed, .badge--reviewed {
            background-color: #2ecc71 !important;
            color: white !important;
        }

        /* Команда проекта - желтый */
        .label-yellow, .badge-yellow,
        [class*="label-yellow"], [class*="badge-yellow"],
        .label--team, .badge--team {
            background-color: #f1c40f !important;
            color: #333 !important;
        }

        /* ИСПРАВЛЕННЫЕ СТИЛИ ДЛЯ РЕАКЦИЙ И ЛАЙКОВ */
        /* Возвращаем оригинальное отображение реакций */
        .reactionsBar,
        .reaction,
        .reaction--image,
        .reactionSummary,
        .reaction--small,
        .reactionCount,
        .reaction--famous,
        .reaction--total,
        .reaction-text {
            /* Убираем наши вмешательства и возвращаем оригинальные стили */
            opacity: 1 !important;
            visibility: visible !important;
            background: initial !important;
            display: initial !important;
        }

        /* Стили для иконок реакций */
        .reaction img,
        .reaction--image img,
        .reaction--small img {
            opacity: 1 !important;
            visibility: visible !important;
            /* Возвращаем оригинальные стили */
            border-radius: initial !important;
            background: initial !important;
            padding: initial !important;
        }

        /* Панель реакций */
        .reactionTray,
        .reaction-list,
        .js-reactionContainer {
            opacity: 1 !important;
            visibility: visible !important;
            background: rgba(0, 0, 0, 0.8) !important;
            border-radius: 8px !important;
            border: 1px solid #444 !important;
        }

        /* ВОССТАНАВЛИВАЕМ БАННЕРЫ В ПРОФИЛЯХ */
        .userBanner,
        .memberHeader-banner,
        .profileHeader-banner,
        .p-banner,
        .profileBanner {
            opacity: 1 !important;
            visibility: visible !important;
            background: initial !important;
            display: initial !important;
            border-radius: initial !important;
        }

        /* Баннеры-изображения в профилях */
        .memberHeader-banner img,
        .profileHeader-banner img,
        .p-banner img,
        .profileBanner img {
            opacity: 1 !important;
            visibility: visible !important;
            border-radius: initial !important;
            max-height: initial !important;
            object-fit: initial !important;
        }

        /* РЕКЛАМНЫЕ БАННЕРЫ */
        .banner,
        [class*="banner"]:not(.userBanner):not(.memberHeader-banner):not(.profileHeader-banner):not(.p-banner):not(.profileBanner),
        .ad,
        [class*="ad-"] {
            background: transparent !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
        }

        /* УБИРАЕМ ДВОЙНИКИ КНОПОК */
        .button--link[data-xf-click*="moderator"],
        .button[data-xf-click*="moderator"],
        [class*="moderator"]:not(:first-child) {
            display: none !important;
        }

        /* Специфично для кнопки "Выделить для модерации" */
        .menu-link[data-xf-click*="moderator"]:nth-child(n+2) {
            display: none !important;
        }

        /* ИКОНОЧНЫЕ ЛЕЙБЛЫ БЕЗ РАМКИ */
        .iconic-label,
        [class*="iconic"] {
            border: none !important;
            background: transparent !important;
        }

        /* СКРЫТЬ ЛИШНИЕ ЭЛЕМЕНТЫ */
        .p-sectionLinks {
            display: none !important;
        }
        `;
        document.head.appendChild(bodyStyle);
    }

    // Функция для принудительного применения стилей к существующим элементам
    function forceApplyBadgeStyles() {
        // Найдем все элементы с классами label и badge
        const labels = document.querySelectorAll('[class*="label"], [class*="badge"], .iconic-label');

        labels.forEach(element => {
            // Принудительно применяем стили через inline стили (без рамки)
            element.style.cssText += `
                padding: 6px 12px !important;
                border-radius: 12px !important;
                font-size: 0.9em !important;
                font-weight: bold !important;
                margin-right: 8px !important;
                min-height: 24px !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                border: none !important;
            `;

            // Применяем цвета в зависимости от класса
            if (element.className.includes('silver')) {
                element.style.cssText += 'background-color: white !important; color: #333 !important;';
            }
            if (element.className.includes('orange')) {
                element.style.cssText += 'background-color: #f39c12 !important; color: white !important;';
            }
            if (element.className.includes('red') || element.className.includes('darkRed') || element.className.includes('maroon') || element.className.includes('crimson')) {
                element.style.cssText += 'background-color: #e74c3c !important; color: white !important;';
            }
            if (element.className.includes('green') || element.className.includes('darkGreen')) {
                element.style.cssText += 'background-color: #2ecc71 !important; color: white !important;';
            }
            if (element.className.includes('yellow')) {
                element.style.cssText += 'background-color: #f1c40f !important; color: #333 !important;';
            }
        });

        // Убираем двойные кнопки модерации
        const modButtons = document.querySelectorAll('[data-xf-click*="moderator"], [class*="moderator"]');
        if (modButtons.length > 1) {
            for (let i = 1; i < modButtons.length; i++) {
                modButtons[i].style.display = 'none !important';
            }
        }

        // ВОССТАНАВЛИВАЕМ РЕАКЦИИ И ЛАЙКИ - убираем наши стили
        const reactions = document.querySelectorAll('.reaction, .reaction--image, .reaction--small, .reaction-text, .reactionsBar, .reactionSummary, .reactionCount');
        reactions.forEach(element => {
            // Убираем наши inline стили, которые сломали отображение
            element.style.opacity = '';
            element.style.visibility = '';
            element.style.display = '';
            element.style.background = '';

            // Для изображений внутри реакций
            const reactionImages = element.querySelectorAll('img');
            reactionImages.forEach(img => {
                img.style.opacity = '';
                img.style.visibility = '';
                img.style.borderRadius = '';
                img.style.background = '';
                img.style.padding = '';
            });
        });

        // Восстанавливаем панель реакций
        const reactionPanels = document.querySelectorAll('.reactionTray, .reaction-list, .js-reactionContainer');
        reactionPanels.forEach(panel => {
            panel.style.opacity = '1 !important';
            panel.style.visibility = 'visible !important';
            panel.style.background = 'rgba(0, 0, 0, 0.8) !important';
            panel.style.borderRadius = '8px !important';
            panel.style.border = '1px solid #444 !important';
        });

        // ВОССТАНАВЛИВАЕМ БАННЕРЫ ПРОФИЛЕЙ
        const profileBanners = document.querySelectorAll('.userBanner, .memberHeader-banner, .profileHeader-banner, .p-banner, .profileBanner');
        profileBanners.forEach(element => {
            element.style.opacity = '';
            element.style.visibility = '';
            element.style.display = '';
            element.style.background = '';
            element.style.borderRadius = '';

            const bannerImages = element.querySelectorAll('img');
            bannerImages.forEach(img => {
                img.style.opacity = '';
                img.style.visibility = '';
                img.style.borderRadius = '';
                img.style.maxHeight = '';
                img.style.objectFit = '';
            });
        });

        // Оставляем стили только для рекламных баннеров
        const adBanners = document.querySelectorAll('.banner, [class*="ad-"]');
        adBanners.forEach(element => {
            if (!element.classList.contains('userBanner') &&
                !element.classList.contains('memberHeader-banner') &&
                !element.classList.contains('profileHeader-banner') &&
                !element.classList.contains('p-banner') &&
                !element.classList.contains('profileBanner')) {
                element.style.cssText += `
                    opacity: 1 !important;
                    visibility: visible !important;
                    display: block !important;
                    background: transparent !important;
                `;
            }
        });

        // Добавляем скругление для элементов при наведении
        const hoverElements = document.querySelectorAll('.structItem, .structItem-container, .block-row, .node, .node-body');
        hoverElements.forEach(element => {
            element.style.borderRadius = '12px !important';
        });
    }

    function scriptInit() {
        applyBodyStyle();

        // Применяем стили сразу после загрузки
        setTimeout(forceApplyBadgeStyles, 100);

        // Применяем стили при изменении DOM (для динамического контента)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    setTimeout(forceApplyBadgeStyles, 100);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();