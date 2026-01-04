// ==UserScript==
// @name         ChatGPT 历史消息管理增强脚本（v2.1）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  只在新回答完成时隐藏或移除历史消息，支持渐隐效果、自定义保留条数和模式切换，自动避开右上角元素，优化性能。
// @author       Assumine
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549816/ChatGPT%20%E5%8E%86%E5%8F%B2%E6%B6%88%E6%81%AF%E7%AE%A1%E7%90%86%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%EF%BC%88v21%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549816/ChatGPT%20%E5%8E%86%E5%8F%B2%E6%B6%88%E6%81%AF%E7%AE%A1%E7%90%86%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%EF%BC%88v21%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hidden = false;
    let keepCount = 10;
    let mode = 'hide'; // 'hide' 或 'remove'
    const originalArticles = new WeakMap();

    let lastAnswerId = null;
    let lastContentLength = 0;
    let stableCounter = 0;
    const STABLE_THRESHOLD = 10; // 稳定次数，100ms × 10 = 1秒

    function updateArticles() {
        const articles = Array.from(document.querySelectorAll('article'));
        if (articles.length <= keepCount) return;

        const numHidden = articles.length - keepCount;

        if (hidden) {
            if (mode === 'remove') {
                articles.slice(0, numHidden).forEach(a => {
                    if (!originalArticles.has(a)) {
                        originalArticles.set(a, a.parentNode);
                        a.remove();
                    }
                });
                return;
            }

            const fadeCount = Math.min(5, numHidden);
            articles.slice(0, numHidden - fadeCount).forEach(a => a.style.display = 'none');
            const fadedArticles = articles.slice(numHidden - fadeCount, numHidden);
            fadedArticles.forEach((a, i) => {
                const opacity = 0.2 + (i / fadeCount) * 0.4;
                a.style.display = 'block';
                a.style.opacity = opacity;
                a.style.overflow = 'hidden';
                a.style.maxHeight = 'calc(1.5em * 5)';
                a.style.transition = 'opacity 0.3s';
            });
            articles.slice(numHidden).forEach(a => {
                a.style.display = 'block';
                a.style.opacity = '1';
                a.style.overflow = '';
                a.style.maxHeight = '';
            });
        } else {
            articles.forEach(a => {
                a.style.display = 'block';
                a.style.opacity = '1';
                a.style.overflow = '';
                a.style.maxHeight = '';
            });
            if (mode === 'remove') {
                originalArticles.forEach((parent, el) => {
                    if (!document.body.contains(el)) {
                        parent.appendChild(el);
                    }
                });
                originalArticles.clear();
            }
        }
    }

    function getRightOffset() {
        const block = document.querySelector('.top-right-block-selector'); // 替换为实际选择器
        if (block) {
            const rect = block.getBoundingClientRect();
            return rect.width + 16; // 留 16px 间距
        }
        return 10; // 默认偏移
    }

    function createControlPanel() {
        if (document.getElementById('historyControlPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'historyControlPanel';
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = getRightOffset() + 'px';
        panel.style.zIndex = '9999';
        panel.style.background = '#10a37f';
        panel.style.padding = '6px 12px';
        panel.style.borderRadius = '6px';
        panel.style.display = 'flex';
        panel.style.alignItems = 'center';
        panel.style.gap = '6px';

        const toggleBtn = document.createElement('button');
        toggleBtn.innerText = '隐藏历史';
        toggleBtn.style.padding = '4px 8px';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '14px';
        toggleBtn.style.background = '#fff';
        toggleBtn.style.color = '#10a37f';
        toggleBtn.addEventListener('click', () => {
            hidden = !hidden;
            toggleBtn.innerText = hidden ? '取消隐藏' : '隐藏历史';
            updateArticles();
        });

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.value = keepCount;
        input.style.width = '60px';
        input.style.borderRadius = '4px';
        input.style.border = 'none';
        input.style.textAlign = 'center';
        input.addEventListener('change', () => {
            const val = parseInt(input.value);
            if (val > 0) {
                keepCount = val;
                updateArticles();
            }
        });

        const label = document.createElement('span');
        label.innerText = '保留消息数';
        label.style.color = '#fff';
        label.style.fontSize = '14px';

        const modeBtn = document.createElement('button');
        modeBtn.innerText = '模式:隐藏';
        modeBtn.style.padding = '4px 8px';
        modeBtn.style.border = 'none';
        modeBtn.style.borderRadius = '4px';
        modeBtn.style.cursor = 'pointer';
        modeBtn.style.fontSize = '14px';
        modeBtn.style.background = '#fff';
        modeBtn.style.color = '#10a37f';
        modeBtn.addEventListener('click', () => {
            mode = mode === 'hide' ? 'remove' : 'hide';
            modeBtn.innerText = mode === 'hide' ? '模式:隐藏' : '模式:移除';
            updateArticles();
        });

        panel.appendChild(toggleBtn);
        panel.appendChild(label);
        panel.appendChild(input);
        panel.appendChild(modeBtn);

        document.body.appendChild(panel);
    }

    function checkAnswerCompletion() {
        const chatContainer = document.querySelector('main');
        if (!chatContainer) return;

        const articles = chatContainer.querySelectorAll('article');
        if (articles.length === 0) return;

        const lastArticle = articles[articles.length - 1];
        const isAssistant = lastArticle.querySelector('[data-message-author-role="assistant"]');
        if (!isAssistant) return;

        const currentText = lastArticle.innerText.trim();
        const currentLength = currentText.length;
        const currentId = lastArticle.getAttribute('data-message-id') || lastArticle.innerHTML.slice(0,50);

        if (currentId !== lastAnswerId) {
            lastAnswerId = currentId;
            lastContentLength = 0;
            stableCounter = 0;
        }

        if (currentLength > lastContentLength + 5) {
            lastContentLength = currentLength;
            stableCounter = 0;
        } else if (currentLength === lastContentLength) {
            stableCounter++;
            if (stableCounter >= STABLE_THRESHOLD) {
                updateArticles();
                stableCounter = 0;
            }
        }
    }

    const initInterval = setInterval(() => {
        const container = document.querySelector('main') || document.body;
        if (container) {
            clearInterval(initInterval);
            createControlPanel();
            updateArticles();
            setInterval(checkAnswerCompletion, 100);
        }
    }, 500);

})();
