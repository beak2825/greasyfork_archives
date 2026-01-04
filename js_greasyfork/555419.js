// ==UserScript==
// @name         百度新版多平台搜索助手（知乎/小红书/B站/微博/抖音/贴吧）
// @license MI
// @version      2.0
// @description  在百度新版搜索框旁添加多个常用平台搜索按钮，一键跨平台搜索相同关键词
// @match        *://www.baidu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1536350
// @downloadURL https://update.greasyfork.org/scripts/555419/%E7%99%BE%E5%BA%A6%E6%96%B0%E7%89%88%E5%A4%9A%E5%B9%B3%E5%8F%B0%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B%EF%BC%88%E7%9F%A5%E4%B9%8E%E5%B0%8F%E7%BA%A2%E4%B9%A6B%E7%AB%99%E5%BE%AE%E5%8D%9A%E6%8A%96%E9%9F%B3%E8%B4%B4%E5%90%A7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555419/%E7%99%BE%E5%BA%A6%E6%96%B0%E7%89%88%E5%A4%9A%E5%B9%B3%E5%8F%B0%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B%EF%BC%88%E7%9F%A5%E4%B9%8E%E5%B0%8F%E7%BA%A2%E4%B9%A6B%E7%AB%99%E5%BE%AE%E5%8D%9A%E6%8A%96%E9%9F%B3%E8%B4%B4%E5%90%A7%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 🔍 各平台搜索链接模板
  const sites = [
    { name: '知乎', url: 'https://www.zhihu.com/search?q=' },
    { name: '小红书', url: 'https://www.xiaohongshu.com/search_result?keyword=' },
    { name: 'B站', url: 'https://search.bilibili.com/all?keyword=' },
    { name: '微博', url: 'https://s.weibo.com/weibo?q=' },
    { name: '抖音', url: 'https://www.douyin.com/search/' },
    { name: '贴吧', url: 'https://tieba.baidu.com/f?ie=utf-8&kw=' }
  ];

  // 🎨 按钮样式模板
  function styleButton(btn) {
    Object.assign(btn.style, {
      background: '#4E6EF2',
      color: '#fff',
      border: 'none',
      padding: '6px 10px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13.5px',
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '38px',
      lineHeight: '38px',
      transition: '0.15s',
      whiteSpace: 'nowrap',
    });
    btn.addEventListener('mouseenter', () => (btn.style.opacity = '0.9'));
    btn.addEventListener('mouseleave', () => (btn.style.opacity = '1'));
  }

  // 🎯 强制输入框与按钮等高
  function forceEqualHeight(input, refBtn) {
    if (!input || !refBtn) return;
    const h = refBtn.getBoundingClientRect().height || 38;
    const css = `
      height: ${h}px !important;
      line-height: ${h}px !important;
      padding: 0 10px !important;
      font-size: 14px !important;
      border-radius: 6px !important;
      box-sizing: border-box !important;
      display: inline-block !important;
      vertical-align: middle !important;
    `;
    input.setAttribute('style', css);

    const wrapper = input.parentElement;
    if (wrapper && wrapper.style) {
      wrapper.style.height = h + 'px';
      wrapper.style.display = 'inline-flex';
      wrapper.style.alignItems = 'center';
    }
  }

  // 🚀 主函数
  function addButtons() {
    const submitBtn = document.querySelector('#chat-submit-button');
    if (!submitBtn) return false;

    const input =
      document.querySelector('input[name="wd"]') ||
      document.querySelector('input[type="search"]') ||
      document.querySelector('input') ||
      document.querySelector('textarea');
    if (!input) return false;

    if (document.querySelector('#multi-search-buttons')) return true; // 避免重复添加

    const container = document.createElement('div');
    container.id = 'multi-search-buttons';
    Object.assign(container.style, {
      display: 'inline-flex',
      gap: '8px',
      marginLeft: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
      verticalAlign: 'middle',
      maxWidth: '600px',
    });

    sites.forEach((site) => {
      const btn = document.createElement('button');
      btn.textContent = site.name;
      styleButton(btn);
      btn.addEventListener('click', () => {
        const query = (input.value || '').trim();
        if (query) {
          window.open(site.url + encodeURIComponent(query), '_blank');
        } else {
          alert('请输入搜索关键词');
        }
      });
      container.appendChild(btn);
    });

    // 插入到百度搜索按钮后方
    submitBtn.parentNode.insertBefore(container, submitBtn.nextSibling);

    // 延时调整输入框样式匹配按钮高度
    setTimeout(() => {
      const refBtn = container.querySelector('button');
      forceEqualHeight(input, refBtn);
    }, 100);

    return true;
  }

  // 👀 监听页面动态变化
  const observer = new MutationObserver(() => addButtons());
  observer.observe(document.body, { childList: true, subtree: true });

  addButtons();
})();
