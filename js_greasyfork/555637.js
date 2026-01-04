// ==UserScript==
// @name         裝備篩選器（裝備種類與孔洞篩選）
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  為裝備區添加貼合原樣式的篩選器，支持類別和鑲嵌孔數量篩選（匹配孔洞高亮插件判斷方式）
// @author       You
// @match        https://sorceryntax3.onrender.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555637/%E8%A3%9D%E5%82%99%E7%AF%A9%E9%81%B8%E5%99%A8%EF%BC%88%E8%A3%9D%E5%82%99%E7%A8%AE%E9%A1%9E%E8%88%87%E5%AD%94%E6%B4%9E%E7%AF%A9%E9%81%B8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555637/%E8%A3%9D%E5%82%99%E7%AF%A9%E9%81%B8%E5%99%A8%EF%BC%88%E8%A3%9D%E5%82%99%E7%A8%AE%E9%A1%9E%E8%88%87%E5%AD%94%E6%B4%9E%E7%AF%A9%E9%81%B8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== CSS樣式 =====
    const style = document.createElement('style');
    style.textContent = `
        /* 只作用於裝備區的隱藏類 */
        #available-equipment-box .equip-filter-hidden { display: none !important; }

        /* 裝備容器樣式修正 - 僅限裝備區域 */
        #available-equipment-box > .css-1i2v0sq {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 11px !important;
            box-sizing: border-box !important;
            margin: 0 !important;
        }

        /* 裝備項目hover效果 */
        #available-equipment-box .chakra-tooltip__trigger:hover {
            transform: translateY(-2px) scale(1.02) !important;
            box-shadow: 0 3px 10px rgba(0,200,255,0.25) !important;
            transition: all 0.2s ease !important;
        }

        /* 裝備篩選器容器 */
        .equipment-filter-container {
            margin: 8px 0 12px 0;
            padding: 8px 12px;
            background: rgba(15,20,35,0.7);
            border: 1px solid rgba(80,120,220,0.3);
            border-radius: 6px;
            font-size: 13px;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        /* 篩選按鈕樣式 */
        .equipment-filter-container .equip-filter-btn {
            padding: 5px 12px;
            margin: 3px 5px 3px 0;
            border: 1px solid rgba(80,120,220,0.5);
            border-radius: 4px;
            background: rgba(30,40,65,0.6);
            color: #ddd;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            font-family: inherit !important;
        }

        .equipment-filter-container .equip-filter-btn.active {
            background: rgba(60, 100, 200, 0.7);
            color: #fff;
            border-color: rgba(100,150,255,0.8);
            box-shadow: 0 0 8px rgba(100,150,255,0.4);
        }

        .equipment-filter-container .equip-filter-btn:hover:not(.active) {
            background: rgba(40,50,85,0.8);
            border-color: rgba(100,150,255,0.6);
        }

        .equipment-filter-container .filter-title {
            color: #acc3ff;
            font-weight: 500;
            margin-right: 8px;
            font-size: 13px;
        }

        /* 按鈕容器樣式 */
        #equip-type-buttons, #equip-slot-buttons {
            display: inline-flex !important;
            flex-wrap: wrap !important;
            max-width: calc(100% - 100px) !important;
        }

        /* 篩選器分組間距 */
        .filter-group {
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px dashed rgba(80,120,220,0.2);
        }

        .filter-group:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
    `;
    document.head.appendChild(style);

    let equipFilterContainer = null;

    // ===== 事件處理 =====
    document.addEventListener('click', handleClick, true);

    function handleClick(e) {
        const t = e.target.closest('.equip-filter-btn, #equip-select-all, #slot-select-all');
        if (!t) return;

        e.preventDefault();
        e.stopPropagation();

        if (t.id === 'equip-select-all') {
            activateEquipSelectAll();
        } else if (t.id === 'slot-select-all') {
            activateSlotSelectAll();
        } else if (t.classList.contains('equip-type-btn')) {
            toggleEquipType(t);
        } else if (t.classList.contains('equip-slot-btn')) {
            toggleEquipSlot(t);
        }
        applyCombinedFilters();
    }

    // ===== 裝備篩選邏輯 =====
    function activateEquipSelectAll() {
        const selectAllBtn = document.getElementById('equip-select-all');
        const typeBtns = document.querySelectorAll('.equip-type-btn');

        selectAllBtn?.classList.add('active');
        typeBtns.forEach(btn => btn.classList.remove('active'));
    }

    function activateSlotSelectAll() {
        const selectAllBtn = document.getElementById('slot-select-all');
        const slotBtns = document.querySelectorAll('.equip-slot-btn');

        selectAllBtn?.classList.add('active');
        slotBtns.forEach(btn => btn.classList.remove('active'));
    }

    function toggleEquipType(btn) {
        const selectAllBtn = document.getElementById('equip-select-all');
        selectAllBtn?.classList.remove('active');
        btn.classList.toggle('active');

        const activeTypes = Array.from(document.querySelectorAll('.equip-type-btn.active'));
        if (activeTypes.length === 0) {
            activateEquipSelectAll();
        }
    }

    function toggleEquipSlot(btn) {
        const selectAllBtn = document.getElementById('slot-select-all');
        selectAllBtn?.classList.remove('active');
        btn.classList.toggle('active');

        const activeSlots = Array.from(document.querySelectorAll('.equip-slot-btn.active'));
        if (activeSlots.length === 0) {
            activateSlotSelectAll();
        }
    }

    // 組合篩選（同時考慮類別和孔位）
    function applyCombinedFilters() {
        const activeTypes = Array.from(document.querySelectorAll('.equip-type-btn.active'))
            .map(btn => btn.dataset.type);
        const activeSlots = Array.from(document.querySelectorAll('.equip-slot-btn.active'))
            .map(btn => btn.dataset.slot);

        // 判斷是否啟用了"全部"選項
        const isAllTypes = document.getElementById('equip-select-all')?.classList.contains('active') || activeTypes.length === 0;
        const isAllSlots = document.getElementById('slot-select-all')?.classList.contains('active') || activeSlots.length === 0;

        // 使用與孔洞高亮插件相同的選擇器定位裝備元素
        document.querySelectorAll('#available-equipment-box [data-scope="tooltip"][data-part="trigger"]').forEach(item => {
            // 類別判斷
            const name = item.querySelector('.css-9y6172')?.textContent.trim();
            const typeMatch = isAllTypes || (name && activeTypes.includes(name));

            // 孔位數量判斷（使用改良後的檢測方法）
            const slotCount = getSocketCount(item); // 關鍵改動：使用與高亮插件一致的孔位檢測邏輯
            const slotMatch = isAllSlots || activeSlots.some(slot => {
                if (slot === '0') return slotCount === 0;
                if (slot === '1') return slotCount === 1;
                if (slot === '2') return slotCount === 2;
                if (slot === '3') return slotCount === 3;
                if (slot === '4+') return slotCount >= 4;
                return false;
            });

            // 同時滿足類別和孔位條件才顯示
            if (typeMatch && slotMatch) {
                item.classList.remove('equip-filter-hidden');
            } else {
                item.classList.add('equip-filter-hidden');
            }
        });
    }

    // ===== 關鍵改動：使用與孔洞高亮插件完全一致的孔位檢測邏輯 =====
    function getSocketCount(element) {
        // 查找孔洞指示器元素（與高亮插件選擇器一致）
        const socketIndicator = element.querySelector('.css-10sf1q0');
        if (!socketIndicator) return 0;

        // 計算✦符號的數量（區分已鑲嵌和空孔，與高亮插件邏輯一致）
        const filledSockets = socketIndicator.querySelectorAll('.css-hwqf06').length; // 已鑲嵌的孔
        const emptySockets = socketIndicator.querySelectorAll('.css-1lo8ipw').length;   // 空孔

        return filledSockets + emptySockets; // 總孔位數 = 已鑲嵌 + 空孔
    }

    function showAllEquipment() {
        document.querySelectorAll('#available-equipment-box [data-scope="tooltip"][data-part="trigger"]')
            .forEach(item => item.classList.remove('equip-filter-hidden'));
    }

    // ===== 建立裝備篩選器 =====
    function createEquipFilter() {
        if (equipFilterContainer) {
            equipFilterContainer.remove();
        }

        const equipBox = document.getElementById('available-equipment-box');
        if (!equipBox) return false;

        equipFilterContainer = document.createElement('div');
        equipFilterContainer.className = 'equipment-filter-container';
        equipFilterContainer.innerHTML = `
            <div class="filter-group">
                <div style="display: flex; align-items: center; flex-wrap: wrap;">
                    <span class="filter-title">裝備類別篩選：</span>
                    <button id="equip-select-all" class="equip-filter-btn active">全部</button>
                    <div id="equip-type-buttons"></div>
                </div>
            </div>
            <div class="filter-group">
                <div style="display: flex; align-items: center; flex-wrap: wrap;">
                    <span class="filter-title">鑲嵌孔數量篩選：</span>
                    <button id="slot-select-all" class="equip-filter-btn active">全部</button>
                    <div id="equip-slot-buttons">
                        <button class="equip-filter-btn equip-slot-btn" data-slot="0">無鑲嵌孔</button>
                        <button class="equip-filter-btn equip-slot-btn" data-slot="1">一個鑲嵌孔</button>
                        <button class="equip-filter-btn equip-slot-btn" data-slot="2">兩個鑲嵌孔</button>
                        <button class="equip-filter-btn equip-slot-btn" data-slot="3">三個鑲嵌孔</button>
                        <button class="equip-filter-btn equip-slot-btn" data-slot="4+">4個(含)以上</button>
                    </div>
                </div>
            </div>
        `;

        equipBox.insertBefore(equipFilterContainer, equipBox.firstChild);
        updateEquipFilterButtons();
        return true;
    }

    // 更新裝備類別篩選按鈕
    function updateEquipFilterButtons() {
        // 使用與高亮插件相同的裝備元素選擇器
        const equipItems = document.querySelectorAll('#available-equipment-box [data-scope="tooltip"][data-part="trigger"]');
        const types = new Set();

        equipItems.forEach(item => {
            const typeName = item.querySelector('.css-9y6172')?.textContent.trim();
            if (typeName) types.add(typeName);
        });

        const buttonContainer = document.getElementById('equip-type-buttons');
        if (!buttonContainer) return;

        const currentTypes = Array.from(buttonContainer.querySelectorAll('.equip-type-btn'))
            .map(btn => btn.dataset.type);
        const newTypes = [...types].sort();

        if (JSON.stringify(currentTypes.sort()) === JSON.stringify(newTypes)) {
            return;
        }

        buttonContainer.innerHTML = '';
        newTypes.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'equip-filter-btn equip-type-btn';
            btn.dataset.type = type;
            btn.textContent = type;
            buttonContainer.appendChild(btn);
        });
    }

    // ===== 監控頁面變化 =====
    function checkAndCreateFilters() {
        const equipBox = document.getElementById('available-equipment-box');
        if (!equipBox) return;

        if (!equipFilterContainer || !equipBox.contains(equipFilterContainer)) {
            createEquipFilter();
        } else {
            updateEquipFilterButtons();
        }
    }

    // 啟動監控
    function start() {
        setInterval(checkAndCreateFilters, 1000);

        const observer = new MutationObserver(() => {
            setTimeout(checkAndCreateFilters, 300);
        });

        const target = document.getElementById('available-equipment-box') || document.body;
        observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: false
        });

        checkAndCreateFilters();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    console.log('裝備篩選器已啟動，支持類別和鑲嵌孔數量篩選（與孔洞高亮插件同步判斷邏輯）');
})();