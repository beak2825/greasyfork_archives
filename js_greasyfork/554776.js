// ==UserScript==
// @name         ! Tools
// @namespace    https://forum.blackrussia.online
// @version      1.0.6
// @description  Профессиональный инструмент модератора для мгновенного перемещения тем между разделами. Умное меню, автоматические ответы, работа в один клик!
// @author       Botir_Soliev | https://vk.com/id250006978
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @icon         https://i.postimg.cc/sgKbLbj9/verify-icon-png.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554776/%21%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/554776/%21%20Tools.meta.js
// ==/UserScript==

(function () {
    'use strict';


    // Добавляем функцию addButton
    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`
        );
    }


    // Функция для создания FormData
    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }

    // Функция для получения данных автора темы
    function getThreadData() {
        const authorElement = document.querySelector('a.username');
        if (!authorElement) return null;

        const authorID = authorElement.getAttribute('data-user-id');
        const authorName = authorElement.textContent;
        const hours = new Date().getHours();

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: () =>
                4 < hours && hours <= 11 ?
                'Доброе утро, уважаемый(ая)' :
                11 < hours && hours <= 15 ?
                'Добрый день, уважаемый(ая)' :
                15 < hours && hours <= 21 ?
                'Добрый вечер, уважаемый(ая)' :
                'Доброй ночи, уважаемый(ая)',
        };
    }

    // Функция для получения названия категории из названия кнопки меню
    function getCategoryNameFromMenu(categoryName) {
        const categoryMap = {
            'Тех раздел': 'технический раздел',
            'ЖБ на техов': 'жалобы на технических специалистов',
            'Админы': 'жалобы на администрацию',
            'Лидеры': 'жалобы на лидеров',
            'Игроки': 'жалобы на игроков',
            'Обжалование': 'обжалование наказаний'
        };

        return categoryMap[categoryName] || categoryName;
    }

    // Функция для очистки названия сервера от цифр и скобок
    function cleanServerName(buttonTitle) {
        return buttonTitle.replace(/\s*\(\d+\)$/, '').trim();
    }

    // Функция для создания ответа в теме
    function createReply(message, callback) {
        const formData = new FormData();
        formData.append('message_html', message);
        formData.append('_xfToken', XF.config.csrf);
        formData.append('_xfRequestUri', window.location.pathname);
        formData.append('_xfWithData', '1');
        formData.append('_xfResponseType', 'json');

        fetch(`${window.location.href}add-reply`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.errors) {
                console.error('Ошибка при создании ответа:', data.errors);
                alert('Ошибка при создании ответа:\n' + data.errors.join('\n'));
                return;
            }
            console.log('Ответ успешно создан');
            if (callback) callback();
        })
        .catch(err => {
            console.error('Ошибка запроса при создании ответа:', err);
            alert('Ошибка запроса при создании ответа:\n' + err);
        });
    }

    // Функция для получения заголовка темы
    function getThreadTitle() {
        const titleElement = document.querySelector('.p-title-value');
        if (titleElement && titleElement.lastChild) {
            return titleElement.lastChild.textContent;
        }
        return 'Без названия';
    }

    // Функция для выполнения перемещения темы
    function performMove(task) {
        const threadTitle = getThreadTitle();

        fetch(`${document.URL}move`, {
            method: 'POST',
            body: getFormData({
                prefix_id: 0,
                title: threadTitle,
                target_node_id: task.move,
                redirect_type: 'none',
                notify_watchers: 1,
                starter_alert: 1,
                starter_alert_reason: "",
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }

    // Функция для перемещения темы
    function moveThread(task, category) {
        const threadData = getThreadData();
        if (!threadData) {
            alert('Не удалось получить данные автора темы');
            return;
        }

        // Если это кнопка "Заявки с окончательным ответом" или "Жалобы на технических специалистов" - не создаем ответ
        if (task.title === 'Заявки с окончательным ответом' || task.title === 'Жалобы на технических специалистов') {
            // Просто перемещаем тему без создания ответа
            performMove(task);
            return;
        }

        // Получаем красивые названия из названия категории меню
        const categoryName = getCategoryNameFromMenu(category.name);
        const serverName = cleanServerName(task.title);

        // Создаем красивое сообщение
        const message = `
[FONT=Verdana]${threadData.greeting()} ${threadData.user.mention}<br><br>
Данная тема не соответствует разделу, в котором она была создана.<br>
Переношу в корректный раздел: ${categoryName} сервера: ${serverName}<br><br>
[/FONT]
`.trim();

        // Сначала создаем ответ
        createReply(message, function() {
            // После создания ответа перемещаем тему
            performMove(task);
        });
    }

////////////////////////ТЕХНИЧЕСКИЙ РАЗДЕЛ////////////////////////
    const category1 = {
        name: 'Тех раздел',
        color: '#000080',
        text: '#FFFFFF',
        description: 'Перемещение тем в раздел "Технический раздел". Выберите нужный сервер из кнопок ниже',
        buttons: [
            { title: 'RED (1)', move: 226,},
            { title: 'GREEN (2)', move: 227,},
            { title: 'BLUE (3)', move: 228,},
            { title: 'YELLOW (4)', move: 229,},
            { title: 'ORANGE (5)', move: 245,},
            { title: 'PURPLE (6)', move: 325,},
            { title: 'LIME (7)', move: 365,},
            { title: 'PINK (8)', move: 396,},
            { title: 'CHERRY (9)', move: 408,},
            { title: 'BLACK (10)', move: 488,},
            { title: 'INDIGO (11)', move: 493,},
            { title: 'WHITE (12)', move: 554,},
            { title: 'MAGENTA (13)', move: 613,},
            { title: 'CRIMSON (14)', move: 653,},
            { title: 'GOLD (15)', move: 660,},
            { title: 'AZURE (16)', move: 701,},
            { title: 'PLATINUM (17)', move: 757,},
            { title: 'AQUA (18)', move: 815,},
            { title: 'GRAY (19)', move: 857,},
            { title: 'ICE (20)', move: 925,},
            { title: 'CHILLI (21)', move: 1007,},
            { title: 'CHOCO (22)', move: 1048,},
            { title: 'MOSCOW (23)', move: 1052,},
            { title: 'SPB (24)', move: 1095,},
            { title: 'UFA (25)', move: 1138,},
            { title: 'SOCHI (26)', move: 1248,},
            { title: 'KAZAN (27)', move: 1290,},
            { title: 'SAMARA (28)', move: 1292,},
            { title: 'ROSTOV (29)', move: 1334,},
            { title: 'ANAPA (30)', move: 1416,},
            { title: 'EKB (31)', move: 1458,},
            { title: 'KRASNODAR (32)', move: 1460,},
            { title: 'ARZAMAS (33)', move: 1502,},
            { title: 'NOVOSIBIRSK (34)', move: 1544,},
            { title: 'GROZNY (35)', move: 1586,},
            { title: 'SARATOV (36)', move: 1628,},
            { title: 'OMSK (37)', move: 1670,},
            { title: 'IRKUTSK (38)', move: 1712,},
            { title: 'VOLGOGRAD (39)', move: 1758,},
            { title: 'VORONEZH (40)', move: 1800,},
            { title: 'BELGOROD (41)', move: 1840,},
            { title: 'MAKHACHKALA (42)', move: 1884,},
            { title: 'VLADIKAVKAZ (43)', move: 1926,},
            { title: 'VLADIVOSTOK (44)', move: 1968,},
            { title: 'KALININGRAD (45)', move: 2010,},
            { title: 'CHELYABINSK (46)', move: 2052,},
            { title: 'KRASNOYARSK (47)', move: 2094,},
            { title: 'CHEBOKSARY (48)', move: 2136,},
            { title: 'KHABAROVSK (49)', move: 2178,},
            { title: 'PERM (50)', move: 2220,},
            { title: 'TULA (51)', move: 2262,},
            { title: 'RYAZAN (52)', move: 2304,},
            { title: 'MURMANSK (53)', move: 2346,},
            { title: 'PENZA (54)', move: 2388,},
            { title: 'KURSK (55)', move: 2430,},
            { title: 'ARKHANGELSK (56)', move: 2472,},
            { title: 'ORENBURG (57)', move: 2514,},
            { title: 'KIROV (58)', move: 2516,},
            { title: 'KEMEROVO (59)', move: 2598,},
            { title: 'TYUMEN (60)', move: 2639,},
            { title: 'TOLYATTI (61)', move: 2682,},
            { title: 'IVANOVO (62)', move: 2714,},
            { title: 'STAVROPOL (63)', move: 2747,},
            { title: 'SMOLENSK (64)', move: 2779,},
            { title: 'PSKOV (65)', move: 2811,},
            { title: 'BRYANSK (66)', move: 2843,},
            { title: 'OREL (67)', move: 2875,},
            { title: 'YAROSLAVL (68)', move: 2907,},
            { title: 'BARNAUL (69)', move: 2939,},
            { title: 'LIPETSK (70)', move: 2971,},
            { title: 'ULYANOVSK (71)', move: 3003,},
            { title: 'YAKUTSK (72)', move: 3035,},
            { title: 'TAMBOV (73)', move: 3289,},
            { title: 'BRATSK (74)', move: 3324,},
            { title: 'ASTRAKHAN (75)', move: 3359,},
            { title: 'CHITA (76)', move: 3394,},
            { title: 'KOSTROMA (77)', move: 3429,},
            { title: 'VLADIMIR (78)', move: 3464,},
            { title: 'KALUGA (79)', move: 3499,},
            { title: 'NOVGOROD (80)', move: 3535,},
            { title: 'TAGANROG (81)', move: 3570,},
            { title: 'VOLOGDA (82)', move: 3605,},
            { title: 'TVER (83)', move: 3643,},
            { title: 'TOMSK (84)', move: 3740,},
            { title: 'IZHEVSK (85)', move: 3747,},
            { title: 'SURGUT (86)', move: 3812,},
            { title: 'PODOLSK (87)', move: 3817,},
            { title: 'MAGADAN (88)', move: 3912,},
            { title: 'CHEREPOVETS (89)', move: 3978, },

            { title: 'Жалобы на технических специалистов', move: 490, color: '#FF0000', text: '#FFFFFF' },
            { title: 'Заявки с окончательным ответом', move: 230, color: '#FF0000', text: '#FFFFFF' } ] };

    const category2 = {
        name: 'ЖБ на техов',
        color: '#ff4500',
        text: '#000000',
        description: 'Перемещение тем в раздел "Жалобы на технических специалистов". Выберите нужный сервер из кнопок ниже',
        buttons: [
            { title: 'RED (1)', move: 1182,},
            { title: 'GREEN (2)', move: 1183,},
            { title: 'BLUE (3)', move: 1184,},
            { title: 'YELLOW (4)', move: 1185,},
            { title: 'ORANGE (5)', move: 1186,},
            { title: 'PURPLE (6)', move: 1187,},
            { title: 'LIME (7)', move: 1188,},
            { title: 'PINK (8)', move: 1189,},
            { title: 'CHERRY (9)', move: 1190,},
            { title: 'BLACK (10)', move: 1191,},
            { title: 'INDIGO (11)', move: 1192,},
            { title: 'WHITE (12)', move: 1193,},
            { title: 'MAGENTA (13)', move: 1194,},
            { title: 'CRIMSON (14)', move: 1195,},
            { title: 'GOLD (15)', move: 1196,},
            { title: 'AZURE (16)', move: 1197,},
            { title: 'PLATINUM (17)', move: 1198,},
            { title: 'AQUA (18)', move: 1199,},
            { title: 'GRAY (19)', move: 1200,},
            { title: 'ICE (20)', move: 1201,},
            { title: 'CHILLI (21)', move: 1202,},
            { title: 'CHOCO (22)', move: 1203,},
            { title: 'MOSCOW (23)', move: 1204,},
            { title: 'SPB (24)', move: 1205,},
            { title: 'UFA (25)', move: 1206,},
            { title: 'SOCHI (26)', move: 1247,},
            { title: 'KAZAN (27)', move: 1289,},
            { title: 'SAMARA (28)', move: 1291,},
            { title: 'ROSTOV (29)', move: 1333,},
            { title: 'ANAPA (30)', move: 1415,},
            { title: 'EKB (31)', move: 1457,},
            { title: 'KRASNODAR (32)', move: 1459,},
            { title: 'ARZAMAS (33)', move: 1501,},
            { title: 'NOVOSIBIRSK (34)', move: 1543,},
            { title: 'GROZNY (35)', move: 1585,},
            { title: 'SARATOV (36)', move: 1627,},
            { title: 'OMSK (37)', move: 1669,},
            { title: 'IRKUTSK (38)', move: 1711,},
            { title: 'VOLGOGRAD (39)', move: 1757,},
            { title: 'VORONEZH (40)', move: 1801,},
            { title: 'BELGOROD (41)', move: 1841,},
            { title: 'MAKHACHKALA (42)', move: 1883,},
            { title: 'VLADIKAVKAZ (43)', move: 1925,},
            { title: 'VLADIVOSTOK (44)', move: 1967,},
            { title: 'KALININGRAD (45)', move: 2009,},
            { title: 'CHELYABINSK (46)', move: 2051,},
            { title: 'KRASNOYARSK (47)', move: 2093,},
            { title: 'CHEBOKSARY (48)', move: 2135,},
            { title: 'KHABAROVSK (49)', move: 2177,},
            { title: 'PERM (50)', move: 2219,},
            { title: 'TULA (51)', move: 2261,},
            { title: 'RYAZAN (52)', move: 2303,},
            { title: 'MURMANSK (53)', move: 2345,},
            { title: 'PENZA (54)', move: 2387,},
            { title: 'KURSK (55)', move: 2429,},
            { title: 'ARKHANGELSK (56)', move: 2471,},
            { title: 'ORENBURG (57)', move: 2513,},
            { title: 'KIROV (58)', move: 2515,},
            { title: 'KEMEROVO (59)', move: 2597,},
            { title: 'TYUMEN (60)', move: 2640,},
            { title: 'TOLYATTI (61)', move: 2681,},
            { title: 'IVANOVO (62)', move: 2713,},
            { title: 'STAVROPOL (63)', move: 2746,},
            { title: 'SMOLENSK (64)', move: 2778,},
            { title: 'PSKOV (65)', move: 2810,},
            { title: 'BRYANSK (66)', move: 2842,},
            { title: 'OREL (67)', move: 2874,},
            { title: 'YAROSLAVL (68)', move: 2906,},
            { title: 'BARNAUL (69)', move: 2938,},
            { title: 'LIPETSK (70)', move: 2970,},
            { title: 'ULYANOVSK (71)', move: 3002,},
            { title: 'YAKUTSK (72)', move: 3034,},
            { title: 'TAMBOV (73)', move: 3288,},
            { title: 'BRATSK (74)', move: 3323,},
            { title: 'ASTRAKHAN (75)', move: 3358,},
            { title: 'CHITA (76)', move: 3393,},
            { title: 'KOSTROMA (77)', move: 3428,},
            { title: 'VLADIMIR (78)', move: 3463,},
            { title: 'KALUGA (79)', move: 3498,},
            { title: 'NOVGOROD (80)', move: 3533,},
            { title: 'TAGANROG (81)', move: 3569,},
            { title: 'VOLOGDA (82)', move: 3604,},
            { title: 'TVER (83)', move: 3642,},
            { title: 'TOMSK (84)', move: 3739,},
            { title: 'IZHEVSK (85)', move: 3746,},
            { title: 'SURGUT (86)', move: 3811,},
            { title: 'PODOLSK (87)', move: 3816,},
            { title: 'MAGADAN (88)', move: 3911,},
            { title: 'CHEREPOVETS (89)', move: 3946, },

            { title: 'Жалобы на технических специалистов', move: 490, color: '#FF0000', text: '#FFFFFF' },
            { title: 'Заявки с окончательным ответом', move: 230, color: '#FF0000', text: '#FFFFFF' } ] };

////////////////////////ЖАЛОБЫ НА АДМИНОВ////////////////////////
    const category3 = {
        name: 'Админы',
        color: '#8B008B',
        text: '#FFFFFF',
        description: 'Перемещение тем в раздел "Жалобы на администрацию". Выберите нужный сервер из кнопок ниже',
        buttons: [
            { title: 'RED (1)', move: 86,},
            { title: 'GREEN (2)', move: 117,},
            { title: 'BLUE (3)', move: 154,},
            { title: 'YELLOW (4)', move: 192,},
            { title: 'ORANGE (5)', move: 271,},
            { title: 'PURPLE (6)', move: 310,},
            { title: 'LIME (7)', move: 350,},
            { title: 'PINK (8)', move: 392,},
            { title: 'CHERRY (9)', move: 433,},
            { title: 'BLACK (10)', move: 468,},
            { title: 'INDIGO (11)', move: 517,},
            { title: 'WHITE (12)', move: 558,},
            { title: 'MAGENTA (13)', move: 597,},
            { title: 'CRIMSON (14)', move: 638,},
            { title: 'GOLD (15)', move: 680,},
            { title: 'AZURE (16)', move: 721,},
            { title: 'PLATINUM (17)', move: 783,},
            { title: 'AQUA (18)', move: 842,},
            { title: 'GRAY (19)', move: 883,},
            { title: 'ICE (20)', move: 952,},
            { title: 'CHILLI (21)', move: 992,},
            { title: 'CHOCO (22)', move: 1034,},
            { title: 'MOSCOW (23)', move: 1080,},
            { title: 'SPB (24)', move: 1122,},
            { title: 'UFA (25)', move: 1165,},
            { title: 'SOCHI (26)', move: 1232,},
            { title: 'KAZAN (27)', move: 1274,},
            { title: 'SAMARA (28)', move: 1318,},
            { title: 'ROSTOV (29)', move: 1360,},
            { title: 'ANAPA (30)', move: 1400,},
            { title: 'EKB (31)', move: 1442,},
            { title: 'KRASNODAR (32)', move: 1486,},
            { title: 'ARZAMAS (33)', move: 1529,},
            { title: 'NOVOSIBIRSK (34)', move: 1570,},
            { title: 'GROZNY (35)', move: 1612,},
            { title: 'SARATOV (36)', move: 1654,},
            { title: 'OMSK (37)', move: 1696,},
            { title: 'IRKUTSK (38)', move: 1738,},
            { title: 'VOLGOGRAD (39)', move: 1784,},
            { title: 'VORONEZH (40)', move: 1826,},
            { title: 'BELGOROD (41)', move: 1868,},
            { title: 'MAKHACHKALA (42)', move: 1910,},
            { title: 'VLADIKAVKAZ (43)', move: 1952,},
            { title: 'VLADIVOSTOK (44)', move: 1994,},
            { title: 'KALININGRAD (45)', move: 2036,},
            { title: 'CHELYABINSK (46)', move: 2078,},
            { title: 'KRASNOYARSK (47)', move: 2120,},
            { title: 'CHEBOKSARY (48)', move: 2162,},
            { title: 'KHABAROVSK (49)', move: 2204,},
            { title: 'PERM (50)', move: 2246,},
            { title: 'TULA (51)', move: 2288,},
            { title: 'RYAZAN (52)', move: 2330,},
            { title: 'MURMANSK (53)', move: 2372,},
            { title: 'PENZA (54)', move: 2414,},
            { title: 'KURSK (55)', move: 2456,},
            { title: 'ARKHANGELSK (56)', move: 2498,},
            { title: 'ORENBURG (57)', move: 2543,},
            { title: 'KIROV (58)', move: 2582,},
            { title: 'KEMEROVO (59)', move: 2624,},
            { title: 'TYUMEN (60)', move: 2661,},
            { title: 'TOLYATTI (61)', move: 2700,},
            { title: 'IVANOVO (62)', move: 2733,},
            { title: 'STAVROPOL (63)', move: 2765,},
            { title: 'SMOLENSK (64)', move: 2797,},
            { title: 'PSKOV (65)', move: 2829,},
            { title: 'BRYANSK (66)', move: 2861,},
            { title: 'OREL (67)', move: 2893,},
            { title: 'YAROSLAVL (68)', move: 2925,},
            { title: 'BARNAUL (69)', move: 2957,},
            { title: 'LIPETSK (70)', move: 2989,},
            { title: 'ULYANOVSK (71)', move: 3021,},
            { title: 'YAKUTSK (72)', move: 3053,},
            { title: 'TAMBOV (73)', move: 3307,},
            { title: 'BRATSK (74)', move: 3342,},
            { title: 'ASTRAKHAN (75)', move: 3377,},
            { title: 'CHITA (76)', move: 3412,},
            { title: 'KOSTROMA (77)', move: 3447,},
            { title: 'VLADIMIR (78)', move: 3482,},
            { title: 'KALUGA (79)', move: 3517,},
            { title: 'NOVGOROD (80)', move: 3553,},
            { title: 'TAGANROG (81)', move: 3588,},
            { title: 'VOLOGDA (82)', move: 3623,},
            { title: 'TVER (83)', move: 3664,},
            { title: 'TOMSK (84)', move: 3726,},
            { title: 'IZHEVSK (85)', move: 3765,},
            { title: 'SURGUT (86)', move: 3798,},
            { title: 'PODOLSK (87)', move: 3835,},
            { title: 'MAGADAN (88)', move: 3930,},
            { title: 'CHEREPOVETS (89)', move: 3965, }, ] };

////////////////////////ЖАЛОБЫ НА ЛИДЕРОВ////////////////////////
    const category4 = {
        name: 'Лидеры',
        color: '#20B2AA',
        text: '#FFFFFF',
        description: 'Перемещение тем в раздел "Жалобы на лидеров". Выберите нужный сервер из кнопок ниже',
        buttons: [
            { title: 'RED (1)', move: 87,},
            { title: 'GREEN (2)', move: 118,},
            { title: 'BLUE (3)', move: 155,},
            { title: 'YELLOW (4)', move: 193,},
            { title: 'ORANGE (5)', move: 272,},
            { title: 'PURPLE (6)', move: 311,},
            { title: 'LIME (7)', move: 351,},
            { title: 'PINK (8)', move: 393,},
            { title: 'CHERRY (9)', move: 434,},
            { title: 'BLACK (10)', move: 469,},
            { title: 'INDIGO (11)', move: 518,},
            { title: 'WHITE (12)', move: 559,},
            { title: 'MAGENTA (13)', move: 598,},
            { title: 'CRIMSON (14)', move: 639,},
            { title: 'GOLD (15)', move: 681,},
            { title: 'AZURE (16)', move: 722,},
            { title: 'PLATINUM (17)', move: 784,},
            { title: 'AQUA (18)', move: 843,},
            { title: 'GRAY (19)', move: 884,},
            { title: 'ICE (20)', move: 953,},
            { title: 'CHILLI (21)', move: 993,},
            { title: 'CHOCO (22)', move: 1035,},
            { title: 'MOSCOW (23)', move: 1081,},
            { title: 'SPB (24)', move: 1123,},
            { title: 'UFA (25)', move: 1166,},
            { title: 'SOCHI (26)', move: 1233,},
            { title: 'KAZAN (27)', move: 1275,},
            { title: 'SAMARA (28)', move: 1319,},
            { title: 'ROSTOV (29)', move: 1361,},
            { title: 'ANAPA (30)', move: 1401,},
            { title: 'EKB (31)', move: 1443,},
            { title: 'KRASNODAR (32)', move: 1487,},
            { title: 'ARZAMAS (33)', move: 1530,},
            { title: 'NOVOSIBIRSK (34)', move: 1571,},
            { title: 'GROZNY (35)', move: 1613,},
            { title: 'SARATOV (36)', move: 1655,},
            { title: 'OMSK (37)', move: 1697,},
            { title: 'IRKUTSK (38)', move: 1739,},
            { title: 'VOLGOGRAD (39)', move: 1785,},
            { title: 'VORONEZH (40)', move: 1827,},
            { title: 'BELGOROD (41)', move: 1869,},
            { title: 'MAKHACHKALA (42)', move: 1911,},
            { title: 'VLADIKAVKAZ (43)', move: 1953,},
            { title: 'VLADIVOSTOK (44)', move: 1995,},
            { title: 'KALININGRAD (45)', move: 2037,},
            { title: 'CHELYABINSK (46)', move: 2079,},
            { title: 'KRASNOYARSK (47)', move: 2121,},
            { title: 'CHEBOKSARY (48)', move: 2163,},
            { title: 'KHABAROVSK (49)', move: 2205,},
            { title: 'PERM (50)', move: 2247,},
            { title: 'TULA (51)', move: 2289,},
            { title: 'RYAZAN (52)', move: 2331,},
            { title: 'MURMANSK (53)', move: 2373,},
            { title: 'PENZA (54)', move: 2415,},
            { title: 'KURSK (55)', move: 2457,},
            { title: 'ARKHANGELSK (56)', move: 2499,},
            { title: 'ORENBURG (57)', move: 2544,},
            { title: 'KIROV (58)', move: 2583,},
            { title: 'KEMEROVO (59)', move: 2625,},
            { title: 'TYUMEN (60)', move: 2662,},
            { title: 'TOLYATTI (61)', move: 2701,},
            { title: 'IVANOVO (62)', move: 2734,},
            { title: 'STAVROPOL (63)', move: 2766,},
            { title: 'SMOLENSK (64)', move: 2798,},
            { title: 'PSKOV (65)', move: 2830,},
            { title: 'BRYANSK (66)', move: 2862,},
            { title: 'OREL (67)', move: 2894,},
            { title: 'YAROSLAVL (68)', move: 2926,},
            { title: 'BARNAUL (69)', move: 2958,},
            { title: 'LIPETSK (70)', move: 2990,},
            { title: 'ULYANOVSK (71)', move: 3022,},
            { title: 'YAKUTSK (72)', move: 3054,},
            { title: 'TAMBOV (73)', move: 3308,},
            { title: 'BRATSK (74)', move: 3343,},
            { title: 'ASTRAKHAN (75)', move: 3378,},
            { title: 'CHITA (76)', move: 3413,},
            { title: 'KOSTROMA (77)', move: 3448,},
            { title: 'VLADIMIR (78)', move: 3483,},
            { title: 'KALUGA (79)', move: 3518,},
            { title: 'NOVGOROD (80)', move: 3554,},
            { title: 'TAGANROG (81)', move: 3589,},
            { title: 'VOLOGDA (82)', move: 3624,},
            { title: 'TVER (83)', move: 3665,},
            { title: 'TOMSK (84)', move: 3727,},
            { title: 'IZHEVSK (85)', move: 3766,},
            { title: 'SURGUT (86)', move: 3799,},
            { title: 'PODOLSK (87)', move: 3836,},
            { title: 'MAGADAN (88)', move: 3931,},
            { title: 'CHEREPOVETS (89)', move: 3966, }, ] };
////////////////////////ЖАЛОБЫ НА ИГРОКОВ////////////////////////
    const category5 = {
        name: 'Игроки',
        color: '#32CD32',
        text: '#000000',
        description: 'Перемещение тем в раздел "Жалобы на игроков". Выберите нужный сервер из кнопок ниже',
        buttons: [
            { title: 'RED (1)', move: 88,},
            { title: 'GREEN (2)', move: 119,},
            { title: 'BLUE (3)', move: 156,},
            { title: 'YELLOW (4)', move: 194,},
            { title: 'ORANGE (5)', move: 273,},
            { title: 'PURPLE (6)', move: 312,},
            { title: 'LIME (7)', move: 352,},
            { title: 'PINK (8)', move: 394,},
            { title: 'CHERRY (9)', move: 435,},
            { title: 'BLACK (10)', move: 470,},
            { title: 'INDIGO (11)', move: 519,},
            { title: 'WHITE (12)', move: 560,},
            { title: 'MAGENTA (13)', move: 599,},
            { title: 'CRIMSON (14)', move: 640,},
            { title: 'GOLD (15)', move: 682,},
            { title: 'AZURE (16)', move: 723,},
            { title: 'PLATINUM (17)', move: 785,},
            { title: 'AQUA (18)', move: 844,},
            { title: 'GRAY (19)', move: 885,},
            { title: 'ICE (20)', move: 954,},
            { title: 'CHILLI (21)', move: 994,},
            { title: 'CHOCO (22)', move: 1036,},
            { title: 'MOSCOW (23)', move: 1082,},
            { title: 'SPB (24)', move: 1124,},
            { title: 'UFA (25)', move: 1167,},
            { title: 'SOCHI (26)', move: 1234,},
            { title: 'KAZAN (27)', move: 1276,},
            { title: 'SAMARA (28)', move: 1320,},
            { title: 'ROSTOV (29)', move: 1362,},
            { title: 'ANAPA (30)', move: 1402,},
            { title: 'EKB (31)', move: 1444,},
            { title: 'KRASNODAR (32)', move: 1488,},
            { title: 'ARZAMAS (33)', move: 1531,},
            { title: 'NOVOSIBIRSK (34)', move: 1572,},
            { title: 'GROZNY (35)', move: 1614,},
            { title: 'SARATOV (36)', move: 1656,},
            { title: 'OMSK (37)', move: 1698,},
            { title: 'IRKUTSK (38)', move: 1740,},
            { title: 'VOLGOGRAD (39)', move: 1786,},
            { title: 'VORONEZH (40)', move: 1828,},
            { title: 'BELGOROD (41)', move: 1870,},
            { title: 'MAKHACHKALA (42)', move: 1912,},
            { title: 'VLADIKAVKAZ (43)', move: 1954,},
            { title: 'VLADIVOSTOK (44)', move: 1996,},
            { title: 'KALININGRAD (45)', move: 2038,},
            { title: 'CHELYABINSK (46)', move: 2080,},
            { title: 'KRASNOYARSK (47)', move: 2122,},
            { title: 'CHEBOKSARY (48)', move: 2164,},
            { title: 'KHABAROVSK (49)', move: 2206,},
            { title: 'PERM (50)', move: 2248,},
            { title: 'TULA (51)', move: 2290,},
            { title: 'RYAZAN (52)', move: 2332,},
            { title: 'MURMANSK (53)', move: 2374,},
            { title: 'PENZA (54)', move: 2416,},
            { title: 'KURSK (55)', move: 2458,},
            { title: 'ARKHANGELSK (56)', move: 2500,},
            { title: 'ORENBURG (57)', move: 2545,},
            { title: 'KIROV (58)', move: 2584,},
            { title: 'KEMEROVO (59)', move: 2626,},
            { title: 'TYUMEN (60)', move: 2663,},
            { title: 'TOLYATTI (61)', move: 2702,},
            { title: 'IVANOVO (62)', move: 2735,},
            { title: 'STAVROPOL (63)', move: 2767,},
            { title: 'SMOLENSK (64)', move: 2799,},
            { title: 'PSKOV (65)', move: 2831,},
            { title: 'BRYANSK (66)', move: 2863,},
            { title: 'OREL (67)', move: 2895,},
            { title: 'YAROSLAVL (68)', move: 2927,},
            { title: 'BARNAUL (69)', move: 2959,},
            { title: 'LIPETSK (70)', move: 2991,},
            { title: 'ULYANOVSK (71)', move: 3023,},
            { title: 'YAKUTSK (72)', move: 3055,},
            { title: 'TAMBOV (73)', move: 3309,},
            { title: 'BRATSK (74)', move: 3344,},
            { title: 'ASTRAKHAN (75)', move: 3379,},
            { title: 'CHITA (76)', move: 3414,},
            { title: 'KOSTROMA (77)', move: 3449,},
            { title: 'VLADIMIR (78)', move: 3484,},
            { title: 'KALUGA (79)', move: 3519,},
            { title: 'NOVGOROD (80)', move: 3555,},
            { title: 'TAGANROG (81)', move: 3590,},
            { title: 'VOLOGDA (82)', move: 3625,},
            { title: 'TVER (83)', move: 3666,},
            { title: 'TOMSK (84)', move: 3728,},
            { title: 'IZHEVSK (85)', move: 3767,},
            { title: 'SURGUT (86)', move: 3800,},
            { title: 'PODOLSK (87)', move: 3837,},
            { title: 'MAGADAN (88)', move: 3932,},
            { title: 'CHEREPOVETS (89)', move: 3967, }, ] };

////////////////////////ОБЖАЛОВАНИЕ////////////////////////
    const category6 = {
        name: 'Обжалование',
        color: '#DC143C',
        text: '#FFFFFF',
        description: 'Перемещение тем в раздел "Обжалование наказаний". Выберите нужный сервер из кнопок ниже',
        buttons: [
            { title: 'RED (1)', move: 89,},
            { title: 'GREEN (2)', move: 120,},
            { title: 'BLUE (3)', move: 157,},
            { title: 'YELLOW (4)', move: 195,},
            { title: 'ORANGE (5)', move: 274,},
            { title: 'PURPLE (6)', move: 313,},
            { title: 'LIME (7)', move: 353,},
            { title: 'PINK (8)', move: 395,},
            { title: 'CHERRY (9)', move: 436,},
            { title: 'BLACK (10)', move: 471,},
            { title: 'INDIGO (11)', move: 520,},
            { title: 'WHITE (12)', move: 561,},
            { title: 'MAGENTA (13)', move: 600,},
            { title: 'CRIMSON (14)', move: 641,},
            { title: 'GOLD (15)', move: 683,},
            { title: 'AZURE (16)', move: 724,},
            { title: 'PLATINUM (17)', move: 786,},
            { title: 'AQUA (18)', move: 845,},
            { title: 'GRAY (19)', move: 886,},
            { title: 'ICE (20)', move: 955,},
            { title: 'CHILLI (21)', move: 995,},
            { title: 'CHOCO (22)', move: 1037,},
            { title: 'MOSCOW (23)', move: 1084,},
            { title: 'SPB (24)', move: 1125,},
            { title: 'UFA (25)', move: 1168,},
            { title: 'SOCHI (26)', move: 1235,},
            { title: 'KAZAN (27)', move: 1277,},
            { title: 'SAMARA (28)', move: 1321,},
            { title: 'ROSTOV (29)', move: 1363,},
            { title: 'ANAPA (30)', move: 1403,},
            { title: 'EKB (31)', move: 1445,},
            { title: 'KRASNODAR (32)', move: 1489,},
            { title: 'ARZAMAS (33)', move: 1528,},
            { title: 'NOVOSIBIRSK (34)', move: 1573,},
            { title: 'GROZNY (35)', move: 1615,},
            { title: 'SARATOV (36)', move: 1657,},
            { title: 'OMSK (37)', move: 1699,},
            { title: 'IRKUTSK (38)', move: 1741,},
            { title: 'VOLGOGRAD (39)', move: 1787,},
            { title: 'VORONEZH (40)', move: 1829,},
            { title: 'BELGOROD (41)', move: 1871,},
            { title: 'MAKHACHKALA (42)', move: 1913,},
            { title: 'VLADIKAVKAZ (43)', move: 1955,},
            { title: 'VLADIVOSTOK (44)', move: 1997,},
            { title: 'KALININGRAD (45)', move: 2039,},
            { title: 'CHELYABINSK (46)', move: 2081,},
            { title: 'KRASNOYARSK (47)', move: 2123,},
            { title: 'CHEBOKSARY (48)', move: 2165,},
            { title: 'KHABAROVSK (49)', move: 2207,},
            { title: 'PERM (50)', move: 2249,},
            { title: 'TULA (51)', move: 2291,},
            { title: 'RYAZAN (52)', move: 2333,},
            { title: 'MURMANSK (53)', move: 2375,},
            { title: 'PENZA (54)', move: 2417,},
            { title: 'KURSK (55)', move: 2459,},
            { title: 'ARKHANGELSK (56)', move: 2501,},
            { title: 'ORENBURG (57)', move: 2546,},
            { title: 'KIROV (58)', move: 2585,},
            { title: 'KEMEROVO (59)', move: 2627,},
            { title: 'TYUMEN (60)', move: 2664,},
            { title: 'TOLYATTI (61)', move: 2703,},
            { title: 'IVANOVO (62)', move: 2736,},
            { title: 'STAVROPOL (63)', move: 2768,},
            { title: 'SMOLENSK (64)', move: 2800,},
            { title: 'PSKOV (65)', move: 2832,},
            { title: 'BRYANSK (66)', move: 2864,},
            { title: 'OREL (67)', move: 2896,},
            { title: 'YAROSLAVL (68)', move: 2928,},
            { title: 'BARNAUL (69)', move: 2960,},
            { title: 'LIPETSK (70)', move: 2992,},
            { title: 'ULYANOVSK (71)', move: 3024,},
            { title: 'YAKUTSK (72)', move: 3056,},
            { title: 'TAMBOV (73)', move: 3310,},
            { title: 'BRATSK (74)', move: 3345,},
            { title: 'ASTRAKHAN (75)', move: 3380,},
            { title: 'CHITA (76)', move: 3415,},
            { title: 'KOSTROMA (77)', move: 3450,},
            { title: 'VLADIMIR (78)', move: 3485,},
            { title: 'KALUGA (79)', move: 3520,},
            { title: 'NOVGOROD (80)', move: 3556,},
            { title: 'TAGANROG (81)', move: 3591,},
            { title: 'VOLOGDA (82)', move: 3626,},
            { title: 'TVER (83)', move: 3667,},
            { title: 'TOMSK (84)', move: 3729,},
            { title: 'IZHEVSK (85)', move: 3768,},
            { title: 'SURGUT (86)', move: 3801,},
            { title: 'PODOLSK (87)', move: 3838,},
            { title: 'MAGADAN (88)', move: 3933,},
            { title: 'CHEREPOVETS (89)', move: 3968, }, ] };

    // Массив всех категорий
    const categories = [category1, category2, category3, category4, category5, category6];

    // Подключаем шрифт Roboto
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const style = `
    .button-container {
        position: fixed;
        left: 50%;
        top: 50px;
        transform: translateX(-50%);
        z-index: 9999;
        display: none;
        flex-wrap: wrap;
        justify-content: flex-start;
        width: 95vw;
        max-height: 80vh;
        overflow-y: auto;
        padding: 15px;
        background-color: rgba(0, 0, 0, 0.9);
        border-radius: 10px;
        transition: opacity 0.3s ease;
        box-sizing: border-box;
    }
    .custom-button {
        color: white;
        padding: 8px 12px;
        border: none;
        border-radius: 5px;
        font-size: 12px;
        cursor: pointer;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
        transition: background-color 0.3s, transform 0.2s;
        margin: 4px;
        width: calc(33.333% - 8px);
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
        font-family: 'Roboto', sans-serif;
    }
    .custom-button:hover {
        opacity: 0.8;
        transform: scale(1.01);
    }
    .mobile-menu-button {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        padding: 8px 12px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        font-family: 'Roboto', sans-serif;
    }
    .mobile-menu-button:hover {
        background-color: #555;
    }
    .mobile-menu-container {
        position: fixed;
        top: 45px;
        right: 10px;
        z-index: 9999;
        display: none;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.95);
        border-radius: 8px;
        padding: 10px;
        min-width: 150px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .mobile-menu-item {
        padding: 10px 15px;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin: 2px 0;
        text-align: center;
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .mobile-menu-item:hover {
        opacity: 0.8;
    }
    .background-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        display: none;
    }
    .container-header {
        color: white;
        font-size: 16px;
        margin-bottom: 10px;
        text-align: center;
        font-weight: bold;
        font-family: 'Roboto', sans-serif;
        width: 100%;
    }
    .container-description {
        color: #ffffff;
        font-size: 14px;
        margin-bottom: 15px;
        text-align: center;
        font-family: 'Roboto', sans-serif;
        width: 100%;
        line-height: 1.4;
    }
    .separator {
        flex-basis: 100%;
        height: 1px;
        background-color: rgba(255,255,255,0.3);
        margin: 10px 0;
    }
    .special-button {
        width: 100% !important;
        margin: 8px auto !important;
        padding: 12px 15px !important;
        font-size: 14px !important;
        font-weight: bold !important;
        text-align: center !important;
    }
    @media (max-width: 480px) {
        .custom-button {
            width: calc(50% - 8px);
            font-size: 11px;
            padding: 6px 8px;
        }
    }
    @media (max-width: 360px) {
        .custom-button {
            width: calc(100% - 8px);
            font-size: 12px;
            padding: 8px 10px;
        }
    }
    `;

    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);

    // Создаем контейнеры для кнопок
    const buttonContainers = [];
    categories.forEach((category, index) => {
        const container = document.createElement('div');
        container.className = 'button-container';
        container.id = `button-container-${index + 1}`;
        document.body.appendChild(container);
        buttonContainers.push(container);
    });

    // Функция для создания кнопок в контейнерах
    function createButtons(category, container) {
        if (category.description) {
            const description = document.createElement('div');
            description.className = 'container-description';
            description.innerText = category.description;
            container.appendChild(description);
        }

        category.buttons.forEach((buttonData) => {
            if (buttonData.title === 'Заявки с окончательным ответом' || buttonData.title === 'Жалобы на технических специалистов') {
                const separator = document.createElement('div');
                separator.className = 'separator';
                container.appendChild(separator);
            }

            const button = document.createElement('div');
            button.className = 'custom-button';
            button.innerHTML = buttonData.title;
            button.style.backgroundColor = buttonData.color || category.color;
            button.style.color = buttonData.text || category.text;

            if (buttonData.title === 'Заявки с окончательным ответом' || buttonData.title === 'Жалобы на технических специалистов') {
                button.className += ' special-button';
            }

            button.addEventListener('click', function() {
                moveThread(buttonData, category);
                buttonContainers.forEach(container => {
                    container.style.display = 'none';
                });
                backgroundOverlay.style.display = 'none';
                mobileMenuContainer.style.display = 'none';
            });

            container.appendChild(button);
        });
    }

    // Создаем кнопки для каждого контейнера
    categories.forEach((category, index) => {
        createButtons(category, buttonContainers[index]);
    });



















    // Создаем мобильное меню
    const mobileMenuContainer = document.createElement('div');
    mobileMenuContainer.className = 'mobile-menu-container';

    // Добавляем пункты в мобильное меню
    categories.forEach((category, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'mobile-menu-item';
        menuItem.innerHTML = category.name;
        menuItem.style.backgroundColor = category.color;
        menuItem.style.color = category.text;

        menuItem.addEventListener('click', function() {
            const targetContainer = buttonContainers[index];

            buttonContainers.forEach(container => {
                container.style.display = 'none';
            });

            targetContainer.style.display = 'flex';
            backgroundOverlay.style.display = 'block';
            mobileMenuContainer.style.display = 'none';
        });

        mobileMenuContainer.appendChild(menuItem);
    });

    // Добавляем кнопку Меню через функцию addButton

addButton('Tech', 'moderatorMenu', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0, 1.75); background-color: #black; color: #FFA500;');
    // Обработчик для кнопки меню (с проверкой чтобы не конфликтовало с другими скриптами)
    $(document).on('click', '#moderatorMenu', function(e) {
        e.stopPropagation(); // Останавливаем всплытие события
        e.preventDefault(); // Предотвращаем стандартное действие

        // Проверяем, не активирован ли уже другой скрипт
        if (window.menuScriptActive) {
            return; // Если другой скрипт активен, выходим
        }

        window.menuScriptActive = true; // Помечаем наш скрипт как активный

        // Твой код для отображения меню модератора
        if (mobileMenuContainer.style.display === 'flex') {
            mobileMenuContainer.style.display = 'none';
            backgroundOverlay.style.display = 'none';
        } else {
            mobileMenuContainer.style.display = 'flex';
            backgroundOverlay.style.display = 'block';

            // Скрываем все контейнеры с кнопками при открытии меню
            buttonContainers.forEach(container => {
                container.style.display = 'none';
            });
        }

        // Сбрасываем флаг через короткое время
        setTimeout(() => {
            window.menuScriptActive = false;
        }, 100);
    });













    // Создаем фон для контейнера
    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.className = 'background-overlay';
    document.body.appendChild(backgroundOverlay);

    // Закрытие при клике на фон
    backgroundOverlay.addEventListener('click', function() {
        buttonContainers.forEach(container => {
            container.style.display = 'none';
        });
        mobileMenuContainer.style.display = 'none';
        backgroundOverlay.style.display = 'none';
    });

    // Добавляем элементы в тело страницы
    document.body.appendChild(mobileMenuContainer);

    // Закрытие при клике на фон
    backgroundOverlay.addEventListener('click', function() {
        buttonContainers.forEach(container => {
            container.style.display = 'none';
        });
        mobileMenuContainer.style.display = 'none';
        backgroundOverlay.style.display = 'none';
    });

    // Добавляем элементы в тело страницы
    document.body.appendChild(mobileMenuContainer);
})();