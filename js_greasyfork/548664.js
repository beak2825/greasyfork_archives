// ==UserScript==
// @name         老王论坛详情页显示优化
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  折叠次要信息，图片列表和附件列表用表格展示
// @author       ssnangua
// @match        https://laowang.vip/forum.php?mod=forumdisplay&fid=*
// @match        https://laowang.vip/thread-*
// @match        https://laowang.vip/forum.php?mod=viewthread&tid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=laowang.vip
// @grant        GM_addStyle
// @require      https://update.greasyfork.org/scripts/546691/1646687/GM_Preview.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548664/%E8%80%81%E7%8E%8B%E8%AE%BA%E5%9D%9B%E8%AF%A6%E6%83%85%E9%A1%B5%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/548664/%E8%80%81%E7%8E%8B%E8%AE%BA%E5%9D%9B%E8%AF%A6%E6%83%85%E9%A1%B5%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const createFoldIcon = ($foldTarget, storageKey) => {
    let isFold = localStorage.getItem(storageKey) === "true";
    $foldTarget.classList.toggle("is-fold", isFold);

    const $span = document.createElement("span");
    $span.className = "fold-icon";
    $span.innerHTML = `<img src="static/image/common/arw_r.gif">`;
    $span.addEventListener("click", () => {
      isFold = !isFold;
      $foldTarget.classList.toggle("is-fold", isFold);
      localStorage.setItem(storageKey, isFold ? "true" : "false");
    });
    return $span;
  };

  // 折叠：板块说明
  const $deanbkjs = document.querySelector(".deanbkjs");
  if ($deanbkjs) {
    const $deanjstopr = $deanbkjs.querySelector(".deanjstopr");
    const $foldIcon = createFoldIcon($deanbkjs, "fold_deanbkjs");
    $deanjstopr.appendChild($foldIcon);
  }

  // 折叠：帖子信息
  const $typeoption = document.querySelector(".typeoption");
  if ($typeoption) {
    const $caption = $typeoption.querySelector("caption");

    const values = [...$typeoption.querySelectorAll("tr>td:nth-child(2)")]
      .map(($td) => {
        const label = $td.previousElementSibling.textContent;
        const value = $td.textContent.trim();
        if (!value || value === "-" || value === "无") return "";
        return label.includes("解压密码")
          ? `<span class="item-value">解压密码：<a data-copy="${value}" title="点击复制">${value}</a></span>`
          : `<span class="item-value">${value}</span>`;
      })
      .filter(Boolean);
    const $foldInfo = document.createElement("span");
    $foldInfo.className = "fold-info";
    $foldInfo.innerHTML = values.join("");
    $caption.appendChild($foldInfo);

    $foldInfo.addEventListener("click", (e) => {
      const copyText = e.target.dataset.copy;
      if (copyText) {
        navigator.clipboard.writeText(copyText);
        e.target.innerHTML = copyText + "✔️";
        setTimeout(() => (e.target.innerHTML = copyText), 1000);
        e.preventDefault();
      }
    });

    const $foldIcon = createFoldIcon($typeoption, "fold_typeoption");
    $caption.appendChild($foldIcon);
  }

  // 折叠：下载说明
  const $downcon = document.querySelector("#downcon");
  if ($downcon) {
    const $downtitle = $downcon.querySelector(".downtitle");
    const $foldIcon = createFoldIcon($downcon, "fold_downcon");
    $downtitle.appendChild($foldIcon);
  }

  // 优化：附件、预览图列表
  const $pattl = document.querySelector(".pattl");
  if ($pattl) {
    // 附件
    const items = [...$pattl.querySelectorAll(".tattl")]
      .map(($item) => {
        const icon = $item.querySelector("dt>img")?.src;
        const $download = $item.querySelector("dd>p>a");
        const name = $download.textContent;
        const downloadLink = $download.href;
        const onclick = $download.getAttribute("onclick");
        const $$p = [...$item.querySelectorAll("dd>p")];
        const get$p = (text) => $$p.find(($p) => $p.textContent.includes(text));
        const price = get$p("售价")?.textContent.trim().match(/\d+/)?.[0];
        let [size, downloadCount] = get$p("下载次数")?.textContent.trim().split(", 下载次数: ") || [];
        const [, _int, _decimal, _unit] = size?.trim().match(/(\d+)(?:\.)*(\d+)*\s*(.*)/) || [];
        size =
          `<span class="size-int">${_int}</span>` +
          (_decimal ? `<span class="size-decimal">.${_decimal.padEnd(2, "0")}</span>` : "") +
          ` <span class="size-${_unit}">${_unit}</span>`;
        const uploadTime = $item.querySelector("dd>.tip_4>.tip_c>p")?.textContent.replace("上传", "").trim();
        const desc = $item.querySelector("p.xg2")?.textContent.trim();
        return { icon, name, price, size, downloadLink, downloadCount, uploadTime, desc, onclick };
      })
      .filter(({ icon }) => !!icon);
    const attas =
      items.length === 0
        ? ""
        : `<table class="atta-list">
          <thead>
            <tr>
              <th scope="col" width="40"></th>
              <th scope="col">文件名</th>
              <th scope="col" width="60">售价</th>
              <th scope="col" width="80">大小</th>
              <th scope="col" width="60">下载</th>
              <th scope="col" width="120">上传</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                ({ icon, name, price, size, downloadLink, downloadCount, uploadTime, desc, onclick }) => `<tr>
                  <td><img class="file-icon" src="${icon}"></td>
                  <td>
                    ${
                      onclick
                        ? `<a href="${downloadLink}" onclick="${onclick}" title="购买">${name}</a>`
                        : `<a data-href="${downloadLink}" title="下载">${name}</a>`
                    }
                    ${desc ? `<div class="desc">${desc}</div>` : ""}
                  </td>
                  <td>${price ? `<span class="price">${price}</span> 软妹币` : ""}</td>
                  <td>${size}</td>
                  <td>${downloadCount}</td>
                  <td>${uploadTime}</td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>`;

    // 预览图列表
    const srcList = [...$pattl.querySelectorAll("img.zoom")].map(($img) => $img.getAttribute("file")).filter(Boolean);
    const imgs =
      srcList.length === 0
        ? ""
        : `<div class="img-list">
          ${srcList.map((src, i) => `<img src="${src}" data-index="${i}" _onclick="zoom(this, this.src, 0, 0, 0)">`).join("")}
        </div>`;
    const preview = new window.GM_Preview();

    $pattl.innerHTML = attas + imgs;
    $pattl.addEventListener("click", (e) => {
      if (e.target.dataset.href) {
        window.open(e.target.dataset.href);
        e.target.style.opacity = "0.3";
        e.preventDefault();
        e.stopPropagation();
      } else if (e.target.dataset.index) {
        preview.show(srcList, parseInt(e.target.dataset.index));
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  GM_addStyle(`
    :root {
      --th-bg: #fafafa;
      --border: 1px solid #f1f1f1;
      --green: green;
      --blue: blue;
      --color: #444;
      --tag-bg: #fafafa;
    }

    [data-darkreader-scheme="dark"] {
      --th-bg: #2f3130;
      --border: 1px solid #3e4040;
      --green: #81f179;
      --blue: #457fe5;
      --color: #bdb5aa;
      --tag-bg: #242525;
    }

    .fold-icon {
      cursor: pointer;
      &:hover { opacity: 0.7; }
      &>img {
        rotate: 90deg;
        transition: rotate 0.2s;
      }
    }
    .is-fold .fold-icon>img { rotate: -90deg; }

    /* .deanbkjs */

    .deanbkjs .deanfatie {
      right: 25px;
    }

    .is-fold.deanbkjs {
      padding: 5px 10px 0 10px;

      & .deanjscenter {
        display: none;
      }
    }

    .deanbkjs .fold-icon {
      display: block;
      position: absolute;
      right: 0;
      top: 13px;
    }

    /* .typeoption */

    .is-fold.typeoption tbody { display: none; }

    .fold-info {
      font-weight: normal;
      margin-left: 10px;
      display: none;

      & .item-value {
        padding: 2px 8px;
        background: var(--tag-bg);
        border-radius: 4px;

        &+.item-value {
          margin-left: 4px;
        }

        & [data-copy] {
          cursor: pointer;
        }
      }
    }
    .is-fold.typeoption .fold-info { display: inline; }

    .typeoption .fold-icon {
      float: right;
      margin-top: 5px;
    }

    /* #downcon */
    .downtitle {
      position: relative;

      & .fold-icon {
        position: absolute;
        right: 30px;
        top: 18px;
      }
    }
    .is-fold .info-section {
      display: none;
    }

    /* .pattl */
    .pattl {
      & .atta-list+.img-list {
        margin-top: 10px;
      }

      & table {
        border-collapse: collapse;
      }
      & table, & tr, & th, & td {
        border: var(--border);
      }
      & th, & td {
        padding: 4px 8px;
      }
      & th {
        background: var(--th-bg);
        text-align: center;
        font-weight: bold;
      }
      & tr>td:nth-child(2) {
        text-align: left;
      }
      & tr>td:nth-child(4) {
        text-align: right;
      }

      & .file-icon {
        width: 30px;
        height: auto;
        border: none;
      }

      & [data-href] {
        cursor: pointer;
      }
      & [onclick] {
        cursor: pointer;
        color: var(--color);
        &:hover {
          opacity: 0.7;
        }
      }
      & .desc {
        opacity: 0.5;
      }

      & .price {
        font-weight: bold;
        color: #F26C4F;
      }

      & .size-int {
      }
      & .size-decimal {
        opacity: 0.3;
      }
      & .size-KB {
        color: var(--green);
      }
      & .size-MB {
        color: var(--blue);
      }

      & .img-list img {
        width: 200px;
        height: 200px;
        object-fit: contain;
        border: var(--border);
        margin: 5px;
        cursor: pointer;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  `);
})();
