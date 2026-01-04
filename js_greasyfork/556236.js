// ==UserScript==
// @name         Google 艺文日历
// @namespace    https://github.com/cnfeat/google-arts-calendar
// @version      1.0.2
// @description  左边是单向历的治愈系智慧金句，右边是 Google 艺术与文化今日精选。让你在同一屏幕下完成每日的艺术熏陶与思维提升。设置成首页，每天 3 秒钟，完成艺术和思想的双重充电！
// @author       cnfeat
// @match        https://artsandculture.google.com/*
// @match        https://edui123.com/rili/
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556236/Google%20%E8%89%BA%E6%96%87%E6%97%A5%E5%8E%86.user.js
// @updateURL https://update.greasyfork.org/scripts/556236/Google%20%E8%89%BA%E6%96%87%E6%97%A5%E5%8E%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CALENDAR_URL = "https://edui123.com/rili/";
    const OVERLAY_ID = "calendar-overlay-window";
    const HEADER_ID = "calendar-overlay-header";
    const CLOSE_BTN_ID = "calendar-overlay-close-btn";
    
    // ******************************************************
    // 【模块 1: edui123 日历内容净化 - 运行在日历网站】
    // ******************************************************
    if (window.location.href.startsWith(CALENDAR_URL)) {
        // !!! 请根据您最终确认的 HTML 结构来修改 MAIN_CONTENT_SELECTOR !!!
        const ELEMENTS_TO_HIDE = [
            'header', 'nav', 'footer', '.top-header', '.sidebar', 
            '.ad-container', '.crumbs', '.page-header'
        ];
        const MAIN_CONTENT_SELECTOR = '.main-content'; 

        GM_addStyle(`
            ${ELEMENTS_TO_HIDE.join(', ')} { display: none !important; }
            html, body { margin: 0 !important; padding: 0 !important; overflow: hidden !important; }
            ${MAIN_CONTENT_SELECTOR} {
                width: 100% !important;
                max-width: none !important;
                padding: 0 !important;
                margin: 0 !important;
            }
        `);
        return; 
    }

    // ******************************************************
    // 【模块 2: Google 艺术与文化上的浮窗注入与滚动】
    // ******************************************************

    // --- CSS 样式注入 (贴合左侧，612x899 比例) ---
    GM_addStyle(`
        #${OVERLAY_ID} {
            position: fixed;
            top: 0px;        
            left: 0px;       
            width: 480px;
            height: 750px;
            background-color: white;
            border: 1px solid #ccc;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 9999;
            resize: both;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        #${HEADER_ID} {
            padding: 8px 12px;
            background-color: #f1f1f1;
            cursor: grab;
            font-size: 14px;
            color: #333;
            user-select: none;
            flex-shrink: 0;
            display: flex;
            justify-content: space-between; 
            align-items: center; 
        }
        #${CLOSE_BTN_ID} {
            background: none;
            border: none;
            font-size: 20px;
            line-height: 1;
            padding: 0 5px;
            margin-left: 10px;
            cursor: pointer;
            color: #666;
            font-weight: bold;
        }
        #${OVERLAY_ID} iframe {
            width: 100%;
            flex-grow: 1; 
            border: none;
        }
    `);

    // --- 拖拽功能 ---
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            if (e.target.id === CLOSE_BTN_ID) { return; }
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            handle.style.cursor = 'grabbing';
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            let newTop = (element.offsetTop - pos2);
            let newLeft = (element.offsetLeft - pos1);
            
            element.style.top = (newTop < 0 ? 0 : newTop) + "px";
            element.style.left = (newLeft < 0 ? 0 : newLeft) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            handle.style.cursor = 'grab';
        }
    }
    
    // --- 自动滚动功能：使用瞬间跳转 ---
    function scrollToFeaturedContent(attempts = 0) {
        if (attempts > 15) {
            return;
        }
        
        const selectors = ['h1', 'h2', 'h3', '.U6gUdd', '.r7pDd', '[role="heading"]']; 
        let targetElement = null;
        
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (el.textContent.includes('今日精选') || el.textContent.includes("Today's")) {
                    targetElement = el;
                    break;
                }
            }
            if (targetElement) break;
        }

        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'instant', 
                block: 'start'      
            });
        } else {
            setTimeout(() => scrollToFeaturedContent(attempts + 1), 2000); 
        }
    }

    // --- 浮窗创建与主逻辑 ---
    function createOverlayWindow() {
        if (document.getElementById(OVERLAY_ID)) { return; }

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        document.body.appendChild(overlay); 

        const header = document.createElement('div');
        header.id = HEADER_ID;
        header.textContent = 'edui123 日历';
        overlay.appendChild(header);

        const closeBtn = document.createElement('button');
        closeBtn.id = CLOSE_BTN_ID;
        closeBtn.textContent = '×';
        header.appendChild(closeBtn);

        const iframe = document.createElement('iframe');
        iframe.src = CALENDAR_URL;
        iframe.frameBorder = "0";
        iframe.style.cssText = 'width: 100%; flex-grow: 1; border: none;';
        overlay.appendChild(iframe);

        makeDraggable(overlay, header);
        closeBtn.onclick = () => { overlay.remove(); };
        
        closeBtn.onmouseover = () => { closeBtn.style.color = '#333'; };
        closeBtn.onmouseout = () => { closeBtn.style.color = '#666'; };
        
        scrollToFeaturedContent(0);
    }

    // --- 启动逻辑 ---
    if (document.body) {
        createOverlayWindow();
    } else {
        const observer = new MutationObserver((mutationsList, observer) => {
            if (document.body) {
                observer.disconnect();
                createOverlayWindow();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }

})();
