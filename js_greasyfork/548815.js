// ==UserScript==
// @name         Модератор форума by E.Sailauov CHEREPOVETS v2
// @namespace    https://forum.blackrussia.online/
// @version      2.0.0
// @description  Скрипт для кураторов форума с выбором причин отказа
// @author       E.Sailauov
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548815/%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20ESailauov%20CHEREPOVETS%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/548815/%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20ESailauov%20CHEREPOVETS%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PHOTO_URL = 'https://i.postimg.cc/2SXx0xNt/RLwzo.png';

    const QUOTES = {
        BIO: "Помни: хорошая биография — ключ к интересной игре в Black Russia.",
        SITUATION: "RP ситуация оживляет мир — играй честно и с умом!",
        ORG: "Организация должна вдохновлять игроков на роль и командную игру."
    };

    const DENY_REASONS = {
        BIO: [
            'Нарушение правил',
            'Не дополнил',
            'Плагиат',
            'Мало информации',
            'Не по форме',
            'Не от первого лица',
            'NRP никнейм',
            'Заголовок не по форме',
            'Возраст не совпадает с датой',
            'Указана не полная дата',
            'Возраст младше 18',
            'Грамматические ошибки',
            'Не все заполнил',
            'Нейросеть',
            'Изображение себя героя',
            'Вне игровая локация (место рождения)',
            'Вне игровая локация (место проживания)',
            'Уже на рассмотрении',
            'Оффтоп',
            'От третьего лица'
        ],
        SITUATION: [
            'Нарушение правил',
            'Не дополнил',
            'Мало информации',
            'Не по форме',
            'Сверхъестественные события',
            'Копирование чужой ситуации',
            'OOC-информация в скриншотах'
        ],
        ORG: [
            'Нарушение правил',
            'Не дополнил',
            'Мало информации',
            'Не по форме',
            'Копирование чужой организации',
            'Государственная форма организации',
            'Отсутствие визуальной особенности',
            'Лидер без RP биографии',
            'Название не отражает тематику',
            'OOC-информация на скриншотах'
        ]
    };

    const BUTTONS = [
        { title: 'На рассмотрение', type: 'REVIEW', color: '#ff9900' },
        { title: 'Одобрено', type: 'ACCEPT', color: '#00cc44' },
        { title: 'Отказано', type: 'DENY', color: '#ff3300' },
        { title: 'Закрыто', type: 'CLOSE', color: '#999999' }
    ];

    const RESPONSES = {
        ACCEPT: (user, section) => `
[CENTER][img]${PHOTO_URL}[/img][/CENTER]
[COLOR=rgb(0,255,127)][FONT=times new roman][SIZE=4][I][CENTER]Здравствуйте, уважаемый ${user}![/CENTER][/I][/SIZE][/FONT][/COLOR]
[I][CENTER][FONT=times new roman][SIZE=4]Ваша RP работа (${section}) одобрена![/SIZE][/FONT][/CENTER][/I]
[CENTER][FONT=times new roman][SIZE=3][I]${QUOTES[section]}[/I][/SIZE][/FONT][/CENTER]
`,

        DENY: (user, section, reason) => `
[CENTER][img]${PHOTO_URL}[/img][/CENTER]
[COLOR=rgb(255,0,0)][FONT=times new roman][SIZE=4][I][CENTER]Здравствуйте, уважаемый ${user}![/CENTER][/I][/SIZE][/FONT][/COLOR]
[I][CENTER][FONT=times new roman][SIZE=4]Ваша RP работа (${section}) отклонена по причине: ${reason}[/SIZE][/FONT][/CENTER][/I]
[CENTER][FONT=times new roman][SIZE=3][I]Примечание: убедитесь, что исправили ошибки и соблюдаете правила раздела.[/I][/SIZE][/FONT][/CENTER]
[CENTER][FONT=times new roman][SIZE=3][I]${QUOTES[section]}[/I][/SIZE][/FONT][/CENTER]
`,

        REVIEW: (user, section) => `
[CENTER][img]${PHOTO_URL}[/img][/CENTER]
[COLOR=rgb(255,165,0)][FONT=times new roman][SIZE=4][I][CENTER]Здравствуйте, уважаемый ${user}![/CENTER][/I][/SIZE][/FONT][/COLOR]
[I][CENTER][FONT=times new roman][SIZE=4]Ваша RP работа (${section}) на рассмотрении.[/SIZE][/FONT][/CENTER][/I]
[CENTER][FONT=times new roman][SIZE=3][I]${QUOTES[section]}[/I][/SIZE][/FONT][/CENTER]
`
    };

    function sendResponse(user, section, type, reason='') {
        let content = '';
        switch(type) {
            case 'ACCEPT': content = RESPONSES.ACCEPT(user, section); break;
            case 'DENY': content = RESPONSES.DENY(user, section, reason); break;
            case 'REVIEW': content = RESPONSES.REVIEW(user, section); break;
        }
        console.log(content); // тут можно вставлять в редактор форума
    }

    function createButtons() {
        const container = document.createElement('div');
        container.style.margin = '10px 0';
        BUTTONS.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.title;
            button.style.backgroundColor = btn.color;
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.padding = '5px 10px';
            button.style.marginRight = '5px';
            button.onclick = () => {
                const user = prompt('Введите ник игрока:');
                const section = prompt('Выберите раздел (BIO, SITUATION, ORG):');
                let reason = '';
                if(btn.type === 'DENY'){
                    const reasonsList = DENY_REASONS[section].map((r, i) => `${i+1}. ${r}`).join('\n');
                    const index = prompt(`Выберите причину отказа:\n${reasonsList}`);
                    reason = DENY_REASONS[section][Number(index)-1] || 'Не указана причина';
                }
                sendResponse(user, section, btn.type, reason);
            };
            container.appendChild(button);
        });
        document.body.insertBefore(container, document.body.firstChild);
    }

    createButtons();

})();