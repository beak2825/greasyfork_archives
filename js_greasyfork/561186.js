// ==UserScript==
// @name         Black Russia | ГА -- ОЗГА --  ЗГА
// @namespace    https://forum.blackrussia.online
// @version      41.0
// @description  Script for BR Curators
// @author       Tim_Venera 
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        GM_registerMenuCommand
// @license      MIT
// @icon         https://via.placeholder.com/50/8E2DE2/FFFFFF/?text=BR
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561186/Black%20Russia%20%7C%20%D0%93%D0%90%20--%20%D0%9E%D0%97%D0%93%D0%90%20--%20%20%D0%97%D0%93%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/561186/Black%20Russia%20%7C%20%D0%93%D0%90%20--%20%D0%9E%D0%97%D0%93%D0%90%20--%20%20%D0%97%D0%93%D0%90.meta.js
// ==/UserScript==

/* global $, XF */

(function () {
    'use strict';

    const LOCAL_STORAGE_KEY = 'br_curator_templates_v41';
    const SETTINGS_KEY = 'br_curator_settings_v41';
    const TABS_KEY = 'br_curator_tabs_v41';
    const FLOOD_STORAGE_KEY = 'br_flood_timestamp_v41';
    const PENDING_CONTENT_KEY = 'br_pending_content_v41';

    const AVATAR_URL = 'https://i.postimg.cc/43krF7Lx/Screenshot-20251205-223206.jpg';
    const VK_LINK = 'https://vk.com/imaginemp';

    const P = {
        UNACCEPT: 4, ACCEPT: 8, PIN: 2, RESHENO: 6, CLOSE: 7,
        WATCHED: 9, GA: 12, TEX: 13, REALIZOVANO: 5, OJIDANIE: 14, SPECIAL: 11
    };

    const PREFIX_NAMES = {
        4: 'Отказано', 8: 'Одобрено', 2: 'На рассмотрении', 6: 'Решено',
        7: 'Закрыто', 9: 'Рассмотрено', 12: 'Главному Адм', 13: 'Тех. Спецу',
        5: 'Реализовано', 14: 'Ожидание', 11: 'Спец. Адм', 0: 'Без префикса'
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
        'main': [
            { title: 'Приветствие', content: '[CENTER][FONT=Courier New]Здравствуйте, уважаемый {{ user.mention }}![/CENTER]<br><br>[CENTER][FONT=Courier New]Текст вашего ответа...[/FONT][/CENTER]', prefix: 0 },
            { title: 'На рассмотрение', content: '[CENTER][FONT=Courier New]Запросил доказательства у администратора.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/FONT][/CENTER]', prefix: P.PIN },
            { title: 'Не по форме', content: '[CENTER][FONT=Courier New]Ваша жалоба составлена не по форме.<br>Ознакомьтесь с правилами подачи жалоб: [URL="https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/"]*Кликабельно*[/URL][/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Не является адм', content: '[CENTER][FONT=Courier New]Данный игрок не является администратором.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Нет /time', content: '[CENTER][FONT=Courier New]В предоставленных доказательствах отсутствует /time.<br>Жалоба не подлежит рассмотрению.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'От 3 лица', content: '[CENTER][FONT=Courier New]Жалоба составлена от 3-го лица.<br>Жалобы подобного формата рассмотрению не подлежат.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Нужен фрапс', content: '[CENTER][FONT=Courier New]В данной ситуации обязательно должен быть фрапс (видеофиксация) всех моментов.<br>В противном случае жалоба будет отказана.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Неполный фрапс', content: '[CENTER][FONT=Courier New]Фрапс обрезан, вынести вердикт с данной нарезки невозможно.<br>Если у вас есть полный фрапс, то создайте новую тему, прикрепив его.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Док-ва отредактированы', content: '[CENTER][FONT=Courier New]Представленные доказательства были отредактированы.<br>Подобные жалобы рассмотрению не подлежат.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Плохое качество докв', content: '[CENTER][FONT=Courier New]Доказательства были предоставлены в плохом качестве.<br>Пожалуйста, прикрепите более качественные фото/видео.[/FONT][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Прошло более 48 часов', content: '[CENTER][FONT=Courier New]С момента выдачи наказания прошло более 48-ми часов.<br>Жалоба не подлежит рассмотрению.[/FONT][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Нет доков', content: '[CENTER][FONT=Courier New]В вашей жалобе отсутствуют доказательства для рассмотрения.<br>Прикрепите доказательства в хорошем качестве на разрешенных платформах (Yapx/Imgur/YouTube/ImgBB).[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Не рабочие док-ва', content: '[CENTER][FONT=Courier New]Предоставленные вами доказательства нерабочие.<br>Создайте новую тему, прикрепив рабочую ссылку на доказательства.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Окно бана', content: '[CENTER][FONT=Courier New]Зайдите в игру и сделайте скриншот окна с баном.<br>После чего заново напишите жалобу.[/FONT][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Дублирование', content: '[CENTER][FONT=Courier New]Ответ вам уже был дан в предыдущей теме.<br>Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.[/FONT][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Беседа с адм', content: '[CENTER][FONT=Courier New]Ваша жалоба была рассмотрена и одобрена.<br>С администратором будет проведена профилактическая беседа.<br>Ваше наказание будет снято в ближайшее время (если оно еще не снято).<br>Приносим извинения за предоставленные неудобства.[/FONT][/CENTER]', prefix: P.ACCEPT },
            { title: 'Нет нарушений', content: '[CENTER][FONT=Courier New]Исходя из приложенных выше доказательств — нарушения со стороны администратора отсутствуют.[/FONT][/CENTER]', prefix: P.UNACCEPT },
            { title: 'Наказание верное', content: '[CENTER][FONT=Courier New]Администратор предоставил доказательства.<br>Наказание выдано верно.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Админ Снят/ПСЖ', content: '[CENTER][FONT=Courier New]Администратор был снят / ушел с поста администратора.<br>Спасибо за обращение.[/FONT][/CENTER]', prefix: P.WATCHED },
            { title: 'Передано ГА', content: '[CENTER][FONT=Courier New]Жалоба передана Главному Администратору.<br>Пожалуйста, ожидайте ответа.<br>Не нужно создавать копии этой темы.[/FONT][/CENTER]', prefix: P.GA },
            { title: 'Передано ЗГА ГОСС & ОПГ', content: '[CENTER][FONT=Courier New]Жалоба передана Заместителю Главного Администратора по направлению ОПГ и ГОСС.<br>Ожидайте ответа в данной теме.[/FONT][/CENTER]', prefix: P.GA },
            { title: 'Спецу', content: '[CENTER][FONT=Courier New]Ваша жалоба передана Специальному Администратору.<br>Ожидайте ответа в данной теме.[/FONT][/CENTER]', prefix: P.SPECIAL },
            { title: 'Соц. сети', content: '[CENTER][FONT=Courier New]Доказательства из соц. сетей не принимаются.<br>Вам нужно загрузить доказательства на видео/фото хостинги.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'В ЖБ на теха', content: '[CENTER][FONT=Courier New]Вам было выдано наказание Техническим специалистом.<br>Обратитесь в раздел жалоб на технических специалистов: [URL="https://forum.blackrussia.online/forums/Жалобы-на-технических-специалистов.490/"]*Нажмите сюда*[/URL][/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'В ЖБ на игроков', content: '[CENTER][FONT=Courier New]Вы ошиблись разделом.<br>Обратитесь в раздел Жалобы на игроков. Ознакомьтесь с правилами подачи жалоб: [URL="https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/"]*Нажмите сюда*[/URL][/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'В ЖБ на лидеров', content: '[CENTER][FONT=Courier New]Вы ошиблись разделом.<br>Обратитесь в раздел Жалобы на лидеров. Ознакомьтесь с правилами подачи жалоб: [URL="https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.3429391/"]*Нажмите сюда*[/URL][/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'В обжалование', content: '[CENTER][FONT=Courier New]Если вы согласны с выданным наказанием, то напишите в раздел Обжалование.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Не по форме (ОБЖ)', content: '[CENTER][FONT=Courier New]Ваше обжалование составлено не по форме.<br>Пожалуйста, ознакомьтесь с правилами подачи обжалований: [URL="https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/"]*Нажмите сюда*[/URL][/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Обжалованию не подлежит', content: '[CENTER][FONT=Courier New]Данное нарушение не подлежит обжалованию.<br>В обжаловании отказано.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Отказано (ОБЖ)', content: '[CENTER][FONT=Courier New]В обжаловании отказано.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Скрин больше', content: '[CENTER][FONT=Courier New]Прикрепите скриншот блокировки вашего аккаунта.<br>Загрузка доказательств в соц. сети запрещается, используйте фото-хостинги.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Прикрепите ВК', content: '[CENTER][FONT=Courier New]Прикрепите ссылку на ваш VK.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Не готовы снизить', content: '[CENTER][FONT=Courier New]Администрация сервера не готова снизить вам наказание.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'ОБЖ на рассмотрении', content: '[CENTER][FONT=Courier New]Ваше обжалование взято на рассмотрение.<br>Ожидайте ответа в данной теме.[/FONT][/CENTER]', prefix: P.PIN },
            { title: 'Обжалован на 24 часа', content: '[CENTER][FONT=Courier New]Ваше обжалование взято на рассмотрение.<br>Аккаунт игрока будет разблокирован на 24 часа для возврата имущества.<br>Запишите на видео с /time возврат имущества и предоставьте ссылку в этой теме.[/FONT][/CENTER]', prefix: P.PIN },
            { title: 'Уже есть мин. наказание', content: '[CENTER][FONT=Courier New]Вам было выдано минимальное наказание.<br>Обжалованию не подлежит.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Обжалование от 3 лица', content: '[CENTER][FONT=Courier New]Обжалование должен подавать тот, кого вы обманули (с того же форумного аккаунта), предварительно прикрепив доказательства возврата средств.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'Обжалование одобрено', content: '[CENTER][FONT=Courier New]Обжалование одобрено.<br>Ваше наказание будет снято/снижено в течение 24-х часов.[/FONT][/CENTER]', prefix: P.ACCEPT },
            { title: 'Передано ГА (ОБЖ)', content: '[CENTER][FONT=Courier New]Обжалование передано Главному Администратору.<br>Ожидайте ответа в данной теме.[/FONT][/CENTER]', prefix: P.GA },
            { title: 'Соц. сети (ОБЖ)', content: '[CENTER][FONT=Courier New]Доказательства из соц. сетей не принимаются.<br>Вам нужно загрузить доказательства на видео/фото хостинги.[/FONT][/CENTER]', prefix: P.CLOSE },
            { title: 'В ЖБ на админов', content: '[CENTER][FONT=Courier New]Если вы не согласны с выданным наказанием, напишите жалобу в раздел Жалобы на Администрацию.<br>Ознакомьтесь с правилами подачи жалоб: [URL="https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/"]*Нажмите сюда*[/URL][/FONT][/CENTER]', prefix: P.CLOSE }
        ]
    };

    let DEFAULT_TABS = [
        { id: 'main', name: 'Основное' }
    ];

    const DEFAULT_COLORS = {
        colorHead: '#FF00FF',
        colorBody: '#FFFF00',
        colorFoot: '#00FFFF',
        colorApproved: '#00AA44',
        colorRefused: '#FF3B30',
        colorReview: '#E6B800',
        colorClose: '#888888',
        colorGA: '#8A2BE2',
        colorTex: '#FF8C00',
        colorSolved: '#0080FF',
        verdictSize: '15'
    };

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

    let TEMPLATES = {};
    let TABS = [];
    let SETTINGS = {
        autoSubmit: false,
        floodControl: true,
        targetPath: 'all',
        customPath: '',
        ...DEFAULT_COLORS
    };

    let floodInterval = null;

    try {
        const storedTemplates = localStorage.getItem(LOCAL_STORAGE_KEY);
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
        const storedTabs = localStorage.getItem(TABS_KEY);

        if (storedSettings) SETTINGS = Object.assign({}, SETTINGS, JSON.parse(storedSettings));

        if (storedTabs) {
            TABS = JSON.parse(storedTabs);
        } else {
            TABS = DEFAULT_TABS;
            localStorage.setItem(TABS_KEY, JSON.stringify(TABS));
        }

        if (storedTemplates) {
            TEMPLATES = JSON.parse(storedTemplates);
        } else {
            TEMPLATES = addIds(structuredClone(BASE_DATA));
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(TEMPLATES));
        }

        TABS.forEach(tab => { if (!TEMPLATES[tab.id]) TEMPLATES[tab.id] = []; });

    } catch(e) {
        TABS = DEFAULT_TABS;
        TEMPLATES = addIds(structuredClone(BASE_DATA));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(TEMPLATES));
        localStorage.setItem(TABS_KEY, JSON.stringify(TABS));
    }

    let currentTab = TABS[0].id;
    let isManagementMode = false;

    const CSS = `
        :root {
            --primary: #8E2DE2; --secondary: #4A00E0; --accent: #00d2ff;
            --danger: #FF416C; --success: #00FF99; --gold: #FFD700;
            --glass-bg: rgba(20, 20, 25, 0.95); --glass-border: rgba(255, 255, 255, 0.1);
            --modal-radius: 14px; --easing: cubic-bezier(0.4, 0, 0.2, 1);
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .br-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(5px); z-index: 9999; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.3s var(--easing); }
        .br-modal { background: linear-gradient(135deg, rgba(25, 25, 30, 0.98), rgba(35, 35, 45, 0.99)); border: 1px solid var(--glass-border); box-shadow: 0 20px 50px rgba(0,0,0,0.5); border-radius: var(--modal-radius); width: 1000px; max-width: 95%; height: 85vh; display: flex; flex-direction: column; color: #fff; font-family: 'Segoe UI', Roboto, sans-serif; animation: slideUp 0.4s var(--easing); position: relative; overflow: hidden; }
        .br-header { padding: 15px 30px; border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-shrink: 0; }
        .br-header-left { display: flex; align-items: center; gap: 15px; }
        .br-avatar { width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--primary); transition: 0.4s var(--easing); cursor: pointer; object-fit: cover; }
        .br-title { font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
        .br-title span { background: linear-gradient(to right, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .br-search { flex-grow: 1; max-width: 300px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 10px 15px; border-radius: 20px; color: #fff; outline: none; transition: 0.3s; }
        .br-search:focus { border-color: var(--primary); box-shadow: 0 0 10px rgba(142, 45, 226, 0.3); background: rgba(255,255,255,0.1); }
        .br-close { font-size: 28px; cursor: pointer; color: #aaa; transition: 0.2s; line-height: 1; }
        .br-tabs { display: flex; gap: 10px; padding: 10px 30px; overflow-x: auto; border-bottom: 1px solid var(--glass-border); background: rgba(0,0,0,0.2); flex-shrink: 0; }
        .br-tab { padding: 8px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; color: #bbb; transition: 0.3s; border: 1px solid transparent; background: rgba(255,255,255,0.02); white-space: nowrap; }
        .br-tab.active { background: linear-gradient(135deg, rgba(142, 45, 226, 0.2), rgba(74, 0, 224, 0.2)); border-color: var(--primary); color: #fff; }
        .br-content { flex: 1; overflow-y: auto; padding: 25px 30px; overscroll-behavior: contain; }
        .br-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
        .br-card { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 12px; padding: 15px; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 8px; animation: slideUp 0.3s var(--easing); }
        .br-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.1); border-color: rgba(142, 45, 226, 0.4); }
        .br-card.pinned { border: 1px solid var(--gold); background: rgba(255, 215, 0, 0.05); }
        .br-card h3 { margin: 0; font-size: 15px; font-weight: 700; color: #eee; }
        .br-card p { margin: 0; font-size: 12px; color: #aaa; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
        .br-footer { padding: 15px 30px; border-top: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); flex-shrink: 0; }
        .br-btn { padding: 8px 20px; border-radius: 20px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.3s; }
        .br-btn-primary { background: linear-gradient(135deg, #8E2DE2, #4A00E0); color: #fff; box-shadow: 0 4px 15px rgba(142, 45, 226, 0.4); }
        .br-btn-danger { background: rgba(255, 65, 108, 0.15); color: #ff416c; border: 1px solid #ff416c; }
        .br-btn-success { background: rgba(0, 255, 153, 0.15); color: #00ff99; border: 1px solid #00ff99; }
        .br-settings-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.3s; }
        .br-manage-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; gap: 10px; opacity: 0; transition: 0.2s; pointer-events: none; }
        .br-card.edit-mode .br-manage-overlay { opacity: 1; pointer-events: auto; }
        .br-icon-btn { width: 34px; height: 34px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; font-size: 16px; transition: 0.2s; }
        .br-icon-edit { background: #2196F3; }
        .br-icon-delete { background: #f44336; }
        .br-icon-move { background: #9C27B0; }
        .br-icon-pin { background: #FFD700; color: #000; }
        .br-checkbox-wrapper { display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 13px; cursor: pointer; user-select: none; }
        .br-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: var(--primary); }
        #br-btn-trigger, #br-btn-prefix { position: relative; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 12px; margin-right: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); transition: all 0.4s var(--easing); cursor: pointer; text-transform: uppercase; }
        #br-btn-trigger { background: linear-gradient(135deg, #8E2DE2, #4A00E0); }
        #br-btn-prefix { background: linear-gradient(135deg, #11998e, #38ef7d); }

        .flood-active { background: linear-gradient(45deg, #ff416c 25%, #ff4b2b 25%, #ff4b2b 50%, #ff416c 50%, #ff416c 75%, #ff4b2b 75%, #ff4b2b) !important; background-size: 40px 40px !important; border: 1px solid #ff416c !important; color: white !important; cursor: not-allowed !important; animation: stripes 1s linear infinite, pulseRed 2s infinite !important; }
        .br-edit-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10002; display: flex; align-items: center; justify-content: center; }
        .br-edit-box { background: #1e1e24; border-radius: 12px; padding: 25px; width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid #333; animation: slideUp 0.3s; }
        .br-input-group { margin-bottom: 15px; }
        .br-input-group label { display: block; margin-bottom: 8px; color: #bbb; font-size: 13px; font-weight: 600; }
        .br-input { width: 100%; padding: 12px; background: #2b2b30; border: 1px solid #444; border-radius: 8px; color: #fff; box-sizing: border-box; outline: none; }
        .br-textarea { min-height: 150px; resize: vertical; font-family: monospace; font-size: 13px; }
        .br-edit-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .br-select { width: 100%; padding: 10px; background: #2b2b30; border: 1px solid #444; color: white; border-radius: 8px; }
        .br-prefix-menu { position: absolute; background: rgba(30, 30, 36, 0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; box-shadow: 0 15px 40px rgba(0,0,0,0.5); z-index: 9999; backdrop-filter: blur(10px); }
        .br-prefix-item { padding: 8px 14px; border-radius: 6px; color: #fff; font-size: 12px; font-weight: bold; text-align: center; cursor: pointer; transition: 0.3s; }
        .br-prefix-item:hover { transform: scale(1.05); filter: brightness(1.1); }

        .color-group { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; padding: 5px; background: rgba(255,255,255,0.03); border-radius: 6px; }
        .color-label { flex: 1; font-size: 12px; color: #ccc; }
        .color-input { width: 40px; height: 30px; padding: 0; border: none; background: none; cursor: pointer; }

        @media (max-width: 768px) {
            .br-modal { width: 100% !important; height: 100% !important; max-width: 100% !important; border-radius: 0 !important; display: flex; flex-direction: column; }
            .br-header { padding: 10px 15px; flex-shrink: 0; }
            .br-header-left { gap: 10px; }
            .br-avatar { width: 35px; height: 35px; }
            .br-title { font-size: 16px; }
            .br-search { width: 100%; margin: 5px 0; max-width: none; }
            .br-content { padding: 10px; }
            .br-grid { grid-template-columns: 1fr; gap: 10px; }
            .br-footer { padding: 10px 15px; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.8); }
            .br-footer > div { width: 100%; display: flex; justify-content: space-between; align-items: center; }
            .br-footer > div:first-child { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 15px; }
            .br-footer > div:last-child { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .br-btn { width: 100%; padding: 10px; font-size: 12px; }
            #toggle-manage { grid-column: span 2; }
            .br-settings-btn { width: 100%; text-align: center; margin-top: 5px; }
            .br-edit-box { width: 95% !important; max-height: 85vh; padding: 15px; }
            .br-edit-box > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; gap: 10px !important; }
            .br-close { font-size: 32px; padding: 10px; }
        }
    `;

    $(document).ready(() => {
        $('head').append(`<style>${CSS}</style>`);
        checkFloodStatus();
        initScript();
    });

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
        if (!checkScope()) return;

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
            if (match[2].includes('минут')) seconds *= 60;
            const targetTime = Date.now() + (seconds * 1000);
            localStorage.setItem(FLOOD_STORAGE_KEY, targetTime.toString());
            const editorText = $('.fr-element.fr-view').html();
            localStorage.setItem(PENDING_CONTENT_KEY, editorText);
            startFloodTimer(seconds);
        }
    }

    function startFloodTimer(seconds) {
        if (!SETTINGS.floodControl) return;
        $('.overlay-container').hide();
        const $btn = $('#br-btn-trigger');
        const origText = $btn.text();
        let timeLeft = seconds;

        $btn.text(`Ждите ${timeLeft}с`).css('background', '#555').prop('disabled', true);
        if (floodInterval) clearInterval(floodInterval);

        floodInterval = setInterval(() => {
            timeLeft--;
            $btn.text(`Ждите ${timeLeft}с`);
            if (timeLeft <= 0) {
                clearInterval(floodInterval);
                localStorage.removeItem(FLOOD_STORAGE_KEY);
                $btn.text(origText).css('background', '').prop('disabled', false);

                const pendingContent = localStorage.getItem(PENDING_CONTENT_KEY);
                if (pendingContent) {
                    $('.fr-element.fr-view').html(pendingContent).trigger('input');
                    localStorage.removeItem(PENDING_CONTENT_KEY);
                }
                if (SETTINGS.autoSubmit) setTimeout(() => $('.button--icon.button--icon--reply.rippleButton').trigger('click'), 500);
            }
        }, 1000);
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
                            <div class="br-title">BR <span>Curators</span> v41</div>
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
                        <div>
                            <label class="br-checkbox-wrapper">
                                <input type="checkbox" class="br-checkbox" id="auto-submit-check" ${SETTINGS.autoSubmit ? 'checked' : ''}>
                                Авто-отправка
                            </label>
                             <label class="br-checkbox-wrapper">
                                <input type="checkbox" class="br-checkbox" id="flood-control-check" ${SETTINGS.floodControl ? 'checked' : ''}>
                                Умный Timer
                            </label>
                        </div>
                        <div>
                            <button class="br-settings-btn" id="open-scope-settings">
                                🌐 Настройки
                            </button>
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

        $(document).on('click', '.br-tab', function() {
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
        let tabsListHtml = '';
        TABS.forEach(t => {
            if(t.id !== 'main') {
                 tabsListHtml += `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px; margin-bottom:5px; border-radius:6px;">
                    <span style="font-size:13px;">${t.name}</span>
                    <button class="delete-tab-btn" data-id="${t.id}" style="background:#ff416c; border:none; color:white; border-radius:4px; cursor:pointer; padding:2px 8px;">x</button>
                 </div>`;
            }
        });

        let scopeOptions = '';
        for (const [key, val] of Object.entries(SCOPES)) {
            scopeOptions += `<option value="${key}" ${SETTINGS.targetPath === key ? 'selected' : ''}>${val}</option>`;
        }

        const dialogHtml = `
            <div class="br-edit-modal">
                <div class="br-edit-box">
                    <h3>Настройки Скрипта</h3>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">

                        <div>
                            <h4 style="margin: 0 0 10px; border-bottom:1px solid #444; color: var(--accent);">🎨 Стиль Ответов</h4>

                            <div class="color-group"><label class="color-label">Приветствие</label><input type="color" class="color-input" id="set-color-head" value="${SETTINGS.colorHead}"></div>
                            <div class="color-group"><label class="color-label">Основной текст (Body)</label><input type="color" class="color-input" id="set-color-body" value="${SETTINGS.colorBody}"></div>

                            <h4 style="margin: 15px 0 10px; border-bottom:1px solid #444; color: var(--accent);">⚖️ Стиль Вердиктов (Нижний текст)</h4>
                            <div class="color-group"><label class="color-label">Размер шрифта (px)</label><input type="number" class="br-input" style="height:30px; padding:5px;" id="set-verdict-size" value="${SETTINGS.verdictSize}"></div>
                            <div class="color-group"><label class="color-label">Одобрено</label><input type="color" class="color-input" id="set-color-approved" value="${SETTINGS.colorApproved}"></div>
                            <div class="color-group"><label class="color-label">Отказано</label><input type="color" class="color-input" id="set-color-refused" value="${SETTINGS.colorRefused}"></div>
                            <div class="color-group"><label class="color-label">На рассмотрении</label><input type="color" class="color-input" id="set-color-review" value="${SETTINGS.colorReview}"></div>
                            <div class="color-group"><label class="color-label">Закрыто</label><input type="color" class="color-input" id="set-color-close" value="${SETTINGS.colorClose}"></div>
                            <div class="color-group"><label class="color-label">Решено</label><input type="color" class="color-input" id="set-color-solved" value="${SETTINGS.colorSolved}"></div>
                            <div class="color-group"><label class="color-label">Главному Адм</label><input type="color" class="color-input" id="set-color-ga" value="${SETTINGS.colorGA}"></div>
                            <div class="color-group"><label class="color-label">Тех. Спецу</label><input type="color" class="color-input" id="set-color-tex" value="${SETTINGS.colorTex}"></div>
                        </div>

                        <div>
                            <h4 style="margin: 0 0 10px; border-bottom:1px solid #444; color: var(--accent);">🌐 Где работает скрипт</h4>
                            <select class="br-select" id="scope-select" style="margin-bottom:10px;">${scopeOptions}</select>
                            <div id="custom-path-group" style="display: ${SETTINGS.targetPath === 'custom' ? 'block' : 'none'};">
                                <input class="br-input" id="custom-path-input" placeholder="Часть ссылки..." value="${SETTINGS.customPath}">
                            </div>

                            <h4 style="margin: 20px 0 10px; border-bottom:1px solid #444; color: var(--accent);">📂 Управление Вкладками</h4>
                            <div style="display:flex; gap:10px; margin-bottom:10px;">
                                <input class="br-input" id="new-tab-name" placeholder="Новый раздел..." style="margin:0;">
                                <button class="br-btn br-btn-success" id="add-new-tab" style="padding:0 15px;">+</button>
                            </div>
                            <button class="br-btn br-btn-primary" id="auto-sort-btn" style="width:100%; margin-bottom:10px;">📂 Авто-сортировка</button>
                            <button class="br-btn br-btn-danger" id="reset-templates-btn" style="width:100%; margin-bottom:10px;">♻️ Сброс шаблонов</button>
                            <div style="max-height: 150px; overflow-y:auto; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px;">
                                ${tabsListHtml || '<div style="color:#777; font-size:12px;">Нет пользовательских разделов</div>'}
                            </div>
                        </div>
                    </div>

                    <div class="br-edit-actions" style="border-top:1px solid #333; padding-top:15px; justify-content:space-between;">
                        <button class="br-btn br-btn-danger" id="reset-colors-btn">Сбросить цвета</button>
                        <div style="display:flex; gap:10px;">
                            <button class="br-btn br-btn-danger" id="cancel-scope">Закрыть</button>
                            <button class="br-btn br-btn-primary" id="save-scope">Сохранить настройки</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('body').append(dialogHtml);

        $('#scope-select').change(function() {
            if ($(this).val() === 'custom') $('#custom-path-group').slideDown();
            else $('#custom-path-group').slideUp();
        });

        $('#add-new-tab').click(() => {
            const name = $('#new-tab-name').val().trim();
            if(name) {
                const newId = 'tab_' + Date.now();
                TABS.push({ id: newId, name: name });
                TEMPLATES[newId] = [];
                localStorage.setItem(TABS_KEY, JSON.stringify(TABS));
                saveData();
                $('.br-edit-modal').remove();
                openScopeDialog();
            }
        });

        $('.delete-tab-btn').click(function() {
            const id = $(this).data('id');
            if(confirm('Удалить этот раздел и все шаблоны в нем?')) {
                TABS = TABS.filter(t => t.id !== id);
                delete TEMPLATES[id];
                localStorage.setItem(TABS_KEY, JSON.stringify(TABS));
                saveData();
                $(this).parent().remove();
            }
        });

        $('#reset-colors-btn').click(() => {
            if(confirm('Сбросить все цвета к стандартным?')) {
                SETTINGS = Object.assign(SETTINGS, DEFAULT_COLORS);
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
                location.reload();
            }
        });

        $('#reset-templates-btn').click(() => {
            if(confirm('Сбросить все шаблоны и вкладки к исходному состоянию? (Все изменения будут потеряны)')) {
                TEMPLATES = addIds(structuredClone(BASE_DATA));
                TABS = DEFAULT_TABS;
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(TEMPLATES));
                localStorage.setItem(TABS_KEY, JSON.stringify(TABS));
                location.reload();
            }
        });

        $('#auto-sort-btn').click(() => {
            if(confirm('Автоматически распределить шаблоны по папкам? (Жалобы, Адм, Обжалования и т.д.)')) {
                autoDistribute();
                location.reload();
            }
        });

        $('#cancel-scope').click(() => $('.br-edit-modal').remove());

        $('#save-scope').click(() => {
            SETTINGS.targetPath = $('#scope-select').val();
            SETTINGS.customPath = $('#custom-path-input').val();

            SETTINGS.colorHead = $('#set-color-head').val();
            SETTINGS.colorBody = $('#set-color-body').val();
            SETTINGS.verdictSize = $('#set-verdict-size').val();

            SETTINGS.colorApproved = $('#set-color-approved').val();
            SETTINGS.colorRefused = $('#set-color-refused').val();
            SETTINGS.colorReview = $('#set-color-review').val();
            SETTINGS.colorClose = $('#set-color-close').val();
            SETTINGS.colorSolved = $('#set-color-solved').val();
            SETTINGS.colorGA = $('#set-color-ga').val();
            SETTINGS.colorTex = $('#set-color-tex').val();

            localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
            location.reload();
        });
    }

    function autoDistribute() {
        const newTabs = [
            { id: 'main', name: 'Основное' },
            { id: 'complaints', name: 'Жалобы' },
            { id: 'admin', name: 'Администрация' },
            { id: 'appeals', name: 'Обжалования' },
            { id: 'bio', name: 'Биографии' },
            { id: 'transfer', name: 'Передачи' },
            { id: 'misc', name: 'Разное' }
        ];

        let allTemplates = [];
        for(let key in TEMPLATES) allTemplates.push(...TEMPLATES[key]);

        const newTemplates = { main: [], complaints: [], admin: [], appeals: [], bio: [], transfer: [], misc: [] };

        allTemplates.forEach(t => {
            const title = t.title.toLowerCase();
            if (title.includes('передано') || title.includes('спецу') || title.includes('техническому')) {
                newTemplates.transfer.push(t);
            } else if (title.includes('био') || title.includes('bio')) {
                newTemplates.bio.push(t);
            } else if (title.includes('обж') || title.includes('бан') || title.includes('снизить') || title.includes('вк')) {
                newTemplates.appeals.push(t);
            } else if (title.includes('адм') || title.includes('выдано верно')) {
                newTemplates.admin.push(t);
            } else if (title.includes('dm') || title.includes('tk') || title.includes('mg') || title.includes('time') || title.includes('фрапс') || title.includes('док-ва') || title.includes('3 лица')) {
                newTemplates.complaints.push(t);
            } else if (title.includes('приветствие') || title.includes('рассмотрение') || title.includes('форме')) {
                newTemplates.main.push(t);
            } else {
                newTemplates.misc.push(t);
            }
        });

        TABS = newTabs;
        TEMPLATES = newTemplates;
        localStorage.setItem(TABS_KEY, JSON.stringify(TABS));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(TEMPLATES));
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
                    <div class="br-input-group"><label>Заголовок</label><input class="br-input" id="new-tpl-title" placeholder="Название..."></div>
                    <div class="br-input-group"><label>Префикс</label><select class="br-select" id="new-tpl-prefix">${getPrefixOptions(0)}</select></div>
                    <div class="br-input-group"><label>Текст (Только суть)</label><textarea class="br-input br-textarea" id="new-tpl-content" placeholder="Ваш текст..."></textarea></div>
                    <div class="br-edit-actions">
                        <button class="br-btn br-btn-danger" id="cancel-create">Отмена</button>
                        <button class="br-btn br-btn-primary" id="save-create">Создать</button>
                    </div>
                </div>
            </div>`;
        $('body').append(dialogHtml);
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

        const HEAD_COLOR = SETTINGS.colorHead;
        const BODY_COLOR = SETTINGS.colorBody;

        const verdictMap = {
            8: { t: 'одобрено', c: SETTINGS.colorApproved },
            4: { t: 'отказано', c: SETTINGS.colorRefused },
            2: { t: 'на рассмотрении', c: SETTINGS.colorReview },
            7: { t: 'закрыто', c: SETTINGS.colorClose },
            6: { t: 'решено', c: SETTINGS.colorSolved },
            12: { t: 'передано га', c: SETTINGS.colorGA },
            13: { t: 'тех. специалисту', c: SETTINGS.colorTex },
            11: { t: 'спец. адм', c: SETTINGS.colorTex },
            5: { t: 'реализовано', c: SETTINGS.colorApproved },
            14: { t: 'ожидание', c: SETTINGS.colorClose },
            0: { t: '', c: '#FFFFFF' }
        };
        const status = verdictMap[tpl.prefix] || { t: '', c: '#FFFFFF' };

        let bodyContent = tpl.content.replace(/\[url=.*?\]\[img\].*?\[\/img\]\[\/url\]/g, '').replace(/\[img\].*?\[\/img\]/g, '');

        if (!bodyContent.includes('[COLOR=')) {
             bodyContent = `[COLOR=${BODY_COLOR}]${bodyContent}[/COLOR]`;
        }
        if (!bodyContent.includes('[CENTER]')) {
             bodyContent = `[CENTER]${bodyContent}[/CENTER]`;
        }

        let footerBlock = '';
        if (status.t) {
            footerBlock = `<br><div style="text-align:center"><img src="${BOTTOM_IMG}" style="max-width:300px;border-radius:6px;margin-bottom:5px;"><br>[SIZE=${SETTINGS.verdictSize}px][FONT=Courier New][B][COLOR=${status.c}]${status.t.toUpperCase()}[/COLOR][/B][/FONT][/SIZE]</div>`;
        } else {
             footerBlock = `<br><div style="text-align:center"><img src="${BOTTOM_IMG}" style="max-width:300px;border-radius:6px;margin-bottom:5px;"></div>`;
        }

        let finalHtml = `[CENTER][FONT=Courier New][B][COLOR=${HEAD_COLOR}]Доброго времени суток, уважаемый {{ user.mention }}![/COLOR][/B][/FONT][/CENTER]<br><br>` + bodyContent + footerBlock;

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