// ==UserScript==
// @name         2048优化
// @namespace    http://tampermonkey.net/
// @version      2025-12-28-v3
// @description  图片列表、划词搜索
// @author       ssnangua
// @match        https://hjd2048.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hjd2048.com
// @require      https://update.greasyfork.org/scripts/546691/1646687/GM_Preview.js
// @require      https://update.greasyfork.org/scripts/555706/1694621/GM_SelectToSearch.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560408/2048%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560408/2048%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  const preview = new window.GM_Preview();

  // 图片列表
  const $read_tpc = document.querySelector("#read_tpc");
  const srcList = Array.from($read_tpc.querySelectorAll("img")).map(($img, i) => {
    $img.dataset.index = i;
    return $img.dataset.original || $img.src;
  });
  $read_tpc.addEventListener("click", (e) => {
    if (e.target.dataset.index) {
      preview.show(srcList, parseInt(e.target.dataset.index));
    }
  });
  // 去除空节点
  $read_tpc.querySelectorAll(".c").forEach(($c) => {
    if (!$c.innerHTML.trim()) $c.remove();
  });

  // 搜索页
  const keyword = document.querySelector(`[placeholder="请输入关键词"]`)?.value;
  if (keyword) {
    // 标题
    document.title = `搜索：${keyword} - ${document.title}`;
    // 预览图
    const $tbody = document.querySelector("tbody:has(.search-img)");
    if ($tbody) {
      $tbody.addEventListener("click", (e) => {
        if (e.target.dataset.src) {
          const srcList = Array.from(e.target.closest(".search-img-group").querySelectorAll(".search-img")).map(($img) => $img.dataset.src);
          const index = srcList.indexOf(e.target.dataset.src);
          preview.show(srcList, index);
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }
  }

  // 划词搜索
  window.GM_SelectToSearch([
    {
      label: "Google",
      url: `https://www.google.co.jp/search?q=%s`,
    },
    {
      label: "Google图片",
      url: `https://www.google.co.jp/search?tbm=isch&q=%s`,
    },
    {
      label: "国产BT",
      url: `https://gcbt.net/?s=%s`,
    },
    {
      label: "移花宫",
      url: `https://yhg007.com/search-%s-0-0-1.html`,
    },
    {
      label: `<img src="https://www.voidtools.com/favicon.ico"> ES`,
      url: "es:%s",
    },
  ]);

  // 去广告
  document.querySelectorAll("#head, .recs-wrapper, #subject_tpc, .nav-container").forEach(($el) => {
    while ($el.nextSibling?.tagName === "BR") {
      $el.nextSibling.remove();
    }
    $el.remove();
  });

  // 滚动到顶部／滚动到底部
  const wrapButton = (s) => {
    const subBtns = document.querySelectorAll(s);
    if (!subBtns.length) return;
    const $btn = document.createElement("div");
    $btn.classList.add("wrap-btn");
    $btn.onclick = () => subBtns[0].click();
    subBtns[0].parentElement.insertBefore($btn, subBtns[0]);
    subBtns.forEach(($subBtn) => $btn.appendChild($subBtn));
  };
  wrapButton(".btnTop");
  wrapButton(".btnBottom");

  GM_addStyle(`
    .colVideoList {
      & img {
        object-fit: contain !important;
      }
    }

    /* 搜索页：搜索结果列表预览图可交互 */
    .lazyimg.search-img {
      object-fit: contain !important;
      cursor: pointer;

      &:hover {
        opacity: 0.7;
      }
    }

    /* 详情页：图片列表 */
    #read_tpc img {
      width: 200px !important;
      height: 200px !important;
      object-fit: contain;
      border: 1px solid #ccc;
      margin: 5px;
      cursor: pointer;

      &:hover {
        opacity: 0.7;
      }
    }
    /* 详情页：图片间不换行 */
    #read_tpc .att_img:has(img),
    #read_tpc ignore_js_op:has(img) {
      & + br {
        display: none;
      }
    }

    .wrap-btn {
      background: #fff;
      border: 1px solid #e0e3ea;
      padding: 5px;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background: #e5e7eb;
      }

      & * {
        pointer-events: none;
      }
      & > div:has(img) {
        display: flex;
      }
    }
  `);
})();
