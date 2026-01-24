// ==UserScript==
// @name         бр скрипт
// @namespace    https://forum.blackrussia.online
// @version      30.0
// @description  скрипт для форума бр
// @author       Ekaterina_Mordvay
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        GM_registerMenuCommand
// @license      MIT
// @icon         https://via.placeholder.com/50/8E2DE2/FFFFFF/?text=BR
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563917/%D0%B1%D1%80%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/563917/%D0%B1%D1%80%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==
 
/* global $ */
 
(function () {
    'use strict';
 
    const LOCAL_STORAGE_KEY = 'br_curator_templates_v30';
    const SETTINGS_KEY = 'br_curator_settings_v30';
    const FLOOD_STORAGE_KEY = 'br_flood_timestamp_v30';
    const PENDING_CONTENT_KEY = 'br_pending_content_v30';
 
    const AVATAR_URL = 'https://i.postimg.cc/43krF7Lx/Screenshot-20251205-223206.jpg';
    const VK_LINK = 'https://vk.com/imaginemp';
 
    const P = {
        UNACCEPT: 4, ACCEPT: 8, PIN: 2, RESHENO: 6, CLOSE: 7,
        WATCHED: 9, GA: 12, TEX: 13, REALIZOVANO: 5, OJIDANIE: 14
    };
 
    const PREFIX_NAMES = {
        4: 'Отказано', 8: 'Одобрено', 2: 'На рассмотрении', 6: 'Решено',
        7: 'Закрыто', 9: 'Рассмотрено', 12: 'Главному Адм', 13: 'Тех. Спецу',
        5: 'Реализовано', 14: 'Ожидание', 0: 'Без префикса'
    };
 
    const BOTTOM_IMG = 'https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O';
 
    const SCOPES = {
        'all': 'Везде',
        'players': 'Жалобы на игроков',
        'admins': 'Жалобы на администрацию',
        'appeals': 'Обжалования',
        'custom': 'Свой путь'
    };
 
    const SCOPE_KEYWORDS = {
        'players': ['жалобы на игроков', 'жалобы-на-игроков'],
        'admins': ['жалобы на администрацию', 'жалобы-на-администрацию'],
        'appeals': ['обжалование наказаний', 'обжалования']
    };
 
    const BASE_DATA = {
        'common': [
            { title: 'Приветствие', content: '[FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>[CENTER]  [/CENTER][/FONT]', prefix: 0 },
            { title: 'На рассмотрении', content: '[CENTER][COLOR=#778899]Ваша жалоба взята на рассмотрение.<br>Ожидайте ответа и не создавайте копий, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Ожидайте ответа.[/COLOR][/CENTER]', prefix: P.PIN },
            { title: 'Одобрено, закрыто', content: '[CENTER][COLOR=#778899]Игрок будет наказан.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Отказано, закрыто', content: '[CENTER][COLOR=#778899]Недостаточно доказательств на нарушение от игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'DM', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.19[/B]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [B]Jail 60 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#00FFFF]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Масс ДМ', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.20[/B]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | [B]Warn / Ban 3 - 7 дней[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#00FFFF]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'ДБ', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.13[/B]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [B]Jail 60 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'ТК', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.15[/B]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [B]Jail 60 минут / Warn (за два и более убийства)[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'СК', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.16[/B]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [B]Jail 60 минут / Warn (за два и более убийства)[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'ПГ', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.17[/B]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | [B]Jail 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'MG', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.18[/B]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'РК', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.14[/B]. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | [B]Jail 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'non-rp поведение', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пункту правил: [B]2.01[/B]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [B]Jail 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'non-rp вождение', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.03[/B]. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [B]Jail 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Уход от РП', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.02[/B]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [B]Jail 30 минут / Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'NonRP Обман', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.05[/B]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [B]PermBan[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Нонрп акс', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.52[/B]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [B]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Багоюз', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пункту правил:<br>[B]2.21[/B]. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [B]Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Баг аним', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.55[/B]. Запрещается багоюз связанный с анимацией в любых проявлениях. | [B]Jail 60 / 120 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Использование Читов', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пункту правил:<br>[B]2.22[/B]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [B]Ban 15 - 30 дней / PermBan[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#00FFFF]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Слив склада', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.09[/B]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [B]Ban 15 - 30 дней / PermBan[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Аморал. действия', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.08[/B]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [B]Jail 30 минут / Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Оск/Упом родни', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.04[/B]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [B]Mute 120 минут / Ban 7 - 15 дней[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Оск/Упом род в войс', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.15[/B]. Запрещено оскорблять игроков или родных в Voice Chat | [B]Mute 120 минут / Ban 7 - 15 дней[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Оскорбление', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.07[/B]. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Оск в ООС', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.03[/B]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Капс', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.02[/B]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Флуд', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.05[/B]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Музыка в войс', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.14[/B]. Запрещено включать музыку в Voice Chat | [B]Mute 60 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Шум в войс', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.16[/B]. Запрещено создавать посторонние шумы или звуки | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Реклама промо', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.21[/B]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [B]Ban 30 дней[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Торговля на тт госс', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.22[/B]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Религиозное и политическая пропаганда', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.18[/B]. Запрещено политическое и религиозное пропагандирование | [B]Mute 120 минут / Ban 10 дней[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Фейк аккаунт', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]4.10[/B]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [B]Устное замечание + смена игрового никнейма / PermBan[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Злоуп. знаками', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.06[/B]. Запрещено злоупотребление знаков препинания и прочих символов | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Транслит', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.01[/B]. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | [B]Устное замечание / Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Реклама сторонних ресурсов', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.31[/B]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [B]Ban 7 дней / PermBan[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Обман адм', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.32[/B]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [B]Ban 7 - 15 дней[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'IC и OCC угрозы', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.35[/B]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [B]Mute 120 минут / Ban 7 дней[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Уход от наказания', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.34[/B]. Запрещен уход от наказания | [B]Ban 15 - 30 дней[/B] (суммируется к общему наказанию дополнительно).[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Угрозы OOC', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пункту правил:<br>[B]2.37[/B]. Запрещены OOC угрозы, в том числе и завуалированные | [B]Mute 120 минут / Ban 7 дней[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Злоуп. наказаниями', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пункту правил:<br>[B]2.39[/B]. Злоупотребление нарушениями правил сервера | [B]Ban 7 - 30 дней[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Оск проекта', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.40[/B]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [B]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Продажа промо', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.43[/B]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [B]Mute 120 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Помеха РП процессу 2.51', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.51[/B]. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | [B]Jail 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Неув обр. к адм', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.54[/B]. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [B]Mute 180 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Спасатели эко', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.04[/B]. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [B]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Не отдал Долг', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.57[/B]. Запрещается брать в долг игровые ценности и не возвращать их. | [B]Ban 30 дней / permban[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Помеха блогерам', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.12[/B]. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | [B]Ban 7 дней[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Перенос конфликта', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.36[/B]. Запрещено переносить конфликты из IC в OOC и наоборот | [B]Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Аррест в казино', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]2.50[/B]. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [B]Ban 7 - 15 дней + увольнение из организации[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Слив СМИ', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.08[/B]. Запрещены любые формы «слива» посредством использования глобальных чатов | [B]PermBan[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Угрозы о наказании со стороны адм', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пункту правил:<br>[B]3.09[/B]. Запрещены любые угрозы о наказании игрока со стороны администрации | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Выдача себя за адм', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.10[/B]. Запрещена выдача себя за администратора, если таковым не являетесь | [B]Ban 7 - 15 + ЧС администрации[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Ввод в заблуждение', content: '[CENTER][COLOR=#778899]Игрок будет наказан по данному пункту правил:<br>[B]3.11[/B]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [B]Ban 15 - 30 дней / PermBan[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Нету /time', content: '[CENTER][COLOR=#778899]На ваших доказательствах отсутствует /time.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Не работают доква', content: '[CENTER][COLOR=#778899]Не работают доказательства.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Доква через запрет соц сети', content: '[CENTER][COLOR=#778899]3.6. Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Форма темы', content: '[CENTER][COLOR=#778899]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на игроков.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Укажите тайм-коды', content: '[CENTER][COLOR=#778899]В течении 24х часов укажите тайм-коды, иначе жалоба будет отказана.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]На рассмотрении...[/COLOR][/CENTER]', prefix: P.PIN },
            { title: 'Нарушений не найдено', content: '[CENTER][COLOR=#778899]Нарушений со стороны данного игрока не было найдено.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Ответ дан в прошлой ЖБ', content: '[CENTER][COLOR=#778899]Ответ был дан в прошлой жалобе.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Недостаточно доказательств', content: '[CENTER][COLOR=#778899]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Дублирование темы', content: '[CENTER][COLOR=#778899]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'В жалобы на адм', content: '[CENTER][COLOR=#778899]Вы ошиблись разделом.<br>Обратитесь в раздел Жалобы на администрацию.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'В обжалования', content: '[CENTER][COLOR=#778899]Вы ошиблись разделом.<br>Обратитесь в раздел Обжалование наказаний.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Заголовок не по форме', content: '[CENTER][COLOR=#778899]Заголовок вашей жалобы составлен не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на игроков.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Более 72 часов', content: '[CENTER][COLOR=#778899]С момента получения нарушения прошло более 72 часов.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Нету условий сделки', content: '[CENTER][COLOR=#778899]В данных доказательствах отсутствуют условия сделки.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Нужен фрапс', content: '[CENTER][COLOR=#778899]В таких случаях нужен фрапс.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Нужен фрапс + промотка', content: '[CENTER][COLOR=#778899]В таких случаях нужен фрапс + промотка чата.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Нужна промотка чата', content: '[CENTER][COLOR=#778899]В таких случаях нужна промотка чата.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Неполный фрапс', content: '[CENTER][COLOR=#778899]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Док-ва отредактированы', content: '[CENTER][COLOR=#778899]Ваши доказательства отредактированы.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'От 3-го лица', content: '[CENTER][COLOR=#778899]Жалобы от 3-их лиц не принимаются.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Ответный ДМ', content: '[CENTER][COLOR=#778899]В случае ответного ДМ нужен видео-запись. Пересоздайте тему и прикрепите видео-запись.[/COLOR][/CENTER]<br>[CENTER][COLOR=#00FFFF]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Ошиблись разделом', content: '[CENTER][COLOR=#778899]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Фотохостинги', content: '[CENTER][COLOR=#778899]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT }
        ],
        'gov': [
            { title: 'Исп. фрак т/с в личных целях', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]1.08[/B]. Запрещено использование фракционного транспорта в личных целях | [B]Jail 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'ДМ/Масс дм от МО', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]2.02[/B]. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | [B]Jail 30 минут / Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Н/П/Р/О (Объявы)', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]4.01[/B]. Запрещено редактирование объявлений, не соответствующих ПРО | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Н/П/П/Э (Эфиры)', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]4.02[/B]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [B]Mute 30 минут[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'ДМ/Масс от УМВД', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]6.01[/B]. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | [B]Jail 30 минут / Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Розыск без причины(УМВД)', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]6.02[/B]. Запрещено выдавать розыск без Role Play причины | [B]Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'nRP поведение (Умвд)', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]6.03[/B]. Запрещено nRP поведение | [B]Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'ДМ/Масс от ГИБДД', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]7.01[/B]. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | [B]Jail 30 минут / Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'nRP розыск', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]7.02[/B]. Запрещено выдавать розыск, штраф без Role Play причины | [B]Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Забирание В/У во время погони(ГИБДД)', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]7.04[/B]. Запрещено отбирать водительские права во время погони за нарушителем | [B]Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'ДМ/Масс от УФСБ', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: [B]8.01[/B]. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | [B]Jail 30 минут / Warn[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT }
        ],
        'opg': [
            { title: 'Нарушение правил В/Ч', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | [B]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Нападение на В/Ч через стену', content: '[CENTER][COLOR=#778899]Игрок будет наказан по пунтку правил: Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома | [B]/Warn NonRP В/Ч[/B].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Похищение/Ограбления нарушение правил', content: '[CENTER][COLOR=#778899]Игрок будет наказан за Нонрп Ограбление/Похищение в соответствии с правилами сервера.[/COLOR][/CENTER]<br>[CENTER][COLOR=#00F778899FFF]Спасибо за Ваше обращение!<br>Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT }
        ],
        'rp_bio': [
            { title: 'РП биография Одобрено', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#00FF00]Одобрено[/COLOR].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Орф и пунктуац ошибки', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Орфографические и пунктуационные ошибки.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Био от 1-го лица', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий[/COLOR].[/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Биография от 1-го лица.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Дата рождения некорректна', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий[/COLOR].[/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Дата рождения некорректна.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Информация не соответствует времени', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий[/COLOR].[/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Информация в пунктах не соответствует временным рамкам.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Возраст не совпал', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий[/COLOR].[/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Возраст не совпадает с датой рождения.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Слишком молод', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий[/COLOR].[/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Некорректен возраст (слишком молод).[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Биография скопирована', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий[/COLOR].[/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Биография скопирована.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Недостаточно РП информации', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий[/COLOR].[/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Недостаточно РП информации.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Не по форме bio', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий[/COLOR].[/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Биография не по форме.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Некоррект национальность', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий[/COLOR].[/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Некорректная национальность.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Заголовок не по форме bio', content: '[CENTER][COLOR=#778899]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#778899]Убедительная просьба ознакомиться с правилами написания RolePlay биографий[/COLOR].[/CENTER]<br>[CENTER][COLOR=#778899]Причина отказа: [COLOR=#FFFFFF]Заголовок темы не по форме.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT }
        ],
        'rp_sit': [
            { title: 'РП ситуация Одобрена', content: '[CENTER][COLOR=#778899]Ваша RolePlay ситуация была проверена и получает статус - [COLOR=#778899]Одобрено[/COLOR].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'РП ситуация на доработке', content: '[CENTER][COLOR=#778899]Вам дается 24 часа на дополнение Вашей РП ситуации[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.PIN },
            { title: 'РП ситуация отказ', content: '[CENTER][COLOR=#778899]Ваша РП ситуация получает статус-Отказано. Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT }
        ],
        'neof': [
            { title: 'Неофицальная Орг Одобрено', content: '[CENTER][COLOR=#778899]Ваша неофицальная организация получает статус-[COLOR=#00FF00]Одобрено[/COLOR].[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.ACCEPT },
            { title: 'Неофицальная Орг на доработке', content: '[CENTER][COLOR=#778899]Вам дается 24 часа на дополнение Вашей неофицальной организации.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.PIN },
            { title: 'Неофицальная Орг отказ', content: '[CENTER][COLOR=#778899]Ваша РП ситуация получает статус-Отказано. Причиной отказа могло послужить какое-либо нарушение из Правила создания неофицальной RolePlay организации.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Приятной игры на сервере WHITE.[/COLOR][/CENTER]', prefix: P.UNACCEPT }
        ],
        'admin_trans': [
            { title: 'Техническому специалисту', content: '[CENTER][COLOR=#778899]Ваша жалоба была передана на рассмотрение техническому специалисту.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Ожидайте ответа.[/COLOR][/CENTER]', prefix: P.TEX },
            { title: 'Передано ГА', content: '[CENTER][COLOR=#778899]Ваша жалоба была передана на рассмотрение Главному Администратору.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Ожидайте ответа.[/COLOR][/CENTER]', prefix: P.GA },
            { title: 'Передано руководству', content: '[CENTER][COLOR=#778899]Ваша жалоба была передана на рассмотрение Руководству Сервера.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Ожидайте ответа.[/COLOR][/CENTER]', prefix: P.PIN },
            { title: 'Передано ст адм', content: '[CENTER][COLOR=#778899]Ваша жалоба была передана на рассмотрение Старшей Администрации.[/COLOR][/CENTER]<br>[CENTER][COLOR=#778899]Ожидайте ответа.[/COLOR][/CENTER]', prefix: P.PIN }
        ]
    };
 
    const TABS = [
        { id: 'common', name: 'Основные' },
        { id: 'gov', name: 'Гос. Структуры' },
        { id: 'opg', name: 'ОПГ' },
        { id: 'rp_bio', name: 'РП Биографии' },
        { id: 'rp_sit', name: 'РП Ситуации' },
        { id: 'neof', name: 'Неоф. Орг' },
        { id: 'admin_trans', name: 'Передача' }
    ];
 
    function addIds(data) {
        for (const cat in data) {
            data[cat].forEach(tpl => {
                if(!tpl.id) tpl.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
                if(typeof tpl.isPinned === 'undefined') tpl.isPinned = false;
                if(typeof tpl.isNew === 'undefined') tpl.isNew = false;
            });
        }
        return data;
    }
 
    let TEMPLATES;
    let SETTINGS = { autoSubmit: false, floodControl: true, targetPath: 'all', customPath: '' };
    let floodInterval = null;
 
    try {
        const storedTemplates = localStorage.getItem(LOCAL_STORAGE_KEY);
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
 
        if (storedTemplates) {
            TEMPLATES = JSON.parse(storedTemplates);
            for (const cat in TEMPLATES) {
                TEMPLATES[cat].forEach(t => t.isNew = false);
            }
        } else {
            TEMPLATES = addIds(structuredClone(BASE_DATA));
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(TEMPLATES));
        }
 
        if (storedSettings) {
            SETTINGS = JSON.parse(storedSettings);
            if (typeof SETTINGS.floodControl === 'undefined') SETTINGS.floodControl = true;
            if (typeof SETTINGS.targetPath === 'undefined') SETTINGS.targetPath = 'all';
            if (typeof SETTINGS.customPath === 'undefined') SETTINGS.customPath = '';
        }
 
    } catch(e) {
        TEMPLATES = addIds(structuredClone(BASE_DATA));
    }
 
    let currentTab = 'common';
    let isManagementMode = false;
 
    const CSS = `
        :root {
            --primary: #8E2DE2; --secondary: #4A00E0; --accent: #00d2ff;
            --danger: #FF416C; --success: #00FF99; --gold: #FFD700;
            --glass-bg: rgba(20, 20, 25, 0.85); --glass-border: rgba(255, 255, 255, 0.1);
            --modal-radius: 16px; --easing: cubic-bezier(0.4, 0, 0.2, 1);
        }
 
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--accent); }
 
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes stripes { 0% { background-position: 0 0; } 100% { background-position: 50px 50px; } }
        @keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(255, 65, 108, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(255, 65, 108, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 65, 108, 0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
 
        .br-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); z-index: 9999; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.3s var(--easing); }
        .br-modal { background: linear-gradient(135deg, rgba(25, 25, 30, 0.95), rgba(35, 35, 45, 0.98)); border: 1px solid var(--glass-border); box-shadow: 0 20px 50px rgba(0,0,0,0.5); border-radius: var(--modal-radius); width: 1000px; max-width: 95%; height: 85vh; display: flex; flex-direction: column; color: #fff; font-family: 'Segoe UI', Roboto, sans-serif; animation: slideUp 0.4s var(--easing); position: relative; overflow: hidden; overscroll-behavior: contain; }
        .br-header { padding: 15px 30px; border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .br-header-left { display: flex; align-items: center; gap: 15px; }
        .br-avatar { width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--primary); transition: 0.4s var(--easing); cursor: pointer; object-fit: cover; }
        .br-avatar:hover { transform: scale(1.1) rotate(10deg); border-color: var(--accent); box-shadow: 0 0 15px var(--primary); }
        .br-title { font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
        .br-title span { background: linear-gradient(to right, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .br-search { flex-grow: 1; max-width: 300px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 10px 15px; border-radius: 20px; color: #fff; outline: none; transition: 0.3s; }
        .br-search:focus { border-color: var(--primary); box-shadow: 0 0 10px rgba(142, 45, 226, 0.3); background: rgba(255,255,255,0.1); }
        .br-close { font-size: 28px; cursor: pointer; color: #aaa; transition: 0.2s; line-height: 1; }
        .br-close:hover { color: #fff; transform: rotate(90deg); }
        .br-tabs { display: flex; gap: 10px; padding: 10px 30px; overflow-x: auto; border-bottom: 1px solid var(--glass-border); background: rgba(0,0,0,0.2); }
        .br-tab { padding: 8px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; color: #bbb; transition: 0.3s; border: 1px solid transparent; background: rgba(255,255,255,0.02); }
        .br-tab:hover { background: rgba(255,255,255,0.1); color: #fff; transform: translateY(-2px); }
        .br-tab.active { background: linear-gradient(135deg, rgba(142, 45, 226, 0.2), rgba(74, 0, 224, 0.2)); border-color: var(--primary); color: #fff; }
        .br-content { flex: 1; overflow-y: auto; padding: 25px 30px; overscroll-behavior: contain; }
        .br-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
        .br-card { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 12px; padding: 15px; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 8px; animation: slideUp 0.3s var(--easing); }
        .br-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.1); border-color: rgba(142, 45, 226, 0.4); }
        .br-card.pinned { border: 1px solid var(--gold); background: rgba(255, 215, 0, 0.05); }
        .br-card.pinned h3::after { content: '📌'; font-size: 12px; margin-left: 5px; }
        .br-card.new-item { border: 1px solid #00FF99; box-shadow: 0 0 10px rgba(0,255,153,0.2); background: rgba(0,255,153,0.05); }
        .br-new-badge { font-size:9px; background:#00FF99; color:#000; padding:2px 5px; border-radius:4px; margin-left:5px; font-weight:bold; }
        .br-card h3 { margin: 0; font-size: 15px; font-weight: 700; color: #eee; }
        .br-card p { margin: 0; font-size: 12px; color: #aaa; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
        .br-footer { padding: 15px 30px; border-top: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); }
        .br-btn { padding: 8px 20px; border-radius: 20px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.3s; }
        .br-btn-primary { background: linear-gradient(135deg, #8E2DE2, #4A00E0); color: #fff; box-shadow: 0 4px 15px rgba(142, 45, 226, 0.4); }
        .br-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(142, 45, 226, 0.6); }
        .br-btn-danger { background: rgba(255, 65, 108, 0.15); color: #ff416c; border: 1px solid #ff416c; }
        .br-btn-danger:hover { background: #ff416c; color: #fff; }
        .br-btn-success { background: rgba(0, 255, 153, 0.15); color: #00ff99; border: 1px solid #00ff99; }
        .br-btn-success:hover { background: #00ff99; color: #000; }
        .br-settings-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.3s; }
        .br-settings-btn:hover { background: rgba(255,255,255,0.1); border-color: var(--accent); box-shadow: 0 0 10px rgba(0, 210, 255, 0.3); }
        .br-manage-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; gap: 10px; opacity: 0; transition: 0.2s; pointer-events: none; }
        .br-card.edit-mode .br-manage-overlay { opacity: 1; pointer-events: auto; }
        .br-icon-btn { width: 34px; height: 34px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; font-size: 16px; transition: 0.2s; }
        .br-icon-edit { background: #2196F3; }
        .br-icon-delete { background: #f44336; }
        .br-icon-move { background: #9C27B0; }
        .br-icon-pin { background: #FFD700; color: #000; }
        .br-icon-btn:hover { transform: scale(1.15) rotate(5deg); }
        .br-checkbox-wrapper { display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 13px; cursor: pointer; user-select: none; }
        .br-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: var(--primary); }
        #br-btn-trigger, #br-btn-prefix { position: relative; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 12px; margin-right: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); transition: all 0.4s var(--easing); cursor: pointer; text-transform: uppercase; }
        #br-btn-trigger { background: linear-gradient(135deg, #8E2DE2, #4A00E0); }
        #br-btn-trigger:hover { transform: translateY(-3px); box-shadow: 0 0 20px rgba(142, 45, 226, 0.6); }
        #br-btn-prefix { background: linear-gradient(135deg, #11998e, #38ef7d); }
        #br-btn-prefix:hover { transform: translateY(-3px); box-shadow: 0 0 20px rgba(56, 239, 125, 0.6); }
 
        .flood-active {
            background: linear-gradient(45deg, #ff416c 25%, #ff4b2b 25%, #ff4b2b 50%, #ff416c 50%, #ff416c 75%, #ff4b2b 75%, #ff4b2b) !important;
            background-size: 40px 40px !important;
            border: 1px solid #ff416c !important;
            color: white !important;
            cursor: not-allowed !important;
            animation: stripes 1s linear infinite, pulseRed 2s infinite !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
            font-weight: 800 !important;
            letter-spacing: 1px !important;
        }
        .flood-active:active { animation: shake 0.5s !important; }
 
        .br-edit-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10002; display: flex; align-items: center; justify-content: center; }
        .br-edit-box { background: #1e1e24; border-radius: 12px; padding: 25px; width: 500px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid #333; animation: slideUp 0.3s; }
        .br-input-group { margin-bottom: 15px; }
        .br-input-group label { display: block; margin-bottom: 8px; color: #bbb; font-size: 13px; font-weight: 600; }
        .br-input { width: 100%; padding: 12px; background: #2b2b30; border: 1px solid #444; border-radius: 8px; color: #fff; box-sizing: border-box; outline: none; }
        .br-textarea { min-height: 150px; resize: vertical; font-family: monospace; font-size: 13px; }
        .br-edit-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .br-select { width: 100%; padding: 10px; background: #2b2b30; border: 1px solid #444; color: white; border-radius: 8px; }
        .br-prefix-menu { position: absolute; background: rgba(30, 30, 36, 0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; box-shadow: 0 15px 40px rgba(0,0,0,0.5); z-index: 9999; backdrop-filter: blur(10px); }
        .br-prefix-item { padding: 8px 14px; border-radius: 6px; color: #fff; font-size: 12px; font-weight: bold; text-align: center; cursor: pointer; transition: 0.3s; }
        .br-prefix-item:hover { transform: scale(1.05); filter: brightness(1.1); }
 
        @media (max-width: 768px) {
            .br-modal { width: 100%; height: 100%; border-radius: 0; }
            .br-header { flex-direction: column; gap: 8px; padding: 10px; }
            .br-header-left { width: 100%; justify-content: center; }
            .br-search { width: 100%; max-width: none; margin: 0; font-size: 12px; padding: 8px 12px; }
            .br-close { position: absolute; top: 10px; right: 15px; }
            .br-footer { flex-direction: column; gap: 8px; padding: 10px; }
            .br-footer > div { width: 100%; display: flex; flex-direction: column; gap: 8px; }
            .br-btn { width: 100%; font-size: 12px; padding: 10px; }
            .br-settings-btn { width: 100%; text-align: center; font-size: 11px; padding: 8px; }
            .br-checkbox-wrapper { justify-content: center; font-size: 12px; }
            .br-grid { grid-template-columns: 1fr; gap: 10px; }
            .br-card { padding: 12px; }
            .br-card h3 { font-size: 14px; }
            .br-card p { font-size: 11px; }
            #br-btn-trigger, #br-btn-prefix { font-size: 10px; padding: 6px 12px; }
        }
    `;
 
    $(document).ready(() => {
        $('head').append(`<style>${CSS}</style>`);
        checkFloodStatus();
        initScript();
 
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand("BR Script: Сброс настроек", () => {
                if(confirm("Сбросить все настройки и разделы скрипта?")) {
                    localStorage.removeItem(SETTINGS_KEY);
                    location.reload();
                }
            });
        }
    });
 
    function checkScope() {
        if (SETTINGS.targetPath === 'all') return true;
 
        const currentUrl = window.location.href.toLowerCase();
        const breadcrumbs = $('.p-breadcrumbs').text().toLowerCase();
 
        if (SETTINGS.targetPath === 'custom' && SETTINGS.customPath) {
            const custom = SETTINGS.customPath.toLowerCase();
            return currentUrl.includes(custom) || breadcrumbs.includes(custom);
        }
 
        const keywords = SCOPE_KEYWORDS[SETTINGS.targetPath];
        if (keywords) {
            return keywords.some(k => currentUrl.includes(k) || breadcrumbs.includes(k));
        }
 
        return false;
    }
 
    function initScript() {
        if (!checkScope()) {
            return;
        }
 
        const $replyBtn = $('button.button--icon--reply').first();
        if ($replyBtn.length) {
            const $btnContainer = $('<div style="display:inline-flex; align-items:center; vertical-align:middle; flex-wrap:wrap;"></div>');
            const $btn = $(`<button type="button" id="br-btn-trigger">ОТВЕТЫ</button>`);
            const $btnPrefix = $(`<button type="button" id="br-btn-prefix">ПРЕФИКСЫ</button>`);
 
            $btnContainer.append($btn).append($btnPrefix);
            $replyBtn.before($btnContainer);
 
            $btn.click((e) => openModal());
            $btnPrefix.click((e) => { e.stopPropagation(); openPrefixMenu($btnPrefix); });
        }
    }
 
    function checkFloodStatus() {
        if (!SETTINGS.floodControl) return;
        const storedFloodTime = localStorage.getItem(FLOOD_STORAGE_KEY);
        if (storedFloodTime) {
            const targetTime = parseInt(storedFloodTime, 10);
            const now = Date.now();
            if (targetTime > now) {
                const remainingSeconds = Math.ceil((targetTime - now) / 1000);
                startFloodTimer(remainingSeconds);
            } else {
                localStorage.removeItem(FLOOD_STORAGE_KEY);
            }
        }
    }
 
    function attemptSubmit() {
        const $existingError = $('.overlay-container .blockMessage, .blockMessage');
        if ($existingError.length && $existingError.text().includes('подождать')) {
            handleFlood($existingError.text());
            return;
        }
 
        if (!SETTINGS.floodControl) {
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
            return;
        }
 
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
 
        let checkCount = 0;
        const checkInterval = setInterval(() => {
            checkCount++;
            const $error = $('.overlay-container .blockMessage, .blockMessage');
            if ($error.length && $error.text().includes('подождать')) {
                clearInterval(checkInterval);
                const text = $error.text();
                handleFlood(text);
            }
            if (checkCount > 20) clearInterval(checkInterval);
        }, 100);
    }
 
    function handleFlood(text) {
        const match = text.match(/(\d+)\s*(секунд|минут)/);
        if (match && match[1]) {
            let seconds = parseInt(match[1]);
            if (match[2].includes('минут')) {
                seconds *= 60;
            }
            const targetTime = Date.now() + (seconds * 1000);
            localStorage.setItem(FLOOD_STORAGE_KEY, targetTime.toString());
            const editorText = $('.fr-element.fr-view').html();
            localStorage.setItem(PENDING_CONTENT_KEY, editorText);
            startFloodTimer(seconds);
        }
    }
 
    function updateReplyButtonState(timeLeft) {
        const $mainButton = $('.button--icon--reply').last();
        const $spanText = $mainButton.find('.button-text');
        if (timeLeft > 0) {
            $mainButton.addClass('flood-active');
            if (!$mainButton.data('original-text')) $mainButton.data('original-text', $spanText.text());
            $spanText.html(`🚧 ЖДИТЕ ${timeLeft}с 🚧`);
            $mainButton.off('click.blocker').on('click.blocker', (e) => { e.stopImmediatePropagation(); e.preventDefault(); });
        } else {
            $mainButton.removeClass('flood-active');
            const original = $mainButton.data('original-text');
            if (original) $spanText.text(original);
            $mainButton.off('click.blocker');
        }
    }
 
    function startFloodTimer(seconds) {
        if (!SETTINGS.floodControl) return;
        $('.overlay-container').hide();
        let timeLeft = seconds;
        updateReplyButtonState(timeLeft);
        if (floodInterval) clearInterval(floodInterval);
 
        floodInterval = setInterval(() => {
            timeLeft--;
            updateReplyButtonState(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(floodInterval);
                localStorage.removeItem(FLOOD_STORAGE_KEY);
                updateReplyButtonState(0);
 
                const pendingContent = localStorage.getItem(PENDING_CONTENT_KEY);
                if (pendingContent) {
                    const $editor = $('.fr-element.fr-view');
                    if ($editor.length) {
                        $editor.html(pendingContent);
                        $editor.trigger('input').trigger('keyup').focus();
                    }
                    localStorage.removeItem(PENDING_CONTENT_KEY);
                }
 
                if (SETTINGS.autoSubmit) {
                    setTimeout(() => {
                        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
                    }, 500);
                }
            }
        }, 1000);
    }
 
    function layoutMap(str) {
        if (!str) return str;
        const map = {
            'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з', '[': 'х', ']': 'ъ',
            'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д', ';': 'ж', '\'': 'э',
            'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь', ',': 'б', '.': 'ю',
            'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[', 'ъ': ']',
            'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';', 'э': '\'',
            'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm', 'б': ',', 'ю': '.'
        };
        return str.split('').map(char => map[char] || char).join('');
    }
 
    function normalizeText(text) {
        if (!text) return "";
        let t = text.toLowerCase().replace(/\s+/g, ' ');
        t = t.replace(/(.)\1+/g, '$1');
        return t;
    }
 
    function fuzzySearch(query, text) {
        if (!query) return true;
        const nText = normalizeText(text);
        const nQuery = normalizeText(query);
        const mappedQuery = normalizeText(layoutMap(query));
        return nText.includes(nQuery) || nText.includes(mappedQuery);
    }
 
    function openPrefixMenu($target) {
        if ($('.br-prefix-menu').length) { $('.br-prefix-menu').remove(); return; }
        const prefixes = [
            { id: P.ACCEPT, name: 'Одобрено', color: '#00AA44' }, { id: P.UNACCEPT, name: 'Отказано', color: '#FF3B30' },
            { id: P.PIN, name: 'На рассмотрении', color: '#E6B800' }, { id: P.RESHENO, name: 'Решено', color: '#0080FF' },
            { id: P.CLOSE, name: 'Закрыто', color: '#888888' }, { id: P.WATCHED, name: 'Рассмотрено', color: '#E6B800' },
            { id: P.GA, name: 'Главному Адм', color: '#8A2BE2' }, { id: P.TEX, name: 'Тех. Спецу', color: '#FF8C00' },
            { id: P.REALIZOVANO, name: 'Реализовано', color: '#00AA44' }, { id: P.OJIDANIE, name: 'Ожидание', color: '#777' }
        ];
        const $menu = $('<div class="br-prefix-menu"></div>');
        prefixes.forEach(p => {
            const $item = $(`<div class="br-prefix-item" style="background:${p.color}">${p.name}</div>`);
            $item.click(() => { setPrefix(p.id); $menu.remove(); });
            $menu.append($item);
        });
        $('body').append($menu);
        const offset = $target.offset();
        $menu.css({ top: offset.top + 40, left: offset.left });
        $(document).one('click', () => $menu.remove());
        $menu.click(e => e.stopPropagation());
    }
 
    function openModal() {
        if ($('.br-modal-overlay').length) return;
        $('body').css('overflow', 'hidden');
 
        const modalHtml = `
            <div class="br-modal-overlay">
                <div class="br-modal">
                    <div class="br-header">
                        <div class="br-header-left">
                            <a href="${VK_LINK}" target="_blank">
                                <img src="${AVATAR_URL}" class="br-avatar" title="vk.com/imaginemp">
                            </a>
                            <div class="br-title">BR <span>Curators</span> v29</div>
                        </div>
                        <input type="text" class="br-search" placeholder="Поиск (egjv -> упом)...">
                        <div class="br-close">×</div>
                    </div>
                    <div class="br-tabs">
                        ${TABS.map(t => `<div class="br-tab ${t.id === currentTab ? 'active' : ''}" data-tab="${t.id}">${t.name}</div>`).join('')}
                    </div>
                    <div class="br-content">
                        <div class="br-grid"></div>
                    </div>
                    <div class="br-footer">
                        <div style="display:flex; align-items:center; gap: 15px; flex-wrap: wrap;">
                            <label class="br-checkbox-wrapper">
                                <input type="checkbox" class="br-checkbox" id="auto-submit-check" ${SETTINGS.autoSubmit ? 'checked' : ''}>
                                Авто-отправка
                            </label>
                             <label class="br-checkbox-wrapper">
                                <input type="checkbox" class="br-checkbox" id="flood-control-check" ${SETTINGS.floodControl ? 'checked' : ''}>
                                Умный Timer
                            </label>
                            <button class="br-settings-btn" id="open-scope-settings">
                                🌐 ${SCOPES[SETTINGS.targetPath] || 'Настройка пути'}
                            </button>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="br-btn br-btn-primary" id="create-template">Создать</button>
                            <button class="br-btn ${isManagementMode ? 'br-btn-success' : 'br-btn-danger'}" id="toggle-manage">
                                ${isManagementMode ? 'Сохранить' : 'Редактировать'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
 
        $('body').append(modalHtml);
        renderCards();
        setupListeners();
    }
 
    function setupListeners() {
        $('.br-close, .br-modal-overlay').on('click', function(e) {
            if (e.target === this || $(this).hasClass('br-close')) {
                $('.br-modal-overlay').remove();
                $('body').css('overflow', '');
            }
        });
 
        $('.br-tab').click(function() {
            $('.br-tab').removeClass('active'); $(this).addClass('active');
            currentTab = $(this).data('tab'); $('.br-search').val(''); renderCards();
        });
 
        $('.br-search').on('input', function() { renderCards($(this).val()); });
 
        $('#toggle-manage').click(function() {
            isManagementMode = !isManagementMode;
            $(this).text(isManagementMode ? 'Сохранить' : 'Редактировать').toggleClass('br-btn-danger br-btn-success');
            renderCards();
        });
 
        $('#create-template').click(openCreateDialog);
 
        $('#auto-submit-check').change(function() {
            SETTINGS.autoSubmit = $(this).is(':checked'); localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
        });
        $('#flood-control-check').change(function() {
            SETTINGS.floodControl = $(this).is(':checked'); localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
        });
 
        $('#open-scope-settings').click(openScopeDialog);
    }
 
    function renderCards(filter = "") {
        const $grid = $('.br-grid');
        $grid.empty();
 
        let items = TEMPLATES[currentTab] || [];
        if (filter) {
            items = [];
            Object.values(TEMPLATES).forEach(list => items.push(...list));
            items = items.filter(i => fuzzySearch(filter, i.title));
        }
 
        items.sort((a, b) => {
            if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
            if (a.isNew !== b.isNew) return b.isNew ? 1 : -1;
            return 0;
        });
 
        items.forEach((tpl) => {
            const shortText = tpl.content.replace(/\[.*?\]/g, '').replace(/<.*?>/g, '').substring(0, 80);
            const prefixName = PREFIX_NAMES[tpl.prefix] || 'Без префикса';
            const pinnedClass = tpl.isPinned ? 'pinned' : '';
            const newClass = tpl.isNew ? 'new-item' : '';
            const newBadge = tpl.isNew ? '<span class="br-new-badge">NEW</span>' : '';
 
            const $card = $(`
                <div class="br-card ${pinnedClass} ${newClass} ${isManagementMode ? 'edit-mode' : ''}">
                    <h3>${tpl.title} ${newBadge} <span style="font-size:10px; opacity:0.6; font-weight:400;">[${prefixName}]</span></h3>
                    <p>${shortText}...</p>
                    <div class="br-manage-overlay">
                        <button class="br-icon-btn br-icon-edit" title="Изменить">✎</button>
                        <button class="br-icon-btn br-icon-pin" title="Закрепить">${tpl.isPinned ? '★' : '📌'}</button>
                        <button class="br-icon-btn br-icon-move" title="Переместить">📂</button>
                        <button class="br-icon-btn br-icon-delete" title="Удалить">🗑</button>
                    </div>
                </div>
            `);
 
            if (!isManagementMode) {
                $card.click(() => { insertTemplate(tpl); $('.br-modal-overlay').remove(); $('body').css('overflow', ''); });
            } else {
                $card.find('.br-icon-edit').click(() => openEditDialog(tpl));
                $card.find('.br-icon-delete').click(() => deleteTemplate(tpl.id, currentTab));
                $card.find('.br-icon-move').click(() => openMoveDialog(tpl, currentTab));
                $card.find('.br-icon-pin').click(() => {
                    tpl.isPinned = !tpl.isPinned;
                    saveData(); renderCards();
                });
            }
            $grid.append($card);
        });
    }
 
    function openScopeDialog() {
        const dialogHtml = `
            <div class="br-edit-modal">
                <div class="br-edit-box" style="width: 400px;">
                    <h3>Где показывать скрипт?</h3>
                    <div class="br-input-group">
                        <label>Выберите раздел</label>
                        <select class="br-select" id="scope-select">
                            <option value="all" ${SETTINGS.targetPath === 'all' ? 'selected' : ''}>Везде</option>
                            <option value="players" ${SETTINGS.targetPath === 'players' ? 'selected' : ''}>Жалобы на игроков</option>
                            <option value="admins" ${SETTINGS.targetPath === 'admins' ? 'selected' : ''}>Жалобы на администрацию</option>
                            <option value="appeals" ${SETTINGS.targetPath === 'appeals' ? 'selected' : ''}>Обжалования наказаний</option>
                            <option value="custom" ${SETTINGS.targetPath === 'custom' ? 'selected' : ''}>Свой путь (URL)</option>
                        </select>
                    </div>
                    <div class="br-input-group" id="custom-path-group" style="display: ${SETTINGS.targetPath === 'custom' ? 'block' : 'none'};">
                        <label>Часть ссылки (например: "Жалобы-на-лидеров")</label>
                        <input class="br-input" id="custom-path-input" value="${SETTINGS.customPath}">
                    </div>
                    <div class="br-edit-actions">
                        <button class="br-btn br-btn-danger" id="cancel-scope">Отмена</button>
                        <button class="br-btn br-btn-primary" id="save-scope">Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(dialogHtml);
 
        $('#scope-select').change(function() {
            if ($(this).val() === 'custom') $('#custom-path-group').slideDown();
            else $('#custom-path-group').slideUp();
        });
 
        $('#cancel-scope').click(() => $('.br-edit-modal').remove());
        $('#save-scope').click(() => {
            SETTINGS.targetPath = $('#scope-select').val();
            SETTINGS.customPath = $('#custom-path-input').val();
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
            location.reload();
        });
    }
 
    function deleteTemplate(id, category) {
        if(confirm('Удалить?')) {
            TEMPLATES[category] = TEMPLATES[category].filter(t => t.id !== id);
            saveData(); renderCards();
        }
    }
 
    function openMoveDialog(tpl, currentCat) {
        const options = TABS.map(t => `<option value="${t.id}" ${t.id === currentCat ? 'disabled' : ''}>${t.name}</option>`).join('');
        const dialogHtml = `
            <div class="br-edit-modal">
                <div class="br-edit-box" style="width: 300px;">
                    <h3>Переместить</h3>
                    <select class="br-select" id="move-select">${options}</select>
                    <div class="br-edit-actions">
                        <button class="br-btn br-btn-danger" id="cancel-move">Отмена</button>
                        <button class="br-btn br-btn-primary" id="save-move">ОК</button>
                    </div>
                </div>
            </div>`;
        $('body').append(dialogHtml);
        $('#cancel-move').click(() => $('.br-edit-modal').remove());
        $('#save-move').click(() => {
            TEMPLATES[currentCat] = TEMPLATES[currentCat].filter(t => t.id !== tpl.id);
            TEMPLATES[$('#move-select').val()].push(tpl);
            saveData(); $('.br-edit-modal').remove(); renderCards();
        });
    }
 
    function getPrefixOptions(selectedId) {
        let html = '';
        for (const [id, name] of Object.entries(PREFIX_NAMES)) html += `<option value="${id}" ${parseInt(id) === parseInt(selectedId) ? 'selected' : ''}>${name}</option>`;
        return html;
    }
 
    function openCreateDialog() {
        const dialogHtml = `
            <div class="br-edit-modal">
                <div class="br-edit-box">
                    <h3>Создать шаблон</h3>
                    <div class="br-input-group"><label>Заголовок</label><input class="br-input" id="new-tpl-title" placeholder="Введите заголовок..."></div>
                    <div class="br-input-group"><label>Префикс</label><select class="br-select" id="new-tpl-prefix">${getPrefixOptions(0)}</select></div>
                    <div class="br-input-group"><label>Текст (Только суть)</label><textarea class="br-input br-textarea" id="new-tpl-content" placeholder="Напишите здесь только суть ответа. Приветствие и подвал добавятся сами."></textarea></div>
                    <div class="br-edit-actions">
                        <button class="br-btn br-btn-danger" id="cancel-create">Отмена</button>
                        <button class="br-btn br-btn-primary" id="save-create">Создать</button>
                    </div>
                </div>
            </div>`;
        $('body').append(dialogHtml);
        const $textarea = $('#new-tpl-content');
        $textarea.focus();
 
        $('#cancel-create').click(() => $('.br-edit-modal').remove());
        $('#save-create').click(() => {
            const title = $('#new-tpl-title').val();
            const content = $('#new-tpl-content').val();
            if(title && content) {
                if (!TEMPLATES[currentTab]) TEMPLATES[currentTab] = [];
                TEMPLATES[currentTab].push({ id: Date.now().toString(), title, content, prefix: parseInt($('#new-tpl-prefix').val()), isPinned: false, isNew: true });
                saveData(); $('.br-edit-modal').remove(); renderCards();
            }
        });
    }
 
    function openEditDialog(tpl) {
        const dialogHtml = `
            <div class="br-edit-modal">
                <div class="br-edit-box">
                    <h3>Редактирование</h3>
                    <div class="br-input-group"><label>Заголовок</label><input class="br-input" id="tpl-title" value="${tpl.title}"></div>
                    <div class="br-input-group"><label>Префикс</label><select class="br-select" id="tpl-prefix">${getPrefixOptions(tpl.prefix)}</select></div>
                    <div class="br-input-group"><label>Текст</label><textarea class="br-input br-textarea" id="tpl-content">${tpl.content}</textarea></div>
                    <div class="br-edit-actions">
                        <button class="br-btn br-btn-danger" id="cancel-edit">Отмена</button>
                        <button class="br-btn br-btn-primary" id="save-edit">Сохранить</button>
                    </div>
                </div>
            </div>`;
        $('body').append(dialogHtml);
        $('#cancel-edit').click(() => $('.br-edit-modal').remove());
        $('#save-edit').click(() => {
            tpl.title = $('#tpl-title').val(); tpl.content = $('#tpl-content').val(); tpl.prefix = parseInt($('#tpl-prefix').val());
            saveData(); $('.br-edit-modal').remove(); renderCards();
        });
    }
 
    function saveData() { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(TEMPLATES)); }
 
    function insertTemplate(tpl) {
        const authorLink = $('a.username').first();
        const authorName = authorLink.text().trim();
        const authorID = authorLink.attr('data-user-id') || '';
        const hours = new Date().getHours();
        const greeting = hours >= 4 && hours < 12 ? 'Доброе утро' : hours >= 12 && hours < 18 ? 'Добрый день' : hours >= 18 ? 'Добрый вечер' : 'Доброй ночи';
 
        const s = { 8: {t:'одобрено',c:'#00AA44'}, 4: {t:'отказано',c:'#FF3B30'}, 7: {t:'закрыто',c:'#888888'}, 2: {t:'на рассмотрении',c:'#E6B800'}, 12: {t:'передано га',c:'#8A2BE2'}, 13: {t:'тех. специалисту',c:'#FF8C00'}, 6: {t:'решено',c:'#0080FF'}, 0: {t:'',c:'#FFFFFF'} }[tpl.prefix] || {t:'',c:'#FFFFFF'};
 
        let bodyContent = tpl.content.replace(/\[url=.*?\]\[img\].*?\[\/img\]\[\/url\]/g, '').replace(/\[img\].*?\[\/img\]/g, '');
 
        let footerBlock = '';
        if (s.t) {
            footerBlock = `<br><div style="text-align:center"><img src="${BOTTOM_IMG}" style="max-width:300px;border-radius:6px;margin-bottom:5px;"><div style="font-size:12px;font-weight:bold;text-transform:lowercase;color:${s.c}">${s.t}</div></div>`;
        } else {
             footerBlock = `<br><div style="text-align:center"><img src="${BOTTOM_IMG}" style="max-width:300px;border-radius:6px;margin-bottom:5px;"></div>`;
        }
 
        if (!bodyContent.includes('[CENTER]')) {
             bodyContent = `[CENTER][COLOR=#FFFF00]${bodyContent}[/COLOR][/CENTER]<br>[CENTER][COLOR=#00FFFF]Спасибо за Ваше обращение!<br>Приятной игры.[/COLOR][/CENTER]`;
        }
 
        let finalHtml = `[CENTER][B][COLOR=#778899]Доброго времени суток, уважаемый {{ user.mention }} [/COLOR][/B][/CENTER]<br><br>` + bodyContent + footerBlock;
        finalHtml = finalHtml.replace(/{{\s*user\.name\s*}}/g, authorName).replace(/{{\s*user\.mention\s*}}/g, authorID ? `[USER=${authorID}]${authorName}[/USER]` : authorName).replace(/{{\s*greeting\s*}}/g, greeting);
 
        const $editor = $('.fr-element.fr-view');
        if ($editor.length) {
            $editor.html(finalHtml);
        }
 
        $('a.overlay-titleCloser').trigger('click');
 
        if (tpl.prefix) setPrefix(tpl.prefix);
        if (SETTINGS.autoSubmit) attemptSubmit();
    }
 
    function setPrefix(id) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
        const formData = new FormData();
        formData.append('prefix_id', id); formData.append('title', threadTitle); formData.append('_xfToken', XF.config.csrf);
        formData.append('_xfRequestUri', window.location.pathname); formData.append('_xfWithData', 1); formData.append('_xfResponseType', 'json');
        formData.append('discussion_open', [2,12,13,14].includes(id) ? 1 : 0);
        formData.append('sticky', [2,12,13,14].includes(id) ? 1 : 0);
 
        fetch(window.location.pathname + 'edit', { method: 'POST', body: formData }).then(r => r.json()).then(d => {
            if (d.status === 'ok' && SETTINGS.autoSubmit) location.reload();
        });
    }
})();