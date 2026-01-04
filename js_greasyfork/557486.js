// ==UserScript==
// @name         xt一站式自动填写联系人
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  自动填写新增综合维修弹窗中的联系人信息
// @author       han
// @match        http://192.168.81.1:8081/sys/index
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557486/xt%E4%B8%80%E7%AB%99%E5%BC%8F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%81%94%E7%B3%BB%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557486/xt%E4%B8%80%E7%AB%99%E5%BC%8F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%81%94%E7%B3%BB%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 配置区域 =====
    const CONFIG = {
        contactName: '曾荣',  // 要填写的联系人姓名
        retryDelay: 200,  // 重试延迟（毫秒）
        maxRetries: 10  // iframe 内部最大重试次数
    };

    // ===== 核心功能 =====

    // 填写联系人信息（带重试机制）
    function fillContactInfo(iframe, retryCount = 0) {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            // 检查 iframe 是否真的加载完成
            if (!iframeDoc || iframeDoc.readyState !== 'complete') {
                if (retryCount < CONFIG.maxRetries) {
                    setTimeout(() => fillContactInfo(iframe, retryCount + 1), CONFIG.retryDelay);
                }
                return;
            }

            // 常见的联系人输入框选择器
            const selectors = [
                'input[name*="contact"]',
                'input[name*="linkman"]',
                'input[name*="lianxiren"]',
                'input[placeholder*="联系人"]',
                'input[id*="contact"]',
                'input[id*="linkman"]',
                '#contactName',
                '#linkman',
                'input[name="contactName"]',
                'input[name="linkman"]',
                'input[name="lxr"]'
            ];

            let contactInput = null;
            for (let selector of selectors) {
                contactInput = iframeDoc.querySelector(selector);
                if (contactInput) {
                    console.log(`✓ 找到联系人输入框: ${selector}`);
                    break;
                }
            }

            if (contactInput) {
                // 填写联系人
                contactInput.value = CONFIG.contactName;
                contactInput.focus();

                // 触发多种事件确保兼容性
                ['input', 'change', 'blur', 'keyup'].forEach(eventType => {
                    contactInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                });

                console.log(`✓ 已自动填写联系人: ${CONFIG.contactName}`);
            } else {
                // 如果没找到，尝试重试
                if (retryCount < CONFIG.maxRetries) {
                    console.log(`未找到联系人输入框，${CONFIG.retryDelay}ms 后重试... (${retryCount + 1}/${CONFIG.maxRetries})`);
                    setTimeout(() => fillContactInfo(iframe, retryCount + 1), CONFIG.retryDelay);
                } else {
                    console.warn('❌ 达到最大重试次数，仍未找到联系人输入框');
                    // 输出所有输入框供调试
                    const allInputs = iframeDoc.querySelectorAll('input');
                    console.log('页面中的所有输入框:', Array.from(allInputs).map(input => ({
                        name: input.name,
                        id: input.id,
                        placeholder: input.placeholder,
                        type: input.type
                    })));
                }
            }
        } catch (error) {
            console.error('填写联系人时出错:', error);
            // 出错也重试
            if (retryCount < CONFIG.maxRetries) {
                setTimeout(() => fillContactInfo(iframe, retryCount + 1), CONFIG.retryDelay);
            }
        }
    }

    // 处理弹窗出现
    function handleDialog(dialog) {
        console.log('🎯 检测到弹窗');

        // 查找所有可能的 iframe
        const iframes = [
            dialog.querySelector('iframe'),
            document.querySelector('#layui-layer-iframe3'),
            document.querySelector('iframe[name^="layui-layer-iframe"]')
        ].filter(Boolean);

        const iframe = iframes[0];

        if (!iframe) {
            console.warn('未找到 iframe');
            return;
        }

        console.log('找到 iframe，准备填写...');

        // 多重保障机制
        let filled = false;

        // 1. 监听 iframe load 事件
        iframe.addEventListener('load', function onLoad() {
            if (!filled) {
                console.log('iframe load 事件触发');
                setTimeout(() => fillContactInfo(iframe), 100);
                filled = true;
            }
        });

        // 2. 立即尝试（iframe 可能已加载）
        setTimeout(() => {
            if (!filled) {
                console.log('立即尝试填写');
                fillContactInfo(iframe);
                filled = true;
            }
        }, 100);

        // 3. 延迟尝试（兜底）
        setTimeout(() => {
            console.log('延迟兜底尝试');
            fillContactInfo(iframe);
        }, 500);
    }

    // 使用 MutationObserver 监听弹窗出现
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // 检查是否是 layui 弹窗
                if (node.nodeType === 1 &&
                    (node.id && node.id.startsWith('layui-layer') ||
                     node.classList && node.classList.contains('layui-layer'))) {

                    // 检查是否包含"新增综合维修"标题
                    const title = node.querySelector('.layui-layer-title');
                    if (title && title.textContent.includes('新增综合维修')) {
                        handleDialog(node);
                    }
                }
            });
        });
    });

    // 启动监听
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('✓ 自动填写联系人脚本已启动');

    // 检查页面上是否已经存在弹窗
    const existingDialog = document.querySelector('#layui-layer3');
    if (existingDialog) {
        console.log('检测到已存在的弹窗');
        handleDialog(existingDialog);
    }
})();