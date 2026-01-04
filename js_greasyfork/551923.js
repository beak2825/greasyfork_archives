// ==UserScript==
// @name         EH-历史阅读状态
// @namespace    com.EhPermanentReadStatus
// @version      1.0
// @description  点击图片或标题均可永久保存e-hentai/exhentai的历史阅读状态，提供导入/导出/清空功能。
// @author       Gemini
// @match        *://e-hentai.org/*
// @match        *://exhentai.org/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551923/EH-%E5%8E%86%E5%8F%B2%E9%98%85%E8%AF%BB%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/551923/EH-%E5%8E%86%E5%8F%B2%E9%98%85%E8%AF%BB%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'eh_permanent_read_status';
    const UNREAD_COLOR = '#1a9117';
    const READ_COLOR = '#aaa';
    const READ_CLASS = 'eh-permanent-read';
    const GALLERY_CONTAINER_SELECTOR = '#gdt, .itg';

    GM_addStyle(`
        .itg a .glink::before, #gdt .glink::before {
            content: "●";
            color: ${UNREAD_COLOR};
            padding-right: 4px;
            font-size: 10px;
            vertical-align: 1px;
        }
        .itg a.${READ_CLASS} .glink::before, #gdt a.${READ_CLASS} .glink::before {
            color: ${READ_COLOR};
        }
    `);

    const Storage = {
        load: () => new Set(GM_getValue(STORAGE_KEY, [])),
        save: (readSet) => GM_setValue(STORAGE_KEY, Array.from(readSet)),
        clear: () => GM_setValue(STORAGE_KEY, [])
    };

    const App = {
        getGalleryIdFromHref(href) {
            const match = href.match(/g\/(\d+\/[a-z0-9]+)\/?/);
            return match ? match[1] : null;
        },

        updatePageDisplay() {
            const readSet = Storage.load();
            if (readSet.size === 0) return;

            const titleDivs = document.querySelectorAll(`${GALLERY_CONTAINER_SELECTOR} .glink`);
            titleDivs.forEach(titleDiv => {
                const link = titleDiv.closest('a');
                if (link && link.href) {
                    const galleryId = this.getGalleryIdFromHref(link.href);
                    if (galleryId && readSet.has(galleryId)) {
                        link.classList.add(READ_CLASS);
                    }
                }
            });
        },

        initEventListeners() {
            const container = document.querySelector(GALLERY_CONTAINER_SELECTOR);
            if (!container) return;

            container.addEventListener('mousedown', (event) => {
                const link = event.target.closest('a[href*="/g/"]');
                if (!link) return;

                const clickedGalleryId = this.getGalleryIdFromHref(link.href);
                if (!clickedGalleryId) return;

                const readSet = Storage.load();
                if (!readSet.has(clickedGalleryId)) {
                    readSet.add(clickedGalleryId);
                    Storage.save(readSet);

                    const linksToUpdate = document.querySelectorAll(`${GALLERY_CONTAINER_SELECTOR} a[href*="/g/${clickedGalleryId}"]`);
                    linksToUpdate.forEach(linkToUpdate => linkToUpdate.classList.add(READ_CLASS));
                }
            });
        },

        init() {
            this.updatePageDisplay();
            this.initEventListeners();
        }
    };

    const MenuCommands = {
        exportData() {
            const readSet = Storage.load();
            if (readSet.size === 0) {
                alert('没有已读数据可供导出。');
                return;
            }
            const dataStr = JSON.stringify(Array.from(readSet), null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `eh-read-status-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            alert(`已成功导出 ${readSet.size} 条已读记录。`);
        },

        importData() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = readerEvent => {
                    try {
                        const importedData = JSON.parse(readerEvent.target.result);
                        if (!Array.isArray(importedData)) throw new Error('文件格式不正确，需要是JSON数组。');

                        const currentReadSet = Storage.load();
                        const oldSize = currentReadSet.size;
                        importedData.forEach(item => currentReadSet.add(String(item)));
                        Storage.save(currentReadSet);
                        const newSize = currentReadSet.size;

                        alert(`导入成功！\n原有记录: ${oldSize}条\n新增记录: ${newSize - oldSize}条\n总记录: ${newSize}条\n\n页面即将刷新以应用更改。`);
                        location.reload();
                    } catch (error) {
                        alert(`导入失败：${error.message}`);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        },

        clearData() {
            if (confirm('确定要清空所有已读状态记录吗？\n此操作不可恢复！')) {
                Storage.clear();
                alert('所有已读记录已清空。\n页面即将刷新。');
                location.reload();
            }
        },

        register() {
            GM_registerMenuCommand('📊 导出已读状态', this.exportData);
            GM_registerMenuCommand('📥 导入已读状态', this.importData);
            GM_registerMenuCommand('🗑️ 清空所有已读状态', this.clearData);
        }
    };

    App.init();
    MenuCommands.register();

})();