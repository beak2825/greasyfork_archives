// ==UserScript==
// @name         地牢计算器
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  计算地牢利润
// @author       dying084
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554456/%E5%9C%B0%E7%89%A2%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554456/%E5%9C%B0%E7%89%A2%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const __tm_shadow_host = document.createElement('div');
    __tm_shadow_host.id = 'tm-shadow-host';
    // prevent host from being affected by page layout
    __tm_shadow_host.style.all = 'initial';
    __tm_shadow_host.style.position = 'fixed';
    __tm_shadow_host.style.top = '0';
    __tm_shadow_host.style.left = '0';
    __tm_shadow_host.style.zIndex = '100000';
    document.documentElement.appendChild(__tm_shadow_host);
    const __TM_SHADOW_ROOT__ = __tm_shadow_host.attachShadow({ mode: 'open' });

    (function () {
        const __tm_style = document.createElement('style');
        __tm_style.textContent = `
    :host {font-family: "Microsoft YaHei", sans-serif;}
    #tm-toggle-btn {position: fixed; top: 130px; right: 20px; padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; z-index: 10000;}
    #tm-draggable-box {position: fixed; top: 100px; left: 250px; width: 900px; background: white; border: 1px solid #ccc; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-radius: 8px; display: none; z-index: 9999; font-size: 10px;}
    #tm-drag-header {padding: 10px; background: #007bff; color: white; cursor: move; border-top-left-radius: 8px; border-top-right-radius: 8px; user-select: none; display: flex; align-items: center; gap: 10px;}
    #tm-drag-header select {background: white; color: #333; border: none; border-radius: 4px; padding: 4px 8px; font-size: 14px; cursor: pointer;}
    #tm-control-bar {display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid #ddd;}
    #tm-control-bar input[type="text"] {flex: 1; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px;}
    #tm-control-bar input::placeholder {color: #999;}
    #tm-control-bar input[type="checkbox"] {transform: scale(1.2); margin-right: 3px;}
    #tm-control-bar select {padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;}
    #tm-control-bar label {font-size: 14px;}
    #tm-profit-line {padding: 6px 10px; border-bottom: 1px solid #ddd; color: #333; font-weight: 500;}
    #tm-tables { display: flex; gap: 10px; } 
    .tm-table-container { width: 100%; margin-bottom: 10px; }
    table {width: 100%; border-collapse: collapse;}
    th, td {border: 1px solid #ccc; padding: 3px; text-align: center;}
    td[contenteditable="true"] {background: #fdfdfd;}
    td[contenteditable="true"]:focus {background: #fff8dc; outline: none;}
    #tm-control-bar input[type="text"],
    #tm-control-bar select,
    #tm-control-bar button {background-color: #fff;color: #333;border: 1px solid #ccc;border-radius: 4px;}
    #tm-control-bar input[type="text"]:focus,
    #tm-control-bar select:focus,
    #tm-control-bar button:hover {border-color: #007bff;box-shadow: 0 0 2px rgba(0, 123, 255, 0.5);outline: none;}
    @media (max-width: 768px) {
        #tm-draggable-box {left: 20px !important;right: 20px !important;width: calc(100% - 40px) !important;top: 60px;font-size: 12px;max-height: 80vh;overflow-y: auto;-webkit-overflow-scrolling: touch;z-index: 10001;}
        #tm-control-bar {flex-wrap: wrap;justify-content: flex-start;gap: 6px;}
        #tm-control-bar input[type="text"] {width: 60px !important;flex: 0 0 auto !important;padding: 2px 4px;font-size: 12px;}
    }
  `;
        __TM_SHADOW_ROOT__.appendChild(__tm_style);
    })();

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'tm-toggle-btn';
    toggleBtn.innerText = '地牢计算器';

    const draggableBox = document.createElement('div');
    draggableBox.id = 'tm-draggable-box';
    draggableBox.innerHTML = `
    <div id="tm-drag-header">
        <select id="scene-select">
            <option value="奇幻洞穴">奇幻洞穴</option>
            <option value="阴森马戏团">阴森马戏团</option>
            <option value="秘法要塞">秘法要塞</option>
            <option value="海盗基地">海盗基地</option>
        </select>
        <select id="tier-select">
            <option value="T0">T0</option>
            <option value="T1">T1</option>
            <option value="T2">T2</option>
        </select>
        <button id="tm-clear-storage-btn" style="margin-left:auto; padding:2px 6px; cursor:pointer;">清空本地存储</button>
    </div>

    <div id="tm-content">
        <div id="tm-control-bar">
            <input type="text" id="tm-time-input" placeholder="每轮时间（分钟）">
            <input type="text" id="tm-players-count-input" placeholder="人数（默认5）">
            <label><input type="checkbox" id="tm-bag-check" >暴饮之囊</label>
            <select id="tm-enhance-select"></select>
            <label><input type="checkbox" id="tm-buff-check">战斗掉落</label>
            <select id="tm-buff-select"></select>
            <div id="tm-profit-line" style="font-size:14px;">期望日入：</div>
        </div>

    <div id="tm-tables" style="display:flex; gap:10px; margin-left:5px; margin-right:5px;">
        <!-- 左侧列 -->
        <div style="flex:1; display:flex; flex-direction:column; gap:10px;">
            <div class="tm-table-container">
                <table id="tm-left-table"></table>
            </div>
            <div class="tm-table-container" id="tm-third-table-container" style="display:none;">
                <table id="tm-third-table"></table>
            </div>
            <p style="font-size:14px; color:#555;">
                &emsp;&emsp;点击“价格（*）”可复制整列至采用价格，点击“价格（*）”列中的值可复制对应价格至采用价格。<br>
                &emsp;&emsp;计算利润时，钥匙价格取自制和购买采用价格中更低的；<br>
                &emsp;&emsp;大宝箱、代币价格不会自动随自定义产物或兑换物价格更新，如有需要请自行计算并填写
            </p>
        </div>

        <!-- 右侧列 -->
        <div class="tm-table-container" style="flex:1;"">
            <table id="tm-right-table"></table>
        </div>
    </div>
  `;

    const fetchPriceBtn = document.createElement('button');
    fetchPriceBtn.id = 'tm-fetch-price-btn';
    fetchPriceBtn.textContent = '获取价格';
    fetchPriceBtn.style.marginTop = '8px';
    fetchPriceBtn.style.padding = '4px';
    fetchPriceBtn.style.cursor = 'pointer';

    const calcKeyBtn = document.createElement('button');
    calcKeyBtn.id = 'tm-calc-key-btn';
    calcKeyBtn.textContent = '计算价格';
    calcKeyBtn.style.marginTop = '8px';
    calcKeyBtn.style.padding = '4px 4px';
    calcKeyBtn.style.cursor = 'pointer';

    __TM_SHADOW_ROOT__.appendChild(toggleBtn);
    __TM_SHADOW_ROOT__.appendChild(draggableBox);

    const sceneSelect = draggableBox.querySelector('#scene-select');
    const tierSelect = draggableBox.querySelector('#tier-select');
    const timeInput = draggableBox.querySelector('#tm-time-input');
    const playersCountInput = draggableBox.querySelector('#tm-players-count-input');
    const bagCheck = draggableBox.querySelector('#tm-bag-check');
    const enhanceSelect = draggableBox.querySelector('#tm-enhance-select');
    const leftTable = draggableBox.querySelector('#tm-left-table');
    const rightTable = draggableBox.querySelector('#tm-right-table');
    const thirdTableContainer = draggableBox.querySelector('#tm-third-table-container');
    const thirdTable = draggableBox.querySelector('#tm-third-table');
    const dailyProfitDisplay = draggableBox.querySelector('#tm-profit-line');
    const buffCheck = draggableBox.querySelector('#tm-buff-check');
    const buffSelect = draggableBox.querySelector('#tm-buff-select');

    thirdTableContainer.insertAdjacentElement('afterend', fetchPriceBtn);
    thirdTableContainer.insertAdjacentElement('afterend', calcKeyBtn);

    for (let i = 0; i <= 20; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `+${i}`;
        enhanceSelect.appendChild(opt);
    }

    for (let i = 1; i <= 20; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Lv${i}`;
        buffSelect.appendChild(opt);
    }

    const globalBag = localStorage.getItem('globalBag') === 'true';
    const globalEnhance = localStorage.getItem('globalEnhance') || '0';
    bagCheck.checked = globalBag;
    enhanceSelect.value = globalEnhance;
    enhanceSelect.disabled = !bagCheck.checked;

    bagCheck.addEventListener('change', () => {
        enhanceSelect.disabled = !bagCheck.checked;
        localStorage.setItem('globalBag', bagCheck.checked);
        localStorage.setItem('globalEnhance', enhanceSelect.value);
    });
    enhanceSelect.addEventListener('change', () => {
        localStorage.setItem('globalEnhance', enhanceSelect.value);
    });

    toggleBtn.onclick = () => {
        draggableBox.style.display = draggableBox.style.display === 'none' ? 'block' : 'none';
    };

    const globalBuff = localStorage.getItem('globalBuff') === 'true';
    const globalBuffLevel = localStorage.getItem('globalBuffLevel') || '1';
    buffCheck.checked = globalBuff;
    buffSelect.value = globalBuffLevel;
    buffSelect.disabled = !buffCheck.checked;

    buffCheck.addEventListener('change', () => {
        buffSelect.disabled = !buffCheck.checked;
        localStorage.setItem('globalBuff', buffCheck.checked);
        localStorage.setItem('globalBuffLevel', buffSelect.value);
    });

    buffSelect.addEventListener('change', () => {
        localStorage.setItem('globalBuffLevel', buffSelect.value);
    });

    const dragHeader = draggableBox.querySelector('#tm-drag-header');
    let isDragging = false, offsetX = 0, offsetY = 0;

    dragHeader.addEventListener('mousedown', e => {
        if (e.target.tagName === 'SELECT') return;
        isDragging = true;
        offsetX = e.clientX - draggableBox.offsetLeft;
        offsetY = e.clientY - draggableBox.offsetTop;
        e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        draggableBox.style.left = (e.clientX - offsetX) + 'px';
        draggableBox.style.top = (e.clientY - offsetY) + 'px';
    });
    document.addEventListener('mouseup', () => isDragging = false);

    const sceneTables = {
        '奇幻洞穴': {
            left: [
                ['钥匙原材料种类', '价格（扫单）', '价格（挂单）', '采用价格'],
                ['蓝色钥匙碎片', 0, 0, 0],
                ['绿色钥匙碎片', 0, 0, 0],
                ['紫色钥匙碎片', 0, 0, 0],
                ['白色钥匙碎片', 0, 0, 0],
                ['奇幻宝箱钥匙（自制）', 0, 0, 0],
                ['奇幻宝箱钥匙', 0, 0, 0],
                ['暗影皮革', 0, 0, 0],
                ['野兽皮革', 0, 0, 0],
                ['奇幻钥匙（自制）', 0, 0, 0],
                ['奇幻钥匙', 0, 0, 0]
            ],
            right: [
                ['产物种类', '价格（挂单）', '价格（填单）', '采用价格', '箱期望数量'],
                ['奇幻精华', 0, 0, 0, 750],
                ['奇幻代币', 0, 0, 0, 487.5],
                ['大宝箱', 0, 0, 0, 0.9],
                ['翡翠', 0, 0, 0, 7.5],
                ['太阳石', 0, 0, 0, 0.5],
                ['盾击', 0, 0, 0, 0.75],
                ['致残斩', 0, 0, 0, 0.75],
                ['疫病射击', 0, 0, 0, 0.75],
                ['狮鹫之皮', 0, 0, 0, 0.1],
                ['蝎狮之刺', 0, 0, 0, 0.06],
                ['鹿角兔之角', 0, 0, 0, 0.05],
                ['渡渡驼之翎', 0, 0, 0, 0.02],
                ['狮鹫之爪', 0, 0, 0, 0.02],
                ['奇幻宝箱钥匙', 0, 0, 0, 0.02],
                ['奇幻箭袋', 0, 0, 0, 0.03],
                ['狮鹫皮衣', 0, 0, 0, 0.003],
                ['狮鹫皮裤', 0, 0, 0, 0.003],
                ['蝎狮盾', 0, 0, 0, 0.003],
                ['鹿角兔之杖', 0, 0, 0, 0.002],
                ['渡渡驼护手', 0, 0, 0, 0.0015],
                ['狮鹫重盾', 0, 0, 0, 0.0005],
                ['期望利润', 0, 0, 0, 0]
            ]
        },
        '阴森马戏团': {
            left: [
                ['钥匙原材料种类', '价格（扫单）', '价格（挂单）', '采用价格'],
                ['紫色钥匙碎片', 0, 0, 0],
                ['橙色钥匙碎片', 0, 0, 0],
                ['棕色钥匙碎片', 0, 0, 0],
                ['黑暗钥匙碎片', 0, 0, 0],
                ['阴森宝箱钥匙（自制）', 0, 0, 0],
                ['阴森宝箱钥匙', 0, 0, 0],
                ['神圣奶酪', 0, 0, 0],
                ['彩虹奶酪', 0, 0, 0],
                ['阴森钥匙（自制）', 0, 0, 0],
                ['阴森钥匙', 0, 0, 0]
            ],
            right: [
                ['产物种类', '价格（挂单）', '价格（填单）', '采用价格', '箱期望数量'],
                ['阴森精华', 0, 0, 0, 750],
                ['阴森代币', 0, 0, 0, 487.5],
                ['大宝箱', 0, 0, 0, 1.05],
                ['石榴石', 0, 0, 0, 7.5],
                ['太阳石', 0, 0, 0, 1],
                ['贯心之刺', 0, 0, 0, 0.75],
                ['烟爆灭影', 0, 0, 0, 0.75],
                ['疫病射击', 0, 0, 0, 0.75],
                ['杂技师彩带', 0, 0, 0, 0.04],
                ['魔术师织物', 0, 0, 0, 0.04],
                ['混沌锁链', 0, 0, 0, 0.02],
                ['诅咒之球', 0, 0, 0, 0.02],
                ['阴森宝箱钥匙', 0, 0, 0, 0.02],
                ['阴森斗篷', 0, 0, 0, 0.04],
                ['杂技师兜帽', 0, 0, 0, 0.002],
                ['魔术师帽', 0, 0, 0, 0.002],
                ['混沌连枷', 0, 0, 0, 0.0005],
                ['咒怨之弓', 0, 0, 0, 0.0005],
                ['期望利润', 0, 0, 0, 0]
            ]
        },
        '秘法要塞': {
            left: [
                ['钥匙原材料种类', '价格（扫单）', '价格（挂单）', '采用价格'],
                ['橙色钥匙碎片', 0, 0, 0],
                ['棕色钥匙碎片', 0, 0, 0],
                ['石头钥匙碎片', 0, 0, 0],
                ['燃烧钥匙碎片', 0, 0, 0],
                ['秘法宝箱钥匙（自制）', 0, 0, 0],
                ['秘法宝箱钥匙', 0, 0, 0],
                ['光辉布料', 0, 0, 0],
                ['丝绸', 0, 0, 0],
                ['秘法钥匙（自制）', 0, 0, 0],
                ['秘法钥匙', 0, 0, 0]
            ],
            right: [
                ['产物种类', '价格（挂单）', '价格（填单）', '采用价格', '箱期望数量'],
                ['秘法精华', 0, 0, 0, 750],
                ['秘法代币', 0, 0, 0, 487.5],
                ['大宝箱', 0, 0, 0, 1.2],
                ['紫水晶', 0, 0, 0, 7.5],
                ['太阳石', 0, 0, 0, 1.5],
                ['致残斩', 0, 0, 0, 0.75],
                ['贯穿射击', 0, 0, 0, 0.75],
                ['惩戒', 0, 0, 0, 0.75],
                ['法力喷泉', 0, 0, 0, 0.75],
                ['骑士之锭', 0, 0, 0, 0.04],
                ['主教卷轴', 0, 0, 0, 0.04],
                ['皇家织物', 0, 0, 0, 0.04],
                ['君王宝石', 0, 0, 0, 0.02],
                ['裂空宝石', 0, 0, 0, 0.02],
                ['秘法宝箱钥匙', 0, 0, 0, 0.02],
                ['秘法披风', 0, 0, 0, 0.04],
                ['骑士盾', 0, 0, 0, 0.002],
                ['主教法典', 0, 0, 0, 0.002],
                ['皇家水系袍服', 0, 0, 0, 0.0004],
                ['皇家水系袍裙', 0, 0, 0, 0.0004],
                ['皇家自然系袍服', 0, 0, 0, 0.0004],
                ['皇家自然系袍裙', 0, 0, 0, 0.0004],
                ['皇家火系袍服', 0, 0, 0, 0.0004],
                ['皇家火系袍裙', 0, 0, 0, 0.0004],
                ['狂怒长枪', 0, 0, 0, 0.0003],
                ['君王之剑', 0, 0, 0, 0.0003],
                ['裂空之弩', 0, 0, 0, 0.0003],
                ['期望利润', 0, 0, 0, 0]
            ]
        },
        '海盗基地': {
            left: [
                ['钥匙原材料种类', '价格（扫单）', '价格（挂单）', '采用价格'],
                ['白色钥匙碎片', 0, 0, 0],
                ['石头钥匙碎片', 0, 0, 0],
                ['黑暗钥匙碎片', 0, 0, 0],
                ['燃烧钥匙碎片', 0, 0, 0],
                ['海盗宝箱钥匙（自制）', 0, 0, 0],
                ['海盗宝箱钥匙', 0, 0, 0],
                ['神秘木板', 0, 0, 0],
                ['红杉木板', 0, 0, 0],
                ['海盗钥匙（自制）', 0, 0, 0],
                ['海盗钥匙', 0, 0, 0]
            ],
            right: [
                ['产物种类', '价格（挂单）', '价格（填单）', '采用价格', '箱期望数量'],
                ['海盗精华', 0, 0, 0, 750],
                ['海盗代币', 0, 0, 0, 487.5],
                ['大宝箱', 0, 0, 0, 1.35],
                ['月亮石', 0, 0, 0, 6.25],
                ['太阳石', 0, 0, 0, 1.75],
                ['盾击', 0, 0, 0, 0.75],
                ['碎裂冲击', 0, 0, 0, 0.75],
                ['生命吸取', 0, 0, 0, 0.75],
                ['神射胸针', 0, 0, 0, 0.03],
                ['掠夺者徽章', 0, 0, 0, 0.03],
                ['破损船锚', 0, 0, 0, 0.03],
                ['怒涛甲片', 0, 0, 0, 0.03],
                ['克拉肯皮革', 0, 0, 0, 0.03],
                ['克拉肯之牙', 0, 0, 0, 0.03],
                ['海盗宝箱钥匙', 0, 0, 0, 0.02],
                ['神射护腕', 0, 0, 0, 0.002],
                ['掠夺者头盔', 0, 0, 0, 0.002],
                ['锚定胸甲', 0, 0, 0, 0.0004],
                ['锚定腿甲', 0, 0, 0, 0.0004],
                ['怒涛胸甲', 0, 0, 0, 0.0004],
                ['怒涛腿甲', 0, 0, 0, 0.0004],
                ['克拉肯皮衣', 0, 0, 0, 0.0004],
                ['克拉肯皮裤', 0, 0, 0, 0.0004],
                ['涟漪三叉戟', 0, 0, 0, 0.0003],
                ['绽放三叉戟', 0, 0, 0, 0.0003],
                ['炽焰三叉戟', 0, 0, 0, 0.0003],
                ['期望利润', 0, 0, 0, 0]
            ]
        }
    };

    const itemNameMap = {
        "金币": "/items/coin",
        "任务代币": "/items/task_token",
        "奇幻代币": "/items/chimerical_token",
        "阴森代币": "/items/sinister_token",
        "秘法代币": "/items/enchanted_token",
        "海盗代币": "/items/pirate_token",
        "牛铃": "/items/cowbell",
        "牛铃袋 (10个)": "/items/bag_of_10_cowbells",
        "小紫牛的礼物": "/items/purples_gift",
        "小陨石舱": "/items/small_meteorite_cache",
        "中陨石舱": "/items/medium_meteorite_cache",
        "大陨石舱": "/items/large_meteorite_cache",
        "小工匠匣": "/items/small_artisans_crate",
        "中工匠匣": "/items/medium_artisans_crate",
        "大工匠匣": "/items/large_artisans_crate",
        "小宝箱": "/items/small_treasure_chest",
        "中宝箱": "/items/medium_treasure_chest",
        "大宝箱": "/items/large_treasure_chest",
        "奇幻宝箱": "/items/chimerical_chest",
        "奇幻精炼宝箱": "/items/chimerical_refinement_chest",
        "阴森宝箱": "/items/sinister_chest",
        "阴森精炼宝箱": "/items/sinister_refinement_chest",
        "秘法宝箱": "/items/enchanted_chest",
        "秘法精炼宝箱": "/items/enchanted_refinement_chest",
        "海盗宝箱": "/items/pirate_chest",
        "海盗精炼宝箱": "/items/pirate_refinement_chest",
        "蓝色钥匙碎片": "/items/blue_key_fragment",
        "绿色钥匙碎片": "/items/green_key_fragment",
        "紫色钥匙碎片": "/items/purple_key_fragment",
        "白色钥匙碎片": "/items/white_key_fragment",
        "橙色钥匙碎片": "/items/orange_key_fragment",
        "棕色钥匙碎片": "/items/brown_key_fragment",
        "石头钥匙碎片": "/items/stone_key_fragment",
        "黑暗钥匙碎片": "/items/dark_key_fragment",
        "燃烧钥匙碎片": "/items/burning_key_fragment",
        "奇幻钥匙": "/items/chimerical_entry_key",
        "奇幻宝箱钥匙": "/items/chimerical_chest_key",
        "阴森钥匙": "/items/sinister_entry_key",
        "阴森宝箱钥匙": "/items/sinister_chest_key",
        "秘法钥匙": "/items/enchanted_entry_key",
        "秘法宝箱钥匙": "/items/enchanted_chest_key",
        "海盗钥匙": "/items/pirate_entry_key",
        "海盗宝箱钥匙": "/items/pirate_chest_key",
        "甜甜圈": "/items/donut",
        "蓝莓甜甜圈": "/items/blueberry_donut",
        "黑莓甜甜圈": "/items/blackberry_donut",
        "草莓甜甜圈": "/items/strawberry_donut",
        "哞莓甜甜圈": "/items/mooberry_donut",
        "火星莓甜甜圈": "/items/marsberry_donut",
        "太空莓甜甜圈": "/items/spaceberry_donut",
        "纸杯蛋糕": "/items/cupcake",
        "蓝莓蛋糕": "/items/blueberry_cake",
        "黑莓蛋糕": "/items/blackberry_cake",
        "草莓蛋糕": "/items/strawberry_cake",
        "哞莓蛋糕": "/items/mooberry_cake",
        "火星莓蛋糕": "/items/marsberry_cake",
        "太空莓蛋糕": "/items/spaceberry_cake",
        "软糖": "/items/gummy",
        "苹果软糖": "/items/apple_gummy",
        "橙子软糖": "/items/orange_gummy",
        "李子软糖": "/items/plum_gummy",
        "桃子软糖": "/items/peach_gummy",
        "火龙果软糖": "/items/dragon_fruit_gummy",
        "杨桃软糖": "/items/star_fruit_gummy",
        "酸奶": "/items/yogurt",
        "苹果酸奶": "/items/apple_yogurt",
        "橙子酸奶": "/items/orange_yogurt",
        "李子酸奶": "/items/plum_yogurt",
        "桃子酸奶": "/items/peach_yogurt",
        "火龙果酸奶": "/items/dragon_fruit_yogurt",
        "杨桃酸奶": "/items/star_fruit_yogurt",
        "挤奶茶": "/items/milking_tea",
        "采摘茶": "/items/foraging_tea",
        "伐木茶": "/items/woodcutting_tea",
        "烹饪茶": "/items/cooking_tea",
        "冲泡茶": "/items/brewing_tea",
        "炼金茶": "/items/alchemy_tea",
        "强化茶": "/items/enhancing_tea",
        "奶酪锻造茶": "/items/cheesesmithing_tea",
        "制作茶": "/items/crafting_tea",
        "缝纫茶": "/items/tailoring_tea",
        "超级挤奶茶": "/items/super_milking_tea",
        "超级采摘茶": "/items/super_foraging_tea",
        "超级伐木茶": "/items/super_woodcutting_tea",
        "超级烹饪茶": "/items/super_cooking_tea",
        "超级冲泡茶": "/items/super_brewing_tea",
        "超级炼金茶": "/items/super_alchemy_tea",
        "超级强化茶": "/items/super_enhancing_tea",
        "超级奶酪锻造茶": "/items/super_cheesesmithing_tea",
        "超级制作茶": "/items/super_crafting_tea",
        "超级缝纫茶": "/items/super_tailoring_tea",
        "究极挤奶茶": "/items/ultra_milking_tea",
        "究极采摘茶": "/items/ultra_foraging_tea",
        "究极伐木茶": "/items/ultra_woodcutting_tea",
        "究极烹饪茶": "/items/ultra_cooking_tea",
        "究极冲泡茶": "/items/ultra_brewing_tea",
        "究极炼金茶": "/items/ultra_alchemy_tea",
        "究极强化茶": "/items/ultra_enhancing_tea",
        "究极奶酪锻造茶": "/items/ultra_cheesesmithing_tea",
        "究极制作茶": "/items/ultra_crafting_tea",
        "究极缝纫茶": "/items/ultra_tailoring_tea",
        "采集茶": "/items/gathering_tea",
        "美食茶": "/items/gourmet_tea",
        "经验茶": "/items/wisdom_tea",
        "加工茶": "/items/processing_tea",
        "效率茶": "/items/efficiency_tea",
        "工匠茶": "/items/artisan_tea",
        "催化茶": "/items/catalytic_tea",
        "福气茶": "/items/blessed_tea",
        "耐力咖啡": "/items/stamina_coffee",
        "智力咖啡": "/items/intelligence_coffee",
        "防御咖啡": "/items/defense_coffee",
        "攻击咖啡": "/items/attack_coffee",
        "近战咖啡": "/items/melee_coffee",
        "远程咖啡": "/items/ranged_coffee",
        "魔法咖啡": "/items/magic_coffee",
        "超级耐力咖啡": "/items/super_stamina_coffee",
        "超级智力咖啡": "/items/super_intelligence_coffee",
        "超级防御咖啡": "/items/super_defense_coffee",
        "超级攻击咖啡": "/items/super_attack_coffee",
        "超级近战咖啡": "/items/super_melee_coffee",
        "超级远程咖啡": "/items/super_ranged_coffee",
        "超级魔法咖啡": "/items/super_magic_coffee",
        "究极耐力咖啡": "/items/ultra_stamina_coffee",
        "究极智力咖啡": "/items/ultra_intelligence_coffee",
        "究极防御咖啡": "/items/ultra_defense_coffee",
        "究极攻击咖啡": "/items/ultra_attack_coffee",
        "究极近战咖啡": "/items/ultra_melee_coffee",
        "究极远程咖啡": "/items/ultra_ranged_coffee",
        "究极魔法咖啡": "/items/ultra_magic_coffee",
        "经验咖啡": "/items/wisdom_coffee",
        "幸运咖啡": "/items/lucky_coffee",
        "迅捷咖啡": "/items/swiftness_coffee",
        "吟唱咖啡": "/items/channeling_coffee",
        "暴击咖啡": "/items/critical_coffee",
        "破胆之刺": "/items/poke",
        "透骨之刺": "/items/impale",
        "破甲之刺": "/items/puncture",
        "贯心之刺": "/items/penetrating_strike",
        "爪影斩": "/items/scratch",
        "分裂斩": "/items/cleave",
        "血刃斩": "/items/maim",
        "致残斩": "/items/crippling_slash",
        "重碾": "/items/smack",
        "重扫": "/items/sweep",
        "重锤": "/items/stunning_blow",
        "碎裂冲击": "/items/fracturing_impact",
        "盾击": "/items/shield_bash",
        "快速射击": "/items/quick_shot",
        "流水箭": "/items/aqua_arrow",
        "烈焰箭": "/items/flame_arrow",
        "箭雨": "/items/rain_of_arrows",
        "沉默之箭": "/items/silencing_shot",
        "稳定射击": "/items/steady_shot",
        "疫病射击": "/items/pestilent_shot",
        "贯穿射击": "/items/penetrating_shot",
        "流水冲击": "/items/water_strike",
        "冰枪术": "/items/ice_spear",
        "冰霜爆裂": "/items/frost_surge",
        "法力喷泉": "/items/mana_spring",
        "缠绕": "/items/entangle",
        "剧毒粉尘": "/items/toxic_pollen",
        "自然菌幕": "/items/natures_veil",
        "生命吸取": "/items/life_drain",
        "火球": "/items/fireball",
        "熔岩爆裂": "/items/flame_blast",
        "火焰风暴": "/items/firestorm",
        "烟爆灭影": "/items/smoke_burst",
        "初级自愈术": "/items/minor_heal",
        "自愈术": "/items/heal",
        "快速治疗术": "/items/quick_aid",
        "群体治疗术": "/items/rejuvenate",
        "嘲讽": "/items/taunt",
        "挑衅": "/items/provoke",
        "坚韧": "/items/toughness",
        "闪避": "/items/elusiveness",
        "精确": "/items/precision",
        "狂暴": "/items/berserk",
        "元素增幅": "/items/elemental_affinity",
        "狂速": "/items/frenzy",
        "尖刺防护": "/items/spike_shell",
        "惩戒": "/items/retribution",
        "吸血": "/items/vampirism",
        "复活": "/items/revive",
        "疯狂": "/items/insanity",
        "无敌": "/items/invincible",
        "速度光环": "/items/speed_aura",
        "守护光环": "/items/guardian_aura",
        "物理光环": "/items/fierce_aura",
        "暴击光环": "/items/critical_aura",
        "元素光环": "/items/mystic_aura",
        "哥布林长剑": "/items/gobo_stabber",
        "哥布林关刀": "/items/gobo_slasher",
        "哥布林狼牙棒": "/items/gobo_smasher",
        "尖刺重盾": "/items/spiked_bulwark",
        "狼人关刀": "/items/werewolf_slasher",
        "狮鹫重盾": "/items/griffin_bulwark",
        "狮鹫重盾（精）": "/items/griffin_bulwark_refined",
        "哥布林弹弓": "/items/gobo_shooter",
        "吸血弓": "/items/vampiric_bow",
        "咒怨之弓": "/items/cursed_bow",
        "咒怨之弓（精）": "/items/cursed_bow_refined",
        "哥布林火棍": "/items/gobo_boomstick",
        "奶酪重盾": "/items/cheese_bulwark",
        "翠绿重盾": "/items/verdant_bulwark",
        "蔚蓝重盾": "/items/azure_bulwark",
        "深紫重盾": "/items/burble_bulwark",
        "绛红重盾": "/items/crimson_bulwark",
        "彩虹重盾": "/items/rainbow_bulwark",
        "神圣重盾": "/items/holy_bulwark",
        "木弓": "/items/wooden_bow",
        "桦木弓": "/items/birch_bow",
        "雪松弓": "/items/cedar_bow",
        "紫心弓": "/items/purpleheart_bow",
        "银杏弓": "/items/ginkgo_bow",
        "红杉弓": "/items/redwood_bow",
        "神秘弓": "/items/arcane_bow",
        "石钟长枪": "/items/stalactite_spear",
        "花岗岩大棒": "/items/granite_bludgeon",
        "狂怒长枪": "/items/furious_spear",
        "狂怒长枪（精）": "/items/furious_spear_refined",
        "君王之剑": "/items/regal_sword",
        "君王之剑（精）": "/items/regal_sword_refined",
        "混沌连枷": "/items/chaotic_flail",
        "混沌连枷（精）": "/items/chaotic_flail_refined",
        "灵魂猎手弩": "/items/soul_hunter_crossbow",
        "裂空之弩": "/items/sundering_crossbow",
        "裂空之弩（精）": "/items/sundering_crossbow_refined",
        "冰霜法杖": "/items/frost_staff",
        "炼狱法杖": "/items/infernal_battlestaff",
        "鹿角兔之杖": "/items/jackalope_staff",
        "涟漪三叉戟": "/items/rippling_trident",
        "涟漪三叉戟（精）": "/items/rippling_trident_refined",
        "绽放三叉戟": "/items/blooming_trident",
        "绽放三叉戟（精）": "/items/blooming_trident_refined",
        "炽焰三叉戟": "/items/blazing_trident",
        "炽焰三叉戟（精）": "/items/blazing_trident_refined",
        "奶酪剑": "/items/cheese_sword",
        "翠绿剑": "/items/verdant_sword",
        "蔚蓝剑": "/items/azure_sword",
        "深紫剑": "/items/burble_sword",
        "绛红剑": "/items/crimson_sword",
        "彩虹剑": "/items/rainbow_sword",
        "神圣剑": "/items/holy_sword",
        "奶酪长枪": "/items/cheese_spear",
        "翠绿长枪": "/items/verdant_spear",
        "蔚蓝长枪": "/items/azure_spear",
        "深紫长枪": "/items/burble_spear",
        "绛红长枪": "/items/crimson_spear",
        "彩虹长枪": "/items/rainbow_spear",
        "神圣长枪": "/items/holy_spear",
        "奶酪钉头锤": "/items/cheese_mace",
        "翠绿钉头锤": "/items/verdant_mace",
        "蔚蓝钉头锤": "/items/azure_mace",
        "深紫钉头锤": "/items/burble_mace",
        "绛红钉头锤": "/items/crimson_mace",
        "彩虹钉头锤": "/items/rainbow_mace",
        "神圣钉头锤": "/items/holy_mace",
        "木弩": "/items/wooden_crossbow",
        "桦木弩": "/items/birch_crossbow",
        "雪松弩": "/items/cedar_crossbow",
        "紫心弩": "/items/purpleheart_crossbow",
        "银杏弩": "/items/ginkgo_crossbow",
        "红杉弩": "/items/redwood_crossbow",
        "神秘弩": "/items/arcane_crossbow",
        "木制水法杖": "/items/wooden_water_staff",
        "桦木水法杖": "/items/birch_water_staff",
        "雪松水法杖": "/items/cedar_water_staff",
        "紫心水法杖": "/items/purpleheart_water_staff",
        "银杏水法杖": "/items/ginkgo_water_staff",
        "红杉水法杖": "/items/redwood_water_staff",
        "神秘水法杖": "/items/arcane_water_staff",
        "木制自然法杖": "/items/wooden_nature_staff",
        "桦木自然法杖": "/items/birch_nature_staff",
        "雪松自然法杖": "/items/cedar_nature_staff",
        "紫心自然法杖": "/items/purpleheart_nature_staff",
        "银杏自然法杖": "/items/ginkgo_nature_staff",
        "红杉自然法杖": "/items/redwood_nature_staff",
        "神秘自然法杖": "/items/arcane_nature_staff",
        "木制火法杖": "/items/wooden_fire_staff",
        "桦木火法杖": "/items/birch_fire_staff",
        "雪松火法杖": "/items/cedar_fire_staff",
        "紫心火法杖": "/items/purpleheart_fire_staff",
        "银杏火法杖": "/items/ginkgo_fire_staff",
        "红杉火法杖": "/items/redwood_fire_staff",
        "神秘火法杖": "/items/arcane_fire_staff",
        "掌上监工": "/items/eye_watch",
        "蛇牙短剑": "/items/snake_fang_dirk",
        "视觉盾": "/items/vision_shield",
        "哥布林防御者": "/items/gobo_defender",
        "吸血鬼短剑": "/items/vampire_fang_dirk",
        "骑士盾": "/items/knights_aegis",
        "骑士盾（精）": "/items/knights_aegis_refined",
        "树人盾": "/items/treant_shield",
        "蝎狮盾": "/items/manticore_shield",
        "治疗之书": "/items/tome_of_healing",
        "元素之书": "/items/tome_of_the_elements",
        "警戒遗物": "/items/watchful_relic",
        "主教法典": "/items/bishops_codex",
        "主教法典（精）": "/items/bishops_codex_refined",
        "奶酪圆盾": "/items/cheese_buckler",
        "翠绿圆盾": "/items/verdant_buckler",
        "蔚蓝圆盾": "/items/azure_buckler",
        "深紫圆盾": "/items/burble_buckler",
        "绛红圆盾": "/items/crimson_buckler",
        "彩虹圆盾": "/items/rainbow_buckler",
        "神圣圆盾": "/items/holy_buckler",
        "木盾": "/items/wooden_shield",
        "桦木盾": "/items/birch_shield",
        "雪松盾": "/items/cedar_shield",
        "紫心盾": "/items/purpleheart_shield",
        "银杏盾": "/items/ginkgo_shield",
        "红杉盾": "/items/redwood_shield",
        "神秘盾": "/items/arcane_shield",
        "阴森斗篷": "/items/sinister_cape",
        "阴森斗篷（精）": "/items/sinister_cape_refined",
        "奇幻箭袋": "/items/chimerical_quiver",
        "奇幻箭袋（精）": "/items/chimerical_quiver_refined",
        "秘法披风": "/items/enchanted_cloak",
        "秘法披风（精）": "/items/enchanted_cloak_refined",
        "红色厨师帽": "/items/red_culinary_hat",
        "蜗牛壳头盔": "/items/snail_shell_helmet",
        "视觉头盔": "/items/vision_helmet",
        "蓬松红帽子": "/items/fluffy_red_hat",
        "掠夺者头盔": "/items/corsair_helmet",
        "掠夺者头盔（精）": "/items/corsair_helmet_refined",
        "杂技师兜帽": "/items/acrobatic_hood",
        "杂技师兜帽（精）": "/items/acrobatic_hood_refined",
        "魔术师帽": "/items/magicians_hat",
        "魔术师帽（精）": "/items/magicians_hat_refined",
        "奶酪头盔": "/items/cheese_helmet",
        "翠绿头盔": "/items/verdant_helmet",
        "蔚蓝头盔": "/items/azure_helmet",
        "深紫头盔": "/items/burble_helmet",
        "绛红头盔": "/items/crimson_helmet",
        "彩虹头盔": "/items/rainbow_helmet",
        "神圣头盔": "/items/holy_helmet",
        "粗糙兜帽": "/items/rough_hood",
        "爬行动物兜帽": "/items/reptile_hood",
        "哥布林兜帽": "/items/gobo_hood",
        "野兽兜帽": "/items/beast_hood",
        "暗影兜帽": "/items/umbral_hood",
        "棉帽": "/items/cotton_hat",
        "亚麻帽": "/items/linen_hat",
        "竹帽": "/items/bamboo_hat",
        "丝帽": "/items/silk_hat",
        "光辉帽": "/items/radiant_hat",
        "挤奶工上衣": "/items/dairyhands_top",
        "采摘者上衣": "/items/foragers_top",
        "伐木工上衣": "/items/lumberjacks_top",
        "奶酪师上衣": "/items/cheesemakers_top",
        "工匠上衣": "/items/crafters_top",
        "裁缝上衣": "/items/tailors_top",
        "厨师上衣": "/items/chefs_top",
        "饮品师上衣": "/items/brewers_top",
        "炼金师上衣": "/items/alchemists_top",
        "强化师上衣": "/items/enhancers_top",
        "鳄鱼马甲": "/items/gator_vest",
        "龟壳胸甲": "/items/turtle_shell_body",
        "巨像胸甲": "/items/colossus_plate_body",
        "恶魔胸甲": "/items/demonic_plate_body",
        "锚定胸甲": "/items/anchorbound_plate_body",
        "锚定胸甲（精）": "/items/anchorbound_plate_body_refined",
        "怒涛胸甲": "/items/maelstrom_plate_body",
        "怒涛胸甲（精）": "/items/maelstrom_plate_body_refined",
        "海洋皮衣": "/items/marine_tunic",
        "亡灵皮衣": "/items/revenant_tunic",
        "狮鹫皮衣": "/items/griffin_tunic",
        "克拉肯皮衣": "/items/kraken_tunic",
        "克拉肯皮衣（精）": "/items/kraken_tunic_refined",
        "冰霜袍服": "/items/icy_robe_top",
        "烈焰袍服": "/items/flaming_robe_top",
        "月神袍服": "/items/luna_robe_top",
        "皇家水系袍服": "/items/royal_water_robe_top",
        "皇家水系袍服（精）": "/items/royal_water_robe_top_refined",
        "皇家自然系袍服": "/items/royal_nature_robe_top",
        "皇家自然系袍服（精）": "/items/royal_nature_robe_top_refined",
        "皇家火系袍服": "/items/royal_fire_robe_top",
        "皇家火系袍服（精）": "/items/royal_fire_robe_top_refined",
        "奶酪胸甲": "/items/cheese_plate_body",
        "翠绿胸甲": "/items/verdant_plate_body",
        "蔚蓝胸甲": "/items/azure_plate_body",
        "深紫胸甲": "/items/burble_plate_body",
        "绛红胸甲": "/items/crimson_plate_body",
        "彩虹胸甲": "/items/rainbow_plate_body",
        "神圣胸甲": "/items/holy_plate_body",
        "粗糙皮衣": "/items/rough_tunic",
        "爬行动物皮衣": "/items/reptile_tunic",
        "哥布林皮衣": "/items/gobo_tunic",
        "野兽皮衣": "/items/beast_tunic",
        "暗影皮衣": "/items/umbral_tunic",
        "棉袍服": "/items/cotton_robe_top",
        "亚麻袍服": "/items/linen_robe_top",
        "竹袍服": "/items/bamboo_robe_top",
        "丝绸袍服": "/items/silk_robe_top",
        "光辉袍服": "/items/radiant_robe_top",
        "挤奶工下装": "/items/dairyhands_bottoms",
        "采摘者下装": "/items/foragers_bottoms",
        "伐木工下装": "/items/lumberjacks_bottoms",
        "奶酪师下装": "/items/cheesemakers_bottoms",
        "工匠下装": "/items/crafters_bottoms",
        "裁缝下装": "/items/tailors_bottoms",
        "厨师下装": "/items/chefs_bottoms",
        "饮品师下装": "/items/brewers_bottoms",
        "炼金师下装": "/items/alchemists_bottoms",
        "强化师下装": "/items/enhancers_bottoms",
        "龟壳腿甲": "/items/turtle_shell_legs",
        "巨像腿甲": "/items/colossus_plate_legs",
        "恶魔腿甲": "/items/demonic_plate_legs",
        "锚定腿甲": "/items/anchorbound_plate_legs",
        "锚定腿甲（精）": "/items/anchorbound_plate_legs_refined",
        "怒涛腿甲": "/items/maelstrom_plate_legs",
        "怒涛腿甲（精）": "/items/maelstrom_plate_legs_refined",
        "航海皮裤": "/items/marine_chaps",
        "亡灵皮裤": "/items/revenant_chaps",
        "狮鹫皮裤": "/items/griffin_chaps",
        "克拉肯皮裤": "/items/kraken_chaps",
        "克拉肯皮裤（精）": "/items/kraken_chaps_refined",
        "冰霜袍裙": "/items/icy_robe_bottoms",
        "烈焰袍裙": "/items/flaming_robe_bottoms",
        "月神袍裙": "/items/luna_robe_bottoms",
        "皇家水系袍裙": "/items/royal_water_robe_bottoms",
        "皇家水系袍裙（精）": "/items/royal_water_robe_bottoms_refined",
        "皇家自然系袍裙": "/items/royal_nature_robe_bottoms",
        "皇家自然系袍裙（精）": "/items/royal_nature_robe_bottoms_refined",
        "皇家火系袍裙": "/items/royal_fire_robe_bottoms",
        "皇家火系袍裙（精）": "/items/royal_fire_robe_bottoms_refined",
        "奶酪腿甲": "/items/cheese_plate_legs",
        "翠绿腿甲": "/items/verdant_plate_legs",
        "蔚蓝腿甲": "/items/azure_plate_legs",
        "深紫腿甲": "/items/burble_plate_legs",
        "绛红腿甲": "/items/crimson_plate_legs",
        "彩虹腿甲": "/items/rainbow_plate_legs",
        "神圣腿甲": "/items/holy_plate_legs",
        "粗糙皮裤": "/items/rough_chaps",
        "爬行动物皮裤": "/items/reptile_chaps",
        "哥布林皮裤": "/items/gobo_chaps",
        "野兽皮裤": "/items/beast_chaps",
        "暗影皮裤": "/items/umbral_chaps",
        "棉袍裙": "/items/cotton_robe_bottoms",
        "亚麻袍裙": "/items/linen_robe_bottoms",
        "竹袍裙": "/items/bamboo_robe_bottoms",
        "丝绸袍裙": "/items/silk_robe_bottoms",
        "光辉袍裙": "/items/radiant_robe_bottoms",
        "附魔手套": "/items/enchanted_gloves",
        "蟹钳手套": "/items/pincer_gloves",
        "熊猫手套": "/items/panda_gloves",
        "磁力手套": "/items/magnetic_gloves",
        "渡渡驼护手": "/items/dodocamel_gauntlets",
        "渡渡驼护手（精）": "/items/dodocamel_gauntlets_refined",
        "瞄准护腕": "/items/sighted_bracers",
        "神射护腕": "/items/marksman_bracers",
        "神射护腕（精）": "/items/marksman_bracers_refined",
        "时空手套": "/items/chrono_gloves",
        "奶酪护手": "/items/cheese_gauntlets",
        "翠绿护手": "/items/verdant_gauntlets",
        "蔚蓝护手": "/items/azure_gauntlets",
        "深紫护手": "/items/burble_gauntlets",
        "绛红护手": "/items/crimson_gauntlets",
        "彩虹护手": "/items/rainbow_gauntlets",
        "神圣护手": "/items/holy_gauntlets",
        "粗糙护腕": "/items/rough_bracers",
        "爬行动物护腕": "/items/reptile_bracers",
        "哥布林护腕": "/items/gobo_bracers",
        "野兽护腕": "/items/beast_bracers",
        "暗影护腕": "/items/umbral_bracers",
        "棉手套": "/items/cotton_gloves",
        "亚麻手套": "/items/linen_gloves",
        "竹手套": "/items/bamboo_gloves",
        "丝手套": "/items/silk_gloves",
        "光辉手套": "/items/radiant_gloves",
        "收藏家靴": "/items/collectors_boots",
        "鲸头鹳鞋": "/items/shoebill_shoes",
        "黑熊鞋": "/items/black_bear_shoes",
        "棕熊鞋": "/items/grizzly_bear_shoes",
        "北极熊鞋": "/items/polar_bear_shoes",
        "半人马靴": "/items/centaur_boots",
        "巫师靴": "/items/sorcerer_boots",
        "奶酪靴": "/items/cheese_boots",
        "翠绿靴": "/items/verdant_boots",
        "蔚蓝靴": "/items/azure_boots",
        "深紫靴": "/items/burble_boots",
        "绛红靴": "/items/crimson_boots",
        "彩虹靴": "/items/rainbow_boots",
        "神圣靴": "/items/holy_boots",
        "粗糙靴": "/items/rough_boots",
        "爬行动物靴": "/items/reptile_boots",
        "哥布林靴": "/items/gobo_boots",
        "野兽靴": "/items/beast_boots",
        "暗影靴": "/items/umbral_boots",
        "棉靴": "/items/cotton_boots",
        "亚麻靴": "/items/linen_boots",
        "竹靴": "/items/bamboo_boots",
        "丝靴": "/items/silk_boots",
        "光辉靴": "/items/radiant_boots",
        "小袋子": "/items/small_pouch",
        "中袋子": "/items/medium_pouch",
        "大袋子": "/items/large_pouch",
        "巨大袋子": "/items/giant_pouch",
        "贪食之袋": "/items/gluttonous_pouch",
        "暴饮之囊": "/items/guzzling_pouch",
        "效率项链": "/items/necklace_of_efficiency",
        "战士项链": "/items/fighter_necklace",
        "射手项链": "/items/ranger_necklace",
        "巫师项链": "/items/wizard_necklace",
        "经验项链": "/items/necklace_of_wisdom",
        "速度项链": "/items/necklace_of_speed",
        "贤者项链": "/items/philosophers_necklace",
        "采集耳环": "/items/earrings_of_gathering",
        "精华发现耳环": "/items/earrings_of_essence_find",
        "护甲耳环": "/items/earrings_of_armor",
        "恢复耳环": "/items/earrings_of_regeneration",
        "抗性耳环": "/items/earrings_of_resistance",
        "稀有发现耳环": "/items/earrings_of_rare_find",
        "暴击耳环": "/items/earrings_of_critical_strike",
        "贤者耳环": "/items/philosophers_earrings",
        "采集戒指": "/items/ring_of_gathering",
        "精华发现戒指": "/items/ring_of_essence_find",
        "护甲戒指": "/items/ring_of_armor",
        "恢复戒指": "/items/ring_of_regeneration",
        "抗性戒指": "/items/ring_of_resistance",
        "稀有发现戒指": "/items/ring_of_rare_find",
        "暴击戒指": "/items/ring_of_critical_strike",
        "贤者戒指": "/items/philosophers_ring",
        "实习挤奶护符": "/items/trainee_milking_charm",
        "基础挤奶护符": "/items/basic_milking_charm",
        "高级挤奶护符": "/items/advanced_milking_charm",
        "专家挤奶护符": "/items/expert_milking_charm",
        "大师挤奶护符": "/items/master_milking_charm",
        "宗师挤奶护符": "/items/grandmaster_milking_charm",
        "实习采摘护符": "/items/trainee_foraging_charm",
        "基础采摘护符": "/items/basic_foraging_charm",
        "高级采摘护符": "/items/advanced_foraging_charm",
        "专家采摘护符": "/items/expert_foraging_charm",
        "大师采摘护符": "/items/master_foraging_charm",
        "宗师采摘护符": "/items/grandmaster_foraging_charm",
        "实习伐木护符": "/items/trainee_woodcutting_charm",
        "基础伐木护符": "/items/basic_woodcutting_charm",
        "高级伐木护符": "/items/advanced_woodcutting_charm",
        "专家伐木护符": "/items/expert_woodcutting_charm",
        "大师伐木护符": "/items/master_woodcutting_charm",
        "宗师伐木护符": "/items/grandmaster_woodcutting_charm",
        "实习奶酪锻造护符": "/items/trainee_cheesesmithing_charm",
        "基础奶酪锻造护符": "/items/basic_cheesesmithing_charm",
        "高级奶酪锻造护符": "/items/advanced_cheesesmithing_charm",
        "专家奶酪锻造护符": "/items/expert_cheesesmithing_charm",
        "大师奶酪锻造护符": "/items/master_cheesesmithing_charm",
        "宗师奶酪锻造护符": "/items/grandmaster_cheesesmithing_charm",
        "实习制作护符": "/items/trainee_crafting_charm",
        "基础制作护符": "/items/basic_crafting_charm",
        "高级制作护符": "/items/advanced_crafting_charm",
        "专家制作护符": "/items/expert_crafting_charm",
        "大师制作护符": "/items/master_crafting_charm",
        "宗师制作护符": "/items/grandmaster_crafting_charm",
        "实习缝纫护符": "/items/trainee_tailoring_charm",
        "基础缝纫护符": "/items/basic_tailoring_charm",
        "高级缝纫护符": "/items/advanced_tailoring_charm",
        "专家缝纫护符": "/items/expert_tailoring_charm",
        "大师缝纫护符": "/items/master_tailoring_charm",
        "宗师缝纫护符": "/items/grandmaster_tailoring_charm",
        "实习烹饪护符": "/items/trainee_cooking_charm",
        "基础烹饪护符": "/items/basic_cooking_charm",
        "高级烹饪护符": "/items/advanced_cooking_charm",
        "专家烹饪护符": "/items/expert_cooking_charm",
        "大师烹饪护符": "/items/master_cooking_charm",
        "宗师烹饪护符": "/items/grandmaster_cooking_charm",
        "实习冲泡护符": "/items/trainee_brewing_charm",
        "基础冲泡护符": "/items/basic_brewing_charm",
        "高级冲泡护符": "/items/advanced_brewing_charm",
        "专家冲泡护符": "/items/expert_brewing_charm",
        "大师冲泡护符": "/items/master_brewing_charm",
        "宗师冲泡护符": "/items/grandmaster_brewing_charm",
        "实习炼金护符": "/items/trainee_alchemy_charm",
        "基础炼金护符": "/items/basic_alchemy_charm",
        "高级炼金护符": "/items/advanced_alchemy_charm",
        "专家炼金护符": "/items/expert_alchemy_charm",
        "大师炼金护符": "/items/master_alchemy_charm",
        "宗师炼金护符": "/items/grandmaster_alchemy_charm",
        "实习强化护符": "/items/trainee_enhancing_charm",
        "基础强化护符": "/items/basic_enhancing_charm",
        "高级强化护符": "/items/advanced_enhancing_charm",
        "专家强化护符": "/items/expert_enhancing_charm",
        "大师强化护符": "/items/master_enhancing_charm",
        "宗师强化护符": "/items/grandmaster_enhancing_charm",
        "实习耐力护符": "/items/trainee_stamina_charm",
        "基础耐力护符": "/items/basic_stamina_charm",
        "高级耐力护符": "/items/advanced_stamina_charm",
        "专家耐力护符": "/items/expert_stamina_charm",
        "大师耐力护符": "/items/master_stamina_charm",
        "宗师耐力护符": "/items/grandmaster_stamina_charm",
        "实习智力护符": "/items/trainee_intelligence_charm",
        "基础智力护符": "/items/basic_intelligence_charm",
        "高级智力护符": "/items/advanced_intelligence_charm",
        "专家智力护符": "/items/expert_intelligence_charm",
        "大师智力护符": "/items/master_intelligence_charm",
        "宗师智力护符": "/items/grandmaster_intelligence_charm",
        "实习攻击护符": "/items/trainee_attack_charm",
        "基础攻击护符": "/items/basic_attack_charm",
        "高级攻击护符": "/items/advanced_attack_charm",
        "专家攻击护符": "/items/expert_attack_charm",
        "大师攻击护符": "/items/master_attack_charm",
        "宗师攻击护符": "/items/grandmaster_attack_charm",
        "实习防御护符": "/items/trainee_defense_charm",
        "基础防御护符": "/items/basic_defense_charm",
        "高级防御护符": "/items/advanced_defense_charm",
        "专家防御护符": "/items/expert_defense_charm",
        "大师防御护符": "/items/master_defense_charm",
        "宗师防御护符": "/items/grandmaster_defense_charm",
        "实习近战护符": "/items/trainee_melee_charm",
        "基础近战护符": "/items/basic_melee_charm",
        "高级近战护符": "/items/advanced_melee_charm",
        "专家近战护符": "/items/expert_melee_charm",
        "大师近战护符": "/items/master_melee_charm",
        "宗师近战护符": "/items/grandmaster_melee_charm",
        "实习远程护符": "/items/trainee_ranged_charm",
        "基础远程护符": "/items/basic_ranged_charm",
        "高级远程护符": "/items/advanced_ranged_charm",
        "专家远程护符": "/items/expert_ranged_charm",
        "大师远程护符": "/items/master_ranged_charm",
        "宗师远程护符": "/items/grandmaster_ranged_charm",
        "实习魔法护符": "/items/trainee_magic_charm",
        "基础魔法护符": "/items/basic_magic_charm",
        "高级魔法护符": "/items/advanced_magic_charm",
        "专家魔法护符": "/items/expert_magic_charm",
        "大师魔法护符": "/items/master_magic_charm",
        "宗师魔法护符": "/items/grandmaster_magic_charm",
        "基础任务徽章": "/items/basic_task_badge",
        "高级任务徽章": "/items/advanced_task_badge",
        "专家任务徽章": "/items/expert_task_badge",
        "星空刷子": "/items/celestial_brush",
        "奶酪刷子": "/items/cheese_brush",
        "翠绿刷子": "/items/verdant_brush",
        "蔚蓝刷子": "/items/azure_brush",
        "深紫刷子": "/items/burble_brush",
        "绛红刷子": "/items/crimson_brush",
        "彩虹刷子": "/items/rainbow_brush",
        "神圣刷子": "/items/holy_brush",
        "星空剪刀": "/items/celestial_shears",
        "奶酪剪刀": "/items/cheese_shears",
        "翠绿剪刀": "/items/verdant_shears",
        "蔚蓝剪刀": "/items/azure_shears",
        "深紫剪刀": "/items/burble_shears",
        "绛红剪刀": "/items/crimson_shears",
        "彩虹剪刀": "/items/rainbow_shears",
        "神圣剪刀": "/items/holy_shears",
        "星空斧头": "/items/celestial_hatchet",
        "奶酪斧头": "/items/cheese_hatchet",
        "翠绿斧头": "/items/verdant_hatchet",
        "蔚蓝斧头": "/items/azure_hatchet",
        "深紫斧头": "/items/burble_hatchet",
        "绛红斧头": "/items/crimson_hatchet",
        "彩虹斧头": "/items/rainbow_hatchet",
        "神圣斧头": "/items/holy_hatchet",
        "星空锤子": "/items/celestial_hammer",
        "奶酪锤子": "/items/cheese_hammer",
        "翠绿锤子": "/items/verdant_hammer",
        "蔚蓝锤子": "/items/azure_hammer",
        "深紫锤子": "/items/burble_hammer",
        "绛红锤子": "/items/crimson_hammer",
        "彩虹锤子": "/items/rainbow_hammer",
        "神圣锤子": "/items/holy_hammer",
        "星空凿子": "/items/celestial_chisel",
        "奶酪凿子": "/items/cheese_chisel",
        "翠绿凿子": "/items/verdant_chisel",
        "蔚蓝凿子": "/items/azure_chisel",
        "深紫凿子": "/items/burble_chisel",
        "绛红凿子": "/items/crimson_chisel",
        "彩虹凿子": "/items/rainbow_chisel",
        "神圣凿子": "/items/holy_chisel",
        "星空针": "/items/celestial_needle",
        "奶酪针": "/items/cheese_needle",
        "翠绿针": "/items/verdant_needle",
        "蔚蓝针": "/items/azure_needle",
        "深紫针": "/items/burble_needle",
        "绛红针": "/items/crimson_needle",
        "彩虹针": "/items/rainbow_needle",
        "神圣针": "/items/holy_needle",
        "星空锅铲": "/items/celestial_spatula",
        "奶酪锅铲": "/items/cheese_spatula",
        "翠绿锅铲": "/items/verdant_spatula",
        "蔚蓝锅铲": "/items/azure_spatula",
        "深紫锅铲": "/items/burble_spatula",
        "绛红锅铲": "/items/crimson_spatula",
        "彩虹锅铲": "/items/rainbow_spatula",
        "神圣锅铲": "/items/holy_spatula",
        "星空壶": "/items/celestial_pot",
        "奶酪壶": "/items/cheese_pot",
        "翠绿壶": "/items/verdant_pot",
        "蔚蓝壶": "/items/azure_pot",
        "深紫壶": "/items/burble_pot",
        "绛红壶": "/items/crimson_pot",
        "彩虹壶": "/items/rainbow_pot",
        "神圣壶": "/items/holy_pot",
        "星空蒸馏器": "/items/celestial_alembic",
        "奶酪蒸馏器": "/items/cheese_alembic",
        "翠绿蒸馏器": "/items/verdant_alembic",
        "蔚蓝蒸馏器": "/items/azure_alembic",
        "深紫蒸馏器": "/items/burble_alembic",
        "绛红蒸馏器": "/items/crimson_alembic",
        "彩虹蒸馏器": "/items/rainbow_alembic",
        "神圣蒸馏器": "/items/holy_alembic",
        "星空强化器": "/items/celestial_enhancer",
        "奶酪强化器": "/items/cheese_enhancer",
        "翠绿强化器": "/items/verdant_enhancer",
        "蔚蓝强化器": "/items/azure_enhancer",
        "深紫强化器": "/items/burble_enhancer",
        "绛红强化器": "/items/crimson_enhancer",
        "彩虹强化器": "/items/rainbow_enhancer",
        "神圣强化器": "/items/holy_enhancer",
        "牛奶": "/items/milk",
        "翠绿牛奶": "/items/verdant_milk",
        "蔚蓝牛奶": "/items/azure_milk",
        "深紫牛奶": "/items/burble_milk",
        "绛红牛奶": "/items/crimson_milk",
        "彩虹牛奶": "/items/rainbow_milk",
        "神圣牛奶": "/items/holy_milk",
        "奶酪": "/items/cheese",
        "翠绿奶酪": "/items/verdant_cheese",
        "蔚蓝奶酪": "/items/azure_cheese",
        "深紫奶酪": "/items/burble_cheese",
        "绛红奶酪": "/items/crimson_cheese",
        "彩虹奶酪": "/items/rainbow_cheese",
        "神圣奶酪": "/items/holy_cheese",
        "原木": "/items/log",
        "白桦原木": "/items/birch_log",
        "雪松原木": "/items/cedar_log",
        "紫心原木": "/items/purpleheart_log",
        "银杏原木": "/items/ginkgo_log",
        "红杉原木": "/items/redwood_log",
        "神秘原木": "/items/arcane_log",
        "木板": "/items/lumber",
        "白桦木板": "/items/birch_lumber",
        "雪松木板": "/items/cedar_lumber",
        "紫心木板": "/items/purpleheart_lumber",
        "银杏木板": "/items/ginkgo_lumber",
        "红杉木板": "/items/redwood_lumber",
        "神秘木板": "/items/arcane_lumber",
        "粗糙兽皮": "/items/rough_hide",
        "爬行动物皮": "/items/reptile_hide",
        "哥布林皮": "/items/gobo_hide",
        "野兽皮": "/items/beast_hide",
        "暗影皮": "/items/umbral_hide",
        "粗糙皮革": "/items/rough_leather",
        "爬行动物皮革": "/items/reptile_leather",
        "哥布林皮革": "/items/gobo_leather",
        "野兽皮革": "/items/beast_leather",
        "暗影皮革": "/items/umbral_leather",
        "棉花": "/items/cotton",
        "亚麻": "/items/flax",
        "竹子": "/items/bamboo_branch",
        "蚕茧": "/items/cocoon",
        "光辉纤维": "/items/radiant_fiber",
        "棉花布料": "/items/cotton_fabric",
        "亚麻布料": "/items/linen_fabric",
        "竹子布料": "/items/bamboo_fabric",
        "丝绸": "/items/silk_fabric",
        "光辉布料": "/items/radiant_fabric",
        "鸡蛋": "/items/egg",
        "小麦": "/items/wheat",
        "糖": "/items/sugar",
        "蓝莓": "/items/blueberry",
        "黑莓": "/items/blackberry",
        "草莓": "/items/strawberry",
        "哞莓": "/items/mooberry",
        "火星莓": "/items/marsberry",
        "太空莓": "/items/spaceberry",
        "苹果": "/items/apple",
        "橙子": "/items/orange",
        "李子": "/items/plum",
        "桃子": "/items/peach",
        "火龙果": "/items/dragon_fruit",
        "杨桃": "/items/star_fruit",
        "低级咖啡豆": "/items/arabica_coffee_bean",
        "中级咖啡豆": "/items/robusta_coffee_bean",
        "高级咖啡豆": "/items/liberica_coffee_bean",
        "特级咖啡豆": "/items/excelsa_coffee_bean",
        "火山咖啡豆": "/items/fieriosa_coffee_bean",
        "太空咖啡豆": "/items/spacia_coffee_bean",
        "绿茶叶": "/items/green_tea_leaf",
        "黑茶叶": "/items/black_tea_leaf",
        "紫茶叶": "/items/burble_tea_leaf",
        "哞龙茶叶": "/items/moolong_tea_leaf",
        "红茶叶": "/items/red_tea_leaf",
        "虚空茶叶": "/items/emp_tea_leaf",
        "点金催化剂": "/items/catalyst_of_coinification",
        "分解催化剂": "/items/catalyst_of_decomposition",
        "转化催化剂": "/items/catalyst_of_transmutation",
        "至高催化剂": "/items/prime_catalyst",
        "蛇牙": "/items/snake_fang",
        "鲸头鹳羽毛": "/items/shoebill_feather",
        "蜗牛壳": "/items/snail_shell",
        "蟹钳": "/items/crab_pincer",
        "乌龟壳": "/items/turtle_shell",
        "海洋鳞片": "/items/marine_scale",
        "树皮": "/items/treant_bark",
        "半人马蹄": "/items/centaur_hoof",
        "月神翼": "/items/luna_wing",
        "哥布林抹布": "/items/gobo_rag",
        "护目镜": "/items/goggles",
        "放大镜": "/items/magnifying_glass",
        "观察者之眼": "/items/eye_of_the_watcher",
        "冰霜织物": "/items/icy_cloth",
        "烈焰织物": "/items/flaming_cloth",
        "魔法师鞋底": "/items/sorcerers_sole",
        "时空球": "/items/chrono_sphere",
        "冰霜球": "/items/frost_sphere",
        "熊猫绒": "/items/panda_fluff",
        "黑熊绒": "/items/black_bear_fluff",
        "棕熊绒": "/items/grizzly_bear_fluff",
        "北极熊绒": "/items/polar_bear_fluff",
        "小熊猫绒": "/items/red_panda_fluff",
        "磁铁": "/items/magnet",
        "钟乳石碎片": "/items/stalactite_shard",
        "花岗岩": "/items/living_granite",
        "巨像核心": "/items/colossus_core",
        "吸血鬼之牙": "/items/vampire_fang",
        "狼人之爪": "/items/werewolf_claw",
        "亡者之魂": "/items/revenant_anima",
        "灵魂碎片": "/items/soul_fragment",
        "地狱余烬": "/items/infernal_ember",
        "恶魔核心": "/items/demonic_core",
        "狮鹫之皮": "/items/griffin_leather",
        "蝎狮之刺": "/items/manticore_sting",
        "鹿角兔之角": "/items/jackalope_antler",
        "渡渡驼之翎": "/items/dodocamel_plume",
        "狮鹫之爪": "/items/griffin_talon",
        "奇幻精炼碎片": "/items/chimerical_refinement_shard",
        "杂技师彩带": "/items/acrobats_ribbon",
        "魔术师织物": "/items/magicians_cloth",
        "混沌锁链": "/items/chaotic_chain",
        "诅咒之球": "/items/cursed_ball",
        "阴森精炼碎片": "/items/sinister_refinement_shard",
        "皇家织物": "/items/royal_cloth",
        "骑士之锭": "/items/knights_ingot",
        "主教卷轴": "/items/bishops_scroll",
        "君王宝石": "/items/regal_jewel",
        "裂空宝石": "/items/sundering_jewel",
        "秘法精炼碎片": "/items/enchanted_refinement_shard",
        "神射胸针": "/items/marksman_brooch",
        "掠夺者徽章": "/items/corsair_crest",
        "破损船锚": "/items/damaged_anchor",
        "怒涛甲片": "/items/maelstrom_plating",
        "克拉肯皮革": "/items/kraken_leather",
        "克拉肯之牙": "/items/kraken_fang",
        "海盗精炼碎片": "/items/pirate_refinement_shard",
        "精通之油": "/items/butter_of_proficiency",
        "专精之线": "/items/thread_of_expertise",
        "洞察之枝": "/items/branch_of_insight",
        "贪食能量": "/items/gluttonous_energy",
        "暴饮能量": "/items/guzzling_energy",
        "挤奶精华": "/items/milking_essence",
        "采摘精华": "/items/foraging_essence",
        "伐木精华": "/items/woodcutting_essence",
        "奶酪锻造精华": "/items/cheesesmithing_essence",
        "制作精华": "/items/crafting_essence",
        "缝纫精华": "/items/tailoring_essence",
        "烹饪精华": "/items/cooking_essence",
        "冲泡精华": "/items/brewing_essence",
        "炼金精华": "/items/alchemy_essence",
        "强化精华": "/items/enhancing_essence",
        "沼泽精华": "/items/swamp_essence",
        "海洋精华": "/items/aqua_essence",
        "丛林精华": "/items/jungle_essence",
        "哥布林精华": "/items/gobo_essence",
        "眼精华": "/items/eyessence",
        "法师精华": "/items/sorcerer_essence",
        "熊熊精华": "/items/bear_essence",
        "魔像精华": "/items/golem_essence",
        "暮光精华": "/items/twilight_essence",
        "地狱精华": "/items/abyssal_essence",
        "奇幻精华": "/items/chimerical_essence",
        "阴森精华": "/items/sinister_essence",
        "秘法精华": "/items/enchanted_essence",
        "海盗精华": "/items/pirate_essence",
        "任务水晶": "/items/task_crystal",
        "星光碎片": "/items/star_fragment",
        "珍珠": "/items/pearl",
        "琥珀": "/items/amber",
        "石榴石": "/items/garnet",
        "翡翠": "/items/jade",
        "紫水晶": "/items/amethyst",
        "月亮石": "/items/moonstone",
        "太阳石": "/items/sunstone",
        "贤者之石": "/items/philosophers_stone",
        "珍珠碎片": "/items/crushed_pearl",
        "琥珀碎片": "/items/crushed_amber",
        "石榴石碎片": "/items/crushed_garnet",
        "翡翠碎片": "/items/crushed_jade",
        "紫水晶碎片": "/items/crushed_amethyst",
        "月亮石碎片": "/items/crushed_moonstone",
        "太阳石碎片": "/items/crushed_sunstone",
        "贤者之石碎片": "/items/crushed_philosophers_stone",
        "保护碎片": "/items/shard_of_protection",
        "保护之镜": "/items/mirror_of_protection"
    }

    function renderTables() {
        const scene = sceneSelect.value;
        const tier = tierSelect.value;

        const sceneKey = scene;
        const leftSaved = JSON.parse(localStorage.getItem(sceneKey) || 'null')?.leftTable || sceneTables[scene].left;
        const rightSaved = JSON.parse(localStorage.getItem(sceneKey) || 'null')?.rightTable || sceneTables[scene].right;
        leftTable.innerHTML = generateTableHTML(leftSaved);
        rightTable.innerHTML = generateTableHTML(rightSaved);
        [...leftTable.querySelectorAll('td[contenteditable="true"]'),
        ...rightTable.querySelectorAll('td[contenteditable="true"]')].forEach(td => td.addEventListener('input', saveData));

        const comboKey = `${scene}_${tier}`;
        const comboSaved = JSON.parse(localStorage.getItem(comboKey) || 'null');
        timeInput.value = comboSaved?.time || '';
        playersCountInput.value = comboSaved?.playersCount || '';

        // 第三个表格 T0 不显示
        if (tier === 'T0') {
            thirdTableContainer.style.display = 'none';
        } else {
            thirdTableContainer.style.display = 'block';
            const thirdRowNameMap = {
                '奇幻洞穴': '奇幻精炼碎片',
                '阴森马戏团': '阴森精炼碎片',
                '秘法要塞': '秘法精炼碎片',
                '海盗基地': '海盗精炼碎片'
            };
            const expectNum = tier === 'T1' ? 0.625 : 1.875;
            const thirdData = [
                ['产物种类', '价格（挂单）', '价格（填单）', '采用价格', '期望数量'],
                [thirdRowNameMap[scene], 0, 0, 0, expectNum],
                ['期望利润', 0, 0, 0, expectNum]
            ];
            const thirdSaved = JSON.parse(localStorage.getItem(comboKey) || 'null')?.thirdTable || thirdData;
            thirdTable.innerHTML = generateTableHTML(thirdSaved);
            [...thirdTable.querySelectorAll('td[contenteditable="true"]')].forEach(td => td.addEventListener('input', saveData));
            attachClickToAdopt(thirdTable);
        }

        leftTable.innerHTML = generateTableHTML(leftSaved);
        rightTable.innerHTML = generateTableHTML(rightSaved);
        attachClickToAdopt(leftTable);
        attachClickToAdopt(rightTable);
        [leftTable, rightTable, thirdTable].forEach(table => {
            if (!table || !table.querySelector('thead')) return;
            const headers = table.querySelectorAll('thead th');
            headers.forEach((th, colIndex) => {
                if (th.textContent.includes('价格（')) {
                    th.style.cursor = 'pointer';
                    th.style.color = '#007bff';
                    th.title = '点击以复制此列价格到采用价格';

                    th.addEventListener('click', () => {
                        const rows = table.querySelectorAll('tbody tr');
                        rows.forEach(row => {
                            const cells = row.querySelectorAll('td');
                            if (cells.length > 0) {
                                const price = parseFloat(cells[colIndex].textContent.trim()) || 0;
                                const targetIndex = Array.from(headers).findIndex(h => h.textContent.includes('采用价格'));
                                if (targetIndex >= 0 && cells[targetIndex]) {
                                    cells[targetIndex].textContent = price;
                                }
                            }
                        });
                        saveData();
                    });
                }
            });
        });
    }

    function generateTableHTML(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return '';
        }

        let html = '<thead><tr>';
        data[0].forEach(h => html += `<th>${h}</th>`);
        html += '</tr></thead><tbody>';

        for (let i = 1; i < data.length; i++) {
            const row = Array.isArray(data[i]) ? data[i] : [];
            html += '<tr>';
            row.forEach((v, j) => {
                if (j === 0) {
                    html += `<td>${v}</td>`;
                } else if (j === 1 || j === 2) {
                    html += `<td class="click-to-adopt">${v}</td>`;
                } else if (j === 3) {
                    html += `<td contenteditable="true">${v}</td>`;
                } else {
                    html += `<td>${v}</td>`;
                }
            });
            html += '</tr>';
        }
        html += '</tbody>';
        return html;
    }

    function saveData() {
        const scene = sceneSelect.value;
        const tier = tierSelect.value;
        const sceneKey = scene;
        localStorage.setItem(sceneKey, JSON.stringify({ leftTable: readTable(leftTable), rightTable: readTable(rightTable) }));
        const comboKey = `${scene}_${tier}`;
        const thirdData = tier === 'T0' ? null : readTable(thirdTable);
        localStorage.setItem(comboKey, JSON.stringify({ time: timeInput.value, playersCount: playersCountInput.value, thirdTable: thirdData }));
    }

    function readTable(tableEl) { return Array.from(tableEl.querySelectorAll('tr')).map(tr => Array.from(tr.querySelectorAll('td,th')).map(td => td.textContent.trim())); }

    async function fetchMarketData() {
        try {
            const res = await fetch(window.location.origin + '/game_data/marketplace.json');
            const data = await res.json();
            const marketData = data.marketData || {};
            marketData["/items/large_treasure_chest"] = {
                "0": {
                    a: 67500 + 0.135 * marketData["/items/bag_of_10_cowbells"]["0"].a
                        + 1.2 * marketData["/items/pearl"]["0"].a
                        + 0.8 * marketData["/items/amber"]["0"].a
                        + 0.8 * marketData["/items/garnet"]["0"].a
                        + 0.8 * marketData["/items/jade"]["0"].a
                        + 0.8 * marketData["/items/amethyst"]["0"].a
                        + 0.6 * marketData["/items/moonstone"]["0"].a,
                    b: 67500 + 0.135 * marketData["/items/bag_of_10_cowbells"]["0"].b
                        + 1.2 * marketData["/items/pearl"]["0"].b
                        + 0.8 * marketData["/items/amber"]["0"].b
                        + 0.8 * marketData["/items/garnet"]["0"].b
                        + 0.8 * marketData["/items/jade"]["0"].b
                        + 0.8 * marketData["/items/amethyst"]["0"].b
                        + 0.6 * marketData["/items/moonstone"]["0"].b
                }
            };
            marketData["/items/chimerical_token"] = {
                "0": {
                    a: Math.round(Math.max(marketData["/items/chimerical_essence"]["0"].a,
                        marketData["/items/griffin_leather"]["0"].a / 600.0,
                        marketData["/items/manticore_sting"]["0"].a / 1000.0,
                        marketData["/items/jackalope_antler"]["0"].a / 1200.0,
                        marketData["/items/dodocamel_plume"]["0"].a / 3000.0,
                        marketData["/items/griffin_talon"]["0"].a / 3000.0)),
                    b: Math.round(Math.max(marketData["/items/chimerical_essence"]["0"].b,
                        marketData["/items/griffin_leather"]["0"].b / 600.0,
                        marketData["/items/manticore_sting"]["0"].b / 1000.0,
                        marketData["/items/jackalope_antler"]["0"].b / 1200.0,
                        marketData["/items/dodocamel_plume"]["0"].b / 3000.0,
                        marketData["/items/griffin_talon"]["0"].b / 3000.0))
                }
            };
            marketData["/items/sinister_token"] = {
                "0": {
                    a: Math.round(Math.max(marketData["/items/sinister_essence"]["0"].a,
                        marketData["/items/acrobats_ribbon"]["0"].a / 2000.0,
                        marketData["/items/magicians_cloth"]["0"].a / 2000.0,
                        marketData["/items/chaotic_chain"]["0"].a / 3000.0,
                        marketData["/items/cursed_ball"]["0"].a / 3000.0
                    )),
                    b: Math.round(Math.max(marketData["/items/sinister_essence"]["0"].b,
                        marketData["/items/acrobats_ribbon"]["0"].b / 2000.0,
                        marketData["/items/magicians_cloth"]["0"].b / 2000.0,
                        marketData["/items/chaotic_chain"]["0"].b / 3000.0,
                        marketData["/items/cursed_ball"]["0"].b / 3000.0
                    ))
                }
            };
            marketData["/items/enchanted_token"] = {
                "0": {
                    a: Math.round(Math.max(marketData["/items/enchanted_essence"]["0"].a,
                        marketData["/items/royal_cloth"]["0"].a / 2000.0,
                        marketData["/items/knights_ingot"]["0"].a / 2000.0,
                        marketData["/items/bishops_scroll"]["0"].a / 2000.0,
                        marketData["/items/regal_jewel"]["0"].a / 3000.0,
                        marketData["/items/sundering_jewel"]["0"].a / 3000.0
                    )),
                    b: Math.round(Math.max(marketData["/items/enchanted_essence"]["0"].b,
                        marketData["/items/royal_cloth"]["0"].b / 2000.0,
                        marketData["/items/knights_ingot"]["0"].b / 2000.0,
                        marketData["/items/bishops_scroll"]["0"].b / 2000.0,
                        marketData["/items/regal_jewel"]["0"].b / 3000.0,
                        marketData["/items/sundering_jewel"]["0"].b / 3000.0
                    ))
                }
            };
            marketData["/items/pirate_token"] = {
                "0": {
                    a: Math.round(Math.max(marketData["/items/pirate_essence"]["0"].a,
                        marketData["/items/marksman_brooch"]["0"].a / 2000.0,
                        marketData["/items/corsair_crest"]["0"].a / 2000.0,
                        marketData["/items/damaged_anchor"]["0"].a / 2000.0,
                        marketData["/items/maelstrom_plating"]["0"].a / 2000.0,
                        marketData["/items/kraken_leather"]["0"].a / 2000.0,
                        marketData["/items/kraken_fang"]["0"].a / 3000.0
                    )),
                    b: Math.round(Math.max(marketData["/items/pirate_essence"]["0"].b,
                        marketData["/items/marksman_brooch"]["0"].b / 2000.0,
                        marketData["/items/corsair_crest"]["0"].b / 2000.0,
                        marketData["/items/damaged_anchor"]["0"].b / 2000.0,
                        marketData["/items/maelstrom_plating"]["0"].b / 2000.0,
                        marketData["/items/kraken_leather"]["0"].b / 2000.0,
                        marketData["/items/kraken_fang"]["0"].b / 3000.0
                    ))
                }
            };
            return marketData; // 假设返回 { marketData: { "/items/xxx": {...} } }
        } catch (e) {
            console.error('获取市场价格失败', e);
            return {};
        }
    }

    function updateTablePrices(tableEl, marketData) {
        const rows = tableEl.querySelectorAll('tbody tr');
        rows.forEach(row => {
            if (!row.cells || row.cells.length < 3) {
                return;
            }
            const nameCell = row.cells[0];
            const itemName = nameCell.textContent.trim();
            const apiKey = itemNameMap[itemName];
            if (!apiKey || !marketData[apiKey]) return;

            const prices = marketData[apiKey]["0"];
            if (!prices) return;

            if (row.cells[1]) row.cells[1].textContent = prices.a ?? row.cells[1].textContent; // 扫单价格
            if (row.cells[2]) row.cells[2].textContent = prices.b ?? row.cells[2].textContent; // 挂单价格
        });
    }


    fetchPriceBtn.addEventListener('click', async () => {
        const marketData = await fetchMarketData();
        updateTablePrices(leftTable, marketData);
        updateTablePrices(rightTable, marketData);
        if (tierSelect.value !== 'T0') updateTablePrices(thirdTable, marketData);
        saveData();
    });

    const recipeMap = {
        "奇幻宝箱钥匙（自制）": ["蓝色钥匙碎片", "绿色钥匙碎片", "紫色钥匙碎片", "白色钥匙碎片"],
        "阴森宝箱钥匙（自制）": ["紫色钥匙碎片", "橙色钥匙碎片", "棕色钥匙碎片", "黑暗钥匙碎片"],
        "秘法宝箱钥匙（自制）": ["橙色钥匙碎片", "棕色钥匙碎片", "石头钥匙碎片", "燃烧钥匙碎片"],
        "海盗宝箱钥匙（自制）": ["白色钥匙碎片", "石头钥匙碎片", "黑暗钥匙碎片", "燃烧钥匙碎片"],
        "奇幻钥匙（自制）": ["暗影皮革", "野兽皮革"],
        "阴森钥匙（自制）": ["神圣奶酪", "彩虹奶酪"],
        "秘法钥匙（自制）": ["光辉布料", "丝绸"],
        "海盗钥匙（自制）": ["神秘木板", "红杉木板"]
    };

    // 暴饮之囊强化等级加成表
    const bagEnhanceBonus = {
        0: 0, 1: 0.02, 2: 0.042, 3: 0.066, 4: 0.092, 5: 0.12, 6: 0.15, 7: 0.182,
        8: 0.216, 9: 0.252, 10: 0.29, 11: 0.334, 12: 0.384, 13: 0.44, 14: 0.502,
        15: 0.57, 16: 0.644, 17: 0.724, 18: 0.81, 19: 0.902, 20: 1.0
    };

    function calculateCraftedKeys(tableEl) {
        const rows = Array.from(tableEl.querySelectorAll('tbody tr'));

        // 计算折扣 x
        let x = 0.1;
        if (bagCheck.checked) {
            const enhance = parseInt(enhanceSelect.value) || 0;
            const bonus = bagEnhanceBonus[enhance] || 0;
            x *= 1 + 0.10 * (1 + bonus);
        }

        rows.forEach(row => {
            const name = row.cells[0].textContent.trim();
            const recipe = recipeMap[name];
            if (recipe) {
                let sumA = 0, sumB = 0, sumC = 0;
                recipe.forEach(materialName => {
                    const materialRow = rows.find(r => r.cells[0].textContent.trim() === materialName);
                    if (materialRow) {
                        const a = parseFloat(materialRow.cells[1].textContent) || 0;
                        const b = parseFloat(materialRow.cells[2].textContent) || 0;
                        const c = parseFloat(materialRow.cells[3].textContent) || 0;
                        sumA += a; sumB += b; sumC += c;
                    }
                });

                // 门票
                if (!name.includes("宝箱")) {
                    let extra = 0;
                    if (name.includes("奇幻钥匙")) extra = 100000;
                    else if (name.includes("阴森钥匙")) extra = 150000;
                    else if (name.includes("秘法钥匙")) extra = 250000;
                    else if (name.includes("海盗钥匙")) extra = 300000;

                    sumA = sumA * 100 + extra;
                    sumB = sumB * 100 + extra;
                    sumC = sumC * 100 + extra;
                }

                sumA *= (1 - x);
                sumB *= (1 - x);
                sumC *= (1 - x);

                if (row.cells[1]) row.cells[1].textContent = sumA.toFixed(0);
                if (row.cells[2]) row.cells[2].textContent = sumB.toFixed(0);
                if (row.cells[3]) row.cells[3].textContent = sumC.toFixed(0);
            }
        });
    }

    function calculateExpectedProfit(leftTable, rightTable) {
        let totalValue = 0;
        const rightRows = rightTable.querySelectorAll('tbody tr');
        const leftRows = leftTable.querySelectorAll('tbody tr');

        // 遍历右表：计算产物期望价值
        rightRows.forEach((row, idx) => {
            // 跳过“期望利润”行
            if (row.cells[0].textContent.includes('期望利润')) return;
            const name = row.cells[0].textContent.trim();
            const adoptPrice = parseFloat(row.cells[3].textContent.trim()) || 0;
            const expectedQty = parseFloat(row.cells[4].textContent.trim()) || 0;

            totalValue += adoptPrice * expectedQty * 0.98;
        });

        // 查找“宝箱钥匙”价格
        let keyPrice = 99999999;
        let entryKeyPrice = 99999999;
        leftRows.forEach(row => {
            const name = row.cells[0].textContent.trim();
            if (name.includes('宝箱钥匙')) {
                const adoptPrice = parseFloat(row.cells[3].textContent.trim()) || 0;
                keyPrice = Math.min(keyPrice, adoptPrice);
            }
            if (name.includes('钥匙') && !name.includes('宝箱') && !name.includes('碎片')) {
                const adoptPrice = parseFloat(row.cells[3].textContent.trim()) || 0;
                entryKeyPrice = Math.min(entryKeyPrice, adoptPrice);
            }
        });
        if (rightTable === thirdTable) {
            entryKeyPrice = 0;
            if (tierSelect.value === 'T1') {
                keyPrice /= 3;
            }
        }
        else keyPrice += entryKeyPrice;

        // 计算期望利润
        const expectedProfit = totalValue - keyPrice;

        // 写入右表最后一行的“采用价格”列
        const lastRow = rightRows[rightRows.length - 1];
        if (lastRow && lastRow.cells[0].textContent.includes('期望利润')) {
            lastRow.cells[3].textContent = expectedProfit.toFixed(0);
        }

    }

    const buffBonus = {
        1: 20.0, 2: 20.5, 3: 21.0, 4: 21.5, 5: 22.0, 6: 22.5, 7: 23.0, 8: 23.5, 9: 24.0, 10: 24.5,
        11: 25.0, 12: 25.5, 13: 26.0, 14: 26.5, 15: 27.0, 16: 27.5, 17: 28.0, 18: 28.5, 19: 29.0, 20: 29.5
    };

    function calculatedailyprofit() {
        const timePerRun = parseFloat(timeInput.value) || 0;
        const playersCount = parseInt(playersCountInput.value) || 5;
        if (timePerRun <= 0) return 0;
        const runsPerDay = 1440 / timePerRun / playersCount * 5;
        const rightRows = rightTable.querySelectorAll('tbody tr');
        const lastRow = rightRows[rightRows.length - 1];
        const buff = buffCheck.checked ? buffBonus[parseInt(buffSelect.value) || 0] / 100 : 0;

        if (lastRow && lastRow.cells[0].textContent.includes('期望利润')) {
            const expectedProfit = parseFloat(lastRow.cells[3].textContent.trim()) || 0;
            if (tierSelect.value === 'T0') {
                return expectedProfit * runsPerDay * (1 + buff);
            }
            const thirdRows = thirdTable.querySelectorAll('tbody tr');
            const thirdLastRow = thirdRows[thirdRows.length - 1];
            let thirdExpectedProfit = 0;
            if (thirdLastRow && thirdLastRow.cells[0].textContent.includes('期望利润')) {
                thirdExpectedProfit = parseFloat(thirdLastRow.cells[3].textContent.trim()) || 0;
            }
            return (expectedProfit + thirdExpectedProfit) * runsPerDay * (1 + buff);
        }
        return 0;
    }

    calcKeyBtn.addEventListener('click', () => {
        calculateCraftedKeys(leftTable);
        calculateExpectedProfit(leftTable, rightTable)
        calculateExpectedProfit(leftTable, thirdTable);
        const dailyProfit = calculatedailyprofit();
        dailyProfitDisplay.textContent = `期望日入：${Number(dailyProfit.toFixed(0)).toLocaleString("en-US")} `;
        saveData();
    });

    function attachClickToAdopt(tableEl) {
        tableEl.querySelectorAll('td.click-to-adopt').forEach(td => {
            td.addEventListener('click', () => {
                const row = td.parentElement;
                const adoptCell = row.cells[3];
                if (adoptCell) adoptCell.textContent = td.textContent;
                saveData();
            });
        });
    }

    sceneSelect.addEventListener('change', renderTables);
    tierSelect.addEventListener('change', renderTables);
    timeInput.addEventListener('input', saveData);
    playersCountInput.addEventListener('input', saveData);

    document.addEventListener('click', function (e) {
        const shadowHost = document.getElementById('__tm_shadow_host__') || __tm_shadow_host;
        const box = draggableBox;
        const toggleBtnEl = toggleBtn;

        if (box.style.display === 'block' &&
            !shadowHost.contains(e.target) &&
            e.target !== toggleBtnEl
        ) {
            box.style.display = 'none';
        }
    });

    const clearStorageBtn = draggableBox.querySelector('#tm-clear-storage-btn');
    const clearList = [
        '奇幻洞穴_T0', '奇幻洞穴_T1', '奇幻洞穴_T2',
        '阴森马戏团_T0', '阴森马戏团_T1', '阴森马戏团_T2',
        '秘法要塞_T0', '秘法要塞_T1', '秘法要塞_T2',
        '海盗基地_T0', '海盗基地_T1', '海盗基地_T2',
        '奇幻洞穴', '阴森马戏团', '秘法要塞', '海盗基地',
        "globalBag", "globalBuff", "globalEnhance", "globalBuffLevel"
    ];
    clearStorageBtn.addEventListener('click', function () {
        clearList.forEach(key => localStorage.removeItem(key));
    });

    renderTables();
})();

