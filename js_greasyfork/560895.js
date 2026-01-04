// ==UserScript==
// @name         LANraragi 阅读模式
// @namespace    https://github.com/Kelcoin
// @version      4.1
// @description  为 LANraragi 阅读器添加阅读模式
// @author       Kelcoin
// @match        *://*/reader?id=*
// @run-at       document-end
// @grant        none
// @icon         https://github.com/Difegue/LANraragi/raw/dev/public/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560895/LANraragi%20%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/560895/LANraragi%20%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------- 配置与常量 --------
    const BUTTON_ID = 'lrr-reading-toggle-btn';
    const THUMB_BUTTON_ID = 'lrr-reading-thumb-btn';
    const PAGE_INDICATOR_ID = 'lrr-reading-page-indicator';
    const HITAREA_ID = 'lrr-reading-hitarea';       // 右侧热区
    const LEFT_HITAREA_ID = 'lrr-reading-left-hitarea'; // 左侧热区
    const STYLE_ID = 'lrr-reading-style-v2';
    const BODY_READING_CLASS = 'lrr-reading-mode';
    const SETTINGS_MODAL_ID = 'lrr-reading-settings-modal';

    // 交互参数
    const MAX_DRAG_RATIO = 1.0;
    const CLICK_THRESHOLD_RATIO = 0.01;
    const SWIPE_THRESHOLD_RATIO = 0.15;
    const CORNER_HEIGHT_RATIO = 0.15;
    const CORNER_WIDTH_RATIO = 0.2;

    // 默认设置
    const DEFAULT_SETTINGS = {
        autoEnter: false,
        btnPosition: 'right', // 'right' | 'left'
        pageGap: 0
    };

    let userSettings = { ...DEFAULT_SETTINGS };

    // 状态管理
    let dragState = {
        active: false,
        startX: 0,
        currentX: 0,
        targetImg: null,
        rafId: null,
        isTouch: false
    };
    let btnHideTimer = null; // 统一管理按钮隐藏定时器
    let lastScrollTop = 0;
    let originalApplyContainerWidth = null;

    // 数据缓存
    let archiveData = {
        pages: [],
        loaded: false
    };

    // ==========================================
    // 设置管理
    // ==========================================

    function loadSettings() {
        try {
            const stored = localStorage.getItem('lrr_reading_settings');
            if (stored) {
                userSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
            } else {
                // 迁移旧版配置
                const oldAuto = localStorage.getItem('lrr_auto_read');
                if (oldAuto) userSettings.autoEnter = oldAuto === '1';
            }
        } catch (e) {
            console.error("Load Settings Error", e);
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem('lrr_reading_settings', JSON.stringify(userSettings));
            // 同时也维护旧版key以防回退
            localStorage.setItem('lrr_auto_read', userSettings.autoEnter ? '1' : '0');
        } catch (e) { }
        applyLayoutSettings();
    }

    // 应用布局设置（按钮位置、间距）
    function applyLayoutSettings() {
        const mainBtn = document.getElementById(BUTTON_ID);
        const thumbBtn = document.getElementById(THUMB_BUTTON_ID);
        const display = document.getElementById('display');

        if (mainBtn && thumbBtn) {
            // 清除之前的定位样式
            mainBtn.style.left = ''; mainBtn.style.right = '';
            thumbBtn.style.left = ''; thumbBtn.style.right = '';

            if (userSettings.btnPosition === 'right') {
                // 默认：主按钮在右，缩略图在左
                mainBtn.style.right = '15px';
                thumbBtn.style.left = '15px';
            } else {
                // 交换：主按钮在左，缩略图在右
                mainBtn.style.left = '15px';
                thumbBtn.style.right = '15px';
            }
        }

        if (display) {
            display.style.gap = `${userSettings.pageGap}px`;
        }
    }

    // ==========================================
    // 数据获取与环境检测
    // ==========================================

    function getArchiveId() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    async function initPageData() {
        if (typeof Reader !== 'undefined' && Reader.pages && Reader.pages.length > 0) {
            archiveData.pages = Reader.pages;
            archiveData.loaded = true;
            hookReaderFunctions();
            return;
        }

        const id = getArchiveId();
        if (id) {
            try {
                const response = await fetch(`/api/archives/${id}/files`);
                const data = await response.json();
                if (data && data.pages) {
                    archiveData.pages = data.pages;
                    archiveData.loaded = true;
                }
            } catch (e) {
                console.error("[LRR Reading Mode] Failed to load page data", e);
            }
        }
    }

    function hookReaderFunctions() {
        if (typeof Reader !== 'undefined' && Reader.applyContainerWidth && !originalApplyContainerWidth) {
            originalApplyContainerWidth = Reader.applyContainerWidth;
            Reader.applyContainerWidth = function() {
                if (document.body.classList.contains(BODY_READING_CLASS)) {
                    $(".reader-image, .sni").attr("style", "");
                    return;
                }
                return originalApplyContainerWidth.apply(this, arguments);
            };
        }
    }

    function getPageUrl(index) {
        if (typeof Reader !== 'undefined' && Reader.pages && Reader.pages[index]) return Reader.pages[index];
        if (archiveData.loaded && archiveData.pages[index]) return archiveData.pages[index];
        return null;
    }

    function isMangaMode() {
        if (typeof Reader !== 'undefined' && typeof Reader.mangaMode !== 'undefined') return Reader.mangaMode;
        try { return localStorage.getItem('mangaMode') === 'true'; } catch (e) { }
        return false;
    }

    function isDoublePageMode() {
        if (typeof Reader !== 'undefined' && typeof Reader.doublePageMode !== 'undefined') return Reader.doublePageMode;
        try { return localStorage.getItem('doublePageMode') === 'true'; } catch (e) { }
        return false;
    }

    function getPageInfo() {
        if (typeof Reader !== 'undefined' && typeof Reader.currentPage === 'number') {
            return {
                current: Reader.currentPage + 1,
                total: Reader.pages ? Reader.pages.length : (archiveData.pages.length || 0),
                index: Reader.currentPage
            };
        }
        const paginator = document.querySelector('.paginator') || document.querySelector('.current-page');
        if (!paginator) return { current: 1, total: 1, index: 0 };
        const m = (paginator.textContent || '').match(/(\d+)\s*\/\s*(\d+)/);
        if (m) return { current: parseInt(m[1]), total: parseInt(m[2]), index: parseInt(m[1]) - 1 };
        return { current: 1, total: 1, index: 0 };
    }

    // ==========================================
    // 核心工具函数
    // ==========================================

    function looksLikeReader() {
        return /reader|read|id=/.test(location.href) || !!document.querySelector('#reader, .reader');
    }

    function isReadingMode() {
        return document.body.classList.contains(BODY_READING_CLASS);
    }

    function updatePageIndicator() {
        const info = getPageInfo();
        const el = document.getElementById(PAGE_INDICATOR_ID);
        if (info && el) el.textContent = `${info.current} / ${info.total}`;

        if (isReadingMode()) {
            updateGhosts(info);
            hookReaderFunctions();
        }
    }

    // ==========================================
    // 样式注入
    // ==========================================

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            body.${BODY_READING_CLASS},
            html.${BODY_READING_CLASS} {
                overflow: hidden !important;
                background: #000 !important;
                margin: 0 !important; padding: 0 !important;
                width: 100% !important; height: 100% !important;
                touch-action: none !important;
                overscroll-behavior: none !important;
                box-sizing: border-box !important;
            }
            body.${BODY_READING_CLASS} * {
                -webkit-tap-highlight-color: transparent !important;
                -webkit-touch-callout: none !important;
                -webkit-user-select: none !important;
                user-select: none !important;
                -webkit-user-drag: none !important;
                user-drag: none !important;
            }
            body.${BODY_READING_CLASS} header,
            body.${BODY_READING_CLASS} nav,
            body.${BODY_READING_CLASS} .navbar,
            body.${BODY_READING_CLASS} .paginator,
            body.${BODY_READING_CLASS} #footer,
            body.${BODY_READING_CLASS} #i4,
            body.${BODY_READING_CLASS} .id1,
            body.${BODY_READING_CLASS} .id2,
            body.${BODY_READING_CLASS} .id4,
            body.${BODY_READING_CLASS} #overlay-shade,
            body.${BODY_READING_CLASS} .absolute-options,
            body.${BODY_READING_CLASS} .file-info,
            body.${BODY_READING_CLASS} #i5,
            body.${BODY_READING_CLASS} #i7,
            body.${BODY_READING_CLASS} .sn {
                display: none !important;
            }

            body.${BODY_READING_CLASS} #archivePagesOverlay {
                display: none;
                z-index: 2147483647 !important;
                position: fixed !important;
                top: 50% !important; left: 50% !important;
                transform: translate(-50%, -50%) !important;
                pointer-events: auto !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
            }

            body.${BODY_READING_CLASS} #i3 {
                position: fixed !important; top: 0; left: 0;
                width: 100vw !important; height: 100vh !important;
                background: #000 !important; z-index: 1000 !important;
                display: flex !important; align-items: center; justify-content: center;
                overflow: visible !important;
                margin: 0 !important; padding: 0 !important;
            }

            body.${BODY_READING_CLASS} #display {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100vw !important;
                height: 100vh !important;
                position: relative !important;
                margin: 0 !important;
                padding: 0 !important;
                left: 0 !important;
                right: 0 !important;
                top: 0 !important;
                transform: translateX(0); will-change: transform;
                cursor: grab; pointer-events: auto !important;
                overflow: visible !important;
                /* Gap dynamic via JS */
            }
            body.${BODY_READING_CLASS} #display:active { cursor: grabbing; }

            body.${BODY_READING_CLASS} img.reader-image,
            body.${BODY_READING_CLASS} .lrr-ghost-img {
                position: static !important;
                max-width: 100vw !important;
                max-height: 100vh !important;
                width: auto !important;
                height: auto !important;
                object-fit: contain !important;
                margin: 0 !important;
                pointer-events: auto !important;
                background: #000;
                outline: none !important;
                display: block;
                transform: none !important;
                box-shadow: none !important;
            }

            body.${BODY_READING_CLASS} .sni {
                padding: 0 !important;
                margin: 0 !important;
                width: auto !important;
                max-width: none !important;
                display: contents !important;
            }

            /* 幽灵页 */
            .lrr-ghost-side {
                position: absolute; top: 0;
                width: 100vw; height: 100vh;
                display: flex; align-items: center; justify-content: center;
                background-color: #000; z-index: 1; pointer-events: none;
            }
            .lrr-ghost-left { left: -100vw; }
            .lrr-ghost-right { left: 100vw; }

            .lrr-ghost-container {
                display: flex; flex-direction: row;
                justify-content: center; align-items: center;
                width: 100%; height: 100%;
            }
            .lrr-ghost-container.single-view .lrr-ghost-img { max-width: 100vw !important; max-height: 100vh !important; }
            .lrr-ghost-container.double-view .lrr-ghost-img { max-width: 50vw !important; max-height: 100vh !important; }
            .lrr-ghost-text { color: #444; font-size: 20px; font-weight: bold; text-align: center; }

            /* 按钮样式 */
            #${BUTTON_ID}, #${THUMB_BUTTON_ID} {
                position: fixed; z-index: 200000; bottom: 30px;
                width: 48px; height: 48px; border-radius: 50%;
                background: rgba(0,0,0,0.6); 
                border: 2px solid rgba(255,255,255,0.3);
                backdrop-filter: blur(2px);
                color: #fff; font-size: 22px; display: flex;
                align-items: center; justify-content: center; cursor: pointer;
                transition: opacity 0.3s, transform 0.3s;
                
                /* 防止选择和长按菜单 */
                -webkit-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            #${BUTTON_ID}:active, #${THUMB_BUTTON_ID}:active { transform: scale(0.9); background: rgba(50,50,50,0.8); }

            #${THUMB_BUTTON_ID} { font-size: 18px; opacity: 0; pointer-events: none; visibility: hidden; }

            /* 阅读模式隐藏状态：完全移除交互 */
            body.${BODY_READING_CLASS} #${BUTTON_ID},
            body.${BODY_READING_CLASS} #${THUMB_BUTTON_ID} { opacity: 0; pointer-events: none; visibility: hidden; }

            /* 非阅读模式下主按钮显示 */
            body:not(.${BODY_READING_CLASS}) #${BUTTON_ID} { opacity: 1 !important; pointer-events: auto !important; visibility: visible !important; }
            body:not(.${BODY_READING_CLASS}) #${BUTTON_ID}.hide-on-scroll { transform: translateY(100px); opacity: 0 !important; }

            /* 触摸热区 */
            #${HITAREA_ID}, #${LEFT_HITAREA_ID} {
                position: fixed; bottom: 0; z-index: 199999;
                width: 15vw; height: 15vh;
                background: transparent;
                pointer-events: none;
            }
            #${HITAREA_ID} { right: 0; }
            #${LEFT_HITAREA_ID} { left: 0; }
            body.${BODY_READING_CLASS} #${HITAREA_ID},
            body.${BODY_READING_CLASS} #${LEFT_HITAREA_ID} { pointer-events: auto; }

            /* 页码指示器：默认按手机端来设计 */
            #${PAGE_INDICATOR_ID} {
                position: fixed;
                z-index: 200000;

                /* 手机端默认：居中 + 稍微往上，避免圆角和手势条 */
                left: 50%;
                transform: translateX(-50%);
                /* 兼顾安全区域：env(safe-area-inset-bottom) 在非刘海机上为 0 */
                bottom: calc(env(safe-area-inset-bottom, 0px) + 15px);

                background: rgba(0,0,0,0.5);
                color: #fff;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 12px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
                white-space: nowrap;
            }

            /* 阅读模式下显示 */
            body.${BODY_READING_CLASS} #${PAGE_INDICATOR_ID} {
                opacity: 1;
            }

            /* 宽屏 / 桌面端：右下角显示，避免挡住图片中轴线 */
            @media (min-width: 960px) {
                #${PAGE_INDICATOR_ID} {
                    left: auto;
                    transform: none;

                    right: 16px;
                    bottom: 6px;
                }
            }

            /* 可选：横屏但不是特别宽的设备（如平板 / 横屏手机），也用右下角 */
            @media (orientation: landscape) and (min-width: 720px) {
                #${PAGE_INDICATOR_ID} {
                    left: auto;
                    transform: none;

                    right: 16px;
                    bottom: 6px;
                }
            }

            /* 遮罩层保持不变 */
            .lrr-thumb-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.7);
                z-index: 2147483646;
                backdrop-filter: blur(2px);
            }

            /* --- 设置面板样式 --- */
            #${SETTINGS_MODAL_ID} {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.6); z-index: 200001;
                display: none; align-items: center; justify-content: center;
                backdrop-filter: blur(3px);
                /* 修复设置面板被选中导致的问题 */
                -webkit-user-select: none !important;
                user-select: none !important;
            }
            .lrr-settings-content {
                background: #2b2b2b; color: #ddd;
                width: 300px; padding: 20px; border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                font-family: sans-serif;
            }
            .lrr-settings-header {
                font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;
                display: flex; justify-content: space-between; align-items: center;
            }
            .lrr-settings-close { cursor: pointer; font-size: 24px; line-height: 20px; }
            .lrr-setting-item { margin-bottom: 15px; display: flex; flex-direction: column; }
            .lrr-setting-label { font-size: 14px; margin-bottom: 5px; color: #aaa; }
            .lrr-setting-input-row { display: flex; align-items: center; justify-content: space-between; }
            .lrr-switch { position: relative; display: inline-block; width: 40px; height: 20px; }
            .lrr-switch input { opacity: 0; width: 0; height: 0; }
            .lrr-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555; transition: .4s; border-radius: 20px; }
            .lrr-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .lrr-slider { background-color: #4CAF50; }
            input:checked + .lrr-slider:before { transform: translateX(20px); }
            .lrr-select, .lrr-input { background: #444; color: #fff; border: 1px solid #555; padding: 5px; border-radius: 4px; width: 100%; box-sizing: border-box; }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // 逻辑函数 - 设置面板
    // ==========================================

    function openSettingsModal() {
        let modal = document.getElementById(SETTINGS_MODAL_ID);
        
        // 定义关闭逻辑，确保恢复全局选中状态
        const closeSettings = () => {
            if (modal) {
                modal.style.display = 'none';
                document.body.style.userSelect = '';
                document.body.style.webkitUserSelect = '';
            }
        };

        if (!modal) {
            modal = document.createElement('div');
            modal.id = SETTINGS_MODAL_ID;
            modal.innerHTML = `
                <div class="lrr-settings-content">
                    <div class="lrr-settings-header">
                        <span>阅读模式设置</span>
                        <span class="lrr-settings-close">&times;</span>
                    </div>

                    <div class="lrr-setting-item">
                        <div class="lrr-setting-input-row">
                            <span class="lrr-setting-label" style="margin:0">自动进入阅读模式</span>
                            <label class="lrr-switch">
                                <input type="checkbox" id="lrr-cfg-auto">
                                <span class="lrr-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="lrr-setting-item">
                        <span class="lrr-setting-label">阅读模式按钮位置</span>
                        <select class="lrr-select" id="lrr-cfg-pos">
                            <option value="right">右下角 (默认)</option>
                            <option value="left">左下角</option>
                        </select>
                        <div style="font-size:12px; color:#888; margin-top:4px;">注意：改为左下角时，阅读模式内的缩略图按钮将移至右下角。</div>
                    </div>

                    <div class="lrr-setting-item">
                        <span class="lrr-setting-label">双页间距 (px)</span>
                        <input type="number" class="lrr-input" id="lrr-cfg-gap" min="0" max="100">
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // 绑定事件
            modal.querySelector('.lrr-settings-close').addEventListener('click', closeSettings);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeSettings();
            });

            const elAuto = document.getElementById('lrr-cfg-auto');
            const elPos = document.getElementById('lrr-cfg-pos');
            const elGap = document.getElementById('lrr-cfg-gap');

            elAuto.addEventListener('change', (e) => { userSettings.autoEnter = e.target.checked; saveSettings(); });
            elPos.addEventListener('change', (e) => { userSettings.btnPosition = e.target.value; saveSettings(); });
            elGap.addEventListener('change', (e) => { userSettings.pageGap = parseInt(e.target.value) || 0; saveSettings(); });
        }

        // 同步当前值
        document.getElementById('lrr-cfg-auto').checked = userSettings.autoEnter;
        document.getElementById('lrr-cfg-pos').value = userSettings.btnPosition;
        document.getElementById('lrr-cfg-gap').value = userSettings.pageGap;

        modal.style.display = 'flex';
        // 打开时强制禁止全局选中，防止背景被选中
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
    }

    // ==========================================
    // 逻辑函数 - 交互控制
    // ==========================================

    function preventContextMenu(e) {
        e.preventDefault(); e.stopPropagation(); return false;
    }

    function handleTouchCapture(e) {
        if (!isReadingMode()) return;
        if (e.target.closest('#archivePagesOverlay') || e.target.closest('.lrr-thumb-backdrop')) return;
        const t = e.target;
        if (t && (t.closest('#i3') || t.closest('#display') || t.tagName === 'IMG' || t.closest('.paginator'))) {
        }
    }

    function handleCaptureClick(e) {
        if (!isReadingMode()) return;
        if (e.target.closest(`#${BUTTON_ID}`) || e.target.closest(`#${THUMB_BUTTON_ID}`) || e.target.closest(`#${HITAREA_ID}`) || e.target.closest(`#${LEFT_HITAREA_ID}`) || e.target.closest(`#${SETTINGS_MODAL_ID}`)) {
            return;
        }
        const inReaderContainer = e.target.closest('#i3');
        const inDisplay = e.target.closest('#display');
        const isImg = e.target.tagName === 'IMG';
        if (inReaderContainer || inDisplay || isImg) {
            e.stopPropagation();
        }
    }

    function handleKeydownBlock(e) {
        if (!isReadingMode()) return;
        const blockKeys = ['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', ' ', 'Spacebar', 'a', 'A', 'd', 'D'];
        if (blockKeys.includes(e.key)) {
            e.preventDefault(); e.stopPropagation();
        }
    }

    function handleDragStart(e) {
        if (isReadingMode() && (e.target.closest('#display') || e.target.tagName === 'IMG')) e.preventDefault();
    }

    function handleScroll() {
        if (isReadingMode()) return;
        const btn = document.getElementById(BUTTON_ID);
        if (!btn) return;
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop && st > 100) {
            btn.classList.add('hide-on-scroll');
        } else {
            btn.classList.remove('hide-on-scroll');
        }
        lastScrollTop = st <= 0 ? 0 : st;
    }

    function setupClickBlocker(enable) {
        if (enable) {
            window.addEventListener('click', handleCaptureClick, true);
            window.addEventListener('contextmenu', preventContextMenu, true);
            window.addEventListener('dragstart', handleDragStart, { passive: false });
            window.addEventListener('keydown', handleKeydownBlock, true);
            window.removeEventListener('scroll', handleScroll);
        } else {
            window.removeEventListener('click', handleCaptureClick, true);
            window.removeEventListener('contextmenu', preventContextMenu, true);
            window.removeEventListener('dragstart', handleDragStart);
            window.removeEventListener('touchstart', handleTouchCapture, true);
            window.removeEventListener('touchend', handleTouchCapture, true);
            window.removeEventListener('touchcancel', handleTouchCapture, true);
            window.removeEventListener('keydown', handleKeydownBlock, true);
            window.addEventListener('scroll', handleScroll);
        }
    }

    // -------- 缩略图面板与遮罩 --------
    function ensureThumbBackdrop() {
        let bd = document.querySelector('.lrr-thumb-backdrop');
        if (bd) return bd;
        bd = document.createElement('div');
        bd.className = 'lrr-thumb-backdrop';
        bd.addEventListener('click', closeThumbnailOverlay);
        document.body.appendChild(bd);
        return bd;
    }
    function removeThumbBackdrop() {
        const bd = document.querySelector('.lrr-thumb-backdrop');
        if (bd) bd.remove();
    }
    function closeThumbnailOverlay() {
        const overlay = document.getElementById('archivePagesOverlay');
        if (overlay) overlay.style.display = 'none';
        removeThumbBackdrop();
        if (typeof LRR !== 'undefined' && LRR.closeOverlay) LRR.closeOverlay();
    }
    function openThumbnailOverlay() {
        const nativeBtn = document.getElementById('toggle-archive-overlay');
        if (nativeBtn) nativeBtn.click();
        else document.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', code: 'KeyQ', bubbles: true }));

        setTimeout(() => {
            const overlay = document.getElementById('archivePagesOverlay');
            if (overlay) {
                overlay.style.setProperty('display', 'block', 'important');
                ensureThumbBackdrop();
                if (!overlay._hasDelegatedClick) {
                    overlay.addEventListener('click', (e) => {
                        if (e.target.closest('.quick-thumbnail') || e.target.closest('.id3') || e.target.tagName === 'A' || e.target.tagName === 'IMG') {
                            setTimeout(closeThumbnailOverlay, 50);
                        }
                    });
                    overlay._hasDelegatedClick = true;
                }
            }
        }, 100);
    }

    // -------- 按钮显隐与布局逻辑 --------

    // 显示指定按钮（并确保可点击），随后自动隐藏
    function tempShowButton(elementId) {
        const btn = document.getElementById(elementId);
        if (!btn) return;
        // 只有阅读模式下需要动态显隐
        if (isReadingMode()) {
            // 如果当前是隐藏状态（opacity为0或未设置），则视为刚出现
            const isHidden = btn.style.opacity === '0' || btn.style.opacity === '';
            
            btn.style.visibility = 'visible';
            btn.style.opacity = '1';

            if (isHidden) {
                // 刚出现时禁止交互
                btn.style.pointerEvents = 'none';
                // 500ms 后恢复交互
                if (btn._warmupTimer) clearTimeout(btn._warmupTimer);
                btn._warmupTimer = setTimeout(() => {
                    // 确保此时按钮仍然应该是显示状态
                    if (btn.style.opacity === '1') {
                        btn.style.pointerEvents = 'auto';
                    }
                }, 500);
            }
            // 如果不是刚出现（已经是1了），保持原状（由之前的 timer 负责开启 interaction，或者已经开启）
        }

        // 使用全局Timer防止闪烁
        if (btnHideTimer) clearTimeout(btnHideTimer);
        btnHideTimer = setTimeout(() => {
            if (isReadingMode()) {
                const b1 = document.getElementById(BUTTON_ID);
                const b2 = document.getElementById(THUMB_BUTTON_ID);
                
                // 辅助隐藏函数：先淡出，动画结束后彻底隐藏
                const hide = (el) => {
                    if (!el) return;
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                    // 延迟 300ms (CSS transition time) 后设置 visibility: hidden
                    // 这样可以确保移动端不会误触不可见的元素
                    setTimeout(() => {
                        if (el.style.opacity === '0') {
                            el.style.visibility = 'hidden';
                        }
                    }, 300);
                };

                hide(b1);
                hide(b2);
            }
        }, 2500);
    }

    // 触发右侧区域逻辑
    function handleRightAreaTrigger() {
        // 如果按钮在右边，显示主按钮；否则显示缩略图按钮
        if (userSettings.btnPosition === 'right') tempShowButton(BUTTON_ID);
        else tempShowButton(THUMB_BUTTON_ID);
    }

    // 触发左侧区域逻辑
    function handleLeftAreaTrigger() {
        // 如果按钮在右边（即左边空闲），显示缩略图按钮；否则显示主按钮
        if (userSettings.btnPosition === 'right') tempShowButton(THUMB_BUTTON_ID);
        else tempShowButton(BUTTON_ID);
    }


    // -------- 翻页逻辑 --------

    function exitFromLastPageWithAnimation(display, diffSign) {
        const width = window.innerWidth || 1;
        const finalDiff = diffSign >= 0 ? width : -width;

        display.style.transition = 'transform 0.25s ease-out, opacity 0.25s ease-out';
        display.style.transform = `translateX(${finalDiff}px)`;
        display.style.opacity = '0.0';
        setTimeout(() => {
            setReadingMode(false);
            setTimeout(() => {
                display.style.transform = '';
                display.style.opacity = '';
                display.style.transition = '';
            }, 300);
        }, 250);
    }

    function executePageTurn(intent) {
        const manga = isMangaMode();
        const canUseReader = (typeof Reader !== 'undefined') && Reader && typeof Reader.changePage === 'function';

        if (canUseReader) {
            let dir = 0;
            if (intent === 'next') dir = manga ? -1 : 1;
            else dir = manga ? 1 : -1;
            Reader.changePage(dir, true);
        } else {
            let action = '';
            if (intent === 'next') action = manga ? 'left' : 'right';
            else action = manga ? 'right' : 'left';
            const link = document.querySelector(`.page-link[value="${action}"]`);
            if (link) link.click();
            else {
                const key = action === 'left' ? 'ArrowLeft' : 'ArrowRight';
                const keyCode = action === 'left' ? 37 : 39;
                document.dispatchEvent(new KeyboardEvent('keydown', { key: key, keyCode: keyCode, which: keyCode, bubbles: true }));
            }
        }

        setTimeout(() => {
            updatePageIndicator();
            attachDragEvents();
        }, 150);
    }

    function handleClickFlip(imgEl, startX, info) {
        let rectWidth = window.innerWidth;
        let rectLeft = 0;
        if (imgEl && imgEl.tagName === 'IMG') {
            const rect = imgEl.getBoundingClientRect();
            rectWidth = rect.width;
            rectLeft = rect.left;
        }

        const ratio = (startX - rectLeft) / rectWidth;
        let intent = null;
        const manga = isMangaMode();

        if (ratio > 0.65) intent = manga ? 'prev' : 'next';
        else if (ratio < 0.35) intent = manga ? 'next' : 'prev';
        else return false;

        if (intent === 'prev' && info.current === 1) return false;
        if (intent === 'next' && info.current === info.total) {
            exitFromLastPageWithAnimation(document.getElementById('display'), 1);
            return true;
        }

        executePageTurn(intent);
        return true;
    }

    // ==========================================
    // 逻辑函数 (Ghost, Index Calc 等)
    // ==========================================
    function getCurrentPageIndices(info) {
       const pages = (typeof Reader !== 'undefined' && Reader.pages) || archiveData.pages || [];
       const imgs = document.querySelectorAll('#display img.reader-image');
       const result = [];
       if (pages.length === 0) {
           if (typeof info.index === 'number') return [info.index];
           return [];
       }
       imgs.forEach(img => {
           const src = img.currentSrc || img.src || '';
           let found = -1;
           for (let i = 0; i < pages.length; i++) {
               const pageUrl = pages[i];
               if (!pageUrl) continue;
               if (src === pageUrl || src.startsWith(pageUrl) || pageUrl.startsWith(src)) {
                   found = i;
                   break;
               }
           }
           if (found >= 0 && !result.includes(found)) {
               result.push(found);
           }
       });
       if (result.length === 0 && typeof info.index === 'number') {
           return [info.index];
       }
       return result.sort((a, b) => a - b);
    }

    function resolveGroupStart(minIdx) {
       if (minIdx <= 0) return 0;
       if (minIdx === 1 || minIdx === 2) return 1;
       if (minIdx % 2 === 0) return minIdx - 1;
       return minIdx;
    }

    function updateGhosts(info) {
       const display = document.getElementById('display');
       if (!display) return;
       let leftGhost = display.querySelector('.lrr-ghost-left');
       let rightGhost = display.querySelector('.lrr-ghost-right');
       if (!leftGhost) {
           leftGhost = document.createElement('div');
           leftGhost.className = 'lrr-ghost-side lrr-ghost-left';
           display.appendChild(leftGhost);
       }
       if (!rightGhost) {
           rightGhost = document.createElement('div');
           rightGhost.className = 'lrr-ghost-side lrr-ghost-right';
           display.appendChild(rightGhost);
       }
       leftGhost.innerHTML = '';
       rightGhost.innerHTML = '';
       const mainImg = document.getElementById('img') || display.querySelector('img.reader-image');
       let inheritedStyle = '';
       let baseWidth = null;
       let baseHeight = null;
       if (mainImg) {
           inheritedStyle = mainImg.getAttribute('style') || '';
           const rect = mainImg.getBoundingClientRect();
           baseWidth = rect.width;
           baseHeight = rect.height;
       }
       const manga = isMangaMode();
       const double = isDoublePageMode();
       const idx = info.index;
       const total = info.total;
       let logicalNextIndices = [];
       let logicalPrevIndices = [];
       if (double) {
           const currentIndices = getCurrentPageIndices(info);
           if (currentIndices.length === 0) {
               if (idx === 0) {
                   if (1 < total) logicalNextIndices.push(1);
                   if (2 < total) logicalNextIndices.push(2);
               } else if (idx === 1) {
                   logicalPrevIndices = [0];
                   if (idx + 2 < total) logicalNextIndices.push(idx + 2);
                   if (idx + 3 < total) logicalNextIndices.push(idx + 3);
               } else {
                   logicalPrevIndices = [idx - 2, idx - 1].filter(i => i >= 0);
                   if (idx + 2 < total) logicalNextIndices.push(idx + 2);
                   if (idx + 3 < total) logicalNextIndices.push(idx + 3);
               }
           } else {
               const minIdx = currentIndices[0];
               const groupStart = resolveGroupStart(minIdx);
               if (groupStart > 0) {
                   const prevStart = groupStart - 2;
                   if (prevStart <= 0) {
                       logicalPrevIndices = [0];
                   } else {
                       const p1 = prevStart;
                       const p2 = prevStart + 1;
                       if (p1 >= 0 && p1 < total) logicalPrevIndices.push(p1);
                       if (p2 >= 0 && p2 < total) logicalPrevIndices.push(p2);
                   }
               }
               const nextStart = groupStart === 0 ? 1 : groupStart + 2;
               if (nextStart < total) {
                   if (nextStart === 0) {
                       logicalNextIndices = [0];
                   } else {
                       const n1 = nextStart;
                       const n2 = nextStart + 1;
                       if (n1 >= 0 && n1 < total) logicalNextIndices.push(n1);
                       if (n2 >= 0 && n2 < total) logicalNextIndices.push(n2);
                   }
               }
           }
       } else {
           if (idx + 1 < total) logicalNextIndices = [idx + 1];
           if (idx - 1 >= 0) logicalPrevIndices = [idx - 1];
       }
       let leftPages = manga ? logicalNextIndices : logicalPrevIndices;
       let rightPages = manga ? logicalPrevIndices : logicalNextIndices;
       const createGhostContent = (indices) => {
           const validIndices = indices.filter(i => i >= 0 && i < total);
           if (validIndices.length === 0) return `<div class="lrr-ghost-text"></div>`;
           let html = '';
           const isDoubleView = validIndices.length > 1;
           const containerClass = isDoubleView ? 'double-view' : 'single-view';
           html += `<div class="lrr-ghost-container ${containerClass}">`;
           let sortedIndices = [...validIndices];
           if (manga && isDoubleView) {
               sortedIndices.sort((a, b) => b - a);
           } else {
               sortedIndices.sort((a, b) => a - b);
           }
           sortedIndices.forEach(i => {
               const url = getPageUrl(i);
               if (!url) return;
               let sizeStyle = '';
               if (baseWidth && baseHeight) {
                   sizeStyle = `width:${baseWidth}px; height:${baseHeight}px; max-width:none; max-height:none;`;
               }
               html += `<img src="${url}" class="reader-image lrr-ghost-img" fetchpriority="high" ` +
                       `style="${inheritedStyle}; ${sizeStyle}" loading="eager" draggable="false" />`;
           });
           html += `</div>`;
           return html;
       };
       leftGhost.innerHTML = createGhostContent(leftPages);
       rightGhost.innerHTML = createGhostContent(rightPages);
    }


    // ==========================================
    // 拖拽事件处理
    // ==========================================

    function attachDragEvents() {
        const display = document.getElementById('display');
        if (!display) return;
        if (display._lrrDragBound) return;

        const start = (e) => {
            if (!isReadingMode()) return;
            const overlay = document.getElementById('archivePagesOverlay');
            if (overlay && overlay.style.display === 'block') return;

            if (!e.target.closest('#display')) return;

            dragState.active = true;
            dragState.targetImg = e.target;
            dragState.isTouch = e.type.startsWith('touch');
            const px = dragState.isTouch ? e.touches[0].clientX : e.clientX;
            dragState.startX = px;
            dragState.currentX = px;

            if (dragState.rafId) cancelAnimationFrame(dragState.rafId);
            dragState.rafId = null;
            display.style.transition = 'none';
        };

        const move = (e) => {
            if (!dragState.active) return;
            if (dragState.isTouch && e.cancelable) e.preventDefault();

            const px = dragState.isTouch ? e.touches[0].clientX : e.clientX;
            dragState.currentX = px;

            if (!dragState.rafId) {
                dragState.rafId = requestAnimationFrame(() => {
                    const gesture = dragState.currentX - dragState.startX;
                    const width = window.innerWidth || 1;

                    let ratio = gesture / width;
                    if (ratio > MAX_DRAG_RATIO) ratio = MAX_DRAG_RATIO;
                    if (ratio < -MAX_DRAG_RATIO) ratio = -MAX_DRAG_RATIO;

                    if (display) display.style.transform = `translateX(${ratio * width}px)`;
                    dragState.rafId = null;
                });
            }
        };

        const end = (e) => {
            if (!dragState.active) return;
            dragState.active = false;
            if (dragState.rafId) cancelAnimationFrame(dragState.rafId);
            dragState.rafId = null;

            const width = window.innerWidth || 1;
            const gesture = dragState.currentX - dragState.startX;
            const absRatio = Math.abs(gesture) / width;
            const info = getPageInfo();

            const resetPosition = () => {
                requestAnimationFrame(() => {
                    display.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
                    display.style.transform = 'translateX(0px)';
                });
            };

            // 点击判断 (移动微小)
            if (absRatio < CLICK_THRESHOLD_RATIO) {
                resetPosition();
                const didFlip = handleClickFlip(dragState.targetImg, dragState.startX, info);
                if (dragState.isTouch && didFlip) {
                      if (e && e.cancelable) e.preventDefault();
                }
                return;
            }

            if (absRatio < SWIPE_THRESHOLD_RATIO) {
                resetPosition();
                return;
            }

            // 滑动翻页
            let intent;
            if (isMangaMode()) {
                 intent = gesture > 0 ? 'next' : 'prev';
            } else {
                 intent = gesture < 0 ? 'next' : 'prev';
            }

            if (intent === 'prev' && info.current === 1) {
                resetPosition();
                return;
            }
            if (intent === 'next' && info.current === info.total) {
                exitFromLastPageWithAnimation(display, gesture < 0 ? -1 : 1);
                return;
            }

            requestAnimationFrame(() => {
                display.style.transition = 'transform 0.25s ease-out';
                const exitX = (gesture < 0 ? -1 : 1) * width;
                display.style.transform = `translateX(${exitX}px)`;
            });

            setTimeout(() => {
                executePageTurn(intent);
                display.style.transition = 'none';
                display.style.transform = 'translateX(0px)';
                void display.offsetWidth;
                display.style.transition = 'transform 0.2s ease-out';
            }, 250);
        };

        display.addEventListener('mousedown', start);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);

        display.addEventListener('touchstart', start, { passive: false });
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('touchend', end);

        display._lrrDragBound = true;
        display._lrrDragHandlers = { start, move, end };
    }

    function detachDragEvents() {
        const display = document.getElementById('display');
        if (!display || !display._lrrDragBound || !display._lrrDragHandlers) return;
        const h = display._lrrDragHandlers;

        display.removeEventListener('mousedown', h.start);
        window.removeEventListener('mousemove', h.move);
        window.removeEventListener('mouseup', h.end);

        display.removeEventListener('touchstart', h.start);
        window.removeEventListener('touchmove', h.move);
        window.removeEventListener('touchend', h.end);

        display.style.transform = '';
        display.style.transition = '';
        display._lrrDragBound = false;
        delete display._lrrDragHandlers;

        const ghosts = display.querySelectorAll('.lrr-ghost-side');
        ghosts.forEach(el => el.remove());
    }

    function setReadingMode(enable) {
        document.body.classList.toggle(BODY_READING_CLASS, enable);
        document.documentElement.classList.toggle(BODY_READING_CLASS, enable);
        const btn = document.getElementById(BUTTON_ID);
        const tb = document.getElementById(THUMB_BUTTON_ID);

        // 初始化布局
        applyLayoutSettings();

        if (btn) {
            // 修改点：退出按钮变成叉，进入按钮变成书本
            btn.innerHTML = enable ? '✕' : '📖';
            // 非阅读模式下检查是否自动开启
            btn.style.borderColor = userSettings.autoEnter ? '#4CAF50' : 'rgba(255,255,255,0.3)';
            btn.classList.remove('hide-on-scroll');
        }

        if (enable) {
            initPageData();
            hookReaderFunctions();

            if (btn) { btn.style.opacity = '0'; btn.style.pointerEvents = 'none'; btn.style.visibility = 'hidden'; }
            if (tb) { tb.style.opacity = '0'; tb.style.pointerEvents = 'none'; tb.style.visibility = 'hidden'; }
            if (btnHideTimer) clearTimeout(btnHideTimer);

            updatePageIndicator();
            attachDragEvents();
            setupClickBlocker(true);

            // 清理内联样式
            const mainImg = document.getElementById('img');
            const dblImg = document.getElementById('img_doublepage');
            [mainImg, dblImg].forEach(el => { if (el) el.removeAttribute('style'); });

            updateGhosts(getPageInfo());
        } else {
            if (btnHideTimer) clearTimeout(btnHideTimer);

            // 退出时，主按钮恢复显示，缩略图按钮隐藏
            if (btn) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; btn.style.visibility = 'visible'; }
            if (tb) { tb.style.opacity = '0'; tb.style.pointerEvents = 'none'; tb.style.visibility = 'hidden'; }

            detachDragEvents();
            setupClickBlocker(false);
            closeThumbnailOverlay();

            if (typeof Reader !== 'undefined' && Reader.applyContainerWidth) {
                Reader.applyContainerWidth();
            }
        }
    }

    // -------- 初始化 --------

    function createControls() {
        if (document.getElementById(BUTTON_ID)) return;

        const btn = document.createElement('div');
        btn.id = BUTTON_ID;
        btn.innerHTML = '📖';
        btn.title = '切换阅读模式 (长按设置)';
        
        // 修改点：拦截按钮上的右键/长按菜单，防止移动端误触
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            setReadingMode(!isReadingMode());
        });

        let pressTimer;
        // 长按改为打开设置
        const startPress = () => pressTimer = setTimeout(openSettingsModal, 800);
        const cancelPress = () => clearTimeout(pressTimer);
        btn.addEventListener('mousedown', startPress);
        btn.addEventListener('mouseup', cancelPress);
        btn.addEventListener('mouseleave', cancelPress);
        btn.addEventListener('touchstart', startPress);
        btn.addEventListener('touchend', cancelPress);

        const thumbBtn = document.createElement('div');
        thumbBtn.id = THUMB_BUTTON_ID;
        thumbBtn.innerHTML = '☰';
        
        // 缩略图按钮也添加同样的防护
        thumbBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        thumbBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openThumbnailOverlay();
        });

        const indicator = document.createElement('div');
        indicator.id = PAGE_INDICATOR_ID;

        const hitRight = document.createElement('div'); hitRight.id = HITAREA_ID;
        const hitLeft = document.createElement('div'); hitLeft.id = LEFT_HITAREA_ID;

        document.body.append(btn, thumbBtn, indicator, hitRight, hitLeft);

        // 热区触发逻辑：根据位置设置代理到不同按钮
        hitRight.addEventListener('click', (e) => { e.stopPropagation(); handleRightAreaTrigger(); });
        hitLeft.addEventListener('click', (e) => { e.stopPropagation(); handleLeftAreaTrigger(); });

        window.addEventListener('mousemove', (e) => {
            if (!isReadingMode()) return;
            const isBottom = e.clientY > window.innerHeight * (1 - CORNER_HEIGHT_RATIO);
            if (!isBottom) return;

            const isLeft = e.clientX < window.innerWidth * CORNER_WIDTH_RATIO;
            const isRight = e.clientX > window.innerWidth * (1 - CORNER_WIDTH_RATIO);

            if (isLeft) handleLeftAreaTrigger();
            else if (isRight) handleRightAreaTrigger();
        });

        window.addEventListener('scroll', handleScroll);
    }

    function init() {
        loadSettings();
        injectStyle();
        createControls();
        initPageData();

        // 首次加载应用布局设置
        applyLayoutSettings();

        if (userSettings.autoEnter && !isReadingMode()) setTimeout(() => setReadingMode(true), 500);

        const paginator = document.querySelector('.paginator') || document.querySelector('.current-page');
        if (paginator) {
            new MutationObserver(updatePageIndicator).observe(paginator, { childList: true, subtree: true, characterData: true });
        }
    }

    const timer = setInterval(() => {
        if (looksLikeReader() && document.body) {
            clearInterval(timer);
            init();
        }
    }, 200);

})();