// ==UserScript==
// @name         Global Dark Mode Toggle (Alt+F12) - Priority Fix
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Toggle dark mode: Alt+F12 (Current Domain), Alt+Shift+F12 (Global). Last action wins.
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562711/Global%20Dark%20Mode%20Toggle%20%28Alt%2BF12%29%20-%20Priority%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562711/Global%20Dark%20Mode%20Toggle%20%28Alt%2BF12%29%20-%20Priority%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLASS_NAME = 'tm-force-dark-mode';
    const LOCAL_KEY = 'tm_dark_mode_local_v2';
    const GLOBAL_KEY = 'tm_dark_mode_global_v2';

    // 1. 注入 CSS
    const style = document.createElement('style');
    style.innerHTML = `
    html.${CLASS_NAME} {
        filter: invert(90%) hue-rotate(180deg) !important;
        background-color: #1a1a1a !important;
    }
    /* 图片、视频、代码块需要反色 */
    html.${CLASS_NAME} img,
    html.${CLASS_NAME} video,
    html.${CLASS_NAME} div[class*="language-"] {
        filter: invert(110%) hue-rotate(180deg) !important;
        opacity: .8 !important;
    }
    /* 图片形式的 SVG 需要反色 */
    html.${CLASS_NAME} img[src$=".svg"],
    html.${CLASS_NAME} img[src*=".svg?"],
    html.${CLASS_NAME} img[src*=".svg#"] {
        filter: invert(110%) hue-rotate(180deg) !important;
        opacity: .8 !important;
    }
    /* 内联 SVG 不需要反色（已通过 html 反色） */
    /* 如果需要让内联 SVG 也反色，取消下面的注释 */
    /*
    html.${CLASS_NAME} svg {
        filter: invert(110%) hue-rotate(180deg) !important;
        opacity: .8 !important;
    }
    */
`;

    function injectStyle() {
        if (document.head) {
            if (!document.head.contains(style)) document.head.appendChild(style);
        }
    }
    // 立即尝试注入，并观察后续加载
    injectStyle();
    const observer = new MutationObserver(injectStyle);
    observer.observe(document, { childList: true, subtree: true });


    // 2. 状态管理核心逻辑 (时间戳竞争)

    // 获取本地配置 { mode: boolean, time: number }
    function getLocalConfig() {
        try {
            const str = localStorage.getItem(LOCAL_KEY);
            return str ? JSON.parse(str) : { mode: false, time: 0 };
        } catch (e) {
            return { mode: false, time: 0 };
        }
    }

    // 获取全局配置 { mode: boolean, time: number }
    function getGlobalConfig() {
        return GM_getValue(GLOBAL_KEY, { mode: false, time: 0 });
    }

    // 判断当前应该显示什么颜色
    // 逻辑：比较 Local 和 Global 的时间戳，谁的时间大（最新），听谁的
    function getEffectiveMode() {
        const local = getLocalConfig();
        const global = getGlobalConfig();

        // 如果本地操作时间 晚于 全局操作时间，使用本地设置
        if (local.time > global.time) {
            return local.mode;
        }
        // 否则使用全局设置
        return global.mode;
    }

    // 3. 应用样式
    function applyState() {
        const isDark = getEffectiveMode();
        if (isDark) {
            document.documentElement.classList.add(CLASS_NAME);
        } else {
            document.documentElement.classList.remove(CLASS_NAME);
        }
    }

    // 4. Toggle 动作

    // 本地切换
    function toggleLocal() {
        const currentMode = getEffectiveMode();
        const newMode = !currentMode; // 取反当前肉眼看到的状态

        // 写入本地存储，更新时间戳为现在
        const config = { mode: newMode, time: Date.now() };
        localStorage.setItem(LOCAL_KEY, JSON.stringify(config));

        applyState();
        showToast(`当前域名: ${newMode ? '暗色' : '亮色'}`);
    }

    // 全局切换
    function toggleGlobal() {
        const currentMode = getEffectiveMode();
        const newMode = !currentMode; // 取反当前肉眼看到的状态

        // 写入全局存储，更新时间戳为现在
        // 因为时间戳最新，所有其他网页比较时间时，都会发现 Global > Local，从而跟随全局
        const config = { mode: newMode, time: Date.now() };
        GM_setValue(GLOBAL_KEY, config);

        // GM_setValue 会自动触发当前页面的监听器，但在某些旧版本浏览器可能不及时，手动刷一次
        applyState();
        showToast(`全局设置: ${newMode ? '暗色' : '亮色'} (已覆盖所有)`);
    }


    // 5. 事件监听

    // 键盘监听
    window.addEventListener('keydown', (e) => {
        // F12 keycode is 123
        if (e.altKey && e.keyCode === 123) {
            e.preventDefault();
            e.stopImmediatePropagation(); // 尽最大努力阻止浏览器 DevTools

            if (e.shiftKey) {
                // Alt + Shift + F12
                toggleGlobal();
            } else {
                // Alt + F12
                toggleLocal();
            }
        }
    }, true); // useCapture = true，在捕获阶段拦截，防止被其他脚本抢占

    // 监听 GM 变量变化 (其他标签页改了全局，这里要变)
    GM_addValueChangeListener(GLOBAL_KEY, (name, oldVal, newVal, remote) => {
        applyState();
    });

    // 监听 LocalStorage 变化 (同一个域名的其他标签页改了本地，这里要变)
    window.addEventListener('storage', (e) => {
        if (e.key === LOCAL_KEY) {
            applyState();
        }
    });

    // 提示框工具
    function showToast(text) {
        // 移除旧的 toast
        const old = document.getElementById('tm-dark-toast');
        if (old) old.remove();

        const div = document.createElement('div');
        div.id = 'tm-dark-toast';
        div.textContent = text;
        div.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 2147483647;
            background: #222; color: #fff; padding: 12px 24px; border-radius: 8px;
            font-family: sans-serif; font-size: 16px; font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5); border: 1px solid #444;
            transition: opacity 0.3s; pointer-events: none;
        `;
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 300);
        }, 1500);
    }

    // 初始化
    applyState();

})();