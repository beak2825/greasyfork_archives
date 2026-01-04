// ==UserScript==
// @name         Скрипт для Кураторов Форума || RED
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Скрипт для Кураторв Форума
// @author       Valik
// @match       https://forum.blessrussia.online/index.php
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/551638/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20RED.user.js
// @updateURL https://update.greasyfork.org/scripts/551638/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20RED.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Ждем полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        setTimeout(initScript, 1000);
    }

    function initScript() {
        // Даем дополнительное время для загрузки всех элементов
        setTimeout(() => {
            try {
                // Проверяем, находимся ли мы на нужной странице
                if (!document.querySelector('.button--icon--reply')) {
                    console.log('Кнопка ответа не найдена, скрипт не активирован');
                    return;
                }
                
                // Загружаем Handlebars
                loadHandlebars();
            } catch (error) {
                console.error('Ошибка инициализации скрипта:', error);
            }
        }, 2000);
    }

    function loadHandlebars() {
        // Проверяем, не загружен ли уже Handlebars
        if (typeof Handlebars === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js';
            script.onload = initButtons;
            document.head.appendChild(script);
        } else {
            initButtons();
        }
    }

    function initButtons() {
        try {
            // Добавляем кнопки
            addButton('На рассмотрение', 'pin');
            addButton('Отказано⛔', 'unaccept');
            addButton('Одобрено✅', 'accepted');
            addButton('Специальному Администратору💥', 'Spec');
            addButton('Теху', 'Texy');
            addButton('Главному Администратору💥', 'Ga');
            addButton('Закрыто⛔', 'Zakrito');
            addButton('Решено✅', 'Resheno');
            addButton('Реализовано💫', 'Realizovano');
            addButton('Рассмотрено✅', 'Rassmotreno');
            addButton('Ожидание', 'Ojidanie');
            addButton('Без префикса⛔', 'Prefiks');
            addButton('Проверено контролем качества', 'Kachestvo');
            addButton('Ответы💥', 'selectAnswer');

            // Назначаем обработчики событий
            bindButtonEvents();
            
            console.log('Скрипт успешно активирован');
        } catch (error) {
            console.error('Ошибка инициализации кнопок:', error);
        }
    }

    function addButton(name, id) {
        const replyButton = document.querySelector('.button--icon--reply');
        if (replyButton) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'button rippleButton';
            button.id = id;
            button.textContent = name;
            button.style.margin = '3px';
            button.style.cursor = 'pointer';
            
            replyButton.parentNode.insertBefore(button, replyButton);
        }
    }

    function bindButtonEvents() {
        // Константы префиксов
        const UNACCEPT_PREFIX = 4;
        const ACCEPT_PREFIX = 8;
        const PINN_PREFIX = 2;
        const SPECADM_PREFIX = 11;
        const GA_PREFIX = 12;
        const TEXY_PREFIX = 13;
        const CLOSE_PREFIX = 7;
        const REALIZOVANO_PREFIX = 5;
        const VAJNO_PREFIX = 1;
        const OJIDANIE_PREFIX = 14;
        const PREFIKS = 0;
        const KACHESTVO = 15;
        const RASSMOTRENO_PREFIX = 9;

        // Назначаем обработчики для простых кнопок
        document.getElementById('unaccept')?.addEventListener('click', () => editThreadData(UNACCEPT_PREFIX, false));
        document.getElementById('pin')?.addEventListener('click', () => editThreadData(PINN_PREFIX, true));
        document.getElementById('accepted')?.addEventListener('click', () => editThreadData(ACCEPT_PREFIX, false));
        document.getElementById('Spec')?.addEventListener('click', () => editThreadData(SPECADM_PREFIX, true));
        document.getElementById('Ga')?.addEventListener('click', () => editThreadData(GA_PREFIX, true));
        document.getElementById('Texy')?.addEventListener('click', () => editThreadData(TEXY_PREFIX, false));
        document.getElementById('Zakrito')?.addEventListener('click', () => editThreadData(CLOSE_PREFIX, false));
        document.getElementById('Realizovano')?.addEventListener('click', () => editThreadData(REALIZOVANO_PREFIX, false));
        document.getElementById('Rassmotreno')?.addEventListener('click', () => editThreadData(RASSMOTRENO_PREFIX, false));
        document.getElementById('Ojidanie')?.addEventListener('click', () => editThreadData(OJIDANIE_PREFIX, false));
        document.getElementById('Prefiks')?.addEventListener('click', () => editThreadData(PREFIKS, false));
        document.getElementById('Kachestvo')?.addEventListener('click', () => editThreadData(KACHESTVO, false));

        // Обработчик для кнопки ответов
        document.getElementById('selectAnswer')?.addEventListener('click', showAnswersModal);
    }

    function showAnswersModal() {
        const threadData = getThreadData();
        const buttons = getAnswerButtons();
        
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '10000';
        
        const content = document.createElement('div');
        content.style.backgroundColor = 'white';
        content.style.padding = '20px';
        content.style.borderRadius = '8px';
        content.style.maxWidth = '80%';
        content.style.maxHeight = '80%';
        content.style.overflow = 'auto';
        
        const title = document.createElement('h3');
        title.textContent = 'Выберите ответ:';
        content.appendChild(title);
        
        buttons.forEach((btn, id) => {
            const button = document.createElement('button');
            button.className = 'button button--primary rippleButton';
            button.style.margin = '5px';
            button.textContent = btn.title;
            button.addEventListener('click', () => {
                pasteContent(btn.content, threadData);
                document.body.removeChild(modal);
                
                if (btn.prefix !== undefined) {
                    editThreadData(btn.prefix, btn.status || false);
                }
            });
            content.appendChild(button);
        });
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Закрыть';
        closeBtn.style.marginTop = '10px';
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        content.appendChild(closeBtn);
        
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    function getAnswerButtons() {
        return [
            {
                title: '| Приветствие |',
                content: '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
                    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
                    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                    "[B][CENTER][COLOR=lavender] Текст <br><br>" +
                    "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>" +
                    "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"
            },
            {
                title: '| NonRP Поведение |',
                content: '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
                    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
                    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
                    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                    "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/Spoiler][/CENTER][/B]<br><br>" +
                    "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>" +
                    "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>" +
                    "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
                prefix: 8,
                status: false
            }
            // Добавьте остальные кнопки по аналогии...
        ];
    }

    function pasteContent(content, data) {
        try {
            const template = Handlebars.compile(content);
            const compiledContent = template(data);
            
            const editor = document.querySelector('.fr-element.fr-view');
            if (editor) {
                editor.innerHTML = compiledContent;
            } else {
                console.error('Редактор не найден');
            }
        } catch (error) {
            console.error('Ошибка при вставке контента:', error);
        }
    }

    function getThreadData() {
        const authorElement = document.querySelector('a.username');
        const authorID = authorElement?.getAttribute('data-user-id') || '0';
        const authorName = authorElement?.textContent || 'Пользователь';
        const hours = new Date().getHours();
        
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: () =>
                4 < hours && hours <= 11 ?
                'Доброе утро' :
                11 < hours && hours <= 15 ?
                'Добрый день' :
                15 < hours && hours <= 21 ?
                'Добрый вечер' :
                'Доброй ночи',
        };
    }

    function editThreadData(prefix, pin = false) {
        try {
            const threadTitle = document.querySelector('.p-title-value')?.textContent?.trim() || 'Без названия';
            const url = window.location.href;
            
            if (!url.includes('index.php')) {
                console.error('Некорректный URL');
                return;
            }

            const formData = new FormData();
            formData.append('prefix_id', prefix.toString());
            formData.append('title', threadTitle);
            formData.append('_xfToken', getXfToken());
            formData.append('_xfRequestUri', getRequestUri());
            formData.append('_xfWithData', '1');
            formData.append('_xfResponseType', 'json');

            if (pin) {
                formData.append('sticky', '1');
            }

            fetch(`${url}edit`, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    location.reload();
                } else {
                    console.error('Ошибка при обновлении темы');
                }
            })
            .catch(error => {
                console.error('Ошибка сети:', error);
            });
            
        } catch (error) {
            console.error('Ошибка в editThreadData:', error);
        }
    }

    function getXfToken() {
        const tokenInput = document.querySelector('input[name="_xfToken"]');
        return tokenInput ? tokenInput.value : '';
    }

    function getRequestUri() {
        const fullBase = window.XF?.config?.url?.fullBase || '';
        return window.location.href.replace(fullBase, '');
    }

})();