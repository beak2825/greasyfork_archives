// ==UserScript==
// @name         Gemini AI Studio - 输入栏增加独立录音按钮
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  在Gemini AI Studio的“+”按钮左侧创建一个独立的“录音”快捷按钮，通过智能等待和模拟点击实现功能。
// @author       kc0ed & Gemini
// @match        https://aistudio.google.com/*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549803/Gemini%20AI%20Studio%20-%20%E8%BE%93%E5%85%A5%E6%A0%8F%E5%A2%9E%E5%8A%A0%E7%8B%AC%E7%AB%8B%E5%BD%95%E9%9F%B3%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/549803/Gemini%20AI%20Studio%20-%20%E8%BE%93%E5%85%A5%E6%A0%8F%E5%A2%9E%E5%8A%A0%E7%8B%AC%E7%AB%8B%E5%BD%95%E9%9F%B3%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CUSTOM_BUTTON_ID = 'custom-audio-shortcut-button';

    // --- 这是本次的核心：一个有耐心的查找并点击函数 ---
    function findAndClickPatiently() {
        const MAX_WAIT_TIME = 2000; // 最长等待2秒
        const CHECK_INTERVAL = 50;  // 每50毫秒检查一次
        let elapsedTime = 0;

        console.log('[Gemini Patient v4.0] 开始耐心寻找原始录音按钮...');

        const intervalId = setInterval(() => {
            // 每次都重新查找原始按钮
            const originalAudioButton = document.querySelector('button[mat-menu-item][aria-label="Record Audio"]');

            // 如果找到了！
            if (originalAudioButton) {
                console.log(`[Gemini Patient v4.0] 成功找到！(耗时 ${elapsedTime}ms)，正在点击...`);
                originalAudioButton.click();
                clearInterval(intervalId); // 任务完成，停止搜索
                return;
            }

            // 更新已用时间
            elapsedTime += CHECK_INTERVAL;

            // 如果超时了还没找到
            if (elapsedTime >= MAX_WAIT_TIME) {
                clearInterval(intervalId); // 停止搜索
                console.error('[Gemini Patient v4.0] 错误：超时！2秒内未找到原始录音按钮。');
                alert('Gemini脚本执行失败：无法找到菜单中的录音按钮。');
            }
        }, CHECK_INTERVAL);
    }


    function createAndPlaceShortcutButton() {
        if (document.getElementById(CUSTOM_BUTTON_ID)) {
            return;
        }

        const addChunkMenu = document.querySelector('ms-add-chunk-menu');
        const addWrapper = addChunkMenu ? addChunkMenu.closest('.button-wrapper') : null;

        if (addWrapper) {
            const newButtonWrapper = document.createElement('div');
            newButtonWrapper.className = 'button-wrapper';

            const newButton = document.createElement('button');
            newButton.id = CUSTOM_BUTTON_ID;
            newButton.setAttribute('ms-button', '');
            newButton.setAttribute('variant', 'icon-borderless');
            newButton.setAttribute('aria-label', 'Record Audio');
            newButton.setAttribute('mattooltipposition', 'above');
            newButton.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon';

            const newIcon = document.createElement('span');
            newIcon.className = 'material-symbols-outlined notranslate ms-button-icon-symbol ng-star-inserted';
            newIcon.setAttribute('aria-hidden', 'true');
            newIcon.textContent = 'mic';

            // --- 重写点击事件 ---
            newButton.addEventListener('click', () => {
                console.log('[Gemini Patient v4.0] 快捷按钮被点击...');
                const plusButton = document.querySelector('ms-add-chunk-menu button');
                if (plusButton) {
                    plusButton.click(); // 点击“+”号以弹出菜单
                    findAndClickPatiently(); // 启动我们的“耐心”机器人
                } else {
                    console.error('[Gemini Patient v4.0] 错误：无法找到“+”按钮来触发菜单。');
                }
            });

            newButton.appendChild(newIcon);
            newButtonWrapper.appendChild(newButton);

            const parentContainer = addWrapper.parentElement;
            if (parentContainer) {
                parentContainer.insertBefore(newButtonWrapper, addWrapper);
                console.log('[Gemini Patient v4.0] 录音快捷按钮创建并放置成功！');
            }
        }
    }

    const observer = new MutationObserver(() => {
        createAndPlaceShortcutButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(createAndPlaceShortcutButton, 1000);

})();
