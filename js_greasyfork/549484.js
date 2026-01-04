// ==UserScript==
// @name         知乎问题仅显示文字回答/仅显示带图回答
// @namespace    https://example.com/zhihu-answer-toggle
// @version      1.11.0
// @description  左侧竖排三个按钮，显示“仅图文：是/否”“仅文字：是/否”“恢复默认显示”，按钮圆角改为8px
// @match        https://www.zhihu.com/question/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549484/%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E4%BB%85%E6%98%BE%E7%A4%BA%E6%96%87%E5%AD%97%E5%9B%9E%E7%AD%94%E4%BB%85%E6%98%BE%E7%A4%BA%E5%B8%A6%E5%9B%BE%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/549484/%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E4%BB%85%E6%98%BE%E7%A4%BA%E6%96%87%E5%AD%97%E5%9B%9E%E7%AD%94%E4%BB%85%E6%98%BE%E7%A4%BA%E5%B8%A6%E5%9B%BE%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const config = {
    bgOn: '#10b981',
    bgOff: '#6b7280',
    bgDefault: '#6c757d',
    opacity: 0.8,
    spacing: 10
  };

  const STORAGE = 'zhihu_answer_filter_settings';
  const state = JSON.parse(localStorage.getItem(STORAGE)) || {
    enabledImage: false,
    enabledText: false,
    enabledDefault: false,
    pos: { top: null, left: null }
  };

  // 样式
  const style = document.createElement('style');
  style.textContent = `
    .zhfilter-toggle {
      padding: 6px 10px;
      border-radius: 8px; /* 修改圆角为8px */
      color: #fff;
      font-size: 12px;
      cursor: pointer;
      user-select: none;
      opacity: ${config.opacity};
      transition: background 0.2s;
      display: block;
      margin-bottom: ${config.spacing}px;
      text-align: center;
    }
    .zhimgfilter-hidden { display: none !important; }
    #zhfilter-container {
      position: fixed;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: 999999;
    }
  `;
  document.head.appendChild(style);

  function hasImage(node) {
    return !!node.querySelector('article img, .RichText img, .RichContent img, figure img');
  }

  function applyFilter() {
    document.querySelectorAll('.List-item, .AnswerItem, [itemprop="answer"]').forEach(item => {
      const showImage = hasImage(item);
      let hide = false;

      if (state.enabledImage) hide = !showImage;
      if (state.enabledText) hide = state.enabledText && showImage;
      if (state.enabledDefault) hide = false;

      item.classList.toggle('zhimgfilter-hidden', hide);
    });
  }

  function ensureToggle() {
    let container = document.getElementById('zhfilter-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'zhfilter-container';
      document.body.appendChild(container);
    }

    container.innerHTML = '';

    const btnImage = document.createElement('div');
    btnImage.className = 'zhfilter-toggle';
    btnImage.textContent = `仅图文：${state.enabledImage ? '是' : '否'}`;
    btnImage.style.background = state.enabledImage ? config.bgOn : config.bgOff;
    btnImage.onclick = () => {
      state.enabledImage = !state.enabledImage;
      state.enabledDefault = false;
      localStorage.setItem(STORAGE, JSON.stringify(state));
      ensureToggle();
      applyFilter();
    };

    const btnText = document.createElement('div');
    btnText.className = 'zhfilter-toggle';
    btnText.textContent = `仅文字：${state.enabledText ? '是' : '否'}`;
    btnText.style.background = state.enabledText ? config.bgOn : config.bgOff;
    btnText.onclick = () => {
      state.enabledText = !state.enabledText;
      state.enabledDefault = false;
      localStorage.setItem(STORAGE, JSON.stringify(state));
      ensureToggle();
      applyFilter();
    };

    const btnDefault = document.createElement('div');
    btnDefault.className = 'zhfilter-toggle';
    btnDefault.textContent = '恢复默认显示';
    btnDefault.style.background = config.bgDefault;
    btnDefault.onclick = () => {
      state.enabledImage = false;
      state.enabledText = false;
      state.enabledDefault = true;
      localStorage.setItem(STORAGE, JSON.stringify(state));
      ensureToggle();
      applyFilter();
    };

    container.appendChild(btnImage);
    container.appendChild(btnText);
    container.appendChild(btnDefault);
  }

  // 右键菜单
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand(state.enabledImage ? '关闭仅图文' : '开启仅图文', () => {
      state.enabledImage = !state.enabledImage;
      state.enabledDefault = false;
      localStorage.setItem(STORAGE, JSON.stringify(state));
      ensureToggle();
      applyFilter();
    });
    GM_registerMenuCommand(state.enabledText ? '关闭仅文字' : '开启仅文字', () => {
      state.enabledText = !state.enabledText;
      state.enabledDefault = false;
      localStorage.setItem(STORAGE, JSON.stringify(state));
      ensureToggle();
      applyFilter();
    });
    GM_registerMenuCommand('恢复默认显示', () => {
      state.enabledImage = false;
      state.enabledText = false;
      state.enabledDefault = true;
      localStorage.setItem(STORAGE, JSON.stringify(state));
      ensureToggle();
      applyFilter();
    });
    GM_registerMenuCommand('重置按钮位置', () => {
      state.pos = { top: null, left: null };
      localStorage.setItem(STORAGE, JSON.stringify(state));
      ensureToggle();
    });
  }

  new MutationObserver(muts => {
    if (muts.some(m => [...m.addedNodes].some(n => n.nodeType === 1))) applyFilter();
  }).observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { ensureToggle(); applyFilter(); });
  } else {
    ensureToggle();
    applyFilter();
  }
})();
