// ==UserScript==
// @name          ESJZone 全本下载
// @namespace     https://github.com/mikoto710/esj-novel-downloader
// @homepageURL   https://github.com/mikoto710/esj-novel-downloader
// @supportURL    https://github.com/mikoto710/esj-novel-downloader/issues
// @version       1.4.3
// @description   在 ESJZone 小说详情页/论坛页注入下载按钮，支持 TXT/EPUB 全本导出，支持阅读页单章节下载
// @author        Shigure Sora
// @license       MIT
// @match         https://www.esjzone.cc/detail/*
// @match         https://www.esjzone.one/detail/*
// @match         https://www.esjzone.cc/forum/*
// @match         https://www.esjzone.one/forum/*
// @run-at        document-start
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_xmlhttpRequest
// @grant         unsafeWindow
// @connect       *
// @downloadURL https://update.greasyfork.org/scripts/562046/ESJZone%20%E5%85%A8%E6%9C%AC%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562046/ESJZone%20%E5%85%A8%E6%9C%AC%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const state = {
      abortFlag: false,
      originalTitle: document.title || "ESJZone",
      cachedData: null,
      globalChaptersMap: /* @__PURE__ */ new Map(),
      abortController: null
    };
    function setAbortFlag(val) {
      state.abortFlag = val;
    }
    function setCachedData(data) {
      state.cachedData = data;
    }
    function resetAbortController() {
      state.abortController = new AbortController();
    }
    function resetGlobalState() {
      state.cachedData = null;
      state.globalChaptersMap.clear();
      console.log("\u5185\u5B58\u72B6\u6001\u5DF2\u91CD\u7F6E");
    }

    function getGlobalVar(name) {
      if (window && window[name]) {
        return window[name];
      }
      if (typeof unsafeWindow !== "undefined" && unsafeWindow[name]) {
        return unsafeWindow[name];
      }
      return void 0;
    }
    function loadSingleScript(src, globalName) {
      return new Promise((resolve, reject) => {
        const existing = getGlobalVar(globalName);
        if (existing) return resolve(existing);
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => {
          const loaded = getGlobalVar(globalName);
          if (loaded) {
            resolve(loaded);
          } else {
            reject(new Error(`\u811A\u672C\u52A0\u8F7D\u6210\u529F\u4F46\u5168\u5C40\u53D8\u91CF\u672A\u627E\u5230: ${globalName}`));
          }
        };
        s.onerror = () => {
          s.remove();
          reject(new Error(`\u7F51\u7EDC\u9519\u8BEF: ${src}`));
        };
        document.head.appendChild(s);
      });
    }
    async function loadScript(srcs, globalName) {
      const urls = Array.isArray(srcs) ? srcs : [srcs];
      let lastError = null;
      for (const url of urls) {
        try {
          return await loadSingleScript(url, globalName);
        } catch (e) {
          console.warn(`[esj-novel-downloader] CDN \u52A0\u8F7D\u5931\u8D25 (${url}):`, e.message);
          lastError = e;
        }
      }
      throw new Error(`\u6240\u6709 CDN \u5747\u52A0\u8F7D\u5931\u8D25\u3002\u6700\u540E\u4E00\u6B21\u9519\u8BEF: ${lastError?.message}`);
    }
    function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }
    function sleepWithAbort(ms, signal) {
      return new Promise((resolve) => {
        if (signal?.aborted) return resolve();
        const onAbort = () => {
          clearTimeout(timer);
          signal?.removeEventListener("abort", onAbort);
          resolve();
        };
        const timer = setTimeout(() => {
          signal?.removeEventListener("abort", onAbort);
          resolve();
        }, ms);
        signal?.addEventListener("abort", onAbort);
      });
    }
    function triggerDownload(blob, filename) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 6e4);
    }
    function log(msg) {
      const prefix = (/* @__PURE__ */ new Date()).toLocaleTimeString();
      const line = `[${prefix}] ${msg}`;
      console.log(line);
      const box = document.querySelector("#esj-log");
      if (box) {
        const isAtBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 10;
        box.textContent += line + "\n";
        if (isAtBottom) {
          box.scrollTop = box.scrollHeight;
        }
      }
    }
    function fetchWithTimeout(url, options = {}, timeout = 15e3, cancelSignal) {
      return new Promise((resolve, reject) => {
        if (cancelSignal?.aborted) {
          return reject(new Error("User Aborted"));
        }
        let requestHandle = null;
        const onAbort = () => {
          if (requestHandle) {
            requestHandle.abort();
          }
          reject(new Error("User Aborted"));
        };
        if (cancelSignal) {
          cancelSignal.addEventListener("abort", onAbort);
        }
        requestHandle = GM_xmlhttpRequest({
          method: options.method || "GET",
          url,
          headers: options.headers,
          data: options.body,
          timeout,
          responseType: "blob",
          anonymous: options.credentials === "omit",
          onload: (res) => {
            if (cancelSignal) cancelSignal.removeEventListener("abort", onAbort);
            if (res.status >= 200 && res.status < 300) {
              const response = new Response(res.response, {
                status: res.status,
                statusText: res.statusText
              });
              Object.defineProperty(response, "url", { value: res.finalUrl });
              resolve(response);
            } else {
              reject(new Error(`Status ${res.status}`));
            }
          },
          ontimeout: () => {
            if (cancelSignal) cancelSignal.removeEventListener("abort", onAbort);
            reject(new Error("Timeout"));
          },
          onerror: (err) => {
            if (cancelSignal) cancelSignal.removeEventListener("abort", onAbort);
            reject(new Error("Network Error"));
          }
        });
      });
    }

    function enableDrag(popup, headerSelector) {
      const header = popup.querySelector(headerSelector);
      if (!header) return;
      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;
      header.addEventListener("mousedown", (e) => {
        dragging = true;
        const rect = popup.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp, { once: true });
      });
      function onMove(e) {
        if (!dragging) return;
        popup.style.left = e.clientX - offsetX + "px";
        popup.style.top = e.clientY - offsetY + "px";
        popup.style.transform = "none";
      }
      function onUp() {
        dragging = false;
        document.removeEventListener("mousemove", onMove);
      }
    }
    function fullCleanup(originalTitle) {
      const selectors = [
        "#esj-popup",
        "#esj-min-tray",
        "#esj-confirm",
        "#esj-format",
        "#esj-settings"
      ];
      selectors.forEach((sel) => {
        document.querySelector(sel)?.remove();
      });
      if (originalTitle) {
        document.title = originalTitle;
      }
      const settingsBtns = document.querySelectorAll(".esj-settings-trigger");
      settingsBtns.forEach((btn) => btn.disabled = false);
    }
    function el(tag, attrs = {}, children = []) {
      const element = document.createElement(tag);
      for (const [key, value] of Object.entries(attrs)) {
        if (key === "style" && typeof value === "object") {
          Object.assign(element.style, value);
        } else if (key.startsWith("on") && typeof value === "function") {
          element.addEventListener(key.substring(2).toLowerCase(), value);
        } else if (key === "className") {
          element.className = value;
        } else if (["checked", "value", "disabled", "selected"].includes(key)) {
          element[key] = value;
        } else {
          element.setAttribute(key, String(value));
        }
      }
      children.forEach((child) => {
        if (typeof child === "string" || typeof child === "number") {
          element.appendChild(document.createTextNode(String(child)));
        } else if (child instanceof Node) {
          element.appendChild(child);
        }
      });
      return element;
    }

    function createMinimizedTray(progressText) {
      const old = document.querySelector("#esj-min-tray");
      if (old) old.remove();
      const tray = el("div", {
        id: "esj-min-tray",
        title: "\u70B9\u51FB\u6062\u590D\u4E0B\u8F7D\u7A97\u53E3",
        onclick: () => {
          const popup = document.querySelector("#esj-popup");
          if (popup) {
            popup.style.display = "flex";
            tray.remove();
          }
        }
      }, [
        el("span", {}, ["\u{1F4D8}"]),
        el("span", { id: "esj-tray-text" }, [progressText])
      ]);
      document.body.appendChild(tray);
      return tray;
    }
    function updateTrayText(text) {
      const element = document.querySelector("#esj-tray-text");
      if (element) {
        element.textContent = text;
      }
    }

    function escapeXml(s) {
      if (!s) return "";
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    }
    function convertToXhtml(htmlString) {
      if (!htmlString) return "";
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");
      const allElements = doc.body.querySelectorAll("*");
      const validXmlNameRegex = /^[a-zA-Z_:][a-zA-Z0-9_\-\.\:]*$/;
      allElements.forEach((el) => {
        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          const name = attr.name;
          if (!validXmlNameRegex.test(name)) {
            el.removeAttribute(name);
            continue;
          }
          if (name.includes(":")) {
            if (!name.startsWith("xmlns") && !name.startsWith("xml")) {
              el.removeAttribute(name);
            }
          }
        }
      });
      const serializer = new XMLSerializer();
      const xhtmlParts = [];
      Array.from(doc.body.childNodes).forEach((node) => {
        try {
          let str = serializer.serializeToString(node);
          str = str.replace(/ xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, "");
          xhtmlParts.push(str);
        } catch (e) {
          console.warn("XHTML \u5E8F\u5217\u5316\u8282\u70B9\u5931\u8D25:", node, e);
        }
      });
      return xhtmlParts.join("");
    }
    function removeImgTags(html) {
      return html.replace(/<img[^>]*>/gi, "");
    }

    async function buildEpub(chapters, metadata) {
      let ZipClass;
      const JSZIP_URLS = [
        "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
        "https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"
      ];
      try {
        ZipClass = await loadScript(JSZIP_URLS, "JSZip");
      } catch (e) {
        throw new Error("JSZip \u6838\u5FC3\u5E93\u52A0\u8F7D\u5931\u8D25: " + e.message);
      }
      const zip = new ZipClass();
      zip.file("mimetype", "application/epub+zip", { binary: true, compression: "STORE" });
      zip.folder("META-INF")?.file(
        "container.xml",
        `<?xml version="1.0" encoding="utf-8"?>
            <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
                <rootfiles>
                    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
                </rootfiles>
            </container>`
      );
      const oebps = zip.folder("OEBPS");
      if (!oebps) throw new Error("\u65E0\u6CD5\u521B\u5EFA OEBPS \u6587\u4EF6\u5939");
      const manifestItems = [];
      const spineItems = [];
      let coverMeta = "";
      if (metadata.coverBlob) {
        const coverFilename = "cover." + metadata.coverExt;
        const coverMime = metadata.coverExt === "png" ? "image/png" : "image/jpeg";
        oebps.file(coverFilename, metadata.coverBlob);
        manifestItems.push(`<item id="cover-image" href="${coverFilename}" media-type="${coverMime}" properties="cover-image"/>`);
        coverMeta = `<meta name="cover" content="cover-image" />`;
      }
      let navHtml = `<?xml version="1.0" encoding="utf-8"?>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="zh">
          <head><title>\u76EE\u5F55</title></head>
          <body>
            <nav epub:type="toc" id="toc">
              <h1>\u76EE\u5F55</h1>
              <ol>
        `;
      for (let i = 0; i < chapters.length; i++) {
        const id = `chap_${i + 1}`;
        const filename = `${id}.xhtml`;
        const title2 = chapters[i].title || `\u7B2C${i + 1}\u7AE0`;
        const body = convertToXhtml(chapters[i].content || "");
        const chap = chapters[i];
        if (chap.images && chap.images.length > 0) {
          chap.images.forEach((img) => {
            oebps.file(img.id, img.blob);
            manifestItems.push(
              `<item id="${img.id.replace(".", "_")}" href="${img.id}" media-type="${img.mediaType}" />`
            );
          });
        }
        const xhtml = `<?xml version="1.0" encoding="utf-8"?>
            <html xmlns="http://www.w3.org/1999/xhtml">
              <head><title>${escapeXml(title2)}</title></head>
              <body>
                <h2>${escapeXml(title2)}</h2>
                <div>${body}</div>
              </body>
            </html>`;
        oebps.file(filename, xhtml);
        manifestItems.push(`<item id="${id}" href="${filename}" media-type="application/xhtml+xml"/>`);
        spineItems.push(`<itemref idref="${id}"/>`);
        navHtml += `<li><a href="${filename}">${escapeXml(title2)}</a></li>`;
      }
      navHtml += `</ol></nav></body></html>`;
      oebps.file("nav.xhtml", navHtml);
      manifestItems.push(`<item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/>`);
      const uniqueId = metadata.uuid || "id-" + Date.now();
      const title = escapeXml(metadata.title || "\u672A\u77E5\u66F8\u540D");
      const author = escapeXml(metadata.author || "");
      const pubdate = (/* @__PURE__ */ new Date()).toISOString();
      const contentOpf = `<?xml version="1.0" encoding="utf-8"?>
        <package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="3.0">
          <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
            <dc:title>${title}</dc:title>
            <dc:language>zh-CN</dc:language>
            <dc:identifier id="BookId">${uniqueId}</dc:identifier>
            <dc:creator>${author}</dc:creator>
            <dc:date>${pubdate}</dc:date>
            ${coverMeta}
          </metadata>
          <manifest>
            ${manifestItems.join("\n")}
          </manifest>
          <spine>
            ${spineItems.join("\n")}
          </spine>
        </package>`;
      oebps.file("content.opf", contentOpf);
      log("\u6B63\u5728\u538B\u7F29\u751F\u6210 EPUB\uFF08\u53EF\u80FD\u9700\u8981\u51E0\u79D2\uFF09...");
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
      return blob;
    }

    const DEFAULT_CONFIG = {
      concurrency: 5,
      enableImageDownload: false
    };
    function getConcurrency() {
      let val = GM_getValue("concurrency", DEFAULT_CONFIG.concurrency);
      if (typeof val !== "number" || val <= 0) {
        val = DEFAULT_CONFIG.concurrency;
      }
      return val;
    }
    function setConcurrency(num) {
      if (num > 10) num = 10;
      if (num < 1) num = 1;
      GM_setValue("concurrency", num);
      log(`\u5E76\u53D1\u6570\u5DF2\u66F4\u65B0\u4E3A: ${num}`);
    }
    function getImageDownloadSetting() {
      return GM_getValue("enable_image_download", DEFAULT_CONFIG.enableImageDownload);
    }
    function setImageDownloadSetting(val) {
      GM_setValue("enable_image_download", val);
    }

    function promisifyRequest(request) {
        return new Promise((resolve, reject) => {
            // @ts-ignore - file size hacks
            request.oncomplete = request.onsuccess = () => resolve(request.result);
            // @ts-ignore - file size hacks
            request.onabort = request.onerror = () => reject(request.error);
        });
    }
    function createStore(dbName, storeName) {
        let dbp;
        const getDB = () => {
            if (dbp)
                return dbp;
            const request = indexedDB.open(dbName);
            request.onupgradeneeded = () => request.result.createObjectStore(storeName);
            dbp = promisifyRequest(request);
            dbp.then((db) => {
                // It seems like Safari sometimes likes to just close the connection.
                // It's supposed to fire this event when that happens. Let's hope it does!
                db.onclose = () => (dbp = undefined);
            }, () => { });
            return dbp;
        };
        return (txMode, callback) => getDB().then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
    }
    let defaultGetStoreFunc;
    function defaultGetStore() {
        if (!defaultGetStoreFunc) {
            defaultGetStoreFunc = createStore('keyval-store', 'keyval');
        }
        return defaultGetStoreFunc;
    }
    /**
     * Get a value by its key.
     *
     * @param key
     * @param customStore Method to get a custom store. Use with caution (see the docs).
     */
    function get(key, customStore = defaultGetStore()) {
        return customStore('readonly', (store) => promisifyRequest(store.get(key)));
    }
    /**
     * Set a value with a key.
     *
     * @param key
     * @param value
     * @param customStore Method to get a custom store. Use with caution (see the docs).
     */
    function set(key, value, customStore = defaultGetStore()) {
        return customStore('readwrite', (store) => {
            store.put(value, key);
            return promisifyRequest(store.transaction);
        });
    }
    /**
     * Delete a particular key from the store.
     *
     * @param key
     * @param customStore Method to get a custom store. Use with caution (see the docs).
     */
    function del(key, customStore = defaultGetStore()) {
        return customStore('readwrite', (store) => {
            store.delete(key);
            return promisifyRequest(store.transaction);
        });
    }
    function eachCursor(store, callback) {
        store.openCursor().onsuccess = function () {
            if (!this.result)
                return;
            callback(this.result);
            this.result.continue();
        };
        return promisifyRequest(store.transaction);
    }
    /**
     * Get all keys in the store.
     *
     * @param customStore Method to get a custom store. Use with caution (see the docs).
     */
    function keys(customStore = defaultGetStore()) {
        return customStore('readonly', (store) => {
            // Fast path for modern browsers
            if (store.getAllKeys) {
                return promisifyRequest(store.getAllKeys());
            }
            const items = [];
            return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);
        });
    }

    const CACHE_PREFIX = "esj_down_";
    const CACHE_EXPIRE_TIME = 24 * 60 * 60 * 1e3;
    async function loadBookCache(bookId) {
      const key = CACHE_PREFIX + bookId;
      try {
        const data = await get(key);
        if (!data) return { size: 0, map: null };
        if (Date.now() - data.ts > CACHE_EXPIRE_TIME) {
          console.warn("\u26A0 \u672C\u5730\u7F13\u5B58\u5DF2\u8FC7\u671F\uFF0C\u81EA\u52A8\u6E05\u7406");
          await del(key);
          return { size: 0, map: null };
        }
        if (Array.isArray(data.chapters)) {
          const map = new Map(data.chapters);
          console.log(`\u2705 \u8BFB\u53D6\u5230\u672C\u5730\u7F13\u5B58\uFF0C\u7AE0\u8282\u6570\uFF1A${map.size}`);
          return { size: map.size, map };
        }
      } catch (e) {
        console.error("\u8BFB\u53D6\u7F13\u5B58\u5931\u8D25", e);
      }
      return { size: 0, map: null };
    }
    async function saveBookCache(bookId, map) {
      const key = CACHE_PREFIX + bookId;
      const data = {
        ts: Date.now(),
        chapters: Array.from(map.entries())
      };
      try {
        await set(key, data);
      } catch (e) {
        console.error("\u4FDD\u5B58\u7F13\u5B58\u5931\u8D25", e);
      }
    }
    async function clearBookCache(bookId) {
      try {
        await del(CACHE_PREFIX + bookId);
        log("\u{1F5D1}\uFE0F \u4EFB\u52A1\u5B8C\u6210\uFF0C\u5DF2\u6E05\u7406\u672C\u5730\u7F13\u5B58");
      } catch (e) {
        console.error("\u6E05\u7406\u7F13\u5B58\u5931\u8D25", e);
      }
    }
    async function clearAllCaches() {
      try {
        const allKeys = await keys();
        const targetKeys = allKeys.filter((k) => String(k).startsWith(CACHE_PREFIX));
        const promises = targetKeys.map((k) => del(k));
        await Promise.all(promises);
        resetGlobalState();
        console.log("Cache cleared:", targetKeys);
      } catch (e) {
        console.error("\u6E05\u7406\u7F13\u5B58\u5931\u8D25", e);
        alert("\u6E05\u7406\u5931\u8D25: " + e.message);
      }
    }

    function toggleSettingsLock(locked) {
      const btns = document.querySelectorAll(".esj-settings-trigger");
      btns.forEach((b) => b.disabled = locked);
    }
    function toggleDownloadLock(locked) {
      const btns = document.querySelectorAll(".esj-download-trigger");
      btns.forEach((b) => b.disabled = locked);
    }
    function createCommonHeader(title, onClose, onMinimize) {
      const btnGroup = [];
      if (onMinimize) {
        const btnMin = el("button", {
          title: "\u6700\u5C0F\u5316",
          style: "border:none;background:#81d4fa;color:#000;padding:2px 10px;border-radius:4px;cursor:pointer;font-weight:bold;line-height:1.2;margin-right:5px;",
          onclick: onMinimize
        }, ["_"]);
        btnGroup.push(btnMin);
      }
      const btnClose = el("button", {
        title: "\u5173\u95ED",
        style: "border:none;background:#ef5350;color:#fff;padding:4px 10px;border-radius:6px;cursor:pointer;font-weight:bold;",
        onclick: onClose
      }, ["\u2715"]);
      btnGroup.push(btnClose);
      return el("div", {
        className: "esj-common-header",
        style: "padding:10px;background:#2b9bd7;color:#fff;display:flex;justify-content:space-between;align-items:center;cursor:move;border-radius:8px 8px 0 0;"
      }, [
        el("span", { style: "font-weight:bold;" }, [title]),
        el("div", { style: "display:flex;" }, btnGroup)
      ]);
    }
    function createDownloadPopup() {
      fullCleanup(state.originalTitle);
      toggleSettingsLock(true);
      function onCancel() {
        setAbortFlag(true);
        const btn = document.querySelector("#esj-cancel");
        if (btn) {
          btn.disabled = true;
          btn.textContent = "\u6B63\u5728\u4FDD\u5B58...";
          btn.style.backgroundColor = "#999";
        }
        log("\u{1F6D1} \u6B63\u5728\u505C\u6B62\u4EFB\u52A1\uFF0C\u8BF7\u7A0D\u5019...");
      }
      function onClose() {
        setAbortFlag(true);
        fullCleanup(state.originalTitle);
      }
      function onMinimize() {
        const popup2 = document.querySelector("#esj-popup");
        if (popup2) popup2.style.display = "none";
        const headerTitle = popup2?.querySelector(".esj-common-header span")?.textContent || "";
        const statusText = headerTitle.replace(/^📘\s*/, "").trim() || "\u4E0B\u8F7D\u4E2D...";
        createMinimizedTray(statusText);
      }
      const header = createCommonHeader("\u{1F4D8} \u5168\u672C\u4E0B\u8F7D\u4EFB\u52A1", onClose, onMinimize);
      const span = header.querySelector("span");
      if (span) span.id = "esj-title";
      const progressBar = el("div", { id: "esj-progress", style: "width:0%;height:100%;background:#2b9bd7;transition:width .2s;" });
      const logBox = el("div", {
        id: "esj-log",
        style: "flex:1;margin:12px;background:#fafafa;border:1px solid #e6e6e6;padding:8px;border-radius:6px;overflow:auto;font-family:Consolas,monospace;font-size:13px;white-space:pre-wrap;"
      });
      const btnCancel = el("button", {
        id: "esj-cancel",
        style: "padding:8px 12px;background:#d9534f;color:#fff;border:none;border-radius:6px;cursor:pointer;",
        onclick: onCancel
      }, ["\u53D6\u6D88\u4EFB\u52A1"]);
      const popup = el("div", {
        id: "esj-popup",
        style: "position: fixed; top: 18%; left: 50%; transform: translateX(-50%); width: 520px; height: 460px; background: #fff; border-radius: 8px; border: 1px solid #aaa; box-shadow: 0 0 18px rgba(0,0,0,0.28); z-index: 999999; display:flex;flex-direction:column;"
      }, [
        header,
        el("div", { style: "padding:12px;" }, [
          el("div", { style: "font-size:13px;margin-bottom:8px;" }, ["\u8FDB\u5EA6\uFF1A"]),
          el("div", { style: "width:100%;height:14px;background:#eee;border-radius:8px;overflow:hidden;" }, [progressBar])
        ]),
        logBox,
        el("div", { style: "padding:10px;display:flex;gap:8px;justify-content:flex-end;" }, [btnCancel])
      ]);
      document.body.appendChild(popup);
      enableDrag(popup, ".esj-common-header");
      return popup;
    }
    function createConfirmPopup(onOk, onCancel) {
      fullCleanup(state.originalTitle);
      toggleSettingsLock(true);
      const cachedCount = state.globalChaptersMap.size;
      const hintText = cachedCount > 0 ? `\u68C0\u6D4B\u5230\u5DF2\u6709 ${cachedCount} \u7AE0\u7F13\u5B58\uFF0C\u70B9\u51FB\u786E\u5B9A\u5C06\u8DF3\u8FC7\u5DF2\u4E0B\u8F7D\u7AE0\u8282\u7EE7\u7EED\u4E0B\u8F7D\u3002` : "\u662F\u5426\u5F00\u59CB\u6293\u53D6\u8BE5\u5C0F\u8BF4\u5168\u90E8\u7AE0\u8282\uFF1F";
      const closeAction = () => {
        document.querySelector("#esj-confirm")?.remove();
        toggleSettingsLock(false);
        if (onCancel) onCancel();
      };
      const header = createCommonHeader("\u2714\uFE0F \u786E\u8BA4\u4E0B\u8F7D", closeAction);
      const body = el("div", { style: "padding:16px;font-size:14px;" }, [hintText]);
      const btnCancel = el("button", {
        id: "esj-confirm-cancel",
        style: "padding:8px 12px;background:#eee;border:1px solid #ccc;border-radius:6px;cursor:pointer;",
        onclick: () => {
          popup.remove();
          if (onCancel) {
            toggleSettingsLock(false);
            onCancel();
          }
        }
      }, ["\u53D6\u6D88"]);
      const btnOk = el("button", {
        id: "esj-confirm-ok",
        style: "padding:8px 12px;background:#2b9bd7;color:#fff;border:none;border-radius:6px;cursor:pointer;",
        onclick: () => {
          popup.remove();
          onOk();
        }
      }, ["\u786E\u5B9A"]);
      const footer = el("div", {
        style: "padding:12px;display:flex;justify-content:flex-end;gap:8px;"
      }, [btnCancel, btnOk]);
      const popup = el("div", {
        id: "esj-confirm",
        style: "position: fixed; top: 30%; left: 50%; transform: translateX(-50%); width: 380px; background:#fff;border:1px solid #aaa;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:999999;padding:0;display:flex;flex-direction:column;"
      }, [header, body, footer]);
      document.body.appendChild(popup);
      enableDrag(popup, ".esj-common-header");
    }
    function showFormatChoice() {
      if (!state.cachedData) {
        alert("\u6682\u65E0\u6570\u636E");
        return;
      }
      fullCleanup();
      toggleSettingsLock(true);
      toggleDownloadLock(true);
      const data = state.cachedData;
      const closeAction = () => {
        document.querySelector("#esj-format")?.remove();
        toggleSettingsLock(false);
        toggleDownloadLock(false);
      };
      const header = createCommonHeader("\u{1F4BE} \u5BFC\u51FA\u9009\u9879", closeAction);
      const coverStatus = data.metadata.coverBlob ? el("div", { style: "color:green;font-size:12px;margin-top:4px;" }, ["\u2714  \u5C01\u9762\u5DF2\u5305\u542B\u5728 epub \u6587\u4EF6\u4E2D"]) : el("div", { style: "color:red;font-size:12px;margin-top:4px;" }, ["\u2716  \u65E0\u5C01\u9762"]);
      let imageStatus = "";
      const isImageDownloadEnabled = getImageDownloadSetting();
      if (isImageDownloadEnabled) {
        let successCount = 0;
        let failCount = 0;
        data.chapters.forEach((chap) => {
          if (chap.images) successCount += chap.images.length;
          if (chap.imageErrors) failCount += chap.imageErrors;
        });
        const totalCount = successCount + failCount;
        if (totalCount > 0) {
          const color = failCount > 0 ? "#e6a23c" : "#2b9bd7";
          const errorHint = failCount > 0 ? ` (\u5931\u8D25 ${failCount} \u5F20\uFF0C\u539F\u56E0\u89C1 F12)` : "";
          imageStatus = el(
            "div",
            { style: `color:${color}; font-size:12px; margin-top:4px;` },
            [`\u{1F5BC}\uFE0F \u6B63\u6587\u63D2\u56FE: ${successCount} / ${totalCount} \u5F20${errorHint}`]
          );
        } else {
          imageStatus = el(
            "div",
            { style: "color:#999; font-size:12px; margin-top:4px;" },
            ["\u{1F5BC}\uFE0F \u6B63\u6587\u63D2\u56FE: \u672A\u68C0\u6D4B\u5230\u56FE\u7247"]
          );
        }
      }
      const infoBody = el("div", { style: "padding:20px;font-size:14px;line-height:1.5;" }, [
        el("div", {}, [`\u300A${data.metadata.title}\u300B\u5185\u5BB9\u5DF2\u5C31\u7EEA\u3002`]),
        el("div", { style: "color:#666;font-size:12px;margin-top:4px;" }, [`\u5171 ${data.chapters.length} \u7AE0`]),
        coverStatus,
        imageStatus
      ]);
      const btnTxt = el("button", {
        id: "esj-txt",
        style: "flex:1;padding:10px 0;border:1px solid #ccc;background:#f0f0f0;border-radius:6px;cursor:pointer;font-weight:bold;color:#333;",
        onclick: () => {
          const filename = (data.metadata.title || "book") + ".txt";
          const blob = new Blob([data.txt], { type: "text/plain;charset=utf-8" });
          triggerDownload(blob, filename);
        }
      }, ["\u2B07 TXT \u4E0B\u8F7D"]);
      const btnEpub = el("button", {
        id: "esj-epub",
        style: "flex:1;padding:10px 0;border:none;background:#2b9bd7;color:#fff;border-radius:6px;cursor:pointer;font-weight:bold;",
        onclick: async () => handleEpubDownload(btnEpub)
      }, ["\u2B07 EPUB \u4E0B\u8F7D"]);
      const footer = el("div", {
        style: "display:flex;gap:15px;justify-content:center;padding:0 20px 20px 20px;"
      }, [btnTxt, btnEpub]);
      const popup = el("div", {
        id: "esj-format",
        style: "position:fixed;top:30%;left:50%;transform:translateX(-50%);width:420px;background:#fff;border:1px solid #aaa;border-radius:8px;box-shadow:0 0 18px rgba(0,0,0,.28);z-index:999999;padding:0;display:flex;flex-direction:column;"
      }, [header, infoBody, footer]);
      document.body.appendChild(popup);
      enableDrag(popup, ".esj-common-header");
      async function handleEpubDownload(btn) {
        const currentData = state.cachedData;
        if (currentData.epubBlob) {
          const filename = (currentData.metadata.title || "book") + ".epub";
          triggerDownload(currentData.epubBlob, filename);
          return;
        }
        const originalText = btn.innerText;
        const originalBg = btn.style.background;
        const oldTitle = document.title;
        try {
          btn.innerText = "\u751F\u6210\u4E2D...";
          btn.disabled = true;
          btn.style.background = "#7ab8d6";
          const oldTitle2 = document.title;
          document.title = "[\u751F\u6210 EPUB] " + oldTitle2;
          const blob = await buildEpub(currentData.chapters, currentData.metadata);
          currentData.epubBlob = blob;
          const filename = (currentData.metadata.title || "book") + ".epub";
          triggerDownload(blob, filename);
        } catch (e) {
          console.error(e);
          alert("EPUB \u751F\u6210\u5931\u8D25: " + e.message);
        } finally {
          btn.innerText = originalText;
          btn.disabled = false;
          btn.style.background = originalBg;
          document.title = oldTitle;
        }
      }
    }
    function createSettingsPanel() {
      fullCleanup();
      toggleSettingsLock(true);
      const closeAction = () => {
        document.querySelector("#esj-settings")?.remove();
        toggleSettingsLock(false);
      };
      const header = createCommonHeader("\u2699\uFE0F \u811A\u672C\u8BBE\u7F6E", closeAction);
      const currentConcurrency = getConcurrency();
      const inputConcurrency = el("input", {
        type: "number",
        min: 1,
        max: 10,
        value: currentConcurrency,
        style: "width: 60px; padding: 6px; border: 1px solid #ccc; border-radius: 4px; text-align: center;",
        oninput: (e) => {
          const target = e.target;
          if (target.value === "") return;
          let val = parseInt(target.value, 10);
          if (isNaN(val)) return;
          if (val > 10) {
            val = 10;
            target.value = "10";
          } else if (val < 1) {
            val = 1;
            target.value = "1";
          }
          setConcurrency(val);
        },
        onblur: (e) => {
          const target = e.target;
          let val = parseInt(target.value, 10);
          if (isNaN(val) || target.value === "") {
            target.value = currentConcurrency.toString();
            setConcurrency(currentConcurrency);
          }
        }
      });
      let confirmTimer;
      let isConfirming = false;
      const btnClear = el("button", {
        className: "btn btn-danger btn-sm",
        style: "color: white; min-width: 110px; transition: all 0.2s;",
        onclick: async (e) => {
          const btn = e.target;
          if (!isConfirming) {
            isConfirming = true;
            btn.textContent = "\u786E\u5B9A\u5220\u9664?";
            confirmTimer = window.setTimeout(() => {
              isConfirming = false;
              btn.textContent = "\u6E05\u7A7A\u7F13\u5B58";
            }, 3e3);
            return;
          }
          clearTimeout(confirmTimer);
          isConfirming = false;
          btn.disabled = true;
          btn.textContent = "\u6E05\u7406\u4E2D...";
          try {
            await clearAllCaches();
            btn.classList.remove("btn-danger");
            btn.classList.add("btn-success");
            btn.style.backgroundColor = "#28a745";
            btn.textContent = "\u5DF2\u6E05\u7406";
          } catch (err) {
            btn.textContent = "\u274C \u5931\u8D25";
            console.error(err);
          } finally {
            setTimeout(() => {
              btn.disabled = false;
              btn.classList.remove("btn-success");
              btn.classList.add("btn-danger");
              btn.style.backgroundColor = "";
              btn.textContent = "\u6E05\u7A7A\u7F13\u5B58";
            }, 2e3);
          }
        }
      }, [" \u6E05\u7A7A\u7F13\u5B58"]);
      const isImageEnabled = getImageDownloadSetting();
      const checkboxInput = el("input", {
        type: "checkbox",
        checked: isImageEnabled,
        onchange: async (e) => {
          const checked = e.target.checked;
          setImageDownloadSetting(checked);
          await clearAllCaches();
          log(`\u6B63\u6587\u56FE\u7247\u4E0B\u8F7D\u5DF2${checked ? "\u5F00\u542F" : "\u5173\u95ED"}`);
        }
      });
      const switchToggleImage = el("label", { className: "esj-switch" }, [
        checkboxInput,
        el("span", { className: "esj-slider" })
      ]);
      log(`\u521D\u59CB\u5316\u53C2\u6570\uFF1A\u5E76\u53D1\u6570=${currentConcurrency}\uFF0C\u56FE\u7247\u4E0B\u8F7D=${isImageEnabled}`);
      const createDivider = () => el("hr", { style: "margin: 15px 0; border: 0; border-top: 1px solid #eee;" });
      const rowStyle = "display:flex; align-items:center; justify-content:space-between;";
      const rowConcurrency = el("div", { style: rowStyle }, [
        el("label", { style: "color: #333;" }, ["\u4E0B\u8F7D\u7EBF\u7A0B\u6570 (1-10):"]),
        inputConcurrency
      ]);
      const rowCache = el("div", { style: rowStyle }, [
        el("label", { style: "color: #333;" }, ["\u4E0B\u8F7D\u7F13\u5B58:"]),
        btnClear
      ]);
      const rowImage = el("div", { style: rowStyle }, [
        el("div", {}, [
          el("label", { style: "color: #333;" }, ["\u4E0B\u8F7D\u6B63\u6587\u63D2\u56FE: "]),
          el("div", { style: "font-size:12px; color:#999; margin-top: 2px;" }, ["(\u5728epub\u4E2D\u63D2\u5165\uFF0C\u4F1A\u8BA9\u901F\u5EA6\u53D8\u6162\uFF0C\u4F53\u79EF\u53D8\u5927)"])
        ]),
        switchToggleImage
      ]);
      const body = el("div", { style: "padding: 25px 20px; font-size: 14px;" }, [
        rowConcurrency,
        createDivider(),
        rowImage,
        createDivider(),
        rowCache
      ]);
      const popup = el("div", {
        id: "esj-settings",
        style: "position:fixed;top:30%;left:50%;transform:translateX(-50%);width:320px;background:#fff;border:1px solid #ccc;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:999999;display:flex;flex-direction:column;"
      }, [
        header,
        body
      ]);
      document.body.appendChild(popup);
      enableDrag(popup, ".esj-common-header");
    }

    function parseBookMetadata(doc, pageUrl) {
      let bookName = "\u672A\u547D\u540D\u5C0F\u8BF4";
      const titleEl = doc.querySelector(".book-detail h2.text-normal");
      if (titleEl) {
        bookName = titleEl.textContent?.trim() || bookName;
      } else {
        bookName = doc.title.split(" - ")[0].trim();
      }
      const symbolMap = { "\\": "-", "/": "- ", ":": "\uFF1A", "*": "\u2606", "?": "\uFF1F", '"': " ", "<": "\u300A", ">": "\u300B", "|": "-", ".": "\u3002", "	": " ", "\n": " " };
      const safeBookName = bookName.split("").map((c) => symbolMap[c] || c).join("");
      let author = "\u672A\u77E5\u4F5C\u8005";
      let infoBlock = "";
      const infoUl = doc.querySelector(".book-detail ul.book-detail");
      if (infoUl) {
        const listItems = Array.from(infoUl.querySelectorAll("li"));
        listItems.forEach((li) => {
          if (li.classList.contains("hidden-md-up") || li.querySelector(".rating-stars")) {
            return;
          }
          let text = li.innerText.replace(/[ \t]+/g, " ").trim();
          if (!text) return;
          if (text.includes("\u4F5C\u8005")) {
            const authorLink = li.querySelector("a");
            author = authorLink ? authorLink.innerText.trim() : text.replace(/作者[:：]/g, "").trim();
          }
          infoBlock += text + "\n";
        });
        infoBlock += "\n";
      }
      const imgNode = doc.querySelector(".product-gallery img");
      let coverUrl = void 0;
      if (imgNode) {
        const rawSrc = imgNode.getAttribute("src");
        if (rawSrc) {
          coverUrl = rawSrc.startsWith("http") ? rawSrc : `${location.origin}${rawSrc}`;
        }
      }
      let descText = "";
      const descContainer = doc.querySelector("#details .description");
      if (descContainer) {
        const clone = descContainer.cloneNode(true);
        const brs = clone.querySelectorAll("br");
        brs.forEach((br) => {
          br.replaceWith("\n");
        });
        const paragraphs = Array.from(descContainer.querySelectorAll("p"));
        if (paragraphs.length > 0) {
          descText = paragraphs.map((p) => p.textContent?.trim()).join("\n");
        } else {
          descText = descContainer.innerText;
        }
        descText = descText.replace(/(\n\s*){3,}/g, "\n\n").trim();
      }
      infoBlock = infoBlock.trim() + "\n";
      const fullIntro = `\u66F8\u540D: ${bookName}
URL: ${pageUrl}
${infoBlock}
${descText}

`;
      return {
        bookName: safeBookName,
        rawBookName: bookName,
        author,
        coverUrl,
        introTxt: fullIntro
      };
    }
    function parseChapterHtml(html, defaultTitle) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const h2 = doc.querySelector("h2")?.innerText || defaultTitle;
      const bookName = document.title.split(" - ")[0].trim();
      const author = doc.querySelector(".single-post-meta div")?.innerText.trim() || "";
      doc.querySelector(".forum-content")?.innerText || "";
      const contentEl = doc.querySelector(".forum-content");
      let contentHtml = contentEl ? contentEl.innerHTML : "";
      let contentText = contentEl ? contentEl.innerText : "";
      if (contentEl) {
        const safeTitle = h2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const titleRegex = new RegExp(`^\\s*${safeTitle}\\s*`, "i");
        contentText = contentText.replace(titleRegex, "").trim();
      }
      return {
        title: h2,
        author,
        contentHtml,
        contentText,
        bookName
      };
    }

    function getExtensionFromMime(mime) {
      switch (mime.toLowerCase()) {
        case "image/png":
          return "png";
        case "image/gif":
          return "gif";
        case "image/webp":
          return "webp";
        case "image/bmp":
          return "bmp";
        case "image/jpeg":
        case "image/jpg":
        default:
          return "jpg";
      }
    }
    async function compressImage(blob, quality = 0.7, maxWidth = 800) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          URL.revokeObjectURL(url);
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = maxWidth / width * height;
            width = maxWidth;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(blob);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else resolve(blob);
          }, "image/jpeg", quality);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(blob);
        };
        img.src = url;
      });
    }
    async function processHtmlImages(htmlContent, chapterIndex, signal) {
      const div = document.createElement("div");
      div.innerHTML = htmlContent;
      const imgs = Array.from(div.querySelectorAll("img"));
      const images = [];
      let failCount = 0;
      if (imgs.length > 0) {
        console.log(`\u5E8F\u5217 ${chapterIndex + 1}: \u53D1\u73B0 ${imgs.length} \u5F20\u56FE\u7247\uFF0C\u5F00\u59CB\u5904\u7406...`);
      }
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        let src = img.getAttribute("src");
        if (!src) continue;
        let downloadSuccess = false;
        let errorMsg = "\u672A\u77E5\u9519\u8BEF";
        try {
          if (src.startsWith("/")) {
            src = location.origin + src;
            img.setAttribute("src", src);
          } else if (!src.startsWith("http")) {
            src = new URL(src, location.href).href;
            img.setAttribute("src", src);
          }
        } catch (e) {
          console.warn(`\u975E\u6CD5 URL: ${src}`, e);
          errorMsg = "URL \u683C\u5F0F\u9519\u8BEF";
        }
        if (src.startsWith("http")) {
          const MAX_RETRIES = 3;
          for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            if (signal?.aborted) break;
            try {
              const response = await fetchWithTimeout(src, {
                method: "GET",
                referrerPolicy: "no-referrer",
                credentials: "omit"
              }, 1e3, signal);
              let blob = await response.blob();
              let mimeType = blob.type;
              let extension = getExtensionFromMime(mimeType);
              if (blob.size > 100 * 1024) {
                const compressedBlob = await compressImage(blob);
                if (compressedBlob !== blob) {
                  blob = compressedBlob;
                  mimeType = "image/jpeg";
                  extension = "jpg";
                }
              }
              const imageFilename = `img_${chapterIndex}_${i}.${extension}`;
              images.push({
                id: imageFilename,
                blob,
                mediaType: mimeType
              });
              img.removeAttribute("src");
              img.setAttribute("data-epub-src", imageFilename);
              img.removeAttribute("srcset");
              img.removeAttribute("loading");
              img.style.maxWidth = "100%";
              downloadSuccess = true;
              break;
            } catch (e) {
              if (e.message === "User Aborted" || signal?.aborted) {
                break;
              }
              errorMsg = e.message;
              if (attempt < MAX_RETRIES) {
                console.warn(`\u26A0\uFE0F \u56FE\u7247\u4E0B\u8F7D\u6CE2\u52A8\uFF0C\u91CD\u8BD5 (${attempt}/${MAX_RETRIES}): ${src}`);
                await sleepWithAbort(1500, signal);
              }
            }
          }
        }
        if (!downloadSuccess && !signal?.aborted) {
          failCount++;
          log(`\u274C [\u63D2\u56FE\u83B7\u53D6\u5931\u8D25] \u5E8F\u5217${chapterIndex + 1}: ${src} 
\u5931\u8D25\u539F\u56E0\uFF1A ${errorMsg}`);
          img.removeAttribute("srcset");
          img.removeAttribute("loading");
          img.style.maxWidth = "100%";
          const originalAlt = img.getAttribute("alt") || "";
          img.setAttribute("alt", `${originalAlt} (\u56FE\u7247\u52A0\u8F7D\u5931\u8D25)`);
        }
      }
      let finalHtml = div.innerHTML;
      finalHtml = finalHtml.replace(/data-epub-src="/g, 'src="');
      return {
        processedHtml: finalHtml,
        images,
        failCount
      };
    }

    async function fetchCoverImage(url) {
      try {
        log("\u542F\u52A8\u5C01\u9762\u4E0B\u8F7D...");
        const response = await fetchWithTimeout(url, {
          method: "GET",
          referrerPolicy: "no-referrer",
          credentials: "omit"
        }, 15e3);
        const blob = await response.blob();
        if (blob.size < 1e3) {
          log("\u26A0 \u5C01\u9762\u6587\u4EF6\u8FC7\u5C0F\uFF0C\u5DF2\u5FFD\u7565");
          return null;
        }
        let ext = "jpg";
        if (blob.type.includes("png")) ext = "png";
        else if (blob.type.includes("jpeg") || blob.type.includes("jpg")) ext = "jpg";
        log("\u2714 \u5C01\u9762\u4E0B\u8F7D\u5B8C\u6210");
        return { blob, ext };
      } catch (e) {
        log(`\u26A0 \u5C01\u9762\u4E0B\u8F7D\u8DF3\u8FC7: ${e.message}`);
        return null;
      }
    }
    async function downloadChapterHtml(url, title) {
      const MAX_RETRIES = 3;
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        if (state.abortFlag) return null;
        try {
          const res = await fetchWithTimeout(url, { credentials: "include" }, 15e3);
          return await res.text();
        } catch (e) {
          if (e.name === "AbortError" || state.abortFlag) return null;
          if (attempt === MAX_RETRIES) {
            log(`\u274C \u7AE0\u8282\u83B7\u53D6\u5931\u8D25 (${title}): ${e.message}`);
          } else {
            await sleepWithAbort(300 * attempt);
          }
        }
      }
      return null;
    }
    async function handleChapterContent(html, task, ctx) {
      const { index, title } = task;
      const { options, enableImage } = ctx;
      const result = parseChapterHtml(html, title);
      let finalHtml = result.contentHtml;
      let chapterImages = [];
      let imageErrors = 0;
      if (enableImage) {
        try {
          const processed = await processHtmlImages(
            result.contentHtml,
            index,
            state.abortController?.signal
          );
          finalHtml = processed.processedHtml;
          chapterImages = processed.images;
          imageErrors = processed.failCount;
        } catch (e) {
          const imgMatches = result.contentHtml.match(/<img\s/gi);
          imageErrors = imgMatches ? imgMatches.length : 0;
          log(`\u26A0\uFE0F \u56FE\u7247\u5904\u7406\u5F02\u5E38\uFF0C\u8DF3\u8FC7 ${imageErrors} \u5F20\u56FE\u7247\u3002\u7B2C ${index + 1} \u7AE0 \u6807\u9898\uFF1A${title}`);
        }
      } else {
        finalHtml = removeImgTags(result.contentHtml);
      }
      state.globalChaptersMap.set(index, {
        title: result.title,
        content: finalHtml,
        txtSegment: `${result.title}

${result.author}

${result.contentText}

`,
        images: chapterImages,
        imageErrors
      });
    }
    async function processChapterTask(task, ctx, isRetry = false) {
      if (state.abortFlag) return;
      const { index, url, title } = task;
      const { total, options } = ctx;
      if (!isRetry && state.globalChaptersMap.has(index)) {
        ctx.runtime.completedCount++;
        ctx.updateProgress();
        return;
      }
      const isValidChapter = /\/forum\/\d+\/\d+\.html/.test(url) && url.includes("esjzone");
      if (!isValidChapter) {
        const msg = `${url} {\u975E\u7AD9\u5167\u94FE\u63A5}`;
        state.globalChaptersMap.set(index, {
          title,
          content: msg,
          txtSegment: `${title}
${msg}

`
        });
        ctx.runtime.completedCount++;
        ctx.updateProgress();
        if (!state.abortFlag && ctx.runtime.completedCount % 5 === 0) {
          saveBookCache(options.bookId, state.globalChaptersMap);
        }
        log(`\u26A0\uFE0F \u8DF3\u8FC7 (${ctx.runtime.completedCount}/${total})\uFF1A${title} (\u975E\u7AD9\u5185)`);
        await sleepWithAbort(100);
        return;
      }
      const html = await downloadChapterHtml(url, title);
      if (!html || state.abortFlag) return;
      await handleChapterContent(html, task, ctx);
      if (!isRetry) {
        ctx.runtime.completedCount++;
        ctx.updateProgress();
      }
      if (!state.abortFlag) {
        if (isRetry) {
          saveBookCache(options.bookId, state.globalChaptersMap);
        } else {
          if (ctx.runtime.completedCount % 5 === 0) {
            saveBookCache(options.bookId, state.globalChaptersMap);
          }
        }
      }
      const chapter = state.globalChaptersMap.get(index);
      const imageErrors = chapter?.imageErrors || 0;
      const imageCount = chapter?.images?.length || 0;
      const prefix = isRetry ? "\u267B\uFE0F \u8865\u6293" : "\u2714 \u6293\u53D6";
      if (imageErrors > 0) {
        log(`${prefix} (${ctx.runtime.completedCount}/${total})\uFF1A${title} (${imageErrors}/${imageCount + imageErrors} \u5F20\u56FE\u7247\u83B7\u53D6\u5931\u8D25)
URL: ${url}`);
      } else if (imageCount > 0) {
        log(`${prefix} (${ctx.runtime.completedCount}/${total})\uFF1A${title} (${imageCount} \u5F20\u56FE\u7247)
URL: ${url}`);
      } else {
        log(`${prefix} (${ctx.runtime.completedCount}/${total})\uFF1A${title}
URL: ${url}`);
      }
      if (!state.abortFlag) {
        const delay = Math.floor(Math.random() * 100) + 100;
        await sleepWithAbort(delay);
      }
    }
    async function checkIntegrityAndRetry(tasks, ctx) {
      const { total, options, enableImage } = ctx;
      log("\u6B63\u5728\u8FDB\u884C\u7AE0\u8282\u5B8C\u6574\u6027\u68C0\u67E5...");
      const missingTasks = tasks.filter((t) => {
        const chap = state.globalChaptersMap.get(t.index);
        if (!chap) return true;
        if (enableImage && chap.imageErrors && chap.imageErrors > 0) return true;
        return false;
      });
      if (missingTasks.length > 0) {
        log(`\u26A0 \u53D1\u73B0 ${missingTasks.length} \u4E2A\u7AE0\u8282\u4E0D\u5B8C\u6574 (\u7F3A\u5931\u6216\u542B\u5931\u8D25\u56FE\u7247)\uFF0C\u5C1D\u8BD5\u81EA\u52A8\u8865\u6293...`);
        for (const task of missingTasks) {
          if (state.abortFlag) {
            await saveBookCache(options.bookId, state.globalChaptersMap);
            fullCleanup(state.originalTitle);
            break;
          }
          const chap = state.globalChaptersMap.get(task.index);
          const reason = !chap ? "\u7F3A\u5931" : `\u56FE\u7247\u5931\u8D25 ${chap.imageErrors} \u5F20`;
          log(`\u8865\u6293 [${task.index + 1}/${total}] (${reason})...`);
          await processChapterTask(task, ctx, true);
          await sleepWithAbort(300);
        }
      } else {
        log("\u2705 \u5B8C\u6574\u6027\u68C0\u67E5\u901A\u8FC7\uFF0C\u65E0\u7F3A\u6F0F\u3002");
      }
    }
    async function batchDownload(options) {
      const { bookId, bookName, author, introTxt, coverUrl, tasks } = options;
      const total = tasks.length;
      let popup = document.querySelector("#esj-popup");
      if (!popup) popup = createDownloadPopup();
      const progressEl = document.querySelector("#esj-progress");
      const titleEl = document.querySelector("#esj-title");
      setAbortFlag(false);
      resetAbortController();
      let cachedCount = 0;
      const cacheResult = await loadBookCache(bookId);
      if (cacheResult.map) {
        state.globalChaptersMap = cacheResult.map;
        cachedCount = cacheResult.size;
      }
      if (cachedCount > 0) {
        log(`\u{1F4BE} \u5DF2\u4ECE IndexedDB \u6062\u590D ${cachedCount} \u7AE0\u7F13\u5B58`);
      }
      const coverTaskPromise = coverUrl ? fetchCoverImage(coverUrl) : Promise.resolve(null);
      const ctx = {
        options,
        total,
        enableImage: getImageDownloadSetting(),
        ui: { progressEl, titleEl },
        runtime: { completedCount: 0 },
        updateProgress: () => {
          if (state.abortFlag) return;
          const count = ctx.runtime.completedCount;
          const statusStr = `\u5168\u672C\u4E0B\u8F7D\uFF08${count}/${total}\uFF09`;
          if (titleEl) titleEl.textContent = "\u{1F4D8} " + statusStr;
          document.title = `[${count}/${total}] ${state.originalTitle}`;
          updateTrayText(statusStr);
          if (progressEl) progressEl.style.width = count / total * 100 + "%";
        }
      };
      const concurrency = getConcurrency();
      const queue = [...tasks];
      async function worker() {
        while (queue.length > 0 && !state.abortFlag) {
          const task = queue.shift();
          if (task) await processChapterTask(task, ctx, false);
        }
      }
      log(`\u542F\u52A8 ${concurrency} \u4E2A\u5E76\u53D1\u7EBF\u7A0B...`);
      const workers = Array(concurrency).fill(0).map(() => worker());
      await Promise.all(workers);
      if (state.abortFlag) {
        log("\u6B63\u5728\u5199\u5165 IndexedDB...");
        await saveBookCache(bookId, state.globalChaptersMap);
        log("\u4EFB\u52A1\u5DF2\u624B\u52A8\u53D6\u6D88\uFF0C\u8FDB\u5EA6\u5DF2\u4FDD\u5B58\u3002");
        await sleep(800);
        document.title = state.originalTitle;
        fullCleanup(state.originalTitle);
        return;
      }
      await checkIntegrityAndRetry(tasks, ctx);
      const coverResult = await coverTaskPromise;
      log("\u2705 \u6240\u6709\u4EFB\u52A1\u5904\u7406\u5B8C\u6BD5");
      document.title = state.originalTitle;
      let finalTxt = introTxt;
      const chaptersArr = [];
      for (let i = 0; i < total; i++) {
        const item = state.globalChaptersMap.get(i);
        if (item) {
          finalTxt += item.txtSegment;
          chaptersArr.push(item);
        } else {
          finalTxt += `\u7B2C ${i + 1} \u7AE0 \u83B7\u53D6\u5931\u8D25

`;
          chaptersArr.push({ title: `\u7B2C ${i + 1} \u7AE0 (\u7F3A\u5931)`, content: "\u5185\u5BB9\u6293\u53D6\u5931\u8D25\u3002", txtSegment: "" });
        }
      }
      setCachedData({
        txt: finalTxt,
        chapters: chaptersArr,
        metadata: {
          title: bookName,
          author: author || "\u672A\u77E5\u4F5C\u8005",
          coverBlob: coverResult?.blob || null,
          coverExt: coverResult?.ext || "jpg"
        },
        epubBlob: null
      });
      clearBookCache(bookId);
      fullCleanup(state.originalTitle);
      showFormatChoice();
    }

    function getBookId() {
      const match = location.href.match(/\/detail\/(\d+)/);
      return match ? match[1] : "unknown";
    }
    async function scrapeDetail() {
      setAbortFlag(false);
      resetAbortController();
      state.originalTitle = document.title;
      const bookId = getBookId();
      if (bookId !== "unknown") {
        const cacheResult = await loadBookCache(bookId);
        if (cacheResult.map) {
          state.globalChaptersMap = cacheResult.map;
        }
      }
      return new Promise((resolveMain) => {
        createConfirmPopup(async () => {
          try {
            const chaptersNodes = Array.from(document.querySelectorAll("#chapterList a"));
            if (chaptersNodes.length === 0) {
              alert("\u672A\u627E\u5230\u7AE0\u8282\u5217\u8868 #chapterList");
              fullCleanup(state.originalTitle);
              return resolveMain();
            }
            const tasks = chaptersNodes.map((node, index) => ({
              index,
              url: node.href,
              title: (node.getAttribute("data-title") || node.innerText || "").trim()
            }));
            const meta = parseBookMetadata(document, location.href);
            const imgNode = document.querySelector(".product-gallery img");
            const coverUrl = imgNode ? imgNode.src : void 0;
            if (state.abortFlag) {
              log("\u7528\u6237\u53D6\u6D88\uFF0C\u8DF3\u8FC7\u4E0B\u8F7D");
              return;
            }
            await batchDownload({
              bookId: getBookId(),
              bookName: meta.bookName,
              author: meta.author,
              introTxt: meta.introTxt,
              coverUrl: meta.coverUrl,
              tasks
            });
          } catch (e) {
            console.error(e);
            log("\u274C \u6293\u53D6\u6D41\u7A0B\u5F02\u5E38: " + e.message);
          } finally {
            return resolveMain();
          }
        }, () => {
          log("\u7528\u6237\u53D6\u6D88\u786E\u8BA4");
          return resolveMain();
        });
      });
    }

    function createSettingButton(customClass = "") {
      return el("button", {
        className: `btn btn-primary esj-settings-trigger ${customClass}`,
        style: "color: white; cursor: pointer;",
        onclick: (e) => {
          e.preventDefault();
          if (e.target.disabled) return;
          if (document.querySelector("#esj-popup") || document.querySelector("#esj-min-tray")) {
            return;
          }
          createSettingsPanel();
        }
      }, [
        el("i", { className: "icon-settings" })
      ]);
    }
    function createDownloadButton(id, text = "\u5168\u672C\u4E0B\u8F7D", scrapeFn, customClass = "") {
      const btn = el("button", {
        id,
        className: `btn btn-info esj-download-trigger ${customClass}`,
        style: "color: white; cursor: pointer;",
        onclick: async () => {
          const runningPopup = document.querySelector("#esj-popup");
          if (runningPopup) {
            runningPopup.style.display = "flex";
            document.querySelector("#esj-min-tray")?.remove();
            return;
          }
          if (document.querySelector("#esj-confirm") || document.querySelector("#esj-format")) {
            return;
          }
          if (state.cachedData) {
            showFormatChoice();
            return;
          }
          if (btn.disabled) return;
          const originalHtml = btn.innerHTML;
          btn.disabled = true;
          btn.innerHTML = '<i class="icon-refresh fa-spin"></i> \u51C6\u5907\u4E2D...';
          try {
            await scrapeFn();
          } catch (err) {
            console.error("Scrape Error: " + err.message);
          } finally {
            if (!state.cachedData) {
              btn.disabled = false;
              btn.innerHTML = originalHtml;
            } else {
              btn.innerHTML = originalHtml;
            }
          }
        }
      }, [
        el("i", { className: "icon-download" }),
        " " + text
      ]);
      return btn;
    }

    function injectDetailButton() {
      const btnGroup = document.querySelector(".sp-buttons");
      if (!btnGroup) return;
      if (document.querySelector("#btn-download-book")) return;
      const downloadBtn = createDownloadButton(
        "btn-download-book",
        "\u5168\u672C\u4E0B\u8F7D",
        scrapeDetail,
        "m-b-10"
      );
      const settingBtn = createSettingButton("m-b-10");
      btnGroup.appendChild(downloadBtn);
      btnGroup.appendChild(settingBtn);
    }

    async function downloadCurrentPage() {
      try {
        log("\u5F00\u59CB\u6293\u53D6\u5F53\u524D\u5355\u7AE0...");
        const viewAllBtn = document.querySelector(".entry-navigation .view-all");
        let metaHeader = "";
        let bookNamePrefix = "";
        if (viewAllBtn && viewAllBtn.href) {
          try {
            log("\u6B63\u5728\u83B7\u53D6\u4E66\u7C4D\u4FE1\u606F...");
            const resp = await fetch(viewAllBtn.href);
            const html2 = await resp.text();
            const doc = new DOMParser().parseFromString(html2, "text/html");
            const meta = parseBookMetadata(doc, viewAllBtn.href);
            metaHeader = meta.introTxt + "====================================\n\n";
            bookNamePrefix = `[${meta.bookName}] `;
          } catch (e) {
            console.warn("\u4E66\u7C4D\u5143\u6570\u636E\u83B7\u53D6\u5931\u8D25\uFF0C\u4EC5\u4E0B\u8F7D\u6B63\u6587");
          }
        }
        const html = document.documentElement.outerHTML;
        const defaultTitle = document.title.split(" - ")[0] || "\u672A\u547D\u540D\u7AE0\u8282";
        const { title, author, contentText } = parseChapterHtml(html, defaultTitle);
        if (!contentText) {
          alert("\u672A\u627E\u5230\u6B63\u6587\u5185\u5BB9");
          return;
        }
        const finalTxt = `${metaHeader}${title}
${author}
\u672C\u7AE0URL: ${location.href}

${contentText}`;
        const blob = new Blob([finalTxt], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        const safeTitle = title.replace(/[\\/:*?"<>|]/g, "_").trim();
        a.download = `${bookNamePrefix}${safeTitle}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        log(`\u2714 \u5355\u7AE0\u4E0B\u8F7D\u5B8C\u6210`);
      } catch (e) {
        console.error(e);
        alert("\u4E0B\u8F7D\u51FA\u9519: " + e.message);
      }
    }

    function injectSinglePageButton() {
      const viewAllBtn = document.querySelector(".entry-navigation .view-all");
      if (!viewAllBtn || !viewAllBtn.parentElement) return;
      const container = viewAllBtn.parentElement;
      if (document.querySelector("#btn-download-single")) return;
      const btn = el("a", {
        id: "btn-download-single",
        className: "btn btn-outline-secondary view-all",
        style: "margin-left: 5px; cursor: pointer;",
        title: "\u4E0B\u8F7D\u672C\u7AE0 (TXT)",
        onclick: (e) => {
          e.preventDefault();
          downloadCurrentPage();
        }
      }, [
        el("i", { className: "icon-download" })
      ]);
      container.appendChild(btn);
    }

    async function scrapeForum() {
      setAbortFlag(false);
      resetAbortController();
      state.originalTitle = document.title;
      let bid = "";
      if (!bid) {
        const urlParts = location.pathname.split("/").filter((p) => p);
        for (let i = urlParts.length - 1; i >= 0; i--) {
          if (/^\d+$/.test(urlParts[i])) {
            bid = urlParts[i];
            break;
          }
        }
      }
      if (bid) {
        const cacheResult = await loadBookCache(bid);
        if (cacheResult.map) {
          state.globalChaptersMap = cacheResult.map;
        }
      }
      return new Promise((resolveMain) => {
        createConfirmPopup(async () => {
          createDownloadPopup();
          try {
            log("\u6B63\u5728\u5206\u6790\u8BBA\u575B\u9875\u9762...");
            if (!bid) {
              alert("\u65E0\u6CD5\u89E3\u6790\u7248\u5757 ID\uFF0C\u8BF7\u786E\u4FDD\u5F53\u524D\u662F\u6709\u6548\u7684\u4E66\u7C4D\u8BBA\u575B\u9875\u3002");
              return;
            }
            const detailUrl = `${location.origin}/detail/${bid}.html`;
            log(`\u6B63\u5728\u83B7\u53D6\u4E66\u7C4D\u8BE6\u60C5\u6570\u636E: ${detailUrl}`);
            let doc;
            try {
              const resp = await fetch(detailUrl, {
                signal: state.abortController?.signal
              });
              if (!resp.ok) throw new Error(`HTTP Error ${resp.status}`);
              const html = await resp.text();
              doc = new DOMParser().parseFromString(html, "text/html");
            } catch (e) {
              if (e.name === "AbortError" || e.message === "User Aborted") {
                fullCleanup(state.originalTitle);
                return;
              }
              console.error(e);
              alert("\u65E0\u6CD5\u83B7\u53D6\u4E66\u7C4D\u8BE6\u60C5\u9875\u6570\u636E\uFF01");
              return;
            }
            if (state.abortFlag) {
              fullCleanup(state.originalTitle);
              return;
            }
            const meta = parseBookMetadata(doc, detailUrl);
            log(`\u5143\u6570\u636E\u89E3\u6790\u6210\u529F: \u300A${meta.rawBookName}\u300B`);
            let tasks = [];
            const chapterLinks = Array.from(doc.querySelectorAll("#chapterList a"));
            if (chapterLinks.length > 0) {
              log(`\u53D1\u73B0 ${chapterLinks.length} \u4E2A\u7AE0\u8282\u3002`);
              tasks = chapterLinks.map((node, index) => ({
                index,
                url: node.href,
                title: (node.getAttribute("data-title") || node.innerText || "").trim()
              }));
            } else {
              alert("\u672A\u627E\u5230\u4EFB\u4F55\u7AE0\u8282\u94FE\u63A5\uFF01");
              return;
            }
            tasks.forEach((t) => {
              if (t.url.startsWith("/")) {
                t.url = location.origin + t.url;
              }
            });
            if (state.abortFlag) {
              fullCleanup(state.originalTitle);
              return;
            }
            await batchDownload({
              bookId: bid,
              bookName: meta.bookName,
              author: meta.author,
              introTxt: meta.introTxt,
              coverUrl: meta.coverUrl,
              tasks
            });
          } catch (e) {
            console.error(e);
            log("\u274C \u6293\u53D6\u6D41\u7A0B\u5F02\u5E38: " + e.message);
          } finally {
            return resolveMain();
          }
        }, () => {
          log("\u7528\u6237\u53D6\u6D88\u786E\u8BA4");
          return resolveMain();
        });
      });
    }

    function injectForumButton() {
      if (document.querySelector("#btn-download-forum")) return;
      let container = document.querySelector(".forum-list-page .column");
      if (!container) {
        const tableEl = document.querySelector(".table-responsive");
        if (tableEl && tableEl.parentElement) {
          container = el("div", { className: "column" });
          const wrapper = el("div", { className: "forum-list-page m-b-20" }, [
            container,
            el("div", { className: "column" })
          ]);
          tableEl.parentElement.insertBefore(wrapper, tableEl);
        }
      }
      if (!container) return;
      const downloadBtn = createDownloadButton(
        "btn-download-forum",
        "\u5168\u672C\u4E0B\u8F7D",
        scrapeForum,
        ""
      );
      const settingBtn = createSettingButton();
      container.appendChild(downloadBtn);
      container.appendChild(settingBtn);
    }

    const STYLES = `
    /* \u906E\u7F69\u4E0E\u5F39\u7A97\u57FA\u7840 */
    #esj-popup {
        position: fixed; top: 18%; left: 50%; transform: translateX(-50%);
        width: 520px; background: #fff; border-radius: 8px;
        border: 1px solid #aaa; box-shadow: 0 0 18px rgba(0,0,0,0.28);
        z-index: 999999; display: flex; flex-direction: column;
        font-family: sans-serif;
    }
    
    /* \u5934\u90E8 */
    #esj-header, #esj-confirm-header, #esj-format-header #esj-settings-header {
        padding: 10px; background: #2b9bd7; color: #fff;
        display: flex; justify-content: space-between; align-items: center;
        cursor: move; border-radius: 8px 8px 0 0;
    }

    /* \u6309\u94AE\u901A\u7528 */
    .btn { cursor: pointer; } 
    
    /* \u6700\u5C0F\u5316\u6258\u76D8 */
    #esj-min-tray {
        position: fixed; bottom: 20px; left: 20px;
        background: rgba(43, 155, 215, 0.9); color: #fff;
        padding: 10px 15px; border-radius: 25px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        cursor: pointer; z-index: 9999999; /* \u786E\u4FDD\u5C42\u7EA7\u591F\u9AD8 */
        font-size: 14px; font-weight: bold;
        display: flex; align-items: center; gap: 8px;
        transition: transform 0.2s;
    }
    #esj-min-tray:hover { transform: scale(1.05); }

    /* \u8FDB\u5EA6\u6761 */
    #esj-progress { width: 0%; height: 100%; background: #2b9bd7; transition: width .2s; }

    /* \u786E\u8BA4\u5F39\u7A97 & \u683C\u5F0F\u5F39\u7A97 */
    #esj-confirm, #esj-format {
        position: fixed; top: 30%; left: 50%; transform: translateX(-50%);
        width: 380px; background: #fff; border: 1px solid #aaa;
        border-radius: 8px; box-shadow: 0 0 18px rgba(0,0,0,0.28);
        z-index: 999999; display: flex; flex-direction: column;
    }
        
    #esj-format { 
        width: 420px; 
    }

    /* \u5F00\u5173\u6837\u5F0F (Toggle Switch) */
    .esj-switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
        vertical-align: middle;
    }

    .esj-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .esj-slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;
    }

    .esj-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    input:checked + .esj-slider {
        background-color: #2b9bd7; /* ESJ \u84DD\u8272 */
    }

    input:focus + .esj-slider {
        box-shadow: 0 0 1px #2b9bd7;
    }

    input:checked + .esj-slider:before {
        transform: translateX(20px);
    }

`;
    function injectStyles() {
      const styleEl = document.createElement("style");
      styleEl.textContent = STYLES;
      (document.head || document.documentElement).appendChild(styleEl);
    }

    (function init() {
      injectStyles();
      const url = location.href;
      const isDetailPage = url.includes("/detail/");
      const isForumPage = url.includes("/forum/") && !url.endsWith(".html");
      const isSinglePage = url.includes("/forum/") && url.endsWith(".html");
      const tryInject = () => {
        if (isDetailPage) {
          if (document.querySelector(".sp-buttons")) injectDetailButton();
        } else if (isSinglePage) {
          if (document.querySelector(".entry-navigation")) injectSinglePageButton();
        } else if (isForumPage) {
          if (document.querySelector(".forum-list-page")) injectForumButton();
        }
      };
      tryInject();
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node.nodeType === 1) {
              const el = node;
              if (isDetailPage) {
                if (el.classList && el.classList.contains("sp-buttons") || el.querySelector && el.querySelector(".sp-buttons")) {
                  injectDetailButton();
                  return;
                }
              } else if (isSinglePage) {
                if (el.classList && el.classList.contains("entry-navigation") || el.querySelector && el.querySelector(".entry-navigation")) {
                  injectSinglePageButton();
                  return;
                }
              } else if (isForumPage) {
                if (el.classList && el.classList.contains("forum-list-page") || el.querySelector && el.querySelector(".forum-list-page")) {
                  injectForumButton();
                  return;
                }
              }
            }
          }
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      const timer = setInterval(() => {
        if (isDetailPage) {
          if (document.querySelector(".sp-buttons") && !document.querySelector("#btn-download-book")) {
            injectDetailButton();
          }
        } else if (isSinglePage) {
          if (document.querySelector(".entry-navigation") && !document.querySelector("#btn-download-single")) {
            injectSinglePageButton();
          }
        } else if (isForumPage) {
          if (document.querySelector(".forum-list-page") && !document.querySelector("#btn-download-forum")) {
            injectForumButton();
          }
        }
      }, 1e3);
      setTimeout(() => {
        if (observer) observer.disconnect();
        if (timer) clearInterval(timer);
      }, 3e4);
    })();

})();
