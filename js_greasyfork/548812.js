// ==UserScript==
// @name         Форум Black Russia Модератор UI v3
// @namespace    https://forum.blackrussia.online/
// @version      3.0
// @description  Улучшенный интерфейс модератора с выбором раздела и причины отказа
// @author       E.Sailauov
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548812/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20Black%20Russia%20%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20UI%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/548812/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20Black%20Russia%20%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20UI%20v3.meta.js
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
        BIO: ['Нарушение правил','Не дополнил','Плагиат','Мало информации','Не по форме','Не от первого лица','NRP никнейм','Заголовок не по форме','Возраст не совпадает с датой','Указана не полная дата','Возраст младше 18','Грамматические ошибки','Не все заполнил','Нейросеть','Изображение себя героя','Вне игровая локация (место рождения)','Вне игровая локация (место проживания)','Уже на рассмотрении','Оффтоп','От третьего лица'],
        SITUATION: ['Нарушение правил','Не дополнил','Мало информации','Не по форме','Сверхъестественные события','Копирование чужой ситуации','OOC-информация в скриншотах'],
        ORG: ['Нарушение правил','Не дополнил','Мало информации','Не по форме','Копирование чужой организации','Государственная форма организации','Отсутствие визуальной особенности','Лидер без RP биографии','Название не отражает тематику','OOC-информация на скриншотах']
    };

    const RESPONSES = {
        ACCEPT: (user, section) => `[CENTER][img]${PHOTO_URL}[/img][/CENTER]\n[COLOR=rgb(0,255,127)][FONT=times new roman][SIZE=4][I][CENTER]Здравствуйте, уважаемый ${user}![/CENTER][/I][/SIZE][/FONT][/COLOR]\n[I][CENTER][FONT=times new roman][SIZE=4]Ваша RP работа (${section}) одобрена![/SIZE][/FONT][/CENTER][/I]\n[CENTER][FONT=times new roman][SIZE=3][I]${QUOTES[section]}[/I][/SIZE][/FONT][/CENTER]`,
        DENY: (user, section, reason) => `[CENTER][img]${PHOTO_URL}[/img][/CENTER]\n[COLOR=rgb(255,0,0)][FONT=times new roman][SIZE=4][I][CENTER]Здравствуйте, уважаемый ${user}![/CENTER][/I][/SIZE][/FONT][/COLOR]\n[I][CENTER][FONT=times new roman][SIZE=4]Ваша RP работа (${section}) отклонена по причине: ${reason}[/SIZE][/FONT][/CENTER][/I]\n[CENTER][FONT=times new roman][SIZE=3][I]Примечание: убедитесь, что исправили ошибки и соблюдаете правила раздела.[/I][/SIZE][/FONT][/CENTER]\n[CENTER][FONT=times new roman][SIZE=3][I]${QUOTES[section]}[/I][/SIZE][/FONT][/CENTER]`,
        REVIEW: (user, section) => `[CENTER][img]${PHOTO_URL}[/img][/CENTER]\n[COLOR=rgb(255,165,0)][FONT=times new roman][SIZE=4][I][CENTER]Здравствуйте, уважаемый ${user}![/CENTER][/I][/SIZE][/FONT][/COLOR]\n[I][CENTER][FONT=times new roman][SIZE=4]Ваша RP работа (${section}) на рассмотрении.[/SIZE][/FONT][/CENTER][/I]\n[CENTER][FONT=times new roman][SIZE=3][I]${QUOTES[section]}[/I][/SIZE][/FONT][/CENTER]`
    };

    function sendResponse(user, section, type, reason='') {
        let content = '';
        switch(type){
            case 'ACCEPT': content = RESPONSES.ACCEPT(user, section); break;
            case 'DENY': content = RESPONSES.DENY(user, section, reason); break;
            case 'REVIEW': content = RESPONSES.REVIEW(user, section); break;
        }
        console.log(content); // здесь можно вставлять в редактор форума
    }

    function createUI() {
        const container = document.createElement('div');
        container.style.padding = '10px';
        container.style.background = 'linear-gradient(to right, #2c3e50, #4ca1af)';
        container.style.borderRadius = '10px';
        container.style.marginBottom = '15px';
        container.style.color = '#fff';
        container.style.fontFamily = 'Arial, sans-serif';

        const userInput = document.createElement('input');
        userInput.placeholder = 'Введите ник игрока';
        userInput.style.marginRight = '10px';
        userInput.style.padding = '5px';
        container.appendChild(userInput);

        const sectionSelect = document.createElement('select');
        ['BIO','SITUATION','ORG'].forEach(sec => {
            const opt = document.createElement('option');
            opt.value = sec;
            opt.textContent = sec;
            sectionSelect.appendChild(opt);
        });
        sectionSelect.style.marginRight = '10px';
        container.appendChild(sectionSelect);

        const typeSelect = document.createElement('select');
        ['REVIEW','ACCEPT','DENY','CLOSE'].forEach(type=>{
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type;
            typeSelect.appendChild(opt);
        });
        typeSelect.style.marginRight = '10px';
        container.appendChild(typeSelect);

        const reasonSelect = document.createElement('select');
        reasonSelect.style.marginRight = '10px';
        reasonSelect.style.display = 'none';
        container.appendChild(reasonSelect);

        typeSelect.addEventListener('change', ()=>{
            if(typeSelect.value === 'DENY'){
                reasonSelect.innerHTML = '';
                const sec = sectionSelect.value;
                DENY_REASONS[sec].forEach(r=>{
                    const opt = document.createElement('option');
                    opt.value = r;
                    opt.textContent = r;
                    reasonSelect.appendChild(opt);
                });
                reasonSelect.style.display = 'inline-block';
            } else {
                reasonSelect.style.display = 'none';
            }
        });

        const sendBtn = document.createElement('button');
        sendBtn.textContent = 'Отправить';
        sendBtn.style.backgroundColor = '#3498db';
        sendBtn.style.color = '#fff';
        sendBtn.style.border = 'none';
        sendBtn.style.padding = '5px 10px';
        sendBtn.style.borderRadius = '5px';
        sendBtn.onclick = ()=>{
            sendResponse(userInput.value, sectionSelect.value, typeSelect.value, reasonSelect.value);
        };
        container.appendChild(sendBtn);

        document.body.insertBefore(container, document.body.firstChild);
    }

    createUI();

})();