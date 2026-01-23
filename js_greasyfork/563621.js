// ==UserScript==
// @name         域名对比联动便签 (核心增强版)
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  优化了主体提取逻辑，支持 .com.au 等复杂后缀及 stores 等前缀识别。
// @author       Gemini
// @match        *://admin.bloomnus.top/*
// @require      https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563621/%E5%9F%9F%E5%90%8D%E5%AF%B9%E6%AF%94%E8%81%94%E5%8A%A8%E4%BE%BF%E7%AD%BE%20%28%E6%A0%B8%E5%BF%83%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563621/%E5%9F%9F%E5%90%8D%E5%AF%B9%E6%AF%94%E8%81%94%E5%8A%A8%E4%BE%BF%E7%AD%BE%20%28%E6%A0%B8%E5%BF%83%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let interceptedData = []; 
    let lastProcessedResults = [];
    const EXPORT_BTN_SELECTOR = 'div.flex.items-center.jeecg-basic-table-header__table-title-box > div.jeecg-basic-table-header__tableTitle > button:nth-child(1)';

    // --- 颜色定义 ---
    const THEME_COLOR = '#6B9127';  // 森林绿
    const ORANGE_RED = '#FF4500';   // 橙红色
    const ALERT_RED = '#D93025';    // 核心匹配深红

    // 增强版后缀库：加入了 au, ca, hk 等，并确保长后缀在前
    const EXTENDED_SUFFIXES = ['com.cn', 'net.cn', 'org.cn', 'com.au', 'com.hk', 'com','net','org','top','cn','edu','gov','io','me','cc','biz','info','us','uk','jp','site','xyz','shop','store','online','vip','icu','art','pk','tech','co','in','ai','app','gg','link','click','live','today','ws','tk','club','mobi','best','win','bid','casa','fun','pw','is','it','fr','de', 'au', 'ca', 'hk'];
    const SUFFIX_REG = new RegExp(`\\.(${EXTENDED_SUFFIXES.join('|')})$`, 'i');

    // 提取纯粹主体名的逻辑
    const getPureMainName = (url) => {
        if (!url) return "";
        // 1. 去掉协议和路径，只留域名部分
        let domain = url.trim().toLowerCase().replace(/^(https?:\/\/)?/, '').split('/')[0];
        
        // 2. 递归去掉后缀 (例如从 victoriassecret.com.au 中依次去掉 .au 和 .com)
        let lastDomain = "";
        while (domain !== lastDomain) {
            lastDomain = domain;
            domain = domain.replace(SUFFIX_REG, '');
        }

        // 3. 此时可能剩下 "stores.victoriassecret" 或 "www.victoriassecret"
        // 统一取最后一段，彻底解决 stores, m, www 等各种前缀问题
        const parts = domain.split('.');
        return parts[parts.length - 1]; 
    };

    const getSim = (s1, s2) => {
        if (!s1 || !s2) return 0;
        if (s1 === s2 && s1.length >= 3) return 2.0; // 完美匹配
        let longer = s1.length > s2.length ? s1 : s2;
        let shorter = s1.length > s2.length ? s2 : s1;
        const editDist = (a, b) => {
            let m = Array.from({length: a.length+1}, (_,i) => [i]);
            for(let j=1; j<=b.length; j++) m[0][j] = j;
            for(let i=1; i<=a.length; i++)
                for(let j=1; j<=b.length; j++)
                    m[i][j] = a[i-1] === b[j-1] ? m[i-1][j-1] : Math.min(m[i-1][j-1], m[i][j-1], m[i-1][j]) + 1;
            return m[a.length][b.length];
        };
        return (longer.length - editDist(longer, shorter)) / longer.length;
    };

    function getLongestCommonLen(s1, s2) {
        if (!s1 || !s2) return 0;
        let m = Array.from({length: s1.length + 1}, () => Array(s2.length + 1).fill(0));
        let maxLen = 0;
        for (let i = 1; i <= s1.length; i++) {
            for (let j = 1; j <= s2.length; j++) {
                if (s1[i-1] === s2[j-1]) {
                    m[i][j] = m[i-1][j-1] + 1;
                    maxLen = Math.max(maxLen, m[i][j]);
                }
            }
        }
        return maxLen;
    }

    function highlightMainOnly(sourceFull, targetFull) {
        let sourceMain = getPureMainName(sourceFull);
        let targetMain = getPureMainName(targetFull);
        if (!sourceMain || !targetMain || sourceMain.length < 3) return targetFull;
        let matches = [];
        for (let len = sourceMain.length; len >= 3; len--) {
            for (let i = 0; i <= sourceMain.length - len; i++) {
                let segment = sourceMain.substring(i, i + len);
                if (targetMain.includes(segment)) if (!matches.some(m => m.includes(segment))) matches.push(segment);
            }
        }
        let result = targetFull;
        matches.sort((a, b) => b.length - a.length);
        matches.forEach(seg => { if (!/^\d+$/.test(seg)) result = result.split(seg).join(`<span class="match-high">${seg}</span>`); });
        return result;
    }

    // --- UI 构造 (保持不变) ---
    const note = document.createElement('div');
    note.innerHTML = `
        <style>
            #bloomnus-note { position: fixed; top: 60px; right: 20px; z-index: 10000; width: 850px; background: #ffffff; border: 1px solid rgba(107,145,39,0.3); border-radius: 8px; box-shadow: 0 12px 40px rgba(0,0,0,0.12); font-family: -apple-system, sans-serif; display: flex; flex-direction: column; overflow: hidden; transition: width 0.2s; }
            #bloomnus-note.collapsed { width: 180px; height: 40px !important; border-color: ${THEME_COLOR}; }
            #note-header { padding: 0 15px; height: 40px; background: ${THEME_COLOR}; color: white; cursor: move; display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; }
            #note-body { display: flex; height: 550px; }
            .note-col { flex: 1; display: flex; flex-direction: column; padding: 15px; border-right: 1px solid #f0f0f0; }
            .col-title { font-size: 12px; font-weight: bold; color: ${THEME_COLOR}; margin-bottom: 8px; }
            textarea { width: 100%; border: 1px solid #e0e0e0; border-radius: 4px; padding: 8px; font-size: 11px; resize: none; outline: none; }
            #input-list { flex: 1; overflow-y: auto; background: #fff; border: 1px solid #eee; border-radius: 4px; margin-top: 10px; }
            .input-item { padding: 10px; cursor: pointer; border-bottom: 1px solid #f8f8f8; font-size: 12px; color: #444; }
            .input-item:hover { background: rgba(107,145,39,0.05); }
            .input-item.active { background: ${THEME_COLOR} !important; color: white !important; }
            #res-scroll { flex: 1; overflow-y: auto; background: #fff; border: 1px solid #eee; border-radius: 4px; padding: 15px; }
            .res-detail-header { font-weight: bold; color: ${THEME_COLOR}; border-bottom: 2px solid ${THEME_COLOR}; padding-bottom: 8px; margin-bottom: 15px; font-size: 13px; }
            .match-card { font-size: 11px; margin-bottom: 12px; border-left: 4px solid ${THEME_COLOR}; padding: 10px 12px; background: #fcfcfc; border-radius: 0 4px 4px 0; }
            .match-card.is-high { border-left-color: ${ORANGE_RED}; background: rgba(255, 69, 0, 0.03); }
            .match-card.is-core { border-left-color: ${ALERT_RED}; background: rgba(217, 48, 37, 0.03); }
            .match-high { background: ${ORANGE_RED}; color: white; border-radius: 2px; padding: 0 2px; font-weight: bold; }
            .prio-badge { float: right; font-size: 9px; padding: 1px 6px; border-radius: 4px; color: white; font-weight: bold; }
            .btn-box { padding: 10px 15px; display: flex; gap: 10px; background: #fcfcfc; border-top: 1px solid #eee; }
            .n-btn { border: 1px solid ${THEME_COLOR}; background: white; color: ${THEME_COLOR}; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; }
            .status-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); display: inline-block; margin-right: 8px; }
            .status-ok { background: #92D050; box-shadow: 0 0 8px #92D050; }
        </style>
        <div id="bloomnus-note" class="collapsed">
            <div id="note-header">
                <span><span id="s-dot" class="status-dot"></span>核心对比助手 v3.9</span>
                <span id="fold-btn" style="cursor:pointer; font-size:11px;">展开</span>
            </div>
            <div id="note-main-content">
                <div id="note-body">
                    <div class="note-col">
                        <div class="col-title">① 待检测 (左侧)</div>
                        <textarea id="u-raw" style="height:80px; margin-bottom:10px;" placeholder="粘贴域名..."></textarea>
                        <div class="col-title">② 辅助库 (本地)</div>
                        <textarea id="u-custom" style="height:80px;" placeholder="补充对比库..."></textarea>
                        <div id="input-list"></div>
                    </div>
                    <div class="note-col">
                        <div class="col-title">③ 选中详情 (右侧详情)</div>
                        <div id="res-scroll"></div>
                    </div>
                </div>
                <div id="note-footer" class="btn-box">
                    <button id="n-parse" style="background:${THEME_COLOR};color:white;border:none;" class="n-btn">联合比对</button>
                    <button id="n-clear" class="n-btn">清空</button>
                    <div style="margin-left:auto; text-align:right;"><span id="data-count" style="font-size:10px; color:#999;">库: 0</span></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(note);

    const rawInput = note.querySelector('#u-raw'), customInput = note.querySelector('#u-custom'), inputList = note.querySelector('#input-list'), resScroll = note.querySelector('#res-scroll'), dot = note.querySelector('#s-dot'), countText = note.querySelector('#data-count'), foldBtn = note.querySelector('#fold-btn'), noteMain = note.querySelector('#bloomnus-note');

    const toggleFold = (state) => {
        const isCollapsed = state !== undefined ? state : !noteMain.classList.contains('collapsed');
        noteMain.className = isCollapsed ? 'collapsed' : '';
        foldBtn.innerText = isCollapsed ? '展开' : '折叠';
    };
    foldBtn.onclick = () => toggleFold();

    URL.createObjectURL = function(obj) {
        if (obj instanceof Blob && (obj.type.includes('spreadsheetml') || obj.size > 2048)) {
            obj.arrayBuffer().then(buffer => {
                const workbook = XLSX.read(buffer, { type: 'array' });
                interceptedData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                dot.className = 'status-dot status-ok';
                countText.innerText = `库: ${interceptedData.length}`;
                processAll();
            });
            return "javascript:void(0)"; 
        }
        return (window.URL || window.webkitURL).createObjectURL ? (window.URL || window.webkitURL).createObjectURL(obj) : null;
    };

    function renderDetail(resultItem) {
        resScroll.innerHTML = `<div class="res-detail-header">🎯 ${resultItem.raw}</div>`;
        resultItem.matches.forEach(m => {
            const card = document.createElement('div');
            let cardClass = 'match-card';
            let badgeColor = THEME_COLOR;
            if (m.isCore) { cardClass += ' is-core'; badgeColor = ALERT_RED; }
            else if (m.isHigh) { cardClass += ' is-high'; badgeColor = ORANGE_RED; }
            
            card.className = cardClass;
            card.innerHTML = `
                <div style="font-weight:bold; font-size:12px;">
                    ${m.isCustom ? '<span style="color:#52c41a; font-size:9px; border:1px solid #52c41a; padding:0 2px; margin-right:4px;">临时</span>' : ''}
                    ${highlightMainOnly(resultItem.raw, m.tRaw)}
                    <span class="prio-badge" style="background:${badgeColor}">
                        ${m.isCore ? '核心匹配' : Math.round(m.score*100)+'%'}
                    </span>
                </div>
                <div style="color:#666; margin-top:8px; display:flex; justify-content:space-between; font-size:11px;">
                    <span>状态: ${m["任务状态"] || '未知'}</span>
                    <span>来源: ${m["域名"] || 'Local'}</span>
                </div>
            `;
            resScroll.appendChild(card);
        });
    }

    function processAll() {
        const searchLines = rawInput.value.split('\n').map(v => v.trim()).filter(v => v !== "");
        const customLines = customInput.value.split('\n').map(v => v.trim()).filter(v => v !== "");
        const combinedLibrary = [...interceptedData, ...customLines.map(d => ({"对标站（官网）": d, "任务状态": "临时", "域名": "Local", "isCustom": true}))];

        if (searchLines.length === 0) return;

        lastProcessedResults = searchLines.map(line => {
            const raw = line.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
            const main = getPureMainName(raw);
            let matches = combinedLibrary.map(row => {
                const tRaw = (row["对标站（官网）"] || "").trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
                const tMain = getPureMainName(tRaw);
                let score = getSim(main, tMain);
                let isCore = (score >= 2.0);
                let isHigh = getLongestCommonLen(main, tMain) >= 3;
                let sortWeight = score * 100;
                if (isCore) sortWeight = 3000 + (score * 10);
                else if (isHigh) sortWeight = 2000 + (score * 10);
                return { ...row, tRaw, tMain, score, isCore, isHigh, sortWeight };
            }).filter(m => m.score > 0.1 || m.isHigh)
              .sort((a,b) => b.sortWeight - a.sortWeight).slice(0, 15);
            return { raw, main, topSortWeight: matches.length > 0 ? matches[0].sortWeight : 0, matches };
        }).sort((a, b) => b.topSortWeight - a.topSortWeight);

        inputList.innerHTML = '';
        lastProcessedResults.forEach((item, index) => {
            const li = document.createElement('div');
            li.className = 'input-item';
            const top = item.matches[0];
            let bText = '0%', bColor = '#ccc';
            if (top) {
                if (top.isCore) { bText = '核心'; bColor = ALERT_RED; }
                else if (top.isHigh) { bText = '高亮'; bColor = ORANGE_RED; }
                else { bText = Math.round(top.score*100)+'%'; bColor = THEME_COLOR; }
            }
            li.innerHTML = `<span class="prio-badge" style="background:${bColor}">${bText}</span>${index + 1}. ${item.raw}`;
            li.onclick = () => {
                note.querySelectorAll('.input-item').forEach(el => el.classList.remove('active'));
                li.classList.add('active'); renderDetail(item);
            };
            inputList.appendChild(li);
        });
        if (lastProcessedResults.length > 0) inputList.querySelector('.input-item').click();
    }

    note.querySelector('#n-parse').onclick = () => {
        if (interceptedData.length === 0) {
            const btn = document.querySelector(EXPORT_BTN_SELECTOR);
            if (btn) btn.click();
        } 
        processAll();
    };

    note.querySelector('#n-clear').onclick = () => { rawInput.value = ''; inputList.innerHTML = ''; resScroll.innerHTML = ''; };

    const head = note.querySelector('#note-header');
    let drag = false, box = [0,0];
    head.onmousedown = (e) => { if(e.target === foldBtn) return; drag = true; box = [note.offsetLeft - e.clientX, note.offsetTop - e.clientY]; };
    document.onmousemove = (e) => { if (drag) { note.style.left = (e.clientX + box[0]) + 'px'; note.style.top = (e.clientY + box[1]) + 'px'; note.style.right = 'auto'; } };
    document.onmouseup = () => drag = false;
})();