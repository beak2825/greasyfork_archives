// ==UserScript==
// @name         北邮研究生教评助手
// @namespace    http://tampermonkey.net/
// @version      1.8.1
// @description  全自动评分，运行期间等待即可
// @author       Tukumij & Gemini
// @match        *://10.112.23.23/*
// @match        *://jw.bupt.edu.cn/*
// @match        *://webvpn.bupt.edu.cn/*
// @match        *://yjxt.bupt.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561656/%E5%8C%97%E9%82%AE%E7%A0%94%E7%A9%B6%E7%94%9F%E6%95%99%E8%AF%84%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561656/%E5%8C%97%E9%82%AE%E7%A0%94%E7%A9%B6%E7%94%9F%E6%95%99%E8%AF%84%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 【核心逻辑保持 v1.4】锁定主框架
    if (window.name !== 'PageFrame') return;

    // ================= 1. 新增：枚举与配置 =================
    const GRADES = {
        EXCELLENT: { label: "优秀", value: "100" },
        GOOD:      { label: "良好",  value: "80" },
        MEDIUM:    { label: "中等",  value: "70" },
        POOR:      { label: "较差",  value: "50" }
    };

    // 默认配置
    const DEFAULT_CONFIG = {
        score: GRADES.EXCELLENT.value, // 默认100
        submitWait: 500,
        closeWait: 500,
        stepDelay: 500
    };

    // 读取本地存储
    let savedScore = localStorage.getItem('bupt_eval_score');
    if (!savedScore) savedScore = DEFAULT_CONFIG.score;

    // 运行时配置
    const RUNTIME_CONFIG = {
        ...DEFAULT_CONFIG,
        score: savedScore
    };

    // 全局缓存变量
    let cachedTasks = null;
    let listWindowRef = null;

    // ================= UI 构建区域 =================
    const panel = document.createElement('div');
    panel.id = 'bupt-eval-panel';
    panel.style.cssText = `
        position: fixed;
        top: 40px;
        right: 20px;
        width: 250px;
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid #ccc;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 999999;
        border-radius: 6px;
        font-family: "Microsoft YaHei", sans-serif;
        font-size: 13px;
        color: #333;
    `;

    // --- Header ---
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 8px 10px;
        background: #0056b3;
        color: #fff;
        font-weight: bold;
        border-radius: 6px 6px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        user-select: none;
        height: 24px;
    `;

    const titleSpan = document.createElement('span');
    titleSpan.textContent = '🎓 教评助手';

    const controls = document.createElement('div');
    controls.style.cssText = 'display:flex; gap:12px; font-size:18px; line-height: 1; align-items: center; margin: 0 5px';

    // 【新增】设置按钮
    const settingsBtn = document.createElement('span');
    settingsBtn.textContent = '⚙️';
    settingsBtn.title = '设置评分等级';
    settingsBtn.style.cursor = 'pointer';
    settingsBtn.style.fontSize = '14px';

    const resetBtn = document.createElement('span');
    resetBtn.textContent = '↺';
    resetBtn.title = '清空缓存';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.fontWeight = 'bold';

    const minBtn = document.createElement('span');
    minBtn.id = 'bupt-minimize';
    minBtn.textContent = '−';
    minBtn.title = '最小化';
    minBtn.style.cursor = 'pointer';
    minBtn.style.fontWeight = 'bold';
    minBtn.style.transform = 'translateY(-1px)';

    controls.appendChild(settingsBtn); // 加入设置按钮
    controls.appendChild(resetBtn);
    controls.appendChild(minBtn);

    header.appendChild(titleSpan);
    header.appendChild(controls);
    panel.appendChild(header);

    // --- Body 容器 ---
    const body = document.createElement('div');
    body.style.cssText = 'padding: 10px; position: relative;';
    panel.appendChild(body);

    // ================== 视图 1: 主界面 (保持 v1.4 原样) ==================
    const viewMain = document.createElement('div');

    const logArea = document.createElement('div');
    logArea.id = 'bupt-log';
    logArea.style.cssText = `
        height: 140px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        padding: 6px;
        overflow-y: auto;
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 1.4;
        white-space: pre-wrap;
        color: #555;
    `;
    const welcomeMsg = '👋 已就绪 (PageFrame)。<br>请先点击“🔍 提取课程”。';
    logArea.innerHTML = welcomeMsg;
    viewMain.appendChild(logArea);

    const btnGroup = document.createElement('div');
    btnGroup.style.cssText = 'display: flex; gap: 8px;';

    const btnExtract = document.createElement('button');
    btnExtract.textContent = '🔍 提取';
    btnExtract.style.cssText = 'flex: 1; padding: 6px; cursor: pointer; background: #17a2b8; color: white; border: none; border-radius: 4px; font-weight:bold; font-size: 13px;';

    const btnStart = document.createElement('button');
    btnStart.textContent = '🚀 开始';
    btnStart.style.cssText = 'flex: 1; padding: 6px; cursor: pointer; background: #28a745; color: white; border: none; border-radius: 4px; font-weight:bold; font-size: 13px;';

    btnGroup.appendChild(btnExtract);
    btnGroup.appendChild(btnStart);
    viewMain.appendChild(btnGroup);

    body.appendChild(viewMain);

    // ================== 视图 2: 设置界面 (新增) ==================
    const viewSettings = document.createElement('div');
    viewSettings.style.cssText = `
        display: none;
        height: 178px;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 5px;
    `;

    // 评分下拉框
    const settingItem = document.createElement('div');
    settingItem.style.marginBottom = '15px';

    const labelGrade = document.createElement('div');
    labelGrade.textContent = '📝 目标分数:';
    labelGrade.style.fontWeight = 'bold';
    labelGrade.style.marginBottom = '5px';

    const selectGrade = document.createElement('select');
    selectGrade.style.cssText = 'width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #ccc;';

    for (let key in GRADES) {
        let option = document.createElement('option');
        option.value = GRADES[key].value;
        option.textContent = GRADES[key].label;
        if (RUNTIME_CONFIG.score === GRADES[key].value) {
            option.selected = true;
        }
        selectGrade.appendChild(option);
    }

    selectGrade.onchange = (e) => {
        RUNTIME_CONFIG.score = e.target.value;
        localStorage.setItem('bupt_eval_score', e.target.value);
        log(`⚙️ 设置已更新: ${e.target.options[e.target.selectedIndex].text}`, "purple");
    };

    settingItem.appendChild(labelGrade);
    settingItem.appendChild(selectGrade);
    viewSettings.appendChild(settingItem);

    const backBtn = document.createElement('button');
    backBtn.textContent = '🔙 返回';
    backBtn.style.cssText = 'width: 100%; padding: 8px; cursor: pointer; background: #6c757d; color: white; border: none; border-radius: 4px; margin-top: auto;';

    viewSettings.appendChild(backBtn);
    body.appendChild(viewSettings);

    document.body.appendChild(panel);


    // ================= 交互逻辑 =================

    // 视图切换
    settingsBtn.onclick = () => {
        viewMain.style.display = 'none';
        viewSettings.style.display = 'flex';
        settingsBtn.style.display = 'none'; // 隐藏本身
        resetBtn.style.display = 'none';
    };

    backBtn.onclick = () => {
        viewSettings.style.display = 'none';
        viewMain.style.display = 'block';
        settingsBtn.style.display = 'block';
        resetBtn.style.display = 'block';
    };

    // 拖拽逻辑 (保持 v1.4)
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - panel.offsetLeft;
        dragOffsetY = e.clientY - panel.offsetTop;
        header.style.cursor = 'grabbing';
        panel.style.right = 'auto';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            let newLeft = e.clientX - dragOffsetX;
            let newTop = e.clientY - dragOffsetY;
            const maxLeft = window.innerWidth - panel.offsetWidth;
            const maxTop = window.innerHeight - panel.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        header.style.cursor = 'move';
    });

    // 最小化
    let isMin = false;
    minBtn.onclick = () => {
        isMin = !isMin;
        body.style.display = isMin ? 'none' : 'block';
        minBtn.textContent = isMin ? '□' : '−';
    };

    // 重置
    resetBtn.onclick = () => {
        cachedTasks = null;
        listWindowRef = null;
        btnExtract.disabled = false;
        btnStart.disabled = false;
        btnStart.textContent = '🚀 开始';
        logArea.innerHTML = welcomeMsg;
        log("🧹 状态已重置。", "purple");
    };


    // ================= 核心辅助函数 (保持 v1.4 逻辑) =================
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function log(msg, color = 'black') {
        const time = new Date().toLocaleTimeString('en-US', {hour12: false});
        const div = document.createElement('div');
        div.innerHTML = `<span style="color:#bbb;margin-right:4px;font-size:10px;">${time}</span><span style="color:${color}">${msg}</span>`;
        logArea.appendChild(div);
        logArea.scrollTop = logArea.scrollHeight;
    }

    // 寻找包含课程列表的 Window
    function findListWindow(win) {
        try {
            if (win.document.getElementById("contentParent_dgData")) return win;
        } catch (e) {}
        for (let i = 0; i < win.frames.length; i++) {
            let res = findListWindow(win.frames[i]);
            if (res) return res;
        }
        return null;
    }

    // 全局寻找教评弹窗
    function findEvalFrame_Global(win) {
        try {
            let selects = win.document.getElementsByTagName("select");
            if (selects.length > 0) {
                for (let k = 0; k < selects[0].options.length; k++) {
                    // 【核心修改】这里改为动态匹配当前设置的分数，而不是写死100
                    if (selects[0].options[k].value === RUNTIME_CONFIG.score) return win;
                }
            }
        } catch (e) {}
        for (let i = 0; i < win.frames.length; i++) {
            let found = findEvalFrame_Global(win.frames[i]);
            if (found) return found;
        }
        return null;
    }

    // 关闭弹窗逻辑 (完全保持 v1.4)
    function closeDialog(contextWin) {
        try {
            let doc = contextWin.document || contextWin;
            let dialogTable = doc.querySelector("table.ui_state_visible");
            if (!dialogTable) {
                try {
                   if(contextWin.parent && contextWin.parent.document) {
                       dialogTable = contextWin.parent.document.querySelector("table.ui_state_visible");
                       doc = contextWin.parent.document;
                       contextWin = contextWin.parent;
                   }
                } catch(e){}
            }
            if (dialogTable) {
                let closeBtn = dialogTable.querySelector(".ui_close");
                if (closeBtn) {
                    let mouseEvent = doc.createEvent("MouseEvents");
                    mouseEvent.initMouseEvent("click", true, true, contextWin, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    closeBtn.dispatchEvent(mouseEvent);
                    log("      👉 关闭窗口 [×]", "#888");
                }
            }
        } catch (e) {}
    }


    // ================= 业务按钮逻辑 (核心是 img 查找) =================

    // ① 按钮一：提取课程
    btnExtract.onclick = function() {
        log("🔍 正在扫描...", "blue");

        listWindowRef = findListWindow(window) || window;
        let listDoc = listWindowRef.document;

        if (!listDoc.getElementById("contentParent_dgData")) {
            log("❌ 未检测到表格", "red");
            log("💡 路径:【其他】->【互动信息】->【教学评价信息管理】", "orange");
            return;
        }

        let tasks = [];
        // 【核心保留】完全使用 v1.4 的 edit.gif 查找逻辑，不改动
        let imgs = listDoc.getElementsByTagName("img");
        for (let img of imgs) {
            if (img.src.indexOf("edit.gif") !== -1) {
                let link = img.closest("a");
                if (link) tasks.push(link);
            }
        }

        if (tasks.length === 0) {
            log("🎉 任务已完成！", "green");
            cachedTasks = [];
        } else {
            cachedTasks = tasks;
            log(`✅ 发现 ${tasks.length} 门未评课程`, "green");
        }
    };

    // ② 按钮二：一键教评
    btnStart.onclick = async function() {
        if (cachedTasks === null) {
            log("⚠️ 请先点击“提取”", "orange");
            return;
        }

        if (cachedTasks.length === 0) {
            log("🎉 无需操作", "green");
            return;
        }

        btnExtract.disabled = true;
        btnStart.disabled = true;
        btnStart.textContent = "运行中...";

        // 【核心修改】使用变量代替写死的 100
        const TARGET_SCORE = RUNTIME_CONFIG.score;
        log(`🚀 开始处理... 目标: ${TARGET_SCORE}分`, "blue");

        for (let i = 0; i < cachedTasks.length; i++) {
            if (cachedTasks === null) return;

            let taskLink = cachedTasks[i];
            log(`\n🔵 [${i + 1}/${cachedTasks.length}] 处理中...`, "black");

            // A. 点击
            try {
                taskLink.click();
            } catch (e) {
                log("   ❌ 点击失败", "red");
                continue;
            }

            // B. 雷达扫描
            let targetFrameWin = null;
            let maxRetries = 50;
            while (maxRetries > 0) {
                if (cachedTasks === null) return;
                await sleep(200);
                targetFrameWin = findEvalFrame_Global(window.top);
                if (targetFrameWin && targetFrameWin.location.href !== "about:blank") break;
                maxRetries--;
            }

            if (!targetFrameWin) {
                log("   ❌ 加载超时", "red");
                closeDialog(listWindowRef);
                continue;
            }

            // C. 填表与提交
            try {
                let doc = targetFrameWin.document;

                // 全选
                let selects = doc.getElementsByTagName("select");
                let count = 0;
                for (let s of selects) {
                    let hasTarget = false;
                    for(let op of s.options) {
                        // 【核心修改】匹配动态分数
                        if(op.value === TARGET_SCORE) {
                            s.value = TARGET_SCORE;
                            hasTarget = true; break;
                        }
                    }
                    if(hasTarget) {
                        let evt = doc.createEvent("HTMLEvents");
                        evt.initEvent("change", true, true);
                        s.dispatchEvent(evt);
                        count++;
                    }
                }
                log(`   📝 已评 ${count} 项`, "#666");

                // 提交
                let submitBtn = null;
                let links = doc.getElementsByTagName("a");
                for (let a of links) {
                    if (a.innerText.replace(/\s/g, "") === "提交") { submitBtn = a; break; }
                }
                if(!submitBtn) {
                     let spans = doc.getElementsByTagName("span");
                     for(let s of spans) if(s.innerText.replace(/\s/g,"")==="提交") { submitBtn = s.parentNode; break; }
                }

                if (submitBtn) {
                    targetFrameWin.confirm = () => true;
                    targetFrameWin.alert = () => true;
                    submitBtn.click();
                    log(`   🚀 已提交...`, "blue");
                    await sleep(RUNTIME_CONFIG.submitWait);
                } else {
                    log("   ⚠️ 无提交按钮", "orange");
                }

            } catch (err) {
                log("   ❌ 出错: " + err.message, "red");
            }

            // D. 关闭
            try {
                if (targetFrameWin && targetFrameWin.parent) closeDialog(targetFrameWin.parent);
                else closeDialog(listWindowRef);
            } catch(e) { closeDialog(listWindowRef); }

            try { if(targetFrameWin) targetFrameWin.location.href = "about:blank"; } catch(e) {}

            await sleep(RUNTIME_CONFIG.closeWait);
            await sleep(RUNTIME_CONFIG.stepDelay);
        }

        if (cachedTasks !== null) {
            log("\n🎉 全部完成！", "green");
            alert("自动化评教完成！");
            btnExtract.disabled = false;
            btnStart.disabled = false;
            btnStart.textContent = '🚀 开始';
        }
    };

})();