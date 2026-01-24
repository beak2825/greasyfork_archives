// ==UserScript==
// @name         B站分P合集标题提取器【左键复制+右键隐藏+跳转适配】
// @namespace    https://github.com/
// @version      8.5
// @description  适配B站分P合集，提取纯净分P标题（无时长冗余），左键复制+右键隐藏+SPA跳转适配
// @author       自定义
// @match        *://www.bilibili.com/video/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563937/B%E7%AB%99%E5%88%86P%E5%90%88%E9%9B%86%E6%A0%87%E9%A2%98%E6%8F%90%E5%8F%96%E5%99%A8%E3%80%90%E5%B7%A6%E9%94%AE%E5%A4%8D%E5%88%B6%2B%E5%8F%B3%E9%94%AE%E9%9A%90%E8%97%8F%2B%E8%B7%B3%E8%BD%AC%E9%80%82%E9%85%8D%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/563937/B%E7%AB%99%E5%88%86P%E5%90%88%E9%9B%86%E6%A0%87%E9%A2%98%E6%8F%90%E5%8F%96%E5%99%A8%E3%80%90%E5%B7%A6%E9%94%AE%E5%A4%8D%E5%88%B6%2B%E5%8F%B3%E9%94%AE%E9%9A%90%E8%97%8F%2B%E8%B7%B3%E8%BD%AC%E9%80%82%E9%85%8D%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ************************ 常量集中定义（适配你的DOM结构） ************************
    const DELAY_TIME = 1500;
    const FLOAT_BTN_ID = 'bili-playlist-float-btn';
    const BILI_VIDEO_PREFIX = 'https://www.bilibili.com/video/';
    const BV_REGEX = /BV\w+/;
    // 【核心优化】精准选择器：匹配你提供的.video-pod结构，避免时长元素
    const PLAYLIST_SELECTORS = [
        '.video-pod__list .pod-item' // 直接定位分P所在的pod-item容器
    ];
    const PART_TITLE_SELECTOR = '.page-list .page-item.sub .title-txt'; // 分P标题精准选择器
    const COLLECTION_TITLE_SELECTOR = '.head .title-txt'; // 合集标题精准选择器

    // 提示文本常量
    const TIPS = {
        COPY_SUCCESS: '✅ 分P标题已全部复制！共{count}个合集',
        NO_PLAYLIST: '❌ 未检测到分P！可能是单P视频或容器结构更新',
        COPY_FAIL: '❌ 自动复制失败！请去控制台查看结果',
        CACHE_CLEAR_ALL: '✅ 已重置所有分P缓存！',
        EXTRACT_ERROR: '❌ 操作出错！\n{msg}\n请按F12查看控制台日志',
        URL_OBSERVER_START: '✅ 地址栏监听器已启动',
        DOM_OBSERVER_START: '✅ DOM变化监听器已启动',
        PAGE_CHANGE: '✅ 检测到视频跳转 → 新BV：{bv}，已重置缓存',
        BTN_CREATE_SUCCESS: '✅ 按钮创建成功！支持动态跳转+手动重置缓存',
        BTN_HIDE: '✅ 提取按钮已隐藏',
        CACHE_CLEAR_MANUAL: '✅ 手动重置所有缓存成功'
    };

    // 悬浮按钮样式
    const FLOAT_BTN_CSS = `
        #${FLOAT_BTN_ID} {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            width: 48px;
            height: 48px;
            background: #409EFF;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 12px rgba(64, 158, 255, 0.4);
            transition: all 0.25s ease;
            color: #fff;
            font-size: 11px;
            font-weight: 600;
            line-height: 1.2;
            text-align: center;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
            padding: 2px;
            border: none;
            outline: none;
            touch-action: none;
        }
        #${FLOAT_BTN_ID}:hover {
            background: #337ECC;
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(64, 158, 255, 0.5);
        }
    `;

    // ************************ 全局状态 ************************
    let floatBtn = null;
    const cacheManager = {
        data: {},
        get: (bv) => cacheManager.data[bv],
        set: (bv, value) => { cacheManager.data[bv] = value; },
        delete: (bv) => { delete cacheManager.data[bv]; },
        clearAll: () => { cacheManager.data = {}; }
    };
    let currentState = {
        bv: getCurrentBv(),
        title: document.title
    };

    // 初始化入口
    initScript();

    // ************************ 初始化函数 ************************
    function initScript() {
        injectStyle();
        setTimeout(() => {
            observeUrlChange();
            observeDomChange();
            createFloatButton();
        }, DELAY_TIME);
    }

    // ************************ 工具函数 ************************
    /**
     * 提取BV号（复用逻辑）
     */
    function getBVFromString(str) {
        const match = str.match(BV_REGEX);
        return match ? match[0] : null;
    }

    /**
     * 注入样式
     */
    function injectStyle() {
        if (document.querySelector(`style[data-id="${FLOAT_BTN_ID}"]`)) return;
        const style = document.createElement('style');
        style.dataset.id = FLOAT_BTN_ID;
        style.textContent = FLOAT_BTN_CSS.trim();
        document.head.appendChild(style);
    }

    /**
     * 获取当前页面BV号
     */
    function getCurrentBv() {
        const urlBv = getBVFromString(window.location.href);
        if (urlBv) return urlBv;
        const metaBv = document.querySelector('meta[property="og:video:tag"]')?.content || '';
        return getBVFromString(metaBv) || '未知BV号';
    }

    // ************************ 页面监听器 ************************
    function observeUrlChange() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            checkPageChange();
        };
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            checkPageChange();
        };

        window.addEventListener('popstate', checkPageChange);
        console.log(TIPS.URL_OBSERVER_START);
    }

    function observeDomChange() {
        const targetNode = document.querySelector('#app') || document.body;
        const config = { childList: true, subtree: true, attributes: true };
        const observer = new MutationObserver(() => {
            if (document.title !== currentState.title) checkPageChange();
        });
        observer.observe(targetNode, config);
        console.log(TIPS.DOM_OBSERVER_START);
    }

    function checkPageChange() {
        const newBv = getCurrentBv();
        const newTitle = document.title;
        if (newBv !== currentState.bv || newTitle !== currentState.title) {
            currentState = { bv: newBv, title: newTitle };
            cacheManager.delete(newBv);
            floatBtn && (floatBtn.style.display = 'flex');
            console.log(TIPS.PAGE_CHANGE.replace('{bv}', newBv));
        }
    }

    // ************************ 核心业务逻辑（重点优化：消除时长冗余） ************************
    /**
     * 创建悬浮按钮
     */
    function createFloatButton() {
        floatBtn = document.getElementById(FLOAT_BTN_ID);
        if (floatBtn) return;

        floatBtn = document.createElement('div');
        floatBtn.id = FLOAT_BTN_ID;
        floatBtn.innerText = '复制\n分P';
        floatBtn.title = '左键：复制分P | 右键：隐藏按钮 | Shift+右键：重置缓存';

        floatBtn.addEventListener('click', copyTitles);
        floatBtn.addEventListener('contextmenu', handleRightClick);

        document.body.appendChild(floatBtn);
        console.log(TIPS.BTN_CREATE_SUCCESS);
    }

    function handleRightClick(e) {
        e.preventDefault();
        if (e.shiftKey) {
            cacheManager.clearAll();
            floatBtn.style.display = 'flex';
            alert(TIPS.CACHE_CLEAR_ALL);
            console.log(TIPS.CACHE_CLEAR_MANUAL);
        } else {
            floatBtn.style.display = 'none';
            console.log(TIPS.BTN_HIDE);
        }
    }

    /**
     * 复制分P标题（核心优化：提取纯净数据）
     */
    function copyTitles() {
        try {
            const bv = currentState.bv;
            const result = getExtractResult(bv);
            if (!result) return;
            const formatText = formatResult(result);
            navigator.clipboard.writeText(formatText).then(() => {
                alert(TIPS.COPY_SUCCESS.replace('{count}', result.length));
            }).catch(err => {
                console.error('【复制失败】', err);
                alert(TIPS.COPY_FAIL);
            });
        } catch (error) {
            handleExtractError(error);
        }
    }

    /**
     * 【关键优化】提取分P数据 - 完全适配你的DOM结构，剔除时长冗余
     */
    function getExtractResult(bv) {
        // 优先读取缓存
        const cachedData = cacheManager.get(bv);
        if (cachedData) return cachedData;

        // 按精准选择器匹配分P容器
        let playlistContainers = [];
        for (const selector of PLAYLIST_SELECTORS) {
            playlistContainers = document.querySelectorAll(selector);
            if (playlistContainers.length > 0) break;
        }

        if (playlistContainers.length === 0) {
            alert(TIPS.NO_PLAYLIST);
            return null;
        }

        // 解析分P数据（完全不处理时长元素）
        const result = Array.from(playlistContainers).map((container, index) => {
            // 提取合集BV号（从data-key属性获取）
            const itemBv = container.dataset.key || '';
            const collectionBv = getBVFromString(itemBv) || '未知BV号';

            // 【优化】直接匹配.head .title-txt获取纯净合集标题
            const collectionTitleNode = container.querySelector(COLLECTION_TITLE_SELECTOR);
            const collectionTitle = collectionTitleNode?.textContent.trim() || `未命名合集${index + 1}`;

            // 【核心】提取分P标题 - 仅匹配.title-txt，不涉及任何时长元素
            const partTitleNodes = container.querySelectorAll(PART_TITLE_SELECTOR);
            const partTitles = Array.from(partTitleNodes).map(node => node.textContent.trim()).filter(Boolean);

            return {
                collectionIndex: index + 1,
                collectionBv: collectionBv,
                collectionTitle: collectionTitle,
                partCount: partTitles.length,
                partTitles: partTitles // 仅包含分P标题，无时长
            };
        });

        // 写入缓存
        cacheManager.set(bv, result);
        console.log(`【提取结果-共${result.length}个合集】`, JSON.stringify(result, null, 2));
        return result;
    }

    /**
     * 格式化结果 - 确保无时长冗余，输出你需要的格式
     */
    function formatResult(result) {
        let text = 'B站分P合集标题提取结果\n';
        text += '=============================\n';
        result.forEach(item => {
            text += `\n【合集${item.collectionIndex}】${item.collectionTitle}\n`;
            text += `${BILI_VIDEO_PREFIX}${item.collectionBv}\n`;
            text += `分P总数：${item.partCount}\n`;
            // 仅输出分P标题，无任何时长信息
            item.partTitles.forEach((title, i) => {
                text += `P${i+1}：${title}\n`;
            });
        });
        return text;
    }

    function handleExtractError(error) {
        console.error('【提取失败】', error);
        alert(TIPS.EXTRACT_ERROR.replace('{msg}', error.message));
    }

})();