// ==UserScript==
// @name         划词高亮 –（Ctrl+Q）
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @allframes    true
// @description       Highlight selected text with Ctrl+Q, undo with Ctrl+Z
// @description:zh-cn 划词后按 Ctrl+H 高亮，Ctrl+Shift+Z 撤销；支持 iframe
// @license MI/
// @version 0.0.1.20251003040834
// @namespace https://greasyfork.org/users/1521752
// @downloadURL https://update.greasyfork.org/scripts/551416/%E5%88%92%E8%AF%8D%E9%AB%98%E4%BA%AE%20%E2%80%93%EF%BC%88Ctrl%2BQ%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551416/%E5%88%92%E8%AF%8D%E9%AB%98%E4%BA%AE%20%E2%80%93%EF%BC%88Ctrl%2BQ%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const COLOR   = '#fffc79';
  const CLASS   = 'user_hl_' + Math.random().toString(36).slice(2, 8);
  const undoStack = [];

  /* 1. 注入样式 */
  const style = document.createElement('style');
  style.textContent = `mark.${CLASS}{
    background:${COLOR} !important;
    color:inherit !important;
  }`;
  document.head.appendChild(style);

  /* 2. 高亮快捷键：Ctrl+H */
  const KEY_HIGHLIGHT = e => e.ctrlKey && e.key.toLowerCase() === 'q';
  document.addEventListener('keydown', e => {
    if (!KEY_HIGHLIGHT(e)) return;
    e.preventDefault();

    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed) return;

    const range   = sel.getRangeAt(0);
    const content = range.extractContents();
    const mark    = document.createElement('mark');
    mark.className = CLASS;
    mark.appendChild(content);
    range.insertNode(mark);

    undoStack.push(mark);
    sel.removeAllRanges();
    console.log('[Highlight] 已高亮，栈长度=', undoStack.length);
  });

  /* 3. 撤销快捷键：Ctrl+Shift+Z */
  const KEY_UNDO = e => e.ctrlKey && e.key.toLowerCase() === 'z';
  document.addEventListener('keydown', e => {
    if (!KEY_UNDO(e) || !undoStack.length) return;
    e.preventDefault();

    const mark   = undoStack.pop();
    const parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
    console.log('[Highlight] 已撤销，剩余=', undoStack.length);
  });

  console.log('[Highlight] 脚本加载完成，CLASS=', CLASS);
})();
