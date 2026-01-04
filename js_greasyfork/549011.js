// ==UserScript==
// @name         Bilibili 主页推荐卡片版权内容屏蔽
// @namespace    https://github.com/rainpenber/mktk-my-tampermonkey-scripts/tree/main/scripts/bilibili_feedcard_filter
// @version      1.0.0
// @description  屏蔽B站主页推荐流中的版权内容卡片（电影、课堂、电视剧、国创 等等）
// @author       Rainpenber
// @license      MIT
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549011/Bilibili%20%E4%B8%BB%E9%A1%B5%E6%8E%A8%E8%8D%90%E5%8D%A1%E7%89%87%E7%89%88%E6%9D%83%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/549011/Bilibili%20%E4%B8%BB%E9%A1%B5%E6%8E%A8%E8%8D%90%E5%8D%A1%E7%89%87%E7%89%88%E6%9D%83%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CATEGORY_LABELS = [
    '电影',
    '课堂',
    '电视剧',
    '国创',
    '综艺',
    '纪录片',
    '漫画',
    '直播',
    '番剧',
  ];

  const STORAGE_KEY = 'bili_filter_blocked_categories_v1';

  function readBlocked() {
    const saved = GM_getValue(STORAGE_KEY, []);
    if (Array.isArray(saved)) return new Set(saved);
    return new Set();
  }

  function writeBlocked(blockedSet) {
    GM_setValue(STORAGE_KEY, Array.from(blockedSet));
  }

  function hideCard(card) {
    if (!card) return;
    card.style.display = 'none';
    card.setAttribute('data-bili-filter-hidden', '1');
  }

  function showCard(card) {
    if (!card) return;
    card.style.display = '';
    card.removeAttribute('data-bili-filter-hidden');
  }

  function getCardTitleElement(root) {
    // 结构：div.container.is-version8 内部的 div.floor-single-card > div.floor-card-inner > div.cover-container > a > div.badge > span.floor-title
    // 这里尽量兼容 class 变化，使用层级选择器并校验类名包含关系
    const badgeSpan = root.querySelector(
      ':scope div.floor-card-inner div.cover-container a div.badge span'
    );
    return badgeSpan;
  }

  function getCardCategoryText(card) {
    try {
      const span = getCardTitleElement(card);
      if (!span) return '';
      return (span.textContent || '').trim();
    } catch (_) {
      return '';
    }
  }

  function isTargetCard(node) {
    if (!(node instanceof HTMLElement)) return false;
    if (!node.classList) return false;
    // 只处理 floor-single-card
    return node.classList.contains('floor-single-card');
  }

  function filterOneCard(card, blockedSet) {
    const category = getCardCategoryText(card);
    if (!category) {
      // 无法识别类别则不处理
      return;
    }
    if (blockedSet.has(category)) {
      hideCard(card);
    } else {
      showCard(card);
    }
  }

  function scanAndFilter(container, blockedSet) {
    if (!container) return;
    const cards = container.querySelectorAll('div.floor-single-card');
    cards.forEach((card) => filterOneCard(card, blockedSet));
  }

  function setupObserver(container, blockedSetRef) {
    if (!container) return;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => {
            if (isTargetCard(node)) {
              filterOneCard(node, blockedSetRef.current);
            } else if (node instanceof HTMLElement) {
              // 子树中可能也有新增卡片
              const innerCards = node.querySelectorAll('div.floor-single-card');
              innerCards.forEach((c) => filterOneCard(c, blockedSetRef.current));
            }
          });
        }
      }
    });
    observer.observe(container, { childList: true, subtree: true });
    return observer;
  }

  function ensureStyles() {
    GM_addStyle(`
      .bili-filter-dialog-mask { position: fixed; inset: 0; background: rgba(0,0,0,.25); z-index: 99998; }
      .bili-filter-dialog { position: fixed; z-index: 99999; width: 360px; max-width: 92vw; background: #fff; color: #222; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.18); left: 50%; top: 64px; transform: translateX(-50%); font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, PingFang SC, Microsoft YaHei, sans-serif; }
      .bili-filter-dialog header { padding: 12px 16px; font-weight: 600; border-bottom: 1px solid rgba(0,0,0,.06); display: flex; align-items: center; justify-content: space-between; }
      .bili-filter-dialog .content { padding: 12px 16px; max-height: 60vh; overflow: auto; }
      .bili-filter-dialog .actions { padding: 12px 16px; display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid rgba(0,0,0,.06); }
      .bili-filter-chip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .bili-filter-chip { display: flex; align-items: center; gap: 6px; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; user-select: none; }
      .bili-filter-chip input { pointer-events: none; }
      .bili-filter-btn { padding: 6px 12px; border-radius: 6px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; }
      .bili-filter-btn.primary { background: #00AEEC; color: #fff; border-color: #00AEEC; }
      .bili-filter-close { cursor: pointer; opacity: .7; }
      .bili-filter-close:hover { opacity: 1; }
    `);
  }

  function openDialog(blockedSet, onChange, onClose) {
    ensureStyles();

    const mask = document.createElement('div');
    mask.className = 'bili-filter-dialog-mask';
    const dialog = document.createElement('div');
    dialog.className = 'bili-filter-dialog';

    const header = document.createElement('header');
    header.innerHTML = '<span>屏蔽推荐类型</span><span class="bili-filter-close">✕</span>';

    const content = document.createElement('div');
    content.className = 'content';

    const grid = document.createElement('div');
    grid.className = 'bili-filter-chip-grid';

    const checkboxRefs = new Map();
    CATEGORY_LABELS.forEach((label) => {
      const chip = document.createElement('label');
      chip.className = 'bili-filter-chip';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = blockedSet.has(label);
      const span = document.createElement('span');
      span.textContent = label;
      chip.appendChild(input);
      chip.appendChild(span);
      chip.addEventListener('click', (e) => {
        // label 默认会切换 checked，此处延迟读取
        setTimeout(() => {
          if (input.checked) {
            blockedSet.add(label);
          } else {
            blockedSet.delete(label);
          }
          onChange(new Set(blockedSet));
        }, 0);
      });
      grid.appendChild(chip);
      checkboxRefs.set(label, input);
    });

    content.appendChild(grid);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const btnSelectAll = document.createElement('button');
    btnSelectAll.className = 'bili-filter-btn';
    btnSelectAll.textContent = '一键全选';
    btnSelectAll.addEventListener('click', () => {
      CATEGORY_LABELS.forEach((l) => {
        blockedSet.add(l);
        const ref = checkboxRefs.get(l); if (ref) ref.checked = true;
      });
      onChange(new Set(blockedSet));
    });

    const btnDisableAll = document.createElement('button');
    btnDisableAll.className = 'bili-filter-btn';
    btnDisableAll.textContent = '一键禁用';
    btnDisableAll.addEventListener('click', () => {
      blockedSet.clear();
      CATEGORY_LABELS.forEach((l) => { const ref = checkboxRefs.get(l); if (ref) ref.checked = false; });
      onChange(new Set(blockedSet));
    });

    const btnOk = document.createElement('button');
    btnOk.className = 'bili-filter-btn primary';
    btnOk.textContent = '完成';
    btnOk.addEventListener('click', close);

    actions.appendChild(btnSelectAll);
    actions.appendChild(btnDisableAll);
    actions.appendChild(btnOk);

    dialog.appendChild(header);
    dialog.appendChild(content);
    dialog.appendChild(actions);

    function close() {
      document.body.removeChild(mask);
      document.body.removeChild(dialog);
      onClose && onClose();
    }

    mask.addEventListener('click', close);
    header.querySelector('.bili-filter-close')?.addEventListener('click', close);

    document.body.appendChild(mask);
    document.body.appendChild(dialog);
  }

  function main() {
    const container = document.querySelector('div.container.is-version8');
    if (!container) {
      // 等待首页容器出现
      const readyObserver = new MutationObserver(() => {
        const c = document.querySelector('div.container.is-version8');
        if (c) {
          readyObserver.disconnect();
          initWithContainer(c);
        }
      });
      readyObserver.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
      });
      return;
    }
    initWithContainer(container);
  }

  function initWithContainer(container) {
    const blockedSet = readBlocked();
    const blockedRef = { current: blockedSet };

    // 初始扫描
    scanAndFilter(container, blockedRef.current);

    // 观察新增
    const obs = setupObserver(container, blockedRef);

    // 存储变更联动
    GM_addValueChangeListener(STORAGE_KEY, (_k, _o, n) => {
      const next = new Set(Array.isArray(n) ? n : []);
      blockedRef.current = next;
      scanAndFilter(container, blockedRef.current);
    });

    // 菜单项
    GM_registerMenuCommand('设置屏蔽的推荐类型', () => {
      const working = new Set(blockedRef.current);
      openDialog(working, (updated) => {
        blockedRef.current = new Set(updated);
        writeBlocked(blockedRef.current);
        scanAndFilter(container, blockedRef.current);
      });
    });
  }

  // 尝试尽早启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();


