// ==UserScript==
// @name         SZU一键全自动评教助手
// @namespace    https://github.com/Liunian06/szu-evaluation-helper
// @version      10.1
// @description  【UI修复】解决了因面板注入导致XPath失效的问题。采用尾部注入+双重数据读取策略，确保进度条准确显示。
// @author       流年.
// @match        https://jxpj.szu.edu.cn/education-jxcp-weixin-html/Student/Student2/index.html*
// @match        https://jxpj.szu.edu.cn/education-jxcp-weixin-html/Student/Result2/Result.html*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553863/SZU%E4%B8%80%E9%94%AE%E5%85%A8%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553863/SZU%E4%B8%80%E9%94%AE%E5%85%A8%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局配置 ---
    const AUTO_MODE_KEY = 'SZU_AUTO_EVALUATION_MODE';
    const GITHUB_URL = 'https://github.com/Liunian06/szu-evaluation-helper';

    // --- 1. 双重弹窗拦截器 ---
    function injectInterceptor() {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                try {
                    const originalConfirm = window.confirm;
                    window.confirm = function(message) {
                        if (!message) return originalConfirm(message);
                        if (message.includes("所有评价都为A") || message.includes("返回评价页面修改")) return false;
                        if (message.includes("确认提交") || message.includes("是否提交")) return true;
                        return originalConfirm(message);
                    };
                    const originalAlert = window.alert;
                    window.alert = function(message) {
                        if (message && (message.includes("还能进行") || message.includes("次评价"))) return;
                        return originalAlert(message);
                    }
                } catch (e) { console.error(e); }
            })();
        `;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }
    injectInterceptor();

    // --- 2. 页面路由 ---
    function onDomReady() {
        const currentURL = window.location.href;
        if (currentURL.includes("Student/Student2/index.html")) {
            runListPageLogic();
        } else if (currentURL.includes("Student/Result2/Result.html")) {
            runEvaluationPageLogic();
        }
    }

    // --- 3. 课程列表页逻辑 ---
    function runListPageLogic() {
        console.log("【评教助手】列表页 UI 初始化...");
        const isAutoMode = sessionStorage.getItem(AUTO_MODE_KEY) === 'true';

        let globalDone = 0;
        let globalTodo = 0;
        let globalTotal = 0;

        // --- 构建顶部大面板 ---
        const panel = document.createElement('div');
        panel.id = 'szu-top-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <div class="title-area">
                    <span class="main-title">SZU 一键评教助手</span>
                    <a href="${GITHUB_URL}" target="_blank" class="github-link" title="访问 GitHub 仓库">
                        <svg height="20" viewBox="0 0 16 16" width="20" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                        <span>GitHub</span>
                    </a>
                </div>
            </div>

            <div class="panel-body">
                <div class="stat-container">
                    <div class="stat-box">
                        <div class="stat-label">已评课程</div>
                        <div class="stat-value finish" id="p-done">-</div>
                    </div>
                     <div class="stat-divider">/</div>
                    <div class="stat-box">
                        <div class="stat-label">未评课程</div>
                        <div class="stat-value remain" id="p-todo">-</div>
                    </div>
                </div>

                <div class="progress-container">
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text" id="p-percent">读取数据中...</div>
                </div>

                <button id="szu-action-btn" class="${isAutoMode ? 'running' : 'idle'}">
                    ${isAutoMode ? '⚡ 正在全自动运行中...' : '🚀 启动全自动评教'}
                </button>
            </div>
        `;

        // 【关键修复】使用 appendChild 插入到最后，不改变 body 前部的 DOM 结构
        // 这样 /html/body/div[1] 依然是网页原始内容
        document.body.appendChild(panel);

        // --- 数据读取 (双重保险) ---
        function getData() {
            // 策略1: CSS 选择器 (最稳，不受层级影响)
            try {
                const doneEl = document.querySelector('.eval-course-value');
                const todoEl = document.querySelector('.not-eval-course-value');
                if (doneEl && todoEl) {
                    return {
                        done: parseInt(doneEl.innerText.trim()),
                        todo: parseInt(todoEl.innerText.trim())
                    };
                }
            } catch(e) {}

            // 策略2: XPath (你提供的绝对路径，因 appendChild 而恢复有效)
            try {
                const getByPath = (path) => {
                    const r = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    return r.singleNodeValue ? parseInt(r.singleNodeValue.innerText.trim()) : null;
                };
                const doneVal = getByPath('/html/body/div[1]/div[3]/div[1]/div[2]/div[2]/div[1]');
                const todoVal = getByPath('/html/body/div[1]/div[3]/div[1]/div[2]/div[3]/div[1]');
                if (doneVal !== null && todoVal !== null) {
                    return { done: doneVal, todo: todoVal };
                }
            } catch(e) {}

            return null;
        }

        // 轮询更新 UI
        setInterval(() => {
            const data = getData();

            if (data) {
                globalDone = data.done;
                globalTodo = data.todo;
                globalTotal = globalDone + globalTodo;

                document.getElementById('p-done').innerText = globalDone;
                document.getElementById('p-todo').innerText = globalTodo;

                let percent = globalTotal > 0 ? Math.round((globalDone / globalTotal) * 100) : 100;
                document.querySelector('.progress-bar-fill').style.width = percent + '%';
                document.getElementById('p-percent').innerText = `当前进度: ${percent}%`;

                // 全部完成状态
                if (globalTodo === 0 && globalTotal > 0) {
                     document.querySelector('.progress-bar-fill').style.backgroundColor = '#4CAF50';
                     const btn = document.getElementById('szu-action-btn');
                     btn.className = 'finished';
                     btn.innerHTML = '🎉 所有课程评教已完成';
                     btn.disabled = true;
                }
            }
        }, 800);

        // 自动执行逻辑
        function processNextCourse() {
            if (globalTotal > 0 && globalTodo <= 0) {
                finishAll();
                return;
            }
            const courses = Array.from(document.querySelectorAll('.voite'));
            const targetBtn = courses.find(btn => btn.innerText.includes('点击评教'));

            if (targetBtn) {
                const btn = document.getElementById('szu-action-btn');
                btn.innerHTML = '⏳ 正在进入课程...';
                setTimeout(() => targetBtn.click(), 1000);
            } else if (globalTotal > 0) {
                // 有未评但找不到按钮，可能在翻页或者数据延迟
                // 这里不做强制结束，等待下一轮轮询
            }
        }

        function finishAll() {
            if (!isAutoMode) return;
            sessionStorage.removeItem(AUTO_MODE_KEY);
            alert(`恭喜！所有课程评教已完成！`);
            location.reload();
        }

        // 按钮交互
        document.getElementById('szu-action-btn').addEventListener('click', () => {
            if (!isAutoMode) {
                if (globalTotal === 0) { alert("正在读取课程数据，请稍等..."); return; }
                if (globalTodo === 0) { alert("太棒了，你已经没有未评课程了！"); return; }

                sessionStorage.setItem(AUTO_MODE_KEY, 'true');
                location.reload();
            } else {
                sessionStorage.removeItem(AUTO_MODE_KEY);
                location.reload();
            }
        });

        if (isAutoMode) setTimeout(processNextCourse, 2000);
    }

    // --- 4. 评教页逻辑 ---
    function runEvaluationPageLogic() {
        console.log("【评教助手】评教页逻辑...");
        const isAutoMode = sessionStorage.getItem(AUTO_MODE_KEY) === 'true';

        const statusApp = document.createElement('div');
        statusApp.style.cssText = `position:fixed; top:0; left:0; width:100%; height:40px; background:${isAutoMode ? '#FF9800' : '#2196F3'}; color:white; z-index:999999; display:flex; justify-content:center; align-items:center; font-weight:bold; box-shadow:0 2px 10px rgba(0,0,0,0.2);`;
        statusApp.innerHTML = isAutoMode ? '⚡ 全自动模式运行中：正在填写与提交...' : '👋 手动模式：请点击下方提交按钮';
        document.body.appendChild(statusApp); // 同样改为 appendChild

        if (isAutoMode) {
            setTimeout(() => {
                if (fillForm()) {
                    setTimeout(() => { submitForm(); waitForSuccessAndReturn(); }, 300);
                }
            }, 800);
        }
    }

    // --- 工具函数 ---
    function fillForm() {
        try {
            const firstOptions = document.querySelectorAll('.question-box ol.question-box-main > li[choice="choice1"]');
            firstOptions.forEach(option => option.click());
            const adviceTextarea = document.querySelector('textarea.advice-input');
            if (adviceTextarea) {
                adviceTextarea.value = '无';
                adviceTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
            return true;
        } catch (error) { return false; }
    }

    function submitForm() {
        const btn = document.getElementById('submitBtn');
        if (btn) btn.click();
    }

    function waitForSuccessAndReturn() {
        let timer = setInterval(() => {
            const closeBtn = document.querySelector('div.close-btn[jump-back="true"]');
            if (closeBtn) {
                clearInterval(timer);
                closeBtn.click();
            }
        }, 500);
    }

    // --- 5. 样式注入 ---
    GM_addStyle(`
        #szu-top-panel {
            position: fixed;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            width: 420px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow: hidden;
            animation: slideDown 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .panel-header {
            padding: 15px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .title-area {
            display: flex;
            align-items: center;
            gap: 15px;
            width: 100%;
            justify-content: space-between;
        }

        .main-title {
            font-size: 18px;
            font-weight: 700;
            color: #333;
            letter-spacing: -0.5px;
        }

        .github-link {
            display: flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            color: #666;
            font-size: 13px;
            font-weight: 500;
            padding: 4px 10px;
            border-radius: 20px;
            background: #fff;
            border: 1px solid #ddd;
            transition: all 0.2s;
        }
        .github-link:hover {
            background: #333;
            color: #fff;
            border-color: #333;
        }

        .panel-body {
            padding: 20px;
        }

        .stat-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 15px;
            gap: 20px;
        }

        .stat-box {
            text-align: center;
        }

        .stat-label {
            font-size: 12px;
            color: #888;
            margin-bottom: 4px;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 800;
            line-height: 1;
        }
        .stat-value.finish { color: #4CAF50; }
        .stat-value.remain { color: #F44336; }
        .stat-divider { font-size: 20px; color: #ddd; font-weight: 300; }

        .progress-container {
            margin-bottom: 20px;
        }
        .progress-bar-bg {
            height: 10px;
            background: #f0f0f0;
            border-radius: 5px;
            overflow: hidden;
        }
        .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            width: 0%;
            transition: width 0.5s ease;
            border-radius: 5px;
        }
        .progress-text {
            text-align: right;
            font-size: 12px;
            color: #999;
            margin-top: 5px;
        }

        #szu-action-btn {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.1s, box-shadow 0.2s;
        }

        #szu-action-btn.idle {
            background: linear-gradient(135deg, #3268F0 0%, #2196F3 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
        }
        #szu-action-btn.idle:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
        }

        #szu-action-btn.running {
            background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
            animation: pulse 1.5s infinite;
        }

        #szu-action-btn.finished {
            background: #E8F5E9;
            color: #4CAF50;
            cursor: default;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
        }

        @media (max-width: 600px) {
            #szu-top-panel { width: 90%; top: 10px; }
            .stat-value { font-size: 20px; }
        }
    `);

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onDomReady);
    else onDomReady();

})();
