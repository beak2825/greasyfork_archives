// ==UserScript==
// @name         WhatsApp Web 定时发送器 (v20.8 F5/Shift修复版)
// @namespace    http://tampermonkey.net/
// @version      20.8
// @description  基于v20.6高效架构，修复F5刷新和Shift键失效问题，保留核心逻辑
// @author       Edge
// @license MIT
// @match        https://web.whatsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558385/WhatsApp%20Web%20%E5%AE%9A%E6%97%B6%E5%8F%91%E9%80%81%E5%99%A8%20%28v208%20F5Shift%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558385/WhatsApp%20Web%20%E5%AE%9A%E6%97%B6%E5%8F%91%E9%80%81%E5%99%A8%20%28v208%20F5Shift%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. 核心参数 (完全不动) ===
    const CFG = { CHECK: 1000, CONFLICT: 3000, SEARCH: 1000, ACTION: 1500, TYPE: 15, PRE_SPACE: 300, REACT: 500 };

    // === 2. 高效工具函数 ===
    const qs = (s, p=document) => p.querySelector(s);
    const qsa = (s, p=document) => Array.from(p.querySelectorAll(s));
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    let tasks = [];
    try { tasks = JSON.parse(localStorage.getItem('wa_tasks') || '[]'); } catch (e) { tasks = []; }
    const save = () => localStorage.setItem('wa_tasks', JSON.stringify(tasks));

    // === 3. UI 初始化 ===
    function initUI() {
        if(qs('#wa-floater')) return;

        // 注入样式
        const style = document.createElement('style');
        style.innerHTML = `
            #wa-floater { position:fixed; top:50%; left:10px; margin-top:-17.5px; width:35px; height:35px; background:#00a884; border-radius:50%; z-index:100001; cursor:pointer; color:#fff; display:flex; align-items:center; justify-content:center; font-size:18px; user-select:none; box-shadow:0 4px 10px rgba(0,0,0,0.3); transition:transform 0.1s; }
            #wa-floater:active { transform:scale(0.95); }
            #wa-panel { display:none; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:100000; background:#fff; padding:15px; border-radius:8px; box-shadow:0 50px 100px rgba(0,0,0,0.5); width:300px; font-family:arial,sans-serif; font-size:13px; color:#333; }
            .wa-input { width:100%; padding:6px; border:1px solid #ddd; border-radius:4px; margin-bottom:10px; box-sizing:border-box; }
            .wa-btn { width:100%; background:#00a884; color:#fff; border:none; padding:10px; border-radius:4px; cursor:pointer; }
            .wa-close { float:right; cursor:pointer; color:#999; }
        `;
        document.head.appendChild(style);

        // 注入 HTML
        const div = document.createElement('div');
        div.innerHTML = `
            <div id="wa-floater">✉️</div>
            <div id="wa-panel">
                <div style="margin-bottom:15px;border-bottom:1px solid #eee;padding-bottom:10px;"><span class="wa-close">✖</span><h3 style="margin:0;color:#00a884;">定时助手 v20.8</h3></div>
                <label>联系人全名:</label><input id="wa-name" class="wa-input">
                <label>发送时间:</label><input type="datetime-local" id="wa-time" class="wa-input" style="cursor:pointer;">
                <label>消息内容:</label><textarea id="wa-msg" class="wa-input" style="height:60px;"></textarea>
                <button id="wa-add" class="wa-btn">添加任务</button>
                <div id="wa-list" style="margin-top:15px;max-height:60vh;overflow-y:auto;"></div>
            </div>`;
        document.body.appendChild(div);

        const floater = qs('#wa-floater'), panel = qs('#wa-panel'), timeInput = qs('#wa-time');

        // === 事件绑定 ===

        // 拖拽逻辑
        let isDrag = false, startX, startY, initL, initT;
        floater.onmousedown = e => {
            isDrag = false; startX = e.clientX; startY = e.clientY;
            const r = floater.getBoundingClientRect(); initL = r.left; initT = r.top;
            document.onmousemove = em => {
                if (Math.abs(em.clientX - startX) > 3) isDrag = true;
                if (isDrag) { floater.style.left = (initL + em.clientX - startX)+'px'; floater.style.top = (initT + em.clientY - startY)+'px'; floater.style.marginTop = '0'; }
            };
            document.onmouseup = () => document.onmousemove = null;
        };

        // 面板开关
        floater.onclick = () => !isDrag && (panel.style.display = panel.style.display === 'block' ? 'none' : 'block');
        qs('.wa-close', panel).onclick = () => panel.style.display = 'none';

        // [重点修复]: 使用 addEventListener 替代 onkeydown，解决 F5 和 Shift 问题
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && panel.style.display === 'block') {
                panel.style.display = 'none';
            }
        });

        // 日历开关
        let isPicker = false;
        timeInput.onclick = e => {
            e.preventDefault();
            if (isPicker) { timeInput.blur(); isPicker = false; }
            else { try { timeInput.showPicker(); isPicker = true; } catch(err) { timeInput.focus(); } }
        };
        timeInput.onblur = () => setTimeout(() => isPicker = false, 200);

        // 任务逻辑
        qs('#wa-add').onclick = () => {
            const [n, t, m] = [qs('#wa-name').value.trim(), qs('#wa-time').value, qs('#wa-msg').value];
            if (!n || !t || !m) return alert('请补全信息');
            if (new Date(t).getTime() < Date.now()) return alert('时间无效');
            tasks.push({ id: Date.now(), name: n, runTime: new Date(t).getTime(), msg: m, status: 'pending' });
            save(); render();
            panel.style.display = 'none'; qs('#wa-msg').value = '';
        };
        qs('#wa-list').onclick = e => {
            if (e.target.dataset.del) { tasks = tasks.filter(t => t.id !== +e.target.dataset.del); save(); render(); }
        };
        render();
    }

    function render() {
        const list = qs('#wa-list');
        if (!tasks.length) return list.innerHTML = '<div style="text-align:center;color:#999;padding:10px;">无任务</div>';
        list.innerHTML = tasks.map(t => {
            const c = t.status === 'done' ? '#00a884' : t.status === 'error' ? '#d00' : '#ffa500';
            return `<div style="background:#f9f9f9;margin-bottom:8px;padding:8px;border-left:4px solid ${c};">
                <div><strong>${t.name}</strong> <span style="font-size:11px;color:${c}">${t.status}</span></div>
                <div style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.msg}</div>
                <div style="text-align:right;cursor:pointer;color:#d00;font-size:11px;" data-del="${t.id}">删除</div>
            </div>`;
        }).join('');
    }

    // === 4. 核心自动化逻辑 (完全保留原样) ===
    function simulateMouse(element, type) {
        element.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true }));
    }

    function setCaretPosition(elem) {
        elem.focus();
        window.getSelection().removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(elem);
        range.collapse(true);
        window.getSelection().addRange(range);
    }

    async function classicHybridInput(element, text) {
        element.focus();
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            element.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
            document.execCommand('insertText', false, char);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
            await sleep(CFG.TYPE);
        }
        await sleep(CFG.PRE_SPACE);
        element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
        document.execCommand('insertText', false, ' ');
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }));
        await sleep(CFG.REACT);
        document.execCommand('delete', false, null);
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    async function executeTask(task) {
        console.log(`[WA] Run: ${task.name}`);
        await sleep(CFG.CONFLICT);
        try {
            const searchBox = qsa('div[contenteditable="true"]').find(el => !el.closest('footer') && el.offsetParent);
            if (!searchBox) throw "Search box missing";

            simulateMouse(searchBox, 'mousedown'); simulateMouse(searchBox, 'click'); setCaretPosition(searchBox);
            document.execCommand('selectAll', false, null); document.execCommand('delete', false, null);
            await sleep(500);

            await classicHybridInput(searchBox, task.name);
            await sleep(CFG.SEARCH);

            const target = qsa('div[role="listitem"]').find(c => c.innerText.includes(task.name));
            if (!target) {
                searchBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
            } else {
                simulateMouse(target, 'mousedown'); simulateMouse(target, 'click');
            }

            await sleep(CFG.ACTION);

            const msgBox = qs('footer div[contenteditable="true"]');
            if (!msgBox) throw "Message box missing";

            simulateMouse(msgBox, 'click'); setCaretPosition(msgBox); await sleep(300);
            msgBox.focus(); document.execCommand('insertText', false, task.msg);
            msgBox.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(800);

            const sendBtn = qs('span[data-icon="send"]');
            if (sendBtn) {
                const b = sendBtn.closest('button') || sendBtn.parentElement;
                simulateMouse(b, 'mousedown'); simulateMouse(b, 'click');
            } else {
                msgBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
            }
            task.status = 'done';
        } catch (e) { console.error(e); task.status = 'error'; }
        save(); render();
    }

    let loaded = false;
    window.addEventListener('load', () => setTimeout(() => { initUI(); loaded = true; console.log("[WA] Ready"); }, 4000));
    setInterval(() => {
        if (!loaded) return;
        const now = Date.now();
        tasks.forEach(t => {
            if (t.status === 'pending' && t.runTime <= now) { t.status = 'processing'; render(); executeTask(t); }
        });
    }, CFG.CHECK);
})();