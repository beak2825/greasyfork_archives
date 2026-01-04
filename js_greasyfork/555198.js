// ==UserScript==
// @name        清除数据
// @namespace   https://viayoo.com/
// @version     1.1.1
// @license      MIT
// @description 清除当前网站的localStorage、sessionStorage和Cookie数据，并显示数据大小
// @author      AI
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/555198/%E6%B8%85%E9%99%A4%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/555198/%E6%B8%85%E9%99%A4%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 计算存储数据大小
    function calculateStorageSize() {
        let totalSize = 0;
        const sizes = {
            localStorage: 0,
            sessionStorage: 0,
            cookies: 0
        };

        try {
            // 计算 localStorage 大小
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                if (key && value) {
                    sizes.localStorage += key.length + value.length;
                }
            }
        } catch (e) {
            console.error('计算 localStorage 大小时出错:', e);
        }

        try {
            // 计算 sessionStorage 大小
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                const value = sessionStorage.getItem(key);
                if (key && value) {
                    sizes.sessionStorage += key.length + value.length;
                }
            }
        } catch (e) {
            console.error('计算 sessionStorage 大小时出错:', e);
        }

        try {
            // 计算 cookies 大小
            if (document.cookie) {
                sizes.cookies = document.cookie.length;
            }
        } catch (e) {
            console.error('计算 cookies 大小时出错:', e);
        }

        totalSize = sizes.localStorage + sizes.sessionStorage + sizes.cookies;

        return {
            total: totalSize,
            ...sizes
        };
    }

    // 格式化字节大小
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 清除所有Cookie
    function clearAllCookies() {
        const hostParts = window.location.hostname.split('.');
        const domains = [
            window.location.hostname,
            ...(hostParts.length > 1 ? [`.${hostParts.slice(-2).join('.')}`] : [])
        ];

        document.cookie.split(';').forEach(cookie => {
            const name = cookie.split('=')[0].trim();
            domains.forEach(domain => {
                try {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
                } catch(e) {
                    console.error(`删除 Cookie ${name} 失败:`, e);
                }
            });
            try {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            } catch(e) {
                console.error(`删除 Cookie ${name} (无 domain) 失败:`, e);
            }
        });
    }

    // 执行清除操作
    function performClean() {
        const sizes = calculateStorageSize();
        
        if (sizes.total === 0) {
            alert("当前网站没有可清除的存储数据。");
            return;
        }

        const confirmMessage = `确定要清除当前网站的所有存储数据吗？

即将清除的数据：
• localStorage: ${formatBytes(sizes.localStorage)}
• sessionStorage: ${formatBytes(sizes.sessionStorage)}
• Cookies: ${formatBytes(sizes.cookies)}
总计: ${formatBytes(sizes.total)}`;

        if (confirm(confirmMessage)) {
            try {
                // 清除 localStorage
                localStorage.clear();
                // 清除 sessionStorage
                sessionStorage.clear();
                // 清除 Cookie
                clearAllCookies();
                
                alert("数据清除完成！\n" + 
                     "localStorage: 已清除\n" + 
                     "sessionStorage: 已清除\n" + 
                     "Cookies: 已清除\n\n" +
                     `已清理 ${formatBytes(sizes.total)} 存储数据`);
            } catch (error) {
                console.error("清除数据时发生错误:", error);
                alert("清除数据时发生错误，请查看控制台详情");
            }
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand('清除网站数据', performClean);
})();