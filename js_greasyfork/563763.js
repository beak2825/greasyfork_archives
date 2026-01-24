// ==UserScript==
// @name         Flow增强：粘贴+拖拽上传
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  仅保留核心功能：支持多图并发粘贴与拖拽上传，不干扰页面设置
// @author       Gemini
// @match        https://labs.google/*
// @match        https://*.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563763/Flow%E5%A2%9E%E5%BC%BA%EF%BC%9A%E7%B2%98%E8%B4%B4%2B%E6%8B%96%E6%8B%BD%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/563763/Flow%E5%A2%9E%E5%BC%BA%EF%BC%9A%E7%B2%98%E8%B4%B4%2B%E6%8B%96%E6%8B%BD%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 强力多图注入逻辑
    const forceUpload = async (files) => {
        let fileInput = document.querySelector('input[type="file"]');

        // 如果找不到上传框，尝试自动点击“+”号按钮激活隐藏的 Input
        if (!fileInput) {
            const addBtn = document.querySelector('button[aria-label*="image"], [class*="add"]')?.closest('button');
            if (addBtn) {
                addBtn.click();
                // 等待 DOM 生成
                await new Promise(r => setTimeout(r, 400));
                fileInput = document.querySelector('input[type="file"]');
            }
        }

        if (fileInput) {
            const dt = new DataTransfer();
            // 将所有检测到的图片文件加入传输队列
            Array.from(files).forEach(f => {
                if(f.type.startsWith('image/')) dt.items.add(f);
            });

            if (dt.items.length > 0) {
                fileInput.files = dt.files;
                // 触发 change 事件告知网页开始处理上传
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`🚀 已尝试强行注入 ${dt.files.length} 张图片`);
            }
        }
    };

    // 2. 监听拖拽事件
    window.addEventListener('drop', (e) => {
        if (e.dataTransfer.files.length > 0) {
            e.preventDefault();
            forceUpload(e.dataTransfer.files);
        }
    }, true);

    // 3. 监听粘贴事件
    window.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        const files = [];
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                files.push(item.getAsFile());
            }
        }
        if (files.length > 0) forceUpload(files);
    });

    // 允许拖拽文件经过
    window.addEventListener('dragover', e => e.preventDefault(), true);

})();