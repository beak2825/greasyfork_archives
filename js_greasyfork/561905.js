// ==UserScript==
// @name         飞书文档-目录层级编号（清理脏数据版）
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  为飞书文档目录添加层级编号，每次执行先清理目录容器内的旧编号（脏数据），支持菜单/目录触发
// @author       onionycs
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561905/%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3-%E7%9B%AE%E5%BD%95%E5%B1%82%E7%BA%A7%E7%BC%96%E5%8F%B7%EF%BC%88%E6%B8%85%E7%90%86%E8%84%8F%E6%95%B0%E6%8D%AE%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561905/%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3-%E7%9B%AE%E5%BD%95%E5%B1%82%E7%BA%A7%E7%BC%96%E5%8F%B7%EF%BC%88%E6%B8%85%E7%90%86%E8%84%8F%E6%95%B0%E6%8D%AE%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================== 核心配置 ======================
    const CONFIG = {
        serialNumberClass: 'auto-generated-serial-number', // 专属编号class
        selectors: {
            catalogueList: '.catalogue__list',             // 目录容器
            catalogueItem: 'li.catalogue__list-item',      // 目录项
            catalogueText: '.text',                        // 目录文本容器
            placeholderClass: 'fixed-size-list-placeholder'// 占位项过滤
        },
        styles: {
            serialNumber: `
                .auto-generated-serial-number {
                    color: blue !important;
                    margin-right: 4px;
                    font-weight: normal;
                }
            `
        }
    };

    // ====================== 工具函数 ======================
    const Utils = {
        // 注入样式
        injectStyles: function(css) {
            const styleEl = document.createElement('style');
            styleEl.textContent = css;
            document.head.appendChild(styleEl);
            console.error('[Utils] 编号样式已注入');
        },

        // 等待元素加载（兜底）
        waitForElement: function(selector, timeout = 5000) {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    const el = document.querySelector(selector);
                    if (el) {
                        clearInterval(interval);
                        resolve(el);
                    }
                    timeout -= 500;
                    if (timeout <= 0) {
                        clearInterval(interval);
                        resolve(null);
                    }
                }, 500);
            });
        }
    };

    // ====================== 核心逻辑 ======================
    const CatalogueSerialNumber = {
        // 清理目录容器内的旧编号（缩小清理范围）
        clearOldNumbers: function() {
            console.error(`\n🧹 开始清理目录容器内的历史编号`);
            const catalogueLists = document.querySelectorAll(CONFIG.selectors.catalogueList);
            let totalRemoved = 0;

            catalogueLists.forEach((list, index) => {
                const oldSpans = list.querySelectorAll(`.${CONFIG.serialNumberClass}`);
                oldSpans.forEach(span => span.remove());
                totalRemoved += oldSpans.length;
                console.error(`🗑️ 第 ${index+1} 个目录容器：删除 ${oldSpans.length} 个旧编号`);
            });

            console.error(`✅ 清理完成，共删除 ${totalRemoved} 个历史编号`);
            return totalRemoved;
        },

        // 生成目录层级编号
        generateNumbers: function() {
            console.error(`\n========== 开始生成目录层级编号 ==========`);
            // 第一步：先清理旧编号
            this.clearOldNumbers();

            // 第二步：注入样式
            Utils.injectStyles(CONFIG.styles.serialNumber);

            // 第三步：获取所有目录容器
            const catalogueLists = document.querySelectorAll(CONFIG.selectors.catalogueList);
            console.error(`📌 找到 ${catalogueLists.length} 个目录容器`);

            if (catalogueLists.length === 0) {
                console.error(`⚠️ 未找到任何目录容器，终止执行`);
                return false;
            }

            // 层级计数器
            const levelCounters = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
            let prevLevel = 0;

            // 遍历每个目录容器
            catalogueLists.forEach((list, listIndex) => {
                console.error(`\n🔍 处理第 ${listIndex+1} 个目录容器`);

                // 过滤有效目录项（排除占位项）
                const catalogueItems = Array.from(list.querySelectorAll(CONFIG.selectors.catalogueItem))
                    .filter(item => !item.classList.contains(CONFIG.selectors.placeholderClass));

                if (catalogueItems.length === 0) {
                    console.error(`⚠️ 第 ${listIndex+1} 个容器无有效目录项，跳过`);
                    return;
                }
                console.error(`📌 找到 ${catalogueItems.length} 个有效目录项`);

                // 遍历目录项生成编号
                catalogueItems.forEach((item, itemIdx) => {
                    console.error(`\n📝 处理第 ${itemIdx+1} 个目录项：${item.className}`);

                    // 提取heading层级
                    const classNames = item.className.split(' ');
                    const headingClass = classNames.find(cls => cls.startsWith('heading-'));
                    if (!headingClass) {
                        console.error(`⚠️ 无heading-*类名，跳过`);
                        return;
                    }

                    // 解析层级
                    const currentLevel = parseInt(headingClass.replace('heading-', ''));
                    if (isNaN(currentLevel)) {
                        console.error(`⚠️ 无效层级：${headingClass}，跳过`);
                        return;
                    }
                    console.error(`🔍 解析层级：${currentLevel}`);

                    // 重置子层级计数器
                    if (prevLevel > currentLevel) {
                        for (let i = currentLevel + 1; i <= 6; i++) {
                            levelCounters[i] = 0;
                        }
                    }

                    // 递增当前层级计数器
                    levelCounters[currentLevel]++;
                    prevLevel = currentLevel;

                    // 生成编号（兼容heading-0）
                    let numberStr = '';
                    const startLevel = currentLevel === 0 ? 1 : 1;
                    const targetLevel = currentLevel === 0 ? 1 : currentLevel;

                    for (let i = startLevel; i <= targetLevel; i++) {
                        numberStr += levelCounters[i] + (i === targetLevel ? '. ' : '.');
                    }
                    console.error(`🔢 生成编号：${numberStr}`);

                    // 获取文本容器（兜底逻辑）
                    let textSpan = item.querySelector(CONFIG.selectors.catalogueText);
                    if (!textSpan) {
                        textSpan = Array.from(item.querySelectorAll('span, div'))
                            .find(el => el.textContent.trim().length > 0);
                    }

                    if (!textSpan) {
                        console.error(`⚠️ 未找到文本容器，跳过`);
                        return;
                    }

                    // 创建编号元素
                    const numberSpan = document.createElement('span');
                    numberSpan.className = CONFIG.serialNumberClass;
                    numberSpan.style.color = 'blue';
                    numberSpan.textContent = numberStr;

                    // 插入编号到文本最前
                    textSpan.insertBefore(numberSpan, textSpan.firstChild);
                    console.error(`✅ 成功添加编号：${textSpan.textContent.trim()}`);
                });
            });

            console.error(`\n🎉 目录编号生成完成！`);
            return true;
        },

        // 绑定目录项触发事件（点击目录项时自动更新编号）
        bindTriggerEvent: function() {
            console.error(`\n🔗 绑定目录项触发事件`);
            // 委托事件：监听所有目录项的点击
            document.addEventListener('click', (e) => {
                const catalogueItem = e.target.closest(CONFIG.selectors.catalogueItem);
                if (catalogueItem) {
                    console.error(`\n🔥 检测到目录项点击，自动更新编号`);
                    this.generateNumbers();
                }
            });
            console.error(`✅ 目录项点击触发事件绑定完成`);
        }
    };

    // ====================== 脚本入口 ======================
    const init = async function() {
        console.error(`\n🚀 飞书文档目录编号脚本初始化`);
        // 等待目录容器加载
        await Utils.waitForElement(CONFIG.selectors.catalogueList);
        // 绑定目录项触发事件
        CatalogueSerialNumber.bindTriggerEvent();
        console.error(`✅ 脚本初始化完成`);
    };

    // 注册油猴菜单（手动触发）
    GM_registerMenuCommand('📌 生成/更新目录层级编号', () => {
        CatalogueSerialNumber.generateNumbers();
        alert('✅ 目录编号已更新！\n（可查看控制台日志 F12 了解详情）');
    });

    // 页面加载完成后初始化
    window.addEventListener('load', init);

})();