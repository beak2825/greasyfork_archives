// ==UserScript==
// @name         LANraragi 阅读模式
// @namespace    https://github.com/Kelcoin
// @version      4.5.1
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
    const AUTO_BTN_ID = 'lrr-reading-auto-btn';
    const PAGE_INDICATOR_ID = 'lrr-reading-page-indicator';
    const HITAREA_ID = 'lrr-reading-hitarea';
    const STYLE_ID = 'lrr-reading-style-v4';
    const BODY_READING_CLASS = 'lrr-reading-mode';
    const SETTINGS_MODAL_ID = 'lrr-reading-settings-modal';

    // 交互参数
    const MAX_DRAG_RATIO = 1.0;
    const CLICK_THRESHOLD_RATIO = 0.01;  //点击翻页灵敏度
    const SWIPE_THRESHOLD_RATIO = 0.1;   //滑动翻页灵敏度
    const CORNER_HEIGHT_RATIO = 0.15;
    const DOUBLE_TAP_DELAY = 250; // 双击判定最大间隔 (毫秒)
    const ZOOM_ANIM_SPEED = '0.2s'; // 缩放动画耗时 (秒)

    // 默认设置
    const DEFAULT_SETTINGS = {
        autoEnter: false,
        btnPosition: 'right',
        pageGap: 0,
        expandDirection: 'up', // 默认向上展开
        autoTurnInterval: 3
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
    let btnHideTimer = null;
    let lastScrollTop = 0;
    let originalApplyContainerWidth = null;
    let originalGoToPage = null;
    let readingSessionId = 0;
    let indicatorHideTimer = null;
    let inputBlockUntil = 0;
    let imgResizeObserver = null;

    // 自动翻页状态
    let autoTurnState = {
        active: false,
        timer: null
    };

    // 缩放状态管理
    let zoomState = {
        scale: 1,
        panX: 0,
        panY: 0,
        initialDistance: 0,
        initialScale: 1
    };

    // 数据缓存
    let archiveData = {
        pages: [],
        loaded: false
    };

    // ==========================================
    //                 设置管理
    // ==========================================

    function loadSettings() {
        try {
            const stored = localStorage.getItem('lrr_reading_settings');
            if (stored) {
                userSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
            } else {
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
            localStorage.setItem('lrr_auto_read', userSettings.autoEnter ? '1' : '0');
        } catch (e) { }
        applyLayoutSettings();
        // 如果正在自动翻页，更新间隔
        if (autoTurnState.active) {
            stopAutoTurn();
            startAutoTurn();
        }
    }

    // 应用布局设置
    function applyLayoutSettings() {
        const mainBtn = document.getElementById(BUTTON_ID);
        const thumbBtn = document.getElementById(THUMB_BUTTON_ID);
        const autoBtn = document.getElementById(AUTO_BTN_ID);
        const display = document.getElementById('display');
        const hitArea = document.getElementById(HITAREA_ID);

        const oldAutoHit = document.getElementById('lrr-reading-auto-hitarea');
        if (oldAutoHit) oldAutoHit.style.display = 'none';

        const isRight = userSettings.btnPosition === 'right';

        // 1. 设置按钮锚点
        [mainBtn, thumbBtn, autoBtn].forEach(btn => {
            if (!btn) return;
            btn.style.left = ''; btn.style.right = ''; btn.style.top = ''; btn.style.bottom = '';
            btn.style.transform = '';

            btn.style.bottom = '30px';
            if (isRight) {
                btn.style.right = '15px';
            } else {
                btn.style.left = '15px';
            }
        });

        // 2. 动态设置热区位置
        if (hitArea) {
            // 先重置，防止 CSS 干扰
            hitArea.style.left = 'auto';
            hitArea.style.right = 'auto';

            if (isRight) {
                hitArea.style.right = '0';
            } else {
                hitArea.style.left = '0';
            }
        }

        if (display) {
            display.style.gap = `${userSettings.pageGap}px`;
        }
    }

    // 监听窗口大小变化以调整布局
    window.addEventListener('resize', () => {
        requestAnimationFrame(applyLayoutSettings);
    });

    // ==========================================
    //             数据获取与环境检测
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

        if (Reader.applyContainerWidth && !originalApplyContainerWidth) {
            originalApplyContainerWidth = Reader.applyContainerWidth;
            Reader.applyContainerWidth = function() {
                if (document.body.classList.contains(BODY_READING_CLASS)) {
                    $(".reader-image, .sni").attr("style", "");
                    return;
                }
                return originalApplyContainerWidth.apply(this, arguments);
            };
        }

        if (Reader.goToPage && !originalGoToPage) {
            originalGoToPage = Reader.goToPage.bind(Reader);
            Reader.goToPage = function(pageIndex) {
                originalGoToPage(pageIndex);
                if (!isReadingMode || !isReadingMode()) return;
                waitForPageImageLoaded(pageIndex).then((loaded) => {
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

    function waitForPageImageLoaded(pageIndex, timeout = 5000) {
        const sessionId = typeof readingSessionId !== 'undefined' ? readingSessionId : 0;
        return new Promise((resolve) => {
            if (!sessionId || sessionId !== readingSessionId || !document.body.classList.contains(BODY_READING_CLASS)) {
                resolve(false); return;
            }
            const display = document.getElementById('display');
            if (!display) { resolve(false); return; }

            const targetUrl = getPageUrl(pageIndex);
            if (!targetUrl) { resolve(false); return; }

            const mainImg = document.getElementById('img') || display.querySelector('img.reader-image');
            if (!mainImg) { resolve(false); return; }

            const isTargetSrc = () => {
                const src = mainImg.currentSrc || mainImg.src || '';
                return src === targetUrl || src.startsWith(targetUrl) || targetUrl.startsWith(src);
            };

            if (isTargetSrc() && mainImg.complete && mainImg.naturalWidth > 0) {
                if (sessionId && sessionId === readingSessionId && document.body.classList.contains(BODY_READING_CLASS)) {
                    resolve(true);
                } else { resolve(false); }
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
                if (!sessionId || sessionId !== readingSessionId || !document.body.classList.contains(BODY_READING_CLASS)) {
                    cleanup(); resolve(false); return;
                }
                if (isTargetSrc()) { cleanup(); resolve(true); }
            };
            const onError = () => { cleanup(); resolve(false); };

            mainImg.addEventListener('load', onLoad);
            mainImg.addEventListener('error', onError);

            setTimeout(() => {
                if (done) return;
                cleanup();
                resolve(false);
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
    //                 核心工具函数
    // ==========================================

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function looksLikeReader() {
        return /reader|read|id=/.test(location.href) || !!document.querySelector('#reader, .reader');
    }

    function isReadingMode() {
        return document.body.classList.contains(BODY_READING_CLASS);
    }

    function checkIndicatorOverlap() {
        const indicator = document.getElementById(PAGE_INDICATOR_ID);
        const display = document.getElementById('display');
        const img = display ? (display.querySelector('img.reader-image') || document.getElementById('img')) : null;

        if (!indicator || !img) return;

        const r1 = indicator.getBoundingClientRect();
        const r2 = img.getBoundingClientRect();

        let renderRect = { left: r2.left, right: r2.right, top: r2.top, bottom: r2.bottom };

        if (img.naturalWidth && img.naturalHeight) {
            const imgRatio = img.naturalWidth / img.naturalHeight;
            const boxRatio = r2.width / r2.height;

            if (imgRatio < boxRatio) {
                const renderWidth = r2.height * imgRatio;
                const gap = (r2.width - renderWidth) / 2;
                renderRect.left = r2.left + gap;
                renderRect.right = r2.right - gap;
            } else if (imgRatio > boxRatio) {
                const renderHeight = r2.width / imgRatio;
                const gap = (r2.height - renderHeight) / 2;
                renderRect.top = r2.top + gap;
                renderRect.bottom = r2.bottom - gap;
            }
        }

        const noOverlap = (
            r1.right < renderRect.left ||
            r1.left > renderRect.right ||
            r1.bottom < renderRect.top ||
            r1.top > renderRect.bottom
        );

        if (noOverlap) { indicator.classList.add('safe-zone'); }
        else { indicator.classList.remove('safe-zone'); }
    }

    function updatePageIndicator() {
        const info = getPageInfo();
        const el = document.getElementById(PAGE_INDICATOR_ID);

        if (info && el) el.textContent = `${info.current} / ${info.total}`;

        if (isReadingMode()) {
            if (zoomState.scale > 1.01) {
                if (el) {
                    el.classList.remove('visible');
                    el.classList.remove('safe-zone');
                    // 确保样式立即生效，防止闪烁
                    el.style.opacity = '0';
                }
                return;
            } else {
                // 非缩放模式，恢复 opacity 控制权给 CSS 类
                if (el) el.style.opacity = '';
            }

            const display = document.getElementById('display');
            const targetImg = display ? (display.querySelector('img.reader-image') || document.getElementById('img')) : null;
            if (imgResizeObserver && targetImg) {
                imgResizeObserver.disconnect();
                imgResizeObserver.observe(targetImg);
                if(display) imgResizeObserver.observe(display);
            }

            requestAnimationFrame(checkIndicatorOverlap);

            // 显示页码
            if (el) el.classList.add('visible');

            if (indicatorHideTimer) clearTimeout(indicatorHideTimer);
            indicatorHideTimer = setTimeout(() => {
                if (el) el.classList.remove('visible');
            }, 1000);

            updateGhosts(info);
            hookReaderFunctions();
        }
    }

    // ==========================================
    //               自动翻页功能
    // ==========================================

    function scheduleNextAutoTurn() {
        if (autoTurnState.timer) clearTimeout(autoTurnState.timer);
        if (!autoTurnState.active) return;

        const interval = Math.max(1, userSettings.autoTurnInterval || 3) * 1000;

        autoTurnState.timer = setTimeout(() => {
            if (!autoTurnState.active) return;
            const info = getPageInfo();
            if (info.current < info.total) {
                executePageTurn('next');
            } else {
                stopAutoTurn();
            }
        }, interval);
    }

    function startAutoTurn() {
        if (autoTurnState.active) return;

        autoTurnState.active = true;
        updateAutoTurnBtnState();

        const indicator = document.getElementById(PAGE_INDICATOR_ID);
        if (indicator) {
            indicator.textContent = "▶ 自动翻页开启";
            indicator.classList.add('visible');
            setTimeout(() => {
                 if(indicator.textContent === "▶ 自动翻页开启") {
                     updatePageIndicator();
                 }
            }, 1500);
        }
        scheduleNextAutoTurn();
    }

    function stopAutoTurn() {
        autoTurnState.active = false;
        if (autoTurnState.timer) {
            clearTimeout(autoTurnState.timer);
            autoTurnState.timer = null;
        }
        updateAutoTurnBtnState();

        const indicator = document.getElementById(PAGE_INDICATOR_ID);
        if (indicator && isReadingMode()) {
            indicator.textContent = "■ 自动翻页停止";
            indicator.classList.add('visible');
            setTimeout(() => {
                 if(indicator.textContent === "■ 自动翻页停止") {
                     updatePageIndicator();
                 }
            }, 1000);
        }
    }

    function toggleAutoTurn() {
        if (autoTurnState.active) stopAutoTurn();
        else startAutoTurn();
    }

    function updateAutoTurnBtnState() {
        const btn = document.getElementById(AUTO_BTN_ID);
        if (!btn) return;
        btn.innerHTML = autoTurnState.active ? '■' : '▶';
        if (autoTurnState.active) {
            btn.style.borderColor = '#4CAF50';
            btn.style.color = '#4CAF50';
        } else {
            btn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            btn.style.color = 'rgba(255, 255, 255, 0.95)';
        }
    }

    // ==========================================
    //                  样式注入
    // ==========================================

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
                body.${BODY_READING_CLASS} div.sni img {
                    border-radius: 0 !important;
                }

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
                    transform: translateX(0);
                    /* 移除 will-change: transform，避免缩放时的模糊问题 */
                    cursor: grab; pointer-events: auto !important;
                    overflow: visible !important;
                    transform-origin: center center; /* 确保缩放中心 */
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
                    padding: 0 !important; margin: 0 !important; width: auto !important; max-width: none !important; display: contents !important;
                }

                .lrr-ghost-side {
                    position: absolute; top: 0;
                    width: 100vw; height: 100vh;
                    display: flex; align-items: center; justify-content: center;
                    background-color: #000; z-index: 1; pointer-events: none;
                }
                .lrr-ghost-left { left: -100vw; }
                .lrr-ghost-right { left: 100vw; }
                .lrr-ghost-container {
                    display: flex; flex-direction: row; justify-content: center; align-items: center; width: 100%; height: 100%;
                }
                .lrr-ghost-container.single-view .lrr-ghost-img { max-width: 100vw !important; max-height: 100vh !important; }
                .lrr-ghost-container.double-view .lrr-ghost-img { max-width: 50vw !important; max-height: 100vh !important; }
                .lrr-ghost-text { color: #444; font-size: 20px; font-weight: bold; text-align: center; }

                /* 按钮通用样式 */
                #${BUTTON_ID}, #${THUMB_BUTTON_ID}, #${AUTO_BTN_ID} {
                    position: fixed;
                    z-index: 200001; /* 必须高于热区(199999) */
                    width: 48px; height: 48px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; font-size: 20px;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.95);
                    text-shadow: 0 1px 2px rgba(0,0,0,0.6);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    /* 统一过渡动画 */
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, visibility 0.3s;
                    -webkit-user-select: none; user-select: none;
                    -webkit-touch-callout: none; touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                }

                @media (hover: hover) {
                    #${BUTTON_ID}:hover, #${THUMB_BUTTON_ID}:hover, #${AUTO_BTN_ID}:hover {
                        background: rgba(50, 50, 50, 0.9);
                        border-color: rgba(255, 255, 255, 0.6);
                        z-index: 200002;
                    }
                }

                #${BUTTON_ID}:active, #${THUMB_BUTTON_ID}:active, #${AUTO_BTN_ID}:active {
                    background: rgba(20, 20, 20, 0.9);
                    transform: scale(0.95);
                }

                /* 默认隐藏子按钮，层级稍低但需高于热区 */
                #${THUMB_BUTTON_ID}, #${AUTO_BTN_ID} {
                    opacity: 0; pointer-events: none; visibility: hidden;
                }

                /* 阅读模式 */
                body.${BODY_READING_CLASS} #${BUTTON_ID},
                body.${BODY_READING_CLASS} #${THUMB_BUTTON_ID},
                body.${BODY_READING_CLASS} #${AUTO_BTN_ID} {
                    opacity: 0; pointer-events: none; visibility: hidden;
                }

                /* 非阅读模式 */
                body:not(.${BODY_READING_CLASS}) #${BUTTON_ID} {
                    opacity: 1 !important; pointer-events: auto !important; visibility: visible !important; transform: none !important;
                }
                body:not(.${BODY_READING_CLASS}) #${BUTTON_ID}.hide-on-scroll {
                    transform: translateY(100px); opacity: 0 !important;
                }

                /* 热区样式 */
                #${HITAREA_ID} {
                    position: fixed;
                    bottom: 0;
                    z-index: 199999;
                    width: 15vw;
                    height: 15vh;
                    background: transparent;
                    pointer-events: none;
                }
                body.${BODY_READING_CLASS} #${HITAREA_ID} { pointer-events: auto; }

                /* 页码指示器 */
                #${PAGE_INDICATOR_ID} {
                    position: fixed; z-index: 200000;
                    left: 50%; transform: translateX(-50%);
                    bottom: calc(env(safe-area-inset-bottom, 0px) + 10px);
                    background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                    border: 1px solid rgba(255, 255, 255, 0.15); color: rgba(255, 255, 255, 0.95);
                    text-shadow: 0 1px 2px rgba(0,0,0,0.6); box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    padding: 1px 8px; border-radius: 20px;
                    font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; letter-spacing: 0.5px;
                    pointer-events: none; opacity: 0; visibility: hidden;
                    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.5s;
                }
                body.${BODY_READING_CLASS} #${PAGE_INDICATOR_ID}.visible {
                    opacity: 1 !important; visibility: visible !important; transition: opacity 0.1s ease-out;
                }
                body.${BODY_READING_CLASS} #${PAGE_INDICATOR_ID}.safe-zone {
                    opacity: 1; visibility: visible; transition: opacity 0.3s ease-in;
                }
                @media (min-width: 960px) { #${PAGE_INDICATOR_ID} { left: auto; transform: none; right: 10px; bottom: 2px; } }
                @media (orientation: landscape) and (min-width: 720px) { #${PAGE_INDICATOR_ID} { left: auto; transform: none; right: 10px; bottom: 2px; } }

                .lrr-thumb-backdrop {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 2147483646; backdrop-filter: blur(2px);
                }

                #${SETTINGS_MODAL_ID} {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.5); z-index: 200001; display: none;
                    align-items: center; justify-content: center; backdrop-filter: blur(6px);
                    -webkit-user-select: none !important; user-select: none !important;
                }
                .lrr-settings-content {
                    display: flex; flex-direction: column; gap: 14px;
                    background: var(--glass-bg, rgba(28,30,36,0.96)); color: var(--text-primary, #e3e9f3);
                    width: 320px; max-width: calc(100vw - 32px); padding: 18px 18px 14px;
                    border-radius: var(--radius-lg, 16px);
                    border: 1px solid var(--glass-border, rgba(140,160,190,0.28));
                    box-shadow: var(--shadow-soft, 0 10px 28px -8px rgba(5,10,25,0.72));
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    box-sizing: border-box; text-align: left;
                }
                .lrr-settings-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(120, 135, 160, 0.38); text-align: left; }
                .lrr-settings-close { cursor: pointer; font-size: 18px; line-height: 1; width: 24px; height: 24px; border-radius: 999px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary, #a7b1c2); background: transparent; transition: var(--transition-smooth, all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)); }
                .lrr-settings-close:hover { background: rgba(255,255,255,0.06); color: var(--text-primary, #e3e9f3); }
                .lrr-settings-body { display: grid; grid-template-columns: 1fr; gap: 10px 16px; max-height: min(60vh, 420px); padding-right: 2px; margin-right: -4px; overflow-y: auto; }
                .lrr-setting-item { display: flex; flex-direction: column; gap: 4px; padding: 6px 0; text-align: left; }
                .lrr-setting-label-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left; }
                .lrr-setting-label { font-size: 13px; color: var(--text-primary, #e3e9f3); text-align: left; }
                .lrr-setting-input-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 2px; text-align: left; }
                .lrr-switch { position: relative; display: inline-flex; align-items: center; width: 40px; height: 20px; }
                .lrr-switch input { opacity: 0; width: 0; height: 0; }
                .lrr-slider { position: absolute; cursor: pointer; inset: 0; background-color: #444b57; border-radius: 20px; transition: var(--transition-smooth, all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.4); }
                .lrr-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: #fafbff; border-radius: 50%; transition: var(--transition-smooth, all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)); box-shadow: 0 2px 6px rgba(0,0,0,0.45); }
                input:checked + .lrr-slider { background: linear-gradient(135deg, var(--accent-color, #4a9ff0), #6cc9ff); box-shadow: 0 0 0 1px rgba(74,159,240,0.6); }
                input:checked + .lrr-slider:before { transform: translateX(20px); }
                .lrr-select, .lrr-input { background: rgba(18, 20, 26, 0.9); color: var(--text-primary, #e3e9f3); border: 1px solid rgba(114, 132, 160, 0.7); padding: 5px 8px; border-radius: var(--radius-sm, 6px); width: 100%; box-sizing: border-box; font-size: 12px; outline: none; transition: var(--transition-smooth, all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)); text-align: left; }
                .lrr-select { text-align: center; text-align-last: center; }
                .lrr-select:focus, .lrr-input:focus { border-color: var(--accent-color, #4a9ff0); box-shadow: 0 0 0 1px rgba(74,159,240,0.65); background: rgba(22, 25, 32, 0.98); }
                .lrr-select::placeholder, .lrr-input::placeholder { color: rgba(160, 172, 192, 0.8); }
                .lrr-input[type="number"] { -moz-appearance: textfield; }
                .lrr-input[type="number"]::-webkit-inner-spin-button, .lrr-input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                @media (max-width: 480px) { .lrr-settings-content { width: calc(100vw - 24px); padding: 16px 14px 12px; border-radius: 14px; } .lrr-settings-body { max-height: min(65vh, 460px); grid-template-columns: 1fr; } }
            `;
        document.head.appendChild(style);
    }


    // ==========================================
    //                设置面板
    // ==========================================

    function openSettingsModal() {
        let modal = document.getElementById(SETTINGS_MODAL_ID);

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
                        <span class="lrr-setting-label">自动翻页间隔 (秒)</span>
                        <input type="number" class="lrr-input" id="lrr-cfg-interval" min="1" max="60" placeholder="3">
                    </div>

                    <div class="lrr-setting-item">
                        <span class="lrr-setting-label">双页间距 (px)</span>
                        <input type="number" class="lrr-input" id="lrr-cfg-gap" min="0" max="100">
                    </div>

                    <div class="lrr-setting-item">
                        <span class="lrr-setting-label">按钮展开方向</span>
                        <select class="lrr-select" id="lrr-cfg-expand">
                            <option value="up">朝上方展开</option>
                            <option value="side">朝侧方展开</option>
                        </select>
                    </div>

                    <div class="lrr-setting-item">
                        <span class="lrr-setting-label">阅读模式按钮位置</span>
                        <select class="lrr-select" id="lrr-cfg-pos">
                            <option value="right">右下角</option>
                            <option value="left">左下角</option>
                        </select>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.lrr-settings-close').addEventListener('click', closeSettings);
            modal.addEventListener('click', (e) => { if (e.target === modal) closeSettings(); });

            const elAuto = document.getElementById('lrr-cfg-auto');
            const elPos = document.getElementById('lrr-cfg-pos');
            const elGap = document.getElementById('lrr-cfg-gap');
            const elExpand = document.getElementById('lrr-cfg-expand');
            const elInterval = document.getElementById('lrr-cfg-interval');

            elAuto.addEventListener('change', (e) => { userSettings.autoEnter = e.target.checked; saveSettings(); });
            elPos.addEventListener('change', (e) => { userSettings.btnPosition = e.target.value; saveSettings(); });
            elGap.addEventListener('change', (e) => { userSettings.pageGap = parseInt(e.target.value) || 0; saveSettings(); });
            elInterval.addEventListener('change', (e) => {
                let val = parseFloat(e.target.value);
                if (isNaN(val) || val < 1) val = 1;
                userSettings.autoTurnInterval = val;
                saveSettings();
            });
            elExpand.addEventListener('change', (e) => {
                userSettings.expandDirection = e.target.value;
                saveSettings();
            });
        }

        // 同步 UI
        document.getElementById('lrr-cfg-auto').checked = userSettings.autoEnter;
        document.getElementById('lrr-cfg-pos').value = userSettings.btnPosition;
        document.getElementById('lrr-cfg-gap').value = userSettings.pageGap;
        document.getElementById('lrr-cfg-interval').value = userSettings.autoTurnInterval || 3;
        document.getElementById('lrr-cfg-expand').value = userSettings.expandDirection || 'up';

        modal.style.display = 'flex';
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
    }

    // ==========================================
    //                 交互控制
    // ==========================================

    // 热区触发入口
    function handleZoneTrigger() {
        if (Date.now() < inputBlockUntil) return;
        showControls();
    }

    // 显示控件并执行展开动画
    function showControls() {
        if (!isReadingMode()) return;

        const mainBtn = document.getElementById(BUTTON_ID);
        const thumbBtn = document.getElementById(THUMB_BUTTON_ID);
        const autoBtn = document.getElementById(AUTO_BTN_ID);
        const buttons = [mainBtn, thumbBtn, autoBtn];

        // 1. 设置可见性、重置动画曲线
        buttons.forEach(btn => {
            if (!btn) return;
            btn.style.visibility = 'visible';
            btn.style.zIndex = '200001';

            btn.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, visibility 0.3s';

            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        });

        // 2. 计算展开位置
        const step = 63;
        const dir = userSettings.expandDirection;
        const pos = userSettings.btnPosition;

        if (mainBtn) mainBtn.style.transform = 'translate(0, 0) scale(1)';

        [thumbBtn, autoBtn].forEach((btn, index) => {
            if (!btn) return;
            const distance = step * (index + 1);
            let x = 0, y = 0;

            if (dir === 'side') {
                x = (pos === 'right') ? -distance : distance;
            } else {
                y = -distance;
            }

            btn.style.transform = `translate(${x}px, ${y}px) scale(1)`;
        });

        // 3. 重置隐藏定时器
        if (btnHideTimer) clearTimeout(btnHideTimer);
        btnHideTimer = setTimeout(hideControls, 2500);
    }

    // 隐藏控件并收回动画
    function hideControls() {
        if (!isReadingMode()) return;

        const btns = [
            document.getElementById(BUTTON_ID),
            document.getElementById(THUMB_BUTTON_ID),
            document.getElementById(AUTO_BTN_ID)
        ];

        btns.forEach(btn => {
            if (!btn) return;

            // --- 设置收起专用动画 ---
            btn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease-out, visibility 0.3s';

            // 执行收回
            btn.style.transform = 'translate(0, 0) scale(0.8)';
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
        });

        // 等待最长的动画时间 (0.3s) 结束后完全隐藏
        setTimeout(() => {
            btns.forEach(btn => {
                if (btn && btn.style.opacity === '0') {
                    btn.style.visibility = 'hidden';
                }
            });
        }, 300);
    }

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

        if (e.target.closest('#archivePagesOverlay') || e.target.closest('.lrr-thumb-backdrop')) {
            return;
        }

        if (e.target.closest(`#${BUTTON_ID}`) ||
            e.target.closest(`#${THUMB_BUTTON_ID}`) ||
            e.target.closest(`#${AUTO_BTN_ID}`) ||
            e.target.closest(`#${HITAREA_ID}`) ||
            e.target.closest(`#${SETTINGS_MODAL_ID}`)) {
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
                    overlay.addEventListener('click', function(e) {
                        const thumb = e.target.closest('.quick-thumbnail');

                        if (thumb) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();

                            const pageAttr = thumb.getAttribute('page');
                            if (pageAttr !== null) {
                                const pageIndex = parseInt(pageAttr, 10);
                                if (typeof Reader !== 'undefined' && Reader.goToPage) {
                                    Reader.goToPage(pageIndex);
                                }
                                closeThumbnailOverlay();
                                waitForPageImageLoaded(pageIndex).then(() => {
                                    const info = getPageInfo();
                                    updatePageIndicator();
                                    updateGhosts(info);
                                });
                                return;
                            }
                        }

                        if (e.target.closest('.id3') || e.target.tagName === 'A' || e.target.tagName === 'IMG') {
                            if (!thumb) {
                                setTimeout(closeThumbnailOverlay, 50);
                            }
                        }
                    }, true);
                    overlay._hasDelegatedClick = true;
                }
            }
        }, 100);
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

            if (autoTurnState.active) {
                scheduleNextAutoTurn();
            }
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
               if (idx === 0) {
                    let nextCursor = 1;
                    while (logicalNextIndices.length < nextLimit && nextCursor < total) {
                        logicalNextIndices.push(nextCursor);
                        nextCursor++;
                    }
               } else if (idx === 1) {
                   logicalPrevIndices = [0];
                   let nextCursor = idx + 2;
                   while (logicalNextIndices.length < nextLimit && nextCursor < total) {
                       logicalNextIndices.push(nextCursor);
                       nextCursor++;
                   }
               } else {
                   logicalPrevIndices = [idx - 2, idx - 1].filter(i => i >= 0);
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
                       let cursor = nextStart;
                       while(logicalNextIndices.length < nextLimit && cursor < total) {
                            if (cursor >= 0) logicalNextIndices.push(cursor);
                            cursor++;
                       }
                   }
               }
           }
       } else {
           let cursor = idx + 1;
           while(logicalNextIndices.length < nextLimit && cursor < total) {
               logicalNextIndices.push(cursor);
               cursor++;
           }
           if (idx - 1 >= 0) logicalPrevIndices = [idx - 1];
       }

       let leftPages = manga ? logicalNextIndices : logicalPrevIndices;
       let rightPages = manga ? logicalPrevIndices : logicalNextIndices;

       const createGhostContent = (indices) => {
           const validIndices = indices.filter(i => i >= 0 && i < total);
           if (validIndices.length === 0) return `<div class="lrr-ghost-text"></div>`;

           let html = '';
           const visibleCount = double ? 2 : 1;
           const isVisualDouble = double && validIndices.length > 1;
           const containerClass = isVisualDouble ? 'double-view' : 'single-view';

           html += `<div class="lrr-ghost-container ${containerClass}">`;
           let sortedIndices = [...validIndices];

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

               let visibilityStyle = '';
               if (loopIndex >= visibleCount) {
                   visibilityStyle = 'display: none !important;';
               }

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
    //                 拖拽事件处理
    // ==========================================

    // 应用缩放和位移
    function applyZoomTransform(display, tempDiffX = 0, tempDiffY = 0) {
        if (!display) return;

        // 获取当前视口尺寸
        const vw = window.innerWidth || document.documentElement.clientWidth;
        const vh = window.innerHeight || document.documentElement.clientHeight;

        // 计算当前缩放下的最大允许位移量 (边界限制)
        const maxPanX = Math.max(0, (vw * zoomState.scale - vw) / 2);
        const maxPanY = Math.max(0, (vh * zoomState.scale - vh) / 2);

        // 计算目标位置（基础偏移 + 临时拖拽偏移）
        let targetX = zoomState.panX + tempDiffX;
        let targetY = zoomState.panY + tempDiffY;

        // 强制限制在边界内
        targetX = clamp(targetX, -maxPanX, maxPanX);
        targetY = clamp(targetY, -maxPanY, maxPanY);

        if (zoomState.scale > 1.01) {
            display.style.transform = `translate(${targetX}px, ${targetY}px) scale(${zoomState.scale})`;
        } else {
             if (tempDiffX !== 0 && zoomState.scale === 1) {
                 display.style.transform = `translateX(${tempDiffX}px)`;
             } else {
                 display.style.transform = `translateX(0px)`;
             }
        }

        return { x: targetX, y: targetY }; // 返回修正后的坐标供状态更新
    }


    function resetZoom() {
        zoomState.scale = 1;
        zoomState.panX = 0;
        zoomState.panY = 0;
        const display = document.getElementById('display');
        if (display) {
            display.style.transition = `transform ${ZOOM_ANIM_SPEED} ease-out`;
            display.style.transform = 'translateX(0px)';
        }

        const el = document.getElementById(PAGE_INDICATOR_ID);
        if (el) {
            el.style.opacity = '';
        }
    }

    function handleDblClick(e) {
        if (!isReadingMode()) return;

        // 兼容 TouchEvent 和 MouseEvent 获取坐标
        let clientX;
        if (e.type === 'touchstart' && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
        } else if (e.clientX) {
            clientX = e.clientX;
        } else {
            clientX = window.innerWidth / 2;
        }

        // 逻辑：已经放大时 -> 缩小
        if (zoomState.scale > 1.01) {
            if (e.preventDefault) e.preventDefault();
            resetZoom();
            return;
        }

        let rectWidth = window.innerWidth;
        let rectLeft = 0;
        const display = document.getElementById('display');
        const imgEl = display ? (display.querySelector('img.reader-image') || document.getElementById('img')) : null;

        if (imgEl && imgEl.tagName === 'IMG') {
            const rect = imgEl.getBoundingClientRect();
            rectWidth = rect.width;
            rectLeft = rect.left;
        }

        const ratio = (clientX - rectLeft) / rectWidth;

        // 逻辑：双击中间 -> 放大
        if (ratio >= 0.35 && ratio <= 0.65) {
            if (e.preventDefault) e.preventDefault();

            zoomState.scale = 2.5;
            zoomState.panX = 0;
            zoomState.panY = 0;

            const ind = document.getElementById(PAGE_INDICATOR_ID);
            if (ind) {
                ind.classList.remove('visible');
                ind.style.opacity = '0';
            }

            requestAnimationFrame(() => {
                if (display) display.style.transition = `transform ${ZOOM_ANIM_SPEED} ease-out`;
                applyZoomTransform(display);
            });
        }
    }

    // 桌面端滚轮缩放
    function handleWheel(e) {
        if (!isReadingMode()) return;
        e.preventDefault();

        const display = document.getElementById('display');
        if (!display) return;

        const delta = e.deltaY * -0.002;
        let newScale = zoomState.scale + delta;

        if (newScale < 1) newScale = 1;
        if (newScale > 5) newScale = 5;

        if (Math.abs(newScale - zoomState.scale) > 0.01) {
            zoomState.scale = newScale;

            if (zoomState.scale <= 1.01) {
                zoomState.scale = 1;
                zoomState.panX = 0;
                zoomState.panY = 0;
                resetZoom();
            } else {
                const ind = document.getElementById(PAGE_INDICATOR_ID);
                if (ind) {
                    ind.classList.remove('visible');
                    ind.style.opacity = '0';
                }
            }

            display.style.transition = 'transform 0.1s ease-out';
            const corrected = applyZoomTransform(display);
            zoomState.panX = corrected.x;
            zoomState.panY = corrected.y;
        }
    }

    // 拖拽与交互事件绑定
    function attachDragEvents() {
        const display = document.getElementById('display');
        if (!display) return;

        let lastTapTime = 0;

        if (display._lrrDragBound) {
            display.removeEventListener('wheel', handleWheel);
            display.addEventListener('wheel', handleWheel, { passive: false });
            display.removeEventListener('dblclick', handleDblClick);
            display.addEventListener('dblclick', handleDblClick);
            return;
        }

        display.addEventListener('wheel', handleWheel, { passive: false });
        display.addEventListener('dblclick', handleDblClick);

        const start = (e) => {
            if (!isReadingMode()) return;
            if (e.touches && e.touches.length > 2) return;
            const overlay = document.getElementById('archivePagesOverlay');
            if (overlay && overlay.style.display === 'block') return;
            if (!e.target.closest('#display')) return;

            // --- 兼容变量：Touch 双击检测 ---
            if (e.type === 'touchstart' && e.touches.length === 1) {
                const currentTime = Date.now();
                const tapLength = currentTime - lastTapTime;

                // 使用 DOUBLE_TAP_DELAY 变量
                if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
                    e.preventDefault();
                    handleDblClick(e);

                    lastTapTime = 0;
                    dragState.active = false;
                    return;
                }
                lastTapTime = currentTime;
            }

            if (autoTurnState.active && autoTurnState.timer) {
                clearTimeout(autoTurnState.timer);
            }

            dragState.active = true;
            dragState.targetImg = e.target;
            dragState.isTouch = e.type.startsWith('touch');

            // 拖拽开始时移除动画，保证跟手
            display.style.transition = 'none';

            if (dragState.isTouch && e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                zoomState.initialDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                zoomState.initialScale = zoomState.scale;
                return;
            }

            const clientX = dragState.isTouch ? e.touches[0].clientX : e.clientX;
            const clientY = dragState.isTouch ? e.touches[0].clientY : e.clientY;

            dragState.startX = clientX;
            dragState.currentX = clientX;
            dragState.startY = clientY;
            dragState.currentY = clientY;

            dragState.startPanX = zoomState.panX;
            dragState.startPanY = zoomState.panY;

            if (dragState.rafId) cancelAnimationFrame(dragState.rafId);
            dragState.rafId = null;
        };

        const move = (e) => {
            if (!dragState.active) return;
            if (dragState.isTouch && e.cancelable && (!e.touches || e.touches.length < 2)) {
                e.preventDefault();
            }

            if (dragState.isTouch && e.touches && e.touches.length === 2) {
                if (e.cancelable) e.preventDefault();

                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                if (zoomState.initialDistance > 0) {
                    let newScale = zoomState.initialScale * (currentDist / zoomState.initialDistance);
                    if (newScale < 1) newScale = 1;
                    if (newScale > 5) newScale = 5;

                    zoomState.scale = newScale;

                    if (newScale > 1.01) {
                         const ind = document.getElementById(PAGE_INDICATOR_ID);
                         if (ind) {
                             ind.classList.remove('visible');
                             ind.style.opacity = '0';
                         }
                    }

                    requestAnimationFrame(() => {
                        const corrected = applyZoomTransform(display);
                    });
                }
                return;
            }

            const clientX = dragState.isTouch ? e.touches[0].clientX : e.clientX;
            const clientY = dragState.isTouch ? e.touches[0].clientY : e.clientY;

            dragState.currentX = clientX;
            dragState.currentY = clientY;

            if (!dragState.rafId) {
                dragState.rafId = requestAnimationFrame(() => {
                    const diffX = dragState.currentX - dragState.startX;
                    const diffY = dragState.currentY - dragState.startY;

                    if (zoomState.scale > 1.05) {
                         const estimatedPanX = dragState.startPanX + diffX;
                         const estimatedPanY = dragState.startPanY + diffY;
                         applyZoomTransform(display, estimatedPanX - zoomState.panX, estimatedPanY - zoomState.panY);
                    } else {
                        const width = window.innerWidth || 1;
                        let ratio = diffX / width;
                        if (ratio > MAX_DRAG_RATIO) ratio = MAX_DRAG_RATIO;
                        if (ratio < -MAX_DRAG_RATIO) ratio = -MAX_DRAG_RATIO;
                        display.style.transform = `translateX(${ratio * width}px)`;
                    }
                    dragState.rafId = null;
                });
            }
        };

        const end = (e) => {
            if (!dragState.active) return;
            dragState.active = false;
            if (dragState.rafId) cancelAnimationFrame(dragState.rafId);
            dragState.rafId = null;

            if (autoTurnState.active) startAutoTurn();

            // --- 放大模式结束逻辑 ---
            if (zoomState.scale > 1.05) {
                const diffX = dragState.currentX - dragState.startX;
                const diffY = dragState.currentY - dragState.startY;

                let finalX = dragState.startPanX + diffX;
                let finalY = dragState.startPanY + diffY;

                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const maxPanX = Math.max(0, (vw * zoomState.scale - vw) / 2);
                const maxPanY = Math.max(0, (vh * zoomState.scale - vh) / 2);

                zoomState.panX = clamp(finalX, -maxPanX, maxPanX);
                zoomState.panY = clamp(finalY, -maxPanY, maxPanY);

                display.style.transition = `transform ${ZOOM_ANIM_SPEED} cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                applyZoomTransform(display);

                return;
            }

            if (zoomState.scale !== 1) {
                resetZoom();
            }

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

            if (absRatio < CLICK_THRESHOLD_RATIO) {
                resetPosition();
                const didFlip = handleClickFlip(dragState.targetImg, dragState.startX, info);
                if (dragState.isTouch && didFlip && e.cancelable) e.preventDefault();
                return;
            }

            if (absRatio < SWIPE_THRESHOLD_RATIO) {
                resetPosition();
                return;
            }

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
                display.style.transition = 'transform 0.2s ease-out';
                const exitX = (gesture < 0 ? -1 : 1) * width;
                display.style.transform = `translateX(${exitX}px)`;
            });

            setTimeout(() => {
                const nextIndex = intent === 'next' ? info.index + 1 : info.index - 1;
                executePageTurn(intent);
                waitForPageImageLoaded(nextIndex, 2000).then(() => {
                    display.style.transition = 'none';
                    display.style.transform = 'translateX(0px)';
                    void display.offsetWidth;
                    display.style.transition = 'transform 0.2s ease-out';
                });
            }, 200);
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

        display.removeEventListener('wheel', handleWheel);
        display.removeEventListener('dblclick', handleDblClick); // 解绑双击

        display.style.transform = '';
        display.style.transition = '';
        display._lrrDragBound = false;
        delete display._lrrDragHandlers;

        // 重置缩放状态
        zoomState = { scale: 1, panX: 0, panY: 0, initialDistance: 0, initialScale: 1 };

        const ghosts = display.querySelectorAll('.lrr-ghost-side');
        ghosts.forEach(el => el.remove());
    }

    function setReadingMode(enable) {
        document.body.classList.toggle(BODY_READING_CLASS, enable);
        document.documentElement.classList.toggle(BODY_READING_CLASS, enable);

        const btn = document.getElementById(BUTTON_ID);
        const tb = document.getElementById(THUMB_BUTTON_ID);
        const autoBtn = document.getElementById(AUTO_BTN_ID);

        if (btn) {
            btn.innerHTML = enable ? '✕' : '⌘';
            btn.style.borderColor = userSettings.autoEnter ? '#4CAF50' : 'rgba(255,255,255,0.3)';
            btn.classList.remove('hide-on-scroll');
        }

        if (enable) {
            inputBlockUntil = Date.now() + 500;
            hookReaderFunctions(true);
            applyLayoutSettings();
            initPageData();

            // 进入阅读模式时
            [btn, tb, autoBtn].forEach(el => {
                if (el) {
                    el.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, visibility 0.3s';
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                    el.style.visibility = 'hidden';
                    el.style.transform = 'translate(0, 0) scale(1)';
                }
            });

            if (btnHideTimer) clearTimeout(btnHideTimer);

            updatePageIndicator();
            attachDragEvents();
            setupClickBlocker(true);

            const mainImg = document.getElementById('img');
            const dblImg = document.getElementById('img_doublepage');
            [mainImg, dblImg].forEach(el => { if (el) el.removeAttribute('style'); });

            if (imgResizeObserver) imgResizeObserver.disconnect();
            const display = document.getElementById('display');
            const targetImg = display ? (display.querySelector('img.reader-image') || document.getElementById('img')) : null;

            if (window.ResizeObserver && targetImg) {
                imgResizeObserver = new ResizeObserver(() => {
                    requestAnimationFrame(checkIndicatorOverlap);
                });
                imgResizeObserver.observe(targetImg);
                if(display) imgResizeObserver.observe(display);
            }

            updateGhosts(getPageInfo());
            setTimeout(checkIndicatorOverlap, 50);

        } else {
            // --- 退出阅读模式逻辑 ---
            stopAutoTurn();

            if (btnHideTimer) clearTimeout(btnHideTimer);
            if (imgResizeObserver) {
                imgResizeObserver.disconnect();
                imgResizeObserver = null;
            }

            // 1. 主按钮
            if (btn) {
                btn.style.transition = ''; // 清除内联 transition，使用 CSS 默认
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                btn.style.visibility = 'visible';
                btn.style.transform = '';
            }

            // 2. 子按钮
            [tb, autoBtn].forEach(el => {
                if (el) {
                    el.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease-out, visibility 0.3s';

                    // 执行收回动作
                    el.style.transform = 'translate(0, 0) scale(0.8)';
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                    // 不立即设置 visibility: hidden，让 CSS transition 处理完
                }
            });

            detachDragEvents();
            setupClickBlocker(false);
            closeThumbnailOverlay();
            hookReaderFunctions(false);

            if (typeof Reader !== 'undefined' && typeof Reader.applyContainerWidth === 'function') {
                Reader.applyContainerWidth();
            }
        }
    }

    // -------- 初始化 --------

    function createControls() {
        if (document.getElementById(BUTTON_ID)) return;

        const btn = document.createElement('div');
        btn.id = BUTTON_ID;
        btn.innerHTML = '⌘';
        btn.title = '切换阅读模式 (长按设置)';

        btn.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); return false; });
        btn.addEventListener('click', (e) => { e.stopPropagation(); setReadingMode(!isReadingMode()); });

        let pressTimer;
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
        thumbBtn.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); return false; });
        thumbBtn.addEventListener('click', (e) => { e.stopPropagation(); openThumbnailOverlay(); });

        const autoBtn = document.createElement('div');
        autoBtn.id = AUTO_BTN_ID;
        autoBtn.innerHTML = '▶';
        autoBtn.title = '开启/关闭自动翻页';
        autoBtn.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); return false; });
        autoBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleAutoTurn(); });

        const indicator = document.createElement('div');
        indicator.id = PAGE_INDICATOR_ID;

        // 唯一的底部热区
        const hitArea = document.createElement('div');
        hitArea.id = HITAREA_ID;

        document.body.append(btn, thumbBtn, autoBtn, indicator, hitArea);

        // --- 使用元素直接监听替代坐标计算 ---
        const triggerAction = () => handleZoneTrigger();

        // 1. 热区点击事件 (通用)
        hitArea.addEventListener('click', (e) => { e.stopPropagation(); triggerAction(); });

        if (window.matchMedia('(hover: hover)').matches) {
            hitArea.addEventListener('mouseenter', triggerAction);
            hitArea.addEventListener('mousemove', triggerAction);

            [btn, thumbBtn, autoBtn].forEach(el => {
                el.addEventListener('mouseenter', triggerAction);
                el.addEventListener('mousemove', triggerAction);
            });
        }

        window.addEventListener('scroll', handleScroll);
    }

    function init() {
        loadSettings();
        injectStyle();
        createControls();
        initPageData();

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