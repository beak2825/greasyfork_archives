// ==UserScript==
// @name         怪物之巢论坛只看自己
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在帖子页面添加“只看自己”按钮
// @author       User
// @match        *://monster-nest.com/forum*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561971/%E6%80%AA%E7%89%A9%E4%B9%8B%E5%B7%A2%E8%AE%BA%E5%9D%9B%E5%8F%AA%E7%9C%8B%E8%87%AA%E5%B7%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/561971/%E6%80%AA%E7%89%A9%E4%B9%8B%E5%B7%A2%E8%AE%BA%E5%9D%9B%E5%8F%AA%E7%9C%8B%E8%87%AA%E5%B7%B1.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 检查是否有 discuz_uid
  if (typeof discuz_uid === 'undefined') {
    return;
  }

  // 检查是否在帖子内 (含有 tid)
  var pat = /tid=[0-9]+/;
  var reg = new RegExp(pat);
  var tidMatch = reg.exec(location.search);

  // 如果不在帖子内，退出
  if (!tidMatch) {
    return;
  }

  // 尝试寻找顶部的“回复”按钮或者操作区域
  // Discuz 通常在 #pgt (Page Top) 区域
  // 或者寻找 id="post_reply" 或 id="post_replytmp"

  var replyBtn =
    document.getElementById('post_reply') ||
    document.getElementById('post_replytmp');

  // 尝试寻找手机版的操作区域
  var mobileMtit = document.querySelector('div.mtit');
  var mobileAnchor = null;
  var isMobile = false;

  var targetContainer = null;

  if (replyBtn) {
    targetContainer = replyBtn.parentNode;
  } else if (mobileMtit) {
    // 手机版逻辑
    isMobile = true;
    targetContainer = mobileMtit;
    // 寻找“只看楼主”按钮
    var links = mobileMtit.querySelectorAll('a.ytxt');
    for (var i = 0; i < links.length; i++) {
      if (links[i].innerText.indexOf('只看楼主') !== -1) {
        mobileAnchor = links[i];
        break;
      }
    }
  } else {
    // 如果找不到回复按钮，尝试找 #pgt 下面的操作区
    var pgt = document.getElementById('pgt');
    if (pgt) {
      targetContainer = pgt;
    }
  }

  if (!targetContainer) return;

  // 创建“只看自己”按钮
  var onlyMeBtn = document.createElement('a');
  onlyMeBtn.href = 'javascript:;';

  if (isMobile) {
    // 手机版样式
    onlyMeBtn.className = 'ytxt';
  } else {
    // 电脑版样式
    onlyMeBtn.className = 'pgsbtn';
    onlyMeBtn.style.float = 'left';
    onlyMeBtn.style.marginRight = '5px';
  }

  // 初始隐藏，状态确认后再显示
  onlyMeBtn.style.display = 'none';

  // 检查当前是否已经是“只看自己”模式
  var isOnlyMe = location.search.indexOf('authorid=' + discuz_uid) !== -1;
  if (isOnlyMe) {
    onlyMeBtn.innerText = '查看全部';
    onlyMeBtn.title = '查看全部内容';
    onlyMeBtn.style.display = ''; // 已经是模式中，直接显示
  } else {
    onlyMeBtn.innerText = '只看自己';
    onlyMeBtn.title = '只看自己发布的内容';
  }

  onlyMeBtn.onclick = function () {
    var uid = discuz_uid;
    if (isOnlyMe) {
      // 如果已经是只看自己，点击则去除 authorid 参数
      var newSearch = location.search.replace(
        new RegExp('[?&]authorid=' + uid),
        ''
      );
      // 如果去掉后 search 为空或只剩 ?，处理一下 (Discuz 一般总有 tid 等参数，不仅是 ?)
      location.href = location.pathname + newSearch;
    } else {
      // 如果不是只看自己，添加 authorid
      if (location.search) {
        location.search += '&authorid=' + uid;
      } else {
        //理论上不会走到这里因为前面检查了 tid
        location.search = '?authorid=' + uid;
      }
    }
  };

  // 插入按钮
  // 如果找到了 replyBtn，插入到它后面
  if (replyBtn) {
    // 有时候 replyBtn 是一个 img 或者是被 span 包裹的
    // 简单起见，追加到父容器
    replyBtn.parentNode.insertBefore(onlyMeBtn, replyBtn.nextSibling);
  } else if (isMobile && mobileAnchor) {
    // 手机版：插入到“只看楼主”链接后面
    mobileAnchor.parentNode.insertBefore(onlyMeBtn, mobileAnchor.nextSibling);
  } else if (targetContainer) {
    targetContainer.appendChild(onlyMeBtn);
  }

  // --- 新增：检查用户是否在帖子中回复过 ---
  if (!isOnlyMe) {
    checkUserReplyStatus(onlyMeBtn);
  }

  function checkUserReplyStatus(btn) {
    var uid = discuz_uid;
    // 1. 检查当前页面的 DOM 中是否有当前用户的帖子
    // Discuz 中用户链接通常包含 ?uid=UID 或 space-uid-UID.html
    var userLinks = document.querySelectorAll(
      'a[href*="uid=' + uid + '"], a[href*="space-uid-' + uid + '"]'
    );

    // 过滤掉可能存在于非帖子区域（如顶部导航）的链接
    // 通常帖子作者链接在 .authi, .pi, .pls 等 class 下
    var hasPostOnCurrentPage = false;
    for (var i = 0; i < userLinks.length; i++) {
      var link = userLinks[i];
      // 简单的判断：必须在帖子列表容器内 #postlist
      if (link.closest('#postlist')) {
        hasPostOnCurrentPage = true;
        break;
      }
    }

    if (hasPostOnCurrentPage) {
      // 当前页有回复，说明肯定回复过，不做任何处理，保持按钮可用
      btn.style.display = ''; // 发现 DOM 中存在，显示按钮
      return;
    }

    // 2. 如果当前页没找到，需要后台请求（预检）
    // 构造目标 URL
    var targetUrl = location.href;
    if (location.search) {
      targetUrl += '&authorid=' + uid;
    } else {
      targetUrl += '?authorid=' + uid;
    }

    // 稍微延迟一点执行，避免阻塞主页加载
    setTimeout(function () {
      fetch(targetUrl)
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          // 检查返回的 HTML 里面是否包含错误信息
          if (
            html.indexOf('未定义操作') !== -1 ||
            html.indexOf('指定的主题不存在') !== -1
          ) {
            btn.innerText = '未参与';
            btn.title = '您没有参与此话题，无法只看自己的内容';
            btn.style.color = '#999';
            btn.style.backgroundColor = '#f7f7f7';
            btn.style.borderColor = '#ddd';
            btn.style.cursor = 'not-allowed';
            btn.onclick = null; // 移除点击事件
            btn.style.display = ''; // 状态确认完毕，显示（置灰状态）
          } else {
            // 状态确认完毕，显示（可用状态）
            btn.style.display = '';
          }
        })
        .catch(function (err) {
          console.log('检查只看自己状态失败', err);
        });
    }, 500);
  }
})();
