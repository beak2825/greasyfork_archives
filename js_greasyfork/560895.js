// ==UserScript==
// @name         LANraragi 阅读模式
// @namespace    https://github.com/Kelcoin
// @version      4.2
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
    const HITAREA_ID = 'lrr-reading-hitarea';        // 右侧热区
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
        pageGap: 0,
        thumbLayout: 'mirror' // 'mirror' (对侧) | 'stacked' (同侧上方)
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
    let originalGoToPage = null;
    let readingSessionId = 0;

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
            mainBtn.style.left = ''; mainBtn.style.right = ''; mainBtn.style.bottom = '';
            thumbBtn.style.left = ''; thumbBtn.style.right = ''; thumbBtn.style.bottom = '';

            const isRight = userSettings.btnPosition === 'right';
            const isStacked = userSettings.thumbLayout === 'stacked';

            // 1. 设置主按钮位置 (始终在底部30px)
            if (isRight) {
                mainBtn.style.right = '15px';
            } else {
                mainBtn.style.left = '15px';
            }
            mainBtn.style.bottom = '30px';

            // 2. 设置缩略图按钮位置
            if (isStacked) {
                // 同侧堆叠模式：位置同主按钮，但高度增加
                if (isRight) thumbBtn.style.right = '15px';
                else thumbBtn.style.left = '15px';
                
                // 主按钮30px底 + 48px高 + 间距(约15px) -> 约95px
                thumbBtn.style.bottom = '95px';
            } else {
                // 镜像模式：在另一侧，高度同主按钮
                if (isRight) thumbBtn.style.left = '15px';
                else thumbBtn.style.right = '15px';
                
                thumbBtn.style.bottom = '30px';
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

    function hookReaderFunctions(enableHook) {
        if (typeof Reader === 'undefined') return;

        // === 关闭 hook（退出阅读模式时用）===
        if (enableHook === false) {
            if (originalApplyContainerWidth) {
                Reader.applyContainerWidth = originalApplyContainerWidth;
                originalApplyContainerWidth = null;
            }
            if (originalGoToPage) {
                Reader.goToPage = originalGoToPage;
                originalGoToPage = null;
            }
            return;
        }

        // === 开启 hook（进入阅读模式时用）===

        // 1) hook applyContainerWidth：在阅读模式中阻止它乱调图片/容器，退出后彻底还原
        if (Reader.applyContainerWidth && !originalApplyContainerWidth) {
            originalApplyContainerWidth = Reader.applyContainerWidth;
            Reader.applyContainerWidth = function() {
                // 阅读模式下，由我们的 CSS 接管图片/容器尺寸，不让原生逻辑插手
                if (document.body.classList.contains(BODY_READING_CLASS)) {
                    $(".reader-image, .sni").attr("style", "");
                    return;
                }
                // 非阅读模式下：完全走原生逻辑
                return originalApplyContainerWidth.apply(this, arguments);
            };
        }

        // 2) hook goToPage：阅读模式下增加“等图片加载完成再刷新自定义 UI”
        if (Reader.goToPage && !originalGoToPage) {
            originalGoToPage = Reader.goToPage.bind(Reader);
            Reader.goToPage = function(pageIndex) {
                originalGoToPage(pageIndex);

                // 非阅读模式：完全不追加逻辑
                if (!isReadingMode || !isReadingMode()) return;

                waitForPageImageLoaded(pageIndex).then((loaded) => {
                    // 会话已结束或图片没成功加载：直接退出
                    if (!isReadingMode || !isReadingMode()) return;
                    if (!loaded) return;

                    const info = getPageInfo();
                    updatePageIndicator();
                    updateGhosts(info);
                });
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

    // 等待指定页的主图加载完成后再继续（带会话防护）
    // 依赖全局变量：let readingSessionId = 0; （每次进入阅读模式递增，在退出时设为 0）
    function waitForPageImageLoaded(pageIndex, timeout = 5000) {
        // 记录调用时所属的阅读会话 id
        const sessionId = typeof readingSessionId !== 'undefined' ? readingSessionId : 0;

        return new Promise((resolve) => {
            // 如果调用时就已经不在有效阅读会话中，直接视为失败/取消
            if (!sessionId || sessionId !== readingSessionId || !document.body.classList.contains(BODY_READING_CLASS)) {
                resolve(false);
                return;
            }

            const display = document.getElementById('display');
            if (!display) {
                resolve(false);
                return;
            }

            const targetUrl = getPageUrl(pageIndex);
            if (!targetUrl) {
                resolve(false);
                return;
            }

            // 当前 Reader 主图（单页或双页）
            const mainImg =
                document.getElementById('img') ||
                display.querySelector('img.reader-image');

            if (!mainImg) {
                resolve(false);
                return;
            }

            const isTargetSrc = () => {
                const src = mainImg.currentSrc || mainImg.src || '';
                return src === targetUrl ||
                       src.startsWith(targetUrl) ||
                       targetUrl.startsWith(src);
            };

            // 已是目标图且加载完
            if (isTargetSrc() && mainImg.complete && mainImg.naturalWidth > 0) {
                // 只有在会话仍然有效且仍在阅读模式时才算成功
                if (sessionId && sessionId === readingSessionId && document.body.classList.contains(BODY_READING_CLASS)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
                return;
            }

            let done = false;

            const cleanup = () => {
                if (done) return;
                done = true;
                mainImg.removeEventListener('load', onLoad);
                mainImg.removeEventListener('error', onError);
            };

            const onLoad = () => {
                // 会话已失效或已退出阅读模式：视为取消
                if (!sessionId || sessionId !== readingSessionId || !document.body.classList.contains(BODY_READING_CLASS)) {
                    cleanup();
                    resolve(false);
                    return;
                }

                if (isTargetSrc()) {
                    cleanup();
                    resolve(true);
                }
            };

            const onError = () => {
                cleanup();
                resolve(false);
            };

            mainImg.addEventListener('load', onLoad);
            mainImg.addEventListener('error', onError);

            // 超时兜底，防止卡死
            setTimeout(() => {
                if (done) return;
                cleanup();

                // 超时时如果会话已失效或已退出阅读模式，同样视为取消，不触发任何后续刷新
                if (!sessionId || sessionId !== readingSessionId || !document.body.classList.contains(BODY_READING_CLASS)) {
                    resolve(false);
                } else {
                    resolve(false);
                }
            }, timeout);
        });
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

                /* 强制修复缩略图点击 */
                body.${BODY_READING_CLASS} #archivePagesOverlay .quick-thumbnail,
                body.${BODY_READING_CLASS} #archivePagesOverlay .quick-thumbnail * {
                    pointer-events: auto !important;
                    cursor: pointer !important;
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

                /* 浮动按钮样式（统一玻璃风格） */
                #${BUTTON_ID}, #${THUMB_BUTTON_ID} {
                    position: fixed;
                    z-index: 200000;
                    bottom: 30px;
                    width: 48px;
                    height: 48px;
                    border-radius: 999px;
                    background: var(--glass-bg, rgba(28, 30, 36, 0.96));
                    border: 1px solid var(--glass-border, rgba(140,160,190,0.28));
                    backdrop-filter: blur(8px);
                    color: var(--text-primary, #e3e9f3);
                    font-size: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: var(--shadow-soft, 0 10px 28px -8px rgba(5,10,25,0.72));
                    transition: var(--transition-smooth, all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1));

                    -webkit-user-select: none;
                    user-select: none;
                    -webkit-touch-callout: none;
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                }
                #${BUTTON_ID}:hover,
                #${THUMB_BUTTON_ID}:hover {
                    background: var(--glass-bg-hover, rgba(40,43,52,0.98));
                    box-shadow: var(--shadow-hover, 0 14px 34px -6px rgba(5,12,32,0.9));
                    transform: translateY(-2px);
                }
                #${BUTTON_ID}:active,
                #${THUMB_BUTTON_ID}:active {
                    transform: scale(0.94);
                    background: rgba(50,50,50,0.9);
                    box-shadow: var(--shadow-card, 0 4px 18px rgba(0,0,0,0.36));
                }

                #${THUMB_BUTTON_ID} {
                    font-size: 18px;
                    opacity: 0;
                    pointer-events: none;
                    visibility: hidden;
                }

                /* 阅读模式隐藏状态：完全移除交互 */
                body.${BODY_READING_CLASS} #${BUTTON_ID},
                body.${BODY_READING_CLASS} #${THUMB_BUTTON_ID} {
                    opacity: 0;
                    pointer-events: none;
                    visibility: hidden;
                }

                /* 非阅读模式下主按钮显示 */
                body:not(.${BODY_READING_CLASS}) #${BUTTON_ID} {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                    visibility: visible !important;
                }
                body:not(.${BODY_READING_CLASS}) #${BUTTON_ID}.hide-on-scroll {
                    transform: translateY(100px);
                    opacity: 0 !important;
                }

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

                    left: 50%;
                    transform: translateX(-50%);
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
                    text-align: center;
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

                /* --- 设置面板样式（玻璃卡片 + 分区布局） --- */
                #${SETTINGS_MODAL_ID} {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0,0,0,0.5);
                    z-index: 200001;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(6px);

                    -webkit-user-select: none !important;
                    user-select: none !important;
                }

                .lrr-settings-content {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;

                    background: var(--glass-bg, rgba(28,30,36,0.96));
                    color: var(--text-primary, #e3e9f3);
                    width: 320px;
                    max-width: calc(100vw - 32px);
                    padding: 18px 18px 14px;
                    border-radius: var(--radius-lg, 16px);
                    border: 1px solid var(--glass-border, rgba(140,160,190,0.28));
                    box-shadow: var(--shadow-soft, 0 10px 28px -8px rgba(5,10,25,0.72));
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    box-sizing: border-box;
                    text-align: left; /* 整体文本左对齐 */
                }

                .lrr-settings-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(120, 135, 160, 0.38);
                    text-align: left;
                }

                .lrr-settings-header-main {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    text-align: left;
                }

                .lrr-settings-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--text-primary, #e3e9f3);
                    text-align: left;
                }

                .lrr-settings-subtitle {
                    font-size: 11px;
                    color: var(--text-secondary, #a7b1c2);
                    opacity: 0.9;
                    text-align: left;
                }

                .lrr-settings-close {
                    cursor: pointer;
                    font-size: 18px;
                    line-height: 1;
                    width: 24px;
                    height: 24px;
                    border-radius: 999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-secondary, #a7b1c2);
                    background: transparent;
                    transition: var(--transition-smooth, all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1));
                }

                .lrr-settings-close:hover {
                    background: rgba(255,255,255,0.06);
                    color: var(--text-primary, #e3e9f3);
                }

                /* 分组布局：开关一组，输入/选择一组 */
                .lrr-settings-body {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px 16px;
                    max-height: min(60vh, 420px);
                    padding-right: 2px;
                    margin-right: -4px;
                    overflow-y: auto;
                }

                /* 标记为开关项的放在左侧列，输入/选择项放在右侧列（宽屏时） */
                @media (min-width: 560px) {
                    .lrr-settings-body {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .lrr-setting-item--switch,
                    .lrr-setting-item--toggle {
                        grid-column: 1;
                    }

                    .lrr-setting-item--field,
                    .lrr-setting-item--input,
                    .lrr-setting-item--select {
                        grid-column: 2;
                    }
                }

                .lrr-settings-section {
                    padding-top: 8px;
                    margin-top: 2px;
                    border-top: 1px solid rgba(120, 135, 160, 0.26);
                    text-align: left;
                }

                .lrr-settings-section-title {
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                    color: var(--text-secondary, #a7b1c2);
                    margin-bottom: 6px;
                    text-align: left;
                }

                .lrr-setting-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 6px 0;
                    text-align: left;
                }

                .lrr-setting-label-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    text-align: left;
                }

                .lrr-setting-label {
                    font-size: 13px;
                    color: var(--text-primary, #e3e9f3);
                    text-align: left;
                }

                .lrr-setting-hint {
                    font-size: 11px;
                    color: var(--text-secondary, #a7b1c2);
                    opacity: 0.9;
                    text-align: left;
                }

                .lrr-setting-input-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    margin-top: 2px;
                    text-align: left;
                }

                /* 开关 */
                .lrr-switch {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    width: 40px;
                    height: 20px;
                }
                .lrr-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .lrr-slider {
                    position: absolute;
                    cursor: pointer;
                    inset: 0;
                    background-color: #444b57;
                    border-radius: 20px;
                    transition: var(--transition-smooth, all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1));
                    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.4);
                }
                .lrr-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 2px;
                    bottom: 2px;
                    background-color: #fafbff;
                    border-radius: 50%;
                    transition: var(--transition-smooth, all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1));
                    box-shadow: 0 2px 6px rgba(0,0,0,0.45);
                }
                input:checked + .lrr-slider {
                    background: linear-gradient(135deg, var(--accent-color, #4a9ff0), #6cc9ff);
                    box-shadow: 0 0 0 1px rgba(74,159,240,0.6);
                }
                input:checked + .lrr-slider:before {
                    transform: translateX(20px);
                }

                /* 选择器与输入框 */
                .lrr-select,
                .lrr-input {
                    background: rgba(18, 20, 26, 0.9);
                    color: var(--text-primary, #e3e9f3);
                    border: 1px solid rgba(114, 132, 160, 0.7);
                    padding: 5px 8px;
                    border-radius: var(--radius-sm, 6px);
                    width: 100%;
                    box-sizing: border-box;
                    font-size: 12px;
                    outline: none;
                    transition: var(--transition-smooth, all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1));
                    text-align: left; /* 输入框文本左对齐 */
                }

                /* 选择框内文字单独居中对齐 */
                .lrr-select {
                    text-align: center;
                    text-align-last: center;
                }

                .lrr-select:focus,
                .lrr-input:focus {
                    border-color: var(--accent-color, #4a9ff0);
                    box-shadow: 0 0 0 1px rgba(74,159,240,0.65);
                    background: rgba(22, 25, 32, 0.98);
                }

                .lrr-select::placeholder,
                .lrr-input::placeholder {
                    color: rgba(160, 172, 192, 0.8);
                }

                /* 数字输入框：强制纯文本样式，去掉右侧加减按钮 */
                .lrr-input[type="number"] {
                    -moz-appearance: textfield;
                }
                .lrr-input[type="number"]::-webkit-inner-spin-button,
                .lrr-input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                /* 底部轻量说明区域（可选） */
                .lrr-settings-footer {
                    margin-top: 4px;
                    padding-top: 8px;
                    border-top: 1px dashed rgba(120, 135, 160, 0.26);
                    font-size: 10px;
                    color: var(--text-secondary, #a7b1c2);
                    display: flex;
                    justify-content: space-between;
                    gap: 8px;
                    opacity: 0.9;
                    text-align: left;
                }

                @media (max-width: 480px) {
                    .lrr-settings-content {
                        width: calc(100vw - 24px);
                        padding: 16px 14px 12px;
                        border-radius: 14px;
                    }
                    .lrr-settings-body {
                        max-height: min(65vh, 460px);
                        grid-template-columns: 1fr;
                    }
                }
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
                    </div>

                    <div class="lrr-setting-item">
                        <div class="lrr-setting-input-row">
                            <span class="lrr-setting-label" style="margin:0">缩略图按钮: 显示在主按钮上方</span>
                            <label class="lrr-switch">
                                <input type="checkbox" id="lrr-cfg-stacked">
                                <span class="lrr-slider"></span>
                            </label>
                        </div>
                        <div style="font-size:12px; color:#888; margin-top:4px;">关闭则默认显示在主按钮对侧</div>
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
            const elStacked = document.getElementById('lrr-cfg-stacked');

            elAuto.addEventListener('change', (e) => { userSettings.autoEnter = e.target.checked; saveSettings(); });
            elPos.addEventListener('change', (e) => { userSettings.btnPosition = e.target.value; saveSettings(); });
            elGap.addEventListener('change', (e) => { userSettings.pageGap = parseInt(e.target.value) || 0; saveSettings(); });
            elStacked.addEventListener('change', (e) => { 
                userSettings.thumbLayout = e.target.checked ? 'stacked' : 'mirror'; 
                saveSettings(); 
            });
        }

        // 同步当前值
        document.getElementById('lrr-cfg-auto').checked = userSettings.autoEnter;
        document.getElementById('lrr-cfg-pos').value = userSettings.btnPosition;
        document.getElementById('lrr-cfg-gap').value = userSettings.pageGap;
        document.getElementById('lrr-cfg-stacked').checked = userSettings.thumbLayout === 'stacked';

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

        // 修复核心：如果点击发生在缩略图覆盖层或遮罩上，直接放行，不要拦截
        if (e.target.closest('#archivePagesOverlay') || e.target.closest('.lrr-thumb-backdrop')) {
            return;
        }

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
                
                // 覆盖层点击事件拦截（捕获阶段）
                if (!overlay._hasDelegatedClick) {
                    overlay.addEventListener('click', function(e) {
                        const thumb = e.target.closest('.quick-thumbnail');
                        
                        // 1. 处理缩略图点击
                        if (thumb) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation(); // 阻止其他监听器

                            const pageAttr = thumb.getAttribute('page');
                            if (pageAttr !== null) {
                                const pageIndex = parseInt(pageAttr, 10);

                                // 调用 LRR 原生翻页
                                // 保持你当前的约定：直接传 pageIndex
                                if (typeof Reader !== 'undefined' && Reader.goToPage) {
                                    Reader.goToPage(pageIndex);
                                }

                                // 立即关闭覆盖层
                                closeThumbnailOverlay();

                                // 关键变化：不再立即 mock 刷新，而是等待目标页图片真正加载完成
                                waitForPageImageLoaded(pageIndex).then(() => {
                                    const info = getPageInfo();
                                    updatePageIndicator();
                                    updateGhosts(info);
                                });

                                return;
                            }
                        }

                        // 2. 处理背景或其他点击（关闭面板）
                        if (e.target.closest('.id3') || e.target.tagName === 'A' || e.target.tagName === 'IMG') {
                            if (!thumb) {
                                setTimeout(closeThumbnailOverlay, 50);
                            }
                        }
                    }, true); // 使用捕获阶段
                    
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
                // 350ms 后恢复交互
                if (btn._warmupTimer) clearTimeout(btn._warmupTimer);
                btn._warmupTimer = setTimeout(() => {
                    // 确保此时按钮仍然应该是显示状态
                    if (btn.style.opacity === '1') {
                        btn.style.pointerEvents = 'auto';
                    }
                }, 350);
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
        const isStacked = userSettings.thumbLayout === 'stacked';
        if (isStacked) {
            // 堆叠模式：如果主按钮在右侧，则显示两个；否则显示空（或看需求，这里假设堆叠都在同一侧显示）
            if (userSettings.btnPosition === 'right') {
                tempShowButton(BUTTON_ID);
                tempShowButton(THUMB_BUTTON_ID);
            } else {
                // 主按钮在左，右侧无按钮
            }
        } else {
            // 镜像模式
            if (userSettings.btnPosition === 'right') tempShowButton(BUTTON_ID);
            else tempShowButton(THUMB_BUTTON_ID);
        }
    }

    // 触发左侧区域逻辑
    function handleLeftAreaTrigger() {
        const isStacked = userSettings.thumbLayout === 'stacked';
        if (isStacked) {
            // 堆叠模式：如果主按钮在左侧，则显示两个
            if (userSettings.btnPosition === 'left') {
                tempShowButton(BUTTON_ID);
                tempShowButton(THUMB_BUTTON_ID);
            } else {
                // 主按钮在右，左侧无按钮
            }
        } else {
            // 镜像模式
            if (userSettings.btnPosition === 'right') tempShowButton(THUMB_BUTTON_ID);
            else tempShowButton(BUTTON_ID);
        }
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

       // 获取用户设置的 preloadCount，限制在 1-10 之间
       let nextLimit = 10;
       try {
           const storedLimit = parseInt(localStorage.getItem('preloadCount') || '10', 10);
           if (!isNaN(storedLimit)) {
               nextLimit = Math.min(10, Math.max(1, storedLimit));
           }
       } catch(e) {}

       if (double) {
           const currentIndices = getCurrentPageIndices(info);
           if (currentIndices.length === 0) {
               // Fallback if autodetection fails
               if (idx === 0) {
                    // Next (dynamic)
                    let nextCursor = 1;
                    while (logicalNextIndices.length < nextLimit && nextCursor < total) {
                        logicalNextIndices.push(nextCursor);
                        nextCursor++;
                    }
               } else if (idx === 1) {
                   logicalPrevIndices = [0]; // Prev 始终为 1-2 张
                   // Next (dynamic)
                   let nextCursor = idx + 2;
                   while (logicalNextIndices.length < nextLimit && nextCursor < total) {
                       logicalNextIndices.push(nextCursor);
                       nextCursor++;
                   }
               } else {
                   logicalPrevIndices = [idx - 2, idx - 1].filter(i => i >= 0);
                   // Next (dynamic)
                   let nextCursor = idx + 2;
                   while (logicalNextIndices.length < nextLimit && nextCursor < total) {
                        logicalNextIndices.push(nextCursor);
                        nextCursor++;
                   }
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
                       // Next Loop (dynamic)
                       let cursor = nextStart;
                       while(logicalNextIndices.length < nextLimit && cursor < total) {
                            if (cursor >= 0) logicalNextIndices.push(cursor);
                            cursor++;
                       }
                   }
               }
           }
       } else {
           // Single Page Mode
           // Next Loop
           let cursor = idx + 1;
           while(logicalNextIndices.length < nextLimit && cursor < total) {
               logicalNextIndices.push(cursor);
               cursor++;
           }
           // Prev Fixed
           if (idx - 1 >= 0) logicalPrevIndices = [idx - 1];
       }

       let leftPages = manga ? logicalNextIndices : logicalPrevIndices;
       let rightPages = manga ? logicalPrevIndices : logicalNextIndices;

       const createGhostContent = (indices) => {
           const validIndices = indices.filter(i => i >= 0 && i < total);
           if (validIndices.length === 0) return `<div class="lrr-ghost-text"></div>`;
           
           let html = '';
           // Container class determines flex-basis (50% or 100%)
           // 这里我们只关心“可见”的幽灵页是否是双页，预加载的那些不应该影响布局
           const visibleCount = double ? 2 : 1;
           // 只要有至少两个有效索引，我们就先用 double-view 的容器样式（让每个图占50%）
           // 然后在下面把多余的图隐藏掉
           const isVisualDouble = double && validIndices.length > 1; 
           const containerClass = isVisualDouble ? 'double-view' : 'single-view';
           
           html += `<div class="lrr-ghost-container ${containerClass}">`;
           let sortedIndices = [...validIndices];
           
           // Sort order
           if (manga && isVisualDouble) {
               sortedIndices.sort((a, b) => b - a);
           } else {
               sortedIndices.sort((a, b) => a - b);
           }
           
           sortedIndices.forEach((pageIdx, loopIndex) => {
               const url = getPageUrl(pageIdx);
               if (!url) return;
               
               let sizeStyle = '';
               if (baseWidth && baseHeight) {
                   sizeStyle = `width:${baseWidth}px; height:${baseHeight}px; max-width:none; max-height:none;`;
               }

               // 核心逻辑：只显示前1或2张（作为即时视觉反馈），后续图片设为display:none进行静默预加载
               let visibilityStyle = '';
               if (loopIndex >= visibleCount) {
                   visibilityStyle = 'display: none !important;';
               }

               // 自动重载脚本：加载失败后1秒重试
               const onErrorScript = "this.onerror=null; setTimeout(()=>{ const curr = this.src; this.src = ''; this.src = curr; }, 1000);";

               html += `<img src="${url}" class="reader-image lrr-ghost-img" fetchpriority="low" ` +
                       `style="${inheritedStyle}; ${sizeStyle} ${visibilityStyle}" loading="eager" draggable="false" ` +
                       `onerror="${onErrorScript}" />`;
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
        // 切换阅读模式标记（控制整页 CSS）
        document.body.classList.toggle(BODY_READING_CLASS, enable);
        document.documentElement.classList.toggle(BODY_READING_CLASS, enable);

        const btn = document.getElementById(BUTTON_ID);
        const tb = document.getElementById(THUMB_BUTTON_ID);

        // 按钮状态（无论进/出模式都要更新）
        if (btn) {
            // 进入模式：✕，退出模式：📖
            btn.innerHTML = enable ? '✕' : '📖';
            // 非阅读模式下根据自动进入状态调整边框颜色
            btn.style.borderColor = userSettings.autoEnter ? '#4CAF50' : 'rgba(255,255,255,0.3)';
            btn.classList.remove('hide-on-scroll');
        }

        if (enable) {
            // === 进入阅读模式 ===

            // 先挂上 hook：拦截 applyContainerWidth / goToPage
            hookReaderFunctions(true);

            // 应用阅读模式布局（你的自定义 flex/fixed/全屏等）
            if (typeof applyLayoutSettings === 'function') {
                applyLayoutSettings();
            }

            initPageData();

            // 进入阅读模式后隐藏按钮
            if (btn) {
                btn.style.opacity = '0';
                btn.style.pointerEvents = 'none';
                btn.style.visibility = 'hidden';
            }
            if (tb) {
                tb.style.opacity = '0';
                tb.style.pointerEvents = 'none';
                tb.style.visibility = 'hidden';
            }
            if (btnHideTimer) clearTimeout(btnHideTimer);

            updatePageIndicator();
            attachDragEvents();
            setupClickBlocker(true);

            // 清理 Reader 在主图上的内联样式，让阅读模式 CSS 接管
            const mainImg = document.getElementById('img');
            const dblImg = document.getElementById('img_doublepage');
            [mainImg, dblImg].forEach(el => { if (el) el.removeAttribute('style'); });

            updateGhosts(getPageInfo());
        } else {
            // === 退出阅读模式 ===

            if (btnHideTimer) clearTimeout(btnHideTimer);

            // 主按钮恢复，缩略图按钮隐藏
            if (btn) {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                btn.style.visibility = 'visible';
            }
            if (tb) {
                tb.style.opacity = '0';
                tb.style.pointerEvents = 'none';
                tb.style.visibility = 'hidden';
            }

            detachDragEvents();
            setupClickBlocker(false);
            closeThumbnailOverlay();

            // 关键：先彻底取消对 Reader 的 hook，
            // 让后续的 applyContainerWidth / goToPage 完全走原生逻辑
            hookReaderFunctions(false);

            // 此时 BODY_READING_CLASS 已经移除，CSS 回到原生 reader 样式
            // 这里调用一次原生 applyContainerWidth，由 LRR 自己恢复图片和容器尺寸
            if (typeof Reader !== 'undefined' && typeof Reader.applyContainerWidth === 'function') {
                Reader.applyContainerWidth();
            }

            // 不要再额外改 #i3/#display 的宽度或样式，
            // 避免再次叠加你自己的布局规则和 LRR 的布局规则。
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