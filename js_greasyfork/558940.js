// ==UserScript==
// @name         VK Video Filter (Text-Based Scanner)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Скрывает видео в VK по количеству просмотров, используя поиск текста. Самый надежный метод.
// @author       torch
// @match        https://vk.com/*
// @match        https://vkvideo.ru/*
// @match        https://vksport.vkvideo.ru/*
// @icon         https://vk.com/images/icons/favicons/fav_logo_2x.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558940/VK%20Video%20Filter%20%28Text-Based%20Scanner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558940/VK%20Video%20Filter%20%28Text-Based%20Scanner%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG_KEY = 'vk_vf_4_settings';

    // --- State ---
    let config = {
        minViews: 10000,
        isEnabled: true,
        debugMode: false
    };

    // Load settings
    try {
        const saved = localStorage.getItem(CONFIG_KEY);
        if (saved) config = { ...config, ...JSON.parse(saved) };
    } catch (e) {}

    // --- Helpers ---
    const log = (msg, color = '#0f0') => {
        console.log(`%c[VK Filter] ${msg}`, `color: ${color}; background: #222; padding: 2px;`);
    };

    // Парсер: ищет число перед словом "просмотров"
    // Поддерживает: "100", "1.5 тыс", "1,5 тыс", "1 млн"
    function extractViewsFromText(fullText) {
        if (!fullText) return -1;
        
        // Нормализация: убираем переносы и лишние пробелы
        const text = fullText.toLowerCase().replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ');
        
        // Регулярка: ищем число + (опционально) множитель + слово "просмотр"
        // Группы: 1=число, 3=множитель
        const regex = /([\d,.]+)\s*(&nbsp;|\s)?(тыс|млн|k|m|b|млрд)?\.?\s*просмотр/i;
        const match = text.match(regex);

        if (!match) return -1;

        let numStr = match[1].replace(',', '.'); // 1,5 -> 1.5
        let num = parseFloat(numStr);
        const multiplier = match[3];

        if (multiplier) {
            if (multiplier.startsWith('тыс') || multiplier === 'k') num *= 1000;
            else if (multiplier.startsWith('млн') || multiplier === 'm') num *= 1000000;
            else if (multiplier.startsWith('млрд') || multiplier === 'b') num *= 1000000000;
        }

        return Math.round(num);
    }

    // --- Core Logic ---
    function scanAndHide() {
        if (!config.isEnabled && !config.debugMode) return;

        // Стратегия поиска карточек: ищем всё, что похоже на контейнер видео
        const selector = [
            '[data-testid="video_card_layout"]', // Новый дизайн VK Video
            '.VideoCard',                        // Старый дизайн
            '.video_item',                       // Классический ВК
            '.vkitVideoCardLayout__card--xI1tS', // Обфусцированные классы (из ваших логов)
            '.VideoCardList__videoItem--VPDyl'   // Контейнер списка
        ].join(',');

        const cards = document.querySelectorAll(selector);
        
        if (config.debugMode && cards.length === 0) {
            // log('Карточки видео не найдены. Жду загрузки...', '#fa0');
        }

        cards.forEach(card => {
            // Пропускаем уже обработанные (если не в режиме отладки и настройки не менялись)
            if (card.dataset.vvfProcessed === String(config.minViews) && !config.debugMode) return;

            // Ищем текстовый контент всей карточки
            const cardText = card.innerText || card.textContent;
            
            // Пытаемся найти просмотры в тексте карточки
            const views = extractViewsFromText(cardText);

            if (views === -1) {
                if (config.debugMode) {
                    card.style.border = '2px dashed orange';
                    card.title = `[VK Filter] Не нашел слово "просмотров" в тексте:\n${cardText.substring(0, 50)}...`;
                }
                return; 
            }

            // Логика скрытия
            const shouldHide = views < config.minViews;

            if (shouldHide) {
                if (config.debugMode) {
                    card.style.border = '4px solid red';
                    card.style.opacity = '0.5';
                    card.style.display = ''; 
                    card.title = `[VK Filter] ПРОСМОТРОВ: ${views} (Меньше ${config.minViews})`;
                    // log(`Нашел мало просмотров: ${views}`, '#f55');
                } else {
                    card.style.display = 'none';
                    card.style.border = '';
                }
            } else {
                // Видео проходит фильтр
                card.style.display = '';
                if (config.debugMode) {
                    card.style.border = '4px solid green';
                    card.style.opacity = '1';
                    card.title = `[VK Filter] ПРОСМОТРОВ: ${views} (Проходит)`;
                } else {
                    card.style.border = '';
                }
            }
            
            card.dataset.vvfProcessed = config.minViews;
        });
    }

    function resetAll() {
        const cards = document.querySelectorAll('[data-testid="video_card_layout"], .VideoCard, .video_item, [class*="VideoCard"]');
        cards.forEach(c => {
            c.style.display = '';
            c.style.border = '';
            c.style.opacity = '';
            delete c.dataset.vvfProcessed;
        });
    }

    // --- UI Construction ---
    function buildUI() {
        if (document.getElementById('vvf-root')) return;
        
        const root = document.createElement('div');
        root.id = 'vvf-root';
        root.innerHTML = `
            <style>
                #vvf-btn {
                    position: fixed; bottom: 20px; left: 20px; width: 50px; height: 50px;
                    background: #2D2D2D; border: 2px solid #555; border-radius: 50%;
                    color: white; display: flex; align-items: center; justify-content: center;
                    cursor: pointer; z-index: 9999999; font-size: 24px; user-select: none;
                    transition: 0.2s;
                }
                #vvf-btn:hover { background: #444; transform: scale(1.05); }
                #vvf-menu {
                    position: fixed; bottom: 80px; left: 20px; width: 280px;
                    background: #191919; color: #eee; padding: 20px; border-radius: 16px;
                    z-index: 9999999; display: none; border: 1px solid #444;
                    font-family: -apple-system, system-ui, sans-serif;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                }
                .vvf-row { margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; }
                .vvf-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; display: block; color: #fff; }
                .vvf-input {
                    background: #333; border: 1px solid #555; color: white;
                    padding: 6px 10px; border-radius: 8px; width: 100px; font-size: 14px;
                }
                .vvf-btn-action {
                    width: 100%; padding: 10px; background: #0077FF; color: white;
                    border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
                    font-size: 14px;
                }
                .vvf-btn-action:hover { background: #0066dd; }
                .vvf-chk { transform: scale(1.3); }
            </style>
            <div id="vvf-btn">👁️</div>
            <div id="vvf-menu">
                <span class="vvf-title">Фильтр Просмотров v4</span>
                
                <div class="vvf-row">
                    <label>Включено</label>
                    <input type="checkbox" id="vvf-enabled" class="vvf-chk" ${config.isEnabled ? 'checked' : ''}>
                </div>
                
                <div class="vvf-row">
                    <label style="color:#fa0">Режим отладки<br><span style="font-size:10px; color:#888">(рамки вместо скрытия)</span></label>
                    <input type="checkbox" id="vvf-debug" class="vvf-chk" ${config.debugMode ? 'checked' : ''}>
                </div>

                <div class="vvf-row">
                    <label>Мин. просмотров</label>
                    <input type="number" id="vvf-input" class="vvf-input" value="${config.minViews}">
                </div>

                <button id="vvf-save" class="vvf-btn-action">Применить</button>
            </div>
        `;
        document.body.appendChild(root);

        const btn = document.getElementById('vvf-btn');
        const menu = document.getElementById('vvf-menu');
        const save = document.getElementById('vvf-save');

        btn.onclick = () => { menu.style.display = menu.style.display === 'none' ? 'block' : 'none'; };
        
        save.onclick = () => {
            config.isEnabled = document.getElementById('vvf-enabled').checked;
            config.debugMode = document.getElementById('vvf-debug').checked;
            config.minViews = parseInt(document.getElementById('vvf-input').value) || 0;
            
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
            
            resetAll(); // Сбрасываем старое состояние
            scanAndHide(); // Применяем новое
            // menu.style.display = 'none'; // Можно закрыть меню
        };
    }

    // --- Init ---
    log('Скрипт v4 загружен');
    buildUI();
    
    // Запускаем цикл проверки (1 раз в секунду - оптимально для VK)
    setInterval(scanAndHide, 1000);

})();