// ==UserScript==
// @name         Форум Кураторов CHEREPOVETS by E.Sailauov
// @namespace    https://forum.blackrussia.online/
// @version      1.0.0
// @description  Автоответы для RP Биографий, RP Ситуаций и Неофициальных RP организаций на форуме Black Russia
// @author       E.Sailauov
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548817/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20CHEREPOVETS%20by%20ESailauov.user.js
// @updateURL https://update.greasyfork.org/scripts/548817/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20CHEREPOVETS%20by%20ESailauov.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const UNACCEPT_PREFIX = 4;   // отказано
    const ACCEPT_PREFIX = 8;     // одобрено
    const REVIEW_PREFIX = 9;     // на рассмотрение
    const CLOSE_PREFIX = 7;      // закрыто

    const photoURL = "https://i.postimg.cc/2SXx0xNt/RLwzo.png"; // одно фото для всех ответов

    // Приветствие и вставка ника
    function getGreeting(nick) {
        return `[CENTER][url=https://postimages.org/][img]${photoURL}[/img][/url][/CENTER]
[CENTER][COLOR=rgb(0,127,255)][FONT=times new roman][SIZE=4][I][ICODE]Здравствуйте, уважаемый ${nick}[/ICODE][/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>`;
    }

    // Мотивационные цитаты для всех ответов
    const quotes = [
        "«Терпение и упорство всегда вознаграждаются — играйте с умом и честностью!»",
        "«Каждое RP событие — это шанс показать свой талант и креативность в Black Russia»",
        "«Стремление к совершенству в RP биографии делает игру ярче и интереснее»",
        "«Помните: уважение к правилам форума — путь к признанию и успеху»"
    ];

    function getRandomQuote() {
        return `[CENTER][I][COLOR=rgb(0,127,255)][FONT=times new roman][SIZE=3]${quotes[Math.floor(Math.random()*quotes.length)]}[/SIZE][/FONT][/COLOR][/I][/CENTER]`;
    }

    // Шаблоны ответов
    const templates = {
        "Одобрено": {
            prefix: ACCEPT_PREFIX,
            color: "#00cc44",
            content: "[I][CENTER][COLOR=rgb(152,251,152)][FONT=times new roman][SIZE=4]Ваша RolePlay заявка одобрена[/SIZE][/FONT][/COLOR][/CENTER][/I]"
        },
        "Отказано": {
            prefix: UNACCEPT_PREFIX,
            color: "#ff3300",
            content: "[I][CENTER][COLOR=rgb(255,0,0)][FONT=times new roman][SIZE=4]Ваша заявка отклонена. Обратите внимание на примечания и исправьте ошибки[/SIZE][/FONT][/COLOR][/CENTER][/I]"
        },
        "На рассмотрение": {
            prefix: REVIEW_PREFIX,
            color: "#ff9900",
            content: "[I][CENTER][COLOR=rgb(255,165,0)][FONT=times new roman][SIZE=4]Ваша заявка находится на рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]"
        },
        "Закрыто": {
            prefix: CLOSE_PREFIX,
            color: "#999999",
            content: "[I][CENTER][COLOR=rgb(128,128,128)][FONT=times new roman][SIZE=4]Тема закрыта[/SIZE][/FONT][/COLOR][/CENTER][/I]"
        }
    };

    // Отказы для RP Биографии
    const rpBioDenies = [
        "От 3-го лица: RP биография должна быть написана от первого лица",
        "Нейросеть: RP биография должна быть написана игроком вручную",
        "Не по теме/флуд: Тема не соответствует разделу, нельзя писать не по теме",
        "Мало информации: Добавьте больше подробностей о персонаже",
        "Суперспособности: Персонаж не должен обладать сверхспособностями",
        "Скопирована: RP биография не должна копировать других игроков",
        "NonRP NickName: Используется некорректный ник",
        "Дата рождения не совпадает с возрастом",
        "Семья не полностью",
        "Грамматические/пунктуационные ошибки"
    ];

    // Отказы для RP Ситуаций
    const rpSituationsDenies = [
        "Не по правилам: RP ситуация нарушает правила форума",
        "Сверхъестественное: RP ситуация не должна включать сверхъестественные события",
        "Нет доказательств: Требуются скриншоты/видео",
        "Мало информации: RP ситуация описана слишком кратко",
        "Копирование: RP ситуация скопирована у другого игрока"
    ];

    // Отказы для Неофициальных RP организаций
    const rpOrgDenies = [
        "Не по правилам: Организация нарушает правила форума",
        "Мало участников: Минимум 3 человека",
        "Мало информации: Описание организации слишком краткое",
        "Копирование: Организация скопирована с другой",
        "Гос. фракция: Нельзя создавать организации в форме государственных фракций",
        "Нет фото/видео: Требуется медиа материалы"
    ];

    // Создаем контейнер кнопок
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "100px";
    container.style.right = "20px";
    container.style.width = "200px";
    container.style.zIndex = "9999";
    container.style.backgroundColor = "#222";
    container.style.padding = "10px";
    container.style.borderRadius = "10px";
    container.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    document.body.appendChild(container);

    // Функция для вставки ответа
    function insertResponse(template, denies=[]) {
        const nick = prompt("Введите ник игрока:");
        if(!nick) return;
        let content = getGreeting(nick) + template.content + "<br><br>";
        if(denies.length > 0) {
            content += "<LIST>";
            denies.forEach(d => {
                content += `[*][LEFT][FONT=book antiqua][COLOR=rgb(255,0,0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(0,127,255)][SIZE=4]${d}[/SIZE][/COLOR][/FONT][/LEFT]<br>`;
            });
            content += "</LIST><br>";
        }
        content += getRandomQuote();
        // Вставка в текстовое поле ответа (предположим id="message")
        const textarea = document.querySelector("#message");
        if(textarea) textarea.value = content;
        // Смена префикса темы (имитация)
        console.log(`Префикс темы изменен на: ${template.prefix}`);
    }

    // Создаем кнопки
    function createButton(title, color, func) {
        const btn = document.createElement("button");
        btn.textContent = title;
        btn.style.width = "100%";
        btn.style.marginBottom = "5px";
        btn.style.backgroundColor = color;
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.padding = "5px";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";
        btn.onclick = func;
        container.appendChild(btn);
    }

    // Кнопки главного меню
    createButton("На рассмотрение", "#ff9900", () => insertResponse(templates["На рассмотрение"]));
    createButton("Отказано", "#ff3300", () => insertResponse(templates["Отказано"], rpBioDenies));
    createButton("Одобрено", "#00cc44", () => insertResponse(templates["Одобрено"]));
    createButton("Закрыто", "#999999", () => insertResponse(templates["Закрыто"]));
    
    // Кнопка Ответы с подменю
    const answersBtn = document.createElement("button");
    answersBtn.textContent = "Ответы ▼";
    answersBtn.style.width = "100%";
    answersBtn.style.marginBottom = "5px";
    answersBtn.style.backgroundColor = "#3399ff";
    answersBtn.style.color = "#fff";
    answersBtn.style.border = "none";
    answersBtn.style.padding = "5px";
    answersBtn.style.borderRadius = "5px";
    answersBtn.style.cursor = "pointer";
    container.appendChild(answersBtn);

    const subMenu = document.createElement("div");
    subMenu.style.display = "none";
    subMenu.style.marginTop = "5px";
    container.appendChild(subMenu);

    answersBtn.onclick = () => subMenu.style.display = subMenu.style.display === "none" ? "block" : "none";

    createButton("———RP БИОГРАФИЯ———", "#ff6600", () => insertResponse(templates["Отказано"], rpBioDenies));
    createButton("———RP СИТУАЦИИ———", "#ff6600", () => insertResponse(templates["Отказано"], rpSituationsDenies));
    createButton("———Неофициальные RP организации———", "#ff6600", () => insertResponse(templates["Отказано"], rpOrgDenies));
})();