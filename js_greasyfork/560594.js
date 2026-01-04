// ==UserScript==
// @name         阿里妈妈多合一助手 (Pro版 v4.2)
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  交互优化版：增加加购成本计算(花费/总购物车数)。包含状态记忆、胶囊按钮UI、日志折叠、报表直连下载拦截。
// @author       Gemini
// @match        *://alimama.com/*
// @match        *://*.alimama.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560594/%E9%98%BF%E9%87%8C%E5%A6%88%E5%A6%88%E5%A4%9A%E5%90%88%E4%B8%80%E5%8A%A9%E6%89%8B%20%28Pro%E7%89%88%20v42%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560594/%E9%98%BF%E9%87%8C%E5%A6%88%E5%A6%88%E5%A4%9A%E5%90%88%E4%B8%80%E5%8A%A9%E6%89%8B%20%28Pro%E7%89%88%20v42%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 配置与状态管理 (持久化存储)
    // ==========================================
    const STORAGE_KEY = 'AM_HELPER_CONFIG_V4_2';

    // 默认配置
    const DEFAULT_CONFIG = {
        panelOpen: false,     // 面板是否展开
        showCost: true,      // 询单成本
        showCartCost: true,  // 加购成本 (New)
        showPercent: true,   // 潜客占比
        autoClose: true,     // 弹窗速闭
        logExpanded: true    // 日志是否展开
    };

    // 读取配置
    let CONFIG = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_CONFIG;

    const saveConfig = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(CONFIG));

    // 样式常量
    const STYLE_TAG = {
        cost: 'color: #ff006a; font-size: 9px; font-weight: bold; display: block; margin-top: 2px;',
        cart: 'color: #722ed1; font-size: 9px; font-weight: bold; display: block; margin-top: 2px;', // 紫色用于加购成本
        percent: 'color: #1890ff; font-size: 9px; font-weight: bold; display: block; margin-top: 2px;'
    };

    // 注入 CSS
    const css = `
        #am-helper-icon {
            position: fixed; top: 120px; right: 20px; z-index: 999999;
            width: 40px; height: 40px; background: #FFFFFF; border-radius: 50%;
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: #1890ff; font-size: 20px; transition: transform 0.2s;
        }
        #am-helper-icon:hover { transform: scale(1.1); }

        #am-helper-panel {
            position: fixed; top: 15px; right: 15px; z-index: 999999;
            background: #fff; border-radius: 8px;
            box-shadow: 0 6px 16px -8px rgba(0,0,0,0.08), 0 9px 28px 0 rgba(0,0,0,0.05), 0 12px 48px 16px rgba(0,0,0,0.03);
            width: 280px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            border: 1px solid #f0f0f0; overflow: hidden;
        }

        .am-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px 12px; border-bottom: 1px solid #f0f0f0; background: #fafafa;
        }
        .am-title { font-weight: 600; font-size: 14px; color: #333; }
        .am-close-btn { cursor: pointer; color: #999; padding: 4px; transition: color 0.2s; }
        .am-close-btn:hover { color: #ff4d4f; }

        .am-body { padding: 12px; }

        /* 改为网格布局以适应4个按钮 */
        .am-btn-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
        }
        .am-toggle-btn {
            text-align: center; font-size: 11px; padding: 6px 0;
            border-radius: 4px; cursor: pointer; user-select: none;
            border: 1px solid #d9d9d9; background: #fff; color: #666;
            transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .am-toggle-btn.active {
            background: #e6f7ff; border-color: #1890ff; color: #1890ff; font-weight: 600;
            box-shadow: inset 0 0 3px rgba(24, 144, 255, 0.1);
        }

        .am-log-header {
            display: flex; justify-content: space-between; align-items: center;
            font-size: 12px; color: #999; margin-bottom: 6px;
        }
        .am-action-btn { cursor: pointer; color: #1890ff; margin-left: 8px; }
        .am-action-btn:hover { text-decoration: underline; }

        #am-log-content {
            height: 120px; overflow-y: auto; background: #f5f5f5;
            border: 1px solid #eee; border-radius: 4px; padding: 6px;
            font-size: 10px; color: #666; word-break: break-all;
            transition: height 0.3s ease;
        }
        #am-log-content.collapsed { height: 0; padding: 0; border: none; }

        .am-log-line { border-bottom: 1px dashed #e8e8e8; padding: 3px 0; line-height: 1.4; }
        .am-log-time { color: #999; margin-right: 4px; }
    `;
    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);

    // ==========================================
    // 2. 日志系统
    // ==========================================
    const Logger = {
        el: null,
        log(msg, isError = false) {
            const now = new Date();
            const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;

            if (isError) console.error(`[AM] ${msg}`); else console.log(`[AM] ${msg}`);

            if (this.el) {
                const p = document.createElement('div');
                p.className = 'am-log-line';
                p.innerHTML = `<span class="am-log-time">[${time}]</span>${msg}`;
                if (isError) p.style.color = '#ff4d4f';

                this.el.appendChild(p);

                if (this.el.childElementCount > 100) this.el.removeChild(this.el.firstElementChild);

                // 只有当日志展开时才自动滚动
                if (CONFIG.logExpanded && this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight < 40) {
                    this.el.scrollTop = this.el.scrollHeight;
                }
            }
        },
        clear() {
            if (this.el) this.el.innerHTML = '';
        }
    };

    // ==========================================
    // 3. 交互监听
    // ==========================================
    const Monitor = {
        keywords: ['查询', '搜索', '确定', '今天', '昨天', '过去', '本月', '上月', '计划', '单元', '创意', '推广'],

        init() {
            document.addEventListener('click', (e) => {
                const target = e.target;
                const text = (target.innerText || '').trim();

                // 1. 匹配关键词
                const hitKeyword = this.keywords.some(k => text.includes(k));

                // 2. 匹配特征 Class
                const hitClass = (target.className && typeof target.className === 'string' &&
                                 (target.className.includes('trigger') || target.className.includes('btn') || target.className.includes('tab')));

                // 3. 匹配特定的属性
                const hitAttr = target.hasAttribute('mx-click') || target.hasAttribute('mx-change');

                if (hitKeyword || hitClass || hitAttr) {
                    if (!target.closest('#am-helper-panel') && !target.closest('#am-helper-icon')) {
                        Logger.log(`🖱️ 检测到操作，等待数据加载...`);
                    }
                }
            }, true);
        }
    };

    // ==========================================
    // 4. 核心计算逻辑 (Core)
    // ==========================================
    const Core = {
        parseValue(cell) {
            if (!cell) return 0;
            let text = '';
            for (let node of cell.childNodes) {
                if (node.nodeType === 3) text += node.textContent;
                else if (node.nodeType === 1 && !node.classList.contains('am-helper-tag')) {
                    text += node.textContent;
                }
            }
            const match = text.trim().replace(/,/g, '').match(/^(\d+(\.\d+)?)/);
            return match ? parseFloat(match[1]) : 0;
        },

        renderTag(cell, type, text, style) {
            const existing = cell.querySelector(`.am-helper-tag.${type}`);
            if (existing) {
                if (existing.textContent === text) return false; // 内容没变
                existing.remove(); // 内容变了
            }
            const span = document.createElement('span');
            span.className = `am-helper-tag ${type}`;
            span.style.cssText = style;
            span.textContent = text;
            cell.appendChild(span);
            return true; // 表示进行了 DOM 更新
        },

        getColumnIndexMap(headers) {
            const map = { cost: -1, wang: -1, cart: -1, guide: -1, click: -1 };
            if (!headers || headers.length === 0) return map;

            headers.forEach((th, i) => {
                const text = (th.textContent || '').replace(/\s+|[(（].*?[)）]|,|，/g, '');
                const idx = (th.cellIndex !== undefined && th.cellIndex >= 0) ? th.cellIndex : i;

                if (text.includes('花费') && !text.includes('平均') && !text.includes('千次')) map.cost = idx;
                else if (text.includes('旺旺咨询量')) map.wang = idx;
                else if (text.includes('总购物车数') || text.includes('加购数')) map.cart = idx; // 识别购物车列
                else if ((text.includes('引导访问') && text.includes('潜客')) || text.includes('潜客数')) map.guide = idx;
                else if (text.includes('点击量')) map.click = idx;
            });
            return map;
        },

        run() {
            // 1. 寻找表格
            let table = document.querySelector('div[mx-stickytable-wrapper="body"] table') ||
                        document.querySelector('table');
            if (!table) return;

            // 2. 寻找表头
            let headers = null;
            const stickyHeaderWrapper = table.closest('[mx-stickytable-wrapper="body"]')?.parentElement?.querySelector('[mx-stickytable-wrapper="head"]');
            if (stickyHeaderWrapper) {
                headers = stickyHeaderWrapper.querySelectorAll('th');
            } else {
                headers = table.querySelectorAll('thead th');
            }

            // 3. 获取索引
            const colMap = this.getColumnIndexMap(headers);
            const validCost = CONFIG.showCost && colMap.cost > -1 && colMap.wang > -1;
            const validCart = CONFIG.showCartCost && colMap.cost > -1 && colMap.cart > -1; // 加购成本条件
            const validPercent = CONFIG.showPercent && colMap.guide > -1 && colMap.click > -1;

            if (!validCost && !validCart && !validPercent) return;

            // 4. 计算
            const rows = table.querySelectorAll('tr');
            let updatedCount = 0;

            rows.forEach(row => {
                const cells = row.cells;
                if (!cells || cells.length === 0) return;

                const isTotal = row.textContent.includes('合计') || row.textContent.includes('Total');
                let curMap = { ...colMap };

                // 合计行偏移处理
                if (isTotal && headers.length > 0) {
                    const offset = headers.length - cells.length;
                    if (curMap.cost > -1) curMap.cost -= offset;
                    if (curMap.wang > -1) curMap.wang -= offset;
                    if (curMap.cart > -1) curMap.cart -= offset;
                    if (curMap.guide > -1) curMap.guide -= offset;
                    if (curMap.click > -1) curMap.click -= offset;
                }

                // 1. 询单成本计算
                if (validCost && cells[curMap.cost] && cells[curMap.wang]) {
                    const cost = this.parseValue(cells[curMap.cost]);
                    const wang = this.parseValue(cells[curMap.wang]);
                    if (wang > 0) {
                        const changed = this.renderTag(cells[curMap.wang], 'cost-tag', `询成: ${(cost/wang).toFixed(2)}`, STYLE_TAG.cost);
                        if (changed) updatedCount++;
                    }
                }

                // 2. 加购成本计算 (新)
                if (validCart && cells[curMap.cost] && cells[curMap.cart]) {
                    const cost = this.parseValue(cells[curMap.cost]);
                    const cart = this.parseValue(cells[curMap.cart]);
                    if (cart > 0) {
                        const changed = this.renderTag(cells[curMap.cart], 'cart-tag', `加成: ${(cost/cart).toFixed(2)}`, STYLE_TAG.cart);
                        if (changed) updatedCount++;
                    }
                }

                // 3. 潜客占比计算
                if (validPercent && cells[curMap.guide] && cells[curMap.click]) {
                    const guide = this.parseValue(cells[curMap.guide]);
                    const click = this.parseValue(cells[curMap.click]);
                    const percent = click > 0 ? ((guide/click)*100).toFixed(2) + '%' : '0%';
                    const changed = this.renderTag(cells[curMap.guide], 'percent-tag', `潜客: ${percent}`, STYLE_TAG.percent);
                    if (changed) updatedCount++;
                }
            });

            if (updatedCount > 0) {
                Logger.log(`✅ 刷新成功：更新了 ${updatedCount} 项数据`);
            }
        },

        handleModal(e) {
            if (!CONFIG.autoClose) return;
            const target = e.target;
            const isMask = target.className && typeof target.className === 'string' && target.className.includes('mask');
            const isOverlay = target.tagName === 'DIV' && target.parentElement === document.body &&
                              parseInt(window.getComputedStyle(target).zIndex) > 1000;

            if (isMask || isOverlay) {
                const btn = target.querySelector('[mx-click*="close"], .mx-iconfont.close, button[aria-label="Close"]');
                if (btn) {
                    btn.click();
                    Logger.log('🛡️ 自动关闭了弹窗');
                }
            }
        }
    };

    // ==========================================
    // 5. UI 界面构建
    // ==========================================
    function initUI() {
        const root = document.createElement('div');

        const icon = document.createElement('div');
        icon.id = 'am-helper-icon';
        icon.innerHTML = '⚡';
        icon.title = '打开助手面板';

        const panel = document.createElement('div');
        panel.id = 'am-helper-panel';
        panel.innerHTML = `
            <div class="am-header">
                <span class="am-title">阿里助手 Pro v4.2</span>
                <div class="am-close-btn" id="am-panel-close">✖</div>
            </div>
            <div class="am-body">
                <div class="am-btn-group">
                    <div class="am-toggle-btn" data-key="showCost" id="btn-cost">询单成本</div>
                    <div class="am-toggle-btn" data-key="showCartCost" id="btn-cart">加购成本</div>
                    <div class="am-toggle-btn" data-key="showPercent" id="btn-percent">潜客占比</div>
                    <div class="am-toggle-btn" data-key="autoClose" id="btn-modal">弹窗速闭</div>
                </div>

                <div class="am-log-header">
                    <span>运行日志</span>
                    <div>
                        <span class="am-action-btn" id="am-log-clear">清空</span>
                        <span class="am-action-btn" id="am-log-toggle">${CONFIG.logExpanded ? '隐藏' : '展开'}</span>
                    </div>
                </div>

                <div id="am-log-content" class="${CONFIG.logExpanded ? '' : 'collapsed'}"></div>
            </div>
        `;

        root.appendChild(icon);
        root.appendChild(panel);
        document.body.appendChild(root);

        const logContent = document.getElementById('am-log-content');
        const logToggleBtn = document.getElementById('am-log-toggle');
        const btnCost = document.getElementById('btn-cost');
        const btnCart = document.getElementById('btn-cart');
        const btnPercent = document.getElementById('btn-percent');
        const btnModal = document.getElementById('btn-modal');

        Logger.el = logContent;

        const updateUIState = () => {
            if (CONFIG.panelOpen) {
                panel.style.display = 'block';
                icon.style.display = 'none';
            } else {
                panel.style.display = 'none';
                icon.style.display = 'flex';
            }

            const toggleClass = (el, active) => {
                if(active) el.classList.add('active'); else el.classList.remove('active');
            };
            toggleClass(btnCost, CONFIG.showCost);
            toggleClass(btnCart, CONFIG.showCartCost);
            toggleClass(btnPercent, CONFIG.showPercent);
            toggleClass(btnModal, CONFIG.autoClose);

            if (CONFIG.logExpanded) {
                logContent.classList.remove('collapsed');
                logToggleBtn.textContent = '隐藏';
            } else {
                logContent.classList.add('collapsed');
                logToggleBtn.textContent = '展开';
            }
        };

        icon.onclick = () => { CONFIG.panelOpen = true; saveConfig(); updateUIState(); };
        document.getElementById('am-panel-close').onclick = () => { CONFIG.panelOpen = false; saveConfig(); updateUIState(); };

        const bindToggle = (el) => {
            el.onclick = () => {
                const key = el.getAttribute('data-key');
                CONFIG[key] = !CONFIG[key];
                saveConfig();
                updateUIState();
                Logger.log(`${el.textContent}: ${CONFIG[key] ? '开启' : '关闭'}`);
                if (key !== 'autoClose') Core.run();
            };
        };
        bindToggle(btnCost);
        bindToggle(btnCart);
        bindToggle(btnPercent);
        bindToggle(btnModal);

        document.getElementById('am-log-clear').onclick = () => { Logger.clear(); Logger.log('日志已清空'); };
        logToggleBtn.onclick = () => { CONFIG.logExpanded = !CONFIG.logExpanded; saveConfig(); updateUIState(); };

        updateUIState();
    }

    // ==========================================
    // 6. 启动
    // ==========================================
    initUI();
    Monitor.init(); // 启动交互监听
    Logger.log('🚀 阿里助手 Pro (v4.2) 已启动');

    document.addEventListener('click', Core.handleModal);

    let timer;
    const observer = new MutationObserver(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => Core.run(), 500); // 500ms 防抖
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 兜底轮询
    setInterval(() => Core.run(), 3000);

})();

// ==========================================
// 附加模块：报表直连下载拦截器
// ==========================================
(function() {
    'use strict';

    // 关键词配置
    const KEYWORDS = ["oss-accelerate", "aliyuncs.com", "download"];

    // UI: 创建浮窗
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.9); color: #fff; padding: 15px; z-index: 2147483647; border-radius: 8px; font-size: 13px; display: none; width: 340px; box-shadow: 0 4px 20px rgba(0,0,0,0.6); font-family: 'Segoe UI', sans-serif; border: 1px solid #444;";
    document.body.appendChild(panel);

    function showPanel(url, source) {
        console.log(`%c 🚀 抓取成功 [${source}]: ${url}`, "color: #0f0; font-size: 12px;");

        // 避免重复内容刷屏
        if(panel.getAttribute('data-last-url') === url && panel.style.display === 'block') return;
        panel.setAttribute('data-last-url', url);

        panel.innerHTML = `
            <div style="margin-bottom:10px; font-weight:bold; color: #00ff9d; display:flex; justify-content:space-between; align-items:center;">
                <span>✅ 捕获报表文件</span>
                <span style="font-size:10px; color:#888;">${source}</span>
            </div>
            <div style="background:#222; padding:8px; border-radius:4px; margin-bottom:12px; word-break: break-all; font-size:11px; color:#aaa; max-height:50px; overflow:hidden; border:1px solid #333;">${url}</div>

            <div style="display:flex; gap: 10px;">
                <button id="dl-btn" style="background:#28a745; color:white; border:none; padding:8px 0; cursor:pointer; border-radius:4px; font-weight:bold; flex:2; transition:0.2s;">🔗 点击直连下载</button>
                <button id="cp-btn" style="background:#17a2b8; color:white; border:none; padding:8px 0; cursor:pointer; border-radius:4px; font-weight:bold; flex:1; transition:0.2s;">复制</button>
                <button id="cl-btn" style="background:#555; color:white; border:none; padding:8px 0; cursor:pointer; border-radius:4px; font-weight:bold; flex:0.5;">X</button>
            </div>
            <div style="margin-top:8px; font-size:10px; color:#aaa;">提示：如果下载的文件名无后缀，请手动添加 .xlsx</div>
        `;
        panel.style.display = 'block';

        // --- 直连下载按钮逻辑 ---
        document.getElementById('dl-btn').onclick = function() {
            window.open(url, '_blank');
        };

        // --- 复制按钮逻辑 ---
        document.getElementById('cp-btn').onclick = function() {
            GM_setClipboard(url);
            this.innerText = "已复制";
            setTimeout(() => { this.innerText = "复制"; }, 2000);
        };

        // --- 关闭按钮 ---
        document.getElementById('cl-btn').onclick = function() {
            panel.style.display = 'none';
        };
    }

    // --- 递归解析 JSON ---
    function findUrlInObject(obj) {
        if (!obj) return;
        if (typeof obj === 'string') {
            if (obj.startsWith('http') && KEYWORDS.some(k => obj.includes(k))) {
                if(!obj.match(/\.(jpg|png|gif|jpeg)$/i)) {
                    showPanel(obj, "JSON扫描");
                }
            }
            return;
        }
        if (typeof obj === 'object') {
            for (let key in obj) {
                findUrlInObject(obj[key]);
            }
        }
    }

    // --- 监听 Fetch ---
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        const clone = response.clone();
        clone.text().then(text => {
            try {
                const json = JSON.parse(text);
                findUrlInObject(json);
            } catch (e) {
                if (text && KEYWORDS.some(k => text.includes(k))) {
                     const regex = /https?:\/\/[^"'\s\\]+(?:xlsx|csv|MAIN)[^"'\s\\]*/g;
                     const matches = text.match(regex);
                     if(matches) matches.forEach(m => showPanel(m, "Fetch正则"));
                }
            }
        }).catch(() => {});
        return response;
    };

    // --- 监听 XHR ---
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('load', function() {
            try {
                const res = this.responseText;
                try {
                    const json = JSON.parse(res);
                    findUrlInObject(json);
                } catch (e) {
                    if (res && KEYWORDS.some(k => res.includes(k))) {
                        const regex = /https?:\/\/[^"'\s\\]+(?:xlsx|csv|MAIN)[^"'\s\\]*/g;
                        const matches = res.match(regex);
                        if(matches) matches.forEach(m => showPanel(m, "XHR正则"));
                    }
                }
            } catch (e) {}
        });
        return originalSend.apply(this, arguments);
    };

})();