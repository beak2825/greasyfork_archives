// ==UserScript==
// @name         Bless Russia Forum Helper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Moderator helper for Bless Russia forum - beautiful buttons and response templates
// @author       YourName
// @match        https://forum.blessrussia.online/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Добавляем стили через создание элемента style
    const styles = `
        .brf-container {
            background: #1a237e;
            border: 2px solid #fff;
            border-radius: 0px;
            padding: 15px;
            margin: 15px 0;
            color: white;
            font-family: 'Arial', sans-serif;
        }
        
        .brf-header {
            text-align: center;
            font-size: 20px;
            font-weight: normal;
            margin-bottom: 15px;
            color: #fff;
            border-bottom: 1px solid #fff;
            padding-bottom: 10px;
        }
        
        .brf-buttons-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 15px;
        }
        
        .brf-btn {
            background: #283593;
            border: 1px solid #fff;
            border-radius: 0px;
            color: white;
            padding: 10px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
        }
        
        .brf-btn:hover {
            background: #3949ab;
            transform: translateY(-1px);
        }
        
        .brf-section {
            background: rgba(255,255,255,0.1);
            border-radius: 0px;
            padding: 12px;
            margin: 12px 0;
            border-left: 3px solid #5c6bc0;
        }
        
        .brf-section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #e8eaf6;
        }
        
        .brf-sub-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
            margin-top: 8px;
        }
        
        .brf-sub-btn {
            background: #c62828;
            border: 1px solid #fff;
            border-radius: 0px;
            color: white;
            padding: 6px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .brf-sub-btn:hover {
            background: #d32f2f;
            transform: translateY(-1px);
        }
        
        .brf-templates {
            background: rgba(255,255,255,0.05);
            border-radius: 0px;
            padding: 8px;
            margin: 8px 0;
        }
        
        .brf-template-btn {
            background: #2e7d32;
            border: 1px solid #fff;
            border-radius: 0px;
            color: white;
            padding: 6px 10px;
            margin: 3px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .brf-template-btn:hover {
            background: #388e3c;
            transform: translateY(-1px);
        }
        
        .brf-prefix-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 0px;
            font-size: 9px;
            font-weight: bold;
            margin-left: 5px;
            border: 1px solid #fff;
        }
        
        .brf-approved { background: #1b5e20; }
        .brf-denied { background: #b71c1c; }
        .brf-pending { background: #f57f17; color: #fff; }
        .brf-important { background: #6a1b9a; }
        .brf-closed { background: #37474f; }
        
        .brf-rules-block {
            background: rgba(0,0,0,0.3);
            border: 1px solid #5c6bc0;
            padding: 10px;
            margin: 8px 0;
            font-size: 11px;
            line-height: 1.3;
        }
        
        .brf-rules-title {
            font-weight: bold;
            color: #ffeb3b;
            margin-bottom: 5px;
        }
    `;

    // Функция добавления стилей
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // Функция создания основного интерфейса
    function createMainInterface() {
        const editor = document.querySelector('textarea[name="message"]');
        if (!editor) return;
        
        // Проверяем, не добавлен ли уже наш интерфейс
        if (document.querySelector('.brf-container')) return;
        
        const container = document.createElement('div');
        container.className = 'brf-container';
        container.innerHTML = `
            <div class="brf-header">Bless Russia Forum Helper</div>
            
            <div class="brf-section">
                <div class="brf-section-title">Префиксы темы</div>
                <div class="brf-buttons-grid">
                    <button class="brf-btn" data-prefix="На рассмотрении">На рассмотрении</button>
                    <button class="brf-btn" data-prefix="Спец Адм">Спец Адм</button>
                    <button class="brf-btn" data-prefix="Команде проекта">Команде проекта</button>
                    <button class="brf-btn" data-prefix="Главному администратору">Главному администратору</button>
                    <button class="brf-btn" data-prefix="Отказано">Отказано</button>
                    <button class="brf-btn" data-prefix="Важно">Важно</button>
                    <button class="brf-btn" data-prefix="Закрыто">Закрыто</button>
                </div>
            </div>
            
            <div class="brf-section">
                <div class="brf-section-title">Ответы на жалобы</div>
                <div class="brf-sub-buttons">
                    <button class="brf-sub-btn" data-template="complaint_pending">Ваша жалоба на рассмотрении</button>
                    <button class="brf-sub-btn" data-template="complaint_rules">Правила подачи жалоб</button>
                    <button class="brf-sub-btn" data-template="complaint_approved">Жалоба одобрена</button>
                    <button class="brf-sub-btn" data-template="complaint_denied">Жалоба отклонена</button>
                    <button class="brf-sub-btn" data-template="complaint_timeout">Истек срок подачи</button>
                    <button class="brf-sub-btn" data-template="complaint_evidence">Недостаточно доказательств</button>
                </div>
                
                <div class="brf-rules-block">
                    <div class="brf-rules-title">Правила жалоб:</div>
                    • Срок подачи - 72 часа с нарушения<br>
                    • Обязательно /time в доказательствах<br>
                    • Запрещены жалобы от 3-го лица<br>
                    • Доказательства на разрешенных хостингах
                </div>
            </div>
            
            <div class="brf-section">
                <div class="brf-section-title">Ответы на биографии</div>
                <div class="brf-sub-buttons">
                    <button class="brf-sub-btn" data-template="bio_approved">Биография одобрена</button>
                    <button class="brf-sub-btn" data-template="bio_denied">Биография отклонена</button>
                    <button class="brf-sub-btn" data-template="bio_rules">Правила составления биографий</button>
                    <button class="brf-sub-btn" data-template="bio_correction">Требуются исправления</button>
                </div>
                
                <div class="brf-rules-block">
                    <div class="brf-rules-title">Правила биографий:</div>
                    • Заголовок: "Биография гражданина [Имя Фамилия]"<br>
                    • Имя и фамилия на русском языке<br>
                    • Запрещены nRP никнеймы и PG<br>
                    • Срок рассмотрения - 24 часа
                </div>
            </div>
            
            <div class="brf-section">
                <div class="brf-section-title">Быстрые ответы</div>
                <div class="brf-templates">
                    <button class="brf-template-btn" data-template="warning">Предупреждение</button>
                    <button class="brf-template-btn" data-template="ban_1d">Бан 1 день</button>
                    <button class="brf-template-btn" data-template="ban_7d">Бан 7 дней</button>
                    <button class="brf-template-btn" data-template="ban_30d">Бан 30 дней</button>
                    <button class="brf-template-btn" data-template="permaban">Пермабан</button>
                    <button class="brf-template-btn" data-template="jail_30">Jail 30 мин</button>
                    <button class="brf-template-btn" data-template="jail_60">Jail 60 мин</button>
                    <button class="brf-template-btn" data-template="mute_30">Mute 30 мин</button>
                </div>
            </div>
        `;
        
        editor.parentNode.insertBefore(container, editor);
        
        // Обработчики для кнопок префиксов
        container.querySelectorAll('[data-prefix]').forEach(btn => {
            btn.addEventListener('click', function() {
                const prefix = this.getAttribute('data-prefix');
                applyPrefix(prefix);
            });
        });
        
        // Обработчики для шаблонов
        container.querySelectorAll('[data-template]').forEach(btn => {
            btn.addEventListener('click', function() {
                const template = this.getAttribute('data-template');
                applyTemplate(template);
            });
        });
    }

    // Функция применения префикса
    function applyPrefix(prefix) {
        const subjectField = document.querySelector('input[name="subject"]');
        if (subjectField) {
            subjectField.value = `[${prefix}] ${subjectField.value}`;
        }
    }

    // Функция применения шаблона
    function applyTemplate(template) {
        const editor = document.querySelector('textarea[name="message"]');
        if (!editor) return;
        
        const templates = {
            complaint_pending: `**Ваша жалоба взята на рассмотрение**\n\nУважаемый игрок, ваша жалоба была принята и взята на рассмотрение администрацией проекта. Срок рассмотрения жалобы составляет 2 рабочих дня.\n\n*С уважением, Администрация проекта Bless Russia*`,

            complaint_rules: `**Правила подачи жалоб**\n\nУважаемый игрок, обращаем ваше внимание на правила подачи жалоб:\n\n• Срок подачи жалобы - 72 часа с момента нарушения\n• Обязательно указание /time в доказательствах\n• Запрещена подача жалоб от третьего лица\n• Доказательства должны быть загружены на разрешенные хостинги\n• Видеодоказательства должны быть в оригинальном виде\n\nПожалуйста, убедитесь, что ваша жалоба соответствует всем требованиям.`,

            complaint_approved: `**Жалоба одобрена**\n\nПо результатам рассмотрения вашей жалобы было выявлено нарушение правил проекта. К нарушителю применены соответствующие санкции.\n\n*С уважением, Администрация проекта Bless Russia*`,

            complaint_denied: `**Жалоба отклонена**\n\nВаша жалоба была отклонена по следующим причинам:\n• Недостаточно доказательств нарушения\n• Нарушение не было выявлено\n• Несоответствие требованиям к оформлению жалобы\n\n*С уважением, Администрация проекта Bless Russia*`,

            complaint_timeout: `**Истек срок подачи жалобы**\n\nУважаемый игрок, срок подачи жалобы (72 часа с момента нарушения) истек. В соответствии с правилами проекта, жалоба не может быть рассмотрена.\n\n*С уважением, Администрация проекта Bless Russia*`,

            complaint_evidence: `**Недостаточно доказательств**\n\nДля рассмотрения вашей жалобы требуются дополнительные доказательства:\n• Видеодоказательство с тайм-кодами\n• Скриншоты высокого качества\n• Подтверждение времени нарушения (/time)\n\nПожалуйста, предоставьте недостающие доказательства.`,

            bio_approved: `**Биография одобрена**\n\nВаша Role Play биография была успешно проверена и одобрена. Приятной игры на проекте!\n\n*С уважением, Администрация проекта Bless Russia*`,

            bio_denied: `**Биография отклонена**\n\nВаша биография была отклонена по причине:\n• Несоответствие форме заполнения\n• Нарушение правил составления биографий\n• Наличие элементов Power Gaming\n• Копирование чужой биографии\n\nПожалуйста, исправьте указанные недочеты и подайте биографию заново.`,

            bio_rules: `**Правила составления биографий**\n\nОсновные требования:\n• Заголовок: "Биография гражданина [Имя Фамилия]"\n• Имя и фамилия на русском языке\n• Запрещены nRP никнеймы и PG элементы\n• Запрещено копирование биографий\n• Срок рассмотрения - 24 часа\n\nФорма заполнения включает основную информацию и историю жизни персонажа.`,

            bio_correction: `**Требуются исправления**\n\nВ вашей биографии необходимо исправить следующие моменты:\n• [Указать конкретные пункты для исправления]\n• [Указать конкретные пункты для исправления]\n\nПосле внесения исправлений биография будет пересмотрена.`,

            warning: `**Устное замечание**\n\nВам выдано устное замечание за нарушение правил проекта. Обратите внимание на свое поведение в дальнейшем.`,

            ban_1d: `**Блокировка 1 день**\n\nВаш игровой аккаунт заблокирован на 1 день за нарушение правил проекта.`,

            ban_7d: `**Блокировка 7 дней**\n\nВаш игровой аккаунт заблокирован на 7 дней за нарушение правил проекта.`,

            ban_30d: `**Блокировка 30 дней**\n\nВаш игровой аккаунт заблокирован на 30 дней за нарушение правил проекта.`,

            permaban: `**Перманентная блокировка**\n\nВаш игровой аккаунт заблокирован навсегда за грубое нарушение правил проекта.`,

            jail_30: `**Jail 30 минут**\n\nВы изолированы на 30 минут за нарушение правил Role Play процесса.`,

            jail_60: `**Jail 60 минут**\n\nВы изолированы на 60 минут за нарушение правил Role Play процесса.`,

            mute_30: `**Mute 30 минут**\n\nВам заблокирован доступ к чатам на 30 минут за нарушение правил общения.`
        };

        if (templates[template]) {
            editor.value = templates[template];
            editor.scrollIntoView({ behavior: 'smooth' });
            editor.focus();
        }
    }

    // Инициализация
    function init() {
        addStyles();
        
        // Проверяем каждые 500ms на наличие редактора (для динамических страниц)
        const checkEditor = setInterval(() => {
            if (document.querySelector('textarea[name="message"]')) {
                createMainInterface();
                clearInterval(checkEditor);
            }
        }, 500);
        
        // Также проверяем сразу
        if (document.querySelector('textarea[name="message"]')) {
            createMainInterface();
        }
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();