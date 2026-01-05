// ==UserScript==
// @name         Linux.do 自动阅读
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在 linux.do 网站自动滚动阅读帖子
// @author       Eric
// @match        *://linux.do/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558714/Linuxdo%20%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/558714/Linuxdo%20%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 可配置参数
  const SCROLL_INTERVAL = 500; // 滚动间隔（毫秒）
  const SCROLL_DISTANCE = 80; // 每次滚动距离（像素）
  const MIN_REPLIES = 100; // 最小回复数阈值

  // 存储键名
  const STORAGE_CURRENT_POST = "auto_read_current_post";
  const STORAGE_READ_POSTS = "auto_read_read_posts";
  const STORAGE_IS_RUNNING = "auto_read_is_running";

  let isAutoReading = false;
  let scrollTimer = null;

  // 获取已阅读的帖子列表
  function getReadPosts() {
    try {
      const data = localStorage.getItem(STORAGE_READ_POSTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // 保存已阅读的帖子
  function saveReadPost(postUrl) {
    const readPosts = getReadPosts();
    if (!readPosts.includes(postUrl)) {
      readPosts.push(postUrl);
      localStorage.setItem(STORAGE_READ_POSTS, JSON.stringify(readPosts));
    }
  }

  // 获取当前正在阅读的帖子
  function getCurrentPost() {
    return localStorage.getItem(STORAGE_CURRENT_POST);
  }

  // 设置当前正在阅读的帖子
  function setCurrentPost(postUrl) {
    if (postUrl) {
      localStorage.setItem(STORAGE_CURRENT_POST, postUrl);
    } else {
      localStorage.removeItem(STORAGE_CURRENT_POST);
    }
  }

  // 获取运行状态
  function getIsRunning() {
    return localStorage.getItem(STORAGE_IS_RUNNING) === "true";
  }

  // 设置运行状态
  function setIsRunning(running) {
    if (running) {
      localStorage.setItem(STORAGE_IS_RUNNING, "true");
    } else {
      localStorage.removeItem(STORAGE_IS_RUNNING);
    }
  }

  // 创建控制面板
  function createControlPanel() {
    const panel = document.createElement("div");
    panel.id = "auto-read-panel";
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 99999;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-size: 14px;
    `;

    // 状态显示
    const status = document.createElement("div");
    status.id = "auto-read-status";
    status.style.cssText = "margin-bottom: 10px; color: #666;";
    status.textContent = "状态: 待机中";
    panel.appendChild(status);

    // 开始/停止按钮
    const btn = document.createElement("button");
    btn.id = "auto-read-btn";
    btn.textContent = "开始自动阅读";
    btn.style.cssText = `
      padding: 8px 15px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-right: 5px;
    `;
    btn.addEventListener("click", toggleAutoRead);
    panel.appendChild(btn);

    // 清除记录按钮
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "清除记录";
    clearBtn.style.cssText = `
      padding: 8px 15px;
      background-color: #ff9800;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    `;
    clearBtn.addEventListener("click", () => {
      if (confirm("确定要清除所有阅读记录吗？")) {
        localStorage.removeItem(STORAGE_READ_POSTS);
        localStorage.removeItem(STORAGE_CURRENT_POST);
        updateStatus("记录已清除");
      }
    });
    panel.appendChild(clearBtn);

    // 已读数量显示
    const countDiv = document.createElement("div");
    countDiv.id = "auto-read-count";
    countDiv.style.cssText = "margin-top: 10px; color: #999; font-size: 12px;";
    countDiv.textContent = `已读帖子: ${getReadPosts().length}`;
    panel.appendChild(countDiv);

    document.body.appendChild(panel);
  }

  // 更新状态显示
  function updateStatus(text) {
    const status = document.getElementById("auto-read-status");
    if (status) {
      status.textContent = `状态: ${text}`;
    }
    const countDiv = document.getElementById("auto-read-count");
    if (countDiv) {
      countDiv.textContent = `已读帖子: ${getReadPosts().length}`;
    }
  }

  // 切换自动阅读状态
  function toggleAutoRead() {
    const btn = document.getElementById("auto-read-btn");
    if (!btn) return;

    if (isAutoReading) {
      stopAutoRead();
      btn.textContent = "开始自动阅读";
      btn.style.backgroundColor = "#4CAF50";
      updateStatus("已停止");
    } else {
      startAutoRead();
      btn.textContent = "停止自动阅读";
      btn.style.backgroundColor = "#f44336";
    }
  }

  // 判断当前页面类型
  function getPageType() {
    const url = window.location.href;
    if (url.includes("/t/topic/") || url.match(/\/t\/[^/]+\/\d+/)) {
      return "post";
    }
    if (url.includes("/unread") || url.includes("/latest")) {
      return "list";
    }
    return "other";
  }

  // 从列表页获取符合条件的帖子
  function getQualifiedPosts() {
    const readPosts = getReadPosts();
    const posts = [];
    const rows = document.querySelectorAll("td.num.posts-map.posts.topic-list-data");

    rows.forEach((td) => {
      const link = td.querySelector("a.badge-posts");
      const numberSpan = td.querySelector("span.number");

      if (link && numberSpan) {
        const href = link.getAttribute("href");
        const replies = parseInt(numberSpan.textContent.trim(), 10);
        const fullUrl = `https://linux.do${href}`;

        // 检查是否已读
        const postId = href.match(/\/t\/[^/]+\/(\d+)/)?.[1] || href;
        const isRead = readPosts.some((p) => p.includes(postId));

        if (replies >= MIN_REPLIES && !isRead) {
          posts.push({
            url: fullUrl,
            replies: replies,
            postId: postId,
          });
        }
      }
    });

    return posts;
  }

  // 检查是否到达帖子底部
  function isAtPostBottom() {
    return document.getElementById("topic-footer-buttons") !== null && isElementInViewport(document.getElementById("topic-footer-buttons"));
  }

  // 检查元素是否在视口中
  function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight;
  }

  // 开始自动阅读
  function startAutoRead() {
    isAutoReading = true;
    setIsRunning(true);
    const pageType = getPageType();

    if (pageType === "other") {
      // 检查是否有正在阅读的帖子
      const currentPost = getCurrentPost();
      if (currentPost) {
        updateStatus("继续阅读上次帖子...");
        window.location.href = currentPost;
        return;
      }
      // 没有则跳转到新帖列表
      updateStatus("跳转到新帖列表...");
      window.location.href = "https://linux.do/unread";
      return;
    }

    if (pageType === "list") {
      handleListPage();
      return;
    }

    if (pageType === "post") {
      handlePostPage();
    }
  }

  // 处理列表页
  function handleListPage() {
    updateStatus("扫描帖子列表...");
    const posts = getQualifiedPosts();

    if (posts.length === 0) {
      updateStatus("没有找到符合条件的帖子");
      stopAutoRead();
      return;
    }

    // 选择第一个符合条件的帖子
    const targetPost = posts[0];
    updateStatus(`找到 ${posts.length} 个帖子，进入阅读...`);
    setCurrentPost(targetPost.url);
    window.location.href = targetPost.url;
  }

  // 处理帖子页
  function handlePostPage() {
    const currentUrl = window.location.href;
    setCurrentPost(currentUrl);
    updateStatus("正在阅读...");

    scrollTimer = setInterval(() => {
      // 检查是否到达底部
      if (isAtPostBottom()) {
        updateStatus("帖子阅读完成，寻找下一个...");

        // 标记为已读
        saveReadPost(currentUrl);
        setCurrentPost(null);

        // 停止滚动
        clearInterval(scrollTimer);
        scrollTimer = null;

        // 延迟后跳转到列表页选择下一个帖子
        setTimeout(() => {
          window.location.href = "https://linux.do/unread";
        }, 1000);
        return;
      }

      // 继续滚动
      window.scrollBy(0, SCROLL_DISTANCE);
    }, SCROLL_INTERVAL);
  }

  // 停止自动阅读
  function stopAutoRead() {
    isAutoReading = false;
    setIsRunning(false);
    if (scrollTimer) {
      clearInterval(scrollTimer);
      scrollTimer = null;
    }
  }

  // 页面加载完成后初始化
  function init() {
    createControlPanel();

    // 检查是否需要自动恢复运行状态
    if (getIsRunning()) {
      // 恢复按钮状态
      const btn = document.getElementById("auto-read-btn");
      if (btn) {
        btn.textContent = "停止自动阅读";
        btn.style.backgroundColor = "#f44336";
      }
      // 延迟一点启动，等待页面完全加载
      setTimeout(() => {
        startAutoRead();
      }, 1000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
