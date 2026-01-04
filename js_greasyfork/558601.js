// ==UserScript==
// @name         Dewu Fun110 Hook (Simple & Clean)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Simple hook to print args index and result c/d
// @author       You
// @match        *://*.dewu.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/558601/Dewu%20Fun110%20Hook%20%28Simple%20%20Clean%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558601/Dewu%20Fun110%20Hook%20%28Simple%20%20Clean%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;

    // ==========================================
    // UI 配置
    // ==========================================
    const PANEL_ID = 'dewu-v3-panel';
    const LOG_VIEW_ID = 'dewu-view-log';
    const INVOKE_VIEW_ID = 'dewu-view-invoke';
    const RPC_VIEW_ID = 'dewu-view-rpc';
    const MODAL_ID = 'dewu-v3-modal';

    // 全局 WebSocket 对象
    let ws = null;

    function createPanel() {
        if (document.getElementById(PANEL_ID)) return;
        const body = document.body || document.documentElement;
        if (!body) return setTimeout(createPanel, 100);

        const style = document.createElement('style');
        style.innerHTML = `
            #${PANEL_ID} {
                position: fixed; top: 0; left: 0; width: 100%; height: 65vh;
                background: rgba(0,0,0,0.95); color: #fff; z-index: 999999;
                display: flex; flex-direction: column;
                border-bottom: 2px solid #00ff00;
                font-family: monospace; font-size: 11px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                transition: height 0.3s ease;
                -webkit-user-select: text !important; user-select: text !important;
            }
            #${PANEL_ID}.minimized { height: 40px; overflow: hidden; }
            
            .dewu-bar { height: 40px; background: #222; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; border-bottom: 1px solid #444; flex-shrink: 0; }
            .dewu-title { color: #00ff00; font-weight: bold; }
            .dewu-btn { background: #444; color: #fff; border: 1px solid #555; padding: 3px 8px; border-radius: 4px; font-size: 11px; margin-left: 5px; }
            
            .dewu-tabs { display: flex; background: #1a1a1a; border-bottom: 1px solid #333; flex-shrink: 0; }
            .dewu-tab { flex: 1; text-align: center; padding: 8px 0; cursor: pointer; color: #888; border-bottom: 2px solid transparent; }
            .dewu-tab.active { color: #fff; border-bottom: 2px solid #00aaff; background: #2a2a2a; font-weight: bold; }

            .dewu-content { flex: 1; overflow-y: auto; padding: 5px; display: none; }
            .dewu-content.active { display: block; }

            /* RPC 界面样式 */
            .rpc-status { padding: 10px; text-align: center; font-size: 12px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #444; }
            .rpc-status.connected { background: #004400; border-color: #00ff00; color: #00ff00; }
            .rpc-status.disconnected { background: #440000; border-color: #ff0000; color: #ff0000; }
            
            .rpc-input { width: 70%; background: #333; border: 1px solid #555; color: #fff; padding: 5px; border-radius: 3px; }
            .rpc-log { font-size: 10px; color: #aaa; margin-top: 5px; border-top: 1px dashed #444; padding-top: 5px; }

            /* 其他通用样式保持不变... */
            .log-group { border-bottom: 1px dashed #555; margin-bottom: 10px; padding: 5px; background: rgba(255,255,255,0.05); }
            .log-row { margin-top: 4px; word-break: break-all; white-space: pre-wrap; color: #ddd; }
            .dewu-copy-btn { border: 1px solid #00aaff; color: #00aaff; background: transparent; border-radius: 3px; font-size: 10px; padding: 1px 5px; }
            .inv-row { margin-bottom: 8px; }
            .inv-label { display: block; color: #aaa; margin-bottom: 2px; }
            .inv-input { width: 98%; background: #333; color: #fff; border: 1px solid #555; border-radius: 3px; padding: 4px; font-family: monospace; font-size: 11px; }
            textarea.inv-input { height: 60px; resize: vertical; }
            .inv-check-row { margin: 5px 0; display: flex; align-items: center; color: #ff9900; }
            #btn-run { width: 100%; background: #006600; color: #fff; border: none; padding: 8px; border-radius: 4px; margin-top: 5px; font-weight: bold; }
            #inv-result-box { margin-top: 10px; border-top: 1px solid #444; padding-top: 5px; }
            #${MODAL_ID} { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000000; justify-content: center; align-items: center; flex-direction: column; }
            #${MODAL_ID}.active { display: flex; }
            #dewu-textarea-copy { width: 90%; height: 60%; background: #fff; color: #000; padding: 10px; }
        `;
        document.head.appendChild(style);

        const div = document.createElement('div');
        div.id = PANEL_ID;
        div.innerHTML = `
            <div class="dewu-bar">
                <span class="dewu-title">Dewu Hook v3.0</span>
                <div>
                    <button id="btn-min" class="dewu-btn">最小化</button>
                    <button id="btn-cls" class="dewu-btn">清空日志</button>
                </div>
            </div>
            
            <div class="dewu-tabs">
                <div class="dewu-tab active" data-target="${LOG_VIEW_ID}">📊 监控</div>
                <div class="dewu-tab" data-target="${INVOKE_VIEW_ID}">⚡ 手动</div>
                <div class="dewu-tab" data-target="${RPC_VIEW_ID}">🌐 远程RPC</div>
            </div>

            <div id="${LOG_VIEW_ID}" class="dewu-content active">
                <div style="color:#666; text-align:center; margin-top:20px;">等待调用...</div>
            </div>

            <div id="${INVOKE_VIEW_ID}" class="dewu-content">
                <div class="inv-row"><span class="inv-label">Body:</span><textarea id="inv-body" class="inv-input" placeholder='{"spuId":...}'></textarea></div>
                <div class="inv-check-row"><input type="checkbox" id="inv-as-string"><label for="inv-as-string">Body传字符串</label></div>
                <div class="inv-row"><span class="inv-label">URL:</span><input id="inv-url" class="inv-input" type="text" /></div>
                <div class="inv-row"><span class="inv-label">Headers:</span><textarea id="inv-head" class="inv-input" placeholder='{"shumeiId":...}'></textarea></div>
                <div style="display:flex; justify-content:space-between;">
                     <button id="btn-template" class="dewu-btn" style="width:40%">填入模板</button>
                     <button id="btn-run" style="width:55%">🔥 加密</button>
                </div>
                <div id="inv-result-box"><pre id="inv-output" style="color:#ddd; white-space:pre-wrap; word-break:break-all;">...</pre></div>
            </div>

            <div id="${RPC_VIEW_ID}" class="dewu-content">
                <div id="rpc-status-box" class="rpc-status disconnected">未连接</div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <input id="rpc-ws-url" class="rpc-input" type="text" value="ws://192.168.1.XX:8765/phone" placeholder="ws://IP:8765/phone" />
                    <button id="btn-rpc-connect" class="dewu-btn" style="background:#00aaff; border:none; padding: 6px 12px;">连接</button>
                </div>
                <div style="font-size:11px; color:#aaa; margin-bottom:5px;">RPC日志:</div>
                <div id="rpc-log-box" style="height:200px; overflow-y:auto; background:#111; padding:5px; font-family:monospace; color:#ccc;"></div>
            </div>
        `;
        body.appendChild(div);

        // 弹窗
        const modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.innerHTML = `
            <div style="color:#fff; margin-bottom:10px;">长按全选复制</div>
            <textarea id="dewu-textarea-copy" readonly></textarea>
            <button id="dewu-modal-close" style="margin-top:15px; padding:10px 30px; background:#00aaff; border:none; color:white; border-radius:5px;">关闭</button>
        `;
        body.appendChild(modal);

        bindEvents();
    }

    function addRpcLog(msg, color="#ccc") {
        const box = document.getElementById('rpc-log-box');
        if(box) {
            const time = new Date().toLocaleTimeString();
            box.innerHTML = `<div style="color:${color}">[${time}] ${msg}</div>` + box.innerHTML;
        }
    }

    function bindEvents() {
        const panel = document.getElementById(PANEL_ID);
        const btnMin = document.getElementById('btn-min');
        const btnCls = document.getElementById('btn-cls');
        const modal = document.getElementById(MODAL_ID);

        btnMin.onclick = () => { panel.classList.toggle('minimized'); btnMin.innerText = panel.classList.contains('minimized') ? "展开" : "最小化"; };
        btnCls.onclick = () => document.getElementById(LOG_VIEW_ID).innerHTML = '';
        document.getElementById('dewu-modal-close').onclick = () => modal.classList.remove('active');

        const tabs = document.querySelectorAll('.dewu-tab');
        tabs.forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.dewu-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.dewu-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.getAttribute('data-target')).classList.add('active');
            };
        });

        // 模板
        document.getElementById('btn-template').onclick = () => {
            document.getElementById('inv-body').value = '{"spuId":25705778,"scene":"commodityDetail"}';
            document.getElementById('inv-url').value = 'https://app.dewu.com/api/v1/h5/commodity/detail/detail';
            document.getElementById('inv-head').value = '{"shumeiId": "20251211_test"}';
            document.getElementById('inv-as-string').checked = false;
        };

        // 手动运行
        document.getElementById('btn-run').onclick = () => {
            runEncryption(
                document.getElementById('inv-body').value,
                document.getElementById('inv-url').value,
                document.getElementById('inv-head').value,
                document.getElementById('inv-as-string').checked,
                (res) => {
                    const out = document.getElementById('inv-output');
                    out.innerHTML = JSON.stringify(res, null, 2);
                    out.style.color = "#00ff00";
                },
                (err) => {
                    const out = document.getElementById('inv-output');
                    out.innerHTML = "❌ " + err;
                    out.style.color = "red";
                }
            );
        };

        // RPC 连接
        document.getElementById('btn-rpc-connect').onclick = () => {
            const url = document.getElementById('rpc-ws-url').value;
            connectRpc(url);
        };
    }

    // 核心加密封装
    function runEncryption(bodyRaw, urlStr, headRaw, isStringMode, onSuccess, onError) {
        if (!window.fun || !window.fun.Fun110) { onError("Fun110 not ready"); return; }
        try {
            let finalBody;
            if (isStringMode) finalBody = bodyRaw;
            else try { finalBody = JSON.parse(bodyRaw); } catch(e) { onError("Body JSON Error"); return; }

            let headObj;
            try { headObj = JSON.parse(headRaw); } catch(e) { onError("Headers JSON Error"); return; }

            const args = [finalBody, "post", urlStr, true, headObj];
            const res = window.fun.Fun110.apply(window.fun, args);
            onSuccess(res);
        } catch(e) { onError(e.message); }
    }

    // WebSocket 逻辑
    function connectRpc(url) {
        if (ws) { ws.close(); }
        addRpcLog(`尝试连接: ${url}...`, "#ff9900");
        
        try {
            ws = new WebSocket(url);
            ws.onopen = () => {
                document.getElementById('rpc-status-box').className = 'rpc-status connected';
                document.getElementById('rpc-status-box').innerText = '✅ 已连接服务器';
                addRpcLog("连接成功！", "#00ff00");
            };
            ws.onclose = () => {
                document.getElementById('rpc-status-box').className = 'rpc-status disconnected';
                document.getElementById('rpc-status-box').innerText = '❌ 连接断开';
                addRpcLog("连接断开", "red");
                ws = null;
            };
            ws.onerror = (e) => addRpcLog("Socket错误", "red");

            // 核心：处理来自电脑的请求
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    addRpcLog(`收到请求: ${data.url ? data.url.substring(0,20)+'...' : '未知'}`, "#00aaff");

                    // 默认配置
                    const bodyVal = data.body || "{}"; // 可以是对象或字符串
                    const urlVal = data.url || "";
                    const headVal = data.headers || {};
                    const isStr = (typeof bodyVal === 'string'); // 如果传来的是字符串，就按字符串加密

                    // 这里的 bodyRaw 和 headRaw 为了适配 runEncryption 逻辑需要转一下
                    const bodyInput = isStr ? bodyVal : JSON.stringify(bodyVal);
                    const headInput = JSON.stringify(headVal);

                    runEncryption(bodyInput, urlVal, headInput, isStr, 
                        (res) => {
                            // 成功回传
                            ws.send(JSON.stringify({ status: "ok", data: res }));
                            addRpcLog("✅ 计算完成，已回传", "#00ff00");
                        },
                        (err) => {
                            // 失败回传
                            ws.send(JSON.stringify({ status: "error", msg: err }));
                            addRpcLog("❌ 计算失败: " + err, "red");
                        }
                    );

                } catch (e) {
                    addRpcLog("消息解析失败: " + e.message, "red");
                }
            };
        } catch (e) {
            addRpcLog("创建WS失败: " + e.message, "red");
        }
    }

    createPanel();
    window.addEventListener('DOMContentLoaded', createPanel);

    // ==========================================
    // 常规 Hook 逻辑 (同 v2.2)
    // ==========================================
    function safeStr(v) { try { return typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v); } catch(e) { return '[Err]'; } }
    function showCopyModal(c) { const m=document.getElementById(MODAL_ID),t=document.getElementById('dewu-textarea-copy'); if(m&&t){t.value=c;m.classList.add('active');t.focus();t.select();} }
    
    let _fun = window.fun;
    function hookFun(target) {
        if (target && target.Fun110 && !target.Fun110.__hooked) {
            const origin = target.Fun110;
            target.Fun110 = function(...args) {
                if (!document.getElementById(PANEL_ID)) createPanel();
                const logBox = document.getElementById(LOG_VIEW_ID);
                if (logBox && logBox.innerText.includes('等待')) logBox.innerHTML = '';
                
                const group = document.createElement('div');
                group.className = 'log-group';
                
                const header = document.createElement('div');
                header.style.cssText = "display:flex; justify-content:space-between; margin-bottom:5px; border-bottom:1px solid #444; padding-bottom:5px;";
                header.innerHTML = `<span style="color:#aaa;">Args: ${args.length}</span><button class="dewu-copy-btn">🔍 全屏复制</button>`;
                group.appendChild(header);
                
                // 绑定复制
                header.querySelector('button').onclick = () => showCopyModal(JSON.stringify({t:new Date().toLocaleTimeString(),args,res},null,2));

                args.forEach((arg, i) => {
                     const color = (typeof arg === 'string') ? '#ff9900' : '#ffcc00';
                     group.innerHTML += `<div class="log-row"><span style="color:${color}">[P${i+1}]</span> <span>${safeStr(arg)}</span></div>`;
                });

                let res;
                try { res = origin.apply(this, args); } catch (e) { group.innerHTML+=`<div style="color:red">Err:${e.message}</div>`; if(logBox)logBox.prepend(group); throw e;}
                
                if (res) {
                    group.innerHTML += `<div style="border-top:1px solid #444; margin-top:5px; padding-top:4px; color:#0f0;">[Result]</div>`;
                    group.innerHTML += `<div class="log-row">c: ${res.c||'-'}</div><div class="log-row">d: ${res.d||'-'}</div>`;
                }
                
                if (logBox) logBox.prepend(group);
                return res;
            };
            target.Fun110.__hooked = true;
            console.log("Hook Ready v3.0 RPC");
        }
        return target;
    }
    if (_fun) hookFun(_fun);
    Object.defineProperty(window, 'fun', { get:()=>_fun, set:(v)=>_fun=hookFun(v), configurable:true });
})();