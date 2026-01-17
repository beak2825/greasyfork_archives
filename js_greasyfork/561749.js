// ==UserScript==
// @name              新版百度贴吧增强 - 自动签到/夜间模式
// @namespace         https://greasyfork.org/zh-CN/users/1069880-l-l
// @version           2.1
// @description       新版网页版百度贴吧增强脚本，旧版不可用。
// @author            Li
// @license           MIT
// @match             https://tieba.baidu.com/*
// @run-at            document-start
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_xmlhttpRequest
// @connect           tieba.baidu.com
// @connect           c.tieba.baidu.com
// @require           https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js
// @icon              https://tb3.bdstatic.com/tb/pc/pc-main-core/static/img/home_icon_min.f440eb33.png
// @downloadURL https://update.greasyfork.org/scripts/561749/%E6%96%B0%E7%89%88%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%A2%9E%E5%BC%BA%20-%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/561749/%E6%96%B0%E7%89%88%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%A2%9E%E5%BC%BA%20-%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isFirefox = /Firefox/i.test(navigator.userAgent);

    const CONFIG_KEY = 'tieba_dark_mode_config';
    const SIGN_RECORD_KEY = 'tieba_sign_record';
    const defaultConfig = {
        darkMode: true,
        hideRightNav: false,
        hideMyForums: false,
        hidePlayedGames: false,
        hideVideoPosts: false,
        hideHelpPosts: false,
        hideMenuItems: false,
        blockForums: false,
        blockedForumNames: [],
        autoSign: false,
        autoSignOnLoad: false,
        signOncePerDay: false
    };

    // 读取配置，兼容旧版
    function getConfig() {
        try {
            const saved = GM_getValue(CONFIG_KEY);
            if (saved) {
                const config = JSON.parse(saved);
                return {
                    ...defaultConfig,
                    ...config,
                    blockedForumNames: config.blockedForumNames || []
                };
            }
            return defaultConfig;
        } catch {
            return defaultConfig;
        }
    }

    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, JSON.stringify(config));
    }

    // 检查今天是否已经签到成功
    function hasSignedToday() {
        try {
            const record = GM_getValue(SIGN_RECORD_KEY);
            if (record) {
                const data = JSON.parse(record);
                const today = new Date().toDateString();
                return data.date === today && data.success === true;
            }
        } catch {
        }
        return false;
    }

    // 记录今天的签到状态
    function saveSignRecord(success) {
        const record = {
            date: new Date().toDateString(),
            success: success
        };
        GM_setValue(SIGN_RECORD_KEY, JSON.stringify(record));
    }


/*
 * The script references some code from youxiaohou.com.
 * MIT License.
 */


    let currentConfig = getConfig();

    /**
     * 深色模式滤镜配置
     * Chrome 用 SVG 引用，Firefox 用内联 data URI
     * 反转滤镜用于图片视频，避免二次反色
     */
    const FILTERS = {
        chrome: '-webkit-filter: url(#dark-mode-filter) !important; filter: url(#dark-mode-filter) !important;',
        chromeReverse: '-webkit-filter: url(#dark-mode-reverse-filter) !important; filter: url(#dark-mode-reverse-filter) !important;',
        firefox: `filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="dark-mode-filter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.283 -0.567 -0.567 0 0.925 -0.567 0.283 -0.567 0 0.925 -0.567 -0.567 0.283 0 0.925 0 0 0 1 0"/></filter></svg>#dark-mode-filter') !important;`,
        firefoxReverse: `filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="dark-mode-reverse-filter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.333 -0.667 -0.667 0 1 -0.667 0.333 -0.667 0 1 -0.667 -0.667 0.333 0 1 0 0 0 1 0"/></filter></svg>#dark-mode-reverse-filter') !important;`,
        none: '-webkit-filter: none !important; filter: none !important;'
    };

    // Chrome 需要在 DOM 中插入 SVG 滤镜定义
    function createSVGFilter() {
        if (document.getElementById('dark-mode-svg')) return;

        const svg = '<svg id="dark-mode-svg" style="height: 0; width: 0;">' +
            '<filter id="dark-mode-filter" x="0" y="0" width="99999" height="99999">' +
            '<feColorMatrix type="matrix" values="0.283 -0.567 -0.567 0 0.925 -0.567 0.283 -0.567 0 0.925 -0.567 -0.567 0.283 0 0.925 0 0 0 1 0"></feColorMatrix>' +
            '</filter>' +
            '<filter id="dark-mode-reverse-filter" x="0" y="0" width="99999" height="99999">' +
            '<feColorMatrix type="matrix" values="0.333 -0.667 -0.667 0 1 -0.667 0.333 -0.667 0 1 -0.667 -0.667 0.333 0 1 0 0 0 1 0"></feColorMatrix>' +
            '</filter>' +
            '</svg>';

        const container = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        container.innerHTML = svg;

        const fragment = document.createDocumentFragment();
        while (container.firstChild) {
            fragment.appendChild(container.firstChild);
        }

        document.head.appendChild(fragment);
    }

    // 额外样式修正，主要处理按钮和弹窗的显示问题
    function getExtraStyles() {
        const customRules = `
            /* 按钮文字 */
            .add-post .add-icon,
            .add-post .add-icon *,
            .add-post .ml-4,
            .issue-btn.button-wrapper--primary .center,
            .upload-btn,
            .dialog-btn.button-wrapper--primary .center {
                ${FILTERS.none}
                color: #000000 !important;
                fill: #000000 !important;
            }

            /* 图标 */
            .card-header img[src*="topic-header"],
            .card-header img[src*="forum-header"] {
                ${FILTERS.none}
            }

            /* 弹窗遮罩 */
            div.publisher-warp,
            div.dialog-mask,
            div.el-image-viewer__mask,
            div.message-warp {
                ${FILTERS.none}
                background-color: rgba(255, 255, 255, 0.4) !important;
            }
        `;

        return customRules;
    }

    function createDarkStyles() {
        if (document.getElementById('dark-mode-style')) return;

        const mainFilter = isFirefox ? FILTERS.firefox : FILTERS.chrome;
        const reverseFilter = isFirefox ? FILTERS.firefoxReverse : FILTERS.chromeReverse;

        const css = `
            @media screen {
                html {
                    ${mainFilter}
                    scrollbar-color: #454a4d #202324;
                }

                /* 反转图片和视频 */
                img,
                video,
                iframe,
                canvas,
                :not(object):not(body) > embed,
                object,
                svg image,
                [style*="background:url"],
                [style*="background-image:url"],
                [style*="background: url"],
                [style*="background-image: url"],
                [background],
                twitterwidget,
                .sr-reader,
                .no-dark-mode,
                .sr-backdrop {
                    ${reverseFilter}
                }

                /* 取消子元素滤镜 */
                [style*="background:url"] *,
                [style*="background-image:url"] *,
                [style*="background: url"] *,
                [style*="background-image: url"] *,
                input,
                [background] *,
                img[src^="https://s0.wp.com/latex.php"],
                twitterwidget .NaturalImage-image,
                .art-bottom,
                .art-bottom * {
                    ${FILTERS.none}
                }

                /* 文本对比度 */
                html {
                    text-shadow: 0 0 0 !important;
                }

                /* 全屏模式 */
                .no-filter,
                :-webkit-full-screen,
                :-webkit-full-screen *,
                :-moz-full-screen,
                :-moz-full-screen *,
                :fullscreen,
                :fullscreen * {
                    ${FILTERS.none}
                }

                /* 滚动条样式 */
                ::-webkit-scrollbar {
                    background-color: #202324;
                    color: #aba499;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #454a4d;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: #575e62;
                }
                ::-webkit-scrollbar-thumb:active {
                    background-color: #484e51;
                }
                ::-webkit-scrollbar-corner {
                    background-color: #181a1b;
                }

                /* 页面背景 */
                html {
                    background: #fff !important;
                }

                ${getExtraStyles()}
            }

            @media print {
                .no-print {
                    display: none !important;
                }
            }
        `;

        const style = document.createElement('style');
        style.id = 'dark-mode-style';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function setThemeColor() {
        let meta = document.getElementsByName('theme-color')[0];

        if (meta) {
            meta.setAttribute('content', '#131313');
        } else {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = '#131313';
            document.head.appendChild(meta);
        }
    }

    let iconObserver = null;

    // 左上角图标的深色版本，深色模式下替换
    function replaceHomeIcon() {
        const base64Image = 'data:image/png;base64,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';

        if (!base64Image) return;

        const replaceIcon = () => {
            const homeIcon = document.querySelector('img.home-icon[src*="home_icon"]');
            if (homeIcon && homeIcon.src !== base64Image) {
                homeIcon.src = base64Image;
            }
        };

        replaceIcon();

        if (!iconObserver) {
            iconObserver = new MutationObserver(replaceIcon);
            iconObserver.observe(document.body, { childList: true, subtree: true });
        }
    }

    function stopReplaceHomeIcon() {
        if (iconObserver) {
            iconObserver.disconnect();
            iconObserver = null;
        }
    }

    let hideHomeCardsObserver = null;

    // 主页卡片隐藏配置
    const hideHomeCardsConfig = {
        hideMyForums: { selector: '.list-container-wrapper.card-border', titleText: '我常逛的吧', dataKey: 'myForumsChecked' },
        hidePlayedGames: { selector: '.list-container-wrapper.card-border', titleText: '我玩过的游戏', dataKey: 'playedGamesChecked' },
        hideRightNav: { selector: '.right-nav-bar[data-v-a2fc3112]', titleText: null, dataKey: 'rightNavChecked' }
    };

    function processHomeCards() {
        Object.keys(hideHomeCardsConfig).forEach(configKey => {
            if (!currentConfig[configKey]) return;

            const config = hideHomeCardsConfig[configKey];
            const elements = document.querySelectorAll(config.selector);

            elements.forEach(element => {
                if (element.dataset[config.dataKey]) return;
                element.dataset[config.dataKey] = 'true';

                if (config.titleText) {
                    const titleDiv = element.querySelector('.list-title');
                    if (titleDiv && titleDiv.textContent.trim() === config.titleText) {
                        element.style.display = 'none';
                    }
                } else {
                    element.style.display = 'none';
                }
            });
        });
    }

    function startHomeCardsObserver() {
        if (hideHomeCardsObserver) {
            hideHomeCardsObserver.disconnect();
        }

        hideHomeCardsObserver = new MutationObserver(() => {
            processHomeCards();
        });

        hideHomeCardsObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        processHomeCards();
    }

    function toggleHomeCard(configKey, hide) {
        currentConfig[configKey] = hide;
        saveConfig(currentConfig);

        const config = hideHomeCardsConfig[configKey];
        const elements = document.querySelectorAll(config.selector);

        if (hide) {
            const hasAnyEnabled = Object.keys(hideHomeCardsConfig).some(key => currentConfig[key]);
            if (hasAnyEnabled) {
                startHomeCardsObserver();
            }
        } else {
            elements.forEach(element => {
                if (element.dataset[config.dataKey]) {
                    element.style.display = '';
                    delete element.dataset[config.dataKey];
                }
            });

            const hasAnyEnabled = Object.keys(hideHomeCardsConfig).some(key => currentConfig[key]);
            if (!hasAnyEnabled && hideHomeCardsObserver) {
                hideHomeCardsObserver.disconnect();
                hideHomeCardsObserver = null;
            }
        }
    }

    let hideVideoObserver = null;

    // 隐藏视频帖 .video-wrapper
    function hideVideoPosts() {
        const processVideoPosts = () => {
            const posts = document.querySelectorAll('.virtual-list-item');
            posts.forEach(post => {
                if (post.dataset.videoChecked) return;
                post.dataset.videoChecked = 'true';

                const hasVideo = post.querySelector('.video-wrapper.thread-image');
                if (hasVideo) {
                    post.style.display = 'none';
                }
            });
        };

        if (hideVideoObserver) {
            hideVideoObserver.disconnect();
        }

        hideVideoObserver = new MutationObserver(() => {
            processVideoPosts();
        });

        hideVideoObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        processVideoPosts();
    }

    function showVideoPosts() {
        if (hideVideoObserver) {
            hideVideoObserver.disconnect();
            hideVideoObserver = null;
        }

        const posts = document.querySelectorAll('.virtual-list-item');
        posts.forEach(post => {
            if (post.dataset.videoChecked) {
                post.style.display = '';
                delete post.dataset.videoChecked;
            }
        });
    }

    let hideHelpPostsObserver = null;
    let hideMenuItemsObserver = null;

    // 隐藏求助帖 .title-prefix
    function hideHelpPosts() {
        const processHelpPosts = () => {
            const posts = document.querySelectorAll('.virtual-list-item');
            posts.forEach(post => {
                if (post.dataset.helpChecked) return;
                post.dataset.helpChecked = 'true';

                const titlePrefix = post.querySelector('.title-prefix');
                if (titlePrefix && titlePrefix.textContent.trim() === '求助') {
                    post.style.display = 'none';
                }
            });
        };

        if (hideHelpPostsObserver) {
            hideHelpPostsObserver.disconnect();
        }

        hideHelpPostsObserver = new MutationObserver(() => {
            processHelpPosts();
        });

        hideHelpPostsObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        processHelpPosts();
    }

    function showHelpPosts() {
        if (hideHelpPostsObserver) {
            hideHelpPostsObserver.disconnect();
            hideHelpPostsObserver = null;
        }

        const posts = document.querySelectorAll('.virtual-list-item');
        posts.forEach(post => {
            if (post.dataset.helpChecked) {
                post.style.display = '';
                delete post.dataset.helpChecked;
            }
        });
    }

    function toggleHelpPosts(hide) {
        currentConfig.hideHelpPosts = hide;
        saveConfig(currentConfig);

        if (hide) {
            hideHelpPosts();
        } else {
            showHelpPosts();
        }
    }

    function hideMenuItems() {
        const processMenuItems = () => {
            document.querySelectorAll('.menu-item').forEach(item => {
                if (item.dataset.menuItemChecked) return;

                const useElement = item.querySelector('svg use');
                if (useElement) {
                    const href = useElement.getAttribute('xlink:href');
                    if (href === '#down_client' || href === '#game_center') {
                        item.dataset.menuItemChecked = 'true';
                        const parent = item.parentElement;
                        if (parent.tagName === 'SPAN' && parent.classList.contains('popover__reference-wrapper')) {
                            parent.parentElement.style.display = 'none';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                }
            });
        };

        if (!hideMenuItemsObserver) {
            hideMenuItemsObserver = new MutationObserver(() => {
                processMenuItems();
            });

            hideMenuItemsObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        processMenuItems();
    }

    function showMenuItems() {
        if (hideMenuItemsObserver) {
            hideMenuItemsObserver.disconnect();
            hideMenuItemsObserver = null;
        }

        document.querySelectorAll('.menu-item').forEach(item => {
            if (item.dataset.menuItemChecked) {
                const parent = item.parentElement;
                if (parent.tagName === 'SPAN' && parent.classList.contains('popover__reference-wrapper')) {
                    parent.parentElement.style.display = '';
                } else {
                    item.style.display = '';
                }
                delete item.dataset.menuItemChecked;
            }
        });
    }

    function toggleMenuItems(hide) {
        currentConfig.hideMenuItems = hide;
        saveConfig(currentConfig);

        if (hide) {
            hideMenuItems();
        } else {
            showMenuItems();
        }
    }

    function toggleVideoPosts(hide) {
        currentConfig.hideVideoPosts = hide;
        saveConfig(currentConfig);

        if (hide) {
            hideVideoPosts();
        } else {
            showVideoPosts();
        }
    }

    let blockForumObserver = null;

    /**
     * 吧名屏蔽指定吧帖
     * 从 data-track 属性中解析吧名，匹配黑名单
     */
    function blockForumPosts() {
        if (!currentConfig.blockForums || !currentConfig.blockedForumNames || !currentConfig.blockedForumNames.length) {
            if (blockForumObserver) {
                blockForumObserver.disconnect();
                blockForumObserver = null;
            }
            return;
        }

        const processPosts = () => {
            const posts = document.querySelectorAll('.virtual-list-item[data-track]');
            posts.forEach(post => {
                if (post.dataset.forumChecked) return;
                post.dataset.forumChecked = 'true';

                try {
                    const trackData = post.getAttribute('data-track');
                    if (trackData) {
                        const data = JSON.parse(trackData);
                        const fname = data?.ext?.commonParams?.fname;
                        if (fname && currentConfig.blockedForumNames.includes(fname)) {
                            post.style.display = 'none';
                        }
                    }
                } catch (e) {}
            });
        };

        if (blockForumObserver) {
            blockForumObserver.disconnect();
        }

        blockForumObserver = new MutationObserver(() => {
            processPosts();
        });

        blockForumObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        processPosts();
    }

    function toggleBlockForums(enabled) {
        currentConfig.blockForums = enabled;
        saveConfig(currentConfig);

        if (enabled) {
            blockForumPosts();
        } else {
            if (blockForumObserver) {
                blockForumObserver.disconnect();
                blockForumObserver = null;
            }
            const posts = document.querySelectorAll('.virtual-list-item[data-track]');
            posts.forEach(post => {
                post.style.display = '';
                delete post.dataset.forumChecked;
            });
        }
    }

    function addBlockedForum(forumName) {
        if (!forumName || forumName.trim() === '') return false;

        if (!currentConfig.blockedForumNames) {
            currentConfig.blockedForumNames = [];
        }

        const trimmedName = forumName.trim();
        if (!currentConfig.blockedForumNames.includes(trimmedName)) {
            currentConfig.blockedForumNames.push(trimmedName);
            saveConfig(currentConfig);
            if (currentConfig.blockForums) {
                blockForumPosts();
            }
            return true;
        }
        return false;
    }

    function removeBlockedForum(forumName) {
        if (!currentConfig.blockedForumNames) {
            currentConfig.blockedForumNames = [];
            return false;
        }

        const index = currentConfig.blockedForumNames.indexOf(forumName);
        if (index > -1) {
            currentConfig.blockedForumNames.splice(index, 1);
            saveConfig(currentConfig);
            if (currentConfig.blockForums) {
                const posts = document.querySelectorAll('.virtual-list-item[data-track]');
                posts.forEach(post => {
                    post.style.display = '';
                    delete post.dataset.forumChecked;
                });
                blockForumPosts();
            }
            return true;
        }
        return false;
    }

    function enableDarkMode() {
        if (!currentConfig.darkMode) return;

        if (!isFirefox) {
            createSVGFilter();
        }
        createDarkStyles();
        setThemeColor();
        replaceHomeIcon();
    }

    function applyHomeCardSettings() {
        const hasAnyEnabled = Object.keys(hideHomeCardsConfig).some(key => currentConfig[key]);
        if (hasAnyEnabled) {
            startHomeCardsObserver();
        }
    }

    function applyVideoPostsSetting() {
        if (currentConfig.hideVideoPosts) {
            hideVideoPosts();
        }
    }

    function applyBlockForumsSetting() {
        if (currentConfig.blockForums) {
            blockForumPosts();
        }
    }

    function applyHelpPostsSetting() {
        if (currentConfig.hideHelpPosts) {
            hideHelpPosts();
        }
    }

    function applyMenuItemsSetting() {
        if (currentConfig.hideMenuItems) {
            hideMenuItems();
        }
    }

    function disableDarkMode() {
        const style = document.getElementById('dark-mode-style');
        if (style) style.remove();

        const svg = document.getElementById('dark-mode-svg');
        if (svg) svg.remove();

        const meta = document.getElementsByName('theme-color')[0];
        if (meta) meta.remove();

        stopReplaceHomeIcon();
    }

    function toggleDarkMode(enabled) {
        currentConfig.darkMode = enabled;
        saveConfig(currentConfig);

        if (enabled) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    function createSettingsDialog() {
        const existing = document.getElementById('tieba-settings-dialog');
        if (existing) existing.remove();

        const dialog = document.createElement('div');
        dialog.id = 'tieba-settings-dialog';
        dialog.className = 'no-dark-mode';

        const blockedForumNames = currentConfig.blockedForumNames || [];
        const blockedListHTML = blockedForumNames.map(name => `
            <div class="blocked-item">
                <span>${name}</span>
                <button class="remove-btn" data-name="${name}">删除</button>
            </div>
        `).join('');

        dialog.innerHTML = `
            <style>
                #tieba-settings-dialog{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:999999}
                .settings-box{background:#2b2b2b;color:#e0e0e0;padding:20px;border-radius:8px;width:350px;max-height:80vh;overflow-y:auto}
                .settings-box h3{margin:0 0 15px;font-size:16px;color:#fff}
                .settings-box h4{margin:10px 0;font-size:14px;color:#fff}
                .settings-box label{display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:10px}
                .forum-block-section{margin-top:15px;padding-top:15px;border-top:1px solid #444}
                .add-forum-input{display:flex;gap:8px;margin-bottom:10px}
                .add-forum-input input{flex:1;padding:6px 10px;background:#1a1a1a;border:1px solid #444;border-radius:4px;color:#e0e0e0}
                .add-forum-input button,.remove-btn{padding:6px 12px;border:none;border-radius:4px;color:#fff;cursor:pointer;font-size:12px}
                .add-forum-input button{background:#4070FF}
                .blocked-list{max-height:200px;overflow-y:auto;background:#1a1a1a;border-radius:4px;padding:8px}
                .blocked-item{display:flex;justify-content:space-between;align-items:center;padding:6px 8px;margin-bottom:4px;background:#2b2b2b;border-radius:4px}
                .remove-btn{background:#f44}
                .empty-message{text-align:center;color:#888;padding:20px}
                .feedback-link{display:block;text-align:center;margin-top:15px;padding-top:15px;border-top:1px solid #444}
                .feedback-link a{color:#4070FF;text-decoration:none}
            </style>
            <div class="settings-box">
                <h3>设置</h3>
                <label title="启用后会将页面转换为夜间模式（深色主题）">
                    <input type="checkbox" id="dark-mode-toggle" ${currentConfig.darkMode ? 'checked' : ''}>
                    <span>深色模式</span>
                </label>
                <label title="启用后会隐藏主页右侧的热点推荐栏">
                    <input type="checkbox" id="hide-right-nav-toggle" ${currentConfig.hideRightNav ? 'checked' : ''}>
                    <span>隐藏 | 主页右侧热点</span>
                </label>
                <label title="启用后会隐藏主页左侧“我常逛的吧”模块（与下面选项存在兼容问题，多开关重试几次即可）">
                    <input type="checkbox" id="hide-my-forums-toggle" ${currentConfig.hideMyForums ? 'checked' : ''}>
                    <span>隐藏 | 主页常逛的吧</span>
                </label>
                <label title="启用后会隐藏主页左侧“我玩过的游戏”模块（与上面选项存在兼容问题，多开关重试几次即可）">
                    <input type="checkbox" id="hide-played-games-toggle" ${currentConfig.hidePlayedGames ? 'checked' : ''}>
                    <span>隐藏 | 主页玩过游戏</span>
                </label>
                <label title="启用后会隐藏信息流中的视频帖子">
                    <input type="checkbox" id="hide-video-posts-toggle" ${currentConfig.hideVideoPosts ? 'checked' : ''}>
                    <span>隐藏 | 信息流视频贴</span>
                </label>
                <label title="启用后会隐藏信息流中带求助标签的帖子">
                    <input type="checkbox" id="hide-help-posts-toggle" ${currentConfig.hideHelpPosts ? 'checked' : ''}>
                    <span>隐藏 | 信息流求助帖</span>
                </label>
                <label title="启用后会隐藏顶部菜单右侧的下载客户端和游戏中心入口">
                    <input type="checkbox" id="hide-menu-items-toggle" ${currentConfig.hideMenuItems ? 'checked' : ''}>
                    <span>隐藏 | 菜单无用组件</span>
                </label>
                <label title="启用后会在菜单栏右上角添加一键签到按钮">
                    <input type="checkbox" id="auto-sign-toggle" ${currentConfig.autoSign ? 'checked' : ''}>
                    <span>增强 | 一键签到按钮</span>
                </label>
                <label title="启用后每次进入页面都会自动执行一次签到任务">
                    <input type="checkbox" id="auto-sign-on-load-toggle" ${currentConfig.autoSignOnLoad ? 'checked' : ''}>
                    <span>增强 | 启用自动签到</span>
                </label>
                <label title="启用后，如果签到全部成功，今天不会再自动执行签到">
                    <input type="checkbox" id="sign-once-per-day-toggle" ${currentConfig.signOncePerDay ? 'checked' : ''}>
                    <span>增强 | 每日只签一次</span>
                </label>

                <div class="forum-block-section">
                    <label title="启用后可以根据吧名屏蔽信息流中的帖子">
                        <input type="checkbox" id="block-forums-toggle" ${currentConfig.blockForums ? 'checked' : ''}>
                        <span>吧名匹配屏蔽</span>
                    </label>
                    <div id="forum-block-controls" style="display:${currentConfig.blockForums ? 'block' : 'none'}">
                        <h4>添加屏蔽的贴吧</h4>
                        <div class="add-forum-input">
                            <input type="text" id="forum-name-input" placeholder="输入吧名，如：贴吧游戏">
                            <button id="add-forum-btn">添加</button>
                        </div>
                        <h4>已屏蔽 (${blockedForumNames.length})</h4>
                        <div class="blocked-list" id="blocked-list">${blockedListHTML || '<div class="empty-message">暂无屏蔽的贴吧</div>'}</div>
                    </div>
                </div>

                <div class="feedback-link">
                    <a href="https://greasyfork.org/zh-CN/scripts/561749/feedback" target="_blank">脚本问题反馈</a>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        const darkModeToggle = dialog.querySelector('#dark-mode-toggle');
        const hideRightNavToggle = dialog.querySelector('#hide-right-nav-toggle');
        const hideMyForumsToggle = dialog.querySelector('#hide-my-forums-toggle');
        const hidePlayedGamesToggle = dialog.querySelector('#hide-played-games-toggle');
        const hideVideoPostsToggle = dialog.querySelector('#hide-video-posts-toggle');
        const hideHelpPostsToggle = dialog.querySelector('#hide-help-posts-toggle');
        const hideMenuItemsToggle = dialog.querySelector('#hide-menu-items-toggle');
        const autoSignToggle = dialog.querySelector('#auto-sign-toggle');
        const autoSignOnLoadToggle = dialog.querySelector('#auto-sign-on-load-toggle');
        const signOncePerDayToggle = dialog.querySelector('#sign-once-per-day-toggle');
        const blockForumsToggle = dialog.querySelector('#block-forums-toggle');
        const forumBlockControls = dialog.querySelector('#forum-block-controls');
        const forumNameInput = dialog.querySelector('#forum-name-input');
        const addForumBtn = dialog.querySelector('#add-forum-btn');
        const blockedList = dialog.querySelector('#blocked-list');

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.remove();
        });

        darkModeToggle.addEventListener('change', (e) => {
            toggleDarkMode(e.target.checked);
        });

        hideRightNavToggle.addEventListener('change', (e) => {
            toggleHomeCard('hideRightNav', e.target.checked);
        });

        hideMyForumsToggle.addEventListener('change', (e) => {
            toggleHomeCard('hideMyForums', e.target.checked);
        });

        hidePlayedGamesToggle.addEventListener('change', (e) => {
            toggleHomeCard('hidePlayedGames', e.target.checked);
        });

        hideVideoPostsToggle.addEventListener('change', (e) => {
            toggleVideoPosts(e.target.checked);
        });

        hideHelpPostsToggle.addEventListener('change', (e) => {
            toggleHelpPosts(e.target.checked);
        });

        hideMenuItemsToggle.addEventListener('change', (e) => {
            toggleMenuItems(e.target.checked);
        });

        autoSignToggle.addEventListener('change', (e) => {
            toggleAutoSign(e.target.checked);
        });

        autoSignOnLoadToggle.addEventListener('change', (e) => {
            currentConfig.autoSignOnLoad = e.target.checked;
            saveConfig(currentConfig);
        });

        signOncePerDayToggle.addEventListener('change', (e) => {
            currentConfig.signOncePerDay = e.target.checked;
            saveConfig(currentConfig);
        });

        blockForumsToggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            forumBlockControls.style.display = enabled ? 'block' : 'none';
            toggleBlockForums(enabled);
        });

        const addForum = () => {
            const forumName = forumNameInput.value.trim();
            if (forumName) {
                if (addBlockedForum(forumName)) {
                    forumNameInput.value = '';
                    createSettingsDialog();
                } else {
                    alert('该贴吧已在屏蔽列表中');
                }
            }
        };

        addForumBtn.addEventListener('click', addForum);
        forumNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addForum();
        });

        blockedList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const forumName = e.target.getAttribute('data-name');
                if (removeBlockedForum(forumName)) {
                    createSettingsDialog();
                }
            }
        });
    }

    /**
     * 签到状态管理
     * 记录成功、失败、已签到和重试成功的贴吧列表
     */
    const signState = {
        isRunning: false,
        successList: [],
        failList: [],
        signedList: [],
        retryList: [],
        totalCount: 0,
        currentIndex: 0
    };

    function showNotification(message, type = 'info', options = {}) {
        const existing = document.getElementById('tieba-sign-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'tieba-sign-notification';
        notification.className = 'no-dark-mode sign-notification';

        const showClose = options.showClose || false;
        const showButton = options.showButton || false;
        const buttonText = options.buttonText || '';
        const onButtonClick = options.onButtonClick || null;

        notification.innerHTML = `
            <style>
                .sign-notification{position:fixed;top:60px;right:20px;background:#2b2b2b;color:#e0e0e0;border-radius:8px;padding:15px 20px;box-shadow:0 4px 12px rgba(0,0,0,.3);z-index:999998;min-width:280px}
                .sign-notification-content{display:flex;flex-direction:column;gap:10px}
                .sign-notification-header{display:flex;justify-content:space-between;align-items:flex-start}
                .sign-notification-message{font-size:14px;line-height:1.5;flex:1}
                .sign-notification-close{background:none;border:none;color:#888;cursor:pointer;padding:0;font-size:18px;line-height:1;margin-left:10px}
                .sign-notification-close:hover{color:#e0e0e0}
                .sign-notification-button{background:#4070FF;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:13px;width:100%}
                .sign-notification-button:hover{background:#5080FF}
            </style>
            <div class="sign-notification-content">
                <div class="sign-notification-header">
                    <div class="sign-notification-message">${message}</div>
                    ${showClose ? '<button class="sign-notification-close">×</button>' : ''}
                </div>
                ${showButton ? `<button class="sign-notification-button">${buttonText}</button>` : ''}
            </div>
        `;

        document.body.appendChild(notification);

        if (showClose) {
            const closeBtn = notification.querySelector('.sign-notification-close');
            closeBtn.addEventListener('click', () => notification.remove());
        }

        if (showButton && onButtonClick) {
            const btn = notification.querySelector('.sign-notification-button');
            btn.addEventListener('click', () => {
                onButtonClick();
                notification.remove();
            });
        }

        if (type === 'success' && !showButton) {
            setTimeout(() => {
                if (document.getElementById('tieba-sign-notification')) {
                    notification.remove();
                }
            }, 10000);
        }
    }

    function updateNotification(message) {
        const notification = document.getElementById('tieba-sign-notification');
        if (notification) {
            const messageEl = notification.querySelector('.sign-notification-message');
            if (messageEl) messageEl.textContent = message;
        }
    }

    function showSignList() {
        const existing = document.getElementById('tieba-sign-list-dialog');
        if (existing) existing.remove();

        const dialog = document.createElement('div');
        dialog.id = 'tieba-sign-list-dialog';
        dialog.className = 'no-dark-mode';

        const renderList = (list, title) => {
            if (!list.length) return '';
            return `
                <div class="sign-section">
                    <h4>${title} (${list.length})</h4>
                    ${list.map(item => `
                        <div class="sign-item">
                            <a href="https://tieba.baidu.com/f?kw=${encodeURIComponent(item.name)}" target="_blank">${item.name}</a>
                            ${item.rank ? `<span>${item.rank}名</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        };

        dialog.innerHTML = `
            <style>
                #tieba-sign-list-dialog{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:999999}
                .sign-list-box{background:#2b2b2b;color:#e0e0e0;padding:20px;border-radius:8px;width:400px;max-height:80vh;overflow-y:auto}
                .sign-list-box h3{margin:0 0 15px;font-size:16px;color:#fff}
                .sign-section{margin-bottom:15px}
                .sign-section h4{margin:0 0 10px;font-size:14px;color:#fff}
                .sign-item{display:flex;justify-content:space-between;padding:8px 10px;background:#1a1a1a;border-radius:4px;margin-bottom:4px}
                .sign-item a{color:#e0e0e0;text-decoration:none;flex:1}
                .sign-item a:hover{color:#4070FF}
                .sign-item span{color:#888;font-size:12px}
            </style>
            <div class="sign-list-box">
                <h3>签到结果</h3>
                ${renderList(signState.successList, '签到成功')}
                ${renderList(signState.signedList, '已签到')}
                ${renderList(signState.failList, '签到失败')}
            </div>
        `;

        document.body.appendChild(dialog);
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.remove();
        });
    }

    // 获取 tbs
    async function fetchTbs() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://tieba.baidu.com/dc/common/tbs',
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.is_login === 1) {
                            resolve(data.tbs);
                        } else {
                            reject('未登录');
                        }
                    } catch (e) {
                        reject('获取tbs失败');
                    }
                }
            });
        });
    }

    // 获取吧列表
    async function fetchForums() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://tieba.baidu.com/mo/q/newmoindex',
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.no === 0) {
                            const forums = { signed: [], unsigned: [] };
                            data.data.like_forum.forEach(forum => {
                                if (forum.is_sign === 1) {
                                    forums.signed.push(forum.forum_name);
                                } else {
                                    forums.unsigned.push(forum.forum_name);
                                }
                            });
                            resolve(forums);
                        } else {
                            reject('获取关注贴吧失败');
                        }
                    } catch (e) {
                        reject('解析数据失败');
                    }
                }
            });
        });
    }

    /**
     * 签到
     * 160002表示已签到
     */
    async function signForum(forumName, tbs) {
        return new Promise((resolve) => {
            const sign = md5(`kw=${forumName}tbs=${tbs}tiebaclient!!!`);
            const formData = `kw=${encodeURIComponent(forumName)}&tbs=${tbs}&sign=${sign}`;

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://c.tieba.baidu.com/c/c/forum/sign',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: formData,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error_code === '0') {
                            resolve({ success: true, rank: data.user_info?.user_sign_rank });
                        } else if (data.error_code === '160002') {      //已签到过的吧
                            resolve({ success: true, signed: true });
                        } else {
                            resolve({ success: false });
                        }
                    } catch (e) {
                        resolve({ success: false });
                    }
                }
            });
        });
    }

    /**
     * 批量签到流程
     * 先签未签到的吧，失败的会自动重试一次
     * 这延迟目前我是没问题的，关注的吧太多可能得延长
     */
    async function startSign() {
        if (signState.isRunning) {
            showNotification('请勿重复点击', 'info');
            return;
        }

        signState.isRunning = true;
        signState.successList = [];
        signState.failList = [];
        signState.signedList = [];
        signState.retryList = [];

        try {
            showNotification('正在获取贴吧列表...', 'progress');
            const tbs = await fetchTbs();
            const forums = await fetchForums();

            signState.totalCount = forums.signed.length + forums.unsigned.length;
            signState.currentIndex = 0;

            forums.signed.forEach(name => {
                signState.signedList.push({ name });
            });

            updateNotification(`开始签到 (0/${forums.unsigned.length})`);

            for (const forumName of forums.unsigned) {
                signState.currentIndex++;
                updateNotification(`正在签到: ${forumName} (${signState.currentIndex}/${forums.unsigned.length})`);

                const result = await signForum(forumName, tbs);
                if (result.success) {
                    if (result.signed) {
                        signState.signedList.push({ name: forumName });
                    } else {
                        signState.successList.push({ name: forumName, rank: result.rank });
                    }
                } else {
                    signState.failList.push({ name: forumName });
                }

                const delay = Math.floor(Math.random() * 700) + 800;
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            if (signState.failList.length > 0) {
                updateNotification(`重试失败的吧 (0/${signState.failList.length})`);
                const retryList = [...signState.failList];
                signState.failList = [];

                for (let i = 0; i < retryList.length; i++) {
                    const forum = retryList[i];
                    updateNotification(`重试: ${forum.name} (${i + 1}/${retryList.length})`);

                    const result = await signForum(forum.name, tbs);
                    if (result.success) {
                        signState.successList.push({ name: forum.name, rank: result.rank });
                        signState.retryList.push({ name: forum.name });
                    } else {
                        signState.failList.push(forum);
                    }

                    const delay = Math.floor(Math.random() * 700) + 800;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }

            const notification = document.getElementById('tieba-sign-notification');
            if (notification) notification.remove();

            const retryMsg = signState.retryList.length > 0 ? `，重试成功${signState.retryList.length}个` : '';
            const message = `签到完成！成功${signState.successList.length}个，失败${signState.failList.length}个，已签${signState.signedList.length}个${retryMsg}`;

            // 如果启用了每日只签一次，且签到全部成功，记录今天已签到
            if (currentConfig.signOncePerDay && signState.failList.length === 0) {
                saveSignRecord(true);
            }

            if (signState.failList.length > 0) {
                showNotification(message, 'error', {
                    showClose: true,
                    showButton: true,
                    buttonText: '签到列表',
                    onButtonClick: showSignList
                });
            } else {
                showNotification(message, 'success', {
                    showClose: true
                });
            }

        } catch (error) {
            showNotification(`签到失败: ${error}`, 'error', { showClose: true });
        } finally {
            signState.isRunning = false;
        }
    }

    /**
     * 添加签到按钮到菜单栏
     * 如果菜单还没加载完成，每500ms重试一次
     */
    function createSignButton() {
        if (!currentConfig.autoSign) return;

        const addButton = () => {
            if (document.querySelector('.tieba-sign-btn')) return;

            const menuList = document.querySelector('.right-menu .menu-list');
            if (!menuList) {
                setTimeout(addButton, 500);
                return;
            }

            const signBtn = document.createElement('div');
            signBtn.className = 'tieba-sign-btn menu-item';
            signBtn.style.marginLeft = '10px';
            signBtn.innerHTML = `
                <svg class="menu-icon" viewBox="0 0 24 20" style="width: 28px; height: 28px;">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
                </svg>
            `;
            signBtn.title = '一键签到';
            signBtn.onclick = () => startSign();

            menuList.appendChild(signBtn);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(addButton, 1000));
        } else {
            setTimeout(addButton, 1000);
        }
    }

    function removeSignButton() {
        const btn = document.querySelector('.tieba-sign-btn');
        if (btn) btn.remove();
    }

    function toggleAutoSign(enabled) {
        currentConfig.autoSign = enabled;
        saveConfig(currentConfig);

        if (enabled) {
            createSignButton();
        } else {
            removeSignButton();
        }
    }

    GM_registerMenuCommand('设置', createSettingsDialog);
    GM_registerMenuCommand('查看签到结果', showSignList);

    let headObserver = null;

    /**
     * 初始化脚本
     * 应用所有已启用的功能，监听 head 变化防止样式丢失
     * 如果启用了自动签到，延迟 2 秒后执行一次（检查每日只签一次的限制）
     */
    function init() {
        if (document.head) {
            enableDarkMode();
            applyHomeCardSettings();
            applyVideoPostsSetting();
            applyHelpPostsSetting();
            applyMenuItemsSetting();
            applyBlockForumsSetting();
        }

        if (currentConfig.autoSign) {
            createSignButton();
        }

        if (currentConfig.autoSignOnLoad) {
            setTimeout(() => {
                if (currentConfig.signOncePerDay && hasSignedToday()) {
                    return;
                }
                startSign();
            }, 2000);
        }

        if (!headObserver) {
            headObserver = new MutationObserver(() => {
                if (currentConfig.darkMode && !document.getElementById('dark-mode-style')) {
                    enableDarkMode();
                }
            });
            headObserver.observe(document.head, { childList: true, subtree: true });
        }
    }

    init();
})();
