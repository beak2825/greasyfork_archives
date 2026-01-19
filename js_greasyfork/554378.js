// ==UserScript==
// @name         Yahoo!ニュース 文章抽取脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  在Yahoo!ニュース的搜索结果页中，自动抓取每条新闻文章的完整内容，将包含搜索关键词的段落标红，并列出文章内的所有图片链接。此脚本仅在新闻搜索页面工作，不会影响其他页面。
// @icon         https://vitejs.dev/logo.svg
// @match        https://news.yahoo.co.jp/search*
// @connect      news.yahoo.co.jp
// @connect      *.yimg.jp
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554378/Yahoo%21%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%20%E6%96%87%E7%AB%A0%E6%8A%BD%E5%8F%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/554378/Yahoo%21%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%20%E6%96%87%E7%AB%A0%E6%8A%BD%E5%8F%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  const styleCss = ":root{--tm-bg: #fff;--tm-fg: #213547;--tm-muted: #6b7280;--tm-border: #e5e7eb;--tm-accent: #2563eb;--tm-accent-weak: #dbeafe;--tm-highlight: #dc2626;--tm-highlight-active: #fef08a;--tm-highlight-pulse: #fde047}@media(prefers-color-scheme:dark){:root{--tm-bg: #111827;--tm-fg: #e5e7eb;--tm-muted: #9ca3af;--tm-border: #1f2937;--tm-accent: #60a5fa;--tm-accent-weak: #0b1220;--tm-highlight: #f87171;--tm-highlight-active: #854d0e;--tm-highlight-pulse: #a16207}}.tm-card{margin:8px 0;background:var(--tm-bg);color:var(--tm-fg);border:1px solid var(--tm-border);border-radius:10px;box-shadow:0 1px 2px #0000000a}.tm-card__header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--tm-border)}.tm-card__title{font-size:14px;font-weight:600;line-height:1.4}.tm-card__actions{display:flex;gap:8px}.tm-btn{appearance:none;border:1px solid var(--tm-border);background:var(--tm-accent-weak);color:var(--tm-accent);padding:4px 10px;border-radius:6px;font-size:12px;cursor:pointer}.tm-btn:hover{filter:brightness(.95);transform:translateY(-1px)}.tm-btn:focus{outline:2px solid var(--tm-accent);outline-offset:2px}.tm-card__content{padding:10px 12px 8px;font-size:14px;line-height:1.6}.tm-card__content p{margin:0 0 6px}.tm-highlight{color:var(--tm-highlight);font-weight:700}.tm-highlight--active{background:var(--tm-highlight-active);border-radius:2px;animation:tm-pulse .5s ease-out}@keyframes tm-pulse{0%{background:var(--tm-highlight-pulse);transform:scale(1.1)}to{background:var(--tm-highlight-active);transform:scale(1)}}.tm-card__images{padding:0 12px 12px}.tm-image-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px}.tm-thumb{width:100%;height:120px;object-fit:cover;border:1px solid var(--tm-border);border-radius:6px;display:block}.tm-card[data-load-state=loading] .tm-card__content{opacity:.6}";
  importCSS(styleCss);
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const MIN_IMAGE_SIZE = 50;
  function getImageDimensionsSync(img, src) {
    const attrW = parseInt(img.getAttribute("width") || "", 10);
    const attrH = parseInt(img.getAttribute("height") || "", 10);
    if (attrW > 0 && attrH > 0) {
      return { w: attrW, h: attrH };
    }
    const srcset = img.getAttribute("srcset") || "";
    if (srcset) {
      const widths = srcset.match(/(\d+)w/g)?.map((w) => parseInt(w, 10)) || [];
      if (widths.length > 0) {
        const maxW = Math.max(...widths);
        return { w: maxW, h: maxW };
      }
    }
    const urlPatterns = [
      /[/_](\d{2,4})x(\d{2,4})(?:[_./]|$)/,
/[?&]w(?:idth)?=(\d+).*[?&]h(?:eight)?=(\d+)/i,
/[?&]h(?:eight)?=(\d+).*[?&]w(?:idth)?=(\d+)/i
];
    for (const pattern of urlPatterns) {
      const match = src.match(pattern);
      if (match) {
        const w = parseInt(match[1], 10);
        const h = parseInt(match[2], 10);
        if (w > 0 && h > 0) return { w, h };
      }
    }
    return null;
  }
  function parseParagraphs(doc) {
    let paraNodes = [];
    const articleElem = doc.querySelector("article");
    if (articleElem) paraNodes = Array.from(articleElem.querySelectorAll("p"));
    if (paraNodes.length === 0) paraNodes = Array.from(doc.querySelectorAll("p"));
    const texts = [];
    paraNodes.forEach((p) => {
      const text = (p.textContent ?? "").trim();
      if (text) texts.push(text);
    });
    return texts;
  }
  function parseImages(doc) {
    const images = [];
    let imgs = [];
    const articleElem = doc.querySelector("article");
    if (articleElem) imgs = Array.from(articleElem.querySelectorAll("img"));
    else imgs = Array.from(doc.querySelectorAll("img"));
    const base = doc.baseURI || window.location.href;
    imgs.forEach((img) => {
      let src = img.getAttribute("src") || img.getAttribute("data-src") || "";
      if (!src) return;
      const lowerSrc = src.toLowerCase();
      if (lowerSrc.includes("clear.gif") || lowerSrc.includes("boost_") || lowerSrc.includes("icon") || lowerSrc.includes("logo") || lowerSrc.includes("avatar") || lowerSrc.includes("emoji") || lowerSrc.startsWith("data:")) return;
      const dims = getImageDimensionsSync(img, src);
      if (dims && (dims.w < MIN_IMAGE_SIZE || dims.h < MIN_IMAGE_SIZE)) return;
      try {
        const urlObj = new URL(src, base);
        src = urlObj.href;
      } catch {
      }
      images.push(src);
    });
    return images;
  }
  function splitSentences(text) {
    const delim = /[。！？.!?]/;
    const sentences = [];
    let current = "";
    for (const ch of text) {
      current += ch;
      if (delim.test(ch)) {
        const trimmed2 = current.trim();
        if (trimmed2) sentences.push(trimmed2);
        current = "";
      }
    }
    const trimmed = current.trim();
    if (trimmed) sentences.push(trimmed);
    return sentences;
  }
  function fetchPage(url) {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { "User-Agent": navigator.userAgent, Referer: window.location.href },
        onload: (response) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, "text/html");
          const paragraphs = parseParagraphs(doc);
          const images = parseImages(doc);
          resolve({ doc, paragraphs, images });
        },
        onerror: () => reject(new Error("Failed to fetch"))
      });
    });
  }
  function buildCard(title) {
    const card = document.createElement("div");
    card.className = "tm-card";
    const header = document.createElement("div");
    header.className = "tm-card__header";
    const hTitle = document.createElement("div");
    hTitle.className = "tm-card__title";
    hTitle.textContent = title;
    const actions = document.createElement("div");
    actions.className = "tm-card__actions";
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "tm-btn";
    toggleBtn.textContent = "折りたたむ";
    actions.appendChild(toggleBtn);
    header.appendChild(hTitle);
    header.appendChild(actions);
    const content = document.createElement("div");
    content.className = "tm-card__content";
    content.textContent = "記事を読み込み中...";
    const images = document.createElement("div");
    images.className = "tm-card__images";
    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(images);
    toggleBtn.addEventListener("click", () => {
      const hidden = content.style.display === "none";
      content.style.display = hidden ? "" : "none";
      images.style.display = hidden ? "" : "none";
      toggleBtn.textContent = hidden ? "折りたたむ" : "展開する";
    });
    return { root: card, content, images, toggleBtn };
  }
  const LOAD_STATE = {
    PENDING: "pending",
    LOADING: "loading",
    LOADED: "loaded",
    ERROR: "error"
  };
  async function loadArticleContent(card, link, content, images, lowerQuery, query) {
    card.dataset.loadState = LOAD_STATE.LOADING;
    try {
      const urlObj = new URL(link.href, window.location.href);
      const baseUrl = `${urlObj.origin}${urlObj.pathname}`;
      const firstPage = await fetchPage(link.href);
      let allParagraphs = firstPage.paragraphs.slice();
      let allImages = firstPage.images.slice();
      let maxPage = 1;
      const pageNumbers = new Set();
      const anchors = Array.from(firstPage.doc.querySelectorAll('a[href*="?page="]'));
      anchors.forEach((a) => {
        const match = a.href.match(/\?page=(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!Number.isNaN(num)) pageNumbers.add(num);
        }
      });
      if (pageNumbers.size > 0) maxPage = Math.max(...Array.from(pageNumbers));
      if (maxPage > 1) {
        for (let i = 2; i <= maxPage; i += 1) {
          const pageUrl = `${baseUrl}?page=${i}`;
          try {
            const res = await fetchPage(pageUrl);
            allParagraphs = allParagraphs.concat(res.paragraphs);
            allImages = allImages.concat(res.images);
          } catch {
          }
        }
      }
      allImages = Array.from(new Set(allImages));
      const frag = document.createDocumentFragment();
      const orderedSentences = [];
      allParagraphs.forEach((paragraph) => {
        const sentences = splitSentences(paragraph);
        sentences.forEach((s) => orderedSentences.push(s));
      });
      orderedSentences.forEach((sentence) => {
        const pNode = document.createElement("p");
        const lowerText = sentence.toLowerCase();
        if (lowerText.includes(lowerQuery)) {
          const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const reg = new RegExp(escaped, "gi");
          pNode.innerHTML = sentence.replace(reg, (m) => `<span class="tm-highlight">${m}</span>`);
        } else {
          pNode.textContent = sentence;
        }
        frag.appendChild(pNode);
      });
      content.innerHTML = "";
      content.appendChild(frag);
      images.innerHTML = "";
      if (allImages.length > 0) {
        const grid = document.createElement("div");
        grid.className = "tm-image-grid";
        allImages.forEach((src) => {
          const a = document.createElement("a");
          a.href = src;
          a.target = "_blank";
          const img = document.createElement("img");
          img.src = src;
          img.loading = "lazy";
          img.className = "tm-thumb";
          a.appendChild(img);
          grid.appendChild(a);
        });
        images.appendChild(grid);
      } else {
        const noImg = document.createElement("p");
        noImg.textContent = "この記事には画像が含まれていません。";
        images.appendChild(noImg);
      }
      card.dataset.loadState = LOAD_STATE.LOADED;
    } catch {
      content.textContent = "記事の読み込みに失敗しました。";
      card.dataset.loadState = LOAD_STATE.ERROR;
    }
  }
  (() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("p") ?? "";
    if (!query) return;
    const lowerQuery = query.toLowerCase();
    const articleAnchors = Array.from(document.querySelectorAll('#yjnMain a[href*="/articles/"]'));
    const articleLinks = articleAnchors.filter((link, index, array) => array.findIndex((l) => l.href === link.href) === index);
    if (articleLinks.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            if (card.dataset.loadState === LOAD_STATE.PENDING) {
              const link = card.dataset.href ? document.querySelector(`a[href="${card.dataset.href}"]`) : null;
              const content = card.querySelector(".tm-card__content");
              const images = card.querySelector(".tm-card__images");
              if (link && content && images) {
                loadArticleContent(card, link, content, images, lowerQuery, query);
              }
            }
          }
        });
      },
      { rootMargin: "100px" }
);
    articleLinks.forEach((link) => {
      const title = link.textContent?.trim() || link.href;
      const { root } = buildCard(title);
      root.dataset.href = link.href;
      root.dataset.loadState = LOAD_STATE.PENDING;
      link.parentElement?.appendChild(root);
      observer.observe(root);
    });
    let currentHighlight = null;
    const isEditableElement = (target) => {
      if (!(target instanceof HTMLElement)) return false;
      return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
    };
    const navigateGlobal = (direction) => {
      const allHighlights = Array.from(document.querySelectorAll(".tm-highlight"));
      if (allHighlights.length === 0) {
        const pendingCard = document.querySelector('.tm-card[data-load-state="pending"]');
        if (pendingCard) {
          pendingCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      allHighlights.forEach((el) => el.classList.remove("tm-highlight--active"));
      let currentIndex = currentHighlight ? allHighlights.indexOf(currentHighlight) : -1;
      if (currentIndex === -1) {
        currentIndex = direction === "next" ? -1 : allHighlights.length;
      }
      let newIndex;
      if (direction === "prev") {
        newIndex = currentIndex <= 0 ? allHighlights.length - 1 : currentIndex - 1;
      } else {
        if (currentIndex >= allHighlights.length - 1) {
          const pendingCard = document.querySelector('.tm-card[data-load-state="pending"]');
          if (pendingCard) {
            pendingCard.scrollIntoView({ behavior: "smooth", block: "center" });
            if (currentHighlight) {
              currentHighlight.classList.add("tm-highlight--active");
            }
            return;
          }
          newIndex = 0;
        } else {
          newIndex = currentIndex + 1;
        }
      }
      currentHighlight = allHighlights[newIndex];
      currentHighlight.classList.add("tm-highlight--active");
      currentHighlight.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    document.addEventListener("keydown", (e) => {
      if (isEditableElement(e.target)) return;
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          e.stopPropagation();
          navigateGlobal("prev");
        } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          e.stopPropagation();
          navigateGlobal("next");
        }
      }
    });
  })();

})();