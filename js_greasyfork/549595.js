// ==UserScript==
// @name         网页长截图脚本
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  使用鼠标左键框选范围
// @author       qhappyc (Assisted by Gemini)
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        GM_addStyle
// @license GNU GPLv3.
// @downloadURL https://update.greasyfork.org/scripts/549595/%E7%BD%91%E9%A1%B5%E9%95%BF%E6%88%AA%E5%9B%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549595/%E7%BD%91%E9%A1%B5%E9%95%BF%E6%88%AA%E5%9B%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) {
        return;
    }

    /* global html2canvas */

    // --- 1. UI样式与元素 ---
    GM_addStyle(`
        #lsc-container {
            position: fixed;
            bottom: 20px;
            right: 0;
            z-index: 99998;
            background-color: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            height: 40px;
            width: 40px;
            border-radius: 20px 0 0 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transform: translateX(30px);
            transition: all 0.25s ease-in-out;
        }
        #lsc-container:hover {
            transform: translateX(0);
            background-color: rgba(10, 10, 10, 0.8);
        }
        #lsc-icon svg {
            width: 22px;
            height: 22px;
            fill: white;
        }
        #lsc-container.lsc-hidden { display: none; }

        /* [优化] 使用自定义SVG Data URI作为光标，大小为24x24，中心点为(12, 12) */
        #lsc-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99999;
            cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M12 0 V24 M0 12 H24' stroke='black' stroke-width='3'/><path d='M12 0 V24 M0 12 H24' stroke='%2300ff00' stroke-width='1'/></svg>") 12 12, crosshair;
        }

        #lsc-selection { position: fixed; border: 2px dashed #0f0; background: rgba(0, 255, 0, 0.2); }
        #lsc-info-box { position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 10px 20px; border-radius: 5px; z-index: 100001; font-size: 16px; }
    `);

    const container = document.createElement('div');
    container.id = 'lsc-container';
    container.innerHTML = `
        <div id="lsc-icon">
            <svg viewBox="0 0 24 24"><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" /></svg>
        </div>
    `;
    document.body.appendChild(container);

    container.addEventListener('click', () => {
        if (container.style.cursor === 'not-allowed') return;
        startSelection();
    });

    let overlay, selectionBox, infoBox, scrollInterval;
    let startX, startY, isSelecting = false;
    let selectionRect = {};

    // --- 2. 区域选择功能 ---

    function startSelection() {
        container.classList.add('lsc-hidden');
        overlay = document.createElement('div');
        overlay.id = 'lsc-overlay';
        infoBox = document.createElement('div');
        infoBox.id = 'lsc-info-box';
        infoBox.textContent = '请拖拽选择截图区域，可向下拖动以滚动页面';

        document.body.appendChild(overlay);
        document.body.appendChild(infoBox);

        overlay.addEventListener('mousedown', onMouseDown);
    }

    function onMouseDown(e) {
        if (e.button !== 0) return;
        isSelecting = true;
        startX = e.clientX + window.scrollX;
        startY = e.clientY + window.scrollY;

        selectionBox = document.createElement('div');
        selectionBox.id = 'lsc-selection';
        overlay.appendChild(selectionBox);

        updateSelectionBox(startX, startY);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
        if (!isSelecting) return;
        updateSelectionBox(e.clientX + window.scrollX, e.clientY + window.scrollY);

        const scrollMargin = 50;
        if (e.clientY > window.innerHeight - scrollMargin) { startScrolling(5); }
        else if (e.clientY < scrollMargin) { startScrolling(-5); }
        else { stopScrolling(); }
    }

    function onMouseUp(e) {
        if (!isSelecting) return;
        isSelecting = false;
        stopScrolling();
        const endX = e.clientX + window.scrollX;
        const endY = e.clientY + window.scrollY;

        selectionRect = { x: Math.min(startX, endX), y: Math.min(startY, endY), width: Math.abs(endX - startX), height: Math.abs(endY - startY) };

        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        overlay.remove();
        infoBox.remove();

        if (selectionRect.width > 5 && selectionRect.height > 5) { startCapture(); }
        else { container.classList.remove('lsc-hidden'); }
    }

    function updateSelectionBox(currentDocX, currentDocY) {
        const left = Math.min(startX, currentDocX) - window.scrollX;
        const top = Math.min(startY, currentDocY) - window.scrollY;
        const width = Math.abs(currentDocX - startX);
        const height = Math.abs(currentDocY - startY);

        selectionBox.style.left = `${left}px`;
        selectionBox.style.top = `${top}px`;
        selectionBox.style.width = `${width}px`;
        selectionBox.style.height = `${height}px`;
    }

    function startScrolling(speed) {
        if (scrollInterval) return;
        scrollInterval = setInterval(() => { window.scrollBy(0, speed); }, 10);
    }

    function stopScrolling() {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }

    // --- 3. 截图核心引擎 ---

    let hiddenElements = [];
    function hideFixedElements() {
        hiddenElements = [];
        document.querySelectorAll('*, ::before, ::after').forEach(el => {
            if (!(el instanceof HTMLElement)) return;
            if (el.id === 'lsc-container') return;

            const style = window.getComputedStyle(el);
            if (style.position === 'fixed' || style.position === 'sticky') {
                if (el.style.display !== 'none') {
                    hiddenElements.push({ element: el, originalDisplay: el.style.display });
                    el.style.display = 'none';
                }
            }
        });
    }

    function restoreFixedElements() {
        hiddenElements.forEach(({ element, originalDisplay }) => {
            element.style.display = originalDisplay;
        });
        hiddenElements = [];
    }

    async function startCapture() {
        container.style.cursor = 'not-allowed';
        const icon = container.querySelector('#lsc-icon');
        const originalIcon = icon.innerHTML;
        icon.innerHTML = `<svg viewBox="0 0 24 24" style="animation: spin 1s linear infinite;"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="white"/></svg><style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>`;

        const { x, y, width, height } = selectionRect;
        const initialScrollY = window.scrollY;
        const initialScrollX = window.scrollX;
        const originalOverflow = document.documentElement.style.overflow;

        document.documentElement.style.overflow = 'hidden';
        hideFixedElements();
        window.scrollTo(0, 0);

        try {
            const bodyRect = document.body.getBoundingClientRect();
            const adjustedX = x - bodyRect.left;
            const adjustedY = y - bodyRect.top;

            const canvas = await html2canvas(document.body, {
                scale: window.devicePixelRatio || 1,
                useCORS: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: document.body.scrollWidth,
                windowHeight: document.body.scrollHeight,
                x: adjustedX,
                y: adjustedY,
                width: width,
                height: height,
            });
            downloadCanvas(canvas);
        } catch (error) {
            console.error("【长截图脚本错误】:", error);
            alert(`截图过程中发生错误！\n\n原因可能是页面过于复杂或选区超长导致内存不足。\n请按 F12 打开控制台查看详细错误信息。`);
        } finally {
            document.documentElement.style.overflow = originalOverflow;
            restoreFixedElements();
            window.scrollTo(initialScrollX, initialScrollY);
            container.style.cursor = 'pointer';
            icon.innerHTML = originalIcon;
            container.classList.remove('lsc-hidden');
        }
    }

    function downloadCanvas(canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `long-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})();