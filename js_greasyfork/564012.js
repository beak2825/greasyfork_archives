// ==UserScript==
// @name         Ozon Scraper
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Агрессивный скрапер для Ozon
// @author       torch
// @match        https://www.ozon.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon.ru
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564012/Ozon%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/564012/Ozon%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    const SCROLL_STEP = 400;       // Меньше шаг = надежнее триггер загрузки
    const SCROLL_INTERVAL = 100;   // Частота скролла (быстро)
    const WAIT_FOR_LOAD = 4000;    // Сколько ждать, если страница перестала расти (4 сек)
    const MAX_RETRIES = 3;         // Сколько раз пробовать "дернуть" скролл перед остановкой
    const BUTTON_ID = 'ozon-hardcore-scraper';
    // -----------------

    let isActive = false;
    let productsMap = new Map();
    let mainInterval;
    let parserInterval;

    // Состояние скролла
    let lastScrollHeight = 0;
    let stagnateCounter = 0;
    let retryAttempt = 0;

    // --- ЛОГИРОВАНИЕ ---
    function status(msg, color = 'white') {
        const el = document.getElementById(BUTTON_ID + '_status');
        if (el) {
            el.innerText = msg;
            el.style.color = color;
        }
        console.log(`[OzonScraper] ${msg}`);
    }

    // --- ИНТЕРФЕЙС ---
    setInterval(() => {
        const targetPage = /ozon\.ru\/(category|search|brand|seller|highlight)/.test(location.href);
        if (targetPage && !document.getElementById(BUTTON_ID)) {
            renderUI();
        }
    }, 1500);

    function renderUI() {
        const container = document.createElement('div');
        container.id = BUTTON_ID;
        Object.assign(container.style, {
            position: 'fixed', bottom: '80px', right: '20px', zIndex: '9999999',
            background: 'rgba(0, 0, 0, 0.85)', padding: '15px', borderRadius: '12px',
            color: 'white', fontFamily: 'Arial', boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px'
        });

        const btn = document.createElement('button');
        btn.innerText = '⬇️ СТАРТ (Hardcore)';
        Object.assign(btn.style, {
            background: '#005bff', border: 'none', padding: '10px', color: 'white',
            borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
        });
        btn.onclick = toggleScraper;

        const info = document.createElement('div');
        info.id = BUTTON_ID + '_status';
        info.innerText = 'Готов к работе';
        info.style.fontSize = '12px';

        const count = document.createElement('div');
        count.id = BUTTON_ID + '_count';
        count.innerText = 'Товаров: 0';
        count.style.fontWeight = 'bold';
        count.style.color = '#00ff00';

        container.appendChild(count);
        container.appendChild(info);
        container.appendChild(btn);
        document.body.appendChild(container);
    }

    // --- ЛОГИКА ---
    function toggleScraper() {
        if (isActive) {
            finishScraping();
        } else {
            isActive = true;
            productsMap.clear();
            document.querySelector(`#${BUTTON_ID} button`).innerText = '⏹ СТОП';
            document.querySelector(`#${BUTTON_ID} button`).style.background = '#ff0040';

            lastScrollHeight = document.body.scrollHeight;
            stagnateCounter = 0;
            retryAttempt = 0;

            // Запускаем парсер (он работает независимо от скролла)
            parserInterval = setInterval(parseVisibleCards, 800);

            // Запускаем скроллер
            mainInterval = setInterval(scrollingLoop, SCROLL_INTERVAL);
        }
    }

    function scrollingLoop() {
        if (!isActive) return;

        const currentScroll = window.scrollY + window.innerHeight;
        const totalHeight = document.body.scrollHeight;

        // 1. Попытка нажать кнопки "Показать еще" (Ozon иногда меняет Infinite Scroll на кнопку)
        const moreButtons = Array.from(document.querySelectorAll('button, div[role="button"]'));
        const loadMoreBtn = moreButtons.find(b => b.innerText.includes('Показать еще') || b.innerText.includes('Загрузить'));
        if (loadMoreBtn) {
            status('Нажимаю кнопку подгрузки...', 'yellow');
            loadMoreBtn.click();
            stagnateCounter = 0; // Сброс таймера застоя
            return;
        }

        // 2. Если мы еще не внизу - просто крутим
        if (currentScroll < totalHeight - 300) {
            window.scrollBy(0, SCROLL_STEP);
            status('Скроллим вниз...');
            stagnateCounter = 0;
        } else {
            // 3. Мы уперлись в дно. Ждем подгрузки.
            stagnateCounter += SCROLL_INTERVAL;
            status(`Ждем подгрузку: ${(stagnateCounter/1000).toFixed(1)} сек...`, 'orange');

            // 4. Если долго нет изменений
            if (stagnateCounter > WAIT_FOR_LOAD) {
                if (totalHeight > lastScrollHeight) {
                    // Ура, страница выросла!
                    lastScrollHeight = totalHeight;
                    stagnateCounter = 0;
                    retryAttempt = 0;
                    status('Страница выросла! Продолжаем.', 'green');
                } else {
                    // Страница не выросла. Пробуем "ПИНАТЬ" скролл
                    if (retryAttempt < MAX_RETRIES) {
                        retryAttempt++;
                        stagnateCounter = 0; // Сбрасываем ожидание, даем шанс после пинка
                        kickScroll();
                    } else {
                        // Все попытки исчерпаны
                        status('Похоже, это конец.', 'red');
                        finishScraping();
                    }
                }
            }
        }
    }

    // Эмуляция поведения "человек дергает скролл вверх-вниз", чтобы разбудить Lazy Load
    function kickScroll() {
        status(`ПИНАЕМ СКРОЛЛ (Попытка ${retryAttempt}/${MAX_RETRIES})`, 'magenta');

        // Резко вверх на 700px
        window.scrollBy(0, -700);

        setTimeout(() => {
            // И сразу вниз
            window.scrollTo(0, document.body.scrollHeight);
        }, 300);
    }

    function parseVisibleCards() {
        if (!isActive) return;

        // Самый надежный селектор для карточек на Ozon
        const cards = document.querySelectorAll('div[data-index]');

        cards.forEach(card => {
            try {
                // Ищем ссылку на товар
                const linkEl = card.querySelector('a[href^="/product/"]');
                if (!linkEl) return;

                // Чистый ID товара из ссылки
                const cleanUrl = 'https://www.ozon.ru' + linkEl.getAttribute('href').split('?')[0];

                // Если уже есть - не тратим время
                if (productsMap.has(cleanUrl)) return;

                // --- ПАРСИНГ ---
                // 1. Цена (ищем класс c35_3... или просто tsHeadline)
                // Ozon часто меняет классы, ищем по символу рубля
                let price = 'Нет цены';
                // Специфичный селектор цены
                const priceNode = card.querySelector('div > span:first-child');
                if (priceNode && priceNode.innerText.includes('₽')) {
                    price = priceNode.innerText;
                } else {
                    // Фоллбек: перебор всех спанов
                    const spans = card.querySelectorAll('span');
                    for (let s of spans) {
                        if (s.innerText.includes('₽') && s.innerText.length < 15) {
                            price = s.innerText;
                            break;
                        }
                    }
                }

                // 2. Название
                let title = linkEl.innerText;
                const titleNode = card.querySelector('.tsBody500Medium');
                if (titleNode) title = titleNode.innerText;

                // Очистка
                price = price.replace(/[^\d]/g, '');
                if (!price) return; // Не берем товары без цены (например, "нет в наличии")

                productsMap.set(cleanUrl, {
                    title: title.trim(),
                    price: price,
                    link: cleanUrl
                });

                // Обновляем счетчик
                const counter = document.getElementById(BUTTON_ID + '_count');
                if (counter) counter.innerText = `Товаров: ${productsMap.size}`;

            } catch (e) {}
        });
    }

    function finishScraping() {
        isActive = false;
        clearInterval(mainInterval);
        clearInterval(parserInterval);

        const btn = document.querySelector(`#${BUTTON_ID} button`);
        if(btn) {
            btn.innerText = '⬇️ СТАРТ (Hardcore)';
            btn.style.background = '#005bff';
        }
        status('Сбор завершен');
        showTable();
    }

    // --- ВЫВОД РЕЗУЛЬТАТОВ ---
    function showTable() {
        const old = document.getElementById('ozon_table_overlay');
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.id = 'ozon_table_overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.7)', zIndex: '10000000', display: 'flex',
            justifyContent: 'center', alignItems: 'center'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            background: 'white', width: '90%', height: '90%', borderRadius: '8px',
            display: 'flex', flexDirection: 'column', padding: '20px', fontFamily: 'Arial'
        });

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <h2>Собрано уникальных товаров: ${productsMap.size}</h2>
                <div>
                    <button id="dl_csv" style="padding:10px 20px; background:#28a745; color:white; border:none; cursor:pointer; margin-right:10px;">Скачать CSV</button>
                    <button id="cl_btn" style="padding:10px 20px; background:#ccc; border:none; cursor:pointer;">Закрыть</button>
                </div>
            </div>
            <div style="flex:1; overflow:auto; border:1px solid #ddd;">
                <table style="width:100%; border-collapse:collapse;">
                    <thead style="background:#f0f0f0; position:sticky; top:0;">
                        <tr>
                            <th style="padding:10px; border:1px solid #ddd; text-align:left;">Название</th>
                            <th style="padding:10px; border:1px solid #ddd; text-align:left;">Цена (₽)</th>
                            <th style="padding:10px; border:1px solid #ddd; text-align:left;">Ссылка</th>
                        </tr>
                    </thead>
                    <tbody id="res_tbody"></tbody>
                </table>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const tbody = document.getElementById('res_tbody');
        productsMap.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding:5px; border:1px solid #ddd;">${p.title}</td>
                <td style="padding:5px; border:1px solid #ddd;">${p.price}</td>
                <td style="padding:5px; border:1px solid #ddd;"><a href="${p.link}" target="_blank">Ссылка</a></td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('cl_btn').onclick = () => overlay.remove();
        document.getElementById('dl_csv').onclick = () => {
            let csv = '\uFEFFНазвание;Цена;Ссылка\n';
            productsMap.forEach(p => {
                csv += `"${p.title.replace(/"/g, '""')}";${p.price};${p.link}\n`;
            });
            const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'ozon_full_scan.csv';
            link.click();
        };
    }

})();