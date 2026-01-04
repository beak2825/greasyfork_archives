// ==UserScript==
// @name         115-魔改
// @version      0.1.4
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  115网盘增强-图片查看优化-封面增强-左侧栏优化
// @match        *://115.com/*
// @match        *://life.115.com/*
// @exclude      *://115.com/web/lixian/master/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=115.com
// @license      GPL-3.0
// @require      https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560291/115-%E9%AD%94%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/560291/115-%E9%AD%94%E6%94%B9.meta.js
// ==/UserScript==

!function() {
  "use strict";
  class CoverEnhancer {
    constructor() {
      this.processedItems = new WeakSet, this.observer = null;
    }
    init() {
      this.observer || (this.scanAndEnhance(), this.startObserver());
    }
    refresh() {
      this.scanAndEnhance();
    }
    destroy() {
      this.observer && (this.observer.disconnect(), this.observer = null);
    }
    scanAndEnhance() {
      document.querySelectorAll('li[rel="item"]').forEach(item => {
        item instanceof HTMLElement && this.processFolderItem(item);
      });
    }
    processFolderItem(item) {
      if (this.processedItems.has(item)) return;
      "0" === item.getAttribute("file_type") ? item.classList.add("type-folder") : item.classList.add("type-file");
      const thumbContainer = item.querySelector(".file-thumb"), imgElement = thumbContainer?.querySelector("img");
      if (!thumbContainer || !imgElement) return;
      const originalSrc = imgElement.src;
      if (!originalSrc || originalSrc.includes("assets/images/")) return;
      this.processedItems.add(item);
      const existingLayer = thumbContainer.querySelector(".enhanced-cover-layer");
      existingLayer && existingLayer.remove();
      const coverLayer = document.createElement("div");
      coverLayer.className = "enhanced-cover-layer", coverLayer.style.setProperty("--enhanced-cover-img", `url("${originalSrc}")`), 
      thumbContainer.appendChild(coverLayer), thumbContainer.classList.add("cover-enhanced-container"), 
      item.classList.add("has-cover-enhanced"), this.detectOrientation(item, imgElement);
    }
    detectOrientation(item, img) {
      const applyClass = () => {
        item.classList.remove("is-landscape", "is-portrait"), img.naturalWidth > img.naturalHeight ? item.classList.add("is-landscape") : item.classList.add("is-portrait");
      };
      img.complete && img.naturalWidth > 0 ? applyClass() : img.onload = () => applyClass();
    }
    startObserver() {
      const targetNode = document.querySelector(".list-contents, #js_file_container, #js_data_list, body");
      targetNode && (this.observer = new MutationObserver(mutations => {
        for (const mutation of mutations) "childList" === mutation.type && mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            node.matches?.('li[rel="item"]') && this.processFolderItem(node);
            const items = node.querySelectorAll?.('li[rel="item"]');
            items?.forEach(item => {
              item instanceof HTMLElement && this.processFolderItem(item);
            });
          }
        });
      }), this.observer.observe(targetNode, {
        childList: !0,
        subtree: !0
      }));
    }
  }
  class ViewModeManager {
    constructor() {
      this.KEY_PREFIX_CID = "folder_mode_", this.checkTimer = null, this.currentCid = null, 
      this.lastProcessedCid = null, this.isInternalSwitch = !1, this.lastAutoSwitchTime = 0, 
      this.userInteractionOverride = !1, this.bindUserInteractions(), this.checkTimer = window.setInterval(() => {
        this.checkState();
      }, 300);
    }
    init() {}
    destroy() {
      this.checkTimer && (clearInterval(this.checkTimer), this.checkTimer = null);
    }
    checkState() {
      const domCid = this.getDomCid();
      if (domCid !== this.currentCid && (this.currentCid = domCid, this.lastProcessedCid = null, 
      this.lastAutoSwitchTime = Date.now(), this.userInteractionOverride = !1), this.currentCid && this.currentCid !== this.lastProcessedCid) {
        const ancestors = this.getBreadcrumbCids();
        this.applyModeLogic(this.currentCid, ancestors), this.lastProcessedCid = this.currentCid, 
        this.lastAutoSwitchTime = Date.now();
      } else if (this.currentCid && !this.isInternalSwitch) {
        const ancestors = this.getBreadcrumbCids(), target = this.calculateTargetMode(this.currentCid, ancestors), current = this.getUiMode();
        if (current && target && current !== target) {
          const isProtectionExpired = Date.now() - this.lastAutoSwitchTime > 1e3;
          this.userInteractionOverride || isProtectionExpired ? (GM_setValue(this.KEY_PREFIX_CID + this.currentCid, current), 
          this.lastAutoSwitchTime = Date.now()) : this.switchMode(target);
        }
      }
    }
    calculateTargetMode(cid, ancestors) {
      let validIds = [];
      const selfIndex = ancestors.indexOf(cid);
      validIds = -1 !== selfIndex ? ancestors.slice(0, selfIndex + 1) : [ ...ancestors, cid ];
      let effectiveMode = null;
      for (const id of validIds) {
        const savedMode = GM_getValue(this.KEY_PREFIX_CID + id);
        savedMode && (effectiveMode = savedMode);
      }
      return effectiveMode;
    }
    applyModeLogic(cid, ancestors) {
      let targetMode = this.calculateTargetMode(cid, ancestors);
      targetMode || (targetMode = "list"), this.switchMode(targetMode);
    }
    switchMode(mode) {
      if (this.getUiMode() === mode) return;
      const btn = document.querySelector(`.panel-btn-model a.item[val="${mode}"]`);
      btn && (this.isInternalSwitch = !0, btn.click(), setTimeout(() => {
        this.isInternalSwitch = !1;
      }, 800));
    }
    bindUserInteractions() {
      document.addEventListener("click", e => {
        if (this.isInternalSwitch) return;
        const btn = e.target.closest(".panel-btn-model a.item");
        if (btn) {
          const mode = btn.getAttribute("val"), cid = this.getDomCid();
          mode && cid && (GM_setValue(this.KEY_PREFIX_CID + cid, mode), this.currentCid = cid, 
          this.isInternalSwitch = !0, this.lastProcessedCid = null, this.userInteractionOverride = !0, 
          setTimeout(() => {
            this.isInternalSwitch = !1, this.checkState();
          }, 500));
        }
      }, !0);
    }
    getDomCid() {
      const fileItem = document.querySelector('li[rel="item"]');
      if (fileItem) {
        const pid = fileItem.getAttribute("p_id");
        if (pid) return pid;
      }
      const hiddenInput = document.querySelector('input[name="cid"]');
      return hiddenInput && hiddenInput instanceof HTMLInputElement && hiddenInput.value ? hiddenInput.value : this.getCidFromUrl();
    }
    getCidFromUrl() {
      return new URLSearchParams(window.location.search).get("cid") || "0";
    }
    getUiMode() {
      const selectedBtn = document.querySelector(".panel-btn-model a.item.selected");
      return selectedBtn ? selectedBtn.getAttribute("val") : null;
    }
    getBreadcrumbCids() {
      const cids = [];
      return document.querySelectorAll(".file-path a[cid], .bread-crumb a[cid], #js_top_header_file_path a[cid]").forEach(a => {
        const c = a.getAttribute("cid");
        c && "0" !== c && cids.push(c);
      }), cids;
    }
  }
  class DeleteHandler {
    static async deleteFile(fileId) {
      try {
        const fileItem = document.querySelector(`li[file_id="${fileId}"]`);
        if (!fileItem) throw new Error("文件项未找到");
        const deleteMenuItem = document.querySelector('li[menu~="delete"]');
        if (deleteMenuItem) return fileItem.click(), await new Promise(resolve => setTimeout(resolve, 100)), 
        deleteMenuItem.click(), !0;
        fileItem.click(), await new Promise(resolve => setTimeout(resolve, 100));
        const event = new KeyboardEvent("keydown", {
          key: "Delete",
          code: "Delete",
          keyCode: 46,
          which: 46,
          bubbles: !0,
          cancelable: !0
        });
        return document.dispatchEvent(event), !0;
      } catch (error) {
        return DeleteHandler.showToast("删除失败，请手动删除或刷新页面后重试"), !1;
      }
    }
    static showToast(message) {
      const toast = document.createElement("div");
      toast.style.cssText = "\n            position: fixed;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            background: rgba(0, 0, 0, 0.8);\n            color: white;\n            padding: 12px 24px;\n            border-radius: 8px;\n            z-index: 99999999;\n            font-size: 16px;\n        ", 
      toast.textContent = message, document.body.appendChild(toast), setTimeout(() => {
        toast.remove();
      }, 2e3);
    }
  }
  class ViewerManager {
    constructor() {
      this.listSelector = "#js_data_list", this.itemSelector = 'li[file_type="1"]', this.currentImages = [], 
      this.wheelMode = "zoom", this.thumbsVisible = !0, this.hasBoundEvents = !1, this.currentFancybox = null;
    }
    init() {
      "function" == typeof GM_getValue && (this.wheelMode = GM_getValue("viewer_wheel_mode", "zoom"), 
      this.thumbsVisible = GM_getValue("viewer_thumbs_visible", !0)), this.bindEvents();
    }
    bindEvents() {
      this.hasBoundEvents || ((document.querySelector(this.listSelector) || document.body).addEventListener("click", e => {
        const target = e.target;
        if (!target) return;
        const fileItem = target.closest(this.itemSelector);
        if (!fileItem) return;
        const fileName = fileItem.getAttribute("title") || "";
        if (!this.isImageFile(fileName)) return;
        const isClickOnName = target.closest('a[menu="view_file_one"]'), isClickOnThumb = target.closest(".img-wrap") || "IMG" === target.tagName && target.closest(".file-thumb"), isClickOnMask = target.classList.contains("iv-mask");
        (isClickOnName || isClickOnThumb || isClickOnMask) && (e.preventDefault(), e.stopPropagation(), 
        e.stopImmediatePropagation(), this.openGallery(fileItem));
      }, !0), document.addEventListener("keydown", e => {
        document.querySelector(".fancybox__container") && "0" === e.key && 3 === e.location && (e.preventDefault(), 
        this.toggleWheelMode());
      }), this.hasBoundEvents = !0);
    }
    isImageFile(fileName) {
      if (!fileName) return !1;
      const ext = fileName.split(".").pop()?.toLowerCase();
      return !!ext && [ "jpg", "jpeg", "png", "gif", "bmp", "webp", "ico", "svg", "tif", "tiff", "avif" ].includes(ext);
    }
    openGallery(clickedItem) {
      const allImageItems = Array.from(document.querySelectorAll(this.itemSelector));
      let initialIndex = 0;
      this.currentImages = [];
      const galleryItems = [];
      if (allImageItems.forEach(item => {
        const fileId = item.getAttribute("file_id") || "", fileName = item.getAttribute("title") || "Image";
        if (!this.isImageFile(fileName)) return;
        let thumbSrc = item.getAttribute("path");
        if (!thumbSrc) {
          const img = item.querySelector("img");
          img && (thumbSrc = img.getAttribute("src"));
        }
        if (!thumbSrc) return;
        const originalSrc = thumbSrc.replace(/_\d+(\?|$)/, "_0$1");
        this.currentImages.push({
          fileId: fileId,
          fileName: fileName,
          thumbSrc: thumbSrc,
          originalSrc: originalSrc
        }), galleryItems.push({
          src: originalSrc,
          thumb: thumbSrc,
          caption: fileName,
          fileId: fileId,
          type: "image"
        }), item === clickedItem && (initialIndex = this.currentImages.length - 1);
      }), 0 === galleryItems.length) return void this.showToast("未找到图片");
      const thumbsAutoStart = this.thumbsVisible;
      this.currentFancybox = Fancybox.show(galleryItems, {
        startIndex: initialIndex,
        Hash: !1,
        l10n: {
          CLOSE: "关闭",
          NEXT: "下一张",
          PREV: "上一张",
          MODAL: "您可以使用 ESC 键关闭",
          ERROR: "发生错误，请稍后再试",
          IMAGE_ERROR: "图片未找到",
          ELEMENT_NOT_FOUND: "HTML 元素未找到",
          AJAX_NOT_FOUND: "AJAX 加载错误 : 404",
          AJAX_FORBIDDEN: "AJAX 加载错误 : 403",
          IFRAME_ERROR: "页面加载错误",
          TOGGLE_ZOOM: "切换缩放",
          TOGGLE_THUMBS: "切换缩略图",
          TOGGLE_SLIDESHOW: "切换幻灯片",
          TOGGLE_FULLSCREEN: "切换全屏",
          DOWNLOAD: "下载"
        },
        Thumbs: {
          showOnStart: thumbsAutoStart,
          type: "classic"
        },
        Toolbar: {
          display: {
            left: [ "infobar" ],
            middle: [],
            right: [ "wheelMode", "deleteImage", "slideshow", "customThumbs", "close" ]
          },
          items: {
            customThumbs: {
              tpl: '\n                        <button class="f-button" title="切换缩略图" data-fancybox-custom-thumbs>\n                             <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">\n                                <rect x="4" y="4" width="6" height="6" rx="1"></rect>\n                                <rect x="14" y="4" width="6" height="6" rx="1"></rect>\n                                <rect x="4" y="14" width="6" height="6" rx="1"></rect>\n                                <rect x="14" y="14" width="6" height="6" rx="1"></rect>\n                            </svg>\n                        </button>\n                        ',
              click: () => {
                this.toggleThumbs();
              }
            },
            wheelMode: {
              tpl: '\n                        <button class="f-button" title="滚轮模式: 缩放/切换 (小键盘0)" data-fancybox-wheel-mode>\n                           <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">\n                               <circle cx="12" cy="12" r="3"></circle>\n                               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>\n                             </svg>\n                        </button>\n                        ',
              click: () => {
                this.toggleWheelMode();
              }
            },
            deleteImage: {
              tpl: '\n                        <button class="f-button" title="删除图片" data-fancybox-delete>\n                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">\n                                <polyline points="3 6 5 6 21 6"></polyline>\n                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>\n                            </svg>\n                        </button>\n                        ',
              click: () => {
                this.handleDelete();
              }
            }
          }
        },
        on: {
          "Carousel.ready": fancybox => {
            this.updateWheelModeUI(), this.updateThumbsUI(), fancybox.container.addEventListener("wheel", e => {
              this.handleWheel(e, fancybox);
            }, {
              passive: !1
            }), this.preloadNeighbors(fancybox);
          },
          "Carousel.change": fancybox => {
            this.preloadNeighbors(fancybox);
          },
          destroy: fancybox => {
            fancybox._thumbsObserver && fancybox._thumbsObserver.disconnect(), fancybox._containerObserver && fancybox._containerObserver.disconnect(), 
            this.currentFancybox = null;
          }
        }
      });
    }
    handleWheel(e, fancybox) {
      if ("switch" === this.wheelMode) return e.preventDefault(), e.stopPropagation(), 
      void (e.deltaY > 0 ? fancybox.next() : fancybox.prev());
    }
    toggleWheelMode() {
      this.wheelMode = "switch" === this.wheelMode ? "zoom" : "switch", this.updateWheelModeUI(), 
      this.showToast("滚轮模式: " + ("switch" === this.wheelMode ? "切图" : "缩放")), "function" == typeof GM_setValue && GM_setValue("viewer_wheel_mode", this.wheelMode);
    }
    toggleThumbs() {
      if (!this.currentFancybox) return;
      const thumbs = this.currentFancybox.plugins.Thumbs;
      thumbs && (thumbs.toggle(), this.thumbsVisible = !this.thumbsVisible, "function" == typeof GM_setValue && GM_setValue("viewer_thumbs_visible", this.thumbsVisible), 
      this.updateThumbsUI());
    }
    updateThumbsUI() {
      const btn = document.querySelector("[data-fancybox-custom-thumbs]");
      btn && (this.thumbsVisible ? (btn.classList.add("f-button--active"), btn.style.color = "var(--fancybox-accent-color, #3b82f6)") : (btn.classList.remove("f-button--active"), 
      btn.style.color = ""));
    }
    updateWheelModeUI() {
      const btn = document.querySelector("[data-fancybox-wheel-mode]");
      btn && ("switch" === this.wheelMode ? (btn.classList.add("f-button--active"), btn.style.color = "var(--fancybox-accent-color, #3b82f6)") : (btn.classList.remove("f-button--active"), 
      btn.style.color = ""));
    }
    async handleDelete() {
      if (!this.currentFancybox) return;
      const carousel = this.currentFancybox.carousel;
      if (!carousel) return;
      const currentIndex = carousel.page, currentSlide = carousel.slides[currentIndex];
      if (!currentSlide) return;
      const fileName = currentSlide.caption || "Image", fileId = currentSlide.fileId;
      fileId ? confirm(`确认删除图片?\n${fileName}`) && await DeleteHandler.deleteFile(fileId) && (this.showToast("图片已删除"), 
      this.currentFancybox.next()) : this.showToast("无法获取文件ID");
    }
    showToast(message) {
      const toast = document.createElement("div");
      toast.className = "fb-toast", toast.textContent = message, document.body.appendChild(toast), 
      setTimeout(() => toast.remove(), 2e3);
    }
    preloadNeighbors(fancybox) {
      const carousel = fancybox.carousel;
      if (!carousel) return;
      const currentIndex = carousel.page, total = this.currentImages.length;
      for (let i = 1; i <= 3; i++) {
        const nextIndex = (currentIndex + i) % total;
        this.currentImages[nextIndex] && this.preloadImage(this.currentImages[nextIndex].originalSrc);
      }
    }
    preloadImage(url) {
      url && ((new Image).src = url);
    }
    refresh() {}
    destroy() {
      this.currentFancybox && this.currentFancybox.close(), this.hasBoundEvents = !1;
    }
  }
  const SIDEBAR_ICONS = {
    wangpan: '<svg viewBox="0 0 24 24" class="nav-svg-icon">\n    <defs>\n      <linearGradient id="folder1" x1="0%" y1="0%" x2="0%" y2="100%">\n        <stop offset="0%" stop-color="#60A5FA"/>\n        <stop offset="100%" stop-color="#2563EB"/>\n      </linearGradient>\n      <linearGradient id="folder2" x1="0%" y1="0%" x2="0%" y2="100%">\n        <stop offset="0%" stop-color="#93C5FD"/>\n        <stop offset="100%" stop-color="#3B82F6"/>\n      </linearGradient>\n    </defs>\n    <path d="M2 5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v1H2V5z" fill="url(#folder1)"/>\n    <rect x="2" y="8" width="20" height="12" rx="2" fill="url(#folder2)"/>\n    <path d="M2 9h20v1H2z" fill="rgba(255,255,255,0.4)"/>\n  </svg>',
    upload: '<svg viewBox="0 0 24 24" class="nav-svg-icon">\n    <defs>\n      <linearGradient id="docUp" x1="0%" y1="0%" x2="0%" y2="100%">\n        <stop offset="0%" stop-color="#86EFAC"/>\n        <stop offset="100%" stop-color="#16A34A"/>\n      </linearGradient>\n    </defs>\n    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" fill="url(#docUp)"/>\n    <path d="M13 2v7h7" fill="rgba(255,255,255,0.3)"/>\n    <path d="M12 18v-5M9.5 15.5L12 13l2.5 2.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>\n  </svg>',
    star: '<svg viewBox="0 0 24 24" class="nav-svg-icon">\n    <defs>\n      <linearGradient id="starGold" x1="0%" y1="0%" x2="0%" y2="100%">\n        <stop offset="0%" stop-color="#FDE047"/>\n        <stop offset="100%" stop-color="#EAB308"/>\n      </linearGradient>\n    </defs>\n    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGold)"/>\n  </svg>',
    recyclebin: '<svg viewBox="0 0 24 24" class="nav-svg-icon">\n    <defs>\n      <linearGradient id="trashLid" x1="0%" y1="0%" x2="0%" y2="100%">\n        <stop offset="0%" stop-color="#FCA5A5"/>\n        <stop offset="100%" stop-color="#DC2626"/>\n      </linearGradient>\n      <linearGradient id="trashBody" x1="0%" y1="0%" x2="0%" y2="100%">\n        <stop offset="0%" stop-color="#F87171"/>\n        <stop offset="100%" stop-color="#B91C1C"/>\n      </linearGradient>\n    </defs>\n    <rect x="4" y="5" width="16" height="3" rx="1" fill="url(#trashLid)"/>\n    <path d="M9 3h6a1 1 0 011 1v2H8V4a1 1 0 011-1z" fill="url(#trashLid)"/>\n    <path d="M5 8h14l-1.2 12a2 2 0 01-2 2H8.2a2 2 0 01-2-2L5 8z" fill="url(#trashBody)"/>\n    <path d="M9 11v6M12 11v6M15 11v6" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round"/>\n  </svg>',
    clouddownload: '<svg viewBox="0 0 24 24" class="nav-svg-icon">\n    <defs>\n      <linearGradient id="hddDown" x1="0%" y1="0%" x2="0%" y2="100%">\n        <stop offset="0%" stop-color="#C4B5FD"/>\n        <stop offset="100%" stop-color="#7C3AED"/>\n      </linearGradient>\n    </defs>\n    <rect x="2" y="14" width="20" height="7" rx="2" fill="url(#hddDown)"/>\n    <circle cx="18" cy="17.5" r="1.5" fill="#fff"/>\n    <path d="M6 17.5h6" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round"/>\n    <path d="M12 3v8" stroke="url(#hddDown)" stroke-width="2.5" stroke-linecap="round"/>\n    <path d="M8 8l4 4 4-4" stroke="url(#hddDown)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>\n  </svg>',
    receive: '<svg viewBox="0 0 24 24" class="nav-svg-icon">\n    <defs>\n      <linearGradient id="inbox" x1="0%" y1="0%" x2="0%" y2="100%">\n        <stop offset="0%" stop-color="#67E8F9"/>\n        <stop offset="100%" stop-color="#0891B2"/>\n      </linearGradient>\n    </defs>\n    <path d="M22 12H16L14 15H10L8 12H2L4 4H20L22 12Z" fill="url(#inbox)"/>\n    <path d="M2 12V20H22V12" stroke="url(#inbox)" stroke-width="2" fill="none"/>\n    <path d="M12 3V9M9 6L12 9L15 6" stroke="url(#inbox)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>\n  </svg>',
    tags: '<svg viewBox="0 0 24 24" class="nav-svg-icon">\n    <defs>\n      <linearGradient id="tag" x1="0%" y1="0%" x2="100%" y2="100%">\n        <stop offset="0%" stop-color="#FDBA74"/>\n        <stop offset="100%" stop-color="#EA580C"/>\n      </linearGradient>\n    </defs>\n    <path d="M3 5a2 2 0 012-2h5.6a2 2 0 011.4.6l9.4 9.4a2 2 0 010 2.8l-5.2 5.2a2 2 0 01-2.8 0L4 11.6A2 2 0 013 10.2V5z" fill="url(#tag)"/>\n    <circle cx="7.5" cy="7.5" r="2" fill="#fff"/>\n    <path d="M3 5l8.4 2.1-1.8 4.3L3 10.2z" fill="rgba(255,255,255,0.2)"/>\n  </svg>',
    share: '<svg viewBox="0 0 24 24" class="nav-svg-icon">\n    <defs>\n      <linearGradient id="share" x1="0%" y1="0%" x2="100%" y2="100%">\n        <stop offset="0%" stop-color="#A5B4FC"/>\n        <stop offset="100%" stop-color="#4F46E5"/>\n      </linearGradient>\n    </defs>\n    <circle cx="18" cy="5" r="3.5" fill="url(#share)"/>\n    <circle cx="6" cy="12" r="3.5" fill="url(#share)"/>\n    <circle cx="18" cy="19" r="3.5" fill="url(#share)"/>\n    <path d="M9 10.5l6-3.5M9 13.5l6 3.5" stroke="url(#share)" stroke-width="2"/>\n  </svg>',
    settings: '<svg viewBox="0 0 24 24" class="nav-svg-icon">\n    <defs>\n      <linearGradient id="gear" x1="0%" y1="0%" x2="0%" y2="100%">\n        <stop offset="0%" stop-color="#94A3B8"/>\n        <stop offset="100%" stop-color="#475569"/>\n      </linearGradient>\n    </defs>\n    <path fill="url(#gear)" d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a7.06 7.06 0 00-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84a.48.48 0 00-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87a.48.48 0 00.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.49.37 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.22 0 .43-.17.48-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z"/>\n  </svg>'
  };
  function getIcon(id) {
    return SIDEBAR_ICONS[id] || SIDEBAR_ICONS.settings;
  }
  const FUNCTION_ITEMS = [ {
    id: "wangpan",
    title: "网盘",
    icon: getIcon("wangpan"),
    href: "https://115.com/?cid=0&offset=0&mode=wangpan",
    category: "quickIcon",
    defaultEnabled: !0
  }, {
    id: "upload",
    title: "最近上传",
    icon: getIcon("upload"),
    href: "//115.com/?tab=upload&mode=wangpan",
    dataNav: "upload",
    relTab: "upload",
    tabBtn: "wangpan",
    modeTab: "upload",
    category: "quickIcon",
    defaultEnabled: !0
  }, {
    id: "star",
    title: "星标文件",
    icon: getIcon("star"),
    href: "//115.com/?tab=label&label_id=-1&show_label=1&mode=wangpan",
    dataNav: "star",
    relTab: "star",
    tabBtn: "wangpan",
    modeData: "{tab:'label',label_id:-1,show_label:1}",
    category: "quickIcon",
    defaultEnabled: !0
  }, {
    id: "recyclebin",
    title: "回收站",
    icon: getIcon("recyclebin"),
    href: "//115.com/?tab=rb&mode=wangpan",
    dataNav: "rb",
    relTab: "rb",
    modeTab: "rb",
    tabBtn: "wangpan",
    category: "quickIcon",
    defaultEnabled: !0
  }, {
    id: "clouddownload",
    title: "云下载",
    icon: getIcon("clouddownload"),
    href: "//115.com/?tab=offline&mode=wangpan",
    dataNav: "offline",
    relTab: "offline",
    tabBtn: "wangpan",
    modeTab: "offline",
    category: "quickIcon",
    defaultEnabled: !1
  }, {
    id: "receive",
    title: "最近接收",
    icon: getIcon("receive"),
    href: "//115.com/?tab=share_save_receive&mode=wangpan",
    dataNav: "share_save_receive",
    relTab: "share_save_receive",
    tabBtn: "wangpan",
    modeTab: "share_save_receive",
    category: "quickIcon",
    defaultEnabled: !1
  }, {
    id: "tags",
    title: "文件标签",
    icon: getIcon("tags"),
    href: "javascript:;",
    dataNav: "label",
    relTab: "label",
    tabBtn: "wangpan",
    category: "quickIcon",
    defaultEnabled: !1
  }, {
    id: "share",
    title: "链接分享",
    icon: getIcon("share"),
    href: "//115.com/?mode=share_save",
    dataNav: "share_save",
    relTab: "share_save",
    tabBtn: "share_save",
    category: "quickIcon",
    defaultEnabled: !1
  } ], STYLE_CONFIG = {
    variables: {
      "--primary-color": "#2b85e4",
      "--text-color": "#666",
      "--hover-color": "#2b85e4",
      "--icon-size": "20px",
      "--spacing-sm": "3px",
      "--spacing-md": "6px",
      "--spacing-lg": "12px",
      "--border-radius": "3px",
      "--bg-overlay": "rgba(0,0,0,0.5)",
      "--bg-panel": "#ffffff",
      "--border-color": "#e0e0e0"
    },
    timeout: 1e4
  }, SELECTORS = {
    leftSidebar: ".container-leftside",
    quickIconsContainer: "#js_sub_nav_scroller",
    navCeiling: ".top-side .navigation-ceiling ul",
    quickIcons: ".grid-item",
    bottomSide: ".bottom-side .navigation-ceiling ul",
    chatButton: "#js_left_notice"
  }, STORAGE_KEYS = {
    enabledFunctions: "115_enabled_functions",
    settingsVersion: "115_settings_version"
  };
  class Config {
    static getFunctionItems() {
      return [ ...FUNCTION_ITEMS ];
    }
    static getFunctionItem(id) {
      return FUNCTION_ITEMS.find(item => item.id === id);
    }
    static getStyleConfig() {
      return STYLE_CONFIG;
    }
    static getSelectors() {
      return SELECTORS;
    }
    static getStorageKeys() {
      return STORAGE_KEYS;
    }
    static getDefaultEnabledIds() {
      return FUNCTION_ITEMS.filter(item => item.defaultEnabled).map(item => item.id);
    }
  }
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
  class SettingsManager {
    constructor() {
      this.settingsVersion = "1.0.0", this.enabledFunctionIds = new Set, this.loadSettings();
    }
    static getInstance() {
      return SettingsManager.instance || (SettingsManager.instance = new SettingsManager), 
      SettingsManager.instance;
    }
    loadSettings() {
      try {
        const saved = Storage.get(STORAGE_KEYS.enabledFunctions, null);
        saved && Array.isArray(saved) ? this.enabledFunctionIds = new Set(saved) : this.enabledFunctionIds = new Set(Config.getDefaultEnabledIds()), 
        this.saveSettings();
      } catch (error) {
        this.enabledFunctionIds = new Set(Config.getDefaultEnabledIds()), this.saveSettings();
      }
    }
    saveSettings() {
      try {
        const enabledIds = Array.from(this.enabledFunctionIds);
        Storage.set(STORAGE_KEYS.enabledFunctions, enabledIds), Storage.set(STORAGE_KEYS.settingsVersion, this.settingsVersion);
      } catch (error) {}
    }
    isFunctionEnabled(functionId) {
      return this.enabledFunctionIds.has(functionId);
    }
    enableFunction(functionId) {
      this.enabledFunctionIds.add(functionId), this.saveSettings();
    }
    disableFunction(functionId) {
      this.enabledFunctionIds.delete(functionId), this.saveSettings();
    }
    toggleFunction(functionId) {
      return this.isFunctionEnabled(functionId) ? (this.disableFunction(functionId), !1) : (this.enableFunction(functionId), 
      !0);
    }
    getEnabledFunctionIds() {
      return Array.from(this.enabledFunctionIds);
    }
    getEnabledFunctions() {
      return Config.getFunctionItems().filter(item => this.isFunctionEnabled(item.id));
    }
    setFunctions(enabledIds) {
      this.enabledFunctionIds = new Set(enabledIds), this.saveSettings();
    }
    resetToDefault() {
      this.enabledFunctionIds = new Set(Config.getDefaultEnabledIds()), this.saveSettings();
    }
    getAllFunctionsInOrder() {
      return Config.getFunctionItems();
    }
    getSortedFunctions(functions, excludeWangpan = !0) {
      const filteredFunctions = excludeWangpan ? functions.filter(func => "wangpan" !== func.id) : functions, specialOrder = [ "receive", "upload", "recyclebin" ], specialFunctions = [], normalFunctions = [];
      return filteredFunctions.forEach(func => {
        specialOrder.includes(func.id) ? specialFunctions.push(func) : normalFunctions.push(func);
      }), specialFunctions.sort((a, b) => specialOrder.indexOf(a.id) - specialOrder.indexOf(b.id)), 
      [ ...normalFunctions, ...specialFunctions ];
    }
    getSettingsInfo() {
      const allFunctions = Config.getFunctionItems(), enabled = this.getEnabledFunctionIds();
      return {
        version: this.settingsVersion,
        totalFunctions: allFunctions.length,
        enabledCount: enabled.length,
        disabledCount: allFunctions.length - enabled.length,
        quickIconEnabled: enabled.length
      };
    }
    exportSettings() {
      const settings = {
        version: this.settingsVersion,
        timestamp: Date.now(),
        enabledFunctions: this.getEnabledFunctionIds()
      };
      return JSON.stringify(settings, null, 2);
    }
    importSettings(settingsJson) {
      try {
        const settings = JSON.parse(settingsJson);
        if (settings.enabledFunctions && Array.isArray(settings.enabledFunctions)) return this.setFunctions(settings.enabledFunctions), 
        !0;
      } catch (error) {}
      return !1;
    }
  }
  function createElement(tag, attributes, children) {
    const element = document.createElement(tag);
    return attributes && Object.entries(attributes).forEach(([key, value]) => {
      null != value && ("style" === key && "string" == typeof value ? element.setAttribute("style", value) : "style" === key && "object" == typeof value ? Object.assign(element.style, value) : "className" === key && "string" == typeof value || "class" === key && "string" == typeof value ? element.className = value : "function" == typeof value && key.startsWith("on") ? element[key] = value : "textContent" === key ? element.textContent = value : "innerHTML" === key ? element.innerHTML = value : "string" == typeof value || "number" == typeof value ? element.setAttribute(key, String(value)) : element[key] = value);
    }), void 0 !== children && (Array.isArray(children) ? children : [ children ]).forEach(child => {
      "string" == typeof child ? element.appendChild(document.createTextNode(child)) : element.appendChild(child);
    }), element;
  }
  function waitForElement(selector, timeout = 5e3) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) return void resolve(element);
      const observer = new MutationObserver(() => {
        const element2 = document.querySelector(selector);
        element2 && (observer.disconnect(), resolve(element2));
      });
      observer.observe(document.body, {
        childList: !0,
        subtree: !0
      }), setTimeout(() => {
        observer.disconnect(), reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }
  class SettingsPanel {
    constructor(settingsManager) {
      this.settingsManager = settingsManager, this.isOpen = !1, this.overlay = null;
    }
    open() {
      this.isOpen || (this.createPanel(), this.isOpen = !0);
    }
    close() {
      this.isOpen && this.overlay && (this.overlay.remove(), this.overlay = null, this.isOpen = !1);
    }
    toggle() {
      this.isOpen ? this.close() : this.open();
    }
    createPanel() {
      this.overlay = createElement("div", {
        className: "settings-overlay"
      });
      const panel = createElement("div", {
        className: "settings-panel"
      }), header = this.createHeader(), content = this.createContent(), footer = this.createFooter();
      panel.appendChild(header), panel.appendChild(content), panel.appendChild(footer), 
      this.overlay.addEventListener("click", e => {
        e.target === this.overlay && this.close();
      }), this.overlay.appendChild(panel), document.body.appendChild(this.overlay);
    }
    createHeader() {
      const header = createElement("div", {
        className: "panel-header"
      }), title = createElement("h3", {}, "115左侧栏设置"), closeBtn = createElement("button", {
        className: "close-btn",
        title: "关闭"
      }, [ "×" ]);
      return closeBtn.addEventListener("click", () => this.close()), header.appendChild(title), 
      header.appendChild(closeBtn), header;
    }
    createContent() {
      const content = createElement("div", {
        className: "panel-content"
      }), functionTable = createElement("table", {
        className: "function-table"
      }), sortedFunctions = this.getSortedFunctions();
      for (let i = 0; i < sortedFunctions.length; i += 2) {
        const row = createElement("tr", {
          className: "function-row"
        }), cell1 = createElement("td", {
          className: "function-cell"
        }), item1 = this.createFunctionItem(sortedFunctions[i]);
        cell1.appendChild(item1), row.appendChild(cell1);
        const cell2 = createElement("td", {
          className: "function-cell"
        });
        if (sortedFunctions[i + 1]) {
          const item2 = this.createFunctionItem(sortedFunctions[i + 1]);
          cell2.appendChild(item2);
        } else cell2.style.visibility = "hidden";
        row.appendChild(cell2), functionTable.appendChild(row);
      }
      return content.appendChild(functionTable), content;
    }
    getSortedFunctions() {
      const functions = this.settingsManager.getAllFunctionsInOrder().filter(item => "quickIcon" === item.category && "wangpan" !== item.id);
      return this.settingsManager.getSortedFunctions(functions, !1);
    }
    createFunctionItem(func) {
      const item = createElement("div", {
        className: "function-item"
      }), label = createElement("label", {
        className: "function-label",
        htmlFor: `func-${func.id}`
      }), icon = createElement("i", {
        innerHTML: func.icon
      }), text = createElement("span", {
        className: "function-text"
      }, func.title);
      label.appendChild(icon), label.appendChild(text);
      const checkbox = createElement("input", {
        type: "checkbox",
        className: "function-checkbox",
        id: `func-${func.id}`,
        checked: this.settingsManager.isFunctionEnabled(func.id) ? "true" : void 0,
        onchange: e => {
          e.target.checked ? this.settingsManager.enableFunction(func.id) : this.settingsManager.disableFunction(func.id), 
          window.dispatchEvent(new CustomEvent("115-settings-changed"));
        }
      });
      return checkbox.checked = this.settingsManager.isFunctionEnabled(func.id), item.appendChild(label), 
      item.appendChild(checkbox), item;
    }
    createFooter() {
      const footer = createElement("div", {
        className: "panel-footer"
      }), resetBtn = createElement("button", {
        className: "btn btn-secondary",
        onclick: () => {
          confirm("确定要重置所有设置吗？") && (this.settingsManager.resetToDefault(), this.close(), 
          setTimeout(() => this.open(), 100));
        }
      }, [ "重置" ]), closeBtn = createElement("button", {
        className: "btn btn-primary",
        onclick: () => this.close()
      }, [ "确定" ]);
      return footer.appendChild(resetBtn), footer.appendChild(closeBtn), footer;
    }
  }
  class SelectionManager {
    constructor() {
      this.currentUrl = "";
    }
    init() {
      this.currentUrl = window.location.href, setTimeout(() => {
        this.updateSelectionState();
      }, 100), this.monitorNavigationChanges();
    }
    monitorNavigationChanges() {
      const checkUrlChange = () => {
        window.location.href !== this.currentUrl && (this.currentUrl = window.location.href, 
        this.updateSelectionState());
      };
      window.addEventListener("popstate", checkUrlChange), window.addEventListener("hashchange", checkUrlChange), 
      new MutationObserver(() => {
        checkUrlChange();
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      }), setInterval(checkUrlChange, 2e3);
    }
    updateSelectionState() {
      this.clearAllSelections(), this.setCurrentSelectionByUrl();
    }
    clearAllSelections() {
      document.querySelectorAll(".container-leftside .custom-nav-item").forEach(item => item.classList.remove("current"));
    }
    setCurrentSelectionByUrl() {
      const url = window.location.href, params = new URLSearchParams(window.location.search), mode = params.get("mode"), tab = params.get("tab");
      ("wangpan" === mode || url.includes("115.com/?")) && (tab ? this.setSelectionByDataNav(tab) : this.setStorageAsSelected());
    }
    setSelectionByDataNav(dataNav) {
      const navCeiling = document.querySelector(SELECTORS.navCeiling);
      if (navCeiling) {
        const targetItem = navCeiling.querySelector(`[data-nav="${dataNav}"]`);
        if (targetItem) {
          const navItem = targetItem.closest(".custom-nav-item");
          navItem && navItem.classList.add("current");
        }
      }
    }
    setStorageAsSelected() {
      const navCeiling = document.querySelector(SELECTORS.navCeiling);
      if (navCeiling) {
        const wangpanButton = navCeiling.querySelector('.custom-nav-item a[href*="mode=wangpan"]:not([href*="tab="])');
        if (wangpanButton) {
          const navItem = wangpanButton.closest(".custom-nav-item");
          navItem && navItem.classList.add("current");
        }
      }
    }
    setItemAsSelected(link) {
      this.clearAllSelections();
      const navItem = link.closest(".custom-nav-item");
      navItem && navItem.classList.add("current");
    }
  }
  class NavigationBuilder {
    constructor(selectionManager) {
      this.selectionManager = selectionManager;
    }
    hideOriginalNavItems() {
      const leftSidebar = document.querySelector(SELECTORS.leftSidebar);
      if (leftSidebar) {
        const storageNav = leftSidebar.querySelector('li[mode_btn="wangpan"]'), socialNav = leftSidebar.querySelector('li[mode_btn="home"]'), lifeNav = leftSidebar.querySelector('li[mode_btn="vip"]'), createNav = leftSidebar.querySelector('li[mode_btn="add"]');
        if (storageNav && (storageNav.style.cssText = "display: none !important;"), socialNav && (socialNav.style.display = "none"), 
        lifeNav && (lifeNav.style.display = "none"), createNav) {
          createNav.style.display = "none";
          const createContainer = leftSidebar.querySelector(".navigation-ceiling.nc-add");
          createContainer && (createContainer.style.display = "none");
        }
      }
      const bottomSide = document.querySelector(SELECTORS.bottomSide);
      if (bottomSide) {
        const chatBtn = bottomSide.querySelector("#js_left_notice"), helpBtn = bottomSide.querySelector("#js_feedback_main"), clientBtn = bottomSide.querySelector('a[onclick*="CommonHeader.showClientDownLoad"]');
        chatBtn && (chatBtn.parentElement.style.display = "none"), helpBtn && (helpBtn.parentElement.style.display = "none"), 
        clientBtn && (clientBtn.parentElement.style.display = "none");
      }
    }
    createNavButton(config) {
      const li = createElement("li", {
        className: "custom-nav-item"
      }), link = createElement("a", {
        href: config.href || "javascript:;",
        className: `custom-nav-btn ${config.className || ""}`,
        innerHTML: `<i class="custom-icon">${config.icon}</i><span>${config.title}</span>`
      });
      return config.onClick && link.addEventListener("click", e => {
        e.preventDefault(), config.onClick();
      }), li.appendChild(link), li;
    }
    createSettingsButton(onClick) {
      const bottomSide = document.querySelector(SELECTORS.bottomSide);
      if (!bottomSide) return null;
      const settingsButton = this.createNavButton({
        icon: getIcon("settings"),
        title: "设置",
        onClick: onClick,
        className: "settings-btn"
      });
      return bottomSide.appendChild(settingsButton), settingsButton.querySelector("a");
    }
    createNavItem(func) {
      const navItem = createElement("li", {
        className: "custom-nav-item"
      }), link = createElement("a", {
        href: func.href,
        target: func.target || "",
        className: "custom-nav-btn"
      });
      return func.dataNav && link.setAttribute("data-nav", func.dataNav), func.relTab && link.setAttribute("rel_tab", func.relTab), 
      func.tabBtn && link.setAttribute("tab_btn", func.tabBtn), func.modeTab && link.setAttribute("mode-tab", func.modeTab), 
      func.modeData && link.setAttribute("mode-data", func.modeData), link.innerHTML = `<i class="custom-icon">${func.icon}</i><span>${func.title}</span>`, 
      this.addClickHandler(link, func), navItem.appendChild(link), navItem;
    }
    addClickHandler(link, func) {
      link.addEventListener("click", e => {
        if (this.selectionManager.setItemAsSelected(link), "wangpan" === func.id) return e.preventDefault(), 
        void (window.location.href = func.href || "https://115.com/?cid=0&offset=0&mode=wangpan");
        if (func.dataNav) {
          e.preventDefault();
          const quickIconsContainer = document.querySelector(SELECTORS.quickIconsContainer);
          if (quickIconsContainer) {
            const originalIcon = quickIconsContainer.querySelector(`[data-nav="${func.dataNav}"]`);
            if (originalIcon) return void originalIcon.click();
          }
          return void (func.href && "javascript:;" !== func.href && (window.location.href = func.href));
        }
      });
    }
    renderEnabledFunctions(enabledFunctions) {
      let navCeiling = document.querySelector(SELECTORS.navCeiling);
      if (!navCeiling) {
        const leftSidebar = document.querySelector(SELECTORS.leftSidebar);
        if (leftSidebar) {
          const originalWangpan = leftSidebar.querySelector('li[mode_btn="wangpan"]');
          originalWangpan && originalWangpan.parentElement && (navCeiling = originalWangpan.parentElement);
        }
      }
      if (!navCeiling) return;
      navCeiling.querySelectorAll(".custom-nav-item").forEach(item => item.remove());
      const sortedFunctions = SettingsManager.getInstance().getSortedFunctions(enabledFunctions), wangpanFunction = Config.getFunctionItems().find(func => "wangpan" === func.id);
      if (wangpanFunction) {
        const wangpanItem = this.createNavItem(wangpanFunction);
        wangpanItem && navCeiling.appendChild(wangpanItem);
      }
      sortedFunctions.forEach(func => {
        const navItem = this.createNavItem(func);
        navItem && navCeiling.appendChild(navItem);
      });
    }
  }
  class SidebarManager {
    constructor() {
      this.isInitialized = !1, this.settingsButton = null, this.settingsManager = SettingsManager.getInstance(), 
      this.settingsPanel = new SettingsPanel(this.settingsManager), this.selectionManager = new SelectionManager, 
      this.navigationBuilder = new NavigationBuilder(this.selectionManager);
    }
    async init() {
      if (!this.isInitialized) try {
        await this.waitForElements(), this.navigationBuilder.hideOriginalNavItems(), this.createSettingsButton(), 
        this.renderEnabledFunctions(), this.selectionManager.init(), this.setupEventListeners(), 
        function() {
          const styleId = "115-sidebar-all-styles";
          if (document.getElementById(styleId)) return;
          const style = createElement("style", {
            id: styleId
          });
          style.textContent = [ `:root {\n    ${Object.entries(STYLE_CONFIG.variables).map(([key, value]) => `${key}: ${value}`).join(";\n    ")};\n  }`, "\n    /* 统一的导航容器样式 */\n    .container-leftside .top-side .navigation-ceiling ul {\n      display: flex !important;\n      flex-direction: column !important;\n      align-items: center !important;\n      justify-content: flex-start !important;\n      margin: 0 !important;\n      padding: 8px 0 15px 0 !important;\n      min-height: auto !important;\n    }\n\n    .container-leftside .bottom-side .navigation-ceiling ul {\n      display: flex !important;\n      flex-direction: column !important;\n      align-items: center !important;\n      padding: 0 !important;\n    }\n\n    /* 统一的导航项容器样式 */\n    .container-leftside .custom-nav-item {\n      display: flex !important;\n      justify-content: center !important;\n      width: 100% !important;\n      min-width: 70px !important;\n      text-align: center !important;\n      margin: 0 0 12px 0 !important;\n      list-style: none !important;\n      position: relative !important;\n    }\n\n    /* 统一的导航按钮样式 */\n    .container-leftside .custom-nav-btn {\n      display: flex !important;\n      flex-direction: column !important;\n      align-items: center !important;\n      justify-content: center !important;\n      text-decoration: none !important;\n      color: var(--text-color) !important;\n      padding: 8px 6px !important;\n      border-radius: var(--border-radius) !important;\n      transition: all 0.2s ease !important;\n      min-height: 50px !important;\n      min-width: 60px !important;\n      box-sizing: border-box !important;\n      background: none !important;\n      border: none !important;\n      cursor: pointer !important;\n    }\n  ".trim(), "\n    /* 导航按钮整体布局 */\n    .container-leftside .custom-nav-btn {\n      display: flex !important;\n      flex-direction: column !important;\n      align-items: center !important;\n      justify-content: center !important;\n    }\n\n    /* 图标容器 */\n    .custom-icon,\n    .container-leftside .custom-nav-btn i {\n      display: flex !important;\n      align-items: center !important;\n      justify-content: center !important;\n      width: 28px !important;\n      height: 28px !important;\n      margin: 0 auto 2px auto !important;\n      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;\n    }\n\n    /* SVG 图标样式 */\n    .container-leftside .custom-nav-btn i svg,\n    .container-leftside .custom-nav-btn i .nav-svg-icon {\n      width: 26px !important;\n      height: 26px !important;\n      display: block !important;\n      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12)) !important;\n      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;\n    }\n\n    /* 统一的文字样式 */\n    .container-leftside .custom-nav-btn span {\n      display: block !important;\n      font-size: 11px !important;\n      line-height: 1.2 !important;\n      white-space: nowrap !important;\n      color: #555 !important;\n      font-weight: 500 !important;\n      margin: 2px auto 0 auto !important;\n      text-align: center !important;\n      transition: color 0.2s ease !important;\n    }".trim(), "\n    /* 统一的悬停状态 */\n    .container-leftside .custom-nav-btn:hover {\n      background: rgba(43, 133, 228, 0.06) !important;\n      transform: translateY(-2px) !important;\n    }\n\n    /* 悬停时 SVG 图标放大 + 增强阴影 */\n    .container-leftside .custom-nav-btn:hover i svg,\n    .container-leftside .custom-nav-btn:hover i .nav-svg-icon {\n      transform: scale(1.1) !important;\n      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) !important;\n    }\n\n    /* 悬停时文字变色 */\n    .container-leftside .custom-nav-btn:hover span {\n      color: var(--hover-color) !important;\n    }\n\n    /* 统一的选中状态 */\n    .container-leftside .custom-nav-item.current .custom-nav-btn {\n      background: linear-gradient(135deg, rgba(43, 133, 228, 0.12) 0%, rgba(43, 133, 228, 0.06) 100%) !important;\n      border-radius: 8px !important;\n      margin: 0 auto !important;\n    }\n\n    .container-leftside .custom-nav-item.current .custom-nav-btn span {\n      color: var(--hover-color) !important;\n      font-weight: 600 !important;\n    }\n\n    /* 选中状态的悬停效果 */\n    .container-leftside .custom-nav-item.current .custom-nav-btn:hover {\n      transform: none !important;\n    }\n\n    .container-leftside .custom-nav-item.current .custom-nav-btn:hover i svg {\n      transform: scale(1.05) !important;\n    }\n\n    /* 按钮激活状态（点击瞬间） */\n    .container-leftside .custom-nav-btn:active {\n      transform: translateY(0) scale(0.98) !important;\n    }\n\n    .container-leftside .custom-nav-btn:active i svg {\n      transform: scale(0.95) !important;\n    }".trim(), "\n    /* 通用样式 */\n    .custom-nav-item {\n      list-style: none !important;\n    }\n\n    /* 确保不影响原生布局 */\n    .container-leftside .top-side .navigation-ceiling,\n    .container-leftside .bottom-side .navigation-ceiling {\n      position: relative !important;\n    }".trim(), "\n    /* 设置面板遮罩层 */\n    .settings-overlay { \n      position: fixed; \n      top: 0; \n      left: 0; \n      width: 100%; \n      height: 100%; \n      background: var(--bg-overlay); \n      z-index: 10000;\n      display: flex !important;\n      align-items: center;\n      justify-content: center;\n    } \n    \n    /* 设置面板容器 */\n    .settings-panel { \n      position: relative;\n      background: #ffffff; \n      border-radius: 12px; \n      box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08); \n      width: fit-content; \n      min-width: 500px;\n      max-width: 560px;\n      max-height: 85vh; \n      overflow: hidden; \n      display: flex !important; \n      flex-direction: column; \n      border: 1px solid rgba(0,0,0,0.05);\n    }".trim(), "\n    /* 面板头部 */\n    .panel-header { \n      display: flex; \n      justify-content: space-between; \n      align-items: center; \n      padding: 18px 24px; \n      border-bottom: 1px solid var(--border-color); \n      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);\n    } \n    \n    .panel-header h3 { \n      margin: 0; \n      color: var(--text-color); \n      font-size: 18px;\n      font-weight: 600;\n      letter-spacing: 0.3px;\n    } \n    \n    /* 关闭按钮 */\n    .close-btn { \n      background: none; \n      border: none; \n      font-size: 22px; \n      cursor: pointer; \n      color: #666; \n      padding: 0; \n      width: 32px; \n      height: 32px; \n      display: flex; \n      align-items: center; \n      justify-content: center; \n      border-radius: 4px;\n      transition: all 0.2s ease;\n    } \n    \n    .close-btn:hover { \n      color: #333; \n      background: rgba(0,0,0,0.1);\n    }".trim(), "\n    /* 面板内容区 */\n    .panel-content { \n      flex: 1; \n      overflow-y: auto; \n      padding: 24px; \n      background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);\n    } \n    \n    .function-group { \n      margin-bottom: var(--spacing-lg); \n    } \n    \n    .group-title { \n      margin: 0 0 var(--spacing-md) 0; \n      color: var(--text-color); \n      font-size: 16px; \n      border-bottom: 1px solid var(--border-color); \n      padding-bottom: var(--spacing-sm); \n    } \n    \n    /* 功能列表表格 */\n    .function-table { \n      width: 100%;\n      border-collapse: separate;\n      border-spacing: 10px 8px;\n      margin: 0;\n      table-layout: fixed;\n    }\n    \n    .function-cell {\n      width: 50%;\n      vertical-align: top;\n      padding: 0;\n      position: relative;\n    }".trim(), "\n    /* 功能项 */\n    .function-item { \n      display: flex; \n      align-items: center; \n      justify-content: space-between;\n      padding: 12px 16px; \n      border: 1px solid #e1e5e9; \n      border-radius: 8px; \n      user-select: none;\n      min-height: 44px;\n      white-space: nowrap;\n      width: 100%;\n      box-sizing: border-box;\n      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n      background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);\n      position: relative;\n    }\n    \n    .function-label {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      cursor: pointer;\n      flex: 1;\n      margin-right: 12px;\n      overflow: hidden;\n    }\n    \n    .function-label i {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      width: 24px;\n      height: 24px;\n      flex-shrink: 0;\n      line-height: 1;\n    }\n\n    .function-label i svg {\n      width: 20px;\n      height: 20px;\n      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));\n    }\n    \n    .function-text {\n      font-size: 14px;\n      color: #333;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      font-weight: 500;\n      line-height: 1.4;\n    }\n    \n    .function-checkbox {\n      flex-shrink: 0;\n      width: 18px;\n      height: 18px;\n      cursor: pointer;\n      margin: 0;\n      accent-color: #007acc;\n      border-radius: 3px;\n    } \n    \n    /* 功能项悬停效果 */\n    .function-item:hover { \n      background: linear-gradient(145deg, #f8f9fa 0%, #f0f2f5 100%);\n      border-color: #007acc;\n      box-shadow: 0 4px 12px rgba(0, 122, 204, 0.15);\n      transform: translateY(-1px);\n    }\n    \n    .function-item:active {\n      transform: translateY(0);\n      box-shadow: 0 2px 6px rgba(0, 122, 204, 0.1);\n    }".trim(), "\n    /* 面板底部 */\n    .panel-footer { \n      display: flex; \n      justify-content: flex-end; \n      gap: 12px; \n      padding: 16px 24px; \n      border-top: 1px solid var(--border-color); \n      background: #f8f9fa;\n    } \n    \n    /* 按钮样式 */\n    .btn { \n      padding: 10px 18px; \n      border: none; \n      border-radius: 6px; \n      cursor: pointer; \n      font-size: 14px; \n      font-weight: 500;\n      transition: all 0.2s ease;\n      min-width: 72px;\n    } \n    \n    .btn-primary { \n      background: linear-gradient(135deg, #007acc 0%, #005c99 100%); \n      color: white; \n      box-shadow: 0 2px 6px rgba(0, 122, 204, 0.3);\n    } \n    \n    .btn-secondary { \n      background: #f5f5f5; \n      color: #666; \n      border: 1px solid #ddd;\n    } \n    \n    .btn:hover { \n      transform: translateY(-1px);\n    }\n    \n    .btn-primary:hover {\n      box-shadow: 0 4px 12px rgba(0, 122, 204, 0.4);\n    }\n    \n    .btn-secondary:hover {\n      background: #eeeeee;\n      border-color: #ccc;\n    }".trim() ].join("\n\n"), 
          document.head.appendChild(style);
        }(), this.isInitialized = !0;
      } catch (error) {}
    }
    async waitForElements() {
      await Promise.all([ waitForElement(SELECTORS.leftSidebar, STYLE_CONFIG.timeout), waitForElement(SELECTORS.bottomSide, STYLE_CONFIG.timeout) ]);
    }
    createSettingsButton() {
      this.settingsButton = this.navigationBuilder.createSettingsButton(() => this.openSettings());
    }
    renderEnabledFunctions() {
      const enabledFunctions = this.settingsManager.getEnabledFunctions();
      this.navigationBuilder.renderEnabledFunctions(enabledFunctions);
    }
    openSettings() {
      this.settingsPanel.open();
    }
    setupEventListeners() {
      window.addEventListener("115-settings-changed", () => {
        this.renderEnabledFunctions(), this.selectionManager.updateSelectionState();
      });
    }
    refresh() {
      this.renderEnabledFunctions();
    }
    destroy() {
      this.settingsButton && this.settingsButton.remove(), function() {
        const style = document.getElementById("115-sidebar-all-styles");
        style && style.remove();
        const oldStyle = document.getElementById("115-sidebar-styles");
        oldStyle && oldStyle.remove();
        const panelStyle = document.getElementById("settings-panel-styles");
        panelStyle && panelStyle.remove();
      }(), this.isInitialized = !1;
    }
  }
  !function() {
    if (document.getElementById("115-pre-hide-styles")) return;
    const style = document.createElement("style");
    style.id = "115-pre-hide-styles", style.textContent = '\n    /* 预隐藏原生按钮，防止闪现 */\n    /* 网盘按钮：使用 visibility 隐藏但保持可点击性，用于触发SPA路由 */\n    .container-leftside .top-side .navigation-ceiling ul li[mode_btn="wangpan"] {\n      position: absolute !important;\n      visibility: hidden !important;\n      pointer-events: auto !important;\n      width: 1px !important;\n      height: 1px !important;\n      overflow: hidden !important;\n    }\n    /* 其他按钮：完全隐藏 */\n    .container-leftside .top-side .navigation-ceiling ul li[mode_btn="home"],\n    .container-leftside .top-side .navigation-ceiling ul li[mode_btn="vip"], \n    .container-leftside .top-side .navigation-ceiling ul li[mode_btn="add"],\n    .container-leftside .bottom-side .navigation-ceiling ul li:has(#js_left_notice),\n    .container-leftside .bottom-side .navigation-ceiling ul li:has(#js_feedback_main),\n    .container-leftside .bottom-side .navigation-ceiling ul li:has(a[onclick*="CommonHeader.showClientDownLoad"]) {\n      display: none !important;\n      opacity: 0 !important;\n      visibility: hidden !important;\n    }\n  '.trim(), 
    (document.head || document.documentElement).appendChild(style);
  }();
  const app = new class {
    constructor() {
      this.coverEnhancer = new CoverEnhancer, this.viewModeManager = new ViewModeManager, 
      this.viewerManager = new ViewerManager, this.sidebarManager = new SidebarManager;
    }
    async init() {
      try {
        !function() {
          const css = "\n    /* =========================================\n       115封面增强 - 终极修复版\n       ========================================= */\n    \n    /* 1. 列表项整体布局调整 */\n    /* 增加每个文件夹单元的高度，给大海报留出物理空间，防止遮挡文字 */\n    .list-thumb .has-cover-enhanced {\n        height: 240px !important; /* 增加到 240px，容纳更高的封面 */\n        margin-bottom: 20px !important;\n        padding-top: 10px !important;\n    }\n\n    /* 2. 也是最重要的：给封面容器腾位置 */\n    /* 关键改动：position 改为 static，让子元素的 absolute 定位直接寻找上一级 relative 父元素（即 li） */\n    .has-cover-enhanced .file-thumb.cover-enhanced-container {\n      overflow: visible !important;\n      background: none !important;\n      position: static !important; /* 解除封印，让子元素直通 li */\n      margin-top: 15px !important; \n      height: 155px !important; /* 增加到 155px */   \n    }\n\n    /* 3. 隐藏原有元素 (黄色文件夹图标 & 小图) */\n    /* 3. 隐藏原有元素 (黄色文件夹图标 & 小图) */\n    .has-cover-enhanced .file-thumb.cover-enhanced-container img {\n      opacity: 0 !important;\n      visibility: hidden !important;\n    }\n    \n    /* 对 i 标签使用 visibility: hidden，这样我们可以让你里面的 star 按钮 visible 回来 */\n    .has-cover-enhanced .file-thumb.cover-enhanced-container i {\n      visibility: hidden !important;\n    }\n\n    /* 4. 原生星标按钮 - 强制置顶显示 */\n    /* 现在参考系是 li (宽115px, 高190px) */\n    .has-cover-enhanced .file-thumb i a[menu=\"star\"],\n    .has-cover-enhanced .file-thumb a[menu=\"star\"],\n    .has-cover-enhanced .file-thumb .tpstar,\n    .has-cover-enhanced .file-thumb .tpstar-disabled {\n        visibility: visible !important; /* 复原可见性 */\n        opacity: 1 !important;\n        display: block !important;\n        z-index: 100 !important;\n        position: absolute !important;\n        \n        /* 完美的右上角定位 (0,0) */\n        top: 6px !important; /* 下移一点，避免贴顶 */\n        right: 0 !important;\n        \n        left: auto !important;\n        bottom: auto !important;\n        \n         transform: scale(0.9);\n    }\n\n    /* 4. 封面层 - 作为文件夹的“背板” */\n    /* 4. 封面层 - 基础容器样式 */\n    .enhanced-cover-layer {\n      position: absolute !important;\n      left: 50% !important;\n      transform: translateX(-50%) !important;\n      \n      /* 位置和尺寸 (通用) */\n      top: 10px !important; \n      width: 104px !important; \n      height: 174px !important; \n      \n      /* 共同的质感 */\n      border-radius: 6px !important;\n      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;\n      z-index: 10 !important;\n      \n      cursor: pointer !important;\n      pointer-events: none !important;\n      transition: transform 0.2s ease, box-shadow 0.2s ease !important;\n    }\n\n    /* === 文件夹特定模式 (type-folder) === */\n    /* 文件夹才有的背板颜色和边框 */\n    .type-folder .enhanced-cover-layer {\n      background: linear-gradient(to bottom, #FFD75E 0%, #FFC107 100%) !important;\n      border: 1px solid #CFA000 !important;\n    }\n\n    /* 文件夹特有的标签突起 (Tab) */\n    .checklist .enhanced-cover-layer::before, /* 兼容可能存在的 checklist 类名情况，主要是下面这个 */\n    .type-folder .enhanced-cover-layer::before {\n      content: '';\n      display: block;\n      position: absolute;\n      z-index: -1; \n      \n      top: -9px; \n      left: 0;\n      width: 44px; \n      height: 12px;\n      \n      background: #FFD75E;\n      border: 1px solid #CFA000;\n      border-bottom: none; \n      border-radius: 5px 5px 0 0;\n    }\n\n    /* === 文件特定模式 (type-file) === */\n    /* 普通文件不需要黄色背景，直接用白色或透明 */\n    .type-file .enhanced-cover-layer {\n      background: #fff !important; /* 白底，防止透明图透出后面的杂乱 */\n      border: 1px solid rgba(0,0,0,0.05) !important; /* 极淡的边框 */\n    }\n    \n    /* 普通文件不需要标签突起 */\n    .type-file .enhanced-cover-layer::before {\n      display: none !important;\n    }\n\n    /* 4.2 封面图片 - 通用设置 */\n    .enhanced-cover-layer::after {\n      content: '';\n      display: block;\n      position: absolute;\n      z-index: 1;\n      \n      background-image: var(--enhanced-cover-img);\n      background-size: cover;\n      background-position: top center;\n      background-repeat: no-repeat;\n      \n      box-shadow: 0 1px 2px rgba(0,0,0,0.1); \n    }\n\n    /* 文件夹模式下的图片：留出边距，露出背板 */\n    .type-folder .enhanced-cover-layer::after {\n      top: 6px;    \n      left: 6px;   \n      right: 6px;  \n      bottom: 20px;\n      background-color: #f0f0f0;\n    }\n\n    /* === 文件特定模式 (type-file) 默认/竖图 === */\n    /* 必须显式指定占满容器，否则不显示 */\n    .type-file .enhanced-cover-layer::after {\n      top: 0; left: 0; right: 0; bottom: 0;\n      border-radius: 6px;\n    }\n\n    /* === 横图文件终极方案：影视级磨砂海报 (Cinematic Blur) === */\n    /* 核心理念：保持竖卡尺寸不变（对齐网格），用高斯模糊填充背景，横图居中显示（清晰不拉伸） */\n\n    /* 1. 复用了 ::before 作为模糊背景层 (仅在横图模式启用) */\n    .type-file.is-landscape .enhanced-cover-layer::before {\n      content: '';\n      display: block !important; /* 强制显示 */\n      position: absolute;\n      top: 0; left: 0; right: 0; bottom: 0;\n      z-index: 0; /* 在底层 */\n      \n      background-image: var(--enhanced-cover-img);\n      background-size: cover;\n      background-position: center;\n      \n      /* 核心效果：高斯模糊 + 亮度降低，营造氛围感 */\n      filter: blur(6px) brightness(0.8) contrast(0.8);\n      transform: scale(1.1); /*稍微放大防止模糊边缘露白 */\n      \n      border-radius: 6px;\n      opacity: 0.9;\n    }\n\n    /* 2. 主图层 ::after 改为 contain 模式 */\n    .type-file.is-landscape .enhanced-cover-layer::after {\n      z-index: 2; /* 在模糊层之上 */\n      \n      /* 确保完整显示，绝不裁剪/拉伸/模糊 */\n      background-size: contain !important; \n      background-position: center center !important;\n      \n      /* 给主图加一个深邃的投影，使其从模糊背景中浮起来 */\n      box-shadow: 0 4px 12px rgba(0,0,0,0.5); \n      \n      /* 稍微缩小一点点主图，留出一点呼吸感，像画框一样 */\n      top: 10px; bottom: 10px; left: 0; right: 0;\n      \n      border-radius: 4px;\n      /* 移除底色，透明透出背景 */\n      background-color: transparent; \n    }\n    \n    /* 3. 容器本身处理 */\n    .type-file.is-landscape .enhanced-cover-layer {\n         /* 溢出隐藏，因为模糊层 blur 会扩散出去 */\n         overflow: hidden !important; \n         background: #333 !important; /* 深色打底 */\n         border: 1px solid rgba(255,255,255,0.1) !important;\n    }\n\n    /* 5. 悬停效果 - 整体上浮 */\n    .has-cover-enhanced:hover .enhanced-cover-layer {\n      transform: translateX(-50%) translateY(-6px) !important;\n      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;\n    }\n\n    /* 6. 解决文件名和操作栏重叠 */\n    /* 强制将文件名下移，远离封面 */\n    .has-cover-enhanced .file-name {\n        margin-top: 0px !important;\n        position: relative !important;\n        z-index: 20 !important;\n        display: block !important;\n        clear: both !important;\n    }\n    \n    /* 8. 保护左上角选择框 - 确保不被遮挡 */\n    .list-thumb li input[type=\"checkbox\"],\n    .list-thumb li .check-wrap,\n    .list-thumb li .checkbox {\n       z-index: 50 !important;\n    }\n    \n    /* 修复列表视图下的错位 */\n    .list-type-listview .has-cover-enhanced {\n        height: auto !important;\n        margin-bottom: 0 !important;\n        padding-top: 0 !important;\n    }\n    .list-type-listview .has-cover-enhanced .file-thumb.cover-enhanced-container {\n        height: auto !important;\n        margin-top: 0 !important;\n        width: 40px !important;\n    }\n    .list-type-listview .enhanced-cover-layer {\n        width: 30px !important;\n        height: 40px !important;\n        top: 50% !important;\n        transform: translate(-50%, -50%) !important;\n    }\n    .list-type-listview .has-cover-enhanced:hover .enhanced-cover-layer {\n        transform: translate(-50%, -50%) scale(2) !important; /* 列表模式下悬停可以放大看清楚 */\n        z-index: 99 !important;\n    }\n  ";
          if ("undefined" != typeof GM_addStyle) GM_addStyle(css); else {
            const style = document.createElement("style");
            style.textContent = css, document.head.appendChild(style);
          }
        }(), function() {
          const fancyboxCSS = GM_getResourceText("fancyboxCSS");
          if (fancyboxCSS) GM_addStyle(fancyboxCSS); else {
            const link = document.createElement("link");
            link.rel = "stylesheet", link.href = "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css", 
            document.head.appendChild(link);
          }
          GM_addStyle("\n    /* Fancybox 容器层级提升 - 确保在 115 页面最顶层 */\n    .fancybox__container {\n        z-index: 999999999 !important;\n    }\n\n    /* 自定义工具栏按钮高亮状态 (用于滚轮模式) */\n    .f-button.is-active-mode {\n        color: #2ed573;\n        background: rgba(46, 213, 115, 0.1);\n    }\n    \n    .f-button.is-active-mode svg {\n        filter: drop-shadow(0 0 2px #2ed573);\n    }\n    \n    /* 左右切换按钮 - 长条形样式，覆盖整个侧边区域 */\n    .fancybox__nav {\n        /* 使按钮容器覆盖整个侧边 */\n    }\n    \n    .fancybox__nav .f-button {\n        position: fixed !important;\n        top: 50% !important;\n        transform: translateY(-50%) !important;\n        width: 60px !important;\n        height: 60% !important;\n        min-height: 300px !important;\n        max-height: 80vh !important;\n        border-radius: 12px !important;\n        background: rgba(0, 0, 0, 0.3) !important;\n        backdrop-filter: blur(8px) !important;\n        transition: all 0.3s ease !important;\n        opacity: 0.6 !important;\n        z-index: 999999 !important;\n    }\n    \n    /* 左侧按钮 */\n    .fancybox__nav .f-button.is-prev {\n        left: 10px !important;\n    }\n    \n    /* 右侧按钮 */\n    .fancybox__nav .f-button.is-next {\n        right: 10px !important;\n    }\n    \n    /* 悬停效果 */\n    .fancybox__nav .f-button:hover {\n        opacity: 1 !important;\n        background: rgba(0, 0, 0, 0.5) !important;\n        width: 70px !important;\n    }\n    \n    /* 按钮内的箭头图标 */\n    .fancybox__nav .f-button svg {\n        width: 32px !important;\n        height: 32px !important;\n        stroke-width: 2.5 !important;\n        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)) !important;\n    }\n    \n    /* 按钮激活/点击效果 */\n    .fancybox__nav .f-button:active {\n        transform: translateY(-50%) scale(0.98) !important;\n        background: rgba(0, 0, 0, 0.6) !important;\n    }\n\n    /* 调整缩略图导航栏背景 */\n    .f-thumbs__track {\n        background: rgba(0,0,0,0.8);\n    }\n    \n    /* Toast 提示 */\n    .fb-toast {\n        position: fixed;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n        background: rgba(0, 0, 0, 0.85);\n        color: white;\n        padding: 12px 24px;\n        border-radius: 8px;\n        z-index: 999999999;\n        font-size: 16px;\n        pointer-events: none;\n        backdrop-filter: blur(4px);\n        box-shadow: 0 4px 12px rgba(0,0,0,0.3);\n        animation: fadeInOut 2s ease-in-out forwards;\n    }\n\n    @keyframes fadeInOut {\n        0% { opacity: 0; transform: translate(-50%, -40%); }\n        10% { opacity: 1; transform: translate(-50%, -50%); }\n        80% { opacity: 1; }\n        100% { opacity: 0; }\n    }\n  ");
        }(), await this.coverEnhancer.init(), this.viewModeManager.init(), this.viewerManager.init(), 
        await this.sidebarManager.init();
      } catch (error) {}
    }
    refresh() {
      this.coverEnhancer.refresh(), this.viewerManager.refresh(), this.sidebarManager.refresh();
    }
    destroy() {
      this.coverEnhancer.destroy(), this.viewModeManager.destroy(), this.viewerManager.destroy(), 
      this.sidebarManager.destroy();
    }
    getSidebarManager() {
      return this.sidebarManager;
    }
    getSettingsManager() {
      return SettingsManager.getInstance();
    }
  };
  "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", () => app.init()) : app.init(), 
  window.__115_mod__ = {
    refresh: () => app.refresh(),
    destroy: () => app.destroy(),
    help: () => {}
  }, window.__115_sidebar__ = app, window.__115_sidebar_settings__ = {
    show: () => app.getSidebarManager().openSettings?.(),
    export: () => app.getSettingsManager().exportSettings(),
    import: json => app.getSettingsManager().importSettings(json),
    refresh: () => app.refresh(),
    info: () => app.getSettingsManager().getSettingsInfo()
  };
}();
