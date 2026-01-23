// ==UserScript==
// @name         ヤフコメ ユーザー評価表示
// @namespace    https://github.com/zszushi/YahooCommentRatio
// @version      2.0
// @description  Yahoo!ニュースのコメント欄にユーザーの評価(共感した/なるほど/うーん)を表示
// @author       zszushi, Google Antigravity
// @match        https://news.yahoo.co.jp/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      news.yahoo.co.jp
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563665/%E3%83%A4%E3%83%95%E3%82%B3%E3%83%A1%20%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E8%A9%95%E4%BE%A1%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/563665/%E3%83%A4%E3%83%95%E3%82%B3%E3%83%A1%20%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E8%A9%95%E4%BE%A1%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const defaultSettings = {
    showSympathized: true,
    showUnderstood: true,
    showHmm: true,
    showPercentage: true,
    showBar: true,
    showCommentCount: true,
    barHeight: 3,
    barWidth: 60,
    enableCache: true,
    fetchInterval: 30000,
    initialDelay: 100,
    showTotal: false,
    compactMode: false,
    enableHideComments: false,
    hideThreshold: 40,
    hideMinTotal: 10,
    enableRateLimit: true,
    rateLimitDelay: 1000,
    // エキスパート用設定
    showExpertHelpful: true,
    showExpertCommentCount: true,
    showExpertArticleCount: true,
    enableBackgroundColor: true,
    bgColorBasis: "account", // "account" or "comment"
    roundTotal: false,
    hideBasis: "account", // "account", "comment", or "either"
    enableTurboMode: false,
    showCommentBar: true, // コメント本体への評価バー表示
    showCommentBar: true, // コメント本体への評価バー表示
  };

  /**
   * 評価実績から比率と色を計算する
   */
  function calculateRating(pos, neg) {
    const total = pos + neg;
    const rate = total > 0 ? Math.round((pos / total) * 100) : -1;
    let color = "#ccc";
    if (rate >= 0) {
      if (rate >= 50) {
        const ratio = (rate - 50) / 50;
        const r = Math.round(255 - (255 - 76) * ratio);
        const g = Math.round(193 + (175 - 193) * ratio);
        const b = Math.round(7 + (80 - 7) * ratio);
        color = `rgb(${r}, ${g}, ${b})`;
      } else {
        const ratio = rate / 50;
        const r = 244;
        const g = Math.round(67 + (193 - 67) * ratio);
        const b = Math.round(54 + (7 - 54) * ratio);
        color = `rgb(${r}, ${g}, ${b})`;
      }
    }
    return { rate, color };
  }

  /**
   * 評価バーの要素を作成する
   */
  function createBarElement(rate, color, height = "4px", margin = "0") {
    const container = document.createElement("div");
    container.style.cssText = `height: ${height}; background: #eee; margin: ${margin}; border-radius: ${parseInt(height) / 2}px; overflow: hidden; width: 100%; border: 1px solid #e0e0e0;`;
    const bar = document.createElement("div");
    bar.style.cssText = `height: 100%; width: ${rate}%; background: ${color}; transition: width 0.5s;`;
    container.appendChild(bar);
    return container;
  }


  let settings = { ...defaultSettings };
  let updateInterval = null; // eslint-disable-line no-unused-vars
  let hasUnsavedChanges = false;
  const userRatingsCache = new Map();
  const processedElements = new Set();
  const fetchQueue = [];
  let isFetching = false;

  function loadSettings() {
    Object.keys(defaultSettings).forEach((key) => {
      const value = GM_getValue(key);
      if (value !== undefined) {
        settings[key] = value;
      }
    });
  }

  function saveSettings() {
    Object.keys(settings).forEach((key) => {
      GM_setValue(key, settings[key]);
    });
  }

  function exportSettings() {
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yahoo-rating-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importSettings() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          Object.keys(defaultSettings).forEach((key) => {
            if (imported[key] !== undefined) {
              settings[key] = imported[key];
            }
          });
          saveSettings();
          alert("設定をインポートしました。ページを再読み込みします。");
          location.reload();
        } catch (err) {
          alert("設定ファイルの読み込みに失敗しました: " + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function parseNumber(text) {
    const match = text.match(/([\d.]+)万/);
    if (match) {
      return Math.round(parseFloat(match[1]) * 10000);
    }
    return parseInt(text.replace(/,/g, ""));
  }

  function formatNumber(num, keepManjuIfParsed = false) {
    if (keepManjuIfParsed && num >= 10000) {
      return (num / 10000).toFixed(1) + "万";
    }
    return num.toLocaleString("ja-JP");
  }

  async function processFetchQueue() {
    if (isFetching || fetchQueue.length === 0) return;

    isFetching = true;

    while (fetchQueue.length > 0) {
      const { userId, resolve } = fetchQueue.shift();

      try {
        let result;
        if (userId.startsWith("expert_")) {
          const actualUserId = userId.replace("expert_", "");
          result = await fetchExpertRatingInternal(actualUserId);
        } else {
          result = await fetchUserRatingInternal(userId);
        }
        resolve(result);
      } catch (err) {
        resolve({
          sympathized: 0,
          understood: 0,
          hmm: 0,
          commentCount: 0,
          articleCount: 0,
          isExpert: userId.startsWith("expert_"),
          helpfulCount: 0,
        });
      }

      if (settings.enableRateLimit && fetchQueue.length > 0 && !settings.enableTurboMode) {
        await new Promise((r) => setTimeout(r, settings.rateLimitDelay));
      }
    }

    isFetching = false;
  }

  async function fetchUserRating(userId) {
    if (settings.enableCache && userRatingsCache.has(userId)) {
      return userRatingsCache.get(userId);
    }

    return new Promise((resolve) => {
      fetchQueue.push({ userId, resolve });
      processFetchQueue();
    });
  }

  async function fetchExpertRating(userId) {
    const cacheKey = `expert_${userId}`;
    if (settings.enableCache && userRatingsCache.has(cacheKey)) {
      return userRatingsCache.get(cacheKey);
    }

    return new Promise((resolve) => {
      fetchQueue.push({ userId: cacheKey, resolve });
      processFetchQueue();
    });
  }

  async function fetchUserRatingInternal(userId) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://news.yahoo.co.jp/users/${userId}`,
        onload: function (response) {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(
              response.responseText,
              "text/html",
            );

            const ratings = {
              sympathized: 0,
              understood: 0,
              hmm: 0,
              commentCount: 0,
              isExpert: false,
              helpfulCount: 0,
            };

            const statsText = doc.body.textContent;

            // より柔軟なパース (ラベルと数値の間の空白を許容)
            const findMatch = (pattern) => {
              const m = statsText.match(pattern);
              return m ? parseNumber(m[1]) : 0;
            };

            ratings.sympathized = findMatch(/共感した\s*([\d.万,]+)/);
            ratings.understood = findMatch(/なるほど\s*([\d.万,]+)/);
            ratings.hmm = findMatch(/うーん\s*([\d.万,]+)/);
            ratings.commentCount = findMatch(/投稿コメント\s*([\d.万,]+)/);

            // フォールバック: window.__PRELOADED_STATE__ から取得 (モバイル等でDOMが異なる場合用)
            if (ratings.sympathized === 0) {
              const scriptText = Array.from(doc.querySelectorAll('script')).find(s => s.innerText.includes('__PRELOADED_STATE__'))?.innerText;
              if (scriptText) {
                try {
                  const jsonMatch = scriptText.match(/window\.__PRELOADED_STATE__\s*=\s*(\{[\s\S]*?\});/);
                  if (jsonMatch) {
                    const state = JSON.parse(jsonMatch[1]);
                    const detail = state.profileDetail;
                    if (detail) {
                      ratings.sympathized = detail.totalEmpathyCount || 0;
                      ratings.understood = detail.totalGoodCount || 0;
                      ratings.hmm = detail.totalBadCount || 0;
                      ratings.commentCount = detail.totalCommentCount || 0;
                    }
                  }
                } catch (e) { }
              }
            }

            if (settings.enableCache) {
              userRatingsCache.set(userId, ratings);
            }
            resolve(ratings);
          } catch (e) {
            resolve({ sympathized: 0, understood: 0, hmm: 0, commentCount: 0, isExpert: false });
          }
        },
        onerror: function () {
          resolve({ sympathized: 0, understood: 0, hmm: 0, commentCount: 0, isExpert: false });
        },
      });
    });
  }

  async function fetchExpertRatingInternal(userId) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://news.yahoo.co.jp/profile/commentator/${userId}`,
        onload: function (response) {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(
              response.responseText,
              "text/html",
            );

            const ratings = {
              sympathized: 0,
              understood: 0,
              hmm: 0,
              commentCount: 0,
              articleCount: 0,
              isExpert: true,
              helpfulCount: 0,
            };

            const statsText = doc.body.textContent;

            // 参考になったを取得 (DOMセレクタを優先)
            const helpfulElement = doc.querySelector('span[class*="bmUQoP"], .sc-livk2j-2') ||
              Array.from(doc.querySelectorAll('span')).find(el => el.textContent.includes('参考になった'))?.nextElementSibling;
            if (helpfulElement) {
              ratings.helpfulCount = parseNumber(helpfulElement.textContent);
            } else {
              const helpfulMatch = statsText.match(/参考になった([\d.万,]+)/);
              if (helpfulMatch) ratings.helpfulCount = parseNumber(helpfulMatch[1]);
            }

            // コメント数を取得
            const commentElement = doc.querySelector('a[href*="/comments"] span:last-child') ||
              doc.querySelector('a[href*="expert"] span:nth-child(2)') ||
              Array.from(doc.querySelectorAll('span')).find(el => el.textContent === 'コメント')?.nextElementSibling;
            if (commentElement) {
              ratings.commentCount = parseNumber(commentElement.textContent);
            } else {
              const commentCountMatch = statsText.match(/コメント([\d.万,]+)/);
              if (commentCountMatch) ratings.commentCount = parseNumber(commentCountMatch[1]);
            }

            // 記事数を取得
            const articleElement = doc.querySelector('a[href*="/articles"] span:last-child');
            if (articleElement) {
              ratings.articleCount = parseNumber(articleElement.textContent);
            } else {
              const articleCountMatch = statsText.match(/記事([\d.万,]+)/);
              if (articleCountMatch) ratings.articleCount = parseNumber(articleCountMatch[1]);
            }

            if (settings.enableCache) {
              userRatingsCache.set(`expert_${userId}`, ratings);
            }
            resolve(ratings);
          } catch (e) {
            resolve({ sympathized: 0, understood: 0, hmm: 0, commentCount: 0, articleCount: 0, isExpert: true, helpfulCount: 0 });
          }
        },
        onerror: function () {
          resolve({ sympathized: 0, understood: 0, hmm: 0, commentCount: 0, articleCount: 0, isExpert: true, helpfulCount: 0 });
        },
      });
    });
  }

  function getCommentBackgroundColor(rate) {
    if (rate >= 60) return "rgba(40, 167, 69, 0.08)";
    if (rate >= 40) return "rgba(255, 193, 7, 0.08)";
    return "rgba(220, 53, 69, 0.08)";
  }

  function shouldHideComment(ratings, commentStats) {
    if (!settings.enableHideComments) return false;

    const isBelowThreshold = (stats) => {
      if (!stats) return false;
      const positive = stats.sympathized + (stats.understood || 0);
      const negative = stats.hmm;
      const total = positive + negative;

      if (total === 0 || total < settings.hideMinTotal) return false;
      const positiveRate = Math.round((positive / total) * 100);
      return positiveRate < settings.hideThreshold;
    };

    const accountStats = {
      sympathized: ratings.sympathized,
      understood: ratings.understood,
      hmm: ratings.hmm
    };

    const accountBelow = isBelowThreshold(accountStats);
    const commentBelow = isBelowThreshold(commentStats);

    if (settings.hideBasis === "account") return accountBelow;
    if (settings.hideBasis === "comment") return commentBelow;
    if (settings.hideBasis === "either") return accountBelow || commentBelow;

    return false;
  }

  function createRatingBadge(ratings) {
    const container = document.createElement("span");
    container.style.cssText = `
            display: inline-block;
            margin-left: 8px;
            vertical-align: middle;
        `;
    container.className = "yahoo-user-rating-badge";

    const positive = ratings.sympathized + ratings.understood;
    const negative = ratings.hmm;
    const total = ratings.isExpert ? ratings.helpfulCount : positive + negative;

    const { rate: positiveRate, color: ratingColor } = calculateRating(positive, negative);

    if (positiveRate === -1 && (!ratings.isExpert || ratings.commentCount === 0)) {
      const noRatingSpan = document.createElement("span");
      noRatingSpan.style.cssText = `
                font-size: ${settings.compactMode ? "10px" : "11px"};
                color: #999;
                padding: ${settings.compactMode ? "1px 4px" : "2px 6px"};
                background: #fafafa;
                border-radius: 4px;
                border: 1px solid #e8e8e8;
            `;
      noRatingSpan.textContent = "- 評価なし";
      container.appendChild(noRatingSpan);
      return container;
    }

    const parts = [];

    if (ratings.isExpert) {
      if (settings.showExpertHelpful)
        parts.push(`💡${formatNumber(ratings.helpfulCount, false)}`);
      if (settings.showExpertArticleCount)
        parts.push(`📰${formatNumber(ratings.articleCount, false)}`);
      if (settings.showExpertCommentCount)
        parts.push(`💬${formatNumber(ratings.commentCount, false)}`);
    } else {
      if (settings.showSympathized)
        parts.push(`👍${formatNumber(ratings.sympathized, true)}`);
      if (settings.showUnderstood)
        parts.push(`💡${formatNumber(ratings.understood, true)}`);
      if (settings.showHmm) parts.push(`👎${formatNumber(ratings.hmm, true)}`);
      if (settings.showCommentCount)
        parts.push(`💬${formatNumber(ratings.commentCount, true)}`);
    }

    if (settings.showTotal && !ratings.isExpert) {
      parts.push(`計${formatNumber(total, settings.roundTotal)}`);
    }
    if (settings.showPercentage && !ratings.isExpert) {
      parts.push(`${positiveRate}%`);
    }

    const textSpan = document.createElement("span");
    textSpan.style.cssText = `
            font-size: ${settings.compactMode ? "10px" : "11px"};
            color: #666;
            white-space: nowrap;
        `;
    textSpan.textContent = parts.join(" ");

    const wrapper = document.createElement("span");
    const bgColor = ratings.isExpert ? "#e3f2fd" : "#f5f5f5";
    const borderColor = ratings.isExpert ? "#90caf9" : "#e0e0e0";

    wrapper.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 2px;
            padding: ${settings.compactMode ? "1px 4px" : "2px 6px"};
            background: ${bgColor};
            border-radius: 4px;
            border: 1px solid ${borderColor};
        `;

    wrapper.appendChild(textSpan);

    if (settings.showBar && !ratings.isExpert) {
      const bar = createBarElement(positiveRate, ratingColor, `${settings.barHeight}px`, "0 0 0 4px");
      bar.style.width = `${settings.barWidth}px`;
      bar.style.display = "inline-block";
      bar.style.verticalAlign = "middle";
      wrapper.appendChild(bar);
    }

    container.appendChild(wrapper);
    return container;
  }

  function getIndividualCommentRating(commentElement) {
    if (!commentElement) return { sympathized: 0, hmm: 0, total: 0, time: 0 };

    // 投稿時間の取得 (ソート用)
    const timeLink = commentElement.querySelector('a[href*="comments"]');
    const timeText = timeLink ? timeLink.textContent : commentElement.innerText.match(/(\d+[^ ]+前|昨日|202\d[^\s]*)/)?.[0] || "";

    /**
     * 時間文字列を数値(分)に変換してソート可能にする
     */
    const parseTimeToMinutes = (str) => {
      if (!str) return 9999999;
      let match;
      if (match = str.match(/(\d+)秒前/)) return parseInt(match[1]) / 60;
      if (match = str.match(/(\d+)分前/)) return parseInt(match[1]);
      if (match = str.match(/(\d+)時間前/)) return parseInt(match[1]) * 60;
      if (str.includes("昨日")) return 1440;
      if (match = str.match(/(\d+)日前/)) return parseInt(match[1]) * 1440;

      // 「1/23(金) 12:34」や「2024/1/23」などの形式
      if (match = str.match(/(\d+)\/(\d+)\(.\)\s+(\d+):(\d+)/)) {
        return parseInt(match[1]) * 43200 + parseInt(match[2]) * 1440 + parseInt(match[3]) * 60 + parseInt(match[4]);
      }
      if (match = str.match(/(\d{4})\/(\d+)\/(\d+)/)) {
        return (parseInt(match[1]) - 2000) * 525600 + parseInt(match[2]) * 43200 + parseInt(match[3]) * 1440;
      }

      return 9999999;
    };
    const timeVal = parseTimeToMinutes(timeText);

    // ボタンの特定 (テキスト内容に基づく)
    const buttons = Array.from(commentElement.querySelectorAll("button"));
    const findBtn = (text) => buttons.find(b => b.innerText.includes(text));

    const agreeBtn = findBtn("共感した");
    const disagreeBtn = findBtn("うーん");

    const extract = (btn) => {
      if (!btn) return 0;
      // 数値が含まれる可能性がある要素を探索 (最後の数値を優先)
      const spans = Array.from(btn.querySelectorAll("span"));
      for (let i = spans.length - 1; i >= 0; i--) {
        const val = parseNumber(spans[i].textContent);
        if (!isNaN(val) && val > 0) return val;
      }
      const topVal = parseNumber(btn.textContent);
      return isNaN(topVal) ? 0 : topVal;
    };

    const sympathized = extract(agreeBtn);
    const hmm = extract(disagreeBtn);

    return {
      sympathized,
      hmm,
      total: sympathized + hmm,
      time: timeVal
    };
  }

  /**
   * 背景色を直ちに反映させる（リロードを伴わない設定変更時）
   */
  function applySettingsLive() {
    const badges = document.querySelectorAll(".yahoo-user-rating-badge");
    badges.forEach((b) => b.remove());

    const commentBars = document.querySelectorAll(".yahoo-comment-rating-bar-container");
    commentBars.forEach((b) => b.remove());

    const comments = document.querySelectorAll(
      'article, [class*="CommentItem"], [class*="CommentReply"]',
    );
    comments.forEach((c) => {
      c.style.backgroundColor = "";
      delete c.dataset.accountRatio;
      delete c.dataset.commentRatio;
      delete c.dataset.postTime;
    });

    processedElements.clear();
    findAndProcessUserLinks();
  }

  /**
   * 設定変更時に保存ボタンの状態を更新する
   */
  function markUnsavedChanges(panel, needsReload = false) {
    hasUnsavedChanges = true;
    if (needsReload) panel.dataset.needsReload = "true";

    const saveButton = panel.querySelector("#settings-save");
    if (saveButton) {
      if (panel.dataset.needsReload === "true") {
        saveButton.textContent = "保存して再読み込み";
        saveButton.style.background = "#d32f2f";
      } else {
        saveButton.textContent = "保存";
        saveButton.style.background = "#0078d4";
      }
    }
  }

  function createSettingsPanel() {
    const panel = document.createElement("div");
    panel.id = "yahoo-rating-settings-panel";

    const isMobile = window.innerWidth <= 768;
    panel.style.cssText = `
            display: none;
            position: fixed;
            top: ${isMobile ? "0" : "50%"};
            left: ${isMobile ? "0" : "50%"};
            transform: ${isMobile ? "none" : "translate(-50%, -50%)"};
            background: white;
            border: 1px solid #ccc;
            border-radius: ${isMobile ? "0" : "8px"};
            padding: ${isMobile ? "15px" : "20px"};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            width: ${isMobile ? "100%" : "auto"};
            min-width: ${isMobile ? "auto" : "400px"};
            max-width: ${isMobile ? "100%" : "500px"};
            height: ${isMobile ? "100%" : "auto"};
            max-height: ${isMobile ? "100%" : "80vh"};
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;

    panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333;">スクリプト設定</h3>

            <div style="margin-bottom: 15px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #555;">一般コメントの表示設定</h4>
                <div style="font-size: 11px; color: #856404; margin-bottom: 8px; padding: 6px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
                    ⚠️ 下3つの指標は、数が1万以上の場合、Yahoo!の表示仕様により「n万」のようになるため正確な数値を取得できません。
                </div>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-sympathized" ${settings.showSympathized ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">👍 共感した</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-understood" ${settings.showUnderstood ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">💡 なるほど</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-hmm" ${settings.showHmm ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">👎 うーん</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-comment-count" ${settings.showCommentCount ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">💬 コメント数</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-total" ${settings.showTotal ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">アカウント全体の評価(合計)</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; margin-left: 20px; cursor: pointer;">
                    <input type="checkbox" id="setting-round-total" ${settings.roundTotal ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">合計数を「n万」で丸める</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-percentage" ${settings.showPercentage ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">評価率(%)</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-bar" ${settings.showBar ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">評価バー</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-comment-bar" ${settings.showCommentBar ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">個別コメントの下に評価バーを表示</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-bg-color" ${settings.enableBackgroundColor ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">評価比に応じて背景色を変更</span>
                </label>
                <div style="margin-left: 20px; margin-bottom: 8px; font-size: 13px;">
                    背景色の判定基準:
                    <select id="setting-bg-basis" style="margin-left: 4px; padding: 2px;">
                        <option value="account" ${settings.bgColorBasis === "account" ? "selected" : ""}>アカウントの全実績</option>
                        <option value="comment" ${settings.bgColorBasis === "comment" ? "selected" : ""}>そのコメントの評価</option>
                    </select>
                </div>
            </div>

            <div style="margin-bottom: 15px; padding-top: 10px; border-top: 1px solid #eee;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #555;">エキスパート表示設定</h4>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-expert-helpful" ${settings.showExpertHelpful ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">💡 参考になった</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-expert-comment-count" ${settings.showExpertCommentCount ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">💬 コメント数</span>
                </label>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-expert-article-count" ${settings.showExpertArticleCount ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">📰 記事数</span>
                </label>
            </div>

            <div style="margin-bottom: 15px; padding-top: 10px; border-top: 1px solid #eee;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #555;">コメント非表示設定</h4>
                <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="setting-hide-comments" ${settings.enableHideComments ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">評価の低いコメントを非表示</span>
                </label>
                    <select id="setting-hide-basis" style="margin-left: 4px; padding: 2px;">
                        <option value="account" ${settings.hideBasis === "account" ? "selected" : ""}>アカウント全体の評価比率</option>
                        <option value="comment" ${settings.hideBasis === "comment" ? "selected" : ""}>そのコメントの評価比率</option>
                        <option value="either" ${settings.hideBasis === "either" ? "selected" : ""}>いずれかがしきい値未満</option>
                    </select>
                </div>
                <label style="display: block; margin-bottom: 8px; font-size: 13px;">
                    非表示にする評価率: <span id="hide-threshold-value">${settings.hideThreshold}</span>%未満
                    <input type="range" id="setting-hide-threshold" min="0" max="100" value="${settings.hideThreshold}" style="width: 100%; margin-top: 4px;">
                </label>
                <label style="display: block; margin-bottom: 8px; font-size: 13px;">
                    最小の全体評価数（これ以下は非表示になりません。）: <span id="hide-min-total-value">${settings.hideMinTotal}</span>件
                    <input type="range" id="setting-hide-min-total" min="1" max="100" value="${settings.hideMinTotal}" style="width: 100%; margin-top: 4px;">
                </label>
            </div>

            </div>

            <div style="margin-bottom: 15px; padding-top: 10px; border-top: 1px solid #eee;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #555;">バー設定</h4>
                <label style="display: block; margin-bottom: 8px; font-size: 13px;">
                    バーの高さ: <span id="bar-height-value">${settings.barHeight}</span>px
                    <input type="range" id="setting-bar-height" min="2" max="10" value="${settings.barHeight}" style="width: 100%; margin-top: 4px;">
                </label>
                <label style="display: block; margin-bottom: 8px; font-size: 13px;">
                    バーの幅: <span id="bar-width-value">${settings.barWidth}</span>px
                    <input type="range" id="setting-bar-width" min="30" max="120" value="${settings.barWidth}" style="width: 100%; margin-top: 4px;">
                </label>
            </div>

            <div style="margin-bottom: 15px; padding-top: 10px; border-top: 1px solid #eee;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #555;">パフォーマンス設定</h4>
                <label style="display: block; margin-bottom: 8px; font-size: 13px;">
                    データ取得間隔: <span id="fetch-interval-value">${settings.fetchInterval / 1000}</span>秒
                    <input type="range" id="setting-fetch-interval" min="2000" max="30000" step="1000" value="${settings.fetchInterval}" style="width: 100%; margin-top: 4px;">
                </label>
                <label style="display: block; margin-bottom: 8px; font-size: 13px;">
                    初回読み込み遅延: <span id="initial-delay-value">${settings.initialDelay}</span>ms
                    <input type="range" id="setting-initial-delay" min="100" max="3000" step="100" value="${settings.initialDelay}" style="width: 100%; margin-top: 4px;">
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 8px;">
                    <input type="checkbox" id="setting-cache" ${settings.enableCache ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">キャッシュを有効化（高速化）</span>
                </label>
                <div style="margin-top: 12px; padding: 10px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 8px;">
                        <input type="checkbox" id="setting-rate-limit" ${settings.enableRateLimit ? "checked" : ""} style="margin-right: 8px;">
                        <span style="font-size: 13px; font-weight: bold;">⚠️ アクセス制限対策を有効化（推奨）</span>
                    </label>
                    <div style="font-size: 11px; color: #856404; margin-bottom: 8px;">
                        ※ 無効にすると一度に多数のリクエストを送信するため、YahooからIPベースのアクセス制限（通常1時間程度）を受ける可能性が非常に高まります。
                    </div>
                    <label style="display: block; margin-bottom: 8px; font-size: 13px;">
                        1リクエストごとの待機時間: <span id="rate-limit-delay-value">${settings.rateLimitDelay / 1000}</span>秒
                        <input type="range" id="setting-rate-limit-delay" min="500" max="3000" step="100" value="${settings.rateLimitDelay}" style="width: 100%; margin-top: 4px;">
                    </label>
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ffc107;">
                        <label style="display: flex; align-items: center; cursor: pointer; color: #721c24;">
                            <input type="checkbox" id="setting-turbo" ${settings.enableTurboMode ? "checked" : ""} style="margin-right: 8px;">
                            <span style="font-size: 13px; font-weight: bold;">🚀 ターボモード（即時解析）</span>
                        </label>
                        <div style="font-size: 10px; color: #721c24; margin-top: 4px;">
                            ※ 待機時間を無視して解析します。アクセス制限のリスクが最大になります。<b>自己責任で使用してください。</b>
                        </div>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 15px; padding-top: 10px; border-top: 1px solid #eee;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #555;">表示設定</h4>
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="setting-compact" ${settings.compactMode ? "checked" : ""} style="margin-right: 8px;">
                    <span style="font-size: 13px;">小さめに表示</span>
                </label>
            </div>

            <div style="margin-bottom: 15px; padding-top: 10px; border-top: 1px solid #eee;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #555;">設定の管理</h4>
                <div style="display: flex; gap: 8px;">
                    <button id="settings-export" style="flex: 1; padding: 6px 12px; border: 1px solid #0078d4; background: white; color: #0078d4; border-radius: 4px; cursor: pointer; font-size: 12px;">📥 エクスポート</button>
                    <button id="settings-import" style="flex: 1; padding: 6px 12px; border: 1px solid #0078d4; background: white; color: #0078d4; border-radius: 4px; cursor: pointer; font-size: 12px;">📤 インポート</button>
                    <button id="settings-reset" style="flex: 1; padding: 6px 12px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer; font-size: 12px;">リセット</button>
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end; padding-top: 10px; border-top: 1px solid #eee;">
                <button id="settings-cancel" style="padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer; font-size: 13px;">キャンセル</button>
                <button id="settings-save" style="padding: 8px 16px; border: none; background: #0078d4; color: white; border-radius: 4px; cursor: pointer; font-size: 13px;">保存</button>
            </div>
        `;

    document.body.appendChild(panel);

    // 各入力要素へのイベント紐付けを整理
    const reloadIds = [
      "setting-cache",
      "setting-rate-limit",
      "setting-fetch-interval",
      "setting-initial-delay",
      "setting-hide-comments",
      "setting-hide-threshold",
      "setting-hide-min-total",
      "setting-rate-limit-delay",
      "setting-hide-basis",
      "setting-turbo",
      "setting-expert-helpful",
      "setting-expert-comment-count",
      "setting-expert-article-count"
    ];

    panel.querySelectorAll("input, select").forEach((input) => {
      const id = input.id;
      const isReloadSetting = reloadIds.includes(id);

      input.addEventListener("change", () => markUnsavedChanges(panel, isReloadSetting));
      if (input.type === "range") {
        input.addEventListener("input", (e) => {
          const valueDisplay = panel.querySelector(`#${id.replace("setting-", "")}-value`);
          if (valueDisplay) {
            valueDisplay.textContent = id.includes("delay") || id.includes("interval") ? e.target.value / (id === "setting-initial-delay" ? 1 : 1000) : e.target.value;
          }
          markUnsavedChanges(panel, isReloadSetting);
        });
      }
    });

    panel.querySelector("#settings-export").addEventListener("click", exportSettings);
    panel.querySelector("#settings-import").addEventListener("click", importSettings);
    panel.querySelector("#settings-reset").addEventListener("click", () => {
      if (confirm("設定を初期値にリセットしますか?")) {
        Object.keys(defaultSettings).forEach((key) => GM_setValue(key, defaultSettings[key]));
        location.reload();
      }
    });

    panel.querySelector("#settings-save").addEventListener("click", () => {
      settings.showSympathized = panel.querySelector("#setting-sympathized").checked;
      settings.showUnderstood = panel.querySelector("#setting-understood").checked;
      settings.showHmm = panel.querySelector("#setting-hmm").checked;
      settings.showCommentCount = panel.querySelector("#setting-comment-count").checked;
      settings.showTotal = panel.querySelector("#setting-total").checked;
      settings.roundTotal = panel.querySelector("#setting-round-total").checked;
      settings.showPercentage = panel.querySelector("#setting-percentage").checked;
      settings.showBar = panel.querySelector("#setting-bar").checked;
      settings.showCommentBar = panel.querySelector("#setting-comment-bar").checked;
      settings.enableBackgroundColor = panel.querySelector("#setting-bg-color").checked;
      settings.bgColorBasis = panel.querySelector("#setting-bg-basis").value;
      settings.barHeight = parseInt(panel.querySelector("#setting-bar-height").value);
      settings.barWidth = parseInt(panel.querySelector("#setting-bar-width").value);
      settings.fetchInterval = parseInt(panel.querySelector("#setting-fetch-interval").value);
      settings.initialDelay = parseInt(panel.querySelector("#setting-initial-delay").value);
      settings.enableCache = panel.querySelector("#setting-cache").checked;
      settings.compactMode = panel.querySelector("#setting-compact").checked;
      settings.enableHideComments = panel.querySelector("#setting-hide-comments").checked;
      settings.hideThreshold = parseInt(panel.querySelector("#setting-hide-threshold").value);
      settings.hideMinTotal = parseInt(panel.querySelector("#setting-hide-min-total").value);
      settings.hideBasis = panel.querySelector("#setting-hide-basis").value;


      settings.enableRateLimit = panel.querySelector("#setting-rate-limit").checked;
      settings.enableTurboMode = panel.querySelector("#setting-turbo").checked;
      settings.rateLimitDelay = parseInt(panel.querySelector("#setting-rate-limit-delay").value);
      settings.showExpertHelpful = panel.querySelector("#setting-expert-helpful").checked;
      settings.showExpertCommentCount = panel.querySelector("#setting-expert-comment-count").checked;
      settings.showExpertArticleCount = panel.querySelector("#setting-expert-article-count").checked;

      saveSettings();
      const needsReload = panel.dataset.needsReload === "true";
      hasUnsavedChanges = false;
      panel.dataset.needsReload = "false";

      if (needsReload) {
        location.reload();
      } else {
        panel.style.display = "none";
        applySettingsLive();
      }
    });

    panel.querySelector("#settings-cancel").addEventListener("click", () => {
      if (hasUnsavedChanges && !confirm("変更が保存されていません。本当に閉じますか?")) return;
      hasUnsavedChanges = false;
      panel.style.display = "none";
    });

    return panel;
  }

  function showSettingsPanel() {
    const panel = document.querySelector("#yahoo-rating-settings-panel");
    if (panel) panel.style.display = "block";
  }

  async function processUserLink(link) {
    if (processedElements.has(link)) return;

    const href = link.getAttribute("href");
    if (!href || (!href.includes("/users/") && !href.includes("/commentator/") && !href.includes("/profile/commentator/"))) return;

    let userIdMatch = href.match(/\/(?:profile\/|)?commentator\/([^\/\?#]+)/);
    let isExpertLink = !!userIdMatch;
    if (!userIdMatch) {
      userIdMatch = href.match(/\/users\/(?:expert\/)?([^\/\?#]+)/);
      if (userIdMatch && href.includes("/expert/")) isExpertLink = true;
    }
    if (!userIdMatch) return;

    const userId = userIdMatch[1];
    // コメント要素の特定 (個別コメントを表す article または特定のクラス)
    const commentElement = link.closest('article, [class*="CommentItem"], [class*="CommentReply"]');

    if (commentElement && commentElement.querySelector(".yahoo-user-rating-badge")) {
      processedElements.add(link);
      return;
    }

    processedElements.add(link);

    try {
      const ratings = isExpertLink ? await fetchExpertRating(userId) : await fetchUserRating(userId);
      const badge = createRatingBadge(ratings);

      const existingBadges = link.parentElement?.querySelectorAll(".yahoo-user-rating-badge");
      existingBadges?.forEach((b) => b.remove());

      if (commentElement && commentElement.querySelector(".yahoo-user-rating-badge")) return;

      if (link.textContent.trim().length > 0) {
        if (link.parentElement) {
          if (link.nextSibling) {
            link.parentElement.insertBefore(badge, link.nextSibling);
          } else {
            link.parentElement.appendChild(badge);
          }
        }
      }

      const commentStats = getIndividualCommentRating(commentElement);

      if (shouldHideComment(ratings, commentStats)) {
        if (commentElement) {
          commentElement.style.display = "none";
          commentElement.dataset.hiddenByRating = "true";
        }
      } else if (settings.enableBackgroundColor && commentElement && !ratings.isExpert) {
        const stats = settings.bgColorBasis === "comment" ? commentStats : {
          sympathized: (ratings.sympathized || 0) + (ratings.understood || 0),
          hmm: ratings.hmm || 0,
          total: (ratings.sympathized || 0) + (ratings.understood || 0) + (ratings.hmm || 0)
        };

        if (stats && stats.total > 0) {
          const rate = Math.round((stats.sympathized / stats.total) * 100);
          commentElement.style.backgroundColor = getCommentBackgroundColor(rate);
        }
      }

      // 個別コメント用の評価バー
      if (settings.showCommentBar && commentElement && commentStats.total > 0 && !commentElement.querySelector(".yahoo-comment-rating-bar-container")) {
        const rate = (commentStats.sympathized / commentStats.total) * 100;
        const barContainer = document.createElement("div");
        barContainer.className = "yahoo-comment-rating-bar-container";
        barContainer.style.cssText = "height: 4px; background: #eee; margin-top: 8px; border-radius: 2px; overflow: hidden; width: 100%;";

        const bar = document.createElement("div");
        bar.style.cssText = `height: 100%; width: ${rate}%; background: ${getRatingColor(rate)}; transition: width 0.3s;`;
        barContainer.appendChild(bar);

        // リアクションボタンの親または適切な位置に挿入
        const reactionArea = commentElement.querySelector('div[class*="Reaction"], div[class*="reaction"], ul[class*="Reaction"]');
        if (reactionArea) {
          reactionArea.parentElement.insertBefore(barContainer, reactionArea.nextSibling);
        } else {
          commentElement.appendChild(barContainer);
        }
      }
    } catch (err) {
      // エラー時はサイレントにスキップ
    }
  }

  /**
   * プロフィールページの情報を取得・表示する
   */
  function processProfilePage() {
    if (!window.location.pathname.match(/\/users\/[^\/]+$/)) return;

    // 統計リスト(ul)を取得
    const statsUl = document.querySelector('ul[class*="sc-c2wteh-4"], .sc-c2wteh-4');
    if (!statsUl || statsUl.querySelector(".yahoo-profile-rating-li")) return;

    // 数値の抽出
    const extractNum = (label) => {
      const li = Array.from(statsUl.children).find(c => c.textContent.includes(label));
      if (!li) return 0;
      const span = li.querySelector('span[class*="sc-c2wteh-8"]');
      return span ? parseNumber(span.textContent) : 0;
    };

    const sympathized = extractNum("共感した");
    const understood = extractNum("なるほど");
    const hmm = extractNum("うーん");
    const { rate, color } = calculateRating(sympathized + understood, hmm);

    if (rate >= 0) {
      // 数値の下にバーを配置したコンパクトなLiを追加
      const rateLi = document.createElement("li");
      rateLi.className = (statsUl.children[0]?.className || "") + " yahoo-profile-rating-li";
      rateLi.style.cssText = "display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 65px; margin-left: 10px;";
      rateLi.innerHTML = `
        <div style="font-size: 10px; color: #666; line-height: 1.2;">評価比率</div>
        <div style="font-size: 16px; font-weight: bold; color: #0078d4; line-height: 1;">${rate}%</div>
      `;

      const bar = createBarElement(rate, color, "3px", "4px 0 0 0");
      rateLi.appendChild(bar);
      statsUl.appendChild(rateLi);
    }
  }

  function findAndProcessUserLinks() {
    // プロフィールページの処理を追加
    processProfilePage();

    const userLinks = document.querySelectorAll('a[href*="/users/"], a[href*="/commentator/"], a[href*="/profile/commentator/"]');
    userLinks.forEach((link) => {
      if (link.closest('article, [class*="CommentItem"], [class*="CommentReply"]')) processUserLink(link);
    });
  }

  function startObserving() {
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.addedNodes.length > 0)) {
        findAndProcessUserLinks();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    loadSettings();
    createSettingsPanel();
    GM_registerMenuCommand("評価表示設定を開く", showSettingsPanel);

    setTimeout(() => {
      findAndProcessUserLinks();
      startObserving();
      if (settings.fetchInterval > 0) {
        setInterval(findAndProcessUserLinks, settings.fetchInterval);
      }
    }, settings.initialDelay);
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();
