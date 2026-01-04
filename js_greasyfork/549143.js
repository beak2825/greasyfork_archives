// ==UserScript==
// @license MIT
// @name         网站跳转管理器（终极可拖拽版）
// @namespace    https://greasyfork.org/users/123456
// @version      2.0
// @author       五香肉
// @description  网页跳转 从A跳转到B 可以实现国内伪装垃圾网站跳转到真正的官网 网页跳转自定义 可保存规则 小球悬浮可拖动
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549143/%E7%BD%91%E7%AB%99%E8%B7%B3%E8%BD%AC%E7%AE%A1%E7%90%86%E5%99%A8%EF%BC%88%E7%BB%88%E6%9E%81%E5%8F%AF%E6%8B%96%E6%8B%BD%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549143/%E7%BD%91%E7%AB%99%E8%B7%B3%E8%BD%AC%E7%AE%A1%E7%90%86%E5%99%A8%EF%BC%88%E7%BB%88%E6%9E%81%E5%8F%AF%E6%8B%96%E6%8B%BD%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //---------------- 数据存储 ----------------//
    let rules = GM_getValue("rules", []);
    let currentRuleIndex = GM_getValue("currentRuleIndex", -1);
    let autoRedirect = GM_getValue("autoRedirect", true);
    let windowStates = GM_getValue("windowStates", {jumpWindow:false, rulesWindow:false});
    let positions = GM_getValue("positions", {jumpBall:{top:"50%", left:"95%"}, jumpWindow:{top:"50%", left:"35%"}, rulesWindow:{top:"50%", left:"65%"}});

    function saveRules() {
        GM_setValue("rules", rules);
        GM_setValue("currentRuleIndex", currentRuleIndex);
        GM_setValue("autoRedirect", autoRedirect);
    }
    function saveWindowStates() {
        GM_setValue("windowStates", windowStates);
    }
    function savePositions() {
        GM_setValue("positions", positions);
    }

    //---------------- 样式 ----------------//
    const style = document.createElement("style");
    style.textContent = `
      #jumpBall {
        position: fixed; width: 40px; height: 40px; background: #cce7ff;
        border-radius: 50%; cursor: move; z-index: 10000;
        display: flex; align-items: center; justify-content: center;
        font-weight: bold; color: #333; box-shadow: 0 0 8px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      }
      #jumpBall:hover { transform: scale(1.1); }

      #jumpWindow, #rulesWindow {
        position: fixed; transform: translate(-50%, -50%);
        background: #f9f9fb; border-radius: 12px;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        padding: 16px; z-index: 10001; display: none;
        width: 500px; max-height: 80%; overflow-y: auto;
        font-family: "Segoe UI", Arial, sans-serif;
        cursor: move;
      }

      #jumpWindow h2, #rulesWindow h2 { margin: 0 0 10px 0; font-size: 18px; color: #333; }

      .fieldRow { display: flex; gap: 8px; margin-bottom: 8px; }
      .fieldRow input[type="text"] {
        flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px;
        min-width: 0;
      }

      .btn {
        flex: 1; text-align: center;
        background: #4cafef; color: #fff; border: none; border-radius: 6px;
        padding: 6px 10px; cursor: pointer; transition: 0.2s; font-size: 14px;
      }
      .btn:hover { background: #42a5e5; }
      .btn.danger { background: #f44336; }

      .ruleItem {
        padding: 6px 8px; margin-bottom: 6px;
        border-radius: 6px; background: #fff; border: 1px solid #ddd;
        font-size: 14px;
        display: flex; justify-content: space-between; align-items: center;
      }
      .ruleItem span {
        flex: 1;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ruleItem button { margin-left: 4px; }

      .topBar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; cursor: default; }
      .closeBtn { background: transparent; border: none; font-size: 16px; cursor: pointer; color: #666; }
      .closeBtn:hover { color: #000; }

      .btnRow { display: flex; gap: 8px; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    //---------------- 创建元素 ----------------//
    const ball = document.createElement("div");
    ball.id = "jumpBall";
    ball.textContent = "⇆";
    document.body.appendChild(ball);

    const win = document.createElement("div");
    win.id = "jumpWindow";
    document.body.appendChild(win);

    const rulesWin = document.createElement("div");
    rulesWin.id = "rulesWindow";
    document.body.appendChild(rulesWin);

    //---------------- 工具函数 ----------------//
    function setPosition(el, pos) {
        el.style.top = pos.top;
        el.style.left = pos.left;
    }

    function makeDraggable(el, key) {
        let isDragging = false, offsetX=0, offsetY=0;

        el.addEventListener("mousedown", (e) => {
            if(e.target.classList.contains("closeBtn") || e.target.tagName==="INPUT" || e.target.tagName==="BUTTON") return;
            isDragging=true;
            const rect = el.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            e.preventDefault();
        });

        document.addEventListener("mousemove", (e)=>{
            if(!isDragging) return;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            el.style.left = x + "px";
            el.style.top = y + "px";
        });

        document.addEventListener("mouseup", ()=>{
            if(isDragging){
                isDragging=false;
                positions[key]={top:el.style.top,left:el.style.left};
                savePositions();
            }
        });
    }

    //---------------- 渲染主窗口 ----------------//
    function renderWindow() {
        win.innerHTML = "";

        const topBar = document.createElement("div");
        topBar.className = "topBar";
        topBar.innerHTML = `<h2>跳转管理</h2>`;
        const closeBtn = document.createElement("button");
        closeBtn.className = "closeBtn";
        closeBtn.textContent = "×";
        closeBtn.onclick = () => { win.style.display = "none"; windowStates.jumpWindow=false; saveWindowStates(); };
        topBar.appendChild(closeBtn);
        win.appendChild(topBar);

        const toggleRow = document.createElement("div");
        toggleRow.className = "fieldRow";
        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.checked = autoRedirect;
        toggle.onchange = () => { autoRedirect = toggle.checked; saveRules(); };
        const toggleLabel = document.createElement("label");
        toggleLabel.textContent = "启用自动跳转";
        toggleLabel.style.marginLeft = "8px";
        toggleRow.appendChild(toggle);
        toggleRow.appendChild(toggleLabel);
        win.appendChild(toggleRow);

        if(currentRuleIndex < 0){
            rules.push({ real: "", fakes: [""] });
            currentRuleIndex = rules.length - 1;
            saveRules();
        }

        let rule = rules[currentRuleIndex];

        const realRow = document.createElement("div");
        realRow.className = "fieldRow";
        const realInput = document.createElement("input");
        realInput.type = "text";
        realInput.placeholder = "真网站 URL";
        realInput.value = rule.real || "";
        realRow.appendChild(realInput);
        win.appendChild(realRow);

        const fakeContainer = document.createElement("div");
        fakeContainer.style.display = "flex";
        fakeContainer.style.flexDirection = "column";
        win.appendChild(fakeContainer);

        function renderFakes() {
            fakeContainer.innerHTML = "";
            rule.fakes.forEach((f, idx) => {
                const row = document.createElement("div");
                row.className = "fieldRow";

                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = "假网站 URL";
                input.value = f;
                row.appendChild(input);

                const delBtn = document.createElement("button");
                delBtn.textContent = "－";
                delBtn.className = "btn";
                delBtn.onclick = () => {
                    if(rule.fakes.length > 1){
                        rule.fakes.splice(idx,1);
                        renderFakes();
                    }
                };
                row.appendChild(delBtn);
                fakeContainer.appendChild(row);
            });

            const addBtn = document.createElement("button");
            addBtn.textContent = "＋假网站";
            addBtn.className = "btn";
            addBtn.onclick = () => { rule.fakes.push(""); renderFakes(); };
            fakeContainer.appendChild(addBtn);
        }
        renderFakes();

        const btnRow = document.createElement("div");
        btnRow.className = "btnRow";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "保存规则";
        saveBtn.className = "btn";
        saveBtn.onclick = () => {
            rule.real = realInput.value;
            const fakeInputs = fakeContainer.querySelectorAll("input");
            rule.fakes = Array.from(fakeInputs).map(inp => inp.value);
            rules[currentRuleIndex] = rule;
            saveRules();
        };
        btnRow.appendChild(saveBtn);

        const addRuleBtn = document.createElement("button");
        addRuleBtn.textContent = "＋新增规则";
        addRuleBtn.className = "btn";
        addRuleBtn.onclick = () => {
            rules.push({ real: "", fakes: [""] });
            currentRuleIndex = rules.length - 1;
            saveRules();
            renderWindow();
        };
        btnRow.appendChild(addRuleBtn);

        const manageBtn = document.createElement("button");
        manageBtn.textContent = "管理规则";
        manageBtn.className = "btn";
        manageBtn.onclick = () => { renderRulesWindow(); rulesWin.style.display = "block"; windowStates.rulesWindow=true; saveWindowStates(); adjustWindows(); };
        btnRow.appendChild(manageBtn);

        win.appendChild(btnRow);
    }

    //---------------- 渲染规则窗口 ----------------//
    function renderRulesWindow(){
        rulesWin.innerHTML = "";

        const topBar = document.createElement("div");
        topBar.className = "topBar";
        topBar.innerHTML = `<h2>规则管理</h2>`;
        const closeBtn = document.createElement("button");
        closeBtn.className = "closeBtn";
        closeBtn.textContent = "×";
        closeBtn.onclick = () => { rulesWin.style.display = "none"; windowStates.rulesWindow=false; saveWindowStates(); };
        topBar.appendChild(closeBtn);
        rulesWin.appendChild(topBar);

        rules.forEach((r, idx) => {
            const item = document.createElement("div");
            item.className = "ruleItem";

            const text = document.createElement("span");
            text.textContent = `真:${r.real} 假:${r.fakes.join(",")}`;
            item.appendChild(text);

            const editBtn = document.createElement("button");
            editBtn.textContent = "编辑";
            editBtn.className = "btn";
            editBtn.onclick = () => { currentRuleIndex = idx; renderWindow(); win.style.display = "block"; windowStates.jumpWindow=true; saveWindowStates(); adjustWindows(); };

            const delBtn = document.createElement("button");
            delBtn.textContent = "删除";
            delBtn.className = "btn danger";
            delBtn.onclick = () => {
                rules.splice(idx, 1);
                if(currentRuleIndex >= rules.length) currentRuleIndex = rules.length - 1;
                saveRules();
                renderRulesWindow();
            };

            item.appendChild(editBtn);
            item.appendChild(delBtn);
            rulesWin.appendChild(item);
        });

        const btnRow = document.createElement("div");
        btnRow.className = "btnRow";

        const addRuleBtn = document.createElement("button");
        addRuleBtn.textContent = "＋新增规则";
        addRuleBtn.className = "btn";
        addRuleBtn.onclick = () => {
            rules.push({ real: "", fakes: [""] });
            currentRuleIndex = rules.length - 1;
            saveRules();
            renderRulesWindow();
        };
        btnRow.appendChild(addRuleBtn);

        const clearAllBtn = document.createElement("button");
        clearAllBtn.textContent = "⚠ 清空规则";
        clearAllBtn.className = "btn danger";
        clearAllBtn.onclick = () => {
            if(confirm("确定要清空所有规则吗？此操作不可撤销！")){
                rules = [];
                currentRuleIndex = -1;
                saveRules();
                renderRulesWindow();
            }
        };
        btnRow.appendChild(clearAllBtn);

        rulesWin.appendChild(btnRow);
    }

    //---------------- 逻辑 ----------------//
    ball.onclick = () => {
        windowStates.jumpWindow=true;
        saveWindowStates();
        renderWindow();
        win.style.display="block";
        adjustWindows();
    };

    //---------------- 自动避开窗口 ----------------//
    function adjustWindows(){
        const margin = 10;
        if(windowStates.jumpWindow && windowStates.rulesWindow){
            const winRect = win.getBoundingClientRect();
            const rulesRect = rulesWin.getBoundingClientRect();
            if(Math.abs(winRect.left - rulesRect.left)<margin && Math.abs(winRect.top - rulesRect.top)<margin){
                // 自动错开
                rulesWin.style.left = parseInt(win.style.left)+winRect.width+margin+"px";
                rulesWin.style.top = win.style.top;
                positions.rulesWindow={top:rulesWin.style.top,left:rulesWin.style.left};
                savePositions();
            }
        }
    }

    //---------------- 拖拽 ----------------//
    makeDraggable(ball,"jumpBall");
    makeDraggable(win,"jumpWindow");
    makeDraggable(rulesWin,"rulesWindow");

    //---------------- 设置位置 ----------------//
    setPosition(ball, positions.jumpBall);
    setPosition(win, positions.jumpWindow);
    setPosition(rulesWin, positions.rulesWindow);

    //---------------- 刷新/跳页保持浮窗显示 ----------------//
    if(windowStates.jumpWindow) { renderWindow(); win.style.display="block"; }
    if(windowStates.rulesWindow) { renderRulesWindow(); rulesWin.style.display="block"; }

    //---------------- 自动跳转 ----------------//
    function checkRedirect(){
        if(!autoRedirect) return;
        for(const r of rules){
            if(r.real && r.fakes.some(f => f && location.href.includes(f))){
                if(confirm(`检测到假网址，是否跳转到真实网址？\n${r.real}`)){
                    location.href = r.real;
                }
                break;
            }
        }
    }
    checkRedirect();

})();
