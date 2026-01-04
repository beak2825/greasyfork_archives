// ==UserScript==
// @name         ExHentai AI 生成作品過濾開關
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  在 e-hentai 和 exhentai 上切換過濾含有 other:ai generated 標籤或名稱包含 AI Generated 的作品（支援多種模式）
// @author       shanlan(grok-4-fast-reasoning)
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @exclude      https://e-hentai.org/g*
// @exclude      https://exhentai.org/g*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554556/ExHentai%20AI%20%E7%94%9F%E6%88%90%E4%BD%9C%E5%93%81%E9%81%8E%E6%BF%BE%E9%96%8B%E9%97%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/554556/ExHentai%20AI%20%E7%94%9F%E6%88%90%E4%BD%9C%E5%93%81%E9%81%8E%E6%BF%BE%E9%96%8B%E9%97%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addToggleButton() {
        if (document.getElementById('ai-filter-toggle')) return;

        const button = document.createElement('button');
        button.id = 'ai-filter-toggle';
        button.innerText = 'AI Filter: Off';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            padding: 12px 16px;
            background: #6c757d;
            color: white;
            border: 1px solid #5a6268;
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            transition: all 0.3s ease;
        `;
        button.onmouseover = () => {
            if (button.innerText.includes('Off')) {
                button.style.background = '#7a8288';
                button.style.transform = 'scale(1.05)';
            } else {
                button.style.background = '#0056b3';
                button.style.transform = 'scale(1.05)';
            }
        };
        button.onmouseout = () => {
            if (button.innerText.includes('Off')) {
                button.style.background = '#6c757d';
                button.style.transform = 'scale(1)';
            } else {
                button.style.background = '#007bff';
                button.style.transform = 'scale(1)';
            }
        };

        document.body.appendChild(button);

        let isFiltered = localStorage.getItem('aiFilterEnabled') === 'true';
        if (isFiltered) {
            button.innerText = 'AI Filter: On';
            button.style.background = '#007bff';
            filterAIGalleries(true);
        }

        button.addEventListener('click', () => {
            isFiltered = !isFiltered;
            localStorage.setItem('aiFilterEnabled', isFiltered);
            button.innerText = isFiltered ? 'AI Filter: On' : 'AI Filter: Off';
            button.style.background = isFiltered ? '#007bff' : '#6c757d';
            button.style.transform = 'scale(1)';
            filterAIGalleries(isFiltered);
        });
    }

    function filterAIGalleries(enable) {
        const galleryRowsGlt = document.querySelectorAll('.itg.glte tbody tr');
        galleryRowsGlt.forEach(row => {
            const titleEl = row.querySelector('.glname');
            const hasAI = row.querySelector('[title="other:ai generated"], [data-title="other:ai generated"]') ||
                          (titleEl && titleEl.textContent.toLowerCase().includes('ai generated'));
            if (hasAI && enable) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        });

        const galleryRowsGltm = document.querySelectorAll('.itg.gltm tbody tr');
        galleryRowsGltm.forEach(row => {
            const titleEl = row.querySelector('.gl3m .glink');
            const img = row.querySelector('img');
            const hasAI = (titleEl && titleEl.textContent.toLowerCase().includes('ai generated')) ||
                          (img && (img.alt.toLowerCase().includes('ai generated') || img.title.toLowerCase().includes('ai generated'))) ||
                          row.querySelector('[title="other:ai generated"], [data-title="other:ai generated"]');
            if (hasAI && enable) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        });

        const galleryItems = document.querySelectorAll('.itg.gld .gl1t');
        galleryItems.forEach(item => {
            const titleEl = item.querySelector('.gl4t');
            const hasAI = (titleEl && titleEl.textContent.toLowerCase().includes('ai generated')) ||
                          item.querySelector('[title="other:ai generated"], [data-title="other:ai generated"]');
            if (hasAI && enable) {
                item.style.display = 'none';
            } else {
                item.style.display = '';
            }
        });

        const galleryRowsGltc = document.querySelectorAll('.itg tbody tr');
        galleryRowsGltc.forEach(row => {
            if (row.querySelector('.gl3c')) {
                const titleEl = row.querySelector('.gl3c .glink');
                const img = row.querySelector('img');
                const hasAI = (titleEl && titleEl.textContent.toLowerCase().includes('ai generated')) ||
                              (img && (img.alt.toLowerCase().includes('ai generated') || img.title.toLowerCase().includes('ai generated'))) ||
                              row.querySelector('.gt[data-title="other:ai generated"], [title="other:ai generated"], [data-title="other:ai generated"]');
                if (hasAI && enable) {
                    row.style.display = 'none';
                } else {
                    row.style.display = '';
                }
            }
        });
    }

    function init() {
        if (document.body) {
            addToggleButton();
            const observer = new MutationObserver(() => {
                if (document.querySelector('.itg.glte') || document.querySelector('.itg.gltm') || document.querySelector('.itg.gld') || document.querySelector('.itg tbody tr.gl3c')) {
                    const isFiltered = localStorage.getItem('aiFilterEnabled') === 'true';
                    if (isFiltered) filterAIGalleries(true);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            setTimeout(init, 500);
        }
    }

    init();
})();