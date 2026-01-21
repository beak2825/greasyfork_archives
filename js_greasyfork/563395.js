// ==UserScript==
// @name         Subtitle Overlay (Dual Opacity & Blur Adjustment);色度模糊度双调节字幕遮挡条;字幕隠し (不透明度・ぼかしの個別調整)
// @description  Ctrl+X to toggle; Scroll for "Opacity"; Shift+Scroll for "Blur";Ctrl+X 开关; 滚轮调"白色浓度"; Shift+滚轮调"模糊度"; Ctrl+Xで切り替え; ホイールで"不透明度"; Shift+ホイールで"ぼかし"; 
// @author       everen
// @license      MIT
// @match        *://*/*
// @grant        none
// @version 0.0.1.20260120194031
// @namespace https://greasyfork.org/users/1494252
// @downloadURL https://update.greasyfork.org/scripts/563395/Subtitle%20Overlay%20%28Dual%20Opacity%20%20Blur%20Adjustment%29%3B%E8%89%B2%E5%BA%A6%E6%A8%A1%E7%B3%8A%E5%BA%A6%E5%8F%8C%E8%B0%83%E8%8A%82%E5%AD%97%E5%B9%95%E9%81%AE%E6%8C%A1%E6%9D%A1%3B%E5%AD%97%E5%B9%95%E9%9A%A0%E3%81%97%20%28%E4%B8%8D%E9%80%8F%E6%98%8E%E5%BA%A6%E3%83%BB%E3%81%BC%E3%81%8B%E3%81%97%E3%81%AE%E5%80%8B%E5%88%A5%E8%AA%BF%E6%95%B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563395/Subtitle%20Overlay%20%28Dual%20Opacity%20%20Blur%20Adjustment%29%3B%E8%89%B2%E5%BA%A6%E6%A8%A1%E7%B3%8A%E5%BA%A6%E5%8F%8C%E8%B0%83%E8%8A%82%E5%AD%97%E5%B9%95%E9%81%AE%E6%8C%A1%E6%9D%A1%3B%E5%AD%97%E5%B9%95%E9%9A%A0%E3%81%97%20%28%E4%B8%8D%E9%80%8F%E6%98%8E%E5%BA%A6%E3%83%BB%E3%81%BC%E3%81%8B%E3%81%97%E3%81%AE%E5%80%8B%E5%88%A5%E8%AA%BF%E6%95%B4%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

   // ================= Configuration Area =================
    const SCROLL_STEP = 0.05; // Opacity adjustment step;浓度(不透明度)调节步长;不透明度の調整幅 (ステップ)
    const BLUR_STEP = 2;      // Blur adjustment step (pixels);模糊调节步长 (像素);ぼかしの調整幅 (ピクセル)
    // ======================================================

    // --- 1. 读取历史设置 (分开读取) ---
    let currentOpacity = 0.1; // 默认浓度
    let currentBlur = 10;     // 默认模糊度 (px)

    try {
        const savedOpacity = localStorage.getItem('overlayOpacity_v32');
        const savedBlur = localStorage.getItem('overlayBlur_v32');
        
        if (savedOpacity !== null) currentOpacity = parseFloat(savedOpacity);
        if (savedBlur !== null) currentBlur = parseFloat(savedBlur);
    } catch (e) {
        currentOpacity = 0.1;
        currentBlur = 10;
    }

    // --- 2. 创建遮挡层 ---
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed !important;
        z-index: 2147483647 !important;
        cursor: move;
        display: none;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(0,0,0,0.1);
        touch-action: none;
    `;

    // --- 3. 初始化位置 (底部锚定) ---
    function initPosition() {
        let bottom = '10%';
        let left = '15%';
        let width = '70%';
        let height = '45px';

        try {
            const savedPosition = localStorage.getItem('overlayPosition_v3_anchor');
            if (savedPosition) {
                const pos = JSON.parse(savedPosition);
                if (parseInt(pos.left) > -1000) {
                    bottom = pos.bottom;
                    left = pos.left;
                    width = pos.width;
                    height = pos.height;
                }
            }
        } catch (e) {}

        overlay.style.top = 'auto';
        overlay.style.bottom = bottom;
        overlay.style.left = left;
        overlay.style.width = width;
        overlay.style.height = height;
    }

    initPosition();

    // --- 4. 样式应用 (两个参数独立应用) ---
    function applyStyles() {
        // 模糊度独立
        overlay.style.backdropFilter = `blur(${currentBlur}px)`;
        overlay.style.webkitBackdropFilter = `blur(${currentBlur}px)`;
        // 浓度独立
        overlay.style.background = `rgba(255,255,255,${currentOpacity})`;
        
        // 简单提示 (可选，如果你觉得不需要可以注释掉)
        // overlay.title = `浓度: ${Math.round(currentOpacity*100)}% | 模糊: ${currentBlur}px`;
    }

    applyStyles();
    overlay.dataset.tempHidden = 'false';
    document.body.appendChild(overlay);


    // --- 5. 滚轮调节 (双模式) ---
    overlay.addEventListener('wheel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // 核心逻辑：区分是否按住了 Shift
        if (e.shiftKey) {
            // === 按住 Shift：调节模糊度 ===
            if (e.deltaY < 0) {
                currentBlur = Math.min(currentBlur + BLUR_STEP, 50); // 最大50px模糊
            } else {
                currentBlur = Math.max(currentBlur - BLUR_STEP, 0);  // 最小0px
            }
            localStorage.setItem('overlayBlur_v32', currentBlur);
        } else {
            // === 直接滚动：调节白色浓度 ===
            if (e.deltaY < 0) {
                currentOpacity = Math.min(currentOpacity + SCROLL_STEP, 1.0);
            } else {
                currentOpacity = Math.max(currentOpacity - SCROLL_STEP, 0.0);
            }
            // 修正精度
            currentOpacity = parseFloat(currentOpacity.toFixed(2));
            localStorage.setItem('overlayOpacity_v32', currentOpacity);
        }
        
        applyStyles();
        return false;
    }, { passive: false, capture: true });


    // --- 6. 拖拽逻辑 (底部锚定) ---
    let isDragging = false;
    let dragStartMouseX, dragStartMouseY;
    let startLeft, startBottom;

    overlay.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        // 如果按住Shift，不触发拖拽（防止冲突），或者你也可以允许
        // if (e.shiftKey) return; 

        const rect = overlay.getBoundingClientRect();
        if (e.clientX >= rect.right - 20 && e.clientY >= rect.bottom - 20) {
            handleResize(e);
            return;
        }

        isDragging = true;
        dragStartMouseX = e.clientX;
        dragStartMouseY = e.clientY;

        const computedStyle = window.getComputedStyle(overlay);
        startLeft = parseInt(computedStyle.left);
        startBottom = window.innerHeight - rect.bottom; 

        overlay.style.cursor = 'move';
    });
    
    overlay.addEventListener('click', e => e.stopPropagation());
    overlay.addEventListener('dblclick', e => e.stopPropagation());

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            e.preventDefault();
            const deltaX = e.clientX - dragStartMouseX;
            const deltaY = e.clientY - dragStartMouseY;
            overlay.style.left = (startLeft + deltaX) + 'px';
            overlay.style.bottom = (startBottom - deltaY) + 'px';
            overlay.style.top = 'auto';
        } else {
            const rect = overlay.getBoundingClientRect();
            if (e.clientX >= rect.right - 20 && e.clientY >= rect.bottom - 20 && overlay.style.display !== 'none') {
                overlay.style.cursor = 'se-resize';
            } else if(overlay.style.display !== 'none') {
                overlay.style.cursor = 'move';
            }
        }
    });

    document.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            savePosition();
        }
    });

    function handleResize(downEvent) {
        downEvent.preventDefault();
        downEvent.stopPropagation();
        const startX = downEvent.clientX;
        const startY = downEvent.clientY;
        const startWidth = overlay.clientWidth;
        const startHeight = overlay.clientHeight;

        function onMouseMove(moveEvent) {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            const newHeight = startHeight + (moveEvent.clientY - startY);
            if (newWidth > 20) overlay.style.width = newWidth + 'px';
            if (newHeight > 10) overlay.style.height = newHeight + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            savePosition();
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function savePosition() {
        localStorage.setItem('overlayPosition_v3_anchor', JSON.stringify({
            bottom: overlay.style.bottom,
            left: overlay.style.left,
            width: overlay.style.width,
            height: overlay.style.height
        }));
    }

    // --- 7. 开关逻辑 ---
    function toggleOverlay() {
        if (overlay.style.display === 'none') {
            overlay.style.display = 'block';
            checkParent();
            applyStyles();
            overlay.dataset.tempHidden = 'false';
        } else {
            overlay.style.display = 'none';
            overlay.dataset.tempHidden = 'false';
        }
    }

    // --- 8. 全屏守护 ---
    function checkParent() {
        const fullEl = document.fullscreenElement;
        if (fullEl && overlay.parentNode !== fullEl) {
            fullEl.appendChild(overlay);
        } else if (!fullEl && overlay.parentNode !== document.body) {
            document.body.appendChild(overlay);
        }
    }
    document.addEventListener('fullscreenchange', checkParent);
    const observer = new MutationObserver((mutations) => { checkParent(); });
    observer.observe(document.body, { childList: true, subtree: true });

    // --- 9. 快捷键 ---
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && (e.key === 'x' || e.key === 'X')) {
            if (overlay.dataset.tempHidden === 'true') {
                overlay.dataset.tempHidden = 'false';
                return;
            }
            toggleOverlay();
        }
        else if (e.key === 'Control') {
            if (overlay.style.display !== 'none') {
                overlay.style.display = 'none';
                overlay.dataset.tempHidden = 'true';
            }
        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'Control') {
            if (overlay.dataset.tempHidden === 'true') {
                overlay.style.display = 'block';
                applyStyles();
                overlay.dataset.tempHidden = 'false';
            }
        }
    });

})();