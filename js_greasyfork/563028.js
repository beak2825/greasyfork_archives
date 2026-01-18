// ==UserScript==
// @name ТЕСТ
// @version 0.0.5
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
    // КОНСТАНТЫ ПРЕФИКСОВ (все ваши префиксы)
    const UNACCEPT_PREFIX = 4;        // Закрыто
    const ACCEPT_PREFIX = 8;          // Одобрено
    const RESHENO_PREFIX = 6;         // Решено
    const PIN_PREFIX = 2;             // На рассмотрение
    const GA_PREFIX = 12;             // Главному администратору
    const COMMAND_PREFIX = 10;        // Команде проекта (НОВЫЙ)
    const WATCHED_PREFIX = 9;         // На контроле
    const CLOSE_PREFIX = 7;           // Закрыто (НОВЫЙ)
    const SA_PREFIX = 11;             // Специальной администрации
    const TEXU_PREFIX = 13;           // Тех. специалисту (НОВЫЙ)
    const KREPKO_PREFIX = 5;          // Крепко (НОВЫЙ - предположительный ID)

    const buttons = [
        {
            title: 'Собственный ответ',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]<br>' +
                '[CENTER][B]Рекомендуемые сервисы для загрузки изображений и видео:[/B][/CENTER]<br>' +
                '[url=https://yapx.ru/]yapx.ru[/url], [url=https://yapx.ru/]https://yapx.ru/[/url]<br>' +
                '[url=https://imgur.com/]imgur.com[/url], [url=https://imgur.com/]https://imgur.com/[/url]<br>' +
                '[url=https://www.youtube.com/]youtube.com[/url], [url=https://www.youtube.com/]https://www.youtube.com/[/url]<br>' +
                '[url=https://imgbb.com/]ImgBB.com[/url], [url=https://imgbb.com/]https://imgbb.com/[/url]<br>' +
                '[url=https://imgfoto.host/]ImgFoto.host[/url], [url=https://imgfoto.host/]https://imgfoto.host/[/url]<br>' +
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
            title: 'Нет окна блокировки',
            content: 
                '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                '[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, прикрепив окно блокировки.<br><br>' +
                'Если ваш аккаунт был заблокирован на фотохостинге или видеохостинге, обратите внимание: доказательства из социальных сетей не принимаются.<br><br>' +
                '[B]Рекомендуемые сервисы для загрузки изображений и видео:[/B]<br>' +
                '[url=https://yapx.ru/]yapx.ru[/url], [url=https://yapx.ru/]https://yapx.ru/[/url]<br>' +
                '[url=https://imgur.com/]imgur.com[/url], [url=https://imgur.com/]https://imgur.com/[/url]<br>' +
                '[url=https://www.youtube.com/]youtube.com[/url], [url=https://www.youtube.com/]https://www.youtube.com/[/url]<br>' +
                '[url=https://imgbb.com/]ImgBB.com[/url], [url=https://imgbb.com/]https://imgbb.com/[/url]<br>' +
                '[url=https://imgfoto.host/]ImgFoto.host[/url], [url=https://imgfoto.host/]https://imgfoto.host/[/url]<br>' +
                '[url=https://postimages.org/]Postimages.org[/url] [url=https://postimages.org/]https://postimages.org/[/url]<br><br>' +
                '(Все ссылки кликабельны)<br><br>' +
                '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' + 
                '[CENTER]Желаем приятной игры и хорошего настроения на нашем сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
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
        { 
            title: '╔═══════════════════════════════════════════════════════╗  ОБРАЩЕНИЯ О НАРУШЕНИЯХ  ╔═══════════════════════════════════════════════════════╗',
            content: '',
            prefix: null,
            status: false,
        },
        {
            title: 'Принято к рассмотрению',
            content: '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[CENTER]Ваше обращение было [COLOR=Orange]принято к детальному рассмотрению[/COLOR]. Пожалуйста, ожидайте обратной связи от административной команды сервера.<br>Настоятельно просим воздержаться от создания повторных обращений по данному вопросу, в противном случае ваш форумный аккаунт может быть подвергнут [COLOR=Red]временной или постоянной блокировке.[/CENTER]<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f5a819/20/1/4nq7brby4nopbrgow8ekdwrh4nxpbesowdejmwr74ncpbgy.png[/img][/url]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Направлено техническому эксперту',
            content: '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[CENTER]Ваше обращение было перенаправлено для [COLOR=Orange]детального технического анализа[/COLOR] нашему специалисту.<br>Пожалуйста, проявите терпение и не создавайте дублирующих запросов, чтобы избежать возможных [COLOR=Red]ограничений доступа к форумной платформе.[/CENTER]<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/1f56db/20/1/4ntpbfqowzej5wra4nu7bfqow8ejiwr64nqpbe3y4no7b86o1zekpwra4nepbg6oudekdwfn4nto.png[/img][/url]',
            prefix: TEXU_PREFIX,
            status: true,
        },
        {
            title: 'Передано главному администратору',
            content: '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[CENTER]Ваше обращение было перенаправлено для рассмотрения лично [COLOR=Red]Главным администратором проекта[/COLOR] - @Ronald Kõlman ☭︎ <br>Настоятельно рекомендуем не создавать дополнительные обращения по данному вопросу до получения ответа, чтобы избежать возможных [COLOR=Red]санкций в отношении вашего аккаунта.[/CENTER]<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/e90c0c/20/1/4nj7bg6o1dejfwr74nxpb8gowcopbrgo1uej3wra4nq7bggow8ekfwfy4nepbesou5ekbwfd.png[/img][/url]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Передано заместителям главного администратора',
            content: '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[CENTER]Ваше обращение было передано для рассмотрения [COLOR=Red]Заместителям главного администратора[/COLOR] - @Nikolay_Kashtanov и @Vanya Donissimo. <br>Просим воздержаться от создания дополнительных обращений по данному вопросу до получения официального ответа, чтобы избежать возможных [COLOR=Red]ограничений доступа.[/CENTER]<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/ef060c/20/1/4nm7brgouuejmwfb4ntpbggowmejmwr54nznbwru4np7brgo1mej5wr64nj7b8ty4nepbfgouuejtwr74ncpbeqowmekbwro4ntpb8sowdejy.png[/img][/url]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Направлено в специальную администрацию',
            content: '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[CENTER]Ваше обращение было направлено для детального рассмотрения [COLOR=Red]Специальному администратору – @Sander_Kligan[/COLOR], а также его заместителям – @Clarence Crown, @Dmitry Dmitrich, @Myron_Capone, @Liana_Mironova. <br>Пожалуйста, ожидайте официального ответа и воздержитесь от создания повторных обращений, чтобы избежать возможных [COLOR=Red]ограничительных мер.[/CENTER]<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f12229/20/1/4no7b86o1zekpwra4nepbg6oiuej5wr64nc1bwro4nkpb8goudej5wra4no7besowdejbwfg4ncpbgy.png[/img][/url]',
            prefix: SA_PREFIX,
            status: true,
        },
        { 
            title: '╔═══════════════════════════════════════════════════════╗  НАКАЗАНИЯ ДЛЯ ИГРАКОВ  ╔═══════════════════════════════════════════════════════╗',
            content: '',
            prefix: null,
            status: false,
        },
        {
            title: 'Уход от редепрлей процесса',
            content: '[SIZE=4][FONT=times new roman][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/1zcGTzsD/twL1KNg.png[/img][/url]' +
                    '[CENTER] Нарушитель будет наказан согласно соответствующему пункту регламента: <br>' +
                    '[COLOR=Red]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры  [COLOR=Red]| Jail 30 минут [/COLOR]<br>' +
                    '[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]<br>' +
                    '[CENTER]Желаем приятной игры и хорошего настроения на нашем сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
        }                           
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
        
        var formData = new FormData();
        formData.append('prefix_id', prefix);
        formData.append('title', threadTitle);
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
})();