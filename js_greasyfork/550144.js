// ==UserScript==
// @name         Auto Read LINUXDO & IDCFlare
// @namespace    http://tampermonkey.net/
// @version      1.5.7
// @description  自动刷 LINUXDO & IDCFlare 文章，第一作者liuweiqing，适配由wuyuan.dev
// @author       liuweiqing,linmew,Sunwuyuan
// @match        https://meta.discourse.org/*
// @match        https://idcflare.com/*
// @match        https://meta.appinn.net/*
// @match        https://community.openai.com/*
// @match        https://linux.do/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=idcflare.com
// @downloadURL https://update.greasyfork.org/scripts/550144/Auto%20Read%20LINUXDO%20%20IDCFlare.user.js
// @updateURL https://update.greasyfork.org/scripts/550144/Auto%20Read%20LINUXDO%20%20IDCFlare.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 注入样式
  GM_addStyle(`
    .dar-container {
      position: fixed;
      right: -320px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      width: 320px;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
    .dar-container.expanded {
      right: 0;
      pointer-events: auto;
    }
    .dar-toggle-btn {
      position: absolute;
      left: -40px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px 0 0 8px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: auto;
    }
    .dar-toggle-btn:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      box-shadow: -4px 4px 20px rgba(0, 0, 0, 0.15);
    }
    .dar-toggle-btn svg {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }
    .dar-container.expanded .dar-toggle-btn svg {
      transform: rotate(180deg);
    }
    .dar-panel {
      width: 320px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border-radius: 16px 0 0 16px;
      box-shadow: -4px 0 30px rgba(0, 0, 0, 0.1);
      max-height: 80vh;
      overflow-y: auto;
    }
    .dar-header {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px 0 0 0;
      color: white;
    }
    .dar-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    .dar-header p {
      margin: 8px 0 0 0;
      font-size: 12px;
      opacity: 0.9;
    }
    .dar-content {
      padding: 20px;
    }
    .dar-current-topic {
      padding: 12px;
      background: #f0f7ff;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #d0e2ff;
    }
    .dar-current-topic-title {
      font-size: 13px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 4px;
    }
    .dar-current-topic-floor {
      font-size: 12px;
      color: #4a5568;
    }
    .dar-progress {
      padding: 12px;
      background: #f7fafc;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .dar-progress-item {
      margin-bottom: 12px;
    }
    .dar-progress-item:last-child {
      margin-bottom: 0;
    }
    .dar-progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #4a5568;
      margin-bottom: 4px;
    }
    .dar-progress-bar {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .dar-progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .dar-status {
      padding: 12px;
      background: #edf2f7;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .dar-status-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #4a5568;
      margin-bottom: 6px;
    }
    .dar-status-item:last-child {
      margin-bottom: 0;
    }
    .dar-status-value {
      font-weight: 600;
      color: #2d3748;
    }
    .dar-status-value.active {
      color: #48bb78;
    }
    .dar-control-group {
      margin-bottom: 16px;
    }
    .dar-control-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #2d3748;
    }
    .dar-switch {
      position: relative;
      width: 48px;
      height: 24px;
      background: #cbd5e0;
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .dar-switch.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .dar-switch-handle {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .dar-switch.active .dar-switch-handle {
      transform: translateX(24px);
    }
    .dar-main-button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    .dar-main-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    .dar-main-button.stop {
      background: linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%);
    }
    .dar-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 16px 0;
    }
    .dar-panel::-webkit-scrollbar {
      width: 6px;
    }
    .dar-panel::-webkit-scrollbar-track {
      background: transparent;
    }
    .dar-panel::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 3px;
    }
  `);

  // 配置常量
  const CONFIG = {
    SCROLL_SPEED: 30, // 滚动速度
    SCROLL_INTERVAL: 150, // 滚动间隔
    SCROLL_VARIATION: 10, // 滚动速度变化幅度
    LIKE_LIMIT: 30, // 最大点赞数
    LIKE_INTERVAL_MIN: 3000, // 点赞间隔
    LIKE_INTERVAL_MAX: 6000,
    MAX_RETRIES: 3,
    PAGE_TRANSITION_DELAY: 1500, // 页面切换延迟
  };

  // 统计
  class StatsManager {
    constructor() {
      this.goals = {
        topics: 500,
        posts: 20000,
        likes: 30,
        days: 100,
      };
      this.load();
    }

    load() {
      const stored = localStorage.getItem("dar_stats");
      const defaults = {
        startDate: Date.now(),
        topics: {},
        postsRead: 0,
        topicsVisited: 0,
        likesGiven: 0,
        todayLikes: 0,
        lastResetDate: new Date().toDateString(),
      };

      this.stats = stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
      this.checkDailyReset();
    }

    save() {
      localStorage.setItem("dar_stats", JSON.stringify(this.stats));
    }

    checkDailyReset() {
      const today = new Date().toDateString();
      if (this.stats.lastResetDate !== today) {
        this.stats.todayLikes = 0;
        this.stats.lastResetDate = today;
        this.save();
      }
    }

    v;

    // 记录帖子阅读进度
    recordTopicVisit(topicId, title = "", startingPost = 1) {
      if (!this.stats.topics[topicId]) {
        this.stats.topics[topicId] = {
          title: title,
          visitCount: 0,
          lastVisit: Date.now(),
          maxPostRead: 0,
          totalPostsRead: 0,
          firstPostSeen: startingPost,
        };
        this.stats.topicsVisited++;
      }

      this.stats.topics[topicId].visitCount++;
      this.stats.topics[topicId].lastVisit = Date.now();

      // 如果从新的起始位置开始，更新起始楼层
      if (startingPost > 0 && (!this.stats.topics[topicId].firstPostSeen || startingPost < this.stats.topics[topicId].firstPostSeen)) {
        this.stats.topics[topicId].firstPostSeen = startingPost;
      }

      if (title) {
        this.stats.topics[topicId].title = title;
      }
      this.save();
    }

    recordPostRead(topicId, currentPost) {
      if (!this.stats.topics[topicId]) return;

      const topic = this.stats.topics[topicId];
      const previousMax = topic.maxPostRead || 0;

      if (currentPost > previousMax) {
        // 如果是第一次记录，从起始楼层开始计算
        let newPosts = 0;
        if (previousMax === 0 && topic.firstPostSeen) {
          newPosts = currentPost - topic.firstPostSeen + 1;
        } else {
          // 只计算新增的帖子
          newPosts = currentPost - previousMax;
        }

        this.stats.postsRead += newPosts;
        topic.maxPostRead = currentPost;
        topic.totalPostsRead += newPosts;
        this.save();
      }
    }

    recordLike() {
      this.stats.likesGiven++;
      this.stats.todayLikes++;
      this.save();
    }

    getProgress() {
      return {
        topics: {
          current: this.stats.topicsVisited,
          goal: this.goals.topics,
          percentage: Math.min(100, (this.stats.topicsVisited / this.goals.topics) * 100),
        },
        posts: {
          current: this.stats.postsRead,
          goal: this.goals.posts,
          percentage: Math.min(100, (this.stats.postsRead / this.goals.posts) * 100),
        },
        likes: {
          current: this.stats.likesGiven,
          goal: this.goals.likes,
          percentage: Math.min(100, (this.stats.likesGiven / this.goals.likes) * 100),
        }
      };
    }
  }

  // Discourse API 交互
  class DiscourseAPI {
    constructor() {
      this.baseURL = this.getCurrentBaseURL();
      this.csrfToken = this.getCSRFToken();
      this._cachedSelectors = {};
    }

    getCurrentBaseURL() {
      const currentURL = window.location.href;
      const baseURLs = ["https://idcflare.com", "https://meta.discourse.org", "https://meta.appinn.net", "https://community.openai.com","https://linux.do"];
      return baseURLs.find((url) => currentURL.startsWith(url)) || baseURLs[0];
    }

    getCSRFToken() {
      const token = document.querySelector('meta[name="csrf-token"]');
      return token ? token.content : "";
    }

    parseTopicURL(url) {
      const match = url.match(/\/t\/(?:[^\/]+\/)?(\d+)(?:\/(\d+))?/);
      if (match) {
        return {
          topicId: parseInt(match[1]),
          postNumber: match[2] ? parseInt(match[2]) : 1,
        };
      }
      return null;
    }

    // 获取当前话题信息
    getCurrentTopicInfo() {
      const parsed = this.parseTopicURL(window.location.pathname);
      if (!parsed) return null;

      const titleElement = document.querySelector(".fancy-title, .topic-title, h1");
      const title = titleElement ? titleElement.textContent.trim() : "";

      let currentPost = 1;
      let totalPosts = 0;

      // 获取楼层信息
      const timelineReplies = document.querySelector("div.timeline-replies");
      if (timelineReplies) {
        const parts = timelineReplies.textContent
          .trim()
          .replace(/[^0-9/]/g, "")
          .split("/");
        if (parts.length >= 2) {
          currentPost = parseInt(parts[0]) || 1;
          totalPosts = parseInt(parts[1]) || 0;
        }
      }

      return {
        topicId: parsed.topicId,
        title: title,
        currentPost: currentPost,
        totalPosts: totalPosts,
      };
    }

    getTopicsFromList() {
      const topics = [];
      const topicElements = document.querySelectorAll("tr.topic-list-item");

      topicElements.forEach((element) => {
        const topicId = element.getAttribute("data-topic-id");
        if (!topicId) return;

        const linkElement = element.querySelector("a.title");
        if (!linkElement) return;

        const href = linkElement.getAttribute("href");
        const title = linkElement.textContent.trim();

        const postsElement = element.querySelector(".posts .number");
        const postsCount = postsElement ? parseInt(postsElement.textContent) : 0;

        const newBadge = element.querySelector(".badge-notification.new-topic");
        const unreadBadge = element.querySelector(".badge-notification.unread-posts");
        const hasNew = !!(newBadge || unreadBadge);

        topics.push({
          id: topicId,
          title: title,
          href: href,
          postsCount: postsCount + 1,
          hasNew: hasNew,
        });
      });

      return topics;
    }

    getVisiblePosts() {
      const posts = [];
      const postElements = document.querySelectorAll(".topic-post, article[data-post-id]");
      const viewportHeight = window.innerHeight;

      postElements.forEach((element) => {
        const postId = element.getAttribute("data-post-id") || element.id.replace("post_", "");
        const postNumberEl = element.querySelector(".post-number, .reply-to-tab");
        const postNumber = postNumberEl ? postNumberEl.textContent.trim().replace("#", "") : "1";

        if (postId && postNumber) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < viewportHeight && rect.bottom > 0;

          posts.push({
            id: postId,
            number: parseInt(postNumber),
            element: element,
            isVisible: isVisible,
            isFullyVisible: rect.top >= 0 && rect.bottom <= viewportHeight,
            height: rect.height,
          });
        }
      });

      return posts;
    }

    async likePost(postId) {
      try {
        const element = document.getElementById(`post_${postId}`) || document.querySelector(`[data-post-id="${postId}"]`);

        if (!element) return false;

        const likeButton = element.querySelector(".discourse-reactions-reaction-button button, .like-button");
        if (likeButton) {
          const container = likeButton.closest(".discourse-reactions-actions");
          if (!container || !container.classList.contains("has-reacted")) {
            likeButton.click();
            return true;
          }
        }
      } catch (error) {
        console.error("Error liking post:", error);
      }
      return false;
    }

    // 底部检测
    isAtBottomOfTopic() {
      const timelineReplies = document.querySelector("div.timeline-replies");
      if (timelineReplies) {
        const parts = timelineReplies.textContent
          .trim()
          .replace(/[^0-9/]/g, "")
          .split("/");
        // 判断是否相等（如：35/35），表示已到达底部
        if (parts.length >= 2 && parts[0] === parts[1]) {
          return true;
        }
      } else {
        // 没有 timeline-replies 元素时，即只有主楼的情况，检查是否已经滚动到页面底部
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        // 滚动到底部（留 100px 容差）
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          const posts = document.querySelectorAll("article[data-post-id]");
          if (posts.length <= 1) {
            return true;
          }
        }
      }
      return false;
    }
  }

  // 智能阅读
  class SmartReader {
    constructor(config, stats, api) {
      this.config = config;
      this.stats = stats;
      this.api = api;
      this.isReading = false;
      this.currentTopic = null;
      this.readPosts = new Set();
      this.topicQueue = [];
      this.scrollTimer = null;
      this.currentStatus = "待机";
      this.statusUpdateCallback = null;
      this.isPageVisible = true;
      this.lastScrollTime = 0;
      this.lastRecordedPost = 0;
      this.errorRetries = 0;
      this.setupVisibilityHandler();
    }

    setStatusCallback(callback) {
      this.statusUpdateCallback = callback;
    }

    updateStatus(status) {
      this.currentStatus = status;
      if (this.statusUpdateCallback) {
        this.statusUpdateCallback(status);
      }
    }

    setupVisibilityHandler() {
      document.addEventListener("visibilitychange", () => {
        this.isPageVisible = !document.hidden;

        if (this.isPageVisible && this.isReading) {
          this.resumeReading();
        } else if (!this.isPageVisible && this.isReading) {
          this.pauseReading();
        }
      });
    }

    start() {
      this.isReading = true;
      this.config.set("autoRead", true);
      this.updateStatus("启动中...");
      this.errorRetries = 0;

      if (this.isTopicPage()) {
        this.readCurrentTopic();
      } else if (this.isListPage()) {
        this.loadTopicList();
      } else {
        window.location.href = `${this.api.baseURL}/latest`;
      }
    }

    stop() {
      this.isReading = false;
      this.config.set("autoRead", false);
      this.updateStatus("已停止");
      this.clearTimers();
    }

    pauseReading() {
      this.clearTimers();
      this.updateStatus("后台暂停中...");
    }

    resumeReading() {
      if (!this.isReading) return;

      if (this.isTopicPage()) {
        this.startSmoothScrolling();
      }
      this.updateStatus("继续阅读...");
    }

    clearTimers() {
      if (this.scrollTimer) {
        cancelAnimationFrame(this.scrollTimer);
        this.scrollTimer = null;
      }
    }

    isTopicPage() {
      return window.location.pathname.includes("/t/");
    }

    isListPage() {
      const path = window.location.pathname;
      return ["/", "/latest", "/new", "/unread", "/top"].some((p) => path === p || path.startsWith(p));
    }

    // 检测是否为错误页面
    isErrorPage() {
      return document.title.includes("找不到页面") || document.title.includes("404") || document.querySelector(".page-not-found");
    }

    // 处理错误页面
    handleError() {
      this.errorRetries++;
      if (this.errorRetries > CONFIG.MAX_RETRIES) {
        this.updateStatus("错误次数过多，返回列表");
        this.errorRetries = 0;
        setTimeout(() => {
          window.location.href = `${this.api.baseURL}/latest`;
        }, 2000);
      } else {
        this.updateStatus(`错误页面，重试 ${this.errorRetries}/${CONFIG.MAX_RETRIES}`);
        setTimeout(() => this.navigateToNextTopic(), 2000);
      }
    }

    async readCurrentTopic() {
      if (!this.isReading) return;

      // 检查错误页面
      if (this.isErrorPage()) {
        this.handleError();
        return;
      }

      const topicInfo = this.api.getCurrentTopicInfo();
      if (!topicInfo) {
        this.updateStatus("获取话题失败，返回列表...");
        setTimeout(() => this.navigateToNextTopic(), 2000);
        return;
      }

      // 传入起始楼层
      this.stats.recordTopicVisit(topicInfo.topicId, topicInfo.title, topicInfo.currentPost);
      this.currentTopic = topicInfo;
      // 设置最后记录的楼层为当前楼层-1
      this.lastRecordedPost = topicInfo.currentPost - 1;
      this.updateStatus(`正在浏览: ${topicInfo.title}`);

      // 检查返回按钮
      const backButton = document.querySelector('[title="返回上一个未读帖子"]');
      if (backButton) {
        backButton.click();
      }

      if (this.isPageVisible) {
        this.startSmoothScrolling();
      }
    }

    // 滚动行为
    startSmoothScrolling() {
      if (this.scrollTimer) return;

      let scrollSpeed = CONFIG.SCROLL_SPEED;
      let lastVariation = 0;

      const scrollStep = () => {
        if (!this.isReading || !this.isPageVisible) {
          this.scrollTimer = null;
          return;
        }

        const timestamp = performance.now();

        // 控制滚动频率
        if (timestamp - this.lastScrollTime < CONFIG.SCROLL_INTERVAL) {
          this.scrollTimer = requestAnimationFrame(scrollStep);
          return;
        }
        this.lastScrollTime = timestamp;

        // 检查是否到达底部
        if (this.api.isAtBottomOfTopic()) {
          this.updateStatus("已到达话题底部，准备跳转...");
          this.clearTimers();

          // 确保记录最后的楼层
          const finalInfo = this.api.getCurrentTopicInfo();
          if (finalInfo && finalInfo.currentPost > this.lastRecordedPost) {
            this.stats.recordPostRead(this.currentTopic.topicId, finalInfo.currentPost);
          }

          setTimeout(() => {
            this.navigateToNextTopic();
          }, CONFIG.PAGE_TRANSITION_DELAY);
          return;
        }

        // 添加随机变化，让滚动更自然
        if (Math.random() < 0.1) {
          // 10%概率改变速度
          lastVariation = (Math.random() - 0.5) * CONFIG.SCROLL_VARIATION;
        }

        const currentSpeed = Math.max(10, scrollSpeed + lastVariation);
        window.scrollBy(0, currentSpeed);

        // 处理可见帖子
        this.processVisiblePosts();

        // 继续下一帧
        this.scrollTimer = requestAnimationFrame(scrollStep);
      };

      // 开始滚动动画
      this.scrollTimer = requestAnimationFrame(scrollStep);
    }

    // 处理可见帖子和更新进度
    processVisiblePosts() {
      const visiblePosts = this.api.getVisiblePosts();

      // 获取当前楼层信息并更新帖子进度
      const topicInfo = this.api.getCurrentTopicInfo();
      if (topicInfo && topicInfo.currentPost > this.lastRecordedPost) {
        // 记录新的帖子阅读进度
        this.stats.recordPostRead(this.currentTopic.topicId, topicInfo.currentPost);
        this.lastRecordedPost = topicInfo.currentPost;

        // 更新状态显示
        const floorInfo = topicInfo.totalPosts ? `楼层：${topicInfo.currentPost}/${topicInfo.totalPosts}` : `楼层：${topicInfo.currentPost}`;
        this.updateStatus(`正在浏览: ${topicInfo.title} (${floorInfo})`);
      }

      // 标记完全可见的帖子为已读
      visiblePosts.forEach((post) => {
        if (post.isFullyVisible && !this.readPosts.has(post.id)) {
          this.readPosts.add(post.id);

          // 自动点赞逻辑
          if (this.config.get("autoLike") && this.shouldLikePost(post)) {
            const delay = Math.random() * (CONFIG.LIKE_INTERVAL_MAX - CONFIG.LIKE_INTERVAL_MIN) + CONFIG.LIKE_INTERVAL_MIN;
            setTimeout(() => {
              this.api.likePost(post.id).then((success) => {
                if (success) this.stats.recordLike();
              });
            }, delay);
          }
        }
      });
    }

    shouldLikePost(post) {
      // 检查今日点赞限制
      if (this.stats.stats.todayLikes >= CONFIG.LIKE_LIMIT) {
        return false;
      }

      // 检查总点赞目标
      const progress = this.stats.getProgress();
      if (progress.likes.current >= progress.likes.goal) {
        return false;
      }

      // 随机点赞概率，拟人模式下概率更低
      const likeChance = this.config.get("humanMode") ? 0.08 : 0.15;
      return Math.random() < likeChance;
    }

    loadTopicList() {
      this.updateStatus("加载话题列表...");

      const topics = this.api.getTopicsFromList();

      if (topics.length === 0) {
        this.updateStatus("加载更多话题...");
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(() => this.loadTopicList(), 2000);
        return;
      }

      // 过滤未读或未完成的话题
      const filteredTopics = topics.filter((topic) => {
        const topicStats = this.stats.stats.topics[topic.id];
        if (!topicStats) return true;
        if (topic.hasNew) return true;
        if ((topicStats.maxPostRead || 0) < topic.postsCount) return true;
        return false;
      });

      // 优先处理有新内容的话题
      filteredTopics.sort((a, b) => {
        if (a.hasNew && !b.hasNew) return -1;
        if (!a.hasNew && b.hasNew) return 1;
        return a.postsCount - b.postsCount;
      });

      this.topicQueue = filteredTopics.slice(0, this.config.get("topicLimit"));

      if (this.topicQueue.length === 0) {
        this.updateStatus("没有新话题，滚动加载...");
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(() => this.loadTopicList(), 3000);
        return;
      }

      this.navigateToNextTopic();
    }

    navigateToNextTopic() {
      if (!this.isReading) return;

      this.clearTimers();
      this.readPosts.clear();
      this.lastRecordedPost = 0;

      if (this.topicQueue.length === 0) {
        this.updateStatus("返回话题列表...");
        setTimeout(() => {
          window.location.href = `${this.api.baseURL}/latest`;
        }, CONFIG.PAGE_TRANSITION_DELAY);
        return;
      }

      const nextTopic = this.topicQueue.shift();
      this.updateStatus(`准备进入: ${nextTopic.title}`);

      let url = `${this.api.baseURL}${nextTopic.href}`;

      // 从上次阅读位置继续
      const topicStats = this.stats.stats.topics[nextTopic.id];
      if (topicStats && topicStats.maxPostRead > 0) {
        const targetPost = Math.min(topicStats.maxPostRead + 1, nextTopic.postsCount);
        url = url.replace(/\/\d+$/, "") + `/${targetPost}`;
      }

      // 拟人模式下增加随机延迟
      const delay = this.config.get("humanMode") ? CONFIG.PAGE_TRANSITION_DELAY + Math.random() * 2000 : CONFIG.PAGE_TRANSITION_DELAY;

      setTimeout(() => {
        window.location.href = url;
      }, delay);
    }
  }

  // 配置管理
  class ConfigManager {
    constructor() {
      this.defaults = {
        autoRead: false,
        autoLike: false,
        scrollSpeed: 30,
        scrollDelay: 150,
        readDelay: 2000,
        commentLimit: 1000,
        topicLimit: 20,
        likeLimit: 30,
        humanMode: true,
      };
      this.load();
    }

    load() {
      const stored = localStorage.getItem("dar_config");
      this.config = stored ? { ...this.defaults, ...JSON.parse(stored) } : { ...this.defaults };
    }

    save() {
      localStorage.setItem("dar_config", JSON.stringify(this.config));
    }

    get(key) {
      return this.config[key];
    }

    set(key, value) {
      this.config[key] = value;
      this.save();
    }
  }

  // UI控制类
  class UIController {
    constructor(config, stats, reader) {
      this.config = config;
      this.stats = stats;
      this.reader = reader;
      this.isExpanded = false;
      this.updateTimerId = null;
      this.init();
    }

    init() {
      this.createUI();
      this.bindEvents();
      this.updateDisplay();

      this.reader.setStatusCallback((status) => {
        this.updateCurrentTopicDisplay(status);
      });

      this.startUpdateLoop();

      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && !this.updateTimerId) {
          this.startUpdateLoop();
        }
      });
    }

    startUpdateLoop() {
      const update = () => {
        if (document.hidden) {
          this.updateTimerId = null;
          return;
        }

        this.updateDisplay();
        this.updateTimerId = setTimeout(update, 1000);
      };

      if (this.updateTimerId) {
        clearTimeout(this.updateTimerId);
      }

      this.updateTimerId = setTimeout(update, 1000);
    }

    createUI() {
      const container = document.createElement("div");
      container.className = "dar-container";

      container.innerHTML = `
        <button class="dar-toggle-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="dar-panel">
          <div class="dar-header">
            <h3>📚 自动阅读</h3>
            <p>自动浏览论坛内容</p>
          </div>

          <div class="dar-content">
            <div class="dar-current-topic" id="dar-current-topic" style="display: none;">
              <div class="dar-current-topic-title" id="dar-current-title">准备就绪</div>
              <div class="dar-current-topic-floor" id="dar-current-floor">等待开始...</div>
            </div>

            <div class="dar-progress">
              <div class="dar-progress-item">
                <div class="dar-progress-label">
                  <span>话题进度</span>
                  <span id="dar-topics-count">0/500</span>
                </div>
                <div class="dar-progress-bar">
                  <div class="dar-progress-fill" id="dar-topics-progress" style="width: 0%"></div>
                </div>
              </div>

              <div class="dar-progress-item">
                <div class="dar-progress-label">
                  <span>帖子进度</span>
                  <span id="dar-posts-count">0/20000</span>
                </div>
                <div class="dar-progress-bar">
                  <div class="dar-progress-fill" id="dar-posts-progress" style="width: 0%"></div>
                </div>
              </div>

              <div class="dar-progress-item">
                <div class="dar-progress-label">
                  <span>点赞进度</span>
                  <span id="dar-likes-count">0/30</span>
                </div>
                <div class="dar-progress-bar">
                  <div class="dar-progress-fill" id="dar-likes-progress" style="width: 0%"></div>
                </div>
              </div>
            </div>

            <div class="dar-status">
              <div class="dar-status-item">
                <span>当前状态</span>
                <span class="dar-status-value" id="dar-status">待机</span>
              </div>
              <div class="dar-status-item">
                <span>今日点赞</span>
                <span class="dar-status-value" id="dar-today-likes">0</span>
              </div>
            </div>

            <button class="dar-main-button" id="dar-main-btn">
              开始阅读
            </button>

            <div class="dar-divider"></div>

            <div class="dar-control-group">
              <div class="dar-control-label">
                <span>自动点赞</span>
                <div class="dar-switch" id="dar-like-switch">
                  <div class="dar-switch-handle"></div>
                </div>
              </div>
            </div>

            <div class="dar-control-group">
              <div class="dar-control-label">
                <span>拟人模式</span>
                <div class="dar-switch" id="dar-human-switch">
                  <div class="dar-switch-handle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(container);
      this.container = container;
    }

    bindEvents() {
      this.container.querySelector(".dar-toggle-btn").addEventListener("click", () => {
        this.isExpanded = !this.isExpanded;
        this.container.classList.toggle("expanded", this.isExpanded);
      });

      document.querySelector("#dar-main-btn").addEventListener("click", () => {
        if (this.reader.isReading) {
          this.reader.stop();
        } else {
          this.reader.start();
        }
        this.updateDisplay();
      });

      this.bindSwitch("dar-like-switch", "autoLike");
      this.bindSwitch("dar-human-switch", "humanMode");
    }

    bindSwitch(elementId, configKey) {
      const switchEl = document.getElementById(elementId);
      switchEl.addEventListener("click", () => {
        const newValue = !this.config.get(configKey);
        this.config.set(configKey, newValue);
        switchEl.classList.toggle("active", newValue);
      });

      switchEl.classList.toggle("active", this.config.get(configKey));
    }

    updateCurrentTopicDisplay(status) {
      const topicDiv = document.querySelector("#dar-current-topic");
      const titleEl = document.querySelector("#dar-current-title");
      const floorEl = document.querySelector("#dar-current-floor");

      if (this.reader.isReading) {
        topicDiv.style.display = "block";

        // 解析状态信息
        if (status.includes("正在浏览:")) {
          const parts = status.split("(");
          titleEl.textContent = parts[0].trim();
          floorEl.textContent = parts[1] ? parts[1].replace(")", "").trim() : status;
        } else {
          titleEl.textContent = "当前状态";
          floorEl.textContent = status;
        }
      } else {
        topicDiv.style.display = "none";
      }
    }

    updateDisplay() {
      const progress = this.stats.getProgress();

      // 更新进度条
      document.querySelector("#dar-topics-count").textContent = `${progress.topics.current}/${progress.topics.goal}`;
      document.querySelector("#dar-topics-progress").style.width = `${progress.topics.percentage}%`;

      document.querySelector("#dar-posts-count").textContent = `${progress.posts.current}/${progress.posts.goal}`;
      document.querySelector("#dar-posts-progress").style.width = `${progress.posts.percentage}%`;

      document.querySelector("#dar-likes-count").textContent = `${progress.likes.current}/${progress.likes.goal}`;
      document.querySelector("#dar-likes-progress").style.width = `${progress.likes.percentage}%`;

      // 更新状态
      const statusEl = document.querySelector("#dar-status");
      if (this.reader.isReading) {
        statusEl.textContent = "阅读中";
        statusEl.classList.add("active");
      } else {
        statusEl.textContent = "待机";
        statusEl.classList.remove("active");
      }

      document.querySelector("#dar-today-likes").textContent = this.stats.stats.todayLikes;

      // 更新按钮
      const btn = document.querySelector("#dar-main-btn");
      if (this.reader.isReading) {
        btn.textContent = "停止阅读";
        btn.classList.add("stop");
      } else {
        btn.textContent = "开始阅读";
        btn.classList.remove("stop");
      }
    }
  }

  // 初始化
  function init() {
    if (window.self !== window.top) return;

    /* if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
      return;
    } */

    const config = new ConfigManager();
    const stats = new StatsManager();
    const api = new DiscourseAPI();
    const reader = new SmartReader(config, stats, api);
    const ui = new UIController(config, stats, reader);

    // 自动启动
    if (config.get("autoRead")) {
      setTimeout(() => {
        reader.start();
      }, 2000);
    }

    // 全局暴露
    window.DAR = { config, stats, api, reader, ui };
  }

  init();
})();