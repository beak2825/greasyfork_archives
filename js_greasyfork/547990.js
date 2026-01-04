// ==UserScript==
// @name         文本复制按钮简洁版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  选中文本后，出现一个简洁的复制按钮,鼠标离开一定范围按钮自动消失（为了防止截图的时候截取到）
// @author       damu
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547990/%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE%E7%AE%80%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/547990/%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE%E7%AE%80%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .copy-btn {
            position: fixed;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 3px;
            padding: 2px 6px;
            font-size: 12px;
            cursor: pointer;
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            transform: translate(0, 0); /* 确保定位精确 */
        }
        .copy-btn.visible {
            opacity: 1;
            pointer-events: auto;
        }
        .copy-btn:hover {
            background: rgba(0,0,0,0.9);
        }
    `;
    document.head.appendChild(style);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = '复制';
    document.body.appendChild(copyBtn);

    let currentSelection = { text: '', rect: null };
    let ignoreNextMouseUp = false;
    let fixedPosition = { x: 0, y: 0 };

    const hideCopyBtn = () => {
        copyBtn.classList.remove('visible');
    };

    const showCopyBtn = (x, y) => {
        fixedPosition = {
            x: Math.round(x) + 22,
            y: Math.round(y) + 6
        };
        copyBtn.textContent = '复制';
        copyBtn.style.left = `${fixedPosition.x}px`;
        copyBtn.style.top = `${fixedPosition.y}px`;
        copyBtn.style.transform = 'none'; // 清除任何变换
        copyBtn.classList.add('visible');
    };

    const isMouseNearSelection = (mouseX, mouseY) => {
        if (!currentSelection.rect || !currentSelection.text) return false;
        const rangeInPixels = 2 * 37.8;
        const { left, top, right, bottom } = currentSelection.rect;
        return mouseX >= left - rangeInPixels &&
            mouseX <= right + rangeInPixels &&
            mouseY >= top - rangeInPixels &&
            mouseY <= bottom + rangeInPixels;
    };

    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(currentSelection.text).then(() => {
            // 严格使用固定位置
            copyBtn.textContent = '已复制';
            copyBtn.style.left = `${fixedPosition.x}px`;
            copyBtn.style.top = `${fixedPosition.y}px`;

            setTimeout(() => {
                copyBtn.classList.remove('visible');
            }, 1000);
        }).catch(console.error);
        ignoreNextMouseUp = true;
        setTimeout(() => { ignoreNextMouseUp = false; }, 100);
    });

    document.addEventListener('mouseup', (e) => {
        if (ignoreNextMouseUp) return;
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const buttonX = rect.right;
            const buttonY = rect.top;
            currentSelection = {
                text: selectedText,
                rect: rect
            };
            showCopyBtn(buttonX, buttonY);
        } else {
            hideCopyBtn();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!currentSelection.text) return;
        if (!isMouseNearSelection(e.clientX, e.clientY)) {
            hideCopyBtn();
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (e.target !== copyBtn) {
            hideCopyBtn();
        }
    });
})();