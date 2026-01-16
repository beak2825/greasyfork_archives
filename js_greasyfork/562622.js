// ==UserScript==
// @name         西北大学自动评教
// @namespace    http://tampermonkey.net/
// @version      9.3
// @description  专为西北大学（NWU）正方教务系统设计的自动评教工具。功能包括：一键自动填充 100 分、自动填写好评评语、绕过“脚本注入”检测、并且在填写完成后自动保存（不提交）。
// @author       Taffy
// @match        *://jwgl.nwu.edu.cn/jwglxt/*
// @grant        none
// @run-at       document-end
// @allFrames    true
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562622/%E8%A5%BF%E5%8C%97%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/562622/%E8%A5%BF%E5%8C%97%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        interval: 3500, // 3.5秒间隔
        comments: [
            "老师教学认真，重点突出，课堂氛围好。",
            "课程内容充实，老师讲解细致，收获很大。",
            "教学方式灵活，能够调动学生积极性。",
            "老师治学严谨，对学生负责。"
        ]
    };

    const getJQ = () => window.jQuery || (window.parent && window.parent.jQuery);
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const getRandomComment = () => CONFIG.comments[Math.floor(Math.random() * CONFIG.comments.length)];

    // --- 核心技术 1: 使用 execCommand 模拟原生输入 (绕过注入检测) ---
    async function nativeInsert(element, value) {
        if (!element) return;
        element.focus();
        element.click();
        await sleep(50);
        
        // 选中内容
        if (element.select) {
            element.select();
        } else {
            const range = document.createRange();
            range.selectNodeContents(element);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        await sleep(50);

        // 核心：调用浏览器原生指令
        const success = document.execCommand('insertText', false, value);

        // 失败回退逻辑
        if (!success) {
            const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            const prototype = Object.getPrototypeOf(element);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value").set;
            if (valueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(element, value);
            } else {
                valueSetter.call(element, value);
            }
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }

        await sleep(20);
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // --- 核心技术 2: 模拟带坐标的真实鼠标点击 ---
    function simulateMouseClick(element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const x = rect.left + (rect.width / 2);
        const y = rect.top + (rect.height / 2);

        const eventOpts = {
            bubbles: true, cancelable: true, view: window,
            clientX: x, clientY: y
        };

        element.dispatchEvent(new MouseEvent('mouseover', eventOpts));
        element.dispatchEvent(new MouseEvent('mousedown', eventOpts));
        element.dispatchEvent(new MouseEvent('mouseup', eventOpts));
        element.dispatchEvent(new MouseEvent('click', eventOpts));
    }

    // --- 界面注入 (修改为全局悬浮) ---
    function injectUI() {
        // 防止重复添加
        if (document.getElementById('nwu-auto-btn-v93')) return;

        const btnContainer = document.createElement('div');
        btnContainer.id = 'nwu-auto-btn-v93';
        
        // 修改：固定定位在屏幕右侧，层级最高
        btnContainer.style.cssText = `
            position: fixed; 
            top: 120px; 
            right: 20px; 
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        `;
        
        btnContainer.innerHTML = `
            <button id="btn-start-v93" style="
                background: linear-gradient(135deg, #0984e3, #74b9ff); 
                color: white; border: none; 
                padding: 10px 20px; border-radius: 30px; font-weight: bold; 
                cursor: pointer; font-size: 14px; 
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                🚀 自动评价
            </button>
            <span id="auto-status" style="
                margin-top: 5px; 
                color: #0984e3; 
                font-weight: bold; 
                font-size: 12px; 
                background: rgba(255,255,255,0.9);
                padding: 2px 8px;
                border-radius: 4px;
                display: none;
            "></span>
        `;
        
        // 挂载到 body，确保任何页面都能显示
        document.body.appendChild(btnContainer);
        document.getElementById('btn-start-v93').onclick = startAutomation;
    }

    // --- 处理单门课程 ---
    async function processCourse(row, index, total) {
        if (!row) return false;
        const $ = getJQ();
        const statusSpan = document.getElementById('auto-status');
        statusSpan.style.display = 'block';
        
        // A. 点击课程
        statusSpan.innerText = `处理中: ${index+1}/${total}`;
        simulateMouseClick(row); 
        
        // B. 等待加载
        let retry = 0;
        while(document.querySelectorAll("input.input-pjf").length === 0) {
            await sleep(500);
            retry++;
            if(retry > 20) {
                simulateMouseClick(row); // 重试点击
                await sleep(1000);
                if(document.querySelectorAll("input.input-pjf").length === 0) return false;
            }
        }
        await sleep(800); 

        // C. 填分
        const inputs = document.querySelectorAll("input.input-pjf");
        for (const input of inputs) {
            await nativeInsert(input, "100");
            await sleep(50); 
        }

        // D. 评语
        const txt = document.querySelector("textarea[name='py']");
        if(txt) await nativeInsert(txt, getRandomComment());

        await sleep(1000); 

        // E. 保存
        const saveBtn = document.getElementById("btn_xspj_bc");
        if(saveBtn) {
            statusSpan.innerText = `保存中...`;
            simulateMouseClick(saveBtn); 
            
            // F. 弹窗处理
            for(let i=0; i<15; i++) {
                await sleep(800);
                let okBtn = document.querySelector(".bootbox .btn-primary") || 
                            document.querySelector("button[data-bb-handler='ok']");
                if(okBtn) {
                    simulateMouseClick(okBtn);
                    await sleep(1000);
                    break;
                }
            }
        }
        return true;
    }

    // --- 主循环 ---
    async function startAutomation() {
        const $ = getJQ();
        if(!$) { alert("错误：页面未完全加载，请稍后点击。"); return; }
        
        // 修改：增加环境检测，防止在错误的页面运行
        const listGrid = $("#tempGrid");
        if (listGrid.length === 0) {
            alert("⚠️ 未检测到课程列表！\n\n脚本已就绪，但请您先进入【教学评价】->【学生评价】页面，\n然后再点击此按钮开始运行。");
            return;
        }

        const msg = "准备开始全自动评教？\n\n" +
                    "⚠️ 注意事项：\n" +
                    "1. 请勿触碰鼠标。\n" +
                    "2. 脚本将自动填充100分并填写好评。\n" +
                    "3. 脚本只执行【保存】，请最后手动【提交】。\n\n" +
                    "点击【确定】开始运行。";

        if(!confirm(msg)) return;

        const btn = document.getElementById('btn-start-v93');
        btn.disabled = true;
        btn.style.background = "#b2bec3";
        btn.innerText = "运行中...";

        // 1. 获取总行数
        const totalRows = listGrid.find("tr.jqgrow").length;
        
        // 2. 动态循环
        for (let i = 0; i < totalRows; i++) {
            const $freshRows = $("#tempGrid").find("tr.jqgrow");
            const $targetRow = $freshRows.eq(i);
            const targetRowDom = $targetRow[0];
            
            const status = $targetRow.find("td[aria-describedby='tempGrid_tjztmc']").text();
            
            if (status.indexOf("已评完") === -1 && status.indexOf("提交") === -1) {
                await processCourse(targetRowDom, i, totalRows);
                await sleep(CONFIG.interval);
            }
        }

        document.getElementById('auto-status').innerText = "✅ 完成";
        alert("🎉 全部处理完毕！\n请检查列表并手动提交。");
        btn.disabled = false;
        btn.style.background = "linear-gradient(135deg, #0984e3, #74b9ff)";
        btn.innerText = "🚀 自动评价";
    }

    // 启动检测 (1秒后尝试注入，每秒检查一次)
    setInterval(injectUI, 1000);

})();