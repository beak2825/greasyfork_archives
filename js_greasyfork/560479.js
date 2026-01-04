// ==UserScript==
// @name         Jike Compose Autofill
// @namespace    popclip.jike.compose
// @version      1.1.0
// @description  将 URL 中的 ?text= 参数自动写入即刻网页的“分享你的想法...”编辑框，并触发输入事件
// @author       you
// @match        https://web.okjike.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560479/Jike%20Compose%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/560479/Jike%20Compose%20Autofill.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 1) 读取 URL 参数中的文本
  const params = new URLSearchParams(window.location.search);
  const preset = params.get("text");
  if (!preset || preset.trim() === "") {
    // 没有传文本就不做任何事
    return;
  }

  // 2) 等待编辑器渲染（即刻为 SPA，节点会延迟出现）
  function waitForEditor(timeoutMs = 15000) {
    const start = Date.now();

    return new Promise((resolve, reject) => {
      // 先快速检查一次
      let editor = findEditor();
      if (editor) return resolve(editor);

      // 用 MutationObserver 监听 DOM 变化，出现后立即填充
      const observer = new MutationObserver(() => {
        editor = findEditor();
        if (editor) {
          observer.disconnect();
          resolve(editor);
        }
      });

      observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
      });

      // 超时兜底
      const timer = setInterval(() => {
        if (Date.now() - start > timeoutMs) {
          clearInterval(timer);
          observer.disconnect();
          reject(new Error("Editor not found within timeout"));
        } else {
          editor = findEditor();
          if (editor) {
            clearInterval(timer);
            observer.disconnect();
            resolve(editor);
          }
        }
      }, 500);
    });
  }

  // 3) 根据当前页面结构查找编辑器
  function findEditor() {
    // 依据当前页面提供的结构：contenteditable="true" 且 role="textbox"
    // 如果将来页面结构改变，可在此处补充其他选择器（例如类名或 data- 属性）
    const editor =
      document.querySelector("div[contenteditable='true'][role='textbox']") ||
      document.querySelector("[contenteditable='true']");

    return editor || null;
  }

  // 4) 将纯文本安全写入编辑器，并触发输入事件
  function fillEditor(editor, text) {
    if (!editor) return;

    // 聚焦到编辑器
    editor.focus();

    // 使用 Selection/Range 定位插入点（末尾），兼容 React/受控组件
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    // 优先使用 execCommand 插入文本（不少富文本编辑器仍支持）
    const before = editor.textContent || "";
    const ok = document.execCommand("insertText", false, text);

    // 回退：若 execCommand 不生效，则直接设置 textContent
    if (!ok) {
      editor.textContent = before + text;
    }

    // 触发输入事件，促使前端状态更新
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    editor.dispatchEvent(new Event("change", { bubbles: true }));

    // 可选：将插入完成后把 URL 中的 text 参数移除，避免刷新重复插入
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("text");
      // 使用 history.replaceState 不会导致页面重载
      window.history.replaceState({}, document.title, url.toString());
    } catch (e) {
      // 静默失败即可
      console.warn("Jike Compose Autofill: clean URL param failed:", e);
    }
  }

  // 主流程
  waitForEditor()
    .then((editor) => {
      fillEditor(editor, preset);
    })
    .catch((e) => {
      console.warn("Jike Compose Autofill: 未找到编辑器：", e);
    });
})();
