// ==UserScript==
// @name         广告屏蔽框架
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  增强版广告屏蔽框架，支持多种选择器和调试功能
// @author       veip007
// @match        *://*/*
// @grant        GM_log
// @grant        GM_notification
// @run-at       document-end
// @license     LGPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/552399/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E6%A1%86%E6%9E%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/552399/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E6%A1%86%E6%9E%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置区域 ==========
    // 在这里填入您要屏蔽的广告选择器
    const AD_SELECTORS = [
        // ID选择器
        '#footer',

        // 类选择器
        '.sptable_do_not_remove',
        '.xqbj-list-rows-placard',
        '.ftad-ct',
        '.sptable_do_not_remove.f_one',

        // 属性选择器
        '[data-ad]',
        '[class="ad"]',

        // 复合选择器
        'div.ad-container',
        'div[class="banner"]',

        // 在此处添加更多广告选择器...
    ];

    // 需要隐藏而不是移除的元素选择器
    const HIDE_SELECTORS = [
        '.topRedirectTipsFloat'
    ];

    // 高级配置选项
    const CONFIG = {
        // 是否显示移除通知 true 或者 false
        showNotifications: false,
        // 是否记录详细日志到控制台
        enableLogging: false,
        // 是否监控动态加载的内容
        monitorDynamicContent: true,
        // 检查间隔（毫秒）
        checkInterval: 2000,
        // 是否移除父级容器（如果广告容器有父级包装）
        removeParentContainers: true,
        // 父级选择器（如果知道特定的父级容器）
        parentSelectors: [
            '.ad-wrapper',
            '.banner-container'
        ],
        // 白名单域名
        whitelistDomains: [
            'google.com',
            /c\w.\w{5,6}.\w{3}/ ,  //正则表示法
            'github.com'
        ]
    };
    // ========== 配置结束 ==========

    // 统计信息
    const stats = {
        totalRemoved: 0,
        lastCheck: 0
    };

     // 设定hideElements函数
    function hideElements() {
        let hiddenCount = 0;
        HIDE_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (document.body.contains(element)) {
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.style.opacity = '0';
                    hiddenCount++;
                }
            });
        });
        return hiddenCount;
    }


    // 隐藏特定元素
    const hiddenCount = hideElements();
    removedCount += hiddenCount; // 注意：这里我们把隐藏也算作移除，因为都是从视觉上移除

// 添加强力移除函数
function forceRemoveStubbornElements() {
    const stubbornElements = [
        '.topRedirectTipsFloat'
    ];

    let removedCount = 0;

    stubbornElements.forEach(selector => {
        // 方法1: 标准移除
        document.querySelectorAll(selector).forEach(el => {
            if (el && el.parentNode) {
                try {
                    el.remove();
                    removedCount++;
                } catch (e) {
                    try {
                        el.parentNode.removeChild(el);
                        removedCount++;
                    } catch (e2) {
                        // 最终手段：隐藏
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                        el.style.opacity = '0';
                        el.style.height = '0';
                        el.style.width = '0';
                        el.style.overflow = 'hidden';
                    }
                }
            }
        });
    });

    return removedCount;
}

// 修改主屏蔽函数
function removeAdContainers() {
    let removedCount = 0;
    const currentTime = Date.now();

    if (currentTime - stats.lastCheck < 500) {
        return removedCount;
    }
    stats.lastCheck = currentTime;

    // 原有移除逻辑
    AD_SELECTORS.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (document.body.contains(element) && isElementVisible(element)) {
                    element.remove();
                    removedCount++;
                }
            });
        } catch (error) {
            if (CONFIG.enableLogging) {
                console.error(`处理选择器 "${selector}" 时出错:`, error);
            }
        }
    });

    // 强力移除顽固元素
    const stubbornRemoved = forceRemoveStubbornElements();
    removedCount += stubbornRemoved;

        return removedCount;
    }

    // 检查元素是否可见
    function isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0' &&
               element.offsetWidth > 0 &&
               element.offsetHeight > 0;
    }

    // 移除父级容器
    function removeParentContainers(element, originalSelector) {
        let currentElement = element.parentElement;
        let levelsChecked = 0;
        const maxLevels = 5; // 最多向上检查5层

        while (currentElement && levelsChecked < maxLevels) {
            // 检查父级是否包含广告特征
            const parentHtml = currentElement.innerHTML.toLowerCase();
            const isAdParent = parentHtml.includes('ad') ||
                              parentHtml.includes('banner') ||
                              parentHtml.includes('sponsor') ||
                              currentElement.id.includes('ad') ||
                              currentElement.className.includes('ad');

            if (isAdParent && document.body.contains(currentElement)) {
                currentElement.remove();
                if (CONFIG.enableLogging) {
                    console.log(`已移除广告父级容器 (${originalSelector} 的父级)`, currentElement);
                }
                break;
            }

            currentElement = currentElement.parentElement;
            levelsChecked++;
        }
    }

    // 显示通知
    function showNotification(message) {
        // 移除之前的通知
        const existingNote = document.getElementById('adblocker-notification');
        if (existingNote) existingNote.remove();

        const notification = document.createElement('div');
        notification.id = 'adblocker-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 12px 16px;
                border-radius: 6px;
                font-size: 14px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
                font-family: Arial, sans-serif;
                cursor: pointer;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">🛡️</span>
                    <span>${message}</span>
                </div>
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;

        notification.addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        // 5秒后自动隐藏
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // 添加调试面板
    function createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'adblock-debug-panel';
        panel.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-size: 12px;
                z-index: 9999;
                font-family: Arial, sans-serif;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong>广告屏蔽调试面板</strong>
                    <button id="adblock-close-panel" style="background: none; border: none; color: white; cursor: pointer;">×</button>
                </div>
                <div>已屏蔽: <span id="adblock-counter">0</span> 个元素</div>
                <div style="margin-top: 10px;">
                    <button id="adblock-manual-check" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">手动检查</button>
                    <button id="adblock-test-selectors" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">测试选择器</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 更新计数器
        const updateCounter = () => {
            const counter = document.getElementById('adblock-counter');
            if (counter) {
                counter.textContent = stats.totalRemoved;
            }
        };

        // 关闭面板
        document.getElementById('adblock-close-panel').addEventListener('click', () => {
            panel.remove();
        });

        // 手动检查
        document.getElementById('adblock-manual-check').addEventListener('click', () => {
            const count = removeAdContainers();
            updateCounter();
            showNotification(`手动检查完成，屏蔽了 ${count} 个元素`);
        });

        // 测试选择器
        document.getElementById('adblock-test-selectors').addEventListener('click', () => {
            testSelectors();
        });

        // 初始更新计数器
        updateCounter();
        return panel;
    }

    // 测试选择器功能
    function testSelectors() {
        console.group('广告选择器测试');
        AD_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`选择器 "${selector}": 找到 ${elements.length} 个元素`);
            elements.forEach((element, index) => {
                console.log(`  [${index}]`, element);
            });
        });
        console.groupEnd();

        showNotification(`选择器测试完成，查看控制台了解详情`);
    }

    // 检查是否在白名单域名上
    function isWhitelisted() {
        const currentDomain = window.location.hostname;
        return CONFIG.whitelistDomains.some(domain =>
            currentDomain.includes(domain)
        );
    }

    // 初始化脚本
    function init() {
        // 如果在白名单域名上，不运行脚本
        if (isWhitelisted()) {
            if (CONFIG.enableLogging) {
                console.log('当前域名在白名单中，广告屏蔽已跳过');
            }
            return;
        }

        if (CONFIG.enableLogging) {
            console.log('广告屏蔽框架已启动');
            console.log('监控的广告选择器:', AD_SELECTORS);
        }

        // 创建调试面板
        if (CONFIG.enableLogging) {
            setTimeout(() => {
                createDebugPanel();
            }, 2000);
        }

        // 页面加载后立即执行一次
        setTimeout(() => {
            const count = removeAdContainers();
            if (count > 0 && CONFIG.enableLogging) {
                console.log(`初始扫描移除了 ${count} 个广告元素`);
            }
        }, 1000);

        // 监听DOM变化，处理动态加载的广告
        if (CONFIG.monitorDynamicContent) {
            const observer = new MutationObserver(function(mutations) {
                let shouldCheck = false;

                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // 检查新增的元素是否匹配任何选择器
                            AD_SELECTORS.forEach(selector => {
                                try {
                                    if (node.matches && node.matches(selector)) {
                                        shouldCheck = true;
                                    }

                                    // 检查子元素
                                    if (node.querySelectorAll && node.querySelectorAll(selector).length > 0) {
                                        shouldCheck = true;
                                    }
                                } catch (e) {
                                    // 忽略选择器语法错误
                                }
                            });
                        }
                    });
                });

                if (shouldCheck) {
                    setTimeout(removeAdContainers, 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // 设置定时检查（针对可能延迟加载的广告）
        setInterval(removeAdContainers, CONFIG.checkInterval);
    }

    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 暴露函数到全局，方便调试
    window.adBlock = {
        removeAds: removeAdContainers,
        testSelectors: testSelectors,
        stats: stats
    };
})();