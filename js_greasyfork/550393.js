// ==UserScript==
// @name         菜鸟教程-阅读模式-licat优化
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  菜鸟教程将页面次要内容移除，优化阅读体验，让菜鸟教程再次伟大！licat优化：1.更新样式，真正实现宽屏 2.添加侧栏折叠按钮，可完全折叠并保持状态
// @author       yankj12 & licat
// @match        *://www.runoob.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550393/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B-%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F-licat%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/550393/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B-%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F-licat%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 将右侧侧教程列表隐藏，优化打印效果
(function() {
  'use strict';

  // 移除右侧教程列表
  const rightColumn = document.querySelector("div.right-column");
  if (rightColumn) {
    rightColumn.remove();
    console.log('移除右侧侧教程列表');
  }

  // 移除右侧回到顶部等功能按钮
  const fixedBtn = document.querySelector("div.fixed-btn");
  if (fixedBtn) {
    fixedBtn.remove();
    console.log('移除右侧侧回到顶部等功能按钮');
  }

  // 移除顶部导航栏
  const navigation = document.querySelector("div.navigation");
  if (navigation) {
    navigation.remove();
    console.log('移除顶部顶部导航栏');
  }

  // 移除顶部logo及搜索框
  const logoSearch = document.querySelector("div.logo-search");
  if (logoSearch) {
    logoSearch.remove();
    console.log('移除顶部logo及搜索框');
  }

  // 移除底部分享
  const respond = document.getElementById("respond");
  if (respond) {
    respond.remove();
    console.log('移除底部分享');
  }

  // 移除底部广告
  const articleHeadingAd = document.querySelector("div.article-heading-ad");
  if (articleHeadingAd) {
    articleHeadingAd.remove();
    console.log('移除底部广告');
  }

  // 移除反馈按钮
  const feedbackBtn = document.querySelector(".feedback-btn");
  if (feedbackBtn) {
    feedbackBtn.remove();
  }

  // 移除底部备案号等信息
  const footer = document.getElementById("footer");
  if (footer) {
    footer.remove();
    console.log('移除底部备案号等信息');
  }

  // 移除底部广告
  const adBoxes = document.querySelectorAll("div.ad-box");
  adBoxes.forEach(ad => ad.remove());

  const googleIframes = document.querySelectorAll('iframe[name^="google"]');
  googleIframes.forEach(iframe => iframe.remove());

  // 动态添加 CSS 类样式表
  function addCSSClass() {
    const style = document.createElement('style');
    style.id = 'dynamic-styles';

    // 定义 CSS 类规则
    const cssRules = `
      .myflexrow {
        display: flex;
        flex-wrap: wrap-reverse;
        justify-content: center;
      }
      .myflexcol {
        flex-grow: 1;
      }

      /* 侧栏折叠相关样式 */
      .left-column {
        display: flex;
        flex-direction: column;
        transition: width 0.3s ease, background-color 0.3s ease;
      }
      .left-column.sidebar-collapsed {
        width: 60px !important;
        background-color: #f2f2f2 !important;
      }
      .left-column.sidebar-collapsed .sidebar-box {
        display: none !important;
      }
      .left-column.sidebar-collapsed .tab span {
        display: none !important;
      }
      .left-column .tab {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        cursor: default;
      }
      #sidebar-toggle-btn {
        display: inline-block;
        color: #333;
        font-size: 1.5em;
        line-height: 28px;
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      .left-column.sidebar-collapsed #sidebar-toggle-btn {
        transform: rotate(90deg);
      }

      /* runoob-col-md2 折叠样式 */
      .runoob-col-md2 {
        transition: width 0.3s ease; /* 添加过渡效果 */
      }
      .runoob-col-md2.sidebar-collapsed {
        width: 60px !important; /* 折叠时宽度 */
      }
    `;

    style.appendChild(document.createTextNode(cssRules));

    const existingStyle = document.getElementById('dynamic-styles');
    if (existingStyle) {
      existingStyle.replaceWith(style);
    } else {
      document.head.appendChild(style);
    }

    console.log('CSS 样式类已添加！');
  }

  // 为元素应用动态添加的类
  function applyClass() {
    const row = document.querySelector('div.container.main>.row');
    const colmiddlecolumn = document.querySelector('div.col.middle-column');

    if (row) {
      row.className = 'myflexrow';
    }
    if (colmiddlecolumn) {
      colmiddlecolumn.classList.add('myflexcol');
    }
  }

  addCSSClass();
  applyClass();

  console.log('更改中间列为更宽的样式，以便于阅读');


  function initSidebarToggle() {
    // 获取关键元素
    const leftCol = document.querySelector('div.left-column');
    const tab = leftCol ? leftCol.querySelector('.tab') : null;
    const runoobCol = document.querySelector('div.runoob-col-md2'); // 获取外层容器
    const storageKey = 'runoob_vue_sidebar_collapsed';
    leftCol.className = 'left-column';

    if (!leftCol || !tab) return;

    // 1. 创建折叠/展开按钮
    const toggleBtn = document.createElement('a');
    toggleBtn.id = 'sidebar-toggle-btn';
    toggleBtn.href = 'javascript:void(0)';
    toggleBtn.title = '折叠侧栏';
    toggleBtn.textContent = '≡';
    toggleBtn.addEventListener('click', toggleSidebar);

    // 插入按钮到"夜间模式"按钮前
    const moonBtn = tab.querySelector('#moon');
    if (moonBtn && moonBtn.parentNode) {
      moonBtn.parentNode.insertBefore(toggleBtn, moonBtn);
    } else {
      tab.appendChild(toggleBtn);
    }

    // 2. 状态初始化
    function initSidebarState() {
      const isCollapsed = localStorage.getItem(storageKey) === 'true';
      if (isCollapsed) {
        leftCol.classList.add('sidebar-collapsed');
        if (runoobCol) runoobCol.classList.add('sidebar-collapsed');
        toggleBtn.title = '展开侧栏';
        toggleBtn.textContent = '≡';
      } else {
        leftCol.classList.remove('sidebar-collapsed');
        if (runoobCol) runoobCol.classList.remove('sidebar-collapsed');
        toggleBtn.title = '折叠侧栏';
        toggleBtn.textContent = '≡';
      }
      console.log(`侧栏初始状态：${isCollapsed ? '折叠' : '展开'}`);
    }

    // 3. 折叠/展开核心逻辑
    function toggleSidebar() {
      const isCollapsed = leftCol.classList.contains('sidebar-collapsed');
      const newState = !isCollapsed;

      // 同时更新内层和外层容器的状态
      if (newState) {
        leftCol.classList.add('sidebar-collapsed');
        if (runoobCol) runoobCol.classList.add('sidebar-collapsed');
      } else {
        leftCol.classList.remove('sidebar-collapsed');
        if (runoobCol) runoobCol.classList.remove('sidebar-collapsed');
      }

      // 更新按钮提示
      toggleBtn.title = newState ? '展开侧栏' : '折叠侧栏';
      // 持久化状态
      localStorage.setItem(storageKey, newState);
    }

    // 初始化侧栏状态
    initSidebarState();
  }

  // 页面加载完成后执行
  function DOMContentLoaded() {
    // 仅在有左侧栏的页面执行
    const leftColumn = document.querySelector('div.left-column');
    if (leftColumn) {
      initSidebarToggle();
      console.log('侧栏折叠功能已初始化');
    }

    // 移除列表图标
    const listIcons = document.querySelectorAll("i.fa.fa-list");
    listIcons.forEach(icon => icon.remove());
  }

  // 检查文档是否已加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', DOMContentLoaded);
  } else {
    DOMContentLoaded();
  }
})();
