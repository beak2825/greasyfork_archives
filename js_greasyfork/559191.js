// ==UserScript==
// @name         云盘ai界面优化
// @namespace    http://tampermonkey.net/
// @version      2025-12-17
// @description  edit 139 ai
// @author       You
// @match        https://yun.139.com/ai-helper-h5/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=139.com
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559191/%E4%BA%91%E7%9B%98ai%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/559191/%E4%BA%91%E7%9B%98ai%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加MutationObserver监听动态加载元素
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                // 隐藏元素
                const tabItems = document.querySelectorAll('.command-tab .tab-item');
                tabItems.forEach(item => {
                    item.style.display = 'none';
                    console.log('已隐藏选项卡:', item);
                });

                document.querySelector('.greet-card-container').style.display = 'none';
                document.querySelector('.welcome-wrap').style.display = 'none';
                document.querySelector('.guide-bar-comp').style.display = 'none';

                // 功能2: 设置侧边栏宽度为20vw
                const sideDrawer = document.querySelector('.side-drawer');
                if (sideDrawer) {
                    sideDrawer.style.width = '20vw';
                    console.log('已调整侧边栏宽度为20vw');
                } else {
                    console.warn('未找到.side-drawer元素');
                }

                // 功能3: 绑定回车键发送事件
                const sendButton = document.querySelector('.input-right-icon .icon-send:last-child');
                if (sendButton) {
                    // 添加全局键盘事件监听
                    document.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter' || event.keyCode === 13) {
                            // 创建并触发点击事件
                            const clickEvent = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            sendButton.dispatchEvent(clickEvent);
                            console.log('已触发发送按钮点击事件');
                        }
                    });
                    console.log('已绑定回车键到发送按钮');
                } else {
                    console.warn('未找到发送按钮元素');
                }

            }
        });
    });

    // 开始监听整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });



})();