// ==UserScript==
// @name         DeepSeek网页端内存溢出修复 (DeepSeek Web Version Out Of Memory Fix)
// @description  阻止Deepseek的collect-rangers收集脚本修复内存溢出问题 (Blocks the collect-rangers analytics script on DeepSeek to fix memory overflow issues.)
// @namespace    https://github.com/deepseek-ai/DeepSeek-V3/issues/1061
// @version      1.0.1
// @author       deepseek
// @match        https://*.deepseek.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561569/DeepSeek%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA%E4%BF%AE%E5%A4%8D%20%28DeepSeek%20Web%20Version%20Out%20Of%20Memory%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561569/DeepSeek%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA%E4%BF%AE%E5%A4%8D%20%28DeepSeek%20Web%20Version%20Out%20Of%20Memory%20Fix%29.meta.js
// ==/UserScript==

//log前缀
const LOG_PREFIX = '[DeepSeek OOM Fix] ';
// 匹配 collect-rangers-vx.x.x.js 格式的所有版本
const TARGET_PATTERN = /collect-rangers-v\d+\.\d+\.\d+\.js/;

(function() {
    'use strict';
    console.log(LOG_PREFIX + 'DeepSeek Web Version Out Of Memory Fix Started');

    // 1. 全局变量伪装 (防止其他脚本因为找不到函数而崩溃或持续堆积内存)
    window.collectEvent = function() { /* 静默处理所有日志事件 */ };
    window.LogAnalyticsObject = 'collectEvent';
    // 覆盖 DATAFLUX_RUM 对象，防止其队列堆积内存
    window.DATAFLUX_RUM = {
        q: [],
        onReady: function(cb) { /* 直接忽略回调或立即执行 */ },
        init: function() { /* 静默 */ },
        addAction: function() { /* 静默 */ },
        addError: function() { /* 静默 */ }
    };

    // 2. 实时 DOM 监控 (处理动态插入的脚本节点)
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src && TARGET_PATTERN.test(node.src)) {
                    console.log(LOG_PREFIX + 'Try Remove Dynamic Script: ', node.src);
                    try
                    {
                        node.pause && node.pause(); // 尝试暂停执行
                        node.parentNode.removeChild(node);//node.remove();
                        console.log(LOG_PREFIX + 'Dynamic Script Removed!');
                    } catch (e) {
                        console.error(LOG_PREFIX + 'Dynamic Script Remove Error: ', e);
                    }
                }
            }
        }
    });

    // 尽早开始监控
    observer.observe(document.documentElement || document, { childList: true, subtree: true });

    // 3. 静态节点清理 (处理脚本运行前已经存在的节点)
    const cleanStatic = () => {
        document.querySelectorAll('script').forEach(script => {
            if (TARGET_PATTERN.test(script.src)) {
                console.log(LOG_PREFIX + 'Try Remove Static Script: ', script.src);
                try {
                    script.parentNode.removeChild(script);// 相比script.remove();兼容性更好
                    console.log(LOG_PREFIX + 'Static Script Removed!');
                } catch (e) {
                    console.error(LOG_PREFIX + 'Static Script Remove Error: ', e);
                }
            }
        });
    };

    // 尝试立即清理一次
    cleanStatic();
    // 确保在 DOM 加载完成后再清理一次残留
    document.addEventListener('DOMContentLoaded', cleanStatic);
})();
