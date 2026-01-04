// ==UserScript==
// @name         怪物之巢论坛显示帖子 TID
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在 怪物之巢 论坛板块列表中显示帖子 TID
// @author       白翳羽
// @match        *://monster-nest.com/forum*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561024/%E6%80%AA%E7%89%A9%E4%B9%8B%E5%B7%A2%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BA%E5%B8%96%E5%AD%90%20TID.user.js
// @updateURL https://update.greasyfork.org/scripts/561024/%E6%80%AA%E7%89%A9%E4%B9%8B%E5%B7%A2%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BA%E5%B8%96%E5%AD%90%20TID.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function addTid() {
    // --- 电脑版逻辑 ---
    // 查找所有普通帖子和置顶帖子的 tbody
    var threads = document.querySelectorAll(
      'tbody[id^="normalthread_"], tbody[id^="stickthread_"]'
    );

    threads.forEach(function (tbody) {
      if (tbody.getAttribute('data-tid-added') === 'true') return;

      var idParts = tbody.id.split('_');
      if (idParts.length < 2) return;
      var tid = idParts[1];

      var titleLink =
        tbody.querySelector('a.s.xst') ||
        tbody.querySelector('th a[href*="viewthread"]');

      if (titleLink) {
        var tidSpan = document.createElement('span');
        tidSpan.innerText = '#' + tid + ' ';
        tidSpan.style.color = '#888';
        tidSpan.style.fontSize = '11px';
        tidSpan.style.marginRight = '4px';
        tidSpan.style.fontFamily = 'monospace';

        titleLink.parentNode.insertBefore(tidSpan, titleLink);
        tbody.setAttribute('data-tid-added', 'true');
      }
    });

    // --- 手机版逻辑 ---
    // 查找所有帖子列表项
    var mobileThreads = document.querySelectorAll('li.list');
    mobileThreads.forEach(function (li) {
      if (li.getAttribute('data-tid-added') === 'true') return;

      // 查找包含 tid 的链接
      var link = li.querySelector('a[href*="tid="]');
      if (!link) return;

      var href = link.getAttribute('href');
      var match = href.match(/[?&]tid=(\d+)/);
      if (!match) return;
      var tid = match[1];

      // 查找标题容器 .threadlist_tit
      var titleDiv = li.querySelector('.threadlist_tit');
      if (titleDiv) {
        var tidSpan = document.createElement('span');
        tidSpan.innerText = '#' + tid + ' ';
        tidSpan.style.color = '#888';
        tidSpan.style.fontSize = '12px';
        tidSpan.style.marginRight = '4px';
        tidSpan.style.fontFamily = 'monospace';

        // 尝试插入到 em (标题文本) 之前
        var em = titleDiv.querySelector('em');
        if (em) {
          titleDiv.insertBefore(tidSpan, em);
        } else {
          // 如果没有 em，尝试插入到 micon (图标) 之后，或者最前面
          var micon = titleDiv.querySelector('.micon');
          if (micon && micon.nextSibling) {
            titleDiv.insertBefore(tidSpan, micon.nextSibling);
          } else if (micon) {
            titleDiv.appendChild(tidSpan);
          } else {
            titleDiv.insertBefore(tidSpan, titleDiv.firstChild);
          }
        }
        li.setAttribute('data-tid-added', 'true');
      }
    });
  }
  // 页面加载完成后执行
  addTid();

  // 监听 DOM 变化，以支持自动加载下一页或动态内容的站点 (可选)
  var observer = new MutationObserver(function (mutations) {
    addTid();
  });

  var container = document.getElementById('threadlisttableid');
  if (container) {
    observer.observe(container, { childList: true, subtree: true });
  } else {
    // 如果找不到列表容器，就监听 body
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
