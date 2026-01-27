// ==UserScript==
// @name         JAVLibrary-助手
// @version      1.0.0
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  JAV Library 帖子已读标记、收藏、划词高亮
// @match        *://www.javlibrary.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javlibrary.com
// @license      GPL-3.0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.github.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549829/JAVLibrary-%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549829/JAVLibrary-%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

!function() {
  "use strict";
  const CONFIG_STYLES_READ_TOPIC = {
    opacity: "0.6",
    background: "#f0f0f0",
    color: "#888"
  }, CONFIG_STYLES_READ_BADGE = {
    color: "#666",
    fontSize: "12px",
    marginLeft: "8px",
    fontWeight: "normal"
  }, CONFIG_STYLES_UNFINISHED_BADGE = {
    color: "#d2691e",
    fontSize: "12px",
    marginLeft: "8px",
    fontWeight: "bold"
  }, CONFIG_STYLES_UNFINISHED_TOPIC = {
    opacity: "1",
    background: "#fff7e6",
    color: "#c05000"
  }, CONFIG_STYLES_FAV_BUTTON = {
    color: "#999",
    fontSize: "12px",
    marginLeft: "4px",
    fontWeight: "normal",
    cursor: "pointer",
    textDecoration: "underline"
  }, CONFIG_STYLES_HIGHLIGHT_WORD = {
    background: "#fffb8f",
    color: "#d48806",
    padding: "0 2px",
    borderRadius: "2px"
  }, CONFIG_SELECTORS_topicLinks = 'a.topictitle[href*="publictopic.php"]', CONFIG_SELECTORS_allTopicLinks = 'a[href*="publictopic.php"]', CONFIG_REGEX_topicId = /publictopic\.php\?id=(\d+)/, CONFIG_TEXT_readBadge = "[已读]", CONFIG_TEXT_unfinishedBadge = "[已读未完]", CONFIG_TEXT_favButton = "[收藏]", CONFIG_TEXT_unfavButton = "[取消收藏]", CONFIG_GIST_TOKEN_KEY = "jav_gist_token", CONFIG_GIST_ID_KEY = "jav_gist_id", CONFIG_GIST_FILENAME = "jav_library_backup.json", CONFIG_GIST_DESCRIPTION = "JAVLibrary-助手 数据备份", CONFIG_GIST_LAST_BACKUP_KEY = "jav_gist_last_backup";
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
    static listKeys() {
      try {
        return GM_listValues();
      } catch (error) {
        return [];
      }
    }
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
            res.status >= 200 && res.status < 300 ? resolve(res) : reject(res);
          },
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
      return this.container || (this.container = document.createElement("div"), this.container.id = "toast-container", 
      Object.assign(this.container.style, {
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
      }[type], toast.addEventListener("click", () => this.removeToast(toast)), container.appendChild(toast), 
      setTimeout(() => {
        toast.style.opacity = "1", toast.style.transform = "translateX(0)";
      }, 10), duration > 0 && setTimeout(() => this.removeToast(toast), duration), toast;
    }
    static removeToast(toast) {
      toast.style.opacity = "0", toast.style.transform = "translateX(100%)", setTimeout(() => toast.remove(), 300);
    }
    static success(message, duration = 4e3) {
      return this.show(message, "success", duration);
    }
    static error(message, duration = 5e3) {
      return this.show(message, "error", duration);
    }
    static warning(message, duration = 4e3) {
      return this.show(message, "warning", duration);
    }
    static info(message, duration = 3e3) {
      return this.show(message, "info", duration);
    }
  };
  _Toast.container = null;
  let Toast = _Toast;
  function extractTopicId(url) {
    const match = url.match(CONFIG_REGEX_topicId);
    return match ? match[1] : null;
  }
  function getReadTopics() {
    try {
      const data = Storage.get("jav_read_topics", []) || [];
      return new Set(data);
    } catch (error) {
      return new Set;
    }
  }
  function getUnfinishedTopics() {
    try {
      const data = Storage.get("jav_unfinished_topics", []) || [];
      return new Set(data);
    } catch (error) {
      return new Set;
    }
  }
  function saveUnfinishedTopics(unfinishedTopics) {
    try {
      Storage.set("jav_unfinished_topics", Array.from(unfinishedTopics));
    } catch (error) {}
  }
  function getHighlightWords(topicId) {
    try {
      return (Storage.get("jav_highlight_words", {}) || {})[topicId] || [];
    } catch (error) {
      return [];
    }
  }
  function setHighlightWords(topicId, words) {
    try {
      const all = Storage.get("jav_highlight_words", {}) || {};
      all[topicId] = Array.from(new Set(words.filter(w => w && w.trim().length > 0))), 
      Storage.set("jav_highlight_words", all);
    } catch (error) {}
  }
  class ReadMarkManager {
    constructor() {
      this.lastSelectMouseDownX = null, this.lastSelectMouseDownY = null, this.lastSelectMouseDownTime = null, 
      this.lastClickTime = 0, this.lastUnhighlightedText = null, this.readTopics = getReadTopics(), 
      this.unfinishedTopics = getUnfinishedTopics();
    }
    init() {
      "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", () => {
        this.handleCurrentPage();
      }) : this.handleCurrentPage();
    }
    handleCurrentPage() {
      const currentUrl = window.location.href;
      currentUrl.includes("publicgroupsearch.php") || currentUrl.includes("publicgroup.php") ? (this.setupReadMarks(), 
      this.bindEvents()) : currentUrl.includes("publictopic.php") && this.markCurrentTopicAsRead();
    }
    markCurrentTopicAsRead() {
      const topicId = extractTopicId(window.location.href);
      if (topicId) {
        this.markAsRead(topicId);
        const titleLink = document.querySelector(CONFIG_SELECTORS_topicLinks);
        titleLink && (this.markAsReadVisually(titleLink, topicId), this.isUnfinished(topicId) && this.markAsUnfinishedVisually(titleLink, topicId)), 
        this.initContentHighlight(topicId);
      }
    }
    initContentHighlight(topicId) {
      const contentRoot = document.querySelector("div#video_jacket, div#video, table#video_jacket, table#video, body");
      if (!contentRoot) return;
      const savedWords = getHighlightWords(topicId);
      savedWords.length > 0 && savedWords.forEach(word => {
        this.applyHighlightToContent(contentRoot, word);
      }), document.addEventListener("mousedown", event => {
        if (0 !== event.button) return this.lastSelectMouseDownX = null, this.lastSelectMouseDownY = null, 
        void (this.lastSelectMouseDownTime = null);
        const target = event.target;
        target && contentRoot.contains(target) ? (this.lastSelectMouseDownX = event.clientX, 
        this.lastSelectMouseDownY = event.clientY, this.lastSelectMouseDownTime = Date.now()) : (this.lastSelectMouseDownX = null, 
        this.lastSelectMouseDownY = null, this.lastSelectMouseDownTime = null);
      }), document.addEventListener("mouseup", event => {
        if (0 !== event.button) return;
        const selection = window.getSelection();
        if (!selection) return;
        const text = selection.toString().trim();
        if (!text) return;
        if (!this.isSelectionInsideRoot(selection, contentRoot)) return;
        const savedText = text;
        let words = getHighlightWords(topicId);
        if (null === this.lastSelectMouseDownX || null === this.lastSelectMouseDownY || null === this.lastSelectMouseDownTime) return;
        const now = Date.now(), timeDiff = now - this.lastSelectMouseDownTime, deltaX = event.clientX - this.lastSelectMouseDownX, deltaY = Math.abs(event.clientY - this.lastSelectMouseDownY), isDoubleClick = now - this.lastClickTime < 300 && Math.abs(deltaX) < 5 && deltaY < 5;
        if (this.lastClickTime = now, !isDoubleClick) {
          if (deltaX > 10 && deltaY < 50 && timeDiff > 50 && timeDiff < 3e3) {
            if (this.lastUnhighlightedText && this.lastUnhighlightedText.text === text && now - this.lastUnhighlightedText.timestamp < 5e3) return;
            if (!this.isValidCodeNumber(text)) return;
            return this.copyToClipboard(text), this.removeHighlightFromContent(contentRoot, text), 
            words.includes(text) || (words = [ ...words, text ], setHighlightWords(topicId, words)), 
            this.applyHighlightToContentWithLink(contentRoot, text), void setTimeout(() => {
              this.restoreSelection(contentRoot, savedText);
            }, 10);
          }
          deltaX < -10 && deltaY < 50 && timeDiff > 50 && timeDiff < 3e3 && (words.includes(text) || this.hasHighlightInContent(contentRoot, text)) && (words = words.filter(w => w !== text), 
          setHighlightWords(topicId, words), this.removeHighlightFromContent(contentRoot, text), 
          this.lastUnhighlightedText = {
            text: text,
            timestamp: Date.now()
          }, setTimeout(() => {
            this.restoreSelectionForText(contentRoot, savedText);
          }, 10));
        }
      });
    }
    applyHighlightToContent(root, word) {
      if (!word) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), toProcess = [];
      for (;walker.nextNode(); ) {
        const node = walker.currentNode;
        if (node.nodeValue && node.nodeValue.includes(word)) {
          if (node.parentElement) {
            const parent = node.parentElement;
            if (parent.dataset && "true" === parent.dataset.javHighlight || "A" === parent.tagName && "true" === parent.dataset.javHighlightLink) continue;
          }
          toProcess.push(node);
        }
      }
      toProcess.forEach(textNode => {
        const parent = textNode.parentElement;
        if (!parent) return;
        const parts = textNode.nodeValue.split(word);
        if (parts.length <= 1) return;
        const frag = document.createDocumentFragment();
        parts.forEach((part, index) => {
          if (part && frag.appendChild(document.createTextNode(part)), index < parts.length - 1) {
            const span = document.createElement("span");
            span.dataset.javHighlight = "true", span.textContent = word, span.style.background = CONFIG_STYLES_HIGHLIGHT_WORD.background, 
            span.style.color = CONFIG_STYLES_HIGHLIGHT_WORD.color, span.style.padding = CONFIG_STYLES_HIGHLIGHT_WORD.padding, 
            span.style.borderRadius = CONFIG_STYLES_HIGHLIGHT_WORD.borderRadius, frag.appendChild(span);
          }
        }), parent.replaceChild(frag, textNode);
      });
    }
    applyHighlightToContentWithLink(root, word) {
      if (!word) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), toProcess = [];
      for (;walker.nextNode(); ) {
        const node = walker.currentNode;
        if (node.nodeValue && node.nodeValue.includes(word)) {
          if (node.parentElement) {
            const parent = node.parentElement;
            if (parent.dataset && "true" === parent.dataset.javHighlight || "A" === parent.tagName && "true" === parent.dataset.javHighlightLink) continue;
          }
          toProcess.push(node);
        }
      }
      toProcess.forEach(textNode => {
        const parent = textNode.parentElement;
        if (!parent) return;
        const parts = textNode.nodeValue.split(word);
        if (parts.length <= 1) return;
        const frag = document.createDocumentFragment();
        parts.forEach((part, index) => {
          if (part && frag.appendChild(document.createTextNode(part)), index < parts.length - 1) {
            const link = document.createElement("a");
            link.dataset.javHighlightLink = "true", link.textContent = word, link.href = `https://javdb.com/search?q=${encodeURIComponent(word)}&f=all`, 
            link.target = "_blank", link.rel = "noopener noreferrer", link.style.background = CONFIG_STYLES_HIGHLIGHT_WORD.background, 
            link.style.color = CONFIG_STYLES_HIGHLIGHT_WORD.color, link.style.padding = CONFIG_STYLES_HIGHLIGHT_WORD.padding, 
            link.style.borderRadius = CONFIG_STYLES_HIGHLIGHT_WORD.borderRadius, link.style.textDecoration = "underline", 
            link.style.cursor = "pointer", link.addEventListener("click", event => {
              event.preventDefault(), event.stopPropagation(), GM_openInTab(link.href, {
                active: !0,
                insert: !0
              });
              const span = document.createElement("span");
              span.dataset.javHighlight = "true", span.textContent = word, span.style.background = CONFIG_STYLES_HIGHLIGHT_WORD.background, 
              span.style.color = CONFIG_STYLES_HIGHLIGHT_WORD.color, span.style.padding = CONFIG_STYLES_HIGHLIGHT_WORD.padding, 
              span.style.borderRadius = CONFIG_STYLES_HIGHLIGHT_WORD.borderRadius;
              const linkParent = link.parentElement;
              linkParent && linkParent.replaceChild(span, link);
            }), frag.appendChild(link);
          }
        }), parent.replaceChild(frag, textNode);
      });
    }
    removeHighlightFromContent(root, word) {
      word && (root.querySelectorAll('span[data-jav-highlight="true"]').forEach(span => {
        if (span.textContent === word) {
          const textNode = document.createTextNode(span.textContent || ""), parent = span.parentElement;
          if (!parent) return;
          parent.replaceChild(textNode, span), parent.normalize();
        }
      }), root.querySelectorAll('a[data-jav-highlight-link="true"]').forEach(link => {
        if (link.textContent === word) {
          const textNode = document.createTextNode(link.textContent || ""), parent = link.parentElement;
          if (!parent) return;
          parent.replaceChild(textNode, link), parent.normalize();
        }
      }));
    }
    copyToClipboard(text) {
      navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text).catch(() => {
        this.fallbackCopyToClipboard(text);
      }) : this.fallbackCopyToClipboard(text);
    }
    fallbackCopyToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text, textArea.style.position = "fixed", textArea.style.top = "-1000px", 
      textArea.style.left = "-1000px", document.body.appendChild(textArea), textArea.focus(), 
      textArea.select();
      try {
        document.execCommand("copy");
      } catch (err) {}
      document.body.removeChild(textArea);
    }
    hasHighlightInContent(root, word) {
      if (!word) return !1;
      const links = root.querySelectorAll('a[data-jav-highlight-link="true"]');
      for (const link of Array.from(links)) if (link.textContent === word) return !0;
      const spans = root.querySelectorAll('span[data-jav-highlight="true"]');
      for (const span of Array.from(spans)) if (span.textContent === word) return !0;
      return !1;
    }
    restoreSelection(root, text) {
      if (!text) return;
      const selection = window.getSelection();
      if (!selection) return;
      const linkElements = root.querySelectorAll('a[data-jav-highlight-link="true"]');
      let targetElement = null;
      for (const link of Array.from(linkElements)) if (link.textContent === text) {
        targetElement = link;
        break;
      }
      if (!targetElement) {
        const spanElements = root.querySelectorAll('span[data-jav-highlight="true"]');
        for (const span of Array.from(spanElements)) if (span.textContent === text) {
          targetElement = span;
          break;
        }
      }
      if (targetElement) try {
        const range = document.createRange();
        range.selectNodeContents(targetElement), selection.removeAllRanges(), selection.addRange(range);
      } catch (err) {}
    }
    restoreSelectionForText(contentRoot, text) {
      if (!text) return;
      const selection = window.getSelection();
      if (!selection) return;
      const walker = document.createTreeWalker(contentRoot, NodeFilter.SHOW_TEXT, null);
      let targetTextNode = null;
      for (;walker.nextNode(); ) {
        const node = walker.currentNode;
        if (node.nodeValue && node.nodeValue.includes(text)) {
          const parent = node.parentElement;
          if (parent && ("true" === parent.dataset?.javHighlight || "true" === parent.dataset?.javHighlightLink)) continue;
          targetTextNode = node;
          break;
        }
      }
      if (targetTextNode && targetTextNode.nodeValue) try {
        const index = targetTextNode.nodeValue.indexOf(text);
        if (-1 !== index) {
          const range = document.createRange();
          range.setStart(targetTextNode, index), range.setEnd(targetTextNode, index + text.length), 
          selection.removeAllRanges(), selection.addRange(range);
        }
      } catch (err) {}
    }
    isSelectionInsideRoot(selection, root) {
      const anchorNode = selection.anchorNode, focusNode = selection.focusNode;
      return !(!anchorNode || !focusNode) && root.contains(anchorNode) && root.contains(focusNode);
    }
    isValidCodeNumber(text) {
      if (!text || 0 === text.trim().length) return !1;
      const trimmedText = text.trim();
      if (/[\u4e00-\u9fa5]/.test(trimmedText)) return !1;
      if (/^(https?:\/\/|ftp:\/\/|www\.|magnet:|ed2k:|thunder:)/i.test(trimmedText)) return !1;
      if (trimmedText.includes("://") || trimmedText.includes("www.") || trimmedText.match(/\.(com|net|org|cn|co|io|me|tv|cc|xyz|top|site|online|info|app|dev)(\/|$|\?|#)/i)) return !1;
      const hasLetter = /[a-zA-Z]/.test(trimmedText), hasNumber = /\d/.test(trimmedText);
      return !!(hasLetter && hasNumber && trimmedText.length >= 3 && trimmedText.length <= 50);
    }
    setupReadMarks() {
      let topicLinks = document.querySelectorAll(CONFIG_SELECTORS_topicLinks);
      0 === topicLinks.length && (topicLinks = document.querySelectorAll(CONFIG_SELECTORS_allTopicLinks)), 
      topicLinks.forEach(link => {
        const linkElement = link;
        linkElement.target = "_blank", linkElement.rel = "noopener noreferrer";
        const topicId = extractTopicId(linkElement.href);
        topicId && (this.isRead(topicId) && this.markAsReadVisually(linkElement, topicId), 
        this.isUnfinished(topicId) && this.markAsUnfinishedVisually(linkElement, topicId));
      });
    }
    bindEvents() {
      let mouseDownInfo = null;
      document.addEventListener("mousedown", event => {
        mouseDownInfo = {
          time: Date.now(),
          x: event.clientX,
          y: event.clientY,
          target: event.target
        };
      }), document.addEventListener("click", event => {
        const target = event.target;
        if (target.closest('span[data-read-fav-button="true"]')) return;
        const link = target.closest(CONFIG_SELECTORS_allTopicLinks);
        if (link && 0 === event.button) {
          const topicId = extractTopicId(link.href);
          topicId && this.isValidClick(event, mouseDownInfo) && (this.markAsRead(topicId), 
          this.markAsReadVisually(link, topicId));
        }
      }), document.addEventListener("auxclick", event => {
        const link = event.target.closest(CONFIG_SELECTORS_allTopicLinks);
        if (link && 1 === event.button) {
          const topicId = extractTopicId(link.href);
          topicId && (this.markAsRead(topicId), this.markAsReadVisually(link, topicId));
        }
      }), document.addEventListener("contextmenu", event => {
        const link = event.target.closest(CONFIG_SELECTORS_allTopicLinks);
        if (link) {
          const topicId = extractTopicId(link.href);
          topicId && setTimeout(() => {
            this.markAsRead(topicId), this.markAsReadVisually(link, topicId);
          }, 100);
        }
      }), document.addEventListener("click", event => {
        const link = event.target.closest(CONFIG_SELECTORS_allTopicLinks);
        if (link && (event.ctrlKey || event.metaKey)) {
          const topicId = extractTopicId(link.href);
          topicId && (this.markAsRead(topicId), this.markAsReadVisually(link, topicId));
        }
      });
    }
    isValidClick(event, mouseDownInfo) {
      if (!mouseDownInfo) return !0;
      const timeDiff = Date.now() - mouseDownInfo.time, distance = Math.sqrt(Math.pow(event.clientX - mouseDownInfo.x, 2) + Math.pow(event.clientY - mouseDownInfo.y, 2)), selection = window.getSelection();
      return !(selection && selection.toString().length > 0 || timeDiff > 500 || distance > 5);
    }
    markAsRead(topicId) {
      this.isRead(topicId) || (this.readTopics.add(topicId), function(topicId) {
        const readTopics = getReadTopics();
        readTopics.add(topicId), function(readTopics) {
          try {
            Storage.set("jav_read_topics", Array.from(readTopics));
          } catch (error) {}
        }(readTopics);
      }(topicId));
    }
    isRead(topicId) {
      return this.readTopics.has(topicId) || function(topicId) {
        return getReadTopics().has(topicId);
      }(topicId);
    }
    isUnfinished(topicId) {
      return this.unfinishedTopics.has(topicId) || function(topicId) {
        return getUnfinishedTopics().has(topicId);
      }(topicId);
    }
    markAsReadVisually(link, topicId) {
      if ("true" === link.dataset.readMarked) return;
      link.dataset.readMarked = "true";
      let badge = link.querySelector('span[data-read-badge="true"]');
      badge || (badge = document.createElement("span"), badge.dataset.readBadge = "true", 
      link.appendChild(badge)), badge.textContent = CONFIG_TEXT_readBadge, badge.style.color = CONFIG_STYLES_READ_BADGE.color, 
      badge.style.fontSize = CONFIG_STYLES_READ_BADGE.fontSize, badge.style.marginLeft = CONFIG_STYLES_READ_BADGE.marginLeft, 
      badge.style.fontWeight = CONFIG_STYLES_READ_BADGE.fontWeight;
      let favBtn = link.querySelector('span[data-read-fav-button="true"]');
      favBtn ? favBtn.textContent = this.isUnfinished(topicId) ? CONFIG_TEXT_unfavButton : CONFIG_TEXT_favButton : (favBtn = document.createElement("span"), 
      favBtn.dataset.readFavButton = "true", favBtn.textContent = CONFIG_TEXT_favButton, 
      favBtn.style.color = CONFIG_STYLES_FAV_BUTTON.color, favBtn.style.fontSize = CONFIG_STYLES_FAV_BUTTON.fontSize, 
      favBtn.style.marginLeft = CONFIG_STYLES_FAV_BUTTON.marginLeft, favBtn.style.fontWeight = CONFIG_STYLES_FAV_BUTTON.fontWeight, 
      favBtn.style.cursor = CONFIG_STYLES_FAV_BUTTON.cursor, favBtn.style.textDecoration = CONFIG_STYLES_FAV_BUTTON.textDecoration, 
      favBtn.addEventListener("click", event => {
        event.stopPropagation(), event.preventDefault();
        const id = topicId || extractTopicId(link.href);
        id && (this.isUnfinished(id) ? (this.unfinishedTopics.delete(id), function(topicId) {
          const unfinishedTopics = getUnfinishedTopics();
          unfinishedTopics.has(topicId) && (unfinishedTopics.delete(topicId), saveUnfinishedTopics(unfinishedTopics));
        }(id), this.restoreReadVisualState(link)) : (this.unfinishedTopics.add(id), function(topicId) {
          const unfinishedTopics = getUnfinishedTopics();
          unfinishedTopics.add(topicId), saveUnfinishedTopics(unfinishedTopics);
        }(id), this.markAsUnfinishedVisually(link, id)));
      }), link.appendChild(favBtn)), this.applyRowStyle(link, CONFIG_STYLES_READ_TOPIC);
    }
    markAsUnfinishedVisually(link, topicId) {
      let badge = link.querySelector('span[data-read-badge="true"]');
      badge || (badge = document.createElement("span"), badge.dataset.readBadge = "true", 
      link.appendChild(badge)), badge.textContent = CONFIG_TEXT_unfinishedBadge, badge.style.color = CONFIG_STYLES_UNFINISHED_BADGE.color, 
      badge.style.fontSize = CONFIG_STYLES_UNFINISHED_BADGE.fontSize, badge.style.marginLeft = CONFIG_STYLES_UNFINISHED_BADGE.marginLeft, 
      badge.style.fontWeight = CONFIG_STYLES_UNFINISHED_BADGE.fontWeight;
      const favBtn = link.querySelector('span[data-read-fav-button="true"]');
      favBtn && (favBtn.textContent = CONFIG_TEXT_unfavButton), this.applyRowStyle(link, CONFIG_STYLES_UNFINISHED_TOPIC);
    }
    restoreReadVisualState(link) {
      const badge = link.querySelector('span[data-read-badge="true"]');
      badge && (badge.textContent = CONFIG_TEXT_readBadge, badge.style.color = CONFIG_STYLES_READ_BADGE.color, 
      badge.style.fontSize = CONFIG_STYLES_READ_BADGE.fontSize, badge.style.marginLeft = CONFIG_STYLES_READ_BADGE.marginLeft, 
      badge.style.fontWeight = CONFIG_STYLES_READ_BADGE.fontWeight);
      const favBtn = link.querySelector('span[data-read-fav-button="true"]');
      favBtn && (favBtn.textContent = CONFIG_TEXT_favButton), this.applyRowStyle(link, CONFIG_STYLES_READ_TOPIC);
    }
    applyRowStyle(link, style) {
      const row = link.closest("tr");
      row && (void 0 !== style.opacity && (row.style.opacity = style.opacity), void 0 !== style.background && (row.style.background = style.background), 
      void 0 !== style.color && (row.style.color = style.color));
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
        readTopics: Storage.get("jav_read_topics", []) || [],
        unfinishedTopics: Storage.get("jav_unfinished_topics", []) || [],
        highlightWords: Storage.get("jav_highlight_words", {}) || {}
      };
    }
    static mergeArrays(local, remote) {
      return [ ...new Set([ ...local, ...remote ]) ];
    }
    static mergeHighlightWords(local, remote) {
      const result = {
        ...local
      };
      for (const key of Object.keys(remote)) result[key] = this.mergeArrays(result[key] || [], remote[key] || []);
      return result;
    }
    static async upload() {
      const token = this.getToken();
      let gistId = this.getGistId();
      if (token) try {
        Toast.info("正在上传...");
        const data = this.getBackupData(), content = JSON.stringify(data, null, 2);
        if (gistId) {
          const remoteFile = await GistAPI.getFile(token, gistId, CONFIG_GIST_FILENAME);
          if (remoteFile) {
            const remoteData = JSON.parse(remoteFile.content);
            data.readTopics = this.mergeArrays(data.readTopics, remoteData.readTopics || []), 
            data.unfinishedTopics = this.mergeArrays(data.unfinishedTopics, remoteData.unfinishedTopics || []), 
            data.highlightWords = this.mergeHighlightWords(data.highlightWords, remoteData.highlightWords || {});
          }
          await GistAPI.updateFile(token, gistId, CONFIG_GIST_FILENAME, JSON.stringify(data, null, 2));
        } else gistId = await GistAPI.createGist(token, CONFIG_GIST_FILENAME, content, CONFIG_GIST_DESCRIPTION), 
        Storage.set(CONFIG_GIST_ID_KEY, gistId);
        Toast.success(`上传成功！共 ${data.readTopics.length} 条已读记录`);
      } catch (error) {
        Toast.error("上传失败，请检查 Token 和网络");
      } else Toast.error("请先配置 GitHub Token");
    }
    static async download() {
      const token = this.getToken(), gistId = this.getGistId();
      if (token && gistId) try {
        Toast.info("正在下载...");
        const file = await GistAPI.getFile(token, gistId, CONFIG_GIST_FILENAME);
        if (!file) return void Toast.error("未找到备份文件");
        const remoteData = JSON.parse(file.content), localData = this.getBackupData(), mergedReadTopics = this.mergeArrays(localData.readTopics, remoteData.readTopics || []), mergedUnfinished = this.mergeArrays(localData.unfinishedTopics, remoteData.unfinishedTopics || []), mergedHighlight = this.mergeHighlightWords(localData.highlightWords, remoteData.highlightWords || {});
        Storage.set("jav_read_topics", mergedReadTopics), Storage.set("jav_unfinished_topics", mergedUnfinished), 
        Storage.set("jav_highlight_words", mergedHighlight), Toast.success(`下载成功！共 ${mergedReadTopics.length} 条已读记录`);
      } catch (error) {
        Toast.error("下载失败，请检查配置和网络");
      } else Toast.error("请先配置 GitHub Token 和 Gist ID");
    }
    static async autoBackup() {
      const token = this.getToken(), gistId = this.getGistId();
      if (!token || !gistId) return;
      const today = (new Date).toISOString().split("T")[0];
      if ((Storage.get(CONFIG_GIST_LAST_BACKUP_KEY, "") || "") !== today) try {
        const data = this.getBackupData();
        await GistAPI.updateFile(token, gistId, CONFIG_GIST_FILENAME, JSON.stringify(data, null, 2)), 
        Storage.set(CONFIG_GIST_LAST_BACKUP_KEY, today);
      } catch (error) {}
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
        const newToken = dialog.querySelector("#gist-token").value.trim(), newGistId = dialog.querySelector("#gist-id").value.trim();
        Storage.set(CONFIG_GIST_TOKEN_KEY, newToken), Storage.set(CONFIG_GIST_ID_KEY, newGistId), 
        overlay.remove(), dialog.remove(), Toast.success("设置已保存");
      });
    }
    static registerMenuCommands() {
      GM_registerMenuCommand("⚙️ 配置 Gist 同步", () => this.showSettings()), GM_registerMenuCommand("📤 上传数据到 Gist", () => this.upload()), 
      GM_registerMenuCommand("📥 从 Gist 下载数据", () => this.download());
    }
  }
  (class {
    static main() {
      "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", this.initialize.bind(this)) : this.initialize();
    }
    static initialize() {
      try {
        const currentUrl = window.location.href;
        this.isJavLibraryPage(currentUrl) && ((new ReadMarkManager).init(), GistSync.registerMenuCommands(), 
        GistSync.autoBackup());
      } catch (error) {}
    }
    static isJavLibraryPage(url) {
      return url.includes("javlibrary.com") && (url.includes("publicgroupsearch.php") || url.includes("publictopic.php") || url.includes("publicgroup.php"));
    }
  }).main();
}();
