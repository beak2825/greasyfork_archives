// ==UserScript==
// @name         MAGADAN | ГС / ЗГС ОПГ
// @namespace    AzimutElemental
// @version      3.3
// @description  Быстрые ссылки после «Модер.» + кнопка «Ответы» с шаблонами и автопрефиксами
// @author       Azimut Elemental
// @match        https://forum.blackrussia.online/*
// @run-at       document-end
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550132/MAGADAN%20%7C%20%D0%93%D0%A1%20%20%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93.user.js
// @updateURL https://update.greasyfork.org/scripts/550132/MAGADAN%20%7C%20%D0%93%D0%A1%20%20%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- БЫСТРЫЕ ССЫЛКИ ---
  const LINKS = [
    // старые ссылки на жалобы
    { t: 'Жалобы на Администрацию', h: 'https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3930/' },
    { t: 'Жалобы на Игроков', h: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3932/' },
    { t: 'Жалобы на Лидеров', h: 'https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3931/' },
    { t: 'Обжалование Наказаний', h: 'https://forum.blackrussia.online/forums/Обжалование-наказаний.3933/' },

    // новые твои ссылки
    { t: 'Антиблат БВС', h: 'https://forum.blackrussia.online/threads/magadan-%D0%90%D0%BD%D1%82%D0%B8-%D0%91%D0%BB%D0%B0%D1%82-biz-war-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B0.13304214/page-4#post-55894321' },
    { t: 'Ежедневный Отчет', h: 'https://forum.blackrussia.online/threads/magadan-%D0%95%D0%B6%D0%B5%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%B0%D1%8F-%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.13526450/' },
    { t: 'Неактив', h: 'https://forum.blackrussia.online/threads/magadan-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BD%D0%B5%D0%B0%D0%BA%D1%82%D0%B8%D0%B2.13526454/' },
    { t: 'Доп. Баллы', h: 'https://forum.blackrussia.online/threads/magadan-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%BC%D0%B5%D0%BD-%D0%B1%D0%B0%D0%BB%D0%BB%D0%BE%D0%B2-%D0%B8%D0%B7-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0.13526461/' },
    { t: 'Антиблат СС', h: 'https://forum.blackrussia.online/threads/magadan-%D0%90%D0%BD%D1%82%D0%B8-%D0%91%D0%BB%D0%B0%D1%82-%D0%A1%D1%82%D0%B0%D1%80%D1%88%D0%B5%D0%B3%D0%BE-%D0%A1%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B0-%D0%93%D0%9E%D0%A1%D0%A1-%D0%9E%D0%9F%D0%93.13229820/' },
    { t: 'Снятие Наказания', h: 'https://forum.blackrussia.online/threads/magadan-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D1%81%D0%BD%D1%8F%D1%82%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.12936200/page-2#post-55086937' },

    // добавленные новые
    { t: 'MAGADAN', h: 'https://forum.blackrussia.online/forums/Сервер-№88-magadan.3913/' },
    { t: 'Лидерский Раздел', h: 'https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.3936/' },
    { t: 'Админ-раздел', h: 'https://forum.blackrussia.online/forums/Админ-раздел.3914/' },
    { t: 'Заявление на лидера', h: 'https://forum.blackrussia.online/forums/Лидеры.3945/' }
  ];

  GM_addStyle(`
    .az-nav-item .p-navEl-link { padding: 0 10px; }
    .az-nav-item .p-navEl-text { white-space: nowrap; font-weight: 600; }
    @media (max-width: 768px){
      .az-nav-item .p-navEl-link { padding: 0 8px; }
      .az-nav-item .p-navEl-text { font-weight: 600; }
    }
    .az-reply-btn { margin-left: 10px; }
  `);

  function getNavList() {
    const sels = [
      '.p-nav .p-nav-scroller .p-nav-list',
      '.p-nav .p-nav-list',
      'nav .p-nav-list'
    ];
    for (const sel of sels) {
      const list = document.querySelector(sel);
      if (list) return list;
    }
    return null;
  }

  function findModerLi(navList) {
    if (!navList) return null;
    const items = navList.querySelectorAll('li');
    for (const li of items) {
      const a = li.querySelector('a');
      if (a && (a.textContent || '').trim().includes('Модер')) return li;
    }
    return null;
  }

  function createLi(text, href) {
    const li = document.createElement('li');
    li.className = 'p-navEl az-nav-item';
    const a = document.createElement('a');
    a.className = 'p-navEl-link';
    a.href = href;
    const span = document.createElement('span');
    span.className = 'p-navEl-text';
    span.textContent = text;
    a.appendChild(span);
    li.appendChild(a);
    return li;
  }

  function injectLinks() {
    const navList = getNavList();
    if (!navList || navList.querySelector('.az-nav-item')) return;
    const moderLi = findModerLi(navList);
    let ref = moderLi;
    LINKS.map(l => createLi(l.t, l.h)).forEach(node => {
      if (ref) {
        ref.insertAdjacentElement('afterend', node);
        ref = node;
      } else {
        navList.appendChild(node);
      }
    });
  }

  // --- ШАБЛОНЫ ОТВЕТОВ ---
  const ANSWERS = [
    { text: 'На рассмотрении.\n\nЗдравствуйте!\nНа рассмотрении.', prefix: 'На рассмотрении' },
    { text: 'Закрыто.\n\nДоброй ночи. Извините, но вы ошиблись разделом. Этот раздел предназначен для подачи жалоб на лидеров.\n✦✧ Отказано, Закрыто. ✧✦', prefix: 'Закрыто' },
    { text: 'С лидером будет проведена необходимая работа. Доброго времени суток!', prefix: 'Закрыто' },
    { text: 'Лидер будет наказан. Доброго времени суток!', prefix: 'Закрыто' },
    { text: 'Одобрено.', prefix: 'Одобрено' },
    { text: 'Лидер предоставил доказательства. Отказано.', prefix: 'Отказано' }
  ];

  function injectAnswers() {
    const form = document.querySelector('.message-editor .fr-box');
    if (!form || document.querySelector('.az-reply-btn')) return;

    const toolbar = form.closest('form').querySelector('.formButtonGroup');
    if (!toolbar) return;

    const select = document.createElement('select');
    select.className = 'button az-reply-btn';
    const opt0 = document.createElement('option');
    opt0.textContent = 'Ответы';
    opt0.disabled = true;
    opt0.selected = true;
    select.appendChild(opt0);

    ANSWERS.forEach(a => {
      const opt = document.createElement('option');
      opt.textContent = a.text.split(".\n")[0];
      select.appendChild(opt);
    });

    toolbar.appendChild(select);

    select.addEventListener('change', () => {
      const idx = select.selectedIndex - 1;
      if (idx < 0) return;
      const ans = ANSWERS[idx];
      const textarea = form.closest('form').querySelector('textarea');
      if (textarea) textarea.value = ans.text;

      const prefixSel = document.querySelector('select[name="prefix_id"]');
      if (prefixSel) {
        for (const opt of prefixSel.options) {
          if (opt.textContent.includes(ans.prefix)) {
            opt.selected = true;
            prefixSel.dispatchEvent(new Event('change'));
            break;
          }
        }
      }
    });
  }

  // запуск
  injectLinks();
  injectAnswers();
  new MutationObserver(() => { injectLinks(); injectAnswers(); }).observe(document.body, { childList: true, subtree: true });
})();
