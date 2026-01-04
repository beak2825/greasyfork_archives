// ==UserScript==
// @name         Caret Browsing
// @namespace    https://github.com/maoist2009
// @version      1.0.4
// @description  Toggle caret browsing. Cursor preserved only when switching between readonly/editable modes.
// @author       maoist2009 with qwen.ai
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      GPL-lv3-or-lator
// @downloadURL https://update.greasyfork.org/scripts/553624/Caret%20Browsing.user.js
// @updateURL https://update.greasyfork.org/scripts/553624/Caret%20Browsing.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MODE_OFF = 0;
  const MODE_READONLY = 1;
  const MODE_EDITABLE = 2;

  let currentMode = MODE_OFF;
  let originalContentEditable = null;
  let savedSelectionRange = null; // 仅用于 Readonly ↔ Editable 切换

  // 保存光标（仅当当前处于启用态）
  function saveSelectionIfNeeded() {
    if (currentMode === MODE_OFF) return; // 关闭态不保存！
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedSelectionRange = selection.getRangeAt(0).cloneRange();
    }
  }

  // 恢复光标（仅当目标节点有效）
  function restoreSelection() {
    if (!savedSelectionRange) return;
    if (!document.contains(savedSelectionRange.startContainer) ||
        !document.contains(savedSelectionRange.endContainer)) {
      savedSelectionRange = null;
      return;
    }
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedSelectionRange);
  }

  function beforeinputHandler(e) {
    e.preventDefault();
  }

  function setMode(mode) {
    const body = document.body;
    if (!body) return;

    // 如果是从启用态切换到另一种启用态（如 readonly ↔ editable），先保存
    if (currentMode !== MODE_OFF && mode !== MODE_OFF) {
      saveSelectionIfNeeded();
    }

    // 清理旧状态
    if (currentMode !== MODE_OFF) {
      body.removeEventListener('beforeinput', beforeinputHandler, true);
      if (originalContentEditable === null) {
        body.removeAttribute('contenteditable');
      } else {
        body.setAttribute('contenteditable', originalContentEditable);
      }
    }

    // 进入新模式
    if (mode === MODE_OFF) {
      currentMode = MODE_OFF;
      savedSelectionRange = null; // 明确丢弃，避免后续误用
      console.log('[Caret Browsing] OFF');
      return;
    }

    // 启用 contentEditable
    if (currentMode === MODE_OFF) {
      // 从关闭态进入：不恢复光标（按你要求）
      originalContentEditable = body.getAttribute('contenteditable');
    }

    body.contentEditable = true;

    if (mode === MODE_READONLY) {
      body.addEventListener('beforeinput', beforeinputHandler, true);
      console.log('[Caret Browsing] READONLY');
    } else if (mode === MODE_EDITABLE) {
      console.log('[Caret Browsing] EDITABLE');
    }

    currentMode = mode;

    // 仅当在启用态之间切换时才恢复
    if (savedSelectionRange) {
      restoreSelection();
    }
  }

  // ===== 快捷键 =====
  function onKeyDown(e) {
    if (e.key === 'F7') {
      e.preventDefault();
      if (e.ctrlKey) {
        setMode(MODE_EDITABLE);
      } else {
        setMode(currentMode === MODE_READONLY ? MODE_OFF : MODE_READONLY);
      }
    }
  }

  // ===== Popup 菜单 =====
  function registerMenu() {
    GM_registerMenuCommand('Caret: Readonly / Off', () => {
      setMode(currentMode === MODE_READONLY ? MODE_OFF : MODE_READONLY);
    });
    GM_registerMenuCommand('Caret: Editable', () => {
      setMode(MODE_EDITABLE);
    });
    GM_registerMenuCommand('Caret: Turn Off', () => {
      setMode(MODE_OFF);
    });
  }

  document.addEventListener('keydown', onKeyDown, true);
  registerMenu();

  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    if (currentMode !== MODE_OFF) {
      const body = document.body;
      if (body) {
        if (originalContentEditable === null) {
          body.removeAttribute('contenteditable');
        } else {
          body.setAttribute('contenteditable', originalContentEditable);
        }
        body.removeEventListener('beforeinput', beforeinputHandler, true);
      }
    }
  });
})();