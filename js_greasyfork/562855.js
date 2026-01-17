// ==UserScript==
// @name         Size Marker Lines + Safe Fill
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Size Marker Lines
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @match        *://*/Admin/MyCurrentTask/Active
// @match        *://*/Admin/PrefilterPictures*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562855/Size%20Marker%20Lines%20%2B%20Safe%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/562855/Size%20Marker%20Lines%20%2B%20Safe%20Fill.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitFor(fn, cb) {
    const i = setInterval(() => {
      try {
        if (fn()) {
          clearInterval(i);
          cb();
        }
      } catch (e) {}
    }, 400);
  }

  waitFor(
    () => document.querySelector('svg') && [...document.querySelectorAll('text')].some(t => t.textContent.includes('Size:')),
    () => {
      const targetText = [...document.querySelectorAll('text')].find(t => t.textContent.includes('Size:'));
      if (!targetText) return;

      const parent = targetText.parentNode;
      const box = [...parent.querySelectorAll('path')].find(p => p.getAttribute('opacity') === '0');
      if (!box) return;

      const svg = box.ownerSVGElement;
      const lineLength = 150;

      function createLine() {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("stroke", "#000");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);
        return line;
      }

      const leftLine = createLine();
      const rightLine = createLine();

      function updateLines() {
        const d = box.getAttribute('d');
        const nums = d.match(/[\d.]+/g).map(Number);

        const xLeft = nums[0];
        const yTop = nums[1];
        const xRight = nums[4];

        leftLine.setAttribute("x1", xLeft);
        leftLine.setAttribute("y1", yTop);
        leftLine.setAttribute("x2", xLeft);
        leftLine.setAttribute("y2", yTop + lineLength);

        rightLine.setAttribute("x1", xRight);
        rightLine.setAttribute("y1", yTop);
        rightLine.setAttribute("x2", xRight);
        rightLine.setAttribute("y2", yTop + lineLength);
      }

      updateLines();
      new MutationObserver(updateLines).observe(box, { attributes: true, attributeFilter: ['d'] });

      // ---------- КНОПКА ЗАЛИВКИ ----------
      waitFor(
        () => document.querySelector('a[href*="backgroundMarker.setMarkerSize"]') && window.tangiblee,
        () => {
          const markerSizeButton = document.querySelector('a[href*="backgroundMarker.setMarkerSize"]');

          const fillCanvasButton = document.createElement('button');
          fillCanvasButton.type = 'button'; // ВАЖНО: не submit
          fillCanvasButton.style.width = '30px';
          fillCanvasButton.style.height = '30px';
          fillCanvasButton.style.backgroundColor = '#223ce3';
          fillCanvasButton.style.border = '1px solid #ccc';
          fillCanvasButton.style.borderRadius = '4px';
          fillCanvasButton.title = 'Fill between Size lines';

          markerSizeButton.parentNode.insertBefore(fillCanvasButton, markerSizeButton.nextSibling);

          fillCanvasButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!tangiblee.webManager || !tangiblee.webManager.backgroundMarker) return;

            const self = tangiblee.webManager.backgroundMarker;
            const fillColor = "rgb(0, 250, 0)";

            const x1 = Math.min(+leftLine.getAttribute('x1'), +rightLine.getAttribute('x1'));
            const x2 = Math.max(+leftLine.getAttribute('x1'), +rightLine.getAttribute('x1'));

            const arrowPath = parent.querySelector('path[marker-start][marker-end]');
            if (!arrowPath) return;

            const total = arrowPath.getTotalLength();
            const mid = arrowPath.getPointAtLength(total / 2);
            const y = mid.y;

            const svgRect = svg.getBoundingClientRect();
            const canvasRect = self.canvas.getBoundingClientRect();

            const scaleX = self.canvas.width / canvasRect.width;
            const scaleY = self.canvas.height / canvasRect.height;

            const canvasX1 = (x1 + svgRect.left - canvasRect.left) * scaleX;
            const canvasX2 = (x2 + svgRect.left - canvasRect.left) * scaleX;
            const canvasY  = (y  + svgRect.top  - canvasRect.top ) * scaleY;

            self.canvasContext.fillStyle = fillColor;
            self.canvasContext.fillRect(
              canvasX1,
              canvasY,
              canvasX2 - canvasX1,
              self.canvas.height - canvasY
            );

            self.imageWasChanged = true;
            self.isSelectionCleared = false;
          });
        }
      );
    }
  );
})();
