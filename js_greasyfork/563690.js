// ==UserScript==
// @name         Zhihu 折叠图片
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  默认将知乎文章与回答中的图片折叠，提供展开/折叠按钮；
// @author       ZJ
// @match        https://www.zhihu.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563690/Zhihu%20%E6%8A%98%E5%8F%A0%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/563690/Zhihu%20%E6%8A%98%E5%8F%A0%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 仅处理文章与回答区域
  const IMG_SELECTOR = '.RichContent img, .Post-RichTextContainer img';

  // 折叠时应用的样式
  const FOLDED_STYLE = {
    display: 'none',
    objectFit: 'contain',
    overflow: 'hidden',
  };

  // 统一按钮样式
  function styleButton(btn, folded = true) {
    btn.textContent = folded ? '展开图片' : '折叠图片';
    btn.style.margin = '5px';
    btn.style.cursor = 'pointer';
    btn.style.padding = '2px 6px';
    btn.style.fontSize = '12px';
    btn.style.lineHeight = '1';
    btn.style.display = 'inline-block';
    btn.style.verticalAlign = 'top';
    btn.style.border = '1px solid #ccc'
  }

  // 保存原始内联样式
  function saveOriginalInlineStyles(img) {
    if (img.dataset.foldOriginalStyleSaved) return;
    img.dataset.foldOriginalStyleSaved = 'true';
    img.dataset.foldOriginalStyle = img.getAttribute('style') || '';
  }

  // 应用折叠
  function applyFold(img) {
    Object.entries(FOLDED_STYLE).forEach(([k, v]) => {
      img.style[k] = v;
    });
    img.dataset.foldState = 'folded';
  }

  // 取消折叠（恢复原始样式）
  function removeFold(img) {
    img.setAttribute('style', '');
    const original = img.dataset.foldOriginalStyle || '';
    if (original) img.setAttribute('style', original);
    img.dataset.foldState = 'expanded';
  }

  // 创建并插入按钮（作为兄弟节点，不改变父子结构）
  function ensureButton(img) {
    // 已创建过按钮则复用
    if (img.dataset.foldButtonId) {
      const existing = document.getElementById(img.dataset.foldButtonId);
      if (existing) return existing;
    }

    const btn = document.createElement('button');
    styleButton(btn, true);

    // 生成唯一 id
    const id = 'zh-fold-btn-' + Math.random().toString(36).slice(2);
    btn.id = id;
    img.dataset.foldButtonId = id;

    // 将按钮插入到图片前（兄弟节点）
    // 使用 insertAdjacentElement 避免移动/替换 img 本身
    try {
      img.insertAdjacentElement('beforebegin', btn);
    } catch (e) {
      // 如果插入失败（极少数并发），延迟一帧重试
      requestAnimationFrame(() => {
        if (document.contains(img)) {
          try {
            img.insertAdjacentElement('beforebegin', btn);
          } catch (e2) {
            // 最后兜底：插到父节点末尾
            if (img.parentNode) img.parentNode.appendChild(btn);
          }
        }
      });
    }

    // 绑定切换逻辑
    btn.addEventListener('click', () => {
      const folded = img.dataset.foldState === 'folded';
      if (folded) {
        removeFold(img);
        styleButton(btn, false);
      } else {
        applyFold(img);
        styleButton(btn, true);
      }
    });

    return btn;
  }

  // 处理单个图片元素（不移动节点）
  function processImage(img) {
    if (!img || img.dataset.foldProcessed) return;
    if (!document.contains(img)) return;

    img.dataset.foldProcessed = 'true';
    saveOriginalInlineStyles(img);

    // 初始折叠
    applyFold(img);

    // 创建按钮（兄弟节点）
    ensureButton(img);
  }

  // 轻微节流，避免同一批次多次扫描
  let scanScheduled = false;
  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    requestAnimationFrame(() => {
      scanScheduled = false;
      const imgs = document.querySelectorAll(IMG_SELECTOR);
      imgs.forEach(processImage);
    });
  }

  // 初始扫描
  scheduleScan();

  // 监听 DOM 变化（知乎是动态加载的）
  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.body, { childList: true, subtree: true });
})();
