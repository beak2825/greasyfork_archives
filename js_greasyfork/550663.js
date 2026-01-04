// ==UserScript==
// @name  Кураторы Форума By Woody
// @namespace https://forum.blackrussia.online/*
// @version 1.0.1
// @description 86
// @author By M.Woody
// @updateversion  для КФ
// @match https://forum.blackrussia.online/*
// @include https://forum.blackrussia.online/*
// @grant none
// @license MIT
// @copyright 2025
// @icon https://forum.blackrussia.online/account/avatar
// @downloadURL https://update.greasyfork.org/scripts/550663/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20By%20Woody.user.js
// @updateURL https://update.greasyfork.org/scripts/550663/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20By%20Woody.meta.js
// ==/UserScript==


(function () {
'esversion 6' ;
const FAIL_PREFIX = 4; //отказано
const OKAY_PREFIX = 8; // Одобрено
const WAIT_PREFIX = 2; //Ожидает
const TECH_PREFIX = 13; // теху
const WATCH_PREFIX = 9;
const CLOSE_PREFIX = 7; // закрыто
const GA_PREFIX = 12; // га
const SA_PREFIX = 11; // спецам
const CP_PREFIX = 10; // команде проекта
const buttons = [
  {
    title: 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤБыстрый ответㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ',
    dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
    {
	  title: 'Техническому специалисту',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 3px solid; border-color: rgb(255, 69, 0); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

        "[CENTER]Ваша жалоба передана на рассмотрение Техническому специалисту по направлению Логирование.[/CENTER]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +

		'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
	  prefix: TECH_PREFIX,
	  status: true,
	},
    {
	  title: 'На рассмотрение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 3px solid; border-color: rgb(255, 255, 0); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме.<br>Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +

		'[CENTER][RIGHT][COLOR=rgb(255, 255, 0)]На рассмотрении.[/CENTER][/COLOR][/RIGHT][/SIZE][/FONT]',
      prefix: WAIT_PREFIX,
	  status: true,
	},
    {
	  title: 'Игрок будет наказан',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 3px solid; border-color: rgb(0, 255, 0); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Ваша жалоба была рассмотрена, итоговый вердикт: Одобрено.[/CENTER]<br>" +
        "[CENTER]Данный игрок будет наказан, благодарим за содействие.[/CENTER]<br>" +

		"[CENTER][RIGHT][COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR][/RIGHT][/SIZE][/FONT]",
      prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 3px solid; border-color: rgb(255, 0, 0); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Ваша жалоба была рассмотрена, итоговый вердикт: Отказ.[/CENTER]<br>" +
        "[CENTER]Данная жалоба составлена не по форме подачи жалобы.[/CENTER]<br>" +
        "[CENTER]Рассмотреть правила подачи жалобы можете вот тут - https://clck.ru/39tvbQ[/CENTER]<br>" +

		"[CENTER][RIGHT][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR][/RIGHT][/SIZE][/FONT]",
      prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 3px solid; border-color: rgb(255, 0, 0); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Ваша жалоба была рассмотрена, итоговый вердикт: Отказ.[/CENTER]<br>" +
        "[CENTER]Данная жалоба была рассмотрена, но представляющия доказательства недостаточны для точного рассмотрения жалобы.[/CENTER]<br>" +
        "[CENTER]Если ваша жалоба на NRP обман, DB, ответный DM и так далее, то в качестве доказательств должно быть видео-доказательство.[/CENTER]<br>" +
        "[CENTER][/CENTER]<br>" +
        "[CENTER]Если вас обманули, и вы подали жалобу, то в видео-доказательстве должны быть[/CENTER]<br>" +
        "[CENTER]- Условия сделки.[/CENTER]<br>" +
        "[CENTER]- Как игрок вышел с сети полностью. (В случаях если игрок выходит из игры)[/CENTER]<br>" +
        "[CENTER]- Как игрок полностью ушёл с места сделки. (В случаях если игрок ушёл)[/CENTER]<br>" +
        "[CENTER][/CENTER]<br>" +
        "[CENTER]Если допустим в видео-доказательстве не было условий сделки, то ваша жалоба не понадлежит рассмотрению.[/CENTER]<br>" +

		"[CENTER][RIGHT][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR][/RIGHT][/SIZE][/FONT]",
      prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету нарушений',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 3px solid; border-color: rgb(255, 0, 0); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Ваша жалоба была рассмотрена, итоговый вердикт: Отказ.[/CENTER]<br>" +
        "[CENTER]Данная жалоба была рассмотрена и со стороны данного игрока не было нарушений.[/CENTER]<br>" +

		"[CENTER][RIGHT][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR][/RIGHT][/SIZE][/FONT]",
      prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Качество видео',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 3px solid; border-color: rgb(255, 0, 0); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Ваша жалоба была рассмотрена, итоговый вердикт: Отказ.[/CENTER]<br>" +
        "[CENTER]Данная жалоба была рассмотрена, но качество данного доказательства очень низкое.[/CENTER]<br>" +
        "[CENTER]Видео/фотографии которые низкого качества не принимаются для рассмотрения.[/CENTER]<br>" +
        "[CENTER]Качество видео-доказательства должно быть минимум 480px/Качество фотографии 720px.[/CENTER]<br>" +

		"[CENTER][RIGHT][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR][/RIGHT][/SIZE][/FONT]",
      prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'точные тайм коды',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 3px solid; border-color: rgb(255, 0, 0); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Ваша жалоба была рассмотрена, итоговый вердикт: Отказано.[/CENTER]<br>" +
        "[CENTER]Укажите более точные тайм коды, так как по вашим тайм кодам нельзя более точно рассмотреть жалобу.[/CENTER]<br>" +

		"[CENTER][RIGHT][COLOR=rgb(0, 255, 0)]Отказано.[/CENTER][/COLOR][/RIGHT][/SIZE][/FONT]",
      prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Долг (не через банк)',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 3px solid; border-color: rgb(255, 0, 0); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Ваша жалоба была рассмотрена, итоговый вердикт: Отказано.[/CENTER]<br>" +
        "[CENTER]Когда даёте игрок в долг, то надо давать на его счёт банка, если долг давался из рук в руки, то в такой ситации отказано.[/CENTER]<br>" +

		"[CENTER][RIGHT][COLOR=rgb(0, 255, 0)]Отказано.[/CENTER][/COLOR][/RIGHT][/SIZE][/FONT]",
      prefix: FAIL_PREFIX,
	  status: false,
	},
{
    title: 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОтказ жалобㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ',
    dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
    {
	  title: 'Нет таймкодов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

        "[CENTER]Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +

		"[CENTER][COLOR=WHITE]Закрыто..[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доква в соц сетях',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br>" +

		"[CENTER][COLOR=WHITE]Закрыто..[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]На ваших доказательствах отсутствуют нарушения игрока.<br>" +

		"[CENTER][COLOR=WHITE]Закрыто..[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно доказательств',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]В вашей жалобе недостаточно доказательств на нарушение игрока.<br>" +

		"[CENTER][COLOR=WHITE]Закрыто..[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	    {
	  title: 'Ссылка не работает',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Ссылка с доказательствами нерабочая. Проверьте работоспособность ссылки и напишите новую жалобу.<br>" +

		"[CENTER][COLOR=WHITE]Закрыто..[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доказательства отредактированы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.<br>" +

		"[CENTER][COLOR=WHITE]Закрыто..[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Фрапс обрывыется',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Доказателства в вашей жалобе обрываются. Загрузите полный фрагмент нарушения игрока на платформу YouTube и создайте новую жалобу.<br>" +

		"[CENTER][COLOR=WHITE]Закрыто..[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Отсутвуют док-ва',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]В вашей жалобе не загружены доказательства на нарушение игрока. Создайте новую жалобу, загрузив доказательства с нарушениями игрока.<br>" +

		"[CENTER][COLOR=WHITE]Закрыто..[/COLOR][/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОдобрение жалобㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ',
      dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
     {
	  title: 'CapsLock',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=WHITE]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Упом/Оск Родни',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=WHITE]Mute 120 минут / Ban 7 - 15 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Политика/Религия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [COLOR=WHITE]Mute 120 минут / Ban 10 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
   {
	  title: 'nRP повидение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=WHITE]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'NonRP Drive',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [COLOR=WHITE]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Помеха RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=WHITE]Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/SIZE][/QUOTE][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'nRP обман ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.05.Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=WHITE]PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Аморальные действия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=WHITE]Jail 30 минут / Warn.[/SIZE][/QUOTE][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DM',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=WHITE]Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Mass DM',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=WHITE]Warn / Ban 3 - 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Постороннее ПО',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/B][/CENTER]<br>' +

		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=WHITE]Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +

		"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=WHITE]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=WHITE][SIZE=4][FONT=Georgia]Приятной игры и времяпровождение на сервере SPB[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


// addButton('На рассмотрение', 'pin');
// addButton('Тех. спецу', 'tech');
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);')
	addButton('Тех. спецу', 'tech', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

 $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));

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
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}
	function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    const content = template(data).replace(/<span class="username--moderator">|<\/span>/g, '');

    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(content);
    $('a.overlay-titleCloser').trigger('click');

    if (send) {
        editThreadData(buttons[id].prefix, buttons[id].status);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}

	function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = "Игрок"
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
            ? `Доброе утро`
            : 11 < hours && hours <= 15
                ? `Добрый день`
                : 15 < hours && hours <= 21
                    ? `Добрый вечер`
                    : `Доброй ночи`

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: greeting
        };
    }

 function editThreadData(prefix, pin = false) {
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
            }
            if(pin == true){
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
          }
 function getFormData(data) {
            const formData = new FormData();
            Object.entries(data).forEach(i => formData.append(i[0], i[1]));
            return formData;
            }
          })();