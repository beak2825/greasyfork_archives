// ==UserScript==
// @name         自动点击与跳转脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击特定元素并处理页面跳转
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553122/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E4%B8%8E%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553122/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E4%B8%8E%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        // 要点击的元素选择器
        clickSelectors: [
            '.next-page',
            '.load-more',
            '[onclick*="next"]',
            'a[href*="page"]'
        ],
        // 点击延迟（毫秒）
        clickDelay: 2000,
        // 最大点击次数
        maxClicks: 10,
        // 是否在控制台显示日志
        debug: true
    };

    let clickCount = 0;

    // 日志函数
    function log(message) {
        if (config.debug) {
            console.log(`[自动点击脚本] ${message}`);
        }
    }

    // 查找并点击元素
    function findAndClick() {
        if (clickCount >= config.maxClicks) {
            log(`已达到最大点击次数: ${config.maxClicks}`);
            return;
        }

        for (let selector of config.clickSelectors) {
            const elements = document.querySelectorAll(selector);
            
            for (let element of elements) {
                if (element.offsetParent !== null && element.getBoundingClientRect().width > 0) {
                    log(`找到可点击元素: ${selector}`);
                    
                    // 模拟点击
                    element.click();
                    clickCount++;
                    log(`执行点击操作 (${clickCount}/${config.maxClicks})`);
                    
                    // 设置下一次点击的延迟
                    setTimeout(findAndClick, config.clickDelay);
                    return;
                }
            }
        }
        
        log('未找到可点击元素，将在1秒后重试');
        setTimeout(findAndClick, 1000);
    }

    // 页面加载完成后开始执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', findAndClick);
    } else {
        findAndClick();
    }

    // 监听页面变化（针对SPA应用）
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                log('检测到页面变化，重新开始查找');
                setTimeout(findAndClick, 500);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加手动控制按钮（可选）
    function addControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 10000;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 5px; font-weight: bold;">自动点击控制</div>
            <button id="startClick">开始点击</button>
            <button id="stopClick">停止点击</button>
            <div>点击次数: <span id="clickCount">0</span></div>
        `;

        document.body.appendChild(panel);

        document.getElementById('startClick').addEventListener('click', function() {
            clickCount = 0;
            document.getElementById('clickCount').textContent = clickCount;
            findAndClick();
        });

        document.getElementById('stopClick').addEventListener('click', function() {
            clickCount = config.maxClicks;
            log('手动停止点击操作');
        });
    }

    // 添加控制面板
    setTimeout(addControlPanel, 1000);
})();