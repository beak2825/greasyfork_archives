// ==UserScript==
// @name         简道云描述文本换行修复 (JianDaoYun Newline Fix)
// @namespace    https://ysslang.com:60443/
// @version      1.0
// @description  自动将简道云仪表盘中指定描述组件内的 "\\n" 替换为真实的换行符，并设置正确的CSS样式以显示换行。
// @author       Gemini
// @match        https://www.jiandaoyun.com/*
// @grant        none
// @icon         https://www.jiandaoyun.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549927/%E7%AE%80%E9%81%93%E4%BA%91%E6%8F%8F%E8%BF%B0%E6%96%87%E6%9C%AC%E6%8D%A2%E8%A1%8C%E4%BF%AE%E5%A4%8D%20%28JianDaoYun%20Newline%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549927/%E7%AE%80%E9%81%93%E4%BA%91%E6%8F%8F%E8%BF%B0%E6%96%87%E6%9C%AC%E6%8D%A2%E8%A1%8C%E4%BF%AE%E5%A4%8D%20%28JianDaoYun%20Newline%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    // 在这里添加您需要监控的 widget ID
    const WIDGET_IDS = [
        '_widget_1757568650754', //问题表--一线_沟通详情
        '_widget_1753803755487', //问题表--SLA_问题描述
        '_widget_1753803755495', //问题表--SLA_解决方案
        '_widget_1753803755486', //问题表--SLA_评论
        '_widget_1753803755488', //问题表--SLA_工作日志
        '_widget_1753803755485', //问题表--SLA_附件
        '_widget_1753803755509', //问题表--FDL_问题描述
        '_widget_1753803755510', //问题表--FDL_评论
        '_widget_1753803755511', //问题表--FDL_工作日志
        '_widget_1753803755512', //问题表--FDL_附件
    ];

    /**
     * 处理单个节点，查找并修复内部的span
     * @param {Node} node - 要处理的DOM节点
     */
    const processNode = (node) => {
        // 确保节点是元素节点 (nodeType === 1)
        if (!node || node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        // 构建CSS选择器, 例如: '[data-widgetname="id1"], [data-widgetname="id2"]'
        const selector = WIDGET_IDS.map(id => `[data-widgetname="${id}"]`).join(', ');

        const targetWidgets = [];

        // **【关键更新】**
        // 1. 检查传入的节点本身是否匹配选择器
        if (typeof node.matches === 'function' && node.matches(selector)) {
            targetWidgets.push(node);
        }

        // 2. 检查该节点的后代元素是否匹配选择器
        if (typeof node.querySelectorAll === 'function') {
            const descendantWidgets = node.querySelectorAll(selector);
            // 将NodeList转换为数组并合并
            targetWidgets.push(...Array.from(descendantWidgets));
        }

        if (targetWidgets.length === 0) {
            return;
        }

        console.log(`[JianDaoYun Newline Fix] 发现了 ${targetWidgets.length} 个目标 widget。`, targetWidgets);

        targetWidgets.forEach(widget => {
            // 查找widget内部所有的span标签
            const spans = widget.querySelectorAll('span');
            spans.forEach(span => {
                // 检查文本内容是否包含字面量 "\\n"
                if (span.textContent && span.textContent.includes('\\n')) {
                    console.log('[JianDaoYun Newline Fix] 找到了需要修复的 span:', span);

                    // 1. 将 "\\n" 字符串替换为真正的换行符 "\n"
                    span.textContent = span.textContent.replace(/\\n/g, '\n');

                    // 2. 设置CSS的white-space属性以让浏览器正确渲染换行符
                    span.style.whiteSpace = 'pre-wrap';

                    console.log('[JianDaoYun Newline Fix] 修复完成:', span.textContent);
                }
            });
        });
    };

    // --- 创建一个MutationObserver来监控DOM变化 ---
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 当有新节点被添加到DOM中时，处理这些新节点
                mutation.addedNodes.forEach(processNode);
            }
        }
    });

    // --- 启动Observer ---
    // 配置observer监听整个body的子节点变化（包括子树）
    const config = { childList: true, subtree: true };

    // 使用延时确保页面主要框架加载完成
    setTimeout(() => {
        const targetNode = document.body;
        if (targetNode) {
            observer.observe(targetNode, config);
            console.log('[JianDaoYun Newline Fix] 脚本 v1.1 已启动，开始监控页面变化。');

            // 脚本启动时，先对页面上已存在的内容执行一次检查
            console.log('[JianDaoYun Newline Fix] 正在进行初次页面检查...');
            processNode(document.body);

        } else {
            console.error('[JianDaoYun Newline Fix] 未找到 document.body，脚本无法启动。');
        }
    }, 2000); // 延迟2秒等待页面框架加载

})();
