// ==UserScript==
// @name         HNJSWLXY视频自动播放脚本（完整版）
// @namespace    http://tampermonkey.net/
// @version      4.0.2
// @description  完整版
// @author       MHH
// @match        https://www.hnjswlxy.cn/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554862/HNJSWLXY%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E5%AE%8C%E6%95%B4%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554862/HNJSWLXY%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E5%AE%8C%E6%95%B4%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 日志函数
    function log(message) {
        console.log(`[自动播放脚本] ${message}`);
    }

    // 当前页面类型判断
    function isCourseStudyPage() {
        return window.location.href.includes('/courseCenter/trainStudy');
    }

    function isMyLearningPage() {
        return window.location.href.includes('/personalCenter/myLeaning');
    }

    // ==============================
    // 🎥 视频学习页核心逻辑（提取为独立函数，可被多次调用）
    // ==============================
    function runCourseStudyLogic() {
        if (window.__hnjswlxyAutoPlayInitialized) {
            log('视频页脚本已初始化，跳过重复执行');
            return;
        }

        log('开始初始化课程学习页面脚本');

        // 获取视频播放进度
        function getVideoProgress() {
            const video = document.querySelector('video');
            if (video && !isNaN(video.duration) && video.duration > 0) {
                return Math.min(video.currentTime / video.duration, 1);
            }
            return 0;
        }

        // 递归展开所有未展开的文件夹
        function expandAllFoldersRecursively(attempt = 1) {
            log(`第 ${attempt} 次尝试展开文件夹`);
            const unexpandedFolders = document.querySelectorAll('.ant-menu-submenu:not(.ant-menu-submenu-open) .ant-menu-submenu-title');
            if (unexpandedFolders.length === 0) {
                log('所有文件夹都已展开');
                return;
            }
            log(`找到 ${unexpandedFolders.length} 个未展开的文件夹`);
            unexpandedFolders.forEach(title => {
                try {
                    title.click();
                    log(`展开文件夹: ${title.querySelector('p')?.textContent || '未知'}`);
                } catch (error) {
                    log(`展开文件夹失败: ${error.message}`);
                }
            });
            if (attempt < 5) {
                setTimeout(() => expandAllFoldersRecursively(attempt + 1), 2000);
            } else {
                log('已达到最大尝试次数，停止展开');
            }
        }

        // 获取所有可播放的视频项
        function getAllPlayableVideos() {
            const videoItems = document.querySelectorAll('.ant-menu-item');
            const playableVideos = [];
            videoItems.forEach(item => {
                const pElement = item.querySelector('p');
                const isCompleted = item.querySelector('.icon-yiwancheng') !== null;
                if (pElement && !isCompleted) {
                    playableVideos.push(item);
                }
            });
            log(`找到 ${playableVideos.length} 个可播放视频`);
            return playableVideos;
        }

        // 获取当前播放的视频项
        function getCurrentVideoItem() {
            const selectedItem = document.querySelector('.ant-menu-item-selected');
            if (selectedItem) {
                const text = selectedItem.querySelector('p')?.textContent || '未知';
                log(`找到当前选中的视频: ${text}`);
                return selectedItem;
            }
            return null;
        }

        // 获取下一个可播放视频
        function getNextPlayableVideo() {
            const playableVideos = getAllPlayableVideos();
            const currentVideo = getCurrentVideoItem();
            if (playableVideos.length === 0) {
                log('没有找到可播放的视频，课程已完成');
                return null;
            }
            if (!currentVideo) {
                log('当前没有选中的视频，选择第一个可播放视频');
                return playableVideos[0];
            }
            const currentIndex = playableVideos.indexOf(currentVideo);
            log(`当前视频在可播放列表中的索引: ${currentIndex}`);
            if (currentIndex === -1) {
                log('当前视频不在可播放列表中，选择第一个');
                return playableVideos[0];
            }
            const nextIndex = currentIndex + 1;
            if (nextIndex >= playableVideos.length) {
                log('已经是最后一个可播放视频，准备跳转到课程页面');
                return null;
            }
            const nextVideo = playableVideos[nextIndex];
            const text = nextVideo.querySelector('p')?.textContent || '未知';
            log(`下一个视频: ${text}`);
            return nextVideo;
        }

        // 等待视频加载
        function waitForVideo(timeout = 10000) {
            return new Promise((resolve) => {
                const startTime = Date.now();
                function checkVideo() {
                    const video = document.querySelector('video');
                    if (video && !isNaN(video.duration) && video.duration > 0) {
                        log('视频已加载');
                        resolve(video);
                        return;
                    }
                    if (Date.now() - startTime > timeout) {
                        log('等待视频加载超时');
                        resolve(null);
                        return;
                    }
                    setTimeout(checkVideo, 500);
                }
                checkVideo();
            });
        }

        // 设置视频静音
        function setVideoMuted() {
            const video = document.querySelector('video');
            if (video) {
                video.muted = true;
                log('视频已设置为静音');
            }
        }

        // 确保视频播放
        async function ensureVideoPlay() {
            log('开始确保视频播放');
            const video = await waitForVideo();
            if (!video) {
                log('未找到视频元素');
                return;
            }
            video.muted = true;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    log('自动播放失败，尝试点击播放按钮');
                    const playBtn = document.querySelector('.prism-play-btn, .play-btn, button');
                    if (playBtn) playBtn.click();
                });
            }
            setTimeout(() => {
                if (video.paused) {
                    log('视频仍处于暂停状态，再次尝试播放');
                    const playBtn = document.querySelector('.prism-play-btn, .play-btn, button');
                    if (playBtn) playBtn.click();
                }
            }, 2000);
        }

        // 点击下一个视频
        function clickNextVideo() {
            log('准备点击下一个视频');
            const nextVideo = getNextPlayableVideo();
            if (!nextVideo) {
                log('没有下一个可播放视频，准备跳转到课程页面');
                setTimeout(() => {
                    window.location.href = 'https://www.hnjswlxy.cn/personalCenter/myLeaning';
                }, 2000);
                return false;
            }
            const text = nextVideo.querySelector('p')?.textContent || '未知';
            log(`点击视频: ${text}`);
            try {
                nextVideo.click();
                log('点击视频成功');
                return true;
            } catch (error) {
                log(`点击视频失败: ${error.message}`);
                return false;
            }
        }

        // 主监控函数
        function monitorVideo() {
            const progress = getVideoProgress();
            log(`视频进度: ${(progress * 100).toFixed(1)}%`);
            if (progress >= 0.98) {
                log('视频播放完成');
                setTimeout(() => {
                    if (clickNextVideo()) {
                        log('视频切换成功');
                        setTimeout(() => ensureVideoPlay(), 5000);
                    } else {
                        log('视频切换失败或课程已完成，已跳转到课程页面');
                    }
                }, 1000);
            }
        }

        // 初始化流程
        expandAllFoldersRecursively();
        setTimeout(() => {
            expandAllFoldersRecursively(1);
            setTimeout(() => {
                setInterval(monitorVideo, 3000);
                setTimeout(setVideoMuted, 1000);
                setTimeout(ensureVideoPlay, 2000);
                log('课程学习页面脚本已启动');
                window.__hnjswlxyAutoPlayInitialized = true;
            }, 5000);
        }, 5000);
    }

    // 在课程学习页面：立即运行
    if (isCourseStudyPage()) {
        runCourseStudyLogic();
    }

    // 在我的学习页面的逻辑
    else if (isMyLearningPage()) {
        log('检测到课程页面，启动课程选择逻辑');

        function findAndClickUnfinishedCourse() {
            log('开始查找未完成的课程');
            const unfinishedTags = document.querySelectorAll('.ant-tag[style*="rgb(159, 159, 159)"]');
            if (unfinishedTags.length > 0) {
                const unfinishedRow = unfinishedTags[0].closest('.ant-table-row');
                if (unfinishedRow) {
                    const courseP = unfinishedRow.querySelector('td:first-child p');
                    if (courseP) {
                        const courseName = courseP.textContent;
                        log(`找到未完成课程: ${courseName}`);
                        try {
                            courseP.click();
                            log(`已点击课程: ${courseName}`);
                            return true;
                        } catch (error) {
                            log(`点击课程失败: ${error.message}`);
                            return false;
                        }
                    }
                }
            } else {
                log('当前页面没有找到未完成的课程');
                const nextPageBtn = document.querySelector('.ant-pagination-next:not(.ant-pagination-disabled)');
                if (nextPageBtn) {
                    log('找到下一页按钮，准备翻页');
                    try {
                        nextPageBtn.querySelector('button').click();
                        log('已点击下一页');
                        setTimeout(() => findAndClickUnfinishedCourse(), 2000);
                        return true;
                    } catch (error) {
                        log(`翻页失败: ${error.message}`);
                        return false;
                    }
                } else {
                    log('没有更多页面或下一页按钮不可用');
                    return false;
                }
            }
            return false;
        }

        function initializeLearningPage() {
            log('开始初始化课程页面');
            setTimeout(() => {
                if (!findAndClickUnfinishedCourse()) {
                    log('未找到可学习的课程');
                }
            }, 2000);
        }

        initializeLearningPage();
    }

    // ==============================
    // 🛠️ SPA 路由监听器（安全调用 runCourseStudyLogic）
    // ==============================
    (function () {
        let lastUrl = location.href;

        function handleRouteChange() {
            const currentUrl = location.href;
            if (currentUrl === lastUrl) return;
            lastUrl = currentUrl;

            if (currentUrl.includes('/courseCenter/trainStudy') && !currentUrl.includes('/personalCenter/myLeaning')) {
                // 等待页面内容加载
                setTimeout(() => {
                    if (document.querySelector('video') || document.querySelector('.ant-menu-item')) {
                        // 安全调用——因为 runCourseStudyLogic 在全局闭包内，此处可访问
                        runCourseStudyLogic();
                    }
                }, 1500);
            }
        }

        const originalPush = history.pushState;
        const originalReplace = history.replaceState;

        history.pushState = function () {
            originalPush.apply(this, arguments);
            handleRouteChange();
        };

        history.replaceState = function () {
            originalReplace.apply(this, arguments);
            handleRouteChange();
        };

        // 初始检查（兼容直接打开视频页）
        if (isCourseStudyPage()) {
            handleRouteChange();
        }
    })();
})();