// ==UserScript==
// @name ТЕСТ
// @version 0.1.4
// @description тех
// @author Mibo
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @namespace https://forum.blackrussia.online
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/563028/%D0%A2%D0%95%D0%A1%D0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/563028/%D0%A2%D0%95%D0%A1%D0%A2.meta.js
// ==/UserScript==

(function() {
    // КОНСТАНТЫ ПРЕФИКСОВ
    const UNACCEPT_PREFIX = 4;        // Отказано
    const ACCEPT_PREFIX = 8;          // Одобрено
    const RESHENO_PREFIX = 6;         // Решено
    const PIN_PREFIX = 2;             // На рассмотрение
    const GA_PREFIX = 12;             // Главному администратору
    const COMMAND_PREFIX = 10;        // Команде проекта
    const WATCHED_PREFIX = 9;         // На контроле
    const CLOSE_PREFIX = 7;           // Закрыто
    const SA_PREFIX = 11;             // Специальной администрации
    const TEXU_PREFIX = 13;           // Тех. специалисту
    const KREPKO_PREFIX = 5;          // Крепко

    const buttons = [
        {
            title: 'Собственный ответ',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]<br>' +
                '[CENTER][B]' +
                '[url=https://postimages.org/]Postimages.org[/url] [url=https://postimages.org/]https://postimages.org/[/url]<br><br>' +
                '(Все ссылки кликабельны)<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]',
            prefix: null,
            status: false,
        },
        { 
            title: '╔═══════════════════════════════════════════════════════╗ ОТВЕТЫ ДЛЯ ИГРАКОВ  ╔═══════════════════════════════════════════════════════╗',
            content: '',
            prefix: null,
            status: false,
        },
        {
            title: '1 - Без окна о блокировке тема не подлежит рассмотрению',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                '[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, прикрепив окно блокировки.<br><br>' +
                'Если ваш аккаунт был заблокирован на фотохостинге или видеохостинге, обратите внимание: доказательства из социальных сетей не принимаются.<br><br>' +
                '[B]Используйте для этого следующие сервисы:[/B]<br>' +
                '[url=https://yapx.ru/]yapx.ru[/url], [url=https://yapx.ru/]https://yapx.ru/[/url]<br>' +
                '[url=https://imgur.com/]imgur.com[/url], [url=https://imgur.com/]https://imgur.com/[/url]<br>' +
                '[url=https://www.youtube.com/]youtube.com[/url], [url=https://www.youtube.com/]https://www.youtube.com/[/url]<br>' +
                '[url=https://imgbb.com/]ImgBB.com[/url], [url=https://imgbb.com/]https://imgbb.com/[/url]<br>' +
                '[url=https://imgfoto.host/]ImgFoto.host[/url], [url=https://imgfoto.host/]https://imgfoto.host/[/url]<br>' +
                '[url=https://postimages.org/]Postimages.org[/url] [url=https://postimages.org/]https://postimages.org/[/url]<br><br>' +
                '(все ссылки кликабельны)<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]',
            prefix: CLOSE_PREFIX, // Изменено с UNACCEPT_PREFIX на CLOSE_PREFIX
            status: false,
        },
        {
            title: '2 - Обращение не связано с разделом «Технического раздела» (жалоба на админа)',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                '[CENTER]Ваше обращение не связано с разделом «Технического раздела». Вы получили наказание от администратора.<br><br>' +
                '[B]Чтобы подать жалобу, перейдите в раздел «Жалобы на администрацию» на вашем сервере.[/B]<br><br>' +
                'Форма для подачи жалобы доступна по ссылке.<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]',
            prefix: CLOSE_PREFIX, // Изменено с UNACCEPT_PREFIX на CLOSE_PREFIX
            status: false,
        },
        {
            title: '3 - Обращение не связано с разделом «Технического раздела» (жалоба на игрока)',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                '[CENTER]Ваше обращение не связано с разделом «Технического раздела».<br><br>' +
                '[B]Чтобы подать жалобу на игрока, перейдите в раздел «Жалобы на игроков» на вашем сервере.[/B]<br><br>' +
                'Форма для подачи жалобы доступна по ссылке.<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]',
            prefix: CLOSE_PREFIX, // Изменено с UNACCEPT_PREFIX на CLOSE_PREFIX
            status: false,
        },
        {
            title: '4 - Обращение не соответствует форме (расширенная форма)',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                '[CENTER]Ваше обращение не соответствует форме.<br><br>' +
                '[B]Пожалуйста, заполните форму, создав новую тему. Укажите название темы и никнейм технического специалиста.[/B]<br><br>' +
                '01. Ваш игровой никнейм:<br>' +
                '02. Никнейм технического специалиста:<br>' +
                '03. Сервер, на котором вы играете:<br>' +
                '04. Описание ситуации: подробно опишите, что произошло.<br>' +
                '05. Скриншоты, которые могут помочь в решении проблемы (если есть):<br>' +
                '06. Дата и время, когда возникла проблема (укажите как можно точнее):<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]',
            prefix: CLOSE_PREFIX, // Изменено с UNACCEPT_PREFIX на CLOSE_PREFIX
            status: false,
        },
        {
            title: '5 - Тема принята к рассмотрению',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                '[CENTER][B]Ваша тема принята к рассмотрению.[/B] Ожидайте ответа от Куратора Технических Специалистов или его заместителя.<br><br>' +
                '[COLOR=Red]Не создавайте подобные темы. В противном случае ваш аккаунт может быть заблокирован.[/COLOR]<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]',
            prefix: TEXU_PREFIX, // Изменено с PIN_PREFIX на TEXU_PREFIX
            status: true,
        },
        {
            title: '6 - Тема является дубликатом',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                '[CENTER]Эта тема является дубликатом вашей предыдущей темы.<br><br>' +
                '[B]Пожалуйста, перестаньте создавать однотипные и одинаковые темы, иначе ваш форумный аккаунт может быть заблокирован.[/B]<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]',
            prefix: CLOSE_PREFIX, // Изменено с UNACCEPT_PREFIX на CLOSE_PREFIX
            status: false,
        },
        {
            title: '7 - Игрок будет заблокирован после проверки',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                '[CENTER]После тщательной проверки доказательств и системы логирования принято решение.<br><br>' +
                '[COLOR=Red][B]Игрок будет заблокирован.[/B][/COLOR]<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]',
            prefix: CLOSE_PREFIX, // Изменено с ACCEPT_PREFIX на CLOSE_PREFIX
            status: false,
        },
        {
            title: '8 - Обращение составлено не по форме (альтернативная форма)',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                '[CENTER]Ваше обращение составлено не по форме.<br><br>' +
                '[B]Пожалуйста, заполните форму, создав новую тему:[/B]<br><br>' +
                'Код:<br>' +
                '01. Ваш игровой никнейм:<br>' +
                '02. Сервер, на котором Вы играете:<br>' +
                '03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто):<br>' +
                '04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>' +
                '05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]',
            prefix: CLOSE_PREFIX, // Изменено с UNACCEPT_PREFIX на CLOSE_PREFIX
            status: false,
        },
        {
            title: '9 - Тема уже взята в обработку',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                '[CENTER][B]Тема уже взята в обработку и будет рассмотрена.[/B] Ожидайте ответ в этой теме.<br><br>' +
                'Процесс может потребовать некоторого времени.<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]',
            prefix: TEXU_PREFIX, // Изменено с PIN_PREFIX на TEXU_PREFIX
            status: true,
        },
        {
            title: 'Оскорбление родственников / Упоминание семьи',
            content: '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                    '[CENTER]Нарушитель будет наказан согласно соответствующему пункту регламента: <br>' +
                    '[COLOR=Red]3.04.[/COLOR] Категорически запрещается оскорблять родственников или делать косвенные упоминания о членах семьи, независимо от того, происходит это в игровом (IC) или реальном (OOC) общении. [COLOR=Red]| Безмолвие 120 минут / Исключение 7 - 15 суток[/COLOR]<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                    '[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]' +
                    '[CENTER]Желаем приятной игры и хорошего настроения на нашем сервере [COLOR=rgb(144,0,32)],CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },        
    ];

    // Ждем загрузки страницы
    $(document).ready(function() {
        // Ждем загрузки Handlebars
        setTimeout(function() {
            initializeScript();
        }, 1000);
    });

    function initializeScript() {
        // Загрузка Handlebars если еще не загружен
        if (typeof Handlebars === 'undefined') {
            $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
            // Ждем загрузки библиотеки
            setTimeout(function() {
                addButtons();
            }, 500);
        } else {
            addButtons();
        }
    }

    function addButtons() {
        // Добавляем основные кнопки
        addButton('На рассмотрение', 'pin');
        addButton('Одобрено', 'accepted');
        addButton('Отказано', 'unaccept');
        addButton('Закрыто', 'Zakrito');
        addButton('ГА', 'GA');
        addButton('Ответы', 'selectAnswer');
        
        // Назначаем обработчики событий
        bindEvents();
    }

    function addButton(name, id) {
        // Ищем кнопку "Ответить" и добавляем перед ней нашу кнопку
        var replyButton = $('.button--icon--reply');
        if (replyButton.length) {
            replyButton.before(
                '<button type="button" class="button rippleButton" id="' + id + '" style="margin: 3px;">' + name + '</button>'
            );
        } else {
            // Альтернативное место для кнопок
            $('.message-actionBar').append(
                '<button type="button" class="button rippleButton" id="' + id + '" style="margin: 3px;">' + name + '</button>'
            );
        }
    }

    function bindEvents() {
        // Обработчики для основных кнопок
        $('button#pin').on('click', function() {
            editThreadData(PIN_PREFIX, true);
        });
        
        $('button#accepted').on('click', function() {
            editThreadData(ACCEPT_PREFIX, false);
        });
        
        $('button#unaccept').on('click', function() {
            editThreadData(UNACCEPT_PREFIX, false);
        });
        
        $('button#Zakrito').on('click', function() {
            editThreadData(CLOSE_PREFIX, false);
        });
        
        $('button#GA').on('click', function() {
            editThreadData(GA_PREFIX, true);
        });
        
        // Обработчик для кнопки "Ответы"
        $('button#selectAnswer').on('click', function() {
            showAnswersDialog();
        });
    }

    function showAnswersDialog() {
        // Создаем диалоговое окно с кнопками
        var dialogContent = '<div class="answers-dialog" style="max-height: 400px; overflow-y: auto;">';
        
        buttons.forEach(function(btn, index) {
            if (btn.title) {
                dialogContent += '<button class="button button--primary rippleButton answer-btn" data-index="' + index + '" style="margin: 5px; width: 100%; text-align: left;">' + btn.title + '</button><br>';
            }
        });
        
        dialogContent += '</div>';
        
        // Используем стандартный диалог XenForo
        XF.alert(dialogContent, null, 'Выберите шаблон ответа:');
        
        // Назначаем обработчики на кнопки в диалоге
        setTimeout(function() {
            $('.answer-btn').on('click', function() {
                var index = $(this).data('index');
                selectAnswer(index);
                XF.dialog.close(); // Закрываем диалог
            });
        }, 100);
    }

    function selectAnswer(index) {
        var threadData = getThreadData();
        var button = buttons[index];
        
        if (button.content) {
            // Вставляем текст в редактор
            pasteContent(button.content, threadData);
            
            // Если нужно установить префикс и статус
            if (button.prefix !== null && button.status !== null) {
                editThreadData(button.prefix, button.status);
            }
            
            // Автоматически нажимаем кнопку "Ответить"
            setTimeout(function() {
                $('.button--icon--reply').trigger('click');
            }, 300);
        }
    }

    function pasteContent(content, data) {
        try {
            // Компилируем шаблон
            var template = Handlebars.compile(content);
            var compiledContent = template(data);
            
            // Вставляем в редактор
            var editor = $('.fr-element.fr-view')[0];
            if (editor) {
                $(editor).html(compiledContent);
            } else {
                // Альтернативный способ для разных версий XenForo
                var textarea = $('textarea')[0];
                if (textarea) {
                    $(textarea).val(compiledContent);
                }
            }
        } catch (e) {
            console.error('Ошибка при обработке шаблона:', e);
        }
    }

    function getThreadData() {
        try {
            var authorElement = $('a.username').first();
            var authorID = authorElement.attr('data-user-id') || '0';
            var authorName = authorElement.text() || 'Пользователь';
            var hours = new Date().getHours();
            
            var greeting = 'Доброго времени суток';
            if (hours >= 5 && hours < 12) {
                greeting = 'Доброе утро';
            } else if (hours >= 12 && hours < 18) {
                greeting = 'Добрый день';
            } else if (hours >= 18 && hours < 22) {
                greeting = 'Добрый вечер';
            } else {
                greeting = 'Доброй ночи';
            }
            
            return {
                user: {
                    id: authorID,
                    name: authorName,
                    mention: '[USER=' + authorID + ']' + authorName + '[/USER]',
                },
                greeting: greeting,
            };
        } catch (e) {
            console.error('Ошибка при получении данных темы:', e);
            return {
                user: {
                    id: '0',
                    name: 'Пользователь',
                    mention: '[USER=0]Пользователь[/USER]',
                },
                greeting: 'Доброго времени суток',
            };
        }
    }

    function editThreadData(prefix, pin) {
        var threadTitle = $('.p-title-value').text().trim();
        var url = window.location.href + 'edit';
        
        // Получаем название префикса по его ID
        var prefixName = getPrefixName(prefix);
        
        // Убираем все возможные префиксы из заголовка
        var cleanedTitle = removePrefixesFromTitle(threadTitle);
        
        // Формируем новый заголовок с префиксом
        var newTitle = prefixName ? prefixName + ' / ' + cleanedTitle : cleanedTitle;
        
        var formData = new FormData();
        formData.append('prefix_id', prefix);
        formData.append('title', newTitle); // Используем очищенный заголовок с новым префиксом
        formData.append('_xfToken', XF.config.csrf);
        formData.append('_xfRequestUri', window.location.pathname);
        formData.append('_xfWithData', '1');
        formData.append('_xfResponseType', 'json');
        
        if (pin) {
            formData.append('sticky', '1');
        }
        
        fetch(url, {
            method: 'POST',
            body: formData
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            if (data.status === 'ok') {
                // Обновляем страницу после успешного изменения
                setTimeout(function() {
                    location.reload();
                }, 500);
            }
        }).catch(function(error) {
            console.error('Ошибка при изменении темы:', error);
        });
    }

    // Функция для получения названия префикса по ID
    function getPrefixName(prefixId) {
        var prefixNames = {
            4: 'Отказано',
            8: 'Одобрено',
            6: 'Решено',
            2: 'На рассмотрении',
            12: 'Главному администратору',
            10: 'Команде проекта',
            9: 'На контроле',
            7: 'Закрыто',
            11: 'Специальной администрации',
            13: 'Тех. специалисту',
            5: 'Крепко'
        };
        
        return prefixNames[prefixId] || '';
    }

    // Функция для удаления префиксов из заголовка
    function removePrefixesFromTitle(title) {
        // Список всех возможных префиксов для удаления
        var prefixesToRemove = [
            'Отказано',
            'Одобрено',
            'Решено',
            'На рассмотрении',
            'Главному администратору',
            'Команде проекта',
            'На контроле',
            'Закрыто',
            'Специальной администрации',
            'Тех. специалисту',
            'Крепко'
        ];
        
        var cleanedTitle = title;
        
        // Убираем каждый префикс с разделителем "/"
        prefixesToRemove.forEach(function(prefix) {
            var prefixWithSeparator = prefix + ' / ';
            if (cleanedTitle.startsWith(prefixWithSeparator)) {
                cleanedTitle = cleanedTitle.substring(prefixWithSeparator.length);
            }
            
            // Также проверяем без пробелов вокруг "/"
            var prefixWithSlash = prefix + '/';
            if (cleanedTitle.startsWith(prefixWithSlash)) {
                cleanedTitle = cleanedTitle.substring(prefixWithSlash.length);
            }
            
            // Проверяем точное совпадение (если префикс - это весь заголовок)
            if (cleanedTitle === prefix) {
                cleanedTitle = '';
            }
        });
        
        // Убираем возможные двойные разделители
        cleanedTitle = cleanedTitle.replace(/^\/\s*/, '').trim();
        
        return cleanedTitle || 'Нет заголовка';
    }
})();