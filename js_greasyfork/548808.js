// ==UserScript==
// @name         E-Hentai Uploader & Artist Blocker
// @name:zh-CN   E-Hentai 上传者与画师屏蔽助手
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  One-click to block uploaders and artist tags with separate export functions.
// @description:zh-CN 一键将上传者和画师Tag添加到本地屏蔽名单，并提供独立的导出功能。
// @author       Vesper233
// @license      CC BY-NC-ND 4.0
// @match        https://e-hentai.org/
// @match        https://exhentai.org/
// @match        https://e-hentai.org/?*
// @match        https://exhentai.org/?*
// @match        https://e-hentai.org/watched*
// @match        https://exhentai.org/watched*
// @match        https://e-hentai.org/g/*
// @match        https://exhentai.org/g/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        window.open
// @downloadURL https://update.greasyfork.org/scripts/548808/E-Hentai%20Uploader%20%20Artist%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/548808/E-Hentai%20Uploader%20%20Artist%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 (两个独立的存储键) ---
    const UPLOADER_LIST_KEY = 'eh_blocker_uploader_list_v3'; // 上传者屏蔽名单
    const ARTIST_TAG_LIST_KEY = 'eh_blocker_artist_tag_list_v3'; // 画师Tag屏蔽名单
    const UCONFIG_URL = 'https://e-hentai.org/uconfig.php'; // 上传者设置页
    const MYTAGS_URL = 'https://e-hentai.org/mytags'; // Tag设置页

    // --- 主函数入口 ---
    (async function main() {
        if (document.getElementById('gdn')) {
            await processUploaderOnGalleryPage();
            await processArtistTags();
        } else if (document.querySelector('.itg.gltc')) {
            await processUploaderOnListPage();
        }
    })();


    // --- 页面处理函数 (与之前版本相同) ---

    async function processUploaderOnGalleryPage() {
        const uploaderDiv = document.getElementById('gdn');
        if (!uploaderDiv) return;
        const uploaderLink = uploaderDiv.querySelector('a');
        if (!uploaderLink) return;
        const uploaderName = uploaderLink.textContent.trim();
        if (!uploaderName) return;

        const blocklist = await getList(UPLOADER_LIST_KEY);
        const button = createBlockButton(uploaderName, blocklist, UPLOADER_LIST_KEY, '屏蔽上传者', '上传者');
        uploaderDiv.appendChild(button);
    }

    async function processUploaderOnListPage() {
        const blocklist = await getList(UPLOADER_LIST_KEY);
        const galleryRows = document.querySelectorAll('.itg.gltc tr[class^="gtr"]');

        galleryRows.forEach(row => {
            const uploaderCell = row.querySelector('div.glcu a');
            if (!uploaderCell) return;
            const uploaderName = uploaderCell.textContent.trim();
            if (!uploaderName) return;

            const button = createBlockButton(uploaderName, blocklist, UPLOADER_LIST_KEY, '屏蔽上传者', '上传者');
            button.style.marginLeft = '5px';
            uploaderCell.parentElement.appendChild(button);
        });
    }

    async function processArtistTags() {
        const tagTable = document.querySelector('#taglist table');
        if (!tagTable) return;

        const allRows = tagTable.querySelectorAll('tr');
        let artistTagContainer = null;
        for (const row of allRows) {
            const firstCell = row.querySelector('td:first-child');
            if (firstCell && firstCell.textContent.trim() === 'artist:') {
                artistTagContainer = row.querySelector('td:nth-child(2)');
                break;
            }
        }

        if (!artistTagContainer) return;
        const artistLinks = artistTagContainer.querySelectorAll('a');
        if (artistLinks.length === 0) return;
        const blocklist = await getList(ARTIST_TAG_LIST_KEY);

        artistLinks.forEach(link => {
            let fullTag;
            try {
                fullTag = decodeURIComponent(link.href.split('/tag/')[1].replace(/\+/g, ' '));
            } catch(e) { return; }

            const button = createBlockButton(fullTag, blocklist, ARTIST_TAG_LIST_KEY, '屏蔽画师', '画师Tag');
            button.style.marginLeft = '5px';
            link.after(button);
        });
    }

    // --- 核心功能与辅助函数 (与之前版本相同) ---

    function createBlockButton(name, blocklist, storageKey, tooltip, itemType) {
        const button = document.createElement('a');
        button.style.cssText = 'cursor:pointer; font-weight:bold;';
        button.title = tooltip;

        if (blocklist.includes(name)) {
            button.textContent = `[已屏蔽]`;
            button.style.color = '#757575';
        } else {
            button.textContent = `[屏蔽]`;
            button.style.color = '#D32F2F';
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                const currentList = await getList(storageKey);
                if (currentList.includes(name)) return;
                currentList.push(name);
                await GM_setValue(storageKey, JSON.stringify(currentList));
                button.textContent = `[已添加]`;
                button.style.color = '#4CAF50';
                GM_notification({
                    title: '添加成功',
                    text: `"${name}" 已加入您的本地${itemType}屏蔽名单。`,
                    timeout: 4000
                });
            }, { once: true });
        }
        return button;
    }

    async function getList(key) {
        const storedValue = await GM_getValue(key, '[]');
        try { return JSON.parse(storedValue); } catch (e) { return []; }
    }
    
    // 通用的导出函数
    async function exportListAndJump(listKey, targetUrl, itemType) {
        const list = await getList(listKey);
        if (list.length === 0) {
            GM_notification({ title: '提示', text: `您的${itemType}屏蔽名单是空的。`, timeout: 3000 });
            return;
        }
        const sortedList = [...new Set(list)].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        const listString = sortedList.join('\n');
        try {
            await GM_setClipboard(listString, 'text');
            GM_notification({
                title: '复制成功',
                text: `已将 ${sortedList.length} 个${itemType}复制到剪贴板，即将打开设置页。`,
                timeout: 7000,
            });
            window.open(targetUrl, '_blank');
        } catch (error) {
            GM_notification({
                title: '自动复制失败！',
                text: `请从新弹出的窗口中手动复制您的${itemType}名单。`,
                timeout: 10000
            });
            showManualCopyWindow(listString, itemType);
        }
    }
    
    function showManualCopyWindow(text, itemType) {
        // ... (此处省略和之前版本相同的函数代码)
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background-color:#333; color:#fff; padding:20px; border:2px solid #555; border-radius:8px; z-index:99999; box-shadow:0 0 15px rgba(0,0,0,0.7);';
        container.innerHTML = `<h3 style="margin-top:0; border-bottom:1px solid #555; padding-bottom:10px;">请手动复制${itemType}名单</h3><textarea readonly style="width:400px; height:300px; background-color:#222; color:#ddd; border:1px solid #444;">${text}</textarea><br><button style="margin-top:10px; padding:5px 10px;">关闭</button>`;
        document.body.appendChild(container);
        container.querySelector('textarea').select();
        container.querySelector('button').onclick = () => container.remove();
    }

    // --- Tampermonkey 菜单命令 (已修正) ---

    GM_registerMenuCommand('⬆️ 导出屏蔽上传者名单', () => {
        exportListAndJump(UPLOADER_LIST_KEY, UCONFIG_URL, '上传者');
    });

    GM_registerMenuCommand('🎨 导出屏蔽画师Tag', () => {
        exportListAndJump(ARTIST_TAG_LIST_KEY, MYTAGS_URL, '画师Tag');
    });

    GM_registerMenuCommand('🗑️ 清空本地所有记录', async () => {
        if (confirm('【高危操作】您确定要永久删除本地记录的所有【上传者】和【画师Tag】吗？此操作不可撤销！')) {
            await GM_setValue(UPLOADER_LIST_KEY, JSON.stringify([]));
            await GM_setValue(ARTIST_TAG_LIST_KEY, JSON.stringify([]));
            GM_notification({ title: '操作成功', text: '本地所有屏蔽记录已清空。', timeout: 4000 });
            location.reload();
        }
    });

})();