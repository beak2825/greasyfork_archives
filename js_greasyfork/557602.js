// ==UserScript==
// @name         DeepFlood & NodeSeek 自动签到
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持DeepFlood和NodeSeek，使用API直接签到，每天自动签到一次，支持多账号，支持跨站签到
// @author       wuzf
// @match        https://www.deepflood.com/*
// @match        https://www.nodeseek.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.deepflood.com
// @connect      www.nodeseek.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557602/DeepFlood%20%20NodeSeek%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/557602/DeepFlood%20%20NodeSeek%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 站点配置 ====================
    const SITES = {
        'deepflood': {
            name: 'DeepFlood',
            hostname: 'www.deepflood.com',
            api: 'https://www.deepflood.com/api/attendance?random=true',
            color: '#667eea'
        },
        'nodeseek': {
            name: 'NodeSeek',
            hostname: 'www.nodeseek.com',
            api: 'https://www.nodeseek.com/api/attendance?random=true',
            color: '#f093fb'
        }
    };

    const currentSite = SITES.deepflood.hostname === window.location.hostname ? SITES.deepflood :
                        SITES.nodeseek.hostname === window.location.hostname ? SITES.nodeseek : null;
    if (!currentSite) return;

    // ==================== 获取当前登录用户 ====================

    function getCurrentUser() {
        // 方法1: 从导航栏的用户头像/用户名链接获取（通常在右上角）
        // 这些链接通常有特定的class或在特定的容器中

        // NodeSeek/DeepFlood 通常用户链接在头部导航栏
        const selectors = [
            'header a[href*="/space/"]',           // 头部导航栏中的用户链接
            '.user-info a[href*="/space/"]',       // 用户信息区域
            '.user-avatar[href*="/space/"]',       // 用户头像链接
            'nav a[href*="/space/"]',              // 导航栏
            '.header a[href*="/space/"]',          // 头部区域
            '.user-card a[href*="/space/"]'        // 用户卡片
        ];

        for (const selector of selectors) {
            const link = document.querySelector(selector);
            if (link) {
                // 提取完整的用户ID
                const match = link.href.match(/\/space\/(\d+)/);
                if (match && match[1]) {
                    const userId = match[1];
                    console.log(`[${currentSite.name}] 🔍 找到用户ID: ${userId} (选择器: ${selector})`);
                    return userId;
                }
            }
        }

        // 方法2: 从页面右上角的用户区域查找
        // 查找所有可能的用户链接，但只取最可能是当前用户的（通常在最前面）
        const allUserLinks = document.querySelectorAll('a[href*="/space/"]');
        if (allUserLinks.length > 0) {
            // 优先查找包含"个人"、"我的"等关键词的链接
            for (const link of allUserLinks) {
                const text = link.textContent.trim();
                if (text.includes('个人') || text.includes('我的') || text.includes('设置')) {
                    const match = link.href.match(/\/space\/(\d+)/);
                    if (match && match[1]) {
                        console.log(`[${currentSite.name}] 🔍 通过关键词找到用户ID: ${match[1]}`);
                        return match[1];
                    }
                }
            }
        }

        console.warn(`[${currentSite.name}] ⚠️ 无法获取用户ID`);
        return null;
    }

    // 等待页面加载完成后获取用户信息
    function waitForUser(callback) {
        let retries = 0;
        const maxRetries = 10;

        const check = () => {
            const userId = getCurrentUser();

            if (userId) {
                console.log(`[${currentSite.name}] 👤 当前用户ID: ${userId}`);
                callback(userId);
            } else if (retries < maxRetries) {
                retries++;
                console.log(`[${currentSite.name}] 🔄 重试获取用户ID (${retries}/${maxRetries})`);
                setTimeout(check, 1000);
            } else {
                console.error(`[${currentSite.name}] ❌ 无法获取用户ID，脚本终止`);
            }
        };

        // 页面加载后立即检查
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', check);
        } else {
            setTimeout(check, 1000); // 延迟1秒确保页面元素加载完成
        }
    }

    // ==================== 工具函数 ====================

    function getToday() {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    function getStorageKey(siteName, userId) {
        return `autosign_${siteName.toLowerCase()}_${userId}_date`;
    }

    function isSignedToday(siteName, userId) {
        const key = getStorageKey(siteName, userId);
        return localStorage.getItem(key) === getToday();
    }

    function markSigned(siteName, userId) {
        const key = getStorageKey(siteName, userId);
        localStorage.setItem(key, getToday());
        console.log(`[${siteName}] 💾 用户 ${userId} 签到记录已保存: ${getToday()}`);
    }

    // ==================== 签到功能 ====================

	function doSignIn(siteConfig, userId) {
		console.log(`[${siteConfig.name}] 🎯 用户 ${userId} 开始签到...`);

		GM_xmlhttpRequest({
			method: 'POST',
			url: siteConfig.api,
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'Referer': `https://${siteConfig.hostname}/`,
				'Origin': `https://${siteConfig.hostname}`
			},
			withCredentials: true,
			onload: function(response) {
				console.log(`[${siteConfig.name}] 📡 响应状态码: ${response.status}`);
				// 如果还是 403，打印完整响应帮助调试
				if (response.status === 403) {
					console.log(`[${siteConfig.name}] ❌ 403 响应内容:`, response.responseText);
				}

				if (response.status >= 200 && response.status < 300) {
					try {
						const data = JSON.parse(response.responseText);
						console.log(`[${siteConfig.name}] ✅ 签到成功！`, data);

						markSigned(siteConfig.name, userId);

						let reward = '签到成功';
						if (data.data?.reward) reward = `获得 ${data.data.reward} 个鸡腿`;
						else if (data.reward) reward = `获得 ${data.reward} 个鸡腿`;
						else if (data.message) reward = data.message;
						else if (data.msg) reward = data.msg;

						showNotification(siteConfig, '✅ 签到成功', `用户 ${userId}\n${reward}`);
					} catch (e) {
						console.log(`[${siteConfig.name}] ✅ 签到成功（解析响应失败）`);
						markSigned(siteConfig.name, userId);
						showNotification(siteConfig, '✅ 签到成功', `用户 ${userId}`);
					}

				} else if (response.status === 500) {
					console.log(`[${siteConfig.name}] ℹ️ 服务器返回500，判断为已签到`);
					markSigned(siteConfig.name, userId);
					showNotification(siteConfig, 'ℹ️ 今日已签到', `用户 ${userId}\n今天已经签到过了`);

				} else if (response.status === 400) {
					console.log(`[${siteConfig.name}] ℹ️ 服务器返回400，判断为已签到`);
					markSigned(siteConfig.name, userId);

				} else {
					console.log(`[${siteConfig.name}] ⚠️ 未知状态码: ${response.status}`);
				}
			},
			onerror: function(error) {
				console.log(`[${siteConfig.name}] ❌ 签到异常:`, error);
			},
			ontimeout: function() {
				console.log(`[${siteConfig.name}] ⏱️ 请求超时`);
			},
			timeout: 10000
		});
	}

    // ==================== 通知系统 ====================

    function showNotification(siteConfig, title, message) {
        if (!document.getElementById('autosign-style')) {
            const style = document.createElement('style');
            style.id = 'autosign-style';
            style.textContent = `
                .autosign-notify {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    color: white;
                    padding: 16px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 999999;
                    font-size: 14px;
                    min-width: 260px;
                    animation: slideIn 0.3s ease;
                    cursor: pointer;
                    white-space: pre-line;
                    margin-bottom: 10px;
                }
                .autosign-title {
                    font-weight: bold;
                    margin-bottom: 6px;
                    font-size: 15px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        const notify = document.createElement('div');
        notify.className = 'autosign-notify';
        notify.style.background = siteConfig.color;
        notify.innerHTML = `
            <div class="autosign-title">${siteConfig.name} - ${title}</div>
            <div>${message}</div>
        `;

        // 计算已有通知的数量，调整位置
        const existingNotifications = document.querySelectorAll('.autosign-notify');
        const offset = existingNotifications.length * 110; // 每个通知高度约100px
        notify.style.top = `${20 + offset}px`;

        document.body.appendChild(notify);
        setTimeout(() => notify.remove(), 3000);
        notify.onclick = () => notify.remove();
    }

    // ==================== 定时重置与重试 ====================

    function scheduleMidnightReset(userId) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const delay = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(delay / 3600000);

        console.log(`[自动签到] ⏰ 距离下次重置: ${hours}小时`);

        setTimeout(() => {
            console.log(`[自动签到] 🌅 新的一天开始，清除签到记录`);
            Object.values(SITES).forEach(siteConfig => {
                localStorage.removeItem(getStorageKey(siteConfig.name, userId));
            });
            checkAndSign(userId);
            scheduleMidnightReset(userId);
        }, delay);
    }

    function scheduleHourlyRetry(userId) {
        setInterval(() => {
            Object.values(SITES).forEach(siteConfig => {
                if (!isSignedToday(siteConfig.name, userId)) {
                    console.log(`[${siteConfig.name}] 🔄 每小时重试签到`);
                    doSignIn(siteConfig, userId);
                }
            });
        }, 3600000);
    }

    // ==================== 主逻辑 ====================

    function checkAndSign(userId) {
        // 遍历所有站点，尝试签到
        let delay = 3000;
        Object.values(SITES).forEach((siteConfig, index) => {
            if (isSignedToday(siteConfig.name, userId)) {
                console.log(`[${siteConfig.name}] ✅ 用户 ${userId} 今天已签到 (${getToday()})`);
            } else {
                console.log(`[${siteConfig.name}] 📅 用户 ${userId} 今天未签到，准备执行`);
                // 每个站点延迟不同时间，避免同时发起请求
                setTimeout(() => doSignIn(siteConfig, userId), delay + index * 2000);
            }
        });
    }

    // ==================== 启动 ====================

    console.log(`[${currentSite.name}] 🚀 自动签到脚本启动`);
    console.log(`[自动签到] 📋 将同时签到: ${Object.values(SITES).map(s => s.name).join('、')}`);

    waitForUser((userId) => {
        checkAndSign(userId);
        scheduleMidnightReset(userId);
        scheduleHourlyRetry(userId);
    });

})();