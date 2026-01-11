// ==UserScript==
// @name         B站视频旋转缩放拖拽v1.2.2 版
// @namespace    https://github.com/violentmonkey
// @version      1.2.2
// @description  横屏≥1.01拖拽|竖屏≥0.66拖拽|0.01精度缩放|自动竖屏|ES5兼容|无冲突 | 签名：花草丛丛
// @author       Custom | 花草丛丛
// @match        *://*.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562178/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%97%8B%E8%BD%AC%E7%BC%A9%E6%94%BE%E6%8B%96%E6%8B%BDv122%20%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/562178/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%97%8B%E8%BD%AC%E7%BC%A9%E6%94%BE%E6%8B%96%E6%8B%BDv122%20%E7%89%88.meta.js
// ==/UserScript==

/* 
 * 专属签名：花草丛丛
 * 核心功能：
 * 1. 旋转：90°/180°/270°旋转，自动识别竖屏录屏
 * 2. 缩放：0.1~3.0倍，0.01精度，横屏≥1.01可拖拽，竖屏≥0.66可拖拽
 * 3. 拖拽：缩放达标后按住左键拖拽，范围限制，拖拽后鼠标回归默认
 * 4. 快捷键：Ctrl+H(横屏)、Ctrl+L(左旋转)、Ctrl+R(右旋转)、Ctrl+0(重置)等
 * 5. 控制面板：可拖拽、自动隐藏、延迟设置、例外列表
 */

(function() {
    "use strict";

    // ===== 存储配置 =====
    var STORAGE = {
        rotate: "bilibili_rotate_2024",
        scale: "bilibili_scale_2024",
        panelX: "bilibili_panel_x_2024",
        panelY: "bilibili_panel_y_2024",
        autoHide: "bilibili_auto_hide_2024",
        hideDelay: "bilibili_hide_delay_2024",
        exceptionList: "bilibili_exception_list_2024",
        translateX: "bilibili_translate_x_2024",
        translateY: "bilibili_translate_y_2024",
        autoVertical: "bilibili_auto_vertical_2024"
    };

    // ===== 全局状态（ES5兼容，双阈值设置）=====
    var state = {
        manualRotate: false,
        isDragging: false,
        isDragReady: false,
        isMouseOverVideo: false,
        isPanelDragging: false,
        
        dragStartX: 0,
        dragStartY: 0,
        translateX: GM_getValue(STORAGE.translateX, 0),
        translateY: GM_getValue(STORAGE.translateY, 0),
        translateStartX: 0,
        translateStartY: 0,
        
        videoContainer: null,
        videoElement: null,
        controlPanel: null,
        naturalMask: null,
        zoomHint: null,
        dragHint: null,
        
        dragTimer: null,
        hideTimer: null,
        hintTimer: null,
        
        settings: null,
        // 核心阈值配置（按要求设置）
        DRAG_THRESHOLD_LANDSCAPE: 1.0,  // 横屏（0°/180°）拖拽阈值：≥1.01可拖拽
        DRAG_THRESHOLD_PORTRAIT: 0.65,  // 竖屏（90°/270°）拖拽阈值：≥0.66可拖拽
        MAX_SCALE: 3.0,                 // 最大缩放倍数
        MIN_SCALE: 0.1,                 // 最小缩放倍数
        SCALE_STEP: 0.01,               // 缩放精度：0.01
        
        // 动态获取当前拖拽阈值
        getDragThreshold: function() {
            // 判断是否为竖屏状态（90°或270°旋转）
            var isPortrait = state.settings && (state.settings.rotate % 180 === 90);
            return isPortrait ? state.DRAG_THRESHOLD_PORTRAIT : state.DRAG_THRESHOLD_LANDSCAPE;
        }
    };

    // ===== 初始化设置 =====
    function initSettings() {
        state.settings = {
            rotate: GM_getValue(STORAGE.rotate, 0),
            scale: parseFloat(GM_getValue(STORAGE.scale, 1.0).toFixed(2)), // 保留2位小数
            panelX: GM_getValue(STORAGE.panelX, 20),
            panelY: GM_getValue(STORAGE.panelY, 80),
            autoHide: GM_getValue(STORAGE.autoHide, true),
            hideDelay: GM_getValue(STORAGE.hideDelay, 8),
            exceptionList: GM_getValue(STORAGE.exceptionList, []),
            autoVertical: GM_getValue(STORAGE.autoVertical, true)
        };
    }

    function saveSettings() {
        var key;
        for (key in state.settings) {
            if (STORAGE[key]) {
                GM_setValue(STORAGE[key], state.settings[key]);
            }
        }
        GM_setValue(STORAGE.translateX, state.translateX);
        GM_setValue(STORAGE.translateY, state.translateY);
    }

    // ===== 核心样式（兼容各浏览器，拖拽光标优化）=====
    GM_addStyle(
        "#bilibili-video-control-panel {" +
        "    position: absolute; z-index: 999999 !important; display: flex; flex-wrap: wrap; max-width: 180px; gap: 4px;" +
        "    background: rgba(0, 0, 0, 0.85); padding: 6px; border-radius: 8px; backdrop-filter: blur(4px);" +
        "    cursor: move; user-select: none; transition: all 0.3s ease; pointer-events: auto !important;" +
        "    border: 1px solid rgba(144, 164, 174, 0.3);" +
        "}" +
        "#bilibili-video-control-panel.hide {" +
        "    opacity: 0; transform: translateY(20px); pointer-events: none;" +
        "}" +
        "#bilibili-video-control-panel.hover-light {" +
        "    opacity: 0.4; pointer-events: auto;" +
        "}" +
        "#bilibili-video-control-panel.hover-full {" +
        "    opacity: 1; pointer-events: auto;" +
        "}" +
        ".bilibili-control-btn {" +
        "    color: #fff; border: none; background: transparent; font-size: 14px; width: 28px; height: 28px;" +
        "    border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer;" +
        "    pointer-events: auto !important; transition: all 0.2s ease;" +
        "}" +
        ".bilibili-control-btn:hover {" +
        "    background: rgba(255, 255, 255, 0.15);" +
        "}" +
        ".bilibili-control-btn.active {" +
        "    background: rgba(120, 144, 156, 0.5) !important;" +
        "    border: 1px solid rgba(176, 190, 197, 0.5) !important;" +
        "    color: #ffffff !important;" +
        "}" +
        ".bilibili-control-btn.inactive {" +
        "    background: rgba(158, 158, 158, 0.2) !important;" +
        "}" +
        ".bilibili-auto-vertical-btn {" +
        "    width: 32px !important; height: 20px !important; border-radius: 10px !important; position: relative !important;" +
        "    background: #2c2c2c !important; display: flex !important; align-items: center !important; justify-content: center !important;" +
        "}" +
        ".bilibili-auto-vertical-btn .dot {" +
        "    width: 12px !important; height: 12px !important; border-radius: 50% !important; transition: background-color 0.3s ease !important;" +
        "}" +
        ".bilibili-auto-vertical-btn.active .dot {" +
        "    background-color: rgba(102, 187, 106, 0.8) !important;" +
        "}" +
        ".bilibili-auto-vertical-btn.inactive .dot {" +
        "    background-color: rgba(244, 67, 54, 0.7) !important;" +
        "}" +
        ".bilibili-control-slider {" +
        "    width: 100%; margin: 2px 0; accent-color: #90a4ae; pointer-events: auto !important;" +
        "}" +
        ".bilibili-control-group {" +
        "    width: 100%; display: flex; gap: 4px;" +
        "}" +
        ".bpx-player-fullscreen #bilibili-video-control-panel {" +
        "    bottom: 120px; left: 30px;" +
        "}" +
        ".bilibili-delay-btn {" +
        "    display: none; font-size: 12px; color: #cfd8dc;" +
        "}" +
        ".bilibili-hide-group:hover .bilibili-delay-btn {" +
        "    display: flex;" +
        "}" +
        ".bilibili-delay-btn.active {" +
        "    background: rgba(144, 164, 174, 0.4) !important; color: #ffffff !important;" +
        "    border: 1px solid rgba(176, 190, 197, 0.4) !important;" +
        "}" +
        ".bilibili-delay-btn:hover {" +
        "    background: rgba(207, 216, 220, 0.25) !important;" +
        "}" +
        ".bilibili-transformable {" +
        "    transform-origin: center center !important;" +
        "    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;" +
        "}" +
        ".bilibili-transformable.draggable {" +
        "    cursor: grab !important; cursor: -moz-grab !important; cursor: -webkit-grab !important;" +
        "}" +
        ".bilibili-transformable.dragging {" +
        "    cursor: grabbing !important; cursor: -moz-grabbing !important; cursor: -webkit-grabbing !important;" +
        "    transition: none !important; transform-origin: center center !important;" +
        "}" +
        ".bilibili-natural-mask {" +
        "    position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9998;" +
        "    opacity: 0; background: radial-gradient(" +
        "        circle at var(--mask-center-x, 50%) var(--mask-center-y, 50%)," +
        "        rgba(0, 0, 0, 0) 0%," +
        "        rgba(0, 0, 0, 0) 40%," +
        "        rgba(0, 0, 0, 0.2) 60%," +
        "        rgba(0, 0, 0, 0.4) 80%," +
        "        rgba(0, 0, 0, 0.7) 100%" +
        "    ); transition: opacity 0.5s ease, background 0.5s ease; mix-blend-mode: multiply;" +
        "}" +
        ".bilibili-natural-mask.active {" +
        "    opacity: 1;" +
        "}" +
        ".bilibili-zoom-hint {" +
        "    position: fixed; left: 50%; top: 30px; transform: translateX(-50%); z-index: 100001;" +
        "    background: rgba(0, 0, 0, 0.8); color: #cfd8dc; padding: 8px 12px; border-radius: 4px;" +
        "    font-size: 12px; backdrop-filter: blur(4px); border: 1px solid rgba(144, 164, 174, 0.4);" +
        "    opacity: 0; pointer-events: none; transition: opacity 0.3s; white-space: nowrap;" +
        "}" +
        ".bilibili-zoom-hint.show {" +
        "    opacity: 1;" +
        "}" +
        ".bilibili-drag-hint {" +
        "    position: fixed; right: 20px; bottom: 100px; z-index: 100000;" +
        "    background: rgba(0, 0, 0, 0.8); color: #cfd8dc; padding: 6px 10px; border-radius: 4px;" +
        "    font-size: 12px; backdrop-filter: blur(4px); border: 1px solid rgba(144, 164, 174, 0.4);" +
        "    opacity: 0; pointer-events: none; transition: opacity 0.3s;" +
        "}" +
        ".bilibili-drag-hint.show {" +
        "    opacity: 1;" +
        "}"
    );

    // ===== 工具函数 =====
    function getBV() {
        var match = window.location.href.match(/BV([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    }

    function isException() {
        var bv = getBV();
        return bv && state.settings.exceptionList.indexOf(bv) !== -1;
    }

    function showHint(element, text, duration) {
        if (!element) return;
        
        clearTimeout(state.hintTimer);
        element.textContent = text;
        element.classList.add("show");
        
        if (duration > 0) {
            state.hintTimer = setTimeout(function() {
                element.classList.remove("show");
            }, duration);
        }
    }

    function hideHint(element) {
        if (!element) return;
        element.classList.remove("show");
    }

    // ===== 视频容器获取 =====
    function getVideoContainer() {
        var selectors = [
            ".bpx-player-video-wrap",
            ".bpx-player-video-area",
            ".bilibili-player-video-wrap",
            ".player-video-wrap",
            ".video-state-wrap",
            ".video-container",
            "[class*='video-wrap']",
            "[class*='player-video']"
        ];
        
        var container = null;
        var i;
        for (i = 0; i < selectors.length; i++) {
            container = document.querySelector(selectors[i]);
            if (container) break;
        }
        
        if (!container) {
            container = document.querySelector(".bpx-player-video") || 
                       document.querySelector(".video-player") ||
                       (document.querySelector("video") ? document.querySelector("video").parentElement : null);
        }
        
        var video = null;
        if (container) {
            video = container.querySelector("video");
        }
        if (!video) {
            video = document.querySelector("video.bpx-player-video-element") || 
                    document.querySelector("video");
        }
        
        return {
            container: container || video,
            video: video
        };
    }

    // ===== 视频变换更新（核心：双阈值拖拽判断）=====
    function updateVideoTransform() {
        if (!state.videoContainer || !state.videoContainer.style || !state.settings) return;
        
        var transform = "translate(" + state.translateX + "px, " + state.translateY + "px) " +
                        "rotate(" + state.settings.rotate + "deg) " +
                        "scale(" + state.settings.scale + ")";
        
        state.videoContainer.style.transform = transform;
        
        // 动态判断是否可拖拽
        var canDrag = state.settings.scale > state.getDragThreshold();
        if (canDrag) {
            if (!state.isDragging) {
                state.videoContainer.classList.add("draggable");
                state.videoContainer.classList.remove("dragging");
                state.videoContainer.style.cursor = "grab";
                state.videoContainer.style.cursor = "-moz-grab";
                state.videoContainer.style.cursor = "-webkit-grab";
            }
        } else {
            state.translateX = 0;
            state.translateY = 0;
            state.videoContainer.classList.remove("draggable", "dragging");
            state.videoContainer.style.transformOrigin = "center center";
            state.videoContainer.style.cursor = "default";
        }
    }

    // ===== 滚轮缩放功能（0.01精度，双阈值提示）=====
    function setupWheelZoom() {
        if (!state.videoContainer || !state.settings) return;
        
        state.zoomHint = document.createElement("div");
        state.zoomHint.className = "bilibili-zoom-hint";
        document.body.appendChild(state.zoomHint);
        
        state.dragHint = document.createElement("div");
        state.dragHint.className = "bilibili-drag-hint";
        document.body.appendChild(state.dragHint);
        
        state.naturalMask = document.createElement("div");
        state.naturalMask.className = "bilibili-natural-mask";
        state.videoContainer.parentNode.appendChild(state.naturalMask);
        
        state.videoContainer.addEventListener("mousemove", function(e) {
            if (!state.videoContainer || state.isDragging) return;
            
            var rect = state.videoContainer.getBoundingClientRect();
            var x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            var y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
            
            var xPercent = (x / rect.width) * 100;
            var yPercent = (y / rect.height) * 100;
            
            state.videoContainer.style.transformOrigin = xPercent + "% " + yPercent + "%";
            
            if (state.naturalMask) {
                state.naturalMask.style.setProperty("--mask-center-x", xPercent + "%");
                state.naturalMask.style.setProperty("--mask-center-y", yPercent + "%");
            }
        });
        
        state.videoContainer.addEventListener("mouseenter", function() {
            state.isMouseOverVideo = true;
            var canDrag = state.settings.scale > state.getDragThreshold();
            var isPortrait = state.settings.rotate % 180 === 90;
            
            if (canDrag) {
                var hintText = isPortrait ? "✅ 竖屏可拖拽：按住鼠标左键移动" : "✅ 横屏可拖拽：按住鼠标左键移动";
                showHint(state.dragHint, hintText, 3000);
                state.videoContainer.style.cursor = "grab";
            } else {
                var thresholdText = isPortrait ? "缩放≥0.66即可拖拽" : "缩放≥1.01即可拖拽";
                showHint(state.zoomHint, thresholdText, 2000);
            }
        });
        
        state.videoContainer.addEventListener("mouseleave", function() {
            state.isMouseOverVideo = false;
            if (!state.isDragging) {
                hideHint(state.zoomHint);
                hideHint(state.dragHint);
                var canDrag = state.settings.scale > state.getDragThreshold();
                state.videoContainer.style.cursor = canDrag ? "grab" : "default";
            }
        });
        
        // 滚轮缩放（0.01精度）
        state.videoContainer.addEventListener("wheel", function(e) {
            if (!state.isMouseOverVideo || state.isDragging || !state.settings) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            // 滚轮每滚动一次，缩放±0.01
            var delta = e.deltaY < 0 ? state.SCALE_STEP : -state.SCALE_STEP;
            var newScale = parseFloat((state.settings.scale + delta).toFixed(2));
            
            // 限制缩放范围
            newScale = Math.max(state.MIN_SCALE, Math.min(newScale, state.MAX_SCALE));
            
            if (newScale !== state.settings.scale) {
                setScale(newScale);
                showHint(state.zoomHint, "缩放: " + newScale.toFixed(2) + "x", 1000);
                
                var canDrag = newScale > state.getDragThreshold();
                var isPortrait = state.settings.rotate % 180 === 90;
                
                if (canDrag) {
                    state.naturalMask.classList.add("active");
                    setTimeout(function() {
                        var hintText = isPortrait ? "✅ 竖屏可拖拽：按住鼠标左键移动" : "✅ 横屏可拖拽：按住鼠标左键移动";
                        showHint(state.dragHint, hintText, 3000);
                    }, 300);
                    state.videoContainer.style.cursor = "grab";
                } else {
                    state.naturalMask.classList.remove("active");
                    state.videoContainer.style.cursor = "default";
                }
            }
        }, { passive: false });
        
        state.videoContainer.classList.add("bilibili-transformable");
    }

    // ===== 拖拽功能（双阈值触发，无冲突）=====
    function setupVideoDrag() {
        if (!state.videoContainer || !state.settings) return;
        
        state.videoContainer.addEventListener("mousedown", function(e) {
            // 严格判断：左键+缩放达标+非面板拖拽+非控制面板区域
            var canDrag = state.settings.scale > state.getDragThreshold();
            if (e.button !== 0 || !canDrag || state.isPanelDragging) return;
            if (e.target.closest("#bilibili-video-control-panel")) return;
            
            state.dragStartX = e.clientX;
            state.dragStartY = e.clientY;
            state.translateStartX = state.translateX;
            state.translateStartY = state.translateY;
            
            state.isDragReady = true;
            showHint(state.dragHint, "拖拽中... 松开左键结束", 0);
            
            document.addEventListener("mousemove", onDocumentMouseMove, true);
            document.addEventListener("mouseup", onDocumentMouseUp, true);
        });
        
        function onDocumentMouseMove(e) {
            if (!state.isDragReady) return;
            
            var dx = e.clientX - state.dragStartX;
            var dy = e.clientY - state.dragStartY;
            var distance = Math.sqrt(dx * dx + dy * dy);
            
            // 移动超过2px激活拖拽
            if (distance > 2 && !state.isDragging) {
                state.isDragging = true;
                state.videoContainer.classList.remove("draggable");
                state.videoContainer.classList.add("dragging");
                state.videoContainer.style.cursor = "grabbing";
                state.videoContainer.style.cursor = "-moz-grabbing";
                state.videoContainer.style.cursor = "-webkit-grabbing";
                
                e.preventDefault();
                e.stopPropagation();
            }
            
            if (state.isDragging) {
                e.preventDefault();
                e.stopPropagation();
                
                state.translateX = state.translateStartX + dx;
                state.translateY = state.translateStartY + dy;
                
                // 限制拖拽范围（避免超出屏幕过多）
                var rect = state.videoContainer.getBoundingClientRect();
                var maxOffsetX = rect.width * 0.6;
                var maxOffsetY = rect.height * 0.6;
                state.translateX = Math.max(-maxOffsetX, Math.min(maxOffsetX, state.translateX));
                state.translateY = Math.max(-maxOffsetY, Math.min(maxOffsetY, state.translateY));
                
                updateVideoTransform();
            }
        }
        
        function onDocumentMouseUp(e) {
            document.removeEventListener("mousemove", onDocumentMouseMove, true);
            document.removeEventListener("mouseup", onDocumentMouseUp, true);
            
            if (state.isDragging) {
                state.isDragging = false;
                state.videoContainer.classList.remove("dragging");
                var canDrag = state.settings.scale > state.getDragThreshold();
                if (canDrag) {
                    state.videoContainer.classList.add("draggable");
                    state.videoContainer.style.cursor = "grab";
                } else {
                    state.videoContainer.style.cursor = "default";
                }
                saveSettings();
                showHint(state.dragHint, "✅ 拖拽结束，位置已保存", 2000);
            } else if (state.isDragReady) {
                // 纯点击：触发视频暂停
                if (state.videoElement) {
                    var clickEvent = document.createEvent("MouseEvents");
                    clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    state.videoElement.dispatchEvent(clickEvent);
                }
                hideHint(state.dragHint);
            }
            
            state.isDragReady = false;
        }
    }

    // ===== 缩放控制（0.01精度，范围限制）=====
    function setScale(scale) {
        var num = parseFloat(scale);
        if (isNaN(num) || !state.settings) return;
        
        // 限制范围+保留2位小数
        num = Math.max(state.MIN_SCALE, Math.min(num, state.MAX_SCALE));
        num = parseFloat(num.toFixed(2));
        
        state.settings.scale = num;
        updateVideoTransform();
        
        // 更新滑块值
        var slider = document.querySelector(".bilibili-control-slider");
        if (slider) slider.value = num;
        
        saveSettings();
    }

    // ===== 旋转控制 =====
    function setRotate(deg) {
        if (!state.settings) return;
        
        var newDeg = Math.round(deg / 90) * 90;
        newDeg = (newDeg % 360 + 360) % 360;
        
        state.settings.rotate = newDeg;
        state.manualRotate = true;
        updateVideoTransform();
        saveSettings();
        
        // 旋转后更新提示
        var isPortrait = newDeg % 180 === 90;
        var thresholdText = isPortrait ? "缩放≥0.66即可拖拽" : "缩放≥1.01即可拖拽";
        showHint(state.zoomHint, "旋转" + newDeg + "° | " + thresholdText, 2000);
    }

    // ===== 重置所有变换 =====
    function resetAll() {
        if (!state.settings) return;
        
        state.settings.rotate = 0;
        state.settings.scale = 1.0;
        state.translateX = 0;
        state.translateY = 0;
        state.manualRotate = false;
        
        updateVideoTransform();
        saveSettings();
        
        if (state.naturalMask) {
            state.naturalMask.classList.remove("active");
        }
        
        var slider = document.querySelector(".bilibili-control-slider");
        if (slider) slider.value = 1.0;
        
        showHint(state.zoomHint, "已重置所有变换 | 横屏≥1.01可拖拽", 1500);
    }

    // ===== 自动旋转功能（保留朋友的判定逻辑）=====
    function isRecordVideo(video) {
        if (!video || !video.videoWidth || !video.videoHeight) return false;
        
        var mobileResolutions = [
            [1080, 2340], [720, 1600], [1440, 3200],
            [1125, 2436], [828, 1792], [1242, 2688],
            [1170, 2532], [1284, 2778]
        ];
        
        var width = video.videoWidth;
        var height = video.videoHeight;
        var i;
        for (i = 0; i < mobileResolutions.length; i++) {
            var res = mobileResolutions[i];
            if ((Math.abs(width - res[0]) <= 10 && Math.abs(height - res[1]) <= 10) ||
                (Math.abs(width - res[1]) <= 10 && Math.abs(height - res[0]) <= 10)) {
                return true;
            }
        }
        
        var title = (document.title || "").toLowerCase();
        return title.indexOf("录屏") !== -1 || 
               title.indexOf("录播") !== -1 ||
               title.indexOf("直播回放") !== -1 ||
               title.indexOf("手机") !== -1 ||
               title.indexOf("竖屏") !== -1;
    }

    function needRotate(video) {
        if (isException() || state.manualRotate || !state.settings) return false;
        if (!video || !video.videoWidth || !video.videoHeight) return false;
        
        var ratio = video.videoWidth / video.videoHeight;
        
        if (ratio > 1 && isRecordVideo(video)) {
            return ratio > 1.5;
        }
        
        return false;
    }

    function autoRotate() {
        if (!state.settings.autoVertical || !state.videoElement || state.manualRotate || !state.settings) return;
        
        var checkRotation = function() {
            if (state.videoElement.readyState >= 2) {
                var shouldRotate = needRotate(state.videoElement);
                
                if (shouldRotate && state.settings.rotate !== 90) {
                    setRotate(90);
                } else if (!shouldRotate && state.settings.rotate !== 0) {
                    if (!state.manualRotate) {
                        setRotate(0);
                    }
                }
            }
        };
        
        if (state.videoElement.readyState >= 2) {
            checkRotation();
        } else {
            state.videoElement.addEventListener("loadedmetadata", checkRotation, { once: true });
        }
    }

    // ===== 控制面板隐藏逻辑 =====
    function setupPanelHide(panel) {
        if (!panel || !state.settings) return;

        window.showControlPanel = function() {
            if (!panel) return;
            panel.classList.remove("hide", "hover-light");
            panel.classList.add("hover-full");
            startHideTimer();
        };

        function startHideTimer() {
            if (!state.settings.autoHide || !panel) return;
            clearTimeout(state.hideTimer);
            state.hideTimer = setTimeout(function() {
                panel.classList.remove("hover-full", "hover-light");
                panel.classList.add("hide");
            }, state.settings.hideDelay * 1000);
        }

        var videoWrap = document.querySelector(".bpx-player-wrap") || document.querySelector(".player-wrap");
        if (videoWrap) {
            videoWrap.addEventListener("mousemove", function() {
                if (panel.classList.contains("hide") && state.settings.autoHide) {
                    panel.classList.remove("hide");
                    panel.classList.add("hover-light");
                    startHideTimer();
                }
            });
        }

        panel.addEventListener("mouseenter", function() {
            clearTimeout(state.hideTimer);
            panel.classList.remove("hide", "hover-light");
            panel.classList.add("hover-full");
        });
        
        panel.addEventListener("mouseleave", function() {
            startHideTimer();
        });

        startHideTimer();
    }

    // ===== 快捷键（无冲突，支持0.01精度缩放）=====
    function setupShortcuts() {
        document.addEventListener("keydown", function(e) {
            if (!state.settings) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }
            
            var isOurShortcut = false;
            var key = e.key.toLowerCase();
            
            if (e.ctrlKey) {
                // 旋转快捷键
                if (key === "l") { // 左旋转90°
                    setRotate(state.settings.rotate - 90);
                    isOurShortcut = true;
                } else if (key === "r") { // 右旋转90°
                    setRotate(state.settings.rotate + 90);
                    isOurShortcut = true;
                } else if (key === "h") { // 一键横屏
                    setRotate(0);
                    isOurShortcut = true;
                } else if (key === "0") { // 重置
                    resetAll();
                    isOurShortcut = true;
                } 
                // 缩放快捷键（0.01精度）
                else if (key === "=" || key === "+") { // 放大
                    setScale(state.settings.scale + state.SCALE_STEP);
                    isOurShortcut = true;
                } else if (key === "-" || key === "_") { // 缩小
                    setScale(state.settings.scale - state.SCALE_STEP);
                    isOurShortcut = true;
                }
            }

            // 显示控制面板
            if (e.ctrlKey && e.shiftKey && key === "m") {
                if (window.showControlPanel) window.showControlPanel();
                isOurShortcut = true;
            }
            
            if (isOurShortcut) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }

    // ===== 控制面板创建（滑块支持0.01精度）=====
    function createControlPanel() {
        if (!state.settings) return;
        
        var oldPanel = document.getElementById("bilibili-video-control-panel");
        if (oldPanel) oldPanel.remove();
        
        state.controlPanel = document.createElement("div");
        state.controlPanel.id = "bilibili-video-control-panel";
        state.controlPanel.style.left = state.settings.panelX + "px";
        state.controlPanel.style.bottom = state.settings.panelY + "px";
        
        var player = document.querySelector(".bpx-player-container") || document.body;
        player.appendChild(state.controlPanel);
        
        function createButton(text, title, onClick, className) {
            var btn = document.createElement("button");
            btn.className = "bilibili-control-btn " + (className || "");
            btn.textContent = text;
            btn.title = title;
            btn.addEventListener("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                if (onClick) onClick();
            });
            return btn;
        }
        
        // 1. 旋转按钮组
        var rotateGroup = document.createElement("div");
        rotateGroup.className = "bilibili-control-group";
        
        rotateGroup.appendChild(createButton("📺", "一键横屏 (Ctrl+H)", function() {
            setRotate(0);
        }));
        
        rotateGroup.appendChild(createButton("↺", "左旋转90° (Ctrl+L)", function() {
            setRotate(state.settings.rotate - 90);
        }));
        
        rotateGroup.appendChild(createButton("↻", "右旋转90° (Ctrl+R)", function() {
            setRotate(state.settings.rotate + 90);
        }));
        
        var autoVerticalBtn = document.createElement("button");
        var autoVerticalClass = state.settings.autoVertical ? "active" : "inactive";
        autoVerticalBtn.className = "bilibili-control-btn bilibili-auto-vertical-btn " + autoVerticalClass;
        autoVerticalBtn.title = state.settings.autoVertical ? "自动竖屏已开启 ✅" : "自动竖屏已关闭 ❌";
        
        var dot = document.createElement("span");
        dot.className = "dot";
        autoVerticalBtn.appendChild(dot);
        
        autoVerticalBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
            state.settings.autoVertical = !state.settings.autoVertical;
            this.classList.toggle("active", state.settings.autoVertical);
            this.classList.toggle("inactive", !state.settings.autoVertical);
            this.title = state.settings.autoVertical ? "自动竖屏已开启 ✅" : "自动竖屏已关闭 ❌";
            state.manualRotate = false;
            saveSettings();
            autoRotate();
        });
        
        rotateGroup.appendChild(autoVerticalBtn);
        state.controlPanel.appendChild(rotateGroup);
        
        // 2. 例外列表按钮组
        var exceptionGroup = document.createElement("div");
        exceptionGroup.className = "bilibili-control-group";
        
        var exceptionBtn = createButton("🚫", isException() ? "已在例外列表" : "加入例外列表", function() {
            var bv = getBV();
            if (!bv) {
                alert("无法获取视频BV号");
                return;
            }
            
            var index = state.settings.exceptionList.indexOf(bv);
            
            if (index === -1) {
                state.settings.exceptionList.push(bv);
                alert("已添加到例外列表，本视频将不会自动旋转");
                exceptionBtn.title = "已在例外列表";
                exceptionBtn.classList.add("active");
            } else {
                state.settings.exceptionList.splice(index, 1);
                alert("已从例外列表中移除");
                exceptionBtn.title = "加入例外列表";
                exceptionBtn.classList.remove("active");
            }
            
            saveSettings();
            state.manualRotate = false;
            autoRotate();
        });
        
        if (isException()) {
            exceptionBtn.classList.add("active");
        }
        
        exceptionGroup.appendChild(exceptionBtn);
        exceptionGroup.appendChild(createButton("⟳", "重置所有 (Ctrl+0)", resetAll));
        exceptionGroup.appendChild(createButton("🗑️", "清空例外列表", function() {
            if (confirm("确定要清空所有例外列表吗？")) {
                state.settings.exceptionList = [];
                saveSettings();
                alert("例外列表已清空");
                if (exceptionBtn) {
                    exceptionBtn.title = "加入例外列表";
                    exceptionBtn.classList.remove("active");
                }
            }
        }));
        
        state.controlPanel.appendChild(exceptionGroup);
        
        // 3. 缩放滑块（0.01精度）
        var slider = document.createElement("input");
        slider.type = "range";
        slider.min = state.MIN_SCALE;
        slider.max = state.MAX_SCALE;
        slider.step = state.SCALE_STEP; // 0.01精度
        slider.value = state.settings.scale;
        slider.className = "bilibili-control-slider";
        
        // 滑块标题：显示当前阈值
        var isPortrait = state.settings.rotate % 180 === 90;
        var thresholdText = isPortrait ? "缩放≥0.66可拖拽" : "缩放≥1.01可拖拽";
        slider.title = "缩放比例 (" + state.MIN_SCALE + "x-" + state.MAX_SCALE + "x) | " + thresholdText;
        
        slider.addEventListener("input", function(e) {
            setScale(e.target.value);
        });
        
        slider.addEventListener("click", function(e) {
            e.stopPropagation();
        });
        
        state.controlPanel.appendChild(slider);
        
        // 4. 隐藏控制组
        var hideGroup = document.createElement("div");
        hideGroup.className = "bilibili-control-group bilibili-hide-group";
        
        var hideBtn = createButton("👁️", state.settings.autoHide ? "自动隐藏已开启" : "自动隐藏已关闭", function() {}, "hide-btn");
        hideBtn.classList.toggle("active", state.settings.autoHide);
        hideBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
            state.settings.autoHide = !state.settings.autoHide;
            this.classList.toggle("active", state.settings.autoHide);
            this.title = state.settings.autoHide ? "自动隐藏已开启" : "自动隐藏已关闭";
            saveSettings();
            setupPanelHide(state.controlPanel);
        });
        
        hideGroup.appendChild(hideBtn);
        
        // 延迟按钮
        var delays = [5, 8, 10, 12];
        var i;
        for (i = 0; i < delays.length; i++) {
            var delay = delays[i];
            var delayBtn = createButton(delay + "s", "延迟" + delay + "秒", function(d) {
                return function() {
                    state.settings.hideDelay = d;
                    saveSettings();
                    
                    var allDelayBtns = hideGroup.querySelectorAll(".bilibili-delay-btn");
                    var j;
                    for (j = 0; j < allDelayBtns.length; j++) {
                        allDelayBtns[j].classList.remove("active");
                    }
                    this.classList.add("active");
                    
                    setupPanelHide(state.controlPanel);
                };
            }(delay), "bilibili-delay-btn");
            
            if (delay === state.settings.hideDelay) {
                delayBtn.classList.add("active");
            }
            
            hideGroup.appendChild(delayBtn);
        }
        
        state.controlPanel.appendChild(hideGroup);
        
        // 5. 面板拖拽功能
        state.controlPanel.addEventListener("mousedown", function(e) {
            if (e.target.tagName === "BUTTON" || e.target.type === "range") return;
            
            state.isPanelDragging = true;
            var panelX = parseInt(state.controlPanel.style.left) || 0;
            var panelY = parseInt(state.controlPanel.style.bottom) || 0;
            var startX = e.clientX;
            var startY = e.clientY;
            
            e.preventDefault();
            
            function onPanelMouseMove(e) {
                if (!state.isPanelDragging) return;
                var deltaX = e.clientX - startX;
                var deltaY = startY - e.clientY;
                state.controlPanel.style.left = (panelX + deltaX) + "px";
                state.controlPanel.style.bottom = (panelY + deltaY) + "px";
            }
            
            function onPanelMouseUp() {
                state.isPanelDragging = false;
                state.settings.panelX = parseInt(state.controlPanel.style.left) || 0;
                state.settings.panelY = parseInt(state.controlPanel.style.bottom) || 0;
                saveSettings();
                document.removeEventListener("mousemove", onPanelMouseMove);
                document.removeEventListener("mouseup", onPanelMouseUp);
            }
            
            document.addEventListener("mousemove", onPanelMouseMove);
            document.addEventListener("mouseup", onPanelMouseUp);
        });
        
        setupPanelHide(state.controlPanel);
    }

    // ===== 主初始化函数 =====
    function init() {
        initSettings();
        
        var videoData = getVideoContainer();
        if (!videoData.container || !videoData.video) {
            setTimeout(init, 500);
            return;
        }
        
        state.videoContainer = videoData.container;
        state.videoElement = videoData.video;
        
        createControlPanel();
        setupWheelZoom();
        setupVideoDrag();
        setupShortcuts();
        
        updateVideoTransform();
        autoRotate();
        
        // 初始化提示：显示双阈值信息
        setTimeout(function() {
            showHint(state.zoomHint, "视频控制已加载完成 | 横屏≥1.01/竖屏≥0.66可拖拽 | 签名：花草丛丛", 3000);
        }, 1000);
    }

    // ===== 页面加载监听 =====
    function waitForVideo() {
        var videoData = getVideoContainer();
        if (videoData.container && videoData.video) {
            init();
        } else {
            var observer = new MutationObserver(function(mutations) {
                var videoData = getVideoContainer();
                if (videoData.container && videoData.video) {
                    init();
                    observer.disconnect();
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(function() {
                observer.disconnect();
            }, 10000);
        }
    }

    // ===== 主入口 =====
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            setTimeout(waitForVideo, 1000);
        });
    } else {
        setTimeout(waitForVideo, 1000);
    }
    
    // 监听B站PJAX页面切换
    document.addEventListener("pjax:complete", function() {
        setTimeout(waitForVideo, 500);
    });
    
    // 监听页面历史变化
    window.addEventListener("popstate", function() {
        setTimeout(waitForVideo, 500);
    });
})();