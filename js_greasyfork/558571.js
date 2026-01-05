// ==UserScript==
// @name         XJTLU utalk 不要欢迎视频
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  如果你被首页的动图/视频吓到了，或者它们占用大量CPU/GPU，欢迎你来到这里 (支持直接跳转个人中心/最后正常链接，或替换为低资源的 favicon 占位图)
// @author       wujinjun
// @license      MIT
// @match        *://utalk.xjtlu.edu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558571/XJTLU%20utalk%20%E4%B8%8D%E8%A6%81%E6%AC%A2%E8%BF%8E%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/558571/XJTLU%20utalk%20%E4%B8%8D%E8%A6%81%E6%AC%A2%E8%BF%8E%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置开关 ---
    const is_redirect = false;          // 传统的强制跳转到 /personal-info
    const jump_to_original_url = true;  // <--- 新增: 是否启用持久化路径跳转

    // --- 路径配置 ---
    const HOMEPAGE_PATH_REGEX = /^\/home\/index(?:\/.*)?$/;             // 匹配主页 (广告页)
    const NORMAL_PATH_REGEX = /^\/(page|course)\/index(?:\/.*)?$/;    // 匹配正常内容页 (需记录)
    const STORAGE_KEY = 'UTALK_last_normal_path';              // 持久化存储键名
    
    // --- 状态与资源 ---
    const faviconUrl = getFaviconUrl() || '/favicon.ico';
    let observer_initialized = false; // 确保 MutationObserver 只被设置一次

    // ----------------------------------------------------------------------
    // --- 辅助函数 ---
    // ----------------------------------------------------------------------

    /** 尝试获取当前页面的 Favicon URL */
    function getFaviconUrl() {
        const links = document.querySelectorAll("link[rel*='icon']");
        for (const link of links) {
            if (link.href && (link.rel === 'icon' || link.rel === 'shortcut icon')) {
                return link.href;
            }
        }
        return null;
    }

    /** 核心逻辑：创建占位符并替换 <video> 元素 */
    function replaceVideoElements(scope) {
        const videoElements = scope.querySelectorAll('video');
        let count = 0;
        
        if (videoElements.length > 0) {
            for (const video of videoElements) {
                const placeholder = document.createElement('div');
                const videoStyle = window.getComputedStyle(video);
                
                // 继承尺寸和样式，防止布局跳动
                placeholder.style.cssText = `
                    display: ${videoStyle.display};
                    width: ${videoStyle.width};
                    height: ${videoStyle.height};
                    min-width: ${videoStyle.minWidth};
                    min-height: ${videoStyle.minHeight};
                    margin: ${videoStyle.margin};
                    
                    /* Favicon 样式 */
                    background-color: #f0f0f0; 
                    background-image: url(${faviconUrl});
                    background-size: 50px 50px; 
                    background-repeat: no-repeat;
                    background-position: center;
                    border: 1px dashed #ccc; 
                    text-align: center;
                `;
                
                if (video.parentNode) {
                    video.parentNode.insertBefore(placeholder, video);
                    video.remove(); 
                    count++;
                }
            }
            console.log(`[XJTLU Utalk homepage video blocker] 替换了 ${count} 个 <video> 元素为占位符。`);
        }
        return count;
    }

    /** 初始清理：替换页面加载时已存在的 <video> 元素 */
    function initialCleanup() {
        const replacedCount = replaceVideoElements(document);
        console.log(`[XJTLU Utalk homepage video blocker] 初始替换完成，共替换 ${replacedCount} 个视频。`);
    }

    // ----------------------------------------------------------------------
    // --- URL 变化监听与执行逻辑 ---
    // ----------------------------------------------------------------------

    /** 检查当前 URL 是否匹配目标路径，并执行相应的逻辑 */
    function checkAndRunLogic() {
        const currentPath = window.location.pathname;

        // --- 1. 记录正常路径 ---
        if (NORMAL_PATH_REGEX.test(currentPath)) {
            GM_setValue(STORAGE_KEY, currentPath);
            console.log(`[XJTLU Utalk homepage video blocker] 记录正常路径: ${currentPath}`);
        }

        // --- 2. 持久化主页跳转逻辑 (优先级最高) ---
        if (jump_to_original_url && HOMEPAGE_PATH_REGEX.test(currentPath)) {
            const lastNormalPath = GM_getValue(STORAGE_KEY, null);
            
            if (lastNormalPath) {
                console.log(`[XJTLU Utalk homepage video blocker] 发现主页，跳转回记录的路径: ${lastNormalPath}`);
                window.location.replace(lastNormalPath);
                return; // 立即终止脚本执行
            } else {
                console.log(`[XJTLU Utalk homepage video blocker] 发现主页，但无记录的正常路径可供跳转。`);
            }
        }
        
        // --- 3. 传统的强制重定向逻辑 ---
        if (is_redirect && HOMEPAGE_PATH_REGEX.test(currentPath)) {
            window.location.replace("https://utalk.xjtlu.edu.cn/wel/dashboard");
            return; // 立即终止脚本执行
        }

        // --- 4. 广告替换/清理逻辑 (仅在主页，且未被跳转时执行) ---
        if (HOMEPAGE_PATH_REGEX.test(currentPath)) {
            console.log(`[XJTLU Utalk homepage video blocker] URL 匹配主页 (${currentPath})，执行替换。`);
            
            // 每次 URL 切换到主页时都进行初始清理
            initialCleanup(); 
            
            // 启动 MutationObserver (只需运行一次)
            if (!observer_initialized) {
                observeForNewVideos();
                observer_initialized = true;
            }
        }
    }

    /** 持续监控：使用 MutationObserver 应对延迟加载 */
    function observeForNewVideos() {
        const observer = new MutationObserver((mutationsList, observer) => {
            // 只有在当前路径是主页时才执行替换操作
            if (!HOMEPAGE_PATH_REGEX.test(window.location.pathname)) {
                return; 
            }
            
            let totalReplaced = 0;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // 元素节点
                            totalReplaced += replaceVideoElements(node);
                        }
                    });
                }
            }
            
            if (totalReplaced > 0) {
                console.log(`[XJTLU Utalk homepage video blocker] MutationObserver 动态替换 ${totalReplaced} 个新的视频元素。`);
            }
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
        console.log('[XJTLU Utalk homepage video blocker] MutationObserver 已创建并启动。');
    }

    // ----------------------------------------------------------------------
    // --- 启动脚本与 SPA 监听设置 ---
    // ----------------------------------------------------------------------

    // 1. History API 劫持：监听 pushState 和 replaceState
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(history, arguments);
        // 延迟执行以确保 URL 更改后 DOM 有时间开始变化
        setTimeout(checkAndRunLogic, 50); 
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        setTimeout(checkAndRunLogic, 50); 
    };
    
    // 2. 监听 popstate 事件 (用户使用浏览器返回/前进按钮)
    window.addEventListener('popstate', checkAndRunLogic);

    // 3. 首次启动
    checkAndRunLogic();
    
})();
