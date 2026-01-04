// ==UserScript==
// @name         拼多多商家后台功能增强
// @namespace    http://tampermonkey.net/
// @version      2.6.4
// @description  为拼多多商家后台提供多种批量操作功能增强
// @author       Tarktip
// @match        https://mms.pinduoduo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554118/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/554118/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================
    // 配置中心 - 在这里管理所有脚本路由
    // ================================
    const scriptRouter = {
        // 通用脚本 - 在所有页面执行
        universal: [
            {
                name: '自动点击 加载更多商品',
                init: initloadingpddcom
            }
        ],

        // 特定页面脚本 - 根据URL模式匹配执行
        specific: [
            {
                name: '全站营销批量结束工具',
                patterns: [
                    {
                        pattern: '/kit/incubator?tool_full_channel=10921_51073&tab=createdRecords&activeKey=5',
                        exact: false
                    },
                    {
                        pattern: '/kit/incubator?tool_full_channel=10921_51073&tab=createdRecords&activeKey=4',
                        exact: false
                    },
                    {
                        pattern: '/kit/incubator?tool_full_channel=10921_51073',
                        exact: true
                    },
                    {
                        pattern: '/kit/full-site-marketing?tool_full_channel=10921_51073',
                        exact: true
                    },
                    {
                        pattern: '/kit/full-site-marketing?tool_full_channel=10921_51073&activeKey=3',
                        exact: false
                    },
                    {
                        pattern: '/kit/full-site-marketing?tool_full_channel=10921_51073&activeKey=1',
                        exact: false
                    }
                ],
                init: initAllSiteMarketing,
                loaded: false
            },
            {
                name: '限时限量批量结束工具',
                patterns: [
                    {
                        pattern: '/tool/promotion?tool_full_channel=10921_77271',
                        exact: true
                    },
                    {
                        pattern: '/tool/promotion?tool_full_channel=10921_77271&activeKey=0',
                        exact: false
                    }
                ],
                init: initTimeLimitedPromotion,
                loaded: false
            },
            {
                name: '限时限量创建时复制商品id工具',
                patterns: [
                    {
                        pattern: '/tool/promotion/create?tool_full_channel=10921_77271',
                        exact: false
                    }
                ],
                init: initTimeLimitedPromotionCreateID,
                loaded: false
            },
            {
                name: '限时限量创建时自动填入工具',
                patterns: [
                    {
                        pattern: '/tool/promotion/create?tool_full_channel=10921_77271',
                        exact: false
                    }
                ],
                init: initTimeLimitedPromotionCreateAdd,
                loaded: false
            },
            {
                name: '优惠券批量结束工具',
                patterns: [
                    {
                        pattern: '/tool/coupon?tab=1',
                        exact: true
                    },
                    {
                        pattern: '/tool/coupon?tab=1&couponStatusFilter=1',
                        exact: false
                    }
                ],
                init: initCoupon,
                loaded: false
            },
            {
                name: '新客立减批量结束工具',
                patterns: [
                    {
                        pattern: '/kit/new?tool_full_channel=10921_66105',
                        exact: true
                    },
                    {
                        pattern: '/kit/new?tool_full_channel=10921_66105&activeKey=1',
                        exact: false
                    }
                ],
                init: initNewCustomers,
                loaded: false
            },
            {
                name: '活动批量取消工具',
                patterns: [
                    {
                        pattern: '/act/register_record?tab=1',
                        exact: false
                    },
                    {
                        pattern: '/act/register_record?tab=2',
                        exact: false
                    },
                    {
                        pattern: '/act/register_record?tab=3',
                        exact: false
                    }
                ],
                init: initDiscount,
                loaded: false
            },
            {
                name: '商品价格库存快速修改工具',
                patterns: [
                    {
                        pattern: '/goods/goods_list',
                        exact: false
                    }
                ],
                init: initgoodslist,
                loaded: false
            },
            // 在这里继续添加新的脚本...
        ]
    };

    // ================================
    // 全局状态管理
    // ================================
    let currentDomain = window.location.hostname;
    let currentPath = window.location.pathname + window.location.search;
    let currentScripts = new Set(); // 当前加载的脚本名称
    let wasPreviouslyMatched = false; // 记录上次检查时是否匹配
    let observer = null;
    let recheckTimeout = null;

    // ================================
    // URL匹配函数
    // ================================
    function isUrlMatch(patternConfig, url) {
        const { pattern, exact } = patternConfig;

        if (exact) {
            // 精确匹配：URL必须完全相等
            return url === pattern;
        } else {
            // 模糊匹配：URL包含模式即可
            return url.includes(pattern);
        }
    }

    function shouldLoadScript(script) {
        const currentUrl = window.location.pathname + window.location.search;

        return script.patterns.some(patternConfig =>
            isUrlMatch(patternConfig, currentUrl)
        );
    }

    function hasAnyMatchingScript() {
        return scriptRouter.specific.some(script => shouldLoadScript(script));
    }

    // ================================
    // 脚本生命周期管理
    // ================================
    function loadScript(script) {
        if (script.loaded) {
            console.log(`📁 脚本 "${script.name}" 已加载，跳过`);
            return;
        }

        try {
            console.log(`🚀 加载脚本: ${script.name}`);
            script.init();
            script.loaded = true;
            currentScripts.add(script.name);
            console.log(`✅ 脚本 "${script.name}" 加载成功`);
        } catch (error) {
            console.error(`❌ 脚本 "${script.name}" 加载失败:`, error);
            script.loaded = false;
        }
    }

    function unloadAllScripts() {
        console.log('🧹 清理所有脚本状态...');
        scriptRouter.specific.forEach(script => {
            script.loaded = false;
        });
        currentScripts.clear();
    }

    // ================================
    // 域名和URL变化检测
    // ================================
    function hasDomainChanged() {
        return currentDomain !== window.location.hostname;
    }

    function hasPathChanged() {
        const newPath = window.location.pathname + window.location.search;
        const changed = currentPath !== newPath;
        if (changed) {
            currentPath = newPath;
        }
        return changed;
    }

    function shouldRefreshPage() {
        const currentMatched = hasAnyMatchingScript();

        // 关键修复：只有当从匹配状态变为不匹配状态时才刷新
        if (wasPreviouslyMatched && !currentMatched) {
            console.log('🔄 检测到从匹配页面跳转到不匹配页面，需要刷新');
            wasPreviouslyMatched = currentMatched; // 更新状态
            return true;
        }

        // 更新匹配状态
        wasPreviouslyMatched = currentMatched;
        return false;
    }

    // ================================
    // 智能DOM监听
    // ================================
    function setupDOMObserver() {
        // 防抖函数，避免频繁触发
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        const handleDOMChange = debounce(() => {
            console.log('🔄 检测到DOM变化，重新检查脚本...');

            // 检查是否需要刷新页面（只在从匹配变为不匹配时刷新）
            if (shouldRefreshPage()) {
                console.log('🔄 刷新页面...');
                window.location.reload();
                return;
            }

            // 检查路径是否变化
            if (hasPathChanged()) {
                console.log('📍 检测到路径变化，重新加载脚本...');
                unloadAllScripts();
                executeScripts();
            } else {
                // 路径未变化，只检查未加载的脚本
                executeScripts(true);
            }
        }, 300);

        // 设置MutationObserver监听DOM变化
        observer = new MutationObserver((mutations) => {
            // 只关注有意义的DOM变化
            const hasSignificantChange = mutations.some(mutation => {
                // 忽略属性变化和字符数据变化
                if (mutation.type === 'attributes' || mutation.type === 'characterData') {
                    return false;
                }

                // 只关注添加/删除节点
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    return true;
                }

                return false;
            });

            if (hasSignificantChange) {
                handleDOMChange();
            }
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        console.log('👀 DOM监听器已启动');
    }

    // ================================
    // SPA路由变化监听
    // ================================
    function setupSPAListener() {
        // 监听pushState和replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            triggerRecheck();
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            triggerRecheck();
        };

        // 监听popstate事件（浏览器前进后退）
        window.addEventListener('popstate', triggerRecheck);

        console.log('🔄 SPA路由监听器已启动');
    }

    function triggerRecheck() {
        if (recheckTimeout) {
            clearTimeout(recheckTimeout);
        }

        recheckTimeout = setTimeout(() => {
            console.log('🔄 SPA路由变化，重新检查...');

            // 关键修复：只在从匹配变为不匹配时刷新
            if (shouldRefreshPage()) {
                console.log('🔄 刷新页面...');
                window.location.reload();
            } else if (hasPathChanged()) {
                console.log('📍 路由变化，重新加载脚本...');
                unloadAllScripts();
                executeScripts();
            }
        }, 100);
    }

    // ================================
    // 脚本执行器
    // ================================
    function executeScripts(onlyNew = false) {
        const currentUrl = window.location.pathname + window.location.search;
        console.log(`🎯 当前页面: ${currentUrl}`);

        // 更新初始匹配状态
        const currentMatched = hasAnyMatchingScript();
        wasPreviouslyMatched = currentMatched;

        // 1. 执行通用脚本（每次都会执行）
        console.log('🔧 执行通用脚本...');
        scriptRouter.universal.forEach(script => {
            try {
                script.init();
                console.log(`✅ 通用脚本 "${script.name}" 已执行`);
            } catch (error) {
                console.error(`❌ 通用脚本 "${script.name}" 执行失败:`, error);
            }
        });

        // 2. 执行匹配的特定页面脚本
        if (!onlyNew) {
            console.log('🎯 检查特定页面脚本...');
            unloadAllScripts(); // 重新加载所有脚本
        } else {
            console.log('🎯 检查未加载的特定页面脚本...');
        }

        let loadedCount = 0;
        scriptRouter.specific.forEach(script => {
            if (shouldLoadScript(script)) {
                if (!onlyNew || !script.loaded) {
                    loadScript(script);
                    loadedCount++;
                }
            }
        });

        console.log(`📊 脚本执行完成: ${loadedCount} 个特定脚本已加载`);
        console.log(`📋 当前加载的脚本: ${Array.from(currentScripts).join(', ') || '无'}`);
        console.log(`🎯 当前页面匹配状态: ${currentMatched ? '匹配' : '不匹配'}`);
    }


    // ================================
    // 通用脚本 - 在所有页面执行
    // ================================
    function initloadingpddcom() {
        (function() {
            'use strict';

            // 创建自动加载按钮
            function createAutoLoadButton() {
                // 检查按钮是否已存在
                if (document.getElementById('autoLoadAllProducts')) {
                    return;
                }

                const button = document.createElement('button');
                button.id = 'autoLoadAllProducts';
                button.innerHTML = '自动加载所有商品信息';
                button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            padding: 12px 20px;
            background: linear-gradient(135deg, #ff4d4f, #ff7875);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
            transition: all 0.3s ease;
        `;

                // 添加悬停效果
                button.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 6px 16px rgba(255, 77, 79, 0.4)';
                });

                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 4px 12px rgba(255, 77, 79, 0.3)';
                });

                // 添加点击事件
                button.addEventListener('click', startAutoLoading);

                document.body.appendChild(button);
            }

            // 查找加载更多按钮
            function findLoadMoreButton() {
                // 方法1：通过span文本内容查找
                const spanElements = document.querySelectorAll('span');
                for (let span of spanElements) {
                    if (span.textContent.trim() === '点击加载更多商品') {
                        const button = span.closest('a');
                        if (button) {
                            return button;
                        }
                    }
                }

                // 方法2：通过包含文本的a标签查找
                const allButtons = document.querySelectorAll('a');
                for (let btn of allButtons) {
                    const span = btn.querySelector('span');
                    if (span && span.textContent.trim() === '点击加载更多商品') {
                        return btn;
                    }
                }

                return null;
            }

            // 检查是否还有更多商品可以加载
            function hasMoreProducts() {
                return findLoadMoreButton() !== null;
            }

            // 点击加载更多按钮
            async function clickLoadMoreButton() {
                const button = findLoadMoreButton();
                if (button) {
                    console.log('找到加载更多按钮，正在点击...');

                    // 滚动到按钮位置
                    button.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // 添加点击效果
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);

                    // 模拟点击
                    button.click();

                    return true;
                }
                return false;
            }

            // 显示状态信息
            function showStatus(message, isError = false) {
                // 移除旧的状态信息
                const oldStatus = document.getElementById('autoLoadStatus');
                if (oldStatus) {
                    oldStatus.remove();
                }

                const status = document.createElement('div');
                status.id = 'autoLoadStatus';
                status.textContent = message;
                status.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            z-index: 10000;
            padding: 10px 16px;
            background: ${isError ? '#ff4d4f' : '#52c41a'};
            color: white;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            max-width: 200px;
            word-wrap: break-word;
        `;

                document.body.appendChild(status);

                // 3秒后自动消失
                setTimeout(() => {
                    if (status.parentNode) {
                        status.remove();
                    }
                }, 3000);
            }

            // 开始自动加载
            async function startAutoLoading() {
                const button = document.getElementById('autoLoadAllProducts');
                button.disabled = true;
                button.innerHTML = '加载中...';
                button.style.background = 'linear-gradient(135deg, #d9d9d9, #bfbfbf)';

                let clickCount = 0;
                const maxClicks = 100; // 防止无限循环

                try {
                    showStatus('开始自动加载商品...');

                    while (clickCount < maxClicks) {
                        if (!hasMoreProducts()) {
                            showStatus(`加载完成！共点击了 ${clickCount} 次`);
                            break;
                        }

                        const clicked = await clickLoadMoreButton();
                        if (clicked) {
                            clickCount++;
                            showStatus(`已点击 ${clickCount} 次，继续加载...`);
                        } else {
                            showStatus('未找到加载按钮，可能已加载完成', true);
                            break;
                        }

                        // 等待一段时间让页面加载新内容
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    }

                    if (clickCount >= maxClicks) {
                        showStatus('已达到最大点击次数，可能还有更多商品', true);
                    }

                } catch (error) {
                    console.error('自动加载出错:', error);
                    showStatus('加载过程中出现错误', true);
                } finally {
                    // 恢复按钮状态
                    button.disabled = false;
                    button.innerHTML = '自动加载所有商品信息';
                    button.style.background = 'linear-gradient(135deg, #ff4d4f, #ff7875)';
                }
            }

            // 页面加载完成后初始化按钮
            function init() {
                // 等待页面完全加载
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', createAutoLoadButton);
                } else {
                    createAutoLoadButton();
                }

                // 监听页面变化（针对SPA应用）
                const observer = new MutationObserver(function(mutations) {
                    // 检查按钮是否存在，如果不存在则重新创建
                    if (!document.getElementById('autoLoadAllProducts')) {
                        createAutoLoadButton();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            // 启动脚本
            init();
        })();
    }

    // ================================
    // 特定页面脚本 - 全站营销
    // ================================
    function initAllSiteMarketing() {
        (function() {
            'use strict';

            // 创建悬浮窗样式
            const style = document.createElement('style');
            style.textContent = `
        .batch-end-progress {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 400px;
            max-width: 500px;
            cursor: move;
            user-select: none;
        }
        .progress-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1890ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: #1890ff;
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-text {
            margin: 10px 0;
            font-size: 12px;
            color: #666;
        }
        .current-item {
            margin: 10px 0;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 12px;
            max-height: 60px;
            overflow-y: auto;
            border-left: 3px solid #1890ff;
        }
        .progress-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            gap: 10px;
        }
        .progress-controls button {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .progress-controls button:hover {
            background: #f5f5f5;
        }
        .progress-controls button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .progress-controls button.danger {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
        .progress-minimized {
            position: fixed;
            top: 50%;
            right: 20px;
            background: white;
            border: 1px solid #1890ff;
            border-radius: 20px;
            padding: 10px 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10000;
            cursor: pointer;
            font-size: 12px;
            color: #1890ff;
            user-select: none;
        }
        .progress-completed {
            border-color: #52c41a;
        }
        .progress-completed .progress-header {
            color: #52c41a;
        }
        .conditional-filter-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            min-width: 400px;
            max-width: 500px;
            cursor: move;
            user-select: none;
        }
        .filter-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1890ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .filter-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
        }
        .filter-checkbox {
            margin-right: 10px;
        }
        .filter-label {
            min-width: 120px;
            font-size: 14px;
            margin-right: 10px;
        }
        .filter-input {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
        }
        .filter-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 10px;
        }
        .filter-controls button {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .filter-controls button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .filter-controls button.danger {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
        .batch-end-buttons {
            margin: 10px 0;
            display: flex;
            gap: 10px;
        }
        .batch-end-buttons button {
            padding: 8px 16px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .batch-end-buttons button:hover {
            background: #f5f5f5;
        }
        .batch-end-buttons button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
    `;
            document.head.appendChild(style);

            // 全局控制变量
            let isPaused = false;
            let isStopped = false;
            let currentProcess = null;

            // 页面结构检测
            function detectPageStructure() {
                // 检查第一种结构（旧结构）
                const oldStructure = document.querySelector('tr[data-testid="beast-core-table-body-tr"] [data-tracking-viewid="el_finish"]');
                // 检查第二种结构（新结构）
                const newStructure = document.querySelector('tr[data-testid="beast-core-table-body-tr"] [data-tracking-viewid="el_end"]');

                if (oldStructure) {
                    return 'old';
                } else if (newStructure) {
                    return 'new';
                } else {
                    return 'unknown';
                }
            }

            // 添加批量结束按钮
            function addBatchEndButtons() {
                // 查找合适的位置添加按钮
                const toolbar = document.querySelector('.TB_bottom_5-169-0') ||
                      document.querySelector('.TB_top_5-169-0') ||
                      document.querySelector('[data-testid="beast-core-table"]')?.parentNode ||
                      document.querySelector('.createdRecords_topWrapper__2PhLd');

                if (toolbar && !document.querySelector('#batchEndButtons')) {
                    const buttonContainer = document.createElement('div');
                    buttonContainer.id = 'batchEndButtons';
                    buttonContainer.className = 'batch-end-buttons';
                    buttonContainer.innerHTML = `
                <button id="endCurrentPageBtn" class="primary">结束当前页所有</button>
                <button id="endAllBtn" class="primary">结束所有</button>
                <button id="conditionalEndBtn" class="primary">条件筛选结束</button>
            `;

                    // 插入到合适位置
                    const table = document.querySelector('[data-testid="beast-core-table"]');
                    if (table && table.parentNode) {
                        table.parentNode.insertBefore(buttonContainer, table);
                    } else if (toolbar.classList.contains('createdRecords_topWrapper__2PhLd')) {
                        // 第二种结构：插入到顶部容器内
                        toolbar.appendChild(buttonContainer);
                    } else {
                        toolbar.insertBefore(buttonContainer, toolbar.firstChild);
                    }

                    // 添加事件监听
                    document.getElementById('endCurrentPageBtn').addEventListener('click', endCurrentPageAll);
                    document.getElementById('endAllBtn').addEventListener('click', endAll);
                    document.getElementById('conditionalEndBtn').addEventListener('click', showConditionalFilterModal);
                }
            }

            // 显示条件筛选模态框
            function showConditionalFilterModal() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                const modal = document.createElement('div');
                modal.className = 'conditional-filter-modal';
                modal.innerHTML = `
            <div class="filter-header">
                <span>条件筛选设置</span>
                <button class="close-btn" style="background:none;border:none;cursor:pointer;font-size:16px;">×</button>
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="productNameCheck">
                <label class="filter-label">商品名称包含</label>
                <input type="text" class="filter-input" id="productNameInput" placeholder="输入商品名称关键字">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="minPriceCheck">
                <label class="filter-label">当前单件实收最低价小于</label>
                <input type="number" class="filter-input" id="minPriceInput" placeholder="输入最低价阈值" step="0.01">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="maxPriceCheck">
                <label class="filter-label">当前单件实收最高价小于</label>
                <input type="number" class="filter-input" id="maxPriceInput" placeholder="输入最高价阈值" step="0.01">
            </div>
            <div class="filter-controls">
                <button id="closeFilterBtn" class="danger">关闭窗口</button>
                <button id="startFilterEndBtn" class="primary">启动结束</button>
            </div>
        `;

                // 添加拖拽功能
                makeDraggable(modal);

                // 关闭按钮
                modal.querySelector('.close-btn').addEventListener('click', () => {
                    modal.remove();
                });

                // 关闭窗口按钮
                modal.querySelector('#closeFilterBtn').addEventListener('click', () => {
                    modal.remove();
                });

                // 启动结束按钮
                modal.querySelector('#startFilterEndBtn').addEventListener('click', () => {
                    const conditions = {
                        productName: {
                            enabled: document.getElementById('productNameCheck').checked,
                            value: document.getElementById('productNameInput').value.trim()
                        },
                        minPrice: {
                            enabled: document.getElementById('minPriceCheck').checked,
                            value: parseFloat(document.getElementById('minPriceInput').value) || 0
                        },
                        maxPrice: {
                            enabled: document.getElementById('maxPriceCheck').checked,
                            value: parseFloat(document.getElementById('maxPriceInput').value) || 0
                        }
                    };

                    // 验证至少选择了一个条件
                    if (!conditions.productName.enabled && !conditions.minPrice.enabled && !conditions.maxPrice.enabled) {
                        alert('请至少选择一个筛选条件！');
                        return;
                    }

                    modal.remove();
                    startConditionalEnd(conditions);
                });

                document.body.appendChild(modal);
            }

            // 开始条件筛选结束
            async function startConditionalEnd(conditions) {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    conditions: conditions
                };

                try {
                    let round = 1;
                    const maxRounds = 2;
                    let hasMatches = false;

                    for (round = 1; round <= maxRounds && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮条件筛选检查...`, 0);

                        const totalPages = getTotalPages();
                        let currentPage = getCurrentPage();

                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                await delay(1000);
                            }

                            const pageMatches = await processPageWithConditionFilter(page, totalPages, conditions);
                            if (pageMatches > 0) {
                                hasMatches = true;
                            }

                            updateProgress(
                                currentProcess.modal,
                                `第 ${round} 轮 - 第 ${page}/${totalPages} 页处理完成，发现 ${pageMatches} 个匹配项`,
                                50 + (page / totalPages) * 25
                            );
                        }

                        if (!hasMatches && round === 1) {
                            updateProgress(currentProcess.modal, "未找到任何匹配条件的活动", 100);
                            break;
                        }

                        if (round === 1 && hasMatches) {
                            updateProgress(currentProcess.modal, "第一轮检查完成，开始第二轮检查防止疏漏", 100);
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                await delay(1000);
                            }
                        }
                    }

                    if (isStopped) {
                        updateProgress(currentProcess.modal, `条件筛选结束已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `条件筛选结束完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        const minimized = document.querySelector('.progress-minimized');
                        if (minimized) minimized.remove();
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('条件筛选结束出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 使用条件筛选处理页面
            async function processPageWithConditionFilter(page, totalPages, conditions) {
                let matchCount = 0;
                let hasMoreMatches = true;
                let safetyCounter = 0;
                const maxSafetyCount = 100;

                while (hasMoreMatches && !isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    const rows = getAllRowsFromCurrentPage();
                    let foundMatchInThisCycle = false;

                    for (let i = 0; i < rows.length && !isStopped; i++) {
                        while (isPaused && !isStopped) {
                            await delay(500);
                        }
                        if (isStopped) break;

                        const row = rows[i];

                        if (checkRowConditions(row, conditions)) {
                            foundMatchInThisCycle = true;
                            matchCount++;

                            const itemName = getItemNameFromRow(row);
                            const itemId = getItemIdFromRow(row);

                            updateProgress(
                                currentProcess.modal,
                                `第 ${page}/${totalPages} 页 - 处理匹配项 ${matchCount} (ID: ${itemId})`,
                                50 + ((page - 1) / totalPages) * 25 + ((i + 1) / rows.length) * (25 / totalPages),
                                itemName
                            );

                            await cleanUpAllModals();

                            const endBtn = getEndButtonFromRow(row);
                            if (endBtn) {
                                endBtn.click();

                                const handled = await waitForAndHandleModal();
                                if (handled) {
                                    currentProcess.processedCount++;

                                    await delay(1500);

                                    await cleanUpAllModals();

                                    break;
                                }
                            }

                            if (foundMatchInThisCycle) {
                                break;
                            }
                        }
                    }

                    if (!foundMatchInThisCycle) {
                        hasMoreMatches = false;
                    }

                    await delay(500);
                }

                return matchCount;
            }

            // 检查行是否满足所有条件
            function checkRowConditions(row, conditions) {
                const pageStructure = detectPageStructure();

                // 商品名称条件检查
                if (conditions.productName.enabled) {
                    let productNameElement;
                    if (pageStructure === 'old') {
                        productNameElement = row.querySelector('td:nth-child(1) .elli_outerWrapper_5-169-0');
                    } else {
                        productNameElement = row.querySelector('td:nth-child(1) .elli_outerWrapper_5-169-0');
                    }

                    if (productNameElement) {
                        const productName = productNameElement.textContent.trim();
                        if (!productName.includes(conditions.productName.value)) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                // 当前单件实收价格条件检查
                if (conditions.minPrice.enabled || conditions.maxPrice.enabled) {
                    let priceCell, priceText;

                    if (pageStructure === 'old') {
                        // 第一种结构：第四列是当前单件实收
                        priceCell = row.querySelector('td:nth-child(4)');
                        if (priceCell) {
                            priceText = priceCell.textContent.trim();
                        }
                    } else {
                        // 第二种结构：第四列是单件预估实收
                        priceCell = row.querySelector('td:nth-child(4)');
                        if (priceCell) {
                            priceText = priceCell.textContent.trim();
                            // 移除人民币符号
                            priceText = priceText.replace('¥', '');
                        }
                    }

                    if (priceCell && priceText) {
                        // 处理价格范围（如"16.79～19.59"）
                        if (priceText.includes('～')) {
                            const priceParts = priceText.split('～');
                            const minPrice = parseFloat(priceParts[0]);
                            const maxPrice = parseFloat(priceParts[1]);

                            if (isNaN(minPrice) || isNaN(maxPrice)) {
                                return false;
                            }

                            if (conditions.minPrice.enabled && minPrice >= conditions.minPrice.value) {
                                return false;
                            }

                            if (conditions.maxPrice.enabled && maxPrice >= conditions.maxPrice.value) {
                                return false;
                            }
                        } else {
                            const price = parseFloat(priceText);

                            if (isNaN(price)) {
                                return false;
                            }

                            if (conditions.minPrice.enabled && price >= conditions.minPrice.value) {
                                return false;
                            }

                            if (conditions.maxPrice.enabled && price >= conditions.maxPrice.value) {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }
                }

                return true;
            }

            // 结束当前页所有活动
            async function endCurrentPageAll() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                isPaused = false;
                isStopped = false;

                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    currentPageIds: []
                };

                try {
                    updateProgress(currentProcess.modal, "正在获取当前页活动信息...", 0);

                    const currentPageIds = getCurrentPageIds();
                    const totalIds = currentPageIds.length;

                    if (totalIds === 0) {
                        updateProgress(currentProcess.modal, "当前页没有活动", 100);
                        setTimeout(() => {
                            if (progressModal && progressModal.parentNode) {
                                progressModal.remove();
                            }
                            currentProcess = null;
                        }, 2000);
                        return;
                    }

                    currentProcess.currentPageIds = currentPageIds;
                    currentProcess.totalCount = totalIds;

                    updateProgress(currentProcess.modal, `开始处理当前页 ${totalIds} 个活动`, 0);

                    let round = 1;
                    const maxRounds = 2;
                    let hasRemaining = true;

                    for (round = 1; round <= maxRounds && hasRemaining && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮检查...`, 0);
                        hasRemaining = false;

                        let processedIds = [];
                        let safetyCounter = 0;
                        const maxSafetyCount = 100;

                        while (!isStopped && safetyCounter < maxSafetyCount) {
                            safetyCounter++;

                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            const rows = getAllRowsFromCurrentPage();
                            let foundMatchInThisCycle = false;

                            for (let i = 0; i < rows.length && !isStopped; i++) {
                                while (isPaused && !isStopped) {
                                    await delay(500);
                                }
                                if (isStopped) break;

                                const row = rows[i];
                                const rowId = getItemIdFromRow(row);

                                if (currentPageIds.includes(rowId) && !processedIds.includes(rowId)) {
                                    foundMatchInThisCycle = true;
                                    hasRemaining = true;

                                    updateProgress(
                                        currentProcess.modal,
                                        `第 ${round} 轮 - 正在处理第 ${processedIds.length + 1}/${totalIds} 项 (ID: ${rowId})`,
                                        ((processedIds.length + 1) / totalIds) * 100,
                                        `ID: ${rowId}`
                                    );

                                    await cleanUpAllModals();

                                    const endBtn = getEndButtonFromRow(row);
                                    if (endBtn) {
                                        endBtn.click();

                                        const handled = await waitForAndHandleModal();
                                        if (handled) {
                                            currentProcess.processedCount++;
                                            processedIds.push(rowId);

                                            await delay(1500);

                                            await cleanUpAllModals();

                                            break;
                                        }
                                    }

                                    if (foundMatchInThisCycle) {
                                        break;
                                    }
                                }
                            }

                            if (!foundMatchInThisCycle) {
                                break;
                            }

                            await delay(500);
                        }

                        updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，处理了 ${processedIds.length} 个活动`, 100);

                        if (hasRemaining && round < maxRounds) {
                            updateProgress(currentProcess.modal, `准备开始第 ${round + 1} 轮检查...`, 100);
                            await delay(1000);
                        }
                    }

                    if (isStopped) {
                        updateProgress(currentProcess.modal, `结束当前页已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `结束当前页完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('结束当前页所有出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 结束所有活动
            async function endAll() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                isPaused = false;
                isStopped = false;

                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0
                };

                try {
                    updateProgress(currentProcess.modal, "开始结束所有活动...", 0);

                    let round = 1;
                    const maxRounds = 2;
                    let hasRemaining = true;

                    for (round = 1; round <= maxRounds && hasRemaining && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮全量检查...`, 0);
                        hasRemaining = false;

                        const totalPages = getTotalPages();
                        let currentPage = getCurrentPage();

                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                await delay(1000);
                            }

                            const pageProcessed = await processCurrentPageForEndAll(page, totalPages);
                            if (pageProcessed > 0) {
                                hasRemaining = true;
                            }

                            updateProgress(
                                currentProcess.modal,
                                `第 ${round} 轮 - 第 ${page}/${totalPages} 页处理完成，处理了 ${pageProcessed} 个活动`,
                                50 + (page / totalPages) * 25
                            );
                        }

                        if (hasRemaining && round < maxRounds) {
                            updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，发现剩余活动，开始下一轮...`, 100);
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                await delay(1000);
                            }
                        }
                    }

                    if (isStopped) {
                        updateProgress(currentProcess.modal, `结束所有已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `结束所有完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('结束所有出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 处理当前页用于结束所有功能
            async function processCurrentPageForEndAll(page, totalPages) {
                let pageProcessed = 0;
                let safetyCounter = 0;
                const maxSafetyCount = 100;

                while (!isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    const rows = getAllRowsFromCurrentPage();

                    if (rows.length === 0) {
                        break;
                    }

                    let foundActivityInThisCycle = false;

                    const firstRow = rows[0];
                    const itemName = getItemNameFromRow(firstRow);
                    const itemId = getItemIdFromRow(firstRow);

                    updateProgress(
                        currentProcess.modal,
                        `第 ${page}/${totalPages} 页 - 正在处理第 ${pageProcessed + 1} 项 (ID: ${itemId})`,
                        50 + ((page - 1) / totalPages) * 25 + ((pageProcessed + 1) / Math.max(rows.length, 1)) * (25 / totalPages),
                        itemName
                    );

                    await cleanUpAllModals();

                    const endBtn = getEndButtonFromRow(firstRow);
                    if (endBtn) {
                        endBtn.click();

                        const handled = await waitForAndHandleModal();
                        if (handled) {
                            currentProcess.processedCount++;
                            pageProcessed++;
                            foundActivityInThisCycle = true;

                            await delay(1500);

                            await cleanUpAllModals();
                        }
                    } else {
                        break;
                    }

                    if (!foundActivityInThisCycle) {
                        break;
                    }

                    await delay(500);
                }

                return pageProcessed;
            }

            // 等待并处理弹窗
            async function waitForAndHandleModal() {
                return new Promise((resolve) => {
                    let handled = false;
                    let checkCount = 0;
                    const maxChecks = 50;

                    const checkModal = () => {
                        if (handled || checkCount >= maxChecks || isStopped) {
                            resolve(handled);
                            return;
                        }

                        checkCount++;

                        const confirmModals = document.querySelectorAll('.PP_withConfirmPopoverMain_5-169-0');
                        confirmModals.forEach(modal => {
                            const confirmBtn = modal.querySelector('.BTN_primary_5-169-0');
                            if (confirmBtn && !handled) {
                                confirmBtn.click();
                                handled = true;
                            }
                        });

                        if (handled) {
                            setTimeout(() => {
                                resolve(handled);
                            }, 500);
                        } else {
                            setTimeout(checkModal, 100);
                        }
                    };

                    checkModal();
                });
            }

            // 清理所有已存在的弹窗
            async function cleanUpAllModals() {
                let cleanedCount = 0;
                let maxCleaningCycles = 5;

                for (let cycle = 0; cycle < maxCleaningCycles; cycle++) {
                    let foundModal = false;

                    const confirmModals = document.querySelectorAll('.PP_withConfirmPopoverMain_5-169-0');
                    confirmModals.forEach(modal => {
                        const confirmBtn = modal.querySelector('.BTN_primary_5-169-0');
                        if (confirmBtn) {
                            confirmBtn.click();
                            cleanedCount++;
                            foundModal = true;
                        }
                    });

                    if (!foundModal) {
                        break;
                    }

                    await delay(500);
                }

                return cleanedCount;
            }

            // 获取当前页所有行
            function getAllRowsFromCurrentPage() {
                return Array.from(document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]'));
            }

            // 获取当前页所有活动ID
            function getCurrentPageIds() {
                const rows = getAllRowsFromCurrentPage();
                const ids = [];

                rows.forEach(row => {
                    const id = getItemIdFromRow(row);
                    if (id && id !== '未知ID') {
                        ids.push(id);
                    }
                });

                return ids;
            }

            // 从行中获取结束按钮（支持两种结构）
            function getEndButtonFromRow(row) {
                const pageStructure = detectPageStructure();

                if (pageStructure === 'old') {
                    // 第一种结构：el_finish
                    return row.querySelector('[data-tracking-viewid="el_finish"]');
                } else {
                    // 第二种结构：el_end
                    return row.querySelector('[data-tracking-viewid="el_end"]');
                }
            }

            // 从行中获取商品ID
            function getItemIdFromRow(row) {
                const pageStructure = detectPageStructure();

                if (pageStructure === 'old') {
                    // 第一种结构：在span中
                    const idElement = row.querySelector('td:nth-child(1) span');
                    if (idElement && idElement.textContent.includes('ID:')) {
                        const idText = idElement.textContent.trim();
                        const idMatch = idText.match(/ID:\s*(\d+)/);
                        return idMatch ? idMatch[1] : '未知ID';
                    }
                } else {
                    // 第二种结构：在第二个elli_outerWrapper中
                    const idElements = row.querySelectorAll('td:nth-child(1) .elli_outerWrapper_5-169-0');
                    if (idElements.length >= 2) {
                        const idText = idElements[1].textContent.trim();
                        if (idText.includes('商品ID:')) {
                            const idMatch = idText.match(/商品ID:\s*(\d+)/);
                            return idMatch ? idMatch[1] : '未知ID';
                        }
                    }
                }
                return '未知ID';
            }

            // 从行中获取商品名称
            function getItemNameFromRow(row) {
                const nameElement = row.querySelector('td:nth-child(1) .elli_outerWrapper_5-169-0');
                if (nameElement && nameElement.textContent.trim()) {
                    const text = nameElement.textContent.trim();
                    return text.length > 50 ? text.substring(0, 50) + '...' : text;
                }

                const idElement = row.querySelector('td:nth-child(1) span');
                if (idElement && idElement.textContent.includes('ID:')) {
                    return idElement.textContent.trim();
                }

                return '未知商品';
            }

            // 创建进度悬浮窗
            function createProgressModal() {
                const modal = document.createElement('div');
                modal.className = 'batch-end-progress';
                modal.innerHTML = `
            <div class="progress-header">
                <span>批量结束进度</span>
                <div>
                    <button class="minimize-btn" style="background:none;border:none;cursor:pointer;font-size:16px;margin-right:5px;">−</button>
                    <button class="close-btn" style="background:none;border:none;cursor:pointer;font-size:16px;">×</button>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">准备开始...</div>
            <div class="current-item">当前操作：无</div>
            <div class="progress-controls">
                <button id="pauseResumeBtn" class="primary">暂停</button>
                <button id="stopBtn" class="danger">停止</button>
            </div>
        `;

                makeDraggable(modal);

                modal.querySelector('.minimize-btn').addEventListener('click', () => {
                    const minimized = createMinimizedView();
                    document.body.appendChild(minimized);
                    modal.style.display = 'none';
                });

                modal.querySelector('.close-btn').addEventListener('click', () => {
                    isStopped = true;
                    modal.remove();
                    const minimized = document.querySelector('.progress-minimized');
                    if (minimized) minimized.remove();
                    currentProcess = null;
                });

                const pauseResumeBtn = modal.querySelector('#pauseResumeBtn');
                pauseResumeBtn.addEventListener('click', () => {
                    if (isPaused) {
                        isPaused = false;
                        pauseResumeBtn.textContent = '暂停';
                        pauseResumeBtn.className = 'primary';
                    } else {
                        isPaused = true;
                        pauseResumeBtn.textContent = '继续';
                        pauseResumeBtn.className = '';
                    }
                });

                modal.querySelector('#stopBtn').addEventListener('click', () => {
                    isStopped = true;
                    modal.querySelector('.progress-text').textContent = '正在停止...';
                });

                return modal;
            }

            // 使元素可拖拽
            function makeDraggable(element) {
                const header = element.querySelector('.progress-header') || element.querySelector('.filter-header');
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

                header.onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    element.style.top = (element.offsetTop - pos2) + "px";
                    element.style.left = (element.offsetLeft - pos1) + "px";
                    element.style.transform = 'none';
                }

                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }

            // 创建最小化视图
            function createMinimizedView() {
                const minimized = document.createElement('div');
                minimized.className = 'progress-minimized';
                minimized.innerHTML = '批量结束进行中...';

                makeDraggable(minimized);

                minimized.addEventListener('click', () => {
                    const modal = document.querySelector('.batch-end-progress');
                    if (modal) {
                        modal.style.display = 'block';
                    }
                    minimized.remove();
                });

                minimized.addEventListener('dblclick', () => {
                    isStopped = true;
                    minimized.remove();
                    const modal = document.querySelector('.batch-end-progress');
                    if (modal) modal.remove();
                    currentProcess = null;
                });

                return minimized;
            }

            // 更新进度显示
            function updateProgress(modal, text, percent, itemName = '') {
                const progressFill = modal.querySelector('.progress-fill');
                const progressText = modal.querySelector('.progress-text');
                const currentItem = modal.querySelector('.current-item');

                if (progressFill) progressFill.style.width = Math.min(percent, 100) + '%';
                if (progressText) progressText.textContent = text;
                if (currentItem && itemName) {
                    currentItem.textContent = `当前操作：${itemName}`;
                }
            }

            // 获取总页数
            function getTotalPages() {
                const paginationItems = document.querySelectorAll('.PGT_pagerItem_5-169-0');
                if (paginationItems.length > 0) {
                    const lastPage = parseInt(paginationItems[paginationItems.length - 1].textContent);
                    return isNaN(lastPage) ? 1 : lastPage;
                }
                return 1;
            }

            // 获取当前页数
            function getCurrentPage() {
                const activeItem = document.querySelector('.PGT_pagerItemActive_5-169-0');
                if (activeItem) {
                    const page = parseInt(activeItem.textContent);
                    return isNaN(page) ? 1 : page;
                }
                return 1;
            }

            // 跳转到指定页面
            async function gotoPage(pageNum) {
                const pageItems = document.querySelectorAll('.PGT_pagerItem_5-169-0');
                for (let item of pageItems) {
                    const itemPage = parseInt(item.textContent);
                    if (!isNaN(itemPage) && itemPage === pageNum) {
                        item.click();
                        await waitForPageLoad();
                        return;
                    }
                }
            }

            // 等待页面加载
            async function waitForPageLoad() {
                return new Promise((resolve) => {
                    let checkCount = 0;
                    const maxChecks = 30;

                    const checkLoaded = () => {
                        checkCount++;
                        const loadingIndicator = document.querySelector('.TB_loading_5-169-0');
                        const tableRows = document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]');
                        if ((!loadingIndicator && tableRows.length > 0) || checkCount >= maxChecks) {
                            resolve();
                        } else {
                            setTimeout(checkLoaded, 100);
                        }
                    };
                    checkLoaded();
                });
            }

            // 延迟函数
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            // 初始化
            function init() {
                addBatchEndButtons();

                const observer = new MutationObserver(() => {
                    if (!document.querySelector('#batchEndButtons')) {
                        addBatchEndButtons();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })();
    }

    // ================================
    // 特定页面脚本 - 限时限量
    // ================================
    function initTimeLimitedPromotion() {
        (function() {
            'use strict';

            // 创建悬浮窗样式
            const style = document.createElement('style');
            style.textContent = `
        .batch-end-progress {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 400px;
            max-width: 500px;
            cursor: move;
            user-select: none;
        }
        .progress-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1890ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: #1890ff;
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-text {
            margin: 10px 0;
            font-size: 12px;
            color: #666;
        }
        .current-item {
            margin: 10px 0;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 12px;
            max-height: 60px;
            overflow-y: auto;
            border-left: 3px solid #1890ff;
        }
        .progress-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            gap: 10px;
        }
        .progress-controls button {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .progress-controls button:hover {
            background: #f5f5f5;
        }
        .progress-controls button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .progress-controls button.danger {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
        .progress-minimized {
            position: fixed;
            top: 50%;
            right: 20px;
            background: white;
            border: 1px solid #1890ff;
            border-radius: 20px;
            padding: 10px 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10000;
            cursor: pointer;
            font-size: 12px;
            color: #1890ff;
            user-select: none;
        }
        .progress-completed {
            border-color: #52c41a;
        }
        .progress-completed .progress-header {
            color: #52c41a;
        }
        .conditional-filter-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            min-width: 400px;
            max-width: 500px;
            cursor: move;
            user-select: none;
        }
        .filter-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1890ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .filter-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
        }
        .filter-checkbox {
            margin-right: 10px;
        }
        .filter-label {
            min-width: 120px;
            font-size: 14px;
            margin-right: 10px;
        }
        .filter-input {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
        }
        .filter-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 10px;
        }
        .filter-controls button {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .filter-controls button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .filter-controls button.danger {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
    `;
            document.head.appendChild(style);

            // 全局控制变量
            let isPaused = false;
            let isStopped = false;
            let currentProcess = null;

            // 添加批量结束按钮
            function addBatchEndButton() {
                const batchModifyBtn = document.querySelector('[data-tracking-viewid="batch_configure"]');
                if (batchModifyBtn && !document.querySelector('#batchEndBtn')) {
                    const batchEndBtn = batchModifyBtn.cloneNode(true);
                    batchEndBtn.id = 'batchEndBtn';
                    batchEndBtn.innerHTML = '<span>批量结束</span>';
                    batchEndBtn.style.marginLeft = '10px';

                    batchEndBtn.addEventListener('click', startBatchEnd);
                    batchModifyBtn.parentNode.appendChild(batchEndBtn);

                    // 添加其他功能按钮
                    addAdditionalButtons(batchModifyBtn.parentNode);
                }
            }

            // 添加其他功能按钮
            function addAdditionalButtons(container) {
                const batchModifyBtn = document.querySelector('[data-tracking-viewid="batch_configure"]');
                if (!batchModifyBtn) return;

                const buttonClass = batchModifyBtn.className;

                // 结束当前页所有按钮
                if (!document.querySelector('#endCurrentPageBtn')) {
                    const endCurrentPageBtn = document.createElement('button');
                    endCurrentPageBtn.id = 'endCurrentPageBtn';
                    endCurrentPageBtn.innerHTML = '<span>结束当前页所有</span>';
                    endCurrentPageBtn.className = buttonClass;
                    endCurrentPageBtn.style.marginLeft = '10px';
                    endCurrentPageBtn.addEventListener('click', endCurrentPageAll);
                    container.appendChild(endCurrentPageBtn);
                }

                // 结束所有按钮
                if (!document.querySelector('#endAllBtn')) {
                    const endAllBtn = document.createElement('button');
                    endAllBtn.id = 'endAllBtn';
                    endAllBtn.innerHTML = '<span>结束所有</span>';
                    endAllBtn.className = buttonClass;
                    endAllBtn.style.marginLeft = '10px';
                    endAllBtn.addEventListener('click', endAll);
                    container.appendChild(endAllBtn);
                }

                // 条件筛选结束按钮
                if (!document.querySelector('#conditionalEndBtn')) {
                    const conditionalEndBtn = document.createElement('button');
                    conditionalEndBtn.id = 'conditionalEndBtn';
                    conditionalEndBtn.innerHTML = '<span>条件筛选结束</span>';
                    conditionalEndBtn.className = buttonClass;
                    conditionalEndBtn.style.marginLeft = '10px';
                    conditionalEndBtn.addEventListener('click', showConditionalFilterModal);
                    container.appendChild(conditionalEndBtn);
                }
            }

            // 显示条件筛选模态框
            function showConditionalFilterModal() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                const modal = document.createElement('div');
                modal.className = 'conditional-filter-modal';
                modal.innerHTML = `
            <div class="filter-header">
                <span>条件筛选设置</span>
                <button class="close-btn" style="background:none;border:none;cursor:pointer;font-size:16px;">×</button>
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="activityNameCheck">
                <label class="filter-label">活动名称包含</label>
                <input type="text" class="filter-input" id="activityNameInput" placeholder="输入活动名称关键字">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="productNameCheck">
                <label class="filter-label">商品名称包含</label>
                <input type="text" class="filter-input" id="productNameInput" placeholder="输入商品名称关键字（空格分隔多个条件）">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="minPriceCheck">
                <label class="filter-label">最低价低于</label>
                <input type="number" class="filter-input" id="minPriceInput" placeholder="输入最低价阈值" step="0.01">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="maxPriceCheck">
                <label class="filter-label">最高价低于</label>
                <input type="number" class="filter-input" id="maxPriceInput" placeholder="输入最高价阈值" step="0.01">
            </div>
            <div class="filter-controls">
                <button id="closeFilterBtn" class="danger">关闭窗口</button>
                <button id="startFilterEndBtn" class="primary">启动结束</button>
            </div>
        `;

                // 添加拖拽功能
                makeDraggable(modal);

                // 关闭按钮
                modal.querySelector('.close-btn').addEventListener('click', () => {
                    modal.remove();
                });

                // 关闭窗口按钮
                modal.querySelector('#closeFilterBtn').addEventListener('click', () => {
                    modal.remove();
                });

                // 启动结束按钮
                modal.querySelector('#startFilterEndBtn').addEventListener('click', () => {
                    const conditions = {
                        activityName: {
                            enabled: document.getElementById('activityNameCheck').checked,
                            value: document.getElementById('activityNameInput').value.trim()
                        },
                        productName: {
                            enabled: document.getElementById('productNameCheck').checked,
                            value: document.getElementById('productNameInput').value.trim()
                        },
                        minPrice: {
                            enabled: document.getElementById('minPriceCheck').checked,
                            value: parseFloat(document.getElementById('minPriceInput').value) || 0
                        },
                        maxPrice: {
                            enabled: document.getElementById('maxPriceCheck').checked,
                            value: parseFloat(document.getElementById('maxPriceInput').value) || 0
                        }
                    };

                    // 验证至少选择了一个条件
                    if (!conditions.activityName.enabled && !conditions.productName.enabled &&
                        !conditions.minPrice.enabled && !conditions.maxPrice.enabled) {
                        alert('请至少选择一个筛选条件！');
                        return;
                    }

                    modal.remove();
                    startConditionalEnd(conditions);
                });

                document.body.appendChild(modal);
            }

            // 开始条件筛选结束 - 添加多轮检查机制
            async function startConditionalEnd(conditions) {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    conditions: conditions,
                    processedIds: new Set() // 用于记录已处理的ID，避免重复处理
                };

                try {
                    let round = 1;
                    const maxRounds = 2; // 最多检查两遍
                    let hasMatches = false;

                    for (round = 1; round <= maxRounds && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮条件筛选检查...`, 0);

                        const totalPages = getTotalPages();
                        let currentPage = getCurrentPage();

                        // 从第一页开始处理
                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 跳转到目标页面
                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                // 等待页面稳定
                                await delay(1000);
                            }

                            // 处理当前页的条件筛选
                            const pageMatches = await processPageWithConditionFilter(page, totalPages, conditions);
                            if (pageMatches > 0) {
                                hasMatches = true;
                            }

                            updateProgress(
                                currentProcess.modal,
                                `第 ${round} 轮 - 第 ${page}/${totalPages} 页处理完成，发现 ${pageMatches} 个匹配项`,
                                50 + (page / totalPages) * 25
                            );
                        }

                        // 如果第一轮没有发现匹配项，提前结束
                        if (!hasMatches && round === 1) {
                            updateProgress(currentProcess.modal, "未找到任何匹配条件的活动", 100);
                            break;
                        }

                        // 如果这是第一轮且发现了匹配项，继续第二轮
                        if (round === 1 && hasMatches) {
                            updateProgress(currentProcess.modal, "第一轮检查完成，开始第二轮检查防止疏漏", 100);
                            // 回到第一页准备第二轮
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                await delay(1000);
                            }
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `条件筛选结束已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `条件筛选结束完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        const minimized = document.querySelector('.progress-minimized');
                        if (minimized) minimized.remove();
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('条件筛选结束出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 使用条件筛选处理页面
            async function processPageWithConditionFilter(page, totalPages, conditions) {
                let matchCount = 0;
                let hasMoreMatches = true;
                let safetyCounter = 0;
                const maxSafetyCount = 100;

                while (hasMoreMatches && !isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    // 等待暂停状态解除
                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    // 每次循环都重新获取当前页的行列表
                    const rows = getAllRowsFromCurrentPage();
                    let foundMatchInThisCycle = false;

                    for (let i = 0; i < rows.length && !isStopped; i++) {
                        // 等待暂停状态解除
                        while (isPaused && !isStopped) {
                            await delay(500);
                        }
                        if (isStopped) break;

                        const row = rows[i];
                        const rowId = getItemIdFromRow(row);

                        // 检查是否已经处理过这个ID
                        if (currentProcess.processedIds.has(rowId)) {
                            continue;
                        }

                        // 检查是否满足所有启用的条件
                        if (checkRowConditions(row, conditions)) {
                            foundMatchInThisCycle = true;
                            matchCount++;

                            // 添加到已处理集合
                            currentProcess.processedIds.add(rowId);

                            const itemName = getItemNameFromRow(row);

                            updateProgress(
                                currentProcess.modal,
                                `第 ${page}/${totalPages} 页 - 处理匹配项 ${matchCount} (ID: ${rowId})`,
                                50 + ((page - 1) / totalPages) * 25 + ((i + 1) / rows.length) * (25 / totalPages),
                                itemName
                            );

                            // 清理所有已存在的弹窗
                            await cleanUpAllModals();

                            const endBtn = row.querySelector('[data-tracking-click-viewid="end_button"]');
                            if (endBtn) {
                                // 点击结束按钮
                                endBtn.click();

                                // 等待弹窗出现并处理
                                const handled = await waitForAndHandleModal();
                                if (handled) {
                                    currentProcess.processedCount++;

                                    // 重要：等待操作完成，让页面有时间更新DOM
                                    await delay(1500);

                                    // 再次清理可能残留的弹窗
                                    await cleanUpAllModals();

                                    // 重要：处理完一个活动后，跳出当前循环，重新获取行列表
                                    break;
                                }
                            }

                            // 如果成功处理了一个活动，跳出循环重新获取行列表
                            if (foundMatchInThisCycle) {
                                break;
                            }
                        }
                    }

                    // 如果这一轮没有找到匹配项，说明当前页已经处理完毕
                    if (!foundMatchInThisCycle) {
                        hasMoreMatches = false;
                    }

                    // 短暂等待，让页面有机会稳定
                    await delay(500);
                }

                return matchCount;
            }

            // 检查行是否满足所有条件
            function checkRowConditions(row, conditions) {
                // 活动名称条件检查
                if (conditions.activityName.enabled) {
                    const activityNameElement = row.querySelector('td:nth-child(2) div div[data-testid="beast-core-ellipsis"] div');
                    if (activityNameElement) {
                        const activityName = activityNameElement.textContent.trim();
                        if (!activityName.includes(conditions.activityName.value)) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                // 商品名称条件检查 - 改进版：支持空格分隔的多个关键字
                if (conditions.productName.enabled) {
                    const productNameElement = row.querySelector('td:nth-child(3) .TableList_normalText__2pO7t');
                    if (productNameElement) {
                        const productName = productNameElement.textContent.trim();

                        // 处理商品名称：移除内部空格以便匹配
                        const productNameWithoutSpaces = productName.replace(/\s+/g, '');

                        // 分割输入的关键字（按空格分割）
                        const keywords = conditions.productName.value.split(/\s+/).filter(keyword => keyword.length > 0);

                        // 检查所有关键字是否都出现在商品名称中（忽略商品名称内的空格）
                        for (const keyword of keywords) {
                            if (!productNameWithoutSpaces.includes(keyword)) {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }
                }

                // 价格条件检查 - 修改版：最高价只识别有～的价格范围
                if (conditions.minPrice.enabled || conditions.maxPrice.enabled) {
                    // 查找活动价列（第9列）中的价格信息
                    const priceCell = row.querySelector('td:nth-child(9)');
                    if (priceCell) {
                        // 查找包含活动价的span元素（带有下边框样式的span）
                        const priceSpan = priceCell.querySelector('div > div > span[style*="border-bottom"]');
                        if (priceSpan) {
                            const priceText = priceSpan.textContent.trim();

                            // 检查是否包含价格范围符号"～"
                            if (priceText.includes('～')) {
                                // 有价格范围的情况，如 "16.79～19.59"
                                const priceParts = priceText.split('～');
                                const minPrice = parseFloat(priceParts[0]);
                                const maxPrice = parseFloat(priceParts[1]);

                                // 检查最低价条件（保持不变）
                                if (conditions.minPrice.enabled) {
                                    if (isNaN(minPrice) || minPrice >= conditions.minPrice.value) {
                                        return false;
                                    }
                                }

                                // 检查最高价条件（只对有～的价格范围进行判断）
                                if (conditions.maxPrice.enabled) {
                                    if (isNaN(maxPrice) || maxPrice >= conditions.maxPrice.value) {
                                        return false;
                                    }
                                }
                            } else {
                                // 单一价格的情况，如 "18.19"
                                const singlePrice = parseFloat(priceText);
                                if (!isNaN(singlePrice)) {
                                    // 单一价格时，只有最低价条件进行判断
                                    const minPrice = singlePrice;

                                    // 检查最低价条件（保持不变）
                                    if (conditions.minPrice.enabled) {
                                        if (minPrice >= conditions.minPrice.value) {
                                            return false;
                                        }
                                    }

                                    // 对于最高价条件：单一价格不进行判断，直接返回false
                                    if (conditions.maxPrice.enabled) {
                                        return false;
                                    }
                                } else {
                                    return false; // 无法解析价格
                                }
                            }
                        } else {
                            return false; // 没有找到价格span
                        }
                    } else {
                        return false; // 没有找到价格列
                    }
                }

                return true;
            }

            // 结束当前页所有活动 - 添加多轮检查机制
            async function endCurrentPageAll() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    currentPageIds: [],
                    processedIds: new Set()
                };

                try {
                    updateProgress(currentProcess.modal, "正在获取当前页活动信息...", 0);

                    // 获取当前页所有行的ID
                    const currentPageIds = getCurrentPageIds();
                    const totalIds = currentPageIds.length;

                    if (totalIds === 0) {
                        updateProgress(currentProcess.modal, "当前页没有活动", 100);
                        setTimeout(() => {
                            if (progressModal && progressModal.parentNode) {
                                progressModal.remove();
                            }
                            currentProcess = null;
                        }, 2000);
                        return;
                    }

                    currentProcess.currentPageIds = currentPageIds;
                    currentProcess.totalCount = totalIds;

                    updateProgress(currentProcess.modal, `开始处理当前页 ${totalIds} 个活动`, 0);

                    let round = 1;
                    const maxRounds = 2; // 最多检查两遍
                    let hasRemaining = true;

                    for (round = 1; round <= maxRounds && hasRemaining && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮检查...`, 0);
                        hasRemaining = false;

                        let safetyCounter = 0;
                        const maxSafetyCount = 100;

                        while (!isStopped && safetyCounter < maxSafetyCount) {
                            safetyCounter++;

                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 每次循环都重新获取当前页的行列表
                            const rows = getAllRowsFromCurrentPage();
                            let foundMatchInThisCycle = false;

                            for (let i = 0; i < rows.length && !isStopped; i++) {
                                // 等待暂停状态解除
                                while (isPaused && !isStopped) {
                                    await delay(500);
                                }
                                if (isStopped) break;

                                const row = rows[i];
                                const rowId = getItemIdFromRow(row);

                                // 检查是否是当前页的ID且尚未处理
                                if (currentPageIds.includes(rowId) && !currentProcess.processedIds.has(rowId)) {
                                    foundMatchInThisCycle = true;
                                    hasRemaining = true;

                                    updateProgress(
                                        currentProcess.modal,
                                        `第 ${round} 轮 - 正在处理第 ${currentProcess.processedCount + 1}/${totalIds} 项 (ID: ${rowId})`,
                                        ((currentProcess.processedCount + 1) / totalIds) * 100,
                                        `ID: ${rowId}`
                                    );

                                    // 清理所有已存在的弹窗
                                    await cleanUpAllModals();

                                    const endBtn = row.querySelector('[data-tracking-click-viewid="end_button"]');
                                    if (endBtn) {
                                        // 点击结束按钮
                                        endBtn.click();

                                        // 等待弹窗出现并处理
                                        const handled = await waitForAndHandleModal();
                                        if (handled) {
                                            currentProcess.processedCount++;
                                            currentProcess.processedIds.add(rowId);

                                            // 重要：等待操作完成，让页面有时间更新DOM
                                            await delay(1500);

                                            // 再次清理可能残留的弹窗
                                            await cleanUpAllModals();

                                            // 重要：处理完一个活动后，跳出当前循环，重新获取行列表
                                            break;
                                        }
                                    }

                                    // 如果成功处理了一个活动，跳出循环重新获取行列表
                                    if (foundMatchInThisCycle) {
                                        break;
                                    }
                                }
                            }

                            // 如果这一轮没有找到匹配项，说明当前页已经处理完毕
                            if (!foundMatchInThisCycle) {
                                break;
                            }

                            // 短暂等待，让页面有机会稳定
                            await delay(500);
                        }

                        updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，处理了 ${currentProcess.processedCount} 个活动`, 100);

                        // 如果这一轮处理了活动，短暂等待后继续下一轮
                        if (hasRemaining && round < maxRounds) {
                            updateProgress(currentProcess.modal, `准备开始第 ${round + 1} 轮检查...`, 100);
                            await delay(1000);
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `结束当前页已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `结束当前页完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('结束当前页所有出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 结束所有活动 - 添加多轮检查机制
            async function endAll() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    processedIds: new Set()
                };

                try {
                    updateProgress(currentProcess.modal, "开始结束所有活动...", 0);

                    let round = 1;
                    const maxRounds = 2; // 最多检查两遍
                    let hasRemaining = true;

                    for (round = 1; round <= maxRounds && hasRemaining && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮全量检查...`, 0);
                        hasRemaining = false;

                        const totalPages = getTotalPages();
                        let currentPage = getCurrentPage();

                        // 从第一页开始处理
                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 跳转到目标页面
                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                // 等待页面稳定
                                await delay(1000);
                            }

                            // 处理当前页
                            const pageProcessed = await processCurrentPageForEndAll(page, totalPages);
                            if (pageProcessed > 0) {
                                hasRemaining = true;
                            }

                            updateProgress(
                                currentProcess.modal,
                                `第 ${round} 轮 - 第 ${page}/${totalPages} 页处理完成，处理了 ${pageProcessed} 个活动`,
                                50 + (page / totalPages) * 25
                            );
                        }

                        // 如果这一轮处理了活动，回到第一页准备下一轮
                        if (hasRemaining && round < maxRounds) {
                            updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，发现剩余活动，开始下一轮...`, 100);
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                await delay(1000);
                            }
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `结束所有已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `结束所有完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('结束所有出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 处理当前页用于结束所有功能
            async function processCurrentPageForEndAll(page, totalPages) {
                let pageProcessed = 0;
                let safetyCounter = 0;
                const maxSafetyCount = 100;

                while (!isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    // 等待暂停状态解除
                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    // 每次循环都重新获取当前页的行列表
                    const rows = getAllRowsFromCurrentPage();

                    // 如果没有活动行，说明当前页已经处理完成
                    if (rows.length === 0) {
                        break;
                    }

                    let foundActivityInThisCycle = false;

                    // 获取第一个活动行
                    const firstRow = rows[0];
                    const itemId = getItemIdFromRow(firstRow);

                    // 检查是否已经处理过这个ID
                    if (currentProcess.processedIds.has(itemId)) {
                        break;
                    }

                    const itemName = getItemNameFromRow(firstRow);

                    updateProgress(
                        currentProcess.modal,
                        `第 ${page}/${totalPages} 页 - 正在处理第 ${pageProcessed + 1} 项 (ID: ${itemId})`,
                        50 + ((page - 1) / totalPages) * 25 + ((pageProcessed + 1) / Math.max(rows.length, 1)) * (25 / totalPages),
                        itemName
                    );

                    // 清理所有已存在的弹窗
                    await cleanUpAllModals();

                    const endBtn = firstRow.querySelector('[data-tracking-click-viewid="end_button"]');
                    if (endBtn) {
                        // 点击结束按钮
                        endBtn.click();

                        // 等待弹窗出现并处理
                        const handled = await waitForAndHandleModal();
                        if (handled) {
                            currentProcess.processedCount++;
                            pageProcessed++;
                            currentProcess.processedIds.add(itemId);
                            foundActivityInThisCycle = true;

                            // 重要：等待操作完成，让页面有时间更新DOM
                            await delay(1500);

                            // 再次清理可能残留的弹窗
                            await cleanUpAllModals();
                        }
                    } else {
                        // 如果没有找到结束按钮，可能是页面结构变化
                        break;
                    }

                    // 如果这一轮没有处理任何活动，说明当前页已经处理完毕
                    if (!foundActivityInThisCycle) {
                        break;
                    }

                    // 短暂等待，让页面有机会稳定
                    await delay(500);
                }

                return pageProcessed;
            }

            // 开始批量结束流程 - 添加多轮检查机制
            async function startBatchEnd() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    processedIds: new Set()
                };

                try {
                    // 第一步：获取基本信息
                    updateProgress(currentProcess.modal, "正在获取页面信息...", 0);

                    const totalPages = getTotalPages();
                    let currentPage = getCurrentPage();

                    // 第二步：逐页处理，使用多轮检查机制
                    updateProgress(currentProcess.modal, `开始处理，共 ${totalPages} 页`, 0);

                    let hasRemaining = true;
                    let round = 1;
                    while (hasRemaining && !isStopped) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮检查...`, 0);
                        hasRemaining = false;

                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 跳转到目标页面
                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                // 等待页面稳定
                                await delay(1000);
                            }

                            // 使用重新检查机制处理当前页
                            const hasRemainingInPage = await processPageWithRecheck(page, totalPages);
                            if (hasRemainingInPage) {
                                hasRemaining = true;
                            }
                        }

                        // 如果还有剩余，则进行下一轮检查
                        if (hasRemaining) {
                            updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，发现剩余活动，开始下一轮...`, 100);
                            round++;
                            // 回到第一页
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                currentPage = 1;
                                await delay(1000);
                            }
                        } else {
                            updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，无剩余活动`, 100);
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `批量结束已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `批量结束完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        const minimized = document.querySelector('.progress-minimized');
                        if (minimized) minimized.remove();
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('批量结束出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                } finally {
                    // 重置控制按钮状态
                    if (currentProcess && currentProcess.modal) {
                        const pauseResumeBtn = currentProcess.modal.querySelector('#pauseResumeBtn');
                        const stopBtn = currentProcess.modal.querySelector('#stopBtn');
                        if (pauseResumeBtn) pauseResumeBtn.disabled = true;
                        if (stopBtn) stopBtn.disabled = true;
                    }
                }
            }

            // 使用重新检查机制处理页面，返回是否有剩余活动
            async function processPageWithRecheck(page, totalPages) {
                let hasRemaining = false;
                let safetyCounter = 0;
                const maxSafetyCount = 100;

                while (!isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    // 等待暂停状态解除
                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    // 每次循环都重新获取当前页的勾选项目
                    const checkedRows = getCheckedRows();
                    const pageTasks = checkedRows.length;

                    if (pageTasks === 0) {
                        // 当前页没有勾选项目
                        break;
                    }

                    // 有勾选项目
                    hasRemaining = true;

                    updateProgress(
                        currentProcess.modal,
                        `第 ${page} 页有 ${pageTasks} 个勾选项目，开始处理...`,
                        50 + ((page - 1) / totalPages) * 25
                    );

                    let foundCheckedInThisCycle = false;

                    // 处理当前页的所有项目
                    for (let i = 0; i < checkedRows.length && !isStopped; i++) {
                        // 等待暂停状态解除
                        while (isPaused && !isStopped) {
                            await delay(500);
                        }
                        if (isStopped) break;

                        const row = checkedRows[i];
                        const itemId = getItemIdFromRow(row);

                        // 检查是否已经处理过这个ID
                        if (currentProcess.processedIds.has(itemId)) {
                            continue;
                        }

                        const itemName = getItemNameFromRow(row);

                        updateProgress(
                            currentProcess.modal,
                            `正在处理第 ${page}/${totalPages} 页，第 ${i + 1} 项`,
                            50 + ((page - 1) / totalPages) * 25 + ((i + 1) / pageTasks) * (25 / totalPages),
                            itemName
                        );

                        // 关键改进：在点击结束按钮前，先清理所有已存在的弹窗
                        const cleanedCount = await cleanUpAllModals();
                        if (cleanedCount > 0) {
                            updateProgress(
                                currentProcess.modal,
                                `清理了 ${cleanedCount} 个残留弹窗，继续处理当前项目`,
                                50 + ((page - 1) / totalPages) * 25 + ((i + 1) / pageTasks) * (25 / totalPages),
                                itemName
                            );
                            await delay(1000); // 等待清理完成
                        }

                        const endBtn = row.querySelector('[data-tracking-click-viewid="end_button"]');
                        if (endBtn) {
                            // 点击结束按钮
                            endBtn.click();

                            // 等待弹窗出现并处理
                            const handled = await waitForAndHandleModal();
                            if (handled) {
                                currentProcess.processedCount++;
                                currentProcess.processedIds.add(itemId);
                                foundCheckedInThisCycle = true;

                                // 等待操作完成，让页面有机会更新
                                await delay(1500);

                                // 再次清理可能残留的弹窗
                                await cleanUpAllModals();

                                // 重要：处理完一个活动后，跳出当前循环，重新获取行列表
                                break;
                            }
                        }

                        // 如果成功处理了一个活动，跳出循环重新获取行列表
                        if (foundCheckedInThisCycle) {
                            break;
                        }
                    }

                    // 短暂等待，让页面有机会稳定
                    await delay(500);
                }

                return hasRemaining;
            }

            // 等待并处理弹窗 - 优化版，增加对全站营销弹窗的处理
            async function waitForAndHandleModal() {
                return new Promise((resolve) => {
                    let handled = false;
                    let checkCount = 0;
                    const maxChecks = 50; // 增加检查次数

                    const checkModal = () => {
                        if (handled || checkCount >= maxChecks || isStopped) {
                            resolve(handled);
                            return;
                        }

                        checkCount++;

                        // 先检查是否有设置恢复时间弹窗（直接结束按钮）
                        const timingModals = document.querySelectorAll('[data-tracking-impr-viewid="temp_end_pop_shared"]');
                        let foundStraightEnd = false;

                        timingModals.forEach(modal => {
                            const straightEndBtns = modal.querySelectorAll('[data-tracking-viewid="straight_end_shared"]');
                            straightEndBtns.forEach(btn => {
                                if (btn && !foundStraightEnd) {
                                    btn.click();
                                    handled = true;
                                    foundStraightEnd = true;
                                }
                            });
                        });

                        // 如果有直接结束按钮被点击，继续检查是否还有更多
                        if (foundStraightEnd) {
                            setTimeout(checkModal, 300);
                            return;
                        }

                        // 检查全站营销弹窗 - 新增处理
                        const marketingModals = document.querySelectorAll('.PP_withConfirmPopoverMain_5-154-0');
                        marketingModals.forEach(modal => {
                            const modalContent = modal.querySelector('.PP_popoverContent_5-154-0');
                            if (modalContent && modalContent.textContent.includes('全站营销')) {
                                // 找到取消按钮并点击
                                const cancelBtns = modal.querySelectorAll('button');
                                cancelBtns.forEach(btn => {
                                    if (btn.textContent.includes('取消') && !handled) {
                                        btn.click();
                                        handled = true; // 标记为已处理，但实际是取消操作
                                        console.log('检测到全站营销弹窗，已点击取消');
                                    }
                                });
                            }
                        });

                        // 如果没有全站营销弹窗，检查确认结束弹窗
                        if (!handled) {
                            const confirmModals = document.querySelectorAll('.PP_withConfirmPopoverMain_5-154-0');
                            confirmModals.forEach(modal => {
                                const confirmBtn = modal.querySelector('.BTN_primary_5-154-0');
                                if (confirmBtn && !handled) {
                                    confirmBtn.click();
                                    handled = true;
                                }
                            });
                        }

                        if (handled) {
                            // 等待一下确保弹窗处理完成
                            setTimeout(() => {
                                resolve(handled);
                            }, 500);
                        } else {
                            setTimeout(checkModal, 100);
                        }
                    };

                    checkModal();
                });
            }

            // 清理所有已存在的弹窗 - 增加对全站营销弹窗的处理
            async function cleanUpAllModals() {
                let cleanedCount = 0;
                let maxCleaningCycles = 5;

                for (let cycle = 0; cycle < maxCleaningCycles; cycle++) {
                    let foundModal = false;

                    // 处理设置恢复时间弹窗（优先处理直接结束）
                    const timingModals = document.querySelectorAll('[data-tracking-impr-viewid="temp_end_pop_shared"]');
                    timingModals.forEach(modal => {
                        const straightEndBtns = modal.querySelectorAll('[data-tracking-viewid="straight_end_shared"]');
                        straightEndBtns.forEach(btn => {
                            if (btn) {
                                btn.click();
                                cleanedCount++;
                                foundModal = true;
                            }
                        });
                    });

                    // 处理全站营销弹窗 - 新增处理
                    const marketingModals = document.querySelectorAll('.PP_withConfirmPopoverMain_5-154-0');
                    marketingModals.forEach(modal => {
                        const modalContent = modal.querySelector('.PP_popoverContent_5-154-0');
                        if (modalContent && modalContent.textContent.includes('全站营销')) {
                            const cancelBtns = modal.querySelectorAll('button');
                            cancelBtns.forEach(btn => {
                                if (btn.textContent.includes('取消')) {
                                    btn.click();
                                    cleanedCount++;
                                    foundModal = true;
                                    console.log('清理全站营销弹窗');
                                }
                            });
                        }
                    });

                    // 处理确认结束弹窗
                    const confirmModals = document.querySelectorAll('.PP_withConfirmPopoverMain_5-154-0');
                    confirmModals.forEach(modal => {
                        const confirmBtn = modal.querySelector('.BTN_primary_5-154-0');
                        if (confirmBtn) {
                            confirmBtn.click();
                            cleanedCount++;
                            foundModal = true;
                        }
                    });

                    // 如果这一轮没有找到弹窗，退出循环
                    if (!foundModal) {
                        break;
                    }

                    // 等待一下让弹窗消失
                    await delay(500);
                }

                return cleanedCount;
            }

            // 获取当前页所有行
            function getAllRowsFromCurrentPage() {
                return Array.from(document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]'));
            }

            // 获取当前页所有活动ID
            function getCurrentPageIds() {
                const rows = getAllRowsFromCurrentPage();
                const ids = [];

                rows.forEach(row => {
                    const id = getItemIdFromRow(row);
                    if (id && id !== '未知ID') {
                        ids.push(id);
                    }
                });

                return ids;
            }

            // 从行中获取商品ID
            function getItemIdFromRow(row) {
                const idElement = row.querySelector('.TableList_lightText__YhSG2');
                if (idElement && idElement.textContent.includes('ID:')) {
                    const idText = idElement.textContent.trim();
                    const idMatch = idText.match(/ID:\s*(\d+)/);
                    return idMatch ? idMatch[1] : '未知ID';
                }
                return '未知ID';
            }

            // 从行中获取商品名称
            function getItemNameFromRow(row) {
                const nameElement = row.querySelector('.TableList_normalText__2pO7t');
                if (nameElement && nameElement.textContent.trim()) {
                    const text = nameElement.textContent.trim();
                    return text.length > 50 ? text.substring(0, 50) + '...' : text;
                }

                const idElement = row.querySelector('.TableList_lightText__YhSG2');
                if (idElement && idElement.textContent.includes('ID:')) {
                    return idElement.textContent.trim();
                }

                return '未知商品';
            }

            // 获取已勾选的行
            function getCheckedRows() {
                const rows = document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]');
                const checkedRows = [];

                rows.forEach(row => {
                    const checkboxWrapper = row.querySelector('.CBX_outerWrapper_5-154-0.CBX_checkbox_5-154-0.CBX_medium_5-154-0');
                    if (checkboxWrapper) {
                        const isChecked =
                              checkboxWrapper.classList.contains('CBX_active_5-154-0') ||
                              checkboxWrapper.getAttribute('data-checked') === 'true' ||
                              checkboxWrapper.querySelector('.CBX_square_5-154-0.CBX_active_5-154-0') !== null ||
                              checkboxWrapper.querySelector('.CBX_iconCheck_5-154-0.CBX_active_5-154-0') !== null;

                        if (isChecked) {
                            checkedRows.push(row);
                        }
                    }
                });

                return checkedRows;
            }

            // 创建进度悬浮窗
            function createProgressModal() {
                const modal = document.createElement('div');
                modal.className = 'batch-end-progress';
                modal.innerHTML = `
            <div class="progress-header">
                <span>批量结束进度</span>
                <div>
                    <button class="minimize-btn" style="background:none;border:none;cursor:pointer;font-size:16px;margin-right:5px;">−</button>
                    <button class="close-btn" style="background:none;border:none;cursor:pointer;font-size:16px;">×</button>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">准备开始...</div>
            <div class="current-item">当前操作：无</div>
            <div class="progress-controls">
                <button id="pauseResumeBtn" class="primary">暂停</button>
                <button id="stopBtn" class="danger">停止</button>
            </div>
        `;

                // 添加拖拽功能
                makeDraggable(modal);

                // 最小化按钮
                modal.querySelector('.minimize-btn').addEventListener('click', () => {
                    const minimized = createMinimizedView();
                    document.body.appendChild(minimized);
                    modal.style.display = 'none';
                });

                // 关闭按钮
                modal.querySelector('.close-btn').addEventListener('click', () => {
                    isStopped = true;
                    modal.remove();
                    const minimized = document.querySelector('.progress-minimized');
                    if (minimized) minimized.remove();
                    currentProcess = null;
                });

                // 暂停/继续按钮
                const pauseResumeBtn = modal.querySelector('#pauseResumeBtn');
                pauseResumeBtn.addEventListener('click', () => {
                    if (isPaused) {
                        isPaused = false;
                        pauseResumeBtn.textContent = '暂停';
                        pauseResumeBtn.className = 'primary';
                    } else {
                        isPaused = true;
                        pauseResumeBtn.textContent = '继续';
                        pauseResumeBtn.className = '';
                    }
                });

                // 停止按钮
                modal.querySelector('#stopBtn').addEventListener('click', () => {
                    isStopped = true;
                    modal.querySelector('.progress-text').textContent = '正在停止...';
                });

                return modal;
            }

            // 使元素可拖拽
            function makeDraggable(element) {
                const header = element.querySelector('.progress-header') || element.querySelector('.filter-header');
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

                header.onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    element.style.top = (element.offsetTop - pos2) + "px";
                    element.style.left = (element.offsetLeft - pos1) + "px";
                    element.style.transform = 'none';
                }

                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }

            // 创建最小化视图
            function createMinimizedView() {
                const minimized = document.createElement('div');
                minimized.className = 'progress-minimized';
                minimized.innerHTML = '批量结束进行中...';

                makeDraggable(minimized);

                minimized.addEventListener('click', () => {
                    const modal = document.querySelector('.batch-end-progress');
                    if (modal) {
                        modal.style.display = 'block';
                    }
                    minimized.remove();
                });

                minimized.addEventListener('dblclick', () => {
                    isStopped = true;
                    minimized.remove();
                    const modal = document.querySelector('.batch-end-progress');
                    if (modal) modal.remove();
                    currentProcess = null;
                });

                return minimized;
            }

            // 更新进度显示
            function updateProgress(modal, text, percent, itemName = '') {
                const progressFill = modal.querySelector('.progress-fill');
                const progressText = modal.querySelector('.progress-text');
                const currentItem = modal.querySelector('.current-item');

                if (progressFill) progressFill.style.width = Math.min(percent, 100) + '%';
                if (progressText) progressText.textContent = text;
                if (currentItem && itemName) {
                    currentItem.textContent = `当前操作：${itemName}`;
                }
            }

            // 获取总页数
            function getTotalPages() {
                const paginationItems = document.querySelectorAll('.PGT_pagerItem_5-154-0');
                if (paginationItems.length > 0) {
                    const lastPage = parseInt(paginationItems[paginationItems.length - 1].textContent);
                    return isNaN(lastPage) ? 1 : lastPage;
                }
                return 1;
            }

            // 获取当前页数
            function getCurrentPage() {
                const activeItem = document.querySelector('.PGT_pagerItemActive_5-154-0');
                if (activeItem) {
                    const page = parseInt(activeItem.textContent);
                    return isNaN(page) ? 1 : page;
                }
                return 1;
            }

            // 跳转到指定页面
            async function gotoPage(pageNum) {
                const pageItems = document.querySelectorAll('.PGT_pagerItem_5-154-0');
                for (let item of pageItems) {
                    const itemPage = parseInt(item.textContent);
                    if (!isNaN(itemPage) && itemPage === pageNum) {
                        item.click();
                        await waitForPageLoad();
                        return;
                    }
                }
            }

            // 等待页面加载
            async function waitForPageLoad() {
                return new Promise((resolve) => {
                    let checkCount = 0;
                    const maxChecks = 30;

                    const checkLoaded = () => {
                        checkCount++;
                        const loadingIndicator = document.querySelector('.TB_loading_5-154-0');
                        const tableRows = document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]');
                        if ((!loadingIndicator && tableRows.length > 0) || checkCount >= maxChecks) {
                            resolve();
                        } else {
                            setTimeout(checkLoaded, 100);
                        }
                    };
                    checkLoaded();
                });
            }

            // 延迟函数
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            // 初始化
            function init() {
                addBatchEndButton();

                const observer = new MutationObserver(() => {
                    if (!document.querySelector('#batchEndBtn')) {
                        addBatchEndButton();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })();
    }

    function initTimeLimitedPromotionCreateID() {
        (function() {
            'use strict';

            // 创建样式
            const style = document.createElement('style');
            style.textContent = `
        .copy-id-buttons-container {
            display: flex;
            gap: 8px;
            margin-left: 8px;
        }
        .copy-id-btn {
            padding: 6px 12px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: white;
            cursor: pointer;
            font-size: 12px;
            color: #333;
        }
        .copy-id-btn:hover {
            background: #f5f5f5;
        }
        .copy-id-btn.primary {
            background: #2656bd;
            color: white;
            border-color: #2656bd;
        }
        .copy-id-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;
            document.head.appendChild(style);

            // 使用WeakMap来跟踪每个弹窗的按钮添加状态
            let modalButtonMap = new WeakMap();
            let currentUrl = location.href;

            // 监听弹窗出现
            function observeModal() {
                const observer = new MutationObserver(function(mutations) {
                    let shouldHandleModal = false;

                    for (let mutation of mutations) {
                        if (mutation.type === 'childList') {
                            for (let node of mutation.addedNodes) {
                                if (node.nodeType === 1) {
                                    // 检查是否是选择商品弹窗
                                    const modal = findGoodsSelectModal(node);
                                    if (modal) {
                                        shouldHandleModal = true;
                                        break;
                                    }

                                    // 检查新增的节点中是否包含弹窗相关元素
                                    if (containsGoodsSelectModal(node)) {
                                        shouldHandleModal = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (shouldHandleModal) {
                        console.log('检测到DOM变化，准备查找选择商品弹窗');
                        setTimeout(() => {
                            const modal = findGoodsSelectModal(document.body);
                            if (modal && !modalButtonMap.has(modal)) {
                                addCopyButtons(modal);
                            }
                        }, 800); // 增加延迟确保页面稳定
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // 同时监听URL变化
                const urlObserver = new MutationObserver(() => {
                    const newUrl = location.href;
                    if (newUrl !== currentUrl) {
                        currentUrl = newUrl;
                        console.log('URL发生变化，重置状态');
                        modalButtonMap = new WeakMap();
                        setTimeout(observeModal, 1500);
                    }
                });

                urlObserver.observe(document, { subtree: true, childList: true });

                // 初始检查
                setTimeout(() => {
                    const existingModal = findGoodsSelectModal(document.body);
                    if (existingModal && !modalButtonMap.has(existingModal)) {
                        console.log('发现已存在的选择商品弹窗，添加按钮');
                        setTimeout(() => addCopyButtons(existingModal), 1000);
                    }
                }, 2000);
            }

            // 查找选择商品弹窗
            function findGoodsSelectModal(root) {
                // 方法1: 通过标题查找
                const headers = root.querySelectorAll('.MDL_header_5-154-0');
                for (let header of headers) {
                    if (header.textContent.includes('选择商品')) {
                        const modal = header.closest('[data-testid="beast-core-modal-inner"]') ||
                              header.closest('.MDL_inner_5-154-0');
                        if (modal) return modal;
                    }
                }

                // 方法2: 通过特定class查找
                const selectGoodsContainers = root.querySelectorAll('.selectGoodsList_wrapper__dds3F');
                for (let container of selectGoodsContainers) {
                    const modal = container.closest('[data-testid="beast-core-modal-inner"]') ||
                          container.closest('.MDL_inner_5-154-0');
                    if (modal) return modal;
                }

                return null;
            }

            // 检查节点是否包含选择商品弹窗
            function containsGoodsSelectModal(node) {
                if (node.nodeType !== 1) return false;

                // 检查节点本身或子节点是否包含弹窗特征
                if (node.querySelector && (
                    node.querySelector('.MDL_header_5-154-0') ||
                    node.querySelector('.selectGoodsList_wrapper__dds3F')
                )) {
                    return true;
                }

                return false;
            }

            // 判断当前是可选还是不可选状态（增强版）
            function getCurrentOption(modal) {
                // 方法1: 检查radio group
                const radioGroup = modal.querySelector('.RDG_outerWrapper_5-154-0');
                if (radioGroup) {
                    const activeRadio = radioGroup.querySelector('.RD_active_5-154-0');
                    if (activeRadio) {
                        const textWrapper = activeRadio.querySelector('.RD_textWrapper_5-154-0');
                        if (textWrapper) {
                            return textWrapper.textContent.trim();
                        }
                    }

                    // 检查checked属性
                    const radios = radioGroup.querySelectorAll('input[type="radio"]');
                    for (let radio of radios) {
                        if (radio.checked) {
                            const label = radio.closest('label[data-testid="beast-core-radio"]');
                            if (label) {
                                const textWrapper = label.querySelector('.RD_textWrapper_5-154-0');
                                if (textWrapper) {
                                    return textWrapper.textContent.trim();
                                }
                            }
                        }
                    }
                }

                // 方法2: 通过页面内容判断
                const invalidTable = modal.querySelector('.InvalidTable_container__1IM1r');
                if (invalidTable) {
                    return '不可选';
                }

                const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
                if (checkboxes.length > 0) {
                    return '可选';
                }

                return 'unknown';
            }

            // 添加复制按钮
            function addCopyButtons(modal) {
                const searchContainer = modal.querySelector('.selectGoodsList_search__LlGUW');
                if (!searchContainer) {
                    console.log('未找到搜索容器');
                    return;
                }

                // 检查是否已经添加过按钮
                if (searchContainer.querySelector('.copy-id-buttons-container')) {
                    modalButtonMap.set(modal, true);
                    return;
                }

                // 创建按钮容器
                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'copy-id-buttons-container';

                const currentOption = getCurrentOption(modal);
                console.log('当前选项:', currentOption);

                // 根据当前选项添加按钮
                if (currentOption === '可选') {
                    // 可选状态：添加3个按钮
                    const buttons = [
                        { text: '复制当前页商品ID', id: 'copy-current-page' },
                        { text: '复制已选商品ID', id: 'copy-selected' },
                        { text: '复制所有商品ID', id: 'copy-all' }
                    ];

                    buttons.forEach(btn => {
                        const button = createButton(btn, modal);
                        buttonsContainer.appendChild(button);
                    });
                } else {
                    // 不可选状态和其他情况：添加2个按钮
                    const buttons = [
                        { text: '复制当前页商品ID', id: 'copy-current-page' },
                        { text: '复制所有商品ID', id: 'copy-all' }
                    ];

                    buttons.forEach(btn => {
                        const button = createButton(btn, modal);
                        buttonsContainer.appendChild(button);
                    });
                }

                searchContainer.appendChild(buttonsContainer);
                modalButtonMap.set(modal, true);
                console.log('复制按钮添加成功');

                // 监听选项切换（增强版）
                observeOptionChange(modal);
            }

            // 创建按钮的辅助函数
            function createButton(btnConfig, modal) {
                const button = document.createElement('button');
                button.className = 'copy-id-btn';
                button.id = btnConfig.id;
                button.textContent = btnConfig.text;
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCopyButtonClick(modal, btnConfig.id);
                });
                return button;
            }

            // 增强的选项切换监听
            function observeOptionChange(modal) {
                const radioGroup = modal.querySelector('.RDG_outerWrapper_5-154-0');
                if (!radioGroup) return;

                // 使用事件委托，避免重复绑定
                radioGroup.addEventListener('click', function(e) {
                    const target = e.target;
                    const radio = target.closest('label[data-testid="beast-core-radio"]') ||
                          target.closest('input[type="radio"]');

                    if (radio) {
                        console.log('检测到选项点击，准备重新添加按钮');

                        // 延迟处理，确保页面变化完成
                        setTimeout(() => {
                            // 移除现有的按钮容器
                            const existingContainer = modal.querySelector('.copy-id-buttons-container');
                            if (existingContainer) {
                                existingContainer.remove();
                            }

                            // 重置状态并重新添加按钮
                            modalButtonMap.delete(modal);
                            setTimeout(() => {
                                const currentModal = findGoodsSelectModal(document.body);
                                if (currentModal) {
                                    addCopyButtons(currentModal);
                                }
                            }, 1000);
                        }, 300);
                    }
                });
            }

            // 处理复制按钮点击
            async function handleCopyButtonClick(modal, buttonType) {
                const currentOption = getCurrentOption(modal);
                console.log(`点击按钮: ${buttonType}, 当前选项: ${currentOption}`);

                let ids = [];

                // 禁用按钮防止重复点击
                const button = modal.querySelector(`#${buttonType}`);
                const originalText = button.textContent;
                button.disabled = true;

                try {
                    if (buttonType === 'copy-all') {
                        button.textContent = '采集中...';
                        ids = await handleCopyAll(modal, currentOption);
                    } else {
                        if (currentOption === '可选') {
                            ids = handleOptionalCase(modal, buttonType);
                        } else {
                            ids = handleInvalidCase(modal, buttonType);
                        }

                        if (ids.length > 0) {
                            copyToClipboard(ids.join(','));
                            showMessage(`成功复制 ${ids.length} 个商品ID`);
                        } else {
                            showMessage('未找到商品ID');
                        }
                    }
                } finally {
                    // 恢复按钮状态
                    button.disabled = false;
                    button.textContent = originalText;
                }
            }

            // 处理复制所有ID（自动翻页）
            async function handleCopyAll(modal, currentOption) {
                const allIds = [];
                let currentPage = 1;
                let hasNextPage = true;

                showMessage('开始采集所有商品ID，请勿关闭弹窗...');

                while (hasNextPage) {
                    console.log(`正在采集第 ${currentPage} 页`);

                    // 获取当前页面的ID
                    let pageIds = [];
                    if (currentOption === '可选') {
                        pageIds = handleOptionalCase(modal, 'copy-current-page');
                    } else {
                        pageIds = handleInvalidCase(modal, 'copy-current-page');
                    }

                    allIds.push(...pageIds);
                    showMessage(`已采集 ${allIds.length} 个商品ID，正在翻页...`);

                    // 尝试翻页
                    hasNextPage = await goToNextPage(modal);

                    if (hasNextPage) {
                        currentPage++;
                        // 等待页面加载
                        await waitForPageLoad(modal);
                    }
                }

                if (allIds.length > 0) {
                    copyToClipboard(allIds.join(','));
                    showMessage(`采集完成！共复制 ${allIds.length} 个商品ID`);
                } else {
                    showMessage('未找到任何商品ID');
                }

                return allIds;
            }

            // 翻页功能
            async function goToNextPage(modal) {
                const pagination = modal.querySelector('.PGT_outerWrapper_5-154-0');
                if (!pagination) {
                    console.log('未找到分页组件');
                    return false;
                }

                // 查找下一页按钮
                const nextBtn = pagination.querySelector('.PGT_next_5-154-0:not(.PGT_disabled_5-154-0)');
                if (!nextBtn) {
                    console.log('没有下一页或下一页按钮不可用');
                    return false;
                }

                // 点击下一页
                nextBtn.click();
                return true;
            }

            // 等待页面加载
            async function waitForPageLoad(modal) {
                return new Promise(resolve => {
                    // 观察表格内容的变化
                    const tableBody = modal.querySelector('tbody[data-testid="beast-core-table-middle-tbody"]');
                    if (!tableBody) {
                        setTimeout(resolve, 1000);
                        return;
                    }

                    const observer = new MutationObserver(function(mutations) {
                        // 检查是否有子元素变化，表示新页面加载完成
                        for (let mutation of mutations) {
                            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                observer.disconnect();
                                setTimeout(resolve, 500);
                                return;
                            }
                        }
                    });

                    observer.observe(tableBody, {
                        childList: true,
                        subtree: true
                    });

                    // 设置超时，避免无限等待
                    setTimeout(() => {
                        observer.disconnect();
                        resolve();
                    }, 5000);
                });
            }

            // 处理可选情况
            function handleOptionalCase(modal, buttonType) {
                const ids = [];

                if (buttonType === 'copy-current-page' || buttonType === 'copy-all') {
                    // 复制当前页所有商品ID
                    const rows = modal.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]');
                    rows.forEach(row => {
                        const idCell = row.querySelector('td[data-testid="beast-core-table-td"]');
                        if (idCell) {
                            const idDiv = idCell.querySelector('div[data-testid="beast-core-ellipsis"]:nth-child(2)');
                            if (idDiv) {
                                const idText = idDiv.textContent || idDiv.innerText;
                                const match = idText.match(/ID:\s*(\d+)/);
                                if (match) {
                                    ids.push(match[1]);
                                }
                            }
                        }
                    });
                } else if (buttonType === 'copy-selected') {
                    // 复制已选所有ID - 从右侧已选商品列表获取
                    const selectedGoodsList = modal.querySelector('.SideBlock_goodsList__3IKyW');
                    if (selectedGoodsList) {
                        const selectedPanels = selectedGoodsList.querySelectorAll('.SideBlock_goodsPanel__2c0Ir');
                        selectedPanels.forEach(panel => {
                            const idElement = panel.querySelector('.SideBlock_addColor__2iam3');
                            if (idElement) {
                                const idText = idElement.textContent || idElement.innerText;
                                const match = idText.match(/ID:\s*(\d+)/);
                                if (match) {
                                    ids.push(match[1]);
                                }
                            }
                        });
                    }
                }

                return ids;
            }

            // 处理不可选情况
            function handleInvalidCase(modal, buttonType) {
                const ids = [];

                if (buttonType === 'copy-current-page' || buttonType === 'copy-all') {
                    // 不可选情况下，复制当前页所有商品ID
                    const rows = modal.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]');
                    rows.forEach(row => {
                        const infoDiv = row.querySelector('.InvalidTable_info__G98sG');
                        if (infoDiv) {
                            const spans = infoDiv.querySelectorAll('span');
                            for (let span of spans) {
                                const spanText = span.textContent || span.innerText;
                                if (spanText.startsWith('ID：')) {
                                    const match = spanText.match(/ID：\s*(\d+)/);
                                    if (match) {
                                        ids.push(match[1]);
                                        break;
                                    }
                                }
                            }
                        }
                    });
                }

                return ids;
            }

            // 复制到剪贴板
            function copyToClipboard(text) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            // 显示消息
            function showMessage(message) {
                // 移除已存在的消息
                const existingMessage = document.querySelector('.copy-id-message');
                if (existingMessage) {
                    existingMessage.remove();
                }

                const messageDiv = document.createElement('div');
                messageDiv.className = 'copy-id-message';
                messageDiv.textContent = message;
                messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            max-width: 300px;
            word-break: break-all;
        `;

                document.body.appendChild(messageDiv);

                // 3秒后自动消失（采集过程中的消息会持续显示）
                if (!message.includes('采集')) {
                    setTimeout(() => {
                        if (messageDiv.parentNode) {
                            messageDiv.parentNode.removeChild(messageDiv);
                        }
                    }, 3000);
                }
            }

            // 初始化脚本
            function init() {
                console.log('拼多多选择商品弹窗复制ID脚本初始化 - 版本1.3');
                observeModal();
            }

            // 页面加载完成后初始化
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })();
    }

    function initTimeLimitedPromotionCreateAdd() {
        (function() {
            'use strict';

            // 创建样式
            const style = document.createElement('style');
            style.textContent = `
        .auto-fill-buttons-container {
            display: flex;
            gap: 8px;
            margin-left: 8px;
            flex-wrap: wrap;
        }
        .auto-fill-btn {
            padding: 6px 12px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: white;
            cursor: pointer;
            font-size: 12px;
            color: #333;
        }
        .auto-fill-btn:hover {
            background: #f5f5f5;
        }
        .auto-fill-btn.primary {
            background: #2656bd;
            color: white;
            border-color: #2656bd;
        }
        .auto-fill-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        /* 浮窗样式 */
        .auto-fill-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            padding: 20px;
            min-width: 300px;
        }
        .auto-fill-modal h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #333;
        }
        .auto-fill-modal .form-group {
            margin-bottom: 15px;
        }
        .auto-fill-modal label {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .auto-fill-modal input[type="checkbox"] {
            margin-right: 8px;
        }
        .auto-fill-modal input[type="number"] {
            width: 100px;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 3px;
            margin-left: 8px;
        }
        .auto-fill-modal input[type="number"]:disabled {
            background: #f5f5f5;
            color: #999;
        }
        .auto-fill-modal .button-group {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .auto-fill-modal .modal-btn {
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: white;
            cursor: pointer;
        }
        .auto-fill-modal .modal-btn.primary {
            background: #2656bd;
            color: white;
            border-color: #2656bd;
        }
        .auto-fill-modal .modal-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        /* 消息提示样式 */
        .auto-fill-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10001;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .auto-fill-message.error {
            background: #f44336;
        }
        .auto-fill-message.warning {
            background: #ff9800;
        }
    `;
            document.head.appendChild(style);

            let currentUrl = location.href;
            let isObserving = false;
            let deleteQueue = [];
            let isProcessingDelete = false;
            let deleteType = '';
            let pendingDeleteConfig = null; // 存储待执行的删除配置

            // 初始化脚本
            function init() {
                console.log('拼多多折扣自动填入工具初始化 - 版本3.2');
                observePage();
                observeDeleteConfirm();
            }

            // 监听页面变化
            function observePage() {
                if (isObserving) return;

                const observer = new MutationObserver(function(mutations) {
                    let shouldCheck = false;

                    for (let mutation of mutations) {
                        if (mutation.type === 'childList') {
                            for (let node of mutation.addedNodes) {
                                if (node.nodeType === 1) {
                                    if (node.querySelector && node.querySelector('.GoodsSetting_wrapper__2zdTo')) {
                                        shouldCheck = true;
                                        break;
                                    }
                                    if (node.classList && node.classList.contains('GoodsSetting_wrapper__2zdTo')) {
                                        shouldCheck = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (shouldCheck) {
                        console.log('检测到批量设置容器，准备检查折扣列');
                        setTimeout(checkAndAddButtons, 1000);
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // 监听URL变化
                const urlObserver = new MutationObserver(() => {
                    const newUrl = location.href;
                    if (newUrl !== currentUrl) {
                        currentUrl = newUrl;
                        console.log('URL发生变化，重新检查页面');
                        setTimeout(checkAndAddButtons, 2000);
                    }
                });

                urlObserver.observe(document, { subtree: true, childList: true });
                isObserving = true;

                // 初始检查
                setTimeout(checkAndAddButtons, 2000);
            }

            // 监听删除确认弹窗
            function observeDeleteConfirm() {
                const observer = new MutationObserver(function(mutations) {
                    for (let mutation of mutations) {
                        if (mutation.type === 'childList') {
                            for (let node of mutation.addedNodes) {
                                if (node.nodeType === 1) {
                                    const confirmModal = node.querySelector && node.querySelector('.PP_withConfirmPopoverMain_5-154-0');
                                    if (confirmModal && isProcessingDelete) {
                                        console.log('检测到删除确认弹窗，自动点击确认');
                                        setTimeout(() => {
                                            const confirmBtn = confirmModal.querySelector('button.BTN_primary_5-154-0');
                                            if (confirmBtn) {
                                                confirmBtn.click();
                                                setTimeout(() => {
                                                    processNextDeleteWithRefresh();
                                                }, 2000);
                                            } else {
                                                setTimeout(processNextDeleteWithRefresh, 1000);
                                            }
                                        }, 500);
                                    }
                                }
                            }
                        }
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            // 检查并添加按钮
            function checkAndAddButtons() {
                const batchSettingContainer = document.querySelector('.GoodsSetting_wrapper__2zdTo');
                if (!batchSettingContainer) {
                    console.log('未找到批量设置容器');
                    return;
                }

                if (batchSettingContainer.querySelector('.auto-fill-buttons-container')) {
                    return;
                }

                console.log('添加自动填入按钮');
                addAutoFillButtons(batchSettingContainer);
            }

            // 添加自动填入按钮
            function addAutoFillButtons(container) {
                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'auto-fill-buttons-container';

                const autoFillBtn = document.createElement('button');
                autoFillBtn.className = 'auto-fill-btn';
                autoFillBtn.textContent = '自动填入';
                autoFillBtn.addEventListener('click', handleAutoFill);

                const autoFillAndDeleteBtn = document.createElement('button');
                autoFillAndDeleteBtn.className = 'auto-fill-btn primary';
                autoFillAndDeleteBtn.textContent = '自动填入并删除不合要求项';
                autoFillAndDeleteBtn.addEventListener('click', () => {
                    // 立即显示浮窗
                    showDeleteModal('product');
                });

                const autoFillAndDeleteSpecBtn = document.createElement('button');
                autoFillAndDeleteSpecBtn.className = 'auto-fill-btn primary';
                autoFillAndDeleteSpecBtn.textContent = '自动填入并删除不合要求规格项';
                autoFillAndDeleteSpecBtn.addEventListener('click', () => {
                    // 立即显示浮窗
                    showDeleteModal('spec');
                });

                buttonsContainer.appendChild(autoFillBtn);
                buttonsContainer.appendChild(autoFillAndDeleteBtn);
                buttonsContainer.appendChild(autoFillAndDeleteSpecBtn);

                container.appendChild(buttonsContainer);
                console.log('自动填入按钮添加成功');
            }

            // 处理自动填入 - 返回Promise确保异步完成
            function handleAutoFill() {
                return new Promise((resolve) => {
                    console.log('执行自动填入');

                    // 获取批量设置输入框的值
                    const batchInput = document.querySelector('.GoodsSetting_wrapper__2zdTo input[data-testid="beast-core-inputNumber-htmlInput"]');
                    const fillValue = batchInput && batchInput.value.trim() !== '' ? batchInput.value : '9.9';

                    const discountInputs = getAllDiscountInputs();
                    let processedCount = 0;

                    console.log(`找到 ${discountInputs.length} 个折扣输入框`);

                    if (discountInputs.length === 0) {
                        showMessage('未找到可设置的折扣输入框');
                        resolve();
                        return;
                    }

                    showMessage(`开始为 ${discountInputs.length} 个规格设置折扣，使用值: ${fillValue}`);

                    const processInput = (input, index) => {
                        return new Promise((inputResolve) => {
                            setTimeout(() => {
                                if (!document.body.contains(input)) {
                                    console.log('输入框已不存在，跳过');
                                    inputResolve();
                                    return;
                                }

                                const placeholder = input.getAttribute('placeholder') || '';
                                const maxDiscount = extractMaxDiscountFromPlaceholder(placeholder);

                                let finalValue = fillValue;
                                if (maxDiscount && parseFloat(fillValue) > parseFloat(maxDiscount)) {
                                    finalValue = maxDiscount;
                                    console.log(`折扣值 ${fillValue} 超过限制，自动调整为 ${maxDiscount}`);
                                }

                                setInputValue(input, finalValue);
                                processedCount++;

                                console.log(`已设置第 ${index + 1} 个输入框，值: ${finalValue}`);

                                // 在最后一个输入框处理完后显示消息
                                if (index === discountInputs.length - 1) {
                                    setTimeout(() => {
                                        showMessage(`已为 ${processedCount} 个规格设置折扣`);
                                        console.log('自动填入完成');
                                        inputResolve();
                                    }, 500);
                                } else {
                                    inputResolve();
                                }
                            }, index * 100); // 每个输入框间隔100ms
                        });
                    };

                    // 依次处理所有输入框
                    const processAllInputs = async () => {
                        for (let i = 0; i < discountInputs.length; i++) {
                            await processInput(discountInputs[i], i);
                        }
                        resolve(); // 所有输入框处理完成后resolve
                    };

                    processAllInputs();
                });
            }

            // 显示删除设置浮窗
            function showDeleteModal(type) {
                const existingModal = document.querySelector('.auto-fill-modal');
                if (existingModal) {
                    existingModal.remove();
                }

                const modal = document.createElement('div');
                modal.className = 'auto-fill-modal';
                modal.innerHTML = `
            <h3>删除不合要求项设置</h3>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="minPriceCheckbox">
                    最低价低于
                    <input type="number" id="minPriceInput" step="0.01" min="0" value="" disabled>
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="maxPriceCheckbox">
                    最高价低于
                    <input type="number" id="maxPriceInput" step="0.01" min="0" value="" disabled>
                </label>
            </div>
            <div class="button-group">
                <button class="modal-btn" id="cancelBtn">取消</button>
                <button class="modal-btn primary" id="executeBtn">执行</button>
            </div>
        `;

                document.body.appendChild(modal);

                const minPriceCheckbox = modal.querySelector('#minPriceCheckbox');
                const maxPriceCheckbox = modal.querySelector('#maxPriceCheckbox');
                const minPriceInput = modal.querySelector('#minPriceInput');
                const maxPriceInput = modal.querySelector('#maxPriceInput');
                const cancelBtn = modal.querySelector('#cancelBtn');
                const executeBtn = modal.querySelector('#executeBtn');

                // 默认两个都不选中，输入框为空且禁用
                minPriceCheckbox.checked = false;
                maxPriceCheckbox.checked = false;
                minPriceInput.disabled = true;
                maxPriceInput.disabled = true;
                minPriceInput.value = '';
                maxPriceInput.value = '';

                minPriceCheckbox.addEventListener('change', function() {
                    minPriceInput.disabled = !this.checked;
                    if (!this.checked) {
                        minPriceInput.value = '';
                    }
                });

                maxPriceCheckbox.addEventListener('change', function() {
                    maxPriceInput.disabled = !this.checked;
                    if (!this.checked) {
                        maxPriceInput.value = '';
                    }
                });

                cancelBtn.addEventListener('click', function() {
                    modal.remove();
                });

                executeBtn.addEventListener('click', async function() {
                    const minPrice = minPriceCheckbox.checked ? parseFloat(minPriceInput.value) : null;
                    const maxPrice = maxPriceCheckbox.checked ? parseFloat(maxPriceInput.value) : null;

                    if (minPrice === null && maxPrice === null) {
                        showMessage('请至少选择一个删除条件', true);
                        return;
                    }

                    // 禁用执行按钮，防止重复点击
                    executeBtn.disabled = true;
                    executeBtn.textContent = '处理中...';

                    // 先执行自动填入
                    showMessage('开始自动填入折扣值...', false, 'warning');
                    await handleAutoFill();

                    // 等待自动填入完成并触发事件
                    showMessage('自动填入完成，开始处理删除操作...', false, 'warning');
                    setTimeout(() => {
                        if (type === 'product') {
                            executeDeleteAction(minPrice, maxPrice);
                        } else {
                            executeDeleteSpecAction(minPrice, maxPrice);
                        }
                        modal.remove();
                    }, 1000);
                });
            }

            // 执行删除操作（商品级别）
            function executeDeleteAction(minPrice, maxPrice) {
                console.log(`执行商品删除操作: 最低价${minPrice}, 最高价${maxPrice}`);

                deleteQueue = [];
                deleteType = 'product';

                // 获取所有表格行
                const allRows = Array.from(document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]'));

                // 找出所有包含折扣信息的行（规格行）
                const rowsWithDiscount = allRows.filter(row => {
                    return findDiscountColumn(row) !== null;
                });

                console.log(`找到 ${rowsWithDiscount.length} 个包含折扣列的行`);

                // 用于记录已经处理过的商品ID，避免重复删除
                const processedProductIds = new Set();

                // 处理每个包含折扣信息的行
                rowsWithDiscount.forEach((discountRow, index) => {
                    // 获取折扣列
                    const discountColumn = findDiscountColumn(discountRow);
                    if (!discountColumn) return;

                    // 提取价格信息
                    const priceInfo = extractPriceFromDiscountColumn(discountColumn);
                    if (!priceInfo) {
                        console.log(`行 ${index} 无法从折扣列获取价格信息`);
                        return;
                    }

                    console.log(`行 ${index} 折扣列价格信息:`, priceInfo);

                    // 检查价格条件
                    const matchesCondition = checkPriceCondition(priceInfo, minPrice, maxPrice);
                    console.log(`行 ${index} 条件匹配结果: ${matchesCondition}`);

                    if (matchesCondition) {
                        // 获取商品ID
                        const productId = getProductIdFromProductRow(discountRow, allRows);
                        if (!productId) {
                            console.log(`行 ${index} 无法获取商品ID`);
                            return;
                        }

                        // 如果这个商品已经处理过，跳过
                        if (processedProductIds.has(productId)) {
                            console.log(`商品 ${productId} 已经处理过，跳过`);
                            return;
                        }

                        // 查找对应的商品行
                        const productRow = findProductRowByProductId(productId, allRows);
                        if (!productRow) {
                            console.log(`商品 ${productId} 未找到对应的商品行`);
                            return;
                        }

                        // 查找商品删除按钮
                        const deleteBtn = findProductDeleteButton(productRow);
                        if (deleteBtn) {
                            deleteQueue.push({
                                productId: productId,
                                productRow: productRow,
                                deleteBtn: deleteBtn
                            });
                            processedProductIds.add(productId);
                            console.log(`商品 ${productId} 已加入删除队列，价格: ${priceInfo.minPrice}`);
                        } else {
                            console.log(`商品 ${productId} 符合条件但未找到删除按钮`);
                        }
                    }
                });

                if (deleteQueue.length === 0) {
                    showMessage('没有需要删除的商品');
                    return;
                }

                showMessage(`发现 ${deleteQueue.length} 个需要删除的商品，开始处理...`, false, 'warning');
                console.log('删除队列:', deleteQueue);

                isProcessingDelete = true;
                processNextDeleteWithRefresh();
            }

            // 执行删除操作（规格级别）
            function executeDeleteSpecAction(minPrice, maxPrice) {
                console.log(`执行规格删除操作: 最低价${minPrice}, 最高价${maxPrice}`);

                deleteQueue = [];
                deleteType = 'spec';

                // 获取所有表格行
                const allRows = Array.from(document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]'));

                // 找出所有包含折扣信息的行
                const rowsWithDiscount = allRows.filter(row => {
                    return findDiscountColumn(row) !== null;
                });

                console.log(`找到 ${rowsWithDiscount.length} 个包含折扣列的行`);

                // 处理每个包含折扣信息的行
                rowsWithDiscount.forEach((discountRow, index) => {
                    // 获取折扣列
                    const discountColumn = findDiscountColumn(discountRow);
                    if (!discountColumn) return;

                    // 提取价格信息
                    const priceInfo = extractPriceFromDiscountColumn(discountColumn);
                    if (!priceInfo) {
                        console.log(`行 ${index} 无法从折扣列获取价格信息`);
                        return;
                    }

                    console.log(`行 ${index} 折扣列价格信息:`, priceInfo);

                    // 检查价格条件
                    const matchesCondition = checkPriceCondition(priceInfo, minPrice, maxPrice);
                    console.log(`行 ${index} 条件匹配结果: ${matchesCondition}`);

                    if (matchesCondition) {
                        // 获取规格信息
                        const specInfo = getSpecInfoFromRow(discountRow);

                        // 查找删除按钮
                        const deleteBtn = findSpecDeleteButton(discountRow);

                        if (deleteBtn) {
                            deleteQueue.push({
                                specRow: discountRow,
                                specInfo: specInfo,
                                deleteBtn: deleteBtn,
                                index: index,
                                priceInfo: priceInfo
                            });
                            console.log(`行 ${index} 符合删除条件，已加入队列，规格: ${specInfo}, 价格: ${priceInfo.minPrice}`);
                        } else {
                            console.log(`行 ${index} 符合条件但未找到删除按钮`);
                        }
                    } else {
                        console.log(`行 ${index} 不符合删除条件，价格: ${priceInfo.minPrice}`);
                    }
                });

                if (deleteQueue.length === 0) {
                    showMessage('没有需要删除的规格');
                    return;
                }

                showMessage(`发现 ${deleteQueue.length} 个需要删除的规格，开始处理...`, false, 'warning');
                console.log('删除队列:', deleteQueue);

                isProcessingDelete = true;
                processNextDeleteWithRefresh();
            }

            // 从商品行获取商品ID
            function getProductIdFromProductRow(specRow, allRows) {
                // 找到当前规格行所属的商品行
                const productRow = findProductRowForSpecRow(specRow, allRows);
                if (!productRow) {
                    console.log('未找到对应的商品行');
                    return null;
                }

                // 从商品行中获取商品ID
                return getProductIdFromRow(productRow);
            }

            // 找到规格行对应的商品行
            function findProductRowForSpecRow(specRow, allRows) {
                // 获取当前行的索引
                const currentIndex = allRows.indexOf(specRow);
                if (currentIndex === -1) return null;

                // 向前查找第一个包含商品信息的行
                for (let i = currentIndex; i >= 0; i--) {
                    const row = allRows[i];
                    // 检查是否是商品行（包含商品ID）
                    const productId = getProductIdFromRow(row);
                    if (productId) {
                        return row;
                    }
                }
                return null;
            }

            // 根据商品ID查找商品行
            function findProductRowByProductId(productId, rows) {
                for (let row of rows) {
                    const rowProductId = getProductIdFromRow(row);
                    if (rowProductId === productId) {
                        return row;
                    }
                }
                return null;
            }

            // 查找折扣列
            function findDiscountColumn(row) {
                const tds = row.querySelectorAll('td');
                for (let td of tds) {
                    // 检查是否有折扣信息容器
                    const discountContainer = td.querySelector('.DiscountInfoRender_discountInfo__F1C0s');
                    if (discountContainer) {
                        return td;
                    }
                }
                return null;
            }

            // 检查价格条件 - 修改为"与"关系
            function checkPriceCondition(priceInfo, minPrice, maxPrice) {
                console.log(`检查价格条件: 价格=${priceInfo.minPrice}~${priceInfo.maxPrice}, 条件=最低价低于${minPrice}且最高价低于${maxPrice}`);

                let matchesMin = false;
                let matchesMax = false;

                // 检查最低价条件
                if (minPrice !== null) {
                    if (priceInfo.minPrice < minPrice) {
                        console.log(`✓ 最低价 ${priceInfo.minPrice} 低于设定值 ${minPrice}`);
                        matchesMin = true;
                    } else {
                        console.log(`✗ 最低价 ${priceInfo.minPrice} 不低于设定值 ${minPrice}`);
                        matchesMin = false;
                    }
                } else {
                    // 如果没有设置最低价条件，则视为满足
                    matchesMin = true;
                }

                // 检查最高价条件
                if (maxPrice !== null) {
                    // 如果有价格范围，检查最高价；如果是单个价格，也检查最高价
                    if (priceInfo.maxPrice !== null && priceInfo.maxPrice < maxPrice) {
                        console.log(`✓ 最高价 ${priceInfo.maxPrice} 低于设定值 ${maxPrice}`);
                        matchesMax = true;
                    } else {
                        console.log(`✗ 最高价 ${priceInfo.maxPrice} 不低于设定值 ${maxPrice}`);
                        matchesMax = false;
                    }
                } else {
                    // 如果没有设置最高价条件，则视为满足
                    matchesMax = true;
                }

                // 两个条件都必须满足
                const finalResult = matchesMin && matchesMax;
                console.log(`最终匹配结果: ${finalResult} (最低价条件: ${matchesMin}, 最高价条件: ${matchesMax})`);

                return finalResult;
            }

            // 处理下一个删除
            function processNextDeleteWithRefresh() {
                if (deleteQueue.length === 0) {
                    isProcessingDelete = false;
                    showMessage('删除操作完成');
                    return;
                }

                const currentItem = refreshCurrentDeleteItem();
                if (!currentItem) {
                    console.log('无法找到当前删除项目，跳过');
                    deleteQueue.shift();
                    setTimeout(processNextDeleteWithRefresh, 1000);
                    return;
                }

                console.log(`点击${deleteType === 'product' ? '商品' : '规格'}删除按钮`, currentItem);

                try {
                    currentItem.deleteBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    currentItem.deleteBtn.click();
                    showMessage(`正在删除${deleteType === 'product' ? '商品' : '规格'}，剩余 ${deleteQueue.length - 1} 个`, false, 'warning');

                    deleteQueue.shift();
                } catch (error) {
                    console.error('点击删除按钮失败:', error);
                    deleteQueue.shift();
                    setTimeout(processNextDeleteWithRefresh, 1000);
                }
            }

            // 刷新当前删除项目
            function refreshCurrentDeleteItem() {
                if (deleteQueue.length === 0) return null;

                const firstItem = deleteQueue[0];

                if (deleteType === 'product') {
                    const allRows = Array.from(document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]'));
                    const currentRow = findProductRowByProductId(firstItem.productId, allRows);
                    if (currentRow) {
                        const deleteBtn = findProductDeleteButton(currentRow);
                        if (deleteBtn) {
                            return {
                                productId: firstItem.productId,
                                productRow: currentRow,
                                deleteBtn: deleteBtn
                            };
                        }
                    }
                } else {
                    // 对于规格删除，重新查找对应的行
                    const allRows = Array.from(document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]'));
                    const currentRow = findRowByContent(firstItem.specInfo, allRows);
                    if (currentRow) {
                        const deleteBtn = findSpecDeleteButton(currentRow);
                        if (deleteBtn) {
                            return {
                                specRow: currentRow,
                                specInfo: firstItem.specInfo,
                                deleteBtn: deleteBtn
                            };
                        }
                    }
                }

                return null;
            }

            // 根据内容查找行
            function findRowByContent(content, rows) {
                for (let row of rows) {
                    const rowContent = getSpecInfoFromRow(row);
                    if (rowContent === content) {
                        return row;
                    }
                }
                return null;
            }

            // 获取所有折扣输入框
            function getAllDiscountInputs() {
                const allInputs = Array.from(document.querySelectorAll('input[data-testid="beast-core-inputNumber-htmlInput"]'));

                return allInputs.filter(input => {
                    const batchContainer = input.closest('.GoodsSetting_wrapper__2zdTo');
                    if (batchContainer) return false;

                    const td = input.closest('td');
                    if (!td) return false;

                    const discountContainer = td.querySelector('.DiscountInfoRender_discountInfo__F1C0s');
                    return discountContainer !== null;
                });
            }

            // 从placeholder提取最大折扣值
            function extractMaxDiscountFromPlaceholder(placeholder) {
                const match = placeholder.match(/(\d+(?:\.\d+)?)～(\d+(?:\.\d+)?)/);
                return match ? match[2] : null;
            }

            // 设置输入框值 - 使用可靠的版本
            function setInputValue(input, value) {
                if (!document.body.contains(input)) {
                    console.log('输入框已不存在，跳过设置');
                    return;
                }

                // 先聚焦
                input.focus();

                // 清空当前值
                input.value = '';

                // 设置新值
                input.value = value;

                // 触发所有可能的事件
                const events = ['input', 'change', 'blur', 'keydown', 'keyup', 'focus'];
                events.forEach(eventType => {
                    const event = new Event(eventType, { bubbles: true });
                    input.dispatchEvent(event);
                });

                // 额外触发React可能监听的事件
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(input, value);
                }

                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);

                const changeEvent = new Event('change', { bubbles: true });
                input.dispatchEvent(changeEvent);

                // 模拟用户输入
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

                console.log(`设置输入框值为: ${value}`);
            }

            // 从折扣列提取价格信息
            function extractPriceFromDiscountColumn(column) {
                const priceElement = column.querySelector('.Message_message__19knS');
                if (priceElement) {
                    const priceText = priceElement.textContent || '';
                    console.log(`折扣列价格文本: ${priceText}`);

                    // 匹配价格范围格式 "¥6.55～18.03"
                    const rangeMatch = priceText.match(/¥([\d.]+)～([\d.]+)/);
                    if (rangeMatch) {
                        const minPrice = parseFloat(rangeMatch[1]);
                        const maxPrice = parseFloat(rangeMatch[2]);
                        console.log(`提取到价格范围: ${minPrice}～${maxPrice}`);
                        return { minPrice: minPrice, maxPrice: maxPrice };
                    }

                    // 匹配单个价格格式 "¥6.55"
                    const singleMatch = priceText.match(/¥([\d.]+)/);
                    if (singleMatch) {
                        const price = parseFloat(singleMatch[1]);
                        console.log(`提取到单个价格: ${price}`);
                        return { minPrice: price, maxPrice: price };
                    }
                }

                return null;
            }

            // 查找商品删除按钮
            function findProductDeleteButton(row) {
                // 查找包含"删除商品"文本的按钮
                const deleteBtns = row.querySelectorAll('a.BTN_outerWrapper_5-154-0');
                for (let btn of deleteBtns) {
                    if (btn.textContent.includes('删除商品')) {
                        console.log('找到商品删除按钮');
                        return btn;
                    }
                }

                console.log('未找到商品删除按钮');
                return null;
            }

            // 查找规格删除按钮
            function findSpecDeleteButton(row) {
                // 查找包含"删除"文本的按钮（但不包含"删除商品"）
                const deleteBtns = row.querySelectorAll('a.BTN_outerWrapper_5-154-0');
                for (let btn of deleteBtns) {
                    if (btn.textContent.includes('删除') && !btn.textContent.includes('删除商品')) {
                        console.log('找到规格删除按钮');
                        return btn;
                    }
                }

                console.log('未找到规格删除按钮');
                return null;
            }

            // 从行中获取商品ID
            function getProductIdFromRow(row) {
                // 查找所有可能包含商品ID的元素
                const idElements = row.querySelectorAll('div[data-testid="beast-core-ellipsis"]');
                for (let idElement of idElements) {
                    const idText = idElement.textContent || idElement.innerText;
                    const match = idText.match(/ID:\s*(\d+)/);
                    if (match) {
                        return match[1];
                    }
                }

                // 如果上面没找到，尝试在行的文本内容中查找
                const rowText = row.textContent || row.innerText;
                const rowMatch = rowText.match(/ID:\s*(\d+)/);
                if (rowMatch) {
                    return rowMatch[1];
                }

                return null;
            }

            // 从行中获取规格信息
            function getSpecInfoFromRow(row) {
                // 查找包含规格名称的单元格
                const tds = row.querySelectorAll('td');
                for (let td of tds) {
                    const specDiv = td.querySelector('.GoodsTable_cell__1ym76');
                    if (specDiv) {
                        const firstDiv = specDiv.querySelector('div:first-child');
                        if (firstDiv) {
                            let specText = firstDiv.textContent || firstDiv.innerText;
                            // 移除"删除"按钮文本
                            specText = specText.replace(/删除/g, '').trim();
                            // 排除"全部规格"的商品行
                            if (specText && !specText.includes('全部规格')) {
                                return specText;
                            }
                        }
                    }
                }
                return `规格_${Math.random().toString(36).substr(2, 9)}`;
            }

            // 显示消息
            function showMessage(message, isError = false, type = '') {
                const existingMessage = document.querySelector('.auto-fill-message');
                if (existingMessage) {
                    existingMessage.remove();
                }

                const messageDiv = document.createElement('div');
                if (type === 'warning') {
                    messageDiv.className = 'auto-fill-message warning';
                } else {
                    messageDiv.className = isError ? 'auto-fill-message error' : 'auto-fill-message';
                }
                messageDiv.textContent = message;

                document.body.appendChild(messageDiv);

                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 3000);
            }

            // 页面加载完成后初始化
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })();
    }

    // ================================
    // 特定页面脚本 - 优惠券
    // ================================
    function initCoupon() {
        (function() {
            'use strict';

            // 创建悬浮窗样式
            const style = document.createElement('style');
            style.textContent = `
        .batch-end-progress {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 400px;
            max-width: 500px;
            cursor: move;
            user-select: none;
        }
        .progress-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1890ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: #1890ff;
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-text {
            margin: 10px 0;
            font-size: 12px;
            color: #666;
        }
        .current-item {
            margin: 10px 0;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 12px;
            max-height: 60px;
            overflow-y: auto;
            border-left: 3px solid #1890ff;
        }
        .progress-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            gap: 10px;
        }
        .progress-controls button {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .progress-controls button:hover {
            background: #f5f5f5;
        }
        .progress-controls button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .progress-controls button.danger {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
        .progress-minimized {
            position: fixed;
            top: 50%;
            right: 20px;
            background: white;
            border: 1px solid #1890ff;
            border-radius: 20px;
            padding: 10px 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10000;
            cursor: pointer;
            font-size: 12px;
            color: #1890ff;
            user-select: none;
        }
        .progress-completed {
            border-color: #52c41a;
        }
        .progress-completed .progress-header {
            color: #52c41a;
        }
        .conditional-filter-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            min-width: 400px;
            max-width: 500px;
            cursor: move;
            user-select: none;
        }
        .filter-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1890ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .filter-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
        }
        .filter-checkbox {
            margin-right: 10px;
        }
        .filter-label {
            min-width: 120px;
            font-size: 14px;
            margin-right: 10px;
        }
        .filter-input {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
        }
        .filter-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 10px;
        }
        .filter-controls button {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .filter-controls button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .filter-controls button.danger {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
    `;
            document.head.appendChild(style);

            // 全局控制变量
            let isPaused = false;
            let isStopped = false;
            let currentProcess = null;

            // 添加批量结束按钮
            function addBatchEndButton() {
                const createCouponBtn = document.querySelector('[data-tracking-viewid="el_pop_up_window_entry_button"]');
                if (createCouponBtn && !document.querySelector('#endCurrentPageBtn')) {
                    const container = createCouponBtn.parentNode;

                    // 添加结束当前页所有按钮
                    if (!document.querySelector('#endCurrentPageBtn')) {
                        const endCurrentPageBtn = createCouponBtn.cloneNode(true);
                        endCurrentPageBtn.id = 'endCurrentPageBtn';
                        endCurrentPageBtn.innerHTML = '<span>结束当前页所有</span>';
                        endCurrentPageBtn.style.marginLeft = '10px';
                        endCurrentPageBtn.addEventListener('click', endCurrentPageAll);
                        container.appendChild(endCurrentPageBtn);
                    }

                    // 添加结束所有按钮
                    if (!document.querySelector('#endAllBtn')) {
                        const endAllBtn = createCouponBtn.cloneNode(true);
                        endAllBtn.id = 'endAllBtn';
                        endAllBtn.innerHTML = '<span>结束所有</span>';
                        endAllBtn.style.marginLeft = '10px';
                        endAllBtn.addEventListener('click', endAll);
                        container.appendChild(endAllBtn);
                    }

                    // 添加条件筛选结束按钮
                    if (!document.querySelector('#conditionalEndBtn')) {
                        const conditionalEndBtn = createCouponBtn.cloneNode(true);
                        conditionalEndBtn.id = 'conditionalEndBtn';
                        conditionalEndBtn.innerHTML = '<span>条件筛选结束</span>';
                        conditionalEndBtn.style.marginLeft = '10px';
                        conditionalEndBtn.addEventListener('click', showConditionalFilterModal);
                        container.appendChild(conditionalEndBtn);
                    }
                }
            }

            // 显示条件筛选模态框
            function showConditionalFilterModal() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                const modal = document.createElement('div');
                modal.className = 'conditional-filter-modal';
                modal.innerHTML = `
            <div class="filter-header">
                <span>条件筛选设置</span>
                <button class="close-btn" style="background:none;border:none;cursor:pointer;font-size:16px;">×</button>
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="couponNameCheck">
                <label class="filter-label">优惠券名称包含</label>
                <input type="text" class="filter-input" id="couponNameInput" placeholder="输入优惠券名称关键字">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="productNameCheck">
                <label class="filter-label">商品名称包含</label>
                <input type="text" class="filter-input" id="productNameInput" placeholder="输入商品名称关键字">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="faceValueLessCheck">
                <label class="filter-label">面值小于</label>
                <input type="number" class="filter-input" id="faceValueLessInput" placeholder="输入面值" step="0.01">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="faceValueGreaterCheck">
                <label class="filter-label">面值大于</label>
                <input type="number" class="filter-input" id="faceValueGreaterInput" placeholder="输入面值" step="0.01">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="faceValueEqualCheck">
                <label class="filter-label">面值等于</label>
                <input type="number" class="filter-input" id="faceValueEqualInput" placeholder="输入面值" step="0.01">
            </div>
            <div class="filter-controls">
                <button id="closeFilterBtn" class="danger">关闭窗口</button>
                <button id="startFilterEndBtn" class="primary">启动结束</button>
            </div>
        `;

                // 添加拖拽功能
                makeDraggable(modal);

                // 关闭按钮
                modal.querySelector('.close-btn').addEventListener('click', () => {
                    modal.remove();
                });

                // 关闭窗口按钮
                modal.querySelector('#closeFilterBtn').addEventListener('click', () => {
                    modal.remove();
                });

                // 启动结束按钮
                modal.querySelector('#startFilterEndBtn').addEventListener('click', () => {
                    const conditions = {
                        couponName: {
                            enabled: document.getElementById('couponNameCheck').checked,
                            value: document.getElementById('couponNameInput').value.trim()
                        },
                        productName: {
                            enabled: document.getElementById('productNameCheck').checked,
                            value: document.getElementById('productNameInput').value.trim()
                        },
                        faceValueLess: {
                            enabled: document.getElementById('faceValueLessCheck').checked,
                            value: parseFloat(document.getElementById('faceValueLessInput').value) || 0
                        },
                        faceValueGreater: {
                            enabled: document.getElementById('faceValueGreaterCheck').checked,
                            value: parseFloat(document.getElementById('faceValueGreaterInput').value) || 0
                        },
                        faceValueEqual: {
                            enabled: document.getElementById('faceValueEqualCheck').checked,
                            value: parseFloat(document.getElementById('faceValueEqualInput').value) || 0
                        }
                    };

                    // 验证至少选择了一个条件
                    if (!conditions.couponName.enabled && !conditions.productName.enabled &&
                        !conditions.faceValueLess.enabled && !conditions.faceValueGreater.enabled && !conditions.faceValueEqual.enabled) {
                        alert('请至少选择一个筛选条件！');
                        return;
                    }

                    // 验证面值条件不冲突
                    if (conditions.faceValueLess.enabled && conditions.faceValueGreater.enabled) {
                        if (conditions.faceValueLess.value <= conditions.faceValueGreater.value) {
                            alert('面值小于的条件值必须大于面值大于的条件值！');
                            return;
                        }
                    }

                    if (conditions.faceValueEqual.enabled) {
                        if (conditions.faceValueLess.enabled && conditions.faceValueEqual.value >= conditions.faceValueLess.value) {
                            alert('面值等于的条件值必须小于面值小于的条件值！');
                            return;
                        }
                        if (conditions.faceValueGreater.enabled && conditions.faceValueEqual.value <= conditions.faceValueGreater.value) {
                            alert('面值等于的条件值必须大于面值大于的条件值！');
                            return;
                        }
                    }

                    modal.remove();
                    startConditionalEnd(conditions);
                });

                document.body.appendChild(modal);
            }

            // 开始条件筛选结束 - 添加多轮检查机制
            async function startConditionalEnd(conditions) {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    conditions: conditions
                };

                try {
                    let round = 1;
                    const maxRounds = 2; // 最多检查两遍
                    let hasMatches = false;

                    for (round = 1; round <= maxRounds && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮条件筛选检查...`, 0);

                        const totalPages = getTotalPages();
                        let currentPage = getCurrentPage();

                        // 从第一页开始处理
                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 跳转到目标页面
                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                // 等待页面稳定
                                await delay(1000);
                            }

                            // 处理当前页的条件筛选
                            const pageMatches = await processPageWithConditionFilter(page, totalPages, conditions);
                            if (pageMatches > 0) {
                                hasMatches = true;
                            }

                            updateProgress(
                                currentProcess.modal,
                                `第 ${round} 轮 - 第 ${page}/${totalPages} 页处理完成，发现 ${pageMatches} 个匹配项`,
                                50 + (page / totalPages) * 25
                            );
                        }

                        // 如果第一轮没有发现匹配项，提前结束
                        if (!hasMatches && round === 1) {
                            updateProgress(currentProcess.modal, "未找到任何匹配条件的优惠券", 100);
                            break;
                        }

                        // 如果这是第一轮且发现了匹配项，继续第二轮
                        if (round === 1 && hasMatches) {
                            updateProgress(currentProcess.modal, "第一轮检查完成，开始第二轮检查防止疏漏", 100);
                            // 回到第一页准备第二轮
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                await delay(1000);
                            }
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `条件筛选结束已停止！共处理了 ${currentProcess.processedCount} 个优惠券`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `条件筛选结束完成！共处理了 ${currentProcess.processedCount} 个优惠券`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        const minimized = document.querySelector('.progress-minimized');
                        if (minimized) minimized.remove();
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('条件筛选结束出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 使用条件筛选处理页面
            async function processPageWithConditionFilter(page, totalPages, conditions) {
                let matchCount = 0;
                let hasMoreMatches = true;
                let safetyCounter = 0;
                const maxSafetyCount = 100;

                while (hasMoreMatches && !isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    // 等待暂停状态解除
                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    // 每次循环都重新获取当前页的行列表
                    const rows = getAllRowsFromCurrentPage();
                    let foundMatchInThisCycle = false;

                    for (let i = 0; i < rows.length && !isStopped; i++) {
                        // 等待暂停状态解除
                        while (isPaused && !isStopped) {
                            await delay(500);
                        }
                        if (isStopped) break;

                        const row = rows[i];

                        // 检查是否满足所有启用的条件
                        if (checkRowConditions(row, conditions)) {
                            foundMatchInThisCycle = true;
                            matchCount++;

                            const couponName = getCouponNameFromRow(row);
                            const couponId = getCouponIdFromRow(row);

                            updateProgress(
                                currentProcess.modal,
                                `第 ${page}/${totalPages} 页 - 处理匹配项 ${matchCount} (ID: ${couponId})`,
                                50 + ((page - 1) / totalPages) * 25 + ((i + 1) / rows.length) * (25 / totalPages),
                                couponName
                            );

                            // 清理所有已存在的弹窗
                            await cleanUpAllModals();

                            const endBtn = row.querySelector('[data-tracking-click-viewid="close_coupon_batch"]');
                            if (endBtn) {
                                // 点击结束按钮
                                endBtn.click();

                                // 等待弹窗出现并处理
                                const handled = await waitForAndHandleModal();
                                if (handled) {
                                    currentProcess.processedCount++;

                                    // 重要：等待操作完成，让页面有时间更新DOM
                                    await delay(1500);

                                    // 再次清理可能残留的弹窗
                                    await cleanUpAllModals();

                                    // 重要：处理完一个活动后，跳出当前循环，重新获取行列表
                                    break;
                                }
                            }

                            // 如果成功处理了一个活动，跳出循环重新获取行列表
                            if (foundMatchInThisCycle) {
                                break;
                            }
                        }
                    }

                    // 如果这一轮没有找到匹配项，说明当前页已经处理完毕
                    if (!foundMatchInThisCycle) {
                        hasMoreMatches = false;
                    }

                    // 短暂等待，让页面有机会稳定
                    await delay(500);
                }

                return matchCount;
            }

            // 检查行是否满足所有条件
            function checkRowConditions(row, conditions) {
                // 优惠券名称条件检查
                if (conditions.couponName.enabled) {
                    const couponNameElement = row.querySelector('td:nth-child(1) div');
                    if (couponNameElement) {
                        const couponName = couponNameElement.textContent.trim();
                        if (!couponName.includes(conditions.couponName.value)) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                // 商品名称条件检查
                if (conditions.productName.enabled) {
                    const productNameElement = row.querySelector('td:nth-child(3) .advanced_detail__1NanJ span:first-child');
                    if (productNameElement) {
                        const productName = productNameElement.textContent.trim();
                        if (!productName.includes(conditions.productName.value)) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                // 面值条件检查
                if (conditions.faceValueLess.enabled || conditions.faceValueGreater.enabled || conditions.faceValueEqual.enabled) {
                    const faceValueElement = row.querySelector('td:nth-child(5) span');
                    if (faceValueElement) {
                        const faceValueText = faceValueElement.textContent.trim();
                        // 提取数字部分，去除"元"字
                        const faceValueMatch = faceValueText.match(/(\d+\.?\d*)/);
                        if (faceValueMatch) {
                            const faceValue = parseFloat(faceValueMatch[1]);

                            // 检查面值小于条件
                            if (conditions.faceValueLess.enabled) {
                                if (faceValue >= conditions.faceValueLess.value) {
                                    return false;
                                }
                            }

                            // 检查面值大于条件
                            if (conditions.faceValueGreater.enabled) {
                                if (faceValue <= conditions.faceValueGreater.value) {
                                    return false;
                                }
                            }

                            // 检查面值等于条件
                            if (conditions.faceValueEqual.enabled) {
                                if (faceValue !== conditions.faceValueEqual.value) {
                                    return false;
                                }
                            }
                        } else {
                            return false; // 无法解析面值
                        }
                    } else {
                        return false; // 没有找到面值元素
                    }
                }

                return true;
            }

            // 结束当前页所有活动 - 添加多轮检查机制
            async function endCurrentPageAll() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    currentPageIds: []
                };

                try {
                    updateProgress(currentProcess.modal, "正在获取当前页优惠券信息...", 0);

                    // 获取当前页所有行的ID
                    const currentPageIds = getCurrentPageIds();
                    const totalIds = currentPageIds.length;

                    if (totalIds === 0) {
                        updateProgress(currentProcess.modal, "当前页没有优惠券", 100);
                        setTimeout(() => {
                            if (progressModal && progressModal.parentNode) {
                                progressModal.remove();
                            }
                            currentProcess = null;
                        }, 2000);
                        return;
                    }

                    currentProcess.currentPageIds = currentPageIds;
                    currentProcess.totalCount = totalIds;

                    updateProgress(currentProcess.modal, `开始处理当前页 ${totalIds} 个优惠券`, 0);

                    let round = 1;
                    const maxRounds = 2; // 最多检查两遍
                    let hasRemaining = true;

                    for (round = 1; round <= maxRounds && hasRemaining && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮检查...`, 0);
                        hasRemaining = false;

                        let processedIds = [];
                        let safetyCounter = 0;
                        const maxSafetyCount = 100;

                        while (!isStopped && safetyCounter < maxSafetyCount) {
                            safetyCounter++;

                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 每次循环都重新获取当前页的行列表
                            const rows = getAllRowsFromCurrentPage();
                            let foundMatchInThisCycle = false;

                            for (let i = 0; i < rows.length && !isStopped; i++) {
                                // 等待暂停状态解除
                                while (isPaused && !isStopped) {
                                    await delay(500);
                                }
                                if (isStopped) break;

                                const row = rows[i];
                                const rowId = getCouponIdFromRow(row);

                                // 检查是否是当前页的ID且尚未处理
                                if (currentPageIds.includes(rowId) && !processedIds.includes(rowId)) {
                                    foundMatchInThisCycle = true;
                                    hasRemaining = true;

                                    updateProgress(
                                        currentProcess.modal,
                                        `第 ${round} 轮 - 正在处理第 ${processedIds.length + 1}/${totalIds} 项 (ID: ${rowId})`,
                                        ((processedIds.length + 1) / totalIds) * 100,
                                        `ID: ${rowId}`
                                    );

                                    // 清理所有已存在的弹窗
                                    await cleanUpAllModals();

                                    const endBtn = row.querySelector('[data-tracking-click-viewid="close_coupon_batch"]');
                                    if (endBtn) {
                                        // 点击结束按钮
                                        endBtn.click();

                                        // 等待弹窗出现并处理
                                        const handled = await waitForAndHandleModal();
                                        if (handled) {
                                            currentProcess.processedCount++;
                                            processedIds.push(rowId);

                                            // 重要：等待操作完成，让页面有时间更新DOM
                                            await delay(1500);

                                            // 再次清理可能残留的弹窗
                                            await cleanUpAllModals();

                                            // 重要：处理完一个活动后，跳出当前循环，重新获取行列表
                                            break;
                                        }
                                    }

                                    // 如果成功处理了一个活动，跳出循环重新获取行列表
                                    if (foundMatchInThisCycle) {
                                        break;
                                    }
                                }
                            }

                            // 如果这一轮没有找到匹配项，说明当前页已经处理完毕
                            if (!foundMatchInThisCycle) {
                                break;
                            }

                            // 短暂等待，让页面有机会稳定
                            await delay(500);
                        }

                        updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，处理了 ${processedIds.length} 个优惠券`, 100);

                        // 如果这一轮处理了活动，短暂等待后继续下一轮
                        if (hasRemaining && round < maxRounds) {
                            updateProgress(currentProcess.modal, `准备开始第 ${round + 1} 轮检查...`, 100);
                            await delay(1000);
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `结束当前页已停止！共处理了 ${currentProcess.processedCount} 个优惠券`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `结束当前页完成！共处理了 ${currentProcess.processedCount} 个优惠券`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('结束当前页所有出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 结束所有活动 - 添加多轮检查机制
            async function endAll() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0
                };

                try {
                    updateProgress(currentProcess.modal, "开始结束所有优惠券...", 0);

                    let round = 1;
                    const maxRounds = 2; // 最多检查两遍
                    let hasRemaining = true;

                    for (round = 1; round <= maxRounds && hasRemaining && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮全量检查...`, 0);
                        hasRemaining = false;

                        const totalPages = getTotalPages();
                        let currentPage = getCurrentPage();

                        // 从第一页开始处理
                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 跳转到目标页面
                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                // 等待页面稳定
                                await delay(1000);
                            }

                            // 处理当前页
                            const pageProcessed = await processCurrentPageForEndAll(page, totalPages);
                            if (pageProcessed > 0) {
                                hasRemaining = true;
                            }

                            updateProgress(
                                currentProcess.modal,
                                `第 ${round} 轮 - 第 ${page}/${totalPages} 页处理完成，处理了 ${pageProcessed} 个优惠券`,
                                50 + (page / totalPages) * 25
                            );
                        }

                        // 如果这一轮处理了活动，回到第一页准备下一轮
                        if (hasRemaining && round < maxRounds) {
                            updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，发现剩余活动，开始下一轮...`, 100);
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                await delay(1000);
                            }
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `结束所有已停止！共处理了 ${currentProcess.processedCount} 个优惠券`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `结束所有完成！共处理了 ${currentProcess.processedCount} 个优惠券`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('结束所有出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 处理当前页用于结束所有功能
            async function processCurrentPageForEndAll(page, totalPages) {
                let pageProcessed = 0;
                let safetyCounter = 0;
                const maxSafetyCount = 100;

                while (!isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    // 等待暂停状态解除
                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    // 每次循环都重新获取当前页的行列表
                    const rows = getAllRowsFromCurrentPage();

                    // 如果没有活动行，说明当前页已经处理完成
                    if (rows.length === 0) {
                        break;
                    }

                    let foundActivityInThisCycle = false;

                    // 获取第一个活动行
                    const firstRow = rows[0];
                    const couponName = getCouponNameFromRow(firstRow);
                    const couponId = getCouponIdFromRow(firstRow);

                    updateProgress(
                        currentProcess.modal,
                        `第 ${page}/${totalPages} 页 - 正在处理第 ${pageProcessed + 1} 项 (ID: ${couponId})`,
                        50 + ((page - 1) / totalPages) * 25 + ((pageProcessed + 1) / Math.max(rows.length, 1)) * (25 / totalPages),
                        couponName
                    );

                    // 清理所有已存在的弹窗
                    await cleanUpAllModals();

                    const endBtn = firstRow.querySelector('[data-tracking-click-viewid="close_coupon_batch"]');
                    if (endBtn) {
                        // 点击结束按钮
                        endBtn.click();

                        // 等待弹窗出现并处理
                        const handled = await waitForAndHandleModal();
                        if (handled) {
                            currentProcess.processedCount++;
                            pageProcessed++;
                            foundActivityInThisCycle = true;

                            // 重要：等待操作完成，让页面有时间更新DOM
                            await delay(1500);

                            // 再次清理可能残留的弹窗
                            await cleanUpAllModals();
                        }
                    } else {
                        // 如果没有找到结束按钮，可能是页面结构变化
                        break;
                    }

                    // 如果这一轮没有处理任何活动，说明当前页已经处理完毕
                    if (!foundActivityInThisCycle) {
                        break;
                    }

                    // 短暂等待，让页面有机会稳定
                    await delay(500);
                }

                return pageProcessed;
            }

            // 等待并处理弹窗 - 优化版
            async function waitForAndHandleModal() {
                return new Promise((resolve) => {
                    let handled = false;
                    let checkCount = 0;
                    const maxChecks = 50; // 增加检查次数

                    const checkModal = () => {
                        if (handled || checkCount >= maxChecks || isStopped) {
                            resolve(handled);
                            return;
                        }

                        checkCount++;

                        // 先检查是否有设置恢复时间弹窗（直接结束按钮）
                        const timingModals = document.querySelectorAll('[data-tracking-impr-viewid="temp_end_pop_shared"]');
                        let foundStraightEnd = false;

                        timingModals.forEach(modal => {
                            const straightEndBtns = modal.querySelectorAll('[data-tracking-viewid="straight_end_shared"]');
                            straightEndBtns.forEach(btn => {
                                if (btn && !foundStraightEnd) {
                                    btn.click();
                                    handled = true;
                                    foundStraightEnd = true;
                                }
                            });
                        });

                        // 如果有直接结束按钮被点击，继续检查是否还有更多
                        if (foundStraightEnd) {
                            setTimeout(checkModal, 300);
                            return;
                        }

                        // 如果没有直接结束按钮，检查确认结束弹窗
                        if (!handled) {
                            const confirmModals = document.querySelectorAll('.PP_withConfirmPopoverMain_5-154-0');
                            confirmModals.forEach(modal => {
                                const confirmBtn = modal.querySelector('.BTN_primary_5-154-0');
                                if (confirmBtn && !handled) {
                                    confirmBtn.click();
                                    handled = true;
                                }
                            });
                        }

                        if (handled) {
                            // 等待一下确保弹窗处理完成
                            setTimeout(() => {
                                resolve(handled);
                            }, 500);
                        } else {
                            setTimeout(checkModal, 100);
                        }
                    };

                    checkModal();
                });
            }

            // 清理所有已存在的弹窗
            async function cleanUpAllModals() {
                let cleanedCount = 0;
                let maxCleaningCycles = 5;

                for (let cycle = 0; cycle < maxCleaningCycles; cycle++) {
                    let foundModal = false;

                    // 处理设置恢复时间弹窗（优先处理直接结束）
                    const timingModals = document.querySelectorAll('[data-tracking-impr-viewid="temp_end_pop_shared"]');
                    timingModals.forEach(modal => {
                        const straightEndBtns = modal.querySelectorAll('[data-tracking-viewid="straight_end_shared"]');
                        straightEndBtns.forEach(btn => {
                            if (btn) {
                                btn.click();
                                cleanedCount++;
                                foundModal = true;
                            }
                        });
                    });

                    // 处理确认结束弹窗
                    const confirmModals = document.querySelectorAll('.PP_withConfirmPopoverMain_5-154-0');
                    confirmModals.forEach(modal => {
                        const confirmBtn = modal.querySelector('.BTN_primary_5-154-0');
                        if (confirmBtn) {
                            confirmBtn.click();
                            cleanedCount++;
                            foundModal = true;
                        }
                    });

                    // 如果这一轮没有找到弹窗，退出循环
                    if (!foundModal) {
                        break;
                    }

                    // 等待一下让弹窗消失
                    await delay(500);
                }

                return cleanedCount;
            }

            // 获取当前页所有行
            function getAllRowsFromCurrentPage() {
                return Array.from(document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]'));
            }

            // 获取当前页所有优惠券ID
            function getCurrentPageIds() {
                const rows = getAllRowsFromCurrentPage();
                const ids = [];

                rows.forEach(row => {
                    const id = getCouponIdFromRow(row);
                    if (id && id !== '未知ID') {
                        ids.push(id);
                    }
                });

                return ids;
            }

            // 从行中获取优惠券ID
            function getCouponIdFromRow(row) {
                const idElement = row.querySelector('td:nth-child(3) .advanced_detail__1NanJ span:last-child');
                if (idElement && idElement.textContent.includes('ID:')) {
                    const idText = idElement.textContent.trim();
                    const idMatch = idText.match(/ID:\s*(\d+)/);
                    return idMatch ? idMatch[1] : '未知ID';
                }
                return '未知ID';
            }

            // 从行中获取优惠券名称
            function getCouponNameFromRow(row) {
                const nameElement = row.querySelector('td:nth-child(1) div');
                if (nameElement && nameElement.textContent.trim()) {
                    const text = nameElement.textContent.trim();
                    return text.length > 50 ? text.substring(0, 50) + '...' : text;
                }

                const idElement = row.querySelector('td:nth-child(3) .advanced_detail__1NanJ span:last-child');
                if (idElement && idElement.textContent.includes('ID:')) {
                    return idElement.textContent.trim();
                }

                return '未知优惠券';
            }

            // 创建进度悬浮窗
            function createProgressModal() {
                const modal = document.createElement('div');
                modal.className = 'batch-end-progress';
                modal.innerHTML = `
            <div class="progress-header">
                <span>批量结束进度</span>
                <div>
                    <button class="minimize-btn" style="background:none;border:none;cursor:pointer;font-size:16px;margin-right:5px;">−</button>
                    <button class="close-btn" style="background:none;border:none;cursor:pointer;font-size:16px;">×</button>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">准备开始...</div>
            <div class="current-item">当前操作：无</div>
            <div class="progress-controls">
                <button id="pauseResumeBtn" class="primary">暂停</button>
                <button id="stopBtn" class="danger">停止</button>
            </div>
        `;

                // 添加拖拽功能
                makeDraggable(modal);

                // 最小化按钮
                modal.querySelector('.minimize-btn').addEventListener('click', () => {
                    const minimized = createMinimizedView();
                    document.body.appendChild(minimized);
                    modal.style.display = 'none';
                });

                // 关闭按钮
                modal.querySelector('.close-btn').addEventListener('click', () => {
                    isStopped = true;
                    modal.remove();
                    const minimized = document.querySelector('.progress-minimized');
                    if (minimized) minimized.remove();
                    currentProcess = null;
                });

                // 暂停/继续按钮
                const pauseResumeBtn = modal.querySelector('#pauseResumeBtn');
                pauseResumeBtn.addEventListener('click', () => {
                    if (isPaused) {
                        isPaused = false;
                        pauseResumeBtn.textContent = '暂停';
                        pauseResumeBtn.className = 'primary';
                    } else {
                        isPaused = true;
                        pauseResumeBtn.textContent = '继续';
                        pauseResumeBtn.className = '';
                    }
                });

                // 停止按钮
                modal.querySelector('#stopBtn').addEventListener('click', () => {
                    isStopped = true;
                    modal.querySelector('.progress-text').textContent = '正在停止...';
                });

                return modal;
            }

            // 使元素可拖拽
            function makeDraggable(element) {
                const header = element.querySelector('.progress-header') || element.querySelector('.filter-header');
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

                header.onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    element.style.top = (element.offsetTop - pos2) + "px";
                    element.style.left = (element.offsetLeft - pos1) + "px";
                    element.style.transform = 'none';
                }

                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }

            // 创建最小化视图
            function createMinimizedView() {
                const minimized = document.createElement('div');
                minimized.className = 'progress-minimized';
                minimized.innerHTML = '批量结束进行中...';

                makeDraggable(minimized);

                minimized.addEventListener('click', () => {
                    const modal = document.querySelector('.batch-end-progress');
                    if (modal) {
                        modal.style.display = 'block';
                    }
                    minimized.remove();
                });

                minimized.addEventListener('dblclick', () => {
                    isStopped = true;
                    minimized.remove();
                    const modal = document.querySelector('.batch-end-progress');
                    if (modal) modal.remove();
                    currentProcess = null;
                });

                return minimized;
            }

            // 更新进度显示
            function updateProgress(modal, text, percent, itemName = '') {
                const progressFill = modal.querySelector('.progress-fill');
                const progressText = modal.querySelector('.progress-text');
                const currentItem = modal.querySelector('.current-item');

                if (progressFill) progressFill.style.width = Math.min(percent, 100) + '%';
                if (progressText) progressText.textContent = text;
                if (currentItem && itemName) {
                    currentItem.textContent = `当前操作：${itemName}`;
                }
            }

            // 获取总页数
            function getTotalPages() {
                const paginationItems = document.querySelectorAll('.PGT_pagerItem_5-154-0');
                if (paginationItems.length > 0) {
                    const lastPage = parseInt(paginationItems[paginationItems.length - 1].textContent);
                    return isNaN(lastPage) ? 1 : lastPage;
                }
                return 1;
            }

            // 获取当前页数
            function getCurrentPage() {
                const activeItem = document.querySelector('.PGT_pagerItemActive_5-154-0');
                if (activeItem) {
                    const page = parseInt(activeItem.textContent);
                    return isNaN(page) ? 1 : page;
                }
                return 1;
            }

            // 跳转到指定页面
            async function gotoPage(pageNum) {
                const pageItems = document.querySelectorAll('.PGT_pagerItem_5-154-0');
                for (let item of pageItems) {
                    const itemPage = parseInt(item.textContent);
                    if (!isNaN(itemPage) && itemPage === pageNum) {
                        item.click();
                        await waitForPageLoad();
                        return;
                    }
                }
            }

            // 等待页面加载
            async function waitForPageLoad() {
                return new Promise((resolve) => {
                    let checkCount = 0;
                    const maxChecks = 30;

                    const checkLoaded = () => {
                        checkCount++;
                        const loadingIndicator = document.querySelector('.TB_loading_5-154-0');
                        const tableRows = document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]');
                        if ((!loadingIndicator && tableRows.length > 0) || checkCount >= maxChecks) {
                            resolve();
                        } else {
                            setTimeout(checkLoaded, 100);
                        }
                    };
                    checkLoaded();
                });
            }

            // 延迟函数
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            // 初始化
            function init() {
                addBatchEndButton();

                const observer = new MutationObserver(() => {
                    if (!document.querySelector('#endCurrentPageBtn')) {
                        addBatchEndButton();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })();
    }

    // ================================
    // 特定页面脚本 - 新客立减
    // ================================
    function initNewCustomers() {
        (function() {
            'use strict';

            // 创建悬浮窗样式
            const style = document.createElement('style');
            style.textContent = `
        .batch-end-progress {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 400px;
            max-width: 500px;
            cursor: move;
            user-select: none;
        }
        .progress-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1890ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: #1890ff;
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-text {
            margin: 10px 0;
            font-size: 12px;
            color: #666;
        }
        .current-item {
            margin: 10px 0;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 12px;
            max-height: 60px;
            overflow-y: auto;
            border-left: 3px solid #1890ff;
        }
        .progress-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            gap: 10px;
        }
        .progress-controls button {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .progress-controls button:hover {
            background: #f5f5f5;
        }
        .progress-controls button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .progress-controls button.danger {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
        .progress-minimized {
            position: fixed;
            top: 50%;
            right: 20px;
            background: white;
            border: 1px solid #1890ff;
            border-radius: 20px;
            padding: 10px 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10000;
            cursor: pointer;
            font-size: 12px;
            color: #1890ff;
            user-select: none;
        }
        .progress-completed {
            border-color: #52c41a;
        }
        .progress-completed .progress-header {
            color: #52c41a;
        }
        .conditional-filter-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            min-width: 400px;
            max-width: 500px;
            cursor: move;
            user-select: none;
        }
        .filter-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1890ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .filter-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
        }
        .filter-checkbox {
            margin-right: 10px;
        }
        .filter-label {
            min-width: 120px;
            font-size: 14px;
            margin-right: 10px;
        }
        .filter-input {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
        }
        .filter-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 10px;
        }
        .filter-controls button {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .filter-controls button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .filter-controls button.danger {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
        .batch-end-buttons {
            display: flex;
            gap: 10px;
            margin-left: 10px;
        }
        .batch-end-buttons button {
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
            white-space: nowrap;
        }
        .batch-end-buttons button:hover {
            background: #f5f5f5;
        }
        .batch-end-buttons button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
    `;
            document.head.appendChild(style);

            // 全局控制变量
            let isPaused = false;
            let isStopped = false;
            let currentProcess = null;

            // 添加批量结束按钮
            function addBatchEndButtons() {
                const filterRight = document.querySelector('.new_filterRight__1OYT2');
                if (filterRight && !document.querySelector('.batch-end-buttons')) {
                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.className = 'batch-end-buttons';

                    // 结束当前页所有按钮
                    const endCurrentPageBtn = document.createElement('button');
                    endCurrentPageBtn.className = 'primary';
                    endCurrentPageBtn.innerHTML = '结束当前页所有';
                    endCurrentPageBtn.addEventListener('click', endCurrentPageAll);
                    buttonsContainer.appendChild(endCurrentPageBtn);

                    // 结束所有按钮
                    const endAllBtn = document.createElement('button');
                    endAllBtn.className = 'primary';
                    endAllBtn.innerHTML = '结束所有';
                    endAllBtn.addEventListener('click', endAll);
                    buttonsContainer.appendChild(endAllBtn);

                    // 条件筛选结束按钮
                    const conditionalEndBtn = document.createElement('button');
                    conditionalEndBtn.className = 'primary';
                    conditionalEndBtn.innerHTML = '条件筛选结束';
                    conditionalEndBtn.addEventListener('click', showConditionalFilterModal);
                    buttonsContainer.appendChild(conditionalEndBtn);

                    filterRight.appendChild(buttonsContainer);
                }
            }

            // 显示条件筛选模态框
            function showConditionalFilterModal() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                const modal = document.createElement('div');
                modal.className = 'conditional-filter-modal';
                modal.innerHTML = `
            <div class="filter-header">
                <span>条件筛选设置</span>
                <button class="close-btn" style="background:none;border:none;cursor:pointer;font-size:16px;">×</button>
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="productNameCheck">
                <label class="filter-label">商品名称包含</label>
                <input type="text" class="filter-input" id="productNameInput" placeholder="输入商品名称关键字">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="amountLessCheck">
                <label class="filter-label">活动金额小于</label>
                <input type="number" class="filter-input" id="amountLessInput" placeholder="输入金额" step="0.01" min="0">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="amountGreaterCheck">
                <label class="filter-label">活动金额大于</label>
                <input type="number" class="filter-input" id="amountGreaterInput" placeholder="输入金额" step="0.01" min="0">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="amountEqualCheck">
                <label class="filter-label">活动金额等于</label>
                <input type="number" class="filter-input" id="amountEqualInput" placeholder="输入金额" step="0.01" min="0">
            </div>
            <div class="filter-controls">
                <button id="closeFilterBtn" class="danger">关闭窗口</button>
                <button id="startFilterEndBtn" class="primary">启动结束</button>
            </div>
        `;

                // 添加拖拽功能
                makeDraggable(modal);

                // 关闭按钮
                modal.querySelector('.close-btn').addEventListener('click', () => {
                    modal.remove();
                });

                // 关闭窗口按钮
                modal.querySelector('#closeFilterBtn').addEventListener('click', () => {
                    modal.remove();
                });

                // 启动结束按钮
                modal.querySelector('#startFilterEndBtn').addEventListener('click', () => {
                    const conditions = {
                        productName: {
                            enabled: document.getElementById('productNameCheck').checked,
                            value: document.getElementById('productNameInput').value.trim()
                        },
                        amountLess: {
                            enabled: document.getElementById('amountLessCheck').checked,
                            value: parseFloat(document.getElementById('amountLessInput').value) || 0
                        },
                        amountGreater: {
                            enabled: document.getElementById('amountGreaterCheck').checked,
                            value: parseFloat(document.getElementById('amountGreaterInput').value) || 0
                        },
                        amountEqual: {
                            enabled: document.getElementById('amountEqualCheck').checked,
                            value: parseFloat(document.getElementById('amountEqualInput').value) || 0
                        }
                    };

                    // 验证至少选择了一个条件
                    if (!conditions.productName.enabled && !conditions.amountLess.enabled &&
                        !conditions.amountGreater.enabled && !conditions.amountEqual.enabled) {
                        alert('请至少选择一个筛选条件！');
                        return;
                    }

                    // 验证金额条件不冲突
                    if (conditions.amountLess.enabled && conditions.amountGreater.enabled) {
                        if (conditions.amountLess.value <= conditions.amountGreater.value) {
                            alert('活动金额"小于"的值必须大于活动金额"大于"的值！');
                            return;
                        }
                    }

                    if (conditions.amountEqual.enabled) {
                        if (conditions.amountLess.enabled && conditions.amountEqual.value >= conditions.amountLess.value) {
                            alert('活动金额"等于"的值必须小于活动金额"小于"的值！');
                            return;
                        }
                        if (conditions.amountGreater.enabled && conditions.amountEqual.value <= conditions.amountGreater.value) {
                            alert('活动金额"等于"的值必须大于活动金额"大于"的值！');
                            return;
                        }
                    }

                    modal.remove();
                    startConditionalEnd(conditions);
                });

                document.body.appendChild(modal);
            }

            // 开始条件筛选结束 - 添加多轮检查机制
            async function startConditionalEnd(conditions) {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    conditions: conditions
                };

                try {
                    let round = 1;
                    const maxRounds = 2; // 最多检查两遍
                    let hasMatches = false;

                    for (round = 1; round <= maxRounds && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮条件筛选检查...`, 0);

                        const totalPages = getTotalPages();
                        let currentPage = getCurrentPage();

                        // 从第一页开始处理
                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 跳转到目标页面
                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                // 等待页面稳定
                                await delay(1000);
                            }

                            // 处理当前页的条件筛选
                            const pageMatches = await processPageWithConditionFilter(page, totalPages, conditions);
                            if (pageMatches > 0) {
                                hasMatches = true;
                            }

                            updateProgress(
                                currentProcess.modal,
                                `第 ${round} 轮 - 第 ${page}/${totalPages} 页处理完成，发现 ${pageMatches} 个匹配项`,
                                50 + (page / totalPages) * 25
                            );
                        }

                        // 如果第一轮没有发现匹配项，提前结束
                        if (!hasMatches && round === 1) {
                            updateProgress(currentProcess.modal, "未找到任何匹配条件的活动", 100);
                            break;
                        }

                        // 如果这是第一轮且发现了匹配项，继续第二轮
                        if (round === 1 && hasMatches) {
                            updateProgress(currentProcess.modal, "第一轮检查完成，开始第二轮检查防止疏漏", 100);
                            // 回到第一页准备第二轮
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                await delay(1000);
                            }
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `条件筛选结束已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `条件筛选结束完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        const minimized = document.querySelector('.progress-minimized');
                        if (minimized) minimized.remove();
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('条件筛选结束出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 使用条件筛选处理页面
            async function processPageWithConditionFilter(page, totalPages, conditions) {
                let matchCount = 0;
                let hasMoreMatches = true;
                let safetyCounter = 0;
                const maxSafetyCount = 100;

                while (hasMoreMatches && !isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    // 等待暂停状态解除
                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    // 每次循环都重新获取当前页的行列表
                    const rows = getAllRowsFromCurrentPage();
                    let foundMatchInThisCycle = false;

                    for (let i = 0; i < rows.length && !isStopped; i++) {
                        // 等待暂停状态解除
                        while (isPaused && !isStopped) {
                            await delay(500);
                        }
                        if (isStopped) break;

                        const row = rows[i];

                        // 检查是否满足所有启用的条件
                        if (checkRowConditions(row, conditions)) {
                            foundMatchInThisCycle = true;
                            matchCount++;

                            const itemName = getItemNameFromRow(row);
                            const itemId = getItemIdFromRow(row);

                            updateProgress(
                                currentProcess.modal,
                                `第 ${page}/${totalPages} 页 - 处理匹配项 ${matchCount} (ID: ${itemId})`,
                                50 + ((page - 1) / totalPages) * 25 + ((i + 1) / rows.length) * (25 / totalPages),
                                itemName
                            );

                            // 清理所有已存在的弹窗
                            await cleanUpAllModals();

                            const endBtn = row.querySelector('[data-tracking-click-viewid="end_click_btn_new"]');
                            if (endBtn) {
                                // 点击结束按钮
                                endBtn.click();

                                // 等待弹窗出现并处理
                                const handled = await waitForAndHandleModal();
                                if (handled) {
                                    currentProcess.processedCount++;

                                    // 重要：等待操作完成，让页面有时间更新DOM
                                    await delay(1500);

                                    // 再次清理可能残留的弹窗
                                    await cleanUpAllModals();

                                    // 重要：处理完一个活动后，跳出当前循环，重新获取行列表
                                    break;
                                }
                            }

                            // 如果成功处理了一个活动，跳出循环重新获取行列表
                            if (foundMatchInThisCycle) {
                                break;
                            }
                        }
                    }

                    // 如果这一轮没有找到匹配项，说明当前页已经处理完毕
                    if (!foundMatchInThisCycle) {
                        hasMoreMatches = false;
                    }

                    // 短暂等待，让页面有机会稳定
                    await delay(500);
                }

                return matchCount;
            }

            // 检查行是否满足所有条件
            function checkRowConditions(row, conditions) {
                // 商品名称条件检查
                if (conditions.productName.enabled) {
                    const productNameElement = row.querySelector('.TableCommonClips_goodsName__1Oolh');
                    if (productNameElement) {
                        const productName = productNameElement.textContent.trim();
                        if (!productName.includes(conditions.productName.value)) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                // 活动金额条件检查
                if (conditions.amountLess.enabled || conditions.amountGreater.enabled || conditions.amountEqual.enabled) {
                    const amountCell = row.querySelector('td:nth-child(4)');
                    if (amountCell) {
                        // 查找包含金额的span元素（在第四列中查找）
                        const amountSpan = amountCell.querySelector('span span');
                        if (amountSpan) {
                            const amount = parseFloat(amountSpan.textContent);
                            if (isNaN(amount)) {
                                return false;
                            }

                            // 检查金额条件
                            if (conditions.amountLess.enabled && amount >= conditions.amountLess.value) {
                                return false;
                            }
                            if (conditions.amountGreater.enabled && amount <= conditions.amountGreater.value) {
                                return false;
                            }
                            if (conditions.amountEqual.enabled && amount !== conditions.amountEqual.value) {
                                return false;
                            }
                        } else {
                            return false; // 没有找到金额span
                        }
                    } else {
                        return false; // 没有找到金额列
                    }
                }

                return true;
            }

            // 结束当前页所有活动 - 添加多轮检查机制
            async function endCurrentPageAll() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    currentPageIds: []
                };

                try {
                    updateProgress(currentProcess.modal, "正在获取当前页活动信息...", 0);

                    // 获取当前页所有行的ID
                    const currentPageIds = getCurrentPageIds();
                    const totalIds = currentPageIds.length;

                    if (totalIds === 0) {
                        updateProgress(currentProcess.modal, "当前页没有活动", 100);
                        setTimeout(() => {
                            if (progressModal && progressModal.parentNode) {
                                progressModal.remove();
                            }
                            currentProcess = null;
                        }, 2000);
                        return;
                    }

                    currentProcess.currentPageIds = currentPageIds;
                    currentProcess.totalCount = totalIds;

                    updateProgress(currentProcess.modal, `开始处理当前页 ${totalIds} 个活动`, 0);

                    let round = 1;
                    const maxRounds = 2; // 最多检查两遍
                    let hasRemaining = true;

                    for (round = 1; round <= maxRounds && hasRemaining && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮检查...`, 0);
                        hasRemaining = false;

                        let processedIds = [];
                        let safetyCounter = 0;
                        const maxSafetyCount = 100;

                        while (!isStopped && safetyCounter < maxSafetyCount) {
                            safetyCounter++;

                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 每次循环都重新获取当前页的行列表
                            const rows = getAllRowsFromCurrentPage();
                            let foundMatchInThisCycle = false;

                            for (let i = 0; i < rows.length && !isStopped; i++) {
                                // 等待暂停状态解除
                                while (isPaused && !isStopped) {
                                    await delay(500);
                                }
                                if (isStopped) break;

                                const row = rows[i];
                                const rowId = getItemIdFromRow(row);

                                // 检查是否是当前页的ID且尚未处理
                                if (currentPageIds.includes(rowId) && !processedIds.includes(rowId)) {
                                    foundMatchInThisCycle = true;
                                    hasRemaining = true;

                                    updateProgress(
                                        currentProcess.modal,
                                        `第 ${round} 轮 - 正在处理第 ${processedIds.length + 1}/${totalIds} 项 (ID: ${rowId})`,
                                        ((processedIds.length + 1) / totalIds) * 100,
                                        `ID: ${rowId}`
                                    );

                                    // 清理所有已存在的弹窗
                                    await cleanUpAllModals();

                                    const endBtn = row.querySelector('[data-tracking-click-viewid="end_click_btn_new"]');
                                    if (endBtn) {
                                        // 点击结束按钮
                                        endBtn.click();

                                        // 等待弹窗出现并处理
                                        const handled = await waitForAndHandleModal();
                                        if (handled) {
                                            currentProcess.processedCount++;
                                            processedIds.push(rowId);

                                            // 重要：等待操作完成，让页面有时间更新DOM
                                            await delay(1500);

                                            // 再次清理可能残留的弹窗
                                            await cleanUpAllModals();

                                            // 重要：处理完一个活动后，跳出当前循环，重新获取行列表
                                            break;
                                        }
                                    }

                                    // 如果成功处理了一个活动，跳出循环重新获取行列表
                                    if (foundMatchInThisCycle) {
                                        break;
                                    }
                                }
                            }

                            // 如果这一轮没有找到匹配项，说明当前页已经处理完毕
                            if (!foundMatchInThisCycle) {
                                break;
                            }

                            // 短暂等待，让页面有机会稳定
                            await delay(500);
                        }

                        updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，处理了 ${processedIds.length} 个活动`, 100);

                        // 如果这一轮处理了活动，短暂等待后继续下一轮
                        if (hasRemaining && round < maxRounds) {
                            updateProgress(currentProcess.modal, `准备开始第 ${round + 1} 轮检查...`, 100);
                            await delay(1000);
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `结束当前页已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `结束当前页完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('结束当前页所有出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 结束所有活动 - 添加多轮检查机制
            async function endAll() {
                if (currentProcess && !isStopped) {
                    alert('已有批量结束任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0
                };

                try {
                    updateProgress(currentProcess.modal, "开始结束所有活动...", 0);

                    let round = 1;
                    const maxRounds = 2; // 最多检查两遍
                    let hasRemaining = true;

                    for (round = 1; round <= maxRounds && hasRemaining && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮全量检查...`, 0);
                        hasRemaining = false;

                        const totalPages = getTotalPages();
                        let currentPage = getCurrentPage();

                        // 从第一页开始处理
                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 跳转到目标页面
                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                // 等待页面稳定
                                await delay(1000);
                            }

                            // 处理当前页
                            const pageProcessed = await processCurrentPageForEndAll(page, totalPages);
                            if (pageProcessed > 0) {
                                hasRemaining = true;
                            }

                            updateProgress(
                                currentProcess.modal,
                                `第 ${round} 轮 - 第 ${page}/${totalPages} 页处理完成，处理了 ${pageProcessed} 个活动`,
                                50 + (page / totalPages) * 25
                            );
                        }

                        // 如果这一轮处理了活动，回到第一页准备下一轮
                        if (hasRemaining && round < maxRounds) {
                            updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，发现剩余活动，开始下一轮...`, 100);
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                await delay(1000);
                            }
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `结束所有已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `结束所有完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('结束所有出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 处理当前页用于结束所有功能
            async function processCurrentPageForEndAll(page, totalPages) {
                let pageProcessed = 0;
                let safetyCounter = 0;
                const maxSafetyCount = 100;

                while (!isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    // 等待暂停状态解除
                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    // 每次循环都重新获取当前页的行列表
                    const rows = getAllRowsFromCurrentPage();

                    // 如果没有活动行，说明当前页已经处理完成
                    if (rows.length === 0) {
                        break;
                    }

                    let foundActivityInThisCycle = false;

                    // 获取第一个活动行
                    const firstRow = rows[0];
                    const itemName = getItemNameFromRow(firstRow);
                    const itemId = getItemIdFromRow(firstRow);

                    updateProgress(
                        currentProcess.modal,
                        `第 ${page}/${totalPages} 页 - 正在处理第 ${pageProcessed + 1} 项 (ID: ${itemId})`,
                        50 + ((page - 1) / totalPages) * 25 + ((pageProcessed + 1) / Math.max(rows.length, 1)) * (25 / totalPages),
                        itemName
                    );

                    // 清理所有已存在的弹窗
                    await cleanUpAllModals();

                    const endBtn = firstRow.querySelector('[data-tracking-click-viewid="end_click_btn_new"]');
                    if (endBtn) {
                        // 点击结束按钮
                        endBtn.click();

                        // 等待弹窗出现并处理
                        const handled = await waitForAndHandleModal();
                        if (handled) {
                            currentProcess.processedCount++;
                            pageProcessed++;
                            foundActivityInThisCycle = true;

                            // 重要：等待操作完成，让页面有时间更新DOM
                            await delay(1500);

                            // 再次清理可能残留的弹窗
                            await cleanUpAllModals();
                        }
                    } else {
                        // 如果没有找到结束按钮，可能是页面结构变化
                        break;
                    }

                    // 如果这一轮没有处理任何活动，说明当前页已经处理完毕
                    if (!foundActivityInThisCycle) {
                        break;
                    }

                    // 短暂等待，让页面有机会稳定
                    await delay(500);
                }

                return pageProcessed;
            }

            // 等待并处理弹窗 - 优化版
            async function waitForAndHandleModal() {
                return new Promise((resolve) => {
                    let handled = false;
                    let checkCount = 0;
                    const maxChecks = 50;

                    const checkModal = () => {
                        if (handled || checkCount >= maxChecks || isStopped) {
                            resolve(handled);
                            return;
                        }

                        checkCount++;

                        // 先检查是否有设置恢复时间弹窗（直接结束按钮）
                        const timingModals = document.querySelectorAll('[data-tracking-impr-viewid="temp_end_pop_shared"]');
                        let foundStraightEnd = false;

                        timingModals.forEach(modal => {
                            const straightEndBtns = modal.querySelectorAll('[data-tracking-viewid="straight_end_shared"]');
                            straightEndBtns.forEach(btn => {
                                if (btn && !foundStraightEnd) {
                                    btn.click();
                                    handled = true;
                                    foundStraightEnd = true;
                                }
                            });
                        });

                        // 如果有直接结束按钮被点击，继续检查是否还有更多
                        if (foundStraightEnd) {
                            setTimeout(checkModal, 300);
                            return;
                        }

                        // 如果没有直接结束按钮，检查确认结束弹窗
                        if (!handled) {
                            const confirmModals = document.querySelectorAll('.PP_withConfirmPopoverMain_5-169-0');
                            confirmModals.forEach(modal => {
                                const confirmBtn = modal.querySelector('[data-tracking-click-viewid="confirm_end_btn_new"]');
                                if (confirmBtn && !handled) {
                                    confirmBtn.click();
                                    handled = true;
                                }
                            });
                        }

                        if (handled) {
                            // 等待一下确保弹窗处理完成
                            setTimeout(() => {
                                resolve(handled);
                            }, 500);
                        } else {
                            setTimeout(checkModal, 100);
                        }
                    };

                    checkModal();
                });
            }

            // 清理所有已存在的弹窗
            async function cleanUpAllModals() {
                let cleanedCount = 0;
                let maxCleaningCycles = 5;

                for (let cycle = 0; cycle < maxCleaningCycles; cycle++) {
                    let foundModal = false;

                    // 处理设置恢复时间弹窗（优先处理直接结束）
                    const timingModals = document.querySelectorAll('[data-tracking-impr-viewid="temp_end_pop_shared"]');
                    timingModals.forEach(modal => {
                        const straightEndBtns = modal.querySelectorAll('[data-tracking-viewid="straight_end_shared"]');
                        straightEndBtns.forEach(btn => {
                            if (btn) {
                                btn.click();
                                cleanedCount++;
                                foundModal = true;
                            }
                        });
                    });

                    // 处理确认结束弹窗
                    const confirmModals = document.querySelectorAll('.PP_withConfirmPopoverMain_5-169-0');
                    confirmModals.forEach(modal => {
                        const confirmBtn = modal.querySelector('[data-tracking-click-viewid="confirm_end_btn_new"]');
                        if (confirmBtn) {
                            confirmBtn.click();
                            cleanedCount++;
                            foundModal = true;
                        }
                    });

                    // 如果这一轮没有找到弹窗，退出循环
                    if (!foundModal) {
                        break;
                    }

                    // 等待一下让弹窗消失
                    await delay(500);
                }

                return cleanedCount;
            }

            // 获取当前页所有行
            function getAllRowsFromCurrentPage() {
                return Array.from(document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]'));
            }

            // 获取当前页所有活动ID
            function getCurrentPageIds() {
                const rows = getAllRowsFromCurrentPage();
                const ids = [];

                rows.forEach(row => {
                    const id = getItemIdFromRow(row);
                    if (id && id !== '未知ID') {
                        ids.push(id);
                    }
                });

                return ids;
            }

            // 从行中获取商品ID
            function getItemIdFromRow(row) {
                const idElement = row.querySelector('.TableCommonClips_goodsInfo__3iFCC div:first-child');
                if (idElement && idElement.textContent.includes('ID:')) {
                    const idText = idElement.textContent.trim();
                    const idMatch = idText.match(/ID:\s*(\d+)/);
                    return idMatch ? idMatch[1] : '未知ID';
                }
                return '未知ID';
            }

            // 从行中获取商品名称
            function getItemNameFromRow(row) {
                const nameElement = row.querySelector('.TableCommonClips_goodsName__1Oolh');
                if (nameElement && nameElement.textContent.trim()) {
                    const text = nameElement.textContent.trim();
                    return text.length > 50 ? text.substring(0, 50) + '...' : text;
                }

                const idElement = row.querySelector('.TableCommonClips_goodsInfo__3iFCC div:first-child');
                if (idElement && idElement.textContent.includes('ID:')) {
                    return idElement.textContent.trim();
                }

                return '未知商品';
            }

            // 创建进度悬浮窗
            function createProgressModal() {
                const modal = document.createElement('div');
                modal.className = 'batch-end-progress';
                modal.innerHTML = `
            <div class="progress-header">
                <span>批量结束进度</span>
                <div>
                    <button class="minimize-btn" style="background:none;border:none;cursor:pointer;font-size:16px;margin-right:5px;">−</button>
                    <button class="close-btn" style="background:none;border:none;cursor:pointer;font-size:16px;">×</button>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">准备开始...</div>
            <div class="current-item">当前操作：无</div>
            <div class="progress-controls">
                <button id="pauseResumeBtn" class="primary">暂停</button>
                <button id="stopBtn" class="danger">停止</button>
            </div>
        `;

                // 添加拖拽功能
                makeDraggable(modal);

                // 最小化按钮
                modal.querySelector('.minimize-btn').addEventListener('click', () => {
                    const minimized = createMinimizedView();
                    document.body.appendChild(minimized);
                    modal.style.display = 'none';
                });

                // 关闭按钮
                modal.querySelector('.close-btn').addEventListener('click', () => {
                    isStopped = true;
                    modal.remove();
                    const minimized = document.querySelector('.progress-minimized');
                    if (minimized) minimized.remove();
                    currentProcess = null;
                });

                // 暂停/继续按钮
                const pauseResumeBtn = modal.querySelector('#pauseResumeBtn');
                pauseResumeBtn.addEventListener('click', () => {
                    if (isPaused) {
                        isPaused = false;
                        pauseResumeBtn.textContent = '暂停';
                        pauseResumeBtn.className = 'primary';
                    } else {
                        isPaused = true;
                        pauseResumeBtn.textContent = '继续';
                        pauseResumeBtn.className = '';
                    }
                });

                // 停止按钮
                modal.querySelector('#stopBtn').addEventListener('click', () => {
                    isStopped = true;
                    modal.querySelector('.progress-text').textContent = '正在停止...';
                });

                return modal;
            }

            // 使元素可拖拽
            function makeDraggable(element) {
                const header = element.querySelector('.progress-header') || element.querySelector('.filter-header');
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

                header.onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    element.style.top = (element.offsetTop - pos2) + "px";
                    element.style.left = (element.offsetLeft - pos1) + "px";
                    element.style.transform = 'none';
                }

                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }

            // 创建最小化视图
            function createMinimizedView() {
                const minimized = document.createElement('div');
                minimized.className = 'progress-minimized';
                minimized.innerHTML = '批量结束进行中...';

                makeDraggable(minimized);

                minimized.addEventListener('click', () => {
                    const modal = document.querySelector('.batch-end-progress');
                    if (modal) {
                        modal.style.display = 'block';
                    }
                    minimized.remove();
                });

                minimized.addEventListener('dblclick', () => {
                    isStopped = true;
                    minimized.remove();
                    const modal = document.querySelector('.batch-end-progress');
                    if (modal) modal.remove();
                    currentProcess = null;
                });

                return minimized;
            }

            // 更新进度显示
            function updateProgress(modal, text, percent, itemName = '') {
                const progressFill = modal.querySelector('.progress-fill');
                const progressText = modal.querySelector('.progress-text');
                const currentItem = modal.querySelector('.current-item');

                if (progressFill) progressFill.style.width = Math.min(percent, 100) + '%';
                if (progressText) progressText.textContent = text;
                if (currentItem && itemName) {
                    currentItem.textContent = `当前操作：${itemName}`;
                }
            }

            // 获取总页数
            function getTotalPages() {
                const paginationItems = document.querySelectorAll('.PGT_pagerItem_5-169-0');
                if (paginationItems.length > 0) {
                    const lastPage = parseInt(paginationItems[paginationItems.length - 1].textContent);
                    return isNaN(lastPage) ? 1 : lastPage;
                }
                return 1;
            }

            // 获取当前页数
            function getCurrentPage() {
                const activeItem = document.querySelector('.PGT_pagerItemActive_5-169-0');
                if (activeItem) {
                    const page = parseInt(activeItem.textContent);
                    return isNaN(page) ? 1 : page;
                }
                return 1;
            }

            // 跳转到指定页面
            async function gotoPage(pageNum) {
                const pageItems = document.querySelectorAll('.PGT_pagerItem_5-169-0');
                for (let item of pageItems) {
                    const itemPage = parseInt(item.textContent);
                    if (!isNaN(itemPage) && itemPage === pageNum) {
                        item.click();
                        await waitForPageLoad();
                        return;
                    }
                }
            }

            // 等待页面加载
            async function waitForPageLoad() {
                return new Promise((resolve) => {
                    let checkCount = 0;
                    const maxChecks = 30;

                    const checkLoaded = () => {
                        checkCount++;
                        const loadingIndicator = document.querySelector('.TB_loading_5-169-0');
                        const tableRows = document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]');
                        if ((!loadingIndicator && tableRows.length > 0) || checkCount >= maxChecks) {
                            resolve();
                        } else {
                            setTimeout(checkLoaded, 100);
                        }
                    };
                    checkLoaded();
                });
            }

            // 延迟函数
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            // 初始化
            function init() {
                addBatchEndButtons();

                const observer = new MutationObserver(() => {
                    if (!document.querySelector('.batch-end-buttons')) {
                        addBatchEndButtons();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })();
    }

    // ================================
    // 特定页面脚本 - 活动取消
    // ================================
    function initDiscount() {
        (function() {
            'use strict';

            // 创建悬浮窗样式
            const style = document.createElement('style');
            style.textContent = `
        .batch-cancel-progress {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 400px;
            max-width: 500px;
            cursor: move;
            user-select: none;
        }
        .progress-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1890ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: #1890ff;
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-text {
            margin: 10px 0;
            font-size: 12px;
            color: #666;
        }
        .current-item {
            margin: 10px 0;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 12px;
            max-height: 60px;
            overflow-y: auto;
            border-left: 3px solid #1890ff;
        }
        .progress-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            gap: 10px;
        }
        .progress-controls button {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .progress-controls button:hover {
            background: #f5f5f5;
        }
        .progress-controls button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .progress-controls button.danger {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
        .progress-minimized {
            position: fixed;
            top: 50%;
            right: 20px;
            background: white;
            border: 1px solid #1890ff;
            border-radius: 20px;
            padding: 10px 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10000;
            cursor: pointer;
            font-size: 12px;
            color: #1890ff;
            user-select: none;
        }
        .progress-completed {
            border-color: #52c41a;
        }
        .progress-completed .progress-header {
            color: #52c41a;
        }
        .conditional-filter-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            min-width: 400px;
            max-width: 500px;
            cursor: move;
            user-select: none;
        }
        .filter-header {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1890ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .filter-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
        }
        .filter-checkbox {
            margin-right: 10px;
        }
        .filter-label {
            min-width: 120px;
            font-size: 14px;
            margin-right: 10px;
        }
        .filter-input {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
        }
        .filter-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 10px;
        }
        .filter-controls button {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 12px;
        }
        .filter-controls button.primary {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .filter-controls button.danger {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
        .condition-explanation {
            margin: 10px 0;
            padding: 10px;
            background: #f0f8ff;
            border-radius: 4px;
            font-size: 12px;
            color: #1890ff;
            border-left: 3px solid #1890ff;
        }
    `;
            document.head.appendChild(style);

            // 全局控制变量
            let isPaused = false;
            let isStopped = false;
            let currentProcess = null;

            // 动态获取翻页元素类名
            function getPaginationClassNames() {
                // 查找包含"PGT_pagerItem"的类名
                const paginationContainer = document.querySelector('[data-testid="beast-core-pagination"]');
                if (!paginationContainer) return null;

                // 获取所有可能的类名
                const classNames = {
                    pagerItem: null,
                    pagerItemActive: null,
                    next: null,
                    prev: null,
                    loading: null
                };

                // 查找页码项
                const pageItem = paginationContainer.querySelector('li[class*="PGT_pagerItem"]');
                if (pageItem) {
                    const classes = pageItem.className.split(' ');
                    classNames.pagerItem = classes.find(cls => cls.includes('PGT_pagerItem') && !cls.includes('Active'));
                    classNames.pagerItemActive = classes.find(cls => cls.includes('PGT_pagerItemActive')) ||
                        classes.find(cls => cls.includes('PGT_pagerItem') && pageItem.textContent && !isNaN(pageItem.textContent));
                }

                // 查找下一页按钮
                const nextBtn = paginationContainer.querySelector('[data-testid="beast-core-pagination-next"]');
                if (nextBtn) {
                    const classes = nextBtn.className.split(' ');
                    classNames.next = classes.find(cls => cls.includes('PGT_next'));
                }

                // 查找上一页按钮
                const prevBtn = paginationContainer.querySelector('[data-testid="beast-core-pagination-prev"]');
                if (prevBtn) {
                    const classes = prevBtn.className.split(' ');
                    classNames.prev = classes.find(cls => cls.includes('PGT_prev'));
                }

                // 查找加载指示器
                const loadingIndicator = document.querySelector('[class*="TB_loading"]');
                if (loadingIndicator) {
                    const classes = loadingIndicator.className.split(' ');
                    classNames.loading = classes.find(cls => cls.includes('TB_loading'));
                }

                return classNames;
            }

            // 获取翻页元素类名（带缓存）
            let cachedClassNames = null;
            function getCachedPaginationClassNames() {
                if (!cachedClassNames) {
                    cachedClassNames = getPaginationClassNames();
                }
                return cachedClassNames || {
                    pagerItem: 'PGT_pagerItem_5-141-0',
                    pagerItemActive: 'PGT_pagerItemActive_5-141-0',
                    next: 'PGT_next_5-141-0',
                    prev: 'PGT_prev_5-141-0',
                    loading: 'TB_loading_5-141-0'
                };
            }

            // 添加批量取消按钮
            function addBatchCancelButtons() {
                const batchCancelBtn = document.querySelector('[data-tracking-viewid="batch_cancel_button"]');
                if (batchCancelBtn && !document.querySelector('#cancelCurrentPageBtn')) {
                    const buttonContainer = batchCancelBtn.parentNode;

                    // 取消当前页所有按钮
                    const cancelCurrentPageBtn = batchCancelBtn.cloneNode(true);
                    cancelCurrentPageBtn.id = 'cancelCurrentPageBtn';
                    cancelCurrentPageBtn.innerHTML = '<span>取消当前页所有</span>';
                    cancelCurrentPageBtn.style.marginLeft = '10px';
                    cancelCurrentPageBtn.addEventListener('click', cancelCurrentPageAll);
                    buttonContainer.appendChild(cancelCurrentPageBtn);

                    // 取消所有按钮
                    const cancelAllBtn = batchCancelBtn.cloneNode(true);
                    cancelAllBtn.id = 'cancelAllBtn';
                    cancelAllBtn.innerHTML = '<span>取消所有</span>';
                    cancelAllBtn.style.marginLeft = '10px';
                    cancelAllBtn.addEventListener('click', cancelAll);
                    buttonContainer.appendChild(cancelAllBtn);

                    // 价格筛选取消按钮
                    const priceFilterCancelBtn = batchCancelBtn.cloneNode(true);
                    priceFilterCancelBtn.id = 'priceFilterCancelBtn';
                    priceFilterCancelBtn.innerHTML = '<span>价格筛选取消</span>';
                    priceFilterCancelBtn.style.marginLeft = '10px';
                    priceFilterCancelBtn.addEventListener('click', showPriceFilterModal);
                    buttonContainer.appendChild(priceFilterCancelBtn);
                }
            }

            // 显示价格筛选模态框
            function showPriceFilterModal() {
                if (currentProcess && !isStopped) {
                    alert('已有批量取消任务在进行中');
                    return;
                }

                const modal = document.createElement('div');
                modal.className = 'conditional-filter-modal';
                modal.innerHTML = `
            <div class="filter-header">
                <span>价格筛选设置</span>
                <button class="close-btn" style="background:none;border:none;cursor:pointer;font-size:16px;">×</button>
            </div>
            <div class="condition-explanation">
                <strong>条件说明：</strong><br>
                • 只选中一个条件：满足该条件即触发<br>
                • 两个条件都选中：必须同时满足两个条件才触发
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="minPriceCheck">
                <label class="filter-label">活动最低价低于</label>
                <input type="number" class="filter-input" id="minPriceInput" placeholder="输入最低价阈值" step="0.01">
            </div>
            <div class="filter-row">
                <input type="checkbox" class="filter-checkbox" id="maxPriceCheck">
                <label class="filter-label">活动最高价低于</label>
                <input type="number" class="filter-input" id="maxPriceInput" placeholder="输入最高价阈值" step="0.01">
            </div>
            <div class="filter-controls">
                <button id="closeFilterBtn" class="danger">关闭窗口</button>
                <button id="startFilterCancelBtn" class="primary">启动取消</button>
            </div>
        `;

                // 添加拖拽功能
                makeDraggable(modal);

                // 关闭按钮
                modal.querySelector('.close-btn').addEventListener('click', () => {
                    modal.remove();
                });

                // 关闭窗口按钮
                modal.querySelector('#closeFilterBtn').addEventListener('click', () => {
                    modal.remove();
                });

                // 启动取消按钮
                modal.querySelector('#startFilterCancelBtn').addEventListener('click', () => {
                    const conditions = {
                        minPrice: {
                            enabled: document.getElementById('minPriceCheck').checked,
                            value: parseFloat(document.getElementById('minPriceInput').value) || 0
                        },
                        maxPrice: {
                            enabled: document.getElementById('maxPriceCheck').checked,
                            value: parseFloat(document.getElementById('maxPriceInput').value) || 0
                        }
                    };

                    // 验证至少选择了一个条件
                    if (!conditions.minPrice.enabled && !conditions.maxPrice.enabled) {
                        alert('请至少选择一个价格筛选条件！');
                        return;
                    }

                    // 验证输入了有效的价格
                    if ((conditions.minPrice.enabled && !document.getElementById('minPriceInput').value) ||
                        (conditions.maxPrice.enabled && !document.getElementById('maxPriceInput').value)) {
                        alert('请输入有效的价格数值！');
                        return;
                    }

                    modal.remove();
                    startPriceFilterCancel(conditions);
                });

                document.body.appendChild(modal);
            }

            // 开始价格筛选取消
            async function startPriceFilterCancel(conditions) {
                if (currentProcess && !isStopped) {
                    alert('已有批量取消任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                // 显示当前筛选条件
                const conditionText = getConditionText(conditions);
                updateProgress(progressModal, `开始价格筛选取消 - ${conditionText}`, 0);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    conditions: conditions,
                    processedIds: new Set()
                };

                try {
                    let round = 1;
                    const maxRounds = 2;
                    let hasMatches = false;

                    for (round = 1; round <= maxRounds && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮价格筛选检查...`, 0);

                        const totalPages = getTotalPages();
                        let currentPage = getCurrentPage();

                        // 从第一页开始处理
                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 跳转到目标页面
                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                // 等待页面稳定
                                await delay(1000);
                            }

                            // 处理当前页的价格筛选
                            const pageMatches = await processPageWithPriceFilter(page, totalPages, conditions);
                            if (pageMatches > 0) {
                                hasMatches = true;
                            }

                            updateProgress(
                                currentProcess.modal,
                                `第 ${round} 轮 - 第 ${page}/${totalPages} 页处理完成，发现 ${pageMatches} 个匹配项`,
                                50 + (page / totalPages) * 25
                            );
                        }

                        // 如果第一轮没有发现匹配项，提前结束
                        if (!hasMatches && round === 1) {
                            updateProgress(currentProcess.modal, "未找到任何匹配价格条件的活动", 100);
                            break;
                        }

                        // 如果这是第一轮且发现了匹配项，继续第二轮
                        if (round === 1 && hasMatches) {
                            updateProgress(currentProcess.modal, "第一轮检查完成，开始第二轮检查防止疏漏", 100);
                            // 回到第一页准备第二轮
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                await delay(1000);
                            }
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `价格筛选取消已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `价格筛选取消完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        const minimized = document.querySelector('.progress-minimized');
                        if (minimized) minimized.remove();
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('价格筛选取消出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 获取条件文本描述
            function getConditionText(conditions) {
                const parts = [];

                if (conditions.minPrice.enabled) {
                    parts.push(`最低价 < ${conditions.minPrice.value}`);
                }

                if (conditions.maxPrice.enabled) {
                    parts.push(`最高价 < ${conditions.maxPrice.value}`);
                }

                if (parts.length === 2) {
                    return `条件：${parts[0]} 且 ${parts[1]}`;
                } else {
                    return `条件：${parts[0] || parts[1]}`;
                }
            }

            // 使用价格筛选处理页面
            async function processPageWithPriceFilter(page, totalPages, conditions) {
                let matchCount = 0;
                let safetyCounter = 0;
                const maxSafetyCount = 50;

                while (!isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    // 等待暂停状态解除
                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    // 每次循环都重新获取当前页的行列表
                    const rows = getAllRowsFromCurrentPage();
                    let foundMatchInThisCycle = false;

                    for (let i = 0; i < rows.length && !isStopped; i++) {
                        // 等待暂停状态解除
                        while (isPaused && !isStopped) {
                            await delay(500);
                        }
                        if (isStopped) break;

                        const row = rows[i];
                        const rowId = getItemIdFromRow(row);

                        // 检查是否已经处理过这个ID
                        if (currentProcess.processedIds.has(rowId)) {
                            continue;
                        }

                        // 检查是否满足价格条件
                        if (checkRowPriceConditions(row, conditions)) {
                            const itemName = getItemNameFromRow(row);

                            updateProgress(
                                currentProcess.modal,
                                `第 ${page}/${totalPages} 页 - 处理匹配项 ${matchCount + 1} (ID: ${rowId})`,
                                50 + ((page - 1) / totalPages) * 25 + ((i + 1) / rows.length) * (25 / totalPages),
                                itemName
                            );

                            // 清理所有已存在的弹窗
                            await cleanUpAllModals();

                            const cancelBtn = row.querySelector('[data-tracking-click-viewid="bigpopup_reconsider_shared"]');
                            if (cancelBtn) {
                                foundMatchInThisCycle = true;
                                matchCount++;

                                // 点击取消活动按钮
                                cancelBtn.click();

                                // 等待弹窗出现并处理
                                const handled = await waitForAndHandleCancelModal();
                                if (handled) {
                                    currentProcess.processedCount++;
                                    currentProcess.processedIds.add(rowId);

                                    // 重要：等待操作完成，让页面有时间更新DOM
                                    await delay(2000);

                                    // 再次清理可能残留的弹窗
                                    await cleanUpAllModals();

                                    // 关键修复：成功处理后立即跳出当前循环，重新获取行列表
                                    break;
                                } else {
                                    // 如果处理失败，也记录这个ID，避免重复尝试
                                    currentProcess.processedIds.add(rowId);
                                }
                            } else {
                                // 如果没有取消按钮，记录这个ID
                                currentProcess.processedIds.add(rowId);
                            }
                        }

                        // 如果成功处理了一个活动，跳出循环重新获取行列表
                        if (foundMatchInThisCycle) {
                            break;
                        }
                    }

                    // 如果这一轮没有找到匹配项，说明当前页已经处理完毕
                    if (!foundMatchInThisCycle) {
                        break;
                    }

                    // 短暂等待，让页面有机会稳定
                    await delay(1000);
                }

                return matchCount;
            }

            // 检查行是否满足价格条件 - 修复版
            function checkRowPriceConditions(row, conditions) {
                // 价格条件检查 - 活动价在第5列
                if (conditions.minPrice.enabled || conditions.maxPrice.enabled) {
                    // 查找活动信息(元)列（第5列）中的价格信息
                    const priceCell = row.querySelector('td:nth-child(5)');
                    if (priceCell) {
                        // 查找包含活动价的div元素
                        const activityPriceDiv = priceCell.querySelector('.activity-time-wrapper div:first-child');
                        if (activityPriceDiv) {
                            const priceText = activityPriceDiv.textContent.trim();
                            console.log('价格文本:', priceText);

                            // 使用新的价格解析逻辑
                            const priceData = parsePriceFromText(priceText);

                            if (!priceData) {
                                console.log('价格解析失败');
                                return false;
                            }

                            console.log(`解析价格: 最低价=${priceData.minPrice}, 最高价=${priceData.maxPrice}`);

                            // 根据启用的条件进行检查
                            let minConditionMet = true;
                            let maxConditionMet = true;

                            // 检查最低价条件
                            if (conditions.minPrice.enabled) {
                                minConditionMet = priceData.minPrice < conditions.minPrice.value;
                                console.log(`最低价条件: ${priceData.minPrice} < ${conditions.minPrice.value} = ${minConditionMet}`);
                            }

                            // 检查最高价条件
                            if (conditions.maxPrice.enabled) {
                                // 如果没有最高价（单一价格），则最高价条件不满足
                                if (priceData.maxPrice === null) {
                                    maxConditionMet = false;
                                } else {
                                    maxConditionMet = priceData.maxPrice < conditions.maxPrice.value;
                                }
                                console.log(`最高价条件: ${priceData.maxPrice} < ${conditions.maxPrice.value} = ${maxConditionMet}`);
                            }

                            // 确定最终结果
                            let finalResult = true;

                            if (conditions.minPrice.enabled && conditions.maxPrice.enabled) {
                                // 两个条件都启用：必须同时满足
                                finalResult = minConditionMet && maxConditionMet;
                                console.log(`两个条件都启用，最终结果: ${finalResult}`);
                            } else if (conditions.minPrice.enabled) {
                                // 只启用最低价条件
                                finalResult = minConditionMet;
                                console.log(`只启用最低价条件，最终结果: ${finalResult}`);
                            } else if (conditions.maxPrice.enabled) {
                                // 只启用最高价条件
                                finalResult = maxConditionMet;
                                console.log(`只启用最高价条件，最终结果: ${finalResult}`);
                            }

                            console.log('价格条件检查最终结果:', finalResult);
                            return finalResult;
                        } else {
                            console.log('没有找到价格div');
                            return false;
                        }
                    } else {
                        console.log('没有找到价格列');
                        return false;
                    }
                }

                return false; // 如果没有启用任何价格条件，返回false
            }

            // 新的价格解析函数 - 修复版
            function parsePriceFromText(text) {
                // 正则表达式匹配带两位小数的数字
                const pricePattern = /(\d+\.\d{2})(?:～(\d+\.\d{2}))?/;
                const match = text.match(pricePattern);

                if (!match) {
                    console.log('未找到符合格式的价格');
                    return null;
                }

                const minPrice = parseFloat(match[1]);
                let maxPrice = null;

                // 如果有第二个价格（通过～分隔）
                if (match[2]) {
                    maxPrice = parseFloat(match[2]);
                }

                // 验证价格有效性
                if (isNaN(minPrice)) {
                    console.log('最低价解析失败');
                    return null;
                }

                // 如果有最高价但解析失败
                if (maxPrice !== null && isNaN(maxPrice)) {
                    maxPrice = null;
                }

                return {
                    minPrice: minPrice,
                    maxPrice: maxPrice
                };
            }

            // 取消当前页所有活动
            async function cancelCurrentPageAll() {
                if (currentProcess && !isStopped) {
                    alert('已有批量取消任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    currentPageIds: [],
                    processedIds: new Set()
                };

                try {
                    updateProgress(currentProcess.modal, "正在获取当前页活动信息...", 0);

                    // 获取当前页所有行的ID
                    const currentPageIds = getCurrentPageIds();
                    const totalIds = currentPageIds.length;

                    if (totalIds === 0) {
                        updateProgress(currentProcess.modal, "当前页没有活动", 100);
                        setTimeout(() => {
                            if (progressModal && progressModal.parentNode) {
                                progressModal.remove();
                            }
                            currentProcess = null;
                        }, 2000);
                        return;
                    }

                    currentProcess.currentPageIds = currentPageIds;
                    currentProcess.totalCount = totalIds;

                    updateProgress(currentProcess.modal, `开始处理当前页 ${totalIds} 个活动`, 0);

                    let round = 1;
                    const maxRounds = 2;
                    let hasRemaining = true;

                    for (round = 1; round <= maxRounds && hasRemaining && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮检查...`, 0);
                        hasRemaining = false;

                        let safetyCounter = 0;
                        const maxSafetyCount = 50;

                        while (!isStopped && safetyCounter < maxSafetyCount) {
                            safetyCounter++;

                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 每次循环都重新获取当前页的行列表
                            const rows = getAllRowsFromCurrentPage();
                            let foundMatchInThisCycle = false;

                            for (let i = 0; i < rows.length && !isStopped; i++) {
                                // 等待暂停状态解除
                                while (isPaused && !isStopped) {
                                    await delay(500);
                                }
                                if (isStopped) break;

                                const row = rows[i];
                                const rowId = getItemIdFromRow(row);

                                // 检查是否是当前页的ID且尚未处理
                                if (currentPageIds.includes(rowId) && !currentProcess.processedIds.has(rowId)) {
                                    foundMatchInThisCycle = true;
                                    hasRemaining = true;

                                    updateProgress(
                                        currentProcess.modal,
                                        `第 ${round} 轮 - 正在处理第 ${currentProcess.processedCount + 1}/${totalIds} 项 (ID: ${rowId})`,
                                        ((currentProcess.processedCount + 1) / totalIds) * 100,
                                        `ID: ${rowId}`
                                    );

                                    // 清理所有已存在的弹窗
                                    await cleanUpAllModals();

                                    const cancelBtn = row.querySelector('[data-tracking-click-viewid="bigpopup_reconsider_shared"]');
                                    if (cancelBtn) {
                                        // 点击取消活动按钮
                                        cancelBtn.click();

                                        // 等待弹窗出现并处理
                                        const handled = await waitForAndHandleCancelModal();
                                        if (handled) {
                                            currentProcess.processedCount++;
                                            currentProcess.processedIds.add(rowId);

                                            // 重要：等待操作完成，让页面有时间更新DOM
                                            await delay(2000);

                                            // 再次清理可能残留的弹窗
                                            await cleanUpAllModals();

                                            // 重要：处理完一个活动后，跳出当前循环，重新获取行列表
                                            break;
                                        } else {
                                            // 如果处理失败，也记录这个ID
                                            currentProcess.processedIds.add(rowId);
                                        }
                                    } else {
                                        // 如果没有取消按钮，记录这个ID
                                        currentProcess.processedIds.add(rowId);
                                    }

                                    // 如果成功处理了一个活动，跳出循环重新获取行列表
                                    if (foundMatchInThisCycle) {
                                        break;
                                    }
                                }
                            }

                            // 如果这一轮没有找到匹配项，说明当前页已经处理完毕
                            if (!foundMatchInThisCycle) {
                                break;
                            }

                            // 短暂等待，让页面有机会稳定
                            await delay(1000);
                        }

                        updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，处理了 ${currentProcess.processedCount} 个活动`, 100);

                        // 如果这一轮处理了活动，短暂等待后继续下一轮
                        if (hasRemaining && round < maxRounds) {
                            updateProgress(currentProcess.modal, `准备开始第 ${round + 1} 轮检查...`, 100);
                            await delay(1000);
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `取消当前页已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `取消当前页完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('取消当前页所有出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 取消所有活动
            async function cancelAll() {
                if (currentProcess && !isStopped) {
                    alert('已有批量取消任务在进行中');
                    return;
                }

                // 重置控制状态
                isPaused = false;
                isStopped = false;

                // 创建进度悬浮窗
                const progressModal = createProgressModal();
                document.body.appendChild(progressModal);

                currentProcess = {
                    modal: progressModal,
                    processedCount: 0,
                    totalCount: 0,
                    processedIds: new Set()
                };

                try {
                    updateProgress(currentProcess.modal, "开始取消所有活动...", 0);

                    let round = 1;
                    const maxRounds = 2;
                    let hasRemaining = true;

                    for (round = 1; round <= maxRounds && hasRemaining && !isStopped; round++) {
                        updateProgress(currentProcess.modal, `开始第 ${round} 轮全量检查...`, 0);
                        hasRemaining = false;

                        const totalPages = getTotalPages();
                        let currentPage = getCurrentPage();

                        // 从第一页开始处理
                        for (let page = 1; page <= totalPages && !isStopped; page++) {
                            // 等待暂停状态解除
                            while (isPaused && !isStopped) {
                                await delay(500);
                            }
                            if (isStopped) break;

                            // 跳转到目标页面
                            if (page !== currentPage) {
                                updateProgress(currentProcess.modal, `正在跳转到第 ${page} 页...`, ((page - 1) / totalPages) * 50);
                                await gotoPage(page);
                                currentPage = page;
                                // 等待页面稳定
                                await delay(1000);
                            }

                            // 处理当前页
                            const pageProcessed = await processCurrentPageForCancelAll(page, totalPages);
                            if (pageProcessed > 0) {
                                hasRemaining = true;
                            }

                            updateProgress(
                                currentProcess.modal,
                                `第 ${round} 轮 - 第 ${page}/${totalPages} 页处理完成，处理了 ${pageProcessed} 个活动`,
                                50 + (page / totalPages) * 25
                            );
                        }

                        // 如果这一轮处理了活动，回到第一页准备下一轮
                        if (hasRemaining && round < maxRounds) {
                            updateProgress(currentProcess.modal, `第 ${round} 轮检查完成，发现剩余活动，开始下一轮...`, 100);
                            if (1 !== currentPage) {
                                await gotoPage(1);
                                await delay(1000);
                            }
                        }
                    }

                    // 完成处理
                    if (isStopped) {
                        updateProgress(currentProcess.modal, `取消所有已停止！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                    } else {
                        updateProgress(currentProcess.modal, `取消所有完成！共处理了 ${currentProcess.processedCount} 个活动`, 100);
                        currentProcess.modal.classList.add('progress-completed');
                    }

                    // 自动关闭
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 3000);

                } catch (error) {
                    updateProgress(currentProcess.modal, `处理过程中出现错误: ${error.message}`, 100);
                    console.error('取消所有出错:', error);
                    setTimeout(() => {
                        if (progressModal && progressModal.parentNode) {
                            progressModal.remove();
                        }
                        currentProcess = null;
                    }, 5000);
                }
            }

            // 处理当前页用于取消所有功能
            async function processCurrentPageForCancelAll(page, totalPages) {
                let pageProcessed = 0;
                let safetyCounter = 0;
                const maxSafetyCount = 50;

                while (!isStopped && safetyCounter < maxSafetyCount) {
                    safetyCounter++;

                    // 等待暂停状态解除
                    while (isPaused && !isStopped) {
                        await delay(500);
                    }
                    if (isStopped) break;

                    // 每次循环都重新获取当前页的行列表
                    const rows = getAllRowsFromCurrentPage();

                    // 如果没有活动行，说明当前页已经处理完成
                    if (rows.length === 0) {
                        break;
                    }

                    let foundActivityInThisCycle = false;

                    // 获取第一个活动行
                    const firstRow = rows[0];
                    const itemName = getItemNameFromRow(firstRow);
                    const itemId = getItemIdFromRow(firstRow);

                    // 检查是否已经处理过这个ID
                    if (currentProcess.processedIds.has(itemId)) {
                        break;
                    }

                    updateProgress(
                        currentProcess.modal,
                        `第 ${page}/${totalPages} 页 - 正在处理第 ${pageProcessed + 1} 项 (ID: ${itemId})`,
                        50 + ((page - 1) / totalPages) * 25 + ((pageProcessed + 1) / Math.max(rows.length, 1)) * (25 / totalPages),
                        itemName
                    );

                    // 清理所有已存在的弹窗
                    await cleanUpAllModals();

                    const cancelBtn = firstRow.querySelector('[data-tracking-click-viewid="bigpopup_reconsider_shared"]');
                    if (cancelBtn) {
                        // 点击取消活动按钮
                        cancelBtn.click();

                        // 等待弹窗出现并处理
                        const handled = await waitForAndHandleCancelModal();
                        if (handled) {
                            currentProcess.processedCount++;
                            pageProcessed++;
                            foundActivityInThisCycle = true;
                            currentProcess.processedIds.add(itemId);

                            // 重要：等待操作完成，让页面有时间更新DOM
                            await delay(2000);

                            // 再次清理可能残留的弹窗
                            await cleanUpAllModals();
                        } else {
                            // 如果处理失败，也记录这个ID
                            currentProcess.processedIds.add(itemId);
                        }
                    } else {
                        // 如果没有找到取消按钮，记录这个ID并跳出循环
                        currentProcess.processedIds.add(itemId);
                        break;
                    }

                    // 如果这一轮没有处理任何活动，说明当前页已经处理完毕
                    if (!foundActivityInThisCycle) {
                        break;
                    }

                    // 短暂等待，让页面有机会稳定
                    await delay(1000);
                }

                return pageProcessed;
            }

            // 等待并处理取消活动弹窗
            async function waitForAndHandleCancelModal() {
                return new Promise((resolve) => {
                    let handled = false;
                    let checkCount = 0;
                    const maxChecks = 50;

                    const checkModal = () => {
                        if (handled || checkCount >= maxChecks || isStopped) {
                            resolve(handled);
                            return;
                        }

                        checkCount++;

                        // 第一种弹窗：仍要取消活动（链接形式）
                        const cancelConfirmLink = document.querySelector('[data-tracking-click-viewid="quite_as_well_shared"]');
                        if (cancelConfirmLink) {
                            cancelConfirmLink.click();
                            handled = true;
                        }

                        // 第二种弹窗：放弃活动（按钮形式）
                        if (!handled) {
                            const cancelConfirmBtn = document.querySelector('[data-tracking-click-viewid="cancel_activity_true_shared"]');
                            if (cancelConfirmBtn) {
                                cancelConfirmBtn.click();
                                handled = true;
                            }
                        }

                        if (handled) {
                            // 等待一下确保弹窗处理完成
                            setTimeout(() => {
                                resolve(handled);
                            }, 500);
                        } else {
                            setTimeout(checkModal, 100);
                        }
                    };

                    checkModal();
                });
            }

            // 清理所有已存在的弹窗
            async function cleanUpAllModals() {
                let cleanedCount = 0;
                let maxCleaningCycles = 5;

                for (let cycle = 0; cycle < maxCleaningCycles; cycle++) {
                    let foundModal = false;

                    // 处理第一种弹窗：仍要取消活动（链接形式）
                    const cancelConfirmLinks = document.querySelectorAll('[data-tracking-click-viewid="quite_as_well_shared"]');
                    cancelConfirmLinks.forEach(link => {
                        if (link) {
                            link.click();
                            cleanedCount++;
                            foundModal = true;
                        }
                    });

                    // 处理第二种弹窗：放弃活动（按钮形式）
                    const cancelConfirmBtns = document.querySelectorAll('[data-tracking-click-viewid="cancel_activity_true_shared"]');
                    cancelConfirmBtns.forEach(btn => {
                        if (btn) {
                            btn.click();
                            cleanedCount++;
                            foundModal = true;
                        }
                    });

                    // 如果这一轮没有找到弹窗，退出循环
                    if (!foundModal) {
                        break;
                    }

                    // 等待一下让弹窗消失
                    await delay(500);
                }

                return cleanedCount;
            }

            // 获取当前页所有行
            function getAllRowsFromCurrentPage() {
                return Array.from(document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]'));
            }

            // 获取当前页所有活动ID
            function getCurrentPageIds() {
                const rows = getAllRowsFromCurrentPage();
                const ids = [];

                rows.forEach(row => {
                    const id = getItemIdFromRow(row);
                    if (id && id !== '未知ID') {
                        ids.push(id);
                    }
                });

                return ids;
            }

            // 从行中获取商品ID
            function getItemIdFromRow(row) {
                const idElement = row.querySelector('.goods-info-wrapper span:last-child');
                if (idElement && idElement.textContent.includes('ID:')) {
                    const idText = idElement.textContent.trim();
                    const idMatch = idText.match(/ID:\s*(\d+)/);
                    return idMatch ? idMatch[1] : '未知ID';
                }
                return '未知ID';
            }

            // 从行中获取商品名称
            function getItemNameFromRow(row) {
                const nameElement = row.querySelector('.goods-name');
                if (nameElement && nameElement.textContent.trim()) {
                    const text = nameElement.textContent.trim();
                    return text.length > 50 ? text.substring(0, 50) + '...' : text;
                }

                const idElement = row.querySelector('.goods-info-wrapper span:last-child');
                if (idElement && idElement.textContent.includes('ID:')) {
                    return idElement.textContent.trim();
                }

                return '未知商品';
            }

            // 创建进度悬浮窗
            function createProgressModal() {
                const modal = document.createElement('div');
                modal.className = 'batch-cancel-progress';
                modal.innerHTML = `
            <div class="progress-header">
                <span>批量取消进度</span>
                <div>
                    <button class="minimize-btn" style="background:none;border:none;cursor:pointer;font-size:16px;margin-right:5px;">−</button>
                    <button class="close-btn" style="background:none;border:none;cursor:pointer;font-size:16px;">×</button>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">准备开始...</div>
            <div class="current-item">当前操作：无</div>
            <div class="progress-controls">
                <button id="pauseResumeBtn" class="primary">暂停</button>
                <button id="stopBtn" class="danger">停止</button>
            </div>
        `;

                // 添加拖拽功能
                makeDraggable(modal);

                // 最小化按钮
                modal.querySelector('.minimize-btn').addEventListener('click', () => {
                    const minimized = createMinimizedView();
                    document.body.appendChild(minimized);
                    modal.style.display = 'none';
                });

                // 关闭按钮
                modal.querySelector('.close-btn').addEventListener('click', () => {
                    isStopped = true;
                    modal.remove();
                    const minimized = document.querySelector('.progress-minimized');
                    if (minimized) minimized.remove();
                    currentProcess = null;
                });

                // 暂停/继续按钮
                const pauseResumeBtn = modal.querySelector('#pauseResumeBtn');
                pauseResumeBtn.addEventListener('click', () => {
                    if (isPaused) {
                        isPaused = false;
                        pauseResumeBtn.textContent = '暂停';
                        pauseResumeBtn.className = 'primary';
                    } else {
                        isPaused = true;
                        pauseResumeBtn.textContent = '继续';
                        pauseResumeBtn.className = '';
                    }
                });

                // 停止按钮
                modal.querySelector('#stopBtn').addEventListener('click', () => {
                    isStopped = true;
                    modal.querySelector('.progress-text').textContent = '正在停止...';
                });

                return modal;
            }

            // 使元素可拖拽
            function makeDraggable(element) {
                const header = element.querySelector('.progress-header') || element.querySelector('.filter-header');
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

                header.onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    element.style.top = (element.offsetTop - pos2) + "px";
                    element.style.left = (element.offsetLeft - pos1) + "px";
                    element.style.transform = 'none';
                }

                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }

            // 创建最小化视图
            function createMinimizedView() {
                const minimized = document.createElement('div');
                minimized.className = 'progress-minimized';
                minimized.innerHTML = '批量取消进行中...';

                makeDraggable(minimized);

                minimized.addEventListener('click', () => {
                    const modal = document.querySelector('.batch-cancel-progress');
                    if (modal) {
                        modal.style.display = 'block';
                    }
                    minimized.remove();
                });

                minimized.addEventListener('dblclick', () => {
                    isStopped = true;
                    minimized.remove();
                    const modal = document.querySelector('.batch-cancel-progress');
                    if (modal) modal.remove();
                    currentProcess = null;
                });

                return minimized;
            }

            // 更新进度显示
            function updateProgress(modal, text, percent, itemName = '') {
                const progressFill = modal.querySelector('.progress-fill');
                const progressText = modal.querySelector('.progress-text');
                const currentItem = modal.querySelector('.current-item');

                if (progressFill) progressFill.style.width = Math.min(percent, 100) + '%';
                if (progressText) progressText.textContent = text;
                if (currentItem && itemName) {
                    currentItem.textContent = `当前操作：${itemName}`;
                }
            }

            // 获取总页数 - 修复版，使用动态类名
            function getTotalPages() {
                const classNames = getCachedPaginationClassNames();
                const paginationItems = document.querySelectorAll(`.${classNames.pagerItem}`);
                if (paginationItems.length > 0) {
                    // 找到所有数字页码，取最大值
                    let maxPage = 1;
                    paginationItems.forEach(item => {
                        const pageNum = parseInt(item.textContent);
                        if (!isNaN(pageNum) && pageNum > maxPage) {
                            maxPage = pageNum;
                        }
                    });
                    return maxPage;
                }
                return 1;
            }

            // 获取当前页数 - 修复版，使用动态类名
            function getCurrentPage() {
                const classNames = getCachedPaginationClassNames();

                // 方法1: 查找活动页
                const activeItem = document.querySelector(`.${classNames.pagerItemActive}`);
                if (activeItem) {
                    const page = parseInt(activeItem.textContent);
                    if (!isNaN(page)) return page;
                }

                // 方法2: 如果没有活动页类名，查找第一个数字页码
                const firstPageItem = document.querySelector(`.${classNames.pagerItem}`);
                if (firstPageItem) {
                    const page = parseInt(firstPageItem.textContent);
                    if (!isNaN(page)) return page;
                }

                return 1;
            }

            // 跳转到指定页面 - 修复版，使用动态类名
            async function gotoPage(pageNum) {
                const classNames = getCachedPaginationClassNames();
                const pageItems = document.querySelectorAll(`.${classNames.pagerItem}`);

                for (let item of pageItems) {
                    const itemPage = parseInt(item.textContent);
                    if (!isNaN(itemPage) && itemPage === pageNum) {
                        item.click();
                        await waitForPageLoad();
                        return;
                    }
                }

                // 如果找不到指定页码，尝试使用下一页按钮逐步翻页
                console.log(`未找到第 ${pageNum} 页，尝试逐步翻页`);
                await gotoPageStepByStep(pageNum);
            }

            // 逐步翻页到指定页面
            async function gotoPageStepByStep(targetPage) {
                const currentPage = getCurrentPage();

                if (targetPage === currentPage) return;

                const classNames = getCachedPaginationClassNames();
                const nextBtn = document.querySelector(`.${classNames.next}:not(.${classNames.next.replace('_5-141-0', '_disabled_5-141-0')})`);
                const prevBtn = document.querySelector(`.${classNames.prev}:not(.${classNames.prev.replace('_5-141-0', '_disabled_5-141-0')})`);

                if (targetPage > currentPage && nextBtn) {
                    // 向前翻页
                    for (let page = currentPage + 1; page <= targetPage; page++) {
                        nextBtn.click();
                        await waitForPageLoad();
                        await delay(500);

                        // 检查是否到达目标页
                        if (getCurrentPage() === targetPage) break;
                    }
                } else if (targetPage < currentPage && prevBtn) {
                    // 向后翻页
                    for (let page = currentPage - 1; page >= targetPage; page--) {
                        prevBtn.click();
                        await waitForPageLoad();
                        await delay(500);

                        // 检查是否到达目标页
                        if (getCurrentPage() === targetPage) break;
                    }
                }
            }

            // 等待页面加载 - 修复版，使用动态类名
            async function waitForPageLoad() {
                return new Promise((resolve) => {
                    let checkCount = 0;
                    const maxChecks = 50;

                    const checkLoaded = () => {
                        checkCount++;
                        const classNames = getCachedPaginationClassNames();
                        const loadingIndicator = document.querySelector(`.${classNames.loading}`);
                        const tableRows = document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]');

                        if ((!loadingIndicator && tableRows.length > 0) || checkCount >= maxChecks) {
                            resolve();
                        } else {
                            setTimeout(checkLoaded, 200);
                        }
                    };
                    checkLoaded();
                });
            }

            // 延迟函数
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            // 初始化
            function init() {
                addBatchCancelButtons();

                const observer = new MutationObserver(() => {
                    if (!document.querySelector('#cancelCurrentPageBtn')) {
                        addBatchCancelButtons();
                    }
                    // 当页面结构变化时，清除缓存的类名
                    if (document.querySelector('[data-testid="beast-core-pagination"]')) {
                        cachedClassNames = null;
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })();
    }

    // ================================
    // 特定页面脚本 - 批量价格库存修改
    // ================================
    function initgoodslist() {
        (function() {
            'use strict';

            // 创建样式
            const style = document.createElement('style');
            style.textContent = `
        .fuzzy-filter-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 300px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .fuzzy-filter-header {
            background: #f5f5f5;
            padding: 12px 16px;
            border-bottom: 1px solid #ddd;
            cursor: move;
            font-weight: 500;
            user-select: none;
        }

        .fuzzy-filter-body {
            padding: 16px;
        }

        .fuzzy-filter-row {
            margin-bottom: 12px;
        }

        .fuzzy-filter-label {
            display: block;
            margin-bottom: 4px;
            font-size: 14px;
            color: #333;
        }

        .fuzzy-filter-input {
            width: 100%;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 3px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .fuzzy-filter-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 16px;
        }

        .fuzzy-filter-btn {
            padding: 6px 12px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: white;
            cursor: pointer;
            font-size: 14px;
        }

        .fuzzy-filter-btn.primary {
            background: #2656bd;
            color: white;
            border-color: #2656bd;
        }

        .fuzzy-filter-btn:hover {
            opacity: 0.8;
        }

        .custom-filter-btn {
            margin-left: 8px !important;
        }

        .fuzzy-filter-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }
    `;
            document.head.appendChild(style);

            // 使用WeakMap来跟踪每个弹窗的按钮添加状态
            let modalButtonMap = new WeakMap();

            // 监听弹窗出现
            function observeModal() {
                const observer = new MutationObserver(function(mutations) {
                    for (let mutation of mutations) {
                        if (mutation.type === 'childList') {
                            for (let node of mutation.addedNodes) {
                                if (node.nodeType === 1) {
                                    // 检查是否是批量修改库存或价格弹窗
                                    const modal = findModal(node);
                                    if (modal) {
                                        console.log('检测到批量修改弹窗，准备添加按钮');
                                        // 延迟执行以确保弹窗完全加载
                                        setTimeout(() => {
                                            if (!modalButtonMap.has(modal)) {
                                                addFilterButton(modal);
                                            }
                                        }, 500);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // 同时也检查当前是否已经有弹窗
                setTimeout(() => {
                    const existingModal = findModal(document.body);
                    if (existingModal && !modalButtonMap.has(existingModal)) {
                        console.log('发现已存在的弹窗，添加按钮');
                        setTimeout(() => addFilterButton(existingModal), 500);
                    }
                }, 1000);
            }

            // 查找批量修改库存或价格弹窗
            function findModal(root) {
                // 方法1: 通过data-testid查找
                let modal = root.querySelector('[data-testid="beast-core-modal"]');
                if (modal) return modal;

                // 方法2: 通过标题查找
                const headers = root.querySelectorAll('.MDL_header_5-161-0');
                for (let header of headers) {
                    if (header.textContent.includes('批量修改库存') || header.textContent.includes('批量修改价格')) {
                        return header.closest('[data-testid="beast-core-modal"]') || header.closest('.MDL_outerWrapper_5-161-0');
                    }
                }

                // 方法3: 通过批量设置容器查找
                const batchContainer = root.querySelector('.detail_modal_batchSetContainer__1SIau');
                if (batchContainer) {
                    return batchContainer.closest('[data-testid="beast-core-modal"]') || batchContainer.closest('.MDL_outerWrapper_5-161-0');
                }

                return null;
            }

            // 判断弹窗类型
            function getModalType(modal) {
                const header = modal.querySelector('.MDL_header_5-161-0');
                if (header) {
                    if (header.textContent.includes('批量修改库存')) {
                        return 'stock';
                    } else if (header.textContent.includes('批量修改价格')) {
                        return 'price';
                    }
                }
                return 'unknown';
            }

            // 添加筛选按钮到批量设置容器
            function addFilterButton(modal) {
                const batchSetContainer = modal.querySelector('.detail_modal_batchSetContainer__1SIau');
                if (!batchSetContainer) {
                    console.log('未找到批量设置容器');
                    return;
                }

                // 检查是否已经添加过按钮
                if (batchSetContainer.querySelector('.custom-filter-btn')) {
                    modalButtonMap.set(modal, true);
                    return;
                }

                const modalType = getModalType(modal);
                const buttonText = modalType === 'stock' ? '模糊筛选规格修改库存' : '模糊筛选规格修改价格';

                const filterBtn = document.createElement('button');
                filterBtn.className = 'BTN_outerWrapper_5-161-0 BTN_secondary_5-161-0 BTN_medium_5-161-0 BTN_outerWrapperBtn_5-161-0 custom-filter-btn';
                filterBtn.innerHTML = `<span>${buttonText}</span>`;
                filterBtn.style.marginLeft = '8px';
                // 重要：设置按钮类型为button，防止触发表单提交
                filterBtn.type = 'button';

                filterBtn.addEventListener('click', function(e) {
                    // 阻止事件冒泡，防止触发表单提交
                    e.stopPropagation();
                    e.preventDefault();
                    showFilterModal(modal, modalType);
                });

                batchSetContainer.appendChild(filterBtn);
                modalButtonMap.set(modal, true);
                console.log(`${buttonText}按钮添加成功`);
            }

            // 显示筛选弹窗
            function showFilterModal(parentModal, modalType) {
                // 移除已存在的弹窗
                const existingModal = document.querySelector('.fuzzy-filter-modal');
                const existingOverlay = document.querySelector('.fuzzy-filter-overlay');
                if (existingModal) existingModal.remove();
                if (existingOverlay) existingOverlay.remove();

                // 创建遮罩层
                const overlay = document.createElement('div');
                overlay.className = 'fuzzy-filter-overlay';
                document.body.appendChild(overlay);

                const modalTitle = modalType === 'stock' ? '模糊筛选规格修改库存' : '模糊筛选规格修改价格';

                let modalHTML = `
            <div class="fuzzy-filter-header">${modalTitle}</div>
            <div class="fuzzy-filter-body">
                <div class="fuzzy-filter-row">
                    <label class="fuzzy-filter-label">规格信息包含（空格分隔多个关键词，需同时满足）：</label>
                    <input type="text" class="fuzzy-filter-input" id="spec-filter-input" placeholder="输入规格关键词，如：某某商品 某某规格">
                </div>
        `;

                if (modalType === 'stock') {
                    modalHTML += `
                <div class="fuzzy-filter-row">
                    <label class="fuzzy-filter-label">库存数量修改为：</label>
                    <input type="number" class="fuzzy-filter-input" id="stock-value-input" placeholder="输入库存数量">
                </div>
            `;
                } else {
                    modalHTML += `
                <div class="fuzzy-filter-row">
                    <label class="fuzzy-filter-label">改后拼单价：</label>
                    <input type="number" class="fuzzy-filter-input" id="group-price-input" placeholder="输入拼单价">
                </div>
                <div class="fuzzy-filter-row">
                    <label class="fuzzy-filter-label">改后单买价：</label>
                    <input type="number" class="fuzzy-filter-input" id="normal-price-input" placeholder="输入单买价">
                </div>
            `;
                }

                modalHTML += `
                <div class="fuzzy-filter-actions">
                    <button type="button" class="fuzzy-filter-btn" id="cancel-btn">取消</button>
                    <button type="button" class="fuzzy-filter-btn primary" id="apply-btn">填入</button>
                </div>
            </div>
        `;

                const modal = document.createElement('div');
                modal.className = 'fuzzy-filter-modal';
                modal.innerHTML = modalHTML;

                document.body.appendChild(modal);

                // 添加拖拽功能
                makeDraggable(modal);

                // 绑定事件
                document.getElementById('cancel-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    modal.remove();
                    overlay.remove();
                });

                document.getElementById('apply-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (modalType === 'stock') {
                        applyStockFilter(parentModal, modal, overlay);
                    } else {
                        applyPriceFilter(parentModal, modal, overlay);
                    }
                });

                // 点击遮罩层关闭
                overlay.addEventListener('click', function(e) {
                    e.stopPropagation();
                    modal.remove();
                    overlay.remove();
                });

                // 按Enter键触发填入
                modal.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.stopPropagation();
                        if (modalType === 'stock') {
                            applyStockFilter(parentModal, modal, overlay);
                        } else {
                            applyPriceFilter(parentModal, modal, overlay);
                        }
                    }
                });

                // 聚焦到输入框
                document.getElementById('spec-filter-input').focus();
            }

            // 实现弹窗拖拽功能
            function makeDraggable(element) {
                const header = element.querySelector('.fuzzy-filter-header');
                let isDragging = false;
                let currentX;
                let currentY;
                let initialX;
                let initialY;
                let xOffset = 0;
                let yOffset = 0;

                header.addEventListener('mousedown', dragStart);
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', dragEnd);

                function dragStart(e) {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;

                    if (e.target === header) {
                        isDragging = true;
                    }
                }

                function drag(e) {
                    if (isDragging) {
                        e.preventDefault();
                        currentX = e.clientX - initialX;
                        currentY = e.clientY - initialY;

                        xOffset = currentX;
                        yOffset = currentY;

                        setTranslate(currentX, currentY, element);
                    }
                }

                function setTranslate(xPos, yPos, el) {
                    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
                }

                function dragEnd(e) {
                    initialX = currentX;
                    initialY = currentY;
                    isDragging = false;
                }
            }

            // 检查规格文本是否包含所有关键词
            function matchAllKeywords(text, keywords) {
                if (!text || !keywords || keywords.length === 0) return false;

                // 将文本转换为小写以便不区分大小写匹配
                const lowerText = text.toLowerCase();

                // 检查是否包含所有关键词
                return keywords.every(keyword => lowerText.includes(keyword.toLowerCase()));
            }

            // 应用筛选并修改库存
            function applyStockFilter(parentModal, filterModal, overlay) {
                const specFilter = document.getElementById('spec-filter-input').value.trim();
                const stockValue = document.getElementById('stock-value-input').value.trim();

                if (!specFilter) {
                    alert('请输入规格信息关键词');
                    return;
                }

                if (!stockValue) {
                    alert('请输入库存数量');
                    return;
                }

                // 将输入的关键词按空格分割
                const keywords = specFilter.split(/\s+/).filter(keyword => keyword.length > 0);

                if (keywords.length === 0) {
                    alert('请输入有效的规格信息关键词');
                    return;
                }

                // 展开所有规格
                expandAllSpecs(parentModal);

                // 延迟执行以确保规格已展开
                setTimeout(() => {
                    const tableBody = parentModal.querySelector('tbody[data-testid="beast-core-table-middle-tbody"]');
                    if (!tableBody) {
                        alert('未找到规格表格');
                        return;
                    }

                    const rows = tableBody.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]');
                    let modifiedCount = 0;

                    console.log(`开始搜索包含所有关键词 "${keywords.join(', ')}" 的规格...`);

                    rows.forEach(row => {
                        // 获取所有规格信息单元格
                        const specCells = row.querySelectorAll('td[data-testid="beast-core-table-td"]');

                        // 查找包含所有关键词的规格文本单元格
                        let foundSpecCell = null;
                        for (let cell of specCells) {
                            const cellText = cell.textContent || cell.innerText;
                            if (matchAllKeywords(cellText, keywords)) {
                                foundSpecCell = cell;
                                break;
                            }
                        }

                        if (foundSpecCell) {
                            console.log(`找到匹配的规格: ${foundSpecCell.textContent}`);

                            // 找到该行对应的库存输入框
                            const stockInputs = row.querySelectorAll('input[data-testid="beast-core-inputNumber-htmlInput"]');

                            if (stockInputs.length > 0) {
                                // 通常每行只有一个库存输入框，取第一个
                                const input = stockInputs[0];
                                input.value = stockValue;
                                // 触发输入事件以确保数据更新
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                modifiedCount++;
                                console.log(`成功修改库存为: ${stockValue}`);
                            } else {
                                console.log('未找到该行的库存输入框');
                            }
                        }
                    });

                    filterModal.remove();
                    overlay.remove();

                    if (modifiedCount > 0) {
                        alert(`成功修改 ${modifiedCount} 个规格的库存为 ${stockValue}`);
                    } else {
                        alert(`未找到同时包含"${keywords.join(', ')}"的规格信息`);
                    }
                }, 1000);
            }

            // 应用筛选并修改价格
            function applyPriceFilter(parentModal, filterModal, overlay) {
                const specFilter = document.getElementById('spec-filter-input').value.trim();
                const groupPrice = document.getElementById('group-price-input').value.trim();
                const normalPrice = document.getElementById('normal-price-input').value.trim();

                if (!specFilter) {
                    alert('请输入规格信息关键词');
                    return;
                }

                if (!groupPrice && !normalPrice) {
                    alert('请输入至少一个价格（拼单价或单买价）');
                    return;
                }

                // 将输入的关键词按空格分割
                const keywords = specFilter.split(/\s+/).filter(keyword => keyword.length > 0);

                if (keywords.length === 0) {
                    alert('请输入有效的规格信息关键词');
                    return;
                }

                // 展开所有规格
                expandAllSpecs(parentModal);

                // 延迟执行以确保规格已展开
                setTimeout(() => {
                    const tableBody = parentModal.querySelector('tbody[data-testid="beast-core-table-middle-tbody"]');
                    if (!tableBody) {
                        alert('未找到规格表格');
                        return;
                    }

                    const rows = tableBody.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]');
                    let modifiedCount = 0;

                    console.log(`开始搜索包含所有关键词 "${keywords.join(', ')}" 的规格...`);

                    rows.forEach(row => {
                        // 获取所有规格信息单元格
                        const specCells = row.querySelectorAll('td[data-testid="beast-core-table-td"]');

                        // 查找包含所有关键词的规格文本单元格
                        let foundSpecCell = null;
                        for (let cell of specCells) {
                            const cellText = cell.textContent || cell.innerText;
                            if (matchAllKeywords(cellText, keywords)) {
                                foundSpecCell = cell;
                                break;
                            }
                        }

                        if (foundSpecCell) {
                            console.log(`找到匹配的规格: ${foundSpecCell.textContent}`);

                            // 找到该行对应的所有输入框
                            const inputs = row.querySelectorAll('input[data-testid="beast-core-inputNumber-htmlInput"]');

                            if (inputs.length >= 2) {
                                // 价格弹窗中，第4列是拼单价，第5列是单买价
                                // inputs[0] 是拼单价输入框，inputs[1] 是单买价输入框
                                if (groupPrice) {
                                    inputs[0].value = groupPrice;
                                    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
                                    inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
                                    console.log(`成功修改拼单价为: ${groupPrice}`);
                                }

                                if (normalPrice) {
                                    inputs[1].value = normalPrice;
                                    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
                                    inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
                                    console.log(`成功修改单买价为: ${normalPrice}`);
                                }

                                modifiedCount++;
                            } else {
                                console.log('未找到该行的价格输入框');
                            }
                        }
                    });

                    filterModal.remove();
                    overlay.remove();

                    if (modifiedCount > 0) {
                        let message = `成功修改 ${modifiedCount} 个规格的`;
                        if (groupPrice) message += ` 拼单价为 ${groupPrice}`;
                        if (normalPrice) {
                            if (groupPrice) message += '，';
                            message += ` 单买价为 ${normalPrice}`;
                        }
                        alert(message);
                    } else {
                        alert(`未找到同时包含"${keywords.join(', ')}"的规格信息`);
                    }
                }, 1000);
            }

            // 展开所有规格
            function expandAllSpecs(modal) {
                const expandButtons = modal.querySelectorAll('a.BTN_outerWrapperLink_5-161-0');
                let clicked = false;

                expandButtons.forEach(button => {
                    const buttonText = button.textContent || button.innerText;
                    if (buttonText.includes('展开更多规格')) {
                        button.click();
                        clicked = true;
                        console.log('点击展开规格按钮');
                    }
                });

                if (!clicked) {
                    console.log('未找到需要展开的规格按钮，或所有规格已展开');
                }
            }

            // 初始化脚本
            function init() {
                console.log('拼多多模糊筛选脚本初始化');
                observeModal();
            }

            // 页面加载完成后初始化
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }

            // 监听URL变化（单页应用）
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    // 重置所有状态
                    modalButtonMap = new WeakMap();
                    setTimeout(observeModal, 1000);
                }
            }).observe(document, { subtree: true, childList: true });
        })();
    }

    // ================================
    // 初始化入口
    // ================================
    function init() {
        console.log('🚀 开始初始化脚本路由器...');

        // 初始执行脚本
        setTimeout(() => {
            executeScripts();

            // 设置监听器
            setupDOMObserver();
            setupSPAListener();
        }, 100);

        // 暴露重新检查函数给全局
        window.recheckScripts = function() {
            console.log('🔄 手动触发重新检查...');
            if (shouldRefreshPage()) {
                window.location.reload();
            } else {
                unloadAllScripts();
                executeScripts();
            }
        };

        // 暴露状态查询函数
        window.getScriptStatus = function() {
            return {
                currentDomain,
                currentPath,
                loadedScripts: Array.from(currentScripts),
                wasPreviouslyMatched,
                currentMatched: hasAnyMatchingScript(),
                allScripts: scriptRouter.specific.map(s => ({
                    name: s.name,
                    loaded: s.loaded,
                    shouldLoad: shouldLoadScript(s)
                }))
            };
        };

        console.log('✅ 脚本路由器初始化完成');
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();