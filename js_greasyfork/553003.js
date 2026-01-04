// ==UserScript==
// @name         软考达人答题快捷键（支持中文输入法括号）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  A/B/C/D 选项，[ / ] 翻页，支持中文输入法【】，Esc 开关，带提示浮窗。
// @author       mcxen
// @match        *://*.ruankaokao.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/553003/%E8%BD%AF%E8%80%83%E8%BE%BE%E4%BA%BA%E7%AD%94%E9%A2%98%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%88%E6%94%AF%E6%8C%81%E4%B8%AD%E6%96%87%E8%BE%93%E5%85%A5%E6%B3%95%E6%8B%AC%E5%8F%B7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553003/%E8%BD%AF%E8%80%83%E8%BE%BE%E4%BA%BA%E7%AD%94%E9%A2%98%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%88%E6%94%AF%E6%8C%81%E4%B8%AD%E6%96%87%E8%BE%93%E5%85%A5%E6%B3%95%E6%8B%AC%E5%8F%B7%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let enabled = true; // 默认启用快捷键模式

    // ====== 创建提示浮窗 ======
    const tipBox = document.createElement('div');
    tipBox.style.position = 'fixed';
    tipBox.style.bottom = '40px';
    tipBox.style.right = '40px';
    tipBox.style.padding = '8px 16px';
    tipBox.style.background = 'rgba(0,0,0,0.6)';
    tipBox.style.color = '#fff';
    tipBox.style.borderRadius = '8px';
    tipBox.style.fontSize = '14px';
    tipBox.style.zIndex = '999999';
    tipBox.style.transition = 'opacity 0.3s';
    tipBox.style.opacity = '0';
    document.body.appendChild(tipBox);

    function showTip(msg) {
        tipBox.innerText = msg;
        tipBox.style.opacity = '1';
        setTimeout(() => (tipBox.style.opacity = '0'), 1200);
    }

    // ====== 按键事件 ======
    document.addEventListener('keydown', function(e) {
        let key = e.key;

        // 中文输入法括号映射
        if (key === '【') key = '[';
        if (key === '】') key = ']';

        // Esc 开关快捷键模式
        if (key === 'Escape') {
            enabled = !enabled;
            showTip(enabled ? '✅ 快捷键模式已启用' : '⛔ 快捷键模式已暂停');
            return;
        }

        if (!enabled) return;

        const upperKey = key.toUpperCase();

        // ====== A/B/C/D 答题 ======
        if (['A', 'B', 'C', 'D'].includes(upperKey)) {
            const options = document.querySelectorAll('.options');
            const index = upperKey.charCodeAt(0) - 65; // A→0, B→1, C→2, D→3
            if (options[index]) {
                options[index].click();
                showTip(`✅ 已选择选项 ${upperKey}`);
            } else {
                showTip('⚠️ 未找到选项，请确认题目加载完成');
            }
        }

        // ====== 下一题 ======
        if (key === ']') {
            const nextBtn = [...document.querySelectorAll('button')].find(btn =>
                btn.innerText.includes('下一题')
            );
            if (nextBtn) {
                nextBtn.click();
                showTip('➡️ 下一题');
            } else {
                showTip('⚠️ 未找到“下一题”按钮');
            }
        }

        // ====== 上一题 ======
        if (key === '[') {
            const prevBtn = [...document.querySelectorAll('button')].find(btn =>
                btn.innerText.includes('上一题')
            );
            if (prevBtn) {
                prevBtn.click();
                showTip('⬅️ 上一题');
            } else {
                showTip('⚠️ 未找到“上一题”按钮');
            }
        }
    });

    console.log('✅【软考达人答题快捷键 2.0】已启用');
    console.log('操作：A/B/C/D 答题，[ 或 【 上一题，] 或 】 下一题，Esc 开关模式');
})();
