// ==UserScript==
// @name         Умный скрипт ЗГА 18 (ПК)
// @namespace    https://forum.blackrussia.online
// @version      2.0
// @description  Улучшенный скрипт для модерации обжалований (ПК версия)
// @author       babaenko
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563535/%D0%A3%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%97%D0%93%D0%90%2018%20%28%D0%9F%D0%9A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563535/%D0%A3%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%97%D0%93%D0%90%2018%20%28%D0%9F%D0%9A%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Конфигурация
    const CONFIG = {
        PREFIXES: {
            UNACCEPT: 4,      // Отказано
            ACCEPT: 8,        // Одобрено
            PIN: 2,           // На рассмотрении
            COMMAND: 10,      // К проектной команде
            WATCHED: 9,       // Рассмотрено
            CLOSE: 7,         // Закрыто
            SPECIAL: 11,      // Специальной администрации
            GA: 12,           // Главному администратору
            TECH: 13,         // Техническому специалисту
            OJIDANIE: 14      // В ожидании
        },
        COLORS: {
            GREETING: '0, 255, 255',    // Бирюзовый
            RED: '255, 0, 0',           // Красный
            GREEN: '102, 255, 0',       // Зеленый
            ORANGE: '251, 160, 38',     // Оранжевый
            GRAY: '128, 128, 128'       // Серый
        },
        STORAGE_KEYS: {
            STATS: 'zga_stats',
            SETTINGS: 'zga_settings',
            LAST_USED: 'zga_last_used'
        }
    };

    // Стили для улучшенного интерфейса
    GM_addStyle(`
        .zga-button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 10px;
            padding: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            border: 1px solid #4a5568;
        }
        
        .zga-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            cursor: pointer !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
        }
        
        .zga-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
            background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
        }
        
        .zga-button:active {
            transform: translateY(0) !important;
        }
        
        .zga-button-success {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%) !important;
        }
        
        .zga-button-danger {
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%) !important;
        }
        
        .zga-button-warning {
            background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%) !important;
        }
        
        .zga-button-info {
            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%) !important;
        }
        
        .zga-modal {
            max-height: 80vh !important;
            overflow-y: auto !important;
        }
        
        .zga-category {
            font-weight: bold;
            color: #fff;
            background: #4a5568;
            padding: 5px 10px;
            border-radius: 4px;
            margin: 10px 0;
            text-align: center;
        }
        
        .zga-tooltip {
            position: relative;
            display: inline-block;
        }
        
        .zga-tooltip .zga-tooltiptext {
            visibility: hidden;
            width: 200px;
            background-color: #2d3748;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -100px;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 12px;
        }
        
        .zga-tooltip:hover .zga-tooltiptext {
            visibility: visible;
            opacity: 1;
        }
        
        .zga-search-box {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #4a5568;
            border-radius: 4px;
            background: #2d3748;
            color: white;
        }
        
        .zga-stats {
            font-size: 11px;
            color: #a0aec0;
            margin-left: 5px;
        }
        
        .zga-quick-actions {
            display: flex;
            gap: 5px;
            margin-top: 5px;
        }
        
        .zga-quick-btn {
            padding: 4px 8px !important;
            font-size: 12px !important;
            background: #4a5568 !important;
        }
        
        .zga-favorite {
            color: #f6e05e !important;
        }
        
        .zga-settings-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        
        .zga-settings-btn:hover {
            transform: rotate(45deg) scale(1.1);
        }
    `);

    // Утилиты
    const Utils = {
        // Получение данных темы и пользователя
        async getThreadData() {
            const authorID = $('a.username')[0]?.attributes['data-user-id']?.nodeValue;
            const authorName = $('a.username').html();
            const hours = new Date().getHours();
            
            let greeting;
            if (hours > 4 && hours <= 11) {
                greeting = 'Доброе утро';
            } else if (hours > 11 && hours <= 15) {
                greeting = 'Добрый день';
            } else if (hours > 15 && hours <= 21) {
                greeting = 'Добрый вечер';
            } else {
                greeting = 'Доброй ночи';
            }

            return {
                user: {
                    id: authorID,
                    name: authorName,
                    mention: `[USER=${authorID}]${authorName}[/USER]`,
                },
                greeting: greeting,
                threadTitle: $('.p-title-value')[0]?.lastChild?.textContent || '',
                threadUrl: window.location.href
            };
        },

        // Форматирование данных для формы
        getFormData(data) {
            const formData = new FormData();
            Object.entries(data).forEach(i => formData.append(i[0], i[1]));
            return formData;
        },

        // Безопасный fetch с обработкой ошибок
        async safeFetch(url, options) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error('Ошибка запроса:', error);
                return null;
            }
        },

        // Генерация BB-кода
        generateBBCode(template, data) {
            return template
                .replace(/\${greeting}/g, data.greeting)
                .replace(/\${user\.mention}/g, data.user.mention)
                .replace(/\${user\.name}/g, data.user.name)
                .replace(/\${user\.id}/g, data.user.id);
        },

        // Сохранение статистики использования
        saveStat(buttonId) {
            const stats = JSON.parse(GM_getValue(CONFIG.STORAGE_KEYS.STATS, '{}'));
            stats[buttonId] = (stats[buttonId] || 0) + 1;
            GM_setValue(CONFIG.STORAGE_KEYS.STATS, JSON.stringify(stats));
            
            // Сохраняем последние использованные
            const lastUsed = JSON.parse(GM_getValue(CONFIG.STORAGE_KEYS.LAST_USED, '[]'));
            const updatedLastUsed = [buttonId, ...lastUsed.filter(id => id !== buttonId)].slice(0, 5);
            GM_setValue(CONFIG.STORAGE_KEYS.LAST_USED, JSON.stringify(updatedLastUsed));
        },

        // Получение статистики
        getStats() {
            return JSON.parse(GM_getValue(CONFIG.STORAGE_KEYS.STATS, '{}'));
        },

        // Получение последних использованных
        getLastUsed() {
            return JSON.parse(GM_getValue(CONFIG.STORAGE_KEYS.LAST_USED, '[]'));
        },

        // Горячие клавиши
        initHotkeys() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.altKey && !e.shiftKey) {
                    switch(e.key) {
                        case '1': $('#zga-pin').click(); break;
                        case '2': $('#zga-accepted').click(); break;
                        case '3': $('#zga-unaccept').click(); break;
                        case '4': $('#zga-closed').click(); break;
                        case '5': $('#zga-selectAnswer').click(); break;
                        case 'q': $('#zga-mainAdmin').click(); break;
                        case 'w': $('#zga-teamProject').click(); break;
                        case 'e': $('#zga-specialAdmin').click(); break;
                    }
                }
            });
        }
    };

    // Шаблоны ответов с категориями
    const TEMPLATES = {
        categories: [
            {
                name: 'Основные ответы',
                buttons: [
                    {
                        id: 'not_form',
                        title: 'НЕ ПО ФОРМЕ',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Обжалование составлено не по форме, ознакомьтесь с правилами подачи обжалований и создайте новую тему.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Закрыто.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.CLOSE,
                        status: false,
                        hotkey: 'F1'
                    },
                    {
                        id: 'not_appealable',
                        title: 'НЕ ОБЖАЛУЕТСЯ',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Наказание, которое вы хотите обжаловать, обжалованию не подлежит.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Закрыто.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.CLOSE,
                        status: false,
                        hotkey: 'F2'
                    },
                    {
                        id: 'reject',
                        title: 'ОТКАЗАТЬ',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Ваше обжалование рассмотрено, и принято решение об отказе в обжаловании.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Отказано.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.UNACCEPT,
                        status: false,
                        hotkey: 'F3'
                    },
                    {
                        id: 'approve',
                        title: 'ОДОБРИТЬ',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Ваше обжалование рассмотрено, и принято решение о сокращении вашего наказания.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.GREEN})]Одобрено.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.ACCEPT,
                        status: false,
                        hotkey: 'F4'
                    },
                    {
                        id: 'in_review',
                        title: 'НА РАССМОТРЕНИИ',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Ваше обжалование взято на рассмотрение, ожидайте решения.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.ORANGE})]На рассмотрении.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.PIN,
                        status: true,
                        hotkey: 'F5'
                    }
                ]
            },
            {
                name: 'Частые случаи',
                buttons: [
                    {
                        id: 'minimal',
                        title: 'МИНИМАЛЬНОЕ',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]За ваше нарушение администратор уже выдал вам минимальное наказание, уменьшить его срок не получится.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Отказано.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.UNACCEPT,
                        status: false
                    },
                    {
                        id: 'nick_change',
                        title: 'СМЕНА НИКА',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Ваш аккаунт разблокирован на 24 часа, за это время вы должны успеть сменить свой ник за донат.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.ORANGE})]На рассмотрении.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.PIN,
                        status: true
                    },
                    {
                        id: 'compensation_plus',
                        title: 'ВОЗМЕЩЕНИЕ+',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Аккаунт игрока разблокирован на 24 часа, за это время игрок должен успеть возместить вам ущерб на фрапс с /time, данный фрапс вам необходимо прикрепить к данной теме.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.ORANGE})]На рассмотрении.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.PIN,
                        status: true
                    },
                    {
                        id: 'compensation_minus',
                        title: 'ВОЗМЕЩЕНИЕ-',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Если вы готовы возместить ущерб обманутой стороне, свяжитесь с игроком любым способом, для возврата имущества он должен оформить обжалование.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Закрыто.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.CLOSE,
                        status: false
                    }
                ]
            },
            {
                name: 'Проблемы с доказательствами',
                buttons: [
                    {
                        id: 'proofs_not_work',
                        title: 'ДОКВА НЕ РАБОТАЮТ',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Доказательства, которые вы прикрепили, не работают, загрузите ваши доказательства на другой хостинг.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Закрыто.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.CLOSE,
                        status: false
                    },
                    {
                        id: 'no_proofs',
                        title: 'НЕТ ДОКВ/ОКНО БАНА',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Не увидел доказательств от вас, зайдите в игру и сделайте скриншот окна с баном, после чего заново напишите обжалование.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Закрыто.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.CLOSE,
                        status: false
                    },
                    {
                        id: 'social_networks',
                        title: 'СОЦ СЕТИ',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Доказательства, которые вы прикрепили к обжалованию, находятся в соцсетях, загрузите ваши доказательства на любой фотохостинг.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Закрыто.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.CLOSE,
                        status: false
                    },
                    {
                        id: 'vk_link',
                        title: 'ССЫЛКА НА ВК',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Прикрепите к вашим доказательствам ссылку на вашу страницу в VK.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Закрыто.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.CLOSE,
                        status: false
                    }
                ]
            },
            {
                name: 'Перенаправления',
                buttons: [
                    {
                        id: 'different_server',
                        title: 'ДРУГОЙ СЕРВЕР',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Вы ошиблись сервером, переношу ваше обращение в нужный раздел.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.ORANGE})]Ожидайте ответа администрации сервера.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: null,
                        status: false
                    },
                    {
                        id: 'to_admin_complaints',
                        title: 'В ЖБ НА АДМ',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обратиться в раздел жалоб на администрацию.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Закрыто.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.CLOSE,
                        status: false
                    },
                    {
                        id: 'to_tech_complaints',
                        title: 'В ЖБ НА ТЕХА',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B]<br><br>` +
                                `[B]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обратиться в раздел жалоб на технического специалиста.[/B][/CENTER]<br><br>` +
                                `[CENTER][B][COLOR=rgb(${CONFIG.COLORS.RED})]Закрыто.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.CLOSE,
                        status: false
                    }
                ]
            },
            {
                name: 'Передача наверх',
                buttons: [
                    {
                        id: 'to_temych',
                        title: 'ДЛЯ ТЁМЫЧА',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B][/CENTER][/SIZE]<br><br>` +
                                `[CENTER][SIZE=4][B]Передаю ваше обжалование Главному Администратору —  [user=1349399]Artem_Rooall.[/user] <br><br>` +
                                `[COLOR=rgb(${CONFIG.COLORS.ORANGE})]На рассмотрении.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.GA,
                        status: true
                    },
                    {
                        id: 'to_special',
                        title: 'Спецам',
                        content: `[CENTER][SIZE=4][B][COLOR=rgb(${CONFIG.COLORS.GREETING})]\${greeting}, уважаемый(-ая)[/COLOR] \${user.mention}[/B][/CENTER][/SIZE]<br><br>` +
                                `[CENTER][SIZE=4][B]Передаю ваше обжалование - Специальной Администрации.<br><br>` +
                                `[COLOR=rgb(${CONFIG.COLORS.ORANGE})]На рассмотрении.[/COLOR][/B][/CENTER][/SIZE]<br>`,
                        prefix: CONFIG.PREFIXES.SPECIAL,
                        status: true
                    }
                ]
            }
        ]
    };

    // Класс для управления скриптом
    class ZGAScript {
        constructor() {
            this.threadData = null;
            this.initialized = false;
        }

        async init() {
            if (this.initialized) return;
            
            // Загружаем данные темы
            this.threadData = await Utils.getThreadData();
            
            // Добавляем стили и кнопки
            this.addStyles();
            this.createButtonGroup();
            this.addSettingsButton();
            
            // Инициализируем горячие клавиши
            Utils.initHotkeys();
            
            this.initialized = true;
            console.log('ZGAScript инициализирован');
        }

        addStyles() {
            // Стили уже добавлены через GM_addStyle
        }

        createButtonGroup() {
            const buttonGroup = $(`
                <div class="zga-button-group">
                    <button id="zga-pin" class="zga-button zga-button-warning" title="Ctrl+Alt+1">
                        📌 На рассмотрение
                    </button>
                    <button id="zga-accepted" class="zga-button zga-button-success" title="Ctrl+Alt+2">
                        ✅ Одобрено
                    </button>
                    <button id="zga-unaccept" class="zga-button zga-button-danger" title="Ctrl+Alt+3">
                        ❌ Отказано
                    </button>
                    <button id="zga-closed" class="zga-button zga-button-info" title="Ctrl+Alt+4">
                        🔒 Закрыто
                    </button>
                    <button id="zga-watched" class="zga-button">
                        👀 Рассмотрено
                    </button>
                    <button id="zga-mainAdmin" class="zga-button" title="Ctrl+Alt+Q">
                        👑 ГА
                    </button>
                    <button id="zga-teamProject" class="zga-button" title="Ctrl+Alt+W">
                        👥 КП
                    </button>
                    <button id="zga-specialAdmin" class="zga-button" title="Ctrl+Alt+E">
                        ⭐ Спецам
                    </button>
                    <button id="zga-selectAnswer" class="zga-button" title="Ctrl+Alt+5">
                        💬 Ответики
                    </button>
                    <button id="zga-quickAnswers" class="zga-button">
                        ⚡ Быстрые
                    </button>
                </div>
            `);

            // Вставляем группу кнопок перед кнопкой ответа
            $('.button--icon--reply').before(buttonGroup);

            // Назначаем обработчики
            this.bindButtonHandlers();
        }

        bindButtonHandlers() {
            // Основные кнопки
            $('#zga-pin').click(() => this.editThread(CONFIG.PREFIXES.PIN, true));
            $('#zga-accepted').click(() => this.editThread(CONFIG.PREFIXES.ACCEPT, false));
            $('#zga-unaccept').click(() => this.editThread(CONFIG.PREFIXES.UNACCEPT, false));
            $('#zga-closed').click(() => this.editThread(CONFIG.PREFIXES.CLOSE, false));
            $('#zga-watched').click(() => this.editThread(CONFIG.PREFIXES.WATCHED, false));
            $('#zga-mainAdmin').click(() => this.editThread(CONFIG.PREFIXES.GA, true));
            $('#zga-teamProject').click(() => this.editThread(CONFIG.PREFIXES.COMMAND, true));
            $('#zga-specialAdmin').click(() => this.editThread(CONFIG.PREFIXES.SPECIAL, true));
            
            // Кнопка выбора ответов
            $('#zga-selectAnswer').click(() => this.showTemplatesModal());
            
            // Кнопка быстрых ответов
            $('#zga-quickAnswers').click(() => this.showQuickAnswers());
        }

        addSettingsButton() {
            const settingsBtn = $(`
                <div class="zga-settings-btn" title="Настройки скрипта">
                    ⚙️
                </div>
            `);
            
            $('body').append(settingsBtn);
            settingsBtn.click(() => this.showSettingsModal());
        }

        async editThread(prefix, pin = false) {
            const formData = Utils.getFormData({
                prefix_id: prefix,
                title: this.threadData.threadTitle,
                _xfToken: XF.config.csrf,
                _xfRequestUri: window.location.pathname,
                _xfWithData: 1,
                _xfResponseType: 'json',
                ...(pin && { sticky: 1 })
            });

            const result = await Utils.safeFetch(`${window.location.href}edit`, {
                method: 'POST',
                body: formData
            });

            if (result) {
                XF.alert('Статус темы обновлен!', null, 'Успех');
                setTimeout(() => location.reload(), 1000);
            }
        }

        showTemplatesModal() {
            let modalContent = '<div class="zga-modal">';
            
            // Поле поиска
            modalContent += '<input type="text" class="zga-search-box" placeholder="Поиск ответов..." id="zga-search">';
            
            // Быстрые действия (последние использованные)
            const lastUsed = Utils.getLastUsed();
            if (lastUsed.length > 0) {
                modalContent += '<div class="zga-quick-actions">';
                modalContent += '<strong>Недавние:</strong>';
                lastUsed.forEach(buttonId => {
                    const button = this.findButtonById(buttonId);
                    if (button) {
                        const stats = Utils.getStats()[buttonId] || 0;
                        modalContent += `
                            <button class="zga-button zga-quick-btn zga-tooltip" data-id="${button.id}">
                                ${button.title}
                                <span class="zga-stats">${stats}</span>
                                <span class="zga-tooltiptext">${button.hotkey ? `Горячая клавиша: ${button.hotkey}` : ''}</span>
                            </button>
                        `;
                    }
                });
                modalContent += '</div>';
            }
            
            // Категории с ответами
            TEMPLATES.categories.forEach(category => {
                modalContent += `<div class="zga-category">${category.name}</div>`;
                modalContent += '<div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 15px;">';
                
                category.buttons.forEach(button => {
                    const stats = Utils.getStats()[button.id] || 0;
                    modalContent += `
                        <button class="zga-button zga-tooltip" data-id="${button.id}" 
                                style="min-width: 180px; justify-content: space-between;">
                            <span>${button.title}</span>
                            <span class="zga-stats">${stats}</span>
                            <span class="zga-tooltiptext">
                                ${button.hotkey ? `Горячая клавиша: ${button.hotkey}<br>` : ''}
                                Нажмите для вставки
                            </span>
                        </button>
                    `;
                });
                
                modalContent += '</div>';
            });
            
            modalContent += '</div>';
            
            XF.alert(modalContent, null, 'Выберите ответ');
            
            // Обработчик поиска
            $('#zga-search').on('keyup', function() {
                const searchTerm = $(this).val().toLowerCase();
                $('.zga-button[data-id]').each(function() {
                    const buttonText = $(this).find('span:first').text().toLowerCase();
                    $(this).toggle(buttonText.includes(searchTerm));
                });
            });
            
            // Обработчики кнопок
            $('.zga-button[data-id]').click((e) => {
                const buttonId = $(e.currentTarget).data('id');
                this.insertTemplate(buttonId);
                $('.overlay-titleCloser').click(); // Закрываем модальное окно
            });
        }

        showQuickAnswers() {
            const quickButtons = [
                { id: 'not_form', title: '❌ Не по форме' },
                { id: 'reject', title: '🚫 Отказать' },
                { id: 'approve', title: '✅ Одобрить' },
                { id: 'in_review', title: '⏳ На рассмотрении' },
                { id: 'no_proofs', title: '📷 Нет докв' },
                { id: 'social_networks', title: '🌐 Соц сети' }
            ];
            
            let modalContent = '<div class="zga-modal"><div style="display: flex; flex-wrap: wrap; gap: 5px;">';
            
            quickButtons.forEach(btn => {
                const template = this.findButtonById(btn.id);
                if (template) {
                    modalContent += `
                        <button class="zga-button" style="width: 180px;" data-id="${btn.id}">
                            ${btn.title}
                        </button>
                    `;
                }
            });
            
            modalContent += '</div></div>';
            
            XF.alert(modalContent, null, 'Быстрые ответы');
            
            $('.zga-button[data-id]').click((e) => {
                const buttonId = $(e.currentTarget).data('id');
                this.insertTemplate(buttonId);
                $('.overlay-titleCloser').click();
            });
        }

        findButtonById(id) {
            for (const category of TEMPLATES.categories) {
                const button = category.buttons.find(btn => btn.id === id);
                if (button) return button;
            }
            return null;
        }

        insertTemplate(buttonId) {
            const template = this.findButtonById(buttonId);
            if (!template) return;
            
            // Генерируем контент
            const content = Utils.generateBBCode(template.content, this.threadData);
            
            // Вставляем в редактор
            if ($('.fr-element.fr-view p').text() === '') {
                $('.fr-element.fr-view p').empty();
            }
            
            $('span.fr-placeholder').empty();
            $('div.fr-element.fr-view p').append(content);
            
            // Сохраняем статистику
            Utils.saveStat(buttonId);
            
            // Если нужно изменить статус темы
            if (template.prefix !== null) {
                this.editThread(template.prefix, template.status);
            }
            
            // Автоматически нажимаем кнопку ответа через секунду
            setTimeout(() => {
                $('.button--icon.button--icon--reply.rippleButton').trigger('click');
            }, template.prefix !== null ? 1000 : 500);
        }

        showSettingsModal() {
            const stats = Utils.getStats();
            let statsHtml = '<h4>Статистика использования:</h4><ul style="max-height: 200px; overflow-y: auto;">';
            
            // Сортируем по количеству использований
            const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);
            
            sortedStats.forEach(([id, count]) => {
                const button = this.findButtonById(id);
                if (button) {
                    statsHtml += `<li>${button.title}: ${count} раз</li>`;
                }
            });
            
            statsHtml += '</ul>';
            
            const settingsContent = `
                <div class="zga-modal" style="max-width: 500px;">
                    <h3>Настройки скрипта</h3>
                    ${statsHtml}
                    <hr>
                    <div style="margin-top: 15px;">
                        <button id="zga-reset-stats" class="zga-button zga-button-danger">
                            Сбросить статистику
                        </button>
                        <button id="zga-export-stats" class="zga-button">
                            Экспорт статистики
                        </button>
                    </div>
                    <div style="margin-top: 15px; font-size: 12px; color: #a0aec0;">
                        <strong>Горячие клавиши:</strong><br>
                        Ctrl+Alt+1-5: Основные действия<br>
                        Ctrl+Alt+Q/W/E: Передача наверх<br>
                        F1-F5: Быстрые ответы
                    </div>
                </div>
            `;
            
            XF.alert(settingsContent, null, 'Настройки');
            
            $('#zga-reset-stats').click(() => {
                GM_setValue(CONFIG.STORAGE_KEYS.STATS, '{}');
                GM_setValue(CONFIG.STORAGE_KEYS.LAST_USED, '[]');
                XF.alert('Статистика сброшена!', null, 'Успех');
                $('.overlay-titleCloser').click();
            });
            
            $('#zga-export-stats').click(() => {
                const dataStr = JSON.stringify(stats, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `zga-stats-${new Date().toISOString().split('T')[0]}.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
            });
        }
    }

    // Инициализация скрипта при загрузке страницы
    $(document).ready(async () => {
        // Ждем загрузки Handlebars
        await new Promise(resolve => {
            if (typeof Handlebars !== 'undefined') {
                resolve();
            } else {
                $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
                const checkInterval = setInterval(() => {
                    if (typeof Handlebars !== 'undefined') {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            }
        });
        
        // Создаем и инициализируем скрипт
        const script = new ZGAScript();
        await script.init();
    });
})();