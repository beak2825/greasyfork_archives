// ==UserScript==
// @name         Скрипт для КФ (жалобы) 010101
// @namespace    https://forum.blackrussia.online/
// @version      1.3.2
// @description  by David_Goggins 
// @author       David_Goggins  
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/*
// @match        https://forum.blackrussia.online/forums*
// @include      https://forum.blackrussia.online/forums
// @grant        none
// @license      MIT            
// @collaborator Kuk
// @icon         https://avatars.mds.yandex.net/i?id=e7371f38fb4d7fe174b4362d628c7f74-4988204-images-thumbs&n=13
// @copyright    2021, Kuk (https://openuserjs.org/users/Kuk)
// @downloadURL https://update.greasyfork.org/scripts/553498/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%28%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%29%20010101.user.js
// @updateURL https://update.greasyfork.org/scripts/553498/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%28%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%29%20010101.meta.js
// ==/UserScript==

// ==UserScript==
// @name David_Goggins (Жалобы)
// @namespace https://forum.blackrussia.online/
// @version 26.2
// @description stay hard
// @author David_Goggins / Artem_Gogol (Финальное Объединение)
// @match https://forum.blackrussia.online/threads/*
// @grant none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js
// ==/UserScript==


(function() {
    'use strict';

    // --- КОНСТАНТЫ ПРЕФИКСОВ ---
    const VAJNO_PREFIX = 1;
    const NARASSSMOTRENII_PREFIX = 2;
    const BEZPREFIXA_PREFIX = 3;
    const OTKAZANO_PREFIX = 4;
    const REALIZOVANNO_PREFIX = 5;
    const RESHENO_PREFIX = 6;
    const ZAKRITO_PREFIX = 7;
    const ODOBRENO_PREFIX = 8;
    const RASSMORTENO_PREFIX = 9;
    const KOMANDEPROEKTA_PREFIX = 10;
    const SPECADMINY_PREFIX = 11;
    const GLAVNOMYADMINY_PREFIX = 12;
    const TEXSPECY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const PROVERENOKONTRKACH_PREFIX = 15;

    // --- ССЫЛКИ НА БАННЕРЫ ---
    const APPROVED_BANNER_URL = 'https://i.postimg.cc/sgkL5vvb/1618083711121.png';
    const NEW_BANNER_BBCODE = '[B][CENTER][url=https://postimages.org/][img]' + APPROVED_BANNER_URL + '[/img][/url][/CENTER][/B]';
    const FOOTER_LINKS =
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]\n' +
        "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]\n" +
        "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL][/FONT][/SIZE][/RIGHT]";

    // --- ФУНКЦИИ ГЕНЕРАЦИИ КОНТЕНТА ---

    function generateComplaintContent(status, punishment, rule, reason = "") {
        let statusColor, statusText;
        switch (status) {
            case 'ODOBRENO': statusColor = '#00FF00'; statusText = '✔️ Одобрено, закрыто.'; break;
            case 'RASSMOTR': statusColor = '#FFC000'; statusText = 'Ожидайте ответа...'; break;
            case 'OTKAZANO': case 'ZAKRITO': statusColor = '#FF0000'; statusText = status === 'OTKAZANO' ? '❌ Отказано, закрыто.' : '❌ Закрыто.'; break;
        }
        let mainContent = '';
        if (rule && punishment && rule !== 'N/A') {
            mainContent = "[CENTER][SIZE=5][COLOR=#000000]Игрок будет наказан по данному пункту правил:[/COLOR][/SIZE][/CENTER]\n\n" + "[CENTER][COLOR=#FF0000][B]" + rule + "[/B][/COLOR][/CENTER]\n" + "[CENTER][SIZE=5][COLOR=#000000]Наказание: [COLOR=#FF0000]" + punishment + "[/COLOR][/COLOR][/SIZE][/CENTER]";
        }
        if (reason && reason.trim().length > 0) {
            mainContent += (mainContent.length > 0 ? "\n\n" : "") + "[CENTER][SIZE=5][COLOR=#000000]Результат проверки:[/COLOR][/SIZE][/CENTER]\n\n" + "[CENTER][COLOR=#FF0000][B]" + reason + "[/B][/COLOR][/CENTER]";
        }
        if (mainContent.length === 0 && punishment && punishment.trim().length > 0) {
            mainContent = "[CENTER][SIZE=5][COLOR=#000000]" + punishment + "[/COLOR][/SIZE][/CENTER]";
        }
        return (
            NEW_BANNER_BBCODE + "\n\n" + "[B][CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }}[/COLOR][/CENTER][/B]\n\n" +
            mainContent + "\n\n" +
            "[CENTER][SIZE=5][COLOR=#000000]Статус: [COLOR=" + statusColor + "]" + statusText + "[/COLOR][/COLOR][/SIZE][/CENTER]\n\n" +
            "[CENTER][SIZE=5][COLOR=#000000]Приятной игры![/COLOR][/SIZE][/CENTER]\n\n" +
            NEW_BANNER_BBCODE + "\n\n" + FOOTER_LINKS
        );
    }

    // --- МАССИВ ШАБЛОНОВ ЖАЛОБ (ПОЛНЫЙ) ---
    const buttons = [
        { title: '______________________________________ЖАЛОБЫ НА ИГРОКОВ______________________________________' },
        { title: '✔️ ОДОБРЕНО, ЗАКРЫТО (ОБЩАЯ)', content: generateComplaintContent('ODOBRENO', 'Игрок будет наказан.', 'N/A', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 2 }, // 2 колонки
        { title: '🟡 НА РАССМОТРЕНИИ...', content: generateComplaintContent('RASSMOTR', 'Ожидайте ответа.', '', 'Ваша жалоба взята на рассмотрение. Просьба ожидать ответа и не создавать дубликаты данной темы.'), prefix: NARASSSMOTRENII_PREFIX, status: true, close: false, grid_col: 2 }, // 2 колонки
        { title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила игрового процесса - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' },
        { title: '✔️ NonRP поведение', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 }, // 5 колонок
        { title: '✔️ Уход от RP', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут / Warn', '2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP вождение', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '2.03. Запрещён NonRP Drive', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Помеха игровому процессу', content: generateComplaintContent('ODOBRENO', 'Ban 10 дней / Обнуление аккаунта', '2.04. Запрещены любые действия способные привести к помехам в игровом процессе', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP обман/Попытка обмана', content: generateComplaintContent('ODOBRENO', 'PermBan', '2.05. Запрещены любые OOC обманы и их попытки', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Аморальные действия', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут / Warn', '2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Аморальные действия (искл. обоюдка)', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут / Warn', '2.08. Запрещена любая форма аморальных действий... [Исключение: обоюдное согласие]', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Слив склада/Слив семьи', content: generateComplaintContent('ODOBRENO', 'Ban 15 - 30 дней / PermBan', '2.09. Запрещено сливать склад фракции / семьи', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Обман в /do', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут / Warn', '2.10. Запрещено в любой форме обманывать в /do', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Рабочий транспорт в л/ц', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '2.11. Запрещено использование рабочего или фракционного транспорта в личных целях', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Помеха блогерам', content: generateComplaintContent('ODOBRENO', 'Ban 7 дней', '2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц)', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ DB', content: generateComplaintContent('ODOBRENO', 'Jail 60 минут', '2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ TK', content: generateComplaintContent('ODOBRENO', 'Jail 60 минут / Warn', '2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ SK', content: generateComplaintContent('ODOBRENO', 'Jail 60 минут / Warn', '2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ MG', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '2.18. Запрещен MG (MetaGaming) — использование ООС информации', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ DM', content: generateComplaintContent('ODOBRENO', 'Jail 60 минут', '2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Mass DM', content: generateComplaintContent('ODOBRENO', 'Warn / Ban 3 - 7 дней', '2.20. Запрещен Mass DM — убийство или нанесение урона без веской IC причины трем игрокам и более', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Стороннее ПО', content: generateComplaintContent('ODOBRENO', 'Ban 15 - 30 дней / PermBan', '2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Сокрытие нарушителей', content: generateComplaintContent('ODOBRENO', 'Ban 15 - 30 дней / PermBan + ЧС проекта', '2.24. Запрещено скрывать от администрации нарушителей или злоумышленников', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Реклама', content: generateComplaintContent('ODOBRENO', 'Ban 7 дней / PermBan', '2.31. Запрещено рекламировать на серверах любые проекты', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Обман адм/Ввод в заблуждение', content: generateComplaintContent('ODOBRENO', 'Ban 7 - 15 дней', '2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Уязвимость правил', content: generateComplaintContent('ODOBRENO', 'Ban 15 - 30 дней / PermBan', '2.33. Запрещено пользоваться уязвимостью правил', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Нац./религ. конфликты', content: generateComplaintContent('ODOBRENO', 'Mute 120 минут / Ban 7 дней', '2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ OOC угрозы', content: generateComplaintContent('ODOBRENO', 'Mute 120 минут / Ban 7 - 15 дней', '2.37. Запрещены OOC-угрозы', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Слив личной информации', content: generateComplaintContent('ODOBRENO', 'Ban 15 - 30 дней / PermBan + ЧС проекта', '2.38. Запрещено распространять личную информацию игроков и их родственников', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Злоупотребление нарушениями', content: generateComplaintContent('ODOBRENO', 'Ban 7 - 15 дней', '2.39. Злоупотребление нарушениями правил сервера', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Оск проекта', content: generateComplaintContent('ODOBRENO', 'Mute 300 минут / Ban 30 дней', '2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Продажа промо', content: generateComplaintContent('ODOBRENO', 'Mute 120 минут', '2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP вождение(фура)', content: generateComplaintContent('ODOBRENO', 'Jail 60 минут', '2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP акс', content: generateComplaintContent('ODOBRENO', 'Обнуление аксессуаров + JAIL 30 минут', '2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Оск администрации', content: generateComplaintContent('ODOBRENO', 'Mute 180 минут', '2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Багоюз анимации', content: generateComplaintContent('ODOBRENO', 'Jail 120 минут', '2.55. Запрещается багоюз, связанный с анимацией в любых проявлениях', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Невозврат долга', content: generateComplaintContent('ODOBRENO', 'Ban 30 дней / permban', '2.57. Запрещается брать в долг игровые ценности и не возвращать их', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила игрового чата - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' },
        { title: '✔️ CapsLock', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '3.02. Запрещено использование верхнего регистра (Caps Lock)', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Оск в NonRP чат', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '3.03. Любые формы оскорблений, издевательств... в OOC чате запрещены', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Упом/Оск родни', content: generateComplaintContent('ODOBRENO', 'Mute 120 минут / Ban 7 - 15 дней', '3.04. Запрещено оскорбление или косвенное упоминание родных', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Флуд', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '3.05. Запрещен флуд — 3 и более повторяющихся сообщений', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Злоуп. символами', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '3.06. Запрещено злоупотребление знаков препинания и прочих символов', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Слив глобального чата', content: generateComplaintContent('ODOBRENO', 'PermBan', '3.08. Запрещены любые формы «слива» посредством использования глобальных чатов', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Выдача себя за адм', content: generateComplaintContent('ODOBRENO', 'Ban 7 - 15 дней.', '3.10. Запрещена выдача себя за администратора', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Заблуждение игроков командами', content: generateComplaintContent('ODOBRENO', 'Ban 15 - 30 дней / PermBan', '3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Нарушение в репорт', content: generateComplaintContent('ODOBRENO', 'Report Mute 30 минут.', '3.12. Запрещено подавать репорт, написанный транслитом, с сообщением не по теме', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Музыка в Voice', content: generateComplaintContent('ODOBRENO', 'Mute 60 минут', '3.14. Запрещено включать музыку в Voice Chat', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Шум в Voice', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '3.16. Запрещено создавать посторонние шумы или звуки', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Полит. и религ. пропаганда', content: generateComplaintContent('ODOBRENO', 'Mute 120 минут / Ban 10 дней', '3.18. Запрещено политическое и религиозное пропагандирование', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Изменение голоса', content: generateComplaintContent('ODOBRENO', 'Mute 60 минут', '3.19. Запрещено использование любого софта для изменения голоса', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Транслит', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '3.20. Запрещено использование транслита в любом из чатов', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Реклама промо', content: generateComplaintContent('ODOBRENO', 'Ban 30 дней', '3.21. Запрещается реклама промокодов в игре', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Объявления на ТТ ГОСС', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '3.22. Запрещено публиковать любые объявления в помещениях государственных организаций', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Мат в VIP', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '3.23. Запрещено использование нецензурных слов... в VIP чате', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила игровых аккаунтов - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' },
        { title: '✔️ Фейк', content: generateComplaintContent('ODOBRENO', 'Устное замечание + смена игрового никнейма / PermBan', '4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Оск ник', content: generateComplaintContent('ODOBRENO', 'Устное замечание + смена игрового никнейма / PermBan', '4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила управления бизнесом - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' },
        { title: '✔️ Продажа должностей/Продажа крупье', content: generateComplaintContent('ODOBRENO', 'Ban 3 - 5 дней.', '2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Налоги с сотрудников', content: generateComplaintContent('ODOBRENO', 'Ban 3 - 5 дней.', '2.02. Владельцу и менеджерам казино и ночного клуба запрещено взимать у работников налоги', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Продажа СТО/Казино', content: generateComplaintContent('ODOBRENO', 'Permban.', '3.01. Запрещено продавать и передавать казино / СТО третьим лицам', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила Госс структур - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' },
        { title: '✔️ Арест в казино/аукцион', content: generateComplaintContent('ODOBRENO', 'Ban 7 - 15 дней + увольнение из организации', '2.50. Запрещены задержания, аресты... в интерьере аукциона, казино', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Работа в форме ГОСС', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Транспорт в личн.целях', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '1.08. Запрещено использование фракционного транспорта в личных целях', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Казино/БУ... в форме ГОСС', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, находится на Б/У рынке', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Арест на ТТ ОПГ', content: generateComplaintContent('ODOBRENO', 'Warn', '1.16. Игроки, состоящие в силовых структурах, не имеют права находиться и открывать огонь на территории ОПГ', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP адвокат', content: generateComplaintContent('ODOBRENO', 'Warn', '3.01. Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Нарушение правил редакт.объяв.(СМИ)', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '4.01. Запрещено редактирование объявлений, не соответствующих ПРО', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Нарушение правил пров.эфиров(СМИ)', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', '4.02. Запрещено проведение эфиров, не соответствующих игровым правилам и логике', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Реклама Промо(СМИ)', content: generateComplaintContent('ODOBRENO', 'Ban 30 дней.', '4.03. Запрещена реклама промокодов в объявлениях', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Редакт. в личн. целях(СМИ)', content: generateComplaintContent('ODOBRENO', 'Ban 7 дней + ЧС организации', '4.04. Запрещено редактировать поданные объявления в личных целях', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Стрельба в форме(ЦБ)', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '5.01. Запрещено использование оружия в рабочей форме', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Обман командами(ЦБ)', content: generateComplaintContent('ODOBRENO', 'Ban 3-5 дней + ЧС организации', '5.02. Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP розыск(УМВД)', content: generateComplaintContent('ODOBRENO', 'Warn', '6.02. Запрещено выдавать розыск без IC причины', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP поведение(ГОСС)', content: generateComplaintContent('ODOBRENO', 'Warn', '6.03. Запрещено nRP поведение', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Задержание на войнах за бизнес', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '1.13. Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP розыск/штраф(ГИБДД)', content: generateComplaintContent('ODOBRENO', 'Warn', '7.02. Запрещено выдавать розыск, штраф без IC причины', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Лишение прав во время погони(ГИБДД)', content: generateComplaintContent('ODOBRENO', 'Warn', '7.04. Запрещено отбирать водительские права во время погони', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP розыск(ФСБ)', content: generateComplaintContent('ODOBRENO', 'Warn', '8.02. Запрещено выдавать розыск без IC причины', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Вывод заключенных(ФСИН)', content: generateComplaintContent('ODOBRENO', 'Warn', '9.01. Запрещено освобождать заключённых, нарушая игровую логику организации', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP карцер/поощрения(ФСИН)', content: generateComplaintContent('ODOBRENO', 'Warn', '9.02. Запрещено выдавать выговор или поощрять заключенных, а также сажать их в карцер без особой IC причины', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила ОПГ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' },
        { title: '✔️ NonRP нападение', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут / Warn', 'За нарушение правил нападения на Войсковую Часть', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ NonRP в/ч', content: generateComplaintContent('ODOBRENO', 'Warn', 'Нападение на военную часть разрешено через блокпост КПП', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Путевой лист/Форма в личн.целях', content: generateComplaintContent('ODOBRENO', 'Warn', 'Запрещено использовать форму военного и путевой лист в личных целях', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Провокация ГОСС', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', 'Запрещено провоцировать сотрудников государственных организаций', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Провокация ОПГ', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', 'Запрещено провоцировать сотрудников криминальных организаций', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Дуэли у ОПГ', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', 'Запрещено устраивать дуэли где-либо, а также на территории ОПГ', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Перестрелки в людных местах', content: generateComplaintContent('ODOBRENO', 'Jail 60 минут', 'Запрещено устраивать перестрелки с другими ОПГ в людных местах', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Реклама в чате ОПГ', content: generateComplaintContent('ODOBRENO', 'Mute 30 минут', 'Запрещена любая реклама... в чате организации', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Сокрытие от погони на ТТ ОПГ', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', 'Запрещено уходить от погони... путем заезда на территорию своей банды', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Возвращение на БВ после смерти', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '2.01. Запрещено возвращаться на место бизвара после смерти', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Выход/Пауза во время БВ', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '2.03. Запрещено во время войны за бизнес покидать его территорию или выходить с игры', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Транспорт во время БВ', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '2.04. Запрещено после начала бизвара использовать транспорт на территории его ведения', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Аптечка во время перестрелки в БВ', content: generateComplaintContent('ODOBRENO', 'Jail 15 минут', '2.07. Запрещено использовать аптечки во время перестрелки', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: '✔️ Нахождение на крыше БВ', content: generateComplaintContent('ODOBRENO', 'Jail 30 минут', '2.08. Запрещено находиться на крышах во время бизвара', ''), prefix: ODOBRENO_PREFIX, status: true, grid_col: 5 },
        { title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Передача и перенаправление жалоб - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' },
        // ПЕРЕДАЧА/ЗАКРЫТИЕ
        {
            title: '➡️ Тех.специалисту',
            content: generateComplaintContent('RASSMOTR', 'Ожидайте ответа.', '', 'Ваша жалоба передана на рассмотрение Техническому специалисту. Примечание: Техническому специалисту может потребоваться более 48 часов на рассмотрение.'),
            prefix: TEXSPECY_PREFIX,
            status: true,
            close: true,
            grid_col: 5
        },
   {
    title: '➡️ Глав.админу',
    content: generateComplaintContent('RASSMOTR', 'Ожидайте ответа.', '', 'Ваша жалоба передана на рассмотрение Главному Администратору. Примечание: Может потребоваться более 48 часов на рассмотрение.'),
    prefix: GLAVNOMYADMINY_PREFIX,
    status: true,
    close: false,
    grid_col: 5
},


     {
    title: '➡️ ОЗГА',
    content: generateComplaintContent(
        'RASSMOTR',
        'Ожидайте ответа.',
        '',
        'Ваша жалоба передана на рассмотрение Основному Заместителю Главного Администратора. Примечание: Может потребоваться дополнительное время для рассмотрения жалобы.'
    ),
    prefix: NARASSSMOTRENII_PREFIX, // ← исправлено
    status: true,
    close: false,
    grid_col: 5
},


        {
            title: '➡️ Кураторам адм.',
            content: generateComplaintContent('RASSMOTR', 'Ожидайте ответа.', '', 'Ваша жалоба передана на рассмотрение Кураторам адмиинистрации. Примечание: Может потребоваться дополнительное время для рассмотрения жалобы.'),
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
            close: true,
            grid_col: 5
        },
        {
            title: '➡️ ГКФ',
            content: generateComplaintContent('RASSMOTR', 'Ожидайте ответа.', '', 'Ваша жалоба передана на рассмотрение Главному куратору форума. Ожидайте ответа...'),
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
            close: true,
            grid_col: 5
        },
        {
            title: '❌ В жалобы на адм',
            content: generateComplaintContent('ZAKRITO', 'Ошибка раздела.', '', 'Вы ошиблись разделом. Оставьте жалобу в раздел Жалобы - Жалобы на администрацию.'),
            prefix: ZAKRITO_PREFIX,
            status: true,
            grid_col: 5
        },
        {
            title: '❌ В обжалования',
            content: generateComplaintContent('ZAKRITO', 'Ошибка раздела.', '', 'Вы ошиблись разделом. Если хотите смягчить своё наказание, то обратитесь в раздел Жалобы - Обжалование наказаний.'),
            prefix: ZAKRITO_PREFIX,
            status: true,
            grid_col: 5
        },
        {
            title: '❌ В жалобы на лидеров',
            content: generateComplaintContent('ZAKRITO', 'Ошибка раздела.', '', 'Вы ошиблись разделом. Оставьте жалобу в раздел Жалобы - Жалобы на лидеров.'),
            prefix: ZAKRITO_PREFIX,
            status: true,
            grid_col: 5
        },
        {
            title: '❌ В жалобы на сотрудников',
            content: generateComplaintContent('ZAKRITO', 'Ошибка раздела.', '', 'Оставьте жалобу в раздел Государственные организации - Жалобы на сотрудников.'),
            prefix: ZAKRITO_PREFIX,
            status: true,
            grid_col: 5
        },
        {
            title: '❌ Ошибка сервером',
            content: generateComplaintContent('ZAKRITO', 'Ошибка сервера.', '', 'Вы ошиблись сервером. Оставьте вашу жалобу в соответствующий раздел вашего сервера.'),
            prefix: ZAKRITO_PREFIX,
            status: true,
            grid_col: 5
        },

        { title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Причины отказа - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -' },
        // ОТКАЗЫ
        { title: '❌ Нарушений нет', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Не вижу нарушений со стороны игрока.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Недостаточно док-в', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Недостаточно доказательств для дальнейшего рассмотрения жалобы.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Игрок уже наказан', content: generateComplaintContent('ZAKRITO', 'Закрыто.', '', 'Игрок уже был наказан.'), prefix: ZAKRITO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Нарушений нет(оск в рп чат)', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Оскорбления в RP чат не наказуемы.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Не по форме', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Ваша жалоба составлена не по форме. Внимательно ознакомьтесь с формой подачи жалоб. Форма: 1. Nick_Name: 2. Nick_Name игрока: 3. Суть жалобы: 4. Доказательство:'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Нет /time', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'На ваших доказательствах отсутсвует /time. Дальнейшему рассмотрению жалоба не подлежит.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Нет таймкодов(3+ минут видео)', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Отсутсвуют таймкоды. Если доказательства длятся более 3-х минут, вы должны указать таймкоды нарушений.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Док-ва с соц.сетей', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Доказательства с соц.сетей не принимаются. Дальнейшему рассмотрению жалоба не подлежит.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Не работают док-ва', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'В вашей жалобе отсутсвуют или не работают доказательства. Просьба проверить правильность указания ссылок.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Нужен фрапс', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'В таких ситуациях нужен фрапс.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ От 3-го лица', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Ваша жалоба составлена от 3-го лица. Жалобы принимаются непосредственно от лица участников.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Нет условий сделки', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'В вашей жалобе отсутствуют условия сделки. Дальнейшему рассмотрению жалоба не подлежит.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Более 72 часов', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'С момента нарушения прошло более 72 часов. Дальнейшему рассмотрению жалоба не подлежит.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Фрапс обрывается', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Ваши доказательства неполные или обрываются. Просьба предоставить доказательства в полном объеме.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Док-ва отредактированы', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Ваши доказательства отредактированы. Предоставьте доказательства в исходном виде.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Неадекватное поведение', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Ваша жалоба включается в себя негативные/неадекватные высказывания. Составьте жалобу более сдержано и адекватно.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Дубликат', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Вердикт был дан в вашей прошлой жалобе. За дублирование вашей темы вы можете получить блокировку форумного аккаунта.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Слив семьи(Жб не от лидера)', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Жалобы по данному пункту правил принимаются только от лидера семьи.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
        { title: '❌ Слив склада семьи(лидер сам несёт ответсвенность)', content: generateComplaintContent('OTKAZANO', 'Отказ.', '', 'Не вижу нарушений со стороны игрока. Лидер сам несёт ответственность за выданные доступы.'), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
    ];


    // --- ФУНКЦИОНАЛ ИЗ КОДА 2 / A.SKAY (ОРИГИНАЛЬНАЯ СТРУКТУРА) ---

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }

    function editThreadData(prefix, pin = false, shouldClose = true) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent.trim();

        if (typeof XF === 'undefined' || !XF.config || !XF.config.csrf) {
            console.error('Ошибка: Не найдены переменные XF. Невозможно сменить префикс.');
            return;
        }

        const data = {
            prefix_id: prefix,
            title: threadTitle,
            discussion_open: shouldClose ? 0 : 1, // 0 = Закрыть, 1 = Оставить открытой
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
        };

        if (pin === true) {
            data.sticky = 1;
        }

        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData(data),
        }).then(() => location.reload()).catch(error => console.error('Ошибка при смене префикса:', error));
    }

    function getThreadData() {
        const usernameElement = $('a.username')[0];
        if (!usernameElement) {
            return { user: { id: 'Unknown', name: 'Уважаемый пользователь', mention: 'Уважаемый пользователь' } };
        }

        const authorID = usernameElement.attributes['data-user-id']?.nodeValue || 'UnknownID';
        const authorName = $(usernameElement).text().trim() || 'Уважаемый пользователь';
        const hours = new Date().getHours();

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: () =>
                4 < hours && hours <= 11
                ? 'Доброе утро'
                : 11 < hours && hours <= 15
                ? 'Добрый день'
                : 15 < hours && hours <= 21
                ? 'Добрый вечер'
                : 'Доброй ночи',
        };
    }

    // Кнопка с прозрачным фоном
    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="background: transparent !important; background-image: none !important; margin: 10px; border: none; border-radius: 10px; color: white !important;">${name}</button>`,
        );
    }

  // ДИЗАЙН: Сетка кнопок и прозрачные разделители (адаптив)
function buttonsMarkup(buttons) {
    return `<div class="select_answer">
        ${buttons.map((btn, i) => {
            if (btn.content === undefined || btn.title.includes('________________') || btn.title.includes(' - - - - ')) {
                return `<div class="separator-title">${btn.title.replace(/_/g, '').replace(/-/g, '').trim()}</div>`;
            }
            // первые две — крупнее
            const extraClass = (i === 1 || i === 2) ? 'col-2' : '';
            return `<button id="answers-${i}" class="button--primary button rippleButton answer-button ${extraClass}" data-id="${i}">
                        <span class="button-text">${btn.title}</span>
                    </button>`;
        }).join('')}
    </div>`;
}

    // Функция вставки контента и автоотправки
    function pasteContent(id, data = {}, send = false) {
        if (buttons[id].content === undefined) return;

        const template = Handlebars.compile(buttons[id].content);
        const btn = buttons[id];

        if ($('.fr-element.fr-view p').text().trim() === '') $('.fr-element.fr-view p').empty();
        $('span.fr-placeholder').empty();

        const contentToPaste = template(data).replace(/\n/g, '<br>');
        $('div.fr-element.fr-view p').append(contentToPaste);

        // ЗАКРЫТИЕ ОКНА
        $('a.overlay-titleCloser').trigger('click');
setTimeout(() => {
    document.body.style.pointerEvents = 'auto';
    $('.overlay-container').removeClass('is-active');
}, 300);


        if (send === true) {
            const pinStatus = btn.prefix === NARASSSMOTRENII_PREFIX;
            const shouldClose = btn.close !== false;

            // Смена префикса и закрытие темы
            editThreadData(btn.prefix, pinStatus, shouldClose);

            // АВТООТПРАВКА
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

436255677352425246725726674514645146514491571856642785624357634578645782345634252345435
function applyModalFixes(customTitle) {

    // скрываем на один кадр, фикс мерцания
    $('.overlay, .overlay-container').css('visibility', 'hidden');
    requestAnimationFrame(() => {
        $('.overlay, .overlay-container').css('visibility', 'visible');
    });

    // Контейнер затемнения
    $('.overlay-container')
        .css({
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.65)',
            zIndex: '999999',
            overflow: 'hidden'
        })
        .addClass('is-active');

    // Окно
    $('.overlay').css({
        background: 'rgba(42,44,46,0.45)',
        borderRadius: '8px',
        boxShadow: '0 0 30px rgba(0,0,0,0.75)',
        maxWidth: '880px',
        width: 'calc(100% - 60px)',
        maxHeight: '85vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    });

    // Заголовок
    $('.overlay-title').css({
        background: 'rgba(26,29,31,0.85)',
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700',
        padding: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
    });

    // Контент
    $('.overlay-content').css({
        flex: '1',
        overflowY: 'auto',
        background: 'rgba(42,44,46,0.30)',
        padding: '12px',
        color: '#fff',
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none'
    });

    if (!$('#modal-style-fix').length) {
        $('head').append(`
            <style id="modal-style-fix">
                .select_answer { display:flex; flex-wrap:wrap; gap:8px; padding:8px; }
                .select_answer .answer-button {
                    flex:1 1 calc(20% - 8px);
                    min-width:120px;
                    background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    color:#fff;
                    border-radius:6px;
                    padding:10px 12px;
                    white-space:normal;
                    transition:transform .08s ease, background .12s ease;
                }
                .select_answer .answer-button:hover {
                    background:rgba(255,255,255,0.08);
                    transform:translateY(-1px);
                }
                .separator-title {
                    flex-basis:100%;
                    text-align:center;
                    color:#f5c542;
                    font-weight:700;
                    margin:10px 0;
                }

                .overlay-content::-webkit-scrollbar { width:0; height:0; }
                .overlay-content { -ms-overflow-style:none; scrollbar-width:none; }
            </style>
        `);
    }


   // Закрытие крестиком
$(document)
    .off('click.modalCloseRefresh', '.overlay-titleCloser')
    .on('click.modalCloseRefresh', '.overlay-titleCloser', function () {
        setTimeout(() => location.reload(), 20);
    });

// Закрытие по клику вне окна
$(document)
    .off('click.modalBgRefresh', '.overlay-container')
    .on('click.modalBgRefresh', '.overlay-container', function (e) {
        if ($(e.target).is('.overlay-container')) {
            setTimeout(() => location.reload(), 20);
        }
    });

// Если XF сам удалил модалку — тоже обновляем
const modalObserver = setInterval(() => {
    if (!$('.overlay-container').length) {
        clearInterval(modalObserver);
        setTimeout(() => location.reload(), 20);
    }
}, 50);

}

 // --- ЗАПУСК СКРИПТА ---
$(document).ready(() => {
    if (typeof XF === 'undefined' || typeof jQuery === 'undefined' || typeof XF.alert === 'undefined') {
        console.error('XF или jQuery не найдены — скрипт не будет работать.');
        return;
    }

    const threadData = getThreadData();
    const mainButtonId = 'goggins_complaints_templates';

    // Создаём кнопку, если ещё нет
    if (!$(`#${mainButtonId}`).length) addButton('Шаблоны Жалоб', mainButtonId);

    // Удаляем лишние кнопки
    const buttonsToRemove = ['pin', 'Ga', 'Spec', 'teamProject', 'rassmotreno', 'otkaz', 'unaccept', 'accepted', 'selectAnswer'];
    buttonsToRemove.forEach(id => $(`button#${id}`).remove());

    // Подписка на клик по основной кнопке (именованная)
    $(document).off('click.gogginsMainBtn', `#${mainButtonId}`).on('click.gogginsMainBtn', `#${mainButtonId}`, function () {
        const customTitle = 'Выберите шаблон Жалоб';

        // удалить любые старые остатки модалки (если есть)
        $('.overlay-container.is-active, .overlay-container').remove();

        // открыть модалку XF
        XF.alert(buttonsMarkup(buttons), null, customTitle);

        // Ждём появления модалки и применяем фиксы стилей
        let tries = 0;
        const fixInterval = setInterval(() => {
            if ($('.overlay').length && $('.overlay-content').length) {
                applyModalFixes(customTitle);
                clearInterval(fixInterval);
            }
            if (++tries > 20) clearInterval(fixInterval); // ~2 секунды и прекращаем попытки
        }, 100);

        // Делегирование кликов внутри модалки (единственный обработчик)
        $(document).off('click.gogginsAnswer', '.select_answer .answer-button')
            .on('click.gogginsAnswer', '.select_answer .answer-button', function (e) {
                e.preventDefault();
                const id = Number($(this).data('id'));
                if (Number.isNaN(id)) return console.warn('Не прочитан id кнопки', this);
                const send = buttons[id] && buttons[id].status;
                pasteContent(id, threadData, send);
            });
    });
});
$(document).on('click', '.overlay-backdrop', function() {
    $('.overlay-container').removeClass('is-active');
    document.body.style.pointerEvents = 'auto';
});

})();