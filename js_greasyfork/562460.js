// ==UserScript==
// @name         Penza - Ultimate Script (Persona Edition) v11.3 (Final Fix)
// @namespace    https://forum.blackrussia.online
// @version      11.3.0
// @description  Исправлена проблема с дублированием префиксов в заголовке. Полный функционал.
// @author       Persona_Rozov & Assistant
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562460/Penza%20-%20Ultimate%20Script%20%28Persona%20Edition%29%20v113%20%28Final%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562460/Penza%20-%20Ultimate%20Script%20%28Persona%20Edition%29%20v113%20%28Final%20Fix%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================================
    // КОНФИГ
    // =========================================================================
    const CONFIG = {
        links: {
            complaintsAdmin: 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2414/',
            adminSection: 'https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.2390/',
            generalRules: 'https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'
        },
        colors: {
            primary: '#9932CC',
            bg_panel: '#1e1e1e',
            text_panel: '#ffffff',
            accent: '#9932CC',
            red: '#FF0000',
            grey: '#7F8C8D'
        },
        prefixes: {
            wait: 2,
            ok: 8,
            close: 4,
            spec: 11,
            ga: 12,
            tech: 13,
            command: 10,
            ban: 7
        },
        signature: {
            name: 'Persona_Rozov',
            rank: 'Куратор Администрации'
        }
    };

    // =========================================================================
    // ПОЛУЧЕНИЕ НИКА АВТОРА + ПРИВЕТСТВИЕ
    // =========================================================================
    function getAuthorName() {
        const thread = document.querySelector('[data-author]');
        if (thread) {
            const name = thread.getAttribute('data-author');
            if (name) return name.trim();
        }
        const firstPostAuthor = document.querySelector('.message:first-child .username');
        if (firstPostAuthor) return firstPostAuthor.textContent.trim();
        return '';
    }

    function getGreeting() {
        const h = new Date().getHours();
        if (h >= 5 && h < 11) return 'Доброе утро';
        if (h >= 11 && h < 17) return 'Добрый день';
        if (h >= 17 && h < 23) return 'Добрый вечер';
        return 'Доброй ночи';
    }

    function getPersonalGreeting() {
        const greeting = getGreeting();
        const author = getAuthorName();
        if (author) {
            return `${greeting}, уважаемый(ая) <strong>${author}</strong>.`;
        }
        return `${greeting}.`;
    }

    // =========================================================================
    // УТИЛИТЫ ОФОРМЛЕНИЯ ТЕКСТА
    // =========================================================================
    const color = (text, colorCode) =>
        `<span style="color: ${colorCode}; font-weight: bold;">${text}</span>`;
    const red = (text) => color(text, CONFIG.colors.red);
    const purple = (text) => color(text, CONFIG.colors.accent);
    const grey = (text) =>
        `<span style="color: ${CONFIG.colors.grey}; font-size: 13px; font-style: italic;">${text}</span>`;

    const makeTemplate = (bodyText, type) => {
        const personalGreeting = getPersonalGreeting();

        const header = `
            <div style="text-align: center; margin-bottom: 15px;">
                <div style="
                    width: 70%;
                    height: 2px;
                    background: ${CONFIG.colors.accent};
                    margin: 0 auto 10px auto;
                    border-radius: 2px;
                "></div>
                <div style="
                    font-family: 'Trebuchet MS', sans-serif;
                    font-size: 15px;
                    font-weight: bold;
                    line-height: 1.4;
                ">
                    ${personalGreeting}
                </div>
            </div>
        `;

        let footer = '';
        if (type === 'final') {
            footer = `
                <hr style="border: 0; border-top: 1px solid #444; margin: 20px auto; width: 60%;">
                <div style="text-align: center; margin-top: 15px;">
                    <span style="font-family: 'Trebuchet MS', sans-serif; font-size: 14px;">С уважением,</span><br>
                    <span style="font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold;">
                        ${CONFIG.signature.name}
                    </span>
                    <span style="color: #666;">|</span>
                    <span style="font-family: 'Trebuchet MS', sans-serif; font-size: 15px; color: ${CONFIG.colors.accent}; font-weight: bold;">
                        ${CONFIG.signature.rank}
                    </span>
                </div>
            `;
        } else if (type === 'wait') {
            footer = `
                <hr style="border: 0; border-top: 1px solid #444; margin: 20px auto; width: 60%;">
                <div style="text-align: center; margin-top: 10px;">
                    ${grey('Я постараюсь дать ответ в кратчайшие сроки.')}<br>
                    ${grey('Срок рассмотрения жалобы может составлять до 48-х часов с момента подачи.')}
                </div>
            `;
        }

        return `
            <div style="
                font-family: 'Trebuchet MS', Helvetica, sans-serif;
                font-size: 15px;
                color: #cccccc;
                text-align: center;
                background: #191919;
                border-top: 3px solid ${CONFIG.colors.accent};
                border-bottom: 3px solid ${CONFIG.colors.accent};
                padding: 20px 10px;
                margin: 0 auto;
                width: 90%;
                border-radius: 5px;
            ">
                ${header}
                <div style="padding: 0 10px; line-height: 1.6;">
                    ${bodyText}
                </div>
                ${footer}
            </div>
        `;
    };

    // =========================================================================
    // ШАБЛОНЫ
    // =========================================================================
    const TEMPLATES = [
        // --- На рассмотрении ---
        { title: '—  На рассмотрение  —', isHeader: true },
        {
            title: '🔱 На рассмотрение',
            prefix: CONFIG.prefixes.wait,
            status: 'close',
            pin: true,
            type: 'wait',
            text: `Ваша жалоба взята мной на ${purple('рассмотрение')}.<br><br>
                   Мною были запрошены ${purple('доказательства и пояснения')} у администратора по данной ситуации.<br>
                   Тема временно закрыта от оффтопа во избежание флуда.`
        },
                {
            title: '💢 Не тот раздел',
            prefix: CONFIG.prefixes.wait,
            status: 'close',
            pin: true,
            text: `Ваше обращение не относится к ${purple('Жалобам на Администрацию')}.<br><br>
                   Переношу вас в нужный раздел.<br>
                   ${purple('Ожидайте')}.`
        },


        // --- Отказы ---
        { title: '—  Отказы  —', isHeader: true },
        {
            title: '⛔ Нарушений нет',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Благодарим за ваше обращение.<br><br>
                   Я внимательно изучил доказательства со стороны администратора.<br>
                   Нарушений регламента ${purple('не выявлено')}. Наказание выдано верно.`
        },
        {
            title: '⛔ Нарушений нет ОБЖ',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Благодарим за ваше обращение.<br><br>
                   Я внимательно изучил доказательства со стороны администратора.<br>
                   Нарушений регламента ${purple('не выявлено')}. Наказание выдано верно.<br>
                   Но вы можете обратится в [URL=https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2417/]${purple('Обжалование Наказаний')}[/URL].`
        },
        {
            title: '⛔ Наказание от Тех',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Благодарим за ваше обращение.<br><br>
                   Но к сожелению ваше обращение не относится к жалобам на администрацию.<br>
                   Обратитесь в раздел [URL=https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9654-penza.2387/]${purple('Жалобы на технических специалистов')}[/URL].`
        },
        {
            title: '⛔ Не по форме',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `К сожалению, ваша жалоба составлена ${purple('не по форме')}.<br><br>
                   Пожалуйста, ознакомьтесь с правилами подачи жалоб в закрепленной теме раздела<br>
                   и создайте новую тему, строго следуя установленному шаблону.`
        },
        {
            title: '⛔ Недостаточно док-в',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Рассмотрев вашу жалобу, я вынужден отказать.<br><br>
                   Предоставленных вами доказательств ${purple('недостаточно')} для вынесения объективного вердикта.<br>
                   Невозможно точно установить факт нарушения со стороны администратора.`
        },
        {
            title: '⛔ Отсутствует /time',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `В ваших доказательствах отсутствует обязательная фиксация времени ${purple('(/time)')}.<br><br>
                   Согласно правилам подачи, такие жалобы не подлежат рассмотрению.`
        },
        {
            title: '⛔ От 3-лица',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Ваша жалоба составлена ${purple('от 3-его')} лица.<br><br>
                   Пожалуйста не создавайте дубликаты данной темы.<br>
                   В противном случае ваш форумный аккаунт может быть заблокирован.`
        },
        {
            title: '⛔ Ответ уже был дан',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Вам уже был дан ответ ${purple('в предыдущей')} теме.<br><br>
                   Пожалуйста не создавайте дубликаты данной темы.<br><br>
                   В противном случае ваш форумный аккаунт может быть заблокирован.`
        },
        {
            title: '⛔ Док-ва в соцсетях',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Доказательства, размещенные в социальных сетях (VK, Telegram), ${purple('не принимаются')}.<br><br>
                   Пожалуйста, загрузите ваши материалы на фото/видео хостинги (Imgur, YouTube, Yapix)<br>
                   и создайте новую жалобу.`
        },
        {
            title: '⛔ Лучше в ОБЖ',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `С момента выдачи наказания прошло более ${purple('48 часов')} .<br><br>
                   Срок подачи жалобы ${purple('истек')}.<br>
                   В рассмотрении ${purple('отказано')}.<br>
                   Но вы можете обратится в [URL=https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2417/]${purple('Обжалование Наказаний')}[/URL].`
        },
        {
            title: '⛔ Больше 48 часов',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `С момента выдачи наказания прошло более ${purple('48 часов')} .<br><br>
                   Срок подачи жалобы ${purple('истек')}.<br>
                   В рассмотрении ${purple('отказано')}.`
        },
        {
            title: '⛔ Не чиним',
            prefix: CONFIG.prefixes.close,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Вынужден вам сообщить, что администрация ${purple('не обязана')} чинить ваше транспортное средство.<br><br>
                   Особенно если оно даже ${purple('не сломано')} или его ремонт может негативно повлиять на ${purple('игровой процесс')}.<br>
                   Исходя из всего вышеперечисленного, вынужден отказать.`
        },


        // --- Одобрено ---
        { title: '—  Одобрено  —', isHeader: true },
        {
            title: '🟢 Одобрено (Беседа)',
            prefix: CONFIG.prefixes.ok,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Ваша жалоба была внимательно рассмотрена и получила статус ${purple('Одобрено')}.<br><br>
                   С администратором будет проведена ${purple('профилактическая беседа')} касательно данной ситуации.<br>
                   Благодарим за вашу бдительность и участие в улучшении качества сервера.<br><br>
                   Ваше наказание будет ${purple('снято в ближайшее время')}.`
        },
        {
            title: '🟢 Одобрено (Наказание)',
            prefix: CONFIG.prefixes.ok,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Ваша жалоба была рассмотрена.<br><br>
                   Администратор допустил нарушение регламента и понесет заслуженное ${purple('наказание')}.<br>
                   Приносим извинения за доставленные неудобства.`
        },
        {
            title: '🟢 Одобрено (Снятие)',
            prefix: CONFIG.prefixes.ok,
            status: 'close',
            pin: false,
            type: 'final',
            text: `Ваша жалоба ${purple('одобрена')}.<br><br>
                   Наказание было выдано ошибочно и будет ${purple('снято')} в самое ближайшее время.<br>
                   Если наказание еще активно — свяжитесь со мной в ВК или ожидайте снятия в игре.`
        },

        // --- Передача ---
        { title: '—  Передача  —', isHeader: true },
        {
            title: '👑 Передача ГА',
            prefix: CONFIG.prefixes.ga,
            status: 'close',
            pin: true,
            type: 'transfer',
            text: `Данная ситуация требует рассмотрения ${red('Главным Администратором')}.<br><br>
                   Я передаю вашу жалобу ${red('ГА')}.<br>
                   Пожалуйста, не создавайте дубликаты и ожидайте окончательного вердикта.`
        },
        {
            title: '👑 Передача ЗГА',
            prefix: CONFIG.prefixes.ga,
            status: 'close',
            pin: true,
            type: 'transfer',
            text: `Я передаю вашу жалобу на рассмотрение ${red('Заместителю Главного Администратора')} или ${red('Главному Администратору')}.<br><br>
                   Пожалуйста, ожидайте ответа в данной теме.`
        },
        {
            title: '☣️ Передача Спец. Адм',
            prefix: CONFIG.prefixes.spec,
            status: 'close',
            pin: true,
            type: 'transfer',
            text: `Ситуация требует вмешательства руководства проекта.<br><br>
                   Жалоба передана ${red('Специальной Администрации')}.<br>
                   Срок рассмотрения может быть увеличен.`
        },
        {
            title: '🛠 Передача Тех. Спецу',
            prefix: CONFIG.prefixes.tech,
            status: 'close',
            pin: true,
            type: 'transfer',
            text: `Ваше обращение относится к технической части сервера.<br><br>
                   Я передаю жалобу ${color('Техническому Специалисту', '#FFD700')}.<br>
                   Ожидайте ответа.`
        }
    ];

    // =========================================================================
    // UI ПАНЕЛИ + API
    // =========================================================================
    class PenzaScript {
        constructor() {
            this.init();
        }

        init() {
            this.addGlobalStyles();
            this.createOverlay();
        }

        addGlobalStyles() {
            const css = `
                .penza-panel {
                    position: fixed;
                    top: 15%;
                    right: 15px;
                    width: 280px;
                    background: #181818;
                    border-left: 4px solid ${CONFIG.colors.primary};
                    border-radius: 8px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.8);
                    z-index: 99999;
                    font-family: 'Segoe UI', sans-serif;
                    transition: transform 0.3s ease;
                }
                .penza-head {
                    padding: 12px;
                    background: linear-gradient(90deg, rgba(153, 50, 204, 0.2), transparent);
                    color: white;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    cursor: pointer;
                    border-bottom: 1px solid #333;
                }
                .penza-body {
                    padding: 10px;
                    max-height: 65vh;
                    overflow-y: auto;
                }
                .penza-body::-webkit-scrollbar { width: 4px; }
                .penza-body::-webkit-scrollbar-thumb { background: ${CONFIG.colors.primary}; }

                .penza-nav-btn {
                    display: block;
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 6px;
                    background: #252525;
                    border: 1px solid #333;
                    border-radius: 4px;
                    color: #fff;
                    text-decoration: none;
                    text-align: center;
                    font-size: 12px;
                    font-weight: bold;
                    transition: 0.2s;
                }
                .penza-nav-btn:hover {
                    background: ${CONFIG.colors.primary};
                    border-color: ${CONFIG.colors.primary};
                }

                .penza-tpl-btn {
                    width: 100%;
                    padding: 8px 12px;
                    margin-bottom: 4px;
                    background: transparent;
                    border: 1px solid #2a2a2a;
                    color: #ccc;
                    text-align: left;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.2s;
                }
                .penza-tpl-btn:hover {
                    background: rgba(153, 50, 204, 0.15);
                    border-color: ${CONFIG.colors.primary};
                    color: #fff;
                    padding-left: 18px;
                }

                .penza-sep {
                    text-align: center;
                    font-size: 10px;
                    color: ${CONFIG.colors.primary};
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin: 15px 0 5px 0;
                    font-weight: 800;
                    opacity: 0.8;
                }

                .penza-minimized {
                    transform: translateX(240px);
                    opacity: 0.8;
                }
                .penza-minimized .penza-body {
                    display: none;
                }
            `;
            const style = document.createElement('style');
            style.innerHTML = css;
            document.head.appendChild(style);
        }

        createOverlay() {
            const div = document.createElement('div');
            div.className = 'penza-panel';
            div.innerHTML = `
                <div class="penza-head" id="penzaToggle">
                    <span>🛡️ PENZA | Куратор Администрации</span>
                    <span>≡</span>
                </div>
                <div class="penza-body">
                    <div class="penza-sep" style="margin-top:0;">Навигация</div>
                    <a href="${CONFIG.links.complaintsAdmin}" target="_blank" class="penza-nav-btn">Жалобы на Адм</a>
                    <a href="${CONFIG.links.adminSection}" target="_blank" class="penza-nav-btn">Админ Раздел</a>
                    <a href="${CONFIG.links.generalRules}" target="_blank" class="penza-nav-btn">Общие правила</a>

                    <div id="penza-tpl-container"></div>
                </div>
            `;
            document.body.appendChild(div);

            document.getElementById('penzaToggle').onclick = () => {
                div.classList.toggle('penza-minimized');
            };

            this.renderTemplates();
        }

        renderTemplates() {
            const container = document.getElementById('penza-tpl-container');
            TEMPLATES.forEach(tpl => {
                if (tpl.isHeader) {
                    const sep = document.createElement('div');
                    sep.className = 'penza-sep';
                    sep.innerText = tpl.title.replace(/—/g, '');
                    container.appendChild(sep);
                } else {
                    const btn = document.createElement('button');
                    btn.className = 'penza-tpl-btn';
                    btn.innerText = tpl.title;
                    btn.onclick = () => this.applyTemplate(tpl);
                    container.appendChild(btn);
                }
            });
        }

        async applyTemplate(tpl) {
            const editor = document.querySelector('.fr-element.fr-view');
            if (!editor) {
                alert('Редактор сообщений не найден!');
                return;
            }

            const finalHtml = makeTemplate(tpl.text, tpl.type);
            editor.innerHTML = finalHtml;

            const submitBtn = document.querySelector('.button--primary.button--icon--reply');
            if (submitBtn) submitBtn.click();

            const match = window.location.href.match(/\.(\d+)\//);
            const threadId = match ? match[1] : null;
            if (threadId) {
                await this.changeThreadStatus(threadId, tpl);
            }
        }

        // ===========================================
        // ИСПРАВЛЕННАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ СТАТУСА
        // ===========================================
        async changeThreadStatus(threadId, tpl) {
            const csrf = document.getElementsByName('_xfToken')[0]?.value;
            if (!csrf) return;

            // 1. Получаем ЧИСТЫЙ заголовок (без html префиксов)
            const getCleanTitle = () => {
                const h1 = document.querySelector('h1.p-title-value');
                // Если заголовка нет, берем из title и режем мусор
                if (!h1) return document.title.split('|')[0].trim();

                // Клонируем, чтобы не портить страницу
                const clone = h1.cloneNode(true);
                // Удаляем лейблы (сам префикс)
                const labels = clone.querySelectorAll('.label');
                labels.forEach(label => label.remove());

                return clone.textContent.trim();
            };

            const cleanTitle = getCleanTitle();

            const url = `/threads/${threadId}/edit`;
            const form = new FormData();
            form.append('prefix_id', tpl.prefix);
            form.append('title', cleanTitle); // Отправляем чистый заголовок
            form.append('_xfToken', csrf);
            form.append('_xfRequestUri', window.location.href);
            form.append('_xfWithData', 1);
            form.append('_xfResponseType', 'json');
            form.append('discussion_open', tpl.status === 'close' ? 0 : 1);
            form.append('sticky', tpl.pin ? 1 : 0);

            try {
                await fetch(url, { method: 'POST', body: form });
                setTimeout(() => window.location.reload(), 1500);
            } catch (e) {
                console.error(e);
            }
        }
    }

    new PenzaScript();
})();
