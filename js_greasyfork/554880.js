// ==UserScript==
// @name              网站亮暗色转换
// @version           1.0.5
// @description       实现任意网站的暗色、亮色的转换，支持负片反色模式，支持网站白名单。
// @author            Redlyn
// @license           MIT
// @match             *://*/*
// @require           https://unpkg.com/darkrule@1.0.4/dist/rule.min.js
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @run-at            document-start
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNOTMuNSA5NC42YzEwLjYgMCAyMC4zLTMuMyAyOC4yLTktOC4zIDIyLjUtMzAuMiAzOC42LTU2IDM4LjYtMzIuNyAwLTU5LjMtMjUuOC01OS4zLTU3LjdTMzIuOSA4LjcgNjUuNyA4LjdoMi4yQzU0LjYgMTcgNDUuNyAzMS41IDQ1LjcgNDhjMCAyNS43IDIxLjQgNDYuNiA0Ny44IDQ2LjZ6IiBmaWxsPSIjZmZiNTc4Ii8+PHBhdGggZD0iTTEyMS42IDgxLjhjLS44IDAtMS42LjItMi4zLjctNy41IDUuMy0xNi41IDguMS0yNS44IDguMS0yNC4yIDAtNDMuOS0xOS4xLTQzLjktNDIuNyAwLTE0LjcgNy42LTI4LjEgMjAuMy0zNiAxLjEtLjcgMS44LTEuOSAxLjgtMy4yYTMuOCAzLjggMCAwIDAtMy44LTMuOGgtMi4zQzMwLjggNC45IDIuNSAzMi41IDIuNSA2Ni41UzMwLjggMTI4IDY1LjcgMTI4YzI2LjcgMCA1MC43LTE2LjUgNTkuNi00MSAuMS0uNC4yLS45LjItMS4zIDAtMi4xLTEuNy0zLjktMy45LTMuOXptLTU1LjkgMzguNWMtMzAuNSAwLTU1LjQtMjQuMi01NS40LTUzLjkgMC0yNi4yIDE5LjQtNDguNiA0NS43LTUzLjEtOSA5LjQtMTQuMiAyMS44LTE0LjIgMzQuNyAwIDI3LjggMjMuMiA1MC40IDUxLjcgNTAuNCA2LjcgMCAxMy4yLTEuMiAxOS4zLTMuNi0xMCAxNS44LTI3LjggMjUuNS00Ny4xIDI1LjV6bTM1LjYtNDcuOUg3Ny45Yy0xLjYgMC0yLjktMS4zLTIuOS0yLjkgMC0xIC41LTEuOSAxLjMtMi40TDkxLjYgNTdINzcuOWMtMS42IDAtMi45LTEuMy0yLjktMi45czEuMy0yLjkgMi45LTIuOWgyMy40YzEuNiAwIDIuOSAxLjMgMi45IDIuOSAwIDEtLjUgMS45LTEuMyAyLjRMODcuNiA2Ni42aDEzLjdjMS42IDAgMi45IDEuMyAyLjkgMi45cy0xLjMgMi45LTIuOSAyLjl6bTEzLjItMzEuMWgtMTQuNGMtMS42IDAtMi45LTEuMy0yLjktMi45IDAtMSAuNS0xLjkgMS4zLTIuNGw2LjMtNC4xaC00LjdjLTEuNiAwLTIuOS0xLjMtMi45LTIuOXMxLjMtMi45IDIuOS0yLjloMTQuNGMxLjYgMCAyLjkgMS4zIDIuOSAyLjkgMCAxLS41IDEuOS0xLjMgMi40bC02LjMgNC4xaDQuN2MxLjYgMCAyLjkgMS4zIDIuOSAyLjlzLTEuMyAyLjktMi45IDIuOXptNS42LTI3LjVIMTA4Yy0xLjYgMC0yLjktMS4zLTIuOS0yLjkgMC0xIC41LTEuOSAxLjMtMi40bDQuMS0yLjdIMTA4Yy0xLjYgMC0yLjktMS4zLTIuOS0yLjlTMTA2LjQgMCAxMDggMGgxMi4xYzEuNiAwIDIuOSAxLjMgMi45IDIuOSAwIDEtLjUgMS45LTEuMyAyLjRMMTE3LjYgOGgyLjRjMS42IDAgMi45IDEuMyAyLjkgMi45cy0xLjIgMi45LTIuOCAyLjl6IiBmaWxsPSIjNDQ0Ii8+PC9zdmc+
// @namespace https://greasyfork.org/users/1530405
// @downloadURL https://update.greasyfork.org/scripts/554880/%E7%BD%91%E7%AB%99%E4%BA%AE%E6%9A%97%E8%89%B2%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/554880/%E7%BD%91%E7%AB%99%E4%BA%AE%E6%9A%97%E8%89%B2%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

;(function () {
    'use strict';

    let util = {
        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.head.appendChild(style);
        },

        hover(ele, fn1, fn2) {
            ele.onmouseenter = function () {
                fn1.call(ele);
            };
            ele.onmouseleave = function () {
                fn2.call(ele);
            };
        },

        addThemeColor(color) {
            let doc = document, meta = doc.getElementsByName('theme-color')[0];
            if (meta) return meta.setAttribute('content', color);
            let metaEle = doc.createElement('meta');
            metaEle.name = 'theme-color';
            metaEle.content = color;
            doc.head.appendChild(metaEle);
        },

        getThemeColor() {
            let meta = document.getElementsByName('theme-color')[0];
            if (meta) {
                return meta.content;
            }
            return '#ffffff';
        },

        removeElementById(eleId) {
            let ele = document.getElementById(eleId);
            ele && ele.parentNode.removeChild(ele);
        },

        hasElementById(eleId) {
            return document.getElementById(eleId);
        },

        filter: '-webkit-filter: url(#dark-mode-filter) !important; filter: url(#dark-mode-filter) !important;',
        reverseFilter: '-webkit-filter: url(#dark-mode-reverse-filter) !important; filter: url(#dark-mode-reverse-filter) !important;',
        firefoxFilter: `filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="dark-mode-filter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.283 -0.567 -0.567 0 0.925 -0.567 0.283 -0.567 0 0.925 -0.567 -0.567 0.283 0 0.925 0 0 0 1 0"/></filter></svg>#dark-mode-filter') !important;`,
        firefoxReverseFilter: `filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="dark-mode-reverse-filter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.333 -0.667 -0.667 0 1 -0.667 0.333 -0.667 0 1 -0.667 -0.667 0.333 0 1 0 0 0 1 0"/></filter></svg>#dark-mode-reverse-filter') !important;`,
        noneFilter: '-webkit-filter: none !important; filter: none !important;',
        // 添加负片反色滤镜
        invertFilter: 'filter: invert(1) hue-rotate(180deg) !important;',
        invertReverseFilter: 'filter: invert(1) hue-rotate(180deg) !important;'
    };

    // 主要功能逻辑
    let main = {
        // 初始化默认值 - 设置初始配置
        initValue() {
            let value = [{
                name: 'button_position',
                value: 'left'
            }, {
                name: 'button_size',
                value: 32
            }, {
                name: 'exclude_list',
                value: ['youku.com', 'v.youku.com', 'www.douyu.com', 'www.iqiyi.com', 'vip.iqiyi.com', 'mail.qq.com', 'live.kuaishou.com']
            }, {
                name: 'origin_theme_color',
                value: '#ffffff'
            }, {
                name: 'site_modes',
                value: {}
            }, {
                name: 'site_original_modes',  // 新增：存储原始检测结果
                value: {}
            }, {
                name: 'enable_invert_mode',
                value: false  // 默认关闭负片反色模式
            }];

            value.forEach((v) => {
                util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
            });
        },

        // 重置为默认值
        resetToDefaults() {
            let defaults = [{
                name: 'button_position',
                value: 'left'
            }, {
                name: 'button_size',
                value: 32
            }, {
                name: 'exclude_list',
                value: ['youku.com', 'v.youku.com', 'www.douyu.com', 'www.iqiyi.com', 'vip.iqiyi.com', 'mail.qq.com', 'live.kuaishou.com']
            }, {
                name: 'origin_theme_color',
                value: '#ffffff'
            }, {
                name: 'site_modes',
                value: {}
            }, {
                name: 'site_original_modes',
                value: {}
            }, {
                name: 'enable_invert_mode',
                value: false
            }];

            defaults.forEach((v) => {
                util.setValue(v.name, v.value);
            });

            // 重新应用当前模式
            if (this.isDarkMode()) {
                this.enableDarkMode();
            } else {
                this.disableDarkMode();
            }

            return true;
        },


        // 获取当前网站模式 - 读取站点模式设置
        getCurrentSiteMode() {
            let siteModes = util.getValue('site_modes') || {};
            let host = location.host;
            return siteModes[host] || 'light';
        },

        // 设置当前网站模式 - 更新站点模式状态
        setCurrentSiteMode(mode) {
            let siteModes = util.getValue('site_modes') || {};
            let host = location.host;
            siteModes[host] = mode;
            util.setValue('site_modes', siteModes);
        },

        // 获取原始网站模式
        getOriginalSiteMode() {
            let siteModes = util.getValue('site_original_modes') || {};
            let host = location.host;
            return siteModes[host] || null;
        },

        // 设置原始网站模式
        setOriginalSiteMode(mode) {
            let siteModes = util.getValue('site_original_modes') || {};
            let host = location.host;
            siteModes[host] = mode;
            util.setValue('site_original_modes', siteModes);
        },

        // 检查是否启用负片反色模式
        isInvertModeEnabled() {
            return util.getValue('enable_invert_mode') === true;
        },

        // 添加额外样式 - 注入自定义CSS规则
        addExtraStyle() {
            try {
                return darkModeRule;
            } catch (e) {
                return '';
            }
        },

        // 创建深色滤镜 - 生成SVG颜色滤镜
        createDarkFilter() {
            if (util.hasElementById('dark-mode-svg')) return;
            let svgDom = '<svg id="dark-mode-svg" style="height: 0; width: 0;"><filter id="dark-mode-filter" x="0" y="0" width="99999" height="99999"><feColorMatrix type="matrix" values="0.283 -0.567 -0.567 0 0.925 -0.567 0.283 -0.567 0 0.925 -0.567 -0.567 0.283 0 0.925 0 0 0 1 0"></feColorMatrix></filter><filter id="dark-mode-reverse-filter" x="0" y="0" width="99999" height="99999"><feColorMatrix type="matrix" values="0.333 -0.667 -0.667 0 1 -0.667 0.333 -0.667 0 1 -0.667 -0.667 0.333 0 1 0 0 0 1 0"></feColorMatrix></filter></svg>';
            let div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
            div.innerHTML = svgDom;
            let frag = document.createDocumentFragment();
            while (div.firstChild)
                frag.appendChild(div.firstChild);
            document.head.appendChild(frag);
        },

        // 创建深色样式 - 应用深色模式CSS
        createDarkStyle() {
            const isInvertMode = this.isInvertModeEnabled();

            let baseFilter = isInvertMode ?
                util.invertFilter :
            (this.isFirefox() ? util.firefoxFilter : util.filter);

            let reverseFilter = isInvertMode ?
                util.invertReverseFilter :
            (this.isFirefox() ? util.firefoxReverseFilter : util.reverseFilter);

            util.addStyle('dark-mode-style', 'style', `
                @media screen {
                    html {
                        ${baseFilter}
                        scrollbar-color: #454a4d #202324;
                    }

                    img,
                    video,
                    iframe,
                    canvas,
                    :not(object):not(body) > embed,
                    object,
                    svg image,
                    [style*="background:url"],
                    [style*="background-image:url"],
                    [style*="background: url"],
                    [style*="background-image: url"],
                    [background],
                    twitterwidget,
                    .sr-reader,
                    .no-dark-mode,
                    .sr-backdrop {
                        ${reverseFilter}
                    }

                    [style*="background:url"] *,
                    [style*="background-image:url"] *,
                    [style*="background: url"] *,
                    [style*="background-image: url"] *,
                    input,
                    [background] *,
                    img[src^="https://s0.wp.com/latex.php"],
                    twitterwidget .NaturalImage-image {
                        ${util.noneFilter}
                    }

                    /* 排除夜间模式按钮本身 */
                    #darkmode-container,
                    #darkmode-container * {
                        ${util.noneFilter} !important;
                    }

                    html {
                        text-shadow: 0 0 0 !important;
                    }

                    .no-filter,
                    :-webkit-full-screen,
                    :-webkit-full-screen *,
                    :-moz-full-screen,
                    :-moz-full-screen *,
                    :fullscreen,
                    :fullscreen * {
                        ${util.noneFilter}
                    }

                    ::-webkit-scrollbar {
                        background-color: #202324;
                        color: #aba499;
                    }
                    ::-webkit-scrollbar-thumb {
                        background-color: #454a4d;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background-color: #575e62;
                    }
                    ::-webkit-scrollbar-thumb:active {
                        background-color: #484e51;
                    }
                    ::-webkit-scrollbar-corner {
                        background-color: #181a1b;
                    }

                    html {
                        background: #fff !important;
                    }

                    ${this.addExtraStyle()}
                }

                @media print {
                    .no-print {
                        display: none !important;
                    }
                }`);
        },

        // 设置主题颜色 - 保存原始主题色
        setThemeColor() {
            util.setValue('origin_theme_color', util.getThemeColor());
        },

        // 启用深色模式 - 激活夜间模式
        enableDarkMode() {
            if (this.isFullScreen()) return;
            if (!this.isInvertModeEnabled()) {
                !this.isFirefox() && this.createDarkFilter();
            }
            this.createDarkStyle();
            util.addThemeColor('#131313');
        },

        // 禁用深色模式 - 恢复亮色模式
        disableDarkMode() {
            util.removeElementById('dark-mode-svg');
            util.removeElementById('dark-mode-style');
            util.addThemeColor(util.getValue('origin_theme_color'));
        },

        // 添加切换按钮 - 创建模式切换UI
        addButton() {
            if (this.isTopWindow()) {
                let buttonSize = util.getValue('button_size');
                let buttonPosition = util.getValue('button_position');
                let svgSize = parseInt(buttonSize * 0.6);
                let buttonWidth = +buttonSize + 2;

                let showMoon = true;
                let currentMode = this.getCurrentSiteMode();
                if (currentMode === this.shouldShow()) {
                    //
                    showMoon = false;
                } else {
                    //
                    showMoon = true;
                }

                // 根据当前模式设置初始背景颜色
                let backgroundColor = showMoon ? '#000000' : '#ffffff';
                let borderColor = showMoon ? '#333333' : '#f6f6f6';
                if (currentMode === 'light')
                {
                    backgroundColor = showMoon ? '#000000' : '#ffffff';
                    borderColor = showMoon ? '#333333' : '#f6f6f6';
                }
                else
                {
                    backgroundColor = showMoon ? '#ffffff' : '#000000';
                    borderColor = showMoon ? '#f6f6f6' : '#333333';
                }

                let html = `<div class="no-print" id="darkmode-container" style="position: fixed; ${buttonPosition}: -${buttonWidth / 2}px; bottom: 25px; cursor: pointer; z-index: 2147483647; user-select: none;">
            <div id="darkmode-button" style="width: ${buttonSize}px;height: ${buttonSize}px;background: ${backgroundColor};border:1px solid ${borderColor};display: flex;align-items: center;justify-content: center;border-radius: 50%;position: relative;">
                <svg fill="#009fe8" id="svg-moon" style="width: ${svgSize}px;height: ${svgSize}px;margin: 0;padding: 0;transition: transform 0.3s, opacity 0.3s;position: absolute;${showMoon ? 'transform: scale(1);opacity: 1;' : 'transform: scale(0);opacity: 0;'}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <path d="M587.264 104.96c33.28 57.856 52.224 124.928 52.224 196.608 0 218.112-176.128 394.752-393.728 394.752-29.696 0-58.368-3.584-86.528-9.728C223.744 832.512 369.152 934.4 538.624 934.4c229.376 0 414.72-186.368 414.72-416.256 1.024-212.992-159.744-389.12-366.08-413.184z"></path>
                </svg>
                <svg fill="#009fe8" id="svg-sun" style="width: ${svgSize}px;height: ${svgSize}px;margin: 0;padding: 0;transition: transform 0.3s, opacity 0.3s;position: absolute;${!showMoon ? 'transform: scale(1);opacity: 1;' : 'transform: scale(0);opacity: 0;'}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <path d="M234.24 512a277.76 277.76 0 1 0 555.52 0 277.76 277.76 0 1 0-555.52 0zM512 187.733a42.667 42.667 0 0 1-42.667-42.666v-102.4a42.667 42.667 0 0 1 85.334 0v102.826A42.667 42.667 0 0 1 512 187.733zm-258.987 107.52a42.667 42.667 0 0 1-29.866-12.373l-72.96-73.387a42.667 42.667 0 0 1 59.306-59.306l73.387 72.96a42.667 42.667 0 0 1 0 59.733 42.667 42.667 0 0 1-29.867 12.373zm-107.52 259.414H42.667a42.667 42.667 0 0 1 0-85.334h102.826a42.667 42.667 0 0 1 0 85.334zm34.134 331.946a42.667 42.667 0 0 1-29.44-72.106l72.96-73.387a42.667 42.667 0 0 1 59.733 59.733l-73.387 73.387a42.667 42.667 0 0 1-29.866 12.373zM512 1024a42.667 42.667 0 0 1-42.667-42.667V878.507a42.667 42.667 0 0 1 85.334 0v102.826A42.667 42.667 0 0 1 512 1024zm332.373-137.387a42.667 42.667 0 0 1-29.866-12.373l-73.387-73.387a42.667 42.667 0 0 1 0-59.733 42.667 42.667 0 0 1 59.733 0l72.96 73.387a42.667 42.667 0 0 1-29.44 72.106zm136.96-331.946H878.507a42.667 42.667 0 0 1 0-85.334h102.826a42.667 42.667 0 0 1 0 85.334zM770.987 295.253a42.667 42.667 0 0 1-29.867-12.373 42.667 42.667 0 0 1 0-59.733l73.387-72.96a42.667 42.667 0 1 1 59.306 59.306l-72.96 73.387a42.667 42.667 0 0 1-29.866 12.373z"></path>
                </svg>
            </div>
        </div>`;

                document.body.insertAdjacentHTML('beforeend', html);

                let containerDOM = document.getElementById('darkmode-container');
                let buttonDOM = document.getElementById('darkmode-button');
                let moonDOM = document.getElementById('svg-moon');
                let sunDOM = document.getElementById('svg-sun');

                util.hover(containerDOM, () => {
                    containerDOM.style[buttonPosition] = '0px';
                    containerDOM.style.transition = `${buttonPosition} 0.3s`
        }, () => {
                    containerDOM.style[buttonPosition] = `-${buttonWidth / 2}px`;
                    containerDOM.style.transition = `${buttonPosition} 0.3s`
        });

                buttonDOM.addEventListener("click", () => {

                    let currentMode = this.getCurrentSiteMode();
                    if (currentMode === 'light') {
                        this.switchToDarkMode(moonDOM, sunDOM);
                    } else {
                        this.switchToLightMode(moonDOM, sunDOM);
                    }
                    if (this.getCurrentSiteMode() === this.shouldShow()) {
                        //
                        moonDOM.style.transform = 'scale(0)';
                        moonDOM.style.opacity = '0';
                        sunDOM.style.transform = 'scale(1)';
                        sunDOM.style.opacity = '1';
                    } else {
                        //
                        moonDOM.style.transform = 'scale(1)';
                        moonDOM.style.opacity = '1';
                        sunDOM.style.transform = 'scale(0)';
                        sunDOM.style.opacity = '0';
                    }
                });
            }
        },

        // 切换到深色模式 - 更新界面状态
        switchToDarkMode(moonDOM, sunDOM) {
            this.setCurrentSiteMode('dark');
            this.enableDarkMode();
        },

        // 切换到亮色模式 - 更新界面状态
        switchToLightMode(moonDOM, sunDOM) {
            this.setCurrentSiteMode('light');
            this.disableDarkMode();

        },

        // 检测亮色主题 - 分析页面颜色模式
        isLight() {
            let darkTextCount = 0;
            let lightTextCount = 0;
            let totalSamples = 0;

            try {
                // 方法1: 随机采样页面中的文本元素
                const textSelectors = [
                    'p', 'span', 'div', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'li', 'td', 'th', 'label', 'button'
                ];

                // 从每种选择器中取多个样本
                for (let selector of textSelectors)
                {
                    const elements = document.querySelectorAll(selector);
                    // 每种类型最多取5个样本，避免过度偏向某种元素
                    const maxSamples = Math.min(elements.length, 5);

                    for (let i = 0; i < maxSamples; i++)
                    {
                        try {
                            const el = elements[i];
                            if (!el || !el.offsetParent) continue; // 跳过隐藏元素

                            const color = getComputedStyle(el).color;
                            const rgb = color.match(/\d+/g);
                            if (rgb && rgb.length >= 3)
                            {
                                const luminance = 0.299 * parseInt(rgb[0]) + 0.587 * parseInt(rgb[1]) + 0.114 * parseInt(rgb[2]);
                                totalSamples++;

                                if (luminance > 180) { // 很亮的文本
                                    lightTextCount++;
                                } else if (luminance < 100) { // 很暗的文本
                                    darkTextCount++;
                                }
                                // 中等亮度文本不计入统计
                            }
                        } catch (e) {}
                    }
                }
            } catch (e) {}

            const isDark = lightTextCount > darkTextCount;
            return isDark ? 'dark' : 'light';
        },

        // 判断显示月亮图标 - 确定按钮初始状态
        shouldShow() {
            let host = location.host;

            const knownDarkSites = [
                'twitter.com',
                'x.com',
                'reddit.com',
                'notion.so',
                'linear.app',
                'figma.com',
                'spotify.com',
                'netflix.com',
                'twitch.tv',
                'discord.com',
                'telegram.org',
                'leetcode.com',
                'stackoverflow.com',
                'gitlab.com',
                'medium.com'
            ];

            const knownLightSites = [
                'bing.com',
                'google.com',
                'baidu.com',
                'zhihu.com',
                'weibo.com',
                'bilibili.com',
                'taobao.com',
                'jd.com',
                'qq.com',
                '163.com',
                'douban.com',
                'apple.com',
                'microsoft.com',
                'wikipedia.org',
                'cnn.com',
                'nytimes.com',
                'facebook.com',
                'instagram.com',
                'linkedin.com',
                'amazon.com',
                'w3schools.com',
                'csdn.net'
            ];

            for (let site of knownDarkSites) {
                if (host.includes(site)) {
                    return 'dark';
                }
            }

            for (let site of knownLightSites) {
                if (host.includes(site)) {
                    return 'light';
                }
            }

            let original = this.getOriginalSiteMode();
            if (original === null)
            {
                original = this.isLight();
                this.setOriginalSiteMode(original);
            }
            return original;
        },

        // 获取颜色亮度 - 计算颜色明度值
        getColorBrightness(color) {
            let rgb = color.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                return (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            }
            return 255;
        },

        // 检测网站视觉亮色 - 分析页面背景色
        isSiteVisuallyLight() {
            try {
                let bodyStyle = window.getComputedStyle(document.body);
                let bgColor = bodyStyle.backgroundColor;

                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                    let rgb = bgColor.match(/\d+/g);
                    if (rgb && rgb.length >= 3) {
                        let brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                        return brightness >= 128;
                    }
                }

                let htmlStyle = window.getComputedStyle(document.documentElement);
                let htmlBgColor = htmlStyle.backgroundColor;
                if (htmlBgColor && htmlBgColor !== 'rgba(0, 0, 0, 0)' && htmlBgColor !== 'transparent') {
                    let rgb = htmlBgColor.match(/\d+/g);
                    if (rgb && rgb.length >= 3) {
                        let brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                        return brightness >= 128;
                    }
                }

                return true;
            } catch (e) {
                return true;
            }
        },

        // 注册菜单命令 - 创建用户脚本菜单
        // 注册菜单命令 - 创建用户脚本菜单
        registerMenuCommand() {
            if (this.isTopWindow()) {
                let whiteList = util.getValue('exclude_list');
                let host = location.host;

                let currentMode = this.getCurrentSiteMode();

                if (whiteList.includes(host)) {
                    GM_registerMenuCommand(`💡 当前网站：❌ 排除`, () => {
                        let index = whiteList.indexOf(host);
                        whiteList.splice(index, 1);
                        util.setValue('exclude_list', whiteList);
                        history.go(0);
                    });
                } else {
                    GM_registerMenuCommand(`💡 当前网站：✔️ 启用`, () => {
                        whiteList.push(host);
                        util.setValue('exclude_list', Array.from(new Set(whiteList)));
                        history.go(0);
                    });
                }

                GM_registerMenuCommand('⚙️ 设置', () => {
                    let style = `
                                .darkmode-popup { font-size: 14px !important; }
                                .darkmode-center { display: flex;align-items: center; }
                                .darkmode-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 15px; }
                                .darkmode-setting-label-col { display: flex;align-items: flex-start;;padding-top: 15px;flex-direction:column }
                                .darkmode-setting-radio { width: 16px;height: 16px; }
                                .darkmode-setting-textarea { width: 100%; margin: 14px 0 0; height: 100px; resize: none; border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; color: #666; line-height: 1.2; }
                                .darkmode-setting-input { border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; width: 100px}
                                .darkmode-setting-switch { display: flex; align-items: center; }
                                .darkmode-switch { position: relative; display: inline-block; width: 50px; height: 24px; margin-left: 10px; }
                                .darkmode-switch input { opacity: 0; width: 0; height: 0; }
                                .darkmode-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
                                .darkmode-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
                                input:checked + .darkmode-slider { background-color: #2196F3; }
                                input:checked + .darkmode-slider:before { transform: translateX(26px); }
                                .darkmode-reset-btn { margin-top: 20px; padding: 8px 16px; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; color: #666; font-size: 14px; }
                                .darkmode-reset-btn:hover { background-color: #e9ecef; }
                            `;
                    util.addStyle('darkmode-style', 'style', style);
                    util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                    let excludeListStr = util.getValue('exclude_list').join('\n');
                    let isInvertModeEnabled = this.isInvertModeEnabled();

                    let dom = `<div style="font-size: 1em;">
                              <label class="darkmode-setting-label">按钮位置 <div id="S-Dark-Position" class="darkmode-center"><input type="radio" name="buttonPosition" ${util.getValue('button_position') === 'left' ? 'checked' : ''} class="darkmode-setting-radio" value="left">左 <input type="radio" name="buttonPosition" style="margin-left: 30px;" ${util.getValue('button_position') === 'right' ? 'checked' : ''} class="darkmode-setting-radio" value="right">右</div></label>
                              <label class="darkmode-setting-label"><span style="text-align: left;">按钮大小（默认：32）<small id="currentSize">当前：${util.getValue('button_size')}</small></span>
                              <input id="S-Dark-Size" type="range" class="darkmode-setting-range" min="20" max="50" step="2" value="${util.getValue('button_size')}">
                              </label>
                              <label class="darkmode-setting-label">
                                <span>启用负片反色模式</span>
                                <div class="darkmode-setting-switch">
                                  <label class="darkmode-switch">
                                    <input type="checkbox" id="S-Dark-Invert" ${isInvertModeEnabled ? 'checked' : ''}>
                                    <span class="darkmode-slider"></span>
                                  </label>
                                  <small style="margin-left: 10px; color: #666;">${isInvertModeEnabled ? '已启用' : '已关闭'}</small>
                                </div>
                              </label>
                              <label class="darkmode-setting-label-col">排除下列网址 <textarea placeholder="列表中的域名将不开启夜间模式，一行一个，例如：v.youku.com" id="S-Dark-Exclude" class="darkmode-setting-textarea">${excludeListStr}</textarea></label>

                              <div style="text-align: center; margin-top: 20px;">
                                <button id="S-Dark-Reset" class="darkmode-reset-btn" type="button">🔄 重置为默认值</button>
                              </div>
                            </div>`;
                    Swal.fire({
                        title: '夜间模式配置',
                        html: dom,
                        icon: 'info',
                        showCloseButton: true,
                        confirmButtonText: '保存',
                        showCancelButton: true,
                        cancelButtonText: '取消',
                        customClass: {
                            popup: 'darkmode-popup',
                        },
                    }).then((res) => {
                        if (res.isConfirmed) {
                            history.go(0);
                        }
                    });

                    document.getElementById('S-Dark-Position').addEventListener('click', (e) => {
                        e.target.tagName === "INPUT" && util.setValue('button_position', e.target.value);
                    });
                    document.getElementById('S-Dark-Size').addEventListener('change', (e) => {
                        util.setValue('button_size', e.currentTarget.value);
                        document.getElementById('currentSize').innerText = '当前：' + e.currentTarget.value;
                    });
                    document.getElementById('S-Dark-Exclude').addEventListener('change', (e) => {
                        util.setValue('exclude_list', Array.from(new Set(e.currentTarget.value.split('\n').filter(Boolean))));
                    });
                    document.getElementById('S-Dark-Invert').addEventListener('change', (e) => {
                        util.setValue('enable_invert_mode', e.currentTarget.checked);
                        // 更新状态显示
                        const statusText = e.currentTarget.checked ? '已启用' : '已关闭';
                        e.currentTarget.parentElement.parentElement.querySelector('small').innerText = statusText;
                    });

                    // 添加重置按钮事件
                    document.getElementById('S-Dark-Reset').addEventListener('click', () => {
                        Swal.fire({
                            title: '确认重置',
                            text: '这将恢复所有设置为默认值，包括按钮位置、大小、排除列表等。确定要继续吗？',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: '确定重置',
                            cancelButtonText: '取消',
                            confirmButtonColor: '#d33',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                if (this.resetToDefaults()) {
                                    Swal.fire({
                                        title: '重置成功',
                                        text: '所有设置已恢复为默认值，页面将重新加载。',
                                        icon: 'success',
                                        confirmButtonText: '确定'
                                    }).then(() => {
                                        history.go(0);
                                    });
                                }
                            }
                        });
                    });
                });
            }
        },

        // 检查顶层窗口 - 验证窗口层级
        isTopWindow() {
            return window.self === window.top;
        },

        // 添加监听器 - 绑定事件处理
        addListener() {
            document.addEventListener("fullscreenchange", (e) => {
                if (this.isFullScreen()) {
                    this.disableDarkMode();
                } else {
                    this.isDarkMode() && this.enableDarkMode();
                }
            });
        },

        // 检查深色模式 - 判断当前模式状态
        isDarkMode() {
            return this.getCurrentSiteMode() === 'dark';
        },

        // 检查排除列表 - 验证站点权限
        isInExcludeList() {
            return util.getValue('exclude_list').includes(location.host);
        },

        // 检查全屏模式 - 检测全屏状态
        isFullScreen() {
            return document.fullscreenElement;
        },

        // 检查Firefox浏览器 - 判断浏览器类型
        isFirefox() {
            return /Firefox/i.test(navigator.userAgent);
        },

        // 首次启用深色模式 - 延迟初始化功能
        firstEnableDarkMode() {
            let retryCount = 0;
            const maxRetries = 5;

            const initDarkMode = () => {
                try {
                    if (this.isDarkMode()) {
                        this.enableDarkMode();
                    }

                    if (document.body && !util.hasElementById('darkmode-container')) {
                        this.addButton();
                    } else if (!document.body && retryCount < maxRetries) {
                        retryCount++;
                        setTimeout(initDarkMode, 200);
                    }
                } catch (error) {
                    console.log('Dark mode initialization error:', error);
                    if (retryCount < maxRetries) {
                        retryCount++;
                        setTimeout(initDarkMode, 200);
                    }
                }
            };

            // 如果文档已经加载完成，直接初始化
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(initDarkMode, 100);
                });
            } else {
                setTimeout(initDarkMode, 100);
            }

            // 额外的观察器确保在动态内容加载后也能工作
            const headObserver = new MutationObserver(() => {
                if (this.isDarkMode() && !util.hasElementById('dark-mode-style')) {
                    this.enableDarkMode();
                }
            });
            headObserver.observe(document.head, { childList: true, subtree: true });

            // 确保body存在后再添加按钮
            if (!document.body) {
                const bodyObserver = new MutationObserver(() => {
                    if (document.body) {
                        bodyObserver.disconnect();
                        setTimeout(() => {
                            if (!util.hasElementById('darkmode-container')) {
                                this.addButton();
                            }
                        }, 100);
                    }
                });
                bodyObserver.observe(document, { childList: true, subtree: true });
            }
        },

        // 初始化主函数 - 脚本入口点
        init() {
            this.initValue();// 初始化默认配置值
            this.setThemeColor();// 保存原始主题颜色
            this.registerMenuCommand();// 注册用户脚本菜单命令
            if (this.isInExcludeList()) return;// 检查是否在排除列表中
            this.addListener();// 添加事件监听器

            // 确保在页面完全加载后执行
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.firstEnableDarkMode();
                });
            } else {
                this.firstEnableDarkMode();
            }
        }


    };
    main.init();
})();