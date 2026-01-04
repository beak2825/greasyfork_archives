// ==UserScript==
// @name         [REALLYWORLD] Forum moderators by cnic
// @description  Автоматизация ответов, простановка тегов для форума ReallyWorld.
// @author       cnic
// @connection   https://vk.com/misterpp
// @namespace    rwforumscriptcnic
// @version      7.2.0
// @match        https://f.reallyworld.me/topic/*
// @match        https://f.reallyworld.me/forum/*
// @icon         https://iili.io/fBQtpg2.gif
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559349/%5BREALLYWORLD%5D%20Forum%20moderators%20by%20cnic.user.js
// @updateURL https://update.greasyfork.org/scripts/559349/%5BREALLYWORLD%5D%20Forum%20moderators%20by%20cnic.meta.js
// ==/UserScript==

(function () {
    'use strict';

   
    function openAllTopics() {
        const links = Array.from(document.querySelectorAll('.ipsDataItem_title a[href*="/topic/"]'));
        if (links.length === 0) return;

        if (confirm(`Открыть все темы на этой странице (${links.length} шт.)?`)) {
            links.forEach((link, index) => {
                setTimeout(() => { window.open(link.href, '_blank'); }, index * 300);
            });
        }
    }

    function createListButton() {
        if (document.getElementById('rw-open-all-btn')) return;
        const createTopicBtn = document.querySelector('a[href*="do=add"].ipsButton_important');
        if (!createTopicBtn) return;

        const container = createTopicBtn.parentElement;
        const newLi = document.createElement('li');
        newLi.className = 'ipsToolList_primaryAction';
        newLi.style = 'margin-bottom: 8px;';

        const btn = document.createElement('a');
        btn.id = 'rw-open-all-btn';
        btn.className = 'ipsButton ipsButton_medium ipsButton_fullWidth';
        btn.style = 'background: #4834d4 !important; color: white !important; border-radius: 6px; font-weight: bold; cursor: pointer;';
        btn.innerHTML = '🚀 ОТКРЫТЬ ВСЕ ТЕМЫ';
        btn.onclick = (e) => { e.preventDefault(); openAllTopics(); };

        newLi.appendChild(btn);
        container.parentNode.insertBefore(newLi, container);
    }

    

    function isLongWait() {
        try {
            const firstPost = document.querySelector('article.cPost');
            const timeElement = firstPost?.querySelector('time[datetime]');
            if (timeElement) {
                const postDate = new Date(timeElement.getAttribute('datetime'));
                const now = new Date();
                const diffInHours = (now - postDate) / (1000 * 60 * 60);
                return diffInHours >= 24;
            }
        } catch (e) { console.log("Ошибка проверки времени:", e); }
        return false;
    }

    function getAuthorName() {
        const firstPost = document.querySelector('article.cPost');
        if (firstPost) {
            const quoteData = firstPost.querySelector('[data-quotedata]')?.getAttribute('data-quotedata');
            if (quoteData) {
                try {
                    const data = JSON.parse(quoteData);
                    if (data.username) return `, <b style="color: #FFD700;">${data.username}</b>`;
                } catch (e) {}
            }
            const nameLink = firstPost.querySelector('aside.ipsComment_author h3 a');
            if (nameLink) return `, <b style="color: #FFD700;">${nameLink.innerText.trim()}</b>`;
        }
        return '!';
    }

    const footer = `<br><br>Хорошего дня и отличного настроения, спасибо за то, что Вы с нами!<br>С уважением, администрация <span style="color: #ffffff;">Really</span><span style="color: #ffa500;">World</span>.`;
    const red = (t) => `<span style="color: #ff4d4d;"><b>${t}</b></span>`;
    const green = (t) => `<span style="color: #2ecc71;"><b>${t}</b></span>`;
    const orange = (t) => `<span style="color: #ffa500;"><b>${t}</b></span>`;

     const sections = {
        tech: [
            { title: 'Бот/Взлом', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Для восстановления аккаунта пишите в техническую поддержку - https://vk.com/reallyworld_tech . Инструкция по восстановлению аккаунта - https://telegra.ph/Vosstanovlenie-akkaunta-ReallyWorld-02-21 .` + footer },
            { title: 'Верно выдано', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Наказание выдано верно. Блокировка остаётся в силе.` + footer },
            { title: 'Не тот раздел', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Не тот раздел. Обратитесь в раздел "Жалобы на администрацию" ( https://f.reallyworld.me/forum/10-жалобы-на-администрацию/ ).` + footer },
            { title: 'Не по форме', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Не по форме.` + footer },
            { title: 'Скрин/Видео', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Предоставьте скриншот или видео загруженное на imgur или youtube.` + footer },
            { title: 'Недостаточно (Шар)', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Недостаточно доказательств. В следующий раз покажите тип шара на видеодоказательстве.` + footer },
            { title: 'Вернем 30р', tag: 'одобрено', color: '#56ab2f', content: `Здравствуйте{name}<br>${green('Закрыто.')} Вернем 30р за инв.` + footer },
            { title: 'Размут', tag: 'одобрено', color: '#56ab2f', content: `Здравствуйте{name}<br>${green('Закрыто.')} Выдадим размут.` + footer },
            { title: 'Высшая АДМ', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Жалобы на высшую администрацию не рассматриваются.` + footer },
            { title: 'Не баг', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Это не баг, проблема с вашей стороны.` + footer },
            { title: 'Ждите фикс', tag: 'отказано', color: '#4facfe', content: `Здравствуйте{name}<br>${red('Отказано.')} Администрация знает. Ждите фикс.` + footer },
            { title: 'Покупка', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Администрация знает. Покупки выданы.<br>Если вам так и не пришла покупка, отправьте сообщение в ТП - https://vk.com/reallyworld_tech.` + footer },
            { title: 'Доква Видео', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Предоставьте видеодоказательства.` + footer },
            { title: 'Пофикшено', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Администрация знает. Пофикшено.` + footer },
            { title: 'Зарубеж Оплата', tag: 'отказано', color: '#7f8c8d', content: `Здравствуйте{name}<br>На данный момент зарубежные оплаты не работают, проблема на стороне зарубежного трафика. Следите тут: https://t.me/rwinfo` + footer },
            { title: '/ec фикс', tag: 'отказано', color: '#4facfe', content: `Здравствуйте{name}<br>${red('Отказано.')} Администрация знает. Ждите фикс. После рестарта (4:00 по МСК) возможность вернётся.` + footer },
            { title: 'Протокол', tag: 'отказано', color: '#4facfe', content: `Здравствуйте{name}<br>${red('Отказано.')} Администрация знает. Ждите фикс. Зайдите с версии ниже (1.20 / 1.16.5).` + footer },
            { title: 'Текстуры/РП', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Это не баг, проблема с вашей стороны. Выставьте параметр "запрашивать ресурсы" - включить.` + footer },
            { title: 'Портал/Застрял', tag: 'отказано', color: '#7f8c8d', content: `Здравствуйте{name}{delay}<br>${red('Отказано.')} Это не баг, а механика Minecraft. Скачайте мод MacroKey Keybinding. С помощью этого мода можно сделать бинд на любую команду для любой из клавиш на клавиатуре. Чтобы создать новый бинд - нужно нажать на английскую букву K на клавиатуре. Инструкция по созданию нового бинда:<br>1. Зайдите на гриф, на котором вы застряли в портале.<br>2. Нажмите на английскую букву "K" на клавиатуре.<br>3. В открытой менюшке нажмите на кнопку "Добавить макро"<br>4. В строку "Команда" вписываем команду /spawn.<br>5. В "Триггер" указываем на кнопку, при которой бинд будет срабатывать.<br>6. Нажмите на кнопку, которую вы выбрали для пункта 5. Вас телепортирует на спавн.` + footer },
            { title: 'Пинг/Лаги', tag: 'отказано', color: '#4facfe', content: `Здравствуйте{name}<br>${red('Отказано.')} Администрация знает. Ждите фикс. Руководство: https://docs.google.com/document/d/1Nvze765auX7w8E9zaqhbLSW_1UGHfitOuMUcFxlEVdk` + footer },
            { title: 'Телефон/Обрезан', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Обрезанные скрины, или же скрины с телефона не принимаются.<br>g` + footer },
            { title: 'Одобрено', tag: 'одобрено', color: '#56ab2f', content: `Здравствуйте{name}<br>${green('Одобрено.')} Игрок получит наказание.` + footer }
        ],
        admin: [
            { title: 'Читер', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Жалобы от читеров не рассматриваются.` + footer },
            { title: 'Срок 3 дня', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Срок подачи жалобы - 3 дня.` + footer },
            { title: 'Повтор', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Повтор.` + footer },
            { title: 'Телефон/Обрезан', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Обрезанные скрины, или же скрины с телефона не принимаются.` + footer },
            { title: 'Бан-лист', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Предоставьте скриншот бан-листа.` + footer },
            { title: 'Верно выдано', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Наказание выдано верно.` + footer },
            { title: 'Вы не в бане', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Вы не в бане.` + footer },
            { title: 'Дата неверна', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Не верно указана дата.` + footer },
            { title: 'Анти-спам', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Не тот раздел, обратитесь в раздел "Жалобы на АНТИ-СПАМ".` + footer },
            { title: 'Ник неверный', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Ваш ник указан неверно.` + footer },
            { title: 'Высшая АДМ', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Жалобы на высшую администрацию не принимаются.` + footer },
            { title: 'VK RWADM', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Обратитесь в https://vk.com/rwadm.` + footer },
            { title: 'Не по форме', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Не по форме.` + footer },
            { title: 'На рассмотрении', tag: 'на рассмотрении', color: '#ffa500', content: `Здравствуйте{name}<br>${orange('На рассмотрении.')}` + footer },
            { title: 'Одобрено', tag: 'одобрено', color: '#56ab2f', content: `Здравствуйте{name}<br>${green('Одобрено.')}` + footer }
        ],
        players: [
            { title: 'Одобрено', tag: 'одобрено', color: '#56ab2f', content: `Здравствуйте{name}<br>${green('Одобрено.')}` + footer },
            { title: 'Не тот раздел', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Не тот раздел.` + footer },
            { title: 'Не по форме', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Не по форме.` + footer },
            { title: 'Скриншот/Телефон', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Обрезанные скрины, скрины с телефона не принимаются.` + footer },
            { title: 'Укажите 1 ник', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Укажите 1 ник.` + footer },
            { title: 'Нарушений нет', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Нарушений нет.` + footer },
            { title: 'Недостаточно док-в', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Недостаточно доказательств.` + footer },
            { title: 'Обман АДМ', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Попытка обмана администрации.` + footer },
            { title: 'Огр. доступ', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Ограниченный доступ у доказательств.` + footer },
            { title: 'Таймкод', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Укажите таймкод.` + footer },
            { title: 'Чат/Скорборд', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Отсутствует скорборд, либо чат.` + footer },
            { title: 'В тех-поддержку', tag: 'отказано', color: '#4facfe', content: `Здравствуйте{name}<br>Обратитесь в тех-поддержку - https://vk.com/reallyworld_tech` + footer }
        ],
        antispam: [
            { title: 'Одобрено', tag: 'одобрено', color: '#56ab2f', content: `Здравствуйте{name}<br>${green('Одобрено.')} Блокировка будет снята.` + footer },
            { title: 'Отказ', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Наказание выдано верно.` + footer },
            { title: 'Не по форме', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Не по форме.` + footer },
            { title: 'Скриншот/Телефон', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Обрезанные скрины, скрины с телефона не принимаются.` + footer },
            { title: 'Не тот раздел', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Не тот раздел. Обратитесь в раздел "Жалобы на администрацию" ( https://f.reallyworld.me/forum/10-жалобы-на-администрацию/ ).` + footer },
            { title: 'Не тот раздел(игроки)', tag: 'отказано', color: '#cb2d3e', content: `Здравствуйте{name}<br>${red('Отказано.')} Не тот раздел. Обратитесь в раздел "Жалобы на игроков" ( https://f.reallyworld.me/forum/11-жалобы-на-игроков/ ).` + footer }

        ]
    };

    async function setTag(tagName) {
        try {
            const csrfKey = String(ips.getSetting('csrfKey'));
            const body = `form_submitted=1&csrfKey=${csrfKey}&topic_tags=${encodeURIComponent(tagName)}&topic_tags_freechoice_prefix=on&topic_tags_prefix=${encodeURIComponent(tagName)}`;
            await fetch(window.location.href.split('?')[0] + '?do=editTags', { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "x-requested-with": "XMLHttpRequest" }, body: body });
        } catch(e) {}
    }

    function handleButtonClick(btn, element) {
        const ed = document.querySelector('.cke_wysiwyg_div[contenteditable="true"]');
        if (ed) {
            const delayText = isLongWait() ? '<br>Извините за долгое рассмотрение жалобы.' : '';
            let finalContent = btn.content.replace('{name}', getAuthorName()).replace('{delay}', delayText);
            ed.innerHTML = `<center>${finalContent}</center>`;
            ed.focus();
        }
        setTag(btn.tag);
        if (btn.tag !== 'на рассмотрении') {
            setTimeout(() => {
                const a = document.querySelector('a[href*="action=unhide"]'); if (a) a.click();
                setTimeout(() => { const l = document.querySelector('a[href*="action=lock"]'); if (l) l.click(); }, 600);
            }, 1000);
        }
    }

    function createPanel() {
        if (document.getElementById('rw-helper-panel')) return;
        const target = document.querySelector('.ipsComposeArea') || document.querySelector('#commentForm');
        if (!target) return;

        const panel = document.createElement('div');
        panel.id = 'rw-helper-panel';
        panel.style = `margin: 10px 0; padding: 15px; background: rgba(0, 21, 36, 0.85); backdrop-filter: blur(10px); border-radius: 16px; display: flex; flex-direction: column; gap: 12px; border: 1.5px solid #4facfe; box-shadow: 0 8px 25px rgba(0,0,0,0.5);`;

        const tabsContainer = document.createElement('div');
        tabsContainer.style = `display: flex; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;`;

        const btnsContainer = document.createElement('div');
        btnsContainer.style = `display: flex; flex-wrap: wrap; gap: 8px;`;

        const style = document.createElement('style');
        style.innerHTML = `
            .rw-btn { padding: 6px 12px; border-radius: 10px; border: none; color: #fff !important; font-weight: bold; font-size: 11px; cursor: pointer; transition: 0.2s; }
            .rw-btn:hover { transform: translateY(-2px); filter: brightness(1.2); }
            .rw-tab-btn { padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #aaa; font-size: 10px; font-weight: bold; cursor: pointer; transition: 0.3s; }
            .rw-tab-btn.active { background: #4facfe; color: #fff; border-color: #4facfe; }
        `;
        document.head.appendChild(style);

        const tabData = [{id:'tech',label:'🛠 ТЕХ'}, {id:'players',label:'👤 ИГРОКИ'}, {id:'admin',label:'🛡 АДМИНКА'}, {id:'antispam',label:'🚫 АНТИ-СПАМ'}]
        let activeTab = localStorage.getItem('rw_active_tab') || 'tech';

        const renderButtons = (sectionId) => {
            btnsContainer.innerHTML = '';
            sections[sectionId].forEach(btn => {
                const b = document.createElement('button');
                b.className = 'rw-btn';
                b.style.background = btn.color;
                b.innerText = btn.title;
                b.onclick = () => handleButtonClick(btn, b);
                btnsContainer.appendChild(b);
            });
        };

        tabData.forEach(tab => {
            const t = document.createElement('button');
            t.className = `rw-tab-btn ${activeTab === tab.id ? 'active' : ''}`;
            t.innerText = tab.label;
            t.onclick = () => {
                activeTab = tab.id;
                localStorage.setItem('rw_active_tab', activeTab);
                document.querySelectorAll('.rw-tab-btn').forEach(el => el.classList.remove('active'));
                t.classList.add('active');
                renderButtons(activeTab);
            };
            tabsContainer.appendChild(t);
        });

        panel.appendChild(tabsContainer);
        panel.appendChild(btnsContainer);
        target.prepend(panel);
        renderButtons(activeTab);
    }

    
    const mainInit = () => {
        if (window.location.href.includes('/forum/')) {
            createListButton();
        }
        if (window.location.href.includes('/topic/')) {
            if (document.querySelector('.cke_wysiwyg_div[contenteditable="true"]')) createPanel();
        }
    };

    const observer = new MutationObserver(mainInit);
    observer.observe(document.body, { childList: true, subtree: true });
    mainInit();
})();