// ==UserScript==
// @name:en      HWM: Artifact Highlighter
// @name         HWM: Подсветка артефактов
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description:en  On any hero page, colors equipped artifacts as shop/non-shop; in inventory: red only for broken.
// @description  В инвентаре: красным только снятые (=0), на главной: магазинные + не магазинные, низкая прочность (<5).
// @author       Вождь Грозовых Гор
// @author:en    Vozhd Grozovyh Gor
// @match        https://www.heroeswm.ru/*
// @match        https://mirror.heroeswm.ru/*
// @match        https://my.lordswm.com/*
// @match        https://www.lordswm.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555391/HWM%3A%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B0%D1%80%D1%82%D0%B5%D1%84%D0%B0%D0%BA%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/555391/HWM%3A%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B0%D1%80%D1%82%D0%B5%D1%84%D0%B0%D0%BA%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Внешний справочник всех магазинных артов игры на данный момент (формат — массив объектов с id)
    const ARTIFACTS_JSON_URL =
        'https://gist.githubusercontent.com/MustaSaatana/e3e6a37e12b641bc0d5540e37a27b454/raw/314cd469468f1189c0c45e416e66ec0dcbbed007/json';
 
    /**
     * 1. Подсветка экипированных артефактов на странице любого персонажа (pl_info.php)
     *    Вся экипировка там рендерится внутри div.arts_info, где есть ссылка на art_info.php?id=
     *    — зелёная рамка: магазинный арт
     *    — оранжевая рамка: не магазинный
     */
    function highlightProfileArtifacts(shopArtifacts) {
        document.querySelectorAll('div.arts_info').forEach(artDiv => {
            const link = artDiv.querySelector('a[href*="art_info.php?id="]');
            if (!link) return;
            const match = link.href.match(/id=([a-zA-Z0-9_]+)/);
            if (match) {
                const artId = match[1];
                // Проверяем магазинность по JSON-справочнику
                if (shopArtifacts.some(art => art.id === artId)) {
                    artDiv.style.outline = '3px solid #0c0';
                    artDiv.style.boxShadow = '0 0 7px 2px #0c0b';
                } else {
                    artDiv.style.outline = '3px solid #fa0';
                    artDiv.style.boxShadow = '0 0 7px 2px #fa0b';
                }
            }
        });
    }
 
    /**
     * 2. Подсветка одетых артефактов на главной странице пользователя (home.php)
     *    Тут по def стандартная схема: если прочность < 5 — выделяем красным,
     *    иначе делаем подсветку магазинных/не магазинных (как в профиле).
     */
    function highlightEquipped(shopArtifacts) {
        document.querySelectorAll('div.slot_size').forEach(slot => {
            let artId = null;
            // Ищем ссылку на art_info внутри слота — из неё определяем id
            const infoLink = slot.querySelector('a[href*="art_info.php"]');
            if (infoLink) {
                const match = infoLink.href.match(/id=([a-zA-Z0-9_]+)/);
                if (match) artId = match[1];
            }
            // Проверяем и подсвечиваем low durability
            const durDiv = slot.querySelector('.art_durability_hidden');
            if (durDiv) {
                const match = durDiv.textContent.trim().match(/^(\d+)\/(\d+)/);
                if (match) {
                    const current = parseInt(match[1], 10);
                    if (current < 5) {
                        // яркая красная рамка
                        slot.style.outline = '4px solid red';
                        slot.style.boxSizing = 'border-box';
                        slot.style.borderRadius = '8px';
                        slot.style.boxShadow = '0 0 18px 4px red';
                        durDiv.style.opacity = '1';
                        durDiv.style.visibility = 'visible';
                        durDiv.style.display = 'block';
                        return; // Не перекрашиваем
                    }
                }
            }
            // Аналогичное выделение магазинных
            if (artId && shopArtifacts) {
                if (shopArtifacts.some(art => art.id === artId)) {
                    slot.style.outline = '3px solid #0c0';
                } else {
                    slot.style.outline = '3px solid #fa0';
                }
            }
        });
    }
 
    /**
     * 3. В инвентаре пользователя (inventory.php) подсвечиваем только полностью изношенные (=0)
     *    Всё остальное видится как норм — не трогаем.
     */
    function highlightBrokenInventoryOnly() {
        document.querySelectorAll('div.inv_art_outside').forEach(slot => {
            const durDiv = slot.querySelector('.art_durability_hidden');
            if (durDiv) {
                const match = durDiv.textContent.trim().match(/^(\d+)\/(\d+)/);
                if (match) {
                    const current = parseInt(match[1], 10);
                    if (current < 1) {
                        slot.style.outline = '4px solid red';
                        slot.style.boxSizing = 'border-box';
                        slot.style.borderRadius = '8px';
                        slot.style.boxShadow = '0 0 18px 6px red';
                        durDiv.style.opacity = '1';
                        durDiv.style.visibility = 'visible';
                        durDiv.style.display = 'block';
                    } else {
                        slot.style.outline = '';
                        slot.style.boxShadow = '';
                    }
                }
            } else {
                slot.style.outline = '';
                slot.style.boxShadow = '';
            }
        });
    }
 
    /**
     * 4. Ключевой пункт: подсвечиваем надетые арты в модальном окне героя в бою!
     *    Окно всегда появляется с id='win_InfoHero2', а вся "кукла" артов — inv_doll_inside.
     *    Если окна ещё нет — ничего не делаем (скрипт ловит появление динамически).
     */
    function highlightBattleModalArtifacts(shopArtifacts) {
        // Ищем модальное окно героя в бою
        const modal = document.getElementById('win_InfoHero2');
        if (!modal || modal.style.display === 'none') return;
        const doll = modal.querySelector('#inv_doll_inside');
        if (!doll) return;
        // По той же логике — ищем arts_info внутри куклы
        doll.querySelectorAll('div.arts_info').forEach(artDiv => {
            const link = artDiv.querySelector('a[href*="art_info.php?id="]');
            if (!link) return;
            const match = link.href.match(/id=([a-zA-Z0-9_]+)/);
            if (match) {
                const artId = match[1];
                if (shopArtifacts.some(art => art.id === artId)) {
                    artDiv.style.outline = '3px solid #0c0';
                    artDiv.style.boxShadow = '0 0 7px 2px #0c0b';
                } else {
                    artDiv.style.outline = '3px solid #fa0';
                    artDiv.style.boxShadow = '0 0 7px 2px #fa0b';
                }
            }
        });
    }
 
    /**
     * Главная точка запуска:
     * В зависимости от адреса — активируем нужное место подсветки.
     * (на inventory.php ещё и MutationObserver для быстрой актуализации при любых изменениях)
     */
    function run(shopArtifacts) {
        const path = window.location.pathname;
        if (path.includes('pl_info.php')) {
            highlightProfileArtifacts(shopArtifacts);
        } else if (path.includes('home.php')) {
            highlightEquipped(shopArtifacts);
        } else if (path.includes('inventory.php')) {
            highlightBrokenInventoryOnly();
            // Следим за всем инвентарём: если что-то поменялось — подсвечиваем и заодно в бою
            let container = document.querySelector('.artifacts_table')
                || document.querySelector('.inventory_table')
                || document.querySelector('.inventory_container')
                || document.body;
            if (container) {
                const observer = new MutationObserver(() => {
                    highlightBrokenInventoryOnly();
                    highlightBattleModalArtifacts(shopArtifacts);
                });
                observer.observe(container, {childList: true, subtree: true});
            }
        }
        // И отдельно — каждый раз пробуем подсветить артефакты героя в бою через появившиеся(модалка) окно!
        highlightBattleModalArtifacts(shopArtifacts);
    }
 
    // Первый запуск после загрузки JSON справочника артов с gist
    fetch(ARTIFACTS_JSON_URL)
        .then(r => r.ok ? r.json() : [])
        .then(shopArtifacts => run(shopArtifacts))
        .catch(() => run([]));
 
    // Также повтор через DOMContentLoaded — если сайт догружается с отложенной динамикой
    window.addEventListener('DOMContentLoaded', () => {
        fetch(ARTIFACTS_JSON_URL)
            .then(r => r.ok ? r.json() : [])
            .then(shopArtifacts => run(shopArtifacts))
            .catch(() => run([]));
    });
 
    // если появляется динамическое окно героя (модалка битвы) — сразу подсвечиваются арты
    const battleModalObserver = new MutationObserver(() => {
        fetch(ARTIFACTS_JSON_URL)
            .then(r => r.ok ? r.json() : [])
            .then(shopArtifacts => highlightBattleModalArtifacts(shopArtifacts));
    });
    battleModalObserver.observe(document.body, {childList: true, subtree: true});
 
    // Ещё одна контрольная попытка через 1.5 сек для совсем "ленивого" интерфейса (некоторые js-движки отрисовывают элементы с задержкой)
    setTimeout(() => {
        fetch(ARTIFACTS_JSON_URL)
            .then(r => r.ok ? r.json() : [])
            .then(shopArtifacts => run(shopArtifacts))
            .catch(() => run([]));
    }, 1500);
 
})();