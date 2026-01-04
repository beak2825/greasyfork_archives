// ==UserScript==
// @name         B站用户助手: 合集按时间排序并播放
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  B站视频页面合集支持按投稿时间排序, 添加到收藏夹并播放
// @author       月离
// @match        https://www.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @connect      api.bilibili.com
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554606/B%E7%AB%99%E7%94%A8%E6%88%B7%E5%8A%A9%E6%89%8B%3A%20%E5%90%88%E9%9B%86%E6%8C%89%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F%E5%B9%B6%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/554606/B%E7%AB%99%E7%94%A8%E6%88%B7%E5%8A%A9%E6%89%8B%3A%20%E5%90%88%E9%9B%86%E6%8C%89%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F%E5%B9%B6%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("B站用户助手脚本已加载");

  // 添加自定义样式
  const style = document.createElement("style");
  style.textContent = `
        .season-favorite-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            margin-left: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .season-favorite-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
        }

        .season-favorite-btn:active {
            transform: translateY(0);
        }

        .season-favorite-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .season-favorite-btn .icon {
            font-size: 16px;
        }
    `;
  document.head.appendChild(style);

  // BV/AV 互转常量
  const XOR_CODE = 23442827791579;
  const MAX_CODE = 2251799813685247;
  const CHARTS = "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf";
  const PAUL_NUM = 58;

  // 字符串交换函数
  function swapString(s, x, y) {
    const chars = s.split("");
    [chars[x], chars[y]] = [chars[y], chars[x]];
    return chars.join("");
  }

  // BVID 转 AVID
  function bvidToAvid(bvid) {
    let s = swapString(swapString(bvid, 3, 9), 4, 7);
    const bv1 = s.slice(3);
    let temp = 0;

    for (const c of bv1) {
      const idx = CHARTS.indexOf(c);
      if (idx === -1) return null;
      temp = temp * PAUL_NUM + idx;
    }

    return (temp & MAX_CODE) ^ XOR_CODE;
  }

  // AVID 转 BVID
  function avidToBvid(avid) {
    const arr = ["B", "V", "1", "", "", "", "", "", "", "", "", ""];
    let bvIdx = arr.length - 1;
    let temp = (avid | (MAX_CODE + 1)) ^ XOR_CODE;

    while (temp > 0) {
      const idx = temp % PAUL_NUM;
      arr[bvIdx] = CHARTS[idx];
      temp = Math.floor(temp / PAUL_NUM);
      if (bvIdx === 0) break;
      bvIdx--;
    }

    const raw = arr.join("");
    return swapString(swapString(raw, 3, 9), 4, 7);
  }

  // 从 URL 提取 AV 或 BV 号
  function extractVideoId() {
    const url = location.href;

    const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) {
      const bvid = bvMatch[0];
      const avid = bvidToAvid(bvid);
      console.log("提取到 BVID:", bvid, "转换为 AVID:", avid);
      return { type: "bv", bvid, avid };
    }

    const avMatch = url.match(/av(\d+)/i) || url.match(/\/video\/(\d+)/);
    if (avMatch) {
      const avid = parseInt(avMatch[1]);
      const bvid = avidToBvid(avid);
      console.log("提取到 AVID:", avid, "转换为 BVID:", bvid);
      return { type: "av", avid, bvid };
    }

    return null;
  }

  // 获取视频详细信息
  function getVideoInfo(videoId) {
    return new Promise((resolve, reject) => {
      const params =
        videoId.type === "bv" ? `bvid=${videoId.bvid}` : `aid=${videoId.avid}`;

      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.bilibili.com/x/web-interface/view?${params}`,
        onload: function (res) {
          try {
            const data = JSON.parse(res.responseText);
            if (data.code === 0 && data.data) {
              resolve(data.data);
            } else {
              reject(`获取视频信息失败: ${data.message}`);
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject,
      });
    });
  }

  // 获取合集的所有视频
  function getSeasonEpisodes(videoInfo) {
    if (!videoInfo.ugc_season || !videoInfo.ugc_season.sections) {
      return null;
    }

    const ugcSeason = videoInfo.ugc_season;
    const allEpisodes = [];

    for (const section of ugcSeason.sections) {
      if (section.episodes && section.episodes.length > 0) {
        allEpisodes.push(...section.episodes);
      }
    }

    return {
      seasonId: ugcSeason.id,
      title: ugcSeason.title,
      episodes: allEpisodes,
      sections: ugcSeason.sections,
    };
  }

  // 按投稿时间排序
  function sortEpisodesByTime(episodes, ascending = true) {
    return episodes.slice().sort((a, b) => {
      const timeA = a.arc?.ctime || 0;
      const timeB = b.arc?.ctime || 0;
      return ascending ? timeA - timeB : timeB - timeA;
    });
  }

  // 格式化时间戳
  function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // 获取 CSRF Token
  function getCsrf() {
    const match = document.cookie.match(/bili_jct=([0-9a-f]+)/);
    return match ? match[1] : "";
  }

  // 创建收藏夹
  function createFolder(title, intro = "") {
    return new Promise((resolve, reject) => {
      const csrf = getCsrf();
      if (!csrf) {
        reject("未获取到 CSRF Token，请确保已登录");
        return;
      }

      const formData = new URLSearchParams({
        title: "播放列表:" + title,
        intro: intro,
        privacy: "1", // 1：私密
        csrf: csrf,
      });

      GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.bilibili.com/x/v3/fav/folder/add",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData.toString(),
        onload: function (res) {
          try {
            const data = JSON.parse(res.responseText);
            console.log("创建收藏夹返回:", data);
            if (data.code === 0 && data.data) {
              resolve(data.data);
            } else {
              reject(`创建收藏夹失败: ${data.message}`);
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject,
      });
    });
  }

  // 收藏单个视频
  function favoriteVideo(aid, mediaId) {
    return new Promise((resolve, reject) => {
      const csrf = getCsrf();
      if (!csrf) {
        reject("未获取到 CSRF Token");
        return;
      }

      const formData = new URLSearchParams({
        rid: aid.toString(),
        type: "2",
        add_media_ids: mediaId.toString(),
        csrf: csrf,
        platform: "web",
        eab_x: "1",
        ga: "1",
      });

      GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.bilibili.com/x/v3/fav/resource/deal",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData.toString(),
        onload: function (res) {
          try {
            const data = JSON.parse(res.responseText);
            if (data.code === 0) {
              resolve(data);
            } else {
              reject(`收藏失败: ${data.message}`);
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject,
      });
    });
  }

  // 延迟函数
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 批量收藏视频
  async function batchFavorite(episodes, folderTitle, updateButtonText) {
    try {
      // 1. 创建收藏夹
      console.log(`正在创建收藏夹: ${folderTitle}`);
      updateButtonText("创建收藏夹中...");
      const folder = await createFolder(folderTitle, "按投稿时间排序的合集");
      console.log("收藏夹创建成功，ID:", folder.id);

      const mediaId = folder.id;

      // 2. 按投稿时间排序(降序 - 新的在前)
      const sortedEpisodes = sortEpisodesByTime(episodes, false);
      const totalVideos = sortedEpisodes.length;

      console.log(`开始收藏 ${totalVideos} 个视频(新→旧顺序)...`);

      // 3. 逐个收藏视频
      for (let i = 0; i < totalVideos; i++) {
        const ep = sortedEpisodes[i];
        const remainingTime = ((totalVideos - i - 1) * 0.1).toFixed(1);

        updateButtonText(
          `收藏中 ${i + 1}/${totalVideos} (剩余${remainingTime}s)`
        );

        try {
          await favoriteVideo(ep.aid, mediaId);
          console.log(`✓ [${i + 1}/${totalVideos}] ${ep.title}`);
        } catch (error) {
          console.error(`✗ [${i + 1}/${totalVideos}] ${ep.title}`, error);
        }

        // 每个视频间隔0.1秒
        if (i < totalVideos - 1) {
          await delay(100);
        }
      }

      console.log(
        "收藏完成！跳转到:",
        `https://www.bilibili.com/list/ml${mediaId}`
      );
      updateButtonText("收藏完成，即将跳转...");

      // 跳转到收藏夹播放页面
      await delay(500);
      window.location.href = `https://www.bilibili.com/list/ml${mediaId}`;
    } catch (error) {
      console.error("批量收藏失败:", error);
      throw error;
    }
  }

  // 创建收藏按钮
  function createFavoriteButton(seasonData) {
    const btn = document.createElement("button");
    btn.className = "season-favorite-btn";
    btn.innerHTML =
      '<span class="icon">⭐</span><span>按时间收藏合集并播放</span>';

    btn.onclick = async () => {
      if (btn.disabled) return;

      btn.disabled = true;

      const updateButtonText = (text) => {
        btn.innerHTML = `<span class="icon">⏳</span><span>${text}</span>`;
      };

      try {
        await batchFavorite(
          seasonData.episodes,
          seasonData.title,
          updateButtonText
        );
      } catch (error) {
        console.error("收藏失败:", error);
        btn.innerHTML = `<span class="icon">✗</span><span>收藏失败: ${error}</span>`;
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML =
            '<span class="icon">⭐</span><span>按时间收藏合集</span>';
        }, 3000);
      }
    };

    return btn;
  }

  // 插入按钮到页面
  function insertButton(seasonData) {
    const container = document.querySelector(
      "#viewbox_report > div.video-info-title > div"
    );
    if (!container) {
      return false;
    }

    if (container.querySelector(".season-favorite-btn")) {
      return true;
    }

    const btn = createFavoriteButton(seasonData);
    container.appendChild(btn);
    console.log("收藏按钮已添加");
    return true;
  }

  // 等待元素并插入按钮
  function waitAndInsertButton(seasonData, maxRetries = 20) {
    let retries = 0;
    const checkInterval = setInterval(() => {
      if (insertButton(seasonData) || retries >= maxRetries) {
        clearInterval(checkInterval);
      }
      retries++;
    }, 500);
  }

  // 初始化
  async function init() {
    console.log("当前页面:", location.href);

    const videoId = extractVideoId();
    if (!videoId) {
      console.log("未能提取到视频 ID");
      return;
    }

    try {
      const videoInfo = await getVideoInfo(videoId);

      if (videoInfo.ugc_season) {
        const seasonData = getSeasonEpisodes(videoInfo);
        if (seasonData) {
          console.log(
            `合集: ${seasonData.title} (${seasonData.episodes.length} 个视频)`
          );

          const sortedEpisodes = sortEpisodesByTime(seasonData.episodes, false);
          console.log("按投稿时间排序(新→旧):");
          sortedEpisodes.forEach((ep, index) => {
            const ctime = formatTime(ep.arc?.ctime || 0);
            console.log(`  ${index + 1}. [${ctime}] ${ep.title}`);
          });

          waitAndInsertButton(seasonData);
        }
      } else {
        console.log("该视频不在任何合集中");
      }
    } catch (error) {
      console.error("初始化失败:", error);
    }
  }

  // 页面加载完成后执行
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // 监听 URL 变化（SPA 路由）
  let currentUrl = location.href;

  window.addEventListener("popstate", () => {
    if (currentUrl !== location.href) {
      currentUrl = location.href;
      setTimeout(init, 500);
    }
  });

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    if (currentUrl !== location.href) {
      currentUrl = location.href;
      setTimeout(init, 500);
    }
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    if (currentUrl !== location.href) {
      currentUrl = location.href;
      setTimeout(init, 500);
    }
  };
})();
