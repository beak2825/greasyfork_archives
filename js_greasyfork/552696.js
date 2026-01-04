// ==UserScript==
// @name         HTML Academy Demo Panel Height Setter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Изменение высоты .demo-panel__content в DEMO-уроках HTML Academy.
// @author       @IMeetSpace
// @match        https://up.htmlacademy.ru/*
// @icon         https://assets.htmlacademy.ru/img/logo--small.svg?cs=1218aec0be4a5f23db79ad29a14e30f7f9fb9a25
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552696/HTML%20Academy%20Demo%20Panel%20Height%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/552696/HTML%20Academy%20Demo%20Panel%20Height%20Setter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MIN_HEIGHT = 100; // px — минимальный предел
  const MAX_HEIGHT_VH = 50; // % от высоты окна — динамический верхний предел
  const HANDLE_THICKNESS = 8; // px — визуальная/зона захвата

  const css = `
  .tm-top-resize-handle {
    position: absolute;
    left: 0; right: 0; top: 0;
    height: ${HANDLE_THICKNESS}px;
    cursor: ns-resize;
    z-index: 1000;
    background: rgba(0,0,0,0.03);
    touch-action: none; /* чтобы тач-жесты не скроллили */
  }
  .tm-top-resize-handle:hover { background: rgba(0,0,0,0.08); }
  .tm-resizing * {
    cursor: ns-resize !important;
    user-select: none !important;
  }`;
  if (typeof GM_addStyle === 'function') GM_addStyle(css);
  else {
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  const STORAGE_KEY = `tm:demoPanelMaxHeight`;

  const save = (val) => {
    try { GM_setValue(STORAGE_KEY, val); }
    catch { localStorage.setItem(STORAGE_KEY, String(val)); }
  };
  const load = () => {
    try {
      const v = GM_getValue(STORAGE_KEY, null);
      return v == null ? null : Number(v);
    } catch {
      const v = localStorage.getItem(STORAGE_KEY);
      return v == null ? null : Number(v);
    }
  };

  waitForElement('.demo-panel__content', init);

  function waitForElement(selector, cb, root = document) {
    const el = root.querySelector(selector);
    if (el) return cb(el);
    const mo = new MutationObserver(() => {
      const e2 = root.querySelector(selector);
      if (e2) {
        mo.disconnect();
        cb(e2);
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function init(content) {
    // Подготовка контейнера: абсолютное позиционирование ручки внутри и отсутствие конфликтов с height
    const cs = getComputedStyle(content);
    if (cs.position === 'static') content.style.position = 'relative';
    content.style.height = '';
    if (!content.style.overflow) content.style.overflow = 'auto';

    // Восстановим сохранённый max-height
    const saved = load();
    if (Number.isFinite(saved) && saved > 0) {
      content.style.maxHeight = `${saved}px`;
      content.style.height = `${saved}px`;
    }

    // Создаём линию для захвата
    if (!content.querySelector('.tm-top-resize-handle')) {
      const handle = document.createElement('div');
      handle.className = 'tm-top-resize-handle';
      content.prepend(handle);

      // --- Логика перетаскивания ---
      let startY = 0;
      let startH = 0;
      let activePointerId = null;
      const maxHpx = () => Math.round(window.innerHeight * (MAX_HEIGHT_VH / 100));

      const onPointerMove = (e) => {
        if (!e.isPrimary || e.pointerId !== activePointerId) return;
        const dy = e.clientY - startY;               // вверх = отрицательно
        const newMax = clamp(startH - dy, MIN_HEIGHT, maxHpx());
        content.style.maxHeight = `${newMax}px`;
        content.style.height = `${newMax}px`;
      };

      const finish = () => {
        try { if (activePointerId != null) handle.releasePointerCapture(activePointerId); } catch {}
        window.removeEventListener('pointermove', onPointerMove, true);
        window.removeEventListener('pointerup', onPointerUp, true);
        window.removeEventListener('pointercancel', onPointerCancel, true);
        document.body.classList.remove('tm-resizing');
        activePointerId = null;

        const mh = parseFloat(getComputedStyle(content).maxHeight);
        if (Number.isFinite(mh)) save(Math.round(mh));
      };

      const onPointerUp = (e) => {
        if (!e.isPrimary || e.pointerId !== activePointerId) return;
        finish();
      };

      const onPointerCancel = () => finish();

      handle.addEventListener('pointerdown', (e) => {
        // Основной указатель + левая кнопка (для мыши)
        if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
        e.preventDefault();
        e.stopPropagation();

        activePointerId = e.pointerId;
        try { handle.setPointerCapture(activePointerId); } catch {}

        startY = e.clientY;
        startH = content.getBoundingClientRect().height;

        window.addEventListener('pointermove', onPointerMove, true);
        window.addEventListener('pointerup', onPointerUp, true);
        window.addEventListener('pointercancel', onPointerCancel, true);
        document.body.classList.add('tm-resizing');
      });

      // Двойной клик — снять ограничение
      handle.addEventListener('dblclick', (e) => {
        e.preventDefault();
        content.style.maxHeight = '';
        content.style.height = '';
        save(0);
      });

      // Поджимаем сохранённый предел при ресайзе окна
      window.addEventListener('resize', () => {
        const mh = parseFloat(getComputedStyle(content).maxHeight);
        if (Number.isFinite(mh) && mh > maxHpx()) {
          const clamped = clamp(mh, MIN_HEIGHT, maxHpx());
          content.style.maxHeight = `${clamped}px`;
          content.style.height = `${clamped}px`;
          save(Math.round(clamped));
        }
      }, { passive: true });
    }
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
})();