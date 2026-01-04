// ==UserScript==
// @name         Проверка артов перед ГТ (новая версия 2025)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  проверка перед ГТ (адаптация под новую страницу)
// @author       Sky
// @license      MIT
// @match        *://www.heroeswm.ru/pvp_guild.php*
// @match        *://my.lordswm.com/pvp_guild.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552719/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%B0%D1%80%D1%82%D0%BE%D0%B2%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%20%D0%93%D0%A2%20%28%D0%BD%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552719/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%B0%D1%80%D1%82%D0%BE%D0%B2%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%20%D0%93%D0%A2%20%28%D0%BD%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%202025%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createEl = (el, style, innerText, className, placeholder) => {
        let element = document.createElement(el);
        if (style) element.style = style;
        if (innerText) element.innerText = innerText;
        if (className) element.className = className;
        if (placeholder) element.placeholder = placeholder;
        return element;
    };

    const links = ['https://my.lordswm.com', 'https://www.heroeswm.ru'];
    const link = location.href.includes('my.lordswm.com') ? links[0] : links[1];

    function fetch_xml(el) {
        const xhr = new XMLHttpRequest();
        xhr.open('get', `${link}/inventory.php`);
        xhr.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/html; charset=windows-1251');
        }

        xhr.addEventListener('load', () => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xhr.responseText, "text/html");

            let equippedArtsCount = 0;
            const notEquipped = [];

            const arts = [
                {name: 'шлем', id: "slot1"},
                {name: "кулон", id: "slot2"},
                {name: "броня", id: "slot3"},
                {name: "спина", id: "slot4"},
                {name: "правая рука", id: "slot5"},
                {name: "левая рука", id: "slot6"},
                {name: "сапоги", id: "slot7"},
                {name: "верхнее кольцо", id: "slot8"},
                {name: "нижнее кольцо", id: "slot9"},
            ];

            const mirror = doc.getElementById("slot11");

            arts.forEach(art => {
                const slot = doc.getElementById(art.id);
                if (slot && slot.innerText !== "") equippedArtsCount++;
                else if (slot) notEquipped.push(art.name);
            });

            const mirrorText = (mirror && mirror.innerText === "") ? "Зеркало не надето" : "Зеркало надето";
            const mirrorStyle = (mirror && mirror.innerText === "") ? "color: red; font-size: 14px;" : "color: green; font-size: 14px;";

            // основной контейнер
            const wrapper = createEl("div", "margin-top: 6px; text-align: center;");

            const mainArtsBlock = createEl(
                "div",
                `${equippedArtsCount < 9 ? "color: red; cursor: pointer; font-size: 14px; font-weight: 600;" : "color: green; font-size: 14px; font-weight: 600;"}`,
                `Надето артов: ${equippedArtsCount}/9`
            );

            const notEquippedBlock = createEl(
                "div",
                "font-size: 13px; color: red; cursor: pointer;",
                `${equippedArtsCount < 9 ? `Не надето: ${notEquipped.join(', ')}` : ""}`
            );

            const mirrorBlock = createEl("div", mirrorStyle, mirrorText);

            wrapper.append(mainArtsBlock);
            wrapper.append(notEquippedBlock);
            wrapper.append(mirrorBlock);

            wrapper.addEventListener("click", () => { location.href = `${link}/inventory.php`; });

            // Ищем конкретный блок "Гильдия Тактиков"
let header = Array.from(document.querySelectorAll("b, div, span"))
    .find(el => el.textContent.trim().includes("Гильдия Тактиков"));

// Ищем родительский блок с самим окном ГТ
let gtContainer = header ? header.closest("table, div, center") : null;

if (gtContainer) {
    // Вставляем ПОД окном ГТ (не в шапку)
    gtContainer.insertAdjacentElement("beforebegin", wrapper);
} else {
    // запасной вариант — под элементом с фразой "Зелье фракции"
    let potionBlock = Array.from(document.querySelectorAll("b, font, div"))
        .find(el => el.textContent.trim().includes("Зелье фракции"));
    if (potionBlock) {
        potionBlock.insertAdjacentElement("afterend", wrapper);
    } else {
        document.body.append(wrapper);
    }
}
        });
        xhr.send();
    }

    if (location.href.includes("pvp_guild")) {
        fetch_xml(document.body);
    }

    if (location.href.includes("event")) {
        const eventHeader = document.getElementsByClassName("global_container_block_header")[0];
        if (eventHeader) fetch_xml(eventHeader, "event");
    }
    if (location.href.includes("task_guild")) {
        const eventHeader = document.getElementsByClassName("global_container_block_header")[0];
        if (eventHeader) fetch_xml(eventHeader, "task_guild");
    }

})();