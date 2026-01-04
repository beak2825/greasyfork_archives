// ==UserScript==
// @name         嘉应学院教务集群评教机器人 (v3.2 结构化录入版)
// @namespace    http://tampermonkey.net/
// @version      v3.2
// @description  独立输入框录入 | 动态增删账号 | 彻底解决格式错误 | 全自动接力
// @author       jyu计算机23-Vfishing
// @match        *://jwcjwxt.jyu.edu.cn/*
// @match        *://210.38.162.116/*
// @match        *://210.38.162.117/*
// @match        *://210.38.162.118/*
// @match        *://210.38.162.121/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559556/%E5%98%89%E5%BA%94%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E9%9B%86%E7%BE%A4%E8%AF%84%E6%95%99%E6%9C%BA%E5%99%A8%E4%BA%BA%20%28v32%20%E7%BB%93%E6%9E%84%E5%8C%96%E5%BD%95%E5%85%A5%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559556/%E5%98%89%E5%BA%94%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E9%9B%86%E7%BE%A4%E8%AF%84%E6%95%99%E6%9C%BA%E5%99%A8%E4%BA%BA%20%28v32%20%E7%BB%93%E6%9E%84%E5%8C%96%E5%BD%95%E5%85%A5%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //  配置常量区
    const UI_ID = "fish-ui-panel";
    const STORE_KEY_ACCOUNTS = "fish_batch_accounts";
    const STORE_KEY_INDEX = "fish_batch_index";
    const STORE_KEY_RUNNING = "fish_batch_running";
    const STORE_KEY_BLACKLIST = "fish_course_blacklist";

    // 信号锁
    const MENU_LOCK_KEY = "fish_main_menu_clicked_lock";
    const LOGOUT_SIGNAL_KEY = "fish_need_logout_signal";

    const isTop = window.top === window.self;

    //  UI 界面 (含询问重置逻辑)
    function createUI() {
        if (!isTop) return;
        if (document.getElementById(UI_ID)) return;

        // 1. 创建悬浮球
        let toggleBtn = document.createElement("button");
        toggleBtn.innerHTML = "🤖 控制台";
        toggleBtn.style.cssText = "position:fixed; right:20px; bottom:20px; z-index:999999; padding:10px 15px; background:#007bff; color:white; border:none; border-radius:50px; box-shadow:0 4px 10px rgba(0,0,0,0.3); cursor:pointer; font-weight:bold;";

        // 点击悬浮球时的“询问逻辑”
        toggleBtn.onclick = () => {
            let panel = document.getElementById(UI_ID);

            // 如果面板是隐藏的，准备打开时进行检查
            if (panel.style.display === "none") {
                let savedAcc = JSON.parse(localStorage.getItem(STORE_KEY_ACCOUNTS) || "[]");
                let savedIdx = parseInt(localStorage.getItem(STORE_KEY_INDEX) || "0");

                // 只有当有数据时才询问
                if (savedAcc.length > 0) {
                    let msg = `检测到已保存进度：\n\n📌 账号总数：${savedAcc.length} 个\n👉 当前进度：第 ${savedIdx + 1} 个\n\n【确定】= 清空旧数据，重新录入\n【取消】= 保留数据，继续运行`;

                    if (confirm(msg)) {
                        // 用户选择重置
                        resetAllData();
                        alert("🗑 已清空！请录入新信息。");
                    }
                }
                panel.style.display = "block";
            } else {
                panel.style.display = "none";
            }
        };
        document.body.appendChild(toggleBtn);

        // 2. 创建主面板
        let panel = document.createElement("div");
        panel.id = UI_ID;
        panel.style.cssText = "display:none; position:fixed; right:20px; bottom:80px; width:320px; background:white; z-index:999999; border-radius:8px; box-shadow:0 0 20px rgba(0,0,0,0.2); padding:15px; font-size:14px; font-family:sans-serif;";

        let html = `
            <h3 style="margin:0 0 10px 0; color:#333; border-bottom:1px solid #eee; padding-bottom:5px;">
                🎯 极速且精准 (v3.2)
                <button id="fish-btn-hard-reset" style="float:right; font-size:12px; padding:2px 8px; background:#6c757d; color:white; border:none; border-radius:4px; cursor:pointer;">🔄 强制重置</button>
            </h3>

            <div style="margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; color:#666; font-size:12px; margin-bottom:5px; padding:0 5px;">
                    <span style="flex:1">账号</span>
                    <span style="flex:1">密码</span>
                    <span style="width:30px"></span>
                </div>
                <div id="fish-acc-container" style="max-height:200px; overflow-y:auto; border:1px solid #eee; padding:5px; border-radius:4px; background:#f9f9f9;">
                </div>
                <button id="fish-btn-add-row" style="width:100%; margin-top:5px; padding:5px; background:#e9ecef; border:1px dashed #ced4da; color:#495057; cursor:pointer; border-radius:4px;">➕ 添加一行</button>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span id="fish-status" style="color:#e6a23c; font-weight:bold;">⏸️ 等待录入</span>
                <span style="font-size:12px; color:#999;">进度: <span id="fish-progress">0/0</span></span>
            </div>
            <div style="display:flex; gap:10px;">
                <button id="fish-btn-start" style="flex:1; padding:8px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer;">▶ 启动任务</button>
                <button id="fish-btn-stop" style="flex:1; padding:8px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer;">⏹ 停止</button>
            </div>
        `;
        panel.innerHTML = html;
        document.body.appendChild(panel);

        // 获取元素引用
        let container = document.getElementById("fish-acc-container");
        let btnAddRow = document.getElementById("fish-btn-add-row");
        let btnStart = document.getElementById("fish-btn-start");
        let btnStop = document.getElementById("fish-btn-stop");
        let btnHardReset = document.getElementById("fish-btn-hard-reset");

        // UI 辅助函数：添加行
        function addRow(user = "", pass = "") {
            let div = document.createElement("div");
            div.className = "fish-acc-row";
            div.style.cssText = "display:flex; gap:5px; margin-bottom:5px;";
            div.innerHTML = `
                <input type="text" class="g-user" value="${user}" placeholder="账号" style="flex:1; padding:4px; border:1px solid #ddd; border-radius:3px; width:100px;">
                <input type="text" class="g-pass" value="${pass}" placeholder="密码" style="flex:1; padding:4px; border:1px solid #ddd; border-radius:3px; width:100px;">
                <button class="g-del" style="width:30px; background:#ff4d4f; color:white; border:none; border-radius:3px; cursor:pointer;" title="删除此行">✕</button>
            `;
            div.querySelector(".g-del").onclick = () => div.remove();
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        }

        // 🔥【核心逻辑】重置所有数据
        function resetAllData() {
            container.innerHTML = ""; // 清空界面
            localStorage.removeItem(STORE_KEY_ACCOUNTS);
            localStorage.removeItem(STORE_KEY_INDEX);
            localStorage.removeItem(STORE_KEY_RUNNING);
            sessionStorage.clear(); // 清空会话锁

            // 添加一个空行供录入
            addRow();
            updateProgressDisplay();
            document.getElementById("fish-status").innerText = "🗑 已重置";
        }

        // 初始化加载
        let savedAcc = JSON.parse(localStorage.getItem(STORE_KEY_ACCOUNTS) || "[]");
        if (savedAcc.length > 0) {
            savedAcc.forEach(acc => addRow(acc.u, acc.p));
            document.getElementById("fish-status").innerText = "💾 读取旧数据";
        } else {
            addRow();
        }
        updateProgressDisplay();

        // 按钮事件绑定
        btnAddRow.onclick = () => addRow();

        // 标题栏上的“强制重置”按钮
        btnHardReset.onclick = () => {
            if (confirm("确定要强制清空所有信息吗？")) {
                resetAllData();
            }
        };

        btnStart.onclick = () => {
            let rows = document.querySelectorAll(".fish-acc-row");
            let accounts = [];
            rows.forEach(row => {
                let u = row.querySelector(".g-user").value.trim();
                let p = row.querySelector(".g-pass").value.trim();
                if (u && p) accounts.push({ u, p });
            });

            if (accounts.length === 0) return alert("❌ 请至少填写一组账号密码！");

            localStorage.setItem(STORE_KEY_ACCOUNTS, JSON.stringify(accounts));
            localStorage.setItem(STORE_KEY_RUNNING, "true");

            // 如果index不存在，或者之前的任务已经跑完了，重置为0
            let currentIdx = parseInt(localStorage.getItem(STORE_KEY_INDEX) || "0");
            if (currentIdx >= accounts.length) {
                localStorage.setItem(STORE_KEY_INDEX, "0");
            }
            if (!localStorage.getItem(STORE_KEY_INDEX)) localStorage.setItem(STORE_KEY_INDEX, "0");

            // 清理锁
            sessionStorage.removeItem(STORE_KEY_BLACKLIST);
            sessionStorage.removeItem(MENU_LOCK_KEY);
            localStorage.removeItem(LOGOUT_SIGNAL_KEY);

            updateProgressDisplay();
            runBatchLogic();
            alert(`✅ v3.2 启动！\n共 ${accounts.length} 个账号，开始执行。`);
        };

        btnStop.onclick = () => { localStorage.setItem(STORE_KEY_RUNNING, "false"); document.getElementById("fish-status").innerText = "🛑 已停止"; };

        function updateProgressDisplay() {
            let accs = JSON.parse(localStorage.getItem(STORE_KEY_ACCOUNTS) || "[]");
            let idx = parseInt(localStorage.getItem(STORE_KEY_INDEX) || "0");
            let isRun = localStorage.getItem(STORE_KEY_RUNNING) === "true";

            let progEl = document.getElementById("fish-progress");
            if (progEl) {
                progEl.innerText = accs.length > 0 ? `${idx + 1}/${accs.length}` : "0/0";
                if (isRun) document.getElementById("fish-status").innerHTML = "🚀 运行中: 账号 " + (idx + 1);
            }
        }
    }

    // 🧠 核心逻辑区 (保持稳定逻辑)

    async function runBatchLogic() {
        let isRunning = localStorage.getItem(STORE_KEY_RUNNING) === "true";
        if (!isRunning) return;

        let accounts = JSON.parse(localStorage.getItem(STORE_KEY_ACCOUNTS) || "[]");
        let currentIndex = parseInt(localStorage.getItem(STORE_KEY_INDEX) || "0");

        if (currentIndex >= accounts.length) {
            localStorage.setItem(STORE_KEY_RUNNING, "false");
            if (isTop) alert("✅ 所有账号已完成！");
            return;
        }

        let currentAccount = accounts[currentIndex];

        // 🔥 信号0：注销切换
        if (isTop && localStorage.getItem(LOGOUT_SIGNAL_KEY) === "true") {
            updateStatus("📡 任务完成，切换账号...");
            localStorage.removeItem(LOGOUT_SIGNAL_KEY);
            sessionStorage.removeItem(MENU_LOCK_KEY);
            localStorage.setItem(STORE_KEY_INDEX, currentIndex + 1);
            await performNativeLogout();
            return;
        }

        // 🔥 信号0.5：弹窗拦截
        let confirmBtn = Array.from(document.querySelectorAll('button, a, span.ui-button-text')).find(el => el.innerText.trim() === "确认");
        if (confirmBtn && confirmBtn.offsetParent !== null) {
            updateStatus("✅ 点击【确认】...");
            safeClick(confirmBtn);
            await sleep(1000);
            return;
        }
        let viewDetailsBtn = Array.from(document.querySelectorAll('a, button')).find(el => el.innerText.includes("查看详情"));
        if (viewDetailsBtn && viewDetailsBtn.offsetParent !== null && !document.querySelector(".modal-body")) {
            updateStatus("⚠️ 发现提示，点击详情...");
            safeClick(viewDetailsBtn);
            await sleep(1000);
            return;
        }

        // --- 1. 登录页逻辑 ---
        let userField = getElement(['#yhm', 'input[name="yhm"]']);
        let passField = getElement(['#mm', 'input[name="mm"]']);
        let loginBtn = getElement(['#dl', '#loginBtn', '.btn-primary']);
        let captchaField = getElement(['#yzm', 'input[name="yzm"]', '.auth-code']);

        if (userField && passField && loginBtn) {
            if (userField.value !== currentAccount.u) {
                setValue(userField, currentAccount.u);
                setValue(passField, currentAccount.p);
            }
            if (captchaField && captchaField.offsetParent !== null) {
                captchaField.style.border = "3px solid red";
                captchaField.focus();
                updateStatus("⌨️ 请输验证码");
                return;
            } else {
                if (passField.value === currentAccount.p) safeClick(loginBtn);
            }
            return;
        }

        // --- 2. 强制阅读通知页 ---
        let readBtns = document.querySelectorAll("button, a, div[role='button']");
        for (let btn of readBtns) {
            if (btn.innerText.includes("已阅读") && btn.offsetParent !== null) {
                let btnText = btn.innerText;
                let hasCountdown = /\d+/.test(btnText) && !btnText.includes("0");
                let isDisabled = btn.disabled || btn.classList.contains("disabled") || (btn.style.color === 'gray') || hasCountdown;

                if (isDisabled) {
                    btn.style.border = "3px solid orange";
                    updateStatus("⏳ 倒计时中...");
                } else {
                    btn.style.border = "3px solid green";
                    updateStatus("✅ 点击已阅读...");
                    safeClick(btn);
                }
                return;
            }
        }

        // --- 3. 评教填表逻辑 ---
        let ratingRows = document.querySelectorAll("tr.tr-xspj");
        let isProcessing = document.body.getAttribute("fish-rating-now");

        if (ratingRows.length > 0) {
            let realSubmitBtn = findRealSubmitBtn();
            if (!realSubmitBtn) {
                if (!isProcessing) {
                    updateStatus("⚠️ 本门已提交，下一门...");
                    findAndClickNext(currentIndex);
                }
                return;
            }
            if (!isProcessing) {
                document.body.setAttribute("fish-rating-now", "true");
                updateStatus("🖱️ 评分中...");
                await doRatingPhysically(ratingRows, realSubmitBtn);
                return;
            }
            return;
        }

        // --- 4. 选课列表页 ---
        let grid = document.querySelector("#tempGrid");
        if (grid) {
            let loadingOverlay = document.querySelector("#load_tempGrid");
            if (loadingOverlay && loadingOverlay.style.display !== "none") return;
            findAndClickNext(currentIndex);
            return;
        }

        // --- 5. 菜单逻辑 (v17.2 逻辑) ---
        if (isTop) {
            let lockTime = parseInt(sessionStorage.getItem(MENU_LOCK_KEY) || "0");
            if (Date.now() < lockTime) {
                updateStatus("💤 评教中，请稍候...");
                return;
            }
            let allLinks = Array.from(document.querySelectorAll("a"));
            let subMenu = allLinks.find(el => el.innerText && el.innerText.trim() === "学生评价");
            let topMenu = allLinks.find(el => el.innerText && el.innerText.trim() === "教学评价");

            if (subMenu && subMenu.offsetParent !== null) {
                updateStatus("👆 点击【学生评价】...");
                sessionStorage.setItem(MENU_LOCK_KEY, Date.now() + 60000);
                safeClick(subMenu);
                return;
            }
            if (topMenu) {
                let parentLi = topMenu.closest("li.dropdown");
                let isOpen = parentLi && parentLi.classList.contains("open");
                if (!isOpen) {
                    updateStatus("📂 展开【教学评价】菜单...");
                    safeClick(topMenu);
                    await sleep(500);
                    return;
                }
            }
        }
    }

    // --- 🛠️ 模拟点击注销 ---
    async function performNativeLogout() {
        updateStatus("👋 准备退出...");
        let userToggle = document.querySelector("a.dropdown-toggle.grxx") || document.querySelector(".user-menu .dropdown-toggle");
        if (userToggle) {

            let exitBtn = document.getElementById("exit");
            if (exitBtn) {
                updateStatus("跳转到主页面...");
                window.location.href = "/xtgl/login_slogin.html";
                safeClick(userToggle);
                await sleep(300);
                updateStatus("🚪 点击【退出】...");
                sessionStorage.clear();
                exitBtn.click();
            }
        }
    }

    // --- 核心工具函数 ---
    function findRealSubmitBtn() {
        let allBtns = document.querySelectorAll("button, input[type='button'], div.btn");
        for (let btn of allBtns) {
            if (btn.offsetParent === null) continue;
            let txt = btn.innerText ? btn.innerText.trim() : (btn.value ? btn.value.trim() : "");
            if (txt.includes("提交")) return btn;
        }
        return null;
    }

    function safeClick(element) {
        if (!element) return;
        element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, view: window }));
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, view: window }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, view: window }));
        element.click();
    }

    function findAndClickNext(currentIndex) {
        let grid = document.querySelector("#tempGrid");
        if (grid) {
            let savedCells = Array.from(grid.querySelectorAll("td[title='已评完']"));
            for (let cell of savedCells) {
                let row = cell.closest("tr");
                if (!isBlacklisted(row.id)) {
                    updateStatus("🔄 补交...");
                    enterCourse(cell);
                    return;
                }
            }
            let unratedCells = Array.from(grid.querySelectorAll("td[title='未评']"));
            for (let cell of unratedCells) {
                let row = cell.closest("tr");
                if (!isBlacklisted(row.id)) {
                    updateStatus("👉 进课...");
                    enterCourse(cell);
                    return;
                }
            }
            let nextBtn = document.querySelector("#next_tempGrid_pager");
            let nextIcon = document.querySelector(".ui-icon-seek-next, .glyphicon-chevron-right");
            let isNextDisabled = false;

            if (nextBtn && nextBtn.classList.contains("ui-state-disabled")) isNextDisabled = true;
            if (nextIcon && nextIcon.closest("td") && nextIcon.closest("td").classList.contains("ui-state-disabled")) isNextDisabled = true;

            if (nextIcon && !isNextDisabled) {
                updateStatus("📖 翻页...");
                safeClick(nextIcon);
                return;
            }
            let allUnfinished = savedCells.length + unratedCells.length;
            let allBlacklisted = savedCells.filter(c => isBlacklisted(c.closest("tr").id)).length +
                unratedCells.filter(c => isBlacklisted(c.closest("tr").id)).length;
            if (allUnfinished === 0 || allUnfinished === allBlacklisted) {
                updateStatus("✅ 完成，发送注销信号！");
                localStorage.setItem(LOGOUT_SIGNAL_KEY, "true");
                window.close();
            }
        }
    }

    function isBlacklisted(rowId) {
        let list = JSON.parse(sessionStorage.getItem(STORE_KEY_BLACKLIST) || "[]");
        return list.includes(rowId);
    }
    function addToBlacklist(rowId) {
        let list = JSON.parse(sessionStorage.getItem(STORE_KEY_BLACKLIST) || "[]");
        if (!list.includes(rowId)) {
            list.push(rowId);
            sessionStorage.setItem(STORE_KEY_BLACKLIST, JSON.stringify(list));
        }
    }

    function enterCourse(cell) {
        let row = cell.closest("tr");
        let rowId = row.id;
        sessionStorage.setItem("g_current_course_id", rowId);
        let lastClick = sessionStorage.getItem("g_last_click_" + rowId);
        if (!lastClick || (Date.now() - lastClick > 3000)) {
            sessionStorage.setItem("g_last_click_" + rowId, Date.now());
            document.body.removeAttribute("fish-rating-now");
            safeClick(row);
            let links = row.querySelectorAll("a");
            for (let link of links) {
                let txt = link.innerText;
                let onclickCode = link.getAttribute("onclick") || "";
                if (!txt.includes("放弃") && !txt.includes("Give") && !onclickCode.includes("fqpj")) {
                    safeClick(link);
                    break;
                }
            }
        }
    }

    async function closeModal() {
        let allElements = document.querySelectorAll("button, a, span, div.btn");
        for (let el of allElements) {
            if (el.offsetParent === null) continue;
            let txt = el.innerText ? el.innerText.trim() : "";
            if (txt === "确定" || txt === "确 定" || txt === "OK") {
                safeClick(el);
                await sleep(400);
                return;
            }
        }
    }

    async function typeText(element, text) {
        element.focus();
        element.value = "";
        for (let char of text) {
            element.value += char;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(Math.random() * 20 + 20);
        }
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    async function doRatingPhysically(rows, submitBtn) {
        for (let [idx, row] of rows.entries()) {
            let radios = Array.from(row.querySelectorAll("input[type='radio']"));
            radios.sort((a, b) => parseFloat(b.getAttribute("data-dyf") || 0) - parseFloat(a.getAttribute("data-dyf") || 0));
            if (radios.length > 0) {
                let isChecked = radios.some(r => r.checked);
                if (!isChecked) {
                    let target = radios[0];
                    if (Math.random() < 0.2 || idx % 5 === 4) {
                        if (radios.length > 1) target = radios[1];
                    }
                    safeClick(target);
                    await sleep(Math.random() * 20 + 20);
                }
            }
        }
        let comments = ["老师备课充分，讲解清晰。", "教学态度认真，重点突出。", "课堂氛围活跃，获益良多。", "深入浅出，通俗易懂。"];
        let textareas = document.querySelectorAll("textarea");
        for (let area of textareas) {
            if (!area.value) {
                let randomText = comments[Math.floor(Math.random() * comments.length)];
                await typeText(area, randomText);
                await sleep(10);
            }
        }
        updateStatus("🤔 检查中 (0.3s)...");
        await sleep(300);
        await closeModal();
        if (submitBtn) {
            updateStatus("✅ 点击提交...");
            safeClick(submitBtn);
            await sleep(400);
            await closeModal();
            setTimeout(() => document.body.removeAttribute("fish-rating-now"), 1000);
        }
    }

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function updateStatus(msg) { let el = document.getElementById("fish-status"); if (el) el.innerHTML = msg; }
    function getElement(selectors) { for (let s of selectors) { let el = document.querySelector(s); if (el && el.offsetParent !== null) return el; } return null; }
    function setValue(el, val) { el.value = val; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }

    setTimeout(createUI, 1000);
    setInterval(runBatchLogic, 500);

})();