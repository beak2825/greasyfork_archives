// ==UserScript==
// @name        批量复制未下载作品链接（基于ExHentai Lanraragi Checker脚本）
// @namespace   https://github.com/Putarku
// @match       https://exhentai.org/*
// @match       https://e-hentai.org/*
// @grant       GM_setClipboard
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @license MIT
// @version     1.0
// @author      sitiyou
// @description Floating panel for copying ExHentai/E-Hentai gallery links)
// @downloadURL https://update.greasyfork.org/scripts/562406/%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E6%9C%AA%E4%B8%8B%E8%BD%BD%E4%BD%9C%E5%93%81%E9%93%BE%E6%8E%A5%EF%BC%88%E5%9F%BA%E4%BA%8EExHentai%20Lanraragi%20Checker%E8%84%9A%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562406/%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E6%9C%AA%E4%B8%8B%E8%BD%BD%E4%BD%9C%E5%93%81%E9%93%BE%E6%8E%A5%EF%BC%88%E5%9F%BA%E4%BA%8EExHentai%20Lanraragi%20Checker%E8%84%9A%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .lrr-floating-panel {
            position: fixed;
            right: 16px;
            bottom: 16px;
            width: 220px;
            background: rgba(22,22,22,0.95);
            color: #fff;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.5);
            z-index: 9999;
            font-size: 13px;
            line-height: 1.4;
        }

        .lrr-floating-panel .lrr-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .lrr-floating-panel h4 {
            margin: 0;
            font-size: 13px;
        }

        .lrr-floating-panel label {
            display: block;
            margin-bottom: 6px;
            cursor: pointer;
        }

        .lrr-floating-panel .lrr-copy-btn {
            display: inline-block;
            margin-top: 8px;
            padding: 6px 10px;
            background: #2ea44f;
            color: #fff;
            border-radius: 6px;
            cursor: pointer;
            border: none;
        }

        .lrr-floating-panel .lrr-small-btn {
            background: #6a737d;
            margin-left: 6px;
        }

        .lrr-floating-panel.collapsed {
            width: 40px;
            height: 40px;
            padding: 6px;
            overflow: visible;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .lrr-floating-panel.collapsed .lrr-panel-header {
            margin-bottom: 0;
            justify-content: center;
        }

        .lrr-floating-panel.collapsed h4 {
            font-size: 16px;
        }

        .lrr-floating-panel .lrr-panel-body { }

        .lrr-floating-panel.collapsed .lrr-panel-body {
            display: none;
        }

        .lrr-toggle-btn {
            background: transparent;
            color: #fff;
            border: none;
            cursor: pointer;
            font-size: 14px;
            padding: 2px 6px;
            border-radius: 4px;
        }

        .lrr-marker-not-marked {
            color: #999;
            background-color: #444;
        }

        .lrr-options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 8px;
        }

        .lrr-options-grid label {
            display: flex;
            align-items: center;
            margin-bottom: 0 !important;
        }

        .lrr-item-checkbox {
            margin-right: 4px;
            vertical-align: middle;
        }

        .lrr-checkbox-wrapper {
            display: inline-block;
            padding: 0;
            margin: 0;
            background-color: transparent;
            border: none;
            margin-right: 4px;
            line-height: 1;
        }

        .lrr-item-checkbox {
            display: none;
        }

        .lrr-checkbox-label {
            display: inline-flex;
            align-items: center;
            vertical-align: middle;
            cursor: pointer;
            margin-right: 4px;
        }

        .lrr-checkbox-custom {
            display: inline-block;
            width: 1em;
            height: 1em;
            border: 1px solid #888;
            border-radius: 2px;
            margin-right: 4px;
            vertical-align: -0.15em;
            background-color: #fff;
        }

        .lrr-item-checkbox:checked + .lrr-checkbox-label .lrr-checkbox-custom {
            background-color: #4a9eff;
            border-color: #2a7dd7;
        }

        .lrr-item-checkbox:checked + .lrr-checkbox-label .lrr-checkbox-custom::after {
            content: '✓';
            display: block;
            text-align: center;
            line-height: 1;
            color: #fff;
            font-size: 0.8em;
            font-weight: bold;
        }

        .lrr-title-selected {
            font-weight: bold;
            color: #28a745 !important;
            text-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
        }
        /* Ensure nested text also turns green, but keep marker spans' own colors */
        .lrr-title-selected :not(.lrr-marker-span) {
            color: #28a745 !important;
        }
    `);

    function createFloatingPanel() {
        const panel = document.createElement('div');
        panel.className = 'lrr-floating-panel';

        // Header with title and toggle button
        const header = document.createElement('div');
        header.className = 'lrr-panel-header';
        header.style.cursor = 'pointer';

        const title = document.createElement('h4');
        title.style.margin = '0';
        title.style.fontSize = '13px';
        
        const titleText = document.createElement('span');
        titleText.textContent = 'LRR';
        
        const countText = document.createElement('span');
        countText.style.fontSize = '11px';
        countText.style.opacity = '0.8';
        countText.style.marginLeft = '4px';
        countText.textContent = '';
        
        title.appendChild(titleText);
        title.appendChild(countText);
        header.appendChild(title);

        panel.appendChild(header);

        // Body with checkboxes and buttons
        const body = document.createElement('div');
        body.className = 'lrr-panel-body';

        const options = [
            { key: 'not_marked', label: '未标记', icon: '○', marker: 'lrr-marker-not-marked' },
            { key: 'downloaded', label: '已下载', icon: '✔', marker: 'lrr-marker-downloaded' },
            { key: 'possible_duplicate', label: '可能重复', icon: '！', marker: 'lrr-marker-file' },
            { key: 'error', label: '错误', icon: '❓', marker: 'lrr-marker-error' }
        ];

        // Create grid container for options
        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'lrr-options-grid';

        options.forEach(opt => {
            const id = `lrr-opt-${opt.key}`;
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.value = opt.key;
            checkbox.style.marginRight = '6px';
            label.appendChild(checkbox);
            
            // Add icon with marker style
            const iconSpan = document.createElement('span');
            iconSpan.className = `lrr-marker-span ${opt.marker}`;
            iconSpan.textContent = opt.icon;
            iconSpan.style.marginRight = '4px';
            label.appendChild(iconSpan);
            
            // Add plain text label
            const textSpan = document.createElement('span');
            textSpan.textContent = opt.label;
            label.appendChild(textSpan);
            
            optionsGrid.appendChild(label);
        });

        body.appendChild(optionsGrid);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'lrr-copy-btn';
        copyBtn.textContent = '复制链接';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'lrr-copy-btn lrr-small-btn';
        clearBtn.textContent = '清除选择';

        const status = document.createElement('div');
        status.style.marginTop = '8px';
        status.style.fontSize = '12px';

        body.appendChild(copyBtn);
        body.appendChild(clearBtn);
        body.appendChild(status);
        panel.appendChild(body);

        document.body.appendChild(panel);

        // Add checkboxes to each gallery item
        function addGalleryCheckboxes() {
            const galleryAnchors = document.querySelectorAll('.itg .gl1t a[href*="/g/"]');
            galleryAnchors.forEach((a, index) => {
                const titleEl = a.querySelector('.glink');
                if (!titleEl) return;
                
                // Check if checkbox already exists
                if (titleEl.querySelector('.lrr-item-checkbox')) return;
                
                const checkboxId = `lrr-item-${Date.now()}-${index}`;
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = checkboxId;
                checkbox.className = 'lrr-item-checkbox';
                checkbox.dataset.galleryUrl = a.href;
                
                const label = document.createElement('label');
                label.className = 'lrr-checkbox-label';
                label.htmlFor = checkboxId;
                
                const customCheckbox = document.createElement('span');
                customCheckbox.className = 'lrr-checkbox-custom';
                
                label.appendChild(customCheckbox);
                
                const wrapper = document.createElement('span');
                wrapper.className = 'lrr-checkbox-wrapper';
                wrapper.appendChild(checkbox);
                wrapper.appendChild(label);
                
                titleEl.insertBefore(wrapper, titleEl.firstChild);
            });
        }

        // Helper: collect links from checked individual checkboxes
        function collectLinks() {
            const links = [];

            // Iterate all gallery links on page
            const galleryAnchors = document.querySelectorAll('.itg .gl1t a[href*="/g/"]');
            galleryAnchors.forEach(a => {
                const titleEl = a.querySelector('.glink');
                if (!titleEl) return;
                
                const itemCheckbox = titleEl.querySelector('.lrr-item-checkbox');
                if (itemCheckbox && itemCheckbox.checked) {
                    links.push(a.href);
                }
            });

            return links;
        }

        // Helper: update gallery checkboxes based on panel selections
        function updateGalleryCheckboxes() {
            const selected = Array.from(panel.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
            
            const galleryAnchors = document.querySelectorAll('.itg .gl1t a[href*="/g/"]');
            galleryAnchors.forEach(a => {
                const titleEl = a.querySelector('.glink');
                if (!titleEl) return;
                
                const marker = titleEl.querySelector('.lrr-marker-span');
                const itemCheckbox = titleEl.querySelector('.lrr-item-checkbox');
                if (!itemCheckbox) return;

                // Check CSS classes to determine type
                const isDownloaded = marker && marker.classList.contains('lrr-marker-downloaded');
                const isFile = marker && marker.classList.contains('lrr-marker-file');
                const isError = marker && marker.classList.contains('lrr-marker-error');

                // Map to categories
                const categories = [];
                if (!marker) categories.push('not_marked');
                if (isDownloaded) categories.push('downloaded');
                if (isFile) categories.push('possible_duplicate');
                if (isError) categories.push('error');

                // Check if any selected category matches
                itemCheckbox.checked = selected.some(s => categories.includes(s));
                
                // Update title style
                if (itemCheckbox.checked) {
                    titleEl.classList.add('lrr-title-selected');
                } else {
                    titleEl.classList.remove('lrr-title-selected');
                }
            });
        }

        // Initialize gallery checkboxes
        addGalleryCheckboxes();

        // Attach listeners to item checkboxes
        attachItemCheckboxListeners();

        // Helper: copy text to clipboard using GM_setClipboard
        function copyToClipboard(text) {
            return new Promise((resolve, reject) => {
                try {
                    GM_setClipboard(text);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        }

        // Event listeners
        copyBtn.addEventListener('click', async () => {
            const links = collectLinks();
            if (links.length === 0) {
                status.textContent = '未找到匹配链接';
                return;
            }
            const text = links.join('\n');
            try {
                await copyToClipboard(text);
                status.textContent = `已复制 ${links.length} 条链接`;
            } catch (e) {
                status.textContent = '复制失败';
                console.error('[LRR Panel] Copy failed', e);
            }
        });

        clearBtn.addEventListener('click', () => {
            panel.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
            status.textContent = '';
            updateGalleryCheckboxes();
            updateCount();
        });

        // Update title style when item checkbox changes
        function updateItemCheckboxStyle(itemCheckbox) {
            const wrapper = itemCheckbox.closest('.lrr-checkbox-wrapper');
            if (!wrapper) return;
            
            const titleEl = wrapper.closest('.glink');
            if (!titleEl) return;
            
            if (itemCheckbox.checked) {
                titleEl.classList.add('lrr-title-selected');
            } else {
                titleEl.classList.remove('lrr-title-selected');
            }
        }

        // Add change listeners to all item checkboxes after they're created
        function attachItemCheckboxListeners() {
            const itemCheckboxes = document.querySelectorAll('.lrr-item-checkbox');
            itemCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    updateItemCheckboxStyle(checkbox);
                    updateCount();
                });
            });
        }

        // Update count when checkboxes change
        function updateCount() {
            const links = collectLinks();
            countText.textContent = `(已选择${links.length}个作品)`;
        }

        panel.querySelectorAll('input[type=checkbox]').forEach(cb => {
            cb.addEventListener('change', () => {
                updateGalleryCheckboxes();
                updateCount();
            });
        });

        // Collapse state persistence
        const GS_KEY = 'lrr-panel-collapsed';

        function setCollapsedState(collapsed) {
            if (collapsed) panel.classList.add('collapsed'); else panel.classList.remove('collapsed');
            try { GM_setValue(GS_KEY, collapsed ? '1' : '0'); } catch (e) {}
        }

        // Initialize collapsed by default (if no stored value, default collapsed)
        let defaultCollapsed = true;
        try {
            const stored = GM_getValue(GS_KEY);
            defaultCollapsed = stored === null ? true : (stored === '1');
        } catch (e) {
            console.error('[LRR Panel] Error reading panel state', e);
        }
        setCollapsedState(defaultCollapsed);

        // Toggle functionality
        function togglePanel() {
            const collapsedNow = panel.classList.contains('collapsed');
            setCollapsedState(!collapsedNow);
        }

        // When expanded: click header to collapse
        // When collapsed: click anywhere on panel to expand
        panel.addEventListener('click', (e) => {
            const isCollapsed = panel.classList.contains('collapsed');
            
            if (isCollapsed) {
                // Collapsed: click anywhere to expand
                togglePanel();
            } else {
                // Expanded: only header clicks toggle
                if (header.contains(e.target)) {
                    togglePanel();
                }
            }
        });
    }

    // Wait for page to load before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingPanel);
    } else {
        // DOM already loaded
        // Check if there are any gallery links on the page
        const galleryLinks = document.querySelectorAll('.itg .gl1t a[href*="/g/"] .glink');
        if (galleryLinks.length > 0) {
            createFloatingPanel();
        } else {
            console.log('[LRR Panel] No gallery links found, panel not created');
        }
    }
})();
