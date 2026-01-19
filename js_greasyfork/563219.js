// ==UserScript==
// @name         ccgo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       CCGo
// @description  CCGO - Get current URL
// @license      ISC
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelquickapp.com
// @match        https://novelquickapp.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563219/ccgo.user.js
// @updateURL https://update.greasyfork.org/scripts/563219/ccgo.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  const styleScss = "@keyframes ccgo-jelly{0%{transform:scale(1)}30%{transform:scale(1.1,.9)}40%{transform:scale(.9,1.1)}50%{transform:scale(1.05,.95)}65%{transform:scale(.98,1.02)}75%{transform:scale(1.02,.98)}to{transform:scale(1)}}@keyframes ccgo-pop-in{0%{opacity:0;transform:translate(-50%,-40%) scale(.8)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}.ccgo-floating-btn{position:fixed;right:20px;top:50%;transform:translateY(-50%);z-index:99998;width:60px;height:60px;border-radius:50px;border:none;background:linear-gradient(135deg,#4facfe,#00f2fe);box-shadow:inset -2px -2px 6px #0000001a,inset 2px 2px 6px #fffc,0 4px 10px #00f2fe66;color:#fff;font-weight:800;font-family:system-ui,-apple-system,sans-serif;font-size:28px;cursor:pointer;-webkit-user-select:none;user-select:none;display:flex;justify-content:center;align-items:center;transition:all .3s cubic-bezier(.25,.8,.25,1)}.ccgo-floating-btn:hover{filter:brightness(1.05);transform:translateY(-2px);box-shadow:inset -2px -2px 8px #0000001a,inset 2px 2px 8px #ffffffe6,0 6px 15px #00f2fe66}.ccgo-floating-btn:active{transform:scale(.95);box-shadow:inset 2px 2px 5px #0000001a}.ccgo-floating-btn:hover{transform:translateY(-50%);filter:brightness(1.1)}.ccgo-floating-btn:active{transform:translateY(-50%) scale(.9)}.ccgo-floating-btn .ccgo-text{pointer-events:none;text-shadow:0 2px 4px rgba(0,0,0,.1)}.ccgo-modal-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#ffffff4d;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);z-index:99999;opacity:0;pointer-events:none;transition:opacity .3s ease}.ccgo-modal-overlay.active{opacity:1;pointer-events:auto}.ccgo-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:320px;background:#fffffff2;border-radius:24px;padding:24px;box-shadow:0 20px 50px #0000001a,0 0 0 1px #ffffff80 inset;text-align:center;font-family:system-ui,-apple-system,sans-serif;opacity:0;pointer-events:none;transition:all .3s cubic-bezier(.34,1.56,.64,1)}.ccgo-modal-overlay.active .ccgo-modal{opacity:1;pointer-events:auto;animation:ccgo-pop-in .4s cubic-bezier(.34,1.56,.64,1) forwards}.ccgo-modal h2{margin:0 0 16px;color:#0087cb;font-size:24px;font-weight:800}.ccgo-modal .url-container{background:#f0f2f5;border-radius:12px;padding:12px;margin-bottom:24px;word-break:break-all;font-size:13px;color:#666;line-height:1.4;border:1px solid rgba(0,0,0,.05);max-height:100px;overflow-y:auto}.ccgo-modal .btn-group{display:flex;justify-content:space-between;gap:12px}.ccgo-modal .btn-group button{flex:1;border:none;padding:12px 0;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s}.ccgo-modal .btn-group button.btn-cancel{background:#f0f2f5;color:#888}.ccgo-modal .btn-group button.btn-cancel:hover{background:#e4e6e9;color:#666}.ccgo-modal .btn-group button.btn-confirm{background:linear-gradient(135deg,#4facfe,#00f2fe);color:#fff;box-shadow:0 4px 10px #ff69b44d}.ccgo-modal .btn-group button.btn-confirm:hover{transform:translateY(-2px);box-shadow:0 6px 15px #ff69b466}.ccgo-modal .btn-group button.btn-confirm:active{transform:scale(.95)}";
  importCSS(styleScss);
  (function() {
    console.log("CCGO script loaded");
    function urlSafeBase64Encode(str) {
      const base64 = btoa(str);
      return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    function createUI() {
      if (document.querySelector(".ccgo-floating-btn")) return;
      const btn = document.createElement("div");
      btn.className = "ccgo-floating-btn";
      btn.title = "CCGo";
      const text = document.createElement("span");
      text.className = "ccgo-text";
      text.textContent = "C";
      btn.appendChild(text);
      document.body.appendChild(btn);
      const overlay = document.createElement("div");
      overlay.className = "ccgo-modal-overlay";
      const modal = document.createElement("div");
      modal.className = "ccgo-modal";
      modal.innerHTML = `
      <h2 id="ccgo-modal-title">CCGo</h2>
      <div class="content-area">
        <div class="url-container" id="ccgo-url-display"></div>
        <div class="error-msg" id="ccgo-error-msg" style="display:none; padding: 10px 0; color: #666; font-size: 15px;"></div>
      </div>
      <div class="btn-group">
        <button class="btn-cancel">取消</button>
        <button class="btn-confirm">前往下载</button>
      </div>
    `;
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      const titleEl = modal.querySelector("#ccgo-modal-title");
      const urlDisplay = modal.querySelector("#ccgo-url-display");
      const errorMsgEl = modal.querySelector("#ccgo-error-msg");
      const btnCancel = modal.querySelector(".btn-cancel");
      const btnConfirm = modal.querySelector(".btn-confirm");
      btn.addEventListener("click", () => {
        const currentUrl = window.location.href;
        const isValid = currentUrl.includes("novelquickapp.com/detail") && currentUrl.includes("series_id=");
        if (isValid) {
          titleEl.textContent = "CCGo";
          urlDisplay.style.display = "block";
          urlDisplay.textContent = currentUrl;
          errorMsgEl.style.display = "none";
          btnConfirm.style.display = "block";
          btnCancel.textContent = "取消";
        } else {
          titleEl.textContent = "提示";
          urlDisplay.style.display = "none";
          errorMsgEl.style.display = "block";
          errorMsgEl.textContent = "请在视频详情页使用";
          btnConfirm.style.display = "none";
          btnCancel.textContent = "知道了";
        }
        overlay.classList.add("active");
      });
      const closeModal = () => {
        overlay.classList.remove("active");
      };
      btnCancel.addEventListener("click", closeModal);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
      });
      btnConfirm.addEventListener("click", () => {
        const currentUrl = window.location.href;
        try {
          const encodedUrl = urlSafeBase64Encode(currentUrl);
          const targetUrl = `https://ccgo.uk/zh/home#${encodedUrl}`;
          const originalText = btnConfirm.textContent;
          btnConfirm.textContent = "正在跳转...";
          window.open(targetUrl, "_blank");
          setTimeout(() => {
            closeModal();
            setTimeout(() => {
              btnConfirm.textContent = originalText;
            }, 300);
          }, 1e3);
        } catch (e) {
          console.error("CCGo: Failed to encode URL", e);
          alert("URL 处理失败，请重试");
        }
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createUI);
    } else {
      createUI();
    }
  })();

})();