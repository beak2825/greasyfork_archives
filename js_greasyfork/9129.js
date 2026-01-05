// ==UserScript==
// @name        Фотогалерея F1news.ru
// @namespace   CoolCmd
// @author      CoolCmd
// @version     2015.4.11
// @description Доработка фотогалереи сайта F1news.ru
// @license     MIT License; http://opensource.org/licenses/mit-license
// @match       http://www.f1news.ru/gallery/*
// @noframes
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9129/%D0%A4%D0%BE%D1%82%D0%BE%D0%B3%D0%B0%D0%BB%D0%B5%D1%80%D0%B5%D1%8F%20F1newsru.user.js
// @updateURL https://update.greasyfork.org/scripts/9129/%D0%A4%D0%BE%D1%82%D0%BE%D0%B3%D0%B0%D0%BB%D0%B5%D1%80%D0%B5%D1%8F%20F1newsru.meta.js
// ==/UserScript==

"use strict";

const МАКСИМУМ_ПРЕДЗАГРУЖЕННЫХ_СТРАНИЦ_ВПЕРЕД     = 3;
const МАКСИМУМ_ПРЕДЗАГРУЖЕННЫХ_СТРАНИЦ_НАЗАД      = 3;
const МАКСИМУМ_ПРЕДЗАГРУЖЕННЫХ_ИЗОБРАЖЕНИЙ_ВПЕРЕД = 2; // Должно быть меньше МАКСИМУМ_ПРЕДЗАГРУЖЕННЫХ_СТРАНИЦ_ВПЕРЕД.
const МАКСИМУМ_ПРЕДЗАГРУЖЕННЫХ_ИЗОБРАЖЕНИЙ_НАЗАД  = 2; // Должно быть меньше МАКСИМУМ_ПРЕДЗАГРУЖЕННЫХ_СТРАНИЦ_НАЗАД.

const СОСТОЯНИЕ_ЗАГРУЖАЕТСЯ         = 0;
const СОСТОЯНИЕ_ОШИБКА              = 1; // Ошибка загрузки. Отключает предзагрузку в этом направлении.
const СОСТОЯНИЕ_ЗАГРУЖЕНО           = 2; // Страница успешно получина и разобрана.
const СОСТОЯНИЕ_ЗАГРУЖЕНО_ПОЛНОСТЬЮ = 3; // СОСТОЯНИЕ_ЗАГРУЖЕНО + изображение помещено в кэш оборзевателя.
const СОСТОЯНИЕ_ПРОСМОТРЕНО         = 4; // СОСТОЯНИЕ_ЗАГРУЖЕНО_ПОЛНОСТЬЮ + изображение просмотрено.

const ЗАПРЕТИТЬ_ВЫПОЛНЕНИЕ_JAVASCRIPT = true;

const КУРСОР_НАЗАД  = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAARCAYAAAAlpHdJAAABoUlEQVR42r2VT0sCQRjGZ1ZNCKKLurtaRFInKSGIsg7JHoPoY3Tpc0TfpyIIhC5ZgiII3fsDGaERVJK76vbM7oysk3ZYdn3hYWaHHX/PvvO4S8mEisyktzCc2LatDKzmPuYxqA91oR4JoOh/4PvGtZFbL5K++bKI61nIhFrQVyhwAW7US0Y6rZGEmmPwDazFoR/oCXoPHC7A9eqVoesqURSFpPQ1Bi/wWyzoAWoHChfgauXS0LSUA2bSMnkvnJ35I/QWGFyAK+ULgJMOlFLqjPpCvibtwblTX4FDcA/ZQNzAdqkA396cGZqadKACLEavxq2Jde8+uaLxDOtgnnfvG2oxeImB1VTCbQX/kaANcLg4Pie4I08epgEJ7gR3eOZ4mZzelc+LsoGl7GaNBFQD6/WYT1nbn4fWlJi+wzoAA3teA8sr217HomUWD44vD1AHao8czDgD2dWC/FdrQp987qdsvtf8E0vZgAQP5yUzyUBh92C6cK8BdCmKoBxhPkd4UKCPUOG8IsT9lM4T96vW40/dmQbcaYLHBEuqSfwnfaR+ARw6pWPUh9UQAAAAAElFTkSuQmCC") 0 7';
const КУРСОР_ВПЕРЕД = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAARCAYAAAAlpHdJAAABjUlEQVR42rWTzUrDQBSFb6pW0KU7H0EoFAJFBRFBENFH8Rlcu3SnLnwK14KIUqEWrBIRlIpgm0l/1dpi23TGe5sJhiTGEqcDJzOZJPOdO3OigaI2kZw/pV4Ivsv7rIDDBKqHsqUCTVMIF8btGSykVs9BfO1zu2ngdBv1huqGGVAKr1kGlMsMUum1nOCdIzH4yOOjBqoeZkApvGLeAeccTNOCtL6eRwMHUQaUwlmpMISTGKuAntmINKD9BEVQQBL/MWS+3qwQGNeSBqqQWdr81QDBhd0tBRZyF6DeHfsVNu//jllVWFze8hqouwZC4arAJGpWpTY0gL/gDt52UDUyEICPCywrNySGkQHvmU/hdZqyE/fMX4o5fQTwp6y84Q3XLGoONRMndFjE/fPT1V/gtjxvCl7PC6GKk3ErR3ir+JgdGYziSv9zgkvwNYIPo8AQZ3uj4NnLEwRvXwjePkbwQxRYNdwJLu/vcbtqgZOdloQ2/WClcE9zgzsJTrLfUX0/eFxwN7iarHZAGxL24jfYttM/5+zAKAAAAABJRU5ErkJggg==") 26 7';

/***

Изображения кэшируются оборзевателем. Страницы кэшируются в г_оАльбом потому что:
- Оборзеватель их не кеширует (страницы создаются динамически PHP).
- Кешированные данные занимают очень мало места: хранится малая часть страницы.

Возможные способы хранения кешированных страниц. Используется третий способ как самый простой.
1. Массив. Доступ к страницам по индексу. Очень неудобно, потому что после вставки страницы в начало массива съезжают все
   индексы, причем индексы, которые застряли в замыканиях, изправить нельзя.
2. Двунаправленный список. На вскидку, самый производительный вариант, но в нашем случае пара миллисекунд ничего не решает.
3. Сочетание первых двух вариантов. Объект г_оАльбом содержит все страницы. В качестве индекса страницы используется ее адрес.
   сАдресСледующейФотки и сАдресПредыдущейФотки указывают на соседние страницы. г_оТекущаяФотка указывает на показанную фотку.
   Ссылки на первую и последнюю фотку в списке не нужны (пока).

Свойства г_оАльбом:
идСостояние           - одна из констант СОСТОЯНИЕ_. Если идСостояние < СОСТОЯНИЕ_ЗАГРУЖЕНО, то остальные свойства не определены.
сАдресИзображения     - адрес полноразмерного изображения.
чШиринаИзображения    - ширина полноразмерного изображения.
чВысотаИзображения    - высота полноразмерного изображения.
сАдресСледующейФотки  - URL/название ключа страницы со следующей фоткой. Пустая строка если это последняя фотка.
сАдресПредыдущейФотки - URL/название ключа страницы с предыдущей фоткой. Пустая строка если это первая фотка.
сОписаниеФотки        - HTML. Может быть пустой строкой.
сАдресАльбома         - URL страницы альбома с этой фоткой.

***/
let г_оАльбом = {}, г_оТекущаяФотка;
let г_узИзображение;

if (ЗАПРЕТИТЬ_ВЫПОЛНЕНИЕ_JAVASCRIPT)
{
	document.addEventListener('beforescriptexecute', ОбработатьВыполнениеJavascript, false);
}

document.addEventListener('DOMContentLoaded',
	function ОбработатьЗагрузкуДомика()
	{
		document.removeEventListener('beforescriptexecute', ОбработатьВыполнениеJavascript, false);
		document.removeEventListener('DOMContentLoaded', ОбработатьЗагрузкуДомика, false);
		if (location.pathname.endsWith('.html'))
		{
			ОбработатьЗагрузкуФотки();
		}
		else
		{
			ОбработатьЗагрузкуАльбома();
		}
	},
	false);

function ОбработатьВыполнениеJavascript(оСобытие)
{
	оСобытие.preventDefault();
	оСобытие.stopPropagation();
}

function ОбработатьЗагрузкуАльбома()
// TODO Предзагрузка страниц альбома.
// TODO Просмотр фоток не выходя из альбома.
{
	ДобавитьСтиль(`
	#mainbar {
		width: 978px !important;
	}
	.navbar_body > li {
		margin-right: 0 !important;
	}
	.navbar_body > li:first-child {
		display: none !important;
	}
	.navbar_body > li:last-child {
		color: #333 !important;
		font-weight: bold !important;
	}
	.navbar_body a:after {
		content: "»";
		font-size: 130%;
		padding: 0 .3em 0 .4em;
		color: #aaa;
	}
	.gallery-wrapper {
		margin: 15px 0 0 -14px !important;
	}
	.gallery-item {
		margin: 0 0 12px 12px !important;
		width: 150px !important;
		height: auto !important;
		float: none !important;
		vertical-align: top !important;
	}
	.gallery-item_title {
		margin: 8px 0 !important;
	}
	.gallery-pagination {
		margin: 0 !important;
		padding-top: 15px !important;
	}
	.gallery-pagination_next, .gallery-pagination_prev {
		top: 13px !important;
	}
	.кБокСтраница {
		transition: none !important;
		position: absolute !important;
		top: 0 !important;
		bottom: 0 !important;
		width: calc((100% - 990px) / 2) !important;
	}
	.кБокСтраница:not([href]) {
		cursor: not-allowed;
	}
	.кПредыдущая {
		left: 0 !important;
		cursor: ${КУРСОР_НАЗАД}, pointer;
	}
	.кСледующая {
		right: 0 !important;
		cursor: ${КУРСОР_ВПЕРЕД}, pointer;
	}
	@media (max-width: 1109px) {
		#mainbar {
			width: 947px !important;
		}
		.gallery-wrapper {
			margin: 15px 0 0 -4px !important;
		}
		.gallery-item {
			margin: 0 0 12px 5px !important;
		}
		.кБокСтраница {
			width: calc((100% - 950px) / 2) !important;
		}
	}
	@media (max-height: 883px) {
		html, body {
			height: 100% !important;
		}
		.header_top {
			height: 40px !important;
		}
		.header_logo img {
			width: 50% !important;
		}
		.header_logo {
			top: 8px !important;
		}
		.header_search {
			top: 7px !important;
		}
		.navbar_head {
			border-top-width: 3px !important;
		}
		.container {
			margin: 0 auto !important;
			min-height: 100% !important;
		}
		.widget {
			margin-bottom: 15px !important;
		}
	}
	.post_head, /* Название альбома будет перенесено */
		.gallery-wrapper_border,
		.social, /* Быдлосети в шапке */
		.footer,
		.banner_topline, #sidebar, .row:last-child /* Реклама */
		{display: none !important}
	`);

	//
	// Перенести название альбома в строку навигации. Это более логично и экономит место.
	//
	let узНазваниеАльбома = document.createElement('li');
	узНазваниеАльбома.appendChild(document.createTextNode(document.querySelector('.post_title').textContent));
	document.querySelector('.navbar_body').appendChild(узНазваниеАльбома);

	let узНиз;
	let узПредыдущая = document.createElement('a');
	узПредыдущая.setAttribute('class', 'кБокСтраница кПредыдущая');
	if (узНиз = document.querySelector('.gallery-pagination_prev'))
	{
		узПредыдущая.setAttribute('href', узНиз.lastElementChild.getAttribute('href'));
	}
	document.body.appendChild(узПредыдущая);
	let узСледующая = document.createElement('a');
	узСледующая.setAttribute('class', 'кБокСтраница кСледующая');
	if (узНиз = document.querySelector('.gallery-pagination_next'))
	{
		узСледующая.setAttribute('href', узНиз.firstElementChild.getAttribute('href'));
	}
	document.body.appendChild(узСледующая);
	НастроитьОбработкуНажатийКнопокНаКлаве(
		function()
		{
			узСледующая.click();
		},
		function()
		{
			узПредыдущая.click();
		}
	);
}

function ОбработатьЗагрузкуФотки()
{
	г_оТекущаяФотка = г_оАльбом[document.URL] = {};
	ИзвлечьФоткуИзСтраницы(г_оТекущаяФотка, document);
	if (г_оТекущаяФотка.идСостояние !== СОСТОЯНИЕ_ЗАГРУЖЕНО)
	{
		return;
	}

	г_узИзображение = document.querySelector('.gallery-photo > img');
	for (let [сКласс, фОбработчик] of [['photo-next', ПоказатьСледующуюФотку], ['photo-prev', ПоказатьПредыдущуюФотку]])
	{
		let узСцылка = document.querySelector('.' + сКласс);
		if (узСцылка)
		{
			узСцылка.removeAttribute('href');
			узСцылка.removeAttribute('title');
		}
		else
		{
			узСцылка = document.createElement('a');
			узСцылка.classList.add('photo-arrow');
			узСцылка.classList.add(сКласс);
			г_узИзображение.parentNode.appendChild(узСцылка);
		}
		узСцылка.addEventListener('click', фОбработчик, false);
	}
	window.addEventListener('resize', ОбработатьИзменениеРазмераОкна, false);
	НастроитьОбработкуНажатийКнопокНаКлаве(ПоказатьСледующуюФотку, ПоказатьПредыдущуюФотку);

	// Тень: 22, 3, 2, 155, #000
	ДобавитьСтиль(`
	html {
		height: 100% !important;
		overflow-x: hidden !important;
	}
	body {
		height: 100% !important;
	}
	.navbar_body {
		border: none !important;
		text-align: center !important;
	}
	.navbar_body > li {
		margin-right: 0 !important;
	}
	.navbar_body a {
		color: #297EA2 !important;
	}
	.navbar_body b {
		font-weight: normal !important;
	}
	.arrow_right:after {
		content: "»";
		font-size: 130%;
		padding: 0 .3em 0 .4em;
		color: #888;
	}
	.container {
		margin: 0 !important;
		padding: 0 !important;
		width: auto !important;
		min-height: 100% !important;
		box-shadow: none !important;
		background: #e6e9ea !important;
	}
	.row, .widget {
		margin: 0 !important;
	}
	#mainbar {
		margin: 0 !important;
		width: 100% !important;
	}
	.gallery-photo {
		margin: 8px 0 24px !important;
		text-align: center !important;
	}
	.gallery-photo > img {
		max-width: none !important; /* Не сжимать непропорционально фотку во время уменьшения ширины окна */
		box-shadow: 0 1px 5px #aaa !important;
	}
	.photo-arrow {
		cursor: not-allowed;
		transition: none !important;
		background: none !important;
	}
	.photo-next, .photo-prev {
		width: 50% !important;
	}
	.photo-next.доступно {
		cursor: ${КУРСОР_ВПЕРЕД}, pointer;
	}
	.photo-prev.доступно {
		cursor: ${КУРСОР_НАЗАД}, pointer;
	}
	.загрузка {
		cursor: wait !important;
	}
	.gallery-photo_description {
		margin: 0 auto !important;
		max-width: 80em !important;
		text-align: center !important;
	}
	.post_title, /* Не используется, но место занимает */
		.social, /* Быдлосети в шапке и под фоткой */
		.header_top, /* Логотип сайта и поиск */
		.navbar_head, /* Верхнее меню */
		.gallery-photo_link,
		.footer,
		.banner_topline, #sidebar, .row:last-child /* Реклама */
		{display: none !important}
	`);

	ПоказатьТекущуюФотку(document.URL);
}

function ОбработатьИзменениеРазмераОкна()
// Событие resize приходит очень часто, а масштабирование фотки может занять много времени.
// Чтобы не гонять зря процессор и не добавлять тормозов, замедляем реакцию на resize.
{
	if ('идПерерыв' in ОбработатьИзменениеРазмераОкна)
	{
		window.clearTimeout(ОбработатьИзменениеРазмераОкна.идПерерыв);
	}
	ОбработатьИзменениеРазмераОкна.идПерерыв = window.setTimeout(function()
	{
		delete ОбработатьИзменениеРазмераОкна.идПерерыв;
		ПодогнатьТекущуюФоткуПодРазмерОкна();
	}, 300);
}

function ПоказатьСледующуюФотку()
{
	if (г_оТекущаяФотка.сАдресСледующейФотки)
	{
		ЗагрузитьФотку(г_оТекущаяФотка.сАдресСледующейФотки, true);
	}
}

function ПоказатьПредыдущуюФотку()
{
	if (г_оТекущаяФотка.сАдресПредыдущейФотки)
	{
		ЗагрузитьФотку(г_оТекущаяФотка.сАдресПредыдущейФотки, true);
	}
}

function ИзвлечьФоткуИзСтраницы(оФотка, оСтраница)
{
	let узИзвлечь;
	оФотка.идСостояние = СОСТОЯНИЕ_ОШИБКА;

	let узИзображение = оСтраница.querySelector('.gallery-photo > img');
	if (!узИзображение)
	{
		console.error('ИзвлечьФоткуИзСтраницы()');
		return;
	}

	if (узИзвлечь = оСтраница.querySelector('.gallery-photo_link'))
	{
		let мсСоответствия = узИзвлечь.getAttribute('onclick').match(/^window\.open\('(http[^']+)'.*?width=(\d+),height=(\d+)/);
		оФотка.сАдресИзображения  = мсСоответствия[1];
		оФотка.чШиринаИзображения = мсСоответствия[2] | 0;
		оФотка.чВысотаИзображения = мсСоответствия[3] | 0;
	}
	else
	{
		оФотка.сАдресИзображения  = узИзображение.getAttribute('src');
		оФотка.чШиринаИзображения = узИзображение.width; // width возвращает число.
		оФотка.чВысотаИзображения = узИзображение.height;
	}

	узИзвлечь = оСтраница.querySelector('.photo-next');
	// Нужен абсолютный адрес для индекса в г_оАльбом. href всегда возвращает абсолютный адрес,
	// а getAttribute() тот что указан в исходнике странице, в нашем случае относительный.
	оФотка.сАдресСледующейФотки = узИзвлечь ? узИзвлечь.href : '';

	узИзвлечь = оСтраница.querySelector('.photo-prev');
	оФотка.сАдресПредыдущейФотки = узИзвлечь ? узИзвлечь.href : '';

	оФотка.сОписаниеФотки = оСтраница.querySelector('.gallery-photo_description').innerHTML;
	//
	// Убрать (c) из описания фотки.
	//
	let чНачалоМусора = оФотка.сОписаниеФотки.search(
		/([ \t\r\n\-,;]|<br>)*(\*\*\* Local Caption|www\.xpbimages|www\.xpb\.cc|www\.hoch-zwei)/);
	if (чНачалоМусора >= 0)
	{
		оФотка.сОписаниеФотки = оФотка.сОписаниеФотки.slice(0, чНачалоМусора);
	}

	оФотка.сАдресАльбома = оСтраница.querySelector('.navbar_body > li > a:not([class])').getAttribute('href');

	оФотка.идСостояние = СОСТОЯНИЕ_ЗАГРУЖЕНО;
}

function ПоказатьТекущуюФотку(сАдресТекущейФотки)
{
	г_оТекущаяФотка.идСостояние = СОСТОЯНИЕ_ПРОСМОТРЕНО;
	window.history.replaceState(null, '', сАдресТекущейФотки);

	// Если просто изменить адрес изображения, то получим проблемы:
	// - до окончания загрузки нового изображения висит старое с новым размером (сжатое или вытянутое).
	// - не виден процесс загрузки изображения.
	// - не всегда меняется курсор мыши после загрузки изображения.
	let узНовоеИзображение = document.createElement('img');
	узНовоеИзображение.setAttribute('src', г_оТекущаяФотка.сАдресИзображения);
	г_узИзображение.parentNode.replaceChild(узНовоеИзображение, г_узИзображение);
	г_узИзображение = узНовоеИзображение;

	document.querySelector('.photo-next').classList.toggle('доступно', г_оТекущаяФотка.сАдресСледующейФотки);
	document.querySelector('.photo-prev').classList.toggle('доступно', г_оТекущаяФотка.сАдресПредыдущейФотки);
	document.querySelector('.gallery-photo_description').innerHTML = г_оТекущаяФотка.сОписаниеФотки;
	document.querySelector('.navbar_body > li > a:not([class])').setAttribute('href', г_оТекущаяФотка.сАдресАльбома);

	ПодогнатьТекущуюФоткуПодРазмерОкна();
	ВыполнитьПредзагрузку();
}

function ПодогнатьТекущуюФоткуПодРазмерОкна()
// Изменяет размер фотки чтобы та не превышала размер окна.
// Разметка не требует горизонтальной строки прокрутки. Видимость вертикальной строки прокрутки устанавливается вручную.
{
	//
	// document.documentElement.scrollHeight не катит, потому что стилем высота документа увеличивается до высоты окна.
	//
	let чВысотаДокумента = document.querySelector('.middle');
	чВысотаДокумента = ПолучитьСмещениеОтНачалаДокумента(чВысотаДокумента)[1] + чВысотаДокумента.offsetHeight;

	//
	// Сначала пробуем вписать изображение в окно со скрытой полосой прокрутки, и если не получилось, то с показанной.
	//
	let чНоваяШиринаИзображения = Math.min(г_оТекущаяФотка.чШиринаИзображения, window.innerWidth);
	let чНоваяВысотаИзображения = чНоваяШиринаИзображения * г_оТекущаяФотка.чВысотаИзображения / г_оТекущаяФотка.чШиринаИзображения;
	if (чВысотаДокумента - г_узИзображение.height + чНоваяВысотаИзображения <= window.innerHeight)
	{
		document.documentElement.style.overflowY = 'hidden';
	}
	else
	{
		document.documentElement.style.overflowY = 'scroll';
		// document.documentElement.clientXXX не включает размер полосы прокрутки.
		let чМаксШиринаИзображения = Math.min(г_оТекущаяФотка.чШиринаИзображения, document.documentElement.clientWidth);
		let чМаксВысотаИзображения = Math.min(г_оТекущаяФотка.чВысотаИзображения, window.innerHeight);
		чНоваяШиринаИзображения = чМаксШиринаИзображения;
		чНоваяВысотаИзображения = чНоваяШиринаИзображения * г_оТекущаяФотка.чВысотаИзображения / г_оТекущаяФотка.чШиринаИзображения;
		if (чНоваяВысотаИзображения > чМаксВысотаИзображения)
		{
			чНоваяВысотаИзображения = чМаксВысотаИзображения;
			чНоваяШиринаИзображения = чНоваяВысотаИзображения * г_оТекущаяФотка.чШиринаИзображения / г_оТекущаяФотка.чВысотаИзображения;
		}
	}

	// Если заменить абсолютный размер на max-width и max-height, то до получения ответа от сервера фотка будет
	// в виде пиктограммы небольшого размера, что приведет к следующим глюкам:
	// 1. Описание фотки кратковременно прыгнет вверх.
	// 2. scrollTo() не сработает, потому что высота страницы (почти) всегда будет меньше высоты окна.
	г_узИзображение.setAttribute('width',  чНоваяШиринаИзображения | 0);
	г_узИзображение.setAttribute('height', чНоваяВысотаИзображения | 0);

	// Фотка помещается в верхней части окна, чтобы внизу осталось место для описания.
	window.scrollTo(0, ПолучитьСмещениеОтНачалаДокумента(г_узИзображение)[1]);
}

function ВыполнитьПредзагрузку()
// Одновременно посылается не более 4-х запросов: 2 ЗагрузитьФотку() и 2 ВыполнитьПредзагрузкуИзображения().
// F1news.ru иногда тупит по несколько секунд, поэтому одновременная посылка нескольких запросов сокращает загрузку.
{
	for (let оФотка = г_оТекущаяФотка, ы = 0; ы < МАКСИМУМ_ПРЕДЗАГРУЖЕННЫХ_СТРАНИЦ_ВПЕРЕД; ++ы)
	{
		if (оФотка.идСостояние < СОСТОЯНИЕ_ЗАГРУЖЕНО || !оФотка.сАдресСледующейФотки)
		{
			break;
		}
		if (!г_оАльбом[оФотка.сАдресСледующейФотки])
		{
///			console.log('Предзагрузка страницы вперед');
			ЗагрузитьФотку(оФотка.сАдресСледующейФотки, false);
			break;
		}
		оФотка = г_оАльбом[оФотка.сАдресСледующейФотки];
		if (ы < МАКСИМУМ_ПРЕДЗАГРУЖЕННЫХ_ИЗОБРАЖЕНИЙ_ВПЕРЕД && оФотка.идСостояние === СОСТОЯНИЕ_ЗАГРУЖЕНО)
		{
///			console.log('Предзагрузка изображения вперед');
			ВыполнитьПредзагрузкуИзображения(оФотка);
		}
	}

	for (let оФотка = г_оТекущаяФотка, ы = 0; ы < МАКСИМУМ_ПРЕДЗАГРУЖЕННЫХ_СТРАНИЦ_НАЗАД; ++ы)
	{
		if (оФотка.идСостояние < СОСТОЯНИЕ_ЗАГРУЖЕНО || !оФотка.сАдресПредыдущейФотки)
		{
			break;
		}
		if (!г_оАльбом[оФотка.сАдресПредыдущейФотки])
		{
///			console.log('Предзагрузка страницы назад');
			ЗагрузитьФотку(оФотка.сАдресПредыдущейФотки, false);
			break;
		}
		оФотка = г_оАльбом[оФотка.сАдресПредыдущейФотки];
		if (ы < МАКСИМУМ_ПРЕДЗАГРУЖЕННЫХ_ИЗОБРАЖЕНИЙ_НАЗАД && оФотка.идСостояние === СОСТОЯНИЕ_ЗАГРУЖЕНО)
		{
///			console.log('Предзагрузка изображения назад');
			ВыполнитьПредзагрузкуИзображения(оФотка);
		}
	}
}

function ВыполнитьПредзагрузкуИзображения(оФотка)
{
	оФотка.идСостояние = СОСТОЯНИЕ_ЗАГРУЖЕНО_ПОЛНОСТЬЮ;
	// Можно задействовать XMLHttpRequest, но IMG проще.
	document.createElement('img').setAttribute('src', оФотка.сАдресИзображения);
}

function ЗагрузитьФотку(сАдресЗагружаемойФотки, лПоказатьПослеЗагрузки)
{
///	console.assert(сАдресЗагружаемойФотки);

	let оЗагружаемаяФотка = г_оАльбом[сАдресЗагружаемойФотки];
	if (оЗагружаемаяФотка)
	{
		switch (оЗагружаемаяФотка.идСостояние)
		{
			case СОСТОЯНИЕ_ЗАГРУЖЕНО:
			case СОСТОЯНИЕ_ЗАГРУЖЕНО_ПОЛНОСТЬЮ:
			case СОСТОЯНИЕ_ПРОСМОТРЕНО:
				ПоказатьПроцессЗагрузки(true, true);
				return;
			case СОСТОЯНИЕ_ЗАГРУЖАЕТСЯ:
				ПоказатьПроцессЗагрузки(true, false);
				return;
			// СОСТОЯНИЕ_ОШИБКА
		}
	}
	else
	{
		оЗагружаемаяФотка = г_оАльбом[сАдресЗагружаемойФотки] = {};
	}
	оЗагружаемаяФотка.идСостояние = СОСТОЯНИЕ_ЗАГРУЖАЕТСЯ;

	ПоказатьПроцессЗагрузки(true, false);

///	console.log('Запрос', сАдресЗагружаемойФотки);
	let оЗапрос = new XMLHttpRequest();
	оЗапрос.open('GET', сАдресЗагружаемойФотки);
	оЗапрос.responseType = 'document';
	оЗапрос.timeout = 20000;
	оЗапрос.onloadend = ОбработатьОкончаниеЗагрузкиСтраницы;
	оЗапрос.send();

	function ОбработатьОкончаниеЗагрузкиСтраницы(оСобытие)
	{
		if (оЗапрос.status < 200 || оЗапрос.status > 299 || !оЗапрос.response)
		{
			console.error('Ответ', оЗапрос.status, оЗапрос.statusText);
			оЗагружаемаяФотка.идСостояние = СОСТОЯНИЕ_ОШИБКА;
		}
		else
		{
///			console.log('Ответ', оЗапрос.response.URL);
			ИзвлечьФоткуИзСтраницы(оЗагружаемаяФотка, оЗапрос.response);
		}
		ПоказатьПроцессЗагрузки(false, true);
	}

	function ПоказатьПроцессЗагрузки(лНачалоЗагрузки, лОкончаниеЗагрузки)
	{
		if (лНачалоЗагрузки && лПоказатьПослеЗагрузки)
		{
			ЗагрузитьФотку.сПоказатьПослеЗагрузки = сАдресЗагружаемойФотки;
			if (!лОкончаниеЗагрузки)
			{
				document.querySelector('.photo-next').classList.toggle('загрузка', сАдресЗагружаемойФотки === г_оТекущаяФотка.сАдресСледующейФотки);
				document.querySelector('.photo-prev').classList.toggle('загрузка', сАдресЗагружаемойФотки === г_оТекущаяФотка.сАдресПредыдущейФотки);
			}
		}

		if (лОкончаниеЗагрузки)
		{
			if (ЗагрузитьФотку.сПоказатьПослеЗагрузки === сАдресЗагружаемойФотки)
			{
				ЗагрузитьФотку.сПоказатьПослеЗагрузки = '';
				document.querySelector('.photo-next').classList.remove('загрузка');
				document.querySelector('.photo-prev').classList.remove('загрузка');
				if (оЗагружаемаяФотка.идСостояние !== СОСТОЯНИЕ_ОШИБКА)
				{
					г_оТекущаяФотка = оЗагружаемаяФотка;
					ПоказатьТекущуюФотку(сАдресЗагружаемойФотки);
				}
				else
				{
					// TODO Как-то показать ошибку?
				}
			}
			else
			{
				ВыполнитьПредзагрузку();
			}
		}
	}
}

function НастроитьОбработкуНажатийКнопокНаКлаве(фПереходВперед, фПереходНазад)
{
	document.addEventListener('keydown',
		function(оСобытие)
		{
			if (оСобытие.repeat || оСобытие.shiftKey || оСобытие.ctrlKey || оСобытие.altKey || оСобытие.metaKey
			|| оСобытие.target.nodeName === 'TEXTAREA' || оСобытие.target.nodeName === 'INPUT')
			{
				return;
			}
			if (оСобытие.key === 'ArrowRight' || оСобытие.key === 'Right')
			{
				оСобытие.stopPropagation();
				оСобытие.preventDefault();
				фПереходВперед();
			}
			else if (оСобытие.key === 'ArrowLeft' || оСобытие.key === 'Left')
			{
				оСобытие.stopPropagation();
				оСобытие.preventDefault();
				фПереходНазад();
			}
		},
		false
	);
}

function ПолучитьСмещениеОтНачалаДокумента(узЭлемент)
// Получает координаты в пикселах левого верхнего угла элемента относительно левого верхнего угла документа.
{
	let nX = 0, nY = 0;
	do
	{
		nX += узЭлемент.offsetLeft;
		nY += узЭлемент.offsetTop;
	}
	while (узЭлемент = узЭлемент.offsetParent);
	return [nX, nY];
}

function ДобавитьСтиль(стрСтиль)
// Добавляет стиль, который действует на всё содержимое страницы.
// Возвращает добавленный элемент, который можно удалить.
{
	if (!document.head)
	{
		return null;
	}
	let узСтиль = document.createElement('style');
	узСтиль.textContent = стрСтиль;
	return document.head.appendChild(узСтиль);
}
