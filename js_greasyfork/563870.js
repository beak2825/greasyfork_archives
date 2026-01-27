// ==UserScript==
// @name         Instagram-助手
// @version      1.0.0
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  Instagram 帖子已读标记、大图拖拽解锁
// @match        *://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @license      GPL-3.0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.github.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563870/Instagram-%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563870/Instagram-%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

!function() {
  "use strict";
  const CONFIG_GIST_TOKEN_KEY = "instagram_gist_token", CONFIG_GIST_ID_KEY = "instagram_gist_id", CONFIG_GIST_FILENAME = "instagram_backup.json", CONFIG_GIST_DESCRIPTION = "Instagram-助手 数据备份";
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
          onload: res => {
            if (res.status >= 200 && res.status < 300) resolve(res); else {
              let errorMessage = `请求失败 (${res.status})`;
              try {
                const data = JSON.parse(res.responseText);
                data.message && (errorMessage += `: ${data.message}`);
              } catch (e) {}
              reject(new Error(errorMessage));
            }
          },
          onerror: _ => reject(new Error("网络请求发生错误"))
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
  class InstagramReadMark {
    constructor() {
      this.observer = null, this.processedElements = new WeakSet, this.debounceTimer = null, 
      this.readMedia = this.getReadMedia();
    }
    init() {
      this.injectStyles(), this.setupObserver(), this.setupUrlListener(), this.processMediaItems();
    }
    getReadMedia() {
      try {
        const data = Storage.get("instagram_read_media", []) || [];
        return new Set(data);
      } catch (error) {
        return new Set;
      }
    }
    saveReadMedia() {
      try {
        Storage.set("instagram_read_media", Array.from(this.readMedia));
      } catch (error) {}
    }
    markAsRead(mediaId) {
      this.readMedia.has(mediaId) || (this.readMedia.add(mediaId), this.saveReadMedia());
    }
    isRead(mediaId) {
      return this.readMedia.has(mediaId);
    }
    extractMediaId(href) {
      if (!href) return null;
      const match = href.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
      return match ? match[1] : null;
    }
    processMediaItems() {
      this.unlockOverlayImages(), document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach(link => {
        if (this.processedElements.has(link)) return;
        if (!(link.querySelector("img") || link.querySelector("video") || link.querySelector("._aagv"))) return;
        const mediaId = this.extractMediaId(link.getAttribute("href") || "");
        mediaId && (this.processedElements.add(link), link.addEventListener("click", _ => {
          this.markAsRead(mediaId), this.applyReadMask(link), document.activeElement?.blur?.();
        }, !0), this.isRead(mediaId) && this.applyReadMask(link));
      });
    }
    applyReadMask(container) {
      const maskClass = "instagram-media-container-mask";
      if (container.querySelector(`.${maskClass}`)) return;
      let targetContainer = container.querySelector("._aagu, ._aagv, ._aa-i, .x1iyjqo2");
      targetContainer || (targetContainer = container);
      const mask = document.createElement("div");
      mask.className = maskClass, "static" === window.getComputedStyle(targetContainer).position && (targetContainer.style.position = "relative"), 
      targetContainer.appendChild(mask), targetContainer.classList.add("instagram-media-container-read-container");
    }
    unlockOverlayImages() {
      const dialogs = document.querySelectorAll('div[role="dialog"]');
      0 !== dialogs.length && dialogs.forEach(dialog => {
        dialog.querySelectorAll("img").forEach(img => {
          if (img.dataset.igUnlocked) return;
          img.style.pointerEvents = "auto", img.style.userSelect = "auto", img.style.webkitUserDrag = "element", 
          img.setAttribute("draggable", "true");
          const parent = img.closest("._aagv");
          parent && Array.from(parent.children).forEach(child => {
            child !== img && "VIDEO" !== child.tagName && (child.style.pointerEvents = "none");
          }), img.dataset.igUnlocked = "true";
        });
      });
    }
    setupObserver() {
      this.observer = new MutationObserver(mutations => {
        let shouldProcess = !1;
        for (const m of mutations) if (m.addedNodes.length > 0) {
          shouldProcess = !0;
          break;
        }
        shouldProcess && this.debounceProcess();
      }), this.observer.observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }
    debounceProcess() {
      this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = window.setTimeout(() => this.processMediaItems(), 200);
    }
    setupUrlListener() {
      let lastUrl = window.location.href;
      setInterval(() => {
        window.location.href !== lastUrl && (lastUrl = window.location.href, this.processMediaItems()), 
        this.processMediaItems();
      }, 1e3);
    }
    injectStyles() {
      const maskClass = "instagram-media-container-mask";
      addStyles(`\n            /* 蒙层主体 - 修正 z-index 确保在图片之上 */\n            .${maskClass} {\n                position: absolute;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                background-color: rgba(0, 0, 0, 0.25); /* 降低浓度，淡淡变暗即可 */\n                z-index: 15; /* 必须高于图片的 10 */\n                pointer-events: none; /* 让点击穿透 */\n                transition: opacity 0.2s;\n                display: block !important;\n            }\n\n            /* ========== 拖拽解锁核心 ========== */\n            /* 针对 IG 图片容器 _aagv */\n            \n            /* 容器内非媒体元素（即遮罩层），全部穿透 */\n            ._aagv > *:not(img):not(video) {\n                pointer-events: none !important; \n            }\n\n            /* 针对轮播图等大图模式下的额外遮挡层 - 仅限大图模式下生效，避免误伤 */\n            div[role="dialog"] .xyxf0pu, \n            div[role="dialog"] .x1vjfegm { \n                pointer-events: none !important; \n            }\n\n            /* 媒体元素本身，恢复响应，允许拖拽 (z-index 设置为 10) */\n            ._aagv > img, \n            ._aagv > video {\n                pointer-events: auto !important;\n                z-index: 10 !important;\n                transition: opacity 0.2s;\n            }\n\n            /* 已读角标 - 确保在最顶层 */\n            .${maskClass}::after {\n                content: '✓';\n                position: absolute;\n                top: 8px;\n                right: 8px;\n                background: #0095f6;\n                color: white;\n                width: 24px;\n                height: 24px;\n                border-radius: 50%;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                font-size: 14px;\n                font-weight: 800;\n                box-shadow: 0 2px 6px rgba(0,0,0,0.3);\n                z-index: 20;\n                border: 2px solid white;\n            }\n\n            /* 兼容性修复：如果 a 标签没有正确建立堆叠上下文 */\n            .instagram-media-container-read-container {\n                position: relative !important;\n                overflow: hidden;\n            }\n        `, "ig-read-mark-styles");
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
        readMedia: Storage.get("instagram_read_media", []) || []
      };
    }
    static mergeArrays(local, remote) {
      return [ ...new Set([ ...local, ...remote ]) ];
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
            const remoteData = JSON.parse(remoteFile.content), mergedReadMedia = this.mergeArrays(localData.readMedia, remoteData.readMedia || []);
            Storage.set("instagram_read_media", mergedReadMedia), localData.readMedia = mergedReadMedia;
          }
          await GistAPI.updateFile(token, gistId, CONFIG_GIST_FILENAME, JSON.stringify(localData, null, 2));
        } else gistId = await GistAPI.createGist(token, CONFIG_GIST_FILENAME, JSON.stringify(localData, null, 2), CONFIG_GIST_DESCRIPTION), 
        Storage.set(CONFIG_GIST_ID_KEY, gistId);
        Toast.success("同步完成！本地与云端已保持一致");
      } catch (error) {
        Toast.error(`同步失败: ${error.message || "请检查 Token 和网络"}`);
      } else Toast.error("请先配置 GitHub Token");
    }
    static async download() {
      await this.upload();
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
  }
  class FloatingToolbar {
    constructor() {
      this.container = null, this.scrollPositions = {}, this.saveScrollTimer = null, this.isScrollingToBottom = !1, 
      this.scrollToBottomTimer = null, this.noChangeCount = 0, this.ICONS = {
        RESTORE: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        BOTTOM: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><line x1="12" y1="5" x2="12" y1="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>',
        BACKUP: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M17.5 19c3.04 0 5.5-2.46 5.5-5.5 0-2.6-1.8-4.78-4.23-5.32A7 7 0 1 0 5.14 11.23C2.7 11.78 1 13.9 1 16.5c0 3.04 2.46 5.5 5.5 5.5"></path><polyline points="12 12 12 21"></polyline><path d="M12 12v9"></path><path d="M16 16l-4-4-4 4"></path></svg>',
        SETTINGS: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
      }, this.loadScrollPositions();
    }
    init() {
      this.injectStyles(), this.createToolbar(), this.setupScrollSave(), this.setupUrlListener();
    }
    setupUrlListener() {
      const self = this;
      let lastUrl = window.location.href;
      setInterval(() => {
        window.location.href !== lastUrl && (lastUrl = window.location.href, self.onUrlChange());
      }, 1e3);
    }
    onUrlChange() {
      setTimeout(() => this.updateButtons(), 500), setTimeout(() => this.updateButtons(), 2e3);
    }
    loadScrollPositions() {
      try {
        this.scrollPositions = Storage.get("instagram_scroll_positions", {}) || {};
      } catch (e) {
        this.scrollPositions = {};
      }
    }
    saveScrollPositions() {
      Storage.set("instagram_scroll_positions", this.scrollPositions);
    }
    extractUsername() {
      const match = window.location.href.match(/instagram\.com\/([^\/\?]+)/);
      return match && ![ "p", "reel", "stories", "explore", "direct", "accounts", "developer", "about", "legal" ].includes(match[1]) ? match[1] : null;
    }
    setupScrollSave() {
      window.addEventListener("scroll", () => {
        this.isScrollingToBottom || (this.saveScrollTimer && clearTimeout(this.saveScrollTimer), 
        this.saveScrollTimer = window.setTimeout(() => {
          const username = this.extractUsername();
          username && (this.scrollPositions[username] = window.scrollY, this.saveScrollPositions(), 
          this.updateButtons());
        }, 500));
      });
    }
    createToolbar() {
      this.container || (this.container = document.createElement("div"), this.container.id = "ig-assistant-toolbar", 
      this.container.innerHTML = `\n            <button id="ig-restore-btn" class="ig-tool-btn" title="恢复上次位置">\n                <div class="ig-btn-icon-box">${this.ICONS.RESTORE}</div>\n                <div class="ig-btn-label">恢复</div>\n            </button>\n            <button id="ig-bottom-btn" class="ig-tool-btn" title="一键触底">\n                <div class="ig-btn-icon-box">${this.ICONS.BOTTOM}</div>\n                <div class="ig-btn-label">触底</div>\n            </button>\n            <button id="ig-backup-btn" class="ig-tool-btn" title="备份到 Gist">\n                <div class="ig-btn-icon-box">${this.ICONS.BACKUP}</div>\n                <div class="ig-btn-label">备份</div>\n            </button>\n            <button id="ig-config-btn" class="ig-tool-btn" title="设置">\n                <div class="ig-btn-icon-box">${this.ICONS.SETTINGS}</div>\n                <div class="ig-btn-label">设置</div>\n            </button>\n        `, 
      document.body.appendChild(this.container), this.bindEvents(), this.updateButtons());
    }
    injectStyles() {
      addStyles("\n            #ig-assistant-toolbar {\n                position: fixed;\n                bottom: 100px;\n                right: 24px;\n                display: flex;\n                flex-direction: column;\n                gap: 12px;\n                z-index: 9999;\n            }\n\n            .ig-tool-btn {\n                width: 52px;\n                height: 52px;\n                border-radius: 12px; /* 圆角矩形 */\n                background-color: white;\n                border: 1px solid #dbdbdb;\n                box-shadow: 0 4px 12px rgba(0,0,0,0.08); /* 更柔和的阴影 */\n                cursor: pointer;\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                justify-content: center;\n                transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);\n                color: #262626;\n                padding: 0;\n            }\n\n            .ig-btn-icon-box {\n                height: 22px;\n                display: flex;\n                align-items: center;\n            }\n\n            .ig-btn-label {\n                font-size: 10px;\n                font-weight: 600;\n                margin-top: 2px;\n                line-height: 1;\n                transform: scale(0.9); /* 微缩文字，显得更精致 */\n            }\n\n            /* 深色模式适配 */\n            @media (prefers-color-scheme: dark) {\n                .ig-tool-btn {\n                    background-color: #000;\n                    border-color: #363636;\n                    color: #f5f5f5;\n                    box-shadow: 0 4px 12px rgba(255,255,255,0.05);\n                }\n                .ig-tool-btn:hover { background-color: #1a1a1a; }\n            }\n\n            .ig-tool-btn:hover {\n                transform: translateY(-2px); /* 悬浮微动 */\n                border-color: #a8a8a8;\n                box-shadow: 0 6px 16px rgba(0,0,0,0.12);\n            }\n\n            .ig-tool-btn.disabled {\n                opacity: 0.4;\n                cursor: default;\n                filter: grayscale(1);\n                pointer-events: none;\n                transform: none;\n            }\n\n            .ig-spin .ig-btn-icon-box {\n                animation: ig-spin-anim 1s linear infinite;\n            }\n            @keyframes ig-spin-anim {\n                from { transform: rotate(0deg); }\n                to { transform: rotate(360deg); }\n            }\n        ", "ig-assistant-toolbar-styles");
    }
    bindEvents() {
      document.getElementById("ig-restore-btn")?.addEventListener("click", () => this.restorePosition()), 
      document.getElementById("ig-bottom-btn")?.addEventListener("click", () => this.toggleScrollToBottom()), 
      document.getElementById("ig-backup-btn")?.addEventListener("click", () => this.doBackup()), 
      document.getElementById("ig-config-btn")?.addEventListener("click", () => GistSync.showSettings());
    }
    updateButtons() {
      const username = this.extractUsername(), restoreBtn = document.getElementById("ig-restore-btn");
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
        }), setTimeout(scrollStep, 300));
      };
      scrollStep();
    }
    toggleScrollToBottom() {
      this.isScrollingToBottom ? this.stopScroll() : this.startScroll();
    }
    startScroll() {
      this.isScrollingToBottom = !0, document.getElementById("ig-bottom-btn")?.classList.add("ig-spin"), 
      Toast.info("开始自动加载..."), this.autoScrollStep();
    }
    stopScroll() {
      this.isScrollingToBottom = !1, this.scrollToBottomTimer && clearTimeout(this.scrollToBottomTimer), 
      document.getElementById("ig-bottom-btn")?.classList.remove("ig-spin"), Toast.success("已停止");
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
      }, 2e3);
    }
    async doBackup() {
      const btn = document.getElementById("ig-backup-btn");
      btn?.classList.add("ig-spin"), await GistSync.upload(), btn?.classList.remove("ig-spin");
    }
  }
  (class {
    static main() {
      "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", this.initialize.bind(this)) : this.initialize();
    }
    static initialize() {
      try {
        const currentUrl = window.location.href;
        this.isInstagramPage(currentUrl) && ((new InstagramReadMark).init(), (new FloatingToolbar).init());
      } catch (error) {}
    }
    static isInstagramPage(url) {
      return url.includes("instagram.com");
    }
  }).main();
}();
