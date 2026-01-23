// ==UserScript==
// @name         元元大王直播间弹幕布局
// @version      1.6
// @description  1、自适应弹幕布局（按键 '0' 关闭或打开自适应弹幕）；2、弹幕画板可拖移；3、PK或连线状态变化时刷新视频画面（10秒冷却）避免音画不同步或画面卡顿
// @match        https://live.douyin.com/*
// @match        https://www.douyin.com/follow/live/*
// @match        https://www.douyin.com/root/live/*
// @icon         https://p3-pc.douyinpic.com/img/aweme-avatar/tos-cn-avt-0015_a0e8e9f73572e35260c3486956ce89d9~c5_300x300.jpeg
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/930333
// @downloadURL https://update.greasyfork.org/scripts/559969/%E5%85%83%E5%85%83%E5%A4%A7%E7%8E%8B%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%B9%E5%B9%95%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/559969/%E5%85%83%E5%85%83%E5%A4%A7%E7%8E%8B%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%B9%E5%B9%95%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ElCanvasDanmakuStyleID = 'el-canvas-danmaku-style';
    const ElVideoStyleID = 'el-video-style';
    const ElLinkMicLayoutStyleID = 'el-linkmic-style';

    let ElCanvasDanmaku, ElLinkMicLayoutContainer
    // positions computed by `evaluateLayout`
    let videoLeft, danmakuLeft, danmakuTop=5;

    let mutationObserver;

    function applyStyle(cssId, cssText) {
        let styleEl = document.getElementById(cssId);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = cssId;
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = cssText;
    }

    function near(v, x, epsilon) { return Math.abs(v - x) < epsilon; }

    function parsePercent(value) {
        if (!value) return null;
        const m = value.match(/([\d.]+)%/);
        return m ? parseFloat(m[1]) : null;
    }

    function getLinkMicLayoutContainer() {
        if (!ElLinkMicLayoutContainer)
            ElLinkMicLayoutContainer = document.querySelector('#LinkMicLayout');
        return ElLinkMicLayoutContainer
    }

    function getCanvasDanmaku() {
        if (!ElCanvasDanmaku)
            ElCanvasDanmaku = document.querySelector('div.CanvasDanmakuPlugin');
        return ElCanvasDanmaku
    }

    function moveVideo(left, top) {
        console.log(`DYLIVELAYOUT: moveVideo ${left}, ${top}`)
        applyStyle(ElVideoStyleID, `video[autoplay] { left: ${left}%; top: ${top}%; }`)
    }

    function moveLinkMicLayout(left, top) {
        console.log(`DYLIVELAYOUT: moveLinkMicLayout ${left}, ${top}`)
        applyStyle(ElLinkMicLayoutStyleID, `#LinkMicLayout { left: ${left}%; top: ${top}%; }`)
    }

    function moveCanvasDanmaku(left, top) {
        // console.log(`DYLIVELAYOUT: moveCanvasDanmaku ${left}, ${top}`)
        applyStyle(ElCanvasDanmakuStyleID, `div.CanvasDanmakuPlugin { left: ${left}%; top: ${top}%; }`)
    }

    let RESPONSIVE=true

    function evaluateLayout(e) {
        if (!RESPONSIVE) return;

        const container = getLinkMicLayoutContainer();
        if (!container) return;

        const dynamicLayoutContainer = container.querySelector(':scope div.dynamic-layout-container')
        if (dynamicLayoutContainer) {
            console.log("Found dynamicLayoutContainer")
            window.removeEventListener('resize', evaluateLayout);
            mutationObserver.disconnect()
            return moveCanvasDanmaku(0, 0);
        }

        const rect = container.getBoundingClientRect();
        const e1 = container.querySelector(':scope div.LGzZT73_');
        const target = container.querySelector(':scope div.LGzZT73_:not(:has(button[data-e2e="live-followbutton"]))');

        // 不是第一个PK窗格
        if (target && e1 != target) {
            moveCanvasDanmaku(0, 100)
            moveVideo(0, 0)
            moveLinkMicLayout(0, 0);
            return
        }

        let leftPercent, widthPercent, heightPercent;
        videoLeft = 0;
        danmakuLeft = 0;

        /* Case 1: real target exists → use style % */
        if (target) {
            leftPercent = parsePercent(target.style.left);
            widthPercent = parsePercent(target.style.width);
            heightPercent = parsePercent(target.style.height);

            if (leftPercent === null || widthPercent === null)
                return moveCanvasDanmaku(0, 100);

            const pkLayoutContainer = container.querySelector(':scope div.PKViewPlugin > div')
            if (pkLayoutContainer && pkLayoutContainer.style && pkLayoutContainer.style.width) {
                let pkLayoutWidth = parsePercent(pkLayoutContainer.style.width)
                if (!(pkLayoutWidth === null)) {
                    let blank = (100 - pkLayoutWidth) / 2

                    /*if (near(heightPercent, 100, 1) && pkLayoutWidth >= 1) {
                        leftPercent += blank + blank / 2
                        widthPercent *= pkLayoutWidth / 100
                        videoLeft = blank / 2
                    } else {*/
                        leftPercent += blank
                        widthPercent *= pkLayoutWidth / 100
                        videoLeft = 0
                    //}
                }
            }
        }
        /* Case 2: no target → infer from container + 16:9 */
        else {
            const containerWidth = rect.width;
            const containerHeight = rect.height;

            // height-fit 16:9 video
            const videoWidthPx = containerHeight * 9 / 16;

            if (videoWidthPx <= 0 || containerWidth <= 0)
                return moveCanvasDanmaku(0, 100);

            const blankLeftPx = (containerWidth - videoWidthPx) / 2;

            leftPercent = blankLeftPx / containerWidth * 100;
            widthPercent = videoWidthPx / containerWidth * 100;

            videoLeft = 16;
            leftPercent += 16;
        }

        /* Compute blank space */
        const blankLeft = leftPercent;
        const blankRight = 100 - (leftPercent + widthPercent);
        const placeOnLeft = blankLeft + 0.01 >= blankRight; // prefer left if almost same size

        danmakuLeft = placeOnLeft ?
            -100.3 + blankLeft : leftPercent + widthPercent + 0.3;

        moveCanvasDanmaku(danmakuLeft, danmakuTop);
        moveVideo(videoLeft, 0);
        moveLinkMicLayout(videoLeft, 0);
    }

    let LAST_REFRESH=0, LAST_SEATS_COUNT=0

    function onLinkMicLayoutChange() {
        evaluateLayout();
        setTimeout(evaluateLayout, 500);

        let count = getLinkMicLayoutContainer().querySelectorAll(':scope div.LGzZT73_').length;
        let now = Date.now();

        if ( count != LAST_SEATS_COUNT && now - LAST_REFRESH > 1*60*1000 ) {
            const button = document.querySelector('div.douyin-player-controls-left > slot[data-index="1"] > div > div:has(svg)')
            if (button) {
                setTimeout(button.click,200);
                LAST_REFRESH = now
                console.log('DYLIVELAYOUT: refreshed at ', Date(now))
            }
        }
        LAST_SEATS_COUNT = count;

        let names = ''
        getLinkMicLayoutContainer().querySelectorAll(':scope div.mkxwziet').forEach((e,i)=>{ if (i>0) names+='、'; names += e.textContent;})
        if (names != '')
            console.log('DYLIVELAYOUT: 连线主播 ',names);
    }

    function makeDanmakuDraggable() {
        const refcontainer = document.querySelector('#LinkMicBackgroundLayout');
        const danmaku = getCanvasDanmaku();
        if (!danmaku) return;

        danmaku.style.cursor = 'move';
        danmaku.style.userSelect = 'none';

        let dragging = false, borderShown = false
        let startX, startY;
        let startLeft, startTop;

        function percent(v, base) {
            return (v / base) * 100;
        }

        function onDown(e) {
            dragging = true;

            const rect = refcontainer.getBoundingClientRect();
            const dmRect = danmaku.getBoundingClientRect();

            const ev = e.touches ? e.touches[0] : e;

            startX = ev.clientX;
            startY = ev.clientY;

            startLeft = percent(dmRect.left - rect.left, rect.width);
            startTop  = percent(dmRect.top  - rect.top,  rect.height);

            e.preventDefault();
            // console.log("DYLIVELAYOUT: Mose down", startLeft)
        }

        function onMove(e) {
            if (!dragging) return;

            const rect = refcontainer.getBoundingClientRect();
            const ev = e.touches ? e.touches[0] : e;

            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            let left = startLeft + percent(dx, rect.width);
            let top  = startTop  + percent(dy, rect.height);
            // console.log("DYLIVELAYOUT: Mose move", left)

            if (near(top, 0, 1))
                top = 0
            if (near(left, 0, 1))
                left = 0
            if (near(left, danmakuLeft, 1))
                left = danmakuLeft

            moveCanvasDanmaku(left, top);

            // 🔹 show border while dragging
            if (!borderShown) {
                danmaku.style.border = '1px dashed rgba(0, 255, 255, 0.8)';
                danmaku.style.boxSizing = 'border-box';
                borderShown = true;
            }
        }

        function onUp(e) {
            if (!dragging) return;
            dragging = false;

            // 🔹 remove border after drag
            danmaku.style.border = '';
            borderShown = false;

            e.stopImmediatePropagation();
        }

        document.querySelector('#LikeLayout').addEventListener('mousedown', onDown);
        document.querySelector('#LinkMicLayout').addEventListener('mousedown', onDown);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    function reorganizePlayerControls() {
        const left = document.querySelector('div.douyin-player-controls-left');
        const right = document.querySelector('div.douyin-player-controls-right');
        if (!left || !right) return;

        const move = (selector) => {
            const el = right.querySelector(selector);
            if (el) left.appendChild(el);
        };

        move('slot[data-index="9"]');
        move('slot[data-index="6"]');
        move('slot[data-index="5"]');
    }

    function registerLayoutObserver() {
        const container = getLinkMicLayoutContainer();
        if (!container) return;

        mutationObserver = new MutationObserver(onLinkMicLayoutChange);
        mutationObserver.observe(container, { childList: true, subtree: true, attributes: true });

        window.addEventListener('resize', evaluateLayout);

        evaluateLayout();
    }

    function waitForElements(selectors, callback) {
        const missing = selectors.some(sel => !document.querySelector(sel));
        if (missing) {
            requestAnimationFrame(() => waitForElements(selectors, callback));
            return;
        }
        callback();
    }

    // danmaku
    waitForElements(['#LinkMicLayout'], registerLayoutObserver);
    waitForElements(['div.CanvasDanmakuPlugin'], makeDanmakuDraggable);

    let danmakuOn = true
    document.addEventListener('keydown', (event) => {
        let key = event.key.toLowerCase()
        if (key === 'b') {
            danmakuOn = !danmakuOn
            console.log('DYLIVELAYOUT: Danmaku',danmakuOn);
            if (danmakuOn)
                onLinkMicLayoutChange();
            else {
                moveCanvasDanmaku(0, 0);
                moveVideo(0, 0);
                moveLinkMicLayout(0, 0);
            }
        } else if (key === '0') {
            RESPONSIVE = !RESPONSIVE;
            if (RESPONSIVE)
                onLinkMicLayoutChange();
            else {
                moveCanvasDanmaku(0, 0);
                moveVideo(0, 0);
                moveLinkMicLayout(0, 0);
            }
        }

    });


    // function loopEvaluateLayout() {
    //     evaluateLayout();
    //     setTimeout(loopEvaluateLayout, 500);
    // }
    // setTimeout(loopEvaluateLayout, 500)

    // player controls
    // waitForElements([
    //     'slot:has(div[data-e2e="danmaku-setting-icon"])',
    //     'div.douyin-player-controls-left slot[data-index="1"]',
    //     'div.douyin-player-controls-right slot[data-index="9"]'
    // ], reorganizePlayerControls);
})();
