// ==UserScript==
// @name         Mikanani.me 批量选择工具
// @namespace    http://github.com/impasse
// @version      3.4
// @description  在Mikanani.me上添加正则批量选择和磁力链批量复制功能
// @author       yooyi
// @match        https://mikanani.me/Home/Bangumi/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558804/Mikananime%20%E6%89%B9%E9%87%8F%E9%80%89%E6%8B%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/558804/Mikananime%20%E6%89%B9%E9%87%8F%E9%80%89%E6%8B%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .batch-selector-container {
            margin: 10px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }
        .batch-selector-container input[type="text"] {
            padding: 5px 10px;
            border: 1px solid #ddd;
            border-radius: 3px;
            min-width: 300px;
        }
        .batch-selector-container button {
            padding: 6px 15px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
        }
        .batch-selector-container button:hover {
            background: #0056b3;
        }
        .batch-selector-container .copy-btn {
            background: #28a745;
        }
        .batch-selector-container .copy-btn:hover {
            background: #218838;
        }
        .batch-selector-container .select-all-btn {
            background: #6c757d;
        }
        .batch-selector-container .select-all-btn:hover {
            background: #5a6268;
        }
        .batch-selector-container .clear-btn {
            background: #dc3545;
        }
        .batch-selector-container .clear-btn:hover {
            background: #c82333;
        }
        .magnet-link {
            color: #007bff;
            cursor: pointer;
            text-decoration: none;
        }
        .magnet-link:hover {
            text-decoration: underline;
        }
        .subgroup-title {
            font-weight: bold;
            color: #333;
            margin-top: 20px;
            padding: 5px;
            background: #e9ecef;
        }
        .mbs-toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            animation: mbs-fade-in 0.3s ease;
        }
        .mbs-toast.success {
            background: rgba(40, 167, 69, 0.9);
        }
        .mbs-toast.error {
            background: rgba(220, 53, 69, 0.9);
        }
        @keyframes mbs-fade-in {
            from { opacity: 0; transform: translateX(-50%) translateY(10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes mbs-fade-in-overlay {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes mbs-scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .mbs-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: mbs-fade-in-overlay 0.2s ease;
        }
        .mbs-modal {
            background: white;
            border-radius: 8px;
            padding: 20px;
            max-width: 800px;
            width: 95%;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            animation: mbs-scale-in 0.2s ease;
        }
        .mbs-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .mbs-modal-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
        .mbs-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            padding: 0;
            line-height: 1;
        }
        .mbs-modal-close:hover {
            color: #333;
        }
        .mbs-modal-textarea {
            flex: 1;
            width: 100%;
            min-height: 200px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            box-sizing: border-box;
            overscroll-behavior: contain;
            white-space: pre;
            overflow: auto;
        }
        .mbs-modal-footer {
            margin-top: 15px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        .mbs-modal-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .mbs-modal-btn.primary {
            background: #007bff;
            color: white;
        }
        .mbs-modal-btn.primary:hover {
            background: #0056b3;
        }
        .mbs-modal-btn.secondary {
            background: #6c757d;
            color: white;
        }
        .mbs-modal-btn.secondary:hover {
            background: #5a6268;
        }
    `);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('Mikan Batch Selector: Starting initialization...');
        const subgroupHeaders = findSubgroupHeaders();
        console.log('Mikan Batch Selector: Found', subgroupHeaders.length, 'subtitle groups');

        subgroupHeaders.forEach(header => {
            const name = getSubgroupName(header);
            console.log('Mikan Batch Selector: Adding batch selector for:', name);
            addBatchSelector(header);
        });
    }

    function findSubgroupHeaders() {
        return Array.from(document.querySelectorAll('.subgroup-text'));
    }

    function getSubgroupName(headerElement) {
        return headerElement.querySelector("*[style='color: #3bc0c3;']").textContent;
    }

    function addBatchSelector(headerElement) {
        const container = document.createElement('div');
        container.className = 'batch-selector-container';

        const label = document.createElement('span');
        label.textContent = '正则匹配:';
        label.style.fontWeight = 'bold';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入正则表达式 (例如: \\[720P\\] 或 第\\d+话)';
        input.style.flex = '1';

        const selectBtn = document.createElement('button');
        selectBtn.textContent = '匹配选择';
        selectBtn.title = '根据正则表达式选择匹配的番剧';

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清除选择';
        clearBtn.className = 'clear-btn';
        clearBtn.title = '清除当前字幕组的所有选择';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制磁力链';
        copyBtn.className = 'copy-btn';
        copyBtn.title = '复制所有选中项的磁力链';

        selectBtn.addEventListener('click', () => {
            const pattern = input.value;
            if (!pattern) {
                showToast('请输入正则表达式！', 'error');
                return;
            }

            try {
                const regex = new RegExp(pattern, 'i');
                selectEpisodesByRegex(headerElement, regex);
            } catch (e) {
                showToast('正则表达式无效: ' + e.message, 'error');
            }
        });

        clearBtn.addEventListener('click', () => {
            clearSelections(headerElement);
        });

        copyBtn.addEventListener('click', () => {
            copyMagnetLinks(headerElement);
        });

        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(selectBtn);
        container.appendChild(clearBtn);
        container.appendChild(copyBtn);

        headerElement.appendChild(container);
    }

    function selectEpisodesByRegex(headerElement, regex) {
        console.log('Mikan Batch Selector: Starting regex selection...');
        const episodeItems = findEpisodeItems(headerElement);
        console.log('Mikan Batch Selector: Found', episodeItems.length, 'episode items');

        let selectedCount = 0;
        episodeItems.forEach(item => {
            const title = getEpisodeTitle(item);
            console.log('Mikan Batch Selector: Checking title:', title);
            if (regex.test(title)) {
                console.log('Mikan Batch Selector: Match found!');
                const checkbox = findOrCreateCheckbox(item);
                if (checkbox) {
                    checkbox.checked = true;
                    selectedCount++;
                }
            }
        });

        showToast(`已选择 ${selectedCount} 个匹配的番剧`, 'success');
    }

    function getEpisodeTitle(item) {
        const titleLink = item.querySelector('a[href*="/Home/Episode/"]') ||
                         item.querySelector('a[href^="/Download/"]') ||
                         item.querySelector('td, div');
        return titleLink?.textContent || titleLink?.title || '';
    }

    function findEpisodeItems(headerElement) {
        console.log('Mikan Batch Selector: findEpisodeItems - Starting search...');
        console.log('Mikan Batch Selector: Current subgroup:', getSubgroupName(headerElement));
        const items = Array.from(headerElement.nextElementSibling.querySelectorAll('tr'));
        console.log('Mikan Batch Selector: Total episode items found:', items.length);
        return items;
    }

    function findOrCreateCheckbox(item) {
        let checkbox = item.querySelector('input[type="checkbox"]');

        if (!checkbox) {
            checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '8px';

            const firstCell = item.querySelector('td:first-child');
            if (firstCell) {
                firstCell.insertBefore(checkbox, firstCell.firstChild);
            } else {
                item.insertBefore(checkbox, item.firstChild);
            }
        }

        return checkbox;
    }

    function getCheckboxes(headerElement) {
        return findEpisodeItems(headerElement).map(item => item.querySelector('input[type="checkbox"]'));
    }

    function clearSelections(headerElement) {
        getCheckboxes(headerElement).forEach(checkbox => {
            if (checkbox) checkbox.checked = false;
        });
    }

    function copyMagnetLinks(headerElement) {
        const magnetLinks = getCheckboxes(headerElement)
            .filter(checkbox => checkbox?.checked)
            .map(checkbox => {
                const item = checkbox.closest('tr');
                const copyButton = Array.from(item.querySelectorAll('a')).find(a =>
                    a.textContent.includes('复制磁链') || a.textContent.includes('复制磁连')
                );
                return copyButton?.getAttribute('data-clipboard-text');
            })
            .filter(Boolean);

        if (magnetLinks.length === 0) {
            showToast('没有选中的番剧！', 'error');
            return;
        }

        showMagnetModal(magnetLinks);
    }

    function showToast(message, type = '') {
        const toast = document.createElement('div');
        toast.className = `mbs-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    function showMagnetModal(magnets) {
        const overlay = document.createElement('div');
        overlay.className = 'mbs-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'mbs-modal';

        modal.innerHTML = `
            <div class="mbs-modal-header">
                <span class="mbs-modal-title">磁力链 (${magnets.length} 条)</span>
                <button class="mbs-modal-close">&times;</button>
            </div>
            <textarea class="mbs-modal-textarea" readonly>${magnets.join('\n')}</textarea>
            <div class="mbs-modal-footer">
                <button class="mbs-modal-btn secondary">关闭</button>
                <button class="mbs-modal-btn primary">复制全部</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const closeBtn = modal.querySelector('.mbs-modal-close');
        const secondaryBtn = modal.querySelector('.secondary');
        const primaryBtn = modal.querySelector('.primary');

        const close = () => overlay.remove();

        closeBtn.addEventListener('click', close);
        secondaryBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        primaryBtn.addEventListener('click', () => {
            const text = modal.querySelector('.mbs-modal-textarea').value;
            copyToClipboard(text);
            close();
            showToast(`已复制 ${magnets.length} 个磁力链`, 'success');
        });
    }

    function copyToClipboard(text) {
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text);
                return true;
            }
        } catch (e) {
            console.warn('GM_setClipboard failed, falling back to manual method');
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            document.execCommand('copy');
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
})();