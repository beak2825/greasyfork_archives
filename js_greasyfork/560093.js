// ==UserScript==
// @name         对分易/Duifene 批量下载助手 (UI优化版)
// @namespace    https://github.com/HMuSeaB/duifene-download
// @version      2.6
// @description  美化对分易界面，支持面板拖拽、单按钮全选/反选、批量下载受限文件。
// @author       HMuSeaB
// @match        *://*.duifene.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560093/%E5%AF%B9%E5%88%86%E6%98%93Duifene%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%28UI%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560093/%E5%AF%B9%E5%88%86%E6%98%93Duifene%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%28UI%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 样式注入 (优化复选框位置，防止挤压图标)
    const style = document.createElement('style');
    style.innerHTML = `
        /* 给文件行父元素增加相对定位，以便复选框定位 */
        #FilesList div[data-path] {
            position: relative;
            padding-left: 30px !important;
        }
        .dfy-checkbox {
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            cursor: pointer;
            z-index: 10;
        }
        #dfy-manager-panel {
            position: fixed; z-index: 99999;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: none; width: 200px; overflow: hidden;
            user-select: none;
            font-family: sans-serif;
        }
        #dfy-drag-handle {
            background: #009688; color: #fff; padding: 8px 12px;
            cursor: move; font-size: 13px; font-weight: bold;
            display: flex; justify-content: space-between; align-items: center;
        }
        .dfy-body { padding: 12px; }
        .dfy-btn {
            padding: 8px 12px; border-radius: 4px; border: none; cursor: pointer;
            font-size: 13px; margin: 5px 0; width: 100%;
            transition: all 0.2s;
        }
        .dfy-btn:hover { filter: brightness(0.95); }
        .dfy-btn-primary { background: #009688; color: #fff; font-weight: bold; }
        .dfy-btn-white { background: #f5f5f5; border: 1px solid #ddd; color: #333; }
        .dfy-count-tag {
            background: #ff5722; color: #fff; border-radius: 10px;
            padding: 2px 6px; font-size: 11px; margin-left: 5px;
            vertical-align: text-top;
        }
    `;
    document.head.appendChild(style);

    let managerPanel = null;
    let isDragging = false;

    // 2. 核心逻辑：处理文件列表
    function processFileList() {
        const fileList = document.getElementById('FilesList');
        if (!fileList) return;

        const files = fileList.querySelectorAll('div[data-path]');
        files.forEach(fileDiv => {
            if (fileDiv.getAttribute('data-processed') === 'true') return;

            const downloadUrl = fileDiv.getAttribute('data-path');

            if (downloadUrl && downloadUrl.length > 10) {
                // 插入复选框
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'dfy-checkbox';
                checkbox.onclick = (e) => {
                    e.stopPropagation();
                    updateSelectedCount();
                };
                fileDiv.prepend(checkbox);

                // 解锁下载按钮
                const actionDiv = fileDiv.querySelector('.action');
                if (actionDiv) {
                    const banSpan = actionDiv.querySelector('span[onclick*="layer.alert"]');
                    if (banSpan) banSpan.remove();

                    const downloadBtn = document.createElement('a');
                    downloadBtn.innerText = '直接下载';
                    downloadBtn.style.cssText = 'color:#FF5722; font-weight:bold; margin-right:10px; cursor:pointer;';
                    downloadBtn.onclick = (e) => {
                        e.stopPropagation();
                        triggerDownload(downloadUrl, fileDiv.getAttribute('data-name'));
                    };
                    actionDiv.prepend(downloadBtn);
                }

                const tipDiv = fileDiv.querySelector('.fileTip div[style*="color:#F60"]');
                if (tipDiv) {
                    tipDiv.innerText = "√ 已解锁";
                    tipDiv.style.color = "#009688";
                }
            }
            fileDiv.setAttribute('data-processed', 'true');
        });
    }

    // 3. 触发下载
    function triggerDownload(url, name = 'file') {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 4. 创建面板
    function initManagerPanel() {
        if (managerPanel) return;

        managerPanel = document.createElement('div');
        managerPanel.id = 'dfy-manager-panel';

        const savedPos = JSON.parse(localStorage.getItem('dfy_panel_pos') || '{"top":"100px","right":"50px"}');
        Object.assign(managerPanel.style, savedPos);

        managerPanel.innerHTML = `
            <div id="dfy-drag-handle">
                <span>下载管理</span>
                <span id="dfy-close-panel" style="cursor:pointer; font-size:16px;">&times;</span>
            </div>
            <div class="dfy-body">
                <div style="margin-bottom:8px; font-size:12px; color:#666;">
                    已选文件: <span id="dfy-count-info" class="dfy-count-tag">0</span>
                </div>
                <button class="dfy-btn dfy-btn-white" id="dfy-toggle-select">本页全选</button>
                <button class="dfy-btn dfy-btn-primary" id="dfy-download-now">立即批量下载</button>
            </div>
        `;
        document.body.appendChild(managerPanel);

        // 拖拽
        const handle = document.getElementById('dfy-drag-handle');
        handle.onmousedown = function(e) {
            isDragging = true;
            let shiftX = e.clientX - managerPanel.getBoundingClientRect().left;
            let shiftY = e.clientY - managerPanel.getBoundingClientRect().top;

            function moveAt(clientX, clientY) {
                managerPanel.style.left = (clientX - shiftX) + 'px';
                managerPanel.style.top = (clientY - shiftY) + 'px';
                managerPanel.style.bottom = 'auto'; managerPanel.style.right = 'auto';
            }
            function onMouseMove(e) { if (isDragging) moveAt(e.clientX, e.clientY); }

            document.addEventListener('mousemove', onMouseMove);
            document.onmouseup = function() {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                localStorage.setItem('dfy_panel_pos', JSON.stringify({ left: managerPanel.style.left, top: managerPanel.style.top }));
                document.onmouseup = null;
            };
        };
        handle.ondragstart = () => false;

        // 按钮逻辑
        const toggleBtn = document.getElementById('dfy-toggle-select');
        toggleBtn.onclick = () => {
            const all = Array.from(document.querySelectorAll('.dfy-checkbox'));
            const isAllChecked = all.length > 0 && all.every(cb => cb.checked);
            all.forEach(cb => cb.checked = !isAllChecked);
            updateSelectedCount();
        };

        document.getElementById('dfy-download-now').onclick = startBatchDownload;
        document.getElementById('dfy-close-panel').onclick = () => managerPanel.style.display = 'none';
    }

    function updateSelectedCount() {
        const all = document.querySelectorAll('.dfy-checkbox');
        const checked = document.querySelectorAll('.dfy-checkbox:checked');
        document.getElementById('dfy-count-info').innerText = checked.length;
        const toggleBtn = document.getElementById('dfy-toggle-select');
        if (toggleBtn) toggleBtn.innerText = (all.length > 0 && all.length === checked.length) ? "取消选择" : "本页全选";
    }

    function updatePanelVisibility() {
        if (document.querySelectorAll('.dfy-checkbox').length > 0) {
            initManagerPanel();
            if (managerPanel.style.display !== 'none') managerPanel.style.display = 'block';
        }
    }

    function startBatchDownload() {
        const selected = document.querySelectorAll('.dfy-checkbox:checked');
        if (selected.length === 0) return alert("请先勾选文件");
        if (!confirm(`将弹出 ${selected.length} 个下载窗口，确认批量下载？`)) return;

        selected.forEach((cb, index) => {
            const fileDiv = cb.closest('div[data-path]');
            setTimeout(() => {
                triggerDownload(fileDiv.getAttribute('data-path'), fileDiv.getAttribute('data-name'));
            }, index * 500); // 间隔500ms，防止浏览器拦截太快
        });
    }

    setInterval(() => {
        processFileList();
        updatePanelVisibility();
    }, 1000);

})();