// ==UserScript==
// @name         看漫畫&漫畫人 手機版 - 新增頁數跳轉功能
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在漫畫閱讀頁面(Manhuagui & manhuaren)，將右上角頁碼改為下拉選單，選取即跳轉到指定頁。
// @author       shanlan(ChatGPT GPT-5)
// @match        https://m.manhuagui.com/comic/*
// @match        https://www.manhuaren.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549625/%E7%9C%8B%E6%BC%AB%E7%95%AB%E6%BC%AB%E7%95%AB%E4%BA%BA%20%E6%89%8B%E6%A9%9F%E7%89%88%20-%20%E6%96%B0%E5%A2%9E%E9%A0%81%E6%95%B8%E8%B7%B3%E8%BD%89%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/549625/%E7%9C%8B%E6%BC%AB%E7%95%AB%E6%BC%AB%E7%95%AB%E4%BA%BA%20%E6%89%8B%E6%A9%9F%E7%89%88%20-%20%E6%96%B0%E5%A2%9E%E9%A0%81%E6%95%B8%E8%B7%B3%E8%BD%89%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = "appearance:none;-webkit-appearance:none;-moz-appearance:none;font-size:13px;line-height:1;height:20px;vertical-align:middle;padding:0 4px;margin-right:2px;border:1px solid #444;border-radius:3px;background:#000;color:#fff;background-image:none;";

  if (location.hostname.indexOf("manhuaren.com") !== -1) {
    const t = document.querySelector(".view-fix-top-bar-title");
    const lb = document.querySelector("#lbcurrentpage");

    const total = (() => {
      if (Array.isArray(window.newImgs) && window.newImgs.length) return window.newImgs.length;
      if (t) {
        const m = t.textContent.match(/\/\s*(\d+)\s*$/);
        if (m) return +m[1];
      }
      return 0;
    })();
    if (!total) return;

    const getImgPage = () => {
      const img = document.querySelector("#cp_img img");
      if (!img) return NaN;
      const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
      const m = src.match(/\/(\d+)_\d+\.(?:jpg|jpeg|png|webp)/i);
      return m ? +m[1] : NaN;
    };

    const getURLPage = (tot) => {
      const m = location.pathname.match(/^\/m(\d+)(?:-(?:p(\d+)|end))?\/?$/);
      if (!m) return NaN;
      if (m[2]) return +m[2];
      if (m[0].includes("-end") && tot) return tot;
      return NaN;
    };

    let cur = ((lb && parseInt(lb.textContent, 10)) || getURLPage(total) || getImgPage() || 1) | 0;

    const sel = document.createElement("select");
    sel.style.cssText = css;
    for (let i = 1; i <= total; i++) sel.add(new Option(i, i));
    sel.value = String(cur);
    if (lb && lb.parentNode) lb.parentNode.insertBefore(sel, lb);
    if (lb) lb.style.display = "none";

    const ensureImg = () => {
      let img = document.querySelector("#cp_img img");
      if (!img) {
        const box = document.querySelector("#cp_img");
        if (!box) return null;
        img = document.createElement("img");
        img.classList.add("lazy");
        box.innerHTML = "";
        box.appendChild(img);
      }
      return img;
    };

    const syncVars = (v) => {
      ["DM5_CURRENT_PAGE", "curPage", "currentPage", "page", "nowPage", "__mh_curPage", "viewPage", "readPage"].forEach(k => {
        if (typeof window[k] !== "undefined") window[k] = v;
      });
      const dm5 = window.DM5, cm = window.COMIC;
      if (dm5 && typeof dm5 === "object") {
        if ("current" in dm5) dm5.current = v;
        if ("page" in dm5) dm5.page = v;
        if ("currentPage" in dm5) dm5.currentPage = v;
      }
      if (cm && typeof cm === "object") {
        if ("current" in cm) cm.current = v;
        if ("page" in cm) cm.page = v;
      }
    };

    const set = (v) => {
      v = Math.max(1, Math.min(total, v | 0));
      if (Array.isArray(window.newImgs) && window.newImgs[v - 1]) {
        const url = window.newImgs[v - 1];
        const img = ensureImg();
        if (img) {
          img.src = url;
          img.setAttribute("data-src", url);
          if (typeof window.loadImg === "function") { try { window.loadImg(img); } catch (e) {} }
        }
      }
      if (lb) lb.textContent = String(v);
      sel.value = String(v);
      cur = v;
      syncVars(v);
    };

    const showNext = () => {
      const d = document.querySelector(".winnextchapter");
      if (d) d.style.display = "block";
      else if (typeof window.pushHistory === "function" && window.DM5_CHAPTERENDURL) window.pushHistory(window.DM5_CHAPTERENDURL);
    };

    sel.onchange = () => set(+sel.value);

    window.nextPage = function () { if (cur < total) set(cur + 1); else showNext(); return false; };
    window.prevPage = function () { set(cur - 1); return false; };
    window.goPage = function (p) { set(+p || 1); return false; };

    const bind = (el, dir) => {
      el.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (dir < 0) set(cur - 1);
        else if (cur < total) set(cur + 1);
        else showNext();
        return false;
      };
      if ("href" in el) el.href = "javascript:void(0);";
    };

    const hijack = () => {
      document.querySelectorAll('a[href*="prevPage()"],[onclick*="prevPage()"]').forEach(el => bind(el, -1));
      document.querySelectorAll('a[href*="nextPage()"],[onclick*="nextPage()"]').forEach(el => bind(el, 1));
      document.querySelectorAll('a,button').forEach(el => {
        const tx = (el.textContent || "").trim();
        if (tx === '上一页' || tx === '上一頁') bind(el, -1);
        else if (tx === '下一页' || tx === '下一頁') bind(el, 1);
      });
    };

    hijack();
    new MutationObserver(hijack).observe(document.body, { childList: true, subtree: true });

    const box = document.getElementById("cp_img");
    if (box) {
      box.addEventListener("click", (e) => {
        if (e.target.tagName && e.target.tagName.toLowerCase() === "select") return;
        const r = box.getBoundingClientRect(), x = e.clientX - r.left;
        if (x < r.width / 3) { set(cur - 1); e.stopPropagation(); e.preventDefault(); }
        else if (x > r.width * 2 / 3) { if (cur < total) set(cur + 1); else showNext(); e.stopPropagation(); e.preventDefault(); }
      }, true);
    }

    const sync = () => {
      let v = (lb && parseInt(lb.textContent, 10)) || getImgPage() || cur;
      v = Math.max(1, Math.min(total, v | 0));
      const t2 = String(v);
      if (sel.value !== t2) sel.value = t2;
      if (lb && lb.textContent !== t2) lb.textContent = t2;
      cur = v;
      syncVars(v);
    };

    const img = document.querySelector("#cp_img img");
    if (img) new MutationObserver(sync).observe(img, { attributes: true, attributeFilter: ["src", "data-src"] });
    if (box) new MutationObserver(sync).observe(box, { childList: true, subtree: true, attributes: true });
    setInterval(sync, 300);
    set(cur);
    sync();
    setTimeout(hijack, 1000);
    setTimeout(hijack, 3000);
    return;
  }

  const $ = s => document.querySelector(s);
  const init = () => {
    const n = $('#pageNo'), w = $('.manga-page');
    if (!n || !w) return;
    const m = w.textContent.match(/\/\s*(\d+)\s*P/i);
    const total = m ? +m[1] : 0;
    if (!total) return;
    const gh = () => { const m = location.hash.match(/(?:^|#|&)p=(\d+)/); return m ? +m[1] : NaN; };
    const h = gh(), cur = Number.isInteger(h) ? h : (parseInt(n.textContent) || 1);
    const s = document.createElement('select');
    s.style.cssText = css;
    for (let i = 1; i <= total; i++) s.add(new Option(i, i));
    s.value = cur;
    s.onchange = () => {
      let v = Math.max(1, Math.min(total, +s.value));
      n.textContent = v;
      const nh = '#p=' + v;
      if (location.hash === nh) dispatchEvent(new HashChangeEvent('hashchange'));
      else location.hash = nh;
    };
    n.before(s);
    n.style.display = 'none';
    const sync = () => {
      const x = gh();
      if (!Number.isInteger(x)) return;
      const v = Math.max(1, Math.min(total, x)), t = String(v);
      if (s.value !== t) s.value = t;
      if (n.textContent !== t) n.textContent = t;
    };
    addEventListener('hashchange', sync);
    sync();
  };

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();