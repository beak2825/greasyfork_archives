// ==UserScript==
// @name        塔山学习助手
// @namespace    https://onlinenew.enetedu.com/
// @version      4.0
// @description  适用于网址是 https://onlinenew.enetedu.com/ 的网站自动刷课。功能包括：进入视频页面自动静音+2倍速播放，每5秒检测所有章节视频播放状态，准确识别[100%]完成标识，全部视频播放完毕后自动返回课程列表继续处理未完成课程。
// @author       Enter
// @match        https://onlinenew.enetedu.com/*/MyTrainCourse/ChoiceCourse*
// @match        https://onlinenew.enetedu.com/*/MyTrainCourse/OnlineCourse*
// @match        https://onlinenew.enetedu.com/*/MyTrainCourse/Index?newSearchFlag=true
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/rand2019/qggxjspx@a28d9a1bd37daa3d26d3b0b9c173df3f867f0c96/code/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556792/%E5%A1%94%E5%B1%B1%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556792/%E5%A1%94%E5%B1%B1%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/* global $ */

(function () {
    'use strict';

    // 检查当前页面类型
    function getCurrentPageType() {
        const url = window.location.href;
        if (url.includes('/MyTrainCourse/Index')) {
            return 'courseList'; // 课程列表页面
        } else if (url.includes('/MyTrainCourse/ChoiceCourse') || url.includes('/MyTrainCourse/OnlineCourse')) {
            return 'coursePlayer'; // 课程播放页面
        }
        return 'unknown';
    }

    // 检查是否为课程列表页面
    function isCourseListPage() {
        return document.getElementById('ullist') !== null;
    }

    // 获取所有课程链接
    function getAllCourseLinks() {
        const courseLinks = [];
        const courseItems = document.querySelectorAll('#ullist li');

        courseItems.forEach((item, index) => {
            const linkElement = item.querySelector('a[href*="/MyTrainCourse/ChoiceCourse?id="]');
            const isCompleted = item.innerHTML.includes('已学完') || item.innerHTML.includes('style="color:green;"');

            if (linkElement) {
                const href = linkElement.getAttribute('href');
                const courseId = href.match(/id=(\d+)/)?.[1];
                const courseTitle = linkElement.textContent.trim();

                courseLinks.push({
                    id: courseId,
                    title: courseTitle,
                    href: href,
                    isCompleted: isCompleted,
                    index: index,
                    element: item
                });
            }
        });

        return courseLinks;
    }

    // 找到第一个未完成的课程
    function findFirstUncompletedCourse() {
        const courses = getAllCourseLinks();
        return courses.find(course => !course.isCompleted);
    }

    // 处理课程列表页面
    function handleCourseListPage() {
        console.log('检测到课程列表页面，开始查找未完成课程...');

        // 等待一段时间确保页面完全加载
        setTimeout(() => {
            const uncompletedCourse = findFirstUncompletedCourse();

            if (uncompletedCourse) {
                console.log(`找到未完成的课程: ${uncompletedCourse.title} (ID: ${uncompletedCourse.id})`);
                console.log(`正在进入课程学习页面...`);

                // 构造完整URL并跳转
                const baseUrl = window.location.origin;
                const courseUrl = baseUrl + uncompletedCourse.href;
                window.location.href = courseUrl;
            } else {
                console.log('所有课程都已完成，或者没有找到未完成的课程！');
                alert('所有课程都已完成！');
            }
        }, 3000); // 等待3秒确保页面完全加载
    }

    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }

    // 自动点击SweetAlert弹窗的确定按钮
    function autoClickSweetAlertConfirm() {
        // 方法1: 查找SweetAlert的确定按钮
        const sweetAlertConfirm = document.querySelector('.sweet-alert .sa-button-container .confirm');
        if (sweetAlertConfirm && sweetAlertConfirm.offsetParent !== null) {
            sweetAlertConfirm.click();
            console.log('自动点击SweetAlert确定按钮');
            return true;
        }

        // 方法2: 查找包含"确定"文本的按钮
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
            if (btn.textContent.trim() === '确定' && btn.offsetParent !== null) {
                btn.click();
                console.log('自动点击确定按钮');
                return true;
            }
        }

        // 方法3: 查找SweetAlert相关的其他可能选择器
        const sweetAlertBtn = document.querySelector('.sweet-alert button[tabindex="1"]');
        if (sweetAlertBtn && sweetAlertBtn.offsetParent !== null) {
            sweetAlertBtn.click();
            console.log('自动点击SweetAlert按钮');
            return true;
        }

        return false;
    }

    // 检测iframe内的弹窗
    function checkIframeAlert() {
        try {
            const iframe = document.querySelector('.classcenter-chapter1 iframe');
            if (iframe && iframe.contentDocument) {
                const iframeDoc = iframe.contentDocument;

                // 在iframe内查找确定按钮
                const confirmBtn = iframeDoc.querySelector('button');
                if (confirmBtn && confirmBtn.textContent.trim() === '确定' && confirmBtn.offsetParent !== null) {
                    confirmBtn.click();
                    console.log('自动点击iframe内确定按钮');
                    return true;
                }
            }
        } catch (e) {
            // 跨域限制，忽略错误
        }
        return false;
    }

    // 旧版本的 window.onload 已被合并到下方的新版本中

    // 静音和视频速度设置函数
    function setupVideoSettings(video) {
        if (video) {
            video.muted = true; // 静音
            video.playbackRate = 2.0; // 2倍速播放
            console.log('视频已设置为静音+2倍速播放');
        }
    }

    // 获取课程页面的所有章节及其完成状态
    function getChapterStatuses() {
        const chapters = [];
        $(".classcenter-chapter2 ul li").each(function () {
            const $li = $(this);

            // 优先从span标签读取进度（更准确）
            const $span = $li.find('span[id^="courseware_"]');
            const spanText = $span.length > 0 ? $span.text().trim() : '';

            // 检查是否包含[100%]标识
            const has100Percent = spanText.includes('[100%]') || $li.text().includes('[100%]');

            chapters.push({
                element: this,
                text: $li.text(),
                spanText: spanText,
                completed: has100Percent
            });
        });
        return chapters;
    }

    // 检查当前课程是否所有章节都已完成
    function isAllChaptersCompleted() {
        const chapters = getChapterStatuses();
        console.log(`检测到${chapters.length}个章节，状态:`, chapters.map(c => ({
            text: c.text,
            spanText: c.spanText,
            completed: c.completed
        })));

        // 如果所有章节都标记为[100%]，则认为完成
        return chapters.length > 0 && chapters.every(chapter => chapter.completed);
    }

    // 找到第一个未完成的章节
    function findFirstUncompletedChapter() {
        const chapters = getChapterStatuses();
        return chapters.find(chapter => !chapter.completed);
    }

    // 当单个课程播放完全部视频后，返回课程列表继续处理下一个课程
    function returnToCourseList() {
        console.log('当前课程已完成，正在返回课程列表页面...');

        // 构造课程列表页面URL
        const baseUrl = window.location.origin;
        const courseListUrl = baseUrl + '/yxnu/MyTrainCourse/Index?newSearchFlag=true';

        // 延迟返回，避免过快跳转
        setTimeout(() => {
            window.location.href = courseListUrl;
        }, 3000);
    }

    // 页面初始化函数
    function init() {
        console.log('用户脚本已加载 - 2025全国高校教师网络培训中心自动刷课工具');
        const pageType = getCurrentPageType();
        console.log(`检测到页面类型: ${pageType}`);

        if (pageType === 'courseList') {
            // 在课程列表页面，自动处理课程
            handleCourseListPage();
        }
    }

    // 页面加载完成后初始化
    window.onload = function () {
        init();

        // 如果当前是课程列表页面，不需要额外的页面加载事件处理
        // 如果当前是课程播放页面，保持原有的自动播放逻辑
        const pageType = getCurrentPageType();
        if (pageType === 'coursePlayer') {
            console.log('进入课程播放页面，启动视频自动播放功能...');

            // 等待5秒，确保页面的JavaScript已完成进度更新（AJAX请求）
            setTimeout(() => {
                console.log('页面初始化完成，开始检测章节状态...');

                // 对每个视频设置静音和2倍速
                const setupVideoSettings = () => {
                    const iframe = $(".classcenter-chapter1 iframe");
                    if (iframe.length > 0) {
                        const videos = iframe.contents().find("video");
                        if (videos.length > 0) {
                            videos.each(function () {
                                this.muted = true; // 静音
                                this.playbackRate = 2.0; // 2倍速播放
                                console.log('视频已设置为静音+2倍速播放');
                            });
                        }
                    }
                };

                // 首次设置视频参数
                setupVideoSettings();

                // 首次检查是否所有章节已完成（可能刷新页面进入的已完成课程）
                setTimeout(() => {
                    if (isAllChaptersCompleted()) {
                        console.log('检测到所有章节已完成[100%]，准备返回课程列表...');
                        returnToCourseList();
                        return;
                    }
                }, 3000);

                // 每5秒检测所有章节是否完成
                let statusChecker = setInterval(() => {
                    if (isAllChaptersCompleted()) {
                        console.log('检测到所有章节已完成[100%]，准备返回课程列表...');
                        clearInterval(statusChecker);
                        clearInterval(videoPlayInterval);
                        clearInterval(alertCheckInterval);
                        returnToCourseList();
                    }
                }, 5000);

                // 原有的自动弹窗检测逻辑（每秒检测）
                const alertCheckInterval = setInterval(function () {
                    autoClickSweetAlertConfirm();
                    checkIframeAlert();
                }, 1000);

                // 视频播放和问答处理逻辑（每5秒）
                let videoPlayInterval = setInterval(function () {
                    const iframe = $(".classcenter-chapter1 iframe");

                    // 确保视频设置正确（静音+2倍速）
                    if (iframe.length > 0) {
                        const videos = iframe.contents().find("video");
                        videos.each(function () {
                            if (!this.muted) this.muted = true;
                            if (this.playbackRate !== 2.0) this.playbackRate = 2.0;

                            // 保持播放状态
                            if (this.paused) {
                                this.play();
                            }
                        });

                        // 检测问答弹窗
                        if (iframe.contents().find(".layui-layer-content iframe").length > 0) {
                            setTimeout(function () {
                                iframe.contents().find(".layui-layer-content iframe").contents().find("#questionid~div button").trigger("click");
                                console.log('检测到问答弹窗，自动点击确定');
                            }, randomNum(15, 40) * 100);
                        }

                        // 尝试播放视频
                        if (videos.length > 0) {
                            videos.trigger("play");
                        }

                        // 检测当前章节是否已经100%，是的话跳到下一个未完成的
                        const $currentChapter = $(".classcenter-chapter2 ul li").filter(function () {
                            const bgColor = $(this).css("background-color");
                            return bgColor === "rgb(204, 197, 197)" || bgColor === "#ccc5c5";
                        });

                        if ($currentChapter.length > 0) {
                            const currentSpanText = $currentChapter.find("span").text().trim();
                            console.log('当前播放章节进度:', currentSpanText);

                            if (currentSpanText === "[100%]") {
                                console.log('当前章节已100%，查找下一个未完成的章节...');

                                let foundNext = false;
                                $(".classcenter-chapter2 ul li").each(function () {
                                    const spanText = $(this).find("span").text().trim();
                                    if (spanText !== "[100%]") {
                                        foundNext = true;
                                        console.log('找到未完成章节，切换:', spanText);
                                        $(this).trigger("click");

                                        setTimeout(() => {
                                            setupVideoSettings();
                                        }, 2000);
                                        return false;
                                    }
                                });

                                if (!foundNext) {
                                    console.log('所有章节已完成，准备返回课程列表');
                                    clearInterval(statusChecker);
                                    clearInterval(videoPlayInterval);
                                    clearInterval(alertCheckInterval);
                                    returnToCourseList();
                                }
                            }
                        }
                    }
                }, 5000);

                // 不再需要timeupdate事件监听，已在上面的定时器中处理

            }, 3000);
        }
    };
})();
