// ==UserScript==
// @name         💙💛乌克兰国旗与向日葵 (Ctrl+Shift+U)
// @namespace    tampermonkey.net
// @version      14.1
// @description  写实花头 + 不规则分布向日葵与物理对齐修复 + 自适应窗口宽度≥800px + 禁止在iframe中显示 + [优化]仅限旗杆区域拖动。
// @author       邢智轩
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560536/%F0%9F%92%99%F0%9F%92%9B%E4%B9%8C%E5%85%8B%E5%85%B0%E5%9B%BD%E6%97%97%E4%B8%8E%E5%90%91%E6%97%A5%E8%91%B5%20%28Ctrl%2BShift%2BU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560536/%F0%9F%92%99%F0%9F%92%9B%E4%B9%8C%E5%85%8B%E5%85%B0%E5%9B%BD%E6%97%97%E4%B8%8E%E5%90%91%E6%97%A5%E8%91%B5%20%28Ctrl%2BShift%2BU%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isTerminated = false;

    // 封装一个统一的“是否允许运行”判断
    function canRun() {
        return window.innerWidth >= 800 && window.self === window.top;
    }

    // 初始化时的宽度判断
    if (!canRun()) {
        console.log('[UA Flag] 脚本暂停：宽度小于 800px 或在 iframe 内运行。');
    } else {
        console.log('[UA Flag] 脚本已启动：宽度 >= 800px 且为顶级窗口。');
    }

    function injectBadge() {
        // 检查环境是否允许，防止在iframe或小屏下注入
        if (!canRun()) return;
        // 防止重复注入
        if (document.getElementById('ua-waving-badge-root')) return;

        // 创建宿主容器
        const host = document.createElement('div');
        host.id = 'ua-waving-badge-root';
        // 注意：这里移除了 cursor: move，因为我们会把它加在拖动手柄上
        host.style.cssText = `
            position: fixed !important;
            bottom: 60px !important;
            left: 60px !important;
            z-index: 2147483647 !important;
            pointer-events: auto !important;
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
            opacity: 0;
            transform: translateX(-20px) scale(0.9);
        `;
        document.documentElement.appendChild(host);

        // --- 拖拽逻辑 ---
        let isDragging = false;
        let offsetX, offsetY;

        // 定义拖拽处理函数
        const handleMouseDown = (e) => {
            if (e.button !== 0) return; // 仅限左键
            isDragging = true;
            const rect = host.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            host.style.transition = 'none'; // 拖拽时禁用过渡动画
            e.preventDefault();
        };

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            host.style.left = `${x}px`;
            host.style.top = `${y}px`;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            host.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        // --- 注入 Shadow DOM ---
        const shadow = host.attachShadow({ mode: 'closed' });

        // 三叉戟图标 (Base64)
        const tridentSvg = `data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDAgTDg1IDQ1IEw0MCA0NSBRMjAgNDUgMjAgODAgTDIwIDE4MCBRMjAgMjIwIDUwIDIyMCBMNjUgMjIwIEw2NSAxOTAgTDUwIDE5MCBRNDAgMTkwIDQwIDE3NSBMNDAgOTAgTDc1IDkwIEw4MCAxODAgUTgyIDI1MCAxMDAgMjUwIFExMTggMjUwIDEyMCAxODAgTDEyNSA5MCBMMTYwIDkwIEwxNjAgMTc1IFExNjAgMTkwIDE1MCAxOTAgTDEzNSAxOTAgTDEzNSAyMjAgTDE1MCAyMjAgUTE4MCAyMjAgMTgwIDE4MCBMMTgwIDgwIFExODAgNDUgMTYwIDQ1IEwxMTUgNDUgWiBNMTAwIDI2MCBMOTAgMzAwIEwxMTAgMzAwIFoiIGZpbGw9IiNGRkQ3MDAiLz48L3N2Zz4=`;

        shadow.innerHTML = `
        <style>
            .container {
                position: relative;
                width: 320px;
                height: 200px;
                display: flex;
                align-items: flex-end;
                user-select: none;
                -webkit-user-select: none;
                overflow: hidden; /* 防止手柄溢出 */
            }
            /* --- 新增：拖动热区 --- */
            .drag-handle {
                position: absolute;
                left: 25px; /* 定位在旗杆附近 */
                top: 20px;
                width: 40px; /* 比旗杆稍宽，便于点击 */
                height: 160px; /* 覆盖整个旗杆高度 */
                z-index: 999; /* 确保在最上层 */
                cursor: move; /* 鼠标变为移动图标 */
            }
            .pole-system {
                position: absolute;
                left: 40px;
                bottom: 20px;
                height: 160px;
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 100;
                pointer-events: none; /* 让旗杆本身不阻挡点击，实际上由 drag-handle 处理 */
            }
            .pole-top {
                width: 14px;
                height: 14px;
                background: radial-gradient(circle at 35% 35%, #fff9e6 0%, #ffd700 45%, #8b6914 100%);
                border-radius: 50%;
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
                margin-bottom: -2px;
            }
            .pole-body {
                width: 8px;
                height: 100%;
                background: linear-gradient(to right, #4d3d00 0%, #8b6914 15%, #ffd700 40%, #fff9e6 55%, #ffd700 70%, #8b6914 85%, #4d3d00 100%);
                border-radius: 0 0 4px 4px;
            }
            .flag-wrapper {
                position: absolute;
                left: 44px;
                top: 35px;
                width: 150px;
                height: 90px;
                perspective: 1200px;
                z-index: 50;
                pointer-events: none; /* 禁用旗面的拖动干扰 */
            }
            .flag {
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
                transform-origin: left center;
                animation: cinematic-wave 6s infinite ease-in-out;
            }
            .fabric {
                position: absolute;
                inset: 0;
                background: linear-gradient(to bottom, #0057B7 50%, #FFD700 50%);
                border-radius: 0 4px 4px 0;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: inset 12px 0 15px rgba(0,0,0,0.5);
            }
            .shading {
                position: absolute;
                inset: 0;
                background: linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.2) 25%, rgba(0,0,0,0.3) 50%, rgba(255,255,255,0.2) 75%, rgba(0,0,0,0.15) 100%);
                background-size: 200% 100%;
                animation: move-shade 4s infinite linear;
                mix-blend-mode: overlay;
            }
            .trident {
                width: 30px;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
                transform: translateZ(10px);
            }
            .garden {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 280px;
                height: 85px;
                z-index: 150;
                pointer-events: none;
            }
            .sunflower {
                position: absolute;
                bottom: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                transform-origin: bottom center;
                animation: flower-sway 5s infinite ease-in-out;
            }
            .flower-head {
                width: 24px;
                height: 24px;
                position: relative;
            }
            .petals {
                position: absolute;
                inset: 0;
                background: radial-gradient(ellipse at center, #FFD700 35%, transparent 75%),
                            repeating-conic-gradient(from 0deg, #FFC107 0deg 20deg, #F57F17 20deg 40deg);
                border-radius: 50%;
            }
            .petals::before {
                content: '';
                position: absolute;
                inset: -3px;
                background: repeating-conic-gradient(from 10deg, transparent 0deg 15deg, #FFD700 15deg 35deg, transparent 35deg 40deg);
                border-radius: 50%;
                mask: radial-gradient(circle, black 40%, transparent 85%);
                -webkit-mask: radial-gradient(circle, black 40%, transparent 85%);
            }
            .core {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                background: #3E2723;
                border-radius: 50%;
                box-shadow: inset 0 0 3px #000;
                z-index: 2;
            }
            .stem {
                width: 2.5px;
                background: linear-gradient(to right, #1B5E20, #388E3C, #1B5E20);
                border-radius: 2px;
                position: relative;
            }
            .sf-leaf {
                position: absolute;
                width: 9px;
                height: 6px;
                background: radial-gradient(at 20% 20%, #66BB6A, #1B5E20);
                border-radius: 1px 80% 1px 80%;
            }
            .leaf-L { left: -8px; top: 12px; transform: rotate(-20deg); }
            .leaf-R { right: -8px; top: 18px; transform: scaleX(-1) rotate(-20deg); }

            /* 向日葵位置设定 */
            .sf1 { left: 18px; transform: scale(0.6); animation-delay: -0.2s; } .sf1 .stem { height: 35px; }
            .sf2 { left: 35px; transform: scale(0.85); animation-delay: -1.5s; z-index: 152; } .sf2 .stem { height: 58px; }
            .sf3 { left: 48px; transform: scale(0.55); animation-delay: -2.8s; } .sf3 .stem { height: 28px; }
            .sf4 { left: 85px; transform: scale(0.7); animation-delay: -3.3s; } .sf4 .stem { height: 45px; }
            .sf5 { left: 110px; transform: scale(0.75); animation-delay: -0.9s; } .sf5 .stem { height: 52px; }
            .sf6 { left: 155px; transform: scale(0.6); animation-delay: -4.1s; } .sf6 .stem { height: 40px; }
            .sf7 { left: 180px; transform: scale(0.8); animation-delay: -2.5s; } .sf7 .stem { height: 62px; }
            .sf8 { left: 215px; transform: scale(0.65); animation-delay: -1.2s; } .sf8 .stem { height: 38px; }
            .sf9 { left: 25px; bottom: 8px; transform: scale(0.45); animation-delay: -1.1s; z-index: 160; } .sf9 .stem { height: 18px; }
            .sf10 { left: 70px; bottom: 5px; transform: scale(0.4); animation-delay: -3.7s; z-index: 160; } .sf10 .stem { height: 15px; }
            .sf11 { left: 135px; bottom: 10px; transform: scale(0.5); animation-delay: -0.5s; z-index: 160; } .sf11 .stem { height: 22px; }
            .sf12 { left: 195px; bottom: 4px; transform: scale(0.4); animation-delay: -2.9s; z-index: 160; } .sf12 .stem { height: 16px; }

            @keyframes cinematic-wave {
                0%, 100% { transform: rotateY(12deg) rotateX(2deg); }
                50% { transform: rotateY(26deg) rotateX(-2deg); }
            }
            @keyframes flower-sway {
                0%, 100% { transform: rotate(-3deg); }
                50% { transform: rotate(3deg); }
            }
            @keyframes move-shade {
                from { background-position: 0% 0; }
                to { background-position: 200% 0; }
            }
        </style>

        <div class="container">
            <!-- 新增：拖动手柄区域 -->
            <div class="drag-handle"></div>

            <div class="pole-system">
                <div class="pole-top"></div>
                <div class="pole-body"></div>
            </div>

            <div class="flag-wrapper">
                <div class="flag">
                    <div class="fabric">
                        <div class="shading"></div>
                        <img src="${tridentSvg}" class="trident" />
                    </div>
                </div>
            </div>

            <div class="garden">
                <div class="sunflower sf1"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"><div class="sf-leaf leaf-L"></div></div></div>
                <div class="sunflower sf2"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"><div class="sf-leaf leaf-R"></div></div></div>
                <div class="sunflower sf3"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"></div></div>
                <div class="sunflower sf4"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"><div class="sf-leaf leaf-L"></div></div></div>
                <div class="sunflower sf5"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"></div></div>
                <div class="sunflower sf6"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"></div></div>
                <div class="sunflower sf7"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"><div class="sf-leaf leaf-R"></div></div></div>
                <div class="sunflower sf8"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"></div></div>
                <div class="sunflower sf9"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"></div></div>
                <div class="sunflower sf10"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"></div></div>
                <div class="sunflower sf11"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"></div></div>
                <div class="sunflower sf12"><div class="flower-head"><div class="petals"></div><div class="core"></div></div><div class="stem"></div></div>
            </div>
        </div>`;

        // 将 mousedown 事件绑定到新的拖动手柄上，而不是整个 host
        const dragHandle = shadow.querySelector('.drag-handle');
        if (dragHandle) {
            dragHandle.addEventListener('mousedown', handleMouseDown);
        }

        // 入场动画
        requestAnimationFrame(() => {
            host.style.opacity = '1';
            host.style.transform = 'translateX(0) scale(1)';
        });
    }

    // 监听键盘快捷键 Ctrl + Shift + U
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyU') {
            const root = document.getElementById('ua-waving-badge-root');
            if (root) {
                // 如果存在，则隐藏并移除
                root.style.opacity = '0';
                root.style.transform = 'translateX(-20px) scale(0.9)';
                setTimeout(() => { root.remove(); isTerminated = true; }, 800);
            } else {
                // 如果不存在，且环境允许，则创建
                if (!canRun()) return;
                isTerminated = false;
                injectBadge();
            }
        }
    }, true);

    // 定时保活机制：防止被其他脚本移除
    setInterval(() => {
        if (!isTerminated && canRun()) {
            injectBadge();
        }
    }, 3000);

    // 窗口尺寸改变监听
    window.addEventListener('resize', () => {
        if (!canRun()) {
            // 如果窗口变小或进入iframe，移除徽章
            const root = document.getElementById('ua-waving-badge-root');
            if (root) {
                root.remove();
            }
            isTerminated = true;
        } else {
            // 如果窗口变大恢复顶级，重新注入
            isTerminated = false;
            injectBadge();
        }
    });

    // 初始注入
    injectBadge();
})();