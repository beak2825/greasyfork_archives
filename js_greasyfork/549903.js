// ==UserScript==
// @name         E绅士列表增强
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  点击标题显示快捷搜索栏，超过100P高亮显示
// @author       ssnangua
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @icon         https://e-hentai.org/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549903/E%E7%BB%85%E5%A3%AB%E5%88%97%E8%A1%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/549903/E%E7%BB%85%E5%A3%AB%E5%88%97%E8%A1%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 导航栏
  const $nb = document.querySelector("#nb");
  if ($nb) {
    const cusItems = {
      GP: "https://e-hentai.org/exchange.php?t=gp",
      HATH: "https://e-hentai.org/exchange.php?t=hath",
      中文无修正: "/?f_search=l%3Achinese%24+other%3Auncensored",
      绅漫无修正: "https://www.wnacg.com/search/?q=修正&f=_all&s=create_time_DESC&syn=yes",
    };
    for (let key in cusItems) {
      const $div = document.createElement("div");
      $div.innerHTML = `<a href="${cusItems[key]}">${key}</a>`;
      $nb.appendChild($div);
    }
  }

  // 点击标题显示快捷搜索栏
  const $gmSearchBar = document.querySelector("gm-search-bar");
  if ($gmSearchBar) {
    document.querySelectorAll("a>.gl4t").forEach(($title) => {
      const text = $title.textContent;
      $title.parentElement.addEventListener("click", (e) => {
        $gmSearchBar.show(text);
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }

  // 超过100P高亮显示
  document.querySelectorAll(".gl5t>div:nth-child(2)>div:nth-child(2)").forEach(($pages) => {
    if ($pages.textContent.match(/\d+/)?.[0] > 100) {
      $pages.closest(".gl1t").style.backgroundColor = location.host === "exhentai.org" ? "purple" : "pink";
    }
  });
})();
