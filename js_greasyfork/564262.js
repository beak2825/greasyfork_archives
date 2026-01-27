// ==UserScript==
// @name         Student Helper Style Messages
// @namespace    https://github.com/AbrikosV/StudentHelperStyle
// @version      0.0.2
// @description  Улучшенный UI страницы сообщений (входящие/исходящие)
// @author       AbrikosV
// @match        https://system.fgoupsk.ru/student/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564262/Student%20Helper%20Style%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/564262/Student%20Helper%20Style%20Messages.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const mode = params.get('mode');
  const act = params.get('act');

  // работаем только на страницах сообщений
  if (mode !== 'messages' || !['l', 'to', 'from'].includes(act)) return;

  const table = document.querySelector('section table.table');
  if (!table) return;

  const container = document.querySelector('.container');
  const navbar = document.querySelector('.navbar');

  // --- Базовый layout (как у мессенджера) ---

  document.body.classList.add('sh-messenger-body');

  // контейнер под контентом (navbar оставляем как есть)
  const shell = document.createElement('div');
  shell.className = 'sh-messenger-shell';

  // левая колонка – список диалогов (отправитель + дата)
  const left = document.createElement('div');
  left.className = 'sh-messenger-left';

  // правая колонка – превью сообщения (пока одно, как «выбранное»)
  const right = document.createElement('div');
  right.className = 'sh-messenger-right';

  // заголовок страницы
  const header = document.createElement('div');
  header.className = 'sh-messenger-header';
  header.textContent = act === 'from' ? 'Отправленные сообщения' : 'Входящие сообщения';

  // блок поиска
  const search = document.createElement('div');
  search.className = 'sh-messenger-search';
  search.innerHTML = `
    <input type="text" placeholder="Поиск по сообщениям…" class="sh-messenger-search-input" />
  `;

  // контейнер для списка
  const list = document.createElement('div');
  list.className = 'sh-messenger-list';

  left.appendChild(header);
  left.appendChild(search);
  left.appendChild(list);

  // правая часть – заголовок и тело письма
  right.innerHTML = `
    <div class="sh-messenger-conversation-header">
      <div class="sh-messenger-conversation-title">Выберите сообщение</div>
      <div class="sh-messenger-conversation-meta"></div>
    </div>
    <div class="sh-messenger-conversation-body">
      <div class="sh-messenger-placeholder">
        Сообщение будет отображаться здесь.
      </div>
    </div>
  `;

  shell.appendChild(left);
  shell.appendChild(right);

  // вставляем shell вместо таблицы (navbar остаётся)
  table.parentNode.replaceChild(shell, table);

  // --- Преобразование строк таблицы в элементы списка ---

  const rows = Array.from(table.querySelectorAll('tbody > tr'));

  const items = rows.map((tr) => {
    const [authorCell, messageCell] = tr.children;

    const author = authorCell.querySelector('b')?.textContent.trim() || '';
    const datetime = authorCell.textContent.replace(author, '').trim();
    const deleteLink = messageCell.querySelector('a.close');
    const messageLink = messageCell.querySelector('a:not(.close)');
    const subject = messageLink ? messageLink.textContent.trim() : '';

    const item = document.createElement('div');
    item.className = 'sh-messenger-item';
    item.innerHTML = `
      <div class="sh-messenger-item-avatar">${author[0] || '?'}</div>
      <div class="sh-messenger-item-main">
        <div class="sh-messenger-item-top">
          <span class="sh-messenger-item-author">${author}</span>
          <span class="sh-messenger-item-date">${datetime}</span>
        </div>
        <div class="sh-messenger-item-subject">${subject || '(без темы)'}</div>
      </div>
      <button class="sh-messenger-item-delete" title="Удалить">&times;</button>
    `;

    // переход по сообщению в правую панель
    item.addEventListener('click', (e) => {
      if ((e.target).classList.contains('sh-messenger-item-delete')) return;
      selectItem(item, { author, datetime, subject, href: messageLink?.href || '#' });
    });

    // удаление
    item.querySelector('.sh-messenger-item-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      if (!deleteLink) return;
      if (confirm('Удалить сообщение?')) {
        location.href = deleteLink.href;
      }
    });

    list.appendChild(item);

    return { item, author, datetime, subject, href: messageLink?.href };
  });

  // автовыбор первого
  if (items[0]) {
    selectItem(items[0].item, items[0]);
  }

  // --- Поиск по списку ---

  const searchInput = search.querySelector('.sh-messenger-search-input');
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    items.forEach(({ item, author, subject }) => {
      const text = `${author} ${subject}`.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
  });

  // --- Функция выбора сообщения ---

  function selectItem(domItem, meta) {
    list.querySelectorAll('.sh-messenger-item--active')
      .forEach((el) => el.classList.remove('sh-messenger-item--active'));
    domItem.classList.add('sh-messenger-item--active');

    const titleEl = right.querySelector('.sh-messenger-conversation-title');
    const metaEl = right.querySelector('.sh-messenger-conversation-meta');
    const bodyEl = right.querySelector('.sh-messenger-conversation-body');

    titleEl.textContent = meta.author;
    metaEl.textContent = meta.datetime;

    // грузим текст письма в iframe, чтобы не ломать страницу
    bodyEl.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.className = 'sh-messenger-iframe';
    iframe.src = meta.href;
    bodyEl.appendChild(iframe);
  }

  // --- Стили ---

  const style = document.createElement('style');
  style.textContent = `
    .sh-messenger-body {
      background: #0f172a;
      color: #e5e7eb;
    }

    .sh-messenger-shell {
      display: flex;
      height: calc(100vh - 70px); /* примерно высота navbar */
      margin-top: 10px;
      background: #020617;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 45px rgba(0,0,0,0.45);
    }

    .sh-messenger-left {
      width: 320px;
      min-width: 280px;
      border-right: 1px solid rgba(148,163,184,0.3);
      display: flex;
      flex-direction: column;
      background: #020617;
    }

    .sh-messenger-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: radial-gradient(circle at top, #1d4ed8 0, #020617 55%);
    }

    .sh-messenger-header {
      padding: 16px 18px 8px;
      font-weight: 600;
      font-size: 16px;
      color: #f9fafb;
    }

    .sh-messenger-search {
      padding: 0 16px 12px;
    }

    .sh-messenger-search-input {
      width: 100%;
      border-radius: 999px;
      border: none;
      padding: 8px 14px;
      font-size: 13px;
      background: #020617;
      color: #e5e7eb;
      box-shadow: inset 0 0 0 1px rgba(148,163,184,0.4);
    }
    .sh-messenger-search-input:focus {
      outline: none;
      box-shadow: 0 0 0 1px #3b82f6;
    }

    .sh-messenger-list {
      flex: 1;
      overflow-y: auto;
      padding: 4px 8px 8px;
    }

    .sh-messenger-item {
      display: flex;
      align-items: center;
      padding: 8px 10px;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
      color: #e5e7eb;
      margin: 2px 0;
    }
    .sh-messenger-item:hover {
      background: rgba(30,64,175,0.45);
      transform: translateY(-1px);
    }
    .sh-messenger-item--active {
      background: rgba(59,130,246,0.8);
    }

    .sh-messenger-item-avatar {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background: linear-gradient(135deg, #22c55e, #14b8a6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      margin-right: 10px;
      color: #0f172a;
    }

    .sh-messenger-item-main {
      flex: 1;
      min-width: 0;
    }

    .sh-messenger-item-top {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 2px;
    }
    .sh-messenger-item-author {
      font-weight: 600;
      color: #f9fafb;
    }
    .sh-messenger-item-date {
      color: #9ca3af;
      margin-left: 8px;
      white-space: nowrap;
    }

    .sh-messenger-item-subject {
      font-size: 12px;
      color: #cbd5f5;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sh-messenger-item-delete {
      border: none;
      background: transparent;
      color: #9ca3af;
      font-size: 16px;
      margin-left: 8px;
      padding: 0 4px;
      cursor: pointer;
    }
    .sh-messenger-item-delete:hover {
      color: #f87171;
    }

    .sh-messenger-conversation-header {
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(90deg, rgba(15,23,42,0.95), rgba(37,99,235,0.85));
      box-shadow: 0 1px 0 rgba(15,23,42,0.75);
      z-index: 1;
    }

    .sh-messenger-conversation-title {
      font-size: 15px;
      font-weight: 600;
      color: #f9fafb;
    }

    .sh-messenger-conversation-meta {
      font-size: 12px;
      color: #e5e7eb;
    }

    .sh-messenger-conversation-body {
      flex: 1;
      padding: 12px 16px 16px;
      overflow: hidden;
      position: relative;
    }

    .sh-messenger-placeholder {
      margin-top: 40px;
      text-align: center;
      color: #cbd5e1;
      font-size: 13px;
    }

    .sh-messenger-iframe {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      border: none;
      background: #020617;
      box-shadow: 0 0 0 1px rgba(15,23,42,0.9);
    }

    /* фикс контейнера bootstrap, чтобы растянуться на высоту */
    .container {
      max-width: 1200px;
    }
  `;
  document.head.appendChild(style);
})();
