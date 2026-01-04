// ==UserScript==
// @name         COC阵型复制助手
// @namespace    https://github.com/RiTian96/SurfHelper
// @version      1.1.3
// @description  [核心] 绕过付费/次数限制，后台无感提取阵型链接；[辅助] 鼠标悬停显示高清巨型大图(自适应尺寸，智能避让鼠标)；[资源] 左侧悬浮背包记录历史阵型，支持二维码扫码直连。
// @author       RiTian96
// @match        *://coc.6oh.cn/*
// @icon         https://coc.6oh.cn/favicon.ico
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coc.6oh.cn
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557748/COC%E9%98%B5%E5%9E%8B%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557748/COC%E9%98%B5%E5%9E%8B%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * =================================================================
     * 1. 全局配置 (Configuration)
     * =================================================================
     */
    const CONFIG = {
        // 历史记录最大保存条数
        bagMaxItems: 50,
        // 是否开启调试日志
        debug: false
    };

    // 运行时状态管理
    const State = {
        historyLog: [],        // 历史记录存储
        currentBtn: null,      // 当前操作的按钮
        isLensVisible: false   // 透镜显示状态
    };

    const log = (...args) => CONFIG.debug && console.log('🛡️ COC Helper:', ...args);


    /**
     * =================================================================
     * 2. 样式注入 (CSS Injection)
     * =================================================================
     */
    function injectStyles() {
        GM_addStyle(`
            /* --- [核心] 屏蔽干扰 --- */
            /* 隐藏 layui 的遮罩和弹窗 (付费/登录提示) */
            .layui-layer-shade, .layui-layer-dialog, .layui-layer-msg {
                display: none !important; z-index: -9999 !important; pointer-events: none !important;
            }

            /* --- [视觉] 成功反馈 --- */
            .coc-cracked-card {
                border: 3px solid #00E676 !important; /* 绿色高亮 */
                box-shadow: 0 0 15px rgba(0, 230, 118, 0.4) !important;
                transform: scale(1.01);
                transition: all 0.3s ease;
                z-index: 5;
                position: relative;
            }

            /* --- [组件] 智能巨型透镜 (Magic Lens) - 自适应版 --- */
            #coc-magic-lens {
                position: fixed;
                top: 50%;
                /* left/right 由 JS 动态控制以避让鼠标 */
                transform: translateY(-50%);

                /* 自适应逻辑：取消固定宽高，改用最大限制 */
                width: auto;
                height: auto;
                max-width: 48vw;  /* 限制宽度不超过屏幕一半 (留出鼠标空间) */
                max-height: 90vh; /* 限制高度不超过屏幕90% */

                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #555;
                border-radius: 12px;
                box-shadow: 0 30px 100px rgba(0,0,0,0.9); /* 强阴影提升层次感 */
                z-index: 2147483647; /* 使用最高z-index确保在最上层 */

                /* 布局居中，消除黑边关键 */
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                pointer-events: none; /* 关键：鼠标穿透 */
                backdrop-filter: blur(5px);
                transition: opacity 0.2s;
                will-change: opacity; /* 优化性能 */
            }

            #coc-magic-lens img {
                display: block;
                max-width: 100%;
                max-height: 85vh; /* 确保图片完整显示，留出边距 */
                object-fit: contain;
                opacity: 0;
                transition: opacity 0.3s ease;
                user-select: none; /* 防止图片被选中 */
                -webkit-user-drag: none; /* 防止拖拽 */
            }

            /* 加载提示 */
            #coc-magic-lens::after {
                content: "高清原图读取中...";
                position: absolute;
                color: #888; font-size: 12px; letter-spacing: 1px;
                z-index: 1; /* 确保文字可见 */
                pointer-events: none;
            }

            /* --- [组件] 侧边背包 (Loot Bag) --- */
            #coc-loot-bag {
                position: fixed; top: 25%; left: 0;
                width: 40px; height: auto;
                background: rgba(20, 20, 20, 0.98);
                border-radius: 0 10px 10px 0;
                z-index: 100000;
                border: 1px solid #444; border-left: none;
                box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
                transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden; cursor: pointer;
            }
            #coc-loot-bag:hover { width: 260px; }

            .bag-icon-area {
                width: 40px; height: 50px;
                display: flex; align-items: center; justify-content: center;
                font-size: 20px; color: #bbb; background: rgba(255,255,255,0.05);
            }

            #coc-loot-list {
                width: 260px; max-height: 400px; overflow-y: auto;
            }
            #coc-loot-list::-webkit-scrollbar { width: 4px; }
            #coc-loot-list::-webkit-scrollbar-thumb { background: #555; border-radius: 2px; }

            .coc-loot-item {
                font-size: 12px; color: #ccc; padding: 12px 15px;
                border-bottom: 1px solid #333; transition: background 0.2s;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .coc-loot-item:hover { background: #333; color: #00E676; }

            /* --- [组件] 结果弹窗 (Modal) --- */
            #coc-result-modal {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(25, 25, 25, 0.98); backdrop-filter: blur(10px);
                color: #fff; padding: 25px; border-radius: 16px;
                z-index: 2147483647; width: 340px; max-width: 90vw; text-align: center;
                box-shadow: 0 25px 80px rgba(0,0,0,0.8); border: 1px solid #444;
                animation: popUp 0.25s ease-out; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                will-change: transform, opacity;
            }
            @keyframes popUp { 
                from {transform:translate(-50%,-45%) scale(0.95);opacity:0;} 
                to {transform:translate(-50%,-50%) scale(1);opacity:1;} 
            }

            /* 链接文本域 (自动换行) */
            .coc-link-textarea {
                width: 100%; height: 70px;
                background: #111; border: 1px solid #444; color: #00E676;
                font-size: 12px; font-family: Consolas, monospace;
                padding: 8px; margin: 10px 0; border-radius: 6px;
                resize: none; outline: none; word-break: break-all; white-space: pre-wrap;
                box-sizing: border-box; text-align: left;
            }
        `);
    }


    /**
     * =================================================================
     * 3. 组件初始化 (Initialization)
     * =================================================================
     */
    function initComponents() {
        // 1. 巨型透镜
        const lens = document.createElement('div');
        lens.id = 'coc-magic-lens';
        lens.innerHTML = '<img id="coc-lens-img" src="">';
        document.body.appendChild(lens);

        // 2. 侧边背包
        const bag = document.createElement('div');
        bag.id = 'coc-loot-bag';
        bag.innerHTML = `
            <div style="display:flex; flex-direction: column;">
                <div class="bag-icon-area" title="历史记录">🎒</div>
                <div id="coc-loot-list">
                    <div style="color:#666; text-align:center; padding:20px 10px; font-size:12px;">
                        暂无记录<br>复制后自动加入
                    </div>
                </div>
            </div>`;
        document.body.appendChild(bag);
    }


    /**
     * =================================================================
     * 4. 交互逻辑 (Event Handlers)
     * =================================================================
     */
    function initEvents() {

        // --- A. 点击反馈 ---
        document.addEventListener('click', function(e) {
            const target = e.target;
            if (target && (target.classList.contains('copy2') || target.getAttribute('act') === 'zhenxing_fz')) {
                State.currentBtn = target;
                const originalText = target.innerText;

                target.innerText = "⚡ 解析中...";
                target.style.background = "#FF9800";
                target.style.color = "#fff";
                target.style.transition = "all 0.2s";

                // 超时恢复
                setTimeout(() => {
                    if(target.innerText === "⚡ 解析中...") target.innerText = originalText;
                }, 5000);
            }
        }, true);

        // --- B. 智能透镜 (悬停显示) ---
        document.body.addEventListener('mouseover', function(e) {
            const card = e.target.closest('.zxlb2');
            if (card) {
                const lens = document.getElementById('coc-magic-lens');
                const lensImg = document.getElementById('coc-lens-img');
                
                // 安全检查
                if (!lens || !lensImg) return;

                // 提取高清大图
                const bigPicLink = card.querySelector('a[href$=".jpg"], a[href$=".png"]');
                const thumbPic = card.querySelector('img');
                const imgSrc = bigPicLink ? bigPicLink.href : (thumbPic ? thumbPic.src : null);

                if (imgSrc && imgSrc.trim()) {
                    State.isLensVisible = true;
                    lens.style.display = 'flex'; // flex布局保证图片居中

                    if (lensImg.dataset.src !== imgSrc) {
                        lensImg.style.opacity = '0';
                        lensImg.src = imgSrc;
                        lensImg.dataset.src = imgSrc;
                        lensImg.onload = () => { 
                            if (lensImg) lensImg.style.opacity = '1'; 
                        };
                        lensImg.onerror = () => {
                            log("🔥 图片加载失败:", imgSrc);
                            lens.style.display = 'none';
                            State.isLensVisible = false;
                        };
                    }
                }
            }
        });

        document.body.addEventListener('mouseout', function(e) {
            const card = e.target.closest('.zxlb2');
            const related = e.relatedTarget;
            const lens = document.getElementById('coc-magic-lens');
            
            if (card && (!related || !card.contains(related))) {
                State.isLensVisible = false;
                if (lens) lens.style.display = 'none';
            }
        });

        // --- C. 智能避让 (Follow Mouse but Avoid) ---
        document.addEventListener('mousemove', function(e) {
            if (!State.isLensVisible) return;

            const lens = document.getElementById('coc-magic-lens');
            if (!lens) return;
            
            const screenWidth = window.innerWidth;
            const mouseX = e.clientX;
            const margin = 50; // 距离中心的安全边距

            // 逻辑：鼠标在左半屏 -> 图显示在右半屏；反之亦然
            // 配合CSS的 max-width: 48vw，确保图不会遮挡鼠标所在的半区
            if (mouseX < screenWidth / 2) {
                lens.style.left = 'auto';
                lens.style.right = `${margin}px`;
            } else {
                lens.style.right = 'auto';
                lens.style.left = `${margin}px`;
            }
        });
    }


        /**
     * =================================================================
     * 5. 核心破解 (Core Ghost Mode)
     * =================================================================
     */
    function initNetworkHook() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url; this._method = method;
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(body) {
            const isTarget = (body && typeof body === 'string' && body.includes('zhenxing_fz')) ||
                             (this._url && this._url.includes('zhenxing_fz'));

            if (isTarget) {
                log("🔥 捕获复制请求，启动无痕提取...");

                fetch(this._url, {
                    method: this._method || 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: body,
                    credentials: 'omit' // 核心：不带Cookie，模拟新访客
                })
                .then(r => r.text())
                .then(text => {
                    const match = text.match(/https:\/\/link\.clashofclans\.com\/[^"'\s\\]+/);
                    if (match) handleSuccess(match[0]);
                    else handleError();
                })
                .catch(err => handleError());
            }
            return originalSend.apply(this, arguments);
        };
    }


    /**
     * =================================================================
     * 6. 业务逻辑 (Business Logic)
     * =================================================================
     */
    function handleSuccess(link) {
        // UI反馈
        if (State.currentBtn) {
            State.currentBtn.innerText = "✅ 已复制";
            State.currentBtn.style.background = "#00E676";

            const card = State.currentBtn.closest('.zxlb2');
            if(card) {
                card.classList.add('coc-cracked-card');
                const titleEl = card.querySelector('a span') || card.querySelector('img');
                const title = titleEl ? (titleEl.innerText || titleEl.alt) : "阵型分享";
                addToBag(title, link);
            }
        }
        // 剪贴板
        try { GM_setClipboard(link); } catch(e) {}
        // 弹窗
        showModal(link);
    }

    function handleError() {
        if(State.currentBtn) {
            State.currentBtn.innerText = "❌ 失败";
            State.currentBtn.style.background = "#f44336";
        }
    }

    function addToBag(title, link) {
        if (State.historyLog.some(item => item.link === link)) return; // 去重
        State.historyLog.unshift({title, link});
        if(State.historyLog.length > CONFIG.bagMaxItems) State.historyLog.pop();
        renderBag();
    }

    function renderBag() {
        const list = document.getElementById('coc-loot-list');
        if (!list) return;
        
        list.innerHTML = '';
        State.historyLog.forEach(item => {
            const row = document.createElement('div');
            row.className = 'coc-loot-item';
            // 提取ID简写
            const idMatch = item.link.match(/id=([^&]+)/);
            const shortId = idMatch ? idMatch[1].substring(0, 6) : 'Link';
            row.innerHTML = `
                <div style="font-weight:bold;">${item.title || '阵型分享'}</div>
                <div style="color:#00E676; font-size:10px; margin-top:2px;">ID: ${shortId}...</div>
            `;
            row.onclick = () => { 
                if (item.link) {
                    showModal(item.link); 
                    try { GM_setClipboard(item.link); } catch(e) { log("🔥 复制失败:", e); }
                }
            };
            list.appendChild(row);
        });
    }

    function showModal(link) {
        const old = document.getElementById('coc-result-modal');
        if (old) old.remove();

        const div = document.createElement('div');
        div.id = 'coc-result-modal';
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=10&data=${encodeURIComponent(link)}`;

        div.innerHTML = `
            <h3 style="margin:0 0 15px 0; color:#00E676; font-size: 18px;">🎉 提取成功</h3>
            <div style="background:white; padding:5px; width:140px; height:140px; margin:0 auto 15px auto; border-radius:8px;" title="手机扫码">
                <img src="${qrUrl}" style="width:100%; height:100%; display:block;">
            </div>
            <p style="font-size:12px; color:#aaa; margin-bottom:5px;">链接已自动复制：</p>
            <textarea id="coc-result-link" class="coc-link-textarea" readonly>${link}</textarea>
            <div style="display:flex; gap:10px; margin-top: 10px;">
                <button id="coc-btn-go" style="flex:1; padding:8px; background:#2196F3; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">🚀 启动游戏</button>
                <button id="coc-btn-cls" style="flex:1; padding:8px; background:#444; color:white; border:none; border-radius:4px; cursor:pointer;">关闭 (Esc)</button>
            </div>
        `;
        document.body.appendChild(div);

        setTimeout(() => document.getElementById('coc-result-link').select(), 100);

        const close = () => div.remove();
        document.getElementById('coc-btn-cls').onclick = close;
        document.getElementById('coc-btn-go').onclick = () => window.location.href = link;

        const keyHandler = (e) => { if(e.key==='Escape'){ close(); document.removeEventListener('keydown',keyHandler); }};
        document.addEventListener('keydown', keyHandler);
    }


    /**
     * =================================================================
     * 7. 启动 (Bootstrap)
     * =================================================================
     */
    function main() {
        injectStyles();
        initNetworkHook(); // 尽早注入网络钩子

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initComponents();
                initEvents();
            });
        } else {
            initComponents();
            initEvents();
        }
    }

    main();

})();