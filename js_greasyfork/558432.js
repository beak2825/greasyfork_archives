// ==UserScript==
// @name         银河小工具1-基地升级计算器
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  自动计算升级材料，人口，快捷购买
// @match        https://g2.galactictycoons.com/*
// @author       Stella
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.g2.galactictycoons.com
// @downloadURL https://update.greasyfork.org/scripts/558432/%E9%93%B6%E6%B2%B3%E5%B0%8F%E5%B7%A5%E5%85%B71-%E5%9F%BA%E5%9C%B0%E5%8D%87%E7%BA%A7%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558432/%E9%93%B6%E6%B2%B3%E5%B0%8F%E5%B7%A5%E5%85%B71-%E5%9F%BA%E5%9C%B0%E5%8D%87%E7%BA%A7%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY_STORAGE = "GT_FULL_API_KEY_v1";
    const PANEL_BASE_ID   = "gt-base-info-panel";
    const PANEL_OVERVIEW_ID = "gt-overview-panel";
    const INPUT_BOX_ID    = "gt-api-box";
    const GAMEDATA_KEY    = "game_data";
    const MAIN_MINI_EMOJI = "🏭";
    const OVERVIEW_EMOJI  = "📦";
    const RESET_EMOJI     = "💀";
    const MAIN_MINIMIZED_KEY  = "gt_main_minimized";
    const CART_MINIMIZED_KEY  = "gt_cart_minimized";
    /* ---------- 图标 ID 映射表 ---------- */
const ICON_ID_MAP = {
    "Amenities": "BasicAmenities",
    "ConstructionKit": "BasicConstructionKit",
    "PrefabKit": "BasicPrefabKit",
    "ChemicalPlant": "ChemistryPlant"   // ← 新增
};
    function mapIconId(raw) {
    return ICON_ID_MAP[raw] || raw;
}

    /* 人口类别映射 */
const WORKER_TYPES = ['Worker', 'Technician', 'Engineer', 'Scientist'];
const WORKER_ICON_MAP = {
    Worker: 'Worker',
    Technician: 'Technician',
    Engineer: 'Engineer',
    Scientist: 'Scientist'
};

/* 根据基地数据实时计算各职业需求 */
/* 根据【目标等级】实时计算人口需求 */
function calcWorkersNeeded(baseData, targetLevels) {
    const need = [0, 0, 0, 0]; // W T E S
    const slots = Array.isArray(baseData.buildingSlots) ? baseData.buildingSlots : [];
    slots.forEach(slot => {
        const b      = slot.building || {};
        const type   = b.type;
        const slotId = slot.id;
        // 取目标等级，没有就保持当前
        const lvl = getTargetLevel(baseData.id, slotId, b.level || 1);
        const gdB = getBuildingFromGameData(type);
        if (!gdB) return;

        // 需求 → 负
        if (gdB.workersNeeded) {
            gdB.workersNeeded.forEach((base, i) => need[i] -= base * lvl);
        }
        // 住房 → 正
        if (gdB.workersHousing) {
            gdB.workersHousing.forEach((base, i) => need[i] += base * lvl);
        }
    });
    return need;
}

    /* ---------- 样式 ---------- */
    GM_addStyle(`
        body { -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
        #${INPUT_BOX_ID} .box { background: rgba(0,0,0,0.6); padding:12px; border-radius:10px; box-shadow:0 6px 24px rgba(0,0,0,0.6); font-family: Arial, sans-serif; color:#fff; backdrop-filter: blur(6px); border:1px solid rgba(255,255,255,0.04); }
        #${INPUT_BOX_ID} input { width: 260px; padding:6px; margin-top:6px; border-radius:6px; border:1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color:#fff; }
        #${INPUT_BOX_ID} button { margin-top:8px; padding:6px 10px; border-radius:6px; cursor:pointer; background: rgba(255,255,255,0.04); color:#fff; border:1px solid rgba(255,255,255,0.06); }

        .gt-panel { position: absolute; top: 120px; left: 20px; width: 560px; min-width: 300px; min-height: 120px; background: rgba(12,12,14,0.72); border-radius:12px; box-shadow: 0 12px 48px rgba(0,0,0,0.6); z-index:2147483000; overflow: hidden; color:#fff; font-family: Arial, sans-serif; backdrop-filter: blur(8px); border:1px solid rgba(255,255,255,0.04); display:flex; flex-direction:column; }
        .gt-panel.small { width: 360px; }
        .gt-panel .header { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:10px 12px; user-select:none; }
        .gt-panel .header .left-area { display:flex; align-items:center; gap:8px; }
        .gt-panel .header .title { font-weight:700; font-size:15px; color:#fff; display:flex; align-items:center; gap:8px; cursor:default; }
        .gt-panel .controls { display:flex; gap:6px; align-items:center; }
        .gt-panel .controls button, .gt-panel .left-area button { border:none; background:transparent; cursor:pointer; font-size:18px; padding:6px; border-radius:6px; color:#fff; }
        .gt-panel .content { padding:10px; overflow:auto; max-height:640px; color:#fff; }
        .gt-panel table { width:100%; border-collapse:collapse; font-size:13px; color:#fff; }
        .gt-panel th, .gt-panel td { padding:8px 8px; border-bottom:1px solid rgba(255,255,255,0.04); text-align:center; color:#fff; }
        .gt-panel th { font-weight:700; background: rgba(255,255,255,0.02); color:#fff; }
        .level-controls button { margin:0 4px; padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); color:#fff; cursor:pointer; }
        .mini-dot { position: fixed; z-index:2147483001; width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.06); box-shadow:0 10px 26px rgba(0,0,0,0.6); cursor:pointer; font-size:22px; color:#fff; backdrop-filter: blur(6px); border:1px solid rgba(255,255,255,0.04); }
        .resize-handle { position:absolute; width:14px; height:14px; right:8px; bottom:8px; cursor: se-resize; background: rgba(255,255,255,0.03); border-radius:3px; }
        .overview-list table td, .overview-list table th { text-align:left; padding:6px 8px; border-bottom:1px solid rgba(255,255,255,0.04); color:#fff; }
        .overview-icon { width:24px; height:24px; display:inline-block; vertical-align:middle; margin-right:6px; }
        .building-icon { width:20px; height:20px; display:inline-block; vertical-align:middle; margin-right:6px; }
        .empty-note { color: rgba(255,255,255,0.6); padding:6px 0; }

        /* 主控制按钮 */
        #gt-main-control { position: fixed; left: 8px; top: 120px; z-index:2147484002; width:52px; height:52px; border-radius:50%; background: rgba(255,255,255,0.08); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 8px 30px rgba(0,0,0,0.6); font-size:28px; backdrop-filter: blur(6px); border:1px solid rgba(255,255,255,0.04); }

        /* 弹出菜单 */
        #gt-control-menu { position: fixed; left: 68px; top: 120px; z-index:2147484001; display:none; flex-direction:column; gap:8px; }
        #gt-control-menu.show { display:flex; }
        #gt-control-menu button { width:48px; height:48px; border-radius:50%; background: rgba(255,255,255,0.08); color:#fff; border:none; cursor:pointer; font-size:22px; box-shadow: 0 6px 20px rgba(0,0,0,0.5); backdrop-filter: blur(6px); border:1px solid rgba(255,255,255,0.04); transition: all 0.2s; }
        #gt-control-menu button:hover { background: rgba(255,255,255,0.12); transform: scale(1.05); }

        /* 购物车 */
        #gt-cart-panel { position: fixed; left: -340px; top: 80px; width: 320px; height: calc(100vh - 120px); z-index:2147484000; background: rgba(20,20,24,0.85); color:#fff; border-radius:14px; box-shadow: 6px 12px 40px rgba(0,0,0,0.6); transition: left .22s ease-out; padding:12px; overflow:auto; border:1px solid rgba(255,255,255,0.03); }
        #gt-cart-panel.open { left: 12px; }
        #gt-cart-panel h3 { margin:0 0 8px 0; padding:0; font-size:14px; display:flex;align-items:center;gap:8px; }
        .gt-cart-row { display:flex; align-items:center; gap:10px; padding:10px; border-radius:12px; background: rgba(255,255,255,0.02); margin-bottom:10px; box-shadow: inset 0 -1px 0 rgba(255,255,255,0.02); }
        .gt-cart-row .icon { width:18px; height:18px; display:inline-block; }
        .gt-cart-row .name { flex:1; font-size:13px; color:#fff; }
        .gt-cart-row .qty { font-weight:700; min-width:48px; text-align:right; color:#fff; }
        .gt-cart-actions { display:flex; gap:8px; margin-top:8px; }
        .gt-cart-actions button { flex:1; padding:8px; border-radius:10px; cursor:pointer; border: none; background: rgba(255,255,255,0.04); color:#fff; font-weight:600; }
        .gt-qty-input { width:48px; text-align:center; border-radius:8px; border:none; padding:6px; background: rgba(255,255,255,0.03); color:#fff; }
        .gt-small-btn { background:#1E90FF; color:#fff; padding:6px 8px; border-radius:10px; border:none; cursor:pointer; font-size:13px; }

        /* ====== 手机适配 ====== */
@media (max-width: 768px) {
    /* 主面板：变窄 + 小字体 + 隐藏缩放把手 */
    .gt-panel {
        width: 92vw !important;
        min-width: 300px !important;
        max-width: 400px !important;
        font-size: 12px !important;
        top: 8px !important;
        left: 4vw !important;
    }
    .gt-panel td:nth-child(4),
    .gt-panel th:nth-child(4) {
        display: none !important;
    }
    .gt-panel .header .title { font-size: 14px !important; }
    .gt-panel th, .gt-panel td { padding: 4px 6px !important; font-size: 11px !important; }
    .resize-handle { display: none !important; }

    /* 总览面板同标准 */
    .gt-panel.small { width: 92vw !important; left: 4vw !important; }

    /* 主控制按钮贴右下 */
    #gt-main-control {
        left: auto !important;
        right: 12px !important;
        top: auto !important;
        bottom: 12px !important;
        width: 48px !important;
        height: 48px !important;
        font-size: 24px !important;
    }
    /* 弹出菜单跟随右侧 */
    #gt-control-menu {
        left: auto !important;
        right: 68px !important;
        top: auto !important;
        bottom: 12px !important;
        flex-direction: row !important;
        gap: 10px !important;
    }
    #gt-control-menu button {
        width: 44px !important;
        height: 44px !important;
        font-size: 20px !important;
    }

    /* 购物车面板略靠上，避免遮住底部按钮 */
    #gt-cart-panel {
        height: calc(100vh - 140px) !important;
        top: 70px !important;
    }
}




    `);

    /* ---------- 工具 ---------- */
    function escapeHtml(str) {
        if (!str && str !== 0) return '';
        return String(str).replace(/[&<>"'`=\/]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'})[s]);
    }
    function bubble(msg, time = 1500) {
        try {
            const div = document.createElement("div");
            div.textContent = msg;
            div.style.cssText = "position:fixed;right:20px;top:20px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;z-index:2147485000;opacity:0;transition:opacity .18s";
            document.body.appendChild(div);
            requestAnimationFrame(()=> div.style.opacity = 1);
            setTimeout(()=> { div.style.opacity = 0; setTimeout(()=> div.remove(), 220); }, time);
        } catch (e) { console.log(msg); }
    }

    /* ---------- gamedata ---------- */
    function fetchGameDataIfNeeded() {
        const cached = localStorage.getItem(GAMEDATA_KEY);
        if (cached) { try { JSON.parse(cached); return; } catch (e) {} }
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.g2.galactictycoons.com/gamedata.json",
            headers: { "Content-Type": "application/json" },
            onload: function (res) {
                try {
                    const data = typeof res.response === "object" ? res.response : JSON.parse(res.responseText);
                    localStorage.setItem(GAMEDATA_KEY, JSON.stringify(data));
                    console.log("[GameData] 已加载并缓存");
                } catch (e) { console.error("解析 gamedata 失败", e); }
            },
            onerror: function (err) { console.error("请求 gamedata 失败", err); }
        });
    }
    function getGameData() { try { return JSON.parse(localStorage.getItem(GAMEDATA_KEY) || "{}"); } catch (e) { return {}; } }
    function getBuildingFromGameData(typeId) {
        const gd = getGameData();
        if (!gd.buildings) return null;
        return gd.buildings.find(b => Number(b.id) === Number(typeId)) || null;
    }
    function getMaterialName(materialId) {
        const gd = getGameData();
        if (!gd.materials) return null;
        const m = gd.materials.find(x => Number(x.id) === Number(materialId));
        return m ? (m.name || m.title || m.id) : String(materialId);
    }
    function getBuildingIconId(buildingName) {
        if (!buildingName || buildingName === "-") return null;
        return buildingName.replace(/\s+/g, "");
    }

function ensureApiInput() {
    if (localStorage.getItem(API_KEY_STORAGE)) return;
    if (document.getElementById(INPUT_BOX_ID)) return;

    const wrap = document.createElement('div');
    wrap.id = INPUT_BOX_ID;
    wrap.style.position = 'fixed';
    wrap.style.top = '20px';
    wrap.style.right = '20px';
    wrap.style.width = '260px';
    wrap.style.padding = '12px';
    wrap.style.background = 'rgba(0,0,0,0.85)';
    wrap.style.color = '#fff';
    wrap.style.borderRadius = '8px';
    wrap.style.boxShadow = '0 4px 18px rgba(0,0,0,0.4)';
    wrap.style.zIndex = 2147484000;
    wrap.style.fontFamily = 'sans-serif';
    wrap.style.fontSize = '13px';

    wrap.innerHTML = `
        <div style="font-weight:700;margin-bottom:6px;">请输入 Full API Key：</div>
        <input id="gt-api-input" type="text" placeholder="Paste full api here..." style="width:100%;padding:4px 6px;border-radius:4px;border:none;font-size:13px;margin-bottom:6px;"/>
        <div style="text-align:right;">
            <button id="gt-save-api" style="padding:4px 8px;border:none;border-radius:4px;background:#1890ff;color:#fff;cursor:pointer;">保存</button>
        </div>`;

    document.body.appendChild(wrap);

    document.getElementById('gt-save-api').addEventListener('click', () => {
        const v = document.getElementById('gt-api-input').value.trim();
        if (!v) {
            alert('API 不能为空');
            return;
        }
        localStorage.setItem(API_KEY_STORAGE, v);
        wrap.remove();
        onUrlChange(true);
    });
}


    /* ---------- 目标等级缓存 ---------- */
    const targetLevels = {};
    function setTargetLevel(baseId, slotId, level) {
        if (!targetLevels[baseId]) targetLevels[baseId] = {};
        targetLevels[baseId][slotId] = level;
        updateOverviewPanel();
        // 实时刷新人口（新增）
    const panel = document.getElementById(PANEL_BASE_ID);
    if (panel) {
        const baseJson = panel.getAttribute('data-base-json');
        if (baseJson) {
            try {
                const baseData = JSON.parse(baseJson);
                renderWorkerSummary(baseData, panel);
            } catch (e) {}
        }
    }
    }
    function getTargetLevel(baseId, slotId, defaultLevel) {
        return (targetLevels[baseId] && targetLevels[baseId][slotId] != null) ? targetLevels[baseId][slotId] : defaultLevel;
    }

    /* ---------- 材料计算 ---------- */
    function calcMaterialsFromCurrentToTarget(baseMaterials, currentLevel, targetLevel) {
        const sums = {};
        if (!baseMaterials || !baseMaterials.length || targetLevel <= currentLevel) return sums;
        for (let lv = currentLevel + 1; lv <= targetLevel; lv++) {
            baseMaterials.forEach(m => {
                const amount = (m.am || 0) + (lv - 1);
                sums[m.id] = (sums[m.id] || 0) + amount;
            });
        }
        return sums;
    }
    /* 统计整个基地还需要多少材料（含 0→1 的基础建筑） */
/* 统计整个基地还需要多少材料（最终版） */
function aggregateForBase(baseId, baseData) {
    const agg = {};
    const slots = Array.isArray(baseData.buildingSlots) ? baseData.buildingSlots : [];

    slots.forEach(slot => {
        const b      = slot.building || {};
        const type   = b.type;
        const slotId = slot.id;

        // 空槽：起始等级 = 0
        if (!type || type === "-") {
            const targetLv = getTargetLevel(baseId, slotId, 0);
            if (targetLv <= 0) return;               // 仍空着，跳过
            const gdB = getBuildingFromGameData(type);
            if (!gdB || !gdB.constructionMaterials) return;
            // 0→targetLv 全套
            for (let lv = 1; lv <= targetLv; lv++) {
                gdB.constructionMaterials.forEach(m => {
                    const amount = (m.am || 0) + (lv - 1);
                    agg[m.id] = (agg[m.id] || 0) + amount;
                });
            }
            return;
        }

        // 已有建筑：起始等级 = 当前等级
        const currentLv = b.level || 0;
        const targetLv  = getTargetLevel(baseId, slotId, currentLv);
        if (targetLv <= currentLv) return;
        const gdB = getBuildingFromGameData(type);
        if (!gdB || !gdB.constructionMaterials) return;
        // currentLv+1 → targetLv
        for (let lv = currentLv + 1; lv <= targetLv; lv++) {
            gdB.constructionMaterials.forEach(m => {
                const amount = (m.am || 0) + (lv - 1);
                agg[m.id] = (agg[m.id] || 0) + amount;
            });
        }
    });

    return agg;
}
    /* ---------- 总览面板 ---------- */
    function createOrShowOverviewPanel() {
        let panel = document.getElementById(PANEL_OVERVIEW_ID);
        if (panel) { panel.style.display = ''; updateOverviewPanel(); return panel; }

        panel = document.createElement('div');
        panel.id = PANEL_OVERVIEW_ID;
        panel.className = 'gt-panel small';
        panel.style.display = 'none';
        panel.style.left = '600px';
        panel.style.top = '120px';
        panel.innerHTML = `
            <div class="header"><div class="title">${OVERVIEW_EMOJI} 升级材料总览</div>
                <div class="controls">
                    <button class="add-all-to-cart gt-small-btn" title="一键加入购物车" style="background:#1E90FF;">🛒</button>
                    <button class="toggle-hide" title="隐藏总览">_</button>
                    <button class="close-btn" title="关闭">✕</button>
                </div>
            </div>
            <div class="content">
                <div style="margin-bottom:8px; font-size:13px; color:#fff;"></div>
                <div class="overview-list" id="overview-list"></div>
            </div>
            <div class="resize-handle"></div>
        `;
        document.body.appendChild(panel);

        panel.querySelector('.close-btn').addEventListener('click', ()=> panel.remove());
        panel.querySelector('.toggle-hide').addEventListener('click', ()=> panel.style.display = 'none');
        panel.querySelector('.add-all-to-cart').addEventListener('click', ()=> {
            const arr = panel.__lastOverview || [];
            if (!arr.length) { bubble("没有可加入的材料"); return; }
            arr.forEach(it => addToCartByName(it.displayName, it.amount, it.iconId));
            bubble(`已将 ${arr.length} 种材料加入购物车`);
        });

        makeDraggable(panel);
        makeResizable(panel);
        updateOverviewPanel();
        return panel;
    }

    /* ---------- 拖拽 / 缩放 ---------- */
    function makeDraggable(el) {
        const header = el.querySelector('.header') || el;
        header.style.cursor = 'grab';
        let isDown = false, sx = 0, sy = 0, sl = 0, st = 0;
        header.addEventListener('mousedown', e => {
            if (e.button !== 0 || e.target.closest('button') || e.target.closest('input')) return;
            isDown = true; sx = e.clientX; sy = e.clientY;
            const r = el.getBoundingClientRect();
            sl = r.left; st = r.top;
            header.style.cursor = 'grabbing'; e.preventDefault();
        });
        document.addEventListener('mousemove', e => {
            if (!isDown) return;
            el.style.left = sl + e.clientX - sx + 'px';
            el.style.top  = st + e.clientY - sy + 'px';
        });
        document.addEventListener('mouseup', () => { isDown = false; header.style.cursor = 'grab'; });
    }
    function makeResizable(el) {
        const handle = el.querySelector('.resize-handle') || (()=>{ const h=document.createElement('div'); h.className='resize-handle'; el.appendChild(h); return h; })();
        let resizing = false, sx = 0, sy = 0, sw = 0, sh = 0;
        handle.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            resizing = true; sx = e.clientX; sy = e.clientY;
            const r = el.getBoundingClientRect();
            sw = r.width; sh = r.height; e.preventDefault();
        });
        document.addEventListener('mousemove', e => {
            if (!resizing) return;
            el.style.width  = Math.max(300, sw + e.clientX - sx) + 'px';
            el.style.height = Math.max(80,  sh + e.clientY - sy) + 'px';
        });
        document.addEventListener('mouseup', () => { resizing = false; });
    }

    /* ---------- 总览更新 ---------- */
    function updateOverviewPanel() {
        const panel = document.getElementById(PANEL_OVERVIEW_ID) || createOrShowOverviewPanel();
        const listDiv = panel.querySelector('#overview-list');
        if (!listDiv) return;

        const mainPanel = document.getElementById(PANEL_BASE_ID);
        if (!mainPanel) { listDiv.innerHTML = `<div class="empty-note">当前未打开主面板或无基地数据。</div>`; panel.__lastOverview = []; return; }
        const baseJson = mainPanel.getAttribute('data-base-json');
        if (!baseJson) { listDiv.innerHTML = `<div class="empty-note">主面板数据缺失。</div>`; panel.__lastOverview = []; return; }

        let baseData;
        try { baseData = JSON.parse(baseJson); } catch (e) {
            listDiv.innerHTML = `<div class="empty-note">解析主面板数据失败。</div>`; panel.__lastOverview = []; return;
        }

        const agg = aggregateForBase(baseData.id, baseData);
        const keys = Object.keys(agg).map(k => Number(k)).filter(k => agg[k] > 0);
        if (!keys.length) {
            listDiv.innerHTML = `<div class="empty-note">无需升级或未设置目标等级。</div>`; panel.__lastOverview = []; return;
        }

        const arr = keys.map(mid => ({
            mid,
            displayName: String(getMaterialName(mid) || mid),
            iconId: String(getMaterialName(mid) || mid).replace(/\s+/g, ''),
            amount: agg[mid]
        }));
        arr.sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' }));

        const table = document.createElement('table');
        table.innerHTML = `<thead><tr><th>名称</th><th>数量</th></tr></thead>`;
        const tbody = document.createElement('tbody');

        arr.forEach(item => {
          let id = item.displayName.replace(/\s+/g, "");
if (ICON_ID_MAP[id]) id = ICON_ID_MAP[id];
            const iconHtml = `<svg class="overview-icon" width="24" height="24" aria-hidden="true"><use xlink:href="/assets/sprite-DLZpwR1V.svg#${id}"></use></svg>`;
            const tr = document.createElement('tr');
            tr.innerHTML = `<td style="text-align:left;display:flex;align-items:center;gap:4px;">${iconHtml}<span>${escapeHtml(item.displayName)}</span></td><td>${item.amount}</td>`;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        listDiv.innerHTML = ''; listDiv.appendChild(table);
        panel.__lastOverview = arr;
    }

    /* ---------- 购物车 ---------- */
    const CART_KEY = "gt_shopping_cart_v2";
    function loadCart() { try { return GM_getValue(CART_KEY, {}); } catch (e) { try { return JSON.parse(localStorage.getItem(CART_KEY) || "{}"); } catch(e){return{}} } }
    function saveCart(cart) { try { GM_setValue(CART_KEY, cart); } catch (e) { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch(e){} } }
    function addToCartByName(name, qty, iconId = null) {
        if (!name) return;
        const cart = loadCart();
        if (!cart[name]) cart[name] = { qty: 0, iconId: iconId || null };
        cart[name].qty = (cart[name].qty || 0) + Math.max(0, Number(qty) || 0);
        if (iconId) cart[name].iconId = iconId;
        saveCart(cart); renderCartPanel();
    }
    function removeFromCart(name) { const cart = loadCart(); if (cart[name]) { delete cart[name]; saveCart(cart); renderCartPanel(); } }
    function clearCart() { saveCart({}); renderCartPanel(); }

    let currentPurchaseIndex = 0;

    function createCartPanel() {
        if (document.getElementById('gt-cart-panel')) return;
        const panel = document.createElement("div");
        panel.id = 'gt-cart-panel';
        panel.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <h3><svg width="16" height="16" aria-hidden="true" style="opacity:.95;"><use xlink:href="/assets/sprite-DLZpwR1V.svg#BasicAmenities"></use></svg><span style="font-size:13px;"> 购物车</span></h3>
                <div style="display:flex;gap:8px;"><button id="gt-cart-hide" class="gt-small-btn" title="收起">收起</button></div>
            </div>
            <div id="gt-cart-contents"></div>
            <div class="gt-cart-actions">
                <button id="gt-cart-next" class="gt-small-btn">💲购买下一个材料</button>
                <button id="gt-cart-clear" style="background:#c94;border-radius:10px;">清空购物车</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('gt-cart-hide').addEventListener('click', ()=> {
            panel.classList.remove('open');
            try { localStorage.setItem(CART_MINIMIZED_KEY, "1"); } catch(e){}
            hideControlMenu();
        });
        document.getElementById('gt-cart-clear').addEventListener('click', ()=> {
            if (!confirm("确认清空购物车？")) return;
            clearCart(); currentPurchaseIndex = 0; bubble('购物车已清空');
        });
        document.getElementById('gt-cart-next').addEventListener('click', ()=> purchaseNextItem());
        document.addEventListener('keydown', e=> {
            if (e.code === "Space" && location.href.includes("tab=exchange")) { e.preventDefault(); purchaseNextItem(); }
        });
    }

// 数字缩写函数

function formatNumberShort(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
}

function renderCartPanel() {
    const panel = document.getElementById('gt-cart-panel');
    if (!panel) return;
    const contents = panel.querySelector('#gt-cart-contents');
    if (!contents) return;
    contents.innerHTML = '';

    const cart = loadCart();
    const keys = Object.keys(cart);
    if (!keys.length) {
        contents.innerHTML = `<div style="opacity:.7">购物车为空</div>`;
        return;
    }

    /* 表头 */
    const head = document.createElement('div');
    head.style.cssText = 'display:flex;gap:10px;padding:6px 10px;font-size:12px;border-bottom:1px solid rgba(255,255,255,.08);';
    head.innerHTML = `
        <div style="flex:1">名称</div>
        <div style="width:70px;text-align:center">数量</div>
        <div style="width:50px;text-align:right">小计</div>
        <div style="width:24px"></div>`;
    contents.appendChild(head);

    let total = 0;
    keys.forEach((name, idx) => {
        const info = cart[name];
        const price = (PRICE_CACHE && PRICE_CACHE[name]) || 0;
        const sub = price * info.qty;
        total += sub;

        const row = document.createElement('div');
        row.className = 'gt-cart-row';
        row.dataset.name = name;

        // 图标
        let iconHtml = '';
        if (info.iconId) {
            const mapped = mapIconId(info.iconId);
            iconHtml = `<svg class="icon" width="18" height="18"><use xlink:href="/assets/sprite-DLZpwR1V.svg#${mapped}"></use></svg>`;
        } else {
            iconHtml = `<div class="icon" style="width:18px;height:18px;border-radius:4px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:12px;">📦</div>`;
        }

      row.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;flex:1;">
        ${iconHtml}
        <div class="name">${escapeHtml(name)}</div>
    </div>

    <div style="width:70px; display:flex; align-items:right;  gap:2px;">
        <button class="qty-minus" style="border:none;background:transparent;color:#fff;cursor:pointer;padding:4px;border-radius:8px;">−</button>
        <input class="gt-qty-input" value="${info.qty}" data-name="${escapeHtml(name)}" style="width:30px;text-align:center;font-size:11px;">
        <button class="qty-plus" style="border:none;background:transparent;color:#fff;cursor:pointer;padding:4px;border-radius:8px;">＋</button>
    </div>

    <div class="subtotal" style="width:50px;text-align:right;font-weight:600;font-size:11px;">${formatNumberShort(sub)}</div>

    <button class="remove-item" style="border:none;background:transparent;color:#f66;cursor:pointer;padding:6px;">✕</button>`;


        contents.appendChild(row);

        // 事件绑定
        const minus  = row.querySelector('.qty-minus');
        const plus   = row.querySelector('.qty-plus');
        const input  = row.querySelector('.gt-qty-input');
        const remove = row.querySelector('.remove-item');

        minus.addEventListener('click', () => {
            const c = loadCart();
            const cur = (c[name] && c[name].qty) || 1;
            c[name].qty = Math.max(1, Number(cur) - 1);
            saveCart(c);
            renderCartPanel();
        });

        plus.addEventListener('click', () => {
            const c = loadCart();
            const cur = (c[name] && c[name].qty) || 0;
            c[name].qty = Number(cur) + 1;
            saveCart(c);
            renderCartPanel();
        });

        input.addEventListener('change', () => {
            let v = parseInt(input.value);
            if (isNaN(v) || v < 1) v = 1;
            const c = loadCart();
            c[name].qty = v;
            saveCart(c);
            renderCartPanel();
        });

        remove.addEventListener('click', () => {
            if (!confirm(`移除 ${name}？`)) return;
            removeFromCart(name);
        });

        // 高亮当前购买行
        if (idx === currentPurchaseIndex % keys.length) {
            row.style.boxShadow = '0 4px 18px rgba(30,150,255,0.18)';
            row.style.border = '1px solid rgba(30,150,255,0.22)';
        }
    });

    /* 总价栏 */
    const foot = document.createElement('div');
    foot.style.cssText = 'display:flex;justify-content:flex-end;padding:8px 10px;font-size:13px;font-weight:600;border-top:1px solid rgba(255,255,255,.08);';
    foot.innerHTML = `<span>总价：<span style="color:#52c41a;">${total.toLocaleString()}</span></span>`;
    contents.appendChild(foot);
}


    async function purchaseNextItem() {
        const cart = loadCart();
        const keys = Object.keys(cart);
        if (!keys.length) { bubble('购物车为空'); return; }
        if (!location.href.includes("tab=exchange")) { bubble('请切换到 Exchange 页面'); return; }

        currentPurchaseIndex = currentPurchaseIndex % keys.length;
        const name = keys[currentPurchaseIndex];
        const qty  = cart[name].qty || 1;

        renderCartPanel();
        await buyItem([name, qty]);

        currentPurchaseIndex = (currentPurchaseIndex + 1) % keys.length;
        renderCartPanel();
    }

    async function buyItem([displayName, qty]) {
        if (!location.href.includes("tab=exchange")) { bubble('请切换到 Exchange 页'); return; }
        const search = document.querySelector('#nameFilter');
        if (!search) { bubble('未找到搜索框'); return; }
        search.focus(); search.value = displayName;
        search.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(r => setTimeout(r, 500));
        const rows = [...document.querySelectorAll('table tbody tr')];
        const target = rows.find(tr => tr.querySelector('td')?.textContent.trim() === displayName);
        if (!target) { bubble(`没找到 ${displayName}`); return; }
        target.scrollIntoView({ block: 'center' }); target.click();
        await new Promise(r => setTimeout(r, 400));
        const qtyInput = document.querySelector('#inputQuantity');
        if (!qtyInput) { bubble('未找到数量输入框'); return; }
        qtyInput.focus(); qtyInput.value = String(qty);
        qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
        bubble(`已选中 ${displayName} 并填入 ${qty}`);
    }

    /* ---------- 主面板 ---------- */
    function createOrUpdateMainPanel(baseData) {
        let panel = document.getElementById(PANEL_BASE_ID);
        const baseId = baseData.id;
        const titleName = baseData.name || `Base ${baseId}`;
        const slots = Array.isArray(baseData.buildingSlots) ? baseData.buildingSlots : [];

/* === 空槽快速建楼 === */
const buildings = getGameData().buildings || [];
const rowsHtml = slots.map(s => {
    const sid   = s.id ?? "-";
    const b     = s.building || {};
    const type  = b.type ?? "-";
    const level = b.level ?? 0;
    const repair = typeof b.cond === 'number' ? (b.cond * 100).toFixed(2) + '%' : '-';
    const gdB   = getBuildingFromGameData(type);
    const bName = gdB ? escapeHtml(gdB.name) : (type === "-" ? "-" : `Type ${type}`);
    let buildingIconHtml = '';
    if (gdB && gdB.name) {
        const iconIdRaw = getBuildingIconId(gdB.name);
        const iconId    = mapIconId(iconIdRaw);
        if (iconId) buildingIconHtml = `<svg class="building-icon" width="20" height="20" aria-hidden="true"><use xlink:href="/assets/sprite-DLZpwR1V.svg#${iconId}"></use></svg>`;
    }

    /* ① 空槽下拉 */
    const isEmpty = !b.type || b.type === "-";
    const selectHtml = isEmpty ? `
      <select class="slot-builder" data-slot-id="${sid}" title="快速建楼">
        <option value="">➕ 选择建筑</option>
        ${buildings.map(b =>
          `<option value="${b.id}">${escapeHtml(b.name)}</option>`).join('')}
      </select>` : '';

   const deleteBtn = (!isEmpty) ? `
  <button class="slot-del" data-slot-id="${sid}" title="删除建筑" style="margin-left:6px;background:transparent;color:#f66;border:none;cursor:pointer;font-size:14px;">🗑</button>` : '';

 return `<tr data-slot-id="${sid}" data-type="${type}" data-level="${level}">
            <td>${sid}</td>
           <td style="text-align:left;display:flex;align-items:center;gap:6px;">
    ${buildingIconHtml}
    ${isEmpty ? selectHtml : (bName + deleteBtn)}
</td>
            <td class="level-cell">${level} <span class="level-controls" data-slot="${sid}" data-type="${type}"></span></td>
            <td>${repair}</td>
        </tr>`;
}).join("");

        if (!panel) {
            panel = document.createElement('div');
            panel.id = PANEL_BASE_ID;
            panel.className = 'gt-panel';
            panel.style.left = '20px'; panel.style.top = '120px';
            panel.setAttribute('data-base-id', baseId);
            panel.setAttribute('data-base-json', JSON.stringify(baseData));
            panel.innerHTML = `
                <div class="header">
                    <div class="left-area">
                        <button class="reset-api" title="重置 API">${RESET_EMOJI}</button>
                        <div class="title" style="margin-left:6px;">${MAIN_MINI_EMOJI} ${escapeHtml(titleName)}</div>
                    </div>
                    <div class="controls">
                        <button class="overview-toggle" title="切换总览">${OVERVIEW_EMOJI}</button>
                        <button class="minimize-btn" title="最小化">_</button>
                    </div>
                </div>
                <div class="content">
                    <div style="margin-bottom:8px; font-size:13px; color:#fff;">
                        <strong>基地:</strong> ${escapeHtml(titleName)} &nbsp; <small style="color:rgba(255,255,255,0.6)">（ID ${baseId}）</small>
                    </div>
                    <!-- 人口需求 -->
<div class="worker-summary" style="margin-bottom:6px;font-size:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;"></div>
                    <table>
                        <thead><tr><th>Slot ID</th><th style="text-align:left">Building</th><th>Lvl</th><th>修缮度</th></tr></thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </div>
                <div class="resize-handle"></div>
            `;
            document.body.appendChild(panel);

            panel.querySelector('.overview-toggle').addEventListener('click', ()=> {
                const ov = document.getElementById(PANEL_OVERVIEW_ID);
                if (ov && ov.style.display !== 'none') ov.style.display = 'none'; else createOrShowOverviewPanel();
            });
            panel.querySelector('.minimize-btn').addEventListener('click', ()=> {
                panel.style.display = 'none'; try { localStorage.setItem(MAIN_MINIMIZED_KEY, "1"); } catch(e){} hideControlMenu();
            });
            panel.querySelector('.reset-api').addEventListener('click', ()=> {
                if (!confirm('是否确认重置 API？\n重置后需要重新输入 API，页面将刷新。')) return;
                try { localStorage.removeItem(API_KEY_STORAGE); } catch(e){} location.reload();
            });
            makeDraggable(panel); makeResizable(panel);
        } else {
            panel.setAttribute('data-base-id', baseId);
            panel.setAttribute('data-base-json', JSON.stringify(baseData));
            panel.style.display = '';
            panel.querySelector('.title').innerHTML = `${MAIN_MINI_EMOJI} ${escapeHtml(titleName)}`;
            panel.querySelector('tbody').innerHTML = rowsHtml;
        }
        try { if (localStorage.getItem(MAIN_MINIMIZED_KEY) === "1") panel.style.display = 'none'; } catch (e) {}
        renderWorkerSummary(baseData, panel);
        updateLevelControls(baseId, baseData);
        /* ② 空槽选择事件 */
/* ② 空槽选择事件 */
/* 空槽选择事件 */
panel.addEventListener('change', e => {
    if (!e.target.classList.contains('slot-builder')) return;
    const slotId  = e.target.dataset.slotId;
    const typeId  = e.target.value;
    if (!typeId) return;
    const gdB     = getBuildingFromGameData(typeId);
    if (!gdB) return;

    const slot = baseData.buildingSlots.find(s => String(s.id) === String(slotId));
    if (slot) {
        slot.building = {
            type: Number(typeId),
            level: 0,
            condition: 1,
            population: 0,
            populationCapacity: 0
        };
    }

    // 🔧 强制目标等级至少为 1，确保 0→1 材料被统计
    setTargetLevel(baseData.id, slotId, 1);

    createOrUpdateMainPanel(baseData);
    updateOverviewPanel();
    bubble(`已添加 ${gdB.name}`);
});
        /* ② 删除建筑（重置为空槽） */
panel.addEventListener('click', e => {
    if (!e.target.classList.contains('slot-del')) return;
    const slotId = e.target.dataset.slotId;
    const slot   = baseData.buildingSlots.find(s => String(s.id) === String(slotId));
    if (!slot) return;

    // 重置成空
    slot.building = { type: "-", level: 1, condition: 1 };

    // 清掉目标等级（防止残留）
    if (targetLevels[baseData.id]?.[slotId] != null) {
        delete targetLevels[baseData.id][slotId];
    }

    // 重绘
    createOrUpdateMainPanel(baseData);
    updateOverviewPanel();
    bubble('已删除建筑');
});
    }

    /* 渲染人口需求 */
function renderWorkerSummary(baseData, panel) {
    const sum = calcWorkersNeeded(baseData, targetLevels); // 用目标
    const container = panel.querySelector('.worker-summary');
    if (!container) return;
    container.innerHTML = WORKER_TYPES.map((type, i) => {
        const need = sum[i];
        const color = need >= 0 ? '#52c41a' : '#ff4d4f'; // ≤0 绿（富余）
        const icon = WORKER_ICON_MAP[type];
        return `<span style="display:inline-flex;align-items:center;gap:4px;">
                   <svg width="16" height="16"><use xlink:href="/assets/sprite-DLZpwR1V.svg#${icon}"></use></svg>
                   <span style="color:${color};font-weight:600;">${need}</span>
               </span>`;
    }).join('');
}


    /* ---------- 主控制按钮 & 菜单 ---------- */
   function createMainControl() {
    if (document.getElementById('gt-main-control')) return;

    const control = document.createElement('div');
    control.id = 'gt-main-control';
    control.innerHTML = '🐄';
    control.style.position = 'fixed';
    control.style.top = '20px';
    control.style.left = '20px';
    control.style.cursor = 'grab';
    control.style.zIndex = 9999;
    control.style.userSelect = 'none';
    document.body.appendChild(control);

    const menu = document.createElement('div');
    menu.id = 'gt-control-menu';
    menu.style.position = 'fixed';
    menu.style.top = '50px';   // 初始相对于奶牛按钮
    menu.style.left = '20px';
    menu.style.display = 'none';
    menu.style.zIndex = 9998;
    menu.innerHTML = `
        <button id="gt-show-factory" title="显示工厂面板">🏭</button>
        <button id="gt-show-cart" title="显示购物车">🛒</button>
    `;
    document.body.appendChild(menu);

    function updateMenuPosition() {
        menu.style.left = control.offsetLeft + 'px';
        menu.style.top = control.offsetTop + control.offsetHeight + 4 + 'px'; // 菜单在奶牛下方
    }

    // 点击显示/隐藏菜单
    control.addEventListener('click', () => {
        menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
        updateMenuPosition();
    });

    document.getElementById('gt-show-factory').addEventListener('click', () => {
        const p = document.getElementById(PANEL_BASE_ID);
        if (p) { p.style.display = ''; try { localStorage.setItem(MAIN_MINIMIZED_KEY, "0"); } catch(e){} }
        menu.style.display = 'none';
    });

    document.getElementById('gt-show-cart').addEventListener('click', () => {
        const p = document.getElementById('gt-cart-panel');
        if (p) { p.classList.add('open'); try { localStorage.setItem(CART_MINIMIZED_KEY, "0"); } catch(e){} renderCartPanel(); }
        menu.style.display = 'none';
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('#gt-main-control') && !e.target.closest('#gt-control-menu')) menu.style.display = 'none';
    });

    // ===== 拖动功能 =====
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    control.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - control.getBoundingClientRect().left;
        offsetY = e.clientY - control.getBoundingClientRect().top;
        control.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        // 限制不超出窗口
        const maxX = window.innerWidth - control.offsetWidth;
        const maxY = window.innerHeight - control.offsetHeight;
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        control.style.left = x + 'px';
        control.style.top = y + 'px';

        // 菜单跟随奶牛
        updateMenuPosition();
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            control.style.cursor = 'grab';
        }
    });
}
  /* ---------- 等级 +/- ---------- */
    function updateLevelControls(baseId, baseData) {
        const panel = document.getElementById(PANEL_BASE_ID);
        if (!panel) return;
        panel.querySelectorAll('tbody tr').forEach(row => {
            const sid   = row.getAttribute('data-slot-id');
            const type  = row.getAttribute('data-type');
            const level = Number(row.getAttribute('data-level') || 1);
            const cell  = row.querySelector('.level-controls');
            if (!cell) return;
            cell.innerHTML = '';
            const btnMinus = document.createElement('button'); btnMinus.textContent = '-';
            const btnPlus  = document.createElement('button'); btnPlus.textContent = '+';
            const span     = document.createElement('span'); span.style.marginLeft = '6px'; span.style.fontWeight = '600';
            const curTar   = getTargetLevel(baseId, sid, level);
            span.textContent = `→ ${curTar}`;
            cell.appendChild(btnMinus); cell.appendChild(btnPlus); cell.appendChild(span);

            btnMinus.addEventListener('click', ()=> {
                const cur = getTargetLevel(baseId, sid, level);
                if (cur > level) { setTargetLevel(baseId, sid, cur - 1); span.textContent = `→ ${cur - 1}`; updateOverviewPanel(); }
            });
            btnPlus.addEventListener('click', ()=> {
                const cur = getTargetLevel(baseId, sid, level);
                setTargetLevel(baseId, sid, cur + 1); span.textContent = `→ ${cur + 1}`; updateOverviewPanel();
            });
            if (getTargetLevel(baseId, sid, level) < level) setTargetLevel(baseId, sid, level);
        });
        updateOverviewPanel();
         renderWorkerSummary(baseData, panel);

    }
    /* ---------- 拉取基地信息 ---------- */
    function fetchBaseInfo(baseId) {
        const apiKey = localStorage.getItem(API_KEY_STORAGE);
        if (!apiKey) { ensureApiInput(); return; }
        const url = `https://api.g2.galactictycoons.com/public/company/base/${baseId}?apikey=${encodeURIComponent(apiKey)}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "json",
            onload: function (res) {
                try {
                    const data = (res.response && typeof res.response === 'object') ? res.response : JSON.parse(res.responseText || '{}');
                    const keep = { id: data.id, name: data.name, buildingSlots: data.buildingSlots || [] };
                    createOrUpdateMainPanel(keep);
                } catch (e) {
                    console.error("解析 API 返回失败", e, res);
                    alert("API 返回解析失败（查看控制台）");
                }
            },
            onerror: function (err) { console.error("API 请求失败", err); }
        });
    }

    /* ---------- URL 监听 ---------- */
    let lastBaseId = null;
    function extractBaseIdFromUrl(url) {
        try {
            const u = new URL(url, location.origin);
            const m = u.pathname.match(/\/base\/(\d+)/);
            return m ? Number(m[1]) : null;
        } catch(e) { return null; }
    }
    function onUrlChange(force = false) {
        const baseId = extractBaseIdFromUrl(location.href);
        if (!baseId) return;
        if (force || baseId !== lastBaseId) { lastBaseId = baseId; fetchBaseInfo(baseId); }
        createCartPanel(); renderCartPanel();
    }
    (function(h){
        const p = h.pushState, r = h.replaceState;
        h.pushState = function(){ const ret = p.apply(h, arguments); setTimeout(onUrlChange, 200); return ret; };
        h.replaceState = function(){ const ret = r.apply(h, arguments); setTimeout(onUrlChange, 200); return ret; };
    })(window.history);
    window.addEventListener('popstate', ()=> setTimeout(onUrlChange, 200));
    setInterval(()=> onUrlChange(false), 1000);
/* ---------- 价格缓存 ---------- */
let PRICE_CACHE = null;          // { 材料名 -> currentPrice }
async function fetchPricesOnce() {
    if (PRICE_CACHE) return;     // 已经拉过就直接用
    const apiKey = localStorage.getItem(API_KEY_STORAGE);
    if (!apiKey) return;
    try {
        const res = await fetch(`https://api.g2.galactictycoons.com/public/exchange/mat-prices?apikey=${encodeURIComponent(apiKey)}`);
        const json = await res.json();
        const map = {};
        (json.prices || []).forEach(p => {
            map[p.matName] = p.currentPrice;   // 用 matName 做 key，与购物车/总览一致
        });
        PRICE_CACHE = map;
        console.log('[GT] 材料价格已缓存', Object.keys(map).length, '条');
    } catch (e) {
        console.error('[GT] 取价失败', e);
        PRICE_CACHE = {};   // 防呆，避免下次重试
    }
}
    /* ---------- 启动 ---------- */
  (async function init() {
    fetchGameDataIfNeeded();
    ensureApiInput();
    await fetchPricesOnce();   // ① 先取价
    setTimeout(onUrlChange, 800);
    createCartPanel();
    renderCartPanel();         // ② 再渲染，此时 PRICE_CACHE 已就绪
    createMainControl();
})();

    window.__GT_tools = { fetchGameDataIfNeeded, fetchBaseInfo, updateOverviewPanel, setTargetLevel, loadCart, saveCart, addToCartByName, renderCartPanel, purchaseNextItem };
})();