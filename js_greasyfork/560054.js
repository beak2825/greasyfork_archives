// ==UserScript==
// @name         微博聊天-显示精确时间
// @namespace    http://tampermonkey.net/
// @version      1
// @author       tu
// @description  在微博网页版聊天界面显示每条消息的具体时间
// @match        https://api.weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560054/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E6%98%BE%E7%A4%BA%E7%B2%BE%E7%A1%AE%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/560054/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E6%98%BE%E7%A4%BA%E7%B2%BE%E7%A1%AE%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储消息ID和时间的映射关系: { "5247331219805414": "2025-12-24 15:30:00" }
    const messageTimeMap = {};

    // 1. 工具函数：格式化时间戳
    function formatTime(timestamp) {
        // 微博API返回的是秒级时间戳，需要乘以1000
        const date = new Date(timestamp * 1000);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        const h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        const m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        const s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s;
    }

    // 2. 核心功能：拦截 XHR 请求获取时间数据
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('load', function() {
            // 匹配获取消息的接口
            if (this._url && this._url.includes('groupchat/query_messages.json')) {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response && response.messages && Array.isArray(response.messages)) {
                        let hasNewData = false;
                        response.messages.forEach(msg => {
                            // 建立 ID -> 时间 的映射
                            // 注意：API里的id是数字，DOM里的id是字符串，这里统一转为字符串key
                            if (msg.id && msg.time) {
                                messageTimeMap[String(msg.id)] = formatTime(msg.time);
                                hasNewData = true;
                            }
                        });
                        // 如果有新数据，尝试更新UI
                        if (hasNewData) {
                            // 稍微延迟一下，等待Vue渲染DOM
                            setTimeout(updateMessageTimes, 500);
                        }
                    }
                } catch (e) {
                    console.error('微博聊天时间脚本: 解析JSON失败', e);
                }
            }
        });
        return originalSend.apply(this, arguments);
    };

    // 3. UI 更新逻辑
    function updateMessageTimes() {
        // 找到所有的消息 li 元素 (必须带有 id 属性)
        const messageLis = document.querySelectorAll('li[id]');

        messageLis.forEach(li => {
            const msgId = li.id;
            const timeStr = messageTimeMap[msgId];

            if (timeStr) {
                // 查找放置名字的容器
                const nameSpan = li.querySelector('.name.font12');

                // 如果找到了名字容器，且还没有插入过时间
                if (nameSpan && !nameSpan.querySelector('.custom-msg-time')) {
                    const timeSpan = document.createElement('span');
                    timeSpan.className = 'custom-msg-time';
                    timeSpan.innerText = timeStr;
                    // 设置样式：灰色、小字体、左边距
                    timeSpan.style.color = '#999';
                    timeSpan.style.fontSize = '12px';
                    timeSpan.style.marginLeft = '10px';
                    timeSpan.style.fontWeight = 'normal';

                    // 插入到名字后面
                    nameSpan.appendChild(timeSpan);
                }
            }
        });
    }

    // 4. 监听 DOM 变化 (MutationObserver)
    // 即使网络请求拦截到了，但有时候用户滚动历史记录或切换群聊，DOM是动态生成的
    // 使用观察者确保新生成的DOM也能被处理
    const observer = new MutationObserver((mutations) => {
        // 简单粗暴策略：只要DOM有大变动，就尝试匹配一次时间
        // 为了性能，可以使用防抖，但这里简单起见直接调用，因为updateMessageTimes开销不大
        updateMessageTimes();
    });

    // 等待页面加载完成后启动观察者
    window.addEventListener('load', () => {
        const body = document.body;
        if (body) {
            observer.observe(body, {
                childList: true,
                subtree: true
            });
        }
    });

})();