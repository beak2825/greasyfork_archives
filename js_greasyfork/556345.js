// ==UserScript==
// @name         湖南干部教育-自动刷文本(文案优化版)
// @namespace    http://tampermonkey.net/
// @version      0.0.8
// @description  自动刷文本课。
// @author       cc
// @license      MIT
// @match        https://0734.hngbjy.cn/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hngbjy.cn
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/556345/%E6%B9%96%E5%8D%97%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2-%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%87%E6%9C%AC%28%E6%96%87%E6%A1%88%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556345/%E6%B9%96%E5%8D%97%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2-%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%87%E6%9C%AC%28%E6%96%87%E6%A1%88%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= ⚙️ 参数配置 =================
    const READ_WAIT_TIME = 2;      // 读完后等待时间 (秒)
    const CENTER_COOL_DOWN = 1;    // 列表页间隔 (秒)
    const PAGE_FLIP_DELAY = 200;   // 翻页动作延迟 (毫秒)
    const LOGIN_CHECK_INTERVAL = 10000;
    // ==============================================

    const KEY_PAGE = 'auto_learner_page_v1';
    const KEY_UI_STATE = 'auto_learner_ui_state_v1';
    const KEY_IS_RUNNING = 'auto_learner_is_running';

    let statusText = null;
    let toggleBtn = null;
    let panelContainer = null;
    let lastUrl = window.location.href;
    let lastLoginCheckTime = 0;

    let isRuningCenter = false;
    let isRuningCourse = false;

    let isScriptEnabled = localStorage.getItem(KEY_IS_RUNNING) === 'true';
    let glassShaderInstance = null;

    let uiState = {
        left: window.innerWidth - 260,
        top: 100,
        isCollapsed: false
    };

    try {
        const saved = localStorage.getItem(KEY_UI_STATE);
        if (saved) {
            uiState = JSON.parse(saved);
            if (uiState.left > window.innerWidth - 50) uiState.left = window.innerWidth - 240;
            if (uiState.top > window.innerHeight - 50) uiState.top = 100;
        }
    } catch(e) {}

    // ============================================================
    // 🛡️ 核心修复：强力阻止页面关闭
    // ============================================================
    function preventWindowClose() {
        const doNothing = function() {
            console.log('🛡️ 脚本拦截：网站尝试关闭页面，已阻止。');
            updateStatus('已拦截网页自动关闭', '#ff00ff');
            return false;
        };
        try {
            window.close = doNothing;
            if (typeof unsafeWindow !== 'undefined') {
                unsafeWindow.close = doNothing;
                unsafeWindow.Window.prototype.close = doNothing;
            }
        } catch (e) {}
    }

    // ============================================================
    // 🧪 Liquid Glass Core (UI渲染)
    // ============================================================
    const LiquidGlass = {
        smoothStep: (a, b, t) => {
            t = Math.max(0, Math.min(1, (t - a) / (b - a)));
            return t * t * (3 - 2 * t);
        },
        length: (x, y) => Math.sqrt(x * x + y * y),
        roundedRectSDF: (x, y, width, height, radius) => {
            const qx = Math.abs(x) - width + radius;
            const qy = Math.abs(y) - height + radius;
            return Math.min(Math.max(qx, qy), 0) + Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) - radius;
        },
        texture: (x, y) => ({ type: 't', x, y }),
        generateId: () => 'liquid-' + Math.random().toString(36).substr(2, 9),

        Shader: class {
            constructor(element, options = {}) {
                this.element = element;
                this.width = options.width || 220;
                this.height = options.height || 170;
                this.canvasDPI = 0.5;
                this.id = LiquidGlass.generateId();
                this.mouse = { x: 0.5, y: 0.5 };
                this.isPaused = false;

                this.fragment = (uv, mouse) => {
                    const ix = uv.x - 0.5;
                    const iy = uv.y - 0.5;
                    const distanceToEdge = LiquidGlass.roundedRectSDF(ix, iy, 0.45, 0.45, 0.1);
                    const distToMouse = LiquidGlass.length(uv.x - mouse.x, uv.y - mouse.y);
                    const mouseInfluence = LiquidGlass.smoothStep(0.3, 0, distToMouse) * 0.1;
                    const displacement = LiquidGlass.smoothStep(0.6, 0, distanceToEdge - 0.05);
                    const scaled = LiquidGlass.smoothStep(0, 1, displacement + mouseInfluence);
                    return LiquidGlass.texture(ix * scaled + 0.5, iy * scaled + 0.5);
                };

                this.initSVG();
                this.setupEvents();
                this.updateShader();
            }

            initSVG() {
                this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                this.svg.style.cssText = 'position:fixed; top:0; left:0; width:0; height:0; pointer-events:none; z-index:-1;';
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                this.filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                this.filter.setAttribute('id', `${this.id}_filter`);
                this.filter.setAttribute('filterUnits', 'userSpaceOnUse');
                this.filter.setAttribute('x', '0'); this.filter.setAttribute('y', '0');
                this.filter.setAttribute('width', this.width); this.filter.setAttribute('height', this.height);
                this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
                this.feImage.setAttribute('id', `${this.id}_map`);
                this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
                this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
                this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
                this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
                this.feDisplacementMap.setAttribute('scale', '20');
                this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
                this.feDisplacementMap.setAttribute('yChannelSelector', 'G');
                this.filter.appendChild(this.feImage);
                this.filter.appendChild(this.feDisplacementMap);
                defs.appendChild(this.filter);
                this.svg.appendChild(defs);
                document.body.appendChild(this.svg);
                this.canvas = document.createElement('canvas');
                this.canvas.width = this.width * this.canvasDPI;
                this.canvas.height = this.height * this.canvasDPI;
                this.context = this.canvas.getContext('2d');
                this.applyFilter();
            }

            applyFilter() {
                const style = `url(#${this.id}_filter) blur(5px) brightness(1.1) saturate(1.3) contrast(1.1)`;
                this.element.style.backdropFilter = style;
                this.element.style.webkitBackdropFilter = style;
            }

            removeFilter() {
                this.element.style.backdropFilter = 'none';
                this.element.style.webkitBackdropFilter = 'none';
            }

            setPaused(paused) {
                this.isPaused = paused;
                if (paused) { this.removeFilter(); } else { this.applyFilter(); this.updateShader(); }
            }

            resize(w, h) {
                this.width = w;
                this.height = h;
                this.canvas.width = w * this.canvasDPI;
                this.canvas.height = h * this.canvasDPI;
                this.filter.setAttribute('width', w);
                this.filter.setAttribute('height', h);
                if (!this.isPaused) this.updateShader();
            }

            setupEvents() {
                document.addEventListener('mousemove', (e) => {
                    if (this.isPaused) return;
                    const rect = this.element.getBoundingClientRect();
                    this.mouse.x = (e.clientX - rect.left) / rect.width;
                    this.mouse.y = (e.clientY - rect.top) / rect.height;
                    if (this.mouse.x > -0.5 && this.mouse.x < 1.5 && this.mouse.y > -0.5 && this.mouse.y < 1.5) {
                         requestAnimationFrame(() => this.updateShader());
                    }
                });
            }

            updateShader() {
                if (this.isPaused) return;
                const w = this.width * this.canvasDPI;
                const h = this.height * this.canvasDPI;
                const imageData = this.context.createImageData(w, h);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const pixelIndex = i / 4;
                    const x = pixelIndex % w;
                    const y = Math.floor(pixelIndex / w);
                    const uv = { x: x / w, y: y / h };
                    const pos = this.fragment(uv, this.mouse);
                    const dx = (pos.x * w - x);
                    const dy = (pos.y * h - y);
                    data[i] = (dx / 20 + 0.5) * 255;
                    data[i + 1] = (dy / 20 + 0.5) * 255;
                    data[i + 2] = 0;
                    data[i + 3] = 255;
                }
                this.context.putImageData(imageData, 0, 0);
                this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());
            }
        }
    };

    // ================= 🛠️ UI 逻辑 =================

    function saveUIState() { localStorage.setItem(KEY_UI_STATE, JSON.stringify(uiState)); }

    function updateButtonState() {
        if (!toggleBtn) return;
        if (isScriptEnabled) {
            toggleBtn.innerHTML = '<span>⏹️</span> 暂停脚本';
            toggleBtn.style.background = "linear-gradient(135deg, rgba(255, 68, 68, 0.7), rgba(200, 30, 30, 0.8))";
        } else {
            toggleBtn.innerHTML = '<span>▶️</span> 开始运行';
            toggleBtn.style.background = "linear-gradient(135deg, rgba(40, 167, 69, 0.7), rgba(30, 130, 50, 0.8))";
        }
    }

    function forceStopScript(reason) {
        if (isScriptEnabled) {
            isScriptEnabled = false;
            localStorage.setItem(KEY_IS_RUNNING, 'false');
            updateButtonState();
        }
        updateStatus(reason, "#ff4444");
    }

    async function checkLoginStatus() {
        try {
            const res = await fetch('/api/Page/Authorization', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Accept': 'application/json, text/plain, */*' },
                body: 'controller=Do&action=rankcourseclick'
            });
            const json = await res.json();
            return json && json.isauth === true;
        } catch (e) { return true; }
    }

    function initPanel() {
        if (document.getElementById('ai-helper-panel')) return;
        panelContainer = document.createElement('div');
        panelContainer.id = 'ai-helper-panel';

        const fullWidth = 240; const fullHeight = 170; const miniSize = 50;
        const width = uiState.isCollapsed ? miniSize : fullWidth;
        const height = uiState.isCollapsed ? miniSize : fullHeight;
        const glassStyle = `background-color: rgba(15, 15, 15, 0.3); box-shadow: inset 0 0 20px rgba(255,255,255,0.15), 0 15px 35px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);`;

        panelContainer.style.cssText = `position: fixed; top: ${uiState.top}px; left: ${uiState.left}px; z-index: 2147483647; width: ${width}px; height: ${height}px; padding: 0; ${glassStyle} border-radius: 24px; color: #e0ffe0; font-family: "Segoe UI", "Microsoft YaHei", sans-serif; font-size: 13px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); overflow: hidden; user-select: none; will-change: left, top, width, height;`;

        const contentHTML = `
            <div id="ai-drag-header" style="height: 36px; cursor: grab; display: flex; justify-content: space-between; align-items: center; padding: 0 16px; border-bottom: 1px solid rgba(255,255,255,0.08); background: linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%);">
                <span id="ai-title" style="font-weight: 700; letter-spacing: 1px; background: linear-gradient(to right, #fff, #aaffaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; ${uiState.isCollapsed ? 'display:none' : ''}">AI 刷课助手</span>
                <span id="ai-min-icon" style="cursor: pointer; font-size: 18px; opacity: 0.8; transition: opacity 0.2s;">${uiState.isCollapsed ? '' : '−'}</span>
            </div>
            <div id="ai-content-body" style="padding: 16px; display: flex; flex-direction: column; gap: 12px; ${uiState.isCollapsed ? 'display:none' : ''}">
                <div style="background: rgba(0, 0, 0, 0.4); border-radius: 12px; padding: 10px 12px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 8px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);">
                    <span style="font-size: 14px;">📡</span>
                    <div id="ai-status-text" style="font-family: 'Consolas', 'Monaco', monospace; font-size: 12px; color: #8af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">待命中...</div>
                </div>
                <button id="ai-toggle-btn" style="width: 100%; height: 38px; cursor: pointer; border: none; border-radius: 20px; background: transparent; color: white; font-weight: 600; font-size: 13px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.1s, box-shadow 0.2s, background 0.3s; display: flex; justify-content: center; align-items: center; gap: 6px;">初始化</button>
            </div>
            <div id="ai-collapsed-view" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; font-size: 24px; cursor: pointer; ${!uiState.isCollapsed ? 'display:none' : ''}">🤖</div>
        `;

        panelContainer.innerHTML = contentHTML;
        document.body.appendChild(panelContainer);
        glassShaderInstance = new LiquidGlass.Shader(panelContainer, { width: width, height: height });
        statusText = document.getElementById('ai-status-text');
        toggleBtn = document.getElementById('ai-toggle-btn');
        const header = document.getElementById('ai-drag-header');
        const minIcon = document.getElementById('ai-min-icon');
        const collapsedView = document.getElementById('ai-collapsed-view');
        const contentBody = document.getElementById('ai-content-body');
        const title = document.getElementById('ai-title');

        updateButtonState();
        isScriptEnabled ? updateStatus("恢复运行中...", "#00ff00") : updateStatus("已就绪，请点击开始", "#ffffff");

        toggleBtn.onmousedown = () => toggleBtn.style.transform = 'scale(0.95)';
        toggleBtn.onmouseup = () => toggleBtn.style.transform = 'scale(1)';
        toggleBtn.onmouseleave = () => toggleBtn.style.transform = 'scale(1)';

        const toggleCollapse = (forceState = null) => {
            const newState = forceState !== null ? forceState : !uiState.isCollapsed;
            uiState.isCollapsed = newState;
            if (newState) {
                panelContainer.style.width = `${miniSize}px`; panelContainer.style.height = `${miniSize}px`; panelContainer.style.borderRadius = '50%';
                contentBody.style.display = 'none'; title.style.display = 'none'; header.style.display = 'none'; collapsedView.style.display = 'flex';
                glassShaderInstance.resize(miniSize, miniSize);
            } else {
                const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
                const currentLeft = parseFloat(panelContainer.style.left) || uiState.left;
                const safeMargin = 20;
                if (currentLeft + fullWidth > viewportWidth) { const newLeft = viewportWidth - fullWidth - safeMargin; panelContainer.style.left = newLeft + 'px'; uiState.left = newLeft; }
                panelContainer.style.width = `${fullWidth}px`; panelContainer.style.height = `${fullHeight}px`; panelContainer.style.borderRadius = '24px';
                setTimeout(() => { contentBody.style.display = 'flex'; title.style.display = 'block'; header.style.display = 'flex'; collapsedView.style.display = 'none'; }, 150);
                glassShaderInstance.resize(fullWidth, fullHeight);
            }
            saveUIState();
        };
        minIcon.onclick = (e) => { e.stopPropagation(); toggleCollapse(true); };
        collapsedView.onclick = () => toggleCollapse(false);

        let isDragging = false, startX, startY, initialLeft, initialTop;
        const handleMouseDown = (e) => {
            isDragging = true; startX = e.clientX; startY = e.clientY;
            const rect = panelContainer.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top;
            panelContainer.style.transition = 'none'; panelContainer.style.cursor = 'grabbing'; header.style.cursor = 'grabbing';
            glassShaderInstance.setPaused(true); panelContainer.style.background = 'rgba(30, 30, 30, 0.9)'; panelContainer.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
        };
        header.onmousedown = handleMouseDown; collapsedView.onmousedown = handleMouseDown;
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return; e.preventDefault();
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            let newLeft = initialLeft + dx; let newTop = initialTop + dy;
            const maxLeft = window.innerWidth - panelContainer.offsetWidth; const maxTop = window.innerHeight - panelContainer.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft)); newTop = Math.max(0, Math.min(newTop, maxTop));
            panelContainer.style.left = newLeft + 'px'; panelContainer.style.top = newTop + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (!isDragging) return; isDragging = false;
            panelContainer.style.cursor = 'default'; header.style.cursor = 'grab';
            panelContainer.style.background = 'rgba(15, 15, 15, 0.3)';
            panelContainer.style.boxShadow = 'inset 0 0 20px rgba(255,255,255,0.15), 0 15px 35px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)';
            glassShaderInstance.setPaused(false);
            panelContainer.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            const rect = panelContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2; const screenCenter = window.innerWidth / 2; const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
            let targetLeft; const safeMargin = 20;
            if (centerX < screenCenter) { targetLeft = safeMargin; } else { targetLeft = viewportWidth - rect.width - safeMargin; }
            panelContainer.style.left = targetLeft + 'px'; uiState.left = targetLeft; uiState.top = rect.top; saveUIState();
        });
        window.addEventListener('resize', () => {
            const rect = panelContainer.getBoundingClientRect(); const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
            if (rect.right > viewportWidth) { const newLeft = viewportWidth - rect.width - 20; panelContainer.style.left = Math.max(0, newLeft) + 'px'; uiState.left = newLeft; }
        });

        toggleBtn.onclick = async function(e) {
            e.stopPropagation();
            if (!isScriptEnabled) {
                updateStatus("正在检测登录...", "#00ffff");
                const loggedIn = await checkLoginStatus();
                if (!loggedIn) { updateStatus("⛔️ 启动失败: 未登录", "#ff4444"); alert("检测到未登录状态，请先登录账号！"); return; }
            }
            isScriptEnabled = !isScriptEnabled; localStorage.setItem(KEY_IS_RUNNING, isScriptEnabled);
            updateStatus(isScriptEnabled ? "正在启动..." : "已暂停", isScriptEnabled ? "#00ff00" : "#ffff00");
            updateButtonState();
        };
    }

    function updateStatus(text, color='#e0ffe0') {
        if (!statusText) initPanel();
        if (!isScriptEnabled && text !== "已暂停" && text !== "已就绪，请点击开始" && !text.includes("登录") && !text.includes("启动失败")) return;
        if (statusText) { statusText.innerText = text; statusText.style.color = color; statusText.style.textShadow = 'none'; }
    }

    // ================= 🧠 业务逻辑 =================
    function hijackAlerts() {
        try {
            window.alert = function(msg) { if (msg && (msg.includes('同时只能打开') || msg.includes('5秒'))) { handleMultiOpenError(); } return true; };
            window.confirm = function(msg) { return true; };
            if (typeof unsafeWindow !== 'undefined') { unsafeWindow.alert = window.alert; unsafeWindow.confirm = window.confirm; }
        } catch (e) {}
    }

    function handleMultiOpenError() {
        updateStatus('⛔️ 多开报错，紧急停止', 'red');
        isRuningCourse = false; isRuningCenter = false;
        setTimeout(() => { window.location.href = 'https://0734.hngbjy.cn/#/courseCenter'; }, 500);
    }

    function scanForErrorModal() {
        const bodyText = document.body.innerText;
        if (bodyText.includes('同时只能打开一门课程') || bodyText.includes('请关闭之前页面')) { handleMultiOpenError(); return true; }
        return false;
    }

    function checkUrlChange() {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) { lastUrl = currentUrl; isRuningCenter = false; isRuningCourse = false; window.hasScheduledExit = false; }
    }

    async function fetchCourseList(page) {
        try {
            const apiUrl = `https://0734.hngbjy.cn/api/Page/CourseList?_t=${new Date().getTime()}`;
            const response = await fetch(apiUrl, {
                method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `page=${page}&rows=20&sort=ClickCount&order=desc&courseType=TextCourse&flag=all`
            });
            const json = await response.json();
            return (json && json.Data) ? json.Data.ListData : null;
        } catch (e) { return null; }
    }

    async function runCenterLogic() {
        if (!isScriptEnabled || isRuningCenter) return;
        isRuningCenter = true;
        initPanel();

        if (CENTER_COOL_DOWN > 0) {
             const waitMs = CENTER_COOL_DOWN * 1000;
             updateStatus(`⏳ 正在准备翻页...`, '#ffa500'); // 人性化文案
             await new Promise(r => setTimeout(r, waitMs));
        }

        if (!isScriptEnabled) { isRuningCenter = false; return; }
        let page = parseInt(localStorage.getItem(KEY_PAGE) || 1);
        updateStatus(`🔎 正在扫描第 ${page} 页...`, '#00ffff');

        let list = await fetchCourseList(page);
        if (!list || list.length === 0) {
            updateStatus('获取列表失败/无数据', 'red');
            isRuningCenter = false;
            setTimeout(runCenterLogic, 3000);
            return;
        }

        const target = list.find(item => item.Learning !== 0 && item.Learning !== '0');
        if (target) {
            if (!isScriptEnabled) return;
            updateStatus(`🎯 锁定: ${target.Name.substring(0, 8)}...`, '#00ff00');
            setTimeout(() => { if (isScriptEnabled) window.location.href = `https://0734.hngbjy.cn/#/playText?id=${target.Id}`; }, 500);
        } else {
            if (!isScriptEnabled) return;
            updateStatus(`✅ 第${page}页完成，下一页`, 'yellow');
            localStorage.setItem(KEY_PAGE, page + 1);
            isRuningCenter = false;
            setTimeout(runCenterLogic, PAGE_FLIP_DELAY);
        }
    }

    function runCourseLogic() {
        if (!isScriptEnabled || window.hasScheduledExit) return;
        initPanel();
        if (scanForErrorModal()) return;

        const totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.scrollTo({ top: totalHeight, behavior: 'auto' });

        if ((window.scrollY + window.innerHeight) >= (totalHeight - 50)) {
            window.hasScheduledExit = true;
            let remaining = READ_WAIT_TIME;
            const timer = setInterval(() => {
                if (!isScriptEnabled) { clearInterval(timer); window.hasScheduledExit = false; updateStatus("已暂停", "#ffff00"); return; }
                if (scanForErrorModal()) { clearInterval(timer); return; }
                
                // ✨ 人性化文案修改 ✨
                updateStatus(`✅ 已学完，即将返回: ${remaining}s`, '#00ff00'); 
                
                remaining--;
                if (remaining < 0) {
                    clearInterval(timer);
                    if (isScriptEnabled) {
                        updateStatus(`🔙 正在返回列表...`, 'yellow');
                        setTimeout(() => { window.location.href = 'https://0734.hngbjy.cn/#/courseCenter'; }, 200);
                    }
                }
            }, 1000);
        }
    }

    preventWindowClose();
    hijackAlerts();

    setInterval(async () => {
        initPanel();
        if (!isScriptEnabled) { return; }

        if (Date.now() - lastLoginCheckTime > LOGIN_CHECK_INTERVAL) {
            lastLoginCheckTime = Date.now();
            const loggedIn = await checkLoginStatus();
            if (!loggedIn) { forceStopScript("⛔️ 未登录或会话过期"); return; }
        }

        if (scanForErrorModal()) return;
        checkUrlChange();
        const href = window.location.href;

        if (href.match(/\/login/i)) { forceStopScript("⛔️ 请先登录账号"); return; }
        if (href.includes('#/home')) { updateStatus("🚀 正在前往选课中心...", "#00ffff"); window.location.href = 'https://0734.hngbjy.cn/#/courseCenter'; return; }

        if (href.includes('playText')) { runCourseLogic(); }
        else if (href.includes('courseCenter')) { runCenterLogic(); }
        else if (href.endsWith('.cn/') || href.includes('#/index')) { if(!window.isRedirecting) { window.isRedirecting = true; window.location.href = 'https://0734.hngbjy.cn/#/courseCenter'; } }
    }, 500);

    window.resetScript = () => { localStorage.setItem(KEY_PAGE, 1); alert('已重置为第1页'); window.location.reload(); }
})();