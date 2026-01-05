// ==UserScript==
// @name         人大本科教务系统自动评教 (RUC Auto Eval)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动遍历课程列表，对所有单选评价自动选A，跳过文本输入，自动提交。适用于中国人民大学教务系统。
// @author       Gemini & You
// @match        https://jw.ruc.edu.cn/Njw2017/*
// @icon         https://jw.ruc.edu.cn/Njw2017/logo.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558706/%E4%BA%BA%E5%A4%A7%E6%9C%AC%E7%A7%91%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%20%28RUC%20Auto%20Eval%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558706/%E4%BA%BA%E5%A4%A7%E6%9C%AC%E7%A7%91%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%20%28RUC%20Auto%20Eval%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 辅助函数：延时等待
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 主逻辑函数
    async function startEvaluation() {
        if (!confirm("⚠️ 警告：\n1. 脚本将自动为所有课程选A。\n2. 脚本将跳过主观文字填写。\n3. 请勿在脚本运行时操作鼠标。\n\n是否继续？")) {
            return;
        }

        const log = (msg) => {
            console.log(`[自动评教] ${msg}`);
            // 可选：在页面上显示状态
            const btn = document.getElementById('ruc-auto-eval-btn');
            if(btn) btn.innerText = msg;
        };

        log("正在扫描课程列表...");

        // 查找所有“进入评价”或“评价”按钮
        // 过滤掉不可见的或者是其他的按钮
        let allButtons = Array.from(document.querySelectorAll('.el-table__body button'));
        let courseButtons = allButtons.filter(btn => {
            let t = btn.innerText.trim();
            // 确保按钮是可见的
            return (t === "评价" || t === "进入评价") && btn.offsetParent !== null;
        });

        if (courseButtons.length === 0) {
            alert("❌ 未找到任何【评价】按钮！\n请确保你已经点开了“学生教学评价”标签页，并且表格已经加载完毕。");
            log("未找到课程，请刷新页面重试。");
            return;
        }

        log(`检测到 ${courseButtons.length} 门课程，开始处理...`);

        for (let i = 0; i < courseButtons.length; i++) {
            // 重新获取按钮引用，防止DOM刷新导致引用失效
            allButtons = Array.from(document.querySelectorAll('.el-table__body button'));
            courseButtons = allButtons.filter(btn => {
                let t = btn.innerText.trim();
                return (t === "评价" || t === "进入评价") && btn.offsetParent !== null;
            });

            if (!courseButtons[i]) {
                log("队列中途发生变化，停止脚本以防误操作。");
                break;
            }

            let btn = courseButtons[i];
            log(`正在处理第 ${i + 1}/${courseButtons.length} 门课程...`);

            // 1. 点击评价按钮
            btn.click();
            await sleep(2000); // 等待弹窗完全加载

            // 2. 寻找当前最顶层的对话框 (z-index 最大的)
            // Element UI 的 Dialog 可能会生成多个，我们需要找当前显示的那个
            let dialogs = Array.from(document.querySelectorAll('.el-dialog__wrapper'));
            let activeDialog = dialogs.find(d => d.style.display !== 'none') || document.body;

            // 3. 执行全选 A
            let radioLabels = activeDialog.querySelectorAll('.el-radio__label');
            let clickedCount = 0;
            radioLabels.forEach(label => {
                let text = label.innerText.trim();
                // 匹配 "A." 或 "A " 或 "非常满意" (视具体情况调整)
                if (text.startsWith("A.") || text.startsWith("A ") || text.includes("非常满意")) {
                    // 模拟点击 label 触发选中
                    label.click();
                    clickedCount++;
                }
            });
            log(`已选中 ${clickedCount} 个 A 选项`);

            // 4. 跳过文字填写 (保持为空)
            // 如果你需要填字，解开下面这行注释：
            // fillText(activeDialog);

            // 5. 点击保存/提交
            // 优先找“提交”，没有则找“保存”
            let footerButtons = activeDialog.querySelectorAll('.el-dialog__footer button');
            let actionBtn = Array.from(footerButtons).find(b => b.innerText.trim().includes("提交")) ||
                            Array.from(footerButtons).find(b => b.innerText.trim().includes("保存"));

            if (actionBtn) {
                // 判断按钮是否被禁用
                if (!actionBtn.disabled) {
                    actionBtn.click();
                    log("点击了提交/保存");
                    await sleep(1000);

                    // 处理可能的“确认提交”二次弹窗 (Confirm)
                    let confirmBtn = document.querySelector('.el-message-box__btns .el-button--primary');
                    if (confirmBtn) {
                        confirmBtn.click();
                        log("点击了二次确认");
                        await sleep(1000);
                    }
                } else {
                    log("⚠️ 提交按钮被禁用，可能未完成所有必填项。");
                }
            } else {
                log("⚠️ 未找到提交按钮，尝试点击主按钮...");
                let primaryBtn = activeDialog.querySelector('.el-dialog__footer .el-button--primary');
                if(primaryBtn) primaryBtn.click();
            }

            // 等待请求结束
            await sleep(2000);

            // 6. 强制关闭窗口（确保能进行下一个）
            // 如果提交成功，窗口通常会自动关闭，但为了保险，尝试点击右上角关闭
            let closeBtn = activeDialog.querySelector('.el-dialog__headerbtn');
            if (closeBtn && activeDialog.style.display !== 'none') {
                closeBtn.click();
                log("手动关闭窗口");
            }

            await sleep(1500); // 等待列表刷新
        }

        alert("✅ 所有课程评价处理完毕！");
        const btn = document.getElementById('ruc-auto-eval-btn');
        if(btn) btn.innerText = '▶ 开始全自动评教';
    }

    // 填充文字的辅助函数（默认不调用）
    function fillText(context) {
        let textareas = context.querySelectorAll('textarea.el-textarea__inner');
        textareas.forEach(textarea => {
            if (textarea.value.trim() === "") {
                textarea.value = "无"; // 填个字防止必填校验
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }

    // 添加UI按钮
    function addGuiButton() {
        if (document.getElementById('ruc-auto-eval-btn')) return;

        let btn = document.createElement('button');
        btn.id = 'ruc-auto-eval-btn';
        btn.innerText = '▶ 开始全自动评教';
        btn.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 99999;
            padding: 10px 15px;
            background-color: #AE0C2A; /* 人大红 */
            color: white;
            font-size: 14px;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            transition: background 0.3s;
        `;
        btn.onmouseover = () => { btn.style.backgroundColor = '#d92546'; };
        btn.onmouseout = () => { btn.style.backgroundColor = '#AE0C2A'; };
        btn.onclick = startEvaluation;

        document.body.appendChild(btn);
    }

    // 页面加载完成后添加按钮
    // 由于是 Vue 单页应用，使用定时器检查 URL 变化或 DOM 加载
    window.addEventListener('load', () => {
        // 延迟一点显示，确保页面框架加载
        setTimeout(addGuiButton, 2000);
    });

    // 针对路由变化的额外检查（防止切换 Tab 后按钮消失）
    setInterval(() => {
        if (window.location.href.includes('student-teaching-evaluate')) {
            addGuiButton();
        }
    }, 3000);

})();