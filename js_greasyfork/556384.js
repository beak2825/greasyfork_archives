// ==UserScript==
// @name         Factorio Mod Batch Downloader
// @name:zh-CN   Factorio Mod 批量下载脚本
// @namespace    https://greasyfork.org/zh-CN/users/1493642-gggggzhu
// @version      1.32
// @description  Batch manage and download Factorio mods without logging in.
// @description:zh-CN 允许无需登录 Factorio 官方 Mod 网站即可批量管理和下载模组。
// @license MIT Copyright ggggz
// @author       chatgpt & gggz
// @match        https://mods.factorio.com/*
// @supportURL https://greasyfork.org/zh-CN/scripts/556384-factorio-mod-downloader/feedback
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556384/Factorio%20Mod%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/556384/Factorio%20Mod%20Batch%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MIRROR_BASE = 'https://mods-storage.re146.dev/';
    const STORAGE_KEY = 'factorioModQueue';

    function loadQueue() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    function saveQueue(queue) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }

    let downloadQueue = loadQueue();

    function getModNameFromURL(url) {
        const pathname = new URL(url, window.location.origin).pathname;
        const match = pathname.match(/\/mod\/([^\/]+)/);
        return match ? match[1] : null;
    }

    async function fetchLatestRelease(modName) {
        try {
            const resp = await fetch(`https://mods.factorio.com/api/mods/${modName}/full`);
            const data = await resp.json();
            if(!data.releases || data.releases.length === 0) return null;
            const sorted = data.releases.sort((a,b)=> a.version < b.version ? 1 : -1);
            return sorted[0].version;
        } catch(e) {
            console.error('API fetch failed', e);
            return null;
        }
    }

    function updateButtonState(btn) {
        const modName = btn.dataset.modName;
        btn.textContent = downloadQueue.some(item => item.modName === modName) ? 'Added' : 'Add';
    }

    function addDownloadButton(container, modName) {
        if(container.querySelector('.latest-download-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'latest-download-btn';
        btn.dataset.modName = modName;
        btn.style.marginTop = '4px';
        btn.style.cursor = 'pointer';
        btn.style.padding = '2px 6px';
        container.appendChild(btn);

        updateButtonState(btn);

        btn.addEventListener('click', async () => {
            const index = downloadQueue.findIndex(item => item.modName === modName);
            if(index >= 0){
                downloadQueue.splice(index, 1);
                saveQueue(downloadQueue);
                updateButtonState(btn);
            } else {
                btn.textContent = 'Added';
                const version = await fetchLatestRelease(modName);
                if(!version) {
                    alert(`Failed to fetch latest version: ${modName}`);
                    updateButtonState(btn);
                    return;
                }
                if(!downloadQueue.some(item=>item.modName===modName)){
                    downloadQueue.push({modName, version});
                    saveQueue(downloadQueue);
                }
            }
        });
    }

    function createGlobalQueueButton() {
        if(document.getElementById('batch-download-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'batch-download-btn';
        btn.textContent = 'Download Queue';
        btn.style.position = 'fixed';
        btn.style.right = '20px';
        btn.style.bottom = '20px';
        btn.style.zIndex = 9999;
        btn.style.padding = '6px 12px';
        btn.style.backgroundColor = '#28a745';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        document.body.appendChild(btn);

        btn.addEventListener('click', () => {
            downloadQueue = loadQueue();
            if(downloadQueue.length === 0) return alert('Download queue is empty');

            const oldModal = document.getElementById('queue-confirm-modal');
            if(oldModal) oldModal.remove();

            const modal = document.createElement('div');
            modal.id = 'queue-confirm-modal';
            modal.style.position = 'fixed';
            modal.style.left = '50%';
            modal.style.top = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = '#fff';
            modal.style.border = '1px solid #ccc';
            modal.style.padding = '20px';
            modal.style.zIndex = 10000;
            modal.style.maxHeight = '70%';
            modal.style.overflowY = 'auto';
            modal.style.width = '80%';
            modal.style.maxWidth = '400px';
            modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

            const title = document.createElement('h3');
            title.textContent = `Confirm Download (${downloadQueue.length} mods)`;
            title.style.marginTop = '0';
            modal.appendChild(title);

            const list = document.createElement('ul');
            list.style.paddingLeft = '20px';
            downloadQueue.forEach((item, idx) => {
                const li = document.createElement('li');
                li.textContent = `${item.modName} ${item.version}`;
                li.style.cursor = 'pointer';
                li.title = 'Click to remove';
                li.addEventListener('click', () => {
                    downloadQueue.splice(idx, 1);
                    saveQueue(downloadQueue);
                    li.remove();
                    document.querySelectorAll('.latest-download-btn').forEach(b => {
                        if(b.dataset.modName === item.modName) updateButtonState(b);
                    });
                });
                list.appendChild(li);
            });
            modal.appendChild(list);

            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Start Download';
            downloadBtn.style.marginTop = '10px';
            downloadBtn.style.padding = '4px 8px';
            downloadBtn.style.cursor = 'pointer';
            modal.appendChild(downloadBtn);

            const clearBtn = document.createElement('button');
            clearBtn.textContent = 'Clear Queue';
            clearBtn.style.marginLeft = '10px';
            clearBtn.style.marginTop = '10px';
            clearBtn.style.padding = '4px 8px';
            clearBtn.style.cursor = 'pointer';
            modal.appendChild(clearBtn);

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.style.marginLeft = '10px';
            closeBtn.style.padding = '4px 8px';
            closeBtn.style.cursor = 'pointer';
            modal.appendChild(closeBtn);

            closeBtn.addEventListener('click', () => modal.remove());

            clearBtn.addEventListener('click', () => {
                if(confirm('Are you sure to clear the entire download queue?')) {
                    downloadQueue = [];
                    saveQueue(downloadQueue);
                    list.innerHTML = '';
                    document.querySelectorAll('.latest-download-btn').forEach(b => updateButtonState(b));
                }
            });

            document.body.appendChild(modal);

            downloadBtn.addEventListener('click', async () => {
                for(let i=0;i<downloadQueue.length;i++){
                    const item = downloadQueue[i];
                    const url = `${MIRROR_BASE}${encodeURIComponent(item.modName)}/${encodeURIComponent(item.version)}.zip`;
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    link.rel = 'noopener';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    await new Promise(r=>setTimeout(r,300));
                }
                modal.remove();
            });
        });
    }
    function processDetailPage() {
        const modName = getModNameFromURL(window.location.pathname);
        if(!modName) return;

        // 尝试找到原始下载按钮
        let container = document.querySelector('.button-green[title*="You need to own Factorio"]')?.parentNode;

        // 如果没找到，就放在模组信息区域（一般 class="panel-inset-lighter"）
        if(!container){
            container = document.querySelector('.panel-inset-lighter') || document.body;
        }

        addDownloadButton(container, modName);
    }


    function processListPage() {
        const modCards = document.querySelectorAll('a[href^="/mod/"]');
        modCards.forEach(link => {
            const container = link.closest('article, .mod-list-item') || link.parentNode;
            const modName = getModNameFromURL(link.getAttribute('href'));
            if(modName) addDownloadButton(container, modName);
        });
    }

    function handlePage() {
        if(location.pathname.startsWith('/mod/')) processDetailPage();
        else if(location.pathname.startsWith('/browse/') || location.pathname.startsWith('/search')) processListPage();
        createGlobalQueueButton();
    }

    const observer = new MutationObserver(handlePage);
    observer.observe(document.body, {childList: true, subtree: true});

    window.addEventListener('storage', e => {
        if(e.key === STORAGE_KEY){
            downloadQueue = loadQueue();
            document.querySelectorAll('.latest-download-btn').forEach(b => updateButtonState(b));
        }
    });

    handlePage();
})();
