// ==UserScript==
// @name         Bilibili触屏优化
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  优化Bilibili触屏操作体验，支持长按、滑动、缩放等手势操作，支持倍速播放。
// @author       Blysh
// @match        *://*.bilibili.com/*
// @grant        none
// @license     MIT
// @icon        https://cdn.jsdelivr.net/gh/the1812/Bilibili-Evolved@preview/images/logo-small.png
// @downloadURL https://update.greasyfork.org/scripts/560372/Bilibili%E8%A7%A6%E5%B1%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560372/Bilibili%E8%A7%A6%E5%B1%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

class VideoGestureHandler {

    //! ------------------Contructor------------------
    constructor(videoElement) {
        this.biliPlayer = videoElement;
        this.videoElement = videoElement.querySelector("video");
        this.ctrlWrap = videoElement.querySelector(".bpx-player-control-bottom");
        this.playerController = videoElement.querySelector(".bpx-player-container");
        this.playerJindutiao = videoElement.querySelector(".bpx-player-control-entity");
        this.longPressInterval = null;
        this.touchMoveInterval = null;
        this.intervals = [];
        this.longPressThreshold = 400; // 长按阈值，单位为毫秒
        this.gestureType = "none";
        this.playbackRate = "1x";
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchX = 0;
        this.touchY = 0;
        this.lastDistance = 0;
        this.add_time = 0;
        this.touchStartTime = 0;
        this.touchEndTime = 0;
        this.maxFingers = 0;
        this.lastTwoFingerTapTime = 0;
        this.currenttime = 0;
        this.textBox = null;
        this.photoShotStyle = null;
        this.progressElement = null;
        this.clickTimeout = null;
        this.tryGetTargetElement3Times = 0;
        this.swipeTouchEnd = this.swipeTouchEnd.bind(this);
        this.longPressTouchEnd = this.longPressTouchEnd.bind(this);
        this.normolTouchEnd = this.normolTouchEnd.bind(this);
        this.zoomTouchEnd = this.zoomTouchEnd.bind(this);
        this.swipeUDTouchEnd = this.swipeUDTouchEnd.bind(this);
        this.volume = this.videoElement.volume;
        this.videoElement.style.filter = 'brightness(1)';
        this.brightness = 1;
        this.ctrlTimeoutID = null;
        this.addHint();
        //* 创建代理对象
        this.proxyGestureType = new Proxy({ gestureType: this.gestureType }, this.handler());
        this.proxyPlaybackRate = new Proxy({ playbackRate: this.playbackRate }, this.playbackRateHandler());
        //* 添加事件监听器
        this.videoElement.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.videoElement.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.videoElement.addEventListener('touchend', this.normolTouchEnd);
        this.ctrlWrap.addEventListener('touchstart', event => {
            clearTimeout(this.ctrlTimeoutID);
            this.ctrlTimeoutID = null;
        })

    }

    //! ------------------Proxy------------------

    handler() {
        return {
            set: (target, property, value) => {
                target[property] = value;
                this.videoElement.removeEventListener('touchend', this.normolTouchEnd);
                if (property === 'gestureType' && value === 'longpress') {
                    this.videoElement.addEventListener('touchend', this.longPressTouchEnd);
                }
                else if (property === 'gestureType' && value === 'swipe') {
                    // 创建并触发 mouseenter 事件
                    const mouseEnterEvent = new MouseEvent('mouseenter', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    this.progressElement = document.querySelector(".bpx-player-progress");
                    this.progressElement.dispatchEvent(mouseEnterEvent);
                    // 将photoshot固定显示在屏幕下方
                    this.photoShot = document.querySelector(".bpx-player-progress-popup");
                    this.photoShotStyle = document.createElement("style");
                    this.photoShotStyle.innerHTML = `
                        .bpx-player-progress-popup{
                            left: 50%!important;
                            bottom:250px!important;
                            overflow:visible!important;
                            transform: translate(-100%, 100%);
                    }`;
                    this.photoShot.appendChild(this.photoShotStyle);
                    // photoshot放大两倍
                    this.photoShotSize = document.querySelector(".bpx-player-progress-preview-image");
                    this.photoShotSize.style.height = "200%";
                    this.photoShotSize.style.width = "200%";
                    // 隐藏进度条上的指示器和预览时间
                    this.indicator = document.querySelector(".bpx-player-progress-move-indicator");
                    //this.indicator.style.display = "none";
                    this.previewTime = document.querySelector(".bpx-player-progress-preview-time");
                    this.previewTime.style.display = "none";
                    // 添加touchend事件监听器
                    this.videoElement.addEventListener('touchend', this.swipeTouchEnd);
                }
                else if(property === 'gestureType' && value === 'swipeUD'){
                    this.videoElement.addEventListener('touchend', this.swipeUDTouchEnd);
                }
                else if(property === 'gestureType' && value === 'zoom'){
                    this.createButton();
                    this.videoElement.addEventListener('touchend', this.zoomTouchEnd);
                }
                this.videoElement.addEventListener('touchend', this.normolTouchEnd);
                return true;
            }
        };
    }

    playbackRateHandler() {
        return {
            set: (target, property, value) => {
                target[property] = value;
                if (property === 'playbackRate' && value === '1x') {
                    this.playbackRateHint.style.display = "none";
                }
                if (property === 'playbackRate' && value === '2x') {
                    this.playbackRateHint.style.display = '';
                    this.playbackRateHint.innerHTML = this.playbackRateHint.innerHTML.replace(/\d?倍速播放中/, "2倍速播放中");
                }
                else if (property === 'playbackRate' && value === '3x') {
                    this.playbackRateHint.style.display = '';
                    this.playbackRateHint.innerHTML = this.playbackRateHint.innerHTML.replace(/\d?倍速播放中/, "3倍速播放中");
                }
                return true;
            }
        };
    }


    //! ------------------EventListener------------------

    handleCtrl(){
        this.isCtrlShow = this.playerController.getAttribute("data-ctrl-hidden")
        if(this.isCtrlShow == 'false' || this.ctrlTimeoutID){
            this.hideCtrl();
            this.hideCtrlMenus();
            clearTimeout(this.ctrlTimeoutID);
            this.ctrlTimeoutID = null;
        }
        else{
            this.showCtrl();
            this.ctrlTimeoutID = setTimeout(() => {
                this.hideCtrl();
                this.ctrlTimeoutID = null;
            },3000);
        }
    }

    showCtrl(){
        this.playerController.classList.remove("bpx-state-no-cursor")
        this.playerController.setAttribute("data-ctrl-hidden","false")
        this.playerJindutiao.setAttribute("data-shadow-show","false")
        if(this.button)this.button.style.bottom = '10%';
    }

    hideCtrl(){
        this.playerController.classList.add("bpx-state-no-cursor")
        this.playerController.setAttribute("data-ctrl-hidden","true")
        this.playerJindutiao.setAttribute("data-shadow-show","true")
        if(this.button)this.button.style.bottom = '-2%';
    }

    hideCtrlMenus(){
        this.menus = document.querySelector(".bpx-player-control-bottom-right").childNodes;
        this.menus.forEach( menu => {
            menu.classList.remove("bpx-state-show");
        });
    }

    //* 单击事件
    handleClick(event) {
        this.handleCtrl();
    }

    //* 双击事件
    handleDblClick(event) {
        // 切换视频的播放/暂停状态
        if (this.videoElement.paused) {
            this.videoElement.play();
        } else {
            this.videoElement.pause();
        }
    }

    //* 触摸开始
    handleTouchStart(event) {
        event.preventDefault();
        event.stopPropagation();
        this.currenttime = this.videoElement.currentTime;
        this.volume = this.videoElement.volume;
        const touchCount = event.touches.length;
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;
        try{
        const touch2  = event.touches[1];
        this.touchStartX2 = touch2.clientX;
        this.touchStartY2 = touch2.clientY;
        this.touchX2 = touch2.clientX;
        this.touchY2 = touch2.clientY;}
        catch(err){}

        this.lastDistance = 0;
        this.lastAngle = 0;

        if(touchCount === 1){
            this.touchStartTime = Date.now();
            this.maxFingers = 1;
        }
        if (touchCount > this.maxFingers) {
            this.maxFingers = touchCount;
        }
        this.clearAllInterval();
        if (touchCount === 1) {
            this.longPressInterval = setInterval(this.LongPressAction.bind(this), 200);
            this.intervals.push(this.longPressInterval);
            this.touchMoveInterval = setInterval(this.LRSwipeAction.bind(this), 50);
            this.intervals.push(this.touchMoveInterval);
            this.touchMoveUDInterval = setInterval(this.UDSwipeAction.bind(this), 50);
            this.intervals.push(this.touchMoveUDInterval);
        }
        if (touchCount === 2) {
            this.add_time = 0;
            this.currenttime = this.videoElement.currentTime;
            const secondTouchTime = Date.now();
            const timeDifference = secondTouchTime - this.touchStartTime;
            if (timeDifference < 100){
                this.zoomInterval = setInterval(this.zoomAction.bind(this),0);
                this.intervals.push(this.zoomInterval);
            }
        }
    }
    //* 触摸移动
    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;
        try{
        const touch2 = event.touches[1];
        this.touchX2 = touch2.clientX;
        this.touchY2 = touch2.clientY;}
        catch(err){}
    }

    //* 放大缩小画面
    zoomAction() {
        let deltaX = this.touchX - this.touchX2;
        let deltaY = this.touchY - this.touchY2;
        let distance = Math.abs(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
        let angle = this.calculateAngle(this.touchX, this.touchY, this.touchX2, this.touchY2);
        if(this.lastAngle == 0){this.lastAngle = angle;return;}
        if (this.lastDistance == 0) {
            this.lastDistance = distance;
            return;
        }
        let multiple = distance - this.lastDistance;
        let rotate = angle - this.lastAngle;
        if (Math.abs(multiple)>0 && this.proxyGestureType.gestureType === 'none' && this.proxyGestureType.gestureType !== 'zoom'){
            this.proxyGestureType.gestureType = 'zoom';
            this.clearOtherInterval(this.zoomInterval);
        }


        if(this.videoZoomMul == null){this.videoZoomMul=1}
        if(this.videoRotateDeg == null){this.videoRotateDeg=0}

        if(Math.abs(rotate)>0.5){
            this.videoRotateDeg += rotate;
        }


        if(Math.abs(multiple)>0){
            if(multiple>10){multiple=1}
            this.videoZoomMul += multiple*0.01;
            if(this.videoZoomMul<0.8){
                this.videoZoomMul = 0.8
            }
        }


        this.videoElement.style.transform = `scale(${this.videoZoomMul}) rotate(${this.videoRotateDeg}deg)`;
        this.lastDistance = distance;
        this.lastAngle = angle;
    }
    //* 单指左右移动调整时间
    LRSwipeAction() {
        let deltaX = this.touchX - this.touchStartX;

        let distance = Math.sign(deltaX) * ( Math.abs(deltaX) - 5 );
        if (this.lastDistance == 0) {
            this.lastDistance = distance;
            return;
        }
        const move = Math.abs(distance - this.lastDistance); //确保手指有移动
        if (Math.abs(deltaX) > 5 && this.proxyGestureType.gestureType === 'none' && this.proxyGestureType.gestureType !== 'swipe') {
            this.proxyGestureType.gestureType = 'swipe';
            this.clearOtherInterval(this.touchMoveInterval);
        }
        if(this.proxyGestureType.gestureType === 'swipe'){
            if (move > 0.5) {
                this.add_time = distance * 0.1;
                let totalTime = this.currenttime + this.add_time;
                if (totalTime < 0) { totalTime = 0; }
                if (totalTime > this.videoElement.duration) { totalTime = this.videoElement.duration; }
                let positionRatio = totalTime / this.videoElement.duration;
                let start_X = this.progressElement.clientWidth * positionRatio;
                let videoRect = this.videoElement.getBoundingClientRect();

                // 模拟鼠标在进度条移动事件
                const mouseEvent = new MouseEvent('mousemove', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: videoRect.left + start_X + 14
                });
                this.videoElement.dispatchEvent(mouseEvent);
                let add_txt;
                if(totalTime <= 0){
                    add_txt = "00:00" + " / " + this.sec2Time(this.videoElement.duration);
                }
                else if(totalTime >= this.videoElement.duration){
                    add_txt = `${this.sec2Time(this.videoElement.duration)} / ${this.sec2Time(this.videoElement.duration)}`;
                }
                else{
                    add_txt = `${this.sec2Time(this.add_time + this.currenttime)} / ${this.sec2Time(this.videoElement.duration)}`;
                }

                let display_sec = this.add_time >= 0 ? `+${Math.floor(this.add_time)}s` : `${Math.floor(this.add_time)}s`
                add_txt = add_txt + '\n' + display_sec
                this.textBox = this.createTextBox(this.textBox, add_txt);
            }
        }
        this.lastDistance = distance;
    }
    //* 单指上下移动调整音量和亮度
    UDSwipeAction() {
        let deltaY = this.touchY - this.touchStartY;
        if (this.lastDistance == 0) {
            this.lastDistance = this.touchY;
            return;
        }
        const move = this.touchY - this.lastDistance; //确保手指有移动
        if (Math.abs(deltaY) > 5 && this.proxyGestureType.gestureType === 'none' && this.proxyGestureType.gestureType !== 'swipeUD') {
            this.proxyGestureType.gestureType = 'swipeUD';
            this.clearOtherInterval(this.touchMoveUDInterval);
        }

        if(this.proxyGestureType.gestureType === 'swipeUD'){
            let videoRect = this.videoElement.getBoundingClientRect();
            let centerX = videoRect.left + videoRect.width / 2;
            if(this.touchX > centerX){
                if (Math.abs(move) > 5) {
                    this.add_volume = -Math.sign(move)*0.05;
                    this.volume = this.volume + this.add_volume;
                    if (this.volume > 1) {this.volume = 1;}
                    if (this.volume < 0) {this.volume = 0;}
                    this.videoElement.volume = this.volume;
                    this.textBox = this.createProgressBox(this.textBox, 'volume', this.volume);
                }}
            else if(this.touchX < centerX){
                if (Math.abs(move) > 5) {
                    this.add_brightness = -Math.sign(move)*0.05;
                    this.brightness = this.brightness + this.add_brightness;
                    if (this.brightness > 1) {this.brightness = 1;}
                    if (this.brightness < 0) {this.brightness = 0;}
                    this.videoElement.style.filter = `brightness(${this.brightness})`;
                    this.textBox = this.createProgressBox(this.textBox, 'brightness', this.brightness);
                }
            }
        }
        this.lastDistance = this.touchY;
    }
    //* 单指长按倍速播放
    LongPressAction() {
        let touchDuration = Date.now() - this.touchStartTime;
        if (touchDuration >= this.longPressThreshold && this.proxyGestureType.gestureType === 'none' && this.proxyGestureType.gestureType !== 'longpress') {
            // 添加震动反馈
            navigator.vibrate(50); // 短震动表示长按开始

            this.proxyGestureType.gestureType = 'longpress';
            this.proxyPlaybackRate.playbackRate = '3x';
            this.videoElement.playbackRate = 3;
            this.clearOtherInterval(this.longPressInterval);
        }
        let deltaX = this.touchX - this.touchStartX;
        let deltaY = this.touchY - this.touchStartY;
        let direction = deltaX;
        if (deltaY > 5) { direction = "down"; }
        else if (deltaY < -5) { direction = "up"; }
        let distance = Math.abs(deltaX);
        if (this.lastDistance === 0) {
            this.lastDistance = distance;
        }
        if (Math.abs(distance) > 20 && direction === 'down') {
            if (this.proxyPlaybackRate.playbackRate !== '2x') {
                this.videoElement.playbackRate = 2;
                this.proxyPlaybackRate.playbackRate = '2x';
            }
        }
        if (Math.abs(distance) > 20 && direction === 'up') {
            if (this.proxyPlaybackRate.playbackRate !== '3x') {
                this.videoElement.playbackRate = 3;
                this.proxyPlaybackRate.playbackRate = '3x';
            }
        }
        this.lastDistance = distance;
    }

    //! ------------------TouchEND------------------

    longPressTouchEnd(event) {
        this.videoElement.playbackRate = 1;
        this.clearAllInterval();
        this.proxyGestureType.gestureType = 'none';
        this.proxyPlaybackRate.playbackRate = '1x';
        this.videoElement.removeEventListener('touchend', this.longPressTouchEnd);
    }

    swipeTouchEnd(event) {
        const mouseEvent3 = new MouseEvent('mouseleave', {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        this.progressElement.dispatchEvent(mouseEvent3);
        this.clearAllInterval();
        this.fadeoutTextBox(this.textBox);
        this.videoElement.currentTime = this.currenttime + this.add_time;
        this.add_time = 0;
        this.lastDistance = 0;
        this.proxyGestureType.gestureType = 'none';
        this.photoShotStyle.remove();
        this.photoShotSize.style.height = "100%";
        this.videoElement.removeEventListener('touchend', this.swipeTouchEnd);
    }

    swipeUDTouchEnd(event) {
        this.clearAllInterval();
        this.fadeoutTextBox(this.textBox);
        this.lastDistance = 0;
        this.proxyGestureType.gestureType = 'none';
        this.videoElement.removeEventListener('touchend', this.swipeUDTouchEnd);
    }

    zoomTouchEnd(event){
        this.clearAllInterval();
        this.lastDistance = 0;
        this.proxyGestureType.gestureType = 'none';
        this.videoElement.removeEventListener('touchend', this.zoomTouchEnd);
    }

    normolTouchEnd(event) {
        this.clearAllInterval();
        this.videoElement.playbackRate = 1;
        this.proxyGestureType.gestureType = 'none';
        this.touchEndTime = Date.now();
        const touchDuration = this.touchEndTime - this.touchStartTime;

        if (event.touches.length === 0 && this.maxFingers === 2 && touchDuration < 300) {
            this.handleTwoFingerTap();
            return;
        }

        if (touchDuration < 200 && this.maxFingers === 1) { // 判断是否为点击
            if (this.clickTimeout) {
                clearTimeout(this.clickTimeout);
                this.clickTimeout = null;
                this.handleDblClick(event); // 处理双击
            } else {
                this.clickTimeout = setTimeout(() => {
                    this.clickTimeout = null;
                    this.handleClick(event); // 处理单击
                }, 200);
            }
        }

    }

    handleTwoFingerTap() {
        const now = Date.now();
        if (now - this.lastTwoFingerTapTime < 400) {
            this.sendKey('f');
            this.lastTwoFingerTapTime = 0;
        } else {
            this.lastTwoFingerTapTime = now;
        }
    }

    sendKey(key) {
        const keyEvent = new KeyboardEvent('keydown', {
            key: key,
            code: 'Key' + key.toUpperCase(),
            keyCode: key.toUpperCase().charCodeAt(0),
            which: key.toUpperCase().charCodeAt(0),
            bubbles: true,
            cancelable: true,
            view: window
        });
        document.dispatchEvent(keyEvent);
    }

    //! ------------------工具函数------------------

    clearAllInterval() {
        for (let i = 0; i < this.intervals.length; i++) {
            clearInterval(this.intervals[i]);
        }
    }

    clearOtherInterval(except) {
        for (let i = 0; i < this.intervals.length; i++) {
            if (this.intervals[i] !== except) {
                clearInterval(this.intervals[i]);
            }
        }
    }

    createProgressBox(oldBox = null, type, value) {
        if (this.fadeoutTimer) {
            clearTimeout(this.fadeoutTimer);
            this.fadeoutTimer = null;
        }

        let box = oldBox;
        let barFill;
        let iconContainer;

        if (box && !box.classList.contains('touch-improve-progress-box')) {
            box.remove();
            box = null;
        }

        if (!box) {
            if(this.button) this.button.style.opacity = 0;

            box = document.createElement('div');
            box.className = 'touch-improve-progress-box';

            box.style.position = 'absolute';
            box.style.top = '90%';
            box.style.left = '50%';
            box.style.transform = 'translate(-50%, -50%)';
            box.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            box.style.borderRadius = '10px';
            box.style.padding = '15px 20px';
            box.style.display = 'flex';
            box.style.alignItems = 'center';
            box.style.zIndex = '1000';
            box.style.pointerEvents = 'none';
            box.style.width = '200px';

            iconContainer = document.createElement('div');
            iconContainer.className = 'touch-improve-icon';
            iconContainer.style.width = '24px';
            iconContainer.style.height = '24px';
            iconContainer.style.marginRight = '15px';
            iconContainer.style.display = 'flex';
            iconContainer.style.alignItems = 'center';
            iconContainer.style.justifyContent = 'center';
            iconContainer.style.color = 'white';
            box.appendChild(iconContainer);

            const barContainer = document.createElement('div');
            barContainer.style.flex = '1';
            barContainer.style.height = '4px';
            barContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            barContainer.style.borderRadius = '2px';
            barContainer.style.overflow = 'hidden';

            barFill = document.createElement('div');
            barFill.className = 'touch-improve-bar-fill';
            barFill.style.height = '100%';
            barFill.style.backgroundColor = '#fb7299';
            barFill.style.width = '0%';

            barContainer.appendChild(barFill);
            box.appendChild(barContainer);

            this.videoElement.parentElement.appendChild(box);
        } else {
            if (!this.videoElement.parentElement.contains(box)) {
                this.videoElement.parentElement.appendChild(box);
            }
            barFill = box.querySelector('.touch-improve-bar-fill');
            iconContainer = box.querySelector('.touch-improve-icon');
        }

        const volumeIcon = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
        const brightnessIcon = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>`;

        if (type === 'volume') {
            if (iconContainer.innerHTML !== volumeIcon) iconContainer.innerHTML = volumeIcon;
        } else {
            if (iconContainer.innerHTML !== brightnessIcon) iconContainer.innerHTML = brightnessIcon;
        }

        if (barFill) {
            barFill.style.width = `${Math.max(0, Math.min(100, value * 100))}%`;
        }

        return box;
    }

    createTextBox(oldtextBox = null, txt) {
        if (oldtextBox) {
            oldtextBox.remove();
        }
        if(this.button) this.button.style.opacity = 0;
        const textBox = document.createElement('div');
        textBox.innerText = txt; // 设置文本内容
        // 设置文本框的样式
        textBox.style.position = 'absolute';
        textBox.style.bottom = '7%';

        textBox.style.left = '50%';
        textBox.style.padding = '5px';
        textBox.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // 半透明白色背景
        textBox.style.border = '1px solid #ccc';
        textBox.style.borderRadius = '5px';
        textBox.style.zIndex = '1000'; // 确保文本框在视频上方
        textBox.style.pointerEvents = 'none';
        textBox.style.transform = 'translate(-50%, -50%)'; //
        textBox.style.fontSize = '20px';
        textBox.style.textAlign = 'center'
        // 将文本框添加到视频元素的父元素中
        this.videoElement.parentElement.style.position = 'relative'; // 确保父元素是相对定位
        this.videoElement.parentElement.appendChild(textBox);
        return textBox;
    }

    createButton(){
        if (this.button) {
            this.button.remove();
        }
        this.button = document.createElement('button');
        this.button.classList.add('bpx-retore-screen-button');
        this.button.innerText = '还原屏幕';
        this.button.style.position = 'absolute';
        this.button.style.bottom = '-2%';
        this.button.style.left = '50%';
        this.button.style.padding = '5px';
        this.button.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        this.button.style.border = '1px solid #ccc';
        this.button.style.borderRadius = '5px';
        this.button.style.zIndex = '1000';
        this.button.style.pointerEvents = 'auto';
        this.button.style.transform = 'translate(-50%, -50%)';
        this.button.style.fontSize = '25px';
        this.button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.videoZoomMul = 1;
            this.videoRotateDeg = 0;
            this.videoElement.style.transform = `scale(1) rotate(0deg)`;
            this.button.remove();
        });
        this.videoElement.parentElement.style.position = 'relative';
        this.videoElement.parentElement.appendChild(this.button);
    }

    fadeoutTextBox(textBox, timeout = 200) {
        if(this.button) this.button.style.opacity = 1;

        if (this.fadeoutTimer) {
            clearTimeout(this.fadeoutTimer);
            this.fadeoutTimer = null;
        }

        // 2秒后将文本框从 DOM 中移除
        this.fadeoutTimer = setTimeout(() => {
            if (textBox) textBox.remove();
            this.fadeoutTimer = null;
        }, timeout);
    }

    sec2Time(sec) {
        sec = Math.abs(sec);
        sec += 1;
        let h = Math.floor(sec / 3600);
        let m = Math.floor((sec % 3600) / 60);
        let s = Math.floor(sec % 60);
        m = m.toString().length === 1 ? m = "0" + m : m;
        s = s.toString().length === 1 ? s = "0" + s : s;
        h = h.toString().length === 1 ? h = "0" + h : h;
        if (m == 0) {
            return `00:${s}`;
        }
        if (h == 0) {
            return `${m}:${s}`;
        } else {
            return `${h}:${m}:${s}`;
        }
    }

    isFullScreen() {
        return document.fullscreenElement != null;
    }

    calculateAngle(x1, y1, x2, y2) {
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    }

    addHint() {
        this.videoArea = document.querySelector(".bpx-player-video-area");
        this.playbackRateHint = document.createElement("div");
        this.playbackRateHint.style.display = "none";
        this.playbackRateHint.className = "bpx-player-three-playrate-hint";
        this.playbackRateHint.innerHTML = `<span class="bpx-player-three-playrate-hint-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111 66" width="111" height="66" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);"><defs><clipPath id="__lottie_element_234"><rect width="111" height="66" x="0" y="0"></rect></clipPath></defs>

        <g clip-path="url(#__lottie_element_234)">
            <g  transform="matrix(1,0,0,1,94.5,32.5)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(0,3,-3,0,0,0)"><path class="triangle" id="triangle3" fill="rgb(255,255,255)" fill-opacity="1" d=" M6.138000011444092,3.5460000038146973 C6.4679999351501465,4.105999946594238 6.2779998779296875,4.826000213623047 5.7179999351501465,5.156000137329102 C5.538000106811523,5.265999794006348 5.3379998207092285,5.326000213623047 5.118000030517578,5.326000213623047 C5.118000030517578,5.326000213623047 -5.122000217437744,5.326000213623047 -5.122000217437744,5.326000213623047 C-5.771999835968018,5.326000213623047 -6.302000045776367,4.796000003814697 -6.302000045776367,4.145999908447266 C-6.302000045776367,3.936000108718872 -6.242000102996826,3.7260000705718994 -6.142000198364258,3.5460000038146973 C-6.142000198364258,3.5460000038146973 -1.3519999980926514,-4.553999900817871 -1.3519999980926514,-4.553999900817871 C-0.9120000004768372,-5.294000148773193 0.04800000041723251,-5.544000148773193 0.7979999780654907,-5.104000091552734 C1.027999997138977,-4.973999977111816 1.218000054359436,-4.783999919891357 1.3480000495910645,-4.553999900817871 C1.3480000495910645,-4.553999900817871 6.138000011444092,3.5460000038146973 6.138000011444092,3.5460000038146973z"></path></g></g>

            <g  transform="matrix(1,0,0,1,55.5,32.5)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(0,3,-3,0,0,0)"><path class="triangle" id="triangle2" fill="rgb(255,255,255)" fill-opacity="1" d=" M6.138000011444092,3.5460000038146973 C6.4679999351501465,4.105999946594238 6.2779998779296875,4.826000213623047 5.7179999351501465,5.156000137329102 C5.538000106811523,5.265999794006348 5.3379998207092285,5.326000213623047 5.118000030517578,5.326000213623047 C5.118000030517578,5.326000213623047 -5.122000217437744,5.326000213623047 -5.122000217437744,5.326000213623047 C-5.771999835968018,5.326000213623047 -6.302000045776367,4.796000003814697 -6.302000045776367,4.145999908447266 C-6.302000045776367,3.936000108718872 -6.242000102996826,3.7260000705718994 -6.142000198364258,3.5460000038146973 C-6.142000198364258,3.5460000038146973 -1.3519999980926514,-4.553999900817871 -1.3519999980926514,-4.553999900817871 C-0.9120000004768372,-5.294000148773193 0.04800000041723251,-5.544000148773193 0.7979999780654907,-5.104000091552734 C1.027999997138977,-4.973999977111816 1.218000054359436,-4.783999919891357 1.3480000495910645,-4.553999900817871 C1.3480000495910645,-4.553999900817871 6.138000011444092,3.5460000038146973 6.138000011444092,3.5460000038146973z"></path></g></g>

            <g transform="matrix(1,0,0,1,16.5,32.5)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(0,3,-3,0,0,0)"><path  class="triangle" id="triangle1" fill="rgb(255,255,255)" fill-opacity="1" d=" M6.138000011444092,3.5460000038146973 C6.4679999351501465,4.105999946594238 6.2779998779296875,4.826000213623047 5.7179999351501465,5.156000137329102 C5.538000106811523,5.265999794006348 5.3379998207092285,5.326000213623047 5.118000030517578,5.326000213623047 C5.118000030517578,5.326000213623047 -5.122000217437744,5.326000213623047 -5.122000217437744,5.326000213623047 C-5.771999835968018,5.326000213623047 -6.302000045776367,4.796000003814697 -6.302000045776367,4.145999908447266 C-6.302000045776367,3.936000108718872 -6.242000102996826,3.7260000705718994 -6.142000198364258,3.5460000038146973 C-6.142000198364258,3.5460000038146973 -1.3519999980926514,-4.553999900817871 -1.3519999980926514,-4.553999900817871 C-0.9120000004768372,-5.294000148773193 0.04800000041723251,-5.544000148773193 0.7979999780654907,-5.104000091552734 C1.027999997138977,-4.973999977111816 1.218000054359436,-4.783999919891357 1.3480000495910645,-4.553999900817871 C1.3480000495910645,-4.553999900817871 6.138000011444092,3.5460000038146973 6.138000011444092,3.5460000038146973z"></path></g></g>

            </g></svg></span>倍速播放中`

        this.videoArea.appendChild(this.playbackRateHint);

        let hintStyle = document.createElement("style");
        hintStyle.innerHTML = `
            .triangle {
                animation: fadeToWhite 1.2s infinite;
            }

            #triangle1 {
                animation-delay: 0s;
            }

            #triangle2 {
                animation-delay: 0.18s;
            }

            #triangle3 {
                animation-delay: 0.35s;
            }

            @keyframes fadeToWhite {
                0% {
                opacity: 1;
                filter: brightness(0.3);
                }
                25% {
                opacity: 1;
                filter: brightness(0.6);
                }
                50% {
                opacity: 1;
                filter: brightness(1);
                }
                75% {
                opacity: 1;
                filter: brightness(0.6);
                }
                100% {
                opacity: 1;
                filter: brightness(0.3);
                }
            }
        `
        this.playbackRateHint.appendChild(hintStyle);
    }
}
class AddRightEntryEventListener {
    constructor(rightEntry) {
        this.rightEntry = rightEntry;
        this.rightEntry.addEventListener('click', this.handleRightEntryClick.bind(this));
    }
    handleRightEntryClick(event) {
        let target = event.target;
        let href = target.closest('a').getAttribute('href');
        if (href && href.includes('//space')) {
            event.preventDefault();
            return;
        }
        if (href && href.includes('/history')) {
            event.preventDefault();
            return;
        }
    }
}

function waitForVideoELement(timeout = 5000) {
    return new Promise((resolve, reject) => {
        const intervalID = setInterval(() => {
            let videoElement = document.querySelector("#bilibili-player");

            if (videoElement) {
                clearInterval(intervalID);
                clearTimeout(timeoutID);
                resolve(videoElement);
            }
        }, 100);

        const timeoutID = setTimeout(() => {
            clearInterval(intervalID);
            reject(new Error("Timeout: Video element not found"));
        }, timeout);
    });
}

function waitForRightEntry(timeout = 10000) {
    return new Promise((resolve, reject) => {
        const intervalID = setInterval(() => {
            if (document.querySelector("#nav-searchform") != null) {
                let header_position;
                header_position = document.querySelector("#biliMainHeader > div.bili-header.fixed-header > div > ul.right-entry") || document.querySelector(".right-entry");

                if (header_position) {
                    clearInterval(intervalID);
                    clearTimeout(timeoutID);
                    resolve(header_position);
                }
            }
        }, 100);

        const timeoutID = setTimeout(() => {
            clearInterval(intervalID);
            reject(new Error("Timeout: Right entry element not found"));
        }, timeout);
    });
}


let currentUrl = window.location.href; // 打开的网页
const exceptUrl = [
"https://www.bilibili.com/correspond",
"https://message.bilibili.com/pages/nav/header_sync"
];
let shouldTerminate = false;

for (let url of exceptUrl){
    if (currentUrl.includes(url)) {
        shouldTerminate = true;
        break;
    }
}
if (shouldTerminate) {
    shouldTerminate = false;
    return;
}


Promise.race([waitForVideoELement(), waitForRightEntry()])
    .then((result) => {
        if (result.getAttribute("id") == "bilibili-player") {
            console.log("Video element found!");
            new VideoGestureHandler(result);
            handleAnotherPromise(waitForRightEntry, AddRightEntryEventListener, "right");
        } else{
            console.log("Right entry element found!");
            new AddRightEntryEventListener(result);
            handleAnotherPromise(waitForVideoELement, VideoGestureHandler, "video");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

function handleAnotherPromise(promiseFunc, handler, type) {
    promiseFunc()
        .then((result) => {
            new handler(result);
            if (type == "video") {
                console.log("Video element found!");
            } else if (type == "right") {
                console.log("Right entry element found!");
            }
            return
        })
        .catch((error) => {
            console.error('Error:', error);
            return
        });
}
