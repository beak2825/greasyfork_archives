// ==UserScript==
// @name         小霸王游戏增强器
// @namespace    https://www.yikm.net/
// @version      1.0.1
// @description  LxlikeGameEnhancement
// @author       Lxlike
// @match        https://www.yikm.net/*
// @icon         https://img.1990i.com/f.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558082/%E5%B0%8F%E9%9C%B8%E7%8E%8B%E6%B8%B8%E6%88%8F%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558082/%E5%B0%8F%E9%9C%B8%E7%8E%8B%E6%B8%B8%E6%88%8F%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("LxlikeGameEnhancement 已启动！");
  console.table([
    { 触发: "点击左下角按钮⚡", 功能: "伪全屏模式" },
    { 触发: "页面失去焦点", 功能: "隐藏 + 暂停" },
    { 触发: "无内容时点击屏幕", 功能: "显示 + 继续" },
  ]);
  console.table([
    { 类型: "小霸王", 伪全屏模式: true, "显示/隐藏": true, "继续/暂停": true }, // clickDom
    { 类型: "街机", 伪全屏模式: true, "显示/隐藏": true, "继续/暂停": true }, // clickDom
    { 类型: "GBA", 伪全屏模式: true, "显示/隐藏": true, "继续/暂停": true }, // clickDom
    { 类型: "Flash", 伪全屏模式: true, "显示/隐藏": true, "继续/暂停": false }, // Enter/F1/ /
    { 类型: "Java", 伪全屏模式: true, "显示/隐藏": true, "继续/暂停": false }, // [keyQ继续 keyE菜单]
    { 类型: "DOS", 伪全屏模式: false, "显示/隐藏": false, "继续/暂停": false },
  ]);

  // ========================= 样式配置 =========================

  const lxlikeFloatMenu = `
    position: fixed;
    bottom: 0;
    left: 0;
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #c6d1ffff 0%, #aa9ab9ff 100%);
    border-radius: 0 36px 0 0;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
    z-index: 999999;
    transition: all 0.3s ease;
    user-select: none;
    border: 2px solid rgba(255, 255, 255, 0.3);`;
  const fullScreen = `
    display: unset;
    position: fixed;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    border: none;
    box-sizing: border-box;
    background-color: #000;
    overflow: hidden;`;

  // ======================== 全局变量 ========================

  let doms = {};
  let isInit = false;
  let hasGameCanvas = false;
  let canvasObserver = null;
  let isOpacity = false;
  let getDomFrequency = 10;

  // ======================== 全局常量 ========================

  const needProcessMap = ["/play"];

  // ======================== 工具函数 ========================

  function isXBW() {
    return doms.toggle && doms.tooltip && doms.tooltip.length > 0;
  }
  function isFlash() {
    return doms.canvas && doms.canvas.shadowRoot;
  }
  function isJava() {
    return doms.fullscreen.classList.contains("glcanvas");
  }
  function isExecPage() {
    return needProcessMap.includes(location.pathname);
  }
  function clearMargin(el) {
    el && (el.style.margin = "0");
  }
  // 画布是否聚焦
  function isCanvasFocus(el = doms.canvas) {
    if (doms.canvas) {
      if (doms.canvas.shadowRoot) {
        return el === doms.canvas.shadowRoot.activeElement;
      } else {
        return el === document.activeElement;
      }
    } else {
      return false;
    }
  }
  // 画布获取焦点
  function canvasGetFocus() {
    doms.canvas && doms.canvas.shadowRoot
      ? doms.canvas.shadowRoot.focus()
      : doms.canvas.focus();
  }
  // 是否为伪全屏
  function isCanvasFullscreen() {
    if (!doms.canvas) return false;
    if (doms.canvas) {
      if (doms.canvas.shadowRoot) {
        return (
          doms.fullscreen.style.width == "100vw" &&
          doms.fullscreen.style.height == "100vh"
        );
      } else {
        return (
          (doms.canvas.width == window.innerWidth &&
            doms.canvas.height == window.innerHeight) ||
          (doms.canvas.width == "100vw" && doms.canvas.height == "100vh") ||
          (doms.canvas.style.width == "100vw" &&
            doms.canvas.style.height == "100vh")
        );
      }
    } else {
      return false;
    }
  }
  // 是否为进行中
  function isPlaying() {
    if (!doms.canvas) return false;

    for (const target of doms.tooltip) {
      if (target.textContent.includes("暂停")) return true;
    }
    return false;
  }
  // 放大
  function setFullScreenStopPropagation(event) {
    event.stopPropagation();
    setFullScreen();
    canvasGetFocus();
  }
  /**
   * 监听并可选保护 DOM 元素的结构和样式不被修改
   * @param {HTMLElement} element - 要监听的 DOM 元素
   * @param {Object} options
   * @param {boolean} [options.protectStyle=true] - 是否保护 style 属性
   * @param {boolean} [options.protectClass=false] - 是否保护 class 属性
   * @param {boolean} [options.protectChildren=false] - 是否保护子节点结构
   * @param {Function} [options.onMutate=null] - 自定义变化回调 (mutationList, observer)
   * @param {boolean} [options.autoRestore=true] - 是否自动还原（仅在 protectXxx 为 true 时生效）
   * @returns {{ disconnect: Function }} observer 控制器
   */
  function observeAndProtectDOM(element, options = {}) {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("observeAndProtectDOM: Invalid element");
      return { disconnect() {} };
    }

    const {
      protectStyle = true,
      protectClass = false,
      protectChildren = false,
      onMutate = null,
      autoRestore = true,
      throttleDelay = 1000,
      throttleOnMutate = true,
    } = options;

    const initialState = {
      style: protectStyle ? element.getAttribute("style") || "" : null,
      className: protectClass ? element.className : null,
      childHTML: protectChildren ? element.innerHTML : null,
    };

    const config = {
      attributes: protectStyle || protectClass,
      attributeFilter: [],
      childList: protectChildren,
      subtree: protectChildren,
      characterData: false,
    };

    if (protectStyle) config.attributeFilter.push("style");
    if (protectClass) config.attributeFilter.push("class");

    // ===== 节流 onMutate 相关 =====
    let throttledMutations = [];
    let onMutateTimeout = null;
    let isOnMutateScheduled = false;

    function scheduleOnMutate(mutationList, observer) {
      throttledMutations.push(...mutationList);

      if (!isOnMutateScheduled) {
        isOnMutateScheduled = true;
        onMutateTimeout = setTimeout(() => {
          if (onMutate) {
            onMutate(throttledMutations, observer, /* shouldRestore */ false);
          }
          throttledMutations = [];
          isOnMutateScheduled = false;
          onMutateTimeout = null;
        }, throttleDelay);
      }
    }

    // ===== 还原节流（可选保留，也可独立控制）=====
    let restoreTimeout = null;
    let isRestoreScheduled = false;

    function scheduleRestore() {
      if (!autoRestore || isRestoreScheduled) return;
      isRestoreScheduled = true;
      restoreTimeout = setTimeout(() => {
        if (
          protectStyle &&
          element.getAttribute("style") !== initialState.style
        ) {
          element.setAttribute("style", initialState.style);
        }
        if (protectClass && element.className !== initialState.className) {
          element.className = initialState.className;
        }
        if (protectChildren && element.innerHTML !== initialState.childHTML) {
          element.innerHTML = initialState.childHTML;
        }
        isRestoreScheduled = false;
        restoreTimeout = null;
      }, throttleDelay);
    }

    // ===== MutationObserver 主逻辑 =====
    const observer = new MutationObserver((mutationList) => {
      let needsRestore = false;

      for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "style" && protectStyle) {
            if (element.getAttribute("style") !== initialState.style) {
              needsRestore = true;
            }
          }
          if (mutation.attributeName === "class" && protectClass) {
            if (element.className !== initialState.className) {
              needsRestore = true;
            }
          }
        }
        if (mutation.type === "childList" && protectChildren) {
          if (element.innerHTML !== initialState.childHTML) {
            needsRestore = true;
          }
        }
      }

      if (needsRestore) {
        scheduleRestore();
      }

      if (onMutate) {
        if (throttleOnMutate) {
          scheduleOnMutate(mutationList, observer);
        } else {
          onMutate(mutationList, observer, needsRestore);
        }
      }
    });

    observer.observe(element, config);

    return {
      disconnect() {
        observer.disconnect();
        if (restoreTimeout) clearTimeout(restoreTimeout);
        if (onMutateTimeout) clearTimeout(onMutateTimeout);
        isRestoreScheduled = false;
        isOnMutateScheduled = false;
      },
      restore() {
        if (protectStyle) element.setAttribute("style", initialState.style);
        if (protectClass) element.className = initialState.className;
        if (protectChildren) element.innerHTML = initialState.childHTML;
        isRestoreScheduled = false;
        if (restoreTimeout) clearTimeout(restoreTimeout);
      },
      getInitialState() {
        return Object.assign({}, initialState);
      },
    };
  }

  // ======================== 功能函数 ========================

  // 处理canvas变化
  function handleCanvasChanged(mutationList, observer, shouldRestore) {
    if (!doms.canvas || isCanvasFullscreen() || shouldRestore) return;
    canvasObserver.restore();
  }
  // 设置伪全屏
  function setFullScreen() {
    if (!doms.canvas) return;
    if (isCanvasFullscreen()) {
      if (canvasObserver) return;
      canvasObserver = observeAndProtectDOM(doms.canvas, {
        protectStyle: true,
        protectClass: true,
        autoRestore: false,
        onMutate: handleCanvasChanged,
      });
      return;
    } else {
      if (isJava()) {
        doms.canvas.width = window.innerWidth;
        doms.canvas.height = window.innerHeight;
      } else {
        doms.canvas.width = "100vw";
        doms.canvas.height = "100vh";
      }
    }

    if (isJava()) {
      doms.containerPhone.style.cssText = fullScreen;
      doms.containerImg.style.cssText = fullScreen;
      doms.canvas.style.cssText = `position:absolute;left:0;top:0;width:100vw;height:100vh`;
    } else if (isXBW()) {
      doms.canvas.style.cssText = fullScreen;
      doms.canvas.style.paddingLeft = "72px";
    } else if (isFlash()) {
      doms.canvas.style.cssText = fullScreen;
      doms.canvas.style.zIndex = "999999";
    }

    if (canvasObserver) {
      canvasObserver.disconnect();
      canvasObserver = null;
    }

    setTimeout(setFullScreen, 3000);
  }
  // 屏幕隐藏
  function screenHide() {
    if (isOpacity) return;
    isOpacity = true;
    document.body.style.opacity = 0;
    document.body.addEventListener("click", screenShow);
  }
  // 屏幕显示
  function screenShow() {
    if (!isOpacity) return;
    isOpacity = false;
    document.body.style.opacity = 1;
    document.body.removeEventListener("click", screenShow);
    start();
  }
  // 开始
  function start() {
    if (!isPlaying() && isXBW()) doms.toggle.click();
  }
  // 暂停
  function stop() {
    if (!isOpacity && isPlaying() && isXBW()) doms.toggle.click();
  }
  // 处理失去焦点事件
  function handleBlur() {
    if (!doms.canvas) return;
    stop();
    screenHide();
  }

  // ======================== 初始化函数 ========================

  function createFloatMenu() {
    if (document.getElementById("lxlikE-floaT-menU")) return;

    doms.floatMenu = document.createElement("div");
    doms.floatMenu.id = "lxlikE-floaT-menU";
    doms.floatMenu.innerText = "⚡";
    doms.floatMenu.style.cssText = lxlikeFloatMenu;
    document.body.appendChild(doms.floatMenu);

    doms.floatMenu.addEventListener("click", setFullScreenStopPropagation);
    return doms;
  }
  function getXBWToggle() {
    if (!doms.canvas) return;
    if (!doms.toggle) {
      doms.toggle = document.querySelector("#GamePauseOrPlay");
      // console.dir("get doms.toggle");
    }
    if (!doms.tooltip) {
      doms.tooltip = document.querySelectorAll('p[class^="style_tooltip"]');
      // console.dir("get doms.tooltip");
    }

    return doms;
  }
  function getJavaFullRelatedDom() {
    if (!doms.canvas) return;
    if (!doms.containerPhone) {
      doms.containerPhone = document.querySelector(".container-phone");
      // console.dir("get doms.containerPhone");
    }
    if (!doms.containerImg) {
      doms.containerImg = document.querySelector(".container-img");
      // console.dir("get doms.containerImg");
    }

    return doms;
  }
  function getDoms() {
    if (!doms.canvas) {
      doms.canvas =
        document.querySelector("#canvas") || // xbw/Java
        document.querySelector("ruffle-player"); // flash
    }

    if (!doms.fullscreen) {
      doms.fullscreen =
        document.querySelector(".fullscreen") || // xbw
        (doms.canvas &&
          doms.canvas.shadowRoot &&
          doms.canvas.shadowRoot.querySelector("canvas")) || // flash
        document.querySelector(".glcanvas"); // Java
    }

    hasGameCanvas = !!doms.canvas && !!doms.fullscreen;
    return doms;
  }
  function uninstall() {
    window.removeEventListener("blur", handleBlur);
    canvasObserver && canvasObserver.disconnect();
    isInit = false;
    hasGameCanvas = false;
    canvasObserver = null;
  }
  function init() {
    if (!isExecPage() || isInit || getDomFrequency < 1) return;
    isInit = true;
    hasGameCanvas = false;

    getDoms();
    getXBWToggle();
    getJavaFullRelatedDom();
    if (hasGameCanvas) {
      createFloatMenu();
    } else {
      isInit = false;
      getDomFrequency--;
      setTimeout(init, 3000);
    }
  }

  window.addEventListener("blur", handleBlur);
  window.addEventListener("beforeunload", uninstall);
  window.addEventListener("load", init);
  window.addEventListener("DOMContentLoaded", init);
})();
