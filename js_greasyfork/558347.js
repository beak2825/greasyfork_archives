// ==UserScript==
// @name         flyhentai
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在 Exhentai 画廊缩略图右上角添加按钮，点击跳转到本地应用；详情页添加查找中文版按钮
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558347/flyhentai.user.js
// @updateURL https://update.greasyfork.org/scripts/558347/flyhentai.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // URL 校验：只在 e-hentai.org 或 exhentai.org 上运行
    const hostname = window.location.hostname;
    if (hostname !== 'e-hentai.org' && hostname !== 'exhentai.org') {
        return; // 不是目标网站，直接退出
    }

    // 配置本地应用URL前缀
    const LOCAL_APP_BASE_URL = 'http://192.168.0.108:51733/g';

    // 创建跳转按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .local-app-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0, 123, 255, 0.9);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-block;
            font-weight: bold;
        }

        .local-app-btn:hover {
            background: rgba(0, 86, 179, 0.95);
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .local-app-btn-detail {
            background: rgba(0, 123, 255, 0.9);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 24px;
            font-size: 18px;
            cursor: pointer;
            text-decoration: none;
            display: block;
            font-weight: bold;
            margin: 10px auto;
            width: fit-content;
            line-height: 1.2;
        }

        .local-app-btn-detail:hover {
            background: rgba(0, 86, 179, 0.95);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .gl3t {
            position: relative !important;
        }

        /* 确保按钮不会被图片遮挡 */
        .gl3t img {
            z-index: 1;
        }

        .local-app-btn {
            z-index: 10;
        }

        /* 下拉加载更多区域 */
        .pull-to-refresh-area {
            position: fixed;
            bottom: -100px;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(to top, rgba(0, 123, 255, 0.1), transparent);
            z-index: 1001;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: bottom 0.3s ease, opacity 0.3s ease;
            opacity: 0;
        }

        .pull-to-refresh-area.visible {
            bottom: 0;
            opacity: 1;
        }

        .pull-to-refresh-area.loading {
            background: linear-gradient(to top, rgba(0, 123, 255, 0.3), transparent);
        }

        .pull-indicator {
            background: rgba(0, 123, 255, 0.9);
            color: white;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .pull-indicator.loading::after {
            content: '';
            width: 16px;
            height: 16px;
            border: 2px solid white;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .pull-hint {
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 12px;
            z-index: 1002;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .pull-hint.visible {
            opacity: 1;
        }

            `;
    document.head.appendChild(style);

    // 下拉加载更多相关变量
    let pullArea = null;
    let pullIndicator = null;
    let pullHint = null;
    let isPulling = false;
    let pullStartY = 0;
    let pullCurrentY = 0;
    let pullThreshold = 120; // 下拉阈值
    let holdTimer = null;
    let isLoading = false;

    // 检查是否在 Exhentai 顶级路径
    function isExhentaiTopLevel() {
        return window.location.hostname === 'exhentai.org' &&
            (window.location.pathname === '/' || window.location.pathname === '');
    }

    // 创建下拉加载更多区域
    function createPullToRefreshArea() {
        // 只在 Exhentai 顶级路径创建
        if (!isExhentaiTopLevel()) {
            return;
        }

        // 防止重复创建
        if (document.querySelector('.pull-to-refresh-area')) {
            return;
        }

        // 创建下拉区域容器
        pullArea = document.createElement('div');
        pullArea.className = 'pull-to-refresh-area';

        // 创建指示器
        pullIndicator = document.createElement('div');
        pullIndicator.className = 'pull-indicator';
        pullIndicator.textContent = '继续上拉加载下一页';

        // 创建提示
        pullHint = document.createElement('div');
        pullHint.className = 'pull-hint';
        pullHint.textContent = '拉到页面底部并持续上拉';

        // 组装元素
        pullArea.appendChild(pullIndicator);
        document.body.appendChild(pullArea);
        document.body.appendChild(pullHint);

        // 设置事件监听
        setupPullEvents();
    }

    // 设置下拉事件
    function setupPullEvents() {
        let isAtBottom = false;

        // 检查是否在页面底部
        function checkIfAtBottom() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // 距离底部50px内认为在底部
            isAtBottom = scrollTop + windowHeight >= documentHeight - 50;

            // 检查页面是否有数据
            const galleryContainers = document.querySelectorAll('div.gl3t');
            const hasData = galleryContainers.length > 0;

            return isAtBottom && hasData;
        }

        // 触摸开始
        document.addEventListener('touchstart', (e) => {
            if (isLoading) return;

            const touch = e.touches[0];
            pullStartY = touch.clientY;
            pullCurrentY = pullStartY;

            // 检查是否在页面底部
            if (checkIfAtBottom()) {
                isPulling = true;
                pullHint.classList.add('visible');
            }
        });

        // 触摸移动
        document.addEventListener('touchmove', (e) => {
            if (!isPulling || isLoading) return;

            const touch = e.touches[0];
            pullCurrentY = touch.clientY;
            const deltaY = pullStartY - pullCurrentY; // 向上为负值

            // 只处理向上拉的手势
            if (deltaY > pullThreshold) {
                pullArea.classList.add('visible');
                pullIndicator.textContent = '松开加载下一页';
                pullHint.classList.remove('visible');

                // 清除之前的定时器，改为准备松开触发
                if (holdTimer) {
                    clearTimeout(holdTimer);
                    holdTimer = null;
                }
            } else if (deltaY > 30) {
                pullArea.classList.add('visible');
                pullIndicator.textContent = '继续上拉';
                pullHint.classList.remove('visible');

                if (holdTimer) {
                    clearTimeout(holdTimer);
                    holdTimer = null;
                }
            } else {
                pullArea.classList.remove('visible');
                pullHint.classList.add('visible');

                if (holdTimer) {
                    clearTimeout(holdTimer);
                    holdTimer = null;
                }
            }
        });

        // 触摸结束
        document.addEventListener('touchend', () => {
            if (!isPulling || isLoading) return;

            const deltaY = pullStartY - pullCurrentY;

            // 如果达到了阈值，松开时触发翻页
            if (deltaY > pullThreshold) {
                loadNextPage();
            } else {
                // 没达到阈值，直接隐藏
                isPulling = false;
                pullArea.classList.remove('visible');
                pullHint.classList.remove('visible');
            }

            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }

            pullStartY = 0;
            pullCurrentY = 0;
        });

        // 鼠标事件支持（桌面端）
        document.addEventListener('mousedown', (e) => {
            if (isLoading) return;

            if (checkIfAtBottom()) {
                isPulling = true;
                pullStartY = e.clientY;
                pullCurrentY = pullStartY;
                pullHint.classList.add('visible');
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isPulling || isLoading) return;

            pullCurrentY = e.clientY;
            const deltaY = pullStartY - pullCurrentY;

            if (deltaY > pullThreshold) {
                pullArea.classList.add('visible');
                pullIndicator.textContent = '松开加载下一页';
                pullHint.classList.remove('visible');

                if (holdTimer) {
                    clearTimeout(holdTimer);
                    holdTimer = null;
                }
            } else if (deltaY > 30) {
                pullArea.classList.add('visible');
                pullIndicator.textContent = '继续上拉';
                pullHint.classList.remove('visible');

                if (holdTimer) {
                    clearTimeout(holdTimer);
                    holdTimer = null;
                }
            } else {
                pullArea.classList.remove('visible');
                pullHint.classList.add('visible');

                if (holdTimer) {
                    clearTimeout(holdTimer);
                    holdTimer = null;
                }
            }
        });

        document.addEventListener('mouseup', () => {
            if (!isPulling || isLoading) return;

            const deltaY = pullStartY - pullCurrentY;

            // 如果达到了阈值，松开时触发翻页
            if (deltaY > pullThreshold) {
                loadNextPage();
            } else {
                // 没达到阈值，直接隐藏
                isPulling = false;
                pullArea.classList.remove('visible');
                pullHint.classList.remove('visible');
            }

            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }

            pullStartY = 0;
            pullCurrentY = 0;
        });
    }

    // 加载下一页
    function loadNextPage() {
        if (isLoading) return;

        // 检查页面是否为空（没有画廊数据）
        const galleryContainers = document.querySelectorAll('div.gl3t');
        if (galleryContainers.length === 0) {
            pullIndicator.textContent = '当前页面无数据，无法翻页';
            setTimeout(() => {
                pullArea.classList.remove('visible');
                isPulling = false;
            }, 2000);
            return;
        }

        const nextLink = document.querySelector('a#dnext');
        if (!nextLink || !nextLink.href) {
            pullIndicator.textContent = '没有更多页面了';
            setTimeout(() => {
                pullArea.classList.remove('visible');
                isPulling = false;
            }, 2000);
            return;
        }

        // 检查是否是最后一页的指示
        const isLastPage = nextLink.classList.contains('inactive') ||
            nextLink.style.opacity === '0.5' ||
            !nextLink.href || nextLink.href === window.location.href;

        if (isLastPage) {
            pullIndicator.textContent = '已到达最后一页';
            setTimeout(() => {
                pullArea.classList.remove('visible');
                isPulling = false;
            }, 2000);
            return;
        }

        isLoading = true;
        isPulling = false;
        pullIndicator.classList.add('loading');
        pullIndicator.textContent = '正在加载...';
        pullHint.classList.remove('visible');

        // 模拟加载延迟
        setTimeout(() => {
            window.location.href = nextLink.href;
        }, 500);
    }


    // 添加按钮到所有画廊容器
    function addButtonsToGalleries() {
        const galleryContainers = document.querySelectorAll('div.gl3t');

        galleryContainers.forEach(container => {
            // 检查是否已经添加过按钮
            if (container.querySelector('.local-app-btn')) {
                return;
            }

            // 获取链接元素
            const link = container.querySelector('a');
            if (!link || !link.href) {
                return;
            }

            // 提取gallery ID和token
            const href = link.href;
            const match = href.match(/\/g\/([^\/]+)\/([^\/]+)\/?/);

            if (match) {
                const galleryId = match[1];
                const token = match[2];

                // 创建跳转按钮
                const button = document.createElement('a');
                button.href = `${LOCAL_APP_BASE_URL}/${galleryId}/${token}?force_scan=true`;
                button.className = 'local-app-btn';
                button.textContent = '🚀';
                button.target = '_blank'; // 在新标签页打开
                button.title = '在本地应用中打开此画廊';

                // 阻止默认链接行为，只处理按钮点击
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(button.href, '_blank');
                });

                // 将按钮添加到容器中
                container.appendChild(button);

                console.log(`已为画廊 ${galleryId}/${token} 添加本地应用按钮`);
            }
        });
    }

    // 处理详情页面的按钮添加
    function addButtonsToDetailPage() {
        // 检查是否在详情页
        const match = window.location.href.match(/\/g\/([^\/]+)\/([^\/]+)\/?/);
        if (!match) return;

        const galleryId = match[1];
        const token = match[2];
        const gd5 = document.querySelector('#gd5');

        if (gd5 && !gd5.querySelector('.local-app-btn-detail')) {
            // 创建本地应用按钮
            const localAppButton = document.createElement('a');
            localAppButton.href = `${LOCAL_APP_BASE_URL}/${galleryId}/${token}?force_scan=true`;
            localAppButton.className = 'local-app-btn-detail';
            localAppButton.textContent = '🚀';
            localAppButton.target = '_blank';
            localAppButton.title = '在本地应用中打开此画廊';

            localAppButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(localAppButton.href, '_blank');
            });

            // 创建查找中文版按钮
            const chineseVersionButton = document.createElement('a');
            chineseVersionButton.href = '#';
            chineseVersionButton.className = 'local-app-btn-detail';
            chineseVersionButton.textContent = '🔍中文版';
            chineseVersionButton.target = '_blank';
            chineseVersionButton.title = '查找此画廊的中文版';

            chineseVersionButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const searchUrl = generateChineseVersionSearchUrl();
                if (searchUrl) {
                    window.open(searchUrl, '_blank');
                } else {
                    alert('无法生成搜索链接，请稍后重试');
                }
            });

            // 添加按钮到页面
            const br = document.createElement('br');
            const br2 = document.createElement('br');
            gd5.appendChild(br);
            gd5.appendChild(localAppButton);
            gd5.appendChild(br2);
            gd5.appendChild(chineseVersionButton);

            console.log(`已为详情页 ${galleryId}/${token} 添加本地应用按钮和查找中文版按钮`);
        }
    }

    // 生成查找中文版的搜索URL
    function generateChineseVersionSearchUrl() {
        try {
            // 获取 #gd2 元素
            const gd2 = document.querySelector('#gd2');
            if (!gd2) {
                console.error('未找到 #gd2 元素');
                return null;
            }

            // 获取h1标题元素
            const h1Elements = gd2.querySelectorAll('h1');
            const gnElement = h1Elements[0]; // 第一个h1
            const gjElement = h1Elements[1]; // 第二个h1 (可能不存在)

            if (!gnElement) {
                console.error('未找到任何标题元素');
                return null;
            }

            const title1 = gnElement.textContent.trim();
            const title2 = gjElement ? gjElement.textContent.trim() : '';

            let selectedTitle;

            // 检查标题是否为空
            if (!title1 && !title2) {
                console.error('两个标题都为空');
                return null;
            } else if (!title2) {
                console.log('第二个标题为空，选择第一个标题');
                selectedTitle = title1;
            } else if (!title1) {
                console.log('第一个标题为空，选择第二个标题');
                selectedTitle = title2;
            } else {
                // 两个标题都有内容，选择英文占比较少的
                selectedTitle = selectTitleWithLessEnglish(title1, title2);
            }

            // 清洗标题
            const cleanedTitle = cleanTitle(selectedTitle);

            if (!cleanedTitle) {
                console.error('清洗后的标题为空');
                return null;
            }

            // 生成搜索URL
            const baseUrl = 'https://exhentai.org/?';
            const searchParams = new URLSearchParams();
            searchParams.set('f_search', `language:chinese ${cleanedTitle}`);

            console.log(`生成的搜索关键词: ${cleanedTitle}`);
            return baseUrl + searchParams.toString();

        } catch (error) {
            console.error('生成搜索URL时出错:', error);
            return null;
        }
    }

    // 选择英文占比较少的标题
    function selectTitleWithLessEnglish(title1, title2) {
        const englishRatio1 = calculateEnglishRatio(title1);
        const englishRatio2 = calculateEnglishRatio(title2);

        console.log(`标题1: "${title1}" 英文占比: ${englishRatio1.toFixed(2)}`);
        console.log(`标题2: "${title2}" 英文占比: ${englishRatio2.toFixed(2)}`);

        return englishRatio1 <= englishRatio2 ? title1 : title2;
    }

    // 计算英文占比
    function calculateEnglishRatio(text) {
        if (!text) return 1;

        // 统计英文字符数（包括英文字母、数字、空格和常见英文标点）
        const englishChars = text.match(/[a-zA-Z0-9\s\.,!?;:'"()\-]/g) || [];
        const totalChars = text.replace(/\s/g, '').length; // 不计算空格的总字符数

        return totalChars > 0 ? englishChars.length / totalChars : 0;
    }

    // 清洗标题
    function cleanTitle(title) {
        if (!title) return '';

        console.log(`原始标题: "${title}"`);

        // 使用正则表达式删除所有括号内容（包括全角和半角的方括号、圆括号）
        // 【xx】、[xx]、(xxx) 都会被删除
        let cleaned = title.replace(/【.*?】|\[.*?\]|\(.*?\)/g, '').trim();

        console.log(`清洗后标题: "${cleaned}"`);
        return cleaned;
    }


    // 创建下拉加载更多区域
    createPullToRefreshArea();

    // 初始添加按钮
    addButtonsToGalleries();
    addButtonsToDetailPage();

    // 监听DOM变化，为动态加载的内容添加按钮
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查是否添加了新的画廊容器
                        if (node.classList && node.classList.contains('gl3t')) {
                            shouldUpdate = true;
                        } else if (node.querySelector && node.querySelector('.gl3t')) {
                            shouldUpdate = true;
                        }
                    }
                });
            }
        });

        if (shouldUpdate) {
            setTimeout(addButtonsToGalleries, 100); // 短暂延迟确保DOM更新完成
        }
    });

    // 开始观察整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 定期检查（备用方案）
    setInterval(() => {
        addButtonsToGalleries();
        addButtonsToDetailPage();
    }, 2000);

    console.log('Exhentai Gallery Opener 脚本已加载');
})();