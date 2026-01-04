// ==UserScript==
// @name         Nga弹窗变轻提示
// @author       monat151
// @namespace    https://greasyfork.org/zh-CN/scripts/548779
// @license      None
// @version      1.2
// @description  将 window.alert 对话框替换成 naive-ui 风格的 Notification
// @match        http*://bbs.nga.cn/*
// @match        http*://nga.178.com/*
// @match        http*://ngabbs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.cn
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548779/Nga%E5%BC%B9%E7%AA%97%E5%8F%98%E8%BD%BB%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/548779/Nga%E5%BC%B9%E7%AA%97%E5%8F%98%E8%BD%BB%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const CONTAINER_ID = "monat-nga-notification-container";

    // 确保容器存在
    function ensureContainer() {
        let container = document.getElementById(CONTAINER_ID);
        if (!container) {
            container = document.createElement("div");
            container.id = CONTAINER_ID;
            container.style.position = "fixed";
            container.style.top = "16px";
            container.style.right = "16px";
            container.style.zIndex = "999999";
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.gap = "8px";
            document.body.appendChild(container);
        }
        return container;
    }

    // 创建一个通知
    function showNotification(message) {
        const container = ensureContainer();

        const notif = document.createElement("div");
        notif.style.display = "flex";
        notif.style.alignItems = "flex-start";
        notif.style.background = "#fff";
        notif.style.color = "#333";
        notif.style.padding = "12px 16px";
        notif.style.borderRadius = "8px";
        notif.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        notif.style.fontSize = "14px";
        notif.style.minWidth = "220px";
        notif.style.maxWidth = "320px";
        notif.style.wordBreak = "break-word";
        notif.style.opacity = "0";
        notif.style.transform = "translateY(-10px)";
        notif.style.transition = "all 0.3s ease";

        // 左侧图标
        const icon = document.createElement("div");
        icon.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12" y2="8"></line>
      </svg>
    `;
        icon.style.flex = "0 0 auto";
        icon.style.marginRight = "10px";
        icon.style.marginTop = "2px";

        // 右侧内容
        const content = document.createElement("div");
        content.style.display = "flex";
        content.style.flexDirection = "column";

        // 标题
        const title = document.createElement("div");
        title.innerText = "提示";
        title.style.fontSize = "16px";
        title.style.fontWeight = "600";
        title.style.marginBottom = "4px";
        title.style.color = "#111";

        // 内容
        const text = document.createElement("div");
        text.innerText = message;
        text.style.lineHeight = "1.4";

        content.appendChild(title);
        content.appendChild(text);

        notif.appendChild(icon);
        notif.appendChild(content);
        container.appendChild(notif);

        // 动画进入
        void notif.offsetWidth;
        notif.style.opacity = "1";
        notif.style.transform = "translateY(0)";

        // 自动关闭
        setTimeout(() => {
            notif.style.opacity = "0";
            notif.style.transform = "translateY(-10px)";
            setTimeout(() => {
                notif.remove();
            }, 300);
        }, 3000);
    }

    let _PLUGIN_RUNNED = false, _INTERVAL_LOOPED = 0
    const runPlugin = (isReRun = false) => {
        const act = isReRun ? '重载' : '运行'
        unsafeWindow.alert = (msg) => {
            showNotification(String(msg))
        }
        unsafeWindow.new_alert = (msg) => {
            showNotification(String(msg))
        }
        console.log('[Nga弹窗变轻提示] 插件' + act + '成功。')
    }
    setTimeout(() => {
        const _PLUGIN_INTERVAL = setInterval(() => {
            try {
                runPlugin()
                const observer = new MutationObserver(() => {
                    runPlugin(true)
                })
                observer.observe(document.body || document.documentElement, {
                    childList: true,
                    subtree: true
                })
                window.clearInterval(_PLUGIN_INTERVAL)
            } catch (e) {
                console.warn('[Nga弹窗变轻提示] 插件运行出错，等待重试。\n错误信息：', e)
                if (_INTERVAL_LOOPED > 30) {
                    console.error('[Nga弹窗变轻提示] 插件运行失败次数过多，任务取消。')
                    window.clearInterval(_PLUGIN_INTERVAL)
                }
                _INTERVAL_LOOPED++
            }
        }, 100)
    }, 500)
})();