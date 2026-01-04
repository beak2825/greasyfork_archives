// ==UserScript==
// @name         绅士漫画列表增强
// @namespace    http://tampermonkey.net/
// @version      2025-11-03
// @description  列表显示优化
// @author       ssnangua
// @match        https://www.wnacg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wnacg.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554906/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E5%88%97%E8%A1%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/554906/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E5%88%97%E8%A1%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const bread = document.querySelector(".bread");
  if (bread) {
    const tag = bread.textContent.trim().match(/標籤：.*/)?.[0];
    if (tag) document.title = tag + " - 紳士漫畫-專註分享漢化本子|邪惡漫畫";
  }

  const dl = document.querySelector(".download_filename");
  if (dl) {
    const [_, name, ext] = dl.textContent.match(/(.*?)(.zip)/);
    dl.innerHTML = `<a href="#">${name}</a>${ext}`;
    dl.querySelector("a").onclick = (e) => {
      navigator.clipboard.writeText(name);
      e.target.textContent = `✔️${name}`;
      setTimeout(() => {
        e.target.textContent = `${name}`;
      }, 1000);
      e.preventDefault();
    };
  }

  document.querySelectorAll("li.gallary_item").forEach((li) => {
    const title = li.querySelector(".title");
    title.innerHTML = title.textContent;

    const info = li.querySelector(".info_col");
    const pages = parseInt(info.textContent.match(/\d+(?=張)/g)?.[0]);
    if (pages > 100) {
      li.classList.add("gallery-100");
      const bg = document.createElement("div");
      bg.className = "gallery-100-bg";
      li.appendChild(bg);
    }
  });

  GM_addStyle(`
        li.gallery-100 {
            position: relative;
            & .pic_box, & .info {
                z-index: 1;
                position: relative;
            }
        }
        li.gallery-100 .gallery-100-bg {
            z-index: 0;
            position: absolute;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 10px;
            top: 10px;
            left: -5px;
            right: 15px;
            bottom: 10px;
        }
    `);
})();
