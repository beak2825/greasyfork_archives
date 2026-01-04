// ==UserScript==
// @name         水源社区相册模式
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  为水源添加「相册模式 / Gallery Mode」功能，以更方便地浏览话题中的图片内容。
// @author       Rosmontis & Assistant
// @match        https://shuiyuan.sjtu.edu.cn/*
// @license      MIT
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561208/%E6%B0%B4%E6%BA%90%E7%A4%BE%E5%8C%BA%E7%9B%B8%E5%86%8C%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/561208/%E6%B0%B4%E6%BA%90%E7%A4%BE%E5%8C%BA%E7%9B%B8%E5%86%8C%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 调试开关
  const DEBUG = false;

  const DISCOURSE_BASE = "https://shuiyuan.sjtu.edu.cn";

  const CONFIG = {
    btnId: "tm-gallery-btn",
    batchSize: 30,
    minImgSize: 50,
    rowThreshold: 200,
    maxWidth: 1200,
    fitModes: {
      cover: "cover",
      contain: "contain",
    },
  };

  // 简单日志工具
  const Logger = {
    log: (msg, data) =>
      DEBUG &&
      console.log(
        `%c[Gallery] ${msg}`,
        "color: #0aa; font-weight: bold;",
        data || ""
      ),
    error: (msg, err) =>
      DEBUG &&
      console.log(
        `%c[Gallery Error] ${msg}`,
        "color: #f00; font-weight: bold;",
        err || ""
      ),
  };

  GM_addStyle(`
        #${CONFIG.btnId}:hover svg { color: #66ccff; fill: #66ccff; }
        
        /* 遮罩层 */
        #tm-gallery-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: color-mix(in srgb, transparent 10%, var(--secondary, #222)); z-index: 100;
            display: flex; flex-direction: column;
            opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
        }
        #tm-gallery-overlay.active { opacity: 1; pointer-events: auto; }
        
        /* 顶部栏 */
        .tm-gallery-header {
            height: 60px; display: flex; align-items: center; justify-content: space-between;
            padding: 0 16px; background: var(--header_background, #222); color: var(--title-color--header);
            border-bottom: 1px solid var(--primary-low, #444); flex-shrink: 0;
        }
        .tm-gallery-title-block { display: flex; flex-direction: column; gap: 4px; overflow: hidden; } 
        #tm-gallery-title { font-size: 16px; font-weight: 600; color: var(--title-color--header); white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
        #tm-gallery-status { font-size: 13px; color: var(--primary-medium, #b3b3b3); }
        
        /* 操作按钮 */
        .tm-gallery-actions { display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .tm-action-btn { cursor: pointer; height: 36px; width: 36px; display: inline-flex; align-items: center; justify-content: center; border: none; background: transparent; color: inherit; padding: 0; border-radius: 6px; transition: background-color 0.15s ease, color 0.15s ease; }
        .tm-action-btn svg { height: 28px; width: 28px; } 
        .tm-action-btn:hover { background: var(--primary-low, rgba(255,255,255,0.08)); color: var(--primary, #0088cc); }
        
        /* 滚动区域 */
        #tm-gallery-scroll {
          flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 20px; align-items: center;
        }
        
        /* 网格容器 */
        .tm-gallery-grid-wrapper { width: 100%; max-width: ${CONFIG.maxWidth}px; }
        
        /* 响应式网格布局 */
        .tm-gallery-grid {
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          grid-auto-rows: 1fr; 
          gap: 15px;
        }
        
        @media (max-width: 768px) {
            .tm-gallery-grid {
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
                gap: 8px !important; 
            }
            #tm-gallery-scroll {
                padding: 10px;
                gap: 10px;
            }
        }

        #tm-gallery-grid { order: 2; }
        #tm-gallery-grid-prev {
          order: 1; transform: scaleY(-1); direction: rtl;
        }
        #tm-gallery-grid-prev .tm-gallery-item { transform: scaleY(-1); direction: ltr; }
        
        /* 单个图片卡片 */
        .tm-gallery-item {
            position: relative; border-radius: 8px; overflow: hidden; background: var(--secondary, #222); border: 1px solid var(--primary-low, #444); aspect-ratio: 1 / 1; cursor: zoom-in;
        }
        .tm-gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: object-fit 0.15s ease, background-color 0.15s ease; }
        #tm-gallery-overlay.tm-fit-contain .tm-gallery-item img { object-fit: contain; background: var(--primary-low, #2a2a2a); }
        
        /* 元数据浮层 */
        .tm-gallery-meta {
            position: absolute; bottom: 0; left: 0; right: 0;
            background: color-mix(in srgb, transparent 30%, var(--primary, #222)); color: var(--secondary, #ccc); padding: 5px; font-size: 12px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        
        /* 加载动画 */
        .tm-loader { grid-column: 1 / -1; text-align: center; color: #888; padding: 20px; animation: tm-fade-slide 0.2s ease; }
        .tm-loader.top { order: -1; transform: scaleY(-1); }
        @keyframes tm-fade-slide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    `);

  const State = {
    topicId: null,
    stream: [],
    nextIndex: 0,
    prevIndex: -1,
    isLoadingNext: false,
    isLoadingPrev: false,
    nextEnded: false,
    prevEnded: false,
    galleryOpen: false,
    topicTitle: "",
    fitMode: CONFIG.fitModes.cover,
  };

  class GalleryCore {
    constructor() {
      this.parser = new DOMParser();
      this.LightboxLib = null;
      this.createUI();
      this.bindEvents();
      this.preloadLightbox();
    }

    // 预加载 Lightbox
    preloadLightbox() {
      try {
        const req =
          window.require ||
          (window.unsafeWindow && window.unsafeWindow.require);
        if (req) {
          const mod = req("discourse/lib/lightbox");
          this.LightboxLib = mod && mod.default ? mod.default : mod;
        }
      } catch (e) {
        Logger.log("Lightbox module preload failed", e);
      }
    }

    getAnchorOffset() {
      const containerRect = this.scrollArea.getBoundingClientRect();
      const anchor = this.grid.firstElementChild || this.grid;
      const anchorRect = anchor.getBoundingClientRect();
      return anchorRect.top - containerRect.top;
    }

    createUI() {
      const overlay = document.createElement("div");
      overlay.id = "tm-gallery-overlay";
      overlay.innerHTML = `
                <div class="tm-gallery-header">
                  <div class="tm-gallery-title-block">
                    <div id="tm-gallery-title">加载中...</div>
                    <div id="tm-gallery-status">准备就绪</div>
                  </div>
                  <div class="tm-gallery-actions">
                    <button class="tm-action-btn tm-fit-toggle" title="切换填充/自适应" aria-label="切换填充模式">
                      <svg class="d-icon d-icon-resize-handle svg-icon" viewBox="-500 -500 2800 2800" xmlns="http://www.w3.org/2000/svg"><path d="M883 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z"/></svg>
                    </button>
                    <button class="tm-action-btn tm-gallery-close" aria-label="关闭">
                      <svg class="d-icon d-icon-times svg-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M24 10l-2-2-6 6-6-6-2 2 6 6-6 6 2 2 6-6 6 6 2-2-6-6z"/></svg>
                    </button>
                  </div>
                </div>
                <div id="tm-gallery-scroll">
                  <div class="tm-gallery-grid-wrapper"><div id="tm-gallery-grid-prev" class="tm-gallery-grid"></div></div>
                  <div class="tm-gallery-grid-wrapper"><div id="tm-gallery-grid" class="tm-gallery-grid"></div></div>
                </div>
            `;
      document.body.appendChild(overlay);
      this.overlay = overlay;
      this.scrollArea = overlay.querySelector("#tm-gallery-scroll");
      this.prevGrid = overlay.querySelector("#tm-gallery-grid-prev");
      this.grid = overlay.querySelector("#tm-gallery-grid");
      this.titleEl = overlay.querySelector("#tm-gallery-title");
      this.status = overlay.querySelector("#tm-gallery-status");
      this.closeBtn = overlay.querySelector(".tm-gallery-close");
      this.fitToggleBtn = overlay.querySelector(".tm-fit-toggle");
    }

    bindEvents() {
      this.closeBtn.onclick = () => this.toggle(false);
      this.fitToggleBtn.onclick = () => this.toggleFitMode();
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && State.galleryOpen) this.toggle(false);
      });
      this.scrollArea.addEventListener(
        "wheel",
        (e) => {
          if (!State.galleryOpen) return;
          e.stopPropagation();
          const canScroll =
            this.scrollArea.scrollHeight > this.scrollArea.clientHeight;
          if (!canScroll) {
            e.preventDefault();
            this.ensureScrollable();
          }
        },
        { passive: false }
      );
      this.scrollArea.addEventListener("scroll", () => {
        if (!State.galleryOpen) return;
        const { scrollTop, scrollHeight, clientHeight } = this.scrollArea;
        const distBottom = scrollHeight - (scrollTop + clientHeight);

        if (
          !State.nextEnded &&
          !State.isLoadingNext &&
          distBottom <= CONFIG.rowThreshold
        ) {
          this.loadBatch("next");
        }

        if (
          !State.prevEnded &&
          !State.isLoadingPrev &&
          scrollTop <= CONFIG.rowThreshold
        ) {
          this.loadBatch("prev");
        }
      });
    }

    // 从 URL 中提取话题 ID
    getTopicId() {
      const match = location.href.match(/\/t\/[^\/]+\/(\d+)/);
      return match ? match[1] : null;
    }

    // 从 URL 中提取当前帖子编号
    getCurrentPostNumber() {
      const match = location.href.match(/\/t\/[^\/]+\/(\d+)\/(\d+)/);
      return match ? parseInt(match[2], 10) : null;
    }

    applyFitMode(mode) {
      if (mode === CONFIG.fitModes.contain) {
        this.overlay.classList.add("tm-fit-contain");
        if (this.fitToggleBtn)
          this.fitToggleBtn.title = "当前: 自适应，点击改为填充";
      } else {
        this.overlay.classList.remove("tm-fit-contain");
        if (this.fitToggleBtn)
          this.fitToggleBtn.title = "当前: 填充，点击改为自适应";
      }
    }

    updateLoadedRangeStatus() {
      const total = State.stream.length || 0;
      if (!total) return;
      const startIdx = Math.max(0, State.prevIndex + 1);
      const endIdx = Math.max(startIdx, State.nextIndex - 1);
      const text = `已加载 ${startIdx + 1}-${endIdx + 1} / ${total}`;
      this.updateStatus(text);
    }

    ensureScrollable() {
      if (!State.galleryOpen) return;
      const { scrollHeight, clientHeight } = this.scrollArea;
      // 如果内容不足以滚动，自动加载下一页
      if (scrollHeight <= clientHeight + CONFIG.rowThreshold) {
        if (!State.nextEnded && !State.isLoadingNext) {
          this.loadBatch("next");
        } else if (!State.prevEnded && !State.isLoadingPrev) {
          this.loadBatch("prev");
        }
      }
    }

    toggleFitMode() {
      State.fitMode =
        State.fitMode === CONFIG.fitModes.cover
          ? CONFIG.fitModes.contain
          : CONFIG.fitModes.cover;
      this.applyFitMode(State.fitMode);
    }

    scrollToPostNumber(postNumber) {
      const target =
        this.grid.querySelector(`[data-post-number="${postNumber}"]`) ||
        this.prevGrid.querySelector(`[data-post-number="${postNumber}"]`);
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "center" });
      }
    }

    async initData() {
      const tid = this.getTopicId();
      if (!tid) return false;

      this.grid.innerHTML = "";
      this.prevGrid.innerHTML = "";
      this.scrollArea.scrollTop = 0;
      State.topicId = tid;
      State.nextEnded = false;
      State.prevEnded = false;
      State.isLoadingNext = false;
      State.isLoadingPrev = false;
      this.updateStatus("正在请求话题元数据...");

      try {
        const url = `${DISCOURSE_BASE}/t/topic/${tid}.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

        const json = await res.json();

        if (!json.post_stream?.stream)
          throw new Error("缺少 post_stream.stream");

        State.stream = json.post_stream.stream;
        State.topicTitle = json.fancy_title || json.title || "";
        if (this.titleEl)
          this.titleEl.textContent = State.topicTitle || "图片流";

        let startIndex = 0;
        const lastPart = this.getCurrentPostNumber() ?? 1;
        if (!isNaN(lastPart) && lastPart >= 1) {
          startIndex = Math.max(0, lastPart - 5);
        }

        const maxIndex = Math.max(0, State.stream.length - 1);
        startIndex = Math.min(startIndex, maxIndex);

        State.nextIndex = startIndex;
        State.prevIndex = startIndex - 1;
        State.prevEnded = State.prevIndex < 0;

        this.updateStatus(
          `共 ${State.stream.length} 层，从第 ${State.nextIndex + 1} 层加载...`
        );

        this.applyFitMode(State.fitMode);

        await this.loadBatch("next");

        if (!State.prevEnded) {
          const prefetchSize = Math.max(1, Math.floor(CONFIG.batchSize / 2));
          await this.loadBatch("prev", prefetchSize);
        }

        this.ensureScrollable();
        this.updateLoadedRangeStatus();
        return true;
      } catch (e) {
        Logger.error("初始化失败", e);
        this.updateStatus("初始化失败: " + e.message);
        return false;
      }
    }

    async fetchPostIds(ids) {
      if (!ids || ids.length === 0) return [];
      const params = ids.map((id) => `post_ids[]=${id}`).join("&");
      const url = `${DISCOURSE_BASE}/t/${State.topicId}/posts.json?include_suggested=false&${params}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch Error ${res.status}`);
      const data = await res.json();
      return data.post_stream?.posts || [];
    }

    async loadBatch(direction = "next", sizeOverride) {
      const isNext = direction === "next";
      const loadingKey = isNext ? "isLoadingNext" : "isLoadingPrev";
      const endedKey = isNext ? "nextEnded" : "prevEnded";

      if (State[loadingKey] || State[endedKey]) return;

      if (isNext && State.nextIndex >= State.stream.length) {
        State.nextEnded = true;
        this.updateStatus("已加载全部");
        return;
      }
      if (!isNext && State.prevIndex < 0) {
        State.prevEnded = true;
        return;
      }

      const size = sizeOverride || CONFIG.batchSize;
      let batchIds = [];
      let start = 0;
      let end = 0;

      if (isNext) {
        end = Math.min(State.nextIndex + size, State.stream.length);
        batchIds = State.stream.slice(State.nextIndex, end);
      } else {
        start = Math.max(0, State.prevIndex - size + 1);
        batchIds = State.stream.slice(start, State.prevIndex + 1);
      }

      if (batchIds.length === 0) {
        State[endedKey] = true;
        return;
      }

      const anchorBefore = isNext ? 0 : this.getAnchorOffset();

      try {
        State[loadingKey] = true;
        this.showLoader(true, isNext ? "next" : "prev");

        const posts = await this.fetchPostIds(batchIds);
        this.processPosts(posts, { direction });

        if (isNext) {
          State.nextIndex = end;
          if (State.nextIndex >= State.stream.length) State.nextEnded = true;
        } else {
          State.prevIndex = start - 1;
          if (State.prevIndex < 0) State.prevEnded = true;
        }

        this.updateLoadedRangeStatus();
      } catch (e) {
        Logger.error(isNext ? "加载后续批次失败" : "加载前序批次失败", e);
        this.updateStatus(isNext ? "加载出错" : "向前加载出错");
      } finally {
        State[loadingKey] = false;
        this.showLoader(false, isNext ? "next" : "prev");

        if (isNext) {
          this.ensureScrollable();
        } else {
          requestAnimationFrame(() => {
            const anchorAfter = this.getAnchorOffset();
            const anchorDelta = anchorAfter - anchorBefore;
            if (Math.abs(anchorDelta) > 1) {
              this.scrollArea.scrollTop += anchorDelta;
            }
            this.ensureScrollable();
          });
        }
      }
    }

    processPosts(posts, { direction }) {
      Logger.log(`处理 ${posts.length} 个帖子, 方向: ${direction}`);

      const orderedPosts =
        direction === "prev" ? [...posts].reverse() : [...posts];
      const fragment = document.createDocumentFragment(); // 使用 Fragment 优化 DOM 插入

      orderedPosts.forEach((post) => {
        if (!post.cooked) {
          return;
        }

        const doc = this.parser.parseFromString(post.cooked, "text/html");
        const uniqueImgs = [];
        const seen = new Set();

        const imgs = doc.querySelectorAll("img");
        imgs.forEach((img) => {
          const cls = img.classList;
          const src = img.getAttribute("src");
          if (!src) return;

          if (cls.contains("emoji") || src.includes("/emoji/")) return;
          if (cls.contains("avatar")) return;

          const w = parseInt(img.getAttribute("width")) || 0;
          const h = parseInt(img.getAttribute("height")) || 0;

          if (
            (w > 0 && w < CONFIG.minImgSize) ||
            (h > 0 && h < CONFIG.minImgSize)
          ) {
            return;
          }

          const meta = this.extractLightboxMeta(img, src);
          const key = meta.href || meta.src || meta.thumb;

          if (!seen.has(key)) {
            seen.add(key);
            uniqueImgs.push(meta);
          }
        });

        if (uniqueImgs.length > 0) {
          Logger.log(
            `Post #${post.post_number} 找到 ${uniqueImgs.length} 张图`,
            uniqueImgs
          );

          const imagesToRender =
            direction === "prev" ? uniqueImgs.reverse() : uniqueImgs;

          imagesToRender.forEach((meta) => {
            const el = this.createImageElement(meta, post);
            fragment.appendChild(el);
          });
        }
      });

      const targetGrid = direction === "prev" ? this.prevGrid : this.grid;
      targetGrid.appendChild(fragment);
    }

    createImageElement(meta, post) {
      const normalizedThumb = meta.thumb?.startsWith("/")
        ? DISCOURSE_BASE + meta.thumb
        : meta.thumb;
      const normalizedHref = meta.href?.startsWith("/")
        ? DISCOURSE_BASE + meta.href
        : meta.href;

      const div = document.createElement("div");
      div.className = "tm-gallery-item";

      // 显式创建缩略图 img
      const thumbImg = document.createElement("img");
      thumbImg.src = normalizedThumb;
      thumbImg.loading = "lazy";

      div.appendChild(thumbImg);

      // 元数据层
      const metaDiv = document.createElement("div");
      metaDiv.className = "tm-gallery-meta";
      metaDiv.textContent = `#${post.post_number} @${post.username}`;
      div.appendChild(metaDiv);

      // 绑定数据供 Lightbox 读取
      div.dataset.postNumber = post.post_number;
      if (normalizedHref) div.dataset.href = normalizedHref;
      if (meta.downloadHref) div.dataset.downloadHref = meta.downloadHref;
      if (meta.srcset) div.dataset.srcset = meta.srcset;
      if (meta.sha1) div.dataset.sha1 = meta.sha1;
      if (meta.width) div.dataset.width = String(meta.width);
      if (meta.height) div.dataset.height = String(meta.height);

      div.onclick = (e) => {
        e.preventDefault();
        // 尝试调用 Discourse Lightbox，如果失败则回退
        this.openLightbox(div, normalizedHref).then((success) => {
          if (!success) {
            const link = `${DISCOURSE_BASE}/t/${post.topic_slug}/${post.topic_id}/${post.post_number}`;
            window.open(link, "_blank");
          }
        });
      };

      return div;
    }

    // 调用 Discourse 内置 Lightbox 显示图片原图
    async openLightbox(el, href) {
      const targetHref = href || el?.dataset?.href;
      if (!targetHref) return false;

      if (!this.LightboxLib) this.preloadLightbox();
      if (!this.LightboxLib) return false;

      const sourceImg = el.querySelector("img");
      const baseRect = sourceImg.getBoundingClientRect();

      // 计算实际可视区域
      const fitMode = window.getComputedStyle(sourceImg).objectFit;

      let { left, top, width, height } = baseRect;

      // 只有在 contain 模式且图片已加载原始尺寸时，才需要计算缩放后的实际边界
      if (
        fitMode === "contain" &&
        sourceImg.naturalWidth &&
        sourceImg.naturalHeight
      ) {
        const ratioNat = sourceImg.naturalWidth / sourceImg.naturalHeight;
        const ratioClient = baseRect.width / baseRect.height;

        if (ratioNat > ratioClient) {
          const renderH = baseRect.width / ratioNat;
          top += (baseRect.height - renderH) / 2;
          height = renderH;
        } else {
          const renderW = baseRect.height * ratioNat;
          left += (baseRect.width - renderW) / 2;
          width = renderW;
        }
      }

      // 构建临时 Anchor
      const anchor = document.createElement("a");
      anchor.className = "lightbox";
      anchor.href = targetHref;
      Object.assign(anchor.style, {
        position: "fixed",
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: "99999",
        margin: "0",
        padding: "0",
        boxSizing: "border-box",
        overflow: "hidden",
      });

      // 传递 Discourse Lightbox 需要的数据
      const datasetMap = {
        downloadHref: "download-href",
        srcset: "srcset",
        width: "target-width",
        height: "target-height",
        sha1: "base62-sha1",
      };
      for (const [key, attr] of Object.entries(datasetMap)) {
        if (el.dataset[key])
          anchor.setAttribute(`data-${attr}`, el.dataset[key]);
      }
      if (el.dataset.width) anchor.setAttribute("width", el.dataset.width);
      if (el.dataset.height) anchor.setAttribute("height", el.dataset.height);

      // 临时图片
      const img = document.createElement("img");
      img.src = sourceImg.src;
      Object.assign(img.style, {
        width: "100%",
        height: "100%",
        objectFit: fitMode,
      });

      if (el.dataset.sha1)
        img.setAttribute("data-base62-sha1", el.dataset.sha1);

      anchor.appendChild(img);

      // 挂载容器
      let container = document.querySelector(".tm-lightbox-container");
      if (container) container.remove();
      container = document.createElement("div");
      document.body.appendChild(container);
      container.className = "tm-lightbox-container";

      Object.assign(container.style, {
        position: "absolute",
        top: "0",
        left: "0",
      });
      container.appendChild(anchor);

      try {
        await this.LightboxLib(container);
        anchor.click();

        setTimeout(() => {
          if (document.body.contains(container))
            container.style.visibility = "hidden";
        }, 800);

        return true;
      } catch (err) {
        Logger.error("Lightbox open failed", err);
        container.remove();
        window.open(targetHref, "_blank");
        return true;
      }
    }

    extractLightboxMeta(img, fallbackSrc) {
      const parent = img.closest("a.lightbox");
      const thumb = fallbackSrc;
      const href = parent?.getAttribute("href") || thumb;
      const downloadHref = parent?.getAttribute("data-download-href") || "";
      const srcset =
        img.getAttribute("srcset") || parent?.getAttribute("data-srcset") || "";
      const width = parseInt(img.getAttribute("width")) || 0;
      const height = parseInt(img.getAttribute("height")) || 0;
      const sha1 = img.getAttribute("data-base62-sha1") || "";
      const dominantColor = img.getAttribute("data-dominant-color") || "";

      return {
        thumb,
        href,
        downloadHref,
        srcset,
        width,
        height,
        sha1,
        dominantColor,
      };
    }

    updateStatus(text) {
      if (this.status) this.status.textContent = text;
    }

    showLoader(show, position = "next") {
      const container = position === "prev" ? this.prevGrid : this.grid;
      const cls = position === "prev" ? "tm-loader top" : "tm-loader";
      let loader = container.querySelector(".tm-loader");
      if (show) {
        if (!loader) {
          loader = document.createElement("div");
          loader.className = cls;
          loader.innerHTML =
            position === "prev" ? "向前加载中..." : "正在加载数据...";
          container.appendChild(loader);
        }
      } else {
        if (loader) loader.remove();
      }
    }

    async toggle(forceState) {
      const nextState =
        forceState !== undefined ? forceState : !State.galleryOpen;
      if (nextState) {
        State.galleryOpen = true;
        this.overlay.classList.add("active");
        document.body.style.overflow = "hidden";
        this.applyFitMode(State.fitMode);

        if (!this.LightboxLib) this.preloadLightbox();

        const currentTid = this.getTopicId();
        // 如果话题变了，或者数据为空，重新初始化
        if (
          !State.topicId ||
          State.topicId !== currentTid ||
          State.stream.length === 0
        ) {
          await this.initData();
        } else {
          // 话题没变，尝试定位到当前楼层
          const currentPost = this.getCurrentPostNumber();
          if (currentPost) {
            this.scrollToPostNumber(currentPost);
            this.updateStatus(`已定位到 #${currentPost}`);
          }
        }
      } else {
        State.galleryOpen = false;
        this.overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  }

  const gallery = new GalleryCore();

  function insertButton() {
    const bar = document.querySelector(".timeline-footer-controls");
    if (!bar || document.getElementById(CONFIG.btnId)) return;

    const btn = document.createElement("button");
    btn.id = CONFIG.btnId;
    btn.className = "btn no-text btn-icon btn-default";
    btn.title = "查看图片流";
    btn.innerHTML = `
            <svg class="d-icon d-icon-th-large svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M296 32h192c13.255 0 24 10.745 24 24v160c0 13.255-10.745 24-24 24H296c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24zm-80 0H24C10.745 32 0 42.745 0 56v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24zM0 296v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm296 184h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H296c-13.255 0-24 10.745-24 24v160c0 13.255 10.745 24 24 24z"/>
            </svg>
        `;
    btn.onclick = (e) => {
      e.preventDefault();
      btn.blur();
      gallery.toggle();
    };
    bar.appendChild(btn);
  }

  setInterval(insertButton, 1000);
})();
