// ==UserScript==
// @name         AB结果轮次编号显示
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  用于评测系统，为每轮问题添加编号标签，移除对齐功能
// @author       damu
// @match        https://meval.discuz.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555803/AB%E7%BB%93%E6%9E%9C%E8%BD%AE%E6%AC%A1%E7%BC%96%E5%8F%B7%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/555803/AB%E7%BB%93%E6%9E%9C%E8%BD%AE%E6%AC%A1%E7%BC%96%E5%8F%B7%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 工具函数：清理文本
    const qTrim = s => (s || '').replace(/\s+/g, ' ').trim();

    // 查找模型列
    function findModels() {
        return Array.from(document.querySelectorAll('.overall-form__model')).slice(0, 2);
    }

    // 提取轮次信息
    function extractRounds(modelEl) {
        if (!modelEl) return [];
        return Array.from(modelEl.querySelectorAll('.overall-form__conversation-round')).map(round => {
            const targetDiv = round.querySelector('.t-col.conversation-question-new__item.t-col-offset-0.t-col-pull-0.t-col-push-0.t-col-order-0');
            return { el: round, targetDiv };
        });
    }

    // 添加轮次编号
    function addRoundNumbers() {
        const models = findModels();
        if (models.length < 2) return;

        const [aRounds, bRounds] = models.map(extractRounds);
        const maxRounds = Math.max(aRounds.length, bRounds.length);

        // 为每轮添加编号标签
        for (let i = 0; i < maxRounds; i++) {
            const label = `第 ${i + 1} 轮`;
            [aRounds[i], bRounds[i]].forEach(round => {
                if (!round) return;

                const questionBox = round.el.querySelector('.conversation-question-new');
                if (!questionBox) return;

                // 移除现有标签
                const existingLabel = questionBox.querySelector('.round-label');
                if (existingLabel) existingLabel.remove();

                // 创建新标签
                const labelEl = document.createElement('div');
                labelEl.className = 'round-label';
                labelEl.textContent = label;
                Object.assign(labelEl.style, {
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#4a90e2',
                    marginBottom: '6px'
                });

                questionBox.insertAdjacentElement('afterbegin', labelEl);
            });
        }
    }

    // 防抖执行
    let debounceTimer;
    function debouncedExecute() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(addRoundNumbers, 150);
    }

    // 启动监听
    function start() {
        const checkInterval = setInterval(() => {
            if (findModels().length >= 2) {
                clearInterval(checkInterval);
                addRoundNumbers();

                // 监听DOM变化
                new MutationObserver(debouncedExecute).observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 500);
    }

    start();
})();