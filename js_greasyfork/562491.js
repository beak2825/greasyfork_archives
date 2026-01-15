// ==UserScript==
// @name         SHSMU 评教全自动 (极速并发版)
// @namespace    http://tampermonkey.net/
// @version      11.2
// @description  尝试一次性打开8个未完成表单 -> 自动填表提交关闭
// @author       AI-Assistant
// @match        *://*.shsmu.edu.cn/*
// @grant        window.close
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562491/SHSMU%20%E8%AF%84%E6%95%99%E5%85%A8%E8%87%AA%E5%8A%A8%20%28%E6%9E%81%E9%80%9F%E5%B9%B6%E5%8F%91%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562491/SHSMU%20%E8%AF%84%E6%95%99%E5%85%A8%E8%87%AA%E5%8A%A8%20%28%E6%9E%81%E9%80%9F%E5%B9%B6%E5%8F%91%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置区域 ===
    const CONFIG = {
        batchSize: 8,       // 每次打开多少个 (建议8，太多浏览器会崩)
        openInterval: 300,   // 打开间隔(毫秒)，已优化到最快，太快会被浏览器当做病毒拦截
        closeDelay: 2000,    // 详情页提交后关闭等待时间
        comment: '老师备课充分，讲解清晰，对学生非常有耐心，收获很大！', // 评语
        submitBtnId: 'btnSure',
    };

    // === 屏蔽弹窗干扰 ===
    window.alert = function(msg) { console.log('拦截Alert:', msg); return true; };
    window.confirm = function(msg) { console.log('拦截Confirm:', msg); return true; };

    // === 主程序 ===
    function init() {
        const submitBtn = document.getElementById(CONFIG.submitBtnId);
        const hasOptions = document.querySelector('.iCheck-helper');

        if (submitBtn && hasOptions) {
            handleEvaluationPage(submitBtn);
        } else if(document.querySelector('table')) {
            createBatchButton();
        }
    }

    // === 逻辑 A: 列表页 (优化后的批量打开) ===
    function createBatchButton() {
        if (document.getElementById('batch-eval-btn')) return;

        const btn = document.createElement('div');
        btn.id = 'batch-eval-btn';
        btn.innerHTML = `🚀 打开前 ${CONFIG.batchSize} 个未完成`;
        btn.style.cssText = `
            position: fixed; bottom: 50px; right: 50px; z-index: 999999;
            padding: 15px 30px; background: #0275d8; color: white;
            font-size: 16px; font-weight: bold; border-radius: 50px;
            cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 2px solid white; transition: all 0.2s;
        `;

        btn.onclick = function() {
            if (btn.getAttribute('data-running') === 'true') return;
            
            // 首次运行时提醒弹窗权限
            if (!confirm(`【关键提示】\n如果这是你第一次使用，浏览器可能会拦截第2个窗口。\n\n请务必留意地址栏右侧是否有"拦截图标"，并选择"始终允许"！\n\n点击确定开始打开...`)) return;
            
            btn.setAttribute('data-running', 'true');
            btn.style.background = '#f0ad4e';
            
            startBatchOpen(btn);
        };

        document.body.appendChild(btn);
    }

    function startBatchOpen(btn) {
        // 重新获取所有未完成的行
        const rows = Array.from(document.querySelectorAll("tr")).filter(row => 
            row.innerText.includes("未完成")
        );

        if (rows.length === 0) {
            alert("未找到'未完成'的项目！");
            location.reload();
            return;
        }

        // 截取前 N 个任务
        const targets = rows.slice(0, CONFIG.batchSize);
        
        console.log(`准备打开 ${targets.length} 个窗口`);

        let i = 0;
        // 使用 setInterval 循环打开
        const timer = setInterval(() => {
            if (i >= targets.length) {
                clearInterval(timer);
                btn.innerHTML = `⚠️ 已打开 ${targets.length} 个，等待自动关闭...`;
                // 3秒后变为刷新按钮
                setTimeout(() => {
                   btn.innerHTML = '🔄 点此刷新页面 (处理下一批)';
                   btn.style.background = '#d9534f';
                   btn.onclick = () => location.reload();
                   btn.setAttribute('data-running', 'false');
                }, 3000);
                return;
            }

            const row = targets[i];
            const clickBtn = row.querySelector(".btn.btn-primary");
            
            if (clickBtn) {
                // 视觉反馈：高亮当前行
                row.style.backgroundColor = "#dff0d8";
                
                // 尝试强制设置 target="_blank" (如果是链接)
                if (clickBtn.tagName === 'A') {
                    clickBtn.target = "_blank";
                }
                
                // 触发点击
                clickBtn.click();
                
                // 更新按钮文字
                btn.innerHTML = `⏳ 正在打开 ${i + 1} / ${targets.length}...`;
            }

            i++;
        }, CONFIG.openInterval);
    }

    // === 逻辑 B: 详情页 (无需改动，保持自动填表提交) ===
    function handleEvaluationPage(submitBtn) {
        setTimeout(() => {
            // 1. 填满分
            const rows = document.querySelectorAll('tr');
            let count = 0;
            rows.forEach(row => {
                const options = row.querySelectorAll('.iCheck-helper');
                if (options.length > 0) {
                    options[options.length - 1].click();
                    count++;
                }
            });

            // 2. 填评语
            document.querySelectorAll('textarea').forEach(area => {
                if (!area.value.trim()) area.value = CONFIG.comment;
            });

            // 3. 提交并关闭
            if (count > 0) {
                showOverlay();
                submitBtn.click();
                
                setTimeout(() => {
                    window.close();
                    // 备用关闭逻辑
                    setTimeout(() => { window.location.href = "about:blank"; }, 500);
                }, CONFIG.closeDelay);
            }
        }, 800);
    }

    function showOverlay() {
        if(document.getElementById('auto-overlay')) return;
        const div = document.createElement('div');
        div.id = 'auto-overlay';
        div.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); color: white; z-index: 9999999;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            font-size: 20px; font-weight: bold;
        `;
        div.innerHTML = `<div>🚀 自动提交中...</div><div>(完成后窗口将自动关闭)</div>`;
        document.body.appendChild(div);
    }

    init();
})();