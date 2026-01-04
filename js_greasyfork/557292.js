// ==UserScript==
// @name         BJTU 教室空闲查询助手
// @namespace    http://tampermonkey.net/
// @version      3.4
// @license     MIT
// @description  一个用于北京交通大学教学服务平台 (aa.bjtu.edu.cn) 的油猴脚本。它能在你浏览教室查询页面时，自动抓取所有分页数据，并筛选出当前可用的自习教室。
// @author       Lxl
// @match        https://aa.bjtu.edu.cn/classroomtimeholdresult/room_view/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557292/BJTU%20%E6%95%99%E5%AE%A4%E7%A9%BA%E9%97%B2%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557292/BJTU%20%E6%95%99%E5%AE%A4%E7%A9%BA%E9%97%B2%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        blocks: [
            { name: "🌟 全天空闲", slots: [0, 1, 3, 4, 6], rooms: [] },
            { name: "☀️ 上午空闲 (1-2节)",      slots: [0, 1],           rooms: [] },
            { name: "☕ 下午空闲 (4-5节)",      slots: [3, 4],           rooms: [] },
            { name: "🌙 晚上空闲 (7节)",       slots: [6],              rooms: [] }
        ]
    };

    const PRIORITY_MAP = {
        "YF": 1, "SY": 2, "SX": 3, "SD": 4, "OTHER": 99
    };

    const COLOR_MAP = {
        "YF": "rgba(64, 192, 87, 0.25)",
        "SY": "rgba(77, 171, 247, 0.25)",
        "SX": "rgba(255, 107, 107, 0.25)",
        "SD": "rgba(255, 169, 77, 0.25)",
        "OTHER": "rgba(255, 255, 255, 0.1)"
    };

    const BORDER_MAP = {
        "YF": "#40c057", "SY": "#4dabf7", "SX": "#ff6b6b", "SD": "#ffa94d", "OTHER": "transparent"
    };

    const STYLES = `
        #bjtu-helper-panel {
            position: fixed; top: 100px; right: 20px; width: 340px;
            background: rgba(33, 37, 41, 0.98); color: #fff;
            border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            z-index: 9999; font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px; border: 1px solid rgba(255,255,255,0.1);
            display: flex; flex-direction: column; max-height: 85vh;
        }
        #bjtu-helper-header {
            padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-between; align-items: center;
            font-weight: bold; background: rgba(255,255,255,0.05);
            border-radius: 8px 8px 0 0; cursor: move;
        }
        #bjtu-helper-content {
            padding: 15px; overflow-y: auto; flex: 1;
        }
        .bjtu-status-bar {
            padding: 0 15px 10px; font-size: 12px; color: #adb5bd;
            border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 10px;
        }
        .bjtu-progress {
            height: 3px; background: #343a40; margin-top: 5px;
            border-radius: 2px; overflow: hidden;
        }
        .bjtu-progress-bar {
            height: 100%; background: #4dabf7; width: 0%; transition: width 0.3s;
        }
        .bjtu-block-group { margin-bottom: 18px; }
        .bjtu-block-title {
            color: #74c0fc; font-size: 13px; margin-bottom: 8px;
            font-weight: 600; display: flex; justify-content: space-between; align-items: center;
            cursor: pointer; user-select: none;
        }
        /* 折叠指示箭头 */
        .bjtu-block-title::after {
            content: '▼'; font-size: 10px; margin-left: 8px; transition: transform 0.2s;
        }
        .bjtu-block-title.collapsed::after {
            transform: rotate(-90deg);
        }
        .bjtu-room-list { display: flex; flex-wrap: wrap; gap: 6px; }
        .bjtu-room-list.hidden { display: none; }

        .bjtu-room-tag {
            padding: 4px 8px; border-radius: 4px; font-size: 13px;
            border: 1px solid transparent; color: #e9ecef;
            transition: all 0.2s; font-family: Consolas, Monaco, monospace;
        }
        .bjtu-room-tag:hover { filter: brightness(1.2); cursor: default; }
        #bjtu-refresh-icon { cursor: pointer; opacity: 0.7; transition: 0.3s; }
        #bjtu-refresh-icon:hover { opacity: 1; transform: rotate(180deg); }
    `;

    GM_addStyle(STYLES);

    function getTodayColumnIndex() {
        let day = new Date().getDay();
        let dayIndex = (day === 0) ? 6 : day - 1;
        return 1 + (dayIndex * 7);
    }

    function getPrefix(roomName) {
        const match = roomName.match(/^([A-Za-z]+)/);
        return match ? match[1].toUpperCase() : "OTHER";
    }

    function sortRooms(rooms) {
        return rooms.sort((a, b) => {
            const prefixA = getPrefix(a);
            const prefixB = getPrefix(b);
            const pA = PRIORITY_MAP[prefixA] || PRIORITY_MAP["OTHER"];
            const pB = PRIORITY_MAP[prefixB] || PRIORITY_MAP["OTHER"];
            if (pA !== pB) return pA - pB;
            return a.localeCompare(b, 'en', { numeric: true });
        });
    }

    function getMaxPage() {
        const bodyText = document.body.innerText;
        const cnMatch = bodyText.match(/共\s*(\d+)\s*页/);
        if (cnMatch) return parseInt(cnMatch[1]);
        const enMatch = bodyText.match(/Page[：:]\s*\d+\s*\/\s*(\d+)/i);
        if (enMatch) return parseInt(enMatch[1]);
        const pageLinks = document.querySelectorAll('ul.pagination a');
        let max = 1;
        const currentParams = new URLSearchParams(window.location.search);
        if(currentParams.has('page')) max = Math.max(max, parseInt(currentParams.get('page')));
        pageLinks.forEach(link => {
            if (/^\d+$/.test(link.innerText.trim())) max = Math.max(max, parseInt(link.innerText));
            if (link.href && link.href.match(/page=(\d+)/)) max = Math.max(max, parseInt(link.href.match(/page=(\d+)/)[1]));
        });
        return max;
    }

    function isSlotFreeStatic(td) {
        const styleText = (td.getAttribute('style') || '').toLowerCase();
        if (!styleText.includes('background-color')) return true;
        return /#fff|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)|transparent/.test(styleText);
    }

    function isSlotFreeLive(td) {
        const style = window.getComputedStyle(td);
        const bg = style.backgroundColor;
        return bg === 'rgb(255, 255, 255)' || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)';
    }

    function extractData(rows, storage, isLive) {
        rows.forEach(row => {
            const cols = row.querySelectorAll("td");
            if (cols.length < 50) return;
            const roomName = cols[0].innerText.split('(')[0].trim();
            const slots = [];
            cols.forEach(col => slots.push(isLive ? isSlotFreeLive(col) : isSlotFreeStatic(col)));
            storage[roomName] = slots;
        });
    }

    function analyze(allDataMap) {
        CONFIG.blocks.forEach(b => b.rooms = []);
        const startCol = getTodayColumnIndex();

        for (const [roomName, slots] of Object.entries(allDataMap)) {
            CONFIG.blocks.forEach(block => {
                let allFree = true;
                for (let offset of block.slots) {
                    if (startCol + offset >= slots.length || !slots[startCol + offset]) {
                        allFree = false;
                        break;
                    }
                }
                if (allFree) block.rooms.push(roomName);
            });
        }

        CONFIG.blocks.forEach(b => {
            sortRooms(b.rooms);
        });

        renderResults();
    }

    async function runFullScan() {
        const maxPage = getMaxPage();
        const allDataMap = {};
        const statusText = document.getElementById('bjtu-status-text');
        const progressBar = document.getElementById('bjtu-progress-bar');

        statusText.innerText = `正在扫描全楼层 (共 ${maxPage} 页)...`;
        const currentParams = new URLSearchParams(window.location.search);
        let currentPage = parseInt(currentParams.get('page')) || 1;
        const promises = [];

        for (let i = 1; i <= maxPage; i++) {
            if (i === currentPage) {
                const rows = Array.from(document.querySelectorAll("table.table-bordered tr")).slice(2);
                extractData(rows, allDataMap, true);
                progressBar.style.width = `${(i / maxPage) * 100}%`;
                continue;
            }
            const targetUrl = new URL(window.location.href);
            targetUrl.searchParams.set('page', i);
            const p = fetch(targetUrl.toString())
                .then(r => r.text())
                .then(html => {
                    const doc = new DOMParser().parseFromString(html, "text/html");
                    const rows = Array.from(doc.querySelectorAll("table.table-bordered tr")).slice(2);
                    extractData(rows, allDataMap, false);
                })
                .catch(e => console.error(e))
                .finally(() => {
                    const currentWidth = parseFloat(progressBar.style.width) || 0;
                    progressBar.style.width = `${Math.min(currentWidth + (100/maxPage), 100)}%`;
                });
            promises.push(p);
        }

        await Promise.all(promises);
        statusText.innerText = `已合并 ${maxPage} 页数据`;
        progressBar.style.background = '#40c057';
        analyze(allDataMap);
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'bjtu-helper-panel';
        panel.innerHTML = `
            <div id="bjtu-helper-header">
                <span>教室空闲助手</span>
                <span id="bjtu-refresh-icon" title="重新扫描">↻</span>
            </div>
            <div class="bjtu-status-bar">
                <div id="bjtu-status-text">初始化中...</div>
                <div class="bjtu-progress">
                    <div id="bjtu-progress-bar" class="bjtu-progress-bar"></div>
                </div>
            </div>
            <div id="bjtu-helper-content"></div>
        `;
        document.body.appendChild(panel);

        document.getElementById('bjtu-refresh-icon').onclick = () => {
             document.getElementById('bjtu-progress-bar').style.width = '0%';
             document.getElementById('bjtu-progress-bar').style.background = '#4dabf7';
             runFullScan();
        };

        const header = document.getElementById('bjtu-helper-header');
        let isDragging = false, startX, startY, initialLeft, initialTop;
        header.onmousedown = (e) => {
            isDragging = true; startX = e.clientX; startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            panel.style.right = 'auto'; panel.style.left = initialLeft + 'px'; panel.style.top = initialTop + 'px';
        };
        document.onmousemove = (e) => {
            if(!isDragging) return;
            panel.style.left = (initialLeft + (e.clientX - startX)) + 'px';
            panel.style.top = (initialTop + (e.clientY - startY)) + 'px';
        };
        document.onmouseup = () => isDragging = false;
    }

    function renderResults() {
        const container = document.getElementById('bjtu-helper-content');
        let html = '';

        CONFIG.blocks.forEach(block => {
            html += `<div class="bjtu-block-group">`;
            html += `<div class="bjtu-block-title">
                        <span>${block.name}</span>
                        <div style="display:flex; align-items:center;">
                            <span style="opacity:0.6; font-size:12px; margin-right:5px;">${block.rooms.length}间</span>
                        </div>
                     </div>`;
            html += `<div class="bjtu-room-list">`;

            if (block.rooms.length === 0) {
                html += `<span style="color:#868e96; font-size:12px; padding:5px;">暂无空闲</span>`;
            } else {
                block.rooms.forEach(room => {
                    const prefix = getPrefix(room);
                    const bgColor = COLOR_MAP[prefix] || COLOR_MAP["OTHER"];
                    const borderColor = BORDER_MAP[prefix] || "transparent";
                    html += `<span class="bjtu-room-tag" style="background:${bgColor}; border-color:${borderColor}">${room}</span>`;
                });
            }
            html += `</div></div>`;
        });
        container.innerHTML = html;

        // 绑定折叠事件
        container.querySelectorAll('.bjtu-block-title').forEach(title => {
            title.addEventListener('click', function() {
                this.classList.toggle('collapsed');
                const list = this.nextElementSibling;
                list.classList.toggle('hidden');
            });
        });
    }

    window.addEventListener('load', () => {
        createPanel();
        setTimeout(runFullScan, 600);
    });

})();