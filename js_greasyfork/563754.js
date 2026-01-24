// ==UserScript==
// @name         AQUA Management 3.1 (AI Button Fix + New ZGA)
// @namespace    https://forum.blackrussia.online
// @version      3.1
// @description  Исправлена кнопка отправки в AI + Smart Media + Chrono
// @author       velikok (Refactored by AI)
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563754/AQUA%20Management%2031%20%28AI%20Button%20Fix%20%2B%20New%20ZGA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563754/AQUA%20Management%2031%20%28AI%20Button%20Fix%20%2B%20New%20ZGA%29.meta.js
// ==/UserScript==

(async function () {
    `use strict`;

    // =================================================================================
    // 🔧 НАСТРОЙКИ
    // =================================================================================
    const CONFIG = {
        names: {
            GA: "Artem_Rooall",
            ZGA: "Toshiro_Forester", // Обновлено
            OZGA: "Andrey_Kawai"
        },
        links: {
            rules_adm: "https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/",
            rules_appeal: "https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/",
            appeal_section: "https://forum.blackrussia.online/forums/Обжалование-наказаний.845"
        },
        prefixes: {
            UNACCEPT: 4, ACCEPT: 8, PIN: 2, COMMAND: 10, WATCHED: 9,
            CLOSE: 7, SPECIAL: 11, GA: 12, TECH: 13, WAIT: 14
        },
        urgency: {
            hours: 48,
            ignore_closed: true
        }
    };

    // =================================================================================
    // 🤖 AI ЛОГИКА
    // =================================================================================
    const AI_RULES = {
        socialBlacklist: ['vk.com', 'vk.me', 'instagram.com', 'tiktok.com', 'vm.tiktok.com'],
        videoHosts: ['youtube.com', 'youtu.be', 'rutube.ru', 'streamable.com', 'vimeo.com'],
        imageHosts: ['imgur.com', 'yapx.ru', 'ibb.co', 'postimg.cc', 'imgbb.com'],
        nickPattern: /\b[A-Z][a-zA-Z]+[_\s]+[A-Z][a-zA-Z]+\b/g,
        datePattern: /\b(\d{1,2})\.(\d{1,2})\.(\d{4}|\d{2})\b/g,
        timecodePattern: /(\d{1,2}:\d{2}|таймкод|время|timecode)/i
    };

    function runAiAnalysis() {
        const postBody = $('.message-userContent').first();
        const text = postBody.text();
        const html = postBody.html();

        let report = {
            structure: { status: true, msg: "Ники найдены" },
            links: { status: true, msg: "Чисто", action: null },
            mediaType: { status: true, msg: "Не определено" },
            date: { status: true, msg: "Дата свежая", action: null },
            toxic: { status: true, msg: "Адекватно" }
        };

        // 1. Структура
        const nicks = text.match(AI_RULES.nickPattern) || [];
        if (nicks.length < 2) {
            report.structure = { status: false, msg: "⚠️ Не вижу 2 ника" };
        } else if (text.length < 50) {
            report.structure = { status: false, msg: "⚠️ Мало текста" };
        }

        // 2. Ссылки
        let foundSocial = false;
        AI_RULES.socialBlacklist.forEach(domain => {
            if (html.includes(domain)) {
                foundSocial = true;
                report.links = { status: false, msg: `🔴 Ссылка: ${domain}`, action: 'social' };
            }
        });

        // 3. Медиа
        let hasDefiniteVideo = false;
        let hasImageHost = false;
        AI_RULES.videoHosts.forEach(host => { if (html.includes(host)) hasDefiniteVideo = true; });
        AI_RULES.imageHosts.forEach(host => { if (html.includes(host)) hasImageHost = true; });

        if (hasDefiniteVideo) {
            if (!AI_RULES.timecodePattern.test(text)) {
                report.mediaType = { status: false, msg: "📹 Видео: НЕТ таймкодов!" };
            } else {
                report.mediaType = { status: true, msg: "📹 Видео: Таймкоды есть" };
            }
        } else if (hasImageHost) {
            report.mediaType = { status: true, msg: "📸 Фото/Видео (Imgur)" };
        } else if (!foundSocial) {
             if (!html.includes('http')) {
                 report.links = { status: false, msg: "🔴 Нет доказательств", action: 'no_proof' };
                 report.mediaType = { status: false, msg: "❌ Пусто" };
             }
        }

        // 4. Дата
        const foundDates = [];
        let match;
        AI_RULES.datePattern.lastIndex = 0;
        while ((match = AI_RULES.datePattern.exec(text)) !== null) {
            const day = parseInt(match[1]);
            const month = parseInt(match[2]) - 1;
            let year = parseInt(match[3]);
            if (year < 100) year += 2000;
            foundDates.push(new Date(year, month, day));
        }

        if (foundDates.length > 0) {
            const now = new Date();
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(now.getDate() - 3);
            const hasExpiredDate = foundDates.some(d => d < threeDaysAgo);

            if (hasExpiredDate) {
                report.date = { status: false, msg: "🔴 Срок истек (>3 дней)!", action: 'expired' };
            } else {
                report.date = { status: true, msg: "✅ Сроки соблюдены" };
            }
        } else {
            report.date = { status: true, msg: "⚠️ Дат не найдено" };
        }

        // 5. Токсик
        const cleanText = text.replace(/[^a-zA-Zа-яА-Я]/g, "");
        const upperCount = cleanText.replace(/[^A-ZА-Я]/g, "").length;
        if (cleanText.length > 20 && (upperCount / cleanText.length) > 0.6) {
            report.toxic = { status: false, msg: "🔴 CAPSLOCK" };
        }

        showAiResult(report);
    }

    function showAiResult(data) {
        $('#aquaAiPanel').remove();

        const getIcon = (status) => status ? '✅' : '❗';
        const getColor = (status) => status ? '#4caf50' : '#ff5252';

        let advice = "Внимательно проверь жалобу.";
        let autoBtnHtml = "";
        let targetGroup = null;
        let targetItem = null;

        // ЛОГИКА ВЫБОРА КНОПКИ
        // Индексы берутся из массива BUTTONS_GROUPS ниже
        if (data.date.action === 'expired') {
            advice = "💡 Срок истек. Отказывай.";
            autoBtnHtml = "Вставить 'Истек срок'";
            targetGroup = 1; targetItem = 8; // Группа 1 (Отказы), Пункт 8 (Прошло 48 часов)
        } else if (data.links.action === 'social') {
            advice = "💡 Ссылка на соцсеть. Отказ.";
            autoBtnHtml = "Вставить 'Отказ (Соц.сети)'";
            targetGroup = 1; targetItem = 6;
        } else if (data.links.action === 'no_proof') {
            advice = "💡 Нет доказательств. Отказывай.";
            autoBtnHtml = "Вставить 'Нет док-в'";
            targetGroup = 1; targetItem = 0;
        }

        const btnElement = autoBtnHtml
            ? `<button id="aquaAiActionBtn" class="aqua-ai-btn">${autoBtnHtml}</button>`
            : "";

        const panelHtml = `
        <div id="aquaAiPanel" class="aqua-ai-overlay">
            <div class="aqua-ai-card">
                <div class="aqua-ai-header">
                    <span>🤖 AQUA AI v3.1</span>
                    <span class="aqua-ai-close" id="aquaAiClose">×</span>
                </div>
                <div class="aqua-ai-content">
                    <div class="aqua-ai-row" style="color:${getColor(data.structure.status)}">
                        ${getIcon(data.structure.status)} <b>Форма:</b> ${data.structure.msg}
                    </div>
                    <div class="aqua-ai-row" style="color:${getColor(data.date.status)}">
                        ${getIcon(data.date.status)} <b>Сроки:</b> ${data.date.msg}
                    </div>
                    <div class="aqua-ai-row" style="color:${getColor(data.links.status)}">
                        ${getIcon(data.links.status)} <b>Ссылки:</b> ${data.links.msg}
                    </div>
                    <div class="aqua-ai-row" style="color:${getColor(data.mediaType.status)}">
                        ${getIcon(data.mediaType.status)} <b>Медиа:</b> ${data.mediaType.msg}
                    </div>
                    <div class="aqua-ai-row" style="color:${getColor(data.toxic.status)}">
                        ${getIcon(data.toxic.status)} <b>Текст:</b> ${data.toxic.msg}
                    </div>
                    <div class="aqua-ai-advice">${advice}</div>
                    ${btnElement}
                </div>
            </div>
        </div>`;

        $('body').append(panelHtml);

        // ПРИВЯЗКА СОБЫТИЙ (FIX)
        $('#aquaAiClose').click(() => $('#aquaAiPanel').remove());

        if (targetGroup !== null) {
            $('#aquaAiActionBtn').click(async () => {
                const action = BUTTONS_GROUPS[targetGroup].items[targetItem];
                await handleAction(action);
                $('#aquaAiPanel').remove();
            });
        }
    }

    // =================================================================================
    // 📦 БАЗА ОТВЕТОВ
    // =================================================================================
    const BUTTONS_GROUPS = [
        {
            title: "⚖️ Жалобы на Администрацию",
            items: [
                {
                    title: "На рассмотрении",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба находится на рассмотрении у руководства сервера.[/CENTER]<br>` +
                        `[CENTER]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/CENTER]<br><br>` +
                        `[CENTER][COLOR={{color.orange}}]На рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
                    prefix: CONFIG.prefixes.PIN,
                    status: true
                },
                {
                    title: "Запрос опры",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE]<br><br>` +
                        `[SIZE=4][FONT=georgia]Запросил доказательства у администратора.<br>` +
                        `Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>` +
                        `[COLOR={{color.deepOrange}}]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.PIN,
                    status: true
                },
                {
                    title: "Есть опра (Верно)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER][SIZE=4][FONT=georgia]Администратор предоставил доказательства.[/CENTER]<br>` +
                        `[CENTER]Наказание выдано верно.[/CENTER]<br><br>` +
                        `[CENTER][COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "Беседа с адм",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>` +
                        `[CENTER][COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.ACCEPT,
                    status: false
                },
                {
                    title: "Наказание по ошибке",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER]В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке. Так же с ним будет проведена профилактическая беседа.<br>` +
                        `Ваше наказание будет снято в течении часа, если оно еще не снято.[/CENTER]<br><br>` +
                        `[CENTER][COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.ACCEPT,
                    status: false
                },
                {
                    title: "Адм ПСЖ/СНЯТ",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>`+
                             `[CENTER] Администратор был снят/ушел по собственному желанию.<br>`+
                             `[CENTER] Ваше наказание будет снято.<br><br>`+
                             `[CENTER][COLOR={{color.green}}]Рассмотрено.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.WATCHED,
                    status: false
                }
            ]
        },
        {
            title: "⛔ Отказы и Причины",
            items: [
                {
                    title: "Нет док-в",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE]<br><br>` +
                        `[SIZE=4][FONT=georgia]Не увидел доказательств, которые подтверждают нарушение администратора.<br>` +
                        `Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br><br>` +
                        `[COLOR={{color.red}}]Закрыто.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "Мало док-в",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>`+
                             `[CENTER][SIZE=4][FONT=georgia]Недостаточно доказательств, которые подтверждают нарушение администратора.<br><br>`+
                             `[COLOR={{color.red}}]Отказано.[/COLOR][/CENTER]<br><br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "Док-ва не работают",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>`+
                             `[CENTER][SIZE=4][FONT=georgia]Доказательства, которые вы предоставили, не работают.<br><br>`+
                             `[COLOR={{color.red}}]Отказано.[/COLOR][/CENTER]<br><br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "Нарушений нет",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>`+
                             `[CENTER][SIZE=4][FONT=georgia]Исходя из выше приложенных доказательств нарушений со стороны администратора я не увидел!<br><br>`+
                             `[COLOR={{color.red}}]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "Жалоба не по форме",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER]Жалоба составлена не по форме.<br>` +
                        `Внимательно прочитайте правила составления жалобы - [URL='${CONFIG.links.rules_adm}']*ТЫК*[/URL]<br><br>` +
                        `[CENTER][COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                },
                {
                    title: "Окно бана",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>`+
                             `[SIZE=4][FONT=georgia][CENTER]Зайдите в игру и сделайте скриншот окна с баном, после чего заново напишите жалобу.<br><br>`+
                             `[COLOR={{color.red}}]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "Соц. сети (Отказ)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>` +
                        `Пожалуйста внимательно прочитайте тему «[URL='${CONFIG.links.rules_adm}']Правила подачи жалоб на администрацию[/URL][B]»[/B]<br><br>` +
                        `И обратите своё внимание, на данный пункт правил:[/SIZE][/CENTER][/FONT]` +
                        `[QUOTE][CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]3.6. [/COLOR]Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/CENTER][/QUOTE]` +
                        `[CENTER][COLOR={{color.red}}]Отказано.[/COLOR][/CENTER]`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "От 3-го лица",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER]Жалоба создана от третьего лица.[/CENTER]<br>` +
                        `[CENTER]Жалоба не подлежит рассмотрению.<br><br>` +
                        `[COLOR={{color.red}}]Отказано.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: true
                },
                {
                    title: "Прошло 48 часов",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER][SIZE=4][FONT=georgia]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br>` +
                        `[CENTER]Обратитесь в раздел обжалований: [URL='${CONFIG.links.appeal_section}']*ТЫК*[/URL]![/CENTER]<br><br>` +
                        `[CENTER][COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "Ban IP (Айпи)",
                    content: `[CENTER][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR]{{user.mention}}<br><br>`+
                             `[CENTER]Дело в вашем айпи адресе. <br>` +
                             `Попробуйте сменить его на старый с которого вы играли раньше.<br>Смените интернет соединение или же попробуйте использовать впн.<br>` +
                             `Ваш аккаунт не в блокировке<br><br>` +
                             `[CENTER][COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                },
                {
                    title: "Бред в жалобе",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>`+
                             `[CENTER]Жалоба бредовая и не содержит в себе смысла.<br>` +
                             `Рассмотрению не подлежит.<br><br>` +
                             `[CENTER][COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                },
                {
                    title: "Дублирование",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>`+
                             `Напоминаю, за дублирование тем я могу заблокировать ваш форумный аккаунт.<br>`+
                             `Пожалуйста не создавайте повторяющиеся темы.[/CENTER]<br><br>`+
                             `[CENTER][COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER][/SIZE][/FONT]<br>`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                }
            ]
        },
        {
            title: "📨 Обжалования наказаний",
            items: [
                {
                    title: "На рассмотрении (Обж)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>` +
                        `Ваше обжалование на рассмотрении, ожидайте ответа от руководства сервера<br><br>` +
                        `[COLOR={{color.deepOrange}}]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]`,
                    prefix: CONFIG.prefixes.PIN,
                    status: true
                },
                {
                    title: "Одобрить (Сократить)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>` +
                        `Ваше обжалование рассмотрено и принято решение о сокращении вашего наказания.<br><br>[/CENTER]` +
                        `[CENTER][COLOR={{color.green}}]Одобрено.[/COLOR][/CENTER][/FONT][/SIZE]`,
                    prefix: CONFIG.prefixes.ACCEPT,
                    status: false
                },
                {
                    title: "Отказать (Обж)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>` +
                        `Ваше обжалование рассмотрено и принято решение об отказе в обжаловании.<br><br>[/CENTER]` +
                        `[CENTER][COLOR={{color.red}}]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                },
                {
                    title: "Возмещение ущерба",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>`+
                             `Если вы готовы возместить ущерб обманутой стороне свяжитесь с игроком в любым способом.<br>`+
                             `Для возврата имущества он должен оформить обжалование.<br><br>`+
                             `[COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                },
                {
                    title: "Смена ника (Разбан)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>`+
                             `[FONT=georgia][SIZE=4]Разблокировал ваш игровой аккаунт.<br>`+
                             `У Вас есть 24 часа, чтобы сменить игровой никнейм.[/SIZE][/FONT]<br><br>`+
                             `[SIZE=4][FONT=georgia][COLOR={{color.deepOrange}}]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]`,
                    prefix: CONFIG.prefixes.PIN,
                    status: true
                },
                {
                    title: "Не по форме (Обж)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>` +
                        `Обжалование составлено не по форме, ознакомьтесь с правилой подачи обжалований и создайте новую тему.[/CENTER]<br><br>` +
                        `[CENTER][COLOR={{color.red}}]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                },
                {
                    title: "Дублирование (Обж)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>`+
                             `Напоминаю, за дублирование тем я могу заблокировать ваш форумный аккаунт.<br>`+
                             `Пожалуйста не создавайте повторяющиеся темы.[/CENTER]<br><br>`+
                             `[CENTER][COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER][/SIZE][/FONT]<br>`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                },
                {
                    title: "Нет ссылки на ВК",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>Пожалуйста внимательно прочитайте тему «[URL='${CONFIG.links.rules_appeal}']Правила подачи заявки на обжалование наказания[/URL][B]»[/B]<br>И обратите своё внимание, на данный пункт правил:[/FONT][/SIZE][/CENTER]<br>` +
                        `[QUOTE]` +
                        `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]3.3. [/COLOR]Прикрепите ссылку на вашу страницу VK.[/SIZE][/CENTER]` +
                        `[/QUOTE]<br>` +
                        `[CENTER][COLOR={{color.red}}]Отказано.[/COLOR][/CENTER]`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                },
                {
                    title: "Соц. сети (Обж)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>Пожалуйста внимательно прочитайте тему «[URL='${CONFIG.links.rules_appeal}']Правила подачи заявки на обжалование наказания[/URL][B]»[/B]<br>И обратите своё внимание, на данный пункт правил:[/FONT][/SIZE][/CENTER]<br>`+
                             `[QUOTE]`+
                             `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]3.3. [/COLOR]Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/CENTER]`+
                             `[/QUOTE]<br>`+
                             `[CENTER][COLOR={{color.red}}]Отказано.[/COLOR][/CENTER]`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                },
                {
                    title: "Не подлежит обж",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}<br><br>Пожалуйста внимательно прочитайте тему «[URL='${CONFIG.links.rules_appeal}']Правила подачи заявки на обжалование наказания[/URL][B]»[/B]<br>И обратите своё внимание, на данный пункт правил:[/FONT][/SIZE][/CENTER]<br>`+
                             `[QUOTE]`+
                             `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]3.3. [/COLOR]Данное наказание не подлежит обжалованию.[/SIZE][/CENTER]`+
                             `[/QUOTE]<br>`+
                             `[CENTER][COLOR={{color.red}}]Отказано.[/COLOR][/CENTER]`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                }
            ]
        },
        {
            title: "🔃 Переадресации",
            items: [
                {
                    title: "ЖБ на Теха (ПЕРЕНОС)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER] Ошиблись разделом!<br>` +
                        `[CENTER] Переношу вашу тему в раздел жалоб на технических специалистов!<br><br>` +
                        `[CENTER][COLOR={{color.red}}]В ожидании[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.WAIT,
                    status: false,
                    move_to_tech: true
                },
                {
                    title: "В ЖБ на адм",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на администрацию.<br><br>` +
                        `[CENTER][COLOR={{color.red}}]Отказано.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "В ЖБ на игроков",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на игроков.<br><br>` +
                        `[CENTER][COLOR={{color.red}}]Отказано.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "В ЖБ на ЛД",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>`+
                             `[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на лидеров<br><br>` +
                             `[CENTER][COLOR={{color.red}}]Закрыто.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.CLOSE,
                    status: false
                },
                {
                    title: "В Обжалования",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>`+
                             `[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел обжалование наказаниЙ.<br><br>` +
                             `[CENTER][COLOR={{color.red}}]Отказано.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "Не туда написана",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>`+
                             `[CENTER][SIZE=4][FONT=georgia]Пожалуйста, убедительная просьба ознакомится с назначением данного раздела в котором вы создали тему.<br>`+
                             `Ваш запрос никоим образом не относится к предназначению данного раздела.<br><br>`+
                             `[COLOR={{color.red}}]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
                    prefix: CONFIG.prefixes.UNACCEPT,
                    status: false
                },
                {
                    title: "Ошиблись сервером",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER][SIZE=4][FONT=georgia]Вы ошиблись сервером, переношу ваше обращение в нужный раздел.<br><br>` +
                        `[COLOR={{color.red}}]Ожидайте вердикта администрации.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
                    prefix: null,
                    status: false
                }
            ]
        },
        {
            title: "⚡ Передачи жалоб",
            items: [
                {
                    title: "Для ЗГА (Velikok)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER]Передаю вашу жалобу Заместителю Главного Администратора — [user=208737]${CONFIG.names.ZGA}[/user]<br><br>` +
                        `[COLOR={{color.deepOrange}}]На рассмотрении.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.GA,
                    status: true
                },
                {
                    title: "Для ОЗГА (Kawai)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER]Передаю вашу жалобу Заместителю Главного Администратора — [user=418913]${CONFIG.names.OZGA}[/user]<br><br>` +
                        `[COLOR={{color.deepOrange}}]На рассмотрении.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.GA,
                    status: true
                },
                {
                    title: "Для ГА (Artem)",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER]Передаю вашу жалобу Главному Администратору — [user=1349399]${CONFIG.names.GA}[/user]. <br><br>` +
                        `[COLOR={{color.deepOrange}}]На рассмотрении.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.GA,
                    status: true
                },
                {
                    title: "Обж для ГА",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>`+
                             `[CENTER]Передаю ваше обжалование Главному Администратору —  [user=1349399]${CONFIG.names.GA}[/user]. <br><br>`+
                             `[COLOR={{color.deepOrange}}]На рассмотрении.[/COLOR][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.GA,
                    status: true
                },
                {
                    title: "Для Спец. АДМ",
                    content: `[CENTER][SIZE=4][FONT=georgia][COLOR={{color.red}}]{{greeting}}, уважаемый(-ая)[/COLOR] {{user.mention}}[/FONT][/SIZE][/CENTER]<br><br>` +
                        `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба передана - Специальной Администрации.<br><br>` +
                        `[COLOR={{color.deepOrange}}]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
                    prefix: CONFIG.prefixes.SPECIAL,
                    status: true
                }
            ]
        }
    ];

    // =================================================================================
    // 🎨 ЦВЕТОВЫЕ ПАЛИТРЫ
    // =================================================================================
    const PALETTES = {
        day: { name: '☀️ Day', red: 'rgb(255, 0, 0)', orange: 'rgb(250, 197, 28)', deepOrange: 'rgb(251, 160, 38)', green: 'rgb(0, 255, 0)' },
        night: { name: '🌙 Night', red: 'rgb(255, 110, 110)', orange: 'rgb(245, 215, 110)', deepOrange: 'rgb(235, 165, 80)', green: 'rgb(130, 235, 130)' }
    };

    function getCurrentPalette() {
        const hour = new Date().getHours();
        return (hour >= 20 || hour < 7) ? PALETTES.night : PALETTES.day;
    }

    // =================================================================================
    // 🎨 CSS СТИЛИ
    // =================================================================================
    const STYLES = `
    <style>
        .aqua-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
        .aqua-panel { background: #222; width: 900px; max-height: 85vh; border-radius: 12px; border: 1px solid #444; box-shadow: 0 0 25px rgba(0,198,255,0.15); display: flex; flex-direction: column; overflow: hidden; font-family: 'Segoe UI', Roboto, sans-serif; animation: aquaFadeIn 0.2s ease; }
        @keyframes aquaFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes blinkRed { 0% { color: #fff; text-shadow: none; } 50% { color: #ff3333; text-shadow: 0 0 10px #ff0000; } 100% { color: #fff; text-shadow: none; } }
        .aqua-expired-title { animation: blinkRed 2s infinite ease-in-out; }
        .aqua-expired-badge { background: #ff0000; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-right: 8px; vertical-align: middle; box-shadow: 0 0 10px rgba(255,0,0,0.5); }
        .aqua-header { padding: 15px 20px; background: #1a1a1a; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .aqua-title { font-size: 18px; color: #00c6ff; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .aqua-close { cursor: pointer; color: #888; font-size: 24px; transition: 0.2s; }
        .aqua-close:hover { color: #fff; }
        .aqua-body { padding: 20px; overflow-y: auto; color: #eee; scrollbar-width: thin; scrollbar-color: #444 #222; }
        .aqua-body::-webkit-scrollbar { width: 8px; }
        .aqua-body::-webkit-scrollbar-track { background: #222; }
        .aqua-body::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
        .aqua-search-container { position: sticky; top: 0; background: #222; z-index: 10; padding-bottom: 15px; }
        .aqua-search { width: 100%; padding: 12px 15px; background: #2d2d2d; border: 1px solid #444; color: white; border-radius: 8px; box-sizing: border-box; font-size: 14px; transition: 0.2s; outline: none; }
        .aqua-search:focus { border-color: #00c6ff; box-shadow: 0 0 0 2px rgba(0, 198, 255, 0.1); }
        .aqua-category { margin-bottom: 25px; }
        .aqua-cat-title { font-size: 13px; text-transform: uppercase; color: #666; margin-bottom: 10px; font-weight: 700; letter-spacing: 0.5px; border-bottom: 1px solid #333; padding-bottom: 5px; }
        .aqua-buttons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .aqua-btn { background: #2d2d2d; border: 1px solid #3a3a3a; padding: 12px 10px; border-radius: 6px; cursor: pointer; text-align: center; transition: all 0.2s ease; font-size: 13px; color: #ccc; user-select: none; }
        .aqua-btn:hover { background: #363636; color: #fff; border-color: #00c6ff; transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .aqua-btn:active { transform: translateY(0); }
        .aqua-main-btn { margin: 3px; background: #1e2a33; color: #00c6ff; border: 1px solid rgba(0, 198, 255, 0.3); font-weight: 600; }
        .aqua-main-btn:hover { background: #00c6ff; color: #000; }

        /* AI BUTTON STYLES */
        .aqua-ai-btn-main { margin: 3px; background: #372044; color: #d670ff; border: 1px solid rgba(214, 112, 255, 0.3); font-weight: 600; }
        .aqua-ai-btn-main:hover { background: #d670ff; color: #000; }
        .aqua-ai-overlay { position: fixed; top: 20%; right: 20px; width: 300px; z-index: 10000; font-family: 'Segoe UI', sans-serif; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .aqua-ai-card { background: #1e1e1e; border: 1px solid #444; border-radius: 8px; box-shadow: 0 5px 25px rgba(0,0,0,0.5); overflow: hidden; }
        .aqua-ai-header { background: linear-gradient(90deg, #372044, #552b6b); padding: 12px 15px; color: #fff; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .aqua-ai-close { cursor: pointer; font-size: 20px; }
        .aqua-ai-content { padding: 15px; font-size: 13px; color: #eee; }
        .aqua-ai-row { margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 5px; }
        .aqua-ai-advice { margin-top: 15px; padding: 10px; background: #2d2d2d; border-left: 3px solid #d670ff; border-radius: 4px; color: #ccc; }
        .aqua-ai-btn { width: 100%; margin-top: 10px; padding: 8px; background: #d670ff; color: #000; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
        .aqua-ai-btn:hover { opacity: 0.9; }
    </style>
    `;

    // =================================================================================
    // 🚀 ИНИЦИАЛИЗАЦИЯ
    // =================================================================================
    $(document).ready(() => {
        $('body').append(STYLES);
        addMenuButton();
        addAiButton();

        addQuickButton('Закрыть', CONFIG.prefixes.CLOSE, false);
        addQuickButton('Одобрено', CONFIG.prefixes.ACCEPT, false);
        addQuickButton('Отказано', CONFIG.prefixes.UNACCEPT, false);
        addQuickButton('Рассмотрение', CONFIG.prefixes.PIN, true);

        checkUrgency();
    });

    // =================================================================================
    // ⚡ ФУНКЦИЯ ПРОВЕРКИ СРОКА (Внутри темы)
    // =================================================================================
    function checkUrgency() {
        const dateElement = $('.p-description .u-dt').first();
        if (!dateElement.length) return;

        const threadTime = new Date(dateElement.attr('datetime')).getTime();
        const now = new Date().getTime();
        const diffHours = (now - threadTime) / (1000 * 60 * 60);

        const prefixElement = $('.p-title-value .label').text().toLowerCase();
        const isClosed = prefixElement.includes('закрыт') || prefixElement.includes('отказано') || prefixElement.includes('одобрено');

        if (CONFIG.urgency.ignore_closed && isClosed) return;

        if (diffHours > CONFIG.urgency.hours) {
            const titleElement = $('.p-title-value');
            titleElement.addClass('aqua-expired-title');
            titleElement.prepend('<span class="aqua-expired-badge">[СРОК]</span>');
        }
    }

    // =================================================================================
    // ⚙️ ИНТЕРФЕЙС
    // =================================================================================
    function addMenuButton() {
        const btn = $(`<button type="button" class="button rippleButton aqua-main-btn">🦅 AQUA MENU</button>`);
        btn.click((e) => {
            e.preventDefault();
            openMenu();
        });
        $('.button--icon--reply').before(btn);
    }

    function addAiButton() {
        const btn = $(`<button type="button" class="button rippleButton aqua-ai-btn-main">🤖 AI</button>`);
        btn.click((e) => {
            e.preventDefault();
            runAiAnalysis();
        });
        $('.button--icon--reply').before(btn);
    }

    function addQuickButton(name, prefix, pin) {
        const btn = $(`<button type="button" class="button rippleButton" style="margin: 3px; font-size: 12px;">${name}</button>`);
        btn.click((e) => {
            e.preventDefault();
            editThreadData(prefix, pin);
        });
        $('.button--icon--reply').before(btn);
    }

    function openMenu() {
        let buttonsHTML = '';

        BUTTONS_GROUPS.forEach((group, gIndex) => {
            buttonsHTML += `
            <div class="aqua-category" data-name="${group.title.toLowerCase()}">
                <div class="aqua-cat-title">${group.title}</div>
                <div class="aqua-buttons-grid">
                    ${group.items.map((item, iIndex) => `
                        <div class="aqua-btn" data-group="${gIndex}" data-item="${iIndex}">
                            ${item.title}
                        </div>
                    `).join('')}
                </div>
            </div>`;
        });

        const menuHTML = `
        <div class="aqua-overlay" id="aquaOverlay">
            <div class="aqua-panel">
                <div class="aqua-header">
                    <span class="aqua-title">🦅 Панель управления AQUA <span style="font-size: 10px; color: #555; margin-left: 10px;">v3.1 Fix</span></span>
                    <span class="aqua-close" id="closeAquaMenu">&times;</span>
                </div>
                <div class="aqua-body">
                    <div class="aqua-search-container">
                        <input type="text" class="aqua-search" id="aquaSearch" placeholder="🔍 Поиск ответа (например: опры, беседа, зга)..." autocomplete="off">
                    </div>
                    <div id="aquaButtonsContainer">${buttonsHTML}</div>
                </div>
            </div>
        </div>
        `;

        $('body').append(menuHTML);

        $('#closeAquaMenu, .aqua-overlay').click((e) => {
            if (e.target.id === 'aquaOverlay' || e.target.id === 'closeAquaMenu') {
                $('#aquaOverlay').remove();
            }
        });

        $('.aqua-btn').click(async function() {
            const gIndex = $(this).data('group');
            const iIndex = $(this).data('item');
            const action = BUTTONS_GROUPS[gIndex].items[iIndex];

            await handleAction(action);
            $('#aquaOverlay').remove();
        });

        $('#aquaSearch').on('input', function() {
            const val = $(this).val().toLowerCase();
            if (val === '') {
                $('.aqua-category').show();
                $('.aqua-btn').show();
                return;
            }
            $('.aqua-category').each(function() {
                const category = $(this);
                let hasVisibleButtons = false;
                category.find('.aqua-btn').each(function() {
                    const btn = $(this);
                    if (btn.text().toLowerCase().includes(val)) {
                        btn.show();
                        hasVisibleButtons = true;
                    } else {
                        btn.hide();
                    }
                });
                hasVisibleButtons ? category.show() : category.hide();
            });
        });

        $('#aquaSearch').focus();
    }

    // =================================================================================
    // 🛠️ ЛОГИКА
    // =================================================================================
    async function handleAction(action) {
        const threadData = await getThreadData();
        const theme = getCurrentPalette();

        if (action.content) {
            let content = replaceMacros(action.content, threadData);

            // Цветовая магия
            content = content
                .replace(/{{color.red}}/g, theme.red)
                .replace(/{{color.orange}}/g, theme.orange)
                .replace(/{{color.deepOrange}}/g, theme.deepOrange)
                .replace(/{{color.green}}/g, theme.green);

            pasteContent(content);
            clickSend();
        }

        if (action.prefix) {
            const delay = action.content ? 1500 : 0;
            setTimeout(() => {
                editThreadData(action.prefix, action.status);
            }, delay);
        }

        if (action.move_to_tech) {
            moveThread(action.prefix, 1199);
        }
    }

    function replaceMacros(text, data) {
        return text
            .replace(/{{user.mention}}/g, data.user.mention)
            .replace(/{{greeting}}/g, data.greeting);
    }

    function pasteContent(text) {
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(text);
        $('a.overlay-titleCloser').trigger('click');
    }

    function clickSend() {
        $('.button--primary.button--icon--reply').trigger('click');
    }

    async function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
        const authorName = $('a.username').html();
        const hours = new Date().getHours();

        let greeting;
        if (hours >= 4 && hours <= 11) greeting = 'Доброе утро';
        else if (hours > 11 && hours <= 15) greeting = 'Добрый день';
        else if (hours > 15 && hours <= 21) greeting = 'Добрый вечер';
        else greeting = 'Доброй ночи';

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: greeting
        };
    }

    function editThreadData(prefix, pin = false) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        const body = {
            prefix_id: prefix,
            title: threadTitle,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
        };

        if (pin) body.sticky = 1;

        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData(body),
        }).then(() => location.reload());
    }

    function moveThread(prefix, targetNodeId) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        fetch(`${document.URL}move`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                target_node_id: targetNodeId,
                redirect_type: 'none',
                notify_watchers: 1,
                starter_alert: 1,
                starter_alert_reason: "",
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => {
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        });
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();