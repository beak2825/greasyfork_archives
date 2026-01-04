// ==UserScript==
// @name         HeroesWM Quick Links Menu + Price Scanner
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Быстрые ссылки + автообновление цен и порогов с экспортом/импортом + звук при переходе
// @author       Dёma & ChatGpt
// @match        https://www.heroeswm.ru/home.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549289/HeroesWM%20Quick%20Links%20Menu%20%2B%20Price%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/549289/HeroesWM%20Quick%20Links%20Menu%20%2B%20Price%20Scanner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const quickLinks = [
        { name: "Абразив", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=abrasive" },
        { name: "Клык тигра", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=tiger_tusk" },
        { name: "Ледяной кристалл", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=ice_crystal" },
        { name: "лунный камень", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=moon_stone" },
        { name: "огненный кристалл", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=fire_crystal" },
        { name: "осколок метеорита", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=meteorit" },
        { name: "цветок ветров", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=wind_flower" },
        { name: "цветок папоротника", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=fern_flower" },
        { name: "цветок ведьм", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=witch_flower" },
        { name: "змеиный яд", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=snake_poison" },
        { name: "ядовитый гриб", url: "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=badgrib" },
        { name: "Древесина", url: "https://www.heroeswm.ru/auction.php?cat=res&sort=0&type=1" },
        { name: "Руда", url: "https://www.heroeswm.ru/auction.php?cat=res&sort=0&type=2" },
        { name: "Ртуть", url: "https://www.heroeswm.ru/auction.php?cat=res&sort=0&type=3" },
        { name: "Сера", url: "https://www.heroeswm.ru/auction.php?cat=res&sort=0&type=4" },
        { name: "Кристаллы", url: "https://www.heroeswm.ru/auction.php?cat=res&sort=0&type=5" },
        { name: "Самоцветы", url: "https://www.heroeswm.ru/auction.php?cat=res&sort=0&type=6" },
    ];

    const scanInterval = 16 * 1000;
    const autoOpen = true;
    const priceSettingsKey = 'hwm_price_thresholds';
    let savedThresholds = JSON.parse(localStorage.getItem(priceSettingsKey) || '{}');

    function getThreshold(name) {
        return savedThresholds[name] || 150;
    }

    function setThreshold(name, value) {
        savedThresholds[name] = value;
        localStorage.setItem(priceSettingsKey, JSON.stringify(savedThresholds));
    }

    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

    const button = document.createElement('button');
    button.textContent = "⚔️ Ресурсы скупка";
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '200px';
    button.style.zIndex = 1000;
    button.style.padding = '6px 12px';
    button.style.background = '#333';
    button.style.color = '#fff';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '40px';
    menu.style.right = '10px';
    menu.style.background = '#fff';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '5px';
    menu.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    menu.style.zIndex = 1000;
    menu.style.display = 'none';
    menu.style.minWidth = '200px';
    menu.style.maxHeight = '500px';
    menu.style.overflowY = 'auto';

    button.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    document.body.appendChild(button);
    document.body.appendChild(menu);

    const linkElements = [];

    quickLinks.forEach(link => {
        const wrapper = document.createElement('div');
        wrapper.style.borderBottom = '1px solid #eee';
        wrapper.style.padding = '6px 8px';

        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.name + ' — загрузка...';
        a.style.display = 'block';
        a.style.textDecoration = 'none';
        a.style.color = '#333';
        a.style.marginBottom = '4px';
        a.target = '_blank';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.value = getThreshold(link.name);
        input.style.width = '80px';
        input.style.marginRight = '4px';

        input.addEventListener('change', () => {
            const val = parseInt(input.value, 10);
            if (!isNaN(val)) {
                setThreshold(link.name, val);
            }
        });

        const label = document.createElement('label');
        label.textContent = 'Мин. цена: ';
        label.appendChild(input);

        wrapper.appendChild(a);
        wrapper.appendChild(label);
        menu.appendChild(wrapper);

        linkElements.push({ link, anchor: a });
    });

    // ... экспорт/импорт кода без изменений ...

    function scanPrices() {
        linkElements.forEach(({ link, anchor }) => {
            fetch(link.url)
                .then(res => res.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    const priceBlock = doc.querySelector('[id^="au"]');
                    let priceText = '';
                    let durabilityText = '';
                    let priceValue = 0;

                    if (priceBlock) {
                        const goldImg = priceBlock.querySelector('img[src*="gold.png"]');
                        const priceTd = goldImg?.closest('td')?.nextElementSibling;
                        if (priceTd && priceTd.textContent.trim().match(/\d/)) {
                            priceText = priceTd.textContent.trim().replace(/\s/g, '');
                            priceValue = parseInt(priceText.replace(/[^\d]/g, ''), 10);
                        }
                    }

                    const durabilityDiv = doc.querySelector('.art_durability_hidden');
                    if (durabilityDiv && durabilityDiv.textContent.trim()) {
                        durabilityText = durabilityDiv.textContent.trim();
                    }

                    const info = [];
                    if (priceValue) info.push(`${priceValue.toLocaleString('ru-RU')} золота`);
                    if (durabilityText) info.push(`Прочность ${durabilityText}`);

                    const infoText = info.length > 0 ? ` — ${info.join(', ')}` : ' — нет данных';
                    anchor.textContent = link.name + infoText;
                    anchor.style.color = priceValue > 0
                        ? (priceValue <= getThreshold(link.name) ? 'green' : 'red')
                        : '#333';

                    if (autoOpen && priceValue > 0 && priceValue <= getThreshold(link.name)) {
                        audio.play().catch(() => {});
                        window.open(link.url, '_blank');
                    }
                })
                .catch(err => {
                    anchor.textContent = link.name + ' — ошибка загрузки';
                    anchor.style.color = 'gray';
                    console.error(`Ошибка сканирования ${link.name}:`, err);
                });
        });
    }

    scanPrices();
    setInterval(scanPrices, scanInterval);
})();
