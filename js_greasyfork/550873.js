// ==UserScript==
// @name                视频网页全屏(改)
// @name:en             Maximize Video(Modify)
// @name:zh-CN          视频网页全屏(改)
// @name:zh-TW          視頻網頁全屏(改)
// @name:ja             ビデオページ全画面(変更)
// @name:ko             비디오 웹페이지 전체화면(수정)
// @namespace           https://greasyfork.org/zh-CN/users/178351-yesilin
// @description         让所有视频网页全屏，开启画中画功能，支持自定义按钮位置。
// @description:en      Maximize all video players.Support Piture-in-picture and custom button position.
// @description:zh-CN   让所有视频网页全屏，开启画中画功能，支持自定义按钮位置。
// @description:zh-TW   讓所有視頻網頁全屏，開啟子母畫面，支援自定義按鈕位置。
// @description:ja      すべての動画ページを全画面表示し、ピクチャ・イン・ピクチャ機能を有効にします。ボタン位置のカスタマイズにも対応しています。
// @description:ko      모든 비디오 웹페이지를 전체화면으로 전환하고, PIP(화면 속 화면) 기능과 사용자 지정 버튼 위치를 지원합니다.
// @author              冻猫, RyomaHan, YeSilin
// @include             *
// @exclude             *www.w3school.com.cn*
// @version             12.5.83
// @run-at              document-end
// @license             MIT
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM.setValue
// @grant               GM.getValue
// @icon                data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIGRhdGEtbmFtZT0i5Zu+5bGCIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDIwMCAxNTIuNiI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fS5jbHMtMntmaWxsOiMyMzE4MTU7fS5jbHMtM3tmaWxsOiMwNDAwMDA7fS5jbHMtNHtmaWxsOiNmNWM5MDA7fTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE3MCwxNzEuNDZIMjguMzhhOC42Miw4LjYyLDAsMCwxLTguNi04LjU5Vjc1LjA3QTIxLjU1LDIxLjU1LDAsMCwxLDQxLjI3LDUzLjU4SDE1Ny4xMmEyMS41NSwyMS41NSwwLDAsMSwyMS40OSwyMS40OXY4Ny44YTguNjIsOC42MiwwLDAsMS04LjYsOC41OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTIzLjcpIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTczLjEzLDE3Ni4zSDI3YTEyLjI0LDEyLjI0LDAsMCwxLTEyLjI1LTEyLjI1Vjc2LjM2QTI2Ljg3LDI2Ljg3LDAsMCwxLDQxLjU5LDQ5LjQ5SDE1OC40MWEyNi44NywyNi44NywwLDAsMSwyNi44NiwyNi44N3Y4Ny42OWExMi4wOCwxMi4wOCwwLDAsMS0xMi4xNCwxMi4yNVpNNDEuNTksNTYuMjZBMjAuMTQsMjAuMTQsMCwwLDAsMjEuNSw3Ni4zNnY4Ny42OUE1LjUsNS41LDAsMCwwLDI3LDE2OS41M0gxNzMuMTNhNS41LDUuNSwwLDAsMCw1LjQ4LTUuNDhWNzYuMzZhMjAuMTQsMjAuMTQsMCwwLDAtMjAuMS0yMC4xWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMjMuNykiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik02OC44OSwxMjEuMjhIMy4xMkEzLjEyLDMuMTIsMCwwLDEsMCwxMTguMTYsMywzLDAsMCwxLDMuMTIsMTE1SDY4Ljg5YTMuMTIsMy4xMiwwLDEsMSwwLDYuMjRabTEyOCwwaC02Ni4yYTMuMTIsMy4xMiwwLDEsMSwwLTYuMjRoNjYuMmEzLjEyLDMuMTIsMCwwLDEsMy4xMSwzLjEyQTMsMywwLDAsMSwxOTYuODgsMTIxLjI4Wm0tMTI4LDE1LjM2aC0zNmEzLjEyLDMuMTIsMCwxLDEsMC02LjIzaDM2YTMuMTIsMy4xMiwwLDEsMSwwLDYuMjNabTk4LDBIMTMwLjY4YTMuMTIsMy4xMiwwLDEsMSwwLTYuMjNIMTY2LjlhMy4xMiwzLjEyLDAsMCwxLDMuMTEsMy4xMkEzLDMsMCwwLDEsMTY2LjksMTM2LjY0Wk05MS4xMywxMjQuMDdhMTAsMTAsMCwwLDEtOC43LTUsMS4zMywxLjMzLDAsMSwxLDIuMjYtMS40LDcuNDgsNy40OCwwLDAsMCwxNC0zLjc2LDEuMjksMS4yOSwwLDEsMSwyLjU4LDAsMTAuMTgsMTAuMTgsMCwwLDEtMTAuMTEsMTAuMjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0yMy43KSIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEwOC42NSwxMjQuMDdBMTAuMDgsMTAuMDgsMCwwLDEsOTguNTUsMTE0YTEuMjksMS4yOSwwLDEsMSwyLjU4LDAsNy41NCw3LjU0LDAsMCwwLDcuNTIsNy41Miw3LjI3LDcuMjcsMCwwLDAsNi40NS0zLjc2LDEuMzMsMS4zMywwLDEsMSwyLjI2LDEuNCwxMC4xNSwxMC4xNSwwLDAsMS04LjcxLDQuOTRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0yMy43KSIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTYyLjMzLDk4LjkzYTguNzEsOC43MSwwLDAsMCwxNy40MSwwaDBhOC43MSw4LjcxLDAsMCwwLTE3LjQxLDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0yMy43KSIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTEyMC4zNiw5OC45M2E4LjcxLDguNzEsMCwxLDAsOC43MS04LjcxQTguNzEsOC43MSwwLDAsMCwxMjAuMzYsOTguOTNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0yMy43KSIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEwMC4wNSw3Mi45MmEzLjYyLDMuNjIsMCwwLDEtMy42NS0zLjY1VjYxLjg1YTMuNjYsMy42NiwwLDAsMSw3LjMxLDB2Ny40MkEzLjYyLDMuNjIsMCwwLDEsMTAwLjA1LDcyLjkyWm0tMTQsMGEzLjYyLDMuNjIsMCwwLDEtMy42NS0zLjY1VjYxLjg1YTMuNjYsMy42NiwwLDAsMSw3LjMxLDB2Ny40MkEzLjYyLDMuNjIsMCwwLDEsODYuMDgsNzIuOTJabTI3Ljk0LDBhMy42MiwzLjYyLDAsMCwxLTMuNjUtMy42NVY2MS44NWEzLjY2LDMuNjYsMCwwLDEsNy4zMSwwdjcuNDJBMy42MiwzLjYyLDAsMCwxLDExNCw3Mi45MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTIzLjcpIi8+PHBhdGggY2xhc3M9ImNscy00IiBkPSJNMzkuMjMsNTIuODJzNC4wOC0yNS44OSwxOC0yNS44OVM3NS4xMiw1Mi44Miw3NS4xMiw1Mi44MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTIzLjcpIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNzUuMTIsNTUuOTRIMzkuMjNhMy4wNywzLjA3LDAsMCwxLTIuMzYtMS4wNywzLjE0LDMuMTQsMCwwLDEtLjc2LTIuNThjLjIyLTEuMTksNC43My0yOC41OSwyMS4wNy0yOC41OVM3OCw1MS4xLDc4LjI0LDUyLjI5YTMuMzUsMy4zNSwwLDAsMS0uNzUsMi41OEEzLjEsMy4xLDAsMCwxLDc1LjEyLDU1Ljk0Wm0tMzItNi4yM0g3MS4yNUM2OS40Myw0Mi4wOCw2NC45MSwzMCw1Ny4xOCwzMCw0OSwzMCw0NC43MSw0My4xNSw0My4xLDQ5LjcxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMjMuNykiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xMjQuNjYsNTIuODJzNC4wOS0yNS44OSwxOC0yNS44OSwxNy45NSwyNS44OSwxNy45NSwyNS44OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTIzLjcpIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTYwLjQ1LDU1Ljk0SDEyNC41NmEzLjE2LDMuMTYsMCwwLDEtMy4xMi0zLjY1Yy4yMS0xLjE5LDQuNzMtMjguNTksMjEuMDYtMjguNTlzMjAuODUsMjcuNCwyMS4wNiwyOC41OWEzLjMxLDMuMzEsMCwwLDEtLjc1LDIuNThBMy4wNywzLjA3LDAsMCwxLDE2MC40NSw1NS45NFptLTMxLjkyLTYuMjNoMjguMTZDMTU0Ljg2LDQyLjA4LDE1MC4zNSwzMCwxNDIuNjEsMzAsMTM0LjMzLDMwLDEzMC4xNCw0My4xNSwxMjguNTMsNDkuNzFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0yMy43KSIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/550873/%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%28%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550873/%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%28%E6%94%B9%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 封装函数：自动兼容 GM4 (异步) 和其他管理器 (同步)
  async function GM_getValueAsync(key, defaultValue) {
    if (typeof GM_getValue === "function") {
      // Tampermonkey / Violentmonkey (同步 API)
      return GM_getValue(key, defaultValue);
    } else if (typeof GM !== "undefined" && GM.getValue) {
      // Greasemonkey 4.x (异步 API)
      return await GM.getValue(key, defaultValue);
    } else {
      console.warn("GM_getValue / GM.getValue 不可用");
      return defaultValue;
    }
  }
  async function GM_setValueAsync(key, value) {
    if (typeof GM_setValue === "function") {
      // Tampermonkey / Violentmonkey
      GM_setValue(key, value);
    } else if (typeof GM !== "undefined" && GM.setValue) {
      // Greasemonkey 4.x
      await GM.setValue(key, value);
    } else {
      console.warn("GM_setValue / GM.setValue 不可用");
    }
  }

  // 全局变量存储对象 (global variables)
  const gv = {
    // 状态标记类
    isFull: false, // 是否处于全屏状态
    isIframe: false, // 当前页面是否在 iframe 中
    useCssFullscreen: false, // 是否使用了 CSS 注入的网页全屏方式
    ytbStageChange: false, // YouTube 舞台模式切换标记
    autoCheckCount: 0, // 自动检测计数器

    // 播放器相关
    player: null, // 当前激活的视频播放器元素
    playerChilds: [], // 播放器子元素列表
    playerParents: [], // 播放器父元素列表
    backControls: null, // 全屏前视频控件状态
    restoreClick: null, // 恢复视频默认单击行为（旧版暂时保留）
    interceptor: null, // 视频事件拦截器
    videoOverlayContainer: null, // 移动 video 后的存放容器
    videoOverlayOriginalParent: null, // 移动 video 前的父元素

    // 页面结构备份
    backHtmlId: "", // 全屏前 html 元素的 ID
    backBodyId: "", // 全屏前 body 元素的 ID

    // 滚动与交互状态
    scrollTop: 0, // 保存进入全屏前的垂直滚动位置
    scrollLeft: 0, // 保存进入全屏前的水平滚动位置
    scrollFixTimer: null, // 滚动修正定时器
    mouseoverEl: null, // 鼠标悬停元素
    scrollLocker: null, // 滚动锁定

    // 按钮配置与元素
    btnText: {}, // 按钮文本（多语言支持）
    btnPosition: "top-right", // 按钮位置，默认右上角
    btnFullscreenToggle: null, // 网页全屏按钮
    btnPipToggle: null, // 画中画按钮
    leftBtn: null, // 左侧边缘退出网页全屏按钮
    rightBtn: null, // 右侧边缘退出网页全屏按钮

    // 界面元素
    contextMenu: null, // 右键菜单元素
  };

  // 异步初始化
  (async () => {
    gv.btnPosition = await GM_getValueAsync("buttonPosition", "top-right");
  })();

  // Html5播放器规则[播放器最外层]，适用于无法自动识别的自适应大小HTML5播放器
  // 键为域名，值为该域名下播放器元素的选择器对象
  const html5Rules = {
    "www.bilibili.com": {
      player: ["#bilibiliPlayer"],
      fullscreen: [".bpx-player-ctrl-web"],
      pip: [".bpx-player-ctrl-pip"],
    },
    "v.qq.com": {
      player: ["#player-container"],
      fullscreen: [".txp_btn_fake"],
      pip: [".txp_btn_pip"],
    },
    "www.youtube.com": {
      player: ["#ytd-player"],
    },
    "x.com": {
      player: ["video"],
    },
    "www.twitch.tv": {
      player: [".player"],
    },
    "www.huya.com": {
      player: ["#videoContainer"],
    },
    "www.douyu.com": {
      player: ["#js-player-video-case"],
    },
    "www.douyin.com": {
      player: [".xg-video-container video"],
      pip: [".xgplayer-pip"],
    },
    "www.acfun.cn": {
      player: ["#ACPlayer"],
      fullscreen: [".fullscreen-web"],
    },
    "www.miguvideo.com": {
      player: ["#mod-player"],
    },
    "www.yy.com": {
      player: ["#player"],
    },
    "v.huya.com": {
      player: ["#video_embed_flash>div"],
    },
    "*weibo.com": {
      player: ['[aria-label="Video Player"]', ".html5-video-live .html5-video", ".FeedPlayer_feedVideo_39PLs video"],
      fullscreen: ["#videoFull"],
    },
  };

  // 通用html5播放器选择器，用于匹配常见的视频播放器类名
  const generalPlayerRules = [
    ".dplayer",
    ".video-js",
    ".jwplayer",
    "[data-player]",
    ".art-video-player", // Artplayer.js
  ];

  // 判断当前页面是否在iframe中
  if (window.top !== window.self) {
    gv.isIframe = true;
  }

  // 根据浏览器语言设置按钮文本
  if (navigator.language.toLocaleLowerCase() == "zh-cn") {
    gv.btnText = {
      max: "网页全屏",
      maxTooltip: "切换网页全屏（ESC），右键选择按钮位置", // 悬浮提示
      pip: "画中画",
      pipTooltip: "切换画中画（F2），右键选择按钮位置", // 悬浮提示
      tip: "Iframe内视频，请用鼠标点击视频后重试",
      menuTitle: "选择按钮位置",
      topLeft: "左上角",
      topRight: "右上角",
    };
  } else {
    gv.btnText = {
      max: "Maximize",
      maxTooltip: "Toggle fullscreen (ESC). Right-click to choose button position", // 悬浮提示
      pip: "PicInPic",
      pipTooltip: "Toggle Picture-in-Picture (F2). Right-click to choose button position", // 悬浮提示
      tip: "Iframe video. Please click on the video and try again",
      menuTitle: "Choose Button Position",
      topLeft: "Top Left",
      topRight: "Top Right",
    };
  }

  // 工具函数集合
  const tool = {
    /**
     * 带时间戳的日志打印
     * @param {string} log - 日志内容
     */
    print(log) {
      const now = new Date();
      const format = (n) => String(n).padStart(2, "0");
      const timenow = `[${now.getFullYear()}-${format(now.getMonth() + 1)}-${format(now.getDate())} ${format(
        now.getHours()
      )}:${format(now.getMinutes())}:${format(now.getSeconds())}]`;
      console.log(`${timenow}[Maximize Video(Modify)] >`, log);
    },

    /**
     * 获取元素的位置信息
     * @param {HTMLElement} element - 目标元素
     * @returns {Object} 包含页面坐标和屏幕坐标的对象
     */
    getRect(element) {
      const rect = element.getBoundingClientRect();
      const scroll = tool.getScroll();
      return {
        pageX: rect.left + scroll.left, // 元素左上角在页面中的X坐标
        pageY: rect.top + scroll.top, // 元素左上角在页面中的Y坐标
        screenX: rect.left, // 元素左上角在视口中的X坐标
        screenY: rect.top, // 元素左上角在视口中的Y坐标
        width: rect.width,
        height: rect.height,
      };
    },

    /**
     * 判断元素是否接近全屏显示（宽或高接近视口，且位置符合全屏特征）
     * @param {HTMLElement} element - 目标元素
     * @param {Object} tolerance - 容差配置对象（可选）
     * @returns {boolean} 是否接近全屏显示
     */
    isNearFullscreen(element, tolerance = {}) {
      const {
        size = 20, // 尺寸接近容差（宽高）
        top = 10, // 顶部对齐容差
        left = 20, // 左侧对齐容差
        bottom = 1, // 底部可见容差
        right = 1, // 右侧可见容差
        center = 20, // 居中容差
      } = tolerance;
      const client = tool.getClient();
      const rect = element.getBoundingClientRect();
      const isWidthClose = Math.abs(client.width - rect.width) <= size;
      const isHeightClose = Math.abs(client.height - rect.height) <= size;
      const isTopAligned = rect.top <= top;
      const isLeftAligned = rect.left <= left;
      const isBottomVisible = rect.bottom <= client.height + bottom;
      const isRightVisible = rect.right <= client.width + right;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const isCentered =
        Math.abs(centerX - client.width / 2) <= center && Math.abs(centerY - client.height / 2) <= center;
      return (
        (isWidthClose || isHeightClose) &&
        isTopAligned &&
        isLeftAligned &&
        isBottomVisible &&
        isRightVisible &&
        isCentered
      );
    },

    /**
     * 获取页面滚动距离
     * @returns {Object} 包含左右和上下滚动距离的对象
     */
    getScroll() {
      return {
        left: document.documentElement.scrollLeft || document.body.scrollLeft,
        top: document.documentElement.scrollTop || document.body.scrollTop,
      };
    },

    /**
     * 获取视口尺寸
     * @returns {Object} 包含视口宽高的对象
     */
    getClient() {
      return {
        width: document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth,
        height:
          document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight,
      };
    },

    /**
     * 向页面添加CSS样式
     * @param {string} css - CSS样式字符串
     * @returns {HTMLElement} 创建的 style 元素
     */
    addStyle(css) {
      const style = document.createElement("style");
      style.className = "maximize-video-style";
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
      return style;
    },

    /**
     * 匹配字符串与规则（支持通配符*）
     * @param {string} str - 要匹配的字符串
     * @param {string} rule - 包含*的规则字符串
     * @returns {boolean} 是否匹配
     */
    matchRule(str, rule) {
      return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
    },

    /**
     * 创建按钮元素
     * @param {string} id - 按钮id
     * @param {string} title - 按钮提示文本
     * @param {Function} [clickHandler] - 可选的按钮点击事件处理函数
     * @returns {HTMLElement} 创建的按钮元素
     */
    createButton(id, title, clickHandler) {
      const btn = document.createElement("tbdiv");
      btn.id = id;
      btn.title = title; // 设置提示文本

      // 如果提供了点击处理函数，则绑定
      if (typeof clickHandler === "function") {
        btn.onclick = clickHandler;
      }
      document.body.appendChild(btn);
      return btn;
    },

    /**
     * 显示提示信息
     * @param {string} str - 提示文本
     * @returns {Promise} 提示显示完成的Promise
     */
    async addTip(str) {
      if (!document.getElementById("catTip")) {
        const tip = document.createElement("tbdiv");
        tip.id = "catTip";
        tip.innerHTML = str;
        tip.style.cssText =
          'transition: all 0.8s ease-out;background: none repeat scroll 0 0 #27a9d8;color: #FFFFFF;font: 1.1em "微软雅黑";margin-left: -250px;overflow: hidden;padding: 10px;position: fixed;text-align: center;bottom: 100px;z-index: 300;';
        document.body.appendChild(tip);
        tip.style.right = -tip.offsetWidth - 5 + "px";

        // 显示提示动画
        await new Promise((resolve) => {
          tip.style.display = "block";
          setTimeout(() => {
            tip.style.right = "25px";
            resolve("OK");
          }, 300);
        });

        // 停留一段时间
        await new Promise((resolve) => {
          setTimeout(() => {
            tip.style.right = -tip.offsetWidth - 5 + "px";
            resolve("OK");
          }, 3500);
        });

        // 移除提示元素
        await new Promise((resolve) => {
          setTimeout(() => {
            document.body.removeChild(tip);
            resolve("OK");
          }, 1000);
        });
      }
    },

    /**
     * 查找并触发网站原生按钮（网页全屏/画中画）
     * @param {string} type - 按钮类型，支持 'fullscreen' 或 'pip'
     * @returns {boolean} 是否找到并触发了原生按钮
     */
    triggerNativeButton(type, prompt) {
      const hostname = document.location.hostname;
      // 遍历规则匹配当前域名
      for (let domain in html5Rules) {
        const ruleSet = html5Rules[domain];
        if (
          tool.matchRule(hostname, domain) &&
          ruleSet.hasOwnProperty(type) &&
          Array.isArray(ruleSet[type]) &&
          ruleSet[type].length > 0
        ) {
          for (let selector of ruleSet[type]) {
            const nativeBtn = document.querySelector(selector);
            if (nativeBtn) {
              nativeBtn.click();
              tool.print(`优先使用 ${domain} 的原生${prompt}按钮`);
              return true;
            }
          }
          break;
        }
      }
      return false; // 未找到原生按钮
    },

    /**
     * 节流函数：控制函数在指定时间内最多执行一次
     * @param {Function} fn - 需要节流的函数
     * @param {number} delay - 延迟时间（毫秒），默认100ms
     * @returns {Function} 节流后的函数
     */
    throttle(fn, delay = 100) {
      let lastTime = 0;
      return function (...args) {
        const now = Date.now();
        if (now - lastTime > delay) {
          fn.apply(this, args); // 保持原函数的this和参数
          lastTime = now;
        }
      };
    },

    /**
     * 防抖函数：在事件停止触发一段时间后执行一次
     * @param {Function} fn - 要执行的函数
     * @param {number} delay - 延迟时间（毫秒），默认 300ms
     * @returns {Function} 防抖后的函数
     */
    debounce(fn, delay = 300) {
      let timer = null;
      return function (...args) {
        clearTimeout(timer); // 清除前一次等待
        timer = setTimeout(() => {
          fn.apply(this, args); // 执行最后一次触发
        }, delay);
      };
    },

    // 是否火狐浏览器
    isFirefox() {
      return navigator.userAgent.toLowerCase().includes("firefox");
    },

    /**
     * 创建视频事件拦截器对象
     * 用法：
     *   const interceptor = createVideoEventInterceptor();
     *   interceptor.intercept(video); // 开始拦截
     *   interceptor.restore();        // 恢复默认行为
     * @returns {Object} 包含 intercept 和 restore 方法的对象
     */
    createVideoEventInterceptor() {
      // 存储当前被拦截的视频元素
      let video = null;
      // 跟踪视频当前的播放状态（true: 播放中，false: 暂停，null: 未初始化）
      let isPlaying = null;
      // 存储已注册的事件处理器，用于后续移除（恢复默认行为时使用）
      const handlers = [];
      /**
       * 视频进入播放状态时的回调
       * 作用：更新isPlaying状态为true，同步视频实际播放状态
       */
      const onPlaying = () => {
        isPlaying = true;
      };
      /**
       * 视频进入暂停状态时的回调
       * 作用：更新isPlaying状态为false，同步视频实际播放状态
       */
      const onPause = () => {
        isPlaying = false;
      };
      /**
       * 拦截视频点击事件的处理器
       * 功能：
       * 1. 阻止事件冒泡和默认行为（如默认的播放/暂停控制）
       * 2. 初始化时通过视频当前时间和就绪状态判断初始播放状态
       * 3. 根据当前播放状态切换视频的播放/暂停（点击播放→暂停，点击暂停→播放）
       * @param {Event} e - 点击事件对象
       */
      const blockClick = (e) => {
        e.stopImmediatePropagation(); // 阻止事件进一步传播（包括其他同阶段的监听器）
        e.preventDefault(); // 阻止浏览器默认点击行为
        // 初始化判断：若未记录播放状态，通过视频当前时间（>0表示有播放过）和就绪状态（>2表示可播放）推断
        if (isPlaying === null) {
          isPlaying = video.currentTime > 0 && video.readyState > 2;
        }
        // 切换播放状态
        isPlaying ? video.pause() : video.play();
      };
      /**
       * 拦截视频双击事件的处理器
       * 功能：
       * 1. 阻止事件冒泡和默认行为
       * 2. 手动实现切换全屏
       * @param {MouseEvent} e - 双击事件对象
       */
      const onDoubleClick = (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        // 手动实现切换全屏
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          video.requestFullscreen();
        }
      };

      let toggleFlag = false;
      let cooling = false; // 是否处于冷却期
      const onMouseMove = (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        // 应对火狐浏览器的偏方
        if (tool.isFirefox()) {
          // 冷却期内，忽略事件
          if (cooling) return;
          // console.log(video.volume);
          // 立即触发一次
          if (toggleFlag) {
            if (video.volume === 0) {
              video.volume += 0.0000001;
            } else {
              video.volume -= 0.0000001;
            }
          } else {
            if (video.volume === 1) {
              video.volume -= 0.0000001;
            } else {
              video.volume += 0.0000001;
            }
          }
          toggleFlag = !toggleFlag;
          // 进入冷却期
          cooling = true;
          setTimeout(() => {
            cooling = false; // 冷却结束，允许下一次触发
          }, 500); // 冷却时间
        }
      };
      /**
       * 拦截视频滚轮事件的处理器（用于调节音量）
       * 功能：
       * 1. 阻止事件冒泡和默认行为（如页面滚动）
       * 2. 根据滚轮方向（上滚/下滚）调整视频音量，步长为0.1
       * 3. 限制音量范围在0（静音）到1（最大音量）之间
       * @param {WheelEvent} e - 滚轮事件对象
       */
      const adjustVolume = (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const delta = Math.sign(e.deltaY); // 获取滚轮方向：上滚为-1，下滚为1
        const step = 0.1; // 音量调节步长
        // 计算新音量并限制范围
        video.volume = Math.max(0, Math.min(1, video.volume - delta * step));
      };
      // 需要在捕获阶段拦截的事件列表
      const captureBlockedEvents = [
        // 鼠标
        "mouseenter", // 抖音
        "mouseleave", // 抖音
        // "mouseover",
        // "mouseout",
        // "mousemove",
        // "mousedown",
        // "mouseup",
        // "dblclick",
        // "contextmenu",
        // // 焦点与可视性
        // "focus",
        // "blur",
        "visibilitychange", // 抖音
        // // 触控
        // "touchstart",
        // "touchend",
        // "touchmove",
        // "touchcancel",
        // // 指针
        // "pointerenter",
        // "pointerleave",
        // "pointerover",
        // "pointerout",
        // "pointermove",
        "pointerdown", // 推特
        // "pointerup",
        // // 拖拽
        // "dragenter",
        // "dragleave",
        // "dragover",
        // "drop",
      ];
      // 需要在冒泡阶段拦截的事件列表
      const bubbleBlockedEvents = [];
      /**
       * 批量注册事件拦截器
       * 为指定事件列表添加处理器，阻止事件传播和默认行为，并记录处理器以便后续移除
       * @param {string[]} events - 要拦截的事件名称列表
       * @param {boolean} useCapture - 是否在捕获阶段监听事件（true: 捕获阶段，false: 冒泡阶段）
       */
      const registerBlockers = (events, useCapture) => {
        events.forEach((event) => {
          // 定义事件处理器：阻止传播和默认行为
          const handler = (e) => {
            e.stopImmediatePropagation();
            e.preventDefault();
          };
          // 在document上注册事件监听（使用指定的阶段）
          document.addEventListener(event, handler, useCapture);
          // 记录处理器信息，用于restore时移除
          handlers.push({ event, handler, useCapture });
        });
      };
      return {
        /**
         * 开始拦截指定视频元素的事件，启用自定义交互行为
         * @param {HTMLVideoElement} target - 要拦截的目标视频元素（必须是<video>标签）
         * @note 若已拦截其他视频元素，会先自动恢复之前的拦截状态
         */
        intercept(target) {
          // 校验目标元素是否为有效的video元素
          if (!target || target.nodeName !== "VIDEO") return;
          // 若已存在拦截的视频，先恢复其默认行为
          if (video) this.restore();
          // 初始化拦截状态
          video = target;
          isPlaying = null;
          // 为视频元素添加事件监听（使用捕获阶段确保优先拦截）
          video.addEventListener("playing", onPlaying); // 监听播放状态以同步isPlaying
          video.addEventListener("pause", onPause); // 监听暂停状态以同步isPlaying
          video.addEventListener("click", blockClick, true); // 拦截点击事件（捕获阶段）
          video.addEventListener("dblclick", onDoubleClick, true); // 捕获阶段拦截双击
          document.addEventListener("mousemove", onMouseMove, true); //
          video.addEventListener("wheel", adjustVolume, { passive: false, capture: true }); // 拦截滚轮事件（捕获阶段，非被动模式允许阻止默认）
          // 注册全局事件拦截器（捕获/冒泡阶段）
          registerBlockers(captureBlockedEvents, true);
          registerBlockers(bubbleBlockedEvents, false);
        },
        /**
         * 停止拦截，恢复视频元素的默认交互行为
         * 移除所有已注册的事件监听，清空拦截状态
         */
        restore() {
          // 若没有拦截的视频，直接返回
          if (!video) return;
          // 移除视频元素上的事件监听（注意第三个参数需与添加时一致）
          video.removeEventListener("playing", onPlaying);
          video.removeEventListener("pause", onPause);
          video.removeEventListener("click", blockClick, true);
          video.removeEventListener("dblclick", onDoubleClick, true);
          document.removeEventListener("mousemove", onMouseMove, true);
          video.removeEventListener("wheel", adjustVolume, true);
          // 移除document上注册的全局事件拦截器
          handlers.forEach(({ event, handler, useCapture }) => {
            document.removeEventListener(event, handler, useCapture);
          });
          // 清空处理器列表
          handlers.length = 0;
          // 重置拦截状态
          video = null;
          isPlaying = null;
        },
      };
    },

    // 创建滚动锁定器函数，用于控制页面滚动的锁定与解锁
    createScrollLocker() {
      // 用于标记当前是否处于滚动锁定状态（初始为未锁定）
      let locked = false;
      // 事件处理函数
      const handler = (e) => {
        e.preventDefault(); // 阻止事件的默认行为
      };
      // 锁定页面滚动的方法
      const lock = () => {
        if (locked) return; // 如果已处于锁定状态，则直接返回
        locked = true;
        // 为document添加鼠标滚轮事件监听（捕获阶段），阻止默认滚动
        // passive: false 允许在事件处理中调用preventDefault()
        // capture: true 表示在事件捕获阶段执行处理函数
        document.addEventListener("wheel", handler, { passive: false, capture: true });
        // 为document添加触摸滑动事件监听（捕获阶段），阻止移动端滑动
        document.addEventListener("touchmove", handler, { passive: false, capture: true });
      };
      // 解锁页面滚动的方法
      const unlock = () => {
        if (!locked) return; // 如果未处于锁定状态，则直接返回
        locked = false;
        // 移除document上的鼠标滚轮事件监听（需与添加时的capture参数一致）
        document.removeEventListener("wheel", handler, { capture: true });
        // 移除document上的触摸滑动事件监听（需与添加时的capture参数一致）
        document.removeEventListener("touchmove", handler, { capture: true });
      };
      // 返回包含锁定和解锁方法的对象，供外部调用
      return { lock, unlock };
    },
  };

  // 按钮设置相关方法
  const setButton = {
    /**
     * 初始化按钮
     */
    init() {
      if (!document.getElementById("btn-fullscreen-toggle")) {
        init();
      }
      if (tool.isNearFullscreen(gv.player)) {
        // 如果在iframe中且播放器接近全屏，向父窗口发送消息
        if (gv.isIframe) {
          window.parent.postMessage("iframeVideo", "*");
        }
        this.hide();
        return; // 都已经接近全屏了，就不提供全屏按钮了
      }
      this.show();
    },

    /**
     * 显示按钮并设置事件监听
     */
    show() {
      // 移除并重新添加鼠标离开事件监听，避免重复绑定
      gv.player.removeEventListener("mouseleave", handle.leavePlayer, false);
      gv.player.addEventListener("mouseleave", handle.leavePlayer, false);

      // 非全屏状态下添加滚动监听，用于修正按钮位置
      if (!gv.isFull) {
        document.removeEventListener("scroll", handle.scrollFix, false);
        document.addEventListener("scroll", handle.scrollFix, false);
      }
      gv.btnFullscreenToggle.classList.add("visible");

      // 支持画中画功能且播放器不是OBJECT/EMBED时显示画中画按钮
      if (document.pictureInPictureEnabled && gv.player.nodeName != "OBJECT" && gv.player.nodeName != "EMBED") {
        gv.btnPipToggle.classList.add("visible");
      }
      this.locate();
    },

    // 隐藏按钮
    hide() {
      gv.btnFullscreenToggle.classList.remove("visible");
      gv.btnPipToggle.classList.remove("visible");
    },

    /**
     * 定位按钮位置（基于播放器位置和用户设置）
     */
    locate() {
      let escapeHTMLPolicy;
      // 处理可信类型（Trusted Types）安全策略
      const hasTrustedTypes = Boolean(window.trustedTypes && window.trustedTypes.createPolicy);
      if (hasTrustedTypes) {
        escapeHTMLPolicy = window.trustedTypes.createPolicy("myEscapePolicy", {
          createHTML: (string, sink) => string,
        });
      }

      const playerRect = tool.getRect(gv.player);
      const client = tool.getClient();

      // 设置按钮样式和位置（根据用户配置）
      gv.btnFullscreenToggle.innerHTML = hasTrustedTypes ? escapeHTMLPolicy.createHTML(gv.btnText.max) : gv.btnText.max;

      gv.btnPipToggle.innerHTML = hasTrustedTypes ? escapeHTMLPolicy.createHTML(gv.btnText.pip) : gv.btnText.pip;

      // 根据用户设置的位置放置按钮
      if (gv.btnPosition === "top-left") {
        // 左上角位置
        // gv.btnFullscreenToggle.style.top = playerRect.screenY - gv.btnFullscreenToggle.offsetHeight + "px";
        gv.btnFullscreenToggle.style.top =
          playerRect.screenY === 0 ? "0px" : playerRect.screenY - gv.btnFullscreenToggle.offsetHeight + "px";
        gv.btnFullscreenToggle.style.left = playerRect.screenX + "px";

        gv.btnPipToggle.style.top = gv.btnFullscreenToggle.style.top;
        gv.btnPipToggle.style.left = playerRect.screenX + gv.btnFullscreenToggle.offsetWidth + 1 + "px";
      } else {
        // 右上角位置（默认）
        // gv.btnFullscreenToggle.style.top = playerRect.screenY - gv.btnFullscreenToggle.offsetHeight + "px";
        gv.btnFullscreenToggle.style.top =
          playerRect.screenY === 0 ? "0px" : playerRect.screenY - gv.btnFullscreenToggle.offsetHeight + "px";
        gv.btnFullscreenToggle.style.left =
          playerRect.screenX + gv.player.offsetWidth - gv.btnFullscreenToggle.offsetWidth + "px";

        gv.btnPipToggle.style.top = gv.btnFullscreenToggle.style.top;
        gv.btnPipToggle.style.left =
          parseFloat(gv.btnFullscreenToggle.style.left) - gv.btnPipToggle.offsetWidth - 1 + "px";
      }
    },
  };

  // 事件处理相关方法
  const handle = {
    /**
     * 获取鼠标悬停的播放器元素（优化版：仅从鼠标路径中筛选）
     * @param {MouseEvent} e - 鼠标事件对象
     */
    getPlayer(e) {
      if (gv.isFull) return;

      gv.mouseoverEl = e.target;

      // 忽略网页全屏与画中画按钮区域，避免按钮乱跳
      const ignoreIds = ["btn-fullscreen-toggle", "btn-pip-toggle"];
      if (ignoreIds.includes(e.target.id)) return;

      const hostname = document.location.hostname;
      const elements = document.elementsFromPoint(e.clientX, e.clientY);

      // 1. 优先使用站点特定规则匹配播放器
      for (let i in html5Rules) {
        if (tool.matchRule(hostname, i)) {
          for (let playerSelector of html5Rules[i].player) {
            for (let el of elements) {
              if (el.matches(playerSelector)) {
                gv.player = el;
                setButton.init();
                return;
              }
            }
          }
          break; // 匹配到站点规则后不再继续
        }
      }

      // 2. 使用通用规则匹配
      for (let generalPlayerRule of generalPlayerRules) {
        for (let el of elements) {
          if (el.matches(generalPlayerRule)) {
            gv.player = el;
            setButton.init();
            return;
          }
        }
      }

      // 3. 匹配 video 元素（尺寸足够大）
      for (let el of elements) {
        if (el.nodeName === "VIDEO" && el.offsetWidth > 399 && el.offsetHeight > 220) {
          gv.player = handle.findClosestVideoContainer(el);
          gv.autoCheckCount = 1;
          setButton.init();
          return;
        }
      }

      // 4. 兜底处理 VIDEO/OBJECT/EMBED（直接目标元素）
      switch (e.target.nodeName) {
        case "VIDEO":
        case "OBJECT":
        case "EMBED":
          if (e.target.offsetWidth > 399 && e.target.offsetHeight > 220) {
            gv.player = e.target;
            setButton.init();
            return;
          }
          break;
      }

      // 5. 未匹配到播放器，清除状态
      handle.leavePlayer(e);
    },

    /**
     * 自动识别最合适的视频容器（尺寸接近）
     * @param {HTMLElement} video - 视频元素
     * @param {number} tolerance - 尺寸容差（默认15px）
     * @returns {HTMLElement|null} 最合适的容器或 null
     */
    findClosestVideoContainer(video, tolerance = 15) {
      if (!video || video.nodeName !== "VIDEO") return null;
      const candidates = [video];
      let current = video;
      let bestMatch = null;
      while (current.parentElement) {
        current = current.parentElement;
        const dw = Math.abs(video.offsetWidth - current.offsetWidth);
        const dh = Math.abs(video.offsetHeight - current.offsetHeight);
        if (dw < tolerance && dh < tolerance) {
          candidates.push(current);
          bestMatch = current;
        } else {
          break; // 尺寸差距太大，停止向上查找
        }
      }
      gv.playerChilds = candidates;
      return bestMatch;
    },

    /**
     * 处理鼠标离开播放器的事件（隐藏按钮）
     */
    leavePlayer(e) {
      const { clientX, clientY } = e;
      const hoveredElements = document.elementsFromPoint(clientX, clientY);
      const isOverFullscreen = hoveredElements.includes(gv.btnFullscreenToggle);
      const isOverPip = hoveredElements.includes(gv.btnPipToggle);
      // 分别处理两个按钮的显隐
      if (!isOverFullscreen) {
        gv.btnFullscreenToggle.classList.remove("visible");
      }
      if (!isOverPip) {
        gv.btnPipToggle.classList.remove("visible");
      }
      // 如果两个都没悬停，说明彻底离开，清除监听
      if (!isOverFullscreen && !isOverPip) {
        gv.player?.removeEventListener("mouseleave", handle.leavePlayer, false);
        document.removeEventListener("scroll", handle.scrollFix, false);
      }
    },

    /**
     * 处理滚动事件（延迟修正按钮位置，避免频繁触发）
     */
    scrollFix(e) {
      clearTimeout(gv.scrollFixTimer);
      gv.scrollFixTimer = setTimeout(() => {
        setButton.locate();
      }, 20);
    },

    /**
     * 处理键盘快捷键
     * @param {KeyboardEvent} e - 键盘事件对象
     */
    hotKey(e) {
      // ESC键：切换全屏状态（默认）
      if (e.key === "Escape") {
        // 阻止事件传播和默认行为，避免网站监听到ESC键
        e.preventDefault(); // 阻止默认行为（如浏览器默认的ESC行为）
        e.stopImmediatePropagation(); // 阻止当前元素上的其他监听器执行
        maximize.playerControl();
      }
      // F2键：切换画中画（默认）
      if (e.code === "F2") {
        handle.pictureInPicture();
      }
    },

    /**
     * 处理鼠标中键点击事件
     * @param {MouseEvent} e - 鼠标事件对象
     */
    mouseMiddleClick(e) {
      // 中键点击（button=1）时触发
      if (e.button === 1) {
        // const clickedInsidePlayer = gv.player && gv.player.contains(e.target);
        // 改为鼠标穿透
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const clickedInsidePlayer = gv.player && elements.includes(gv.player);
        const isFullscreenActive = gv.isFull === true;
        // 如果点击在播放器内，或当前处于网页全屏状态，则触发控制逻辑
        if (clickedInsidePlayer || isFullscreenActive) {
          e.preventDefault(); // 阻止默认行为（如打开链接）
          e.stopPropagation(); // 阻止事件继续传递给视频元素
          maximize.playerControl(); // 切换网页全屏
        }
      }
    },

    /**
     * 处理跨窗口消息
     * @param {MessageEvent} e - 消息事件对象
     */
    async receiveMessage(e) {
      switch (e.data) {
        case "iframePicInPic":
          tool.print("messege:iframePicInPic");
          // 处理iframe中的画中画请求
          if (!document.pictureInPictureElement) {
            await document
              .querySelector("video")
              .requestPictureInPicture()
              .catch((error) => {
                tool.addTip(gv.btnText.tip);
              });
          } else {
            await document.exitPictureInPicture();
          }
          break;
        case "iframeVideo":
          tool.print("messege:iframeVideo");
          // 处理iframe中的视频全屏请求
          if (!gv.isFull) {
            gv.player = gv.mouseoverEl;
            setButton.init();
          }
          break;
        case "parentFull":
          tool.print("messege:parentFull");
          // 处理父窗口的全屏请求
          gv.player = gv.mouseoverEl;
          if (gv.isIframe) {
            window.parent.postMessage("parentFull", "*");
          }
          maximize.checkParent();
          maximize.fullWin();
          // 修正特定播放器的位置
          if (getComputedStyle(gv.player).left != "0px") {
            tool.addStyle(
              "#htmlToothbrush #bodyToothbrush .playerToothbrush {left:0px !important;width:100vw !important;}"
            );
          }
          gv.isFull = true;
          break;
        case "parentSmall":
          tool.print("messege:parentSmall");
          // 处理父窗口的退出全屏请求
          if (gv.isIframe) {
            window.parent.postMessage("parentSmall", "*");
          }
          maximize.smallWin();
          break;
        case "innerFull":
          tool.print("messege:innerFull");
          // 处理iframe内部的全屏请求
          if (gv.player.nodeName == "IFRAME") {
            gv.player.contentWindow.postMessage("innerFull", "*");
          }
          maximize.checkParent();
          maximize.fullWin();
          break;
        case "innerSmall":
          tool.print("messege:innerSmall");
          // 处理iframe内部的退出全屏请求
          if (gv.player.nodeName == "IFRAME") {
            gv.player.contentWindow.postMessage("innerSmall", "*");
          }
          maximize.smallWin();
          break;
      }
    },

    /**
     * 处理画中画功能切换
     */
    pictureInPicture() {
      // 优先使用网站原生画中画按钮（调用通用函数）
      if (tool.triggerNativeButton("pip", "画中画")) {
        return; // 找到并触发后终止
      }

      // 原有画中画逻辑
      if (!document.pictureInPictureElement) {
        if (gv.player) {
          if (gv.player.nodeName == "IFRAME") {
            // 向iframe发送画中画请求
            gv.player.contentWindow.postMessage("iframePicInPic", "*");
          } else {
            // 直接请求画中画
            gv.player.parentNode.querySelector("video").requestPictureInPicture();
          }
        } else {
          // 没有指定播放器时使用第一个video元素
          document.querySelector("video").requestPictureInPicture();
        }
      } else {
        // 退出画中画
        document.exitPictureInPicture();
      }
    },

    /**
     * 显示右键菜单
     * @param {MouseEvent} e - 鼠标事件对象
     */
    showContextMenu(e) {
      e.preventDefault();
      // 先移除已存在的菜单
      handle.hideContextMenu();

      // 创建菜单元素
      gv.contextMenu = document.createElement("div");
      gv.contextMenu.id = "btnContextMenu";

      // 添加菜单项
      const menuTitle = document.createElement("div");
      menuTitle.textContent = gv.btnText.menuTitle;
      gv.contextMenu.appendChild(menuTitle);

      // 左上角选项
      const topLeftItem = document.createElement("div");
      topLeftItem.textContent = gv.btnText.topLeft;
      topLeftItem.addEventListener("click", () => {
        handle.setButtonPosition("top-left");
        handle.hideContextMenu();
      });
      gv.contextMenu.appendChild(topLeftItem);

      // 右上角选项
      const topRightItem = document.createElement("div");
      topRightItem.textContent = gv.btnText.topRight;
      topRightItem.addEventListener("click", () => {
        handle.setButtonPosition("top-right");
        handle.hideContextMenu();
      });
      gv.contextMenu.appendChild(topRightItem);

      document.body.appendChild(gv.contextMenu);

      // 计算菜单位置，确保在视口内
      const client = tool.getClient();
      const menuRect = gv.contextMenu.getBoundingClientRect();

      // 初始位置在鼠标下方
      let left = e.clientX;
      let top = e.clientY;

      // 边界检测 - 水平方向
      if (left + menuRect.width > client.width) {
        left = client.width - menuRect.width;
      }

      // 边界检测 - 垂直方向
      if (top + menuRect.height > client.height) {
        top = client.height - menuRect.height;
      }

      // 应用位置
      gv.contextMenu.style.left = left + "px";
      gv.contextMenu.style.top = top + "px";

      // 点击页面其他地方关闭菜单
      document.addEventListener("click", handle.hideContextMenuOnce);
    },

    /**
     * 隐藏右键菜单
     */
    hideContextMenu() {
      if (gv.contextMenu && gv.contextMenu.parentNode) {
        document.body.removeChild(gv.contextMenu);
        gv.contextMenu = null;
      }
    },

    /**
     * 一次性隐藏菜单的事件处理
     */
    hideContextMenuOnce() {
      handle.hideContextMenu();
      document.removeEventListener("click", handle.hideContextMenuOnce);
    },

    /**
     * 设置按钮位置并保存
     * @param {string} position - 位置值 ('top-left' 或 'top-right')
     */
    setButtonPosition(position) {
      gv.btnPosition = position;
      // GM_setValue("buttonPosition", position);
      // setButton.locate(); // 重新定位按钮
      GM_setValueAsync("buttonPosition", position).then(() => {
        setButton.locate();
      });
    },
  };

  // 网页全屏相关方法
  const maximize = {
    /**
     * 播放器控制（切换全屏/进入或退出全屏）
     */
    playerControl() {
      if (!gv.player) {
        return;
      }

      // 优先使用网站原生全屏按钮
      if (!gv.useCssFullscreen && tool.triggerNativeButton("fullscreen", "网页全屏")) {
        // 如果当前状态是全屏就退出全屏
        if (gv.isFull) {
          gv.leftBtn.style.display = "none";
          gv.rightBtn.style.display = "none";
          gv.isFull = false; // 更新状态
        } else {
          gv.leftBtn.style.display = "block";
          gv.rightBtn.style.display = "block";
          gv.isFull = true; // 更新状态
        }
        return;
      }

      // 原有全屏逻辑（只有未使用网站按钮时才会执行）
      this.checkParent();
      if (!gv.isFull) {
        // 进入全屏
        if (gv.isIframe) {
          window.parent.postMessage("parentFull", "*");
        }
        if (gv.player.nodeName == "IFRAME") {
          gv.player.contentWindow.postMessage("innerFull", "*");
        }
        this.fullWin();

        // TODO 自动调整播放器容器（最多尝试10次）
        if (gv.autoCheckCount > 0 && !tool.isNearFullscreen(gv.playerChilds[0])) {
          if (gv.autoCheckCount > 10) {
            for (let v of gv.playerChilds) {
              v.classList.add("videoToothbrush");
            }
            return;
          }
          const tempPlayer = handle.findClosestVideoContainer(gv.playerChilds[0]);
          gv.autoCheckCount++;
          maximize.playerControl(); // 先退出
          gv.player = tempPlayer;
          maximize.playerControl(); // 再进入
        } else {
          gv.autoCheckCount = 0;
        }
      } else {
        // 退出全屏
        if (gv.isIframe) {
          window.parent.postMessage("parentSmall", "*");
        }
        if (gv.player.nodeName == "IFRAME") {
          gv.player.contentWindow.postMessage("innerSmall", "*");
        }
        this.smallWin();
      }
    },

    /**
     * 记录播放器的父元素链（用于退出全屏时恢复）
     */
    checkParent() {
      if (gv.isFull) {
        return;
      }
      gv.playerParents = [];
      let full = gv.player;
      // 遍历父节点直到body
      while ((full = full.parentNode)) {
        if (full.nodeName == "BODY") {
          break;
        }
        if (full.getAttribute) {
          gv.playerParents.push(full);
        }
      }
    },

    /**
     * 进入全屏状态
     */
    fullWin() {
      if (!gv.isFull) {
        // 移除鼠标悬停监听（全屏状态不需要）
        document.removeEventListener("mouseover", handle.getPlayer, false);
        // 锁定滚动
        gv.scrollLocker.lock();
        gv.backHtmlId = document.body.parentNode.id;
        gv.backBodyId = document.body.id;
        // 修改根元素id（用于CSS选择器定位）
        document.body.parentNode.id = "htmlToothbrush";
        document.body.id = "bodyToothbrush";

        // 如果播放器是 video 元素，那就当这个界面很复杂，用节点迁移实现全屏
        if (gv.player.nodeName == "VIDEO") {
          // 拦截事件
          gv.interceptor.intercept(gv.player);
          // 先储存一下原本的父元素
          gv.videoOverlayOriginalParent = gv.player.parentNode;
          gv.videoOverlayContainer = document.createElement("div");
          gv.videoOverlayContainer.style.position = "fixed";
          gv.videoOverlayContainer.style.top = "0";
          gv.videoOverlayContainer.style.left = "0";
          gv.videoOverlayContainer.style.width = "100vw";
          gv.videoOverlayContainer.style.height = "100vh";
          gv.videoOverlayContainer.style.zIndex = "2147483646";
          gv.videoOverlayContainer.style.background = "black";
          gv.videoOverlayContainer.style.display = "flex";
          gv.videoOverlayContainer.style.alignItems = "center";
          gv.videoOverlayContainer.style.justifyContent = "center";
          // 备份一下网站原生控制器
          gv.backControls = gv.player.controls;
          gv.player.controls = true;
          gv.player.classList.add("videoMigratorToothbrush");
          // 注入并显示
          gv.videoOverlayContainer.appendChild(gv.player);
          document.body.appendChild(gv.videoOverlayContainer);
          tool.print("当前页面复杂，使用节点迁移实现网页全屏");
        } else {
          // 不是太复杂的界面使用CSS注入实现全屏，以便可以使用网站原生控件
          this.addClass();
          tool.print("当前页面简单，使用样式注入实现网页全屏");
        }

        // 保存当前滚动位置
        gv.scrollTop = tool.getScroll().top;
        gv.scrollLeft = tool.getScroll().left;
        // 显示辅助按钮
        gv.leftBtn.style.display = "block";
        gv.rightBtn.style.display = "block";
        gv.btnFullscreenToggle.classList.remove("visible");
        gv.btnPipToggle.classList.remove("visible");

        const hostname = document.location.hostname;

        // YouTube特殊处理：切换剧院模式
        if (hostname.includes("www.youtube.com")) {
          const flexy = document.querySelector("#page-manager > ytd-watch-flexy");
          // 是否处于剧院模式
          const isTheaterMode =
            flexy && getComputedStyle(flexy).getPropertyValue("--ytd-watch-flexy-chat-max-height").trim() === "460px";
          // 不是剧院模式就自动进入宽屏模式
          if (!isTheaterMode) {
            document.querySelector("#movie_player .ytp-size-button").click();
            gv.ytbStageChange = true;
          }
          // 临时方案直接隐藏
          document.querySelector("#above-the-fold")?.style.setProperty("display", "none");
        }
      }
      gv.isFull = true;
      gv.useCssFullscreen = true;
    },

    /**
     * 为全屏状态添加样式类
     */
    addClass() {
      // 为父元素添加样式类
      for (let v of gv.playerParents) {
        v.classList.add("parentToothbrush");
        // 处理fixed定位的父元素（避免层级问题）
        if (getComputedStyle(v).position == "fixed") {
          v.classList.add("absoluteToothbrush");
        }
      }
      // 为播放器添加样式类
      gv.player.classList.add("playerToothbrush");
      // 确保video元素显示控件
      if (gv.player.nodeName == "VIDEO") {
        gv.backControls = gv.player.controls;
        gv.player.controls = true;
        gv.restoreClick = tool.videoEventInterceptor(gv.player); // 注入逻辑
      }
      // 触发resize事件（刷新播放器尺寸）
      window.dispatchEvent(new Event("resize"));
    },

    /**
     * 退出全屏状态（恢复原始状态）
     */
    smallWin() {
      // 恢复原始id
      document.body.parentNode.id = gv.backHtmlId;
      document.body.id = gv.backBodyId;
      if (gv.player.nodeName == "VIDEO") {
        // 恢复video到原本的父元素
        gv.videoOverlayOriginalParent.appendChild(gv.player);
        gv.videoOverlayContainer.remove();
        gv.player.classList.remove("videoMigratorToothbrush");
        gv.player.controls = gv.backControls;
        // 恢复事件
        gv.interceptor.restore();
      } else {
        // 移除父元素的样式类
        for (let v of gv.playerParents) {
          v.classList.remove("parentToothbrush");
          v.classList.remove("absoluteToothbrush");
        }
        // 移除播放器的样式类
        gv.player.classList.remove("playerToothbrush");
        // 恢复video控件状态
        if (gv.player.nodeName == "VIDEO") {
          gv.player.controls = gv.backControls;
          gv.restoreClick(); // 恢复原始点击行为
        }
      }

      // YouTube特殊处理：恢复剧院模式
      // if (document.location.hostname == "www.youtube.com" && gv.ytbStageChange) {
      //   document.querySelector("#movie_player .ytp-size-button").click();
      //   gv.ytbStageChange = false;
      // }
      if (document.location.hostname == "www.youtube.com") {
        if (gv.ytbStageChange) {
          document.querySelector("#movie_player .ytp-size-button").click();
          gv.ytbStageChange = false;
        }
        // 临时方案
        document.querySelector("#above-the-fold")?.style.setProperty("display", "block");
      }

      // 隐藏辅助按钮
      gv.leftBtn.style.display = "";
      gv.rightBtn.style.display = "";

      // 恢复鼠标悬停监听
      document.addEventListener("mouseover", handle.getPlayer, false);
      // 恢复滚动
      gv.scrollLocker.unlock();
      // 触发resize事件
      window.dispatchEvent(new Event("resize"));
      gv.isFull = false;
      gv.useCssFullscreen = false;
      // 最后恢复可能发生变化的滚动位置
      setTimeout(() => {
        window.scrollTo(gv.scrollLeft, gv.scrollTop);
      }, 0);
    },
  };

  /**
   * 初始化脚本
   */
  const init = () => {
    // 创建网页全屏按钮
    gv.btnFullscreenToggle = tool.createButton("btn-fullscreen-toggle", gv.btnText.maxTooltip, () => {
      maximize.playerControl();
    });
    gv.btnFullscreenToggle.addEventListener("contextmenu", handle.showContextMenu); // 添加右键菜单事件
    // 创建画中画按钮
    gv.btnPipToggle = tool.createButton("btn-pip-toggle", gv.btnText.pipTooltip, () => {
      handle.pictureInPicture();
    });
    gv.btnPipToggle.addEventListener("contextmenu", handle.showContextMenu); // 添加右键菜单事件
    // 创建左侧边缘退出按钮
    gv.leftBtn = tool.createButton("leftFullStackButton", "", () => {
      maximize.playerControl();
    });
    // 创建右侧边缘退出按钮
    gv.rightBtn = tool.createButton("rightFullStackButton", "", () => {
      maximize.playerControl();
    });

    // 确保全局样式只添加一次
    if (getComputedStyle(gv.btnFullscreenToggle).position != "fixed") {
      tool.addStyle(`
/* 主要针对滚动条 */
#htmlToothbrush,
#bodyToothbrush {
  scrollbar-width: none; /* Firefox 隐藏滚动条 */
  opacity: 1 !important;
}
#htmlToothbrush::-webkit-scrollbar,
#bodyToothbrush::-webkit-scrollbar {
  display: none; /* Chrome, Safari 隐藏滚动条 */
}

/* 父元素清障样式 */
#htmlToothbrush #bodyToothbrush .parentToothbrush {
  /* 只有当 position: static 时，z-index 的值即使不是 auto，也不会触发 stacking context */
  position: fixed !important;
  z-index: 2147483646 !important;
  /* 清除 transform，避免触发包含块影响 fixed 定位 */
  transform: none !important;
  /* 清除滤镜效果，同样会触发包含块 */
  filter: none !important;
  /* 清除 3D 透视属性，避免影响定位上下文 */
  perspective: none !important;
  /* 清除背景滤镜，避免触发新的渲染图层 */
  backdrop-filter: none !important;
  /* 禁止提前优化 transform，防止浏览器创建隔离层 */
  will-change: auto !important;
  /* 禁用布局隔离，避免阻断 fixed 元素继承视口定位 */
  contain: none !important;
  /* 关闭图层隔离，避免 stacking context 干扰 */
  isolation: auto !important;
  /* 禁用 3D transform 的子元素继承，恢复为 2D 渲染 */
  -webkit-transform-style: flat !important;
  /* 清除裁剪路径，避免 fixed 元素被遮挡或裁剪 */
  clip-path: none !important;
  /* 清除遮罩图层，避免 fixed 元素被遮挡 */
  mask: none !important;
  /* 禁用混合模式，防止 fixed 元素与背景发生视觉混合 */
  mix-blend-mode: normal !important;
  /* 恢复默认背面可见性，防止 3D 翻转影响渲染 */
  backface-visibility: visible !important;
  /* 恢复默认滚动行为，避免 overscroll 影响 fixed 元素交互 */
  overscroll-behavior: auto !important;
  /* 清除父级透明度，确保子元素视觉不被包裹影响 */
  opacity: 1 !important;
}

/* 修正fixed定位的父元素 */
#htmlToothbrush #bodyToothbrush .absoluteToothbrush {
  position: absolute !important;
}

/* 播放器元素全屏样式 */
#htmlToothbrush #bodyToothbrush .playerToothbrush {
  /* 固定定位，确保相对于视口而不是父元素定位 */
  position: fixed !important;
  /* 铺满整个视口宽高 */
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  /* 清除尺寸限制，确保播放器能真正铺满视口 */
  max-width: none !important;
  max-height: none !important;
  min-width: 0 !important;
  min-height: 0 !important;
  /* 清除边距和内边距，避免布局偏移 */
  margin: 0 !important;
  padding: 0 !important;
  /* 设置盒模型为 border-box，避免尺寸计算异常 */
  box-sizing: border-box;
  /* 清除边框，避免视觉干扰 */
  border: none !important;
  /* 设置背景色，防止底层内容透出 */
  background-color: black !important;
  /* 保证在所有元素之上显示（接近最大 z-index） */
  z-index: 2147483647 !important;
  /* 清除自身 transform，避免定位错乱 */
  transform: none !important;
  /* 清除滤镜效果，避免视觉异常 */
  filter: none !important;
  /* 清除 3D 透视影响 */
  perspective: none !important;
  /* 禁止提前优化 transform，避免触发包含块 */
  will-change: auto !important;
  /* 防止播放器被裁剪或遮罩 */
  clip-path: none !important;
  mask: none !important;
  /* 禁用混合模式，确保视觉纯净 */
  mix-blend-mode: normal !important;
  /* 限制布局影响范围，提升渲染性能 */
  contain: strict;
  /* 创建独立图层，避免混合模式污染 */
  isolation: isolate;
  /* 启用硬件加速，提升渲染性能 */
  backface-visibility: hidden;
  /* 禁用动画过渡，避免进入/退出全屏时出现闪烁或延迟 */
  transition: none !important;
  /* 清除圆角，避免触发图层重排或抗锯齿变化 */
  border-radius: 0 !important;
  cursor: default;
}

/* 视频内容适配 */
#htmlToothbrush #bodyToothbrush .parentToothbrush video {
  object-fit: contain !important;
}

/* 视频元素全屏样式 */
#htmlToothbrush #bodyToothbrush .parentToothbrush .videoToothbrush {
  width: 100vw !important;
  height: 100vh !important;
}

/* 迁移 video 的时候用这个样式 */
#htmlToothbrush #bodyToothbrush .videoMigratorToothbrush {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
}

/* 网页全屏按钮和画中画按钮样式 */
#btn-fullscreen-toggle,
#btn-pip-toggle {
  /* 布局定位 */
  position: fixed;
  left: -100px;
  z-index: 2147483645;
  /* 盒模型 */
  width: auto;
  height: 20px;
  margin: 0;
  padding: 0 10px;
  line-height: 20px;
  border-radius: 2px;
  /* 排版样式 */
  text-align: center;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  /* 视觉样式 */
  background-color: rgba(39, 169, 216, 0.7);
  color: rgba(255, 255, 255, 0.95);
  text-shadow: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(3px); /* 毛玻璃模糊 */
  -webkit-backdrop-filter: blur(3px); /* Safari 支持 */
  /* 动效与交互 */
  cursor: pointer;
  user-select: none;
  visibility: hidden;
  transition: all 0.5s ease;
}
#btn-fullscreen-toggle:hover,
#btn-pip-toggle:hover {
  background-color: rgba(39, 116, 216, 0.7);
}
#btn-fullscreen-toggle.visible,
#btn-pip-toggle.visible {
  visibility: visible;
}

/* 左右退出全屏按钮样式 */
#leftFullStackButton,
#rightFullStackButton {
  display: none;
  position: fixed;
  width: 1px;
  height: 100vh;
  top: 0;
  z-index: 2147483647;
  background: #000;
}
#leftFullStackButton {
  left: 0;
}
#rightFullStackButton {
  right: 0;
}

/* 右键菜单样式，默认浅色主题 */
#btnContextMenu {
  position: fixed;
  background: rgba(250, 250, 250, 0.72);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 14px;
  padding: 6px 0;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  z-index: 2147483647;
  width: 220px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 13px;
}
#btnContextMenu > div:first-child {
  padding: 8px 20px;
  color: rgba(60, 60, 67, 0.6);
  font-weight: 500;
  font-size: 13px;
  border-bottom: 1px solid rgba(60, 60, 67, 0.15);
  cursor: default;
}
#btnContextMenu > div:not(:first-child) {
  padding: 5px 10px;
  cursor: pointer;
  color: #1c1c1e;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
#btnContextMenu > div:not(:first-child):hover {
  background-color: rgba(0, 0, 0, 0.06);
}
/* 右键菜单深色主题 */
@media (prefers-color-scheme: dark) {
  #btnContextMenu {
    background: rgba(28, 28, 30, 0.72);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.32);
    color: rgba(255, 255, 255, 0.85);
  }
  #btnContextMenu > div:first-child {
    color: rgba(235, 235, 245, 0.6);
    border-bottom: 1px solid rgba(84, 84, 88, 0.65);
  }
  #btnContextMenu > div:not(:first-child) {
    color: rgba(255, 255, 255, 0.85);
  }
  #btnContextMenu > div:not(:first-child):hover {
    /* background-color: rgba(255, 255, 255, 0.10); */
    /* 修改为蓝色，为了兼容 Dark Reader */
    background-color: rgba(27, 134, 187, 0.2);
  }
}
`);
    }

    // 添加事件监听
    document.addEventListener("mouseover", tool.debounce(handle.getPlayer), false);
    document.addEventListener("keydown", handle.hotKey, false);
    window.addEventListener("message", handle.receiveMessage, false);
    // 添加鼠标中键点击事件监听
    document.addEventListener("pointerdown", handle.mouseMiddleClick, true);
    // 添加全局右键点击事件，用于关闭菜单
    document.addEventListener("contextmenu", (e) => {
      if (
        gv.contextMenu &&
        !gv.contextMenu.contains(e.target) &&
        e.target.id !== "btn-fullscreen-toggle" &&
        e.target.id !== "btn-pip-toggle"
      ) {
        handle.hideContextMenu();
      }
    });

    // 创建视频事件拦截器
    gv.interceptor = tool.createVideoEventInterceptor();
    // 创建页面滚动锁定方法
    gv.scrollLocker = tool.createScrollLocker();

    tool.print("Ready");
  };

  // 初始化脚本
  init();
})();
