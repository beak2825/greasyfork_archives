// ==UserScript==
// @name         HQU 华侨大学选课脚本
// @namespace    Violentmonkey Scripts
// @version      2025-09-14 
// @description  华侨大学选课助手：自动展开课程详情、识别课程+教学班、优先级抢课、通知提示（鲁棒版）
// @author       qimubanben
// @match        *://xk.hqu.edu.cn/xsxk/elective/grablessons*
// @match        *://xk.hqu.edu.cn/xsxk/profile/index.html
// @match        *://xk.hqu.edu.cn/xsxk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hqu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549492/HQU%20%E5%8D%8E%E4%BE%A8%E5%A4%A7%E5%AD%A6%E9%80%89%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549492/HQU%20%E5%8D%8E%E4%BE%A8%E5%A4%A7%E5%AD%A6%E9%80%89%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------------- 状态 ---------------- */
    let allClasses = [];           // 全局教学班数组（扁平）
    let monitorInterval = null;
    let monitoringMap = {};        // id -> classObj
    let uiReady = false;
    let isSidebarMinimized = false;

    /* ------------- UI 初始化 ------------- */
    function initUI() {
        if (document.getElementById('hqu-course-sidebar')) return;

        const sidebar = document.createElement('div');
        sidebar.id = 'hqu-course-sidebar';
        sidebar.innerHTML = `
            <div id="hqu-sidebar-header" style="display:flex;justify-content:space-between;align-items:center;cursor:move;">
                <h2 style="margin:0;">抢课助手</h2>
                <div>
                    <button id="hqu-minimize-btn" style="background:none;border:none;font-size:16px;cursor:pointer;">−</button>
                    <button id="hqu-close-btn" style="background:none;border:none;font-size:16px;cursor:pointer;">×</button>
                </div>
            </div>
            <div id="hqu-sidebar-content">
                <div style="display:flex;gap:6px;margin-top:10px;">
                    <button id="hqu-detect-btn">检测课程</button>
                    <button id="hqu-start-btn">开始监控</button>
                    <button id="hqu-stop-btn">停止监控</button>
                </div>
                <div style="margin-top:8px;font-size:12px;color:#555">注意：脚本会尝试自动展开"课程详情"以检测教学班</div>
                <hr>
                <div id="hqu-course-list" style="max-height:360px;overflow:auto;"></div>
                <hr>
                <div id="hqu-log" style="max-height:160px;overflow:auto;font-size:12px;"></div>
                <div style="margin-top:6px">
                    <label><input id="hqu-sound-toggle" type="checkbox" checked> 声音提示</label>
                </div>
            </div>
        `;
        document.body.appendChild(sidebar);

        // 创建最小化时的浮动按钮
        const floatBtn = document.createElement('div');
        floatBtn.id = 'hqu-float-btn';
        floatBtn.innerHTML = '抢课';
        floatBtn.style.display = 'none';
        document.body.appendChild(floatBtn);

        const style = document.createElement('style');
        style.textContent = `
            #hqu-course-sidebar {
                position: fixed;
                top: 40px;
                right: 10px;
                width: 380px;
                height: 84vh;
                background: #fff;
                border: 1px solid #ccc;
                z-index: 2147483647 !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                padding: 10px;
                font-family: Arial, sans-serif;
                font-size: 13px;
                resize: both;
                overflow: auto;
            }
            #hqu-sidebar-header {
                background: #f0f0f0;
                padding: 5px;
                margin: -10px -10px 10px -10px;
                border-bottom: 1px solid #ccc;
            }
            #hqu-float-btn {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                background: #e60012;
                color: white;
                padding: 10px 5px;
                border-radius: 5px 0 0 5px;
                cursor: pointer;
                z-index: 2147483646;
                box-shadow: -2px 0 5px rgba(0,0,0,0.2);
                font-weight: bold;
                writing-mode: vertical-rl;
                text-orientation: mixed;
            }
            #hqu-float-btn:hover {
                background: #ff3333;
            }
            #hqu-course-sidebar h2 { margin: 0; font-size: 16px; }
            #hqu-course-sidebar button { padding:6px 8px; font-size:13px; cursor:pointer; }
            .hqu-class-entry { padding:6px; border-radius:6px; margin:6px 0; background:#fafafa; border:1px solid #eee; }
            .hqu-class-entry.selected { background:#eafaf0; border-color:#cdebd4; }
            .hqu-log-line { margin:4px 0; }
            .hqu-success { color:#198754; }
            .hqu-warn { color:#f59e0b; }
            .hqu-error { color:#dc3545; }
        `;
        document.head.appendChild(style);

        // 绑定按钮事件
        document.getElementById('hqu-detect-btn').addEventListener('click', () => {
            detectAndRender(true);
        });
        document.getElementById('hqu-start-btn').addEventListener('click', startMonitoring);
        document.getElementById('hqu-stop-btn').addEventListener('click', stopMonitoring);

        // 最小化和关闭按钮
        document.getElementById('hqu-minimize-btn').addEventListener('click', toggleSidebar);
        document.getElementById('hqu-close-btn').addEventListener('click', () => {
            document.body.removeChild(sidebar);
            document.body.removeChild(floatBtn);
        });

        // 浮动按钮点击事件
        floatBtn.addEventListener('click', toggleSidebar);

        // 实现拖拽功能
        makeDraggable(sidebar, document.getElementById('hqu-sidebar-header'));

        uiReady = true;
        log('侧边栏已加载', 'info');

        // 自动首次检测（给页面一点渲染时间）
        setTimeout(() => detectAndRender(true), 1200);
    }

    // 侧边栏最小化/恢复功能
    function toggleSidebar() {
        const sidebar = document.getElementById('hqu-course-sidebar');
        const floatBtn = document.getElementById('hqu-float-btn');

        if (isSidebarMinimized) {
            // 恢复侧边栏
            sidebar.style.display = 'block';
            floatBtn.style.display = 'none';
            isSidebarMinimized = false;
        } else {
            // 最小化侧边栏
            sidebar.style.display = 'none';
            floatBtn.style.display = 'block';
            isSidebarMinimized = true;
        }
    }

    // 实现元素可拖动
    function makeDraggable(element, dragHandle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标初始位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 鼠标移动时调用elementDrag函数
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // 停止移动
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    /* ------------- 日志 & 提示 ------------- */
    function log(msg, level = 'info') {
        const logDiv = document.getElementById('hqu-log');
        if (!logDiv) return console.log(msg);
        const line = document.createElement('div');
        line.className = 'hqu-log-line';
        if (level === 'success') line.classList.add('hqu-success');
        if (level === 'warn') line.classList.add('hqu-warn');
        if (level === 'error') line.classList.add('hqu-error');
        line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        logDiv.prepend(line);
        // 保持日志区域不会无限增长
        if (logDiv.children.length > 50) {
            logDiv.removeChild(logDiv.lastChild);
        }
    }

    function notifyUser(title, body) {
        // 浏览器通知（非必须）
        try {
            if (window.Notification && Notification.permission === 'granted') {
                new Notification(title, { body });
            } else if (window.Notification && Notification.permission !== 'denied') {
                Notification.requestPermission().then(p => {
                    if (p === 'granted') new Notification(title, { body });
                });
            }
        } catch (e) {
            console.warn('通知失败', e);
        }

        // 声音（可控）
        try {
            if (document.getElementById('hqu-sound-toggle')?.checked) {
                const a = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
                a.volume = 0.3;
                a.play().catch(()=>{});
            }
        } catch (e) {}
    }

    /* ------------- 辅助：尝试展开课程详情 ------------- */
    function clickCourseDetailsLinks() {
        // 页面里通常有 "课程详情" 的链接，优先点击它们以展开课程、加载教学班
        const links = Array.from(document.querySelectorAll('a,button'));
        let cnt = 0;
        links.forEach(el => {
            const txt = (el.textContent || '').trim();
            if (txt.includes('课程详情') || txt.includes('教学班详情')) {
                try {
                    el.click();
                    cnt++;
                } catch (e) {}
            }
        });

        // 有些页面用折叠面板 header 展开
        const headers = document.querySelectorAll('.el-collapse-item__header');
        headers.forEach(h => {
            try {
                // 只点击未展开的
                if (!h.classList.contains('is-active')) {
                    h.click();
                    cnt++;
                }
            } catch(e){}
        });

        log(`尝试自动展开课程详情：点击 ${cnt} 个可能的展开项`, 'info');
        return cnt;
    }

    /* ------------- 解析课程/教学班 ------------- */

    function getTextTrim(el) {
        return el ? (el.textContent || '').trim() : '';
    }

    // 从一个可能的 courseBody DOM 节点解析课程信息
    function parseCourseInfoFromBody(courseBody) {
        if (!courseBody) return null;
        const labels = courseBody.querySelectorAll('.card-item .label.cv-pull-left');
        function getValue(label) {
            for (const lab of labels) {
                if ((lab.textContent || '').includes(label)) {
                    const next = lab.parentElement.querySelector('.value');
                    if (next) return getTextTrim(next);
                }
            }
            return '';
        }
        return {
            id: getValue('课程号'),
            name: getValue('课程名称'),
            classCount: getValue('教学班个数'),
            category: getValue('课程类别'),
            credit: getValue('学分'),
            rawElement: courseBody
        };
    }

    // 在祖先链或前面同级查找最近的课程体（用于将教学班匹配到课程）
    function findNearestCourseBody(node) {
        let cur = node;
        for (let i = 0; i < 12 && cur; i++) {
            // 向上查找包含课程号/课程名标识的节点
            if (cur.querySelector && cur.querySelector('.value.cv-pull-left.has-choosed-course')) {
                return cur;
            }
            // 向前找同级元素
            if (cur.previousElementSibling) {
                cur = cur.previousElementSibling;
                if (cur.querySelector && cur.querySelector('.value.cv-pull-left.has-choosed-course')) return cur;
            } else {
                cur = cur.parentElement;
            }
        }
        return null;
    }

    // 抓取页面所有教学班（全局扁平）
    function extractAllClassCards() {
        const selectors = [
            '.card-list.course-jxb .el-card.jxb-card .el-card__body',
            '.card-list.course-jxb .el-card__body',
            '.el-card.jxb-card .el-card__body',
            '.card-item.head' // fallback：直接以 head 节点为基础处理
        ];
        const nodes = new Set();
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(n => nodes.add(n));
        });

        const classes = [];
        let idx = 0;
        nodes.forEach(node => {
            // 如果 selector 匹到 .card-item.head，本身可能不是 el-card__body
            let parentCard = node;
            if (node.classList && node.classList.contains('card-item') && node.classList.contains('head')) {
                // 找到包含它的 el-card__body
                const p = node.closest('.el-card__body');
                if (p) parentCard = p;
            }

            // 教师/标题通常在 .card-item.head .one-row span 或 head.textContent
            const headEl = parentCard.querySelector('.card-item.head');
            const title = headEl ? getTextTrim(headEl) : getTextTrim(parentCard.querySelector('.one-row')) || getTextTrim(parentCard.querySelector('div[title]')) || '';

            // 时间/地点通常在第二个 card-item
            const timePlace = parentCard.querySelector('.card-item:nth-child(2)') ? getTextTrim(parentCard.querySelector('.card-item:nth-child(2)')) : '';

            // 容量
            const capacityEl = parentCard.querySelector('.card-item .value') || parentCard.querySelector('.cv-pull-left .value');
            const capacity = capacityEl ? getTextTrim(capacityEl) : '';

            // 已选人数
            const selectedSpan = parentCard.querySelector('.card-item span');
            const selectedCount = selectedSpan ? getTextTrim(selectedSpan) : '';

            // 找按钮（选择 / 退选）
            let selectBtn = null;
            let isSelected = false;
            parentCard.querySelectorAll('button').forEach(btn => {
                const t = (btn.textContent || '').trim();
                if (!selectBtn && (t.includes('选择') || t.includes('选课'))) selectBtn = btn;
                if (t.includes('退选') || t.includes('已选')) { selectBtn = btn; isSelected = true; }
            });

            // 试着找到最近的课程 body 用于关联课程名
            const nearestCourseBody = findNearestCourseBody(parentCard);
            const courseInfo = nearestCourseBody ? parseCourseInfoFromBody(nearestCourseBody) : null;
            const courseName = courseInfo ? courseInfo.name : '';

            idx++;
            classes.push({
                _idx: idx,
                id: `${courseInfo?.id || 'unknown'}-${idx}`,
                courseId: courseInfo?.id || '',
                courseName: courseName || '（未绑定课程）',
                title: title || ('教学班' + idx),
                details: `${timePlace} ${capacity ? '| ' + capacity : ''} ${selectedCount ? '| ' + selectedCount : ''}`.trim(),
                isSelected,
                button: selectBtn,
                el: parentCard,
                priority: 999
            });
        });

        return classes;
    }

    /* ------------- 检测并渲染 ------------- */
    async function detectAndRender(forceExpand = false) {
        if (!uiReady) initUI();

        log('开始检测课程/教学班...', 'info');

        // 首先尝试点击页面上的"课程详情"等展开项（若需要）
        if (forceExpand) {
            clickCourseDetailsLinks();
            // 等待一段时间，给页面加载展开内容
            await new Promise(r => setTimeout(r, 700));
        }

        // 使用 MutationObserver 监听短时间内的新增节点（若页面还在异步渲染）
        const found = await new Promise((resolve) => {
            let timeoutId = null;
            const observer = new MutationObserver((mutList) => {
                // 只要检测到可能的 class-list 就认为可用
                const possible = document.querySelectorAll('.card-list.course-jxb .el-card__body, .el-card.jxb-card .el-card__body, .card-item.head');
                if (possible.length > 0) {
                    clearTimeout(timeoutId);
                    observer.disconnect();
                    resolve(true);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            // 超时后直接继续（不阻塞太久）
            timeoutId = setTimeout(() => { observer.disconnect(); resolve(false); }, 1100);
        });

        if (!found) {
            // 再次尝试点击 "课程详情" 更彻底一点
            clickCourseDetailsLinks();
            await new Promise(r => setTimeout(r, 800));
        }

        // 最后直接抓取所有教学班
        allClasses = extractAllClassCards();

        // 渲染侧边栏
        renderClassList();

        log(`检测完成：找到 ${allClasses.length} 个教学班`, 'success');

        return allClasses.length;
    }

    /* ------------- 渲染侧边栏列表 ------------- */
    function renderClassList() {
        const listDiv = document.getElementById('hqu-course-list');
        listDiv.innerHTML = '';

        if (!allClasses || allClasses.length === 0) {
            listDiv.innerHTML = '<div style="color:#666">未找到教学班（可尝试先点击页面的某门课程以展开其教学班，或点击上方"检测课程"）</div>';
            return;
        }

        // 将同一课程的教学班归组展示
        const grouped = {};
        allClasses.forEach(cls => {
            const key = cls.courseName || '（未绑定课程）';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(cls);
        });

        Object.keys(grouped).forEach(courseName => {
            const header = document.createElement('div');
            header.style.fontWeight = '600';
            header.style.marginTop = '6px';
            header.textContent = courseName;
            listDiv.appendChild(header);

            grouped[courseName].forEach(cls => {
                const div = document.createElement('div');
                div.className = 'hqu-class-entry';
                div.id = `hqu-class-${cls._idx}`;
                div.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div style="flex:1">
                            <div style="font-weight:600">${cls.title}</div>
                            <div style="font-size:12px;color:#666">${cls.details}</div>
                        </div>
                        <div style="text-align:right">
                            <div style="margin-bottom:6px">
                                <label><input type="checkbox" class="hqu-class-checkbox" data-id="${cls._idx}"> 监控</label>
                            </div>
                            <div>
                                优先级 <input class="hqu-priority-input" data-id="${cls._idx}" type="number" value="${cls.priority}" min="1" style="width:52px;">
                            </div>
                        </div>
                    </div>
                `;
                listDiv.appendChild(div);
            });
        });
    }

    /* ------------- 监控/抢课 ------------- */
    function startMonitoring() {
        // 读用户勾选
        monitoringMap = {};
        const cbs = Array.from(document.querySelectorAll('.hqu-class-checkbox:checked'));
        if (cbs.length === 0) {
            log('未选择任何教学班进行监控', 'warn');
            return;
        }
        cbs.forEach(cb => {
            const id = Number(cb.dataset.id);
            const cls = allClasses.find(x => x._idx === id);
            if (!cls) return;
            const prInput = document.querySelector(`.hqu-priority-input[data-id="${id}"]`);
            if (prInput) cls.priority = parseInt(prInput.value) || 999;
            monitoringMap[cls.id] = cls;
        });

        const total = Object.keys(monitoringMap).length;
        if (total === 0) {
            log('未找到可监控的教学班', 'warn');
            return;
        }

        // 启动定时器
        if (monitorInterval) clearInterval(monitorInterval);
        monitorInterval = setInterval(monitorOnce, 2000);
        log(`开始监控 ${total} 个教学班（每 2s 尝试）`, 'success');
    }

    function stopMonitoring() {
        if (monitorInterval) {
            clearInterval(monitorInterval);
            monitorInterval = null;
            log('已停止监控', 'info');
        } else {
            log('当前没有在监控', 'info');
        }
    }

    function monitorOnce() {
        // 保证最新的按钮引用（页面可能在变）
        // 重新刷新 allClasses 中的 button 引用（尝试从 DOM 重新获取）
        allClasses.forEach(cls => {
            try {
                // 如果已保存 el，重查该 el 下的按钮
                if (cls.el) {
                    let btn = null;
                    cls.el.querySelectorAll('button').forEach(b => {
                        const t = (b.textContent || '').trim();
                        if (!btn && (t.includes('选择') || t.includes('选课'))) btn = b;
                        if (t.includes('退选') || t.includes('已选')) { btn = b; cls.isSelected = true; }
                    });
                    if (btn) cls.button = btn;
                }
            } catch (e) {}
        });

        // 按优先级排序后尝试一次点击
        const candidates = Object.values(monitoringMap).sort((a, b) => a.priority - b.priority);

        for (const cls of candidates) {
            try {
                if (!cls.button) {
                    // 若没有按钮，尝试展开并重新检测
                    continue;
                }

                const text = (cls.button.textContent || '').trim();
                if (text.includes('选择') || text.includes('选课')) {
                    cls.button.click();
                    log(`尝试选择（优先级 ${cls.priority}）: ${cls.courseName} - ${cls.title}`, 'success');
                    notifyUser('尝试抢课', `${cls.courseName} - ${cls.title}`);
                    // 点击一次后本轮停止（避免点太快），下一轮继续
                    break;
                } else if (cls.isSelected || text.includes('退选') || text.includes('已选')) {
                    log(`检测到已选：${cls.courseName} - ${cls.title}`, 'success');
                    notifyUser('选课成功', `${cls.courseName} - ${cls.title}`);
                    // 从监控列表移除
                    delete monitoringMap[cls.id];
                } else {
                    // 未找到明确按钮文字，跳过
                }
            } catch (e) {
                log(`监控出错：${cls.courseName} - ${cls.title} (${e.message})`, 'error');
            }
        }

        // 如果监控项已空，停止定时器
        if (Object.keys(monitoringMap).length === 0) {
            log('所有监控项已完成或被移除，停止监控', 'info');
            stopMonitoring();
        }
    }

    /* ------------- 自动挂载 & 监控 DOM ------------- */
    // 尝试多入口插入 UI（应对 SPA / 早期注入）
    function tryInitUISoon() {
        if (document.getElementById('hqu-course-sidebar')) return;
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initUI();
        } else {
            document.addEventListener('DOMContentLoaded', () => setTimeout(initUI, 400));
        }
        // 额外保险：window.load 也再尝试一次
        window.addEventListener('load', () => setTimeout(initUI, 800));
    }

    // 监控 DOM，如果检测到新的课程卡片就自动触发一次检测
    function watchForCourseArea() {
        const observer = new MutationObserver((muts) => {
            const found = document.querySelectorAll('.card-list.course-jxb .el-card__body, .el-card.jxb-card .el-card__body, .card-item.head');
            if (found.length > 0 && uiReady) {
                // 自动刷新一次检测（节流：只每 3s 最多一次）
                const last = window.__hqu_last_auto_detect || 0;
                if (Date.now() - last > 3000) {
                    window.__hqu_last_auto_detect = Date.now();
                    detectAndRender(false);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ------------- 启动脚本 ------------- */
    tryInitUISoon();
    watchForCourseArea();

    // 暴露到 console 方便手动调试
    window.HQU_GRAB = {
        detect: () => detectAndRender(true),
        start: startMonitoring,
        stop: stopMonitoring,
        getClasses: () => allClasses
    };
})();
