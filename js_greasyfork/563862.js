// ==UserScript==
// @name         Twitter-助手
// @version      1.0.0
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  Twitter/X 媒体已读标记、滚动位置记忆
// @match        *://x.com/*
// @match        *://twitter.com/*
// @match        *://x.com/search*
// @match        *://twitter.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @license      GPL-3.0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.github.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563862/Twitter-%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563862/Twitter-%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

!function() {
  "use strict";
  const CONFIG_STYLES = {
    badge: {
      content: "✓ 已读",
      background: "linear-gradient(135deg, #00ba7c, #00a06a)",
      color: "#fff",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      boxShadow: "0 2px 8px rgba(0, 186, 124, 0.4)"
    },
    item: {
      opacity: .75
    }
  }, CONFIG_GIST_TOKEN_KEY = "twitter_gist_token", CONFIG_GIST_ID_KEY = "twitter_gist_id", CONFIG_GIST_FILENAME = "twitter_backup.json", CONFIG_GIST_DESCRIPTION = "Twitter-助手 数据备份", CONFIG_GIST_LAST_BACKUP_KEY = "twitter_gist_last_backup";
  class Storage {
    static get(key, defaultValue = null) {
      try {
        const value = GM_getValue(key);
        if (null == value) return defaultValue;
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      } catch (error) {
        return defaultValue;
      }
    }
    static set(key, value) {
      try {
        const jsonValue = JSON.stringify(value);
        return GM_setValue(key, jsonValue), !0;
      } catch (error) {
        return !1;
      }
    }
    static delete(key) {
      try {
        return GM_deleteValue(key), !0;
      } catch (error) {
        return !1;
      }
    }
  }
  function addStyles(css, id) {
    if (id) {
      const existing = document.getElementById(id);
      if (existing) return existing;
    }
    const style = document.createElement("style");
    return id && (style.id = id), style.textContent = css, document.head.appendChild(style), 
    style;
  }
  class GistAPI {
    static async request(token, config) {
      if (!token) throw new Error("GitHub Token 未提供");
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          ...config,
          headers: {
            ...config.headers,
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json"
          },
          onload: res => res.status >= 200 && res.status < 300 ? resolve(res) : reject(res),
          onerror: err => reject(err)
        });
      });
    }
    static async getFile(token, gistId, filename) {
      if (!gistId) throw new Error("Gist ID 未提供");
      const response = await this.request(token, {
        method: "GET",
        url: `https://api.github.com/gists/${gistId}`
      }), gistData = JSON.parse(response.responseText);
      return gistData.files?.[filename] || null;
    }
    static async updateFile(token, gistId, filename, content) {
      if (!gistId) throw new Error("Gist ID 未提供");
      return await this.request(token, {
        method: "PATCH",
        url: `https://api.github.com/gists/${gistId}`,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          files: {
            [filename]: {
              content: content
            }
          }
        })
      }), !0;
    }
    static async createGist(token, filename, content, description) {
      const response = await this.request(token, {
        method: "POST",
        url: "https://api.github.com/gists",
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          description: description,
          public: !1,
          files: {
            [filename]: {
              content: content
            }
          }
        })
      });
      return JSON.parse(response.responseText).id;
    }
  }
  const _Toast = class {
    static initContainer() {
      return this.container || (this.container = document.createElement("div"), Object.assign(this.container.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: "99999",
        pointerEvents: "none"
      }), document.body.appendChild(this.container)), this.container;
    }
    static show(message, type = "info", duration = 4e3) {
      const container = this.initContainer(), toast = document.createElement("div");
      return toast.textContent = message, Object.assign(toast.style, {
        padding: "12px 20px",
        marginBottom: "10px",
        borderRadius: "6px",
        color: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        opacity: "0",
        transform: "translateX(100%)",
        transition: "all 0.3s ease-out",
        fontSize: "14px",
        maxWidth: "300px",
        wordWrap: "break-word",
        pointerEvents: "auto",
        cursor: "pointer"
      }), toast.style.backgroundColor = {
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6"
      }[type], toast.addEventListener("click", () => {
        toast.style.opacity = "0", setTimeout(() => toast.remove(), 300);
      }), container.appendChild(toast), setTimeout(() => {
        toast.style.opacity = "1", toast.style.transform = "translateX(0)";
      }, 10), duration > 0 && setTimeout(() => {
        toast.style.opacity = "0", setTimeout(() => toast.remove(), 300);
      }, duration), toast;
    }
    static success(message, duration = 4e3) {
      return this.show(message, "success", duration);
    }
    static error(message, duration = 5e3) {
      return this.show(message, "error", duration);
    }
    static info(message, duration = 3e3) {
      return this.show(message, "info", duration);
    }
  };
  _Toast.container = null;
  let Toast = _Toast;
  class TwitterReadMark {
    constructor() {
      this.observer = null, this.processedElements = new WeakSet, this.debounceTimer = null, 
      this.readMedia = this.getReadMedia();
    }
    init() {
      this.injectStyles(), this.setupUrlListener(), this.setupObserver();
    }
    getReadMedia() {
      try {
        const data = Storage.get("twitter_read_media", []) || [];
        return new Set(data);
      } catch (error) {
        return new Set;
      }
    }
    saveReadMedia() {
      try {
        Storage.set("twitter_read_media", Array.from(this.readMedia));
      } catch (error) {}
    }
    markAsRead(mediaId) {
      this.readMedia.has(mediaId) || (this.readMedia.add(mediaId), this.saveReadMedia());
    }
    isRead(mediaId) {
      return this.readMedia.has(mediaId);
    }
    extractMediaId(src) {
      if (!src) return null;
      const mediaMatch = src.match(/\/media\/([A-Za-z0-9_-]+)/);
      if (mediaMatch) return mediaMatch[1];
      const gifMatch = src.match(/\/tweet_video_thumb\/([A-Za-z0-9_-]+)/);
      if (gifMatch) return gifMatch[1];
      const videoMatch = src.match(/\/ext_tw_video_thumb\/\d+\/pu\/img\/([A-Za-z0-9_-]+)/);
      return videoMatch ? videoMatch[1] : null;
    }
    processMediaItems() {
      if (!this.isValidPage()) return;
      const isPhotoPage = window.location.href.includes("/photo/");
      document.querySelectorAll('img[src*="pbs.twimg.com/media"], img[src*="pbs.twimg.com/tweet_video_thumb"], img[src*="pbs.twimg.com/ext_tw_video_thumb"]').forEach(img => {
        this.processMediaImage(img, isPhotoPage);
      });
    }
    processMediaImage(img, isPhotoPage) {
      if (this.processedElements.has(img)) return;
      this.processedElements.add(img);
      const src = img.src, mediaId = this.extractMediaId(src);
      mediaId && (this.isRead(mediaId) && !isPhotoPage && this.applyReadStyle(img), this.bindClickEvent(img, mediaId));
    }
    findMediaContainer(element) {
      if (window.location.href.includes("/photo/")) return null;
      let parent = element.parentElement, depth = 0;
      for (;parent && depth < 8; ) {
        const testId = parent.getAttribute("data-testid"), role = parent.getAttribute("role");
        if ("tweetPhoto" === testId || "cellInnerDiv" === testId || "listitem" === role) return parent;
        parent = parent.parentElement, depth++;
      }
      return null;
    }
    bindClickEvent(img, mediaId) {
      const clickHandler = () => {
        this.markAsRead(mediaId), this.applyReadStyle(img);
      };
      img.addEventListener("click", clickHandler, !0);
      const container = this.findMediaContainer(img);
      container && container !== img && container.addEventListener("click", clickHandler, !0);
    }
    applyReadStyle(element) {
      const container = this.findMediaContainer(element);
      if (!container) return;
      if (container.querySelector(".twitter-media-container-mask")) return;
      const mask = document.createElement("div");
      mask.className = "twitter-media-container-mask", "static" === window.getComputedStyle(container).position && (container.style.position = "relative"), 
      container.appendChild(mask);
    }
    setupObserver() {
      this.observer = new MutationObserver(mutations => {
        let hasNewNodes = !1;
        for (const mutation of mutations) if (mutation.addedNodes.length > 0) {
          hasNewNodes = !0;
          break;
        }
        hasNewNodes && this.debounceProcess();
      }), this.observer.observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }
    debounceProcess() {
      this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = window.setTimeout(() => {
        this.processMediaItems();
      }, 200);
    }
    setupUrlListener() {
      const originalPushState = history.pushState, originalReplaceState = history.replaceState, self = this;
      history.pushState = function(...args) {
        originalPushState.apply(this, args), self.onUrlChange();
      }, history.replaceState = function(...args) {
        originalReplaceState.apply(this, args), self.onUrlChange();
      }, window.addEventListener("popstate", () => this.onUrlChange());
    }
    onUrlChange() {
      this.isValidPage() && (setTimeout(() => this.processMediaItems(), 500), setTimeout(() => this.processMediaItems(), 1500), 
      setTimeout(() => this.processMediaItems(), 3e3));
    }
    isValidPage() {
      const url = window.location.href;
      return (url.includes("x.com") || url.includes("twitter.com")) && (url.includes("/media") || url.includes("/search") || url.includes("/photo/"));
    }
    injectStyles() {
      addStyles(this.generateStyles(), "twitter-media-container-read-mark-styles");
    }
    generateStyles() {
      const maskClass = "twitter-media-container-mask", style = CONFIG_STYLES;
      return `\n      /* 蒙层样式：覆盖整个容器，实现变暗效果 */\n      .${maskClass} {\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background-color: rgba(0, 0, 0, 0.5); /* 变暗的核心 */\n        z-index: 2; /* 确保在图片之上 */\n        pointer-events: none; /* 让点击穿透，不影响看大图 */\n        transition: opacity 0.2s;\n        border-radius: inherit; /* 跟随父容器圆角 */\n      }\n\n      /* 已读标签：挂在蒙层右上角 */\n      .${maskClass}::after {\n        content: '${style.badge.content}';\n        position: absolute;\n        top: 6px;\n        right: 6px;\n        background: ${style.badge.background};\n        color: ${style.badge.color};\n        padding: ${style.badge.padding};\n        border-radius: ${style.badge.borderRadius};\n        font-size: 11px;\n        font-weight: 800;\n        box-shadow: 0 2px 4px rgba(0,0,0,0.3);\n      }\n    `;
    }
    destroy() {
      this.observer && (this.observer.disconnect(), this.observer = null), this.debounceTimer && (clearTimeout(this.debounceTimer), 
      this.debounceTimer = null);
    }
  }
  class GistSync {
    static getToken() {
      return Storage.get(CONFIG_GIST_TOKEN_KEY, "") || "";
    }
    static getGistId() {
      return Storage.get(CONFIG_GIST_ID_KEY, "") || "";
    }
    static getBackupData() {
      return {
        timestamp: (new Date).toISOString(),
        version: "1.0.0",
        readMedia: Storage.get("twitter_read_media", []) || [],
        scrollPositions: Storage.get("twitter_scroll_position", {}) || {}
      };
    }
    static mergeArrays(local, remote) {
      return [ ...new Set([ ...local, ...remote ]) ];
    }
    static mergeScrollPositions(local, remote) {
      const result = {
        ...local
      };
      for (const key of Object.keys(remote)) result[key] = Math.max(result[key] || 0, remote[key] || 0);
      return result;
    }
    static async upload() {
      const token = this.getToken();
      let gistId = this.getGistId();
      if (token) try {
        Toast.info("正在同步...");
        const localData = this.getBackupData();
        if (gistId) {
          const remoteFile = await GistAPI.getFile(token, gistId, CONFIG_GIST_FILENAME);
          if (remoteFile) {
            const remoteData = JSON.parse(remoteFile.content), mergedReadMedia = this.mergeArrays(localData.readMedia, remoteData.readMedia || []), mergedScrollPositions = this.mergeScrollPositions(localData.scrollPositions, remoteData.scrollPositions || {});
            Storage.set("twitter_read_media", mergedReadMedia), Storage.set("twitter_scroll_position", mergedScrollPositions), 
            localData.readMedia = mergedReadMedia, localData.scrollPositions = mergedScrollPositions;
          }
          await GistAPI.updateFile(token, gistId, CONFIG_GIST_FILENAME, JSON.stringify(localData, null, 2));
        } else gistId = await GistAPI.createGist(token, CONFIG_GIST_FILENAME, JSON.stringify(localData, null, 2), CONFIG_GIST_DESCRIPTION), 
        Storage.set(CONFIG_GIST_ID_KEY, gistId);
        Toast.success("同步完成！本地与云端已保持一致");
      } catch (error) {
        Toast.error("同步失败，请检查 Token 和网络");
      } else Toast.error("请先配置 GitHub Token");
    }
    static async download() {
      await this.upload();
    }
    static async autoBackup() {
      const token = this.getToken(), gistId = this.getGistId();
      if (!token || !gistId) return;
      const today = (new Date).toISOString().split("T")[0];
      (Storage.get(CONFIG_GIST_LAST_BACKUP_KEY, "") || "") !== today && (await this.upload(), 
      Storage.set(CONFIG_GIST_LAST_BACKUP_KEY, today));
    }
    static showSettings() {
      const token = this.getToken(), gistId = this.getGistId(), dialog = document.createElement("div");
      dialog.style.cssText = "\n      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);\n      background: white; padding: 24px; border-radius: 12px; z-index: 100000;\n      box-shadow: 0 10px 40px rgba(0,0,0,0.3); min-width: 400px; font-family: sans-serif;\n    ", 
      dialog.innerHTML = `\n      <h3 style="margin: 0 0 16px 0; font-size: 18px;">⚙️ Gist 同步设置</h3>\n      <div style="margin-bottom: 12px;">\n        <label style="display: block; margin-bottom: 4px; font-size: 14px;">GitHub Token:</label>\n        <input id="gist-token" type="password" value="${token}" placeholder="ghp_xxxx..."\n          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">\n      </div>\n      <div style="margin-bottom: 16px;">\n        <label style="display: block; margin-bottom: 4px; font-size: 14px;">Gist ID (可选，留空自动创建):</label>\n        <input id="gist-id" type="text" value="${gistId}" placeholder="留空则自动创建"\n          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">\n      </div>\n      <div style="display: flex; gap: 8px; justify-content: flex-end;">\n        <button id="gist-cancel" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">取消</button>\n        <button id="gist-save" style="padding: 8px 16px; background: #3B82F6; color: white; border: none; border-radius: 6px; cursor: pointer;">保存</button>\n      </div>\n    `;
      const overlay = document.createElement("div");
      overlay.style.cssText = "position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 99999;", 
      overlay.onclick = () => {
        overlay.remove(), dialog.remove();
      }, document.body.appendChild(overlay), document.body.appendChild(dialog), dialog.querySelector("#gist-cancel").addEventListener("click", () => {
        overlay.remove(), dialog.remove();
      }), dialog.querySelector("#gist-save").addEventListener("click", () => {
        Storage.set(CONFIG_GIST_TOKEN_KEY, dialog.querySelector("#gist-token").value.trim()), 
        Storage.set(CONFIG_GIST_ID_KEY, dialog.querySelector("#gist-id").value.trim()), 
        overlay.remove(), dialog.remove(), Toast.success("设置已保存");
      });
    }
    static registerMenuCommands() {
      GM_registerMenuCommand("⚙️ 配置 Gist 同步", () => this.showSettings()), GM_registerMenuCommand("📤 上传数据到 Gist", () => this.upload()), 
      GM_registerMenuCommand("📥 从 Gist 下载数据", () => this.download());
    }
  }
  class FloatingToolbar {
    constructor() {
      this.container = null, this.scrollPositions = {}, this.saveScrollTimer = null, this.isScrollingToBottom = !1, 
      this.scrollToBottomTimer = null, this.noChangeCount = 0, this.ICONS = {
        RESTORE: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        BOTTOM: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"></path><path d="M5 21h14"></path></svg>',
        BACKUP: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M17.5 19c3.04 0 5.5-2.46 5.5-5.5 0-2.6-1.8-4.78-4.23-5.32A7 7 0 1 0 5.14 11.23C2.7 11.78 1 13.9 1 16.5c0 3.04 2.46 5.5 5.5 5.5"></path><path d="M12 12v9"></path><path d="M9 15l3-3 3 3"></path></svg>',
        SETTINGS: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
      }, this.loadScrollPositions();
    }
    init() {
      this.injectStyles(), this.createToolbar(), this.setupScrollSave(), this.setupUrlListener();
    }
    setupUrlListener() {
      const self = this, orgPush = history.pushState;
      history.pushState = function(...args) {
        orgPush.apply(this, args), self.onUrlChange();
      };
      const orgRep = history.replaceState;
      history.replaceState = function(...args) {
        orgRep.apply(this, args), self.onUrlChange();
      }, window.addEventListener("popstate", () => this.onUrlChange());
    }
    onUrlChange() {
      setTimeout(() => this.updateButtons(), 500), setTimeout(() => this.updateButtons(), 2e3);
    }
    loadScrollPositions() {
      try {
        this.scrollPositions = Storage.get("twitter_scroll_position", {}) || {};
      } catch (e) {
        this.scrollPositions = {};
      }
    }
    saveScrollPositions() {
      Storage.set("twitter_scroll_position", this.scrollPositions);
    }
    extractUsername() {
      const match = window.location.href.match(/(?:x|twitter)\.com\/([^\/?#]+)/);
      return match && ![ "home", "explore", "notifications", "messages", "i", "search", "settings" ].includes(match[1]) ? match[1] : null;
    }
    setupScrollSave() {
      window.addEventListener("scroll", () => {
        this.isScrollingToBottom || (this.saveScrollTimer && clearTimeout(this.saveScrollTimer), 
        this.saveScrollTimer = window.setTimeout(() => {
          const username = this.extractUsername();
          username && window.location.href.includes("/media") && (this.scrollPositions[username] = window.scrollY, 
          this.saveScrollPositions(), this.updateButtons());
        }, 500));
      });
    }
    injectStyles() {
      addStyles("\n            #twitter-assistant-toolbar {\n                position: fixed;\n                bottom: 150px;\n                right: 20px;\n                display: flex;\n                flex-direction: column;\n                gap: 12px;\n                z-index: 10001;\n            }\n\n            .tw-tool-btn {\n                width: 58px;\n                height: 58px;\n                border-radius: 16px;\n                background-color: white;\n                border: 1px solid rgb(207, 217, 222);\n                box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;\n                cursor: pointer;\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                justify-content: center;\n                transition: all 0.2s ease-in-out;\n                color: rgb(15, 20, 25);\n                padding: 0;\n            }\n\n            @media (prefers-color-scheme: dark) {\n                .tw-tool-btn {\n                    background-color: black;\n                    border-color: rgb(51, 54, 57);\n                    color: rgb(231, 233, 234);\n                    box-shadow: rgba(255, 255, 255, 0.05) 0px 4px 12px;\n                }\n                .tw-tool-btn:hover { background-color: rgb(21, 24, 28) !important; }\n            }\n\n            .tw-tool-btn:hover {\n                transform: scale(1.05) translateX(-4px);\n                border-color: rgb(29, 155, 240);\n                color: rgb(29, 155, 240);\n            }\n\n            .tw-tool-btn.disabled {\n                opacity: 0.3;\n                cursor: default;\n                filter: grayscale(1);\n                pointer-events: none;\n            }\n\n            .tw-btn-icon-box {\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                height: 24px;\n            }\n\n            .tw-btn-label {\n                font-size: 10px;\n                font-weight: 800;\n                margin-top: 4px;\n                line-height: 1;\n                filter: none;\n            }\n\n            .tw-tool-btn-primary {\n                background-color: rgb(29, 155, 240) !important;\n                border: none;\n                color: white !important;\n            }\n            .tw-tool-btn-primary:hover {\n                background-color: rgb(26, 140, 216) !important;\n                box-shadow: rgba(29, 155, 240, 0.3) 0px 8px 16px;\n            }\n\n            .tw-spin .tw-btn-icon-box {\n                animation: tw-spin-anim 1.2s linear infinite;\n            }\n            @keyframes tw-spin-anim {\n                from { transform: rotate(0deg); }\n                to { transform: rotate(360deg); }\n            }\n        ", "twitter-assistant-toolbar-styles");
    }
    createToolbar() {
      this.container || (this.container = document.createElement("div"), this.container.id = "twitter-assistant-toolbar", 
      this.container.innerHTML = `\n            <button id="tw-restore-btn" class="tw-tool-btn" title="恢复上次位置">\n                <div class="tw-btn-icon-box">${this.ICONS.RESTORE}</div>\n                <div class="tw-btn-label">恢复</div>\n            </button>\n            <button id="tw-bottom-btn" class="tw-tool-btn" title="一键触底">\n                <div class="tw-btn-icon-box">${this.ICONS.BOTTOM}</div>\n                <div class="tw-btn-label">触底</div>\n            </button>\n            <button id="tw-backup-btn" class="tw-tool-btn" title="立即备份数据">\n                <div class="tw-btn-icon-box">${this.ICONS.BACKUP}</div>\n                <div class="tw-btn-label">备份</div>\n            </button>\n            <button id="tw-config-btn" class="tw-tool-btn tw-tool-btn-primary" title="设置选项">\n                <div class="tw-btn-icon-box">${this.ICONS.SETTINGS}</div>\n                <div class="tw-btn-label">设置</div>\n            </button>\n        `, 
      document.body.appendChild(this.container), this.bindEvents(), this.updateButtons());
    }
    bindEvents() {
      document.getElementById("tw-restore-btn")?.addEventListener("click", () => this.restorePosition()), 
      document.getElementById("tw-bottom-btn")?.addEventListener("click", () => this.toggleScrollToBottom()), 
      document.getElementById("tw-backup-btn")?.addEventListener("click", () => this.doBackup()), 
      document.getElementById("tw-config-btn")?.addEventListener("click", () => GistSync.showSettings());
    }
    updateButtons() {
      const username = this.extractUsername(), restoreBtn = document.getElementById("tw-restore-btn");
      if (username) {
        this.container.style.display = "flex";
        const savedPos = this.scrollPositions[username] || 0;
        restoreBtn?.classList.toggle("disabled", savedPos < 300);
      } else this.container.style.display = "none";
    }
    restorePosition() {
      const username = this.extractUsername();
      if (!username) return;
      const targetPos = this.scrollPositions[username];
      !targetPos || targetPos < 100 || (Toast.info("正在恢复位置..."), this.progressiveScroll(targetPos));
    }
    progressiveScroll(targetPosition) {
      const step = .8 * window.innerHeight, scrollStep = () => {
        const current = window.scrollY;
        targetPosition - current <= 100 ? window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        }) : (window.scrollTo({
          top: current + step,
          behavior: "smooth"
        }), setTimeout(scrollStep, 400));
      };
      scrollStep();
    }
    toggleScrollToBottom() {
      this.isScrollingToBottom ? this.stopScroll() : this.startScroll();
    }
    startScroll() {
      this.isScrollingToBottom = !0, document.getElementById("tw-bottom-btn")?.classList.add("tw-spin"), 
      Toast.info("开始自动触底..."), this.autoScrollStep();
    }
    stopScroll() {
      this.isScrollingToBottom = !1, this.scrollToBottomTimer && clearTimeout(this.scrollToBottomTimer), 
      document.getElementById("tw-bottom-btn")?.classList.remove("tw-spin"), Toast.success("已停止");
    }
    autoScrollStep() {
      if (!this.isScrollingToBottom) return;
      const oldH = document.documentElement.scrollHeight;
      window.scrollTo({
        top: window.scrollY + 1.5 * window.innerHeight,
        behavior: "smooth"
      }), this.scrollToBottomTimer = window.setTimeout(() => {
        if (document.documentElement.scrollHeight === oldH) {
          if (this.noChangeCount++, this.noChangeCount >= 3) return this.stopScroll(), void Toast.success("已达底部");
        } else this.noChangeCount = 0;
        this.autoScrollStep();
      }, 1500);
    }
    async doBackup() {
      const btn = document.getElementById("tw-backup-btn");
      btn?.classList.add("tw-spin"), await GistSync.upload(), btn?.classList.remove("tw-spin");
    }
  }
  class ProfileYearSearch {
    constructor() {
      this.observer = null;
    }
    init() {
      this.injectStyles(), this.setupObserver(), this.setupUrlListener(), this.processProfile();
    }
    injectStyles() {
      addStyles("\n            .tw-year-search-container {\n                display: flex;\n                flex-wrap: wrap;\n                gap: 6px;\n                margin-top: 8px;\n                padding: 4px 0;\n            }\n\n            .tw-year-btn {\n                font-size: 13px;\n                color: rgb(29, 155, 240);\n                background-color: rgba(29, 155, 240, 0.1);\n                border: 1px solid rgba(29, 155, 240, 0.2);\n                border-radius: 9999px;\n                padding: 2px 10px;\n                cursor: pointer;\n                transition: all 0.2s;\n                font-weight: 500;\n                user-select: none;\n            }\n\n            .tw-year-btn:hover {\n                background-color: rgba(29, 155, 240, 0.2);\n                border-color: rgb(29, 155, 240);\n            }\n\n            /* 深色模式适配 */\n            @media (prefers-color-scheme: dark) {\n                .tw-year-btn {\n                    background-color: rgba(29, 155, 240, 0.15);\n                }\n            }\n        ", "twitter-year-search-styles");
    }
    setupUrlListener() {
      const self = this, orgPush = history.pushState;
      history.pushState = function(...args) {
        orgPush.apply(this, args), setTimeout(() => self.processProfile(), 500);
      };
      const orgRep = history.replaceState;
      history.replaceState = function(...args) {
        orgRep.apply(this, args), setTimeout(() => self.processProfile(), 500);
      }, window.addEventListener("popstate", () => {
        setTimeout(() => this.processProfile(), 500);
      });
    }
    setupObserver() {
      this.observer = new MutationObserver(() => {
        this.processProfile();
      }), this.observer.observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }
    processProfile() {
      const joinDateElement = document.querySelector('[data-testid="UserJoinDate"]');
      if (!joinDateElement) return;
      const infoContainer = joinDateElement.closest('div[dir="ltr"]');
      if (!infoContainer || infoContainer.querySelector(".tw-year-search-container")) return;
      const match = (joinDateElement.textContent || "").match(/(\d{4})年/);
      if (!match) return;
      const startYear = parseInt(match[1]), currentYear = (new Date).getFullYear(), username = this.extractUsername();
      username && this.injectYearButtons(infoContainer, username, startYear, currentYear);
    }
    extractUsername() {
      const match = window.location.href.match(/(?:x|twitter)\.com\/([^\/?#]+)/);
      return match && ![ "home", "explore", "notifications", "messages", "i", "search", "settings" ].includes(match[1]) ? match[1] : null;
    }
    injectYearButtons(parent, username, startYear, endYear) {
      const container = document.createElement("div");
      container.className = "tw-year-search-container", container.addEventListener("mouseover", e => e.stopPropagation()), 
      container.addEventListener("mouseenter", e => e.stopPropagation());
      for (let year = endYear; year >= startYear; year--) {
        const btn = document.createElement("div");
        btn.className = "tw-year-btn", btn.textContent = `${year}年`, btn.onclick = e => {
          e.preventDefault(), e.stopPropagation();
          const searchUrl = `https://x.com/search?q=from%3A${username}%20since%3A${year}-01-01%20until%3A${year + 1}-01-01&src=typed_query&f=media`;
          window.open(searchUrl, "_blank");
        }, container.appendChild(btn);
      }
      parent.appendChild(container);
    }
  }
  (class {
    static main() {
      "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", this.initialize.bind(this)) : this.initialize();
    }
    static initialize() {
      try {
        (new TwitterReadMark).init(), (new FloatingToolbar).init(), (new ProfileYearSearch).init(), 
        GistSync.autoBackup();
      } catch (error) {}
    }
  }).main();
}();
