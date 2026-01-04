// ==UserScript==
// @name         绅士漫画wnacg - plus
// @namespace    https://wnlink.ru/
// @version      2025-10-21
// @description  本脚本约98%的代码由AI生成
// @description  AI如是描述到"本脚本为绅士漫画（wnacg）站点优化工具，自动净化页面、隐藏广告与干扰元素，提供清爽阅读环境。
// @description  在漫画阅读页新增左侧快捷导航，支持一键切换分页/滚动模式、跳转上下页、返回顶部；右侧集成可拖拽缩放滑块，自由调节图片大小并自动保存设置。
// @description  内置样式菜单，可启用无缝滚动、切换主题色、简化界面等个性化功能。
// @description  智能感应图片宽度，自动隐藏侧栏避免遮挡，兼顾美观与实用。"
// @description  成屎山了也动动
// @author       🥵🥵🥵
// @match        *://*.wnacg.ru/*
// @match        *://*.wnacg.com/*
// @include      /^https?:\/\/.*\.wnacg0\d\.cc\/.*$/
// @include      /^https?:\/\/.*\.wn0\d\.ru\/.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wnacg.ru
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551852/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BBwnacg%20-%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/551852/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BBwnacg%20-%20plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    :root {
        --bcolor: #334348;
        --bhcolor: #2b3a3f;
        --zcolor: #f3f5f5;
        --zhcolor: #fff;
    }
    .block {display: block !important;}
    .hide {display: none !important;}

    iframe,
    .result,
    .dlh,
    .tocaowrap,
    #tuzaoblock,
    .footer.wrap,
    #img_list br,
    #img_list span,
    #control_block,
    img[alt="Game Tip"],
    #bodywrap:has(link[rel="prerender"]) {
        display: none !important;
    }

    #imgarea {display: block;margin: 0 auto;user-select: none;padding-bottom: 2rem;}
    #bread {padding: 0;}
    .newpagewrap {padding: 12px;display: none;}
    .pageselect:focus-visible {
        outline: 2px solid #666;
        outline-offset: 1px;
    }

    .png.bread {font-weight: bold;}
    .png.bread em,.png.bread a {font-weight: normal;}

    /* 复制搜索框相关 */
    .ss {
        background: url(./themes/weitu/images/search.png) no-repeat right / cover;
        width: 8rem;
        float: inline-start;
        border-radius: 20px;
        margin-top: 4px;
        margin-left: 10px;
    }
    .sss {width: calc(100% - 50px) !important;}

    /* 悬浮左侧菜单 */
    .sidebar-menu {
        background: var(--bcolor);
        position: fixed;
        left: .8rem;
        top: 50%;
        z-index: 1000;
        transform: translateY(-50%);
        list-style: none;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 12px 0;
    }

    .sidebar-menu.starts {
        padding-right: 4px;
        border-radius: 0 12px 12px 0;
        transform: translateY(-50%) translateX(-100%) !important;
        opacity: 0;
        visibility: hidden;
        transition: transform 0.5s ease, opacity 0.3s ease, visibility 0.3s ease;
    }

    .menulook .sidebar-menu.starts {
        transform: translateY(-50%) translateX(-12%) !important;
        opacity: 1;
        visibility: visible;
        transition: transform 0.5s ease, opacity 0.3s ease, visibility 0.3s ease;
    }

    .sidebar-menu li a {
        background: var(--bcolor);
        color: var(--zcolor);
        font-size: .8rem;
        padding: 14px 20px;
        display: block;
        text-decoration: none;
        transition: background 0.2s;
        white-space: nowrap;
    }

    .sidebar-menu li a:hover {
        background: var(--bhcolor);
        color: var(--zhcolor);
    }

    .sidebar-menu li a::before {
        margin-right: 8px;
        font-size: 16px;
    }

    #a1::before {content: "📄";}
    #a2::before {content: "📖";}
    #a3::before {content: "📜";}
    #a4::before {content: "🔝";}
    #a1,#a2,#a3,#a4,#a5,#a7,#a8,#a9 {user-select: none;cursor: pointer;}
    #a6 {user-select: none;text-align: center;}
    #a6 span {font-size: 1.5rem;}
    #a5::before {content: "🎨";}
    #a8::before {content: "👇";}
    #a9::before {content: "👆";}

    #trigger-circle {
        background: url(/themes/u17/images/loading2.gif) no-repeat;
        background-size: 80%;
        background-position: center;
        color: var(--zcolor);
        position: fixed;
        top: 50%;
        left: 0;
        z-index: 2000;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        opacity: 0;
        visibility: hidden;
        transform: translateX(-100%);
        transition: transform 0.5s ease, opacity 0.3s ease, visibility 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        cursor: pointer;
    }

    #trigger-circle.active {
        opacity: 1;
        visibility: visible;
        transform: rotate(90deg) translateY(30%);
        transition: transform 0.5s ease, opacity 0.3s ease, visibility 0.3s ease;
    }

    #trigger-circle:hover {
        background: url(/themes/u17/images/loading2.gif) no-repeat;
        background-size: 90%;
        background-position: center;
        transform: translateX(0%) !important;
        transition: transform 0.5s ease;
    }

    .menulook #trigger-circle {
        opacity: .1;
        position: fixed;
        height: 200%;
        width: 200%;
        top: 0;
        left: 0;
        border-radius: 0;
        transform: none !important;
        transition: transform 0.3s ease;
        background: #000000;
        z-index: 999;
    }

    .lookings {
        /*outline: 2px solid var(--bcolor);*/
        border-top: 2px solid var(--bcolor);
        border-right: 2px solid var(--bcolor);
        border-bottom: 2px solid var(--bcolor);
        border-left: 2px solid var(--bcolor);
    }

    /* 样式菜单相关 */
    #stylemenu {
        display: none;
        list-style: none;
        margin: 0px;
        position: fixed;
        top: 50%;
        left: 9rem;
        background: var(--bcolor);
        color: var(--zcolor);
        border-radius: 10px;
        padding: 8px;
    }
    #stylemenu > li {user-select: none;}
    #img_list > div {user-select: none}
    .b1 #img_list > div {padding: 0 !important;}
    .b2 #trigger-circle {background: var(--bcolor);width: 50px;height: 50px;transform: translateX(-40%);}
    .b2 #trigger-circle::before {content: "👉";font-size: 1.5rem;}
    .b3 .newpagewrap {display: block;}
    .b3 #a6,.b3 #a7,.b3 #a8,.b3 #a9 {display: none;}
    .b3 #imgarea {padding: 0 !important;}
    #header,.nav li a {background: var(--bcolor);color: var(--zcolor);}
    `)

    const searchclone = document.getElementById('settings_person');
    if (searchclone) {
        searchclone.insertAdjacentHTML('beforebegin', `
            <div class="search ss">
              <form id="album_search q-form" action="/search/" method="get" target="_blank">
                <div class="input-append" id="q-input">
                  <input type="text" class="search-query tips ui-autocomplete-input sss" name="q" value="" title="搜索漫畫"
                  autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true" placeholder="    搜索漫画">
                  <input style="display:none" type="radio" name="f" value="_all" checked="">
                  <input style="display:none" name="s" value="create_time_DESC">
                  <input style="display:none" name="syn" value="yes">
                  <button type="" name=""></button>
                </div>
              </form>
            </div>
        `);
    }
    // ============================================================================================================================================
    // ============================================================================================================================================
    // ========== 特定页面逻辑：只在图片查看页运行 ===============
    // ============================================================================================================================================
    // ============================================================================================================================================
    const url = window.location.href;
    const type = url.includes('/photos-view-id-') ? 0 //分页
    : url.includes('/photos-slide-aid-') ? 1 //滚动
    : -1; // 默认值

    const getNum = str => str?.match(/\d+/)?.[0] ?? '';

    let isppp = localStorage.getItem('ppp') === 'true';
    let ispp = isppp;
    let isLookActive = localStorage.getItem('menulook') === 'true';
    if (isLookActive) {
        document.body.classList.add('menulook');
    }

    // 防止广告屏蔽插件 屏蔽下载按钮
    if (url.includes('photos-index-')){
        重置元素类名('#ads', 'download_btn');
    }else if (url.includes('download-index-aid-')){
        重置元素类名('#adsbox', 'download_btn');
    }

    // 阅读页面////////////////////////////////////////
    if (type != -1) {
        console.log('当前是图片查看页，启用高级功能');
        console.log(type === 0 ? '当前是分页模式' : '当前是滚动模式',type);

        右侧栏图片缩放功能();

        const id1 = getNum(document.querySelector('link[rel="alternate"]')?.href);
        const id2 = getNum(url); // 本页id
        //const id3 = getNum(prevpage); // 上一页id
        //const id4 = getNum(nextpage); // 下一页id
        const a1href = `/photos-index-aid-${id1}.html`;
        const a2href = type === 0 ? 'javascript:void(0)' : a1href;
        const a3href = `/photos-slide-aid-${id1}.html`;
        //console.log(`详情页: ${id1}\n本页: ${id2}\n上页: ${id3}\n下页: ${id4}`);
        const htmlString = `
            <ul class="sidebar-menu">
              <li><a id="a1" href="${a1href}">详情页</a></li>
              <li><a id="a2" href="${a2href}">分页</a></li>
              <li><a id="a3" href="${a3href}">滚动</a></li>
              <li><a id="a9">上页</a></li>
              <li><a id="a8">下页</a></li>
              <li><a id="a5">样式</a></li>
              <li><a id="a4">顶部</a></li>
              <li><a id="a7"></a></li>
              <li><a id="a6"></a></li>
            </ul>
        `;
        document.body.insertAdjacentHTML('beforeend', htmlString);
        创建样式菜单();
        // 菜单开关
        const trigger = document.createElement('div');
        trigger.id = 'trigger-circle';
        trigger.addEventListener('click', () => {
            const hasLook = document.body.classList.toggle('menulook');
            localStorage.setItem('menulook', hasLook.toString());
        });
        document.body.appendChild(trigger);
        // 初始化 显示/隐藏 菜单
        if (isppp) {
            update隐藏菜单();
        } else {
            update显示菜单();
        }
        // a4 跳转至顶部
        const jumptopel = document.getElementById("a4")
        jumptopel.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        // a5 显示/隐藏 样式菜单
        const a5 = document.querySelector('#a5');
        const stylemenu = document.querySelector('#stylemenu');
        a5.addEventListener('click', () => {
            stylemenu.classList.toggle('block');
        });
        // 是否强制隐藏菜单
        if (!isppp){
            自适应菜单(type);
        }
    }

    // 分页模式////////////////////////////////////////
    if (type == 0) {
        // a8 a9
        const a8 = document.querySelector('#a8');
        a8.href = nextpage;
        const a9 = document.querySelector('#a9');
        a9.href = prevpage;
        // a6
        const selectedOption = document.querySelector('option[selected]');
        const num = selectedOption ? selectedOption.textContent.match(/\d+/)?.[0] || '' : '';
        const nums = document.querySelector('span.newpagelabel').textContent.match(/\/\d+$/);
        const htmlpagelabel = `<span class="newpagelabel"><b>${num}</b>${nums}</span>`
        const a6 = document.querySelector('#a6');
        a6.insertAdjacentHTML('beforeend', htmlpagelabel);
        // a7
        const pageselect = document.querySelector('.newpage > label');
        const a7 = document.querySelector('#a7');
        if (pageselect && a7) {
            const clone = pageselect.cloneNode(true);
            a7.appendChild(clone);
        }
        document.querySelector('#a7 .pageselect').addEventListener('change', function() {
            location = window.location.origin + '/photos-view-id-' + this.value;
        });

        document.querySelector('.pageselect').addEventListener('change', function() {
            location = window.location.origin + '/photos-view-id-' + this.value;
        });
    }

    // 滚动模式////////////////////////////////////////
    if (type == 1) {
        GM_addStyle(`
            /* 强制显示当前页数和下拉式选页 */
            #a6,#a7 {display: block !important;}
            /* 隐藏上下页菜单项 */
            #a8,#a9 {display: none;}
        `);

        给滚动模式添加下拉式选页();

        // 图片多卡
        if (imglist.length < 50){
            loadAndShowFancybox();
            禁用网站点击滚动();
        }
        else{

        }

        // 获取当前页数 !!!初始化!!!
        updatePageIndicator();
        // 监听滚动和 DOM 变化
        window.addEventListener('scroll', 防抖函数(updatePageIndicator, 200));
        const observer = new MutationObserver(防抖函数(updatePageIndicator, 300));
        observer.observe(document.getElementById('img_list'), {
            childList: true,
            subtree: true
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    function 重置元素类名(selector, newClass) {
        const element = document.querySelector(selector);
        if (element) {
            element.removeAttribute('id');
            element.className = '';
            element.classList.add(newClass);
        }
    }

    function 防抖函数(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function update隐藏菜单() {
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const triggercircle = document.querySelector('#trigger-circle');
        sidebarMenu?.classList.add('starts');
        triggercircle?.classList.add('active');
    }

    function update显示菜单() {
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const triggercircle = document.querySelector('#trigger-circle');
        sidebarMenu?.classList.remove('starts');
        triggercircle?.classList.remove('active');
    }

    function 自适应菜单(type, retries = 5) {
        // 根据 type 选择要观察的目标元素
        let targetElement = null;
        if (type === 0) {
            targetElement = document.getElementById('picarea');
        } else if (type === 1) {
            targetElement = document.querySelector('#img_list > div > img');
        }
        // 如果找到了，继续执行逻辑
        if (targetElement) {
            let timeoutId = null;
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const elementWidth = entry.contentRect.width;
                    const threshold = window.innerWidth * 0.8;

                    if (elementWidth > threshold) {
                        if (!timeoutId) {
                            timeoutId = setTimeout(() => {
                                update隐藏菜单();
                                timeoutId = null;
                            }, 1500);
                        }
                    } else {
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                            timeoutId = null;
                        }
                        update显示菜单();
                    }
                }
            });
            resizeObserver.observe(targetElement);
            return; // 成功初始化，结束
        }
        // 如果没找到，且还有重试次数
        if (retries > 0) {
            console.warn(`Target element not found for type: ${type}, retrying... (${5 - retries + 1}/5)`);
            setTimeout(() => {
                自适应菜单(type, retries - 1);
            }, 1500);
        } else {
            console.warn('Failed to find target element after 5 attempts. Giving up.');
        }
    }

    function 给滚动模式添加下拉式选页() {
        const htmlpagelabel = `<label><select class="pageselect"></select></label>`
        const a7 = document.querySelector('#a7');
        a7.insertAdjacentHTML('beforeend', htmlpagelabel);
        const pageSelect = document.querySelector('.pageselect');
        if (pageSelect) {
            const imgListElement = document.querySelector('#img_list');
            if (!imgListElement) {
                console.error("#img_list 元素未找到！");
            } else {
                // 假设 imglist 是定义好的数组
                for (let i = 1; i <= imglist.length; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `第 ${i} 页`;
                    pageSelect.appendChild(option);
                }
                // 绑定 change 事件处理函数
                pageSelect.addEventListener('change', function() {
                    const selectedIndex = this.value;
                    const selectedElement = imgListElement.querySelector(`div:nth-child(${selectedIndex})`);
                    if (selectedElement) {
                        selectedElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }
    }

    function 右侧栏图片缩放功能() {
        // 如果已经初始化过，避免重复创建
        if (document.getElementById('zoom-slider-container')) {
            return;
        }

        // 配置项
        const CONFIG = {
            MIN_PERCENT: 20,
            MAX_PERCENT: 120,
            TRACK_HEIGHT: 300,
            STORAGE_KEY: 'pageZoom',
            HANDLE_SIZE: 24,
            THUMB_OPACITY_ON_HOVER: 1,
            THUMB_OPACITY_DEFAULT: 0,
            TRANSITION_SPEED: '0.3s ease'
        };

        function getTransformY(el) {
            const style = window.getComputedStyle(el);
            const matrix = new DOMMatrix(style.transform);
            return matrix.m42;
        }

        // 获取存储值
        let currentPercent = 100;
        try {
            currentPercent = parseInt(localStorage.getItem(CONFIG.STORAGE_KEY)) || 100;
        } catch (e) {
            console.warn("无法访问 localStorage");
        }

        // 创建全局样式（用于控制图片宽度）
        const widthStyle = document.createElement('style');
        widthStyle.id = 'zoom-slider-width-style';
        document.head.appendChild(widthStyle);

        function updateGlobalPageWidth(percent) {
            widthStyle.textContent = `
                /* wnacg */
                #imgarea,
                /* wnacg下拉式 */
                #img_list > div > img {
                    width: ${percent}% !important;
                    transition: width ${CONFIG.TRANSITION_SPEED};
                }
            `;
        }

        updateGlobalPageWidth(currentPercent);

        // 创建主容器
        const mainContainer = document.createElement('div');
        mainContainer.id = 'zoom-slider-container';
        Object.assign(mainContainer.style, {
            width: `${CONFIG.HANDLE_SIZE * 2}px`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            right: '0',
            top: '0',
            zIndex: '99999',
            pointerEvents: 'auto'
        });

        // Hover 效果
        mainContainer.addEventListener('mouseenter', () => {
            thumb.style.opacity = CONFIG.THUMB_OPACITY_ON_HOVER;
            label.style.opacity = CONFIG.THUMB_OPACITY_ON_HOVER;
            resetButton.style.opacity = CONFIG.THUMB_OPACITY_ON_HOVER;
        });
        mainContainer.addEventListener('mouseleave', () => {
            thumb.style.opacity = CONFIG.THUMB_OPACITY_DEFAULT;
            label.style.opacity = CONFIG.THUMB_OPACITY_DEFAULT;
            resetButton.style.opacity = CONFIG.THUMB_OPACITY_DEFAULT;
        });

        // 创建滑块容器
        function createSliderContainer() {
            const el = document.createElement('div');
            Object.assign(el.style, {
                width: `${CONFIG.HANDLE_SIZE}px`,
                height: `${CONFIG.TRACK_HEIGHT}px`,
                backgroundColor: 'rgba(200, 200, 200, 0.4)',
                borderRadius: '18px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: `background-color ${CONFIG.TRANSITION_SPEED}`,
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                pointerEvents: 'auto'
            });

            el.addEventListener('mouseenter', () => {
                el.style.backgroundColor = 'rgba(200, 200, 200, 0.9)';
            });
            el.addEventListener('mouseleave', () => {
                el.style.backgroundColor = 'rgba(200, 200, 200, 0.4)';
            });

            return el;
        }

        // 创建滑块按钮
        function createThumb() {
            const el = document.createElement('div');
            Object.assign(el.style, {
                width: `${CONFIG.HANDLE_SIZE}px`,
                height: `${CONFIG.HANDLE_SIZE}px`,
                background: 'linear-gradient(to bottom, #888, #444)',
                borderRadius: '50%',
                cursor: 'grab',
                transition: `transform 0.1s ease-out, opacity ${CONFIG.TRANSITION_SPEED}`,
                opacity: CONFIG.THUMB_OPACITY_DEFAULT,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            });
            return el;
        }

        // 创建标签
        function createLabel() {
            const el = document.createElement('div');
            Object.assign(el.style, {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333',
                transition: `opacity ${CONFIG.TRANSITION_SPEED}`,
                opacity: CONFIG.THUMB_OPACITY_DEFAULT,
                marginTop: '8px',
                textAlign: 'center'
            });
            el.textContent = `${currentPercent}%`;
            return el;
        }

        // 创建重置按钮
        function createResetButton() {
            const el = document.createElement('div');
            Object.assign(el.style, {
                fontSize: '14px',
                padding: '4px',
                width: 'min-content',
                cursor: 'pointer',
                opacity: CONFIG.THUMB_OPACITY_DEFAULT,
                transition: `opacity ${CONFIG.TRANSITION_SPEED}`,
                textAlign: 'center'
            });
            el.textContent = '🔄';
            return el;
        }

        // 初始化组件
        const sliderContainer = createSliderContainer();
        const thumb = createThumb();
        const label = createLabel();
        const resetButton = createResetButton();
        sliderContainer.appendChild(thumb);
        mainContainer.appendChild(sliderContainer);
        mainContainer.appendChild(label);
        mainContainer.appendChild(resetButton);
        document.body.appendChild(mainContainer);

        // 辅助函数
        function getTrackHeight() {
            return CONFIG.TRACK_HEIGHT - CONFIG.HANDLE_SIZE;
        }

        function setSliderPosition(y) {
            thumb.style.transform = `translateY(${y}px)`;
        }

        const debouncedSave = 防抖函数((percent) => {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY, percent);
            } catch (e) {
                console.warn("无法写入 localStorage");
            }
        }, 300);

        function updateValue(y) {
            if (y < 0) y = 0;
            if (y > getTrackHeight()) y = getTrackHeight();
            const percent = Math.round(
                ((getTrackHeight() - y) / getTrackHeight()) * (CONFIG.MAX_PERCENT - CONFIG.MIN_PERCENT) + CONFIG.MIN_PERCENT
            );
            label.textContent = `${percent}%`;
            updateGlobalPageWidth(percent);
            currentPercent = percent;
            debouncedSave(percent);
        }

        // 拖拽逻辑
        let dragging = false;
        let startY = 0;
        let startTop = 0;

        thumb.addEventListener('mousedown', e => {
            dragging = true;
            startY = e.clientY;
            startTop = getTransformY(thumb);
            thumb.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            const dy = e.clientY - startY;
            let newTop = startTop + dy;
            newTop = Math.max(0, Math.min(getTrackHeight(), newTop));
            setSliderPosition(newTop);
            updateValue(newTop);
        });

        document.addEventListener('mouseup', () => {
            dragging = false;
            thumb.style.cursor = 'grab';
        });

        // 触摸事件
        thumb.addEventListener('touchstart', e => {
            dragging = true;
            startY = e.touches[0].clientY;
            startTop = getTransformY(thumb);
        });

        document.addEventListener('touchmove', e => {
            if (!dragging) return;
            const dy = e.touches[0].clientY - startY;
            let newTop = startTop + dy;
            newTop = Math.max(0, Math.min(getTrackHeight(), newTop));
            setSliderPosition(newTop);
            updateValue(newTop);
        });

        document.addEventListener('touchend', () => {
            dragging = false;
        });

        // 重置功能
        resetButton.addEventListener('click', () => {
            currentPercent = 100;
            const trackHeight = getTrackHeight();
            const initialTop = ((CONFIG.MAX_PERCENT - currentPercent) / (CONFIG.MAX_PERCENT - CONFIG.MIN_PERCENT)) * trackHeight;
            setSliderPosition(initialTop);
            updateGlobalPageWidth(currentPercent);
            label.textContent = `${currentPercent}%`;
            debouncedSave(currentPercent);
        });

        // 初始位置
        const initialTop = ((CONFIG.MAX_PERCENT - currentPercent) / (CONFIG.MAX_PERCENT - CONFIG.MIN_PERCENT)) * getTrackHeight();
        setSliderPosition(initialTop);

        // 滚轮缩放
        sliderContainer.addEventListener('wheel', function (e) {
            e.preventDefault();
            let delta = Math.sign(e.deltaY);
            let newPercent = currentPercent + (delta > 0 ? -1 : 1);
            newPercent = Math.max(CONFIG.MIN_PERCENT, Math.min(newPercent, CONFIG.MAX_PERCENT));
            const trackHeight = getTrackHeight();
            const newY = ((CONFIG.MAX_PERCENT - newPercent) / (CONFIG.MAX_PERCENT - CONFIG.MIN_PERCENT)) * trackHeight;
            setSliderPosition(newY);
            updateValue(newY);
        }, { passive: false });
    }

    // 辅助函数：获取当前视口内最中心的图片
    function getVisibleImage() {
        const images = document.querySelectorAll('#img_list > div > img');
        if (images.length === 0) return null;
        const viewportCenter = window.innerHeight / 2 + window.scrollY;
        let bestImage = null;
        let minDistance = Infinity;
        images.forEach(img => {
            // 跳过未加载的图片（可能只有 data-src）
            const src = img.src || img.getAttribute('data-src') || '';
            if (!src) return;
            const rect = img.getBoundingClientRect();
            const imgCenter = rect.top + rect.height / 2 + window.scrollY;
            const distance = Math.abs(imgCenter - viewportCenter);
            if (distance < minDistance) {
                minDistance = distance;
                bestImage = img;
            }
        });

        return bestImage;
    }

    // 获取当前页码（1-based）
    function getCurrentPageNumber() {
        const currentImg = getVisibleImage();
        if (!currentImg) return null;
        const currentSrc = currentImg.src || currentImg.getAttribute('data-src') || '';
        if (!currentSrc) return null;
        // 清理 URL（可选）：有些网站会带参数，如 ?v=123，可以去掉
        const cleanUrl = (url) => {
            try {
                const u = new URL(url, window.location.href);
                u.search = ''; // 去掉查询参数（按需调整）
                return u.href;
            } catch {
                return url; // 如果不是合法 URL，原样返回
            }
        };
        const cleanedCurrent = cleanUrl(currentSrc);
        // 假设 imglist 是全局变量，每个元素有 .url 字段
        if (typeof imglist === 'undefined' || !Array.isArray(imglist)) {
            console.warn('imglist 未定义或不是数组');
            return null;
        }
        for (let i = 0; i < imglist.length; i++) {
            const itemUrl = imglist[i]?.url || '';
            const cleanedItem = cleanUrl(itemUrl);
            if (cleanedCurrent === cleanedItem) {
                return i + 1; // 1-based index
            }
        }

        return null; // 未找到匹配
    }

    // 显示页码
    function displayPageNumber(page) {
        const bold = document.querySelector('.boldpage');
        if (!bold) {
            const a6 = document.querySelector('#a6');
            const newpagelabel = document.createElement('span');
            newpagelabel.className = 'newpagelabel';
            newpagelabel.textContent = '/' + imglist.length || '?';
            const bold = document.createElement('b');
            bold.className = 'boldpage';
            bold.textContent = '0';
            newpagelabel.prepend(bold);
            a6.appendChild(newpagelabel);
        }
        bold.textContent = page;
    }

    // 主逻辑：定期检查当前页
    function updatePageIndicator() {
        const page = getCurrentPageNumber();
        if (page !== null) {
            displayPageNumber(page);
        }
    }

    function 创建样式菜单() {
        const ul = document.createElement('ul');
        ul.id = 'stylemenu';

        // 选项配置
        const options = [
            {
                label: '滚动无缝',
                key: 'scrollSmooth',
                action: (checked) => {
                    document.body.classList.toggle('b1', checked);
                }
            },
            {
                label: '禁用动态图标',
                key: 'disableIcons',
                action: (checked) => {
                    document.body.classList.toggle('b2', checked);
                }
            },
            {
                label: '简洁左侧栏',
                key: 'pure',
                action: (checked) => {
                    document.body.classList.toggle('b3', checked);
                }
            },
            {
                label: '强制隐藏左侧栏',
                key: 'ppp',
                action: (checked) => {
                    document.body.classList.toggle('b4', checked);
                    if (ispp) {
                        update隐藏菜单();
                        ispp = false;
                    } else {
                        update显示菜单();
                        ispp = true;
                    }
                }
            },
            {
                label: '主题色白',
                key: 'themeWhite',
                action: (checked) => {
                    if (checked) {
                        document.documentElement.style.setProperty('--bcolor', '#fff');
                        document.documentElement.style.setProperty('--zcolor', '#000');
                        // 取消灰主题
                        localStorage.removeItem('themeGray');
                        const grayCheckbox = document.querySelector('[data-key="themeGray"]');
                        if (grayCheckbox) grayCheckbox.checked = false;
                    }
                },
                exclusive: true // 与灰主题互斥
            },
            {
                label: '主题色灰',
                key: 'themeGray',
                action: (checked) => {
                    if (checked) {
                        document.documentElement.style.setProperty('--bcolor', '#3e3e3e');
                        document.documentElement.style.setProperty('--zcolor', '#fff');
                        // 取消白主题
                        localStorage.removeItem('themeWhite');
                        const whiteCheckbox = document.querySelector('[data-key="themeWhite"]');
                        if (whiteCheckbox) whiteCheckbox.checked = false;
                    }
                },
                exclusive: true
            }
        ];

        options.forEach(opt => {
            const li = document.createElement('li');
            li.style.margin = '8px 0';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = opt.key;
            checkbox.dataset.key = opt.key;

            const label = document.createElement('label');
            label.htmlFor = opt.key;
            label.textContent = opt.label;

            // 初始化状态
            const saved = localStorage.getItem(opt.key) === 'true';
            checkbox.checked = saved;
            opt.action(saved); // 应用初始状态

            checkbox.addEventListener('change', () => {
                const checked = checkbox.checked;
                if (opt.exclusive && checked) {
                    // 如果是互斥项，清除其他互斥项
                    options.forEach(o => {
                        if (o.exclusive && o.key !== opt.key) {
                            localStorage.removeItem(o.key);
                            const otherCheckbox = document.querySelector(`[data-key="${o.key}"]`);
                            if (otherCheckbox) {
                                otherCheckbox.checked = false;
                                o.action(false);
                            }
                        }
                    });
                }
                localStorage.setItem(opt.key, checked);
                opt.action(checked);
            });
            li.appendChild(checkbox);
            li.appendChild(label);
            ul.appendChild(li);
        });
        document.body.appendChild(ul);
    }

    function loadAndShowFancybox(){
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@6.0/dist/fancybox/fancybox.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@6.0/dist/fancybox/fancybox.umd.js';
        script.onload = function () {
            const galleryItems = imglist.map(img => ({
                src: img.url
                //thumbSrc: img.url
                //caption: img.caption
            }));
            console.log("fancybox js加载成功, 图片数量: ",galleryItems.length)

            document.querySelector('#a2').addEventListener('click', function() {
                Fancybox.show(galleryItems, {
                    dragToClose: false //禁用拖拽关闭
                    // 没找到怎么禁用背景遮罩关闭
                });
            });
        };
        document.body.appendChild(script);
    }

    function 禁用网站点击滚动(){
        $(document.body).off('click');
    }

})();