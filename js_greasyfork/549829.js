// ==UserScript==
// @name         老魔已读标记
// @version      1.2.6
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  JAV Library-推特 
// @match        *://www.javlibrary.com/*
// @match        *://x.com/*/media*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @license      GPL-3.0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.github.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549829/%E8%80%81%E9%AD%94%E5%B7%B2%E8%AF%BB%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/549829/%E8%80%81%E9%AD%94%E5%B7%B2%E8%AF%BB%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

!function() {
  "use strict";
  const CONFIG_STORAGE_GM_GITHUB_TOKEN_KEY = "jav_readmark_github_token", CONFIG_STORAGE_GM_GIST_ID_KEY = "jav_readmark_gist_id", CONFIG_GIST_FILENAME = "jav_readmark_backup.json", CONFIG_GIST_DESCRIPTION = "JAV已读标记备份数据", CONFIG_UI_DIALOG = {
    SETTINGS_Z_INDEX: "99999"
  }, CONFIG_STYLES_READ_TOPIC = {
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
  }, CONFIG_SELECTORS_topicLinks = 'a.topictitle[href*="publictopic.php"]', CONFIG_SELECTORS_allTopicLinks = 'a[href*="publictopic.php"]', CONFIG_REGEX_topicId = /publictopic\.php\?id=(\d+)/, CONFIG_TEXT_readBadge = "[已读]", CONFIG_TEXT_unfinishedBadge = "[已读未完]", CONFIG_TEXT_favButton = "[收藏]", CONFIG_TEXT_unfavButton = "[取消收藏]";
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
    static migrateFromLocalStorage(key, deleteAfterMigration = !0) {
      try {
        const localValue = localStorage.getItem(key);
        if (null !== localValue) {
          try {
            const parsed = JSON.parse(localValue);
            this.set(key, parsed);
          } catch {
            GM_setValue(key, localValue);
          }
          return deleteAfterMigration && localStorage.removeItem(key), !0;
        }
        return !1;
      } catch (error) {
        return !1;
      }
    }
  }
  function extractTopicId(url) {
    const match = url.match(CONFIG_REGEX_topicId);
    return match ? match[1] : null;
  }
  function getReadTopics() {
    try {
      const data = Storage.get("laomo_read_topics", []) || [];
      return new Set(data);
    } catch (error) {
      return new Set;
    }
  }
  function getUnfinishedTopics() {
    try {
      const data = Storage.get("laomo_unfinished_topics", []) || [];
      return new Set(data);
    } catch (error) {
      return new Set;
    }
  }
  function saveUnfinishedTopics(unfinishedTopics) {
    try {
      Storage.set("laomo_unfinished_topics", Array.from(unfinishedTopics));
    } catch (error) {}
  }
  function getHighlightWords(topicId) {
    try {
      return (Storage.get("laomo_jav_highlight_words", {}) || {})[topicId] || [];
    } catch (error) {
      return [];
    }
  }
  function setHighlightWords(topicId, words) {
    try {
      const all = Storage.get("laomo_jav_highlight_words", {}) || {};
      all[topicId] = Array.from(new Set(words.filter(w => w && w.trim().length > 0))), 
      Storage.set("laomo_jav_highlight_words", all);
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
      if (0 === topicLinks.length) {
        topicLinks = document.querySelectorAll(CONFIG_SELECTORS_allTopicLinks);
        const allLinks = document.querySelectorAll('a[href*="publictopic.php"]');
        document.querySelectorAll("table"), allLinks.forEach((link, index) => {});
      }
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
          topicId && (this.markAsRead(topicId), this.markAsReadVisually(link, topicId), event.ctrlKey);
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
            Storage.set("laomo_read_topics", Array.from(readTopics));
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
  function addStyles(css, id) {
    if (id) {
      const existing = document.getElementById(id);
      if (existing) return existing;
    }
    const style = document.createElement("style");
    return id && (style.id = id), style.textContent = css, document.head.appendChild(style), 
    style;
  }
  class TwitterReadMark {
    constructor() {
      this.observer = null, this.processedElements = new WeakSet, this.scrollPositions = {}, 
      this.saveScrollTimer = null, this.restoreButton = null, this.debounceTimer = null, 
      this.readMedia = this.getReadMedia();
    }
    init() {
      this.loadScrollPositions(), this.injectStyles(), this.processMediaItems(), this.setupObserver(), 
      this.setupUrlListener(), this.setupScrollSave(), this.createRestoreButton();
    }
    getReadMedia() {
      try {
        const data = Storage.get("laomo_twitter_read_media", []) || [];
        return new Set(data);
      } catch (error) {
        return new Set;
      }
    }
    saveReadMedia() {
      try {
        Storage.set("laomo_twitter_read_media", Array.from(this.readMedia));
      } catch (error) {}
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
    markAsRead(mediaId) {
      this.readMedia.has(mediaId) || (this.readMedia.add(mediaId), this.saveReadMedia());
    }
    isRead(mediaId) {
      return this.readMedia.has(mediaId);
    }
    injectStyles() {
      addStyles("\n      /* 已读媒体容器样式 */\n      .twitter-media-container-read {\n        position: relative;\n      }\n      \n      /* 已读标记 - 左下角绿色标签 */\n      .twitter-media-container-read::after {\n        content: '✓ 已读';\n        position: absolute;\n        bottom: 8px;\n        left: 8px;\n        background: linear-gradient(135deg, #00ba7c, #00a06a);\n        color: #fff;\n        padding: 4px 10px;\n        border-radius: 12px;\n        font-size: 12px;\n        font-weight: 600;\n        pointer-events: none;\n        z-index: 10;\n        box-shadow: 0 2px 8px rgba(0, 186, 124, 0.4);\n        letter-spacing: 0.5px;\n      }\n\n      /* 恢复位置按钮样式 - 类似推特原生按钮 */\n      #twitter-scroll-restore-btn {\n        position: fixed;\n        bottom: 160px;\n        right: 20px;\n        width: 48px;\n        height: 48px;\n        background: #fff;\n        border: 1px solid rgb(207, 217, 222);\n        border-radius: 16px;\n        box-shadow: rgba(0, 0, 0, 0.08) 0px 8px 28px;\n        cursor: pointer;\n        z-index: 9999;\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        transition: all 0.2s ease;\n        user-select: none;\n      }\n\n      #twitter-scroll-restore-btn:hover {\n        background: rgb(247, 249, 249);\n        border-color: rgb(29, 155, 240);\n      }\n\n      #twitter-scroll-restore-btn:active {\n        transform: scale(0.95);\n      }\n\n      #twitter-scroll-restore-btn .restore-icon {\n        font-size: 20px;\n        color: rgb(29, 155, 240);\n        line-height: 1;\n      }\n\n      #twitter-scroll-restore-btn .restore-text {\n        font-size: 9px;\n        color: rgb(83, 100, 113);\n        margin-top: 2px;\n        white-space: nowrap;\n      }\n    ", "twitter-read-mark-styles");
    }
    processMediaItems() {
      const isPhotoPage = window.location.href.includes("/photo/");
      document.querySelectorAll('img[src*="pbs.twimg.com/media"], img[src*="pbs.twimg.com/tweet_video_thumb"], img[src*="pbs.twimg.com/ext_tw_video_thumb"], img.css-9pa8cd').forEach(img => {
        this.processMediaImage(img, isPhotoPage);
      });
    }
    processMediaImage(img, isPhotoPage = !1) {
      if (this.processedElements.has(img)) return;
      this.processedElements.add(img);
      const src = img.src, mediaId = this.extractMediaId(src);
      mediaId && (this.isRead(mediaId) && !isPhotoPage && this.applyReadStyle(img), this.bindClickEvent(img, mediaId));
    }
    applyReadStyle(img) {
      const container = this.findMediaContainer(img);
      container && !container.classList.contains("twitter-media-container-read") && container.classList.add("twitter-media-container-read");
    }
    findMediaContainer(img) {
      let parent = img.parentElement, depth = 0;
      for (;parent && depth < 10; ) {
        if ("LI" === parent.tagName && "listitem" === parent.getAttribute("role")) return parent;
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
      this.isTwitterMediaPage() && setTimeout(() => this.processMediaItems(), 500);
    }
    isTwitterMediaPage() {
      const url = window.location.href;
      return url.includes("x.com") && url.includes("/media");
    }
    extractUsername() {
      const match = window.location.href.match(/x\.com\/([^\/]+)\/media/);
      return match ? match[1] : null;
    }
    loadScrollPositions() {
      try {
        const data = Storage.get("laomo_twitter_scroll_position", {}) || {};
        this.scrollPositions = data;
      } catch (error) {
        this.scrollPositions = {};
      }
    }
    saveScrollPositions() {
      try {
        Storage.set("laomo_twitter_scroll_position", this.scrollPositions);
      } catch (error) {}
    }
    setupScrollSave() {
      window.addEventListener("scroll", () => {
        this.saveScrollTimer && clearTimeout(this.saveScrollTimer), this.saveScrollTimer = window.setTimeout(() => {
          const username = this.extractUsername();
          if (username) {
            const scrollY = window.scrollY;
            this.scrollPositions[username] = scrollY, this.saveScrollPositions(), this.updateRestoreButton();
          }
        }, 500);
      });
    }
    createRestoreButton() {
      this.restoreButton && this.restoreButton.remove();
      const button = document.createElement("div");
      button.id = "twitter-scroll-restore-btn", button.innerHTML = '\n            <div class="restore-icon">↓</div>\n            <div class="restore-text">恢复位置</div>\n        ';
      const username = this.extractUsername(), savedPosition = username ? this.scrollPositions[username] : 0;
      button.style.display = savedPosition > 100 ? "flex" : "none", button.addEventListener("click", () => this.restoreScrollPosition()), 
      document.body.appendChild(button), this.restoreButton = button;
    }
    updateRestoreButton() {
      if (!this.restoreButton) return;
      const username = this.extractUsername(), savedPosition = username ? this.scrollPositions[username] : 0;
      this.restoreButton.style.display = savedPosition > 100 ? "flex" : "none";
    }
    restoreScrollPosition() {
      const username = this.extractUsername();
      if (!username) return;
      const savedPosition = this.scrollPositions[username];
      !savedPosition || savedPosition <= 0 || (this.setButtonScrolling(!0), this.progressiveScroll(savedPosition));
    }
    setButtonScrolling(isScrolling) {
      if (!this.restoreButton) return;
      const icon = this.restoreButton.querySelector(".restore-icon"), text = this.restoreButton.querySelector(".restore-text");
      isScrolling ? (icon && (icon.textContent = "⏳"), text && (text.textContent = "滚动中..."), 
      this.restoreButton.style.pointerEvents = "none", this.restoreButton.style.opacity = "0.7") : (icon && (icon.textContent = "↓"), 
      text && (text.textContent = "恢复位置"), this.restoreButton.style.pointerEvents = "auto", 
      this.restoreButton.style.opacity = "1");
    }
    progressiveScroll(targetPosition) {
      const stepHeight = .8 * window.innerHeight, scrollStep = () => {
        const currentPosition = window.scrollY, remainingDistance = targetPosition - currentPosition;
        if (remainingDistance <= 50) return void this.setButtonScrolling(!1);
        const nextPosition = currentPosition + Math.min(stepHeight, remainingDistance);
        window.scrollTo({
          top: nextPosition,
          behavior: "smooth"
        }), setTimeout(() => {
          Math.abs(window.scrollY - nextPosition) > 100 ? setTimeout(scrollStep, 300) : scrollStep();
        }, 300);
      };
      scrollStep();
    }
    destroy() {
      this.observer && (this.observer.disconnect(), this.observer = null), this.debounceTimer && clearTimeout(this.debounceTimer), 
      this.saveScrollTimer && clearTimeout(this.saveScrollTimer), this.restoreButton && (this.restoreButton.remove(), 
      this.restoreButton = null);
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
        fontWeight: "400",
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
        this.removeToast(toast);
      }), container.appendChild(toast), setTimeout(() => {
        toast.style.opacity = "1", toast.style.transform = "translateX(0)";
      }, 10), duration > 0 && setTimeout(() => {
        this.removeToast(toast);
      }, duration), toast;
    }
    static removeToast(toast) {
      toast.style.opacity = "0", toast.style.transform = "translateX(100%)", setTimeout(() => {
        toast.parentNode && toast.remove();
      }, 300);
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
  class GistAPI {
    static async request(token, config) {
      if (!token) throw new Error("GitHub Token 未提供");
      const requestConfig = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json"
        }
      };
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          ...requestConfig,
          onload: res => {
            res.status >= 200 && res.status < 300 ? resolve(res) : reject(res);
          },
          onerror: err => reject(err)
        });
      });
    }
    static async getFile(token, gistId, filename) {
      if (!gistId) throw new Error("Gist ID 未提供");
      try {
        const response = await this.request(token, {
          method: "GET",
          url: `https://api.github.com/gists/${gistId}`
        }), gistData = JSON.parse(response.responseText);
        return gistData.files && gistData.files[filename] ? gistData.files[filename] : null;
      } catch (error) {
        throw error;
      }
    }
    static async updateFile(token, gistId, filename, content) {
      if (!gistId) throw new Error("Gist ID 未提供");
      try {
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
      } catch (error) {
        throw error;
      }
    }
    static async createGist(token, filename, content, description, isPublic = !1) {
      try {
        const response = await this.request(token, {
          method: "POST",
          url: "https://api.github.com/gists",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            description: description,
            public: isPublic,
            files: {
              [filename]: {
                content: content
              }
            }
          })
        });
        return JSON.parse(response.responseText).id;
      } catch (error) {
        throw error;
      }
    }
    static async deleteGist(token, gistId) {
      if (!gistId) throw new Error("Gist ID 未提供");
      try {
        return await this.request(token, {
          method: "DELETE",
          url: `https://api.github.com/gists/${gistId}`
        }), !0;
      } catch (error) {
        throw error;
      }
    }
  }
  class GistSync {
    static getGitHubToken() {
      return Storage.get(CONFIG_STORAGE_GM_GITHUB_TOKEN_KEY, "") || "";
    }
    static getGistId() {
      return Storage.get(CONFIG_STORAGE_GM_GIST_ID_KEY, "") || "";
    }
    static async getGistFile() {
      const token = this.getGitHubToken(), gistId = this.getGistId();
      if (!token) return null;
      if (!gistId) return null;
      try {
        return await GistAPI.getFile(token, gistId, CONFIG_GIST_FILENAME) || null;
      } catch (error) {
        return 404 === error.status ? Toast.show("Gist 未找到，请检查Gist ID配置", "warning", 5e3) : Toast.show(`获取Gist文件失败: ${error.statusText || "Unknown error"}`, "error"), 
        null;
      }
    }
    static async updateGistFile(content) {
      const token = this.getGitHubToken(), gistId = this.getGistId();
      if (!token || !gistId) return Toast.show("GitHub Token 或 Gist ID 未配置", "error"), 
      !1;
      try {
        return await GistAPI.updateFile(token, gistId, CONFIG_GIST_FILENAME, content), !0;
      } catch (error) {
        return Toast.show(`更新Gist文件失败: ${error.statusText || "Unknown error"}`, "error"), 
        !1;
      }
    }
    static async createGist(content) {
      const token = this.getGitHubToken();
      if (!token) return Toast.show("GitHub Token 未配置", "error"), null;
      try {
        return await GistAPI.createGist(token, CONFIG_GIST_FILENAME, content, CONFIG_GIST_DESCRIPTION, !1);
      } catch (error) {
        let errorMessage = "Unknown error";
        try {
          if (error.responseText) try {
            const errorData = JSON.parse(error.responseText);
            errorMessage = errorData.message || errorData.error || error.statusText || "Unknown error";
          } catch {
            errorMessage = error.responseText.substring(0, 200) || error.statusText || "Unknown error";
          } else error.statusText ? errorMessage = error.statusText : error.message && (errorMessage = error.message);
        } catch {
          errorMessage = error.statusText || error.message || "Unknown error";
        }
        return 401 === error.status ? errorMessage = "Token 无效或已过期，请检查 GitHub Token" : 403 === error.status ? errorMessage = "Token 权限不足，需要 gist 权限" : 422 === error.status && (errorMessage = errorMessage || "请求参数错误"), 
        Toast.show(`创建Gist失败: ${errorMessage}`, "error", 5e3), null;
      }
    }
    static getJavLibraryData() {
      const readTopics = Storage.get("laomo_read_topics", []) || [], unfinishedTopics = Storage.get("laomo_unfinished_topics", []) || [], highlightWords = Storage.get("laomo_jav_highlight_words", {}) || {};
      return {
        readTopics: Array.isArray(readTopics) ? readTopics : [],
        unfinishedTopics: Array.isArray(unfinishedTopics) ? unfinishedTopics : [],
        highlightWords: highlightWords && "object" == typeof highlightWords ? highlightWords : {}
      };
    }
    static getTwitterData() {
      const readMedia = Storage.get("laomo_twitter_read_media", []) || [], scrollPositions = Storage.get("laomo_twitter_scroll_position", {}) || {};
      return {
        readMedia: Array.isArray(readMedia) ? readMedia : [],
        scrollPositions: scrollPositions && "object" == typeof scrollPositions ? scrollPositions : {}
      };
    }
    static getBackupData() {
      const javData = this.getJavLibraryData(), twitterData = this.getTwitterData();
      return {
        timestamp: (new Date).toISOString(),
        version: "2.0.0",
        javLibrary: javData,
        twitter: twitterData
      };
    }
    static mergeArrays(local, remote) {
      const merged = new Set([ ...local, ...remote ]);
      return Array.from(merged);
    }
    static mergeHighlightWords(local, remote) {
      const merged = {
        ...local
      };
      for (const [topicId, words] of Object.entries(remote)) merged[topicId] ? merged[topicId] = this.mergeArrays(merged[topicId], words) : merged[topicId] = words;
      return merged;
    }
    static mergeScrollPositions(local, remote) {
      const merged = {
        ...local
      };
      for (const [username, position] of Object.entries(remote)) (!merged[username] || position > merged[username]) && (merged[username] = position);
      return merged;
    }
    static mergeBackupData(local, remote) {
      const remoteJav = remote.javLibrary || {
        readTopics: remote.javLibrary || [],
        unfinishedTopics: remote.unfinishedLibrary || [],
        highlightWords: remote.highlightWords || {}
      };
      Array.isArray(remoteJav) && (remote.javLibrary = {
        readTopics: remoteJav,
        unfinishedTopics: remote.unfinishedLibrary || [],
        highlightWords: remote.highlightWords || {}
      });
      const localJav = local.javLibrary || {
        readTopics: [],
        unfinishedTopics: [],
        highlightWords: {}
      }, localTwitter = local.twitter || {
        readMedia: [],
        scrollPositions: {}
      }, remoteTwitter = remote.twitter || {
        readMedia: [],
        scrollPositions: {}
      }, remoteJavData = {
        readTopics: Array.isArray(remote.javLibrary) ? remote.javLibrary : remote.javLibrary?.readTopics || [],
        unfinishedTopics: remote.unfinishedLibrary || remote.javLibrary?.unfinishedTopics || [],
        highlightWords: remote.highlightWords || remote.javLibrary?.highlightWords || {}
      };
      return {
        timestamp: (new Date).toISOString(),
        version: "2.0.0",
        javLibrary: {
          readTopics: this.mergeArrays(localJav.readTopics, remoteJavData.readTopics),
          unfinishedTopics: this.mergeArrays(localJav.unfinishedTopics, remoteJavData.unfinishedTopics),
          highlightWords: this.mergeHighlightWords(localJav.highlightWords, remoteJavData.highlightWords)
        },
        twitter: {
          readMedia: this.mergeArrays(localTwitter.readMedia, remoteTwitter.readMedia),
          scrollPositions: this.mergeScrollPositions(localTwitter.scrollPositions, remoteTwitter.scrollPositions)
        }
      };
    }
    static async importBackupData(data) {
      const localData = this.getBackupData(), mergedData = this.mergeBackupData(localData, data);
      mergedData.javLibrary && (Storage.set("laomo_read_topics", mergedData.javLibrary.readTopics), 
      Storage.set("laomo_unfinished_topics", mergedData.javLibrary.unfinishedTopics), 
      Storage.set("laomo_jav_highlight_words", mergedData.javLibrary.highlightWords)), 
      mergedData.twitter && (Storage.set("laomo_twitter_read_media", mergedData.twitter.readMedia), 
      Storage.set("laomo_twitter_scroll_position", mergedData.twitter.scrollPositions)), 
      mergedData.javLibrary.readTopics.length, localData.javLibrary?.readTopics.length, 
      mergedData.twitter.readMedia.length, localData.twitter?.readMedia.length, setTimeout(() => {
        window.location.reload();
      }, 1e3);
    }
    static async uploadToGist() {
      if (!this.getGitHubToken()) return void Toast.show("GitHub Token 未配置。请通过油猴菜单「⚙️ 配置Gist同步参数」进行设置。", "error");
      const currentGistId = this.getGistId(), notification = Toast.show("上传数据到Gist中...", "info", 0);
      try {
        let finalData;
        if (currentGistId) try {
          const gistFile = await this.getGistFile();
          if (gistFile && gistFile.content) {
            const remoteData = JSON.parse(gistFile.content), localData = this.getBackupData();
            finalData = this.mergeBackupData(localData, remoteData);
          } else finalData = this.getBackupData();
        } catch {
          finalData = this.getBackupData();
        } else finalData = this.getBackupData();
        const content = JSON.stringify(finalData, null, 2);
        let success = !1, newGistCreated = !1;
        if (currentGistId) success = await this.updateGistFile(content); else {
          const newGistId = await this.createGist(content);
          newGistId && (Storage.set(CONFIG_STORAGE_GM_GIST_ID_KEY, newGistId), success = !0, 
          newGistCreated = !0);
        }
        notification.remove(), success ? newGistCreated ? Toast.show("新Gist已创建并自动保存！", "success", 7e3) : Toast.show("数据已合并并同步到Gist！", "success") : currentGistId && Toast.show("上传失败，请检查网络连接和Token权限", "error", 5e3);
      } catch (error) {
        notification.remove(), Toast.show(`上传失败: ${error.message || "Unknown error"}`, "error", 5e3);
      }
    }
    static async downloadFromGist() {
      if (!this.getGitHubToken()) return void Toast.show("GitHub Token 未配置。请通过油猴菜单「⚙️ 配置Gist同步参数」进行设置。", "error");
      if (!this.getGistId()) return void Toast.show("Gist ID 未配置。请通过油猴菜单「⚙️ 配置Gist同步参数」进行设置，或先上传一次。", "warning", 5e3);
      const notification = Toast.show("从Gist下载数据中...", "info", 0);
      try {
        const gistFile = await this.getGistFile();
        if (notification.remove(), !gistFile || !gistFile.content) throw new Error("从Gist下载数据失败，未找到有效内容");
        {
          let data;
          try {
            data = JSON.parse(gistFile.content);
          } catch (parseError) {
            throw new Error(`JSON解析失败: ${parseError.message}`);
          }
          await this.importBackupData(data), Toast.show("已从Gist下载并合并到本地数据！", "success", 3e3);
        }
      } catch (error) {
        notification.remove(), Toast.show(error.message || "从Gist下载时发生错误。", "error");
      }
    }
  }
  class SettingsPanel {
    static show() {
      const existingDialog = document.getElementById("jav-readmark-settings-dialog");
      existingDialog && existingDialog.remove();
      const dialogOverlay = document.createElement("div");
      dialogOverlay.id = "jav-readmark-settings-dialog";
      const dialogContent = document.createElement("div");
      dialogContent.id = "jav-readmark-settings-dialog-content", dialogContent.innerHTML = `\n      <button id="jav-readmark-settings-close-btn" title="关闭">&times;</button>\n      <h3>Gist 同步参数配置</h3>\n      <div>\n        <label for="gist_token_input_jav">GitHub 个人访问令牌 (Token):</label>\n        <input type="password" id="gist_token_input_jav" value="${Storage.get(CONFIG_STORAGE_GM_GITHUB_TOKEN_KEY, "")}" placeholder="例如 ghp_xxxxxxxxxxxxxxxxx">\n        <small>Token 用于授权访问您的Gist。需要 Gist 读写权限。</small>\n      </div>\n      <div>\n        <label for="gist_id_input_jav">Gist ID:</label>\n        <input type="text" id="gist_id_input_jav" value="${Storage.get(CONFIG_STORAGE_GM_GIST_ID_KEY, "")}" placeholder="例如 123abc456def7890">\n        <small>Gist ID 是备份用Gist的标识。若为空，首次上传时将自动创建并保存。</small>\n      </div>\n      <div class="rw-dialog-buttons">\n        <button id="settings_cancel_btn_jav" class="rw-cancel-btn">取消</button>\n        <button id="settings_save_btn_jav" class="rw-save-btn">保存配置</button>\n      </div>\n    `, 
      dialogOverlay.appendChild(dialogContent), document.body.appendChild(dialogOverlay), 
      this.applyStyles();
      const handleEscKey = e => {
        "Escape" === e.key && closeDialog();
      }, closeDialog = () => {
        document.removeEventListener("keydown", handleEscKey), dialogOverlay.remove();
      }, cancelAndClose = () => {
        closeDialog(), Toast.show("参数设置已取消。", "info");
      };
      document.getElementById("settings_save_btn_jav")?.addEventListener("click", () => {
        const newToken = document.getElementById("gist_token_input_jav").value.trim(), newGistId = document.getElementById("gist_id_input_jav").value.trim();
        Storage.set(CONFIG_STORAGE_GM_GITHUB_TOKEN_KEY, newToken), Storage.set(CONFIG_STORAGE_GM_GIST_ID_KEY, newGistId);
        let msg = "Gist参数已保存!";
        newToken || newGistId ? newToken ? newGistId || (msg = "Gist ID已清空, Token已保存。") : msg = "Token已清空, Gist ID已保存。" : msg = "Gist参数已清空。", 
        Toast.show(msg, "success"), closeDialog();
      }), document.getElementById("settings_cancel_btn_jav")?.addEventListener("click", cancelAndClose), 
      document.getElementById("jav-readmark-settings-close-btn")?.addEventListener("click", cancelAndClose), 
      document.addEventListener("keydown", handleEscKey);
    }
    static applyStyles() {
      addStyles(`\n      #jav-readmark-settings-dialog {\n        position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n        background-color: rgba(0,0,0,0.6); z-index: ${CONFIG_UI_DIALOG?.SETTINGS_Z_INDEX};\n        display: flex; justify-content: center; align-items: center; font-family: sans-serif;\n      }\n      #jav-readmark-settings-dialog-content {\n        background: white; padding: 25px; border-radius: 8px;\n        box-shadow: 0 5px 20px rgba(0,0,0,0.3); width: 400px; max-width: 90%;\n        position: relative;\n      }\n      #jav-readmark-settings-dialog-content h3 { margin-top: 0; margin-bottom: 20px; text-align: center; color: #333; font-size: 1.3em; }\n      #jav-readmark-settings-dialog-content label { display: block; margin-bottom: 5px; color: #555; font-size: 0.95em; }\n      #jav-readmark-settings-dialog-content input[type="text"], #jav-readmark-settings-dialog-content input[type="password"] {\n        width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 0; font-size: 1em;\n      }\n      #jav-readmark-settings-dialog-content small { font-size:0.8em; color:#777; display:block; margin-top:4px; margin-bottom:12px; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons { text-align: right; margin-top: 15px; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons button { padding: 10px 18px; border-radius: 4px; border: none; cursor: pointer; font-size: 0.95em; transition: background-color 0.2s ease; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons .rw-cancel-btn { margin-right: 10px; background-color: #f0f0f0; color: #333; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons .rw-cancel-btn:hover { background-color: #e0e0e0; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons .rw-save-btn { background-color: #4CAF50; color: white; }\n      #jav-readmark-settings-dialog-content .rw-dialog-buttons .rw-save-btn:hover { background-color: #45a049; }\n      #jav-readmark-settings-close-btn { position: absolute; top: 10px; right: 10px; font-size: 1.5em; color: #aaa; cursor: pointer; background: none; border: none; padding: 5px; line-height: 1; }\n      #jav-readmark-settings-close-btn:hover { color: #777; }\n    `, "jav-readmark-settings-styles");
    }
  }
  (class {
    static main() {
      "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", this.initialize.bind(this)) : this.initialize();
    }
    static initialize() {
      try {
        const currentUrl = window.location.href;
        this.isTwitterMediaPage(currentUrl) ? (new TwitterReadMark).init() : this.isJavLibraryPage(currentUrl) && (new ReadMarkManager).init(), 
        (this.isTwitterMediaPage(currentUrl) || this.isJavLibraryPage(currentUrl)) && this.registerMenuCommands();
      } catch (error) {}
    }
    static registerMenuCommands() {
      GM_registerMenuCommand("⚙️ 配置Gist同步参数", () => {
        SettingsPanel.show();
      }), GM_registerMenuCommand("📤 上传数据到Gist", () => {
        GistSync.uploadToGist();
      }), GM_registerMenuCommand("📥 从Gist下载数据", () => {
        GistSync.downloadFromGist();
      });
    }
    static isTwitterMediaPage(url) {
      return url.includes("x.com") && url.includes("/media");
    }
    static isJavLibraryPage(url) {
      return url.includes("javlibrary.com") && (url.includes("publicgroupsearch.php") || url.includes("publictopic.php") || url.includes("publicgroup.php"));
    }
  }).main();
}();
