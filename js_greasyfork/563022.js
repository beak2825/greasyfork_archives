// ==UserScript==
// @name         Luogu Hotkeys & Fixed Toolbar
// @namespace    http://tampermonkey.net/
// @version      6.5
// @match        https://www.luogu.com.cn/*
// @grant        none
// @run-at       document-start
// @description 强制拦截换行：Ctrl+Enter 提交；Ctrl+' 运行；支持多样例自动聚焦验证码。
// @downloadURL https://update.greasyfork.org/scripts/563022/Luogu%20Hotkeys%20%20Fixed%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/563022/Luogu%20Hotkeys%20%20Fixed%20Toolbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const find = (t) => Array.from(document.querySelectorAll('a, button, span, div')).find(el => el.innerText.trim().includes(t));
    let lastKey = "";

    // --- 1. 创建强制置顶工具栏 ---
    function injectToolbar() {
        if (document.getElementById('custom-luogu-tools')) return;

        // 创建工具栏容器
        const toolbar = document.createElement('div');
        toolbar.id = 'custom-luogu-tools';
        // 使用 fixed 定位，确保它始终在最顶层
        toolbar.style = `
            position: fixed;
            top: 10px;
            right: 320px; 
            display: flex;
            gap: 6px;
            z-index: 999999;
            pointer-events: auto;
        `;

        const buttons = [
            { text: 'Q:聚焦', action: () => document.querySelector('.monaco-editor textarea')?.focus() },
            { text: 'L:记录', action: () => {
                const pid = getPid();
                if (pid) window.open(`https://www.luogu.com.cn/record/list?pid=${pid}`, '_blank');
                else alert("当前不是题目页面");
            }},
            { text: 'RE:重置', action: () => find('重置代码')?.click() || find('重置')?.click() },
            { text: 'P:复制', action: () => {
                const pid = getPid();
                if (pid) navigator.clipboard.writeText(pid).then(() => showTip("已复制: " + pid));
            }},
            { text: 'F:全屏', action: () => toggleFullScreen() },
            { text: 'H:跳转', action: () => triggerH() }
        ];

        buttons.forEach(btn => {
            const el = document.createElement('div');
            el.innerText = btn.text;
            el.style = `
                cursor: pointer;
                font-size: 12px;
                color: #fff;
                background: rgba(62, 175, 124, 0.9);
                padding: 3px 10px;
                border-radius: 20px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                font-family: sans-serif;
                white-space: nowrap;
            `;
            el.onmouseover = () => el.style.background = "#2c3e50";
            el.onmouseout = () => el.style.background = "rgba(62, 175, 124, 0.9)";
            el.onclick = btn.action;
            toolbar.appendChild(el);
        });

        document.body.appendChild(toolbar);
    }

    // --- 2. 逻辑辅助函数 ---
    function getPid() {
        const problemMatch = window.location.pathname.match(/\/problem\/([A-Z0-9_]+)/i);
        return problemMatch ? problemMatch[1].toUpperCase() : null;
    }

    function triggerH() {
        const target = prompt("请输入题号 (如: 1001, CF10A):");
        if (target) {
            let dest = target.trim();
            dest = /^\d+$/.test(dest) ? 'P' + dest : dest.toUpperCase();
            window.location.href = `https://www.luogu.com.cn/problem/${dest}`;
        }
    }

    function toggleFullScreen() {
        const nav = document.querySelector('header') || document.querySelector('.header-container');
        const side = document.querySelector('.side') || document.querySelector('.am-u-md-4');
        if (nav) nav.style.display = (nav.style.display === 'none' ? 'block' : 'none');
        if (side) side.style.display = (side.style.display === 'none' ? 'block' : 'none');
    }

    function showTip(msg) {
        const tip = document.createElement('div');
        tip.innerText = msg;
        tip.style = "position:fixed; top:70px; left:50%; transform:translateX(-50%); background:#34495e; color:white; padding:8px 16px; border-radius:4px; z-index:1000000;";
        document.body.appendChild(tip);
        setTimeout(() => tip.remove(), 1000);
    }

    // --- 3. 核心快捷键监听 ---
    window.addEventListener('keydown', function(e) {
        const pid = getPid();
        if (e.altKey) {
            if (e.code === 'KeyH') { e.preventDefault(); triggerH(); return; }
            if (pid) {
                if (e.code === 'KeyE' && lastKey === 'KeyR') { (find('重置代码') || find('重置'))?.click(); lastKey = ""; return; }
                if (e.code === 'KeyR') { lastKey = 'KeyR'; setTimeout(() => { lastKey = ""; }, 2000); }
                if (e.code === 'KeyF') { e.preventDefault(); toggleFullScreen(); return; }
                if (e.code === 'KeyQ') { e.preventDefault(); document.querySelector('.monaco-editor textarea')?.focus(); return; }
                if (e.code === 'KeyL') window.open(`https://www.luogu.com.cn/record/list?pid=${pid}`, '_blank');
                if (e.code === 'KeyP') { navigator.clipboard.writeText(pid).then(() => showTip("已复制: " + pid)); }
            }
        }
        // 1.8 提交与自测
        if (pid && e.ctrlKey && e.key === 'Enter') {
            const b = find('提交');
            if (b) { e.preventDefault(); e.stopImmediatePropagation(); document.activeElement.blur(); b.click(); }
        }
        if (pid && e.ctrlKey && (e.key === "'" || e.code === "Quote")) {
            const b = find('运行') || find('自测');
            if (b) { e.preventDefault(); b.click(); }
        }
    }, true);

    // 验证码自动聚焦
    const observer = new MutationObserver(() => {
        injectToolbar(); // 确保工具栏由于页面跳转刷新后依然存在
        const inp = document.querySelector('input[placeholder*="验证码"]');
        if (inp && document.activeElement !== inp) {
            inp.focus();
            inp.oninput = function() { if (this.value.length === 4) (document.querySelector('.am-modal-btn-bold') || find('确定'))?.click(); };
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();