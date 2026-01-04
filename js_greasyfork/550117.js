// ==UserScript==
// @name         Linux.do随机帖子浏览
// @name:en      Browse random posts on Linux.do
// @name:zh-CN   Linux.do随机帖子浏览
// @namespace    https://greasyfork.org/zh-TW/users/1252908-eep
// @version      1.1.2
// @description  为 Linux.do 网站添加自动滚动功能，可缓慢滚动
// @description:en  Add auto-scroll functionality to Linux.do
// @description:zh-CN  为 Linux.do 网站添加自动滚动功能，可缓慢滚动 
// @author       EEP
// @license      MIT
// @match        https://linux.do/*
// @icon         https://linux.do/favicon.ico
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550117/Linuxdo%E9%9A%8F%E6%9C%BA%E5%B8%96%E5%AD%90%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/550117/Linuxdo%E9%9A%8F%E6%9C%BA%E5%B8%96%E5%AD%90%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==
// ==UserScript==
// @name         Linux.do随机帖子浏览器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  随机访问linux.do的帖子并自动滚动
// @author       You
// @match        https://linux.do/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // 检查是否在iframe中，如果是则不执行
    if (window.self !== window.top) {
        console.log('检测到iframe环境，脚本不会运行');
        return;
    }

    let isRunning = false;
    let currentTimeout = null;
    const MIN_TOPIC_ID = 800000; // 最小帖子ID
    const MAX_TOPIC_ID = 1000000; // 最大帖子ID范围
    
    // 创建控制按钮
    function createControlButton() {
        const button = document.createElement('button');
        button.id = 'auto-browser-btn';
        button.textContent = '开始浏览';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        
        button.addEventListener('click', toggleBrowsing);
        document.body.appendChild(button);
        return button;
    }

    // 切换浏览状态
    function toggleBrowsing() {
        const button = document.getElementById('auto-browser-btn');
        if (isRunning) {
            stopBrowsing();
            button.textContent = '开始浏览';
            button.style.backgroundColor = '#4CAF50';
        } else {
            startBrowsing();
            button.textContent = '停止浏览';
            button.style.backgroundColor = '#f44336';
        }
    }

    // 开始浏览
    function startBrowsing() {
        isRunning = true;
        saveRunningState(true); // 保存状态到localStorage
        console.log('开始自动浏览帖子...');
        visitRandomTopic();
    }

    // 停止浏览
    function stopBrowsing() {
        isRunning = false;
        saveRunningState(false); // 保存状态到localStorage
        if (currentTimeout) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }
        console.log('停止自动浏览');
    }

    // 生成随机帖子ID
    function generateRandomTopicId() {
        return Math.floor(Math.random() * (MAX_TOPIC_ID - MIN_TOPIC_ID + 1)) + MIN_TOPIC_ID;
    }

    // 检查帖子是否存在
    async function checkTopicExists(topicId) {
        try {
            const response = await fetch(`https://linux.do/t/topic/${topicId}`, {
                method: 'HEAD',
                cache: 'no-cache'
            });
            return response.ok;
        } catch (error) {
            console.log(`检查帖子 ${topicId} 时出错:`, error);
            return false;
        }
    }

    // 找到一个存在的随机帖子ID
    async function findValidTopicId(maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            const topicId = generateRandomTopicId();
            console.log(`正在检查帖子 ${topicId} (尝试 ${i + 1}/${maxAttempts})`);
            
            const exists = await checkTopicExists(topicId);
            if (exists) {
                console.log(`找到有效帖子ID: ${topicId}`);
                return topicId;
            }
            
            console.log(`帖子 ${topicId} 不存在`);
            
            // 如果不存在且不是最后一次尝试，等待5秒再继续
            if (i < maxAttempts - 1) {
                console.log('等待5秒后继续搜索...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                // 检查是否在等待期间停止了运行
                if (!isRunning) {
                    console.log('检测到停止信号，终止搜索');
                    return null;
                }
            }
        }
        
        // 如果都找不到，返回一个已知存在的帖子ID
        console.log('未找到有效帖子，使用默认帖子');
        return 969670;
    }

    // 访问随机帖子
    async function visitRandomTopic() {
        if (!isRunning) return;

        try {
            const topicId = await findValidTopicId();
            
            // 如果搜索过程中被停止了，直接返回
            if (!topicId || !isRunning) {
                console.log('搜索被中断或停止');
                return;
            }
            
            const url = `https://linux.do/t/topic/${topicId}`;
            console.log(`准备访问帖子: ${url}`);
            window.location.href = url;
            
        } catch (error) {
            console.error('访问帖子时出错:', error);
            // 出错时等待一段时间后继续
            if (isRunning) {
                currentTimeout = setTimeout(visitRandomTopic, 5000); // 出错也等5秒
            }
        }
    }

    // 滚动页面 - 缓慢滚动
    function scrollPage() {
        const scrollDistance = Math.floor(Math.random() * 200) + 400; // 400-600px
        console.log(`缓慢滚动页面 ${scrollDistance}px`);
        
        // 使用更慢的滚动实现
        smoothScrollTo(scrollDistance);
    }

    // 实现更缓慢的滚动效果
    function smoothScrollTo(distance) {
        const startPosition = window.pageYOffset;
        const targetPosition = startPosition + distance;
        const duration = 2000; // 2秒完成滚动
        const startTime = performance.now();
        
        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数让滚动更自然
            const easeInOutQuad = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;
                
            const currentPosition = startPosition + (distance * easeInOutQuad);
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }

    // 使用localStorage保存运行状态
    function saveRunningState(state) {
        localStorage.setItem('linux_do_auto_browser_running', state.toString());
    }

    // 从localStorage读取运行状态
    function loadRunningState() {
        const state = localStorage.getItem('linux_do_auto_browser_running');
        return state === 'true';
    }

    // 等待页面加载完成后执行滚动和跳转
    function handlePageLoad() {
        // 检查localStorage中的状态
        const savedState = loadRunningState();
        if (!savedState) return;
        
        // 更新当前状态
        isRunning = true;
        updateButtonState();
        
        console.log('检测到自动浏览状态，继续执行...');
        
        // 等待页面内容加载
        setTimeout(() => {
            if (!isRunning) return;
            
            // 滚动页面
            scrollPage();
            
            // 滚动完成后再随机停留1-5秒，然后访问下一个帖子
            setTimeout(() => {
                if (!isRunning) return;
                
                const pauseTime = Math.floor(Math.random() * 4000) + 1000; // 1-5秒
                console.log(`滚动完成，随机停留 ${pauseTime}ms 后访问下一个帖子`);
                
                currentTimeout = setTimeout(() => {
                    if (isRunning) {
                        visitRandomTopic();
                    }
                }, pauseTime);
                
            }, 2500); // 等待滚动完成（滚动需要2秒）
            
        }, 2000); // 等待2秒让页面完全加载
    }

    // 更新按钮状态
    function updateButtonState() {
        const button = document.getElementById('auto-browser-btn');
        if (button) {
            if (isRunning) {
                button.textContent = '停止浏览';
                button.style.backgroundColor = '#f44336';
            } else {
                button.textContent = '开始浏览';
                button.style.backgroundColor = '#4CAF50';
            }
        }
    }

    // 初始化
    function init() {
        // 创建控制按钮
        createControlButton();
        
        // 从localStorage恢复状态
        const savedState = loadRunningState();
        isRunning = savedState;
        updateButtonState();
        
        // 如果当前页面是帖子页面且应该继续运行，则处理页面加载
        const currentUrl = window.location.href;
        if (currentUrl.includes('/t/topic/')) {
            handlePageLoad();
        }
        
        console.log('Linux.do自动浏览器已初始化，当前状态:', isRunning ? '运行中' : '已停止');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听页面卸载，清理定时器
    window.addEventListener('beforeunload', () => {
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }
    });

})();