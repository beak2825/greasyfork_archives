// ==UserScript==
// @name         Steam Page Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Hides clutter, re-arranges media gallery, enhances image quality and buttons for a cleaner Steam store page experience.
// @author       Your Professional Developer
// @match        https://store.steampowered.com/app/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553787/Steam%20Page%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/553787/Steam%20Page%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const settings = {
        hideClutter: GM_getValue('hideClutter', true),
        fixDescriptionHeight: GM_getValue('fixDescriptionHeight', true),
        reworkIgnoreButtons: GM_getValue('reworkIgnoreButtons', true),
        redesignMediaGallery: GM_getValue('redesignMediaGallery', true),
        enhanceQuality: GM_getValue('enhanceQuality', true) // Новая настройка
    };

    function applyModifications() {
        console.log('Steam Page Enhancer: Applying modifications...');
        try {
            if (settings.hideClutter) hideUnwantedElements();
            if (settings.fixDescriptionHeight) adjustDescriptionHeight();
            if (settings.reworkIgnoreButtons) reworkIgnoreButtons();
            if (settings.redesignMediaGallery) redesignMediaGallery();
            if (settings.enhanceQuality) enhanceImageQuality(); // Новая функция
        } catch (error) {
            console.error('Steam Page Enhancer Error:', error);
        }
    }

    function hideUnwantedElements() {
        const selectorsToHide = [
            '[data-featuretarget="store-menu-v7"]', '.breadcrumbs',
            'a.saleEventBannerLink', '[data-featuretarget="broadcast-embed"]'
        ];
        selectorsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.style.display = 'none';
        });
        console.log('Clutter hidden.');
    }

    function adjustDescriptionHeight() {
        const descriptionBlock = document.querySelector('.rightcol');
        if (descriptionBlock) descriptionBlock.style.minHeight = '500px';
    }

    function reworkIgnoreButtons() {
        const ignoreBtnContainer = document.querySelector('#ignoreBtn .queue_control_button');
        const ignoreThisBtn = document.querySelector('#queue_ignore_menu_option_not_interested');
        const playedElsewhereBtn = document.querySelector('#queue_ignore_menu_option_owned_elsewhere');
        const arrowButton = document.querySelector('#queue_btn_ignore_menu');

        if (!ignoreBtnContainer || !ignoreThisBtn || !playedElsewhereBtn || !arrowButton) return;

        ignoreBtnContainer.innerHTML = '';
        arrowButton.style.display = 'none';

        const newIgnoreBtn = document.createElement('button');
        newIgnoreBtn.className = 'btnv6_blue_hoverfade btn_medium';
        newIgnoreBtn.innerHTML = '<span>Ignore This</span>';
        newIgnoreBtn.onclick = () => ignoreThisBtn.click();

        const newPlayedBtn = document.createElement('button');
        newPlayedBtn.className = 'btnv6_blue_hoverfade btn_medium';
        newPlayedBtn.innerHTML = '<span>Played Elsewhere</span>';
        newPlayedBtn.style.marginLeft = '4px';
        newPlayedBtn.onclick = () => playedElsewhereBtn.click();

        ignoreBtnContainer.append(newIgnoreBtn, newPlayedBtn);

        const updateButtonStates = () => {
            const isNotInterested = arrowButton.classList.contains('not_interested');
            const isOwnedElsewhere = arrowButton.classList.contains('owned_elsewhere');
            newIgnoreBtn.classList.toggle('enhancer-btn-active', isNotInterested);
            newPlayedBtn.classList.toggle('enhancer-btn-active', isOwnedElsewhere);
        };

        const observer = new MutationObserver(updateButtonStates);
        observer.observe(arrowButton, { attributes: true, attributeFilter: ['class'] });
        updateButtonStates();
    }

    // НОВАЯ ФУНКЦИЯ: Повышение качества изображений
    function enhanceImageQuality() {
        const playerArea = document.querySelector('#highlight_player_area');
        if (!playerArea) return;

        const upgradeSrc = (node) => {
            if (node.tagName === 'IMG' && node.src.includes('.600x338.jpg')) {
                node.src = node.src.replace('.600x338.jpg', '.1920x1080.jpg');
            }
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    upgradeSrc(mutation.target);
                }
            });
        });

        observer.observe(playerArea, {
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        // Применяем сразу при загрузке
        playerArea.querySelectorAll('img').forEach(upgradeSrc);
        console.log('Image quality enhancer is active.');
    }


    function redesignMediaGallery() {
        GM_addStyle(`
            /* 1. Убираем ограничение ширины и центрируем основной контент */
            .responsive_page_content { max-width: none !important; }

            #game_highlights.page_content {
                width: 90%;
                margin: 0; /* Центрирование блока */
                display: flex;
                flex-direction: row-reverse;
                gap: 16px;
            }

            /* 2. Задаем фиксированную ширину колонке с описанием */
            #game_highlights .rightcol { width: 324px; flex-shrink: 0; }

            /* 3. Медиа-колонка занимает все остальное место */
            #game_highlights .leftcol { flex-grow: 1; min-width: 0; }

            /* 4. Расположение ВНУТРИ медиа-колонки */
            #game_highlights .highlight_overflow { display: flex; flex-direction: row-reverse; gap: 10px; }

            /* 5. Главный плеер растягивается */
            #game_highlights #highlight_player_area { flex-grow: 1; min-width: 0; }

            /* 6. Лента с миниатюрами */
            #game_highlights #highlight_strip { width: 360px !important; height: 500px; overflow-y: auto; flex-shrink: 0; }
            #game_highlights #highlight_strip::-webkit-scrollbar { width: 8px; }
            #game_highlights #highlight_strip::-webkit-scrollbar-track { background: #1b2838; }
            #game_highlights #highlight_strip::-webkit-scrollbar-thumb { background: #4a5e73; border-radius: 4px; }
            #game_highlights #highlight_strip_scroll { display: flex; flex-wrap: wrap; justify-content: space-between; position: static !important; width: 100% !important; left: 0 !important; }
            #game_highlights .highlight_strip_item { margin: 0 0 5px 0 !important; width: 116px; height: 65px; }

            /* 7. Прячем ненужный слайдер */
            #game_highlights .slider_ctn { display: none !important; }
        `);
        console.log('Layout updated.');
    }

    function createSettingsPanel() {
        const panelHTML = `
            <div id="enhancer-settings-panel">
                <h4>Steam Page Enhancer</h4>
                <div class="enhancer-setting">
                    <input type="checkbox" id="enhancer-hideClutter" ${settings.hideClutter ? 'checked' : ''}>
                    <label for="enhancer-hideClutter">Hide Clutter (Menu, Banners)</label>
                </div>
                <div class="enhancer-setting">
                    <input type="checkbox" id="enhancer-fixDescriptionHeight" ${settings.fixDescriptionHeight ? 'checked' : ''}>
                    <label for="enhancer-fixDescriptionHeight">Fix Description Height</label>
                </div>
                <div class="enhancer-setting">
                    <input type="checkbox" id="enhancer-reworkIgnoreButtons" ${settings.reworkIgnoreButtons ? 'checked' : ''}>
                    <label for="enhancer-reworkIgnoreButtons">Rework 'Ignore' Buttons</label>
                </div>
                <div class="enhancer-setting">
                    <input type="checkbox" id="enhancer-redesignMediaGallery" ${settings.redesignMediaGallery ? 'checked' : ''}>
                    <label for="enhancer-redesignMediaGallery">Redesign Media Gallery</label>
                </div>
                <div class="enhancer-setting">
                    <input type="checkbox" id="enhancer-enhanceQuality" ${settings.enhanceQuality ? 'checked' : ''}>
                    <label for="enhancer-enhanceQuality">Enhance Image Quality</label>
                </div>
                <p>Changes will apply on page refresh.</p>
                <button id="enhancer-close-btn">Close</button>
            </div>
        `;
        const triggerHTML = `<div id="enhancer-settings-trigger">⚙️</div>`;
        GM_addStyle(`
            #enhancer-settings-trigger { position: fixed; bottom: 20px; right: 20px; width: 40px; height: 40px; background-color: #1b2838; border: 1px solid #c7d5e0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; z-index: 9999; color: #c7d5e0; }
            #enhancer-settings-panel { position: fixed; bottom: 70px; right: 20px; width: 300px; background-color: #1b2838; border: 1px solid #c7d5e0; border-radius: 5px; padding: 15px; z-index: 9998; color: #c7d5e0; display: none; flex-direction: column; gap: 10px; }
            #enhancer-settings-panel h4 { margin: 0 0 10px 0; color: #66c0f4; }
            #enhancer-settings-panel .enhancer-setting { display: flex; align-items: center; }
            #enhancer-settings-panel input[type="checkbox"] { margin-right: 10px; }
            #enhancer-settings-panel p { font-size: 12px; color: #acb2b8; margin-top: 10px; }
            #enhancer-settings-panel button { align-self: flex-end; background-color: #66c0f4; color: #1b2838; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
            .enhancer-btn-active span { background-image: url(https://store.fastly.steamstatic.com/public/images/v6/ico/ico_selected.png); background-repeat: no-repeat; background-position: 5px center; padding-left: 25px; }
        `);
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        document.body.insertAdjacentHTML('beforeend', triggerHTML);

        const panel = document.getElementById('enhancer-settings-panel');
        const trigger = document.getElementById('enhancer-settings-trigger');
        const closeBtn = document.getElementById('enhancer-close-btn');

        trigger.addEventListener('click', () => { panel.style.display = (panel.style.display === 'flex') ? 'none' : 'flex'; });
        closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });

        panel.addEventListener('change', (event) => {
            if (event.target.type === 'checkbox') {
                const settingKey = event.target.id.replace('enhancer-', '');
                GM_setValue(settingKey, event.target.checked);
            }
        });
    }

    window.addEventListener('load', () => {
        applyModifications();
        createSettingsPanel();
    });

})();