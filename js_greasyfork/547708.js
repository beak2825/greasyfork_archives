// ==UserScript==
// @name         Linux.do 帖子多功能助手
// @namespace    https://greasyfork.org/zh-CN/scripts/547708-linux-do-%E5%B8%96%E5%AD%90%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%8A%A9%E6%89%8B
// @version      1.0.3
// @description  1.自动收集帖子内容并使用AI总结。 2.标记已回复。 3.增加发布者标签。 4.始皇曰解密
// @author       lishizhen
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @match        https://linux.do/*
// @match        https://idcflare.com/*
// @grant        GM.download
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/marked@16.2.1/lib/marked.umd.min.js
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547708/Linuxdo%20%E5%B8%96%E5%AD%90%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547708/Linuxdo%20%E5%B8%96%E5%AD%90%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =============================================================================
  // 配置与常量
  // =============================================================================

  const CONFIG_KEY = 'LINUXDO_AI_SUMMARIZER_CONFIG_V6';
  const CACHE_PREFIX = 'LINUXDO_SUMMARY_CACHE_';

  const AI_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none">
  <path d="M12 2c-4.4 0-8 3.6-8 8 0 2.1.8 4.1 2.3 5.6.4.4.7 1 .7 1.6v1.8c0 .6.4 1 1 1h8c.6 0 1-.4 1-1v-1.8c0-.6.3-1.2.7-1.6C19.2 14.1 20 12.1 20 10c0-4.4-3.6-8-8-8z" stroke="currentColor" stroke-width="2" fill="none"/>
  <circle cx="9" cy="9" r="1" fill="currentColor"/>
  <circle cx="15" cy="9" r="1" fill="currentColor"/>
  <path d="M9 13c.8.8 2.4.8 3.2 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="18" cy="6" r="2" fill="#ffd700" opacity="0.8"/>
  <circle cx="6" cy="6" r="1.5" fill="#ff6b6b" opacity="0.8"/>
  <circle cx="19" cy="14" r="1" fill="#4ecdc4" opacity="0.8"/>
</svg>`;
  const POSTED_ICON_SVG = `<svg class="fa d-icon d-icon-circle svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#circle"></use></svg>`
  const DEFAULT_CONFIG = {
    apiProvider: 'openai',
    openai: {
      apiKey: '',
      baseUrl: 'https://api.openai.com',
      model: 'gpt-4o-mini'
    },
    gemini: {
      apiKey: 'AIzaSyCD4E-8rV6IrBCiP8cTqTE1wuYHfmRjCaQ',
      baseUrl: 'https://generativelanguage.googleapis.com',
      model: 'gemini-2.5-flash-lite-preview-06-17'
    },
    maxPostsCount: 100,
    prompt: `你是一个善于总结论坛帖子的 AI 助手。请根据以下包含了楼主和所有回复的帖子内容，进行全面、客观、精炼的总结。总结应涵盖主要观点、关键信息、不同意见的交锋以及最终的普遍共识或结论。请使用简体中文，并以 Markdown 格式返回，以便于阅读。\n\n帖子内容如下:\n---\n{content}\n---`
  };

  // =============================================================================
  // 全局状态管理
  // =============================================================================

  class AppState {
    constructor() {
      this.reset();
    }

    reset() {
      this.status = 'idle'; // idle, collecting, collected, finished
      this.posts = [];
      this.processedIds = new Set();
      this.cachedSummary = null;
      this.currentSummaryText = null;
      this.topicData = null;
      this.isStreaming = false;
      this.streamController = null;
    }

    addPost(post) {
      if (!this.processedIds.has(post.id)) {
        this.posts.push(post);
        this.processedIds.add(post.id);
        return true;
      }
      return false;
    }

    clearPosts() {
      this.posts = [];
      this.processedIds.clear();
    }

    randomPosts() {
      // 确保始终包含第一条帖子，然后对剩余帖子进行随机抽样
      if (this.posts.length === 0) return [];

      // 过滤有效内容的帖子
      const validPosts = this.posts.filter(m => m.content.length >= 4);
      if (validPosts.length === 0) return [];

      // 第一条帖子（通常是楼主帖）
      const firstPost = validPosts[0];
      const result = [firstPost];

      // 获取配置中的最大帖子数量
      const config = GM_getValue(CONFIG_KEY, DEFAULT_CONFIG);
      const maxCount = Math.min(validPosts.length, config.maxPostsCount || DEFAULT_CONFIG.maxPostsCount);
      
      // 如果只有一条帖子或需要的数量为1，直接返回第一条
      if (maxCount <= 1) return result;

      // 对剩余帖子进行随机抽样
      const remainingPosts = validPosts.slice(1);
      const shuffled = [...remainingPosts].sort(() => 0.5 - Math.random());
      const sampled = shuffled.slice(0, maxCount - 1);

      return result.concat(sampled);

    }

    getTopicId() {
      const match = window.location.pathname.match(/\/t\/[^\/]+\/(\d+)/);
      return match ? match[1] : null;
    }

    getCacheKey() {
      const topicId = this.getTopicId();
      return topicId ? `${CACHE_PREFIX}${topicId}` : null;
    }

    isTopicPage() {
      return /\/t\/[^\/]+\/\d+/.test(window.location.pathname);
    }

    loadCache() {
      const cacheKey = this.getCacheKey();
      if (cacheKey) {
        this.cachedSummary = GM_getValue(cacheKey, null);
        if (this.cachedSummary) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = this.cachedSummary;
          this.currentSummaryText = tempDiv.textContent || tempDiv.innerText || '';
        }
      }
    }

    saveCache(summary) {
      const cacheKey = this.getCacheKey();
      if (cacheKey) {
        this.cachedSummary = summary;
        GM_setValue(cacheKey, summary);
      }
    }

    stopStreaming() {
      this.isStreaming = false;
      if (this.streamController) {
        this.streamController.abort = true;
      }
    }
  }

  const appState = new AppState();

  // =============================================================================
  // API 调用类
  // =============================================================================

  class TopicAPI {
    constructor() {
      this.baseUrl = window.location.origin;
    }

    async fetchTopicData(topicId, postNumber = 1) {
      let url = `${this.baseUrl}/t/${topicId}/${postNumber}.json`;
      if (postNumber == 1) {
        url = `${this.baseUrl}/t/${topicId}.json`;
      }
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: 'GET',
          url: url,
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          responseType: 'json',
          onload: (response) => {
            if (response.status === 200) {
              resolve(response.response);
            } else {
              reject(new Error(`API 请求失败: ${response.status} ${response.statusText}`));
            }
          },
          onerror: () => reject(new Error('网络请求失败'))
        });
      });
    }
    async getTopicData(topicId) {
      try {
        const response = await this.fetchTopicData(topicId);
        if (!response || !response.id) {
          throw new Error('获取帖子数据失败，可能是帖子不存在或已被删除');
        }
        return response;
      } catch (error) {
        console.error('助手脚本：获取帖子数据失败:', error);
        throw error;
      }
    }

    async getAllPosts(topicId, callback) {
      const posts = [];
      const processedIds = new Set();
      let totalPosts = 0;
      let topicData = null;

      try {
        // 获取第一页数据来确定总帖子数
        const firstResponse = await this.fetchTopicData(topicId, 1);
        topicData = {
          id: firstResponse.id,
          title: firstResponse.title,
          fancy_title: firstResponse.fancy_title,
          posts_count: firstResponse.posts_count
        };

        totalPosts = firstResponse.posts_count;
        console.log(`助手脚本：开始收集帖子，总计 ${totalPosts} 条`);
        let currentPostNumber = 0;
        // 处理第一页的帖子 (1-20)
        if (firstResponse.post_stream && firstResponse.post_stream.posts) {
          firstResponse.post_stream.posts.forEach(post => {
            if (!processedIds.has(post.id)) {
              const cleanContent = this.cleanPostContent(post.cooked);
              if (cleanContent) {
                posts.push({
                  id: post.id,
                  username: post.username || post.name || '未知用户',
                  content: cleanContent
                });
                processedIds.add(post.id);
              } else {
                console.info(`助手脚本：跳过内容太短的帖子 ${post.post_number} - ${post.id}：${post.cooked}`);
              }
            }
            currentPostNumber = post.post_number;
          });
        }
        callback && callback(posts, topicData);
        // 如果总帖子数大于10，需要继续收集
        if (totalPosts > 10) {
          // 使用较小的区间，每次递增10

          while (currentPostNumber < totalPosts) {
            try {
              const response = await this.fetchTopicData(topicId, currentPostNumber);
              if (!response.post_stream || !response.post_stream.posts) {
                console.warn(`助手脚本：第 ${currentPost} 条附近没有返回有效数据`);
                currentPost += 10;
                continue;
              }

              let newPostsCount = 0;
              let lastNumber = 0;
              response.post_stream.posts.forEach(post => {
                if (!processedIds.has(post.id)) {
                  const cleanContent = this.cleanPostContent(post.cooked);
                  if (cleanContent) {
                    posts.push({
                      id: post.id,
                      username: post.username || post.name || '未知用户',
                      content: cleanContent
                    });
                    processedIds.add(post.id);
                    newPostsCount++;
                  } else {
                    console.info(`助手脚本：跳过内容太短的帖子 ${post.post_number} - ${post.id}：${post.cooked}`);
                  }
                }
                lastNumber = post.post_number;
              });

              // 较小的递增步长，减少遗漏
              if (lastNumber > 0) {
                currentPostNumber = lastNumber + 1; // 直接跳到最后一个帖子后面
              } else {
                currentPostNumber += (newPostsCount > 0 ? newPostsCount : 10);
              }
              callback && callback(posts, topicData);
              // 添加延时避免请求过快
              await new Promise(resolve => setTimeout(resolve, 300));

            } catch (error) {
              console.warn(`助手脚本：获取第 ${currentPost} 条附近数据失败:`, error);
              currentPost += 10; // 继续下一个区间
            }
          }
        }

        // 按帖子ID排序确保顺序正确
        posts.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        console.log(`助手脚本：收集完成，共获得 ${posts.length}/${totalPosts} 条有效帖子`);
        return { posts, topicData };

      } catch (error) {
        console.error('助手脚本：收集帖子失败:', error);
        throw error;
      }
    }

    cleanPostContent(htmlContent) {
      if (!htmlContent) return '';

      // 创建临时div来处理HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;

      // 移除引用、代码显示按钮等不需要的元素
      tempDiv.querySelectorAll('aside.quote, .cooked-selection-barrier, .action-code-show-code-btn, .lightbox-wrapper').forEach(el => el.remove());

      // 获取纯文本内容
      const content = tempDiv.innerText.trim().replace(/\n{2,}/g, '\n');

      // 过滤掉太短的内容
      return content;
    }
  }

  const topicAPI = new TopicAPI();

  // =============================================================================
  // 流式渲染类
  // =============================================================================

  class StreamRenderer {
    constructor(container) {
      this.container = container;
      this.content = '';
      this.lastRenderedLength = 0;

      // 配置marked
      if (typeof marked !== 'undefined') {
        marked.setOptions({
          breaks: true,
          gfm: true,
          sanitize: false
        });
      }
    }

    appendContent(chunk) {
      this.content += chunk;
      this.render();
    }

    setContent(content) {
      this.content = content;
      this.lastRenderedLength = 0;
      this.render();
    }

    render() {
      if (typeof marked === 'undefined') {
        // 降级到简单的文本渲染
        this.container.innerHTML = this.content.replace(/\n/g, '<br>');
        return;
      }

      try {
        // 只渲染新增的内容部分，提高性能
        const newContent = this.content.slice(this.lastRenderedLength);
        if (newContent.trim()) {
          const htmlContent = marked.parse(this.content);
          this.container.innerHTML = htmlContent;
          this.lastRenderedLength = this.content.length;

          this.scrollHandle();
        }
      } catch (error) {
        console.error('Markdown渲染失败:', error);
        // 降级到纯文本
        this.container.innerHTML = this.content.replace(/\n/g, '<br>');
      }
    }
    scrollHandle() {
      // 滚动到底部
      // 滚动父级容器到底部
      if (this.container.parentElement) {
        this.container.parentElement.scrollTop = this.container.parentElement.scrollHeight;
      } else {
        this.container.scrollTop = this.container.scrollHeight;
      }
    }
    clear() {
      this.content = '';
      this.lastRenderedLength = 0;
      this.container.innerHTML = '';
    }

    addTypingIndicator() {
      // 创建一个包裹容器
      const wrapper = document.createElement('div');
      wrapper.className = 'typing-indicator-wrapper';

      const indicator = document.createElement('div');
      indicator.className = 'typing-indicator';
      indicator.innerHTML = '<span>●</span><span>●</span><span>●</span>';

      wrapper.appendChild(indicator);
      this.container.appendChild(wrapper);
      this.scrollHandle();
    }

    removeTypingIndicator() {
      const indicator = this.container.querySelector('.typing-indicator-wrapper');
      if (indicator) {
        indicator.remove();
      }
    }
  }

  // =============================================================================
  // UI 组件管理
  // =============================================================================

  class UIManager {
    constructor() {
      this.elements = {};
      this.streamRenderer = null;
      this.topicData = {}
    }

    create() {
      if (!this.shouldShowUI()) return false;
      const targetArea = document.querySelector('div.timeline-controls');
      if (!targetArea || document.getElementById('userscript-summary-btn')) return false;

      this.addStyles();
      this.createButtons(targetArea);
      this.createModals();
      this.updateStatus();

      console.log('助手脚本：UI 已创建');
      return true;
    }

    shouldShowUI() {
      return appState.isTopicPage();
    }
    removeCreatedUserName() {
      const discourse_tags = document.querySelector(".discourse-tags");
      if (discourse_tags && discourse_tags.querySelector('.username')) {
        discourse_tags.removeChild(discourse_tags.querySelector('.username'));
      }
    }
    createCreatedUserName() {
      const { summaryBtn } = this.elements;
      const topicData = this.topicData;
      if (topicData.posted) {
        if (summaryBtn && !summaryBtn.querySelector('.posted-icon-span')) {
          const postedIcon = this.createElement('span', {
            className: 'posted-icon-span',
            innerHTML: POSTED_ICON_SVG,
          });
          summaryBtn.append(postedIcon);
        }
      }
      const created_by = topicData.details?.created_by;
      if (created_by) {

        const discourse_tags = document.querySelector(".discourse-tags");
        if (discourse_tags && !discourse_tags.querySelector('.username')) {
          const name = `${created_by.username} · ${created_by.name || created_by.username}`;
          const user_a = this.createElement('a', {
            className: 'username discourse-tag box',
            style: 'background: var(--d-button-primary-bg-color);color: rgb(255, 255, 255);border-radius: 3px;',
            href: '/u/' + created_by.username,
            innerHTML: '<span style="color: #669d34" class="tag-icon"><svg class="fa d-icon d-icon-user svg-icon svg-string" style="fill: #fff;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#user"></use></svg></span>' + name,
            // innerHTML: '@' + (created_by.name || created_by.username),
          });
          discourse_tags.append(user_a);
        }
      }
    }
    createButtons(targetArea) {
      // AI总结按钮
      const summaryIcon = this.createElement('span', {
        className: 'icon-span',
        innerHTML: AI_ICON_SVG,
      });
      // AI总结按钮
      const summaryBtn = this.createElement('button', {
        id: "userscript-summary-btn",
        className: 'summary-btn btn no-text btn-icon icon btn-default reader-mode-toggle',
        title: 'AI 一键收集并总结',
        onclick: () => this.startSummary()
      });
      // 状态显示
      const statusSpan = this.createElement('span', {
        className: 'userscript-counter',
        title: '已收集的帖子数量',
        textContent: '0'
      });
      try {
        setTimeout(() => {
          topicAPI.getTopicData(appState.getTopicId()).then(topicData => {
            this.topicData = topicData;
            this.createCreatedUserName();
          });
        }, 1000);
      } catch (error) {
        console.error('助手脚本：获取帖子数据失败:', error);
      }

      summaryBtn.append(summaryIcon);
      summaryBtn.append(statusSpan);
      targetArea.prepend(
        summaryBtn,
      );

      this.elements = { summaryBtn, summaryIcon, statusSpan };
    }

    createElement(tag, props) {
      const element = document.createElement(tag);
      Object.assign(element, props);
      return element;
    }

    updateStatus() {
      const { summaryBtn, summaryIcon, statusSpan } = this.elements;
      if (!summaryBtn) return;

      const count = appState.posts.length;
      const hasCache = appState.cachedSummary;

      // 更新计数器
      if (statusSpan) {
        statusSpan.textContent = count;
        statusSpan.classList.toggle('visible', count > 0);
      }

      // 更新按钮状态
      switch (appState.status) {
        case 'idle':
          summaryBtn.disabled = false;
          summaryIcon.innerHTML = AI_ICON_SVG;
          summaryBtn.title = hasCache ? 'AI 查看总结 (有缓存)' : 'AI 一键收集并总结';
          break;

        case 'collecting':
          summaryBtn.disabled = true;
          summaryIcon.innerHTML = `<svg class="fa d-icon d-icon-spinner fa-spin svg-icon svg-string"><use href="#spinner"></use></svg>`;
          summaryBtn.title = '正在收集帖子内容...';
          break;

        case 'collected':
          summaryBtn.disabled = true;
          summaryIcon.innerHTML = `<svg class="fa d-icon d-icon-spinner fa-spin svg-icon svg-string"><use href="#spinner"></use></svg>`;
          summaryBtn.title = appState.isStreaming ? '正在生成总结... (点击停止)' : '正在请求 AI 总结...';
          if (appState.isStreaming) {
            summaryBtn.disabled = false;
            summaryBtn.onclick = () => this.stopStreaming();
          }
          break;

        case 'finished':
          summaryBtn.disabled = false;
          summaryIcon.innerHTML = AI_ICON_SVG;
          summaryBtn.title = 'AI 查看总结 / 重新生成';
          summaryBtn.onclick = () => this.startSummary();
          break;
      }
    }

    stopStreaming() {
      appState.stopStreaming();
      this.updateStreamingUI(false);
      appState.status = 'finished';
      this.updateStatus();

      // 更新footer显示已停止
      const modal = document.getElementById('ai-summary-modal-container');
      const footer = modal.querySelector('.ai-summary-modal-footer');
      const statusDiv = footer.querySelector('.streaming-status');
      if (statusDiv) {
        statusDiv.innerHTML = '<span class="status-stopped">● 已停止生成</span>';
      }
    }

    hide() {
      const elements = ['userscript-summary-btn', 'userscript-download-li', 'ai-summary-modal-container'];
      elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
      this.topicData = {};
    }

    show() {
      const elements = ['userscript-summary-btn', 'userscript-download-li'];
      elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = '';
      });
      this.createCreatedUserName();
    }

    async startSummary() {
      // 检查缓存
      if (appState.cachedSummary && appState.status === 'idle') {
        this.showSummaryModal('success', appState.cachedSummary, true);
        return;
      }

      // 开始收集
      await this.collectPosts();
    }

    async collectPosts() {
      appState.status = 'collecting';
      appState.clearPosts();
      appState.saveCache('');
      this.updateStatus();

      try {
        const topicId = appState.getTopicId();
        if (!topicId) {
          throw new Error('无法获取帖子ID');
        }

        const { posts, topicData } = await topicAPI.getAllPosts(topicId, (posts, topicData) => {
          // 添加所有帖子到状态
          posts.forEach(post => {
            appState.addPost(post);
          });

          appState.topicData = topicData;
          this.updateStatus();
        });

        // 添加所有帖子到状态
        posts.forEach(post => {
          appState.addPost(post);
        });

        appState.topicData = topicData;
        this.updateStatus();

        if (appState.posts.length > 0) {
          appState.status = 'collected';
          this.updateStatus();
          setTimeout(() => this.requestAISummary(), 1000);
        } else {
          throw new Error('未收集到任何有效内容');
        }

      } catch (error) {
        console.error('助手脚本：收集失败:', error);
        alert(`收集失败: ${error.message}`);
        appState.status = 'idle';
        this.updateStatus();
      }
    }

    async requestAISummary(forceRegenerate = false, clearPosts = false) {
      if (forceRegenerate) {
        appState.saveCache('');
        if (appState.posts.length == 0) {
          clearPosts = true;
        }
        if (clearPosts) {
          appState.clearPosts();
          await this.collectPosts();
          return;
        }
      }
      if (!forceRegenerate && appState.cachedSummary) {
        this.showSummaryModal('success', appState.cachedSummary, true);
        appState.status = 'finished';
        this.updateStatus();
        return;
      }
      if (appState.posts.length == 0) {
        this.showSummaryModal('error', '没有收集到任何帖子内容，请先收集帖子。');
        appState.status = 'idle';
        this.updateStatus();
        return;
      }
      this.showSummaryModal('streaming');
      try {
        const panel = document.getElementById('ai-settings-panel');
        const config = GM_getValue(CONFIG_KEY, DEFAULT_CONFIG);
        panel.querySelector('#enable-streaming').checked = config.enableStreaming !== false;
        const content = this.formatPostsForAI();
        const prompt = config.prompt.replace('{content}', content);

        let summary;
        if (config.apiProvider === 'gemini') {
          summary = await this.callGeminiStream(prompt, config);
        } else {
          summary = await this.callOpenAIStream(prompt, config);
        }

        if (summary && !appState.streamController?.abort) {
          const htmlSummary = this.streamRenderer.container.innerHTML;
          appState.currentSummaryText = summary;
          appState.saveCache(htmlSummary);
        }

        this.updateStreamingUI(false);
        appState.status = 'finished';
        this.updateStatus();

      } catch (error) {
        if (!appState.streamController?.abort) {
          this.showSummaryModal('error', error.message);
        }
        appState.status = 'finished';
        this.updateStatus();
      }
    }

    formatPostsForAI() {
      const title = appState.topicData?.fancy_title || appState.topicData?.title || document.querySelector('#topic-title .fancy-title')?.innerText.trim() || '无标题';
      const posts = appState.randomPosts().map(p => `${p.username}: ${p.content}`).join('\n\n---\n\n');
      return `帖子标题: ${title}\n\n${posts}`;
    }

    async callOpenAIStream(prompt, config) {
      if (!config.openai.apiKey) {
        throw new Error('OpenAI API Key 未设置');
      }

      // 检查配置中是否启用流式输出
      const enableStreaming = GM_getValue(CONFIG_KEY, DEFAULT_CONFIG).enableStreaming !== false;

      if (!enableStreaming) {
        // 使用非流式调用
        const result = await this.callOpenAI(prompt, config);
        this.streamRenderer.setContent(result);
        return result;
      }

      appState.isStreaming = true;
      appState.streamController = { abort: false };

      try {
        const response = await fetch(`${config.openai.baseUrl.replace(/\/$/, '')}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.openai.apiKey}`
          },
          body: JSON.stringify({
            model: config.openai.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true
          }),
          signal: appState.streamController.signal
        });

        if (!response.ok) {
          let errorMessage = `OpenAI API 请求失败 (${response.status}): ${response.statusText}`;

          try {
            const errorData = await response.json();
            errorMessage = `OpenAI API 请求失败 (${response.status}): ${errorData.error?.message || response.statusText}`;
          } catch (e) {
            // 使用默认错误消息
          }

          throw new Error(errorMessage);
        }

        return await this.processStreamResponse(response);

      } catch (error) {
        appState.isStreaming = false;

        if (error.name === 'AbortError') {
          console.log('流式请求被用户取消');
          throw new Error('请求已取消');
        }

        throw error;
      }
    }

    async processStreamResponse(response) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      try {
        while (true) {
          // 检查是否需要中止
          if (appState.streamController?.abort) {
            reader.cancel();
            break;
          }

          const { done, value } = await reader.read();

          if (done) {
            console.log('流式响应完成');
            break;
          }

          // 解码数据块
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // 处理完整的事件
          const events = buffer.split('\n\n');
          buffer = events.pop() || ''; // 保留最后一个可能不完整的事件

          for (const event of events) {
            if (event.trim()) {
              const processed = this.processOpenAIStreamEvent(event);
              if (processed) {
                fullContent += processed;
                this.streamRenderer.appendContent(processed);
              }
            }
          }
        }

        // 处理剩余的缓冲数据
        if (buffer.trim()) {
          const processed = this.processOpenAIStreamEvent(buffer);
          if (processed) {
            fullContent += processed;
            this.streamRenderer.appendContent(processed);
          }
        }

        return fullContent;

      } finally {
        appState.isStreaming = false;
        reader.releaseLock();
      }
    }

    processOpenAIStreamEvent(event) {
      const lines = event.split('\n');
      let content = '';

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('data: ')) {
          const data = trimmedLine.slice(6).trim();

          if (data === '[DONE]') {
            console.log('收到流式结束标志');
            appState.isStreaming = false;
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const deltaContent = parsed.choices?.[0]?.delta?.content;

            if (deltaContent) {
              content += deltaContent;
            }

            // 检查是否完成
            const finishReason = parsed.choices?.[0]?.finish_reason;
            if (finishReason) {
              console.log('流式完成，原因:', finishReason);
              appState.isStreaming = false;
            }

          } catch (e) {
            console.warn('解析 SSE 数据时出错:', e, '数据:', data);
          }
        }
      }

      return content;
    }

    async callGeminiStream(prompt, config) {
      if (!config.gemini.apiKey) {
        throw new Error('Gemini API Key 未设置');
      }

      // 检查配置中是否启用流式输出
      const enableStreaming = GM_getValue(CONFIG_KEY, DEFAULT_CONFIG).enableStreaming !== false;

      if (!enableStreaming) {
        // 使用非流式调用
        const result = await this.callGemini(prompt, config);
        this.streamRenderer.setContent(result);
        return result;
      }

      appState.isStreaming = true;
      appState.streamController = { abort: false };

      const url = `${config.gemini.baseUrl.replace(/\/$/, '')}/v1beta/models/${config.gemini.model}:streamGenerateContent?key=${config.gemini.apiKey}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
          signal: appState.streamController.signal
        });

        if (!response.ok) {
          let errorMessage = `Gemini API 请求失败 (${response.status}): ${response.statusText}`;

          try {
            const errorData = await response.json();
            errorMessage = `Gemini API 请求失败 (${response.status}): ${errorData.error?.message || response.statusText}`;
          } catch (e) {
            // 使用默认错误消息
          }

          throw new Error(errorMessage);
        }

        return await this.processGeminiStreamResponse(response);

      } catch (error) {
        appState.isStreaming = false;

        if (error.name === 'AbortError') {
          console.log('Gemini 流式请求被用户取消');
          throw new Error('请求已取消');
        }

        throw error;
      }
    }

    async processGeminiStreamResponse(response) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      try {
        while (true) {
          // 检查是否需要中止
          if (appState.streamController?.abort) {
            reader.cancel();
            break;
          }

          const { done, value } = await reader.read();

          if (done) {
            console.log('Gemini 流式响应完成');
            break;
          }

          // 解码数据块
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // 处理缓冲区中的完整 JSON 对象
          let processedData;
          ({ processedData, buffer } = this.extractCompleteJsonObjects(buffer));

          if (processedData) {
            const processed = this.processGeminiStreamData(processedData);
            if (processed) {
              fullContent += processed;
              this.streamRenderer.appendContent(processed);
            }
          }
        }

        // 处理剩余的缓冲数据
        if (buffer.trim()) {
          const processed = this.processGeminiStreamData(buffer);
          if (processed) {
            fullContent += processed;
            this.streamRenderer.appendContent(processed);
          }
        }

        return fullContent;

      } finally {
        appState.isStreaming = false;
        reader.releaseLock();
      }
    }

    extractCompleteJsonObjects(buffer) {
      let processedData = '';
      let remainingBuffer = buffer;

      // Gemini 流式响应通常是换行分隔的 JSON 对象
      const lines = buffer.split('\n');
      remainingBuffer = lines.pop() || ''; // 保留最后一行，可能不完整

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          processedData += trimmedLine + '\n';
        }
      }

      return { processedData, buffer: remainingBuffer };
    }

    processGeminiStreamData(data) {
      const lines = data.split('\n');
      let content = '';

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine && (trimmedLine.startsWith('{') || trimmedLine.startsWith('['))) {
          try {
            const parsed = JSON.parse(trimmedLine);

            // Gemini 流式响应结构
            const candidates = parsed.candidates;
            if (candidates && candidates.length > 0) {
              const candidate = candidates[0];
              const textContent = candidate.content?.parts?.[0]?.text;

              if (textContent) {
                content += textContent;
              }

              // 检查完成状态
              if (candidate.finishReason) {
                console.log('Gemini 流式完成，原因:', candidate.finishReason);
                appState.isStreaming = false;
              }
            }

            // 处理错误信息
            if (parsed.error) {
              console.error('Gemini 流式响应错误:', parsed.error);
              throw new Error(`Gemini API 错误: ${parsed.error.message}`);
            }

          } catch (e) {
            console.warn('解析 Gemini 流式数据时出错:', e, '数据:', trimmedLine);
          }
        }
      }

      return content;
    }

    // 降级方案：非流式调用
    async callOpenAI(prompt, config) {
      if (!config.openai.apiKey) {
        throw new Error('OpenAI API Key 未设置');
      }

      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: 'POST',
          url: `${config.openai.baseUrl.replace(/\/$/, '')}/v1/chat/completions`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.openai.apiKey}`
          },
          data: JSON.stringify({
            model: config.openai.model,
            messages: [{ role: 'user', content: prompt }]
          }),
          responseType: 'json',
          onload: (response) => {
            if (response.status >= 200 && response.status < 300) {
              const content = response.response.choices?.[0]?.message?.content;
              if (content) {
                resolve(content);
              } else {
                reject(new Error('API 返回内容格式不正确'));
              }
            } else {
              reject(new Error(`API 请求失败 (${response.status}): ${response.response?.error?.message || response.statusText}`));
            }
          },
          onerror: () => reject(new Error('网络请求失败'))
        });
      });
    }

    async callGemini(prompt, config) {
      if (!config.gemini.apiKey) {
        throw new Error('Gemini API Key 未设置');
      }

      const url = `${config.gemini.baseUrl.replace(/\/$/, '')}/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`;

      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: 'POST',
          url: url,
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
          responseType: 'json',
          onload: (response) => {
            if (response.status === 200) {
              const content = response.response.candidates?.[0]?.content?.parts?.[0]?.text;
              if (content) {
                resolve(content);
              } else {
                reject(new Error('Gemini API 返回内容格式不正确'));
              }
            } else {
              reject(new Error(`Gemini API 请求失败 (${response.status}): ${response.response?.error?.message || response.statusText}`));
            }
          },
          onerror: () => reject(new Error('网络请求失败'))
        });
      });
    }

    downloadPosts() {
      if (appState.posts.length === 0) {
        alert('尚未收集任何帖子！');
        return;
      }

      const title = appState.topicData?.fancy_title || appState.topicData?.title || document.querySelector('#topic-title .fancy-title')?.innerText.trim() || document.title.split(' - ')[0];
      const filename = `${title.replace(/[\\/:*?"<>|]/g, '_')} (共 ${appState.posts.length} 楼).txt`;

      let content = `帖子标题: ${title}\n帖子链接: ${window.location.href}\n收集时间: ${new Date().toLocaleString()}\n总帖子数: ${appState.topicData?.posts_count || appState.posts.length}\n\n`;

      if (appState.currentSummaryText) {
        content += "================ AI 总结 ================\n";
        content += appState.currentSummaryText + "\n\n";
      }

      content += "============== 帖子原文 ================\n\n";
      appState.posts.forEach((post, index) => {
        content += `#${index + 1} 楼 - ${post.username}:\n${post.content}\n\n---\n\n`;
      });

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      GM.download({ url: URL.createObjectURL(blob), name: filename });
    }

    // Modal 相关方法
    createModals() {
      this.createSummaryModal();
      this.createSettingsPanel();
    }

    createSummaryModal() {
      if (document.getElementById('ai-summary-modal-container')) return;

      const modal = document.createElement('div');
      modal.id = 'ai-summary-modal-container';
      modal.className = 'ai-summary-modal-container';
      modal.innerHTML = `
        <div class="ai-summary-modal">
          <div class="ai-summary-modal-header">
            <h1><div class="ai-icon">🤖</div>AI 总结</h1>
            <button class="ai-summary-close-btn">×</button>
          </div>
          <div class="ai-summary-modal-body">
            <div class="generated-summary cooked"></div>
          </div>
          <div class="ai-summary-modal-footer"></div>
        </div>
      `;

      document.body.appendChild(modal);

      // 绑定关闭事件
      modal.querySelector('.ai-summary-close-btn').onclick = () => {
        if (appState.isStreaming) {
          this.stopStreaming();
        }
        modal.classList.remove('visible');
      };
    }

    showSummaryModal(state, content = '', isFromCache = false) {
      const modal = document.getElementById('ai-summary-modal-container');
      const body = modal.querySelector('.generated-summary.cooked');
      const footer = modal.querySelector('.ai-summary-modal-footer');
      modal.style.display = '';
      footer.innerHTML = '';

      switch (state) {
        case 'loading':
          body.innerHTML = `
            <div class="ai-summary-spinner">
              <div class="spinner-circle"></div>
              <div class="spinner-text">AI 正在分析帖子内容...</div>
            </div>
          `;
          break;

        case 'streaming':
          this.streamRenderer = new StreamRenderer(body);
          this.streamRenderer.clear();
          this.streamRenderer.addTypingIndicator();
          this.updateStreamingUI(true);
          break;

        case 'success':
          if (this.streamRenderer) {
            this.streamRenderer.setContent(content);
          } else {
            body.innerHTML = content;
          }
          const cacheInfo = isFromCache ? '<span class="cache-badge">缓存</span>' : '';
          footer.innerHTML = `
            <div class="summary-info">
              由 AI 在 ${new Date().toLocaleDateString()} 生成 ${cacheInfo}
            </div>
            <div class="summary-actions">
              <button class="ai-summary-btn secondary copy-btn">复制</button>
              <button class="ai-summary-btn primary regenerate-btn">重新生成</button>
            </div>
          `;

          // 绑定按钮事件
          footer.querySelector('.copy-btn').onclick = async () => {
            try {
              await navigator.clipboard.writeText(body.textContent);
              const btn = footer.querySelector('.copy-btn');
              const original = btn.textContent;
              btn.textContent = '已复制';
              setTimeout(() => btn.textContent = original, 2000);
            } catch (e) {
              console.error('复制失败:', e);
            }
          };

          footer.querySelector('.regenerate-btn').onclick = () => {
            modal.classList.remove('visible');
            this.requestAISummary(true);
          };
          break;

        case 'error':
          body.innerHTML = `
            <div class="error-content">
              <div class="error-icon">⚠️</div>
              <h3>总结生成失败</h3>
              <p>${content}</p>
            </div>
          `;
          footer.innerHTML = `
            <div class="summary-actions">
              <button class="ai-summary-btn secondary settings-btn">设置</button>
              <button class="ai-summary-btn primary retry-btn">重试</button>
            </div>
          `;

          footer.querySelector('.settings-btn').onclick = () => {
            modal.classList.remove('visible');
            this.showSettingsPanel();
          };

          footer.querySelector('.retry-btn').onclick = () => {
            modal.classList.remove('visible');
            this.requestAISummary(true);
          };
          break;
      }

      modal.classList.add('visible');
    }

    updateStreamingUI(isStreaming) {
      const modal = document.getElementById('ai-summary-modal-container');
      const footer = modal.querySelector('.ai-summary-modal-footer');

      if (isStreaming) {
        footer.innerHTML = `
          <div class="streaming-status">
            <span class="status-streaming">● 正在生成中...</span>
          </div>
          <div class="summary-actions">
            <button class="ai-summary-btn secondary stop-btn">停止生成</button>
            <button class="ai-summary-btn primary copy-btn">复制当前内容</button>
          </div>
        `;

        footer.querySelector('.stop-btn').onclick = () => {
          this.stopStreaming();
        };

        footer.querySelector('.copy-btn').onclick = async () => {
          try {
            const content = this.streamRenderer ? this.streamRenderer.content : '';
            await navigator.clipboard.writeText(content);
            const btn = footer.querySelector('.copy-btn');
            const original = btn.textContent;
            btn.textContent = '已复制';
            setTimeout(() => btn.textContent = original, 2000);
          } catch (e) {
            console.error('复制失败:', e);
          }
        };
      } else {
        if (this.streamRenderer) {
          this.streamRenderer.removeTypingIndicator();
        }

        footer.innerHTML = `
          <div class="summary-info">
            由 AI 在 ${new Date().toLocaleDateString()} 生成
          </div>
          <div class="summary-actions">
            <button class="ai-summary-btn secondary copy-btn">复制</button>
            <button class="ai-summary-btn primary regenerate-btn">重新生成</button>
          </div>
        `;

        footer.querySelector('.copy-btn').onclick = async () => {
          try {
            const content = this.streamRenderer ? this.streamRenderer.content : '';
            await navigator.clipboard.writeText(content);
            const btn = footer.querySelector('.copy-btn');
            const original = btn.textContent;
            btn.textContent = '已复制';
            setTimeout(() => btn.textContent = original, 2000);
          } catch (e) {
            console.error('复制失败:', e);
          }
        };

        footer.querySelector('.regenerate-btn').onclick = () => {
          const modal = document.getElementById('ai-summary-modal-container');
          modal.classList.remove('visible');
          this.requestAISummary(true);
        };
      }
    }

    createSettingsPanel() {
      if (document.getElementById('ai-settings-panel')) return;

      const config = GM_getValue(CONFIG_KEY, DEFAULT_CONFIG);
      const backdrop = document.createElement('div');
      backdrop.id = 'ai-settings-backdrop';

      const panel = document.createElement('div');
      panel.id = 'ai-settings-panel';
      panel.innerHTML = `
        <div class="settings-header">
          <h2>AI 总结器设置</h2>
          <button class="close-btn">×</button>
        </div>
        <div class="settings-content">
          <div class="settings-section">
            <h3>API 设置</h3>
            <label>API 提供商</label>
            <select id="api-provider">
              <option value="openai">OpenAI</option>
              <option value="gemini">Google Gemini</option>
            </select>

            <div id="openai-config">
              <label>OpenAI API Key</label>
              <input type="password" id="openai-key" value="${config.openai.apiKey}">
              <label>Base URL</label>
              <input type="text" id="openai-url" value="${config.openai.baseUrl}">
              <label>模型</label>
              <input type="text" id="openai-model" value="${config.openai.model}">
            </div>

            <div id="gemini-config" style="display: none;">
              <label>Gemini API Key</label>
              <input type="password" id="gemini-key" value="${config.gemini.apiKey}">
              <label>Base URL</label>
              <input type="text" id="gemini-url" value="${config.gemini.baseUrl}">
              <label>模型</label>
              <input type="text" id="gemini-model" value="${config.gemini.model}">
            </div>
          </div>

          <div class="settings-section">
            <h3>内容收集设置</h3>
            <label>最大帖子数量</label>
            <input type="number" id="max-posts-count" value="${config.maxPostsCount || DEFAULT_CONFIG.maxPostsCount}" min="10" max="1000" step="10">
            <p class="setting-description">AI 总结时最多使用的帖子数量，包含楼主帖。数量越多，内容越全面但成本更高</p>
          </div>

          <div class="settings-section">
            <label>Prompt 模板</label>
            <textarea id="prompt-template">${config.prompt}</textarea>
          </div>

          <div class="settings-section">
            <h3>流式输出设置</h3>
            <label>
              <input type="checkbox" id="enable-streaming" checked> 启用流式输出 (实时显示生成过程)
            </label>
            <p class="setting-description">流式输出可以实时看到AI生成内容的过程，但可能在某些网络环境下不稳定</p>
          </div>
        </div>
        <div class="settings-footer">
          <button id="cancel-btn">取消</button>
          <button id="save-btn">保存</button>
        </div>
      `;

      document.body.append(backdrop, panel);

      // 绑定事件
      const provider = panel.querySelector('#api-provider');
      const openaiConfig = panel.querySelector('#openai-config');
      const geminiConfig = panel.querySelector('#gemini-config');

      provider.value = config.apiProvider;
      provider.onchange = () => {
        const isGemini = provider.value === 'gemini';
        geminiConfig.style.display = isGemini ? 'block' : 'none';
        openaiConfig.style.display = isGemini ? 'none' : 'block';
      };
      provider.onchange();

      const hide = () => {
        backdrop.classList.remove('visible');
        panel.classList.remove('visible');
      };

      panel.querySelector('.close-btn').onclick = hide;
      backdrop.onclick = hide;
      panel.querySelector('#cancel-btn').onclick = hide;

      panel.querySelector('#save-btn').onclick = () => {
        const newConfig = {
          apiProvider: provider.value,
          openai: {
            apiKey: panel.querySelector('#openai-key').value.trim(),
            baseUrl: panel.querySelector('#openai-url').value.trim(),
            model: panel.querySelector('#openai-model').value.trim()
          },
          gemini: {
            apiKey: panel.querySelector('#gemini-key').value.trim(),
            baseUrl: panel.querySelector('#gemini-url').value.trim(),
            model: panel.querySelector('#gemini-model').value.trim()
          },
          maxPostsCount: parseInt(panel.querySelector('#max-posts-count').value) || DEFAULT_CONFIG.maxPostsCount,
          prompt: panel.querySelector('#prompt-template').value.trim(),
          enableStreaming: panel.querySelector('#enable-streaming').checked
        };
        GM_setValue(CONFIG_KEY, newConfig);
        alert('设置已保存！');
        hide();
      };
    }

    showSettingsPanel() {
      const backdrop = document.getElementById('ai-settings-backdrop');
      const panel = document.getElementById('ai-settings-panel');
      backdrop.classList.add('visible');
      panel.classList.add('visible');
    }

    addStyles() {
      GM_addStyle(`
        /* 基础样式 */
        #userscript-status-li {
          display: flex;
          align-items: center;
          margin: 0 -5px 0 2px;
        }
        #userscript-summary-btn{
          position: relative;
          width: 38px;
          height: 38px;
          margin-right: 5px;
          padding: 5px;
          background: var(--d-button-default-bg-color);
        }
        #userscript-summary-bt:active{
          background-image: linear-gradient(to bottom, rgb(var(--primary-rgb), 0.3) 100%, rgb(var(--primary-rgb), 0.3) 100%);
          color: var(--d-button-default-text-color--hover);
        }
        #userscript-summary-btn .posted-icon-span{
          position: absolute;
          top: 2px;
          left: 2px;
        }
        #userscript-summary-btn .posted-icon-span svg{
          height: 0.5em;
          width: 0.5em;
          line-height: 1;
          display: inline-flex;
          vertical-align: text-top;
          color: var(--d-sidebar-suffix-color);
          fill: currentcolor;
          flex-shrink: 0;
        }
        #userscript-summary-btn .icon-span{
          width: 100%;
          height: 100%;
        }
        #userscript-summary-btn .icon-span svg{
          color: var(--d-button-default-icon-color);
        }
        #userscript-summary-btn:active{
          background-image: linear-gradient(to bottom, rgb(var(--primary-rgb), 0.6) 100%, rgb(var(--primary-rgb), 0.6) 100%);
          color: var(--d-button-default-text-color--hover);
        }
        #userscript-summary-btn:active .icon-span svg{
          color: var(--d-button-default-icon-color--hover);
        }
        .userscript-counter {
          font-size: 12px;
          color: #fff;
          background-color: var(--tertiary-med-or-tertiary);
          padding: 0 4px;
          border-radius: 10px;
          line-height: 18px;
          min-width: 18px;
          height: 18px;
          text-align: center;
          display: none;
          position: absolute;
          bottom: -14px;
          border: 2px solid var(--header_background);
        }

        .userscript-counter.visible { display: inline-block; }

        /* 总结窗口样式 */
        .ai-summary-modal-container {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          z-index: 1100;
          display: none;
          pointer-events: none;
        }

        .ai-summary-modal-container.visible { display: block; }

        .ai-summary-modal {
          position: fixed;
          right: 10px;
          top: 80px;
          height: calc(100% - 160px);
          width: 500px;
          max-width: 42vw;
          background: var(--secondary);
          border-left: 1px solid var(--primary-low);
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.3s ease-out;
          pointer-events: all;
        }

        .ai-summary-modal-container.visible .ai-summary-modal {
          transform: translateX(0);
        }

        .ai-summary-modal-header {
          padding: 18px 24px;
          border-bottom: 1px solid var(--primary-low);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--primary-very-low);
        }

        .ai-summary-modal-header h1 {
          margin: 0;
          font-size: 1.4em;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-summary-modal-header .ai-icon {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .ai-summary-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          font-size: 20px;
          color: var(--primary-medium);
        }

        .ai-summary-close-btn:hover {
          background: var(--primary-low);
        }

        .ai-summary-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }

        .generated-summary.cooked {
          padding: 24px 28px;
          line-height: 1.7;
          font-size: 15px;
          min-height: 100%;
          box-sizing: border-box;
        }
        .typing-indicator-wrapper{
          width: 100%;
          text-align: center;
        }
        .generated-summary.cooked h1{
          border-bottom: 2px solid #0088cc;
          padding-bottom: 10px;
        }

        .generated-summary.cooked h1, .generated-summary.cooked h2, .generated-summary.cooked h3 {
          color: var(--primary);
          margin: 20px 0 14px 0;
        }

        .generated-summary.cooked p {
          margin: 12px 0;
          color: var(--primary-high);
        }

        .generated-summary.cooked ul, .generated-summary.cooked ol {
          margin: 16px 0;
          padding-left: 24px;
        }

        .generated-summary.cooked li {
          margin: 6px 0;
        }

        .generated-summary.cooked strong {
          color: var(--primary);
          font-weight: 600;
        }

        .generated-summary.cooked code {
          background: var(--primary-very-low);
          padding: 3px 6px;
          border-radius: 4px;
          font-family: monospace;
        }

        .generated-summary.cooked pre {
          background: var(--primary-very-low);
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;
        }

        .generated-summary.cooked blockquote {
          border-left: 4px solid var(--tertiary);
          padding-left: 16px;
          margin: 16px 0;
          color: var(--primary-medium);
          font-style: italic;
        }

        /* 流式输出相关样式 */
        .typing-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .typing-indicator span {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          color: var(--tertiary);
          animation: typing 1.4s ease-in-out infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
          margin-left: 4px;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
          margin-left: 4px;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .streaming-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--primary-medium);
          font-size: 13px;
        }

        .status-streaming {
          color: var(--success);
        }

        .status-stopped {
          color: var(--primary-medium);
        }

        .ai-summary-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          gap: 20px;
        }

        .spinner-circle {
          width: 36px;
          height: 36px;
          border: 3px solid var(--primary-low);
          border-radius: 50%;
          border-top-color: var(--tertiary);
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .ai-summary-modal-footer {
          padding: 18px 24px;
          border-top: 1px solid var(--primary-low);
          background: var(--primary-very-low);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .summary-info {
          color: var(--primary-medium);
          font-size: 13px;
        }

        .cache-badge {
          background: var(--success);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          margin-left: 8px;
        }

        .summary-actions {
          display: flex;
          gap: 10px;
        }

        .ai-summary-btn {
          padding: 10px 18px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ai-summary-btn.primary {
          background: var(--tertiary);
          color: white;
        }

        .ai-summary-btn.secondary {
          background: var(--primary-low);
          color: var(--primary);
        }

        .ai-summary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .error-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 24px;
          text-align: center;
          gap: 16px;
        }

        .error-icon {
          font-size: 48px;
        }

        /* 设置面板样式 */
        #ai-settings-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0,0,0,0.6);
          z-index: 1101;
          display: none;
        }

        #ai-settings-backdrop.visible { display: block; }

        #ai-settings-panel {
          position: fixed;
          left: 0;
          top: 0;
          height: 100%;
          width: 90%;
          max-width: 400px;
          background-color: var(--secondary);
          z-index: 1102;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          display: flex;
          flex-direction: column;
        }

        #ai-settings-panel.visible {
          transform: translateX(0);
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid var(--primary-low);
        }

        .settings-header h2 {
          margin: 0;
          font-size: 1.2em;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          padding: 5px;
        }

        .settings-content {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .settings-section {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid var(--primary-low);
          border-radius: 5px;
        }

        .settings-section h3 {
          margin: 0 0 15px 0;
          font-size: 1.1em;
        }

        .settings-section label {
          display: block;
          margin: 15px 0 5px 0;
          font-weight: bold;
        }

        .settings-section input,
        .settings-section textarea,
        .settings-section select {
          width: 100%;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid var(--primary-low);
          background-color: var(--primary-very-low);
          color: var(--primary-high);
          box-sizing: border-box;
        }

        .settings-section textarea {
          min-height: 500px;
          resize: vertical;
        }

        .setting-description {
          font-size: 12px;
          color: var(--primary-medium);
          margin-top: 5px;
          line-height: 1.4;
        }

        .settings-footer {
          padding: 15px 20px;
          border-top: 1px solid var(--primary-low);
          text-align: right;
        }

        .settings-footer button {
          padding: 8px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-left: 10px;
        }

        #save-btn {
          background-color: var(--tertiary);
          color: #fff;
        }

        #cancel-btn {
          background-color: var(--primary-low);
          color: var(--primary-high);
        }
      `);
    }
  }

  // =============================================================================
  // 始皇曰 解密 组件管理
  // =============================================================================
  class NeoDecodeManager {
    constructor() {
      // Base64到古汉字的映射表
      let base64ToAncient = {
        'A': '天', 'B': '地', 'C': '玄', 'D': '黄', 'E': '宇', 'F': '宙', 'G': '洪', 'H': '荒',
        'I': '日', 'J': '月', 'K': '盈', 'L': '昃', 'M': '辰', 'N': '宿', 'O': '列', 'P': '张',
        'Q': '寒', 'R': '来', 'S': '暑', 'T': '往', 'U': '秋', 'V': '收', 'W': '冬', 'X': '藏',
        'Y': '闰', 'Z': '余', 'a': '成', 'b': '岁', 'c': '律', 'd': '吕', 'e': '调', 'f': '阳',
        'g': '云', 'h': '腾', 'i': '致', 'j': '雨', 'k': '露', 'l': '结', 'm': '为', 'n': '霜',
        'o': '金', 'p': '生', 'q': '丽', 'r': '水', 's': '玉', 't': '出', 'u': '昆', 'v': '冈',
        'w': '剑', 'x': '号', 'y': '巨', 'z': '阙', '0': '珠', '1': '称', '2': '夜', '3': '光',
        '4': '果', '5': '珍', '6': '李', '7': '柰', '8': '菜', '9': '重', '+': '芥', '/': '姜',
        '=': '海'
      };

      // 古汉字到Base64的反向映射
      this.ancientToBase64 = Object.fromEntries(
        Object.entries(base64ToAncient).map(([k, v]) => [v, k])
      );

      // 注册菜单命令
      GM_registerMenuCommand('始皇曰解密', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
          const decrypted = this.decrypt(selectedText);
          if (decrypted) {
            this.copy_text(decrypted).then(() => {
              alert('解密结果已复制到剪贴板！');
            });
          } else {
            alert('解密失败，请确认选中的是有效的始皇曰格式');
          }
        } else {
          alert('请先选中要解密的文本');
        }
      });
    }

    copy_text(text) {
      if (!text) {
        return Promise.reject('没有要复制的内容');
      }

      // 优先使用现代剪贴板API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(() => {
          console.log('使用现代API复制成功');
          return true;
        }).catch(error => {
          console.warn('现代API复制失败，尝试降级方案:', error);
          return this.fallbackCopyText(text);
        });
      } else {
        // 降级到传统方案
        return this.fallbackCopyText(text);
      }
    }

    fallbackCopyText(text) {
      return new Promise((resolve, reject) => {
        try {
          // 创建临时文本区域
          const textArea = document.createElement('textarea');
          textArea.value = text;

          // 设置样式使其不可见
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          textArea.style.opacity = '0';
          textArea.style.pointerEvents = 'none';
          textArea.style.tabIndex = '-1';

          document.body.appendChild(textArea);

          // 选择文本
          textArea.focus();
          textArea.select();
          textArea.setSelectionRange(0, text.length);

          // 执行复制命令
          const successful = document.execCommand('copy');

          // 清理
          document.body.removeChild(textArea);

          if (successful) {
            console.log('使用降级方案复制成功');
            resolve(true);
          } else {
            reject('降级复制方案失败');
          }
        } catch (error) {
          reject('复制操作失败: ' + error.message);
        }
      });
    }

    decrypt(input) {
      if (!input) {
        return '';
      }
      try {
        let text = input.trim();
        if (input.startsWith('始皇曰：')) {
          return this.decrypt_neo(text);
        }
        text = this.decrypt_base64(text);
        if (!text) {
          return '';
        }
        return this.decrypt_neo(text);
      } catch (error) {
      }
      return '';
    }

    decrypt_neo(input) {
      if (!input) {
        return '';
      }
      try {
        // 提取&quot;始皇曰：&quot;之后的内容
        let ancientText = input;
        if (input.startsWith('始皇曰：')) {
          ancientText = input.substring(4);
        }

        // 映射回Base64
        let base64 = '';
        for (let char of ancientText) {
          base64 += this.ancientToBase64[char] || char;
        }

        // 从Base64解码
        return decodeURIComponent(escape(atob(base64)));
      } catch (error) {
      }
      return '';
    }

    decrypt_base64(input) {
      if (!input) {
        return '';
      }

      try {
        // 从Base64解码
        return decodeURIComponent(escape(atob(input)));
      } catch (error) {
      }
      return '';
    }

    decode_els() {
      // 正则匹配.post-stream的字符串：“始皇曰：”，然后获取对应整行内容（包含“始皇曰：”）
      const postStreamElement = document.querySelector('.post-stream');
      if (!postStreamElement) {
        return;
      }

      const matchAll = postStreamElement.innerHTML.match(/始皇曰：([^<]+)/);
      if (!matchAll) {
        return;
      }

      const posts = document.querySelectorAll('.post-stream .topic-post');
      posts.forEach(post => {
        // 检查是否已经解码过，避免重复处理
        if (post.classList.contains('decoded')) {
          return;
        }
        post.classList.add('decoded');

        const match = post.innerHTML.match(/始皇曰：([^<]+)/);
        if (match) {
          const content = match[0];
          // 找到包含这句话的标签，比如 <code>始皇曰：xxx</code>，那么应该找到code元素，当然不一定是code标签
          let codeElement = post.querySelector('*');
          const walker = document.createTreeWalker(
            codeElement,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );

          let node;
          while (node = walker.nextNode()) {
            if (node.textContent.includes(content)) {
              codeElement = node.parentElement;
              break;
            }
          }
          if (codeElement) {
            const decrypt_content = this.decrypt_neo(content);
            if (decrypt_content) {

              // 存储原始内容
              if (!codeElement.getAttribute('data-original-html')) {
                codeElement.setAttribute('data-original-html', codeElement.innerHTML);
              }

              // 使用原始内容拼接解密内容
              const originalHtml = codeElement.getAttribute('data-original-html');
              codeElement.innerHTML = originalHtml + `<br/>解密：${decrypt_content}`;
            }
          }
        }
      });
    }
  }

  // =============================================================================
  // 应用管理器
  // =============================================================================

  class AppManager {
    constructor() {
      this.ui = new UIManager();
      this.neoDecode = new NeoDecodeManager();
      this.lastUrl = '';
      this.lastTopicId = '';
    }

    init() {
      // 检查页面变化
      const currentUrl = window.location.href;
      const currentTopicId = appState.getTopicId();

      if (currentUrl !== this.lastUrl) {
        this.handleUrlChange(currentTopicId);
        this.lastUrl = currentUrl;
        this.lastTopicId = currentTopicId;
      }
      // 根据页面类型显示/隐藏UI
      if (appState.isTopicPage()) {
        if (!document.getElementById('userscript-summary-btn')) {
          this.ui.create();
        } else {
          this.ui.show();
        }
        this.neoDecode.decode_els();
      } else {
        this.ui.hide();
      }
    }

    handleUrlChange(newTopicId) {
      // console.log('助手脚本：页面变化检测');



      // 如果切换到不同的帖子，重置状态
      if (newTopicId && newTopicId !== this.lastTopicId) {
        console.log('助手脚本：切换帖子，重置状态');
        this.resetState();
      }

      // 如果离开帖子页面，清理状态
      if (!appState.isTopicPage()) {
        this.cleanup();
      }
    }

    resetState() {
      // 重置状态
      appState.reset();
      appState.loadCache();

      // 更新UI
      if (this.ui.elements.summaryBtn) {
        this.ui.updateStatus();
      }
    }

    cleanup() {
      appState.reset();
    }

    setupObservers() {
      // 监听DOM变化
      const observer = new MutationObserver(() => {
        this.init();
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'id']
      });

      // 监听路由变化
      let lastUrl = location.href;
      new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
          lastUrl = url;
          setTimeout(() => this.init(), 200);
        }
      }).observe(document, { subtree: true, childList: true });

      // 监听浏览器历史变化
      window.addEventListener('popstate', () => {
        setTimeout(() => this.init(), 200);
      });

      // 重写 history API
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function (...args) {
        originalPushState.apply(history, args);
        setTimeout(() => app.init(), 200);
      };

      history.replaceState = function (...args) {
        originalReplaceState.apply(history, args);
        setTimeout(() => app.init(), 200);
      };
    }
  }

  // =============================================================================
  // 初始化
  // =============================================================================

  const app = new AppManager();

  // 注册菜单命令
  GM_registerMenuCommand('设置 AI 总结 API', () => {
    app.ui.showSettingsPanel();
  });


  // 启动应用
  function startup() {
    console.log('助手脚本：启动中...');

    // 初始加载缓存
    appState.loadCache();

    // 设置观察器
    app.setupObservers();

    // 初始检查
    setTimeout(() => {
      app.init();
    }, 1000);
    console.log('助手脚本：启动完成');
  }

  // DOM加载完成后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startup);
  } else {
    startup();
  }

})();