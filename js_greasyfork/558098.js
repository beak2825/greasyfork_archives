// ==UserScript==
// @name Скрипт для ЗГА+
// @namespace https://forum.blackrussia.online
// @version 0.2
// @description Скрипт с готовыми ответами для руководителей.
// @author Rasul (ЗГА-56)
// @match *://*.forum.blackrussia.online/*
// @grant none
// @license MIT
// @icon https://sun9-86.userapi.com/s/v1/ig2/J2MVGSaizWubposLJQwvKw7QWfs12OKmO00HBdgILDM1QW0IJsiQOSwNiiUCIBolWem4wJ88ZmHgyeC4bMkuosMm.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640&from=bu&cs=640x0
// @downloadURL https://update.greasyfork.org/scripts/558098/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/558098/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%2B.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Скрипт разработан ОЗГА 56 - https://vk.com/id838357478

    const STATS_STORAGE_KEY = 'br_zga_thread_stats_v1';

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // ---------- СТИЛИ ----------
    function addGlobalStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    addGlobalStyle(`
        :root {
            --bg-color-1: #374151;
            --bg-color-2: #4b5563;
            --hover-color-1: #1d4ed8;
            --hover-color-2: #2563eb;
            --hover-color-3: #3b82f6;
            --border-color-1: rgba(255, 255, 255, 0.2);
            --border-color-2: #4b5563;
            --hover-border-color: #60a5fa;
            --text-color-1: white;
            --text-color-2: #d1d5db;
            --divider-color: #6b7280;
            --box-shadow-color: rgba(59, 130, 246, 0.4);
            --dialog-bg: #1f2937;
            --dialog-border: #4b5563;
            --dialog-shadow: rgba(0, 0, 0, 0.5);
        }

        @keyframes bg-pan {
            from { background-position: 0% center; }
            to { background-position: -200% center; }
        }

        .persona-btn {
            border: 1px solid var(--border-color-1);
            border-radius: 6px;
            color: var(--text-color-1);
            padding: 6px 12px;
            margin: 3px 5px !important;
            font-weight: 600;
            font-size: 13px;
            text-shadow: none;
            background-size: 200% 200%;
            background-image: linear-gradient(90deg, var(--bg-color-1), var(--bg-color-2), var(--bg-color-1));
            transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            outline: none;
        }

        .persona-btn:hover {
            transform: translateY(-2px);
            color: #fff;
            border-color: var(--hover-border-color);
            background-image: linear-gradient(90deg, var(--hover-color-1), var(--hover-color-2), var(--hover-color-3), var(--hover-color-1));
            box-shadow: 0 4px 15px var(--box-shadow-color);
            ${isMobile ? '' : 'animation: bg-pan 4s linear infinite;'}
        }

        .persona-btn:active {
            transform: translateY(0px) scale(0.98);
            box-shadow: none;
        }

        .select_answer_container .overlay-content {
            background-color: var(--dialog-bg);
            border: 1px solid var(--dialog-border);
            border-radius: 8px;
            box-shadow: 0 10px 30px var(--dialog-shadow);
        }

        .select_answer_container .overlay-title {
            color: var(--text-color-2);
            text-shadow: none;
            font-weight: 600;
        }

        .select_answer {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
            padding: 20px;
        }

        .persona-answer-btn {
            background-color: var(--bg-color-1);
            border: 1px solid var(--dialog-border);
            border-radius: 5px;
            color: var(--text-color-2);
            padding: 8px 10px;
            font-weight: 500;
            font-size: 13px;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
        }

        .persona-answer-btn:hover {
            background-color: var(--bg-color-2);
            border-color: var(--hover-border-color);
            color: #ffffff;
            transform: scale(1.03);
        }

        .persona-answer-divider {
            width: 100%;
            text-align: center;
            color: var(--divider-color);
            font-weight: 600;
            font-size: 1em;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 12px 0 8px 0;
            border-bottom: 1px solid var(--bg-color-1);
            padding-bottom: 8px;
            cursor: default;
        }

        @media (max-width: 768px) {
            .persona-btn {
                padding: 8px 14px;
                font-size: 14px;
                margin: 4px 4px !important;
            }
            .select_answer {
                padding: 12px;
            }
            .persona-answer-btn {
                font-size: 13px;
                padding: 8px 8px;
            }
        }

        .br-zga-stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .br-zga-stats-table td {
            padding: 4px 6px;
            vertical-align: middle;
            color: var(--text-color-2);
            font-size: 13px;
        }

        .br-zga-stats-label {
            font-weight: 600;
        }

        .br-zga-stats-value {
            min-width: 32px;
            text-align: center;
            font-weight: 600;
        }

        .br-zga-stats-btn {
            padding: 0 6px;
            margin: 0 2px;
            border-radius: 4px;
            border: 1px solid var(--border-color-2);
            background: var(--bg-color-1);
            color: var(--text-color-2);
            cursor: pointer;
            font-size: 12px;
        }

        .br-zga-stats-btn:hover {
            border-color: var(--hover-border-color);
        }

        .br-zga-stats-footer {
            margin-top: 10px;
            font-size: 11px;
            color: var(--divider-color);
        }
    `);

    // ---------- КОНСТАНТЫ КНОПОК / ПРЕФИКСОВ ----------
    const PREFIXES = {
        UNACCEPT: 4,
        ACCEPT: 8,
        PIN: 2,
        COMMAND: 10,
        WATCHED: 9,
        CLOSE: 7,
        GA: 12,
        SPECADM: 11,
        DECIDED: 6,
        MAINADM: 12,
        TECHADM: 13,
        CHECKED: 9
    };

    const topImage = `[CENTER][IMG]https://i.postimg.cc/tg2f3qFM/1.png[/IMG][/CENTER]`;
    const bottomImage = `[CENTER][IMG]https://i.postimg.cc/tg2f3qFM/1.png[/IMG][/CENTER]`;
    const wrapTemplate = (content) =>
        `${topImage}\n\n[CENTER][FONT=georgia][SIZE=4]${content}[/SIZE][/FONT][/CENTER]\n\n${bottomImage}`;

    const buttons = [
        { title: `Выше +`, content: `[B][FONT=georgia]Выше +,под фрапс, после р/д[/FONT][/B]\n[IMG]https://i.postimg.cc/8PghxPdW/standard-17.gif[/IMG]` },
        {
            title: "Роспись",
            content: `[CENTER][IMG]https://i.postimg.cc/5tctzDgF/022-EB1-E9-5-C30-402-A-81-D4-08-C349-A08-FFF.gif[/IMG]<br><br>[COLOR=#F40]Зде[/COLOR][COLOR=#F50]сь[/COLOR] [COLOR=#F50]б[/COLOR][COLOR=#F60]ыл[/COLOR] [COLOR=#F60]Т[/COLOR][COLOR=#F70]от[/COLOR] [COLOR=#F70]с[/COLOR][COLOR=#F80]амы[/COLOR][COLOR=#F90]й[/COLOR] [COLOR=#F90]Ра[/COLOR][COLOR=#FA0]сул.[/COLOR] [COLOR=#FB0]Кто[/COLOR] [COLOR=#FC0]зна[/COLOR][COLOR=#FD0]ет[/COLOR] [COLOR=#FD0]-[/COLOR] [COLOR=#FD0]по[/COLOR][COLOR=#FC0]ймёт.[/COLOR] [COLOR=#FC0]Кт[/COLOR][COLOR=#FC1]о[/COLOR] [COLOR=#FC1]н[/COLOR][COLOR=#FB1]е[/COLOR] [COLOR=#FB1]знает[/COLOR] [COLOR=#FB1]—[/COLOR] [COLOR=#FB1]у[/COLOR][COLOR=#FA2]знает.[/COLOR]<br><br>[IMG align="right" width="150px"]https://i.postimg.cc/wjvfKwYC/Rasul-cocosign-2.png[/IMG][/CENTER]`
        },

        { title: 'Отказы по форме и правилам', isDivider: true },
        {
            title: `Не указан VK`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br>Ваше обжалование [COLOR=rgb(255, 0, 0)]отклонено[/COLOR], так как не был указан аккаунт VK.<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.CLOSE,
            status: false
        },
        {
            title: `Жалоба на Администрацию`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Если вы не согласны с выданным наказанием, обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1400/']«Жалобы на Администрацию»[/URL].<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.CLOSE,
            status: false
        },
        {
            title: `Дубликат`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ответ на своё обжалование вы уже получили в предыдущей теме.<br>Напоминаем, при трёх дублированиях форумный аккаунт будет заблокирован.<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.CLOSE,
            status: false
        },
        {
            title: `Технический раздел`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9656-arkhangelsk.2471/']«Жалобы на Технических Специалистов»[/URL].<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.CLOSE,
            status: false
        },
        {
            title: `Ошибка сервера`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Пожалуйста, обратитесь в раздел «Обжалование наказаний» своего сервера.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `От третьего лица`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение составлено от третьего лица и не подлежит рассмотрению.<br>Рекомендую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']правилами подачи[/URL] обжалования.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `Нет скриншота бана`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Для рассмотрения обжалования предоставьте скриншот окна блокировки с сервера.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.CLOSE,
            status: false
        },
        {
            title: `Не по форме`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение составлено не по форме.<br>Создайте новую тему, придерживаясь следующего шаблона:<br>[QUOTE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть заявки:<br>5. Доказательство:[/QUOTE]<br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `Доказательства не приняты`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Доказательства из социальных сетей не принимаются. Вам необходимо загрузить их на сервис [URL='https://imgur.com/']imgur.com[/URL] и создать новую тему.<br><br>Рекомендую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']правилами подачи[/URL] обжалования.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `Нет доказательств`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Вы не предоставили скриншот выдачи наказания от администратора. Обращение не подлежит рассмотрению.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `Неработающая ссылка`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Предоставленная вами ссылка недействительна или не работает. Создайте новую тему и убедитесь, что ссылка открывается корректно.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `Ошибочный раздел`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение не соответствует тематике данного раздела.<br><br>Полезные ссылки:<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1401/']Жалобы на лидеров[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1402/']Жалобы на игроков[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-anapa.1416/']Технический раздел сервера[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1400/']Жалобы на Администрацию[/URL]<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },

        { title: 'Отказы по сути', isDivider: true },
        {
            title: `Не подлежит обжалованию`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>К сожалению, данное наказание не подлежит обжалованию.<br>[COLOR=rgb(255, 0, 0)]Нарушения, по которым заявка не рассматривается:[/COLOR]<br>[QUOTE]4.1. различные формы "слива";<br>4.2. продажа игровой валюты;<br>4.3. махинации;<br>4.4. целенаправленный багоюз;<br>4.5. продажа, передача аккаунта;<br>4.6. сокрытие ошибок, багов системы;<br>4.7. использование стороннего программного обеспечения;<br>4.8. распространение конфиденциальной информации;<br>4.9. обман администрации.[/QUOTE]Рекомендую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']правилами подачи[/URL] обжалования.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `Отказано`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>В обжаловании вашего наказания — [COLOR=red]отказано.[/COLOR] Мы не готовы пойти к вам на встречу.<br><br>Пожалуйста, помните:<br>[QUOTE]• Каждая заявка на обжалование рассматривается индивидуально.<br>• Оформленная заявка не означает гарантированного одобрения со стороны руководства сервера.[/QUOTE]<br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `Обжаловалось ранее`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Вы уже получили шанс на обжалование своего наказания, срок уже был снижен.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `Наказание выдано верно`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Наказание было выдано верно.<br>В обжаловании вашего наказания — [COLOR=red]отказано.[/COLOR] Мы не готовы пойти к вам на встречу.<br><br>Пожалуйста, помните:<br>[QUOTE]• Каждая заявка на обжалование рассматривается индивидуально.<br>• Оформленная заявка не означает гарантированного одобрения со стороны руководства сервера.[/QUOTE]<br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `Минимальное наказание`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Вам уже было выдано минимальное наказание за совершённое нарушение.<br>В обжаловании вашего наказания — [COLOR=red][ICODE]отказано.[/ICODE][/COLOR]`),
            prefix: PREFIXES.UNACCEPT,
            status: false
        },
        {
            title: `Обман`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Данное наказание можно обжаловать только при условии выдачи компенсации пострадавшей стороне. Для этого свяжитесь с обманутым игроком и обсудите условия.<br>[U]Примечание:[/U] обманутый игрок должен подтвердить ваши слова в игре.<br>[COLOR=red]Любые попытки обмана администрации будут наказаны блокировкой форумного аккаунта.[/COLOR]<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`),
            prefix: PREFIXES.CLOSE,
            status: false
        },

        { title: 'Одобрения', isDivider: true },
        {
            title: `Снижено до минимума`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обжалование — [color=lightgreen]одобрено.[/color] Наказание будет снижено до минимальных мер.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.`),
            prefix: PREFIXES.ACCEPT,
            status: false
        },
        {
            title: `Полностью снято`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет полностью снято.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`),
            prefix: PREFIXES.ACCEPT,
            status: false
        },
        {
            title: `Снижено до 7 дней`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 7 дней блокировки аккаунта.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`),
            prefix: PREFIXES.ACCEPT,
            status: false
        },
        {
            title: `Снижено до 15 дней`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 15 дней блокировки аккаунта.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`),
            prefix: PREFIXES.ACCEPT,
            status: false
        },
        {
            title: `Снижено до 30 дней`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 30 дней блокировки аккаунта.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`),
            prefix: PREFIXES.ACCEPT,
            status: false
        },
        {
            title: `Наказание выдано ошибочно`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше наказание было выдано по ошибке администратора и будет снято.<br>С администратором будет проведена профилактическая беседа. Приношу извинения за доставленные неудобства.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`),
            prefix: PREFIXES.ACCEPT,
            status: false
        },

        { title: 'На рассмотрении / Передача', isDivider: true },
        {
            title: `Обман`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваш аккаунт будет разблокирован для выдачи компенсации пострадавшей стороне. Весь процесс необходимо фиксировать на запись экрана с командой /time. У вас есть 24 часа на ответ после совершения сделки.<br>Напоминаю: попытки передачи имущества на другие аккаунты будут строго наказываться, и вы можете лишиться права на обжалование.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
            prefix: PREFIXES.PIN,
            status: true
        },
        {
            title: `На рассмотрении`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение находится на рассмотрении администрации сервера.<br>Просим не создавать дубликаты. Ответ будет дан в этой теме, как только это будет возможно. Благодарим за ожидание.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
            prefix: PREFIXES.PIN,
            status: true
        },
        {
            title: `Нужна ссылка на VK`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение находится на рассмотрении администрации.<br>Пожалуйста, предоставьте ссылку на вашу страницу ВКонтакте.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
            prefix: PREFIXES.PIN,
            status: true
        },
        {
            title: `Передано Спец. Администрации`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение было передано [COLOR=red]Специальной администрации проекта.[/COLOR]<br>Иногда рассмотрение таких обращений занимает больше времени. Настоятельно рекомендуем вам не создавать дубликаты. Ответ будет дан в данной теме, как только это будет возможно.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
            prefix: PREFIXES.SPECADM,
            status: true
        },
        {
            title: `Передано Руководству`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обжалование было передано [COLOR=yellow]Руководству модерации.[/COLOR]<br>Иногда рассмотрение таких обжалований занимает больше времени, чем 3 дня. Настоятельно рекомендуем вам не создавать дубликаты. Ответ будет дан в данной теме, как только это будет возможно.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
            prefix: PREFIXES.COMMAND,
            status: true
        },
        {
            title: `Передано Главному Администратору`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обжалование было передано [COLOR=red]Главному администратору.[/COLOR]<br><br>[COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
            prefix: PREFIXES.GA,
            status: true
        },
        {
            title: `Смена никнейма`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваш аккаунт будет разблокирован на 24 часа. За это время вам необходимо сменить никнейм. Если вы не выполните это условие, аккаунт будет заблокирован без права на амнистию.<br><br>[COLOR=red][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
            prefix: PREFIXES.PIN,
            status: true
        },
        {
            title: `Проверка ППВ`,
            content: wrapTemplate(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Для проверки аккаунта предоставьте следующую информацию:<br>— Город регистрации аккаунта:<br>— Дата регистрации аккаунта:<br>— Сколько донатили на свой аккаунт?<br>— Провайдер интернета при регистрации аккаунта:<br>— Город, в котором проживаете на данный момент:<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`),
            prefix: PREFIXES.PIN,
            status: true
        }
    ];

    const shortcuts = {
        rps: "[CENTER][IMG]https://i.postimg.cc/5tctzDgF/022-EB1-E9-5-C30-402-A-81-D4-08-C349-A08-FFF.gif[/IMG]\n\n[COLOR=#F40] Зде[/COLOR][COLOR=#F50]сь[/COLOR] [COLOR=#F50]б[/COLOR][COLOR=#F60]ыл[/COLOR] [COLOR=#F60]Т[/COLOR][COLOR=#F70]от[/COLOR] [COLOR=#F70]с[/COLOR][COLOR=#F80]амы[/COLOR][COLOR=#F90]й[/COLOR] [COLOR=#F90]Ра[/COLOR][COLOR=#FA0]сул.[/COLOR] [COLOR=#FB0]Кто[/COLOR] [COLOR=#FC0]зна[/COLOR][COLOR=#FD0]ет[/COLOR] [COLOR=#FD0]-[/COLOR] [COLOR=#FD0]по[/COLOR][COLOR=#FC0]ймёт.[/COLOR] [COLOR=#FC0]Кт[/COLOR][COLOR=#FC1]о[/COLOR] [COLOR=#FC1]н[/COLOR][COLOR=#FB1]е[/COLOR] [COLOR=#FB1]знает—[/COLOR] [COLOR=#FB1]у[/COLOR][COLOR=#FA2]знает.[/COLOR]\n\n[IMG align=\"right\" width=\"150px\"]https://i.postimg.cc/wjvfKwYC/Rasul-cocosign-2.png[/IMG][/CENTER]",
        ost: "[B][FONT=book antiqua]Оставил[/FONT][/B]"
    };

    // ---------- СТАТИСТИКА ----------

    function getCurrentPeriod() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        let startDay, endDay;

        // Особый период 6–7, как ты просил
        if (day === 6 || day === 7) {
            startDay = 6;
            endDay = 7;
        } else if (day >= 1 && day <= 5) {
            startDay = 1;
            endDay = 5;
        } else if (day >= 8 && day <= 14) {
            startDay = 8;
            endDay = 14;
        } else if (day >= 15 && day <= 21) {
            startDay = 15;
            endDay = 21;
        } else {
            startDay = 22;
            endDay = new Date(year, month, 0).getDate();
        }

        const pad = (n) => (n < 10 ? '0' + n : '' + n);

        const key = `${year}-${pad(month)}-${pad(startDay)}_${pad(endDay)}`;
        const human = `${pad(startDay)}.${pad(month)}.${year} — ${pad(endDay)}.${pad(month)}.${year}`;

        return { key, human };
    }

    function loadStats() {
        try {
            const raw = localStorage.getItem(STATS_STORAGE_KEY);
            if (!raw) return {};
            const data = JSON.parse(raw);
            return data && typeof data === 'object' ? data : {};
        } catch (e) {
            console.error('Failed to load stats', e);
            return {};
        }
    }

    function saveStats(allStats) {
        try {
            localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(allStats));
        } catch (e) {
            console.error('Failed to save stats', e);
        }
    }

    function getStatsForCurrentPeriod() {
        const period = getCurrentPeriod();
        const allStats = loadStats();

        if (!allStats[period.key]) {
            allStats[period.key] = { total: 0, approved: 0, denied: 0, other: 0 };
            saveStats(allStats);
        }

        return { period, allStats, stats: allStats[period.key] };
    }

    function applyStatsChange(type, delta) {
        const { period, allStats, stats } = getStatsForCurrentPeriod();
        if (!['approved', 'denied', 'other'].includes(type)) return;

        stats[type] = Math.max(0, (stats[type] || 0) + delta);
        stats.total = (stats.approved || 0) + (stats.denied || 0) + (stats.other || 0);

        saveStats(allStats);
        return { period, stats };
    }

    function updateStatsForPrefix(prefix) {
        const { period, allStats, stats } = getStatsForCurrentPeriod();

        stats.total = (stats.total || 0) + 1;

        if (prefix === PREFIXES.ACCEPT) {
            stats.approved = (stats.approved || 0) + 1;
        } else if (prefix === PREFIXES.UNACCEPT || prefix === PREFIXES.CLOSE) {
            stats.denied = (stats.denied || 0) + 1;
        } else {
            stats.other = (stats.other || 0) + 1;
        }

        saveStats(allStats);
        console.log('%c[BR ZGA] обновлена статистика', 'color:#60a5fa', period, stats);
    }

    function renderStatsOverlay() {
        if (typeof XF === 'undefined' || !XF.alert) {
            alert('XF.alert недоступен. Статистика не может быть показана.');
            return;
        }

        const { period, stats } = getStatsForCurrentPeriod();

        const html = `
            <div>
                <div><b>Статистика за период:</b> ${period.human}</div>
                <table class="br-zga-stats-table">
                    <tr>
                        <td class="br-zga-stats-label">Всего тем:</td>
                        <td class="br-zga-stats-value" id="br-zga-total">${stats.total || 0}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="br-zga-stats-label">Одобренных:</td>
                        <td class="br-zga-stats-value" id="br-zga-approved">${stats.approved || 0}</td>
                        <td>
                            <button class="br-zga-stats-btn" id="br-zga-approved-dec">-</button>
                            <button class="br-zga-stats-btn" id="br-zga-approved-inc">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td class="br-zga-stats-label">Отказанных / Закрытых:</td>
                        <td class="br-zga-stats-value" id="br-zga-denied">${stats.denied || 0}</td>
                        <td>
                            <button class="br-zga-stats-btn" id="br-zga-denied-dec">-</button>
                            <button class="br-zga-stats-btn" id="br-zga-denied-inc">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td class="br-zga-stats-label">Прочих статусов:</td>
                        <td class="br-zga-stats-value" id="br-zga-other">${stats.other || 0}</td>
                        <td>
                            <button class="br-zga-stats-btn" id="br-zga-other-dec">-</button>
                            <button class="br-zga-stats-btn" id="br-zga-other-inc">+</button>
                        </td>
                    </tr>
                </table>
                <div class="br-zga-stats-footer">
                    Скрипт разработан ОЗГА 56 — <a href="https://vk.com/id838357478" target="_blank" rel="noopener noreferrer">vk.com/id838357478</a>
                </div>
            </div>
        `;

        XF.alert(html, null, 'Ваша статистика за период', 'br_zga_stats_container');

        const approvedEl = document.getElementById('br-zga-approved');
        const deniedEl = document.getElementById('br-zga-denied');
        const otherEl = document.getElementById('br-zga-other');
        const totalEl = document.getElementById('br-zga-total');

        function refreshDom() {
            const { stats: s } = getStatsForCurrentPeriod();
            if (!approvedEl || !deniedEl || !otherEl || !totalEl) return;
            approvedEl.textContent = s.approved || 0;
            deniedEl.textContent = s.denied || 0;
            otherEl.textContent = s.other || 0;
            totalEl.textContent = s.total || 0;
        }

        const bindings = [
            ['br-zga-approved-dec', 'approved', -1],
            ['br-zga-approved-inc', 'approved', 1],
            ['br-zga-denied-dec', 'denied', -1],
            ['br-zga-denied-inc', 'denied', 1],
            ['br-zga-other-dec', 'other', -1],
            ['br-zga-other-inc', 'other', 1]
        ];

        bindings.forEach(([id, type, delta]) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('click', () => {
                applyStatsChange(type, delta);
                refreshDom();
            });
        });
    }

    // ---------- УВЕДОМЛЕНИЯ ----------
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: 'white',
            backgroundColor: type === 'success' ? '#22c55e' : '#ef4444',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: '99999',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            fontSize: '14px',
            fontWeight: '500'
        });
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ---------- РАБОТА С ТЕМОЙ / КНОПКАМИ ----------

    function addButton(name, id) {
        const replyBtn = document.querySelector('.button--icon--reply');
        if (!replyBtn || !replyBtn.parentNode) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'button rippleButton persona-btn';
        btn.id = id;
        btn.textContent = name;
        replyBtn.parentNode.insertBefore(btn, replyBtn);
    }

    function buttonsMarkup(buttonsArr) {
        return `<div class="select_answer">${buttonsArr.map((btn, i) =>
            btn.isDivider
                ? `<div class="persona-answer-divider">${btn.title}</div>`
                : `<button id="answers-${i}" class="persona-answer-btn"><span class="button-text">${btn.title}</span></button>`
        ).join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const btn = buttons[id];
        if (!btn || !btn.content) {
            console.error('Button content not found');
            return;
        }

        if (typeof Handlebars === 'undefined') {
            console.warn('Handlebars not loaded yet, retrying...');
            setTimeout(() => pasteContent(id, data, send), 150);
            return;
        }

        try {
            const compiled = Handlebars.compile(btn.content);
            const editorElement = window.jQuery ? window.jQuery('.fr-element.fr-view') : null;
            if (!editorElement || !editorElement.length) {
                showNotification('Редактор сообщения не найден.', 'error');
                return;
            }
            editorElement.html(compiled(data));

            if (send) {
                if (btn.prefix) {
                    editThreadData(btn.prefix, btn.status);
                }
                setTimeout(() => {
                    window.jQuery('.button--icon.button--icon--reply.rippleButton').trigger('click');
                }, 250);
            }
        } catch (e) {
            console.error('Error pasting content', e);
            showNotification('Произошла ошибка при вставке контента.', 'error');
        }
    }

    async function getThreadData() {
        const $ = window.jQuery;
        const authorLink = $ ? $('a.username').first() : null;
        if (!authorLink || !authorLink.length) {
            throw new Error('Author link not found');
        }
        const authorID = authorLink.attr('data-user-id');
        const authorName = authorLink.text().trim();
        const hours = new Date().getHours();
        const greeting =
            hours >= 5 && hours <= 11 ? 'Доброе утро' :
                hours >= 12 && hours <= 17 ? 'Добрый день' :
                    hours >= 18 && hours <= 22 ? 'Добрый вечер' :
                        'Доброй ночи';

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`
            },
            greeting
        };
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.keys(data).forEach((k) => formData.append(k, data[k]));
        return formData;
    }

    function editThreadData(prefix, pin = false) {
        if (typeof XF === 'undefined' || !XF.config) {
            showNotification('XF недоступен. Вы не на странице темы?', 'error');
            return;
        }

        const titleEl = document.querySelector('.p-title-value');
        const threadTitle = titleEl && titleEl.lastChild
            ? titleEl.lastChild.textContent.trim()
            : null;
        if (!threadTitle) {
            showNotification('Название темы не найдено.', 'error');
            return;
        }

        const fullBase = XF.config.url && XF.config.url.fullBase ? XF.config.url.fullBase : '';
        let requestUri = document.location.pathname + document.location.search;
        if (fullBase && document.URL.indexOf(fullBase) === 0) {
            requestUri = document.URL.substring(fullBase.length);
        }

        const bodyData = {
            prefix_id: prefix,
            title: threadTitle,
            _xfToken: XF.config.csrf,
            _xfRequestUri: requestUri,
            _xfWithData: 1,
            _xfResponseType: 'json'
        };
        if (pin) bodyData.sticky = 1;

        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData(bodyData)
        })
            .then((r) => {
                if (!r.ok) throw new Error('Network error');
                return r.json();
            })
            .then((data) => {
                if (data.status === 'ok') {
                    // Обновляем статистику
                    updateStatsForPrefix(prefix);
                    showNotification('Статус темы успешно изменен!', 'success');
                    setTimeout(() => location.reload(), 1500);
                } else {
                    showNotification('Произошла ошибка при изменении темы.', 'error');
                }
            })
            .catch((e) => {
                console.error('Fetch error', e);
                showNotification('Сетевая ошибка или ошибка API.', 'error');
            });
    }

    // ---------- ИНИЦИАЛИЗАЦИЯ ----------

    function init() {
        const $ = window.jQuery;
        if (!$ || typeof XF === 'undefined') {
            setTimeout(init, 100);
            return;
        }

        // Подключаем Handlebars
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Кнопки
        addButton('Ответы', 'selectAnswer');
        addButton('Закрепить', 'pin');
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('КП', 'teamProject');
        addButton('Закрыть', 'closed');
        addButton('Спец.А', 'specialAdmin');
        addButton('Проверено', 'checked');
        addButton('Статистика', 'stats');

        // Обработчики кнопок префиксов
        $('#unaccept').on('click', () => editThreadData(PREFIXES.UNACCEPT, false));
        $('#pin').on('click', () => editThreadData(PREFIXES.PIN, true));
        $('#accepted').on('click', () => editThreadData(PREFIXES.ACCEPT, false));
        $('#teamProject').on('click', () => editThreadData(PREFIXES.COMMAND, true));
        $('#specialAdmin').on('click', () => editThreadData(PREFIXES.SPECADM, true));
        $('#checked').on('click', () => editThreadData(PREFIXES.CHECKED, false));
        $('#closed').on('click', () => editThreadData(PREFIXES.CLOSE, false));
        $('#stats').on('click', () => renderStatsOverlay());

        // Выбор ответа
        $('#selectAnswer').on('click', async () => {
            try {
                const data = await getThreadData();
                if (typeof XF === 'undefined' || !XF.alert) {
                    alert('Невозможно открыть список ответов (XF.alert недоступен).');
                    return;
                }
                XF.alert(buttonsMarkup(buttons), null, 'Выберите готовый ответ:', 'select_answer_container');
                buttons.forEach((btn, id) => {
                    if (btn.isDivider) return;
                    $(`button#answers-${id}`).on('click', () => {
                        pasteContent(id, data, true);
                        $('a.overlay-titleCloser').trigger('click');
                    });
                });
            } catch (e) {
                console.error('Error getThreadData', e);
                showNotification('Произошла ошибка при получении данных темы.', 'error');
            }
        });

        // Горячие клавиши (Alt+R, Alt+O)
        $(document).on('keydown', (e) => {
            if (!e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
            const key = e.key.toLowerCase();
            let shortcutKey = null;
            if (key === 'r') shortcutKey = 'rps';
            if (key === 'o') shortcutKey = 'ost';
            if (!shortcutKey) return;

            const editorElement = $('.fr-element.fr-view');
            const contentToPaste = shortcuts[shortcutKey];
            if (editorElement.length && contentToPaste) {
                e.preventDefault();
                editorElement.html(contentToPaste);
            }
        });

        console.log('%c[BR ZGA+] скрипт загружен. Мобильный:', 'color:#22c55e', isMobile);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
