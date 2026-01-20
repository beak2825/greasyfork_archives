// ==UserScript==
// @name         小红书摸鱼——无图显示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  1. 稳定单列列表模式；2. 详情页点击显图；3. 评论区纯净文模式；4. 修复布局和数据显示
// @author       吉米乃
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.xiaohongshu.com/explore
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563336/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%91%B8%E9%B1%BC%E2%80%94%E2%80%94%E6%97%A0%E5%9B%BE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/563336/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%91%B8%E9%B1%BC%E2%80%94%E2%80%94%E6%97%A0%E5%9B%BE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        isListMode: GM_getValue('isListMode', true),
        noImageMode: GM_getValue('noImageMode', true)
    };

    const injectStyles = () => {
        const css = `
            /* --- 1. 界面通用净化 --- */
            .header-container .logo-box, .header-container .logo { display: none !important; }

            /* --- 2. 列表模式核心重构 (强制单列) --- */
            body.xhs-list-mode .feeds-container {
                display: block !important;
                max-width: 800px !important;
                margin: 0 auto !important;
            }

            /* 强制每个卡片独占一行 */
            body.xhs-list-mode .note-item {
                position: static !important;
                width: 100% !important;
                transform: none !important;
                margin-bottom: 15px !important;
                border-bottom: 1px solid #eee;
                padding-bottom: 15px !important;
            }

            /* 卡片内部 Flex 布局：左图右文 */
            body.xhs-list-mode .note-item .inner {
                display: flex !important;
                flex-direction: row !important;
                height: 120px !important; /* 固定高度，保证整齐 */
                background: #fff;
                padding: 10px 15px !important;
            }

            /* 左侧：封面图 (无图模式下隐藏) */
            body.xhs-list-mode .note-item .cover {
                width: 120px !important;
                height: 100% !important;
                flex-shrink: 0;
                border-radius: 4px;
                object-fit: cover;
                background: #f8f8f8;
            }
            body.xhs-no-image.xhs-list-mode .note-item .cover { display: none !important; }

            /* 右侧：内容容器 */
            body.xhs-list-mode .note-item .footer {
                flex: 1;
                padding: 0 0 0 20px !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important; /* 标题在顶，数据在底 */
            }

            /* 标题样式 (取消加粗) */
            body.xhs-list-mode .title {
                font-size: 17px !important;
                font-weight: normal !important;
                color: #333;
                margin: 0 !important;
                line-height: 1.4 !important;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2 !important; /* 允许标题显示2行 */
                overflow: hidden;
            }

            /* 作者与互动数据栏 (点赞数等) */
            body.xhs-list-mode .note-item .footer .author-wrapper {
                display: flex !important;
                align-items: center;
                justify-content: space-between; /* 作者靠左，赞靠右 */
                width: 100%;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* 隐藏列表头像，只留名字 */
            body.xhs-list-mode .note-item .footer .author-wrapper .author-avatar {
                display: none !important;
            }
            body.xhs-list-mode .note-item .footer .author-wrapper .name {
                font-size: 13px !important;
                color: #888 !important;
            }
            /* 确保点赞/评论图标显示 */
            body.xhs-list-mode .note-item .footer .author-wrapper .interact-container {
                 display: flex !important;
                 align-items: center;
            }

            /* --- 3. 详情页评论区净化 --- */
            /* 隐藏头像 */
            .comment-item .avatar, .reply-item .avatar,
            .comment-item .author-wrapper .avatar { display: none !important; }
            /* 隐藏评论图片 */
            .comment-item .comment-picture, .reply-item .comment-picture { display: none !important; }
            /* 调整文字左边距 */
            .comment-item .right, .reply-item .right { margin-left: 0 !important; padding-left: 0 !important; }

            /* --- 4. 辅助功能 (遮罩与面板) --- */
            .xhs-img-mask {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: #fafafa; display: flex; align-items: center; justify-content: center;
                cursor: pointer; z-index: 10; border: 1px dashed #ddd; color: #888; font-size: 12px;
            }
            .xhs-img-hidden { visibility: hidden !important; }

            #xhs-ctrl-panel {
                position: fixed; bottom: 40px; right: -150px; width: 150px;
                z-index: 10000; background: #fff; padding: 10px;
                border-radius: 8px 0 0 8px;
                box-shadow: -2px 4px 12px rgba(0,0,0,0.1); border: 1px solid #eee;
                transition: right 0.3s ease, opacity 0.3s ease; opacity: 0.6;
            }
            #xhs-ctrl-panel:hover { right: 0; opacity: 1; }
            #xhs-ctrl-panel::before {
                content: "⚙️"; position: absolute; left: -35px; top: 50%;
                transform: translateY(-50%); width: 35px; height: 35px;
                background: #fff; border-radius: 8px 0 0 8px;
                display: flex; align-items: center; justify-content: center;
                box-shadow: -2px 0 5px rgba(0,0,0,0.05); cursor: pointer;
            }
            .ctrl-btn { display: block; margin: 6px 0; cursor: pointer; font-size: 13px; color: #444; }
        `;
        GM_addStyle(css);
    };

    const handleImageMasking = () => {
        if (!config.noImageMode) return;
        const containers = document.querySelectorAll('.media-container:not([data-processed]), .image-wrapper:not([data-processed])');
        containers.forEach(container => {
            const img = container.querySelector('img');
            if (img) {
                container.setAttribute('data-processed', 'true');
                container.style.position = 'relative';
                img.classList.add('xhs-img-hidden');
                const mask = document.createElement('div');
                mask.className = 'xhs-img-mask';
                mask.innerText = '🖼️ 点击查看';
                mask.onclick = (e) => {
                    e.stopPropagation();
                    img.classList.remove('xhs-img-hidden');
                    mask.remove();
                };
                container.appendChild(mask);
            }
        });
    };

    const updateUI = () => {
        document.body.classList.toggle('xhs-list-mode', config.isListMode);
        document.body.classList.toggle('xhs-no-image', config.noImageMode);
    };

    const init = () => {
        injectStyles();
        updateUI();

        const observer = new MutationObserver(() => {
            updateUI();
            handleImageMasking();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        const panel = document.createElement('div');
        panel.id = 'xhs-ctrl-panel';
        panel.innerHTML = `
            <label class="ctrl-btn"><input type="checkbox" id="listToggle" ${config.isListMode ? 'checked' : ''}> 论坛列表模式</label>
            <label class="ctrl-btn"><input type="checkbox" id="imgToggle" ${config.noImageMode ? 'checked' : ''}> 点击显图模式</label>
        `;
        document.body.appendChild(panel);

        panel.querySelector('#listToggle').onchange = (e) => {
            config.isListMode = e.target.checked;
            GM_setValue('isListMode', config.isListMode);
            updateUI();
        };
        panel.querySelector('#imgToggle').onchange = (e) => {
            config.noImageMode = e.target.checked;
            GM_setValue('noImageMode', config.noImageMode);
            updateUI();
            if (!config.noImageMode) location.reload();
        };
    };

    init();
})();