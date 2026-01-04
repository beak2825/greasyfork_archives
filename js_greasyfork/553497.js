// ==UserScript==
// @name         Скрипт для КФ (биографии)
// @namespace    https://forum.blackrussia.online/
// @version      1.4.9
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
// @downloadURL https://update.greasyfork.org/scripts/553497/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%28%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553497/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%28%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%29.meta.js
// ==/UserScript==

// ==UserScript==
// @name Goggins_Goggins (RP-Биографии) ьесть
// @namespace https://forum.blackrussia.online/
// @version 12.1
// @description ФИНАЛЬНЫЙ СБОРНИК
// @author David_Goggins / Artem_Gogol (Финальное Объединение)
// @match https://forum.blackrussia.online/threads/*
// @grant none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js
// ==/UserScript==


(function() {
'use strict';
if (typeof Handlebars === 'undefined') {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.min.js';
    s.async = false;
    document.head.appendChild(s);
}

// --- ПРЕФИКСЫ ---
const NARASSSMOTRENII_PREFIX = 2;
const OTKAZANO_PREFIX = 4;
const ODOBRENO_PREFIX = 8;

// --- ID разделов ---
const MOVE_NODE_REJECTED = 792;
const MOVE_NODE_ARCHIVE = 768;
const MOVE_NODE_APPROVED = 790;

// --- БАННЕР И ПОДПИСЬ ---
const APPROVED_BANNER_URL = 'https://i.postimg.cc/sgkL5vvb/1618083711121.png';
const NEW_BANNER_BBCODE = '[B][CENTER][url=https://postimages.org/][img]' + APPROVED_BANNER_URL + '[/img][/url][/CENTER][/B]';
const FOOTER_LINKS = '';


// --- ГЕНЕРАТОРЫ ---
function generateRejectionContent(reasonText) {
return (
NEW_BANNER_BBCODE + "\n\n" +
"[B][CENTER][COLOR=#ff0000]Доброго времени суток, {{ user.name }}[/COLOR][/CENTER][/B]\n\n" +
"[CENTER][SIZE=5][COLOR=#000000]Ваша RolePlay биография была проверена, но есть моменты для доработки![/COLOR][/SIZE][/CENTER]\n\n" +
"[CENTER][SIZE=5][COLOR=#000000]Статус: [COLOR=#FF0000]❌ Отказано[/COLOR][/COLOR][/SIZE][/CENTER]\n\n" +
"[CENTER][SIZE=4][COLOR=#000000]Причина: [COLOR=#FF0000]" + reasonText + "[/COLOR][/COLOR][/SIZE][/CENTER]\n\n" +
"[CENTER][SIZE=4][COLOR=#000000]Просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/13425782/']правилами написания биографий[/URL].[/COLOR][/SIZE][/CENTER]\n\n" +
NEW_BANNER_BBCODE);
}

const approvalContent =
NEW_BANNER_BBCODE + "\n\n" +
"[B][CENTER][COLOR=#ff0000]Доброго времени суток, {{ user.name }}[/COLOR][/CENTER][/B]\n\n" +
"[CENTER][SIZE=5][COLOR=#000000]Ваша биография была проверена и получает статус: [COLOR=#00FF00]✔️ Одобрено[/COLOR][/COLOR][/SIZE][/CENTER]\n\n" +
"[CENTER][SIZE=4][COLOR=#000000]Приятной игры![/COLOR][/SIZE][/CENTER]\n\n" +
NEW_BANNER_BBCODE + "\n\n" + FOOTER_LINKS;

const reworkContent =
NEW_BANNER_BBCODE + "\n\n" +
"[B][CENTER][COLOR=#ff0000]Доброго времени суток, {{ user.name }}[/COLOR][/CENTER][/B]\n\n" +
"[CENTER][SIZE=5][COLOR=#000000]Биография проверена, но есть моменты для доработки.[/COLOR][/SIZE][/CENTER]\n\n" +
"[CENTER][SIZE=4][COLOR=#000000]Статус: [COLOR=#FFC000]🟡 На доработке (24ч)[/COLOR][/COLOR][/SIZE][/CENTER]\n\n" +
"[CENTER][SIZE=4][COLOR=#000000]Вам даётся 24 часа на исправление биографии.[/COLOR][/SIZE][/CENTER]\n\n" +
NEW_BANNER_BBCODE;

// --- КНОПКИ ---
const buttons = [
{ title: '____________________________________RP-БИОГРАФИИ____________________________________' },
{ title: '✔️ Одобрено', content: approvalContent, prefix: ODOBRENO_PREFIX, status: true, grid_col: 2 },
{ title: '🟡 На доработке', content: reworkContent, prefix: NARASSSMOTRENII_PREFIX, status: true, grid_col: 2 },
{ title: '❌ Не доработал', content: generateRejectionContent("Вы не доработали RP биографию за 24 часа."), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
{ title: '❌ Не по форме', content: generateRejectionContent("Биография составлена не по форме."), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },

{ title: '❌ Недостаточный объём', content: generateRejectionContent("Объём биографии менее 200 слов."), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
{ title: '❌ Избыточный объём', content: generateRejectionContent("Объём биографии превышает 600 слов."), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
{ title: '❌ Нет фото или видео', content: generateRejectionContent("В биографии отсутствует хотя бы одно релевантное фото/видео."), prefix: OTKAZANO_PREFIX, status: true, grid_col: 5 },
{ title: '❌ Общий отказ (свой вариант)', content: generateRejectionContent("..."), prefix: OTKAZANO_PREFIX, status: false, grid_col: 5 },
{ title: '❌ Заголовок не по форме', content: generateRejectionContent("Заголовок темы составлен не по форме.<br>Формат должен быть: Биография | Имя_Фамилия"), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Копипаст', content: generateRejectionContent("Биография содержит скопированный текст.<br>Создайте оригинальную историю."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Орфографические ошибки', content: generateRejectionContent("Слишком много орфографических ошибок.<br>Исправьте текст и проверьте правописание."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Пунктуация', content: generateRejectionContent("Неверная расстановка знаков препинания.<br>Проверьте грамматику."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Нереалистичный возраст', content: generateRejectionContent("Возраст персонажа указан нереалистично.<br>Используйте правдоподобные значения."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Нет структуры', content: generateRejectionContent("Отсутствует структурное деление на Детство / Настоящее время / Итог."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Несостыковки', content: generateRejectionContent("В биографии обнаружены логические или фактологические несостыковки."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Сверхспособности', content: generateRejectionContent("Запрещено придавать персонажу нереалистичные свойства или сверхспособности."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Нереалистичное описание', content: generateRejectionContent("Описание событий персонажа выходит за рамки реализма проекта."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Нет логики сюжета', content: generateRejectionContent("События не связаны между собой логически."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Нет хронологии', content: generateRejectionContent("События биографии расположены без временной последовательности."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Нарушение правил проекта', content: generateRejectionContent("В тексте присутствуют упоминания запрещённого контента (экстремизм, наркотики, политика)."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Нарушен формат шрифта', content: generateRejectionContent("Использован неправильный шрифт или размер текста.<br>Допустимо только Verdana или Times New Roman, 15pt+."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Нет фото персонажа', content: generateRejectionContent("Не прикреплено фото персонажа, требуемое правилами."), prefix: OTKAZANO_PREFIX, status: true },
{ title: '❌ Несовпадение ника', content: generateRejectionContent("Никнейм в заголовке темы отличается от никнейма, указанного в пункте Nick_Name. Исправьте, чтобы оба совпадали."), prefix: OTKAZANO_PREFIX, status: true },
];
// --- СЛУЖЕБНЫЕ ФУНКЦИИ ---

function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    return formData;
}

// --- СМЕНА ПРЕФИКСА ---
function editThreadData(prefix, pin = false, shouldClose = true) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent.trim();
    if (typeof XF === 'undefined' || !XF.config || !XF.config.csrf) return;

    const data = {
        prefix_id: prefix,
        title: threadTitle,
        discussion_open: shouldClose ? 0 : 1,
        _xfToken: XF.config.csrf,
        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
        _xfWithData: 1,
        _xfResponseType: 'json',
    };
    if (pin) data.sticky = 1;

    fetch(`${document.URL}edit`, {
        method: 'POST',
        body: getFormData(data),
    }).then(() => location.reload())
    .catch(err => console.error('Ошибка при смене префикса:', err));
}

// --- ПОЛУЧЕНИЕ ДАННЫХ ТЕМЫ ---
function getThreadData() {
    const usernameElement = $('a.username')[0];
    if (!usernameElement)
        return { user: { id: 'Unknown', name: 'Уважаемый пользователь', mention: 'Уважаемый пользователь' } };

    const authorID = usernameElement.attributes['data-user-id']?.nodeValue || 'UnknownID';
    const authorName = $(usernameElement).text().trim() || 'Уважаемый пользователь';
    return {
        user: {
            id: authorID,
            name: authorName,
            mention: `[USER=${authorID}]${authorName}[/USER]`,
        },
    };
}

// --- ДОБАВЛЕНИЕ КНОПКИ ВНИЗУ ---
function addButton(name, id) {
    $('.button--icon--reply').before(
        `<button type="button" class="button rippleButton" id="${id}" style="background:transparent!important;margin:10px;border:none;border-radius:10px;color:white!important;">${name}</button>`
    );
}

// --- ВЕРСТКА СПИСКА КНОПОК ---
function buttonsMarkup(buttons) {
    return `<div class="select_answer">
        ${buttons.map((btn, i) => {
            if (!btn.content || btn.title.includes('______') || btn.title.includes(' - - '))
                return `<div class="separator-title">${btn.title.replace(/_/g,'').replace(/-/g,'').trim()}</div>`;
            const extraClass = (i === 1 || i === 2) ? 'col-2' : '';
            return `<button id="answers-${i}" class="button--primary button rippleButton answer-button ${extraClass}" data-id="${i}">
                        <span class="button-text">${btn.title}</span>
                    </button>`;
        }).join('')}
    </div>`;
}



function pasteContent(id, data = {}, send = false) {
    if (buttons[id].content === undefined) return;

    const template = Handlebars.compile(buttons[id].content);
    const btn = buttons[id];

    if ($('.fr-element.fr-view p').text().trim() === '')
        $('.fr-element.fr-view p').empty();
    $('span.fr-placeholder').empty();

    const contentToPaste = template(data).replace(/\n/g, '<br>');
    $('div.fr-element.fr-view p').append(contentToPaste);



    if (id === 8) {

        editThreadData(4, false, true);


        setTimeout(() => {
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }, 150);


        setTimeout(() => location.reload(), 800);

        return;
    }



    if ($('.overlay-container').length) {
        $('.overlay-container').remove();
        $('body').removeClass('modal-opened').css({ overflow: 'auto' });
    }

    if (send === true) {
        const pinStatus = btn.prefix === NARASSSMOTRENII_PREFIX;
        const shouldClose = btn.close !== false;

        editThreadData(btn.prefix, pinStatus, shouldClose);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }



    if ($('.overlay-container').length) {
    $('.overlay-container').remove();
    $('body').removeClass('modal-opened').css({ overflow: 'auto' });
} else if ($('a.overlay-titleCloser').length) {
    $('a.overlay-titleCloser').trigger('click');
}

    if (send === true) {
        const pinStatus = btn.prefix === NARASSSMOTRENII_PREFIX;
        const shouldClose = btn.close !== false;
        editThreadData(btn.prefix, pinStatus, shouldClose);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}

// --- СТИЛИ И FIX МОДАЛКИ ---
function applyModalFixes(customTitle) {
    $('.overlay-container').css({
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)', zIndex: '999999', overflow: 'hidden'
    });
    $('.overlay').css({
        background: 'rgba(42,44,46,0.45)', borderRadius: '8px',
        boxShadow: '0 0 30px rgba(0,0,0,0.75)',
        maxWidth: '880px', width: 'calc(100% - 60px)', maxHeight: '85vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column'
    });
    $('.overlay-title').css({
        background: 'rgba(26,29,31,0.85)', color: '#fff',
        textAlign: 'center', fontWeight: '700', padding: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
    });
    $('.overlay-content').css({
        flex: '1', overflowY: 'auto',
        background: 'rgba(42,44,46,0.30)',
        padding: '12px', color: '#fff',
        scrollbarWidth: 'none', '-ms-overflow-style': 'none'
    });

    if (!$('#modal-style-fix').length) {
        $('head').append(`
            <style id="modal-style-fix">
                .select_answer{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-start;padding:8px;}
                .select_answer .answer-button{flex:1 1 calc(20% - 8px);min-width:120px;height:auto;
                    background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
                    color:#fff;border-radius:6px;padding:10px 12px;white-space:normal;
                    transition:transform .08s ease,background .12s ease;}
                .select_answer .answer-button:hover{background:rgba(255,255,255,0.08);transform:translateY(-1px);}
                .separator-title{flex-basis:100%;text-align:center;color:#f5c542;font-weight:700;margin:10px 0;}
                .overlay-content::-webkit-scrollbar{width:0px;height:0px;}
                .overlay-content{-ms-overflow-style:none;scrollbar-width:none;}
            </style>
        `);
    }

    $('body').addClass('modal-opened').css({overflow:'hidden'});

 $(document)
    .off('click.bioModalBgFix', '.overlay-container')
    .on('click.bioModalBgFix', '.overlay-container', function(e) {
        if ($(e.target).is('.overlay-container')) {
            $('body').removeClass('modal-opened').css({ overflow: 'auto' });
            $('.overlay-container').remove();
        }
    });

// 2. Клик по крестику
$(document)
    .off('click.bioModalCloseFix', '.overlay-titleCloser')
    .on('click.bioModalCloseFix', '.overlay-titleCloser', function() {
        $('body').removeClass('modal-opened').css({ overflow: 'auto' });
        $('.overlay-container').remove();
    });

// 3. Автоматическое наблюдение — если модалку удалили → тоже вернуть scroll
const bioStuckFix = setInterval(() => {
    if (!$('.overlay-container').length) {
        $('body').removeClass('modal-opened').css({ overflow: 'auto' });
        clearInterval(bioStuckFix);
    }
}, 50);


 }



// --- ЗАПУСК СКРИПТА ---
$(document).ready(() => {
    if (typeof XF === 'undefined' || typeof jQuery === 'undefined' || typeof XF.alert === 'undefined') return;

    const threadData = getThreadData();
    const mainButtonId = 'rp_bio_templates_btn';

    // Основная кнопка вызова шаблонов
    addButton('Шаблоны RP-Биографий', mainButtonId);

    // Дополнительные кнопки перемещения
    const moveRejectedId = 'move_rejected_btn';
    const moveApprovedId = 'move_approved_btn';
    const moveArchiveId = 'move_archive_btn';

    // В одобренные
    $('.button--icon--reply').before(`
        <button type="button" id="${moveApprovedId}" class="button rippleButton"
        style="background:#28a745;border:1px solid #1e7e34;border-radius:10px;color:white;font-weight:bold;padding:6px 14px;margin:4px;">
        В одобренные</button>`);

    // В неодобренные
    $('.button--icon--reply').before(`
        <button type="button" id="${moveRejectedId}" class="button rippleButton"
        style="background:#FF0000;border:1px solid #CC0000;border-radius:10px;color:white;font-weight:bold;padding:6px 14px;margin:4px;">
        В неодобренные</button>`);

    // В архив
    $('.button--icon--reply').before(`
        <button type="button" id="${moveArchiveId}" class="button rippleButton"
        style="background:#007bff;border:1px solid #0069d9;border-radius:10px;color:white;font-weight:bold;padding:6px 14px;margin:4px;">
        В архив</button>`);

    // Обработчики перемещений
    function moveThread(targetNodeId, prefixId) {
        if (typeof XF === 'undefined' || !XF.config || !XF.config.csrf) return;

        const threadUrl = document.URL.split('?')[0].replace(/\/$/, '');
        const moveUrl = `${threadUrl}/move`;
        const threadTitle = $('.p-title-value')[0].lastChild.textContent.trim();

        const data = {
            prefix_id: prefixId,
            title: threadTitle,
            target_node_id: targetNodeId,
            redirect_type: 'none',
            notify_watchers: 1,
            starter_alert: 1,
            starter_alert_reason: '',
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
            _xfRequest: 1
        };

        fetch(moveUrl, {
            method: 'POST',
            body: getFormData(data),
        }).then(() => location.reload())
        .catch(error => console.error('Ошибка перемещения:', error));
    }

    // Обработчики для кнопок
    $(document).on('click', `#${moveApprovedId}`, () => moveThread(MOVE_NODE_APPROVED, ODOBRENO_PREFIX));
    $(document).on('click', `#${moveRejectedId}`, () => moveThread(MOVE_NODE_REJECTED, OTKAZANO_PREFIX));
    $(document).on('click', `#${moveArchiveId}`, () => moveThread(MOVE_NODE_ARCHIVE, OTKAZANO_PREFIX));

$(document).on('click touchstart', '#' + mainButtonId, function(e) {
    e.preventDefault();
    e.stopPropagation();

    const t0 = $(this).data('touchedAt') || 0;
    if (e.type === 'touchstart') {
        $(this).data('touchedAt', Date.now());
    } else {
        if (Date.now() - t0 < 500) return; // игнорируем двойное срабатывание
    }

    const customTitle = 'Выберите шаблон RP-Биографии';
    XF.alert(buttonsMarkup(buttons), null, customTitle);
    setTimeout(() => applyModalFixes(customTitle), 20);

    buttons.forEach(function(btn, id) {
        if (!btn.content) return;
        const selector = '#answers-' + id;

        $(document).off('click touchstart', selector);
        $(document).on('click touchstart', selector, function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            if (ev.type === 'touchstart') {
                $(this).data('touchedAt', Date.now());
            } else {
                const t = $(this).data('touchedAt') || 0;
                if (Date.now() - t < 500) return;
            }

            const send = !!btn.status;
            pasteContent(id, threadData, send);
        });
    });
});


});
})();