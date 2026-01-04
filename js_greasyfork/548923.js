// ==UserScript==
// @name         测试-网页DOM捕获截图
// @namespace
// @version      0.0.1
// @author       ymzhao
// @description  使用SnapDOM实现的网页DOM捕获截图插件
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4LnNlYXJjaF9pbmRleC4wLmk3Ljc2NDAzYTgxRTZSV0ZmIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTk3NS4wNTMgNTM1LjkwN2EyMS4zMzMgMjEuMzMzIDAgMCAxLTE1LjI0NiAxNy45MmwtMjA2IDU5LjY0IDEzMC4zODYgMjI1LjgyNmE1My4zMzMgNTMuMzMzIDAgMCAxLTE5LjUyNiA3Mi44Nkw3MzUuMzMzIDk4Ni44MmE1My4zMzMgNTMuMzMzIDAgMCAxLTcyLjg1My0xOS41MjdMNTMyLjEgNzQxLjQ2NyAzNzcuNDMzIDg5MC4wNTNhMjEuMzMzIDIxLjMzMyAwIDAgMS0zNi4xLTE1LjM4NlYxOTJBMjEuMzMzIDIxLjMzMyAwIDAgMSAzNTIgMTczLjUyN2MzLjIwNy0xLjg1NCAxMS43NDctNS41MzQgMjEuNzYuMjQ2bDkxLjk0NyA1My4wODcgNDk4LjgzMyAyODhhMjEuMzMzIDIxLjMzMyAwIDAgMSAxMC41MTMgMjEuMDQ3ek0yOTguNjY3IDY2MS4zMzNBMjEuMzMzIDIxLjMzMyAwIDAgMCAyNzcuMzMzIDY0MEg5NmExMC42NjcgMTAuNjY3IDAgMCAxLTEwLjY2Ny0xMC42NjdWOTZBMTAuNjY3IDEwLjY2NyAwIDAgMSA5NiA4NS4zMzNoNzQ2LjY2N0ExMC42NjcgMTAuNjY3IDAgMCAxIDg1My4zMzMgOTZ2MjY2LjY2N2EyMS4zMzMgMjEuMzMzIDAgMCAwIDQyLjY2NyAwVjk2YTUzLjM5MyA1My4zOTMgMCAwIDAtNTMuMzMzLTUzLjMzM0g5NkE1My4zOTMgNTMuMzkzIDAgMCAwIDQyLjY2NyA5NnY1MzMuMzMzQTUzLjM5MyA1My4zOTMgMCAwIDAgOTYgNjgyLjY2N2gxODEuMzMzYTIxLjMzMyAyMS4zMzMgMCAwIDAgMjEuMzM0LTIxLjMzNHoiIGZpbGw9IiMxMjk2ZGIiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guc2VhcmNoX2luZGV4LjAuaTYuNzY0MDNhODFFNlJXRmYiIGNsYXNzPSJzZWxlY3RlZCIvPjwvc3ZnPg==
// @include      *
// @match        *
// @require      https://unpkg.com/@zumer/snapdom@latest/dist/snapdom.min.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/703945
// @downloadURL https://update.greasyfork.org/scripts/548923/%E6%B5%8B%E8%AF%95-%E7%BD%91%E9%A1%B5DOM%E6%8D%95%E8%8E%B7%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/548923/%E6%B5%8B%E8%AF%95-%E7%BD%91%E9%A1%B5DOM%E6%8D%95%E8%8E%B7%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

GM_addStyle(" .snap-target{box-shadow:inset 0 0 4px 2px green,0 0 10px 4px green!important} ");

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  function manualDelay(delay = 500) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
  function shining(message, color = "rgb(50, 177, 108)", fontSize = "xxx-large") {
    if (!message) return;
    const i = document.createElement("span");
    i.textContent = message;
    i.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    color: ${color};
    font-size: ${fontSize};
    font-weight: bold;
    transform: translate(-50%, -50%);
    user-select: none;
    z-index: 2002;`;
    document.body.appendChild(i);
    const duration = 2500;
    i.animate(
      [{ top: "50%", opacity: 1 }, { top: "30%", opacity: 0 }],
      { duration, fill: "forwards" }
    );
    setTimeout(i.remove, duration);
  }
  class SnapdomUtil {
    // 构造函数
    constructor() {
      // 鼠标移动
      __publicField(this, "_handleMousemove", (e) => {
        if (!this._isChosing || !e.target) return;
        if (this._hoverEl) this._hoverEl.classList.remove("snap-target");
        e.target.classList.add("snap-target");
        this._hoverEl = e.target;
      });
      // 点击确认选中
      // @ts-ignore
      __publicField(this, "_handleConfirmTarget", async (e) => {
        if (!this._hoverEl) {
          shining("未选中目标", "orange");
          return;
        }
        const tmpEl = this._hoverEl;
        this.stopChosing();
        this._loading = true;
        await manualDelay(50);
        try {
          await this._execSnapDom(tmpEl);
          shining("下载成功");
        } catch (err) {
          shining("下载失败", "red");
          console.error(err);
        }
        this._loading = false;
      });
      // ESC取消选中
      __publicField(this, "_handleEsc", (e) => {
        if (e.keyCode !== 27) return;
        this.stopChosing();
      });
      this._getSnapDom();
      this._isChosing = false;
      this._loading = false;
      this._hoverEl = null;
    }
    get isChosing() {
      return this._isChosing;
    }
    async _getSnapDom() {
      let tmp = window == null ? void 0 : window.snapdom;
      console.log("tmp: ", tmp);
      this._snapdom = tmp;
    }
    // 开启功能
    startChosing() {
      if (this._isChosing || this._loading) {
        console.warn("正在选中，已重新开始");
        this.stopChosing();
      }
      this._isChosing = true;
      document.body.addEventListener("mousemove", this._handleMousemove);
      setTimeout(() => {
        document.body.addEventListener("click", this._handleConfirmTarget);
        document.body.addEventListener("keydown", this._handleEsc);
      }, 200);
    }
    // 关闭功能
    stopChosing() {
      this._isChosing = false;
      document.body.removeEventListener("mousemove", this._handleMousemove);
      document.body.removeEventListener("click", this._handleConfirmTarget);
      document.body.removeEventListener("keydown", this._handleEsc);
      if (this._hoverEl) {
        this._hoverEl.classList.remove("snap-target");
        this._hoverEl = null;
      }
    }
    destroy() {
      this._loading = false;
      this._isChosing = false;
      this.startChosing = () => {
      };
      this.stopChosing();
    }
    // 指定DOM元素，下载其内容
    async _execSnapDom(targetEl) {
      if (!this._snapdom) {
        console.error("未加载插件snapdom");
        return;
      }
      if (!targetEl) {
        console.error("未指定捕获元素");
        return;
      }
      console.time("捕获耗时：");
      const capture = await this._snapdom(targetEl, { embedFonts: true, compress: true });
      console.timeEnd("捕获耗时：");
      console.time("下载耗时：");
      const options = {
        format: "jpg",
        filename: "chart-report-2025",
        backgroundColor: getBackgroundColor(targetEl)
      };
      await capture.download(options);
      console.timeEnd("下载耗时：");
    }
  }
  function getBackgroundColor(element) {
    if (!(element instanceof Element)) return "#FFFFFF";
    let computedStyle = window.getComputedStyle(element);
    let backgroundColor = computedStyle.getPropertyValue("background-color");
    if (backgroundColor === "rgba(0, 0, 0, 0)" || backgroundColor === "transparent") {
      let parentElement = element.parentElement;
      if (parentElement) {
        return getBackgroundColor(parentElement);
      } else {
        return "#FFFFFF";
      }
    }
    return backgroundColor;
  }
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  const snapdomUtil = new SnapdomUtil();
  console.log("snapdomUtil: ", snapdomUtil);
  try {
    const menu_command_id_1 = _GM_registerMenuCommand(
      "选中并截图",
      snapdomUtil.startChosing.bind(snapdomUtil),
      {
        accessKey: "s",
        autoClose: true,
        title: "点击后，可选中网页元素以截图"
      }
    );
  } catch (error) {
  }
  window.onload = function() {
    document.addEventListener("keydown", function(e) {
      if (e.ctrlKey && e.shiftKey && (e.key === "," || e.key === "<")) {
        e.preventDefault();
        if (snapdomUtil.isChosing) snapdomUtil.stopChosing();
        else snapdomUtil.startChosing();
      }
    });
  };

})();