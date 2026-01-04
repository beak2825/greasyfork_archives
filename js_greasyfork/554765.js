// ==UserScript==
// @name         Sukebei Nyaa 批量查詢收合版
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  目錄、進度獨立行、可收合目錄內容、最小化預覽進度
// @author       GPT
// @license      MIT
// @match        https://sukebei.nyaa.si/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554765/Sukebei%20Nyaa%20%E6%89%B9%E9%87%8F%E6%9F%A5%E8%A9%A2%E6%94%B6%E5%90%88%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/554765/Sukebei%20Nyaa%20%E6%89%B9%E9%87%8F%E6%9F%A5%E8%A9%A2%E6%94%B6%E5%90%88%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const STORAGE_KEY = '__sukebei_nyaa_custom_codes__';
    const STORAGE_VISITED = '__sukebei_nyaa_visited_codes__';
    const STORAGE_COLLAPSE = '__sukebei_nyaa_ui_collapsed__';

    function getCodes() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        try { return JSON.parse(raw); } catch { return []; }
    }
    function setCodes(arr) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }
    function getVisited() {
        const raw = localStorage.getItem(STORAGE_VISITED);
        if (!raw) return [];
        try { return JSON.parse(raw); } catch { return []; }
    }
    function setVisited(arr) {
        localStorage.setItem(STORAGE_VISITED, JSON.stringify(arr));
    }
    function getCurrentIdx(codes) {
        const url = new URL(window.location.href);
        const q = url.searchParams.get('q');
        if (!q) return 0;
        const idx = codes.indexOf(q);
        return idx >= 0 ? idx : 0;
    }
    function jumpTo(idx, codes) {
        if (idx < 0 || idx >= codes.length) {
            alert('已超出搜尋範圍');
            return;
        }
        const url = new URL(window.location.href);
        url.searchParams.set('q', codes[idx]);
        window.location.href = url.href;
    }
    function markVisited(code) {
        let visited = getVisited();
        if (!visited.includes(code)) {
            visited.push(code);
            setVisited(visited);
        }
    }
    function getCollapsed() {
        return localStorage.getItem(STORAGE_COLLAPSE) === "1";
    }
    function setCollapsed(val) {
        localStorage.setItem(STORAGE_COLLAPSE, val ? "1" : "0");
    }

    // 自動紀錄已查詢
    const codesNow = getCodes();
    const urlNow = new URL(window.location.href);
    const nowCode = urlNow.searchParams.get('q');
    if (codesNow.includes(nowCode)) markVisited(nowCode);

    function renderUI(codes) {
        let idx = getCurrentIdx(codes);
        let visited = getVisited();
        // UI
        const bar = document.createElement('div');
        bar.id = 'sukebeiNyaaNavBar';
        bar.style.cssText = `
            position: fixed; bottom: 24px; right: 24px;
            background: #f8fbff; color: #222a; border: 2px solid #4fa7ef;
            z-index: 10000; padding: 0 22px 18px 22px; border-radius: 14px;
            font-size: 16px; box-shadow: 2px 4px 16px #bbb9;
            max-width: 380px; min-width: 254px;
            font-family: 'Segoe UI', 'Consolas', monospace;
        `;

        // 條列式清單
        let listHTML = '';
        if (codes.length) {
            listHTML = `<ol style="margin:8px 0 7px 0; padding-left:22px;">` +
                    codes.map((code, i) =>
                        `<li style="margin-bottom:1px;">
                            <label style="display:flex;align-items:center;">
                                <input type="checkbox" disabled ${visited.includes(code) ? "checked" : ""} style="accent-color:#24ce86; margin-right:6px;">
                                <span style="font-weight:${i===idx?'bold':'normal'};color:${i===idx?'#044BBF':'#222'};">${code}</span>
                                ${i === idx ? '<span style="margin-left:6px;font-size:13px;color:#fff;background:#044BBF;border-radius:4px;padding:0 8px;">目前</span>' : ""}
                            </label>
                        </li>`
                    ).join('') + `</ol>`;
        }

        // 收合狀態
        const collapsed = getCollapsed();

        bar.innerHTML = `
<div style="width:100%;display:flex;justify-content:flex-end;">
    <button id="sukebeiCollapseBtn" style="background:#fff;color:#4fa7ef;border:1px solid #4fa7ef;border-radius:11px;padding:2px 14px;font-weight:bold;cursor:pointer; font-size:17px; margin-top:9px; margin-right:-9px;">${collapsed?"＋展開":"－收合"}</button>
</div>

<div id="sukebeiDirectory" style="display:${collapsed?'none':'block'};">
    <label style="font-weight:bold;margin-bottom:2px;">搜尋清單 ('逗號/換行分隔')：</label>
    <textarea id="sukebeiEditBox" rows="3" style="width:99%;resize:vertical;margin-top:6px;" placeholder="請輸入編號"></textarea>
    <button id="sukebeiInsertBtn" style="margin:2px 4px 10px 0;">插入於目前位置</button>
    <button id="sukebeiClearBtn" style="margin:2px 4px 10px 0;background:#f55353;color:#fff;">全部移除</button>
    <div id="sukebeiCodeList">${listHTML}</div>
</div>

<div style="margin-top:${collapsed?'8px':'12px'}; width:100%;">
    <div style="margin-bottom:7px;display:flex;align-items:center;">
        <button id="sukebeiPrevBtn" style="background:#fff;color:#f55353;border:1px solid #f55353;margin-right:6px;border-radius:7px;padding:2px 10px;font-weight:bold;">上一筆</button>
        <button id="sukebeiNextBtn" style="background:#fff;color:#1da1ff;border:1px solid #1da1ff;border-radius:7px;padding:2px 10px;font-weight:bold;">下一筆</button>
    </div>
    <div style="margin-left:5px;padding:4px 0;">
        <span style="font-weight:bold;color:#044BBF;background:#e1eeff;border-radius:5px;padding:5px 12px;box-shadow:0 1px 6px #baee;">目前： <b id="navProgress" style="font-weight:bold;">${codes[idx]||'（空）'}</b> (${idx+1}/${codes.length})</span>
    </div>
</div>
`;

        document.body.appendChild(bar);

        // 收合、展開
        bar.querySelector('#sukebeiCollapseBtn').onclick = function () {
            const collapsedNow = getCollapsed();
            setCollapsed(!collapsedNow);
            location.reload();
        };

        // 插入
        if (!collapsed) bar.querySelector('#sukebeiInsertBtn').onclick = function () {
            const txt = bar.querySelector('#sukebeiEditBox').value
                .split(/[\s,]+/)
                .map(s => s.trim())
                .filter(s => s.length);
            if (!txt.length) return;
            let newCodes = [...codes];
            newCodes.splice(idx, 0, ...txt);
            setCodes(newCodes);
            location.reload();
        };
        // 全清
        if (!collapsed) bar.querySelector('#sukebeiClearBtn').onclick = function () {
            if (confirm('是否移除所有編號?')) {
                setCodes([]);
                setVisited([]);
                location.reload();
            }
        };
        // 前一筆
        bar.querySelector('#sukebeiPrevBtn').onclick = function () {
            jumpTo(idx - 1, getCodes());
        };
        // 下一筆
        bar.querySelector('#sukebeiNextBtn').onclick = function () {
            jumpTo(idx + 1, getCodes());
        };
        setInterval(() => {
            const codesNow = getCodes();
            let idxNow = getCurrentIdx(codesNow);
            bar.querySelector('#navProgress').textContent = codesNow[idxNow] || '（空）';
        }, 600);
    }

    renderUI(getCodes());

})();
