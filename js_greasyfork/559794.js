// ==UserScript==
// @name         BGA Modern
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add a clean slider to #upperrightmenu to scale #left-side-wrapper
// @author       Gemini
// @match        https://boardgamearena.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamearena.com
// @grant        GM_addStyle
// // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559794/BGA%20Modern.user.js
// @updateURL https://update.greasyfork.org/scripts/559794/BGA%20Modern.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        targetId: '#left-side-wrapper',
        parentId: '#upperrightmenu', // 目标父容器
        sliderId: 'bga-custom-scale-slider-container',
        minScale: 0.5,
        maxScale: 1.0,
        defaultScale: 1.0,
        step: 0.05 // 步长改为 0.01
    };

    // 注入自定义 CSS (为了美化滑块，让它在白色顶栏看不突兀)
    const style = document.createElement('style');
    style.innerHTML = `
        /* 滑块容器 */
        #${CONFIG.sliderId} {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            margin-right: 15px; /* 与右侧原有图标的间距 */
            vertical-align: middle;
        }

        /* 移除浏览器默认样式 */
        input[type=range].bga-scale-range {
            -webkit-appearance: none;
            width: 120px !important;
            height: 4px;
            background: #e0e0e0 !important;
            border-radius: 2px;
            outline: none;
            cursor: pointer;
            padding: unset !important;
            border: unset !important;
        }

        /* 滑块圆点 (Chrome/Safari/Edge) */
        .bga-scale-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #2c3e50; /* 深色圆点，符合BGA风格 */
            cursor: pointer;
            transition: background .15s ease-in-out;
            border: 2px solid #fff; /* 白色描边增加层次感 */
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        /* 鼠标悬停变色 */
        .bga-scale-range::-webkit-slider-thumb:hover {
            background: #4a90e2; /* BGA蓝 */
            transform: scale(1.1);
        }

        /* Firefox 兼容 */
        .bga-scale-range::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border: 2px solid #fff;
            border-radius: 50%;
            background: #2c3e50;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);

    // 初始化滑块
    function initSlider(targetElement, parentElement) {
        if (document.getElementById(CONFIG.sliderId)) return;

        // 1. 设置目标的 transform-origin
        targetElement.style.transformOrigin = 'top center';
        targetElement.style.transition = 'transform 0.1s linear'; // 响应更快一点

        // 2. 创建容器
        const container = document.createElement('div');
        container.id = CONFIG.sliderId;

        // 3. 创建滑块
        const rangeInput = document.createElement('input');
        rangeInput.type = 'range';
        rangeInput.className = 'bga-scale-range'; // 应用上面定义的CSS类
        rangeInput.min = CONFIG.minScale;
        rangeInput.max = CONFIG.maxScale;
        rangeInput.step = CONFIG.step;
        rangeInput.value = CONFIG.defaultScale;
        rangeInput.title = `缩放左侧面板 (双击复原)`; // 鼠标悬停提示

        // 4. 事件绑定
        rangeInput.addEventListener('input', function(e) {
            targetElement.style.transform = `scale(${e.target.value})`;
        });

        // 双击复原
        rangeInput.addEventListener('dblclick', function() {
            rangeInput.value = 1.0;
            targetElement.style.transform = `scale(1)`;
        });

        // 5. 插入到 #upperrightmenu 的第一个位置
        container.appendChild(rangeInput);
        parentElement.prepend(container);
    }

    // 定时检查器
    const checkInterval = setInterval(() => {
        const target = document.querySelector(CONFIG.targetId); // 左侧面板
        const parent = document.querySelector(CONFIG.parentId); // 顶部菜单
        const sliderContainer = document.getElementById(CONFIG.sliderId);

        // 只有当 左侧面板 和 顶部菜单 同时存在时，才显示滑块
        if (target && parent) {
            // 确保样式始终生效
            if (target.style.transformOrigin !== 'top center') {
                target.style.transformOrigin = 'top center';
            }

            if (!sliderContainer) {
                initSlider(target, parent);
            }
        } else {
            // 如果离开了游戏页面（左侧面板消失），则移除顶部的滑块，保持界面整洁
            if (sliderContainer) {
                sliderContainer.remove();
            }
        }
    }, 1000);

      const myCustomStyle = `
.bga-item-shadow-medium,
.bga-page-section-shadow,
.bga-button-holder,
.game_interface #page-title,
.player_board_inner,
.bga-omni-bar:after {
	box-shadow: unset !important;
}

.bga-page-section .bga-page-section__content {
	background-image: unset;
}

.bga-omni-bar input {
	background: unset !important;
	border-bottom-right-radius: 0;
	border-top-right-radius: 0;
}

.bga-menu-bar {
	background: white;
}

.bgabutton_grey,
.bgabutton_gray {
	background: white !important;
	border: 0.4px solid #ffffff !important;
	color: #333;
}

#upperrightmenu {
	display: flex;
	align-items: center;
	margin-right: 12px;
}

/* 遥远之地bug */
.fa_zone_desc {
    width: unset !important;
}
    `;

    /**
     * 注入样式函数
     * 优先使用 GM_addStyle (油猴内置)，如果不可用则回退到原生 JS 注入
     */
    function injectStyle(css) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    // 执行注入
    injectStyle(myCustomStyle);

    // 如果某些样式在页面完全加载后被原站脚本覆盖，可以尝试在 window.onload 时再次注入
    window.addEventListener('load', () => {
        injectStyle(myCustomStyle);
    }, false);

})();