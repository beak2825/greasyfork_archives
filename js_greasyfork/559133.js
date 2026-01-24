// ==UserScript==
// @name         豆瓣条目 NeoDB 评分增强
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在豆瓣条目页（书籍、电影、音乐、游戏）上添加 NeoDB.social 的评分展示（含条目链接）
// @match        https://book.douban.com/subject/*
// @match        https://movie.douban.com/subject/*
// @match        https://music.douban.com/subject/*
// @match        https://game.douban.com/subject/*
// @match        https://www.douban.com/game/*
// @icon         https://img3.doubanio.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      neodb.social
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559133/%E8%B1%86%E7%93%A3%E6%9D%A1%E7%9B%AE%20NeoDB%20%E8%AF%84%E5%88%86%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/559133/%E8%B1%86%E7%93%A3%E6%9D%A1%E7%9B%AE%20NeoDB%20%E8%AF%84%E5%88%86%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function log(...args) {
    console.log('[Douban-NeoDB]', ...args);
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 安全选择器：避免页面结构小幅变化时报错
   */
  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  /**
   * 返回当前条目类型：
   * - book / movie / music / game / unknown
   */
  function getEntryType() {
    const host = location.host;
    const path = location.pathname || '';

    // 子域名形式
    if (host.startsWith('book.')) return 'book';
    if (host.startsWith('movie.')) return 'movie';
    if (host.startsWith('music.')) return 'music';
    if (host.startsWith('game.')) return 'game';

    // 社区里的游戏条目，如：https://www.douban.com/game/35764203/
    if (host === 'www.douban.com' && path.startsWith('/game/')) return 'game';

    return 'unknown';
  }

  /**
   * 通用的标题获取
   */
  function getTitle() {
    const h1 = $('h1');
    if (!h1) return null;
    return h1.textContent.trim();
  }

  /**
   * 豆瓣条目 id（数字部分）
   * 例如 https://movie.douban.com/subject/1292052/ -> 1292052
   */
  function getDoubanId() {
    const match = location.pathname.match(/subject\/(\d+)/);
    return match ? match[1] : null;
  }

  /**
   * 解析豆瓣信息区域（书/电影/音乐/游戏结构略有不同，这里只抽取通用可用字段）
   */
  function parseInfoBlock() {
    const infoEl = $('#info');
    if (!infoEl) return {};

    const text = infoEl.textContent || '';
    const result = {};

    // ISBN（书籍）
    const isbnMatch = text.match(/ISBN:\s*([\dXx-]+)/);
    if (isbnMatch) result.isbn = isbnMatch[1].replace(/-/g, '');

    // 原作名（书/影视中可能出现）
    const originalTitleMatch = text.match(/原作名:\s*(.+)/);
    if (originalTitleMatch) {
      result.originalTitle = originalTitleMatch[1].trim();
    }

    // 导演 / 作者 / 表演者等，先简单取第一个人名字段
    // 为了可扩展，只抽象成 "mainCreator"
    const labels = Array.from(infoEl.querySelectorAll('span.pl'));
    const creatorSpan = labels.find((span) => {
      const t = span.textContent.trim();
      return (
        t.includes('作者') ||
        t.includes('导演') ||
        t.includes('表演者') ||
        t.includes('艺术家') ||
        t.includes('开发') ||
        t.includes('制作人')
      );
    });

    if (creatorSpan) {
      // 下一兄弟元素有可能是 <a>，也可能是文本节点
      const next = creatorSpan.nextElementSibling;
      if (next && next.tagName === 'A') {
        result.mainCreator = next.textContent.trim();
      } else if (creatorSpan.nextSibling) {
        result.mainCreator = creatorSpan.nextSibling.textContent.trim();
      }
    }

    return result;
  }

  /**
   * 聚合一个统一的条目描述对象，为所有平台提供同一输入结构
   */
  function buildUnifiedEntry() {
    const type = getEntryType();
    const doubanId = getDoubanId();
    const title = getTitle();
    const extra = parseInfoBlock();

    const unified = {
      type, // 'book' | 'movie' | 'music' | 'game' | 'unknown'
      doubanId,
      title,
      isbn: extra.isbn || null,
      originalTitle: extra.originalTitle || null,
      mainCreator: extra.mainCreator || null,
      // 备用字段：方便未来扩展
      _raw: {
        infoText: ($('#info') || {}).textContent || '',
      },
    };

    log('Parsed douban entry:', unified);
    return unified;
  }

  /**
   * 获取我们插入评分的目标容器
   * 目前豆瓣大部分条目都在 #interest_sectl 下展示评分
   */
  function getRatingContainer() {
    return $('#interest_sectl') || $('#wrapper');
  }

  function neodbCategoryFromType(type) {
    // NeoDB 的分类名与豆瓣略有不同，这里做一个简单映射
    switch (type) {
      case 'book':
        return 'book';
      case 'movie':
        return 'movie';
      case 'music':
        // NeoDB 上音乐条目通常使用 /album/ 路径，这里用 album 作为搜索分类
        return 'album';
      case 'game':
        return 'game';
      default:
        return 'all';
    }
  }

  /**
   * 从 NeoDB 搜索结果中找到最匹配的条目
   * 这里只做一个比较保守的匹配规则，后续你可以根据需要继续增强。
   */
  function findBestNeodbResult(doc, unifiedEntry, originalQuery) {
    const cards = doc.querySelectorAll('.entity-card, .catalog-card, .subject-card');
    if (!cards || cards.length === 0) {
      return null;
    }

    // 如果是用完整豆瓣 URL 搜索，NeoDB 一般会把最相关结果排在最前面，直接取第一个即可
    const isUrlQuery = typeof originalQuery === 'string' && /^https?:\/\//.test(originalQuery);
    if (isUrlQuery) {
      const firstCard = cards[0];
      const titleEl =
        firstCard.querySelector('.title a') ||
        firstCard.querySelector('.title') ||
        firstCard.querySelector('a');
      if (!titleEl) return null;
      return {
        element: firstCard,
        title: titleEl.textContent.trim(),
        link: titleEl.href || titleEl.getAttribute('href'),
      };
    }

    const clean = (str) =>
      (str || '')
        .toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fff]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const targetTitle = clean(unifiedEntry.title);
    const targetOriginal = clean(unifiedEntry.originalTitle);

    let best = null;
    let bestScore = 0;

    cards.forEach((card) => {
      const titleEl =
        card.querySelector('.title a') ||
        card.querySelector('.title') ||
        card.querySelector('a');
      if (!titleEl) return;

      const title = titleEl.textContent.trim();
      const titleClean = clean(title);

      let score = 0;
      if (titleClean === targetTitle) score += 5;
      else if (titleClean.includes(targetTitle) || targetTitle.includes(titleClean)) score += 3;

      if (targetOriginal) {
        if (titleClean === targetOriginal) score += 4;
        else if (titleClean.includes(targetOriginal) || targetOriginal.includes(titleClean)) {
          score += 2;
        }
      }

      // 未来可以再加作者 / 年份等字段参与打分

      if (score > bestScore) {
        bestScore = score;
        best = {
          element: card,
          title,
          link: titleEl.href || titleEl.getAttribute('href'),
        };
      }
    });

    return best;
  }

  /**
   * 解析 NeoDB 详情页上的评分与评分人数
   */
  function parseNeodbDetail(doc, url) {
    // 常见旧结构示例（可能随时间变化，这里尽量写宽松一些）：
    // <span class="rating-num">8.7</span>
    // <span class="rating-people">1234 人评价</span>
    // 新结构示例（你提供的实际 HTML，如书籍/专辑页面）：
    // <div class="display">
    //   <hgroup>
    //     <h3>8.8 <small>/ 10</small></h3>
    //     <p>45 ratings</p>
    //   </hgroup>
    // </div>
    // 无评分时：
    // <div class="undisplay">
    //   <span>No enough ratings</span>
    // </div>

    // 先检查是否有评分显示区域（.display），如果有，优先解析评分
    // 只有当没有 .display 且有 .undisplay 时，才认为无评分
    const displayBlock =
      doc.querySelector('#item-rating .display') ||
      doc.querySelector('.rating .display') ||
      doc.querySelector('section .display') ||
      doc.querySelector('.display');
    
    const undisplayEl = doc.querySelector('.undisplay');
    
    // 如果只有 .undisplay 且没有 .display，才认为无评分
    if (undisplayEl && !displayBlock) {
      const undisplayText = undisplayEl.textContent || '';
      if (/no\s+enough\s+ratings?/i.test(undisplayText)) {
        // 确实是无评分提示
        log('NeoDB: found "No enough ratings" hint and no display block');
        return { site: 'NeoDB', hasRating: false, url };
      }
    }
    
    // 如果有 .display 区域，即使也有 .undisplay，也优先尝试解析评分

    // 尝试多种方式查找评分元素
    let ratingEl =
      doc.querySelector('.rating-num') ||
      doc.querySelector('[itemprop="ratingValue"]') ||
      doc.querySelector('.rating > strong');

    // 如果以上都没找到，尝试匹配新的 h3 结构
    if (!ratingEl) {
      if (displayBlock) {
        ratingEl = displayBlock.querySelector('hgroup h3') || displayBlock.querySelector('h3');
      }
      // 再退一步，全局找一个"数字 + / 10"形式的元素
      if (!ratingEl) {
        ratingEl = Array.from(doc.querySelectorAll('h1,h2,h3,span,strong,div')).find((el) =>
          /[\d.]+\s*\/\s*10/.test(el.textContent)
        );
      }
    }

    // 如果还是找不到，尝试更宽松的匹配：任何包含数字评分格式的元素
    if (!ratingEl) {
      ratingEl = Array.from(doc.querySelectorAll('*')).find((el) => {
        const text = el.textContent || '';
        // 匹配 "8.8 / 10" 或 "8.8/10" 或单独的 "8.8"（在评分区域内）
        return /[\d.]+\s*\/\s*10/.test(text) || 
               (el.closest('#item-rating, .rating, section') && /^[\d.]+$/.test(text.trim()) && parseFloat(text.trim()) >= 0 && parseFloat(text.trim()) <= 10);
      });
    }

    if (!ratingEl) {
      log('NeoDB: rating element not found, URL:', url);
      // 找不到评分元素，但有条目 URL，返回"无评分"标记
      return { site: 'NeoDB', hasRating: false, url };
    }

    const ratingText = ratingEl.textContent.trim();
    const ratingMatch = ratingText.match(/[\d.]+/);
    if (!ratingMatch) {
      log('NeoDB: rating text found but no number match:', ratingText);
      return { site: 'NeoDB', hasRating: false, url };
    }

    const ratingValue = ratingMatch[0];
    log('NeoDB: found rating value:', ratingValue);

    let ratingCountEl =
      doc.querySelector('.rating-people') ||
      doc.querySelector('[itemprop="ratingCount"]') ||
      doc.querySelector('.rating-people-count');

    // 若旧结构未命中，尝试新的 <p>45 ratings</p> 结构
    if (!ratingCountEl) {
      if (displayBlock) {
        // 只在 rating 区域内找 p 文本包含 "rating"
        ratingCountEl = Array.from(displayBlock.querySelectorAll('p')).find((p) =>
          /ratings?/i.test(p.textContent)
        );
      }
      // 兜底：全局找含 "ratings" 的 p
      if (!ratingCountEl) {
        ratingCountEl = Array.from(doc.querySelectorAll('p')).find((p) =>
          /ratings?/i.test(p.textContent)
        );
      }
    }

    // 进一步兜底：全局搜索"XX 个评分 / 人评分 / ratings"
    if (!ratingCountEl) {
      ratingCountEl = Array.from(
        doc.querySelectorAll('p,span,div,small')
      ).find((el) => /(\d+)\s*(个评分|人评分|ratings?)/i.test(el.textContent));
    }

    let ratingCount = 'N/A';
    if (ratingCountEl) {
      const countMatch = ratingCountEl.textContent.replace(/,/g, '').match(/(\d+)/);
      if (countMatch) ratingCount = countMatch[1];
      log('NeoDB: found rating count:', ratingCount);
    } else {
      log('NeoDB: rating count element not found');
    }

    // 如果评分人数为 0，视为无有效评分
    if (ratingCount === '0' || ratingCount === 0) {
      log('NeoDB: rating count is 0, treating as no rating');
      return { site: 'NeoDB', hasRating: false, url };
    }

    log('NeoDB: successfully parsed rating:', ratingValue, 'count:', ratingCount);
    return {
      site: 'NeoDB',
      rating: ratingValue,
      ratingCount,
      url,
      hasRating: true,
    };
  }

  /**
   * 执行 NeoDB 搜索 + 详情解析
   */
  function fetchNeodbRating(unifiedEntry) {
    return new Promise((resolve) => {
      const primaryCategory = neodbCategoryFromType(unifiedEntry.type);
      const doubanUrl = window.location.href;

      // 先按 greasyfork 脚本的方式，用豆瓣完整 URL 搜索；
      // 如无结果，再回退到按标题搜索。
      const queries = [doubanUrl];
      if (unifiedEntry.title && unifiedEntry.title !== doubanUrl) {
        queries.push(unifiedEntry.title);
      }

      // 对于 movie 类型，如果主分类搜索失败，也尝试 tv 分类（因为豆瓣电影页可能包含剧集）
      const fallbackCategories = unifiedEntry.type === 'movie' ? ['tv', 'all'] : [];

      const trySearch = (queryIndex, categoryToUse = null, fallbackIndex = 0) => {
        // 如果所有查询都试完了
        if (queryIndex >= queries.length) {
          // 如果还有备用分类，尝试下一个备用分类
          if (fallbackIndex < fallbackCategories.length) {
            return trySearch(0, fallbackCategories[fallbackIndex], fallbackIndex + 1);
          }
          return resolve(null);
        }

        const query = queries[queryIndex];
        const currentCategory = categoryToUse || primaryCategory;
        const searchUrl =
          'https://neodb.social/search?' +
          new URLSearchParams({
            q: query,
            category: currentCategory,
          }).toString();

        log('Requesting NeoDB search:', searchUrl);

        GM_xmlhttpRequest({
          method: 'GET',
          url: searchUrl,
          onload: (resp) => {
            try {
              if (resp.status < 200 || resp.status >= 300) {
                log('NeoDB search failed, status:', resp.status);
                return trySearch(queryIndex + 1, categoryToUse, fallbackIndex);
              }

              const parser = new DOMParser();
              const doc = parser.parseFromString(resp.responseText, 'text/html');

              // 情况一：搜索直接被重定向到具体条目详情页（常见于用豆瓣 URL 搜索时）
              const finalUrl = resp.finalUrl || searchUrl;
              const directMatch = /https?:\/\/neodb\.social\/(book|movie|album|music|game|tv\/season)\//.test(
                finalUrl
              );
              if (directMatch) {
                log('NeoDB search redirected directly to entity page:', finalUrl);
                const parsed = parseNeodbDetail(doc, finalUrl);
                if (parsed) {
                  // parsed 可能是 { hasRating: false, url } 或 { hasRating: true, rating, ratingCount, url }
                  return resolve(parsed);
                }
                // 如果 parseNeodbDetail 返回 null（理论上不应该发生，但作为兜底）
                log('NeoDB entity page parse returned null, fallback to link-only result');
                return resolve({
                  site: 'NeoDB',
                  hasRating: false,
                  url: finalUrl,
                });
              }

              // 情况二：正常的搜索列表页
              const best = findBestNeodbResult(doc, unifiedEntry, query);
              if (!best || !best.link) {
                log('NeoDB: no suitable search result on query:', query);
                return trySearch(queryIndex + 1, categoryToUse, fallbackIndex);
              }

              const detailUrl = best.link.startsWith('http')
                ? best.link
                : 'https://neodb.social' + best.link;
              log('NeoDB best match from search list:', best.title, detailUrl);

              // 再请求详情页
              GM_xmlhttpRequest({
                method: 'GET',
                url: detailUrl,
                onload: (detailResp) => {
                  try {
                    if (detailResp.status < 200 || detailResp.status >= 300) {
                      log('NeoDB detail failed, status:', detailResp.status);
                      return trySearch(queryIndex + 1, categoryToUse, fallbackIndex);
                    }
                    const dDoc = parser.parseFromString(detailResp.responseText, 'text/html');
                    const parsed = parseNeodbDetail(dDoc, detailUrl);
                    if (!parsed) {
                      // 如果 parseNeodbDetail 返回 null（理论上不应该发生，但作为兜底）
                      log('NeoDB detail: parse returned null, fallback to link-only result');
                      return resolve({
                        site: 'NeoDB',
                        hasRating: false,
                        url: detailUrl,
                      });
                    }
                    // parsed 可能是 { hasRating: false, url } 或 { hasRating: true, rating, ratingCount, url }
                    resolve(parsed);
                  } catch (e) {
                    console.error('[Douban-NeoDB] NeoDB detail parse error', e);
                    trySearch(queryIndex + 1, categoryToUse, fallbackIndex);
                  }
                },
                onerror: () => {
                  log('NeoDB detail request error');
                  trySearch(queryIndex + 1, categoryToUse, fallbackIndex);
                },
              });
            } catch (e) {
              console.error('[Douban-NeoDB] NeoDB search parse error', e);
              trySearch(queryIndex + 1, categoryToUse, fallbackIndex);
            }
          },
          onerror: () => {
            log('NeoDB search request error');
            trySearch(queryIndex + 1, categoryToUse, fallbackIndex);
          },
        });
      };

      trySearch(0);
    });
  }

  /**
   * ===============================
   * UI 层：在豆瓣页面上插入评分区域
   * ===============================
   */

  function ensureBaseStyles() {
    if (document.getElementById('douban-neodb-rating-style')) return;
    const style = document.createElement('style');
    style.id = 'douban-neodb-rating-style';
    style.textContent = `
      .douban-thirdparty-rating {
        display: block;
        margin-top: 4px;
        font-size: 12px;
      }
      .douban-thirdparty-rating .rating-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }
      .douban-thirdparty-rating .rating-site {
        color: #37a;
        text-decoration: none;
        border-radius: 3px;
        padding: 1px 3px;
        transition: color 0.3s ease, background-color 0.3s ease;
      }
      .douban-thirdparty-rating .rating-site:hover {
        color: #fff;
        background-color: #37a;
      }
      .douban-thirdparty-rating .rating-value {
        font-weight: bold;
        color: #333;
      }
      .douban-thirdparty-rating[data-tooltip] {
        position: relative;
      }
      .douban-thirdparty-rating[data-tooltip]:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 0;
        background-color: #333;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 9999;
        margin-bottom: 4px;
      }
      .douban-thirdparty-rating.loading {
        color: #999;
      }
    `;
    document.head.appendChild(style);
  }

  function insertLoadingIndicator(container) {
    const span = document.createElement('span');
    span.id = 'douban-neodb-rating-loading';
    span.className = 'douban-thirdparty-rating loading';
    span.textContent = 'NeoDB 评分加载中...';
    container.appendChild(span);
    return span;
  }

  function removeLoadingIndicator() {
    const el = document.getElementById('douban-neodb-rating-loading');
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  function addRatingRow(result) {
    if (!result) return;
    const container = getRatingContainer();
    if (!container) return;

    const span = document.createElement('span');
    span.className = 'douban-thirdparty-rating';

    // 检查是否有有效评分（优先使用 hasRating 标记，如果没有则检查 rating 字段）
    const hasRating =
      result.hasRating !== undefined
        ? result.hasRating
        : result.rating !== null && result.rating !== undefined && result.rating !== '';
    const ratingText = hasRating ? result.rating : '暂无评分';
    const hasCount = hasRating && result.ratingCount && result.ratingCount !== 'N/A' && result.ratingCount !== '0';

    const tooltip = hasRating
      ? `${result.site}：${result.rating}/10，${result.ratingCount} 人评价`
      : `${result.site}：暂无评分`;
    span.setAttribute('data-tooltip', tooltip);

    const countPart = hasCount
      ? `<span class="rating-count">(${result.ratingCount} 人评价)</span>`
      : '';

    span.innerHTML = `
      <span class="rating-row">
        <a href="${result.url}" target="_blank" class="rating-site">${result.site}</a>
        <span class="rating-value">${ratingText}</span>
        ${countPart}
      </span>
    `;

    container.appendChild(span);
  }

  /**
   * ===============================
   * 初始化与主流程
   * ===============================
   */

  async function init() {
    try {
      // 排除非条目页面（如豆列、图片等子页面）
      const pathname = location.pathname || '';
      const excludedPaths = ['/doulists', '/photos', '/discussion', '/reviews', '/comments', '/questions'];
      if (excludedPaths.some((path) => pathname.includes(path))) {
        log('Excluded path, abort:', pathname);
        return;
      }

      ensureBaseStyles();

      const container = getRatingContainer();
      if (!container) {
        log('No rating container found, abort.');
        return;
      }

      const unifiedEntry = buildUnifiedEntry();
      if (!unifiedEntry.title) {
        log('No title parsed, abort.');
        return;
      }

      const loadingEl = insertLoadingIndicator(container);

      // 目前只调用 NeoDB，将来可在此处扩展更多平台：
      // const results = await Promise.all([
      //   fetchNeodbRating(unifiedEntry),
      //   fetchOtherPlatform(unifiedEntry),
      //   ...
      // ]);
      const neodbResult = await fetchNeodbRating(unifiedEntry);

      if (loadingEl && loadingEl.parentNode) {
        loadingEl.parentNode.removeChild(loadingEl);
      }

      if (!neodbResult) {
        const fail = document.createElement('span');
        fail.className = 'douban-thirdparty-rating';
        fail.textContent = '暂未查到 NeoDB 评分';
        container.appendChild(fail);
        return;
      }

      addRatingRow(neodbResult);
    } catch (e) {
      console.error('[Douban-NeoDB] init error', e);
    }
  }

  // 等待页面基本加载完成后再执行
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      // 再稍微等一下，确保 #interest_sectl 出现
      delay(300).then(init);
    });
  } else {
    delay(300).then(init);
  }
})();


