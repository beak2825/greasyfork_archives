// ==UserScript==
// @name 小号内卷机
// @namespace https://www.luogu.com.cn/user/745171
// @description 帮助你将页面中所有出现的小号名字替换成大号名字，支持修改名字颜色。
// @version 1.0
// @author Po7ed
// @license MIT
// @match *://www.luogu.com.cn/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/556736/%E5%B0%8F%E5%8F%B7%E5%86%85%E5%8D%B7%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/556736/%E5%B0%8F%E5%8F%B7%E5%86%85%E5%8D%B7%E6%9C%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const FROM = '填入你的成小号名字';
  const TO = '填入你的大号名字';

  function isLeaf(el) {
    // 如果子元素也包含文本，说明不是最小的
    for (const child of el.children) {
      if ((child.innerText || '').includes(FROM)) return false;
    }
    return true;
  }

  function hideLeafSpans() {
    const ti=document.querySelector('head title');
    if(ti && (ti.innerText || '').includes(FROM))ti.innerHTML = TO + ' - 个人中心 - 洛谷';
    document.querySelectorAll('span, a').forEach(el => {
      if ((el.innerText || '').includes(FROM) && isLeaf(el)) {
        // el.style.setProperty('display', 'none', 'important');
        el.innerHTML = TO;
        // if(window.getComputedStyle(el).color!="rgb(254, 76, 97)")
      }
      if((el.innerText || '').includes(TO) && isLeaf(el)) {
        if(el.className!='router-link-active router-link-exact-active'&&el.parentElement.className!='luogu-username user-name'&&el.style.color!="inherit") {
            el.style.color = 'var(--lfe-color--pink-3) !important'; // 默认替换为红名
        }
      }
    });
  }

  // 页面初次渲染
  hideLeafSpans();

  // 动态变化监听
  const observer = new MutationObserver(hideLeafSpans);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
