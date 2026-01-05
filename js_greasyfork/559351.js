// ==UserScript==
// @name         长春工业大学做题系统-物理仿真版
// @namespace    http://tampermonkey.net/
// @version      21.6
// @description  解决变色但不勾选的问题，采用物理仿真点击事件。
// @match        *://ks.zjpxd.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559351/%E9%95%BF%E6%98%A5%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%81%9A%E9%A2%98%E7%B3%BB%E7%BB%9F-%E7%89%A9%E7%90%86%E4%BB%BF%E7%9C%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/559351/%E9%95%BF%E6%98%A5%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%81%9A%E9%A2%98%E7%B3%BB%E7%BB%9F-%E7%89%A9%E7%90%86%E4%BB%BF%E7%9C%9F%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let customBank = [];

    function createUI() {
        const panel = document.createElement('div');
        panel.id = "movablePanel";
        Object.assign(panel.style, {
            position: 'fixed', top: '10px', left: '10px', zIndex: '9999999',
            background: '#fff', borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '2px solid #6200ee',
            width: '240px', overflow: 'hidden'
        });

        const header = document.createElement('div');
        Object.assign(header.style, {
            background: '#6200ee', color: '#fff', padding: '10px',
            cursor: 'move', textAlign: 'center', fontWeight: 'bold', fontSize: '14px'
        });
        header.innerText = "🧬 基因匹配器 V21.6";
        panel.appendChild(header);

        const content = document.createElement('div');
        content.style.padding = "15px";
        content.innerHTML = `
            <input type="file" id="csvFile" accept=".csv" style="width:100%;font-size:12px;margin-bottom:12px;">
            <button id="runBtn" style="width:100%;padding:10px;background:#6200ee;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:bold;">开始匹配</button>
            <div id="status" style="font-size:12px;margin-top:10px;color:#333;font-weight:bold;text-align:center;">状态: 待命</div>
        `;
        panel.appendChild(content);
        document.body.appendChild(panel);

        // 拖拽
        let isDragging = false, offsetX, offsetY;
        header.onmousedown = (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        };
        document.onmousemove = (e) => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
        };
        document.onmouseup = () => isDragging = false;

        document.getElementById('csvFile').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.readAsText(file, 'GBK');
            reader.onload = (event) => parseCSV(event.target.result);
        };
        document.getElementById('runBtn').onclick = () => executeMatch();
    }

    function parseCSV(csvText) {
        customBank = [];
        const lines = csvText.split(/\r?\n/);
        lines.forEach(line => {
            const cleanLine = line.replace(/"/g, "");
            const parts = cleanLine.split(',');
            if (parts.length >= 2) {
                const kw = parts[0].trim();
                const ans = parts[1].trim().toUpperCase().replace(/[^A-D]/g, "");
                if (kw.length > 0) customBank.push({ q: kw, a: ans });
            }
        });
        document.getElementById('status').innerText = `已载入 ${customBank.length} 题`;
    }

    // --- 核心改进：仿真物理点击 ---
    function simulateSimClick(el) {
        if (!el) return;
        const events = ['mousedown', 'mouseup', 'click', 'change', 'input'];
        events.forEach(evtName => {
            const event = new MouseEvent(evtName, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            el.dispatchEvent(event);
        });
    }

    async function executeMatch() {
        const boxes = document.querySelectorAll('.content-box');
        let solved = 0;
        document.getElementById('status').innerText = "物理仿真匹配中...";

        for (let box of boxes) {
            const pageText = box.innerText.split('A.')[0];
            const pageGene = pageText.replace(/[^\u4e00-\u9fa5]/g, "");
            const pageNumbers = pageText.match(/\d+/g) || [];

            for (let item of customBank) {
                let isMatch = false;
                if (/^\d+$/.test(item.q)) {
                    if (pageNumbers.includes(item.q)) isMatch = true;
                } else {
                    const cleanItemQ = item.q.replace(/[^\u4e00-\u9fa5]/g, "");
                    if (pageGene.includes(cleanItemQ) && cleanItemQ.length > 1) isMatch = true;
                }

                if (isMatch) {
                    // 1. 深度搜索选项：兼容 hidden input 的情况
                    const answers = item.a.split('');

                    // 先清空该题所有已勾选的
                    const checkedOnes = box.querySelectorAll('input:checked');
                    for (let chk of checkedOnes) {
                        simulateSimClick(chk);
                        await new Promise(r => setTimeout(r, 150));
                    }

                    for (let letter of answers) {
                        // 寻找 input 或与之关联的 label 文本包含该字母的容器
                        let target = box.querySelector(`input[value="${letter}"]`);

                        // 如果找不到 input，可能是自定义 UI，通过字母文本查找
                        if (!target) {
                            const labels = box.querySelectorAll('label, span, a');
                            for (let l of labels) {
                                if (l.innerText.trim() === letter) {
                                    target = l;
                                    break;
                                }
                            }
                        }

                        if (target) {
                            simulateSimClick(target);
                            // 仿真延迟，给网页脚本留反应时间
                            await new Promise(r => setTimeout(r, 300));
                        }
                    }

                    box.style.background = "rgba(0, 255, 0, 0.1)"; // 匹配成功变为浅绿色
                    solved++;
                    break;
                }
            }
        }
        document.getElementById('status').innerText = `✅ 完成: ${solved}/${boxes.length}`;
    }

    createUI();
})();