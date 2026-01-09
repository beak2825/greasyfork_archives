// ==UserScript==
// @name         Скрипт для ГС ОПГ Sasha_Wraslanov

// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт для ГС/ЗГС направлений
// @author       Sasha_Wraslanov
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/561975/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20Sasha_Wraslanov.user.js
// @updateURL https://update.greasyfork.org/scripts/561975/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20Sasha_Wraslanov.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному Лидеру
	const MAINADM_PREFIX = 12; // главному адамнистратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
 {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Основное ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
    },
{
                                	  title: '| Приветствие |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE] Текст <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>" ,
               },
    {
        title: '| Жалоба на рассмотрение |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE] Ваша жалоба взята на [/COLOR][COLOR=Yellow]рассмотрение.[/COLOR]<br>[COLOR=WHITE]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
               prefix: PIN_PREFIX,
      status: true,
                       },
    {
         title: '| Наказание Лидеру |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=WHITE]В сторону Лидера будут применены меры.[/COLOR]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
               },

    {
                                                            	  title: '| Беседа с Лидером |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=WHITE]Лидер допустил ошибку, приносим свои извинения.<br>С Лидером будет проведена беседа.[/COLOR]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
         title: '-╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴-',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
    },
    {
                                        	  title: '| Нарушений нет |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Нарушений со стороны Лидера не обнаружено. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Лидер прав |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Лидер вынес правильный вердикт. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва предоставлены |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Доказательства были предоставлены, вердикт Лидера является верным. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Не по форме |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]К сожалению, вам отказано, Вы допустили ошибку в правилах подачи жалобы.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']Важно - Правила подачи жалобы.[/URL]<br>Прежде чем написать жалобу. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },

    {
                                                	  title: '| Недостаточно док-ев |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Недостаточно доказательств для корректного рассмотрения вашего обращения. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Отсутствуют док-ва |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]В вашей жалобе отсутствуют Доказательства.<br>Следовательно жалоба рассмотрению не подлежит. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Требуется фрапс |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Недостаточно доказательств для корректного рассмотрения жалобы.<br>В данном случае требуются видео - доказательства. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва отредактированы |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва в соц. сетях |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются.<br>Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },

    {
                                                	  title: '| Ответ дан ранее |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Отсутствует /time |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]В ваших доказательствах отсутствует /time.<br>Следовательно, жалоба рассмотрению не подлежит. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Ошиблись сервером |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]Вы ошиблись сервером, напишите жалобу на Лидера на форуме Вашего сервера. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
        title:'| В жалобы на игроков |',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в раздел Жалобы на игроков.  [/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
      {
        title:'| В жалобы на адм |',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вы ошиблись разделом. Обратитесь в раздел Жалобы на администрацию.[/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
      {
        title:'| В обжалование наказаний |',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в раздел Обжалование наказаний. [/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
];

 const biography = [
           {
       title: '-╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Свой ответ для жалоб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴-',
	   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
    },
{
	  title: 'Одобрено',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[B][FONT=courier new][B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=WHITE]В сторону Лидера будут применены меры.[/COLOR]<br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Текст [/ICODE][/COLOR]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]С уважением, [/COLOR][COLOR=RED]ГС ОПГ[/COLOR] - Sasha_Wraslanov.<br>",

},
      {
       title: '-╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Рассмотрение заявок╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴-',
	   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
    },

       {
     title: "Проверка заявлений на  ЛД",
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
     content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
    "[B][CENTER][COLOR=#FF1493]Доброго времени суток уважаемые игроки. Пришло время подвести итоги.[/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Рассмотрев ваши Заявки я готов вынести вердикт.[/ICODE]<br><br>"+
     "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF7F][ICODE]Список допущенных к обзвону: [/ICODE][/COLOR]<br><br>"+
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF7F][ICODE] ВОТ СЮДА ВПИСАТЬ НИКИ КТО ОДОБРЕН[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Список не допущенных к обзвону: [/ICODE][/COLOR]<br><br>"+
     "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] ВОТ СЮДА ВПИСАТЬ НИКИ КОМУ ОТКАЗ [/ICODE][/COLOR]<br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
           "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=Red][ICODE]Обзвон состоится ДАТА.МЕС.ГОД в ВРЕМЯ по МСК.[/ICODE][/COLOR][COLOR=#FFFFFF][ICODE] Он будет проходить в конференции ВК.[/ICODE][COLOR=#FFFFFF][ICODE] Всем удачи на обзвоне![/ICODE]<br><br>"+
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Обзвон будет проходит в конференции ВК [/ICODE][COLOR=ffffff] [/COLOR]<br><br>"+
   "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=lime][B][SIZE=5] Lime[/SIZE][/B][/COLOR]",
 },

       ];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
      addAnswers();
      addButton('Свой ответ', 'selectBiographyAnswer', 'border-radius: 13px; margin-right: 5px; margin-left: 5px; margin-bottom: 5px; border: none; background: #483D8B');
	// Поиск информации о теме
		const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData2(UNACCEPT_PREFIX, false));
	$('button#accepted').click(() => editThreadData2(ACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData2(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData2(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData2(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData2(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData2(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData2(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData2(TEX_PREFIX, true));
    $('button#mainadm').click(() => editThreadData2(GA_PREFIX, true));
     $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));

    $(`button#selectComplaintAnswer`).click(() => {
          XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
          buttons.forEach((btn, id) => {
              if (id > 0) {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
              } else {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
              }
          });
      });
      $(`button#selectBiographyAnswer`).click(() => {
        XF.alert(buttonsMarkup(biography), null, 'Выберите ответ:');
        biography.forEach((btn, id) => {
            if (id > 1) {
                $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
            } else {
                $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
            }
        });
      });
          $(`button#selectMoveTask`).click(() => {
        XF.alert(tasksMarkup(tasks), null, 'Выберите действие:');
        tasks.forEach((btn, id) => {
            $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
        });
      });
  });

      function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
  }
  function addAnswers() {
		$('.button--icon--reply').before(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectComplaintAnswer" style="oswald: 3px; margin-bottom: 5px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}

function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function tasksMarkup(buttons) {
  return `<div class="select_answer">${buttons
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function pasteContent(id, data = {}, send = false) {
      const template = Handlebars.compile(buttons[id].content);
      if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

      $('span.fr-placeholder').empty();
      $('div.fr-element.fr-view p').append(template(data));
      $('a.overlay-titleCloser').trigger('click');

      if (send == true) {
          editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
          $('.button--icon.button--icon--reply.rippleButton').trigger('click');
      }
  }

  function pasteContent2(id, data = {}, send = false) {
    const template = Handlebars.compile(biography[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == false) {
        editThreadData(biography[id].move, biography[id].prefix, biography[id].status, biography[id].open);
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
      4 < hours && hours <= 11
        ? 'Доброе утро'
        : 11 < hours && hours <= 15
        ? 'Добрый день'
        : 15 < hours && hours <= 21
        ? 'Добрый вечер'
        : 'Доброй ночи',
  };
  }


  function editThreadData(move, prefix, pin = false, open = false) {
  // Получаем заголовок темы, так как он необходим при запросе
      const threadTitle = $('.p-title-value')[0].lastChild.textContent;

      if (pin == false) {
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
      } else if (pin == true && open) {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
          prefix_id: prefix,
          discussion_open: 1,
          title: threadTitle,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
      } else {
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
      if (move > 0) {
        moveThread(prefix, move);
      }
  }

    function editThreadData2(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	if(pin == false){
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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
    }




 if(pin == false){
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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
		   }

  function moveThread(prefix, type) {
  // Функция перемещения тем
  const threadTitle = $('.p-title-value')[0].lastChild.textContent;

  fetch(`${document.URL}move`, {
    method: 'POST',
    body: getFormData({
      prefix_id: prefix,
      title: threadTitle,
      target_node_id: type,
      redirect_type: 'none',
      notify_watchers: 1,
      starter_alert: 1,
      starter_alert_reason: "",
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
	})();