// ==UserScript==
// @name         Form Save&ReFill / 通用表单助手 (菜单控制版)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  在任何网页手动保存/恢复表单数据。通过 Tampermonkey 菜单操作，支持导出/导入文件。
// @author       Lanto Xia
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558591/Form%20SaveReFill%20%20%E9%80%9A%E7%94%A8%E8%A1%A8%E5%8D%95%E5%8A%A9%E6%89%8B%20%28%E8%8F%9C%E5%8D%95%E6%8E%A7%E5%88%B6%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558591/Form%20SaveReFill%20%20%E9%80%9A%E7%94%A8%E8%A1%A8%E5%8D%95%E5%8A%A9%E6%89%8B%20%28%E8%8F%9C%E5%8D%95%E6%8E%A7%E5%88%B6%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 核心配置 ---
    // 生成当前页面的唯一ID（基于域名和路径，忽略查询参数，确保同一页面的不同参数也能通用）
    // 如果您希望严格区分不同参数的页面，可以将 location.pathname 改为 location.href
    const PAGE_KEY = `form_saver_${window.location.origin}${window.location.pathname}`;

    // --- 1. 注册油猴菜单命令 ---
    // 这些按钮会出现在 Tampermonkey 扩展图标点击后的下拉菜单中
    GM_registerMenuCommand("💾 保存当前表单 (浏览器缓存)", saveToStorage);
    GM_registerMenuCommand("♻️ 恢复表单数据 (浏览器缓存)", loadFromStorage);
    GM_registerMenuCommand("⬇️ 导出为 JSON 文件", exportToFile);
    GM_registerMenuCommand("📂 从 JSON 文件导入", importFromFile);


    // --- 2. 核心功能函数 ---

    // [功能] 获取页面表单数据
    function getFormData() {
        const formData = {};
        // 查找所有常见的输入控件
        const inputs = document.querySelectorAll('input, select, textarea');
        let count = 0;
        let fileCount = 0;

        inputs.forEach(el => {
            // 排除隐藏域、提交按钮、禁用项、无名无ID项
            if (el.type === 'hidden' || el.type === 'submit' || el.disabled) return;
            const key = el.name || el.id;
            if (!key) return; // 没有标识符无法保存

            if (el.type === 'checkbox' || el.type === 'radio') {
                if (el.checked) {
                    formData[key] = el.value;
                    count++;
                }
            } else if (el.type === 'file') {
                if (el.files && el.files.length > 0) {
                    // 文件无法保存内容，只记录文件名作为提示
                    formData[key + '_filename_memo'] = el.files[0].name;
                    fileCount++;
                    count++;
                }
            } else {
                if (el.value) { // 只有有值才保存，节省空间
                    formData[key] = el.value;
                    count++;
                }
            }
        });

        return { data: formData, count: count, fileCount: fileCount };
    }

    // [功能] 恢复数据到页面
    function restoreFormData(formData) {
        if (!formData) return { success: 0, files: [] };

        const inputs = document.querySelectorAll('input, select, textarea');
        let successCount = 0;
        let fileMsg = [];

        inputs.forEach(el => {
            const key = el.name || el.id;
            if (!key) return;

            // 特殊处理：文件上传框
            if (el.type === 'file') {
                const savedFileName = formData[key + '_filename_memo'];
                if (savedFileName) {
                    // 高亮显示
                    el.style.outline = "2px dashed #e74c3c";
                    el.title = `上次上传的文件: ${savedFileName}`; // 鼠标悬停显示
                    fileMsg.push(`[${savedFileName}]`);
                }
                return;
            }

            // 恢复普通数据
            if (formData[key] !== undefined) {
                try {
                    if (el.type === 'radio' || el.type === 'checkbox') {
                        // 仅当值匹配时才勾选（处理多选框组）
                        if (el.value === formData[key]) {
                            el.checked = true;
                            triggerEvent(el);
                            successCount++;
                        }
                    } else {
                        el.value = formData[key];
                        triggerEvent(el);
                        successCount++;
                    }
                } catch (e) {
                    console.error("恢复字段失败:", key, e);
                }
            }
        });

        return { success: successCount, files: fileMsg };
    }

    // [事件] 保存到浏览器 LocalStorage
    function saveToStorage() {
        const result = getFormData();
        if (result.count === 0) {
            showToast("⚠️ 页面上没有检测到已填写的数据");
            return;
        }
        localStorage.setItem(PAGE_KEY, JSON.stringify(result.data));
        showToast(`✅ 已保存 ${result.count} 项数据 (含 ${result.fileCount} 个文件记录)`);
    }

    // [事件] 从浏览器 LocalStorage 恢复
    function loadFromStorage() {
        const json = localStorage.getItem(PAGE_KEY);
        if (!json) {
            showToast("❌ 当前页面没有已保存的记录");
            return;
        }
        const result = restoreFormData(JSON.parse(json));
        handleRestoreResult(result);
    }

    // [事件] 导出为文件
    function exportToFile() {
        const result = getFormData();
        if (result.count === 0) {
            showToast("⚠️ 空数据，无需导出");
            return;
        }
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // 文件名包含域名和时间
        const domain = window.location.hostname.split('.').slice(-2).join('.');
        a.download = `FormSave_${domain}_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("⬇️ 文件已导出");
    }

    // [事件] 从文件导入
    function importFromFile() {
        // 动态创建一个隐藏的 file input 来触发选择文件
        let input = document.getElementById('tm_form_saver_import');
        if (!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.id = 'tm_form_saver_import';
            input.accept = '.json';
            input.style.display = 'none';
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(evt) {
                    try {
                        const data = JSON.parse(evt.target.result);
                        const result = restoreFormData(data);
                        handleRestoreResult(result);
                    } catch (err) {
                        alert("文件解析失败，请确认是合法的 JSON 文件");
                    }
                };
                reader.readAsText(file);
                this.value = ''; // 重置以便下次重复选同个文件
            });
            document.body.appendChild(input);
        }
        input.click();
    }

    // --- 3. 辅助工具 ---

    // 触发页面事件，确保 React/Vue 等框架能感知数据变化
    function triggerEvent(el) {
        ['input', 'change', 'blur'].forEach(evtType => {
            el.dispatchEvent(new Event(evtType, { bubbles: true }));
        });
    }

    // 处理恢复结果反馈
    function handleRestoreResult(result) {
        let msg = `♻️ 成功恢复 ${result.success} 个字段`;
        if (result.files.length > 0) {
            msg += `\n⚠️ 注意：以下 ${result.files.length} 个文件需手动重新上传（已高亮）：\n${result.files.join(', ')}`;
            alert(msg); // 文件提示用弹窗更醒目
        } else {
            showToast(msg);
        }
    }

    // 简单的 Toast 提示消息
    function showToast(text) {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 999999;
            background: rgba(0,0,0,0.8); color: white; padding: 10px 20px;
            border-radius: 4px; font-size: 14px; font-family: sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2); transition: opacity 0.5s;
        `;
        div.innerText = text;
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 500);
        }, 3000);
    }

})();