// ==UserScript==
// @name         禁止新标签页打开网页
// @description  禁止新标签页打开链接
// @author       zzzxxx
// @version      0.1
// @include         http://*
// @include         https://*
// @match             *://*/*
// @namespace https://greasyfork.org/users/325204
// @downloadURL https://update.greasyfork.org/scripts/563344/%E7%A6%81%E6%AD%A2%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/563344/%E7%A6%81%E6%AD%A2%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==
// 1. 重写window.open，彻底拦截JS主动新建窗口
const originalOpen = window.open;
window.open = function(url, target, features) {
  // 强制将target改为_self，无视传入的_blank等参数
  const newTarget = '_self';
  // 调用原始open方法，但强制在当前窗口打开
  return originalOpen.call(window, url, newTarget, features);
};

// 2. 统一处理所有<a>标签和<form>标签（包括动态加载的）
function handleAllJumpElements() {
  // 处理超链接：强制target="_self"
  document.querySelectorAll('a').forEach(link => {
    link.setAttribute('target', '_self');
    // 拦截click事件中可能的自定义新窗口逻辑
    link.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止其他脚本覆盖行为
      this.target = '_self'; // 再次确保target正确
    });
  });

  // 处理表单：防止表单提交到新窗口
  document.querySelectorAll('form').forEach(form => {
    form.setAttribute('target', '_self');
  });
}

// 3. 初始执行，处理页面已加载的元素
handleAllJumpElements();

// 4. 监听DOM变化，处理动态加载的元素（如AJAX渲染的链接）
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length > 0) {
      handleAllJumpElements();
    }
  });
});

// 配置观察者：监听整个文档的所有子节点变化
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});