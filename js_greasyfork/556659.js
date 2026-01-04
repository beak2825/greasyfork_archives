// ==UserScript==
// @name         Roblox Model Thumbnail Downloader HD PNG
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在 Roblox creations 页面为每个物品增加高清 PNG 单个下载按钮 + 左侧勾选 + 批量下载 + 每行“本行全选”复选框
// @author       m.
// @match        https://create.roblox.com/dashboard/creations*
// @exclude      https://create.roblox.com/dashboard/creations/experiences/*/monetization*
// @icon         https://www.roblox.com/favicon.ico
// @grant        GM_download
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556659/Roblox%20Model%20Thumbnail%20Downloader%20HD%20PNG.user.js
// @updateURL https://update.greasyfork.org/scripts/556659/Roblox%20Model%20Thumbnail%20Downloader%20HD%20PNG.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SINGLE_BTN_CLASS = 'rbx-thumb-single-download';
    const CHECKBOX_CLASS = 'rbx-thumb-select-checkbox';
    const BATCH_BTN_ID = 'rbx-thumb-batch-download-btn';
    const ROW_WRAPPER_CLASS = 'rbx-thumb-row-select-wrapper';
    const ROW_MASTER_CLASS = 'rbx-thumb-row-select-master';
    const BATCH_DELAY_MS = 500; // 批量下载之间的间隔（毫秒）

    // 简单判断是否暗色模式（用系统色彩方案）
    const IS_DARK = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    // ========== 工具函数 ==========

    function sanitizeFileName(name) {
        return name
            .replace(/[\\/:*?"<>|]+/g, '_')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function convertToHdPng(url) {
        let clean = url.split('?')[0];

        let match = clean.match(/\/(\d+)\/(\d+)\/([^/]+)\/([^/]+)/i);
        if (!match) return clean;

        let width = parseInt(match[1], 10);
        let height = parseInt(match[2], 10);
        let format = match[4];

        let newWidth = width;
        let newHeight = height;

        if (width === height) {
            newWidth = 1024;
            newHeight = 1024;
        } else if (Math.abs(width / height - 1024 / 576) < 0.01) {
            newWidth = 1024;
            newHeight = 576;
        }

        let newUrl = clean.replace(/\/\d+\/\d+\//, `/${newWidth}/${newHeight}/`);
        let formatReg = new RegExp(`/${format}`, 'i');
        newUrl = newUrl.replace(formatReg, '/Png');
        return newUrl;
    }

    function downloadImage(url, fileName) {
        GM_download({
            url,
            name: fileName,
            saveAs: false,
            onerror: function (e) {
                console.error('[ThumbDL] 下载失败', e);
                alert('下载失败：' + (e && e.error || '未知错误'));
            }
        });
    }

    // ========== DOM 解析（统一从 <a> 开始） ==========

    function getAllItemAnchors() {
        const anchors = Array.from(
            document.querySelectorAll('a[href*="/dashboard/creations/"][href*="/configure"]')
        );
        return anchors.filter(a => a.querySelector('img[src*="rbxcdn.com"]'));
    }

    function getAnchorDownloadInfo(anchor) {
        const img = anchor.querySelector('img[src*="rbxcdn.com"]');
        if (!img) return null;

        let itemName = '';
        const spans = anchor.querySelectorAll('span');
        for (const s of spans) {
            const text = s.textContent.trim();
            if (!text) continue;
            if (/^Created/i.test(text)) continue;
            if (text.length <= 2) continue;
            itemName = text;
            break;
        }
        if (!itemName && spans.length > 0) {
            itemName = spans[0].textContent.trim();
        }
        if (!itemName) itemName = 'roblox_item';

        const safeName = sanitizeFileName(itemName) || 'roblox_item';
        const src = img.src.split('?')[0];
        const hdUrl = convertToHdPng(src);
        const fileName = safeName + '.png';

        return { img, itemName, hdUrl, fileName, anchor };
    }

    // ========== 单个下载按钮 ==========

    function ensureSingleDownloadButtonForAnchor(anchor) {
        const container =
            anchor.closest('.web-blox-css-tss-nuh198-container') ||
            anchor.parentElement ||
            anchor;

        if (container.querySelector('.' + SINGLE_BTN_CLASS)) return;

        const info = getAnchorDownloadInfo(anchor);
        if (!info) return;

        const btn = document.createElement('button');
        btn.textContent = '下载图片';
        btn.title = '下载高清 PNG 缩略图';
        btn.className = SINGLE_BTN_CLASS;
        btn.style.padding = '4px 8px';
        btn.style.marginTop = '4px';
        btn.style.marginRight = '8px';
        btn.style.fontSize = '12px';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.whiteSpace = 'nowrap';
        btn.style.display = 'inline-block';

        if (IS_DARK) {
            btn.style.background = '#2b2b33';
            btn.style.border = '1px solid #555';
            btn.style.color = '#ffffff';
            btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.4)';
        } else {
            btn.style.background = '#ffffff';
            btn.style.border = '1px solid #ccc';
            btn.style.color = '#000000';
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            console.log('[ThumbDL] 单个下载:', info.hdUrl, '=>', info.fileName);
            downloadImage(info.hdUrl, info.fileName);
        });

        container.appendChild(btn);
    }

    // ========== 左侧勾选框 ==========

    function ensureCheckboxForAnchor(anchor) {
        const container =
            anchor.closest('.web-blox-css-tss-nuh198-container') ||
            anchor.parentElement ||
            anchor;

        if (container.querySelector('.' + CHECKBOX_CLASS)) return;

        const computedPos = getComputedStyle(container).position;
        if (computedPos === 'static' || !computedPos) {
            container.style.position = 'relative';
        }

        const style = getComputedStyle(container);
        const curPaddingLeft = parseFloat(style.paddingLeft) || 0;
        if (curPaddingLeft < 24) {
            container.style.paddingLeft = (curPaddingLeft + 24) + 'px';
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = CHECKBOX_CLASS;
        checkbox.title = '选择此项用于批量下载';
        checkbox.style.position = 'absolute';
        checkbox.style.left = '4px';
        checkbox.style.top = '50%';
        checkbox.style.transform = 'translateY(-50%)';
        checkbox.style.zIndex = '5';
        checkbox.style.width = '16px';
        checkbox.style.height = '16px';
        checkbox.style.cursor = 'pointer';

        if (IS_DARK) {
            checkbox.style.background = '#111';
            checkbox.style.border = '1px solid #777';
            checkbox.style.boxShadow = '0 0 2px rgba(0,0,0,0.8)';
            // 浏览器支持的话，设置勾选颜色亮一点
            checkbox.style.accentColor = '#00d0ff';
        } else {
            checkbox.style.background = '#fff';
            checkbox.style.border = '1px solid #666';
            checkbox.style.accentColor = '#007bff';
        }

        checkbox.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        container.appendChild(checkbox);
    }

    // ========== 行分组 + “本行全选” ==========

    function layoutRowSelectors() {
        document.querySelectorAll('.' + ROW_WRAPPER_CLASS).forEach(el => el.remove());

        const anchors = getAllItemAnchors();
        if (!anchors.length) return;

        const containerSet = new Set();
        const containers = [];
        anchors.forEach(a => {
            const c = a.closest('.web-blox-css-tss-nuh198-container') || a.parentElement || a;
            if (!containerSet.has(c)) {
                containerSet.add(c);
                containers.push(c);
            }
        });
        if (!containers.length) return;

        const sorted = containers.slice().sort((a, b) => {
            return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
        });

        const rows = [];
        const ROW_THRESHOLD = 30;
        sorted.forEach(card => {
            const top = card.getBoundingClientRect().top;
            if (!rows.length) {
                rows.push({ top, cards: [card] });
            } else {
                const lastRow = rows[rows.length - 1];
                if (Math.abs(top - lastRow.top) < ROW_THRESHOLD) {
                    lastRow.cards.push(card);
                } else {
                    rows.push({ top, cards: [card] });
                }
            }
        });

        rows.forEach(row => {
            const firstCard = row.cards[0];
            if (!firstCard) return;

            const wrapper = document.createElement('div');
            wrapper.className = ROW_WRAPPER_CLASS;
            wrapper.style.marginTop = '4px';
            wrapper.style.fontSize = '12px';
            wrapper.style.display = 'inline-flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.userSelect = 'none';

            // 暗色模式下给一点背景和白字
            if (IS_DARK) {
                wrapper.style.background = 'rgba(0,0,0,0.4)';
                wrapper.style.borderRadius = '4px';
                wrapper.style.padding = '2px 6px';
                wrapper.style.color = '#f5f5f5';
            } else {
                wrapper.style.color = '#444';
            }

            const master = document.createElement('input');
            master.type = 'checkbox';
            master.className = ROW_MASTER_CLASS;
            master.style.marginRight = '4px';
            master.title = '勾选/取消本行全部';
            if (IS_DARK) {
                master.style.background = '#111';
                master.style.border = '1px solid #777';
                master.style.boxShadow = '0 0 2px rgba(0,0,0,0.8)';
                master.style.accentColor = '#00d0ff';
            } else {
                master.style.background = '#fff';
                master.style.border = '1px solid #666';
                master.style.accentColor = '#007bff';
            }

            const label = document.createElement('span');
            label.textContent = '本行全选';
            label.style.cursor = 'pointer';

            let anyChecked = false;
            let allChecked = true;
            let hasCheckbox = false;

            row.cards.forEach(card => {
                const cb = card.querySelector('.' + CHECKBOX_CLASS);
                if (!cb) return;
                hasCheckbox = true;
                if (cb.checked) {
                    anyChecked = true;
                } else {
                    allChecked = false;
                }
            });

            if (!hasCheckbox) {
                allChecked = false;
                anyChecked = false;
            }

            master.checked = allChecked;
            master.indeterminate = anyChecked && !allChecked;

            function toggleRow(checked) {
                row.cards.forEach(card => {
                    const cb = card.querySelector('.' + CHECKBOX_CLASS);
                    if (cb) cb.checked = checked;
                });
            }

            master.addEventListener('click', e => {
                e.stopPropagation();
            });

            master.addEventListener('change', () => {
                master.indeterminate = false;
                toggleRow(master.checked);
            });

            label.addEventListener('click', e => {
                e.stopPropagation();
                const newChecked = !master.checked;
                master.checked = newChecked;
                master.indeterminate = false;
                toggleRow(newChecked);
            });

            wrapper.appendChild(master);
            wrapper.appendChild(label);

            firstCard.appendChild(wrapper);
        });
    }

    // ========== 扫描并补齐按钮 + 勾选框 + 行选择 ==========

    function processItems() {
        const anchors = getAllItemAnchors();
        anchors.forEach(anchor => {
            ensureSingleDownloadButtonForAnchor(anchor);
            ensureCheckboxForAnchor(anchor);
        });

        layoutRowSelectors();
    }

    // ========== 批量下载「已勾选」 ==========

    async function batchDownloadSelected() {
        const anchors = getAllItemAnchors();

        const infos = [];
        anchors.forEach(anchor => {
            const container =
                anchor.closest('.web-blox-css-tss-nuh198-container') ||
                anchor.parentElement ||
                anchor;
            const cb = container.querySelector('.' + CHECKBOX_CLASS);
            if (!cb || !cb.checked) return;

            const info = getAnchorDownloadInfo(anchor);
            if (info) infos.push(info);
        });

        if (!infos.length) {
            alert('请先在左侧或本行勾选要下载的物品。');
            return;
        }

        if (!confirm(`确认下载已勾选的 ${infos.length} 张图片？`)) {
            return;
        }

        console.log('[ThumbDL] 开始批量下载已勾选，共', infos.length, '个');
        for (let i = 0; i < infos.length; i++) {
            const info = infos[i];
            console.log(`[ThumbDL] (${i + 1}/${infos.length})`, info.hdUrl, '=>', info.fileName);
            downloadImage(info.hdUrl, info.fileName);

            if (i < infos.length - 1) {
                // eslint-disable-next-line no-await-in-loop
                await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
            }
        }
    }

    // ========== 悬浮「下载已勾选」按钮 ==========

    function createBatchButton() {
        if (document.getElementById(BATCH_BTN_ID)) return;

        const btn = document.createElement('button');
        btn.id = BATCH_BTN_ID;
        btn.textContent = '下载已勾选';
        btn.title = '下载所有左侧打勾的物品的高清 PNG 图';
        btn.style.position = 'fixed';
        btn.style.right = '16px';
        btn.style.bottom = '16px';
        btn.style.zIndex = '9999';
        btn.style.padding = '8px 12px';
        btn.style.fontSize = '13px';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.whiteSpace = 'nowrap';

        if (IS_DARK) {
            btn.style.background = '#2b2b33';
            btn.style.border = '1px solid #555';
            btn.style.color = '#ffffff';
            btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.6)';
        } else {
            btn.style.background = '#ffffffee';
            btn.style.border = '1px solid #ccc';
            btn.style.color = '#000000';
            btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            batchDownloadSelected();
        });

        document.body.appendChild(btn);
    }

    // ========== 监听 DOM 变化（翻页 / 滚动懒加载） ==========

    function initObserver() {
        let timer = null;
        const observer = new MutationObserver(() => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                processItems();
            }, 200);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ========== 启动 ==========

    processItems();
    createBatchButton();
    initObserver();
    setTimeout(processItems, 2000);
})();
