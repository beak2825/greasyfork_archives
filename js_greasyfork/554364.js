// ==UserScript==
// @name         Lolz.live SVG Recolor + underline (global brightness + alpha control)
// @namespace    https://lolz.live/
// @version      4.1
// @description  Всё управляется двумя параметрами: hoverBrightness (яркость) и hoverAlpha (прозрачность). Меняешь числа — адаптируются SVG, текст, фон, подсветка и подфорумы.
// @author       Steppi
// @match        *://lolz.live/*
// @match        *://*.lolz.live/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554364/Lolzlive%20SVG%20Recolor%20%2B%20underline%20%28global%20brightness%20%2B%20alpha%20control%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554364/Lolzlive%20SVG%20Recolor%20%2B%20underline%20%28global%20brightness%20%2B%20alpha%20control%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 🔧 ГЛОБАЛЬНЫЕ НАСТРОЙКИ
  const hoverBrightness = 0.99; // яркость при hover (1.0 = без изменений)
  const hoverAlpha = 0.03;      // прозрачность фона (0.05 = еле видно, 0.15 = ярче)

  const colorMap = {
    '.node4.node .nodeText .nodeTitle a::before':   '#FF2A46',
    '.node8.node .nodeText .nodeTitle a::before':   '#FF9F31',
    '.node85.node .nodeText .nodeTitle a::before':  '#32FF9F',
    '.node86.node .nodeText .nodeTitle a::before':  '#A672FF',
    '.node88.node .nodeText .nodeTitle a::before':  '#FFB42A',
    '.node435.node .nodeText .nodeTitle a::before': '#36C3FF',
    '.node587.node .nodeText .nodeTitle a::before': '#2F90FF'
  };

  window.addEventListener('load', () => {
    setTimeout(() => {
      addStyle(`
        .node .nodeText .nodeTitle,
        .node .nodeText .nodeTitle a,
        .subForumList .nodeTitle a {
          transition: color 0.25s ease, background-color 0.25s ease, border-color 0.25s ease, filter 0.25s ease;
        }
      `);

      for (const [selector, color] of Object.entries(colorMap)) {
        const encoded = encodeURIComponent(color);
        const hoverSel  = selector.replace('::before', ':hover::before');
        const activeSel = selector.replace('.node ', '.node.current ').replace('::before', '::before');
        const textHover = selector.replace('::before', ':hover');
        const textActive = selector.replace('.node ', '.node.current ').replace('::before', '');
        const nodeRoot = selector.match(/\.node\d+\.node/)?.[0];
        const bg = getSvgBackground(selector);
        if (!bg || !nodeRoot) continue;

        const newBg = bg.replace(/%23[0-9A-Fa-f]{3,6}/g, encoded);
        const rgbaHover = hexToRgba(color, hoverAlpha * hoverBrightness);
        const rgbaActive = hexToRgba(color, hoverAlpha + 0.02);

        const css = `
          /* ===== ${nodeRoot} (${color}) ===== */
          ${hoverSel} {
            background-image: ${newBg} !important;
            filter: brightness(${hoverBrightness});
          }

          ${activeSel} {
            background-image: ${newBg} !important;
            filter: brightness(1.05);
          }

          ${textHover} {
            color: ${adjustBrightness(color, hoverBrightness)} !important;
          }

          ${textActive} {
            color: ${color} !important;
          }

          /* hover: подсветка и фон */
          ${nodeRoot} .nodeText .nodeTitle:hover,
          ${nodeRoot} .unread .nodeTitle:hover {
            background-color: ${rgbaHover} !important;
            color: ${adjustBrightness(color, hoverBrightness)} !important;
            border-bottom: 2px solid ${adjustBrightness(color, hoverBrightness)} !important;
          }

          /* active: яркий */
          ${nodeRoot} .nodeTitle.active,
          .nodeList ${nodeRoot}.current > .nodeInfo > .nodeText > .nodeTitle,
          .nodeList ${nodeRoot} .current > div > .nodeTitle {
            background-color: ${rgbaActive} !important;
            color: ${color} !important;
            border-bottom: 2px solid ${color} !important;
          }

          /* подфорумы */
          ${nodeRoot} .subForumList .node .nodeTitle a.menuRow:hover {
            color: ${adjustBrightness(color, hoverBrightness)} !important;
            border-bottom-color: ${adjustBrightness(color, hoverBrightness)} !important;
          }
          ${nodeRoot} .subForumList .node.current .nodeTitle a.menuRow {
            color: ${color} !important;
            border-bottom-color: ${color} !important;
          }

          /* адаптация стандартного #2d2d2d под цвет */
          ${nodeRoot} h3.nodeTitle > a:hover {
            background-color: ${hexToRgba(color, hoverAlpha * hoverBrightness)} !important;
            transition: background-color 0.25s ease;
          }
        `;
        addStyle(css);
      }
    }, 400);
  });

  // ===== вспомогательные функции =====
  function getSvgBackground(selector) {
    const el = document.querySelector(selector.replace('::before', ''));
    if (!el) return null;
    const style = getComputedStyle(el, '::before');
    const bg = style.backgroundImage;
    return (bg && bg.includes('data:image/svg+xml')) ? bg : null;
  }

  function addStyle(css) {
    const s = document.createElement('style');
    s.textContent = css.trim();
    document.head.appendChild(s);
  }

  function hexToRgba(hex, alpha = 1) {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function adjustBrightness(hex, factor = 1) {
    const n = parseInt(hex.replace('#', ''), 16);
    let r = Math.min(255, Math.round(((n >> 16) & 255) * factor));
    let g = Math.min(255, Math.round(((n >> 8) & 255) * factor));
    let b = Math.min(255, Math.round((n & 255) * factor));
    return `rgb(${r}, ${g}, ${b})`;
  }
})();
