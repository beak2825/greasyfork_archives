// ==UserScript==
// @name         豆瓣读书 - 掌阅书城搜索助手
// @namespace    douban-ireader-helper
// @version      1.8.1
// @description  在豆瓣读书详情页显示掌阅书城的搜索结果，支持书名+作者双重匹配
// @author       Wang Dongguan
// @match        https://book.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @connect      m.zhangyue.com
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552905/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%20-%20%E6%8E%8C%E9%98%85%E4%B9%A6%E5%9F%8E%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552905/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%20-%20%E6%8E%8C%E9%98%85%E4%B9%A6%E5%9F%8E%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ========== 配置常量 ==========
  const CACHE_KEY_PREFIX = "ireader_cache_";
  const CACHE_VERSION = "v8"; // 缓存版本（移除列表页功能）
  const CACHE_VERSION_KEY = "ireader_cache_version";
  const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7天过期
  const API_TIMEOUT = 10000; // 10秒超时
  const DEBUG = false; // 调试模式（生产环境设为false）

  // ========== 工具函数 ==========

  // 全局DOMParser实例（复用，避免重复创建）
  const domParser = new DOMParser();

  // 调试日志（仅在DEBUG模式下输出）
  function debugLog(...args) {
    if (DEBUG) console.log("[掌阅助手]", ...args);
  }

  // 作者匹配判断（支持模糊匹配）
  function authorsMatch(zyAuthor, dbAuthor) {
    if (!zyAuthor || !dbAuthor) return false;

    // 清理作者名：去除空格、括号、标点、分隔符等
    const clean1 = zyAuthor
      .replace(/\s+/g, "")
      .replace(/[（(].*?[）)]/g, "")
      .replace(/[[\]【】]/g, "")
      .replace(/[.·•・\-]/g, "") // 统一去除各种分隔符：ASCII点、中点、项目符号、日文中点、连字符
      .toLowerCase();
    const clean2 = dbAuthor
      .replace(/\s+/g, "")
      .replace(/[（(].*?[）)]/g, "")
      .replace(/[[\]【】]/g, "")
      .replace(/[.·•・\-]/g, "") // 统一去除各种分隔符
      .toLowerCase();

    // 精确匹配或包含关系
    return (
      clean1 === clean2 || clean1.includes(clean2) || clean2.includes(clean1)
    );
  }

  // 注入CSS样式（替代JS事件监听器）
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* 列表页链接hover效果 */
      .ireader-link.success:hover {
        background-color: #37a !important;
        color: #fff !important;
      }
      .ireader-link.success:hover .checkmark {
        color: #fff !important;
      }

      /* 详情页链接hover效果 */
      .ireader-detail-link:hover {
        background-color: #37a !important;
        color: #fff !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 更新详情页UI（原地更新，不删除重建）
  function updateDetailPageUI(result, status) {
    // 查找现有卡片
    const aside = document.querySelector(".aside");
    if (!aside) return;

    let card = aside.querySelector(".ireader-card");
    if (!card) {
      // 首次创建
      insertDetailPageUI(result, status);
      return;
    }

    // 原地更新：只修改内容区域
    const content = card.querySelector(".ireader-content");
    if (!content) return;

    if (status === "loading") {
      content.textContent = "查询中...";
      content.style.color = "#666";
    } else if (status === "error") {
      content.innerHTML = `
        <span style="color: #cc0000;">请求失败</span>
        <a href="#" class="ireader-retry" style="margin-left: 8px; color: #37a;">重试</a>
      `;
    } else if (result && result.found) {
      content.innerHTML = `
        <span style="color: #0b7c2a;">✓ 有此书</span>
        <a href="${result.url}" target="_blank" class="ireader-detail-link"
           style="float: right; color: #37a; text-decoration: none;">
          去看看
        </a>
      `;
    } else if (result && result.uncertain) {
      content.innerHTML = `
        <span style="color: #f60;">? 不确定</span>
        <a href="${result.searchUrl}" target="_blank" class="ireader-detail-link"
           style="float: right; color: #37a; text-decoration: none;">
          查看搜索结果
        </a>
      `;
    } else {
      content.innerHTML = `<span style="color: #999;">✗ 暂无此书</span>`;
    }
  }

  // ========== 1. 页面类型识别 ==========
  function getPageType() {
    const url = window.location.href;
    if (url.includes("/subject/")) return "detail"; // 详情页
    return null;
  }

  // ========== 2. 书名提取 ==========

  // 详情页 - 提取当前书籍
  function getBookFromDetail() {
    const titleElement = document.querySelector('[property="v:itemreviewed"]');
    if (!titleElement) return null;

    const title = titleElement.textContent.trim();

    // 提取作者信息（从#info中查找"作者:"后的内容）
    let author = "";
    const infoElement = document.querySelector("#info");
    if (infoElement) {
      // 查找包含"作者"或"作者:"的span元素
      const spans = infoElement.querySelectorAll("span.pl");
      for (let span of spans) {
        if (span.textContent.includes("作者")) {
          // 获取下一个兄弟节点或链接中的文本
          let authorNode = span.nextSibling;
          if (authorNode) {
            author = authorNode.textContent.trim();
            // 如果是链接，直接获取链接文本
            const authorLink = span.parentElement.querySelector("a");
            if (authorLink) {
              author = authorLink.textContent.trim();
            }
          }
          break;
        }
      }
    }

    return { title, author };
  }

  // ========== 3. 掌阅API搜索模块 ==========

  // API调用
  function searchIReader(bookTitle) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://m.zhangyue.com/search/more?keyWord=${encodeURIComponent(bookTitle)}`,
        timeout: API_TIMEOUT,
        onload: function (response) {
          if (response.status === 200) {
            resolve(response.responseText);
          } else {
            reject(new Error(`API请求失败: ${response.status}`));
          }
        },
        onerror: function (error) {
          reject(error);
        },
        ontimeout: function () {
          reject(new Error("请求超时"));
        },
      });
    });
  }

  // 结果解析与书名匹配（支持作者匹配）
  function parseSearchResult(responseText, originalTitle, originalAuthor) {
    let htmlContent = responseText;

    // 掌阅API返回格式：{"html": "转义的HTML字符串"}
    try {
      const jsonData = JSON.parse(responseText);

      // 确认的字段名（已实测）：只有一个 html 字段
      if (typeof jsonData.html === "string") {
        htmlContent = jsonData.html; // JSON.parse已自动处理 \"、\/ 等转义
      } else {
        console.warn("掌阅API返回格式异常，缺少html字段:", jsonData);
        return { found: false };
      }
    } catch (e) {
      // JSON解析失败，可能是直接返回的HTML（罕见情况）
      console.warn("掌阅API返回非JSON格式，尝试直接解析HTML");
      // 不做任何处理，直接用 responseText
    }

    // 使用全局DOMParser实例（性能优化）
    const doc = domParser.parseFromString(htmlContent, "text/html");

    // 提取所有书籍链接
    const bookLinks = doc.querySelectorAll('a[href*="/detail/"]');

    if (bookLinks.length === 0) {
      return { found: false };
    }

    // 性能优化：提前计算豆瓣书名的清理结果（移出循环）
    const cleanedOriginalTitle = originalTitle
      .replace(/[（(].*?[）)]/g, "") // 去除括号及其内容
      .split(/[：:]/)[0] // 只取冒号前的主标题
      .trim();

    // 收集所有书名匹配的结果
    const nameMatches = [];

    // 遍历所有搜索结果
    for (let link of bookLinks) {
      const nameElement = link.querySelector(".name");
      if (!nameElement) continue;

      const bookName = nameElement.textContent.trim();

      // 清理书名：去除冗余信息，只保留核心主标题
      const cleanedBookName = bookName
        .replace(/\[精品\]|\[.*?\]/g, "") // 去除[精品]等标签
        .replace(/[（(].*?[）)]/g, "") // 去除括号及其内容（版本信息等）
        .split(/[：:]/)[0] // 只取冒号前的主标题（去除副标题）
        .trim();

      // 书名匹配
      if (cleanedBookName === cleanedOriginalTitle) {
        const authorElement = link.querySelector(".author");
        const bookAuthor = authorElement
          ? authorElement.textContent.trim()
          : "";

        // 修复：使用 getAttribute 获取原始 href，避免 DOMParser 基于豆瓣页面解析相对路径
        const rawHref = link.getAttribute('href');
        nameMatches.push({
          url: new URL(rawHref, 'https://m.zhangyue.com').href,
          title: bookName,
          author: bookAuthor,
        });
      }
    }

    // 没有任何书名匹配
    if (nameMatches.length === 0) {
      return { found: false };
    }

    // 只有1个书名匹配，且作者也匹配 → 精确匹配
    if (nameMatches.length === 1) {
      const match = nameMatches[0];
      if (
        !originalAuthor ||
        !match.author ||
        authorsMatch(match.author, originalAuthor)
      ) {
        return {
          found: true,
          url: match.url,
          title: match.title,
        };
      }
    }

    // 有多个书名匹配，尝试通过作者筛选
    if (originalAuthor) {
      const authorMatches = nameMatches.filter((match) =>
        authorsMatch(match.author, originalAuthor)
      );

      // 唯一的作者匹配 → 精确匹配
      if (authorMatches.length === 1) {
        return {
          found: true,
          url: authorMatches[0].url,
          title: authorMatches[0].title,
        };
      }
    }

    // 其他情况：多个结果或作者不匹配 → 返回不确定状态
    return {
      found: false,
      uncertain: true,
      searchUrl: `https://m.zhangyue.com/search?keyWord=${encodeURIComponent(originalTitle)}`,
    };
  }

  // ========== 4. UI插入模块 ==========

  // 详情页UI插入（模仿豆瓣「当前版本有售」卡片样式）
  function insertDetailPageUI(result, status) {
    // 查找右侧栏
    const aside = document.querySelector(".aside");
    if (!aside) return;

    // 创建卡片容器（使用豆瓣原生的 gray_ad 样式）
    const card = document.createElement("div");
    card.className = "gray_ad ireader-card"; // 添加ireader-card类，方便后续查找
    card.style.cssText = `
      padding: 18px 16px;
      margin-bottom: 20px;
      background: #f6f6f2;
    `;

    // 标题（使用豆瓣原生样式）
    const title = document.createElement("h2");
    title.style.cssText = `
      font-size: 15px;
      color: #0b7c2a;
      margin: 0 0 10px 0;
      font-weight: normal;
    `;
    title.innerHTML =
      "<span>掌阅书城</span>&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·";
    card.appendChild(title);

    // 内容区域（单行布局）
    const content = document.createElement("div");
    content.className = "ireader-content"; // 添加类名，方便后续更新
    content.style.cssText = "font-size: 13px; line-height: 1.8;";

    if (status === "loading") {
      content.textContent = "查询中...";
      content.style.color = "#666";
    } else if (status === "error") {
      content.innerHTML = `
        <span style="color: #cc0000;">请求失败</span>
        <a href="#" class="ireader-retry" style="margin-left: 8px; color: #37a;">重试</a>
      `;
    } else if (result && result.found) {
      content.innerHTML = `
        <span style="color: #0b7c2a;">✓ 有此书</span>
        <a href="${result.url}" target="_blank" class="ireader-detail-link"
           style="float: right; color: #37a; text-decoration: none;">
          去看看
        </a>
      `;
    } else if (result && result.uncertain) {
      content.innerHTML = `
        <span style="color: #f60;">? 不确定</span>
        <a href="${result.searchUrl}" target="_blank" class="ireader-detail-link"
           style="float: right; color: #37a; text-decoration: none;">
          查看搜索结果
        </a>
      `;
    } else {
      content.innerHTML = `<span style="color: #999;">✗ 暂无此书</span>`;
    }

    card.appendChild(content);

    // 插入到 aside 的第一个位置（在广告之后）
    const firstElement = aside.querySelector("#dale_book_subject_top_right");
    if (firstElement && firstElement.nextSibling) {
      aside.insertBefore(card, firstElement.nextSibling);
    } else {
      aside.insertBefore(card, aside.firstChild);
    }

    // 移除JS事件监听器，改用CSS hover（性能优化）
  }

  // ========== 5. 缓存机制 ==========

  function getCachedResult(bookTitle) {
    const cacheKey = CACHE_KEY_PREFIX + bookTitle;
    const cached = localStorage.getItem(cacheKey);

    if (!cached) return null;

    try {
      const { result, timestamp } = JSON.parse(cached);
      // 检查是否过期
      if (Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      return result;
    } catch (e) {
      // 缓存数据损坏，删除
      localStorage.removeItem(cacheKey);
      return null;
    }
  }

  function setCachedResult(bookTitle, result) {
    const cacheKey = CACHE_KEY_PREFIX + bookTitle;
    const cacheData = {
      result: result,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (e) {
      // localStorage已满，清理过期缓存
      cleanExpiredCache();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (e) {
        console.warn("缓存写入失败:", e);
      }
    }
  }

  // 清理过期缓存（修复：添加空值检查）
  function cleanExpiredCache() {
    const now = Date.now();
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        try {
          const cachedStr = localStorage.getItem(key);
          if (!cachedStr) {
            keysToRemove.push(key);
            continue;
          }
          const cached = JSON.parse(cachedStr);
          if (
            !cached ||
            !cached.timestamp ||
            now - cached.timestamp > CACHE_EXPIRY
          ) {
            keysToRemove.push(key);
          }
        } catch (e) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  // ========== 6. 重试机制 ==========

  function attachRetryHandler(element, bookTitle, callback) {
    const retryLink = element.querySelector(".ireader-retry");
    if (retryLink) {
      retryLink.addEventListener("click", (e) => {
        e.preventDefault();
        callback(bookTitle);
      });
    }
  }

  // ========== 7. 业务逻辑 ==========

  // 处理详情页
  async function handleDetailPage() {
    const bookInfo = getBookFromDetail();
    if (!bookInfo) {
      debugLog("未找到书名");
      return;
    }

    const { title: bookTitle, author: bookAuthor } = bookInfo;

    debugLog(`开始查询："${bookTitle}"`);

    // 显示加载状态
    insertDetailPageUI(null, "loading");

    // 检查缓存
    let result = getCachedResult(bookTitle);

    if (!result) {
      try {
        const html = await searchIReader(bookTitle);
        result = parseSearchResult(html, bookTitle, bookAuthor);
        setCachedResult(bookTitle, result);
      } catch (error) {
        console.error("搜索失败:", error);

        // 显示错误状态
        updateDetailPageUI(null, "error");

        // 添加重试功能
        const aside = document.querySelector(".aside");
        if (aside) {
          attachRetryHandler(aside, bookTitle, async (title) => {
            updateDetailPageUI(null, "loading");

            try {
              const html = await searchIReader(title);
              const result = parseSearchResult(html, title, bookAuthor);
              setCachedResult(title, result);
              updateDetailPageUI(result, "success");
            } catch (error) {
              updateDetailPageUI(null, "error");
            }
          });
        }

        return;
      }
    } else {
      debugLog("使用缓存结果");
    }

    // 更新UI显示结果
    updateDetailPageUI(result, "success");
  }

  // ========== 主执行流程 ==========

  function init() {
    // 注入CSS样式（替代JS事件监听器，性能优化）
    injectStyles();

    // 检查缓存版本，如果不匹配则清理所有旧缓存
    const currentVersion = localStorage.getItem(CACHE_VERSION_KEY);
    if (currentVersion !== CACHE_VERSION) {
      debugLog(
        `缓存版本更新：${currentVersion} -> ${CACHE_VERSION}，清理旧缓存`,
      );
      // 清理所有旧缓存
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      // 更新版本号
      localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
    }

    const pageType = getPageType();
    if (pageType === "detail") {
      handleDetailPage();
    }
  }

  // 启动脚本
  init();
})();