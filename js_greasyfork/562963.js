// ==UserScript==
// @name         视频解析跳转
// @namespace    http://tampermonkey.net/
// @version      2026-01-17 01
// @description  右下角按钮，通过 GM_openInTab 新标签页打开解析
// @match        https://v.qq.com/x/cover/*
// @include      *://*.youku.com/*
// @include      *://m.youku.com/v*
// @include      *://m.youku.com/a*
// @include      *://v.youku.com/v_*
// @include      *://*.iqiyi.com/*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.iqiyi.com/adv*
// @include      *v.qq.com/*
// @include      *v.qq.com/x/cover/*
// @include      *v.qq.com/x/page/*
// @include      *v.qq.com/play*
// @include      *v.qq.com/cover*
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562963/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/562963/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function createBtn(text, bottom, parseBaseUrl) {
    const btn = document.createElement('div');
    btn.textContent = text;

    btn.style.position = 'fixed';
    btn.style.right = '16px';
    btn.style.bottom = bottom;
    btn.style.zIndex = '99999';

    // 🔽 尺寸与视觉优化
    btn.style.padding = '6px 10px';
    btn.style.fontSize = '12px';
    btn.style.lineHeight = '1';
    btn.style.borderRadius = '999px';

    // 🔽 配色与质感
    btn.style.background = 'linear-gradient(135deg, #ff784f, #ff5c38)';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.userSelect = 'none';
    btn.style.boxShadow = '0 4px 10px rgba(255,92,56,0.35)';
    btn.style.transition = 'all 0.2s ease';

    // 🔽 悬停效果
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 6px 14px rgba(255,92,56,0.45)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 4px 10px rgba(255,92,56,0.35)';
    });

    btn.addEventListener('click', () => {
      const url = parseBaseUrl + encodeURIComponent(location.href);
      GM_openInTab(url, { active: true, insert: true });
    });

    document.body.appendChild(btn);
  }

  // 按钮 1：XM
  createBtn(
    'XM 解析',
    '20px',
    'https://jx.xmflv.com/?url='
  );

  // 按钮 2：盘古
  createBtn(
    '盘古解析',
    '56px',
    'https://www.pangujiexi.com/jiexi/?url='
  );

})();
