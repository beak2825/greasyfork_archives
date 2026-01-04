// ==UserScript==
// @name         绅士漫画增强
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  优化显示样式，搜索选中文本
// @author       ssnangua
// @match        https://www.wnacg.com/*
// @match        http://m.wnacg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wnacg.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550033/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/550033/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const WNACG = "/search/?q=%s&f=_all&s=create_time_DESC&syn=yes";
  const EH = "https://exhentai.org/?f_search=%s";
  const ES = "es:%s";
  const SEARCH_BAR = [
    { label: `<img src="https://www.wnacg.com/favicon.ico"> 搜索`, append: "", url: WNACG },
    { label: `<img src="https://www.wnacg.com/favicon.ico" style="filter: hue-rotate(90deg)"> 无修`, append: "修正", url: WNACG },
    { label: `<img src="https://e-hentai.org/favicon.ico"> EH`, append: "", url: EH },
    { label: `<img src="https://www.voidtools.com/favicon.ico"> ES`, append: "", url: ES },
  ];

  // 导航栏添加子菜单
  const NAV = [
    // 首頁
    [],
    // 更新
    [
      { text: "無修正", url: "/search/?q=修正&f=_all&s=create_time_DESC&syn=yes" },
      { text: "全彩", url: "/search/?q=全彩&f=_all&s=create_time_DESC&syn=yes" },
      { text: "完結", url: "/search/?q=完結&f=_all&s=create_time_DESC&syn=yes" },
    ],
    // 同人誌
    [],
    // 單行本
    [],
    // 雜誌&短篇
    [],
    // 韓漫
    [],
    // 排行
    [],
    // 論壇
    [],
  ];
  NAV.forEach((children, index) => {
    if (children.length > 0) {
      const $navItem = document.querySelector(`#album_tabs>li:nth-child(${index + 1})`);
      let $dropDown = $navItem.querySelector(".drop_dwon");
      if (!$dropDown) {
        $dropDown = document.createElement("div");
        $dropDown.classList.add("drop_dwon");
        $dropDown.style.display = "none";
        $navItem.appendChild($dropDown);
      }
      children.forEach(({ url, text }) => {
        const $subItem = document.createElement("div");
        $subItem.classList.add("onemenulayout", "visible-desktop");
        $subItem.innerHTML = `<a href="${url}">${text}</a>`;
        $dropDown.appendChild($subItem);
      });
    }
  });

  const $tags = document.querySelector(".addtags");

  // 上传时间
  const upload = document.querySelector(".info_col")?.textContent.trim();
  if ($tags && upload) {
    const $upload = document.createElement("div");
    $upload.textContent = upload.replace("上傳於", "上傳於：");
    $tags.parentElement.insertBefore($upload, $tags);
  }

  // 标签：包含在标题中的标签加粗显示，按Ctrl键点击搜索无修正
  const title = document.querySelector("h2")?.textContent;
  if (title) {
    document.querySelectorAll("a.tagshow").forEach(($a) => {
      if (title.includes($a.textContent)) {
        $a.classList.add("title-word");
      }
      $a.addEventListener("click", (e) => {
        const url = e.ctrlKey ? WNACG.replace("%s", `${$a.textContent} 修正`) : $a.href;
        window.open(url);
        e.preventDefault();
      });
    });
  }

  // 折叠简介
  const $summary = $tags?.nextElementSibling;
  if ($summary) {
    const $details = document.createElement("details");
    $details.innerHTML = `
      <summary>📝 简介</summary>
      ${$summary.outerHTML}
    `;
    $summary.replaceWith($details);
  }

  // 简化操作按钮
  const $thumb = document.querySelector(".uwthumb");
  if ($thumb) {
    const $thumbBar = document.createElement("div");
    const buttonMap = {
      下拉閱讀: "📖 閱讀",
      加入書架: "📚 書架",
      下載漫畫: "📥 下載",
    };
    $thumb.querySelectorAll("a").forEach(($a) => {
      const label = buttonMap[$a.textContent];
      let $button;
      if ($a.href) {
        $button = createButton(label, () => (location.href = $a.href));
        $button.dataset.href = $a.href;
      } else if ($a.onclick) {
        $button = createButton(label);
        $button.dataset.onclick = $a.getAttribute("onclick");
        $button.onclick = $a.onclick;
      }
      $button.title = $a.textContent;
      $thumbBar.appendChild($button);
      $a.remove();
    });
    $thumb.appendChild($thumbBar);
  }

  // 划词搜索
  let selectedText;

  const $searchBar = document.createElement("div");
  $searchBar.className = "wnacg-search-bar";
  $searchBar.addEventListener("mouseup", (e) => e.stopPropagation());
  document.body.appendChild($searchBar);
  SEARCH_BAR.forEach(({ label, append, url }) => {
    const $button = createButton(label, () => {
      const text = (selectedText + " " + append).trim();
      window.open(url.replace("%s", text));
    });
    $searchBar.appendChild($button);
  });

  window.addEventListener("mouseup", (e) => {
    selectedText = document.getSelection().toString().trim();
    if (selectedText) {
      $searchBar.style.display = "flex";
      const left = Math.min(e.x, window.innerWidth - $searchBar.offsetWidth - 20);
      const top = Math.min(e.y + 20, window.innerHeight - $searchBar.offsetHeight);
      $searchBar.style.left = left + "px";
      $searchBar.style.top = top + "px";
    } else {
      $searchBar.style.display = "none";
    }
  });

  function createButton(label, onClick) {
    const $button = document.createElement("button");
    $button.innerHTML = label;
    if (onClick) $button.addEventListener("click", onClick);
    return $button;
  }

  GM_addStyle(`
    #bread .result {
      display: none;
    }

    .userwrap .asTB {
      height: auto;
    }

    .uwthumb {
      padding-bottom: 10px;
      & img {
        margin-bottom: 10px;
      }
      & button {
        cursor: pointer;
        &+button {
          margin-left: 2px;
        }
      }
    }

    .addtags {
      display: flex;
      flex-flow: row wrap;
      gap: 4px;

      & a {
        margin: 2px 0 !important;
        align-content: center;
      }
    }

    a.tagshow.title-word {
      font-weight: bold;
      border: 1px solid #ccc;

      &:hover {
        background-color: #35a218;
        color: #fff;
      }
    }

    summary {
      margin: 10px 20px 0 0;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
      padding: 0 10px;
      color: #666;
      cursor: pointer;

      &:hover {
        background-color: #35a218;
        color: #fff;
      }

      &+p {
        margin-right: 20px;
        padding: 10px;
        background-color: rgba(241, 241, 241, 0.2);
        border: 1px solid #ccc;
        border-top: none;
      }
    }

    #meiu_float_box>form {
      padding: 10px 20px;
    }

    .wnacg-search-bar {
      display: none;
      position: fixed;
      z-index: 10000;
      padding: 5px;
      background: #CCC;
      border: 1px solid #BBB;

      & button {
        margin: 2px;
        white-space: nowrap;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

        & img {
          width: 16px;
          height: 16px;
          margin-right: 2px;
        }
      }
    }
  `);
})();
