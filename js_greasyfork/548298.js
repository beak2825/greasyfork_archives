// ==UserScript==
// @name         Perfdog-plugin 性能插件
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Perfdog 性能监控插件，提供实时数据展示、拖拽面板和快速复制功能。
// @match        *://perfdog.qq.com/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548298/Perfdog-plugin%20%E6%80%A7%E8%83%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/548298/Perfdog-plugin%20%E6%80%A7%E8%83%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config_json = {
        "fps_avg": "平均FPS",
        "fps_ge_25": "FPS>=25[%]",
        "jank_per_hour": "Jank[/10min]",
        "mem_use_avg": "内存均值[MB]",
        "mem_use_max": "内存峰值[MB]",
        "stutter": "卡顿率[%]",
        "cpu_app_avg": "Avg(AppCPU) [%]"
    };

    let globalInfos = [];
    let initialized = false;
    let isSyncing = false;
    let isMinimized = false;

    function setPos(el, l, t) {
        el.style.left = l + 'px';
        el.style.top = t + 'px';
    }
    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    const panel = document.createElement('div');
    panel.id = 'floating-panel';
    panel.style.cssText = `
        position: fixed;
        top: 100px;
        right: 100px;
        z-index: 99999;
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        min-width: 280px;
        max-height: 600px;
        overflow-y: auto;
        font-size: 14px;
        font-family: 'Arial', sans-serif;
        color: #333;
        will-change: transform;
        backface-visibility: hidden;
    `;
    panel.innerHTML = `
        <div id="drag-bar" style="cursor:move; background:#e0e0e0; padding:10px; text-align:center; font-weight:bold; border-radius: 5px; font-size: 16px; color: #333;">
            Perfdog-plugin 性能插件
            <span id="minimize-btn" style="float:right; cursor:pointer; font-size:14px;">➖</span>
        </div>
        <div style="text-align:center; margin-top:5px;">
            <a href="https://www.baidu.com" target="_blank" style="color:#1a0dab; text-decoration:none;">帮助文档</a>
        </div>
        <form id="checkbox-container" style="margin-top: 10px;"></form>
        <hr style="border-color: #ddd; margin-top: 10px;">
        <table id="data-table" border="1" style="width:100%; border-collapse:collapse; font-size:13px; margin-top: 15px; border-radius: 5px; overflow: hidden;">
            <thead>
                <tr style="background: linear-gradient(145deg, #6e7f86, #8f9a9f); color: white; font-weight: bold;">
                    <th style="padding: 12px; text-align: left;">名称</th>
                    <th style="padding: 12px; text-align: left;">值</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;

    const minimizeBall = document.createElement('div');
    minimizeBall.id = 'minimize-ball';
    minimizeBall.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        background: #6e7f86;
        border-radius: 50%;
        z-index: 99999;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        will-change: transform;
    `;
    minimizeBall.textContent = 'P';

    let ballDragging = false, bOffX = 0, bOffY = 0;
    let ballLastLeft = 100, ballLastTop = 100;

    function toggleMinimize() {
        isMinimized = !isMinimized;
        if (isMinimized) {
            const r = panel.getBoundingClientRect();
            minimizeBall.style.display = 'flex';
            setPos(minimizeBall, r.left + r.width - 40, r.top);
            ballLastLeft = r.left + r.width - 40;
            ballLastTop = r.top;
            panel.style.opacity = '0';
            panel.style.transform = 'scale(0.5)';
            panel.style.pointerEvents = 'none';
            setTimeout(() => panel.style.display = 'none', 300);
        } else {
            panel.style.display = 'block';
            panel.style.opacity = '1';
            panel.style.transform = 'scale(1)';
            panel.style.pointerEvents = 'auto';
            setPos(panel,
                clamp(ballLastLeft - 250, 0, window.innerWidth - 300),
                clamp(ballLastTop, 0, window.innerHeight - 400)
            );
            minimizeBall.style.display = 'none';
        }
    }

    panel.querySelector('#minimize-btn').addEventListener('click', toggleMinimize);
    minimizeBall.addEventListener('click', toggleMinimize);

    const dragBar = panel.querySelector('#drag-bar');
    let isDragging = false, offsetX = 0, offsetY = 0;
    dragBar.addEventListener('mousedown', (e) => {
        if (e.target.id === 'minimize-btn') return;
        isDragging = true;
        const rect = panel.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        panel.style.userSelect = 'none';
        panel.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        requestAnimationFrame(() => {
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
        });
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        panel.style.userSelect = '';
        panel.style.cursor = '';
    });

    minimizeBall.addEventListener('mousedown', (e) => {
        ballDragging = true;
        bOffX = e.clientX - minimizeBall.offsetLeft;
        bOffY = e.clientY - minimizeBall.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
        if (!ballDragging) return;
        requestAnimationFrame(() => {
            const newL = clamp(e.clientX - bOffX, 0, window.innerWidth - 40);
            const newT = clamp(e.clientY - bOffY, 0, window.innerHeight - 40);
            setPos(minimizeBall, newL, newT);
            ballLastLeft = newL;
            ballLastTop = newT;
        });
    });
    document.addEventListener('mouseup', () => { ballDragging = false; });

    const waitForBody = setInterval(() => {
        if (document.body) {
            document.body.appendChild(panel);
            document.body.appendChild(minimizeBall);
            clearInterval(waitForBody);
        }
    }, 50);

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (typeof url === 'string' && url.includes('/service/api/case/summary')) {
            this.addEventListener('load', function () {
                try {
                    const res = JSON.parse(this.responseText);
                    globalInfos = res?.data?.defaultLabelInfos || [];
                    if (!initialized) {
                        initCheckboxes(globalInfos);
                        initialized = true;
                    }
                    updateTableFromChecked();
                } catch (e) {
                    console.error('[XHR JSON 解析错误]', e);
                }
            });
        }
        return originalOpen.apply(this, arguments);
    };

    function initCheckboxes(infos) {
        const container = document.getElementById('checkbox-container');
        container.innerHTML = '';
        infos.forEach((info, idx) => {
            const name = info?.summary?.name ?? `未命名-${idx}`;
            const id = `chk-${Math.random().toString(36).slice(2)}`;
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '8px';
            label.style.fontSize = '14px';
            label.innerHTML = `<input type="checkbox" id="${id}" value="${name}" style="margin-right: 8px;"> ${name}`;
            container.appendChild(label);
            const input = label.querySelector('input');
            input.addEventListener('change', () => {
                if (isSyncing) return;
                isSyncing = true;
                document.querySelectorAll('.bl-checkbox').forEach(el => {
                    const textEl = el.querySelector('.update-name');
                    const checkboxEl = el.querySelector('input[type=checkbox]');
                    if (textEl?.innerText.trim() === name && checkboxEl) {
                        checkboxEl.checked = input.checked;
                        checkboxEl.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
                updateTableFromChecked();
                isSyncing = false;
            });
        });

        document.querySelectorAll('.bl-checkbox').forEach(el => {
            const textEl = el.querySelector('.update-name');
            const checkboxEl = el.querySelector('input[type=checkbox]');
            if (textEl && checkboxEl && !checkboxEl.dataset.synced) {
                const name = textEl.innerText.trim();
                checkboxEl.addEventListener('change', () => {
                    if (isSyncing) return;
                    isSyncing = true;
                    const floatingBox = container.querySelector(`input[value="${name}"]`);
                    if (floatingBox && floatingBox.checked !== checkboxEl.checked) {
                        floatingBox.checked = checkboxEl.checked;
                        updateTableFromChecked();
                    }
                    isSyncing = false;
                });
                checkboxEl.dataset.synced = 'true';
            }
        });
    }

    function updateTableFromChecked() {
        const tbody = panel.querySelector('#data-table tbody');
        tbody.innerHTML = '';
        const container = document.getElementById('checkbox-container');
        const checkedNames = Array.from(container.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
        const selectedInfos = globalInfos.filter(info => checkedNames.includes(info.summary?.name));
        const aggregated = {};
        selectedInfos.forEach(info => {
            const data = info?.data || {};
            Object.entries(config_json).forEach(([key, label]) => {
                if (data[key] !== undefined) {
                    aggregated[label] = (aggregated[label] || 0) + data[key];
                }
            });
        });
        Object.entries(aggregated).forEach(([label, val]) => {
            const tr = document.createElement('tr');
            const tdLabel = document.createElement('td');
            const tdValue = document.createElement('td');
            tdLabel.textContent = label;
            tdValue.textContent = val;
            tdValue.addEventListener('click', () => GM_setClipboard(val));
            tr.appendChild(tdLabel);
            tr.appendChild(tdValue);
            tbody.appendChild(tr);
        });
        const tr = document.createElement('tr');
        const tdLabel = document.createElement('td');
        const tdValue = document.createElement('td');
        tdLabel.textContent = 'Perfdog链接';
        tdValue.textContent = window.location.href;
        tdValue.style.maxWidth = '50px';
        tdValue.style.overflow = 'hidden';
        tdValue.style.whiteSpace = 'nowrap';
        tdValue.style.textOverflow = 'ellipsis';
        tdValue.addEventListener('click', () => GM_setClipboard(window.location.href));
        tr.appendChild(tdLabel);
        tr.appendChild(tdValue);
        tbody.appendChild(tr);
    }

    function clickAllCheckboxIfChecked() {
        const labels = document.querySelectorAll('.bl-checkbox');
        for (const label of labels) {
            const textSpan = label.querySelector('.bl-checkbox__text');
            if (textSpan && textSpan.textContent.trim() === 'All') {
                const input = label.querySelector('input[type="checkbox"]');
                if (input && input.checked) input.click();
                return true;
            }
        }
        return false;
    }

    let timer = setInterval(() => {
        if (clickAllCheckboxIfChecked()) clearInterval(timer);
    }, 300);
    setTimeout(() => clearInterval(timer), 10000);
})();
