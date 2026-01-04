// ==UserScript==
// @name         学习通作业导出助手
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  本脚本专为超星学习通（chaoxing.com）作业/考试查看页面设计，旨在将网页上的题目高保真地转化为可编辑的文档
// @author       spikeding
// @license MIT
// @match      *://mooc1.chaoxing.com/mooc2/work/view*
// @match      *://mooc1.chaoxing.com/exam-ans/exam/test/reVersionPaperMarkContentNew*
// @match      *://mooc1.chaoxing.com/mooc-ans/mooc2/work/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://unpkg.com/docx@7.1.1/build/index.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://unpkg.com/xlsx@0.17.0/dist/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/559656/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559656/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let parsedData = [];

    // 1. UI 样式表
    GM_addStyle(`
        #menu-trigger {
            position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px;
            background: #fff; border: 2px solid #ff9a9e; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 8px 24px rgba(255,154,158,0.25); z-index: 10002;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #menu-trigger:hover { transform: scale(1.15) rotate(10deg); }
        #menu-trigger:active { transform: scale(0.9); }
        #menu-trigger .icon { font-size: 28px; }

        #export-panel {
            position: fixed; bottom: 105px; right: 30px; width: 280px;
            background: #fff; border-radius: 26px; box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            z-index: 10001; padding: 24px; display: none; border: 1px solid #fdf2f2;
            transform-origin: bottom right; overflow: hidden;
        }
        .panel-show { display: block !important; animation: dropletIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        @keyframes dropletIn {
            0% { transform: scale(0.3) translateY(60px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        /* 按钮通用样式 */
        .btn-stack button {
            position: relative; overflow: hidden;
            width: 100%; padding: 12px; border-radius: 14px; cursor: pointer;
            font-size: 13px; border: 1.5px solid #ffe4e6; background: transparent;
            color: #ff9a9e; font-weight: 500;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* 悬停放大效果 */
        .btn-stack button:hover:not(:disabled) {
            transform: translateY(-2px) scale(1.04);
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        /* 按压瞬间反馈 */
        .btn-stack button:active:not(:disabled) { transform: scale(0.96); }

        /* 流光渐变动画 */
        @keyframes flow { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }

        .word-btn:hover:not(:disabled) { background: linear-gradient(90deg, #2b579a, #4a90e2, #2b579a) !important; background-size: 200% !important; animation: flow 2s infinite linear !important; color: white !important; border-color: transparent !important; }
        .pdf-btn:hover:not(:disabled) { background: linear-gradient(90deg, #f56c6c, #ff9a9e, #f56c6c) !important; background-size: 200% !important; animation: flow 2s infinite linear !important; color: white !important; border-color: transparent !important; }
        .xlsx-btn:hover:not(:disabled) { background: linear-gradient(90deg, #217346, #34a853, #217346) !important; background-size: 200% !important; animation: flow 2s infinite linear !important; color: white !important; border-color: transparent !important; }
        .md-btn:hover:not(:disabled) { background: linear-gradient(90deg, #444, #888, #444) !important; background-size: 200% !important; animation: flow 2s infinite linear !important; color: white !important; border-color: transparent !important; }

        /* 初始高亮状态 (红色系) */
        .highlight-red { background: linear-gradient(135deg, #ff9a9e, #fecfef) !important; color: white !important; border: none !important; }

        /* 解析成功后的绿色状态 */
        .success-green {
            background: #f0fdf4 !important;
            color: #22c55e !important;
            border-color: #22c55e !important;
            font-weight: bold;
        }

        /* 水滴波纹 */
        .ripple {
            position: absolute; background: rgba(255, 255, 255, 0.5);
            border-radius: 50%; transform: scale(0); animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes rippleEffect { to { transform: scale(4); opacity: 0; } }

        #log-area {
            background: #fdf2f2; border-radius: 12px; padding: 10px; font-size: 11px;
            color: #ff9a9e; margin-bottom: 15px; font-family: monospace;
            max-height: 60px; overflow-y: auto; border: 1px solid #ffe4e6;
        }
        .btn-stack { display: flex; flex-direction: column; gap: 10px; }
        button:disabled { opacity: 0.3 !important; cursor: not-allowed !important; filter: grayscale(1); transform: none !important; }

        #pdf-render-area { position: absolute; left: -9999px; width: 800px; background: #fff; padding: 50px; }
    `);

    // 水滴反馈函数
    function createRipple(event) {
        const btn = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        const rect = btn.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");
        const oldRipple = btn.getElementsByClassName("ripple")[0];
        if (oldRipple) oldRipple.remove();
        btn.appendChild(circle);
    }

    function addLog(msg) {
        const logArea = document.getElementById('log-area');
        const line = document.createElement('div');
        line.innerText = `> ${msg}`;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    // 核心解析逻辑
    function parsePage(e) {
        createRipple(e);
        parsedData = [];
        const pBtn = document.getElementById('p-btn');
        const eBtns = document.querySelectorAll('.e-btn');

        addLog("正在提取页面题目...");
        pBtn.innerText = "正在解析...";
        pBtn.disabled = true;

        const keepAns = document.getElementById('c-ans').checked;
        const items = document.querySelectorAll('.questionLi');

        if (items.length === 0) {
            addLog("未找到题目，请确认在作业查看页！");
            pBtn.disabled = false;
            pBtn.innerText = "1. 解析本页题目";
            return;
        }

        items.forEach((el, i) => {
            const type = el.querySelector('.colorShallow')?.innerText.replace(/[()（）]/g, '') || '题型';
            let title = el.querySelector('.qtContent')?.innerText.trim() || el.querySelector('.mark_name').innerText.replace(/^\d+\.\s*/, '').trim();
            title = title.replace(/\((?:\s*)\)|（(?:\s*)）/g, '(    )');
            const options = [];
            el.querySelectorAll('.mark_letter li').forEach(li => options.push(li.innerText.trim()));
            const ans = keepAns ? (el.querySelector('.rightAnswerContent')?.innerText.trim() || el.querySelector('.colorGreen')?.innerText.replace('正确答案:', '').trim() || "未记录") : "";
            parsedData.push({ id: i + 1, type, title, options, answer: ans });
        });

        setTimeout(() => {
            addLog(`提取完毕！共 ${parsedData.length} 道题目`);
            pBtn.disabled = false;
            pBtn.innerText = "✅ 解析成功";
            // 切换为绿色成功状态
            pBtn.classList.remove('highlight-red');
            pBtn.classList.add('success-green');
            eBtns.forEach(b => b.disabled = false);
        }, 500);
    }

    // 构建 UI
    const trigger = document.createElement('div');
    trigger.id = 'menu-trigger';
    trigger.innerHTML = '<span class="icon">🐱</span>';
    document.body.appendChild(trigger);

    const panel = document.createElement('div');
    panel.id = 'export-panel';
    panel.innerHTML = `
        <h3 style="text-align:center;margin:0 0 10px 0;color:#666;font-size:15px">学习通作业导出助手</h3>
        <div id="log-area">等待指令...</div>
        <div style="text-align:center;margin-bottom:12px;font-size:12px;color:#888">
            <input type="checkbox" id="c-ans" checked> <label for="c-ans" style="cursor:pointer">包含答案</label>
        </div>
        <div class="btn-stack">
            <button id="p-btn" class="highlight-red">1. 解析本页题目</button>
            <button class="e-btn word-btn" data-type="docx" disabled>导出 Word (.docx)</button>
            <button class="e-btn xlsx-btn" data-type="xlsx" disabled>导出 Excel (.xlsx)</button>
            <button class="e-btn pdf-btn" data-type="pdf" disabled>导出 PDF (.pdf)</button>
            <button class="e-btn md-btn" data-type="copy-md" disabled>复制 Markdown</button>
            <button id="goto-top" style="border:none;background:none;color:#ccc;font-size:11px;margin-top:5px;cursor:pointer">回到顶部 ↑</button>
        </div>
        <div id="pdf-render-area"></div>
    `;
    document.body.appendChild(panel);

    // 交互事件
    trigger.onclick = () => {
        const isShow = panel.classList.contains('panel-show');
        panel.classList.toggle('panel-show');
        trigger.querySelector('.icon').innerText = isShow ? "🐱" : "✖";
    };

    document.getElementById('p-btn').onclick = parsePage;
    document.getElementById('goto-top').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    document.getElementById('c-ans').onchange = () => {
        document.querySelectorAll('.e-btn').forEach(b => b.disabled = true);
        const pBtn = document.getElementById('p-btn');
        pBtn.innerText = "选项改变，请重新解析";
        pBtn.classList.remove('success-green');
        pBtn.classList.add('highlight-red');
    };

    panel.onclick = async (e) => {
        const type = e.target.getAttribute('data-type');
        if (!type || e.target.disabled) return;
        createRipple(e);

        const fName = (document.querySelector('.mark_title')?.innerText.trim() || "作业导出").replace(/[\\/:\*\?\"<>\|]/g, "_");

        if (type === 'copy-md') {
            let mdText = `# ${fName}\n\n`;
            parsedData.forEach(q => {
                mdText += `### ${q.id}. [${q.type}] ${q.title}\n`;
                q.options.forEach(opt => mdText += `- ${opt}\n`);
                if (q.answer) mdText += `\n> **正确答案：${q.answer}**\n\n---\n`;
                else mdText += `\n---\n`;
            });
            GM_setClipboard(mdText);
            addLog("Markdown 复制成功！");
            return;
        }

        addLog(`正在生成 ${type.toUpperCase()}...`);

        if (type === 'docx') {
            const { Document, Packer, Paragraph, TextRun, AlignmentType } = window.docx;
            const children = [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: fName, bold: true, font: "SimHei", size: 36 })] })];
            parsedData.forEach(q => {
                children.push(new Paragraph({ spacing: { before: 150, line: 240 }, children: [
                    new TextRun({ text: `${q.id}. `, bold: true, font: "SimHei", size: 22 }),
                    new TextRun({ text: `（${q.type}）`, font: "KaiTi", size: 22 }),
                    new TextRun({ text: q.title, bold: true, font: "SimHei", size: 22 })
                ]}));
                q.options.forEach(opt => children.push(new Paragraph({ spacing: { line: 240 }, indent: { left: 420 }, children: [new TextRun({ text: opt, font: "SimSun", size: 20 })] })));
                if (q.answer) children.push(new Paragraph({ spacing: { line: 240 }, children: [new TextRun({ text: `【答案】：${q.answer}`, bold: true, color: "1a73e8", font: "SimSun", size: 20 })] }));
            });
            saveAs(await Packer.toBlob(new Document({ sections: [{ children }] })), `${fName}.docx`);
            addLog("Word 下载已启动");
        } else if (type === 'xlsx') {
            const ws = XLSX.utils.json_to_sheet(parsedData.map(d => ({ "题号": d.id, "类型": d.type, "题目": d.title, "选项": d.options.join(" | "), "答案": d.answer })));
            const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            XLSX.writeFile(wb, `${fName}.xlsx`);
            addLog("Excel 下载已启动");
        } else if (type === 'pdf') {
            const renderArea = document.getElementById('pdf-render-area');
            renderArea.innerHTML = `<h1 style="text-align:center">${fName}</h1>`;
            parsedData.forEach(q => {
                renderArea.innerHTML += `<div style="margin-bottom:15px; padding:10px; border-bottom:1px solid #eee">
                    <b>${q.id}. （${q.type}） ${q.title}</b><br>${q.options.join('<br>')}<br>
                    <span style="color:#1a73e8">答案：${q.answer}</span></div>`;
            });
            const canvas = await html2canvas(renderArea, { scale: 2 });
            const doc = new window.jspdf.jsPDF('p', 'mm', [210, (canvas.height * 210) / canvas.width]);
            doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 210, (canvas.height * 210) / canvas.width);
            doc.save(`${fName}.pdf`);
            addLog("PDF 下载已启动");
        }
    };
})();