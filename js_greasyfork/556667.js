// ==UserScript==
// @name         CS Graduates Answer Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  左上角按钮切换点击显示/隐藏答案按钮，带 debug 模式，只在 csgraduates.com 生效
// @author       Mzdyl
// @match        https://csgraduates.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556667/CS%20Graduates%20Answer%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/556667/CS%20Graduates%20Answer%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let debug = false; // debug 模式开关
    let toggleState = 'show'; // 当前状态，show 表示点击显示答案，hide 表示点击隐藏答案

    // 创建浮动按钮
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '切换答案按钮';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = 9999;
    toggleButton.style.padding = '10px 15px';
    toggleButton.style.backgroundColor = '#27ae60';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    document.body.appendChild(toggleButton);

    // 点击事件
    toggleButton.addEventListener('click', () => {
        const buttons = document.querySelectorAll('button.toggle-btn');
        let count = 0;

        buttons.forEach(btn => {
            const text = btn.textContent.trim();

            // 根据当前状态决定点击哪种按钮
            if (toggleState === 'show' && text.includes('查看答案与解析')) {
                btn.click();
                count++;
            } else if (toggleState === 'hide' && text.includes('隐藏答案与解析')) {
                btn.click();
                count++;
            }
        });

        if (debug) {
            console.log(`状态: ${toggleState}, 已点击 ${count} 个按钮`);
        }

        // 切换状态
        toggleState = toggleState === 'show' ? 'hide' : 'show';
    });

})();