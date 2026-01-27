// ==UserScript==
// @name         阿里妈妈多合一助手 (Pro版)
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  交互优化版：增加加购成本计算、花费占比、性能优化。包含状态记忆、胶囊按钮UI、日志折叠、报表直连下载拦截。
// @author       Gemini
// @match        *://alimama.com/*
// @match        *://*.alimama.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560594/%E9%98%BF%E9%87%8C%E5%A6%88%E5%A6%88%E5%A4%9A%E5%90%88%E4%B8%80%E5%8A%A9%E6%89%8B%20%28Pro%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560594/%E9%98%BF%E9%87%8C%E5%A6%88%E5%A6%88%E5%A4%9A%E5%90%88%E4%B8%80%E5%8A%A9%E6%89%8B%20%28Pro%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 1. 配置与状态管理
    // ==========================================
    const CONSTANTS = {
        STORAGE_KEY: 'AM_HELPER_CONFIG_V4_8',
        STYLES: {
            cost: 'color: #ff006a; font-size: 9px; font-weight: bold; display: block; margin-top: 2px;',
            cart: 'color: #722ed1; font-size: 9px; font-weight: bold; display: block; margin-top: 2px;',
            percent: 'color: #1890ff; font-size: 9px; font-weight: bold; display: block; margin-top: 2px;',
            ratio: 'color: #fa8c16; font-size: 9px; font-weight: bold; display: block; margin-top: 2px;'
        },
        KEYWORDS: ['查询', '搜索', '确定', '今天', '昨天', '过去', '本月', '上月', '计划', '单元', '创意', '推广'],
        DL_KEYWORDS: ["oss-accelerate", "aliyuncs.com", "download"]
    };

    const DEFAULT_CONFIG = {
        panelOpen: false,
        showCost: true,
        showCartCost: true,
        showPercent: true,
        showCostRatio: true,
        autoClose: true,
        logExpanded: true
    };

    // 兼容旧版配置读取
    const loadConfig = () => {
        try {
            return JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEY)) ||
                JSON.parse(localStorage.getItem('AM_HELPER_CONFIG_V4_7')) ||
                JSON.parse(localStorage.getItem('AM_HELPER_CONFIG_V4_3')) ||
                DEFAULT_CONFIG;
        } catch {
            return DEFAULT_CONFIG;
        }
    };

    const State = {
        config: loadConfig(),
        save() {
            localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(this.config));
        }
    };

    // ==========================================
    // 2. 日志系统 (DOM 缓存优化)
    // ==========================================
    const Logger = {
        el: null,
        buffer: [],
        timer: null,

        log(msg, isError = false) {
            const now = new Date();
            const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            // Console output
            const logStyle = isError ? 'color: #ff4d4f' : 'color: #1890ff';
            console.log(`%c[AM] ${msg}`, logStyle);

            // Buffer for UI update
            this.buffer.push({ time, msg, isError });
            this.scheduleFlush();
        },

        scheduleFlush() {
            if (this.timer) return;
            this.timer = requestAnimationFrame(() => this.flush());
        },

        flush() {
            if (!this.el || this.buffer.length === 0) return;

            const fragment = document.createDocumentFragment();
            this.buffer.forEach(({ time, msg, isError }) => {
                const div = document.createElement('div');
                div.className = 'am-log-line';
                div.innerHTML = `<span class="am-log-time">[${time}]</span>${msg}`;
                if (isError) div.style.color = '#ff4d4f';
                fragment.appendChild(div);
            });

            this.el.appendChild(fragment);

            // 清理旧日志 (保持由于100条)
            while (this.el.childElementCount > 100) {
                this.el.firstChild.remove();
            }

            // 滚动到底部
            if (State.config.logExpanded && (this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight < 50)) {
                this.el.scrollTop = this.el.scrollHeight;
            }

            this.buffer = [];
            this.timer = null;
        },

        clear() {
            if (this.el) this.el.innerHTML = '';
        }
    };

    // ==========================================
    // 3. 核心计算 (Logic)
    // ==========================================
    const Core = {
        // 使用 XPath 高效查找包含 "花费(元)" 的元素，避免遍历所有 span
        getTotalCost() {
            try {
                // XPath 定位：查找包含文本 "花费(元)" 的 span
                // 限制查找范围在常见的顶部统计区域 (class 包含 summary 或 overview 的 div)，如果找不到则全文查找
                const xpath = "//span[contains(text(), '花费(元)')]";
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                let span = result.singleNodeValue;

                if (span) {
                    const container = span.closest('div');
                    if (container) {
                        const rawText = container.textContent.replace('花费(元)', '').replace(/,/g, '').trim();
                        // 提取第一个浮点数
                        const match = rawText.match(/(\d+(\.\d+)?)/);
                        if (match) {
                            return parseFloat(match[0]) || 0;
                        }
                    }
                }
                return 0;
            } catch (e) {
                return 0;
            }
        },

        // 解析单元格数值
        parseValue(cell) {
            if (!cell) return 0;
            // 优化：只获取文本节点，避免获取到已插入的 tag 导致重复计算偏差
            let text = '';
            let child = cell.firstChild;
            while (child) {
                if (child.nodeType === 3) { // Text node
                    text += child.nodeValue;
                } else if (child.nodeType === 1 && !child.classList.contains('am-helper-tag')) { // Element node (non-tag)
                    text += child.textContent;
                }
                child = child.nextSibling;
            }
            const match = text.replace(/,/g, '').trim().match(/^(\d+(\.\d+)?)/);
            return match ? parseFloat(match[1]) : 0;
        },

        // 渲染标签 (DOM 操作优化)
        renderTag(cell, type, text, style) {
            // 检查是否已存在相同内容的标签
            const existing = cell.querySelector(`.am-helper-tag.${type}`);
            if (existing) {
                if (existing.textContent === text) return false;
                existing.textContent = text; // 直接更新文本，不移除重建
                return true;
            }

            const span = document.createElement('span');
            span.className = `am-helper-tag ${type}`;
            span.style.cssText = style;
            span.textContent = text;
            cell.appendChild(span);
            return true;
        },

        // 列索引映射缓存
        colMapCache: { signature: '', map: null },

        getColumnIndexMap(headers) {
            // 生成 Header 签名以决定是否更新 Map
            const signature = Array.from(headers).map(h => h.textContent.substring(0, 5)).join('');
            if (this.colMapCache.signature === signature && this.colMapCache.map) {
                return this.colMapCache.map;
            }

            const map = { cost: -1, wang: -1, carts: [], guide: -1, click: -1 };
            headers.forEach((th, i) => {
                const text = (th.textContent || '').replace(/\s+/g, ''); // 移除所有空格
                const idx = (th.cellIndex !== undefined) ? th.cellIndex : i;

                if (text.includes('花费') && !text.includes('平均') && !text.includes('千次')) map.cost = idx;
                else if (text.includes('旺旺咨询量')) map.wang = idx;
                else if ((text.includes('购物车') || text.includes('加购')) && !text.includes('率') && !text.includes('成本')) map.carts.push(idx);
                else if ((text.includes('引导访问') && text.includes('潜客')) || (text.includes('潜客数') && !text.includes('占比'))) map.guide = idx;
                else if (text.includes('点击量')) map.click = idx;
            });

            this.colMapCache = { signature, map };
            return map;
        },

        run() {
            const table = document.querySelector('div[mx-stickytable-wrapper="body"] table') || document.querySelector('table');
            if (!table) return;

            // 获取表头 (处理 Sticky Table 结构)
            let headers;
            const stickyHeaderWrapper = table.closest('[mx-stickytable-wrapper="body"]')?.parentElement?.querySelector('[mx-stickytable-wrapper="head"]');
            if (stickyHeaderWrapper) {
                headers = stickyHeaderWrapper.querySelectorAll('th');
            } else {
                headers = table.querySelectorAll('thead th');
            }
            if (!headers || headers.length === 0) return;

            const colMap = this.getColumnIndexMap(headers);
            const { showCost, showCartCost, showPercent, showCostRatio } = State.config;

            // 检查是否需要执行
            const needCost = showCost && colMap.cost > -1 && colMap.wang > -1;
            const needCart = showCartCost && colMap.cost > -1 && colMap.carts.length > 0;
            const needPercent = showPercent && colMap.guide > -1 && colMap.click > -1;
            const needRatio = showCostRatio && colMap.cost > -1;

            if (!needCost && !needCart && !needPercent && !needRatio) return;

            // 获取总花费 (只需一次)
            const totalCost = needRatio ? this.getTotalCost() : 0;
            if (needRatio && totalCost > 0) Logger.log(`💰 总花费更新: ${totalCost}`);

            const rows = table.rows; // 使用原生 .rows 属性比 querySelectorAll 更快
            let updatedCount = 0;

            // 使用 for 循环遍历，性能略优于 forEach
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                // 跳过表头行
                if (row.parentElement.tagName === 'THEAD') continue;

                const cells = row.cells;
                if (!cells || cells.length === 0) continue;

                // 简单的合计行检测
                const rowText = row.innerText; // 注意：innerText 会触发回流，但每一行做一次还好
                const isTotal = rowText.includes('合计') || rowText.includes('Total');

                let curMap = colMap; // 默认使用标准映射

                // 合计行偏移修正
                if (isTotal) {
                    const offset = headers.length - cells.length;
                    if (offset !== 0) {
                        curMap = { ...colMap }; // 浅拷贝
                        if (curMap.cost > -1) curMap.cost -= offset;
                        if (curMap.wang > -1) curMap.wang -= offset;
                        curMap.carts = curMap.carts.map(c => c - offset);
                        if (curMap.guide > -1) curMap.guide -= offset;
                        if (curMap.click > -1) curMap.click -= offset;
                    }
                }

                const getCell = (idx) => cells[idx];

                // 1. 询单成本
                if (needCost) {
                    const cCost = getCell(curMap.cost);
                    const cWang = getCell(curMap.wang);
                    if (cCost && cWang) {
                        const cost_val = this.parseValue(cCost);
                        const wang_val = this.parseValue(cWang);
                        if (wang_val > 0) {
                            if (this.renderTag(cWang, 'cost-tag', `询成: ${(cost_val / wang_val).toFixed(2)}`, CONSTANTS.STYLES.cost)) updatedCount++;
                        }
                    }
                }

                // 2. 加购成本
                if (needCart && curMap.cost > -1) {
                    const cCost = getCell(curMap.cost);
                    if (cCost) {
                        const cost_val = this.parseValue(cCost);
                        curMap.carts.forEach(cIdx => {
                            const cCart = getCell(cIdx);
                            if (cCart) {
                                const cart_val = this.parseValue(cCart);
                                if (cart_val > 0) {
                                    if (this.renderTag(cCart, 'cart-tag', `加成: ${(cost_val / cart_val).toFixed(2)}`, CONSTANTS.STYLES.cart)) updatedCount++;
                                }
                            }
                        });
                    }
                }

                // 3. 潜客占比
                if (needPercent) {
                    const cGuide = getCell(curMap.guide);
                    const cClick = getCell(curMap.click);
                    if (cGuide && cClick) {
                        const guide_val = this.parseValue(cGuide);
                        const click_val = this.parseValue(cClick);
                        if (click_val > 0) {
                            if (this.renderTag(cGuide, 'percent-tag', `潜客: ${((guide_val / click_val) * 100).toFixed(2)}%`, CONSTANTS.STYLES.percent)) updatedCount++;
                        }
                    }
                }

                // 4. 花费占比
                if (needRatio && totalCost > 0) {
                    const cCost = getCell(curMap.cost);
                    if (cCost) {
                        const cost_val = this.parseValue(cCost);
                        if (cost_val > 0) {
                            if (this.renderTag(cCost, 'ratio-tag', `占比: ${((cost_val / totalCost) * 100).toFixed(2)}%`, CONSTANTS.STYLES.ratio)) updatedCount++;
                        }
                    }
                }
            }

            if (updatedCount > 0) Logger.log(`✅ 更新 ${updatedCount} 项数据`);
        }
    };

    // ==========================================
    // 4. UI 界面 (View)
    // ==========================================
    const UI = {
        init() {
            this.injectStyles();
            this.createElements();
            this.bindEvents();
            this.updateState();
        },

        injectStyles() {
            const css = `
                #am-helper-icon {
                    position: fixed; top: 120px; right: 20px; z-index: 999999;
                    width: 40px; height: 40px; background: #FFFFFF; border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: #333; font-size: 20px; transition: transform 0.2s;
                }
                #am-helper-icon:hover { transform: scale(1.1); }
                #am-helper-panel {
                    position: fixed; top: 15px; right: 15px; z-index: 999999;
                    background: #fff; border-radius: 8px; width: 280px;
                    box-shadow: 0 6px 16px -8px rgba(0,0,0,0.08), 0 9px 28px 0 rgba(0,0,0,0.05);
                    font-family: -apple-system, sans-serif; border: 1px solid #f0f0f0; display: none;
                }
                .am-header { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; background: #fafafa; display: flex; justify-content: space-between; align-items: center; }
                .am-title { font-weight: 600; font-size: 14px; color: #333; }
                .am-close-btn { cursor: pointer; color: #999; padding: 4px; }
                .am-close-btn:hover { color: #ff4d4f; }
                .am-body { padding: 12px; }
                .am-btn-group { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
                .am-toggle-btn {
                    text-align: center; font-size: 11px; padding: 6px 0; border-radius: 4px; cursor: pointer;
                    border: 1px solid #d9d9d9; background: #fff; color: #666; transition: all 0.2s;
                }
                .am-toggle-btn.active { background: #e6f7ff; border-color: #1890ff; color: #1890ff; font-weight: 600; }
                .am-log-header { display: flex; justify-content: space-between; font-size: 12px; color: #999; margin-bottom: 6px; }
                .am-action-btn { cursor: pointer; color: #1890ff; margin-left: 8px; }
                #am-log-content {
                    height: 120px; overflow-y: auto; background: #f5f5f5; border: 1px solid #eee;
                    border-radius: 4px; padding: 6px; font-size: 10px; color: #666; transition: height 0.3s;
                }
                #am-log-content.collapsed { height: 0; padding: 0; border: none; }
                .am-log-line { border-bottom: 1px dashed #e8e8e8; padding: 2px 0; line-height: 1.4; }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        },

        createElements() {
            const root = document.createElement('div');
            root.innerHTML = `
                <div id="am-helper-icon" title="打开助手面板">
                    <svg viewBox="0 0 1024 1024" width="22" height="22" fill="currentColor"><path d="M852.1 432.8L542.4 69.2c-26.6-30.8-74.6-11.8-74.6 28.6v238H218c-36.2 0-60.6 37.8-44.4 69.4l270.2 522.4c18.6 36 71.8 23.4 71.8-17V681h249.6c36.2 0 60.8-38 44.6-69.6z"></path></svg>
                </div>
                <div id="am-helper-panel">
                    <div class="am-header"><span class="am-title">阿里助手 Pro v4.8</span><div class="am-close-btn">✖</div></div>
                    <div class="am-body">
                        <div class="am-btn-group">
                            <div class="am-toggle-btn" data-key="showCost">询单成本</div>
                            <div class="am-toggle-btn" data-key="showCartCost">加购成本</div>
                            <div class="am-toggle-btn" data-key="showPercent">潜客占比</div>
                            <div class="am-toggle-btn" data-key="showCostRatio">花费占比</div>
                            <div class="am-toggle-btn" data-key="autoClose">弹窗速闭</div>
                        </div>
                        <div class="am-log-header">
                            <span>运行日志</span>
                            <div><span class="am-action-btn" id="am-log-clear">清空</span><span class="am-action-btn" id="am-log-toggle">折叠</span></div>
                        </div>
                        <div id="am-log-content"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(root);
            Logger.el = document.getElementById('am-log-content');
        },

        bindEvents() {
            const icon = document.getElementById('am-helper-icon');
            const panel = document.getElementById('am-helper-panel');
            const closeBtn = panel.querySelector('.am-close-btn');

            icon.onclick = () => { State.config.panelOpen = true; State.save(); this.updateState(); };
            closeBtn.onclick = () => { State.config.panelOpen = false; State.save(); this.updateState(); };

            document.querySelectorAll('.am-toggle-btn').forEach(btn => {
                btn.onclick = () => {
                    const key = btn.dataset.key;
                    State.config[key] = !State.config[key];
                    State.save();
                    this.updateState();
                    Logger.log(`${btn.textContent} ${State.config[key] ? '✅' : '❌'}`);
                    if (key !== 'autoClose') Core.run();
                };
            });

            document.getElementById('am-log-clear').onclick = () => { Logger.clear(); Logger.log('日志已清空'); };
            document.getElementById('am-log-toggle').onclick = () => {
                State.config.logExpanded = !State.config.logExpanded;
                State.save();
                this.updateState();
            };

            // 交互监听
            document.addEventListener('click', (e) => {
                // 1. 弹窗自动关闭
                if (State.config.autoClose) {
                    const target = e.target;
                    // 简单的类名匹配，防止复杂 DOM 操作
                    if (typeof target.className === 'string' && (target.className.includes('mask') || parseInt(target.style.zIndex) > 900)) {
                        const closeBtn = target.querySelector('[mx-click*="close"], .mx-iconfont.close');
                        if (closeBtn) { closeBtn.click(); Logger.log('🛡️ 自动闭窗'); }
                    }
                }

                // 2. 触发更新
                const updateKeywords = ['查询', '搜索', '确定', '翻页', '分页'];
                const txt = e.target.textContent || '';
                if (updateKeywords.some(k => txt.includes(k))) {
                    Logger.log('🖱️ 触发更新');
                }
            }, true);
        },

        updateState() {
            const { panelOpen, logExpanded } = State.config;
            const icon = document.getElementById('am-helper-icon');
            const panel = document.getElementById('am-helper-panel');
            const logContent = document.getElementById('am-log-content');
            const logToggle = document.getElementById('am-log-toggle');

            panel.style.display = panelOpen ? 'block' : 'none';
            icon.style.display = panelOpen ? 'none' : 'flex';

            document.querySelectorAll('.am-toggle-btn').forEach(btn => {
                const key = btn.dataset.key;
                if (State.config[key]) btn.classList.add('active'); else btn.classList.remove('active');
            });

            if (logExpanded) {
                logContent.classList.remove('collapsed');
                logToggle.textContent = '隐藏';
            } else {
                logContent.classList.add('collapsed');
                logToggle.textContent = '展开';
            }
        }
    };

    // ==========================================
    // 5. 网络拦截与报表抓取 (Interceptor)
    // ==========================================
    const Interceptor = {
        panel: null,
        keywords: CONSTANTS.DL_KEYWORDS,

        init() {
            this.createPanel();
            this.hookFetch();
            this.hookXHR();
        },

        createPanel() {
            const div = document.createElement('div');
            div.style.cssText = "position:fixed; bottom:20px; right:20px; background:rgba(0,0,0,0.9); color:#fff; padding:15px; z-index:2147483647; border-radius:8px; font-size:13px; display:none; width:340px; box-shadow:0 4px 20px rgba(0,0,0,0.6); border:1px solid #444;";
            document.body.appendChild(div);
            this.panel = div;
        },

        show(url, source) {
            if (this.panel.dataset.lastUrl === url && this.panel.style.display === 'block') return;
            this.panel.dataset.lastUrl = url;

            Logger.log(`📂 捕获报表: ${source}`, true);

            this.panel.innerHTML = `
                <div style="margin-bottom:10px; font-weight:bold; color:#00ff9d; display:flex; justify-content:space-between;">
                    <span>✅ 捕获报表</span><span style="color:#888;font-size:10px">${source}</span>
                </div>
                <div style="background:#222; padding:8px; border-radius:4px; margin-bottom:12px; word-break:break-all; font-size:11px; color:#aaa; max-height:50px; overflow:hidden;">${url}</div>
                <div style="display:flex; gap:10px;">
                    <a href="${url}" target="_blank" style="background:#28a745; color:white; text-decoration:none; padding:8px 0; text-align:center; border-radius:4px; flex:2;">⚡ 直连下载</a>
                    <button id="am-cp-btn" style="background:#17a2b8; color:white; border:none; border-radius:4px; flex:1; cursor:pointer;">复制</button>
                    <button id="am-cl-btn" style="background:#555; color:white; border:none; border-radius:4px; flex:0.5; cursor:pointer;">X</button>
                </div>
                <div style="margin-top:8px; font-size:10px; color:#aaa;">提示：如果下载的文件名无后缀，请手动添加 .xlsx</div>
            `;
            this.panel.style.display = 'block';

            document.getElementById('am-cp-btn').onclick = function () {
                GM_setClipboard(url);
                this.innerText = '已复制';
                setTimeout(() => this.innerText = '复制', 1500);
            };
            document.getElementById('am-cl-btn').onclick = () => this.panel.style.display = 'none';
        },

        // --- 递归解析 JSON (Restored Original Logic) ---
        findUrlInObject(obj, source) {
            if (!obj) return;
            if (typeof obj === 'string') {
                if (obj.startsWith('http') && this.keywords.some(k => obj.includes(k))) {
                    if (!obj.match(/\.(jpg|png|gif|jpeg)$/i)) {
                        this.show(obj, source); // Modified to call this.show
                    }
                }
                return;
            }
            if (typeof obj === 'object') {
                for (let key in obj) {
                    this.findUrlInObject(obj[key], source);
                }
            }
        },

        handleResponse(text, source) {
            try {
                const json = JSON.parse(text);
                this.findUrlInObject(json, `JSON:${source}`);
            } catch (e) {
                // Fallback Regex from original code
                if (text && this.keywords.some(k => text.includes(k))) {
                    const regex = /https?:\/\/[^"'\s\\]+(?:xlsx|csv|MAIN)[^"'\s\\]*/g;
                    const matches = text.match(regex);
                    if (matches) matches.forEach(m => this.show(m, `Regex:${source}`));
                }
            }
        },

        hookFetch() {
            const originalFetch = window.fetch;
            const self = this;
            window.fetch = async (...args) => {
                const response = await originalFetch(...args);
                const clone = response.clone();
                clone.text().then(text => self.handleResponse(text, 'Fetch')).catch(() => { });
                return response;
            };
        },

        hookXHR() {
            const originalSend = XMLHttpRequest.prototype.send;
            const self = this;
            XMLHttpRequest.prototype.send = function () {
                this.addEventListener('load', function () {
                    self.handleResponse(this.responseText, 'XHR');
                });
                return originalSend.apply(this, arguments);
            };
        }
    };

    // ==========================================
    // 6. 启动程序
    // ==========================================
    function main() {
        UI.init();
        Interceptor.init();

        Logger.log('🚀 阿里助手 Pro v4.8 已启动');

        // 使用 MutationObserver 监听 DOM 变化，但限制频率
        let timer;
        const observer = new MutationObserver((mutations) => {
            if (timer) return; // 节流
            timer = setTimeout(() => {
                Core.run();
                timer = null;
            }, 800); // 调整为 800ms，降低频率
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 兜底轮询 (降低频率到 5s)
        setInterval(() => Core.run(), 5000);

        // 初始运行
        setTimeout(() => Core.run(), 1000);
    }

    main();

})();