// ==UserScript==
// @name         Pinterest One-Click Downloader (2025 Fix)
// @namespace    https://theselfishmeme.co.uk/
// @version      2.1
// @description  Thêm nút tải ảnh trực tiếp trên Pinterest - hoạt động với giao diện mới 2025 (feed, board, tìm kiếm, trang pin).
// @author       Selfish Meme + ChatGPT
// @match        https://*.pinterest.*/*
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552447/Pinterest%20One-Click%20Downloader%20%282025%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552447/Pinterest%20One-Click%20Downloader%20%282025%20Fix%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BTN_CLASS = "pin-dl-btn";

  function createBtn() {
    const btn = document.createElement("button");
    btn.textContent = "⬇ Download";
    btn.className = BTN_CLASS;
    Object.assign(btn.style, {
      position: "absolute",
      right: "8px",
      bottom: "8px",
      padding: "5px 9px",
      fontSize: "12px",
      background: "rgba(0,0,0,0.7)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      zIndex: 9999,
      display: "none",
    });
    btn.addEventListener("mouseenter", () => (btn.style.background = "rgba(0,0,0,0.9)"));
    btn.addEventListener("mouseleave", () => (btn.style.background = "rgba(0,0,0,0.7)"));
    return btn;
  }

  function getImageUrl(el) {
    // tìm ảnh từ phần tử hiện tại hoặc con
    const img = el.querySelector("img[srcset]") || el.querySelector("img");
    if (!img) return null;

    // lấy ảnh lớn nhất từ srcset nếu có
    const srcset = img.getAttribute("srcset");
    if (srcset) {
      const biggest = srcset
        .split(",")
        .map((s) => s.trim().split(" ")[0])
        .pop();
      return biggest;
    }

    return img.currentSrc || img.src;
  }

  function enhanceCard(card) {
    if (card.querySelector(`.${BTN_CLASS}`)) return;

    const btn = createBtn();
    card.style.position = "relative";
    card.appendChild(btn);

    const imgUrl = () => getImageUrl(card);
    if (!imgUrl()) return;

    // hover card -> show nút
    card.addEventListener("mouseenter", () => (btn.style.display = "block"));
    card.addEventListener("mouseleave", () => (btn.style.display = "none"));

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const url = imgUrl();
      if (!url) return alert("Không tìm thấy ảnh để tải.");
      const fileName = "pinterest_" + Date.now() + ".jpg";
      if (typeof GM_download === "function") {
        GM_download({ url, name: fileName, saveAs: false });
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
      }
    });
  }

  // theo dõi ảnh Pinterest render động
  const observer = new MutationObserver(() => {
    const imgs = document.querySelectorAll('div[data-test-id="pin"] img, a[href*="/pin/"] img');
    imgs.forEach((img) => {
      const card = img.closest("div, a");
      if (card) enhanceCard(card);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // quét ban đầu
  setTimeout(() => {
    const imgs = document.querySelectorAll('div[data-test-id="pin"] img, a[href*="/pin/"] img');
    imgs.forEach((img) => {
      const card = img.closest("div, a");
      if (card) enhanceCard(card);
    });
  }, 1500);
})();
