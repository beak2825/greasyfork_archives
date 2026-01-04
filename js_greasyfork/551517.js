// ==UserScript==
// @name         浙江省全民终身学习公共服务平台自动播放
// @namespace    https://pages.zaizhexue.top
// @version      1.0
// @description  浙江省全民终身学习公共服务平台自动播放脚本
// @author       m0zey
// @match        https://*.zjlll.cn/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/551517/%E6%B5%99%E6%B1%9F%E7%9C%81%E5%85%A8%E6%B0%91%E7%BB%88%E8%BA%AB%E5%AD%A6%E4%B9%A0%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/551517/%E6%B5%99%E6%B1%9F%E7%9C%81%E5%85%A8%E6%B0%91%E7%BB%88%E8%BA%AB%E5%AD%A6%E4%B9%A0%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }
    console.log('脚本已加载');


    // 创建播放按钮
    function createPlayButton() {
        const playButton = document.createElement('button');
        playButton.innerHTML = '<i class="el-icon-video-play"></i> 自动播放未完成章节';
        playButton.style.cssText = `
            background: #409EFF;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        `;
        
        // 添加悬停效果
        playButton.addEventListener('mouseenter', function() {
            this.style.background = '#66b1ff';
        });
        
        playButton.addEventListener('mouseleave', function() {
            this.style.background = '#409EFF';
        });
        
        // 添加点击事件
        playButton.addEventListener('click', function() {
            startPlaying();
        });
        
        return playButton;
    }

    // 创建停止按钮
    function createStopButton() {
        const stopButton = document.createElement('button');
        stopButton.innerHTML = '<i class="el-icon-video-pause"></i> 停止自动播放';
        stopButton.style.cssText = `
            background: #F56C6C;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
            font-size: 14px;
            display: none;
            align-items: center;
            gap: 5px;
        `;
        
        // 添加悬停效果
        stopButton.addEventListener('mouseenter', function() {
            this.style.background = '#f78989';
        });
        
        stopButton.addEventListener('mouseleave', function() {
            this.style.background = '#F56C6C';
        });
        
        // 添加点击事件
        stopButton.addEventListener('click', function() {
            stopAutoPlaying();
        });
        
        return stopButton;
    }

    // 创建状态显示元素
    function createStatusDisplay() {
        const display = document.createElement('div');
        display.style.cssText = `
            background: rgba(74, 144, 226, 0.1);
            color: #4a90e2;
            border: 1px solid rgba(74, 144, 226, 0.3);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            margin-right: 10px;
            display: none;
            align-items: center;
            gap: 6px;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        `;
        display.textContent = '准备播放...';
        return display;
    }

    // 创建遮罩层
    function createOverlayMask() {
        const mask = document.createElement('div');
        mask.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            z-index: 9998;
            display: none;
            pointer-events: auto;
        `;
        
        // 阻止所有点击事件
        mask.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true);
        
        return mask;
    }

    // 显示遮罩层
    function showOverlayMask() {
        if (overlayMask) {
            overlayMask.style.display = 'block';
            // 确保停止按钮在遮罩层之上
            if (stopButton) {
                stopButton.style.position = 'relative';
                stopButton.style.zIndex = '9999';
            }
        }
    }

    // 隐藏遮罩层
    function hideOverlayMask() {
        if (overlayMask) {
            overlayMask.style.display = 'none';
            // 恢复停止按钮的样式
            if (stopButton) {
                stopButton.style.position = '';
                stopButton.style.zIndex = '';
            }
        }
    }

    // 自动播放状态
    let isAutoPlaying = false;
    let currentChapterIndex = 0;
    let unfinishedChapters = [];
    let playButton, stopButton, statusDisplay, overlayMask;

    // 停止自动播放
    function stopAutoPlaying() {
        console.log('停止自动播放');
        isAutoPlaying = false;
        currentChapterIndex = 0;
        unfinishedChapters = [];
        
        // 停止当前播放的视频
        const video = document.querySelector('video');
        if (video) {
            video.pause();
        }
        
        // 切换按钮显示状态
        if (playButton && stopButton) {
            playButton.style.display = 'inline-flex';
            stopButton.style.display = 'none';
        }
        
        // 隐藏状态显示
        if (statusDisplay) {
            statusDisplay.style.display = 'none';
        }
        
        // 隐藏遮罩层
        hideOverlayMask();
        
        alert('已停止自动播放');
    }

    // 获取未完成的章节列表
    function getUnfinishedChapters() {
        const chapterList = document.querySelectorAll('.sub-chapter-list .chapter');
        const unfinished = [];
        
        chapterList.forEach((chapter, index) => {
            const rateElement = chapter.querySelector('.rate');
            if (rateElement) {
                const rate = rateElement.textContent.trim();
                // 如果进度不是100%，则添加到未完成列表
                if (rate !== '100%') {
                    unfinished.push({
                        element: chapter,
                        index: index,
                        rate: rate,
                        name: chapter.querySelector('.chapter-name')?.textContent?.trim() || '未知章节'
                    });
                }
            }
        });
        
        return unfinished;
    }

    // 点击章节
    function clickChapter(chapter) {
        console.log(`点击章节: ${chapter.name} (进度: ${chapter.rate})`);
        chapter.element.click();
    }

    // 等待视频加载并播放
    function waitForVideoAndPlay() {
        return new Promise((resolve) => {
            const checkVideo = () => {
                const video = document.querySelector('video');
                if (video && video.readyState >= 2) { // 视频已加载足够数据
                    console.log('视频已加载，开始播放');
                    video.play().then(() => {
                        console.log('视频开始播放');
                        // 监听视频结束事件
                        video.addEventListener('ended', () => {
                            console.log('视频播放完成');
                            resolve();
                        }, { once: true });
                        

                    }).catch(err => {
                        console.error('视频播放失败:', err);
                        resolve();
                    });
                } else {
                    setTimeout(checkVideo, 500);
                }
            };
            checkVideo();
        });
    }

    // 自动播放下一个章节
    async function playNextChapter() {
        // 检查是否被停止
        if (!isAutoPlaying) {
            console.log('自动播放已被停止');
            return;
        }
        
        if (currentChapterIndex >= unfinishedChapters.length) {
            console.log('所有未完成章节已播放完毕');
            isAutoPlaying = false;
            
            // 恢复按钮状态
            if (playButton && stopButton) {
                playButton.style.display = 'inline-flex';
                stopButton.style.display = 'none';
            }
            
            // 隐藏状态显示
            if (statusDisplay) {
                statusDisplay.style.display = 'none';
            }
            
            // 隐藏遮罩层
            hideOverlayMask();
            
            alert('🎉 所有未完成章节已播放完毕！');
            return;
        }

        const chapter = unfinishedChapters[currentChapterIndex];
        console.log(`开始播放第 ${currentChapterIndex + 1}/${unfinishedChapters.length} 个章节: ${chapter.name}`);
        
        // 更新状态显示
        if (statusDisplay) {
            statusDisplay.textContent = `正在播放: ${chapter.name} (${currentChapterIndex + 1}/${unfinishedChapters.length})`;
        }
        
        // 点击章节
        clickChapter(chapter);
        
        // 等待页面加载和视频播放完成
        await new Promise(resolve => setTimeout(resolve, 2000)); // 等待页面加载
        
        // 再次检查是否被停止
        if (!isAutoPlaying) {
            console.log('自动播放已被停止');
            return;
        }
        
        await waitForVideoAndPlay();
        
        // 再次检查是否被停止
        if (!isAutoPlaying) {
            console.log('自动播放已被停止');
            return;
        }
        
        // 播放下一个章节
        currentChapterIndex++;
        setTimeout(() => playNextChapter(), 1000); // 1秒后播放下一个
    }

    // 播放功能
    function startPlaying() {
        console.log('开始自动播放课程...');
        
        if (isAutoPlaying) {
            console.log('已在自动播放中，请勿重复点击');
            return;
        }
        
        // 获取未完成的章节
        unfinishedChapters = getUnfinishedChapters();
        
        if (unfinishedChapters.length === 0) {
            alert('🎉 所有章节都已完成！');
            return;
        }
        
        console.log(`找到 ${unfinishedChapters.length} 个未完成章节:`);
        unfinishedChapters.forEach((chapter, index) => {
            console.log(`${index + 1}. ${chapter.name} (${chapter.rate})`);
        });
        
        // 确认开始自动播放
        const confirmed = confirm(`找到 ${unfinishedChapters.length} 个未完成章节，是否开始自动播放？\n\n注意：\n- 请保持页面在前台\n- 播放过程中请勿操作页面\n- 可点击"停止自动播放"按钮随时停止`);
        
        if (confirmed) {
            isAutoPlaying = true;
            currentChapterIndex = 0;
            
            // 切换按钮显示状态
            if (playButton && stopButton) {
                playButton.style.display = 'none';
                stopButton.style.display = 'inline-flex';
            }
            
            // 显示状态显示
            if (statusDisplay) {
                statusDisplay.style.display = 'inline-flex';
                statusDisplay.textContent = '准备播放...';
            }
            
            // 显示遮罩层，禁用其他元素点击
            showOverlayMask();
            
            playNextChapter();
        }
    }

    // 插入按钮的函数
    function insertButtons() {
        // 查找study-t元素
        const studyElement = document.querySelector('.study-t');
        if (!studyElement) {
            console.log('未找到.study-t元素，可能不在课程页面');
            return false;
        }
        
        // 检查是否已经插入过按钮
        if (studyElement.querySelector('.auto-play-button')) {
            console.log('按钮已存在，跳过插入');
            return true;
        }
        
        console.log('找到study-t元素，准备插入按钮');
        
        // 创建遮罩层（如果还没有创建）
        if (!overlayMask) {
            overlayMask = createOverlayMask();
            document.body.appendChild(overlayMask);
        }
        
        // 创建状态显示
        statusDisplay = createStatusDisplay();
        
        // 创建播放按钮
        playButton = createPlayButton();
        playButton.classList.add('auto-play-button'); // 添加标识类
        
        // 创建停止按钮
        stopButton = createStopButton();
        stopButton.classList.add('auto-play-button'); // 添加标识类
        
        // 初始状态：显示播放按钮，隐藏停止按钮和状态显示
        stopButton.style.display = 'none';
        statusDisplay.style.display = 'none';
        
        // 找到返回按钮的父容器
        const backButton = studyElement.querySelector('a.back');
        if (backButton) {
            // 在返回按钮前插入状态显示、播放按钮和停止按钮
            backButton.parentNode.insertBefore(statusDisplay, backButton);
            backButton.parentNode.insertBefore(playButton, backButton);
            backButton.parentNode.insertBefore(stopButton, backButton);
            console.log('状态显示、播放按钮和停止按钮已成功插入');
        } else {
            // 如果没有找到返回按钮，直接添加到study-t容器末尾
            studyElement.appendChild(statusDisplay);
            studyElement.appendChild(playButton);
            studyElement.appendChild(stopButton);
            console.log('状态显示、播放按钮和停止按钮已添加到容器末尾');
        }
        
        return true;
    }

    // 监听路由变化
    function observeRouteChanges() {
        let currentUrl = location.href;
        
        // 监听 popstate 事件（浏览器前进后退）
        window.addEventListener('popstate', function() {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                console.log('检测到路由变化（popstate）:', currentUrl);
                setTimeout(() => {
                    insertButtons();
                }, 1000);
            }
        });
        
        // 监听 pushstate 和 replacestate（程序化路由变化）
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                console.log('检测到路由变化（pushState）:', currentUrl);
                setTimeout(() => {
                    insertButtons();
                }, 1000);
            }
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                console.log('检测到路由变化（replaceState）:', currentUrl);
                setTimeout(() => {
                    insertButtons();
                }, 1000);
            }
        };
        
        // 使用 MutationObserver 监听 DOM 变化
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查是否有新的 study-t 元素被添加
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // 元素节点
                            if (node.classList && node.classList.contains('study-t') || 
                                node.querySelector && node.querySelector('.study-t')) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
            });
            
            if (shouldCheck) {
                console.log('检测到DOM变化，可能有新的课程页面');
                setTimeout(() => {
                    insertButtons();
                }, 500);
            }
        });
        
        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 等待一段时间确保页面完全渲染
        setTimeout(() => {
            insertButtons();
        }, 1000);
        
        // 开始监听路由变化
        observeRouteChanges();
    });
    
    // 如果页面已经加载完成，立即执行
    if (document.readyState === 'complete') {
        setTimeout(() => {
            insertButtons();
            observeRouteChanges();
        }, 1000);
    }

})();