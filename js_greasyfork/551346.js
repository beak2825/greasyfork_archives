// ==UserScript==
// @name         Linux.do随机帖子浏览（新版点赞 + 限制提示）
// @name:en      Browse random posts on Linux.do (new like logic + wait hint)
// @name:zh-CN   Linux.do随机帖子浏览（新版点赞 + 限制提示）
// @namespace    https://greasyfork.org/zh-CN/users/1222064-jsbay
// @version      1.6.0
// @description  为 Linux.do 添加自动滚动、自动点赞（新版实现）以及点赞限制提示等功能
// @description:en  Auto‑scroll + auto‑like (new API) with wait‑time hint for Linux.do
// @description:zh-CN  为 Linux.do 添加自动滚动、自动点赞（新版实现）以及点赞限制提示等功能
// @author       EEP
// @license      MIT
// @match        https://linux.do/*
// @icon         https://linux.do/favicon.ico
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551346/Linuxdo%E9%9A%8F%E6%9C%BA%E5%B8%96%E5%AD%90%E6%B5%8F%E8%A7%88%EF%BC%88%E6%96%B0%E7%89%88%E7%82%B9%E8%B5%9E%20%2B%20%E9%99%90%E5%88%B6%E6%8F%90%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551346/Linuxdo%E9%9A%8F%E6%9C%BA%E5%B8%96%E5%AD%90%E6%B5%8F%E8%A7%88%EF%BC%88%E6%96%B0%E7%89%88%E7%82%B9%E8%B5%9E%20%2B%20%E9%99%90%E5%88%B6%E6%8F%90%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // -------------------------------------------------
  // ① 基础变量 & 常量
  // -------------------------------------------------
  if (window.self !== window.top) {
    showToast("检测到 iframe 环境，脚本不会运行", 3000, "error");
    return;
  }

  let isRunning = false;
  let currentTimeout = null;
  let observer = null; // 预留占位，后面不再使用
  const likedPosts = new Set(); // 已成功点赞的 postId
  let scrollCount = 0; // 本页已滚动次数
  let maxScrollCount = 0; // 本页目标滚动次数
  let scrollSinceRefresh = 0; // 自上次刷新后的滚动次数

  const MAX_SCROLL_BEFORE_REFRESH = 20; // 每 20 次滚动刷新一次页面
  const MIN_TOPIC_ID = 800000;
  const MAX_TOPIC_ID = 1000000;

  // -------------------------------------------------
  // ② Toast（提示）函数
  // -------------------------------------------------
  function showToast(message, duration = 3000, type = "info") {
    const existing = document.getElementById("scroll-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "scroll-toast";
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.top = "55px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "20px";
    toast.style.zIndex = "10000";
    toast.style.fontSize = "14px";
    toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    toast.style.transition = "opacity 0.3s ease";
    toast.style.opacity = "0";

    // 背景颜色
    switch (type) {
      case "error":
        toast.style.backgroundColor = "#f44336";
        break;
      case "warning":
        toast.style.backgroundColor = "#ff9800";
        break;
      case "success":
        toast.style.backgroundColor = "#4CAF50";
        break;
      default:
        toast.style.backgroundColor = "var(--primary)";
        break;
    }
    toast.style.color = "white";

    document.body.appendChild(toast);
    setTimeout(() => (toast.style.opacity = "1"), 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // -------------------------------------------------
  // ②‑1 时间格式化函数（新增）
  // -------------------------------------------------
  /**
   * 把秒数转换为 “X小时Y分钟Z秒” 的中文描述。
   *   - 当小时为 0 时省略 “0小时”
   *   - 当分钟为 0 时省略 “0分钟”
   *   - 永远保留秒数（即使为 0）
   *
   * @param {number} sec 要格式化的秒数（整数或可被 Math.floor 处理的数值）
   * @returns {string} 格式化后的字符串，例如 "1小时2分钟3秒"
   */
  function formatWaitTime(sec) {
    const total = Math.max(0, Math.floor(sec)); // 防止负数或小数
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    const parts = [];
    if (h) parts.push(`${h}小时`);
    if (m) parts.push(`${m}分钟`);
    // 秒数始终显示（即使为 0）
    parts.push(`${s}秒`);

    return parts.join("");
  }

  // -------------------------------------------------
  // ③ 创建控制按钮（仅 ▶，无背景、无 padding，居中）
  // -------------------------------------------------
  function createControlButton() {
    const headerIcons = document.querySelector("ul.icons.d-header-icons");
    if (!headerIcons) {
      setTimeout(createControlButton, 500);
      return;
    }

    // li – 居中
    const li = document.createElement("li");
    li.id = "auto-browser-li";
    li.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
        `;

    // button – 绿色/红色、无背景、无 padding、稍大
    const button = document.createElement("button");
    button.id = "auto-browser-btn";
    button.title = "开始浏览";
    button.className = "btn no-text btn-icon icon btn-flat";
    button.style.cssText = `
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 14px;
            width: 36px;
            height: 36px;
            line-height: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, color 0.2s ease;
            color: rgb(0,128,0);   /* 未运行时绿色 */
        `;

    // 图标（仅 ▶ / ■），字体 25px
    const icon = document.createElement("span");
    icon.textContent = "▶";
    icon.style.fontSize = "25px";
    icon.style.transition = "transform 0.3s ease";
    button.appendChild(icon);

    // 简易波纹（视觉反馈）
    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.cssText = `
            position: absolute;
            top: 50%; left: 50%;
            width: 0; height: 0;
            background: rgba(255,255,255,0.5);
            border-radius: 50%;
            transform: translate(-50%,-50%);
            transition: width 0.6s, height 0.6s, opacity 0.6s;
            pointer-events: none;
        `;
    button.appendChild(ripple);

    // 悬停效果
    button.addEventListener("mouseenter", () => {
      button.title = isRunning ? "停止浏览" : "开始浏览";
      button.style.transform = "translateY(-2px)";
      icon.style.transform = isRunning
        ? "rotate(90deg) scale(1.1)"
        : "scale(1.2)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
      icon.style.transform = isRunning ? "rotate(0deg)" : "scale(1)";
    });

    // 点击 – 波纹 + 切换状态
    button.addEventListener("click", () => {
      ripple.style.width = ripple.style.height = "0";
      ripple.style.opacity = "1";
      setTimeout(() => {
        ripple.style.width = ripple.style.height = "200px";
        ripple.style.opacity = "0";
      }, 10);
      toggleBrowsing();
    });

    li.appendChild(button);
    headerIcons.appendChild(li);
    return button;
  }

  // -------------------------------------------------
  // ④ 占位函数（原来的观察器已不再使用）
  // -------------------------------------------------
  function setupLikeObserver() {
    // 这里保留空实现，防止 "setupLikeObserver is not defined" 错误。
    // 如有需要，可在此处重新实现 MutationObserver。
  }

  // -------------------------------------------------
  // ⑤ 状态切换（开始 / 停止）以及按钮渲染
  // -------------------------------------------------
  function toggleBrowsing() {
    if (isRunning) stopBrowsing();
    else startBrowsing();
    updateButtonState();
  }

  function startBrowsing() {
    isRunning = true;
    saveRunningState(true);
    showToast("开始自动浏览帖子…", 3000, "success");
    setupLikeObserver(); // 仍保留调用，只是空实现
    visitRandomTopic(); // 直接进入随机帖子
  }

  function stopBrowsing() {
    isRunning = false;
    saveRunningState(false);
    if (currentTimeout) clearTimeout(currentTimeout);
    if (observer) observer.disconnect();
    scrollCount = maxScrollCount = scrollSinceRefresh = 0;
    likedPosts.clear();
    showToast("已停止自动浏览", 3000, "warning");
  }

  function updateButtonState() {
    const btn = document.getElementById("auto-browser-btn");
    const icon = btn?.querySelector("span");
    if (!btn) return;

    if (isRunning) {
      btn.title = "停止浏览";
      btn.style.color = "red";
      icon.textContent = "■";
    } else {
      btn.title = "开始浏览";
      btn.style.color = "rgb(0,128,0)"; // 绿色
      icon.textContent = "▶";
    }
    icon.style.fontSize = "25px";
  }

  // -------------------------------------------------
  // ⑥ 点赞（新版）——滚动后统一处理
  // -------------------------------------------------
  /** 获取 CSRF token（Discourse 站点通用） */
  function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute("content") : "";
  }

  /** 检查是否已到达 "等待点赞" 的时间点 */
  function canLikeNow() {
    const waitUntil = Number(localStorage.getItem("like_wait_until") || "0");
    return Date.now() >= waitUntil;
  }

  /** 将等待时间写入 localStorage */
  function setLikeWait(seconds) {
    const waitUntil = Date.now() + seconds * 1000;
    localStorage.setItem("like_wait_until", waitUntil.toString());
    // 已在调用处统一提示，无需在这里再弹 toast
  }

  /** 获取今天的日期字符串 (YYYY-MM-DD) */
  function getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /** 获取今日点赞次数 */
  function getTodayLikeCount() {
    const today = getTodayDateString();
    const storedDate = localStorage.getItem("like_count_date");

    // 如果日期不是今天，重置计数
    if (storedDate !== today) {
      localStorage.setItem("like_count_date", today);
      localStorage.setItem("like_count", "0");
      return 0;
    }

    return Number(localStorage.getItem("like_count") || "0");
  }

  /** 增加并返回今日点赞次数 */
  function incrementLikeCount() {
    const today = getTodayDateString();
    const storedDate = localStorage.getItem("like_count_date");

    // 如果日期不是今天，重置计数
    if (storedDate !== today) {
      localStorage.setItem("like_count_date", today);
      localStorage.setItem("like_count", "1");
      return 1;
    }

    const currentCount = Number(localStorage.getItem("like_count") || "0");
    const newCount = currentCount + 1;
    localStorage.setItem("like_count", newCount.toString());
    return newCount;
  }

  /** 对单个 postId 执行点赞请求 */
  async function likePost(postId) {
    if (likedPosts.has(postId)) return null; // 已经点赞过

    // 每次点赞前都检查并提示剩余等待时间
    if (!canLikeNow()) return null;

    const url = `https://linux.do/discourse-reactions/posts/${postId}/custom-reactions/heart/toggle.json`;
    const token = getCsrfToken();

    try {
      const resp = await fetch(url, {
        method: "PUT", // 使用 PUT 方法
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
          Accept: "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await resp.json();

      if (resp.ok) {
        likedPosts.add(postId);
        const todayCount = incrementLikeCount();
        return { success: true, postId, count: todayCount }; // 返回成功状态和今日计数
      } else {
        const waitSec = data?.extras?.wait_seconds;
        if (typeof waitSec === "number") {
          setLikeWait(waitSec);
          // 使用 formatWaitTime 把秒数转为 "X小时Y分钟Z秒"
          const txt = formatWaitTime(waitSec);
          showToast(`点赞受限，${txt}后可再次尝试`, 4000, "warning");
        } else {
          console.warn("点赞失败且未返回 wait_seconds", data);
        }
        return null;
      }
    } catch (e) {
      console.error("点赞请求异常", e);
      return null;
    }
  }

  /** 批量遍历当前页面可见的帖子并尝试点赞 */
  async function processVisiblePostsForLike() {
    if (!isRunning) return null;

    if (!canLikeNow()) return null;

    // 1. 先找到所有的点赞按钮
    const likeButtons = document.querySelectorAll(
      'div.discourse-reactions-reaction-button[title="点赞此帖子"]'
    );
    const postIds = new Set(); // 使用 Set 去重

    // 2. 对每个点赞按钮，向上查找包含 data-post-id 的 article 元素
    likeButtons.forEach((button) => {
      // 向上查找最近的 article.onscreen-post 元素
      const article = button.closest("article.onscreen-post");
      if (article) {
        const postId = article.getAttribute("data-post-id");
        if (postId) postIds.add(postId);
      }
    });

    // 3. 过滤掉已经点赞过的帖子
    const availablePostIds = Array.from(postIds).filter(
      (id) => !likedPosts.has(id)
    );

    if (availablePostIds.length === 0) {
      console.log("没有找到未点赞的帖子");
      return null;
    }

    // 4. 随机选择一个帖子进行点赞
    const randomIndex = Math.floor(Math.random() * availablePostIds.length);
    const selectedPostId = availablePostIds[randomIndex];

    console.log(
      `从 ${availablePostIds.length} 个可点赞帖子中随机选择了: ${selectedPostId}`
    );
    return await likePost(selectedPostId);
  }

  // -------------------------------------------------
  // ⑦ 随机帖子获取 & 检查（保持原实现）
  // -------------------------------------------------
  function generateRandomTopicId() {
    return (
      Math.floor(Math.random() * (MAX_TOPIC_ID - MIN_TOPIC_ID + 1)) +
      MIN_TOPIC_ID
    );
  }

  async function checkTopicExists(id) {
    try {
      const resp = await fetch(`https://linux.do/t/topic/${id}`, {
        method: "HEAD",
        cache: "no-cache",
      });
      return resp.ok;
    } catch (e) {
      showToast(`检查帖子 ${id} 出错: ${e.message}`, 5000, "error");
      return false;
    }
  }

  async function findValidTopicId(maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
      const id = generateRandomTopicId();
      showToast(`尝试检查帖子 ${id} (${i + 1}/${maxAttempts})`, 2000);
      if (await checkTopicExists(id)) {
        showToast(`找到有效帖子 ${id}`, 2000, "success");
        return id;
      }
      if (i < maxAttempts - 1) await new Promise((r) => setTimeout(r, 5000));
      if (!isRunning) {
        showToast("检测到停止信号，终止搜索", 2000, "warning");
        return null;
      }
    }
    showToast("未找到有效帖子，使用默认帖子", 2000, "warning");
    return 969670;
  }

  // -------------------------------------------------
  // ⑧ 访问帖子（随机或关联）
  // -------------------------------------------------
  function getRelatedTopics() {
    const container = document.querySelector("div.more-topics__lists");
    if (!container) return null;
    const links = container.querySelectorAll('a[href*="/t/topic/"]');
    const ids = [];
    links.forEach((l) => {
      const m = l.getAttribute("href").match(/\/t\/topic\/(\d+)/);
      if (m) ids.push(parseInt(m[1], 10));
    });
    return ids.length ? ids : null;
  }

  function getRandomTopics() {
    const links = document.querySelectorAll('a[href*="/t/topic/"]');
    const ids = [];
    links.forEach((l) => {
      const m = l.getAttribute("href").match(/\/t\/topic\/(\d+)/);
      if (m) ids.push(parseInt(m[1], 10));
    });
    return ids.length ? ids : null;
  }

  async function visitRandomTopic(topicId = null) {
    if (!isRunning) return;
    try {
      let finalId = topicId;
      if (!finalId) {
        const related = getRelatedTopics();
        const random = getRandomTopics();
        if (related && related.length) {
          finalId = related[Math.floor(Math.random() * related.length)];
          showToast(`使用关联帖子 ${finalId}`, 2000, "success");
        } else if (random && random.length) {
          finalId = random[Math.floor(Math.random() * random.length)];
          showToast(`访问随机帖子 ${finalId}`, 2000, "success");
        } else {
          finalId = await findValidTopicId();
        }
      }
      if (!finalId || !isRunning) return;

      // 切换帖子后重置点赞等待状态
      likedPosts.clear();

      window.location.href = `https://linux.do/t/topic/${finalId}`;
    } catch (e) {
      showToast(`跳转出错: ${e.message}`, 5000, "error");
      if (isRunning)
        currentTimeout = setTimeout(() => visitRandomTopic(), 5000);
    }
  }

  // -------------------------------------------------
  // ⑨ 滚动相关（慢速滚动 + 随机停留）
  // -------------------------------------------------
  function getReplyCounts() {
    const el = document.querySelector(".timeline-replies");
    if (!el) return { current: 0, total: 0 };
    const txt = el.textContent.trim();
    const m = txt.match(/(\d+)\s*\/\s*(\d+)/);
    return m ? { current: +m[1], total: +m[2] } : { current: 0, total: 0 };
  }

  function hasReadAllReplies() {
    const { current, total } = getReplyCounts();
    if (total === 0) return true;
    return current > 0 && current >= total;
  }

  function refreshPage() {
    if (!isRunning) return;
    showToast("滚动次数过多，刷新页面…", 2000, "warning");
    const pos = window.pageYOffset;
    window.location.reload();
    window.addEventListener(
      "load",
      () => {
        setTimeout(() => {
          window.scrollTo(0, pos);
          scrollSinceRefresh = 0;
          if (isRunning) setTimeout(scrollPage, 2000);
        }, 1000);
      },
      { once: true }
    );
  }

  function scrollPage() {
    const distance = Math.floor(Math.random() * 700) + 500; // 500~1200px
    showToast(
      `第 ${scrollCount + 1}/${maxScrollCount} 次滚动 (${distance}px)`,
      2000
    );
    smoothScrollTo(distance);
  }

  function smoothScrollTo(distance) {
    const start = window.pageYOffset;
    const duration = 2000;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      window.scrollTo(0, start + distance * ease);
      if (progress < 1) requestAnimationFrame(animate);
      else onScrollComplete();
    }
    requestAnimationFrame(animate);
  }

  // 随机停留时间（1‑30 秒，概率分布）
  function getRandomPauseTime() {
    const r = Math.random() * 100;
    if (r < 80) return Math.floor(Math.random() * 4) + 1; // 80% 1‑4s
    if (r < 90) return Math.floor(Math.random() * 3) + 5; // 10% 5-7s
    return Math.floor(Math.random() * 3) + 8; // 10% 8-10s
  }

  async function onScrollComplete() {
    if (!isRunning) return;
    scrollCount++;
    scrollSinceRefresh++;

    // 是否需要刷新页面？
    if (scrollSinceRefresh >= MAX_SCROLL_BEFORE_REFRESH) {
      refreshPage();
      return;
    }

    // 点赞处理
    let likeStatusMsg = "";
    if (canLikeNow()) {
      const likeResult = await processVisiblePostsForLike();
      if (likeResult?.success) {
        likeStatusMsg = `✓ 第${likeResult.count}次点赞成功`;
      }
    } else {
      const todayCount = getTodayLikeCount();
      const waitUntil = Number(localStorage.getItem("like_wait_until") || "0");
      const remainingSec = Math.max(
        0,
        Math.ceil((waitUntil - Date.now()) / 1000)
      );
      const txt = formatWaitTime(remainingSec);
      console.log(`点赞受限，还需等待 ${txt}`);
      likeStatusMsg = `今日已点赞${todayCount}次 · 点赞受限(${txt}后可用)`;
    }

    // 已读完全部回复？
    if (hasReadAllReplies()) {
      showToast("已读完全部回复，准备跳转", 2000, "success");
      setTimeout(() => isRunning && visitRandomTopic(), 1000);
      return;
    }

    // 达到本页最大滚动次数？
    if (scrollCount >= maxScrollCount) {
      showToast(`已完成 ${maxScrollCount} 次滚动，准备跳转`, 2000, "success");
      setTimeout(() => isRunning && visitRandomTopic(), 1000);
      return;
    }

    // 正常继续滚动
    const pause = getRandomPauseTime();
    const pauseMsg = `停留 ${pause}s 后继续`;
    const combinedMsg = likeStatusMsg
      ? `${likeStatusMsg} · ${pauseMsg}`
      : pauseMsg;
    showToast(
      combinedMsg,
      likeStatusMsg ? 3000 : 2000,
      likeStatusMsg
        ? likeStatusMsg.includes("✓")
          ? "success"
          : "warning"
        : "info"
    );
    currentTimeout = setTimeout(() => isRunning && scrollPage(), pause * 1000);
  }

  // -------------------------------------------------
  // ⑩ 页面加载后自动恢复（localStorage）
  // -------------------------------------------------
  function saveRunningState(v) {
    localStorage.setItem("linux_do_auto_browser_running", v);
  }
  function loadRunningState() {
    return localStorage.getItem("linux_do_auto_browser_running") === "true";
  }

  function handlePageLoad() {
    if (!loadRunningState()) return;
    isRunning = true;
    updateButtonState();

    showToast("恢复自动浏览状态…", 2000);
    setupLikeObserver(); // 空实现

    scrollCount = 0;
    maxScrollCount = Math.floor(Math.random() * 500) + 1;
    showToast(`本页将滚动 ${maxScrollCount} 次`, 2000);

    setTimeout(() => {
      if (!isRunning) return;
      if (hasReadAllReplies()) {
        showToast("本帖已读完，直接跳转", 2000, "success");
        setTimeout(() => isRunning && visitRandomTopic(), 1000);
        return;
      }
      scrollPage();
    }, 2000);
  }

  // -------------------------------------------------
  // ⑪ 初始化
  // -------------------------------------------------
  function init() {
    createControlButton();
    if (loadRunningState()) isRunning = true;
    updateButtonState();

    // 若当前页面是帖子页且需要继续运行，则处理
    if (window.location.href.includes("/t/topic/")) handlePageLoad();

    showToast("Linux.do 自动浏览器已初始化", 2000, "success");
  }

  // 正确的 DOMContentLoaded 监听（大括号已匹配）
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // -------------------------------------------------
  // ⑫ 页面卸载清理
  // -------------------------------------------------
  window.addEventListener("beforeunload", () => {
    if (currentTimeout) clearTimeout(currentTimeout);
    if (observer) observer.disconnect();
  });
})();
