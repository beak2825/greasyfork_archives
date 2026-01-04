// ==UserScript==
// @name         超星网课自动阅读
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动滚动阅读超星网课内容并翻页，只在课程阅读页面运行,只用于刷超星学习通的阅读页面的时长
// @author       None
// @icon https://pic.baike.soso.com/ugc/baikepic2/4113/cut-20210516102103-913774225_jpg_361_290_11188.jpg/300
// @match        https://mooc1.chaoxing.com/mooc-ans/ztnodedetailcontroller/visitnodedetail*
// @match        https://mooc1.chaoxing.com/mooc-ans/course/*.html*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550448/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/550448/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 检查当前页面是否为目标页面
    function isTargetPage() {
        // 第一种页面类型：ztnodedetailcontroller/visitnodedetail
        if (window.location.href.includes('/ztnodedetailcontroller/visitnodedetail')) {
            return true;
        }

        // 第二种页面类型：mooc-ans/course/数字.html
        if (window.location.href.includes('/mooc-ans/course/') &&
            window.location.href.match(/\/course\/\d+\.html/)) {
            return true;
        }

        return false;
    }

    // 检查是否是课程目录页面
    function isCourseIndexPage() {
        return window.location.href.includes('/mooc-ans/course/') &&
            window.location.href.match(/\/course\/\d+\.html/) &&
            document.querySelector('.cell.js-cell');
    }
    // 如果不是目标页面，直接返回
    if (!isTargetPage()) {
        console.log('超星网课自动阅读：当前页面不是课程内容页面，脚本不运行');
        return;
    }

    // 添加自定义样式
    GM_addStyle(`
        .auto-reader-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 9999;
            display: flex;
            align-items: center;
        }
        .auto-reader-controls {
            position: fixed;
            bottom: 45%;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .auto-reader-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #0099ff;
            color: white;
            font-weight: bold;
        }
        .auto-reader-btn:hover {
            background: #0077cc;
        }
        .auto-reader-btn.pause {
            background: #ff9900;
        }
        .auto-reader-btn.stop {
            background: #ff3333;
        }
    `);

    // 配置参数
    const config = {
        scrollSpeed: 2, // 滚动速度（像素/次）
        scrollInterval: 50, // 滚动间隔（毫秒）
        bottomThreshold: 100, // 底部阈值（像素）
        waitAfterPageLoad: 3000, // 页面加载后等待时间（毫秒）
        nextPageWaitTime: 2000, // 点击下一页后等待时间（毫秒）
    };

    let isScrolling = false;
    let isPaused = false;
    let scrollInterval;
    let currentScrollPosition = 0;

    // 初始化函数
    function init() {
        console.log('超星网课自动阅读脚本已加载，当前页面:', window.location.href);

        // 检查是否是目录页面
        if (isCourseIndexPage()) {
            console.log('检测到课程目录页面，尝试进入第一个章节');
            enterFirstChapter();
            return;
        }

        // 创建状态指示器
        createIndicator();

        // 创建控制按钮
        createControls();

        // 开始自动阅读
        setTimeout(() => {
            startAutoReading();
        }, config.waitAfterPageLoad);
    }

    // 进入第一个章节
    function enterFirstChapter() {
        // 查找章节链接
        const chapterLinks = document.querySelectorAll('.cell.js-cell a[href*="/mooc-ans/ztnodedetailcontroller/visitnodedetail?"]');

        if (chapterLinks.length > 0) {
            console.log('找到章节链接:', chapterLinks[0].href);

            // 创建提示信息
            const message = document.createElement('div');
            message.style.position = 'fixed';
            message.style.top = '50%';
            message.style.left = '50%';
            message.style.transform = 'translate(-50%, -50%)';
            message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            message.style.color = 'white';
            message.style.padding = '20px';
            message.style.borderRadius = '10px';
            message.style.zIndex = '10000';
            message.style.textAlign = 'center';
            message.innerHTML = '<h3>超星网课自动阅读</h3><p>正在进入第一个章节...</p>';
            document.body.appendChild(message);

            // 3秒后跳转
            setTimeout(() => {
                window.location.href = chapterLinks[0].href;
            }, 3000);
        } else {
            console.log('未找到章节链接，可能页面结构已变化');

            // 创建错误提示
            const errorMsg = document.createElement('div');
            errorMsg.style.position = 'fixed';
            errorMsg.style.top = '50%';
            errorMsg.style.left = '50%';
            errorMsg.style.transform = 'translate(-50%, -50%)';
            errorMsg.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            errorMsg.style.color = 'white';
            errorMsg.style.padding = '20px';
            errorMsg.style.borderRadius = '10px';
            errorMsg.style.zIndex = '10000';
            errorMsg.style.textAlign = 'center';
            errorMsg.innerHTML = '<h3>超星网课自动阅读</h3><p>未找到章节链接，请手动进入第一个章节</p>';
            document.body.appendChild(errorMsg);
        }
    }

    // 创建状态指示器
    function createIndicator() {
        // 先检查是否已存在指示器
        if (document.querySelector('.auto-reader-indicator')) {
            return;
        }
        const indicator = document.createElement('div');
        indicator.className = 'auto-reader-indicator';
        indicator.innerHTML = '自动阅读: <span style="color: #00ff00; margin-left: 5px;">运行中</span>';
        document.body.appendChild(indicator);
    }

    // 创建控制按钮
    function createControls() {
        // 先检查是否已存在控制按钮
        if (document.querySelector('.auto-reader-controls')) {
            return;
        }
        const controls = document.createElement('div');
        controls.className = 'auto-reader-controls';

        const pauseBtn = document.createElement('button');
        pauseBtn.className = 'auto-reader-btn pause';
        pauseBtn.textContent = '暂停';
        pauseBtn.onclick = togglePause;

        const stopBtn = document.createElement('button');
        stopBtn.className = 'auto-reader-btn stop';
        stopBtn.textContent = '停止';
        stopBtn.onclick = stopAutoReading;

        controls.appendChild(pauseBtn);
        controls.appendChild(stopBtn);
        document.body.appendChild(controls);
    }

    // 开始自动阅读
    function startAutoReading() {
        if (isScrolling) return;

        isScrolling = true;
        isPaused = false;
        currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // 开始滚动
        scrollInterval = setInterval(() => {
            if (isPaused) return;

            // 获取页面高度和视窗高度
            const pageHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;

            // 检查是否到达底部
            if (currentScrollPosition + viewportHeight >= pageHeight - config.bottomThreshold) {
                // 到达底部，尝试翻页
                goToNextPage();
                return;
            }

            // 继续滚动
            currentScrollPosition += config.scrollSpeed;
            window.scrollTo(0, currentScrollPosition);
        }, config.scrollInterval);
    }

    // 暂停/继续自动阅读
    function togglePause() {
        isPaused = !isPaused;

        // 更新按钮文本
        const pauseBtn = document.querySelector('.auto-reader-btn.pause');
        if (pauseBtn) {
            pauseBtn.textContent = isPaused ? '继续' : '暂停';
        }

        // 更新状态指示器
        const statusSpan = document.querySelector('.auto-reader-indicator span');
        if (statusSpan) {
            statusSpan.textContent = isPaused ? '已暂停' : '运行中';
            statusSpan.style.color = isPaused ? '#ff9900' : '#00ff00';
        }
    }

    // 停止自动阅读
    function stopAutoReading() {
        clearInterval(scrollInterval);
        isScrolling = false;
        isPaused = false;

        // 更新状态指示器
        const statusSpan = document.querySelector('.auto-reader-indicator span');
        if (statusSpan) {
            statusSpan.textContent = '已停止';
            statusSpan.style.color = '#ff3333';
        }

        // 移除控制按钮
        const controls = document.querySelector('.auto-reader-controls');
        if (controls) {
            controls.remove();
        }
    }

    // 跳转到下一页
    function goToNextPage() {
        // 查找下一页链接
        const nextPageLinks = document.querySelectorAll('a');
        let nextPageLink = null;

        for (let link of nextPageLinks) {
            if (link.textContent.includes('下一页') ||
                (link.querySelector('i') && link.querySelector('i').className.includes('i_c i_35'))) {
                nextPageLink = link;
                break;
            }
        }

        if (nextPageLink && nextPageLink.href) {
            console.log('找到下一页链接，正在跳转:', nextPageLink.href);
            // 停止当前滚动
            clearInterval(scrollInterval);
            isScrolling = false;

            // 等待一段时间后跳转
            setTimeout(() => {
                window.location.href = nextPageLink.href;
            }, config.nextPageWaitTime);
        } else {
            console.log('未找到下一页链接');
            // 如果没有找到下一页链接，暂停滚动
            isPaused = true;

            // 更新状态指示器
            const statusSpan = document.querySelector('.auto-reader-indicator span');
            if (statusSpan) {
                statusSpan.textContent = '已完成';
                statusSpan.style.color = '#00ccff';
            }
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();