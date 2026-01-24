// ==UserScript==
// @name         Скрипт для модерирования
// @namespace    https://forum.blackrussia.online/
// @description  Скрипт для модерирования форума BlackRussia by A.Kobzev mod
// @version      0.2
// @author       Angel_Kobzev
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license MIT
// @icon https://i.postimg.cc/y8fk35Ds/uix-logo-cust-1.png
// @downloadURL https://update.greasyfork.org/scripts/563788/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/563788/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function () {
	'use strict';
    const NO_PREFIX = 0; // префикса нет
    const PIN_PREFIX = 2; //  префикс закрепить
	const UNACCEPT_PREFIX = 4; // префикс отказано
    const DECIDED_PREFIX = 6; // префикс решено
    const CLOSE_PREFIX = 7; // префикс закрыто
	const ACCEPT_PREFIX = 8; // префикс одобрено
    const WATCHED_PREFIX = 9; // рассмотрено
	const COMMAND_PREFIX = 10; // команде проекта
    const SPEC_PREFIX = 11; // префикс спец адм
    const GA_PREFIX = 12; // префикс главному адм
	const TEX_PREFIX = 13; //  техническому специалисту
	const buttons = [

        {
		title: 'Приветствие',
	    dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
		content:
        '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
		'[COLOR=rgb(209, 213, 216)]Ваш текст[/COLOR][/CENTER][/FONT][/SIZE]',
	    },
	    {
        title: 'Обычные темы регламента',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(0, 0, 255); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	    },
         {
            title: 'На рассмотрении',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Беру вашу жалобу[/COLOR][COLOR=rgb(250,197,28)] на рассмотрение.[/COLOR][COLOR=rgb(209, 213, 216)] Ответ будет дан в данной теме в течении 24-х часов, постараемся ответить вам как можно быстрее.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы. Иначе при создании дубликатов ваш форумный аккаунт может быть заблокирован по пункту 2.18.[/COLOR]<br><br>" +
            '[SPOILER="Пункт 2.18"]<br>'+
            "2.18. Запрещена публикация дублирующихся тем."+
            '[/SPOILER][/CENTER][/FONT][/SIZE]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Не логируеться',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)]По предаставленным вами доказательствам нельзя выдать наказание игроку. Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам.[/COLOR]<br>" +
             "[COLOR=rgb(209, 213, 216)]Через определенные ресурсы не было подтверждено нарушение с стороны игрока.[/COLOR]<br><br>" +
             "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован по пункту 2.18.<br><br>" +
             '[SPOILER="Пункт 2.18"]<br>'+
             "2.18. Запрещена публикация дублирующихся тем."+
             "[/SPOILER]"+
            '[/CENTER][/FONT][/SIZE]',

            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'DM',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.19.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/COLOR]<br>" +
            '[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Читы',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.22.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR]<br>" +
            "[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] Разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR]<br>" +
            '[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] Блокировка за включенный счетчик FPS не выдается.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Mass DM',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/COLOR][COLOR=rgb(255, 0, 0)] | Warn / Ban 3 - 7 дней[/COLOR]<br><br>" +
            '[/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ДБ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]2.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта.[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Слив Глобального чата',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]3.08.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещены любые формы «слива» посредством использования глобальных чатов.[/COLOR][COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/CENTER][/FONT][/SIZE]<br>",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Слив склада',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]2.09.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером.[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR]<br><br>" +
              "• [COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/COLOR]<br>" +
              "• [COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/COLOR][/CENTER][/FONT][/SIZE]<br>",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Bagouse',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)]2.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Bagouse Anim',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)]2.55.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR]<br><br>' +
            '• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками[/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Фейк',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
           '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
           '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>' +
           '[COLOR=rgb(255, 0, 0)]4.10.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[/COLOR][COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
        title: 'Наказание в чате игры' ,
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(0, 0, 255); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
          },
          {
            title: 'MG',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.18.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR]<br>" +
            '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Телефонное общение также является IC чатом.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'CAPS',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]3.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате.[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Flood',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]3.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока.[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Упом род / оск род',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель будет наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.19.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 - 15 дней[/COLOR]<br><br>" +
            '• [COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Термины "MQ", "rnq" расценивается, как упоминание родных.[/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] Если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'OOC оск',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]3.03.[/COLOR][COLOR=rgb(209, 213, 216)] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Аморал',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.08.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещена любая форма аморальных действий сексуального характера в сторону игроков.[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR]<br><br>" +
            '• [COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] обоюдное согласие обеих сторон.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'неув к адм/оск адм',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.54.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации.[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 180 минут[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Оформление жалобы в игре с текстом: "Быстро починил меня", "Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!", "МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА" и т.д. и т.п., а также при взаимодействии с другими игроками.[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов -[/COLOR][COLOR=rgb(255, 0, 0)] Mute 180 минут.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'выдача за адм',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель будет наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]3.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена выдача себя за администратора, если таковым не являетесь.[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Обман адм',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.32.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта.[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)]подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]по решению руководства сервера может быть выдана перманентная блокировка как на аккаунт, с которого совершен обман, так и на все аккаунты нарушителя.[/COLOR][COLOR=rgb(255, 0, 0)] | PermBan[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)]за предоставление услуг по прохождению обзвонов на различные должности, а также за услуги, облегчающие процесс обзвона, может быть выдан чёрный список проекта[/COLOR][COLOR=rgb(255, 0, 0)] | PermBan + ЧС проекта[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'угрозы',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR][/CENTER]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.37.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации.[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 - 15 дней.[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'польз уязв правил',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.33.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено пользоваться уязвимостью правил.[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна. Либо его действия формально не нарушают конкретного пункта, но всё же наносят ущерб другим игрокам или игровой системе.[/COLOR]' +
            '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Игрок сознательно берёт долг через трейд, не планируя его возвращать, считая, что по правилам это не считается долгом и наказания не будет.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'конфликты ooc и ic',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]2.35.[/COLOR][COLOR=rgb(209, 213, 216)]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате.[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'злоуп символами',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]3.06.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено злоупотребление знаков препинания и прочих символов[/COLOR][COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
        title: 'Наказания за Рекламу',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(0, 0, 255); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
         },
         {
            title: 'Реклама Voice',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]3.17.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещена реклама в Voice Chat не связанная с игровым процессом[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR]' +
            '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Реклама промо',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]3.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 30 дней[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] Промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR]<br>" +
            '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Реклама',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]2.31.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 7 дней / PermBan[/COLOR]' +
            '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },

           {
        title: 'Наказание за NonRp' ,
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(0, 0, 255); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	      },
          {
            title: 'Nrp Обман / попытка Nrp обмана',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель будет наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/COLOR][COLOR=rgb(255, 0, 0)] | PermBan[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] После IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации[/COLOR]<br>" +
            '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp В/Ч',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту правил нападения на Военскую часть[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]]2.[/COLOR][COLOR=rgb(209, 213, 216)]За нарушение правил нападения на Военную Часть.[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp Поведение, правокация ГОСС',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.01.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR]<br><br>" +
            '• [COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp AKC',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.52.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера.[/COLOR][COLOR=rgb(255, 0, 0)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR]<br><br>" +
            '• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Помеха Rp процессу',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR]<br><br>" +
            '• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Таран дальнобойщиков, инкассаторов под разными предлогами.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Уход от Рп',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.02.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами.[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR]<br><br>" +
            '• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее..[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
        title: 'Наказания  за нарушение правил ГОСС' ,
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(0, 0, 255); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
          },
          {
            title: 'Армия',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.02.[/COLOR][COLOR=rgb(209, 213, 216)] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR]<br>" +
            "• [COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] За нарушение Mass DM игроку выдается предупреждение[/COLOR][COLOR=rgb(255, 0, 0)] | Warn[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено закрывать метку сбора автомобилями, с целью сохранения материалов на складе[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено закрыть будку для открытия КПП машинами, с целью препятствовать нападению ОПГ[/COLOR]<br>" +
            "• [COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Наказание выдается по аналоги с пунктом правил 2.03[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено закрывать брешь в стене машинами с целью заблокировать въезд/выезд ОПГ.[/COLOR]<br>" +
            '• [COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Наказание выдается по аналоги с пунктом правил 2.03[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Правительство',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]3.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий[/COLOR][COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'СМИ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]4.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактирование объявлений, не соответствующих ПРО[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR]<br>" +
            "• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Игрок отправил одно, а редактор вставил полноценное объявление.[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]4.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено проведение эфиров, не соответствующих игровым правилам и логике[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]4.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена реклама промокодов в объявлениях[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 30 дней.[/COLOR]<br><br>" +
            '[COLOR=rgb(255, 0, 0)]4.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 7 дней + ЧС организации[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ЦБ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]5.01.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено использование оружия в рабочей форме[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR]<br>" +
            "• [COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)]Защита в целях самообороны, обязательно иметь видео доказательство в случае наказания администрации.[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]5.02.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами[/COLOR][COLOR=rgb(255, 0, 0)] Ban 3-5 дней + ЧС организации[/COLOR]<br>" +
            '• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)]Игрок обращается к сотруднику больницы с просьбой о лечении. Сотрудник применяет команду лечения, а затем выполняет команду для смены пола.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'УМВД',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)]6.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать розыск без IC причины [/COLOR][COLOR=rgb(255, 0, 0)] | Warn[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)]6.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено nRP поведение[/COLOR][COLOR=rgb(255, 0, 0)] | Warn [/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] поведение, не соответствующее сотруднику УМВД.[/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)] Пример:[/COLOR]<br>' +
            '[COLOR=rgb(209, 213, 216)][QUOTE]- открытие огня по игрокам без причины,<br>' +
            '- расстрел машин без причины,<br>' +
            '- нарушение ПДД без причины,<br>' +
            '- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне. [/QUOTE][/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ГИБДД',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)]7.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать розыск, штраф без IC причины[/COLOR][COLOR=rgb(255, 0, 0)] | Warn[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)]7.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено останавливать и осматривать транспортное средство без IC причины [/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] Нарушения данного пункта правил регулируются лидером, в случае обращения к нему напрямую или через специальные темы на форуме.[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)]7.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено отбирать водительские права во время погони за нарушителем[/COLOR][COLOR=rgb(255, 0, 0)] | Warn[/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено несоответствующее поведение по аналогии с пунктом [/COLOR][COLOR=rgb(255, 0, 0)]6.02. [/COLOR][COLOR=rgb(209, 213, 216)]([/COLOR][COLOR=rgb(255, 0, 0)]6.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено nRP поведение |[/COLOR][COLOR=rgb(255, 0, 0)] Warn[/COLOR][COLOR=rgb(209, 213, 216)])[/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ФСБ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)] 8.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать розыск без IC причины[/COLOR][COLOR=rgb(255, 0, 0)] | Warn [/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)] 8.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использовать маскировку в личных целях [/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] Нарушения данного пункта правил регулируются лидером, в случае обращения к нему напрямую или через специальные темы на форуме.[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)] 8.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено безосновательное увольнение сотрудников силовых структур (УМВД, Армия, ГИБДД)[/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] увольнение не соответствующие федеральному постановлению.[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)] 8.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено проводить обыск игрока без IC причины.[/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Нарушения данного пункта правил регулируются лидером, в случае обращения к нему напрямую или через специальные темы на форуме.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ФСИН',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)] 9.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено освобождать заключённых, нарушая игровую логику организации[/COLOR][COLOR=rgb(255, 0, 0)] | Warn [/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Выводить заключённых за территорию, используя фракционные команды, или открывать ворота территории ФСИН для выхода заключённых.[/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Побег заключённого возможен только на системном уровне через канализацию.[/COLOR]<br><br>' +
            '[COLOR=rgb(255, 0, 0)] 9.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать выговор или поощрять заключенных, а также сажать их в карцер без особой IC причины[/COLOR][COLOR=rgb(255, 0, 0)] | Warn [/COLOR]<br>' +
            '• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] сотруднику ФСИН не понравилось имя заключенного и он решил его наказать выговором или посадить в карцер[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
        title: 'Перенаправление в другой раздел',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(0, 0, 255); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
          },
          {
            title: 'В жалобы на технических специалистов',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=#C0C0C0]Для жалобы на [COLOR=#FFA500]технических специалистов[/COLOR][COLOR=#C0C0C0], обратитесь в жалобы на [/COLOR][COLOR=#FFA500]технических специалистов[/COLOR][COLOR=#C0C0C0] - [URL='https://forum.blackrussia.online/forums/Сервер-№51-tula.2261/']*Нажмите сюда*[/URL][/COLOR]<br>" +
            "[COLOR=#C0C0C0]Форма подачи жалоб на[COLOR=#FFA500] технических специалистов[/COLOR][COLOR=#C0C0C0] - [URL='https://forum.blackrussia.online/threads/Шаблон-и-правила-подачи-жалобы-на-технического-специалиста.11657900/']*Нажмите сюда*[/URL][/COLOR]<br>" +
            "[COLOR=#C0C0C0]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR]<br><br>" +
            '[COLOR=#FF0000]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: true,
          },
	      {
            title: 'Техническому Специалисту',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Передаю вашу жалобу[/COLOR][COLOR=rgb(255, 102, 0)] Техническому Разделу - [USER=528926]Katya Wasabi🐈[/USER], [USER=151933]Maga Primes🐿[/USER],[USER=777932]Mark Kulikov[/USER][/COLOR][COLOR=rgb(209, 213, 216)] для рассмотрение данной жалобы.<br><br>"+
            "Иногда ответ технического специалиста может занять некоторое время.[/COLOR]<br>" +
            '[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/CENTER][/FONT][/SIZE]' ,
            prefix: TEX_PREFIX,
            status: true,
          },
          {
            title: 'Руководству хелперов',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Передаю вашу жалобу[/COLOR][COLOR=rgb(0, 255, 255)] Руководству Хелперов[/COLOR][COLOR=rgb(209, 213, 216)] для рассмотрение данной жалобы.[/COLOR]<br><br>" +
            '[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/CENTER][/FONT][/SIZE]<br>' ,
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Руководству ОПГ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Ваша жалоба переадресована[/COLOR][COLOR=rgb(0, 255, 255)] Руководству ОПГ[/COLOR][COLOR=rgb(209, 213, 216)] для рассмотрение данной жалобы.[/COLOR]<br><br>" +
            '[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/CENTER][/FONT][/SIZE]' ,
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Главному администратору',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Ваша жалоба переадресована[/COLOR][COLOR=rgb(255, 0, 0)] Главному администратору - [USER=872772]Clifford Arankay 𓆩♡𓆪[/USER][/COLOR][COLOR=rgb(209, 213, 216)] для рассмотрение данной жалобы.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR]<br>" +
            '[COLOR=rgb(209, 213, 216)]Иногда ответ Главного Администратора может занять некоторое время.[/COLOR]' +
            '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>' +
            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: GA_PREFIX,
            status: true,
          },
          {
            title: 'Зам. Главного администратора',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Ваша жалоба переадресована[/COLOR][COLOR=rgb(255, 0, 0)] Заместителю Главного администратора по ГОСС и ОПГ - [USER=1649128]Ivan_Dapev𓆩♡𓆪[/USER][/COLOR][COLOR=rgb(209, 213, 216)] для рассмотрение данной жалобы.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR]<br>" +
            '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>' +
            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Осн. Зам. Главного администратора',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Ваша жалоба переадресована[/COLOR][COLOR=rgb(255, 0, 0)] Основному Заместителю Главного администратора - [USER=640694]ᴅᴀɴʏ_ꜰᴏʀᴇꜱᴛʀʏ 𓆩♡𓆪[/USER][/COLOR][COLOR=rgb(209, 213, 216)] для рассмотрение данной жалобы.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR]<br>" +
            '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>' +
            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'В жб на адм',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Вы ошиблись разделом, обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2288/']*Нажмите сюда*[/URL][/COLOR][/CENTER][/FONT][/SIZE]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на игроков',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Вы ошиблись разделом, обратитесь в раздел жалобы на игроков - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.2290/']*Нажмите сюда*[/URL][/COLOR][/CENTER][/FONT][/SIZE]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на лидеров',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2289/']*Нажмите сюда*[/URL][/COLOR][/CENTER][/FONT][/SIZE]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на Хелперов',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Вы ошиблись разделом, обратитесь в раздел жалоб на Агентов поддержки - [URL='https://forum.blackrussia.online/threads/tula-helpers-Жалобы-на-Агентов-Поддержки.14130415/']*Нажмите сюда*[/URL][/COLOR][/CENTER][/FONT][/SIZE]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на сотрудников орг',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Вы ошиблись разделом, обратитесь в жалобы на сотрудников фракции.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В Обжалования наказания',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Вы ошиблись разделом, обратитесь в раздел Обжалование наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2291/']*Нажмите сюда*[/URL].[/COLOR][/CENTER][/FONT][/SIZE]",
            prefix: UNACCEPT_PREFIX,
            status: false,
           },

           {
        title: 'Доказательства в жалобах',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(0, 0, 255); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	      },
          {
            title: 'Недостаточно доказательств',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Предоставленных вами доказательств недостаточно для корректного рассмотрения жалобы.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Доказательства плохого качества',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Качество предоставленных Вами доказательств не позволяет корректно рассмотреть жалобу.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нет док-в',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Доказательства не предоставлены, следовательно, жалоба не подлежит рассмотрению без доказательств (п. 3.6 Правил подачи жалоб на игроков: «Прикрепление доказательств обязательно»). Пожалуйста, загрузите материалы на фото/видео‑хостинг (YouTube, Япикс, Imgur и др.) и прикрепите в "Доказательства" действующие ссылки.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не работает док-ва',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Предоставленные Вами доказательства недоступны либо указана некорректная ссылка, поэтому жалоба не подлежит рассмотрению без доказательств (п. 3.6 Правил подачи жалоб на игроков: «Прикрепление доказательств обязательно»). Просим вас загрузить доказательства на фото/видео ‑хостинг (YouTube, Япикс, Imgur и др.) и прикрепить в разделе «Доказательства» актуальные, корректно работающие ссылки.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва обрываются',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Предоставленная видеозапись обрывается или является неполной. Просьба загрузить полную версию видео (если такова имеется) на видеохостинг (например, YouTube).[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва отредактированы',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Доказательства подверглись редактированию и, следовательно, не подлежат рассмотрению (п. 3.7 Правил подачи жалоб на игроков: «Доказательства должны быть представлены в первоначальном виде»).[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нужен фрапс',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Для объективного рассмотрения вашей жалобы необходима видеофиксация (запись экрана) всех ключевых моментов, без неё мы не сможем установить обстоятельства и дать квалифицированный ответ.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва в соц. сетях',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Предоставленные доказательства размещены в социальных сетях и не подлежат рассмотрению (п. 3.6 Правил подачи жалоб на игроков). Доказательства следует загрузить на фото/видео‑хостинг (например YouTube, Япикс, Imgur и др.).[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нету time',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]На ваших доказательствах отсутствуют дата и время. Следовательно такая жалоба не подлежит рассмотрению (Пункт 3.2. Правил подачи жалоб на игроков).[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют таймкоды',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нет условий сделки',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]В предоставленных доказательствах отсутствуют условия сделки.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нарушений нет',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]По результатам рассмотрения представленных вами доказательств нарушений со стороны игрока не выявлено.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Прошло 3 дня',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Жалоба подана по истечении установленного срока и поэтому не подлежит рассмотрению (п. 3.1 Правил подачи жалоб на игроков: «Срок написания жалобы составляет три дня (72 часа) с момента совершённого нарушения со стороны игрока сервера.<br>" +
            "• Примечание: в случае истечения срока жалоба рассмотрению не подлежит.»).<br>Правила подачи жалоб: [URL='https://forum.blackrussia.online/forums/Правила-подачи-жалоб.202/']Тут[/URL].[/COLOR][/CENTER][/FONT][/SIZE]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'От 3 лица',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Ваша жалоба не подлежит рассмотрению, так как подана от третьего лица (п. 3.3 Правил подачи жалоб на игроков: «Обязательные условия для рассмотрения жалобы: 3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации)»). Правила подачи жалоб: [URL='https://forum.blackrussia.online/forums/Правила-подачи-жалоб.202/']Тут[/URL].[/COLOR][/CENTER][/FONT][/SIZE]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Уже был дан ответ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]На вашу жалобу уже был дан ответ в предыдущей(-их) жалобе(-ах).[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: '2 и более игрока',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Ваша жалоба отказана по причине: нельзя писать одну жалобу на двух и белее игроков (на каждого игрока отдельная жалоба).[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Ваша жалоба составлена с нарушением установленной формы и поэтому не подлежит рассмотрению (п. 1.5 Правил подачи жалоб: «Ваша жалоба будет рассмотрена администрацией сервера, если она соответствует всем правилам подачи»). Правила — [URL='https://forum.blackrussia.online/forums/Правила-подачи-жалоб.202/']Тут[/URL].[/COLOR][/CENTER][/FONT][/SIZE]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Заголовок неправильный',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Заголовок жалобы не соответствует установленной форме и поэтому не подлежит рассмотрению (п. 1.3. Правил подачи жалоб: «Если название вашей темы не соответствует правилам подачи, будет выдан отказ с последующим закрытием жалобы.»). Правила подачи жалоб: [URL='https://forum.blackrussia.online/forums/Правила-подачи-жалоб.202/']Тут[/URL].[/COLOR][/CENTER][/FONT][/SIZE]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Прочие пункты правил',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(0, 0, 255); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
          },
          {
            title: 'Уже наказан',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            '[COLOR=rgb(209, 213, 216)]Данный игрок уже был наказан ранее.[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },

	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0);');
    addButton('Отказано', 'unaccept', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);')
    addButton('Закрыто', 'closed_complaint', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
    addButton('Одобрено', 'accepted', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
    addButton('Рассмотрено', 'watched', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
    addButton('Решено', 'decided', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
    addButton('Главному Адм.', 'GA', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');

	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, true));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));
    $('button#GA').click(() => editThreadData(GA_PREFIX, true));
    $('button#SPEC').click(() => editThreadData(SPEC_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 8) {
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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 20px; font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none;">Выбрать ответ</button>`,
	);
	}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
     `<button id="answers-${i}" class="button--primary button ` +
    `rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button><br>`,
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
	6 <= hours && hours < 12 ?
	'Доброе утро' :
	12 <= hours && hours < 18 ?
	'Добрый день' :
	18 <= hours && hours < 23 ?
	'Добрый вечер' :
	'Доброй ночи',
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