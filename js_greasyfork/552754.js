// ==UserScript==
// @name         腾讯文档增强：用户名字复制
// @namespace    http://tampermonkey.net/
// @version      2025-10-16
// @description  在用户展开中添加复制名字选项
// @author       饼干Biscuits
// @match        https://docs.qq.com/*
// @grant        none
// @license      MIT
// @icon         https://vfiles.gtimg.cn/vupload/20210330/649d261617073126052.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552754/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E5%A2%9E%E5%BC%BA%EF%BC%9A%E7%94%A8%E6%88%B7%E5%90%8D%E5%AD%97%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/552754/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E5%A2%9E%E5%BC%BA%EF%BC%9A%E7%94%A8%E6%88%B7%E5%90%8D%E5%AD%97%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  let lastRow = null;

  // 1) 记录最近点击的那一行（用你页面的行容器）
  ['pointerdown','mousedown','click'].forEach(type=>{
    document.addEventListener(type, (e) => {
      const row =
        e.target.closest('.dui-menu-contextmenu') ||
        e.target.closest('.record-item-box') ||
        e.target.closest('.dui-trigger');
      if (row) lastRow = row;
    }, true);
  });

  // 2) 从“当前可见的下拉”推断行（当 lastRow 为空时兜底）
  function inferRowFromVisibleDropdown() {
    const dd = document.querySelector('.dui-dropdown.more-setting-dropdown.dui-dropdown-visible');
    if (!dd) return null;
    return (
      dd.closest('.dui-menu-contextmenu') ||
      dd.closest('.record-item-box') ||
      dd.closest('.dui-trigger')
    );
  }

  // 3) 在一行内寻找“名字”的函数（放宽候选选择器）
  const NAME_SELECTORS = [
    '.item-content .item-name',
    '.item-name',
    '[data-field="name"]',
    '[data-username]',
    '[data-nickname]'
  ];
  function getNameFromRow(row) {
    if (!row) return null;
    for (const sel of NAME_SELECTORS) {
      const el = row.querySelector(sel);
      const t = el?.textContent?.trim();
      if (t) return t;
    }
    return null;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
  }
  function toast(msg) {
    const tip = document.createElement('div');
    tip.textContent = msg;
    tip.style.cssText = `
      position: fixed; left: 50%; top: 20px; transform: translateX(-50%);
      background: rgba(0,0,0,.78); color:#fff; padding:8px 12px; border-radius:6px;
      font-size:12px; z-index:2147483647; opacity:0; transition:opacity .15s; pointer-events:none;
    `;
    document.body.appendChild(tip);
    requestAnimationFrame(()=> tip.style.opacity = '1');
    setTimeout(()=> { tip.style.opacity = '0'; setTimeout(()=> tip.remove(), 180); }, 1200);
  }

  const observer = new MutationObserver(() => {
    const menu = document.querySelector('ul.dui-menu.dui-menu-normal.modify-delete-tools-menu');
    if (menu && !menu.querySelector('.dui-menu-item.copy-name-item')) {
      const sampleItem = menu.querySelector('.dui-menu-item');
      if (!sampleItem) return;

      const newItem = sampleItem.cloneNode(true);
      newItem.classList.add('copy-name-item');
      (newItem.querySelector('.dui-menu-item-text-container') || newItem).textContent = '复制名字';

      newItem.addEventListener('click', async (ev) => {
        ev.stopPropagation();
        // 先用 lastRow，再用可见下拉推断
        const row = lastRow || inferRowFromVisibleDropdown();
        const name = getNameFromRow(row);

        console.log('[复制名称] row=', row, ' name=', name);
        if (!name) { toast('未找到名称'); return; }

        await copyText(name);
        toast(`已复制：${name}`);
      });

      menu.appendChild(newItem);
      console.log('✅ 已添加带功能的「复制名称」菜单项');
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();