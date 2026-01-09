// ==UserScript==
// @name         Microsoft Bing Rewards每日任务脚本
// @version      V1.0.1
// @description  自动完成微软Rewards每日搜索任务,每次运行时获取抖音/微博/哔哩哔哩/百度/头条热门词,避免使用同样的搜索词被封号。
// @lastupdate   更新于 2026年1月9日
// @author       Chapman
// @license      MIT License
// @match        https://*.bing.com/*
// @exclude      https://rewards.bing.com/*
// @connect      gmya.net
// @connect      api.gmya.net
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1171614
// @downloadURL https://update.greasyfork.org/scripts/561994/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/561994/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

'use strict';

// ==================== 配置项 ====================
const CONFIG = {
  maxRewards: 40,              // 重复执行的次数
  pauseTime: 960000,           // 暂停时长：16分钟 (60000毫秒=1分钟)
  pauseInterval: 5,            // 每5次搜索后插入暂停
  minDelay: 20000,             // 最小延迟：20秒
  maxDelay: 80000,             // 最大延迟：80秒
  randomStringLength: 4,       // 随机字符串长度
  cvidLength: 32,              // cvid长度
  appkey: "b7a782741f667201b54880c925faec4b",  // 从https://www.gmya.net/api 网站申请的热门词接口APIKEY
  hotWordsApi: "https://api.gmya.net/Api/"  // 故梦热门词API接口网站
};

// 搜索词来源列表
const KEYWORDS_SOURCES = ['DouYinHot', 'WeiBoHot', 'TouTiaoHot', 'BaiduHot'];

// 默认搜索词，热门搜索词请求失败时使用
const DEFAULT_SEARCH_WORDS = [
  // Rust
  "Rust语言入门教程", "Rust所有权机制详解", "Rust异步编程async await", "Rust Cargo包管理器使用",
  "Rust生命周期lifetime", "Rust trait特征用法", "Rust WebAssembly开发", "Tokio异步运行时教程",
  // Python
  "Python数据分析pandas", "Python机器学习sklearn", "Python爬虫scrapy框架", "FastAPI后端开发",
  "Python asyncio异步编程", "Django REST framework", "Python类型注解typing", "NumPy数组操作技巧",
  // Java
  "Java Spring Boot教程", "Java多线程并发编程", "JVM内存模型详解", "Java Stream API用法",
  "Spring Cloud微服务架构", "MyBatis Plus使用教程", "Java设计模式实践", "Maven Gradle构建工具",
  // TypeScript
  "TypeScript泛型编程", "TypeScript类型体操", "TypeScript装饰器用法", "TypeScript接口与类型",
  "TypeScript配置tsconfig", "TypeScript高级类型", "TypeScript模块系统", "TypeScript与React结合",
  // JavaScript
  "JavaScript ES6新特性", "JavaScript Promise详解", "JavaScript原型链继承", "JavaScript事件循环机制",
  "JavaScript闭包作用域", "JavaScript模块化开发", "Node.js后端开发", "JavaScript性能优化技巧",
  // Vue
  "Vue3 Composition API", "Vue3响应式原理", "Pinia状态管理教程", "Vue Router路由配置",
  "Vite构建工具使用", "Vue3 TypeScript开发", "Element Plus组件库", "Vue3生命周期钩子",
  // React
  "React Hooks使用教程", "React useState useEffect", "Redux Toolkit状态管理", "Next.js服务端渲染",
  "React Router v6教程", "React性能优化memo", "React Context上下文", "React组件设计模式",
  // 其他技术
  "Docker容器化部署", "Kubernetes K8s入门", "Git版本控制技巧", "Linux命令行常用操作",
  "MySQL索引优化", "Redis缓存使用场景", "Nginx反向代理配置", "GraphQL API设计",
  "WebSocket实时通信", "OAuth2认证授权", "CI/CD持续集成部署", "微服务架构设计",
  "RESTful API设计规范", "单元测试最佳实践", "代码重构技巧", "敏捷开发Scrum方法"
];

// 运行时变量
let searchWords = [];
let currentSourceIndex = 0;

// ==================== 工具函数 ====================

/**
 * 平滑滚动到页面底部
 */
function smoothScrollToBottom() {
  document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

/**
 * 生成指定长度的随机字符串（大写字母和数字）
 * @param {number} length - 字符串长度
 * @returns {string} 随机字符串
 */
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * 对字符串进行随机混淆处理
 * @param {string} str - 原字符串
 * @returns {string} 混淆后的字符串
 */
function randomizeString(str) {
  if (!str) return '';
  let result = '';
  let prevPos = 0;
  for (let i = 0; i < str.length;) {
    const step = Math.floor(Math.random() * 5) + 1;
    if (i > 0) {
      result += str.substring(prevPos, i);
      prevPos = i;
    }
    i += step;
  }
  if (prevPos < str.length) {
    result += str.substring(prevPos);
  }
  return result;
}

/**
 * 生成随机延迟时间
 * @returns {number} 延迟时间（毫秒）
 */
function getRandomDelay() {
  return Math.floor(Math.random() * (CONFIG.maxDelay - CONFIG.minDelay)) + CONFIG.minDelay;
}

/**
 * 使用 GM_xmlhttpRequest 发起网络请求（解决跨域问题）
 * @param {string} url - 请求地址
 * @returns {Promise<object>} 返回 JSON 数据
 */
function gmFetch(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      timeout: 10000,
      onload: function (response) {
        if (response.status >= 200 && response.status < 300) {
          try {
            resolve(JSON.parse(response.responseText));
          } catch (e) {
            reject(new Error('JSON 解析失败: ' + e.message));
          }
        } else {
          reject(new Error('HTTP error! status: ' + response.status));
        }
      },
      onerror: function (error) {
        reject(new Error('网络请求失败'));
      },
      ontimeout: function () {
        reject(new Error('请求超时'));
      }
    });
  });
}

/**
 * 尝试从多个搜索词来源获取搜索词，如果所有来源都失败，则返回默认搜索词
 * @returns {Promise<string[]>} 返回搜索词列表
 */
async function fetchHotWords() {
  while (currentSourceIndex < KEYWORDS_SOURCES.length) {
    const source = KEYWORDS_SOURCES[currentSourceIndex];
    let url = CONFIG.hotWordsApi + source;
    if (CONFIG.appkey) {
      url += "?format=json&appkey=" + CONFIG.appkey;
    }

    try {
      console.log(`[Rewards] 正在从 ${source} 获取热词...`);
      const data = await gmFetch(url);

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        const titles = data.data
          .map(item => item.title)
          .filter(title => title && title.trim());

        if (titles.length > 0) {
          console.log(`[Rewards] 成功获取 ${titles.length} 个热词`);
          return titles;
        }
      }
    } catch (error) {
      console.error(`[Rewards] ${source} 请求失败:`, error.message);
    }

    currentSourceIndex++;
  }

  console.warn('[Rewards] 所有热词来源请求失败，使用默认搜索词');
  return DEFAULT_SEARCH_WORDS;
}

// ==================== 核心逻辑 ====================

/**
 * 执行搜索跳转
 * @param {string} searchText - 搜索词
 * @param {string} domain - 域名
 * @param {number} searchCount - 当前搜索计数
 */
function performSearch(searchText, domain, searchCount) {
  // 在真正跳转前才更新计数器，确保搜索一定会执行
  GM_setValue('Cnt', searchCount + 1);
  
  const randomString = generateRandomString(CONFIG.randomStringLength);
  const randomCvid = generateRandomString(CONFIG.cvidLength);
  const encodedText = encodeURIComponent(randomizeString(searchText));
  location.href = `https://${domain}/search?q=${encodedText}&form=${randomString}&cvid=${randomCvid}`;
}

/**
 * 主执行函数
 */
function exec() {
  // 初始化计数器
  if (GM_getValue('Cnt') == null) {
    GM_setValue('Cnt', CONFIG.maxRewards + 10);
  }

  const currentCount = GM_getValue('Cnt');
  
  // 检查是否已完成所有搜索
  if (currentCount >= CONFIG.maxRewards) {
    console.log('[Rewards] 搜索任务已完成');
    return;
  }

  // 检查搜索词是否足够
  if (currentCount >= searchWords.length) {
    console.warn('[Rewards] 搜索词数量不足，使用默认搜索词补充');
    searchWords = searchWords.concat(DEFAULT_SEARCH_WORDS);
  }

  // 更新页面标题显示进度（显示即将执行的搜索序号）
  const titleEl = document.getElementsByTagName("title")[0];
  if (titleEl) {
    titleEl.innerHTML = `[等待中 ${currentCount + 1} / ${CONFIG.maxRewards}] ${titleEl.innerHTML}`;
  }

  // 滚动到底部模拟用户行为
  smoothScrollToBottom();

  // 注意：不在这里更新计数器，而是在 performSearch 中更新

  // 确定使用的域名（前半使用国际版，后半使用中国版）
  const domain = currentCount < CONFIG.maxRewards / 2 ? 'www.bing.com' : 'cn.bing.com';
  
  // 获取搜索词
  const searchText = searchWords[currentCount] || DEFAULT_SEARCH_WORDS[currentCount % DEFAULT_SEARCH_WORDS.length];

  // 计算延迟时间
  const baseDelay = getRandomDelay();
  const needsPause = (currentCount + 1) % CONFIG.pauseInterval === 0;
  const totalDelay = needsPause ? baseDelay + CONFIG.pauseTime : baseDelay;

  if (needsPause) {
    console.log(`[Rewards] 第 ${currentCount + 1} 次搜索，暂停 ${Math.round(CONFIG.pauseTime / 60000)} 分钟后继续...`);
  } else {
    console.log(`[Rewards] 第 ${currentCount + 1} 次搜索，${Math.round(totalDelay / 1000)} 秒后执行...`);
  }

  // 延迟后执行搜索（传入当前计数，在跳转前才更新）
  setTimeout(() => performSearch(searchText, domain, currentCount), totalDelay);
}

GM_registerMenuCommand('▶️ 开始搜索', function () {
  GM_setValue('Cnt', 0);
  location.href = "https://www.bing.com/?br_msg=Please-Wait";
}, 's');

GM_registerMenuCommand('⏹️ 停止搜索', function () {
  GM_setValue('Cnt', CONFIG.maxRewards + 10);
  console.log('[Rewards] 搜索已停止');
}, 'x');

GM_registerMenuCommand('🔄 查看进度', function () {
  const cnt = GM_getValue('Cnt') || 0;
  const status = cnt >= CONFIG.maxRewards ? '已完成' : `${cnt} / ${CONFIG.maxRewards}`;
  alert(`当前搜索进度: ${status}`);
}, 'p');

// ==================== 初始化 ====================

fetchHotWords()
  .then(words => {
    searchWords = words;
    console.log('[Rewards] 脚本初始化完成');
    exec();
  })
  .catch(error => {
    console.error('[Rewards] 初始化失败:', error);
    searchWords = DEFAULT_SEARCH_WORDS;
    exec();
  });
