// ==UserScript==
// @name         河大教务自动化评教
// @namespace    https://github.com/luanyufei/HBU-Evaluation-helper
// @version      1.0
// @description  适配河北大学WebVPN，拟人化填分，智能重试机制解决倒计时不同步问题，自动循环。
// @author       Alan NOON
// @match        https://v.hbu.cn/*/student/teachingEvaluation/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561393/%E6%B2%B3%E5%A4%A7%E6%95%99%E5%8A%A1%E8%87%AA%E5%8A%A8%E5%8C%96%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/561393/%E6%B2%B3%E5%A4%A7%E6%95%99%E5%8A%A1%E8%87%AA%E5%8A%A8%E5%8C%96%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 🔧 配置区域 🔧 ---
    const TARGET_SCORE = "10";
    const BASE_WAIT_SECONDS = 63; // 基础等待时间，设为63秒比较稳

    const comments = [
        "老师教学认真，课堂气氛活跃，收获很大。",
        "课程内容充实，老师讲解清晰，非常满意。",
        "老师治学严谨，要求严格，能深入浅出地进行教学。",
        "教学内容丰富，理论联系实际，激发了我的学习兴趣。",
        "老师备课充分，讲解精辟，重点突出，善于调动课堂气氛。"
    ];

    // --- 🛠 工具函数 🛠 ---

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const randomTime = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    // UI 提示框
    function showStatus(text, color = "lime", blink = false) {
        let box = document.getElementById("hbu-helper-box");
        if (!box) {
            box = document.createElement("div");
            box.id = "hbu-helper-box";
            box.style.cssText = `
                position: fixed; top: 10px; right: 10px; z-index: 99999;
                padding: 12px 20px; background-color: rgba(0,0,0,0.85);
                color: white; border-radius: 8px; font-size: 14px;
                font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s;
                max-width: 300px; line-height: 1.5;
            `;
            document.body.appendChild(box);
        }
        box.style.color = color;
        box.innerHTML = text;
        
        if (blink) {
            box.style.border = "2px solid red";
        } else {
            box.style.border = "1px solid rgba(255,255,255,0.2)";
        }
    }

    // 监听页面可见性，提示用户
    document.addEventListener("visibilitychange", function() {
        if (document.hidden) {
            // 用户切走了，这里只改标题，不改UI（因为看不见），但可以在console记录
            document.title = "⚠️请切回评教页面！";
        } else {
            document.title = "自动评教中...";
        }
    });

    // 触发事件
    function triggerEvents(element) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // 模拟输入
    function setInputValue(element, value) {
        element.focus();
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(element, value);
        } else {
            element.value = value;
        }
        triggerEvents(element);
    }

    // --- 🎮 业务逻辑 🎮 ---

    // 1. 列表页逻辑
    function handleListPage() {
        showStatus("正在扫描未评教课程...", "yellow");
        const tbody = document.getElementById("jxpgtbody");
        if (!tbody) return;

        const rows = tbody.getElementsByTagName("tr");
        let found = false;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.getElementsByTagName("td");
            const status = cells[cells.length - 1].innerText.trim();
            const btn = cells[0].querySelector("button");

            if (status === "否" && btn) {
                showStatus(`发现目标 (第${i+1}行)，准备进入...`, "#00ff00");
                found = true;
                setTimeout(() => { btn.click(); }, 1000);
                break;
            }
        }

        if (!found) {
            showStatus("🎉 恭喜！所有课程评教已完成。", "#00ff00");
            alert("所有课程已评完！");
        }
    }

    // 2. 详情页逻辑
    async function handleDetailPage() {
        // 初始化提示
        showStatus("⚠️ 请保持窗口在前台！<br>切出页面可能导致计时暂停。", "orange");
        
        let timeLeft = BASE_WAIT_SECONDS;
        const submitBtn = document.getElementById("buttonSubmit");

        // --- ⏳ 启动倒计时 ---
        const timerInterval = setInterval(() => {
            // 检测页面是否在后台
            let bgWarning = document.hidden ? "<br>(页面在后台，计时可能不准)" : "";
            let color = document.hidden ? "red" : "orange";

            if (timeLeft > 0) {
                // 回马枪逻辑
                if (timeLeft === 30) {
                    performMidwayCorrection();
                }
                showStatus(`拟人填表中... 倒计时：${timeLeft} 秒${bgWarning}<br>⚠️ 请勿关闭或切换窗口`, color, document.hidden);
                timeLeft--;
            } else {
                clearInterval(timerInterval);
                // 进入重试提交模式
                startSubmitLoop(submitBtn);
            }
        }, 1000);

        // --- 🐢 慢速填分 ---
        const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => !i.readOnly && !i.disabled && i.style.display !== 'none');
        
        for (let i = 0; i < inputs.length; i++) {
            if(document.hidden) await sleep(2000); // 如果在后台，填得更慢一点
            else await sleep(randomTime(500, 1500));
            
            setInputValue(inputs[i], TARGET_SCORE);
        }

        // --- ✍️ 填评语 ---
        await sleep(1000);
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            const comment = comments[Math.floor(Math.random() * comments.length)];
            textarea.focus();
            textarea.value = comment;
            triggerEvents(textarea);
        });
    }

    // 3. 中途修正 (保持原样，这招很管用)
    async function performMidwayCorrection() {
        if(document.hidden) return; // 如果在后台就不操作了，省的出错
        
        const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => !i.readOnly && !i.disabled);
        if (inputs.length > 0) {
            const lastInput = inputs[inputs.length - 1];
            lastInput.focus();
            lastInput.value = ""; 
            triggerEvents(lastInput);
            await sleep(500);
            lastInput.value = TARGET_SCORE;
            triggerEvents(lastInput);
        }

        const textarea = document.querySelector('textarea');
        if (textarea) {
            const originalVal = textarea.value;
            textarea.focus();
            textarea.value = originalVal.slice(0, -1);
            triggerEvents(textarea);
            await sleep(600);
            textarea.value = originalVal.endsWith("。") ? originalVal : originalVal + "。";
            triggerEvents(textarea);
        }
    }

    // 4. 智能提交重试循环
    function startSubmitLoop(btn) {
        if (!btn) {
            showStatus("❌ 错误：未找到提交按钮", "red");
            return;
        }

        // 屏蔽弹窗
        window.confirm = () => true;
        window.alert = () => true;

        let retryCount = 0;
        const maxRetries = 10; // 最多尝试10次（每次间隔5秒，共50秒宽限期）

        // 定义单次提交动作
        const trySubmit = () => {
            showStatus(`⏳ 正在提交... (第 ${retryCount + 1} 次尝试)`, "#00ff00");
            btn.click();
            
            // 点击 Layer 弹窗
            setTimeout(() => {
                const layerBtn = document.querySelector('.layui-layer-btn0');
                if (layerBtn) layerBtn.click();
            }, 500);
        };

        // 立即尝试第一次
        trySubmit();

        // 启动循环检测
        const checkInterval = setInterval(() => {
            // 检测是否已跳转（通过URL变化或页面元素不存在了来判断）
            // 简单判断：如果倒计时UI框还在，且URL包含 evaluationPage，说明还在原页面，提交失败了
            const box = document.getElementById("hbu-helper-box");
            const isStillOnPage = window.location.href.indexOf("evaluationPage") !== -1;

            if (isStillOnPage && box) {
                // 还在当前页，说明失败
                retryCount++;
                if (retryCount >= maxRetries) {
                    clearInterval(checkInterval);
                    showStatus("❌ 多次提交失败！<br>请手动点击提交，或检查网络。", "red", true);
                } else {
                    showStatus(`⚠️ 提交未成功（可能时间未到），5秒后重试...<br>Retry: ${retryCount}/${maxRetries}`, "orange");
                    // 重新触发点击
                    trySubmit();
                }
            } else {
                // 页面已跳转，或者UI没了，说明成功了
                clearInterval(checkInterval);
                console.log("提交成功，循环结束");
            }
        }, 5000); // 每5秒检查一次
    }

    // --- 🚀 入口 ---
    const currentURL = window.location.href;
    if (currentURL.indexOf("evaluation/index") !== -1) {
        setTimeout(handleListPage, 2000);
    } else {
        handleDetailPage(); 
    }

})();