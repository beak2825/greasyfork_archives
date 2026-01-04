// ==UserScript==
// @name         宁夏医科大学-教评自动助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  适配宁夏医科大学教评系统（Vue框架）。支持一键全自动：自动进入评价、自动全选5分（随机扣除一项为4分以防雷）、自动选择“无”旷课、自动填评语、自动提交、自动循环处理下一门课程。解放双手，拒绝无意义机械劳动。
// @author       newhungso & Gemini
// @match        https://jxzlbz.nxmu.edu.cn/zcdth/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559380/%E5%AE%81%E5%A4%8F%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6-%E6%95%99%E8%AF%84%E8%87%AA%E5%8A%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559380/%E5%AE%81%E5%A4%8F%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6-%E6%95%99%E8%AF%84%E8%87%AA%E5%8A%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================================================
    // 🔧 用户配置区域 (可以根据需要修改)
    // ==========================================================================
    const COMMENT_TEXT = "老师讲课生动，重点突出，非常有收获！"; // 默认好评语
    const MONITOR_INTERVAL = 3000; // 操作间隔时间(毫秒)，建议3000ms(3秒)以防网络卡顿
    // ==========================================================================

    // 状态标记
    let isRunning = false;
    let hasFilledCurrent = false;

    // --- 界面 UI：创建控制面板 ---
    function createPanel() {
        // 防止重复创建
        if (document.getElementById('nxmu-eval-panel')) return;

        const div = document.createElement("div");
        div.id = 'nxmu-eval-panel';
        div.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 99999;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            text-align: center;
            border: 1px solid #ddd;
            font-family: sans-serif;
            min-width: 150px;
        `;

        const title = document.createElement("div");
        title.innerText = "🤖 教评自动助手";
        title.style.cssText = "font-weight:bold; margin-bottom:10px; color:#333; font-size:14px;";

        const btn = document.createElement("button");
        btn.innerText = "▶️ 启动循环";
        btn.id = "start-loop-btn";
        btn.style.cssText = `
            padding: 8px 15px;
            background-color: #67C23A;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        `;

        const status = document.createElement("div");
        status.id = "eval-status";
        status.innerText = "准备就绪";
        status.style.cssText = "margin-top:10px; font-size:12px; color:#666;";

        const footer = document.createElement("div");
        footer.innerHTML = "<span style='font-size:10px; color:#999;'>By 欧金金 & Gemini</span>";
        footer.style.marginTop = "8px";

        btn.onclick = () => {
            if (!isRunning) {
                isRunning = true;
                btn.innerText = "⏸️ 停止脚本";
                btn.style.backgroundColor = "#F56C6C";
                updateStatus("脚本运行中...");
                mainLoop(); // 启动循环
            } else {
                isRunning = false;
                btn.innerText = "▶️ 启动循环";
                btn.style.backgroundColor = "#67C23A";
                updateStatus("已暂停");
            }
        };

        div.appendChild(title);
        div.appendChild(btn);
        div.appendChild(status);
        div.appendChild(footer);
        document.body.appendChild(div);
    }

    function updateStatus(text) {
        const el = document.getElementById("eval-status");
        if (el) el.innerText = text;
    }

    // --- 核心逻辑 1：Vue输入框事件触发器 ---
    function triggerInput(el, val) {
        if (!el) return;
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // --- 核心逻辑 2：填表与提交 ---
    function doFillAndSubmit() {
        console.log("正在执行填表...");
        updateStatus("正在填写表格...");

        // 1. 获取所有单选标签
        const labels = Array.from(document.querySelectorAll('.el-radio__label'));
        
        // 2. 分类筛选
        const bestOptions = labels.filter(el => el.innerText.trim() === "非常认同"); // 5分
        const goodOptions = labels.filter(el => el.innerText.trim() === "认同");     // 4分
        const noneOptions = labels.filter(el => el.innerText.trim() === "无");       // 旷课次数

        // 3. 执行点击
        // (A) 全选5分
        bestOptions.forEach(opt => opt.click());
        // (B) 选“无”
        noneOptions.forEach(opt => opt.click());
        // (C) 随机一个改为4分 (防雷)
        if (goodOptions.length > 0) {
            const randomIdx = Math.floor(Math.random() * goodOptions.length);
            goodOptions[randomIdx].click();
        }

        // 4. 写评语
        const textarea = document.querySelector('textarea');
        if (textarea) {
            triggerInput(textarea, COMMENT_TEXT);
        }

        // 5. 提交操作
        // 寻找包含“提交”文字的按钮
        const spans = Array.from(document.querySelectorAll('span'));
        const submitSpan = spans.find(el => el.innerText.trim() === "提交");
        
        if (submitSpan) {
            updateStatus("填写完毕，即将提交...");
            setTimeout(() => {
                // 尝试点击 span 或其父级 button
                submitSpan.click();
                if(submitSpan.parentElement) submitSpan.parentElement.click();
                
                hasFilledCurrent = false; // 重置填写标记，准备下一次
                console.log("已点击提交");
            }, 1000);
        } else {
            updateStatus("⚠️ 错误：未找到提交按钮");
        }
    }

    // --- 核心逻辑 3：在列表页寻找未评价课程 ---
    function findAndEnterNextCourse() {
        updateStatus("正在寻找未评价课程...");
        
        // 1. 找到所有“未评价”标签
        const wpjTags = Array.from(document.querySelectorAll('.wpj'));
        const unfinishedTag = wpjTags.find(el => el.innerText.trim() === "未评价");

        if (!unfinishedTag) {
            // 没有找到“未评价”，说明全部搞定
            isRunning = false;
            updateStatus("🎉 全部完成！");
            alert("恭喜！所有课程评价已完成。\n脚本已自动停止。");
            const btn = document.getElementById("start-loop-btn");
            if(btn) {
                btn.innerText = "✅ 全部完成";
                btn.disabled = true;
                btn.style.backgroundColor = "#909399";
            }
            return;
        }

        // 2. 找到对应的“评价”按钮并点击
        const row = unfinishedTag.closest('tr');
        if (row) {
            const evalBtn = row.querySelector('.btn_theme');
            if (evalBtn && evalBtn.innerText.includes("评价")) {
                console.log("进入下一门课程...");
                evalBtn.click();
            } else {
                updateStatus("⚠️ 异常：找到未评价但无按钮");
            }
        }
    }

    // --- 核心逻辑 4：主循环心跳 ---
    function mainLoop() {
        if (!isRunning) return;

        // 判断当前是在“填表弹窗”还是“列表页面”
        // 依据：页面上是否存在可见的“提交”按钮
        const allSpans = Array.from(document.querySelectorAll('span'));
        // offsetParent !== null 用于判断元素是否在屏幕上可见
        const submitBtnExists = allSpans.some(el => el.innerText.trim() === "提交" && el.offsetParent !== null);

        if (submitBtnExists) {
            // ---> 场景A：弹窗已打开
            if (!hasFilledCurrent) {
                hasFilledCurrent = true; // 锁定，防止重复填
                // 延迟一下，确保弹窗动画加载完
                setTimeout(doFillAndSubmit, 1000);
            }
        } else {
            // ---> 场景B：在列表页 (或弹窗已关闭)
            hasFilledCurrent = false; // 解锁
            findAndEnterNextCourse();
        }

        // 设定下一次心跳检查
        setTimeout(mainLoop, MONITOR_INTERVAL);
    }

    // --- 启动入口 ---
    window.addEventListener('load', createPanel);
    // 兜底：防止 load 事件未触发
    setTimeout(createPanel, 1500);

})();