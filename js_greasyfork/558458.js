// ==UserScript==
// @name         比特球云盘 - 一键删除所有文件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  利用删除成功提示出现后极短延迟，实现最快循环删除。
// @author       Sc千寻
// @include      https://pan.bitqiu.com/*
// @grant        none
// @run-at       document-idle
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/558458/%E6%AF%94%E7%89%B9%E7%90%83%E4%BA%91%E7%9B%98%20-%20%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/558458/%E6%AF%94%E7%89%B9%E7%90%83%E4%BA%91%E7%9B%98%20-%20%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量定义
    const FILE_ITEM_SELECTOR = 'ol.file-list-content .file-item';
    const SELECT_ALL_BUTTON_SELECTOR = '.el-checkbox.checkbox-all';
    const SUCCESS_NOTICE_SELECTOR = '.notice-wrap.notice-success';

    // 辅助函数：等待并获取/检查元素
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    return resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    return reject(new Error(`Timeout waiting for element with selector: ${selector}`));
                }
                setTimeout(check, 200);
            };
            check();
        });
    }

    // --- 插入新按钮的逻辑 (保持不变) ---
    function insertDeleteAllButton() {
        const createDirButtonSelector = 'a[data-tj="top_btn_create_dir"]';
        const createDirButton = document.querySelector(createDirButtonSelector);

        if (document.getElementById('deleteAllFilesBtn')) {
            return;
        }

        if (createDirButton) {
            const deleteAllBtn = document.createElement('a');
            deleteAllBtn.id = 'deleteAllFilesBtn';

            deleteAllBtn.className = '_btn btn-default mr10';
            deleteAllBtn.style.color = '#fff';
            deleteAllBtn.style.backgroundColor = '#fa5555';
            deleteAllBtn.style.borderColor = '#fa5555';
            deleteAllBtn.title = '一键清空当前文件夹下的所有文件（极限加速）';

            deleteAllBtn.innerHTML = `
                <svg aria-hidden="true" class="svg-icon">
                    <use xlink:href="#icon-remove"></use>
                </svg>
                <span style="font-weight: bold;">清空所有文件</span>
            `;

            deleteAllBtn.addEventListener('click', deleteLoop);

            createDirButton.after(deleteAllBtn);
            console.log('🎉 “清空所有文件”按钮已成功插入/重新插入！');
        }
    }

    // 核心函数：执行一次删除步骤
    async function performDeleteStep() {
        // --- 步骤 1: 模拟点击 "全选" 按钮 ---
        const selectAllButton = await waitForElement(SELECT_ALL_BUTTON_SELECTOR, 5000);
        selectAllButton.click();
        console.log('    -> ✔️ 已点击 "全选" 按钮。');

        await new Promise(resolve => setTimeout(resolve, 500));

        // --- 检查文件数量 ---
        const fileItems = document.querySelectorAll(FILE_ITEM_SELECTOR);
        if (fileItems.length === 0) {
            throw new Error('FILE_LIST_EMPTY');
        }

        // --- 步骤 2: 模拟点击 "删除" 按钮 ---
        const deleteButtonSelector = 'a[data-tj="top_btn_del"]';
        const deleteButton = document.querySelector(deleteButtonSelector);

        if (!deleteButton) {
             throw new Error('未找到顶部的 "删除" 按钮。');
        }

        deleteButton.click();
        console.log('    -> ✔️ 已点击顶部的 "删除" 按钮。');


        // --- 步骤 3: 模拟点击 确认弹窗中的 "确定" 按钮 ---
        const confirmButtonSelector = 'a.js-confirm';
        const confirmButton = await waitForElement(confirmButtonSelector, 5000);

        confirmButton.click();
        console.log('    -> ✔️ 已点击确认删除。');

        // 🚀 等待删除成功提示出现 (证明服务器已响应并完成操作)
        console.log('    -> ⏳ 等待删除操作完成...');
        await waitForElement(SUCCESS_NOTICE_SELECTOR, 10000);
        console.log('    -> 🎉 成功提示已出现，删除操作完成。');

        // 🚀 等待 1000 毫秒后立即开始下一轮
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('    -> ⚡ 1000ms 延迟结束，准备进入下一轮循环。');
    }

    // 主循环函数：持续删除直到清空
    async function deleteLoop() {
        insertDeleteAllButton();

        if (!confirm('🚨 严重警告：您确定要删除当前文件夹下的所有文件吗？此操作将循环执行直到清空文件夹！')) {
            console.log('操作已取消。');
            return;
        }

        let deleteCount = 0;

        console.log('🚀 开始循环执行：清空所有文件 (v6.0 极限加速)...');

        try {
            while (true) {
                // 等待文件列表内容加载完毕
                await waitForElement(FILE_ITEM_SELECTOR, 10000).catch(() => {});

                const fileItems = document.querySelectorAll(FILE_ITEM_SELECTOR);
                const currentFileCount = fileItems.length;

                if (currentFileCount === 0) {
                    console.log('✅ 文件列表已清空，循环结束。');
                    break;
                }

                deleteCount++;
                console.log(`\n--- 第 ${deleteCount} 次删除，当前页面有 ${currentFileCount} 个文件 ---`);

                // 执行一次删除操作
                await performDeleteStep();

                // 极小延迟，避免 CPU 占用过高
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            alert(`🎉 恭喜！已成功清空所有文件，共执行了 ${deleteCount} 轮删除操作。`);

        } catch (error) {
            if (error.message === 'FILE_LIST_EMPTY') {
                 console.log('✅ 文件列表已清空，循环结束 (通过空列表检查退出)。');
                 alert(`🎉 恭喜！已成功清空所有文件，共执行了 ${deleteCount} 轮删除操作。`);
            } else {
                console.error('❌ 脚本执行失败，循环中断:', error.message);
                alert(`脚本执行失败，循环中断：${error.message}`);
            }
        }

        // 最终清理
        insertDeleteAllButton();
    }

    // 启动
    waitForElement('a[data-tj="top_btn_create_dir"]', 15000)
        .then(insertDeleteAllButton)
        .catch(error => {
            console.warn('脚本启动失败:', error.message);
        });

})();