// ==UserScript==
// @name         虎扑增强
// @name:en      Hupu Enhancement
// @name:zh-CN   虎扑增强
// @namespace    https://github.com/zhaeong97/
// @version      1.4.1
// @description  虎扑帖子图片优化、视频悬浮、评论交互增强、工具栏优化等多项功能，提升虎扑浏览体验
// @description:zh-CN  虎扑帖子图片优化、视频悬浮、评论交互增强、工具栏优化等多项功能，提升虎扑浏览体验
// @description:en Hupu posts, image optimization, video hover effects, enhanced comment interactions, toolbar improvements, and more features to elevate your Hupu browsing experience.
// @author       zhaeong
// @match        https://bbs.hupu.com/*
// @match        https://*.hupu.com/*
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @icon64       https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @resource     layuiCss https://unpkg.com/layui@2.9.14/dist/css/layui.css
// @resource     layuiJs https://unpkg.com/layui@2.9.14/dist/layui.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @license      AGPL-3.0-or-later
// @licenseURL   https://www.gnu.org/licenses/agpl-3.0.html
// @noframes
// @note         25-12-02 1.4.1 优化视频悬浮窗功能并增强错误处理
// @note         25-12-02 1.4.0 初版发布（本地反复打磨，4个功能模块，因此v1.4.0）
// @homepage     https://github.com/zhaeong97/tampermonkey
// @supportURL   https://github.com/zhaeong97/tampermonkey/issues
// @downloadURL https://update.greasyfork.org/scripts/557606/%E8%99%8E%E6%89%91%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557606/%E8%99%8E%E6%89%91%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置管理类
    const ConfigManager = {
        // 配置存储键值key
        CONFIG_SAVE_KEY: 'hupu_enhance_config',

        // 默认配置
        defaultConfig: {
            // 图片缩放相关
            img: {
                // 图片标签
                imageSelector: '.image-wrapper img.thread-img',
                // 默认宽度(单位:px)
                thumbnailWidth: '150',
                // 鼠标悬浮宽度(单位:px)
                hoverWidth: '400',

                // 最大缩放宽度
                maxZoomWidth: 800,
                // 每次滚动的缩放比例
                zoomRatio: 1.3,
                // 图片缩放控制键
                zoomKey: 'z',
                // 图片最大化控制键
                maxKey: 'a',
            },
            // 视频缩放相关
            video: {
                // 视频标签
                videoSelector: 'section video',

                // 横向视频：默认宽度（高度自动）(单位:px)
                thumbnailWidth: '400',
                // 纵向视频：默认高度（宽度自动）(单位:px)
                thumbnailHeight: '500',

                // 横向视频：鼠标悬浮宽度（高度自动）(单位:px)
                hoverWidth: '600',
                // 纵向视频：鼠标悬浮高度（宽度自动）(单位:px)
                hoverHeight: '700',

                // 最大缩放宽度
                maxZoomWidth: 800,
                // 每次滚动的缩放比例
                zoomRatio: 1.5,
                // 视频缩放控制键
                zoomKey: 'z',
                // 视频最大化控制键
                maxKey: 'a',
            },
            // 回复列表相关
            reply: {
                // 是否启用回复交互增强功能
                enabled: true,
                // 是否滚动定位到最后一次查看评论的位置
                isScrollToLastReply: true
            },
            // 视频悬浮相关
            videoFloat: {
                // 是否启用视频悬浮功能
                enabled: true,
                // 横向视频：悬浮窗口宽度(单位:px)
                floatWidth: '300',
                // 纵向视频：悬浮窗口高度(单位:px)
                floatHeight: '300',
                // 距离顶部距离(单位:px)
                top: 'auto',
                // 距离底部距离(单位:px)
                bottom: '20',
                // 距离左侧距离(单位:px)
                left: '20',
                // 距离右侧距离(单位:px)
                right: 'auto'
            },

            // 临时缓存公共变量
            cache: {
                // 存储滚动条宽度（全局唯一）
                scrollbarWidth: null
            }
        },

        // 获取配置
        getConfig() {
            const savedConfig = GM_getValue(this.CONFIG_SAVE_KEY);
            return savedConfig ? {...this.defaultConfig, ...savedConfig} : this.defaultConfig;
        },

        /**
         * 保存配置（增量更新模式）
         * 以默认配置为基准，合并现有配置与新数据并深克隆，最终持久化并刷新内存配置
         * @param {Object} updateData - 需增量更新的配置数据
         */
        saveConfig(updateData) {
            // 深合并：默认配置 ← 现有配置 ← 新数据（后项覆盖前项）
            const saveData = $.extend(true, {}, ConfigManager.defaultConfig, CONFIG, updateData);

            // 持久化存储
            GM_setValue(this.CONFIG_SAVE_KEY, saveData);

            // 重新加载配置
            Object.assign(CONFIG, this.getConfig());
        },

        // 重置为默认配置
        resetConfig() {
            GM_setValue(this.CONFIG_SAVE_KEY, this.defaultConfig);
            return this.defaultConfig;
        }
    };

    // 使用ConfigManager获取配置
    const CONFIG = ConfigManager.getConfig();

    // 工具类 - 封装通用工具方法
    const Utils = {

        /**
         * 注册一个菜单项
         * @param {string} title 菜单显示的文字
         * @param {function} callback 点击菜单时执行的函数
         */
        addMenu(title, callback) {
            try {
                GM_registerMenuCommand(title, callback);
            } catch (e) {
                console.error("注册菜单失败:", e);
            }
        },

        /**
         * 添加CSS样式 */
        addCSS(cssText) {
            const style = document.createElement('style');
            const head = document.head || document.getElementsByTagName('head')[0];
            style.type = 'text/css';

            if (style.styleSheet) { // IE兼容
                const setCSS = () => {
                    try {
                        style.styleSheet.cssText = cssText;
                    } catch (e) {
                        console.error('CSS应用失败:', e);
                    }
                };
                style.styleSheet.disabled ? setTimeout(setCSS, 10) : setCSS();
            } else {    // 标准浏览器
                style.textContent = cssText;
            }
            head.appendChild(style);
        },

        /**
         * 平滑滚动到目标元素
         * @param $element {jQuery} jQuery元素对象
         * @param offset {Number} 定位偏移量
         * @param scrollSpeed {Number|String} 滚动速度（slow、normal、fast、毫秒）
         * @return {Promise<void>}
         */
        scrollToElement($element, offset = 0, scrollSpeed = 'normal') {
            return new Promise(resolve => {
                if (!$element || !$element.length) {
                    resolve();
                    return;
                }
                const targetTop = $element.offset().top - offset;
                $('html, body').animate({scrollTop: targetTop}, scrollSpeed, resolve);
            });
        },

        /**
         * 计算滚动条宽度（仅计算一次） */
        getScrollbarWidth() {
            if (CONFIG.cache.scrollbarWidth !== null) return CONFIG.cache.scrollbarWidth;

            // 创建临时元素计算滚动条宽度
            const outer = document.createElement('div');
            outer.style.cssText = 'visibility:hidden; width:100px; position:absolute; top:-9999px;';
            document.body.appendChild(outer);

            const inner = document.createElement('div');
            inner.style.width = '100%';
            outer.appendChild(inner);

            const outerWidth = outer.offsetWidth;
            outer.style.overflow = 'scroll';
            const innerWidth = inner.offsetWidth;

            document.body.removeChild(outer);   // 移除临时元素
            CONFIG.cache.scrollbarWidth = outerWidth - innerWidth;   // 滚动条宽度 = 外层宽度 - 内层宽度
            return CONFIG.cache.scrollbarWidth;
        },

        /**
         * 按比例计算尺寸
         * @param $video {jQuery} 视频主体
         * @param targetWidth {Number} 目标宽度
         * @param targetHeight {Number} 目标高度
         * */
        calculateScaleSize($video, targetWidth, targetHeight) {
            const orient = $video.attr('data-orient');
            const originalWidth = parseFloat($video.attr('data-width')) || $video[0].videoWidth;
            const originalHeight = parseFloat($video.attr('data-height')) || $video[0].videoHeight;

            let width, height;

            if (orient === 'landscape') {
                // 横向视频：固定宽度，高度按比例计算
                width = `${targetWidth}px`;
                const aspectRatio = originalHeight / originalWidth;
                height = `calc(${width} * ${aspectRatio})`;
            } else {
                // 纵向视频：固定高度，宽度按比例计算
                height = `${targetHeight}px`;
                const aspectRatio = originalWidth / originalHeight;
                width = `calc(${height} * ${aspectRatio})`;
            }

            return {width, height};
        },

        /**
         * 禁用页面滚动（隐藏滚动条+补偿宽度） */
        disableScroll() {
            const $body = $('body');
            const bodyOverflowY = $body.css('overflow-y');

            if (bodyOverflowY !== 'hidden') {
                // 滚动条宽度
                const scrollWidth = this.getScrollbarWidth();

                // 隐藏滚动条，并补偿滚动条宽度，避免页面右移
                $body.css({
                    'overflow-y': 'hidden',
                    'padding-right': `${scrollWidth}px`
                });

                // 处理回到顶部按钮（补偿right参数）
                const $backToTop = $('section[class*="index_hp-pc-footer"] div[class*="index_backToTop"]');
                if ($backToTop.length) {
                    const currentRight = parseInt($backToTop.css('right'), 10) || 0;
                    $backToTop.css('right', `${currentRight + scrollWidth}px`);
                }

                // 标题栏（补偿padding-right参数）
                const $title = $('.post-fix-title');
                if ($title.length) {
                    const currentPadding = parseInt($title.css('padding-right'), 10) || 0;
                    $title.css('padding-right', `${currentPadding + scrollWidth}px`);
                }

                // 视频悬浮窗口
                const $floatVide = $('.hupu-video-float-container');
                if ($floatVide.length) {
                    const currentRight = parseInt($floatVide.css('right'), 10) || 0;
                    $floatVide.css('right', `${currentRight + scrollWidth}px`);
                    $floatVide.attr('data-right', currentRight);
                }

                // 处理自定义悬浮工具栏（补偿right参数）
                const $floatTools = $('.hupu-tools-float-container');
                if ($floatTools.length) {
                    const currentRight = parseInt($floatTools.css('right'), 10) || 0;
                    $floatTools.css('right', `${currentRight + scrollWidth}px`);
                    $floatTools.attr('data-right', currentRight);
                }

            }
        },

        /**
         * 恢复页面滚动 */
        enableScroll() {
            // 恢复body样式
            $('body').removeAttr('style');
            // 恢复浮动title样式
            $('.post-fix-title').removeAttr('style');
            // 回到顶部按钮
            $('section[class*="index_hp-pc-footer"] div[class*="index_backToTop"]').removeAttr('style');
            // 恢复视频悬浮窗位置
            const $floatVideo = $('.hupu-video-float-container');
            const vOriginalRight = $floatVideo.attr('data-right');
            $floatVideo.css('right', `${vOriginalRight}px`);
            // 恢复自定义悬浮工具栏
            const $floatTools = $('.hupu-tools-float-container');
            const tOriginalRight = $floatTools.attr('data-right');
            $floatTools.css('right', `${tOriginalRight}px`);
        },

        /**
         * 节流函数
         * @param func {Function} 事件
         * @param delay {Number} 延迟时间
         * @return {(function(...[*]): void)|*}
         */
        throttle(func, delay) {
            let timeoutId;
            let lastExecTime = 0;
            return function (...args) {
                const currentTime = Date.now();
                const remainingTime = delay - (currentTime - lastExecTime);

                if (remainingTime <= 0) {
                    lastExecTime = currentTime;
                    func.apply(this, args);
                } else {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        lastExecTime = Date.now();
                        func.apply(this, args);
                    }, remainingTime);
                }
            };
        },

        /**
         * 检查元素是否在视口内
         * @param $element {Element} jq对象元素
         * @param visibleRatio {Number} 可见比例
         * @return {boolean}
         */
        isElementInViewport($element, visibleRatio = 0.1) {
            const element = $element[0];
            const rect = element.getBoundingClientRect();

            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;

            // 计算元素与视口的交集区域
            const visibleHeight = Math.max(0,
                Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
            );
            const visibleWidth = Math.max(0,
                Math.min(rect.right, windowWidth) - Math.max(rect.left, 0)
            );
            const elementArea = rect.height * rect.width;
            const visibleArea = visibleHeight * visibleWidth;

            return elementArea > 0 && (visibleArea / elementArea) >= visibleRatio;
        },

        /**
         * 获得页面总信息
         */
        getPageData() {
            try {
                // ./其他资料/__NEXT_DATA__.json
                const nextDataStr = $('#__NEXT_DATA__').text();
                return JSON.parse(nextDataStr);
            } catch (e) {
                console.error('[页面数据]获取失败', e);
            }
        },

        /**
         * 获得页面总信息-楼主信息
         * */
        getPageDataByAuthorInfo() {
            try {
                const pageInfo = this.getPageData().props.pageProps;
                if (pageInfo.detailErrorInfo.code === 200) {
                    return pageInfo.detail.thread.author;
                }
            } catch (e) {
                console.error('[页面数据-楼主信息]获取失败', e);
            }
        },

        /**
         * 获得页面总信息-当前登录人用户信息
         * */
        getPageDataByUserInfo() {
            try {
                const pageInfo = this.getPageData().props.pageProps;
                if (pageInfo.detailErrorInfo.code === 200) {
                    return pageInfo.detail.user;
                }
            } catch (e) {
                console.error('[页面数据-当前登录人用户信息]获取失败', e);
            }
        }
    };

    // 图片缩放功能
    const ImageZoom = {
        // 图片标签
        imageTag: CONFIG.img.imageSelector,
        // 视频标签
        videoTag: CONFIG.video.videoSelector,
        // 图片缩放控制键
        zoomKey: CONFIG.img.zoomKey,
        // 图片最大化控制键
        maxKey: CONFIG.img.maxKey,
        // 当前被鼠标悬停的元素
        $currentHoveredElement: null,
        // 是否按下缩放控制键
        isZoomPressed: false,
        // 添加调整大小状态标记
        isResizing: false,


        /**
         * 初始化图片缩放功能 */
        init() {
            this.initStyles();
            this.bindEvents();
        },

        /**
         * 初始化调整图片相关样式 */
        initStyles() {
            const imgCONFIG = CONFIG.img;
            const videoCONFIG = CONFIG.video;

            // 遍历所有视频，加载元数据后标记横纵
            $(this.videoTag).on('loadedmetadata', function () {
                const $this = $(this);
                const w = this.videoWidth; // 视频原生宽
                const h = this.videoHeight; // 视频原生高

                $this.attr('data-width', w);
                $this.attr('data-height', h);
                // 打属性标记（landscape=横向，portrait=纵向）
                const orient = w > h ? 'landscape' : 'portrait';
                $this.attr('data-orient', orient);
                // 帖子类型（main 主贴，reply 回复贴）
                const postType = ($(this).parents('[class*="index_post-wrapper"]').length ? 'main' : 'reply');
                $this.attr('data-post-type', postType);

                // 为回复贴中的纵向视频，计算并设置确切宽度（要设定宽度 a键放大才能丝滑，否则缺少实际宽度的话 [width: 100%] 时将不会形成过渡动画）
                if (postType === 'reply' && orient === 'portrait') {
                    const id = $this.attr('id');
                    if (id) {
                        const scaleSize1 = Utils.calculateScaleSize($this, videoCONFIG.thumbnailWidth, videoCONFIG.thumbnailHeight);
                        const scaleSize2 = Utils.calculateScaleSize($this, videoCONFIG.hoverWidth, videoCONFIG.hoverHeight);
                        // 为单个视频创建独立的样式
                        Utils.addCSS(`
                            #${id} { width: ${scaleSize1.width}; }
                            #${id}:hover { width: ${scaleSize2.width}; }
                        `);
                    }
                }
            }).each(function () {
                const $this = $(this);
                // 兼容已缓存的视频，手动触发元数据事件
                if (this.readyState >= 1) $this.trigger('loadedmetadata');
            });

            // 图片样式
            Utils.addCSS(`
                ${this.imageTag} {
                    width: ${imgCONFIG.thumbnailWidth}px !important;
                    height: auto !important;
                    max-width: 100% !important;
                    transition: width 0.3s ease;
                }
                ${this.imageTag}:hover {
                    width: ${imgCONFIG.hoverWidth}px !important;
                }
            `);

            // 视频样式
            Utils.addCSS(`
                ${this.videoTag}{
                    transition: width 0.3s ease;
                }
                /* 横向视频：默认宽度 */
                ${this.videoTag}[data-orient="landscape"][data-post-type="reply"] {
                    width: ${videoCONFIG.thumbnailWidth}px !important;
                    height: auto !important;
                    max-width: 100% !important;
                }
                ${this.videoTag}[data-orient="landscape"][data-post-type="reply"]:hover {
                    width: ${videoCONFIG.hoverWidth}px !important;
                }

                /* 纵向视频：默认高度 */
                ${this.videoTag}[data-orient="portrait"][data-post-type="reply"] {
                    /* 原始竖向设定，会使a键放大不丝滑，因为没有设定确切宽度，a键突然[width: 100%]放大会没有过渡动画，非常突兀 */
                    /* height: ${videoCONFIG.thumbnailHeight}px !important; */
                    /* width: auto !important; */
                    /* a键放大时，如果竖向视频控制的是[height: __通过视频父级元素的宽度px,按比例计算的hoverHeight,达成另一层意义上的width:100%__px] 也可以做到丝滑 */
                    /* 但此处 还是采用[width: 100%]来控制视频最大化，所以需要动态计算width，做成与横向视频一样逻辑的处理方式 */

                    /* 因此，需要像横向视频一样设定： */
                    /* width 宽度使用动态计算，高度自动 */
                    height: auto !important;
                    max-width: 100% !important;
                }
                /* 鼠标浮入也要通过width控制，因此 也需要动态计算 */
                /* ${this.videoTag}[data-orient="portrait"][data-post-type="reply"]:hover {
                    height: ${videoCONFIG.hoverHeight}px !important;
                } */
            `);

        },

        /**
         * 绑定事件处理 */
        bindEvents() {
            // 按键事件
            $(document)
                .on('keydown', e => this.handleKeyDown(e))
                .on('keyup', e => this.handleKeyUp(e));

            // 鼠标事件
            $(document)
                // 图片鼠标事件
                .on('mouseenter', this.imageTag, e => this.handleMouseEnter(e))
                .on('mouseleave', this.imageTag, e => this.handleMouseLeave(e))
                .on('mousewheel DOMMouseScroll', this.imageTag, e => this.handleWheel(e, 'img'))
                // 视频鼠标事件
                .on('mouseenter', `${this.videoTag}`, e => $(e.target).focus())  // 为元素获得焦点
                .on('mouseenter', `${this.videoTag}[data-post-type="reply"]`, e => this.handleMouseEnter(e))
                .on('mouseleave', `${this.videoTag}[data-post-type="reply"]`, e => this.handleMouseLeave(e))
                .on('mousewheel DOMMouseScroll', `${this.videoTag}[data-post-type="reply"]`, e => this.handleWheel(e, 'video'));

            // 窗口失焦事件
            $(window).on('blur', () => this.handleWindowBlur());
        },

        /**
         * 处理按键按下 */
        handleKeyDown(e) {
            if (!this.$currentHoveredElement) return;

            if (e.key === this.maxKey) {
                this.$currentHoveredElement.attr('style', `width: 100% !important; height: auto !important;`);
            } else if (e.key === this.zoomKey) {
                this.isZoomPressed = true;
                this.$currentHoveredElement.css('cursor', 'zoom-in');
                Utils.disableScroll();
            }
        },

        /**
         * 处理按键释放 */
        handleKeyUp(e) {
            if (e.key === this.maxKey) {
                if (this.$currentHoveredElement) {
                    // 应用内联样式
                    this.$currentHoveredElement.removeAttr('style');
                }
            } else if (e.key === this.zoomKey) {
                this.isZoomPressed = false;
                Utils.enableScroll();
            }
            if (this.$currentHoveredElement) this.$currentHoveredElement.css('cursor', 'default');
        },

        /**
         * 处理鼠标进入元素 */
        handleMouseEnter(e) {
            this.$currentHoveredElement = $(e.target);
            if (this.isZoomPressed) {
                this.$currentHoveredElement.css('cursor', 'zoom-in');
                Utils.disableScroll();
            }
        },

        /**
         * 处理鼠标离开元素 */
        handleMouseLeave(e) {
            this.$currentHoveredElement = null;
            $(e.target).removeAttr('style').css('cursor', 'default');
            Utils.enableScroll();
        },

        /**
         * 处理鼠标滚轮缩放 */
        handleWheel(e, type) {
            // 如果正在调整视频大小，不处理图片缩放
            if (this.isResizing) return;

            // 只有同时满足[悬浮在图片上]且[按下缩放控制键]才处理缩放
            if (!this.$currentHoveredElement || !this.isZoomPressed) return;

            // 阻止默认行为
            e.preventDefault();
            e.stopPropagation();
            if (e.originalEvent) {
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
            }

            this.zoomElement(this.$currentHoveredElement, type, e);
        },

        /**
         * 缩放元素 */
        zoomElement($element, type, event) {
            const config = CONFIG[type];
            const defaultWidth = parseInt(config.thumbnailWidth);

            // 兼容 Chrome/Firefox 滚轮方向
            const delta = event.originalEvent.wheelDelta !== undefined
                ? event.originalEvent.wheelDelta
                : -event.originalEvent.detail * 40;
            const isZoomIn = delta > 0;

            // 计算新宽度
            let currentWidth = parseInt($element.css('width')) || defaultWidth;
            let newWidth = isZoomIn
                ? currentWidth * config.zoomRatio
                : currentWidth / config.zoomRatio;
            newWidth = Math.max(defaultWidth, Math.min(newWidth, config.maxZoomWidth));

            // 应用内联样式
            $element.attr('style', `width: ${newWidth}px !important; height: auto !important;`);
        },

        /**
         * 处理窗口失焦 */
        handleWindowBlur() {
            this.isZoomPressed = false;
            // Utils.enableScroll();    // 避免以外切出，无法恢复滚动条
        }
    };

    // 回复处理逻辑
    const ReplyHandler = {
        // [展开按钮]滚动定位后高亮样式
        highlight: {
            style: {
                backgroundColor: '#fff',
                // backgroundImage: 'linear-gradient(180deg,#c9ffbf,#ffafbd)',
                // color: '#fff',
                transition: 'background-color 0.3s ease'
            },
            // 高亮多久?多少毫秒后恢复原样?
            duration: 1000
        },
        // 用于标记最后点击的按钮
        lastClickedFlag: 'data-last-clicked',
        // 滚动定位偏移量
        scrollOffset: 200,
        // 滚动定位速度（多少毫秒滚到位?100~500?）
        scrollSpeed: 100,


        /**
         * 初始化回复处理 */
        init() {
            if (!CONFIG.reply.enabled) return;

            this.initStyles();
            this.bindEvents();
        },

        /**
         * 初始化调整评论区相关样式*/
        initStyles() {
            // 回复区白色背景
            Utils.addCSS(`.reply-detail-wrapper { background-color: #fff; }`);
        },

        /**
         * 绑定事件 */
        bindEvents() {
            $(document)
                .on('click', '.todo-list-replay', e => this.handleReplyClick(e))    // 【查看评论(1)】展开二级评论列表
                .on('click', 'div[class*="index_toggle-thread"]:contains("收起")', e => this.markLastClicked($(e.currentTarget)));    // 回复引用的【收起】按钮 => 标记点击位置

            // 页面容器，点击收缩评论列表
            $('div[class*="index_bbs-post-web-container"]').on('click', e => this.handleContainerClick(e));
        },

        /**
         * 处理展开按钮点击 */
        handleReplyClick(e) {
            const $target = $(e.currentTarget);
            this.markLastClicked($target);

            // 原站会请求二级评论列表：[GET: https://bbs.hupu.com/api/v2/reply/reply?tid=xxx&pid=xxx&maxpid=x]
            // 轮巡检查二级评论是否加载完毕
            const intervalId = setInterval(() => {
                const $replyDetail = $target.parents('.post-reply-list-container').next('.reply-detail-wrapper');
                if ($replyDetail.length) {
                    this.markLandlord();
                    clearInterval(intervalId);
                }
            }, 100);

            // 轮巡超时，5秒后 停止轮巡
            setTimeout(() => clearInterval(intervalId), 5000);
        },

        /**
         * 处理容器点击 */
        handleContainerClick(e) {
            if (!CONFIG.reply.enabled || e.target !== e.currentTarget) return;

            // 获取所有[收起按钮]
            const $allHideBtns = $('.reply-detail-hide, div[class*="index_toggle-thread"]:contains("收起")');
            if (!$allHideBtns.length) {
                console.info('当前没有需要收起的评论');
                return;
            }

            this.processHideButtons($allHideBtns);
        },

        /**
         * 处理按钮逻辑 */
        async processHideButtons($allBtns) {
            if (CONFIG.reply.isScrollToLastReply) {
                // 获取最后标记的展开按钮
                const $lastClickedBtn = this.getLastClickedBtn();
                if ($lastClickedBtn.length) {
                    const $lastClickedReply = $lastClickedBtn.parents('.post-reply-list-wrapper');
                    // 滚动到最后标记的展开按钮位置
                    await this.scrollAndHighlight($lastClickedReply);   // 等待完成，才会往下执行

                    // 滚动完成后，清除所有点击标记
                    this.clearAllLastClickedFlag();
                    // 定位后，延迟100毫秒执行收起
                    setTimeout(() => {
                        this.collapseAllReplies($allBtns);
                    }, 100);
                }
            } else {
                this.collapseAllReplies($allBtns);
            }
        },

        /**
         * 滚动到目标并高亮显示 */
        async scrollAndHighlight($target) {
            // 滚动到按钮位置（等待滚动，滚动完成后才执行下面的代码）
            await Utils.scrollToElement($target, this.scrollOffset, this.scrollSpeed);  // 等待完成，才会往下执行

            /* 滚动完成 */
            // 处理关联的评论列表闪烁
            $target.css(this.highlight.style);
            setTimeout(() => this.removeHighlight($target), this.highlight.duration);
        },

        /**
         * 标记楼主身份 */
        markLandlord() {
            try {
                const pageInfo = Utils.getPageData().props.pageProps;
                if (pageInfo.detailErrorInfo.code === 200) {
                    const author = pageInfo.detail.thread.author;
                    const euid = author.euid;

                    if (euid) {
                        const $landlordBadge = $('<span class="post-reply-list-user-info-top-tip">楼主</span>');
                        $(`a.reply-detail-list-user-info-top-name[href*="${euid}"]`).each(function () {
                            const $this = $(this);
                            if (!$this.siblings('.post-reply-list-user-info-top-tip').length) {
                                $this.after($landlordBadge);
                            }
                        });
                    }
                }
            } catch (e) {
                console.error('[标记楼主身份]执行失败', e);
            }
        },

        /**
         * 移除高亮样式 */
        removeHighlight($element) {
            const blankStyle = Object.keys(this.highlight.style).reduce((acc, key) => {
                acc[key] = key === 'transition' ? this.highlight.style[key] : '';
                return acc;
            }, {});
            $element.css(blankStyle);
        },

        /**
         * 清除所有标记 */
        clearAllLastClickedFlag() {
            $(`[${this.lastClickedFlag}]`).removeAttr(this.lastClickedFlag);
        },

        /**
         * 标记最后点击的按钮 */
        markLastClicked($clickedBtn) {
            this.clearAllLastClickedFlag();
            $clickedBtn?.attr(this.lastClickedFlag, 'true');
        },

        /**
         * 获取最后标记的[展开按钮] */
        getLastClickedBtn() {
            let $lastClicked = $(`.todo-list-replay[${this.lastClickedFlag}], div[class*="index_toggle-thread"]:contains("收起")[${this.lastClickedFlag}]`).first();
            if (!$lastClicked.length) {
                console.warn('未找到最后点击的收起按钮，使用最后一个按钮作为备选');
                $lastClicked = $('.show-detail:last .todo-list-replay').last();
            }
            return $lastClicked;
        },

        /**
         * 收起所有二级评论列表 */
        collapseAllReplies($buttons) {
            if (!$buttons.length) return; // 容错：没有找到按钮时直接返回，避免报错

            $buttons.each(function () {
                const $btn = $(this);

                // 1. 匹配 class 包含 index_toggle-thread 的元素
                if ($btn.is('[class*="index_toggle-thread"]')) {
                    const $content = $btn.prev().find('.thread-content-detail');
                    // 容错：确保找到目标元素再执行动画
                    if ($content.length) {
                        $content.animate({'height': '30px'}, 'fast', 'swing', () => {
                            $btn.click(); // 动画结束后模拟点击
                        });
                    }
                }
                // 2. 匹配 class 是 reply-detail-hide 的元素（精确匹配用 .is('.reply-detail-hide')）
                else if ($btn.is('.reply-detail-hide')) {
                    const $wrapper = $btn.parents('.reply-detail-wrapper');
                    // 容错：确保找到父容器再执行滑动
                    if ($wrapper.length) {
                        $wrapper.slideUp('fast', 'swing', () => {
                            $btn.click(); // 滑动结束后模拟点击
                        });
                    }
                }
            });
        }
    };

    // 视频悬浮功能
    const VideoFloat = {
        // 视频标签
        videoTag: CONFIG.video.videoSelector,
        // 当前悬浮的视频
        $currentFloatVideo: null,
        // 悬浮容器
        $floatContainer: null,
        // 占位符容器
        $placeholder: null,
        // 是否主动关闭悬浮视频
        isManuallyClosed: false,
        // 是否已初始化
        initialized: false,

        // 拖动相关变量
        isDragging: false,
        // 拖拽变量
        dragOffset: {x: 0, y: 0},
        // 动画帧ID
        animationFrameId: null,

        // 调整大小相关变量
        isResizing: false,
        resizeMouseMoveHandler: null,
        resizeMouseUpHandler: null,
        resizeTouchMoveHandler: null,
        resizeTouchEndHandler: null,


        /**
         * 初始化视频悬浮功能 */
        init() {
            if (!CONFIG.videoFloat.enabled) return;

            this.initStyles();
            this.createFloatContainer();
            this.bindEvents();
            this.initialized = true;
        },

        /**
         * 初始化调整视频相关样式 */
        initStyles() {
            // 特殊指定样式
        },

        /**
         * 创建悬浮容器 */
        createFloatContainer() {
            this.$floatContainer = $('<div class="hupu-video-float-container"></div>');
            this.$floatContainer.css({
                'position': 'fixed',
                'top': CONFIG.videoFloat.top + 'px',
                'bottom': CONFIG.videoFloat.bottom + 'px',
                'left': CONFIG.videoFloat.left + 'px',
                'right': CONFIG.videoFloat.right + 'px',
                'z-index': 9999,
                'background': 'transparent',
                'border-radius': '8px',
                'overflow': 'hidden',
                'box-shadow': '0 4px 20px rgba(0,0,0,0.3)',
                'display': 'none',
                'user-select': 'none'
            });

            // 创建标题栏
            const titleBar = $('<div class="hupu-video-float-titlebar"></div>');
            titleBar.css({
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'right': '0',
                'height': '30px',
                'background': 'rgba(0, 0, 0, 0.7)',
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'space-between',
                'padding': '0 10px',
                'cursor': 'move',
                'color': 'transparent',
                'font-size': '12px',
                'z-index': 10001,
                'transition': 'all 0.3s ease',
                'opacity': '0'
            });

            // 标题栏文本
            const title = $('meta[name="keywords"]').attr('content');
            const titleText = $(`<span>${title}</span>`);
            titleText.css({
                'flex': '1',              // 自适应占据剩余空间
                'white-space': 'nowrap',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis',
                'margin-right': '10px'    // 与右侧按钮保持间距
            });

            // 返回视频按钮
            const backBtn = $('<div class="hupu-video-float-back">↑</div>');
            backBtn.attr('title', '定位到视频');
            backBtn.css({
                'color': 'transparent',
                'font-size': '12px',
                'cursor': 'alias',
                'line-height': '20px',
                'width': '20px',
                'height': '20px',
                'text-align': 'center',
                'border-radius': '2px',
                'margin-right': '1px'     // 与关闭按钮保持间距
            });

            // 关闭按钮
            const closeBtn = $('<div class="hupu-video-float-close">×</div>');
            closeBtn.attr('title', '关闭悬浮窗');
            closeBtn.css({
                'color': 'transparent',
                'font-size': '18px',
                'cursor': 'pointer',
                'line-height': '20px',
                'width': '20px',
                'height': '20px',
                'text-align': 'center',
                'border-radius': '2px'
            });

            // 组装标题栏
            titleBar.append(titleText);
            titleBar.append(backBtn);
            titleBar.append(closeBtn);
            this.$floatContainer.append(titleBar);


            // hover样式
            Utils.addCSS(`
                .hupu-video-float-container:hover {
                    transform: scale(1.02);
                }
                .hupu-video-float-back:hover {
                    color: #fff !important;
                    background-color: rgba(50,50,50,0.8);
                }
                .hupu-video-float-close:hover {
                    color: #fff !important;
                    background-color: #ff4757
                }
            `);

            // 置入body
            $('body').append(this.$floatContainer);
        },

        /**
         * 绑定事件 */
        bindEvents() {
            // 使用节流函数优化滚动性能
            $(window).on('scroll', Utils.throttle(async () => {
                await this.handleScroll();
            }, 100));

            // 窗口大小改变时重新计算
            $(window).on('resize', Utils.throttle(async () => {
                await this.handleScroll();
            }, 200));

            // 监听播放事件（新视频播放，切换到悬浮窗）
            $(this.videoTag).on('play', e => this.switchVideo($(e.target)));

            // 绑定拖动事件
            this.bindDragEvents();

            // 绑定悬停事件
            this.bindHoverEvents();
        },

        /**
         * 绑定悬停事件 */
        bindHoverEvents() {
            this.$floatContainer
                .on('mouseenter', () => this.showTitleBar())    // 鼠标[进入]悬浮容器时[显示]标题栏
                .on('mouseleave', () => this.hideTitleBar())    // 鼠标[离开]悬浮容器时[隐藏]标题栏
        },

        /**
         * 显示标题栏 */
        showTitleBar() {
            // 标题栏
            const $titleBar = this.$floatContainer.find('.hupu-video-float-titlebar');

            $titleBar.css({
                'background': 'rgba(0, 0, 0, 0.5)',
                'color': '#fff',
                'opacity': '1'
            });

            $titleBar.find('.hupu-video-float-close,.hupu-video-float-back').css({
                'color': '#fff'
            });

            // 调整大小控制手柄
            const resizeHandle = this.$floatContainer.find('.hupu-video-resize-handle');

            resizeHandle.css({
                'background': 'rgba(0, 0, 0, 0.3)',
                'color': '#fff',
                'opacity': '1'
            });

        },

        /**
         * 隐藏标题栏 */
        hideTitleBar() {
            // 标题栏
            const $titleBar = this.$floatContainer.find('.hupu-video-float-titlebar');

            $titleBar.css({
                'background': 'rgba(0, 0, 0, 0)',
                'color': 'transparent',
                'opacity': '0'
            });

            $titleBar.find('.hupu-video-float-close,.hupu-video-float-back').css({
                'color': 'transparent'
            });

            // 调整大小控制手柄
            const resizeHandle = this.$floatContainer.find('.hupu-video-resize-handle');

            resizeHandle.css({
                'background': 'rgba(0, 0, 0, 0)',
                'color': 'transparent',
                'opacity': '0'
            });

        },

        //* 拖动视频 *//

        /**
         * 绑定拖动事件 */
        bindDragEvents() {
            const $titleBar = this.$floatContainer.find('.hupu-video-float-titlebar');

            // 只在标题栏上绑定拖动事件
            $titleBar.on('mousedown', (e) => {
                // 如果点击的是关闭按钮，不触发拖动
                if (e.target.matches('.hupu-video-float-close, .hupu-video-float-back')) {
                    return;
                }

                this.startDrag(e);
            });

            // 触摸事件支持（移动设备）
            $titleBar.on('touchstart', (e) => {
                if (e.target.matches('.hupu-video-float-close, .hupu-video-float-back')) {
                    return;
                }

                this.startDrag(e.originalEvent.touches[0]);
            });

            // 返回视频事件
            this.$floatContainer.find('.hupu-video-float-back').on('click', (e) => {
                e.stopPropagation();
                Utils.scrollToElement(this.$placeholder, 100).then();
            });

            // 关闭按钮事件
            this.$floatContainer.find('.hupu-video-float-close').on('click', (e) => {
                e.stopPropagation();
                this.isManuallyClosed = true;
                this.restoreVideo();
            });

            // 添加调整大小功能
            this.createResizeControl();
        },

        /**
         * 开始拖动 */
        startDrag(e) {
            this.isDragging = true;

            // 计算鼠标/触摸点相对于悬浮容器左上角的偏移
            const containerRect = this.$floatContainer[0].getBoundingClientRect();
            this.dragOffset.x = e.clientX - containerRect.left;
            this.dragOffset.y = e.clientY - containerRect.top;

            // 添加拖动样式
            this.$floatContainer.find('.hupu-video-float-titlebar').css({
                'cursor': 'grabbing',
                'background': 'rgba(50, 50, 50, 0.7)'
            });

            // 绑定移动和释放事件
            $(document)
                .on('mousemove', (e) => this.onDrag(e))
                .on('mouseup', () => this.stopDrag())
                .on('touchmove', (e) => this.onDrag(e.originalEvent.touches[0]))
                .on('touchend', () => this.stopDrag());

            e.preventDefault();
        },

        /**
         * 拖动中 */
        onDrag(e) {
            if (!this.isDragging) return;

            // 使用requestAnimationFrame优化性能
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }

            this.animationFrameId = requestAnimationFrame(() => {
                // 计算新位置
                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;

                // 限制在视口范围内
                const containerRect = this.$floatContainer[0].getBoundingClientRect();
                const maxX = window.innerWidth - containerRect.width;
                const maxY = window.innerHeight - containerRect.height;

                const boundedX = Math.max(0, Math.min(x, maxX));
                const boundedY = Math.max(0, Math.min(y, maxY));

                // 使用transform进行位置更新，性能更好
                this.$floatContainer.css({
                    'transform': `translate(${boundedX}px, ${boundedY}px)`,
                    'left': '0',
                    'top': '0',
                    'right': 'auto',
                    'bottom': 'auto'
                });
            });

            e.preventDefault();
        },

        /**
         * 停止拖动 */
        stopDrag() {
            if (!this.isDragging) return;

            this.isDragging = false;

            // 取消动画帧
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }

            // 获取最终位置并应用
            const transform = this.$floatContainer.css('transform');
            if (transform && transform !== 'none') {
                const matrix = new DOMMatrixReadOnly(transform);
                const finalX = matrix.m41;
                const finalY = matrix.m42;

                this.$floatContainer.css({
                    'left': `${finalX}px`,
                    'top': `${finalY}px`,
                    'transform': 'none'
                });

                // 保存悬浮窗定位
                const saveData = {
                    // 视频悬浮相关
                    videoFloat: {
                        left: finalX,
                        top: finalY,
                        right: 'auto',
                        bottom: 'auto'
                    }
                };

                // 保存数据
                ConfigManager.saveConfig(saveData);
            }

            // 恢复标题栏样式
            this.$floatContainer.find('.hupu-video-float-titlebar').css({
                'cursor': 'move',
                'background': 'rgba(0, 0, 0, 0.7)'
            });

            // 移除事件监听
            $(document)
                .off('mousemove')
                .off('mouseup')
                .off('touchmove')
                .off('touchend');
        },

        //* 悬浮视频 *//

        /**
         * 处理滚动事件 */
        async handleScroll() {
            if (!CONFIG.videoFloat.enabled || !this.initialized) return;

            // 仅悬浮主贴视频
            /* const $playingVideos = $(`div[class*="index_post-wrapper"] ${this.videoSelector}`); */
            // 悬浮当前页面正在播放的页面
            const $playingVideos = $(this.videoTag).filter((_, video) =>
                !video.paused && video.readyState > 0
            );


            // 如果已经有悬浮视频
            if (this.$currentFloatVideo && this.$placeholder) {
                // 检查原位置是否在视口内
                if (Utils.isElementInViewport(this.$placeholder)) {
                    await this.restoreVideo();
                    return;
                }

                // 检查当前悬浮视频是否还在播放列表中
                const isCurrentStillPlaying = $playingVideos.toArray().includes(this.$currentFloatVideo[0]);

                // 如果当前悬浮视频不在播放列表中，且有其他视频在播放，则切换到第一个其他视频
                if (!isCurrentStillPlaying && $playingVideos.length > 0) {
                    const $newVideo = $playingVideos.first();
                    // 确保不是同一个视频
                    if ($newVideo[0] !== this.$currentFloatVideo[0]) {
                        this.switchVideo($newVideo);
                    }
                    return;
                }
            }

            // 寻找需要悬浮的视频
            let foundVideoToFloat = false;

            $playingVideos.each((index, video) => {
                const $video = $(video);

                // 跳过已经是悬浮状态的视频
                if ($video.parent().hasClass('hupu-video-float-container')) return;

                // 检查视频是否在视口外
                if (!Utils.isElementInViewport($video)) {
                    // 找到第一个在视口外的视频进行悬浮
                    if (!foundVideoToFloat && !this.$currentFloatVideo) {
                        this.floatVideo($video);
                        foundVideoToFloat = true;
                    }
                } else {
                    // 在视口内了，重置主动关闭状态
                    this.isManuallyClosed = false;
                }
            });

            // 如果没有找到需要悬浮的视频且当前有悬浮视频，检查是否应该还原
            if (!foundVideoToFloat && this.$currentFloatVideo) {
                if (Utils.isElementInViewport(this.$placeholder)) {
                    await this.restoreVideo();
                }
            }
        },

        /**
         * 悬浮视频 */
        floatVideo($video) {
            // 为确保 this.$floatContainer.fadeIn('slow'); 的原子性，所以要用Promise。
            return new Promise((resolve, reject) => {
                // 视频已悬浮或被手动关闭
                if (this.$currentFloatVideo || this.isManuallyClosed) {
                    resolve();
                    return;
                }

                // 1. 保存原视频的引用
                this.$currentFloatVideo = $video;

                // 2. 根据视频方向计算悬浮容器尺寸
                const floatSize = this.calculateFloatSize($video);
                this.$floatContainer.css({
                    'width': floatSize.width,
                    'height': floatSize.height
                });

                // 3. 在原位置创建占位符
                this.createPlaceholder($video);

                // 4. 将视频移动到悬浮容器
                this.moveVideoToFloatContainer($video);

                // 5. 如果悬浮容器当前是隐藏状态，则重置到初始位置（如果已经是显示状态，保持当前位置不变）
                /* if (this.$$floatContainer.css('display') === 'none') {
                    this.$$floatContainer.css({
                        'top': CONFIG.videoFloat.top + 'px',
                        'bottom': CONFIG.videoFloat.bottom + 'px',
                        'left': CONFIG.videoFloat.left + 'px',
                        'right': CONFIG.videoFloat.right + 'px',
                        'transform': 'none'
                    });
                } */

                // 6. 显示悬浮容器
                this.$floatContainer.fadeIn('slow');

                // 兑现
                resolve();
            });
        },

        /**
         * 创建占位符 */
        createPlaceholder($video) {
            // 获取原视频的尺寸和位置信息
            const videoRect = $video[0].getBoundingClientRect();
            const computedStyle = window.getComputedStyle($video[0]);

            // 创建占位符div
            this.$placeholder = $('<div class="hupu-video-placeholder"></div>');

            // 设置占位符样式，保持与原视频相同的尺寸和布局
            this.$placeholder.css({
                'width': `${videoRect.width}px`,
                'height': `${videoRect.height}px`,
                'margin': computedStyle.margin,
                'padding': computedStyle.padding,
                'vertical-align': computedStyle.verticalAlign,
                'display': 'block',
                'border': '1px solid #eee',
                'border-radius': '8px',
                'box-shadow': 'inset 0 0 20px 0px #eee',
                // 'visibility': 'hidden'  // 保持布局但隐藏内容
            });

            // 将占位符插入到原视频位置
            $video.before(this.$placeholder);
        },

        /**
         * 将视频移动到悬浮容器 */
        moveVideoToFloatContainer($video) {
            // 移除原视频的所有样式，让悬浮容器控制其样式
            $video.removeAttr('style');

            // 设置视频在悬浮容器中的样式
            $video.css({
                'width': '100%',
                'height': '100%',
                'object-fit': 'contain'
            });

            // 将视频添加到悬浮容器
            this.$floatContainer.append($video);
        },

        /**
         * 还原视频 */
        restoreVideo() {
            // 检查是否有悬浮视频需要还原
            if (!this.$currentFloatVideo || !this.$placeholder) return Promise.resolve();

            /*
             * 【异步处理原因】
             * 问题：视频开始播放后 1秒内立马将视频滚出视口，会出现浮窗空白的问题。（极端但稳定复现）
             * 原因：悬浮容器使用 fadeOut('fast') 做渐隐动画（耗时约200ms），不等动画结束再清理DOM的话 就会出现上面的问题
             * 解决：用Promise等动画结束；另：如果直接hide()同步隐藏，根本不用搞这些
             * 总结：就是为了“渐隐这盘醋”，特意包了“Promise这顿饺子” ——纯属可优化的“仪式感”操作 😂
             * （小声密谋：这一步不是必须的，只是为了动画效果才加的Promise）
             */

            return new Promise((resolve) => {
                try {
                    const $video = this.$currentFloatVideo;

                    // 1. 隐藏悬浮容器，并将视频从悬浮容器中移除
                    this.$floatContainer.fadeOut('fast', () => {
                        // 兑现
                        resolve();
                    });

                    // 移除video
                    this.$floatContainer.find('video').remove();

                    // 2. 将视频移回原位置（占位符之前）
                    this.$placeholder.before($video);

                    // 3. 恢复视频的原始样式（移除悬浮容器添加的样式）
                    $video.removeAttr('style');

                    // 4. 移除占位符
                    this.$placeholder.remove();
                    this.$placeholder = null;

                    // 5. 清除当前视频引用
                    this.$currentFloatVideo = null;

                    // 6. 停止拖动状态（确保不会卡在拖动状态）
                    this.stopDrag();

                    // 7. 如果需要，滚动到视频位置
                    // Utils.scrollToElement($video);

                } catch (err) {
                    console.error('[还原视频]执行异常：', err);
                    resolve(); // 出错也resolve，避免阻塞后续
                }
            });
        },

        /**
         * 切换视频 */
        switchVideo($newVideo) {
            // 参数验证
            if (!$newVideo || !$newVideo.length) {
                console.warn('切换视频失败：无效的视频元素');
                return;
            }

            // 如果当前没有悬浮视频
            if (!this.$currentFloatVideo || !this.$placeholder) {
                // 当前视频不在视口内，直接悬浮新视频
                if (!Utils.isElementInViewport($newVideo)) {
                    this.floatVideo($newVideo);
                }
                return;
            }

            // 保存当前悬浮视频的引用
            const $currentVideo = this.$currentFloatVideo;
            const $currentPlaceholder = this.$placeholder;

            // 1. 还原当前悬浮视频
            try {
                // 将当前悬浮视频移回原位置（占位符之前）
                $currentPlaceholder.before($currentVideo);

                // 恢复当前视频的原始样式
                $currentVideo.removeAttr('style');

                // 移除当前占位符
                $currentPlaceholder.remove();

                // 清除当前视频引用
                this.$currentFloatVideo = null;
                this.$placeholder = null;

            } catch (error) {
                console.error('还原当前悬浮视频失败:', error);
                return;
            }

            // 2. 悬浮新视频
            try {
                // 保存新视频的引用
                this.$currentFloatVideo = $newVideo;

                // 根据新视频方向计算悬浮容器尺寸
                const floatSize = this.calculateFloatSize($newVideo);
                this.$floatContainer.css({
                    'width': floatSize.width,
                    'height': floatSize.height
                });

                // 在新视频原位置创建占位符
                this.createPlaceholder($newVideo);

                // 将新视频移动到悬浮容器
                this.moveVideoToFloatContainer($newVideo);

            } catch (error) {
                console.error('悬浮新视频失败:', error);
                // 如果悬浮新视频失败，尝试恢复原状态
                this.restoreVideo();
            }
        },

        /**
         * 根据视频方向计算悬浮容器尺寸 */
        calculateFloatSize($video) {
            const width = CONFIG.videoFloat.floatWidth;
            const height = CONFIG.videoFloat.floatHeight;
            return Utils.calculateScaleSize($video, width, height);
        },

        //* 调整大小 *//

        /**
         * 注册调整大小事件 */
        createResizeControl() {
            // 创建缩放控制手柄
            this.createResizeHandle();

            // 创建缩放遮罩
            this.createResizeMask();
        },

        /**
         * 创建调整大小控制手柄 */
        createResizeHandle() {
            // 创建调整大小的手柄
            const $resizeHandle = $('<div class="hupu-video-resize-handle"></div>');
            $resizeHandle.css({
                'position': 'absolute',
                'width': '30px',
                'height': '30px',
                'right': '-15px',
                'bottom': '-15px',
                'transform': 'rotate(45deg)',   // 45°旋转，在右下角形成一个三角形
                'cursor': 'se-resize',
                'z-index': '10002',
                /*'background': 'rgba(0, 0, 0, 0.3)',*/
                'border-radius': '2px 0 0 0',
                'box-shadow': 'rgba(0, 0, 0, 0.5) 0px 0px 18px 0px inset',
                'opacity': '0'
            });


            // 绑定鼠标事件
            $resizeHandle.on('mousedown', (e) => {
                this.startResize(e);
                e.stopPropagation();
                e.preventDefault();
            });

            // 触摸事件支持
            $resizeHandle.on('touchstart', (e) => {
                this.startResize(e.originalEvent.touches[0]);
                e.stopPropagation();
                e.preventDefault();
            });

            // 置入悬浮窗
            this.$floatContainer.append($resizeHandle);
        },

        /**
         * 创建调整大小遮罩层 */
        createResizeMask() {
            const $resizeMask = $('<div class="hupu-video-resize-mask"></div>');
            $resizeMask.css({
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%',
                'background': 'transparent',
                'z-index': 10000,
                'cursor': 'se-resize',
                'display': 'none'
            });

            // 在遮罩层上也绑定释放事件，确保不会卡住
            $resizeMask.on('mouseup touchend', () => {
                if (this.isResizing) {
                    this.stopResize();
                }
            });

            // 置入body
            $('body').append($resizeMask);
        },

        /**
         * 开始调整大小 */
        startResize(e) {
            this.isResizing = true;

            // 显示遮罩层
            $('.hupu-video-resize-mask').show();

            // 记录初始位置和尺寸
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = this.$floatContainer.outerWidth();
            const startHeight = this.$floatContainer.outerHeight();

            // 添加调整大小时的样式
            this.$floatContainer.css({
                'user-select': 'none',
                'pointer-events': 'none' // 防止视频元素干扰
            });

            // 禁用图片缩放功能
            ImageZoom.isResizing = true;

            // 处理鼠标移动事件（正在调整大小）
            const handleMouseMove = (e) => {
                if (!this.isResizing) return;

                e.preventDefault();

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                // 计算新尺寸
                let newWidth = startWidth + deltaX;
                let newHeight = startHeight + deltaY;

                // 限制最小尺寸
                newWidth = Math.max(150, newWidth);
                newHeight = Math.max(150, newHeight);

                // 如果当前有视频，按比例规范宽高
                if (this.$currentFloatVideo && this.$currentFloatVideo.length) {
                    // 按比例规范视频宽高
                    const scaleSize = Utils.calculateScaleSize(this.$currentFloatVideo, newWidth, newHeight);

                    // 应用新尺寸
                    this.$floatContainer.css({
                        'width': scaleSize.width,
                        'height': scaleSize.height
                    });
                } else {
                    // 没有视频时直接应用尺寸
                    this.$floatContainer.css({
                        'width': newWidth + 'px',
                        'height': newHeight + 'px'
                    });
                }
            };

            // 处理鼠标释放事件（结束调整大小）
            const handleMouseUp = () => {
                this.stopResize();
            };

            const handleTouchMove = (e) => {
                handleMouseMove(e.originalEvent.touches[0]);
            };

            const handleTouchEnd = () => {
                this.stopResize();
            };

            // 使用命名函数，便于移除
            this.resizeMouseMoveHandler = handleMouseMove;
            this.resizeMouseUpHandler = handleMouseUp;
            this.resizeTouchMoveHandler = handleTouchMove;
            this.resizeTouchEndHandler = handleTouchEnd;

            // 绑定事件到document，确保即使鼠标移出也能捕获
            $(document)
                .on('mousemove', this.resizeMouseMoveHandler)
                .on('mouseup', this.resizeMouseUpHandler)
                .on('touchmove', this.resizeTouchMoveHandler)
                .on('touchend', this.resizeTouchEndHandler);
        },

        /**
         * 停止调整大小 */
        stopResize() {
            if (!this.isResizing) return;

            this.isResizing = false;

            // 隐藏遮罩层
            $('.hupu-video-resize-mask').hide();

            // 恢复样式
            this.$floatContainer.css({
                'user-select': '',
                'pointer-events': ''
            });

            // 重新启用图片缩放功能
            ImageZoom.isResizing = false;

            // 保存新的尺寸配置
            this.saveResizeConfig();

            // 解绑事件
            $(document)
                .off('mousemove', this.resizeMouseMoveHandler)
                .off('mouseup', this.resizeMouseUpHandler)
                .off('touchmove', this.resizeTouchMoveHandler)
                .off('touchend', this.resizeTouchEndHandler);

            // 清理引用
            this.resizeMouseMoveHandler = null;
            this.resizeMouseUpHandler = null;
            this.resizeTouchMoveHandler = null;
            this.resizeTouchEndHandler = null;
        },

        /**
         * 保存调整大小的配置 */
        saveResizeConfig() {
            const width = this.$floatContainer.outerWidth();
            const height = this.$floatContainer.outerHeight();

            // 根据当前视频方向保存相应配置
            if (this.$currentFloatVideo) {
                const orient = this.$currentFloatVideo.attr('data-orient');
                const saveData = {
                    videoFloat: {}
                };

                if (orient === 'landscape') {
                    saveData.videoFloat.floatWidth = width;
                } else {
                    saveData.videoFloat.floatHeight = height;
                }

                ConfigManager.saveConfig(saveData);
            }
        },

    };

    // 工具栏悬浮功能
    const ToolsFloat = {
        // 操作栏标签
        toolsSelector: '.main-operate',
        // 原始工具栏元素
        $originalTools: null,
        // 悬浮容器
        $floatContainer: null,
        // 是否已初始化
        initialized: false,

        /**
         * 初始化工具栏悬浮功能
         */
        init() {
            this.$originalTools = $(this.toolsSelector);
            if (this.$originalTools.length === 0) {
                console.warn('未找到工具栏元素');
                return;
            }

            this.initStyles();
            this.createFloatContainer();
            this.bindEvents();
            this.initialized = true;

            // 初始检查一次
            this.handleScroll();
        },

        /**
         * 初始化工具栏区样式 */
        initStyles() {
            // 工具栏悬浮容器样式
            Utils.addCSS(`
            /* 各工具块 */
            .hupu-tools-float-container .todo-list {
                width: 48px;
                height: 48px;
                color: #919191;
                margin-bottom: 5px;
                cursor: pointer;
                /*border: 1px solid #aaa;*/
            }

            /* 各工具块-悬浮 */
            .hupu-tools-float-container .todo-list:hover {
                color: #333;
            }

            /* 各工具块-图标 */
            .hupu-tools-float-container .todo-list .todo-list-icon {
                display: block;
                width: 100%;
                height: 30px;
                line-height: 30px;
                text-align: center;
                transition: transform 0.3s ease;
            }
            .hupu-tools-float-container .todo-list .todo-list-icon::before {
                display: block;
            }


            /* 各工具块-悬浮-图标反馈 */
            .hupu-tools-float-container .todo-list:hover .todo-list-icon {
                color: #a61624;
                transform: scale(1.3);
            }

            /* 各工具块-文本 */
            .hupu-tools-float-container .todo-list .todo-list-text {
                display: block;
                width: 100%;
                text-align: center;
                transition: all 0.3s ease;
            }

            /* 各工具块-悬浮-文本 */
            .hupu-tools-float-container .todo-list:hover .todo-list-text {

            }

            /* 工具块-选中 */
            .hupu-tools-float-container .todo-list.active i {
                font-size: 24px;
            }

            /* 工具块-选中-推荐 */
            .hupu-tools-float-container .post-operate-comp-main-recommend.active i {
                color: #c60100 !important;
            }

            /* 工具块-选中-收藏 */
            .hupu-tools-float-container .post-operate-comp-main-collect.active i {
                color: #f7b500 !important;
            }

            /* 工具块-分享 */
            .hupu-tools-float-container .todo-list.post-operate-comp-main-share {
                position: relative;
            }

            /* 工具块-分享-拓展 */
            .hupu-tools-float-container .todo-list.post-operate-comp-main-share .share-modal {
                display: none;
                position: absolute;
                top: 0;
                left: -185px;
                width: 180px;
                height: auto;
                padding: 5px;
                cursor: pointer;
                border-radius: 5px;
                background-color: #fff;
                transition: all 0.3s ease;
            }
            /* 工具块-分享:悬浮-显示拓展 */
            .hupu-tools-float-container .todo-list.post-operate-comp-main-share:hover .share-modal {
                display: block;
            }

            /* 工具块-分享-拓展-图标组 */
            .hupu-tools-float-container .share-modal .icons {
                overflow: hidden;
            }

            /* 工具块-分享-拓展-图标列表 */
            .hupu-tools-float-container .share-modal .icons .icon-list {
                float: left;
                width: 56px;
                height: 60px;
                padding: 5px;
                text-align: center;
            }

            /* 工具块-分享-拓展-图片名称 */
            .hupu-tools-float-container .share-modal .icons .icon-list-name {
                font-size: 12px;
                padding: 5px 0;
            }

            /* 工具块-分享-拓展-图标图片 */
            .hupu-tools-float-container .share-modal .icons .icon-list-img {
                font-size: 28px;
                transition: all 0.1s ease;
            }

            /* 工具块-分享-拓展-图标-QQ图标:悬浮 */
            .hupu-tools-float-container .share-modal .icons .icon-list-img.iconQQ:hover {
                color: #0091ff;
            }

            /* 工具块-分享-拓展-图标-QQ空间:悬浮 */
            .hupu-tools-float-container .share-modal .icons .icon-list-img.iconQQkongjian:hover {
                color: #f7b500;
            }

            /* 工具块-分享-拓展-图标-新浪微博:悬浮 */
            .hupu-tools-float-container .share-modal .icons .icon-list-img.iconxinlangweibo:hover {
                color: #fa6400;
            }


            /* 工具块-分享-拓展-链接框 */
            .hupu-tools-float-container .share-modal .copy-board {
                position: relative;
                border: 1px solid #ccc;
                border-radius: 2px;
            }

            /* 工具块-分享-拓展-链接值 */
            .hupu-tools-float-container .share-modal .copy-board .copy-value {
                width: 80%;
                height: 24px;
                line-height: 24px;
                font-size: 12px;
                white-space: nowrap; /* 禁止换行 */
                overflow: hidden; /* 隐藏溢出内容 */
                text-overflow: ellipsis; /* 显示省略号 */
            }

            /* 工具块-分享-拓展-复制按钮 */
            .hupu-tools-float-container .share-modal .copy-board .copy-btn {
                position: absolute;
                right: 0;
                top: 0;
                padding: 5px;
                color: #fff;
                line-height: 14px;
                text-align: center;
                background-color: #a61624;
                border-radius: 0 2px 2px 0;
            }

            /* 工具块-分享-拓展-二维码组 */
            .hupu-tools-float-container .share-modal .right-qrcode {
                text-align: center;
            }

            /* 工具块-分享-拓展-二维码标题 */
            .hupu-tools-float-container .share-modal .qr-tip {
                padding: 10px 0;
                margin-top: 5px;
            }

            /* 工具块-分享-拓展-二维码图片 */
            .hupu-tools-float-container .share-modal .qr-img {

            }

            /* 工具块-其他-只看楼主-文本 */
            .hupu-tools-float-container .post-operate-comp-other-only-main .todo-list-text {
                font-size: 12px;
            }

            /* 工具栏悬浮容器-h5样式 */
            @media (min-width: 1441px) {
                .hupu-tools-float-container {
                    bottom: 260px;
                    right: 88px
                }
            }

        `);
        },

        /**
         * 创建悬浮容器
         */
        createFloatContainer() {
            // 创建悬浮容器
            this.$floatContainer = $('<div class="hupu-tools-float-container"></div>');
            this.$floatContainer.css({
                'position': 'fixed',
                'bottom': '260px',
                'right': '88px',
                'width': '48px',
                'height': 'auto',
                'background-color': '#fff',
                'box-shadow': '0 2px 4px 0 rgba(0,0,0,.05)',
                '-webkit-box-shadow': '0 2px 4px 0 rgba(0,0,0,.05)',
                'border-radius': '1px',
                'z-index': 999,
                'display': 'none' // 默认隐藏
            });

            // 复制工具栏到悬浮容器
            this.copyToolsToFloatContainer(this.$originalTools);

            // 创建自定义按钮
            this.createCustomBtn(this.$floatContainer);

            $('body').append(this.$floatContainer);
        },

        /**
         * 绑定事件
         */
        bindEvents() {
            // 使用节流函数优化滚动性能
            $(window).on('scroll', Utils.throttle(() => {
                this.handleScroll();
            }, 100));

            // 窗口大小改变时重新计算
            $(window).on('resize', Utils.throttle(() => {
                this.handleScroll();
            }, 200));
        },

        /**
         * 处理滚动事件
         */
        handleScroll() {
            if (!this.initialized) return;

            // 检查原始工具栏是否在视口内
            if (Utils.isElementInViewport(this.$originalTools)) {
                // 原始工具栏可见，隐藏悬浮窗
                this.$floatContainer.stop(true, true).fadeOut('fast');
            } else {
                // 检查按钮选中状态
                const $operatePost = $('div[class*="post-operate_post-operate-comp-wrapper"]');
                const toolClasses = [
                    // 一级工具栏按钮 [.todo-list]
                    'post-operate-comp-main-recommend', // 推荐
                    'post-operate-comp-main-collect'   // 收藏
                ];
                toolClasses.forEach((className) => {
                    const $currentBtn = this.$floatContainer.find(`.${className}`);  // 当前遍历按钮
                    const originalActiveState = $operatePost.find(`.${className}`).hasClass('active');  // 原标记状态
                    const currentActiveState = $currentBtn.hasClass('active');  // 当前标记状态
                    // 只有状态不一致时才更新，避免不必要的DOM操作
                    if (originalActiveState !== currentActiveState) {
                        $currentBtn.toggleClass('active', originalActiveState); // 状态已改变，更新悬浮按钮
                    }
                });

                // 原始工具栏不可见，显示悬浮窗
                this.$floatContainer.stop(true, true).fadeIn('slow');
            }
        },

        /**
         * 将工具栏复制到悬浮容器
         */
        copyToolsToFloatContainer($tools) {
            // 主动触发分享按钮悬浮️事件，促使分享二维码加载
            this.triggerMouseover('.post-operate-comp-main-share');

            // 100毫秒后，开始copy
            setTimeout(() => {
                // 克隆原工具栏（包含事件）
                const $toolsClone = $tools.clone(true);

                // 处理Canvas内容复制
                this.handleCanvasCloning($tools, $toolsClone);

                // 移除克隆元素的所有样式
                $toolsClone.removeAttr('style');

                // 设置克隆工具栏在悬浮容器中的样式
                $toolsClone.css({
                    'width': '100%',
                    'height': '100%',
                    'object-fit': 'contain'
                });

                // 绑定工具栏点击事件代理
                this.bindToolsClickProxy($toolsClone);

                // 处理悬浮状态下的文本显示
                this.handleFloatText($toolsClone);

                // 将克隆后的工具栏添加到悬浮容器
                this.$floatContainer.append($toolsClone);
            }, 100);
        },

        /**
         * 处理画布克隆 */
        handleCanvasCloning($original, $cloned) {
            const $originalCanvas = $original.find('canvas');
            const $clonedCanvas = $cloned.find('canvas');

            $originalCanvas.each((index, originalCanvas) => {
                const clonedCanvas = $clonedCanvas[index];
                if (!clonedCanvas) return;

                // 设置相同尺寸
                clonedCanvas.width = originalCanvas.width;
                clonedCanvas.height = originalCanvas.height;

                // 复制内容
                const ctx = clonedCanvas.getContext('2d');
                ctx.drawImage(originalCanvas, 0, 0);
            });
        },

        /**
         * 触发鼠标移入事件
         * @param selectorName {String} 选择器名称（#name、.name、div等）
         */
        triggerMouseover(selectorName) {
            if (!selectorName) {
                console.warn('选择器名称不可为空！');
                return;
            }

            // 获取原生的DOM元素
            const element = document.querySelector(selectorName)
            if (!element) {
                console.warn(`未找到选择器名为 ${selectorName} 的元素`);
                return;
            }

            // 创建一个 'mouseover' 事件 (注意：这里常用'mouseover'而非'mouseenter'，因mouseenter不冒泡)
            const event = new MouseEvent('mouseover', {
                //'view': window,
                'bubbles': true, // 事件是否冒泡
                'cancelable': true // 事件是否可以取消
            });

            // 派发这个事件
            element.dispatchEvent(event);
        },

        /**
         * 绑定工具按钮点击代理 */
        bindToolsClickProxy($tools) {

            const toolClasses = [
                // 一级工具栏按钮 [.todo-list]
                'post-operate-comp-main-recommend', // 推荐
                'post-operate-comp-main-reply',     // 回复
                'post-operate-comp-main-collect',   // 收藏
                'post-operate-comp-main-share',     // 分享
                'post-operate-comp-other-report',   // 举报
                'post-operate-comp-other-only-main',// 只看楼主
                // 二级分享按钮 [.icon-list .iconfont]
                'iconQQ',           // QQ
                'iconQQkongjian',   // QQ空间
                'iconxinlangweibo', // 新浪微博
                // 二级复制链接按钮 [.copy-btn]
                'copy-btn'          // 复制分享链接
            ];

            // 预先查找原始工具栏
            const $operatePost = $('div[class*="post-operate_post-operate-comp-wrapper"]');

            // 使用事件委托，只需绑定一次
            $tools.on('click', '.todo-list, .icon-list .iconfont, .copy-btn', (e) => {
                e.stopPropagation();

                const $clickedBtn = $(e.currentTarget);
                const btnClass = toolClasses.find(className => $clickedBtn.hasClass(className));

                if (!btnClass) return;

                if (btnClass) {
                    const $toolBtn = $operatePost.find(`.${btnClass}`);
                    const originalActiveState = $toolBtn.hasClass('active');

                    // 触发原始工具栏中对应按钮的点击
                    $toolBtn.trigger('click');

                    // 推荐和收藏，需要轮巡检查执行结果
                    if (btnClass.includes('recommend') || btnClass.includes('collect')) {
                        // 原站会请求推荐接口：[POST: https://bbs.hupu.com/pcmapi/pc/bbs/v1/thread/recommend, {"tid":xxx, "recommendStatus":1, "fid":xx}]
                        // 轮巡检查二级评论是否加载完毕
                        const intervalId = setInterval(() => {
                            const currentActiveState = $toolBtn.hasClass('active');
                            if (originalActiveState !== currentActiveState) {
                                // 状态已改变，更新悬浮按钮
                                $clickedBtn.toggleClass('active', currentActiveState);
                                clearInterval(intervalId);
                            }
                        }, 100);

                        // 轮巡超时，5秒后 停止轮巡
                        setTimeout(() => clearInterval(intervalId), 5000);
                    }
                }
            });
        },

        /**
         * 处理悬浮状态下的文本显示
         */
        handleFloatText($tools) {
            const O_TXT_ATTR_NAME = 'data-original-txt';

            // 配置映射表
            const floatTextMap = {
                'post-operate-comp-main-recommend': '推荐',
                'post-operate-comp-main-reply': '评论',
                'post-operate-comp-main-collect': '收藏',
                'post-operate-comp-main-share': '分享',
                'post-operate-comp-other-report': '举报',
                'post-operate-comp-other-only-main': '只看楼主'
            };

            $tools.find('.todo-list').each(function () {
                const $ele = $(this);
                const $text = $ele.find('span.todo-list-text');

                // 保存原始文本（仅首次执行时保存）
                if (!$text.attr(O_TXT_ATTR_NAME)) {
                    $text.attr(O_TXT_ATTR_NAME, $text.text().trim());
                }

                // 匹配对应的浮动文本
                const targetClass = Object.keys(floatTextMap).find(className =>
                    $ele.hasClass(className)
                );

                // 更新为悬浮状态下的文本
                if (targetClass) {
                    $text.text(floatTextMap[targetClass]);
                }
            });
        },

        /**
         * 追加更多工具栏按钮 */
        createCustomBtn($floatContainer) {
            const $customOperate = $('<div class="custom-operate"></div>');

            // 创建自定义工具按钮
            $customOperate.css({
                'width': '100%',
                'height': '100%',
                'border-bottom': '2px solid #eee',
                'object-fit': 'contain'
            });

            // 创建按钮
            this.createCustomBtn1($customOperate);

            // 置入元素[内部开头]
            $floatContainer.prepend($customOperate);
        },

        /**
         * 按钮1：跳转到楼主个人中心
         * @param $parentEle {jQuery} jQuery元素对象
         */
        createCustomBtn1($parentEle) {
            const authorInfo = Utils.getPageDataByAuthorInfo();
            if (!authorInfo || !authorInfo.header || !authorInfo.url) return;

            const authorUrl = authorInfo.url;
            const authorHeader = authorInfo.header;
            const $customBtn = $([
                '<div class="custom-goto-main todo-list">',
                '  <i class="iconfont todo-list-icon">',
                `    <img alt="" src="${authorHeader}">`,
                '  </i>',
                '  <span class="todo-list-text">楼主首页</span>',
                '</div>'
            ].join('\n'));

            // 设置属性
            $customBtn.attr('title', `快来看看我的个人中心吧`);

            // 设置样式
            $customBtn.find('img').css({
                'height': '25px',
                'margin-top': '5px',
                'border-radius': '50%',
                'object-fit': 'cover',
                'border': '1px solid transparent',
                'animation': 'borderPulse 2s infinite alternate',
            });

            Utils.addCSS(`
                .custom-goto-main:hover img {
                    animation: none !important;
                }

                @keyframes borderPulse {
                  0% {
                    border-color: rgba(166, 22, 36, 0.3);
                    box-shadow: 0 0 0 rgba(166, 22, 36, 0.5);
                  }
                  100% {
                    border-color: rgba(166, 22, 36, 1);
                    box-shadow: 0 0 10px rgba(166, 22, 36, 0.8);
                  }
                }
            `);

            $customBtn.find('.todo-list-text').css({
                'font-size': '12px',
                'margin-top': '8px'
            });

            // 绑定事件
            $customBtn.click((e) => {
                e.preventDefault();
                window.open(authorUrl, '_blank');
            });

            $parentEle.append($customBtn);
        },

        /**
         * 销毁功能
         */
        destroy() {
            if (this.$floatContainer) {
                this.$floatContainer.remove();
                this.$floatContainer = null;
            }

            $(window).off('scroll');
            $(window).off('resize');

            this.initialized = false;
        }
    };

    // 设置中心
    const Settings = {
        formName: 'hupu-enhance-settings',

        /**
         * 初始化设置模块 */
        init() {
            this.initStyles();
        },

        /**
         * 初始化调整设置相关样式*/
        initStyles() {
            // layui表单样式调整
            Utils.addCSS(`
                .layui-layer-content {
                    position: initial !important;
                }

                input.layui-input.w60 {
                    width: 80px;
                }

                .layui-bottom-btn {
                    position: absolute;
                    bottom: 0;
                    width: calc(100% - 20px);
                    padding-top: 10px;
                    padding-bottom: 20px;
                    background-color: #fff;
                }

                .layui-card {
                    box-shadow: initial;
                    padding-bottom: 60px;
                }

                .layui-form .layui-form-item .layui-form-label {
                    width: 120px;
                }

                .layui-form .layui-form-item .layui-input-block {
                    margin-left: 120px;
                }

                .layui-form-switch {
                    margin: 0;
                }

                .layui-form-mid {
                    float: initial;
                    margin-left: 10px;
                    display: inline-table;
                }

                .layui-form-mid b {
                    font-weight: bolder;
                    text-decoration: underline;
                }

                .layui-form-mid i {
                    font-style: italic;
                }


                .input-group {
                    display: inline-table;
                    border-collapse: separate;
                }
                .input-group .form-control, .input-group-addon {
                    display: table-cell;
                }
                .input-group .form-control{
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                .input-group .input-group-addon {
                    padding: 5px;
                    text-align: center;
                    color: #aaa;
                    background-color: #fafafa;
                    border-radius: 2px;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    border: 1px solid #eee;
                    border-left: none;
                }
                .input-group .input-group-addon:empty{
                    display: none;
                }
            `);


            // 添加按键说明弹窗的CSS
            Utils.addCSS(`
                /* 按键说明弹窗样式 */
                .key-info-icon {
                    cursor: pointer;
                    color: #1e9fff;
                    margin-left: 10px;
                    transition: color 0.3s ease;
                }

                .key-info-icon:hover {
                    color: #ff4757 !important;
                }

                .key-info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                    font-size: 14px;
                }

                .key-info-table th {
                    background-color: #f8f9fa;
                    font-weight: bold;
                    padding: 10px;
                    border: 1px solid #ddd;
                }

                .key-info-table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                }

                /* 完全不适合的按键 - 红色系 */
                .key-status-unavailable {
                    color: #ff4757 !important;
                    font-weight: bold;
                    background-color: rgba(255, 71, 87, 0.1);
                }

                .key-status-unavailable-title {
                    color: #ff4757;
                    font-size: 16px;
                    border-left: 4px solid #ff4757;
                    padding-left: 10px;
                }

                /* 勉强可用的按键 - 黄色系 */
                .key-status-barely {
                    color: #ff9f43 !important;
                    font-weight: bold;
                    background-color: rgba(255, 159, 67, 0.1);
                }

                .key-status-barely-title {
                    color: #ff9f43;
                    margin-top: 20px;
                    font-size: 16px;
                    border-left: 4px solid #ff9f43;
                    padding-left: 10px;
                }

                .key-tips-box {
                    margin-top: 15px;
                    padding: 12px;
                    background-color: #f0f8ff;
                    border-radius: 4px;
                    border-left: 3px solid #1e9fff;
                    font-size: 14px;
                    line-height: 1.5;
                }
            `);
        },

        /**
         * 显示设置面板
         */
        showSettingsPanel() {
            if (window.settingsLayer) {
                layer.close(window.settingsLayer);
            }

            window.settingsLayer = layer.open({
                type: 1,
                title: '⚙️设置中心 - 虎扑增强',
                area: ['800px', '600px'],   // 最小尺寸：500*600
                shade: 0.3,
                shadeClose: true,
                content: this.generateSettingsHTML(),
                beforeEnd: function (layero, index, that) {
                    // 关闭所有的 tips 层
                    layer.closeAll('tips');
                },
                success: (layero, index) => {
                    // 渲染表单
                    layui.form.render();

                    // 绑定表单验证
                    this.bindEvents();

                    // 绑定表单事件
                    $('#settings-save').click(e => {
                        try {
                            const formField = layui.form.val(this.formName);  // 扁平数据
                            const saveData = Settings.dotToNested(formField); // 转为结构化数据

                            // 显式处理布尔字段（无论是否勾选都赋值）
                            saveData.reply.enabled = formField['reply.enabled'] === 'on'; // 表单中无此key则为false
                            saveData.reply.isScrollToLastReply = formField['reply.isScrollToLastReply'] === 'on';
                            saveData.videoFloat.enabled = formField['videoFloat.enabled'] === 'on';

                            // 保存数据
                            ConfigManager.saveConfig(saveData);
                            layer.msg('设置已保存，刷新后应用！', {icon: 1});
                        } catch (e) {
                            layer.msg('保存失败', {icon: 5});
                            console.error(e);
                        }
                        return false;
                    });

                    $('#settings-reset').click(e => {
                        layer.confirm('确定要重置所有设置吗？', function (index) {
                            ConfigManager.resetConfig();
                            layer.msg('设置已重置，刷新后应用！', {icon: 1});
                            window.settingsLayer.close();
                            Utils.showSettingsPanel(); // 重新打开设置面板
                            layer.close(index);
                        });
                        return false;
                    });

                    // 滚动条禁用
                    Utils.disableScroll();

                }, end: function () {
                    // 恢复滚动条
                    Utils.enableScroll();
                }
            });
        },

        /**
         * 绑定表单验证事件*/
        bindEvents() {
            const $videoFloatInput = $('.video-float-input');

            // 实时输入检查
            $videoFloatInput.on('input', function () {
                const $this = $(this);
                const val = $this.val();

                // 过滤非法字符，只保留数字和a,u,t,o字母
                const filtered = val.replace(/[^0-9aAuUtToO]/g, '');

                if (filtered !== val) {
                    $this.val(filtered);
                }
            });

            // 失去焦点验证和互斥处理
            $videoFloatInput.on('blur', function () {
                const directionAttrName = 'data-direction';
                const $this = $(this);
                const direction = $this.attr(directionAttrName);
                let val = $this.val().toLowerCase();

                // 验证输入值
                if (val === 'auto') {
                    $this.val('auto');
                } else {
                    const numVal = parseInt(val);
                    if (isNaN(numVal) || numVal < 1) {
                        $this.val('auto');
                        val = 'auto';
                    } else {
                        $this.val(numVal);
                        val = numVal;
                    }
                }

                // 互斥处理
                if (val !== 'auto') {
                    const opposite = {
                        'top': 'bottom',
                        'bottom': 'top',
                        'left': 'right',
                        'right': 'left'
                    };
                    $(`input[${directionAttrName}="${opposite[direction]}"]`).val('auto');
                }
            });

            // 图片缩放键与大图键同步
            $('input[data-sync-to]').on('change', function () {
                const targetName = $(this).data('sync-to');
                $(`input[name="${targetName}"]`).val($(this).val());
            });

            //
            $('input[name="img.zoomKey"],input[name="img.maxKey"]')
                .off('keydown.keySetting keyup.keySetting') // 防止重复绑定
                .on('keydown', e => {
                    console.log('keydown', e.key, e);

                    const keyVal = e.key.toLowerCase(); // 统一转小写比较
                    const $target = $(e.target);
                    const isZoomKey = $target.attr('name') === 'img.zoomKey';

                    // 完全不能用作快捷键的按键
                    const completelyUnavailable = [
                        'f1', 'f5', 'f10', 'f11', 'f12', 'contextmenu',
                        'meta', 'win', 'tab', 'enter', 'home', 'end', ' ',
                        'pageup', 'pagedown'
                    ];

                    // 勉强可用的按键
                    const barelyUsable = [
                        'f3', 'f7', 'capslock', 'scrolllock',
                        'numlock', 'pause', 'insert', 'delete'
                    ];

                    // 特殊处理 Ctrl 键
                    if (e.ctrlKey) {
                        if (isZoomKey) {
                            // Ctrl 不能用作缩放控制键（与浏览器缩放冲突）
                            layer.tips('⛔ Ctrl+滚轮为浏览器缩放，不能用作缩放控制键', $target, {
                                tips: [2, '#ff4757'] // 红色提示
                            });
                            e.preventDefault();
                            return;
                        } else {
                            // Ctrl 可以用作最大化键
                            $target.val('ctrl');
                            e.preventDefault();
                            return;
                        }
                    }

                    // 检查完全不可用按键
                    if (completelyUnavailable.includes(keyVal)) {
                        let keyName = keyVal.toUpperCase();
                        keyName = keyName === ' ' ? 'SPACE' : keyName;
                        layer.tips(`🚫 ${keyName} 有系统功能，不适合作为快捷键`, $target, {
                            tips: [2, '#ff4757'] // 红色提示
                        });
                        $target.val('');
                        e.preventDefault();
                        return;
                    }

                    // 检查勉强可用按键
                    if (barelyUsable.includes(keyVal)) {
                        layer.tips(`⚠️ ${keyVal.toUpperCase()} 有其他功能，可能产生冲突`, $target, {
                            tips: [2, '#ff9f43'] // 黄色提示
                        });
                    }

                    // 接受按键
                    $target.val(keyVal);
                    layer.closeAll('tips'); // 关闭所有的 tips 层

                    //检查互斥对象的值，如果冲突 则将互斥对象的值改为默认，默认也冲突则清空
                    const mutexName = (isZoomKey ? 'maxKey' : 'zoomKey');
                    const $mutexEle = $(`input[name="img.${mutexName}"]`);
                    const mutexVal = $mutexEle.val().toLowerCase();

                    if (keyVal === mutexVal) {
                        const currentVal = CONFIG.img[mutexName];
                        if (keyVal === currentVal) {
                            $mutexEle.val(''); // 如果与当前值也冲突，则清空
                            layer.tips('与当前值冲突，已清空', $mutexEle, {tips: [2, '#ff4757']});
                        } else {
                            $mutexEle.val(currentVal); // 否则设为当前值
                            layer.tips(`冲突，已恢复当前值 "${currentVal}"`, $mutexEle, {tips: [2, '#ff9f43']});
                        }
                    }
                    e.preventDefault();
                });


            // 绑定按键说明图标点击事件
            $(document).on('click', '.key-info-icon', function () {
                const content = `
                    <div style="padding: 15px; max-height: 400px; overflow-y: auto;">
                        <h4 class="key-status-unavailable-title">🚫 完全不适合作为快捷键</h4>
                        <table class="key-info-table">
                            <thead>
                                <tr>
                                    <th>按键</th>
                                    <th>常规用途</th>
                                    <th>说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>F1/F5/F10/F11/F12</td>
                                    <td>帮助/刷新/设置/全屏/开发者工具</td>
                                    <td class="key-status-unavailable">系统功能键</td>
                                </tr>
                                <tr>
                                    <td>ContextMenu</td>
                                    <td>右键菜单</td>
                                    <td class="key-status-unavailable">系统菜单键</td>
                                </tr>
                                <tr>
                                    <td>Win/Meta</td>
                                    <td>开始菜单</td>
                                    <td class="key-status-unavailable">系统快捷键</td>
                                </tr>
                                <tr>
                                    <td>Space</td>
                                    <td>空格键</td>
                                    <td class="key-status-unavailable">页面翻页</td>
                                </tr>
                                <tr>
                                    <td>Tab</td>
                                    <td>切换焦点</td>
                                    <td class="key-status-unavailable">页面导航</td>
                                </tr>
                                <tr>
                                    <td>Enter</td>
                                    <td>确认/回车</td>
                                    <td class="key-status-unavailable">表单提交</td>
                                </tr>
                                <tr>
                                    <td>Home/End</td>
                                    <td>页面顶部/底部</td>
                                    <td class="key-status-unavailable">页面导航</td>
                                </tr>
                                <tr>
                                    <td>PageUp/PageDown</td>
                                    <td>页面上下翻页</td>
                                    <td class="key-status-unavailable">页面导航</td>
                                </tr>
                                <tr>
                                    <td>Control</td>
                                    <td>Ctrl+滚轮缩放</td>
                                    <td class="key-status-unavailable">缩放控制键冲突</td>
                                </tr>
                            </tbody>
                        </table>

                        <h4 class="key-status-barely-title">⚠️ 勉强可用（可能冲突）</h4>
                        <table class="key-info-table">
                            <thead>
                                <tr>
                                    <th>按键</th>
                                    <th>常规用途</th>
                                    <th>说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>F3/F7</td>
                                    <td>页面搜索/文本光标</td>
                                    <td class="key-status-barely">功能较少使用</td>
                                </tr>
                                <tr>
                                    <td>CapsLock</td>
                                    <td>大小写锁定</td>
                                    <td class="key-status-barely">状态切换</td>
                                </tr>
                                <tr>
                                    <td>ScrollLock/NumLock</td>
                                    <td>滚动锁定/数字键盘</td>
                                    <td class="key-status-barely">状态切换</td>
                                </tr>
                                <tr>
                                    <td>Pause/Insert/Delete</td>
                                    <td>暂停/插入/删除</td>
                                    <td class="key-status-barely">特殊功能</td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="key-tips-box">
                            <strong>💡 建议：</strong>
                            推荐使用字母键（a-z）、数字键（0-9）或符号键作为快捷键，避免与系统功能冲突。
                        </div>
                    </div>
                `;

                layer.open({
                    type: 1,
                    title: '⌨️ 按键使用说明',
                    area: ['600px', '500px'],
                    content: content,
                    shadeClose: true,
                    scrollbar: false
                });
            });
        },

        /**
         * 将扁平的点分隔键名结构转换为嵌套对象结构 */
        dotToNested(obj) {
            return Object.entries(obj).reduce((res, [key, value]) => {
                const keys = key.split('.');
                let current = res;

                keys.forEach((k, i) => {
                    if (i === keys.length - 1) {
                        current[k] = value;
                    } else {
                        current[k] = current[k] || {};
                        current = current[k];
                    }
                });

                return res;
            }, {});
        },

        /**
         * 生成设置面板HTML
         */
        generateSettingsHTML() {
            return `
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" name="${this.formName}" id="${this.formName}" lay-filter="${this.formName}">
                        <div class="layui-tab layui-tab-brief">
                            <ul class="layui-tab-title">
                                <li class="layui-this">图片缩放</li>
                                <li>视频缩放</li>
                                <li>视频悬浮</li>
                                <li>回复贴交互</li>
                            </ul>
                            <div class="layui-tab-content">
                                <!-- 图片缩放设置 -->
                                <div class="layui-tab-item layui-show">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">默认宽度</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="number" name="img.thumbnailWidth" value="${CONFIG.img.thumbnailWidth}" step="1" min="50" max="${CONFIG.img.maxZoomWidth}" class="layui-input form-control w60">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">图片默认显示的宽度</div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">鼠标悬浮宽度</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="number" name="img.hoverWidth" value="${CONFIG.img.hoverWidth}" step="1" min="50" max="${CONFIG.img.maxZoomWidth}" class="layui-input w60">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">鼠标悬浮时图片显示的宽度</div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">滚轮缩放比例</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="number" name="img.zoomRatio" value="${CONFIG.img.zoomRatio}" step="0.1" min="1.1" max="3" class="layui-input w60">
                                                <span class="input-group-addon">%</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">按住缩放键时，每次滚动的缩放比例 (1.1-3.0)</div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">缩放控制键</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="text" name="img.zoomKey" value="${CONFIG.img.zoomKey}" maxlength="1" class="layui-input w60" data-sync-to="video.zoomKey" readonly>
                                                <span class="input-group-addon"></span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">
                                                按住该键+滚轮缩放图片
                                                <i class="layui-icon layui-icon-about key-info-icon" style="font-style: initial;" title="查看按键说明"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">最大化控制键</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="text" name="img.maxKey" value="${CONFIG.img.maxKey}" maxlength="1" class="layui-input w60" data-sync-to="video.maxKey" readonly>
                                                <span class="input-group-addon"></span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">
                                                按下该键将图片最大化显示
                                                <i class="layui-icon layui-icon-about key-info-icon" style="font-style: initial;" title="查看按键说明"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 视频缩放设置 -->
                                <div class="layui-tab-item">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">默认宽度</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="number" name="video.thumbnailWidth" value="${CONFIG.video.thumbnailWidth}" step="1" min="50" max="${CONFIG.video.maxZoomWidth}" class="layui-input w60">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux"><b style="color: rgba(166, 22, 36, 0.6);">横向视频</b> 回复贴中的默认宽度<i>（高度自动）</i></div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">默认高度</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="number" name="video.thumbnailHeight" value="${CONFIG.video.thumbnailHeight}" step="1" min="50" max="${CONFIG.video.maxZoomWidth}" class="layui-input w60">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux"><b style="color: rgba(255, 87, 34, 0.6);">纵向视频</b> 回复贴中的默认高度<i>（宽度自动）</i></div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">鼠标悬浮宽度</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="number" name="video.hoverWidth" value="${CONFIG.video.hoverWidth}" step="1" min="50" max="${CONFIG.video.maxZoomWidth}" class="layui-input w60">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux"><b style="color: rgba(166, 22, 36, 0.6);">横向视频</b> 鼠标悬浮时的宽度<i>（高度自动）</i></div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">鼠标悬浮高度</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="number" name="video.hoverHeight" value="${CONFIG.video.hoverHeight}" step="1" min="50" max="${CONFIG.video.maxZoomWidth}" class="layui-input w60">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux"><b style="color: rgba(255, 87, 34, 0.6);">纵向视频</b> 鼠标悬浮时的高度<i>（宽度自动）</i></div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">滚轮缩放比例</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="number" name="video.zoomRatio" value="${CONFIG.video.zoomRatio}" step="0.1" min="1.1" max="3" class="layui-input w60">
                                                <span class="input-group-addon">%</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">按住缩放键时，每次滚动的缩放比例 (1.1-3.0)</div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">缩放控制键</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="text" name="video.zoomKey" value="${CONFIG.img.zoomKey}" maxlength="1" class="layui-input w60" disabled>
                                                <span class="input-group-addon"></span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">按住该键+滚轮缩放视频<i>（与图片同步）</i></div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">最大化控制键</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="text" name="video.maxKey" value="${CONFIG.img.maxKey}" maxlength="1" class="layui-input w60" disabled>
                                                <span class="input-group-addon"></span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">按下该键将视频最大化显示<i>（与图片同步）</i></div>
                                        </div>
                                    </div>

                                    <blockquote class="layui-elem-quote layui-quote-nm" style="font-size: 12px; line-height: 1.5;">
                                        💡 视频显示尺寸说明：<br>
                                        • 默认尺寸：回复贴中视频的初始显示大小<br>
                                        • 鼠标悬浮：回复贴中视频的悬浮放大尺寸<br>
                                        • 主贴视频不受这些设置影响，保持原始尺寸
                                    </blockquote>

                                </div>

                                <!-- 视频悬浮设置 -->
                                <div class="layui-tab-item">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">功能开启</label>
                                        <div class="layui-input-block">
                                            <input type="checkbox" name="videoFloat.enabled" lay-skin="switch" lay-text="开启|关闭" ${CONFIG.videoFloat.enabled ? 'checked' : ''}>
                                            <div class="layui-form-mid layui-word-aux">启用视频悬浮功能</div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">窗口宽度</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="number" name="videoFloat.floatWidth" value="${CONFIG.videoFloat.floatWidth}" step="1" min="50" max="${CONFIG.video.maxZoomWidth}" class="layui-input w60">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux"><b style="color: rgba(166, 22, 36, 0.6);">横向视频</b> 悬浮窗口的宽度<i>（高度自动）</i></div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">窗口高度</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="number" name="videoFloat.floatHeight" value="${CONFIG.videoFloat.floatHeight}" step="1" min="50" max="${CONFIG.video.maxZoomWidth}" class="layui-input w60">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux"><b style="color: rgba(255, 87, 34, 0.6);">纵向视频</b> 悬浮窗口的高度<i>（宽度自动）</i></div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">顶部距离</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="text" name="videoFloat.top" value="${CONFIG.videoFloat.top}" class="layui-input video-float-input w60" data-direction="top" placeholder="auto或具体数值">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">悬浮窗口距离顶部的距离</div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">底部距离</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="text" name="videoFloat.bottom" value="${CONFIG.videoFloat.bottom}" class="layui-input video-float-input w60" data-direction="bottom" placeholder="auto或具体数值">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">悬浮窗口距离底部的距离</div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">左侧距离</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="text" name="videoFloat.left" value="${CONFIG.videoFloat.left}" class="layui-input video-float-input w60" data-direction="left" placeholder="auto或具体数值">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">悬浮窗口距离左侧的距离</div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">右侧距离</label>
                                        <div class="layui-input-block">
                                            <div class="input-group">
                                                <input type="text" name="videoFloat.right" value="${CONFIG.videoFloat.right}" class="layui-input video-float-input w60" data-direction="right" placeholder="auto或具体数值">
                                                <span class="input-group-addon">px</span>
                                            </div>
                                            <div class="layui-form-mid layui-word-aux">悬浮窗口距离右侧的距离</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 回复贴交互设置 -->
                                <div class="layui-tab-item">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">功能开启</label>
                                        <div class="layui-input-block">
                                            <input type="checkbox" name="reply.enabled" lay-skin="switch" lay-text="开启|关闭" ${CONFIG.reply.enabled ? 'checked' : ''}>
                                            <div class="layui-form-mid layui-word-aux">启用回复交互增强功能</div>
                                        </div>
                                    </div>

                                    <div class="layui-form-item">
                                        <label class="layui-form-label">折叠定位</label>
                                        <div class="layui-input-block">
                                            <input type="checkbox" name="reply.isScrollToLastReply" lay-skin="switch" lay-text="开启|关闭" ${CONFIG.reply.isScrollToLastReply ? 'checked' : ''}>
                                            <div class="layui-form-mid layui-word-aux">收起评论时自动定位到最后查看位置</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-bottom-btn">
                <div class="layui-input-block" style="margin: 0; text-align: center;">
                    <input type="button" class="layui-btn layui-btn-normal" id="settings-save" value="保存设置">
                    <input type="button" class="layui-btn layui-btn-primary layui-border-red" id="settings-reset" value="恢复默认">
                    <input type="button" class="layui-btn layui-btn-primary" value="取消" onclick="layer.closeAll()" />
                </div>
            </div>`;
        }
    };


    //* ============================================ *//

    /**
     * 初始化公共样式 */
    function initStyles() {
        // 元素隐藏
        Utils.addCSS(`.none { display: none !important; }`);

        // 元素不可见
        Utils.addCSS(`.hidden { visibility: hidden !important; }`);

        // 隐藏头部游戏中心
        Utils.addCSS(`.gamecenter { display: none !important; }`);
    }

    /**
     * 初始化Layui*/
    function initLayui() {
        // 矫正“font”相关路径
        let layuiCssText = GM_getResourceText('layuiCss');
        layuiCssText = layuiCssText.replace("../font/iconfont.woff2", "https://unpkg.com/layui@2.9.14/dist/font/iconfont.woff2");
        layuiCssText = layuiCssText.replace("../font/iconfont.woff", "https://unpkg.com/layui@2.9.14/dist/font/iconfont.woff");
        layuiCssText = layuiCssText.replace("../font/iconfont.ttf", "https://unpkg.com/layui@2.9.14/dist/font/iconfont.ttf");
        layuiCssText = layuiCssText.replace("../font/iconfont.eot", "https://unpkg.com/layui@2.9.14/dist/font/iconfont.eot");
        layuiCssText = layuiCssText.replace("../font/iconfont.svg", "https://unpkg.com/layui@2.9.14/dist/font/iconfont.svg");
        GM_addStyle(layuiCssText);

        // 矫正“.map”文件路径
        let layuiJsText = GM_getResourceText('layuiJs');
        layuiJsText = layuiJsText.replace("sourceMappingURL=layui.js.map", "sourceMappingURL=https://unpkg.com/layui@2.9.14/dist/layui.js.map");
        // 将矫正后的“layui.js”置入代码文档
        let script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.text = layuiJsText;
        document.documentElement.appendChild(script);

        layui.use(["layer"], function () {
            window.layui = layui;
            window.layer = layui.layer;
        });
    }

    /**
     * 初始化油猴菜单 */
    function initMenus() {
        // 菜单1：设置中心
        Utils.addMenu("⚙️ 设置中心", () => {
            Settings.showSettingsPanel();
        });


        // 菜单2：帮助中心
        Utils.addMenu("📚 帮助中心", () => {
            const imgCONFIG = CONFIG.img;
            const videoCONFIG = CONFIG.video;

            const tips = [
                '<div style="font-size: 14px; line-height: 1.6;padding: 20px;">',
                '<h3 style="color: #a61624; margin-bottom: 15px;">🐯 虎扑增强插件使用说明</h3>',

                '<div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">',
                '<strong>💡 温馨提示：</strong>',
                '<ul style="margin: 10px 0; padding-left: 20px;">',
                '<li>所有功能都可在<strong style="color: #a61624;">【设置中心】</strong>中自定义调整</li>',
                '<li>遇到问题可随时在<strong style="color: #a61624;">【设置中心】</strong>重置为默认配置</li>',
                '</ul>',
                '</div>',

                '<h4 style="color: #333; margin: 15px 0 8px 0;">🖼️ 图片缩放功能</h4>',
                '<ul style="margin: 0 0 15px 0; padding-left: 20px;">',
                '<li><strong>鼠标放上去：</strong>自动放大图片</li>',
                `<li><strong>按住 ${imgCONFIG.zoomKey.toUpperCase()} 键 + 滚轮：</strong>自由缩放图片大小</li>`,
                `<li><strong>按 ${imgCONFIG.maxKey.toUpperCase()} 键：</strong>图片最大化显示</li>`,
                '<li><strong>鼠标移开：</strong>自动恢复小尺寸</li>',
                '</ul>',

                '<h4 style="color: #333; margin: 15px 0 8px 0;">🎬 视频增强功能</h4>',
                '<ul style="margin: 0 0 15px 0; padding-left: 20px;">',
                '<li><strong>鼠标放上去：</strong>自动放大视频</li>',
                `<li><strong>按住 ${videoCONFIG.zoomKey.toUpperCase()} 键 + 滚轮：</strong>自由缩放视频大小</li>`,
                `<li><strong>按 ${videoCONFIG.maxKey.toUpperCase()} 键：</strong>视频最大化显示</li>`,
                '<li><strong>鼠标晃过视频：</strong>视频获得焦点，按空格键就能播放（摸鱼神器！）</li>',
                '<li><strong>视频悬浮：</strong>滚动页面时，正在播放的视频会悬浮在角落（可拖动位置）</li>',
                '</ul>',

                '<h4 style="color: #333; margin: 15px 0 8px 0;">💬 评论交互增强</h4>',
                '<ul style="margin: 0 0 15px 0; padding-left: 20px;">',
                '<li><strong>点击页面空白处：</strong>一键收起所有展开的评论</li>',
                '<li><strong>自动定位：</strong>收起评论时自动跳转到你最后查看的位置</li>',
                '<li><strong>楼主标记：</strong>在二级评论中清晰标记楼主身份</li>',
                '</ul>',

                '<h4 style="color: #333; margin: 15px 0 8px 0;">🔧 工具栏优化</h4>',
                '<ul style="margin: 0 0 15px 0; padding-left: 20px;">',
                '<li><strong>右侧悬浮：</strong>推荐、收藏、分享等工具按钮悬浮在右侧</li>',
                '<li><strong>边看边操作：</strong>浏览长贴时不用再跑回顶部操作</li>',
                '<li><strong>楼主直达：</strong>点击楼主头像快速访问楼主首页</li>',
                '</ul>',

                '<div style="background: #fff8e1; padding: 12px; border-radius: 5px; border-left: 4px solid #ffd54f; margin-top: 15px;">',
                '<strong>🎯 使用小贴士：</strong>',
                '<ul style="margin: 8px 0 0 0; padding-left: 18px;">',
                '<li>视频悬浮窗可以随意拖动到屏幕任意位置</li>',
                '<li>点击悬浮窗的「×」可关闭悬浮，点击「↑」可定位到原视频</li>',
                '<li>所有设置都支持自定义，找到最适合你的浏览方式</li>',
                '</ul>',
                '</div>',

                '<div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px dashed #ddd; color: #666; font-size: 12px;">',
                '感谢使用虎扑增强插件！如有问题欢迎反馈～',
                '</div>',
                '</div>'
            ].join('');

            layer.open({
                type: 1,
                title: '📚帮助中心 - 虎扑增强',
                area: ['800px', '600px'],
                shade: 0.3,
                shadeClose: true,
                content: tips,
                btn: ['我明白了', '打开设置中心'],
                yes: function (index) {
                    layer.close(index);
                },
                btn2: function (index) {
                    Settings.showSettingsPanel();
                    layer.close(index);
                }
            });
        });
    }


    //* ============================================ *//


    /**
     * 初始化函数 */
    function init() {
        initStyles();
        initMenus();
        initLayui();
        ImageZoom.init();
        VideoFloat.init();
        ReplyHandler.init();
        ToolsFloat.init();
        Settings.init();
    }

    // 页面加载完成后初始化
    // $(document).ready(init);

    // 及时初始化
    init();

    // Settings.showSettingsPanel();

})();
