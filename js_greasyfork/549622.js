// ==UserScript==
// @name         烟草网络学院自动学习助手 v7.1.0（优化版 - 修复闪烁和错误）
// @namespace    http://tampermonkey.net/
// @version      7.1.0
// @description  自动识别未完成必修课程，支持分页跳转，进入详情页自动播放视频，静音处理，复习状态判断，播放完成后跳转目录页并继续查找播放，模拟鼠标活跃状态屏蔽挂机检测
// @author       Copilot & Assistant
// @match        https://mooc.ctt.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549622/%E7%83%9F%E8%8D%89%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20v710%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%20-%20%E4%BF%AE%E5%A4%8D%E9%97%AA%E7%83%81%E5%92%8C%E9%94%99%E8%AF%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549622/%E7%83%9F%E8%8D%89%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20v710%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%20-%20%E4%BF%AE%E5%A4%8D%E9%97%AA%E7%83%81%E5%92%8C%E9%94%99%E8%AF%AF%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const catalogUrl = "https://mooc.ctt.cn/#/train-new/class-detail/dd23b163-12f2-447d-b205-dc9ef453929f";
    const maxRetries = 15; // 增加重试次数
    let attempt = 0;
    let isProcessing = false; // 防止重复执行
    let currentOperation = ''; // 记录当前操作状态
    let pageLoadTimeout = null;
    let videoCheckInterval = null;
    let progressCheckInterval = null;

    // 日志函数
    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = {
            'info': '🟢',
            'warn': '⚠️',
            'error': '❌',
            'success': '✅'
        }[type] || '🟢';
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }

    // 清理所有定时器
    function clearAllTimers() {
        if (pageLoadTimeout) {
            clearTimeout(pageLoadTimeout);
            pageLoadTimeout = null;
        }
        if (videoCheckInterval) {
            clearInterval(videoCheckInterval);
            videoCheckInterval = null;
        }
        if (progressCheckInterval) {
            clearInterval(progressCheckInterval);
            progressCheckInterval = null;
        }
    }

    // 等待元素出现
    function waitForElement(selector, timeout = 10000, checkInterval = 500) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    reject(new Error(`元素 ${selector} 在 ${timeout}ms 内未找到`));
                    return;
                }

                setTimeout(check, checkInterval);
            };

            check();
        });
    }

    // 等待多个元素出现
    function waitForElements(selector, minCount = 1, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const check = () => {
                const elements = document.querySelectorAll(selector);
                if (elements.length >= minCount) {
                    resolve(elements);
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    reject(new Error(`至少 ${minCount} 个元素 ${selector} 在 ${timeout}ms 内未找到`));
                    return;
                }

                setTimeout(check, 500);
            };

            check();
        });
    }

    // 模拟鼠标活动
    function simulateMouseActivity() {
        const mouseInterval = setInterval(() => {
            try {
                const event = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: Math.floor(Math.random() * window.innerWidth),
                    clientY: Math.floor(Math.random() * window.innerHeight)
                });
                document.dispatchEvent(event);
                log('模拟鼠标移动以屏蔽挂机检测');
            } catch (error) {
                log(`鼠标模拟失败: ${error.message}`, 'error');
            }
        }, 180000); // 每三分钟触发一次

        // 页面卸载时清理定时器
        window.addEventListener('beforeunload', () => {
            clearInterval(mouseInterval);
        });
    }

    // 获取课程状态列表
    async function getStatusList() {
        try {
            // 等待状态元素加载完成
            await waitForElements("span[id^='D395finishStatus-']", 1, 8000);

            const statusSpans = Array.from(document.querySelectorAll("span[id^='D395finishStatus-']"));
            const statuses = statusSpans.map(span => span.textContent.trim());

            log(`第 ${attempt + 1} 次尝试识别状态：[${statuses.join(', ')}]`);
            return statuses;
        } catch (error) {
            log(`获取状态失败: ${error.message}`, 'error');
            return [];
        }
    }

    // 检查是否全部为复习状态
    function allReviewed(statusList) {
        return statusList.length > 0 && statusList.every(status => status === "复习");
    }

    // 处理课程状态检查
    async function tryProcess() {
        if (isProcessing) {
            log('已有处理进程在运行，跳过重复执行', 'warn');
            return;
        }

        isProcessing = true;
        currentOperation = '检查课程状态';

        try {
            const statusList = await getStatusList();

            if (statusList.length === 0) {
                attempt++;
                if (attempt < maxRetries) {
                    log(`未找到状态元素，${attempt}/${maxRetries} 次重试，2秒后再试...`, 'warn');
                    setTimeout(() => {
                        isProcessing = false;
                        tryProcess();
                    }, 2000);
                } else {
                    log('多次尝试后仍未找到状态元素，可能已完成所有课程', 'error');
                    jumpToCatalog();
                }
                return;
            }

            if (allReviewed(statusList)) {
                log('所有节次已复习，跳转目录页', 'success');
                jumpToCatalog();
            } else {
                attempt++;
                if (attempt < maxRetries) {
                    log(`未识别到全部复习状态，${attempt}/${maxRetries} 次重试，2秒后再试...`);
                    setTimeout(() => {
                        isProcessing = false;
                        tryProcess();
                    }, 2000);
                } else {
                    log('多次尝试后仍未识别到复习状态，强制跳转到目录页', 'warn');
                    jumpToCatalog();
                }
            }
        } catch (error) {
            log(`处理过程出错: ${error.message}`, 'error');
            isProcessing = false;
        }
    }

    // 跳转到目录页
    function jumpToCatalog() {
        clearAllTimers();
        isProcessing = false;
        attempt = 0;

        log('准备跳转到目录页...');
        window.location.href = catalogUrl;

        // 设置页面加载超时
        pageLoadTimeout = setTimeout(() => {
            log('页面加载超时，重新初始化', 'warn');
            init();
        }, 15000);
    }

    // 等待并播放视频
    async function waitAndPlayVideo() {
        if (isProcessing) return;

        currentOperation = '播放视频';

        try {
            log('等待视频控件加载...');

            // 等待播放按钮出现
            const playBtn = await waitForElement('.vjs-play-control', 8000);

            if (playBtn && playBtn.title === '播放') {
                playBtn.click();
                log('已点击播放按钮', 'success');
            }

            // 等待视频元素
            const videoEl = await waitForElement('video', 5000);

            if (videoEl) {
                videoEl.muted = true;
                log('已设置视频静音', 'success');
                monitorVideoProgress(videoEl);
            } else {
                log('未找到视频元素', 'warn');
            }

        } catch (error) {
            log(`视频播放设置失败: ${error.message}`, 'error');
            // 如果视频加载失败，等待一段时间后重试
            setTimeout(() => {
                if (!isProcessing) {
                    tryProcess();
                }
            }, 5000);
        }
    }

    // 监控视频播放进度
    function monitorVideoProgress(videoEl) {
        currentOperation = '监控视频进度';

        // 清理之前的进度检查
        if (progressCheckInterval) {
            clearInterval(progressCheckInterval);
        }

        progressCheckInterval = setInterval(() => {
            const currentTime = videoEl.currentTime;
            const duration = videoEl.duration;

            if (duration && !isNaN(duration) && duration > 0) {
                const progress = (currentTime / duration) * 100;
                log(`视频播放进度: ${progress.toFixed(1)}%`);

                if (currentTime / duration >= 0.98) {
                    log('视频播放接近完成，触发结束逻辑', 'success');
                    clearInterval(progressCheckInterval);
                    progressCheckInterval = null;
                    videoEl.dispatchEvent(new Event('ended'));
                }
            }
        }, 5000);

        // 监听视频结束事件
        const handleVideoEnd = () => {
            log('视频播放结束，检查课程状态', 'success');
            clearInterval(progressCheckInterval);
            progressCheckInterval = null;

            attempt = 0;
            isProcessing = false;

            // 延迟一下再处理，确保状态更新
            setTimeout(() => {
                tryProcess();
            }, 2000);
        };

        videoEl.addEventListener('ended', handleVideoEnd, { once: true });
    }

    // 检查视频状态
    async function checkVideoStatus() {
        currentOperation = '检查视频状态';

        try {
            log('等待视频状态元素加载...');
            const videoItems = await waitForElements('.video-status', 1, 8000);

            for (let item of videoItems) {
                const status = item.textContent.trim();
                if (status.includes('学习中')) {
                    log(`发现未完成视频，点击继续学习: ${status}`, 'success');
                    item.click();
                    return;
                }
            }

            log('当前课程全部为复习状态，返回目录页', 'success');
            setTimeout(() => {
                jumpToCatalog();
            }, 1000);

        } catch (error) {
            log(`检查视频状态失败: ${error.message}`, 'error');
            // 如果检查失败，等待后重试
            setTimeout(() => {
                jumpToCatalog();
            }, 3000);
        }
    }

    // 等待并检查视频状态
    function waitAndCheckVideoStatus() {
        if (videoCheckInterval) {
            clearInterval(videoCheckInterval);
        }

        let checkCount = 0;
        const maxChecks = 20; // 最多检查20次

        videoCheckInterval = setInterval(() => {
            checkCount++;
            const items = document.querySelectorAll('.video-status');

            if (items.length > 0) {
                clearInterval(videoCheckInterval);
                videoCheckInterval = null;
                checkVideoStatus();
            } else if (checkCount >= maxChecks) {
                clearInterval(videoCheckInterval);
                videoCheckInterval = null;
                log('视频状态检查超时，尝试其他方式', 'warn');
                // 如果找不到视频状态，直接尝试播放
                waitAndPlayVideo();
            }
        }, 1000);
    }

    // 点击下一页
    function clickNextPageByDataPage() {
        try {
            const currentPage = document.querySelector('.item.active[data-page]');
            const allPages = Array.from(document.querySelectorAll('.item[data-page]'));

            if (!currentPage) {
                log('未找到当前页码', 'warn');
                return;
            }

            const currentPageNum = parseInt(currentPage.getAttribute('data-page'));
            const nextPageItem = allPages.find(item =>
                parseInt(item.getAttribute('data-page')) === currentPageNum + 1
            );

            if (nextPageItem) {
                log(`跳转到第 ${nextPageItem.getAttribute('data-page')} 页`);
                nextPageItem.click();
                setTimeout(scanCourseListItems, 4000); // 增加等待时间
            } else {
                log('🎉 所有课程页已浏览完毕', 'success');
                alert('🎉 所有课程页已浏览完毕！');
            }
        } catch (error) {
            log(`页面跳转失败: ${error.message}`, 'error');
        }
    }

    // 扫描课程列表项
    async function scanCourseListItems() {
        currentOperation = '扫描课程列表';

        try {
            log('等待课程列表加载...');
            await waitForElements('li.list-item', 1, 10000);

            const courseItems = document.querySelectorAll('li.list-item');
            log(`找到 ${courseItems.length} 个课程项目`);

            for (let item of courseItems) {
                const isRequired = item.querySelector('.normal-chooseRequired')?.textContent.includes('必修');
                const statusElement = item.querySelector('.normal.pull-right');
                const statusText = statusElement ? statusElement.textContent.trim() : '';
                const isFinished = statusText.includes('已完成');
                const link = item.querySelector('a.normal[href*="course/detail"]')?.href;
                const title = item.querySelector('.normal-title')?.textContent.trim() || '未知课程';

                log(`课程: ${title} | 必修: ${isRequired} | 已完成: ${isFinished}`);

                if (isRequired && !isFinished && link) {
                    log(`进入未完成必修课程: ${title}`, 'success');
                    clearAllTimers();
                    window.location.href = link;
                    return;
                }
            }

            log('当前页所有必修课程已完成，跳转下一页继续扫描');
            clickNextPageByDataPage();

        } catch (error) {
            log(`扫描课程列表失败: ${error.message}`, 'error');
            // 扫描失败时的重试逻辑
            setTimeout(() => {
                scanCourseListItems();
            }, 3000);
        }
    }

    // 刷新并扫描课程
    async function refreshAndScanCourses() {
        currentOperation = '刷新课程列表';

        try {
            const unfinishedTab = document.querySelector('.tab-unfinished');
            if (unfinishedTab) {
                unfinishedTab.click();
                log('点击"未完成"标签，刷新课程列表');
                await new Promise(resolve => setTimeout(resolve, 2000)); // 等待刷新完成
            }

            scanCourseListItems();

        } catch (error) {
            log(`刷新课程列表失败: ${error.message}`, 'error');
        }
    }

    // 主初始化函数
    async function init() {
        const url = window.location.href;
        log(`当前页面: ${url}`);
        log(`当前操作: ${currentOperation}`);

        // 清理之前的定时器
        clearAllTimers();

        // 重置状态
        isProcessing = false;
        attempt = 0;

        if (url.includes('class-detail')) {
            log('检测到目录页面，开始处理...');
            currentOperation = '处理目录页';

            setTimeout(async () => {
                try {
                    await refreshAndScanCourses();
                    waitAndCheckVideoStatus();
                    waitAndPlayVideo();
                    simulateMouseActivity();
                } catch (error) {
                    log(`目录页处理失败: ${error.message}`, 'error');
                }
            }, 3000);
        }

        if (url.includes('/course/detail/')) {
            log('检测到课程详情页，开始处理...');
            currentOperation = '处理课程页';

            setTimeout(async () => {
                try {
                    waitAndCheckVideoStatus();
                    waitAndPlayVideo();
                    simulateMouseActivity();
                } catch (error) {
                    log(`课程页处理失败: ${error.message}`, 'error');
                }
            }, 4000);
        }
    }

    // 页面变化监听器
    let routeObserver;
    let lastUrl = window.location.href;

    function setupRouteObserver() {
        if (routeObserver) {
            routeObserver.disconnect();
        }

        routeObserver = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                log(`检测到页面变化: ${lastUrl} -> ${currentUrl}`);
                lastUrl = currentUrl;
                setTimeout(init, 1000);
            }
        });

        routeObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'id']
        });
    }

    // 页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            log('DOM加载完成，启动脚本');
            setupRouteObserver();
            init();
        });
    } else {
        log('页面已加载，立即启动脚本');
        setupRouteObserver();
        init();
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        log('页面卸载，清理资源');
        clearAllTimers();
        if (routeObserver) {
            routeObserver.disconnect();
        }
    });

})();