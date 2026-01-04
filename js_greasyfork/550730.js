// ==UserScript==
// @name         最强摸鱼插件
// @version      2.9
// @description 我说这个是广告，你信吗？
// @author       Gemini
// @match        *://*/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1470321
// @downloadURL https://update.greasyfork.org/scripts/550730/%E6%9C%80%E5%BC%BA%E6%91%B8%E9%B1%BC%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/550730/%E6%9C%80%E5%BC%BA%E6%91%B8%E9%B1%BC%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------------------------------
    //                 【CSS 样式注入】
    // ----------------------------------------------------
    GM_addStyle(`
        /* 浮动按钮样式 */
        #fishing-settings-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 30px;
            height: 30px;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border: none;
            color: #fff;
            cursor: pointer;
            z-index: 99999;
            opacity: 0.1;
            transition: opacity 0.3s, background-color 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
            text-align: center;
        }
        #fishing-settings-btn:hover {
            opacity: 1;
            background-color: rgba(0, 123, 255, 0.8);
        }
        /* 模态窗口样式 */
        #fishing-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100000;
            display: none;
            justify-content: center;
            align-items: center;
        }
        #fishing-modal-content {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            color: #333;
        }
        #fishing-modal-content input[type="url"] {
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        #fishing-modal-content button {
            padding: 8px 15px;
            margin: 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .fishing-modal-save { background-color: #007bff; color: white; }
        .fishing-modal-close { background-color: #6c757d; color: white; }

        /* 模拟图标 */
        #fishing-settings-btn::before {
            content: "⚙️";
        }

        /* 确保被替换的页尾 div 容器有足够的内边距 */
        .body-footer {
             padding-top: 20px;
             padding-bottom: 20px;
             text-align: center;
        }
    `);

    // --- 【兼容性封装】 ---
    const storage = {
        getValue: (key, defaultValue) => {
            if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') {
                return GM.getValue(key, defaultValue);
            }
            else if (typeof GM_getValue === 'function') {
                return Promise.resolve(GM_getValue(key, defaultValue));
            }
            return Promise.resolve(defaultValue);
        },
        setValue: (key, value) => {
            if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') {
                return GM.setValue(key, value);
            }
            else if (typeof GM_setValue === 'function') {
                GM_setValue(key, value);
                return Promise.resolve();
            }
            return Promise.resolve();
        }
    };


    // ----------------------------------------------------
    //                 【用户配置区域】
    // ----------------------------------------------------

    const TARGET_AD_CONTAINER_SELECTOR = '.body-footer';

    const DEFAULT_FISHING_PAGE_URL = 'https://en.wikipedia.org/wiki/Special:Random';
    const IFRAME_HEIGHT = '250px';
    const IFRAME_WIDTH = '100%';
    const STORAGE_KEY = 'fishing_page_url_vjudge';

    // ----------------------------------------------------
    //                 【脚本主体入口】
    // ----------------------------------------------------

    async function main() {

        let currentFishingUrl = await storage.getValue(STORAGE_KEY, DEFAULT_FISHING_PAGE_URL);

        // --- 1. 核心广告替换逻辑 ---

        function setupAdReplacement(fishingUrl) {
            const targetDiv = document.querySelector(TARGET_AD_CONTAINER_SELECTOR);

            if (!targetDiv) {
                console.log(`摸鱼脚本：未找到目标元素 ${TARGET_AD_CONTAINER_SELECTOR}。`);
                return;
            }

            // 清理目标div的内容 (替换整个标签的内容)
            targetDiv.innerHTML = '';

            // 状态变量：跟踪当前是否处于摸鱼模式（iframe可见）
            let isFishingMode = false;

            // 创建隐形占位符元素 (与 iframe 同高)
            const safePlaceholder = document.createElement('div');
            safePlaceholder.id = 'fishing-placeholder';
            safePlaceholder.style.width = IFRAME_WIDTH;
            safePlaceholder.style.height = IFRAME_HEIGHT;
            safePlaceholder.style.border = '0';
            safePlaceholder.style.backgroundColor = 'transparent';
            safePlaceholder.style.cursor = 'default';

            // 创建摸鱼用的 iframe 元素
            const fishingIframe = document.createElement('iframe');
            fishingIframe.id = 'fishing-iframe';
            fishingIframe.src = fishingUrl;
            fishingIframe.style.width = IFRAME_WIDTH;
            fishingIframe.style.height = IFRAME_HEIGHT;
            fishingIframe.style.border = '0';
            fishingIframe.style.margin = '0';
            fishingIframe.style.padding = '0';
            // 初始隐藏 iframe
            fishingIframe.style.display = 'none';

            // 将占位符和 iframe 都添加到容器中
            targetDiv.appendChild(safePlaceholder);
            targetDiv.appendChild(fishingIframe);

            // 调整样式以适应页尾
            targetDiv.style.textAlign = 'center';

            // --- 核心切换逻辑 ---
            function toggleFishingMode(e) {
                // 阻止事件冒泡到 document，避免点击 targetDiv 立即隐藏
                e.stopPropagation();

                if (isFishingMode) {
                    // 隐藏 iframe，显示占位符
                    fishingIframe.style.display = 'none';
                    safePlaceholder.style.display = 'block';
                    isFishingMode = false;
                    console.log('摸鱼脚本：切换到隐形模式。');
                } else {
                    // 显示 iframe，隐藏占位符
                    safePlaceholder.style.display = 'none';
                    fishingIframe.style.display = 'block';
                    // 确保 iframe 刷新内容
                    fishingIframe.src = fishingUrl;
                    isFishingMode = true;
                    console.log('摸鱼脚本：切换到摸鱼模式。');
                }
            }

            // 1. 点击目标区域 (body-footer) 切换模式
            targetDiv.onclick = toggleFishingMode;

            // 2. 点击页面其他任何地方时隐藏 iframe
            document.onclick = (e) => {
                // 如果当前处于摸鱼模式，且点击的不是设置按钮
                if (isFishingMode && e.target.id !== 'fishing-settings-btn') {
                    // 隐藏 iframe，显示占位符
                    fishingIframe.style.display = 'none';
                    safePlaceholder.style.display = 'block';
                    isFishingMode = false;
                    console.log('摸鱼脚本：点击页面其他地方，自动切换到隐形模式。');
                }
            };

            console.log(`摸鱼脚本：页尾点击切换已激活，当前摸鱼 URL: ${fishingUrl}`);
        }

        // --- 2. 右下角设置按钮和弹窗逻辑 ---

        // 创建按钮
        const settingsButton = document.createElement('button');
        settingsButton.id = 'fishing-settings-btn';
        settingsButton.title = '设置摸鱼URL';
        document.body.appendChild(settingsButton);

        // 创建模态窗口
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'fishing-modal-overlay';
        modalOverlay.innerHTML = `
            <div id="fishing-modal-content">
                <h4>摸鱼 URL 设置</h4>
                <p>请输入您希望在鼠标悬停时显示的页面 URL：</p>
                <input type="url" id="fishing-url-input" placeholder="例如: https://www.example.com/fish" value="${currentFishingUrl}">
                <button class="fishing-modal-save" id="fishing-save-btn">保存并刷新</button>
                <button class="fishing-modal-close" id="fishing-close-btn">关闭</button>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        // 绑定事件
        settingsButton.onclick = (e) => {
            // 阻止冒泡，避免点击设置按钮时触发 document 隐藏逻辑
            e.stopPropagation();
            document.getElementById('fishing-url-input').value = currentFishingUrl;
            modalOverlay.style.display = 'flex';
        };

        document.getElementById('fishing-close-btn').onclick = () => {
            modalOverlay.style.display = 'none';
        };

        document.getElementById('fishing-save-btn').onclick = async () => {
            const inputElement = document.getElementById('fishing-url-input');
            const newUrl = inputElement.value.trim();

            if (newUrl && (newUrl.startsWith('http://') || newUrl.startsWith('https://'))) {
                currentFishingUrl = newUrl;
                await storage.setValue(STORAGE_KEY, newUrl);
                alert('新的摸鱼 URL 已保存！页面将刷新以应用更改。');
                modalOverlay.style.display = 'none';
                window.location.reload();
            } else {
                alert('请输入一个有效的 URL (必须以 http:// 或 https:// 开头)。');
                inputElement.focus();
            }
        };

        // --- 3. 页面加载后执行 ---
        window.addEventListener('load', () => {
            setupAdReplacement(currentFishingUrl);
        });
    }

    // 运行主函数
    main();

})();