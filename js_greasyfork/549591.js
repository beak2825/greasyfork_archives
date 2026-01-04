// ==UserScript==
// @name         广西成高抢考位助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动查询并抢考位，双考点监控 target1 优先
// @match        https://crgk.gxeea.cn:7979/cgbm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549591/%E5%B9%BF%E8%A5%BF%E6%88%90%E9%AB%98%E6%8A%A2%E8%80%83%E4%BD%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549591/%E5%B9%BF%E8%A5%BF%E6%88%90%E9%AB%98%E6%8A%A2%E8%80%83%E4%BD%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 插入监控窗口 UI ===
    let panel = document.createElement("div");
    panel.id = "examMonitor";
    panel.style.cssText = `
        position:fixed; top:100px; left:20px; width:320px;
        background:#fff; border:2px solid #409EFF; border-radius:10px;
        z-index:99999; padding:10px; font-size:14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    panel.innerHTML = `
        <h4 style="margin:0 0 10px 0;font-size:16px;color:#409EFF;cursor:move;">抢考位助手2.0</h4>
        <label>选择城市：</label>
        <select id="citySelect" style="width:100%;margin-bottom:8px;">
            <option value="南宁市">南宁市</option>
            <option value="柳州市">柳州市</option>
            <option value="桂林市">桂林市</option>
            <option value="梧州市">梧州市</option>
            <option value="北海市">北海市</option>
            <option value="防城港市">防城港市</option>
            <option value="钦州市">钦州市</option>
            <option value="贵港市">贵港市</option>
            <option value="玉林市">玉林市</option>
            <option value="百色市">百色市</option>
            <option value="贺州市">贺州市</option>
            <option value="河池市">河池市</option>
            <option value="来宾市">来宾市</option>
            <option value="崇左市">崇左市</option>
        </select>
        <label>目标考点 1（优先）：</label>
        <input id="targetExam1" style="width:100%;margin-bottom:8px;" placeholder="如：南宁市辖区"/>
        <label>目标考点 2：</label>
        <input id="targetExam2" style="width:100%;margin-bottom:8px;" placeholder="如：桂林市辖区"/>
        <label>获取考位间隔(ms)：</label>
        <input id="intervalInput" type="number" style="width:100%;margin-bottom:8px;" value="500"/>
        <label>触发保存(ms)：</label>
        <input id="saveDelayInput" type="number" style="width:100%;margin-bottom:8px;" value="100"/>
        <button id="startBtn" style="width:100%;background:#67C23A;color:#fff;padding:5px;border:none;border-radius:5px;">开始监控</button>
        <button id="stopBtn" style="width:100%;background:#F56C6C;color:#fff;padding:5px;border:none;border-radius:5px;margin-top:5px;">停止监控</button>
        <div id="logBox" style="margin-top:8px;height:140px;overflow:auto;font-size:12px;background:#f9f9f9;border:1px solid #eee;padding:3px;"></div>
    `;
    document.body.appendChild(panel);

    // === UI 可拖动 ===
    (function makeDraggable(el, handle) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
        handle.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e.preventDefault();
            mouseX = e.clientX; mouseY = e.clientY;
            document.onmouseup = closeDrag;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e.preventDefault();
            posX = mouseX - e.clientX; posY = mouseY - e.clientY;
            mouseX = e.clientX; mouseY = e.clientY;
            el.style.top = (el.offsetTop - posY) + "px";
            el.style.left = (el.offsetLeft - posX) + "px";
        }
        function closeDrag() { document.onmouseup=null; document.onmousemove=null; }
    })(panel, panel.querySelector("h4"));

    let timer = null;
    let alreadySaved = false;
    let logBox = document.getElementById("logBox");
    const maxLogLines = 50;

    function log(msg) {
        let time = new Date().toLocaleTimeString();
        let div = document.createElement("div");
        div.textContent = `[${time}] ${msg}`;
        logBox.appendChild(div);
        if(logBox.childNodes.length > maxLogLines) logBox.removeChild(logBox.firstChild);
        logBox.scrollTop = logBox.scrollHeight;
    }

    function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

    async function startMonitor() {
        if(timer){ log("监控已在运行中，请先停止后再启动！"); return; }
        alreadySaved = false;

        let city = document.getElementById("citySelect").value;
        let target1 = document.getElementById("targetExam1").value.trim();
        let target2 = document.getElementById("targetExam2").value.trim();
        let interval = parseInt(document.getElementById("intervalInput").value) || 500;
        let saveDelay = parseInt(document.getElementById("saveDelayInput").value) || 100;

        if(!target1 && !target2){ alert("请至少输入一个目标考点！"); return; }
        log(`开始监控：${city} -> ${target1}${target2?"、"+target2:""}，查询间隔：${interval}ms，保存延迟：${saveDelay}ms`);

        // 缓存查询与保存按钮
        let queryBtn = document.evaluate(
            '/html/body/div[1]/div[1]/div/div[2]/div[2]/div[5]/div[5]/div/div[1]/button',
            document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
        ).singleNodeValue;

        let saveBtn = [...document.querySelectorAll("button")].find(el=>el.innerText.includes("保存"));

        timer = setInterval(async ()=>{
            try{
                if(alreadySaved) return;

                // 直接操作城市选择
                let cityOption = [...document.querySelectorAll(".ivu-select-item")].find(el=>el.innerText.trim()===city);
                if(cityOption) {
                    cityOption.dispatchEvent(new Event('click', { bubbles: true }));
                }

                if(queryBtn) queryBtn.dispatchEvent(new Event('click', { bubbles: true }));
                await sleep(200);

                let rows = document.querySelectorAll(".ivu-table-body tbody tr");
                if(!rows || rows.length===0){ log("暂无数据，继续查询..."); return; }

                let targets = [target1,target2].filter(Boolean);
                let foundTarget = null;

                for(let target of targets){
                    let row = [...rows].find(r=>{
                        let nameCell = r.querySelector("td:nth-child(2) span");
                        return nameCell && nameCell.innerText.includes(target);
                    });

                    if(row){
                        let nameCell = row.querySelector("td:nth-child(2) span");
                        let seatCell = row.querySelector("td:nth-child(3) span");
                        let name = nameCell?nameCell.innerText.trim():"";
                        let remaining = seatCell?parseInt(seatCell.innerText):0;
                        log(`🎯 ${name} 当前余位：${remaining}`);

                        if(!alreadySaved && remaining>0 && !foundTarget){
                            foundTarget = row;
                        }
                    }
                }

                if(foundTarget){
                    let radioInput = foundTarget.querySelector('input[type=radio]');
                    if(radioInput){
                        radioInput.checked = true;
                        radioInput.dispatchEvent(new Event('change', { bubbles: true }));
                        log("✅ 已选择考点（直接操作数据）");
                        await sleep(saveDelay);
                    }

                    if(saveBtn){
                        alreadySaved = true;
                        saveBtn.dispatchEvent(new Event('click', { bubbles: true }));
                        log("✅ 已触发保存（直接操作事件）");

                        // 立即触发弹窗确认
                        let confirmTimer = setInterval(()=>{
                            let confirmBtn = [...document.querySelectorAll(".ivu-modal-confirm-footer button")]
                                .find(el=>el.innerText.trim()==="确定");
                            if(confirmBtn){
                                confirmBtn.dispatchEvent(new Event('click', { bubbles: true }));
                                log("✅ 已触发弹窗确认（直接操作事件）");
                                clearInterval(confirmTimer);
                                stopMonitor();
                            }
                        },50);
                    }
                }

            }catch(e){ log("监控异常：" + e.message); }
        }, interval);
    }

    function stopMonitor(){ if(timer){ clearInterval(timer); timer=null; log("⏹️ 监控已停止。"); } }

    document.getElementById("startBtn").addEventListener("click",startMonitor);
    document.getElementById("stopBtn").addEventListener("click",stopMonitor);

})();
