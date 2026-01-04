// ==UserScript==
// @name         B站批量拉黑-修复
// @version      1.0.5
// @description  批量拉黑指定UID列表的用户
// @author       怀沙2049, Hikari31768
// @match        https://*.bilibili.com/*
// @exclude      https://space.bilibili.com/473519710
// @license      GNU GPLv3
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/99029
// @downloadURL https://update.greasyfork.org/scripts/554722/B%E7%AB%99%E6%89%B9%E9%87%8F%E6%8B%89%E9%BB%91-%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/554722/B%E7%AB%99%E6%89%B9%E9%87%8F%E6%8B%89%E9%BB%91-%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置区域 - 可以在这里修改要拉黑的UID列表
    const uid_list = [
        '22',
        '33'
    ];

    // 从cookie中获取csrf_token
    function getCsrfToken() {
        const match = document.cookie.match(/(?<=bili_jct=).+?(?=;)/)[0];
        return match ? match : null;
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#ff4d4f' : type === 'success' ? '#52c41a' : '#1890ff'};
            color: white;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
            word-break: break-all;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // 批量拉黑函数
    async function batch_block() {
        const csrf_token = getCsrfToken();
        if (!csrf_token) {
            showNotification('错误：无法获取CSRF token，请确保已登录B站', 'error');
            return;
        }

        if (!uid_list || uid_list.length === 0) {
            showNotification('错误：UID列表为空，请在脚本中配置要拉黑的UID', 'error');
            return;
        }

        const startButton = document.getElementById('batch-block-btn');
        if (startButton) {
            startButton.disabled = true;
            startButton.textContent = `拉黑中... (0/${uid_list.length})`;
        }

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < uid_list.length; i++) {
            try {
                await new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        try {
                            const uid = uid_list[i];
                            const response = await fetch('https://api.bilibili.com/x/relation/modify', {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: new URLSearchParams({
                                    'fid': uid,
                                    'act': '5',
                                    're_src': '11',
                                    'jsonp': 'jsonp',
                                    'csrf': csrf_token
                                })
                            });

                            const data = await response.json();
                            
                            if (data.code === 0) {
                                console.log(`成功拉黑UID: ${uid}`);
                                successCount++;
                            } else {
                                console.error(`拉黑UID ${uid} 失败:`, data.message);
                                failCount++;
                            }
                            
                            // 更新按钮状态
                            if (startButton) {
                                startButton.textContent = `拉黑中... (${i + 1}/${uid_list.length})`;
                            }
                            
                            resolve();
                        } catch (error) {
                            console.error(`拉黑UID ${uid_list[i]} 时发生错误:`, error);
                            failCount++;
                            reject(error);
                        }
                    }, i * 500); // 增加延迟避免请求过快
                });
            } catch (error) {
                // 单个请求失败不影响后续请求
                continue;
            }
        }

        // 显示最终结果
        const message = `批量拉黑完成！成功: ${successCount}个, 失败: ${failCount}个`;
        showNotification(message, failCount === 0 ? 'success' : 'info');
        console.log(message);

        // 恢复按钮状态
        if (startButton) {
            startButton.disabled = false;
            startButton.textContent = '开始批量拉黑';
        }
    }

    // 创建开始按钮
    function createStartButton() {
        // 移除已存在的按钮
        const existingButton = document.getElementById('batch-block-btn');
        if (existingButton) {
            existingButton.remove();
        }

        const startButton = document.createElement('button');
        startButton.id = 'batch-block-btn';
        startButton.textContent = `开始批量拉黑 (${uid_list.length}个用户)`;
        startButton.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 12px 16px;
            background: linear-gradient(135deg, #ff4d4f, #cf1322);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
            transition: all 0.3s ease;
            min-width: 180px;
        `;

        // 添加悬停效果
        startButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 16px rgba(255, 77, 79, 0.5)';
        });

        startButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(255, 77, 79, 0.4)';
        });

        startButton.addEventListener('click', function() {
            if (!confirm(`确定要批量拉黑 ${uid_list.length} 个用户吗？此操作不可逆！`)) {
                return;
            }
            batch_block();
        });

        document.body.appendChild(startButton);
    }

    // 页面加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createStartButton);
    } else {
        createStartButton();
    }

    // 监听URL变化（单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(createStartButton, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();