// ==UserScript==
// @name         微博批量删除助手｜Weibo Bulk Deleter（含节奏设置 + 状态提示）
// @namespace    https://greasyfork.org/zh-CN/users/umanic
// @version      1.1
// @description  在微博个人主页/高级搜索页批量删除微博，支持开始/结束控制、自定义删除节奏、实时状态提示
// @author       umanic
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555799/%E5%BE%AE%E5%8D%9A%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%8A%A9%E6%89%8B%EF%BD%9CWeibo%20Bulk%20Deleter%EF%BC%88%E5%90%AB%E8%8A%82%E5%A5%8F%E8%AE%BE%E7%BD%AE%20%2B%20%E7%8A%B6%E6%80%81%E6%8F%90%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555799/%E5%BE%AE%E5%8D%9A%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%8A%A9%E6%89%8B%EF%BD%9CWeibo%20Bulk%20Deleter%EF%BC%88%E5%90%AB%E8%8A%82%E5%A5%8F%E8%AE%BE%E7%BD%AE%20%2B%20%E7%8A%B6%E6%80%81%E6%8F%90%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let isDeleting = false;
    let delay = 3000;  // 默认节奏 3 秒
    let statusDiv;     // 状态区域引用
    let delayInput;    // 节奏输入框引用

    function simulateClick(elem) {
        const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        elem.dispatchEvent(evt);
    }

    function deleteNext() {
        if (!isDeleting) return;

        // 删除逻辑封装为函数，便于在主文档和 iframe 中调用
        function tryDeleteInDoc(doc) {
            const moreBtns = doc.querySelectorAll('[title="更多"], [aria-label="更多"]');
            if (!moreBtns || moreBtns.length === 0) return false;

            simulateClick(moreBtns[0]);
            setTimeout(() => {
                const menuItems = Array.from(doc.querySelectorAll('div[role="button"], a[role="menuitem"]'));
                const deleteItem = menuItems.find(item => item.textContent.trim().includes('删除'));
                if (deleteItem) {
                    simulateClick(deleteItem);
                    setTimeout(() => {
                        const confirmBtns = Array.from(doc.querySelectorAll('button, a'));
                        const confirmBtn = confirmBtns.find(btn => {
                            const txt = btn.textContent.trim();
                            return txt.includes('确定') || txt.includes('删除');
                        });
                        if (confirmBtn) {
                            const targetArticle = moreBtns[0].closest('article');
                            simulateClick(confirmBtn);
                            const observer = new MutationObserver((mutations, obs) => {
                                if (!doc.body.contains(targetArticle)) {
                                    statusDiv.textContent = '删除成功';
                                    obs.disconnect();
                                    setTimeout(deleteNext, delay);
                                }
                            });
                            observer.observe(doc.body, { childList: true, subtree: true });
                            setTimeout(() => {
                                observer.disconnect();
                                if (doc.body.contains(targetArticle)) {
                                    statusDiv.textContent = '删除失败或卡住，稍后重试';
                                    setTimeout(deleteNext, delay);
                                }
                            }, 5000);
                        } else {
                            statusDiv.textContent = '未找到确认按钮';
                            setTimeout(deleteNext, delay);
                        }
                    }, 400);
                } else {
                    statusDiv.textContent = '未找到删除菜单项';
                    setTimeout(deleteNext, delay);
                }
            }, 300);
            return true;
        }

        // 先尝试在主文档删除
        let handled = tryDeleteInDoc(document);
        // 如果主文档没有找到，再尝试在同源 iframe 删除
        if (!handled) {
            const iframes = document.querySelectorAll('iframe');
            for (const frame of iframes) {
                try {
                    const doc = frame.contentDocument;
                    if (doc && tryDeleteInDoc(doc)) {
                        handled = true;
                        break;
                    }
                } catch (e) {}
            }
            if (!handled) {
                statusDiv.textContent = '未找到可删除的微博';
                // 此处可自行选择自动刷新或停止
            }
        }
    }

    function insertPanel() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '10px';
        container.style.zIndex = '100000';
        container.style.background = '#fff';
        container.style.padding = '8px';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '4px';
        container.style.fontSize = '14px';
        container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';

        const startBtn = document.createElement('button');
        startBtn.textContent = '开始';
        startBtn.style.marginRight = '8px';
        startBtn.onclick = () => {
            if (!isDeleting) {
                isDeleting = true;
                statusDiv.textContent = '开始删除...';
                const val = parseInt(delayInput.value, 10);
                if (!isNaN(val) && val > 0) delay = val;
                setTimeout(deleteNext, delay);
            }
        };

        const stopBtn = document.createElement('button');
        stopBtn.textContent = '结束';
        stopBtn.style.marginRight = '8px';
        stopBtn.onclick = () => {
            isDeleting = false;
            statusDiv.textContent = '已停止';
        };

        const delayLabel = document.createElement('span');
        delayLabel.textContent = '节奏(ms)：';
        delayLabel.style.marginRight = '4px';

        // 将节奏输入框赋给外层变量 delayInput
        delayInput = document.createElement('input');
        delayInput.type = 'number';
        delayInput.min = '500';
        delayInput.value = delay;
        delayInput.style.width = '80px';
        delayInput.onchange = () => {
            const val = parseInt(delayInput.value, 10);
            if (!isNaN(val) && val > 0) delay = val;
        };

        // 将状态区域赋给外层变量 statusDiv
        statusDiv = document.createElement('div');
        statusDiv.style.marginTop = '6px';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.color = '#555';
        statusDiv.textContent = '未开始';

        container.appendChild(startBtn);
        container.appendChild(stopBtn);
        container.appendChild(delayLabel);
        container.appendChild(delayInput);
        container.appendChild(statusDiv);

        document.body.appendChild(container);
    }

    window.addEventListener('load', insertPanel);
})();
