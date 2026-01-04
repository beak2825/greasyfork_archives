// ==UserScript==
// @name         B站UP助手: 合集按时间排序
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  B 站合集支持按投稿时间排序（升序/降序）
// @author       月离
// @match        https://member.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @connect      member.bilibili.com
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553727/B%E7%AB%99UP%E5%8A%A9%E6%89%8B%3A%20%E5%90%88%E9%9B%86%E6%8C%89%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/553727/B%E7%AB%99UP%E5%8A%A9%E6%89%8B%3A%20%E5%90%88%E9%9B%86%E6%8C%89%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

// 来源：https://greasyfork.org/zh-CN/scripts/553727

(function () {
  ("use strict");

  // 添加自定义样式
  const style = document.createElement("style");
  style.textContent = `
        .custom-sort-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            margin-left: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            position: relative;
        }

        .custom-sort-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
        }

        .custom-sort-btn:active {
            transform: translateY(0);
        }

        .custom-sort-btn.desc {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
        }

        .custom-sort-btn.desc:hover {
            box-shadow: 0 4px 12px rgba(245, 87, 108, 0.5);
        }

        .custom-sort-btn.asc {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
        }

        .custom-sort-btn.asc:hover {
            box-shadow: 0 4px 12px rgba(79, 172, 254, 0.5);
        }

        .sort-icon {
            font-size: 14px;
            font-weight: bold;
        }

        /* Tooltip 样式 */
        .custom-sort-btn::before {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 110%;
            left: 50%;
            transform: translateX(-50%);
            padding: 6px 10px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            font-size: 12px;
            border-radius: 4px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1000;
        }

        .custom-sort-btn::after {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: rgba(0, 0, 0, 0.85);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1000;
        }

        .custom-sort-btn:hover::before,
        .custom-sort-btn:hover::after {
            opacity: 1;
        }
    `;
  document.head.appendChild(style);

  // 用 Set 记录已处理的合集
  let processedSeasons = new Set();

  // 记录当前 URL
  let currentUrl = location.href;

  // MutationObserver 实例
  let observer = null;

  function getCsrf() {
    const match = document.cookie.match(/bili_jct=([0-9a-f]+)/);
    return match ? match[1] : "";
  }

  // 获取合集的 sections
  function getSeasonSections(seasonId) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://member.bilibili.com/x2/creative/web/season?id=${seasonId}`,
        onload: function (res) {
          try {
            const data = JSON.parse(res.responseText);
            if (data.code === 0 && data.data.sections) {
              resolve(data.data.sections.sections);
            } else {
              reject("获取 sections 失败");
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject,
      });
    });
  }

  // 获取 section 的 episodes
  function getSectionEpisodes(sectionId) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://member.bilibili.com/x2/creative/web/season/section?id=${sectionId}`,
        onload: function (res) {
          try {
            const data = JSON.parse(res.responseText);
            if (data.code === 0) {
              resolve({
                section: data.data.section,
                episodes: data.data.episodes,
              });
            } else {
              reject("获取 episodes 失败");
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject,
      });
    });
  }

  // 执行排序
  async function sortSeason(seasonId, sectionId, isDescending) {
    const csrf = getCsrf();
    if (!csrf) {
      alert("未获取到 CSRF Token");
      return;
    }

    try {
      console.log(
        "开始排序，seasonId:",
        seasonId,
        "sectionId:",
        sectionId,
        "降序:",
        isDescending
      );

      // 获取 section 信息和 episodes
      const { section, episodes } = await getSectionEpisodes(sectionId);
      console.log("获取到的 episodes:", episodes);

      if (!episodes || episodes.length === 0) {
        alert("该合集没有视频");
        return;
      }

      // 按 id 排序
      // 降序: id 大的在前 (旧视频在前)
      // 升序: id 小的在前 (新视频在前)
      const sorted = episodes.slice().sort((a, b) => {
        return isDescending ? a.id - b.id : b.id - a.id;
      });
      const sorts = sorted.map((ep, index) => ({
        id: ep.id,
        sort: index + 1,
      }));

      const requestData = {
        section: {
          id: section.id,
          type: section.type,
          seasonId: section.seasonId,
          title: section.title,
        },
        sorts: sorts,
      };

      console.log("准备发送排序请求:", requestData);

      GM_xmlhttpRequest({
        method: "POST",
        url: `https://member.bilibili.com/x2/creative/web/season/section/edit?csrf=${csrf}`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(requestData),
        onload: function (res) {
          console.log("排序请求返回:", res.responseText);
          const result = JSON.parse(res.responseText);
          if (result.code === 0) {
            alert("排序成功！刷新页面查看");
            location.reload();
          } else {
            alert("排序失败: " + result.message);
          }
        },
        onerror: function (err) {
          console.error("请求出错:", err);
          alert("请求失败，请查看控制台");
        },
      });
    } catch (error) {
      console.error("排序过程出错:", error);
      alert("排序失败: " + error);
    }
  }

  // 创建排序按钮
  function createSortButton(text, icon, className, tooltip, onClick) {
    const btn = document.createElement("button");
    btn.className = `custom-sort-btn ${className}`;
    btn.setAttribute("data-tooltip", tooltip);
    btn.innerHTML = `<span class="sort-icon">${icon}</span><span>${text}</span>`;
    btn.onclick = onClick;
    return btn;
  }

  // 插入按钮
  async function insertButtons() {
    const cards = document.querySelectorAll(".ep-list-card");
    console.log("找到的卡片数量:", cards.length);

    for (const card of cards) {
      // 从 card 的 id 获取 seasonId (格式: ep-list-xxxxx)
      const seasonId = card.id ? card.id.replace("ep-list-", "") : null;
      if (!seasonId) continue;

      const operator = card.querySelector(".ep-list-card-operator");
      if (!operator) continue;

      // 三重检查机制
      // 1. 检查 DOM 标记
      if (operator.hasAttribute("data-sort-buttons-added")) {
        continue;
      }

      // 2. 检查是否已有按钮
      if (operator.querySelector(".custom-sort-btn")) {
        operator.setAttribute("data-sort-buttons-added", "true");
        processedSeasons.add(seasonId);
        continue;
      }

      // 3. 检查是否正在处理
      if (processedSeasons.has(seasonId)) {
        continue;
      }

      console.log("处理合集 seasonId:", seasonId);

      // 立即标记为已处理(在异步操作前)
      processedSeasons.add(seasonId);
      operator.setAttribute("data-sort-buttons-added", "true");

      try {
        // 获取 sections
        const sections = await getSeasonSections(seasonId);
        if (!sections || sections.length === 0) {
          // 如果没有 sections,移除标记
          operator.removeAttribute("data-sort-buttons-added");
          processedSeasons.delete(seasonId);
          continue;
        }

        // 通常第一个 section 就是正片
        const sectionId = sections[0].id;

        // 创建降序按钮（新的在最前面）
        const btnDesc = createSortButton(
          "降序",
          "↓",
          "desc",
          "新的在最前面",
          () => sortSeason(seasonId, sectionId, true)
        );

        // 创建升序按钮（旧的在最前面）
        const btnAsc = createSortButton(
          "升序",
          "↑",
          "asc",
          "旧的在最前面",
          () => sortSeason(seasonId, sectionId, false)
        );

        operator.appendChild(btnDesc);
        operator.appendChild(btnAsc);
        console.log("按钮已添加到合集:", seasonId);
      } catch (error) {
        console.error("处理合集失败:", seasonId, error);
        // 如果失败,移除标记,下次可以重试
        operator.removeAttribute("data-sort-buttons-added");
        processedSeasons.delete(seasonId);
      }
    }
  }

  // 等待元素
  function waitForElement(selector, callback, maxWait = 10000) {
    const startTime = Date.now();
    const checkExist = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(checkExist);
        console.log("找到目标元素:", selector);
        callback();
      } else if (Date.now() - startTime > maxWait) {
        clearInterval(checkExist);
        console.log("等待元素超时:", selector);
      }
    }, 200);
  }

  // 清理旧的 observer
  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
      console.log("MutationObserver 已停止");
    }
  }

  // 初始化
  function init() {
    console.log("开始初始化, URL:", location.href);

    // 清理旧的 observer
    cleanup();

    // 清空已处理的合集记录
    processedSeasons.clear();

    waitForElement(".ep-list-card", () => {
      insertButtons();

      // 监听动态加载,使用防抖
      let debounceTimer = null;
      observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          insertButtons();
        }, 500); // 500ms 防抖
      });
      observer.observe(document.body, { childList: true, subtree: true });
      console.log("MutationObserver 已启动");
    });
  }

  // 监听 URL 变化（SPA 路由）
  function watchUrlChange() {
    // 方法 1: 监听 popstate 事件（浏览器前进后退）
    window.addEventListener("popstate", () => {
      if (currentUrl !== location.href) {
        console.log("URL 变化 (popstate):", currentUrl, "->", location.href);
        currentUrl = location.href;
        setTimeout(init, 500); // 延迟执行，等待页面渲染
      }
    });

    // 方法 2: 劫持 pushState 和 replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      if (currentUrl !== location.href) {
        console.log("URL 变化 (pushState):", currentUrl, "->", location.href);
        currentUrl = location.href;
        setTimeout(init, 500);
      }
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      if (currentUrl !== location.href) {
        console.log(
          "URL 变化 (replaceState):",
          currentUrl,
          "->",
          location.href
        );
        currentUrl = location.href;
        setTimeout(init, 500);
      }
    };
  }

  // 启动
  init();
  watchUrlChange();
})();
