// ==UserScript==
// @name         解决Via看MissAV的痛点
// @namespace    https://viayoo.com/
// @version      V2
// @description  解决via用MissAV空白占位符和重定向到广告页面的问题
// @author       Google Gemini
// @run-at       document-end
// @match        *://missav.ws/*
// @grant        无
// @downloadURL https://update.greasyfork.org/scripts/562096/%E8%A7%A3%E5%86%B3Via%E7%9C%8BMissAV%E7%9A%84%E7%97%9B%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/562096/%E8%A7%A3%E5%86%B3Via%E7%9C%8BMissAV%E7%9A%84%E7%97%9B%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    // 1. 拦截广告跳转
    const isAd = (u) => /diffusedpassion|tsyndicate|traffshop|popads|click|[0-9]{6,}/i.test(u);
    const originalOpen = window.open;
    window.open = function(u) {
        if (u && isAd(u)) return null;
        return originalOpen.apply(this, arguments);
    };

    // 2. 核心清理与保护逻辑
    const sweep = () => {
        // 白名单：包含这些关键字或特定图标类名的容器，绝对不执行任何 style 修改
        const safeElements = /详情|女优消息|磁力下载|收藏|片单|下载|分享|菜单|语言|Language|CN|TW|JP/;
        
        document.querySelectorAll('div').forEach(div => {
            const h = div.offsetHeight;
            const text = div.innerText.trim();
            const className = div.className || "";

            // --- 关键补丁：保护语言栏和顶栏图标 ---
            // 只要包含国旗类名、语言选择器类名，或者文字匹配白名单，直接跳过
            if (safeElements.test(text) || className.includes('nav') || className.includes('flag') || className.includes('dropdown')) {
                // 确保它们可以正常显示和点击，但不允许脚本去挪动它们
                div.style.setProperty('visibility', 'visible', 'important');
                return; 
            }

            // --- 关键改进：保护图片和视频封面 ---
            if (div.querySelector('img') || className.includes('poster') || className.includes('cover')) {
                return; 
            }

            // --- 拦截逻辑：只针对真正无内容的黑块/占位符 ---
            if (h > 45 && text === "" && !div.querySelector('video, img, svg, a, button')) {
                // 排除播放器控制条
                if (!className.includes('vjs') && !className.includes('player')) {
                    div.style.setProperty('display', 'none', 'important');
                }
            }
        });
    };

    // 3. 针对“点击弹出语言栏”的物理修复
    // 有时是由于脚本删除了某些层，导致语言栏被“挤”到了屏幕中间触发了误点
    document.addEventListener('mousedown', (e) => {
        // 如果点击的是空白透明层，且该层不是语言切换器
        const style = window.getComputedStyle(e.target);
        if (parseInt(style.zIndex) > 10 && e.target.innerText.trim() === "" && !e.target.querySelector('img')) {
            // 确认不是导航栏组件后移除
            if (!e.target.className.includes('nav') && !e.target.className.includes('dropdown')) {
                e.target.remove();
            }
        }
    }, true);

    // 4. 自动化与防抖执行
    const observer = new MutationObserver(() => sweep());
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    sweep();
    window.addEventListener('load', sweep);
})();