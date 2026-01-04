// ==UserScript==
// @name         CRM 客户健康度监控助手 (V4.0)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  监控72crm客户详情页，保存后提示健康度变化，并仅在状态改变时自动发送邮件。
// @author       zk
// @match        *://www.72crm.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557988/CRM%20%E5%AE%A2%E6%88%B7%E5%81%A5%E5%BA%B7%E5%BA%A6%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B%20%28V40%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557988/CRM%20%E5%AE%A2%E6%88%B7%E5%81%A5%E5%BA%B7%E5%BA%A6%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B%20%28V40%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('>>> CRM监控脚本 V4.0 已加载，正在等待编辑表单出现...');

    // --- 状态变量 ---
    let initialValue = null;
    let formDetected = false;
    let dataToConfirm = null; // 存储 {initial: '...', new: '...'} 在点击保存时

    // --- 工具函数: 延迟函数 (用于 async/await) ---
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- 工具函数: 获取当前选中的健康度值 ---
    function getCurrentHealthValue() {
        const options = ["健康(Healthy)", "关注(Watch)", "风险(At-Risk)"];
        for (let val of options) {
            let input = document.querySelector(`input[type="radio"][value="${val}"]`);
            if (input) {
                if (input.checked) return val;
                let inputWrapper = input.closest('.el-radio__input');
                if (inputWrapper && inputWrapper.classList.contains('is-checked')) {
                    return val;
                }
            }
        }
        return null;
    }

    // --- 工具函数: 显示 Toast 提示 ---
    function showCustomToast(message, isSuccess = true) {
        // ... (保持不变，省略 Toast 样式代码) ...
        const id = 'tm-health-status-toast';
        let toast = document.getElementById(id);
        if (toast) toast.remove();

        toast = document.createElement('div');
        toast.id = id;
        toast.textContent = message;

        // 简单的 Element UI 风格样式
        toast.style.cssText = `
             position: fixed;
             top: 20px;
             right: 20px;
             padding: 10px 20px;
             border-radius: 4px;
             background-color: ${isSuccess ? '#67C23A' : '#E6A23C'};
             color: white;
             z-index: 99999;
             box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
             font-size: 14px;
             transition: opacity 0.3s ease-in-out;
             opacity: 1;
        `;

        document.body.appendChild(toast);

        // 自动消失
        setTimeout(() => {
            if (toast) {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // --- 工具函数: 自动点击发送邮件 (客户详情页) ---
    function clickSendEmailButton() {
        const emailButtonSpan = Array.from(document.querySelectorAll('button.el-button.is-text.is-has-bg span'))
            .find(span => span.textContent.trim() === '发送邮件');

        if (emailButtonSpan) {
            emailButtonSpan.closest('button').click();
            console.log('>>> 自动化操作：已成功点击 [发送邮件] 按钮 (客户详情页)。');
            return true;
        }
        console.warn('>>> 自动化操作：未找到 [发送邮件] 按钮 (客户详情页)。');
        return false;
    }

    // --- 工具函数: 点击选择模板 (邮件弹窗) ---
    function clickSelectTemplateButtonSync() {
        const targetSpan = document.querySelector('.template-btn .btn-color');
        if (targetSpan && targetSpan.textContent.includes('选择模板')) {
            targetSpan.click();
            console.log("已点击【选择模板】按钮。");
            return true;
        } else {
            console.warn("未能找到【选择模板】按钮。");
            return false;
        }
    }

    // --- 工具函数: 选择模板并点击确定 (模板列表弹窗) ---
    function selectTemplateAndConfirm() {
        const templateName = '客户健康度状态变化提醒';

        // 1. 查找目标行
        const templateRow = Array.from(document.querySelectorAll('.el-table__cell .cell'))
            .find(cell => cell.textContent.trim() === templateName)
            ?.closest('tr.el-table__row');

        if (!templateRow) {
            console.warn(`未找到模板："${templateName}" 所在的行。`);
            return false;
        }

        // 2. 选中复选框
        const checkbox = templateRow.querySelector('.el-checkbox__original');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
            console.log(`已勾选模板："${templateName}"。`);
        }

        // 3. 查找并点击“确定”按钮 (使用最精确的上下文定位)
        const confirmButtonSpan = Array.from(document.querySelectorAll('.dialog-footer button.el-button--primary span'))
            .find(span => span.textContent.trim() === '确定');

        if (confirmButtonSpan) {
            confirmButtonSpan.closest('button').click();
            console.log('成功点击模板选择弹窗中的【确定】按钮。');
            return true;
        } else {
            console.error('未找到弹窗中的【确定】按钮。');
            return false;
        }
    }

    // --- 工具函数: 点击发送 (邮件弹窗) ---
    function clickSendButton() {
        const sendButtonSpan = Array.from(document.querySelectorAll('button.el-button--primary span'))
            .find(span => span.textContent.trim() === '发送');

        if (sendButtonSpan) {
            sendButtonSpan.closest('button').click();
            console.log("成功点击【发送】按钮。");
            return true;
        }

        console.warn("未找到邮件编辑弹窗中的【发送】按钮。");
        return false;
    }

    // --- 核心自动化流程 ---
    async function executeEmailSequence() {
        console.log('====================================================');
        console.log('状态已变更，启动邮件自动化流程...');

        // 1. 点击“发送邮件”按钮 (等待客户详情页加载稳定)
        await delay(1000);
        if (!clickSendEmailButton()) return;

        // 2. 点击“选择模板” (等待邮件弹窗出现)
        await delay(1500);
        if (!clickSelectTemplateButtonSync()) return;

        // 3. 选择模板并点击“确定” (等待模板列表弹窗出现)
        // 增加较长延迟，确保模板列表加载完成
        await delay(3000);
        if (!selectTemplateAndConfirm()) return;

        // 4. 等待邮件内容加载完成，然后点击“发送”
        await delay(2000);
        clickSendButton();

        console.log('邮件自动化流程执行完成!');
        console.log('====================================================');
    }


    // --- 核心监控逻辑: MutationObserver ---
    const observer = new MutationObserver((mutations) => {
        const val = getCurrentHealthValue();

        if (val) {
            // === 情况A: 表单已出现/打开 ===
            if (!formDetected) {
                setTimeout(() => {
                    const finalVal = getCurrentHealthValue();
                    if (finalVal) {
                        initialValue = finalVal;
                        formDetected = true;
                        console.log(`>>> 检测到编辑窗口，锁定初始健康度为: [${initialValue}]`);
                    }
                }, 300);
            }
        } else {
            // === 情况B: 表单消失/关闭 ===
            const anyInput = document.querySelector('input[type="radio"][value="健康(Healthy)"]');

            if (!anyInput && formDetected) {
                formDetected = false;

                // 检查是否有待确认的保存操作
                if (dataToConfirm) {
                    const { initial, new: newValue } = dataToConfirm;
                    initialValue = null; // 重置初始值
                    dataToConfirm = null; // 清除待确认状态

                    const isChanged = initial !== newValue;
                    const message = `客户健康度更新完成：初始值 [${initial}] ；新值 [${newValue}]。${isChanged ? '【状态已变更】' : '（未变更）'}`;

                    // 1. 提示变化 (无论是否改变，都提示用户)
                    showCustomToast(message, isChanged);

                    // 2. 根据状态判断是否执行邮件流程
                    if (isChanged) {
                        executeEmailSequence();
                    } else {
                        console.log('健康度状态未发生变化，跳过邮件发送流程。');
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // --- 监听保存按钮点击 ---
    document.addEventListener('click', function(e) {
        let btn = e.target.closest('button');

        if (btn && btn.innerText.includes('保存')) {
            console.log('>>> 点击了保存按钮，等待表单关闭...');

            if (formDetected && initialValue !== null) {
                const newValue = getCurrentHealthValue();
                dataToConfirm = { initial: initialValue, new: newValue };
            }
        }
    }, true); // 使用捕获模式
})();