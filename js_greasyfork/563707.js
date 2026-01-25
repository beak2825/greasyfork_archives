// ==UserScript==
// @name         Logseq Twitter Clipper
// @namespace    https://github.com/26d0/userscripts
// @version      1.1.1
// @description  Clip tweets to Logseq via HTTP API
// @match        https://x.com/*/status/*
// @match        https://twitter.com/*/status/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @resource     sakuraCSS https://raw.githubusercontent.com/26d0/userscripts/main/src/sakura.css
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/563707/Logseq%20Twitter%20Clipper.user.js
// @updateURL https://update.greasyfork.org/scripts/563707/Logseq%20Twitter%20Clipper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ===================
  // Constants & Config
  // ===================

  const LOGSEQ_API_URL = "http://127.0.0.1:12315/api";
  const STORAGE_KEY_TOKEN = "logseq_api_token";

  // Load sakura.css from resource
  GM_addStyle(GM_getResourceText("sakuraCSS"));

  // ===================
  // Logseq API Client
  // ===================

  class LogseqAPI {
    constructor(token) {
      this.token = token;
      this.baseUrl = LOGSEQ_API_URL;
    }

    call(method, args = []) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: this.baseUrl,
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ method, args }),
          onload: (response) => {
            if (response.status >= 200 && response.status < 300) {
              try {
                const data = JSON.parse(response.responseText);
                resolve(data);
              } catch {
                resolve(response.responseText);
              }
            } else {
              reject(
                new Error(`API error: ${response.status} ${response.statusText}`)
              );
            }
          },
          onerror: (error) => {
            reject(new Error(`Network error: ${error}`));
          },
        });
      });
    }

    getPage(pageName) {
      return this.call("logseq.Editor.getPage", [pageName]);
    }

    createPage(pageName, properties = {}, opts = {}) {
      return this.call("logseq.Editor.createPage", [
        pageName,
        properties,
        { createFirstBlock: false, redirect: false, ...opts },
      ]);
    }

    appendBlockInPage(pageName, content, opts = {}) {
      return this.call("logseq.Editor.appendBlockInPage", [
        pageName,
        content,
        opts,
      ]);
    }

    deletePage(pageName) {
      return this.call("logseq.Editor.deletePage", [pageName]);
    }
  }

  // ===================
  // UI Components
  // ===================

  // Sakura.css color values (matching src/sakura.css)
  const SAKURA = {
    primary: "#1d7484",
    primaryHover: "#982c61",
    background: "#f9f9f9",
    text: "#4a4a4a",
    border: "#f1f1f1",
  };

  function injectStyles() {
    // Userscript-specific styles (sakura.css is loaded via @resource)
    GM_addStyle(`
      .logseq-clipper-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 12px 16px;
        background-color: ${SAKURA.primary};
        color: ${SAKURA.background};
        border: none;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: background-color 0.2s, transform 0.1s;
      }
      .logseq-clipper-btn:hover {
        background-color: ${SAKURA.primaryHover};
        transform: translateY(-1px);
      }
      .logseq-clipper-btn:active {
        transform: translateY(0);
      }
      .logseq-clipper-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .logseq-toast {
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 10000;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        color: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        animation: logseq-toast-in 0.3s ease;
      }
      .logseq-toast.success { background-color: #28a745; }
      .logseq-toast.error { background-color: #dc3545; }
      @keyframes logseq-toast-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .logseq-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .logseq-dialog {
        background-color: ${SAKURA.background};
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .logseq-dialog h3 {
        margin: 0 0 12px 0;
        color: ${SAKURA.text};
        font-size: 18px;
      }
      .logseq-dialog p {
        margin: 0 0 20px 0;
        color: ${SAKURA.text};
        font-size: 14px;
        line-height: 1.5;
      }
      .logseq-dialog-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      .logseq-dialog-btn {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s;
      }
      .logseq-dialog-btn.primary {
        background-color: ${SAKURA.primary};
        color: white;
      }
      .logseq-dialog-btn.primary:hover {
        background-color: ${SAKURA.primaryHover};
      }
      .logseq-dialog-btn.secondary {
        background-color: ${SAKURA.border};
        color: ${SAKURA.text};
      }
      .logseq-dialog-btn.secondary:hover {
        background-color: #e0e0e0;
      }
    `);
  }

  function createClipButton() {
    const btn = document.createElement("button");
    btn.className = "logseq-clipper-btn";
    btn.textContent = "Clip to Logseq";
    document.body.appendChild(btn);
    return btn;
  }

  function showToast(message, type = "success") {
    const existing = document.querySelector(".logseq-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `logseq-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }

  function showConfirmDialog(title, message) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "logseq-dialog-overlay";

      overlay.innerHTML = `
        <div class="logseq-dialog">
          <h3>${title}</h3>
          <p>${message}</p>
          <div class="logseq-dialog-buttons">
            <button class="logseq-dialog-btn secondary" data-action="cancel">キャンセル</button>
            <button class="logseq-dialog-btn primary" data-action="confirm">上書き</button>
          </div>
        </div>
      `;

      overlay.addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        if (action === "confirm") {
          overlay.remove();
          resolve(true);
        } else if (action === "cancel" || e.target === overlay) {
          overlay.remove();
          resolve(false);
        }
      });

      document.body.appendChild(overlay);
    });
  }

  // ===================
  // Tweet Extraction
  // ===================

  function parseTwitterUrl() {
    const match = window.location.pathname.match(
      /^\/([^/]+)\/status\/(\d+)/
    );
    if (!match) return null;
    return {
      username: match[1],
      tweetId: match[2],
    };
  }

  function extractTextFromTweetElement(tweetTextEl) {
    if (!tweetTextEl) return "";

    // Extract text content, preserving line breaks
    let content = "";
    for (const node of tweetTextEl.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        content += node.textContent;
      } else if (node.tagName === "IMG") {
        // Emoji images have alt text
        content += node.alt || "";
      } else if (node.tagName === "BR") {
        content += "\n";
      } else if (node.tagName === "SPAN" || node.tagName === "A") {
        content += node.textContent;
      } else {
        content += node.textContent || "";
      }
    }

    return content.trim();
  }

  function extractTweetContent(tweetId) {
    const articles = document.querySelectorAll('article[data-testid="tweet"]');
    if (articles.length === 0) return null;

    // Find the article that matches the tweet ID from URL
    for (const article of articles) {
      // Look for timestamp link which contains the tweet's permalink
      const timeElement = article.querySelector("time");
      if (timeElement) {
        const link = timeElement.closest("a");
        if (link) {
          const match = link.href.match(/\/status\/(\d+)/);
          if (match && match[1] === tweetId) {
            const tweetTextEl = article.querySelector('[data-testid="tweetText"]');
            return extractTextFromTweetElement(tweetTextEl);
          }
        }
      }
    }

    // Fallback: return null if matching tweet not found
    return null;
  }

  function toLogseqPageName(username, tweetId) {
    return `${username}/status/${tweetId}`;
  }

  // ===================
  // Main Logic
  // ===================

  async function getApiToken() {
    let token = GM_getValue(STORAGE_KEY_TOKEN, "");
    if (!token) {
      token = prompt(
        "Logseq API Token を入力してください:\n\n" +
          "(Settings > Features > HTTP APIs server で取得できます)"
      );
      if (token) {
        GM_setValue(STORAGE_KEY_TOKEN, token);
      }
    }
    return token;
  }

  async function clipToLogseq(button) {
    // Get token
    const token = await getApiToken();
    if (!token) {
      showToast("トークンが設定されていません", "error");
      return;
    }

    // Parse URL
    const tweetInfo = parseTwitterUrl();
    if (!tweetInfo) {
      showToast("ツイートURLを解析できません", "error");
      return;
    }

    // Extract content
    const content = extractTweetContent(tweetInfo.tweetId);
    const pageName = toLogseqPageName(tweetInfo.username, tweetInfo.tweetId);
    const tweetUrl = `https://x.com/${tweetInfo.username}/status/${tweetInfo.tweetId}`;

    // Disable button during operation
    button.disabled = true;
    button.textContent = "処理中...";

    try {
      const api = new LogseqAPI(token);

      // Check if page exists
      const existingPage = await api.getPage(pageName);

      if (existingPage) {
        // Page exists - ask for confirmation
        const shouldOverwrite = await showConfirmDialog(
          "ページが既に存在します",
          `「${pageName}」は既にLogseqに存在します。上書きしますか？`
        );

        if (!shouldOverwrite) {
          showToast("キャンセルしました", "error");
          return;
        }

        // Delete existing page
        await api.deletePage(pageName);
      }

      // Create new page
      await api.createPage(pageName);

      // Add tweet content block
      if (content) {
        await api.appendBlockInPage(pageName, content);
      }

      // Add twitter embed block
      await api.appendBlockInPage(pageName, `{{twitter ${tweetUrl}}}`);

      showToast("Logseq に保存しました", "success");
    } catch (error) {
      console.error("Logseq Clipper Error:", error);

      if (error.message.includes("Network error")) {
        showToast(
          "Logseq に接続できません。HTTP API サーバーが起動しているか確認してください",
          "error"
        );
      } else {
        showToast(`エラー: ${error.message}`, "error");
      }
    } finally {
      button.disabled = false;
      button.textContent = "Clip to Logseq";
    }
  }

  // ===================
  // Initialization
  // ===================

  function init() {
    // Wait for page to be somewhat loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    injectStyles();
    const button = createClipButton();

    button.addEventListener("click", () => clipToLogseq(button));
  }

  init();
})();
