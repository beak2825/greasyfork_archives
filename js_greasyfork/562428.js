// ==UserScript==
// @name         SHSMU 评教全自动 (满分+评论+提交)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  一键全选5分、自动填写评论并提交
// @author       AI-Assistant
// @match        *://jwstu.shsmu.edu.cn/*
// @grant        none
// @run-at       document-end
// @allFrames    true
// @downloadURL https://update.greasyfork.org/scripts/562428/SHSMU%20%E8%AF%84%E6%95%99%E5%85%A8%E8%87%AA%E5%8A%A8%20%28%E6%BB%A1%E5%88%86%2B%E8%AF%84%E8%AE%BA%2B%E6%8F%90%E4%BA%A4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562428/SHSMU%20%E8%AF%84%E6%95%99%E5%85%A8%E8%87%AA%E5%8A%A8%20%28%E6%BB%A1%E5%88%86%2B%E8%AF%84%E8%AE%BA%2B%E6%8F%90%E4%BA%A4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置区域 ===
    const CONFIG = {
        btnId: 'shsmu-auto-submit-btn',
        text: '🚀 一键全选并提交', // 按钮文字
        comment: '老师备课充分，讲解清晰，对学生非常有耐心，收获很大！', // 自动填写的评论内容
        submitBtnId: 'btnSure', // 页面原生的提交按钮ID (根据截图确认)
    };

    // === 核心逻辑 ===
    function init() {
        if (document.getElementById(CONFIG.btnId)) return;

        // 检测当前框架是否包含评教表单
        // 必须同时存在选项(.iCheck-helper)和提交按钮(#btnSure)才显示，防止在错误页面运行
        const hasForm = document.querySelector('.iCheck-helper');
        const hasSubmitBtn = document.getElementById(CONFIG.submitBtnId);

        if (!hasForm || !hasSubmitBtn) return;

        createButton();
    }

    function createButton() {
        const btn = document.createElement('div');
        btn.id = CONFIG.btnId;
        btn.innerHTML = CONFIG.text;
        btn.style.cssText = `
            position: fixed;
            bottom: 50px;
            right: 50px;
            z-index: 999999;
            padding: 12px 24px;
            background: #d9534f;
            color: white;
            font-size: 16px;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: sans-serif;
            border: 2px solid #fff;
            transition: all 0.2s;
        `;

        btn.onclick = function() {
            if (!confirm('确定要全选满分并直接提交吗？')) return;

            btn.innerHTML = '⏳ 正在处理...';
            btn.style.background = "#f0ad4e";

            // 1. 勾选所有客观题
            const count = autoFillRadio();

            // 2. 填写主观题评论
            fillComment();

            // 3. 提交
            if (count > 0) {
                setTimeout(() => {
                    doSubmit(); // 调用页面原生的提交函数
                    // 或者使用 click 模拟: document.getElementById(CONFIG.submitBtnId).click();

                    btn.innerHTML = '✅ 已提交';
                    btn.style.background = "#5cb85c";
                }, 500); // 延迟0.5秒确保勾选生效
            } else {
                alert("未找到可勾选的选项，请检查页面！");
                btn.innerHTML = CONFIG.text;
                btn.style.background = "#d9534f";
            }
        };

        document.body.appendChild(btn);
    }

    // 步骤1：勾选单选框
    function autoFillRadio() {
        let count = 0;
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            const options = row.querySelectorAll('.iCheck-helper');
            if (options.length > 0) {
                options[options.length - 1].click(); // 点击最后一个选项
                count++;
            }
        });
        return count;
    }

    // 步骤2：填写评论
    function fillComment() {
        // 查找页面上的文本域 textarea
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(area => {
            // 只有当它是空的时候才填，避免覆盖你已经写的内容
            if (area.value.trim() === '') {
                area.value = CONFIG.comment;
            }
        });
    }

    // 步骤3：触发提交
    function doSubmit() {
        const submitBtn = document.getElementById(CONFIG.submitBtnId);
        if (submitBtn) {
            submitBtn.click();
        } else {
            alert("找不到提交按钮，请手动提交");
        }
    }

    // 启动检测
    init();
    setInterval(init, 1000);

})();