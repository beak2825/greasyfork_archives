// ==UserScript==
// @name                KF FROG
// @namespace           https://forum.blackrussia.online
// @version             1.0.0
// @author              Kseniya_Frog
// @connection          https://vk.com/kwaazzi
// @updateversion       Создан 05.12.2025
// @match               https://forum.blackrussia.online/threads/*
// @include             https://forum.blackrussia.online/threads/
// @license             MIT
// @icon                https://i.postimg.cc/mksByCfr/1f438.png
// @description         Скрипт с новогодним стилем, подходящий для всех серверов, предназначен для быстрой реакции кураторов форума в различных разделах.
// @downloadURL https://update.greasyfork.org/scripts/556681/KF%20FROG.user.js
// @updateURL https://update.greasyfork.org/scripts/556681/KF%20FROG.meta.js
// ==/UserScript==

(function () {
'esversion 6' ;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const TECH_PREFIX = 13; // Префикс "Тех. специалисту"
    const WAIT_PREFIX = 14; // Префикс "Ожидание"
    const PINBIO_PREFIX = 15; // Префикс "На рассмотрении" для биографий (закреплено + открыто)
    const buttons = [
    {
    title: '------> Раздел Жалоб на игроков <------',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'Приветствие + свой текст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          ''
},
];

$(document).ready(() => {
	$('body').append('<script src=https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js></script>');

	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

 $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});

    function addButton(name, id, style) {
     $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}

function buttonsMarkup(buttons) {
	return `
		<div class="select_answer" style="
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			width: 100%;
		">
			${buttons.map((btn, i) => {
				const isHeader = btn.title.includes('---->') || btn.title.includes('———>') || btn.title.includes('------>');

				if (isHeader) {
					// Для золотых заголовков - растягиваем на всю ширину с золотыми пунктирными линиями
					return `
					<div style="width: 100%; display: flex; align-items: center; gap: 15px; margin: 8px 0;">
						<div style="flex: 1; border-bottom: 2px dashed #FFD700; opacity: 0.7;"></div>
						<button id="answers-${i}" class="button--primary button rippleButton"
							style="flex-shrink: 0; margin: 0; ${btn.dpstyle}">
							<span class="button-text">${btn.title}</span>
						</button>
						<div style="flex: 1; border-bottom: 2px dashed #FFD700; opacity: 0.7;"></div>
					</div>`;
				} else {
					// Для обычных золотых кнопок - компактный размер
					return `<button id="answers-${i}" class="button--primary button rippleButton"
						style="width: auto; margin: 0; ${btn.dpstyle}">
						<span class="button-text">${btn.title}</span>
					</button>`;
				}
			}).join('')}
		</div>
	`;
}
function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if (send == true) {
		editThreadData(buttons[id].prefix, buttons[id].status);
		$('.button--icon.button--icon--reply.rippleButton').trigger('click');
	}
}

	function getThreadData() {
	const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
	const authorName = $('a.username').html();
	const hours = new Date().getHours();
	return {
	user: {
	id: authorID,
	name: authorName,
	mention: `[USER=${authorID}]${authorName}[/USER]`,
	},
  greeting: () =>
	6 < hours && hours <= 12
	  ? 'Доброе утро'
	  : 12 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 6
	  ? 'Добрый вечер'
	  : 'Добрый вечер',
};
}

function editThreadData(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;

    // Для PINBIO_PREFIX - тема закреплена, открыта и с префиксом "На рассмотрении"
    if (prefix === PINBIO_PREFIX) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: PIN_PREFIX, // Используем PIN_PREFIX для префикса "На рассмотрении"
                title: threadTitle,
                sticky: 1,           // Закрепление
                discussion_open: 1,  // Тема ОТКРЫТА
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для PIN_PREFIX - тема закреплена, закрыта и с префиксом "На рассмотрении"
    else if (prefix === PIN_PREFIX) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                sticky: 1,           // Закрепление
                // discussion_open не передаем - тема ЗАКРЫТА
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для остальных случаев с pin = true
    else if (pin == true) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                sticky: 1,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для случаев с pin = false
    else {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
}
    // Функция для открытой темы (без закрытия)
function editThreadDataOpen(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;

    fetch(`${document.URL}edit`, {
        method: 'POST',
        body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            discussion_open: 1, // 1 = тема открыта
            sticky: pin ? 1 : 0,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
        }),
    }).then(() => location.reload());
}

 function getFormData(data) {
            const formData = new FormData();
            Object.entries(data).forEach(i => formData.append(i[0], i[1]));
            return formData;
            }

// Добавляем кнопку "Префиксы" и выпадающий блок
// Сделать немного более заметными
addButton('Префиксы', 'prefixesToggle', 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; padding: 8px 16px; background: linear-gradient(to bottom, #B22222, #8B0000); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);');

// Создаем блок с кнопками статусов
$('button#prefixesToggle').after(`<div id="prefixesBox" style="
        position: absolute;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        z-index: 1000;
        margin-top: 5px;
        min-width: 220px;
        display: none;
    ">
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" class="button--primary button rippleButton status-btn"
                data-status="на рассмотрении"
                style="padding: font-weight: bold; border: none; background: linear-gradient(to bottom, #ff7700, #e56a00); color: black;">
                На рассмотрении
            </button>
            <button type="button" class="button--primary button rippleButton status-btn"
                data-status="одобрено"
                 style="padding: font-weight: bold; border: none; background: linear-gradient(to bottom, green); color: white;">
                Одобрено
            </button>
            <button type="button" class="button--primary button rippleButton status-btn"
                data-status="отказано"
                 style="padding: font-weight: bold; border: none; background: linear-gradient(to bottom, red); color: white;">
                Отказано
            </button>
            <button type="button" class="button--primary button rippleButton status-btn"
                data-status="закрыто"
                 style="padding: font-weight: bold; border: none; background: linear-gradient(to bottom, red); color: white;">
                Закрыто
            </button>
            <button type="button" class="button--primary button rippleButton status-btn"
                data-status="главному администратору"
                 style="padding: font-weight: bold; border: none; background: linear-gradient(to bottom, red); color: white;">
                Главному Администратору
            </button>
            <button type="button" class="button--primary button rippleButton status-btn"
                data-status="специальному администратору"
                 style="padding: font-weight: bold; border: none; background: linear-gradient(to bottom, red); color: white;">
                Специальному Администратору
            </button>
            <button type="button" class="button--primary button rippleButton status-btn"
                data-status="тех специалисту"
                 style="padding: font-weight: bold; border: none; background: linear-gradient(to bottom, blue); color: white;">
               Тех. специалисту
            </button>
            <button type="button" class="button--primary button rippleButton status-btn"
                data-status="команде проекта"
                 style="padding: font-weight: bold; border: none; background: linear-gradient(to bottom, yellow); color: black;">
             Команде проекта
            </button>
            <button type="button" class="button--primary button rippleButton status-btn"
                data-status="ожидание"
                 style="padding: font-weight: bold; border: none; background: linear-gradient(to bottom, silver); color: black;">
             Ожидание
            </button>
        </div>
    </div>
`);

// Обработчики для префиксов
$('button#prefixesToggle').click(function(e) {
    e.stopPropagation();
    $('#prefixesBox').toggle();
});

// Обработка кликов по кнопкам статусов
$('.status-btn').click(function() {
    const status = $(this).data('status');
    const PREFIXES = {
        'на рассмотрении': PIN_PREFIX,
        'одобрено': ACCEPT_PREFIX,
        'отказано': UNACCEPT_PREFIX,
        'ожидание': WAIT_PREFIX,
        'главному администратору': GA_PREFIX,
        'тех специалисту': TECH_PREFIX,
        'закрыто': CLOSE_PREFIX
    };

    const prefixId = PREFIXES[status];

    // Определяем какие кнопки закрепляют тему (pin = true)
    const PIN_BUTTONS = [
        'на рассмотрении',
        'главному администратору',
        'тех специалисту',
        'ожидание'
    ];

    // Особый случай для кнопки "Ожидание" - открывает тему
    if (status === 'ожидание') {
        editThreadDataOpen(prefixId, true); // pin = true, тема ОТКРЫТА
    }
    // Остальные кнопки
    else if (PIN_BUTTONS.includes(status)) {
        editThreadData(prefixId, true); // pin = true, тема ЗАКРЫТА
    } else {
        editThreadData(prefixId, false); // pin = false, тема ЗАКРЫТА
    }

    $('#prefixesBox').hide();
});

// Закрытие блока при клике вне области
$(document).click(function(e) {
    if (!$(e.target).closest('#prefixesToggle, #prefixesBox').length) {
        $('#prefixesBox').hide();
    }
});

// Предотвращаем закрытие при клике внутри блока
$('#prefixesBox').click(function(e) {
    e.stopPropagation();
});
          })();