// ==UserScript==
// @name         Git仓库一键跳转HPX
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在Git仓库页面添加跳转到HPX打包页面的按钮
// @author       Dean
// @match        https://dev.sankuai.com/code/repo-detail/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/550024/Git%E4%BB%93%E5%BA%93%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%ACHPX.user.js
// @updateURL https://update.greasyfork.org/scripts/550024/Git%E4%BB%93%E5%BA%93%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%ACHPX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #zy_hpx_button {
            margin-right: 8px;
            position: relative;
            overflow: hidden;
        }
        .mtd-button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
        }
        .mtdicon-fast-forward {
            margin-right: 4px;
        }

        /* 节日装饰样式 */
        .festival-icon {
            position: absolute;
            pointer-events: none;
            font-size: 12px;
            z-index: 1;
        }

        /* 春节样式 */
        .spring-festival .festival-icon {
            animation: springFestival 2s infinite;
        }

        /* 圣诞节样式 */
        .christmas .festival-icon {
            animation: snowfall 3s infinite;
        }

        /* 万圣节样式 */
        .halloween .festival-icon {
            animation: spooky 3s infinite;
        }

        /* 元宵节样式 */
        .lantern-festival .festival-icon {
            animation: floating 3s infinite;
        }

        /* 动画效果 */
        @keyframes springFestival {
            0% { transform: scale(1) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(1) rotate(360deg); opacity: 1; }
        }

        @keyframes snowfall {
            0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100%) rotate(360deg); opacity: 0; }
        }

        @keyframes spooky {
            0% { transform: translateX(-20px) translateY(0); opacity: 1; }
            50% { transform: translateX(20px) translateY(-10px); opacity: 0.7; }
            100% { transform: translateX(-20px) translateY(0); opacity: 1; }
        }

        @keyframes floating {
            0% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
            100% { transform: translateY(0) rotate(-5deg); }
        }

        /* 光效装饰 */
        .festival-sparkle {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1;
        }
        .festival-sparkle::before,
        .festival-sparkle::after {
            content: '';
            position: absolute;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            background: rgba(255,255,255,0.6);
            animation: sparkle 2s infinite;
        }
        .festival-sparkle::after {
            animation-delay: 1s;
        }

        @keyframes sparkle {
            0%, 100% { transform: translate(0, 0) scale(0); opacity: 0; }
            50% { transform: translate(20px, -20px) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // 页面加载完成后执行
    if (window.location.toString().indexOf('dev.sankuai.com/code/repo-detail') >= 0) {
        // 使用 MutationObserver 监听DOM变化
        const observer = new MutationObserver((mutations, observer) => {
            if ($(".btn-box").length > 0 && $("#zy_hpx_button").length === 0) {
                logger('检测到按钮容器');
                observer.disconnect(); // 停止观察
                inject(() => {});
            }
        });

        // 立即检查是否已存在按钮容器
        if ($(".btn-box").length > 0) {
            logger('按钮容器已存在');
            inject(() => {});
        } else {
            logger('等待按钮容器');
            // 开始观察
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // 添加页面 URL 变化监听
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                logger('URL 发生变化');
                if (url.indexOf('dev.sankuai.com/code/repo-detail') >= 0) {
                    inject(() => {});
                }
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // 缓存键名
    const CACHE_KEY = 'HPX_PROJECT_CACHE';
    const CACHE_EXPIRE = 24 * 60 * 60 * 1000; // 24小时缓存

    // 获取缓存的项目数据
    function getCachedProject(git) {
        try {
            const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
            const data = cache[git];
            if (data && (Date.now() - data.timestamp) < CACHE_EXPIRE) {
                return data.project;
            }
        } catch (e) {
            logger('读取缓存失败', e);
        }
        return null;
    }

    // 设置项目缓存
    function setCachedProject(git, project) {
        try {
            const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
            cache[git] = {
                project: project,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
            logger('设置缓存失败', e);
        }
    }

    // 入侵
    function inject(callback) {
        if ($(".btn-box").length <= 0) {
            logger('没有查到元素');
            return false;
        }
        logger('查到元素');

        // 先渲染一个加载中的按钮
        renderLoadingButton();

        // 查询git地址
        getGitAddress(function(git) {
            if (git.length <= 0) {
                removeButton();
                callback(true);
                return;
            }

            // 先检查缓存
            const cachedProject = getCachedProject(git);
            if (cachedProject) {
                logger('使用缓存数据');
                renderHPXButton(cachedProject);
                callback(true);

                // 异步更新缓存
                updateProjectCache(git);
                return;
            }

            // 无缓存时请求新数据
            requestProjectData(git, callback);
        });
    }

    // 异步更新缓存
    function updateProjectCache(git) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://hpx.sankuai.com/api/open/getProjectUrlList?repoUrl=' + git,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.data && data.data.length > 0) {
                        const project = data.data[data.data.length - 1];
                        setCachedProject(git, project);
                        logger('缓存已更新');
                    }
                } catch (e) {
                    logger('更新缓存失败', e);
                }
            }
        });
    }

    // 请求项目数据
    function requestProjectData(git, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://hpx.sankuai.com/api/open/getProjectUrlList?repoUrl=' + git,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.data && data.data.length > 0) {
                        const project = data.data[data.data.length - 1];
                        if (project.length > 0) {
                            logger('获取新数据');
                            setCachedProject(git, project);
                            renderHPXButton(project);
                            callback(true);
                            return;
                        }
                    }
                    // 如果没有获取到有效数据，移除loading按钮
                    removeButton();
                    callback(true);
                } catch (e) {
                    logger('请求数据失败', e);
                    removeButton();
                    callback(true);
                }
            },
            onerror: function() {
                logger('网络请求失败');
                removeButton();
                callback(true);
            }
        });
    }

    // 渲染加载中按钮
    function renderLoadingButton() {
        removeButton(); // 先移除已存在的按钮
        $(".btn-box").prepend(`
            <button id="zy_hpx_button" type="button" class="mtd-btn mtd-btn-primary">
                <span>
                    <div class="mtd-button-content">
                        <span class="mtdicon mtdicon-fast-forward"></span>
                        <span>Loading...</span>
                    </div>
                </span>
            </button>
        `);
    }

    // 渲染按钮
    function renderHPXButton(project) {
        removeButton(); // 先移除已存在的按钮
        const festival = getFestival();
        const festivalConfig = {
            'spring-festival': {
                icon: '🏮',
                text: '新年快乐',
                icons: ['🏮', '💰', '🧨', '🎊', '🐲', '福']
            },
            'lantern-festival': {
                icon: '🏮',
                text: '元宵节快乐',
                icons: ['🏮', '👻', '🌕', '⭐']
            },
            'halloween': {
                icon: '🎃',
                text: 'Happy Halloween',
                icons: ['🎃', '👻', '🦇', '🕷️', '🕸️']
            },
            'christmas': {
                icon: '🎄',
                text: 'Merry Xmas',
                icons: ['❄️', '🎄', '🎅', '🎁', '⛄', '🦌']
            }
        };

        // 在首部插入Button
        $(".btn-box").prepend(`
            <button id="zy_hpx_button" type="button" class="mtd-btn mtd-btn-primary ${festival}">
                ${festival ? '<div class="festival-sparkle"></div>' : ''}
                <span>
                    <div class="mtd-button-content">
                        <span class="mtdicon mtdicon-fast-forward"></span>
                        <span>Go to HyperloopX</span>
                        ${festival ? `<span style="margin-left: 4px">${festivalConfig[festival].icon}</span>` : ''}
                    </div>
                </span>
            </button>
        `);

        $("#zy_hpx_button").click(function(){
            // 点击效果
            if (festival) {
                const config = festivalConfig[festival];
                const icon = config.icons[Math.floor(Math.random() * config.icons.length)];
                const $icon = $(`<span class="festival-icon">${icon}</span>`);
                $icon.css({
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%) scale(3)',
                    opacity: 0
                });
                $(this).append($icon);
                setTimeout(() => $icon.remove(), 500);
            }

            // 打开窗口
            window.open(project);
        });
    }

    // 统一的按钮移除函数
    function removeButton() {
        $("#zy_hpx_button").remove();
    }

    // 查询git地址
    function getGitAddress(callback) {
        var str = 'dev.sankuai.com/code/repo-detail';
        var index = window.location.toString().indexOf(str);
        var reset = window.location.toString().substring(index + str.length);
        var components = reset.split('/');

        if (components.length >= 3) {
            var url = 'https://dev.sankuai.com/rest/api/2.0/projects/' + components[1] + '/repos/' + components[2];
            $.get(url, {}, function(data){
                var git = '';
                for (let i = 0; i < data.links.clone.length; i++) {
                    let item = data.links.clone[i];
                    if (item.name === 'ssh') {
                        git = item.href;
                        break;
                    }
                }
                callback(git);
            });
        }
        return '';
    }

    // 获取当前节日
    function getFestival() {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // 农历新年判断（这里使用简化判断，实际应该使用农历计算）
        if (month === 1 && day >= 20 || month === 2 && day <= 20) {
            return 'spring-festival';
        }

        // 元宵节
        if (month === 2 && day >= 24 && day <= 26) {
            return 'lantern-festival';
        }

        // 万圣节
        if (month === 10 && day >= 29 || month === 11 && day <= 2) {
            return 'halloween';
        }

        // 圣诞节
        if (month === 12 && day >= 20 && day <= 26) {
            return 'christmas';
        }

        return '';
    }

    // log
    function logger(log) {
        console.log("[go to HPX]", log);
    }
})();