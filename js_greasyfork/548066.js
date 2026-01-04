// ==UserScript==
// @name         34 | by K. West
// @namespace    https://forum.blackrussia.online
// @version      1.3.1
// @description  Общий скрипт для сервера NOVOSIBIRSK by K. West
// @author       Kayne West
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/*
// @grant        none
// @license      MIT
// @icon         https://sun9-76.userapi.com/impg/rEBGQfiaFZnbUofS8UOFXmokbnWSxJaLR-1Ycg/rxEn_aPc0wc.jpg?size=530x530&quality=95&sign=9ca94b62b95b588d510bc19a4290a530&type=album
// @downloadURL https://update.greasyfork.org/scripts/548066/34%20%7C%20by%20K%20West.user.js
// @updateURL https://update.greasyfork.org/scripts/548066/34%20%7C%20by%20K%20West.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PREFIXES = {
    UNACCEPT: 4,
    ACCEPT: 8,
    RESHENO: 6,
    PINN: 2,
    GA: 12,
    COMMAND: 10,
    WATCHED: 9,
    CLOSE: 7,
    SPECY: 11,
    TEXY: 13
  };

  const POSITION_SECTIONS = [
    { type: 'divider', title: 'Администрация:' },
    { type: 'position', title: 'ГА' },
    { type: 'position', title: 'ОЗГА' },
    { type: 'position', title: 'ЗГА' },
    { type: 'position', title: 'Куратор' },
    { type: 'divider', title: 'Государственные организации:' },
    { type: 'position', title: 'ГС ГОСС' },
    { type: 'position', title: 'ЗГС ГОСС' },
    { type: 'divider', title: 'Преступные группировки:' },
    { type: 'position', title: 'ГС ОПГ' },
    { type: 'position', title: 'ЗГС ОПГ' },
    { type: 'divider', title: 'Агенты поддержки:' },
    { type: 'position', title: 'ГС АП' },
    { type: 'position', title: 'ЗГС АП' },
    { type: 'position', title: 'СХ Ф' },
    { type: 'divider', title: 'Кураторы форума:' },
    { type: 'position', title: 'ГКФ' },
    { type: 'position', title: 'ЗГКФ' },
    { type: 'position', title: 'Ст. КФ' },
    { type: 'position', title: 'Мл. КФ' }
  ];

  const ANSWER_CATEGORIES = [
    /* ГА */

    /* ОЗГА */

    /* ЗГА */
    { id: 'main_zga', title: 'Основные', access: ['Куратор', 'ОЗГА', 'ЗГА', 'ГА'] },
    { id: 'complaint_zga', title: 'Жалобы', access: ['Куратор', 'ОЗГА', 'ЗГА', 'ГА'] },
    { id: 'reject_zga', title: 'Отказы', access: ['Куратор', 'ОЗГА', 'ЗГА', 'ГА'] },
    { id: 'appeals_zga', title: 'Обжалования', access: ['ОЗГА', 'ГА'] },
    /* КУРАТОР */

    /* ГС/ЗГС ГОСС */
    { id: 'main_goss', title: 'Основные', access: ['ГС ГОСС', 'ЗГС ГОСС'] },
    { id: 'other_goss', title: 'Прочее', access: ['ГС ГОСС', 'ЗГС ГОСС'] },
    { id: 'complaint_goss', title: 'Жалобы', access: ['ГС ГОСС', 'ЗГС ГОСС'] },
    { id: 'reject_goss', title: 'Отказы', access: ['ГС ГОСС', 'ЗГС ГОСС'] },
    /* ГС/ЗГС ОПГ */

    /* ГС/ЗГС АП */
    { id: 'helpers_forms', title: 'Заявки на АП', access: ['ГС АП', 'ЗГС АП'] },
    { id: 'helpers_forum', title: 'Заявления', access: ['СХ Ф', 'ГС АП', 'ЗГС АП'] },
    /* КУРАТОРЫ ФОРУМА */

    /* ГКФ/ЗГКФ */

    /* СТ КФ */
    { id: 'rp_bio', title: 'RP-биографии', access: ['Ст. КФ', 'ГКФ', 'ЗГКФ'] },
    { id: 'rp_situation', title: 'RP-ситуации', access: ['Ст. КФ', 'ГКФ', 'ЗГКФ'] },
    /* МЛ КФ */
    { id: 'main_answers_kf', title: 'Основные', access: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'] },
    { id: 'reject_kf', title: 'Отказы', access: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'] },
    { id: 'rules_chat_kf', title: 'Нарушения чата', access: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'] },
    { id: 'rules_rp_process', title: 'RP-процесс', access: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'] },
    { id: 'nicknames_kf', title: 'Никнеймы', access: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'] },
    { id: 'rules_organizations_kf', title: 'Правила орг.', access: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'] },
    /* ДЛЯ ВСЕХ */
    /* access: ['all'] }, --- для всех ролей*/
    { id: 'transfer', title: 'Передача', access: ['all'] },
    { id: 'moove', title: 'Перенос', access: ['all'] },
    { id: 'all', title: 'Все ответы', access: ['all'], exclude: ['ОЗГА']},
  ];

  const ANSWER_TEMPLATES = [
    /* ПЕРЕДАЧА ЖАЛОБ  ПЕРЕДАЧА ЖАЛОБ ПЕРЕДАЧА ЖАЛОБ ПЕРЕДАЧА ЖАЛОБ ПЕРЕДАЧА ЖАЛОБ ПЕРЕДАЧА ЖАЛОБ ПЕРЕДАЧА ЖАЛОБ ПЕРЕДАЧА ЖАЛОБ ПЕРЕДАЧА ЖАЛОБ ПЕРЕДАЧА ЖАЛОБ */
      {
        title: 'Команде проекта',
        content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша жалоба была передана на рассмотрение [Color=#DC143C]Команде Проекта.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ожидайте вынесения вердикта.[/COLOR][/FONT][/CENTER]',
        category: 'transfer', positions: ['all'], exclude: ['ОЗГА'], prefix_id: PREFIXES.COMMAND, pin: true
      },
      {
          title: 'Специальному администратору',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша жалоба была передана на рассмотрение [Color=#DC143C]Специальному Администратору.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ожидайте вынесения вердикта.[/COLOR][/FONT][/CENTER]',
          category: 'transfer', positions: ['all'], prefix_id: PREFIXES.SPECY, pin: true
      },
      {
          title: 'Главному администратору',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша жалоба была передана на рассмотрение [Color=#DC143C]Главному Администратору.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ожидайте вынесения вердикта.[/COLOR][/FONT][/CENTER]',
          category: 'transfer', positions: ['all'], prefix_id: PREFIXES.GA, pin: true
      },
      {
          title: 'ЗГA',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша жалоба была передана на рассмотрение [Color=#DC143C]Заместителю Главного Администратора.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ожидайте вынесения вердикта.[/COLOR][/FONT][/CENTER]',
          category: 'transfer', positions: ['all'], exclude: ['ОЗГА'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'Куратору',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша жалоба была передана на рассмотрение [Color=#9400D3]Куратору Администрации.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ожидайте вынесения вердикта.[/COLOR][/FONT][/CENTER]',
          cateory: 'transfer', positions: ['all'], exclude: ['ОЗГА'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'Тех. специалисту',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша жалоба была передана на рассмотрение [Color=#FF8C00]техническому специалисту.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ожидайте вынесения вердикта.[/COLOR][/FONT][/CENTER]',
          category: 'transfer', positions: ['all'], prefix_id: PREFIXES.TEXY, pin: true
      },
      {
          title: 'ГКФ',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша жалоба была передана на рассмотрение [COLOR=#1E90FF]Главному Куратору Форума.[/COLOR][/COLOR][/FONT][/CENTER]<br><br>" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ожидайте вынесения вердикта.[/COLOR][/FONT][/CENTER]',
          category: 'transfer', positions: ['all'], exclude: ['ОЗГА'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'ЗГКФ',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша жалоба была передана на рассмотрение [COLOR=#1E90FF]Заместителю Главного Куратора Форума.[/COLOR][/COLOR][/FONT][/CENTER]<br><br>" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ожидайте вынесения вердикта.[/COLOR][/FONT][/CENTER]',
          category: 'transfer', positions: ['all'], exclude: ['ОЗГА'], prefix_id: PREFIXES.PINN, pin: true
      },
      /* ПЕРЕНОС ЖАЛОБ */
      {
          title: 'В жалобы на администрацию',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на администрацию[/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'moove', positions: ['all'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'В жалобы на лидеров',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на лидеров[/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'moove', positions: ['all'], exclude: ['ОЗГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'В обжалования',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вы ошиблись разделом.<br>Обратитесь в раздел обжалований наказаний[/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'moove', positions: ['all'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'В тех. раздел',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вы ошиблись разделом.<br>Обратитесь в технический раздел[/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'moove', positions: ['all'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'В жалобы на тех. специалиста',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на технических специалистов[/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'moove', positions: ['all'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Переношу на нужный сервер',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вы ошиблись сервером, переношу вашу жалобу на нужный сервер. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ожидайте ответа. [/COLOR][/FONT][/CENTER]',
          category: 'moove', positions: ['all'], pin: true
      },
      {
          title: 'В жалобы на сотрудников орг.',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CERENCE]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'moove', positions: ['all'], exclude: ['ОЗГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'В жалобы на АП',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на Агентов поддержки[/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'moove', positions: ['all'], exclude: ['ОЗГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      /* МЛАДШИЙ КУРАТОР ФОРУМА МЛАДШИЙ КУРАТОР ФОРУМА МЛАДШИЙ КУРАТОР ФОРУМА МЛАДШИЙ КУРАТОР ФОРУМА МЛАДШИЙ КУРАТОР ФОРУМА МЛАДШИЙ КУРАТОР ФОРУМА МЛАДШИЙ КУРАТОР ФОРУМА */
      /* ОСНОВНЫЕ ОТВЕТЫ */
      {
          title: 'Свой ответ',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] . [/COLOR][/FONT][/CENTER]<br><br>" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто.[/COLOR][/FONT][/CENTER]',
          category: 'main_answers_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.CLOSE, pin: false
      },
      {
          title: 'На рассмотрение',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша жалоба взята на рассмотрение.[/SIZE][/COLOR][/FONT][/I][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/SIZE][/COLOR][/FONT][/I][/CENTER]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][/CENTER]' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ожидайте ответа.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'main_answers_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'Игрок будет наказан',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан.[/COLOR] [/FONT][/CENTER]<br><br>" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'main_answers_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      /* ОТКАЗЫ */
      {
          title: 'Нарушений нет',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Нарушений со стороны данного игрока не было найдено. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.CLOSE, pin: false
      },
      {
          title: 'Недостаточно док-в',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Недостаточно доказательств на нарушение от данного игрока. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не логируется',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Данное нарушение не может быть подтверждено через определенные ресурсы. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Дубликат',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не по форме',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL=\'https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/\']с правилами подачи жалоб на игроков[/URL]. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нет /time',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] На ваших доказательствах отсутствует /time. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Укажите таймкоды',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваше видеодоказательство длится более 3-х минут, поэтому укажите тайм-коды в течении 24-х часов.<br>В противном случае жалоба будет отказана. <br> [COLOR=#FFFF00][SPOILER=Тайм-коды это]Определённый отрезок времени из видеозаписи, в котором произошли ключевые моменты. <br> Пример: <br> 0:37 - Условия сделки. <br> 0:50 - Сам обмен. <br> 1:50 - Конец обмена. <br>2:03 - Сабвуфера нет. <br>2:06 - /time. [/SPOILER][/COLOR] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Более 72 часов',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Соц. сеть',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нет условий сделки',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] В ваших доказательствах отсутствуют условия сделки [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нужен фрапс',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] В таких случаев нужен фрапс. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Фрапс с промоткой чата',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] В таких случаях нужен фрапс + промотка чата. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нужна промотка чата',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] В таких случаях нужна промотка чата. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Фрапс обрывается',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не работают док-ва',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Доказательства не работают. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нет док-в',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] В вашей жалобе отсутствуют доказательства. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Плохое качество док-в',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваши доказательства в плохом качестве, рассмотрение жалобы не возможно. [/COLOR][/FONT][/CENTER]<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Док-ва отредактированы',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваши доказательства отредактированы. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: '3-е лицо',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не тот сервер',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вы ошиблись сервером.<br> Обратитесь в раздел жалоб на игроков вашего сервера. [/COLOR][/FONT][/CERO] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ']
      },
      {
          title: 'Не написал ник',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не подтвердил условия сделки',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Доступ к Google диску',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/FRpfsF2k/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Доступ к Яндекс диску',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/7YvGNcwR/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'При сливе склада нужен лидер',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Жалоба о сливе склада семьи или самой семьи принимается только от лидера семьи. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не доказал, что владелец семьи',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Нет доказательств того, что вы являетесь владельцем семьи. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не указал тайм-коды',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Тайм-коды не были указаны за 24 часа, соответственно жалоба получает статус - [Color=#DC143C]Отказано.[/color] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Ответный DM',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] На видео видно как вы первые начали стрельбу, он лишь начал обороняться (тоесть ответный ДМ). <br> Вы будете наказаны по пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#00FF00] | Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Уже на рассмотрении',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Жалоба такого же содержания уже находится на рассмотрении.<br> Ожидайте ответа в прошлой жалобе и не нужно дублировать ее. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Долг только через банк',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Замены нет',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Нарушений со стороны игрока нет, все объявления редактировались по просьбе игроков [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'reject_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      /* ПРАВИЛА РП ПРОЦЕССА */
      {
          title: 'NonRP поведение',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + "[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#00FF00]| Jail 30 минут[/color]. <br> [Color=#00FF00][SPOILER=Примечание]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Уход от RP',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#00FF00]| Jail 30 минут / Warn[/color]. <br> [Color=#00FF00][SPOILER=Примечание]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, поле игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'NonRP Drive (вождение)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#00FF00]| Jail 30 минут[/color]. <br> [Color=#00FF00][SPOILER=Примечание]езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Помеха игровому процессу',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=#00FF00]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color]. <br> [Color=#00FF00][SPOILER=Пример]таран дальнобойщиков, инкассаторов под разными предлогами. [/SPOILER][/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'NonRP обман',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Игрок будет наказан по пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#00FF00]| PermBan[/color] <br> [Color=#00FF00][SPOILER=Примечание]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/SPOILER][/color] <br> [Color=#00FF00] [Color=#00FF00][SPOILER=Примечание] Администрация не возвращает игровое имущество в случаи обмана, вы можете договориться с игроком на возврат имущества и разблокировку аккаунта.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Примечание]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Аморальное поведение',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#00FF00]| Jail 30 минут / Warn[/color]. <br> [Color=#00FF00][SPOILER=Исключение]обоюдное согласие обеих сторон.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] ' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Слив склада',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color]. [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'DriveBy',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#00FF00] | Jail 60 минут[/color] <br> [Color=#00FF00][SPOILER=Исключение]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'TeamKill',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]  Игрок будет наказан по пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'SpawnKill',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрыных интерьеров и около них [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'MetaGaming',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#00FF00][SPOILER=Примечание]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Примечание]телефонное общение также является IC чатом.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Исключение]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'DeathMatch',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#00FF00] | Jail 60 минут [/color] <br> [Color=#00FF00][SPOILER=Примечание]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Примечание]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'MassDM',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#00FF00] | Warn / Ban 3 - 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Багоюз',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] <br> [Color=#00FF00][SPOILER=Примечание]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функции, у которых есть свое конкретное предназначение.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками; <br> Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; <br> Банк и личные счета предназначены для передачи денежных средств между игроками; <br> Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Постороннее ПО',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] <br> [Color=#00FF00][SPOILER=Примечание]запрещено внесение любых изменений в оригинальные файлы игры.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Исключение]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Исключение]блокировка за включенный счетчик FPS не выдается.[/SPOILER][/color]  [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Злоуп. наказаниями',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера [Color=#00FF00] | Ban 7 - 30 дней [/color] [Color=#00FF00][SPOILER=Примечание]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/SPOILER][/color] [Color=#00FF00][SPOILER=Примечание]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'ЕПП фура',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#00FF00] |  Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'NonRP аксессуар',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размер. [Color=#00FF00] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SPOILER][/color]  [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Невозврат долга',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.57. Запрещается брать в долг игровые ценности и не возвращать их.  [Color=#00FF00] | Ban 30 дней / permban [/color] <br> [Color=#00FF00]  [SPOILER=Примечание] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется. [/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Примечание]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда. [/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Примечание] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. [/color][/SPOILER][/color][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Баг с анимацей',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#00FF00] | Jail 120 минут [/color] <br> [Color=#00FF00][SPOILER=Примечание]наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками. [/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации. [/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Исключение]разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/color][/SPOILER][/color][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Продажа должностей за деньги (казино/клуб)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника или крупье  [Color=#00FF00] | Ban 3 - 5 дней. [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_rp_process', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      /* НАРУШЕНИЯ ЧАТА */
      {
          title: 'CapsLocck',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'ООС оскорбление',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Оск./упом. родных',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 120 минут / Ban 7 - 15 дней [/color] <br> [Color=#00FF00][SPOILER=Примечание]термины (MQ), (rnq) расценивается, как упоминание родных.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Исключение]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'FLOOD',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Злоуп. символами',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Слив глобал. чата',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#00FF00] | PermBan [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Реклама',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.31. Запрещено рекламировать на сервере любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#00FF00] | Ban 7 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'ООС угрозы',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные [Color=#00FF00] | Mute 120 минут / Ban 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Оскорбление адм.',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#00FF00] | Mute 180 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#FF0000] | Mute 180 минут [/color][/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Выдача себя за адм.',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#00FF00] | Ban 7 - 15 + ЧС администрации[/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Продажа промокода',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#00FF00] |  Mute 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Ввод в заблуждение',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#00FF00] | Ban 15 - 30 дней / PermBan[/color] <br> [Color=#FF0000][SPOILER=Примечание]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Оффтоп в репорт',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.12. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=#00FF00] | Report Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Музыка в VOICE',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Шум в VOICE',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#00FF00][SPOILER=Примечание]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/SPOILER][/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Полит./религ. пропаганда',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#00FF00] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Изменение голоса софтом',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.19. Запрещено использование любого софта для изменения голоса [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Оскорление проекта',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#00FF00] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/color] [/COLOR][/FONT][/CENTER] <br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Транслит',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>' + '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]' + '[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]«Privet», «Kak dela», «Narmalna».[/SPOILER[/color] [/COLOR][/FONT][/CENTER]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>' + '[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Реклама промо',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=#00FF00] | Ban 30 дней [/COLOR] <br> [COLOR=#00FF00][SPOILER=Примечание]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SPOILER][/COLOR] <br> [COLOR=#00FF00][SPOILER=Исключение]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SPOILER][/COLOR] <br> [COLOR=#00FF00][SPOILER=Пример]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SPOILER][/COLOR]  [/COLOR][/FONT][/CENTER][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Объявления в гос. орг.',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=#00FF00] | Mute 30 минут [/COLOR] <br> [COLOR=#00FF00][SPOILER=Пример]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево»[/SPOILER][/COLOR] [/COLOR][/FONT][/CENTER][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Мат в VIP-чат',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=#00FF00] | Mute 30 минут [/COLOR] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_chat_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      /* НИКНЕЙМЫ */
      {
          title: 'NonRP никнейм',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>4.06. Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [COLOR=#00FF00] | Устное замечание + смена игрового никнейма [/COLOR] <br> [COLOR=#00FF00][SPOILER=Пример]John_Scatman — это правильный Role Play игровой никнейм, в котором не содержится ошибок.[/SPOILER][/COLOR] <br> [COLOR=#00FF00][SPOILER=Пример]_scatman_John — это неправильный Role Play игровой никнейм, в котором содержатся определенные ошибки.[/SPOILER][/COLOR] [/COLOR][/FONT][/CENTER][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'nicknames_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Оскорбительный никнейм',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/COLOR] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'nicknames_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Фейк',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>4.10. За запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/COLOR] <br> [COLOR=#00FF00][SPOILER=Пример]подменять букву i на L и так далее, по аналогии.[/SPOILER][/COLOR] [/COLOR][/FONT][/CENTER][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'nicknames_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      /* ПРАВИЛА ОРГАНИЗАЦИЙ */
      {
          title: 'Работа в форме',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=#00FF00] | Jail 30 минут [/COLOR] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Арест в интерьере',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=#00FF00] | Ban 7 - 15 дней + увольнение из организации [/COLOR] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Казино/БУ в форме гос.',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работ в форме фракции [COLOR=#00FF00] | Jail 30 минут [/COLOR] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Замена объявления (СМИ)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=#00FF00] | Ban 7 дней + ЧС организации [/COLOR] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Розыск без причины',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>7.02. Запрещено выдавать розыск, штраф без Role Play причины [COLOR=#00FF00] | Warn [/COLOR] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'NonRP коп',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>Запрещено nRP поведение [COLOR=#00FF00] | Warn [/COLOR] [COLOR=#00FF00][SPOILER=Примечание]поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/SPOILER][/COLOR] <br> [COLOR=#00FF00][SPOILER=Пример]- открытие огня по игрокам без причины <br> - расстрел машин без причины <br> - нарушение ПДД без причины <br> - сотрудник на служебном транспорте кричит о наборе в свою семью на спавне[/SPOILER][/COLOR] [/COLOR][/FONT][/CENTER][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Отбор прав при погоне',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>7.05. Запрещено отбирать водительские права во время погони за нарушителем [COLOR=#00FF00] | Warn [/COLOR] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'NonRP воинская часть',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок будет наказан по пункту правил:<br>За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=#00FF00] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/COLOR] [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'NonRP ограбл./похищ. (jail)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'NonRP ограбл./похищ. (warn)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'NonRP ограбл./похищ. (ban)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Игрок получит наказание в виде блокировки аккаунта за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FF00][SIZE=5] Одобрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
          category: 'rules_organizations_kf', positions: ['ГКФ', 'ЗГКФ', 'Мл. КФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      /* СТАРШИЙ КУРАТОР ФОРУМА */
      /* БИОГРАФИИ */
      {
          title: 'Одобрено (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша РП биография получает статус - [Color=#00FF00]Одобрено.[/color] <br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'На доработку (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вам даётся 24 часа на дополнение вашей РП биографии, в противном случае она получит статус - [Color=#FF0000]Отказано. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'Отказ (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило нарушение [URL=\'https://forum.blackrussia.online/threads/Основные-правила-написания-roleplay-биографии.7966759/\']Правил написания RP биографий[/URL]. <br><br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Плагиат (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - Плагиат. <br><br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не дополнил (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - Не дополнили биографию в течение 24-х часов. <br><br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Возраст не совпадает с датой (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - возраст не совпадает с датой рождения. <br><br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Мат, отказ (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - матерные слова. <br><br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Грамматические ошибки (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - грамматические ошибки. <br><br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Пунктуационные ошибки (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - пунктуационные ошибки. <br><br> Приятной игры на сервере![/FONT][/CERO] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Заголовок не по форме (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - заголовок не по форме. <br><br> Приятной игры на сервере![/FONT][/CERO] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Уже на рассмотрении (BIO)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП биография уже находится на рассмотрении, дополните ее в предыдучной теме. <br><br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_bio', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      /* СИТУАЦИИ */
      {
          title: 'Одобрена (ситуац.)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП ситуация получает статус - [Color=#00FF00]Одобрено.[/color] <br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_situation', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'На доработку (ситуац.)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Вам даётся 24 часа на дополнение вашей РП ситуации, в противном случае она получит статус - [Color=#FF0000]Отказано. [/COLOR][/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_situation', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'Отказ (ситуац.)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП ситуация получает статус - [Color=#FF0000]Отказано[/color] <br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_situation', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Одобрено + без денег (ситуац.)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП ситуация получает статус - [Color=#00FF00]Одобрено.[/color] <br> [QUOTE]Так же хочу отметить, что игровую валюту вы не получите за ограбление чего-либо по РП.[/QUOTE] <br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_situation', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Отказ + без денег (ситуац.)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша РП ситуация получает статус - [Color=#FF0000]Отказано[/color] <br> [QUOTE]Так же хочу отметить, что игровую валюту вы не получите за ограбление чего-либо по РП.[/QUOTE] <br> Приятной игры на сервере![/FONT][/CENTER] <br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]',
          category: 'rp_situation', positions: ['ГКФ', 'ЗГКФ', 'Ст. КФ'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Шаблон',
          content: '[color=green][b]Одобренные кандидаты:[/b][/color]\n[list]\n[*]ник\n[*]ник\n[*]ник\n[/list]\n\n[color=red][b]Отклонённые кандидаты:[/b][/color]\n[list]\n[*]ник — причина.\n[*]ник — причина.\n[*]ник — причина.\n[/list]\n\n[size=1][color=gray]Открыто на доп. заявки.[/color][/size]',
          category: 'helpers_forms', positions: ['ГС АП', 'ЗГС АП']
      },
      {
          title: 'Шаблон (заявления)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]Результаты рассмотрения заявлений[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#00FA9A][SIZE=5][b]Одобренные заявления:[/b][/SIZE][/COLOR][/FONT][/I]<br><br>[CENTER]ник [+0][/CENTER]<br>[CENTER]ник [+0][/CENTER]<br>[CENTER]ник [+0][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5][b]Отклонённые заявления:[/b][/SIZE][/COLOR][/FONT][/I]<br><br>[CENTER]ник — причина.[/CENTER]<br>[CENTER]ник — причина.[/CENTER]<br>[CENTER]ник — причина.[/CENTER]<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#808080][SIZE=3]По всем вопросам в личные сообщения.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'helpers_forum', positions: ['СХ Ф', 'ГС АП', 'ЗГС АП']
      },
      {
          title: 'Одобрено (заявления)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]Результаты рассмотрения заявлений[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#00FA9A][SIZE=5][b]Одобренные заявления:[/b][/SIZE][/COLOR][/FONT][/I]<br><br>[CENTER]ник [+0][/CENTER]<br>[CENTER]ник [+0][/CENTER]<br>[CENTER]ник [+0][/CENTER]<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#808080][SIZE=3]По всем вопросам в личные сообщения.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'helpers_forum', positions: ['СХ Ф', 'ГС АП', 'ЗГС АП']
      },
      {
          title: 'Отказано (заявления)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]Результаты рассмотрения заявлений[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5][b]Отклонённые заявления:[/b][/SIZE][/COLOR][/FONT][/I]<br><br>[CENTER]ник — причина.[/CENTER]<br>[CENTER]ник — причина.[/CENTER]<br>[CENTER]ник — причина.[/CENTER]<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#808080][SIZE=3]По всем вопросам в личные сообщения.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'helpers_forum', positions: ['СХ Ф', 'ГС АП', 'ЗГС АП']
      },
      {
          title: 'Одобрено + открыто',
          content: '[color=green][b]Одобренные кандидаты:[/b][/color]\n[list]\n[*]ник\n[*]ник\n[*]ник\n[/list]\n\n[size=1][color=gray]Открыто на доп. заявки.[/color][/size]',
          category: 'helpers_forms', positions: ['ГС АП', 'ЗГС АП']
      },
      {
          title: 'Одобрено + закрыто',
          content: '[color=green][b]Одобренные кандидаты:[/b][/color]\n[list]\n[*]ник\n[*]ник\n[*]ник\n[/list]\n\n[size=1][color=gray]Закрыто для дальнейших ответов.[/color][/size]',
          category: 'helpers_forms', positions: ['ГС АП', 'ЗГС АП']
      },
      {
          title: 'Отказано + открыто',
          content: '[color=red][b]Отклонённые кандидаты:[/b][/color]\n[list]\n[*]ник — причина.\n[*]ник — причина.\n[*]ник — причина.\n[/list]\n\n[size=1][color=gray]Открыто на доп. заявки.[/color][/size]',
          category: 'helpers_forms', positions: ['ГС АП', 'ЗГС АП']
      },
      {
          title: 'Отказано + закрыто',
          content: '[color=red][b]Отклонённые кандидаты:[/b][/color]\n[list]\n[*]ник — причина.\n[*]ник — причина.\n[*]ник — причина.\n[/list]\n\n[size=1][color=gray]Закрыто для дальнейших ответов.[/color][/size]',
          category: 'helpers_forms', positions: ['ГС АП', 'ЗГС АП']
      },
      /* ЗГА */
      /* ОСНОВНЫЕ ОТВЕТЫ */
      {
          title: 'Приветствие',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Текст вашего сообщения[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'main_zga', positions: ['ГА', 'ОЗГА', 'ЗГА', 'Куратор'], prefix_id: PREFIXES.CLOSE, pin: false
      },
      {
          title: 'Запросил опру',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Запросил доказательства у администратора.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]На рассмотрении.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'main_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'Запросила опру',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Запросила доказательства у администратора.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]На рассмотрении.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'main_zga', positions: ['Куратор', 'ЗГА', 'ГА'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'На рассмотрение',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]На рассмотрении.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'main_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.PINN, pin: true
      },
      /* ОТКАЗЫ ЖБ НА АДМ */
      {
          title: 'Прикрепление ссылки (КФ)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Прикрепите в новой жалобе ссылку, где не согласны с вердиктом администратора. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нету /myreports',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] В доказательствах нету /myreports. Предоставьте в новой теме /myreports. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не достал/починил',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Администратор не обязан доставать автомобиль из воды или чинить его, так как это является частью игрового процесса (Role Play). Вы можете воспользоваться услугами такси, автобуса или попросить помощи у других игроков. Нарушений со стороны администратора не выявлено. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Перезагрузить роутер',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Вы зашли на IP-адрес нарушителя. Перезагрузите роутер/телефон, и проблема должна исчезнуть. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не по форме (ЖБ)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию[/URL]. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не является адм.',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Данный игрок не является администратором. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нет /time',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] В предоставленных доказательствах отсутствует команда /time, жалоба не подлежит рассмотрению. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Соц. сети',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Доказательства из социальных сетей не принимаются. Вам необходимо загрузить доказательства на разрешенный видео- или фотохостинг. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'От 3 лица',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Жалоба составлена от третьего лица. Жалобы подобного формата рассмотрению не подлежат. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нужен фрапс',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] В данной ситуации обязательна видеозапись (фрапс) всех ключевых моментов. В противном случае жалоба будет отклонена. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Неполный фрапс',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Видеозапись (фрапс) обрезана. Вынести вердикт на основании предоставленного материала невозможно. Если у вас есть полная запись, создайте новую тему и прикрепите её. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Док-ва отредактированы',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Представленные доказательства были отредактированы. Подобные жалобы рассмотрению не подлежат. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Плохое качество док-в',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Доказательства предоставлены в плохом качестве. Пожалуйста, прикрепите более качественные фото или видео. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Прошло более 48 часов',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] С момента выдачи наказания прошло более 48 часов. Жалоба не подлежит рассмотрению. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нет док-в',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] В вашей жалобе отсутствуют доказательства для рассмотрения. Прикрепите доказательства в хорошем качестве на разрешенных платформах (Yapx/Imgur/YouTube/ImgBB). [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не рабочие док-ва',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Предоставленные вами доказательства нерабочие. Создайте новую тему, прикрепив рабочую ссылку на доказательства. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Окно бана',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Зайдите в игру и сделайте скриншот окна с баном, после чего создайте жалобу заново. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Дублирование',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Ответ вам уже был дан в предыдущей теме. Напоминаем, что за дублирование тем ваш форумный аккаунт может быть заблокирован. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Админ Снят/ПСЖ',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Администратор был снят с должности/уволился. Рассмотрение жалобы нецелесообразно. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нет нарушений',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Исходя из приложенных доказательств, нарушения со стороны администратора отсутствуют. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Наказание верное',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Администратор предоставил исчерпывающие доказательства. Наказание выдано верно. [/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5] Закрыто. [/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'reject_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.CLOSE, pin: false
      },
      /* ОДОБРЕНИЕ ЖАЛОБ */
      {
          title: 'Проинструктировать',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Благодарим за ваше обращение! Администратор будет проинструктирован.<br>Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>Приносим извинения за доставленные неудобства.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FA9A][SIZE=5]Одобрено. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'complaint_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Беседа с адм.',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша жалоба была рассмотрена и одобрена, с администратором будет проведена профилактическая беседа.<br>Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>Приносим извинения за доставленные неудобства.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FA9A][SIZE=5]Одобрено. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'complaint_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Адм. будет наказан',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша жалоба была рассмотрена и одобрена, администратор будет наказан.<br>Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>Приносим извинения за доставленные неудобства.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FA9A][SIZE=5]Одобрено. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'complaint_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Меры к адм.',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваша жалоба была одобрена и по отношению к администратору будут приняты необходимые меры. Ваше наказание будет снято.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FA9A][SIZE=5]Одобрено. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'complaint_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Наказание по ошибке',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Вследствие беседы с администратором было выяснено, что наказание было выдано по ошибке.<br>Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>Приносим извинения за доставленные неудобства.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FA9A][SIZE=5]Одобрено. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'complaint_zga', positions: ['Куратор', 'ЗГА', 'ОЗГА', 'ГА'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      /* ОБЖАЛОВАНИЯ */
      {
          title: 'Не по форме (ОБЖ)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований: [URL=\'https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.2639626/\']*Нажмите сюда*[/URL][/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Отказано. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Обжалованию не подлежит',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Данное нарушение не подлежит обжалованию, администрация не может снизить вам его.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Отказано. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не готовы снизить',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Администрация сервера не готова снизить вам наказание.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Отказано. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.CLOSE, pin: false
      },
      {
          title: 'На рассмотрении (обж.)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Ваше обжалование взято на рассмотрение.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]На рассмотрении.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'Уже есть мин. наказание',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Вам было выдано минимальное наказание, обжалованию не подлежит.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Отказано. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Обжалование одобрено',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Обжалование одобрено, ваше наказание будет снято/снижено в течение 24 часов.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#00FA9A][SIZE=5]Одобрено. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Передано ГА (обж.)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Обжалование передано Главному Администратору.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]На рассмотрении.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.GA, pin: true
      },
      {
          title: 'Сутки на возврат имущ.',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Тема будет находиться в закреплении, у вас есть 24 часа на возвращение имущества и предоставление видеофиксации.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]На рассмотрении.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'Соц. сети (обж.)',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Доказательства из социальных сетей не принимаются, вам нужно загрузить доказательства на видео/фото хостинге.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Отказано. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Договор',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Игрок, которого вы обманули - обговорите с ним, а потом уже мы сможем вас обжаловать.[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Отказано. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'В жалобы на адм.',
          content: '[CENTER][url=https://postimg.cc/Nyd1J8z9][img]https://i.postimg.cc/NMcp0p84/60e41c2c3dd3163083a75e39a3a413e5-1.gif[/img][/url][/CENTER]<br><br>[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF0000]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Раздел "Обжалование" - это амнистия совершенного деяния с вашей стороны. Если вы не согласны и не признаёте свою вину, то вы ошиблись разделом. Для жалоб есть раздел под названием "Жалобы на администрацию".<br>[/SIZE][/COLOR][/FONT][/I] <br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/pVhVYCKC/RLwzo.png[/img][/url][/CENTER]<br><br>[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Отказано. Закрыто.[/SIZE][/COLOR][/FONT][/I][/CENTER]',
          category: 'appeals_zga', positions: ['ОЗГА', 'ГА'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      /* ГС ГОСС ГС ГОСС ГС ГОСС */
      /* ОСНОВНЫЕ ОТВЕТЫ */
      {
          title: 'Приветствие',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Текст вашего сообщения[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'main_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.CLOSE, pin: false
      },
      {
          title: 'Запросил опру',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Запросил доказательства у лидера.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]На рассмотрении.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'main_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'Запросила опру',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Запросила доказательства у лидера.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]На рассмотрении.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'main_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.PINN, pin: true
      },
      {
          title: 'На рассмотрение',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]На рассмотрении.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'main_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.PINN, pin: true
      },
      /* ОТКАЗЫ */
      {
          title: 'Нарушений нет',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Нарушений со стороны данного игрока не было найдено.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.CLOSE, pin: false
      },
      {
          title: 'Недостаточно док-в',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Недостаточно доказательств на нарушение от данного игрока.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не логируется',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Данное нарушение не может быть подтверждено через определенные ресурсы.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Дубликат',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не по форме',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на лидеров[/URL].[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нет /time',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]На ваших доказательствах отсутствует /time.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Более 72 часов',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Соц. сеть',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нет условий сделки',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]В ваших доказательствах отсутствуют условия сделки[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нужен фрапс',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]В таких случаев нужен фрапс.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Фрапс с промоткой чата',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]В таких случаях нужен фрапс + промотка чата.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нужна промотка чата',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]В таких случаях нужна промотка чата.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Фрапс обрывается',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Ваш фрапс обрывается, загрузите полный фрапс на ютуб.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не работают док-ва',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Доказательства не работают.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Нет док-в',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]В вашей жалобе отсутствуют доказательства.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Плохое качество док-в',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Ваши доказательства в плохом качестве, рассмотрение жалобы не возможно.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Док-ва отредактированы',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Ваши доказательства отредактированы.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: '3-е лицо',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не тот сервер',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Вы ошиблись сервером.<br>Обратитесь в раздел жалоб на лидеров вашего сервера.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Доступ к Google диску',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur).<br>[SPOILER=Скрин][IMG]https://i.postimg.cc/FRpfsF2k/image.png[/IMG][/SPOILER][/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Доступ к Яндекс диску',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur).<br>[SPOILER=Скрин][IMG]https://i.postimg.cc/7YvGNcwR/image.png[/IMG][/SPOILER][/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Не указал тайм-коды',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Тайм-коды не были указаны за 24 часа, соответственно жалоба получает статус - [COLOR=#DC143C]Отказано.[/COLOR][/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      {
          title: 'Уже на рассмотрении',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Жалоба такого же содержания уже находится на рассмотрении.<br>Ожидайте ответа в прошлой жалобе и не нужно дублировать ее.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][B][SIZE=5]Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'reject_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.UNACCEPT, pin: false
      },
      /* ЖАЛОБЫ */
      {
          title: 'Проинструктировать',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Благодарим за ваше обращение! Лидер будет проинструктирован.<br>Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>Приносим извинения за доставленные неудобства.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#00FA9A][FONT=georgia][B][SIZE=5]Одобрено. Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'complaint_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Беседа с лидером',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Ваша жалоба была рассмотрена и одобрена, с лидером будет проведена профилактическая беседа.<br>Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>Приносим извинения за доставленные неудобства.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#00FA9A][FONT=georgia][B][SIZE=5]Одобрено. Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'complaint_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Лидер будет наказан',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Ваша жалоба была рассмотрена и одобрена, лидер будет наказан.<br>Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>Приносим извинения за доставленные неудобства.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#00FA9A][FONT=georgia][B][SIZE=5]Одобрено. Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'complaint_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Меры к лидеру',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Ваша жалоба была одобрена и по отношению к лидеру будут приняты необходимые меры. Ваше наказание будет снято.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#00FA9A][FONT=georgia][B][SIZE=5]Одобрено. Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'complaint_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      {
          title: 'Наказание по ошибке',
          content: '[CENTER][B][SIZE=5][FONT=georgia][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/COLOR][/FONT][/SIZE][/B]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]Вследствие беседы с лидером было выяснено, что наказание было выдано по ошибке.<br>Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>Приносим извинения за доставленные неудобства.[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#00FA9A][FONT=georgia][B][SIZE=5]Одобрено. Закрыто.[/SIZE][/B][/FONT][/COLOR][/CENTER]',
          category: 'complaint_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС'], prefix_id: PREFIXES.ACCEPT, pin: false
      },
      /* ПРОЧЕЕ */
      {
          title: 'Норма проверена',
          content: '[CENTER][IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}. Выше проверено. [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG][/CENTER]',
          category: 'other_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС']
      },
      {
          title: 'Одобрено (АБ)',
          content: '[CENTER][IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}. Одобрено. [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG][/CENTER]',
          category: 'other_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС']
      },
      {
          title: 'Отказано (АБ)',
          content: '[CENTER][IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}. Отказано. [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG][/CENTER]',
          category: 'other_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС']
      },
      {
          title: 'Доп. баллы',
          content: '[CENTER][IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG]<br><br>[COLOR=#FF00FF][FONT=georgia][SIZE=5]-ˏˋ ✦ ˊˎ-[/COLOR][U][COLOR=#ffffff] {{ greeting }}. Проверено, в таблицу успеваемости будет выставлено [+0] баллов. [/COLOR][/U][COLOR=#FF00FF]-ˏˋ ✦ ˊˎ-[/SIZE][/FONT][/COLOR]<br><br>[IMG]https://i.postimg.cc/N0MgRZvJ/9-D22-F977-974-A-4-A8-E-AA03-C9112017-DB1-F.gif[/IMG][/CENTER]',
          category: 'other_goss', positions: ['ГС ГОСС', 'ЗГС ГОСС']
      }
  ];

  const addStyles = () => {
    const styles = `
.actionBar {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    flex-wrap: wrap !important;
    width: 100% !important;
}

.actionBar .button--icon--reply {
    order: 1;
    margin: 0 !important;
}

.compact-menu-wrapper {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    order: 2;
    margin: 0 !important;
}

.compact-menu-btn {
    border-radius: 50px !important;
    border: 2px solid !important;
    font-weight: bold !important;
    padding: 8px 16px !important;
    font-size: 13px !important;
    transition: all 0.3s ease !important;
    background: linear-gradient(45deg, #ff6b6b, #74b9ff, #00b894) !important;
    background-size: 300% 300% !important;
    animation: rgbFlow 3s ease infinite !important;
    border: none !important;
    color: white !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 80px !important;
    margin: 0 !important;
    cursor: pointer !important;
    height: 40px !important;
}

@keyframes rgbFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.compact-menu-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
}

.settings-btn {
    padding: 6px 12px !important;
    border-radius: 50px !important;
    min-width: 40px !important;
    height: 40px !important;
}

.custom-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.custom-modal {
    background: linear-gradient(135deg, #2d3436, #1e272e);
    border-radius: 20px !important;
    padding: 25px;
    color: white;
    border: 2px solid;
    border-image: linear-gradient(45deg, #ff6b6b, #74b9ff, #00b894);
    border-image-slice: 1;
    width: 90% !important;
    max-width: 500px !important;
    text-align: center !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    max-height: 80vh !important;
    align-items: center !important;
    justify-content: center !important;
}

.settings-title {
    text-align: center !important;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: white;
    width: 100%;
    flex-shrink: 0;
}

/* Стилизация скроллбаров для всех контейнеров с контентом */
.settings-content,
.answers-content,
.answers-grid,
.submenu-buttons {
    overflow-y: auto !important;
    max-height: 60vh !important;
    padding: 10px;
    width: 100%;
    scrollbar-width: thin;
    scrollbar-color: #00b894 rgba(255, 255, 255, 0.1);
}

.settings-content::-webkit-scrollbar,
.answers-content::-webkit-scrollbar,
.answers-grid::-webkit-scrollbar,
.submenu-buttons::-webkit-scrollbar {
    width: 8px;
}

.settings-content::-webkit-scrollbar-track,
.answers-content::-webkit-scrollbar-track,
.answers-grid::-webkit-scrollbar-track,
.submenu-buttons::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb,
.answers-content::-webkit-scrollbar-thumb,
.answers-grid::-webkit-scrollbar-thumb,
.submenu-buttons::-webkit-scrollbar-thumb {
    background: #00b894;
    border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb:hover,
.answers-content::-webkit-scrollbar-thumb:hover,
.answers-grid::-webkit-scrollbar-thumb:hover,
.submenu-buttons::-webkit-scrollbar-thumb:hover {
    background: #00d8a7;
}

.position-item {
    margin: 10px 0;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50px !important;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    word-break: break-word;
    width: 100%;
}

.position-item:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(3px);
}

.position-item.selected {
    background: linear-gradient(135deg, #00b894, #00a382);
    border-color: #00b894;
}

.position-divider {
    margin: 20px 0;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-left: 4px solid #00b894;
    color: #00b894;
    font-weight: bold;
    font-size: 16px;
    border-radius: 15px !important;
    text-align: center !important;
    width: 100%;
}

.position-checkbox {
    margin-right: 15px;
    transform: scale(1.2);
}

.category-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: nowrap;
    justify-content: flex-start;
    width: 100%;
    flex-shrink: 0;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: thin;
    scrollbar-color: #00b894 rgba(255, 255, 255, 0.1);
}

.category-tabs::-webkit-scrollbar {
    height: 6px;
}

.category-tabs::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

.category-tabs::-webkit-scrollbar-thumb {
    background: #00b894;
    border-radius: 3px;
}

.category-tabs::-webkit-scrollbar-thumb:hover {
    background: #00d8a7;
}

.category-tab {
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 13px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;
    word-break: break-word;
    flex-shrink: 0;
    white-space: nowrap;
}

.category-tab.active {
    background: linear-gradient(135deg, #00b894, #00a382);
    border-color: #00b894;
}

.category-tab:hover {
    background: rgba(255, 255, 255, 0.2);
}

.answers-grid {
    display: grid;
    gap: 12px;
    max-height: 50vh !important;
    overflow-y: auto !important;
    padding: 10px;
    width: 100%;
}

.submenu-container {
    background: linear-gradient(135deg, #2d3436, #1e272e);
    border-radius: 20px !important;
    padding: 25px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    border: 2px solid;
    border-image: linear-gradient(45deg, #ff6b6b, #74b9ff, #00b894);
    border-image-slice: 1;
    width: 90% !important;
    max-width: 600px !important;
    text-align: center !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    max-height: 80vh !important;
    align-items: center !important;
    justify-content: center !important;
}

.submenu-title {
    text-align: center !important;
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    width: 100%;
    flex-shrink: 0;
}

.submenu-buttons {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    justify-content: center;
    width: 100%;
    overflow-y: auto !important;
    max-height: 60vh !important;
    padding: 10px;
}

.submenu-btn {
    background: linear-gradient(135deg, #34495e, #2c3e50) !important;
    border: 2px solid;
    border-image: linear-gradient(45deg, #ff6b6b, #74b9ff, #00b894);
    border-image-slice: 1;
    color: white !important;
    padding: 12px 18px !important;
    border-radius: 50px !important;
    font-weight: bold !important;
    transition: all 0.3s ease !important;
    text-align: center !important;
    font-size: 14px;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 auto !important;
    word-break: break-word;
    min-height: 50px;
    cursor: pointer !important;
}

.submenu-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
    background: linear-gradient(135deg, #4a69bd, #3c6382) !important;
}

.search-container {
    margin: 15px 0;
    width: 100%;
    text-align: center;
}

#answerSearch {
    width: 90%;
    max-width: 400px;
    padding: 12px 20px;
    border-radius: 25px;
    border: 1px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color: white;
    font-size: 14px;
    outline: none;
    transition: all 0.3s ease;
}

#answerSearch:focus {
    background: rgba(255,255,255,0.2);
    border-color: #00b894;
    box-shadow: 0 0 10px rgba(0,184,148,0.3);
}

#answerSearch::placeholder {
    color: rgba(255,255,255,0.6);
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Стилизация скроллбара для поисковых результатов */
.answers-content {
    overflow-y: auto !important;
    max-height: 50vh !important;
    padding: 10px;
    width: 100%;
}

@media (max-width: 768px) {
    .compact-menu-btn {
        padding: 8px 14px !important;
        font-size: 12px !important;
        min-width: 70px !important;
        height: 36px !important;
    }

    .custom-modal,
    .submenu-container {
        max-width: 95% !important;
        min-width: 280px !important;
        padding: 20px;
    }

    .submenu-buttons {
        grid-template-columns: 1fr !important;
    }

    .category-tab {
        min-width: 80px;
        font-size: 12px;
        padding: 8px 12px;
    }

    .submenu-btn {
        padding: 10px 15px !important;
        min-height: 45px;
    }

    /* Уменьшаем скроллбары на мобильных */
    .settings-content::-webkit-scrollbar,
    .answers-content::-webkit-scrollbar,
    .answers-grid::-webkit-scrollbar,
    .submenu-buttons::-webkit-scrollbar {
        width: 6px;
    }

    .category-tabs::-webkit-scrollbar {
        height: 4px;
    }
}

@media (max-width: 480px) {
    .compact-menu-wrapper {
        flex-wrap: wrap;
        justify-content: center;
    }

    .compact-menu-btn {
        margin: 3px !important;
        font-size: 11px !important;
        min-width: 60px !important;
        height: 34px !important;
    }

    .submenu-btn {
        font-size: 13px !important;
        padding: 8px 12px !important;
        min-height: 40px;
    }

    .submenu-title,
    .settings-title {
        font-size: 18px;
    }

    .category-tab {
        min-width: 70px;
        font-size: 11px;
        padding: 6px 10px;
    }
}`;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  };

  const storage = {
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    get: (key, defaultValue = null) => {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    }
  };

  function init() {
    addStyles();
    setTimeout(createCompactMenu, 1000);
    loadHandlebars();
  }

  function loadHandlebars() {
    if (typeof Handlebars === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js';
      document.body.appendChild(script);
    }
  }

  function createCompactMenu() {
    const menuHTML = `
            <div class="compact-menu-wrapper">
                <button class="compact-menu-btn" id="statusBtn">📊 Статусы</button>
                <button class="compact-menu-btn" id="transferBtn">↗️ Передача</button>
                <button class="compact-menu-btn" id="answersBtn">💬 Ответы</button>
                <button class="compact-menu-btn settings-btn" id="settingsBtn">⚙️</button>
            </div>
        `;

    const $replyButton = $('.button--icon--reply');
    if ($replyButton.length) {
      $replyButton.after(menuHTML);

      $('#statusBtn').click((e) => {
        e.preventDefault();
        e.stopPropagation();
        showStatusMenu();
      });

      $('#transferBtn').click((e) => {
        e.preventDefault();
        e.stopPropagation();
        showTransferMenu();
      });

      $('#answersBtn').click((e) => {
        e.preventDefault();
        e.stopPropagation();
        showAnswersMenu();
      });

      $('#settingsBtn').click((e) => {
        e.preventDefault();
        e.stopPropagation();
        showSettingsMenu();
      });
    }
  }

  function showCustomModal(content) {
    const modalHTML = `
            <div class="custom-overlay">
                <div class="custom-modal">
                    <button class="close-btn">&times;</button>
                    ${content}
                </div>
            </div>
        `;

    $('body').append(modalHTML);

    $('.custom-overlay .close-btn').click(() => {
      $('.custom-overlay').remove();
    });

    $('.custom-overlay').click((e) => {
      if (e.target === $('.custom-overlay')[0]) {
        $('.custom-overlay').remove();
      }
    });
  }

  function showStatusMenu() {
    const statusButtons = [
      { title: 'На рассмотрение', prefix: PREFIXES.PINN, pin: true },
      { title: 'Одобрено', prefix: PREFIXES.ACCEPT, pin: false },
      { title: 'Отказано', prefix: PREFIXES.UNACCEPT, pin: false },
      { title: 'Решено', prefix: PREFIXES.RESHENO, pin: false },
      { title: 'Закрыто', prefix: PREFIXES.CLOSE, pin: false }
    ];

    const markup = `
            <div class="settings-title">📊 Выберите статус</div>
            <div class="settings-content">
                ${statusButtons.map((btn, index) =>
      `<div class="position-item" data-prefix="${btn.prefix}" data-pin="${btn.pin}">
                        ${btn.title}
                    </div>`
    ).join('')}
            </div>
        `;

    showCustomModal(markup);

    setTimeout(() => {
      statusButtons.forEach((btn) => {
        $(`.position-item[data-prefix="${btn.prefix}"]`).click(() => {
          editThreadData(btn.prefix, btn.pin);
          $('.custom-overlay').remove();
        });
      });
    }, 100);
  }

  function showTransferMenu() {
    const transferButtons = [
      { title: 'Команде проекта', prefix: PREFIXES.COMMAND, pin: true },
      { title: 'Специальному администратору', prefix: PREFIXES.SPECY, pin: true },
      { title: 'Главному администратору', prefix: PREFIXES.GA, pin: true },
      { title: 'Тех. специалисту', prefix: PREFIXES.TEXY, pin: true },
    ];

    const markup = `
            <div class="settings-title">↗️ Кому передать?</div>
            <div class="settings-content">
                ${transferButtons.map((btn, index) =>
      `<div class="position-item" data-prefix="${btn.prefix}" data-pin="${btn.pin}">
                        ${btn.title}
                    </div>`
    ).join('')}
            </div>
        `;

    showCustomModal(markup);

    setTimeout(() => {
      transferButtons.forEach((btn) => {
        $(`.position-item[data-prefix="${btn.prefix}"]`).click(() => {
          editThreadData(btn.prefix, btn.pin);
          $('.custom-overlay').remove();
        });
      });
    }, 100);
  }

  function showAnswersMenu() {
    const selectedPosition = storage.get('selected_position', 'Младший Куратор Форума');
    let currentCategory = 'all';
    let searchTerm = '';

    const markup = `
        <div class="settings-title">💬 Быстрые ответы</div>
        <div class="search-container">
            <input type="text" id="answerSearch" placeholder="Поиск ответов..." />
        </div>
        <div class="category-tabs">
            ${ANSWER_CATEGORIES.filter(cat => {
            const hasAccess = cat.access.includes('all') || cat.access.includes(selectedPosition);
            const notExcluded = !cat.exclude || !cat.exclude.includes(selectedPosition);
            return hasAccess && notExcluded;
            }).map(cat => `
                <div class="category-tab ${cat.id === currentCategory ? 'active' : ''}"
                     data-category="${cat.id}">${cat.title}</div>
            `).join('')}
        </div>
        <div class="settings-content" id="answersContent">
            ${renderTemplates(currentCategory, searchTerm, selectedPosition)}
        </div>
        `;

    showCustomModal(markup);

    // Обработчик поиска
    $('#answerSearch').on('input', function () {
      searchTerm = $(this).val();
      $('#answersContent').html(renderTemplates(currentCategory, searchTerm, selectedPosition));
      attachAnswerHandlers();
    });

    // Обработчики категорий
    $('.category-tab').click(function () {
      currentCategory = $(this).data('category');
      $('.category-tab').removeClass('active');
      $(this).addClass('active');
      $('#answersContent').html(renderTemplates(currentCategory, searchTerm, selectedPosition));
      attachAnswerHandlers();
    });

    attachAnswerHandlers();
  }

  function attachAnswerHandlers() {
    $('.position-item[data-content]').off('click').on('click', function () {
      const content = $(this).data('content');
      const threadData = getThreadData();
      const autoPrefixEnabled = storage.get('auto_prefix_enabled', false);
      const templateTitle = $(this).text().trim();
      const template = ANSWER_TEMPLATES.find(t => t.title === templateTitle);

      // Вставляем ответ в любом случае
      pasteContent(content, threadData);

      if (autoPrefixEnabled) {
        // Если авто-префикс включен - отправляем ответ автоматически
        setTimeout(submitReply, 300);

        // И если у шаблона есть префикс - меняем его
        if (template && template.prefix_id !== undefined) {
          setTimeout(() => {
            editThreadData(template.prefix_id, template.pin || false);
          }, 500);
        }
      } else {
        // Если авто-префикс выключен - просто вставляем ответ, но НЕ отправляем
        // Пользователь сам решит когда отправить
      }

      $('.custom-overlay').remove();
    });
  }

    function renderTemplates(category, searchTerm, selectedPosition) {
        const filteredTemplates = ANSWER_TEMPLATES.filter(template => {
            const matchesCategory = category === 'all' || template.category === category;
            const matchesSearch = searchTerm === '' || template.title.toLowerCase().includes(searchTerm.toLowerCase());

            // Проверяем основной доступ
            const matchesPosition = template.positions.includes('all') || template.positions.includes(selectedPosition);

            // Проверяем исключения (если пользователь в исключениях - не показываем)
            const notExcluded = !template.exclude || !template.exclude.includes(selectedPosition);
            return matchesCategory && matchesSearch && matchesPosition && notExcluded;
        });

        if (filteredTemplates.length === 0) {
            return '<div style="text-align: center; color: #ccc; padding: 20px;">Ответы не найдены</div>';
        }

        return filteredTemplates.map(template => `
            <div class="position-item" data-content="${template.content.replace(/"/g, '&quot;')}">
                ${template.title}
            </div>
        `).join('');
    }

  function showSettingsMenu() {
    const selectedPosition = storage.get('selected_position', 'Младший Куратор Форума');
    const autoPrefixEnabled = storage.get('auto_prefix_enabled', false);

    const markup = `
            <div class="settings-title">⚙️ Настройки</div>
            <div class="settings-content">
                ${POSITION_SECTIONS.map(item => {
      if (item.type === 'divider') {
        return `<div class="position-divider">${item.title}</div>`;
      } else {
        return `
                            <div class="position-item ${item.title === selectedPosition ? 'selected' : ''}"
                                 data-position="${item.title}">
                                <input type="radio" name="position" value="${item.title}"
                                       class="position-checkbox" ${item.title === selectedPosition ? 'checked' : ''}>
                                ${item.title}
                            </div>
                        `;
      }
    }).join('')}

                <div class="position-divider">Другие настройки:</div>
                <div class="position-item ${autoPrefixEnabled ? 'selected' : ''}"
                     id="autoPrefixToggle" data-enabled="${autoPrefixEnabled}">
                    <input type="checkbox" id="autoPrefixCheckbox"
                           ${autoPrefixEnabled ? 'checked' : ''}
                           style="margin-right: 15px;">
                    Автоматизация ответа
                </div>
            </div>
        `;

    showCustomModal(markup);

    // Обработчик выбора должности
    $('.position-item[data-position]').click(function () {
      const selectedValue = $(this).data('position');
      storage.set('selected_position', selectedValue);
      $('.position-item[data-position]').removeClass('selected');
      $(this).addClass('selected');
      $('.position-checkbox', this).prop('checked', true);

      showNotification('Должность сохранена: ' + selectedValue);
    });

    // Обработчик переключателя автоматизации
    $('#autoPrefixToggle').click(function (e) {
      if ($(e.target).is('input[type="checkbox"]')) return;

      const currentState = $(this).data('enabled');
      const newState = !currentState;

      $(this).data('enabled', newState);
      $('#autoPrefixCheckbox').prop('checked', newState);
      $(this).toggleClass('selected', newState);

      storage.set('auto_prefix_enabled', newState);

      showNotification(newState ?
        'Автоматическая установка префиксов включена' :
        'Автоматическая установка префиксов выключена');
    });

    // Обработчик клика по чекбоксу
    $('#autoPrefixCheckbox').click(function (e) {
      e.stopPropagation();
      const newState = $(this).prop('checked');

      $('#autoPrefixToggle').data('enabled', newState)
        .toggleClass('selected', newState);

      storage.set('auto_prefix_enabled', newState);

      showNotification(newState ?
        'Автоматическая установка префиксов включена' :
        'Автоматическая установка префиксов выключена');
    });
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: linear-gradient(135deg, #00b894, #00a382);
              color: white;
              padding: 12px 20px;
              border-radius: 50px;
              z-index: 10000;
              font-weight: bold;
              box-shadow: 0 5px 15px rgba(0,0,0,0.3);
              text-align: center;
          `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }

  function pasteContent(content, data = {}) {
    if (typeof Handlebars === 'undefined') {
      let finalContent = content;
      if (data.user) {
        finalContent = finalContent.replace(/{{ user\.name }}/g, data.user.name)
          .replace(/{{ user\.mention }}/g, data.user.mention)
          .replace(/{{ greeting }}/g, data.greeting);
      }
      $('div.fr-element.fr-view p').append(finalContent);
      return;
    }

    const template = Handlebars.compile(content);
    const $editor = $('div.fr-element.fr-view p');

    if ($editor.text() === '') $editor.empty();
    $editor.append(template(data));
  }

  function getThreadData() {
    const $username = $('a.username').first();
    const authorID = $username.data('user-id') || $username.attr('data-user-id');
    const authorName = $username.text();
    const hours = new Date().getHours();

    let greeting;
    if (hours > 4 && hours <= 11) greeting = 'Доброе утро';
    else if (hours > 11 && hours <= 15) greeting = 'Добрый день';
    else if (hours > 15 && hours <= 21) greeting = 'Добрый вечер';
    else greeting = 'Доброй ночи';

    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`
      },
      greeting: greeting
    };
  }

    function editThreadData(prefix, shouldPin = false) {
        const threadTitle = $('.p-title-value').first().contents().last().text();
        const requestUri = document.URL.split(XF.config.url.fullBase)[1];

        const formData = {
            prefix_id: prefix,
            title: threadTitle,
            _xfToken: XF.config.csrf,
            _xfRequestUri: requestUri,
            _xfWithData: 1,
            _xfResponseType: 'json'
        };

        // Добавляем параметр закрепления
        if (shouldPin) {
            formData.sticky = 1;
        }

        // Отправляем запрос и обновляем страницу после успеха
        const firstPageUrl = document.URL.split('/page-')[0];
        fetch(`${firstPageUrl}/edit`, {
            method: 'POST',
            body: createFormData(formData)
        }).then(response => response.json())
            .then(data => {
            if (data.status === 'ok') {
                location.reload();
            }
        })
            .catch(error => console.error('Error:', error));
    }

  function submitReply() {
    // Находим форму ответа и отправляем её
    const $replyForm = $('form[action$="add-reply"]');
    if ($replyForm.length) {
      // Триггерим событие отправки формы
      $replyForm.submit();
    } else {
      // Если формы нет, пытаемся найти кнопку отправки
      const $replyButton = $('button.button--icon--reply');
      if ($replyButton.length) {
        $replyButton.click();
      }
    }
  }

  function createFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  }

  $(document).ready(init);
})();