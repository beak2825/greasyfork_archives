// ==UserScript==
// @name         搜索引擎快速切换 (百度/必应/谷歌)
// @name:en      Search Engine Quick Switcher (Baidu/Bing/Google)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  使用快捷键 Alt+S 在百度、必应、谷歌之间循环切换搜索引擎，并保留当前搜索词。Alt+G切换Google开关。
// @description:en Use Alt+S to cycle through Baidu, Bing, and Google search engines, keeping the current search query. Toggle Google with Alt+G.
// @author       whyzzjw
// @license      MIT
// @match        *://www.baidu.com/s*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/555473/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%20%28%E7%99%BE%E5%BA%A6%E5%BF%85%E5%BA%94%E8%B0%B7%E6%AD%8C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555473/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%20%28%E7%99%BE%E5%BA%A6%E5%BF%85%E5%BA%94%E8%B0%B7%E6%AD%8C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const engines = [
        {
            name: 'baidu',
            host: 'baidu.com',
            param: 'wd',
            url: 'https://www.baidu.com/s?wd='
        },
        {
            name: 'bing',
            host: 'bing.com',
            param: 'q',
            url: 'https://www.bing.com/search?q='
        },
        {
            name: 'google',
            host: 'google.com',
            param: 'q',
            url: 'https://www.google.com/search?q=',
            toggleable: true  // 标记为可切换
        }
    ];

    // --- 提示消息函数 ---
    function showNotification(message, isEnabled) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 10000;
            padding: 15px 20px;
            background: ${isEnabled ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 5px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // 2秒后消失
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // --- Google 开关管理 ---
    let isGoogleEnabled = GM_getValue('googleEnabled', true);

    // 获取当前可用的搜索引擎列表
    function getActiveEngines() {
        return engines.filter(engine => {
            if (engine.toggleable && !isGoogleEnabled) {
                return false;
            }
            return true;
        });
    }

    // 切换 Google 开关
    function toggleGoogle() {
        isGoogleEnabled = !isGoogleEnabled;
        GM_setValue('googleEnabled', isGoogleEnabled);
        showNotification(
            `Google 已${isGoogleEnabled ? '启用' : '禁用'}`,
            isGoogleEnabled
        );
    }

    // --- 核心逻辑 ---
    const currentUrl = new URL(window.location.href);
    const currentHost = currentUrl.hostname;

    let currentEngineIndex = -1;
    let query = '';

    // 识别当前搜索引擎
    for (let i = 0; i < engines.length; i++) {
        if (currentHost.includes(engines[i].host)) {
            currentEngineIndex = i;
            query = currentUrl.searchParams.get(engines[i].param);
            break;
        }
    }

    if (currentEngineIndex === -1 || !query) {
        console.log('Search Switcher: Not on a recognized search page or no query found.');
        return;
    }

    // 切换到下一个搜索引擎
    function switchToNextEngine() {
        const activeEngines = getActiveEngines();
        
        // 找到当前引擎在激活列表中的位置
        let currentActiveIndex = -1;
        for (let i = 0; i < activeEngines.length; i++) {
            if (activeEngines[i].name === engines[currentEngineIndex].name) {
                currentActiveIndex = i;
                break;
            }
        }

        if (currentActiveIndex === -1) {
            // 如果当前引擎不在激活列表中，切换到第一个可用引擎
            currentActiveIndex = -1;
        }

        const nextEngineIndex = (currentActiveIndex + 1) % activeEngines.length;
        const nextEngine = activeEngines[nextEngineIndex];

        const newSearchUrl = nextEngine.url + encodeURIComponent(query);
        window.location.href = newSearchUrl;
    }

    // 监听键盘事件
    document.addEventListener('keydown', (e) => {
        // Alt + S: 切换搜索引擎
        if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            switchToNextEngine();
        }
        
        // Alt + G: 切换 Google 开关
        if (e.altKey && e.key.toLowerCase() === 'g') {
            e.preventDefault();
            toggleGoogle();
        }
    });

})();
