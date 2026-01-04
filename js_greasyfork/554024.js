// ==UserScript==
// @name         alt+左键保存图片 (可自定义文件夹)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  使用 Alt+左键 下载图片。已对 Instagram 优化。可通过 Tampermonkey 菜单设置下载子文件夹。
// @author       yiha
// @match        *://*/*
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554024/alt%2B%E5%B7%A6%E9%94%AE%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87%20%28%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%87%E4%BB%B6%E5%A4%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554024/alt%2B%E5%B7%A6%E9%94%AE%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87%20%28%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%87%E4%BB%B6%E5%A4%B9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const STORAGE_KEY = 'customDownloadFolder'; // 用于存储文件夹名称的键
    const DEFAULT_FOLDER = 'TM_Downloads';    // 默认的文件夹名称

    // --- 注册菜单命令 ---
    // 这会在 Tampermonkey 插件菜单中添加一个选项
    GM_registerMenuCommand('设置下载子文件夹', () => {
        const currentFolder = GM_getValue(STORAGE_KEY, DEFAULT_FOLDER);
        const newFolder = prompt('请输入要保存到的下载子文件夹名称:', currentFolder);

        // 如果用户输入了内容并且没有点“取消”
        if (newFolder && newFolder.trim() !== '') {
            GM_setValue(STORAGE_KEY, newFolder.trim());
            GM_notification({
                title: '设置已保存',
                text: `下载文件夹已更新为: ${newFolder.trim()}`,
                timeout: 3000
            });
        } else if (newFolder !== null) {
            // 用户删除了所有内容并点击了确定，我们可以重置为默认值
             GM_setValue(STORAGE_KEY, DEFAULT_FOLDER);
             GM_notification({
                title: '设置已重置',
                text: `下载文件夹已重置为默认值: ${DEFAULT_FOLDER}`,
                timeout: 3000
            });
        }
    });


    // --- 主要下载逻辑 ---
    document.addEventListener('mousedown', function(e) {
        if (!e.altKey || e.button !== 0) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        let imageUrl = '';
        const clickedElement = e.target;

        // 策略一：Instagram 专用逻辑
        if (window.location.hostname.includes('instagram.com')) {
            const article = clickedElement.closest('article');
            if (article) {
                const imgElement = article.querySelector('div._aagv img, li div._aagv img');
                if (imgElement) {
                    const srcset = imgElement.srcset;
                    if (srcset) {
                        const sources = srcset.split(',').map(entry => {
                            const parts = entry.trim().split(/\s+/);
                            return { url: parts[0], width: parseInt(parts[1]?.replace('w', ''), 10) || 0 };
                        });
                        if (sources.length > 0) {
                            imageUrl = sources.reduce((max, current) => (current.width > max.width ? current : max)).url;
                        }
                    }
                    if (!imageUrl) {
                        imageUrl = imgElement.src;
                    }
                }
            }
        }

        // 策略二：通用逻辑
        if (!imageUrl) {
            let target = clickedElement;
            if (target.tagName !== 'IMG') {
                target = target.closest('div, a, figure')?.querySelector('img');
            }
            if (target && target.tagName === 'IMG') {
                imageUrl = target.src || target.dataset.src;
            }
        }

        if (!imageUrl) {
            console.log('未能在此次点击中找到可下载的图片URL。');
            return;
        }

        // --- 下载执行 ---
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        let fileExt = 'jpg';

        try {
            const urlPath = new URL(imageUrl).pathname;
            const extensionMatch = urlPath.match(/\.([^.?]+)/);
            if (extensionMatch && extensionMatch[1]) {
                const potentialExt = extensionMatch[1].toLowerCase();
                const validExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
                if (validExts.includes(potentialExt)) {
                    fileExt = potentialExt;
                }
            }
        } catch (error) { console.error("解析URL时出错: ", error); }

        const fileName = `image_${timestamp}.${fileExt}`;

        // *** 关键改动：从存储中读取文件夹名称 ***
        const downloadFolder = GM_getValue(STORAGE_KEY, DEFAULT_FOLDER);
        const savePath = `${downloadFolder}/${fileName}`;

        console.log(`准备下载到: ${savePath}`);
        GM_download({
            url: imageUrl,
            name: savePath,
            saveAs: false,
            onload: function() {
                console.log(`图片保存成功: ${savePath}`);
            },
            onerror: function(errorDetails) {
                console.error('下载失败:', errorDetails);
                GM_notification({
                    title: '图片保存失败',
                    text: `错误: ${errorDetails.error}`,
                    timeout: 5000
                });
            }
        });

    }, true);
})();