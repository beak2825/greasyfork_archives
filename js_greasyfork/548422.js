// ==UserScript==
// @name         9DM每日计算自动填入（修复版）
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @description  9DM每日计算验证自动填入；旧的收藏页面地址重定向到新地址；搜索计算自动验证
// @author       Assistant
// @match        *://www.9dmgamemod.com/*
// @match        *://www.9dmgamemod.net/*
// @match        *://www.9damaogame.net/*
// @match        *://www.9damaogames.com/*
// @match        *://www.9dmsgame.com/*
// @match        *://www.9dmsgame.net/*
// @match        *://www.9dmdamaomod.com/*
// @match        *://www.9dmdamaomod.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548422/9DM%E6%AF%8F%E6%97%A5%E8%AE%A1%E7%AE%97%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548422/9DM%E6%AF%8F%E6%97%A5%E8%AE%A1%E7%AE%97%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** 当前使用的 host */
    const CURRENT_HOST = 'www.9dmgamemod.com';
    const { search, protocol, pathname, host } = window.location;

    // 重定向处理（保持原逻辑）
    if (/\/gonggao\//.test(pathname) || host !== CURRENT_HOST) {
        let tid = '';
        try {
            tid = search.match(/tid=(\d+)/)[1];
        } catch {}
        if (tid) {
            const nHref = `${protocol}//${CURRENT_HOST}/thread-${tid}-1-1.html`;
            window.open(nHref, '_self');
            return;
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        // 每日计算自动填入 - 只尝试一次，避免重复执行
        setTimeout(() => {
            const answerInputs = document.getElementsByName('answer');
            if (answerInputs.length > 0) {
                const answerInput = answerInputs[0];

                // 如果已经有值，不要覆盖
                if (answerInput.value) {
                    return;
                }

                // 查找包含数学问题的 <b> 标签
                const boldElements = document.querySelectorAll('b');
                let question = '';

                for (let b of boldElements) {
                    const text = b.innerText || b.textContent;
                    if (text && /\d+.*[+\-*/].*\d+/.test(text)) {
                        question = text;
                        break;
                    }
                }

                // 如果在 <b> 标签中没找到，检查页面标题
                if (!question) {
                    const title = document.title;
                    if (title && /\d+.*[+\-*/].*\d+/.test(title)) {
                        question = title;
                    }
                }

                if (question) {
                    // 计算答案（保持原脚本的计算逻辑）
                    const answer = question
                        .replace(/[^0-9]/gi, ',')
                        .split(',')
                        .filter((i) => Number(i))
                        .reduce((a, b) => Number(a) + Number(b), 0);

                    // 填入答案
                    answerInput.value = answer;

                    // 自动提交
                    const submitButtons = document.getElementsByName('secqsubmit');
                    if (submitButtons.length > 0) {
                        submitButtons[0].click();
                    }
                }
            }
        }, 100);

        // 搜索计算自动验证 - 移除遮罩
        const domSearchMask = document.querySelector('.mask');
        if (domSearchMask) {
            domSearchMask.style.display = 'none';
        }
    });
})();