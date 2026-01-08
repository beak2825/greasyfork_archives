// ==UserScript==
// @name         feishu content fold
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  content toggle
// @author       onionycs
// @license      MIT
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/561809/feishu%20content%20fold.user.js
// @updateURL https://update.greasyfork.org/scripts/561809/feishu%20content%20fold.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* globals jQuery, $, waitForKeyElements */

    // ========== 缩放控制函数 ==========
    // 缩放到25%
    function zoomToMinimum() {
        document.body.style.zoom = 0.25;
        console.log('📏 页面已缩放到 25%');
    }

    // 还原缩放为100%
    function resetZoom() {
        document.body.style.zoom = 1;
        console.log('📏 页面缩放已还原为 100%');
    }

    // ========== 核心折叠函数 ==========
    async function foldByIncrementBreakRuleNoRetryLimit() {
        // 步骤1：获取所有render-unit-wrapper容器
        const allRenderWrappers = Array.from(document.querySelectorAll('render-unit-wrapper, .render-unit-wrapper'));
        console.error('========== 开始无重试限制的分组折叠 ==========');
        console.error(`📌 页面中找到${allRenderWrappers.length}个render-unit-wrapper容器`);

        // 全局状态
        const processedElements = new Set();
        const maxIdleCycles = 5; 
        let idleCycleCount = 0;

        // 无限循环处理
        while (true) {
            let hasNewElement = false;

            // 步骤2：遍历每个容器
            allRenderWrappers.forEach((wrapper, wrapperIndex) => {
                // 步骤3：提取未处理的标题元素
                const allHeadings = Array.from(wrapper.querySelectorAll('[data-block-type^="heading"]'))
                    .filter(el => !processedElements.has(el));
                
                if (allHeadings.length === 0) return;
                hasNewElement = true;
                idleCycleCount = 0;

                // 步骤4：提取标题层级
                const headingList = allHeadings.map(el => {
                    const blockType = el.getAttribute('data-block-type');
                    const level = parseInt(blockType.replace('heading', ''));
                    return { el, level: isNaN(level) ? 0 : level };
                }).filter(item => item.level > 0);

                if (headingList.length === 0) return;
                const rawLevels = headingList.map(item => item.level);
                console.error(`\n🔍 第${wrapperIndex+1}个容器：`);
                console.error(`   - 原始层级数组：`, rawLevels);

                // 步骤5：自定义分组（基于首元素）
                const customGroups = [];
                let currentGroup = [headingList[0]];
                let currentGroupFirstLevel = headingList[0].level;

                for (let i = 1; i < headingList.length; i++) {
                    const currLevel = headingList[i].level;
                    if (currLevel <= currentGroupFirstLevel) {
                        customGroups.push(currentGroup);
                        currentGroup = [headingList[i]];
                        currentGroupFirstLevel = currLevel;
                    } else {
                        currentGroup.push(headingList[i]);
                    }
                }
                customGroups.push(currentGroup);
                const groupsLog = customGroups.map(group => group.map(item => item.level));
                console.error(`   - 自定义分组结果：`, groupsLog);

                // 步骤6：找组内第一个单增段的最后一个元素（折叠目标）
                const targetGroup = customGroups[0];
                if (!targetGroup || targetGroup.length === 0) return;
                const groupLevels = targetGroup.map(item => item.level);

                let incrementBreakIndex = 0;
                for (let i = 1; i < targetGroup.length; i++) {
                    if (targetGroup[i].level <= targetGroup[i-1].level) {
                        incrementBreakIndex = i-1;
                        break;
                    }
                    if (i === targetGroup.length - 1) {
                        incrementBreakIndex = i;
                    }
                }

                // 确定折叠目标
                const targetItem = targetGroup[incrementBreakIndex];
                const targetEl = targetItem.el;
                const targetLevel = targetItem.level;
                console.error(`   - 组内单增段：${groupLevels.slice(0, incrementBreakIndex+1).join('→')}`);
                console.error(`   - 待折叠目标：heading${targetLevel}（单增段最后一个元素）`);

                // 标记为已处理
                processedElements.add(targetEl);

                // 步骤7：折叠操作（核心新增：状态判定）
                const foldWrapper = targetEl.querySelector('.fold-wrapper');
                if (!foldWrapper) {
                    console.error(`   - ⚠️ heading${targetLevel}未找到折叠容器，跳过`);
                    return;
                }

                // 关键判定：检查fold-wrapper是否包含fold-folded类（已折叠）
                const isAlreadyFolded = foldWrapper.classList.contains('fold-folded');
                if (isAlreadyFolded) {
                    console.error(`   - ℹ️ heading${targetLevel}已处于折叠状态（fold-wrapper含fold-folded），跳过点击`);
                    return;
                }

                const foldHandler = foldWrapper.querySelector('.fold-handler');
                if (foldHandler) {
                    foldHandler.click();
                    console.error(`   - ✅ 已折叠heading${targetLevel}`);
                } else {
                    console.error(`   - ⚠️ heading${targetLevel}未找到折叠触发元素，跳过`);
                }
            });

            // 步骤8：判定是否终止循环
            if (!hasNewElement) {
                idleCycleCount++;
                console.error(`\nℹ️ 本次循环无新元素，空循环计数：${idleCycleCount}/${maxIdleCycles}`);
                if (idleCycleCount >= maxIdleCycles) {
                    console.error('\n✅ 连续多次无新元素，终止处理');
                    break;
                }
            }

            // 步骤9：等待动态加载
            console.error('\n⌛ 等待500ms，检测新加载的元素...');
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.error('\n========== 无重试限制折叠结束 ==========');
    }

    // ========== 注册油猴菜单命令 ==========
    // 注册"折叠内容"菜单，点击后执行折叠函数
    GM_registerMenuCommand("折叠内容", async () => {
        // 执行前给出提示
        zoomToMinimum();
        alert("❗️❗️请调整网页缩放到最小❗️❗️");
        alert("开始执行飞书内容折叠操作，请查看控制台日志了解进度！");
        await foldByIncrementBreakRuleNoRetryLimit();
        alert("折叠操作执行完成！");
        resetZoom();
    });

})();