// ==UserScript==
// @name         评估面板快捷操作面板
// @namespace    div-left-bottom-floating
// @version      6.0
// @license      修越
// @match        https://search.bytedance.net/garr/fetch_review*
// @author       修越
// @description  评估模板快捷操作按钮，支持快速定位顶部/底部、query、分页、环境信息及rank快捷键
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559185/%E8%AF%84%E4%BC%B0%E9%9D%A2%E6%9D%BF%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/559185/%E8%AF%84%E4%BC%B0%E9%9D%A2%E6%9D%BF%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================== 全局变量 =====================
    const SCROLLER_SELECTOR = '[class^="evaluate-form-panel-"]'; // 面板滚动容器选择器
    let globalRankElements = []; // 存储所有 rank query 元素，用于全局快捷键

    // ===================== 创建按钮容器 =====================
    function createButtons(scroller) {
        if (!scroller) return;

        // 主按钮容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.zIndex = '10000';
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.gap = '5px';
        container.style.background = 'white';
        container.style.padding = '4px';
        container.style.border = 'none';
        container.style.borderRadius = '4px';
        container.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        container.style.alignItems = 'center';

        // 按钮统一样式
        const buttonStyle = 'padding:2px 6px; cursor:pointer; border:none; border-radius:4px; font-weight:bold; opacity:0.85; transition: all 0.2s ease;';

        // 创建单个按钮函数
        function createButton(text, bgColor, color, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = buttonStyle + `background:${bgColor}; color:${color};`;
            btn.addEventListener('click', onClick);
            btn.addEventListener('mouseenter', () => {
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1.05)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.opacity = '0.85';
                btn.style.transform = 'scale(1)';
            });
            return btn;
        }

        // ===================== 顶部滚动按钮 =====================
        const btnTop = createButton('↑', '#6c757d', 'white', () => {
            scroller.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ===================== 底部滚动按钮 =====================
        const btnBottom = createButton('↓', '#6c757d', 'white', () => {
            scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
        });

        // ===================== query 上下滚动按钮 =====================
        function scrollToQuery(direction) {
            const envElems = Array.from(scroller.querySelectorAll('div[id^="env-"]'))
                .filter(el => /^env-\d+-env-\d+$/.test(el.id));
            if (!envElems.length) return;

            const scrollerTop = scroller.getBoundingClientRect().top;
            let currentIndex = 0;
            let minOffset = Infinity;
            envElems.forEach((el, idx) => {
                const rect = el.getBoundingClientRect();
                const offset = Math.abs(rect.top - scrollerTop);
                if (offset < minOffset) {
                    minOffset = offset;
                    currentIndex = idx;
                }
            });

            let nextIndex = currentIndex + direction;
            if (nextIndex < 0) nextIndex = 0;
            if (nextIndex >= envElems.length) nextIndex = envElems.length - 1;
            envElems[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const btnPrev = createButton('↑query', '#007bff', 'white', () => scrollToQuery(-1));
        const btnNext = createButton('↓query', '#28a745', 'white', () => scrollToQuery(1));

        // ===================== rank hover 子按钮 =====================
        let subContainer = null;
        let hideTimeout = null;

        function showHover() {
            if (subContainer) return;
            const envElems = Array.from(scroller.querySelectorAll('div[id^="env-"]'))
                .filter(el => /^env-\d+-env-\d+$/.test(el.id));
            if (!envElems.length) return;

            subContainer = document.createElement('div');
            subContainer.style.position = 'absolute';
            subContainer.style.bottom = `${container.offsetHeight}px`;
            subContainer.style.left = '0px';
            subContainer.style.display = 'flex';
            subContainer.style.gap = '3px';
            subContainer.style.flexWrap = 'wrap';
            subContainer.style.background = 'white';
            subContainer.style.padding = '3px';
            subContainer.style.borderRadius = '4px';
            subContainer.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            subContainer.style.zIndex = '10001';

            envElems.forEach((el, idx) => {
                const btn = document.createElement('button');
                btn.textContent = `rank${idx + 1}`;
                btn.style.cssText = buttonStyle + 'background:#17a2b8;color:white;padding:2px 4px;font-size:12px;';
                btn.addEventListener('click', () => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
                subContainer.appendChild(btn);
            });

            container.appendChild(subContainer);
            subContainer.addEventListener('mouseenter', () => {
                if (hideTimeout) clearTimeout(hideTimeout);
            });
            subContainer.addEventListener('mouseleave', scheduleHide);
        }

        function scheduleHide() {
            if (hideTimeout) clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                if (subContainer) {
                    subContainer.remove();
                    subContainer = null;
                }
            }, 200);
        }

        btnNext.addEventListener('mouseenter', () => {
            updateGlobalRankElements();
            if (hideTimeout) clearTimeout(hideTimeout);
            showHover();
        });
        btnNext.addEventListener('mouseleave', scheduleHide);

        // ===================== 分页按钮 =====================
        function createPageButtons() {
            const pageElems = document.querySelectorAll('.ant-pagination-item');
            pageElems.forEach(pageElem => {
                const pageNum = pageElem.textContent.trim();
                if (!pageNum || container.querySelector(`.btn-page-${pageNum}`)) return;

                const btnPage = createButton(pageNum, '#ffc107', 'black', () => {
                    scroller.scrollTo({ top: 0, behavior: 'smooth' });
                    pageElem.click();
                    setTimeout(() => {
                        // 横向滚动容器
                        const scrollContainer = document.querySelector('[class^="snapshot-debug-container-"]');
                        if (!scrollContainer) return;

                        const index = parseInt(pageNum, 10) - 1;

                        // 目标 debug-content-item
                        const debugItem = scrollContainer.querySelector(`.debug-content-item-${index}`);
                        if (!debugItem) return;

                        // ⭐ 真正的对齐锚点：item 内部的 snapshot-debug
                        const anchor = debugItem.querySelector('[class^="snapshot-debug-"]');
                        if (!anchor) return;

                        const containerRect = scrollContainer.getBoundingClientRect();
                        const anchorRect = anchor.getBoundingClientRect();

                        let targetLeft =
                            anchorRect.left
                        - containerRect.left
                        + scrollContainer.scrollLeft;

                        // 安全兜底
                        targetLeft = Math.max(
                            0,
                            Math.min(
                                targetLeft,
                                scrollContainer.scrollWidth - scrollContainer.clientWidth
                            )
                        );

                        scrollContainer.scrollTo({
                            left: targetLeft,
                            behavior: 'smooth'
                        });
                    }, 300);




                });
                btnPage.className = `btn-page-${pageNum}`;
                container.appendChild(btnPage);
            });
        }

        const pageInterval = setInterval(() => {
            createPageButtons();
            if (document.querySelector('.ant-pagination-item')) clearInterval(pageInterval);
        }, 500);

        // ===================== 收起/展开按钮 =====================
        let collapsed = false;
        const btnCollapse = createButton('☰', '#343a40', 'white', () => {
            collapsed = !collapsed;
            for (let child of container.children) {
                if (child !== btnCollapse) child.style.display = collapsed ? 'none' : 'inline-flex';
            }
        });

        container.appendChild(btnTop);
        container.appendChild(btnPrev);
        container.appendChild(btnNext);
        container.appendChild(btnBottom);
        container.appendChild(btnCollapse);

        document.body.appendChild(container);

        // ===================== 按钮位置更新 =====================
        function updatePosition() {
            const rect = scroller.getBoundingClientRect();
            container.style.top = `${rect.bottom - container.offsetHeight}px`;
            container.style.left = `${rect.left}px`;
        }
        updatePosition();
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);

        // ===================== 全局 rank 快捷键逻辑（最终稳定版） =====================
        function updateGlobalRankElements() {
            const envElems = Array.from(scroller.querySelectorAll('div[id^="env-"]'))
                .filter(el => /^env-\d+-env-\d+$/.test(el.id));
            envElems.forEach((el, idx) => el.dataset.rank = idx + 1);
            globalRankElements = envElems;
        }

        // 周期性更新 rank query 元素，确保动态 DOM 生效
        setInterval(updateGlobalRankElements, 500);

        // 全局快捷键监听
        document.addEventListener('keydown', (e) => {
            const active = document.activeElement;
            const tag = active.tagName;
            const type = active.type;

            // ===================== 输入保护 =====================
            // 只阻止文本输入框、textarea、contentEditable区域
            if (
                active.isContentEditable ||
                (tag === 'INPUT' && ['text','password','number','search','email','tel','url'].includes(type)) ||
                tag === 'TEXTAREA'
            ) return;

            // 按数字键 1~N 跳转 rank
            const key = parseInt(e.key, 10);
            if (!isNaN(key)) {
                const target = globalRankElements.find(el => parseInt(el.dataset.rank) === key);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // ===================== 初始化按钮 =====================
    const interval = setInterval(() => {
        const scroller = document.querySelector(SCROLLER_SELECTOR);
        if (scroller) {
            createButtons(scroller);
            clearInterval(interval);
        }
    }, 500);

    // ===================== 指定 div 按钮点击自动回顶部 =====================
    function bindDivButtonsToScrollTop() {
        const scroller = document.querySelector(SCROLLER_SELECTOR);
        if (!scroller) return;

        const targetDivs = document.querySelectorAll(
            'div.semi-space.semi-space-align-center.semi-space-horizontal.semi-space-medium-horizontal.semi-space-medium-vertical'
        );

        targetDivs.forEach(div => {
            div.querySelectorAll('button').forEach(btn => {
                if (!btn.dataset.bound) {
                    btn.addEventListener('click', () => {
                        scroller.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                    btn.dataset.bound = 'true';
                }
            });
        });
    }
    setInterval(bindDivButtonsToScrollTop, 500);

})();
