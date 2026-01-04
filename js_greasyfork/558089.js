// ==UserScript==
// @name         Civitai 模型标签折叠/展开（箭头）
// @namespace    https://civitai.com/
// @version      1.3
// @description  把横向滚动的版本标签改成折叠/展开；按钮常态为圆形箭头，悬停显示文字；SVG 三角 14×14 像素居中。
// @author       莲华
// @match        https://civitai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558089/Civitai%20%E6%A8%A1%E5%9E%8B%E6%A0%87%E7%AD%BE%E6%8A%98%E5%8F%A0%E5%B1%95%E5%BC%80%EF%BC%88%E7%AE%AD%E5%A4%B4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558089/Civitai%20%E6%A8%A1%E5%9E%8B%E6%A0%87%E7%AD%BE%E6%8A%98%E5%8F%A0%E5%B1%95%E5%BC%80%EF%BC%88%E7%AE%AD%E5%A4%B4%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---- 可调参数 ---- */
  const COLLAPSED_HEIGHT = 48;        // px：折叠时可见高度
  const BTN_TXT_EXPAND   = '展开更多';
  const BTN_TXT_COLLAPSE = '收起';
  const MIN_BUTTON_COUNT = 8;         // 少于此数量不插折叠按钮
  const SCAN_INTERVAL    = 800;       // ms：MutationObserver 节流
  /* ------------------ */

  /* ========== 主逻辑 ========== */
  function patchOnce() {
    document
      .querySelectorAll('.ModelVersionList_scrollContainer__TAcPN:not([data-cvt-ready])')
      .forEach(container => {
        const btnCount = container.querySelectorAll('button.mantine-Button-root,button[data-variant]').length;
        if (btnCount < MIN_BUTTON_COUNT) {
          container.setAttribute('data-cvt-ready', 'skip');
          return;
        }
        container.setAttribute('data-cvt-ready', '1');

        /* 隐藏原左右箭头 & 自带滚动条 */
        container.querySelectorAll(
          '.ModelVersionList_leftArrow___3_v7, .ModelVersionList_rightArrow__1FEFo, .mantine-ScrollArea-scrollbar'
        ).forEach(el => (el.style.display = 'none'));

        /* 外层包裹以便控制 max-height */
        const wrapper = document.createElement('div');
        wrapper.className = 'cvt-wrapper';
        Object.assign(wrapper.style, {
          position: 'relative',
          overflow: 'hidden',
          maxHeight: `${COLLAPSED_HEIGHT}px`,
          transition: 'max-height .3s cubic-bezier(.4,1.3,.5,1)',
          marginBottom: '20px'
        });
        container.parentNode.insertBefore(wrapper, container);
        wrapper.appendChild(container);

        /* 让内部 .mantine-Group-root 支持自动换行 */
        container.querySelectorAll('.mantine-Group-root').forEach(g => {
          g.style.flexWrap = 'wrap';
          g.style.setProperty('--group-wrap', 'wrap');
        });

        /* ===== 折叠 / 展开按钮 ===== */
        const btn = document.createElement('button');
        btn.className = 'cvt-toggle-btn';
        btn.type = 'button';
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = `
          <span class="cvt-arrow-box">
            <svg class="cvt-arrow" viewBox="0 0 24 24">
              <polygon points="6,9 18,9 12,15" fill="white"></polygon>
            </svg>
          </span>
          <span class="cvt-label">${BTN_TXT_EXPAND}</span>
        `;
        wrapper.appendChild(btn);

        /* helper：更新箭头方向 & 文字 */
        const setState = (isOpen) => {
          btn.setAttribute('data-open', isOpen);
          btn.setAttribute('aria-expanded', isOpen);
          btn.querySelector('.cvt-label').textContent = isOpen ? BTN_TXT_COLLAPSE : BTN_TXT_EXPAND;
          const polygon = isOpen
            ? '6,15 18,15 12,9'   // 上箭头
            : '6,9 18,9 12,15';  // 下箭头
          btn.querySelector('.cvt-arrow polygon').setAttribute('points', polygon);
        };
        let open = false;
        btn.onclick = () => {
          open = !open;
          setState(open);
          if (open) {
            wrapper.style.maxHeight = container.scrollHeight + 32 + 'px';
          } else {
            wrapper.style.maxHeight = COLLAPSED_HEIGHT + 'px';
            wrapper.scrollIntoView({ behavior: 'auto', block: 'nearest' });
          }
        };
        setState(false);

        /* 展开后内容变化/窗口尺寸变化时同步高度 */
        const sync = () => {
          if (open) wrapper.style.maxHeight = container.scrollHeight + 32 + 'px';
        };
        new MutationObserver(sync).observe(container, { childList: true, subtree: true });
        window.addEventListener('resize', sync);
      });
  }

  /* ==== 监听单页应用 DOM 变化 ==== */
  let timer;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(patchOnce, SCAN_INTERVAL);
  };
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', patchOnce);
  setTimeout(patchOnce, 1500);

  /* ========== 样式 ========== */
  const css = `
    .cvt-toggle-btn{
      all:unset;               /* 清除浏览器默认按钮样式 */
      position:absolute; right:8px; top:8px;
      display:flex; align-items:center; gap:6px;
      height:32px; width:32px; min-width:32px;
      padding:0;
      background:rgba(34,34,34,.88);
      border-radius:16px; cursor:pointer; user-select:none;
      box-shadow:0 1px 6px #0006;
      transition:width .2s,min-width .2s,padding .2s,background .2s,box-shadow .2s;
      overflow:hidden;
    }
    .cvt-toggle-btn:hover,
    .cvt-toggle-btn:focus{width:auto;min-width:120px;padding:0 16px 0 12px;background:#111b;box-shadow:0 2px 8px #000c;}
    .cvt-toggle-btn:active{opacity:.85;}

    /* 箭头容器： Flex 绝对居中 */
    .cvt-arrow-box{display:flex;align-items:center;justify-content:center;width:32px;height:32px;flex:0 0 32px;}
    .cvt-arrow{width:14px;height:14px;display:block;}

    /* 文字初始透明 → 悬停/聚焦渐显 */
    .cvt-label{opacity:0;white-space:nowrap;transition:opacity .15s .05s;}
    .cvt-toggle-btn:hover .cvt-label,
    .cvt-toggle-btn:focus .cvt-label{opacity:1;}

    /* 外层包裹 */
    .cvt-wrapper{border-radius:8px;}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
