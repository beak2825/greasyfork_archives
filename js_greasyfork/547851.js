// ==UserScript==
// @name         Better Jstris UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A simpler and cleaner interface
// @author       zHyko
// @match        https://jstris.jezevec10.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547851/Better%20Jstris%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/547851/Better%20Jstris%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const minimalStyles = `
        button {
            background-color: transparent;
            color: white;
            border: none;

            position: relative;
            display: inline-block;
            text-decoration: none;
            overflow: hidden;
            transition: color 0.3s ease;
        }


        /* 下方横线 */
        button::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2px;
            background-color: #FFF;
        }

        /* 背景动画层 */
        button::before {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background-color: #FFF;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.4s ease;
          z-index: -1;
        }

        /* 悬停时触发动画和文字颜色变化 */
        button:hover::before {
          transform: scaleY(1);
        }

        button:hover {
          color: black;
        }

        #bgLayer {
            opacity: 0.5;
            border-radius: 10px;
        }
        .slots .np canvas.bgLayer {
            opacity: 0.5;
        }

        #myCanvas {
            border-radius: 10px;
        }
        #queueCanvas {
            border-bottom-right-radius: 10px;
            border-top-right-radius: 10px;
            background-color: rgba(0, 0, 0, 0.5);
        }
        #holdCanvas {
            border-bottom-left-radius: 10px;
            border-top-left-radius: 10px;
            background-color: rgba(0, 0, 0, 0.5);
        }

        .navbar-default {
            background-color: rgba(0, 0, 0, 0.3) !important;;
        }
        #chatBox {
            background-color: rgba(0, 0, 0, 0.3) !important;
        }
        .prMenuItem {
            background-color: rgba(0, 0, 0, 0.5) !important;
        }
        #practiceMenu {
            background-color: transparent !important;
        }

        body {
            background: url("https://images.unsplash.com/photo-1743452548596-7095486ee7e9?q=80&w=1921&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") no-repeat center center / cover !important;
        }

        /* overlay 基础样式 */
        .overlay-base {
            position: absolute;
            pointer-events: none;
            z-index: 3;
        }
        .overlay-body {
            z-index: -100;
            background-color: rgba(0,0,0,0.7);
        }
        .overlay-canvas {
            border: 2px solid white;
            border-radius: 10px;
        }

        .overlay-queue {
            border-left: 2px solid transparent;
            border-image: linear-gradient(to right, #FFF, #FFF) 1;
        }

        .overlay-hold {
            border-right: 2px solid transparent;
            border-image: linear-gradient(to right, #FFF, #FFF) 1;
        }
    `;

    window.addEventListener('load', () => {
        GM_addStyle(minimalStyles);
    });
    /**
     * 添加渐变描边 overlay
     * @param {string} targetSelector - 目标元素选择器
     * @param {string} className - 给 overlay 添加的额外 class（需在 CSS 中定义）
     */
    function addGradientOverlay(targetSelector, className = '') {
        const elements = document.querySelectorAll(targetSelector);
        if (!elements.length) return;

        elements.forEach((el) => {
            const overlay = document.createElement('div');
            overlay.classList.add('overlay-base');
            if (className) overlay.classList.add(className);

            document.body.appendChild(overlay);

            function updatePosition() {
                const rect = el.getBoundingClientRect();
                overlay.style.top = rect.top + window.scrollY + 'px';
                overlay.style.left = rect.left + window.scrollX + 'px';
                overlay.style.width = rect.width + 'px';
                overlay.style.height = rect.height + 'px';
            }

            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition);

            const resizeObserver = new ResizeObserver(updatePosition);
            resizeObserver.observe(el);
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        addGradientOverlay('body', 'overlay-body');
        addGradientOverlay('#myCanvas', 'overlay-canvas');
        document.getElementById("queueCanvas").style.marginLeft = "0";
        addGradientOverlay('#queueCanvas', 'overlay-queue');
        addGradientOverlay('#holdCanvas', 'overlay-hold');
    });

})();