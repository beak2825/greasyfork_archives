// ==UserScript==
// @name         MonopolyOne — авто-масштаб поля + панели снизу
// @namespace    alex.helper
// @version      4.4
// @description  Растягивает игру по ширине без пустоты справа (сохраняя верхнее выравнивание) и держит два окна снизу
// @match        https://monopoly-one.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549906/MonopolyOne%20%E2%80%94%20%D0%B0%D0%B2%D1%82%D0%BE-%D0%BC%D0%B0%D1%81%D1%88%D1%82%D0%B0%D0%B1%20%D0%BF%D0%BE%D0%BB%D1%8F%20%2B%20%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D0%B8%20%D1%81%D0%BD%D0%B8%D0%B7%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/549906/MonopolyOne%20%E2%80%94%20%D0%B0%D0%B2%D1%82%D0%BE-%D0%BC%D0%B0%D1%81%D1%88%D1%82%D0%B0%D0%B1%20%D0%BF%D0%BE%D0%BB%D1%8F%20%2B%20%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D0%B8%20%D1%81%D0%BD%D0%B8%D0%B7%D1%83.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SEL = {
    wrapper: 'body > div.wrapper',
    table:   'body > div.wrapper > div._shakehack.table',
    board:   'body > div.wrapper > div._shakehack.table > div.table-body',
    stats:   'body > div.wrapper > div._shakehack.table > div.table-body > div.table-body-stats',
  };

  // Настройки
  const GAP_UNDER_BOARD =50;     // отступ между полем и панелями
  const PANELS_GAP = 125;          // расстояние между двумя панелями
  const PANELS_HEIGHT_GUESS = 180;// примерная высота блоков снизу (подгоняем при желании)
  const SIDE_PADDING = 0;         // запас по краям, если нужно (px)

  function waitFor(selector, timeout = 20000) {
    return new Promise((resolve, reject) => {
      const hit = document.querySelector(selector);
      if (hit) return resolve(hit);
      const mo = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) { mo.disconnect(); resolve(el); }
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => { mo.disconnect(); reject(new Error('Timeout: ' + selector)); }, timeout);
    });
  }

  function injectCSS() {
    if (document.getElementById('alex-styles-v44')) return;
    const st = document.createElement('style');
    st.id = 'alex-styles-v44';
    st.textContent = `
      /* прижимаем игру в левый верх, ничего не клипуем */
      body > div.wrapper {
        display: flex !important;
        justify-content: flex-start !important;
        align-items: flex-start !important;
        overflow: visible !important;
      }

      /* поле занимает всю таблицу, без внутренних отступов */
      body > div.wrapper > div._shakehack.table > div.table-body {
        position: absolute !important;
        inset: 0 !important;
        margin: 0 !important;
        transform: none !important;
      }
      /* наш ряд снизу остаётся абсолютом внутри таблицы */
      .alex-stats-abs {
        position: absolute !important;
        left: 0; top: 0; width: 0;
        display: flex !important;
        flex-direction: row !important;
        align-items: stretch !important;
        gap: ${PANELS_GAP}px !important;
        z-index: 10000 !important;
        overflow: visible !important;
        pointer-events: auto !important;
      }
      /* урать пустой разделитель между панелями */
      .table-body-stats.alex-stats-abs > .spacer { display: none !important;
      }


/* пусть большой блок реально может растягиваться */
.table-body-stats.alex-stats-abs > .TablePool-content{
  flex: 1 1 0 !important;
  min-width: 0 !important;           /* убирает скрытое ограничение ширины */
}

/* сам список значков — на всю ширину, переносим на новые строки */
.table-body-stats.alex-stats-abs > .TablePool-content > .pool-items{
  display: flex !important;
  flex-wrap: wrap !important;        /* ключ: перенос вместо скролла */
  align-items: center !important;
  justify-content: flex-start !important;
  column-gap: 6px !important;
  row-gap: 6px !important;
  width: 100% !important;
  overflow: visible !important;      /* убираем скролы */
  grid-template: none !important;    /* на всякий случай выключаем grid */
  grid-auto-flow: initial !important;
}

/* каждый значок — по своей ширине, не растягивать */
.table-body-stats.alex-stats-abs > .TablePool-content > .pool-items > .pool-item{
  flex: 0 0 auto !important;
  white-space: nowrap;
}




    `;
    document.head.appendChild(st);
  }

  const els = { wrapper:null, table:null, board:null, stats:null };

  // Основное: подобрать масштаб, чтобы поле заполнило ширину, но не вылезло по высоте
  function autoscaleTable() {
    if (!els.wrapper || !els.table || !els.board) return;

    // БАЗОВЫЕ (немасштабные) размеры доски
    // offsetWidth/Height НЕ учитывают transform
    const baseW = els.board.offsetWidth || 1;
    const baseH = els.board.offsetHeight || 1;

    // Доступное пространство
    const vw = els.wrapper.clientWidth  - SIDE_PADDING * 2;
    const vh = els.wrapper.clientHeight - (PANELS_HEIGHT_GUESS + GAP_UNDER_BOARD) - 4; // небольшой запас снизу

    // Подобрать масштаб: чтобы влезло и по ширине, и по высоте
    const sW = vw / baseW;
    const sH = vh / baseH;
    const scale = Math.max(0.1, Math.min(sW, sH)); // безопасный минимум

    // Применить
    els.table.style.transformOrigin = 'top left';
    els.table.style.transform = `scale(${scale})`;
  }

  // Поставить нижние панели точно под доску
  function layoutPanels() {
    if (!els.table || !els.board || !els.stats) return;

    const rTable = els.table.getBoundingClientRect();
    const rBoard = els.board.getBoundingClientRect();

    const left  = rBoard.left - rTable.left;
    const top   = (rBoard.bottom - rTable.top) + GAP_UNDER_BOARD;
    const width = rBoard.width;

    Object.assign(els.stats.style, {
      left:  left + 'px',
      top:   top  + 'px',
      width: width + 'px',
      transform: 'none',
      margin: '0'
    });

    // убедимся, что класс не слетает
    if (!els.stats.classList.contains('alex-stats-abs')) {
      els.stats.classList.add('alex-stats-abs');
    }
  }

  function relayoutAll() {
    autoscaleTable();
    layoutPanels();
  }

  function armObservers() {
    const mo = new MutationObserver(() => {
      // если движок игры снова повесил свой transform — перезапишем нашим scale
      relayoutAll();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', relayoutAll);
    window.addEventListener('orientationchange', relayoutAll);
    setInterval(relayoutAll, 700);
  }

  async function init() {
    injectCSS();

    const [wrapper, table, board, stats] = await Promise.all([
      waitFor(SEL.wrapper),
      waitFor(SEL.table),
      waitFor(SEL.board),
      waitFor(SEL.stats),
    ]);

    els.wrapper = wrapper;
    els.table   = table;
    els.board   = board;
    els.stats   = stats;

    // помечаем stats один раз (детей не трогаем)
    els.stats.classList.add('alex-stats-abs');

    relayoutAll();
    armObservers();
  }

  init();
})();
