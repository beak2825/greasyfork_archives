// ==UserScript==
// @name         Tools Extension
// @namespace    https://github.com/aoi-umi
// @version      0.0.3
// @description  tools插件
// @author       aoi-umi
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @require https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562526/Tools%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/562526/Tools%20Extension.meta.js
// ==/UserScript==
(function () {
	'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var lib = {};

	var utils = {};

	var hasRequiredUtils;

	function requireUtils () {
		if (hasRequiredUtils) return utils;
		hasRequiredUtils = 1;
		Object.defineProperty(utils, "__esModule", { value: true });
		utils.throttle = throttle;
		utils.isElementAtPoint = isElementAtPoint;
		utils.formatTime = formatTime;
		function throttle(func, wait, options) {
		    let context, args, result;
		    let timeout = null;
		    let previous = 0;
		    if (!options)
		        options = {
		            trailing: false,
		        };
		    let later = function () {
		        previous = options.leading === false ? 0 : Date.now();
		        timeout = null;
		        result = func.apply(context, args);
		        if (!timeout)
		            context = args = null;
		    };
		    return function () {
		        let now = Date.now();
		        if (!previous && options.leading === false)
		            previous = now;
		        let remaining = wait - (now - previous);
		        context = this;
		        args = arguments;
		        if (remaining <= 0 || remaining > wait) {
		            if (timeout) {
		                clearTimeout(timeout);
		                timeout = null;
		            }
		            previous = now;
		            result = func.apply(context, args);
		            if (!timeout)
		                context = args = null;
		        }
		        else if (!timeout && options.trailing !== false) {
		            timeout = setTimeout(later, remaining);
		        }
		        return result;
		    };
		}
		function isElementAtPoint(el, x, y) {
		    var rect = el.getBoundingClientRect();
		    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
		}
		function formatTime(seconds) {
		    const h = Math.floor(seconds / 3600);
		    const m = Math.floor((seconds % 3600) / 60);
		    const s = Math.floor(seconds % 60);
		    let hourStr = "";
		    if (h > 0) {
		        hourStr = `${String(h).padStart(2, "0")}:`;
		    }
		    return `${hourStr}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
		}
		
		return utils;
	}

	var menu = {};

	var icons = {};

	var ArrowRight = {};

	var hasRequiredArrowRight;

	function requireArrowRight () {
		if (hasRequiredArrowRight) return ArrowRight;
		hasRequiredArrowRight = 1;
		Object.defineProperty(ArrowRight, "__esModule", { value: true });
		ArrowRight.default = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <path
    fill="currentColor"
    d="M340.864 149.312a30.59 30.59 0 0 0 0 42.752L652.736 512 340.864 831.872a30.59 30.59 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
  ></path>
</svg>
`;
		
		return ArrowRight;
	}

	var hasRequiredIcons;

	function requireIcons () {
		if (hasRequiredIcons) return icons;
		hasRequiredIcons = 1;
		(function (exports$1) {
			Object.defineProperty(exports$1, "__esModule", { value: true });
			exports$1.ArrowRight = void 0;
			var ArrowRight_1 = requireArrowRight();
			Object.defineProperty(exports$1, "ArrowRight", { enumerable: true, get: function () { return ArrowRight_1.default; } });
			
		} (icons));
		return icons;
	}

	var hasRequiredMenu;

	function requireMenu () {
		if (hasRequiredMenu) return menu;
		hasRequiredMenu = 1;
		Object.defineProperty(menu, "__esModule", { value: true });
		menu.Menu = void 0;
		const utils = requireUtils();
		const icons_1 = requireIcons();
		class Menu {
		    get floatMenuName() {
		        return `${this.prefix}float-menu`;
		    }
		    get defaultMenuName() {
		        return `${this.prefix}default-menu`;
		    }
		    get contextMenuName() {
		        return `${this.prefix}context-menu`;
		    }
		    get contextMenuItemName() {
		        return `${this.prefix}context-menu-item`;
		    }
		    get moreName() {
		        return `${this.prefix}more`;
		    }
		    get iconName() {
		        return `${this.prefix}icon`;
		    }
		    constructor(opt) {
		        this.prefix = "";
		        this.isUsingOriginalMenu = false;
		        this.isTriggeringContextMenu = false;
		        opt = { ...opt };
		        this.prefix = opt.prefix || "";
		        this.initStyle();
		        this.initEvents();
		    }
		    initStyle() {
		        let { floatMenuName, defaultMenuName, contextMenuName, moreName, iconName, } = this;
		        let style = jQuery("<style></style>").text(`
      .${floatMenuName} {
      display: none;
      min-width: 100px;
      min-height: 20px;
      position: fixed;
      z-index: 900000;
    }
    .${defaultMenuName} {
      background: white;
      padding: 15px 15px;
      cursor: pointer;
      border-radius: 5px;
      box-shadow: 1px 1px 5px #888888;
    }
    .${contextMenuName} {
      padding: 5px 0;
      font-size: 12px;
      color: black;
      text-shadow: none;
    }
    .${contextMenuName} > * {
      padding: 5px 10px;
      display: flex;
      align-items: center;
    }

    .${moreName} {
      font-size: 16px;
    }
    .${iconName} {
      height: 1em;
      width: 1em;
      line-height: 1em;
    }
    `);
		        jQuery("head").append(style);
		    }
		    initEvents() {
		        let that = this;
		        jQuery(document).on("click", function () {
		            that.getMenus().remove();
		        });
		        jQuery(document).on("click mouseenter mouseleave", `.${this.contextMenuItemName}`, function (e) {
		            var _a;
		            let dom = jQuery(this);
		            let item = dom.data("item");
		            if (e.type === "click")
		                that.handleMenuItemClick(item);
		            else if (e.type === "mouseenter") {
		                dom.css("background-color", "#bec8ff");
		                let level = dom.parent(`.${that.contextMenuName}`).data("level");
		                if ((_a = item.children) === null || _a === void 0 ? void 0 : _a.length) {
		                    let pos = {
		                        x: dom.offset().left + dom.outerWidth(),
		                        y: dom.offset().top,
		                    };
		                    that.createMenu(item.children, pos, level + 1);
		                }
		                else {
		                    that.getMenus().each(function () {
		                        let menuDom = jQuery(this);
		                        if (menuDom.data("level") > level) {
		                            menuDom.hide();
		                        }
		                    });
		                }
		            }
		            else if (e.type === "mouseleave")
		                dom.css("background-color", "");
		        });
		    }
		    getClickPos(event) {
		        return {
		            x: event.x || 0,
		            y: event.y || 0,
		        };
		    }
		    showContextMenu(opt) {
		        let { event } = opt;
		        if (!event)
		            return;
		        let pos = this.getClickPos(event);
		        let list = [];
		        // list.push({
		        //   text: "测试",
		        //   key: "test",
		        //   data: "test",
		        // });
		        if (opt.type === "video") {
		            let video = opt.el || event.target;
		            list.push({
		                text: "跳op/ed",
		                key: "skipOpOrEd",
		                fn: () => {
		                    let time = 80;
		                    video.currentTime += time;
		                },
		            });
		            list.push({
		                text: "倍速",
		                key: "playSpeed",
		                children: [0.5, 1, 1.3, 1.5, 2, 4].map((ele) => {
		                    return {
		                        text: `${ele}`,
		                        key: `playSpeed_${ele}`,
		                        fn: () => {
		                            video.playbackRate = ele;
		                        },
		                    };
		                }),
		            });
		            let currentTimeStr = utils.formatTime(Math.round(video.currentTime));
		            list.push({
		                text: `复制当前时间 (${currentTimeStr})`,
		                key: "copyCurrentTime",
		                fn: () => {
		                    navigator.clipboard.writeText(currentTimeStr);
		                },
		            });
		        }
		        else if (opt.type === "danmaku") {
		            let video = opt.el || event.target;
		            list.push({
		                text: `空降到 ${opt.data.timeStr}`,
		                key: "setCurrentTime",
		                fn: () => {
		                    video.currentTime = opt.data.time;
		                },
		            });
		        }
		        list.push({
		            text: "原菜单",
		            key: "originalMenu",
		            fn: () => {
		                this.isUsingOriginalMenu = true;
		                this.conetextMenuHandler({ event });
		            },
		        });
		        list.push({
		            text: "关闭",
		            key: "close",
		        });
		        if (list.length) {
		            this.createMenu(list, pos);
		            return true;
		        }
		    }
		    getMenus() {
		        return jQuery(`.${this.contextMenuName}`);
		    }
		    getMenu(level = 0) {
		        let menu = jQuery(`.${this.contextMenuName}[data-level=${level}]`);
		        if (!menu.length) {
		            menu = jQuery(`<div class="${this.contextMenuName} ${this.floatMenuName} ${this.defaultMenuName}" data-level=${level}></div>`);
		            let target = document.fullscreenElement || document.body;
		            jQuery(target).append(menu);
		        }
		        return menu;
		    }
		    createMenu(item, pos, level = 0) {
		        let menu = this.getMenu(level);
		        menu
		            .css({
		            left: pos.x + "px",
		            top: pos.y + "px",
		        })
		            .empty()
		            .append(item.map((ele) => {
		            var _a;
		            let dom = jQuery([
		                `<div class="${this.contextMenuItemName}">`,
		                `${ele.text}`,
		                ((_a = ele.children) === null || _a === void 0 ? void 0 : _a.length) &&
		                    `<span style="flex: 1;"></span><i class="${this.moreName} ${this.iconName}">${icons_1.ArrowRight}</i>`,
		                "</div>",
		            ].join(""));
		            dom.data("item", ele);
		            return dom;
		        }))
		            .show();
		    }
		    handleMenuItemClick(item) {
		        item.fn && item.fn();
		    }
		    conetextMenuHandler(opt) {
		        if (this.isUsingOriginalMenu) {
		            this.triggerContextMenu(opt.event);
		            this.isUsingOriginalMenu = false;
		            return true;
		        }
		        opt.event.stopPropagation();
		        opt.event.preventDefault();
		        this.showContextMenu(opt);
		    }
		    triggerContextMenu(event) {
		        var _a;
		        if (this.isTriggeringContextMenu)
		            return;
		        this.isTriggeringContextMenu = true;
		        const newEvent = new PointerEvent("contextmenu", {
		            bubbles: true,
		            cancelable: true,
		            clientX: event.clientX,
		            clientY: event.clientY,
		        });
		        (_a = event.target) === null || _a === void 0 ? void 0 : _a.dispatchEvent(newEvent);
		        this.isTriggeringContextMenu = false;
		    }
		}
		menu.Menu = Menu;
		
		return menu;
	}

	var hasRequiredLib;

	function requireLib () {
		if (hasRequiredLib) return lib;
		hasRequiredLib = 1;
		Object.defineProperty(lib, "__esModule", { value: true });
		jQuery.noConflict();
		const utils = requireUtils();
		const menu_1 = requireMenu();
		class ToolsExtension {
		    constructor() {
		        this.prefix = "tools-";
		        this.init();
		    }
		    init() {
		        // 等待原网站css js加载
		        setTimeout(() => {
		            this.menu = new menu_1.Menu({ prefix: this.prefix });
		            this.bindEvents();
		            console.log("ToolsExtension initialized");
		        }, 1000);
		    }
		    getVideoAtPoint(pos) {
		        return jQuery("video")
		            .toArray()
		            .find((video) => {
		            return utils.isElementAtPoint(video, pos.x, pos.y);
		        });
		    }
		    getDanmakuAtPoint(pos) {
		        let danmaku;
		        // 获取弹幕容器
		        ["danmaku", "danmuku"].find((key) => {
		            let dom = jQuery(`[class*="${key}"]:eq(0)`)[0];
		            if (dom) {
		                danmaku = {
		                    key,
		                    dom,
		                };
		                return true;
		            }
		        });
		        if (!danmaku)
		            return;
		        // 同级或子级查找弹幕
		        return [
		            ...jQuery(danmaku.dom).siblings(":visible").toArray(),
		            ...jQuery(danmaku.dom).children(":visible").toArray(),
		        ].find((el) => {
		            let dom = jQuery(el);
		            return (parseFloat(dom.css("opacity")) > 0 &&
		                el.clientHeight < 50 &&
		                utils.isElementAtPoint(el, pos.x, pos.y));
		        });
		    }
		    bindEvents() {
		        document.addEventListener("contextmenu", (event) => {
		            let isVideo = jQuery(event.target).is("video");
		            let _video = this.getVideoAtPoint(event);
		            let video = isVideo ? event.target : _video;
		            if (!video)
		                return;
		            let opt = { event, type: "video", el: video, data: null };
		            let danmaku = this.getDanmakuAtPoint(event);
		            if (danmaku) {
		                let matchRs = /((?<hour>[\d]+):)?(?<minute>[\d]+):(?<second>[\d]+)/.exec(danmaku.innerText);
		                if (matchRs && matchRs.groups) {
		                    let hour = parseInt(matchRs.groups.hour || "0");
		                    let minute = parseInt(matchRs.groups.minute);
		                    let second = parseInt(matchRs.groups.second);
		                    // 不用管格式，直接加总秒数
		                    let time = hour * 3600 + minute * 60 + second;
		                    opt.type = "danmaku";
		                    opt.data = {
		                        timeStr: `${matchRs[0]}`,
		                        time,
		                    };
		                }
		            }
		            this.menu.conetextMenuHandler(opt);
		        }, true // 使用捕获阶段
		        );
		    }
		}
		window.tools = new ToolsExtension();
		
		return lib;
	}

	var libExports = requireLib();
	var index = /*@__PURE__*/getDefaultExportFromCjs(libExports);

	return index;

})();
