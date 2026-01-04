// ==UserScript==
// @name         烟草网络学院完整循环学习助手 v8.0（目录扫描+视频播放+循环返回+专题学习）
// @namespace    http://tampermonkey.net/
// @version      8.0.0
// @description  完整的学习循环：目录页扫描必修课程，跳转播放视频，完成后返回目录继续下一个，直到全部为复习状态
// @author       Copilot & Assistant
// @match        https://mooc.ctt.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550004/%E7%83%9F%E8%8D%89%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%AE%8C%E6%95%B4%E5%BE%AA%E7%8E%AF%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20v80%EF%BC%88%E7%9B%AE%E5%BD%95%E6%89%AB%E6%8F%8F%2B%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%2B%E5%BE%AA%E7%8E%AF%E8%BF%94%E5%9B%9E%2B%E4%B8%93%E9%A2%98%E5%AD%A6%E4%B9%A0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550004/%E7%83%9F%E8%8D%89%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%AE%8C%E6%95%B4%E5%BE%AA%E7%8E%AF%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20v80%EF%BC%88%E7%9B%AE%E5%BD%95%E6%89%AB%E6%8F%8F%2B%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%2B%E5%BE%AA%E7%8E%AF%E8%BF%94%E5%9B%9E%2B%E4%B8%93%E9%A2%98%E5%AD%A6%E4%B9%A0%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const catalogUrl = "https://mooc.ctt.cn/#/study/subject/detail/9af3bed1-a304-42c5-b627-fd032ffa5233";
    const maxRetries = 15;
    let attempt = 0;
    let isProcessing = false;
    let currentOperation = '';
    let pageLoadTimeout = null;
    let videoCheckInterval = null;
    let progressCheckInterval = null;
    let completedCourses = new Set(); // 记录已完成的课程
    let currentCourseTitle = ''; // 当前学习的课程标题

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

        window.addEventListener('beforeunload', () => {
            clearInterval(mouseInterval);
        });
    }

    // 检查课程是否为复习状态
    function isCourseReviewed(item) {
        const itemText = item.textContent;
        return itemText.includes('复习') || 
               itemText.includes('已完成') || 
               itemText.includes('已学完') ||
               itemText.includes('100%') ||
               item.querySelector('.completed') ||
               item.classList.contains('completed');
    }

    // 生成课程唯一标识
    function getCourseId(item) {
        const titleElement = item.querySelector('.title, .name, h3, h4') || item;
        const title = titleElement.textContent.replace(/\[必修\]|\[选修\]/g, '').trim();
        return title.substring(0, 50);
    }

    // 获取课程状态列表
    async function getStatusList() {
        try {
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
                    log('多次尝试后仍未找到状态元素，返回目录页', 'error');
                    jumpToCatalog();
                }
                return;
            }

            if (allReviewed(statusList)) {
                log(`课程 ${currentCourseTitle} 所有节次已复习，返回目录页`, 'success');
                completedCourses.add(currentCourseTitle);
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
                    log('多次尝试后仍未识别到复习状态，强制返回目录页', 'warn');
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
        currentCourseTitle = '';
        
        log('返回目录页继续扫描其他必修课程...');
        window.location.href = catalogUrl;
        
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
            
            const playBtn = await waitForElement('.vjs-play-control', 8000);
            
            if (playBtn && playBtn.title === '播放') {
                playBtn.click();
                log('已点击播放按钮', 'success');
            }

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

        const handleVideoEnd = () => {
            log(`视频播放结束，检查课程 ${currentCourseTitle} 状态`, 'success');
            clearInterval(progressCheckInterval);
            progressCheckInterval = null;
            
            attempt = 0;
            isProcessing = false;
            
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
        const maxChecks = 20;
        
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
                log('视频状态检查超时，尝试直接播放', 'warn');
                waitAndPlayVideo();
            }
        }, 1000);
    }

    // 扫描目录中的必修课程
    async function scanCatalogForRequired() {
        if (isProcessing) {
            log('已有处理进程在运行，跳过目录扫描', 'warn');
            return;
        }

        currentOperation = '扫描目录必修课程';
        isProcessing = true;

        try {
            // 限制只在目标页面执行
            if (!location.href.includes('study/subject/detail/9af3bed1-a304-42c5-b627-fd032ffa5233')) {
                log('不在目标目录页面，跳过扫描');
                isProcessing = false;
                return;
            }

            log('等待目录页面加载...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            const items = await waitForElements('.item.current-hover, .subject-catalog .item, .course-item', 1, 10000);
            
            if (items.length === 0) {
                log('未找到课程项目元素', 'warn');
                isProcessing = false;
                return;
            }

            log(`找到 ${items.length} 个课程项目`);
            
            let foundUncompletedRequired = false;

            for (let item of items) {
                const itemText = item.textContent;
                const isRequired = itemText.includes('[必修]');
                
                if (!isRequired) {
                    continue; // 跳过非必修课程
                }

                const courseId = getCourseId(item);
                const isReviewed = isCourseReviewed(item);
                const alreadyCompleted = completedCourses.has(courseId);

                log(`必修课程: ${courseId} | 复习状态: ${isReviewed} | 已处理: ${alreadyCompleted}`);

                // 高亮显示必修课程
                if (isReviewed) {
                    item.style.border = '2px solid green';
                    item.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                } else {
                    item.style.border = '2px solid orange';
                    item.style.backgroundColor = 'rgba(255, 165, 0, 0.1)';
                }

                if (!isReviewed && !alreadyCompleted) {
                    log(`发现未完成的必修课程，准备进入: ${courseId}`, 'success');
                    currentCourseTitle = courseId;
                    
                    // 添加点击效果
                    item.style.transform = 'scale(0.98)';
                    item.style.transition = 'transform 0.2s';
                    
                    // 点击进入课程
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        detail: 1
                    });
                    
                    item.dispatchEvent(clickEvent);
                    
                    setTimeout(() => {
                        item.style.transform = 'scale(1)';
                    }, 200);
                    
                    log(`已点击进入课程: ${courseId}`, 'success');
                    foundUncompletedRequired = true;
                    
                    // 等待页面跳转
                    setTimeout(() => {
                        const currentUrl = location.href;
                        if (currentUrl.includes('course/detail') || currentUrl.includes('study/learn')) {
                            log('成功进入课程学习页面', 'success');
                        }
                    }, 3000);
                    
                    break; // 一次只处理一个课程
                }
            }

            if (!foundUncompletedRequired) {
                log('🎉 所有必修课程都已完成（复习状态）！', 'success');
                alert('🎉 恭喜！所有必修课程都已完成学习！');
            }

        } catch (error) {
            log(`扫描目录失败: ${error.message}`, 'error');
        } finally {
            isProcessing = false;
        }
    }

    // 主初始化函数
    async function init() {
        const url = window.location.href;
        log(`当前页面: ${url}`);
        log(`当前操作: ${currentOperation}`);

        clearAllTimers();
        isProcessing = false;
        attempt = 0;

        // 目录页面 - 扫描必修课程
        if (url.includes('study/subject/detail/9af3bed1-a304-42c5-b627-fd032ffa5233')) {
            log('检测到目录页面，开始扫描必修课程...');
            currentOperation = '处理目录页';
            
            setTimeout(() => {
                scanCatalogForRequired();
                simulateMouseActivity();
            }, 2000);
        }

        // 课程详情页面 - 播放视频
        if (url.includes('/course/detail/') || url.includes('/study/learn/')) {
            log('检测到课程详情页，开始视频学习...');
            currentOperation = '处理课程页';
            
            setTimeout(() => {
                waitAndCheckVideoStatus();
                waitAndPlayVideo();
                simulateMouseActivity();
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

    // 启动脚本
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