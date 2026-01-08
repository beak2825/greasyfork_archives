// ==UserScript==
// @name         Bilibili Original Avatar Downloader / Viewer
// @name:zh      Bilibili 原始头像下载器 / 查看器
// @namespace    BilibiliOriginalAvatarViewer
// @version      1.0
// @description Left-click to download JPG, right-click to open the original image in a new tab
// @description:zh  左键下载 JPG，右键新标签打开原图
// @match        https://space.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561862/Bilibili%20Original%20Avatar%20Downloader%20%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/561862/Bilibili%20Original%20Avatar%20Downloader%20%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForAvatar = setInterval(() => {
        const avatar = document.querySelector('.avatar');
        if (!avatar) return;

        clearInterval(waitForAvatar);

        avatar.style.cursor = 'pointer';

        const getCleanImageUrl = () => {
            const img = avatar.querySelector('img');
            if (!img) return null;

            let imgSrc = img.src.replace(/@.*$/, '').replace('.webp', '.jpg');
            if (imgSrc.startsWith('//')) {
                imgSrc = 'https:' + imgSrc;
            }
            return imgSrc;
        };

        // 左键：下载
        avatar.addEventListener('click', async () => {
            const imgSrc = getCleanImageUrl();
            if (!imgSrc) return;

            const match = document.URL.match(/\/(\d+)/);
            const fileName = match ? match[1] : 'avatar';

            try {
                const response = await fetch(imgSrc);
                const blob = await response.blob();

                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${fileName}.jpg`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(a.href);
            } catch (e) {
                // 下载失败不提示
            }
        });

        // 右键：新标签打开
        avatar.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const imgSrc = getCleanImageUrl();
            if (imgSrc) {
                window.open(imgSrc, '_blank');
            }
        });
    }, 500);
})();
