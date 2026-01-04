// ==UserScript==
// @name         自动4倍速-原生点击版
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  原生按钮实现4倍速，确保进度正常累计
// @author       Gemini
// @match        *://*.sxacc.cn/*
// @grant        none
// @run-at       document-end
// @allFrames    true
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560765/%E8%87%AA%E5%8A%A84%E5%80%8D%E9%80%9F-%E5%8E%9F%E7%94%9F%E7%82%B9%E5%87%BB%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/560765/%E8%87%AA%E5%8A%A84%E5%80%8D%E9%80%9F-%E5%8E%9F%E7%94%9F%E7%82%B9%E5%87%BB%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心逻辑：寻找并点击播放器自带的4倍按钮
    const triggerNativeSpeed = () => {
        // 1. 寻找那个 data-val="4" 的按钮（即播放器菜单里的 4倍 选项）
        const speedBtn4x = document.querySelector('button.ck-list-p[data-val="4"]');
        
        if (speedBtn4x) {
            // 2. 检查这个按钮当前是否已经处于激活状态（是否有焦点类名）
            const isAlreadyActive = speedBtn4x.classList.contains('ck-list-p-focus');
            
            if (!isAlreadyActive) {
                console.log('检测到4倍速按钮，正在尝试原生点击...');
                // 模拟原生点击事件
                speedBtn4x.click();
                
                // 为了保险，部分播放器需要触发一次 MouseDown
                const event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                speedBtn4x.dispatchEvent(event);
            }
        }

        // 3. 兜底逻辑：即使点击了按钮，也强制同步一次 video 标签速度
        const video = document.querySelector('video');
        if (video && video.playbackRate !== 4) {
            video.playbackRate = 4;
        }
    };

    // 每 10 秒检查一次（不建议太快，给播放器加载 UI 的时间）
    const timer = setInterval(triggerNativeSpeed, 10000);

})();