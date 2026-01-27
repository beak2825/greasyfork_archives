// ==UserScript==
// @name         fuck rainyun
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  禁用 RainYun 防火墙规则列表的拖动排序功能。
// @author       You
// @match        https://app.rainyun.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564104/fuck%20rainyun.user.js
// @updateURL https://update.greasyfork.org/scripts/564104/fuck%20rainyun.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- 配置 ---
  const TBODY_SELECTOR = ".cursor-move";
  const CLICKABLE_BUTTON_SELECTOR = "button"; // 用于允许按钮事件
  const SPECIFIC_BUTTON_CLASS = "btn-relief-primary"; // 特定按钮的类名
  const EVENTS_TO_BLOCK = ["dragstart", "drag", "dragend", "dragover", "dragenter", "dragleave", "drop", "mousedown", "mousemove", "mouseup", "touchstart", "touchmove", "touchend", "touchcancel", "pointermove"];
  const EVENTS_TO_ALLOW_FOR_SPECIFIC_BUTTON = ["click", "touchstart", "touchend"]; // 对特定按钮允许的事件
  const PROCESSING_ATTRIBUTE = "data-tampermonkey-drag-disabled";
  // --- 配置结束 ---

  let isScriptEnabled = false;
  let isAutoStartEnabled = false;
  let uiContainer = null;
  let observer = null;
  let eventHandlersMap = new Map(); // 存储为每个元素注册的事件处理器

  // 创建悬浮窗
  function createUI() {
    if (uiContainer) return;

    const container = document.createElement("div");
    container.id = "disable-firewall-sorting-ui";
    container.style.cssText = `
      position: fixed; top: 50%; left: 10px; transform: translateY(-50%); z-index: 999999; /* 极高层级 */
      width: 120px; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.2); border-radius: 4px; font-family: Arial, sans-serif; font-size: 12px;
      user-select: none; /* 防止文本被意外选中 */
      pointer-events: auto; /* 确保自身能接收事件 */
      touch-action: none; /* 使触摸操作更友好 */
      box-sizing: border-box; /* 包含边框在内的总宽高 */
    `;

    const handle = document.createElement("div");
    handle.id = "draggable-handle";
    handle.textContent = "拖动我";
    handle.style.cssText = `
      background-color: #4a90e2; color: white; padding: 5px; cursor: move; border-radius: 4px 4px 0 0; font-size: 12px; text-align: center;
      pointer-events: all; /* 确保句柄能接收事件 */
    `;

    const contentDiv = document.createElement("div");
    contentDiv.style.cssText = `
      padding: 8px; background-color: #f0f0f0; border-radius: 0 0 4px 4px;
    `;

    const toggleLabel = document.createElement("label");
    toggleLabel.style.cssText = `display: block; margin-bottom: 5px; font-size: 11px;`;
    toggleLabel.innerHTML = `<input type="checkbox" id="toggle-script"> 启用脚本`;

    const autoStartLabel = document.createElement("label");
    autoStartLabel.style.cssText = `display: block; font-size: 11px;`;
    autoStartLabel.innerHTML = `<input type="checkbox" id="auto-start"> 页面加载时启用`;

    contentDiv.appendChild(toggleLabel);
    contentDiv.appendChild(autoStartLabel);
    container.appendChild(handle);
    container.appendChild(contentDiv);

    document.body.appendChild(container);
    uiContainer = container;

    // --- 重要：将初始 CSS 定位转换为 Transform ---
    // 强制重排，让 CSS 样式生效
    container.offsetHeight;
    // 获取元素当前计算出的屏幕坐标
    const rect = container.getBoundingClientRect();
    // 将这个位置转换为 translate3d 值
    container.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
    // 清除原有的 top 和 left，确保后续移动只通过 transform
    container.style.top = "0";
    container.style.left = "0";
    // --- 重要：转换完成 ---

    const toggleCheckbox = container.querySelector("#toggle-script");
    const autoStartCheckbox = container.querySelector("#auto-start");

    // --- 拖动逻辑 (增强版, 支持触摸, 边界限制, 修复首次拖动问题) ---
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    // 现在 xOffset 和 yOffset 就代表了悬浮窗相对于视口左上角的位置
    let xOffset = rect.left;
    let yOffset = rect.top;

    // 获取事件坐标 (兼容鼠标和触摸)
    function getEventCoordinates(e) {
      if (e.type.indexOf("touch") === 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else {
        return { x: e.clientX, y: e.clientY };
      }
    }

    // 获取视口尺寸
    function getViewportDimensions() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return { width: w, height: h };
    }

    // 获取元素尺寸
    function getElementDimensions(el) {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }

    // 防止拖拽过程中选中文本或触发默认触摸行为的函数
    function preventGlobalSelectionAndTouchAction(e) {
      e.preventDefault();
      return false;
    }

    // 开始拖拽
    function dragStart(e) {
      if ((e.type === "mousedown" && e.button !== 0) || (e.type === "touchstart" && e.touches.length > 1)) {
        return;
      }

      container.focus({ preventScroll: true });

      e.preventDefault();
      e.stopPropagation();

      const coords = getEventCoordinates(e);
      // 计算初始鼠标/触摸点相对于悬浮窗当前位置的偏移量
      // 这里使用当前的 xOffset 和 yOffset 作为基准
      initialX = coords.x - xOffset;
      initialY = coords.y - yOffset;

      if (e.target === handle || e.target === container) {
        isDragging = true;
        document.addEventListener("selectstart", preventGlobalSelectionAndTouchAction, true);
        if (e.type === "touchstart") {
          document.addEventListener("touchmove", drag, { passive: false });
          document.addEventListener("touchend", dragEnd, false);
          document.addEventListener("touchcancel", dragEnd, false);
        }
      }
    }

    // 拖拽中
    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();

        const coords = getEventCoordinates(e);
        // 根据当前鼠标/触摸点和初始偏移量计算新位置
        let newX = coords.x - initialX;
        let newY = coords.y - initialY;

        // 获取视口和元素尺寸
        const viewport = getViewportDimensions();
        const element = getElementDimensions(container);

        // 计算边界限制
        const maxX = viewport.width - element.width;
        const maxY = viewport.height - element.height;
        const minX = 0;
        const minY = 0;

        // 应用边界限制
        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        // 更新偏移量
        xOffset = newX;
        yOffset = newY;

        setTranslate(newX, newY, container);
      }
    }

    // 结束拖拽
    function dragEnd(e) {
      document.removeEventListener("selectstart", preventGlobalSelectionAndTouchAction, true);
      if (e.type === "touchend" || e.type === "touchcancel") {
        document.removeEventListener("touchmove", drag);
        document.removeEventListener("touchend", dragEnd);
        document.removeEventListener("touchcancel", dragEnd);
      }

      isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
      // 直接使用传入的值更新 transform
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
      // 确保 top 和 left 保持为 0
      el.style.top = "0";
      el.style.left = "0";
    }

    // 添加事件监听器
    handle.addEventListener("mousedown", dragStart, false);
    handle.addEventListener("touchstart", dragStart, { passive: false });
    document.addEventListener("mousemove", drag, false);
    document.addEventListener("mouseup", dragEnd, false);
    // touchmove 和 touchend 在 dragStart 时动态添加，在 dragEnd 时移除
    // --- 拖动逻辑结束 ---

    // 切换脚本状态
    toggleCheckbox.checked = isScriptEnabled;
    toggleCheckbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        enableScript();
      } else {
        disableScript();
      }
    });

    // 切换自动启动状态
    autoStartCheckbox.checked = isAutoStartEnabled;
    autoStartCheckbox.addEventListener("change", (e) => {
      isAutoStartEnabled = e.target.checked;
      localStorage.setItem("rainyun_firewall_sorting_auto_start", isAutoStartEnabled.toString());
      // 如果勾选了自动启动，且当前脚本未启用，则启用
      if (isAutoStartEnabled && !isScriptEnabled) {
        enableScript();
      }
    });

    // 加载初始状态
    const savedAutoStart = localStorage.getItem("rainyun_firewall_sorting_auto_start");
    if (savedAutoStart !== null) {
      isAutoStartEnabled = savedAutoStart === "true";
      autoStartCheckbox.checked = isAutoStartEnabled;
      if (isAutoStartEnabled) {
        enableScript(); // 页面加载时如果设置了自动启动，则启用脚本
      }
    }
  }

  // 启用脚本功能
  function enableScript() {
    if (isScriptEnabled) return;
    console.log("脚本功能已启用");
    isScriptEnabled = true;
    const toggleCheckbox = uiContainer?.querySelector("#toggle-script");
    if (toggleCheckbox) toggleCheckbox.checked = true;

    // 初始化现有元素
    const existingTbody = document.querySelector(TBODY_SELECTOR);
    if (existingTbody) {
      processElement(existingTbody);
    }
    // 初始化现有特定按钮
    const existingSpecificButtons = document.querySelectorAll(`button.${SPECIFIC_BUTTON_CLASS}`);
    existingSpecificButtons.forEach((btn) => processSpecificButton(btn));

    // 设置 MutationObserver 监听动态内容
    if (!observer) {
      observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            for (const node of mutation.addedNodes) {
              if (node.nodeType !== Node.ELEMENT_NODE) continue;

              if (node.matches && node.matches(TBODY_SELECTOR)) {
                processElement(node);
              }

              // 检查新增节点是否是目标按钮
              if (node.matches && node.matches(`button.${SPECIFIC_BUTTON_CLASS}`)) {
                processSpecificButton(node);
              }

              // 检查新增节点内的子元素
              const nestedTbodies = node.querySelectorAll ? node.querySelectorAll(TBODY_SELECTOR) : [];
              for (const nestedTbody of nestedTbodies) {
                processElement(nestedTbody);
              }

              const nestedSpecificButtons = node.querySelectorAll ? node.querySelectorAll(`button.${SPECIFIC_BUTTON_CLASS}`) : [];
              for (const btn of nestedSpecificButtons) {
                processSpecificButton(btn);
              }
            }
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // 禁用脚本功能
  function disableScript() {
    if (!isScriptEnabled) return;
    console.log("脚本功能已禁用");
    isScriptEnabled = false;
    const toggleCheckbox = uiContainer?.querySelector("#toggle-script");
    if (toggleCheckbox) toggleCheckbox.checked = false;

    // 移除所有已添加的事件监听器
    eventHandlersMap.forEach((handlers, element) => {
      handlers.forEach(({ type, handler, options }) => {
        element.removeEventListener(type, handler, options);
      });
    });
    eventHandlersMap.clear();

    // 清除为元素添加的属性
    const processedElements = document.querySelectorAll("[" + PROCESSING_ATTRIBUTE + "]");
    processedElements.forEach((el) => {
      el.removeAttribute(PROCESSING_ATTRIBUTE);
      el.draggable = true; // 恢复原生draggable
      el.setAttribute("draggable", "true");
    });

    // 停止观察器
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // 处理防火墙 tbody 元素，添加拖拽阻止逻辑
  function processElement(element) {
    if (element.hasAttribute(PROCESSING_ATTRIBUTE)) {
      return; // 已处理，跳过
    }

    element.setAttribute(PROCESSING_ATTRIBUTE, "true");
    element.draggable = false;
    element.setAttribute("draggable", "false");

    const handlers = [];

    const preventHandler = function (e) {
      if (e.target.matches(CLICKABLE_BUTTON_SELECTOR) || e.target.closest(CLICKABLE_BUTTON_SELECTOR)) {
        // console.log("允许按钮事件:", e.type, e.target);
        return;
      }
      // console.log("正在阻止子元素上的拖动事件:", e.type, e.target);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    EVENTS_TO_BLOCK.forEach((eventType) => {
      const options = { passive: false, capture: true };
      element.addEventListener(eventType, preventHandler, options);
      // 记录已添加的处理器，以便后续移除
      handlers.push({ type: eventType, handler: preventHandler, options });
    });

    eventHandlersMap.set(element, handlers);
    // console.log("已为元素应用拖动阻止:", element);
  }

  // 处理特定按钮 (.btn-relief-primary)，阻止指定事件
  function processSpecificButton(button) {
    if (eventHandlersMap.has(button)) {
      // 如果已经处理过此按钮，跳过
      return;
    }
    // console.log("正在为特定按钮应用事件阻止:", button);

    const handlers = [];

    const specificPreventHandler = function (e) {
      // 检查事件类型是否在允许列表中
      if (EVENTS_TO_ALLOW_FOR_SPECIFIC_BUTTON.includes(e.type)) {
        // console.log("允许特定按钮事件:", e.type, e.target);
        return; // 允许事件执行
      }
      // 如果事件不在允许列表中，则阻止
      // console.log("正在阻止特定按钮事件:", e.type, e.target);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    // 获取所有需要阻止的事件（即不在允许列表中的）
    const eventsToBlockForSpecificButton = EVENTS_TO_BLOCK.filter((eventType) => !EVENTS_TO_ALLOW_FOR_SPECIFIC_BUTTON.includes(eventType));

    eventsToBlockForSpecificButton.forEach((eventType) => {
      const options = { passive: false, capture: true };
      button.addEventListener(eventType, specificPreventHandler, options);
      // 记录已添加的处理器，以便后续移除
      handlers.push({ type: eventType, handler: specificPreventHandler, options });
    });

    eventHandlersMap.set(button, handlers);
  }

  // 初始化 UI
  createUI();

  console.log("RainYun 防火墙拖动禁用脚本已加载。");
})();
