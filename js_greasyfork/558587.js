// ==UserScript==
// @name         驼人云学堂全自动刷视频gzf
// @namespace    https://
// @version      1.6
// @description  云学堂视频播放
// @author       xlu
// @license      MIT
// @icon         https://picobd.yxt.com/orgs/yxt_malladmin/mvcpic/image/201811/71672740d9524c53ac3d60b6a4123bca.png
// @match        http*://*.yunxuetang.cn/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558587/%E9%A9%BC%E4%BA%BA%E4%BA%91%E5%AD%A6%E5%A0%82%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91gzf.user.js
// @updateURL https://update.greasyfork.org/scripts/558587/%E9%A9%BC%E4%BA%BA%E4%BA%91%E5%AD%A6%E5%A0%82%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91gzf.meta.js
// ==/UserScript==

(function () {
    console.log('启动了脚本）');
    // 常量定义
    const NUMBER_OF_VIDEO_PLAYBACK_PAUSES = 'numberOfVideoPlaybackPauses';
    const AUTO_SUBMIT_KEY = "auto_submit";
    const COURSE_PACKAGE_REFRESH_KEY = "course_package_refresh_key";
    const EXAM_OPEN_PAGE_KEY = "exam_open_page_key";

    // ========== 核心新增：监听哈希路由变化 ==========
    function initRouteListener() {
        console.log('当前initRouteListener');
        // 初始执行一次页面检测
        checkCurrentPage();
        // 监听哈希路由变化
        window.addEventListener('hashchange', checkCurrentPage);
        // 兜底：全局轮询检测（防止hashchange未触发）30s
        setInterval(checkCurrentPage, 15000);
    }

    // ========== 核心：检测当前页面并执行对应逻辑 ==========
    function checkCurrentPage() {
        const path = window.location.pathname + window.location.hash;
        // 1. 任务列表页逻辑
        if (path.match(/^\/kng\/#\/square\/list.*/g)) {
            handleCourseListPage();
        }
        // 2. 视频播放页逻辑
        else if (path.match(/^\/kng\/.*\/video.*/g) ||path.match(/^\/kng\/.*\/weike.*/g) || path.match(/^\/kng\/course\/package\/video.*/g) || path.match(/^\/knowledge\/video.*/g) || path.match(/^\/kng\/#\/course\/play.*/g)) {
            handleVideoPlayPage();
        }
        // 3. 其他页面（清空定时器，避免无效轮询）
        else {
            console.log('非目标页面，停止视频页轮询');
            if (window.videoPollTimer) clearInterval(window.videoPollTimer);
        }
    }

    // ========== 处理课程列表页 ==========
    function handleCourseListPage() {
        console.log('学习任务列表页.');
        // 等待课程列表元素加载
        waitForElement('.kng-list__item.hand', function(courseItems) {
            console.log('学习任务列表页 - 成功获取课程项：', courseItems.length);

            let hasUnfinishedCourse = false; // 标记是否有未学完课程
            let targetCourse = null;

            // 遍历课程找未学完的
            for (let index = 0; index < courseItems.length; index++) {
                const item = courseItems[index];
                // 提取学习状态
                const tagElements = item.querySelectorAll('.kng-list__tags .kng-list__tag');
                let status = '未学习';
                for (let tag of tagElements) {
                    const tagText = tag.textContent.trim();

                    if (tagText === '已学完') {
                        status = tagText;
                        break;
                    }
                    if( tagText ==='微课' || tagText ==='文档' ) {
                        status = '已学完'
                        console.log("这是一个不支持的类型，准备跳过")
                    }
                }
                // 获取课程名称
                const courseTitle = item.querySelector('.knglist-li-title')?.textContent.trim() || '未知课程';
                console.log('任务' + (index + 1) + ', 学习状态:' + status + ', 课程名称:' + courseTitle);

                // 找到第一个未学完的课程
                if (status !== '已学完' && !targetCourse) {
                    targetCourse = { item, courseTitle };
                    hasUnfinishedCourse = true;
                    break;
                }
            }

            // 有未学完课程则点击
            if (hasUnfinishedCourse && targetCourse) {
                console.log('点击这个未完成的课程：' + targetCourse.courseTitle);
                setTimeout(function () {
                    targetCourse.item.click();
                }, 2 * 1000);
            } else {
                // 本页都已学完，点击下一页
                console.log('本页课程均已学完，点击下一页.15秒后自动查询未学习课程，请稍等');
                const nextPageBtn = getElementByXPath('//*[@id="yxtBizNavMain"]/div/div[2]/div[2]/div[1]/div[3]/div/div/button[2]');
                if (nextPageBtn) {
                    // 检查下一页按钮是否禁用（可选）
                    const isNextDisabled = nextPageBtn.className.includes('disabled') || nextPageBtn.classList.contains('disabled');
                    if (!isNextDisabled) {
                          nextPageBtn.click();
                    } else {
                        console.log('下一页按钮已禁用，无更多课程');
                    }
                } else {
                    console.log('未找到下一页按钮');
                }
            }
        });
    }

    // ========== 处理视频播放页 ==========
    function handleVideoPlayPage() {
        // 检测是否切回列表页（防止路由切换后仍执行视频逻辑）
        const currentPath = window.location.pathname + window.location.hash;
        if (currentPath.match(/^\/kng\/#\/square\/list.*/g)) {
            clearInterval(window.videoPollTimer);
            checkCurrentPage(); // 切回列表页逻辑
            return;
        }

        // 正常视频页检测逻辑
        detectionOnline();
        detectPlaybackStatus();
        if (document.getElementById('videocontainer-vjs')) {
            detectionComplete();
        } else {
            console.log('播放器未就绪，跳过完成度检测');
        }
    }


    // ========== 通用工具函数 ==========
    // 等待元素加载（可复用）
    function waitForElement(selector, callback, maxRetry = 20, interval = 1000) {
        let retryCount = 0;
        const check = () => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                callback(elements);
            } else if (retryCount < maxRetry) {
                retryCount++;
                console.log(`元素${selector}未加载，第${retryCount}次重试...`);
                setTimeout(check, interval);
            } else {
                console.log('重试次数耗尽，仍未找到元素：' + selector);
            }
        };
        // 先等DOM加载
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            check();
        } else {
            document.addEventListener('DOMContentLoaded', check);
        }
    }

    // 获取XPath元素
    function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }





    // 点击下一节
    function setNextKng() {
        // 下一节按钮
        const popupBtn = getElementByXPath('//*[@id="yxtBizNavMain"]/div/div[1]/div[2]/div[1]/div/span/div/main/div[1]/div[1]/div[2]/div[2]/div[2]');
        // 返回按钮
        const backBtn = getElementByXPath('//*[@id="yxtBizNavMain"]/div/div[1]/div[2]/div[1]/div/span/header/div/div[1]');
        // 封装返回+刷新逻辑
        const backAndRefresh = () => {
            if (backBtn) {
                backBtn.click();
                // 延迟0.5秒刷新（确保返回操作生效，可根据页面加载速度调整）
                setTimeout(() => {
                    console.log('返回后刷新页面，重新获取课程列表');
                    window.location.reload();
                }, 500);
            } else {
                console.log('返回按钮不存在，直接刷新页面');
                window.location.reload();
            }
        };

        // 核心判断：按钮存在但禁用 → 点击返回；按钮存在且可用 → 点击下一节；按钮不存在 → 点击返回
        if (popupBtn) {
            // 检查class是否包含disabled（兼容空格分隔的class列表）
            const isDisabled = popupBtn.className.includes('disabled') || popupBtn.classList.contains('disabled');
            if (isDisabled) {
                console.log('下一节按钮已禁用，返回上一级');
                backAndRefresh(); // 可选链防按钮不存在报错
            } else {
                console.log('点击下一节.');
                popupBtn.click();
            }
        } else {
            console.log('没有下一节，返回上一级');
            backAndRefresh(); // 可选链防按钮不存在报错
        }
    }

    // 判断元素是否可见
    function isElementVisible(el) {
        return !!el && el.offsetHeight > 0 && el.offsetWidth > 0 && el.offsetParent !== null;
    }

    // 在线检测（弹窗处理）
    function detectionOnline() {
        const date = new Date();
        let modal = getElementByXPath('//*[@id="yxtBizNavMain"]/div/div[1]/div[2]/div[3]/div/div/div/div[3]/button');
        console.info(date.toLocaleString() + ' 检测是否有弹窗...');
        if (!modal || !isElementVisible(modal)) {
            return;
        }
        if (modal) {
            console.debug('检测在线：点击按钮 -> ' + (modal.value || modal.innerText || '按钮'));
            modal.click();
        } else {
            console.error('检测在线：未找到继续学习按钮，5秒后刷新当前页');
            setTimeout(function () {
                window.location.reload();
            }, 5 * 1000);
        }
    }

    // 返回上一级
    function returnToThePreviousLevel() {
        console.log("返回上一级");
        if (document.getElementById("divGoBack")?.style.display == 'none') {
            console.log("返回前一页");
            window.history.back();
        } else {
            console.log("返回上一级");
            unsafeWindow.GoBack?.(); // 兼容Vue全局方法
        }
    }

    // 检测完成（进度100%）
    function detectionComplete() {
        let remainingTime = 0;
        const timeNode = document.evaluate('//*[@id="yxtBizNavMain"]/div/div[1]/div[2]/div[1]/div/span/div/main/div[1]/div[1]/div[1]/div/div/div[1]/div/span[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (timeNode && timeNode.textContent) {
            const timeText = timeNode.textContent.trim();
            console.log('当前剩余时间: ' + timeText);

            // 分别匹配小时、分钟、秒（兼容无小时/无分钟场景）
            const hourMatch = timeText.match(/(\d+)小时/);
            const minuteMatch = timeText.match(/(\d+)分钟/);
            const secondMatch = timeText.match(/(\d+)秒/);

            // 转换为数字，无对应单位则为0
            const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
            const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
            const seconds = secondMatch ? parseInt(secondMatch[1]) : 0;

            // 换算为总秒数（小时×3600 + 分钟×60 + 秒）
            remainingTime = hours * 3600 + minutes * 60 + seconds;
        }

        console.log('当前剩余进度(秒): ' + remainingTime);
        // 剩余时间≤0 表示学习完成，执行下一节/返回逻辑
        if (remainingTime <= 0) {
            console.log('学习完成（进度100%/剩余时间为0）');
            setNextKng();
        }
    }

    // 检测播放状态
    function detectPlaybackStatus() {
        let myPlayer = document.getElementById('videocontainer-vjs');
        if (!myPlayer) {
            console.log('未找到视频播放器，尝试点击播放按钮唤醒...');
            const playBtn1 = document.evaluate("//*[@id=\"yxtBizNavMain\"]/div/div[1]/div[2]/div[1]/div/span/div/main/div[1]/div[1]/div[1]/div/div/div[2]/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (playBtn1) {
                playBtn1.click();
                console.log('已点击第一个播放按钮' + new Date().toLocaleString());
                setTimeout(detectPlaybackStatus, 5000);
            } else {
                console.log('未找到播放按钮，请等待15秒钟');
            }
            return;
        } else {
            console.log('找到了播放器' + new Date().toLocaleString());
        }

        if (!myPlayer.paused) {
            myPlayer.playbackRate = 1;
            myPlayer.volume = 0;
            initVideoPauseTimes();
            console.log("播放中...");
        } else if (myPlayer.buffered.length > 0 && !myPlayer.paused) {
            console.log("缓冲中...刷新页面");
            setTimeout(function () {
                initVideoPauseTimes();
                window.location.reload();
            }, 1000);
        } else if (myPlayer.paused && !myPlayer.ended) {
            console.log("暂停啦...执行播放方法...");
            myPlayer.play();
            let videoPauseTimes = getVideoPauseTimes();
            console.info('视频暂停次数：' + videoPauseTimes);
            videoPauseTimesInc();
            if (videoPauseTimes > 5) {
                console.log("暂停次数过多，自动刷新页面");
                initVideoPauseTimes();
                window.location.reload();
            }
        } else if (myPlayer.ended) {
            console.log('播放完成！！！');
        } else {
            console.log("未知状态（paused=" + myPlayer.paused + ", ended=" + myPlayer.ended + "），5秒后刷新");
            setTimeout(() => window.location.reload(), 5000);
        }
    }

    // 视频暂停次数相关
    function initVideoPauseTimes() {
        localStorage.setItem(NUMBER_OF_VIDEO_PLAYBACK_PAUSES, 0)
    }
    function getVideoPauseTimes() {
        return Number(localStorage.getItem(NUMBER_OF_VIDEO_PLAYBACK_PAUSES) || 0);
    }
    function videoPauseTimesInc() {
        localStorage.setItem(NUMBER_OF_VIDEO_PLAYBACK_PAUSES, Number(getVideoPauseTimes()) + 1);
    }

    // 获取URL参数
    function getQueryString(name) {
        var url = window.location.href;
        var params = url.split('?')[1]?.split('&') || [];
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param[0] === name) {
                return param[1];
            }
        }
        return null;
    }

    // ========== 启动脚本 ==========
    // 等待DOM加载完成后初始化路由监听
    // ========== 启动脚本（修正版） ==========
    function onDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }
    // 确保DOM加载完成后初始化路由监听（兼容已加载/未加载）
    onDOMReady(initRouteListener);

})();