// ==UserScript==
// @name              新版百度贴吧增强 - 深色模式/主页屏蔽
// @namespace         https://greasyfork.org/zh-CN/users/1069880-l-l
// @version           2.0
// @description       新版网页版百度贴吧增强脚本，旧版不可用。
// @author            Li
// @license           MIT
// @match             https://tieba.baidu.com/*
// @run-at            document-start
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @icon              https://tb3.bdstatic.com/tb/pc/pc-main-core/static/img/home_icon_min.f440eb33.png
// @downloadURL https://update.greasyfork.org/scripts/561749/%E6%96%B0%E7%89%88%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%A2%9E%E5%BC%BA%20-%20%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%E4%B8%BB%E9%A1%B5%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/561749/%E6%96%B0%E7%89%88%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%A2%9E%E5%BC%BA%20-%20%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%E4%B8%BB%E9%A1%B5%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isFirefox = /Firefox/i.test(navigator.userAgent);

    const CONFIG_KEY = 'tieba_dark_mode_config';
    const defaultConfig = {
        darkMode: true,
        hideRightNav: false,
        hideMyForums: false,
        hideVideoPosts: false,
        hideHelpPosts: false,
        blockForums: false,
        blockedForumNames: []
    };

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


/*
 * The script references some code from youxiaohou.com.
 */


    let currentConfig = getConfig();
    const FILTERS = {
        chrome: '-webkit-filter: url(#dark-mode-filter) !important; filter: url(#dark-mode-filter) !important;',
        chromeReverse: '-webkit-filter: url(#dark-mode-reverse-filter) !important; filter: url(#dark-mode-reverse-filter) !important;',
        firefox: `filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="dark-mode-filter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.283 -0.567 -0.567 0 0.925 -0.567 0.283 -0.567 0 0.925 -0.567 -0.567 0.283 0 0.925 0 0 0 1 0"/></filter></svg>#dark-mode-filter') !important;`,
        firefoxReverse: `filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="dark-mode-reverse-filter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.333 -0.667 -0.667 0 1 -0.667 0.333 -0.667 0 1 -0.667 -0.667 0.333 0 1 0 0 0 1 0"/></filter></svg>#dark-mode-reverse-filter') !important;`,
        none: '-webkit-filter: none !important; filter: none !important;'
    };

    // 创建 SVG 滤镜
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

    function hideRightNavBar() {
        if (!document.getElementById('hide-right-nav-style')) {
            const style = document.createElement('style');
            style.id = 'hide-right-nav-style';
            style.textContent = `
                .right-nav-bar[data-v-a2fc3112] {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function showRightNavBar() {
        const style = document.getElementById('hide-right-nav-style');
        if (style) style.remove();
    }

    let hideVideoObserver = null;
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

        // 创建新的监听器
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

    let hideMyForumsObserver = null;
    function hideMyForums() {
        const processMyForums = () => {
            const containers = document.querySelectorAll('.list-container-wrapper.card-border');
            containers.forEach(container => {
                if (container.dataset.myForumsChecked) return;
                container.dataset.myForumsChecked = 'true';

                const titleDiv = container.querySelector('.list-title');
                if (titleDiv && titleDiv.textContent.trim() === '我常逛的吧') {
                    container.style.display = 'none';
                }
            });
        };

        if (hideMyForumsObserver) {
            hideMyForumsObserver.disconnect();
        }

        hideMyForumsObserver = new MutationObserver(() => {
            processMyForums();
        });

        hideMyForumsObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        processMyForums();
    }

    function showMyForums() {
        if (hideMyForumsObserver) {
            hideMyForumsObserver.disconnect();
            hideMyForumsObserver = null;
        }

        const containers = document.querySelectorAll('.list-container-wrapper.card-border');
        containers.forEach(container => {
            if (container.dataset.myForumsChecked) {
                container.style.display = '';
                delete container.dataset.myForumsChecked;
            }
        });
    }

    function toggleMyForums(hide) {
        currentConfig.hideMyForums = hide;
        saveConfig(currentConfig);

        if (hide) {
            hideMyForums();
        } else {
            showMyForums();
        }
    }

    let hideHelpPostsObserver = null;
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

    function toggleRightNav(hide) {
        currentConfig.hideRightNav = hide;
        saveConfig(currentConfig);

        if (hide) {
            hideRightNavBar();
        } else {
            showRightNavBar();
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

        // 创建新的监听器
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

    function applyRightNavSetting() {
        if (currentConfig.hideRightNav) {
            hideRightNavBar();
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

    function applyMyForumsSetting() {
        if (currentConfig.hideMyForums) {
            hideMyForums();
        }
    }

    function applyHelpPostsSetting() {
        if (currentConfig.hideHelpPosts) {
            hideHelpPosts();
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
                <label>
                    <input type="checkbox" id="dark-mode-toggle" ${currentConfig.darkMode ? 'checked' : ''}>
                    <span>深色模式</span>
                </label>
                <label>
                    <input type="checkbox" id="hide-right-nav-toggle" ${currentConfig.hideRightNav ? 'checked' : ''}>
                    <span>隐藏 | 主页右侧热点</span>
                </label>
                <label>
                    <input type="checkbox" id="hide-my-forums-toggle" ${currentConfig.hideMyForums ? 'checked' : ''}>
                    <span>隐藏 | 主页常逛的吧</span>
                </label>
                <label>
                    <input type="checkbox" id="hide-video-posts-toggle" ${currentConfig.hideVideoPosts ? 'checked' : ''}>
                    <span>隐藏 | 信息流视频贴</span>
                </label>
                <label>
                    <input type="checkbox" id="hide-help-posts-toggle" ${currentConfig.hideHelpPosts ? 'checked' : ''}>
                    <span>隐藏 | 信息流求助帖</span>
                </label>

                <div class="forum-block-section">
                    <label>
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
        const hideVideoPostsToggle = dialog.querySelector('#hide-video-posts-toggle');
        const hideHelpPostsToggle = dialog.querySelector('#hide-help-posts-toggle');
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
            toggleRightNav(e.target.checked);
        });

        hideMyForumsToggle.addEventListener('change', (e) => {
            toggleMyForums(e.target.checked);
        });

        hideVideoPostsToggle.addEventListener('change', (e) => {
            toggleVideoPosts(e.target.checked);
        });

        hideHelpPostsToggle.addEventListener('change', (e) => {
            toggleHelpPosts(e.target.checked);
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

    GM_registerMenuCommand('设置', createSettingsDialog);

    let headObserver = null;
    function init() {
        if (document.head) {
            enableDarkMode();
            applyRightNavSetting();
            applyMyForumsSetting();
            applyVideoPostsSetting();
            applyHelpPostsSetting();
            applyBlockForumsSetting();
        }

        if (!headObserver) {
            headObserver = new MutationObserver(() => {
                if (currentConfig.darkMode && !document.getElementById('dark-mode-style')) {
                    enableDarkMode();
                }
                if (currentConfig.hideRightNav && !document.getElementById('hide-right-nav-style')) {
                    applyRightNavSetting();
                }
            });
            headObserver.observe(document.head, { childList: true, subtree: true });
        }
    }

    init();
})();
