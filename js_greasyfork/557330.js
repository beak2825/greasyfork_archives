// ==UserScript==
// @name         Trie文本替换与高亮
// @namespace    http://tampermonkey.net/
// @version      25.0
// @description  Aho-Corasick 高性能文本替换。纯离线 CSV 版。
// @author       老董的Gemini
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557330/Trie%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E4%B8%8E%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/557330/Trie%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E4%B8%8E%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= 配置常量 =================
    const STORAGE_KEY_REPLACE = 'ac_replace_rules';
    const STORAGE_KEY_HIGHLIGHT = 'ac_highlight_rules';
    const STORAGE_KEY_POS = 'ac_ball_position';
    const CONFIG_HASH = '#ac-manager-dashboard';
    const ATTR_REPLACE_DONE = 'data-ac-r';

    // ================= 1. 配置页逻辑 =================
    if (window.location.hash === CONFIG_HASH) {
        try { window.stop(); } catch (e) {}

        const renderConfig = () => {
            if (!document.documentElement) return setTimeout(renderConfig, 10);

            while (document.documentElement.attributes.length > 0) {
                document.documentElement.removeAttribute(document.documentElement.attributes[0].name);
            }
            document.documentElement.innerHTML = '<head><title>规则管理</title><meta charset="utf-8"></head><body></body>';
            document.documentElement.style.cssText = 'width:100%; height:100%; margin:0; padding:0; background:#eeeeee; display:block !important; visibility:visible !important; overflow:auto !important;';
            document.body.style.cssText = 'margin:0; padding:0; width:100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #333;';

            const div = document.createElement('div');
            div.innerHTML = `
            <style>
                .ac-box { max-width: 850px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e0e0e0; }
                .ac-head { background: #424242; color: #f5f5f5; padding: 20px; text-align: center; font-size: 20px; font-weight: 500; letter-spacing: 1px; }
                .ac-tabs { display: flex; border-bottom: 1px solid #e0e0e0; background: #f5f5f5; }
                .ac-tab { flex: 1; text-align: center; padding: 15px; cursor: pointer; color: #757575; font-weight: 500; transition: 0.2s; user-select: none; font-size: 14px; }
                .ac-tab:hover { background: #e0e0e0; color: #424242; }
                .ac-tab.active { color: #212121; background: #fff; border-bottom: 3px solid #616161; font-weight: bold; }
                .ac-view { display: none; padding: 30px; }
                .ac-view.active { display: block; animation: fade 0.3s; }
                @keyframes fade { from {opacity:0; transform:translateY(5px);} to {opacity:1; transform:translateY(0);} }
                .ac-tip { background: #f5f5f5; padding: 12px 15px; border-radius: 4px; margin-bottom: 20px; color: #616161; font-size: 13px; border-left: 4px solid #9e9e9e; line-height: 1.6; }
                textarea { width: 100%; height: 320px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 4px; font-family: monospace; resize: vertical; display: block; box-sizing: border-box; font-size: 13px; outline: none; transition: 0.2s; background: #fafafa; color: #424242; }
                textarea:focus { border-color: #bdbdbd; background: #fff; }
                .ac-btns { margin-top: 25px; display: flex; gap: 10px; flex-wrap: wrap; }
                button { padding: 8px 18px; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; transition: 0.2s; }
                button:hover { opacity: 0.9; }
                .btn-p { background: #1565C0; color: white; box-shadow: 0 2px 5px rgba(21,101,192,0.3); }
                .btn-s { background: #f5f5f5; color: #424242; border: 1px solid #d6d6d6; }
                .btn-s:hover { background: #eeeeee; }
                .btn-d { background: #fff; color: #616161; border: 1px solid #e0e0e0; margin-left: auto; }
                .btn-d:hover { background: #ffebee; color: #d32f2f; border-color: #ef9a9a; }
                table { width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden; }
                th { background: #f5f5f5; padding: 10px 12px; text-align: left; border-bottom: 1px solid #e0e0e0; color: #616161; font-size: 13px; font-weight: 600; }
                td { padding: 8px 12px; border-bottom: 1px solid #eeeeee; vertical-align: middle; color: #424242; font-size: 13px; }
                tr:last-child td { border-bottom: none; }
                input[type=text] { width: 100%; padding: 6px; border: 1px solid #e0e0e0; border-radius: 3px; box-sizing: border-box; background: #fafafa; color: #333; }
                input[type=text]:focus { border-color: #bdbdbd; background: #fff; outline: none; }
                input[type=color] { border: none; background: none; height: 25px; width: 35px; cursor: pointer; vertical-align: middle; }
                .ac-toast { position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); background: #333; color: #fff; padding: 10px 20px; border-radius: 20px; font-size: 14px; opacity: 0; pointer-events: none; transition: 0.3s; z-index: 99999; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                .ac-toast.show { opacity: 1; bottom: 60px; }
            </style>
            <div class="ac-toast" id="toast">✅ 已保存</div>
            <div class="ac-box">
                <div class="ac-head">规则管理</div>
                <div class="ac-tabs">
                    <div class="ac-tab active" id="t1">1. 文本替换</div>
                    <div class="ac-tab" id="t2">2. 高亮显示</div>
                </div>
                <div class="ac-view active" id="v1">
                    <div class="ac-tip">说明：支持 CSV 格式。<br>格式：A列=原词，B列=新词。</div>
                    <textarea id="txt-r" placeholder="Old = New"></textarea>
                    <div class="ac-btns">
                        <button class="btn-p" id="save-r">保存并关闭</button>
                        <button class="btn-s" id="imp-r">导入 CSV</button>
                        <button class="btn-s" id="exp-r">导出 CSV</button>
                        <button class="btn-d" id="clr-r">清空</button>
                    </div>
                </div>
                <div class="ac-view" id="v2">
                    <div class="ac-tip">CSV 格式：A列=关键词，B列=颜色，C列=透明度。</div>
                    <table id="tbl-h"><thead><tr><th width="40%">关键词</th><th>颜色</th><th>透明度</th><th>操作</th></tr></thead><tbody></tbody></table>
                    <button class="btn-s" id="add-h" style="width:100%; margin-top:12px; border:1px dashed #ccc; color:#757575;">+ 添加一行</button>
                    <div class="ac-btns">
                        <button class="btn-p" id="save-h">保存并关闭</button>
                        <button class="btn-s" id="imp-h">导入 CSV</button>
                        <button class="btn-s" id="exp-h">导出 CSV</button>
                        <button class="btn-d" id="clr-h">清空</button>
                    </div>
                </div>
            </div>
            <input type="file" id="file" style="display:none" accept=".csv,.txt">
            `;
            document.body.appendChild(div);

            // --- 绑定逻辑 ---
            const $ = id => document.getElementById(id);
            const toast = (msg) => { const t=$('toast'); t.innerText=msg; t.classList.add('show'); setTimeout(()=>window.close(),600); };
            const getTs = () => { const d=new Date(); return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`; };

            const downloadCSV = (content, filename) => {
                const blob = new Blob(["\ufeff" + content], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };

            const parseCSV = (text) => {
                const lines = text.split(/\r\n|\n/);
                const result = [];
                lines.forEach(line => {
                    if(!line.trim()) return;
                    const parts = line.split(',');
                    const cleanParts = parts.map(p => p.trim().replace(/^"|"$/g, ''));
                    if(cleanParts.length) result.push(cleanParts);
                });
                return result;
            };

            const parseTextarea = () => {
                const map = new Map();
                $('txt-r').value.split('\n').forEach(l=>{
                    if(!l.trim()) return;
                    const p = l.split(/\s*(?:=|->|=>|＝|：|:)\s*/);
                    if(p.length>=2) map.set(p[0].trim(), p[1].trim());
                    else if(l.includes(' ')) { const i=l.indexOf(' '); map.set(l.slice(0,i).trim(), l.slice(i).trim()); }
                });
                return map;
            };
            const mapToText = (map) => { let t=''; for(const [k,v] of map) t+=`${k} = ${v}\n`; return t; };
            const getTableMap = () => {
                const map = new Map();
                $('tbl-h').querySelectorAll('tbody tr').forEach(tr=>{
                    const i=tr.querySelectorAll('input');
                    const t=i[0].value.trim();
                    if(t) map.set(t, {text:t, color:i[1].value, opacity:parseFloat(i[2].value)});
                });
                return map;
            };

            $('t1').onclick = () => { $('t1').className='ac-tab active'; $('t2').className='ac-tab'; $('v1').className='ac-view active'; $('v2').className='ac-view'; };
            $('t2').onclick = () => { $('t1').className='ac-tab'; $('t2').className='ac-tab active'; $('v1').className='ac-view'; $('v2').className='ac-view active'; };

            const loadR = () => {
                const d = GM_getValue(STORAGE_KEY_REPLACE, {});
                $('txt-r').value = Object.entries(d).map(([k,v])=>`${k} = ${v}`).join('\n');
            };
            $('save-r').onclick = () => { GM_setValue(STORAGE_KEY_REPLACE, Object.fromEntries(parseTextarea())); toast('✅ 替换规则已保存'); };
            $('clr-r').onclick = () => { if(confirm('清空?')) { GM_setValue(STORAGE_KEY_REPLACE,{}); loadR(); }};
            $('exp-r').onclick = () => {
                const map = parseTextarea();
                let csv = "原文本,替换文本\n";
                for (const [k, v] of map) csv += `${k.includes(',')?`"${k}"`:k},${v.includes(',')?`"${v}"`:v}\n`;
                downloadCSV(csv, `ReplaceRules_${getTs()}.csv`);
            };

            const addH = (x={text:'',color:'#FFFF00',opacity:1}) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td><input type="text" value="${x.text}"></td><td><input type="color" value="${x.color}"></td><td><div style="display:flex;align-items:center"><input type="range" min="0.1" max="1" step="0.1" value="${x.opacity}"><span style="width:25px;text-align:right;font-size:12px;color:#666">${x.opacity}</span></div></td><td><button class="btn-d" style="padding:4px 10px;font-size:12px">✕</button></td>`;
                tr.querySelector('input[type=range]').oninput = function(){this.nextElementSibling.innerText=this.value};
                tr.querySelector('.btn-d').onclick = () => tr.remove();
                $('tbl-h').querySelector('tbody').appendChild(tr);
            };
            const loadH = () => { $('tbl-h').querySelector('tbody').innerHTML = ''; const d = GM_getValue(STORAGE_KEY_HIGHLIGHT, []); d.forEach(x => addH(x)); if(!d.length) addH(); };
            const refreshH = (map) => { $('tbl-h').querySelector('tbody').innerHTML = ''; for(const v of map.values()) addH(v); if(map.size===0) addH(); };

            $('add-h').onclick = () => addH();
            $('save-h').onclick = () => { GM_setValue(STORAGE_KEY_HIGHLIGHT, Array.from(getTableMap().values())); toast('✅ 高亮规则已保存'); };
            $('clr-h').onclick = () => { if(confirm('清空?')) { GM_setValue(STORAGE_KEY_HIGHLIGHT,[]); loadH(); }};
            $('exp-h').onclick = () => {
                const map = getTableMap();
                let csv = "关键词,颜色,透明度\n";
                for (const v of map.values()) csv += `${v.text.includes(',')?`"${v.text}"`:v.text},${v.color},${v.opacity}\n`;
                downloadCSV(csv, `HighlightRules_${getTs()}.csv`);
            };

            const f = $('file'); let mode = '';
            $('imp-r').onclick = () => { mode='r'; f.click(); };
            $('imp-h').onclick = () => { mode='h'; f.click(); };
            f.onchange = e => {
                const file = e.target.files[0];
                if(!file) return;
                const rdr = new FileReader();
                rdr.onload = ev => {
                    const rows = parseCSV(ev.target.result);
                    let add=0, upd=0;
                    if(mode==='r') {
                        const map = parseTextarea();
                        rows.forEach((r, i) => {
                            if(i===0 && (r[0]==='原文本' || r[0].includes('Key'))) return;
                            if(r.length >= 1 && r[0]) {
                                const k = r[0]; const v = r[1] || '';
                                if(map.has(k)) upd++; else add++;
                                map.set(k, v);
                            }
                        });
                        $('txt-r').value = mapToText(map);
                    } else {
                        const map = getTableMap();
                        rows.forEach((r, i) => {
                            if(i===0 && (r[0]==='关键词' || r[0].includes('Text'))) return;
                            if(r.length >= 1 && r[0]) {
                                const k = r[0];
                                if(map.has(k)) upd++; else add++;
                                map.set(k, {text:k, color:r[1]||'#FFFF00', opacity:r[2]?parseFloat(r[2]):1});
                            }
                        });
                        refreshH(map);
                    }
                    alert(`CSV 导入成功：新增 ${add}, 更新 ${upd}`);
                };
                rdr.readAsText(file, 'UTF-8');
                f.value='';
            };

            loadR(); loadH();
        };
        renderConfig();
        return;
    }

    // ================= 2. 核心算法 =================
    class ACMatcher {
        constructor() { this.root = { n: {}, f: null, o: [] }; }
        insert(w, d) {
            let p = this.root;
            for (let c of w) { if (!p.n[c]) p.n[c] = { n: {}, f: null, o: [] }; p = p.n[c]; }
            p.o.push({ w, d });
        }
        build() {
            const q = [];
            for (const c in this.root.n) { this.root.n[c].f = this.root; q.push(this.root.n[c]); }
            while (q.length) {
                const u = q.shift();
                for (const c in u.n) {
                    const v = u.n[c]; let f = u.f;
                    while (f && !f.n[c]) f = f.f;
                    v.f = f ? f.n[c] : this.root;
                    v.o = v.o.concat(v.f.o);
                    q.push(v);
                }
            }
        }
        search(txt) {
            if (!txt) return [];
            let p = this.root, res = [];
            for (let i = 0; i < txt.length; i++) {
                const c = txt[i];
                while (p !== this.root && !p.n[c]) p = p.f;
                p = p.n[c] || this.root;
                for (const o of p.o) res.push({ s: i - o.w.length + 1, e: i + 1, w: o.w, d: o.d });
            }
            if(!res.length) return [];
            res.sort((a, b) => (a.s !== b.s) ? a.s - b.s : b.w.length - a.w.length);
            const fin = []; let last = -1;
            for (const m of res) { if (m.s >= last) { fin.push(m); last = m.e; } }
            return fin;
        }
    }

    function hexToRgba(hex, alpha) {
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            let c = hex.substring(1).split('');
            if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            c = parseInt(c.join(''), 16);
            return `rgba(${(c>>16)&255},${(c>>8)&255},${c&255},${alpha})`;
        }
        return hex;
    }

    // ================= 3. 任务处理 =================

    const nodeQueue = [];
    let isProcessing = false;
    let acR = null, acH = null;

    function processNode(node) {
        if (!node.nodeValue) return;
        const p = node.parentNode;
        if (!p || ['SCRIPT','STYLE','TEXTAREA','INPUT','SELECT','NOSCRIPT'].includes(p.tagName)) return;
        if (p.closest && p.closest('.ac-box')) return;
        if (p.tagName === 'MARK') return;

        const isReplacedAlready = p.hasAttribute(ATTR_REPLACE_DONE);
        let txt = node.nodeValue;

        if (acR && !isReplacedAlready) {
            const ms = acR.search(txt);
            if (ms.length) {
                const f = document.createDocumentFragment();
                let l = 0;
                for (const m of ms) {
                    if (m.s > l) f.appendChild(document.createTextNode(txt.slice(l, m.s)));
                    const safeSpan = document.createElement('span');
                    safeSpan.textContent = m.d;
                    safeSpan.setAttribute(ATTR_REPLACE_DONE, '1');
                    safeSpan.style.display = 'inline';
                    f.appendChild(safeSpan);
                    l = m.e;
                }
                if (l < txt.length) f.appendChild(document.createTextNode(txt.slice(l)));
                if (node.parentNode) {
                    node.parentNode.replaceChild(f, node);
                    return;
                }
            }
        }

        if (acH) {
            const ms = acH.search(txt);
            if (ms.length) {
                const f = document.createDocumentFragment();
                let l = 0;
                for (const m of ms) {
                    if (m.s > l) f.appendChild(document.createTextNode(txt.slice(l, m.s)));
                    const mk = document.createElement('mark');
                    mk.textContent = m.w;
                    mk.style.cssText = `background-color:${hexToRgba(m.d.color, m.d.opacity)} !important; color:inherit; padding:0; margin:0; border-radius:2px;`;
                    f.appendChild(mk);
                    l = m.e;
                }
                if (l < txt.length) f.appendChild(document.createTextNode(txt.slice(l)));
                if (node.parentNode) {
                    node.parentNode.replaceChild(f, node);
                }
            }
        }
    }

    function scheduleProcess() {
        if (isProcessing) return;
        isProcessing = true;
        const run = (deadline) => {
            while ((deadline.timeRemaining() > 1 || deadline.didTimeout) && nodeQueue.length > 0) {
                const node = nodeQueue.shift();
                if (document.contains(node)) processNode(node);
            }
            if (nodeQueue.length > 0) (window.requestIdleCallback || setTimeout)(run, { timeout: 1000 });
            else isProcessing = false;
        };
        (window.requestIdleCallback || setTimeout)(run, { timeout: 1000 });
    }

    function enqueue(node) {
        if (!node) return;
        nodeQueue.push(node);
        scheduleProcess();
    }

    function initPage() {
        const rRules = GM_getValue(STORAGE_KEY_REPLACE, {});
        const hRules = GM_getValue(STORAGE_KEY_HIGHLIGHT, []);

        if (Object.keys(rRules).length) { acR = new ACMatcher(); for(let k in rRules) if(k.trim()) acR.insert(k, rRules[k]); acR.build(); }
        if (hRules.length) { acH = new ACMatcher(); hRules.forEach(r => { if(r.text.trim()) acH.insert(r.text, r); }); acH.build(); }
        if (!acR && !acH) return;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        while(walker.nextNode()) enqueue(walker.currentNode);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(n => {
                    if (n.nodeType === 3) enqueue(n);
                    else if (n.nodeType === 1) {
                        const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT, null, false);
                        while(w.nextNode()) enqueue(w.currentNode);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ================= 4. 悬浮球 (0.6x + 呼吸灯) =================
    function createBall() {
        if(document.getElementById('gm-ac-ball')) return;
        const pos = GM_getValue(STORAGE_KEY_POS, { right: 30, bottom: 30 });

        // 1. 注入 CSS 动画 (呼吸效果)
        const animStyle = document.createElement('style');
        animStyle.textContent = `
            @keyframes gm_pulse_cycle {
                0%, 6.66%, 13.33%, 20%, 100% { background-color: #424242; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transform: scale(1); border-color: #616161; }
                3.33%, 10%, 16.66% { background-color: #1565C0; box-shadow: 0 0 10px rgba(21,101,192,0.8); transform: scale(1.1); border-color: #1565C0; }
            }
            #gm-ac-ball {
                animation: gm_pulse_cycle 15s infinite ease-in-out;
            }
            #gm-ac-ball:hover {
                animation: none !important; /* 鼠标放上去时停止呼吸，保持常亮 */
                background-color: #1565C0 !important;
                transform: scale(1.1) !important;
                box-shadow: 0 0 15px rgba(21,101,192,0.6) !important;
                border-color: #1565C0 !important;
            }
        `;
        document.head.appendChild(animStyle);

        // 2. 创建球体
        const b = document.createElement('div');
        b.id = 'gm-ac-ball';
        Object.assign(b.style, {
            position:'fixed', right:`${pos.right}px`, bottom:`${pos.bottom}px`,
            width:'30px', height:'30px', // 缩小到 0.6x (原50px -> 30px)
            borderRadius:'6px', // 缩小圆角 (原10px -> 6px)
            background:'#424242', color:'#f5f5f5',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'10px', fontWeight:'bold', // 缩小字体 (原13px -> 10px)
            cursor:'pointer', zIndex:'2147483647',
            whiteSpace:'pre', lineHeight:'1.1', userSelect:'none',
            border: '1px solid #616161'
        });
        b.innerText = "替换\n高亮";

        // 拖拽逻辑
        let d=false,sx,sy,sr,sb;
        b.onmousedown=e=>{d=true;sx=e.clientX;sy=e.clientY;const r=b.getBoundingClientRect();sr=window.innerWidth-r.right;sb=window.innerHeight-r.bottom;e.preventDefault();b.style.transition='none';};
        window.addEventListener('mousemove',e=>{if(d){b.style.right=(sr+(sx-e.clientX))+'px';b.style.bottom=(sb+(sy-e.clientY))+'px';}});
        window.addEventListener('mouseup',()=>{if(d){d=false;b.style.transition='';const r=b.getBoundingClientRect();GM_setValue(STORAGE_KEY_POS,{right:window.innerWidth-r.right,bottom:window.innerHeight-r.bottom});}});

        let dp={};
        b.addEventListener('mousedown',e=>dp={x:e.clientX,y:e.clientY});
        b.addEventListener('click',e=>{
            if(Math.abs(e.clientX-dp.x)<5 && Math.abs(e.clientY-dp.y)<5) GM_openInTab(window.location.href.split('#')[0] + CONFIG_HASH, {active:true});
        });
        document.body.appendChild(b);
    }

    if(window.location.hash !== CONFIG_HASH) {
        if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ()=>{ createBall(); initPage(); });
        else { createBall(); initPage(); }
    }

})();