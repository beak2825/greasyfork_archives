// ==UserScript==
// @name         河南水利公报PDF抓取器
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  利用 GM_xmlhttpRequest 暴力绕过 CORS 跨域限制，解决白屏问题
// @author       yueyang & Copilot
// @match        https://slt.henan.gov.cn/*
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561595/%E6%B2%B3%E5%8D%97%E6%B0%B4%E5%88%A9%E5%85%AC%E6%8A%A5PDF%E6%8A%93%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561595/%E6%B2%B3%E5%8D%97%E6%B0%B4%E5%88%A9%E5%85%AC%E6%8A%A5PDF%E6%8A%93%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let pdfDoc = null;
    let isRunning = false;
    let pageCount = 0;
    let panel = null;
    let targetElement = null;

    // 获取真实的 window 对象
    const realWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // ==========================================
    // UI 面板
    // ==========================================
    function createPanel() {
        if (document.getElementById('gemini-pdf-panel')) return;

        panel = document.createElement('div');
        panel.id = 'gemini-pdf-panel';
        panel.style.cssText = `
            position: fixed; top: 10px; left: 50%; transform: translateX(-50%);
            z-index: 9999999; background: rgba(0, 0, 0, 0.9); color: #fff;
            padding: 15px; border-radius: 8px; border: 2px solid #ff4081;
            box-shadow: 0 0 25px rgba(0,0,0,0.8); font-family: "Microsoft YaHei", sans-serif;
            width: 320px; text-align: center;
        `;

        panel.innerHTML = `
            <h3 style="margin:0 0 10px 0; color:#ff4081;">🔥 抓取器 V5.0 (CORS破解)</h3>

            <div style="background:rgba(255,255,255,0.1); padding:5px; border-radius:4px; margin-bottom:10px;">
                <div style="font-size:12px; color:#ddd; text-align:left; line-height:1.6;">
                    <b>说明:</b> 此版本会强制下载图片数据，<br>解决"跨域(CORS)"导致的白屏问题。<br>
                    <b>步骤:</b> 1.瞄准 -> 2.测试翻页 -> 3.开始
                </div>
            </div>

            <div style="display:flex; gap:5px;">
                 <button id="g-aim" style="${btnStyle('#ff9800', 'flex:2')}">1. 瞄准 (画框)</button>
                 <button id="g-expand" style="${btnStyle('#9c27b0', 'flex:1')}">➕扩大</button>
            </div>

            <button id="g-flip-test" style="${btnStyle('#607d8b')}">🧪 测试翻页</button>

            <hr style="border:1px solid #444; margin:10px 0;">

            <div style="margin-bottom:5px;">已捕获: <b id="g-count" style="font-size:18px; color:#0ff;">0</b> 页</div>
            <button id="g-start" style="${btnStyle('#4caf50')}">▶️ 开始抓取</button>
            <button id="g-stop" style="display:none; ${btnStyle('#f44336')}">⏹️ 停止</button>
            <button id="g-save" style="${btnStyle('#2196f3')}" disabled>💾 导出PDF</button>

            <div style="margin-top:5px; color:#666; font-size:10px;">Alt+Q 隐藏</div>
        `;

        document.body.appendChild(panel);

        document.getElementById('g-aim').onclick = aimTarget;
        document.getElementById('g-expand').onclick = expandTarget;
        document.getElementById('g-flip-test').onclick = testFlipOnly;
        document.getElementById('g-start').onclick = startCapture;
        document.getElementById('g-stop').onclick = stopCapture;
        document.getElementById('g-save').onclick = savePDF;
    }

    function btnStyle(color, extra='') {
        return `display:block; width:100%; padding:8px 0; margin:4px 0; background:${color}; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:13px; ${extra}`;
    }

    // ==========================================
    // 1. 瞄准逻辑
    // ==========================================
    function aimTarget() {
        removeOutline();
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;

        panel.style.display = 'none';
        let el = document.elementFromPoint(x, y);
        panel.style.display = 'block';

        targetElement = el || document.body;
        addOutline(targetElement);
    }

    function expandTarget() {
        if (!targetElement || targetElement.tagName === 'BODY') return;
        removeOutline();
        targetElement = targetElement.parentElement;
        addOutline(targetElement);
    }

    function addOutline(el) {
        el.classList.add('g-outline');
        el.style.outline = "4px solid #ff0000";
        el.style.outlineOffset = "-4px";
    }

    function removeOutline() {
        document.querySelectorAll('.g-outline').forEach(e => {
            e.style.outline = '';
            e.classList.remove('g-outline');
        });
    }

    // ==========================================
    // 2. 核心功能：图片转 Base64 (CORS 绕过)
    // ==========================================
    function imgToBase64(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: function(response) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        resolve(reader.result);
                    }
                    reader.readAsDataURL(response.response);
                },
                onerror: function(err) {
                    console.error("GM_XHR 失败:", err);
                    resolve(url); // 失败则返回原链接，死马当活马医
                }
            });
        });
    }

    async function processImages(container) {
        const imgs = container.getElementsByTagName('img');
        const tasks = [];

        // 找出所有不是 base64 的网络图片
        for (let img of imgs) {
            if (img.src && img.src.startsWith('http')) {
                tasks.push(async () => {
                    try {
                        const newSrc = await imgToBase64(img.src);
                        img.src = newSrc; // 替换为本地数据
                    } catch(e) { console.error(e); }
                });
            }
        }

        // 并行处理所有图片下载
        if(tasks.length > 0) {
            console.log(`⚡ 正在转码 ${tasks.length} 张图片以绕过 CORS...`);
            await Promise.all(tasks.map(t => t()));
        }
    }

    // ==========================================
    // 3. 翻页逻辑
    // ==========================================
    function triggerFlip() {
        if (targetElement) {
            targetElement.focus();
            try {
                const rect = targetElement.getBoundingClientRect();
                const clickEvt = new MouseEvent('click', {
                    bubbles: true, cancelable: true, view: realWindow,
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2
                });
                targetElement.dispatchEvent(clickEvt);
            } catch(e) {}
        }
        const keyOptions = { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, which: 39, bubbles: true, cancelable: true, view: realWindow };
        const targets = [document, realWindow, document.body];
        if (targetElement) targets.push(targetElement);
        targets.forEach(t => {
            try { t.dispatchEvent(new KeyboardEvent('keydown', keyOptions)); t.dispatchEvent(new KeyboardEvent('keyup', keyOptions)); } catch (e) {}
        });
    }

    function testFlipOnly() { triggerFlip(); }

    // ==========================================
    // 4. 抓取逻辑
    // ==========================================
    async function startCapture() {
        if (isRunning) return;
        if (!targetElement) { alert("请先【步骤1】瞄准！"); return; }
        isRunning = true;
        pageCount = 0;
        const { jsPDF } = window.jspdf;
        const isLandscape = targetElement.clientWidth > targetElement.clientHeight;
        pdfDoc = new jsPDF({ orientation: isLandscape ? 'landscape' : 'portrait', compress: true });

        document.getElementById('g-start').style.display = 'none';
        document.getElementById('g-stop').style.display = 'block';
        document.getElementById('g-save').disabled = true;

        loopCapture();
    }

    async function loopCapture() {
        if (!isRunning) return;
        document.getElementById('g-stop').innerText = `⏳ 处理第 ${pageCount+1} 页...`;
        removeOutline();

        // 1. 等待翻页动画
        await new Promise(r => setTimeout(r, 2500));

        // 2.【关键】处理图片跨域
        await processImages(targetElement);

        try {
            // 3. 截图
            const canvas = await html2canvas(targetElement, {
                useCORS: true, // 这里虽然写了 true，但主要靠前面的 processImages
                allowTaint: true,
                backgroundColor: '#ffffff',
                scale: 1.5,
                logging: false,
                ignoreElements: (node) => node.id === 'gemini-pdf-panel'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            const w = canvas.width;
            const h = canvas.height;

            if (pageCount > 0) pdfDoc.addPage([w, h]);
            else pdfDoc.addPage([w, h]); // 简单处理第一页

            const pdfW = pdfDoc.internal.pageSize.getWidth();
            const pdfH = pdfDoc.internal.pageSize.getHeight();
            pdfDoc.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);

            pageCount++;
            document.getElementById('g-count').innerText = pageCount;
            addOutline(targetElement);

            // 4. 翻页
            triggerFlip();

            setTimeout(loopCapture, 500);
        } catch (e) {
            console.error(e);
            triggerFlip();
            setTimeout(loopCapture, 1000);
        }
    }

    function stopCapture() {
        isRunning = false;
        removeOutline();
        document.getElementById('g-start').style.display = 'block';
        document.getElementById('g-stop').style.display = 'none';
        document.getElementById('g-save').disabled = false;
        document.getElementById('g-stop').innerText = "⏹️ 停止";
        if (pdfDoc.internal.pages.length > pageCount + 1 && pageCount > 0) pdfDoc.deletePage(1);
    }

    function savePDF() {
        pdfDoc.save('河南水资源公报_终极版.pdf');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(createPanel, 1000));
    } else {
        setTimeout(createPanel, 1000);
    }

    document.addEventListener('keydown', e => {
        if(e.altKey && e.key.toLowerCase() === 'q') {
            if(panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    });

})();