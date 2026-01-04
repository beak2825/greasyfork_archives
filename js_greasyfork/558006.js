// ==UserScript==
// @name         Gemini 灵枢导航 (Gemini Chat 目录) - V23.0 ClickOutside
// @namespace    http://tampermonkey.net/
// @version      23.0
// @description  V23升级：新增点击目录外部区域自动收起功能；保留V20悬浮UI与V19滚动逻辑。
// @author       Lingshu
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558006/Gemini%20%E7%81%B5%E6%9E%A2%E5%AF%BC%E8%88%AA%20%28Gemini%20Chat%20%E7%9B%AE%E5%BD%95%29%20-%20V230%20ClickOutside.user.js
// @updateURL https://update.greasyfork.org/scripts/558006/Gemini%20%E7%81%B5%E6%9E%A2%E5%AF%BC%E8%88%AA%20%28Gemini%20Chat%20%E7%9B%AE%E5%BD%95%29%20-%20V230%20ClickOutside.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置 ===
    const CONFIG = {
        selectors: ['.user-query', '[data-test-id="user-query"]', 'user-query'],
        rootSelector: 'main',
        widthExpanded: '280px',
        widthCollapsed: '50px', // 悬浮图标大小
        iconEmoji: '🧠',
        title: '灵枢·智航',
        smartContextThreshold: 20
    };

    let isExpanded = false;

    // === 1. V19 核心逻辑：滚动辅助 ===
    function getScrollParent(node) {
        if (node == null) return null;
        if (node.scrollHeight > node.clientHeight) {
            const style = window.getComputedStyle(node);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                return node;
            }
        }
        return getScrollParent(node.parentNode);
    }

    function findNextResponseText(userNode) {
        let parentRow = userNode.closest('.conversation-container') || userNode.parentNode.parentNode;
        if (!parentRow) return "";
        let sibling = parentRow.nextElementSibling;
        let attempts = 3;
        while (sibling && attempts > 0) {
            let text = sibling.innerText.replace(/\s+/g, ' ').trim();
            if (text.length > 2 && !text.includes("Show drafts") && !text.includes("Thinking") && !text.includes(userNode.innerText.substring(0, 10))) {
                return text;
            }
            sibling = sibling.nextElementSibling;
            attempts--;
        }
        return "";
    }

    // === 2. UI 构建 (V20 无界悬浮版 + V23 外部点击逻辑) ===
    function ensureUI() {
        if (!document.getElementById('lingshu-toc')) {
            createUI();
            setTimeout(updateTOC, 500);
        }
    }

    function createUI() {
        if (document.getElementById('lingshu-toc')) return;

        const container = document.createElement('div');
        container.id = 'lingshu-toc';
        // 初始状态：透明无边框 (V20 Style)
        container.style.cssText = `
            position: fixed; top: 140px; right: 20px;
            z-index: 2147483647;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            overflow: hidden; display: flex; flex-direction: column;
            font-family: "Google Sans", sans-serif;
            background: transparent;
            box-shadow: none;
            border: none;
            width: ${CONFIG.widthCollapsed}; height: 50px;
            box-sizing: border-box;
        `;

        const header = document.createElement('div');
        header.style.cssText = "display: flex; align-items: center; height: 50px; width: 100%; cursor: pointer; user-select: none; box-sizing: border-box;";

        // 图标容器：V19 的居中修正 + V20 的阴影
        const iconBox = document.createElement('div');
        iconBox.innerHTML = CONFIG.iconEmoji;
        iconBox.style.cssText = `
            width: 50px; height: 50px;
            display: flex; justify-content: center; align-items: center;
            font-size: 28px; flex-shrink: 0;
            line-height: 1; padding-top: 2px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
            transition: transform 0.2s;
        `;
        iconBox.onmouseenter = () => iconBox.style.transform = "scale(1.1)";
        iconBox.onmouseleave = () => iconBox.style.transform = "scale(1)";

        const titleSpan = document.createElement('span');
        titleSpan.innerText = CONFIG.title;
        titleSpan.style.cssText = "font-weight:bold;color:#555;opacity:0;transition:opacity 0.2s;margin-left:5px;font-size:14px;white-space:nowrap;";

        header.appendChild(iconBox);
        header.appendChild(titleSpan);

        header.onclick = () => {
            isExpanded = !isExpanded;
            updateStateUI();
        };

        const list = document.createElement('ul');
        list.id = 'lingshu-toc-list';
        list.style.cssText = "list-style: none; padding: 10px; margin: 0; overflow-y: auto; flex-grow: 1; opacity: 0; transition: opacity 0.2s; scrollbar-width: thin; box-sizing: border-box;";

        container.appendChild(header);
        container.appendChild(list);
        document.body.appendChild(container);

        // === V23 新增逻辑：点击外部自动收起 ===
        document.addEventListener('click', (e) => {
            // 如果当前是展开状态，并且点击的目标不是容器本身或容器内部元素
            if (isExpanded && container && !container.contains(e.target)) {
                isExpanded = false;
                updateStateUI();
            }
        });

        updateStateUI();
    }

    function updateStateUI() {
        const container = document.getElementById('lingshu-toc');
        if (!container) return;

        const list = document.getElementById('lingshu-toc-list');
        const title = container.querySelector('span');
        const iconBox = container.querySelector('div > div');

        if (isExpanded) {
            // === 展开：显示背景板 ===
            container.style.width = CONFIG.widthExpanded;
            const contentHeight = list.scrollHeight + 60;
            container.style.height = Math.min(contentHeight, window.innerHeight * 0.8) + 'px';

            container.style.background = "rgba(255, 255, 255, 0.95)";
            container.style.border = "1px solid rgba(0,0,0,0.1)";
            container.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
            container.style.backdropFilter = "blur(10px)";
            container.style.borderRadius = "16px";

            title.style.opacity = '1';
            list.style.opacity = '1'; list.style.pointerEvents = 'auto';
            if(iconBox) iconBox.style.filter = "none";

        } else {
            // === 折叠：无界悬浮 ===
            container.style.width = CONFIG.widthCollapsed;
            container.style.height = '50px';

            container.style.background = "transparent";
            container.style.border = "none";
            container.style.boxShadow = "none";
            container.style.backdropFilter = "none";
            container.style.borderRadius = "0";

            title.style.opacity = '0';
            list.style.opacity = '0'; list.style.pointerEvents = 'none';
            if(iconBox) iconBox.style.filter = "drop-shadow(0 3px 6px rgba(0,0,0,0.15))";
        }
    }

    // === 3. 主逻辑 (V19 逻辑) ===
    function updateTOC() {
        if (!document.getElementById('lingshu-toc')) createUI();
        const list = document.getElementById('lingshu-toc-list');
        if (!list) return;

        let root = document.querySelector(CONFIG.rootSelector) || document.body;
        let elements = [];
        for (let sel of CONFIG.selectors) {
            const found = root.querySelectorAll(sel);
            if (found.length > 0) {
                elements = Array.from(found);
                break;
            }
        }

        if (list.children.length === elements.length && elements.length > 0 && !isExpanded) return;

        list.innerHTML = '';
        if (elements.length === 0) return;

        elements.forEach((el, index) => {
            let userText = el.innerText.replace(/\s+/g, ' ').trim();
            if (!userText) return;

            let subText = "";
            if (userText.length < CONFIG.smartContextThreshold) {
                let foundResponse = findNextResponseText(el);
                if (foundResponse) subText = foundResponse.substring(0, 15);
            }

            let displayText = userText.length > 12 ? userText.substring(0, 12) + '...' : userText;

            const li = document.createElement('li');
            let html = `<div style="font-weight:500; color:#333; display:flex; align-items:center;">
                            <span style="color:#4285f4; font-size:12px; margin-right:6px;">●</span>
                            ${displayText}
                        </div>`;
            if (subText) {
                html += `<div style="margin-left:14px; font-size:11px; color:#999; margin-top:2px;">↳ ${subText}...</div>`;
            }

            li.innerHTML = html;
            li.style.cssText = "padding: 8px; border-bottom:1px solid #f9f9f9; cursor: pointer; font-size: 13px;";

            li.onclick = (e) => {
                e.stopPropagation(); // 阻止冒泡，避免触发文档点击关闭逻辑（虽然结果一样，但逻辑要清晰）

                if (el && el.isConnected) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });

                    // 高亮
                    let visualTarget = el.firstElementChild || el;
                    visualTarget.style.transition = "all 0.3s";
                    visualTarget.style.backgroundColor = "#fff9c4";
                    setTimeout(() => visualTarget.style.backgroundColor = "", 1500);

                    // 辅助滚动修正
                    setTimeout(() => {
                        const scrollContainer = getScrollParent(el);
                        if (scrollContainer) {
                             const elRect = el.getBoundingClientRect();
                             const containerRect = scrollContainer.getBoundingClientRect();
                             if (elRect.top < containerRect.top || elRect.bottom > containerRect.bottom) {
                                 const relativeTop = elRect.top - containerRect.top;
                                 scrollContainer.scrollBy({ top: relativeTop - containerRect.height/2 + 50, behavior: 'auto' });
                             }
                        }
                    }, 100);

                    // 自动收起
                    isExpanded = false;
                    updateStateUI();
                } else {
                    alert("⚠️ 目标未加载，请手动滚动页面。");
                }
            };

            list.appendChild(li);
        });

        if (isExpanded) {
            const container = document.getElementById('lingshu-toc');
            const contentHeight = list.scrollHeight + 60;
            container.style.height = Math.min(contentHeight, window.innerHeight * 0.8) + 'px';
        }
    }

    // === 启动 ===
    let timer = null;
    const observer = new MutationObserver(() => {
        if (!document.getElementById('lingshu-toc')) createUI();
        if (timer) clearTimeout(timer);
        timer = setTimeout(updateTOC, 800);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(ensureUI, 2000);
    setTimeout(updateTOC, 1500);

})();