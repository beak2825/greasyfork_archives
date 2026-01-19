// ==UserScript==
// @name         DLsite 当日发售游戏筛选
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  筛选DLsite排行榜中指定日期发售的游戏，支持前后切换与日期选择,总览
// @author       Accard
// @match        https://www.dlsite.com/maniax/ranking/day/=/date/30d/category/game
// @match        https://www.dlsite.com/maniax/ranking/day?category=game&date=30d
// @match        https://www.dlsite.com/maniax/ranking/week?category=game&date=30d
// @match        https://www.dlsite.com/maniax/ranking/month?category=game&date=30d
// @match        https://www.dlsite.com/maniax/ranking/year?category=game&date=30d
// @match        https://www.dlsite.com/maniax/ranking/total?category=game&date=30d
// @grant        none
// @license MIT licensed
// @downloadURL https://update.greasyfork.org/scripts/557722/DLsite%20%E5%BD%93%E6%97%A5%E5%8F%91%E5%94%AE%E6%B8%B8%E6%88%8F%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557722/DLsite%20%E5%BD%93%E6%97%A5%E5%8F%91%E5%94%AE%E6%B8%B8%E6%88%8F%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       0. 当前筛选日期（新增）
    ========================== */
    let currentDate = new Date();
    let viewMode = 'single'; // single | overview
    let overviewDate = null; // overview 模式当前选中的日期

    /* =========================
       1. CSS（新增日期控件样式）
    ========================== */
    const cssStyles = `
        #today-games-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            max-width: 95%;
            max-height: 85vh;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            z-index: 2147483647;
            display: none;
            flex-direction: column;
            font-family: "Meiryo", sans-serif;
            overflow: hidden;
        }

        #today-games-header {
            background: #ff5252;
            color: white;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        #today-games-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        }

        /* 日期控制区（新增） */
        .date-controls {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-right: 10px;
        }

        .date-controls button {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 16px;
            width: 28px;
            height: 28px;
            border-radius: 4px;
            cursor: pointer;
        }

        .date-controls button:hover {
            background: rgba(255,255,255,0.35);
        }

        .date-controls input[type="date"] {
            border: none;
            border-radius: 4px;
            padding: 2px 4px;
            font-size: 13px;
        }

        #today-games-close-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        }

        #toggle-view {
            padding: 4px 10px;
            border-radius: 4px;
            border: none;
            background: rgba(255,255,255,0.25);
            color: white;
            cursor: pointer;
        }

        #toggle-view:hover {
            background: rgba(255,255,255,0.35);
        }

        #today-games-content {
            display: flex;
            flex: 1;
            background: #f9f9f9;
            overflow-y: auto;
        }

        .date-list {
            width: 180px;
            background: #fff;
            border-right: 1px solid #eee;
            overflow-y: auto;
        }

        .date-item {
            padding: 10px;
            font-size: 13px;
            cursor: pointer;
            border-bottom: 1px solid #f2f2f2;
        }

        .date-item:hover {
            background: #fff5f5;
        }

        .games-panel {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }

        .date-section h4 {
            margin: 12px 0;
            padding-left: 6px;
            border-left: 4px solid #ff5252;
        }

        .simple-table {
            width: 100%;
            border-collapse: collapse;
        }

        .simple-row {
            background: white;
            border-bottom: 1px solid #eee;
            cursor: pointer;
        }

        .simple-row:hover {
            background: #fff5f5;
        }

        .col-img {
            width: 100px;
            padding: 10px;
            text-align: center;
        }

        .col-img img {
            width: 80px;
            border-radius: 4px;
        }

        .col-info {
            padding: 10px;
        }

        .info-cat {
            font-size: 11px;
            background: #eee;
            padding: 2px 6px;
            border-radius: 4px;
        }

        .info-title {
            font-size: 15px;
            font-weight: bold;
            margin: 6px 0;
        }

        .info-price .work_price { color: #d32f2f; font-weight: bold; }

        .col-sales {
            width: 120px;
            padding: 10px 20px 10px 0;
            text-align: right;
            vertical-align: middle;
        }

        .sales-label {
            font-size: 11px;
            color: #888;
            display: block;
        }

        .sales-num {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            text-align: right;
        }

        #toggle-today-games {
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 12px 24px;
            background: #ff5252;
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-size: 15px;
            font-weight: bold;
            z-index: 2147483647;
            box-shadow: 0 4px 15px rgba(255, 82, 82, 0.4);
            transition: transform 0.2s, background 0.2s;
        }
        #toggle-today-games:hover {
            transform: scale(1.05);
            background: #ff3333;
        }
    `;

    function addGlobalStyle(css) {
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    /* =========================
       2. 日期工具函数（新增）
    ========================== */
    function formatDLDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}年${m}月${d}日`;
    }

    function formatInputDate(date) {
        return date.toISOString().slice(0, 10);
    }

    /* =========================
       3. 创建 UI
    ========================== */
    function createUI() {
        if (document.getElementById('toggle-today-games')) return;

        addGlobalStyle(cssStyles);

        const popup = document.createElement('div');
        popup.id = 'today-games-popup';
        popup.innerHTML = `
            <div id="today-games-header">
                <h3 id="today-games-title">发售筛选</h3>
                <div style="display:flex;align-items:center;">
                    <div class="date-controls">
                        <button id="date-prev">&lt;</button>
                        <input type="date" id="date-picker">
                        <button id="date-next">&gt;</button>
                    </div>
                    <button id="toggle-view">总览</button>
                    <button id="today-games-close-btn">×</button>
                </div>
            </div>
            <div id="today-games-content"></div>
        `;
        document.body.appendChild(popup);

        const btn = document.createElement('button');
        btn.id = 'toggle-today-games';
        btn.textContent = '发售筛选';
        document.body.appendChild(btn);

        const datePicker = popup.querySelector('#date-picker');
        datePicker.value = formatInputDate(currentDate);

        // 日期事件
        popup.querySelector('#date-prev').onclick = () => {
            currentDate.setDate(currentDate.getDate() - 1);
            datePicker.value = formatInputDate(currentDate);
            runFilter(popup);
        };

        popup.querySelector('#date-next').onclick = () => {
            currentDate.setDate(currentDate.getDate() + 1);
            datePicker.value = formatInputDate(currentDate);
            runFilter(popup);
        };

        datePicker.onchange = () => {
            currentDate = new Date(datePicker.value);
            runFilter(popup);
        };

        popup.querySelector('#toggle-view').onclick = () => {
            viewMode = viewMode === 'single' ? 'overview' : 'single';
            if(viewMode === 'single'){
                popup.querySelector('#toggle-view').innerText = '总览';
            }else{
                popup.querySelector('#toggle-view').innerText = '单日';
            }
            runFilter(popup);
        };

        popup.querySelector('#today-games-close-btn').onclick = () => {
            popup.style.display = 'none';
        };

        btn.onclick = () => runFilter(popup);
    }

    /* =========================
       4. 核心筛选逻辑（改为用 currentDate）
    ========================== */
    function runFilter(popup) {
        const rows = document.querySelectorAll('#ranking_table tr');
        const content = popup.querySelector('#today-games-content');
        const title = popup.querySelector('#today-games-title');
        content.innerHTML = '';

        if (viewMode === 'single') {
            const targetDate = formatDLDate(currentDate);
            const content = popup.querySelector('#today-games-content');
            const title = popup.querySelector('#today-games-title');

            let len = renderSingleDate(content,targetDate);
            title.textContent = `发售日期：${targetDate} - (共${len} 款)`;
        }else{
            title.textContent = '发售日期总览';

            const map = {};
            rows.forEach(row => {
                const rawDate = row.querySelector('.sales_date')?.textContent || '';
                const date = rawDate.replace(/^販売日:\s*/, '').trim();
                const name = row.querySelector('.work_name a');
                if (!date || !name) return;
                map[date] ??= [];
                map[date].push({
                    title: name.textContent.trim(),
                    url: name.href,
                    img: row.querySelector('.work_thumb_box_img')?.src || ''
                });
            });

            const dates = Object.keys(map).sort().reverse();
            const list = document.createElement('div');
            list.className = 'date-list';

            const panel = document.createElement('div');
            panel.innerHTML = '<div style="padding:40px;color:#888;">请选择左侧日期</div>';
            panel.className = 'games-panel';

            dates.forEach(d => {
                const item = document.createElement('div');
                item.className = 'date-item';
                item.textContent = `${d} (${map[d].length})`;
                item.onclick = () => {
                    overviewDate = d;
                    renderSingleDate(panel, d);
                };
                list.appendChild(item);
            });

            content.appendChild(list);
            content.appendChild(panel);
        }
        popup.style.display = 'flex';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

    function renderSingleDate(container, targetDate) {
        const rows = document.querySelectorAll('#ranking_table tr');
        const result = [];

        rows.forEach(row => {
            const name = row.querySelector('.work_name');
            if (!name) return;

            const dateEl = row.querySelector('.sales_date');
            if (!dateEl) return;

            const cleanDate = dateEl.textContent.replace(/^販売日:\s*/, '').trim();
            if (cleanDate !== targetDate) return;

            const titleA = name.querySelector('a');
            const img = row.querySelector('.work_thumb_box_img');
            const category = row.querySelector('.work_category');
            const price = row.querySelector('.work_price_wrap');
            const salesEl = row.querySelector('.work_dl span[class*="_dl_count_"]');

            result.push({
                title: titleA.textContent.trim(),
                url: titleA.href,
                img: img?.dataset.src || img?.src || '',
                category: category ? category.textContent.trim() : '',
                price: price?.innerHTML || '',
                sales: parseInt(salesEl?.textContent.replace(/\D/g, '')) || 0
            });
        });

        result.sort((a, b) => b.sales - a.sales);

        container.innerHTML = result.length
            ? `<table class="simple-table">${result.map(g => `
            <tr class="simple-row" onclick="window.open('${g.url}')">
                <td class="col-img"><img src="${g.img}"></td>
                <td class="col-info">
                    <span class="info-cat">${g.category}</span>
                    <div class="info-title">${g.title}</div>
                    <div class="info-price">${g.price}</div>
                </td>
                <td class="col-sales">
                    <span class="sales-label">販売数</span>
                    <div class="sales-num">${g.sales.toLocaleString()}</div>
                </td>
            </tr>
        `).join('')}</table>`
        : `<div style="padding:40px;text-align:center;color:#888;">该日期无发售游戏</div>`;

        return result.length;
    }
})();