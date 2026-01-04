// ==UserScript==
// @name         中华典藏网 - HTML/TXT/EPUB 全功能导出 (完美版)
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  支持三种格式导出：带阅读器功能的 HTML、标准 TXT、直接生成标准 EPUB（含目录）。
// @author       Gemini
// @match        https://www.diancangwang.cn/*/*/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560696/%E4%B8%AD%E5%8D%8E%E5%85%B8%E8%97%8F%E7%BD%91%20-%20HTMLTXTEPUB%20%E5%85%A8%E5%8A%9F%E8%83%BD%E5%AF%BC%E5%87%BA%20%28%E5%AE%8C%E7%BE%8E%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560696/%E4%B8%AD%E5%8D%8E%E5%85%B8%E8%97%8F%E7%BD%91%20-%20HTMLTXTEPUB%20%E5%85%A8%E5%8A%9F%E8%83%BD%E5%AF%BC%E5%87%BA%20%28%E5%AE%8C%E7%BE%8E%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. UI 界面 ---
    const controlPanel = document.createElement('div');
    controlPanel.id = 'book-export-panel';
    controlPanel.innerHTML = `
        <div style="font-weight:bold; margin-bottom:10px;">小说导出 v13.0</div>
        <button id="export-epub-btn" class="export-btn btn-epub">📚 导出标准 EPUB</button>
        <button id="export-html-btn" class="export-btn btn-html">🌟 导出精美 HTML</button>
        <button id="export-txt-btn" class="export-btn btn-txt">📄 导出纯文本 TXT</button>
        <div id="export-status">准备就绪</div>
    `;
    document.body.appendChild(controlPanel);

    GM_addStyle(`
        #book-export-panel { position: fixed; top: 20px; right: 20px; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 9999; width: 180px; text-align: center; font-family: sans-serif; }
        .export-btn { color: white; border: none; padding: 10px; cursor: pointer; border-radius: 8px; font-weight: bold; width: 100%; margin-bottom: 8px; font-size: 13px; }
        .btn-epub { background: linear-gradient(135deg, #ff9a9e, #fad0c4); color: #8b4513 !important; }
        .btn-html { background: linear-gradient(135deg, #6e8efb, #a777e3); }
        .btn-txt { background: linear-gradient(135deg, #42e695, #3bb2b8); }
        .export-btn:disabled { opacity: 0.5; cursor: wait; }
        #export-status { font-size: 12px; color: #666; }
    `);

    // --- 2. 核心抓取逻辑 ---
    async function getBookData() {
        const bookName = document.querySelector('h1').textContent.trim();
        const author = document.querySelector('.zuozhe').textContent.replace('作者：', '').trim();
        const intro = document.querySelector('.fmtab_text')?.textContent.trim() || "暂无简介";
        const chapterLinks = Array.from(document.querySelectorAll('#booklist ul li a'));
        const chapters = [];
        const status = document.getElementById('export-status');

        for (let i = 0; i < chapterLinks.length; i++) {
            status.textContent = `抓取中: ${i + 1}/${chapterLinks.length}`;
            try {
                await new Promise(r => setTimeout(r, 400)); // 延迟保护
                const resp = await fetch(chapterLinks[i].href);
                const html = await resp.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const contentBody = doc.querySelector('#pageview');
                let paras = [];
                if (contentBody) {
                    contentBody.querySelectorAll('p').forEach(p => {
                        let txt = p.textContent.trim().replace(/[a-zA-Z0-9]{3}中华典藏网$/, '');
                        if (txt && !txt.includes('中华典藏网')) paras.push(txt);
                    });
                }
                chapters.push({ title: chapterLinks[i].textContent.trim(), paras });
            } catch (e) {
                chapters.push({ title: chapterLinks[i].textContent.trim(), paras: ["内容加载失败"] });
            }
        }
        return { bookName, author, intro, chapters };
    }

    // --- 3. 导出 EPUB 逻辑 ---
    async function saveAsEpub(data) {
        const zip = new JSZip();
        zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
        zip.folder("META-INF").file("container.xml", `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);
        const oebps = zip.folder("OEBPS");

        let manifest = "";
        let spine = "";
        let ncxToc = "";

        data.chapters.forEach((ch, i) => {
            const fileName = `chapter_${i}.xhtml`;
            const content = `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${ch.title}</title><style>p{text-indent:2em;margin:1em 0;} h2{text-align:center;color:#8b4513;}</style></head><body><h2>${ch.title}</h2>${ch.paras.map(p => `<p>${p}</p>`).join('')}</body></html>`;
            oebps.file(fileName, content);
            manifest += `<item id="ch${i}" href="${fileName}" media-type="application/xhtml+xml"/>\n`;
            spine += `<itemref idref="ch${i}"/>\n`;
            ncxToc += `<navPoint id="nav${i}" playOrder="${i+1}"><navLabel><text>${ch.title}</text></navLabel><content src="${fileName}"/></navPoint>\n`;
        });

        oebps.file("intro.xhtml", `<?xml version="1.0" encoding="utf-8"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>简介</title></head><body><h1>${data.bookName}</h1><p>作者：${data.author}</p><hr/><p>${data.intro}</p></body></html>`);

        oebps.file("content.opf", `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="uuid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${data.bookName}</dc:title><dc:creator>${data.author}</dc:creator><dc:language>zh-CN</dc:language></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="intro" href="intro.xhtml" media-type="application/xhtml+xml"/>${manifest}</manifest><spine toc="ncx"><itemref idref="intro"/>${spine}</spine></package>`);

        oebps.file("toc.ncx", `<?xml version="1.0" encoding="utf-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="uuid"/></head><docTitle><text>${data.bookName}</text></docTitle><navMap><navPoint id="pi" playOrder="0"><navLabel><text>内容简介</text></navLabel><content src="intro.xhtml"/></navPoint>${ncxToc}</navMap></ncx>`);

        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `${data.bookName}.epub`);
    }

    // --- 4. 导出 HTML 逻辑 (含之前所有的 UI 优化) ---
    function saveAsHtml(data) {
        let catalog = "", body = "";
        data.chapters.forEach((ch, i) => {
            const id = `ch-${i}`;
            catalog += `<li><a href="#${id}">${ch.title}</a></li>`;
            body += `<div class="chapter" id="${id}"><h2 class="chapter-title">${ch.title}</h2>${ch.paras.map(p => `<p>${p}</p>`).join('')}</div>`;
        });

        const htmlTemplate = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${data.bookName}</title>
<style>
    :root { --bg: #f4f1e7; --text: #333; --sidebar-bg: #e8e4d8; --font-size: 22px; }
    body { background: var(--bg); color: var(--text); font-family: serif; line-height: 1.8; margin: 0; display: flex; transition: background 0.3s; }
    #sidebar { width: 280px; height: 100vh; position: fixed; background: var(--sidebar-bg); border-right: 1px solid rgba(0,0,0,0.05); overflow-y: auto; padding: 25px; box-sizing: border-box; z-index: 10; }
    #sidebar a { text-decoration: none; color: #666; font-size: 15px; }
    #sidebar a:hover { color: #8b4513; }
    #main { margin-left: 280px; flex: 1; padding: 40px 5%; min-width: 0; }
    .intro-box { background: rgba(0,0,0,0.03); padding: 30px; border-radius: 10px; margin: 40px 0; border-left: 6px solid #8b4513; font-size: 18px; color: #222; }
    p { text-indent: 2em; margin: 1.2em 0; font-size: var(--font-size); text-align: justify; }
    #settings { position: fixed; bottom: 30px; left: calc(50% + 140px); transform: translateX(-50%); background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); padding: 12px 30px; border-radius: 50px; box-shadow: 0 4px 25px rgba(0,0,0,0.15); display: none; align-items: center; gap: 30px; z-index: 1000; border: 1px solid rgba(0,0,0,0.1); }
    button.opt { border: 1px solid #ddd; background: #fff; cursor: pointer; padding: 5px 15px; border-radius: 20px; font-size: 13px; }
    button.opt:hover { border-color: #8b4513; color: #8b4513; }
    @media print { #sidebar, #settings { display: none; } #main { margin-left: 0; } }
</style></head>
<body onmousedown="hMD(event)" onmouseup="hMU(event)">
<div id="sidebar"><h3>目 录</h3><ul>${catalog}</ul></div>
<div id="main">
    <div style="text-align:center;"><h1>${data.bookName}</h1><p style="text-indent:0;color:#888;">作者：${data.author}</p></div>
    <div class="intro-box"><strong>内容简介：</strong><br>${data.intro}</div>${body}
</div>
<div id="settings" onmouseup="event.stopPropagation()">
    <div style="display:flex;gap:10px;align-items:center;"><strong>字号</strong><button class="opt" onclick="cF(-2)">A-</button><button class="opt" onclick="cF(2)">A+</button></div>
    <div style="display:flex;gap:10px;align-items:center;"><strong>主题</strong>
        <button class="opt" style="background:#f4f1e7" onclick="sT('#f4f1e7','#333','#e8e4d8')">默认</button>
        <button class="opt" style="background:#c7edcc" onclick="sT('#c7edcc','#222','#b7dbbc')">护眼</button>
        <button class="opt" style="background:#1a1a1a;color:#ccc" onclick="sT('#1a1a1a','#999','#111')">夜间</button>
    </div>
</div>
<script>
    let sX, sY; function hMD(e){sX=e.pageX; sY=e.pageY;}
    function hMU(e){
        if(e.target.closest('#sidebar') || e.target.closest('button') || e.target.closest('a')) return;
        if(window.getSelection().toString().length === 0 && Math.sqrt(Math.pow(e.pageX-sX,2)+Math.pow(e.pageY-sY,2)) < 5) {
            const p = document.getElementById('settings'); p.style.display = (p.style.display==='flex')?'none':'flex';
        }
    }
    function cF(d){ const r=document.documentElement; let c=parseInt(getComputedStyle(r).getPropertyValue('--font-size')); r.style.setProperty('--font-size',(c+d)+'px'); }
    function sT(b,t,s){ const r=document.documentElement; r.style.setProperty('--bg',b); r.style.setProperty('--text',t); r.style.setProperty('--sidebar-bg',s); }
</script></body></html>`;
        downloadBlob(new Blob([htmlTemplate], {type:'text/html'}), `${data.bookName}.html`);
    }

    // --- 5. 导出 TXT 逻辑 ---
    function saveAsTxt(data) {
        let text = `${data.bookName}\n作者：${data.author}\n\n【内容简介】\n${data.intro}\n\n`;
        data.chapters.forEach((ch, i) => {
            text += `\n\n第 ${i+1} 章 ${ch.title}\n${"-".repeat(20)}\n${ch.paras.map(p=>"    "+p).join('\n\n')}\n`;
        });
        downloadBlob(new Blob([text], {type:'text/plain'}), `${data.bookName}.txt`);
    }

    // --- 工具函数 ---
    function downloadBlob(blob, name) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = name; a.click();
    }
    function setBtn(val) { document.querySelectorAll('.export-btn').forEach(b => b.disabled = val); }

    // --- 事件绑定 ---
    document.getElementById('export-epub-btn').onclick = async () => { setBtn(true); const d = await getBookData(); await saveAsEpub(d); setBtn(false); document.getElementById('export-status').textContent="✅ EPUB 成功"; };
    document.getElementById('export-html-btn').onclick = async () => { setBtn(true); const d = await getBookData(); saveAsHtml(d); setBtn(false); document.getElementById('export-status').textContent="✅ HTML 成功"; };
    document.getElementById('export-txt-btn').onclick = async () => { setBtn(true); const d = await getBookData(); saveAsTxt(d); setBtn(false); document.getElementById('export-status').textContent="✅ TXT 成功"; };

})();