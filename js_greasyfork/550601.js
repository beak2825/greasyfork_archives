// ==UserScript==
// @name         机场密码管理器支持
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  修改机场网站的登录表单，使其能被密码管理器自动识别
// @author       Seameee
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550601/%E6%9C%BA%E5%9C%BA%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86%E5%99%A8%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/550601/%E6%9C%BA%E5%9C%BA%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86%E5%99%A8%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置对象
    const config = {
        emailSelector: 'input[placeholder="邮箱"]',
        passwordSelector: 'input[placeholder="密码"]',
        maxAttempts: 50, // 最大尝试次数
        interval: 300    // 检查间隔（毫秒）
    };

    // 全局变量存储观察器和定时器，用于清理
    let domObserver = null;
    let routeObserver = null;
    let pollInterval = null;
    let initExecuted = false;

    // 清理所有资源
    function cleanup() {
        if (domObserver) {
            domObserver.disconnect();
            domObserver = null;
            console.log('🧹 DOM观察器已断开');
        }
        if (routeObserver) {
            routeObserver.disconnect();
            routeObserver = null;
            console.log('🧹 路由观察器已断开');
        }
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
            console.log('🧹 轮询定时器已清除');
        }
    }

    // 检测目标脚本元素
    function hasTargetScript() {
        const targetScript = document.querySelector(
            'script[type="module"][crossorigin][src*="/theme/Xboard/assets/umi.js"]'
        );
        return targetScript !== null;
    }

    // 修改输入框属性以支持密码管理器
    function modifyInputFields() {
        const emailInput = document.querySelector(config.emailSelector);
        const passwordInput = document.querySelector(config.passwordSelector);

        if (emailInput && passwordInput) {
            console.log('找到登录表单，开始修改属性...');

            // 修改邮箱输入框
            if (emailInput.type === 'text') {
                emailInput.type = 'email';
                emailInput.setAttribute('autocomplete', 'username');
                emailInput.setAttribute('name', 'email');
                emailInput.setAttribute('id', 'email');
                console.log('✅ 邮箱输入框已修改');
            }

            // 修改密码输入框
            if (passwordInput.type === 'password') {
                passwordInput.setAttribute('autocomplete', 'current-password');
                passwordInput.setAttribute('name', 'password');
                passwordInput.setAttribute('id', 'password');
                console.log('✅ 密码输入框已修改');
            }

            // 为表单添加 autocomplete 属性
            const form = emailInput.closest('form') || passwordInput.closest('form');
            if (form) {
                form.setAttribute('autocomplete', 'on');
                console.log('✅ 表单已添加 autocomplete 属性');
            }

            return true; // 修改成功
        }
        return false; // 未找到元素
    }

    // 使用 MutationObserver 监控DOM变化
    function setupMutationObserver() {
        // 如果已存在观察器，先断开
        if (domObserver) {
            domObserver.disconnect();
        }

        domObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    // 检查是否有新节点添加
                    modifyInputFields();
                }
            });
        });

        // 开始观察整个文档
        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('🔍 DOM观察器已启动');
    }

    // 轮询检查元素是否存在
    function pollForElements() {
        let attempts = 0;

        // 清除之前的定时器
        if (pollInterval) {
            clearInterval(pollInterval);
        }

        pollInterval = setInterval(() => {
            attempts++;

            if (modifyInputFields()) {
                clearInterval(pollInterval);
                pollInterval = null;
                console.log('🎉 脚本执行完成');
                return;
            }

            if (attempts >= config.maxAttempts) {
                clearInterval(pollInterval);
                pollInterval = null;
                console.log('⚠️ 达到最大尝试次数，停止检查');
            }
        }, config.interval);
    }

    // 页面加载完成后执行
    function init() {
        // 防止重复执行
        if (initExecuted) {
            return;
        }
        initExecuted = true;

        // 立即检测目标元素
        if (hasTargetScript()) {
            console.log('🎯 检测到目标脚本，开始执行功能');

            // 立即尝试修改
            if (modifyInputFields()) {
                console.log('🎉 立即修改成功');
                // 启动路由监听
                setupRouteChangeListener();
                return;
            }

            // 设置DOM观察器
            setupMutationObserver();

            // 开始轮询检查
            pollForElements();

            // 启动路由监听
            setupRouteChangeListener();
        } else {
            console.log('❌ 未检测到目标脚本，脚本停止运行');
            // 完全停止，不进行任何操作
            return;
        }
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听路由变化（对于SPA应用）
    function setupRouteChangeListener() {
        // 如果已存在观察器，先断开
        if (routeObserver) {
            routeObserver.disconnect();
        }

        let lastUrl = location.href;
        routeObserver = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                console.log('🔄 检测到路由变化，重新检查表单');
                setTimeout(modifyInputFields, 1000);
            }
        });

        routeObserver.observe(document, { subtree: true, childList: true });
        console.log('🛣️ 路由变化监听器已启动');
    }

    // 监听页面卸载事件，清理资源
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);

    // 对于SPA应用，监听页面隐藏事件
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            cleanup();
        }
    });

})();
