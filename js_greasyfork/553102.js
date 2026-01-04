// ==UserScript==
// @name         NotebookLM → Export to Obsidian Canvas (Auto Title)
// @namespace    notebooklm
// @version      1.1
// @description  Добавляет кнопку для экспорта mind map в формат Obsidian Canvas (.canvas) и называет файл по названию карты из NotebookLM
// @author       You
// @match        *://*notebooklm.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553102/NotebookLM%20%E2%86%92%20Export%20to%20Obsidian%20Canvas%20%28Auto%20Title%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553102/NotebookLM%20%E2%86%92%20Export%20to%20Obsidian%20Canvas%20%28Auto%20Title%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function addExportButton() {
    if (document.getElementById('obsidianExportBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'obsidianExportBtn';
    btn.textContent = '💾 Скачать для Obsidian';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 9999,
      padding: '10px 16px',
      background: '#4a90e2',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
    });
    btn.onmouseenter = () => btn.style.background = '#357ad8';
    btn.onmouseleave = () => btn.style.background = '#4a90e2';

    btn.addEventListener('click', exportToObsidian);
    document.body.appendChild(btn);
  }

  function waitForMindmap() {
    if (document.querySelector('g.node')) {
      addExportButton();
    } else {
      setTimeout(waitForMindmap, 1500);
    }
  }

  function exportToObsidian() {
    (() => {
      // ======= НАСТРОЙКИ =======
      const NODE_SELECTOR = 'g.node';
      const TEXT_SELECTOR = 'text.node-name';
      const RECT_SELECTOR = 'rect';
      const PATH_SELECTOR = 'path';
      const LINE_SELECTOR = 'line';
      const SAMPLES = 60;
      const TOL = 40; // чувствительность связей (px)
      // =========================

      const float = s => parseFloat(s || 0);
      const parseTranslate = tr => {
        const m = tr && tr.match(/translate\(\s*([-\d.]+)[,\s]+([-\d.]+)\s*\)/);
        return m ? { x: +m[1], y: +m[2] } : { x: 0, y: 0 };
      };
      const pointToRectDist = (px, py, n) => {
        const dx = Math.max(n.left - px, 0, px - n.right);
        const dy = Math.max(n.top - py, 0, py - n.bottom);
        return Math.sqrt(dx * dx + dy * dy);
      };

      // === 1. Узлы ===
      const nodes = [];
      document.querySelectorAll(NODE_SELECTOR).forEach((g, i) => {
        const { x: tx, y: ty } = parseTranslate(g.getAttribute('transform'));
        const rect = g.querySelector(RECT_SELECTOR);
        if (!rect) return;
        const rx = float(rect.getAttribute('x'));
        const ry = float(rect.getAttribute('y'));
        const w = float(rect.getAttribute('width'));
        const h = float(rect.getAttribute('height'));
        const left = tx + rx;
        const top = ty + ry;
        const right = left + w;
        const bottom = top + h;
        const text = g.querySelector(TEXT_SELECTOR)?.textContent.trim() || '';
        nodes.push({
          id: g.id || `n${i}`,
          left, right, top, bottom,
          x: tx, y: ty, width: w, height: h,
          text
        });
      });

      // === 2. Связи ===
      const paths = [...document.querySelectorAll(PATH_SELECTOR), ...document.querySelectorAll(LINE_SELECTOR)];
      const edges = [];

      paths.forEach(path => {
        let points = [];
        try {
          const len = path.getTotalLength();
          for (let i = 0; i <= SAMPLES; i++) {
            const p = path.getPointAtLength((len * i) / SAMPLES);
            points.push({ x: p.x, y: p.y });
          }
        } catch {
          const nums = (path.getAttribute('d') || '').match(/[-+]?\d*\.?\d+/g);
          if (nums && nums.length >= 4) {
            points = [
              { x: +nums[0], y: +nums[1] },
              { x: +nums[nums.length - 2], y: +nums[nums.length - 1] }
            ];
          }
        }
        if (!points.length) return;

        const start = points[0];
        const end = points[points.length - 1];
        let from = null, to = null, minF = 1e9, minT = 1e9;

        for (const n of nodes) {
          const df = pointToRectDist(start.x, start.y, n);
          const dt = pointToRectDist(end.x, end.y, n);
          if (df < minF) { minF = df; from = n; }
          if (dt < minT) { minT = dt; to = n; }
        }
        if (from && to && from !== to && minF < TOL && minT < TOL) {
          edges.push({ fromNode: from.id, toNode: to.id });
        }
      });

      // === 3. Подготовка к Obsidian Canvas ===
      const minX = Math.min(...nodes.map(n => n.left));
      const minY = Math.min(...nodes.map(n => n.top));

      const canvasNodes = nodes.map(n => ({
        id: n.id,
        x: Math.round((n.left - minX) * 1.2),
        y: Math.round((n.top - minY) * 1.2),
        width: Math.round(n.width + 20),
        height: Math.round(n.height + 20),
        type: "text",
        text: n.text
      }));

      const canvasEdges = edges.map(e => ({
        id: `${e.fromNode}-${e.toNode}`,
        fromNode: e.fromNode,
        toNode: e.toNode
      }));

      const canvasData = { nodes: canvasNodes, edges: canvasEdges };

      // === 4. Название карты ===
      const titleEl = document.querySelector('.mindmap-title');
      let filename = 'mindmap.canvas';
      if (titleEl) {
        let title = titleEl.textContent.trim();
        title = title.replace(/[\\/:*?"<>|]+/g, ''); // очистка от недопустимых символов
        filename = `${title}.canvas`;
      }

      // === 5. Скачивание ===
      const blob = new Blob([JSON.stringify(canvasData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      console.log(`✅ Готово! Файл сохранён как: ${filename}`);
      console.log(canvasData);
      window.mm_canvas = canvasData;
    })();
  }

  waitForMindmap();
})();
