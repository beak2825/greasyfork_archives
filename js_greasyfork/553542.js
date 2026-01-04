// ==UserScript==
// @name         微博一键拉黑
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  一键拉黑微博用户。在博主、转发者和评论者的用户名旁显示拉黑按钮。
// @author       Moran Fong
// @match        https://weibo.com/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/553542/%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/553542/%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
  
    GM_addStyle(`
      .weibo-block-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 6px;
        padding: 1px 6px;
        font-size: 12px;
        border-radius: 6px;
        background-color: rgba(255, 77, 79, 0.15);
        color: #ff4d4f;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        vertical-align: middle;
      }
      .weibo-block-btn:hover {
        background-color: rgba(255, 77, 79, 0.25);
      }
      .weibo-block-btn.blocked {
        background-color: rgba(82, 196, 26, 0.15);
        color: #52c41a;
        cursor: default;
      }
      .weibo-block-btn.loading {
        opacity: 0.6;
        cursor: wait;
      }
      @media (prefers-color-scheme: dark) {
        .weibo-block-btn {
          background-color: rgba(255, 99, 99, 0.2);
          color: #ff7875;
        }
        .weibo-block-btn:hover {
          background-color: rgba(255, 99, 99, 0.35);
        }
      }
    `);
  
    const BLOCK_URL = "https://weibo.com/ajax/statuses/filterUser";
    let myUid = "";
  
    try {
        if (window.$CONFIG && window.$CONFIG['uid']) {
            myUid = window.$CONFIG['uid'];
        } else {
            myUid = document.cookie.match(/SUBP=.*?:(\d+);/)?.[1] || "";
        }
    } catch (e) {
        console.error("[weibo-block] Error getting myUid:", e);
        myUid = document.cookie.match(/SUBP=.*?:(\d+);/)?.[1] || "";
    }
  
    function getXsrfToken() {
      return document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || "";
    }
  
    async function blockUser(uid, btn) {
      btn.textContent = "处理中...";
      btn.classList.add("loading");
      try {
        const res = await fetch(BLOCK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-xsrf-token": getXsrfToken(),
            "x-requested-with": "XMLHttpRequest",
          },
          body: JSON.stringify({
            uid: uid,
            status: 1,
            interact: 1,
            follow: 1,
          }),
        });
        const data = await res.json();
        if (data.ok === 1 && data.result === "true") {
          btn.textContent = "已拉黑";
          btn.classList.add("blocked");
        } else {
          btn.textContent = "失败";
          btn.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
        }
      } catch (err) {
        console.error("[weibo-block] Request failed:", err);
        btn.textContent = "出错";
      } finally {
        btn.classList.remove("loading");
      }
    }
  
    function injectButtons() {
      const nameNodes = document.querySelectorAll(
        'a[href*="/u/"]:not([data-block-added])'
      );
  
      nameNodes.forEach(a => {
        a.setAttribute("data-block-added", "true");
  
        if (a.innerText.trim() === '' && a.querySelector('img')) {
          return;
        }
  
        const uidMatch = a.href.match(/\/u\/(\d+)/);
        if (!uidMatch) return;
        const uid = uidMatch[1];
  
        let prevLink = a.previousElementSibling;
        if (prevLink && prevLink.classList.contains('weibo-block-btn')) {
          prevLink = prevLink.previousElementSibling;
        }
  
        if (prevLink && prevLink.tagName === 'A' && prevLink.href && prevLink.href.includes(`/u/${uid}`)) {
          return;
        }
  
        if (myUid && uid === myUid) {
          return;
        }
  
        const inCommentText = a.closest('div[data-comment-id] span[class*="cmt_text"]');
        if (inCommentText) {
          return;
        }
  
        const btn = document.createElement("span");
        btn.textContent = "拉黑";
        btn.className = "weibo-block-btn";
        btn.addEventListener("click", e => {
          e.preventDefault();
          e.stopPropagation();
          if (!btn.classList.contains("blocked") && !btn.classList.contains("loading")) {
            blockUser(uid, btn);
          }
        });
  
        a.insertAdjacentElement("afterend", btn);
      });
    }
  
    const observer = new MutationObserver(() => injectButtons());
    observer.observe(document.body, { childList: true, subtree: true });
  
    injectButtons();
  
  })();
  