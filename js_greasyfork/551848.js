// ==UserScript==
// @name         老魔-预览
// @version      0.4.5
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  老王论坛·魔性论坛·司机社·GCBT·U9A9·(预览图片·自动签到)
// @match        https://laowang.vip/*
// @match        https://moxing.app/*
// @match        https://sjs47.com/*
// @match        https://xsijishe.net/*
// @match        https://gcbt.net/*
// @match        https://u9a9.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moxing.app
// @license      GPL-3.0
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      gcbt.net
// @connect      bt.bxmho.cn
// @connect      bt.ivcbt.com
// @connect      rmdown.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551848/%E8%80%81%E9%AD%94-%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/551848/%E8%80%81%E9%AD%94-%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

!function() {
  "use strict";
  var _a, _b;
  const registry = new class {
    constructor() {
      this.modules = [];
    }
    register(module) {
      this.modules.push(module);
    }
    registerAll(modules2) {
      modules2.forEach(m => this.register(m));
    }
    matchByHost(hostname) {
      for (const module of this.modules) if (module.config.domainPattern.test(hostname)) return module;
      return null;
    }
    detectPageType(module) {
      const {pathname: pathname, href: href, search: search} = location, {pages: pages} = module.config;
      if (pages.content?.some(p => p.test(pathname))) return "content";
      if (pages.search?.some(p => p.test(href))) return "search";
      if (pages.list.some(p => p.test(pathname) || p.test(href))) return pages.home.some(p => p.test(pathname)) && !search && "gcbt" !== module.type ? "home" : "list";
      if (pages.home.some(p => p.test(pathname))) {
        if (!search) return "home";
        if (!search.includes("mod=forumdisplay") && !search.includes("fid=")) return "home";
      }
      return "other";
    }
    getAll() {
      return [ ...this.modules ];
    }
  }, GCBT_CONFIG = {
    DEBUG_MODE: !0,
    selectors: {
      postList: "article.post-list",
      contentArea: ".content-area",
      entryTitle: "h2.entry-title a",
      metaDate: "li.meta-date time",
      pagination: "main .numeric-pagination",
      entryContent: ".entry-content, .entry-wrapper, .article-content",
      imageSelectors: [ ".entry-content img", ".entry-wrapper img" ],
      contentPageTitle: "h1, h2.entry-title, .entry-title, article h1, article h2",
      contentPageContainer: "article, .entry-content, .content-area, main"
    },
    cacheTTL: 864e5,
    maxPreviewImages: 4,
    concurrentLimit: 20,
    DATA_VERSION: 4,
    btSites: [ {
      name: "bxmho",
      pattern: /(?:\/\/bt\.bxmho\.cn\/list\.php\?name=|userscript\.html\?name=)([0-9a-z]+)/i,
      url: "https://bt.bxmho.cn/list.php",
      method: "GET",
      paramName: "name",
      getHash: match => {
        const hashMatch = match.match(/([0-9a-z]+)$/i);
        return hashMatch ? hashMatch[1] : "";
      }
    }, {
      name: "ivcbt",
      pattern: /(?:\/\/bt\.ivcbt\.com\/list\.php\?name=|userscript\.html\?name=)([0-9a-z]+)/i,
      url: "https://bt.ivcbt.com/list.php",
      method: "GET",
      paramName: "name",
      getHash: match => {
        const hashMatch = match.match(/([0-9a-z]+)$/i);
        return hashMatch ? hashMatch[1] : "";
      }
    }, {
      name: "rmdown",
      pattern: /\/\/(?:www\.)?rmdown\.com\/link\.php\?hash=([0-9a-fA-F]+)/i,
      url: "https://www.rmdown.com/link.php",
      paramName: "hash",
      method: "GET",
      getHash: match => {
        const hashMatch = match.match(/hash=([0-9a-fA-F]+)/i);
        return hashMatch ? hashMatch[1] : "";
      }
    } ]
  };
  let StyleManager$1 = ((_a = class {
    static init() {
      this.styleInjected || (this.injectStyles(), this.styleInjected = !0);
    }
    static injectStyles() {
      const styleSheet = document.createElement("style");
      styleSheet.id = "gcbt-styles", styleSheet.textContent = '.gcbt-card-list{display:flex;flex-direction:column;gap:18px;margin-top:12px}.gcbt-card{background:#fff;border:1px solid #e6eaf3;border-radius:14px;padding:18px;box-shadow:0 8px 24px rgba(15,23,42,.05)}.gcbt-card__title{font-size:18px;line-height:1.4;margin:0 0 10px;font-weight:600}.gcbt-card__title a{color:#111;text-decoration:none}.gcbt-card__title a:hover{color:#2563eb}.gcbt-card__images{display:flex;gap:12px;flex-wrap:nowrap;overflow-x:auto;margin-bottom:12px;scrollbar-width:thin}.gcbt-card__img,.gcbt-card__img-placeholder,.gcbt-card__placeholder{flex:0 0 calc(25% - 9px);height:190px;border-radius:10px;border:1px solid #e5e8f0;background:#0b111f;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:13px;color:#c6cedf;position:relative}.gcbt-card__img img{width:100%;height:100%;object-fit:contain;background:#000}.gcbt-card__img img.is-broken{filter:grayscale(1);opacity:.6}.gcbt-card__more{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.65);color:#fff;font-size:12px;padding:2px 8px;border-radius:12px}.gcbt-card__placeholder{cursor:default}.gcbt-card__placeholder.is-error{border-color:#f0978f;background:#fff5f4;color:#d93025}.gcbt-card__magnet-block{border-top:1px dashed #e2e6ef;padding-top:10px}.gcbt-card__magnet-title{font-size:13px;font-weight:600;color:#343a4c;margin-bottom:6px}.gcbt-card__magnet-list{display:flex;flex-direction:column;gap:6px;font-size:13px}.gcbt-card__magnet-row{display:flex;gap:8px;align-items:flex-start}.gcbt-card__magnet-label{font-weight:600;color:#6b7280;min-width:50px}.gcbt-card__magnet-text{color:#1f2937;word-break:break-all;text-decoration:none}.gcbt-card__magnet-text:hover{color:#2563eb;text-decoration:underline}.gcbt-card__magnet-empty{color:#a0a7b6;font-size:13px}.gcbt-detail-magnets{margin-bottom:18px;padding:14px;border:1px solid #e4ecf6;border-radius:12px;background:#f8fbff;box-shadow:0 4px 12px rgba(15,23,42,.05)}.gcbt-detail-magnets__title{font-weight:600;font-size:14px;color:#1f2a37;margin-bottom:6px}.gcbt-detail-magnets__item{font-size:13px;color:#111;word-break:break-all;padding:4px 0;border-top:1px dashed #e1e7f0}.gcbt-detail-magnets__item:first-of-type{border-top:none;padding-top:0}.rollbar-item.tap-dark,.navbar-button:has(.mdi-brightness-4){display:none!important}body[class*="dark"],html[class*="dark"]{background:#f5f6f8!important;color:#333!important}', 
      document.documentElement.appendChild(styleSheet);
    }
    static unhidePosts() {
      const styleSheet = document.getElementById("gcbt-styles");
      styleSheet && (styleSheet.textContent = styleSheet.textContent?.replace("article.post-list { visibility: hidden; }", "") || "");
    }
  }).styleInjected = !1, _a), DomManager$1 = class {
    static cleanPage() {
      document.body.classList.remove("dark", "dark-mode", "night-mode"), document.documentElement.classList.remove("dark", "dark-mode", "night-mode"), 
      document.body.style.backgroundColor = "#fff", document.body.style.color = "#333";
    }
    static isContentPage() {
      const path = window.location.pathname, looksLikeDetail = /\/(download|post)\//i.test(path), listPage = null !== document.querySelector(GCBT_CONFIG.selectors.postList), hasArticleContent = null !== document.querySelector(".article-content, .single, .single-post, .page");
      return !!looksLikeDetail || !(listPage && !looksLikeDetail) && hasArticleContent && !listPage;
    }
    static async displayMagnetLinkOnContentPage() {
      if (!this.isContentPage()) return;
      const titleEl = document.querySelector(GCBT_CONFIG.selectors.contentPageTitle), contentRoot = document.querySelector(GCBT_CONFIG.selectors.entryContent);
      if (!titleEl && !contentRoot) return;
      const anchorParent = contentRoot || titleEl?.parentElement || document.body;
      if (anchorParent.querySelector(".gcbt-detail-magnets")) return;
      const insertBeforeNode = titleEl || anchorParent.firstElementChild || anchorParent.firstChild;
      try {
        const content = document.querySelector(GCBT_CONFIG.selectors.entryContent) || document.body, magnets = await this.extractMagnetsFromContent(content);
        if (!magnets.length) return;
        const container = document.createElement("div");
        container.className = "gcbt-detail-magnets", magnets.forEach(magnet => {
          const row = document.createElement("div");
          if (row.className = "gcbt-detail-magnets__item", magnet.startsWith("http://") || magnet.startsWith("https://")) {
            const tip = document.createElement("span");
            tip.textContent = "⚠️ 需手动访问：", tip.style.color = "#ff6b6b", tip.style.marginRight = "8px", 
            row.appendChild(tip);
            const link = document.createElement("a");
            return link.href = magnet, link.textContent = magnet, link.className = "gcbt-detail-magnets__link", 
            link.style.cursor = "pointer", link.style.textDecoration = "underline", link.style.color = "#2563eb", 
            link.addEventListener("click", e => {
              e.preventDefault(), e.stopPropagation(), GCBT_CONFIG.DEBUG_MODE;
              try {
                GM_openInTab(magnet, {
                  active: !0,
                  insert: !0,
                  setParent: !0
                });
              } catch (err) {
                window.open(magnet, "_blank");
              }
            }), row.appendChild(link), void container.appendChild(row);
          }
        }), insertBeforeNode instanceof Node ? anchorParent.insertBefore(container, insertBeforeNode) : anchorParent.prepend(container);
      } catch (e) {}
    }
    static async extractMagnetsFromContent(content) {
      const directMagnet = this.findDirectMagnet(content);
      if (directMagnet) return [ directMagnet ];
      const externalMagnet = await this.findExternalMagnet(content);
      if (externalMagnet) return [ externalMagnet ];
      const hashMagnet = this.findHashMagnet(content);
      return hashMagnet ? [ hashMagnet ] : [];
    }
    static findDirectMagnet(content) {
      const anchor = content.querySelector('a[href^="magnet:?xt=urn:btih:"]');
      if (anchor?.href) return anchor.href.replace(/&amp;/gi, "&").trim();
      const match = (content.innerHTML || document.documentElement.innerHTML).match(/magnet:\?xt=urn:btih:[0-9a-fA-F]{32,40}/i);
      return match ? match[0].replace(/&amp;/gi, "&").trim() : null;
    }
    static findHashMagnet(content) {
      const text = content.textContent || "", hashMatch = text.match(/[0-9a-fA-F]{40}/)?.[0] || text.match(/[0-9a-fA-F]{32}/)?.[0] || null;
      return hashMatch ? `magnet:?xt=urn:btih:${hashMatch}` : null;
    }
    static async findExternalMagnet(content) {
      const html = content.innerHTML || document.documentElement.innerHTML, btLinks = [];
      for (const site of GCBT_CONFIG.btSites) {
        const match = html.match(site.pattern)?.[0];
        if (match) {
          const fullUrl = match.startsWith("http") ? match : `https:${match}`;
          btLinks.push(fullUrl);
        }
      }
      if (!btLinks.length) return null;
      for (const url of btLinks) try {
        const magnet = await this.fetchExternalMagnet(url);
        if (magnet) return magnet;
      } catch (error) {}
      return btLinks.length > 0 ? btLinks[0] : null;
    }
    static async fetchExternalMagnet(url) {
      try {
        const site = GCBT_CONFIG.btSites.find(s => url.match(s.pattern));
        if (!site) return GCBT_CONFIG.DEBUG_MODE, null;
        const btMatch = url.match(site.pattern), raw = btMatch?.[0];
        if (!raw) return null;
        const hash = site.getHash(raw);
        return hash ? (GCBT_CONFIG.DEBUG_MODE, await new Promise(resolve => {
          const paramName = site.paramName || "name", requestUrl = "GET" === site.method ? `${site.url}?${paramName}=${hash}` : site.url, requestConfig = {
            method: site.method,
            url: requestUrl,
            headers: {
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
              DNT: "1",
              Connection: "keep-alive",
              "Upgrade-Insecure-Requests": "1"
            },
            onload: response => {
              if (response.status >= 200 && response.status < 400) try {
                const responseText = response.responseText, doc = (new DOMParser).parseFromString(responseText, "text/html"), codeMatch = (doc.body?.innerText || responseText).match(/Code:\s*([0-9a-fA-F]{32,40})/i);
                if (codeMatch) return void resolve(`magnet:?xt=urn:btih:${codeMatch[1]}`);
                const magnetInput = doc.querySelector("#magnetInput");
                if (magnetInput) {
                  const value = magnetInput.value || magnetInput.getAttribute("value") || void 0;
                  if (value) {
                    const cleaned = value.replace(/&amp;/g, "&").trim();
                    return void resolve(cleaned);
                  }
                }
                const magnetBoxInput = doc.querySelector(".magnet-box input");
                if (magnetBoxInput) {
                  const value = magnetBoxInput.getAttribute("value") || magnetBoxInput.value || void 0;
                  if (value) {
                    const cleaned = value.replace(/&amp;/g, "&").trim();
                    return void resolve(cleaned);
                  }
                }
                const magnetMatch = responseText.match(/magnet:\?xt=urn:btih:[0-9a-fA-F]{40}[^"'\s]*/i);
                if (magnetMatch) {
                  const cleaned = magnetMatch[0].replace(/&amp;/g, "&").trim();
                  return void resolve(cleaned);
                }
                resolve(null);
              } catch (parseError) {
                GCBT_CONFIG.DEBUG_MODE, resolve(null);
              } else GCBT_CONFIG.DEBUG_MODE, resolve(null);
            },
            onerror: error => {
              GCBT_CONFIG.DEBUG_MODE, resolve(null);
            },
            ontimeout: () => {
              GCBT_CONFIG.DEBUG_MODE, resolve(null);
            }
          };
          GM_xmlhttpRequest(requestConfig);
        })) : null;
      } catch (error) {
        return null;
      }
    }
  };
  const _Lightbox = class {
    static init() {
      this.overlay || (this.overlay = document.createElement("div"), this.overlay.style.cssText = "\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background: rgba(0, 0, 0, 0.95);\n      z-index: 999999;\n      display: none;\n      align-items: center;\n      justify-content: center;\n    ", 
      this.img = document.createElement("img"), this.img.style.cssText = "\n      width: 80vw;\n      height: 80vh;\n      max-width: 90%;\n      max-height: 90%;\n      object-fit: contain;\n      border-radius: 4px;\n    ", 
      this.counter = document.createElement("div"), this.counter.style.cssText = "\n      position: absolute;\n      top: 20px;\n      left: 50%;\n      transform: translateX(-50%);\n      color: white;\n      background: rgba(0, 0, 0, 0.6);\n      padding: 8px 16px;\n      border-radius: 20px;\n      font-size: 14px;\n    ", 
      this.prevBtn = this.createNavButton("‹", "left"), this.nextBtn = this.createNavButton("›", "right"), 
      this.closeBtn = this.createCloseButton(), this.overlay.appendChild(this.img), this.overlay.appendChild(this.counter), 
      this.overlay.appendChild(this.prevBtn), this.overlay.appendChild(this.nextBtn), 
      this.overlay.appendChild(this.closeBtn), document.body.appendChild(this.overlay), 
      this.setupEvents());
    }
    static createNavButton(content, position) {
      const btn = document.createElement("button");
      return btn.innerHTML = "‹" === content ? '<svg viewBox="0 0 24 24" fill="white" width="50" height="50"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>' : '<svg viewBox="0 0 24 24" fill="white" width="50" height="50"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>', 
      btn.style.cssText = `\n      position: fixed;\n      ${position}: 16px;\n      top: 50%;\n      transform: translateY(-50%);\n      width: 60px;\n      height: 60px;\n      background: rgba(255, 255, 255, 0.2);\n      border-radius: 50%;\n      border: none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: white;\n      cursor: pointer;\n      user-select: none;\n      z-index: 10002;\n    `, 
      btn;
    }
    static createCloseButton() {
      const btn = document.createElement("button");
      return btn.innerHTML = '<svg viewBox="0 0 24 24" fill="white" width="30" height="30"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', 
      btn.style.cssText = "\n      position: fixed;\n      right: 20px;\n      top: 20px;\n      width: 50px;\n      height: 50px;\n      background: rgba(255, 255, 255, 0.2);\n      border-radius: 50%;\n      border: none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      cursor: pointer;\n      user-select: none;\n      z-index: 10002;\n      transition: background 0.2s;\n    ", 
      btn.onmouseover = () => {
        btn.style.background = "rgba(255, 255, 255, 0.3)";
      }, btn.onmouseout = () => {
        btn.style.background = "rgba(255, 255, 255, 0.2)";
      }, btn;
    }
    static setupEvents() {
      this.overlay.onclick = () => {
        this.close();
      }, this.prevBtn.onclick = e => {
        e.stopPropagation(), this.prev();
      }, this.nextBtn.onclick = e => {
        e.stopPropagation(), this.next();
      }, this.closeBtn.onclick = e => {
        e.stopPropagation(), this.close();
      }, document.addEventListener("keydown", e => {
        "flex" === this.overlay?.style.display && ("Escape" === e.key ? this.close() : "ArrowLeft" === e.key ? this.prev() : "ArrowRight" === e.key && this.next());
      });
    }
    static show(images, index = 0) {
      this.init(), this.images = images, this.currentIndex = index, this.updateImage(), 
      this.overlay.style.display = "flex";
    }
    static close() {
      this.overlay && (this.overlay.style.display = "none");
    }
    static prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length, 
      this.updateImage();
    }
    static next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length, this.updateImage();
    }
    static updateImage() {
      const url = this.images[this.currentIndex];
      this.img.style.display = "none", this.img.src = "", this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`, 
      this.images.length <= 1 ? (this.prevBtn.style.display = "none", this.nextBtn.style.display = "none", 
      this.counter.style.display = "none") : (this.prevBtn.style.display = "flex", this.nextBtn.style.display = "flex", 
      this.counter.style.display = "block"), this.img.onload = () => {
        this.img.style.display = "block";
      }, this.img.onerror = () => {
        this.img.alt = "图片加载失败";
      }, this.img.src = url;
    }
  };
  _Lightbox.overlay = null, _Lightbox.img = null, _Lightbox.counter = null, _Lightbox.prevBtn = null, 
  _Lightbox.nextBtn = null, _Lightbox.closeBtn = null, _Lightbox.images = [], _Lightbox.currentIndex = 0;
  let Lightbox = _Lightbox;
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
  let PreviewProcessor$1 = ((_b = class {
    static async processAll() {
      const postsWrapper = document.querySelector(".posts-wrapper");
      if (!postsWrapper) return;
      const articles = Array.from(postsWrapper.querySelectorAll("article.post"));
      if (!articles.length) return;
      const list = articles.map(article => {
        const titleA = article.querySelector(".entry-title a");
        return titleA?.href ? {
          title: titleA.textContent?.trim() || "未命名",
          url: titleA.href
        } : null;
      }).filter(item => !!item);
      if (!list.length) return;
      const listContainer = document.createElement("div");
      listContainer.className = "gcbt-card-list", list.forEach((item, index) => {
        listContainer.appendChild(this.createCard(item, index));
      }), postsWrapper.replaceWith(listContainer), list.forEach(async (item, index) => {
        const card = listContainer.querySelector(`[data-index="${index}"]`);
        if (card) {
          this.setLoadingState(card);
          try {
            const data = await this.fetchDetail(item.url);
            this.renderPreview(card, data);
          } catch (e) {
            this.setErrorState(card);
          }
        }
      });
    }
    static createCard(item, index) {
      const placeholderCount = Math.max(4, GCBT_CONFIG.maxPreviewImages), card = document.createElement("article");
      return card.className = "gcbt-card", card.dataset.index = String(index), card.innerHTML = `\n      <h2 class="gcbt-card__title">\n        <a href="${item.url}" target="_blank" rel="noopener">${item.title}</a>\n      </h2>\n      <div class="gcbt-card__images">\n        ${Array.from({
        length: placeholderCount
      }).map(() => '<div class="gcbt-card__img-placeholder">预览图</div>').join("")}\n      </div>\n      <div class="gcbt-card__magnet-block">\n        <div class="gcbt-card__magnet-list">磁力解析中...</div>\n      </div>\n    `, 
      card;
    }
    static setLoadingState(card) {
      const images = card.querySelector(".gcbt-card__images");
      images && (images.innerHTML = '<div class="gcbt-card__placeholder">正在拉取详情...</div>');
      const magnets = card.querySelector(".gcbt-card__magnet-list");
      magnets && (magnets.textContent = "磁力解析中...");
    }
    static setErrorState(card) {
      const images = card.querySelector(".gcbt-card__images");
      images && (images.innerHTML = '<div class="gcbt-card__placeholder is-error">加载失败</div>');
      const magnets = card.querySelector(".gcbt-card__magnet-list");
      magnets && (magnets.textContent = "磁力获取失败");
    }
    static renderPreview(card, data) {
      if (card.querySelector(".gcbt-card__images")) {
        const domainGroups = this.groupImagesByDomain(data.images);
        this.renderImageGroup(card, domainGroups, 0, data.images.length);
      }
      const magnetsEl = card.querySelector(".gcbt-card__magnet-list");
      magnetsEl && (magnetsEl.innerHTML = "", data.magnets.length ? data.magnets.forEach(magnet => {
        const row = document.createElement("div");
        if (row.className = "gcbt-card__magnet-row", magnet.startsWith("http://") || magnet.startsWith("https://")) {
          const tip = document.createElement("span");
          tip.textContent = "⚠️ 需手动访问：", tip.style.color = "#ff6b6b", tip.style.marginRight = "4px", 
          tip.style.fontSize = "12px", row.appendChild(tip);
          const link = document.createElement("a");
          link.href = magnet, link.textContent = magnet, link.className = "gcbt-card__magnet-text", 
          link.style.cursor = "pointer", link.addEventListener("click", e => {
            e.preventDefault(), e.stopPropagation();
            try {
              GM_openInTab(magnet, {
                active: !0,
                insert: !0,
                setParent: !0
              });
            } catch (err) {
              window.open(magnet, "_blank");
            }
          }), row.appendChild(link);
        } else {
          const link = document.createElement("a");
          link.href = magnet, link.textContent = magnet, link.className = "gcbt-card__magnet-text", 
          link.target = "_blank", link.rel = "noopener", row.appendChild(link);
        }
        magnetsEl.appendChild(row);
      }) : magnetsEl.innerHTML = '<span class="gcbt-card__magnet-empty">暂无磁力</span>');
    }
    static groupImagesByDomain(images) {
      const groups = new Map;
      return images.forEach(src => {
        const domain = this.getDomain(src);
        groups.has(domain) || groups.set(domain, []), groups.get(domain).push(src);
      }), groups;
    }
    static getDomain(src) {
      try {
        return new URL(src, location.href).hostname || "unknown";
      } catch {
        return "unknown";
      }
    }
    static renderImageGroup(card, domainGroups, domainIndex, totalImages) {
      const imagesEl = card.querySelector(".gcbt-card__images");
      if (!imagesEl) return;
      const domains = Array.from(domainGroups.keys());
      if (!domains.length) return void (imagesEl.innerHTML = '<div class="gcbt-card__placeholder">暂无预览图</div>');
      if (domainIndex >= domains.length) return void (imagesEl.innerHTML = '<div class="gcbt-card__placeholder is-error">图片加载失败</div>');
      const currentDomain = domains[domainIndex], sources = domainGroups.get(currentDomain) || [], maxImages = GCBT_CONFIG.maxPreviewImages, display = sources.slice(0, maxImages);
      if (!display.length) return void this.renderImageGroup(card, domainGroups, domainIndex + 1, totalImages);
      imagesEl.innerHTML = "";
      let failed = 0, loaded = 0;
      const total = display.length;
      display.forEach((src, idx) => {
        const imgWrap = document.createElement("div");
        imgWrap.className = "gcbt-card__img";
        const img = document.createElement("img");
        if (img.src = src, img.loading = "lazy", img.referrerPolicy = "no-referrer", img.dataset.index = String(idx), 
        img.dataset.src = src, imgWrap.appendChild(img), img.onload = () => {
          loaded += 1;
        }, img.onerror = () => {
          failed += 1, failed + loaded === total && (failed >= Math.ceil(total / 2) && domainIndex < domains.length - 1 ? setTimeout(() => {
            this.renderImageGroup(card, domainGroups, domainIndex + 1, totalImages);
          }, 300) : failed === total && domainIndex < domains.length - 1 && this.renderImageGroup(card, domainGroups, domainIndex + 1, totalImages));
        }, idx === display.length - 1 && totalImages > display.length) {
          const more = document.createElement("span");
          more.className = "gcbt-card__more", more.textContent = "+" + (totalImages - display.length), 
          imgWrap.appendChild(more);
        }
        imgWrap.addEventListener("click", e => {
          e.preventDefault(), Lightbox.show(display, idx);
        }), imagesEl.appendChild(imgWrap);
      });
    }
    static async fetchDetail(url) {
      const cacheKey = this.CACHE_PREFIX + url, cached = Storage.get(cacheKey);
      if (cached && cached.version === GCBT_CONFIG.DATA_VERSION && !location.search.includes("nocache")) return cached;
      const response = await fetch(url), text = await response.text(), doc = (new DOMParser).parseFromString(text, "text/html");
      doc.querySelectorAll("style, script").forEach(el => el.remove());
      const content = doc.querySelector(".entry-content, .entry-wrapper, .article-content") || doc.body, sizeMatch = content.textContent?.match(/【(?:影片|档案|檔案|资源|資源)(?:大小|容量)】\s*(?:：|:)*\s*([0-9.]+\s*(?:MB|GB|M|G|T|TB))/i), durationMatch = content.textContent?.match(/【(?:影片|资源|資源)(?:时间|時間|时长|時長)】\s*(?:：|:)*\s*(\d+:\d+(:\d+)?)/i), maxImages = GCBT_CONFIG.maxPreviewImages, images = Array.from(content.querySelectorAll("img")).slice(0, maxImages).map(img => img.getAttribute("data-src") || img.getAttribute("src")).filter(Boolean).map(src => this.normalizeImageSrc(src, url)), magnets = await DomManager$1.extractMagnetsFromContent(content), uniqueMagnets = [ ...new Set(magnets.map(m => m.toLowerCase())) ], data = {
        images: [ ...new Set(images) ],
        magnets: uniqueMagnets,
        size: sizeMatch?.[1],
        duration: durationMatch?.[1],
        version: GCBT_CONFIG.DATA_VERSION
      };
      return Storage.set(cacheKey, data), data;
    }
    static normalizeImageSrc(src, base) {
      const proxyMatch = src.match(/\/plugin\/img_layer\/data\/\?src=([^&]+)/i);
      if (proxyMatch) try {
        const decoded = decodeURIComponent(proxyMatch[1]);
        return this.normalizeImageSrc(decoded, base);
      } catch {}
      try {
        const urlObj = new URL(src, base), inner = urlObj.searchParams.get("src");
        return inner ? this.normalizeImageSrc(inner, base) : urlObj.href;
      } catch {
        return src;
      }
    }
  }).CACHE_PREFIX = "gcbt_preview_", _b);
  const GcbtModule = {
    type: "gcbt",
    name: "GCBT",
    config: {
      type: "gcbt",
      name: "GCBT",
      domainPattern: /gcbt\.net/,
      pages: {
        home: [ /^\/$/, /^\/index\.php$/ ],
        list: [ /^\/$/, /^\/page\/\d+/, /^\/category\//, /^\/tag\// ],
        content: [ /^\/(download|post)\// ]
      }
    },
    hasCheckIn: !1,
    async init() {
      StyleManager$1.init();
    },
    async handlePage(pageType) {
      try {
        DomManager$1.cleanPage(), "list" === pageType && await PreviewProcessor$1.processAll(), 
        "content" === pageType && setTimeout(async () => {
          await DomManager$1.displayMagnetLinkOnContentPage();
        }, 500);
      } catch (e) {} finally {
        StyleManager$1.unhidePosts();
      }
    }
  }, CONFIG = {
    MAX_PREVIEW_IMAGES: 4,
    DETAIL_IMAGES_COUNT: 4,
    rateLimit: {
      maxConcurrent: 3,
      minDelay: 200,
      maxDelay: 400
    },
    CACHE_MAX_AGE: 864e5,
    selectors: {
      laowang: {
        threadList: "#threadlist .bm_c",
        threadItem: "li",
        threadLink: 'div.c.cl a[href*="viewthread"]',
        threadTitle: "h3 a",
        threadAuth: ".auth",
        postImages: ".pcb img.zoom[zoomfile], .pattl img.zoom[zoomfile]"
      },
      laowangSearch: {
        threadList: "body",
        threadItem: "div.result-item",
        threadLink: "h3.result-title a",
        threadTitle: "h3.result-title a",
        threadAuth: null,
        postImages: ".pcb img.zoom[zoomfile], .pattl img.zoom[zoomfile]"
      },
      moxing: {
        threadList: "#threadlisttableid",
        threadItem: 'tbody[id^="normalthread_"]',
        threadLink: "a.s.xst",
        threadTitle: "a.s.xst",
        threadAuth: ".list_author",
        postImages: ".t_fsz img.zoom, .t_fsz img.inline-image, .t_fsz img.attach-img, .ql-editor img.inline-image, .ql-snow img.attach-img, .pct img.inline-image"
      },
      moxingSearch: {
        threadList: "#threadlist",
        threadItem: "li.pbw.z",
        threadLink: "h3.xs3 a",
        threadTitle: "h3.xs3 a",
        threadAuth: null,
        postImages: ".t_fsz img.zoom, .t_fsz img.inline-image, .t_fsz img.attach-img, .ql-editor img.inline-image, .ql-snow img.attach-img, .pct img.inline-image"
      },
      sjs: {
        threadList: ".nex_forumlist_pics",
        threadItem: ".nex_thread_pics",
        threadLink: "a",
        threadTitle: "a",
        threadAuth: null,
        postImages: ".nex_thread_pics a"
      }
    },
    styles: {
      imagePlaceholder: "\n      width: 100% !important;\n      height: 100% !important;\n      background: #f0f0f0 !important;\n      display: flex !important;\n      align-items: center !important;\n      justify-content: center !important;\n      color: #999 !important;\n      font-size: 12px !important;\n    ",
      threadContainer: "\n      display: flex !important;\n      flex-direction: column !important;\n      padding: 15px !important;\n      margin-bottom: 15px !important;\n      background: #fff !important;\n      border: 1px solid #e5e5e5 !important;\n      border-radius: 8px !important;\n      width: 100% !important;\n      box-sizing: border-box !important;\n      opacity: 0 !important;\n      transition: opacity 0.3s ease-in !important;\n    ",
      titleContainer: "\n      margin-bottom: 12px !important;\n      font-size: 15px !important;\n      font-weight: 500 !important;\n    ",
      previewContainer: "\n      display: block !important;\n      width: 100% !important;\n    ",
      imageWrapper: "\n      width: calc(25% - 8px) !important;\n      aspect-ratio: 16/9 !important;\n      overflow: hidden !important;\n      border-radius: 4px !important;\n      cursor: pointer !important;\n      position: relative !important;\n      background: #f5f5f5 !important;\n    ",
      image: "\n      width: 100% !important;\n      height: 100% !important;\n      object-fit: contain !important;\n      display: block !important;\n    ",
      authInfo: "margin-top: 10px; font-size: 12px; color: #999;",
      listContainer: "\n      display: flex !important;\n      flex-direction: column !important;\n      gap: 0 !important;\n      padding: 0 !important;\n    "
    }
  }, _SimpleCache = class _SimpleCache {
    constructor() {
      this.prefix = "lwlt_cache_", this.maxAge = CONFIG.CACHE_MAX_AGE;
    }
    static getInstance() {
      return this.instance || (this.instance = new _SimpleCache), this.instance;
    }
    getCacheKey(url) {
      const match = url.match(/tid=(\d+)/), tid = match ? match[1] : btoa(url);
      return this.prefix + tid;
    }
    get(key) {
      const cacheKey = this.getCacheKey(key), cached = Storage.get(cacheKey);
      return cached ? Date.now() - cached.timestamp > this.maxAge ? (this.delete(key), 
      null) : cached.data : null;
    }
    set(key, data) {
      const cacheKey = this.getCacheKey(key), cacheData = {
        data: data,
        timestamp: Date.now()
      };
      Storage.set(cacheKey, cacheData);
    }
    delete(key) {
      const cacheKey = this.getCacheKey(key);
      return Storage.delete(cacheKey);
    }
    clear() {
      Storage.listKeys().forEach(key => {
        key.startsWith(this.prefix) && Storage.delete(key);
      });
    }
    static get(key) {
      return _SimpleCache.getInstance().get(key);
    }
    static set(key, data) {
      _SimpleCache.getInstance().set(key, data);
    }
    static delete(key) {
      return _SimpleCache.getInstance().delete(key);
    }
  };
  _SimpleCache.instance = null;
  let SimpleCache = _SimpleCache;
  const _ImageFetcher = class {
    static async waitForSlot(maxConcurrent) {
      if (!(this.pendingRequests < maxConcurrent)) return new Promise(resolve => {
        this.requestQueue.push(() => {
          this.pendingRequests++, resolve();
        });
      });
      this.pendingRequests++;
    }
    static releaseSlot(minDelay, maxDelay) {
      this.pendingRequests--;
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      setTimeout(() => {
        const next = this.requestQueue.shift();
        next && next();
      }, delay);
    }
    static async fetchPostImages(url, maxConcurrent, minDelay, maxDelay, imageSelector) {
      const cached = SimpleCache.get(url);
      if (cached) return {
        images: cached
      };
      await this.waitForSlot(maxConcurrent);
      try {
        const referer = url.includes("moxing.app") ? "https://moxing.app/" : "https://laowang.vip/", response = await fetch(url, {
          headers: {
            "User-Agent": navigator.userAgent,
            Referer: referer
          }
        });
        if (!response.ok) return {
          images: [],
          error: 429 === response.status ? "请求过快，请稍后重试" : `请求失败 (${response.status})`
        };
        const html = await response.text(), doc = (new DOMParser).parseFromString(html, "text/html");
        let images = Array.from(doc.querySelectorAll(imageSelector));
        0 === images.length && (images = url.includes("moxing.app") ? Array.from(doc.querySelectorAll(".t_fsz img.zoom, .pcb img.zoom, img.zoom[zoomfile], .ql-editor img.inline-image, .ql-snow img.attach-img, .pct img.inline-image")) : Array.from(doc.querySelectorAll("img.zoom[zoomfile]")));
        const imageUrls = [];
        for (const img of images) {
          const imgUrl = img.getAttribute("zoomfile") || img.getAttribute("file") || img.getAttribute("src");
          if (!imgUrl) continue;
          if (imgUrl.includes("none.gif")) continue;
          if (imgUrl.includes("static/image")) continue;
          if (imgUrl.includes("/rleft.gif")) continue;
          if (imgUrl.includes("/rright.gif")) continue;
          if (imgUrl.includes("icon")) continue;
          if (imageUrls.length >= CONFIG.DETAIL_IMAGES_COUNT) break;
          const baseUrl = url.includes("moxing.app") ? "https://moxing.app" : "https://laowang.vip", fullUrl = imgUrl.startsWith("http") ? imgUrl : `${baseUrl}${imgUrl}`;
          imageUrls.includes(fullUrl) || imageUrls.push(fullUrl);
        }
        return imageUrls.length > 0 ? (SimpleCache.set(url, imageUrls), {
          images: imageUrls
        }) : {
          images: [],
          error: "无图片"
        };
      } catch (err) {
        return {
          images: [],
          error: err instanceof Error ? err.message : "网络错误"
        };
      } finally {
        this.releaseSlot(minDelay, maxDelay);
      }
    }
  };
  _ImageFetcher.pendingRequests = 0, _ImageFetcher.requestQueue = [];
  let ImageFetcher = _ImageFetcher;
  class ThreadRenderer {
    static showNoImageMessage(thread) {
      const previewContainer = thread.querySelector(".preview-container");
      if (!previewContainer) return;
      const scrollY = window.scrollY;
      previewContainer.innerHTML = "";
      const messageWrapper = document.createElement("div");
      messageWrapper.style.cssText = "\n      width: 100% !important;\n      padding: 20px !important;\n      text-align: center !important;\n      background: #f5f5f5 !important;\n      border: 1px solid #ddd !important;\n      border-radius: 4px !important;\n      color: #999 !important;\n      font-size: 14px !important;\n    ", 
      messageWrapper.textContent = "📝 帖子无图", previewContainer.appendChild(messageWrapper), 
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }
    static showError(thread, threadUrl, errorMsg, siteType) {
      const previewContainer = thread.querySelector(".preview-container");
      if (!previewContainer) return;
      const scrollY = window.scrollY;
      previewContainer.innerHTML = "";
      const errorWrapper = document.createElement("div");
      errorWrapper.style.cssText = "\n      width: 100% !important;\n      padding: 20px !important;\n      text-align: center !important;\n      background: #fff3cd !important;\n      border: 1px solid #ffc107 !important;\n      border-radius: 4px !important;\n      color: #856404 !important;\n    ";
      const errorText = document.createElement("div");
      errorText.style.cssText = "margin-bottom: 10px !important; font-size: 14px !important;", 
      errorText.textContent = `⚠️ ${errorMsg}`;
      const retryBtn = document.createElement("button");
      retryBtn.textContent = "点击重试", retryBtn.style.cssText = "\n      padding: 6px 16px !important;\n      background: #ffc107 !important;\n      border: none !important;\n      border-radius: 4px !important;\n      color: #000 !important;\n      cursor: pointer !important;\n      font-size: 13px !important;\n    ", 
      retryBtn.onclick = async e => {
        e.preventDefault(), e.stopPropagation(), retryBtn.textContent = "加载中...", retryBtn.disabled = !0;
        const {ThreadProcessor: ThreadProcessor2} = await Promise.resolve().then(() => ThreadProcessor$1);
        ThreadProcessor2.retryLoadThread(thread, threadUrl, siteType);
      }, errorWrapper.appendChild(errorText), errorWrapper.appendChild(retryBtn), previewContainer.appendChild(errorWrapper), 
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }
    static renderThreadCard(thread, threadUrl, title, authEl, siteType) {
      const scrollY = window.scrollY;
      "moxing" === siteType || "moxingSearch" === siteType ? this.renderMoxingPreview(thread) : "laowangSearch" === siteType ? this.renderLaowangSearchCard(thread, threadUrl, title) : this.renderLaowangCard(thread, threadUrl, title, authEl), 
      thread.setAttribute("data-processed", "1"), requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }
    static renderMoxingPreview(tbody) {
      const previewTr = document.createElement("tr");
      previewTr.className = "custom-preview-row";
      const previewTd = document.createElement("td");
      previewTd.colSpan = 100, previewTd.style.cssText = "padding: 10px 20px; background: transparent;";
      const previewContainer = document.createElement("div");
      previewContainer.style.cssText = "\n      display: flex !important;\n      gap: 8px !important;\n      width: 100% !important;\n    ", 
      previewContainer.className = "preview-container";
      for (let i = 0; i < CONFIG.MAX_PREVIEW_IMAGES; i++) {
        const imgWrapper = document.createElement("div");
        imgWrapper.style.cssText = "\n        flex: 1 !important;\n        min-width: 0 !important;\n        height: 200px !important;\n        background: #f0f0f0 !important;\n        border-radius: 4px !important;\n        overflow: hidden !important;\n        display: flex !important;\n        align-items: center !important;\n        justify-content: center !important;\n        color: #999 !important;\n        font-size: 12px !important;\n      ", 
        imgWrapper.textContent = "加载中...", previewContainer.appendChild(imgWrapper);
      }
      previewTd.appendChild(previewContainer), previewTr.appendChild(previewTd), tbody.appendChild(previewTr);
    }
    static renderLaowangCard(thread, threadUrl, title, authEl) {
      thread.style.cssText = CONFIG.styles.threadContainer;
      const titleContainer = document.createElement("div");
      titleContainer.style.cssText = CONFIG.styles.titleContainer, titleContainer.innerHTML = `<a href="${threadUrl}" style="color: #333; text-decoration: none;">${title}</a>`;
      const previewContainer = document.createElement("div");
      previewContainer.style.cssText = "\n      display: flex !important;\n      gap: 8px !important;\n      width: 100% !important;\n    ", 
      previewContainer.className = "preview-container";
      for (let i = 0; i < CONFIG.MAX_PREVIEW_IMAGES; i++) {
        const imgWrapper = document.createElement("div");
        imgWrapper.style.cssText = "\n        flex: 1 !important;\n        min-width: 0 !important;\n        height: 200px !important;\n        background: #f0f0f0 !important;\n        border-radius: 4px !important;\n        overflow: hidden !important;\n        display: flex !important;\n        align-items: center !important;\n        justify-content: center !important;\n        color: #999 !important;\n        font-size: 12px !important;\n      ", 
        imgWrapper.textContent = "加载中...", previewContainer.appendChild(imgWrapper);
      }
      thread.innerHTML = "", thread.appendChild(titleContainer), thread.appendChild(previewContainer), 
      authEl && (authEl.style.cssText = CONFIG.styles.authInfo, thread.appendChild(authEl)), 
      thread.style.opacity = "1";
    }
    static renderLaowangSearchCard(thread, _threadUrl, _title) {
      const previewContainer = document.createElement("div");
      previewContainer.style.cssText = "\n      display: flex !important;\n      gap: 8px !important;\n      width: 100% !important;\n      margin-top: 12px !important;\n    ", 
      previewContainer.className = "preview-container";
      for (let i = 0; i < CONFIG.MAX_PREVIEW_IMAGES; i++) {
        const imgWrapper = document.createElement("div");
        imgWrapper.style.cssText = "\n        flex: 1 !important;\n        min-width: 0 !important;\n        height: 200px !important;\n        background: #f0f0f0 !important;\n        border-radius: 4px !important;\n        overflow: hidden !important;\n        display: flex !important;\n        align-items: center !important;\n        justify-content: center !important;\n        color: #999 !important;\n        font-size: 12px !important;\n      ", 
        imgWrapper.textContent = "加载中...", previewContainer.appendChild(imgWrapper);
      }
      thread.appendChild(previewContainer);
    }
    static updateAllImages(thread, detailImages) {
      const previewContainer = thread.querySelector(".preview-container");
      if (!previewContainer) return;
      const scrollY = window.scrollY;
      previewContainer.innerHTML = "";
      const container = document.createElement("div");
      container.style.cssText = "\n      display: flex !important;\n      gap: 8px !important;\n      width: 100% !important;\n    ", 
      detailImages.forEach((src, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "\n        flex: 1 !important;\n        min-width: 0 !important;\n        height: 200px !important;\n        background: #f5f5f5 !important;\n        border-radius: 4px !important;\n        overflow: hidden !important;\n        cursor: pointer !important;\n        display: flex !important;\n        align-items: center !important;\n        justify-content: center !important;\n      ";
        const img = document.createElement("img");
        img.src = src, img.loading = "lazy", img.referrerPolicy = "no-referrer", img.className = "", 
        img.removeAttribute("zoom"), img.removeAttribute("zoomfile"), img.removeAttribute("onclick"), 
        img.style.cssText = "\n        max-width: 100% !important;\n        max-height: 100% !important;\n        width: auto !important;\n        height: auto !important;\n        object-fit: contain !important;\n        display: block !important;\n        pointer-events: none !important;\n      ", 
        wrapper.onclick = e => {
          e.preventDefault(), e.stopPropagation(), Lightbox.show(detailImages, index);
        }, wrapper.appendChild(img), container.appendChild(wrapper);
      }), previewContainer.appendChild(container), requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }
    static adjustListContainerStyle(listContainer) {
      const listUl = listContainer.querySelector("ul");
      listUl && (listUl.style.display = "block", listUl.style.position = "relative");
    }
  }
  const _ThreadProcessor = class {
    static processThreadList(siteType) {
      const selectors = CONFIG.selectors[siteType], threadList = document.querySelector(selectors.threadList);
      if (!threadList) return;
      "moxing" !== siteType && "moxingSearch" !== siteType || this.removeVipPromptRow(threadList);
      const threads = Array.from(threadList.querySelectorAll(selectors.threadItem)).filter(li => li.querySelector(selectors.threadLink));
      ThreadRenderer.adjustListContainerStyle(threadList), this.initLazyLoading(threads, siteType);
    }
    static removeVipPromptRow(table) {
      table.querySelectorAll("tbody").forEach(tbody => {
        const text = tbody.textContent || "";
        text.includes("VIP") && text.includes("魔币") && text.length < 100 && tbody.remove();
      });
    }
    static initLazyLoading(threads, siteType) {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const thread = entry.target;
            if (thread.getAttribute("data-loaded")) return;
            this.loadThread(thread, siteType), this.observer?.unobserve(thread);
          }
        });
      }, {
        rootMargin: "200px",
        threshold: .01
      }), threads.forEach(thread => {
        if (thread.getAttribute("data-processed")) return;
        const selectors = CONFIG.selectors[siteType], linkEl = thread.querySelector(selectors.threadLink), titleEl = thread.querySelector(selectors.threadTitle), authEl = selectors.threadAuth ? thread.querySelector(selectors.threadAuth) : null;
        if (!linkEl || !titleEl) return;
        const threadUrl = linkEl.href, title = titleEl.textContent?.trim() || "";
        ThreadRenderer.renderThreadCard(thread, threadUrl, title, authEl, siteType), thread._threadData = {
          threadUrl: threadUrl
        };
        const cached = SimpleCache.get(threadUrl);
        cached ? this.loadThreadDirectly(thread, cached) : this.observer && this.observer.observe(thread);
      });
    }
    static loadThreadDirectly(thread, cachedImages) {
      thread.setAttribute("data-loaded", "1"), cachedImages.length > 0 && ThreadRenderer.updateAllImages(thread, cachedImages);
    }
    static async loadThread(thread, siteType) {
      thread.setAttribute("data-loaded", "1");
      const data = thread._threadData;
      if (!data) return;
      const {threadUrl: threadUrl} = data, {maxConcurrent: maxConcurrent, minDelay: minDelay, maxDelay: maxDelay} = CONFIG.rateLimit, selectors = CONFIG.selectors[siteType], result = await ImageFetcher.fetchPostImages(threadUrl, maxConcurrent, minDelay, maxDelay, selectors.postImages);
      "无图片" === result.error ? ThreadRenderer.showNoImageMessage(thread) : result.error ? ThreadRenderer.showError(thread, threadUrl, result.error, siteType) : 0 === result.images.length ? ThreadRenderer.showNoImageMessage(thread) : ThreadRenderer.updateAllImages(thread, result.images);
    }
    static async retryLoadThread(thread, threadUrl, siteType) {
      SimpleCache.delete(threadUrl), thread.removeAttribute("data-loaded");
      const previewContainer = thread.querySelector(".preview-container");
      if (previewContainer) {
        previewContainer.innerHTML = "";
        for (let i = 0; i < CONFIG.MAX_PREVIEW_IMAGES; i++) {
          const imgWrapper = document.createElement("div");
          imgWrapper.style.cssText = CONFIG.styles.imageWrapper;
          const placeholder = document.createElement("div");
          placeholder.style.cssText = CONFIG.styles.imagePlaceholder, placeholder.textContent = "加载中...", 
          imgWrapper.appendChild(placeholder), previewContainer.appendChild(imgWrapper);
        }
      }
      await this.loadThread(thread, siteType);
    }
  };
  _ThreadProcessor.observer = null;
  let ThreadProcessor = _ThreadProcessor;
  const ThreadProcessor$1 = Object.freeze(Object.defineProperty({
    __proto__: null,
    ThreadProcessor: ThreadProcessor
  }, Symbol.toStringTag, {
    value: "Module"
  })), _Toast = class {
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
  class LaowangCheckIn {
    static async getCheckInStats(config2) {
      try {
        const response = await fetch(config2.checkIn.pageUrl, {
          credentials: "include",
          cache: "no-cache"
        });
        if (!response.ok) return null;
        const html = await response.text(), doc = (new DOMParser).parseFromString(html, "text/html"), lxdaysInput = doc.querySelector("#lxdays"), lxlevelInput = doc.querySelector("#lxlevel"), lxrewardInput = doc.querySelector("#lxreward"), lxtdaysInput = doc.querySelector("ul.countqian li:nth-child(4) input.hidnum");
        if (!(lxdaysInput && lxlevelInput && lxrewardInput && lxtdaysInput)) return null;
        const signBtnA = doc.querySelector(config2.checkIn.buttonSelector), signBtnSpan = config2.checkIn.signedSelector ? doc.querySelector(config2.checkIn.signedSelector) : null;
        let alreadySigned = !1;
        if (signBtnSpan) alreadySigned = !0; else if (signBtnA) {
          const btnText = signBtnA.textContent?.trim() || "";
          (btnText.includes("已签") || btnText.includes("已签到")) && (alreadySigned = !0);
        }
        let signUrl = "";
        if (!alreadySigned && signBtnA && signBtnA.href) signUrl = signBtnA.href; else if (!alreadySigned) {
          const signForm = doc.querySelector('form[action*="k_misign"]');
          signForm && signForm.action && (signUrl = signForm.action);
        }
        return {
          lxdays: parseInt(lxdaysInput.value) || 0,
          lxlevel: parseInt(lxlevelInput.value) || 0,
          lxreward: parseInt(lxrewardInput.value) || 0,
          lxtdays: parseInt(lxtdaysInput.value) || 0,
          alreadySigned: alreadySigned,
          signUrl: signUrl
        };
      } catch (error) {
        return null;
      }
    }
    static async execute(config2) {
      try {
        const stats = await this.getCheckInStats(config2);
        if (!stats) return void Toast.show("⚠️ 无法获取签到信息，请先登录", "error", 3e3);
        if (stats.alreadySigned) return void Toast.show("✅ 今天已经签到过了", "success", 2e3);
        if (!stats.signUrl) return void Toast.show("未找到签到链接", "error", 3e3);
        Toast.show("🎯 请完成验证", "info", 2e3), await this.sleep(500), this.openCheckInPopup(config2, stats.signUrl);
      } catch (error) {
        Toast.show("签到失败: " + error.message, "error", 3e3);
      }
    }
    static openCheckInPopup(config2, signUrl) {
      const modal = document.createElement("div");
      modal.id = "laowang-checkin-modal", modal.style.cssText = "\n      position: fixed;\n      top: 120px;\n      right: 20px;\n      background: #fff;\n      border-radius: 16px;\n      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);\n      padding: 20px;\n      z-index: 99999;\n      animation: slideIn 0.3s;\n      width: 540px;\n    ";
      const header = document.createElement("div");
      header.style.cssText = "\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 16px;\n    ";
      const title = document.createElement("div");
      title.textContent = "🎯 签到验证", title.style.cssText = "\n      font-size: 16px;\n      font-weight: 600;\n      color: #333;\n    ";
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "✕", closeBtn.style.cssText = "\n      width: 28px;\n      height: 28px;\n      border: none;\n      border-radius: 50%;\n      background: #f0f0f0;\n      color: #666;\n      font-size: 18px;\n      cursor: pointer;\n      transition: 0.2s;\n    ", 
      closeBtn.onmouseover = () => closeBtn.style.background = "#e0e0e0", closeBtn.onmouseout = () => closeBtn.style.background = "#f0f0f0", 
      closeBtn.onclick = () => modal.remove(), header.appendChild(title), header.appendChild(closeBtn);
      const iframeContainer = document.createElement("div");
      iframeContainer.style.cssText = "\n      position: relative;\n      width: 500px;\n      height: 400px;\n      overflow: hidden;\n      border-radius: 8px;\n      background: #fafafa;\n    ";
      const iframe = document.createElement("iframe");
      iframe.src = signUrl, iframe.style.cssText = "\n      width: 100%;\n      height: 100%;\n      border: none;\n      position: absolute;\n      top: 0;\n      left: 0;\n    ", 
      iframeContainer.appendChild(iframe), modal.appendChild(header), modal.appendChild(iframeContainer), 
      document.body.appendChild(modal), iframe.onload = () => {
        try {
          Toast.show("✅ 请完成验证", "success", 2e3);
          let isSubmitting = !1;
          const checkInterval = setInterval(() => {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
              if (!iframeDoc) return;
              if (isSubmitting) return;
              const captchaInput = iframeDoc.querySelector("#clicaptcha-submit-info");
              if (captchaInput && captchaInput.value) {
                clearInterval(checkInterval), isSubmitting = !0, Toast.show("✅ 验证完成，正在签到...", "info", 2e3);
                const form = iframeDoc.querySelector("#v2_captcha_form");
                if (form) return form.submit(), void setTimeout(() => {
                  this.setCache(config2, !0), window.location.reload();
                }, 1e3);
                {
                  const submitBtn = iframeDoc.querySelector('button[type="submit"]');
                  if (submitBtn) return submitBtn.click(), void setTimeout(() => {
                    this.setCache(config2, !0), window.location.reload();
                  }, 1e3);
                }
              }
              const bodyText = iframeDoc.body?.textContent || "";
              (bodyText.includes("签到成功") || bodyText.includes("恭喜") || bodyText.includes("已签到")) && (clearInterval(checkInterval), 
              this.setCache(config2, !0), window.location.reload());
            } catch (e) {}
          }, 500);
          setTimeout(() => clearInterval(checkInterval), 6e4);
        } catch (error) {}
      };
      const style = document.createElement("style");
      style.textContent = "\n      @keyframes slideIn {\n        from {\n          transform: translateX(400px);\n          opacity: 0;\n        }\n        to {\n          transform: translateX(0);\n          opacity: 1;\n        }\n      }\n    ", 
      document.querySelector("#laowang-checkin-animation") || (style.id = "laowang-checkin-animation", 
      document.head.appendChild(style));
    }
    static getTodayDate() {
      const now = new Date;
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }
    static setCache(config2, signed) {
      try {
        const data = JSON.stringify({
          date: this.getTodayDate(),
          signed: signed
        });
        GM_setValue(config2.checkIn.cacheKey, data);
      } catch (error) {}
    }
    static sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  class CheckInInfoBar {
    static async init(config2) {
      try {
        let targetSelector, targetDiv = null;
        if ("laowang" === config2.type) targetSelector = ".xxbt2", await this.waitForElement(targetSelector, 5e3), 
        targetDiv = document.querySelector(targetSelector); else if ("sjs" === config2.type) targetSelector = ".nex_top_search", 
        await this.waitForElement(targetSelector, 5e3), targetDiv = document.querySelector(targetSelector); else {
          if ("moxing" !== config2.type) return;
          targetSelector = 'a[href*="/home.php?mod=task"]', await this.waitForElement(targetSelector, 5e3), 
          targetDiv = document.querySelector(targetSelector);
        }
        if (!targetDiv) return;
        const stats = await LaowangCheckIn.getCheckInStats(config2);
        if (!stats) return;
        if (("sjs" === config2.type || "moxing" === config2.type) && !stats.alreadySigned && stats.signUrl) return void (await this.autoSignIn(config2, stats.signUrl));
        this.insertCheckInBar(config2, targetDiv, stats);
      } catch (error) {}
    }
    static waitForElement(selector, timeout = 5e3) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(selector)) return void resolve();
        const observer = new MutationObserver(() => {
          document.querySelector(selector) && (observer.disconnect(), resolve());
        });
        observer.observe(document.body, {
          childList: !0,
          subtree: !0
        }), setTimeout(() => {
          observer.disconnect(), reject(new Error(`等待元素超时: ${selector}`));
        }, timeout);
      });
    }
    static insertCheckInBar(config2, targetDiv, stats) {
      const checkInBar = document.createElement("div");
      if (checkInBar.id = "laowang-checkin-bar", "sjs" === config2.type || "moxing" === config2.type) return checkInBar.style.cssText = "display: inline-block; margin: 0 15px; color: #666; font-size: 12px;", 
      checkInBar.innerHTML = `连续${stats.lxdays}天 | 总${stats.lxtdays}天 | ${stats.alreadySigned ? "✓已签" : "待签"}`, 
      void ("sjs" === config2.type ? targetDiv.insertAdjacentElement("afterend", checkInBar) : targetDiv.insertAdjacentElement("beforebegin", checkInBar));
      checkInBar.style.cssText = "\n      margin-bottom: 10px;\n      width: 100%;\n      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n      border-radius: 10px;\n      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\n      padding: 0;\n      box-sizing: border-box;\n    ";
      const wrapper = document.createElement("div");
      wrapper.style.cssText = "\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      padding: 12px 20px;\n      color: #fff;\n      font-size: 13px;\n    ";
      const statsDiv = document.createElement("div");
      statsDiv.style.cssText = "display: flex; align-items: center; gap: 20px;";
      const lxdaysDiv = this.createStatItem("连续", `${stats.lxdays}天`, "18px"), lxlevelDiv = this.createStatItem("等级", `Lv.${stats.lxlevel}`, "18px"), lxtdaysDiv = this.createStatItem("总天数", `${stats.lxtdays}天`, "18px");
      statsDiv.appendChild(lxdaysDiv), statsDiv.appendChild(lxlevelDiv), statsDiv.appendChild(lxtdaysDiv);
      const actionDiv = document.createElement("div");
      actionDiv.style.cssText = "display: flex; align-items: center; gap: 12px;";
      const statusDiv = document.createElement("div");
      statusDiv.style.cssText = `font-size: 12px; font-weight: 600; color: ${stats.alreadySigned ? "rgba(144, 238, 144, 0.9)" : "rgba(255, 215, 0, 0.9)"};`, 
      statusDiv.textContent = stats.alreadySigned ? "✅ 今日已签" : "⏰ 待签到";
      const checkInBtn = document.createElement("button");
      checkInBtn.textContent = stats.alreadySigned ? "已签到" : "签到", checkInBtn.style.cssText = `\n      padding: 6px 18px;\n      background: ${stats.alreadySigned ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.95)"};\n      color: ${stats.alreadySigned ? "rgba(255, 255, 255, 0.6)" : "#667eea"};\n      border: none;\n      border-radius: 6px;\n      font-size: 13px;\n      font-weight: 600;\n      cursor: ${stats.alreadySigned ? "not-allowed" : "pointer"};\n    `, 
      stats.alreadySigned || (checkInBtn.onclick = () => LaowangCheckIn.execute(config2)), 
      actionDiv.appendChild(statusDiv), actionDiv.appendChild(checkInBtn), wrapper.appendChild(statsDiv), 
      wrapper.appendChild(actionDiv), checkInBar.appendChild(wrapper), targetDiv.parentElement?.insertBefore(checkInBar, targetDiv);
      const style = document.createElement("style");
      style.textContent = "\n      @media (max-width: 768px) {\n        #laowang-checkin-bar > div {\n          flex-direction: column !important;\n          gap: 12px !important;\n          padding: 12px 16px !important;\n        }\n        #laowang-checkin-bar > div > div:first-child {\n          flex-wrap: wrap;\n          gap: 12px !important;\n        }\n      }\n    ", 
      document.querySelector("#laowang-checkin-bar-style") || (style.id = "laowang-checkin-bar-style", 
      document.head.appendChild(style));
    }
    static createStatItem(label, value, fontSize = "16px", compact = !1) {
      const item = document.createElement("div");
      return item.style.cssText = `\n      text-align: center;\n      ${compact ? "" : "border-right: 1px solid rgba(255, 255, 255, 0.25);"}\n      padding-right: ${compact ? "0" : "20px"};\n    `, 
      item.innerHTML = `\n      <div style="font-size: ${compact ? "9px" : "10px"}; opacity: 0.85; margin-bottom: 2px;">${label}</div>\n      <div style="font-size: ${fontSize}; font-weight: 700;">${value}</div>\n    `, 
      item;
    }
    static async autoSignIn(config2, signUrl) {
      try {
        (await fetch(signUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            "X-Requested-With": "XMLHttpRequest"
          }
        })).ok && setTimeout(() => location.reload(), 1e3);
      } catch (error) {}
    }
  }
  function isLoggedIn(config2) {
    switch (config2.type) {
     case "laowang":
      return function() {
        const userInfo = document.querySelector("#deanmemberinfo");
        return !(!userInfo || !userInfo.querySelector('img[src*="avatar"]')) || !document.querySelector('a[href*="member.php?mod=logging&action=login"]') && !!document.querySelector('a[href*="home.php?mod=space"]');
      }();

     case "moxing":
      return function() {
        if (document.querySelector('#myitem[href*="home.php?mod=space"]')) return !0;
        const userLink = document.querySelector('a[href*="home.php?mod=space"]');
        if (userLink && userLink.querySelector('img[src*="avatar"]')) return !0;
        const loginLink = document.querySelector('a[href*="member.php?mod=logging&action=login"]');
        if (loginLink) {
          const linkText = loginLink.textContent?.trim() || "";
          if ("登录" === linkText || "登陆" === linkText) return !1;
        }
        return !1;
      }();

     case "sjs":
      return function() {
        if (document.querySelector('.nexvwmy[href*="home.php?mod=space"]')) return !0;
        const userLink = document.querySelector('a[href*="home.php?mod=space"]');
        if (userLink && userLink.querySelector('img[src*="avatar"]')) return !0;
        if (document.querySelector(".nexDL_unknown")) return !1;
        const loginLink = document.querySelector('a[href*="member.php?mod=logging&action=login"]');
        if (loginLink) {
          const linkText = loginLink.textContent?.trim() || "";
          if ("登陆账号" === linkText || "登录" === linkText) return !1;
        }
        return !1;
      }();

     default:
      return !1;
    }
  }
  async function waitAndCheckLogin(config2, timeout = 3e3) {
    if (isLoggedIn(config2)) return !0;
    const startTime = Date.now();
    for (;Date.now() - startTime < timeout; ) if (await new Promise(resolve => setTimeout(resolve, 100)), 
    isLoggedIn(config2)) return !0;
    return !1;
  }
  const LaowangModule = {
    type: "laowang",
    name: "老王论坛",
    config: {
      type: "laowang",
      name: "老王论坛",
      domainPattern: /laowang\.vip|laowangwnr3p\.com|y6ptsn8\.com/,
      checkIn: {
        pageUrl: "plugin.php?id=k_misign:sign",
        buttonSelector: "a.btn.J_chkitot",
        signedSelector: "span.btn.btnvisted",
        cacheKey: "LAOWANG_CHECKIN_STATUS",
        type: "manual"
      },
      selectors: {
        loginLink: 'a[href*="member.php?mod=logging"]',
        userLink: 'a[href*="home.php?mod=space"]',
        checkInElement: ".btn.J_chkitot, span.btn.btnvisted",
        userProfile: ".vwmy, #um, .hdc_lc"
      },
      pages: {
        home: [ /^\/$/, /^\/index\.php$/, /^\/forum\.php$/ ],
        list: [ /forum\.php\?mod=forumdisplay/ ],
        search: [ /\/search\/s\.php/ ]
      }
    },
    hasCheckIn: !0,
    async init() {
      "undefined" != typeof GM_registerMenuCommand && GM_registerMenuCommand("🗑️ 清空图片缓存", () => {
        try {
          SimpleCache.getInstance().clear(), Toast.success("图片缓存已清空"), setTimeout(() => location.reload(), 500);
        } catch (error) {
          Toast.error("清空失败");
        }
      });
      const url = new URL(location.href);
      "forumdisplay" === url.searchParams.get("mod") && url.searchParams.has("fid") && (url.searchParams.has("orderby") || (url.searchParams.set("filter", "author"), 
      url.searchParams.set("orderby", "dateline"), location.href = url.toString()));
    },
    async handlePage(pageType) {
      switch (function() {
        const removeNativeViewer = () => {
          const viewer = document.getElementById("image-viewer");
          viewer && viewer.remove();
        };
        removeNativeViewer(), new MutationObserver(removeNativeViewer).observe(document.body, {
          childList: !0,
          subtree: !1
        }), setInterval(removeNativeViewer, 100);
      }(), pageType) {
       case "home":
        await (this.checkIn?.());
        break;

       case "list":
       case "search":
        const processorType = "search" === pageType ? "laowangSearch" : "laowang";
        ThreadProcessor.processThreadList(processorType), function() {
          const ruleElements = document.querySelectorAll('.deanbkms[id^="forum_rules_"]');
          ruleElements.length > 0 && ruleElements.forEach(el => {
            el.style.display = "none";
          });
        }();
      }
    },
    async checkIn() {
      await waitAndCheckLogin(this.config) && CheckInInfoBar.init(this.config);
    }
  }, MoxingModule = {
    type: "moxing",
    name: "魔性论坛",
    config: {
      type: "moxing",
      name: "魔性论坛",
      domainPattern: /moxing\.app|moxing\.vip|moxing\.lol/,
      checkIn: {
        pageUrl: "plugin.php?id=k_misign:sign",
        buttonSelector: "a.btn.J_chkitot",
        signedSelector: "span.btn.btnvisted",
        cacheKey: "MOXING_CHECKIN_STATUS",
        type: "manual"
      },
      selectors: {
        loginLink: 'a[href*="member.php?mod=logging"]',
        userLink: 'a[href*="home.php?mod=space"]',
        checkInElement: "#fx_checkin_b",
        userProfile: ".vwmy, #um, .hdc_lc"
      },
      pages: {
        home: [ /^\/$/, /^\/index\.php$/ ],
        list: [ /forum-\d+-\d+\.html/, /forum\.php\?mod=forumdisplay/ ],
        search: [ /search\.php\?mod=forum/ ]
      }
    },
    hasCheckIn: !0,
    async init() {
      "undefined" != typeof GM_registerMenuCommand && GM_registerMenuCommand("🗑️ 清空图片缓存", () => {
        try {
          SimpleCache.getInstance().clear(), Toast.success("图片缓存已清空"), setTimeout(() => location.reload(), 500);
        } catch (error) {
          Toast.error("清空失败");
        }
      });
      const picModeBtn = document.querySelector('td.by a[href*="forumdefstyle"]');
      picModeBtn && picModeBtn.classList.contains("chked") && (location.href = picModeBtn.href);
    },
    async handlePage(pageType) {
      switch (pageType) {
       case "home":
        await (this.checkIn?.());
        break;

       case "list":
       case "search":
        const processorType = "search" === pageType ? "moxingSearch" : "moxing";
        ThreadProcessor.processThreadList(processorType);
      }
    },
    async checkIn() {
      await waitAndCheckLogin(this.config) && CheckInInfoBar.init(this.config);
    }
  };
  class SjsProcessor {
    static getImageUrl(style) {
      const match = style.match(/url\(\s*([^)]+)\s*\)/);
      if (!match) return "";
      let url = match[1].trim();
      return url = url.replace(/^['"]|['"]$/g, ""), url;
    }
    static processImages() {
      document.querySelectorAll(".nex_forumlist_pics .nex_thread_pics a").forEach(el => {
        const anchor = el;
        if (anchor.dataset.processed) return;
        anchor.dataset.processed = "1";
        const imgUrl = this.getImageUrl(anchor.getAttribute("style") || "");
        if (!imgUrl) return;
        const wrapper = anchor.parentElement;
        wrapper && (wrapper.style.width = "180px", wrapper.style.height = "180px"), anchor.style.cssText = `\n        display: block;\n        width: 100%;\n        height: 100%;\n        background: url(${imgUrl}) center center no-repeat;\n        background-size: contain;\n      `;
        const container = anchor.closest(".nex_forumlist_pics"), allAnchors = container?.querySelectorAll(".nex_thread_pics a") || [], allImages = Array.from(allAnchors).map(a => this.getImageUrl(a.getAttribute("style") || "")).filter(Boolean), currentIndex = allImages.indexOf(imgUrl);
        anchor.onclick = e => {
          e.preventDefault(), Lightbox.show(allImages, currentIndex);
        };
      }), document.querySelectorAll(".nex_forumlist_pics ul").forEach(el => {
        const ul = el;
        ul.style.display = "flex", ul.style.flexWrap = "nowrap", ul.style.gap = "10px";
      });
    }
    static init() {
      if (!document.body) return void setTimeout(() => this.init(), 10);
      this.processImages();
      const targetContainer = document.querySelector(".nex_forumlist_pics");
      targetContainer && new MutationObserver(() => this.processImages()).observe(targetContainer, {
        childList: !0,
        subtree: !0
      });
    }
  }
  const SjsModule = {
    type: "sjs",
    name: "司机社",
    config: {
      type: "sjs",
      name: "司机社",
      domainPattern: /sjs47\.com|xsijishe\.net/,
      checkIn: {
        pageUrl: "plugin.php?id=k_misign:sign",
        buttonSelector: "a.btn.J_chkitot",
        signedSelector: "span.btn.btnvisted",
        cacheKey: "SJS_CHECKIN_STATUS",
        type: "manual"
      },
      selectors: {
        loginLink: 'a[href*="member.php?mod=logging"]',
        userLink: 'a[href*="home.php?mod=space"]',
        checkInElement: "#fx_checkin_b",
        userProfile: ".vwmy, #um, .hdc_lc"
      },
      pages: {
        home: [ /^\/$/, /^\/index\.php$/, /^\/forum\.php$/ ],
        list: [ /forum-\d+-\d+\.html/, /thread-\d+-\d+-\d+\.html/, /forum\.php\?mod=forumdisplay/, /forum\.php\?mod=viewthread/, /\.php/ ],
        search: [ /search\.php\?mod=forum/ ]
      }
    },
    hasCheckIn: !0,
    async init() {
      "undefined" != typeof GM_registerMenuCommand && GM_registerMenuCommand("🗑️ 清空图片缓存", () => {
        try {
          SimpleCache.getInstance().clear(), Toast.success("图片缓存已清空"), setTimeout(() => location.reload(), 500);
        } catch (error) {
          Toast.error("清空失败");
        }
      }), (/misc\.php\?mod=mobile/.test(location.href) || /mobile=1/.test(location.href)) && (location.href = location.origin + "/forum.php");
    },
    async handlePage(pageType) {
      switch (pageType) {
       case "home":
        await (this.checkIn?.());
        break;

       case "list":
        SjsProcessor.init();
      }
    },
    async checkIn() {
      await waitAndCheckLogin(this.config) && CheckInInfoBar.init(this.config);
    }
  }, U9A9_CONFIG = {
    MAX_PREVIEW_IMAGES: 5,
    PREVIEW_IMAGE_HEIGHT: 200,
    IMAGE_BORDER: "1px solid #ddd",
    IMAGE_BORDER_RADIUS: "4px",
    IMAGE_OBJECT_FIT: "contain",
    IMAGE_CURSOR: "pointer",
    IMAGE_TRANSITION: "transform 0.2s ease",
    selectors: {
      listTable: "table.torrent-list",
      listRows: "table.torrent-list tbody tr.default",
      titleLinks: "td:nth-child(2) a",
      imgContainer: "div.img-container",
      images: "div.img-container img",
      adContainers: [ ".row.ad", ".row .ad", ".col-md-6 .adclick", "a.adclick", 'img[src*="/image/a/"]', 'img[src*="/image/b/"]' ]
    },
    regex: {
      viewUrl: /^\/view\/\d+\/[a-f0-9]+$/,
      imageUrl: /\.(jpg|jpeg|png|gif|webp)$/i
    },
    styles: {
      previewImages: "display: flex; gap: 4px; flex-wrap: nowrap; overflow: hidden; width: 100%; padding: 4px; margin: 0;",
      previewRow: "\n            .u9a9-preview-row {\n                background-color: #f8f9fa !important;\n            }\n            .u9a9-preview-row td {\n                padding: 10px !important;\n                text-align: center !important;\n            }\n            .u9a9-preview-row img {\n                border-radius: 4px;\n                transition: transform 0.2s ease;\n            }\n            .u9a9-preview-row img:hover {\n                transform: scale(1.05);\n            }\n        "
    },
    getPreviewImageStyle(imageCount = 1) {
      const width = imageCount <= 3 ? "auto" : Math.floor(100 / imageCount) - 1 + "%";
      return `height: ${this.PREVIEW_IMAGE_HEIGHT}px; width: ${width}; object-fit: ${this.IMAGE_OBJECT_FIT}; cursor: ${this.IMAGE_CURSOR}; border: ${this.IMAGE_BORDER}; border-radius: ${this.IMAGE_BORDER_RADIUS}; flex-shrink: 0; transition: ${this.IMAGE_TRANSITION};`;
    }
  }, _StyleManager = class {
    static init() {
      this.applyStyles(), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", () => {
        this.applyStyles();
      });
    }
    static applyStyles() {
      this.styleElement && this.styleElement.remove(), this.styleElement = document.createElement("style"), 
      this.styleElement.type = "text/css", this.styleElement.textContent = U9A9_CONFIG.styles.previewRow, 
      (document.head || document.getElementsByTagName("head")[0]).appendChild(this.styleElement);
    }
    static destroy() {
      this.styleElement && (this.styleElement.remove(), this.styleElement = null);
    }
  };
  _StyleManager.styleElement = null;
  let StyleManager = _StyleManager;
  const _DomManager = class {
    static init() {
      this.removeAds(), this.removeTorrentLinks(), this.setupObservers();
    }
    static setupObservers() {
      document.body && (this.adObserver = new MutationObserver(() => {
        this.removeAds();
      }), this.adObserver.observe(document.body, {
        childList: !0,
        subtree: !0
      }), this.torrentObserver = new MutationObserver(mutations => {
        let hasNewNodes = !1;
        mutations.forEach(mutation => {
          "childList" === mutation.type && mutation.addedNodes.length > 0 && mutation.addedNodes.forEach(node => {
            node instanceof HTMLElement && ("A" === node.tagName && node.getAttribute("href")?.includes(".torrent") || node.querySelector && node.querySelector('a[href*=".torrent"]')) && (hasNewNodes = !0);
          });
        }), hasNewNodes && this.removeTorrentLinks();
      }), this.torrentObserver.observe(document, {
        childList: !0,
        subtree: !0
      }));
    }
    static removeAds() {
      U9A9_CONFIG.selectors.adContainers.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
          "true" !== element.dataset.u9a9AdRemoved && (element.dataset.u9a9AdRemoved = "true", 
          element.style.setProperty("display", "none", "important"));
        });
      });
    }
    static removeTorrentLinks() {
      document.querySelectorAll('a[href*=".torrent"]:not([href^="magnet:"])').forEach(link => {
        try {
          const href = link.getAttribute("href");
          if (href && href.includes(".torrent") && !href.startsWith("magnet:")) {
            const nextSibling = link.nextElementSibling;
            if (nextSibling && nextSibling.classList.contains("ext-push-resource-to-115")) {
              const resourceUrl = nextSibling.getAttribute("data-resource-url");
              resourceUrl && resourceUrl.includes(".torrent") && nextSibling.remove();
            }
            link.remove();
          }
        } catch (error) {}
      });
    }
    static destroy() {
      this.adObserver?.disconnect(), this.torrentObserver?.disconnect(), this.adObserver = null, 
      this.torrentObserver = null;
    }
  };
  _DomManager.adObserver = null, _DomManager.torrentObserver = null;
  let DomManager = _DomManager;
  const _PreviewProcessor = class {
    static async processAll() {
      const rows = document.querySelectorAll(U9A9_CONFIG.selectors.listRows);
      if (!rows || 0 === rows.length) return;
      const promises = Array.from(rows).map(row => this.processRow(row));
      await Promise.all(promises);
    }
    static async processRow(row) {
      const linkElement = row.querySelector(U9A9_CONFIG.selectors.titleLinks);
      if (!linkElement) return;
      const pageUrl = linkElement.href;
      if ("true" === row.dataset.previewProcessed) return;
      row.dataset.previewProcessed = "true";
      const cached = SimpleCache.get(pageUrl);
      if (cached) this.insertPreviewRow(row, cached, pageUrl); else if (!this.loading.has(pageUrl)) {
        this.loading.add(pageUrl);
        try {
          const images = await this.fetchImages(pageUrl);
          SimpleCache.set(pageUrl, images), this.insertPreviewRow(row, images, pageUrl);
        } catch (error) {} finally {
          this.loading.delete(pageUrl);
        }
      }
    }
    static async fetchImages(pageUrl) {
      const response = await fetch(pageUrl);
      if (!response.ok) throw new Error(`HTTP 错误！状态: ${response.status}`);
      const html = await response.text(), imgContainer = (new DOMParser).parseFromString(html, "text/html").querySelector(U9A9_CONFIG.selectors.imgContainer);
      return imgContainer ? Array.from(imgContainer.querySelectorAll("img")).map(img => this.getFullImageUrl(img.src)).filter(src => src && this.isImageUrl(src)).slice(0, U9A9_CONFIG.MAX_PREVIEW_IMAGES) : [];
    }
    static insertPreviewRow(row, images, pageUrl) {
      const nextRow = row.nextElementSibling;
      if (nextRow && nextRow.classList.contains("u9a9-preview-row")) return void this.updatePreviewRow(nextRow, images, pageUrl);
      const newRow = document.createElement("tr");
      newRow.className = "u9a9-preview-row";
      const newCell = document.createElement("td"), colCount = row.cells.length;
      newCell.setAttribute("colspan", colCount.toString()), newCell.style.cssText = "padding: 10px; text-align: center; background: #f8f9fa;", 
      0 === images.length ? newCell.textContent = "无预览图" : this.renderImages(newCell, images), 
      newRow.appendChild(newCell), row.insertAdjacentElement("afterend", newRow);
    }
    static updatePreviewRow(previewRow, images, pageUrl) {
      const cell = previewRow.querySelector("td");
      cell && (cell.innerHTML = "", 0 === images.length ? cell.textContent = "无预览图" : this.renderImages(cell, images));
    }
    static renderImages(cell, images) {
      const container = document.createElement("div");
      container.style.cssText = U9A9_CONFIG.styles.previewImages, images.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src, img.loading = "lazy", img.alt = `预览图 ${index + 1}`, img.style.cssText = U9A9_CONFIG.getPreviewImageStyle(images.length), 
        img.addEventListener("click", () => {
          Lightbox.show(images, index);
        }), img.addEventListener("error", () => {
          img.style.display = "none";
        }), img.addEventListener("mouseenter", () => {
          img.style.transform = "scale(1.05)";
        }), img.addEventListener("mouseleave", () => {
          img.style.transform = "scale(1)";
        }), container.appendChild(img);
      }), cell.appendChild(container);
    }
    static getFullImageUrl(src) {
      return src.startsWith("//") ? `https:${src}` : src.startsWith("/") ? `${window.location.origin}${src}` : src;
    }
    static isImageUrl(url) {
      return U9A9_CONFIG.regex.imageUrl.test(url);
    }
  };
  _PreviewProcessor.loading = new Set;
  let PreviewProcessor = _PreviewProcessor;
  !async function(modules2) {
    try {
      registry.registerAll(modules2);
      const module = registry.matchByHost(location.hostname);
      if (!module) return;
      await module.init(), await new Promise(resolve => {
        "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", () => resolve(), {
          once: !0
        }) : resolve();
      });
      const pageType = registry.detectPageType(module);
      await module.handlePage(pageType);
    } catch (error) {}
  }([ GcbtModule, LaowangModule, MoxingModule, SjsModule, {
    type: "u9a9",
    name: "U9A9",
    config: {
      type: "u9a9",
      name: "U9A9",
      domainPattern: /u9a9\.com$/,
      pages: {
        home: [ /^\/$/ ],
        list: [ /^\//, /^\/category\//, /^\/search\// ],
        content: [ /^\/view\/\d+\// ]
      }
    },
    hasCheckIn: !1,
    async init() {
      StyleManager.init();
    },
    async handlePage(pageType) {
      try {
        DomManager.init(), "list" !== pageType && "home" !== pageType || await PreviewProcessor.processAll();
      } catch (e) {}
    },
    destroy() {
      DomManager.destroy(), StyleManager.destroy();
    }
  } ]);
}();
