// ==UserScript==
// @name         JavBus
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  样式优化，便捷操作
// @author       ssnangua
// @match        https://www.javbus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javbus.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549823/JavBus.user.js
// @updateURL https://update.greasyfork.org/scripts/549823/JavBus.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**********************************************/
  /*                   列表页                   */
  /**********************************************/

  if (document.querySelector("#waterfall")) {
    const $items = [...document.querySelectorAll("#waterfall>.item")];

    $items.forEach(($item) => {
      // 信息区域点击无效化
      $item.querySelector(".photo-info").onclick = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };

      // 番号点击本地搜索
      const $dates = $item.querySelectorAll("date");
      if ($dates.length > 1) {
        const $id = $dates[0];
        $id.dataset.es = $id.textContent.trim();
        $id.onclick = (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          window.open(`es:${e.target.dataset.es}`);
        };
      }
    });

    const keywords =
      /巨尻|美尻|尻振|尻|杭打ち騎乗位|杭打|騎乗位|騎乗|淫語|淫らな言/g;
    function matchKeywords() {
      $items.map(($item) => {
        if ($item.tags) return;
        const title = $item.querySelector(".x-title").textContent.trim();
        const tags = [...new Set(title.match(keywords))];
        $item.tags = tags;
        if (tags.length > 0) {
          $item.querySelector(".movie-box").classList.add("has-kw");
          const $tagBox = document.createElement("div");
          $tagBox.classList.add("kw-tag-box");
          tags.forEach((tag) => $tagBox.appendChild(createTag(tag)));
          $item.appendChild($tagBox);
        }
      });
    }
    matchKeywords();

    const observer = new MutationObserver(matchKeywords);
    observer.observe(document.querySelector("#waterfall"), { childList: true });

    function createTag(label) {
      const $tag = document.createElement("span");
      $tag.textContent = label;
      $tag.classList.add("kw-tag");
      return $tag;
    }

    GM_addStyle(`
      .movie-box {
        -webkit-user-drag: none;
        & .photo-info {
          cursor: auto;
          & .x-btn {
            cursor: default;
          }
          & [title] {
            user-select: text;
          }
          & [data-es] {
            cursor: pointer;
            &:hover {
              text-decoration: underline !important;
            }
          }
        }
      }

      .movie-box.has-kw {
        background: pink;
      }
      .kw-tag-box {
        position: absolute;
        top: 12px;
        left: 10px;
      }
      .kw-tag {
        background: deeppink;
        padding: 4px 10px;
        border-radius: 0;
        color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
      }
      .kw-tag + .kw-tag {
        margin-left: 5px;
      }
    `);
  }

  /**********************************************/
  /*                   详情页                   */
  /**********************************************/
  if (document.querySelector("h3")) {
    // 移除JavScript添加的复制按钮
    document.querySelector("h3 a")?.remove();
    document.querySelector('span[style="color:#CC0000;"] a')?.remove();

    const keyMap = {
      識別碼: "id",
      發行日期: "date",
      長度: "length",
      導演: "director",
      製作商: "studio",
      發行商: "label",
      類別: "genre",
      演員: "idols",
    };
    const info = {
      title: document.querySelector("h3")?.textContent,
    };
    document.querySelectorAll(".info>p").forEach(($p) => {
      let [keyKey, value] = $p.textContent
        .split(":")
        .map((text) => text.trim());
      const key = keyMap[keyKey];
      if (key === "genre" || key === "idols") {
        value = [...$p.nextElementSibling.querySelectorAll("a")]
          .map(($a) => $a.textContent)
          .filter(Boolean);
      }
      if (key) info[key] = value;

      if (key === "id") {
        const $idActions = document.createElement("div");
        $p.appendChild($idActions);
        $idActions.appendChild(createCopyButton(value));
        $idActions.appendChild(
          createButton("移花宫", () =>
            window.open(`https://yhg007.com/search-${value}-0-0-1.html`)
          )
        );
        $idActions.appendChild(
          createButton("移花宫-U", () =>
            window.open(`https://yhg007.com/search-${value}-U-0-0-1.html`)
          )
        );
        $idActions.appendChild(
          createButton("ES", () => window.open(`es:${value}`))
        );
      }
    });
    // console.log(info);

    const $titleActions = document.createElement("span");
    $titleActions.style.marginLeft = "5px";
    document.querySelector("h3").appendChild($titleActions);
    $titleActions.appendChild(createCopyButton(info.title));
    $titleActions.appendChild(
      createButton("图片", () =>
        window.open(`https://www.google.co.jp/search?tbm=isch&q=${info.title}`)
      )
    );

    function createButton(label, onClick) {
      const $button = document.createElement("button");
      $button.className = "jb-button";
      $button.textContent = label;
      $button.addEventListener("click", onClick);
      return $button;
    }

    function createCopyButton(text) {
      return createButton("复制", async (e) => {
        await navigator.clipboard.writeText(text);
        e.target.textContent = "复制✔️";
        setTimeout(() => (e.target.textContent = "复制"), 1000);
      });
    }

    // 预览图显示大图
    document.querySelectorAll("a.sample-box").forEach(($a) => {
      const $img = $a.querySelector("img");
      if ($img) $img.src = $a.href;
    });

    GM_addStyle(`
    .movie .info a,
    .movie .info .glyphicon-plus {
      &:hover { color: orangered; }
    }

    .jb-button {
      font-size: 14px;
      line-height: 14px;

      &+.jb-button {
        margin-left: 5px;
      }
    }

    .sample-box img {
      object-fit: contain;
    }
  `);
  }
})();
