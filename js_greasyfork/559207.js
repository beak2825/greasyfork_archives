// ==UserScript==
// @name         scroll-button
// @namespace    https://github.com/livinginpurple
// @version      20251230.10
// @description  scroll-button (Draggable, Auto-Fade, Bright-on-Stop)
// @license      WTFPL
// @author       livinginpurple
// @include      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559207/scroll-button.user.js
// @updateURL https://update.greasyfork.org/scripts/559207/scroll-button.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const init = () => {
        const btnId = 'gamma-scroll-btn';
        if (document.getElementById(btnId)) return;

        // 注入樣式
        const style = document.createElement('style');
        style.textContent = `
            #${btnId} {
                position: fixed;
                right: 20px;
                bottom: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                box-shadow: 0 0.2rem 0.5rem rgba(0,0,0,0.3);
                z-index: 10000;
                cursor: grab;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: opacity 0.5s ease-in-out, transform 0.1s, background-color 0.2s;
                touch-action: none;
                padding: 0;
            }
            #${btnId} svg {
                width: 20px;
                height: 20px;
                fill: currentColor;
            }
            #${btnId}.is-dragging {
                cursor: grabbing;
                transform: scale(1.1);
            }
            
            /* Light Mode (適合淺色背景，按鈕為深色) */
            #${btnId} {
                background-color: rgba(33, 37, 41, 0.9);
                color: #fff;
            }
            #${btnId}:hover, #${btnId}.is-dragging {
                background-color: rgba(0, 0, 0, 1);
                transform: scale(1.1);
            }
            
            /* Dark Mode (適合深色背景，按鈕為亮色) */
            @media (prefers-color-scheme: dark) {
                #${btnId} {
                    background-color: rgba(240, 240, 240, 0.9);
                    color: #000;
                    border: 1px solid rgba(0,0,0,0.1);
                }
                #${btnId}:hover, #${btnId}.is-dragging {
                    background-color: rgba(255, 255, 255, 1);
                }
            }
            
            /* Trash Zone (刪除區域) */
            #gamma-trash-zone {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: rgba(0, 0, 0, 0.5);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s, transform 0.2s, background-color 0.2s;
            }
            #gamma-trash-zone.visible {
                opacity: 1;
            }
            #gamma-trash-zone.active {
                transform: translate(-50%, -50%) scale(1.2);
                background-color: rgba(220, 53, 69, 0.9); /* Red */
            }
            #gamma-trash-zone svg {
                width: 24px;
                height: 24px;
                fill: currentColor;
            }
        `;
        document.head.appendChild(style);

        // SVG 圖示
        const icons = {
            up: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/></svg>`,
            down: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/></svg>`
        };

        const btn = document.createElement('button');
        btn.id = btnId;
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Scroll navigation');

        // 初始透明度 (樣式由 CSS style 標籤控制)
        btn.style.opacity = '0.3';

        // 互動視覺效果
        btn.onmouseenter = () => { manualWakeUp(); };
        // btn.onmouseleave = null; // 不需要
        btn.ontouchstart = () => { manualWakeUp(); };

        document.body.appendChild(btn);

        // Trash Zone Element
        const trashZone = document.createElement('div');
        trashZone.id = 'gamma-trash-zone';
        trashZone.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>`;
        document.body.appendChild(trashZone);

        // --- 狀態管理 ---
        const State = { TOP: 'top', SCROLLED: 'scrolled' };

        // Timer 變數
        let scrollStopTimer = null; // 用來偵測是否停止滑動
        let fadeTimer = null;       // 用來計算 3 秒後變暗

        // 更新圖示 (不涉及透明度)
        const updateIconState = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const isAtTop = scrollTop < 50;
            const nextState = isAtTop ? State.TOP : State.SCROLLED;

            if (btn.dataset.state === nextState) return;

            if (isAtTop) {
                btn.innerHTML = icons.down;
                btn.dataset.state = State.TOP;
            } else {
                btn.innerHTML = icons.up;
                btn.dataset.state = State.SCROLLED;
            }
        };

        // --- 核心邏輯：滑動停止偵測 ---
        const handleScroll = () => {
            // 1. 滑動中：確保是 0.3
            // 為了避免頻繁操作 DOM，只在需要時設定
            if (btn.style.opacity !== '0.3') {
                btn.style.opacity = '0.3';
            }

            updateIconState();

            // 2. 清除之前的計時器 (因為還在滑)
            if (scrollStopTimer) clearTimeout(scrollStopTimer);
            if (fadeTimer) clearTimeout(fadeTimer);

            // 3. 設定新的偵測計時器
            // 如果 150ms 內沒有新的 scroll 事件，就視為「停止滑動」
            scrollStopTimer = setTimeout(() => {
                // --- 滑動停止時執行 ---
                btn.style.opacity = '1'; // 亮起

                // 設定 3 秒後變暗
                fadeTimer = setTimeout(() => {
                    btn.style.opacity = '0.3';
                }, 3000);

            }, 150);
        };

        // 手動操作 (點擊/拖曳) 的喚醒邏輯
        const manualWakeUp = () => {
            btn.style.opacity = '1';
            if (scrollStopTimer) clearTimeout(scrollStopTimer);
            if (fadeTimer) clearTimeout(fadeTimer);

            // 操作後也是等 3 秒變暗
            fadeTimer = setTimeout(() => {
                btn.style.opacity = '0.3';
            }, 3000);
        };

        // --- 拖曳邏輯 ---
        let isPressed = false;
        let isDragging = false;
        let startX, startY, dragOffsetX, dragOffsetY;

        const onDragStart = (e) => {
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            isPressed = true;
            isDragging = false;
            startX = clientX;
            startY = clientY;

            const rect = btn.getBoundingClientRect();
            dragOffsetX = clientX - rect.left;
            dragOffsetY = clientY - rect.top;

            btn.classList.add('is-dragging');
            manualWakeUp(); // 拖曳開始，喚醒
        };

        const onDragMove = (e) => {
            if (!isPressed) return;

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            const moveX = clientX - startX;
            const moveY = clientY - startY;
            const distance = Math.sqrt(moveX * moveX + moveY * moveY);

            if (!isDragging && distance < 10) return;

            if (!isDragging) {
                isDragging = true;
                // btn.style.cursor = 'grabbing'; // Handled by CSS
                const rect = btn.getBoundingClientRect();
                btn.style.left = rect.left + 'px';
                btn.style.top = rect.top + 'px';
                btn.style.right = 'auto';
                btn.style.bottom = 'auto';

                // Show trash zone
                trashZone.classList.add('visible');
            }

            let newX = clientX - dragOffsetX;
            let newY = clientY - dragOffsetY;
            const maxX = window.innerWidth - 40;
            const maxY = window.innerHeight - 40;

            btn.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            btn.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';

            manualWakeUp(); // 拖曳中保持喚醒

            // Check collision with trash zone
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const btnRect = btn.getBoundingClientRect();
            // User center of button
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            const dist = Math.hypot(centerX - btnCenterX, centerY - btnCenterY);
            if (dist < 80) { // 接近中心 80px
                trashZone.classList.add('active');
                btn.style.opacity = '0.5'; // Visual feedback on button too
            } else {
                trashZone.classList.remove('active');
                btn.style.opacity = '1';
            }
        };

        const onDragEnd = () => {
            isPressed = false;
            btn.classList.remove('is-dragging');
            btn.style.cursor = '';

            if (trashZone.classList.contains('active')) {
                // Confirm Delete
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('mousemove', onDragMove);
                window.removeEventListener('mouseup', onDragEnd);
                window.removeEventListener('touchmove', onDragMove);
                window.removeEventListener('touchend', onDragEnd);
                if (scrollStopTimer) clearTimeout(scrollStopTimer);
                if (fadeTimer) clearTimeout(fadeTimer);

                btn.remove();
                trashZone.remove();
                return;
            }

            trashZone.classList.remove('visible', 'active');
        };

        btn.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);

        btn.addEventListener('touchstart', onDragStart, { passive: false });
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('touchend', onDragEnd);

        // --- 點擊邏輯 ---
        btn.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
                e.stopImmediatePropagation();
                isDragging = false;
                return;
            }
            e.preventDefault();
            manualWakeUp();

            if (btn.dataset.state === State.TOP) {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        // 綁定 Scroll 事件
        window.addEventListener('scroll', handleScroll, { passive: true });

        // 初始化
        updateIconState();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();