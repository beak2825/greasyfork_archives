// ==UserScript==
// @name         Pixiv图片牌堆生成器 (Fix MasterImg & Hover UI)
// @version      1.41
// @description  清洗JSON对象存储结构。缓存链接时抓取来源和标题，导出纯净JSON。优化了性能和UI交互（悬停触发、双列导出）。
// @author       Yog-Sothoth
// @match        *://www.pixiv.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/1397928
// @downloadURL https://update.greasyfork.org/scripts/554538/Pixiv%E5%9B%BE%E7%89%87%E7%89%8C%E5%A0%86%E7%94%9F%E6%88%90%E5%99%A8%20%28Fix%20MasterImg%20%20Hover%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554538/Pixiv%E5%9B%BE%E7%89%87%E7%89%8C%E5%A0%86%E7%94%9F%E6%88%90%E5%99%A8%20%28Fix%20MasterImg%20%20Hover%20UI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置常量 ===
    const STORAGE_KEY = 'pixivCatTaggedLinks_JSON';
    const CACHE_NAME = 'PixivCat_Tagged_Export.json';
    const PIXIV_BASE_URL = 'https://www.pixiv.net';

    // === 选择器 ===
    const IMG_SELECTOR_LIST = 'img[src*="i.pximg.net/c/"]:not([data-tag-processed])';
    const IMG_SELECTOR_ARTWORK = 'img[src*="i.pximg.net/img-original/img"]:not([data-tag-processed]), img[src*="i.pximg.net/img-master/img"]:not([data-tag-processed])';

    const IS_ARTWORK_PAGE = window.location.pathname.includes('/artworks/');

    // === 样式注入 ===
    GM_addStyle(`
        .ppg-btn {
            position: absolute; top: 50%; right: 0; transform: translateY(-50%);
            width: 24px; height: 24px; border-radius: 4px;
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: bold; cursor: pointer;
            z-index: 999; transition: background-color .2s, transform .1s;
            font-family: sans-serif; font-size: 16px; user-select: none;
        }
        .ppg-btn.cached { background-color: #4CAF50; }
        .ppg-btn.uncached { background-color: #2196F3; }
        .ppg-btn.error { background-color: #FF0000; }
        .ppg-btn:hover { transform: translateY(-50%) scale(1.1); }

        /* 详情页的大按钮 */
        .ppg-btn-large { width: 34px; height: 34px; font-size: 20px; }

        /* 菜单样式 - 宽度调整为约200px */
        #tag-select-menu {
            background: #333; border: 1px solid #222; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            padding: 8px; border-radius: 4px; z-index: 10001; color: white;
            box-sizing: border-box; text-align: left; font-size: 12px; font-family: sans-serif;
            width: 200px; /* 调整后的宽度 */
        }
        #tag-select-menu input {
            width: 100%; padding: 4px; margin: 8px 0 6px; border: 1px solid #495057;
            background-color: #f8f9fa; color: #212529; border-radius: 3px; box-sizing: border-box;
        }
        #tag-select-menu button {
            width: 100%; border: none; padding: 5px 8px; cursor: pointer; border-radius: 3px;
            color: white; transition: opacity .2s; margin-top: 4px;
        }
        #tag-select-menu button:disabled { cursor: wait; opacity: 0.7; }

        .ppg-btn-confirm { background-color: #4CAF50; }
        .ppg-btn-confirm:hover { background-color: #45a049; }

        /* 导出菜单样式 */
        #tag-export-menu {
            position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
            background: #f9f9f9; border: 1px solid #ccc; color: #333;
            max-height: 80vh; overflow-y: auto; width: 340px;
            padding: 15px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 10002;
        }
        #tag-export-menu h3 { margin: 0 0 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px; }

        /* 导出菜单 - 顶部操作区 */
        .export-actions {
            display: flex; gap: 10px; margin-bottom: 15px;
        }
        .export-actions button {
            flex: 1; padding: 8px; border: none; border-radius: 4px; cursor: pointer; color: white; font-weight: bold;
        }

        /* 导出菜单 - 网格布局 (双列) */
        .export-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
        }
        .ppg-btn-export {
            background-color: #007bff; border: none; padding: 8px; color: white;
            border-radius: 4px; cursor: pointer; font-size: 12px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;
        }
        .ppg-btn-export:hover { background-color: #0056b3; }

        .btn-green { background-color: #28a745; }
        .btn-green:hover { background-color: #218838; }
        .btn-gray { background-color: #6c757d; }
        .btn-gray:hover { background-color: #5a6268; }
    `);

    // === 全局状态 ===
    let linkCacheIndex = new Map();
    let menuCloseTimer = null; // 用于控制菜单关闭的定时器
    let activeMenuButton = null; // 当前激活菜单对应的按钮

    // === 工具函数 ===

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function normalizeItem(item) {
        if (typeof item === 'string') {
            try { return JSON.parse(item); } catch (e) { return null; }
        }
        return item;
    }

    // 数据迁移
    (function migrateOldData() {
        try {
            const rawData = GM_getValue(STORAGE_KEY, '{}');
            const data = JSON.parse(rawData);
            let hasChanges = false;
            for (const tag in data) {
                if (Array.isArray(data[tag])) {
                    data[tag] = data[tag].map(item => {
                        if (typeof item === 'string') {
                            try { return JSON.parse(item); } catch (e) { return item; }
                        }
                        return item;
                    });
                }
            }
            if (hasChanges) GM_setValue(STORAGE_KEY, JSON.stringify(data));
        } catch (e) { console.error('Data migration failed:', e); }
    })();

    function parseImgSrc(src) {
        const regex = /img\/(\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2})\/(\d+)_p(\d+)/;
        const match = src.match(regex);
        if (match) {
            return {
                timestamp: match[1], illustId: match[2],
                pageIndex: parseInt(match[3], 10), pageString: `p${match[3]}`,
                linkKey: `${match[2]}_p${match[3]}`
            };
        }
        if (IS_ARTWORK_PAGE) {
            const parts = src.match(/img\/(\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2})\/(\d+)_p(\d+)/);
            const artworkMatch = window.location.pathname.match(/\/artworks\/(\d+)/);
            if (parts && artworkMatch) {
                return {
                    timestamp: parts[1], illustId: artworkMatch[1],
                    pageIndex: parseInt(parts[3], 10), pageString: `p${parts[3]}`,
                    linkKey: `${artworkMatch[1]}_p${parts[3]}`
                };
            }
        }
        return null;
    }

    function buildCacheIndex() {
        linkCacheIndex.clear();
        const data = getCachedData();
        for (const tag in data) {
            data[tag].forEach(item => {
                const parsedItem = normalizeItem(item);
                if (!parsedItem) return;
                const parsedInfo = parseImgSrc(parsedItem.catLink);
                if (!parsedInfo) return;
                const linkKey = parsedInfo.linkKey;
                if (!linkCacheIndex.has(linkKey)) linkCacheIndex.set(linkKey, { realUrl: parsedItem.catLink, tags: [] });
                const entry = linkCacheIndex.get(linkKey);
                if (!entry.tags.includes(tag)) entry.tags.push(tag);
            });
        }
    }

    // 格式化输出 (确保包含换行符)
    function formatToCQImage(cachedItem) {
        try {
            const data = normalizeItem(cachedItem);
            // 使用模板字符串显式保留 \n
            return `[CQ:image,file=${data.catLink}]${data.sourceLink}\n${data.title}`;
        } catch (e) {
            return `[CQ:image,file=N/A] (Error reading source info)`;
        }
    }

    function getIllustrationSourceInfo(imgElement) {
        let sourceLink = 'Source: N/A';
        let title = 'No Title';

        if (IS_ARTWORK_PAGE) {
            const urlMatch = window.location.pathname.match(/\/artworks\/(\d+)/);
            sourceLink = urlMatch ? PIXIV_BASE_URL + urlMatch[0] : window.location.href;
            title = document.title.replace(/ | - pixiv$/, '').trim();
            if (!title || title.includes('pixiv')) title = imgElement.alt.trim() || 'No Title';
        } else {
            try {
                const li = imgElement.closest('li');
                const aElement = li?.querySelector('a[href*="/artworks/"]:not([class*="user"])');
                if (!aElement) {
                     const directLink = imgElement.closest('a[href*="/artworks/"]');
                     if(directLink) {
                         sourceLink = directLink.href;
                         title = directLink.textContent.trim() || imgElement.alt || 'No Title';
                     }
                } else {
                    sourceLink = aElement.href;
                    title = aElement.textContent.trim() || imgElement.alt || 'No Title';
                }
            } catch (e) { console.error(e); }
        }
        return { sourceLink, title };
    }

    function getCachedData() { try { return JSON.parse(GM_getValue(STORAGE_KEY, '{}')); } catch (e) { return {}; } }
    function setCachedData(data) { GM_setValue(STORAGE_KEY, JSON.stringify(data)); }
    function getLinkTags(linkKey) { return linkCacheIndex.get(linkKey)?.tags || []; }
    function isLinkCached(linkKey) { return linkCacheIndex.has(linkKey); }

    function addLinkToTag(itemData, realUrl, tag) {
        const data = getCachedData();
        const finalTag = tag || '未分类';
        const parsedInfo = parseImgSrc(realUrl);
        if (!parsedInfo) return false;

        const linkKey = parsedInfo.linkKey;
        if (!data[finalTag]) data[finalTag] = [];

        const exists = data[finalTag].some(item => {
            const n = normalizeItem(item);
            return n && n.catLink === realUrl;
        });

        if (!exists) {
            data[finalTag].push(itemData);
            setCachedData(data);
            if (!linkCacheIndex.has(linkKey)) linkCacheIndex.set(linkKey, { realUrl: realUrl, tags: [] });
            const entry = linkCacheIndex.get(linkKey);
            if (!entry.tags.includes(finalTag)) entry.tags.push(finalTag);
            return true;
        }
        return false;
    }

    function removeLinkFromAllCache(linkKey) {
        const cacheEntry = linkCacheIndex.get(linkKey);
        if (!cacheEntry) return false;
        const realUrl = cacheEntry.realUrl;
        const data = getCachedData();
        let removed = false;

        for (const tag in data) {
            const initialLen = data[tag].length;
            data[tag] = data[tag].filter(item => {
                const n = normalizeItem(item);
                return n && n.catLink !== realUrl;
            });
            if (data[tag].length !== initialLen) removed = true;
            if (data[tag].length === 0) delete data[tag];
        }

        if (removed) {
            setCachedData(data);
            linkCacheIndex.delete(linkKey);
        }
        return removed;
    }

    // === UI 交互控制 (定时器逻辑) ===

    function scheduleMenuClose() {
        if (menuCloseTimer) clearTimeout(menuCloseTimer);
        menuCloseTimer = setTimeout(() => {
            const menu = document.getElementById('tag-select-menu');
            if (menu) menu.remove();
            activeMenuButton = null;
        }, 3000); // 1秒后消失
    }

    function cancelMenuClose() {
        if (menuCloseTimer) {
            clearTimeout(menuCloseTimer);
            menuCloseTimer = null;
        }
    }

    // === UI 生成函数 ===

    function createTagButton(isCached, isArtworkPage) {
        const button = document.createElement('div');
        button.className = 'ppg-btn ' + (isCached ? 'cached' : 'uncached');
        if (isArtworkPage) button.classList.add('ppg-btn-large');
        button.innerHTML = '&#43;';
        return button;
    }

    function updateButtonVisuals(button, linkKey) {
        if (!linkKey) {
            button.className = 'ppg-btn error';
            button.title = '无法解析ID';
            return;
        }
        const tags = getLinkTags(linkKey);
        const isCached = tags.length > 0;
        button.classList.remove('cached', 'uncached', 'error');
        button.classList.add(isCached ? 'cached' : 'uncached');
        button.title = isCached
            ? `已存: ${tags.join(', ')} | 双击移除`
            : `未缓存`;
    }

    function createTagInputMenu(button, imgElement, linkKey, illustId, pageIndex) {
        const cachedData = getCachedData();
        const existingTags = Object.keys(cachedData);
        const sourceInfo = getIllustrationSourceInfo(imgElement);

        const menu = document.createElement('div');
        menu.id = 'tag-select-menu';

        const currentTags = linkKey ? getLinkTags(linkKey).join(', ') : '无';
        const infoText = linkKey ? `(标签: ${currentTags})` : '(未缓存)';

        menu.innerHTML = `
            <div style="word-break: break-all; color:#aaa; margin-bottom:2px;">${sourceInfo.sourceLink}</div>
            <div style="font-weight:bold; margin-bottom:4px;">${sourceInfo.title}</div>
            <i style="font-size: 11px; color: #ccc;">${infoText}</i>
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '标签名...';
        input.setAttribute('list', 'pixiv-tag-list');

        const datalist = document.createElement('datalist');
        datalist.id = 'pixiv-tag-list';
        existingTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            datalist.appendChild(option);
        });

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '缓存';
        confirmButton.className = 'ppg-btn-confirm';

        confirmButton.onclick = async () => {
            const tag = input.value.trim();
            if (!tag) { input.style.borderColor = 'red'; return; }
            if (!illustId) { alert("ID Error"); return; }

            confirmButton.disabled = true;
            confirmButton.textContent = '...';

            try {
                const res = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET", url: `/ajax/illust/${illustId}/pages`,
                        onload: (r) => resolve(JSON.parse(r.responseText)), onerror: reject
                    });
                });

                if (res.error) throw new Error(res.message);
                const pageData = res.body[pageIndex];
                if (!pageData) throw new Error('No page index');

                const finalUrlToCache = pageData.urls.original.replace('i.pximg.net', 'i.pixiv.cat');
                const itemToCache = {
                    catLink: finalUrlToCache, sourceLink: sourceInfo.sourceLink, title: sourceInfo.title
                };

                addLinkToTag(itemToCache, finalUrlToCache, tag);

                const newParsed = parseImgSrc(finalUrlToCache);
                if (newParsed) button.linkKey = newParsed.linkKey;

                updateButtonVisuals(button, button.linkKey);
                button.innerHTML = '&#10003;';
                setTimeout(() => button.innerHTML = '&#43;', 1000);
                menu.remove();
                activeMenuButton = null;

            } catch (e) {
                console.error(e);
                confirmButton.disabled = false;
                confirmButton.textContent = '重试';
            }
        };

        menu.appendChild(datalist);
        menu.appendChild(input);
        menu.appendChild(confirmButton);

        // 菜单自身的悬停事件
        menu.addEventListener('mouseenter', cancelMenuClose);
        menu.addEventListener('mouseleave', scheduleMenuClose);

        return menu;
    }

    function showTagInputMenu(button, imgElement, linkKey, illustId, pageIndex) {
        // 如果当前已经打开了该按钮的菜单，则只取消关闭定时器
        if (document.getElementById('tag-select-menu') && activeMenuButton === button) {
            cancelMenuClose();
            return;
        }

        document.getElementById('tag-select-menu')?.remove();

        const menu = createTagInputMenu(button, imgElement, linkKey, illustId, pageIndex);
        document.body.appendChild(menu);
        activeMenuButton = button;

        const rect = button.getBoundingClientRect();
        const left = (window.innerWidth - rect.right < 220) ? rect.left - 210 : rect.right + 10;

        menu.style.position = 'fixed';
        menu.style.top = `${Math.max(10, rect.top)}px`;
        menu.style.left = `${left}px`;

        menu.querySelector('input').focus();
    }

    // === 主逻辑 ===

    function processImages() {
        let selectors = [IMG_SELECTOR_LIST];
        if (IS_ARTWORK_PAGE) selectors.push(IMG_SELECTOR_ARTWORK);

        const images = document.querySelectorAll(selectors.join(','));
        if (images.length === 0) return;

        images.forEach(img => {
            img.setAttribute('data-tag-processed', 'true');
            let targetContainer = img.parentElement;

            if (!IS_ARTWORK_PAGE) {
                 const linkParent = img.closest('a');
                 if (linkParent && linkParent.parentElement) targetContainer = linkParent.parentElement;
            } else {
                 const linkParent = img.closest('a');
                 if(linkParent) targetContainer = linkParent.parentElement;
            }

            const style = window.getComputedStyle(targetContainer);
            if (style.position === 'static') targetContainer.style.position = 'relative';

            const parsedInfo = parseImgSrc(img.src);
            let illustId = parsedInfo?.illustId;
            let pageIndex = parsedInfo?.pageIndex || 0;

            if (!illustId) {
                if (IS_ARTWORK_PAGE) {
                     const m = window.location.pathname.match(/\/artworks\/(\d+)/);
                     if(m) illustId = m[1];
                } else {
                     const link = img.closest('a[href*="/artworks/"]');
                     if(link) {
                         const m = link.href.match(/\/artworks\/(\d+)/);
                         if(m) illustId = m[1];
                     }
                }
            }

            const linkKey = (illustId) ? `${illustId}_p${pageIndex}` : null;
            const isCached = linkKey ? isLinkCached(linkKey) : false;

            const button = createTagButton(isCached, IS_ARTWORK_PAGE);
            button.linkKey = linkKey;
            button.illustId = illustId;
            button.pageIndex = pageIndex;
            button.imgElement = img;

            updateButtonVisuals(button, linkKey);

            // === 悬停触发逻辑 ===
            button.addEventListener('mouseenter', () => {
                cancelMenuClose(); // 取消可能存在的关闭操作
                showTagInputMenu(button, img, button.linkKey, button.illustId, button.pageIndex);
            });

            button.addEventListener('mouseleave', () => {
                scheduleMenuClose(); // 启动1秒后关闭
            });
            // ==================

            button.ondblclick = (e) => {
                e.stopPropagation();
                if (!button.linkKey) return;
                const url = linkCacheIndex.get(button.linkKey)?.realUrl || "Unknown";
                if (confirm(`从所有标签移除此图?`)) {
                    removeLinkFromAllCache(button.linkKey);
                    updateButtonVisuals(button, button.linkKey);
                }
            };

            if (!targetContainer.querySelector('.ppg-btn')) targetContainer.appendChild(button);
        });
    }

    // === 导出功能 ===
    function exportJson(dataToExport, filename) {
        const jsonContent = {
            "_title": ["pixiv图片转载"],
            "_author": ["Yog-Sothoth"],
            "_date": [new Date().toISOString().slice(0, 10).replace(/-/g, '/')],
            "_version": ["1.0"],
            ...dataToExport
        };

        const blob = new Blob([JSON.stringify(jsonContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function createExportMenuUI() {
        document.getElementById('tag-export-menu')?.remove();
        const data = getCachedData();
        const tags = Object.keys(data).filter(tag => data[tag].length > 0);

        if (tags.length === 0) { alert('无缓存数据'); return; }

        const menu = document.createElement('div');
        menu.id = 'tag-export-menu';

        menu.innerHTML = `<h3>导出 JSON</h3>`;

        // 顶部操作区
        const actionDiv = document.createElement('div');
        actionDiv.className = 'export-actions';

        const btnAll = document.createElement('button');
        btnAll.textContent = '➡️ 导出全部';
        btnAll.className = 'btn-green';
        btnAll.onclick = () => {
            const exportData = {};
            tags.forEach(t => exportData[t] = data[t].map(formatToCQImage));
            exportJson(exportData, `All_${CACHE_NAME}`);
        };

        const btnClose = document.createElement('button');
        btnClose.textContent = '关闭';
        btnClose.className = 'btn-gray';
        btnClose.onclick = () => menu.remove();

        actionDiv.appendChild(btnAll);
        actionDiv.appendChild(btnClose);
        menu.appendChild(actionDiv);

        // 标签网格区 (双列)
        const gridDiv = document.createElement('div');
        gridDiv.className = 'export-grid';

        tags.forEach(tag => {
            const btn = document.createElement('button');
            btn.textContent = `${tag} (${data[tag].length})`;
            btn.className = 'ppg-btn-export';
            btn.title = `导出标签: ${tag}`;
            btn.onclick = () => {
                const exportData = {};
                exportData[tag] = data[tag].map(formatToCQImage);
                exportJson(exportData, `${tag}_${CACHE_NAME}`);
            };
            gridDiv.appendChild(btn);
        });

        menu.appendChild(gridDiv);
        document.body.appendChild(menu);
    }

    // === 初始化 ===
    function init() {
        buildCacheIndex();
        GM_registerMenuCommand('⬇️ 导出数据', createExportMenuUI);
        GM_registerMenuCommand('🗑️ 清空缓存', () => { if(confirm('确定清空？')) { GM_deleteValue(STORAGE_KEY); location.reload(); }});

        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            if (e.code === 'Numpad4') navigatePage(-1);
            if (e.code === 'Numpad6') navigatePage(1);
        });

        processImages();
        const debouncedProcess = debounce(processImages, 300);
        const observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length > 0)) debouncedProcess();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function navigatePage(step) {
        const url = new URL(window.location.href);
        let p = parseInt(url.searchParams.get('p') || '1', 10);
        p = Math.max(1, p + step);
        url.searchParams.set('p', p);
        window.location.href = url.href;
    }

    init();
})();