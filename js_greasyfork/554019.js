// ==UserScript==
// @name         Chat: «упомянуть»
// @namespace    https://lolz.live/
// @version      1.2
// @description  Стабильно добавляет пункт «упомянуть» в меню ПКМ/действий сообщения и дописывает @ник в конец ввода
// @match        https://lolz.live/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554019/Chat%3A%20%C2%AB%D1%83%D0%BF%D0%BE%D0%BC%D1%8F%D0%BD%D1%83%D1%82%D1%8C%C2%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/554019/Chat%3A%20%C2%AB%D1%83%D0%BF%D0%BE%D0%BC%D1%8F%D0%BD%D1%83%D1%82%D1%8C%C2%BB.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /** Настройки **/
  const USE_SPACE_AFTER = true;                 // пробел после @ника
  const ICON_VARIANT = 'green';                 // 'green' | 'mirrored' — см. buildIcon()
  const ICON_COLOR  = '#22c55e';                // зелёный для варианта 'green'

  /** Служебные **/
  let lastCtxMsgEl = null;
  let moStarted = false;

  // Запоминать сообщение как можно раньше (и для ПКМ, и для "…" в заголовке)
  window.addEventListener('pointerdown', (e) => {
    if (e.button === 2) {
      const msg = e.target && e.target.closest && e.target.closest('.chat2-message');
      if (msg) lastCtxMsgEl = msg;
    }
  }, true);

  // На случай нативного контекст-меню без pointerdown (редкие случаи)
  document.addEventListener('contextmenu', (e) => {
    const msg = e.target && e.target.closest && e.target.closest('.chat2-message');
    if (msg) lastCtxMsgEl = msg;
    queueMicrotask(ensureForExistingMenus);
  }, true);

  // Включаем наблюдение за появлением меню действий
  startObserver();

  function startObserver() {
    if (moStarted) return;
    moStarted = true;
    const mo = new MutationObserver((list) => {
      for (const m of list) {
        for (const n of m.addedNodes) {
          if (!(n instanceof HTMLElement)) continue;
          // Меню действий сообщения может прилетать как <div.message-actions> или сразу с <ul.menu>
          if (n.matches('.message-actions, .message-actions *') || n.matches('ul.menu')) {
            const ul = n.matches('ul.menu')
              ? n
              : n.querySelector && n.querySelector('.message-actions ul.menu');
            if (ul) ensureMentionItem(ul);
          }
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    // А также обработать уже существующие (если меню было до старта MO)
    ensureForExistingMenus();
  }

  function ensureForExistingMenus() {
    document.querySelectorAll('.message-actions ul.menu').forEach(ensureMentionItem);
  }

  function ensureMentionItem(menu) {
    if (!menu || menu.querySelector('li[data-action="mention"]')) return;

    // Опорный пункт — обычно «Ответить»
    const firstLi = menu.querySelector('li.action, li');
    const li = document.createElement('li');
    li.className = firstLi ? firstLi.className : 'action';
    li.setAttribute('data-action', 'mention');

    // Иконка в стиле .Svg-Icon
    const spanIcon = document.createElement('span');
    spanIcon.className = (firstLi && firstLi.querySelector('.Svg-Icon')?.className) || 'Svg-Icon';
    spanIcon.appendChild(buildIcon(ICON_VARIANT));
    li.appendChild(spanIcon);
    li.append(' упомянуть');

    if (ICON_VARIANT === 'green') {
      li.style.color = ICON_COLOR; // работает, т.к. svg наследует currentColor
    }

    li.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const username = extractUsername(lastCtxMsgEl || li.closest('.chat2-message'));
      appendMention(username);
      closeMenu();
    });

    // Ставим сразу после первого пункта
    if (firstLi && firstLi.parentElement) {
      firstLi.after(li);
    } else {
      menu.appendChild(li);
    }
  }

  /** ИКОНКА: основана на стрелке «Ответить», вариант зелёный или зеркальный */
  function buildIcon(variant = 'green') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');

    // Клон стрелки из «Ответить», но у нас свой элемент → независим от чужих атрибутов.
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d',
      'M20.7914 12.6072C21.0355 12.398 21.1575 12.2933 21.2023 12.1688C21.2415 12.0596 21.2415 11.94 21.2023 11.8308C21.1575 11.7063 21.0355 11.6016 20.7914 11.3924L12.3206 4.13178C11.9004 3.77158 11.6903 3.59148 11.5124 3.58707C11.3578 3.58323 11.2101 3.65115 11.1124 3.77103C11 3.90897 11 4.18571 11 4.73918V9.03444C8.86532 9.40789 6.91159 10.4896 5.45971 12.1137C3.87682 13.8843 3.00123 16.1757 3 18.5508V19.1628C4.04934 17.8987 5.35951 16.8763 6.84076 16.1657C8.1467 15.5392 9.55842 15.1681 11 15.0703V19.2604C11 19.8139 11 20.0906 11.1124 20.2286C11.2101 20.3485 11.3578 20.4164 11.5124 20.4125C11.6903 20.4081 11.9004 20.228 12.3206 19.8678L20.7914 12.6072Z'
    );
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    if (variant === 'mirrored') {
      // Отразим по горизонтали вокруг центра viewBox (12, 12)
      // Трюк: перенесём систему координат, масштабнём по X -1 и вернём назад.
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', 'translate(24,0) scale(-1,1)');
      g.appendChild(path);
      svg.appendChild(g);
    } else {
      svg.appendChild(path); // обычная (цвет берётся из li.style.color)
    }
    return svg;
  }

  /** Вспомогательные: закрытие меню, ник, вставка */
  function closeMenu() {
    // Escape часто хватает; на всякий — синтетический клик по документу
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
    setTimeout(() => document.documentElement.click(), 0);
  }

  function extractUsername(msgEl) {
    if (!msgEl) return '';
    // 1) Ник из заголовка сообщения
    const a = msgEl.querySelector('.chat2-message-username a.username');
    if (a) {
      const t = (a.textContent || a.innerText || '').trim();
      if (t) return t;
    }
    // 2) Фолбэк: data-info (HTML внутри JSON)
    const raw = msgEl.getAttribute('data-info');
    if (raw) {
      try {
        const json = JSON.parse(raw.replace(/&quot;/g, '"'));
        if (json && json.username) {
          const tmp = document.createElement('div');
          tmp.innerHTML = json.username;
          const name = (tmp.textContent || '').trim();
          if (name) return name;
        }
      } catch (_) {}
    }
    // 3) Крайний случай — текст в header
    const header = msgEl.querySelector('.chat2-message-header');
    return ((header && header.textContent) || '').trim();
  }

  function getEditor() {
    return document.querySelector('div.tiptap.ProseMirror[contenteditable="true"]');
  }

  function placeCaretAtEnd(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function appendMention(username) {
    if (!username) return;
    const ed = getEditor();
    if (!ed) return;

    ed.focus();
    placeCaretAtEnd(ed);

    const currentText = ed.innerText || '';
    const needLeadingSpace = currentText.length > 0 && !/\s$/.test(currentText);
    const prefix = needLeadingSpace ? ' ' : '';
    const suffix = USE_SPACE_AFTER ? ' ' : '';
    const text = `${prefix}@${username}${suffix}`;

    const ok = document.execCommand('insertText', false, text);
    if (!ok) ed.appendChild(document.createTextNode(text));
  }
})();