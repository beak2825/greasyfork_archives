// ==UserScript==
// @name         图片显示控制器 (悬浮/防越界/防误触/可拖动)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  在URL以 page.htm 结尾的页面上，用一个可拖动、防误触、防越界、带悬浮透明度效果的切换按钮控制 id="d-container" 元素内部图片的显示和隐藏
// @author       湘铭呀！
// @match        https://www.bbc.edu.cn/*page.htm
// @grant        none
// @license      MPL-2.0 License
// @downloadURL https://update.greasyfork.org/scripts/548010/%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%E6%8E%A7%E5%88%B6%E5%99%A8%20%28%E6%82%AC%E6%B5%AE%E9%98%B2%E8%B6%8A%E7%95%8C%E9%98%B2%E8%AF%AF%E8%A7%A6%E5%8F%AF%E6%8B%96%E5%8A%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548010/%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%E6%8E%A7%E5%88%B6%E5%99%A8%20%28%E6%82%AC%E6%B5%AE%E9%98%B2%E8%B6%8A%E7%95%8C%E9%98%B2%E8%AF%AF%E8%A7%A6%E5%8F%AF%E6%8B%96%E5%8A%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const dContainer = document.getElementById('d-container');

        if (!dContainer) {
            console.log('油猴脚本: 未找到 id="d-container" 的元素，脚本停止运行。');
            return;
        }

        let imagesHidden = false;

        // --- 按钮创建和样式 ---
        const toggleButton = document.createElement('button');
        toggleButton.id = 'imageToggleButton';
        toggleButton.textContent = '隐藏图片';
        document.body.appendChild(toggleButton);

        const buttonStyle = document.createElement('style');
        // --- 主要修改点在这里 ---
        buttonStyle.innerHTML = `
            #imageToggleButton {
                position: fixed;
                top: 15px;
                right: 15px;
                left: unset;
                z-index: 10000;
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                -webkit-font-smoothing: antialiased;
                user-select: none;

                /* 1. 默认状态下设置透明度 */
                opacity: 0.6;

                /* 2. 将 opacity 加入到 transition 中，使变化更平滑 */
                transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease, opacity 0.3s ease;
            }
            #imageToggleButton:hover {
                /* 3. 鼠标悬浮时，完全不透明 */
                opacity: 1;

                transform: translateY(-2px);
                box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
            }
            #imageToggleButton.hide-mode { background-color: #f44336; color: white; }
            #imageToggleButton.show-mode { background-color: #4CAF50; color: white; }
            #imageToggleButton:active { transform: translateY(0); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        `;
        document.head.appendChild(buttonStyle);
        toggleButton.className = 'hide-mode';


        // --- 统一处理点击和拖动的交互逻辑 (无变动) ---
        makeInteractive(toggleButton);

        function makeInteractive(element) {
            let hasDragged = false;
            let initialMouseX, initialMouseY;
            let initialElementX, initialElementY;
            let elementWidth, elementHeight;

            element.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                hasDragged = false;
                initialMouseX = e.clientX;
                initialMouseY = e.clientY;
                const rect = element.getBoundingClientRect();
                initialElementX = rect.left;
                initialElementY = rect.top;
                elementWidth = rect.width;
                elementHeight = rect.height;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            function onMouseMove(e) {
                const dx = e.clientX - initialMouseX;
                const dy = e.clientY - initialMouseY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                    hasDragged = true;
                }
                if (hasDragged) {
                    if (element.style.cursor !== 'move') {
                        element.style.transition = 'none';
                        element.style.cursor = 'move';
                        element.style.right = 'auto';
                    }
                    let newX = initialElementX + dx;
                    let newY = initialElementY + dy;
                    newX = Math.max(0, newX);
                    newX = Math.min(newX, window.innerWidth - elementWidth);
                    newY = Math.max(0, newY);
                    newY = Math.min(newY, window.innerHeight - elementHeight);
                    element.style.left = `${newX}px`;
                    element.style.top = `${newY}px`;
                }
            }

            function onMouseUp(e) {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                element.style.transition = 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease, opacity 0.3s ease';
                element.style.cursor = 'pointer';
                if (!hasDragged) {
                    toggleImageVisibility();
                }
            }

            function toggleImageVisibility() {
                const images = dContainer.querySelectorAll('img');
                imagesHidden = !imagesHidden;
                if (imagesHidden) {
                    images.forEach(img => img.style.display = 'none');
                    element.textContent = '显示图片';
                    element.className = 'show-mode';
                } else {
                    images.forEach(img => img.style.display = '');
                    element.textContent = '隐藏图片';
                    element.className = 'hide-mode';
                }
            }
        }
    });
})();