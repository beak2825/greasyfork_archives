// ==UserScript==
// @name         Shikimori Activity Heatmap GitHub-like (Fixed Alignment)
// @namespace    shiki-heatmap-improved-align
// @version      2.2
// @description  GitHub-style activity heatmap with perfect month alignment
// @author       You + Grok fixes
// @match        https://shikimori.one/*
// @match        https://shikimori.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564112/Shikimori%20Activity%20Heatmap%20GitHub-like%20%28Fixed%20Alignment%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564112/Shikimori%20Activity%20Heatmap%20GitHub-like%20%28Fixed%20Alignment%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const activityBlock = document.querySelector('#profiles_show .activity');
  if (!activityBlock) return;

  const graphs = activityBlock.querySelectorAll('.graph.bar.simple.vertical');
  if (graphs.length === 0) return;

  const graph = graphs[0];
  const lines = [...graph.querySelectorAll('.line')];
  if (lines.length < 4) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'gh-wrapper';

  const monthsRow = document.createElement('div');
  monthsRow.className = 'gh-months';

  const heatmap = document.createElement('div');
  heatmap.className = 'gh-heatmap';

  let prevMonth = null;

  lines.forEach((line) => {
    const bar = line.querySelector('.bar');
    if (!bar) return;

    const title = bar.getAttribute('title') || '';
    const hours = parseInt(title.match(/\d+/)?.[0] || '0', 10);

    // Месяц
    const labelEl = line.querySelector('.x_label');
    let monthLabel = labelEl?.textContent?.trim() || '';

    // Добавляем подпись месяца только при смене
    if (monthLabel && monthLabel !== prevMonth) {
      const m = document.createElement('div');
      m.className = 'gh-month';
      m.textContent = monthLabel;
      monthsRow.appendChild(m);
      prevMonth = monthLabel;
    } else {
      // Пустая ячейка для выравнивания (обязательно!)
      const empty = document.createElement('div');
      empty.className = 'gh-month empty';
      monthsRow.appendChild(empty);
    }

    // Колонка недели
    const col = document.createElement('div');
    col.className = 'gh-col';
    col.title = title || `${hours} часов`;

    let level = 0;
    if (hours > 0) {
      if      (hours >= 35) level = 4;
      else if (hours >= 20) level = 3;
      else if (hours >= 10) level = 2;
      else                  level = 1;
    }

    for (let day = 0; day < 7; day++) {
      const sq = document.createElement('div');
      sq.className = `gh-sq l${level}`;
      col.appendChild(sq);
    }

    heatmap.appendChild(col);
  });

  wrapper.appendChild(monthsRow);
  wrapper.appendChild(heatmap);

  graph.parentNode.insertBefore(wrapper, graph);

  // Скрываем второй график
  if (graphs[1]) graphs[1].style.display = 'none';

  // Стили (обновлённые для идеального выравнивания)
  const style = document.createElement('style');
  style.textContent = `
    .gh-wrapper {
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      margin: 20px 0;
      padding: 16px;
      background: rgba(15,17,22,0.7);
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .gh-months {
      display: flex;
      flex-wrap: nowrap;
      gap: 4px;
      margin-bottom: 8px;
      font-size: 11px;
      color: #8b98a8;
      min-width: fit-content;
    }

    .gh-month {
      flex: 0 0 11px;
      width: 11px;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .gh-month:not(.empty) {
      font-weight: 500;
    }

    .gh-month:last-child {
      color: #58a6ff;
      font-weight: 600;
    }

    .gh-heatmap {
      display: flex;
      flex-wrap: nowrap;
      gap: 4px;
      min-height: 84px;
    }

    .gh-col {
      flex: 0 0 11px;
      width: 11px;
      display: flex;
      flex-direction: column-reverse;
      gap: 4px;
      cursor: pointer;
      position: relative;
    }

    .gh-sq {
      width: 11px;
      height: 11px;
      border-radius: 3px;
      background: #161b22;
      border: 1px solid rgba(255,255,255,0.04);
      transition: transform 0.12s ease;
    }

    .gh-col:hover .gh-sq {
      transform: scale(1.45);
      z-index: 2;
    }

    .gh-sq.l1 { background: #0e4429; }
    .gh-sq.l2 { background: #006d32; }
    .gh-sq.l3 { background: #26a641; }
    .gh-sq.l4 { background: #39d353; }

    .gh-col[title]:hover::after {
      content: attr(title);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #0d1117;
      color: #e6edf3;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 10;
      border: 1px solid #30363d;
      pointer-events: none;
      margin-bottom: 6px;
    }
  `;

  document.head.appendChild(style);
})();