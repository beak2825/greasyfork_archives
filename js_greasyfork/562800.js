// ==UserScript==
// @name         知乎多回答字数 & 阅读时间统计
// @namespace    https://zhihu.com/
// @version      4.4
// @description  在知乎问题页为每个回答在正文开头显示字数统计和预计阅读时间，支持“查看全部回答”等动态刷新
// @match        https://www.zhihu.com/question/*
// @grant        none
// @author       Chloe
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562800/%E7%9F%A5%E4%B9%8E%E5%A4%9A%E5%9B%9E%E7%AD%94%E5%AD%97%E6%95%B0%20%20%E9%98%85%E8%AF%BB%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/562800/%E7%9F%A5%E4%B9%8E%E5%A4%9A%E5%9B%9E%E7%AD%94%E5%AD%97%E6%95%B0%20%20%E9%98%85%E8%AF%BB%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 文本统计 =====
    function analyzeText(text) {
        const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length;
        const englishWords = (
            text.replace(/[\u4e00-\u9fff]/g, '')
                .match(/\b[A-Za-z]+\b/g) || []
        ).length;
        const number = (text.match(/[0-9]/g) || []).length;

        return {
            chinese,
            englishWords,
            number,
            total: chinese + englishWords + number
        };
    }

    function calcReadingTime(chinese, englishWords) {
        const minutes = Math.ceil(chinese / 300 + englishWords / 200);
        return Math.max(minutes, 1);
    }

    // ===== 给单条回答加统计 =====
    function addCounter(answerEl) {
        const content = answerEl.querySelector('.RichContent-inner');
        if (!content) return;

        // 防重复
        if (content.querySelector('.gm-char-counter')) return;

        const text = content.innerText || '';
        if (!text.trim()) return;

        const { chinese, englishWords, number, total } = analyzeText(text);
        const readingTime = calcReadingTime(chinese, englishWords);

        const box = document.createElement('div');
        box.className = 'gm-char-counter';
        box.style.cssText = `
            margin-bottom: 8px;
            padding: 6px 10px;
            background: rgba(0,0,0,0.04);
            border-left: 3px solid #056de8;
            font-size: 12px;
            line-height: 1.5;
            color: #555;
            border-radius: 4px;
            pointer-events: none;
        `;

        box.innerHTML = `
            <strong>字数</strong>：
            汉 ${chinese} · Eng ${englishWords} · Num ${number}
            ｜ <strong>总</strong> ${total}
            ｜ <strong>阅读</strong> ≈ ${readingTime} 分钟
        `;

        content.prepend(box);
    }

    // ===== 扫描所有回答 =====
    function scanAllAnswers() {
        document.querySelectorAll('.AnswerItem').forEach(addCounter);
    }

    // ===== 全局 Observer（关键修复点） =====
    function observeGlobally() {
        let scheduled = false;

        const observer = new MutationObserver(() => {
            if (scheduled) return;
            scheduled = true;

            // 合并多次 DOM 变更
            requestAnimationFrame(() => {
                scheduled = false;
                scanAllAnswers();
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ===== 初始化 =====
    setTimeout(() => {
        scanAllAnswers();
        observeGlobally();
    }, 1200);
})();
