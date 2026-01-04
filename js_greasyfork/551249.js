// ==UserScript==
// @name         Discourse 双站内联合流（linux.do ←→ idcflare）
// @namespace    https://example.com/userscripts
// @version      4.5.0
// @description  在 L 站刷帖时把 IF 论坛的话题无缝融入（反之亦然）；后台预加载，智能去重，完美融合
// @match        *://linux.do/*
// @match        *://www.linux.do/*
// @match        *://idcflare.com/*
// @match        *://www.idcflare.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      linux.do
// @connect      idcflare.com
// @downloadURL https://update.greasyfork.org/scripts/551249/Discourse%20%E5%8F%8C%E7%AB%99%E5%86%85%E8%81%94%E5%90%88%E6%B5%81%EF%BC%88linuxdo%20%E2%86%90%E2%86%92%20idcflare%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551249/Discourse%20%E5%8F%8C%E7%AB%99%E5%86%85%E8%81%94%E5%90%88%E6%B5%81%EF%BC%88linuxdo%20%E2%86%90%E2%86%92%20idcflare%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /******************************************************************
   * 配置
   ******************************************************************/
  const CFG = {
    logLevel: "info",
    maxMergeOnce: 40,
    fetchTimeoutMs: 15000,
    perTargetRetries: 3,
    backoffBase: 700,
    backoffFactor: 1.8,
    jitter: true,
    preloadDelayMs: 2000,
    backgroundRefreshInterval: 60000, // 60秒后台刷新一次
    sourcePillText: {
      "linux.do": "L",
      "idcflare.com": "IF",
    },
  };

  /******************************************************************
   * 轻量日志
   ******************************************************************/
  const LEVELS = ["debug", "info", "warn", "error"];
  const logBuf = [];
  const pushLog = (level, msg, extra) => {
    if (CFG.logLevel === "none") return;
    const li = LEVELS.indexOf(level);
    const min = LEVELS.indexOf(CFG.logLevel);
    if (li < min) return;
    const item = { t: Date.now(), level, msg, extra };
    logBuf.push(item);
    if (logBuf.length > 500) logBuf.shift();
    const tag = "%c[InlineMerge]";
    const style =
      level === "debug"
        ? "color:#9aa"
        : level === "info"
        ? "color:#39c"
        : level === "warn"
        ? "color:#d85"
        : "color:#e33";
    console[level === "debug" ? "log" : level](tag, style, msg, extra || "");
    window.__InlineMergeLogs = logBuf;
  };
  const log = {
    debug: (m, e) => pushLog("debug", m, e),
    info: (m, e) => pushLog("info", m, e),
    warn: (m, e) => pushLog("warn", m, e),
    error: (m, e) => pushLog("error", m, e),
  };

  /******************************************************************
   * 站点判定与对端映射
   ******************************************************************/
  const HOST = location.hostname.replace(/^www\./, "");
  const IS_LINUXDO = HOST.includes("linux.do");
  const IS_IDCFLARE = HOST.includes("idcflare.com");
  const OTHER = IS_LINUXDO ? "idcflare.com" : IS_IDCFLARE ? "linux.do" : null;

  if (!OTHER) {
    log.warn("非目标站点，退出");
    return;
  }

  /******************************************************************
   * 路径检测
   ******************************************************************/
  function isLatestPage() {
    const path = location.pathname;
    return path === '/' || path === '/latest' || path.startsWith('/latest/');
  }

  /******************************************************************
   * 全局状态
   ******************************************************************/
  let cachedData = null;
  let cachedItems = { normal: [], pinned: [] };
  let isInitialized = false;
  let mergeInProgress = false;
  let backgroundRefreshTimer = null;
  let templateCache = null;

  /******************************************************************
   * 小工具
   ******************************************************************/
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const backoff = (n) => {
    let d = CFG.backoffBase * Math.pow(CFG.backoffFactor, n);
    if (CFG.jitter) d = d * (0.7 + Math.random() * 0.6);
    return d;
  };

  function getListContainer() {
    return document.querySelector(".latest-topic-list, .topic-list tbody, .topic-list-body");
  }

  function getItemTemplate() {
    // 优先使用缓存的模板
    if (templateCache) {
      return templateCache.cloneNode(true);
    }

    const candidate = document.querySelector(
      ".topic-list-item:not([data-inline-merge]), tr.topic-list-item:not([data-inline-merge])"
    );
    if (!candidate) return null;

    const tpl = candidate.cloneNode(true);

    // 清理数据属性
    delete tpl.dataset.topicId;
    tpl.removeAttribute("id");
    tpl.removeAttribute("data-topic-id");

    // 缓存模板
    templateCache = tpl.cloneNode(true);

    return tpl;
  }

  /******************************************************************
   * 抓取对端数据
   ******************************************************************/
  async function fetchLatest(host, attempt = 0) {
    const url = `https://${host}/latest.json?order=activity&ascending=false`;
    log.info("抓取对端数据", url);
    try {
      const text = await gmGet(url, CFG.fetchTimeoutMs);
      const json = JSON.parse(text);
      cachedData = json;
      return json;
    } catch (e) {
      if (attempt + 1 < CFG.perTargetRetries) {
        const d = backoff(attempt);
        log.warn(`抓取失败，${Math.round(d)}ms 后重试 #${attempt + 1}`, e);
        await sleep(d);
        return fetchLatest(host, attempt + 1);
      }
      log.error("抓取失败（已达最大重试）", e);
      return null;
    }
  }

  function gmGet(url, timeout) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout,
        onload: (res) => {
          if (res.status >= 200 && res.status < 400) resolve(res.responseText);
          else reject(new Error("HTTP_" + res.status));
        },
        ontimeout: () => reject(new Error("TIMEOUT")),
        onerror: (e) => reject(new Error("NETWORK")),
      });
    });
  }

  /******************************************************************
   * 构建 DOM 节点 - 完全重写，精确匹配原始结构
   ******************************************************************/
  function buildItemsFromLatest(json, template, sourceHost) {
    if (!json || !json.topic_list || !Array.isArray(json.topic_list.topics)) {
      return { normal: [], pinned: [] };
    }
    const topics = json.topic_list.topics.slice(0, CFG.maxMergeOnce);

    const usersById = new Map();
    (json.users || []).forEach((u) => usersById.set(u.id, u));

    const normalItems = [];
    const pinnedItems = [];

    for (const t of topics) {
      // 每次都重新克隆模板
      const node = template.cloneNode(true);

      // 清理所有数据属性
      node.removeAttribute('data-topic-id');
      node.removeAttribute('id');

      const isPinned = t.pinned === true || t.pinned_globally === true;

      // === 1. 设置 topic-id 和标记 ===
      node.dataset.topicId = t.id;
      node.dataset.inlineMerge = "1";
      node.dataset.inlineOrigin = sourceHost;
      node.dataset.inlineTopicId = `${sourceHost}-${t.id}`;

      const ts = t.last_posted_at || t.bumped_at || t.created_at;
      node.dataset.inlineActivity = new Date(ts).getTime().toString();

      if (isPinned) {
        node.dataset.inlinePinned = "true";
        node.classList.add("pinned");
      } else {
        node.classList.remove("pinned");
      }

      // === 2. 处理主标题区域 (main-link) ===
      const mainLink = node.querySelector('td.main-link');
      if (mainLink) {
        // 2.1 处理顶部标题行
        const linkTopLine = mainLink.querySelector('.link-top-line');
        if (linkTopLine) {
          // 清理话题状态图标
          const statusesSpan = linkTopLine.querySelector('.topic-statuses');
          if (statusesSpan) {
            statusesSpan.innerHTML = '';

            // 如果是置顶话题，添加置顶图标
            if (isPinned) {
              const pinLink = document.createElement('a');
              pinLink.href = '';
              pinLink.className = 'topic-status pinned pin-toggle-button';
              pinLink.title = '此话题已置顶';
              pinLink.innerHTML = '<svg class="fa d-icon d-icon-thumbtack svg-icon svg-string" aria-hidden="true"><use href="#thumbtack"></use></svg>';
              statusesSpan.appendChild(pinLink);
            }
          }

          // 替换标题链接
          const titleLink = linkTopLine.querySelector('a.title, a.raw-topic-link');
          if (titleLink) {
            const href = `https://${sourceHost}/t/${t.slug}/${t.id}`;
            titleLink.href = href;
            titleLink.target = "_blank";
            titleLink.dataset.topicId = t.id;

            // 清空并重建标题内容
            const titleSpan = titleLink.querySelector('span[dir="auto"]') || titleLink;
            if (titleSpan.tagName === 'SPAN') {
              titleSpan.innerHTML = '';
              if (t.fancy_title) {
                titleSpan.innerHTML = t.fancy_title;
              } else {
                titleSpan.textContent = t.title || "(无标题)";
              }
            } else {
              titleLink.innerHTML = '';
              const newSpan = document.createElement('span');
              newSpan.dir = 'auto';
              if (t.fancy_title) {
                newSpan.innerHTML = t.fancy_title;
              } else {
                newSpan.textContent = t.title || "(无标题)";
              }
              titleLink.appendChild(newSpan);
            }
          }

          // 清理徽章区域（未读帖子数等）
          const badgeSpan = linkTopLine.querySelector('.topic-post-badges');
          if (badgeSpan) {
            badgeSpan.remove();
          }
        }

        // 2.2 处理底部信息行 (分类、标签)
        const linkBottomLine = mainLink.querySelector('.link-bottom-line');
        if (linkBottomLine) {
          // 移除原有分类徽章
          const oldCategory = linkBottomLine.querySelector('.badge-category__wrapper');
          if (oldCategory) {
            oldCategory.remove();
          }

          // 处理标签区域
          let tagsDiv = linkBottomLine.querySelector('.discourse-tags');
          if (!tagsDiv) {
            tagsDiv = document.createElement('div');
            tagsDiv.className = 'discourse-tags';
            tagsDiv.setAttribute('role', 'list');
            tagsDiv.setAttribute('aria-label', '标签');
            linkBottomLine.appendChild(tagsDiv);
          }

          // 完全清空标签
          tagsDiv.innerHTML = '';

          // 添加真实标签
          if (t.tags && t.tags.length > 0) {
            t.tags.slice(0, 3).forEach(tagName => {
              const tagLink = document.createElement('a');
              tagLink.href = `https://${sourceHost}/tag/${tagName}`;
              tagLink.target = '_blank';
              tagLink.dataset.tagName = tagName;
              tagLink.className = 'discourse-tag box';
              tagLink.textContent = tagName;
              tagsDiv.appendChild(tagLink);
            });
          }

          // 添加来源标记
          const sourcePill = document.createElement('span');
          sourcePill.className = 'discourse-tag simple inline-merge-source';
          sourcePill.textContent = CFG.sourcePillText[sourceHost];
          sourcePill.title = `来自 ${sourceHost}`;
          sourcePill.style.cssText = `
            opacity: 0.6;
            font-size: 0.857em;
            margin-left: 5px;
            cursor: default;
            background: var(--tertiary-low);
            color: var(--tertiary);
          `;
          tagsDiv.appendChild(sourcePill);
        }
      }

      // === 3. 重建活动者头像 (posters) ===
      const postersTd = node.querySelector('td.posters');
      if (postersTd) {
        postersTd.innerHTML = '';

        const posters = t.posters || [];
        posters.slice(0, 5).forEach((poster, idx) => {
          const user = usersById.get(poster.user_id);
          if (!user) return;

          const avatarUrl = user.avatar_template
            ? `https://${sourceHost}${user.avatar_template.replace("{size}", "72")}`
            : null;

          if (avatarUrl) {
            const avatarLink = document.createElement('a');
            avatarLink.href = `https://${sourceHost}/u/${user.username}`;
            avatarLink.target = '_blank';
            avatarLink.dataset.userCard = user.username;
            avatarLink.setAttribute('aria-label', `${user.username} 的个人资料`);

            // 最后一个头像添加 latest 类
            if (idx === posters.length - 1) {
              avatarLink.className = 'latest';
            }

            const avatarImg = document.createElement('img');
            avatarImg.src = avatarUrl;
            avatarImg.className = idx === posters.length - 1 ? 'avatar latest' : 'avatar';
            avatarImg.alt = '';
            avatarImg.width = 24;
            avatarImg.height = 24;
            avatarImg.title = user.username;

            avatarLink.appendChild(avatarImg);
            postersTd.appendChild(avatarLink);
          }
        });
      }

      // === 4. 设置回复数 ===
      const replies = typeof t.posts_count === "number"
        ? Math.max(0, t.posts_count - 1)
        : (t.reply_count ?? 0);

      const postsCell = node.querySelector('td.posts-map, td.num.posts');
      if (postsCell) {
        const badgeLink = postsCell.querySelector('a.badge-posts') || postsCell.querySelector('a');
        if (badgeLink) {
          badgeLink.href = `https://${sourceHost}/t/${t.slug}/${t.id}/1`;
          badgeLink.target = '_blank';
          badgeLink.setAttribute('aria-label', `${replies} 条回复，跳转到第一个帖子`);

          const numberSpan = badgeLink.querySelector('.number');
          if (numberSpan) {
            numberSpan.textContent = replies.toString();
          }
        }
      }

      // === 5. 设置浏览数 ===
      const views = t.views || 0;
      const viewsCell = node.querySelector('td.views');
      if (viewsCell) {
        const numberSpan = viewsCell.querySelector('.number');
        if (numberSpan) {
          numberSpan.textContent = formatNumber(views);
          numberSpan.title = `此话题已被浏览 ${views.toLocaleString()} 次`;
        }
      }

      // === 6. 设置活动时间 ===
      const activityCell = node.querySelector('td.activity, td.post-activity');
      if (activityCell) {
        const activityLink = activityCell.querySelector('a.post-activity') || activityCell.querySelector('a');
        if (activityLink) {
          activityLink.href = `https://${sourceHost}/t/${t.slug}/${t.id}/last`;
          activityLink.target = '_blank';

          const dateSpan = activityLink.querySelector('.relative-date');
          if (dateSpan) {
            dateSpan.textContent = formatRelative(ts);
            dateSpan.dataset.time = new Date(ts).getTime().toString();
            dateSpan.dataset.format = 'tiny';
          }

          // 设置 title
          const createdDate = new Date(t.created_at).toLocaleString('zh-CN');
          const lastDate = new Date(ts).toLocaleString('zh-CN');
          activityCell.title = `创建日期：${createdDate}\n最新：${lastDate}`;
        }
      }

      // === 7. 添加到对应列表 ===
      if (isPinned) {
        pinnedItems.push(node);
      } else {
        normalItems.push(node);
      }
    }

    log.debug(`构建完成: ${pinnedItems.length} 置顶 + ${normalItems.length} 普通`);
    return { normal: normalItems, pinned: pinnedItems };
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  }

  function formatRelative(iso) {
    const t = new Date(iso).getTime();
    if (!t || Number.isNaN(t)) return "";
    const s = Math.floor((Date.now() - t) / 1000);
    if (s < 60) return "刚刚";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}分钟`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}小时`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}天`;
    const M = Math.floor(d / 30);
    if (M < 12) return `${M}个月`;
    const y = Math.floor(M / 12);
    return `${y}年`;
  }

  /******************************************************************
   * 合并逻辑
   ******************************************************************/
  function mergeItems(items) {
    if (!isLatestPage()) {
      log.debug("非 /latest 页面，跳过合并");
      return;
    }

    if (mergeInProgress) {
      log.debug("合并进行中，跳过");
      return;
    }

    mergeInProgress = true;

    try {
      const container = getListContainer();
      if (!container) {
        log.warn("未找到列表容器");
        return;
      }

      const nativeItems = Array.from(
        container.querySelectorAll(".topic-list-item:not([data-inline-merge]), tr.topic-list-item:not([data-inline-merge])")
      );

      const existingTopicIds = new Set();
      for (const el of nativeItems) {
        const topicId = el.dataset.topicId || el.getAttribute('data-topic-id');
        if (topicId) {
          existingTopicIds.add(`${HOST}-${topicId}`);
        }
      }

      const validPinned = items.pinned.filter(n => {
        const key = n.dataset.inlineTopicId;
        return key && !existingTopicIds.has(key);
      });

      const validNormal = items.normal.filter(n => {
        const key = n.dataset.inlineTopicId;
        return key && !existingTopicIds.has(key);
      });

      if (!validPinned.length && !validNormal.length) {
        log.debug("没有新的外站条目需要插入");
        return;
      }

      const nativePinned = nativeItems.filter(el =>
        el.classList.contains("pinned") || el.querySelector(".topic-statuses .d-icon-thumbtack")
      );
      const nativeNormal = nativeItems.filter(el => !nativePinned.includes(el));

      const allPinned = [...nativePinned, ...validPinned];
      const allNormal = [...nativeNormal, ...validNormal];

      const sortByActivity = (A, B) => {
        const ta = parseInt(A.dataset.inlineActivity || "0", 10) || readActivityFromDOM(A) || 0;
        const tb = parseInt(B.dataset.inlineActivity || "0", 10) || readActivityFromDOM(B) || 0;
        return tb - ta;
      };

      allPinned.sort(sortByActivity);
      allNormal.sort(sortByActivity);

      const fragment = document.createDocumentFragment();
      [...allPinned, ...allNormal].forEach(el => fragment.appendChild(el));

      container.innerHTML = '';
      container.appendChild(fragment);

      log.info(`✓ 已合并 ${validPinned.length} 置顶 + ${validNormal.length} 普通话题（来自 ${OTHER}）`);
    } finally {
      mergeInProgress = false;
    }
  }

  function readActivityFromDOM(el) {
    const dateSpan = el.querySelector(".relative-date");
    if (dateSpan && dateSpan.dataset.time) {
      return parseInt(dateSpan.dataset.time, 10);
    }

    const timeLink = el.querySelector(".post-activity a, .activity a");
    if (!timeLink) return 0;
    const title = timeLink.getAttribute("title") || el.getAttribute("title") || "";

    // 尝试解析 "最新：2025 年 10月 1 日 13:33" 格式
    const match = title.match(/最新[：:]\s*(.+)/);
    if (match) {
      const ms = Date.parse(match[1]);
      return Number.isNaN(ms) ? 0 : ms;
    }

    return 0;
  }

  /******************************************************************
   * 后台刷新
   ******************************************************************/
  async function backgroundRefresh() {
    if (!isLatestPage()) {
      log.debug("非 /latest 页面，跳过后台刷新");
      return;
    }

    log.info("🔄 执行后台刷新...");

    const tpl = getItemTemplate();
    if (!tpl) {
      log.warn("后台刷新：未能获取模板");
      return;
    }

    const data = await fetchLatest(OTHER);
    if (!data) {
      log.warn("后台刷新：获取数据失败");
      return;
    }

    cachedItems = buildItemsFromLatest(data, tpl, OTHER);
    log.info(`✓ 后台刷新完成，更新了 ${cachedItems.pinned.length + cachedItems.normal.length} 条话题`);

    // 如果在 latest 页面，立即合并
    if (isLatestPage()) {
      mergeItems(cachedItems);
    }
  }

  function startBackgroundRefresh() {
    if (backgroundRefreshTimer) {
      clearInterval(backgroundRefreshTimer);
    }

    backgroundRefreshTimer = setInterval(() => {
      backgroundRefresh();
    }, CFG.backgroundRefreshInterval);

    log.info(`✓ 后台刷新已启动，间隔 ${CFG.backgroundRefreshInterval / 1000}秒`);
  }

  /******************************************************************
   * 初始化
   ******************************************************************/
  async function initialize() {
    if (isInitialized) return;

    // 只在 /latest 页面初始化
    if (!isLatestPage()) {
      log.debug("非 /latest 页面，跳过初始化");
      return;
    }

    isInitialized = true;

    log.info("🚀 开始初始化，后台预加载对端数据...");

    await waitForList();
    await sleep(CFG.preloadDelayMs);

    const tpl = getItemTemplate();
    if (!tpl) {
      log.warn("未能获取模板，稍后重试");
      isInitialized = false;
      setTimeout(initialize, 3000);
      return;
    }

    const data = await fetchLatest(OTHER);
    if (!data) {
      log.error("预加载失败");
      isInitialized = false;
      return;
    }

    cachedItems = buildItemsFromLatest(data, tpl, OTHER);
    log.info(`✓ 预加载完成，缓存了 ${cachedItems.pinned.length + cachedItems.normal.length} 条话题`);

    mergeItems(cachedItems);
    watchRouteChange();
    startBackgroundRefresh();
  }

  function watchRouteChange() {
    let lastUrl = location.href;
    let lastWasLatest = isLatestPage();

    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        const nowIsLatest = isLatestPage();

        log.debug(`路由变化：${nowIsLatest ? '进入' : '离开'} /latest`);

        // 从非 latest 页面进入 latest 页面
        if (nowIsLatest && !lastWasLatest) {
          if (!isInitialized) {
            setTimeout(initialize, 500);
          } else if (cachedItems.normal.length || cachedItems.pinned.length) {
            setTimeout(() => mergeItems(cachedItems), 500);
          }
        }

        lastWasLatest = nowIsLatest;
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  async function waitForList() {
    const t0 = Date.now();
    while (!getListContainer()) {
      await sleep(200);
      if (Date.now() - t0 > 15000) {
        log.warn("等待列表容器超时");
        break;
      }
    }
    log.info("列表容器就绪");
  }

  /******************************************************************
   * 启动
   ******************************************************************/
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
