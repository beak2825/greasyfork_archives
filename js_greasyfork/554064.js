// ==UserScript==
// @name         百度网盘视频倍速控制器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在百度网盘视频右侧添加倍速控制按钮（等待两个video元素出现）
// @author       Jociber
// @match        https://pan.baidu.com/*
// @match        http://pan.baidu.com/*
// @grant        none
// @noframes     不让脚本在frame中运行
// @downloadURL https://update.greasyfork.org/scripts/554064/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554064/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let observer = null;
    let controlCreated = false;
    let currentVideo = null;
    let currentSpeed = 1.0;
    
    // 检查是否满足条件并创建控制器
    function checkAndCreateControl() {
        // 如果已经创建过控制器，则不再创建
        if (controlCreated) return;
        
        // 查找所有video元素
        const videos = document.querySelectorAll('video');
        
        // 等待至少有两个video元素
        if (videos.length >= 2) {
            // 选择第1个video元素（通常是主要的播放器）
            const video = videos[0];
            currentVideo = video;
            createSpeedControl(video);
            controlCreated = true;
            
            // 停止观察
            if (observer) {
                observer.disconnect();
                observer = null
            }
        }
    }
    
    // 初始化检查
    function init() {
        // 立即检查一次
        checkAndCreateControl();
        
        // 如果还没有满足条件，设置观察器
        if (!controlCreated) {
            observer = new MutationObserver(function(mutations) {
                checkAndCreateControl();
            });
            
            // 观察整个文档的变化
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // 设置超时，防止无限等待
            setTimeout(() => {
                if (!controlCreated && observer) {
                    observer.disconnect();
                    console.log('倍速控制器：等待超时，未找到足够的video元素');
                }
            }, 15000); // 15秒超时
        }
    }
    
    
    function createSpeedControl(video) {
        // 查找视频容器
        const videoContainer = video.closest('.video-player-container') || video.parentElement;
        if (!videoContainer) {
            console.log('倍速控制器：未找到视频容器');
            return;
        }
        
        // 检查是否已经存在控制器
        if (videoContainer.querySelector('.speed-control-container')) {
            return;
        }
        
        // 尝试从本地存储获取之前设置的倍速
        const savedSpeed = localStorage.getItem('baidu_pan_speed');
        if (savedSpeed) {
            currentSpeed = parseFloat(savedSpeed);
            video.playbackRate = currentSpeed;
        }
        
        // 创建主按钮容器
        const speedControl = document.createElement('div');
        speedControl.className = 'speed-control-container';
        speedControl.style.cssText = `
            position: absolute;
            right: 20px;
            top: -30px;
            z-index: 1000;
        `;
        
        // 创建主按钮
        const mainButton = document.createElement('button');
        mainButton.innerHTML = `${currentSpeed}x`;
        mainButton.style.cssText = `
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        `;
        
        mainButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0, 0, 0, 0.9)';
        });
        
        mainButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(0, 0, 0, 0.7)';
        });
        
        // 创建下拉菜单
        const dropdown = document.createElement('div');
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 4px;
            padding: 8px 0;
            min-width: 100px;
            display: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        `;
        
        // 倍速选项
        const speeds = [0.5, 1.0, 1.5, 2.0];
        
        speeds.forEach(speed => {
            const speedButton = document.createElement('button');
            speedButton.innerHTML = `${speed}x`;
            speedButton.style.cssText = `
                display: block;
                width: 100%;
                background: none;
                border: none;
                color: white;
                padding: 8px 16px;
                cursor: pointer;
                text-align: left;
                font-size: 14px;
                transition: background 0.2s;
            `;
            
            // 高亮当前选中的倍速
            if (speed === currentSpeed) {
                speedButton.style.background = 'rgba(255, 255, 255, 0.2)';
                speedButton.style.fontWeight = 'bold';
            }
            
            speedButton.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            });
            
            speedButton.addEventListener('mouseleave', function() {
                if (speed === currentSpeed) {
                    this.style.background = 'rgba(255, 255, 255, 0.2)';
                } else {
                    this.style.background = 'none';
                }
            });
            
            speedButton.addEventListener('click', function() {
                setPlaybackSpeed(speed, video, mainButton);
                dropdown.style.display = 'none';
            });
            
            dropdown.appendChild(speedButton);
        });
        
        // 添加自定义倍速输入
        const customContainer = document.createElement('div');
        customContainer.style.cssText = `
            padding: 8px 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            margin-top: 8px;
        `;
        
        const customInput = document.createElement('input');
        customInput.type = 'number';
        customInput.placeholder = '自定义倍速';
        customInput.min = '0.1';
        customInput.max = '10';
        customInput.step = '0.1';
        customInput.style.cssText = `
            width: 100%;
            padding: 4px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            color: white;
            font-size: 12px;
            box-sizing: border-box;
        `;
        
        const customButton = document.createElement('button');
        customButton.innerHTML = '应用';
        customButton.style.cssText = `
            width: 100%;
            margin-top: 4px;
            padding: 4px;
            background: #4CAF50;
            border: none;
            border-radius: 2px;
            color: white;
            cursor: pointer;
            font-size: 12px;
        `;
        
        customButton.addEventListener('click', function() {
            const customSpeed = parseFloat(customInput.value);
            if (customSpeed && customSpeed > 0 && customSpeed <= 10) {
                setPlaybackSpeed(customSpeed, video, mainButton);
                dropdown.style.display = 'none';
                customInput.value = '';
            }
        });
        
        customContainer.appendChild(customInput);
        customContainer.appendChild(customButton);
        dropdown.appendChild(customContainer);
        
        // 鼠标事件处理
        mainButton.addEventListener('click', function() {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // 点击页面其他区域关闭下拉菜单
        document.addEventListener('click', function(e) {
            if (!speedControl.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
        // 组装元素
        speedControl.appendChild(mainButton);
        speedControl.appendChild(dropdown);
        
        // 确保视频容器有相对定位
        if (getComputedStyle(videoContainer).position === 'static') {
            videoContainer.style.position = 'relative';
        }
        
        videoContainer.appendChild(speedControl);
        
        // 监听视频事件
        setupVideoListeners(video, mainButton);
        
        console.log('倍速控制器：创建成功');
    }
    
    // 设置播放速率并更新显示
    function setPlaybackSpeed(speed, video, button) {
        currentSpeed = speed;
        video.playbackRate = speed;
        button.innerHTML = `${speed}x`;
        
        // 保存到本地存储
        localStorage.setItem('baidu_pan_speed', speed.toString());
        
        // 更新下拉菜单中的高亮状态
        // updateSpeedButtonsHighlight(speed, button.parentElement);
    }
    
    // 更新下拉菜单中的高亮状态
    function updateSpeedButtonsHighlight(speed, container) {
        const buttons = container.querySelectorAll('button');
        buttons.forEach(btn => {
            const btnSpeed = parseFloat(btn.innerHTML.replace('x', ''));
            if (!isNaN(btnSpeed)) {
                if (btnSpeed === speed) {
                    btn.style.background = 'rgba(255, 255, 255, 0.2)';
                    btn.style.fontWeight = 'bold';
                } else {
                    btn.style.background = 'none';
                    btn.style.fontWeight = 'normal';
                }
            }
        });
    }
    
    // 设置视频事件监听器
    function setupVideoListeners(video, button) {
        // 监听播放事件，确保倍速设置不被重置
        // video.addEventListener('play', function() {
        //     video.playbackRate = currentSpeed;
        // });

        // 监听速率变化事件（防止被其他脚本修改）
        video.addEventListener('ratechange', function() {
            if (video.playbackRate !== currentSpeed) {
                // 如果速率被外部修改，更新我们的状态
                video.playbackRate = currentSpeed;
                // button.innerHTML = `${currentSpeed.toFixed(1)}x`;
            }
        });
        
        // 监听页面可见性变化（标签页切换）
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && video.playbackRate !== currentSpeed) {
                // 页面重新可见时，重新应用倍速
                setTimeout(() => {
                    video.playbackRate = currentSpeed;
                }, 100);
            }
        });
    }

    // 等待窗口完全加载完成
    // if (document.readyState === 'loading') {
    //     window.addEventListener('load', init);
    // } else {
    //     // 如果文档已经加载完成，直接执行
    //     if (document.readyState === 'complete') {
    //         init();
    //     } else {
    //         window.addEventListener('load', init);
    //     }
    // }
    init();

})();