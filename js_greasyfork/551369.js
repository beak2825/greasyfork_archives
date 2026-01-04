// ==UserScript==
// @name         解锁PTA终端复制方式（选中即复制｜右键粘贴）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在拼题A（PTA、Pintia）上提供"终端式"复制/粘贴：选中即自动复制，右键即可粘贴，按住 Shift+右键仍可呼出原生菜单。（助力每位同学提升操作效率，快速完成文本复制与代码输入）
// @author       MadelineCarter
// @match        https://pintia.cn/*
// @match        https://*.pintia.cn/*
// @run-at       document-start
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/551369/%E8%A7%A3%E9%94%81PTA%E7%BB%88%E7%AB%AF%E5%A4%8D%E5%88%B6%E6%96%B9%E5%BC%8F%EF%BC%88%E9%80%89%E4%B8%AD%E5%8D%B3%E5%A4%8D%E5%88%B6%EF%BD%9C%E5%8F%B3%E9%94%AE%E7%B2%98%E8%B4%B4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551369/%E8%A7%A3%E9%94%81PTA%E7%BB%88%E7%AB%AF%E5%A4%8D%E5%88%B6%E6%96%B9%E5%BC%8F%EF%BC%88%E9%80%89%E4%B8%AD%E5%8D%B3%E5%A4%8D%E5%88%B6%EF%BD%9C%E5%8F%B3%E9%94%AE%E7%B2%98%E8%B4%B4%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const COPY_ON_SELECT = true;

  const isEditable = (el) =>
    el &&
    (el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA' ||
      el.isContentEditable);

  const toast = (() => {
    let el;
    return (msg, ms = 1200) => {
      if (!document.body) return;
      if (!el) {
        el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.top = '12px';
        el.style.right = '12px';
        el.style.background = 'rgba(0,0,0,0.8)';
        el.style.color = '#fff';
        el.style.padding = '8px 10px';
        el.style.borderRadius = '6px';
        el.style.fontSize = '13px';
        el.style.zIndex = '2147483647';
        el.style.transition = 'opacity .2s ease';
        el.style.opacity = '0';
        document.body.appendChild(el);
      }
      el.textContent = msg;
      el.style.opacity = '1';
      clearTimeout(el._t);
      el._t = setTimeout(() => (el.style.opacity = '0'), ms);
    };
  })();

  const copyText = async (text) => {
    if (!text || !text.trim()) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast('已复制');
        return true;
      }
    } catch (_) {}
    // 退化方案：execCommand
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      ta.style.pointerEvents = 'none';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) {
        toast('已复制');
        return true;
      }
    } catch (_) {}
    toast('复制失败：请手动 Ctrl+C');
    return false;
  };

  const readClipboard = async () => {
    if (navigator.clipboard && navigator.clipboard.readText) {
      try {
        return await navigator.clipboard.readText();
      } catch (_) {}
    }
    return null;
  };

  const insertIntoInput = (input, text) => {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const value = input.value ?? '';
    input.value = value.slice(0, start) + text + value.slice(end);
    const caret = start + text.length;
    input.selectionStart = input.selectionEnd = caret;
  };

  const insertIntoContentEditable = (text) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      document.execCommand('insertText', false, text);
      return;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const getInputSelectionText = (el) => {
    if (!el || !(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return '';
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    if (end > start) return (el.value || '').slice(start, end);
    return '';
  };

  const hasWindowSelectionText = () => {
    const s = window.getSelection();
    return !!(s && s.toString().trim());
  };

  // 右键：有选中则复制；可编辑区域右键则粘贴；Shift+右键保留原生菜单
  const onContextMenu = async (e) => {
    if (e.shiftKey) return; // 允许原生菜单
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;

    // 输入框内有选区优先复制
    const inputSel = getInputSelectionText(target);
    if (inputSel) {
      await copyText(inputSel);
      return;
    }
    // 页面选区复制
    if (hasWindowSelectionText()) {
      await copyText(window.getSelection().toString());
      return;
    }

    // 无选区：在可编辑区域右键 -> 粘贴
    if (isEditable(target)) {
      const text = await readClipboard();
      if (text !== null) {
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          insertIntoInput(target, text);
        } else {
          insertIntoContentEditable(text);
        }
        toast('已粘贴');
      } else {
        toast('无法读取剪贴板：请使用 Ctrl+V');
      }
      return;
    }

    // 其它区域提示
    toast('选中即复制；在输入框右键粘贴');
  };

  // 选中即复制：仅在左键松开时触发，避免右键造成误触
  const onMouseUpCopy = async (e) => {
    if (!COPY_ON_SELECT) return;
    if (e.button !== 0) return; // 仅左键
    const t = e.target;

    // 输入框/文本域选中即复制
    const inputSel = getInputSelectionText(t);
    if (inputSel) {
      await copyText(inputSel);
      return;
    }

    // 普通文档/可编辑区域选中即复制
    const s = window.getSelection();
    const text = s ? s.toString().trim() : '';
    if (text) {
      await copyText(text);
    }
  };

  // 捕获阶段绑定，尽量早于站点脚本
  document.addEventListener('contextmenu', onContextMenu, true);
  document.addEventListener('mouseup', onMouseUpCopy, true);
})();

/*
    This script is not licensed for use, modification, or distribution.
    All rights are reserved by the author.
*/
