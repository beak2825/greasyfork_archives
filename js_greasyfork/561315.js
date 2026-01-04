// ==UserScript==
// @name         ChatGPT Quick Search
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  通过快捷键快速激活/退出 ChatGPT 搜索模式。使用 Cmd/Ctrl+Shift+K 切换搜索模式。
// @author       Lovecrafx
// @license      MIT
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561315/ChatGPT%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/561315/ChatGPT%20Quick%20Search.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ================= 配置区域 =================
  const CONFIG = {
    // 快捷键设置
    SHORTCUT: {
      KEY: "k",
      SHIFT: true,
      CTRL_OR_META: true,
    },

    // 指令设置
    COMMAND: "/search",
    TAB_DELAY: 50,

    // DOM 选择器
    SELECTORS: {
      TEXT_AREA: "#prompt-textarea",
      SEARCH_PILL:
        '[data-testid="composer-search-pill"], button[class*="composer-pill"], button[aria-label*="Search"]',
      CLOSE_BUTTON: "button",
    },

    // 调试模式
    DEBUG: true,
  };
  // ============================================

  const log = (msg) => CONFIG.DEBUG && console.log(`[Quick Search] ${msg}`);

  // 防止重复激活的标志
  let isActivating = false;

  /**
   * 获取当前的搜索状态标签
   */
  function getSearchPill() {
    return document.querySelector(CONFIG.SELECTORS.SEARCH_PILL);
  }

  /**
   * 保存并清空输入框内容
   * 仅支持 contenteditable 元素
   */
  function saveAndClearContent(editor) {
    const content = editor.innerText || editor.textContent || "";

    // 对于 contenteditable 元素，使用 execCommand('selectAll') + delete
    editor.focus();
    document.execCommand("selectAll", false, null);
    document.execCommand("delete", false, null);

    return content;
  }

  /**
   * 恢复输入框内容
   * 使用 insertText 模拟真实用户输入，以正确触发 React 状态更新
   */
  function restoreContent(editor, content) {
    if (!content) return;

    editor.focus();
    document.execCommand("insertText", false, content);

    log(`已恢复内容: ${content.substring(0, 50)}...`);
  }

  /**
   * 等待搜索模式激活
   */
  function waitForSearchMode(editor, savedContent) {
    // 立即检查
    const pill = getSearchPill();
    if (pill) {
      restoreContent(editor, savedContent);
      log("搜索模式已激活");
      isActivating = false;
      return;
    }

    // 创建 Observer
    const observer = new MutationObserver(() => {
      const currentPill = getSearchPill();
      if (currentPill) {
        observer.disconnect();
        restoreContent(editor, savedContent);
        log("搜索模式已激活");
        isActivating = false;
      }
    });

    // 开始观察
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 简单超时处理
    setTimeout(() => {
      observer.disconnect();
      if (!getSearchPill()) {
        restoreContent(editor, savedContent);
        log("搜索模式激活超时");
        isActivating = false;
      }
    }, 1000);
  }

  /**
   * 激活搜索模式
   */
  function activateSearchMode() {
    const editor = document.querySelector(CONFIG.SELECTORS.TEXT_AREA);
    if (!editor) {
      log("未找到输入框");
      isActivating = false;
      return;
    }

    // 临时保存当前内容
    const savedContent = saveAndClearContent(editor);
    log(`已保存内容: ${savedContent.substring(0, 50)}...`);

    editor.focus();
    document.execCommand("insertText", false, CONFIG.COMMAND);

    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      code: "Tab",
      keyCode: 9,
      which: 9,
      bubbles: true,
      cancelable: true,
    });

    setTimeout(() => {
      editor.dispatchEvent(tabEvent);
      // 开始等待并检查搜索模式
      waitForSearchMode(editor, savedContent);
    }, CONFIG.TAB_DELAY);
  }

  /**
   * 退出搜索模式
   */
  function deactivateSearchMode(pill) {
    if (!pill) return;
    const closeBtn = pill.querySelector(CONFIG.SELECTORS.CLOSE_BUTTON) || pill;
    closeBtn.click();
    log("已退出搜索模式");
  }

  /**
   * 键盘事件处理器
   */
  function handleKeydown(e) {
    // 防止重复触发
    if (isActivating) return;

    const isModifierDown = CONFIG.SHORTCUT.CTRL_OR_META
      ? e.ctrlKey || e.metaKey
      : true;
    const isShiftDown = CONFIG.SHORTCUT.SHIFT ? e.shiftKey : true;
    const isTargetKey =
      e.key.toLowerCase() === CONFIG.SHORTCUT.KEY.toLowerCase();

    if (isModifierDown && isShiftDown && isTargetKey) {
      e.preventDefault();
      e.stopPropagation();

      const currentPill = getSearchPill();
      if (currentPill) {
        deactivateSearchMode(currentPill);
      } else {
        isActivating = true;
        activateSearchMode();
      }
    }
  }

  window.addEventListener("keydown", handleKeydown, true);
  log("脚本已就绪");
})();