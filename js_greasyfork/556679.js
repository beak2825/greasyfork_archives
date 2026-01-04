// ==UserScript==
// @name         Steam 好友评测修复工具
// @name:en      Steam Friend Reviews Fixer
// @namespace    https://github.com/JohnS3248/FRF
// @version      5.3.2
// @description  自动修复 Steam 好友评测页面渲染 Bug，显示完整的好友评测列表
// @description:en Auto-fix Steam friend reviews rendering bug, display complete friend review list
// @author       JohnS3248
// @match        https://steamcommunity.com/app/*/reviews/*
// @match        https://steamcommunity.com/app/*
// @icon         https://raw.githubusercontent.com/JohnS3248/FRF/main/icon/FRFicon.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @homepage     https://github.com/JohnS3248/FRF
// @supportURL   https://github.com/JohnS3248/FRF/issues
// @downloadURL https://update.greasyfork.org/scripts/556679/Steam%20%E5%A5%BD%E5%8F%8B%E8%AF%84%E6%B5%8B%E4%BF%AE%E5%A4%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/556679/Steam%20%E5%A5%BD%E5%8F%8B%E8%AF%84%E6%B5%8B%E4%BF%AE%E5%A4%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
  'use strict';


// ==================== src/utils/constants.js ====================

/**
 * 常量定义 - 新架构
 * 集中管理所有配置参数和魔法数字
 */

const Constants = {
  // ==================== 版本信息 ====================
  VERSION: '5.3.2',
  CACHE_VERSION: 'v2', // 渐进式缓存版本

  // ==================== 请求配置 ====================
  BATCH_SIZE: 5,                    // 并发批处理大小
  REQUEST_DELAY: 500,               // 每批请求延迟（毫秒）
  PAGE_REQUEST_DELAY: 200,          // 翻页请求延迟（毫秒）
  REQUEST_TIMEOUT: 10000,           // 单个请求超时（毫秒）

  // ==================== 缓存配置 ====================
  CACHE_DURATION: 7 * 24 * 3600000, // 缓存有效期：7天
  CACHE_KEY_PREFIX: 'frf_cache_',   // 缓存键前缀

  // ==================== Steam URL 模板 ====================
  STEAM_COMMUNITY: 'https://steamcommunity.com',
  FRIENDS_LIST_URL: '/my/friends/',

  // 好友评测列表页（支持翻页）
  PROFILE_REVIEWS_URL: (steamId, page = 1) => {
    const base = steamId.match(/^\d+$/)
      ? `/profiles/${steamId}/recommended/`
      : `/id/${steamId}/recommended/`;
    return page > 1 ? `${base}?p=${page}` : base;
  },

  // 单个游戏评测页
  PROFILE_GAME_REVIEW_URL: (steamId, appId) => {
    const base = steamId.match(/^\d+$/)
      ? `/profiles/${steamId}/recommended/${appId}/`
      : `/id/${steamId}/recommended/${appId}/`;
    return base;
  },

  // ==================== 分页配置 ====================
  REVIEWS_PER_PAGE: 10,             // 每页评测数量（Steam 固定）

  // ==================== 正则表达式 ====================
  REGEX: {
    // Steam ID 提取
    STEAM_ID: /data-steamid="(\d+)"/g,

    // 游戏 App ID 提取
    APP_ID: /app\/(\d+)/g,

    // 评测总数提取
    TOTAL_REVIEWS: /<div class="giantNumber[^"]*">(\d+)<\/div>/,

    // 分页链接提取
    PAGE_LINKS: /<a class="pagelink" href="\?p=(\d+)">/g,

    // 游戏时长
    TOTAL_HOURS: [
      /总时数\s*([\d,]+(?:\.\d+)?)\s*小时/,
      /([\d,]+(?:\.\d+)?)\s*hrs?\s+on\s+record/i
    ],

    // 发布时间
    PUBLISH_DATE: [
      /发布于[：:]\s*([^<\r\n]+)/,
      /Posted[：:]\s*([^<\r\n]+)/i
    ],

    // 更新时间（带年份）
    UPDATE_DATE_WITH_YEAR: [
      /更新于[：:]\s*(\d{4}\s*年[^<\r\n]+)/,
      /Updated[：:]\s*([A-Za-z]+\s+\d+,\s*\d{4}[^<\r\n]+)/i
    ],

    // 更新时间（不带年份）
    UPDATE_DATE_WITHOUT_YEAR: [
      /更新于[：:]\s*(\d{1,2}\s*月\s*\d{1,2}\s*日[^<\r\n]*?)(?:<|$)/,
      /Updated[：:]\s*([A-Za-z]+\s+\d{1,2}[^<\r\n]*?)(?:<|$)/i
    ]
  },

  // ==================== 验证关键词 ====================
  VALIDATION: {
    RATING_SUMMARY: 'ratingSummary',
    RECOMMENDATION_KEYWORDS: ['推荐', '不推荐', 'Recommended', 'Not Recommended'],
    POSITIVE_INDICATORS: [
      'icon_thumbsUp.png',
      'ratingSummary">推荐',
      'ratingSummary">Recommended'
    ]
  },

  // ==================== 调试配置 ====================
  DEBUG_MODE: false,
  LOG_LEVELS: {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  }
};

// 暴露到全局
if (typeof window !== 'undefined') {
  window.FRF_Constants = Constants;
}


// ==================== src/utils/logger.js ====================

/**
 * 日志系统 - 新架构
 * 支持分级日志、性能追踪、彩色输出
 */

class Logger {
  constructor(moduleName) {
    this.moduleName = moduleName;
    this.logLevel = Constants.DEBUG_MODE ? Constants.LOG_LEVELS.DEBUG : Constants.LOG_LEVELS.INFO;

    // 彩色输出配置
    this.colors = {
      DEBUG: '#999',
      INFO: '#47bfff',
      WARN: '#ff9800',
      ERROR: '#f44336'
    };
  }

  setLevel(level) {
    this.logLevel = Constants.LOG_LEVELS[level] || Constants.LOG_LEVELS.INFO;
  }

  shouldLog(level) {
    return Constants.LOG_LEVELS[level] <= this.logLevel;
  }

  formatPrefix(level) {
    return `[FRF:${this.moduleName}][${level}]`;
  }

  /**
   * 彩色日志输出
   */
  colorLog(level, message, data = null) {
    const color = this.colors[level] || '#999';
    const prefix = this.formatPrefix(level);

    if (data) {
      console.log(`%c${prefix}`, `color: ${color}; font-weight: bold;`, message, data);
    } else {
      console.log(`%c${prefix}`, `color: ${color}; font-weight: bold;`, message);
    }
  }

  debug(message, data = null) {
    if (!this.shouldLog('DEBUG')) return;
    this.colorLog('DEBUG', message, data);
  }

  info(message, data = null) {
    if (!this.shouldLog('INFO')) return;
    this.colorLog('INFO', message, data);
  }

  warn(message, data = null) {
    if (!this.shouldLog('WARN')) return;
    this.colorLog('WARN', message, data);
  }

  error(message, error = null) {
    if (!this.shouldLog('ERROR')) return;
    this.colorLog('ERROR', message, error);
  }

  /**
   * 性能追踪
   */
  time(label) {
    console.time(`${this.formatPrefix('PERF')} ${label}`);
  }

  timeEnd(label) {
    console.timeEnd(`${this.formatPrefix('PERF')} ${label}`);
  }

  /**
   * 表格输出
   */
  table(data) {
    if (!this.shouldLog('DEBUG')) return;
    console.log(this.formatPrefix('DEBUG'), '数据表格：');
    console.table(data);
  }

  /**
   * 进度输出
   */
  progress(current, total, message = '') {
    const percent = ((current / total) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(percent / 2)) + '░'.repeat(50 - Math.floor(percent / 2));
    this.info(`${message} [${bar}] ${percent}% (${current}/${total})`);
  }
}

if (typeof window !== 'undefined') {
  window.FRF_Logger = Logger;
}


// ==================== src/utils/validator.js ====================

/**
 * 数据验证器 - 新架构
 * 验证从 Steam 提取的数据有效性
 */

class Validator {
  constructor() {
    this.logger = new Logger('Validator');
  }

  isValidSteamId(steamId) {
    return /^\d{17}$/.test(steamId);
  }

  isValidAppId(appId) {
    return /^\d+$/.test(String(appId));
  }

  isCorrectReviewUrl(url, appId) {
    const hasRecommendedPath = url.includes('/recommended/');
    const hasCorrectAppId = url.includes(`/${appId}/`) || url.includes(`/${appId}`);

    if (!hasRecommendedPath || !hasCorrectAppId) {
      this.logger.debug('URL 验证失败', { url, appId });
      return false;
    }
    return true;
  }

  hasReviewContent(html) {
    const hasRatingSummary = html.includes(Constants.VALIDATION.RATING_SUMMARY);
    const hasRecommendation = Constants.VALIDATION.RECOMMENDATION_KEYWORDS.some(
      keyword => html.includes(keyword)
    );

    if (!hasRatingSummary || !hasRecommendation) {
      this.logger.debug('评测内容验证失败');
      return false;
    }
    return true;
  }

  isCorrectGame(html, appId) {
    const hasAppId = html.includes(`app/${appId}`) ||
                     html.includes(`appid=${appId}`) ||
                     html.includes(`"appid":${appId}`);

    if (!hasAppId) {
      this.logger.debug('游戏验证失败', { appId });
      return false;
    }
    return true;
  }

  /**
   * 三重验证
   */
  validateReviewPage(finalUrl, html, appId) {
    if (!this.isCorrectReviewUrl(finalUrl, appId)) {
      return { valid: false, reason: 'URL重定向' };
    }

    if (!this.hasReviewContent(html)) {
      return { valid: false, reason: '无评测内容' };
    }

    if (!this.isCorrectGame(html, appId)) {
      return { valid: false, reason: '游戏不匹配' };
    }

    return { valid: true, reason: '验证通过' };
  }
}

if (typeof window !== 'undefined') {
  window.FRF_Validator = Validator;
}


// ==================== src/core/ReviewExtractor.js ====================

/**
 * 评测数据提取器
 * 从单个评测页面提取详细信息（包含用户信息和评测内容）
 */

class ReviewExtractor {
  constructor() {
    this.logger = new Logger('ReviewExtractor');
  }

  /**
   * 提取完整的评测数据（基础版，兼容旧代码）
   * @param {string} html - 评测页面 HTML
   * @param {string} steamId - 好友 Steam ID
   * @param {string} appId - 游戏 App ID
   * @returns {Object} 评测数据对象
   */
  extract(html, steamId, appId) {
    const reviewData = {
      steamId,
      appId,
      url: Constants.PROFILE_GAME_REVIEW_URL(steamId, appId),
      isPositive: this.extractRecommendation(html),
      totalHours: this.extractTotalHours(html),
      publishDate: this.extractPublishDate(html),
      updateDate: this.extractUpdateDate(html)
    };

    this.logger.debug('提取评测数据', reviewData);
    return reviewData;
  }

  /**
   * 提取完整的评测数据（UI渲染版，包含用户信息和评测内容）
   * @param {string} html - 评测页面 HTML
   * @param {string} steamId - 好友 Steam ID
   * @param {string} appId - 游戏 App ID
   * @returns {Object} 完整评测数据对象
   */
  extractFull(html, steamId, appId) {
    // 提取头像和头像框
    const avatarData = this.extractUserAvatar(html);
    // 提取评测ID（用于投票）
    const recommendationId = this.extractRecommendationId(html);
    // 提取投票状态
    const voteStatus = this.extractVoteStatus(html, recommendationId);

    const reviewData = {
      // 基础信息
      steamId,
      appId,
      url: Constants.PROFILE_GAME_REVIEW_URL(steamId, appId),
      recommendationId,

      // 评测信息
      isPositive: this.extractRecommendation(html),
      totalHours: this.extractTotalHours(html),
      hoursAtReview: this.extractHoursAtReview(html),
      publishDate: this.extractPublishDate(html),
      updateDate: this.extractUpdateDate(html),

      // 用户信息（新增）
      userAvatar: avatarData.avatarUrl,
      avatarFrame: avatarData.frameUrl,
      userName: this.extractUserName(html),
      userProfileUrl: this.extractUserProfileUrl(html, steamId),

      // 评测内容（新增）
      reviewContent: this.extractReviewContent(html),
      helpfulCount: this.extractHelpfulCount(html),
      funnyCount: this.extractFunnyCount(html),

      // 互动数据
      commentCount: this.extractCommentCount(html),
      awardCount: this.extractAwardCount(html),
      awards: this.extractAwards(html),  // 奖励图标列表

      // 投票状态（用户是否已投票）
      votedUp: voteStatus.votedUp,
      votedDown: voteStatus.votedDown,
      votedFunny: voteStatus.votedFunny
    };

    this.logger.debug('提取完整评测数据', {
      steamId,
      userName: reviewData.userName,
      isPositive: reviewData.isPositive,
      hasFrame: !!reviewData.avatarFrame,
      contentLength: reviewData.reviewContent?.length || 0
    });

    return reviewData;
  }

  // ==================== 评测ID提取 ====================

  /**
   * 提取评测的 recommendationid（用于投票API）
   * 从页面中的投票按钮 onclick 事件中提取
   * 格式：UserReviewVoteUp( 1, '...', '202633885' )
   */
  extractRecommendationId(html) {
    const patterns = [
      // 从投票按钮提取
      /UserReviewVoteUp\([^,]+,\s*'[^']*',\s*'(\d+)'\s*\)/,
      /UserReviewVoteDown\([^,]+,\s*'[^']*',\s*'(\d+)'\s*\)/,
      /UserReviewVoteTag\([^,]+,\s*'[^']*',\s*'(\d+)'/,
      // 从举报按钮提取
      /UserReview_Report\(\s*'(\d+)'/,
      // 从奖励按钮提取
      /UserReview_Award\([^,]+,\s*'[^']*',\s*'(\d+)'/,
      // 从按钮ID提取
      /RecommendationVoteUpBtn(\d+)/
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        this.logger.debug('提取到 recommendationId:', match[1]);
        return match[1];
      }
    }

    this.logger.warn('未能提取 recommendationId');
    return null;
  }

  /**
   * 提取用户对该评测的投票状态
   * 检查按钮是否有 active 类
   * @param {string} html - 评测页面HTML
   * @param {string} recommendationId - 评测ID
   * @returns {Object} { votedUp: boolean, votedDown: boolean, votedFunny: boolean }
   */
  extractVoteStatus(html, recommendationId) {
    const status = {
      votedUp: false,
      votedDown: false,
      votedFunny: false
    };

    if (!recommendationId) return status;

    // Steam HTML 结构：class="..." id="RecommendationVoteUpBtn..."
    // class 在 id 之前，所以需要匹配 class 中包含 active 且同一标签内有对应 id

    // 检查"是"按钮是否有 active 类
    // 格式：class="btn_grey_grey btn_small_thin ico_hover active" ... id="RecommendationVoteUpBtn202633885"
    const upBtnPattern = new RegExp(`class="[^"]*active[^"]*"[^>]*id="RecommendationVoteUpBtn${recommendationId}"`);
    if (upBtnPattern.test(html)) {
      status.votedUp = true;
      this.logger.debug('用户已投"是"');
    }

    // 检查"否"按钮
    const downBtnPattern = new RegExp(`class="[^"]*active[^"]*"[^>]*id="RecommendationVoteDownBtn${recommendationId}"`);
    if (downBtnPattern.test(html)) {
      status.votedDown = true;
      this.logger.debug('用户已投"否"');
    }

    // 检查"欢乐"按钮
    const funnyBtnPattern = new RegExp(`class="[^"]*active[^"]*"[^>]*id="RecommendationVoteTagBtn${recommendationId}_1"`);
    if (funnyBtnPattern.test(html)) {
      status.votedFunny = true;
      this.logger.debug('用户已投"欢乐"');
    }

    return status;
  }

  // ==================== 用户信息提取 ====================

  /**
   * 提取用户头像URL和头像框URL
   * 使用 DOMParser 精确提取，避免并发时的头像串位问题
   * @returns {Object} { avatarUrl: string|null, frameUrl: string|null }
   */
  extractUserAvatar(html) {
    // 使用 DOMParser 精确提取头像和头像框
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const playerAvatarContainer = doc.querySelector('.profile_small_header_avatar .playerAvatar');

      if (playerAvatarContainer) {
        let avatarUrl = null;
        let frameUrl = null;

        // 遍历容器的所有 img 子元素
        const images = playerAvatarContainer.querySelectorAll('img');

        for (const img of images) {
          const src = img.getAttribute('src');

          // 提取头像框图片（在 .profile_avatar_frame 内）
          if (img.closest('.profile_avatar_frame')) {
            if (src) {
              frameUrl = src;
              this.logger.debug('提取头像框:', src);
            }
            continue;
          }

          // 提取真实头像URL（包含 avatars 路径）
          if (src && src.includes('avatars')) {
            avatarUrl = src;
            this.logger.debug('提取头像:', src);
          }
        }

        if (avatarUrl) {
          return { avatarUrl, frameUrl };
        }
      }

      // 备用方案：直接查找图片
      const allImages = doc.querySelectorAll('.profile_small_header_avatar img');
      let avatarUrl = null;
      let frameUrl = null;

      for (const img of allImages) {
        const src = img.getAttribute('src');

        if (img.closest('.profile_avatar_frame')) {
          if (src) frameUrl = src;
          continue;
        }

        if (src && src.includes('avatars')) {
          avatarUrl = src;
        }
      }

      if (avatarUrl) {
        this.logger.debug('DOMParser 提取成功（备用方案）');
        return { avatarUrl, frameUrl };
      }
    } catch (e) {
      this.logger.warn('DOMParser 提取头像失败，fallback 到正则', e);
    }

    // Fallback: 使用正则（兼容旧环境，不提取头像框）
    const patterns = [
      /profile_small_header_avatar[\s\S]*?<img[^>]*src="([^"]+_medium\.jpg)"/,
      /profile_small_header_avatar[\s\S]*?<img[^>]*src="([^"]+\.jpg)"/,
      /playerAvatar[^>]*>[\s\S]*?<img[^>]*src="([^"]+_medium\.jpg)"/
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        this.logger.debug('正则提取头像成功');
        return { avatarUrl: match[1], frameUrl: null };
      }
    }

    this.logger.warn('未能提取用户头像');
    return { avatarUrl: null, frameUrl: null };
  }

  /**
   * 提取用户名称
   */
  extractUserName(html) {
    // 从 persona_name_text_content 提取用户名
    // <a class="whiteLink persona_name_text_content" href="...">用户名</a>
    const patterns = [
      /profile_small_header_name[\s\S]*?persona_name_text_content[^>]*>[\s\n]*([^<]+)/,
      /persona_name_text_content[^>]*>[\s\n]*([^<]+)/
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    this.logger.warn('未能提取用户名');
    return '未知用户';
  }

  /**
   * 提取用户主页URL
   * 从 profile_small_header_name 区域内提取评测作者的主页链接
   */
  extractUserProfileUrl(html, steamId) {
    // 精确匹配：从 profile_small_header_name 区域提取
    // 格式：<span class="profile_small_header_name"><a class="whiteLink persona_name_text_content" href="https://steamcommunity.com/id/xxx">
    const patterns = [
      // 优先：从 profile_small_header_name 区域提取
      /profile_small_header_name[\s\S]*?<a[^>]*href="(https:\/\/steamcommunity\.com\/(?:profiles|id)\/[^"]+)"/,
      // 备选：从 persona_name_text_content 链接提取（排除 account_pulldown 等按钮）
      /<a[^>]*class="[^"]*persona_name_text_content[^"]*"[^>]*href="(https:\/\/steamcommunity\.com\/(?:profiles|id)\/[^"]+)"/
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        // 提取基础URL（去掉后面的recommended等路径）
        const url = match[1];
        const baseMatch = url.match(/(https:\/\/steamcommunity\.com\/(?:profiles|id)\/[^\/]+)/);
        if (baseMatch) {
          this.logger.debug('提取用户主页URL:', baseMatch[1]);
          return baseMatch[1];
        }
        return url;
      }
    }

    // 回退：使用steamId构造
    this.logger.warn('未能提取用户主页URL，使用steamId构造');
    return `https://steamcommunity.com/profiles/${steamId}`;
  }

  // ==================== 评测内容提取 ====================

  /**
   * 提取评测正文内容
   */
  extractReviewContent(html) {
    // 从 #ReviewText 提取评测内容
    // <div id="ReviewText">评测内容...</div>
    const match = html.match(/<div id="ReviewText">([\s\S]*?)<\/div>\s*(?:<div id="ReviewEdit"|<div class="review_rate_bar")/);

    if (match) {
      let content = match[1];

      // 清理HTML，但保留基本格式
      content = this.cleanReviewContent(content);

      return content;
    }

    this.logger.warn('未能提取评测内容');
    return '';
  }

  /**
   * 清理评测内容HTML
   */
  cleanReviewContent(html) {
    // 保留的标签：br, b, i, u, a, div (用于标题)
    // 移除危险标签和属性

    let content = html;

    // 移除script和style标签
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
    content = content.replace(/<style[\s\S]*?<\/style>/gi, '');

    // 移除onclick等事件属性
    content = content.replace(/\s+on\w+="[^"]*"/gi, '');

    // 保留链接但移除target和rel属性
    content = content.replace(/(<a[^>]*)\s+target="[^"]*"/gi, '$1');
    content = content.replace(/(<a[^>]*)\s+rel="[^"]*"/gi, '$1');
    content = content.replace(/(<a[^>]*)\s+id="[^"]*"/gi, '$1');

    // 处理BB code样式的标题
    content = content.replace(/<div class="bb_h1">([^<]*)<\/div>/gi, '<b>$1</b><br>');
    content = content.replace(/<div class="bb_h2">([^<]*)<\/div>/gi, '<b>$1</b><br>');

    // 处理引用块
    content = content.replace(/<blockquote class="bb_blockquote">([\s\S]*?)<\/blockquote>/gi, '<i>"$1"</i>');

    // 清理多余空白
    content = content.trim();

    return content;
  }

  /**
   * 提取"有价值"人数
   */
  extractHelpfulCount(html) {
    // 有 46 人觉得这篇评测有价值
    const patterns = [
      /有\s*(\d+)\s*人觉得这篇评测有价值/,
      /(\d+)\s*people found this review helpful/i
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    return 0;
  }

  /**
   * 提取"欢乐"人数
   */
  extractFunnyCount(html) {
    // 有 1 人觉得这篇评测很欢乐
    const patterns = [
      /有\s*(\d+)\s*人觉得这篇评测很欢乐/,
      /(\d+)\s*people found this review funny/i
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    return 0;
  }

  /**
   * 提取评论数
   * 页面结构: <span id="commentthread_..._totalcount">16</span> 条留言
   */
  extractCommentCount(html) {
    const patterns = [
      // 中文：totalcount + 条留言
      /commentthread_[^"]*_totalcount[^>]*>(\d+)<\/span>\s*条留言/,
      // 英文：totalcount + Comments
      /commentthread_[^"]*_totalcount[^>]*>(\d+)<\/span>\s*Comments?/i,
      // 备用：直接匹配 totalcount
      /_totalcount[^>]*>(\d+)</,
      // 备用：直接匹配数字+留言
      />(\d+)<\/span>\s*条留言/,
      />(\d+)<\/span>\s*Comments?</i
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    return 0;
  }

  /**
   * 提取奖励数
   * 页面结构:
   * - 每个奖励类型有一个 <span class="review_award_count">数字</span>
   * - more_btn 的 data-count 是"隐藏的额外奖励类型数量"，不是总数
   * - 正确算法：累加所有 review_award_count，但排除 more_btn 里的那个
   *
   * 例：57的纸房子评测
   * - 显示的奖励：1+1+3+2+1+2+1+1+1 = 13
   * - more_btn显示"8"表示还有8种隐藏奖励类型
   * - 总奖励数 = 13（累加所有非more_btn的count）
   */
  extractAwardCount(html) {
    // 提取 review_award_ctn 区域的HTML
    const awardCtnMatch = html.match(/review_award_ctn">([\s\S]*?)<\/div>\s*<\/div>/);
    if (!awardCtnMatch) {
      return 0;
    }

    const awardHtml = awardCtnMatch[1];

    // 累加所有 review_award_count 的数字
    const countMatches = [...awardHtml.matchAll(/review_award_count[^>]*>(\d+)<\/span>/g)];
    let total = 0;

    for (const match of countMatches) {
      total += parseInt(match[1], 10);
    }

    // 如果存在 more_btn，需要减去它显示的数字（因为那不是奖励数，是隐藏类型数）
    const moreBtnMatch = awardHtml.match(/more_btn[^>]*>[\s\S]*?review_award_count[^>]*>(\d+)<\/span>/);
    if (moreBtnMatch) {
      total -= parseInt(moreBtnMatch[1], 10);
    }

    return total > 0 ? total : 0;
  }

  /**
   * 提取奖励图标列表（用于UI显示）
   * 返回每个奖励的图标URL、数量、名称
   *
   * Steam HTML结构分析：
   * <div class="review_award tooltip" data-tooltip-html="...reaction_award_name&gt;金独角兽&lt;...">
   *   <img class="review_award_icon" src="https://.../still/11.png"/>
   *   <span class="review_award_count hidden">1</span>
   * </div>
   *
   * 需要排除 more_btn：class="review_award more_btn tooltip"
   *
   * @param {string} html - 评测页面HTML
   * @returns {Array<{iconUrl: string, count: number, name: string}>}
   */
  extractAwards(html) {
    const awards = [];

    // 提取 review_award_ctn 区域
    const awardCtnMatch = html.match(/review_award_ctn">([\s\S]*?)(?:<\/div>\s*<\/div>\s*<\/div>|<div class="review_rate_bar)/);
    if (!awardCtnMatch) {
      return awards;
    }

    const awardHtml = awardCtnMatch[1];

    // 分步提取：先找到每个 review_award div（排除 more_btn）
    // 使用更宽松的正则，逐个提取信息
    const awardDivPattern = /<div[^>]*class="review_award tooltip"[^>]*data-tooltip-html="([^"]*)"[^>]*>[\s\S]*?<img[^>]*class="review_award_icon"[^>]*src="([^"]+)"[^>]*\/>[\s\S]*?<span[^>]*class="review_award_count[^"]*"[^>]*>(\d+)<\/span>/g;

    let match;
    while ((match = awardDivPattern.exec(awardHtml)) !== null) {
      const tooltipHtml = match[1];
      const iconUrl = match[2];
      const count = parseInt(match[3], 10);

      // 从 tooltip HTML 中提取奖励名称（HTML转义格式）
      // 格式：&lt;div class=&quot;reaction_award_name&quot;&gt;金独角兽&lt;/div&gt;
      const nameMatch = tooltipHtml.match(/reaction_award_name[^>]*&gt;([^&]+)&lt;/);
      const name = nameMatch ? nameMatch[1].trim() : '奖励';

      // 使用动态图标（animated）替换静态图标（still）
      const animatedIconUrl = iconUrl.replace('/still/', '/animated/');

      awards.push({
        name,
        iconUrl: animatedIconUrl,
        staticIconUrl: iconUrl,
        count
      });
    }

    return awards;
  }

  extractRecommendation(html) {
    return Constants.VALIDATION.POSITIVE_INDICATORS.some(
      indicator => html.includes(indicator)
    );
  }

  extractTotalHours(html) {
    for (const pattern of Constants.REGEX.TOTAL_HOURS) {
      const match = html.match(pattern);
      if (match) {
        return match[1].replace(/,/g, '');
      }
    }
    this.logger.warn('未能提取游戏时长');
    return '未知';
  }

  /**
   * 提取评测时的游戏时长
   * 格式：（评测时 14.2 小时） 或 (14.2 hrs at review time)
   */
  extractHoursAtReview(html) {
    const patterns = [
      /（评测时\s*([\d,.]+)\s*小时）/,
      /\(([\d,.]+)\s*hrs?\s+at\s+review\s+time\)/i
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return match[1].replace(/,/g, '');
      }
    }

    return null; // 有些评测可能没有这个信息
  }

  extractPublishDate(html) {
    for (const pattern of Constants.REGEX.PUBLISH_DATE) {
      const match = html.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    this.logger.warn('未能提取发布时间');
    return '未知';
  }

  extractUpdateDate(html) {
    // 优先匹配带年份
    for (const pattern of Constants.REGEX.UPDATE_DATE_WITH_YEAR) {
      const match = html.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // 不带年份
    for (const pattern of Constants.REGEX.UPDATE_DATE_WITHOUT_YEAR) {
      const match = html.match(pattern);
      if (match) {
        const currentYear = new Date().getFullYear();
        return `${match[1].trim()} (${currentYear})`;
      }
    }

    return null;
  }
}

if (typeof window !== 'undefined') {
  window.FRF_ReviewExtractor = ReviewExtractor;
}


// ==================== src/core/ReviewCache.js ====================

/**
 * 评测字典缓存管理器 - v5.0 精简版
 * 负责查询、持久化好友评测字典
 *
 * 缓存通过快速搜索自动构建，无需手动调用 buildCache
 */

class ReviewCache {
  constructor() {
    this.logger = new Logger('ReviewCache');

    // 字典结构：{ steamId: [appId1, appId2, ...] }
    this.friendReviewsMap = {};

    // 缓存键
    this.cacheKey = `${Constants.CACHE_KEY_PREFIX}review_dict_${Constants.CACHE_VERSION}`;
  }

  /**
   * 查找哪些好友评测了指定游戏
   * @param {string} appId - 游戏 App ID
   * @returns {Array<string>} Steam ID 数组
   */
  findFriendsWithReview(appId) {
    const matchedFriends = Object.keys(this.friendReviewsMap).filter(
      steamId => this.friendReviewsMap[steamId].includes(appId)
    );

    this.logger.info(`游戏 ${appId} 匹配到 ${matchedFriends.length} 个好友`);
    return matchedFriends;
  }

  /**
   * 从缓存加载
   * @returns {boolean} 是否成功加载
   */
  loadFromCache() {
    const cached = localStorage.getItem(this.cacheKey);
    if (!cached) {
      this.logger.info('无缓存数据');
      return false;
    }

    try {
      const { timestamp, data, version } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      // 检查版本和有效期
      if (version !== Constants.CACHE_VERSION) {
        this.logger.info(`缓存版本不匹配: ${version} != ${Constants.CACHE_VERSION}`);
        return false;
      }

      // 获取用户设置的缓存有效期（天数），默认3天
      const cacheDays = (window.FRF && typeof window.FRF._cacheDays === 'number')
        ? window.FRF._cacheDays
        : 3;

      // 如果设置为0，表示不使用缓存
      if (cacheDays === 0) {
        this.logger.info('缓存已禁用（用户设置为不缓存）');
        return false;
      }

      const cacheDuration = cacheDays * 24 * 3600000; // 转换为毫秒
      if (age >= cacheDuration) {
        this.logger.info(`缓存已过期 (${(age / 86400000).toFixed(1)} 天，有效期 ${cacheDays} 天)`);
        return false;
      }

      this.friendReviewsMap = data;
      this.logger.info(`成功加载缓存 (${Object.keys(data).length} 个好友, ${(age / 3600000).toFixed(1)} 小时前)`);

      return true;

    } catch (error) {
      this.logger.error('加载缓存失败', error);
      return false;
    }
  }

  /**
   * 保存到 LocalStorage
   */
  saveToCache() {
    try {
      const cacheData = {
        version: Constants.CACHE_VERSION,
        timestamp: Date.now(),
        data: this.friendReviewsMap
      };

      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
      this.logger.info('缓存已保存');

    } catch (error) {
      this.logger.error('保存缓存失败', error);
    }
  }

  /**
   * 清除缓存
   */
  clearCache() {
    localStorage.removeItem(this.cacheKey);
    this.friendReviewsMap = {};
    this.logger.info('缓存已清除');
  }

  /**
   * 添加单条评测记录到缓存（用于快速模式同步）
   * @param {string} steamId - 好友 Steam ID
   * @param {string} appId - 游戏 App ID
   */
  addReviewToCache(steamId, appId) {
    if (!this.friendReviewsMap[steamId]) {
      this.friendReviewsMap[steamId] = [];
    }
    if (!this.friendReviewsMap[steamId].includes(appId)) {
      this.friendReviewsMap[steamId].push(appId);
    }
  }

  /**
   * 从缓存中移除指定游戏的评测记录（用于后台更新发现删除的评测）
   * @param {string} steamId - 好友 Steam ID
   * @param {string} appId - 游戏 App ID
   */
  removeReviewFromCache(steamId, appId) {
    if (this.friendReviewsMap[steamId]) {
      const index = this.friendReviewsMap[steamId].indexOf(appId);
      if (index !== -1) {
        this.friendReviewsMap[steamId].splice(index, 1);
        // 如果该好友没有评测记录了，删除整个条目
        if (this.friendReviewsMap[steamId].length === 0) {
          delete this.friendReviewsMap[steamId];
        }
      }
    }
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats() {
    const friendsCount = Object.keys(this.friendReviewsMap).length;
    const totalReviews = Object.values(this.friendReviewsMap).reduce((sum, arr) => sum + arr.length, 0);

    return {
      friendsWithReviews: friendsCount,
      totalReviews: totalReviews,
      cacheAge: this.getCacheAge()
    };
  }

  /**
   * 获取缓存年龄（小时）
   */
  getCacheAge() {
    const cached = localStorage.getItem(this.cacheKey);
    if (!cached) return null;

    try {
      const { timestamp } = JSON.parse(cached);
      const ageMs = Date.now() - timestamp;
      return (ageMs / 3600000).toFixed(1);
    } catch {
      return null;
    }
  }
}

if (typeof window !== 'undefined') {
  window.FRF_ReviewCache = ReviewCache;
}


// ==================== src/core/QuickSearcher.js ====================

/**
 * 快速搜索器 - v3.0 快速模式核心模块
 *
 * 算法逻辑：
 * 1. 获取好友列表
 * 2. 遍历每个好友，请求 /profiles/{steamId}/recommended/{appId}/
 * 3. 检查最终 URL 判断是否有评测
 *    - URL 包含 appId = 有评测 → 提取数据
 *    - URL 被重定向 = 没评测 → 返回 null
 * 4. 收集所有有效评测
 *
 * 优化参数（基于实测）：
 * - batchSize=30：最优并发数
 * - delay=0：无延迟最快
 * - 229 好友约 42 秒完成
 */

class QuickSearcher {
  constructor(appId) {
    this.appId = String(appId);
    this.logger = new Logger('QuickSearcher');
    this.extractor = new ReviewExtractor();

    // 配置参数（已优化：基于限流研究）
    this.batchSize = 30;        // 每批并发数
    this.delay = 50;            // 批次间延迟（ms）
    this.debugMode = false;     // 调试模式

    // 状态
    this.isPaused = false;
    this.isRunning = false;
    this.reviews = [];
    this.friendIds = [];
    this.currentIndex = 0;
    this.startTime = 0;

    // 回调
    this.onProgress = null;
    this.onComplete = null;
    this.onPause = null;
  }

  /**
   * 开始快速搜索
   * @param {Object} options - 配置选项
   * @param {Function} options.onProgress - 进度回调 (current, total, found, eta)
   * @param {Function} options.onComplete - 完成回调 (reviews)
   * @param {Function} options.onPause - 暂停回调 (current, total)
   * @returns {Promise<Array>} 评测数据数组
   */
  async search(options = {}) {
    this.onProgress = options.onProgress || null;
    this.onComplete = options.onComplete || null;
    this.onPause = options.onPause || null;

    this.logger.info('========================================');
    this.logger.info('  🚀 快速模式 - 单游戏搜索');
    this.logger.info(`  🎮 目标游戏: ${this.appId}`);
    this.logger.info('========================================');
    this.logger.info('');

    try {
      // 1. 获取好友列表
      this.logger.info('📋 正在获取好友列表...');
      this.friendIds = await this.fetchFriendIds();
      this.logger.info(`✅ 获取到 ${this.friendIds.length} 个好友`);
      this.logger.info('');

      // 2. 开始搜索
      this.logger.info(`🔍 开始搜索好友评测...`);
      this.logger.info(`⚙️ 配置: 批次=${this.batchSize}, 延迟=${this.delay}ms`);
      this.logger.info('');

      this.isRunning = true;
      this.isPaused = false;
      this.startTime = Date.now();
      this.reviews = [];
      this.currentIndex = 0;

      await this.processAllFriends();

      // 3. 输出结果
      this.logger.info('');
      this.logger.info('========================================');
      this.logger.info('  ✅ 搜索完成！');
      this.logger.info('========================================');
      this.showResults();

      if (this.onComplete) {
        this.onComplete(this.reviews);
      }

      return this.reviews;

    } catch (error) {
      this.logger.error('搜索失败', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * 获取好友列表
   */
  async fetchFriendIds() {
    const response = await fetch('/my/friends/', { credentials: 'include' });
    if (!response.ok) {
      throw new Error(`获取好友列表失败: HTTP ${response.status}`);
    }

    const html = await response.text();
    const regex = /data-steamid="(\d+)"/g;
    const matches = [...html.matchAll(regex)];
    return [...new Set(matches.map(m => m[1]))];
  }

  /**
   * 处理所有好友
   */
  async processAllFriends() {
    const total = this.friendIds.length;

    while (this.currentIndex < total) {
      // 检查是否暂停
      if (this.isPaused) {
        this.logger.info(`⏸️ 已暂停 (${this.currentIndex}/${total})`);
        if (this.onPause) {
          this.onPause(this.currentIndex, total);
        }
        return;
      }

      // 获取当前批次
      const batch = this.friendIds.slice(
        this.currentIndex,
        Math.min(this.currentIndex + this.batchSize, total)
      );

      // 并发处理当前批次
      const promises = batch.map(steamId => this.checkFriendReview(steamId));
      const results = await Promise.all(promises);

      // 收集有效结果
      const validReviews = results.filter(r => r !== null);
      this.reviews.push(...validReviews);

      // 更新进度
      this.currentIndex += batch.length;

      // 计算 ETA
      const elapsed = Date.now() - this.startTime;
      const avgPerFriend = elapsed / this.currentIndex;
      const remaining = (total - this.currentIndex) * avgPerFriend;
      const eta = this.formatTime(remaining);

      // 进度回调
      if (this.onProgress) {
        this.onProgress(this.currentIndex, total, this.reviews.length, eta);
      }

      // 每 9 个好友显示一次进度
      if (this.currentIndex % 9 === 0 || this.currentIndex === total) {
        this.logger.info(
          `📊 进度: ${this.currentIndex}/${total}, ` +
          `已找到: ${this.reviews.length} 篇, ` +
          `预计剩余: ${eta}`
        );
      }

      // 批次延迟
      if (this.currentIndex < total && !this.isPaused) {
        await this.sleep(this.delay);
      }
    }
  }

  /**
   * 检查单个好友是否有目标游戏的评测
   * 通过 URL 重定向检测：有评测则停留在原 URL，无评测则重定向到 /recommended/
   *
   * @param {string} steamId - 好友 Steam ID
   * @param {boolean} returnRaw - 是否返回原始数据（包含HTML）
   * @param {number} requestStartTime - 首次请求时间戳（内部使用）
   * @returns {Promise<Object|null>} 评测数据或 null
   */
  async checkFriendReview(steamId, returnRaw = false, requestStartTime = null) {
    const url = `https://steamcommunity.com/profiles/${steamId}/recommended/${this.appId}/`;
    const startTime = Date.now();
    const retryDelay = 10000;    // 重试等待时间（10秒）
    const maxRetryDuration = 60000; // 最大重试时长（1分钟）

    // 记录首次请求时间
    if (requestStartTime === null) {
      requestStartTime = startTime;
    }

    try {
      const response = await fetch(url, {
        credentials: 'include',
        redirect: 'follow'
      });

      const elapsed = Date.now() - startTime;

      // 429 限流处理：无限重试，最多1分钟
      if (response.status === 429) {
        const totalElapsed = Date.now() - requestStartTime;
        if (totalElapsed < maxRetryDuration) {
          if (this.debugMode) {
            console.log(`[DEBUG] ${steamId} | 429 限流，等待 ${retryDelay/1000}s 后重试 (已用时 ${Math.round(totalElapsed/1000)}s)`);
          }
          await this.sleep(retryDelay);
          return this.checkFriendReview(steamId, returnRaw, requestStartTime);
        } else {
          if (this.debugMode) {
            console.log(`[DEBUG] ${steamId} | 429 限流，已超过最大重试时长 ${maxRetryDuration/1000}s`);
          }
          return null;
        }
      }

      if (!response.ok) {
        if (this.debugMode) {
          console.log(`[DEBUG] ${steamId} | not ok (${response.status}) | ${elapsed}ms`);
        }
        return null;
      }

      // 检查最终 URL 是否包含 appId（未被重定向 = 有评测）
      const finalUrl = response.url;
      const hasReview = finalUrl.includes(`/recommended/${this.appId}`);

      if (this.debugMode) {
        console.log(`[DEBUG] ${steamId} | hasReview=${hasReview} | ${elapsed}ms`);
      }

      if (!hasReview) {
        return null;
      }

      // 有评测，提取数据
      const html = await response.text();

      // 如果需要原始数据（用于UI渲染），返回包含HTML的对象
      if (returnRaw) {
        return {
          hasReview: true,
          html: html,
          steamId: steamId
        };
      }

      return this.extractReviewData(html, steamId);

    } catch (error) {
      if (this.debugMode) {
        console.log(`[DEBUG] ${steamId} | error: ${error.message}`);
      }
      return null;
    }
  }

  /**
   * 从 HTML 提取评测数据
   */
  extractReviewData(html, steamId) {
    return {
      steamId,
      appId: this.appId,
      url: `https://steamcommunity.com/profiles/${steamId}/recommended/${this.appId}/`,
      isPositive: this.extractRecommendation(html),
      totalHours: this.extractTotalHours(html),
      publishDate: this.extractPublishDate(html),
      updateDate: this.extractUpdateDate(html)
    };
  }

  /**
   * 提取推荐状态
   */
  extractRecommendation(html) {
    const positiveIndicators = [
      'icon_thumbsUp.png',
      'ratingSummary">推荐',
      'ratingSummary">Recommended'
    ];
    return positiveIndicators.some(indicator => html.includes(indicator));
  }

  /**
   * 提取游戏时长
   */
  extractTotalHours(html) {
    const patterns = [
      /总时数\s*([\d,]+(?:\.\d+)?)\s*小时/,
      /([\d,]+(?:\.\d+)?)\s*hrs?\s+on\s+record/i
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return match[1].replace(/,/g, '');
      }
    }
    return '未知';
  }

  /**
   * 提取发布时间
   */
  extractPublishDate(html) {
    const patterns = [
      /发布于[：:]\s*([^<\r\n]+)/,
      /Posted[：:]\s*([^<\r\n]+)/i
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return '未知';
  }

  /**
   * 提取更新时间
   */
  extractUpdateDate(html) {
    // 带年份
    const withYearPatterns = [
      /更新于[：:]\s*(\d{4}\s*年[^<\r\n]+)/,
      /Updated[：:]\s*([A-Za-z]+\s+\d+,\s*\d{4}[^<\r\n]+)/i
    ];

    for (const pattern of withYearPatterns) {
      const match = html.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // 不带年份
    const withoutYearPatterns = [
      /更新于[：:]\s*(\d{1,2}\s*月\s*\d{1,2}\s*日[^<\r\n]*?)(?:<|$)/,
      /Updated[：:]\s*([A-Za-z]+\s+\d{1,2}[^<\r\n]*?)(?:<|$)/i
    ];

    for (const pattern of withoutYearPatterns) {
      const match = html.match(pattern);
      if (match) {
        const year = new Date().getFullYear();
        return `${match[1].trim()} (${year})`;
      }
    }

    return null;
  }

  /**
   * 显示结果统计
   */
  showResults() {
    const positive = this.reviews.filter(r => r.isPositive).length;
    const negative = this.reviews.length - positive;
    const elapsed = this.formatTime(Date.now() - this.startTime);

    this.logger.info(`📊 检查了 ${this.friendIds.length} 个好友`);
    this.logger.info(`📊 找到 ${this.reviews.length} 篇评测`);
    this.logger.info(`   👍 推荐: ${positive} 篇`);
    this.logger.info(`   👎 不推荐: ${negative} 篇`);
    this.logger.info(`⏱️ 总耗时: ${elapsed}`);
    this.logger.info('');

    // 保存到全局
    window.frfQuickReviews = this.reviews;
    this.logger.info('💾 评测数据已保存到 window.frfQuickReviews');

    // 同步到字典缓存
    this.syncToDict();
  }

  /**
   * 将快速模式结果同步到字典缓存
   */
  syncToDict() {
    if (this.reviews.length === 0) return;

    try {
      const cacheKey = `${Constants.CACHE_KEY_PREFIX}review_dict_${Constants.CACHE_VERSION}`;
      const cached = localStorage.getItem(cacheKey);

      let dictData = {};
      let timestamp = Date.now();

      // 如果已有字典，先加载
      if (cached) {
        const parsed = JSON.parse(cached);
        dictData = parsed.data || {};
        timestamp = parsed.timestamp || Date.now();
      }

      // 更新字典：将快速模式找到的评测同步进去
      let updated = 0;
      for (const review of this.reviews) {
        const steamId = review.steamId;
        const appId = review.appId;

        if (!dictData[steamId]) {
          dictData[steamId] = [];
        }

        if (!dictData[steamId].includes(appId)) {
          dictData[steamId].push(appId);
          updated++;
        }
      }

      // 保存回 localStorage
      if (updated > 0) {
        const cacheData = {
          version: Constants.CACHE_VERSION,
          timestamp: timestamp,
          data: dictData
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        this.logger.info(`📚 已同步 ${updated} 条记录到字典缓存`);
      }

    } catch (error) {
      this.logger.warn('同步到字典缓存失败', error);
    }
  }

  /**
   * 暂停搜索
   */
  pause() {
    if (this.isRunning && !this.isPaused) {
      this.isPaused = true;
      this.logger.info('⏸️ 正在暂停...');
    }
  }

  /**
   * 继续搜索
   */
  async resume() {
    if (this.isPaused && this.currentIndex < this.friendIds.length) {
      this.isPaused = false;
      this.isRunning = true;
      this.logger.info('▶️ 继续搜索...');

      await this.processAllFriends();

      if (!this.isPaused) {
        this.logger.info('');
        this.logger.info('========================================');
        this.logger.info('  ✅ 搜索完成！');
        this.logger.info('========================================');
        this.showResults();

        if (this.onComplete) {
          this.onComplete(this.reviews);
        }
      }
    }
  }

  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      currentIndex: this.currentIndex,
      totalFriends: this.friendIds.length,
      foundReviews: this.reviews.length,
      progress: this.friendIds.length > 0
        ? ((this.currentIndex / this.friendIds.length) * 100).toFixed(1)
        : 0
    };
  }

  /**
   * 格式化时间
   */
  formatTime(ms) {
    if (ms < 1000) return '< 1 秒';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds} 秒`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} 分 ${remainingSeconds} 秒`;
  }

  /**
   * 睡眠
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 暴露到全局
if (typeof window !== 'undefined') {
  window.FRF_QuickSearcher = QuickSearcher;
}


// ==================== src/core/SteamAPI.js ====================

/**
 * Steam API 交互层 - 新架构
 * 负责所有与 Steam 服务器的通信
 */

class SteamAPI {
  constructor(appId) {
    this.appId = String(appId); // 确保 appId 为字符串
    this.logger = new Logger('SteamAPI');
    this.validator = new Validator();
    this.extractor = new ReviewExtractor();
  }

  /**
   * 检查域名
   */
  checkDomain() {
    if (!window.location.hostname.includes('steamcommunity.com')) {
      throw new Error('必须在 steamcommunity.com 域名下运行');
    }
  }

  /**
   * 获取好友列表
   * @returns {Promise<Array<string>>} Steam ID 数组
   */
  async getFriendsList() {
    this.checkDomain();
    this.logger.time('获取好友列表');
    this.logger.info('开始获取好友列表...');

    try {
      const response = await fetch(Constants.FRIENDS_LIST_URL, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const matches = [...html.matchAll(Constants.REGEX.STEAM_ID)];
      const friendIds = [...new Set(matches.map(m => m[1]))];

      this.logger.timeEnd('获取好友列表');
      this.logger.info(`成功获取 ${friendIds.length} 个好友`);

      return friendIds;

    } catch (error) {
      this.logger.error('获取好友列表失败', error);
      throw error;
    }
  }

  /**
   * 获取单个好友的评测详细数据
   * @param {string} steamId - 好友 Steam ID
   * @returns {Promise<Object|null>} 评测数据
   */
  async getFriendReview(steamId) {
    const url = Constants.PROFILE_GAME_REVIEW_URL(steamId, this.appId);
    const fullUrl = `${Constants.STEAM_COMMUNITY}${url}`;

    try {
      const response = await fetch(fullUrl, {
        credentials: 'include',
        redirect: 'follow'
      });

      if (!response.ok) {
        this.logger.debug(`好友 ${steamId} 请求失败: HTTP ${response.status}`);
        return null;
      }

      const html = await response.text();
      const finalUrl = response.url;

      // 三重验证
      const validation = this.validator.validateReviewPage(finalUrl, html, this.appId);

      if (!validation.valid) {
        this.logger.debug(`好友 ${steamId} 验证失败: ${validation.reason}`);
        return null;
      }

      // 提取数据
      const reviewData = this.extractor.extract(html, steamId, this.appId);
      this.logger.debug(`好友 ${steamId} 评测提取成功`);

      return reviewData;

    } catch (error) {
      this.logger.warn(`好友 ${steamId} 请求异常`, error);
      return null;
    }
  }

  /**
   * 批量获取好友评测（带进度回调）
   * @param {Array<string>} friendIds - 好友 Steam ID 列表
   * @param {Function} onProgress - 进度回调 (current, total, found)
   * @returns {Promise<Array<Object>>} 评测数据数组
   */
  async batchGetReviews(friendIds, onProgress = null) {
    this.logger.time('批量获取评测');
    this.logger.info(`开始获取 ${friendIds.length} 个好友的详细评测...`);

    const allReviews = [];
    let currentIndex = 0;

    for (let i = 0; i < friendIds.length; i += Constants.BATCH_SIZE) {
      const batch = friendIds.slice(i, Math.min(i + Constants.BATCH_SIZE, friendIds.length));

      // 并发请求
      const promises = batch.map(steamId => this.getFriendReview(steamId));
      const results = await Promise.all(promises);

      // 过滤 null
      const validReviews = results.filter(review => review !== null);
      allReviews.push(...validReviews);

      currentIndex += batch.length;

      // 进度回调
      if (onProgress) {
        onProgress(currentIndex, friendIds.length, allReviews.length);
      }

      this.logger.debug(`批次进度: ${currentIndex}/${friendIds.length}, 已找到 ${allReviews.length} 篇`);

      // 批次延迟
      if (currentIndex < friendIds.length) {
        await this.delay(Constants.REQUEST_DELAY);
      }
    }

    this.logger.timeEnd('批量获取评测');
    this.logger.info(`完成！共获取 ${allReviews.length} 篇评测`);

    return allReviews;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

if (typeof window !== 'undefined') {
  window.FRF_SteamAPI = SteamAPI;
}


// ==================== src/ui/UIRenderer.js ====================

/**
 * UI渲染器
 * 生成Steam原生风格的评测卡片，注入到页面中
 */

class UIRenderer {
  constructor() {
    this.logger = new Logger('UIRenderer');
    this.container = null;
    this.loadingElement = null;
  }

  /**
   * 初始化渲染器，获取或创建目标容器
   */
  init() {
    // 注入样式
    this.injectStyles();

    // 尝试获取现有容器
    this.container = document.querySelector('#AppHubCards');

    if (this.container) {
      this.logger.info('UIRenderer 初始化成功（使用现有容器）');
      return true;
    }

    // 容器不存在（Steam bug页面），需要创建
    this.logger.info('未找到 #AppHubCards，尝试创建容器...');

    // 查找合适的插入位置
    // Steam页面结构：.apphub_HomeHeaderContent 之后是 #apphub_InitialContent
    // 我们要在 .apphub_HomeHeaderContent 的父元素(.apphub_background)内
    // 在 .apphub_HomeHeaderContent 之后插入

    // 优先级1：在 #apphub_InitialContent 后面（原始bug位置之后）
    const initialContent = document.querySelector('#apphub_InitialContent');
    if (initialContent) {
      this.container = this.createContainer();
      initialContent.parentNode.insertBefore(this.container, initialContent.nextSibling);
      this.logger.info('UIRenderer 初始化成功（在 apphub_InitialContent 后创建容器）');
      return true;
    }

    // 优先级2：在 .apphub_HomeHeaderContent 之后
    const headerContent = document.querySelector('.apphub_HomeHeaderContent');
    if (headerContent && headerContent.parentNode) {
      this.container = this.createContainer();
      // 插入到 headerContent 后面的下一个兄弟节点之后
      const nextSibling = headerContent.nextElementSibling;
      if (nextSibling) {
        headerContent.parentNode.insertBefore(this.container, nextSibling.nextSibling);
      } else {
        headerContent.parentNode.appendChild(this.container);
      }
      this.logger.info('UIRenderer 初始化成功（在 apphub_HomeHeaderContent 后创建容器）');
      return true;
    }

    // 优先级3：apphub_background 内部
    const background = document.querySelector('.apphub_background');
    if (background) {
      this.container = this.createContainer();
      background.appendChild(this.container);
      this.logger.info('UIRenderer 初始化成功（在 apphub_background 内创建容器）');
      return true;
    }

    // 优先级4：ModalContentContainer 内部
    const modalContainer = document.querySelector('#ModalContentContainer');
    if (modalContainer) {
      this.container = this.createContainer();
      modalContainer.appendChild(this.container);
      this.logger.info('UIRenderer 初始化成功（在 ModalContentContainer 内创建容器）');
      return true;
    }

    this.logger.error('无法找到合适的容器插入位置');
    return false;
  }

  /**
   * 创建评测卡片容器
   * @returns {HTMLElement}
   */
  createContainer() {
    const container = document.createElement('div');
    container.id = 'AppHubCards';
    container.className = 'apphub_CardContentContainer frf_container';
    // 使用与Steam原生一致的样式
    container.style.cssText = 'clear: both;';
    return container;
  }

  /**
   * 清空容器内容
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * 显示加载状态
   * @param {string} message - 加载提示消息
   */
  showLoading(message = '正在加载好友评测...') {
    if (!this.container) return;

    this.loadingElement = document.createElement('div');
    this.loadingElement.className = 'frf_loading';
    this.loadingElement.innerHTML = `
      <div class="frf_loading_content">
        <img src="https://community.fastly.steamstatic.com/public/images/login/throbber.gif" alt="Loading">
        <span class="frf_loading_text">${message}</span>
      </div>
    `;

    // 添加样式
    this.injectStyles();

    this.container.appendChild(this.loadingElement);
  }

  /**
   * 显示 FRF 欢迎横幅（进入好友评测页面立即显示）
   */
  showWelcomeBanner() {
    // 确保样式已注入
    this.injectStyles();

    // 检查是否已存在
    if (document.querySelector('.frf_welcome_banner')) return;

    const banner = document.createElement('div');
    banner.className = 'frf_welcome_banner';
    banner.innerHTML = `
      <div class="frf_banner_content">
        <div class="frf_banner_icon">🚀</div>
        <div class="frf_banner_text">
          <div class="frf_banner_title">FRF 好友评测增强工具已启动</div>
          <div class="frf_banner_desc">
            <span class="frf_banner_item">• 检测到渲染问题将自动修复</span>
            <span class="frf_banner_item">• 点击上方 <strong>FRF 刷新</strong> 按钮可使用增强阅读模式</span>
          </div>
        </div>
        <button class="frf_banner_close" title="关闭提示">✕</button>
      </div>
    `;

    // 关闭按钮事件
    banner.querySelector('.frf_banner_close').addEventListener('click', (e) => {
      e.stopPropagation();
      this.hideWelcomeBanner();
    });

    // 找合适的插入位置（在筛选栏下方）
    const filterArea = document.querySelector('.apphub_SectionFilter');
    if (filterArea && filterArea.parentNode) {
      filterArea.parentNode.insertBefore(banner, filterArea.nextSibling);
      this.logger.info('显示欢迎横幅（在筛选栏后）');
    } else {
      // 备选位置
      const initialContent = document.querySelector('#apphub_InitialContent');
      if (initialContent && initialContent.parentNode) {
        initialContent.parentNode.insertBefore(banner, initialContent);
        this.logger.info('显示欢迎横幅（在 apphub_InitialContent 前）');
      }
    }
  }

  /**
   * 隐藏欢迎横幅
   */
  hideWelcomeBanner() {
    const banner = document.querySelector('.frf_welcome_banner');
    if (banner) {
      banner.remove();
    }
  }

  /**
   * 显示修复中提示（已废弃，保留兼容）
   * @deprecated 使用 showWelcomeBanner 替代
   */
  showFixingNotice() {
    // 改为显示欢迎横幅
    this.showWelcomeBanner();
  }

  /**
   * 隐藏修复中提示（已废弃，保留兼容）
   * @deprecated 使用 hideWelcomeBanner 替代
   */
  hideFixingNotice() {
    this.hideWelcomeBanner();
  }

  /**
   * 显示数据更新提示（后台更新发现数据改动时显示）
   * @param {string} message - 提示消息
   */
  showUpdateNotice(message) {
    // 先移除已有的提示
    this.hideUpdateNotice();

    const notice = document.createElement('div');
    notice.className = 'frf_update_notice';
    notice.innerHTML = `
      <div class="frf_update_content">
        <span class="frf_update_icon">🔔</span>
        <span class="frf_update_text">${message}</span>
        <button class="frf_update_btn" title="点击刷新获取最新数据">刷新</button>
        <button class="frf_update_close" title="忽略">✕</button>
      </div>
    `;

    // 刷新按钮事件
    notice.querySelector('.frf_update_btn').addEventListener('click', () => {
      this.hideUpdateNotice();
      if (window.FRF && window.FRF.renderUI) {
        window.FRF.renderUI(true); // 强制刷新
      }
    });

    // 关闭按钮事件
    notice.querySelector('.frf_update_close').addEventListener('click', () => {
      this.hideUpdateNotice();
    });

    // 插入到页面顶部（容器之前）
    if (this.container && this.container.parentNode) {
      this.container.parentNode.insertBefore(notice, this.container);
    } else {
      // 备选：插入到筛选栏后面
      const filterArea = document.querySelector('.apphub_SectionFilter');
      if (filterArea && filterArea.parentNode) {
        filterArea.parentNode.insertBefore(notice, filterArea.nextSibling);
      }
    }

    this.logger.info('显示更新提示:', message);
  }

  /**
   * 隐藏数据更新提示
   */
  hideUpdateNotice() {
    const notice = document.querySelector('.frf_update_notice');
    if (notice) {
      notice.remove();
    }
  }

  /**
   * 更新加载进度
   * @param {number} checked - 已检查好友数
   * @param {number} total - 总好友数
   * @param {number} found - 已找到评测数
   */
  updateProgress(checked, total, found = 0) {
    if (this.loadingElement) {
      const textElement = this.loadingElement.querySelector('.frf_loading_text');
      if (textElement) {
        textElement.textContent = `正在加载好友评测... 已检查 ${checked}/${total}，找到 ${found} 篇`;
      }
    }
  }

  /**
   * 隐藏加载状态
   */
  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.remove();
      this.loadingElement = null;
    }
  }

  /**
   * 渲染单个评测卡片
   * @param {Object} review - 评测数据对象
   * @returns {Promise<HTMLElement>} 卡片元素
   */
  async renderCard(review) {
    const card = document.createElement('div');
    // 使用自定义class，避免Steam CSS干扰
    card.className = 'frf_card';
    card.setAttribute('role', 'button');

    // 处理截图链接（异步）
    if (review.reviewContent) {
      review.reviewContent = await this.processScreenshots(review.reviewContent);
    }

    // 构建卡片HTML
    card.innerHTML = this.buildCardHTML(review);

    // 添加点击事件（打开评测详情）
    card.addEventListener('click', (e) => {
      // 如果点击的是链接、图片或按钮，不处理
      if (e.target.tagName === 'A' || e.target.tagName === 'IMG' || e.target.closest('a') || e.target.closest('button')) return;

      // 如果用户正在选择文字，不跳转
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        return;
      }

      window.open(`https://steamcommunity.com${review.url}`, '_blank');
    });

    // 绑定投票按钮点击事件
    const voteButtons = card.querySelectorAll('.frf_vote_btn');
    voteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleVoteClick(e));
    });

    return card;
  }

  /**
   * 构建卡片内部HTML - 完全自定义样式，避免Steam CSS干扰
   * @param {Object} review - 评测数据
   * @returns {string} HTML字符串
   */
  buildCardHTML(review) {
    const thumbIcon = review.isPositive
      ? 'https://community.fastly.steamstatic.com/public/shared/images/userreviews/icon_thumbsUp.png?v=1'
      : 'https://community.fastly.steamstatic.com/public/shared/images/userreviews/icon_thumbsDown.png?v=1';

    const recommendText = review.isPositive ? '推荐' : '不推荐';

    // 截断过长的评测内容（安全截断，避免破坏HTML标签）
    // 从设置读取截断长度，默认300；设为0表示不截断
    const uiConfig = window.FRF && window.FRF._uiConfig;
    const maxContentLength = (uiConfig && typeof uiConfig.contentTruncate === 'number') ? uiConfig.contentTruncate : 300;
    let displayContent = this.safeHTMLTruncate(review.reviewContent || '', maxContentLength);

    // 格式化有价值/欢乐人数（如果都为0则不显示）
    let helpfulText = '';
    if (review.helpfulCount > 0 && review.funnyCount > 0) {
      helpfulText = `有 ${review.helpfulCount} 人觉得这篇评测有价值，有 ${review.funnyCount} 人觉得这篇评测很欢乐`;
    } else if (review.helpfulCount > 0) {
      helpfulText = `有 ${review.helpfulCount} 人觉得这篇评测有价值`;
    } else if (review.funnyCount > 0) {
      helpfulText = `有 ${review.funnyCount} 人觉得这篇评测很欢乐`;
    }
    // 如果都为0，helpfulText保持空字符串，不显示该行

    // 构建奖励HTML（优先显示图标，fallback显示数量）
    const awards = review.awards || [];
    const awardCount = review.awardCount || 0;
    let awardsHtml = '';

    if (awards.length > 0) {
      // 有奖励详情：显示图标
      awardsHtml = awards.map(award => `
        <div class="frf_award_item" title="${award.name}">
          <img src="${award.iconUrl}" alt="${award.name}">
          ${award.count > 1 ? `<span class="frf_award_count">${award.count}</span>` : ''}
        </div>
      `).join('');
    } else if (awardCount > 0) {
      // 没有奖励详情但有数量：显示奖励数（fallback）
      awardsHtml = `
        <div class="frf_award">
          <img class="frf_award_icon" src="https://community.fastly.steamstatic.com/public/images/skin_1/award_icon.png" alt="Award">
          <span>${awardCount}</span>
        </div>
      `;
    }

    // 用户头像（使用默认头像作为后备）
    const avatarUrl = review.userAvatar ||
      'https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg';

    // 头像框（如果有）
    const avatarFrameUrl = review.avatarFrame;

    // 构建头像HTML（支持头像框）
    let avatarHtml = '';
    if (avatarFrameUrl) {
      // 有头像框：使用双层结构
      avatarHtml = `
        <div class="frf_avatar_container">
          <img src="${avatarUrl}" class="frf_avatar_img">
          <img src="${avatarFrameUrl}" class="frf_avatar_frame">
        </div>
      `;
    } else {
      // 无头像框：普通单层头像
      avatarHtml = `<img src="${avatarUrl}" class="frf_avatar_img">`;
    }

    // 格式化日期显示（发布于 + 更新于）
    let dateText = `发布于：${review.publishDate}`;
    if (review.updateDate) {
      dateText += `<br>更新于：${review.updateDate}`;
    }

    // 完全自定义HTML结构，使用frf_前缀避免Steam CSS干扰
    return `
      <div class="frf_card_inner">
        <!-- 顶部：有价值人数 + 奖励图标 -->
        ${(helpfulText || awardsHtml) ? `
        <div class="frf_helpful_row">
          <span class="frf_helpful_text">${helpfulText}</span>
          <div class="frf_awards_container">
            ${awardsHtml}
          </div>
        </div>
        ` : ''}

        <!-- 推荐区域 -->
        <div class="frf_recommend_row">
          <img src="${thumbIcon}" class="frf_thumb_icon">
          <div class="frf_recommend_info">
            <div class="frf_recommend_title">${recommendText}</div>
            <div class="frf_recommend_hours">总时数 ${review.totalHours} 小时</div>
          </div>
        </div>

        <!-- 发布/更新日期 -->
        <div class="frf_date_row">${dateText}</div>

        <!-- 评测内容 -->
        <div class="frf_content_row">${displayContent}</div>

        <!-- 底部用户信息栏 -->
        <div class="frf_author_row">
          <div class="frf_author_left">
            <a href="${review.userProfileUrl}" class="frf_avatar_link">
              ${avatarHtml}
            </a>
            <div class="frf_author_info">
              <a href="${review.userProfileUrl}" class="frf_author_name">${review.userName}</a>
              <div class="frf_author_tag">${review.hoursAtReview ? `评测时 ${review.hoursAtReview} 小时` : ''}</div>
            </div>
          </div>
          <div class="frf_author_right">
            ${review.recommendationId ? `
            <div class="frf_vote_buttons">
              <button class="frf_vote_btn frf_vote_yes${review.votedUp ? ' voted' : ''}" data-action="rate" data-value="true" data-id="${review.recommendationId}" title="是">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
              </button>
              <button class="frf_vote_btn frf_vote_no${review.votedDown ? ' voted' : ''}" data-action="rate" data-value="false" data-id="${review.recommendationId}" title="否">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>
              </button>
              <button class="frf_vote_btn frf_vote_funny${review.votedFunny ? ' voted' : ''}" data-action="funny" data-value="true" data-id="${review.recommendationId}" title="欢乐">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
              </button>
            </div>
            ` : ''}
            <div class="frf_comment_area">
              <svg class="frf_comment_icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6h-2V3c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v14l4-4h7v4c0 1.1.9 2 2 2h7l4 4V8c0-1.1-.9-2-2-2zM5 11c-.83 0-1.5-.67-1.5-1.5S4.17 8 5 8s1.5.67 1.5 1.5S5.83 11 5 11zm4 0c-.83 0-1.5-.67-1.5-1.5S8.17 8 9 8s1.5.67 1.5 1.5S9.83 11 9 11zm4 0c-.83 0-1.5-.67-1.5-1.5S12.17 8 13 8s1.5.67 1.5 1.5S13.83 11 13 11z"/>
              </svg>
              <span class="frf_comment_count">${review.commentCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 批量渲染评测卡片
   * @param {Array} reviews - 评测数据数组
   */
  async renderAll(reviews) {
    if (!this.container) {
      this.logger.error('容器未初始化');
      return;
    }

    this.hideLoading();
    this.clear();

    if (reviews.length === 0) {
      this.showEmpty();
      return;
    }

    // 逐个渲染（异步处理截图）
    for (const review of reviews) {
      const card = await this.renderCard(review);
      this.container.appendChild(card);
    }

    this.logger.info(`渲染完成，共 ${reviews.length} 条评测`);
  }

  /**
   * 追加单个评测卡片（用于逐步显示）
   * @param {Object} review - 评测数据
   */
  async appendCard(review) {
    if (!this.container) return;

    const card = await this.renderCard(review);
    this.container.appendChild(card);
  }

  /**
   * 显示空状态
   */
  showEmpty() {
    if (!this.container) return;

    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'frf_empty';
    emptyDiv.innerHTML = `
      <div class="frf_empty_content">
        <p>暂无好友评测此游戏</p>
      </div>
    `;

    this.container.appendChild(emptyDiv);
  }

  /**
   * 显示错误状态
   * @param {string} message - 错误消息
   */
  showError(message) {
    if (!this.container) return;

    this.hideLoading();
    this.clear();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'frf_error';
    errorDiv.innerHTML = `
      <div class="frf_error_content">
        <p>加载失败：${message}</p>
        <button class="frf_retry_btn" onclick="window.FRF && window.FRF.renderUI()">重试</button>
      </div>
    `;

    this.container.appendChild(errorDiv);
  }

  /**
   * 添加刷新按钮到页面（在"关于评测"按钮右边）
   */
  addRefreshButton() {
    // 检查是否已存在
    if (document.querySelector('.frf_refresh_btn')) return;

    // 找到"关于评测"按钮所在的 .learnMore 容器
    const learnMore = document.querySelector('.apphub_SectionFilter .learnMore');
    if (learnMore) {
      const btn = document.createElement('div');
      btn.className = 'frf_refresh_btn';
      btn.style.cssText = 'display: inline-block; margin-left: 10px;';
      btn.innerHTML = `
        <a class="btnv6_blue_hoverfade btn_small_thin">
          <span>FRF 刷新</span>
        </a>
      `;

      btn.addEventListener('click', () => {
        if (window.FRF && window.FRF.renderUI) {
          window.FRF.renderUI(true); // force refresh
        }
      });

      // 插入到"关于评测"按钮后面
      learnMore.parentNode.insertBefore(btn, learnMore.nextSibling);
      return;
    }

    // 备选：添加到筛选区域末尾
    const filterArea = document.querySelector('.apphub_SectionFilter');
    if (filterArea) {
      const btn = document.createElement('div');
      btn.className = 'frf_refresh_btn';
      btn.style.cssText = 'display: inline-block; float: right; margin-right: 10px;';
      btn.innerHTML = `
        <a class="btnv6_blue_hoverfade btn_small_thin">
          <span>FRF 刷新</span>
        </a>
      `;

      btn.addEventListener('click', () => {
        if (window.FRF && window.FRF.renderUI) {
          window.FRF.renderUI(true); // force refresh
        }
      });

      filterArea.appendChild(btn);
    }
  }

  /**
   * 安全截断HTML内容，避免破坏标签结构
   * @param {string} html - HTML内容
   * @param {number} maxLength - 最大纯文本长度
   * @returns {string} 截断后的HTML
   */
  safeHTMLTruncate(html, maxLength) {
    if (!html) return '';

    // maxLength 为 0 表示不截断，直接返回原内容
    if (maxLength === 0) return html;

    // 先统计纯文本长度（不含HTML标签）
    const textContent = html.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) {
      return html;
    }

    // 需要截断：逐字符遍历，跟踪标签状态
    let result = '';
    let textCount = 0;
    let inTag = false;
    let currentTag = '';
    const openTags = []; // 记录打开的标签

    for (let i = 0; i < html.length && textCount < maxLength; i++) {
      const char = html[i];

      if (char === '<') {
        inTag = true;
        currentTag = '<';
      } else if (char === '>') {
        inTag = false;
        currentTag += '>';
        result += currentTag;

        // 解析标签名
        const tagMatch = currentTag.match(/^<\/?([a-zA-Z]+)/);
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          if (currentTag.startsWith('</')) {
            // 闭合标签：从栈中移除
            const idx = openTags.lastIndexOf(tagName);
            if (idx !== -1) openTags.splice(idx, 1);
          } else if (!currentTag.endsWith('/>') && !['br', 'hr', 'img'].includes(tagName)) {
            // 开始标签（非自闭合）：加入栈
            openTags.push(tagName);
          }
        }
        currentTag = '';
        continue;
      } else if (inTag) {
        currentTag += char;
      } else {
        // 普通文本字符
        result += char;
        textCount++;
      }
    }

    // 添加省略号
    result += '...';

    // 闭合所有未闭合的标签（逆序）
    for (let i = openTags.length - 1; i >= 0; i--) {
      result += `</${openTags[i]}>`;
    }

    return result;
  }

  /**
   * 处理评测内容中的截图链接，替换为实际图片
   * @param {string} content - 原始评测内容HTML
   * @returns {Promise<string>} 处理后的HTML
   */
  async processScreenshots(content) {
    if (!content) return content;

    // 匹配完整的 <a> 标签包裹的 Steam 截图链接
    // 原始格式: <a class="bb_link" href="https://steamcommunity.com/sharedfiles/filedetails/?id=xxx" target="_blank" ...>https://steamcommunity.com/sharedfiles/filedetails/?id=xxx</a>
    const screenshotLinkRegex = /<a[^>]*href="(https:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=(\d+))"[^>]*>.*?<\/a>/g;
    const matches = [...content.matchAll(screenshotLinkRegex)];

    if (matches.length === 0) return content;

    this.logger.info(`发现 ${matches.length} 个截图链接，正在获取图片...`);

    // 并行获取所有截图的图片URL
    const imageUrls = await Promise.all(
      matches.map(match => this.fetchScreenshotImage(match[2])) // match[2] 是文件ID
    );

    // 替换链接为图片
    let processedContent = content;
    matches.forEach((match, index) => {
      const imageUrl = imageUrls[index];
      const originalUrl = match[1]; // 原始链接URL
      const fullMatch = match[0];   // 完整的 <a> 标签
      if (imageUrl) {
        // 替换整个 <a> 标签为图片容器
        const imgHtml = `<div class="frf_screenshot_container"><a href="${originalUrl}" target="_blank"><img src="${imageUrl}" class="frf_screenshot_img" alt="Steam 截图"></a></div>`;
        processedContent = processedContent.replace(fullMatch, imgHtml);
      }
      // 如果获取失败，保留原链接
    });

    return processedContent;
  }

  /**
   * 获取截图页面的图片URL
   * @param {string} fileId - 截图文件ID
   * @returns {Promise<string|null>} 图片URL或null
   */
  async fetchScreenshotImage(fileId) {
    const url = `https://steamcommunity.com/sharedfiles/filedetails/?id=${fileId}`;
    const retryDelay = 10000;    // 重试等待时间（10秒）
    const maxRetryDuration = 60000; // 最大重试时长（1分钟）
    const requestStartTime = Date.now();

    while (true) {
      try {
        const response = await fetch(url, {
          credentials: 'include',
          redirect: 'follow'
        });

        // 429 限流处理：无限重试，最多1分钟
        if (response.status === 429) {
          const totalElapsed = Date.now() - requestStartTime;
          if (totalElapsed < maxRetryDuration) {
            this.logger.info(`截图 ${fileId} 遇到 429 限流，等待 ${retryDelay/1000}s 后重试...`);
            await new Promise(r => setTimeout(r, retryDelay));
            continue;
          } else {
            this.logger.warn(`截图 ${fileId} 获取失败：超过最大重试时长`);
            return null;
          }
        }

        if (!response.ok) {
          this.logger.warn(`截图 ${fileId} 获取失败：HTTP ${response.status}`);
          return null;
        }

        const html = await response.text();

        // 从 og:image 提取图片URL
        const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
        if (ogImageMatch) {
          // 解码HTML实体
          let imageUrl = ogImageMatch[1].replace(/&amp;/g, '&');
          // 移除尺寸限制参数，保持原图比例，只设置合理的最大宽度
          imageUrl = imageUrl.replace(/imw=\d+/, 'imw=800').replace(/&imh=\d+/, '').replace(/&ima=[^&]+/, '').replace(/&impolicy=[^&]+/, '').replace(/&imcolor=[^&]+/, '').replace(/&letterbox=[^&]+/, '');
          this.logger.info(`截图 ${fileId} 图片URL获取成功`);
          return imageUrl;
        }

        // 备选：从 actualmediactn 提取
        const actualMediaMatch = html.match(/class="actualmediactn"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/);
        if (actualMediaMatch) {
          let imageUrl = actualMediaMatch[1].replace(/&amp;/g, '&');
          this.logger.info(`截图 ${fileId} 图片URL获取成功（备选方式）`);
          return imageUrl;
        }

        this.logger.warn(`截图 ${fileId} 未找到图片URL`);
        return null;

      } catch (error) {
        this.logger.error(`截图 ${fileId} 获取出错：${error.message}`);
        return null;
      }
    }
  }

  // ==================== 投票功能 ====================

  /**
   * 获取 sessionid（从 Cookie 中读取）
   * @returns {string|null}
   */
  getSessionId() {
    const match = document.cookie.match(/sessionid=([^;]+)/);
    return match ? match[1] : null;
  }

  /**
   * 投票：是/否
   * @param {string} recommendationId - 评测ID
   * @param {boolean} isPositive - true=是（有价值），false=否
   * @returns {Promise<Object>} API 响应
   */
  async voteRate(recommendationId, isPositive) {
    const sessionId = this.getSessionId();
    if (!sessionId) {
      this.logger.error('无法获取 sessionid，可能未登录');
      return { success: false, error: '未登录' };
    }

    try {
      const response = await fetch(`https://steamcommunity.com/userreviews/rate/${recommendationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `rateup=${isPositive}&sessionid=${sessionId}`,
        credentials: 'include'
      });

      const result = await response.json();
      this.logger.info(`投票${isPositive ? '是' : '否'}成功:`, result);
      return { success: true, data: result };
    } catch (error) {
      this.logger.error('投票失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 投票：欢乐
   * @param {string} recommendationId - 评测ID
   * @param {boolean} vote - true=投票，false=取消
   * @returns {Promise<Object>} API 响应
   */
  async voteFunny(recommendationId, vote = true) {
    const sessionId = this.getSessionId();
    if (!sessionId) {
      this.logger.error('无法获取 sessionid，可能未登录');
      return { success: false, error: '未登录' };
    }

    try {
      const response = await fetch(`https://steamcommunity.com/userreviews/votetag/${recommendationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `tagid=1&rateup=${vote}&sessionid=${sessionId}`,
        credentials: 'include'
      });

      const result = await response.json();
      this.logger.info(`投票欢乐${vote ? '' : '取消'}成功:`, result);
      return { success: true, data: result };
    } catch (error) {
      this.logger.error('投票欢乐失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 处理投票按钮点击
   * @param {Event} event - 点击事件
   */
  async handleVoteClick(event) {
    const btn = event.target.closest('.frf_vote_btn');
    if (!btn) return;

    // 阻止事件冒泡到卡片
    event.stopPropagation();

    const action = btn.dataset.action;
    const value = btn.dataset.value === 'true';
    const recommendationId = btn.dataset.id;

    if (!recommendationId) {
      this.logger.error('缺少 recommendationId');
      return;
    }

    // 添加 loading 状态
    btn.classList.add('loading');

    let result;
    if (action === 'rate') {
      result = await this.voteRate(recommendationId, value);
    } else if (action === 'funny') {
      result = await this.voteFunny(recommendationId, value);
    }

    // 移除 loading 状态
    btn.classList.remove('loading');

    if (result && result.success) {
      // 获取同一卡片内的所有投票按钮
      const voteButtons = btn.closest('.frf_vote_buttons');
      const yesBtn = voteButtons.querySelector('.frf_vote_yes');
      const noBtn = voteButtons.querySelector('.frf_vote_no');
      const funnyBtn = voteButtons.querySelector('.frf_vote_funny');

      // 三者互斥：点击任何一个，取消其他两个
      yesBtn.classList.remove('voted');
      noBtn.classList.remove('voted');
      funnyBtn.classList.remove('voted');

      // 激活当前点击的按钮
      btn.classList.add('voted');
    }
  }

  /**
   * 注入自定义样式
   */
  injectStyles() {
    if (document.querySelector('#frf_styles')) return;

    const style = document.createElement('style');
    style.id = 'frf_styles';
    style.textContent = `
      /* FRF 欢迎横幅 */
      .frf_welcome_banner {
        background: linear-gradient(135deg, rgba(103, 193, 245, 0.15) 0%, rgba(78, 180, 241, 0.1) 100%);
        border: 1px solid rgba(103, 193, 245, 0.3);
        border-radius: 4px;
        margin: 10px 0 15px 0;
        padding: 12px 16px;
      }

      .frf_banner_content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .frf_banner_icon {
        font-size: 24px;
        flex-shrink: 0;
      }

      .frf_banner_text {
        flex: 1;
      }

      .frf_banner_title {
        font-size: 14px;
        font-weight: bold;
        color: #67c1f5;
        margin-bottom: 4px;
      }

      .frf_banner_desc {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .frf_banner_item {
        font-size: 12px;
        color: #acb2b8;
      }

      .frf_banner_item strong {
        color: #67c1f5;
      }

      .frf_banner_close {
        background: transparent;
        border: none;
        color: #8f98a0;
        font-size: 16px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 2px;
        transition: all 0.2s;
      }

      .frf_banner_close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      /* FRF 更新提示 */
      .frf_update_notice {
        background: linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 193, 7, 0.15) 100%);
        border: 1px solid rgba(255, 152, 0, 0.4);
        border-radius: 4px;
        margin: 10px 0 15px 0;
        padding: 10px 16px;
      }

      .frf_update_content {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .frf_update_icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .frf_update_text {
        flex: 1;
        font-size: 13px;
        color: #ffc107;
      }

      .frf_update_btn {
        background: #ff9800;
        border: none;
        color: #fff;
        font-size: 12px;
        padding: 6px 14px;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .frf_update_btn:hover {
        background: #f57c00;
      }

      .frf_update_close {
        background: transparent;
        border: none;
        color: #8f98a0;
        font-size: 14px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 2px;
        transition: all 0.2s;
      }

      .frf_update_close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      /* FRF 加载状态 */
      .frf_loading {
        padding: 40px;
        text-align: center;
        color: #8f98a0;
      }

      .frf_loading_content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .frf_loading_text {
        font-size: 14px;
      }

      /* FRF 空状态 */
      .frf_empty {
        padding: 40px;
        text-align: center;
        color: #8f98a0;
      }

      /* FRF 错误状态 */
      .frf_error {
        padding: 40px;
        text-align: center;
        color: #c75050;
      }

      .frf_retry_btn {
        margin-top: 10px;
        padding: 8px 16px;
        background: #67c1f5;
        border: none;
        border-radius: 2px;
        color: #fff;
        cursor: pointer;
      }

      .frf_retry_btn:hover {
        background: #4eb4f1;
      }

      /* FRF 刷新按钮 */
      .frf_refresh_btn {
        display: inline-block;
        cursor: pointer;
      }

      /* ========== FRF 卡片样式 - 完全自定义 ========== */

      /* 容器 */
      .frf_container {
        clear: both;
        max-width: 940px;
        margin: 0 auto;
      }

      /* 单个卡片 */
      .frf_card {
        background: rgba(0, 0, 0, 0.3);
        margin-bottom: 26px;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .frf_card:hover {
        background: rgba(0, 0, 0, 0.25);
      }

      /* 卡片内部容器 */
      .frf_card_inner {
        padding: 0;
      }

      /* 有价值人数行 */
      .frf_helpful_row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 14px;
        font-size: 12px;
        color: #8f98a0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .frf_helpful_text {
        color: #8f98a0;
      }

      .frf_award {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #67c1f5;
      }

      .frf_award_icon {
        width: 16px;
        height: 16px;
      }

      /* 奖励图标容器 */
      .frf_awards_container {
        display: flex;
        align-items: center;
        gap: 2px;
        flex-wrap: wrap;
      }

      .frf_award_item {
        display: flex;
        align-items: center;
        position: relative;
        cursor: default;
      }

      .frf_award_item img {
        width: 20px;
        height: 20px;
        object-fit: contain;
      }

      .frf_award_count {
        font-size: 10px;
        color: #acb2b8;
        margin-left: 1px;
        font-weight: bold;
      }

      /* 推荐区域 */
      .frf_recommend_row {
        display: flex;
        align-items: center;
        padding: 12px 14px;
        gap: 12px;
      }

      .frf_thumb_icon {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
      }

      .frf_recommend_info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .frf_recommend_title {
        font-size: 17px;
        font-weight: normal;
        color: #c6d4df;
      }

      .frf_recommend_hours {
        font-size: 13px;
        color: #8f98a0;
      }

      /* 发布日期 */
      .frf_date_row {
        padding: 0 14px 8px 14px;
        font-size: 12px;
        color: #8f98a0;
      }

      /* 评测内容 */
      .frf_content_row {
        padding: 0 14px 14px 14px;
        font-size: 13px;
        line-height: 1.6;
        color: #acb2b8;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      /* 截图容器 - 自适应图片尺寸 */
      .frf_screenshot_container {
        margin: 12px 0;
        border-radius: 4px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.2);
        display: inline-block;
        max-width: 100%;
      }

      .frf_screenshot_container a {
        display: block;
      }

      .frf_screenshot_img {
        max-width: 100%;
        height: auto;
        display: block;
        transition: opacity 0.2s;
      }

      .frf_screenshot_img:hover {
        opacity: 0.9;
      }

      /* 投票按钮 */
      .frf_vote_buttons {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-right: 12px;
      }

      .frf_vote_btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        border: none;
        border-radius: 4px;
        background: transparent;
        color: #8f98a0;
        cursor: pointer;
        transition: all 0.2s;
      }

      .frf_vote_btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #c6d4df;
      }

      .frf_vote_btn:active {
        transform: scale(0.9);
      }

      .frf_vote_btn.loading {
        opacity: 0.5;
        pointer-events: none;
      }

      .frf_vote_btn svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      .frf_vote_yes:hover {
        color: #4caf50;
      }

      .frf_vote_yes.voted {
        color: #4caf50;
      }

      .frf_vote_no:hover {
        color: #f44336;
      }

      .frf_vote_no.voted {
        color: #f44336;
      }

      .frf_vote_funny:hover {
        color: #ffc107;
      }

      .frf_vote_funny.voted {
        color: #ffc107;
      }

      /* 底部用户信息栏 */
      .frf_author_row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        background: rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }

      .frf_author_left {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      .frf_author_right {
        display: flex;
        align-items: center;
      }

      .frf_avatar_link {
        display: block;
        width: 32px;
        height: 32px;
        flex-shrink: 0;
        text-align: left;
      }

      /* 头像容器（用于头像框场景） */
      .frf_avatar_container {
        position: relative;
        width: 32px;
        height: 32px;
        display: block;
      }

      .frf_avatar_img {
        width: 32px;
        height: 32px;
        display: block;
        margin: 0;
        object-fit: cover;
      }

      /* 头像框：绝对定位覆盖在头像上方，按官方比例放大约1.21倍 */
      .frf_avatar_frame {
        position: absolute;
        top: -4px;
        left: -4px;
        width: 40px;
        height: 40px;
        pointer-events: none;
        z-index: 1;
      }

      .frf_author_info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .frf_author_name {
        font-size: 13px;
        color: #c6d4df;
        text-decoration: none;
      }

      .frf_author_name:hover {
        color: #67c1f5;
      }

      .frf_author_tag {
        font-size: 11px;
        color: #8f98a0;
      }

      .frf_comment_area {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #8f98a0;
        font-size: 13px;
      }

      .frf_comment_icon {
        width: 16px;
        height: 16px;
        opacity: 0.7;
        flex-shrink: 0;
      }

      .frf_comment_count {
        font-size: 13px;
      }
    `;

    document.head.appendChild(style);
  }
}

// 暴露到全局
if (typeof window !== 'undefined') {
  window.FRF_UIRenderer = UIRenderer;
}


// ==================== src/ui/PageDetector.js ====================

/**
 * 页面检测器
 * 自动检测Steam好友评测页面状态，判断是否需要FRF介入
 */

class PageDetector {
  constructor() {
    this.logger = new Logger('PageDetector');
    this.appId = null;
    this.isTriggered = false;
  }

  /**
   * 检测当前页面是否是好友评测页面
   * @returns {boolean}
   */
  isFriendReviewPage() {
    const url = window.location.href;

    // 检查URL是否包含好友评测筛选
    // https://steamcommunity.com/app/413150/reviews/?browsefilter=createdbyfriends
    const isCommunityApp = url.includes('steamcommunity.com/app/');
    const isFriendFilter = url.includes('browsefilter=createdbyfriends') ||
                          url.includes('browsefilter=myfriends');

    // 也检查页面上的筛选器状态
    const filterSelect = document.querySelector('#filterselect_activeday');
    const isFilterActive = filterSelect &&
      (filterSelect.textContent.includes('来自好友') ||
       filterSelect.textContent.includes('From Friends'));

    return isCommunityApp && (isFriendFilter || isFilterActive);
  }

  /**
   * 获取当前页面的App ID
   * @returns {string|null}
   */
  getAppId() {
    if (this.appId) return this.appId;

    // 方法1：从URL提取
    const urlMatch = window.location.href.match(/\/app\/(\d+)/);
    if (urlMatch) {
      this.appId = urlMatch[1];
      return this.appId;
    }

    // 方法2：从页面全局变量提取
    if (typeof g_AppID !== 'undefined') {
      this.appId = String(g_AppID);
      return this.appId;
    }

    // 方法3：从商店链接提取
    const storeLink = document.querySelector('a[href*="store.steampowered.com/app/"]');
    if (storeLink) {
      const match = storeLink.href.match(/\/app\/(\d+)/);
      if (match) {
        this.appId = match[1];
        return this.appId;
      }
    }

    this.logger.warn('无法获取App ID');
    return null;
  }

  /**
   * 检测Steam原生渲染是否成功
   * @returns {Promise<boolean>}
   */
  async checkSteamRenderSuccess() {
    // 等待一段时间让Steam有机会渲染
    await this.wait(2000);

    // 检查多个可能的容器
    const container = document.querySelector('#AppHubCards');
    const initialContent = document.querySelector('#apphub_InitialContent');

    // 情况1：#AppHubCards 存在且有卡片
    if (container) {
      const cards = container.querySelectorAll('.apphub_Card');
      if (cards.length > 0) {
        this.logger.info(`Steam 原生渲染成功，找到 ${cards.length} 条评测`);
        return true;
      }
    }

    // 检查是否有"无更多内容"的提示（说明确实没有好友评测）
    const noContent = document.querySelector('#NoMoreContent');
    if (noContent && noContent.style.display !== 'none') {
      this.logger.info('Steam 显示无更多内容');
      return true; // 这种情况不需要FRF介入
    }

    // 检查是否有加载中状态
    const loading = document.querySelector('#action_wait');
    if (loading && loading.style.display !== 'none') {
      // 再等待一会
      await this.wait(3000);
      if (container) {
        const cardsAfterWait = container.querySelectorAll('.apphub_Card');
        if (cardsAfterWait.length > 0) {
          this.logger.info(`延迟后Steam渲染成功，找到 ${cardsAfterWait.length} 条评测`);
          return true;
        }
      }
    }

    // 情况2：#AppHubCards 不存在（Steam bug 页面）
    // 这种情况下 Steam 的 JS 根本没有创建容器，肯定是 bug
    if (!container) {
      this.logger.warn('未找到 #AppHubCards 容器（Steam Bug）');
      return false;
    }

    // 情况3：检查隐藏的初始内容区域
    if (initialContent) {
      const hiddenCards = initialContent.querySelectorAll('.apphub_Card');
      // 如果有隐藏的卡片但没有显示出来，说明渲染失败
      if (hiddenCards.length > 0) {
        this.logger.warn(`发现 ${hiddenCards.length} 个隐藏卡片，但未被正确渲染（Steam Bug）`);
        return false;
      }
    }

    this.logger.warn('Steam 渲染可能失败，容器为空');
    return false;
  }

  /**
   * 检测并自动触发FRF
   * @param {Function} onNeedFix - 需要FRF修复时的回调
   * @param {Function} onPageReady - 页面准备好时的回调（用于显示欢迎横幅和按钮）
   */
  async detectAndTrigger(onNeedFix, onPageReady) {
    if (this.isTriggered) {
      this.logger.debug('已经触发过，跳过');
      return;
    }

    // 检查是否是好友评测页面
    if (!this.isFriendReviewPage()) {
      this.logger.debug('非好友评测页面，跳过');
      return;
    }

    const appId = this.getAppId();
    if (!appId) {
      this.logger.error('无法获取App ID，跳过');
      return;
    }

    this.logger.info(`检测到好友评测页面，App ID: ${appId}`);

    // 立即显示欢迎横幅和FRF按钮（不等待检测结果）
    if (onPageReady && typeof onPageReady === 'function') {
      onPageReady(appId);
    }

    // 后台检查Steam原生渲染是否成功
    const steamSuccess = await this.checkSteamRenderSuccess();

    if (steamSuccess) {
      this.logger.info('Steam 原生渲染成功，FRF 待命');
      // Steam正常工作，横幅和按钮保留，用户可手动使用FRF
      return;
    }

    // Steam渲染失败，自动触发FRF修复
    this.logger.info('Steam 渲染失败，FRF 自动介入');
    this.isTriggered = true;

    if (onNeedFix && typeof onNeedFix === 'function') {
      onNeedFix(appId);
    }
  }

  /**
   * 隐藏欢迎横幅
   */
  hideWelcomeBanner() {
    const banner = document.querySelector('.frf_welcome_banner');
    if (banner) {
      banner.remove();
    }
  }

  /**
   * 监听页面变化（用于SPA导航）
   * @param {Function} callback - 页面变化时的回调函数
   */
  watchPageChanges(callback) {
    // 监听URL变化
    let lastUrl = window.location.href;

    const checkUrlChange = () => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        this.isTriggered = false; // 重置触发状态
        this.appId = null; // 重置App ID

        // 延迟检测，等待页面加载
        setTimeout(() => {
          this.detectAndTrigger(callback);
        }, 1000);
      }
    };

    // 定期检查URL变化
    setInterval(checkUrlChange, 1000);

    // 监听popstate事件
    window.addEventListener('popstate', () => {
      this.isTriggered = false;
      this.appId = null;
      setTimeout(() => {
        this.detectAndTrigger(callback);
      }, 1000);
    });
  }

  /**
   * 辅助函数：等待指定毫秒
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 重置状态（用于手动触发）
   */
  reset() {
    this.isTriggered = false;
  }
}

// 暴露到全局
if (typeof window !== 'undefined') {
  window.FRF_PageDetector = PageDetector;
}


// ==================== src/ui/SettingsPanel.js ====================

/**
 * 设置面板 UI 组件 - v5.1
 * 提供用户可视化配置界面
 *
 * 分为两个标签页：
 * - 常规设置：普通用户常用功能
 * - 高级设置：开发者/高级用户选项
 */

class SettingsPanel {
  constructor() {
    this.logger = new Logger('SettingsPanel');
    this.isOpen = false;
    this.panelElement = null;
    this.overlayElement = null;
    this.currentTab = 'general'; // 'general' | 'advanced'
  }

  /**
   * 初始化设置面板
   */
  init() {
    this.injectStyles();
    this.createPanel();
    this.createSettingsButton();
  }

  /**
   * 创建设置按钮（添加到 FRF 刷新按钮旁边）
   */
  createSettingsButton() {
    // 检查是否已存在
    if (document.querySelector('.frf_settings_btn')) return;

    const btn = document.createElement('div');
    btn.className = 'frf_settings_btn';
    btn.innerHTML = `
      <a class="btnv6_blue_hoverfade btn_small_thin">
        <span>FRF 设置</span>
      </a>
    `;

    btn.addEventListener('click', () => {
      this.toggle();
    });

    // 找到 FRF 刷新按钮，插入到后面
    const refreshBtn = document.querySelector('.frf_refresh_btn');
    if (refreshBtn && refreshBtn.parentNode) {
      refreshBtn.parentNode.insertBefore(btn, refreshBtn.nextSibling);
      return;
    }

    // 备选：找到筛选区域
    const filterArea = document.querySelector('.apphub_SectionFilter');
    if (filterArea) {
      filterArea.appendChild(btn);
    }
  }

  /**
   * 创建设置面板 DOM
   */
  createPanel() {
    // 遮罩层
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'frf_settings_overlay';
    this.overlayElement.addEventListener('click', () => this.close());

    // 面板
    this.panelElement = document.createElement('div');
    this.panelElement.className = 'frf_settings_panel';
    this.panelElement.innerHTML = this.buildPanelHTML();

    // 添加到页面
    document.body.appendChild(this.overlayElement);
    document.body.appendChild(this.panelElement);

    // 设置版本号（确保在运行时正确读取）
    const versionSpan = this.panelElement.querySelector('#frf_version');
    if (versionSpan) {
      versionSpan.textContent = Constants.VERSION;
    }

    // 绑定事件
    this.bindEvents();
  }

  /**
   * 构建面板 HTML - 带标签页
   */
  buildPanelHTML() {
    return `
      <div class="frf_settings_header">
        <h2>FRF 设置</h2>
        <button class="frf_settings_close" title="关闭">✕</button>
      </div>

      <!-- 标签页导航 -->
      <div class="frf_tabs">
        <button class="frf_tab frf_tab_active" data-tab="general">常规设置</button>
        <button class="frf_tab" data-tab="advanced">高级设置</button>
      </div>

      <div class="frf_settings_content">
        <!-- ========== 常规设置 ========== -->
        <div class="frf_tab_content frf_tab_content_active" data-tab="general">
          <!-- 显示设置 -->
          <div class="frf_settings_section">
            <h3>显示设置</h3>
            <p class="frf_section_desc">显示设置保存后刷新页面即可生效。FRF 刷新按钮是对当前游戏的所有好友评测进行重新检测。</p>
            <div class="frf_settings_row frf_settings_row_vertical">
              <div class="frf_row_header">
                <label for="frf_render_batch">每次渲染评测数</label>
                <input type="number" id="frf_render_batch" min="1" max="20" value="3">
              </div>
              <span class="frf_input_desc">找到多少篇好友评测后开始显示，推荐值为 3</span>
            </div>
            <div class="frf_settings_row frf_settings_row_vertical">
              <div class="frf_row_header">
                <label for="frf_content_truncate">评测内容截断长度</label>
                <input type="number" id="frf_content_truncate" min="0" max="8000" value="300">
              </div>
              <span class="frf_input_desc">评测内容显示的最大字符数，设为 0 表示不截断（显示全部内容），推荐值为 300</span>
            </div>
          </div>

          <!-- 缓存管理 -->
          <div class="frf_settings_section">
            <h3>缓存管理</h3>
            <p class="frf_section_desc">FRF 会缓存好友的评测数据，避免每次访问游戏页面都重新搜索。缓存自动构建。</p>
            <div class="frf_settings_row frf_settings_row_vertical">
              <div class="frf_row_header">
                <label for="frf_cache_days">缓存有效期（天）</label>
                <input type="number" id="frf_cache_days" min="0" max="7" value="3">
              </div>
              <span class="frf_input_desc">可填 0-7，填 0 表示不缓存即每次都重新搜索，推荐值为 3</span>
            </div>
            <div class="frf_settings_info" id="frf_cache_info">
              <div class="frf_info_loading">正在加载缓存信息...</div>
            </div>
            <div class="frf_settings_actions">
              <button class="frf_btn frf_btn_danger" id="frf_clear_cache">清除缓存</button>
              <button class="frf_btn frf_btn_secondary" id="frf_export_cache">导出缓存</button>
              <button class="frf_btn frf_btn_secondary" id="frf_import_cache">导入缓存</button>
              <input type="file" id="frf_import_file" accept=".json" style="display: none;">
            </div>
          </div>

          <!-- 关于 -->
          <div class="frf_settings_section">
            <h3>关于</h3>
            <div class="frf_about_info">
              <p><strong>FRF - Friend Review Finder</strong></p>
              <p>版本：<span id="frf_version">-</span></p>
              <p>
                <a href="https://github.com/JohnS3248/FRF" target="_blank">GitHub</a> ·
                <a href="https://github.com/JohnS3248/FRF/issues" target="_blank">反馈问题</a>
              </p>
            </div>
          </div>
        </div>

        <!-- ========== 高级设置 ========== -->
        <div class="frf_tab_content" data-tab="advanced">
          <div class="frf_advanced_warning">
            <span class="frf_warning_icon">⚠️</span>
            <span>以下为高级选项，如不了解请勿修改</span>
          </div>

          <!-- 快速模式配置 -->
          <div class="frf_settings_section">
            <h3>快速模式配置</h3>
            <div class="frf_settings_row frf_settings_row_vertical">
              <div class="frf_row_header">
                <label for="frf_batch_size">批次大小</label>
                <input type="number" id="frf_batch_size" min="1" max="50" value="30">
              </div>
              <span class="frf_input_desc">每次并发请求的好友数量，推荐值为 30</span>
            </div>
            <div class="frf_settings_row frf_settings_row_vertical">
              <div class="frf_row_header">
                <label for="frf_delay">批次延迟</label>
                <input type="number" id="frf_delay" min="0" max="5000" value="0">
              </div>
              <span class="frf_input_desc">每批请求之间的等待时间（毫秒），推荐值为 50</span>
            </div>
          </div>

          <!-- 调试选项 -->
          <div class="frf_settings_section">
            <h3>调试选项</h3>
            <div class="frf_settings_row frf_settings_row_vertical">
              <div class="frf_row_header">
                <label for="frf_debug_mode">调试模式</label>
                <label class="frf_toggle">
                  <input type="checkbox" id="frf_debug_mode">
                  <span class="frf_toggle_slider"></span>
                </label>
              </div>
              <span class="frf_input_desc">在浏览器控制台显示详细的运行日志</span>
            </div>
            <div class="frf_settings_row frf_settings_row_vertical">
              <div class="frf_row_header">
                <label for="frf_quick_debug">快速模式调试</label>
                <label class="frf_toggle">
                  <input type="checkbox" id="frf_quick_debug">
                  <span class="frf_toggle_slider"></span>
                </label>
              </div>
              <span class="frf_input_desc">显示每个请求的响应时间，用于性能调优</span>
            </div>
          </div>
        </div>
      </div>

      <div class="frf_settings_footer">
        <button class="frf_btn frf_btn_primary" id="frf_save_settings">保存设置</button>
        <button class="frf_btn frf_btn_secondary" id="frf_reset_settings">恢复默认</button>
      </div>
    `;
  }

  /**
   * 绑定事件处理
   */
  bindEvents() {
    // 关闭按钮
    this.panelElement.querySelector('.frf_settings_close').addEventListener('click', () => {
      this.close();
    });

    // 标签页切换
    this.panelElement.querySelectorAll('.frf_tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // 清除缓存
    this.panelElement.querySelector('#frf_clear_cache').addEventListener('click', () => {
      this.clearCache();
    });

    // 导出缓存
    this.panelElement.querySelector('#frf_export_cache').addEventListener('click', () => {
      this.exportCache();
    });

    // 导入缓存
    this.panelElement.querySelector('#frf_import_cache').addEventListener('click', () => {
      this.panelElement.querySelector('#frf_import_file').click();
    });

    this.panelElement.querySelector('#frf_import_file').addEventListener('change', (e) => {
      this.importCache(e.target.files[0]);
      e.target.value = ''; // 重置，允许重复选择同一文件
    });

    // 保存设置
    this.panelElement.querySelector('#frf_save_settings').addEventListener('click', () => {
      this.saveSettings();
    });

    // 恢复默认
    this.panelElement.querySelector('#frf_reset_settings').addEventListener('click', () => {
      this.resetSettings();
    });

    // ESC 关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * 切换标签页
   */
  switchTab(tabName) {
    this.currentTab = tabName;

    // 更新标签按钮状态
    this.panelElement.querySelectorAll('.frf_tab').forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add('frf_tab_active');
      } else {
        tab.classList.remove('frf_tab_active');
      }
    });

    // 更新内容区域
    this.panelElement.querySelectorAll('.frf_tab_content').forEach(content => {
      if (content.dataset.tab === tabName) {
        content.classList.add('frf_tab_content_active');
      } else {
        content.classList.remove('frf_tab_content_active');
      }
    });
  }

  /**
   * 加载缓存统计信息
   */
  loadCacheStats() {
    const infoContainer = this.panelElement.querySelector('#frf_cache_info');

    try {
      const cache = new ReviewCache();
      const hasCache = cache.loadFromCache();

      if (hasCache) {
        const stats = cache.getCacheStats();
        infoContainer.innerHTML = `
          <div class="frf_stats_grid">
            <div class="frf_stat_item">
              <span class="frf_stat_value">${stats.friendsWithReviews}</span>
              <span class="frf_stat_label">有评测的好友</span>
            </div>
            <div class="frf_stat_item">
              <span class="frf_stat_value">${stats.totalReviews}</span>
              <span class="frf_stat_label">缓存的游戏数</span>
            </div>
            <div class="frf_stat_item">
              <span class="frf_stat_value">${stats.cacheAge || '-'}</span>
              <span class="frf_stat_label">距上次更新 (小时)</span>
            </div>
          </div>
        `;
      } else {
        infoContainer.innerHTML = `
          <div class="frf_no_cache">
            <p>暂无缓存数据</p>
            <p class="frf_hint">首次使用 FRF 刷新后会自动创建缓存</p>
          </div>
        `;
      }
    } catch (error) {
      infoContainer.innerHTML = `
        <div class="frf_error_msg">加载缓存信息失败: ${error.message}</div>
      `;
    }
  }

  /**
   * 加载当前设置到表单
   */
  loadSettings() {
    const settings = this.loadFromStorage() || {};

    // 常规设置
    this.panelElement.querySelector('#frf_render_batch').value = settings.renderBatch || 3;
    this.panelElement.querySelector('#frf_content_truncate').value = typeof settings.contentTruncate === 'number' ? settings.contentTruncate : 300;
    this.panelElement.querySelector('#frf_cache_days').value = typeof settings.cacheDays === 'number' ? settings.cacheDays : 3;

    // 高级设置
    if (window.FRF && window.FRF._quickConfig) {
      const config = window.FRF._quickConfig;
      this.panelElement.querySelector('#frf_batch_size').value = settings.batchSize || config.batchSize || 30;
      this.panelElement.querySelector('#frf_delay').value = settings.delay || config.delay || 0;
      this.panelElement.querySelector('#frf_quick_debug').checked = settings.quickDebug || config.debug || false;
    } else {
      this.panelElement.querySelector('#frf_batch_size').value = settings.batchSize || 30;
      this.panelElement.querySelector('#frf_delay').value = settings.delay || 0;
      this.panelElement.querySelector('#frf_quick_debug').checked = settings.quickDebug || false;
    }

    // 调试模式
    this.panelElement.querySelector('#frf_debug_mode').checked = settings.debugMode || Constants.DEBUG_MODE || false;

    // 加载缓存统计
    this.loadCacheStats();

    // 重置到常规标签页
    this.switchTab('general');
  }

  /**
   * 保存设置
   */
  saveSettings() {
    // 常规设置
    const renderBatch = parseInt(this.panelElement.querySelector('#frf_render_batch').value, 10);
    const contentTruncate = parseInt(this.panelElement.querySelector('#frf_content_truncate').value, 10);
    const cacheDays = parseInt(this.panelElement.querySelector('#frf_cache_days').value, 10);

    // 高级设置
    const batchSize = parseInt(this.panelElement.querySelector('#frf_batch_size').value, 10);
    const delay = parseInt(this.panelElement.querySelector('#frf_delay').value, 10);
    const debugMode = this.panelElement.querySelector('#frf_debug_mode').checked;
    const quickDebug = this.panelElement.querySelector('#frf_quick_debug').checked;

    // 验证常规设置
    if (renderBatch < 1 || renderBatch > 20) {
      this.showToast('每次渲染数必须在 1-20 之间', 'error');
      return;
    }

    if (contentTruncate < 0 || contentTruncate > 8000) {
      this.showToast('截断长度必须在 0-8000 之间', 'error');
      return;
    }

    if (cacheDays < 0 || cacheDays > 7) {
      this.showToast('缓存有效期必须在 0-7 之间', 'error');
      return;
    }

    // 验证高级设置
    if (batchSize < 1 || batchSize > 50) {
      this.showToast('批次大小必须在 1-50 之间', 'error');
      return;
    }

    if (delay < 0 || delay > 5000) {
      this.showToast('批次延迟必须在 0-5000 之间', 'error');
      return;
    }

    // 应用设置到 FRF
    if (window.FRF) {
      // 高级设置
      window.FRF.setQuickConfig({
        batchSize,
        delay,
        debug: quickDebug
      });
      window.FRF.setDebug(debugMode);

      // 常规设置（存储到 FRF 对象）
      window.FRF._uiConfig = {
        renderBatch,
        contentTruncate,
        cacheDays
      };

      // 更新缓存有效期配置
      window.FRF._cacheDays = cacheDays;
    }

    // 保存到 localStorage
    this.saveToStorage({
      // 常规
      renderBatch,
      contentTruncate,
      cacheDays,
      // 高级
      batchSize,
      delay,
      debugMode,
      quickDebug
    });

    this.showToast('设置已保存', 'success');
    this.logger.info('设置已保存', { renderBatch, contentTruncate, cacheDays, batchSize, delay, debugMode, quickDebug });
  }

  /**
   * 恢复默认设置
   */
  resetSettings() {
    // 常规设置默认值
    this.panelElement.querySelector('#frf_render_batch').value = 3;
    this.panelElement.querySelector('#frf_content_truncate').value = 300;
    this.panelElement.querySelector('#frf_cache_days').value = 3;

    // 高级设置默认值
    this.panelElement.querySelector('#frf_batch_size').value = 30;
    this.panelElement.querySelector('#frf_delay').value = 50;
    this.panelElement.querySelector('#frf_debug_mode').checked = false;
    this.panelElement.querySelector('#frf_quick_debug').checked = false;

    this.showToast('已恢复默认设置，点击保存生效', 'info');
  }

  /**
   * 清除缓存
   */
  clearCache() {
    if (confirm('确定要清除所有缓存数据吗？\n\n清除后下次访问游戏页面需要重新搜索。')) {
      try {
        const cache = new ReviewCache();
        cache.clearCache();
        this.loadCacheStats();
        this.showToast('缓存已清除', 'success');
      } catch (error) {
        this.showToast('清除缓存失败: ' + error.message, 'error');
      }
    }
  }

  /**
   * 导出缓存为 JSON 文件
   */
  exportCache() {
    try {
      const cacheKey = `${Constants.CACHE_KEY_PREFIX}review_dict_${Constants.CACHE_VERSION}`;
      const cached = localStorage.getItem(cacheKey);

      if (!cached) {
        this.showToast('没有可导出的缓存数据', 'error');
        return;
      }

      const cacheData = JSON.parse(cached);

      // 添加导出元信息
      const exportData = {
        exportTime: new Date().toISOString(),
        frfVersion: Constants.VERSION,
        cacheVersion: cacheData.version,
        cacheTimestamp: cacheData.timestamp,
        friendsCount: Object.keys(cacheData.data).length,
        totalReviews: Object.values(cacheData.data).reduce((sum, arr) => sum + arr.length, 0),
        data: cacheData.data
      };

      // 生成文件名
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `frf_cache_${date}.json`;

      // 创建下载
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showToast(`缓存已导出: ${filename}`, 'success');
      this.logger.info('缓存已导出', { filename, friendsCount: exportData.friendsCount });

    } catch (error) {
      this.showToast('导出缓存失败: ' + error.message, 'error');
      this.logger.error('导出缓存失败', error);
    }
  }

  /**
   * 从 JSON 文件导入缓存
   * @param {File} file - 要导入的 JSON 文件
   */
  importCache(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);

        // 验证导入数据格式
        if (!importData.data || typeof importData.data !== 'object') {
          this.showToast('无效的缓存文件格式', 'error');
          return;
        }

        // 验证数据结构：data 应该是 { steamId: [appId, ...] } 格式
        const steamIds = Object.keys(importData.data);
        if (steamIds.length === 0) {
          this.showToast('缓存文件中没有数据', 'error');
          return;
        }

        // 简单验证第一个条目的格式
        const firstEntry = importData.data[steamIds[0]];
        if (!Array.isArray(firstEntry)) {
          this.showToast('无效的缓存数据结构', 'error');
          return;
        }

        // 询问用户导入模式
        const hasExistingCache = localStorage.getItem(`${Constants.CACHE_KEY_PREFIX}review_dict_${Constants.CACHE_VERSION}`);
        let importMode = 'replace'; // 默认替换

        if (hasExistingCache) {
          const choice = confirm(
            `检测到已有缓存数据。\n\n` +
            `导入文件包含 ${steamIds.length} 个好友的数据。\n\n` +
            `点击"确定"：合并数据（保留现有 + 添加新数据）\n` +
            `点击"取消"：替换数据（清空现有，使用导入数据）`
          );
          importMode = choice ? 'merge' : 'replace';
        }

        // 执行导入
        const cacheKey = `${Constants.CACHE_KEY_PREFIX}review_dict_${Constants.CACHE_VERSION}`;

        if (importMode === 'merge') {
          // 合并模式：加载现有缓存，合并新数据
          const existingRaw = localStorage.getItem(cacheKey);
          let existingData = {};

          if (existingRaw) {
            const existing = JSON.parse(existingRaw);
            existingData = existing.data || {};
          }

          // 合并数据
          let addedFriends = 0;
          let addedReviews = 0;

          for (const [steamId, appIds] of Object.entries(importData.data)) {
            if (!existingData[steamId]) {
              existingData[steamId] = [];
              addedFriends++;
            }

            for (const appId of appIds) {
              if (!existingData[steamId].includes(appId)) {
                existingData[steamId].push(appId);
                addedReviews++;
              }
            }
          }

          // 保存合并后的数据
          const mergedCache = {
            version: Constants.CACHE_VERSION,
            timestamp: Date.now(),
            data: existingData
          };

          localStorage.setItem(cacheKey, JSON.stringify(mergedCache));

          this.showToast(`合并成功：+${addedFriends} 好友，+${addedReviews} 条记录`, 'success');
          this.logger.info('缓存合并导入完成', { addedFriends, addedReviews });

        } else {
          // 替换模式：直接使用导入数据
          const newCache = {
            version: Constants.CACHE_VERSION,
            timestamp: importData.cacheTimestamp || Date.now(),
            data: importData.data
          };

          localStorage.setItem(cacheKey, JSON.stringify(newCache));

          const totalReviews = Object.values(importData.data).reduce((sum, arr) => sum + arr.length, 0);
          this.showToast(`导入成功：${steamIds.length} 好友，${totalReviews} 条记录`, 'success');
          this.logger.info('缓存替换导入完成', { friendsCount: steamIds.length, totalReviews });
        }

        // 刷新统计显示
        this.loadCacheStats();

      } catch (error) {
        this.showToast('导入失败: ' + error.message, 'error');
        this.logger.error('导入缓存失败', error);
      }
    };

    reader.onerror = () => {
      this.showToast('读取文件失败', 'error');
    };

    reader.readAsText(file);
  }

  /**
   * 保存设置到 localStorage
   */
  saveToStorage(settings) {
    try {
      localStorage.setItem('frf_settings', JSON.stringify(settings));
    } catch (error) {
      this.logger.warn('保存设置失败', error);
    }
  }

  /**
   * 从 localStorage 加载设置
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('frf_settings');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      this.logger.warn('加载设置失败', error);
      return null;
    }
  }

  /**
   * 应用保存的设置（启动时调用）
   */
  applySavedSettings() {
    const settings = this.loadFromStorage();
    if (settings && window.FRF) {
      // 高级设置
      window.FRF.setQuickConfig({
        batchSize: settings.batchSize || 30,
        delay: settings.delay || 0,
        debug: settings.quickDebug || false
      });

      if (settings.debugMode) {
        Constants.DEBUG_MODE = true;
      }

      // 常规设置
      window.FRF._uiConfig = {
        renderBatch: settings.renderBatch || 3,
        contentTruncate: typeof settings.contentTruncate === 'number' ? settings.contentTruncate : 300,
        cacheDays: typeof settings.cacheDays === 'number' ? settings.cacheDays : 3
      };

      // 缓存有效期配置
      window.FRF._cacheDays = typeof settings.cacheDays === 'number' ? settings.cacheDays : 3;

      this.logger.info('已应用保存的设置', settings);
    }
  }

  /**
   * 显示 Toast 提示
   */
  showToast(message, type = 'info') {
    // 移除已有的 toast
    const existingToast = document.querySelector('.frf_toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `frf_toast frf_toast_${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // 动画显示
    setTimeout(() => toast.classList.add('frf_toast_show'), 10);

    // 3秒后隐藏
    setTimeout(() => {
      toast.classList.remove('frf_toast_show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * 打开设置面板
   */
  open() {
    this.loadSettings();
    this.overlayElement.classList.add('frf_show');
    this.panelElement.classList.add('frf_show');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  /**
   * 关闭设置面板
   */
  close() {
    this.overlayElement.classList.remove('frf_show');
    this.panelElement.classList.remove('frf_show');
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  /**
   * 切换设置面板
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * 注入样式
   */
  injectStyles() {
    if (document.querySelector('#frf_settings_styles')) return;

    const style = document.createElement('style');
    style.id = 'frf_settings_styles';
    style.textContent = `
      /* 设置按钮 */
      .frf_settings_btn {
        display: inline-block;
        margin-left: 10px;
        cursor: pointer;
      }

      /* 遮罩层 */
      .frf_settings_overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9998;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .frf_settings_overlay.frf_show {
        opacity: 1;
        visibility: visible;
      }

      /* 设置面板 */
      .frf_settings_panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        width: 520px;
        max-width: 90vw;
        max-height: 85vh;
        background: linear-gradient(180deg, #2a475e 0%, #1b2838 100%);
        border: 1px solid #4a6278;
        border-radius: 6px;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      }

      .frf_settings_panel.frf_show {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, -50%) scale(1);
      }

      /* 面板头部 */
      .frf_settings_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #4a6278;
        background: rgba(0, 0, 0, 0.2);
      }

      .frf_settings_header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: normal;
        color: #fff;
      }

      .frf_settings_close {
        background: transparent;
        border: none;
        color: #8f98a0;
        font-size: 20px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s;
      }

      .frf_settings_close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      /* 标签页导航 */
      .frf_tabs {
        display: flex;
        padding: 0 20px;
        background: rgba(0, 0, 0, 0.15);
        border-bottom: 1px solid #4a6278;
      }

      .frf_tab {
        padding: 12px 20px;
        background: transparent;
        border: none;
        color: #8f98a0;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
      }

      .frf_tab:hover {
        color: #c6d4df;
      }

      .frf_tab_active {
        color: #67c1f5;
      }

      .frf_tab_active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: #67c1f5;
      }

      /* 标签页内容 */
      .frf_tab_content {
        display: none;
      }

      .frf_tab_content_active {
        display: block;
      }

      /* 面板内容 */
      .frf_settings_content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      /* 高级设置警告 */
      .frf_advanced_warning {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: rgba(255, 152, 0, 0.15);
        border: 1px solid rgba(255, 152, 0, 0.3);
        border-radius: 4px;
        margin-bottom: 20px;
        font-size: 12px;
        color: #ffc107;
      }

      .frf_warning_icon {
        font-size: 16px;
      }

      /* 设置区块 */
      .frf_settings_section {
        margin-bottom: 24px;
      }

      .frf_settings_section:last-child {
        margin-bottom: 0;
      }

      .frf_settings_section h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: bold;
        color: #67c1f5;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .frf_section_desc {
        margin: 0 0 12px 0;
        font-size: 12px;
        color: #8f98a0;
        line-height: 1.5;
      }

      /* 设置行 */
      .frf_settings_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .frf_settings_row:last-child {
        border-bottom: none;
      }

      .frf_settings_row > label {
        color: #c6d4df;
        font-size: 13px;
      }

      /* 垂直布局设置行（新样式） */
      .frf_settings_row_vertical {
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
        padding: 12px 0;
      }

      .frf_row_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .frf_row_header > label {
        color: #c6d4df;
        font-size: 13px;
        font-weight: 500;
      }

      .frf_row_header input[type="number"] {
        width: 80px;
        padding: 6px 10px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #4a6278;
        border-radius: 3px;
        color: #fff;
        font-size: 13px;
        text-align: center;
      }

      .frf_row_header input[type="number"]:focus {
        outline: none;
        border-color: #67c1f5;
      }

      .frf_input_desc {
        font-size: 12px;
        color: #8f98a0;
        line-height: 1.4;
        padding-left: 2px;
      }

      /* 输入组（保留兼容） */
      .frf_input_group {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .frf_input_group input[type="number"] {
        width: 80px;
        padding: 6px 10px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #4a6278;
        border-radius: 3px;
        color: #fff;
        font-size: 13px;
        text-align: center;
      }

      .frf_input_group input[type="number"]:focus {
        outline: none;
        border-color: #67c1f5;
      }

      .frf_input_hint {
        font-size: 11px;
        color: #8f98a0;
      }

      /* 开关组 */
      .frf_toggle_group {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      /* 开关样式 */
      .frf_toggle {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
      }

      .frf_toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .frf_toggle_slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #4a6278;
        border-radius: 24px;
        transition: all 0.3s;
      }

      .frf_toggle_slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 2px;
        bottom: 2px;
        background: #8f98a0;
        border-radius: 50%;
        transition: all 0.3s;
      }

      .frf_toggle input:checked + .frf_toggle_slider {
        background: #5ba32b;
        border-color: #5ba32b;
      }

      .frf_toggle input:checked + .frf_toggle_slider:before {
        transform: translateX(20px);
        background: #fff;
      }

      /* 统计信息 */
      .frf_settings_info {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        padding: 16px;
        margin-bottom: 12px;
      }

      .frf_stats_grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        text-align: center;
      }

      .frf_stat_item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .frf_stat_value {
        font-size: 24px;
        font-weight: bold;
        color: #67c1f5;
      }

      .frf_stat_label {
        font-size: 11px;
        color: #8f98a0;
      }

      .frf_no_cache {
        text-align: center;
        color: #8f98a0;
      }

      .frf_no_cache .frf_hint {
        font-size: 12px;
        margin-top: 4px;
      }

      .frf_info_loading {
        text-align: center;
        color: #8f98a0;
      }

      .frf_error_msg {
        color: #c75050;
        text-align: center;
      }

      /* 操作按钮组 */
      .frf_settings_actions {
        display: flex;
        gap: 10px;
      }

      /* 按钮样式 */
      .frf_btn {
        padding: 8px 16px;
        border: none;
        border-radius: 3px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .frf_btn_primary {
        background: linear-gradient(90deg, #47bfff 0%, #1a9fff 100%);
        color: #fff;
      }

      .frf_btn_primary:hover {
        background: linear-gradient(90deg, #66ccff 0%, #47bfff 100%);
      }

      .frf_btn_secondary {
        background: rgba(103, 193, 245, 0.2);
        color: #67c1f5;
        border: 1px solid #67c1f5;
      }

      .frf_btn_secondary:hover {
        background: rgba(103, 193, 245, 0.3);
      }

      .frf_btn_danger {
        background: rgba(199, 80, 80, 0.2);
        color: #c75050;
        border: 1px solid #c75050;
      }

      .frf_btn_danger:hover {
        background: rgba(199, 80, 80, 0.3);
      }

      /* 面板底部 */
      .frf_settings_footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 16px 20px;
        border-top: 1px solid #4a6278;
        background: rgba(0, 0, 0, 0.2);
      }

      /* 关于信息 */
      .frf_about_info {
        color: #8f98a0;
        font-size: 13px;
        line-height: 1.6;
      }

      .frf_about_info p {
        margin: 4px 0;
      }

      .frf_about_info a {
        color: #67c1f5;
        text-decoration: none;
      }

      .frf_about_info a:hover {
        text-decoration: underline;
      }

      /* Toast 提示 */
      .frf_toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        padding: 12px 24px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
      }

      .frf_toast_show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      .frf_toast_success {
        background: #5ba32b;
        color: #fff;
      }

      .frf_toast_error {
        background: #c75050;
        color: #fff;
      }

      .frf_toast_info {
        background: #67c1f5;
        color: #fff;
      }

      /* 滚动条样式 */
      .frf_settings_content::-webkit-scrollbar {
        width: 8px;
      }

      .frf_settings_content::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
      }

      .frf_settings_content::-webkit-scrollbar-thumb {
        background: #4a6278;
        border-radius: 4px;
      }

      .frf_settings_content::-webkit-scrollbar-thumb:hover {
        background: #5a7288;
      }
    `;

    document.head.appendChild(style);
  }
}

// 暴露到全局
if (typeof window !== 'undefined') {
  window.FRF_SettingsPanel = SettingsPanel;
}


// ==================== src/main.js ====================

/**
 * FRF - Friend Review Finder v5.0
 * 主程序
 *
 * 智能缓存架构：
 * - 快速模式：单游戏搜索，遍历好友，获取最新数据
 * - 渐进式缓存：快速搜索结果自动同步到缓存
 * - 429限流处理：遇到限流自动等待重试
 *
 * v5.0 改进：
 * - 移除废弃的 FriendReviewFinder 类
 * - 精简代码结构
 * - 新增设置面板
 */

// ==================== 全局暴露 ====================
if (typeof window !== 'undefined') {
  // 全局辅助对象
  window.FRF = {
    /**
     * 缓存查询（仅在有缓存时工作）
     * 缓存通过快速搜索自动构建
     */
    test: async function(appId) {
      console.log(`%c========================================`, 'color: #47bfff; font-weight: bold;');
      console.log(`%c  📚 缓存查询 - 游戏 ${appId}`, 'color: #47bfff; font-weight: bold; font-size: 14px;');
      console.log(`%c========================================`, 'color: #47bfff; font-weight: bold;');
      console.log('');

      const cache = new ReviewCache();
      const cacheLoaded = cache.loadFromCache();

      if (!cacheLoaded) {
        console.log('%c❌ 缓存不存在！', 'color: #ff5722; font-weight: bold;');
        console.log('');
        console.log('💡 缓存通过快速搜索自动构建：');
        console.log('   %cFRF.quick(' + appId + ')%c - 快速搜索此游戏（结果自动缓存）', 'color: #ff9800; font-weight: bold;', '');
        return null;
      }

      // 查询游戏
      const matchedFriends = cache.findFriendsWithReview(String(appId));

      if (matchedFriends.length === 0) {
        console.log('😢 缓存中没有此游戏的好友评测记录');
        console.log('');
        console.log('💡 可能原因：');
        console.log('   1. 你的好友没有评测过这款游戏');
        console.log('   2. 这是你第一次访问此游戏页面');
        console.log('');
        console.log('🚀 使用快速模式获取数据：');
        console.log('   %cFRF.quick(' + appId + ')%c', 'color: #ff9800; font-weight: bold;', '');
        return [];
      }

      console.log(`🎯 找到 ${matchedFriends.length} 个好友评测了这款游戏`);
      console.log('');

      // 获取详细数据
      const steamAPI = new SteamAPI(appId);
      const reviews = await steamAPI.batchGetReviews(matchedFriends, (current, total, found) => {
        if (current % 5 === 0 || current === total) {
          console.log(`📊 进度: ${current}/${total}`);
        }
      });

      // 显示结果统计
      const positive = reviews.filter(r => r.isPositive).length;
      const negative = reviews.length - positive;

      console.log('');
      console.log('========================================');
      console.log('  ✅ 查询完成！');
      console.log('========================================');
      console.log(`📊 找到 ${reviews.length} 篇评测`);
      console.log(`   👍 推荐: ${positive} 篇`);
      console.log(`   👎 不推荐: ${negative} 篇`);
      console.log('');

      // 显示详细列表
      if (reviews.length > 0) {
        console.log('📋 评测列表:');
        console.table(reviews.map((r, i) => ({
          '#': i + 1,
          '推荐': r.isPositive ? '👍' : '👎',
          '时长': `${r.totalHours}h`,
          '发布': r.publishDate,
          '更新': r.updateDate || '-',
          'Steam ID': r.steamId
        })));
      }

      window.frfReviews = reviews;
      console.log('💾 评测数据已保存到 window.frfReviews');

      return reviews;
    },

    /**
     * 获取当前页面的 App ID
     */
    getAppId: function() {
      const match = window.location.pathname.match(/\/app\/(\d+)/);
      if (match) {
        console.log(`✅ 当前页面 App ID: ${match[1]}`);
        return match[1];
      } else {
        console.warn('❌ 未检测到 App ID');
        return null;
      }
    },

    /**
     * 清除缓存
     */
    clearCache: function() {
      const cache = new ReviewCache();
      cache.clearCache();
      console.log('✅ 缓存已清除');
    },

    /**
     * 查看缓存统计
     */
    stats: function() {
      const cache = new ReviewCache();
      if (cache.loadFromCache()) {
        const stats = cache.getCacheStats();
        console.log('📊 缓存统计:');
        console.table(stats);
      } else {
        console.log('❌ 无缓存数据');
      }
    },

    /**
     * 切换调试模式
     */
    setDebug: function(enabled) {
      Constants.DEBUG_MODE = enabled;
      console.log(`${enabled ? '✅' : '❌'} 调试模式已${enabled ? '开启' : '关闭'}`);
    },

    /**
     * 快速模式 - 单游戏搜索
     */
    // 快速模式配置（已优化：基于限流研究）
    _quickConfig: {
      batchSize: 30,
      delay: 50,
      debug: false
    },

    // 缓存有效期（天数），0表示不缓存，默认3天
    _cacheDays: 3,

    /**
     * 设置快速模式参数
     * @param {Object} config - { batchSize, delay, debug }
     */
    setQuickConfig: function(config) {
      if (config.batchSize !== undefined) this._quickConfig.batchSize = config.batchSize;
      if (config.delay !== undefined) this._quickConfig.delay = config.delay;
      if (config.debug !== undefined) this._quickConfig.debug = config.debug;
      console.log('⚙️ 快速模式配置已更新:', this._quickConfig);
    },

    quick: async function(appId, options = {}) {
      console.log('%c========================================', 'color: #ff9800; font-weight: bold;');
      console.log(`%c  🚀 快速模式 - 游戏 ${appId}`, 'color: #ff9800; font-weight: bold; font-size: 14px;');
      console.log('%c========================================', 'color: #ff9800; font-weight: bold;');
      console.log('');

      const searcher = new QuickSearcher(appId);
      // 应用配置
      searcher.batchSize = this._quickConfig.batchSize;
      searcher.delay = this._quickConfig.delay;
      searcher.debugMode = this._quickConfig.debug;

      console.log(`⚙️ 配置: batch=${searcher.batchSize}, delay=${searcher.delay}ms, debug=${searcher.debugMode}`);
      console.log('');

      window.frfQuickSearcher = searcher; // 保存实例以支持暂停/继续
      await searcher.search({
        onProgress: options.onProgress || ((current, total, found, eta) => {
          if (current % 9 === 0 || current === total) {
            console.log(`📊 进度: ${current}/${total}, 已找到: ${found} 篇, 预计剩余: ${eta}`);
          }
        }),
        onComplete: options.onComplete || ((reviews) => {
          console.log(`✅ 搜索完成！找到 ${reviews.length} 篇评测`);
        }),
        onPause: options.onPause
      });

      return searcher;
    },

    /**
     * 暂停快速搜索
     */
    pause: function() {
      if (window.frfQuickSearcher) {
        window.frfQuickSearcher.pause();
        console.log('⏸️ 搜索已暂停');
      } else {
        console.log('❌ 没有正在进行的搜索');
      }
    },

    /**
     * 继续快速搜索
     */
    resume: async function() {
      if (window.frfQuickSearcher) {
        await window.frfQuickSearcher.resume();
      } else {
        console.log('❌ 没有可继续的搜索');
      }
    },

    /**
     * 显示帮助
     */
    help: function() {
      console.log('%c========================================', 'color: #47bfff; font-weight: bold;');
      console.log('%c  📖 FRF v5.0 使用指南', 'color: #47bfff; font-weight: bold; font-size: 16px;');
      console.log('%c========================================', 'color: #47bfff; font-weight: bold;');
      console.log('');
      console.log('%c🔧 自动模式（默认）:', 'color: #9c27b0; font-weight: bold;');
      console.log('  FRF会自动检测Steam好友评测页面');
      console.log('  有缓存时秒加载，同时后台检查更新');
      console.log('  无缓存时自动执行快速搜索');
      console.log('');
      console.log('%c🚀 快速搜索:', 'color: #ff9800; font-weight: bold;');
      console.log('  FRF.quick(appId)     - 快速搜索指定游戏');
      console.log('  FRF.pause()          - 暂停搜索');
      console.log('  FRF.resume()         - 继续搜索');
      console.log('');
      console.log('%c🖥️ UI渲染:', 'color: #e91e63; font-weight: bold;');
      console.log('  FRF.renderUI()       - 渲染好友评测到页面');
      console.log('  FRF.renderUI(true)   - 强制刷新重新获取');
      console.log('');
      console.log('%c⚙️ 设置:', 'color: #9e9e9e;');
      console.log('  FRF.openSettings()   - 打开设置面板');
      console.log('  FRF.getAppId()       - 获取当前页面游戏ID');
      console.log('  FRF.stats()          - 查看缓存统计');
      console.log('  FRF.clearCache()     - 清除缓存');
      console.log('  FRF.setDebug(true)   - 开启调试模式');
      console.log('');
      console.log('%c💡 工作原理:', 'color: #2196f3;');
      console.log('  1. 首次访问游戏页：快速搜索 (~42秒)，结果自动缓存');
      console.log('  2. 再次访问同游戏：秒加载缓存，后台静默检查更新');
      console.log('  3. 发现数据改动：页面顶部提示，点击可刷新');
      console.log('');
    },

    // ==================== UI 渲染功能 ====================

    /**
     * UI渲染器实例
     */
    _uiRenderer: null,
    _pageDetector: null,
    _settingsPanel: null,

    /**
     * 打开设置面板
     */
    openSettings: function() {
      if (!this._settingsPanel) {
        this._settingsPanel = new SettingsPanel();
        this._settingsPanel.init();
      }
      this._settingsPanel.open();
    },

    /**
     * 渲染好友评测到页面（核心UI功能）
     * @param {boolean} forceRefresh - 是否强制重新获取数据
     */
    renderUI: async function(forceRefresh = false) {
      console.log('%c========================================', 'color: #e91e63; font-weight: bold;');
      console.log('%c  🖥️ FRF UI渲染模式', 'color: #e91e63; font-weight: bold; font-size: 14px;');
      console.log('%c========================================', 'color: #e91e63; font-weight: bold;');
      console.log('');

      // 初始化UI渲染器
      if (!this._uiRenderer) {
        this._uiRenderer = new UIRenderer();
      }

      // 隐藏欢迎横幅（开始渲染后不需要了）
      this._uiRenderer.hideWelcomeBanner();

      if (!this._uiRenderer.init()) {
        console.error('❌ UI渲染器初始化失败，可能不在正确的页面');
        return;
      }

      // 获取App ID
      const appId = this.getAppId();
      if (!appId) {
        console.error('❌ 无法获取App ID');
        return;
      }

      // 添加刷新按钮
      this._uiRenderer.addRefreshButton();

      // 清空并显示加载状态
      this._uiRenderer.clear();
      this._uiRenderer.showLoading('正在加载好友评测...');

      try {
        // 决定使用哪种模式获取数据
        // 注意：_fetchReviewsForUI 内部会边获取边渲染，返回时已渲染完成
        const reviews = await this._fetchReviewsForUI(appId, forceRefresh);

        if (reviews.length === 0) {
          this._uiRenderer.hideLoading();
          this._uiRenderer.showEmpty();
          console.log('😢 没有好友评测此游戏');
          return;
        }

        // 渲染已在 _fetchReviewsForUI 内部完成，这里只需确保加载状态已隐藏
        this._uiRenderer.hideLoading();

        console.log(`✅ 渲染完成，共 ${reviews.length} 条好友评测`);

      } catch (error) {
        console.error('❌ 渲染失败:', error);
        this._uiRenderer.showError(error.message);
      }
    },

    /**
     * 为UI获取评测数据（智能选择模式）
     * 优先级：缓存秒加载 + 后台更新 > 快速模式
     *
     * @param {string} appId - 游戏ID
     * @param {boolean} forceRefresh - 是否强制刷新（忽略缓存）
     * @returns {Promise<Array>} 评测数据数组（完整版）
     */
    _fetchReviewsForUI: async function(appId, forceRefresh) {
      const cache = new ReviewCache();

      // 强制刷新时直接使用快速模式
      if (forceRefresh) {
        console.log('🔄 强制刷新，使用快速模式...');
        return await this._fetchReviewsQuickMode(appId);
      }

      // 检查缓存
      const cacheLoaded = cache.loadFromCache();

      if (cacheLoaded) {
        const matchedFriends = cache.findFriendsWithReview(appId);
        if (matchedFriends.length > 0) {
          console.log(`📚 缓存命中！找到 ${matchedFriends.length} 个好友评测`);
          // 使用缓存数据：分批获取详细数据
          const cachedReviews = await this._fetchFullReviews(matchedFriends, appId);

          return cachedReviews;
        } else {
          console.log('📚 缓存中无此游戏记录，切换到快速模式');
        }
      } else {
        console.log('📚 无缓存，使用快速模式');
      }

      // 使用快速模式
      console.log('🚀 使用快速模式获取数据...');
      return await this._fetchReviewsQuickMode(appId);
    },


    /**
     * 快速模式获取完整评测数据（用于UI）
     * 分批渲染：每找到N篇评测立即渲染（N由设置控制）
     */
    _fetchReviewsQuickMode: async function(appId) {
      const reviews = [];
      const pendingRender = []; // 待渲染队列
      // 从设置读取渲染批次大小，默认3
      const RENDER_BATCH_SIZE = (this._uiConfig && this._uiConfig.renderBatch) || 3;
      const extractor = new ReviewExtractor();

      const searcher = new QuickSearcher(appId);
      searcher.batchSize = this._quickConfig.batchSize;
      searcher.delay = this._quickConfig.delay;

      // 获取好友列表
      const friendIds = await searcher.fetchFriendIds();
      const total = friendIds.length;
      let current = 0;

      console.log(`📊 开始处理 ${total} 个好友...`);

      // 分批渲染函数（异步处理截图）
      const flushRenderQueue = async () => {
        if (pendingRender.length > 0 && this._uiRenderer) {
          for (const review of pendingRender) {
            await this._uiRenderer.appendCard(review);
          }
          console.log(`🎨 渲染了 ${pendingRender.length} 篇评测，共 ${reviews.length} 篇`);
          pendingRender.length = 0; // 清空队列
        }
      };

      // 批量处理好友
      for (let i = 0; i < friendIds.length; i += searcher.batchSize) {
        const batch = friendIds.slice(i, i + searcher.batchSize);

        const batchResults = await Promise.all(
          batch.map(async (steamId) => {
            try {
              // 使用 returnRaw=true 获取原始HTML
              const result = await searcher.checkFriendReview(steamId, true);
              if (result && result.hasReview && result.html) {
                // 用 extractFull 提取完整数据
                const fullReview = extractor.extractFull(result.html, steamId, appId);
                return fullReview;
              }
            } catch (error) {
              // 忽略单个错误
            }
            return null;
          })
        );

        // 收集有效结果
        const validResults = batchResults.filter(r => r !== null);
        for (const review of validResults) {
          reviews.push(review);
          pendingRender.push(review);

          // 每满5篇就渲染一次
          if (pendingRender.length >= RENDER_BATCH_SIZE) {
            await flushRenderQueue();
          }
        }

        current += batch.length;
        if (this._uiRenderer) {
          this._uiRenderer.updateProgress(current, total, reviews.length);
        }

        // 批次延迟
        if (searcher.delay > 0 && i + searcher.batchSize < friendIds.length) {
          await new Promise(r => setTimeout(r, searcher.delay));
        }
      }

      // 渲染剩余的评测
      await flushRenderQueue();

      // 隐藏加载状态
      if (this._uiRenderer) {
        this._uiRenderer.hideLoading();
      }

      // 同步到字典缓存
      if (reviews.length > 0) {
        this._syncQuickResultsToDict(reviews, appId);
      }

      return reviews;
    },

    /**
     * 从字典模式获取完整评测数据
     * 分批渲染：每获取N篇评测立即渲染（N由设置控制）
     */
    _fetchFullReviews: async function(friendIds, appId) {
      const reviews = [];
      const pendingRender = []; // 待渲染队列
      // 从设置读取渲染批次大小，默认3
      const RENDER_BATCH_SIZE = (this._uiConfig && this._uiConfig.renderBatch) || 3;
      const extractor = new ReviewExtractor();
      const total = friendIds.length;
      let current = 0;

      console.log(`📥 获取 ${total} 条评测的详细数据...`);

      // 分批渲染函数（异步处理截图）
      const flushRenderQueue = async () => {
        if (pendingRender.length > 0 && this._uiRenderer) {
          for (const review of pendingRender) {
            await this._uiRenderer.appendCard(review);
          }
          console.log(`🎨 渲染了 ${pendingRender.length} 篇评测，共 ${reviews.length} 篇`);
          pendingRender.length = 0; // 清空队列
        }
      };

      // 批量获取（网络请求批次）
      const fetchBatchSize = 5;
      for (let i = 0; i < friendIds.length; i += fetchBatchSize) {
        const batch = friendIds.slice(i, i + fetchBatchSize);

        const batchResults = await Promise.all(
          batch.map(async (steamId) => {
            try {
              const url = Constants.STEAM_COMMUNITY + Constants.PROFILE_GAME_REVIEW_URL(steamId, appId);
              const response = await fetch(url, { credentials: 'include' });

              if (response.ok) {
                const html = await response.text();
                // 验证是正确的评测页
                if (html.includes('ratingSummary')) {
                  return extractor.extractFull(html, steamId, appId);
                }
              }
            } catch (error) {
              // 忽略单个错误
            }
            return null;
          })
        );

        // 收集有效结果
        const validResults = batchResults.filter(r => r !== null);
        for (const review of validResults) {
          reviews.push(review);
          pendingRender.push(review);

          // 每满5篇就渲染一次
          if (pendingRender.length >= RENDER_BATCH_SIZE) {
            await flushRenderQueue();
          }
        }

        current += batch.length;
        if (this._uiRenderer) {
          this._uiRenderer.updateProgress(current, total, reviews.length);
        }

        // 批次延迟
        if (i + fetchBatchSize < friendIds.length) {
          await new Promise(r => setTimeout(r, 300));
        }
      }

      // 渲染剩余的评测
      await flushRenderQueue();

      // 隐藏加载状态
      if (this._uiRenderer) {
        this._uiRenderer.hideLoading();
      }

      return reviews;
    },

    /**
     * 将快速模式结果同步到字典缓存
     * 无论是否有现有缓存，都会保存结果
     */
    _syncQuickResultsToDict: function(reviews, appId) {
      try {
        const cache = new ReviewCache();
        // 尝试加载现有缓存，如果没有也没关系
        cache.loadFromCache();

        // 添加新的评测记录
        reviews.forEach(review => {
          cache.addReviewToCache(review.steamId, appId);
        });

        // 保存到缓存
        cache.saveToCache();
        console.log(`🔗 已将 ${reviews.length} 条评测同步到字典缓存`);
      } catch (error) {
        console.warn('同步到字典失败:', error);
      }
    },

    /**
     * 启动自动检测
     */
    startAutoDetect: function() {
      if (!this._pageDetector) {
        this._pageDetector = new PageDetector();
      }

      // 初始化UI渲染器
      if (!this._uiRenderer) {
        this._uiRenderer = new UIRenderer();
      }
      // 注入样式
      this._uiRenderer.injectStyles();

      const self = this;

      // 立即检测当前页面
      this._pageDetector.detectAndTrigger(
        // onNeedFix: Steam渲染失败，需要FRF自动修复
        (appId) => {
          console.log(`🔧 检测到Steam渲染bug，自动启动FRF修复...`);
          // 隐藏欢迎横幅（开始渲染后不需要了）
          self._uiRenderer.hideWelcomeBanner();
          // 开始渲染
          self.renderUI();
        },
        // onPageReady: 进入好友评测页面立即显示欢迎横幅和按钮
        (appId) => {
          console.log(`🚀 FRF 已就绪，App ID: ${appId}`);
          // 立即显示欢迎横幅
          self._uiRenderer.showWelcomeBanner();
          // 立即添加FRF刷新按钮
          self._uiRenderer.addRefreshButton();
          // 初始化设置面板（会添加设置按钮）
          if (!self._settingsPanel) {
            self._settingsPanel = new SettingsPanel();
            self._settingsPanel.init();
            // 应用保存的设置
            self._settingsPanel.applySavedSettings();
          }
        }
      );

      // 监听页面变化（SPA导航）
      this._pageDetector.watchPageChanges((appId) => {
        console.log(`🔧 页面变化，重新检测...`);
        // 显示欢迎横幅和按钮
        self._uiRenderer.showWelcomeBanner();
        self._uiRenderer.addRefreshButton();
      });

      console.log('👀 FRF 自动检测已启动');
    }
  };

  // 欢迎信息
  console.log('%c========================================', 'color: #47bfff; font-weight: bold;');
  console.log('%c  🚀 FRF v' + Constants.VERSION + ' 已加载', 'color: #47bfff; font-weight: bold; font-size: 16px;');
  console.log('%c  Friend Review Finder', 'color: #47bfff;');
  console.log('%c  智能缓存 + 设置面板', 'color: #e91e63; font-weight: bold;');
  console.log('%c========================================', 'color: #47bfff; font-weight: bold;');
  console.log('');
  console.log('📖 输入 %cFRF.help()%c 查看使用说明', 'color: #ff9800; font-weight: bold;', '');
  console.log('🔧 智能缓存: 首次搜索后自动缓存，下次秒加载');
  console.log('');

  // 自动启动检测（延迟执行，等待页面加载完成）
  setTimeout(() => {
    window.FRF.startAutoDetect();
  }, 2000);
}



  // FRF 自动启动逻辑已内置于 main.js
  // 脚本会自动检测好友评测页面并修复渲染bug

})();
