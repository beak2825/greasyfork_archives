// ==UserScript==
// @name         ✨2026最新可用 - 完美解决【头歌平台】禁复制/粘贴问题
// @namespace    https://github.com/ystemsrx/fuck-educoder-paste
// @version      2.0.1
// @description  1）阻止网页脚本拦截复制/粘贴/全选等快捷键；2）禁止网页往剪贴板写入“全空白”内容；3）在代码编辑器中粘贴前，如果光标前一段是纯空格/Tab，则先清掉这些缩进，再原样粘贴内容。
// @author       ystemsrx
// @match        https://www.educoder.net/*
// @match        https://educoder.net/*
// @match        https://*.educoder.net/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558152/%E2%9C%A82026%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8%20-%20%E5%AE%8C%E7%BE%8E%E8%A7%A3%E5%86%B3%E3%80%90%E5%A4%B4%E6%AD%8C%E5%B9%B3%E5%8F%B0%E3%80%91%E7%A6%81%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/558152/%E2%9C%A82026%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8%20-%20%E5%AE%8C%E7%BE%8E%E8%A7%A3%E5%86%B3%E3%80%90%E5%A4%B4%E6%AD%8C%E5%B9%B3%E5%8F%B0%E3%80%91%E7%A6%81%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ============================================================
  // 1. 在 document 冒泡阶段拦截 Ctrl/Cmd + C/V/A （不再拦 Ctrl+X）
  // ============================================================
  document.addEventListener(
    "keydown",
    function (e) {
      const key = (e.key || "").toLowerCase();
      const code = e.keyCode || e.which || 0;
      const ctrlLike = e.ctrlKey || e.metaKey;
      if (!ctrlLike) return;

      const isComboKey =
        ["c", "v", "a"].includes(key) || // 去掉了 'x'
        [67, 86, 65].includes(code); // 去掉了 88
      if (!isComboKey) return;

      // 不阻止默认行为，只阻止后续监听器（特别是平台自己的）
      e.stopPropagation();
      e.stopImmediatePropagation();
    },
    false,
  );

  // ============================================================
  // 2. （只）屏蔽全局 copy 监听（不影响 cut）
  //    —— cut 留给编辑器自己处理，避免“无法剪切”
  // ============================================================
  window.addEventListener(
    "copy",
    function (e) {
      e.stopImmediatePropagation();
    },
    true,
  );

  // ============================================================
  // 3. 阻止网页把剪贴板写成“全空白”
  // ============================================================
  (function patchClipboardWrite() {
    try {
      const clip = navigator.clipboard;
      if (!clip) return;
      if (clip.__ultraPatched) return;

      const origWriteText =
        typeof clip.writeText === "function" ? clip.writeText.bind(clip) : null;
      const origWrite =
        typeof clip.write === "function" ? clip.write.bind(clip) : null;

      if (origWriteText) {
        clip.writeText = function (text) {
          try {
            if (typeof text === "string" && text.trim() === "") {
              console.warn(
                "[ultraPaste] blocked clipboard.writeText() whitespace-only",
              );
              return Promise.resolve();
            }
          } catch (err) {
            console.warn("[ultraPaste] writeText check error:", err);
          }
          return origWriteText(text);
        };
      }

      if (origWrite) {
        clip.write = async function (data) {
          try {
            const items = Array.from(data || []);
            let allWhitespace = items.length > 0;

            for (const item of items) {
              if (!item || !item.types) {
                allWhitespace = false;
                break;
              }
              if (item.types.includes("text/plain")) {
                const blob = await item.getType("text/plain").catch(() => null);
                if (!blob) {
                  allWhitespace = false;
                  break;
                }
                const txt = await blob.text().catch(() => "");
                if (txt.trim() !== "") {
                  allWhitespace = false;
                  break;
                }
              } else {
                allWhitespace = false;
                break;
              }
            }

            if (allWhitespace) {
              console.warn(
                "[ultraPaste] blocked clipboard.write() whitespace-only payload",
              );
              return;
            }
          } catch (err) {
            console.warn("[ultraPaste] clipboard.write analysis failed:", err);
          }
          return origWrite(data);
        };
      }

      Object.defineProperty(clip, "__ultraPatched", {
        value: true,
        configurable: false,
        enumerable: false,
        writable: false,
      });
    } catch (err) {
      console.error("[ultraPaste] patchClipboardWrite error:", err);
    }
  })();

  // ============================================================
  // 4. 允许全站选中文本 + 隐藏“禁止复制”提示
  // ============================================================
  function enableSelection() {
    try {
      const id = "__ultraPaste_user_select__";
      if (!document.getElementById(id)) {
        const style = document.createElement("style");
        style.id = id;
        style.textContent = `
                  * {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                  }
                  body {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                  }
                  .ant-message,
                  .ant-message-notice,
                  .ant-notification {
                    display: none !important;
                  }
                `;
        document.head && document.head.appendChild(style);
      }
    } catch (err) {
      console.error("[ultraPaste] enableSelection error:", err);
    }
  }

  // ============================================================
  // 5. 判断是否为“代码编辑器”相关节点
  // ============================================================
  function hasCodeyClass(node) {
    while (node && node !== document.documentElement) {
      let cls = "";
      if (typeof node.className === "string") cls += node.className + " ";
      if (typeof node.id === "string") cls += node.id;
      cls = cls.toLowerCase();

      if (
        cls.includes("code") ||
        cls.includes("editor") ||
        cls.includes("monaco") ||
        cls.includes("ace") ||
        cls.includes("codemirror") ||
        cls.includes("cm-editor")
      ) {
        return true;
      }
      node = node.parentElement;
    }
  }

  function isCodeEditorLike(target) {
    if (
      !target ||
      !(target instanceof HTMLElement || target instanceof HTMLTextAreaElement)
    ) {
      return false;
    }

    const tag = (target.tagName || "").toLowerCase();

    // textarea 基本都可以认为是编辑器
    if (tag === "textarea") return true;

    if (tag === "input") {
      const type = (target.type || "").toLowerCase();
      if (
        ["text", "search", "url", "email", "number", "password"].includes(type)
      ) {
        return hasCodeyClass(target);
      }
    }

    if (target.isContentEditable) {
      return true;
    }

    return hasCodeyClass(target);
  }

  // ============================================================
  // 6. 在光标处插入文本
  // ============================================================
  function insertTextAtCursor(target, text) {
    if (!text) return;

    const doc = target.ownerDocument || document;
    const win = doc.defaultView || window;

    if (target.isContentEditable) {
      const sel = win.getSelection();
      if (!sel || !sel.rangeCount || !target.contains(sel.anchorNode)) {
        const range = doc.createRange();
        range.selectNodeContents(target);
        range.collapse(false);
        const sel2 = win.getSelection();
        sel2.removeAllRanges();
        sel2.addRange(range);
      }
    } else {
      if (doc.activeElement !== target && typeof target.focus === "function") {
        target.focus();
      }
    }

    let handledByCommand = false;
    try {
      if (
        !doc.queryCommandSupported ||
        doc.queryCommandSupported("insertText")
      ) {
        handledByCommand = doc.execCommand("insertText", false, text);
      }
    } catch (err) {
      handledByCommand = false;
    }

    if (handledByCommand) return;

    if (target.isContentEditable) {
      const sel = win.getSelection();
      if (!sel) return;
      if (!sel.rangeCount) {
        const range = doc.createRange();
        range.selectNodeContents(target);
        range.collapse(false);
        sel.addRange(range);
      }
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(doc.createTextNode(text));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }

    if (
      typeof target.setRangeText === "function" &&
      typeof target.selectionStart === "number"
    ) {
      const start = target.selectionStart;
      const end = target.selectionEnd;
      target.setRangeText(text, start, end, "end");
      return;
    }

    if (typeof target.value === "string") {
      target.value += text;
    }
  }

  // ============================================================
  // 7. 在 textarea / input 里：如果光标前是纯空格/Tab，就先删掉
  //    —— 不动剪贴板内容本身的缩进
  // ============================================================
  function cleanIndentBeforeCursorIfPlainWS(target) {
    try {
      if (
        !(
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLInputElement
        )
      ) {
        return;
      }
      if (typeof target.value !== "string") return;
      if (typeof target.selectionStart !== "number") return;

      let val = target.value;
      let start = target.selectionStart;
      let end = target.selectionEnd;

      // 当前行行首位置
      let lineStart = val.lastIndexOf("\n", start - 1);
      if (lineStart === -1) lineStart = 0;
      else lineStart += 1;

      const pre = val.slice(lineStart, start);

      // 只有当这一段是纯空格 / Tab 时才清理，避免误删代码
      if (pre && /^[\t ]+$/.test(pre)) {
        const before = val.slice(0, lineStart);
        const after = val.slice(start);
        target.value = before + after;

        const delta = pre.length;
        const newPos = start - delta;

        target.selectionStart = newPos;
        target.selectionEnd = newPos;
      }
    } catch (err) {
      console.warn(
        "[ultraPaste] cleanIndentBeforeCursorIfPlainWS failed:",
        err,
      );
    }
  }

  // ============================================================
  // 8. 统一处理粘贴事件（在代码编辑器中接管）
  // ============================================================
  window.addEventListener(
    "paste",
    function (e) {
      // 先阻断平台挂在 window/document/元素上的后续监听器
      e.stopImmediatePropagation();

      const target = e.target;
      if (!target) return;

      // 非代码编辑器：不改内容，只解锁粘贴
      if (!isCodeEditorLike(target)) {
        return;
      }

      // 代码编辑器：我们接管粘贴逻辑
      e.preventDefault();

      (async function handleCodePaste() {
        let raw = "";

        try {
          if (
            e.clipboardData &&
            typeof e.clipboardData.getData === "function"
          ) {
            raw = e.clipboardData.getData("text/plain") || "";
          }
          if (
            !raw &&
            navigator.clipboard &&
            typeof navigator.clipboard.readText === "function"
          ) {
            raw = await navigator.clipboard.readText();
          }
        } catch (err) {
          console.warn("[ultraPaste] read clipboard for paste failed:", err);
        }

        if (!raw) return;

        // 不再改动 raw 的缩进，原样使用
        const textToInsert = raw;

        // 如果是普通 textarea / input，并且光标前是纯空白缩进，先清掉这些缩进
        cleanIndentBeforeCursorIfPlainWS(target);

        // 再把剪贴板内容原样插入光标处
        insertTextAtCursor(target, textToInsert);
      })();
    },
    true,
  );

  // ============================================================
  // 9. DOM 就绪后初始化
  // ============================================================
  function domReady() {
    enableSelection();
    console.log(
      "[ultraPaste] 复制/粘贴解锁 + 剪贴板空白写入防护 + 行首缩进清理（保留粘贴内容缩进） 已启用",
    );
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    domReady();
  } else {
    window.addEventListener("DOMContentLoaded", domReady, { once: true });
  }
})();
