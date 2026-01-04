// ==UserScript==
// @name         剧皮皮
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在剧皮皮所有域名上 ，为所有剧集自动记录、提示观看进度，并提供一个带导入导出功能的统一观看历史页面。
// @author       MoonIRL
// @match        https://www.jupipi.fun/*
// @match        https://www.jupipi.pro/*
// @match        https://www.jupipi.me/*
// @match        https://www.jupipi.cc/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559801/%E5%89%A7%E7%9A%AE%E7%9A%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/559801/%E5%89%A7%E7%9A%AE%E7%9A%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const PREFIX = 'jupipi_watched_';

    // --- 样式定义 ---
    GM_addStyle(`
        #manus-progress-toast {
            position: fixed; top: 20px; left: 20px; background-color: rgba(0, 0, 0, 0.75);
            color: white; padding: 10px 20px; border-radius: 8px; z-index: 10001;
            font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        .manus-last-watched-tag {
            display: inline-block; margin-left: 15px; padding: 5px 12px; font-size: 15px;
            font-weight: bold; vertical-align: middle; border-radius: 5px;
            background-color: #c0392b; color: #ffffff; border: 1px solid #a93226;
        }
        .manus-no-record-tag {
            background-color: #7f8c8d; color: #ecf0f1; border: 1px solid #616a6b;
            font-weight: normal;
        }
        #manus-history-button {
            position: fixed; bottom: 80px; right: 20px; z-index: 9998;
            background-color: #c0392b; color: white; width: 50px; height: 50px;
            border-radius: 50%; text-align: center; line-height: 50px;
            font-size: 14px; font-weight: bold; cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: transform 0.2s;
        }
        #manus-history-button:hover { transform: scale(1.1); }
        #manus-history-panel {
            position: fixed; top: 0; right: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none; justify-content: center; align-items: center;
        }
        .manus-history-content {
            background-color: #fff; color: #333; width: 90%; max-width: 500px;
            max-height: 80vh; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            display: flex; flex-direction: column;
        }
        .manus-history-header, .manus-history-footer, .manus-history-list li {
            box-sizing: content-box;
        }
        .manus-history-header {
            padding: 15px 20px; font-size: 20px; font-weight: bold;
            border-bottom: 1px solid #eee; position: relative;
        }
        .manus-history-close {
            position: absolute; top: 10px; right: 15px; font-size: 28px;
            cursor: pointer; color: #999; line-height: 1;
        }
        .manus-history-list { list-style: none; padding: 10px 0; margin: 0; overflow-y: auto; }
        .manus-history-list li {
            display: flex; align-items: center; padding: 12px 20px;
            border-bottom: 1px solid #f0f0f0;
        }
        .manus-history-list li:last-child { border-bottom: none; }
        .manus-history-title {
            flex-grow: 1; text-decoration: none; color: #3498db; font-weight: bold;
        }
        .manus-history-episode { margin: 0 15px; color: #e74c3c; }
        .manus-history-delete {
            background: #e74c3c; color: white; border: none; border-radius: 4px;
            padding: 4px 8px; font-size: 12px; cursor: pointer;
        }
        .manus-history-footer {
            padding: 15px; text-align: center; border-top: 1px solid #eee;
            display: flex; justify-content: space-around;
        }
        .manus-footer-btn {
            border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;
            color: white; font-weight: bold;
        }
        #manus-export-history { background-color: #27ae60; }
        #manus-import-history { background-color: #2980b9; }
        #manus-clear-all-history { background-color: #95a5a6; }
    `);

    // --- 工具函数 ---
    function showToast(message, duration = 3000) {
        const existingToast = document.getElementById('manus-progress-toast');
        if (existingToast) existingToast.remove();
        const toast = document.createElement('div');
        toast.id = 'manus-progress-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.remove(); }, 500);
        }, duration);
    }

    function getShowId() {
        const match = window.location.pathname.match(/\/(?:detail|play)\/(\d+)/);
        return match ? match[1] : null;
    }

    function getCleanShowTitle() {
        const breadcrumbLinks = document.querySelectorAll('.myui-player__data .breadcrumb a');
        if (breadcrumbLinks.length > 2) {
            return breadcrumbLinks[breadcrumbLinks.length - 1].textContent.trim();
        }
        const title = document.title;
        const match = title.match(/^(?:《)?([^《》第]+)/);
        if (match && match[1]) {
            return match[1].trim();
        }
        return '未知剧集';
    }


    // --- 核心逻辑 ---
    function runLogic() {
        const currentShowId = getShowId();
        if (!currentShowId) return;
        const storageKey = PREFIX + currentShowId;
        if (window.location.pathname.startsWith('/play/')) {
            const pathParts = window.location.pathname.split('-');
            const episodeNumber = pathParts[pathParts.length - 1].replace('.html', '');
            const showTitle = getCleanShowTitle();
            if (episodeNumber && showTitle !== '未知剧集') {
                const record = {
                    title: showTitle,
                    episode: episodeNumber,
                    url: `/detail/${currentShowId}.html`,
                    lastWatched: Date.now()
                };
                GM_setValue(storageKey, record);
                showToast(`已记录: 《${showTitle}》第 ${episodeNumber} 集`);
            }
        }
        if (window.location.pathname.startsWith('/detail/')) {
            const titleElement = document.querySelector('.dbox .data h4');
            if (titleElement && !titleElement.querySelector('.manus-last-watched-tag')) {
                const record = GM_getValue(storageKey);
                const tagSpan = document.createElement('span');
                tagSpan.className = 'manus-last-watched-tag';
                if (record && record.episode) {
                    tagSpan.textContent = `上次看到第 ${record.episode} 集`;
                } else {
                    tagSpan.textContent = '没有观看记录';
                    tagSpan.classList.add('manus-no-record-tag');
                }
                titleElement.appendChild(tagSpan);
            }
        }
    }


    // --- 历史记录面板 ---
    function createHistoryPanel() {
        const panel = document.createElement('div');
        panel.id = 'manus-history-panel';
        panel.innerHTML = `
            <div class="manus-history-content">
                <div class="manus-history-header">观看历史<span class="manus-history-close">&times;</span></div>
                <ul class="manus-history-list"><li>加载中...</li></ul>
                <div class="manus-history-footer">
                    <button id="manus-export-history" class="manus-footer-btn">导出记录</button>
                    <button id="manus-import-history" class="manus-footer-btn">导入记录</button>
                    <button id="manus-clear-all-history" class="manus-footer-btn">清空所有</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        document.getElementById('manus-history-button').addEventListener('click', showHistoryPanel);
        panel.querySelector('.manus-history-close').addEventListener('click', () => panel.style.display = 'none');
        panel.addEventListener('click', (e) => { if (e.target.id === 'manus-history-panel') panel.style.display = 'none'; });
        panel.querySelector('#manus-clear-all-history').addEventListener('click', clearAllHistory);
        panel.querySelector('#manus-export-history').addEventListener('click', exportHistory);
        panel.querySelector('#manus-import-history').addEventListener('click', importHistory);
    }

    function showHistoryPanel() {
        const list = document.querySelector('#manus-history-panel .manus-history-list');
        list.innerHTML = '';
        const allKeys = GM_listValues().filter(key => key.startsWith(PREFIX));
        if (allKeys.length === 0) {
            list.innerHTML = '<li>还没有任何观看记录。</li>';
            document.getElementById('manus-history-panel').style.display = 'flex';
            return;
        }
        const records = allKeys.map(key => ({ key, ...GM_getValue(key) }));
        records.sort((a, b) => b.lastWatched - a.lastWatched);
        records.forEach(record => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${record.url}" class="manus-history-title">${record.title}</a>
                <span class="manus-history-episode">第 ${record.episode} 集</span>
                <button class="manus-history-delete" data-key="${record.key}">删除</button>
            `;
            list.appendChild(li);
        });
        list.querySelectorAll('.manus-history-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const keyToDelete = e.target.getAttribute('data-key');
                const panel = document.getElementById('manus-history-panel');
                panel.style.display = 'none';

                Swal.fire({
                    title: '确认删除?', text: `确定要删除这条记录吗？`, icon: 'warning',
                    showCancelButton: true, confirmButtonColor: '#d33', cancelButtonText: '取消',
                    confirmButtonText: '是的，删除'
                }).then((result) => {
                    if (result.isConfirmed) {
                        GM_deleteValue(keyToDelete);
                        Swal.fire({
                            title: '已删除!',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            showHistoryPanel();
                        });
                    } else {
                        panel.style.display = 'flex';
                    }
                });
            });
        });
        document.getElementById('manus-history-panel').style.display = 'flex';
    }

    function clearAllHistory() {
        const panel = document.getElementById('manus-history-panel');
        panel.style.display = 'none';

        Swal.fire({
            title: '确定要清空所有观看记录吗?', text: "这个操作无法撤销！", icon: 'error',
            showCancelButton: true, confirmButtonColor: '#d33', cancelButtonText: '我再想想',
            confirmButtonText: '确认清空'
        }).then((result) => {
            if (result.isConfirmed) {
                GM_listValues().filter(key => key.startsWith(PREFIX)).forEach(key => GM_deleteValue(key));
                Swal.fire({
                    title: '操作成功!',
                    text: '所有观看记录已被清空。',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    showHistoryPanel();
                });
            } else {
                panel.style.display = 'flex';
            }
        });
    }

    function exportHistory() {
        const panel = document.getElementById('manus-history-panel');
        panel.style.display = 'none';

        const records = GM_listValues().filter(key => key.startsWith(PREFIX)).map(key => ({ key, data: GM_getValue(key) }));
        if (records.length === 0) {
            Swal.fire('无记录', '没有可导出的观看记录。', 'info').then(() => panel.style.display = 'flex');
            return;
        }
        const jsonString = JSON.stringify(records, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'jupipi_history_backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Swal.fire('导出成功!', '记录已保存到 jupipi_history_backup.json 文件。', 'success').then(() => panel.style.display = 'flex');
    }

    function importHistory() {
        const panel = document.getElementById('manus-history-panel');
        panel.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        window.addEventListener('focus', () => {
            setTimeout(() => {
                if (input.files.length === 0) {
                    panel.style.display = 'flex';
                }
            }, 300);
        }, { once: true });

        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) {
                panel.style.display = 'flex';
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    if (!Array.isArray(importedData)) throw new Error('JSON格式不正确');
                    let count = 0;
                    importedData.forEach(item => {
                        if (item.key && item.key.startsWith(PREFIX) && item.data) {
                            GM_setValue(item.key, item.data);
                            count++;
                        }
                    });
                    Swal.fire('导入成功!', `成功导入/更新了 ${count} 条记录。`, 'success').then(() => showHistoryPanel());
                } catch (err) {
                    Swal.fire('导入失败', `文件格式错误或内容不合法: ${err.message}`, 'error').then(() => panel.style.display = 'flex');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }


    // --- 初始化 ---
    function initialize() {
        if (!document.getElementById('manus-history-button')) {
            const historyButton = document.createElement('div');
            historyButton.id = 'manus-history-button';
            historyButton.textContent = '历史';
            document.body.appendChild(historyButton);
            createHistoryPanel();
        }
        setTimeout(runLogic, 500);
    }

    window.addEventListener('load', initialize);
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            initialize();
        }
    }).observe(document, { subtree: true, childList: true });

})();
