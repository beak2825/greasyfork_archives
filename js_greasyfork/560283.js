// ==UserScript==
// @name         AI 回答折叠
// @namespace    https://github.com/dlddwb/ai-message-folder
// @version      0.1.1
// @description  支持 Chatgpt、腾讯元宝 AI 站点
// @match        https://chatgpt.com/*
// @match        https://yuanbao.tencent.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560283/AI%20%E5%9B%9E%E7%AD%94%E6%8A%98%E5%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/560283/AI%20%E5%9B%9E%E7%AD%94%E6%8A%98%E5%8F%A0.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ======== 1. 站点规则表（域名 -> 块选择器 + 内部锚点） ======== */
  const RULES = {
    /* ----- 已有 ----- */
    'chatgpt.com': {
      block: '[data-message-author-role="assistant"]',
      anchor: '.markdown-body'
    },
    'yuanbao.tencent.com': {
      block: '[data-conv-speaker="ai"]',
      anchor: '[data-conv-speaker="ai"]',
    },
  };

  const host = location.hostname;
  const rule = RULES[host];
  if (!rule) return;          // 不在列表直接退出，不报错

  /* ======== 2. 通用折叠 + 占位 24px ======== */
  function installFold(el) {
    if (el.dataset.foldV3) return;
    el.dataset.foldV3 = '1';

    const btn = document.createElement('div');
    btn.style.cssText = 'cursor:pointer;font-size:12px;color:#999;padding:4px 0';
    btn.innerHTML = '▲ 折叠';
    btn.setAttribute('data-fold-btn', '1');

    el.style.setProperty('--fold-height', '24px');
    const style = document.head.appendChild(document.createElement('style'));
    style.textContent = `
      .folded-v3 > *:not([data-fold-btn]){visibility:hidden;height:0!important;margin:0!important;padding:0!important;}
      .folded-v3{height:var(--fold-height);overflow:hidden;}
    `;

    el.prepend(btn);
    const toggle = () => {
      const folded = el.classList.toggle('folded-v3');
      btn.innerHTML = folded ? '▼ 展开' : '▲ 折叠';
    };
    btn.onclick = toggle;
  }

  /* ======== 3. 自动滚到可视区 ======== */
  function scrollToBlock(el) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const anchor = el.querySelector(rule.anchor) || el;
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250); // 流式站点保险值
    });
  }

  /* ======== 4. 监听新回答 ======== */
  const seen = new WeakSet();
  const mo = new MutationObserver(() => {
    document.querySelectorAll(rule.block).forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      installFold(el);
      scrollToBlock(el);
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
