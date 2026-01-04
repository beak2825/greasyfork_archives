// ==UserScript==
// @name        软文检测器
// @namespace     http://tampermonkey.net/
// @version      2.7
// @description    优化首次使用体验：未设置API Key时自动弹出设置面板。新增按钮拖动、吸附功能；排除常见网站。
// @author        Noyllopa & Gemini
// @license MIT
// @match         *://*/*
// @run-at        document-end
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556292/%E8%BD%AF%E6%96%87%E6%A3%80%E6%B5%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556292/%E8%BD%AF%E6%96%87%E6%A3%80%E6%B5%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. 网站排除列表 (新增) ---
    // 在这些网站上，脚本将不会运行
    const EXCLUDED_DOMAINS = [
        'google.com', 'baidu.com', 'bing.com', 'duckduckgo.com', // 搜索引擎
        'weibo.com', 'twitter.com', 'x.com', 'facebook.com', // 社交媒体
        'youtube.com', 'bilibili.com', // 视频网站
        'amazon.com', 'taobao.com', 'jd.com', // 电商网站
        'mail.google.com', 'outlook.live.com', // 邮箱
        'localhost', '127.0.0.1' // 本地开发
    ];

    const currentHostname = window.location.hostname;
    const isExcluded = EXCLUDED_DOMAINS.some(domain => currentHostname.includes(domain));

    if (isExcluded) {
        console.log(`[软文检测器] 网站 ${currentHostname} 已被排除，脚本停止运行。`);
        return;
    }

    // --- 配置 ---
    const DEFAULT_MODEL = 'gemini-2.5-pro';
    const DEFAULT_API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/[MODEL]:generateContent";
    const BUTTON_ID = 'soft-ad-detector-v26-btn';

    // --- 样式 (仅按钮) ---
    GM_addStyle(`
        /* 按钮基础样式，position: fixed 必须保留 */
        #${BUTTON_ID} {
            position: fixed;
            top: 150px;
            right: 20px;
            z-index: 2147483647;
            padding: 8px 12px;
            background: #4CAF50;
            color: white;
            border-radius: 50px;
            cursor: grab; /* 拖动光标 */
            font-size: 13px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            user-select: none;
            font-family: sans-serif;
            /* 增强：添加过渡效果，用于吸附 */
            transition: top 0.3s ease-out, right 0.3s ease-out, left 0.3s ease-out, background 0.2s;
        }
        #${BUTTON_ID}:hover { background-color: #45A049; }
        #${BUTTON_ID}:active { cursor: grabbing; } /* 拖动中光标 */
        /* 用于拖动时不进行过渡 */
        #${BUTTON_ID}.no-transition {
            transition: none !important;
        }
    `);

    // --- 启动逻辑 ---
    if (!document.body) return;

    createButton();
    // ⬇️ 新增：初始化拖动与吸附功能 ⬇️
    const btnElement = document.getElementById(BUTTON_ID);
    if (btnElement) {
        makeDraggableAndSnappable(btnElement);
    }
    // ⬆️ 新增结束 ⬆️

    console.log('[软文检测器] 脚本已启动');

    // 首次使用自动打开设置面板
    const apiKey = GM_getValue('softAdApiKey', null);
    if (!apiKey) {
        console.log('[软文检测器] API Key 未设置，自动打开设置面板。');
        showApiDialog();
    }

    // --- 拖动与吸附核心逻辑 (新增) ---
    function makeDraggableAndSnappable(button) {
        const SNAP_DISTANCE = 30; // 距离边缘多少像素以内触发吸附
        const SNAP_MARGIN = 10;    // 吸附后，距离边缘的最终距离

        let isDragging = false;
        let offset = { x: 0, y: 0 };
        let onMouseMove, onMouseUp; // 声明为外部变量以便移除监听

        // 1. 鼠标按下事件 (开始拖动)
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();

            isDragging = true;
            button.classList.add('no-transition'); // 拖动时移除过渡
            button.style.cursor = 'grabbing'; // 改变光标

            // 将定位模式从 right/top 切换为 left/top
            const rect = button.getBoundingClientRect();
            button.style.right = 'auto'; // 移除 right
            button.style.left = rect.left + 'px'; // 使用当前 left 值
            button.style.top = rect.top + 'px';

            // 计算鼠标点击位置相对于按钮左上角的偏移
            offset.x = e.clientX - rect.left;
            offset.y = e.clientY - rect.top;

            // 设置鼠标移动和释放的监听器
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // 2. 鼠标移动事件 (正在拖动)
        onMouseMove = (e) => {
            if (!isDragging) return;

            let newX = e.clientX - offset.x;
            let newY = e.clientY - offset.y;

            // 边界限制
            const maxX = window.innerWidth - button.offsetWidth;
            const maxY = window.innerHeight - button.offsetHeight;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            // 应用新位置
            button.style.left = newX + 'px';
            button.style.top = newY + 'px';
        };

        // 3. 鼠标释放事件 (拖动结束并进行吸附判断)
        onMouseUp = () => {
            if (!isDragging) return;

            isDragging = false;
            button.style.cursor = 'grab';
            button.classList.remove('no-transition'); // 恢复过渡

            const rect = button.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            let finalX, finalY;
            let useRight = false;

            // --- 边缘吸附逻辑 ---

            // 1. 水平吸附 (左/右) - 判断哪个边缘更近
            const distLeft = rect.left;
            const distRight = screenWidth - rect.right;

            if (distLeft < SNAP_DISTANCE && distLeft < distRight) {
                // 吸附到左边缘
                button.style.right = 'auto';
                finalX = SNAP_MARGIN;
                useRight = false;
            } else if (distRight < SNAP_DISTANCE && distRight <= distLeft) {
                // 吸附到右边缘
                button.style.left = 'auto';
                finalX = SNAP_MARGIN; // 这里的 SNAP_MARGIN 是 right 的值
                useRight = true;
            } else {
                // 不吸附，保持当前 left/right
                if (parseFloat(button.style.right) >= 0) { // 检查是否有有效的 right 值
                    useRight = true;
                    button.style.left = 'auto';
                    finalX = distRight;
                } else {
                    useRight = false;
                    finalX = rect.left;
                }
            }

            // 2. 垂直吸附 (上/下)
            const distTop = rect.top;
            const distBottom = screenHeight - rect.bottom;

            if (distTop < SNAP_DISTANCE && distTop < distBottom) {
                // 吸附到上边缘
                finalY = SNAP_MARGIN;
            } else if (distBottom < SNAP_DISTANCE && distBottom <= distTop) {
                // 吸附到下边缘
                finalY = screenHeight - height - SNAP_MARGIN;
            } else {
                // 不吸附，保持当前 top
                finalY = rect.top;
            }

            // 应用吸附后的位置
            if (useRight) {
                button.style.right = finalX + 'px';
            } else {
                button.style.left = finalX + 'px';
            }
            button.style.top = finalY + 'px';


            // 移除临时的事件监听器
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        // 额外的：处理窗口大小变化，防止按钮跑到屏幕外 (沿用你的逻辑)
        window.addEventListener('resize', () => {
            button.classList.add('no-transition'); // 暂时移除过渡
            const rect = button.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            let isUsingRight = (button.style.right !== 'auto' && button.style.right !== '');

            let newX = rect.left;
            let newY = rect.top;

            // 检查右边界
            if (rect.right > screenWidth - SNAP_MARGIN) {
                newX = screenWidth - rect.width - SNAP_MARGIN;
                isUsingRight = true; // 窗口缩小后吸附到右侧
            } else if (rect.left < SNAP_MARGIN) {
                 newX = SNAP_MARGIN;
                 isUsingRight = false; // 窗口缩小后吸附到左侧
            }
            // 检查下边界
            if (rect.bottom > screenHeight - SNAP_MARGIN) {
                newY = screenHeight - rect.height - SNAP_MARGIN;
            } else if (rect.top < SNAP_MARGIN) {
                newY = SNAP_MARGIN;
            }

            // 应用位置
            if (isUsingRight) {
                button.style.left = 'auto';
                button.style.right = (screenWidth - newX - rect.width) + 'px';
            } else {
                button.style.right = 'auto';
                button.style.left = newX + 'px';
            }
            button.style.top = newY + 'px';

            // 恢复过渡
            setTimeout(() => {
                button.classList.remove('no-transition');
            }, 50);
        });
    }

    // --- 功能函数 ---

    function createButton() {
        const btn = document.createElement('div');
        btn.id = BUTTON_ID;
        btn.textContent = '查软文';
        btn.title = "点击检测，右键/菜单设置 API/模型。可拖动吸附。";
        document.body.appendChild(btn);

        btn.addEventListener('click', runDetection);
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showApiDialog();
        });

        GM_registerMenuCommand("设置 API URL, Key 和 Model", showApiDialog);
    }

    // --- 1. 设置面板 (使用内联样式) ---
    function showApiDialog() {
        if (document.getElementById('sa-dialog-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'sa-dialog-overlay';
        overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:2147483647;display:flex;justify-content:center;align-items:center;";

        const dialog = document.createElement('div');
        dialog.style.cssText = "background:white;padding:25px;border-radius:10px;width:400px;box-shadow:0 5px 30px rgba(0,0,0,0.4);font-family:sans-serif;color:#333;";

        const currentKey = GM_getValue('softAdApiKey', '');
        const currentUrl = GM_getValue('softAdApiUrl', DEFAULT_API_URL_TEMPLATE);
        const currentModel = GM_getValue('softAdModelName', DEFAULT_MODEL);

        dialog.innerHTML = `
            <h3 style="margin-top:0;margin-bottom:20px;">API & 模型设置</h3>

            <label style="display:block;margin-bottom:5px;font-size:13px;font-weight:bold;">1. API Key (必需)</label>
            <input id="sa-input-key" type="password" value="${currentKey}" placeholder="AIzaSy..." style="width:100%;padding:8px;margin-bottom:15px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;">

            <label style="display:block;margin-bottom:5px;font-size:13px;font-weight:bold;">2. 模型名称</label>
            <input id="sa-input-model" type="text" value="${currentModel}" placeholder="${DEFAULT_MODEL}" style="width:100%;padding:8px;margin-bottom:15px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;">

            <label style="display:block;margin-bottom:5px;font-size:13px;font-weight:bold;">3. 自定义 API URL (可选)</label>
            <input id="sa-input-url" type="text" value="${currentUrl}" placeholder="${DEFAULT_API_URL_TEMPLATE}" style="width:100%;padding:8px;margin-bottom:5px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;">
            <p style="font-size:11px;color:#777;margin:0 0 20px 0;">* 默认 URL 包含 [MODEL] 占位符，脚本会自动替换。</p>

            <div style="display:flex;justify-content:flex-end;gap:10px;">
                <button id="sa-btn-cancel" style="padding:8px 15px;cursor:pointer;background:#eee;border:1px solid #ccc;border-radius:4px;">取消</button>
                <button id="sa-btn-save" style="padding:8px 15px;background:#2196F3;color:white;border:none;border-radius:4px;cursor:pointer;">保存配置</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        document.getElementById('sa-btn-cancel').onclick = () => overlay.remove();
        document.getElementById('sa-btn-save').onclick = () => {
            const newKey = document.getElementById('sa-input-key').value.trim();
            const newUrl = document.getElementById('sa-input-url').value.trim() || DEFAULT_API_URL_TEMPLATE;
            const newModel = document.getElementById('sa-input-model').value.trim() || DEFAULT_MODEL;

            if (!newKey) return alert("API Key 不能为空！");

            GM_setValue('softAdApiKey', newKey);
            GM_setValue('softAdApiUrl', newUrl);
            GM_setValue('softAdModelName', newModel);

            overlay.remove();
        };
    }

    // --- 2. 运行时逻辑 ---
    async function runDetection() {
        const apiKey = GM_getValue('softAdApiKey', null);
        if (!apiKey) {
            return showApiDialog();
        }

        const btn = document.getElementById(BUTTON_ID);
        btn.textContent = '分析中...';
        btn.style.cursor = 'wait';

        try {
            const content = getSpecificContent();
            if (content.length < 50) throw new Error("页面正文内容过少，无法分析。");

            const result = await callGemini(content, apiKey);
            showResultBox(result);
        } catch (err) {
            alert(`检测出错: ${err.message}`);
        } finally {
            btn.textContent = '查软文';
            btn.style.cursor = 'grab'; // 拖动结束恢复为 grab
        }
    }

    // --- 3. 结果显示 (自定义浮窗) ---
    function showResultBox(data) {
        document.getElementById('sa-result-box')?.remove();

        const isAd = data.isSoftAd;
        const color = isAd ? '#d32f2f' : '#388e3c';

        const box = document.createElement('div');
        box.id = 'sa-result-box';
        box.style.cssText = `
            position:fixed; top:80px; right:20px; width:300px;
            background:white; padding:15px; border-radius:8px;
            box-shadow:0 5px 20px rgba(0,0,0,0.3); z-index:2147483647;
            font-family:sans-serif; color:#333;
        `;

        box.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <h3 style="margin:0 0 10px 0;color:${color};font-size:16px;">
                    ${isAd ? '⚠️ 疑似软文' : '✅ 内容正常'}
                </h3>
                <span id="sa-close-icon" style="cursor:pointer;color:#999;font-size:16px;">&times;</span>
            </div>
            <p style="color:#555;font-size:14px;line-height:1.4;margin:0 0 15px 0;">${data.reason}</p>

            <div style="display:flex;gap:10px;">
                <button id="sa-btn-dismiss" style="flex:1;padding:8px;cursor:pointer;background:#eee;border:1px solid #ccc;border-radius:4px;">知道了</button>
                ${isAd ? '<button id="sa-btn-block" style="flex:1;padding:8px;background:#d32f2f;color:white;border:none;border-radius:4px;cursor:pointer;">屏蔽页面</button>' : ''}
            </div>
        `;

        document.body.appendChild(box);

        document.getElementById('sa-btn-dismiss').onclick = () => box.remove();
        document.getElementById('sa-close-icon').onclick = () => box.remove();

        if (isAd) {
            document.getElementById('sa-btn-block').onclick = () => {
                box.remove();
                try {
                    window.close();
                } catch (e) {
                    document.body.innerHTML = '<h1 style="text-align:center;margin-top:20vh;color:#999">页面已清空 (软文已屏蔽)</h1>';
                }
            };
        }
    }

    // --- 4. 辅助函数 (API 调用) ---

    async function callGemini(text, apiKey) {
        const customUrl = GM_getValue('softAdApiUrl', DEFAULT_API_URL_TEMPLATE);
        const modelName = GM_getValue('softAdModelName', DEFAULT_MODEL);

        let finalUrl = customUrl.replace('[MODEL]', modelName);

        if (!finalUrl.includes('key=')) {
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl = `${finalUrl}${separator}key=${apiKey}`;
        }

        const prompt = `分析以下文本是否为“软文”（广告/推广）。返回纯JSON：{"isSoftAd": boolean, "reason": "一句话原因(简练)"}。文本：${text}`;

        const response = await fetch(finalUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(`API 请求失败: ${errorBody.error?.message || response.statusText}`);
        }

        const data = await response.json();
        let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        rawText = rawText.replace(/```json|```/g, '').trim();

        try {
            return JSON.parse(rawText);
        } catch (e) {
            return { isSoftAd: false, reason: "API返回格式无法解析" };
        }
    }

    function getSpecificContent() {
        const selector = document.querySelector('.article-detail-content') || document.querySelector('article');

        if (selector) {
            selector.querySelectorAll('pre, figure, blockquote').forEach(el => el.remove());
            return selector.innerText.replace(/\s+/g, ' ').slice(0, 10000);
        }

        return document.body.innerText.slice(0, 10000);
    }

})();