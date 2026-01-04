// ==UserScript==
// @name         LZT_TTS_Notifications
// @namespace    MeloniuM/LZT
// @author       MeloniuM
// @version      1.0
// @description  Озвучка live-уведомлений с настройками голоса
// @match        https://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560220/LZT_TTS_Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/560220/LZT_TTS_Notifications.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $('head').append(`
    <style>
    .tts-group label {
        cursor: pointer;
        padding: 6px 0 0;
    }
    .tts-group label:not(:has(.tts-group-toggle)) {
        max-height: 40px;
        opacity: 1;
        transform: translateY(0);
        overflow: hidden;
        margin-left: 20px;
        display: block;
        transition:
            max-height 0.25s ease,
            opacity 0.15s ease,
            transform 0.15s ease;
    }
    .tts-types {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(2, 1fr);
        padding: 10px 0px;
    }
    /*
    .tts-group:has(.tts-group-toggle:not(:checked))
    label:not(:has(.tts-group-toggle)) {
        max-height: 0;
        opacity: 0;
        transform: translateY(-4px);
        pointer-events: none;
    }
    */

    .tts-group-toggle {
        accent-color: #4caf50;
    }

    .tts-volume, .tts-rate, .tts-pitch {
        accent-color: #228e5d;
    }
    .tts-group {
        border: 1px solid #2a2a2a;
        border-radius: 6px;
        margin-bottom: 10px;
        background: #1c1c1c;
        padding: 7px;
    }
    </style>
    `);


    /* =======================
       TTS SETTINGS STORAGE
    ======================= */

    const TTS_SETTINGS_KEY = 'lzt_tts_settings'; 

    const ALERT_SCHEMA = {
        conversation: {
            label: 'Личные сообщения',
            children: {
                join: 'Добавление в беседу',
                kick: 'Кикнут'
            }
        },

        report: {
            label: 'Жалоба',
            children: {
                report_rejected: 'Жалоба отклонена',
                report_resolved: 'Жалоба решена',
                report_content: 'Жалоба на контент'
            }
        },

        thread: {
            label: 'Темы',
            children: {
                insert: 'Ответил в теме/Создал тему',
                reply: 'Ответ в теме',
                mention: 'Упоминание',
                quote: 'Цитирование',
                move_by_keyword: 'Перемещено по ключевому слову',
                reply_ban: 'Блокировка ответа в теме',
                watch: 'Новая тема по подписке',
                thread_delete: 'Тема удалена',
                thread_approve: 'Тема одобрена',
                closed_inactive: 'Тема закрыта за неактивность',
                thread_move: 'Перемещение темы',
                thread_merge: 'Объединение темы',
                threadmention: 'Упоминание в теме',
                tag: 'Тег (упоминание в теме)'
            }
        },

        user: {
            label: 'Пользователь',
            children: {
                like: 'Симпатия',
                like2: 'Лайк',
                following: 'Подписка',
                from_admin: 'Сообщение от администрации',
                your_post: 'Комментарий к вашему сообщению',
                your_thread: 'Ваша тема',
                your_profile: 'Ваш профиль',
                uniq_approved: 'Уник одобрен',
                deleted_account_is_now_active: 'Аккаунт восстановлен',
                contacts_changed: 'Контакты изменены',
                contacts_deleted: 'Контакты удалены',
                telegram_contacts_deleted: 'Телеграм контакты удалены',
                following: 'Подписка',
                trophy: 'Трофей',
                contest_won: 'Победа в розыгрыше'
            }
        },

        ticket: {
            label: 'Тикет',
            children: {
                open_ticket: 'Тикет открыт',
                new_ticket: 'Новый тикет',
                reopen_ticket: 'Тикет снова открыт',
                close_ticket: 'Тикет закрыт'
            }
        },

        profile_post: {
            label: 'Сообщения в профиле',
            children: {
                insert_edited: 'Новый пост в профиле',
                comment: 'Комментарий',
                post_comment_delete: 'Комментарий поста удалён',
                profile_post_comment_delete: 'Комментарий поста в профиле удалён',
                profile_post_edit: 'Редактирование',
                profile_post_delete: 'Удаление комментария'
            }
        },

        auction: {
            label: 'Аукцион',
            children: {
                bid_cancel: 'Ставка отменена',
                no_winner: 'Нет победителя',
                bid_win: 'Выигрыш на аукционе',
                bid_win_without_check: 'Выигрыш без проверки',
                bid_outbid: 'Перебитая ставка',
                bid_loss: 'Проигрыш ставки',
                auction_update: 'Обновление аукциона',
            }
        },

        post: {
            label: 'Посты',
            children: {
                like: 'Лайк',
                quote: 'Цитирование',
                post_delete: 'Удалён',
                other_commenter: 'Комментарий другого пользователя',
                post_edit: 'Пост изменён',
                post_move: 'Пост перемещён'
            }
        },

        market: {
            label: 'Маркет',
            children: {
                refund: 'Возврат',
                cancel_balance_transfer: 'Отмена перевода',
                success_upgrade: 'Успешный апгрейд',
                success_auto_payments: 'Успешные автоплатежи',
                deposit_replenish: 'Пополнение депозита',
                hold_finished: 'Холд завершён',
                offer_price: 'Предложение цены',
                refill_balance: 'Пополнение баланса',
                deposit_withdraw: 'Вывод средств',
                finished: 'Вывод средств успешно завершено',
                renewal_success: 'Продление успешно',
                discount_accepted: 'Скидка принята',
                invoice_webhook: 'Webhook счета',
                auto_buy_not_enough_balance: 'Недостаточно средств для автопокупки',
                item_was_closed: 'Предмет закрыт', 
                discount_rejected: 'Скидка отклонена',
                uniq_rejected: 'Уникальный отклонён',
                payout_cancelled: 'Выплата отменена',
                auto_buy_skipped_account: 'Пропущена автопокупка (аккаунт)',
                receiving_money: 'Получение средств',
                soon_autopayment: 'Скорый автоплатёж',
                renewal_fail: 'Неудачное продление',
                sold_item: 'Продан товар',
                auto_buy_without_check: 'Автопокупка без проверки',
                recent_purchase: 'Недавняя покупка',
                auto_buy_buy: 'Автопокупка',
                auto_buy_alert: 'Автопокупка (уведомление)',
                new_feedback: 'Новый отзыв',
                new_automatic_feedback: 'Авто-отзыв',
                error_auto_payments: 'Ошибка автоплатежей',
                not_paid_payment: 'Неоплаченный платёж',
                ask_discount: 'Запрос скидки',
                price_fell: 'Снижение цены',
                gift_upgrade: 'Подарок/апгрейд',
                hold_expiring: 'Истекающий холд',
                owner_changed: 'Смена владельца',
            }
        },

        others: {
            label: 'Другое',
            children: {
                as_claim: 'Как претензия',
                enhanced_deferred_error: 'Расширенная отложенная ошибка',
                deleted: 'Удалено',
                closed: 'Закрыто',
                edit: 'Изменено'
            }
        },
    };

    const ALERT_ACTION_INDEX = buildActionIndex(ALERT_SCHEMA);

    const defaultTtsSettings = {
        voiceURI: null,
        volume: 1,
        rate: 1,
        pitch: 1,
        lang: 'ru-RU',

        filters: buildDefaultFilters(ALERT_SCHEMA)
    };

    function buildDefaultFilters(schema) {
        const filters = {};

        for (const [group, cfg] of Object.entries(schema)) {
            filters[group] = {
                enabled: true,
                actions: {}
            };

            for (const action of Object.keys(cfg.children)) {
                filters[group].actions[action] = true;
            }
        }

        return filters;
    }


    function buildActionIndex(schema) {
        const index = Object.create(null);

        for (const [group, cfg] of Object.entries(schema)) {
            for (const action of Object.keys(cfg.children)) {
                index[action] = group;
            }
        }

        return index;
    }

    function loadTtsSettings() {
        try {
            return Object.assign(
                {},
                defaultTtsSettings,
                JSON.parse(localStorage.getItem(TTS_SETTINGS_KEY) || '{}')
            );
        } catch {
            return { ...defaultTtsSettings };
        }
    }

    function saveTtsSettings(settings) {
        localStorage.setItem(TTS_SETTINGS_KEY, JSON.stringify(settings));
    }

    /* =======================
       VOICES
    ======================= */

    function getVoicesAsync() {
        return new Promise(resolve => {
            const voices = speechSynthesis.getVoices();
            if (voices.length) {
                resolve(voices);
                return;
            }

            speechSynthesis.addEventListener(
                'voiceschanged',
                () => resolve(speechSynthesis.getVoices()),
                { once: true }
            );
        });
    }

    async function speakText(text) {
        const settings = loadTtsSettings();
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.volume = settings.volume;
        utterance.rate   = settings.rate;
        utterance.pitch  = settings.pitch;
        utterance.lang   = settings.lang;

        if (settings.voiceURI) {
            const voices = await getVoicesAsync();
            const voice = voices.find(v => v.voiceURI === settings.voiceURI);
            if (voice) utterance.voice = voice;
        }

        speechSynthesis.speak(utterance);
    }

    function isTtsAllowed(e) {
        const html = e.rendered.templateHtml
        const settings = loadTtsSettings();

        //const type = e.content_type || e.contentType;
        const action = extractAlertActionFromHtml(html)

        const group = ALERT_ACTION_INDEX[action];
        if (!group) return false;

        if (!settings.filters[group].enabled) return false;

        if (!action) return true;

        if (ALERT_SCHEMA[group].children && action in ALERT_SCHEMA[group].children) {
            return settings.filters[group]?.actions?.[action] !== false;
        }

        return true;
    }

    function extractAlertActionFromHtml(html) {
        const el = $('<div>').html(html).find('.alertAction').first();
        if (!el.length) return null;

        const classes = el.attr('class').split(/\s+/);

        return classes.find(cls =>
            cls in ALERT_ACTION_INDEX
        ) || null;
    }



    /* =======================
       NOTIFICATION HOOK
    ======================= */

    function hookNotifications() {
        const notification = $('html').data('Im.Notification');
        if (!notification) return;

        const liveAlerts = notification.liveAlerts;

        if (liveAlerts._displayAlertOriginal) return;

        liveAlerts._displayAlertOriginal = liveAlerts.displayAlert;

        liveAlerts.displayAlert = function (e) {
            const text = $('<div>')
                .html(e.rendered.templateHtml)
                .find('.listItemText')
                .first()
                .text()
                .trim();

            if (text && !liveAlerts.handledAlerts.has(e.id) && isTtsAllowed(e)) {
                speakText(text);
            }

            return liveAlerts._displayAlertOriginal.call(this, e);
        };
        console.log("displayAlert hooked!")
    }

    /* =======================
       UI OVERLAY
    ======================= */

    function initUI() {
        const $button = $(`
        <a class="manageItem TTSSettings-button">
                <div class="SvgIcon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M443.6 64.3C434.7 65.5 426.4 70.5 421.2 78.4C414.4 88.8 414.2 102.5 420.8 113C426.4 121.9 436.3 125.7 444.6 131.5C452.1 136.7 462.2 144.7 472.3 155.7C492.3 177.4 511.8 210 511.8 256C511.8 273.7 526.1 288 543.8 288C561.5 288 575.8 273.7 575.8 256C575.8 190 547.3 142.6 519.3 112.3C505.4 97.2 491.5 86.2 481 79C470 71.4 457.5 62.4 443.4 64.3zM304 192C246.4 192 198.9 235.6 192.7 291.5C190.8 309.1 174.9 321.7 157.4 319.8C139.9 317.9 127.2 302 129.1 284.5C138.8 196.5 213.4 128 304 128C401.2 128 480 206.8 480 304C480 350 462.3 391.9 433.4 423.3C421.4 436.3 416 448.1 416 458L416 464.1C416 526 365.9 576.1 304 576.1C286.3 576.1 272 561.8 272 544.1C272 526.4 286.3 512.1 304 512.1C330.5 512.1 352 490.6 352 464.1L352 458C352 425.1 369.4 398.4 386.4 380C404.8 360 416 333.4 416 304.1C416 242.2 365.9 192.1 304 192.1zM64 544C64 526.3 78.3 512 96 512C113.7 512 128 526.3 128 544C128 561.7 113.7 576 96 576C78.3 576 64 561.7 64 544zM224 448C241.7 448 256 433.7 256 416C256 398.3 241.7 384 224 384C206.3 384 192 398.3 192 416C192 433.7 206.3 448 224 448zM150.6 425.4C138.1 412.9 117.8 412.9 105.3 425.4C92.8 437.9 92.8 458.2 105.3 470.7L169.3 534.7C181.8 547.2 202.1 547.2 214.6 534.7C227.1 522.2 227.1 501.9 214.6 489.4L150.6 425.4zM304 272C286.3 272 272 286.3 272 304C272 317.3 261.3 328 248 328C234.7 328 224 317.3 224 304C224 259.8 259.8 224 304 224C348.2 224 384 259.8 384 304C384 317.3 373.3 328 360 328C346.7 328 336 317.3 336 304C336 286.3 321.7 272 304 272z"/></svg>
                </div>
                <span>Озвучка уведомлений</span>
        </a>
        `);

        $('.menuBlock .manageItems').append($button);

        $button.on('click', async function (ev) {
            ev.preventDefault();

            if (!$button.data('overlay')) {
                const $modal = $(`
                    <div class="sectionMain">
                        <h2 class="heading h1">Настройки озвучки уведомлений</h2>
                        <div class="overlayContent" style="padding:15px">Загрузка…</div>
                    </div>
                `);

                XenForo.createOverlay(null, $modal, {
                    className: 'TTSSettings-modal',
                    trigger: $button,
                    severalModals: true
                });

                const overlay = $button.data('overlay');

                overlay.refresh = async function () {
                    const $root = this.getOverlay().find('.overlayContent');
                    const settings = loadTtsSettings();
                    const voices = await getVoicesAsync();

                    const options = voices.map(v => `
                        <option value="${v.voiceURI}" ${v.voiceURI === settings.voiceURI ? 'selected' : ''}>
                            ${v.name} (${v.lang})
                        </option>
                    `).join('');

                    $root.html(`
                        <div>
                            <span>Голос</span>
                            <div>
                                <select id="tts-voice" class="tts-voice ctrlOrder textCtrl extraLarge">
                                    <option value="">По умолчанию</option>
                                    ${options}
                                </select>
                            </div>
                        </div>

                        <div>
                            <span>Громкость</span>
                            <div>
                                <input type="range" class="tts-volume" min="0" max="1" step="0.05" value="${settings.volume}">
                                <span>${settings.volume}</span>
                            </div>
                        </div>

                        <div>
                            <span>Скорость</span>
                            <div>
                                <input type="range" class="tts-rate" min="0.5" max="2" step="0.05" value="${settings.rate}">
                                <span>${settings.rate}</span>
                            </div>
                        </div>

                        <div>
                            <span>Высота</span>
                            <div>
                                <input type="range" class="tts-pitch" min="0" max="2" step="0.1" value="${settings.pitch}">
                                <span>${settings.pitch}</span>
                            </div>
                        </div>

                        <div style="margin-top:15px">
                            <a class="button primary tts-test">Тест</a>
                        </div>

                        <div style="padding: 7px 0;">
                            <span>Типы уведомлений</span>
                            <dd class="tts-types"></div>
                        </div>
                    `);

                    // Рендерим чекбоксы уведомлений
                    const html = Object.entries(ALERT_SCHEMA).map(([group, cfg]) => {
                        const groupEnabled = settings.filters[group]?.enabled !== false;

                        const children = Object.entries(cfg.children).map(([action, label]) => {
                            const checked = settings.filters[group]?.actions?.[action] !== false;
                            return `
                                <label>
                                    <input type="checkbox"
                                        data-group="${group}"
                                        data-action="${action}"
                                        ${checked ? 'checked' : ''}
                                        ${!groupEnabled ? 'disabled' : ''}>
                                    ${label}
                                </label>
                            `;
                        }).join('');

                        return `
                            <div class="tts-group">
                                <label>
                                    <input type="checkbox"
                                        class="tts-group-toggle"
                                        data-group="${group}"
                                        ${groupEnabled ? 'checked' : ''}>
                                    <strong>${cfg.label}</strong>
                                </label>
                                ${children}
                            </div>
                        `;
                    }).join('');

                    $root.find('.tts-types').html(html);

                    // Аудио-параметры
                    const updateAudio = () => {
                        const settings = loadTtsSettings();

                        settings.voiceURI = $root.find('.tts-voice').val() || null;
                        settings.volume   = +$root.find('.tts-volume').val();
                        settings.rate     = +$root.find('.tts-rate').val();
                        settings.pitch    = +$root.find('.tts-pitch').val();
                        settings.lang     = 'ru-RU';

                        saveTtsSettings(settings);

                        $root.find('.tts-volume + span').text(settings.volume);
                        $root.find('.tts-rate + span').text(settings.rate);
                        $root.find('.tts-pitch + span').text(settings.pitch);
                    };

                    $root.on('input change', 'select,input[type=range]', updateAudio);

                    // Обработка чекбоксов групп и подтипов
                    $root.on('change', 'input[type=checkbox]', function () {
                        const settings = loadTtsSettings();
                        const group = this.dataset.group;
                        const action = this.dataset.action;

                        if (!settings.filters[group]) {
                            settings.filters[group] = { enabled: true, actions: {} };
                        }

                        if (this.classList.contains('tts-group-toggle')) {
                            const enabled = this.checked;
                            settings.filters[group].enabled = enabled;

                            // включаем/выключаем подтипы визуально
                            $root.find(`input[data-group="${group}"][data-action]`).prop('disabled', !enabled);
                        } else {
                            settings.filters[group].actions[action] = this.checked;
                        }

                        saveTtsSettings(settings);
                    });

                    // Тест озвучки
                    $root.find('.tts-test').on('click', () => {
                        speakText('Проверка озвучки уведомлений');
                    });
                };
            }

            const overlay = $button.data('overlay');
            overlay.load();
            overlay.refresh();
        });
    }

    /* =======================
       INIT
    ======================= */

    $(window).on('load', () => {
        hookNotifications();
        initUI();
    });
})();
