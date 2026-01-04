// ==UserScript==
  // @name         Canvas Exporter
  // @version      1.0
  // @description  Export the Canvas from the webpage as a PNG image
  // @author       zsoat
  // @match        https://www.gaoding.com/
  // @grant        none
  // @license MIT
// @namespace https://greasyfork.org/users/1293581
// @downloadURL https://update.greasyfork.org/scripts/559789/Canvas%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/559789/Canvas%20Exporter.meta.js
  // ==/UserScript==

  (function() {
      'use strict';

      // 配置
      const CANVAS_SELECTOR = '.infinite-canvas';
      const FILENAME = 'canvas-export.png';

      // 创建导出按钮
      const btn = document.createElement('button');
      btn.textContent = '📷 导出 Canvas';
      btn.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 999999;
          padding: 8px 16px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      `;

      btn.addEventListener('mouseenter', () => {
          btn.style.background = '#45a049';
      });

      btn.addEventListener('mouseleave', () => {
          btn.style.background = '#4CAF50';
      });

      btn.addEventListener('click', () => {
          exportCanvas();
      });

      document.body.appendChild(btn);

      function exportCanvas() {
          const canvas = document.querySelector(CANVAS_SELECTOR);

          if (!canvas) {
              alert('未找到 Canvas 元素: ' + CANVAS_SELECTOR);
              return;
          }

          btn.textContent = '⏳ 导出中...';
          btn.disabled = true;

          requestAnimationFrame(() => {
              try {
                  const dataUrl = canvas.toDataURL('image/png');
                  const link = document.createElement('a');
                  link.download = FILENAME;
                  link.href = dataUrl;
                  link.click();

                  btn.textContent = '✅ 导出成功';
                  setTimeout(() => {
                      btn.textContent = '📷 导出 Canvas';
                      btn.disabled = false;
                  }, 1500);

              } catch (e) {
                  console.error('导出失败:', e);
                  alert('导出失败: ' + e.message);
                  btn.textContent = '📷 导出 Canvas';
                  btn.disabled = false;
              }
          });
      }
  })();
